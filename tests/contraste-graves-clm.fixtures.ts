import { Schema, Result } from "effect"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import type { GastosTrabajo } from "../lib/dominio/irpf/trabajo-anual/contrato"
function trabajo(anio: number, bruto = "23000", ss = "0") {
  return { ejercicio: anio, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna", rendimientos: [{ id: "nomina-A", clase: "empleo-laboral", integro: bruto, cotizaciones: { clase: "efectivas", seguridadSocial: ss, derechosPasivos: "0", colegiosHuerfanos: "0" }, sindicato: { importe: "0", satisfecho: "no" }, colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" }, defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" } }] }
}
function origen(bruto = "23000", ss = "0") {
  return { contribuyente: "titular-A", referencia: "exp-A", ejercicio: 2024, modalidad: "individual", primerEjercicioAplicacion: 2024, residenteComunTodoEjercicio: true, vivoTodoEjercicio: true, otrasRentas: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", censoRentasCompleto: true, trabajo: trabajo(2024, bruto, ss), certificados: [{ rendimiento: "nomina-A", titular: "titular-A", pagador: "empresa-A", referencia: "cert-A", ejercicio: 2024, integro: bruto, seguridadSocial: ss, derechosPasivos: "0", colegiosHuerfanos: "0" }], traslado: { persona: "titular-A", fecha: "2024-02-29", viviendaAnterior: "inmueble-A", viviendaNueva: "inmueble-B", municipio: "02001", categoria: "intensa", soporteClasificacion2024: "clasif-2024", soporteClasificacion2025: "clasif-2025", causa: "trabajo", soporteLaboral: "contrato-A", residenciaDesde: "2024-02-29", residenciaHasta: "2025-12-31", soporteResidencia: "padron-A", sinInterrupciones: true, seguimiento: "pendiente-hasta-2027-12-31", gastos: [{ id: "factura-A", pagador: "titular-A", fecha: "2024-02-29", importe: "80", soporte: "documento-A" }], otrosIncentivosMismoGasto: "ninguno" } }
}
function solicitud(h = origen()) {
  const raw = { solicitudes: [{ lote: "D51", codigo: "clm_traslado_vivienda_habitual", historiaTrasladoCLM: h, hechos: { fechaTraslado: h.traslado.fecha, categoria: h.traslado.categoria, causa: h.traslado.causa, exhaustividad: "completa" } }] }
  const r = Schema.decodeUnknownResult(SolicitudDeduccionesTerritoriales2025)(raw, { onExcessProperty: "error" })
  if (Result.isFailure(r)) throw new Error(String(r.failure))
  return r.success
}
type S = ReturnType<typeof solicitud>
const familia = { tipo: "individual" as const, edad: 40, discapacidad: { _tag: "SinDiscapacidad" as const }, descendientes: [], ascendientes: [] }
function clasico(s: S): CasoFiscalAnual { return { anio: 2025, comunidadAutonoma: "castilla-la-mancha", contribuyenteId: "titular-A", situacionFamiliar: familia, rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] }, reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0, deduccionesTerritoriales2025: s } }
function efectivo(s: S): CasoFiscalAnualExplicito {
  // Decodificación pública del anual hará la validación de las cadenas de hechos.
  return { ejercicio: 2025, comunidadAutonoma: "castilla-la-mancha", contribuyenteId: "titular-A", edad: 40, modalidad: "individual", residenciaTodoElAnio: true, devengo: "2025-12-31", otrasRentas: "ninguna", familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: s, rentasExtranjeras: "ninguna", especialidades: "ninguna", perfil: "solo-trabajo", conciliacion: { ejercicio: 2025, estado: "totales-anuales-sin-duplicados", procedencia: ["cert-A"] }, trabajo: { ...trabajo(2025, "30000"), territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna", rendimientos: trabajo(2025, "30000").rendimientos.map((r): GastosTrabajo["rendimientos"][number] => ({ ...r, clase: "empleo-laboral", cotizaciones: { ...r.cotizaciones, clase: "efectivas" }, sindicato: { ...r.sindicato, satisfecho: "no" }, colegio: { ...r.colegio, satisfecho: "no", obligatorio: "no", finesEsenciales: "no" }, defensa: { ...r.defensa, satisfecho: "no", litigioDirectoPagador: "no" } })) }, retenciones: [] }
}

export { origen, solicitud, clasico, efectivo }
