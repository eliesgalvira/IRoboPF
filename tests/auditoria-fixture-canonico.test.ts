import { describe, expect, it } from "@effect/vitest"
import { Schema } from "effect"
import fixtureExcelIndependiente from "../docs/procedencia/revisiones/redondeos-legacy-v1/hashes-excel-independientes.json"
import fixtureCanonico from "./fixtures/canonical-tabular-hashes.json"
import { FixtureCanonicoTabularSchema } from "./helpers/canonical-tabular-hashes"
const fixtureAnterior = Schema.decodeUnknownSync(FixtureCanonicoTabularSchema)(
  fixtureCanonico
)
const fixture = Schema.decodeUnknownSync(FixtureCanonicoTabularSchema)(
  fixtureExcelIndependiente
)
describe("hashes del Excel extraídos independientemente", () => {
  it("conserva separados el fixture TypeScript anterior y la evidencia XML", () => {
    expect(fixture.schemaVersion).toBe(1)
    expect(fixture.sheets).toHaveLength(18)
    expect(fixtureAnterior.sheets).toHaveLength(18)
    expect(
      fixture.sheets.filter((h) => h.name.startsWith("DAT_"))
    ).toHaveLength(15)
    expect(fixture.sheets).not.toEqual(fixtureAnterior.sheets)
  })
})
