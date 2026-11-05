// Preparación ligera; no ejecutado. Oráculo independiente: oraculos-incendios.json.
import { describe, expect, it } from "vitest"
import { Effect, Schema } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { CensoIngresosIdentificados2025 } from "../lib/dominio/irpf/ingresos-identificados-2025/contrato"
import { prepararIngresosIdentificados2025 } from "../lib/dominio/irpf/ingresos-identificados-2025/productor"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { casoCanonicoELA, casoEfectivoELA } from "./ela-ingreso-2025-fixtures"
import type { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
function datos() {
 return Schema.decodeUnknownSync(CensoIngresosIdentificados2025)({
  ejercicio:2025,contribuyenteId:"A",ambito:"ayudas-publicas-no-transmision",exhaustividad:"completa",ayudas:[{
   ayudaId:"FIRE1",beneficiario:"A",programa:"galicia-vi100b-reparacion-2025",administracion:"igvs",
   resolucion:{referencia:"RES1",organismo:"Dirección General del IGVS",fecha:"2025-09-15",notificacion:"2025-09-16",plazoJustificacion:"2025-12-20",importeConcedido:"12000",concepto:"reparacion-vivienda-sin-ruina"},
   cobros:[{cobroId:"CO1",beneficiario:"A",ordenante:"igvs",fecha:"2025-11-20",euros:"12000",justificante:"JCO1"}],
   inmueble:{id:"INM1",referenciaCatastral:"CAT1",titular:"A",derecho:"pleno-dominio-exclusivo",territorio:"galicia",uso:"vivienda-habitual-propia-no-arrendada",adquisicion:"2020-01-01",soporteTitularidad:{referencia:"ESCR1",emisor:"Registro",fecha:"2025-09-01"}},
   siniestro:{fecha:"2025-08-15",causa:"incendio-forestal",informe:{referencia:"INF1",emisor:"Técnico",fecha:"2025-09-01"},alcance:"danos-parciales-reparables-sin-destruccion",situacionPrevia:"habitable-sin-ruina-ni-abandono"},
   reparacion:{inicio:"2025-09-01",fin:"2025-10-15",certificadoFin:{referencia:"FIN1",emisor:"Técnico",fecha:"2025-10-16"},justificacion:{referencia:"REG1",emisor:"Registro IGVS",fecha:"2025-11-01"},facturas:[{id:"FAC1",inmuebleId:"INM1",destinatario:"A",emisor:"CONTRATA1",fecha:"2025-10-15",concepto:"reparacion-danos-mismo-incendio-sin-mejora",importe:"15000",pagos:[{id:"PA1",pagador:"A",receptor:"CONTRATA1",fecha:"2025-10-20",euros:"15000",justificante:"JPA1"}]}]},
   coberturas:{exhaustividad:"todas-polizas-indemnizaciones-y-ayudas-del-dano",polizas:[],indemnizaciones:[],otrasAyudas:[]},expediente:{referencia:"EXP1",exhaustividad:"todas-facturas-pagos-y-cobros-del-expediente",otrosConceptos:[]},
  }]})
}
const vacia:SolicitudDeduccionesTerritoriales2025={solicitudes:[]}
const solicitud:SolicitudDeduccionesTerritoriales2025={solicitudes:[{lote:"E38",nacimientoContribuyente:"1980-01-01",exhaustividad:"expediente_comun_completo_todos_pagadores",inversionesViviendaEjercicio:[],hechos:{codigo:"galicia_ayudas_incendios_peifoga_2025",ingresoId:"FIRE1"}}]}
const ambito={anio:2025,comunidadAutonoma:"galicia",contribuyenteId:"A",fallecimiento:false}
function canonico(c=datos(),s=vacia){return liquidarIrpfAnual({...casoCanonicoELA(),comunidadAutonoma:"galicia",ingresosIdentificados2025:c,deduccionesTerritoriales2025:s,rendimientos:{trabajo:[{importeIntegroCentimos:3000000}]}},{modo:"canonico"})}
function efectivo(c=datos(),s=vacia){return liquidarIrpfAnualExplicito({...casoEfectivoELA(),comunidadAutonoma:"galicia",ingresosIdentificados2025:c,deduccionesTerritoriales2025:s,trabajo:{...casoEfectivoELA().trabajo,rendimientos:casoEfectivoELA().trabajo.rendimientos.map(r=>({...r,clase:"empleo-laboral" as const,integro:"30000",cotizaciones:{...r.cotizaciones,seguridadSocial:"1944"}}))}})}

// Preparación de fixture por valor del autor; matriz, adversos y esperados nuevos.
function ayuda(c=datos()) {
 const a=c.ayudas[0]
 if(a?.programa!=="galicia-vi100b-reparacion-2025")throw new Error("fixture VI100B")
 return a
}
const matriz=[
 ["0.01","0.01"],["0.01","0.02"],["12000","15000"],["132000","132000"],
 ["132000","999999999999.99"],["999.99","1000"],["12000.01","15000.02"],
] as const
for(const api of ["canonica","efectiva"] as const){
 describe("Revisión independiente "+api,()=>{
  function ejecutar(c=datos(),ded=vacia){return api==="canonica"?Effect.runSync(canonico(c,ded)):Effect.runSync(efectivo(c,ded))}
  it.each(matriz)("ayuda %s / coste %s: no integración íntegra sin pérdida ni deducción",(cobro,coste)=>{
   const c=datos(),a=ayuda(c),f=a.reparacion.facturas[0]!
   Object.defineProperty(a.resolucion,"importeConcedido",{value:cobro,enumerable:true,configurable:true});Object.defineProperty(a.cobros[0]!,"euros",{value:cobro,enumerable:true,configurable:true})
   Object.defineProperty(f,"importe",{value:coste,enumerable:true,configurable:true});Object.defineProperty(f.pagos[0]!,"euros",{value:coste,enumerable:true,configurable:true})
   const r=ejecutar(c),b=r.libroIngresosIdentificados2025
   expect(b?.ayudasNoIntegradas[0]?.excluido).toEqual(racional(cobro))
   expect(b?.ayudasNoIntegradas[0]?.costeReparacion).toEqual(racional(coste))
   expect(b?.totalIntegradoGeneral).toEqual(racional("0"));expect(b?.ingresos).toHaveLength(0)
   expect(r.nodosFiscalesB2025?.tiposMediosGenerales?.baseLiquidableGeneral).toBe("26056")
   expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(0)
  })
  it("fraccionar cobro/factura/pago conserva el libro y las magnitudes fiscales",()=>{
   const base=ejecutar(),c=datos(),a=ayuda(c),f=a.reparacion.facturas[0]!,p=f.pagos[0]!,co=a.cobros[0]!
   Object.defineProperty(a,"cobros",{value:[{...co,euros:"6000.01"},{...co,cobroId:"CO2",justificante:"JCO2",euros:"5999.99"}],enumerable:true,configurable:true})
   Object.defineProperty(f,"pagos",{value:[{...p,euros:"0.01"},{...p,id:"PA2",justificante:"JP2",euros:"14999.99"}],enumerable:true,configurable:true})
   const r=ejecutar(c)
   expect(r.nodosFiscalesB2025).toEqual(base.nodosFiscalesB2025)
   expect(r.libroIngresosIdentificados2025?.ayudasNoIntegradas[0]?.excluido).toEqual(racional("12000"))
  })
  it("sin expediente propio no puede usar otro ingreso para deducir",()=>{
   const s=structuredClone(solicitud);Object.defineProperty(s.solicitudes[0]!.hechos,"ingresoId",{value:"OTRO",enumerable:true,configurable:true})
   const r=api==="canonica"?Effect.runSync(Effect.flip(canonico(datos(),s))):Effect.runSync(Effect.flip(efectivo(datos(),s)))
   expect(r.motivo).toMatch(/falta expediente clasificado propio/)
  })
 })
}
const adversos=["pago-duplicado","cobro-duplicado","factura-duplicada","justificante-cruzado","titular-ajeno","beneficiario-ajeno","sin-exhaustividad","otra-ayuda","indemnizacion","daño-personal","menaje","destruccion","arrendada","actividad","futura","cobro-parcial","exceso-coste","limite","mezcla","dos-expedientes","fiscal-externo"]
it.each(adversos)("cierre factual: %s",modo=>{
 const c=datos(),a=ayuda(c),f=a.reparacion.facturas[0]!,p=f.pagos[0]!,co=a.cobros[0]!,doc={referencia:"D",emisor:"E",fecha:"2025-09-20"}
 if(modo==="pago-duplicado")Object.defineProperty(f,"pagos",{value:[p,p],enumerable:true,configurable:true})
 if(modo==="cobro-duplicado")Object.defineProperty(a,"cobros",{value:[co,co],enumerable:true,configurable:true})
 if(modo==="factura-duplicada")Object.defineProperty(a.reparacion,"facturas",{value:[f,f],enumerable:true,configurable:true})
 if(modo==="justificante-cruzado")Object.defineProperty(p,"justificante",{value:co.justificante,enumerable:true,configurable:true})
 if(modo==="titular-ajeno")Object.defineProperty(a.inmueble,"titular",{value:"B",enumerable:true,configurable:true})
 if(modo==="beneficiario-ajeno")Object.defineProperty(co,"beneficiario",{value:"B",enumerable:true,configurable:true})
 if(modo==="sin-exhaustividad")Object.defineProperty(a.coberturas,"exhaustividad",{value:"desconocida",enumerable:true,configurable:true})
 if(modo==="otra-ayuda")Object.defineProperty(a.coberturas,"otrasAyudas",{value:[doc],enumerable:true,configurable:true})
 if(modo==="indemnizacion")Object.defineProperty(a.coberturas,"indemnizaciones",{value:[doc],enumerable:true,configurable:true})
 if(modo==="daño-personal")Object.defineProperty(a.resolucion,"concepto",{value:"hospitalizacion",enumerable:true,configurable:true})
 if(modo==="menaje")Object.defineProperty(f,"concepto",{value:"menaje",enumerable:true,configurable:true})
 if(modo==="destruccion")Object.defineProperty(a.siniestro,"alcance",{value:"destruccion-total",enumerable:true,configurable:true})
 if(modo==="arrendada")Object.defineProperty(a.inmueble,"uso",{value:"arrendada",enumerable:true,configurable:true})
 if(modo==="actividad")Object.defineProperty(a.inmueble,"uso",{value:"actividad-economica",enumerable:true,configurable:true})
 if(modo==="futura")Object.defineProperty(a.reparacion,"fin",{value:"2026-01-01",enumerable:true,configurable:true})
 if(modo==="cobro-parcial")Object.defineProperty(co,"euros",{value:"6000",enumerable:true,configurable:true})
 if(modo==="exceso-coste"){Object.defineProperty(f,"importe",{value:"11999.99",enumerable:true,configurable:true});Object.defineProperty(p,"euros",{value:"11999.99",enumerable:true,configurable:true})}
 if(modo==="limite"){Object.defineProperty(co,"euros",{value:"132000.01",enumerable:true,configurable:true});Object.defineProperty(a.resolucion,"importeConcedido",{value:"132000.01",enumerable:true,configurable:true});Object.defineProperty(f,"importe",{value:"132000.01",enumerable:true,configurable:true});Object.defineProperty(p,"euros",{value:"132000.01",enumerable:true,configurable:true})}
 if(modo==="mezcla"){Object.defineProperty(c,"ayudas",{value:[a,{programa:"talidomida-rd574-2023-cobro2025"}],enumerable:true,configurable:true})}
 if(modo==="dos-expedientes")Object.defineProperty(c,"ayudas",{value:[a,{...a,ayudaId:"OTRA",resolucion:{...a.resolucion,referencia:"RES2"}}],enumerable:true,configurable:true})
 if(modo==="fiscal-externo")Object.defineProperty(a,"perdidaFiscal",{value:"3000",enumerable:true,configurable:true})
 expect(prepararIngresosIdentificados2025(c,ambito).estado).toBe("no_soportado")
})

function conAutopago(){
 const c=datos(),a=ayuda(c),f=a.reparacion.facturas[0]!,p=f.pagos[0]!
 Object.defineProperty(a.reparacion,"facturas",{value:[
  {...f,importe:"10000",pagos:[{...p,euros:"10000"}]},
  {...f,id:"AUTOFAC",emisor:"A",importe:"5000",pagos:[{...p,id:"AUTOPA",receptor:"A",euros:"5000",justificante:"TRANSFERENCIA-ENTRE-CUENTAS-PROPIAS"}]},
 ],enumerable:true,configurable:true})
 return c
}
for(const api of ["canonica","efectiva"] as const){
 it("R1 autopago no es coste de reparación pagado a tercero / "+api,()=>{
  const c=conAutopago()
  const r=api==="canonica"?Effect.runSync(Effect.match(canonico(c),{onFailure:()=>"rechazado",onSuccess:()=>"aceptado"})):Effect.runSync(Effect.match(efectivo(c),{onFailure:()=>"rechazado",onSuccess:()=>"aceptado"}))
  expect(r).toBe("rechazado")
 })
}
it("R2 justificación 20 diciembre no cierra VI100B anualidad2025 (20.3)",()=>{
 const c=datos(),a=ayuda(c)
 Object.defineProperty(a.resolucion,"plazoJustificacion",{value:"2025-12-31",enumerable:true,configurable:true})
 Object.defineProperty(a.reparacion.justificacion,"fecha",{value:"2025-12-20",enumerable:true,configurable:true})
 // Cobro anticipado anterior; facturas/pagos reales y fechas civiles válidas.
 expect(prepararIngresosIdentificados2025(c,ambito).estado).toBe("no_soportado")
})
