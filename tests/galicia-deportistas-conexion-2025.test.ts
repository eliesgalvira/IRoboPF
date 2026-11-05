// Casos de conexión anual del expediente deportivo gallego.
import { describe, expect, it } from "vitest"
import { Effect, Schema } from "effect"
import { CensoIngresosIdentificados2025 } from "../lib/dominio/irpf/ingresos-identificados-2025/contrato"
import { prepararIngresosIdentificados2025 } from "../lib/dominio/irpf/ingresos-identificados-2025/productor"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { censoELA, casoCanonicoELA, casoEfectivoELA } from "./ela-ingreso-2025-fixtures"
import type { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
function censo(): CensoIngresosIdentificados2025 {
 return {ejercicio:2025,contribuyenteId:"A",ambito:"ayudas-publicas-no-transmision",exhaustividad:"completa",ayudas:[{
  ayudaId:"DEP1",beneficiario:"A",programa:"galicia-deportistas-resultados-2025",administracion:"xunta_galicia",
  convocatoria:{referencia:"BASES",emisor:"Xunta",fecha:"2025-01-01"},objeto:"ayuda_dineraria_desarrollo_deportivo",
  finalidad:"resultados_deportivos",relacionLaboral:"ninguna",contraprestacionServicios:"ninguna",ordenacionPorCuentaPropia:"ninguna",becaEstudios:"no",otrasExenciones:"ninguna",
  reconocimientoGallego:{titular:"A",condicion:"deportista_alto_nivel",referencia:"DGAN",emisor:"Secretaría Xeral para o Deporte",fecha:"2025-01-01",vigenteHasta:"2025-12-31"},
  resolucion:{referencia:"RES-DEP",organismo:"Xunta",fecha:"2025-09-01",importeConcedido:"12000"},
  cobros:[{cobroId:"C-DEP",beneficiario:"A",ordenante:"xunta_galicia",fecha:"2025-10-01",euros:"12000",justificante:"JUST-DEP"}]
 }]}
}
const solicitud:SolicitudDeduccionesTerritoriales2025={solicitudes:[{lote:"E38",nacimientoContribuyente:"1980-01-01",exhaustividad:"expediente_comun_completo_todos_pagadores",inversionesViviendaEjercicio:[],hechos:{codigo:"galicia_ayudas_deportistas_alto_nivel",ingresoId:"DEP1"}}]}
const ambito={anio:2025,comunidadAutonoma:"galicia",contribuyenteId:"A",fallecimiento:false}
it("deriva clasificación y exención0 de hechos, no acepta etiqueta fiscal del cliente",()=>{
 const c=censo(),p=prepararIngresosIdentificados2025(c,ambito)
 expect(p.estado).toBe("preparado")
 if(p.estado==="preparado")expect(p.preparacion.totalGeneral.toFixed()).toBe("12000")
 expect(()=>Schema.decodeUnknownSync(CensoIngresosIdentificados2025)({...c,ayudas:[{...c.ayudas[0],clasificacionFiscal:"ganancia-patrimonial-no-transmision-no-exenta"}]},{onExcessProperty:"error"})).toThrow()
})
for(const [campo,valor] of [["finalidad","formacion_tecnificacion"],["relacionLaboral","existente"],["contraprestacionServicios","existente"],["ordenacionPorCuentaPropia","existente"],["becaEstudios","si"],["otrasExenciones","requiere_estudio"]])it("rechaza sólo rama sin productor: "+campo,()=>{
 const c=censo();const a={...c.ayudas[0],[campo]:valor}
 const entrada=Schema.decodeUnknownSync(CensoIngresosIdentificados2025)({...c,ayudas:[a]})
 expect(prepararIngresosIdentificados2025(entrada,ambito).estado).toBe("no_soportado")
})
it("rechaza parcialidad, duplicados, identidad y cronología",()=>{
 const c=censo(),a=c.ayudas[0]!
 for(const mod of [{...a,cobros:[{...a.cobros[0],euros:"1"}]},{...a,beneficiario:"B"},{...a,cobros:[a.cobros[0],a.cobros[0]]},{...a,cobros:[{...a.cobros[0],fecha:"2025-02-30"}]}]){
  const entrada=Schema.decodeUnknownSync(CensoIngresosIdentificados2025)({...c,ayudas:[mod]})
  expect(prepararIngresosIdentificados2025(entrada,ambito).estado).toBe("no_soportado")
 }
 expect(prepararIngresosIdentificados2025({...c,ayudas:[...c.ayudas,...c.ayudas]},ambito).estado).toBe("no_soportado")
})
describe.each(["canonica","efectiva"] as const)("API %s",api=>{
 it("integra una sola vez, con y sin deducción; mismo oráculo monetario ELA12000",()=>{
  for(const seleccion of [solicitud,{solicitudes:[]}]){
   const r=api==="canonica"
    ?Effect.runSync(liquidarIrpfAnual({...casoCanonicoELA(),comunidadAutonoma:"galicia",ingresosIdentificados2025:censo(),deduccionesTerritoriales2025:seleccion,rendimientos:{trabajo:[{importeIntegroCentimos:3300000}]}},{modo:"canonico"}))
    :Effect.runSync(liquidarIrpfAnualExplicito({...casoEfectivoELA(censoELA(),{solicitudes:[]},"33000"),comunidadAutonoma:"galicia",ingresosIdentificados2025:censo(),deduccionesTerritoriales2025:seleccion}))
   expect(r.libroIngresosIdentificados2025?.ingresos).toHaveLength(1)
   expect(r.libroIngresosIdentificados2025?.totalIntegradoGeneral).toEqual(racional("12000"))
   expect(r.libroIngresosIdentificados2025?.ingresos[0]?.fiscalidadDeportiva).toMatchObject({exento:"0",limiteArt7m:"60100"})
   if(seleccion.solicitudes.length > 0)expect(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado).toEqual(racional(api==="canonica"?"2823.6":"2904"))
   else expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(0)
  }
 })
 it("ingresoId ajeno falla sin atribución manual",()=>{
  const mala:SolicitudDeduccionesTerritoriales2025={solicitudes:[{lote:"E38",nacimientoContribuyente:"1980-01-01",exhaustividad:"expediente_comun_completo_todos_pagadores",inversionesViviendaEjercicio:[],hechos:{codigo:"galicia_ayudas_deportistas_alto_nivel",ingresoId:"AJENO"}}]}
  const ejecutar=()=>api==="canonica"
   ?Effect.runSync(liquidarIrpfAnual({...casoCanonicoELA(),comunidadAutonoma:"galicia",ingresosIdentificados2025:censo(),deduccionesTerritoriales2025:mala},{modo:"canonico"}))
   :Effect.runSync(liquidarIrpfAnualExplicito({...casoEfectivoELA(),comunidadAutonoma:"galicia",ingresosIdentificados2025:censo(),deduccionesTerritoriales2025:mala}))
  expect(ejecutar).toThrow()
 })
})
