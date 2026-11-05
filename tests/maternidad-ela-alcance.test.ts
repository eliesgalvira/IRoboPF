import { expect, it } from "vitest"
import { Effect } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { censoELA, casoCanonicoELA, casoEfectivoELA, solicitudELA } from "./ela-ingreso-2025-fixtures"
import { hechos81, derechos81 } from "./maternidad-guarderia-fixtures"
import { MOTIVO_ELA81_PENDIENTE } from "../lib/dominio/irpf/maternidad-2025/combinacion"

function datosCombinados() {
  const c=censoELA(),a=c.ayudas[0]
  const ingreso={...c,contribuyenteId:"s-1",ayudas:[{...a,beneficiario:"s-1",cobros:a.cobros.map(p=>({...p,beneficiario:"s-1"}))}]}
  const h=hechos81(),n=h.hijos[0]
  // Alta al nacer, sin actividad2025:81 no exige empleo actual. P1 tiene sólo ingreso20000.
  const maternidad={...h,hijos:[{...n,progenitores:n.progenitores.map(p=>({...p,actividades:[],altas:p.altas.map(a=>({...a,hasta:"2023-12-31"}))}))}]}
  const d=derechos81("2023-01-01",2000000)
  return {ingreso,maternidad,derechos:{...d,territorio:"asturias" as const},solicitud:solicitudELA(ingreso)}
}
it("ELA+81 se rechaza con la misma causa en ambas API antes de producir libros",()=>{
  const x=datosCombinados()
  const c={...casoCanonicoELA(x.ingreso,x.solicitud),contribuyenteId:"s-1",situacionFamiliar:{tipo:"individual" as const,edad:40,discapacidad:{_tag:"SinDiscapacidad" as const},descendientes:[],ascendientes:[]},derechosMinimos:x.derechos,maternidad2025:x.maternidad}
  const e={...casoEfectivoELA(x.ingreso,x.solicitud),contribuyenteId:"s-1",edad:40,derechosMinimos:x.derechos,familiaresConDerechoMinimo:"segun-derechos" as const,maternidad2025:x.maternidad}
  const errores=[Effect.runSync(Effect.flip(liquidarIrpfAnual(c,{modo:"canonico"}))),Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(e)))]
  for(const error of errores){expect(error._tag).toBe("ResultadoNoSoportado");expect(error.motivo).toBe(MOTIVO_ELA81_PENDIENTE);expect("importe" in error).toBe(false);expect("libroIngresosIdentificados2025" in error).toBe(false);expect("maternidad2025" in error).toBe(false)}
})
it("P1 individual conserva su libro y generación recibidos sin solicitud81",()=>{
  const c=Effect.runSync(liquidarIrpfAnual(casoCanonicoELA(),{modo:"canonico"}))
  const e=Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoELA()))
  for(const r of [c,e]){
    expect(r.libroIngresosIdentificados2025?.totalIntegradoGeneral).toEqual({numeradorEuros:"20000",divisor:"1"})
    expect(r.deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual({numeradorEuros:"3082",divisor:"1"})
    expect(r.maternidad2025).toBeUndefined()
  }
})
