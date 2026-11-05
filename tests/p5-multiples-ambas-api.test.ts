import Decimal from "decimal.js"
import { Effect } from "effect"
import { expect, it } from "vitest"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { anualCanonico, anualEfectivo, multiple, operacion, regional, cantabria } from "./p5-fixtures"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"

it.each(["canonico","explicito"] as const)("%s:400 varios pagos descuentan260 una vez",api=>{
  const libro={solicitudes:[],donativosEstatales2025:multiple()}
  if(api==="canonico"){
    const c=anualCanonico(),sin=Effect.runSync(liquidarIrpfAnual(c,{modo:"canonico"})),con=Effect.runSync(liquidarIrpfAnual({...c,deduccionesTerritoriales2025:libro},{modo:"canonico"}))
    expect(sin.cuotaLiquidaCentimos-con.cuotaLiquidaCentimos).toBe(26000)
  }else{
    const c=anualEfectivo(),sin=Effect.runSync(liquidarIrpfAnualExplicito(c)),con=Effect.runSync(liquidarIrpfAnualExplicito({...c,deduccionesTerritoriales2025:libro}))
    expect(new Decimal(sin.cuotaLiquidaLegal).minus(con.cuotaLiquidaLegal).toFixed()).toBe("260")
  }
})
it.each([false,true])("Murcia biosanitaria=%s: varios pagos regionales y cuota única ambas API",bio=>{
  const s=multiple(),a={...operacion("300","regional1","regional","G76543214"),eleccion:"no_aplicar" as const},b={...operacion("100","regional2","regional","G76543214"),eleccion:"no_aplicar" as const}
  const hechos=regional(a,bio)
  const otra=regional(b,bio)
  const solicitud={...hechos,hechos:{...hechos.hechos,pagos:[...hechos.hechos.pagos,...otra.hechos.pagos]}}
  const libro={solicitudes:[solicitud],donativosEstatales2025:{...s,operaciones68_3:[...s.operaciones68_3,a,b],prioridad68_3:["uno","dos","regional1","regional2"]}}
  const c=anualCanonico(),sin=Effect.runSync(liquidarIrpfAnual(c,{modo:"canonico"})),con=Effect.runSync(liquidarIrpfAnual({...c,deduccionesTerritoriales2025:libro},{modo:"canonico"}))
  expect(con.deduccionesTerritoriales2025?.total).toEqual(racional("200"))
  expect(sin.cuotaLiquidaCentimos-con.cuotaLiquidaCentimos).toBe(46000)
  const e=anualEfectivo(),pre=Effect.runSync(liquidarIrpfAnualExplicito(e)),post=Effect.runSync(liquidarIrpfAnualExplicito({...e,deduccionesTerritoriales2025:libro}))
  expect(new Decimal(pre.cuotaLiquidaLegal).minus(post.cuotaLiquidaLegal).toFixed()).toBe("460")
})
it.each(["canonico","explicito"] as const)("%s: generación260 con cuota0, sin generación ficticia cero",api=>{
  // BL canónica4258.4 y explícita5198: 10% cubre400; ambas bajo mínimo5550.
  const libro={solicitudes:[],donativosEstatales2025:multiple()}
  if(api==="canonico"){
    const c={...anualCanonico(),rendimientos:{trabajo:[{importeIntegroCentimos:1450000}]}}
    const r=Effect.runSync(liquidarIrpfAnual({...c,deduccionesTerritoriales2025:libro},{modo:"canonico"}))
    expect(r.cuotaLiquidaCentimos).toBe(0)
    if(r.deduccionesTerritoriales2025===undefined||!("donativosEstatales2025" in r.deduccionesTerritoriales2025))throw new Error("Libro ausente")
    expect(r.deduccionesTerritoriales2025.donativosEstatales2025.generado).toEqual(racional("260"))
    expect(r.deduccionesTerritoriales2025.donativosEstatales2025.aplicado).toEqual(racional("0"))
  }else{
    const e=anualEfectivo(),r=Effect.runSync(liquidarIrpfAnualExplicito({...e,trabajo:{...e.trabajo,rendimientos:[{...e.trabajo.rendimientos[0],integro:"14500"}]},deduccionesTerritoriales2025:libro}))
    expect(r.cuotaLiquidaLegal).toBe("0")
    if(r.deduccionesTerritoriales2025===undefined||!("donativosEstatales2025" in r.deduccionesTerritoriales2025))throw new Error("Libro ausente")
    expect(r.deduccionesTerritoriales2025.donativosEstatales2025.generado).toEqual(racional("260"))
  }
})
it.each(["canonico","explicito"] as const)("%s rechaza prioridad incompleta por entrada pública",api=>{
  const libro={solicitudes:[],donativosEstatales2025:{...multiple(),prioridad68_3:["uno"]}}
  if(api==="canonico") expect(()=>Effect.runSync(liquidarIrpfAnual({...anualCanonico(),deduccionesTerritoriales2025:libro},{modo:"canonico"}))).toThrow()
  else expect(()=>Effect.runSync(liquidarIrpfAnualExplicito({...anualEfectivo(),deduccionesTerritoriales2025:libro}))).toThrow()
})

