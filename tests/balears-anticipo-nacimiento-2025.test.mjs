import { readFileSync } from 'node:fs'
import { donativoConexionC36 } from "./c36-conexion-anual.fixtures"
import { it, expect } from 'vitest'
import Decimal from 'decimal.js'
import { Effect } from 'effect'
import { fixture } from './revision-balears-registro-2025/fixture.mjs'
import { casoExplicitoC36 } from './revision-balears-registro-2025/api-fixture.mjs'
import { aplicarDeduccionesTerritoriales2025 as aplicar } from '../lib/dominio/irpf/deducciones/anual-territorial'
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
function nominal(a='400') {
 const f=fixture(1)
 if(a!=='0')f.s.hechos.registroCobrosNacimiento={consulta:'consulta-ATIB',censo:'completo',
  resoluciones:[{id:'RES-IB50',fecha:'2025-02-10',beneficiario:'s-1',hijo:'s-2',fechaNacimiento:'2025-02-01',importeConcedido:a,modelo:'IB50',organismo:'ATIB',incidencias:'sin_modificaciones_ni_reintegros'}],
  cobros:[{id:'P-IB50',fecha:'2025-02-12',beneficiario:'s-1',resolucion:'RES-IB50',importe:a,ordenante:'ATIB',justificante:'BANCO-IB50'}]}
 return f
}
function eq(q,n){expect(BigInt(q.numeradorEuros)).toBe(BigInt(n)*BigInt(q.divisor))}
for(const [a,n] of [['0',800],['400',400],['800',0]])it(`cuota suficiente anticipo ${a}: neto ${n} y consumo único`,()=>{
 const f=nominal(a);const r=aplicar({solicitudes:[f.s]},f.m)
 eq(r.total,n);eq(r.disponible,9200);expect(r.aplicaciones).toHaveLength(1)
 if(a!=='0'){eq(r.nacimientoBalear2025.derechoBruto,800);eq(r.nacimientoBalear2025.anticipoConciliado,a);expect(r.nacimientoBalear2025.aceptacionFiscal).toBe('pendiente')}
})
for(const q of ['0','300','799.99'])it(`cuota ${q} y anticipo: no activa fórmula pendiente`,()=>{
 const f=nominal();f.m.cuotaAutonomica=new Decimal(q)
 expect(()=>aplicar({solicitudes:[f.s]},f.m)).toThrow(/cuota insuficiente/)
})
it('anticipo superior al derecho no se trunca a cero',()=>{
 const f=nominal('900');expect(()=>aplicar({solicitudes:[f.s]},f.m)).toThrow(/exceso sobre derecho/)
})
const adversos={
 ajeno:[f=>{f.s.hechos.registroCobrosNacimiento.cobros[0].beneficiario='s-9'},/otro beneficiario/],
 duplicado:[f=>{const r=f.s.hechos.registroCobrosNacimiento;r.cobros.push({...r.cobros[0]})},/duplicad|reutilizado/i],
 resolucion:[f=>{f.s.hechos.registroCobrosNacimiento.resoluciones[0].importeConcedido='401'},/resolución contradictoria/],
 hijo:[f=>{f.s.hechos.registroCobrosNacimiento.resoluciones[0].fechaNacimiento='2025-02-02'},/ajena al nacimiento/],
 justificante:[f=>{delete f.s.hechos.registroCobrosNacimiento.cobros[0].justificante},/justificante/],
 sinResolucion:[f=>{delete f.s.hechos.registroCobrosNacimiento.resoluciones},/sin resolución nominal/],
}
for(const [nombre,[mutar,motivo]] of Object.entries(adversos))it(`rechazo por causa ${nombre}`,()=>{
 const f=nominal();mutar(f);expect(()=>aplicar({solicitudes:[f.s]},f.m)).toThrow(motivo)
})
function anual(api,f,solicitudes,gross=3000000){
 const renta=gross===0?0:api==='efectiva'?2800000:2605600
 const derechos={...f.derechos,descendientes:f.derechos.descendientes.map(d=>({...d,titulares:d.titulares.map(t=>({...t,rentasNoExentasCentimos:renta}))}))}
 if(api==='efectiva'){
  const c=casoExplicitoC36([])
  return liquidarIrpfAnualExplicito({...c,deduccionesTerritoriales2025:{solicitudes},comunidadAutonoma:'illes-balears',familiaresConDerechoMinimo:'segun-derechos',derechosMinimos:derechos,trabajo:{...c.trabajo,rendimientos:c.trabajo.rendimientos.map(t=>({...t,integro:String(gross/100)}))}})
 }
 return liquidarIrpfAnual({...f.m.caso,derechosMinimos:derechos,rendimientos:{trabajo:[{importeIntegroCentimos:gross}]},reducciones:[],deducciones:[],deduccionesTerritoriales2025:{solicitudes},retencionesSoportadasCentimos:0,pagosACuentaCentimos:0},{modo:'canonico'})
}
function diferenciaCuota(api,sin,con){return api==='efectiva'?new Decimal(sin.cuotaLiquidaLegal).minus(con.cuotaLiquidaLegal).times(100).toNumber():sin.cuotaLiquidaCentimos-con.cuotaLiquidaCentimos}
function diferenciaFinal(api,sin,con){return api==='efectiva'?new Decimal(sin.cuotaDiferencial).minus(con.cuotaDiferencial).times(100).toNumber():sin.cuotaDiferencialCentimos-con.cuotaDiferencialCentimos}
for(const api of ['efectiva','canonica']){
 for(const [a,n] of [['0',800],['400',400],['800',0]])it(`${api}: anticipo ${a}, delta de cuota y diferencial ${n}`,()=>{
  const f=nominal(a),sin=Effect.runSync(anual(api,f,[])),con=Effect.runSync(anual(api,f,[f.s]))
  eq(con.deduccionesTerritoriales2025.total,n)
  expect(diferenciaCuota(api,sin,con)).toBe(n*100)
  expect(diferenciaFinal(api,sin,con)).toBe(n*100)
 })
 for(const [nombre,[mutar,motivo]] of Object.entries(adversos))it(`${api}: rechazo nominal ${nombre} sin impuesto`,()=>{
  const f=nominal();mutar(f);const r=Effect.runSync(Effect.result(anual(api,f,[f.s])))
  expect(r._tag).toBe('Failure');expect(r.failure._tag).toBe('ResultadoNoSoportado');expect(r.failure.motivo).toMatch(motivo)
 })
 it(`${api}: cuota cero no genera abono automático`,()=>{
  const f=nominal();const r=Effect.runSync(Effect.result(anual(api,f,[f.s],0)))
  expect(r._tag).toBe('Failure');expect(r.failure.motivo).toMatch(/cuota insuficiente/)
 })
 it(`${api}: exceso no genera importe`,()=>{
  const f=nominal('900');const r=Effect.runSync(Effect.result(anual(api,f,[f.s])))
  expect(r._tag).toBe('Failure');expect(r.failure.motivo).toMatch(/exceso sobre derecho/)
 })
}
it('dos solicitudes con anticipo no eluden la reserva de prioridad',()=>{
 const f=nominal()
 // Antes de consumir cuota se rechaza toda la combinación, incluso duplicada.
 expect(()=>aplicar({solicitudes:[f.s,f.s]},f.m)).toThrow(/Código duplicado/)
})
it('anticipo con cuota residual escasa no usa la cuota íntegra superior',()=>{
 const f=nominal();f.m.cuotaAutonomicaResidual=new Decimal(300)
 expect(()=>aplicar({solicitudes:[f.s]},f.m)).toThrow(/cuota insuficiente/)
})

