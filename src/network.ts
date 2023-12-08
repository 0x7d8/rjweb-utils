import * as net from "net"
import * as fs from "fs"
import { as } from "."

const inspectSymbol = Symbol.for('nodejs.util.inspect.custom')

export const MAX_IPV4_LONG = 4294967295,
	MAX_IPV6_LONG = BigInt('340282366920938463463374607431768211455')

/**
 * A Respresentation of a Subnet
 * @example
 * ```
 * import { network } from "@rjweb/utils"
 * 
 * const subnet = new network.Subnet('127.1/32')
 * subnet.type // 4
 * 
 * subnet.size() // 1n
 * subnet.first() // <IPAddress>
 * subnet.last() // <IPAddress>
 * 
 * for (const ip of subnet) {
 *   console.log(ip.long())
 * }
 * ```
 * @since 1.7.0
*/ export class Subnet<Type extends 4 | 6 = 4 | 6> {
	private iFirst: IPAddress
	private type: 4 | 6

	/**
	 * Create a new Subnet
	 * @example
	 * ```
	 * import { network } from "@rjweb/utils"
	 * 
	 * const subnet = new network.Subnet('127.1/32')
	 * subnet.type // 4
	 * 
	 * subnet.size() // 1n
	 * subnet.first() // <IPAddress>
	 * subnet.last() // <IPAddress>
	 * 
	 * for (const ip of subnet) {
	 *   console.log(ip.long())
	 * }
	 * ```
	 * @since 1.7.0
	*/ constructor(subnet: string | Subnet, type?: Type) {
		if (subnet instanceof Subnet) {
			if (type && type !== subnet.type) throw new Error('Not Expected Type')

			this.iFirst = subnet.iFirst
			this.mask = subnet.mask
			this.type = subnet.type

			return
		}

		const is = isSubnet(subnet)
		if (!is) throw new Error(`Invalid Subnet \`${subnet}\``)

		switch (is) {
			case "v4": {
				const [ content, mask ] = subnet.split('/')

				if (type && type !== 4) throw new Error('Not Expected Type')

				this.type = 4
				this.mask = parseInt(mask)
				this.iFirst = new IPAddress(content)

				break
			}

			case "v6": {
				const [ content, mask ] = subnet.split('/')

				if (type && type !== 6) throw new Error('Not Expected Type')

				this.type = 6
				this.mask = parseInt(mask)
				this.iFirst = new IPAddress(content)

				break
			}
		}
	}

	/**
	 * The Mask of this Subnet
	 * @since 1.7.0
	*/ public mask: number


	/**
	 * Whether this is an IPv4 Subnet
	 * @since 1.7.0
	*/ public isIPv4(): this is Subnet<4> {
		return this.type === 4
	}

	/**
	 * Whether this is an IPv6 Subnet
	 * @since 1.7.0
	*/ public isIPv6(): this is Subnet<6> {
		return this.type === 6
	}


	/**
	 * Get the first IP of the Subnet
	 * @since 1.7.0
	*/ public first(): IPAddress<Type> {
		return as<IPAddress<Type>>(this.iFirst)
	}

	/**
	 * Get the last IP of the Subnet
	 * @since 1.7.0
	*/ public last(): IPAddress<Type> {
		if (this.type === 4) {
			const mask = new Uint8Array(4)
			let subnet = this.mask

			for (let i = 0; i < 4; i++) {
				if (subnet > 0) {
					let bits = subnet > 8 ? 8 : subnet
					mask[i] = ((1 << bits) - 1) << (8 - bits)
					subnet -= bits
				} else {
					mask[i] = 0
				}
			}

			const net = new Uint8Array(4)
			for (let i = 0; i < 4; i++) {
				net[i] = this.iFirst.rawData[i] & mask[i]
  		}

			const ip = new Uint8Array(4)
			for (let i = 0; i < 4; i++) {
				ip[i] = net[i] | (~mask[i] & 0xFF)
			}

			return new IPAddress(ip)
		} else {
			const mask = ''.padStart(this.mask, '1').padEnd(128, '0');

			const maskArray = new Uint16Array(8)
			for (let i = 0; i < 8; i++) {
				maskArray[i] = parseInt(mask.substring(i * 16, (i + 1) * 16), 2)
			}
	
			const ip = new Uint16Array(8)
			for (let i = 0; i < 8; i++) {
				ip[i] = this.iFirst.rawData[i] | (~maskArray[i] & 0xFFFF)
			}

			return new IPAddress(ip)
		}
	}

	/**
	 * Get the Size of the Subnet (possible ips, for hosts subtract 2)
	 * @since 1.7.0
	*/ public size(): bigint {
		if (this.type === 4) {
			return BigInt(2) ** (BigInt(32) - BigInt(this.mask))
		} else {
			return BigInt(2) ** (BigInt(128) - BigInt(this.mask))
		}
	}

	public [Symbol.iterator](): Iterator<IPAddress<Type>> {
		const first = this.iFirst, size = this.size()
		let i = BigInt(0)

		if (this.type === 4) {
			return {
				next() {
					if (i === size) return { value: size, done: true }
	
					const ip = new Uint8Array(first.rawData)
					let overflow = i
	
					for (let j = ip.length - 1; j >= 0 && overflow > 0; j--) {
						let sum = ip[j] + Number(overflow)
						ip[j] = sum % 256
						overflow = BigInt(Math.floor(sum / 256))
					}
	
					++i
					return {
						value: new IPAddress(ip)
					}
				}
			}
		} else {
			return {
				next() {
					if (i === size) return { value: size, done: true }
	
					const ip = new Uint16Array(first.rawData)
					let overflow = i
	
					for (let j = ip.length - 1; j >= 0 && overflow > 0; j--) {
						let sum = ip[j] + Number(overflow)
						ip[j] = sum % 65536
						overflow = BigInt(Math.floor(sum / 65536))
					}

					++i
					return {
						value: new IPAddress(ip)
					}
				}
			}
		}
	}

	protected [inspectSymbol](): string {
		return `<Subnet v${this.type} /${this.mask} ${this.first().long()}->${this.last().long()}>`
	}
}

