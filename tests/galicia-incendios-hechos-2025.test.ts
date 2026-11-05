// Expedientes VI100B; oráculo independiente en oraculos-incendios.json.
import { describe, expect, it } from "vitest"
import { Effect, Schema } from "effect"
import Decimal from "decimal.js"
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
describe.each(["canonica","efectiva"] as const)("VI100B clasificación %s",api=>{
 function resultado(c=datos(),s=vacia){return api==="canonica"?Effect.runSync(canonico(c,s)):Effect.runSync(efectivo(c,s))}
 function rechazo(c=datos(),s=vacia){return api==="canonica"?Effect.runSync(Effect.flip(canonico(c,s))).motivo:Effect.runSync(Effect.flip(efectivo(c,s))).motivo}
 it("cobro12000 y reparación15000: exclusión real, no renta íntegra ni deducción ficticia",()=>{
  const r=resultado(),libro=r.libroIngresosIdentificados2025
  expect(libro?.ingresos).toHaveLength(0)
  expect(libro?.totalIntegradoGeneral).toEqual(racional("0"))
  expect(libro?.ayudasNoIntegradas).toHaveLength(1)
  expect(libro?.ayudasNoIntegradas[0]).toMatchObject({ayudaId:"FIRE1",clasificacion:"no-integracion-DA5.3-reparacion",cobrado:racional("12000"),costeReparacion:racional("15000"),excluido:racional("12000")})
  expect(libro?.aceptacionFiscal).toBe("pendiente")
  expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(0)
  expect(r.nodosFiscalesB2025?.tiposMediosGenerales?.baseLiquidableGeneral).toBe("26056")
 })
 // Resolución VI100B2025, apartado20.3: último día de justificación15/12.
 it("admite justificación15 diciembre con hechos conciliados",()=>{
  const c=datos(),a=c.ayudas[0]
  if(a?.programa!=="galicia-vi100b-reparacion-2025")throw new Error("fixture")
  const frontera={...c,ayudas:[{...a,reparacion:{...a.reparacion,justificacion:{...a.reparacion.justificacion,fecha:"2025-12-15"}}}]}
  expect(resultado(frontera).libroIngresosIdentificados2025?.ayudasNoIntegradas[0]?.excluido).toEqual(racional("12000"))
 })
 it("rechaza justificación16 diciembre aunque el plazo declarado sea posterior",()=>{
  const c=datos(),a=c.ayudas[0]
  if(a?.programa!=="galicia-vi100b-reparacion-2025")throw new Error("fixture")
  const frontera={...c,ayudas:[{...a,reparacion:{...a.reparacion,justificacion:{...a.reparacion.justificacion,fecha:"2025-12-16"}}}]}
  expect(rechazo(frontera)).toMatch(/justificación fuera del plazo/)
 })
 it("mezclar VI100B y deportistas no evade el expediente único",()=>{
  const c=datos()
  const deportiva={ayudaId:"DEP-MEZCLA",beneficiario:"A",programa:"galicia-deportistas-resultados-2025",administracion:"xunta_galicia",convocatoria:{referencia:"CONV",emisor:"Xunta",fecha:"2025-01-01"},objeto:"ayuda_dineraria_desarrollo_deportivo",finalidad:"resultados_deportivos",relacionLaboral:"ninguna",contraprestacionServicios:"ninguna",ordenacionPorCuentaPropia:"ninguna",becaEstudios:"no",otrasExenciones:"ninguna",reconocimientoGallego:{titular:"A",condicion:"deportista_alto_nivel",referencia:"DEP",emisor:"Secretaría Xeral para o Deporte",fecha:"2025-01-01",vigenteHasta:"2025-12-31"},resolucion:{referencia:"RES-DEP",organismo:"Xunta",fecha:"2025-03-01",importeConcedido:"12000"},cobros:[{cobroId:"DEP-CO",beneficiario:"A",ordenante:"xunta_galicia",fecha:"2025-10-01",euros:"12000",justificante:"DEP-J"}]}
  for(const ayudas of [[...c.ayudas,deportiva],[deportiva,...c.ayudas]]){
   const entrada=Schema.decodeUnknownSync(CensoIngresosIdentificados2025)({...c,ayudas},{onExcessProperty:"error"})
   expect(rechazo(entrada)).toMatch(/sin mezclar otros programas|concurrencia de ayudas pendiente/)
  }
 })
 it("solicitar deducción de una ayuda no integrada no devuelve importe cero sustitutorio",()=>{
  expect(rechazo(datos(),solicitud)).toMatch(/no integración DA5.3.*sin importe sustitutorio/)
 })
 it.each(["2024-11-20","2026-11-20","2025-02-30"])("rechaza cobro %s",fecha=>{
  const c=datos();Object.defineProperty(c.ayudas[0]?.cobros[0],"fecha",{value:fecha});expect(rechazo(c)).toMatch(/cerrado|Entrada incompleta|cobro/)
 })
 it("no fabrica cobro2025 de resolución2026",()=>{
  const c=datos();Object.defineProperty(c.ayudas[0]?.resolucion,"fecha",{value:"2026-01-01"});expect(rechazo(c)).toMatch(/cerrado|Entrada incompleta/)
 })
 it.each(["clasificacionFiscal","partes","integradoBaseGeneral","baseLiquidableAtribuida","aceptado"])("rechaza decisión fiscal externa %s",campo=>{
  const c=datos();Object.defineProperty(c.ayudas[0],campo,{value:"exento",enumerable:true});expect(rechazo(c)).toMatch(/cerrado|Entrada incompleta/)
 })
 it("ausencia de cobro no produce clasificación fiscal",()=>{
  const c=datos();Object.defineProperty(c.ayudas[0],"cobros",{value:[]});expect(rechazo(c)).toMatch(/cerrado|Entrada incompleta/)
 })
 it("cobro parcial no sustituye historia del expediente",()=>{
  const c=datos();Object.defineProperty(c.ayudas[0]?.cobros[0],"euros",{value:"6000"});expect(rechazo(c)).toMatch(/íntegro/)
 })
 it("Decimal global5 no altera exclusión ni coste",()=>{
  const precision=Decimal.precision
  try{Decimal.set({precision:5});expect(resultado().libroIngresosIdentificados2025?.ayudasNoIntegradas[0]?.excluido).toEqual(racional("12000"))}finally{Decimal.set({precision})}
 })
})
it("identidades, recibos y exceso de ayuda no se corrigen con etiquetas",()=>{
 for(const campo of ["titular","pagador","receptor","fecha","importe"]){
  const c=datos(),a=c.ayudas[0]
  if(a?.programa!=="galicia-vi100b-reparacion-2025")throw new Error("fixture")
  const f=a.reparacion.facturas[0]!,p=f.pagos[0]!
  Object.defineProperty(campo==="titular"?a.inmueble:campo==="importe"?f:p,campo,{value:campo==="fecha"?"2025-02-30":campo==="importe"?"14999.99":"OTRO"})
  expect(prepararIngresosIdentificados2025(c,ambito).estado).toBe("no_soportado")
 }
})
it("destrucción, alquiler, otras coberturas y obra futura tienen productor pendiente",()=>{
 const cambios=["alcance","uso","fin","polizas","otrosConceptos"]
 for(const campo of cambios){
  const c=datos(),a=c.ayudas[0]
  if(a?.programa!=="galicia-vi100b-reparacion-2025")throw new Error("fixture")
  const doc={referencia:"OTRA",emisor:"OTRO",fecha:"2025-11-01"}
  if(campo==="alcance")Object.defineProperty(a.siniestro,campo,{value:"destruccion-total"})
  if(campo==="uso")Object.defineProperty(a.inmueble,campo,{value:"arrendamiento"})
  if(campo==="fin")Object.defineProperty(a.reparacion,campo,{value:"2026-10-01"})
  if(campo==="polizas")Object.defineProperty(a.coberturas,campo,{value:[doc]})
  if(campo==="otrosConceptos")Object.defineProperty(a.expediente,campo,{value:[doc]})
  expect(prepararIngresosIdentificados2025(c,ambito).estado).toBe("no_soportado")
 }
})
it("cuadrar pago por debajo de ayuda no presume exención del exceso",()=>{
 const c=datos(),a=c.ayudas[0]
 if(a?.programa!=="galicia-vi100b-reparacion-2025")throw new Error("fixture")
 const f=a.reparacion.facturas[0]!
 Object.defineProperty(f,"importe",{value:"10000"});Object.defineProperty(f.pagos[0],"euros",{value:"10000"})
 const r=prepararIngresosIdentificados2025(c,ambito)
 expect(r.estado).toBe("no_soportado");if(r.estado==="no_soportado")expect(r.motivo).toMatch(/superior al coste/)
})
it("80 decimales internos no amplían euros externos",()=>{
 const c=datos();Object.defineProperty(c.ayudas[0]?.cobros[0],"euros",{value:"12000."+"1".repeat(80)})
 expect(prepararIngresosIdentificados2025(c,ambito).estado).toBe("no_soportado")
})
