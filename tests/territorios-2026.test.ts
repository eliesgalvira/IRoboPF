import { calcularCuotaComponenteAhorro } from "../lib/dominio/irpf/cuotas/cuota-integra-ahorro"
import {
  familiaAnual,
  casoFamiliaAnual,
} from "../docs/procedencia/reforma-motor/bloque-e/ejemplos-familia"
import Decimal from "decimal.js"
import { Effect } from "effect"
import { expect, it } from "vitest"
import fixture from "./fixtures/b2026-fronteras.json"
import { obtenerParametrosComunidadAutonoma } from "../lib/dominio/irpf/comunidades/comunidad-autonoma"
import type { ComunidadAutonoma } from "../lib/dominio/irpf/caso-fiscal-anual"
import { calcularCuotaPorEscala } from "../lib/dominio/irpf/cuotas/escalas-gravamen"
import { obtenerEscalaAutonomicaPublicada } from "../lib/dominio/irpf/cuotas/escalas-publicadas"
import {
  obtenerMinimosAutonomicosIrpf2026,
  FUENTES_MINIMOS_AUTONOMICOS_2026,
} from "../lib/dominio/normativa/datos/minimos-autonomicos-2026"
import { MINIMOS_ESTATALES_2026 } from "../lib/dominio/normativa/datos/minimos-estatales-2026"
import { obtenerMinimoContribuyente } from "../lib/dominio/irpf/minimos/minimo-contribuyente"
import { componerLiquidacionAnual } from "../lib/dominio/irpf/liquidacion/composicion-anual"

it.each(fixture.fronteras)(
  "tabla + exceso $comunidad/$base en núcleo y composición",
  (caso) => {
    // SAFETY: fixture documental estática enumera únicamente los 17 territorios comunes.
    const comunidadAutonoma = caso.comunidad as ComunidadAutonoma
    const p = obtenerParametrosComunidadAutonoma({
      anio: 2026,
      comunidadAutonoma,
    })
    expect(p._tag).toBe("ParametrosComunidadAutonoma")
    if (p._tag !== "ParametrosComunidadAutonoma") return
    const A = Decimal.clone({ precision: 80 })
    const cuota = calcularCuotaPorEscala({
      base: new A(caso.base),
      tramos: p.escalaAutonomica.tramos,
      escalasPublicadas: [
        obtenerEscalaAutonomicaPublicada({ anio: 2026, comunidadAutonoma })!,
      ],
      aritmetica: A,
    })
    expect(cuota.eq(caso.cuota_exacta_tabla)).toBe(true)
    const r = Effect.runSync(
      componerLiquidacionAnual({
        ambito: {
          anio: 2026,
          comunidadAutonoma,
          situacionFamiliar: {
            tipo: "individual",
            edad: 40,
            discapacidad: { _tag: "SinDiscapacidad" },
            descendientes: [],
            ascendientes: [],
          },
        },
        cotizaciones: {
          naturaleza: "estimadas-perfil-uniforme",
          trabajador: new A(0),
        },
        precision: 80,
        politica: "decimal-hasta-salida",
        baseGeneral: new A(caso.base),
        baseAhorro: new A(0),
        rentasAntesReducciones: new A(caso.base),
        minimosEstatales: MINIMOS_ESTATALES_2026,
        deduccionesAutonomicasCentimos: 0,
      })
    )
    expect(r.cuotaIntegraGeneralAutonomica.eq(caso.cuota_exacta_tabla)).toBe(
      true
    )
    if (new A(caso.base).gt(0))
      expect(
        r.desgloseCuotaIntegraGeneralAutonomica[0]?.cuotaFija
      ).toBeDefined()
    expect(Decimal.precision).toBe(20)
  }
)
it.each(fixture.filas)("selección de fila oficial $comunidad/$base", (f) => {
  // SAFETY: filas documentales de los mismos 17 territorios comunes.
  const comunidadAutonoma = f.comunidad as ComunidadAutonoma
  const p = obtenerParametrosComunidadAutonoma({
    anio: 2026,
    comunidadAutonoma,
  })
  if (p._tag !== "ParametrosComunidadAutonoma") throw new Error(p.motivo)
  const cuota = calcularCuotaPorEscala({
    base: new Decimal(f.base).plus("0.01"),
    tramos: p.escalaAutonomica.tramos,
    escalasPublicadas: [
      obtenerEscalaAutonomicaPublicada({ anio: 2026, comunidadAutonoma })!,
    ],
  })
  expect(
    cuota.eq(
      new Decimal(f.cuota).plus(new Decimal(f.tipoPorcentaje).div(10000))
    )
  ).toBe(true)
})
it.each([65, 75])(
  "Baleares edad %s conserva incremento 1820, no total",
  (edad) => {
    const m = obtenerMinimosAutonomicosIrpf2026("illes-balears")
    expect(m.contribuyente.adicionalMayor65.toFixed()).toBe("1820")
    expect(
      obtenerMinimoContribuyente({ anio: 2026, edad, minimos: m }).toFixed()
    ).toBe(edad === 65 ? "7370" : "8910")
  }
)
it("Rioja sólo incrementa discapacidad descendiente, asistencia 3000", () => {
  const m = obtenerMinimosAutonomicosIrpf2026("la-rioja")
  expect(m.discapacidad.descendiente.grado33Hasta65.toFixed()).toBe("3300")
  expect(m.discapacidad.descendiente.grado65OMas.toFixed()).toBe("9900")
  expect(m.discapacidad.descendiente.gastosAsistencia.toFixed()).toBe("3000")
  expect(m.discapacidad.ascendiente.grado33Hasta65.toFixed()).toBe("3000")
  expect(m.discapacidad.ascendiente.grado65OMas.toFixed()).toBe("9000")
})
it("Canarias: respaldo por precepto vigente y separación estatal", () => {
  expect(FUENTES_MINIMOS_AUTONOMICOS_2026.canarias.evidencias[0].articulo).toBe(
    "18 quater"
  )
  expect(
    obtenerMinimosAutonomicosIrpf2026(
      "canarias"
    ).contribuyente.general.toFixed()
  ).toBe("5606")
  expect(MINIMOS_ESTATALES_2026.contribuyente.general.toFixed()).toBe("5550")
})
it.each(["navarra", "pais-vasco", "desconocida"])(
  "2026 rechaza %s",
  (territorio) => {
    expect(
      obtenerParametrosComunidadAutonoma({
        anio: 2026,
        // SAFETY: prueba deliberada de entradas runtime inválidas para verificar rechazo.
        comunidadAutonoma: territorio as ComunidadAutonoma,
      })._tag
    ).toBe("ComunidadAutonomaNoSoportada")
  }
)
it("Valencia 2026 (no DT3 2027) y Extremadura reformada", () => {
  for (const [comunidadAutonoma, tipo] of [
    ["comunitat-valenciana", "0.088"],
    ["extremadura", "0.0775"],
  ] as const) {
    const p = obtenerParametrosComunidadAutonoma({
      anio: 2026,
      comunidadAutonoma,
    })
    if (p._tag !== "ParametrosComunidadAutonoma") throw new Error(p.motivo)
    expect(p.escalaAutonomica.tramos[0][1].toFixed()).toBe(tipo)
    if (comunidadAutonoma === "extremadura")
      expect(p.escalaAutonomica.tramos[1][1].toFixed()).toBe("0.0975")
  }
})

