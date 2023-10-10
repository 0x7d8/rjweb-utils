import { IPAddress, isIP } from "./network"
import * as dns from "dns"

/**
 * Resolve a Host to an IP
 * @example
 * ```
 * import { dns } from "@rjweb/utils"
 * 
 * await dns.resolveHost('1.1.1.1') // <IPAddress v4 1.1.1.1>
 * await dns.resolveHost('google.com') // <IPAddress v4 142.250.185.78>
 * ```
 * @throws If no IP Could be resolved
 * @since 1.8.0
*/ export async function resolveHost(host: string): Promise<IPAddress> {
	if (isIP(host)) return new IPAddress(host)

	try {
		const v4 = await dns.promises.resolve4(host)
		if (!v4.length) throw 1

		return new IPAddress(v4[0])
	} catch {
		try {
			const v6 = await dns.promises.resolve6(host)
			if (!v6.length) throw 1

			return new IPAddress(v6[0])
		} catch { }
	}

	throw new Error(`No IP could be resolved for \`${host}\``)
}