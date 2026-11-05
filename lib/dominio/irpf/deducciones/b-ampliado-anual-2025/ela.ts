import type { SolicitudBAmpliadoAnual } from "./esquemas"
import type { LibroIngresosIdentificados2025 } from "../../ingresos-identificados-2025/productor"
import type { NodosFiscalesB2025 } from "./productores"
import { exigirB } from "./conciliacion"
import { racional } from "../anual-territorial-racional"

type HechosELA = Extract<SolicitudBAmpliadoAnual["hechos"], { readonly codigo: "asturias_ayudas_ela" }>
function mismoImporte(a: string, b: string): boolean {
  const x = racional(a), y = racional(b)
  return x.numeradorEuros === y.numeradorEuros && x.divisor === y.divisor
}
/** Consumo del libro de ingresos real; la selección regional no incorpora renta. */
export function conciliarAyudasELAIntegradas2025(h: HechosELA, libro: LibroIngresosIdentificados2025 | undefined, nodos: NodosFiscalesB2025 | undefined) {
  exigirB(nodos?.tiposMediosGenerales !== undefined, "Falta productor motor:tiposMediosGenerales2025 art.63.2/74.2 y ayudaELAIntegrada2025")
  exigirB(libro !== undefined, "Falta ayudaELAIntegrada2025: ingreso cobrado e integrado por composición, no importe concedido")
  exigirB(nodos?.tiposMediosGenerales !== undefined && libro.liquidacion === nodos.liquidacion && libro.contribuyente === nodos.contribuyente && libro.ejercicio === 2025, "Libro ELA y tipos generales de distinta persona/ejercicio/liquidación o BLG sin tipo")
  const ids = h.ayudas.map(a => a.id)
  exigirB(new Set(ids).size === ids.length && ids.length > 0 && ids.length === libro.ingresos.length, "Censo ELA regional incompleto, duplicado o con ingresos omitidos")
  const ayudas = h.ayudas.map(a => {
    const xs = libro.ingresos.filter(x => x.ayudaId === a.id)
    exigirB(xs.length === 1, "ayudaId ELA sin ingreso identificado único")
    const x = xs[0]
    exigirB(x.beneficiario === a.beneficiario && x.contribuyente === libro.contribuyente && a.organismo === "principado_asturias" && a.enfermedad === "ELA" && x.programa === "asturias-ela-2025", "Identidad, programa o administración ELA contradictorios")
    exigirB(x.resolucion.referencia === a.concesion.referencia && x.resolucion.fecha === a.concesion.fecha && x.resolucion.organismo === a.concesion.organismo && mismoImporte(x.resolucion.importeConcedido, a.importeConcedido), "Resolución ELA regional contradictoria con el ingreso")
    return { ...a, integradoBaseGeneral: x.integradoBaseGeneral, integradoBaseLiquidable: x.integradoBaseLiquidable }
  })
  return { ...h, ayudas }
}
