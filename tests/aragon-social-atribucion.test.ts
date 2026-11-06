import { expect, it } from "@effect/vitest"
import Decimal from "decimal.js"
import { Effect } from "effect"
import { producirCensoInmuebles2025 } from "../lib/dominio/irpf/inmobiliario-2025/productor"
import { redondearRacionalHalfUp } from "../lib/dominio/dinero/redondeo"
import { evaluarSocialMixtoAnual2025 } from "../lib/dominio/irpf/aragon-social-mixto-2025/atribucion"
import type { MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { social } from "./aragon-social-mixto.fixtures"
it("núcleo racional: empates positivos y fracciones sin truncamiento de tipo",()=>{
 const c=social(),s=c.deduccionesTerritoriales2025.solicitudes[0]!
 if(s.lote!=="A-aragon-dos" || s.codigo!=="aragon_arrendamiento_vivienda_social_arrendador" || !("viviendasPlan" in s.hechos)) throw new Error("fixture")
 const viviendasPlan = s.hechos.viviendasPlan
 const producido = Effect.runSync(producirCensoInmuebles2025(c))
 // cuota 1, base 200: RNR1 => atribuida0.005 ->0.01 ->30%=0.003 ->0.00.
 // RNR3 => atribuida0.015 ->0.02 ->30%=0.006 ->0.01.
 for(const [n,esperado] of [[1n,"0.00"],[3n,"0.01"]] as const){
  // El núcleo de atribución recibe un RNR sintético para aislar exactamente sus empates.
  const m: MagnitudesTerritorialesAnuales = {
   aragonSocialMixto2025:true,
   caso:{anio:2025,comunidadAutonoma:"aragon",contribuyenteId:c.contribuyenteId,situacionFamiliar:{tipo:"individual",edad:c.edad,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]}},
   inmueblesP4a:producido.inmuebles.map(v=>({...v,netoReducido:{n,d:1n}})),
   baseGeneral:new Decimal(200),baseAhorro:new Decimal(0),minimoPersonalFamiliar:new Decimal(5550),cuotaAutonomica:new Decimal(1),sujetosConMinimo:[],
  }
  expect(evaluarSocialMixtoAnual2025(viviendasPlan,m,c.deduccionesTerritoriales2025.solicitudes).importeExactoEuros).toBe(esperado)
  expect(()=>evaluarSocialMixtoAnual2025(viviendasPlan,{...m,aragonSocialMixto2025:undefined},c.deduccionesTerritoriales2025.solicitudes)).toThrow(/productor mixto/)
 }
})

it("política racional común: signos y empates sin error de división",()=>{
 expect(redondearRacionalHalfUp(1n,200n,2)).toBe(1n)
 expect(redondearRacionalHalfUp(-1n,200n,2)).toBe(-1n)
 expect(redondearRacionalHalfUp(499999999999999999n,1000000000000000000n)).toBe(0n)
 expect(()=>redondearRacionalHalfUp(1n,0n)).toThrow()
})
