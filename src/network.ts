import * as net from "net"

/**
 * Check the Connection to a Host + Port
 * @default
 * ```
 * import { network } from "@rjweb/utils"
 * 
 * // host, port, timeout ms
 * await network.test('127.0.0.1', 80, 5000) // true
 * ```
 * @since 1.1.0
*/ export function test(host: string, port: number, timeout: number = 10000): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		const timer = setTimeout(() => {
			resolve(false)
			connection.destroy()
		}, timeout)

		const connection = net.createConnection({
			host, port,
			keepAlive: false
		})

		connection
			.once('connect', () => {
				resolve(true)
				clearTimeout(timer)
				connection.end()
			})
			.once('error', () => {
				resolve(false)
				clearTimeout(timer)
				connection.end()
			})
			.once('timeout', () => {
				resolve(false)
				clearTimeout(timer)
				connection.end()
			})
	})
}

/**
 * Check if an IP is valid
 * @default
 * ```
 * import { network } from "@rjweb/utils"
 * 
 * network.isIP('127.0.0.1', 'v4') // true
 * network.isIP('127.0.0.1', 'v6') // false
 * network.isIP('::1', 'v4') // false
 * network.isIP('::1, 'v6') // true
 * network.isIP('127.0.0.1', 'v6 | v4') // true
 * ```
 * @since 1.1.0
*/ export function isIP(ip: string, type: 'v4' | 'v6' | 'v6 | v4' = 'v6 | v4'): boolean {
	const is = net.isIP(ip) as 0 | 4 | 6
	if (is === 0) return false

	if (type === 'v6 | v4') return true
	if (type === 'v4' && is === 4) return true
	if (type === 'v6' && is === 6) return true

	return false
}