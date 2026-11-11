import type { CasoInmobiliarioP4a } from "../lib/dominio/irpf/inmobiliario-2025/contrato"
import type { HechosDerechoDT18Rioja2025 } from "../lib/dominio/irpf/vivienda-dt18-2025/contrato"
import type { SolicitudE38Anual2025 } from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/anual-esquemas"
import { casoP4a } from "./inmobiliario-p4a.fixtures"
const doc = (referencia: string, fecha = "2025-12-31") => ({ referencia, fecha, emisor: "SINTETICO-registro" })
const corte = (importe: string, fecha = "2025-12-31") => ({ importe, documento: doc("CORTE-" + fecha, fecha) })
export function perfilRioja(conDerecho = true, eleccion: "aplicar" | "no_aplicar" = "aplicar", ingreso: "30000" | "10000" = "30000") {
  const base = casoP4a(), original = base.inmuebles[0]
  if (original === undefined) throw new Error("Fixture P4a sin inmueble")
  const compra = conDerecho ? "2010-01-01" : "2020-01-01"
  const inmueble: CasoInmobiliarioP4a["inmuebles"][number] = {
    ...original, titulo: "ESC1", ubicacion: "galicia",
    adquisicion: { ...original.adquisicion, fecha: compra },
    cambioHabitual2025: { persona: "s-1", nacimiento: "1990-01-01",
      residencia: { desde: compra, hasta: "2025-06-30", documento: "PADRON-P" },
      nuevaHabitual: { contrato: "C-NUEVO", desde: "2025-07-01", documento: "PADRON-R" } },
    usosDesdeAdquisicion: [{ desde: compra, hasta: "2025-06-30", uso: "personal" }, { desde: "2025-07-01", hasta: "2025-12-31", uso: "alquiler-vivienda" }],
    contrato: { ...original.contrato, firma: "2025-06-01", desde: "2025-07-01" },
    exigibilidades: [{ id: "RENTA", documento: "COBRO", fecha: "2025-07-01", importe: ingreso }],
    gastos: [{ id: "CAP", factura: "CAP-DOC", lineaFactura: "1", totalFactura: "3000", fechaOperacion: "2025-03-01", fechaFactura: "2025-03-01", fechaPago: "2025-03-01", importe: "3000", clase: "principal-prestamo", prestadorNif: "BAN" }],
  }
  const pagos: HechosDerechoDT18Rioja2025["proyectos"][number]["vivienda"]["pagos"] = [
    { id: "CAP", pagador: "s-1", receptor: "BAN", fecha: "2025-03-01", importe: "3000", factura: "CAP-DOC", concepto: "amortizacion", medio: "transferencia", subvencion: "0", especieExenta: "0" },
    { id: "INT", pagador: "s-1", receptor: "BAN", fecha: "2025-03-01", importe: "50", factura: "INT-DOC", concepto: "intereses", medio: "transferencia", subvencion: "0", especieExenta: "0" },
  ]
  const declaracion = doc("DECL2010", "2011-06-01"), escritura = doc("ESC1", compra)
  const derecho: HechosDerechoDT18Rioja2025 = {
    alcance: "solo_incompatibilidad_alquiler_rioja", ejercicio: 2025, persona: "s-1", nacimiento: "1990-01-01", ejercicioDelDerecho: eleccion,
    exhaustividad: "primera_unica_vivienda_sin_transmisiones_reinversiones_ni_otras_inversiones",
    censo: [
      { id: "CTA", tipo: "cuenta_euros", titular: "s-1", participacion: [1,1], inicio: "presente", cierre: "presente", documento: doc("CENSO-CTA") },
      { id: "V1", tipo: "vivienda", titular: "s-1", participacion: [1,1], inicio: "presente", cierre: "presente", documento: doc("CENSO-V1") },
      { id: "L", tipo: "prestamo", titular: "s-1", participacion: [1,1], inicio: "presente", cierre: "presente", documento: doc("CENSO-L") },
    ],
    cuentas: [{ id: "CTA", inicio: corte("20000", "2025-01-01"), cierre: corte("20000") }],
    movimientos: [
      { id: "CAP", cuenta: "CTA", fecha: "2025-03-01", importe: "3000", sentido: "salida", clase: "amortizacion", documento: doc("CAP-DOC", "2025-03-01") },
      { id: "INT", cuenta: "CTA", fecha: "2025-03-01", importe: "50", sentido: "salida", clase: "intereses", documento: doc("INT-DOC", "2025-03-01") },
      { id: "RENTA", cuenta: "CTA", fecha: "2025-07-01", importe: ingreso, sentido: "entrada", clase: "ingreso", documento: doc("COBRO", "2025-07-01") },
      { id: "ALQ", cuenta: "CTA", fecha: "2025-08-01", importe: "6000", sentido: "salida", clase: "consumo", documento: doc("ALQ-DOC", "2025-08-01") },
      { id: "CON", cuenta: "CTA", fecha: "2025-12-15", importe: ingreso === "30000" ? "20950" : "950", sentido: "salida", clase: "consumo", documento: doc("CON-DOC", "2025-12-15") },
    ],
    adquisicion: { inmueble: "V1", fecha: compra, vendedor: "VEN", precio: "100000", escritura, valorCierre: corte("100000") },
    historia: { desde: "1990-01-01", hasta: "2025-12-31", documento: doc("CENSO-VITAL"),
      derechos: [{ inmueble: "V1", titular: "s-1", adquisicion: compra, transmision: null, titulo: escritura }], anticipos: [],
      ejercicios: [{ anio: 2010, documento: declaracion, eventos: [{ tipo: "inversion_vivienda", inmueble: "V1", documento: declaracion }] }],
    },
    proyectos: [{ id: "COMPRA", operacion: "adquisicion", fechaInicio: compra, terminacion: compra, coste: "100000", certificadoFin: doc("FIN", compra), calificacionAdecuacion: null,
      pagosOriginales: [{ id: "PRECIO", fecha: compra, importe: "100000", pagador: "s-1", receptor: "VEN", documento: doc("PRECIO-DOC", compra) }],
      aplicacionAnterior: { ejercicio: 2010, proyecto: "COMPRA", naturaleza: "deduccion_efectivamente_practicada", declaracionPresentada: declaracion },
      prestamo: { id: "L", acreedor: "BAN", fecha: compra, contrato: doc("L-DOC", compra), exhaustividad: "original_exclusivo_sin_refinanciacion_ni_disposiciones_adicionales",
        disposicion: corte("90000", compra), amortizacionesAnteriores: [{ id: "ANT", fecha: "2024-01-01", importe: "87000", pagador: "s-1", receptor: "BAN", documento: doc("ANT-DOC", "2024-01-01") }],
        principalInicio: corte("3000", "2025-01-01"), principalFinal: corte("0"), pagos2025: ["CAP", "INT"] },
      vivienda: { inmueble: { id: "V1", territorio: "galicia", titulares: [{ titular: "s-1", numerador: 1, denominador: 1 }], uso: "habitual",
        residencia: { desde: compra, hasta: "2025-06-30" }, adquisicion: compra, precioAdquisicion: "100000", valorMercadoInicio: "100000", valorSuelo: "20000", catastralSuelo: "10000", catastralConstruccion: "50000" },
        municipio: "Vigo", municipioHabitual: "Vigo", operacion: "adquisicion", fechaInicioInversion: compra, finConstruccion: compra, primeraOcupacion: compra,
        excepcionOcupacion: null, excepcionPermanencia: null, ampliacionPlazoConstruccion: null, obra: null, pagos, coberturaIntereses: "0",
        deduccionPre2013: declaracion, ejercicioDeduccionAnterior: 2010, excepcion6812: null, primerPagoObra: compra, informeDiscapacidad: null },
    }],
  }
  const solicitud: SolicitudE38Anual2025 = {
    lote: "E38", nacimientoContribuyente: "1990-01-01", exhaustividad: "expediente_comun_completo_todos_pagadores",
    inversionesViviendaEjercicio: pagos.map(x => ({ id: x.id, titular: x.pagador, fecha: x.fecha, importe: x.importe, documento: x.factura })),
    hechos: { codigo: "rioja_arrendamiento_menores_36", hijosMenores: [], contratos: [{ id: "C-NUEVO", fecha: "2025-06-01", territorio: "la-rioja", municipio: "Logroño", arrendador: "ARRENDADOR", titularesContrato: ["s-1"], titularesDerecho: ["s-1"], uso: "habitual", ocupacion: { desde: "2025-07-01", hasta: "2025-12-31" },
      fianzaIGVS: null, denunciaFianza: null, modeloITP: doc("ITP", "2025-07-01"), regimen: "privativo", conyuges: [],
      pagos: [{ id: "ALQ", pagador: "s-1", receptor: "ARRENDADOR", fecha: "2025-08-01", importe: "6000", factura: "ALQ-DOC", concepto: "alquiler", medio: "transferencia", subvencion: "0", especieExenta: "0" }] }],
    },
  }
  let caso: CasoInmobiliarioP4a = { ...base, edad: 35, comunidadAutonoma: "la-rioja", inmuebles: [inmueble], deduccionesTerritoriales2025: { derechoInversionAlquilerRioja2025: derecho, solicitudes: [solicitud] } }
  if (!conDerecho) {
    const negativa: SolicitudE38Anual2025 = { ...solicitud,
      inversionesViviendaEjercicio: solicitud.inversionesViviendaEjercicio.filter(x => x.id === "CAP"),
      historiaInversionAlquilerRioja: { ejercicioDelDerecho: eleccion, historia: { ...derecho.historia,
        ejercicios: [{ anio: 2020, documento: doc("CENSO2020"), eventos: [{ tipo: "inversion_vivienda", inmueble: "V1", documento: escritura }] }] } },
    }
    caso = { ...caso, deduccionesTerritoriales2025: { solicitudes: [negativa] } }
  }
  return { caso, derecho, solicitud, inmueble }
}
export type PerfilRioja = ReturnType<typeof perfilRioja>
export function conHistoria(x: PerfilRioja, derecho: HechosDerechoDT18Rioja2025): CasoInmobiliarioP4a {
  return { ...x.caso, deduccionesTerritoriales2025: { derechoInversionAlquilerRioja2025: derecho, solicitudes: [x.solicitud] } }
}
export function conSolicitud(x: PerfilRioja, solicitud: SolicitudE38Anual2025): CasoInmobiliarioP4a {
  return { ...x.caso, deduccionesTerritoriales2025: { derechoInversionAlquilerRioja2025: x.derecho, solicitudes: [solicitud] } }
}
