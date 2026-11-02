import { expect, it } from "vitest"
import { Effect } from "effect"
import Decimal from "decimal.js"
import * as cuotas from "../../../../lib/dominio/irpf/cuotas/escalas-gravamen"
import * as datos from "../../../../lib/dominio/normativa/datos/irpf-estatal-2012-2026"
import * as tablas from "../../../../lib/dominio/analisis-salarial/progresividad-frio"
import * as auditoria from "../../../../lib/dominio/auditoria/auditoria-progresividad-frio"
import {
  liquidarIrpfAnual,
  LiquidacionIrpfAnual,
} from "../../../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { obtenerParametrosComunidadAutonoma as parametros } from "../../../../lib/dominio/irpf/comunidades/comunidad-autonoma"
import {
  construirLibroAuditoriaCompatible,
  construirLibroAuditoriaCompatibleConProgreso,
} from "../../../../lib/export/auditoria-excel"
const caso = (
  anio = 2025,
  base = 30000000,
  comunidadAutonoma = "simulada-estatal"
) => ({
  anio,
  comunidadAutonoma,
  situacionFamiliar: {
    tipo: "individual",
    edad: 40,
    discapacidad: { _tag: "SinDiscapacidad" },
    descendientes: [],
    ascendientes: [],
  },
  rendimientos: {
    trabajo: [],
    capitalInmobiliario: [{ importeIntegroCentimos: base }],
  },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 0,
  pagosACuentaCentimos: 0,
})
const derechos = () => ({
  ejercicio: 2025,
  territorio: "madrid",
  regimen: "comun",
  modalidad: "individual",
  devengo: "2025-12-31",
  contribuyenteId: "s-1",
  edadContribuyenteDevengo: 40,
  discapacidadContribuyente: { _tag: "SinDiscapacidad" },
  ascendientes: "ninguno",
  fallecimientosEnElEjercicio: "ninguno",
  descendientesCompletos: true,
  conciliacionRentasContribuyente: {
    perfil: "caso-anual-parcial",
    otrasRentasOGastosNoRepresentados: "ninguno",
  },
  descendientes: [],
})
const directo = (c) =>
  Effect.runSync(Effect.exit(liquidarIrpfAnual(c, { modo: "canonico" })))
const servicio = (c) =>
  Effect.runSync(
    Effect.gen(function* () {
      const motor = yield* LiquidacionIrpfAnual
      return yield* Effect.exit(motor.liquidar(c, { modo: "canonico" }))
    }).pipe(Effect.provide(LiquidacionIrpfAnual.layer))
  )
