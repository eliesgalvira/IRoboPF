import Decimal from "decimal.js"
import { DateTime, Option, Result, Schema } from "effect"
import { GastosTrabajo } from "../trabajo-anual/contrato"
import { adaptarTrabajoAnual } from "../trabajo-anual/adaptador"
import { calcularReduccionTrabajoConOtrasRentas } from "../reducciones/reduccion-rendimientos-trabajo"

const D = Decimal.clone({ precision: 80 })
const Id = Schema.String.check(Schema.isPattern(/^s-[0-9]{1,6}$/))
const Texto = Schema.String.check(Schema.isPattern(/\S/))
const Fecha = Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/))
const Periodo = Schema.Struct({ desde: Fecha, hasta: Fecha })
/** Sólo hechos económicos ordinarios exhaustivos. No acepta renta fiscal, base o derecho. */
const Economia = Schema.Union([
  Schema.Struct({ perfil: Schema.Literal("sin-rentas"), exhaustividad: Schema.Literal("completa"), soporte: Texto }),
  Schema.Struct({ perfil: Schema.Literal("solo-trabajo"), exhaustividad: Schema.Literal("completa"), soporte: Texto,
    otrasRentas: Schema.Literal("ninguna"), trabajo: GastosTrabajo }),
])
export const AscendienteAnual2025 = Schema.Struct({
  sujetoId: Id, fechaNacimiento: Fecha,
  situacionDevengo: Schema.Literals(["vivo", "fallecido"]),
  fechaFallecimiento: Schema.optional(Fecha),
  gradoDiscapacidad: Schema.Number.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 100 })),
  ayudaOMovilidadReducida: Schema.Boolean,
  claseDiscapacidad: Schema.Literals(["fisica", "intelectual_mental"]),
  permanente: Schema.Boolean, soporteDiscapacidad: Texto,
  declaracion: Schema.Literals(["no-presenta", "individual", "conjunta"]),
  economia: Economia,
  titularesCompletos: Schema.Literal(true),
  titulares: Schema.Array(Schema.Struct({
    titularId: Id,
    grado: Schema.Number.check(Schema.isInt(), Schema.isBetween({ minimum: 1, maximum: 10 })),
    vinculo: Schema.Literals(["consanguinidad", "adopcion"]),
    residenteIrpf: Schema.Boolean, declaracion: Schema.Literals(["individual", "no-presenta"]), economia: Economia,
    convivencia: Schema.Array(Periodo).check(Schema.isMaxLength(100)),
    internamientoEspecializado: Schema.Array(Periodo).check(Schema.isMaxLength(100)),
    dependenciaEconomica: Schema.Boolean, soporte: Texto,
  })).check(Schema.isMinLength(1), Schema.isMaxLength(100)),
})
export type AscendienteAnual2025 = typeof AscendienteAnual2025.Type
function exigir(ok: boolean, motivo: string): asserts ok {
  if (!ok) throw new RangeError("Ascendientes2025: " + motivo)
}
function instante(fecha: string): number {
  const d = DateTime.make(fecha + "T00:00:00Z")
  exigir(Option.isSome(d) && DateTime.formatIsoDateUtc(d.value) === fecha, "fecha civil inexistente")
  return DateTime.toEpochMillis(d.value)
}
export function diasAscendiente2025(periodos: readonly { readonly desde: string; readonly hasta: string }[]): number {
  let fin = "", total = 0
  for (const p of [...periodos].sort((a,b) => a.desde.localeCompare(b.desde))) {
    const a = instante(p.desde), b = instante(p.hasta)
    exigir(p.desde >= "2025-01-01" && p.hasta <= "2025-12-31" && a <= b && p.desde > fin, "intervalos inversos, solapados o fuera de2025")
    total += (b-a)/86400000 + 1
    fin = p.hasta
  }
  return total
}
/** Art19 antes de art20 para8000/1800; la base regional sí resta art20. */
export function economiaAscendiente2025(e: typeof Economia.Type, madrid: boolean) {
  if (e.perfil === "sin-rentas") return { renta: new D(0), base: new D(0) }
  const t = e.trabajo
  exigir(t.ejercicio === 2025 && t.territorio === "comun" && t.discapacidadActiva === "ninguna", "economía ordinaria2025 sin discapacidad activa requerida")
  const empleo = t.rendimientos.length > 0 && t.rendimientos.every(r => r.clase === "empleo-laboral" || r.clase === "empleo-estatutario")
  const pension = t.rendimientos.length > 0 && t.rendimientos.every(r => r.clase === "pension")
  exigir(empleo || pension, "mezcla empleo/pensión u otra clase pendiente de productor")
  const a = adaptarTrabajoAnual(t)
  exigir(a.estado !== "no-soportado", a.estado === "no-soportado" ? a.motivo : "economía no disponible")
  const renta = new D(a.rendimientoAntesArt20)
  let reduccion = D.min(D.max(0, renta), calcularReduccionTrabajoConOtrasRentas({
    anio: 2025, rendimientoPrevioNeto: new D(a.argumentoArt20), otrasRentasNoExentas: new D(0),
    compatibilidadOpen2025: madrid && empleo ? { integro: new D(a.gastos.integro), gastosAE: new D(a.gastos.gastosAE) } : undefined,
  }))
  if (madrid && empleo) reduccion = reduccion.toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
  return { renta, base: renta.minus(reduccion) }
}
export function discapacidadAscendiente2025(a: AscendienteAnual2025) {
  return a.gradoDiscapacidad >= 65 ? { _tag: "Discapacidad65OMas" as const }
    : a.gradoDiscapacidad >= 33 ? { _tag: "Discapacidad33a64" as const, necesitaAyudaOMovilidadReducida: a.ayudaOMovilidadReducida }
    : { _tag: "SinDiscapacidad" as const }
}
export function producirAscendientes2025(entrada: readonly AscendienteAnual2025[], propio: string, territorio: string) {
  const r = Schema.decodeUnknownResult(Schema.Array(AscendienteAnual2025))(entrada, { onExcessProperty: "error" })
  exigir(Result.isSuccess(r), "censo incompleto o contiene magnitudes fiscales externas")
  const sujetos = new Set(r.success.map(a => a.sujetoId))
  exigir(sujetos.size === entrada.length && !sujetos.has(propio), "identidad propia o ascendiente duplicado")
  const titularesCensados = new Map<string, AscendienteAnual2025["titulares"][number]>()
  return r.success.map(a => {
    exigir(a.situacionDevengo === "vivo" && a.fechaFallecimiento === undefined, "fallecimiento: regla legal61.3/61.4 requiere economía hasta defunción y mitad del período hasta fallecimiento; productor ordinario no lo soporta")
    exigir(a.declaracion !== "conjunta", "declaración conjunta del ascendiente requiere atribuir rentas de sus integrantes")
    instante(a.fechaNacimiento)
    exigir(a.fechaNacimiento < "2025-01-01" && a.fechaNacimiento >= "1875-01-01", "nacimiento fuera del perfil ordinario")
    const edadDevengo = 2025 - Number(a.fechaNacimiento.slice(0,4))
    const economia = economiaAscendiente2025(a.economia, territorio === "madrid")
    const ids = new Set(a.titulares.map(t => t.titularId))
    exigir(ids.size === a.titulares.length && ids.has(propio), "titulares duplicados o propio ausente")
    const titulares = a.titulares.map(t => {
      exigir(!sujetos.has(t.titularId), "ascendiente también titular: grafo no soportado")
      const previo = titularesCensados.get(t.titularId)
      exigir(previo === undefined || JSON.stringify(previo.economia) === JSON.stringify(t.economia), "economía contradictoria entre relaciones del mismo titular")
      exigir(previo === undefined || previo.residenteIrpf === t.residenteIrpf, "residencia contradictoria entre relaciones del mismo titular")
      exigir(previo === undefined || previo.declaracion === t.declaracion, "declaración contradictoria entre relaciones del mismo titular")
      titularesCensados.set(t.titularId, t)
      exigir(t.titularId !== propio || (t.residenteIrpf && t.declaracion === "individual"), "declarante anual individual no conciliado")
      const dias = diasAscendiente2025([...t.convivencia, ...t.internamientoEspecializado])
      exigir(t.internamientoEspecializado.length === 0 || (a.gradoDiscapacidad >= 33 && t.dependenciaEconomica), "internamiento asimilado requiere discapacidad y dependencia económica")
      return { ...t, dias, ...economiaAscendiente2025(t.economia, territorio === "madrid") }
    })
    const posibles = titulares.filter(t => t.residenteIrpf && t.dias >= 183)
    const grado = Math.min(...posibles.map(t => t.grado))
    const cercanos = posibles.filter(t => t.grado === grado)
    const siguientes = posibles.filter(t => t.grado > grado)
    const grados = new Set(posibles.map(t => t.grado))
    exigir(grados.size <= 2 && !(siguientes.length > 0 && cercanos.some(t => t.renta.lte(8000)) && cercanos.some(t => t.renta.gt(8000))), "concurrencia de más de dos grados o rentas mixtas del grado próximo pendiente de criterio")
    const seleccion = siguientes.length > 0 && cercanos.every(t => t.renta.lte(8000)) ? siguientes : cercanos
    const cumple = (edadDevengo > 65 || a.gradoDiscapacidad >= 33) && economia.renta.lte(8000) && (a.declaracion === "no-presenta" || economia.renta.lte(1800))
    return { ...a, edadDevengo, discapacidad: discapacidadAscendiente2025(a), renta: economia.renta, titularesCalculados: titulares, titularesMinimo: cumple ? seleccion.map(t => t.titularId) : [] }
  })
}
export type LibroAscendientes2025 = ReturnType<typeof producirAscendientes2025>
