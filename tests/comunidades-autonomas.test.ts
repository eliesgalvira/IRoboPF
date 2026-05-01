import Decimal from "decimal.js"
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
import { obtenerMinimosAutonomicosIrpf2020 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2020"
import { obtenerMinimosAutonomicosIrpf2019 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2019"
import { obtenerMinimosAutonomicosIrpf2018 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2018"
import { obtenerMinimosAutonomicosIrpf2017 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2017"
import { obtenerMinimosAutonomicosIrpf2016 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2016"
import { obtenerMinimosAutonomicosIrpf2015 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2015"
import { obtenerMinimosAutonomicosIrpf2014 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2014"
import { obtenerMinimosAutonomicosIrpf2013 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2013"
import { obtenerMinimosAutonomicosIrpf2012 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2012"

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

  it("resuelve 2020 con escala estatal general y autonomica propias del ejercicio", () => {
    const simulada2020 = obtenerParametrosComunidadAutonoma({
      anio: 2020,
      comunidadAutonoma: "simulada-estatal",
    })
    const madrid2020 = obtenerParametrosComunidadAutonoma({
      anio: 2020,
      comunidadAutonoma: "madrid",
    })
    const andalucia2020 = obtenerParametrosComunidadAutonoma({
      anio: 2020,
      comunidadAutonoma: "andalucia",
    })
    const minimosBalears2020 =
      obtenerMinimosAutonomicosIrpf2020("illes-balears")
    const minimosCatalunya2020 = obtenerMinimosAutonomicosIrpf2020("catalunya")

    expect(simulada2020).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "simulada-estatal",
      anio: 2020,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: true,
    })

    if (madrid2020._tag === "ParametrosComunidadAutonoma") {
      const ultimoTramoEstatal =
        madrid2020.escalaEstatalGeneral[
          madrid2020.escalaEstatalGeneral.length - 1
        ]

      expect(ultimoTramoEstatal[1].toString()).toBe("0.225")
      expect(madrid2020.escalaAutonomica.tramos[0][1].toString()).toBe("0.09")
      expect(
        madrid2020.minimosAutonomicos.contribuyente.general.toString()
      ).toBe("5550")
    }

    expect(andalucia2020).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "andalucia",
      anio: 2020,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: false,
    })

    expect(minimosBalears2020.contribuyente.adicionalMayor65.toString()).toBe(
      "1820"
    )
    expect(minimosCatalunya2020.contribuyente.general.toString()).toBe("5550")
  })

  it("resuelve 2019 con escala estatal general y autonomica propias del ejercicio", () => {
    const simulada2019 = obtenerParametrosComunidadAutonoma({
      anio: 2019,
      comunidadAutonoma: "simulada-estatal",
    })
    const madrid2019 = obtenerParametrosComunidadAutonoma({
      anio: 2019,
      comunidadAutonoma: "madrid",
    })
    const andalucia2019 = obtenerParametrosComunidadAutonoma({
      anio: 2019,
      comunidadAutonoma: "andalucia",
    })
    const minimosBalears2019 =
      obtenerMinimosAutonomicosIrpf2019("illes-balears")
    const minimosCastillaLeon2019 =
      obtenerMinimosAutonomicosIrpf2019("castilla-y-leon")

    expect(simulada2019).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "simulada-estatal",
      anio: 2019,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: true,
    })

    if (madrid2019._tag === "ParametrosComunidadAutonoma") {
      const ultimoTramoEstatal =
        madrid2019.escalaEstatalGeneral[
          madrid2019.escalaEstatalGeneral.length - 1
        ]

      expect(ultimoTramoEstatal[1].toString()).toBe("0.225")
      expect(madrid2019.escalaAutonomica.tramos[0][1].toString()).toBe("0.09")
      expect(
        madrid2019.minimosAutonomicos.contribuyente.general.toString()
      ).toBe("5550")
    }

    if (andalucia2019._tag === "ParametrosComunidadAutonoma") {
      expect(andalucia2019.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.0975"
      )
    }

    expect(minimosBalears2019.contribuyente.adicionalMayor65.toString()).toBe(
      "1820"
    )
    expect(minimosCastillaLeon2019.contribuyente.general.toString()).toBe(
      "5550"
    )
  })

  it("resuelve 2018 con escala estatal general, autonomica y minimos propios del ejercicio", () => {
    const simulada2018 = obtenerParametrosComunidadAutonoma({
      anio: 2018,
      comunidadAutonoma: "simulada-estatal",
    })
    const madrid2018 = obtenerParametrosComunidadAutonoma({
      anio: 2018,
      comunidadAutonoma: "madrid",
    })
    const andalucia2018 = obtenerParametrosComunidadAutonoma({
      anio: 2018,
      comunidadAutonoma: "andalucia",
    })
    const minimosBalears2018 =
      obtenerMinimosAutonomicosIrpf2018("illes-balears")
    const minimosCastillaLeon2018 =
      obtenerMinimosAutonomicosIrpf2018("castilla-y-leon")

    expect(simulada2018).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "simulada-estatal",
      anio: 2018,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: true,
    })

    if (madrid2018._tag === "ParametrosComunidadAutonoma") {
      const ultimoTramoEstatal =
        madrid2018.escalaEstatalGeneral[
          madrid2018.escalaEstatalGeneral.length - 1
        ]

      expect(ultimoTramoEstatal[1].toString()).toBe("0.225")
      expect(madrid2018.escalaAutonomica.tramos[0][1].toString()).toBe("0.09")
      expect(
        madrid2018.minimosAutonomicos.contribuyente.general.toString()
      ).toBe("5550")
    }

    if (andalucia2018._tag === "ParametrosComunidadAutonoma") {
      expect(andalucia2018.escalaAutonomica.tramos[0][1].toString()).toBe("0.1")
      expect(andalucia2018.minimoAutonomicoIgualEstatal).toBe(true)
    }

    expect(minimosBalears2018.contribuyente.adicionalMayor65.toString()).toBe(
      "1820"
    )
    expect(minimosCastillaLeon2018.contribuyente.general.toString()).toBe(
      "5550"
    )
  })

  it("resuelve 2017 con escala estatal general, autonomica y minimos propios del ejercicio", () => {
    const simulada2017 = obtenerParametrosComunidadAutonoma({
      anio: 2017,
      comunidadAutonoma: "simulada-estatal",
    })
    const madrid2017 = obtenerParametrosComunidadAutonoma({
      anio: 2017,
      comunidadAutonoma: "madrid",
    })
    const extremadura2017 = obtenerParametrosComunidadAutonoma({
      anio: 2017,
      comunidadAutonoma: "extremadura",
    })
    const minimosBalears2017 =
      obtenerMinimosAutonomicosIrpf2017("illes-balears")
    const minimosRioja2017 = obtenerMinimosAutonomicosIrpf2017("la-rioja")

    expect(simulada2017).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "simulada-estatal",
      anio: 2017,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: true,
    })

    if (madrid2017._tag === "ParametrosComunidadAutonoma") {
      const ultimoTramoEstatal =
        madrid2017.escalaEstatalGeneral[
          madrid2017.escalaEstatalGeneral.length - 1
        ]

      expect(ultimoTramoEstatal[1].toString()).toBe("0.225")
      expect(madrid2017.escalaAutonomica.tramos[0][1].toString()).toBe("0.095")
      expect(
        madrid2017.minimosAutonomicos.contribuyente.general.toString()
      ).toBe("5550")
    }

    if (extremadura2017._tag === "ParametrosComunidadAutonoma") {
      expect(extremadura2017.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.105"
      )
    }

    expect(minimosBalears2017.contribuyente.adicionalMayor65.toString()).toBe(
      "1820"
    )
    expect(
      minimosRioja2017.discapacidad.descendiente.grado33Hasta65.toString()
    ).toBe("3000")
  })

  it("resuelve 2016 con escala estatal general, autonomica y minimos propios del ejercicio", () => {
    const simulada2016 = obtenerParametrosComunidadAutonoma({
      anio: 2016,
      comunidadAutonoma: "simulada-estatal",
    })
    const madrid2016 = obtenerParametrosComunidadAutonoma({
      anio: 2016,
      comunidadAutonoma: "madrid",
    })
    const valenciana2016 = obtenerParametrosComunidadAutonoma({
      anio: 2016,
      comunidadAutonoma: "comunitat-valenciana",
    })
    const minimosBalears2016 =
      obtenerMinimosAutonomicosIrpf2016("illes-balears")
    const minimosRioja2016 = obtenerMinimosAutonomicosIrpf2016("la-rioja")

    expect(simulada2016).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "simulada-estatal",
      anio: 2016,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: true,
    })

    if (madrid2016._tag === "ParametrosComunidadAutonoma") {
      const ultimoTramoEstatal =
        madrid2016.escalaEstatalGeneral[
          madrid2016.escalaEstatalGeneral.length - 1
        ]

      expect(ultimoTramoEstatal[1].toString()).toBe("0.225")
      expect(madrid2016.escalaAutonomica.tramos[0][1].toString()).toBe("0.095")
      expect(
        madrid2016.minimosAutonomicos.contribuyente.general.toString()
      ).toBe("5550")
    }

    if (valenciana2016._tag === "ParametrosComunidadAutonoma") {
      expect(valenciana2016.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.119"
      )
    }

    expect(minimosBalears2016.contribuyente.adicionalMayor65.toString()).toBe(
      "1820"
    )
    expect(
      minimosRioja2016.discapacidad.descendiente.grado33Hasta65.toString()
    ).toBe("3000")
  })

  it("resuelve 2015 con escala estatal, art. 65 y especialidades autonomicas", () => {
    const simulada2015 = obtenerParametrosComunidadAutonoma({
      anio: 2015,
      comunidadAutonoma: "simulada-estatal",
    })
    const ceuta2015 = obtenerParametrosComunidadAutonoma({
      anio: 2015,
      comunidadAutonoma: "ceuta",
    })
    const galiciaBaja2015 = obtenerParametrosComunidadAutonoma({
      anio: 2015,
      baseLiquidableGeneral: new Decimal("17707.20"),
      comunidadAutonoma: "galicia",
    })
    const galiciaAlta2015 = obtenerParametrosComunidadAutonoma({
      anio: 2015,
      baseLiquidableGeneral: new Decimal("17707.21"),
      comunidadAutonoma: "galicia",
    })
    const balearsFallecido2015 = obtenerParametrosComunidadAutonoma({
      anio: 2015,
      comunidadAutonoma: "illes-balears",
      fechaFallecimiento: new Date("2015-12-30T00:00:00.000Z"),
    })
    const minimosBalears2015 =
      obtenerMinimosAutonomicosIrpf2015("illes-balears")
    const minimosRioja2015 = obtenerMinimosAutonomicosIrpf2015("la-rioja")

    expect(simulada2015).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "simulada-estatal",
      anio: 2015,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: false,
    })

    if (simulada2015._tag === "ParametrosComunidadAutonoma") {
      expect(simulada2015.escalaEstatalGeneral[2][0].toString()).toBe("34000")
      expect(simulada2015.escalaAutonomica.tramos[0][1].toString()).toBe("0.1")
    }

    if (ceuta2015._tag === "ParametrosComunidadAutonoma") {
      expect(ceuta2015.escalaAutonomica.tramos[0][1].toString()).toBe("0.1")
    }

    if (galiciaBaja2015._tag === "ParametrosComunidadAutonoma") {
      expect(galiciaBaja2015.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.115"
      )
    }

    if (galiciaAlta2015._tag === "ParametrosComunidadAutonoma") {
      expect(galiciaAlta2015.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.12"
      )
    }

    if (balearsFallecido2015._tag === "ParametrosComunidadAutonoma") {
      expect(
        balearsFallecido2015.escalaAutonomica.tramos.at(-1)?.[1].toString()
      ).toBe("0.215")
    }

    expect(minimosBalears2015.contribuyente.adicionalMayor65.toString()).toBe(
      "1820"
    )
    expect(
      minimosRioja2015.discapacidad.descendiente.grado33Hasta65.toString()
    ).toBe("3000")
  })

  it("resuelve 2014 como ejercicio pre-reforma 2015 con minimos estatales propios", () => {
    const simulada2014 = obtenerParametrosComunidadAutonoma({
      anio: 2014,
      comunidadAutonoma: "simulada-estatal",
    })
    const cantabria2014 = obtenerParametrosComunidadAutonoma({
      anio: 2014,
      comunidadAutonoma: "cantabria",
    })
    const galiciaBaja2014 = obtenerParametrosComunidadAutonoma({
      anio: 2014,
      baseLiquidableGeneral: new Decimal("17707.20"),
      comunidadAutonoma: "galicia",
    })
    const galiciaAlta2014 = obtenerParametrosComunidadAutonoma({
      anio: 2014,
      baseLiquidableGeneral: new Decimal("17707.21"),
      comunidadAutonoma: "galicia",
    })
    const minimosCantabria2014 = obtenerMinimosAutonomicosIrpf2014("cantabria")
    const minimosCastillaLaMancha2014 = obtenerMinimosAutonomicosIrpf2014(
      "castilla-la-mancha"
    )
    const minimosMadrid2014 = obtenerMinimosAutonomicosIrpf2014("madrid")
    const minimosRioja2014 = obtenerMinimosAutonomicosIrpf2014("la-rioja")

    expect(simulada2014).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "simulada-estatal",
      anio: 2014,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: false,
    })

    if (simulada2014._tag === "ParametrosComunidadAutonoma") {
      expect(simulada2014.escalaEstatalGeneral[0][1].toString()).toBe("0.1275")
      expect(simulada2014.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.12"
      )
      expect(
        simulada2014.minimosAutonomicos.contribuyente.general.toString()
      ).toBe("5151")
    }

    if (cantabria2014._tag === "ParametrosComunidadAutonoma") {
      expect(cantabria2014.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.11"
      )
      expect(cantabria2014.minimoAutonomicoIgualEstatal).toBe(false)
    }

    if (galiciaBaja2014._tag === "ParametrosComunidadAutonoma") {
      expect(galiciaBaja2014.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.115"
      )
    }

    if (galiciaAlta2014._tag === "ParametrosComunidadAutonoma") {
      expect(galiciaAlta2014.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.12"
      )
    }

    expect(minimosCantabria2014.descendientes.primero.toString()).toBe("2000")
    expect(minimosCastillaLaMancha2014.descendientes.primero.toString()).toBe(
      "1927.8"
    )
    expect(minimosMadrid2014.descendientes.tercero.toString()).toBe("4039.2")
    expect(minimosRioja2014.contribuyente.general.toString()).toBe("5151")
  })

  it("resuelve 2013 como ejercicio pre-reforma 2015 sin regla condicional de Galicia", () => {
    const simulada2013 = obtenerParametrosComunidadAutonoma({
      anio: 2013,
      comunidadAutonoma: "simulada-estatal",
    })
    const galicia2013 = obtenerParametrosComunidadAutonoma({
      anio: 2013,
      baseLiquidableGeneral: new Decimal("12000"),
      comunidadAutonoma: "galicia",
    })
    const madrid2013 = obtenerParametrosComunidadAutonoma({
      anio: 2013,
      comunidadAutonoma: "madrid",
    })
    const minimosMadrid2013 = obtenerMinimosAutonomicosIrpf2013("madrid")
    const minimosCantabria2013 = obtenerMinimosAutonomicosIrpf2013("cantabria")

    expect(simulada2013).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "simulada-estatal",
      anio: 2013,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: false,
    })

    if (simulada2013._tag === "ParametrosComunidadAutonoma") {
      expect(simulada2013.escalaEstatalGeneral[0][1].toString()).toBe("0.1275")
      expect(simulada2013.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.12"
      )
      expect(
        simulada2013.minimosAutonomicos.contribuyente.general.toString()
      ).toBe("5151")
    }

    if (galicia2013._tag === "ParametrosComunidadAutonoma") {
      expect(galicia2013.escalaAutonomica.tramos[0][1].toString()).toBe("0.12")
    }

    if (madrid2013._tag === "ParametrosComunidadAutonoma") {
      expect(madrid2013.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.116"
      )
      expect(madrid2013.minimoAutonomicoIgualEstatal).toBe(false)
    }

    expect(minimosMadrid2013.descendientes.tercero.toString()).toBe("4039.2")
    expect(minimosCantabria2013.descendientes.primero.toString()).toBe("1836")
  })

  it("resuelve 2012 como ejercicio pre-reforma 2015 sin regla de permanencia de ganancias", () => {
    const simulada2012 = obtenerParametrosComunidadAutonoma({
      anio: 2012,
      comunidadAutonoma: "simulada-estatal",
    })
    const asturias2012 = obtenerParametrosComunidadAutonoma({
      anio: 2012,
      comunidadAutonoma: "asturias",
    })
    const galicia2012 = obtenerParametrosComunidadAutonoma({
      anio: 2012,
      baseLiquidableGeneral: new Decimal("12000"),
      comunidadAutonoma: "galicia",
    })
    const madrid2012 = obtenerParametrosComunidadAutonoma({
      anio: 2012,
      comunidadAutonoma: "madrid",
    })
    const minimosMadrid2012 = obtenerMinimosAutonomicosIrpf2012("madrid")
    const minimosCantabria2012 = obtenerMinimosAutonomicosIrpf2012("cantabria")

    expect(simulada2012).toMatchObject({
      _tag: "ParametrosComunidadAutonoma",
      comunidadAutonoma: "simulada-estatal",
      anio: 2012,
      minimoAutonomicoIgualEstatal: true,
      escalaAutonomicaIgualEstatal: false,
    })

    if (simulada2012._tag === "ParametrosComunidadAutonoma") {
      expect(simulada2012.escalaEstatalGeneral[0][1].toString()).toBe("0.1275")
      expect(simulada2012.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.12"
      )
      expect(
        simulada2012.minimosAutonomicos.contribuyente.general.toString()
      ).toBe("5151")
    }

    if (asturias2012._tag === "ParametrosComunidadAutonoma") {
      expect(asturias2012.escalaAutonomica.tramos[4][1].toString()).toBe(
        "0.24"
      )
    }

    if (galicia2012._tag === "ParametrosComunidadAutonoma") {
      expect(galicia2012.escalaAutonomica.tramos[0][1].toString()).toBe("0.12")
    }

    if (madrid2012._tag === "ParametrosComunidadAutonoma") {
      expect(madrid2012.escalaAutonomica.tramos[0][1].toString()).toBe(
        "0.116"
      )
      expect(madrid2012.minimoAutonomicoIgualEstatal).toBe(false)
    }

    expect(minimosMadrid2012.descendientes.tercero.toString()).toBe("4039.2")
    expect(minimosCantabria2012.descendientes.primero.toString()).toBe("1836")
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
