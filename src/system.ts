import * as child from "child_process"
import * as os from "os"
import { number } from "."

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
}>(command: string, options?: Options): Options['async'] extends true ? Promise<string> : string {
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