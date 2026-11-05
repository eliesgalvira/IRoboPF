import Decimal from "decimal.js"
import { describe, expect, it } from "vitest"
import inversiones from "./aragon-dos-inversion.casos.json"
import sociales from "./aragon-dos-social.casos.json"
import { evaluarInversionAragonesa2025, prepararArrendadorSocial2025,
 type SolicitudInversionAragonesa2025, type SolicitudArrendadorSocial2025 } from "../lib/dominio/irpf/deducciones/aragon-dos-codigos-2025"

type Payload = string | number | boolean | null | undefined | readonly Payload[] | { readonly [campo:string]:Payload }
function inversion(h: Payload) {
 // SAFETY: negativos deliberados de llamadas JS; el evaluador decodifica el esquema completo antes de operar.
 return evaluarInversionAragonesa2025(h as SolicitudInversionAragonesa2025)
}
function social(h: Payload) {
 // SAFETY: negativos deliberados de llamadas JS; el preparador decodifica el esquema completo antes de operar.
 return prepararArrendadorSocial2025(h as SolicitudArrendadorSocial2025)
}
describe("Dos códigos aragoneses2025 por hechos",()=>{
 for(const c of inversiones)it(c.nombre,()=>{
  const r=inversion(c.entrada)
  if(c.exacto===null){expect(r.estado).toBe("no_soportado");expect("importeExactoEuros" in r).toBe(false)}
  else{
   expect(r.estado,r.estado==="no_soportado"?r.motivo:"").toBe("calculo_parcial")
   if(r.estado==="calculo_parcial"){expect(r.importeExactoEuros).toBe(c.exacto);expect(r.importePresentadoCentimos).toBe(c.presentadoCentimos);expect(r.aceptacionFiscal).toBe("pendiente");expect(r.asignaciones.length).toBe(c.entrada.inversiones.length)}
  }
 })
 for(const c of sociales)it(c.nombre,()=>{
  const r=social(c.entrada)
  if(c.neto===null)expect(r.estado).toBe("no_soportado")
  else{
   expect(r.estado,r.estado==="no_soportado"?r.motivo:"").toBe("requiere_atribucion_anual")
   if(r.estado==="requiere_atribucion_anual"){
    expect(r.peticion.sumaNetoReducidoEuros).toBe(c.neto)
    expect(r.peticion.casoAnual).toBe(c.entrada.casoAnual)
    expect(r.peticion.contribuyente).toBe(c.entrada.contribuyente)
    expect(r.peticion.metodoAtribucion).toBe("pendiente-especificacion-oficial-o-salida-contraste")
    expect(r.formula).toEqual({operacion:"multiplicar",numerador:3,denominador:10,operando:"cuota-integra-autonomica-derivada-resuelta-por-nucleo"})
   }
  }
  expect("importeExactoEuros" in r).toBe(false)
  expect("importePresentadoCentimos" in r).toBe(false)
 })
 it("ejemplo oficial conserva la partición50.000+50.000 estatal y10.000 regional",()=>{
  const r=inversion(inversiones[0].entrada);expect(r.estado).toBe("calculo_parcial")
  if(r.estado==="calculo_parcial"){
   expect(r.baseEstatalAsignadaEuros).toBe("100000");expect(r.baseAragonesaAsignadaEuros).toBe("10000");expect(r.excesoSobreMaximoEstatalEuros).toBe("10000")
   expect(r.obligaciones[0].transmisionDespuesDe).toBe("2028-03-01");expect(r.obligaciones[0].transmisionAntesDe).toBe("2037-03-01")
  }
 })
 it("racional condicional3/10: cuota derivada1.000 produciría300, sin convertir neto4.000 en deducción1.200",()=>{
  const r=social(sociales[0].entrada);expect(r.estado).toBe("requiere_atribucion_anual")
  if(r.estado==="requiere_atribucion_anual"){
   expect(new Decimal(1000).times(r.formula.numerador).div(r.formula.denominador).toFixed()).toBe("300")
   expect("importeExactoEuros" in r).toBe(false)
  }
 })
 it("no cambia precisión Decimal global",()=>{
  const anterior=Decimal.precision;inversion(inversiones[0].entrada);social(sociales[0].entrada);expect(Decimal.precision).toBe(anterior)
 })
})
