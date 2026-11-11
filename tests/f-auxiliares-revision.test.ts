import { it, expect } from 'vitest'
import { Effect, Result } from 'effect'
import Decimal from 'decimal.js'
import { solicitud, magnitudes, derechos } from './f-auxiliares-revision-fixtures'
import { evaluarAnualF2025 as evaluar } from '../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual'
import { cuantiaGuarderiaMurciaExacta as mur, cuantiaNacimientoMadridExacta as mad } from '../lib/dominio/irpf/deducciones/auxiliares-cuantias-exactas-2025'
import { racional } from '../lib/dominio/irpf/deducciones/anual-territorial-racional'
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import { casoUniformeC36, casoExplicitoC36 } from './c36-conexion-anual.fixtures'

// Independent legal oracles: Madrid art4(1-3)/18; Murcia art1.Tres and AEAT2025.
// Fixture constructors adapted from author, assertions and adverse facts are reviewer's.
function rat(x: {numeradorEuros:string,divisor:string}|undefined,n:bigint,d=1n){
 expect(x).toBeDefined(); if(x===undefined)throw Error('racional ausente')
 expect(BigInt(x.numeradorEuros)*d).toBe(n*BigInt(x.divisor))
}
function reject(s: ReturnType<typeof solicitud>,m= magnitudes(s.codigo.startsWith('madrid')?'madrid':'murcia')){
 const r=evaluar(s,m);expect(r.estado).toBe('no_soportado');expect(r.importeExactoRacional).toBeUndefined()
}
for(const [cents,div] of [[1n,1n],[499999n,1n],[500001n,1n],[999999n,2n],[750001n,2n]] as const)
 it(`núcleo Murcia ${cents}/${div}: 20% propio limitado por pagadores`,()=>{
  const cap=100000n/div, n=cents < cap*5n ? cents : cap*5n
  rat(mur(racional(String(cents),'100'),Number(div)),n,500n)
 })
for(const n of [1,2,3])for(const div of [1,2])
 it(`núcleo Madrid ${n} hijos /${div}`,()=>rat(mad(n,n>1,div),72170n*BigInt(n)*(n>1?2n:1n),100n*BigInt(div)))
