import { Result, Schema } from "effect"
// Characterization harness: Node child-process/env and Vitest async boundaries
// are intentional here.
// @effect-diagnostics effect/asyncFunction:off
// @effect-diagnostics effect/newPromise:off
// @effect-diagnostics effect/nodeBuiltinImport:off
// @effect-diagnostics effect/processEnv:off
import { spawn } from "node:child_process"

import fixtureCanonico from "./fixtures/canonical-tabular-hashes.json"
import fixtureExcelIndependiente from "../docs/procedencia/revisiones/redondeos-legacy-v1/hashes-excel-independientes.json"
import { describe, expect, it } from "@effect/vitest"

import {
  type HashHojaCanonica,
  HashHojaCanonicaSchema,
  FixtureCanonicoTabularSchema,
} from "./helpers/canonical-tabular-hashes"

const fixtureAnterior = Schema.decodeUnknownSync(FixtureCanonicoTabularSchema)(
  fixtureCanonico
)
const fixture = Schema.decodeUnknownSync(FixtureCanonicoTabularSchema)(
  fixtureExcelIndependiente
)
const CONCURRENCIA_HASH_EFFECT = Number(
  process.env.IROBOPF_CONCURRENCIA_FIXTURE_CANONICO ?? 1
)

const hashearHojaEffect = (nombreHoja: string) =>
  new Promise<HashHojaCanonica>((resolve, reject) => {
    const proceso = spawn("bun", ["scripts/hash-effect-sheet.ts", nombreHoja], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
    })
    let stdout = ""
    let stderr = ""

    proceso.stdout.setEncoding("utf8")
    proceso.stdout.on("data", (trozo) => {
      stdout += trozo
    })
    proceso.stderr.setEncoding("utf8")
    proceso.stderr.on("data", (trozo) => {
      stderr += trozo
    })
    proceso.on("error", reject)
    proceso.on("close", (codigo) => {
      if (codigo !== 0) {
        reject(new Error(stderr))
        return
      }

      const resultado = Schema.decodeUnknownResult(
        Schema.fromJsonString(HashHojaCanonicaSchema)
      )(stdout)
      if (Result.isFailure(resultado)) reject(resultado.failure)
      else resolve(resultado.success)
    })
  })

const hashearHojasEffect = async (hojas: ReadonlyArray<HashHojaCanonica>) => {
  const resultados = new Array<HashHojaCanonica>()
  let indice = 0

  const worker = async () => {
    while (indice < hojas.length) {
      const hoja = hojas[indice]
      indice += 1
      if (hoja !== undefined) {
        resultados.push(await hashearHojaEffect(hoja.name))
      }
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(CONCURRENCIA_HASH_EFFECT, hojas.length) },
      worker
    )
  )

  return resultados.sort((a, b) => a.name.localeCompare(b.name))
}

describe("hashes del Excel extraídos independientemente", () => {
  it("conserva separados el fixture TypeScript anterior y la evidencia XML", () => {
    expect(fixture.schemaVersion).toBe(1)
    expect(fixture.sheets).toHaveLength(18)
    expect(fixtureAnterior.sheets).toHaveLength(18)
    expect(fixture.sheets.filter((h) => h.name.startsWith("DAT_"))).toHaveLength(15)
    expect(fixture.sheets).not.toEqual(fixtureAnterior.sheets)
  })

  it("coteja las 18 hojas contra el XML original sin tolerancia de céntimo", async () => {
    const actual = {
      ...fixture,
      sheets: await hashearHojasEffect(fixture.sheets),
    }
    const esperado = {
      ...fixture,
      sheets: [...fixture.sheets].sort((a, b) => a.name.localeCompare(b.name)),
    }

    expect(actual).toEqual(esperado)
  }, 120_000)
})
