import * as fs from "fs"
import * as path from "path"
import * as rl from "readline"
import * as crypto from "crypto"
import { as, stream as _stream, string, ArrayOrNot } from "."

/**
 * Get Files from a folder
 * @example
 * ```
 * import { filesystem } from "@rjweb/utils"
 * 
 * filesystem.getFiles('./src', { recursive: true, async: false, stat: false }) // ['./src/index.ts', ...]
 * ```
 * @throws If an `fs` error occurs
 * @since 1.0.0
 * @supports nodejs
*/ export function getFiles<Options extends {
	/**
	 * Whether to retrieve `fs.Dirent`'s instead of file location strings
	 * @default false
	 * @since 1.0.0
	*/ stat?: boolean
	/**
	 * Whether to get the files of subdirectories, etc... too
	 * @default false
	 * @since 1.0.0
	*/ recursive?: boolean
	/**
   * Whether to use async fs
   * @default false
	 * @since 1.0.0
  */ async?: boolean
}>(folder: string, options?: Options): Options['async'] extends true ? Promise<Options['stat'] extends true ? fs.Dirent[] : string[]> : Options['stat'] extends true ? fs.Dirent[] : string[] {
	const cleanPath = path.resolve(folder)

	if (options?.async) {
		return new Promise<any>(async(resolve, reject) => {
			try {
				const dir = await fs.promises.readdir(cleanPath, { withFileTypes: options?.stat || undefined as any })
				if (!options?.recursive) return resolve(dir)

				const files: any[] = []

				if (options?.stat) {
					for (const f of dir) {
						const file = f as any as fs.Dirent

						try {
							files.push(...await getFiles(path.join(folder, file.name), options))
						} catch {
							files.push(Object.assign(file, { name: path.join(folder, file.name) }))
						}
					}
				} else {
					for (const f of dir) {
						const file = f as string

						try {
							files.push(...await getFiles(path.join(folder, file), options))
						} catch {
							files.push(path.join(folder, file))
						}
					}
				}

				resolve(files)
			} catch (err) {
				reject(err)
			}
		}) as never
	} else {
		const dir = fs.readdirSync(cleanPath, { withFileTypes: options?.stat || undefined as any })
		if (!options?.recursive) return dir as never

		const files: any[] = []

		if (options?.stat) {
			for (const f of dir) {
				const file = f as any as fs.Dirent

				try {
					files.push(...as<fs.Dirent[]>(getFiles(path.join(folder, file.name), options)))
				} catch {
					files.push(Object.assign(file, { name: path.join(folder, file.name) }))
				}
			}
		} else {
			for (const f of dir) {
				const file = f as string

				try {
					files.push(...as<string[]>(getFiles(path.join(folder, file), options)))
				} catch {
					files.push(path.join(folder, file))
				}
			}
		}

		return files as never
	}
}

/**
 * Stream a File Chunk by Chunk (or Line by Line)
 * @example
 * ```
 * import { filesystem } from "@rjweb/utils"
 * 
 * for await (const chunk of filesystem.stream('./file.txt')) {
 *   process.stdout.write(chunk.toString())
 * }
 * 
 * for await (const line of filesystem.stream('./file.txt').lines()) {
 *   console.log('Line: ', line)
 * }
 * ```
 * @since 1.9.0
 * @supports nodejs
*/ export function stream(file: fs.PathLike, options?: { slice?: { start?: number, end?: number } }): AsyncIterable<Buffer> & { lines(): AsyncIterable<string> } {
	const stream = fs.createReadStream(file, {
		start: options?.slice?.start,
		end: options?.slice?.end
	})

	return Object.assign(_stream.iterator(stream), {
		lines() {
			return rl.createInterface(stream)
		}
	})
}

/**
 * Parse a File into an Object using basic env syntax
 * 
 * This parses line by line so an invalid line will just be skipped
 * @example
 * ```
 * import { filesystem } from "@rjweb/utils"
 * 
 * filesystem.env('./.env') // {K:'12'}
 * filesystem.env('./.env.prod') // {E:'400'}
 * filesystem.env('./invalid-env') // {}
 * ```
 * @since 1.10.4
 * @supports nodejs
*/ export function env<Options extends {
	/**
	 * Whether to use async fs
	 * @default true
	 * @since 1.12.0
	*/ async?: boolean
}>(file: fs.PathLike, options?: Options): Options['async'] extends false ? Record<string, string> : Promise<Record<string, string>> {
	if (options?.async ?? true) {
		return new Promise(async(resolve) => {
			const content = await fs.promises.readFile(file, 'utf8')

			return resolve(string.env(content))
		}) as any
	} else {
		const content = fs.readFileSync(file, 'utf8')

		return string.env(content) as any
	}
}

