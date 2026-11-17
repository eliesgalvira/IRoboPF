import { describe, expect, it } from "@effect/vitest"
import { Effect, Schema } from "effect"
import datos from "./fixtures/asturias-arrendador-hechos-2025.json"
import { CasoTrabajoAlquilerOrdinario2025 } from "../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/contrato"
import { producirSolicitudAsturiasArrendador2025, SolicitudAsturiasArrendadorDerivada } from "../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/asturias-arrendador"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { aplicarDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { marcoPropioB, decimalB } from "./b-conexion-completa-fixtures"
const decode = <T extends object>(input: T) => Schema.decodeUnknownSync(CasoTrabajoAlquilerOrdinario2025)(input, { onExcessProperty: "error" })
function raw(importe="1000.00") {
 const c=structuredClone(datos)
 c.inmuebles[0]!.gastos[0]!.importe=importe
 c.inmuebles[0]!.gastos[0]!.totalFactura=importe
 // Variante positiva: coste exacto 75025 y amortización 2250.75 en ambas rutas.
 // Con gasto impar evita la frontera de medio céntimo del RNR, aún reservada.
 const centimos=BigInt(importe.split('.')[0]!+((importe.split('.')[1]??'').padEnd(2,'0')))
 if(centimos%2n!==0n){
  c.inmuebles[0]!.adquisicion.precio='120040'
  c.inmuebles[0]!.catastro2025.construccion='62500'
  c.inmuebles[0]!.catastro2025.suelo='37500'
 }
 return c
}
const candidato=(importe="1000.00")=>decode(raw(importe))
describe("Asturias unifamiliar: preparación prospectiva sin observaciones",()=>{
 for(const api of ["explicita","canonica"] as const)
 for(const [gasto,esperado] of [["0.00","0"],["200.00","200"],["499.99","499.99"],["500.00","500"],["500.01","500"],["1000.00","500"]] as const)
 it.effect(api+" gasto "+gasto,()=>Effect.gen(function*(){
  const c=candidato(gasto), {asturiasArrendador2025,...anterior}=c
  expect(asturiasArrendador2025).toBeDefined()
  const previo=decode({...anterior,otrasDeducciones:"ninguna"})
  const ejecutar=(x:CasoTrabajoAlquilerOrdinario2025)=>api==="explicita"?liquidarIrpfAnualExplicito(x):liquidarIrpfAnual(x,{modo:"canonico"})
  const a=yield* ejecutar(previo), b=yield* ejecutar(c)
  expect(a.cuotaDiferencial.minus(b.cuotaDiferencial).eq(esperado)).toBe(true)
  expect(b.composicion.deduccionesAutonomicasAplicadas.eq(esperado)).toBe(true)
  expect(b.inmuebles[0]!.amortizacion).toEqual(a.inmuebles[0]!.amortizacion)
  expect(b.aceptacionFiscal).toBe("pendiente")
 }))
 for(const disponible of ["0","40","200","499.99","500","500.01"])
 it("libro común: cuota "+disponible+", una sola aplicación",()=>{
  const c=candidato(), solicitud=producirSolicitudAsturiasArrendador2025(c)!
  const m=marcoPropioB("asturias",c.edad)
  const salida=aplicarDeduccionesTerritoriales2025(solicitud,{...m,caso:{...m.caso,contribuyenteId:c.contribuyenteId},cuotaAutonomica:decimalB(disponible)})
  expect(salida.aplicaciones).toHaveLength(1)
  expect(salida.aplicaciones[0]!.generado).toEqual(racional("500"))
  expect(salida.total).toEqual(racional(disponible==="500.01"?"500":disponible))
  expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[...solicitud.solicitudes,...solicitud.solicitudes]},{...m,caso:{...m.caso,contribuyenteId:c.contribuyenteId}})).toThrow()
 })
 const mutaciones:readonly [string,(c:ReturnType<typeof raw>)=>void][]=[
  ["identidad",c=>{c.asturiasArrendador2025.inmuebleId="ajeno"}],
  ["catastro",c=>{c.asturiasArrendador2025.acreditacion.catastro="ajeno"}],
  ["propietario",c=>{c.asturiasArrendador2025.propietario="ajeno"}],
  ["título",c=>{c.asturiasArrendador2025.titulo="ajeno"}],
  ["territorio",c=>{c.asturiasArrendador2025.localizacion.comunidad="madrid"}],
  ["colectiva",c=>{c.asturiasArrendador2025.tipologia="colectiva"}],
  ["desconocida",c=>{c.asturiasArrendador2025.acreditacion.tipologia="desconocida"}],
  ["error SERPAVI",c=>{c.asturiasArrendador2025.origen="error-consulta"}],
  ["renta",c=>{c.asturiasArrendador2025.precio.rentaMensual="999.99"}],
  ["repercusión",c=>{c.asturiasArrendador2025.precio.gastosPropietarioRepercutidos="1"}],
  ["firma",c=>{c.asturiasArrendador2025.contrato.firma="2024-12-02"}],
  ["fin",c=>{c.asturiasArrendador2025.contrato.hasta="2025-11-30"}],
  ["calendario",c=>{c.asturiasArrendador2025.precio.mensualidades[1]!.fecha="2025-02-30"}],
  ["documento vacío",c=>{c.asturiasArrendador2025.acreditacion.documento.referencia=""}],
  ["documento duplicado",c=>{c.asturiasArrendador2025.acreditacion.documento.referencia=c.asturiasArrendador2025.documento.referencia}],
  ["documento posterior",c=>{c.asturiasArrendador2025.acreditacion.documento.fecha="2026-01-01"}],
  ["pagador",c=>{c.asturiasArrendador2025.pagos[0]!.pagador="ajeno"}],
  ["pago ajeno",c=>{c.asturiasArrendador2025.pagos[0]!.gastoId="ajeno"}],
  ["censo",c=>{c.asturiasArrendador2025.censo.otrosGastosElegibles="desconocido"}],
  ["Madrid con extensión AST",c=>{c.comunidadAutonoma="madrid"}],
  ["AND con extensión AST",c=>{c.comunidadAutonoma="andalucia"}],
  ["declaración contradictoria",c=>{c.otrasDeducciones="ninguna"}],
 ]
 for(const api of ["explicita","canonica"] as const)
 for(const [nombre,cambiar] of mutaciones)it.effect(api+" rechaza "+nombre,()=>Effect.gen(function*(){
  const c=raw();cambiar(c)
  // SAFETY: prueba deliberada de la frontera pública con hechos contradictorios.
  const x=c as CasoTrabajoAlquilerOrdinario2025
  const r=yield* Effect.result(api==="explicita"?liquidarIrpfAnualExplicito(x):liquidarIrpfAnual(x,{modo:"canonico"}))
  expect(r._tag).toBe("Failure")
 }))
 it("cierra campos, no admite importe ni referencia nula ni hereda campos de Madrid",()=>{
  const c=raw()
  for(const k of ["importe","cuota","base","rentaMensual","resguardo"])
   expect(()=>decode({...c,asturiasArrendador2025:{...c.asturiasArrendador2025,[k]:"500"}})).toThrow()
  expect(()=>decode({...c,asturiasArrendador2025:null})).toThrow()
  const solicitud=producirSolicitudAsturiasArrendador2025(candidato())!
  const copiar=Schema.decodeUnknownSync(SolicitudAsturiasArrendadorDerivada)(structuredClone(solicitud),{onExcessProperty:"error"})
  expect(Schema.toEquivalence(SolicitudAsturiasArrendadorDerivada)(copiar,copiar)).toBe(true)
 })
})
