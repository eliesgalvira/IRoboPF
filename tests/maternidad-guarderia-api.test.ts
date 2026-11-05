import Decimal from "decimal.js"
import { expect, it } from "vitest"
import { Effect } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito, type CasoFiscalAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import type { HechosMaternidad2025 } from "../lib/dominio/irpf/maternidad-2025/contrato"
import { hechos81, derechos81 } from "./maternidad-guarderia-fixtures"

const s={solicitudes:[{lote:"CYL81" as const,codigo:"cyl_cuidado_hijos_menores" as const,hechos:{hijo:"s-2",eleccion:"centro" as const}}]}
function clasica(h: HechosMaternidad2025 | undefined): CasoFiscalAnual {
 const base:CasoFiscalAnual={anio:2025,comunidadAutonoma:"castilla-y-leon",contribuyenteId:"s-1",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:3000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0}
 // Sólo concilia la renta propia del contrato de mínimos; los esperados monetarios son independientes.
 const neto=Effect.runSync(liquidarIrpfAnual(base,{modo:"canonico"})).rendimientoNetoTrabajoCentimos
 return {...base,derechosMinimos:derechos81("2023-01-01",neto),maternidad2025:h}
}
type Empleo2025 = Extract<CasoFiscalAnualExplicito, { ejercicio: 2025; perfil: "solo-trabajo" }>
function explicita(h: HechosMaternidad2025 | undefined): Empleo2025 {
 return {ejercicio:2025,comunidadAutonoma:"castilla-y-leon",contribuyenteId:"s-1",edad:40,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"segun-derechos",derechosMinimos:derechos81(),maternidad2025:h,discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:{solicitudes:[]},rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"empleo",clase:"empleo-laboral",integro:"30000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[]}
}
for(const api of ["clasica","explicita"] as const){
 it(api+": resultado disminuye2200 por1200+1000, no la cuota autonómica",()=>{
  const h=hechos81()
  if(api==="clasica"){
   const base=Effect.runSync(liquidarIrpfAnual(clasica(undefined),{modo:"canonico"})),r=Effect.runSync(liquidarIrpfAnual(clasica(h),{modo:"canonico"}))
   expect(r.cuotaLiquidaCentimos).toBe(base.cuotaLiquidaCentimos)
   expect(r.cuotaDiferencialCentimos).toBe(base.cuotaDiferencialCentimos-220000)
   expect(r.maternidad2025?.incremento).toEqual({numeradorEuros:"1000",divisor:"1"})
  }else{
   const base=Effect.runSync(liquidarIrpfAnualExplicito(explicita(undefined))),r=Effect.runSync(liquidarIrpfAnualExplicito(explicita(h)))
   expect(r.cuotaLiquidaLegal).toBe(base.cuotaLiquidaLegal)
   expect(new Decimal(r.cuotaDiferencial).minus(base.cuotaDiferencial).toFixed()).toBe("-2200")
   expect(r.maternidad2025?.incremento).toEqual({numeradorEuros:"1000",divisor:"1"})
  }
 })
 it(api+": CyL recibe500 del mismo libro y genera820, sin doble composición81",()=>{
  const h=hechos81(6,150000)
  const r=api==="clasica"?Effect.runSync(liquidarIrpfAnual({...clasica(h),deduccionesTerritoriales2025:s},{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito({...explicita(h),deduccionesTerritoriales2025:s}))
  expect(r.maternidad2025?.incremento).toEqual({numeradorEuros:"500",divisor:"1"})
  expect(r.deduccionesTerritoriales2025?.total).toEqual({numeradorEuros:"820",divisor:"1"})
  expect(r.rastro.pasos.filter(p=>p.titulo==="Maternidad y custodia en guardería (art.81)")).toHaveLength(1)
 })
 it(api+": anticipo100 sube resultado100, manteniendo devengo e incremento",()=>{
  const h=hechos81(),n=h.hijos[0],conAbono={...h,hijos:[{...n,anticipos140:[{id:"abono140",beneficiaria:"s-1",fechaCobro:"2025-02-01",periodo:"2025-01-01",importe:"100"}]}]}
  if(api==="clasica"){
   const a=Effect.runSync(liquidarIrpfAnual(clasica(h),{modo:"canonico"})),b=Effect.runSync(liquidarIrpfAnual(clasica(conAbono),{modo:"canonico"}))
   expect(b.cuotaDiferencialCentimos-a.cuotaDiferencialCentimos).toBe(10000)
  }else{
   const a=Effect.runSync(liquidarIrpfAnualExplicito(explicita(h))),b=Effect.runSync(liquidarIrpfAnualExplicito(explicita(conAbono)))
   expect(new Decimal(b.cuotaDiferencial).minus(a.cuotaDiferencial).toFixed()).toBe("100")
  }
 })
 it(api+": sin libro81, selecciónCyL rechazada por productor ausente",()=>{
  const e=api==="clasica"?Effect.runSync(Effect.flip(liquidarIrpfAnual({...clasica(undefined),deduccionesTerritoriales2025:s},{modo:"canonico"}))):Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito({...explicita(undefined),deduccionesTerritoriales2025:s})))
  expect(e._tag).toBe("ResultadoNoSoportado");expect(e.motivo).toMatch(/libro81/)
 })
}

it("ambas API: cuota0 no topa maternidad/guardería y devuelven2200",()=>{
 const h=hechos81(),base=clasica(h)
 const c={...base,derechosMinimos:derechos81("2023-01-01",0),rendimientos:{trabajo:[{importeIntegroCentimos:0}]}}
 const a=Effect.runSync(liquidarIrpfAnual(c,{modo:"canonico"}))
 expect(a.cuotaLiquidaCentimos).toBe(0);expect(a.cuotaDiferencialCentimos).toBe(-220000)
 const e=explicita(h)
 const z={...e,derechosMinimos:derechos81("2023-01-01",0),trabajo:{...e.trabajo,rendimientos:e.trabajo.rendimientos.map(r=>({...r,integro:"0"}))}}
 const r=Effect.runSync(liquidarIrpfAnualExplicito(z))
 expect(r.cuotaLiquidaLegal).toBe("0");expect(r.cuotaDiferencial).toBe("-2200")
})
