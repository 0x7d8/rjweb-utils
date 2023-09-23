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
*/ export function rotate<Arr extends any[]>(input: Arr, rotations: number): Arr {
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
*/ export function average(input: number[]) : number {
	return input.reduce((prev, current) => prev + current, 0) / input.length
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
*/ export function limit<Arr extends any[], End extends any = '...'>(input: Arr, length: number, end?: End): [...Arr, End] {
	if (input.length <= length) return input as never
	else return input.slice(0, length).concat(end ?? '...') as never
}