import * as number from "./number"

/**
 * Remove something from an Array
 * @example
 * ```
 * import { array } from "@rjweb/utils"
 * 
 * const arr = [1, 2, 3, 4, 5]
 * 
 * array.remove(arr, 'index', 1) // [1, 3, 4, 5]
 * array.remove(arr, 'value', 1) // [2, 3, 4, 5]
 * ```
 * @since 1.0.0
 * @supports nodejs, browser
*/ export function remove<Arr extends any[], Mode extends 'index' | 'value'>(input: Arr, mode: Mode, value: Mode extends 'index' ? number : Arr[number] | ((val: Arr[number]) => boolean)): Arr {
	switch (mode) {
		case "index": {
			const val = value as number

			if (val > input.length - 1) return input

			const copy = input.slice(0)
			copy.splice(val, 1)

			return copy as never
		}

		case "value": {
			if (typeof value === 'function') return input.filter((v) => !value(v)) as never

			return input.filter((v) => v !== value) as never
		}
	}

	return input
}

/**
 * Rotate an Array
 * @example
 * ```
 * import { array } from "@rjweb/utils"
 * 
 * const arr = ['A', 'B', 'C', 'D', 'E']
 * 
 * array.rotate(arr, 2) // ['C', 'D', 'E', 'A', 'B']
 * array.rotate(arr, 4) // ['E', 'A', 'B', 'C', 'D']
 * ```
 * @since 1.4.4
 * @supports nodejs, browser
*/ export function rotate<Arr extends any[]>(input: Arr, rotations: number): Arr {
	if (input.length < 2) return input

	const arr = Array.from(input) as Arr

	for (let i = 0; i < rotations; i++) {
    arr.push(arr.shift())
  }

  return arr
}

/**
 * Get the Average of all Numbers in an Array
 * @example
 * ```
 * import { array } from "@rjweb/utils"
 * 
 * const arr = [4, 65, 76, 90, 1, -3]
 * 
 * array.average(arr) // 38.833333333333336
 * ```
 * @since 1.4.5
 * @supports nodejs, browser
*/ export function average(input: number[]) : number {
	return input.reduce((prev, current) => prev + current, 0) / input.length
}

/**
 * Get the Median of all Numbers in an Array
 * @example
 * ```
 * import { array } from "@rjweb/utils"
 * 
 * const arr = [4, 65, 76, 90, 1, -3]
 * 
 * array.median(arr) // 35
 * ```
 * @since 1.12.18
 * @supports nodejs, browser
*/ export function median(input: number[]): number {
	const sorted = input.sort((a, b) => a - b)
	const mid = Math.floor(sorted.length / 2)

	if (sorted.length % 2 === 0) {
		return (sorted[mid - 1] + sorted[mid]) / 2
	} else {
		return sorted[mid]
	}
}

/**
 * Get the Mode of all Numbers in an Array
 * @example
 * ```
 * import { array } from "@rjweb/utils"
 * 
 * const arr = [4, 65, 76, 90, 1, -3, 4, 4, 65, 65]
 * 
 * array.mode(arr) // 4
 * ```
 * @since 1.12.18
 * @supports nodejs, browser
*/ export function mode(input: number[]): number {
	const count = new Map<number, number>()

	for (const num of input) {
		count.set(num, (count.get(num) ?? 0) + 1)
	}

	let max = 0
	let mode = 0

	for (const [key, value] of count) {
		if (value > max) {
			max = value
			mode = key
		}
	}

	return mode
}

/**
 * Get the Sum of Numbers in an Array
 * @example
 * ```
 * import { array } from "@rjweb/utils"
 * 
 * const arr = [1, 2, 3, 4, 5]
 * 
 * array.sum(arr) // 15
 * ```
 * @since 1.3.0
 * @supports nodejs, browser
*/ export function sum(input: number[]): number {
	let sum = 0

	for (let i = 0; i < input.length; i++) {
		sum += input[i]
	}

	return sum
}

/**
 * Limit an Array
 * @example
 * ```
 * import { array } from "@rjweb/utils"
 * 
 * array.limit([1, 2, 3, 4, 5, 6, 7], 5) // [1, 2, 3, 4, 5, '...']
 * array.limit([1, 2, 3, 4, 5, 6, 7], 5, '!') // [1, 2, 3, 4, 5, '!']
 * ```
 * @since 1.5.2
 * @supports nodejs, browser
*/ export function limit<Arr extends any[], End extends any = '...'>(input: Arr, length: number, end?: End): [...Arr, End] {
	if (input.length <= length) return input as never
	else return input.slice(0, length).concat(end ?? '...') as never
}

