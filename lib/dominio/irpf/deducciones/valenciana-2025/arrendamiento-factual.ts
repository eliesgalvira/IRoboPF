import { DateTime, Option, Schema } from "effect"
import Decimal from "decimal.js"
import type { UnidadValenciana } from "./comun"
const T = Schema.String.check(Schema.isPattern(/\S/))
const N = Schema.Number.check(Schema.isFinite(), Schema.isGreaterThanOrEqualTo(0))
/** Perfil general de alquiler, único titular; especialidades requieren otro productor. */
export const ArrendamientoFactual2025 = Schema.Struct({
  contratoId: T, viviendaId: T, arrendadorId: T, titularId: T,
  firma: T, desde: T, hasta: T, ocupacionDesde: T, ocupacionHasta: T,
  nacimiento: T, discapacidadPorcentaje: N,
  derechosOtrasViviendas: Schema.Array(Schema.Struct({ porcentaje: N, distanciaKm: N })),
  derechoInversionVivienda: Schema.Boolean,
  pagos: Schema.Array(Schema.Struct({
    id: T, contratoId: T, viviendaId: T, pagadorId: T, fecha: T,
    euros: N, servicios: N, ayudas: N, reembolsos: N,
    medio: Schema.Literals(["efectivo", "transferencia", "tarjeta", "cheque_nominativo", "ingreso_cuenta"]), soporte: T,
  })),
})
function exigir(v: boolean, mensaje: string): asserts v {
  if (!v) throw new RangeError(mensaje)
}
function dia(s: string) {
  exigir(/^\d{4}-\d{2}-\d{2}$/.test(s), "Falta fecha contractual")
  const fecha = DateTime.make(s + "T00:00:00Z")
  exigir(Option.isSome(fecha) && DateTime.formatIsoDateUtc(fecha.value) === s, "Fecha inválida")
  return DateTime.toEpochMillis(fecha.value) / 86400000
}
export function derivarArrendamientoValenciano(u: UnidadValenciana): UnidadValenciana {
  const h = u.arrendamientoFactual2025
  exigir(h !== undefined && Schema.is(ArrendamientoFactual2025)(h), "Pendiente: expediente factual de alquiler")
  exigir(u.titulares.length === 1 && u.titulares[0] === h.titularId && h.arrendadorId !== h.titularId, "Titular contractual incoherente")
  const inicio = dia(h.desde), fin = dia(h.hasta), firma = dia(h.firma)
  const ocupa = dia(h.ocupacionDesde), deja = dia(h.ocupacionHasta)
  const nacimiento = dia(h.nacimiento)
  exigir(nacimiento <= dia("2025-12-31") && h.nacimiento < "1990-01-01" && h.discapacidadPorcentaje < 33, "Perfil reforzado pendiente de productor")
  exigir(h.discapacidadPorcentaje <= 100 && fin >= inicio && firma <= inicio && ocupa >= inicio && deja >= ocupa && deja <= fin, "Cronología incoherente")
  const aniversario = h.desde.slice(0,4)
  const siguiente = String(Number(aniversario) + 1) + h.desde.slice(4)
  // Para 29/2, el aniversario civil se limita al último día de febrero.
  const aniversarioAnual = siguiente.endsWith("02-29") ? siguiente.slice(0,8) + "28" : siguiente
  // Un porcentaje y una distancia no acreditan titulares familiares, duración
  // del derecho ni resoluciones impeditivas. Esa rama necesita otro productor.
  exigir(h.derechosOtrasViviendas.length === 0, "Pendiente: censo e historia de derechos sobre otras viviendas de la unidad familiar")
  // 'hasta' es el último día incluido, igual que al calcular días de ocupación.
  const derecho = firma > dia("1998-04-23") && fin + 1 >= dia(aniversarioAnual) &&
    !h.derechoInversionVivienda
  const dias = Math.max(0, Math.min(fin, deja, dia("2025-12-31")) - Math.max(inicio, ocupa, dia("2025-01-01")) + 1)
  const ids = new Set<string>()
  let neto = new Decimal(0)
  for (const p of h.pagos) {
    exigir(!ids.has(p.id), "Pago duplicado")
    ids.add(p.id)
    exigir(p.contratoId === h.contratoId && p.viviendaId === h.viviendaId && p.pagadorId === h.titularId, "Pago ajeno al contrato")
    const fecha = dia(p.fecha)
    exigir(fecha >= inicio && fecha <= fin && fecha >= ocupa && fecha <= deja && p.fecha.startsWith("2025-"), "Pago fuera del ejercicio u ocupación")
    const valores = [p.euros, p.servicios, p.ayudas, p.reembolsos].map(x => new Decimal(x))
    exigir(valores.every(x => x.decimalPlaces() <= 2), "Pagos exigen céntimos")
    const importe = valores[0].minus(valores[1]).minus(valores[2]).minus(valores[3])
    exigir(importe.gte(0), "Desglose de pago incoherente")
    if (p.medio !== "efectivo") neto = neto.plus(importe)
  }
  exigir(h.pagos.length > 0, "Pendiente: libro de pagos")
  const numeros = { condicionesReforzadas: 0, diasContrato: dias, alquilerSinServicios: neto.toNumber() }
  // Los escalares heredados son precondiciones, nunca autoridad jurídica.
  for (const k of ["condicionesReforzadas", "diasContrato", "alquilerSinServicios"] as const)
    exigir(u.numeros[k] === undefined || u.numeros[k] === numeros[k], "Escalar contradice expediente: " + k)
  exigir(u.textos.contrato === undefined || u.textos.contrato === "alquiler", "Tipo de contrato incoherente")
  return { ...u, numeros: { ...u.numeros, ...numeros }, textos: { ...u.textos, contrato: "alquiler", derechoArrendamientoFactual: derecho ? "si" : "no" } }
}
