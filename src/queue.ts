import { DeepRequired, array } from "."

type Function = (...args: any[]) => any

/**
 * A Queue to schedule function calls for later
 * @example
 * ```
 * import { queue } from "@rjweb/utils"
 * 
 * const mails = new queue.Queue({
 *   wait: 1000
 * })
 * 
 * mails.add(() => sendMail()) // will execute after 0ms
 * mails.add(() => sendMail()) // will execute after 1000ms
 * mails.add(() => sendMail()) // will execute after 2000ms
 * mails.add(() => sendMail()) // will execute after 3000ms
 * mails.add(() => sendMail()) // will execute after 4000ms
 * mails.add(() => sendMail()) // will execute after 5000ms
 * mails.add(() => sendMail()) // will execute after 6000ms
 * ```
 * @since 1.4.0
 * @supports nodejs, browser
*/ export class Queue<const Options extends {
	/**
	 * Time to wait between each function call
	 * @default 5000
	 * @since 1.4.0
	*/ wait?: number
}> {
	private nextRunScheduled: boolean
	private lastRun: number = 0
	private queue: Function[] = []
	private options: DeepRequired<Options>
	private fnWaiters: [fn: Function, callback: (type: 'resolve' | 'reject', data: any) => void][] = []
	private onFinish: null | ((fn: Function, result: unknown) => Promise<any> | any) = null
	private onError: null | ((fn: Function, error: unknown) => Promise<any> | any) = null

	constructor(options?: Options) {
		this.options = {
			wait: options?.wait ?? 5000
		} as any

		this.nextRunScheduled = false
	}

	/**
	 * Callback for when a function call finishes successfully
	 * @since 1.4.0
	*/ public finish(callback: (fn: Function, result: unknown) => Promise<any> | any): this {
		this.onFinish = callback

		return this
	}

	/**
	 * Callback for when a function call finishes in an error
	 * @since 1.4.0
	*/ public error(callback: (fn: Function, error: unknown) => Promise<any> | any): this {
		this.onError = callback

		return this
	}

	/**
	 * Get the Wait Duration of this Queue
	 * @since 1.4.0
	*/ public getWaitDuration(): Options['wait'] extends number ? Options['wait'] : 5000 {
		return this.options.wait as any
	}

	/**
	 * Add a function to run to the queue
	 * @since 1.4.0
	*/ public add(fn: Function): this {
		this.queue.push(fn)

		if (this.lastRun + this.options.wait < Date.now() && !this.nextRunScheduled) {
			this.nextRunScheduled = true
			this.lastRun = Infinity
			this.runNextQueueItem()
		} else if (!this.nextRunScheduled) {
			this.nextRunScheduled = true
			setTimeout(() => this.runNextQueueItem(), Date.now() - this.lastRun + this.options.wait)
		}

		return this
	}

	/**
	 * Add & Wait for the function to be finished
	 * @since 1.4.1
	*/ public addAndWaitForFinish<Fn extends Function>(fn: Fn): Promise<Awaited<ReturnType<Fn>>> {
		return new Promise((resolve, reject) => {
			this.fnWaiters.push([
				fn, (type, data) => {
					if (type === 'resolve') return resolve(data)
					else return reject(data)
				}
			])

			this.add(fn)
		})
	}

	private async runNextQueueItem() {
		const item = this.queue[0]
		this.queue = this.queue.slice(1)

		try {
			const result = await Promise.resolve(item())
			if (this.onFinish) try {
				this.onFinish(item, result)
			} catch { }

			const waiter = this.fnWaiters.find(([ fn ]) => Object.is(fn, item))
			if (waiter) {
				const [ _, callback ] = waiter

				callback('resolve', result)
				this.fnWaiters = array.remove(this.fnWaiters, 'value', waiter)
			}
		} catch (err) {
			if (this.onError) try {
				this.onError(item, err)
			} catch { }

			const waiter = this.fnWaiters.find(([ fn ]) => Object.is(fn, item))
			if (waiter) {
				const [ _, callback ] = waiter

				callback('reject', err)
				this.fnWaiters = array.remove(this.fnWaiters, 'value', waiter)
			}
		} finally {
			this.nextRunScheduled = false
			this.lastRun = Date.now()

			if (this.queue.length) {
				this.nextRunScheduled = true
				setTimeout(() => this.runNextQueueItem(), this.options.wait)
			}
		}
	}
}