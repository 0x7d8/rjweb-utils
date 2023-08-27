/**
 * Generate a Number
 * @default
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.generate(10, 100) // 69
 * ```
 * @since 1.0.0
*/ export function generate(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min)
}