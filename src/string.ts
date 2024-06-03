import * as crypto from "crypto"
import { ArrayOrNot } from "."

const lowercase = Object.freeze('abcdefghijklmnopqrstuvwxyz'.split(''))
const uppercase = Object.freeze('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''))
const numbers = Object.freeze('0123456789'.split(''))
const symbols = Object.freeze('!@#$%^&*()+_-=}{[]|:;"/?.><,`~'.split(''))

/**
 * Hash a String
 * @example
 * ```
 * import { string } from "@rjweb/utils"
 * 
 * string.hash('Hello', { algorithm: 'sha256', salt: '123', output: 'hex' }) // 91be40b8a3959b7821be224d8ce5ad09874fc84dcacd9fed77bf07000141e15a
 * ```
 * @since 1.0.0
 * @supports nodejs
*/ export function hash<Options extends {
	/**
	 * The Algorithm to use
	 * @default "sha256"
	 * @since 1.0.0
	*/ algorithm?: ArrayOrNot<string>
	/**
	 * The Salt to add
	 * @since 1.0.0
	*/ salt?: string
	/**
	 * The Output type to emit
	 * @default "hex"
	 * @since 1.0.0
	*/ output?: crypto.BinaryToTextEncoding | 'buffer'
}>(input: string, options?: Options): Options['algorithm'] extends Array<any>
? { [Key in Options['algorithm'][number]]: Options['output'] extends 'buffer' ? Buffer : string }
: Options['output'] extends 'buffer' ? Buffer : string {
	const pOptions = {
		algorithm: options?.algorithm ?? 'sha256',
		salt: options?.salt,
		output: options?.output ?? 'hex'
	}

	pOptions.algorithm = Array.isArray(pOptions.algorithm) ? pOptions.algorithm : [pOptions.algorithm]

	const hashes: Record<string, crypto.Hash | crypto.Hmac> = Object.fromEntries(pOptions.algorithm.map((a) => [a, pOptions.salt ? crypto.createHmac(a, pOptions.salt).update(input) : crypto.createHash(a).update(input)]))

	if (Array.isArray(options?.algorithm)) {
		return Object.fromEntries(pOptions.algorithm.map((a) => [a, pOptions.output === 'buffer' ? hashes[a].digest() : hashes[a].digest(pOptions.output)])) as never
	} else {
		return pOptions.output === 'buffer' ? hashes[pOptions.algorithm[0]].digest() as never : hashes[pOptions.algorithm[0]].digest(pOptions.output) as never
	}
}

/**
 * Encrypt a String
 * @example
 * ```
 * import { string } from "@rjweb/utils"
 * 
 * string.encrypt('Hello', 'secret', { algorithm: 'aes-256-cbc', output: 'hex' }) // df4d0fe46e0210d4ef46368a6c3d56bb
 * ```
 * @since 1.0.0
 * @supports nodejs
*/ export function encrypt<Options extends {
	/**
	 * The Algorithm to use
	 * @default "aes-256-cbc"
	 * @since 1.0.0
	*/ algorithm?: string
	/**
	 * The Output type to emit
	 * @default "hex"
	 * @since 1.0.0
	*/ output?: BufferEncoding | 'buffer'
}>(input: string, key: crypto.BinaryLike, options?: Options): Options['output'] extends 'buffer' ? Buffer : string {
	const pOptions = {
		algorithm: options?.algorithm ?? 'aes-256-cbc',
		output: options?.output ?? 'hex'
	}

	const iv = Buffer.alloc(16, 0)

	const enCipher = crypto.createCipheriv(pOptions.algorithm, crypto.createHash('sha256').update(key).digest('base64').substring(0, 32), iv)
	const data = Buffer.concat([ enCipher.update(input), enCipher.final() ])

	let out: string | Buffer

	if (pOptions.output === 'buffer') out = data
	else out = data.toString(pOptions.output)

	return out as any
}

/**
 * Decrypt a String
 * @example
 * ```
 * import { string } from "@rjweb/utils"
 * 
 * string.decrypt('df4d0fe46e0210d4ef46368a6c3d56bb', 'secret', { algorithm: 'aes-256-cbc', input: 'hex' }) // Hello
 * ```
 * @since 1.0.0
 * @supports nodejs
*/ export function decrypt<Options extends {
	/**
	 * The Algorithm to use
	 * @default "aes-256-cbc"
	 * @since 1.0.0
	*/ algorithm?: string
	/**
	 * The Input type to handle
	 * @default "hex"
	 * @since 1.0.0
	*/ input?: BufferEncoding | 'buffer'
}>(input: Options['input'] extends 'buffer' ? Buffer : string, key: crypto.BinaryLike, options?: Options): string {
	const pOptions = {
		algorithm: options?.algorithm ?? 'aes-256-cbc',
		input: options?.input ?? 'hex'
	}

	const iv = Buffer.alloc(16, 0)

	const deCipher = crypto.createDecipheriv(pOptions.algorithm, crypto.createHash('sha256').update(key).digest('base64').substring(0, 32), iv)
	const data = Buffer.concat([ deCipher.update(pOptions.input === 'buffer' ? input.toString('hex') : input as string, pOptions.input === 'buffer' ? 'hex' : pOptions.input), deCipher.final() ])

	return data.toString()
}

/**
 * Generate a Random String
 * @example
 * ```
 * import { string } from "@rjweb/utils"
 * 
 * string.generate({ length: 5, numbers: true, ... }) // fgD43
 * ```
 * @since 1.0.0
 * @supports nodejs, browser
*/ export function generate(options?: {
	/**
   * The Length of the String
   * @default 12
	 * @since 1.0.0
  */ length?: number
  /**
   * Whether Numbers should be included
   * @default true
	 * @since 1.0.0
  */ numbers?: boolean
  /**
   * Whether Symbols should be included
   * @default false
	 * @since 1.0.0
  */ symbols?: boolean
  /**
   * Whether Uppercase Letters should be included
   * @default true
	 * @since 1.0.0
  */ uppercase?: boolean
  /**
   * Whether Lowercase Letters should be included
   * @default true
	 * @since 1.0.0
  */ lowercase?: boolean
  /**
   * Letters / Symbols that shouldnt be included
   * @default []
	 * @since 1.0.0
  */ exclude?: string[]
}): string {
	const pOptions = {
		length: options?.length ?? 12,
		numbers: options?.numbers ?? true,
		symbols: options?.symbols ?? false,
		uppercase: options?.uppercase ?? true,
		lowercase: options?.lowercase ?? true,
		exclude: options?.exclude ?? []
	}

	const chars: string[] = []

	if (pOptions.numbers) chars.push(...numbers)
	if (pOptions.symbols) chars.push(...symbols)
	if (pOptions.uppercase) chars.push(...uppercase)
	if (pOptions.lowercase) chars.push(...lowercase)

	for (const exclude of pOptions.exclude) {
		const index = chars.indexOf(exclude)
		if (index > -1) chars.splice(index, 1)
	}

	if (!chars.length) throw new Error('No Characters to choose from')

	let result = ''
	const random = new Uint32Array(pOptions.length)
	globalThis.crypto.getRandomValues(random)

	for (let i = 0; i < pOptions.length; i++) {
		result += chars[random[i] % chars.length]
	}

	return result
}

/**
 * Generate a String with Random Segments
 * @example
 * ```
 * import { string } from "@rjweb/utils"
 * 
 * string.generateSegments([2, 5, 3], '-', { numbers: true, ... }) // dK-4Rflk-jGb
 * ```
 * @since 1.0.0
 * @supports nodejs, browser
*/ export function generateSegments(segments: number[], seperator: string = '-', options?: {
  /**
   * Whether Numbers should be included
   * @default true
	 * @since 1.0.0
  */ numbers?: boolean
  /**
   * Whether Symbols should be included
   * @default false
	 * @since 1.0.0
  */ symbols?: boolean
  /**
   * Whether Uppercase Letters should be included
   * @default true
	 * @since 1.0.0
  */ uppercase?: boolean
  /**
   * Whether Lowercase Letters should be included
   * @default true
	 * @since 1.0.0
  */ lowercase?: boolean
  /**
   * Letters / Symbols that shouldnt be included
   * @default []
	 * @since 1.0.0
  */ exclude?: string[]
}): string {
	const full = generate({ length: segments.reduce((a, b) => a + b, 0), numbers: options?.numbers, symbols: options?.symbols, uppercase: options?.uppercase, lowercase: options?.lowercase, exclude: options?.exclude })

	let result = '',
		index = 0

	for (const segment of segments) {
		result += full.slice(index, index + segment) + seperator
		index += segment
	}

	return result.slice(0, -seperator.length)
}

/**
 * Limit a String
 * @example
 * ```
 * import { string } from "@rjweb/utils"
 * 
 * string.limit('Hello sir', 5) // Hello...
 * string.limit('Hello sir', 5, '!') // Hello!
 * string.limit('OKay sir', 500) // OKay sir
 * string.limit('Hi Sir', 3) // Hi...
 * string.limit('   Ok       ', 3) // Ok
 * ```
 * @since 1.0.0
 * @supports nodejs, browser
*/ export function limit(input: string, length: number, end: string = '...'): string {
	const trimmed = input.trimStart()
	
	if (trimmed.length < length) return trimmed
	else return (trimmed.slice(0, length) + end).trimEnd()
}

/**
 * Replace Something in a String with async callback
 * @example
 * ```
 * import { string } from "@rjweb/utils"
 * import db from "somewhere"
 * 
 * string.replaceAsync('very long string or something', /./g, async(match) => {
 *   const result = await db.get(match)
 * 
 *   return result
 * })
 * ```
 * @since 1.8.3
 * @supports nodejs, browser
*/ export async function replaceAsync(input: string, searchValue: string | RegExp, replacer: (match: string) => string | Promise<string>): Promise<string> {
  try {
    if (typeof replacer === 'function') {
      const values: (string | Promise<string>)[] = []

      String.prototype.replace.call(input, searchValue as any, (match) => {
        values.push(replacer(match))

        return ''
      })

      const resolvedValues = await Promise.all(values)
			return String.prototype.replace.call(input, searchValue as any, () => {
				return resolvedValues.shift()!
			})
    } else {
      return Promise.resolve(String.prototype.replace.call(input, searchValue as any, replacer))
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Parse a String into an Object using basic env syntax
 * 
 * This parses line by line so an invalid line will just be skipped
 * @example
 * ```
 * import { string } from "@rjweb/utils"
 * 
 * string.env('K=12') // {K:'12'}
 * string.env('E="400"') // {E:'400'}
 * string.env('some invalid string') // {}
 * ```
 * @since 1.10.4
 * @supports nodejs, browser
*/ export function env(input: string): Record<string, string> {
	const parsed: Record<string, string> = {}

	for (const line of input.split('\n')) {
		const match = line.match(/^\s*([^=\s]+)\s*=\s*(?:(['"])(.*?)\2|([^'"\s]+))\s*(?:#.*)?$/)
		if (!match) continue

		parsed[match[1]] = match[3] || match[4]
	}

	return parsed
}

/**
 * Parse a String into an Object using basic key value syntax
 * @example
 * ```
 * import { string } from "@rjweb/utils"
 * 
 * string.kv('K=12') // {K:'12'}
 * string.kv('E="400"') // {E:'"400"'}
 * string.kv('sofhjjsihgai') // {sofhjjsihgai:''}
 * string.kv('hi=ok&eeee=%20') // {hi:'ok', eeee:'%20'}
 * string.kv('hi=ok&eeee=%20', decodeURIComponent) // {hi:'ok', eeee:' '}
 * string.kv('aaa&bbb') // {aaa:'', bbb:''}
 * string.kv('aaa#g.1', null, '#', '.') // {aaa:'', g: '1'}
 * ```
 * @since 1.12.19
 * @supports nodejs, browser
*/ export function kv(input: string, decode?: ((input: string) => string) | null, seperator?: string | null, equals?: string | null): Record<string, string> {
	const values: Record<string, string> = {}

	let progress = 0
	while (progress < input.length) {
		let splitterPos = input.indexOf(seperator ?? '&', progress)
		if (splitterPos === -1) splitterPos = input.length

		let equalPos = input.slice(progress, splitterPos).indexOf(equals ?? '=')
		if (equalPos === -1) equalPos = splitterPos

		let sliced = input.slice(progress + equalPos + 1, splitterPos), decodedVal: string
		if (decode) try { decodedVal = decode(sliced) } catch { decodedVal = sliced }
		else decodedVal = sliced

		values[input.slice(progress, progress + equalPos).trim()] = decodedVal

		progress = splitterPos + 1
	}

	return values
}

class CompiledVariableParser<Data> {
	constructor(
		private variables: Record<string, { args: Record<string, boolean>, handler: (data: Data, args: Record<string, string | undefined>, invalid: (reason: string) => '') => string | Promise<string> }>
	) {}

	/**
	 * Validate a String for this parser
	 * @warning THIS WILL RUN ASYNC HANDLERS TOO
	 * @since 1.8.3
	*/ public async validate(input: string, data: Data): Promise<{ valid: true } | { valid: false, error: string }> {
		try {
			await replaceAsync(input, /{{(\w*)+(\(.*?\))?}}/g, async(match) => {
				const slicedMatch = match.slice(2, -2)
	
				const bracketIndex = slicedMatch.indexOf('(')

				const name = slicedMatch.slice(0, bracketIndex < 0 ? slicedMatch.length : bracketIndex),
					variable = this.variables[name]

				if (!variable) throw `Unknown Variable \`${name}\``

				const args = bracketIndex < 0 ? [] : slicedMatch.slice(bracketIndex + 1, slicedMatch.length - 1).split(/(?<!\\),/),
					parsedArgs: Record<string, string | undefined> = {}

				let index = -1
				for (const key in variable.args) {
					++index

					if (variable.args[key] && !args[index]) throw `Required Argument \`${key}\` not supplied to \`${name}\``
					parsedArgs[key] = args[index]?.trim()?.replaceAll('\\,', ',')
				}

				let endEarly: string | null = null
				const result = await Promise.resolve(variable.handler(data, parsedArgs, (reason) => {
					endEarly = reason
					return '' as const
				}))

				if (endEarly) throw endEarly
				else return result
			})

			return { valid: true }
		} catch (err: any) {
			return { valid: false, error: String(err) }
		}
	}

	/**
	 * Parse a String using this parser
	 * @since 1.8.3
	*/ public parse(input: string, data: Data): Promise<string> {
		return replaceAsync(input, /{{(\w*)+(\(.*?\))?}}/g, async(match) => {
			const slicedMatch = match.slice(2, -2)

			const bracketIndex = slicedMatch.indexOf('(')

			try {
				const variable = this.variables[slicedMatch.slice(0, bracketIndex < 0 ? slicedMatch.length : bracketIndex)]
				if (!variable) return match

				const args = bracketIndex < 0 ? [] : slicedMatch.slice(bracketIndex + 1, slicedMatch.length - 1).split(/(?<!\\),/),
					parsedArgs: Record<string, string | undefined> = {}

				let index = -1
				for (const key in variable.args) {
					++index

					if (variable.args[key] && !args[index]) return match
					parsedArgs[key] = args[index]?.trim()?.replaceAll('\\,', ',')
				}

				let endEarly = false
				const result = await Promise.resolve(variable.handler(data, parsedArgs, () => {
					endEarly = true
					return '' as const
				}))

				if (endEarly) return match
				else return result
			} catch {
				return match
			}
		})
	}
}

class VariableParserArgBuilder<Args extends Record<string, boolean> = {}> {
	protected arguments: Args = {} as any

	/**
	 * Add a Required Argument
	 * @since 1.8.3
	*/ public required<Name extends string>(name: Name): VariableParserArgBuilder<Args & Record<Name, true>> {
		this.arguments[name] = true as any

		return this as any
	}

	/**
	 * Add an Optional Argument
	 * @since 1.8.3
	*/ public optional<Name extends string>(name: Name): VariableParserArgBuilder<Args & Record<Name, false>> {
		this.arguments[name] = false as any

		return this as any
	}
}

/**
 * Parse Variables in a String
 * ```
 * import { string, number } from "@rjweb/utils"
 * 
 * type Data = {
 *   something: number
 * }
 * 
 * const parser = new string.VariableParser<Data>()
 *   .variable(
 *     'round',
 *     (args) => args
 *       .required('number')
 *       .optional('decimals'),
 *     (data, args, invalid) => {
 *       const num = parseFloat(args.number)
 *       if (isNaN(num)) return invalid('Invalid Number')
 * 
 *       const decimals = args.decimals ? parseInt(args.decimals) : 2
 *       if (isNaN(decimals) || decimals > 6) return invalid('Invalid Decimal Amount')
 * 
 *       return number.round(num * data.something, decimals).toString()
 *     }
 *   )
 *   .variable(
 *     'echo',
 *     (args) => args
 *       .required('text'),
 *     (data, args) => {
 *       return args.text
 *     }
 *   )
 *   .compile()
 * 
 * await parser.validate('Hi', { something: 1 }) // { valid: true }
 * await parser.validate('Hi {{round}}', { something: 1 }) // { valid: false, error: ['Missing Required Arguments to `round`'] }
 * await parser.parse('I have {{round(10.32323463246, 4)}}{{echo(€\\, Sir.)}}', { something: 1 }) // 'I have 10.3232€, Sir.'
 * ```
 * @since 1.8.3
 * @supports nodejs, browser
*/ export class VariableParser<Data = undefined> {
	private variables: Record<string, { args: Record<string, boolean>, handler: (data: Data, args: Record<string, string | undefined>, invalid: (reason: string) => '') => string | Promise<string> }> = {}

	/**
	 * Add a new Variable to the Parser
	 * @since 1.8.3
	*/ public variable<Args extends (arg: VariableParserArgBuilder) => VariableParserArgBuilder>(
		name: string, args: Args, handler: (data: Data, args: {
			[x in (ReturnType<Args> extends VariableParserArgBuilder<infer D> ? keyof D : keyof {})]: ReturnType<Args> extends VariableParserArgBuilder<infer D> ? D[x] extends true ? string : string | undefined : never
		}, invalid: (reason: string) => '') => string | Promise<string>
	): this {
		this.variables[name] = { args: args(new VariableParserArgBuilder())['arguments'], handler: handler as any }
		return this
	}

	/**
	 * Compile the Parser into something usable
	 * @since 1.8.3
	*/ public compile(): CompiledVariableParser<Data> {
		return new CompiledVariableParser<Data>(this.variables)
	}
}

/**
 * Check how similar two strings are
 * @example
 * ```
 * import { string } from "@rjweb/utils"
 * 
 * string.similarity('Hello', 'Hello') // 100
 * string.similarity('Hello', 'Helo') // 80
 * string.similarity('Hello', 'sadfasdf') // 0
 * string.similarity('Hello', 'Hello World') // 50
 * ```
 * @since 1.12.10
 * @supports nodejs, browser
*/ export function similarity(a: string, b: string): number {
	if (a === b) return 100

	a = a.replaceAll(' ', '').toLowerCase()
	b = b.replaceAll(' ', '').toLowerCase()

	const length = Math.max(a.length, b.length)
	let matches = 0

	for (let i = 0; i < a.length; i++) {
		if (b.includes(a[i])) matches++
	}

	return (matches / length) * 100
}