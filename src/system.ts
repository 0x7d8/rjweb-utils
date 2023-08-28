import * as child from "child_process"

/**
 * Run a Shell on the OS with command
 * @example
 * ```
 * import { system } from "@rjweb/utils"
 * 
 * system.execute('echo hi', { async: false }) // 'hi\n'
 * system.execute('wesgasg', { async: false }) // <throws Error>
 * ```
 * @throws If exit code is not 0
 * @since 1.3.0
*/ export function execute<Options extends {
	/**
   * Whether to use async fs
   * @default false
	 * @since 1.3.0
  */ async?: boolean
}>(command: string, options: Options): Options['async'] extends true ? Promise<string> : string {
	const pOptions = {
		async: options?.async ?? false
	}

	if (pOptions.async) {
		return new Promise((resolve, reject) => {
			child.exec(command, (err, stdout) => {
				if (err) return reject(err)

				return resolve(stdout)
			})
		}) as any
	} else {
		return child.execSync(command, { stdio: 'pipe', encoding: 'utf8' }) as any
	}
}