function cultural(importe='10000') {
 const s=donativoConexionC36('balears_mecenazgo_cultural_cientifico_tecnologico',importe)
 return {...s,hechos:{...s.hechos,donaciones:s.hechos.donaciones.map(d=>({...d,entidad:{...d.entidad,clase:'administracion',naturaleza:'publica'}}))}}
}
function vincularProyecto(f,d) {
 const don=d.hechos.donaciones[0]
 f.s.hechos.registroCobrosNacimiento.mecenazgoConcurrente={donacion:don.id,beneficiarioNif:don.entidad.nif,administracion:'comunidad_illes_balears',proyecto:don.entidad.proyecto,declaracionProyecto:don.entidad.declaracionProyecto,documentoTitularidad:'certificacion-proyecto-propio-CAIB'}
}
// Tabla legal independiente: D800; donación10000*25%=2500 limitada a1200.
// R=min(1200,Q-800); T=800-A+R. Fracciones y evaluación real en AUTOR.
for(const q of [800,850,1000,1200,2000,2400])for(const a of [0,400,800])it(`reserva bruta Q${q} A${a} orden metamórfico`,()=>{
 const f=nominal(String(a));f.m.cuotaAutonomica=new Decimal(q)
 const d=cultural();vincularProyecto(f,d)
 const requests=[f.s,d],other=Math.min(1200,q-800)
 const r=aplicar({solicitudes:requests},f.m),reverse=aplicar({solicitudes:[...requests].reverse()},f.m)
 expect(reverse).toEqual(r)
 eq(r.total,800-a+other);eq(r.disponible,q-800-other)
 eq(r.aplicaciones[0].aplicado,800-a);eq(r.aplicaciones[1].aplicado,other)
 if(a>0){eq(r.nacimientoBalear2025.reservaBruta,800);eq(r.nacimientoBalear2025.cuotaDisponibleOtras,q-800);eq(r.nacimientoBalear2025.cuotaReservadaSinMinoracion,a)}
})
it('reserva bruta conserva fracciones de cuota sin presentar céntimos',()=>{
 const f=nominal('400');f.m.cuotaAutonomica=new Decimal('850.123456789123456789')
 const d=cultural();vincularProyecto(f,d)
 const r=aplicar({solicitudes:[d,f.s]},f.m)
 expect(BigInt(r.aplicaciones[1].aplicado.numeradorEuros)*1000000000000000000n).toBe(50123456789123456789n*BigInt(r.aplicaciones[1].aplicado.divisor))
})
for(const api of ['efectiva','canonica'])for(const a of ['400','800'])it(`${api}: concurrencia pública, orden estable y anticipo una vez ${a}`,()=>{
 const f=nominal(a),d=cultural('4000');vincularProyecto(f,d)
 const sin=Effect.runSync(anual(api,f,[]))
 const con=Effect.runSync(anual(api,f,[f.s,d])),rev=Effect.runSync(anual(api,f,[d,f.s]))
 expect(rev.deduccionesTerritoriales2025).toEqual(con.deduccionesTerritoriales2025)
 // Donación4000*25%=1000, por debajo del tope1200: D800+1000 cabe en ambas cuotas.
 eq(con.deduccionesTerritoriales2025.total,1800-Number(a))
 expect(diferenciaCuota(api,sin,con)).toBe((1800-Number(a))*100)
 expect(diferenciaFinal(api,sin,con)).toBe((1800-Number(a))*100)
 eq(con.deduccionesTerritoriales2025.nacimientoBalear2025.reservaBruta,800)
})
it('no amplía donación privada ni adopción concurrente con anticipo',()=>{
 const f=nominal(),privada=donativoConexionC36('balears_mecenazgo_cultural_cientifico_tecnologico','1000')
 expect(()=>aplicar({solicitudes:[f.s,privada]},f.m)).toThrow(/donación cultural pública/)
 const adopt=fixture(1,true).s
 expect(()=>aplicar({solicitudes:[f.s,adopt]},f.m)).toThrow(/adopción y otras familias/)
})

