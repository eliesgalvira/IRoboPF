import { describe, expect, it } from "@effect/vitest"

import { obtenerParametrosComunidadAutonoma } from "../lib/dominio/irpf/comunidades/comunidad-autonoma"
import type { ComunidadAutonoma } from "../lib/dominio/irpf/caso-fiscal-anual"

const comunidadesConEscala2025: ReadonlyArray<ComunidadAutonoma> = [
  "andalucia",
  "aragon",
  "asturias",
  "illes-balears",
  "canarias",
  "cantabria",
  "castilla-la-mancha",
  "castilla-y-leon",
  "catalunya",
  "extremadura",
  "galicia",
  "madrid",
  "murcia",
  "la-rioja",
  "comunitat-valenciana",
  "ceuta",
  "melilla",
]

describe("comunidad autonoma", () => {
  it("resuelve la comunidad simulada estatal como tramo autonomico igualado al estatal", () => {
    expect(
      obtenerParametrosComunidadAutonoma({
        anio: 2025,
        comunidadAutonoma: "simulada-estatal",
      })
    ).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "simulada-estatal",
      anio: 2025,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: true,
      deduccionesAutonomicasSoportadas: [],
    })
  })

  it("resuelve una comunidad real con escala autonomica propia de 2025", () => {
    expect(
      obtenerParametrosComunidadAutonoma({
        anio: 2025,
        comunidadAutonoma: "madrid",
      })
    ).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "madrid",
      anio: 2025,
      minimoAutonomicoIgualEstatal: false,
      escalaAutonomicaIgualEstatal: false,
    })
  })

  it("resuelve todas las comunidades y ciudades con escala autonomica 2025", () => {
    for (const comunidadAutonoma of comunidadesConEscala2025) {
      expect(
        obtenerParametrosComunidadAutonoma({
          anio: 2025,
          comunidadAutonoma,
        })
      ).toMatchObject({
        _tag: "ParametrosComunidadAutonoma",
        comunidadAutonoma,
        anio: 2025,
        escalaAutonomicaIgualEstatal: false,
      })
    }
  })
})
