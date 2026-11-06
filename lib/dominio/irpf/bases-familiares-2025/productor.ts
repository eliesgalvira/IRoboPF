import Decimal from "decimal.js"
import { Schema, Result, DateTime, Option } from "effect"
import { GastosTrabajo } from "../trabajo-anual/contrato"
import { adaptarTrabajoAnual } from "../trabajo-anual/adaptador"
import { calcularReduccionTrabajoConOtrasRentas } from "../reducciones/reduccion-rendimientos-trabajo"
import type { CasoFiscalAnual } from "../caso-fiscal-anual"
const D = Decimal.clone({ precision: 80 })
const Id = Schema.String.check(Schema.isPattern(/^s-[0-9]{1,6}$/))
const Texto = Schema.String.check(Schema.isPattern(/\S/))
/** Contrato económico compartido; la declaración no determina la renta. */
export const EconomiaPersonaFamiliar2025 = Schema.Union([
      Schema.Struct({ perfil: Schema.Literal("declarante-en-composicion") }),
      Schema.Struct({ perfil: Schema.Literal("sin-rentas"), censoRentasCompleto: Schema.Literal(true) }),
      Schema.Struct({ perfil: Schema.Literal("solo-trabajo"), censoRentasCompleto: Schema.Literal(true),
        otrasRentas: Schema.Literal("ninguna"), reduccionesBase: Schema.Literal("ninguna"),
        saldosAnteriores: Schema.Literal("ninguno"), trabajo: GastosTrabajo }),
    ])
