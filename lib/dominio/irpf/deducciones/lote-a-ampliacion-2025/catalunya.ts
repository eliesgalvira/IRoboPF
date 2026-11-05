import { anteriorJulio2011 } from "./vivienda"
import type Decimal from "decimal.js"
import { Schema } from "effect"
import {
  D,
  Texto,
  Entero,
  Centimos,
  Grado,
  Contexto,
  Pago,
  exigir,
  ref,
  fecha,
  edad,
  unicos,
  titulares,
  eur,
  rentaPersonal,
  pagado,
  pagos,
} from "./comun"
import { Vivienda, baseVivienda, transitorio } from "./vivienda"
import { Inversion, sociedad, ampliacionTresAnios } from "./inversion"
export const S0 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("catalunya"),
  codigo: Schema.Literal("cataluna_rehabilitacion_vivienda_habitual"),
  hechos: Schema.Struct({ vivienda: Vivienda }),
})
export const S1 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("catalunya"),
  codigo: Schema.Literal(
    "cataluna_tramo_autonomico_inversion_vivienda_habitual"
  ),
  hechos: Schema.Struct({
    vivienda: Vivienda,
    diasParo: Entero,
    grado: Grado,
    resolucionDiscapacidad: Schema.String,
    hijosUnidadFamiliar: Schema.Array(Texto),
    referenciaUnidad: Texto,
  }),
})
export const S2 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("catalunya"),
  codigo: Schema.Literal("cataluna_angel_inversor"),
  hechos: Schema.Struct({ inversiones: Schema.Array(Inversion) }),
})
export const S3 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("catalunya"),
  codigo: Schema.Literal("cataluna_alquiler_vivienda_habitual"),
  hechos: Schema.Struct({
    vivienda: Texto,
    contrato: Texto,
    arrendadorFiscal: Texto,
    habitualidad: Texto,
    diasParo: Entero,
    grado: Grado,
    resolucionDiscapacidad: Schema.String,
    estadoCivil: Schema.Literals(["viudo", "otro"]),
    tituloViudedad: Schema.String,
    familia: Schema.Literals(["ordinaria", "numerosa", "monoparental"]),
    tituloFamilia: Schema.String,
    declarantesConDerecho: Schema.Array(Texto),
    pagosConsolidados: Schema.Array(Pago),
  }),
})
export const S4 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("catalunya"),
  codigo: Schema.Literal("cataluna_alquiler_victimas_violencia_machista"),
  hechos: Schema.Struct({
    vivienda: Texto,
    contratoTitular: Texto,
    habitualidad: Texto,
    medioPruebaLey5: Texto,
    fechaAcreditacion: Texto,
    primerEjercicioAplicacion: Entero,
    ejerciciosAplicados: Schema.Array(Entero),
    grado: Grado,
    resolucionDiscapacidad: Schema.String,
    hijosMenoresACargo: Schema.Array(
      Schema.Struct({
        persona: Texto,
        nacimiento: Texto,
        referenciaCargo: Texto,
      })
    ),
    pagos: Schema.Array(Pago),
  }),
})
export const S5 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("catalunya"),
  codigo: Schema.Literal("cataluna_inversion_cooperativas_agrarias_vivienda"),
  hechos: Schema.Struct({
    aportaciones: Schema.Array(
      Schema.Struct({
        pago: Pago,
        cooperativa: Texto,
        clase: Schema.Literals([
          "agraria",
          "vivienda",
          "vivienda-turistica",
          "otra",
        ]),
        socio: Schema.Literals([
          "ordinario",
          "colaborador",
          "otro-no-temporal",
          "temporal",
        ]),
        votosPuntosBasicos: Entero,
        registroGeneralitat: Texto,
        certificado: Texto,
        mantenimiento: Schema.Literals([
          "vigente",
          "baja-reinversion",
          "transmision-estatutaria",
          "incumplido",
        ]),
        referenciaSeguimiento: Texto,
        referenciaReinversionOEstatutos: Schema.String,
        reinversion: Schema.NullOr(
          Schema.Struct({
            cooperativa: Texto,
            fecha: Texto,
            clase: Schema.Literals(["agraria", "vivienda"]),
            registro: Texto,
            certificado: Texto,
            socio: Schema.Literals([
              "ordinario",
              "colaborador",
              "otro-no-temporal",
            ]),
            votosPuntosBasicos: Entero,
            importeRetiradoCentimos: Centimos,
            importeReinvertidoCentimos: Centimos,
          })
        ),
      })
    ),
  }),
})
export const S6 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("catalunya"),
  codigo: Schema.Literal("cataluna_obligacion_declarar_mas_de_un_pagador"),
  hechos: Schema.Struct({
    cuotaIntegraAutonomicaCentimos: Centimos,
    cuotaIntegraEstatalCentimos: Centimos,
    pagadores: Schema.Array(
      Schema.Struct({
        id: Texto,
        clase: Schema.Literals(["empleo", "estatutario", "prestacion-pasiva"]),
        integroCentimos: Centimos,
        certificado: Texto,
      })
    ),
    otrasRentasCentimos: Centimos,
    altaAutonomo2025: Schema.Literals(["si", "no"]),
    otrasCausasObligacion: Schema.Array(Texto),
  }),
})
export const SolicitudCatalunya = Schema.Union([S0, S1, S2, S3, S4, S5, S6])
export type HechosCatalunya = typeof SolicitudCatalunya.Type
export function calcularCatalunya(h: HechosCatalunya): Decimal {
  switch (h.codigo) {
    case "cataluna_rehabilitacion_vivienda_habitual": {
      const f = h.hechos
      exigir(f.vivienda.operacion === "rehabilitacion", "No es rehabilitación")
      return baseVivienda(f.vivienda, h, false).times("0.015")
    }
    case "cataluna_tramo_autonomico_inversion_vivienda_habitual": {
      const f = h.hechos
      transitorio(f.vivienda)
      exigir(f.diasParo <= 365, "Días de paro superiores al año")
      if (f.grado >= 65) ref(f.resolucionDiscapacidad)
      ref(f.referenciaUnidad)
      unicos(f.hijosUnidadFamiliar)
      exigir(
        !f.hijosUnidadFamiliar.includes(h.contribuyente),
        "Contribuyente incluido como hijo de sí mismo"
      )
      const adecuacion = f.vivienda.operacion === "adecuacion-discapacidad"
      const tipo = adecuacion
        ? "0.15"
        : anteriorJulio2011(f.vivienda) &&
            rentaPersonal(h).lte(30000) &&
            (edad(h.nacimiento) <= 32 ||
              f.diasParo >= 183 ||
              f.grado >= 65 ||
              f.hijosUnidadFamiliar.length > 0)
          ? "0.09"
          : "0.075"
      return baseVivienda(f.vivienda, h, false, adecuacion).times(tipo)
    }
    case "cataluna_angel_inversor": {
      const f = h.hechos
      unicos(f.inversiones.map((i) => i.pago.id))
      let total = new D(0)
      for (const i of f.inversiones) {
        sociedad(i, "catalunya")
        exigir(
          i.forma !== "cooperativa" && i.operacion !== "aportacion-social",
          "Sociedad/operación fuera de612-9"
        )
        exigir(
          i.capitalFamiliarMaxPuntosBasicos <= 3500 &&
            i.votosFamiliarMaxPuntosBasicos <= 3500,
          "Participación/voto familiar supera35%"
        )
        exigir(
          i.facturacionAnualCentimos <= 100000000,
          "Facturación anual supera un millón también en constitución"
        )
        exigir(
          i.empleadosJornadaCompleta >= 1,
          "Sociedad sin empleado jornada completa Régimen General"
        )
        ref(i.referenciaContratosAlta)
        ampliacionTresAnios(i)
        if (i.operacion === "ampliacion")
          exigir(
            i.mercado === "sin-cotizacion",
            "Ampliación con cotización nacional oMAB"
          )
        total = total.plus(
          pagado(i.pago, h).times(
            i.universidadCentro.trim().length > 0 ? "0.50" : "0.40"
          )
        )
      }
      return D.min(total, 12000)
    }
    case "cataluna_alquiler_vivienda_habitual": {
      const f = h.hechos
      exigir(
        rentaPersonal(h).lte(30000),
        "Alquiler catalán: BI menos mínimo personal/familiar superior30000"
      )
      ref(f.vivienda)
      ref(f.contrato)
      ref(f.arrendadorFiscal)
      ref(f.habitualidad)
      exigir(f.diasParo <= 365, "Días paro superiores al período")
      if (f.grado >= 65) ref(f.resolucionDiscapacidad)
      if (f.estadoCivil === "viudo") ref(f.tituloViudedad)
      if (f.familia !== "ordinaria") ref(f.tituloFamilia)
      exigir(
        f.familia !== "ordinaria" ||
          edad(h.nacimiento) <= 35 ||
          f.diasParo >= 183 ||
          f.grado >= 65 ||
          (f.estadoCivil === "viudo" && edad(h.nacimiento) >= 65),
        "Sin vía de habilitación612-3; familia numerosa/monoparental constituye vía propia"
      )
      const factor = titulares(f.declarantesConDerecho, h.contribuyente)
      unicos(f.pagosConsolidados.map((p) => p.id))
      let gasto = new D(0)
      for (const p of f.pagosConsolidados) {
        exigir(
          f.declarantesConDerecho.includes(p.pagador),
          "Gasto de declarante fuera del censo con derecho: desglosar gasto total atribuible"
        )
        gasto = gasto.plus(pagado(p, { ...h, contribuyente: p.pagador }))
      }
      return D.min(
        D.min(gasto.times("0.10"), 1000).times(factor),
        f.familia === "ordinaria" ? 500 : 1000
      )
    }
    case "cataluna_alquiler_victimas_violencia_machista": {
      const f = h.hechos
      exigir(
        rentaPersonal(h).lte(30000),
        "Víctimas: BI menos mínimo personal/familiar superior30000"
      )
      ref(f.vivienda)
      ref(f.contratoTitular)
      ref(f.habitualidad)
      ref(f.medioPruebaLey5)
      exigir(
        fecha(f.fechaAcreditacion) <= h.devengo,
        "Acreditación posterior al devengo"
      )
      exigir(
        f.primerEjercicioAplicacion === 2025 &&
          f.ejerciciosAplicados.length === 0,
        "Deducción creada2025: historial anterior de aplicación incompatible; ventana futura de tres ejercicios"
      )
      unicos(f.ejerciciosAplicados.map(String))
      exigir(
        f.ejerciciosAplicados.every(
          (a) => a >= f.primerEjercicioAplicacion && a < 2025
        ),
        "Historial de aplicación contradictorio"
      )
      unicos(f.hijosMenoresACargo.map((p) => p.persona))
      for (const p of f.hijosMenoresACargo) {
        exigir(
          p.persona !== h.contribuyente && edad(p.nacimiento) < 18,
          "Hijo a cargo no menor o coincide con titular"
        )
        ref(p.referenciaCargo)
      }
      if (f.grado >= 65) ref(f.resolucionDiscapacidad)
      const incremento = f.grado >= 65 || f.hijosMenoresACargo.length > 0
      return D.min(
        pagos(f.pagos, h).times(incremento ? "0.25" : "0.20"),
        incremento ? 1200 : 1000
      )
    }
    case "cataluna_inversion_cooperativas_agrarias_vivienda": {
      const f = h.hechos
      unicos(f.aportaciones.map((a) => a.pago.id))
      let total = new D(0)
      for (const a of f.aportaciones) {
        ref(a.cooperativa)
        ref(a.registroGeneralitat)
        ref(a.certificado)
        ref(a.referenciaSeguimiento)
        exigir(
          a.clase === "agraria" || a.clase === "vivienda",
          "Cooperativa fuera de agraria/vivienda ordinaria"
        )
        exigir(
          a.socio !== "temporal" && a.votosPuntosBasicos <= 2500,
          "Socio temporal o voto superior25%"
        )
        exigir(
          a.mantenimiento !== "incumplido",
          "Incumplimiento requiere regularización e intereses"
        )
        if (a.mantenimiento !== "vigente")
          ref(a.referenciaReinversionOEstatutos)
        if (a.mantenimiento === "baja-reinversion") {
          const r = a.reinversion
          exigir(
            r !== null,
            "Reinversión sin datos concretos de cooperativa destino"
          )
          ref(r.cooperativa)
          ref(r.registro)
          ref(r.certificado)
          exigir(
            fecha(r.fecha) >= a.pago.fecha && r.fecha <= h.devengo,
            "Reinversión fuera del período de seguimiento declarado"
          )
          exigir(
            r.votosPuntosBasicos <= 2500 &&
              r.importeRetiradoCentimos === a.pago.importeCentimos &&
              r.importeReinvertidoCentimos >= r.importeRetiradoCentimos,
            "Reinversión parcial o socio destino fuera25%: concretar excepción antes de conservar beneficio"
          )
        }
        total = total.plus(pagado(a.pago, h))
      }
      return D.min(total.times("0.20"), 3000)
    }
    case "cataluna_obligacion_declarar_mas_de_un_pagador": {
      const f = h.hechos
      unicos(f.pagadores.map((p) => p.id))
      exigir(f.pagadores.length >= 2, "No hay pluralidad de pagadores")
      exigir(
        f.pagadores.every((p) => p.clase !== "prestacion-pasiva"),
        "Prestaciones pasivas: falta determinar elegibilidad89.A por sus condiciones específicas, no basta declarar que no se optó"
      )
      exigir(
        f.otrasRentasCentimos === 0 &&
          f.altaAutonomo2025 === "no" &&
          f.otrasCausasObligacion.length === 0,
        "Otras rentas/RETA/causas: falta atribuir obligación exclusivamente a varios pagadores según96"
      )
      const importes = f.pagadores
        .map((p) => {
          ref(p.certificado)
          return eur(p.integroCentimos)
        })
        .sort((a, b) => b.cmp(a))
      const bruto = importes.reduce((a, b) => a.plus(b), new D(0))
      const restantes = bruto.minus(importes[0])
      exigir(
        bruto.gt(15876) && bruto.lte(22000) && restantes.gt(1500),
        "La obligación no deriva exclusivamente de pluralidad: límites15876/22000 y restantes1500"
      )
      return D.max(
        0,
        eur(f.cuotaIntegraAutonomicaCentimos).minus(
          eur(f.cuotaIntegraEstatalCentimos)
        )
      )
    }
  }
}
