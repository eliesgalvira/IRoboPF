import { Schema } from "effect"
import { EconomiaPersonaFamiliar2025, producirEconomiaAjena2025 } from "../bases-familiares-2025/productor"
import { adaptarTrabajoAnual } from "../trabajo-anual/adaptador"
import type { SolicitudAmpliacionAnualA2025 } from "./ampliacion-a-anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "./anual-territorial"
import { edad, fecha, ref } from "./lote-a-ampliacion-2025/comun"
type Solicitud = Extract<SolicitudAmpliacionAnualA2025, { codigo: "andalucia_ayuda_domestica" }>
const mismaEconomia = Schema.toEquivalence(EconomiaPersonaFamiliar2025)
function exigir(ok: boolean, motivo: string): asserts ok {
  if (!ok) throw new RangeError("Andalucía art19: " + motivo)
}
/** No produce mínimos, cuotas ni unidad art82. El reparto es elección exclusiva, no división. */
export function hechosAyudaDomesticaAndalucia2025(s: Solicitud, m: MagnitudesTerritorialesAnuales) {
  const { parejaOrdinaria: p, ...f } = s.hechos
  const rentas = m.rentasTrabajoAnuales
  exigir(rentas !== undefined, "ingresos propios no derivables en este perfil")
  if (f.vinculoPareja === "sin-pareja") {
    exigir(f.personaPareja === "" && p === undefined, "pareja contradictoria con ausencia de vínculo")
    return { ...f, trabajoTitularCentimos: { euros: rentas.integroTrabajo.toFixed() }, trabajoParejaCentimos: 0 }
  }
  const propio = m.caso.contribuyenteId
  exigir(m.caso.anio === 2025 && m.caso.comunidadAutonoma === "andalucia" &&
    m.caso.fechaFallecimiento === undefined && m.caso.situacionFamiliar.tipo === "individual", "falta devengo ordinario2025 individual")
  exigir(p !== undefined, "faltan hechos civiles/economía anual de pareja")
  exigir(propio !== undefined && p.contribuyente === propio && p.persona === f.personaPareja &&
    p.persona !== propio && /^s-[0-9]{1,6}$/.test(p.persona), "identidades de vínculo contradictorias")
  ref(f.registroPareja); ref(p.declaracion.soporte); ref(p.eleccion.soporte)
  exigir(edad(f.nacimientoPareja) >= 18 && f.nacimientoPareja <= fecha(p.desde) &&
    p.desde <= "2025-01-01" && (p.hasta === undefined || fecha(p.hasta) >= "2025-12-31"),
    "vínculo no estable todo2025 o nacimiento contradictorio")
  exigir(f.vinculoPareja === "conyuge" ? p.administracionRegistro === "civil" : p.administracionRegistro !== "civil", "registro contradictorio con vínculo")
  exigir(p.declaracion.persona === p.persona && p.declaracion.ejercicio === 2025, "declaración de otra persona/ejercicio")
  exigir(p.declaracion.modalidad !== "conjunta", "composición conjunta ajena no representada")
  exigir(p.eleccion.titulares.length === 2 && new Set(p.eleccion.titulares).size === 2 &&
    p.eleccion.titulares.includes(propio) && p.eleccion.titulares.includes(p.persona) &&
    p.eleccion.beneficiario === propio && f.eleccionBeneficiario === propio && p.eleccion.otraPersonaNoAplica,
    "falta elección exclusiva conciliada de los dos beneficiarios")
  const e = p.economia
  exigir(e.perfil !== "declarante-en-composicion", "economía ajena requiere hechos de rentas")
  exigir(e.perfil !== "solo-trabajo" || (e.calendarioTrabajo2025 === undefined && e.trabajo.discapacidadActiva === "ninguna"),
    "calendario/discapacidad activa ajena fuera del perfil ordinario")
  const base = producirEconomiaAjena2025(e, false)
  const renta = base.rentaAntesReducciones
  exigir(renta !== undefined, "falta renta ajena derivada")
  const libro = m.libroBasesFamiliares2025
  if (libro !== undefined) {
    const personaCensada = libro.censo?.personas.find(persona => persona.id === p.persona)
    exigir(personaCensada !== undefined && mismaEconomia(personaCensada.economia, e),
      "economía de pareja contradictoria o ausente en censo familiar")
    exigir(personaCensada.declaracion2025 === undefined ||
      personaCensada.declaracion2025.modalidad === p.declaracion.modalidad,
      "declaración de pareja contradictoria con censo familiar")
    const b = libro.bases.get(p.persona)
    exigir(b !== undefined && b.general.eq(base.general) && b.ahorro.eq(base.ahorro), "economía contradictoria con libro familiar")
    exigir(f.vinculoPareja === "conyuge" ? libro.estadoCivil === "casado-no-separado" && libro.conyuge === p.persona : libro.estadoCivil === "sin-vinculo", "vínculo contradice censo civil anual")
  }
  for (const d of m.caso.derechosMinimos?.descendientes ?? []) {
    exigir(d.sujetoId !== p.persona, "pareja identificada como descendiente")
    for (const t of d.titulares.filter(t => t.titularId === p.persona))
      exigir(renta.times(100).eq(t.rentasNoExentasCentimos), "renta ajena contradictoria con mínimos")
  }
  if (edad(s.nacimiento) < 75 && edad(f.nacimientoPareja) < 75) {
    exigir(f.hijos.length > 0 && f.hijos.every(h => {
      const d = m.caso.derechosMinimos?.descendientes.find(d => d.sujetoId === h.persona)
      return d !== undefined && d.titulares.some(t => [propio, p.persona].includes(t.titularId) &&
        t.grado === 1 && (t.vinculo.clase === "consanguinidad" || t.vinculo.clase === "adopcion"))
    }), "vía hijos requiere filiación de primer grado conciliada")
  }
  const aporte = e.perfil === "sin-rentas" ? undefined : adaptarTrabajoAnual(e.trabajo)
  if (aporte?.estado === "no-soportado") throw new RangeError("Andalucía art19: trabajo ajeno no soportado")
  // Rendimiento percibido (íntegro), no BIG ni neto art19/art20: puede haber base cero.
  return { ...f, trabajoTitularCentimos: { euros: rentas.integroTrabajo.toFixed() },
    trabajoParejaCentimos: aporte === undefined ? 0 : { euros: aporte.gastos.integro } }
}
