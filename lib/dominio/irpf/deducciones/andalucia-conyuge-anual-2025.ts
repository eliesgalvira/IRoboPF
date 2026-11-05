import { producirEconomiaAjena2025 } from "../bases-familiares-2025/productor"
import type { SolicitudAmpliacionAnualA2025 } from "./ampliacion-a-anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "./anual-territorial"
import { edad, fecha, ref } from "./lote-a-ampliacion-2025/comun"
type Solicitud = Extract<SolicitudAmpliacionAnualA2025, { codigo: "andalucia_conyuge_pareja_discapacidad" }>
function exigir(ok: boolean, motivo: string): asserts ok {
  if (!ok) throw new RangeError("Andalucía art17: " + motivo)
}
/** Vínculo al devengo separado del art82. No admite bases ni banderas de derecho. */
export function hechosConyugeAndalucia2025(s: Solicitud, m: MagnitudesTerritorialesAnuales) {
  const f = s.hechos, titular = m.caso.contribuyenteId
  ref(f.declaracion.soporte); ref(f.registroRelacion); ref(f.resolucion)
  exigir(m.caso.anio === 2025 && m.caso.comunidadAutonoma === "andalucia" && m.caso.fechaFallecimiento === undefined, "falta devengo ordinario2025")
  exigir(titular !== undefined && f.contribuyente === titular && f.persona !== titular, "identidades de vínculo contradictorias")
  exigir(/^s-[0-9]{1,6}$/.test(f.persona), "persona no identificada")
  exigir(edad(f.nacimiento) >= 18 && f.nacimiento <= fecha(f.desde), "menor/vínculo anterior al nacimiento no representado")
  exigir(fecha(f.desde) <= "2025-12-31" && (f.hasta === undefined || fecha(f.hasta) >= "2025-12-31"), "vínculo no vigente al devengo")
  exigir(f.relacion === "conyuge" ? f.administracionRegistro === "civil" : f.administracionRegistro !== "civil", "registro no conciliado con vínculo")
  exigir(fecha(f.reconocimientoDesde) <= "2025-12-31" && f.reconocimientoDesde >= f.nacimiento && (f.reconocimientoHasta === undefined || fecha(f.reconocimientoHasta) >= "2025-12-31"), "discapacidad no vigente al devengo")
  const judicial = f.incapacitacionJudicial
  if (judicial !== undefined) {
    ref(judicial.resolucion)
    exigir(fecha(judicial.fecha) < "2022-01-01" && judicial.fecha >= f.nacimiento, "DT1 requiere incapacidad judicial anterior2022")
  }
  exigir(f.declaracion.persona === f.persona && f.declaracion.ejercicio === 2025, "declaración de otra persona/ejercicio")
  // Individual excluye siempre, aunque la renta sea cero; conjunta necesita composición conjunta no representada.
  exigir(f.declaracion.modalidad !== "individual", "pareja declarante individual excluida")
  exigir(f.declaracion.modalidad === "no-presenta", "declaración conjunta requiere composición conjunta no representada")
  const gradoEfectivo = judicial === undefined ? f.grado : Math.max(65, f.grado)
  if (f.economia.perfil === "solo-trabajo" && f.economia.trabajo.rendimientos.some(r => r.clase === "empleo-laboral" || r.clase === "empleo-estatutario")) {
    const activa = f.economia.trabajo.discapacidadActiva
    exigir(activa !== "ninguna" && activa !== "pendiente", "empleo con discapacidad requiere hechos de gasto art19 activo")
    exigir(activa.grado === (gradoEfectivo >= 65 ? "65-o-mas" : "33-a-64") && gradoEfectivo >= 33, "discapacidad activa contradictoria")
    exigir(f.reconocimientoDesde <= "2025-01-01", "empleo/discapacidad parcial requiere fechas laborales aún no representadas")
  }
  const b = producirEconomiaAjena2025(f.economia, false)
  const renta = b.rentaAntesReducciones
  exigir(renta !== undefined, "falta renta neta previa a art20")
  // Art17 limita BIG+BIA propia; 8000/1800 sólo se concilian cuando hay hechos de mínimos.
  for (const d of m.caso.derechosMinimos?.descendientes ?? []) {
    if (d.sujetoId === f.persona) {
      exigir(d.fechaNacimiento === f.nacimiento && d.declaracion.modalidad === "no-presenta" && renta.times(100).eq(d.rentasNoExentasCentimos), "economía/declaración contradice mínimos del sujeto")
      const grado = judicial === undefined ? f.grado : Math.max(65, f.grado)
      exigir(d.discapacidad._tag === (grado >= 65 ? "Discapacidad65OMas" : grado >= 33 ? "Discapacidad33a64" : "SinDiscapacidad"), "discapacidad contradice mínimos")
    }
    for (const t of d.titulares.filter(t => t.titularId === f.persona))
      exigir(renta.times(100).eq(t.rentasNoExentasCentimos), "economía contradice renta del titular del mínimo")
  }
  const libro = m.libroBasesFamiliares2025
  if (libro !== undefined) {
    const otra = libro.bases.get(f.persona)
    exigir(otra !== undefined && otra.general.eq(b.general) && otra.ahorro.eq(b.ahorro) && otra.rentaAntesReducciones !== undefined && otra.rentaAntesReducciones.eq(renta), "economía contradictoria con libro familiar")
    exigir(f.relacion === "conyuge" ? libro.estadoCivil === "casado-no-separado" && libro.conyuge === f.persona : libro.estadoCivil === "sin-vinculo", "vínculo contradice art82 censado")
  }
  return { persona: f.persona, relacion: f.relacion, registroRelacion: f.registroRelacion,
    grado: judicial === undefined ? f.grado : Math.max(65, f.grado), resolucion: f.resolucion,
    declaracionPropia: "no-presenta" as const,
    // Sin declaración propia ni conjunta, no pudo aplicar art16. No se infiere de solicitudes ausentes.
    deduccionPropiaArt16: "no-aplicada" as const }
}
