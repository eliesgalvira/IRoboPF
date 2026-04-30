import { describe, expect, it } from "@effect/vitest"

import {
  impactoDesdePerspectivaCiudadano,
  varianteAuditoriaPorDefecto,
} from "../lib/dominio/auditoria/auditoria-normativa-historica"

describe("auditoria normativa historica", () => {
  it("usa IRPF final y salario bruto real constante como variante por defecto", () => {
    expect(varianteAuditoriaPorDefecto).toEqual({
      magnitudAuditada: "irpf_final",
      estrategiaProyeccionSalarial: "salario_bruto_real_constante",
    })
  })

  it("expresa una bajada de IRPF como mejora para el ciudadano", () => {
    expect(
      impactoDesdePerspectivaCiudadano({
        magnitud: "irpf_final",
        resultadoRealCentimos: 660_00,
        resultadoContrafactualCentimos: 1_000_00,
      })
    ).toBe(340_00)
  })

  it("expresa una subida de salario neto como mejora para el ciudadano", () => {
    expect(
      impactoDesdePerspectivaCiudadano({
        magnitud: "salario_neto_anual",
        resultadoRealCentimos: 20_340_00,
        resultadoContrafactualCentimos: 20_000_00,
      })
    ).toBe(340_00)
  })
})
