// Candidatura privada. Preparado, sin ejecución en fase ligera.
import { describe, expect, it } from "vitest"
import { Effect, Schema } from "effect"
import Decimal from "decimal.js"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { CensoIngresosIdentificados2025 } from "../lib/dominio/irpf/ingresos-identificados-2025/contrato"
import { prepararIngresosIdentificados2025 } from "../lib/dominio/irpf/ingresos-identificados-2025/productor"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import type { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { censoELA, casoCanonicoELA, casoEfectivoELA } from "./ela-ingreso-2025-fixtures"
function datos() {
 return Schema.decodeUnknownSync(CensoIngresosIdentificados2025)({
  ejercicio:2025, contribuyenteId:"A", ambito:"ayudas-publicas-no-transmision",exhaustividad:"completa",
  ayudas:[{ayudaId:"TAL1",beneficiario:"A",programa:"talidomida-rd574-2023-cobro2025",administracion:"imserso",clasificacionFiscal:"ganancia-patrimonial-no-transmision-no-exenta",
   expediente:{referencia:"EXP1",titular:"A",objeto:"ayuda-publica-RD574_2023-talidomida-1950_1985",cobrosPrevios:"ninguno"},
   resolucion:{referencia:"RES1",organismo:"Dirección General del Imserso",fecha:"2024-10-01",importeConcedido:"12000"},
   cobros:[{cobroId:"C1",beneficiario:"A",ordenante:"imserso",fecha:"2025-01-15",euros:"12000",justificante:"BANCO1"}]}],
 })
}
const solicitud:SolicitudDeduccionesTerritoriales2025={solicitudes:[{lote:"E38",nacimientoContribuyente:"1980-01-01",exhaustividad:"expediente_comun_completo_todos_pagadores",inversionesViviendaEjercicio:[],hechos:{codigo:"galicia_ayudas_talidomida",ingresoId:"TAL1"}}]}
const ambito={anio:2025,comunidadAutonoma:"galicia",contribuyenteId:"A",fallecimiento:false}
function ejecutar(api:"canonica"|"efectiva",c=datos(),s=solicitud) {
 return api==="canonica"
 ? Effect.runSync(liquidarIrpfAnual({...casoCanonicoELA(),comunidadAutonoma:"galicia",ingresosIdentificados2025:c,deduccionesTerritoriales2025:s},{modo:"canonico"}))
 : Effect.runSync(liquidarIrpfAnualExplicito({...casoEfectivoELA(),comunidadAutonoma:"galicia",ingresosIdentificados2025:c,deduccionesTerritoriales2025:s}))
}
function rechazo(api:"canonica"|"efectiva",c=datos(),s=solicitud) {
 return api==="canonica"
 ? Effect.runSync(Effect.flip(liquidarIrpfAnual({...casoCanonicoELA(),comunidadAutonoma:"galicia",ingresosIdentificados2025:c,deduccionesTerritoriales2025:s},{modo:"canonico"}))).motivo
 : Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito({...casoEfectivoELA(),comunidadAutonoma:"galicia",ingresosIdentificados2025:c,deduccionesTerritoriales2025:s}))).motivo
}
describe.each(["canonica","efectiva"] as const)("Talidomida Galicia2025 %s",api=>{
 it("oráculo Fraction independiente: ingreso, tipos tras mínimo y cuota única",()=>{
  const r=ejecutar(api)
  expect(r.libroIngresosIdentificados2025?.totalIntegradoGeneral).toEqual(racional("12000"))
  expect(r.libroIngresosIdentificados2025?.ingresos).toHaveLength(1)
  expect(r.libroIngresosIdentificados2025?.aceptacionFiscal).toBe("pendiente")
  expect(r.nodosFiscalesB2025?.tiposMediosGenerales).toMatchObject({baseLiquidableGeneral:"12000",cuotaGeneralEstatalArt63_1:"612.75",cuotaGeneralAutonomicaArt74_1:"558.99",estatal:"5.10",autonomico:"4.65"})
  expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(1)
  expect(r.deduccionesTerritoriales2025?.aplicaciones[0]).toMatchObject({generado:racional("1170"),aplicado:racional("558.99"),pendiente:racional("611.01")})
  if(r._tag==="LiquidacionIrpfAnualCalculada") expect(r.cuotaLiquidaCentimos).toBe(61275)
  else expect(r.cuotaLiquidaLegal).toBe("612.75")
 })
 it("omitir solicitud conserva ingreso sujeto y cuotas íntegras",()=>{
  const r=ejecutar(api,datos(),{solicitudes:[]})
  expect(r.libroIngresosIdentificados2025?.totalIntegradoGeneral).toEqual(racional("12000"))
  expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(0)
  if(r._tag==="LiquidacionIrpfAnualCalculada")expect(r.cuotaLiquidaCentimos).toBe(117174)
  else expect(r.cuotaLiquidaLegal).toBe("1171.74")
 })
 it("ID cruzada y solicitud repetida no crean deducción",()=>{
  expect(rechazo(api,datos(),{...solicitud,solicitudes:solicitud.solicitudes.map(x=>x.lote==="E38"?{...x,hechos:{codigo:"galicia_ayudas_talidomida",ingresoId:"AJENO"}}:x)})).toMatch(/expediente|ajeno/)
  expect(rechazo(api,datos(),{solicitudes:[...solicitud.solicitudes,...solicitud.solicitudes]})).toMatch(/duplicad/)
 })
 it.each(["2024-01-15","2026-01-15","2025-02-30"])("cobro fuera2025/civil %s",fecha=>{
  const c=datos();Object.defineProperty(c.ayudas[0]?.cobros[0],"fecha",{value:fecha})
  expect(rechazo(api,c)).toMatch(/Cobro|cerrado|Entrada incompleta/)
 })
 it.each(["beneficiario","ordenante","clasificacionFiscal","programa"])("rechaza hecho incompatible %s",campo=>{
  const c=datos(),a=c.ayudas[0]
  Object.defineProperty(campo==="ordenante"?a?.cobros[0]:a,campo,{value:campo==="clasificacionFiscal"?"exenta":"ajeno"})
  expect(rechazo(api,c)).toMatch(/Beneficiario|cerrado|Entrada incompleta/)
 })
 it("pago parcial, ausencia, y cobros duplicados requieren expediente adicional",()=>{
  for(const cobros of [[],[{...datos().ayudas[0]!.cobros[0]!,euros:"100"}],datos().ayudas[0]!.cobros.concat(datos().ayudas[0]!.cobros)]){
   const c=datos();Object.defineProperty(c.ayudas[0],"cobros",{value:cobros})
   expect(rechazo(api,c)).toMatch(/parcialidad|cerrado|Entrada incompleta/)
  }
 })
 it("campos fiscales externos no atraviesan ambas API",()=>{
  for(const campo of ["baseLiquidableAtribuida","tipoMedio","cuota","deduccion"]){
   const c=datos();Object.defineProperty(c,campo,{value:"10",enumerable:true})
   expect(rechazo(api,c)).toMatch(/cerrado|Entrada incompleta/)
  }
 })
 it("aislamiento frente a precisión global baja",()=>{
  const anterior=Decimal.precision
  try{Decimal.set({precision:5});expect(ejecutar(api).deduccionesTerritoriales2025?.aplicaciones[0]?.generado).toEqual(racional("1170"))}
  finally{Decimal.set({precision:anterior})}
 })
})
it("expediente ajeno, historia y territorio no se infieren de etiqueta",()=>{
 const c=datos(),a=c.ayudas[0]!
 if(a.programa!=="talidomida-rd574-2023-cobro2025")throw new Error("fixture")
 expect(prepararIngresosIdentificados2025({...c,ayudas:[{...a,expediente:{...a.expediente,titular:"B"}}]},ambito).estado).toBe("no_soportado")
 expect(prepararIngresosIdentificados2025(c,{...ambito,comunidadAutonoma:"asturias"}).estado).toBe("no_soportado")
 expect(prepararIngresosIdentificados2025(c,{...ambito,anio:2026}).estado).toBe("no_soportado")
 expect(prepararIngresosIdentificados2025(censoELA(),ambito).estado).toBe("no_soportado")
})
it("80 decimales son transporte interno; no importes externos",()=>{
 const c=datos();Object.defineProperty(c.ayudas[0]?.cobros[0],"euros",{value:"12000."+"1".repeat(80)})
 expect(prepararIngresosIdentificados2025(c,ambito).estado).toBe("no_soportado")
})
