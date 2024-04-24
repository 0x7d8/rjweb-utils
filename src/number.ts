/**
 * Generate a Number
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.generate(10, 100) // 69
 * ```
 * @since 1.0.0
 * @supports nodejs, browser
*/ export function generate(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Generate a Number with crypto
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.generateCrypto(10, 100) // 63
 * ```
 * @since 1.12.10
 * @supports nodejs, browser
*/ export function generateCrypto(min: number, max: number): number {
	const array = new Uint32Array(1)
	globalThis.crypto.getRandomValues(array)

	return Math.floor((array[0] / 0xFFFFFFFF) * (max - min + 1) + min)
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
 * @supports nodejs, browser
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
 * @supports nodejs, browser
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
 * @supports nodejs, browser
*/ export function change(input: number, changed: number): number {
	return Math.round((((changed - input) / input) * 100) * 10) / 10
}

/**
 * Limit a Number
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.limit(100, 40) // 40
 * number.limit(100, 2000) // 100
 * number.limit(1042, 1000) // 1000
 * ```
 * @since 1.5.0
 * @supports nodejs, browser
*/ export function limit(input: number, max: number): number {
	if (input > max) return max
	else return input
}

/**
 * Clamp a Number
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.clamp(100, 40, 200) // 100
 * number.clamp(100, 2000, 200) // 200
 * number.clamp(1042, 1000, 2000) // 1042
 * ```
 * @since 1.12.10
 * @supports nodejs, browser
*/ export function clamp(input: number, min: number, max: number): number {
	if (input < min) return min
	else if (input > max) return max
	else return input
}