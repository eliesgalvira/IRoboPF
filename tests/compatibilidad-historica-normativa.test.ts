import { describe, expect, it } from "@effect/vitest"

import { crearImporteMonetario } from "../lib/dominio/dinero/importe-monetario"
import {
  medidaDeduccionObtencionRendimientosTrabajo2025,
  medidaDeduccionObtencionRendimientosTrabajo2026,
  medidaLimiteRetencionCompatibilidadHistorica43PorCiento,
  obtenerEspecificacionCompatibilidadHistorica,
} from "../lib/dominio/normativa/datos/compatibilidad-historica"

describe("normativa de compatibilidad histórica", () => {
  it("centraliza el límite final del 43 por ciento para cualquier año soportado", () => {
    const especificacion = obtenerEspecificacionCompatibilidadHistorica(2024)

    expect(especificacion.tipoMaximoRetencionNomina.toString()).toBe("0.43")
    expect(especificacion.medidas).toEqual([
      medidaLimiteRetencionCompatibilidadHistorica43PorCiento,
    ])
  })

  it("no aplica deducción por obtención de rendimientos del trabajo antes de 2025", () => {
    const especificacion = obtenerEspecificacionCompatibilidadHistorica(2024)

    expect(
      especificacion
        .deduccionObtencionRendimientosTrabajo(crearImporteMonetario(16_576))
        .toString()
    ).toBe("0")
  })

  it("expone la deducción por obtención de rendimientos del trabajo de 2025 como medida trazable", () => {
    const especificacion = obtenerEspecificacionCompatibilidadHistorica(2025)

    expect(
      especificacion
        .deduccionObtencionRendimientosTrabajo(crearImporteMonetario(16_576))
        .toString()
    ).toBe("340")
    expect(especificacion.medidas).toContain(
      medidaDeduccionObtencionRendimientosTrabajo2025
    )
  })

  it("expone la actualizacion de 2026 como medida trazable independiente", () => {
    const especificacion = obtenerEspecificacionCompatibilidadHistorica(2026)

    expect(
      especificacion
        .deduccionObtencionRendimientosTrabajo(crearImporteMonetario(17_094))
        .toString()
    ).toBe("590.89")
    expect(especificacion.medidas).toContain(
      medidaDeduccionObtencionRendimientosTrabajo2026
    )
  })
})
