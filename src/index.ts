export * as array from "./array"
export * as string from "./string"
export * as number from "./number"
export * as object from "./object"
export * as network from "./network"
export * as system from "./system"
export * as queue from "./queue"
export * as filesystem from "./filesystem"
export { default as time } from "./time"
export { default as size } from "./size"

/** @ts-ignore */
import { version } from "./pckg.json"
export const Version: string = version

export type DeepRequired<Type> = Type extends {}
		? Type extends Map<any, any>
			? Required<Type>
		: Type extends Set<any>
			? Required<Type> 
		: Type extends Buffer
			? Required<Type>
		: Type extends Function
			? Required<Type>
		: Type extends Array<any>
			? Required<Type>
		: Type extends {}
			? { [Key in keyof Type]-?: DeepRequired<Type[Key]> }
		: Required<Type>
	: Required<Type>

/**
 * Cast a Value as something else (ts only)
 * @warning THIS DOES NOT DO ANY VALIDATION!! USE WITH CARE.
 * @example
 * ```
 * const descriptor: PropertyDescriptor = ...
 * 
 * as<number[]>(descriptor.value).push(2)
 * ```
 * @since 1.0.0
*/ export function as<T>(input: any): T {
	return input
}