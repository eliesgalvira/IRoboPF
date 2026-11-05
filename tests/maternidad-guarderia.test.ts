import oraculos from "./fixtures/maternidad-guarderia-oraculos.json"
import { expect, it } from "vitest"
import { Result, Schema } from "effect"
import Decimal from "decimal.js"
import { hechos81, ambito81 } from "./maternidad-guarderia-fixtures"
import { HechosMaternidad2025 } from "../lib/dominio/irpf/maternidad-2025/contrato"
import { producirMaternidad81, aplicarArt81AlDiferencial, fecha81 } from "../lib/dominio/irpf/maternidad-2025/producir"
import { evaluarCuidadoCyl81 } from "../lib/dominio/irpf/maternidad-2025/cyl"
import type { MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import type { Racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"

const D=Decimal.clone({precision:200})
function igual(x:Racional,n:bigint,d=1n){expect(BigInt(x.numeradorEuros)*d).toBe(n*BigInt(x.divisor))}
for(const c of oraculos.casos.filter(c=>c.id!=="incompleto_techo")){
 it(c.id,()=>{
  const r=producirMaternidad81(hechos81(c.mesesCompletos,Number(c.gastoNeto)*100),ambito81(),["s-2"])
  igual(r.maternidad,1200n);igual(r.incremento,BigInt(c.incremento.numeradorEuros),BigInt(c.incremento.divisor))
 })
}
it("gasto de mes incompleto integra techo pero no aumenta meses",()=>{
 const h=hechos81(6,40000),n=h.hijos[0]
 const nuevo={...n,calendario:n.calendario.map(m=>m.mes===7?{...m,contratos:[{centro:"centro1",desde:"2025-07-10",hasta:"2025-07-31",referencia:"parcial"}]}:m),facturas:[...n.facturas,{id:"factura7",centro:"centro1",mes:7,concepto:"asistencia" as const,pagos:[{id:"pago7",fecha:"2025-07-31",pagador:"s-1",importe:"100"}],pagosEmpresa:[]}]}
 const r=producirMaternidad81({...h,hijos:[nuevo]},ambito81(),["s-2"])
 igual(r.incremento,500n);expect(r.hijos[0].meses.filter(m=>m.guarderia)).toHaveLength(6)
})
it("padre y madre pagan; no hay mitad estatal automática",()=>{
 const h=hechos81(),n=h.hijos[0],madre=n.progenitores[0]
 const r=producirMaternidad81({...h,hijos:[{...n,progenitores:[madre,{...madre,id:"s-3",papel:"padre_biologico"}],facturas:n.facturas.map(f=>({...f,pagos:f.pagos.map(p=>({...p,pagador:"s-3"}))}))}]},ambito81(),["s-2"])
 igual(r.incremento,1000n)
})
it("cumple3 en enero: maternidad0 y extensión guardería hasta agosto",()=>{
 const h=hechos81(),n=h.hijos[0],nacimiento="2022-01-01"
 const r=producirMaternidad81({...h,hijos:[{...n,nacimiento,segundoCiclo:{calendario:"ordinario_septiembre2025",inicio:"2025-09-08",referencia:"calendario2025"}}]},ambito81(nacimiento),["s-2"])
 igual(r.maternidad,0n);igual(r.incremento,2000n,3n)
})
it("complemento de un progenitor bloquea ese mes de ambas cuantías",()=>{
 const h=hechos81(),n=h.hijos[0]
 const r=producirMaternidad81({...h,hijos:[{...n,calendario:n.calendario.map(m=>m.mes===2?{...m,complementoInfancia:[{id:"capi1",perceptor:"s-1",resolucion:"capi",fechaCobro:"2025-02-10",importe:"100"}]}:m)}]},ambito81(),["s-2"])
 igual(r.maternidad,1100n);igual(r.incremento,2750n,3n)
})
it("nacimiento incluye su mes, cumpleaños3 lo excluye",()=>{
 const h=hechos81(),n=h.hijos[0],nacimiento="2022-07-31"
 const r=producirMaternidad81({...h,hijos:[{...n,nacimiento,segundoCiclo:{calendario:"ordinario_septiembre2025",inicio:"2025-09-08",referencia:"calendario"}}]},ambito81(nacimiento),["s-2"])
 igual(r.maternidad,600n)
})
it("anticipos reales separados; cuota autonómica no es tope81",()=>{
 const h=hechos81(),n=h.hijos[0]
 const r=producirMaternidad81({...h,hijos:[{...n,anticipos140:[{id:"abono1",beneficiaria:"s-1",fechaCobro:"2025-02-15",periodo:"2025-01-01",importe:"100"}]}]},ambito81(),["s-2"])
 igual(r.maternidad,1200n);igual(r.incremento,1000n);igual(r.anticipos,100n)
 expect(aplicarArt81AlDiferencial(new D(0),r).toFixed()).toBe("-2100")
})
it("ayuda nominal y especie exenta se restan sin bajar artificialmente al50%",()=>{
 const h=hechos81(1,40000),n=h.hijos[0]
 const r=producirMaternidad81({...h,hijos:[{...n,facturas:[{...n.facturas[0],pagos:n.facturas[0].pagos.map(p=>({...p,importe:"350"})),pagosEmpresa:[{id:"empresa_pago",fecha:"2025-01-31",empresa:"empresa1",empleado:"s-1",importe:"50",forma:"contratacion_directa_custodia",contratoServicio:"servicio_empresa",nomina:"enero"}]}],ayudas:[{id:"ayuda",fechaCobro:"2025-03-01",beneficiario:"s-1",programa:"ordinaria",atribucion:"nominal",importe:"300",facturas:[{id:"factura1",importe:"300"}]}]}]},ambito81(),["s-2"])
 igual(r.hijos[0].gastoNeto,50n);igual(r.incremento,50n)
})
it("CyL usa incremento500 del mismo niño:1500 y tope1320 producen820",()=>{
 const h=hechos81(6,150000),libro=producirMaternidad81(h,ambito81(),["s-2"])
 const m:MagnitudesTerritorialesAnuales={caso:{...ambito81(),comunidadAutonoma:"castilla-y-leon"},libroMaternidad81:libro,baseGeneral:new D(10000),baseAhorro:new D(0),minimoPersonalFamiliar:new D(10750),cuotaAutonomica:new D(1000),sujetosConMinimo:["s-2"],atribucionesMinimo:[{sujetoId:"s-2",titulares:["s-1"]}],rentasTrabajoAnuales:{integroTrabajo:new D(30000),restoRentas:new D(0)}}
 const r=evaluarCuidadoCyl81({lote:"CYL81",codigo:"cyl_cuidado_hijos_menores",hechos:{hijo:"s-2",eleccion:"centro"}},m)
 expect(r.estado).toBe("calculo_parcial")
 if(r.estado!=="calculo_parcial")throw new Error("No se produjo CyL")
 expect(r.importeExacto).toBe("820")
})
it("rechaza desconocidos y magnitud fiscal aunque parezca un hecho",()=>{
 const h=hechos81()
 for(const campo of ["incrementoEstatalMaternidad","cuotaAutonomica","cumple"]){
  expect(Result.isFailure(Schema.decodeUnknownResult(HechosMaternidad2025)({...h,[campo]:500},{onExcessProperty:"error"}))).toBe(true)
 }
})
it("calendario no exhaustivo, repetición y fecha inexistente se rechazan",()=>{
 const h=hechos81(),n=h.hijos[0]
 expect(()=>producirMaternidad81({...h,hijos:[{...n,calendario:n.calendario.slice(1)}]},ambito81(),["s-2"])).toThrow(/doce meses/)
 expect(()=>producirMaternidad81({...h,hijos:[{...n,facturas:[...n.facturas,n.facturas[0]]}]},ambito81(),["s-2"])).toThrow(/duplicado/)
 expect(()=>fecha81("2025-02-29")).toThrow(/inexistente/)
})
it("nacimiento del31mayo incluye mayo en maternidad aunque no haya mes completo de custodia",()=>{
 const h=hechos81(),n=h.hijos[0],nacimiento="2025-05-31"
 const r=producirMaternidad81({...h,hijos:[{...n,nacimiento,calendario:n.calendario.map(m=>({...m,contratos:[]})),facturas:[]}]},ambito81(nacimiento),["s-2"])
 igual(r.maternidad,800n);igual(r.incremento,0n)
})
it("sin mínimo, censo omitido o identidad propia como hijo se rechaza",()=>{
 const h=hechos81(),n=h.hijos[0]
 expect(()=>producirMaternidad81(h,ambito81(),[])).toThrow(/mínimo/)
 expect(()=>producirMaternidad81({...h,hijos:[]},ambito81(),["s-2"])).toThrow(/exhaustivo/)
 expect(()=>producirMaternidad81({...h,hijos:[{...n,id:"s-1"}]},ambito81(),["s-2"])).toThrow(/exhaustivo|propio hijo/)
})
it("el centro infantil requiere autorización educativa; no basta municipal ni acto fuera de período",()=>{
 const h=hechos81(),n=h.hijos[0],c=n.centros[0]
 expect(()=>producirMaternidad81({...h,hijos:[{...n,centros:[{...c,clase:"centro_educacion_infantil"}]}]},ambito81(),["s-2"])).toThrow(/autorización/)
 expect(()=>producirMaternidad81({...h,hijos:[{...n,centros:[{...c,autorizacion:{...c.autorizacion,hasta:"2024-12-31"}}]}]},ambito81(),["s-2"])).toThrow(/autorización/)
})
it("alta posterior, cambio de custodia, historia2022 y ayudas compartidas siguen pendientes",()=>{
 const h=hechos81(),n=h.hijos[0]
 expect(()=>producirMaternidad81({...h,hijos:[{...n,progenitores:n.progenitores.map(p=>({...p,altas:[{...p.altas[0],desde:"2024-01-01"}]}))}]},ambito81(),["s-2"])).toThrow(/alta posterior/)
 expect(()=>producirMaternidad81({...h,hijos:[{...n,convivencia:"cambio_o_custodia_especial"}]},ambito81(),["s-2"])).toThrow(/custodia/)
 expect(()=>producirMaternidad81({...h,hijos:[{...n,antecedenteInfancia2022:"cobros_2022"}]},ambito81(),["s-2"])).toThrow(/transitoria/)
 expect(()=>producirMaternidad81({...h,hijos:[{...n,ayudas:[{id:"ayuda",fechaCobro:"2025-01-01",beneficiario:"s-1",programa:"ordinaria",atribucion:"compartida_sin_atribucion",importe:"1",facturas:[{id:"factura1",importe:"1"}]}]}]},ambito81(),["s-2"])).toThrow(/compartida/)
})
