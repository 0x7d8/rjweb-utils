export const GOLDEN_RATIO = 1.618033988749895
export const E = 2.718281828459045
export const PI = 3.141592653589793
export const TAU = 6.283185307179586
export const PHI = (1 + Math.sqrt(5)) / 2
export const PSI = (1 - Math.sqrt(5)) / 2
export const SQRT5 = Math.sqrt(5)

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
	const array = new Uint32Array(4)
	globalThis.crypto.getRandomValues(array)

	const number = array.reduce((a, b) => a + b, 0)

	return Math.floor((number / 0xFFFFFFFF) * (max - min + 1) + min) % (max + 1)
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
	return ((changed - input) / input) * 100
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

/**
 * Get the factorial of a number
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.factorial(5) // 120
 * number.factorial(10) // 3628800
 * number.factorial(0) // 1
 * number.factorial(-1) // 1
 * ```
 * @since 1.12.17
 * @supports nodejs, browser
*/ export function factorial(input: number): number {
	if (input <= 1) return 1

	let result = 1
	for (let i = 2; i <= input; i++) {
		result *= i
	}

	return result
}

/**
 * Check if a number is between 2 numbers
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.between(5, 0, 10) // true
 * number.between(5, 10, 20) // false
 * number.between(5, 5, 5) // true
 * ```
 * @since 1.12.17
 * @supports nodejs, browser
*/ export function between(input: number, min: number, max: number): boolean {
	return input >= min && input <= max
}

/**
 * Check if a number is prime
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.prime(5) // true
 * number.prime(10) // false
 * ```
 * @since 1.12.17
 * @supports nodejs, browser
*/ export function prime(input: number): boolean {
	if (input <= 1) return false

	const sieve = new Array(input + 1).fill(true)
	sieve[0] = sieve[1] = false

	for (let i = 2; i <= input; i++) {
		if (sieve[i]) {
			for (let j = i * i; j <= input; j += i) {
				sieve[j] = false
			}
		}
	}

	return true
}

/**
 * Get the nth number in the fibonacci sequence (0-indexed)
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.fibonacci(5) // 5
 * number.fibonacci(10) // 55
 * number.fibonacci(0) // 0
 * number.fibonacci(-1) // 0
 * number.fibonacci(1) // 1
 * number.fibonacci(1.5) // 1
 * number.fibonacci(21.23) // 10946
 * ```
 * @since 1.12.17
 * @supports nodejs, browser
*/ export function fibonacci(input: number): number {
	input = Math.round(input)

	if (input === 1 || input === 2) return 1
	else if (input <= 0) return 0

	return Math.round(((Math.pow(PHI, input) - Math.pow(PSI, input)) / SQRT5))
}

/**
 * Get the triangle number of a number
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.triangle(5) // 15
 * number.triangle(10) // 55
 * ```
 * @since 1.12.17
 * @supports nodejs, browser
*/ export function triangle(input: number): number {
	return (input * (input + 1)) / 2
}

/**
 * Get the factors of a number
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.factors(5) // [1, 5]
 * number.factors(10) // [1, 2, 5, 10]
 * ```
 * @since 1.12.17
 * @supports nodejs, browser
*/ export function factors(input: number): number[] {
	const factors = []

	for (let i = 1; i <= input; i++) {
		if (input % i === 0) factors.push(i)
	}

	return factors
}

/**
 * Get the greatest common divisor of 2 numbers
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.gcd(5, 10) // 5
 * number.gcd(10, 15) // 5
 * ```
 * @since 1.12.17
 * @supports nodejs, browser
*/ export function gcd(a: number, b: number): number {
	if (b === 0) return a
	else return gcd(b, a % b)
}

/**
 * Get the least common multiple of 2 numbers
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.lcm(5, 10) // 10
 * number.lcm(10, 15) // 30
 * ```
 * @since 1.12.17
 * @supports nodejs, browser
*/ export function lcm(a: number, b: number): number {
	return (a * b) / gcd(a, b)
}

/**
 * Get whether a number is a power of another number
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.power(5, 25) // true
 * number.power(10, 15) // false
 * ```
*/ export function power(input: number, power: number): boolean {
	if (input === 0 || power === 0) return false

	return Math.pow(input, Math.round(Math.log(power) / Math.log(input))) === power
}

/**
 * Reduce a fraction to its simplest form
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.reduce(5, 10) // [1, 2]
 * number.reduce(10, 15) // [2, 3]
 * ```
 * @since 1.12.18
 * @supports nodejs, browser
*/ export function reduce(numerator: number, denominator: number): [number, number] {
	const _gcd = gcd(numerator, denominator)

	return [numerator / _gcd, denominator / _gcd]
}

/**
 * Turn a number into a fraction
 * @example
 * ```
 * import { number } from "@rjweb/utils"
 * 
 * number.fraction(0.5) // [1, 2]
 * number.fraction(0.6666666666666666) // [2, 3]
 * ```
 * @since 1.12.22
 * @supports nodejs, browser
 * @default tolerance = 1.0E-3 // 0.001
*/ export function fraction(input: number, tolerance = 1.0E-3): [number, number] {
	if (!Number.isFinite(input)) return [input, 1]

	let h1 = 1, h2 = 0, k1 = 0, k2 = 1, b = input

	do {
		const a = Math.floor(b)
		let aux = h1

		h1 = a * h1 + h2
		h2 = aux
		aux = k1
		k1 = a * k1 + k2
		k2 = aux
		b = 1 / (b - a)
	} while (Math.abs(input - h1 / k1) > input * tolerance)

	return [h1, k1]
}