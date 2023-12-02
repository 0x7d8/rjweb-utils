import { IPAddress, isIP } from "./network"
import * as dns from "dns"

/**
 * Resolve a Host to an IP
 * @example
 * ```
 * import { dns } from "@rjweb/utils"
 * 
 * await dns.resolveHost('1.1.1.1') // <IPAddress v4 1.1.1.1>
 * await dns.resolveHost('google.com', 'v4') // <IPAddress v4 142.250.185.78>
 * await dns.resolveHost('google.com', 'v6') // <IPAddress v4 2a00:1450:400d:803::200e:>
 * ```
 * @throws If no IP Could be resolved
 * @since 1.8.0
*/ export async function resolveHost(host: string, prefer: 'v4' | 'v6' = 'v4'): Promise<IPAddress> {
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