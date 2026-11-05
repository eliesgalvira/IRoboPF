import Decimal from "decimal.js"
import { integrarTrabajoReducido } from "../../integracion/base-imponible-general"
import { Schema, Result } from "effect"
import { GastosTrabajo } from "../../trabajo-anual/contrato"
import { adaptarTrabajoAnual } from "../../trabajo-anual/adaptador"
import { calcularReduccionTrabajoConOtrasRentas } from "../../reducciones/reduccion-rendimientos-trabajo"
import { exige, fecha, edad, ids, documento, r } from "./comun"
import type { Libros } from "./ayudas-libros"
const D = Decimal.clone({ precision: 80 })
const Texto = Schema.String.check(Schema.isPattern(/\S/))
const Soporte = Schema.Struct({ referencia: Texto, fecha: Texto, emisor: Texto })
/** Censo estable: no confundir esta familia escolar con la unidad del art82. */
export const HistoriaLibros2024 = Schema.Struct({
 ejercicio: Schema.Literal(2024),
 desde: Schema.Literal("2024-01-01"), hasta: Schema.Literal("2025-12-31"),
 composicion: Schema.Literals(["progenitores-convivientes", "progenitor-viudo-sin-pareja"]),
 censo: Schema.Literal("completo-sin-cambios-filiacion-convivencia-estado-civil-discapacidad"),
 soporte: Soporte,
 personas: Schema.Array(Schema.Struct({
  id: Texto, nacimiento: Texto, relacion: Schema.Literals(["progenitor", "hijo-soltero-no-emancipado"]),
  residencia: Schema.Literal("comun-todo-2024"),
  declaracion2024: Schema.Literals(["individual", "no-presentada", "conjunta"]),
  soporte: Soporte,
  economia: Schema.Union([
   Schema.Struct({ perfil: Schema.Literal("sin-ingresos"), certificadoImputaciones: Soporte, censo: Schema.Literal("completo-sin-rentas-ni-exentas") }),
   Schema.Struct({ perfil: Schema.Literal("trabajo"), trabajo: GastosTrabajo, censo: Schema.Literal("completo-sin-otras-rentas-exentas-reducciones-base-ni-saldos"), certificadoImputaciones: Soporte }),
  ]),
 })).check(Schema.isMaxLength(100)),
})
export type HistoriaLibros2024 = typeof HistoriaLibros2024.Type
/** Reutiliza art19/art20 anual2012–2026; jamás genera cuota ni deducciones2024. */
export function producirRentaLibros2024(entrada: HistoriaLibros2024 | undefined, miembros: Omit<Libros["miembros2024"][number], "renta2024">[], titular: string, nacimiento: string): Libros["miembros2024"] {
 exige(entrada !== undefined, "Libros.historia: faltan hechos familiares/económicos2024")
 const dec = Schema.decodeUnknownResult(HistoriaLibros2024)(entrada, { onExcessProperty: "error" })
 exige(Result.isSuccess(dec), "Libros.contrato: historia inválida o magnitudes fiscales externas")
 const h = dec.success
 documento(h.soporte)
 exige(h.soporte.fecha >= h.hasta, "Libros.censo: soporte no cubre composición estable2024–2025")
 exige(ids(h.personas.map(p => p.id)) && h.personas.length > 0 && ids(miembros.map(p => p.persona.id)), "Libros.miembros: vacío o duplicados")
 exige(h.personas.length === miembros.length && h.personas.every(p => miembros.some(m => m.persona.id === p.id)), "Libros.miembros: economía ausente o miembro ajeno")
 const padres = h.personas.filter(p => p.relacion === "progenitor")
 exige(padres.length === (h.composicion === "progenitores-convivientes" ? 2 : 1) && padres.some(p => p.id === titular && p.nacimiento === nacimiento), "Libros.familia: progenitores/identidad propios contradictorios")
 return h.personas.map(p => {
  const m = miembros.find(m => m.persona.id === p.id)
  exige(m !== undefined && m.persona.nacimiento === p.nacimiento && fecha(p.nacimiento) && p.nacimiento <= h.desde, "Libros.identidad: nacimiento imposible/contradictorio")
  documento(p.soporte)
  exige(p.soporte.fecha >= "2025-01-01", "Libros.documento: soporte anterior al cierre2024")
  if (p.relacion === "progenitor") exige(edad(p.nacimiento, "2024-12-31") >= 18, "Libros.edad: progenitor menor fuera del perfil histórico")
  else exige(padres.every(a => a.nacimiento < p.nacimiento) && edad(p.nacimiento, "2025-12-31") < 25, "Libros.filiacion: hijo fuera de composición estable menor25; apoyos judiciales requieren otro perfil")
  exige(p.declaracion2024 !== "conjunta", "Libros.modalidad: conjunta2024 requiere integración histórica conjunta; no exclusión legal")
  const e = p.economia
  if (m.pensionIncapacidad !== "ninguna") {
   exige(e.perfil === "trabajo" && e.trabajo.rendimientos.length > 0 &&
    e.trabajo.rendimientos.every(x => x.clase === "pension") &&
    e.trabajo.rendimientos.some(x => new D(x.integro).gt(0)),
    "Libros.pension: percepción incompatible con el censo económico declarado")
   exige(m.pensionIncapacidad === "total",
    "Libros.pension: pensión exenta requiere productor histórico de rentas exentas")
  }
  documento(e.certificadoImputaciones)
  exige(e.certificadoImputaciones.fecha >= "2025-01-01", "Libros.imputaciones: certificado no cubre2024")
  let renta = new D(0)
  if (e.perfil === "trabajo") {
   exige(p.declaracion2024 !== "no-presentada",
    "Libros.imputaciones: rentas positivas de no declarantes pendientes de criterio bruto/neto acreditado")
   const t = e.trabajo
   exige(t.ejercicio === 2024 && t.territorio === "comun" && t.discapacidadActiva === "ninguna", "Libros.ejercicio: requiere trabajo ordinario2024")
   const empleo = t.rendimientos.every(x => ["empleo-laboral", "empleo-estatutario"].includes(x.clase))
   const pension = t.rendimientos.every(x => x.clase === "pension")
   exige(t.rendimientos.length > 0 && (empleo || pension), "Libros.mixtas: separación empleo/pensión u otras rentas requiere productor histórico")
   exige(t.rendimientos.every(x => x.cotizaciones.clase === "efectivas"), "Libros.cotizaciones: estimadas no acreditan gasto fiscal2024")
   const a = adaptarTrabajoAnual(t)
   exige(a.estado !== "no-soportado", a.estado === "no-soportado" ? "Libros.art19: " + a.motivo : "Libros.art19")
   renta = integrarTrabajoReducido(new D(a.rendimientoAntesArt20), D.min(D.max(0, a.rendimientoAntesArt20), calcularReduccionTrabajoConOtrasRentas({ anio: 2024, rendimientoPrevioNeto: new D(a.argumentoArt20), otrasRentasNoExentas: new D(0) })))
  }
  // Transportar el resultado interno sin cuantizar ni limitarlo a dos decimales.
  const [entera, fraccion = ""] = renta.toFixed().split(".")
  return { ...m, renta2024: r(BigInt(entera + fraccion) * 100n, 10n ** BigInt(fraccion.length)) }
 })
}
