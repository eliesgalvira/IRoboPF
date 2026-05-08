// Script entry point: Node file-system/path APIs and async top-level orchestration
// are the execution boundary.
// @effect-diagnostics effect/asyncFunction:off
// @effect-diagnostics effect/nodeBuiltinImport:off
import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

import { construirFixtureCanonicoDesdeTablasEffect } from "../tests/helpers/canonical-tabular-hashes"

const SALIDA_FIXTURE = "tests/fixtures/canonical-tabular-hashes.json"

const main = async () => {
  const fixture = construirFixtureCanonicoDesdeTablasEffect()

  await mkdir(resolve(process.cwd(), "tests/fixtures"), { recursive: true })
  await writeFile(
    resolve(process.cwd(), SALIDA_FIXTURE),
    `${JSON.stringify(fixture, null, 2)}\n`
  )
}

await main()
