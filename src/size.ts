import { Multiply } from "ts-arithmetic"
import { isPromise } from "util/types"

class Size<Amount extends number, Factor extends 1000 | 1024 = 1024> {
	private amount: Amount
	private factor: Factor

	/**
	 * Initialize a new Size Class
	 * @since 1.6.0
	*/ constructor(amount: Amount, factor: Factor) {
		this.amount = amount
		this.factor = factor
	}


	/**
	 * Use the provided amount as bytes
	 * @example
	 * ```
	 * size(10).b() // 10
	 * ```
	 * @since 1.6.0
	*/ public b(): Amount {
		return this.amount
	}

	/**
	 * Use the provided amount as kilobytes
	 * @example
	 * ```
	 * time(10).kb() // 10240
	 * ```
	 * @since 1.6.0
	*/ public kb(): Multiply<Amount, Factor> {
		return this.amount * this.factor as never
	}

	/**
	 * Use the provided amount as megabytes
	 * @example
	 * ```
	 * time(10).mb() // 10485760
	 * ```
	 * @since 1.6.0
	*/ public mb(): Multiply<Multiply<Amount, Factor>, Factor> {
		return this.amount * this.factor * this.factor as never
	}

	/**
	 * Use the provided amount as gigabyte
	 * @example
	 * ```
	 * time(10).gb() // 10737418240
	 * ```
	 * @since 1.6.0
	*/ public gb(): Multiply<Multiply<Multiply<Amount, Factor>, Factor>, Factor> {
		return this.amount * this.factor * this.factor * this.factor as never
	}

	/**
	 * Use the provided amount as terabyte
	 * @example
	 * ```
	 * size(10).tb() // 10995116277760
	 * ```
	 * @since 1.6.0
	*/ public tb(): Multiply<Multiply<Multiply<Multiply<Amount, Factor>, Factor>, Factor>, Factor> {
		return this.amount * this.factor * this.factor * this.factor * this.factor as never
	}
}

/**
 * Utility for defining bytes
 * @example
 * ```
 * import { size } from "@rjweb/utils"
 * 
 * size(10).mb() // 10485760
 * size(10, 1000).mb() // 10000000
 * ```
 * @since 1.6.0
*/ export default function size<Amount extends number, Factor extends 1000 | 1024 = 1024>(amount: Amount, factor?: Factor): Size<Amount, Factor> {
	return new Size<Amount, Factor>(amount, factor ?? 1024 as never)
}