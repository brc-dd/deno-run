/**
 * This module provides an opinionated command-line interface for running Deno scripts.
 * It reads the import map from the `deno.json` file, resolves the imports, and runs the specified script.
 *
 * @example
 * ```sh
 * deno run -A jsr:@brc-dd/run -- [runArgs...] <script> [scriptArgs...]
 * ```
 *
 * @module
 */

import { parseFromJson } from 'jsr:@brc-dd/import-map@^0.24.0'
import $ from 'jsr:@david/dax@^0.43.2'
import { gray } from 'jsr:@std/fmt@^1.0.8/colors'
import { resolve, toFileUrl } from 'jsr:@std/path@^1.1.2'

const baseUrl = toFileUrl(resolve('deno.json'))
const importMap = parseFromJson(
  baseUrl,
  await Deno.readTextFile('deno.json'),
  { expandImports: true },
)

const argv = [...Deno.args]

// Find first non-flag argument and resolve it
const scriptArgIndex = argv.findIndex((arg) => !arg.startsWith('-'))
if (scriptArgIndex !== -1) {
  try {
    argv[scriptArgIndex] = importMap.resolve(argv[scriptArgIndex]!, baseUrl)
  } catch {
    // Ignore errors, fallback to the original argument
  }
}

// Process final argument list
const argsIndex = argv.indexOf('--')
const finalArgs = [
  Deno.execPath(),
  ...(argsIndex !== -1 ? argv.slice(argsIndex + 1) : []),
]
  .filter(Boolean)
  .map($.escapeArg)
  .join(' ')

// Print and execute the command
await Deno.stderr.write(new TextEncoder().encode(gray(`$ ${finalArgs}\n`)))
await $.raw`${finalArgs}`
