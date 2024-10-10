import { IPAddress, isIP } from "./network"
import * as dns from "dns"

type HttpDNSResponse = {
	Status: number
	TC: boolean
	RD: boolean
	RA: boolean
	AD: boolean
	CD: boolean
	Question: {
		name: string
		type: number
	}
	Answer?: {
		name: string
		type: number
		TTL: number
		data: string
	}[]
	Authority: [
		{
			name: string
			type: number
			TTL: number
			data: string
		}
	]
}

/**
 * Resolve a Host to an IP
 * @example
 * ```
 * import { dns } from "@rjweb/utils"
 * 
 * await dns.resolve('1.1.1.1') // <IPAddress v4 1.1.1.1>
 * await dns.resolve('google.com', 'v4') // <IPAddress v4 142.250.185.78>
 * await dns.resolve('google.com', 'v6') // <IPAddress v4 2a00:1450:400d:803::200e:>
 * await dns.resolve('google.cdom', 'v6') // null
 * ```
 * @since 1.8.0
 * @supports nodejs, browser
 * @default
 * prefer = 'v4'
 * mode = 'fetch'
*/ export async function resolve(host: string, prefer: 'v4' | 'v6' = 'v4', mode: 'dns' | 'fetch' = 'fetch'): Promise<IPAddress | null> {
	if (isIP(host)) return new IPAddress(host)

	if (mode === 'dns') {
		const [ v4, v6 ] = await Promise.allSettled([
			dns.promises.resolve4(host),
			dns.promises.resolve6(host)
		])

		if (v4.status === 'rejected' && v6.status === 'rejected') return null

		if (prefer === 'v4' && v4.status === 'fulfilled') return new IPAddress(v4.value[0])
		else if (prefer === 'v6' && v6.status === 'fulfilled') return new IPAddress(v6.value[0])
		else return new IPAddress(v4.status === 'fulfilled' ? v4.value[0] : v6.status === 'fulfilled' ? v6.value[0] : '127.0.0.1')
	} else {
		const [ v4, v6 ] = await Promise.all([
			fetch(`https://cloudflare-dns.com/dns-query?name=${host}&type=A`, { headers: { accept: 'application/dns-json' } }).then(res => res.json() as Promise<HttpDNSResponse>),
			fetch(`https://cloudflare-dns.com/dns-query?name=${host}&type=AAAA`, { headers: { accept: 'application/dns-json' } }).then(res => res.json() as Promise<HttpDNSResponse>)
		])

		if (!v4.Answer && !v6.Answer) return null

		if (prefer === 'v4' && v4.Answer) return new IPAddress(v4.Answer[0].data)
		else if (prefer === 'v6' && v6.Answer) return new IPAddress(v6.Answer[0].data)
		else return new IPAddress(v4.Answer ? v4.Answer[0].data : v6.Answer ? v6.Answer[0].data : '127.0.0.1')
	}
}

/**
 * Resolve an IP to Hosts
 * @example
 * ```
 * import { dns, network } from "@rjweb/utils"
 * 
 * const [ googleV4, googleV6 ] = await Promise.all([
 *   dns.resolve('google.com', 'v4'),
 *   dns.resolve('google.com', 'v6')
 * ])
 * 
 * await dns.reverse(new network.IPAddress('1.1.1.1')) // null
 * await dns.reverse(googleV4) // 'fra16s53-in-f14.1e100.net'
 * await dns.reverse(googleV6) // 'fra16s53-in-x0e.1e100.net'
 * ```
 * @since 1.10.5
 * @supports nodejs, browser
 * @default mode = 'fetch'
*/ export async function reverse(ip: IPAddress, mode: 'dns' | 'fetch' = 'fetch'): Promise<string | null> {
	try {
		if (mode === 'dns') {
			const result = await dns.promises.reverse(ip.long())

			return result[0]
		} else {
			if (ip.isIPv4()) {
				const result = await fetch(`https://cloudflare-dns.com/dns-query?name=${ip.long().split('.').reverse().join('.')}.in-addr.arpa&type=PTR`, { headers: { accept: 'application/dns-json' } }).then(res => res.json() as Promise<HttpDNSResponse>)

				if (!result.Answer) return null
				return result.Answer[0].data
			} else {
				const result = await fetch(`https://cloudflare-dns.com/dns-query?name=${ip.long().split(':').reverse().flatMap((x) => x.split('').reverse().join('.')).join('.')}.ip6.arpa&type=PTR`, { headers: { accept: 'application/dns-json' } }).then(res => res.json() as Promise<HttpDNSResponse>)

				if (!result.Answer) return null
				return result.Answer[0].data
			}
		}
	} catch {
		return null
	}
}