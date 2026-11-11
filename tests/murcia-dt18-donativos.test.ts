import Decimal from "decimal.js"
import {Effect} from "effect"
import {expect,it} from "vitest"
import {canonico,efectivo,fixture} from "./murcia-dt18-donativos-fixture"
import {censo,operacion} from "./p5-fixtures"
import {liquidarIrpfAnual,liquidarIrpfAnualExplicito} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import {racional} from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import oraculos from "./murcia-dt18-donativos-oraculos.json"
function concurrencia(importe="300") {
  const s=fixture(),o=operacion(importe)
  const d={...censo([{...o,pago:{...o.pago,pagador:"A"},certificado:{...o.certificado,donante:"A"}}]),contribuyente:"A"}
  const h=s.viviendaDT182025!
  // Desglosar consumo existente; no añadir un segundo desembolso patrimonial.
  const consumo=h.movimientos.find(m=>m.id==="CON")!
  Object.assign(consumo,{importe:String(46950-Number(importe))})
  Object.assign(h,{movimientos:[...h.movimientos,{...consumo,id:o.pago.id,fecha:o.pago.fecha,importe:o.pago.euros,documento:{referencia:o.pago.documento,fecha:o.pago.fecha,emisor:"entidad"}}].sort((a,b)=>a.fecha.localeCompare(b.fecha))})
  return {...s,donativosEstatales2025:d,prioridadCuotasDT18Donativos2025:"dt18_antes_donativos" as const}
}
type Solicitud=ReturnType<typeof concurrencia>
function liquidar(api:"canonico"|"explicito",s:Solicitud,bruto:string) {
  s=structuredClone(s)
  const ss=String(Math.round(Number(bruto)*648)/10000)
  const ingresoNeto=Number(bruto)-Number(ss)
  const h=s.viviendaDT182025
  if(h!==undefined){
    Object.assign(h.movimientos.find(m=>m.id==="ING")!,{importe:String(ingresoNeto)})
    const consumo=h.movimientos.find(m=>m.id==="CON")!
    // Mismo salario bancario y laboral; gasto ordinario mantiene los saldos admitidos.
    Object.assign(consumo,{importe:String(ingresoNeto-3050-h.movimientos.filter(m=>m.clase==="consumo"&&m.id!=="CON").reduce((total,m)=>total+Number(m.importe),0)+(consumo.importe==="46650.01"?0.01:0))})
  }
  const c=canonico(),e=efectivo(s)
  return api==="canonico"
    ? Effect.map(liquidarIrpfAnual({...c,rendimientos:{trabajo:[{importeIntegroCentimos:Number(bruto)*100}]},deduccionesTerritoriales2025:s},{modo:"canonico"}),x=>({...x.deduccionesTerritoriales2025!,cuotaFinal:new Decimal(x.cuotaLiquidaCentimos).div(100).toFixed(2)}))
    : Effect.map(liquidarIrpfAnualExplicito({...e,trabajo:{...e.trabajo,rendimientos:e.trabajo.rendimientos.map(r=>({...r,integro:bruto,cotizaciones:{...r.cotizaciones,seguridadSocial:ss}}))}}),x=>({...x.deduccionesTerritoriales2025!,cuotaFinal:new Decimal(x.cuotaLiquidaLegal).toFixed(2)}))
}
for(const api of ["canonico","explicito"] as const) {
  for(const o of oraculos) it(api+": "+o.caso,()=>{
    const r=Effect.runSync(liquidar(api,concurrencia(o.donativo),o.bruto))
    if(!("donativosEstatales2025" in r))throw new Error("Falta libro común")
    const d=r.donativosEstatales2025
    expect(r.viviendaDT182025?.baseDerechoSinAdecuacion).toEqual({numeradorCentimos:"305000",denominador:"1"})
    expect(r.viviendaDT182025?.cuotas?.estatal.total).toEqual(o.dt18Estatal)
    expect(r.viviendaDT182025?.cuotas?.autonomica.total).toEqual(o.dt18Autonomica)
    expect(d.baseLiquidable).toEqual(o.baseLiquidable)
    expect(d.base68_3).toEqual(o.baseDonativo)
    expect(d.generado).toEqual(o.generadoDonativo)
    expect(d.estatal.integra).toEqual(o.residualDT18Estatal)
    expect(d.autonomica.integra).toEqual(o.residualDT18Autonomica)
    expect(d.estatal.aplicada).toEqual(o.donativoEstatal)
    expect(d.autonomica.aplicada).toEqual(o.donativoAutonomica)
    expect(d.estatal.disponible).toEqual(o.finalEstatal)
    expect(d.autonomica.disponible).toEqual(o.finalAutonomica)
    expect(r.cuotaFinal).toBe(o.cuotaFinal)
    expect(r.total).toEqual(racional("0"))
    expect(r.evaluacionesF[0]?.consumoCompartidoDT18?.aplicado).toEqual(o.dt18Autonomica)
    expect(r.prioridadCuotasDT18Donativos2025).toBe("dt18_antes_donativos")
  })
  for(const fallo of ["sin_orden","orden_inverso","orden_externo","sin_dt18","sin_donativos","otra_rama","duplicado_regional","duplicado_donativo","pago_vivienda","documento_vivienda","movimiento_omitido","importe","fecha","entrada","duplicado_movimiento","concurrencia_regional","historia","patrimonio_escaso","herencia","donacion_recibida"] as const)
    it(api+": rechazo "+fallo,()=>{
      const s=concurrencia(),h=s.viviendaDT182025!,d=s.donativosEstatales2025,p=d.operaciones68_3[0]!.pago
      if(fallo==="sin_orden")Object.assign(s,{prioridadCuotasDT18Donativos2025:undefined})
      if(fallo==="orden_inverso")Object.assign(s,{prioridadCuotasDT18Donativos2025:"donativos_antes_dt18"})
      if(fallo==="orden_externo")Object.assign(s,{prioridadCuotasDT18Donativos2025:["dt18","donativos"]})
      if(fallo==="sin_dt18")Object.assign(s,{viviendaDT182025:undefined})
      if(fallo==="sin_donativos")Object.assign(s,{donativosEstatales2025:undefined})
      if(fallo==="otra_rama")Object.assign(s.solicitudes[0]!,{hechos:{ramaTransitoria:"Uno_vigente"}})
      if(fallo==="duplicado_regional")Object.assign(s,{solicitudes:[...s.solicitudes,...s.solicitudes]})
      if(fallo==="duplicado_donativo")Object.assign(d,{operaciones68_3:[...d.operaciones68_3,...d.operaciones68_3]})
      if(fallo==="pago_vivienda")Object.assign(p,{id:h.proyectos[0]!.vivienda.pagos[0]!.id})
      if(fallo==="documento_vivienda")Object.assign(p,{documento:h.proyectos[0]!.vivienda.pagos[0]!.factura})
      const m=h.movimientos.find(m=>m.id==="p-op-estatal")!
      if(fallo==="movimiento_omitido")Object.assign(h,{movimientos:h.movimientos.filter(x=>x!==m)})
      if(fallo==="importe")Object.assign(m,{importe:"301"})
      if(fallo==="fecha")Object.assign(m,{fecha:"2025-06-02"})
      if(fallo==="entrada")Object.assign(m,{sentido:"entrada",clase:"donacion"})
      if(fallo==="duplicado_movimiento")Object.assign(h,{movimientos:[...h.movimientos,m]})
      if(fallo==="concurrencia_regional")Object.assign(s,{solicitudes:[...s.solicitudes,{lote:"F-ampliado",codigo:"murcia_donativos_investigacion_biosanitaria",hechos:{}}]})
      if(fallo==="historia")Object.assign(d.operaciones68_3[0]!,{incremento:"reiteracion_45"})
      if(fallo==="patrimonio_escaso"){
        Object.assign(h.cuentas[0]!.cierre,{importe:"1999.99"})
        Object.assign(h.movimientos.find(m=>m.id==="CON")!,{importe:"46650.01"})
      }
      if(fallo==="herencia"||fallo==="donacion_recibida")Object.assign(h.movimientos.find(m=>m.id==="ING")!,{clase:fallo==="herencia"?"herencia":"donacion"})
      expect(Effect.runSync(Effect.flip(liquidar(api,s,"100000")))._tag).toBe("ResultadoNoSoportado")
    })
  it(api+": orden físico de las claves no decide atribución; no_aplicar conserva el gasto",()=>{
    const s=concurrencia()
    const invertida={donativosEstatales2025:s.donativosEstatales2025,prioridadCuotasDT18Donativos2025:s.prioridadCuotasDT18Donativos2025,solicitudes:s.solicitudes,viviendaDT182025:s.viviendaDT182025!}
    expect(Effect.runSync(liquidar(api,invertida,"17000"))).toEqual(Effect.runSync(liquidar(api,s,"17000")))
    Object.assign(s.donativosEstatales2025.operaciones68_3[0]!,{eleccion:"no_aplicar"})
    const r=Effect.runSync(liquidar(api,s,"17000"))
    if(!("donativosEstatales2025" in r))throw new Error("Falta libro")
    expect(r.donativosEstatales2025.aplicado).toEqual(racional("0"))
    expect(r.viviendaDT182025?.cuotas?.estatal.total).toEqual(racional("228.75"))
  })
}
