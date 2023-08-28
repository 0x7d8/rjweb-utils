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
*/ export function sum(input: number[]): number {
	return input.reduce((prev, current) => prev + current, 0)
}