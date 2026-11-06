import type { MagnitudesTerritorialesAnuales } from "./anual-territorial"

function exigir(ok: boolean, motivo: string): asserts ok {
  if (!ok) throw new RangeError("Andalucía titulares: " + motivo)
}
function mismos(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every(id => b.includes(id))
}
/** Consume el libro ya producido. Ni bases externas ni selección de miembros art82. */
export function titularesAndalucia2025(
  ids: readonly string[], m: MagnitudesTerritorialesAnuales,
  objeto?: { readonly adopcion: string; readonly inscripcion: string },
) {
  const propio = m.caso.contribuyenteId, b = m.basesImponiblesE38
  exigir(propio !== undefined && b !== undefined, "faltan identidad/bases imponibles propias")
  exigir(m.caso.anio === 2025 && m.caso.comunidadAutonoma === "andalucia" && m.caso.fechaFallecimiento === undefined && m.caso.situacionFamiliar.tipo === "individual",
    "falta residencia/devengo ordinario2025")
  exigir(ids.length > 0 && ids.length <= 2 && new Set(ids).size === ids.length && ids.includes(propio),
    "censo duplicado, ajeno, vacío o más de dos titulares")
  const libro = m.libroBasesFamiliares2025, c = libro?.censo
  // Si existen hechos civiles anuales no pueden omitirse adoptantes conocidos.
  if (objeto !== undefined) {
    const d = m.caso.derechosMinimos?.descendientes.find(d => d.sujetoId === objeto.adopcion)
    if (d !== undefined) exigir(mismos(ids, d.titulares.filter(t => t.grado === 1 && t.vinculo.clase === "adopcion").map(t => t.titularId)),
      "adoptantes contradictorios con filiación anual")
    if (d !== undefined) for (const t of d.titulares.filter(t => ids.includes(t.titularId))) {
      exigir(t.vinculo.clase === "adopcion" && t.vinculo.historialCompleto &&
        t.vinculo.fechaInicioIncremento <= objeto.inscripcion &&
        (t.vinculo.fechaConstitucionVinculo ?? t.vinculo.fechaInicioIncremento) <= objeto.inscripcion,
        "fecha/registro/historia adoptiva contradictorios")
    }
    if (ids.length > 1) {
      const h = c?.hijos.find(h => h.id === objeto.adopcion)
      exigir(h !== undefined && d !== undefined && mismos(ids, h.progenitores),
        "falta filiación adoptiva completa conciliada; no se infiere de art82")
    }
  }
  if (libro !== undefined) {
    const propia = libro.bases.get(propio)
    exigir(libro.ejercicio === 2025 && libro.contribuyente === propio && propia !== undefined &&
      propia.general.eq(b.general) && propia.ahorro.eq(b.ahorro), "libro/identidad/bases propias contradictorios")
  }
  if (ids.length > 1) exigir(c !== undefined && c.censoCompleto, "faltan hechos económicos familiares completos")
  return ids.map(id => {
    if (id === propio) return { id, imponibleTotalCentimos: { euros: b.general.plus(b.ahorro).toFixed() }, residenteAndalucia: true }
    const persona = c?.personas.find(p => p.id === id), base = libro?.bases.get(id)
    exigir(persona !== undefined && base !== undefined, "falta persona/economía ajena identificada:" + id)
    exigir(persona.declaracion2025 !== undefined && persona.declaracion2025.modalidad !== "conjunta",
      "falta declaración individual/ausencia expresa; conjunta ajena no representada:" + id)
    const residencia = persona.residenciaAutonomica2025
    exigir(residencia !== undefined, "residencia autonómica ajena no representada:" + id)
    // Las historias parciales, discapacidad activa y rentas heterogéneas las rechaza el productor.
    return { id, imponibleTotalCentimos: { euros: base.general.plus(base.ahorro).toFixed() },
      residenteAndalucia: residencia.comunidad === "andalucia" }
  })
}
