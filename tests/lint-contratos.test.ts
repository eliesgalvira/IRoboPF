import { Schema } from "effect"
import { describe, expect, it } from "vitest"

import { getPayloadConfigFromPayload } from "../components/ui/chart"
import {
  FixtureCanonicoTabularSchema,
  HashHojaCanonicaSchema,
  tablaEsperadaPorHoja,
} from "./helpers/canonical-tabular-hashes"
import fixture from "./fixtures/canonical-tabular-hashes.json"

describe("fronteras de contratos corregidos por lint", () => {
  const config = {
    value: { label: "respaldo" },
    directa: { label: "directa" },
    anidada: { label: "anidada" },
  }

  it("conserva precedencia de clave directa, anidada y respaldo de Recharts", () => {
    expect(
      getPayloadConfigFromPayload(
        config,
        {
          graphicalItemId: "serie-1",
          name: "directa",
          payload: { name: "anidada" },
        },
        "name"
      )
    ).toBe(config.directa)
    expect(
      getPayloadConfigFromPayload(
        config,
        { graphicalItemId: "serie-1", payload: { name: "anidada" } },
        "name"
      )
    ).toBe(config.anidada)
    expect(
      getPayloadConfigFromPayload(
        config,
        { graphicalItemId: "serie-1", value: 3 },
        "value"
      )
    ).toBe(config.value)
    expect(
      getPayloadConfigFromPayload(
        config,
        {
          graphicalItemId: "serie-1",
          value: "ausente",
          payload: { value: "anidada" },
        },
        "value"
      )
    ).toBe(config.value)
    expect(
      getPayloadConfigFromPayload(config, undefined, "value")
    ).toBeUndefined()
  })

  it("rechaza datos mal formados del proceso de hash y valida el fixture completo", () => {
    expect(Schema.is(FixtureCanonicoTabularSchema)(fixture)).toBe(true)
    const decodificar = Schema.decodeUnknownSync(
      Schema.fromJsonString(HashHojaCanonicaSchema)
    )
    expect(() => decodificar('{"name":"DAT_2025","columns":"4"}')).toThrow()
    expect(() => decodificar("salida no JSON")).toThrow()
    expect(decodificar(JSON.stringify(fixture.sheets[0]))).toEqual(
      fixture.sheets[0]
    )
  })

  it("rechaza años fuera del contrato antes de construir una tabla", () => {
    expect(() => tablaEsperadaPorHoja("DAT_2011")).toThrow()
    expect(() => tablaEsperadaPorHoja("DAT_no-numero")).toThrow()
  })
})