/**
 * A Respresentation of an IP Address
 * @example
 * ```
 * import { network } from "@rjweb/utils"
 * 
 * const ip = new network.IPAddress('127.1')
 * ip.type // 4
 * ip.long() // 127.0.0.1
 * ip.short() // 127.1
 * ```
 * @since 1.7.0
*/ export class IPAddress<Type extends 4 | 6 = 4 | 6> {
	private type: Type

	/**
	 * Create a new IP Address
	 * @example
	 * ```
	 * import { network } from "@rjweb/utils"
	 * 
	 * const ip = new network.IPAddress('127.1')
	 * ip.type // 4
	 * ip.full() // 127.0.0.1
	 * ip.short() // 127.1
	 * ```
	 * @since 1.7.0
	*/ constructor(ip: string | number | bigint | IPAddress | Uint8Array | Uint16Array, type?: Type) {
		if (ip instanceof IPAddress) {
			if (type && type !== ip.type) throw new Error('Not Expected Type')

			this.type = as<Type>(ip.type)
			this.rawData = as<any>(ip.rawData)

			return
		} else if (ip instanceof Uint8Array && !(ip instanceof Uint16Array)) {
			if (type && type !== 4) throw new Error('Not Expected Type')
			if (ip.length !== 4) throw new Error(`Invalid IP \`${ip.join('.')} (length must be 4 with uint8array)\``)

			this.type = as<Type>(4)
			this.rawData = as<any>(ip)

			return
		} else if (ip instanceof Uint16Array) {
			if (type && type !== 6) throw new Error('Not Expected Type')
			if (ip.length !== 8) throw new Error(`Invalid IP \`${ip.join('.')} (length must be 8 with uint16array)\``)

			this.type = as<Type>(6)
			this.rawData = as<any>(ip)

			return
		} else if (typeof ip === 'number') {
			if (ip > MAX_IPV4_LONG || ip < 0) throw new Error(`Invalid IP \`${ip}\``)

			this.type = as<Type>(4)
			this.rawData = as<any>(new Uint8Array([
				(ip >> 24) & 0xFF,
				(ip >> 16) & 0xFF,
				(ip >> 8) & 0xFF,
				ip & 0xFF
			]))

			return
		} else if (typeof ip === 'bigint') {
			if (ip > MAX_IPV6_LONG || ip < BigInt(0)) throw new Error(`Invalid IP \`${ip}\``)

			this.type = as<Type>(6)
			this.rawData = as<any>(new Uint16Array([
				Number((ip >> BigInt(112)) & BigInt(0xFFFF)),
				Number((ip >> BigInt(96)) & BigInt(0xFFFF)),
				Number((ip >> BigInt(80)) & BigInt(0xFFFF)),
				Number((ip >> BigInt(64)) & BigInt(0xFFFF)),
				Number((ip >> BigInt(48)) & BigInt(0xFFFF)),
				Number((ip >> BigInt(32)) & BigInt(0xFFFF)),
				Number((ip >> BigInt(16)) & BigInt(0xFFFF)),
				Number(ip & BigInt(0xFFFF))
			]))

			return
		}

		const is = isIP(ip)
		if (!is) throw new Error(`Invalid IP \`${ip}\``)

		switch (is) {
			case "v4": {
				const segments = ip.split('.')

				if (type && type !== 4) throw new Error('Not Expected Type')

				this.type = as<Type>(4)
				this.rawData = as<any>(new Uint8Array(4))

				const ints = segments.map((segment) => parseInt(segment))
				switch (ints.length) {
					case 4: {
						this.rawData.set(ints)
	
						break
					}

					case 3: {
						this.rawData.set(ints)
	
						break
					}

					case 2: {
						this.rawData[0] = ints[0]
						this.rawData[3] = ints[1]
	
						break
					}

					case 1: {
						if (ints[0] > 255) {
							this.rawData.set([
								(ints[0] >> 24) & 0xFF,
								(ints[0] >> 16) & 0xFF,
								(ints[0] >> 8) & 0xFF,
								ints[0] & 0xFF
							])

							break
						}

						this.rawData.set(ints)

						break
					}

					default: {
						throw new Error('Int Length Invalid')
					}
				}

				break
			}

			case "v6": {
				const segments = ip.split(':')
				if (segments[0] === '') segments.splice(0, 1)

				if (type && type !== 6) throw new Error('Not Expected Type')

				this.type = as<Type>(6)
				this.rawData = as<any>(new Uint16Array(8))

				const ints = segments.map((segment) => !segment ? false : parseInt(segment, 16))

				if (ints.length > 1) {
					let doubleIx: number | null = null
					for (let i = 0; i < ints.length; i++) {
						if (ints[i] === false) {
							doubleIx = i
							break
						}
					}

					if (doubleIx !== null) {
						const start = as<number[]>(ints.slice(0, doubleIx)),
							end = as<number[]>(ints.slice(doubleIx + 1))

						this.rawData.set(start.concat(Array.from({ length: 8 - (start.length + end.length) }, () => 0)).concat(end))
					} else {
						this.rawData.set(ints as number[])
					}
				} else {
					const int = BigInt(segments[0])

					this.rawData.set([
						Number((int >> BigInt(112)) & BigInt(0xFFFF)),
						Number((int >> BigInt(96)) & BigInt(0xFFFF)),
						Number((int >> BigInt(80)) & BigInt(0xFFFF)),
						Number((int >> BigInt(64)) & BigInt(0xFFFF)),
						Number((int >> BigInt(48)) & BigInt(0xFFFF)),
						Number((int >> BigInt(32)) & BigInt(0xFFFF)),
						Number((int >> BigInt(16)) & BigInt(0xFFFF)),
						Number(int & BigInt(0xFFFF))
					])
				}

				break
			}
		}
	}

	/**
	 * The Raw Byte Data of the IP
	 * @since 1.7.0
	*/ public readonly rawData: Type extends 4 ? Type extends 6 ? Uint8Array | Uint16Array : Uint8Array : Uint16Array


	/**
	 * Whether this is an IPv4 Address
	 * @since 1.7.0
	*/ public isIPv4(): this is IPAddress<4> {
		return this.type === 4
	}

	/**
	 * Whether this is an IPv6 Address
	 * @since 1.7.0
	*/ public isIPv6(): this is IPAddress<6> {
		return this.type === 6
	}


	/**
	 * Get the Usual representation of this IPs Version
	 * 
	 * Returns `.long()` for v4 and `.short()` for v6
	 * @since 1.8.5
	*/ public usual(): string {
		if (this.type === 4) return this.long()
		else return this.short()
	}

	/**
	 * Get the Long representation of this IP
	 * @since 1.7.0
	*/ public long(): string {
		if (this.type === 4) {
			return this.rawData.join('.')
		} else {
			return [ ...this.rawData ].map((seg) => seg.toString(16).padStart(4, '0')).join(':')
		}
	}

	/**
	 * Get the Short representation of this IP
	 * @since 1.7.0
	*/ public short(): string {
		if (this.type === 4) {
			if (!this.rawData[1] && !this.rawData[2] && !this.rawData[3]) return this.rawData[0].toString()
			else if (!this.rawData[1] && !this.rawData[2]) return `${this.rawData[0]}.${this.rawData[3]}`
			else if (!this.rawData[2] && !this.rawData[3]) return `${this.rawData[0]}.${this.rawData[1]}`
			else if (!this.rawData[3]) return `${this.rawData[0]}.${this.rawData[1]}.${this.rawData[2]}`

			return this.rawData.join('.')
		} else {
			let ip = '', doubleIx = false

			for (const segment of this.rawData) {
				if (!segment) {
					if (!doubleIx) {
						ip += ip ? ':' : '::'
						doubleIx = true
					}

					continue
				}

				ip += `:${segment.toString(16)}`
			}

			/* let ip = [ ...this.rawData ]
        .map((seg) => seg.toString(16))
        .join(':')

			ip = ip.replace(/(^|:)0+([0-9A-Fa-f]+)/g, '$1$2')
			ip = ip.replace(/(^|:)(0(:|$)){2,}/, '::')*/

			ip = ip.slice(1)
			return ip.length === 1 ? '::' : ip
		}
	}

	/**
	 * Get the Integer Representation of this IP
	 * @since 1.8.6
	*/ public int(): Type extends 4 ? Type extends 6 ? bigint | number : number : bigint {
		if (this.type === 4) {
			return ((this.rawData[0] << 24)
				+ (this.rawData[1] << 16)
				+ (this.rawData[2] << 8)
				+ this.rawData[3]) >>> 0 as any
		} else {
			return (BigInt(this.rawData[0]) << BigInt(112))
				+ (BigInt(this.rawData[1]) << BigInt(96))
				+ (BigInt(this.rawData[2]) << BigInt(80))
				+ (BigInt(this.rawData[3]) << BigInt(64))
				+ (BigInt(this.rawData[4]) << BigInt(48))
				+ (BigInt(this.rawData[5]) << BigInt(32))
				+ (BigInt(this.rawData[6]) << BigInt(16))
				+ BigInt(this.rawData[7]) as any
		}
	}

	/**
	 * Whether this IP Equals another IP
	 * @since 1.8.5
	*/ public equals(compareTo: IPAddress): compareTo is this {
		if (compareTo.type !== this.type) return false

		switch (this.type) {
			case 4: {
				for (let i = 0; i < 4; i++) {
					if (this.rawData[i] !== compareTo.rawData[i]) return false
				}

				break
			}

			case 6: {
				for (let i = 0; i < 8; i++) {
					if (this.rawData[i] !== compareTo.rawData[i]) return false
				}

				break
			}
		}

		return true
	}

	protected [inspectSymbol](): string {
		return `<IPAddress v${this.type} ${this.usual()}>`
	}
}

