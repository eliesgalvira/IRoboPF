import { hechos } from "./balears-alquiler-revision-adaptador"
import type { CasoInmobiliarioP4a } from "../lib/dominio/irpf/inmobiliario-2025/contrato"
import type { HechosDerechoDT18Balears2025 } from "../lib/dominio/irpf/vivienda-dt18-2025/balears-contrato"
import { Schema } from "effect"
import { ViviendaC36 } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-esquemas"
const doc = (referencia: string, fecha = "2025-12-31") => ({ referencia, fecha, emisor: "SINTETICO-documento" })
const corte = (importe: string, fecha = "2025-12-31") => ({ importe, documento: doc("corte-" + fecha, fecha) })
export function perfilDerecho(conPagos = true, eleccion: "aplicar" | "no_aplicar" = "no_aplicar", ingreso = "30000"): CasoInmobiliarioP4a {
  const aplicacion = doc("DECL2010", "2011-06-01"), compra = doc("ES", "2010-01-01")
  const pagos: HechosDerechoDT18Balears2025["proyectos"][number]["vivienda"]["pagos"] = conPagos ? [
    { id: "CAP", pagador: "s-1", receptor: "BAN", fecha: "2025-03-01", importe: "3000", factura: "CAP-DOC", concepto: "amortizacion", medio: "transferencia", subvencion: "0", especieExenta: "0" },
    { id: "INT", pagador: "s-1", receptor: "BAN", fecha: "2025-03-01", importe: "50", factura: "INT-DOC", concepto: "intereses", medio: "transferencia", subvencion: "0", especieExenta: "0" },
  ] : []
  const anterior = { id: "ANT", fecha: "2024-01-01", importe: conPagos ? "87000" : "90000", pagador: "s-1", receptor: "BAN", documento: doc("ANT-DOC", "2024-01-01") }
  const h: HechosDerechoDT18Balears2025 = {
    alcance: "solo_determinar_incompatibilidad_art3bis",
    ejercicio: 2025, persona: "s-1", nacimiento: "1990-01-01", ejercicioDelDerecho: eleccion,
    hogar: { estadoCivil: "soltero", desde: "2025-01-01", hasta: "2025-12-31", miembros: ["s-1"], documento: "CIVIL" },
    exhaustividad: "primera_unica_vivienda_sin_transmisiones_reinversiones_ni_otras_inversiones",
    censo: [{ id: "CTA", tipo: "cuenta_euros" }, { id: "V-P", tipo: "vivienda" }, { id: "L", tipo: "prestamo" }].map(x => ({
      id: x.id, tipo: x.tipo === "cuenta_euros" ? "cuenta_euros" as const : x.tipo === "vivienda" ? "vivienda" as const : "prestamo" as const,
      titular: "s-1", participacion: [1, 1], inicio: "presente", cierre: "presente", documento: doc("CENSO-" + x.id),
    })),
    cuentas: [{ id: "CTA", inicio: corte("20000", "2025-01-01"), cierre: corte("20000") }],
    movimientos: [
      ...pagos.map(x => ({ id: x.id, cuenta: "CTA", fecha: x.fecha, importe: x.importe, sentido: "salida" as const,
        clase: x.id === "CAP" ? "amortizacion" as const : "intereses" as const, documento: doc(x.factura, x.fecha) })),
      { id: "RENTA-P", cuenta: "CTA", fecha: "2025-07-01", importe: ingreso, sentido: "entrada", clase: "ingreso", documento: doc("COBRO-P", "2025-07-01") },
      { id: "P-R", cuenta: "CTA", fecha: "2025-08-01", importe: "1000", sentido: "salida", clase: "consumo", documento: doc("F-R", "2025-08-01") },
      { id: "CON", cuenta: "CTA", fecha: "2025-12-15", importe: String(Number(ingreso) - 1000 - (conPagos ? 3050 : 0)), sentido: "salida", clase: "consumo", documento: doc("CON", "2025-12-15") },
    ],
    adquisicion: { inmueble: "V-P", fecha: "2010-01-01", vendedor: "VEN", precio: "100000", escritura: compra, valorCierre: corte("100000") },
    historia: { desde: "1990-01-01", hasta: "2025-12-31", documento: doc("HISTORIA"),
      derechos: [{ inmueble: "V-P", titular: "s-1", adquisicion: "2010-01-01", transmision: null, titulo: compra }], anticipos: [],
      ejercicios: Array.from({ length: 35 }, (_, i) => ({ anio: 1990 + i, documento: doc("FISCAL-" + i),
        eventos: 1990 + i === 2010 ? [{ tipo: "inversion_vivienda" as const, inmueble: "V-P", documento: aplicacion }] : 1990 + i === 2024 ? [{ tipo: "inversion_vivienda" as const, inmueble: "V-P", documento: doc("DECL2024", "2025-06-01") }] : [] })),
    },
    proyectos: [{ id: "COMPRA", operacion: "adquisicion", fechaInicio: "2010-01-01", terminacion: "2010-01-01", coste: "100000", certificadoFin: doc("FIN", "2010-01-01"),
      calificacionAdecuacion: null,
      pagosOriginales: [{ id: "PRECIO", fecha: "2010-01-01", importe: "100000", pagador: "s-1", receptor: "VEN", documento: doc("PRECIO-DOC", "2010-01-01") }],
      aplicacionAnterior: { ejercicio: 2010, proyecto: "COMPRA", naturaleza: "deduccion_efectivamente_practicada", declaracionPresentada: aplicacion },
      prestamo: { id: "L", acreedor: "BAN", fecha: "2010-01-01", contrato: doc("L-DOC", "2010-01-01"), exhaustividad: "original_exclusivo_sin_refinanciacion_ni_disposiciones_adicionales",
        disposicion: corte("90000", "2010-01-01"), amortizacionesAnteriores: [anterior],
        principalInicio: corte(conPagos ? "3000" : "0", "2025-01-01"), principalFinal: corte("0"), pagos2025: pagos.map(x => x.id) },
      vivienda: { inmueble: { id: "V-P", territorio: "illes-balears", titulares: [{ titular: "s-1", numerador: 1, denominador: 1 }],
        uso: "habitual", residencia: { desde: "2010-01-01", hasta: "2025-06-30" }, adquisicion: "2010-01-01", precioAdquisicion: "100000", valorMercadoInicio: "100000", valorSuelo: "20000", catastralSuelo: "10000", catastralConstruccion: "50000" },
        municipio: "Palma", municipioHabitual: "Palma", operacion: "adquisicion", fechaInicioInversion: "2010-01-01", finConstruccion: "2010-01-01", primeraOcupacion: "2010-01-01",
        excepcionOcupacion: null, excepcionPermanencia: null, ampliacionPlazoConstruccion: null, obra: null, pagos, coberturaIntereses: "0",
        deduccionPre2013: aplicacion, ejercicioDeduccionAnterior: 2010, excepcion6812: null, primerPagoObra: "2010-01-01", informeDiscapacidad: null },
    }],
  }
  const base = hechos(35), v = base.hechos.viviendas[0]
  const s: typeof ViviendaC36.Type = { ...base, hechos: { ...base.hechos, derechoInversionAlquiler: h,
    censoViviendaInversion: { persona: "s-1", desde: h.nacimiento, hasta: "2025-12-31", cobertura: "vivienda_titulos_operaciones_completo", soporte: "CENSO", altasRETA: [],
      titulos: [{ id: "T-P", catastro: "RC-P", documento: "ES", derecho: "propiedad", desde: "2010-01-01", hasta: "2025-12-31" },
        { id: "T-R", catastro: "RC1", documento: "CONTRATO-R", derecho: "arrendatario", desde: "2025-07-01", hasta: "2025-12-31" }],
      operaciones: [{ id: "compra:V-P", catastro: "RC-P", documento: "ES", fecha: "2010-01-01", clase: "adquisicion" },
        { id: "L", catastro: "RC-P", documento: "L-DOC", fecha: "2010-01-01", clase: "financiacion" },
        { id: "ANT", catastro: "RC-P", documento: "ANT-DOC", fecha: anterior.fecha, clase: "financiacion" },
        ...pagos.map(x => ({ id: x.id, catastro: "RC-P", documento: x.factura, fecha: x.fecha, clase: "financiacion" as const }))],
    },
    viviendas: [{ ...v, ocupacion: "2025-07-01", habitualDesde: "2025-07-01",
      alquiler: { arrendador: "s-8", arrendatario: "s-1", desde: "2025-07-01", hasta: "2026-07-01", fianza: "IBAVI-R", programa: "ordinario", parientesGrado: 0, islaDestino: "Mallorca" },
      gastos: v.gastos.map(p => ({ ...p, fecha: "2025-08-01" })) }],
  } }
  return { perfil: "solo-inmobiliario-p4a", ejercicio: 2025, contribuyenteId: "s-1", liquidacionId: "T06", comunidadAutonoma: "illes-balears", edad: 35,
    otrasRentas: "ninguna", familiares: "ninguno", discapacidad: "ninguna", reduccionesBase: "ninguna", retenciones: [],
    deduccionesTerritoriales2025: { solicitudes: [s] },
    inmuebles: [{ id: "V-P", catastro: "RC-P", ubicacion: "illes-balears", titular: "s-1", titulo: "ES", derecho: "propiedad", regimenMatrimonial: "no-casado", titulares: ["s-1"],
      adquisicion: { fecha: "2010-01-01", escritura: "ES", precio: "100000", gastosTributos: "0", sueloPrecio: "20000", sueloGastosTributos: "0" }, catastro2025: { documento: "IBI", suelo: "10000", construccion: "50000" },
      cambioHabitualBalears2025: { persona: "s-1", nacimiento: h.nacimiento, residencia: { desde: "2010-01-01", hasta: "2025-06-30", documento: "PADRON-P" },
        nuevaHabitual: { catastro: "RC1", desde: "2025-07-01", documento: "PADRON-R" }, localizacion: { isla: "Mallorca", documento: "CATASTRO-P" } },
      usosDesdeAdquisicion: [{ desde: "2010-01-01", hasta: "2025-06-30", uso: "personal" }, { desde: "2025-07-01", hasta: "2025-12-31", uso: "alquiler-vivienda" }],
      contrato: { id: "C-P", documento: "CONTRATO-P", firma: "2025-06-01", desde: "2025-07-01", hasta: "2026-07-01", arrendador: "s-1", arrendatario: "TERCERO", destino: "vivienda-permanente-persona-fisica", parentesco: "ninguno", fianzaDepositada: "IBAVI-P", zonaTensionada: false, alquilerSocial: false, rehabilitacionesTresAnios: "ninguna", repercusionObras: "0" },
      exigibilidades: [{ id: "RENTA-P", documento: "COBRO-P", fecha: "2025-07-01", importe: ingreso }], gastos: [],
      censo: "contratos-ingresos-gastos-usos-y-titulares-completos", serviciosHospedaje: "ninguno", personalJornadaCompleta: "ninguno", ayudas: "ninguna", saldosPrevios: "ninguno", insolvencia: "ninguna", mobiliario: "ninguno", mejorasAnteriores2025: "ninguna", ingresosIrregulares: "ninguno" }],
  }
}
export function solicitud(c: CasoInmobiliarioP4a) {
  const s = c.deduccionesTerritoriales2025?.solicitudes[0]
  if (!Schema.is(ViviendaC36)(s)) throw new Error("Fixture T06 sin vivienda")
  return s
}
export function historia(c: CasoInmobiliarioP4a) {
  const h = solicitud(c).hechos.derechoInversionAlquiler
  if (h === undefined) throw new Error("Fixture T06 sin historia")
  return h
}
