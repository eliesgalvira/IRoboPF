import { describe, expect, it } from '@effect/vitest'
import { Effect, Schema } from 'effect'
import nuevos from './fixtures/trabajo-alquiler-suelo-desconocido-2025.json'
import { CasoTrabajoAlquilerOrdinario2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/contrato'
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import { producirSolicitudMadridArrendador2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/madrid-arrendador'
import { evaluarAmpliacionF2025 } from '../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/index'
import { consumirCuotaAnualF2025 } from '../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-cuota'
import { racional } from '../lib/dominio/irpf/deducciones/anual-territorial-racional'
type EntradaPrueba = ReturnType<typeof hechos> | CasoTrabajoAlquilerOrdinario2025 | Omit<CasoTrabajoAlquilerOrdinario2025, 'madridArrendador2025'>
const decode=(x:EntradaPrueba)=>Schema.decodeUnknownSync(CasoTrabajoAlquilerOrdinario2025)(x,{onExcessProperty:'error'})
function hechos(importe='1000.00') {
 const origen=structuredClone(nuevos.find(x=>x.entrada.comunidadAutonoma==='madrid')!.entrada)
 const v=origen.inmuebles[0]!, k=v.contrato
 v.gastos[0]!.importe=importe;v.gastos[0]!.totalFactura=importe
 return {...origen,otrasDeducciones:'solo-madrid-gastos-arrendamiento-viviendas',madridArrendador2025:{
  inmuebleId:v.id,catastro:v.catastro,propietario:v.titular,titulo:v.titulo,contratoId:k.id,documentoContrato:k.documento,
  localizacion:{comunidad:'madrid',documento:'sintetico:localizacion-madrid'},
  resguardo:{referencia:k.fianzaDepositada,organismo:'agencia-vivienda-social-comunidad-madrid',inmuebleId:v.id,catastro:v.catastro,
   contratoId:k.id,arrendador:k.arrendador,arrendatario:k.arrendatario,fechaDeposito:'2024-12-02',fechaResguardo:'2024-12-03',posesion:'copia'},
  pagos:v.gastos.map(g=>({gastoId:g.id,pagador:v.titular,soportePago:'sintetico:pago-'+g.id})),
 }}
}
const candidato=(importe='1000.00')=>decode(hechos(importe))
const sinSolicitud=(c:CasoTrabajoAlquilerOrdinario2025)=>{
 const {madridArrendador2025,...resto}=c
 expect(madridArrendador2025).toBeDefined()
 return decode({...resto,otrasDeducciones:'ninguna'})
}
describe('Preparación Madrid arrendador: no son observaciones Open',()=>{
 for(const modo of ['efectivas','estimadas-perfil-uniforme'] as const)
 for(const [gasto,deduccion] of [['1000.00','100'],['2000.00','154.65']] as const)
 it.effect(modo+' reparación '+gasto,()=>Effect.gen(function*(){
  const c=candidato(gasto), previo=sinSolicitud(c)
  const ejecutar=(x:CasoTrabajoAlquilerOrdinario2025)=>modo==='efectivas'?liquidarIrpfAnualExplicito(x):liquidarIrpfAnual(x,{modo:'canonico'})
  const antes=yield* ejecutar(previo), despues=yield* ejecutar(c)
  expect(antes.cuotaDiferencial.minus(despues.cuotaDiferencial).eq(deduccion)).toBe(true)
  expect(despues.composicion.deduccionesAutonomicasAplicadas.eq(deduccion)).toBe(true)
  expect(despues.inmuebles[0]!.amortizacion).toEqual(antes.inmuebles[0]!.amortizacion)
  expect(despues.composicion.cotizaciones.naturaleza).toBe(modo)
  expect(despues.aceptacionFiscal).toBe('pendiente')
  if(modo==='efectivas') {
   expect(despues.rastroOperativo!.deduccionesAutonomicasAplicadas!.eq(deduccion)).toBe(true)
   expect(despues.rastro!.pasos[0]!.lineasCalculo.some(l=>l.origen?.siteId==='alquiler.open.deduccion-autonomica')).toBe(true)
  } else expect(despues.politicaOpen).toBeUndefined()
 }))
 it('Cuota escasa: el libro publicado consume una sola vez y no crea arrastre',()=>{
  const c=candidato(), solicitud=producirSolicitudMadridArrendador2025(c)!.solicitudes[0]!
  if(solicitud.lote!=='F-ampliado')throw Error('lote')
  const resultado=evaluarAmpliacionF2025({tipo:'territorial_f_ampliacion_2025',codigo:'madrid_gastos_arrendamiento_viviendas',
   contexto:{ejercicio:2025,territorio:'madrid',contribuyente:c.contribuyenteId,modalidad:'individual',declarantes:[c.contribuyenteId]},hechos:solicitud.hechos})
  const libro=consumirCuotaAnualF2025(racional('40'),[solicitud.codigo],[resultado])
  expect(libro.total).toEqual(racional('40'));expect(libro.disponible).toEqual(racional('0'))
  expect(libro.aplicaciones).toHaveLength(1)
  expect(libro.aplicaciones[0]!.generado).toEqual(racional('100'))
  expect(libro.aplicaciones[0]!.pendiente).toEqual(racional('60'))
  expect(libro.aplicaciones[0]!.arrastre).toBeUndefined()
 })
 for(const cambiar of [
  (c:ReturnType<typeof hechos>)=>{c.madridArrendador2025.propietario='otro'},
  (c:ReturnType<typeof hechos>)=>{c.madridArrendador2025.resguardo.contratoId='otro'},
  (c:ReturnType<typeof hechos>)=>{c.madridArrendador2025.resguardo.arrendatario='otro'},
  (c:ReturnType<typeof hechos>)=>{c.madridArrendador2025.resguardo.catastro='otro'},
  (c:ReturnType<typeof hechos>)=>{c.madridArrendador2025.resguardo.fechaDeposito='2024-02-30'},
  (c:ReturnType<typeof hechos>)=>{c.madridArrendador2025.resguardo.fechaResguardo='2026-01-01'},
  (c:ReturnType<typeof hechos>)=>{c.madridArrendador2025.resguardo.fechaDeposito='2024-11-30'},
  (c:ReturnType<typeof hechos>)=>{c.madridArrendador2025.pagos.push(c.madridArrendador2025.pagos[0]!)},
  (c:ReturnType<typeof hechos>)=>{c.madridArrendador2025.pagos[0]!.pagador='otro'},
 ])it.effect('Contradicción factual '+cambiar.toString(),()=>Effect.gen(function*(){
  const raw=hechos();cambiar(raw)
  // SAFETY: caso deliberadamente contradictorio; la API pública debe validarlo sin saneamiento previo.
  const resultado=yield* Effect.result(liquidarIrpfAnualExplicito(raw as CasoTrabajoAlquilerOrdinario2025))
  expect(resultado._tag).toBe('Failure')
 }))
 it('No admite organismo distinto ni importe/base/cuota de entrada',()=>{
  const c=hechos()
  expect(()=>decode({...c,madridArrendador2025:{...c.madridArrendador2025,resguardo:{...c.madridArrendador2025!.resguardo,organismo:'otro'}}})).toThrow()
  for(const clave of ['importe','base','cuota'])expect(()=>decode({...c,madridArrendador2025:{...c.madridArrendador2025,[clave]:'100'}})).toThrow()
 })
})
