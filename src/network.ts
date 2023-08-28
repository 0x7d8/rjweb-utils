import * as net from "net"

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

		const connection = net.createConnection({
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
	const is = net.isIP(ip) as 0 | 4 | 6
	if (is === 0) return false

	if (type === 'v6 | v4') return `v${is}`
	if (type === 'v4' && is === 4) return 'v4'
	if (type === 'v6' && is === 6) return 'v6'

	return false
}