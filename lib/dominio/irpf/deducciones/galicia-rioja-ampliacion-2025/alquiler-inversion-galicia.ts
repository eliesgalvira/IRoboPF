import type { SolicitudE38Anual2025 } from "./anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { exige, ids } from "./comun"

/** Art5.Siete: no hay veto de inversión. El inventario debe tener productor
 * económico; ni una elección ni una afirmación de derecho sustituyen rentas. */
export function conciliarInversionAlquilerGalicia2025(s: SolicitudE38Anual2025, m: MagnitudesTerritorialesAnuales): void {
  const h = s.hechos, inversiones = s.inversionesViviendaEjercicio, libro = m.inmueblesP4a
  exige(h.codigo === "galicia_alquiler_vivienda_habitual", "Galicia: consumidor ajeno")
  if (h.codigo !== "galicia_alquiler_vivienda_habitual") return
  if (libro === undefined) {
    exige(inversiones.length === 0, "Galicia: inversión sin libro inmobiliario; rentas/base indeterminadas")
    return
  }
  exige(m.caso.comunidadAutonoma === "galicia" && libro.length === 1 && m.libroDT18 === undefined,
    "Galicia: composición de inversiones no representada")
  const p = libro[0]
  exige(p !== undefined, "Galicia: falta inmueble producido")
  if (p === undefined) return
  const v = p.inmueble, id = m.caso.contribuyenteId
  exige(v.titular === id && v.ubicacion === "galicia" && h.contratos.length === 1 && h.hijosMenores.length === 0,
    "Galicia: identidad/censo no conciliado")
  const c = h.contratos[0]
  exige(c !== undefined, "Galicia: alquiler propio ausente")
  if (c === undefined) return
  exige(c.id !== v.contrato.id && c.arrendador !== id && c.arrendador !== v.contrato.arrendatario &&
    c.titularesContrato.length === 1 && c.titularesContrato[0] === id && c.titularesDerecho.length === 1 &&
    c.titularesDerecho[0] === id && c.regimen === "privativo" && c.conyuges.length === 0 &&
    c.pagos.every(x => x.pagador === id), "Galicia: títulos propios/cedidos o pagadores contradictorios")
  const cambio = v.cambioHabitual2025
  if (cambio !== undefined) exige(cambio.persona === id && cambio.nacimiento === s.nacimientoContribuyente &&
    cambio.nuevaHabitual.contrato === c.id && c.ocupacion.desde === cambio.nuevaHabitual.desde &&
    c.ocupacion.hasta >= "2025-12-31" && c.fecha <= c.ocupacion.desde && c.uso === "habitual",
    "Galicia: calendario propio y cedido sin conciliar")
  const esperadas = v.gastos.filter(g => ["mejora", "principal-prestamo", "intereses"].includes(g.clase))
  exige(ids(inversiones.map(x => x.documento)) && inversiones.length === esperadas.length &&
    inversiones.every(i => esperadas.some(g => i.id === g.id && i.titular === v.titular &&
      i.fecha === g.fechaPago && i.importe === g.importe && i.documento === g.factura)),
    "Galicia: inventario de inversiones omite, añade o contradice operaciones del libro")
  exige(ids([...v.exigibilidades.map(x => x.id), ...v.gastos.map(x => x.id), ...c.pagos.map(x => x.id)]) &&
    ids([...v.exigibilidades.map(x => x.documento), ...v.gastos.map(x => x.factura), ...c.pagos.map(x => x.factura)]),
    "Galicia: operación/documento reutilizado entre vivienda propia y cedida")
}
