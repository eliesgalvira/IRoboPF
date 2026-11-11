import { Result, Schema } from "effect"
import { CensoBasesFamiliares2025, EconomiaPersonaFamiliar2025, producirEconomiaAjena2025 } from "../../bases-familiares-2025/productor"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { falta, texto, unicos } from "./comun"

const Texto = Schema.String.check(Schema.isPattern(/\S/))
const Id = Schema.String.check(Schema.isPattern(/^s-[0-9]{1,6}$/))
/** Hechos nominales; sin bases, cuotas ni booleanos de derecho aportados por cliente.
 * Reutiliza filiación y economía del libro familiar sin abrir su contrato territorial. */
export const PagadoresMurcia2025 = Schema.Struct({
  referencia: Texto,
  ejercicio: Schema.Literal(2025),
  contribuyente: Id,
  censo: Schema.Literal("completo"),
  convivencia: Schema.Literal("estable_desde_inicio2025_o_nacimiento"),
  hijos: CensoBasesFamiliares2025.fields.hijos,
  personas: Schema.Array(Schema.Struct({
    id: Id, soporte: Texto,
    vivoTodo2025: Schema.Literal(true),
    residenteComunTodo2025: Schema.Literal(true),
    residencia: Schema.Struct({
      comunidad: Schema.Literals(["murcia", "otra-comunidad-comun"]),
      desde: Schema.Literal("2025-01-01"), hasta: Schema.Literal("2025-12-31"), soporte: Texto,
    }),
    modalidad: Schema.Literal("individual"),
    economia: EconomiaPersonaFamiliar2025,
  })),
})

/** Produce elegibilidad nominal por persona/hijo antes de considerar sus pagos.
 * El mínimo se obtiene de las atribuciones calculadas, jamás del mero censo del grafo. */
export function producirPagadoresMurcia2025(entrada: typeof PagadoresMurcia2025.Type, m: MagnitudesTerritorialesAnuales): ReadonlyMap<string, readonly string[]> {
  const r = Schema.decodeUnknownResult(PagadoresMurcia2025)(entrada, { onExcessProperty: "error" })
  if (Result.isFailure(r)) falta("pagadoresMurcia.contrato", "Hechos nominales incompletos o magnitudes fiscales externas")
  const c = r.success
  const propio = m.caso.contribuyenteId
  const ds = m.caso.derechosMinimos?.descendientes ?? []
  const atribuciones = m.atribucionesMinimo
  if (atribuciones === undefined) falta("pagadoresMurcia.minimo", "Faltan las atribuciones calculadas del mínimo")
  if (m.caso.anio !== 2025 || m.caso.comunidadAutonoma !== "murcia" || c.contribuyente !== propio)
    falta("pagadoresMurcia.identidad", "Identidad, ejercicio o territorio contradictorios")
  unicos(c.personas.map(p => p.id), "pagadoresMurcia.personas")
  unicos(c.hijos.map(h => h.id), "pagadoresMurcia.hijos")
  const mismos = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every(id => b.includes(id))
  const adultos = [...new Set(ds.flatMap(d => d.titulares.map(t => t.titularId)))]
  if (!mismos(c.personas.map(p => p.id), adultos) || !mismos(c.hijos.map(h => h.id), ds.map(d => d.sujetoId)))
    falta("pagadoresMurcia.censo", "Censo nominal distinto del familiar completo")
  for (const h of c.hijos) {
    const d = ds.find(d => d.sujetoId === h.id)!
    unicos(h.progenitores, "pagadoresMurcia.progenitores")
    unicos(h.conviveCon, "pagadoresMurcia.conviveCon")
    texto(h.soporte, "pagadoresMurcia.hijo.soporte")
    if (adultos.includes(h.id) || h.nacimiento !== d.fechaNacimiento || !d.vivoAlDevengo ||
      h.independienteConConsentimiento || h.apoyoJudicial !== "ninguno" ||
      d.titulares.length > 2 || !mismos(h.progenitores, d.titulares.map(t => t.titularId)) ||
      !mismos(h.conviveCon, h.progenitores) || d.titulares.some(t => t.grado !== 1 ||
        !["consanguinidad", "adopcion"].includes(t.vinculo.clase) || t.relacion !== "convivencia" ||
        t.alimentosJudiciales || t.aplicaEspecialidadAlimentos || !t.residenteIrpf))
      falta("pagadoresMurcia.familia_estable", "Falta filiación/convivencia estable; tutores, cambios civiles y alimentos requieren perfil específico")
  }
  const libro = new Map<string, readonly string[]>()
  for (const p of c.personas) {
    let admisible: boolean
    if (p.id === propio) {
      if (p.economia.perfil !== "declarante-en-composicion" || p.residencia.comunidad !== "murcia")
        falta("pagadoresMurcia.propio", "La economía propia debe proceder de la composición anual y residir en Murcia")
      admisible = true // El consumidor ya contrastó la base propia con aritmética racional.
    } else {
      if (p.economia.perfil === "declarante-en-composicion" ||
        (p.economia.perfil === "solo-trabajo" && p.economia.trabajo.discapacidadActiva !== "ninguna"))
        falta("pagadoresMurcia.economia", "Faltan rentas propias o periodos de discapacidad activa ajena conciliados")
      let base: ReturnType<typeof producirEconomiaAjena2025>
      try { base = producirEconomiaAjena2025(p.economia, false) }
      catch (e) {
        if (!(e instanceof RangeError)) throw e
        falta("pagadoresMurcia.economia", e.message)
      }
      for (const d of ds) for (const t of d.titulares.filter(t => t.titularId === p.id)) {
        if (base.rentaAntesReducciones === undefined || !base.rentaAntesReducciones.times(100).eq(t.rentasNoExentasCentimos))
          falta("pagadoresMurcia.renta_grafo", "Renta calculada ajena contradice el grafo de mínimos")
      }
      admisible = p.residencia.comunidad === "murcia" && base.general.plus(base.ahorro).lte(30000)
    }
    libro.set(p.id, admisible ? c.hijos.filter(h =>
      atribuciones.some(a => a.sujetoId === h.id && a.titulares.includes(p.id))
    ).map(h => h.id) : [])
  }
  return libro
}
