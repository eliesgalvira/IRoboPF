import Decimal from "decimal.js"
import { DateTime, Effect, Option, Result, Schema } from "effect"
import { InmuebleP4a } from "../inmobiliario-2025/hechos"
import { producirCensoInmuebles2025, type ExactoP4a } from "../inmobiliario-2025/censo"

const D = Decimal.clone({ precision: 80 })
const Texto = Schema.String.check(Schema.isPattern(/\S/))
const Fecha = Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/))
/** Hechos completos de un arrendador adulto; no recibe base ni rendimiento externo. */
export const AlquilerViviendaFamilia2025 = Schema.Struct({
  referencia: Texto,
  ejercicio: Schema.Literal(2025),
  tituloAdquisicion: Schema.Literal("compraventa-onerosa"),
  sujetoId: Schema.String.check(Schema.isPattern(/^s-[0-9]{1,6}$/)),
  nacimiento: Fecha,
  inmueble: InmuebleP4a,
  censoDerechos: Schema.Struct({
    documento: Texto,
    cobertura: Schema.Literal("mundial-propiedad-usufructo-cualquier-porcentaje-todo-2025"),
    inmuebles: Schema.Array(Texto).check(Schema.isLengthBetween(1, 1)),
  }),
  contextoRendimientos: Schema.Literal("calculo-ordinario-sin-procedimiento-ni-rectificacion"),
  retenciones: Schema.Literal("ninguna"),
})
export type AlquilerViviendaFamilia2025 = typeof AlquilerViviendaFamilia2025.Type
function exigir(ok: boolean, motivo: string): asserts ok {
  if (!ok) throw new RangeError("Alquiler familiar: " + motivo)
}
const decimal = (x: ExactoP4a): Decimal => new D(x.n.toString()).div(x.d.toString())

/** Usa el núcleo inmobiliario común, sin liquidar al familiar ni consumir cuota. */
export function producirAlquilerFamiliar2025(entrada: AlquilerViviendaFamilia2025) {
  const parsed = Schema.decodeUnknownResult(AlquilerViviendaFamilia2025)(entrada, { onExcessProperty: "error" })
  exigir(Result.isSuccess(parsed), "hechos incompletos o magnitudes externas")
  const h = parsed.success, v = h.inmueble
  const nacimiento = DateTime.make(h.nacimiento + "T00:00:00Z")
  exigir(Option.isSome(nacimiento) && DateTime.formatIsoDateUtc(nacimiento.value) === h.nacimiento &&
    h.nacimiento >= "1905-01-01" && h.nacimiento <= "2007-12-31", "perfil adulto de 18 a 120 años al devengo")
  exigir(h.censoDerechos.inmuebles[0] === v.id, "censo mundial no concilia con inmueble único")
  exigir(v.titular === h.sujetoId && v.titulares.length === 1 && v.titulares[0] === h.sujetoId &&
    v.contrato.arrendador === h.sujetoId, "titularidad exclusiva contradictoria")
  exigir(v.adquisicion.fecha >= h.nacimiento, "adquisición anterior al nacimiento del titular")
  exigir(v.primerAlquiler2025 === undefined && v.cambioHabitual2025 === undefined &&
    v.cambioHabitualBalears2025 === undefined && v.vaciaExt2025 === undefined,
  "historia parcial o incentivo específico fuera de este perfil")
  exigir(v.contrato.firma >= "2023-05-26", "contrato anterior requiere conexión DT38 separada")
  exigir(v.gastos.every(g => g.clase !== "mejora"), "mejoras requieren calendario patrimonial separado")
  const r = Effect.runSync(Effect.result(producirCensoInmuebles2025({
    contribuyenteId: h.sujetoId, edad: 2025 - Number(h.nacimiento.slice(0, 4)), inmuebles: [v], retenciones: [],
  })))
  exigir(Result.isSuccess(r), Result.isFailure(r) ? r.failure.motivo : "censo inmobiliario no disponible")
  const resultado = r.success.inmuebles[0]
  exigir(resultado !== undefined && resultado.diasAlquilados === 365 && resultado.diasImputados === 0 &&
    resultado.imputacion.n === 0n && resultado.regimen === "art23-50" && resultado.neto.n >= 0n &&
    resultado.excesoNoAplicado.n === 0n, "pérdidas, arrastre, imputación o alquiler parcial fuera del perfil")
  return { neto: decimal(resultado.neto), reducido: decimal(resultado.netoReducido) }
}
