import * as crypto from "crypto"

let randomIndex: number
let randomBytes: Buffer

const getNextRandomValue = () => {
	if (randomIndex === undefined || randomIndex >= randomBytes.length) {
		randomIndex = 0
		randomBytes = crypto.randomBytes(256)
	}

	const result = randomBytes[randomIndex]
	randomIndex += 1

	return result
}

const randomNumber = (max: number) => {
	let rand = getNextRandomValue()
	while (rand >= 256 - (256 % max)) rand = getNextRandomValue()

	return rand % max
}

const lowercase = 'abcdefghijklmnopqrstuvwxyz'
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const numbers = '0123456789'
const symbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~'

const _generate = (options: Record<string, any>, pool: string) => {
	const optionsLength = options.length ?? 12
	const poolLength = pool.length
	let password = ''

	for (let i = 0; i < optionsLength; i++) password += pool[randomNumber(poolLength)]

	return password
}

const _string = (options: Record<string, any>) => {
	options = options || {}

	if (!('length' in options)) options.length = 10
	if (!('numbers' in options)) options.numbers = false
	if (!('symbols' in options)) options.symbols = false
	if (!('uppercase' in options)) options.uppercase = true
	if (!('lowercase' in options)) options.lowercase = true
	if (!('exclude' in options)) options.exclude = []

	let pool = ''
	if (options.lowercase) pool += lowercase
	if (options.uppercase) pool += uppercase
	if (options.numbers) pool += numbers
	if (options.symbols) {
		if (typeof options.symbols === 'string') pool += options.symbols
		else pool += symbols
	}

	if (!pool) {
		throw new TypeError('At least one rule must be true')
	}; let i = options.exclude?.length ?? 0
	while (i--) {
		pool = pool.replace(options.exclude![i], '')
	}

	const password = _generate(options, pool)
	return password
}

/**
 * Hash a String
 * @example
 * ```
 * import { string } from "@rjweb/utils"
 * 
 * string.hash('Hello', { algorithm: 'sha256', salt: '123', output: 'hex' }) // 91be40b8a3959b7821be224d8ce5ad09874fc84dcacd9fed77bf07000141e15a
 * ```
 * @since 1.0.0
*/ export function hash<Options extends {
	/**
	 * The Algorithm to use
	 * @default "sha256"
	 * @since 1.0.0
	*/ algorithm?: string
	/**
	 * The Salt to add
	 * @since 1.0.0
	*/ salt?: string
	/**
	 * The Output type to emit
	 * @default "hex"
	 * @since 1.0.0
	*/ output?: crypto.BinaryToTextEncoding | 'buffer'
}>(input: string, options?: Options): Options['output'] extends 'buffer' ? Buffer : string {
	const pOptions = {
		algorithm: options?.algorithm ?? 'sha256',
		salt: options?.salt,
		output: options?.output ?? 'hex'
	}

	const hash = pOptions.salt ? crypto.createHmac(pOptions.algorithm, pOptions.salt).update(input) : crypto.createHash(pOptions.algorithm).update(input)

	let out: string | Buffer

	if (pOptions.output === 'buffer') out = hash.digest()
	else out = hash.digest(pOptions.output)

	return out as any
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
	return _string(options || {})
}

/**
 * Generate a String with Random Segments
 * @example
 * ```
 * import { string } from "@rjweb/utils"
 * 
 * string.generateSegments([ 2, 5, 3 ], '-', { numbers: true, ... }) // dK-4Rflk-jGb
 * ```
 * @since 1.0.0
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
	return segments.map((length) => generate({ ...options, length })).join(seperator)
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
*/ export function env(input: string): Record<string, string> {
	const parsed: Record<string, string> = {}

	for (const line of input.split('\n')) {
		const match = line.match(/^\s*([^=\s]+)\s*=\s*(?:(['"])(.*?)\2|([^'"\s]+))\s*(?:#.*)?$/)
		if (!match) continue

		parsed[match[1]] = match[3] || match[4]
	}

	return parsed
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
 * await parser.parse('I have {{round(10.32323463246, 4)}}{{echo(€\\, Sir.)}}', { something: 1 }) // 'I have 10.32€, Sir.'
 * ```
 * @since 1.8.3
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