/**
 * Check if each element in an Array is equal to the first (uses `===` so no objects)
 * @example
 * ```
 * import { array } from "@rjweb/utils"
 * 
 * array.equal([1, 2, 3, 4, 5]) // false
 * array.equal([1, 1, 1, 1]) // true
 * ```
 * @since 1.5.4
 * @supports nodejs, browser
*/ export function equal(input: any[]): boolean {
	if (input.length <= 1) return true

	for (let i = 0; i < input.length; i++) {
		if (i === 0) continue

		if (input[i] !== input[0]) return false
	}

	return true
}

/**
 * Get a random value of an Array
 * @example
 * ```
 * import { array } from "@rjweb/utils"
 * 
 * const arr = ['A', 'B', 'C', 'D', 'E']
 * 
 * array.random(arr, 2) // 'C'
 * array.random(arr, 4) // 'A'
 * ```
 * @since 1.9.1
 * @supports nodejs, browser
*/ export function random<Arr extends any[]>(input: Arr): Arr[number] | undefined {
	if (!input.length) return undefined

  return input[number.generate(0, input.length - 1)]
}

/**
 * Get a random value of an Array with crypto
 * @example
 * ```
 * import { array } from "@rjweb/utils"
 * 
 * const arr = ['A', 'B', 'C', 'D', 'E']
 * 
 * array.randomCrypto(arr, 2) // 'C'
 * array.randomCrypto(arr, 4) // 'A'
 * ```
 * @since 1.12.12
 * @supports nodejs, browser
*/ export function randomCrypto<Arr extends any[]>(input: Arr): Arr[number] | undefined {
	if (!input.length) return undefined

	return input[number.generateCrypto(0, input.length - 1)]
}

/**
 * Randomize an Array
 * @example
 * ```
 * import { array } from "@rjweb/utils"
 * 
 * const arr = ['A', 'B', 'C', 'D', 'E']
 * 
 * array.randomize(arr) // ['C', 'D', 'E', 'A', 'B']
 * array.randomize(arr) // ['E', 'A', 'C', 'B', 'D']
 * ```
 * @since 1.9.1
 * @supports nodejs, browser
*/ export function randomize<Arr extends any[]>(input: Arr): Arr {
	if (input.length < 2) return input

	const arr = Array.from(input) as Arr

	for (let i = arr.length - 1; i > 0; i--) {
		const j = number.generate(0, i)
		const temp = arr[i]
		arr[i] = arr[j]
		arr[j] = temp
	}

	return arr
}

/**
 * Randomize an Array with crypto
 * @example
 * ```
 * import { array } from "@rjweb/utils"
 * 
 * const arr = ['A', 'B', 'C', 'D', 'E']
 * 
 * array.randomizeCrypto(arr) // ['C', 'D', 'E', 'A', 'B']
 * array.randomizeCrypto(arr) // ['E', 'A', 'C', 'B', 'D']
 * ```
 * @since 1.12.12
 * @supports nodejs, browser
*/ export function randomizeCrypto<Arr extends any[]>(input: Arr): Arr {
	if (input.length < 2) return input

	const arr = Array.from(input) as Arr,
		randomData = new Uint32Array(arr.length)

	globalThis.crypto.getRandomValues(randomData)

	for (let i = arr.length - 1; i > 0; i--) {
		const j = randomData[i] % i
		const temp = arr[i]
		arr[i] = arr[j]
		arr[j] = temp
	}

	return arr
}

/**
 * Split an Array into chunks
 * @example
 * ```
 * import { array } from "@rjweb/utils"
 * 
 * const arr = ['A', 'B', 'C', 'D', 'E']
 * 
 * array.chunk(arr, 2) // [['A', 'B'], ['C', 'D'], ['E']]
 * array.chunk(arr, 3) // [['A', 'B', 'C'], ['D', 'E']]
 * ```
 * @since 1.12.28
 * @supports nodejs, browser
*/ export function chunk<Arr extends any[]>(input: Arr, size: number): Arr[] {
	const chunks = []

	for (let i = 0; i < input.length; i += size) {
		chunks.push(input.slice(i, i + size))
	}

	return chunks as never
}