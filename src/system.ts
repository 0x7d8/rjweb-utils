import * as child from "child_process"
import * as os from "os"
import { number, size } from "."

function cpuAverage() {
	let totalIdle = 0, totalTick = 0
	const cpus = os.cpus()

	for (const cpu of cpus) {
		for (const time of Object.values(cpu.times)) {
			totalTick += time
	 	}

		totalIdle += cpu.times.idle
	}

	return {
		idle: totalIdle / cpus.length,
		total: totalTick / cpus.length
	}
}

/**
 * Run a Shell on the OS with a command
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
	 * Whether to use async child_process
	 * @default false
	 * @since 1.3.0
	*/ async?: boolean
	/**
	 * The timeout for the command
	 * @default 0
	 * @since 1.12.11
	*/ timeout?: number
}>(command: string, options?: Options): Options['async'] extends true ? Promise<string> : string {
	const pOptions = {
		async: options?.async ?? false
	}

	if (pOptions.async) {
		return new Promise((resolve, reject) => {
			child.exec(command, {
				maxBuffer: size(50).mb(),
				timeout: options?.timeout ?? 0
			}, (err, stdout, stderr) => {
				if (err) return reject(err)

				return resolve(stdout.concat(stderr))
			})
		}) as any
	} else {
		return child.execSync(command, { stdio: 'pipe', encoding: 'utf8', timeout: options?.timeout ?? 0 }) as any
	}
}

/**
 * Get the Systems CPU Usage
 * @example
 * ```
 * import { system } from "@rjweb/utils"
 * 
 * await system.cpu() // 3.76
 * ```
 * @since 1.3.1
*/ export async function cpu(captureTime: number = 250): Promise<number> {
	return new Promise((resolve) => {
		const startUsage = cpuAverage()

		setTimeout(() => {
			const usage = cpuAverage()

			const idle = usage.idle - startUsage.idle,
				total = usage.total - startUsage.total

			return resolve(number.round(100 - (100 * idle / total), 2))
		}, captureTime)
	})
}