/**
 * Check the Connection (Time) to a Host + Port
 * @example
 * ```
 * import { network } from "@rjweb/utils"
 * 
 * // host, port, timeout ms
 * await network.test('127.0.0.1', 80, 5000) // 7.270833998918533
 * ```
 * @returns ms it took to connect or false if failed
 * @since 1.1.0
*/ export function test(host: string | IPAddress, port: number, timeout: number = 10000): Promise<number | false> {
	return new Promise((resolve) => {
		const start = performance.now()
		const timer = setTimeout(() => {
			connection.end()
			resolve(false)
		}, timeout)

		const connection = net.createConnection({
			host: typeof host === 'string' ? host : host.long(),
			port, keepAlive: false
		})

		connection
			.once('connect', () => {
				connection.end()
				resolve(performance.now() - start)
				clearTimeout(timer)
			})
			.once('error', () => {
				connection.end()
				resolve(false)
				clearTimeout(timer)
			})
			.once('timeout', () => {
				connection.end()
				resolve(false)
				clearTimeout(timer)
			})
	})
}

function checkV4(ip: string): boolean {
	const segments = ip.split('.')
	if (segments.length > 4) return false

	if (segments.length > 1) {
		for (const segment of segments) {
			const int = parseInt(segment)
			if (isNaN(int)) return false
			if (int < 0 || int > 255) return false
		}
	} else {
		const int = parseInt(ip)
		if (isNaN(int)) return false
		if (int < 0 || int > MAX_IPV4_LONG) return false
	}

	return true
}

