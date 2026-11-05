import Decimal from "decimal.js"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import type { MagnitudesTerritorialesAnuales, SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import type { SolicitudBAmpliadoAnual } from "../lib/dominio/irpf/deducciones/b-ampliado-anual-2025"
import { doc, pago, vivienda, operacion, traslado, empresa, participaciones } from "./asturias-cantabria-ampliacion-fixtures"

const D = Decimal.clone({ precision: 600 })
export const decimalB = (s: string) => new D(s)
export function marcoPropioB(territorio: "asturias" | "cantabria" = "asturias", edad = 45): MagnitudesTerritorialesAnuales {
  return {
    caso: { anio: 2025, comunidadAutonoma: territorio, contribuyenteId: "A", situacionFamiliar: { tipo: "individual", edad, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } },
    baseGeneral: new D("20000"), baseAhorro: new D("0"), minimoPersonalFamiliar: new D("5550"), cuotaAutonomica: new D("10000"), sujetosConMinimo: [],
    basesLiquidables: { general: new D("20000"), ahorro: new D("0") }, componentesMinimoEstatal: { contribuyente: new D("5550"), descendientes: new D("0") },
  }
}
export function casoCanonicoB(solicitud: SolicitudDeduccionesTerritoriales2025, m = marcoPropioB()): CasoFiscalAnual {
  return { ...m.caso, anio: 2025, rendimientos: { trabajo: [{ importeIntegroCentimos: 3300000 }] }, reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0, deduccionesTerritoriales2025: solicitud }
}
export function casoEfectivoB(solicitud: SolicitudDeduccionesTerritoriales2025, m = marcoPropioB()): CasoFiscalAnualExplicito {
  const territorio=m.caso.comunidadAutonoma
  if(territorio!=="asturias"&&territorio!=="cantabria")throw new Error("Fixture B fuera de territorio")
  return {
    ejercicio: 2025, comunidadAutonoma: territorio, contribuyenteId: m.caso.contribuyenteId, edad: m.caso.situacionFamiliar.edad, modalidad: "individual", residenciaTodoElAnio: true, devengo: "2025-12-31", otrasRentas: "ninguna",
    familiaresConDerechoMinimo: m.caso.derechosMinimos === undefined ? "ninguno" : "segun-derechos", derechosMinimos: m.caso.derechosMinimos,
    discapacidad: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: solicitud, rentasExtranjeras: "ninguna", especialidades: "ninguna", perfil: "solo-trabajo",
    conciliacion: { ejercicio: 2025, estado: "totales-anuales-sin-duplicados", procedencia: ["certificado-trabajo"] },
    trabajo: { ejercicio: 2025, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna", rendimientos: [{ id: "R1", clase: "empleo-laboral", integro: "33000", cotizaciones: { clase: "efectivas", seguridadSocial: "0", derechosPasivos: "0", colegiosHuerfanos: "0" }, sindicato: { importe: "0", satisfecho: "no" }, colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" }, defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" } }] }, retenciones: [],
  }
}
export const alquilerB: SolicitudBAmpliadoAnual = {
  lote: "B-ampliado", hechos: { codigo: "asturias_arrendamiento_vivienda_habitual", inmueble: vivienda("33001", "alquiler"), titulares: { titulares: ["A"], exhaustividad: "completa" }, personas: [{ id: "A", nacimiento: "1980-01-01", numerosa: null, monoparental: null, violenciaGenero: null, pagos: [pago("6000")] }] },
}
export const autonomoB: SolicitudBAmpliadoAnual = {
  lote: "B-ampliado", hechos: { codigo: "asturias_autonomos_concejos_despoblamiento", personas: [{ id: "A", municipio: "33001", trabajo: { clase: "propia", alta: doc, grupoCotizacion: 1, actividad: "ACT1", modalidad: "autonomo", baja: null, fallecimiento: null, bajasPrevias: [] } }] },
}
export const inversionB: SolicitudBAmpliadoAnual = { lote: "B-ampliado", hechos: { codigo: "asturias_inversion_entidades_nuevas_reciente_creacion", operaciones: [operacion()] } }
export function trasladoRuralB(): SolicitudBAmpliadoAnual { return { lote: "B-ampliado", hechos: { codigo: "cantabria_traslado_residencia_motivos_laborales_despoblamiento", personas: [traslado("cantabria")] } } }
export function obrasB(): SolicitudBAmpliadoAnual { return { lote: "B-ampliado", hechos: { codigo: "cantabria_obras_mejora", obras: [{ id: "OB1", inmueble: vivienda("39003"), objeto: "telecomunicaciones", calificacion: null, ejecucion: { inicio: "2025-01-01", fin: "2025-12-31" }, gastos: [{ ...pago("10000", "P9"), subvencionNoSujetaExenta: "0" }] }], derechosEstatales: [], discapacidades: [] } } }
export function socialB(id = "O1"): SolicitudBAmpliadoAnual { return { lote: "B-ampliado", hechos: { codigo: "cantabria_inversiones_donaciones_economia_social", operaciones: [{ id, clase: "donacion_actividad", empresa: { ...empresa("cantabria"), id: "E-social", forma: "cooperativa" }, pagos: [pago("10000", "P-social")], participaciones: participaciones(), escritura: doc, certificacion: doc, caracter: "irrevocable", actividadDifusion: "otra", transmisiones: [] }] } } }
