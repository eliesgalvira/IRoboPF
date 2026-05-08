import { Context, Effect, Layer, Match, Option } from "effect"

import {
  anotarImportesIrpfAuxiliares,
  type DesgloseLiquidado,
} from "./progresividad-frio"
import type { AnioFiscal } from "../normativa/anio-fiscal"
import { centimosAEuros, eurosACentimos } from "../dinero/importe-monetario"
import { calcularCotizacionesSocialesLegacy } from "../laboral/cotizaciones-sociales"
import {
  LiquidacionIrpfAnual,
  type CasoFiscalAnual,
  type LiquidacionIrpfAnualCalculada,
  type LiquidarIrpfAnualError,
} from "../irpf/liquidacion/liquidar-irpf-anual"
import {
  sinDiscapacidad,
  type ComunidadAutonoma,
  type FamiliarFiscal,
} from "../irpf/caso-fiscal-anual"
import {
  detallePerfilAuditoriaNormativa,
  type PerfilAuditoriaNormativa,
} from "../auditoria/auditoria-normativa-historica"
import type {
  CasoRetencionTrabajo,
  DescendienteRetencion,
} from "../irpf/retenciones/retencion-trabajo-aeat"
import {
  medirAuditoriaSync,
  registrarTiempoAgregadoAuditoria,
  tiempoAuditoriaMs,
} from "../../observabilidad/auditoria-rendimiento"
import { UMBRAL_RENDIMIENTOS_TRABAJO_NO_OBLIGACION_DECLARAR_UN_PAGADOR_CENTIMOS } from "../normativa/datos/irpf-obligacion-declarar"

export interface EntradaCalculoSalarioLegacy {
  readonly anio: AnioFiscal
  readonly salarioBrutoAnualCentimos: number
  readonly comunidadAutonoma?: ComunidadAutonoma | undefined
  readonly perfilAuditoria?: PerfilAuditoriaNormativa | undefined
}

export interface ServicioCompatibilidadSalarioLegacy {
  readonly calcular: (
    entrada: EntradaCalculoSalarioLegacy
  ) => Effect.Effect<DesgloseLiquidado>
}

// Este adaptador conserva el contrato observable salarial del perfil legacy.
// 2012-2025 usan liquidación anual IRPF migrada; 2026 es solo el caso técnico
// de soltero sin hijos y comunidad simulada estatal con parametros laborales y
// deduccion SMI 2026.
const construirCalcularSalarioLegacy = (liquidacionIrpf: {
  readonly liquidar: (
    caso: CasoFiscalAnual,
    contexto: { readonly modo: "canonico" | "compatible-legacy" }
  ) => Effect.Effect<LiquidacionIrpfAnualCalculada, LiquidarIrpfAnualError>
}) =>
  Effect.fn("compatibilidadLegacy.calcularSalarioLegacy")(function* (
    entrada: EntradaCalculoSalarioLegacy
  ) {
    return yield* Match.value(entrada.anio).pipe(
      Match.when(
        (anio) => anio >= 2012 && anio <= 2026,
        () =>
          calcularSalarioLegacyConLiquidacionIrpfAnual(entrada, liquidacionIrpf)
      ),
      Match.orElse(() =>
        Effect.die(
          new Error(
            `Compatibilidad salarial legacy migrada solo soporta IRPF anual 2012-2026 para el perfil técnico soltero sin hijos estatal; recibido ${entrada.anio}.`
          )
        )
      )
    )
  })

