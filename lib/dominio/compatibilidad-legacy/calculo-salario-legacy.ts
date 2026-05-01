import { Context, Effect, Layer, Match, Option } from "effect"

import type { DesgloseLiquidado } from "./progresividad-frio"
import type { AnioFiscal } from "../normativa/anio-fiscal"
import { centimosAEuros, eurosACentimos } from "../dinero/importe-monetario"
import { calcularCotizacionesSocialesLegacy } from "../laboral/cotizaciones-sociales"
import {
  liquidarIrpfAnual,
  type CasoFiscalAnual,
} from "../irpf/liquidacion/liquidar-irpf-anual"
import { sinDiscapacidad } from "../irpf/caso-fiscal-anual"

export interface EntradaCalculoSalarioLegacy {
  readonly anio: AnioFiscal
  readonly salarioBrutoAnualCentimos: number
}

export interface ServicioCompatibilidadSalarioLegacy {
  readonly calcular: (
    entrada: EntradaCalculoSalarioLegacy
  ) => Effect.Effect<DesgloseLiquidado>
}

// Este adaptador conserva el contrato observable salarial del perfil legacy.
// 2012-2025 usan liquidacion anual IRPF migrada; 2026 es solo el caso tecnico
// de soltero sin hijos y comunidad simulada estatal con parametros laborales y
// deduccion SMI 2026.
const calcularSalarioLegacyImpl = Effect.fn(
  "compatibilidadLegacy.calcularSalarioLegacy"
)(function* (entrada: EntradaCalculoSalarioLegacy) {
  return yield* Match.value(entrada.anio).pipe(
    Match.when(
      (anio) => anio >= 2012 && anio <= 2026,
      () => calcularSalarioLegacyConLiquidacionIrpfAnual(entrada)
    ),
    Match.orElse(() =>
      Effect.die(
        new Error(
          `Compatibilidad salarial legacy migrada solo soporta IRPF anual 2012-2026 para el perfil tecnico soltero sin hijos estatal; recibido ${entrada.anio}.`
        )
      )
    )
  )
})

const calcularSalarioLegacyConLiquidacionIrpfAnual = Effect.fn(
  "compatibilidadLegacy.calcularSalarioLegacyConLiquidacionIrpfAnual"
)(function* (entrada: EntradaCalculoSalarioLegacy) {
  const liquidacion = yield* liquidarIrpfAnual(casoFiscalLegacy(entrada), {
    modo: "compatible-legacy",
  }).pipe(Effect.orDie)
  const conciliacion = Option.getOrThrow(
    liquidacion.conciliacionSimuladorLegacy
  )
  const salarioBrutoAnual = centimosAEuros(entrada.salarioBrutoAnualCentimos)
  const cotizaciones = calcularCotizacionesSocialesLegacy({
    salarioBrutoAnual,
    anio: entrada.anio,
  })
  const salarioNetoAnualCentimos = eurosACentimos(
    salarioBrutoAnual
      .minus(cotizaciones.cotizacionTrabajador)
      .minus(conciliacion.irpfFinalSimulador)
  )

  return {
    salarioBrutoAnualCentimos: entrada.salarioBrutoAnualCentimos,
    cotizacionEmpresarialCentimos: liquidacion.cotizacionEmpresarialCentimos,
    costeLaboralCentimos: liquidacion.costeLaboralCentimos,
    cotizacionTrabajadorCentimos: liquidacion.cotizacionTrabajadorCentimos,
    irpfFinalCentimos: conciliacion.irpfFinalSimuladorCentimos,
    salarioNetoAnualCentimos,
  } satisfies DesgloseLiquidado
})

const casoFiscalLegacy = (
  entrada: EntradaCalculoSalarioLegacy
): CasoFiscalAnual => ({
  anio: entrada.anio,
  comunidadAutonoma: "simulada-estatal",
  situacionFamiliar: {
    tipo: "individual",
    edad: 40,
    descendientes: [],
    ascendientes: [],
    discapacidad: sinDiscapacidad,
  },
  rendimientos: {
    trabajo: [
      {
        importeIntegroCentimos: entrada.salarioBrutoAnualCentimos,
      },
    ],
  },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 0,
  pagosACuentaCentimos: 0,
})

export class CompatibilidadSalarioLegacy extends Context.Service<
  CompatibilidadSalarioLegacy,
  ServicioCompatibilidadSalarioLegacy
>()("@irobopf/dominio/compatibilidadLegacy/CompatibilidadSalarioLegacy") {
  static readonly layer = Layer.succeed(CompatibilidadSalarioLegacy, {
    calcular: calcularSalarioLegacyImpl,
  })
}

const calcularSalarioLegacyDesdeServicio = Effect.fn(
  "compatibilidadLegacy.calcularSalarioLegacyDesdeServicio"
)(function* (entrada: EntradaCalculoSalarioLegacy) {
  const compatibilidad = yield* CompatibilidadSalarioLegacy

  return yield* compatibilidad.calcular(entrada)
})

export const calcularSalarioLegacy = (
  entrada: EntradaCalculoSalarioLegacy
): Effect.Effect<DesgloseLiquidado> =>
  calcularSalarioLegacyDesdeServicio(entrada).pipe(
    Effect.provide(CompatibilidadSalarioLegacy.layer)
  )
