/**
 * Generate a Number
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.generate(10, 100) // 69
 * ```
 * @since 1.0.0
*/ export function generate(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Apply % to a number
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.percent(50, 10) // 55
 * number.percent(50, -10) // 45
 * ```
 * @since 1.2.0
*/ export function percent(input: number, percent: number): number {
	return input + ((percent / 100) * input)
}

/**
 * Get % change of 2 numbers
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.change(50, 75) // 50
 * number.change(50, 25) // -50
 * ```
 * @since 1.2.0
*/ export function change(input: number, changed: number): number {
	return Math.round((((changed - input) / input) * 100) * 10) / 10
}