import Decimal from "decimal.js"
import { DateTime, Option, Schema } from "effect"
import type { ResultadoDeduccion } from "../contratos-2025"

const Numero = Schema.Number.check(
  Schema.isFinite(),
  Schema.isGreaterThanOrEqualTo(0)
)
const Texto = Schema.String.check(Schema.isMinLength(1))
/** Datos escalares con nombres propios de cada fórmula; nunca un importe de deducción. */
export const Unidad = Schema.Struct({
  id: Texto,
  titulares: Schema.Array(Texto),
  fecha: Texto,
  numeros: Schema.Record(Schema.String, Numero),
  textos: Schema.Record(Schema.String, Texto),
})
export const Solicitud = Schema.Struct({
  codigo: Texto,
  ejercicio: Schema.Literal(2025),
  territorio: Schema.Literal("comunitat-valenciana"),
  contribuyente: Texto,
  declarantes: Schema.Array(Texto),
  modalidad: Schema.Literals(["individual", "conjunta"]),
  devengo: Texto,
  liquidableGeneral: Numero,
  liquidableAhorro: Numero,
  imponibleGeneral: Numero,
  imponibleAhorro: Numero,
  unidades: Schema.Array(Unidad),
})
export type HechosValencianos2025 = typeof Solicitud.Type
export type UnidadValenciana = typeof Unidad.Type

export function rechazar(motivo: string): never {
  throw new RangeError(motivo)
}
export function n(u: UnidadValenciana, clave: string): Decimal {
  const valor = u.numeros[clave]
  if (valor === undefined) return rechazar("Falta dato numérico: " + clave)
  return new Decimal(valor)
}
export function entero(
  u: UnidadValenciana,
  clave: string,
  max: number
): number {
  const v = n(u, clave)
  if (!v.isInteger() || v.gt(max))
    return rechazar("Entero fuera de rango: " + clave)
  return v.toNumber()
}
export function t(
  u: UnidadValenciana,
  clave: string,
  opciones: readonly string[]
): string {
  const valor = u.textos[clave]
  if (!opciones.includes(valor))
    return rechazar("Falta dato o rama no soportada: " + clave)
  return valor
}
export function evidencia(u: UnidadValenciana, clave: string): void {
  if (u.textos[clave] === undefined || u.textos[clave].trim() === "")
    rechazar("Falta evidencia externa específica: " + clave)
}
export function fechaValida(fecha: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false
  const d = DateTime.make(fecha + "T00:00:00Z")
  return Option.isSome(d) && DateTime.formatIsoDateUtc(d.value) === fecha
}
export function idsValidos(ids: readonly string[]): boolean {
  return (
    ids.length > 0 &&
    ids.every((id) => id.trim() !== "") &&
    new Set(ids).size === ids.length
  )
}
export function renta(h: HechosValencianos2025): Decimal {
  return new Decimal(h.liquidableGeneral).plus(h.liquidableAhorro)
}
export function factor(
  h: HechosValencianos2025,
  individual = 30000,
  conjunta = 47000,
  amplitud = 3000
): Decimal {
  return Decimal.max(
    0,
    Decimal.min(
      1,
      new Decimal(h.modalidad === "individual" ? individual : conjunta)
        .minus(renta(h))
        .div(amplitud)
    )
  )
}
export function acceso(h: HechosValencianos2025): void {
  if (renta(h).gt(h.modalidad === "individual" ? 30000 : 47000))
    rechazar("Base liquidable supera límite 30.000/47.000")
}
export function neto(u: UnidadValenciana): Decimal {
  return Decimal.max(
    0,
    n(u, "gasto").minus(n(u, "ayudas")).minus(n(u, "reembolsos"))
  )
}
export function proporcion(
  h: HechosValencianos2025,
  u: UnidadValenciana
): Decimal {
  // La conjunta solo reúne cuotas de los titulares que efectivamente la integran.
  return new Decimal(
    u.titulares.filter((id) => h.declarantes.includes(id)).length
  ).div(u.titulares.length)
}
export function parcial(importe: Decimal, motivo: string): ResultadoDeduccion {
  return {
    estado: "calculo_parcial",
    importe: importe.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
    motivo,
    aceptacionFiscal: "pendiente",
  }
}
export type Formula = (h: HechosValencianos2025, u: UnidadValenciana) => Decimal
