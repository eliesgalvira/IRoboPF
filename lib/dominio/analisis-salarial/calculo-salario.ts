import { Context, Effect, Layer, Match } from "effect"

import {
  medirAuditoriaSync,
  registrarTiempoAgregadoAuditoria,
  tiempoAuditoriaMs,
} from "../../observabilidad/auditoria-rendimiento"
import {
  detallePerfilAuditoriaNormativa,
  type PerfilAuditoriaNormativa,
} from "../auditoria/auditoria-normativa-historica"
import { centimosAEuros, eurosACentimos } from "../dinero/importe-monetario"
import {
  sinDiscapacidad,
  type ComunidadAutonoma,
} from "../irpf/caso-fiscal-anual"
import {
  LiquidacionIrpfAnual,
  type CasoFiscalAnual,
  type LiquidacionIrpfAnualCalculada,
  type LiquidarIrpfAnualError,
} from "../irpf/liquidacion/liquidar-irpf-anual"
import type {
  CasoRetencionTrabajo,
  DescendienteRetencion,
} from "../irpf/retenciones/retencion-trabajo-aeat"
import { calcularDesgloseCotizacionesPerfilUniforme } from "../laboral/cotizaciones-perfil-uniforme"
import type { AnioFiscal } from "../normativa/anio-fiscal"
import { type DesgloseLiquidado } from "./progresividad-frio"

export type SeleccionTemporalRetencion =
  | { readonly fechaPago: string; readonly perfilTemporal?: never }
  | { readonly perfilTemporal: "cierre"; readonly fechaPago?: never }

export interface EntradaCalculoSalario {
  readonly modo?: "canonico" | undefined
  readonly seleccionRetencion?: SeleccionTemporalRetencion | undefined
  readonly anio: AnioFiscal
  readonly salarioBrutoAnualCentimos: number
  readonly comunidadAutonoma?: ComunidadAutonoma | undefined
  readonly perfilAuditoria?: PerfilAuditoriaNormativa | undefined
}

export interface ServicioCalculoSalario {
  readonly calcular: (
    entrada: EntradaCalculoSalario
  ) => Effect.Effect<DesgloseLiquidado, LiquidarIrpfAnualError>
}

// Análisis salarial a partir de la única liquidación anual; no calcula nóminas.
// 2012-2025 usan liquidación anual IRPF migrada; 2026 es solo el caso técnico
// de soltero sin hijos y comunidad simulada estatal con parametros laborales y
// deduccion SMI 2026.
const construirCalcularSalario = (liquidacionIrpf: {
  readonly liquidar: (
    caso: CasoFiscalAnual,
    contexto: { readonly modo: "canonico" }
  ) => Effect.Effect<LiquidacionIrpfAnualCalculada, LiquidarIrpfAnualError>
}) =>
  Effect.fn("AnalisisSalarial.calcularSalario")(function* (
    entrada: EntradaCalculoSalario
  ) {
    return yield* Match.value(entrada.anio).pipe(
      Match.when(
        (anio) => anio >= 2012 && anio <= 2026,
        () => calcularSalarioConLiquidacionIrpfAnual(entrada, liquidacionIrpf)
      ),
      Match.orElse(() =>
        Effect.die(
          new Error(
            `El análisis salarial solo soporta IRPF anual 2012-2026 para el perfil técnico soltero sin hijos estatal; recibido ${entrada.anio}.`
          )
        )
      )
    )
  })

const calcularSalarioConLiquidacionIrpfAnual = Effect.fn(
  "AnalisisSalarial.calcularSalarioConLiquidacionIrpfAnual"
)(function* (
  entrada: EntradaCalculoSalario,
  liquidacionIrpf: {
    readonly liquidar: (
      caso: CasoFiscalAnual,
      contexto: { readonly modo: "canonico" }
    ) => Effect.Effect<LiquidacionIrpfAnualCalculada, LiquidarIrpfAnualError>
  }
) {
  if (
    entrada.perfilAuditoria !== undefined &&
    detallePerfilAuditoriaNormativa(entrada.perfilAuditoria).descendientes
      .length > 0
  )
    return yield* Effect.fail({
      _tag: "ResultadoNoSoportado" as const,
      motivo:
        "El perfil de auditoría no acredita titulares, rentas ni convivencia: aporte un CasoFiscalAnual con derechosMinimos completos",
      fuenteReconocida: "docs/procedencia/API-MOTOR.md",
      rastro: { titulo: "Hechos familiares insuficientes", pasos: [] },
    })
  const casoFiscal = medirAuditoriaSync(
    "AnalisisSalarial.casoFiscalAnalitico",
    () => casoFiscalAnalitico(entrada)
  )
  const inicioLiquidacion = tiempoAuditoriaMs()
  const liquidacion = yield* liquidacionIrpf.liquidar(casoFiscal, {
    modo: entrada.modo ?? "canonico",
  })
  registrarTiempoAgregadoAuditoria(
    "AnalisisSalarial.liquidarIrpfAnual",
    tiempoAuditoriaMs() - inicioLiquidacion
  )
  const salarioNetoAnualCentimos =
    entrada.salarioBrutoAnualCentimos -
    liquidacion.cotizacionTrabajadorCentimos -
    liquidacion.cuotaLiquidaCentimos
  return {
    rastro: liquidacion.rastro,
    salarioBrutoAnualCentimos: entrada.salarioBrutoAnualCentimos,
    cotizacionEmpresarialCentimos: liquidacion.cotizacionEmpresarialCentimos,
    costeLaboralCentimos: liquidacion.costeLaboralCentimos,
    cotizacionTrabajadorCentimos: liquidacion.cotizacionTrabajadorCentimos,
    irpfFinalCentimos: liquidacion.cuotaLiquidaCentimos,
    irpfFinalPrecisoEuros: centimosAEuros(
      liquidacion.cuotaLiquidaCentimos
    ).toString(),
    salarioNetoAnualCentimos,
  } satisfies DesgloseLiquidado
})

