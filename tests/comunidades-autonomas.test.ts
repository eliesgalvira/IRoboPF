import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  obtenerParametrosComunidadAutonoma,
  ParametrosNormativosIrpf,
} from "../lib/dominio/irpf/comunidades/comunidad-autonoma"
import type { ComunidadAutonoma } from "../lib/dominio/irpf/caso-fiscal-anual"
import { obtenerMinimosAutonomicosIrpf2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"
import { obtenerMinimosAutonomicosIrpf2024 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2024"
import { obtenerMinimosAutonomicosIrpf2023 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2023"
import { obtenerMinimosAutonomicosIrpf2022 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2022"
import { obtenerMinimosAutonomicosIrpf2021 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2021"

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
  it.effect(
    "expone los parametros normativos del IRPF como servicio Effect",
    () =>
      Effect.gen(function* () {
        const parametros = yield* ParametrosNormativosIrpf

        const comunidad = yield* parametros.obtenerParametrosComunidadAutonoma({
          anio: 2025,
          comunidadAutonoma: "madrid",
        })

        expect(comunidad).toMatchObject({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma: "madrid",
        })
        expect(
          parametros.minimosEstatales2025.contribuyente.general.toString()
        ).toBe("5550")
      }).pipe(Effect.provide(ParametrosNormativosIrpf.layer))
  )

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

  it("resuelve 2024 reutilizando 2025 salvo diferencias normativas conocidas", () => {
    const asturias2024 = obtenerParametrosComunidadAutonoma({
      anio: 2024,
      comunidadAutonoma: "asturias",
    })
    const asturias2025 = obtenerParametrosComunidadAutonoma({
      anio: 2025,
      comunidadAutonoma: "asturias",
    })

    expect(asturias2024).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "asturias",
      anio: 2024,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: false,
    })
    expect(asturias2025).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      minimoAutonomicoIgualEstatal: false,
    })

    if (
      asturias2024._tag === "ParametrosComunidadAutonoma" &&
      asturias2025._tag === "ParametrosComunidadAutonoma"
    ) {
      expect(asturias2024.escalaAutonomica.tramos[0][1].toString()).toBe("0.1")
      expect(asturias2025.escalaAutonomica.tramos[0][1].toString()).toBe("0.09")
    }
  })

  it("codifica Illes Balears con minimo general y adicionales por edad separados", () => {
    const minimos2024 = obtenerMinimosAutonomicosIrpf2024("illes-balears")
    const minimos2025 = obtenerMinimosAutonomicosIrpf2025("illes-balears")

    for (const minimos of [minimos2024, minimos2025]) {
      expect(minimos.contribuyente.general.toString()).toBe("5550")
      expect(minimos.contribuyente.adicionalMayor65.toString()).toBe("1820")
      expect(minimos.contribuyente.adicionalMayor75.toString()).toBe("1540")
    }
  })

  it("resuelve 2023 con escalas y minimos autonómicos propios del ejercicio", () => {
    const canarias2023 = obtenerParametrosComunidadAutonoma({
      anio: 2023,
      comunidadAutonoma: "canarias",
    })
    const canarias2025 = obtenerParametrosComunidadAutonoma({
      anio: 2025,
      comunidadAutonoma: "canarias",
    })
    const cantabria2023 = obtenerParametrosComunidadAutonoma({
      anio: 2023,
      comunidadAutonoma: "cantabria",
    })

    expect(canarias2023).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "canarias",
      anio: 2023,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: false,
    })

    if (
      canarias2023._tag === "ParametrosComunidadAutonoma" &&
      canarias2025._tag === "ParametrosComunidadAutonoma"
    ) {
      expect(canarias2023.escalaAutonomica.tramos[0][0].toString()).toBe(
        "13010"
      )
      expect(canarias2025.escalaAutonomica.tramos[0][0].toString()).toBe(
        "13748"
      )
    }

    if (cantabria2023._tag === "ParametrosComunidadAutonoma") {
      expect(cantabria2023.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.095"
      )
    }
  })

  it("aplica reglas especiales de 2023 para contribuyentes fallecidos", () => {
    const extremaduraGeneral = obtenerParametrosComunidadAutonoma({
      anio: 2023,
      comunidadAutonoma: "extremadura",
    })
    const extremaduraFallecido = obtenerParametrosComunidadAutonoma({
      anio: 2023,
      comunidadAutonoma: "extremadura",
      fechaFallecimiento: new Date("2023-09-14T00:00:00.000Z"),
    })
    const balearsGeneral = obtenerMinimosAutonomicosIrpf2023({
      comunidadAutonoma: "illes-balears",
    })
    const balearsFallecido = obtenerMinimosAutonomicosIrpf2023({
      comunidadAutonoma: "illes-balears",
      fechaFallecimiento: new Date("2023-11-25T00:00:00.000Z"),
    })

    if (
      extremaduraGeneral._tag === "ParametrosComunidadAutonoma" &&
      extremaduraFallecido._tag === "ParametrosComunidadAutonoma"
    ) {
      expect(extremaduraGeneral.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.08"
      )
      expect(
        extremaduraFallecido.escalaAutonomica.tramos[0][1].toString()
      ).toBe("0.095")
    }

    expect(balearsGeneral.descendientes.segundo.toString()).toBe("2970")
    expect(balearsFallecido.descendientes.segundo.toString()).toBe("2700")
    expect(
      balearsFallecido.ascendientes.mayor65OConDiscapacidad.toString()
    ).toBe("1150")
  })

  it("resuelve 2022 con escalas y minimos autonomicos propios del ejercicio", () => {
    const aragon2022 = obtenerParametrosComunidadAutonoma({
      anio: 2022,
      comunidadAutonoma: "aragon",
    })
    const aragon2025 = obtenerParametrosComunidadAutonoma({
      anio: 2025,
      comunidadAutonoma: "aragon",
    })
    const asturias2022 = obtenerParametrosComunidadAutonoma({
      anio: 2022,
      comunidadAutonoma: "asturias",
    })
    const madrid2022 = obtenerMinimosAutonomicosIrpf2022({
      comunidadAutonoma: "madrid",
    })
    const balears2022 = obtenerMinimosAutonomicosIrpf2022({
      comunidadAutonoma: "illes-balears",
    })

    expect(asturias2022).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "asturias",
      anio: 2022,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: false,
    })

    if (
      aragon2022._tag === "ParametrosComunidadAutonoma" &&
      aragon2025._tag === "ParametrosComunidadAutonoma"
    ) {
      expect(aragon2022.escalaAutonomica.tramos[0][0].toString()).toBe("12450")
      expect(aragon2025.escalaAutonomica.tramos[0][0].toString()).toBe(
        "13072.5"
      )
    }

    expect(madrid2022.contribuyente.general.toString()).toBe("5777.55")
    expect(balears2022.descendientes.segundo.toString()).toBe("2700")
  })

  it("aplica reglas especiales de 2022 para fallecidos en Comunitat Valenciana", () => {
    const comunitatGeneral = obtenerParametrosComunidadAutonoma({
      anio: 2022,
      comunidadAutonoma: "comunitat-valenciana",
    })
    const comunitatFallecido = obtenerParametrosComunidadAutonoma({
      anio: 2022,
      comunidadAutonoma: "comunitat-valenciana",
      fechaFallecimiento: new Date("2022-10-27T12:00:00.000Z"),
    })
    const minimosGenerales = obtenerMinimosAutonomicosIrpf2022({
      comunidadAutonoma: "comunitat-valenciana",
    })
    const minimosFallecido = obtenerMinimosAutonomicosIrpf2022({
      comunidadAutonoma: "comunitat-valenciana",
      fechaFallecimiento: new Date("2022-10-27T12:00:00.000Z"),
    })

    if (
      comunitatGeneral._tag === "ParametrosComunidadAutonoma" &&
      comunitatFallecido._tag === "ParametrosComunidadAutonoma"
    ) {
      expect(comunitatGeneral.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.09"
      )
      expect(comunitatFallecido.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.1"
      )
    }

    expect(minimosGenerales.contribuyente.general.toString()).toBe("6105")
    expect(minimosFallecido.contribuyente.general.toString()).toBe("5550")
  })

  it("resuelve 2021 con escalas y minimos autonomicos propios del ejercicio", () => {
    const andalucia2021 = obtenerParametrosComunidadAutonoma({
      anio: 2021,
      comunidadAutonoma: "andalucia",
    })
    const andalucia2025 = obtenerParametrosComunidadAutonoma({
      anio: 2025,
      comunidadAutonoma: "andalucia",
    })
    const madrid2021 = obtenerParametrosComunidadAutonoma({
      anio: 2021,
      comunidadAutonoma: "madrid",
    })
    const minimosMadrid2021 = obtenerMinimosAutonomicosIrpf2021("madrid")
    const minimosBalears2021 =
      obtenerMinimosAutonomicosIrpf2021("illes-balears")

    expect(andalucia2021).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "andalucia",
      anio: 2021,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: false,
    })

    if (
      andalucia2021._tag === "ParametrosComunidadAutonoma" &&
      andalucia2025._tag === "ParametrosComunidadAutonoma"
    ) {
      expect(andalucia2021.escalaAutonomica.tramos[0][0].toString()).toBe(
        "12450"
      )
      expect(andalucia2025.escalaAutonomica.tramos[0][0].toString()).toBe(
        "13000"
      )
    }

    if (madrid2021._tag === "ParametrosComunidadAutonoma") {
      expect(madrid2021.escalaAutonomica.tramos[0][1].toString()).toBe("0.09")
    }

    expect(minimosMadrid2021.contribuyente.general.toString()).toBe("5550")
    expect(minimosMadrid2021.descendientes.tercero.toString()).toBe("4400")
    expect(minimosBalears2021.contribuyente.general.toString()).toBe("5550")
    expect(minimosBalears2021.contribuyente.adicionalMayor65.toString()).toBe(
      "1820"
    )
  })

  it("mantiene el minimo autonomico especial de La Rioja solo para discapacidad de descendientes", () => {
    const minimosRioja = obtenerMinimosAutonomicosIrpf2025("la-rioja")

    expect(
      minimosRioja.discapacidad.contribuyente.grado33Hasta65.toString()
    ).toBe("3000")
    expect(minimosRioja.discapacidad.ascendiente.grado65OMas.toString()).toBe(
      "9000"
    )
    expect(
      minimosRioja.discapacidad.descendiente.grado33Hasta65.toString()
    ).toBe("3300")
    expect(minimosRioja.discapacidad.descendiente.grado65OMas.toString()).toBe(
      "9900"
    )
    expect(
      minimosRioja.discapacidad.descendiente.gastosAsistencia.toString()
    ).toBe("3000")
  })
})
