import * as streams from "stream"
import * as streamsWeb from "stream/web"

/**
 * Convert a Stream to an async iterator
 * @example
 * ```
 * import { stream } from "@rjweb/utils"
 * import * as fs from "fs"
 * 
 * const readStream = fs.createReadStream('./file.txt')
 * 
 * for await (const chunk of stream.iterator<Buffer>(readStream)) {
 *   console.log(chunk.toString())
 * }
 * ```
 * @since 1.9.0
 * @supports nodejs, browser
*/ export function iterator<Data = any>(stream: streams.Readable | streamsWeb.ReadableStream<Data>): AsyncIterable<Data> {
	if (stream instanceof streams.Readable) {
		return stream.iterator()
	} else {
		return stream
	}
}