/**
 * Check if an IP is valid
 * @example
 * ```
 * import { network } from "@rjweb/utils"
 * 
 * network.isIP('127.0.0.1', 'v4') // 'v4'
 * network.isIP('127.0.0.1', 'v6') // false
 * network.isIP('::1', 'v4') // false
 * network.isIP('::1', 'v6') // 'v6'
 * network.isIP('127.0.0.1', 'v6 | v4') // 'v4'
 * network.isIP('1.1') // 'v4'
 * ```
 * @returns IP Type or false if failed
 * @since 1.1.0
*/ export function isIP(ip: string, type: 'v4' | 'v6' | 'v6 | v4' = 'v6 | v4'): 'v4' | 'v6' | false {
	if (type !== 'v6' && !ip.includes(':')) {
		const res = checkV4(ip)
		if (res) return 'v4'
	}

	if (type !== 'v4') {
		const segments = ip.split(':')
		if (segments.length > 8 || segments.length === 2) return false

		if (segments.length > 1) {
			if (segments[0] === '') segments.splice(0, 1)

			let doubleSegments = 0
			for (const segment of segments) {
				if (doubleSegments > 1) return false
				if (segment === '') {
					doubleSegments++
					continue
				}

				const int = parseInt(segment, 16)
				if (isNaN(int)) return false
				if (int < 0 || int > 65535) return false
			}

			if (doubleSegments === 0 && segments.length !== 8) return false
		} else {
			try {
				const int = BigInt(ip)
				if (int < 0 || int > MAX_IPV6_LONG) return false
			} catch {
				return false
			}
		}

		return 'v6'
	}

	return false
}

