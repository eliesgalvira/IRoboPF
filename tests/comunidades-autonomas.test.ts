import { describe, expect, it } from "@effect/vitest"

import { obtenerParametrosComunidadAutonoma } from "../lib/dominio/irpf/comunidades/comunidad-autonoma"

describe("comunidad autonoma", () => {
  it("resuelve la comunidad simulada estatal como tramo autonomico igualado al estatal", () => {
    expect(
      obtenerParametrosComunidadAutonoma({
        anio: 2025,
        comunidadAutonoma: "simulada-estatal",
      })
    ).toEqual({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "simulada-estatal",
      anio: 2025,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: true,
      deduccionesAutonomicasSoportadas: [],
    })
  })
})
