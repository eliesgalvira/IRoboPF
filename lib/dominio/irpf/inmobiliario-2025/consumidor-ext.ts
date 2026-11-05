import Decimal from "decimal.js"
import type { MagnitudesTerritorialesAnuales } from "../deducciones/anual-territorial"
import type { SolicitudD51 } from "../deducciones/d51-anual-esquemas"
import { arrendadoresVaciasExt } from "../deducciones/extremadura-hechos-2025"
import { comprobar } from "../deducciones/canarias-balears-hechos-2025/ampliacion-comun"
const D = Decimal.clone({ precision: 80 })
type SolicitudExt = Extract<typeof SolicitudD51.Type, { codigo: "extremadura_arrendadores_viviendas_vacias" }>
export function evaluarVaciaExt2025(s: SolicitudExt, m: MagnitudesTerritorialesAnuales) {
  comprobar(m.caso.comunidadAutonoma === "extremadura" && m.inmueblesP4a?.length === 1 && s.hechos.viviendas.length === 1, "EXT: requiere productor exclusivo de una vivienda")
  const r = m.inmueblesP4a[0], h = s.hechos.viviendas[0]
  comprobar(r !== undefined && h !== undefined && r.comprobacionVacia2024 !== undefined && r.inmueble.vaciaExt2025 !== undefined, "EXT: falta comprobación primaria2024")
  const c = r.inmueble.contrato
  comprobar(h.id === r.inmueble.id && h.diasVaciaAntes === r.comprobacionVacia2024.dias && h.inicioContrato === c.desde && h.finContrato === c.hasta && h.destino === "habitual", "EXT: hechos regionales contradictorios con cronología primaria")
  comprobar(r.netoReducido.n > 0n, "EXT: RNR no positivo")
  const propio = m.caso.contribuyenteId
  comprobar(propio !== undefined && propio.length > 0, "EXT: falta identidad anual")
  return arrendadoresVaciasExt({ ejercicio: 2025, territorio: "extremadura", contribuyente: propio, declarantes: [propio], modalidad: "individual", baseGeneral: m.baseGeneral.toFixed(), baseAhorro: m.baseAhorro.toFixed(), minimoPersonalFamiliar: m.minimoPersonalFamiliar.toFixed() }, {
    exhaustividad: "completa", viviendas: [{ ...h, rendimientoNetoReducido: { ejercicio: 2025, declarantes: [propio], concepto: "rendimiento_neto_reducido_vivienda:" + h.id, valor: new D(r.netoReducido.n.toString()).div(r.netoReducido.d.toString()).toFixed() } }],
  })
}