if(process.env.T05_ORACULO){
 const oraculo=JSON.parse(readFileSync(process.env.T05_ORACULO,'utf8'))
 for(const row of oraculo.legal)it(`Fraction independiente ${row.cuota}/${row.anticipo}`,()=>{
  const f=nominal(row.anticipo);f.m.cuotaAutonomica=new Decimal(row.cuota)
  const d=cultural();vincularProyecto(f,d)
  const r=aplicar({solicitudes:[f.s,d]},f.m)
  for(const [got,want] of [[r.total,row.total],[r.disponible,row.disponible],[r.aplicaciones[1].aplicado,row.otra]])
   expect(BigInt(got.numeradorEuros)*BigInt(want.divisor)).toBe(BigInt(want.numeradorEuros)*BigInt(got.divisor))
 })
}

it('concurrencia sin soporte de titularidad CAIB no presume el25%',()=>{
 const f=nominal();expect(()=>aplicar({solicitudes:[f.s,cultural()]},f.m)).toThrow(/titularidad documentada/)
})
it('concurrencia con proyecto contradictorio no calcula importe',()=>{
 const f=nominal(),d=cultural();vincularProyecto(f,d)
 f.s.hechos.registroCobrosNacimiento.mecenazgoConcurrente.proyecto='AJENO'
 expect(()=>aplicar({solicitudes:[f.s,d]},f.m)).toThrow(/soporte del mecenazgo CAIB contradictorio/)
})

for(const api of ['efectiva','canonica'])for(const variante of ['soporte-omitido','proyecto-ajeno','dato-calculado'])it(`${api}: concurrencia adversa ${variante} sin impuesto`,()=>{
 const f=nominal(),d=cultural();vincularProyecto(f,d)
 if(variante==='soporte-omitido')delete f.s.hechos.registroCobrosNacimiento.mecenazgoConcurrente
 if(variante==='proyecto-ajeno')f.s.hechos.registroCobrosNacimiento.mecenazgoConcurrente.proyecto='AJENO'
 if(variante==='dato-calculado')f.s.hechos.registroCobrosNacimiento.cuotaDisponibleOtras='400'
 const r=Effect.runSync(Effect.result(anual(api,f,[d,f.s])))
 expect(r._tag).toBe('Failure');expect(r.failure._tag).toBe('ResultadoNoSoportado')
 if(variante!=='dato-calculado')expect(r.failure.motivo).toMatch(/titularidad documentada|soporte del mecenazgo CAIB contradictorio/)
})
