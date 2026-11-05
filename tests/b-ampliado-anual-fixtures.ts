import Decimal from "decimal.js"
import type { MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import type { DescendienteDerechos,TitularDescendiente } from "../lib/dominio/irpf/minimos/derechos-contrato"
import type { SolicitudBAmpliadoAnual } from "../lib/dominio/irpf/deducciones/b-ampliado-anual-2025"
const D=Decimal.clone({precision:220})
export const doc={referencia:"EXP",organismo:"Organismo del caso",fecha:"2025-01-01"}
export function marco(territorio:"asturias"|"cantabria"="asturias",titulares:readonly string[]=["s-1","s-3"]):MagnitudesTerritorialesAnuales {
 const d:DescendienteDerechos={sujetoId:"s-2",fechaNacimiento:"2015-01-01",edadDevengo:10,vivoAlDevengo:true,rentasNoExentasCentimos:0,declaracion:{modalidad:"no-presenta"},discapacidad:{_tag:"SinDiscapacidad"},titularesCompletos:true,titulares:Math.max(titulares.length,2)===3?["s-1","s-3","s-4"].map((titularId):TitularDescendiente=>({titularId,grado:2,vinculo:{clase:"consanguinidad"},relacion:"convivencia",custodia:"compartida",alimentosJudiciales:false,aplicaEspecialidadAlimentos:false,residenteIrpf:true,rentasNoExentasCentimos:2000000})):["s-1","s-3"].map((titularId):TitularDescendiente=>({titularId,grado:1,vinculo:{clase:"adopcion",fechaInicioIncremento:"2025-01-01",fundamento:"inscripcion-registro-civil",historialCompleto:true},relacion:titulares.includes(titularId)?"convivencia":"ninguna",custodia:titulares.includes(titularId)?"compartida":"sin-custodia",alimentosJudiciales:false,aplicaEspecialidadAlimentos:false,residenteIrpf:titulares.includes(titularId),rentasNoExentasCentimos:2000000}))}
 return {caso:{anio:2025,comunidadAutonoma:territorio,contribuyenteId:"s-1",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},derechosMinimos:{ejercicio:2025,territorio,regimen:"comun",modalidad:"individual",devengo:"2025-12-31",contribuyenteId:"s-1",edadContribuyenteDevengo:40,discapacidadContribuyente:{_tag:"SinDiscapacidad"},ascendientes:"ninguno",fallecimientosEnElEjercicio:"ninguno",descendientesCompletos:true,descendientes:[d]}},baseGeneral:new D("20000"),baseAhorro:new D("0"),minimoPersonalFamiliar:new D("10650"),cuotaAutonomica:new D("1000"),sujetosConMinimo:["s-2"],atribucionesMinimo:[{sujetoId:"s-2",titulares}]}
}
export function pago(euros="1000",id="P1",pagador="s-1"){return {id,pagador,receptor:"Proveedor",fecha:"2025-05-01",euros,documento:"FACTURA-"+id,medio:"transferencia" as const}}
export function persona(){return {id:"s-2",nacimiento:"2015-01-01",discapacidad:null,rentaNoExenta:"0",rentaBrutaIncluidasExentas:"0",declaracionRentas:null,convivencia:{inicio:"2025-01-01",fin:"2025-12-31"},centroEspecializado:null,dependenciaEconomica:[]}}
export function solicitudAdopcion(titulares:readonly string[]=["s-1","s-3"]):SolicitudBAmpliadoAnual {
 return {lote:"B-ampliado",hechos:{codigo:"asturias_adopcion_internacional",adopciones:[{id:"AD1",hijo:{...persona(),titulares,exhaustividad:"completa",parentesco:"adoptado",progenitores:["s-1","s-3"]},resolucion:{...doc,fecha:"2024-12-01"},registroCivil:doc,inscripcion:"necesaria",residenciaAnterior:"extranjero",residenciaAdoptantes:"espana",desplazamientoEspana:"2025-01-01",declaracionAdoptabilidad:{...doc,fecha:"2024-11-01"}}]}}
}
export function solicitudCelia(titulares:readonly string[]=["s-1","s-3","s-4"]):SolicitudBAmpliadoAnual {
 return {lote:"B-ampliado",hechos:{codigo:"asturias_enfermedad_celiaca",personas:[{id:"s-2",persona:persona(),relacion:"descendiente",reparto:{titulares,exhaustividad:"completa"},informe:doc,fechaDiagnostico:"2025-01-01",diagnostico:"definitivo",servicio:"SNS",identificadorMedico:"CNP",gastos:[pago("10")]}]}}
}
export const decimal=(s:string)=>new D(s)
