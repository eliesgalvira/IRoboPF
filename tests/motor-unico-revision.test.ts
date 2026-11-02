// Tests inspect removed exports and invoke Effect entry points.
// @effect-diagnostics effect/strictEffectProvide:off
import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect } from "effect"
import * as cuotas from "../lib/dominio/irpf/cuotas/escalas-gravamen"
import * as datos from "../lib/dominio/normativa/datos/irpf-estatal-2012-2026"
import * as tablas from "../lib/dominio/analisis-salarial/progresividad-frio"
import type { AnioFiscal } from "../lib/dominio/normativa/anio-fiscal"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import { obtenerParametrosComunidadAutonoma } from "../lib/dominio/irpf/comunidades/comunidad-autonoma"
import {
  LiquidacionIrpfAnual,
  liquidarIrpfAnual,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

const caso = (anio: AnioFiscal, baseCentimos: number): CasoFiscalAnual => ({
  anio,
  comunidadAutonoma: "simulada-estatal",
  situacionFamiliar: {
    tipo: "individual",
    edad: 40,
    discapacidad: { _tag: "SinDiscapacidad" },
    descendientes: [],
    ascendientes: [],
  },
  rendimientos: {
    trabajo: [],
    capitalInmobiliario: [{ importeIntegroCentimos: baseCentimos }],
  },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 0,
  pagosACuentaCentimos: 0,
})

it("R-M01/R-M02: no ofrece helpers, datos ni exportación de la tarifa retirada", () => {
  expect("calcularCuotaPorEscalaGeneral" in cuotas).toBe(false)
  expect("calcularDesgloseCuotaPorEscalaGeneral" in cuotas).toBe(false)
  for (const nombre of [
    "obtenerTramosIrpfLegacy",
    "TRAMOS_IRPF_HASTA_2014",
    "TRAMOS_IRPF_2015",
    "TRAMOS_IRPF_2016_A_2020",
    "TRAMOS_IRPF_DESDE_2021",
  ])
    expect(nombre in datos).toBe(false)
  expect("construirTablaControlTramosIrpfCompatible" in tablas).toBe(false)
})

it("la ruta vigente conserva los céntimos y la cuota anual de la frontera 2014", () => {
  const entrada = caso(2014, 1770720)
  const parametros = obtenerParametrosComunidadAutonoma({
    anio: 2014,
    baseLiquidableGeneral: new Decimal("17707.20"),
    comunidadAutonoma: "simulada-estatal",
  })
  expect(parametros._tag).toBe("ParametrosComunidadAutonoma")
  if (parametros._tag !== "ParametrosComunidadAutonoma")
    throw new Error("El contraste 2014 debe estar admitido")
  const estatal = cuotas.calcularCuotaPorEscala({
    base: new Decimal("17707.20"),
    tramos: parametros.escalaEstatalGeneral,
  })
  const autonomica = cuotas.calcularCuotaPorEscala({
    base: new Decimal("17707.20"),
    tramos: parametros.escalaAutonomica.tramos,
  })
  expect(estatal.plus(autonomica).toString()).toBe("4382.532")
  const resultado = Effect.runSync(
    liquidarIrpfAnual(entrada, { modo: "canonico" })
  )
  expect(resultado.baseLiquidableGeneralCentimos).toBe(1770720)
  expect(resultado.cuotaIntegraGeneralCentimos).toBe(438253)
})

it("la simulación duplica la parte estatal vigente, también después de 300000 euros", () => {
  for (const anio of [2021, 2022, 2023, 2024, 2025, 2026] as const) {
    const inferior = Effect.runSync(
      liquidarIrpfAnual(caso(anio, 30000000), { modo: "canonico" })
    )
    const superior = Effect.runSync(
      liquidarIrpfAnual(caso(anio, 30000100), { modo: "canonico" })
    )
    expect(superior.baseLiquidableGeneralCentimos).toBe(30000100)
    expect(
      superior.cuotaIntegraGeneralCentimos -
        inferior.cuotaIntegraGeneralCentimos
    ).toBe(49)
  }
})

it("R-M03: ambas API rechazan modalidades ajenas sin derechos y sin defectos de ejecución", () => {
  for (const tipo of ["conjunta", "", null, undefined]) {
    const entrada = {
      ...caso(2025, 3000000),
      comunidadAutonoma: "madrid" as const,
    }
    // Simula un consumidor JavaScript que introduce un valor fuera del tipo TS.
    Object.defineProperty(entrada.situacionFamiliar, "tipo", { value: tipo })
    const directo = Effect.runSync(
      Effect.exit(liquidarIrpfAnual(entrada, { modo: "canonico" }))
    )
    const servicio = Effect.runSync(
      Effect.gen(function* () {
        const motor = yield* LiquidacionIrpfAnual
        return yield* Effect.exit(motor.liquidar(entrada, { modo: "canonico" }))
      }).pipe(Effect.provide(LiquidacionIrpfAnual.layer))
    )
    for (const resultado of [directo, servicio]) {
      expect(resultado._tag).toBe("Failure")
      if (resultado._tag !== "Failure") throw new Error("Modalidad admitida")
      expect(resultado.cause.reasons).toHaveLength(1)
      expect(resultado.cause.reasons[0]).toMatchObject({
        _tag: "Fail",
        error: {
          _tag: "ResultadoNoSoportado",
          motivo: "La liquidación anual solo admite modalidad individual",
        },
      })
    }
  }
})
