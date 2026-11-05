import { Schema } from "effect"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import type { CuotaHogarC } from "./familia-estudios-ampliacion"
import { PagoHechos } from "./anual-esquemas-base"
import { comprobar, ceroC, eurosC } from "./ampliacion-comun"
import { fecha, texto, unico } from "./comun"
import { sujetoC36, censoC36, conciliarPagoC36, necesarioC36 } from "./anual-productores"

const Texto = Schema.String.check(Schema.isMinLength(1))
const Intervalo = Schema.Struct({ desde: Texto, hasta: Texto })
type IntervaloHogar = typeof Intervalo.Type
export const RegistroHogarC36 = Schema.Struct({
  consulta: Texto,
  censo: Schema.Literal("completo_cuotas_pagos_ayudas_altas_2025"),
  civil: Schema.Struct({
    ...Intervalo.fields,
    documento: Texto,
    regimen: Schema.Literals(["sin_matrimonio", "separacion", "gananciales", "extranjero", "herencia", "cambio_intranual"]),
    conyuge: Schema.String,
  }),
  contratos: Schema.Array(Schema.Struct({
    id: Texto,
    empleador: Texto,
    empleado: Texto,
    vivienda: Schema.Struct({ id: Texto, ocupante: Texto, ...Intervalo.fields, documento: Texto }),
    altas: Schema.Array(Schema.Struct({
      ...Intervalo.fields, empleador: Texto, empleado: Texto,
      vivienda: Texto, documento: Texto, sistema: Schema.Literal("especial_empleados_hogar"),
    })),
    cuotas: Schema.Array(Schema.Struct({
      ...Intervalo.fields,
      pago: PagoHechos,
      ayudas: Schema.Array(Schema.Struct({
        id: Texto, resolucion: Texto, concedente: Texto,
        concesion: Texto, importe: Texto, exenta: Schema.Literals(["si", "no"]),
      })),
      censoAyudas: Schema.Literal("completo"),
    })),
  })),
})

