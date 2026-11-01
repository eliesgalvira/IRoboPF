// Ejecutar desde una copia privada de tests, ajustando únicamente los imports.
import {describe,it,expect} from 'vitest'
import {calcularDeduccionesAutonomicasAplicadas as aplicada,calcularDeduccionesConsignadas as consignada} from '../../../../../lib/dominio/irpf/deducciones-autonomicas-aplicadas'
import {evaluarNacimientoMadrid,calcularGuarderiaMurciaParcial} from '../../../../../lib/dominio/irpf/deducciones/contratos-2025'
const md={ejercicio:2025,territorio:'madrid'} as const
const mu={ejercicio:2025,territorio:'murcia'} as const
const ctx={...md,contribuyente:'titular-a',modalidad:'individual'} as const
const evento=(ejercicio:number,hijos=['h1','h2'],progenitoresConvivientes=['titular-a'])=>({ejercicio,hijos,progenitoresConvivientes})
const historia=(desde:number,general=30930,familiar=61860)=>Array.from({length:2026-desde},(_,i)=>({ejercicio:desde+i,general,ahorro:0,basesUnidadFamiliar:[familiar]}))
const gasto=(hijo:string,custodia=5000,ayudas=0,titulares=['titular-a'])=>({hijo,custodia,ayudas,titulares,alimentacion:0,vestuarioEscolar:0})
describe('Revisión independiente F: contratos separados y colisiones de hechos',()=>{
 it.fails('parto múltiple 2025: el contador pierde el suplemento',()=>expect(aplicada({madridHijosNacimientoAdopcion:2},md)).toBe(2886.8))
 it.fails('guardería: el tope corresponde a cada descendiente',()=>expect(aplicada({'murcia_gastos_guarderia:cumple':true,'murcia_gastos_guarderia:base':10000},mu)).toBe(2000))
 it('Madrid: contrato parcial distingue 2025/2024/2023/2022',()=>{
  for(const [anio,importe] of [[2025,2886.8],[2024,1443.4],[2023,1443.4]]) expect(evaluarNacimientoMadrid(ctx,evento(anio),historia(anio))).toMatchObject({estado:'calculo_parcial',importe})
  expect(evaluarNacimientoMadrid(ctx,evento(2022),historia(2022)).estado).toBe('excluida')
 })
 it('Madrid: igualdad de renta admitida; céntimo superior excluido',()=>{
  expect(evaluarNacimientoMadrid(ctx,evento(2025),historia(2025))).toMatchObject({importe:2886.8})
  for(const h of [historia(2025,30930.01),historia(2025,30930,61860.01)]) expect(evaluarNacimientoMadrid(ctx,evento(2025),h).estado).toBe('excluida')
  expect(evaluarNacimientoMadrid(ctx,evento(2024),[]).estado).toBe('no_soportado')
 })
 it('Madrid: dos convivientes individual y conjunta no usan el mismo divisor',()=>{
  const e=evento(2025,['h1','h2'],['titular-a','titular-b'])
  expect(evaluarNacimientoMadrid(ctx,e,historia(2025))).toMatchObject({importe:1443.4})
  expect(evaluarNacimientoMadrid({...ctx,modalidad:'conjunta'},e,historia(2025,37322.2))).toMatchObject({importe:2886.8})
 })
 it('Murcia: misma base agregada, derechos diferentes según descendientes',()=>{
  const c={...ctx,territorio:'murcia'} as const
  expect(calcularGuarderiaMurciaParcial(c,[gasto('h1'),gasto('h2')],30000)).toMatchObject({estado:'calculo_parcial',importe:2000})
  expect(calcularGuarderiaMurciaParcial(c,[gasto('h1',10000)],30000)).toMatchObject({importe:1000})
  expect(calcularGuarderiaMurciaParcial(c,[gasto('h1',5000,1000)],30000)).toMatchObject({importe:800})
  expect(calcularGuarderiaMurciaParcial(c,[gasto('h1'),gasto('h1')],30000).estado).toBe('no_soportado')
  expect(calcularGuarderiaMurciaParcial(c,[gasto('h1')],30000.01).estado).toBe('excluida')
  expect(calcularGuarderiaMurciaParcial({...c,modalidad:'conjunta'},[gasto('h1')],50000)).toMatchObject({importe:1000})
  expect(calcularGuarderiaMurciaParcial({...c,modalidad:'conjunta'},[gasto('h1')],50000.01).estado).toBe('excluida')
  expect(calcularGuarderiaMurciaParcial(c,[gasto('h1',5000,0,['titular-a','titular-b'])],30000)).toMatchObject({importe:500})
 })
 it('Consignación anual: conserva importes acreditados externamente',()=>{
  expect(consignada({'madrid_nacimiento_adopcion_hijos:cumple':true,'madrid_nacimiento_adopcion_hijos:importe':2886.8},md)).toBe(2886.8)
  expect(consignada({'murcia_gastos_guarderia:cumple':true,'murcia_gastos_guarderia:importe':2000},mu)).toBe(2000)
  expect(consignada({madridHijosNacimientoAdopcion:2},md)).toBe(0)
 })
})
