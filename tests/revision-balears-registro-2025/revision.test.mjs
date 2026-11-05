import {it,expect} from 'vitest'
import Decimal from 'decimal.js'
import {Effect} from 'effect'
import {fixture} from './fixture.mjs'
import {casoExplicitoC36} from './api-fixture.mjs'
import {aplicarDeduccionesTerritoriales2025 as aplicar} from '../../lib/dominio/irpf/deducciones/anual-territorial'
import {liquidarIrpfAnual,liquidarIrpfAnualExplicito} from '../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
Decimal.set({precision:80})
// Oráculo propio: comparación cruzada BigInt, sin racional ni cuantías del motor.
function eq(r,n,d=1n){expect(BigInt(r.numeradorEuros)*d).toBe(n*BigInt(r.divisor))}
function run(f){return aplicar({solicitudes:[f.s]},f.m)}
for(const [count,want] of [[2,1800],[3,3000],[4,4400],[5,5800]])it(`naturales ${count}: suma legal ${want}`,()=>eq(run(fixture(count)).total,BigInt(want)))
it('invariancia personas y secuencia física invertidas',()=>{const f=fixture();f.s.hechos.personas.reverse();f.s.hechos.registroPartoMultiple.nacidos.reverse();eq(run(f).total,1800n)})
for(const two of [false,true])for(const [g,a,want] of [['52800','0',1800],['52800','0.00000000000000000001',900],['52800.01','0',900],['52000','800',1800],['52000','800.01',900]])it(`renta ${g}+${a}; dos=${two}`,()=>{const f=fixture();f.m.baseGeneral=new Decimal(g);f.m.baseAhorro=new Decimal(a);if(two){for(const d of f.derechos.descendientes){d.titulares.push({...d.titulares[0],titularId:'s-9',residenteIrpf:false});}/* Sólo s-1 tiene mínimo: aun así se divide por dos progenitores. */}eq(run(f).total,BigInt(want),two?2n:1n)})
for(const [q,n,d] of [['0',0n,1n],['700',700n,1n],['700.123456789123456789',700123456789123456789n,1000000000000000000n],['1800',1800n,1n],['1800.01',1800n,1n]])it(`cuota exacta ${q}`,()=>{const f=fixture();f.m.cuotaAutonomica=new Decimal(q);eq(run(f).total,n,d)})
it('hijo previo natural con mínimo desplaza gemelos a 1000+1200',()=>{const f=fixture(3);const d=f.derechos.descendientes[0];d.fechaNacimiento='2023-01-01';d.edadDevengo=2;f.s.hechos.registroPartoMultiple.nacidos=f.s.hechos.registroPartoMultiple.nacidos.slice(1).map((n,i)=>({...n,secuenciaParto:i+1}));eq(run(f).total,2200n)})
it('hijo previo adoptivo cuenta en el orden de naturales',()=>{const f=fixture(3);const d=f.derechos.descendientes[0];d.fechaNacimiento='2023-01-01';d.edadDevengo=2;d.titulares[0].vinculo={clase:'adopcion',fechaInicioIncremento:'2023-02-01',fechaConstitucionVinculo:'2023-02-01',fundamento:'inscripcion-registro-civil',historialCompleto:true};f.s.hechos.registroPartoMultiple.nacidos=f.s.hechos.registroPartoMultiple.nacidos.slice(1).map((n,i)=>({...n,secuenciaParto:i+1}));eq(run(f).total,2200n)})
const badBirth={
 sinRegistro:f=>{delete f.s.hechos.registroPartoMultiple},
 secuenciaCero:f=>{f.s.hechos.registroPartoMultiple.nacidos[0].secuenciaParto=0},
 secuenciaDuplicada:f=>{f.s.hechos.registroPartoMultiple.nacidos[1].secuenciaParto=1},
 secuenciaHueco:f=>{f.s.hechos.registroPartoMultiple.nacidos[1].secuenciaParto=3},
 secuenciaFraccion:f=>{f.s.hechos.registroPartoMultiple.nacidos[1].secuenciaParto=1.5},
 personaAjena:f=>{f.s.hechos.registroPartoMultiple.nacidos[0].persona='s-999'},
 fechaNoConcordante:f=>{f.s.hechos.registroPartoMultiple.nacidos[0].fechaNacimiento='2025-02-02'},
 documentoVacio:f=>{f.s.hechos.registroPartoMultiple.documento='  '},
 omiteCenso:f=>{f.s.hechos.censoDescendientes.pop()},
 omitePersona:f=>{f.s.hechos.personas.pop()},
 sinMinimo:f=>{f.m.sujetosConMinimo.pop();f.m.atribucionesMinimo.pop()},
 identidadDuplicada:f=>{f.s.hechos.personas[1].id='s-2'},
 registroHistorico:f=>{for(const d of f.derechos.descendientes){d.fechaNacimiento='2024-02-01';d.edadDevengo=1}for(const n of f.s.hechos.registroPartoMultiple.nacidos)n.fechaNacimiento='2024-02-01'},
 sinResidencia:f=>{f.s.hechos.contribuyente.residenciaFiscal2024='otra'},
}
for(const [name,mutate] of Object.entries(badBirth))it('rechaza nacimiento '+name,()=>{const f=fixture();mutate(f);expect(()=>run(f)).toThrow()})
for(const [g,a,ok] of [['33000','0',true],['32999','1',true],['33000','0.00000000000000000001',false],['33000.01','0',false]])it(`adopción renta ${g}+${a}`,()=>{const f=fixture(1,true);f.m.baseGeneral=new Decimal(g);f.m.baseAhorro=new Decimal(a);if(ok)eq(run(f).total,800n);else expect(()=>run(f)).toThrow()})
it('adopción no exige residencia2024',()=>{const f=fixture(1,true);f.s.hechos.contribuyente.residenciaFiscal2024='otra';f.s.hechos.contribuyente.documentoResidencia2024='';eq(run(f).total,800n)})
it('adopción cuota300',()=>{const f=fixture(1,true);f.m.cuotaAutonomica=new Decimal(300);eq(run(f).total,300n)})
const badAdopt={sinFiliacion:f=>{delete f.s.hechos.filiacionAdopcion},pareja:f=>{f.s.hechos.filiacionAdopcion.conyugesOParejas=['s-8']},hijoAjeno:f=>{f.s.hechos.filiacionAdopcion.hijo='s-7'},fechaAjena:f=>{f.s.hechos.filiacionAdopcion.fechaConstitucion='2025-02-02'},previoNoCensado:f=>{f.s.hechos.personas[0].progenitorPrevio='s-7'},identidadImposible:f=>{f.s.hechos.filiacionAdopcion.progenitoresPrevios=['s-1']},inscripcion2026:f=>{f.s.hechos.personas[0].inscripcionCivil='2026-01-01'},inscripcionAntes:f=>{f.s.hechos.personas[0].inscripcionCivil='2025-01-31'},expedienteVacio:f=>{f.s.hechos.personas[0].expediente=''},segundoAdoptante:f=>{f.derechos.descendientes[0].titulares.push({...f.derechos.descendientes[0].titulares[0],titularId:'s-9'})}}
for(const [name,mutate] of Object.entries(badAdopt))it('rechaza adopción '+name,()=>{const f=fixture(1,true);mutate(f);expect(()=>run(f)).toThrow()})
for(const date of ['2025-01-01','2025-12-31'])it('nacimiento frontera '+date,()=>{const f=fixture();for(const d of f.derechos.descendientes)d.fechaNacimiento=date;for(const n of f.s.hechos.registroPartoMultiple.nacidos)n.fechaNacimiento=date;for(const p of f.s.hechos.personas)p.convivencia=[{desde:date,hasta:'2025-12-31'}];eq(run(f).total,1800n)})
for(const api of ['uniforme','efectiva'])for(const adopt of [false,true])for(const bad of [false,true])it(`API ${api} adopt=${adopt} adverso=${bad}`,()=>{
 const f=fixture(adopt?1:2,adopt);const gross=adopt?3000000:5000000;const net=api==='uniforme'?(adopt?2605600:4476000):(adopt?2800000:4800000);
 for(const d of f.derechos.descendientes)for(const t of d.titulares)t.rentasNoExentasCentimos=net;
 if(bad){if(adopt)f.s.hechos.filiacionAdopcion.conyugesOParejas=['s-8'];else f.s.hechos.registroPartoMultiple.nacidos[1].secuenciaParto=1}
 let effect;
 if(api==='efectiva'){const c=casoExplicitoC36([f.s]);effect=liquidarIrpfAnualExplicito({...c,comunidadAutonoma:'illes-balears',familiaresConDerechoMinimo:'segun-derechos',derechosMinimos:f.derechos,trabajo:{...c.trabajo,rendimientos:c.trabajo.rendimientos.map(t=>({...t,integro:String(gross/100)}))}})}
 else effect=liquidarIrpfAnual({...f.m.caso,rendimientos:{trabajo:[{importeIntegroCentimos:gross}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0,deduccionesTerritoriales2025:{solicitudes:[f.s]}},{modo:'canonico'});
 const result=Effect.runSync(Effect.result(effect));if(bad){expect(result._tag).toBe('Failure');if(result._tag==='Failure')expect(result.failure._tag).toBe('ResultadoNoSoportado')}else{expect(result._tag).toBe('Success');if(result._tag==='Success')eq(result.success.deduccionesTerritoriales2025.total,adopt?800n:1800n)}
})

function donation(){return {lote:'C36',codigo:'balears_fomento_lengua_catalana',hechos:{donaciones:[{id:'DON-LENGUA',entidad:{nif:'ENT-LENGUA',clase:'fundacion49',territorio:'illes-balears',registro:'REG-LENGUA',finalidad:'lengua_catalana',fondosPropios:'1000',proyecto:'PROY-LENGUA',declaracionProyecto:'DECL-LENGUA',naturaleza:'privada',centroUniversitarioOrigen:'',patenteResultado:''},certificado:'CERT-LENGUA',fechaEntrega:'2025-03-15',aceptacion:'irrevocable_aceptada',bienProtegido:'',modalidad:'dinero',destino4bis:'no_aplica',pagos:[{id:'P-LENGUA',fecha:'2025-03-15',pagador:'s-1',perceptor:'ENT-LENGUA',factura:'F-LENGUA',importe:'1000',ayudasExentas:'0',reembolsos:'0',medio:'transferencia',naturaleza:'propio',distribucion:[{persona:'s-1',porcentaje:'100'}]}],valoracionBien:'0',documentoValoracion:'',comodato:{desde:'2025-01-01',hasta:'2025-12-31',ejerciciosPrevios:[],valorFiscal:'0',criterio:'comision_patrimonio',documento:''}}],ordenTramoInicial:['DON-LENGUA'],historiaDonativos:[],censoHistoria2023Y2024:'completo',exhaustividad:'completa'}}}
for(const adopt of [false,true])for(const inverted of [false,true])it(`cuota común y prioridad adopt=${adopt} invertido=${inverted}`,()=>{
 const f=fixture(adopt?1:2,adopt);f.m.cuotaAutonomica=new Decimal(adopt?850:1850);
 const requests=inverted?[donation(),f.s]:[f.s,donation()];const r=aplicar({solicitudes:requests},f.m);
 eq(r.total,adopt?850n:1850n);
 // Prioridad familiar comprobada también al invertir el plan: su importe entero debe conservarse.
 const index=r.codigos.indexOf(f.s.codigo);expect(index).toBeGreaterThanOrEqual(0);
 eq(r.aplicaciones[index].aplicado,adopt?800n:1800n);
})
for(const date of ['2025-01-01','2025-12-31'])it('adopción constitución/inscripción frontera '+date,()=>{
 const f=fixture(1,true);const v=f.derechos.descendientes[0].titulares[0].vinculo;v.fechaConstitucionVinculo=date;v.fechaInicioIncremento=date;
 f.s.hechos.filiacionAdopcion.fechaConstitucion=date;f.s.hechos.personas[0].inscripcionCivil=date;eq(run(f).total,800n)
})
