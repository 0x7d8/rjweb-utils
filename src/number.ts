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
 * Round a Number
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.round(10.32659395235, 2) // 10.33
 * ```
 * @since 1.3.0
*/ export function round(input: number, decimals: number): number {
	const offset = Math.pow(10, Math.floor(decimals))

	return Math.round(input * offset) / offset
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