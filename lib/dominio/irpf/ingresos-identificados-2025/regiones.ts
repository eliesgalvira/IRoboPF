import type { MagnitudesTerritorialesAnuales } from "../deducciones/anual-territorial"
import { DecimalIngreso2025 as D } from "./productor"
import { fecha } from "../deducciones/asturias-cantabria-hechos-2025/comun"
type Diagnostico = { readonly referencia: string; readonly emisor: string; readonly fecha: string }
function exigir(b: boolean, m: string): asserts b { if (!b) throw new RangeError(m) }
/** Selección regional de un ingreso ya producido. No agrega rentas ni acepta bases externas. */
export function ingresoRegionalELA2025(m: MagnitudesTerritorialesAnuales, ingresoId: string, diagnostico: Diagnostico, programa: "galicia-bs215a-2025" | "extremadura-ela-2025") {
  const libro = m.libroIngresosIdentificados2025, nodos = m.nodosFiscalesB2025
  exigir(libro !== undefined && nodos?.tiposMediosGenerales !== undefined, "ELA regional requiere libro integrado y tipos medios después del mínimo")
  exigir(libro.ejercicio === 2025 && libro.contribuyente === m.caso.contribuyenteId && libro.contribuyente === nodos.contribuyente && libro.liquidacion === nodos.liquidacion, "ELA regional: identidad/ejercicio/liquidación no conciliados")
  exigir(nodos.ejercicio === 2025 && new D(nodos.tiposMediosGenerales.baseLiquidableGeneral).eq(m.baseGeneral), "ELA regional: tipos de distinta base liquidable")
  exigir(libro.ingresos.length === 1, "Extensión regional: un expediente exhaustivo, sin mezclar otros ingresos identificados")
  const ingreso = libro.ingresos[0]
  exigir(ingreso !== undefined && ingreso.ayudaId === ingresoId && ingreso.programa === programa && ingreso.beneficiario === libro.contribuyente, "ELA regional: expediente/beneficiario/programa ajeno")
  exigir(diagnostico.referencia.trim().length > 0 && diagnostico.emisor.trim().length > 0 && fecha(diagnostico.fecha) && diagnostico.fecha <= ingreso.resolucion.fecha, "ELA regional: diagnóstico declarado ausente o posterior a concesión")
  exigir(new D(ingreso.integradoBaseGeneral).eq(ingreso.integradoBaseLiquidable) && new D(ingreso.integradoBaseGeneral).eq(new D(ingreso.cobrado.numeradorEuros).div(ingreso.cobrado.divisor)), "ELA regional: cobro/BIG/BLG sin conciliación exacta")
  return { ingreso, tipos: nodos.tiposMediosGenerales }
}
