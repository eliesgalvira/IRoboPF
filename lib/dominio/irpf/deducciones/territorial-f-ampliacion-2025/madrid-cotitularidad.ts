import type { SolicitudAnualF2025 } from "./anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { D, dinero, falta, fecha, requerido, texto, unicos } from "./comun"

/** CTE 02-24/R, tercero, y CTE 13-24/R: coste por participación y tope individual.
 * Se concilian hechos; el núcleo existente aplica el porcentaje una sola vez. */
export function comprobarTitularidadCompraMadrid(
  s: SolicitudAnualF2025,
  m: MagnitudesTerritorialesAnuales
): void {
  const viviendas = requerido(s.hechos.viviendas, "viviendas")
  if (viviendas.length !== 1) falta("viviendas", "Una compra identificada")
  const v = viviendas[0]!
  const propio = texto(m.caso.contribuyenteId, "contribuyenteId")
  const titulares = requerido(v.titulares, "vivienda.titulares")
  unicos(titulares, "vivienda.titulares")
  const porcentaje = dinero(v.porcentajePropiedad, "porcentajePropiedad")
  const alquileres = m.libroBasesFamiliares2025?.censo?.personas.flatMap(p =>
    "alquilerVivienda2025" in p.economia ? [p.economia.alquilerVivienda2025.inmueble] : []
  ) ?? []
  if (alquileres.length > 0) {
    const vivienda = texto(v.id, "vivienda.id")
    if (alquileres.some(x => x.id === vivienda))
      falta("vivienda.censoInmobiliario", "La compra contradice la titularidad y el uso del alquiler exclusivo censado")
  }
  const a = s.adquisicionCompartidaMadrid2025
  if (a === undefined) {
    if (titulares.length !== 1 || titulares[0] !== propio || !porcentaje.eq(100))
      falta("vivienda.titulares", "La compra compartida requiere escritura, reparto y régimen conciliados")
    return
  }
  const compra = fecha(v.adquisicion, "vivienda.adquisicion")
  if (s.codigo !== "madrid_vivienda_nacimiento_adopcion_hijos" || !compra.startsWith("2025-"))
    falta("adquisicionCompartidaMadrid2025.perfil", "Sólo compra terminada art13 de 2025; historia compartida anterior pendiente")
  if (a.contribuyente !== propio || a.viviendaId !== texto(v.id, "vivienda.id") || fecha(a.adquisicion, "compartida.adquisicion") !== compra)
    falta("adquisicionCompartidaMadrid2025.identidad", "Escritura de otro titular, inmueble o fecha")
  if (v.transmision !== undefined && fecha(v.transmision, "vivienda.transmision") <= a.titularidadHasta)
    falta("adquisicionCompartidaMadrid2025.transmision", "Venta incompatible con titularidad estable hasta devengo")
  texto(a.escritura, "compartida.escritura")
  texto(a.soporteRegimen, "compartida.soporteRegimen")
  if (fecha(a.regimenDesde, "compartida.regimenDesde") > compra)
    falta("adquisicionCompartidaMadrid2025.regimen", "Separación de bienes acreditada desde la adquisición hasta devengo")
  const libro = requerido(m.libroBasesFamiliares2025, "libroBasesFamiliares2025")
  const conyuge = requerido(libro.conyuge, "compartida.conyuge")
  if (libro.ejercicio !== 2025 || libro.contribuyente !== propio || libro.estadoCivil !== "casado-no-separado" || conyuge === propio)
    falta("adquisicionCompartidaMadrid2025.unidad", "Perfil de dos cónyuges identificados en el libro familiar del mismo ejercicio")
  const esperados = [propio, conyuge]
  // El perfil de alquiler censó todos los derechos mundiales y sólo admite
  // propiedad exclusiva: no puede coexistir con esta segunda compra compartida.
  if (libro.censo?.personas.some(p => esperados.includes(p.id) && "alquilerVivienda2025" in p.economia) === true)
    falta("adquisicionCompartidaMadrid2025.censoInmobiliario", "El censo mundial de alquiler exclusivo contradice la propiedad compartida; requiere un censo conjunto de derechos")
  unicos(a.titulares.map(t => t.id), "compartida.titulares")
  if (titulares.length !== 2 || a.titulares.length !== 2 ||
      esperados.some(id => !titulares.includes(id) || !a.titulares.some(t => t.id === id)))
    falta("adquisicionCompartidaMadrid2025.titulares", "Censo de propietarios completo: contribuyente y cónyuge, sin terceros")
  const importes = [
    ["precioAdquiridoEUR", dinero(v.precioEUR, "vivienda.precioEUR")],
    ["gastosAtribuidosEUR", dinero(v.gastosEUR, "vivienda.gastosEUR")],
    ["tributosAtribuidosEUR", dinero(v.tributosEUR, "vivienda.tributosEUR")],
  ] as const
  let suma = new D(0)
  for (const titular of a.titulares) {
    texto(titular.soporte, "compartida.soporte:" + titular.id)
    const p = dinero(titular.porcentaje, "compartida.porcentaje:" + titular.id)
    if (p.lte(0) || p.gte(100) || (titular.id === propio && !p.eq(porcentaje)))
      falta("adquisicionCompartidaMadrid2025.porcentaje", "Cuotas positivas inferiores al 100%; porcentaje propio conciliado")
    suma = suma.plus(p)
    for (const [campo, total] of importes) {
      if (!dinero(titular[campo], "compartida." + campo).times(100).eq(total.times(p)))
        falta("adquisicionCompartidaMadrid2025.coste", "Perfil de costes proporcionales al título; sin redondear repartos contradictorios ni admitir una base consignada")
    }
  }
  if (!suma.eq(100)) falta("adquisicionCompartidaMadrid2025.suma", "La escritura debe identificar el 100% de la propiedad")
}