it.each(["canonico","explicito"] as const)("%s Cantabria múltiples reserva global única y cuota única",api=>{
  const s=multiple(),a={...operacion("1000","regional1","regional","G76543214"),eleccion:"no_aplicar" as const},b={...operacion("1000","regional2","regional","G76543214"),eleccion:"no_aplicar" as const}
  const libro={solicitudes:[cantabria([a,b])],donativosEstatales2025:{...s,operaciones68_3:[...s.operaciones68_3,a,b],prioridad68_3:["uno","dos","regional1","regional2"]}}
  if(api==="canonico"){
    const c={...anualCanonico(),comunidadAutonoma:"cantabria" as const},pre=Effect.runSync(liquidarIrpfAnual(c,{modo:"canonico"})),post=Effect.runSync(liquidarIrpfAnual({...c,deduccionesTerritoriales2025:libro},{modo:"canonico"}))
    expect(post.deduccionesTerritoriales2025?.total).toEqual(racional("300"))
    expect(pre.cuotaLiquidaCentimos-post.cuotaLiquidaCentimos).toBe(56000)
  }else{
    const c={...anualEfectivo(),comunidadAutonoma:"cantabria" as const},pre=Effect.runSync(liquidarIrpfAnualExplicito(c)),post=Effect.runSync(liquidarIrpfAnualExplicito({...c,deduccionesTerritoriales2025:libro}))
    expect(post.deduccionesTerritoriales2025?.total).toEqual(racional("300"))
    expect(new Decimal(pre.cuotaLiquidaLegal).minus(post.cuotaLiquidaLegal).toFixed()).toBe("560")
  }
})
it.each(["canonico","explicito"] as const)("%s:propiedad fiscal externa y duplicado rechazados",api=>{
  const s=multiple(),a=s.operaciones68_3[0]!
  const invalidos=[{...s,base68_3:"400"},{...s,operaciones68_3:[a,a]}]
  for(const invalido of invalidos){
    const libro={solicitudes:[],donativosEstatales2025:invalido}
    if(api==="canonico")expect(()=>Effect.runSync(liquidarIrpfAnual({...anualCanonico(),deduccionesTerritoriales2025:libro},{modo:"canonico"}))).toThrow()
    else expect(()=>Effect.runSync(liquidarIrpfAnualExplicito({...anualEfectivo(),deduccionesTerritoriales2025:libro}))).toThrow()
  }
})
it.each(["canonico","explicito"] as const)("%s:concurrencia Murcia usada con cuota0 conserva rechazo concreto",api=>{
  const s=multiple(),a=s.operaciones68_3[0]!,libro={solicitudes:[regional(a)],donativosEstatales2025:s}
  if(api==="canonico"){
    const c={...anualCanonico(),rendimientos:{trabajo:[{importeIntegroCentimos:1000000}]}}
    expect(()=>Effect.runSync(liquidarIrpfAnual({...c,deduccionesTerritoriales2025:libro},{modo:"canonico"}))).toThrow()
  }else{
    const e=anualEfectivo(),c={...e,trabajo:{...e.trabajo,rendimientos:[{...e.trabajo.rendimientos[0],integro:"10000"}]}}
    expect(()=>Effect.runSync(liquidarIrpfAnualExplicito({...c,deduccionesTerritoriales2025:libro}))).toThrow()
  }
})

it.each(["canonico","explicito"] as const)("%s Madrid art9 conserva límite propio y residual común",api=>{
  const s=multiple(),a=s.operaciones68_3[0]!
  const solicitud={lote:"F-ampliado" as const,codigo:"madrid_donativos_fundaciones_clubes_deportivos" as const,hechos:{entidades:[{id:a.entidad.id,forma:"fundacion",registro:"registro-madrid",cuentasPresentadas:"si",certificado:"cert-regional"}],pagos:s.operaciones68_3.map(o=>({id:o.pago.id,operacionId:o.operacionId,pagador:o.pago.pagador,objetoId:o.entidad.id,fecha:o.pago.fecha,importeEUR:o.pago.euros,concepto:"donativo_dinerario",medio:o.pago.medio,soportePago:o.pago.documento}))}}
  const libro={solicitudes:[solicitud],donativosEstatales2025:s}
  if(api==="canonico"){
    const c={...anualCanonico(),comunidadAutonoma:"madrid" as const},pre=Effect.runSync(liquidarIrpfAnual(c,{modo:"canonico"})),post=Effect.runSync(liquidarIrpfAnual({...c,deduccionesTerritoriales2025:libro},{modo:"canonico"}))
    expect(post.deduccionesTerritoriales2025?.total).toEqual(racional("60"))
    expect(pre.cuotaLiquidaCentimos-post.cuotaLiquidaCentimos).toBe(32000)
  }else{
    const c={...anualEfectivo(),comunidadAutonoma:"madrid" as const},pre=Effect.runSync(liquidarIrpfAnualExplicito(c)),post=Effect.runSync(liquidarIrpfAnualExplicito({...c,deduccionesTerritoriales2025:libro}))
    expect(post.deduccionesTerritoriales2025?.total).toEqual(racional("60"))
    expect(new Decimal(pre.cuotaLiquidaLegal).minus(post.cuotaLiquidaLegal).toFixed()).toBe("320")
  }
})
