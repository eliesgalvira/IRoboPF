import {it,expect} from 'vitest'
import Decimal from 'decimal.js'
import {Effect} from 'effect'
import {aplicarDeduccionesTerritoriales2025 as aplicar} from '../lib/dominio/irpf/deducciones/anual-territorial'
import {liquidarIrpfAnual as uniforme,liquidarIrpfAnualExplicito as explicito} from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import {magnitudesConexionC36,nacimientoConexionC36,casoUniformeC36,casoExplicitoC36,derechosConexionC36} from './c36-conexion-anual.fixtures.ts'
Decimal.set({precision:80})
// Oráculo independiente: aritmética entera decimal, (pago-ayuda-reembolso)/(5*atribución).
function fraction(s){const [a,b='']=s.split('.');return [BigInt(a+b),10n**BigInt(b.length)]}
function oracle(p,a='0',re='0',share=1n,cap='1000000'){
 const [pn,pd]=fraction(p),[an,ad]=fraction(a),[rn,rd]=fraction(re),[cn,cd]=fraction(cap)
 let n=pn*ad*rd-an*pd*rd-rn*pd*ad,d=pd*ad*rd*5n*share
 if(n>500n*d)n=500n*d
 if(n*cd>cn*d){n=cn;d=cd}return [n,d]
}
function eq(actual,[n,d]){expect(BigInt(actual.numeradorEuros)*d).toBe(n*BigInt(actual.divisor))}
function setup(p='1739.13',regimen='sin_matrimonio',age=75){
 const template=nacimientoConexionC36(),m=magnitudesConexionC36();m.caso.situacionFamiliar.edad=age;m.cuotaAutonomica=new Decimal(1000000)
 const pago={id:'p-review',fecha:'2025-12-31',pagador:'s-1',perceptor:'TGSS',factura:'TGSS-review',importe:p,ayudasExentas:'0',reembolsos:'0',medio:'transferencia'}
 const q={desde:'2025-12-01',hasta:'2025-12-31',pago,ayudas:[],censoAyudas:'completo'}
 const c={id:'laboral',empleador:'s-1',empleado:'00000000T',vivienda:{id:'habitual',ocupante:'s-1',desde:'2025-01-01',hasta:'2025-12-31',documento:'padron-declarado'},altas:[{desde:'2025-01-01',hasta:'2025-12-31',empleador:'s-1',empleado:'00000000T',vivienda:'habitual',documento:'TGSS-alta',sistema:'especial_empleados_hogar'}],cuotas:[q]}
 const s={lote:'C36',codigo:'canarias_cuotas_seguridad_social_empleados_hogar',hechos:{...template.hechos,personas:[],censoDescendientes:[],contribuyente:{...template.hechos.contribuyente,nacimientoContribuyente:`${2025-age}-01-01`},registroHogar:{consulta:'registro-declarado',censo:'completo_cuotas_pagos_ayudas_altas_2025',civil:{desde:'2025-01-01',hasta:'2025-12-31',documento:'civil-declarado',regimen,conyuge:regimen==='sin_matrimonio'?'':'s-3'},contratos:[c]}}}
 return {s,m,c,q,pago}
}
function run(x){return aplicar({solicitudes:[x.s]},x.m)}
for(const reg of ['sin_matrimonio','separacion','gananciales'])for(const p of ['0.01','1739.13','2499.99','2500','2500.01','4999.99','5000','7001'])it(`racional ${reg} ${p}`,()=>{eq(run(setup(p,reg)).total,oracle(p,'0','0',reg==='gananciales'?2n:1n))})
for(const cap of ['0','0.00000000000000000001','123.456789012345678901','347.824691357802469135780246913578','500'])it(`cuota exacta ${cap}`,()=>{const x=setup();x.m.cuotaAutonomica=new Decimal(cap);eq(run(x).total,oracle(x.pago.importe,'0','0',1n,cap))})
for(const reg of ['sin_matrimonio','gananciales'])for(const exenta of ['si','no'])it(`ayudas ${reg} ${exenta}`,()=>{const x=setup('2037.77',reg);x.q.ayudas.push({id:'ayuda',resolucion:'acto',concedente:'Administracion Publica',concesion:'2025-01-01',importe:'157.12',exenta});x.pago.ayudasExentas=exenta==='si'?'157.12':'0';x.pago.reembolsos='12.01';eq(run(x).total,oracle(x.pago.importe,x.pago.ayudasExentas,x.pago.reembolsos,reg==='gananciales'?2n:1n))})
it('dos empleos simultáneos límite agregado',()=>{const x=setup('1801');const c=structuredClone(x.c);c.id='otro';c.empleado='00000001R';c.altas[0].empleado=c.empleado;c.altas[0].documento='alta-otra';c.cuotas[0].pago.id='otro';c.cuotas[0].pago.factura='recibo-otro';x.s.hechos.registroHogar.contratos.push(c);eq(run(x).total,[500n,1n])})
for(const income of ['46455','46455.00000000000000000001','9999999'])it(`sin límite renta hogar ${income}`,()=>{const x=setup();x.m.baseGeneral=new Decimal(income);x.m.basesLiquidables.general=new Decimal(income);eq(run(x).total,oracle(x.pago.importe))})
for(const [age,disc,nature,ok] of [[74,'SinDiscapacidad','fisica_sensorial',false],[75,'SinDiscapacidad','fisica_sensorial',true],[65,'Discapacidad65OMas','fisica_sensorial',false],[66,'Discapacidad65OMas','fisica_sensorial',true],[66,'Discapacidad33a64','fisica_sensorial',false],[66,'Discapacidad33a64','psiquica',true]])it(`edad ${age} ${disc} ${nature}`,()=>{const x=setup('987.65','sin_matrimonio',age);x.m.caso.situacionFamiliar.discapacidad={_tag:disc,necesitaAyudaOMovilidadReducida:false};x.s.hechos.contribuyente.naturalezaDiscapacidad=nature;x.s.hechos.contribuyente.resolucionDiscapacidad='resolucion';if(ok)eq(run(x).total,oracle('987.65'));else expect(()=>run(x)).toThrow(/habilitante/)})
it('mínimo y trabajo propios habilitan a menor de75',()=>{const x=setup('987.65','sin_matrimonio',40),d=derechosConexionC36();d.territorio='canarias';x.m.caso.derechosMinimos=d;x.m.sujetosConMinimo=['s-2'];x.m.atribucionesMinimo=[{sujetoId:'s-2',titulares:['s-1']}];x.s.hechos.personas=nacimientoConexionC36().hechos.personas;x.s.hechos.censoDescendientes=['s-2'];eq(run(x).total,oracle('987.65'));x.m.rentasTrabajoAnuales.integroTrabajo=new Decimal(0);expect(()=>run(x)).toThrow(/habilitante/)})
const bads={
 'DNI control':x=>x.c.empleado='00000000R','empleado ausente':x=>x.c.empleado='',
 'empleado propio':x=>x.c.empleado='s-1','pago otro':x=>x.pago.pagador='otro',
 'TGSS ajena':x=>x.pago.perceptor='otra','empleador ajeno':x=>x.c.empleador='s-3',
 'alta incompleta':x=>x.c.altas[0].desde='2025-12-02','vivienda insuficiente':x=>x.c.vivienda.hasta='2025-12-30',
 'civil parcial':x=>x.s.hechos.registroHogar.civil.hasta='2025-12-30',
 'pago 2026':x=>x.pago.fecha='2026-01-01','pago prematuro':x=>x.pago.fecha='2025-12-30',
 'cuota 2024':x=>x.q.desde='2024-12-01','fecha imposible':x=>x.pago.fecha='2025-02-29',
 'ayuda no conciliada':x=>x.pago.ayudasExentas='1',
 'territorio ajeno':x=>x.m.caso.comunidadAutonoma='illes-balears',
 'ejercicio ajeno':x=>x.m.caso.anio=2024,
 'registro ausente':x=>delete x.s.hechos.registroHogar,
 'recibo duplicado':x=>x.c.cuotas.push(structuredClone(x.q)),
 'periodo duplicado':x=>{const q=structuredClone(x.q);q.pago.id='otro';q.pago.factura='otra';x.c.cuotas.push(q)},
 'asistencia bloqueada':x=>x.s.codigo='canarias_familiares_dependientes_discapacidad',
}
for(const [name,change]of Object.entries(bads))it(`adverso ${name}`,()=>{const x=setup();change(x);expect(()=>run(x)).toThrow()})
it('no consume dos veces cuota ni recibo entre solicitudes',()=>{const x=setup();expect(()=>aplicar({solicitudes:[x.s,structuredClone(x.s)]},x.m)).toThrow()})
for(const reg of ['sin_matrimonio','separacion','gananciales'])for(const p of ['987.60','2500','5000.01'])it(`ambas API consumo único ${reg} ${p}`,()=>{
 const x=setup(p,reg);const u=casoUniformeC36();u.situacionFamiliar.edad=75
 const e={...casoExplicitoC36([]),edad:75}
 const ub=Effect.runSync(uniforme(u,{modo:'canonico'})),eb=Effect.runSync(explicito(e))
 const ur=Effect.runSync(uniforme({...u,deduccionesTerritoriales2025:{solicitudes:[x.s]}},{modo:'canonico'})),er=Effect.runSync(explicito({...e,deduccionesTerritoriales2025:{solicitudes:[x.s]}}))
 const expected=oracle(p,'0','0',reg==='gananciales'?2n:1n);eq(ur.deduccionesTerritoriales2025.total,expected);eq(er.deduccionesTerritoriales2025.total,expected)
 const cents=Number((expected[0]*100n*2n+expected[1])/(expected[1]*2n));expect(ub.cuotaLiquidaCentimos-ur.cuotaLiquidaCentimos).toBe(cents);expect(new Decimal(eb.cuotaLiquidaLegal).minus(er.cuotaLiquidaLegal).mul(expected[1].toString()).eq(expected[0].toString())).toBe(true)
})
for(const name of ['registro ausente','pago 2026','DNI control','asistencia bloqueada'])it(`ambas API rechazo ${name}`,()=>{const x=setup();bads[name](x);const u=casoUniformeC36();u.situacionFamiliar.edad=75;const a=Effect.runSync(Effect.flip(uniforme({...u,deduccionesTerritoriales2025:{solicitudes:[x.s]}},{modo:'canonico'})));const b=Effect.runSync(Effect.flip(explicito({...casoExplicitoC36([]),edad:75,deduccionesTerritoriales2025:{solicitudes:[x.s]}})));expect(a._tag).toBe('ResultadoNoSoportado');expect(b._tag).toBe('ResultadoNoSoportado')})

