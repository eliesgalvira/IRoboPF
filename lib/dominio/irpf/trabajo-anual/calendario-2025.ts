import Decimal from "decimal.js"
import { DateTime, Option, Result, Schema } from "effect"
import { Euros, type GastosTrabajo } from "./contrato"
import { calcularGastosTrabajo, importeDiscapacidadActiva } from "./calcular"

const D = Decimal.clone({ precision: 80 })
const Texto = Schema.String.check(Schema.isPattern(/\S/))
const Fecha = Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/))
/** Hechos, no netos ni gastos fiscales. Un empleador; sin pagos fuera del servicio.
 * Los tramos particionan 2025 y se cortan en cada cambio de efectos certificados.
 * Las cotizaciones son exclusivas del tramo, no repartos introducidos por el cliente.
 */
export const CalendarioTrabajo2025 = Schema.Struct({
  sujetoId: Schema.String.check(Schema.isPattern(/^s-[0-9]{1,6}$/)),
  rendimientoId: Texto,
  empleador: Texto,
  soporteRelacionLaboral: Texto,
  fechaCorteDocumental: Fecha,
  censoCompleto: Schema.Literal(true),
  imputacion: Schema.Literal("servicios-ordinarios-2025-sin-atrasos"),
  certificados: Schema.Array(Schema.Struct({
    id: Texto, sujetoId: Texto,
    organismo: Schema.Literals(["imserso", "organo-competente-ccaa"]),
    emision: Fecha, efectosDesde: Fecha, efectosHasta: Fecha,
    grado: Schema.Number.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 100 })),
    ayudaOMovilidadReducida: Schema.Boolean,
    soporte: Texto,
  })).check(Schema.isMaxLength(100)),
  tramos: Schema.Array(Schema.Struct({
    id: Texto, desde: Fecha, hasta: Fecha, soporte: Texto,
    actividad: Schema.Literals(["servicios-efectivos", "sin-empleo"]),
    integro: Euros,
    seguridadSocial: Euros, derechosPasivos: Euros, colegiosHuerfanos: Euros,
  })).check(Schema.isMinLength(1), Schema.isMaxLength(366)),
})
export type CalendarioTrabajo2025 = typeof CalendarioTrabajo2025.Type
function exigir(ok: boolean, motivo: string): asserts ok {
  if (!ok) throw new RangeError("Calendario trabajo2025: " + motivo)
}
function dia(fecha: string): number {
  const d = DateTime.make(fecha + "T00:00:00Z")
  exigir(Option.isSome(d) && DateTime.formatIsoDateUtc(d.value) === fecha, "fecha civil inválida")
  return DateTime.toEpochMillis(d.value) / 86400000
}
export function discapacidadDevengoCalendario(c: CalendarioTrabajo2025) {
  const cert = c.certificados.find(s => s.efectosDesde <= "2025-12-31" && s.efectosHasta >= "2025-12-31")
  return cert === undefined || cert.grado < 33
    ? { _tag: "SinDiscapacidad" as const }
    : cert.grado >= 65
      ? { _tag: "Discapacidad65OMas" as const }
      : { _tag: "Discapacidad33a64" as const, necesitaAyudaOMovilidadReducida: cert.ayudaOMovilidadReducida }
}
/** Extensión común art19: cuantía anual íntegra, límite exclusivo de rentas asociadas.
 * Art20 sigue usando el previo anterior a TODOS los gastos de la letra f).
 */
