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

	/**
	 * Use the provided amount as years
	 * @example
	 * ```
	 * time(10).y() // 31536000000000
	 * ```
	 * @since 1.12.9
	*/ public y(): Multiply<Multiply<Multiply<Multiply<Multiply<Amount, 1000>, 60>, 60>, 24>, 365> {
		return this.amount * 1000 * 60 * 60 * 24 * 365 as never
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
	 * @supports nodejs, browser
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
	 * @supports nodejs, browser
	*/ fn<Fn extends () => Promise<any> | any>(fn: Fn): Fn extends () => Promise<infer R> ? Promise<[ number, Awaited<R> ]> : Fn extends () => infer R ? [ number, R ] : never {
		const startTime = performance.now()

		const res = fn()
		if (res instanceof Promise) return new Promise(async(resolve) => {
			const asyncRes = await res
			return resolve([ performance.now() - startTime, asyncRes ])
		}) as any
		else return [ performance.now() - startTime, res ] as any
	},

	/**
	 * Parse a time string into milliseconds
	 * @example
	 * ```
	 * import { time } from "@rjweb/utils"
	 * 
	 * time.parse('2s') // 2000
	 * time.parse('2m 30 s') // 150000
	 * time.parse('2h 30minute 30s') // 9030000
	 * time.parse('2day 3minute 30h 30s 4 ms') // 183810004
	 * time.parse('Jan 2 2022') // <will depend on current date>
	 * time.parse('1w -1d') // 518400000
	 * time.parse('1d -12h') // 43200000
	 * time.parse('hi') // null
	 * ```
	 * @since 1.12.8
	 * @supports nodejs, browser
	*/ parse(input: string): number | null {
		const parsed = Date.parse(input)
		if (!isNaN(parsed)) return parsed - Date.now()

		const matches = input.match(/(-?\d+(?:\.\d+)?)\s*([a-zA-Z]+)/g)
		if (!matches) return null

		return matches.reduce((acc, match) => {
			const [ _, amount, unit ] = match.match(/(-?\d+(?:\.\d+)?)\s*([a-zA-Z]+)/)!

			const alias = Object.keys(timeAliases).find((key) => timeAliases[key as keyof Time<number>].includes(unit.toLowerCase())) as keyof Time<number> | undefined
			if (!alias) return acc

			return acc + new Time(parseFloat(amount))[alias]()
		}, 0)
	}
})

const timeAliases: Record<keyof Time<number>, string[]> = Object.freeze({
	ms: ['ms', 'millisecond', 'milliseconds'],
	s: ['s', 'sec', 'secs', 'second', 'seconds'],
	m: ['m', 'min', 'mins', 'minute', 'minutes'],
	h: ['h', 'hr', 'hour', 'hours'],
	d: ['d', 'day', 'days'],
	w: ['w', 'week', 'weeks'],
	y: ['y', 'year', 'years']
})