/** Hechos económicos completos; no admite base, saldo, cuota ni declaración anidada. */
export const CensoBasesFamiliares2025 = Schema.Struct({
  referencia: Texto,
  ejercicio: Schema.Literal(2025),
  devengo: Schema.Literal("2025-12-31"),
  contribuyente: Id,
  estadoCivil: Schema.Literals(["sin-vinculo", "separado-legalmente", "casado-no-separado"]),
  conyuge: Schema.optional(Id),
  censoCompleto: Schema.Literal(true),
  hijosCompletos: Schema.Literal(true),
  hijos: Schema.Array(Schema.Struct({
    id: Id, nacimiento: Texto, progenitores: Schema.Array(Id),
    conviveCon: Schema.Array(Id), independienteConConsentimiento: Schema.Boolean,
    apoyoJudicial: Schema.Literals(["ninguno", "pendiente"]), soporte: Texto,
  })),
  personas: Schema.Array(Schema.Struct({
    id: Id, soporte: Texto, residenteComunTodo2025: Schema.Literal(true),
    vivoTodo2025: Schema.Literal(true),
    // Residencia autonómica ordinaria acreditada; residencia común no basta.
    declaracion2025: Schema.optional(Schema.Struct({
      modalidad: Schema.Literals(["individual", "no-presenta", "conjunta"]), soporte: Texto,
    })),
    residenciaAutonomica2025: Schema.optional(Schema.Struct({
      comunidad: Schema.Literals(["andalucia", "otra-comunidad-comun"]),
      desde: Schema.Literal("2025-01-01"), hasta: Schema.Literal("2025-12-31"), soporte: Texto,
    })),
    economia: EconomiaPersonaFamiliar2025,
  })).check(Schema.isMaxLength(100)),
})
export type CensoBasesFamiliares2025 = typeof CensoBasesFamiliares2025.Type
export type BasePersona2025 = { readonly general: Decimal; readonly ahorro: Decimal; readonly rentaAntesReducciones?: Decimal }
export type LibroBasesFamiliares2025 = {
  readonly referencia: string; readonly ejercicio: 2025; readonly contribuyente: string
  readonly estadoCivil: CensoBasesFamiliares2025["estadoCivil"]
  readonly conyuge?: string | undefined
  readonly censo?: CensoBasesFamiliares2025 | undefined
  readonly miembrosUnidad: readonly string[]
  readonly bases: ReadonlyMap<string, BasePersona2025>
}
function fechaCensadaValida(fecha: string): boolean {
  const d = DateTime.make(fecha + "T00:00:00Z")
  return Option.isSome(d) && DateTime.formatIsoDateUtc(d.value) === fecha
}
function exigir(ok: boolean, motivo: string): asserts ok { if (!ok) throw new RangeError("Bases familiares: " + motivo) }
function unicos(ids: readonly string[], campo: string): void { exigir(new Set(ids).size === ids.length, campo + " duplicado") }
function mismos(a: readonly string[], b: readonly string[]): boolean { return a.length === b.length && a.every(id => b.includes(id)) }
/** Núcleo individual sin escalas, mínimos, pagos ni deducciones; art19/art20 compartidos. */
export function baseTrabajoMiembro2025(trabajo: GastosTrabajo, madrid: boolean, otrasRentas: Decimal = new D(0), aporte = adaptarTrabajoAnual(trabajo)): BasePersona2025 {
  exigir(trabajo.ejercicio === 2025 && trabajo.territorio === "comun", "trabajo: faltan hechos ordinarios2025")
  const empleo = trabajo.rendimientos.every(r => ["empleo-laboral", "empleo-estatutario"].includes(r.clase))
  const pension = trabajo.rendimientos.every(r => r.clase === "pension")
  exigir(trabajo.rendimientos.length > 0 && (empleo || pension), "trabajo: falta separación empleo/pensión/otras clases")
  exigir(aporte.estado !== "no-soportado", aporte.estado === "no-soportado" ? aporte.motivo : "trabajo no disponible")
  const neto = new D(aporte.rendimientoAntesArt20)
  let reduccion = D.min(D.max(0, neto), calcularReduccionTrabajoConOtrasRentas({
    anio: 2025, rendimientoPrevioNeto: new D(aporte.argumentoArt20), otrasRentasNoExentas: otrasRentas,
    compatibilidadOpen2025: madrid && empleo ? { integro: new D(aporte.gastos.integro), gastosAE: new D(aporte.gastos.gastosAE) } : undefined,
  }))
  if (madrid && empleo) reduccion = reduccion.toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
  return { general: neto.minus(reduccion), ahorro: new D(0), rentaAntesReducciones: neto }
}
/** Economía ajena ordinaria para consumidores civiles y art82, sin mínimos ni cuotas. */
export function producirEconomiaAjena2025(e: typeof EconomiaPersonaFamiliar2025.Type, madrid: boolean): BasePersona2025 {
  const r = Schema.decodeUnknownResult(EconomiaPersonaFamiliar2025)(e, { onExcessProperty: "error" })
  exigir(Result.isSuccess(r), "economía incompleta o magnitudes fiscales externas")
  const hechos = r.success
  exigir(hechos.perfil !== "declarante-en-composicion", "economía ajena requiere rentas expresas")
  return hechos.perfil === "sin-rentas"
    ? { general: new D(0), ahorro: new D(0), rentaAntesReducciones: new D(0) }
    : baseTrabajoMiembro2025(hechos.trabajo, madrid)
}
/** No llama a ninguna liquidación ni agrega rentas ajenas al declarante. */
export function producirBasesFamiliares2025(
  entrada: CensoBasesFamiliares2025,
  caso: Pick<CasoFiscalAnual, "anio" | "contribuyenteId" | "comunidadAutonoma" | "fechaFallecimiento" | "derechosMinimos">,
  propia: BasePersona2025
): LibroBasesFamiliares2025 {
  const r = Schema.decodeUnknownResult(CensoBasesFamiliares2025)(entrada, { onExcessProperty: "error" })
  exigir(Result.isSuccess(r), "censo incompleto o contiene magnitudes fiscales externas")
  const c = r.success
  if (caso.comunidadAutonoma === "andalucia") {
    const residencia = c.personas.find(p => p.id === c.contribuyente)?.residenciaAutonomica2025
    exigir(residencia?.comunidad === "andalucia", "residencia andaluza propia no acreditada")
  }
  exigir(caso.anio === 2025 && caso.fechaFallecimiento === undefined && c.contribuyente === caso.contribuyenteId && ["madrid", "comunitat-valenciana", "andalucia"].includes(caso.comunidadAutonoma), "identidad/ejercicio/residencia/fallecimiento incompatible")
  unicos(c.personas.map(p => p.id), "personas"); unicos(c.hijos.map(h => h.id), "hijos")
  const personas = new Set(c.personas.map(p => p.id))
  exigir(personas.has(c.contribuyente), "falta persona declarante")
  exigir((c.estadoCivil === "casado-no-separado") === (c.conyuge !== undefined), "falta estado civil/cónyuge coherente al devengo")
  if (c.conyuge !== undefined) exigir(c.conyuge !== c.contribuyente && personas.has(c.conyuge), "falta identidad económica del cónyuge")
  const miembros = [c.contribuyente, ...(c.conyuge === undefined ? [] : [c.conyuge])]
  for (const h of c.hijos) {
    unicos(h.progenitores, "progenitores"); unicos(h.conviveCon, "conviveCon")
    exigir(personas.has(h.id) && h.progenitores.length > 0 && h.progenitores.length <= 2 && !h.progenitores.includes(h.id) && h.progenitores.every(id => personas.has(id)) && h.conviveCon.every(id => personas.has(id) && id !== h.id), "filiación/convivencia sin personas identificadas:" + h.id)
    exigir(h.id !== c.contribuyente && h.id !== c.conyuge && h.progenitores.some(id => id === c.contribuyente || id === c.conyuge), "hijo ajeno al censo del contribuyente:" + h.id)
    exigir(/^\d{4}-\d{2}-\d{2}$/.test(h.nacimiento) && fechaCensadaValida(h.nacimiento) && h.nacimiento <= c.devengo, "nacimiento inválido:" + h.id)
    exigir(h.apoyoJudicial === "ninguno", "falta resolución y régimen de apoyo judicial:" + h.id)
    if (h.nacimiento > "2007-12-31" && !h.independienteConConsentimiento && h.conviveCon.some(id => id === c.contribuyente || id === c.conyuge)) miembros.push(h.id)
  }
  // Las fechas de los hijos también impiden ciclos y filiaciones imposibles.
  for (const h of c.hijos) for (const id of h.progenitores) {
    const padre = c.hijos.find(p => p.id === id)
    exigir(padre === undefined || padre.nacimiento < h.nacimiento, "ciclo/filiación temporal imposible:" + h.id)
  }
  const ds = caso.derechosMinimos?.descendientes ?? []
  for (const d of ds) {
    const h = c.hijos.find(h => h.id === d.sujetoId)
    exigir(h !== undefined, "falta filiación/censo del descendiente:" + d.sujetoId)
    exigir(h.nacimiento === d.fechaNacimiento, "nacimiento contradictorio:" + d.sujetoId)
    const padres = d.titulares.filter(t => t.grado === 1 && ["consanguinidad", "adopcion"].includes(t.vinculo.clase))
    exigir(mismos(h.progenitores, padres.map(t => t.titularId)), "falta filiación de primer grado completa:" + d.sujetoId)
    for (const t of padres) exigir(h.conviveCon.includes(t.titularId) === (t.relacion === "convivencia"), "convivencia contradictoria:" + d.sujetoId)
  }
  const bases = new Map<string, BasePersona2025>()
  for (const p of c.personas) {
    const e = p.economia
    if (p.id === c.contribuyente) {
      exigir(p.declaracion2025 === undefined || p.declaracion2025.modalidad === "individual", "declaración propia contradice composición individual")
      exigir(e.perfil === "declarante-en-composicion", "declarante debe reutilizar su composición")
      bases.set(p.id, { general: new D(propia.general), ahorro: new D(propia.ahorro) })
    } else {
      exigir(e.perfil !== "declarante-en-composicion", "segundo declarante en composición:" + p.id)
      // El libro no representa aún los periodos de discapacidad laboral y al
      // devengo. No basta con comparar grados ni con hacer coincidir las rentas.
      // El consumidor civil andaluz valida sus propios hechos fuera del libro.
      exigir(e.perfil !== "solo-trabajo" || e.trabajo.discapacidadActiva === "ninguna", "discapacidad activa ajena: faltan periodos conciliados con mínimos:" + p.id)
      bases.set(p.id, producirEconomiaAjena2025(e, caso.comunidadAutonoma === "madrid"))
      const renta = e.perfil === "sin-rentas" ? new D(0) : bases.get(p.id)!.rentaAntesReducciones!
      const d = ds.find(d => d.sujetoId === p.id)
      if (d !== undefined && p.declaracion2025 !== undefined)
        exigir(p.declaracion2025.modalidad === d.declaracion.modalidad, "declaración contradice mínimos:" + p.id)
      if (e.perfil === "sin-rentas" && d?.declaracion.modalidad === "individual") exigir(d.declaracion.rentasCentimos === 0, "ausencia de renta contradice declaración:" + p.id)
      exigir(d === undefined || renta.times(100).eq(d.rentasNoExentasCentimos), "renta económica contradice mínimos:" + p.id)
      for (const d of ds) for (const t of d.titulares.filter(t => t.titularId === p.id))
        exigir(renta.times(100).eq(t.rentasNoExentasCentimos), "renta económica contradice titular:" + p.id)

    }
  }
  return { referencia: c.referencia, ejercicio: 2025, contribuyente: c.contribuyente, estadoCivil: c.estadoCivil, conyuge: c.conyuge, miembrosUnidad: miembros, bases, censo: c }
}
export function sumaBasesPersonas2025(libro: LibroBasesFamiliares2025, ids: readonly string[]): Decimal {
  unicos(ids, "agregación")
  return ids.reduce((a, id) => {
    const b = libro.bases.get(id); exigir(b !== undefined, "faltan hechos económicos completos2025:" + id)
    return a.plus(b.general).plus(b.ahorro)
  }, new D(0))
}