/**
 * Check if a Subnet is valid
 * @example
 * ```
 * import { network } from "@rjweb/utils"
 * 
 * network.isSubnet('127.0.0.1', 'v4') // false
 * network.isSubnet('127.0.0.1', 'v6') // false
 * network.isSubnet('::1/128', 'v6') // 'v6'
 * network.isSubnet('127.0.0.1/32', 'v6 | v4') // 'v4'
 * network.isSubnet('1.1') // false
 * network.isSubnet('1.1/32') // 'v4'
 * ```
 * @returns Subnet IP Type or false if failed
 * @since 1.7.0
*/ export function isSubnet(ip: string, type: 'v4' | 'v6' | 'v6 | v4' = 'v6 | v4'): 'v4' | 'v6' | false {
	if (type !== 'v6' && !ip.includes(':')) {
		const [ content, mask ] = ip.split('/')
		if (mask) {
			const int = parseInt(mask)
			if (isNaN(int)) return false
			if (int < 0 && int > 32) return false
		} else return false

		const result = isIP(content, 'v4')
		if (result) return result
	}

	if (type !== 'v4') {
		const [ content, mask ] = ip.split('/')
		if (mask) {
			const int = parseInt(mask)
			if (isNaN(int)) return false
			if (int < 0 && int > 128) return false
		} else return false

		return isIP(content, 'v6')
	}

	return false
}