const descendientesRetencionPerfil = (
  perfil: PerfilAuditoriaNormativa
): ReadonlyArray<DescendienteRetencion> =>
  detallePerfilAuditoriaNormativa(perfil).descendientes.map((descendiente) => ({
    edad: descendiente.edad,
    computoPorEntero: descendiente.computoPorEntero,
    discapacidad: "sin-discapacidad",
    movilidadReducida: false,
    adopcionOAcogimientoMenosTresAnios: false,
  }))

const casoRetencionTrabajoPerfil = ({
  entrada,
  perfil,
}: {
  readonly entrada: EntradaCalculoSalario
  readonly perfil: PerfilAuditoriaNormativa
}): CasoRetencionTrabajo => {
  const detallePerfil = detallePerfilAuditoriaNormativa(perfil)

  return {
    ...entrada.seleccionRetencion,
    anio: entrada.anio,
    edad: 40,
    retribucionAnualCentimos: entrada.salarioBrutoAnualCentimos,
    cotizacionesCentimos: eurosACentimos(
      calcularDesgloseCotizacionesPerfilUniforme({
        salarioBrutoAnual: centimosAEuros(entrada.salarioBrutoAnualCentimos),
        anio: entrada.anio,
      }).cotizacionTrabajador
    ),
    situacionFamiliar: detallePerfil.situacionRetencion,
    situacionLaboral: "activo",
    contrato: "general",
    discapacidad: "sin-discapacidad",
    movilidadGeografica: false,
    descendientes: descendientesRetencionPerfil(perfil),
    ascendientes: [],
    irregular1Centimos: 0,
    irregular2Centimos: 0,
    pensionCompensatoriaConyugeCentimos: 0,
    anualidadesAlimentosHijosCentimos: 0,
    residenciaCeutaMelilla: false,
    rendimientosCeutaMelilla: false,
    pagosViviendaHabitual: false,
  }
}

const casoFiscalAnalitico = (
  entrada: EntradaCalculoSalario
): CasoFiscalAnual => {
  const perfil = entrada.perfilAuditoria ?? "soltero_sin_hijos"
  const retencionTrabajoAeat =
    entrada.perfilAuditoria !== undefined ||
    entrada.seleccionRetencion !== undefined
      ? casoRetencionTrabajoPerfil({ entrada, perfil })
      : undefined

  const caso: CasoFiscalAnual = {
    anio: entrada.anio,
    comunidadAutonoma: entrada.comunidadAutonoma ?? "simulada-estatal",
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
  }
  return retencionTrabajoAeat === undefined
    ? caso
    : { ...caso, retencionTrabajoAeat }
}

export class CalculoSalario extends Context.Service<
  CalculoSalario,
  ServicioCalculoSalario
>()("irobopf/lib/dominio/analisis-salarial/calculo-salario/CalculoSalario") {
  static readonly layer = Layer.effect(
    CalculoSalario,
    Effect.gen(function* () {
      const liquidacionIrpf = yield* LiquidacionIrpfAnual

      return {
        calcular: construirCalcularSalario(liquidacionIrpf),
      }
    })
  ).pipe(Layer.provideMerge(LiquidacionIrpfAnual.layer))
}

const calcularSalarioDesdeServicio = Effect.fn(
  "AnalisisSalarial.calcularSalarioDesdeServicio"
)(function* (entrada: EntradaCalculoSalario) {
  const compatibilidad = yield* CalculoSalario

  return yield* compatibilidad.calcular(entrada)
})

export const calcularSalario = (
  entrada: EntradaCalculoSalario
): Effect.Effect<DesgloseLiquidado, LiquidarIrpfAnualError> =>
  // @effect-diagnostics-next-line effect/strictEffectProvide:off
  calcularSalarioDesdeServicio(entrada).pipe(
    Effect.provide(CalculoSalario.layer)
  )
