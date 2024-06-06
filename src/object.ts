import { DeepRequired, UnionToIntersection } from "."

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
 * @supports nodejs, browser
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
 * @supports nodejs, browser
*/ export function deepCompare<Object extends Record<any, any>, Compare extends Record<any, any>>(object: Object, compare: Compare): compare is Object {
	if (Object.is(object, compare)) return true

	const handleObject = (object: Record<string, any>, compare: Record<string, any>) => {
		Object.keys(object).forEach((key) => {
			if (key in compare) throw false
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

/**
 * Deep Merge Objects
 * @example
 * ```
 * import { object } from "@rjweb/utils"
 * 
 * object.deepMerge({ ok: true, e: { g: 0 }, items: ['hi'] }, { ok: false, e: 213, items: ['ok'] }) // { ok: false, e: 213, items: ['hi', 'ok'] }
 * object.deepMerge({ ok: true, e: 'hello', { ok: false, e: { g: 1 } }, { ok: true, e: { g: 2 } }) // { ok: true, e: { g: 2 } }
 * ```
 * @since 1.12.7
 * @supports nodejs, browser
*/ export function deepMerge<Obj extends Record<any, any>[]>(...objects: Obj): UnionToIntersection<Obj[number]> {
	const isObject = (item: any) => typeof item === 'object' && !Array.isArray(item)

	return objects.reduce((acc, obj) => {
		Object.keys(obj).forEach((key) => {
			if (isObject(obj[key]) && isObject(acc[key])) {
				acc[key] = deepMerge(acc[key], obj[key])
			} else if (Array.isArray(obj[key]) && Array.isArray(acc[key])) {
				acc[key].push(...obj[key])
			} else {
				acc[key] = obj[key]
			}
		})

		return acc
	}, {} as Obj[number]) as never
}

/**
 * Pick Properties from an Object
 * @example
 * ```
 * import { object } from "@rjweb/utils"
 * 
 * object.pick({ ok: true, e: 0 }, ['ok']) // { ok: true }
 * object.pick({ ok: true, e: 0 }, ['ok', 'e']) // { ok: true, e: 0 }
 * ```
 * @since 1.12.15
 * @supports nodejs, browser
*/ export function pick<Object extends Record<any, any>, Keys extends keyof Object>(object: Object, keys: Keys[]): Pick<Object, Keys> {
	return keys.reduce((acc, key) => {
		acc[key] = object[key]
		return acc
	}, {} as Pick<Object, Keys>)
}

/**
 * Order Properties from an Object
 * 
 * This function will order the properties of an object based on the provided keys
 * and return a **NEW** object with the ordered properties.
 * @example
 * ```
 * import { object } from "@rjweb/utils"
 * 
 * object.order({ ok: true, e: 0 }, ['e', 'ok']) // { e: 0, ok: true }
 * object.order({ ok: true, e: 0, aaa: true }, ['ok', 'e']) // { ok: true, e: 0, aaa: true }
 * ```
 * @since 1.12.20
 * @supports nodejs, browser
*/ export function order<Object extends Record<any, any>, Keys extends keyof Object>(object: Object, keys: Keys[]): Object {
	const obj = keys.reduce((acc, key) => {
		acc[key] = object[key]

		return acc
	}, {} as Record<any, any>)

	Object.keys(object).forEach((key) => {
		if (!keys.includes(key as any)) obj[key] = object[key]
	})

	return obj
}