for(const t of ['madrid','murcia'] as const){
 for(const base of [t==='madrid'?'30930':'30000',(t==='madrid'?'30930':'30000')+'.'+ '0'.repeat(70)+'1'])
 it(`${t} umbral exacto ${base}`,()=>{
  const r=evaluar(solicitud(t),magnitudes(t,false,base));expect(r.estado).toBe(base.includes('.')?'excluida':'calculo_parcial')
 })
 it(`${t}: base ahorro incluida`,()=>{
 const m=magnitudes(t,false,t==='madrid'?'30929':'29999');expect(evaluar(solicitud(t),{...m,baseAhorro:new Decimal('1.01')}).estado).toBe('excluida')
 })
}
it('Madrid: trillizos 4330.20, convivencia de dos padres 2165.10',()=>{
 const s=solicitud('madrid',true),m=magnitudes('madrid',true),d=derechos('madrid',true).descendientes[0]!
 const ids=['s-2','s-4','s-5'];const a=s.auxiliares!
 const r=evaluar({...s,auxiliares:{...a,miembrosUnidad:['s-1',...ids],progenitores:ids.map(hijo=>({...a.progenitores[0]!,hijo})),eventos:[{...a.eventos[0]!,hijos:ids}]}},{...m,caso:{...m.caso,derechosMinimos:{...derechos('madrid',true),descendientes:ids.map(sujetoId=>({...d,sujetoId}))}}})
 rat(r.importeExactoRacional,216510n,100n)
})
for(const delta of ['2023-02-01','2024-02-01','2026-02-01','2025-02-29'])it(`Madrid reserva cronología ${delta}`,()=>{
 const s=solicitud('madrid'),a=s.auxiliares!;reject({...s,auxiliares:{...a,eventos:[{...a.eventos[0]!,fecha:delta}]}})
})
for(const field of ['casado','rentaHijo','mayorEdad','unidad','eventoDuplicado','hijoDuplicado'] as const)it(`Madrid reserva ${field}`,()=>{
 const s=solicitud('madrid'),a=s.auxiliares!,m=magnitudes('madrid'),d=derechos('madrid')
 const ss=field==='casado'?{...s,auxiliares:{...a,estadoCivil:'casado' as const}}:field==='unidad'?{...s,auxiliares:{...a,miembrosUnidad:['s-1']}}:field==='eventoDuplicado'?{...s,auxiliares:{...a,eventos:[...a.eventos,...a.eventos]}}:field==='hijoDuplicado'?{...s,auxiliares:{...a,eventos:[{...a.eventos[0]!,hijos:['s-2','s-2']}]}}:s
 const mm=field==='rentaHijo'||field==='mayorEdad'?{...m,caso:{...m.caso,derechosMinimos:{...d,descendientes:d.descendientes.map(x=>({...x,rentasNoExentasCentimos:field==='rentaHijo'?1:0,edadDevengo:field==='mayorEdad'?18:0}))}}}:m
 reject(ss,mm)
})
for(const concepto of ['custodia','matricula','preinscripcion','alimentacion','vestuario_exclusivo_escolar'])it(`Murcia concepto ${concepto}: 27.774 exactos netos`,()=>{
 const s=solicitud('murcia',false,'150.01'),p=s.hechos.pagos![0]!
 rat(evaluar({...s,hechos:{pagos:[{...p,concepto,ayudasEUR:'11.14'}]}},magnitudes('murcia')).importeExactoRacional,13887n,500n)
})
it('Murcia: dos hijos, tope 1000 por hijo, no 1000 global',()=>{
 const s=solicitud('murcia',false,'7000'),a=s.auxiliares!,p=s.hechos.pagos![0]!,m=magnitudes('murcia'),d=derechos('murcia')
 rat(evaluar({...s,hechos:{pagos:[p,{...p,id:'p2',factura:'f2',beneficiarioId:'s-4'}]},auxiliares:{...a,progenitores:[...a.progenitores,{...a.progenitores[0]!,hijo:'s-4'}],servicios:[...a.servicios,{...a.servicios[0]!,pagoId:'p2'}]}},{...m,sujetosConMinimo:['s-2','s-4'],caso:{...m.caso,derechosMinimos:{...d,descendientes:[...d.descendientes,{...d.descendientes[0]!,sujetoId:'s-4'}]}}}).importeExactoRacional,2000n)
})
for(const variant of ['externo','gananciales','sinEtapa','sinMinimo','sinConvivencia','fallecido','ayudaExceso','concepto','art81','servicioAnterior','certificadoVencido'] as const)it(`Murcia reserva ${variant}`,()=>{
 const s=solicitud('murcia'),a=s.auxiliares!,p=s.hechos.pagos![0]!,m=magnitudes('murcia'),d=derechos('murcia')
 const ss={...s,hechos:{pagos:[{...p,...(variant==='externo'?{pagador:'s-3'}:variant==='ayudaExceso'?{ayudasEUR:'101'}:variant==='concepto'?{concepto:'transporte'}:{})}]},auxiliares:{...a,...(variant==='gananciales'?{regimenPagos:'gananciales' as const}:variant==='sinEtapa'?{centros:[{...a.centros[0]!,primerCiclo:[]}]}:variant==='certificadoVencido'?{centros:[{...a.centros[0]!,primerCiclo:[{desde:'2024-01-01',hasta:'2024-12-31'}]}]}:variant==='servicioAnterior'?{servicios:[{pagoId:'p1',periodo:{desde:'2025-01-01',hasta:'2025-03-31'}}]}:{})}}
 const descendientes=d.descendientes.map(x=>{
  const sujeto=variant==='fallecido'?{...x,vivoAlDevengo:false}:x
  return {...sujeto,titulares:x.titulares.map(t=>variant==='sinConvivencia'?{...t,relacion:'dependencia-economica' as const}:t)}
 })
 const casoBase={...m.caso,derechosMinimos:{...d,descendientes}}
 const caso=variant==='art81'?{...casoBase,maternidad2025:undefined}:casoBase
 const mm=variant==='sinMinimo'?{...m,caso,sujetosConMinimo:[]}:{...m,caso}
 // SAFETY: prueba adversa interna: sólo vivoAlDevengo=false viola el literal del contrato para comprobar su rechazo; las demás magnitudes proceden de la fixture tipada.
 const magnitudesAdversas = mm as ReturnType<typeof magnitudes>
 if (variant === 'art81') {
  // Una propiedad opcional undefined no representa un libro ni una solicitud de maternidad.
  const resultado = evaluar(ss, magnitudesAdversas)
  expect(resultado).toEqual(evaluar(ss, m))
  expect(resultado.estado).toBe('calculo_parcial')
  rat(resultado.importeExactoRacional, 10001n, 500n)
 } else reject(ss,magnitudesAdversas)
})
for(const api of ['uniforme','explicita'] as const)for(const t of ['madrid','murcia'] as const)it(`${api}/${t}: cuota se reduce una sola vez`,()=>{
 const s=solicitud(t,false,t==='murcia'?'333.33':'100.01'),d=derechos(t,false,api==='uniforme'?2605600:2800000)
 const c={...casoUniformeC36(),comunidadAutonoma:t,derechosMinimos:d},e={...casoExplicitoC36([]),comunidadAutonoma:t,familiaresConDerechoMinimo:'segun-derechos' as const,derechosMinimos:d}
 const r=api==='uniforme'?Effect.runSync(liquidarIrpfAnual({...c,deduccionesTerritoriales2025:{solicitudes:[s]}},{modo:'canonico'})):Effect.runSync(liquidarIrpfAnualExplicito({...e,deduccionesTerritoriales2025:{solicitudes:[s]}}))
 const b=api==='uniforme'?Effect.runSync(liquidarIrpfAnual(c,{modo:'canonico'})):Effect.runSync(liquidarIrpfAnualExplicito(e))
 rat(r.deduccionesTerritoriales2025?.total,t==='madrid'?72170n:33333n,t==='madrid'?100n:500n)
 const euros=(x:typeof r)=>'cuotaDiferencialCentimos' in x?new Decimal(x.cuotaDiferencialCentimos).div(100):new Decimal(x.cuotaDiferencial)
 expect(euros(b).minus(euros(r)).toFixed(2)).toBe(t==='madrid'?'721.70':'66.67')
})
function rechazoAnual<A, E>(efecto: Effect.Effect<A, E>): E {
 const resultado = Effect.runSync(Effect.result(efecto))
 expect(Result.isFailure(resultado)).toBe(true)
 if (Result.isSuccess(resultado)) throw new Error('El censo contradictorio produjo una liquidación')
 return resultado.failure
}
for(const api of ['uniforme','explicita'] as const)it(`BLOQUEANTE Madrid/${api}: un abuelo no es padre del nacido`,()=>{
 const s=solicitud('madrid'),d=derechos('madrid',false,api==='uniforme'?2605600:2800000)
 const nieto={...d,descendientes:d.descendientes.map(x=>({...x,titulares:x.titulares.map(t=>({...t,grado:2}))}))}
 const r=api==='uniforme'?rechazoAnual(liquidarIrpfAnual({...casoUniformeC36(),comunidadAutonoma:'madrid',derechosMinimos:nieto,deduccionesTerritoriales2025:{solicitudes:[s]}},{modo:'canonico'})):rechazoAnual(liquidarIrpfAnualExplicito({...casoExplicitoC36([]),comunidadAutonoma:'madrid',familiaresConDerechoMinimo:'segun-derechos',derechosMinimos:nieto,deduccionesTerritoriales2025:{solicitudes:[s]}}))
 // Art4.3 reserves the deduction to parents; a degree2 minimum is not filiation.
 if (!('deduccionesTerritoriales2025' in r)) throw new Error('El rechazo perdió el libro territorial')
 expect(r.deduccionesTerritoriales2025?.total).toEqual(racional('0'))
})
for(const api of ['uniforme','explicita'] as const)it(`BLOQUEANTE Madrid/${api}: abuelo conviviente no divide el derecho del padre`,()=>{
 const s=solicitud('madrid',true),d=derechos('madrid',true,api==='uniforme'?2605600:2800000)
 const grafo={...d,descendientes:d.descendientes.map(x=>({...x,titulares:x.titulares.map(t=>({...t,grado:t.titularId==='s-1'?1:2}))}))}
 const r=api==='uniforme'?rechazoAnual(liquidarIrpfAnual({...casoUniformeC36(),comunidadAutonoma:'madrid',derechosMinimos:grafo,deduccionesTerritoriales2025:{solicitudes:[s]}},{modo:'canonico'})):rechazoAnual(liquidarIrpfAnualExplicito({...casoExplicitoC36([]),comunidadAutonoma:'madrid',familiaresConDerechoMinimo:'segun-derechos',derechosMinimos:grafo,deduccionesTerritoriales2025:{solicitudes:[s]}}))
 // A claimed parent census contradicting degree2 must be rejected before paying;
 // a producer that derives parents instead could grant the full 721.70, never half.
 if (!('deduccionesTerritoriales2025' in r)) throw new Error('El rechazo perdió el libro territorial')
 expect(r.deduccionesTerritoriales2025?.total).not.toEqual(racional('360.85'))
})