it('rechaza pago fraccional fuera contrato céntimos',()=>{const x=setup('1739.123');expect(()=>run(x)).toThrow(/inválidos/)})
for(const day of ['2025-01-01','2025-12-31'])it(`periodo y pago frontera ${day}`,()=>{const x=setup('1213.17');x.q.desde=day;x.q.hasta=day;x.pago.fecha=day;eq(run(x).total,oracle('1213.17'))})
it('dos cuotas sucesivas mismo empleado suman una sola base',()=>{const x=setup('1397.13');x.q.desde='2025-01-01';x.q.hasta='2025-01-31';x.pago.fecha='2025-01-31';const q=structuredClone(x.q);q.desde='2025-02-01';q.hasta='2025-02-28';q.pago.fecha='2025-02-28';q.pago.id='segunda';q.pago.factura='segunda';q.pago.importe='1239.41';x.c.cuotas.push(q);eq(run(x).total,[500n,1n])})
for(const date of ['2024-12-31','2026-01-01'])it(`ayuda ajena a2025 ${date}`,()=>{const x=setup();x.q.ayudas.push({id:'ayuda',resolucion:'acto',concedente:'Administracion',concesion:date,importe:'1',exenta:'si'});x.pago.ayudasExentas='1';expect(()=>run(x)).toThrow(/ayuda fuera/)})
it('ambas API cuota nula no genera crédito y duplicado rechaza',()=>{
 const x=setup('4000'),u=casoUniformeC36();u.situacionFamiliar.edad=75;u.rendimientos.trabajo[0].importeIntegroCentimos=100000
 const e={...casoExplicitoC36([]),edad:75};e.trabajo.rendimientos[0].integro='1000'
 for(const [name,call]of [['uniforme',(solicitudes)=>uniforme({...u,deduccionesTerritoriales2025:{solicitudes}},{modo:'canonico'})],['explicita',(solicitudes)=>explicito({...e,deduccionesTerritoriales2025:{solicitudes}})]]){
 const result=Effect.runSync(call([x.s]));eq(result.deduccionesTerritoriales2025.total,[0n,1n]);const bad=Effect.runSync(Effect.flip(call([x.s,structuredClone(x.s)])));expect(bad._tag,name).toBe('ResultadoNoSoportado')
 }
})