/**
 * Hash a File
 * @example
 * ```
 * import { filesystem } from "@rjweb/utils"
 * 
 * await filesystem.hash('./doc.txt', { algorithm: 'sha256', salt: '123', output: 'hex' }) // 91be40b8a3959b7821be224d8ce5ad09874fc84dcacd9fed77bf07000141e15a
 * ```
 * @since 1.12.0
 * @supports nodejs
*/ export async function hash<const Options extends {
	/**
	 * The Algorithm to use
	 * @default "sha256"
	 * @since 1.12.0
	*/ algorithm?: ArrayOrNot<string>
	/**
	 * The Salt to add
	 * @since 1.12.0
	*/ salt?: string
	/**
	 * The Output type to emit
	 * @default "hex"
	 * @since 1.12.0
	*/ output?: crypto.BinaryToTextEncoding | 'buffer'
}>(file: fs.PathLike, options?: Options): Promise<Options['algorithm'] extends Array<any>
	? { [Key in Options['algorithm'][number]]: Options['output'] extends 'buffer' ? Buffer : string }
	: Options['output'] extends 'buffer' ? Buffer : string
> {
	const stream = fs.createReadStream(file)

	const pOptions = {
		algorithm: options?.algorithm ?? 'sha256',
		salt: options?.salt,
		output: options?.output ?? 'hex'
	}

	pOptions.algorithm = Array.isArray(pOptions.algorithm) ? pOptions.algorithm : [pOptions.algorithm]

	const hashes: Record<string, crypto.Hash | crypto.Hmac> = Object.fromEntries(pOptions.algorithm.map((a) => [a, pOptions.salt ? crypto.createHmac(a, pOptions.salt) : crypto.createHash(a)]))

	await new Promise((resolve, reject) => {
		stream.on('data', (chunk) => {
			for (const hash of Object.values(hashes)) {
				hash.update(chunk)
			}
		})

		stream.on('end', () => {
			resolve(null)
		})

		stream.on('error', (err) => {
			reject(err)
		})
	})

	if (Array.isArray(options?.algorithm)) {
		return Object.fromEntries(pOptions.algorithm.map((a) => [a, pOptions.output === 'buffer' ? hashes[a].digest() : hashes[a].digest(pOptions.output)])) as never
	} else {
		return pOptions.output === 'buffer' ? hashes[pOptions.algorithm[0]].digest() as never : hashes[pOptions.algorithm[0]].digest(pOptions.output) as never
	}
}

/**
 * Walk a Directory
 * @example
 * ```
 * import { filesystem } from "@rjweb/utils"
 * import path from "path"
 * 
 * for await (const dirent of filesystem.walk('./node_modules', { async: true, recursive: true })) {
 *   const spaces = path.relative('./node_modules', dirent.path).split(path.sep).length - 1
 * 
 *   console.log(' '.repeat(spaces), dirent.name)
 * }
 * ```
 * @since 1.12.3
 * @supports nodejs
*/ export function walk<Options extends {
	/**
	 * Whether to use async fs
	 * @default false
	 * @since 1.12.3
	*/ async?: boolean
	/**
	 * Whether to walk the directory recursively
	 * @default false
	 * @since 1.12.3
	 */ recursive?: boolean
}>(folder: string, options?: Options): Options['async'] extends true ? AsyncIterable<fs.Dirent> : Iterable<fs.Dirent> {
	const cleanPath = path.resolve(folder)

	if (options?.async) {
		return {
			[Symbol.asyncIterator]: async function* () {
				const dir = await fs.promises.opendir(cleanPath)

				while (true) {
					const dirent = await dir.read()
					if (!dirent) break

					Object.assign(dirent, {
						path: path.join(folder, dirent.name)
					})

					yield dirent

					if (options?.recursive && dirent.isDirectory()) {
						yield* walk(path.join(folder, dirent.name), options) as any
					}
				}

				await dir.close()
			}
		} as never
	} else {
		return {
			[Symbol.iterator]: function* () {
				const dir = fs.opendirSync(cleanPath)

				while (true) {
					const dirent = dir.readSync()
					if (!dirent) break

					yield dirent

					if (options?.recursive && dirent.isDirectory()) {
						yield* walk(path.join(folder, dirent.name), options) as any
					}
				}

				dir.closeSync()
			}
		} as never
	}
}