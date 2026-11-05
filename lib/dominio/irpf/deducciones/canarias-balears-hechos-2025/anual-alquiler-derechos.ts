import { Schema } from "effect"
import { ViviendaC36, type SolicitudAnualC36 } from "./anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { comprobar } from "./ampliacion-comun"
import { necesarioC36, sujetoC36, censoC36 } from "./anual-productores"
import { edad, fecha, unico } from "./comun"

/** Prueba suficiente de ausencia; los censos no vacíos de inversión se mantienen
 * no inferidos. No se equipara rechazo a existencia de derecho ni a cuota cero.
 * El censo es de hechos de vivienda, independiente de las elecciones fiscales. */
export function comprobarAusenciaInversionAlquilerC36(
  s: typeof ViviendaC36.Type,
  m: MagnitudesTerritorialesAnuales,
  plan: readonly SolicitudAnualC36[],
): void {
  const id = sujetoC36(m)
  const c = necesarioC36(s.hechos.censoViviendaInversion,
    "C36 art3bis: falta censo material completo de vivienda e inversiones")
  const a = edad(s.hechos.nacimientoContribuyente, "2025-12-31")
  comprobar(a >= 18 && a < 36 && censoC36(m).length === 0 &&
    m.caso.situacionFamiliar.descendientes.length === 0 &&
    m.caso.situacionFamiliar.discapacidad._tag === "SinDiscapacidad",
    "C36 art3bis: sólo joven ordinario individual sin familia representada")
  comprobar(c.persona === id && c.desde === s.hechos.nacimientoContribuyente &&
    c.hasta === "2025-12-31", "C36 art3bis: cobertura temporal o personal incompleta")
  comprobar(c.soporte.trim() !== "", "C36 art3bis: soporte del censo vacío")
  fecha(c.desde); fecha(c.hasta)
  unico(c.titulos.map(t => t.id)); unico(c.operaciones.map(o => o.id))
  c.titulos.forEach(t => {
    fecha(t.desde); fecha(t.hasta)
    comprobar(t.desde >= c.desde && t.desde <= t.hasta && t.hasta <= c.hasta,
      "C36 art3bis: título fuera del censo")
    comprobar(t.derecho === "arrendatario",
      "C36 art3bis: títulos reales requieren productor de derechos; no se infiere ausencia")
  })
  comprobar(c.altasRETA.length === 0,
    "C36 art3bis: colectivo RETA requiere conciliación específica")
  comprobar(c.operaciones.length === 0,
    "C36 art3bis: inversión presente, derecho no inferido aunque se elija no aplicar")
  comprobar(m.libroDT18 === undefined && m.inmueblesP4a === undefined,
    "C36 art3bis: censo contradice otros productores de vivienda")
  comprobar(s.hechos.viviendas.length === 1, "C36 art3bis: una vivienda habitual")
  const v = s.hechos.viviendas[0]
  const alquiler = necesarioC36(v.alquiler, "C36 art3bis: contrato ausente")
  const localizacion = necesarioC36(v.localizacion,
    "C36 art3bis: falta localización del inmueble independiente de la residencia fiscal")
  comprobar(localizacion.territorio === "illes-balears" &&
    ["Mallorca", "Menorca", "Ibiza", "Formentera", "Cabrera"].includes(localizacion.isla) &&
    localizacion.catastro === v.catastro && localizacion.documento.trim() !== "" &&
    (alquiler.islaDestino === "" || alquiler.islaDestino === localizacion.isla),
    "C36 art3bis: localización balear ausente o contradictoria")
  comprobar(v.derecho === "arrendatario" && v.uso === "habitual_propia" &&
    (v.propietarios ?? []).every(p => p.persona !== id) &&
    v.gastos.every(p => p.concepto === "alquiler" && p.naturaleza === "propio"),
    "C36 art3bis: título, inversión o fondos comunes contradicen perfil")
  comprobar(alquiler.arrendatario === id && alquiler.arrendador !== id,
    "C36 art3bis: partes contractuales contradictorias")
  comprobar(v.gastos.every(p => p.perceptor === alquiler.arrendador),
    "C36 art3bis: cobro por tercero requiere representación conciliada con el contrato")
  const ocupacion = necesarioC36(v.ocupacion, "C36 art3bis: falta ocupación efectiva")
  fecha(ocupacion)
  comprobar(ocupacion <= "2025-12-31" && ocupacion >= alquiler.desde &&
    v.habitualDesde === ocupacion && alquiler.hasta >= "2025-12-31",
    "C36 art3bis: ocupación habitual no conciliada")
  comprobar(v.gastos.every(p => p.fecha >= ocupacion && p.fecha <= alquiler.hasta),
    "C36 art3bis: pago fuera de ocupación")
  comprobar(c.titulos.some(t => t.catastro === v.catastro &&
    t.desde === alquiler.desde && t.hasta === "2025-12-31"),
    "C36 art3bis: contrato omitido del censo")
  comprobar(v.adquisicion === undefined || v.adquisicion === "",
    "C36 art3bis: adquisición contradice censo")
  comprobar(v.certificadoAntes === undefined && v.certificadoDespues === undefined &&
    v.certificadoNecesidadAccesibilidad === undefined,
    "C36 art3bis: certificados de obras requieren conciliar censo")
  comprobar(v.finObras === undefined || v.finObras === "",
    "C36 art3bis: obras contradicen censo")
  for (const otra of plan) {
    if (!Schema.is(ViviendaC36)(otra)) continue
    for (const inmueble of otra.hechos.viviendas) {
      comprobar(inmueble.derecho === "arrendatario" &&
        (inmueble.propietarios ?? []).every(p => p.persona !== id) &&
        inmueble.gastos.every(p => p.concepto === "alquiler" && p.naturaleza === "propio") &&
        (inmueble.adquisicion === undefined || inmueble.adquisicion === "") &&
        (inmueble.finObras === undefined || inmueble.finObras === "") &&
        inmueble.certificadoAntes === undefined && inmueble.certificadoDespues === undefined &&
        inmueble.certificadoNecesidadAccesibilidad === undefined &&
        c.titulos.some(t => t.catastro === inmueble.catastro),
        "C36 art3bis: censo vacío de inversión contradice hechos de otra solicitud de vivienda")
    }
  }
}
