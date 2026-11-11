import type { CasoInmobiliarioP4a } from "../lib/dominio/irpf/inmobiliario-2025/contrato"
import type { SolicitudE38Anual2025 } from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/anual-esquemas"
import { casoP4a } from "./inmobiliario-p4a.fixtures"

export function galiciaInversion(cambio = true, ingreso = "30000", mejora = false): CasoInmobiliarioP4a {
  const b = casoP4a(), v = b.inmuebles[0]!
  const desde = cambio ? "2025-07-01" : "2025-01-01"
  const gastos = [{ ...v.gastos[0]!, id: "CAP", factura: "CAP-DOC", clase: "principal-prestamo" as const,
    importe: "3000", totalFactura: "3000", fechaOperacion: "2025-03-01", fechaFactura: "2025-03-01", fechaPago: "2025-03-01" },
    ...(mejora ? [{ ...v.gastos[0]!, id: "MEJ", factura: "MEJ-DOC", clase: "mejora" as const,
      fechaOperacion: desde, fechaFactura: desde, fechaPago: desde, puestaEnServicio: desde,
      periodoDevengo: { desde, hasta: "2025-12-31" } }] : [])]
  const s: SolicitudE38Anual2025 = { lote: "E38", nacimientoContribuyente: "1990-01-01",
    exhaustividad: "expediente_comun_completo_todos_pagadores",
    inversionesViviendaEjercicio: gastos.map(g => ({ id: g.id, titular: "s-1", fecha: g.fechaPago, importe: g.importe, documento: g.factura })),
    hechos: { codigo: "galicia_alquiler_vivienda_habitual", hijosMenores: [], contratos: [{
      id: "C-NUEVO", fecha: "2024-12-01", territorio: "galicia", municipio: "Vigo", arrendador: "ARRENDADOR",
      titularesContrato: ["s-1"], titularesDerecho: ["s-1"], uso: "habitual", ocupacion: { desde, hasta: "2025-12-31" },
      fianzaIGVS: { referencia: "IGVS", fecha: desde, emisor: "IGVS" }, denunciaFianza: null, modeloITP: null,
      regimen: "privativo", conyuges: [], pagos: [{ id: "ALQ", pagador: "s-1", receptor: "ARRENDADOR", fecha: desde,
        importe: "6000", factura: "ALQ-DOC", concepto: "alquiler", medio: "transferencia", subvencion: "0", especieExenta: "0" }],
    }] },
  }
  let inmueble: CasoInmobiliarioP4a["inmuebles"][number] = { ...v, ubicacion: "galicia", gastos,
      usosDesdeAdquisicion: [{ desde: "2020-01-01", hasta: cambio ? "2025-06-30" : "2024-12-31", uso: "personal" },
        { desde, hasta: "2025-12-31", uso: "alquiler-vivienda" }],
      contrato: { ...v.contrato, desde }, exigibilidades: [{ ...v.exigibilidades[0]!, fecha: desde, importe: ingreso }],
  }
  if (cambio) inmueble = { ...inmueble, cambioHabitual2025: { persona: "s-1", nacimiento: "1990-01-01",
    residencia: { desde: "2020-01-01", hasta: "2025-06-30", documento: "PADRON-ANTERIOR" },
    nuevaHabitual: { contrato: "C-NUEVO", desde, documento: "PADRON-NUEVO" } } }
  return { ...b, edad: 35, comunidadAutonoma: "galicia", deduccionesTerritoriales2025: { solicitudes: [s] }, inmuebles: [inmueble] }
}
export function solicitudGalicia(c: CasoInmobiliarioP4a) {
  const s = c.deduccionesTerritoriales2025?.solicitudes[0]
  if (s?.lote !== "E38" || s.hechos.codigo !== "galicia_alquiler_vivienda_habitual") throw new Error("fixture Galicia")
  return s
}
