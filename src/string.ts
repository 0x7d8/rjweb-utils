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
}>(input: string, key: string, options?: Options): Options['output'] extends 'buffer' ? Buffer : string {
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
}>(input: Options['input'] extends 'buffer' ? Buffer : string, key: string, options?: Options): string {
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
 * string.generateSegments([ 2, 5, 3 ], '-', { length: 5, numbers: true, ... }) // dK-4Rflk-jGb
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
	const trimmed = input.trim()
	
	if (trimmed.length < length) return trimmed
	else return trimmed.slice(0, length) + end
}