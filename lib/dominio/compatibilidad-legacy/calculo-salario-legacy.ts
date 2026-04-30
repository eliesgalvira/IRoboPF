import { Context, Effect, Layer, Option } from "effect"

import {
  compararAjustadoPorIpc,
  type DesgloseLiquidado,
} from "./progresividad-frio"
import type { AnioFiscal } from "../normativa/anio-fiscal"
import {
  liquidarIrpfAnual,
  type CasoFiscalAnual,
} from "../irpf/liquidacion/liquidar-irpf-anual"
import { sinDiscapacidad } from "../irpf/caso-fiscal-anual"

export interface EntradaCalculoSalarioLegacy {
  readonly anio: AnioFiscal
  readonly salarioBrutoAnualCentimos: number
}

// Este adaptador conserva el contrato observable del perfil legacy mientras el
// calculo se va moviendo desde la compatibilidad historica hacia servicios
// fiscales explicitos.
const calcularSalarioLegacyImpl = Effect.fn(
  "compatibilidadLegacy.calcularSalarioLegacy"
)(function* (entrada: EntradaCalculoSalarioLegacy) {
  if (entrada.anio === 2025) {
    return yield* calcularSalarioLegacy2025ConLiquidacionIrpfAnual(entrada)
  }

  const calculo = yield* compararAjustadoPorIpc({
    salarioBrutoAnualReferenciaCentimos: entrada.salarioBrutoAnualCentimos,
    anioComparado: entrada.anio,
    anioReferencia: entrada.anio,
  })

  return calculo.referencia
})

const calcularSalarioLegacy2025ConLiquidacionIrpfAnual = Effect.fn(
  "compatibilidadLegacy.calcularSalarioLegacy2025ConLiquidacionIrpfAnual"
)(function* (entrada: EntradaCalculoSalarioLegacy) {
  const liquidacion = yield* liquidarIrpfAnual(casoFiscalLegacy(entrada), {
    modo: "compatible-legacy",
  }).pipe(Effect.orDie)
  const conciliacion = Option.getOrThrow(
    liquidacion.conciliacionSimuladorLegacy
  )
  const salarioNetoAnualCentimos =
    entrada.salarioBrutoAnualCentimos -
    liquidacion.cotizacionTrabajadorCentimos -
    conciliacion.irpfFinalSimuladorCentimos

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
  {
    readonly calcular: (
      entrada: EntradaCalculoSalarioLegacy
    ) => Effect.Effect<DesgloseLiquidado>
  }
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
