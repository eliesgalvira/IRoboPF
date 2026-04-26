import { spawn } from "node:child_process"

import fixtureLegacyDerivado from "./fixtures/legacy-tabular-hashes.json"
import { describe, expect, it } from "@effect/vitest"

import {
  type HashHojaLegacyDerivada,
  type FixtureLegacyDerivado,
} from "./helpers/legacy-tabular-hashes"

const fixture = fixtureLegacyDerivado as FixtureLegacyDerivado
const CONCURRENCIA_HASH_EFFECT = Number(
  process.env.IROBOPF_CONCURRENCIA_FIXTURE_DERIVADO ?? 8
)

const hashearHojaEffect = (nombreHoja: string) =>
  new Promise<HashHojaLegacyDerivada>((resolve, reject) => {
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

      resolve(JSON.parse(stdout) as HashHojaLegacyDerivada)
    })
  })

const hashearHojasEffect = async (
  hojas: ReadonlyArray<HashHojaLegacyDerivada>
) => {
  const resultados = new Array<HashHojaLegacyDerivada>()
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

describe("fixture legacy derivado", () => {
  it("versiona hashes tabulares del Excel legacy completo", () => {
    expect(fixture.schemaVersion).toBe(1)
    expect(fixture.sheets).toHaveLength(18)
  })

  it("mantiene equivalencia tabular completa con las tablas Effect", async () => {
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
