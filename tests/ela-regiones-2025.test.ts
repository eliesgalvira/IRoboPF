// Preparación privada: NO ejecutado. Oráculos legales en ela-regiones-oraculos-2025.test.ts.
import { describe, expect, it } from "vitest"
import { Effect, Schema } from "effect"
import Decimal from "decimal.js"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { CensoIngresosIdentificados2025 } from "../lib/dominio/irpf/ingresos-identificados-2025/contrato"
import { prepararIngresosIdentificados2025 } from "../lib/dominio/irpf/ingresos-identificados-2025/productor"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { producirNodosFiscalesB2025 } from "../lib/dominio/irpf/deducciones/b-ampliado-anual-2025/productores"
import { DecimalIngreso2025 as D } from "../lib/dominio/irpf/ingresos-identificados-2025/productor"
import { censoELA, casoCanonicoELA, casoEfectivoELA } from "./ela-ingreso-2025-fixtures"
import type { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
const diagnostico={referencia:"DIAG1",fecha:"2025-01-01",emisor:"Hospital"}
function datos(region:"galicia"|"extremadura") {
 const gal=region==="galicia",a=censoELA().ayudas[0],euros=gal?"12000":"2000"
 const admin=gal?"xunta_galicia":"junta_extremadura"
 const c=Schema.decodeUnknownSync(CensoIngresosIdentificados2025)({...censoELA(),ayudas:[{...a,
 programa:gal?"galicia-bs215a-2025":"extremadura-ela-2025",administracion:admin,enfermedad:gal?"ELA_o_fenotipo":"ELA",
 resolucion:{...a.resolucion,organismo:gal?"Dirección General de Mayores y Atención Sociosanitaria":"Secretaría General de la Consejería de Salud y Servicios Sociales",importeConcedido:euros},cobros:[{...a.cobros[0],ordenante:admin,euros}]}]})
 const solicitud:SolicitudDeduccionesTerritoriales2025=gal?{solicitudes:[{lote:"E38",nacimientoContribuyente:"1980-01-01",exhaustividad:"expediente_comun_completo_todos_pagadores",inversionesViviendaEjercicio:[],hechos:{codigo:"galicia_ayudas_ela_fenotipos",ingresoId:"ELA1",diagnostico}}]}:{solicitudes:[{lote:"D51",codigo:"extremadura_ayudas_subvenciones_ela",hechos:{ingresoId:"ELA1",diagnostico,exhaustividad:"completa"}}]}
 return {c,solicitud,euros}
}
describe.each(["galicia","extremadura"] as const)("ELA regional %s",region=>{
 for(const api of ["canonica","efectiva"] as const)it(api+": integra con y sin selección regional",()=>{
  const {c,solicitud,euros}=datos(region)
  for(const seleccion of [solicitud,{solicitudes:[]}]){
   const r=api==="canonica"?Effect.runSync(liquidarIrpfAnual({...casoCanonicoELA(),comunidadAutonoma:region,ingresosIdentificados2025:c,deduccionesTerritoriales2025:seleccion},{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito({...casoEfectivoELA(),comunidadAutonoma:region,ingresosIdentificados2025:c,deduccionesTerritoriales2025:seleccion}))
   expect(r.libroIngresosIdentificados2025?.totalIntegradoGeneral).toEqual(racional(euros))
   expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(seleccion.solicitudes.length)
  }
 })
 it("rechaza región ajena",()=>{
  const {c}=datos(region)
  expect(prepararIngresosIdentificados2025(c,{anio:2025,comunidadAutonoma:"asturias",contribuyenteId:"A",fallecimiento:false}).estado).toBe("no_soportado")
 })
 it("sólo el cobro2025, sin anticipar concesión ni reclasificar por etiqueta",()=>{
  const {c}=datos(region),a=c.ayudas[0]
  const parcial=Schema.decodeUnknownSync(CensoIngresosIdentificados2025)({...c,ayudas:[{...a,cobros:[{...a.cobros[0],euros:"1000"}]}]})
  const r=prepararIngresosIdentificados2025(parcial,{anio:2025,comunidadAutonoma:region,contribuyenteId:"A",fallecimiento:false})
  if(region==="galicia")expect(r.estado).toBe("no_soportado")
  else {expect(r.estado).toBe("preparado");if(r.estado==="preparado")expect(r.preparacion.totalGeneral.toFixed()).toBe("1000")}
 })
})
it("oráculo racional de tipos después del mínimo; no marginal ni redondeo",()=>{
 // Cuotas internas sintéticas. No se presentan como escala legal de una región.
 const n=producirNodosFiscalesB2025("A",new D("20000"),new D("1561.5"),new D("1500"))
 expect(n.tiposMediosGenerales).toMatchObject({estatal:"7.80",autonomico:"7.50"})
 expect(producirNodosFiscalesB2025("A",new D("0"),new D("0"),new D("0")).tiposMediosGenerales).toBeUndefined()
})

for (const region of ["galicia", "extremadura"] as const) {
 for (const api of ["canonica", "efectiva"] as const) {
  it(region + api + ": Decimal global6 conserva cuota, generación y transporte80", () => {
   const precision = Decimal.precision
   try {
    Decimal.set({ precision: 6 })
    const { c, solicitud, euros } = datos(region)
    const r = api === "canonica"
     ? Effect.runSync(liquidarIrpfAnual({ ...casoCanonicoELA(), comunidadAutonoma: region, ingresosIdentificados2025: c, deduccionesTerritoriales2025: solicitud, rendimientos: { trabajo: [{ importeIntegroCentimos: 3300000 }] } }, { modo: "canonico" }))
     : Effect.runSync(liquidarIrpfAnualExplicito({ ...casoEfectivoELA(censoELA(), { solicitudes: [] }, "33000"), comunidadAutonoma: region, ingresosIdentificados2025: c, deduccionesTerritoriales2025: solicitud }))
    // Mismos anclajes Fraction ya fijados antes del motor, con Decimal global hostil.
    expect(r.libroIngresosIdentificados2025?.totalIntegradoGeneral).toEqual(racional(euros))
    expect(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado).toEqual(racional(region === "galicia" ? (api === "canonica" ? "2823.6" : "2904") : (api === "canonica" ? "409.2" : "424.8")))
    const importe = "123456789012345678." + "0".repeat(79) + "1"
    expect(new D(importe).plus("4000").minus("123456789012349678").toFixed()).toBe("0." + "0".repeat(79) + "1")
    expect(Decimal.precision).toBe(6)
   } finally {
    Decimal.set({ precision })
   }
  })
 }
}
