import type { CasoFiscalAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import type { HechosMaternidad2025 } from "../lib/dominio/irpf/maternidad-2025/contrato"
import { derechos81 } from "./maternidad-guarderia-fixtures"

import type { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
function murciaDerechos(nacimiento="2023-01-01", renta=2800000) { return {...derechos81(nacimiento, renta), territorio:"murcia" as const} }
export function clasica(h: HechosMaternidad2025 | undefined): CasoFiscalAnual {
 const base:CasoFiscalAnual={anio:2025,comunidadAutonoma:"murcia",contribuyenteId:"s-1",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:3000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0}
 // Sólo concilia la renta propia del contrato de mínimos; los esperados monetarios son independientes.
 const neto=2605600
 return {...base,derechosMinimos:murciaDerechos("2023-01-01",neto),maternidad2025:h}
}
type Empleo2025 = Extract<CasoFiscalAnualExplicito, { ejercicio: 2025; perfil: "solo-trabajo" }>
export function explicita(h: HechosMaternidad2025 | undefined): Empleo2025 {
 return {ejercicio:2025,comunidadAutonoma:"murcia",contribuyenteId:"s-1",edad:40,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"segun-derechos",derechosMinimos:murciaDerechos(),maternidad2025:h,discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:{solicitudes:[]},rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"empleo",clase:"empleo-laboral",integro:"30000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[]}
}

export function solicitudMurcia(h: HechosMaternidad2025): SolicitudAnualF2025 {
 const n=h.hijos[0]!
 return {lote:"F-ampliado",codigo:"murcia_gastos_guarderia",auxiliares:{referenciaCenso:"censo-murcia",censo:"completo_eventos_pagos_ayudas_todos_progenitores",conservacionFacturas:"plazo_prescripcion",estadoCivil:"no_casado",regimenPagos:"separados",miembrosUnidad:["s-1","s-2"],progenitores:[{hijo:n.id,convivientesDevengo:[h.beneficiaria],referencia:"padron"}],eventos:[],centros:n.centros.map(c=>({id:c.id,autorizacion:c.autorizacion.referencia,inscripcion:"registro-educacion-murcia",primerCiclo:[{desde:"2025-01-01",hasta:"2025-12-31"}]})),servicios:n.facturas.map(f=>({pagoId:f.pagos[0]!.id,periodo:{desde:n.calendario.find(m=>m.mes===f.mes)!.contratos[0]!.desde,hasta:n.calendario.find(m=>m.mes===f.mes)!.contratos[0]!.hasta}}))},hechos:{pagos:n.facturas.map(f=>({id:f.pagos[0]!.id,importeEUR:f.pagos[0]!.importe,ayudasEUR:"0",concepto:f.concepto==="asistencia"?"custodia":f.concepto,beneficiarioId:n.id,objetoId:f.centro,fecha:f.pagos[0]!.fecha,pagador:h.beneficiaria,factura:f.id,soportePago:"transferencia",atribucion:"propia_separada"}))}}
}
