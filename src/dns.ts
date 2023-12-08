import { IPAddress, isIP } from "./network"
import * as dns from "dns"

/**
 * Resolve a Host to an IP
 * @example
 * ```
 * import { dns } from "@rjweb/utils"
 * 
 * await dns.resolve('1.1.1.1') // <IPAddress v4 1.1.1.1>
 * await dns.resolve('google.com', 'v4') // <IPAddress v4 142.250.185.78>
 * await dns.resolve('google.com', 'v6') // <IPAddress v4 2a00:1450:400d:803::200e:>
 * ```
 * @throws If no IP Could be resolved
 * @since 1.8.0
*/ export async function resolve(host: string, prefer: 'v4' | 'v6' = 'v4'): Promise<IPAddress> {
	if (isIP(host)) return new IPAddress(host)

	const [ v4, v6 ] = await Promise.allSettled([
		dns.promises.resolve4(host),
		dns.promises.resolve6(host)
	])

	if (v4.status === 'rejected' && v6.status === 'rejected') throw new Error(`No IP could be resolved for \`${host}\``)

	if (prefer === 'v4' && v4.status === 'fulfilled') return new IPAddress(v4.value[0])
	else if (prefer === 'v6' && v6.status === 'fulfilled') return new IPAddress(v6.value[0])
	else return new IPAddress(v4.status === 'fulfilled' ? v4.value[0] : v6.status === 'fulfilled' ? v6.value[0] : '127.0.0.1')
}

/**
 * Resolve an IP to Hosts
 * @example
 * ```
 * import { dns, network } from "@rjweb/utils"
 * 
 * await dns.reverse('1.1.1.1') // ['']
 * await dns.reverse('google.com', 'v4') // <IPAddress v4 142.250.185.78>
 * await dns.reverse('google.com', 'v6') // <IPAddress v4 2a00:1450:400d:803::200e:>
 * ```
 * @throws If no Host Could be resolved
 * @since 1.10.5
*/ export async function reverse(ip: IPAddress): Promise<string> {
	try {
		const result = await dns.promises.reverse(ip.long())

		return result[0]
	} catch {
		throw new Error(`No Host could be resolved for \`${ip.usual()}\``)
	}
}