it("simulada 2026 es un escenario técnico separado", () => {
  const r = obtenerParametrosComunidadAutonoma({
    anio: 2026,
    comunidadAutonoma: "simulada-estatal",
  })
  expect(r._tag).toBe("ParametrosComunidadAutonoma")
  if (r._tag === "ParametrosComunidadAutonoma") {
    expect(r.escalaAutonomicaIgualEstatal).toBe(true)
    expect(r.escalaAutonomica.nombre).toContain("técnico")
  }
})

it.each(fixture.familias)(
  "2026 familia $territorio separa mínimos estatales/autonómicos y ambos padres",
  (f) => {
    // SAFETY: familias de fixture contienen sólo los 17 territorios comunes reales.
    const territorio = f.territorio as Parameters<typeof familiaAnual>[1]
    const h = familiaAnual(2026, territorio)
    const resultados = [h, { ...h, contribuyenteId: "s-2" }].map((hechos) =>
      Effect.runSync(
        componerLiquidacionAnual({
          ambito: casoFamiliaAnual(hechos),
          cotizaciones: {
            naturaleza: "estimadas-perfil-uniforme",
            trabajador: new Decimal(0),
          },
          precision: 80,
          politica: "decimal-hasta-salida",
          baseGeneral: new Decimal(0),
          baseAhorro: new Decimal(30000),
          rentasAntesReducciones: new Decimal(30000),
          minimosEstatales: MINIMOS_ESTATALES_2026,
          deduccionesAutonomicasCentimos: 0,
        })
      )
    )
    for (const r of resultados) {
      expect(r.minimoPersonalYFamiliar.toFixed()).toBe("8100")
      expect(
        r.minimoPersonalYFamiliarAutonomico.eq(
          new Decimal(f.propio).plus(new Decimal(f.descendientesAmbos).div(2))
        )
      ).toBe(true)
    }
    expect(
      resultados[0]!.minimoDescendientes
        .plus(resultados[1]!.minimoDescendientes)
        .toFixed()
    ).toBe("5100")
  }
)

it.each([
  ["0", "0", "0"],
  ["12450", "1182.75", "1247.25"],
  ["20200", "2112.75", "2061"],
  ["35200", "4362.75", "3636"],
  ["60000", "8950.75", "6340"],
  ["200000", "40450.75", "22440"],
  ["300000", "62950.75", "35940"],
  ["300000.01", "62950.75245", "35940.0015"],
])(
  "2026 LIRPF63/66/76 base %s: estatal y cada componente ahorro",
  (base, general, ahorro) => {
    const p = obtenerParametrosComunidadAutonoma({
      anio: 2026,
      comunidadAutonoma: "madrid",
    })
    if (p._tag !== "ParametrosComunidadAutonoma") throw new Error(p.motivo)
    expect(
      calcularCuotaPorEscala({
        base: new Decimal(base!),
        tramos: p.escalaEstatalGeneral,
      }).eq(general!)
    ).toBe(true)
    for (const componente of ["estatal", "autonomico"] as const)
      expect(
        calcularCuotaComponenteAhorro({
          anio: 2026,
          componente,
          base: new Decimal(base!),
        }).eq(ahorro!)
      ).toBe(true)
  }
)