export function calcularGastosTrabajoCalendario2025(trabajo: GastosTrabajo, entrada: CalendarioTrabajo2025) {
  return calcularCalendario(trabajo, entrada, false)
}
/** Entrada explícita familiar B03; la API anterior conserva su alcance. */
export function calcularGastosTrabajoMixtoCalendario2025(trabajo: GastosTrabajo, entrada: CalendarioTrabajo2025) {
  return calcularCalendario(trabajo, entrada, true)
}
function calcularCalendario(trabajo: GastosTrabajo, entrada: CalendarioTrabajo2025, mezcla: boolean) {
  const decoded = Schema.decodeUnknownResult(CalendarioTrabajo2025)(entrada, { onExcessProperty: "error" })
  exigir(Result.isSuccess(decoded), "hechos incompletos o magnitudes externas")
  const c = decoded.success
  const base = calcularGastosTrabajo({ ...trabajo, discapacidadActiva: "ninguna" })
  exigir(base.estado === "calculado", base.estado === "no-soportado" ? base.motivo : "art19 no disponible")
  const empleos = trabajo.rendimientos.filter(r => ["empleo-laboral", "empleo-estatutario"].includes(r.clase))
  const pensiones = trabajo.rendimientos.filter(r => r.clase === "pension")
  const r = mezcla ? empleos[0] : trabajo.rendimientos[0]
  if (mezcla) {
    exigir(trabajo.rendimientos.length === 2 && empleos.length === 1 && pensiones.length === 1, "mezcla: un empleo y una pensión ordinarios")
    const p = pensiones[0]!
    exigir([p.cotizaciones.seguridadSocial, p.cotizaciones.derechosPasivos, p.cotizaciones.colegiosHuerfanos, p.sindicato.importe, p.colegio.importe, p.defensa.importe].every(x => new D(x).eq(0)), "pensión: gastos asociados fuera del primer perfil")
  }
  exigir(trabajo.ejercicio === 2025 && trabajo.territorio === "comun" && (mezcla || trabajo.rendimientos.length === 1) && r !== undefined && ["empleo-laboral", "empleo-estatutario"].includes(r.clase), "solo empleo ordinario único; excluye empleo+pensión")
  exigir(c.rendimientoId === r.id, "rendimiento/empleador sin correspondencia anual")
  // Estos gastos necesitan atribución exclusiva/proporcional documental propia.
  exigir([r.sindicato.importe, r.colegio.importe, r.defensa.importe].every(x => new D(x).eq(0)), "sindicato/colegio/defensa: atribución temporal fuera de perfil")
  exigir(dia(c.fechaCorteDocumental) >= dia("2025-12-31"), "corte documental anterior al devengo")
  exigir(new Set(c.certificados.map(s => s.id)).size === c.certificados.length, "certificado duplicado")
  const certificados = [...c.certificados].sort((a,b) => a.efectosDesde.localeCompare(b.efectosDesde))
  let anterior = -Infinity
  for (const s of certificados) {
    const desde = dia(s.efectosDesde), hasta = dia(s.efectosHasta)
    exigir(s.sujetoId === c.sujetoId && dia(s.emision) <= dia(c.fechaCorteDocumental), "identidad/emisión/corte contradictorios")
    exigir(desde <= hasta && desde > anterior, "efectos certificados solapados/contradictorios")
    exigir(s.grado >= 33 || !s.ayudaOMovilidadReducida, "ayuda sin grado mínimo representado")
    anterior = hasta
  }
  exigir(new Set(c.tramos.map(t => t.id)).size === c.tramos.length, "ingreso/tramo duplicado")
  let cursor = dia("2025-01-01"), diasActivos = 0, diasDiscapacidad = 0
  let bruto = new D(0), ss = new D(0), dp = new D(0), ch = new D(0), asociado = new D(0)
  const categorias = new Set<number>()
  let gradoAlTrabajo: "33-a-64" | "65-o-mas" = "33-a-64", ayuda = false
  for (const t of [...c.tramos].sort((a,b) => a.desde.localeCompare(b.desde))) {
    const desde = dia(t.desde), hasta = dia(t.hasta), dias = hasta - desde + 1
    exigir(desde === cursor && hasta >= desde && hasta <= dia("2025-12-31"), "laguna/solape/período ajeno2025")
    cursor = hasta + 1
    exigir(!certificados.some(s => (s.efectosDesde > t.desde && s.efectosDesde <= t.hasta) || (s.efectosHasta >= t.desde && s.efectosHasta < t.hasta)), "tramo cruza cambio certificado; separar ingresos reales")
    const cot = new D(t.seguridadSocial).plus(t.derechosPasivos).plus(t.colegiosHuerfanos)
    bruto = bruto.plus(t.integro); ss = ss.plus(t.seguridadSocial); dp = dp.plus(t.derechosPasivos); ch = ch.plus(t.colegiosHuerfanos)
    if (t.actividad === "sin-empleo") {
      exigir(new D(t.integro).eq(0) && cot.eq(0), "renta/cotización sin servicios; otro período o economía")
      continue
    }
    diasActivos += dias
    const s = certificados.find(s => s.efectosDesde <= t.desde && s.efectosHasta >= t.hasta)
    if (s !== undefined && s.grado >= 33) {
      diasDiscapacidad += dias
      gradoAlTrabajo = s.grado >= 65 ? "65-o-mas" : "33-a-64"
      ayuda = s.ayudaOMovilidadReducida
      categorias.add(importeDiscapacidadActiva(gradoAlTrabajo, ayuda))
      asociado = asociado.plus(new D(t.integro).minus(cot))
    }
  }
  exigir(cursor === dia("2026-01-01"), "censo temporal no cubre cierre2025")
  exigir(bruto.eq(r.integro) && ss.eq(r.cotizaciones.seguridadSocial) && dp.eq(r.cotizaciones.derechosPasivos) && ch.eq(r.cotizaciones.colegiosHuerfanos), "ingresos/cotizaciones no concilian con anual; doble consumo o período ajeno")
  exigir(categorias.size <= 1, "cambio de categoría activa3500/7750: atribución por categorías fuera de perfil")
  const resumen = trabajo.discapacidadActiva
  exigir(diasDiscapacidad === 0 ? resumen === "ninguna" : resumen !== "ninguna" && resumen !== "pendiente" && resumen.grado === gradoAlTrabajo && resumen.ayudaOMovilidadReducida === (ayuda ? "si" : "no") && resumen.acreditadaDuranteTodoElTrabajo === (diasActivos === diasDiscapacidad ? "si" : "no"), "resumen laboral contradice efectos/actividad certificados")
  // 2000 no se multiplica para obtener una cuantía anual menor: sólo se atribuye
  // su parte al límite del incremento. Nunca se prorratean3500/7750.
  const limite = D.max(0, asociado.minus(new D(base.generalesAplicados).times(diasDiscapacidad).div(365)))
  const incremento = D.min([...categorias][0] ?? 0, limite, D.max(0, new D(base.netoArt19)))
  return { ...base, discapacidadAplicada: incremento.toString(), netoArt19: new D(base.netoArt19).minus(incremento).toString(), fuente: "LIRPF19.2.f; RIRPF11.2,72; TEAC22-04-2025 00/01351/2024; AEAT2025 c,d", aceptacionFiscal: "pendiente" as const }
}
