import { createConnection } from "net"
import { as } from "."

type IPAddress4 = {
	type: 4
	full(): string
	data: Uint8Array & {
		length: 4
	}
}

type IPAddress6 = {
	type: 6
	full(): string
	data: Uint16Array & {
		length: 8
	}
}

type IPAddress = IPAddress4 | IPAddress6

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
*/ export function test(host: string, port: number, timeout: number = 10000): Promise<number | false> {
	return new Promise((resolve) => {
		const start = performance.now()
		const timer = setTimeout(() => {
			connection.end()
			resolve(false)
		}, timeout)

		const connection = createConnection({
			host, port,
			keepAlive: false
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
 * ```
 * @returns IP Type or false if failed
 * @since 1.1.0
*/ export function isIP(ip: string, type: 'v4' | 'v6' | 'v6 | v4' = 'v6 | v4'): 'v4' | 'v6' | false {
	if (type !== 'v6' && ip.includes('.')) {
		const segments = ip.split('.')
		if (segments.length > 4) return false

		for (const segment of segments) {
			const int = parseInt(segment)
			if (isNaN(int)) return false
			if (int < 0 || int > 255) return false
		}

		return 'v4'
	} else if (type !== 'v4' && ip.includes(':')) {
		const segments = ip.split(':')
		if (segments.length > 8 || segments.length <= 2) return false

		if (segments[0] === '') segments.splice(0, 1)

		let doubleSegments = 0
		for (const segment of segments) {
			if (doubleSegments > 1) return false
			if (!segment) {
				doubleSegments++
				continue
			}

			const int = parseInt(segment, 16)
			if (isNaN(int)) return false
			if (int < 0 || int > 65535) return false
		}

		if (doubleSegments === 0 && segments.length !== 8) return false

		return 'v6'
	}

	return false
}

/**
 * Parse an IP into a Typed Array and its full string
 * @warning Does NOT Support CIDR yet
 * @example
 * ```
 * import { network } from "@rjweb/utils"
 *
 * network.parseIP('::1') // { type: 6, full: [Function], data: [ 0, 0, 0, 0, 0, 0, 0, 1 ] }
 * network.parseIP('127.1') // { type: 4, full: [Function], data: [ 127, 0, 0, 1 ] }
 * ```
 * @since 1.6.3
*/ export function parseIP(ip: string): IPAddress {
	const is = isIP(ip)
	if (!is) throw new Error(`Invalid IP ${ip}`)

	switch (is) {
		case "v4": {
			const segments = ip.split('.')
			
			let data: IPAddress4

			const ints = segments.map((segment) => parseInt(segment))
			switch (ints.length) {
				case 4: {
					data = {
						type: 4,
						full() {
							return ints.join('.')
						}, data: new Uint8Array(ints) as any
					}

					break
				}

				case 3: {
					data = {
						type: 4,
						full() {
							return ints.join('.').concat('.0')
						}, data: new Uint8Array([ ...ints, 0 ]) as any
					}

					break
				}

				case 2: {
					data = {
						type: 4,
						full() {
							return ints[0].toString().concat('.0.0.').concat(ints[1].toString())
						}, data: new Uint8Array([ ints[0], 0, 0, ints[1] ]) as any
					}

					break
				}

				case 1: {
					data = {
						type: 4,
						full() {
							return ints[0].toString().concat('.0.0.0')
						}, data: new Uint8Array([ ints[0], 0, 0, 0 ]) as any
					}

					break
				}

				default: {
					throw new Error('Int Length Invalid')
				}
			}

			return data
		}

		case "v6": {
			const segments = ip.split(':')
			if (segments[0] === '') segments.splice(0, 1)

			const data: IPAddress6 = {
				type: 6,
				full() {
					return [ ...this.data ].map((segment) => segment.toString(16).padStart(4, '0')).join(':')
				}, data: new Uint16Array(8) as any
			}

			const ints = segments.map((segment) => !segment ? false : parseInt(segment, 16))

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

				console.log(start, end)
				data.data.set(start.concat(Array.from({ length: 8 - (start.length + end.length) }, () => 0)).concat(end))
			} else {
				data.data.set(ints as number[])
			}

			return data
		}
	}
}