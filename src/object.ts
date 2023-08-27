import { DeepRequired } from "."

/**
 * Deep Parse an Object
 * @example
 * ```
 * import { object } from "@rjweb/utils"
 * 
 * object.deepParse({
 *   ok: true,
 *   nvm: 0
 * }, {
 *   ok: false
 * }) // { ok: false, nvm: 0 }
 * ```
 * @since 1.0.0
*/ export function deepParse<Obj extends Record<any, any>>(object: DeepRequired<Obj>, provided: Partial<Obj>): DeepRequired<Obj> {
	const handleObject = (object: Record<string, any>, merge: Record<string, any>) => {
		let output: Record<string, any> = {}
		Object.keys(object).forEach((key) => {
			if (typeof object[key] === 'object' && !Array.isArray(merge[key]) && key in merge) output[key] = handleObject(object[key], merge[key])
			else if (typeof object[key] === 'object' && !Array.isArray(merge[key])) output[key] = object[key]
			else if (!Array.isArray(merge[key]) && key in merge) output[key] = merge[key]
			else if (Array.isArray(merge[key])) output[key] = merge[key]
			else output[key] = object[key]
		})

		return output
	}

	return handleObject(object, provided) as any
}
	
/**
 * Deep Compare Objects
 * @example
 * ```
 * import { object } from "@rjweb/utils"
 * 
 * object.deepCompare({ ok: true, e: { g: 0 } }, { ok: true, e: {} }) // false
 * object.deepCompare({ ok: true, e: { g: 0 } }, { ok: true, e: { g: 0 } }) // true
 * ```
 * @since 1.0.0
*/ export function deepCompare<Object extends Record<any, any>, Compare extends Record<any, any>>(object: Object, compare: Compare): compare is Object {
	if (Object.is(object, compare)) return true

	const handleObject = (object: Record<string, any>, compare: Record<string, any>) => {
		Object.keys(object).forEach((key) => {
			if (!compare[key]) throw false
			if (typeof object[key] !== typeof compare[key]) throw false
			if (typeof object[key] !== 'object' && object[key] !== compare[key]) throw false
			if (typeof object[key] === 'object') handleObject(object[key], compare[key])
		})

		return true
	}

	try {
		return handleObject(object, compare)
	} catch {
		return false
	}
}