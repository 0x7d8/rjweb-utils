type Success<Data> = [ true, Data, undefined, number ]
type Error<Err> = [ false, undefined, Err, number ]
type Response<Data, Err> = Success<Data> | Error<Err>

/**
 * Wrap a function to get data, error and time in an array
 * @example
 * ```
 * import { func, system } from "@rjweb/utils"
 * 
 * const [ success, data, error, ms ] = func.wrap(system.execute, 'echo hi', { async: false })) // [true, 'hi\n', undefined, 1]
 * const [ success, data, error, ms ] = func.wrap(system.execute, 'wesgasg', { async: false })) // [false, undefined, <Error>, 1]
 * ```
 * @since 1.10.0
 * @supports nodejs, browser
*/ export function wrap<Err = any, Fn extends (...args: any[]) => Promise<any> | any = any>(fn: Fn, ...args: Parameters<Fn>): ReturnType<Fn> extends Promise<any> ? Promise<Response<Awaited<ReturnType<Fn>>, Err>> : Response<ReturnType<Fn>, Err> {
	const start = performance.now()
	
	try {
		const result = fn(...args)

		if (result instanceof Promise) {
			return new Promise(async(resolve) => {
				try {
					const fullResult = await result

					return resolve([true, fullResult, undefined, performance.now() - start])
				} catch (err: any) {
					return resolve([false, undefined, err, performance.now() - start])
				}
			}) as never
		} else {
			return [true, result, undefined, performance.now() - start] as never
		}
	} catch (err: any) {
		return [false, undefined, err, performance.now() - start] as never
	}
}