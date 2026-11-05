import {it,expect} from "vitest"
import {Effect} from "effect"
import Decimal from "decimal.js"
import {historica,ambas,magnitudes} from "./rioja-anterior-fixture"
import {aplicarDeduccionesTerritoriales2025} from "../lib/dominio/irpf/deducciones/anual-territorial"
import {racional} from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import {producirSegundaRiojaAnterior} from "../lib/dominio/irpf/patrimonio-p5a/productor"
it("segunda: ambas API, 3050*8%=244 y una cuota",()=>{
 for(const e of ambas({solicitudes:[historica()]})){
  const r=Effect.runSync(e);expect(r?.evaluaciones[0].exacto).toEqual(racional("244"));expect(r?.total).toEqual(racional("244"));expect(r?.aplicaciones).toHaveLength(1)
 }
})
it("cuota80 cifras exacta sin duplicar fiscalidad",()=>{
 const q="0."+"0".repeat(78)+"1"
 expect(aplicarDeduccionesTerritoriales2025({solicitudes:[historica()]},{...magnitudes(),cuotaAutonomica:new Decimal(q)}).total).toEqual(racional("1",String(10n**79n)))
})
it("patrimonio separado de gasto: incremento3000, gasto3050",()=>{
 const s=historica();if(s.patrimonioRiojaAnterior===undefined||s.hechos.codigo!=="rioja_segunda_vivienda_medio_rural")throw new Error("fixture")
 const v=s.hechos.viviendas[0]!;if(!("operacion"in v))throw new Error("fixture")
 const p=producirSegundaRiojaAnterior(s.patrimonioRiojaAnterior,"A",s.nacimientoContribuyente,v)
 expect(p.traza.incrementoComparable).toEqual({numeradorCentimos:"300000",denominador:"1"})
})
for(const fallo of ["saldo","principal","historia","uso","titulo","sin_productor","base_externa","concurrencia"] as const)it("ambas API rechazan "+fallo,()=>{
 const s=historica(),p=s.patrimonioRiojaAnterior!;
 if(fallo==="saldo")Object.assign(p.cuentas[0]!.cierre,{importe:"2000.01"})
 if(fallo==="principal")Object.assign(p.financiacionAnterior.principalInicio,{importe:"9001"})
 if(fallo==="historia")Object.assign(p.historia,{ejercicios:[]})
 if(fallo==="uso")Object.assign(p.financiacionAnterior,{usoDesdeAdquisicion:"habitual"})
 if(fallo==="titulo")Object.assign(p.censo[0]!,{participacion:[1,2]})
 if(fallo==="sin_productor")Object.assign(s,{patrimonioRiojaAnterior:undefined})
 if(fallo==="base_externa")Object.assign(p,{baseEstatalViviendaSinAdecuacion:"0"})
 for(const e of ambas({solicitudes:fallo==="concurrencia"?[s,s]:[s]}))expect(Effect.runSync(Effect.flip(e))._tag).toBe("ResultadoNoSoportado")
})
it("frontera patrimonial: déficit un céntimo da cero en ambas API",()=>{
 const s=historica(),p=s.patrimonioRiojaAnterior!;Object.assign(p.movimientos.find(x=>x.id==="C")!,{importe:"16950.01"});Object.assign(p.cuentas[0]!.cierre,{importe:"1999.99"})
 for(const e of ambas({solicitudes:[s]}))expect(Effect.runSync(e)?.total).toEqual(racional("0"))
})
it("variación de valoración excluida",()=>{
 const s=historica();Object.assign(s.patrimonioRiojaAnterior!.adquisicion.valorCierre,{importe:"999999"})
 for(const e of ambas({solicitudes:[s]}))expect(Effect.runSync(e)?.total).toEqual(racional("244"))
})
for(const codigo of ["rioja_obras_rehabilitacion_vivienda_habitual","rioja_adquisicion_construccion_vivienda_jovenes","rioja_adecuacion_vivienda_discapacidad"])it("rechaza productor histórico ausente, no cero: "+codigo,()=>{
 const s=historica();Object.assign(s.hechos,{codigo});Object.assign(s,{patrimonioRiojaAnterior:undefined})
 for(const e of ambas({solicitudes:[s]}))expect(Effect.runSync(Effect.flip(e))._tag).toBe("ResultadoNoSoportado")
})

it("límite450,76 en ambas API: no límite redondeado450",()=>{
 const s=historica(),p=s.patrimonioRiojaAnterior!;
 Object.assign(p.movimientos.find(x=>x.id==="A")!,{importe:"6000"});Object.assign(p.movimientos.find(x=>x.id==="C")!,{importe:"13950"});Object.assign(p.prestamo!.principalCierre,{importe:"3000"});
 if(!("viviendas"in s.hechos))throw new Error("fixture");const v=s.hechos.viviendas[0]!;if(!("operacion"in v))throw new Error("fixture");Object.assign(v.pagos.find(x=>x.id==="A")!,{importe:"6000"});Object.assign(s.inversionesViviendaEjercicio.find(x=>x.id==="A")!,{importe:"6000"});
 for(const e of ambas({solicitudes:[s]}))expect(Effect.runSync(e)?.total).toEqual(racional("450.76"))
})
