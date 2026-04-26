import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

import { construirFixtureDerivadoDesdeTablasEffect } from "../tests/helpers/legacy-tabular-hashes"

const SALIDA_FIXTURE = "tests/fixtures/legacy-tabular-hashes.json"

const main = async () => {
  const fixture = construirFixtureDerivadoDesdeTablasEffect()

  await mkdir(resolve(process.cwd(), "tests/fixtures"), { recursive: true })
  await writeFile(
    resolve(process.cwd(), SALIDA_FIXTURE),
    `${JSON.stringify(fixture, null, 2)}\n`
  )
}

await main()