it("R-M01/R-M02: superficies retiradas, incluida reexportación de auditoría", () => {
  for (const k of [
    "calcularCuotaPorEscalaGeneral",
    "calcularDesgloseCuotaPorEscalaGeneral",
  ])
    expect(k in cuotas).toBe(false)
  for (const k of [
    "obtenerTramosIrpfLegacy",
    "TRAMOS_IRPF_HASTA_2014",
    "TRAMOS_IRPF_2015",
    "TRAMOS_IRPF_2016_A_2020",
    "TRAMOS_IRPF_DESDE_2021",
  ])
    expect(k in datos).toBe(false)
  for (const mod of [tablas, auditoria])
    expect("construirTablaControlTramosIrpfCompatible" in mod).toBe(false)
})
it("R-M01: sucesor integra frontera exacta y mantiene cuota anual", () => {
  const p = parametros({
    anio: 2014,
    baseLiquidableGeneral: new Decimal("17707.20"),
    comunidadAutonoma: "simulada-estatal",
  })
  expect(p._tag).toBe("ParametrosComunidadAutonoma")
  expect(p.escalaEstatalGeneral[0][0].toString()).toBe("17707.2")
  const q = cuotas
    .calcularCuotaPorEscala({
      base: new Decimal("17707.20"),
      tramos: p.escalaEstatalGeneral,
    })
    .plus(
      cuotas.calcularCuotaPorEscala({
        base: new Decimal("17707.20"),
        tramos: p.escalaAutonomica.tramos,
      })
    )
  expect(q.toString()).toBe("4382.532")
  expect(directo(caso(2014, 1770720))).toMatchObject({
    _tag: "Success",
    value: {
      baseLiquidableGeneralCentimos: 1770720,
      cuotaIntegraGeneralCentimos: 438253,
    },
  })
})
for (const usarDerechos of [false, true]) {
  it(`R-M03 JavaScript: controles y rechazo tipado, derechos=${usarDerechos}`, () => {
    for (const api of [directo, servicio]) {
      const c = caso(2025, 3000000, "madrid")
      c.rendimientos = { trabajo: [{ importeIntegroCentimos: 3000000 }] }
      if (usarDerechos) c.derechosMinimos = derechos()
      expect(api(c)._tag).toBe("Success")
      for (const tipo of ["conjunta", "", null, undefined, 1, {}]) {
        const entrada = structuredClone(c)
        entrada.situacionFamiliar.tipo = tipo
        const r = api(entrada)
        expect(r._tag).toBe("Failure")
        expect(r.cause.reasons).toHaveLength(1)
        expect(r.cause.reasons[0]).toMatchObject({
          _tag: "Fail",
          error: {
            _tag: "ResultadoNoSoportado",
            motivo: "La liquidación anual solo admite modalidad individual",
          },
        })
      }
    }
  })
}
for (const anio of [
  2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
]) {
  it(`simulación ${anio}: integración independiente y euro marginal`, () => {
    const limites =
      anio <= 2020
        ? [12450, 20200, 35200, 60000, Infinity]
        : [12450, 20200, 35200, 60000, 300000, Infinity]
    const tipos =
      anio <= 2020
        ? [".19", ".24", ".30", ".37", ".45"]
        : [".19", ".24", ".30", ".37", ".45", ".49"]
    const integrar = (base) => {
      let previo = new Decimal(0),
        total = new Decimal(0)
      limites.forEach((limite, i) => {
        const ancho = Decimal.max(0, Decimal.min(base, limite).minus(previo))
        total = total.plus(ancho.mul(tipos[i]))
        previo = new Decimal(limite)
      })
      return total.mul(100).toDecimalPlaces(0).toNumber()
    }
    for (const base of [
      1245000, 2020000, 3520000, 6000000, 30000000, 30000100,
    ]) {
      const resultado = directo(caso(anio, base))
      expect(resultado._tag).toBe("Success")
      expect(resultado.value.cuotaIntegraGeneralCentimos).toBe(
        integrar(new Decimal(base).div(100))
      )
    }
    expect(
      directo(caso(anio, 30000100)).value.cuotaIntegraGeneralCentimos -
        directo(caso(anio, 30000000)).value.cuotaIntegraGeneralCentimos
    ).toBe(anio <= 2020 ? 45 : 49)
  })
}
it("escenario real Madrid 2025: no duplica la estatal", () => {
  const p = parametros({
    anio: 2025,
    baseLiquidableGeneral: new Decimal(300001),
    comunidadAutonoma: "madrid",
  })
  expect(p.escalaAutonomicaIgualEstatal).toBe(false)
  expect(
    directo(caso(2025, 30000100, "madrid")).value.cuotaIntegraGeneralCentimos -
      directo(caso(2025, 30000000, "madrid")).value.cuotaIntegraGeneralCentimos
  ).toBe(45)
})
it("R-M02: libro corriente y progresivo sin CONTROL_TRAMOS_IRPF", async () => {
  const a = Effect.runSync(
    tablas.auditarRangoSalarial({
      salarioBrutoAnualMinimoCentimos: 3000000,
      salarioBrutoAnualMaximoCentimos: 3000000,
      pasoCentimos: 100,
      anioComparado: 2025,
      anioReferencia: 2025,
    })
  )
  const libros = [
    construirLibroAuditoriaCompatible(a),
    await Effect.runPromise(
      construirLibroAuditoriaCompatibleConProgreso(a, { filasPorBloque: 1 })
    ),
  ]
  for (const libro of libros)
    expect(libro.worksheets.map((h) => h.name)).toEqual([
      "CONTROL_GENERAL",
      "COMPARATIVA_INFLACION",
    ])
})
