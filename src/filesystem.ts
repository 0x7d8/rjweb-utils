import * as fs from "fs"
import * as path from "path"
import * as rl from "readline"
import { as, stream as _stream, string } from "."

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
*/ export async function env(file: fs.PathLike): Promise<Record<string, string>> {
	const content = await fs.promises.readFile(file, 'utf8')

	return string.env(content)
}