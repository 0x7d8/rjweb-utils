import { Multiply } from "ts-arithmetic"

class Time<Amount extends number> {
	private amount: Amount

	/**
	 * Initialize a new Time Class
	 * @since 1.5.0
	*/ constructor(amount: Amount) {
		this.amount = amount
	}


	/**
	 * Use the provided amount as milliseconds
	 * @example
	 * ```
	 * time(10).ms() // 10
	 * ```
	 * @since 1.5.0
	*/ public ms(): Amount {
		return this.amount
	}

	/**
	 * Use the provided amount as seconds
	 * @example
	 * ```
	 * time(10).s() // 10000
	 * ```
	 * @since 1.5.0
	*/ public s(): Multiply<Amount, 1000> {
		return this.amount * 1000 as never
	}

	/**
	 * Use the provided amount as minutes
	 * @example
	 * ```
	 * time(10).m() // 600000
	 * ```
	 * @since 1.5.0
	*/ public m(): Multiply<Multiply<Amount, 1000>, 60> {
		return this.amount * 1000 * 60 as never
	}

	/**
	 * Use the provided amount as hours
	 * @example
	 * ```
	 * time(10).h() // 36000000
	 * ```
	 * @since 1.5.0
	*/ public h(): Multiply<Multiply<Multiply<Amount, 1000>, 60>, 60> {
		return this.amount * 1000 * 60 * 60 as never
	}

	/**
	 * Use the provided amount as days
	 * @example
	 * ```
	 * time(10).d() // 8640000000
	 * ```
	 * @since 1.5.0
	*/ public d(): Multiply<Multiply<Multiply<Multiply<Amount, 1000>, 60>, 60>, 24> {
		return this.amount * 1000 * 60 * 60 * 24 as never
	}

	/**
	 * Use the provided amount as weeks
	 * @example
	 * ```
	 * time(10).w() // 604800000000
	 * ```
	 * @since 1.5.0
	*/ public w(): Multiply<Multiply<Multiply<Multiply<Multiply<Amount, 1000>, 60>, 60>, 24>, 7> {
		return this.amount * 1000 * 60 * 60 * 24 * 7 as never
	}
}

/**
 * Utility for defining milliseconds
 * @example
 * ```
 * import { time } from "@rjweb/utils"
 * 
 * time(10).h() // 36000000
 * ```
 * @since 1.5.0
*/ export default Object.assign(function time<Amount extends number>(amount: Amount): Time<Amount> {
	return new Time(amount)
}, {
	/**
	 * Wait asyncronously for x ms
	 * @example
	 * ```
	 * import { time } from "@rjweb/utils"
	 * 
	 * console.log('hi!')
	 * await time.wait(time(2).s())
	 * console.log('2 sec later')
	 * ```
	 * @since 1.5.0
	*/ wait(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms))
	},

	/**
	 * See how long a function takes to run
	 * @example
	 * ```
	 * import { time } from "@rjweb/utils"
	 * 
	 * const [ time, result ] = time.fn(async() => {
	 *   await time.wait(time(20).s())
	 * })
	 * 
	 * console.log(time, result) // 20000 undefined
	 * ```
	 * @since 1.5.3
	*/ fn<Fn extends () => Promise<any> | any>(fn: Fn): Fn extends () => Promise<infer R> ? Promise<[ number, Awaited<R> ]> : Fn extends () => infer R ? [ number, R ] : never {
		const startTime = performance.now()

		const res = fn()
		if (res instanceof Promise) return new Promise(async(resolve) => {
			const asyncRes = await res
			return resolve([ performance.now() - startTime, asyncRes ])
		}) as any
		else return [ performance.now() - startTime, res ] as any
	}
})