import {Schema} from "effect"
import {fixture as rioja} from "./dt18-rioja-fixture"
import {SolicitudDeduccionesTerritoriales2025} from "../lib/dominio/irpf/deducciones/anual-territorial-esquemas"
import type {CasoFiscalAnual} from "../lib/dominio/irpf/caso-fiscal-anual"
export function canonico(comunidad:CasoFiscalAnual["comunidadAutonoma"]="murcia"):CasoFiscalAnual{return{anio:2025,comunidadAutonoma:comunidad,contribuyenteId:"A",situacionFamiliar:{tipo:"individual",edad:35,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:10000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0}}
export function efectivo(s:SolicitudDeduccionesTerritoriales2025){return{ejercicio:2025,comunidadAutonoma:"murcia",contribuyenteId:"A",edad:35,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s,rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"R",clase:"empleo-laboral",integro:"100000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[]} as const}

export function fixture(){
 const original=structuredClone(rioja(["adquisicion"])),h=original.viviendaDT182025!
 for(const p of h.proyectos)Object.assign(p.vivienda,{municipio:"Murcia",municipioHabitual:"Murcia",inmueble:{...p.vivienda.inmueble,territorio:"murcia"}})
 return Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({viviendaDT182025:h,solicitudes:[{lote:"F-ampliado",codigo:"murcia_regimen_transitorio_inversion_vivienda_habitual",hechos:{ramaTransitoria:"estatal_pre2013"}}]},{onExcessProperty:"error"})
}
