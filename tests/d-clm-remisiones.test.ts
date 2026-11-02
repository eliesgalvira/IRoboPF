import { Schema } from "effect"
import { describe, expect, it } from "vitest"

import citasJson from "../docs/procedencia/deducciones-2025/correcciones/d-clm-remisiones/citas.json"
import matrizJson from "../docs/procedencia/deducciones-2025/correcciones/d-clm-remisiones/matriz.json"
import remisionesJson from "../docs/procedencia/deducciones-2025/correcciones/d-clm-remisiones/remisiones.json"
import { CLM_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/castilla-la-mancha"

const matriz = Schema.decodeUnknownSync(
  Schema.Struct({
    deducciones: Schema.Array(
      Schema.Struct({
        codigo: Schema.String,
        campos: Schema.Array(
          Schema.Struct({ campo: Schema.String, valorVigente: Schema.Unknown })
        ),
        citas: Schema.Array(Schema.String),
        hechosIndividuales: Schema.Array(Schema.String),
        estadoRevision: Schema.String,
        reserva: Schema.optional(
          Schema.Struct({
            norma: Schema.Array(Schema.String),
            manualYCriterio: Schema.Array(Schema.String),
            efecto: Schema.String,
          })
        ),
      })
    ),
  })
)(matrizJson)
const citas = Schema.decodeUnknownSync(
  Schema.Struct({
    citas: Schema.Array(
      Schema.Struct({ id: Schema.String, textoLiteral: Schema.String })
    ),
  })
)(citasJson).citas
const reglaGeneral = Schema.Struct({ reglaGeneral: Schema.String })
const reglas = Schema.decodeUnknownSync(
  Schema.Struct({
    reglas: Schema.Struct({ rural: reglaGeneral, vivienda2012: reglaGeneral }),
  })
)(remisionesJson).reglas
const ficha = (codigo: string) => {
  const result = CLM_DEDUCCIONES_AUTONOMICAS_2025.find(
    (f) => f.codigo === codigo
  )
  if (result === undefined) throw new Error(codigo)
  return result
}
const texto = (id: string): string => {
  const c = citas.find((c) => c.id === id)
  if (c === undefined) throw new Error(id)
  return c.textoLiteral
}

describe("D CLM: fronteras documentales", () => {
  it("recoge el límite y acreditaciones de la continuación de perros, p282", () => {
    const f = ficha("clm_controles_veterinarios_perros_asistencia")
    expect(f.limites.join(" ")).toContain("100 euros")
    expect(f.requisitos.join(" ")).toContain("unidad de vinculación")
    expect(f.requisitos.join(" ")).toContain("subvencionados")
    expect(f.requisitos.join(" ")).toContain("36.000")
    expect(texto("manual-perros-282")).toContain("100 euros anuales")
  })
  it("la ley exige identificar la cuenta aunque el manual no lo transcriba", () => {
    expect(texto("CLM2026-art18")).toContain(
      "Las cuentas deberán identificarse separadamente"
    )
    expect(
      ficha("clm_ahorro_inversion_primera_vivienda").requisitos.join(" ")
    ).toContain("fecha de apertura")
    expect(
      ficha("clm_ahorro_inversion_primera_vivienda").requisitos.join(" ")
    ).toContain("incremento de saldo")
  })
  it("no atribuye a mayores75 el reparto de cuidado de ascendientes6.2", () => {
    expect(ficha("clm_mayores_75").prorrateo).toEqual([])
    expect(
      ficha("clm_cuidado_ascendientes_mayores_75").prorrateo.length
    ).toBeGreaterThan(0)
  })
  it("el acuerdo es de febrero2023 y solo amplía residencia a intermedias", () => {
    expect(texto("intermedias2023-p1")).toContain("Acuerdo de 07/02/2023")
    expect(texto("intermedias2023-p1")).toContain("artículo 12 bis")
    expect(reglas.rural.reglaGeneral).toContain("no12ter ni12quater")
  })
  it("no usa población de un núcleo de Hellín como población municipal", () => {
    expect(texto("lista-ab-p1")).toContain("30.836")
    expect(texto("lista-cu-p1")).toContain("53.600")
  })
  it("la fecha publicada en historial no anticipa la supresión estatal2013", () => {
    expect(texto("SUPRESION2013")).toMatch(
      /efectos desde (?:el )?1 de enero de 2013/
    )
    expect(reglas.vivienda2012.reglaGeneral).toContain(
      "no adelanta esa supresión"
    )
    expect(texto("RIRPF-a54-1:p2")).toContain("tres años")
  })
  it("mantiene ambas posiciones de compatibilidad en los dos códigos", () => {
    const afectados = matriz.deducciones.filter(
      (r) => r.reserva !== undefined
    )
    expect(afectados.map((r) => r.codigo).sort()).toEqual([
      "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales",
      "clm_intereses_primera_vivienda_menores_40",
    ])
    expect(afectados[0].reserva).toEqual(afectados[1].reserva)
    expect(texto("RD-2")).toContain("12 y 12 ter")
    expect(texto("AVISO2025")).toContain("no se aplica")
  })
  for (const f of CLM_DEDUCCIONES_AUTONOMICAS_2025) {
    it(`${f.codigo}: cobertura de cada campo exportado y citas resueltas`, () => {
      const r = matriz.deducciones.find(
        (r) => r.codigo === f.codigo
      )
      expect(r).toBeDefined()
      if (r === undefined) throw new Error(f.codigo)
      expect(
        Object.fromEntries(
          r.campos.map((c) => [
            c.campo,
            c.valorVigente,
          ])
        )
      ).toEqual(f)
      const ids = new Set(citas.map((c) => c.id))
      for (const id of r.citas) expect(ids.has(id)).toBe(true)
      expect(r.hechosIndividuales.length).toBeGreaterThan(0)
      expect(r.estadoRevision).toBe("candidato_para_revision_independiente")
    })
  }
})