const calcularSalarioLegacyConLiquidacionIrpfAnual = Effect.fn(
  "compatibilidadLegacy.calcularSalarioLegacyConLiquidacionIrpfAnual"
)(function* (
  entrada: EntradaCalculoSalarioLegacy,
  liquidacionIrpf: {
    readonly liquidar: (
      caso: CasoFiscalAnual,
      contexto: { readonly modo: "canonico" | "compatible-legacy" }
    ) => Effect.Effect<LiquidacionIrpfAnualCalculada, LiquidarIrpfAnualError>
  }
) {
  const casoFiscal = medirAuditoriaSync("salarioLegacy.casoFiscalLegacy", () =>
    casoFiscalLegacy(entrada)
  )
  const inicioLiquidacion = tiempoAuditoriaMs()
  const liquidacion = yield* liquidacionIrpf
    .liquidar(casoFiscal, {
      modo: "compatible-legacy",
    })
    .pipe(Effect.orDie)
  registrarTiempoAgregadoAuditoria(
    "salarioLegacy.liquidarIrpfAnual",
    tiempoAuditoriaMs() - inicioLiquidacion
  )
  const conciliacion = medirAuditoriaSync(
    "salarioLegacy.conciliacion.getOrThrow",
    () => Option.getOrThrow(liquidacion.conciliacionSimuladorLegacy)
  )
  const salarioBrutoAnual = medirAuditoriaSync(
    "salarioLegacy.salarioBruto.centimosAEuros",
    () => centimosAEuros(entrada.salarioBrutoAnualCentimos)
  )
  const cotizaciones = medirAuditoriaSync(
    "salarioLegacy.cotizacionesLegacy.extra",
    () =>
      calcularCotizacionesSocialesLegacy({
        salarioBrutoAnual,
        anio: entrada.anio,
      })
  )
  const salarioNetoAnualCentimos = medirAuditoriaSync(
    "salarioLegacy.salarioNeto.calcular",
    () =>
      eurosACentimos(
        salarioBrutoAnual
          .minus(cotizaciones.cotizacionTrabajador)
          .minus(conciliacion.irpfFinalSimulador)
      )
  )

  return medirAuditoriaSync("salarioLegacy.desglose.final", () =>
    anotarImportesIrpfAuxiliares(
      {
        salarioBrutoAnualCentimos: entrada.salarioBrutoAnualCentimos,
        cotizacionEmpresarialCentimos:
          liquidacion.cotizacionEmpresarialCentimos,
        costeLaboralCentimos: liquidacion.costeLaboralCentimos,
        cotizacionTrabajadorCentimos: liquidacion.cotizacionTrabajadorCentimos,
        irpfFinalCentimos: conciliacion.irpfFinalSimuladorCentimos,
        irpfFinalPrecisoEuros: conciliacion.irpfFinalSimulador.toString(),
        salarioNetoAnualCentimos,
      } satisfies DesgloseLiquidado,
      {
        irpfConObligacionDeclararCentimos:
          entrada.salarioBrutoAnualCentimos <=
          UMBRAL_RENDIMIENTOS_TRABAJO_NO_OBLIGACION_DECLARAR_UN_PAGADOR_CENTIMOS
            ? conciliacion.irpfFinalSimuladorCentimos
            : conciliacion.cuotaTrasDeduccionSmiCentimos,
        irpfCuotaTrasDeduccionSmiCentimos:
          conciliacion.cuotaTrasDeduccionSmiCentimos,
        irpfCuotaTrasDeduccionSmiPrecisoEuros:
          conciliacion.cuotaTrasDeduccionSmi.toString(),
      }
    )
  )
})

const descendientesFiscalesPerfil = (
  perfil: PerfilAuditoriaNormativa
): ReadonlyArray<FamiliarFiscal> =>
  detallePerfilAuditoriaNormativa(perfil).descendientes.map((descendiente) => ({
    edad: descendiente.edad,
    discapacidad: sinDiscapacidad,
  }))

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
  readonly entrada: EntradaCalculoSalarioLegacy
  readonly perfil: PerfilAuditoriaNormativa
}): CasoRetencionTrabajo => {
  const detallePerfil = detallePerfilAuditoriaNormativa(perfil)

  return {
    anio: entrada.anio,
    edad: 40,
    retribucionAnualCentimos: entrada.salarioBrutoAnualCentimos,
    cotizacionesCentimos: eurosACentimos(
      calcularCotizacionesSocialesLegacy({
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

const casoFiscalLegacy = (
  entrada: EntradaCalculoSalarioLegacy
): CasoFiscalAnual => {
  const perfil = entrada.perfilAuditoria ?? "soltero_sin_hijos"
  const retencionTrabajoAeat =
    entrada.perfilAuditoria !== undefined
      ? casoRetencionTrabajoPerfil({ entrada, perfil })
      : undefined

  return {
    anio: entrada.anio,
    comunidadAutonoma: entrada.comunidadAutonoma ?? "simulada-estatal",
    situacionFamiliar: {
      tipo: "individual",
      edad: 40,
      descendientes: descendientesFiscalesPerfil(perfil),
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
    ...(retencionTrabajoAeat !== undefined ? { retencionTrabajoAeat } : {}),
  }
}

export class CompatibilidadSalarioLegacy extends Context.Service<
  CompatibilidadSalarioLegacy,
  ServicioCompatibilidadSalarioLegacy
>()(
  "irobopf/lib/dominio/compatibilidad-legacy/calculo-salario-legacy/CompatibilidadSalarioLegacy"
) {
  static readonly layer = Layer.effect(
    CompatibilidadSalarioLegacy,
    Effect.gen(function* () {
      const liquidacionIrpf = yield* LiquidacionIrpfAnual

      return {
        calcular: construirCalcularSalarioLegacy(liquidacionIrpf),
      }
    })
  ).pipe(Layer.provideMerge(LiquidacionIrpfAnual.layer))
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
  // @effect-diagnostics-next-line effect/strictEffectProvide:off
  calcularSalarioLegacyDesdeServicio(entrada).pipe(
    Effect.provide(CompatibilidadSalarioLegacy.layer)
  )
