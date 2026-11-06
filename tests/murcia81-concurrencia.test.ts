import { Effect } from "effect"
import Decimal from "decimal.js"
import { expect, it } from "vitest"
import { hechos81 } from "./maternidad-guarderia-fixtures"
import { clasica, explicita, solicitudMurcia } from "./murcia81-api.fixtures"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import type { HechosMaternidad2025 } from "../lib/dominio/irpf/maternidad-2025/contrato"

function hechos(meses=12, centimos=120000): HechosMaternidad2025 {
 const h=hechos81(meses,centimos)
 return {...h,hijos:h.hijos.map(n=>({...n,centros:n.centros.map(c=>({...c,clase:"centro_educacion_infantil" as const,municipio:"30030",autorizacion:{...c.autorizacion,clase:"educativa" as const,referencia:"autorizacion-educacion-murcia"},registroCyl:{estado:"no_consta" as const}}))}))}
}
for (const api of ["clasica","explicita"] as const) {
 for (const [meses,gasto,regional,incremento] of [[12,120000,"240","1000"],[6,150000,"300","500"],[12,600000,"1000","1000"],[12,1200,"2.4","12"],[12,10001,"20.002","100.01"]] as const) {
  it(`MURCIA81_LIBRO_UNICO ${api} ${meses}/${gasto}`,()=>{
   const h=hechos(meses,gasto),s=solicitudMurcia(h)
   const a=api==="clasica"?Effect.runSync(liquidarIrpfAnual({...clasica(h),deduccionesTerritoriales2025:{solicitudes:[s]}},{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito({...explicita(h),deduccionesTerritoriales2025:{solicitudes:[s]}}))
   const b=api==="clasica"?Effect.runSync(liquidarIrpfAnual({...clasica(h),deduccionesTerritoriales2025:{solicitudes:[s]}},{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito({...explicita(h),deduccionesTerritoriales2025:{solicitudes:[s]}}))
   expect(a).toEqual(b)
   expect(a.deduccionesTerritoriales2025?.total).toEqual(racional(regional))
   expect(a.maternidad2025?.incremento).toEqual(racional(incremento))
   expect(a.rastro.pasos.filter(p=>p.titulo==="Maternidad y custodia en guardería (art.81)")).toHaveLength(1)
  })
 }
 it(`${api}: ayudas, exención y vestuario sólo regional`,()=>{
  const h=hechos(1,10000),n=h.hijos[0]!,f=n.facturas[0]!
  const conAyuda={...h,hijos:[{...n,facturas:[{...f,pagosEmpresa:[{id:"empresa-pago",fecha:"2025-01-31",empresa:"empresa1",empleado:"s-1",importe:"50",forma:"contratacion_directa_custodia" as const,contratoServicio:"contrato-empresa",nomina:"nomina"}]}],ayudas:[{id:"beca",fechaCobro:"2025-01-31",beneficiario:"s-1",programa:"ordinaria" as const,atribucion:"nominal" as const,importe:"20",facturas:[{id:f.id,importe:"20"}]}]}]}
  const s=solicitudMurcia(conAyuda),p=s.hechos.pagos![0]!,aux=s.auxiliares!
  const seleccion={...s,hechos:{pagos:[{...p,ayudasEUR:"20"},{...p,id:"vestuario",factura:"factura-vestuario",importeEUR:"100",concepto:"vestuario_exclusivo_escolar"}]},auxiliares:{...aux,servicios:[...aux.servicios,{...aux.servicios[0]!,pagoId:"vestuario"}]}}
  const r=api==="clasica"?Effect.runSync(liquidarIrpfAnual({...clasica(conAyuda),deduccionesTerritoriales2025:{solicitudes:[seleccion]}},{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito({...explicita(conAyuda),deduccionesTerritoriales2025:{solicitudes:[seleccion]}}))
  expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("36"))
  expect(r.maternidad2025?.incremento).toEqual(racional("80"))
 })
 it(`${api}: contradicciones e ID repetido conservan rechazo`,()=>{
  const h=hechos(),s=solicitudMurcia(h),p=s.hechos.pagos![0]!
  for(const delta of [{beneficiarioId:"ajeno"},{objetoId:"otro-centro"},{factura:"otra-factura"},{id:"otro-pago"},{pagador:"s-3"},{importeEUR:"99"},{ayudasEUR:"1"},{concepto:"matricula"},{fecha:"2025-01-30"}]) {
   const seleccion={...s,hechos:{pagos:[{...p,...delta},...s.hechos.pagos!.slice(1)]}}
   const e=api==="clasica"?Effect.runSync(Effect.flip(liquidarIrpfAnual({...clasica(h),deduccionesTerritoriales2025:{solicitudes:[seleccion]}},{modo:"canonico"}))):Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito({...explicita(h),deduccionesTerritoriales2025:{solicitudes:[seleccion]}})))
   expect(e._tag).toBe("ResultadoNoSoportado")
  }
  for(const solicitudes of [[s,s],[s,{...s,codigo:"murcia_material_escolar_libros_texto" as const}]]) {
   const e=api==="clasica"?Effect.runSync(Effect.flip(liquidarIrpfAnual({...clasica(h),deduccionesTerritoriales2025:{solicitudes}},{modo:"canonico"}))):Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito({...explicita(h),deduccionesTerritoriales2025:{solicitudes} })))
   expect(e._tag).toBe("ResultadoNoSoportado")
  }
 })
 it(`${api}: cuota agotada mantiene diferencial estatal`,()=>{
  const h=hechos(),s=solicitudMurcia(h)
  if(api==="clasica") {
   const c=clasica(h),d=c.derechosMinimos!
   const r=Effect.runSync(liquidarIrpfAnual({...c,rendimientos:{trabajo:[{importeIntegroCentimos:0}]},derechosMinimos:{...d,descendientes:d.descendientes.map(x=>({...x,titulares:x.titulares.map(t=>({...t,rentasNoExentasCentimos:0}))}))},deduccionesTerritoriales2025:{solicitudes:[s]}},{modo:"canonico"}))
   expect(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado).toEqual(racional("240"));expect(r.deduccionesTerritoriales2025?.aplicaciones[0]?.aplicado).toEqual(racional("0"));expect(r.cuotaLiquidaCentimos).toBe(0);expect(r.cuotaDiferencialCentimos).toBe(-220000)
  } else {
   const c=explicita(h),d=c.derechosMinimos!
   const r=Effect.runSync(liquidarIrpfAnualExplicito({...c,derechosMinimos:{...d,descendientes:d.descendientes.map(x=>({...x,titulares:x.titulares.map(t=>({...t,rentasNoExentasCentimos:0}))}))},trabajo:{...c.trabajo,rendimientos:c.trabajo.rendimientos.map(x=>({...x,integro:"0"}))},deduccionesTerritoriales2025:{solicitudes:[s]}}))
   expect(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado).toEqual(racional("240"));expect(r.deduccionesTerritoriales2025?.aplicaciones[0]?.aplicado).toEqual(racional("0"));expect(new Decimal(r.cuotaLiquidaLegal).toFixed()).toBe("0");expect(new Decimal(r.cuotaDiferencial).toFixed()).toBe("-2200")
  }
 })
}

for (const api of ["clasica","explicita"] as const) {
 it(`${api}: período incompleto no reduce base regional ni crea mes completo81`,()=>{
  const h=hechos(1,10000),n=h.hijos[0]!
  const parcial={...h,hijos:[{...n,calendario:n.calendario.map(m=>({...m,contratos:m.contratos.map(c=>({...c,desde:"2025-01-02"}))}))}]}
  const s=solicitudMurcia(parcial)
  const r=api==="clasica"?Effect.runSync(liquidarIrpfAnual({...clasica(parcial),deduccionesTerritoriales2025:{solicitudes:[s]}},{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito({...explicita(parcial),deduccionesTerritoriales2025:{solicitudes:[s]}}))
  expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("20"))
  expect(r.maternidad2025?.incremento).toEqual(racional("0"))
 })
 it(`${api}: autorización, período, gananciales y repetición interna no se admiten`,()=>{
  const h=hechos(),s=solicitudMurcia(h),a=s.auxiliares!,p=s.hechos.pagos![0]!
  const variantes=[
   {...s,auxiliares:{...a,regimenPagos:"gananciales" as const}},
   {...s,auxiliares:{...a,centros:a.centros.map(c=>({...c,autorizacion:"contradictoria"}))}},
   {...s,auxiliares:{...a,servicios:a.servicios.map(x=>({...x,periodo:{...x.periodo,desde:"2025-01-02"}}))}},
   {...s,hechos:{pagos:[...s.hechos.pagos!,p]}},
  ]
  for(const v of variantes) {
   const e=api==="clasica"?Effect.runSync(Effect.flip(liquidarIrpfAnual({...clasica(h),deduccionesTerritoriales2025:{solicitudes:[v]}},{modo:"canonico"}))):Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito({...explicita(h),deduccionesTerritoriales2025:{solicitudes:[v]}})))
   expect(e._tag).toBe("ResultadoNoSoportado")
  }
 })
 it(`${api}: otra persona con mínimo no se infiere sin derecho por no pagar`,()=>{
  const h=hechos(),n=h.hijos[0]!,madre=n.progenitores[0]!
  const dos={...h,hijos:[{...n,progenitores:[madre,{...madre,id:"s-3",papel:"padre_biologico" as const}]}]}
  const s=solicitudMurcia(dos)
  if(api==="clasica") {
   const c=clasica(dos),d=c.derechosMinimos!
   const e=Effect.runSync(Effect.flip(liquidarIrpfAnual({...c,derechosMinimos:{...d,descendientes:d.descendientes.map(x=>({...x,titulares:[...x.titulares,{...x.titulares[0]!,titularId:"s-3"}]}))},deduccionesTerritoriales2025:{solicitudes:[s]}},{modo:"canonico"})))
   expect(e._tag).toBe("ResultadoNoSoportado")
  } else {
   const c=explicita(dos),d=c.derechosMinimos!
   const e=Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito({...c,derechosMinimos:{...d,descendientes:d.descendientes.map(x=>({...x,titulares:[...x.titulares,{...x.titulares[0]!,titularId:"s-3"}]}))},deduccionesTerritoriales2025:{solicitudes:[s]}})))
   expect(e._tag).toBe("ResultadoNoSoportado")
  }
 })
}