/**
 * Get the current public IP Address
 * 
 * (i) This uses fetch + https://ip.rjns.dev (located in germany, falkenstein - no logs)
 * @example
 * ```
 * import { network } from "@rjweb/utils"
 * 
 * console.log(`View at http://${(await network.currentIP('v4'))?.long()} or http://[${(await network.currentIP('v6'))?.long()}]`)
 * ```
 * @since 1.8.4
*/ export async function currentIP<Type extends 'v4' | 'v6' | undefined>(type?: Type): Promise<(Type extends 'v4' ? Type extends 'v6' ? IPAddress<4> | IPAddress<4> : IPAddress<4> : IPAddress<6>) | null> {
	try {
		const ip = await fetch(`https://${type === 'v4' ? 'ipv4' : type === 'v6' ? 'ipv6' : 'ip'}.rjns.dev`)

		return new IPAddress(await ip.text()) as any
	} catch {
		return null
	}
}

/**
 * Download a resource to the filesystem using `fetch` and `fs.createWriteStream`, default method is `GET`
 * @example
 * ```
 * import { network } from "@rjweb/utils"
 * 
 * await network.download('http://speedtest.belwue.net/random-1G', '/tmp/1gb.test') // 14314.149778962135
 * ```
 * @returns Time it took to download in ms
 * @since 1.8.5
*/ export async function download(url: string, file: fs.PathLike, options?: RequestInit): Promise<number> {
	const startTime = performance.now()

	const response = await fetch(url, options)
	if (!response.body) throw new Error('No Response Body')

	const writeStream = fs.createWriteStream(file)

	try {
		for await (const chunk of response.body) {
			writeStream.write(chunk)
		}

		return performance.now() - startTime
	} finally {
		writeStream.close()
	}
}

/**
 * Stream a Resource Chunk by Chunk
 * @example
 * ```
 * import { network } from "@rjweb/utils"
 * 
 * const decoder = new TextDecoder()
 * for await (const chunk of network.stream('https://google.com')) {
 *   process.stdout.write(decoder.decode(chunk))
 * }
 * 
 * for await (const chunk of network.stream('https://google.com').text()) {
 *   process.stdout.write(chunk)
 * }
 * ```
 * @since 1.9.0
*/ export function stream(url: string, options?: RequestInit): AsyncIterable<Uint8Array> & { text(): AsyncIterable<string> } {
	let fetched: Response | null = null, fetchIterator: AsyncIterableIterator<any> | null = null
	const decoder = new TextDecoder()

	return {
		[Symbol.asyncIterator]() {
			return {
				async next(): Promise<IteratorResult<any, any>> {
					if (fetchIterator) return fetchIterator.next()

					if (!fetched) fetched = await fetch(url, options)
					if (!fetched.body) throw new Error('No Response Body')

					fetchIterator = fetched.body[Symbol.asyncIterator]()

					return fetchIterator.next()
				}, async return() {
					if (!fetchIterator?.return) return { done: true, value: new Uint8Array(0) }
					else return fetchIterator.return()
				}, async throw(e) {
					if (!fetchIterator?.throw) return { done: true, value: new Uint8Array(0) }
					else return fetchIterator.throw(e)
				}
			}
		}, text() {
			return {
				[Symbol.asyncIterator]() {
					return {
						async next(): Promise<IteratorResult<any, any>> {
							if (fetchIterator) {
								const result = await fetchIterator.next()

								return { done: result.done, value: decoder.decode(result.value) }
							}

							if (!fetched) fetched = await fetch(url, options)
							if (!fetched.body) throw new Error('No Response Body')
		
							fetchIterator = fetched.body[Symbol.asyncIterator]()

							const result = await fetchIterator.next()
							return { done: result.done, value: decoder.decode(result.value) }
						}, async return() {
							if (!fetchIterator?.return) return { done: true, value: '' }
							else return fetchIterator.return()
						}, async throw(e) {
							if (!fetchIterator?.throw) return { done: true, value: '' }
							else return fetchIterator.throw(e)
						}
					}
				}
			}
		}
	}
}