/** Produce sólo la parte del contribuyente anual; no crea derechos del cónyuge. */
export function producirCuotasHogarC36(
  registro: typeof RegistroHogarC36.Type | undefined,
  m: MagnitudesTerritorialesAnuales,
): readonly CuotaHogarC[] {
  const r = necesarioC36(registro, "C36 hogar: falta registro primario de régimen matrimonial/empleo/cuotas/ayudas"), id = sujetoC36(m)
  texto(r.consulta)
  comprobar(r.censo === "completo_cuotas_pagos_ayudas_altas_2025", "C36 hogar: censo incompleto")
  const civil = r.civil
  fecha(civil.desde); fecha(civil.hasta); texto(civil.documento)
  comprobar(civil.desde === "2025-01-01" && civil.hasta === "2025-12-31" &&
    ["sin_matrimonio", "separacion", "gananciales"].includes(civil.regimen),
    "C36 hogar: falta productor para cambios intranuales, régimen extranjero o herencia")
  const comun = civil.regimen === "gananciales"
  if (civil.regimen === "sin_matrimonio") comprobar(civil.conyuge === "", "C36 hogar: cónyuge incompatible con ausencia de matrimonio")
  else {
    texto(civil.conyuge)
    comprobar(civil.conyuge !== id && !censoC36(m).some(d => d.sujetoId === civil.conyuge), "C36 hogar: cónyuge incompatible con identidad/censo anual")
  }
  unico(r.contratos.map(c => c.id))
  unico(r.contratos.flatMap(c => c.cuotas.map(q => q.pago.id)))
  unico(r.contratos.flatMap(c => c.cuotas.map(q => q.pago.factura)))
  unico(r.contratos.flatMap(c => c.cuotas.flatMap(q => q.ayudas.map(a => a.id))))
  const periodos: { empleado: string; desde: string; hasta: string }[] = []
  const intervalo = (i: IntervaloHogar) => {
    fecha(i.desde); fecha(i.hasta)
    comprobar(i.desde <= i.hasta, "C36 hogar: intervalo invertido")
  }
  return r.contratos.map((c): CuotaHogarC => {
    texto(c.empleado); texto(c.empleador)
    comprobar(/^(?:[0-9]{8}|[XYZ][0-9]{7})[A-Z]$/.test(c.empleado), "C36 hogar: falta DNI/NIE del empleado; otros NIF sin productor")
    const numero = c.empleado.slice(0, -1).replace("X", "0").replace("Y", "1").replace("Z", "2")
    comprobar("TRWAGMYFPDXBNJZSQVHLCKE"[Number(numero) % 23] === c.empleado.slice(-1), "C36 hogar: control DNI/NIE contradictorio")
    comprobar(c.empleador === id, "C36 hogar: empleador ajeno; falta conciliación anual de pagos de otro empleador, incluido cónyuge")
    comprobar(c.empleado !== id && c.empleado !== civil.conyuge && !censoC36(m).some(d => d.sujetoId === c.empleado), "C36 hogar: empleado incompatible con censo familiar")
    intervalo(c.vivienda); texto(c.vivienda.id); texto(c.vivienda.documento)
    comprobar(c.vivienda.ocupante === c.empleador, "C36 hogar: vivienda no habitual del empleador")
    comprobar(c.altas.length > 0 && c.cuotas.length > 0, "C36 hogar: faltan altas o cuotas")
    unico(c.altas.map(a => a.documento))
    c.altas.forEach(a => {
      intervalo(a); texto(a.documento)
      comprobar(a.empleador === c.empleador && a.empleado === c.empleado && a.vivienda === c.vivienda.id && a.sistema === "especial_empleados_hogar", "C36 hogar: alta SS de otro empleo/sistema")
    })
    return {
      empleador: c.empleador, empleado: c.empleado,
      altaSistema: c.altas.map(a => a.documento).join(";"),
      viviendaHabitual: c.vivienda.id,
      regimen: comun ? "gananciales" : "separacion",
      conyuge: civil.conyuge,
      necesidadAsistencia: [],
      pagos: c.cuotas.map(q => {
        intervalo(q)
        comprobar(q.desde >= "2025-01-01" && q.hasta <= "2025-12-31" && q.hasta <= q.pago.fecha, "C36 hogar: cuota fuera de2025 o pago anterior al devengo de cuota")
        comprobar(c.vivienda.desde <= q.desde && c.vivienda.hasta >= q.hasta && c.altas.some(a => a.desde <= q.desde && a.hasta >= q.hasta), "C36 hogar: cuota sin cobertura de alta SS/vivienda habitual")
        comprobar(!periodos.some(p => p.empleado === c.empleado && p.desde <= q.hasta && p.hasta >= q.desde), "C36 hogar: cuota/periodo de empleado duplicado")
        periodos.push({ empleado: c.empleado, desde: q.desde, hasta: q.hasta })
        comprobar(q.pago.pagador === c.empleador && q.pago.perceptor === "TGSS", "C36 hogar: cuota no pagada por empleador a TGSS")
        comprobar(q.censoAyudas === "completo", "C36 hogar: ayudas incompletas")
        const ayudas = q.ayudas.reduce((s, a) => {
          fecha(a.concesion); texto(a.resolucion); texto(a.concedente)
          comprobar(a.concesion >= "2025-01-01" && a.concesion <= "2025-12-31" && eurosC(a.importe).n >= 0n, "C36 hogar: ayuda fuera de período o negativa")
          return a.exenta === "si" ? s.sumar(eurosC(a.importe)) : s
        }, ceroC())
        comprobar(ayudas.comparar(eurosC(q.pago.ayudasExentas)) === 0n, "C36 hogar: ayudas no conciliadas con pago")
        const pago = { ...q.pago,
          naturaleza: comun ? "comun" as const : "propio" as const,
          distribucion: comun ? [{ persona: id, porcentaje: "50" }, { persona: civil.conyuge, porcentaje: "50" }] : [{ persona: id, porcentaje: "100" }],
        }
        conciliarPagoC36(m, pago)
        return pago
      }),
    }
  })
}
