import fs from 'node:fs'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
const parent='/home/elies/Repos/IRoboPF/',require=createRequire(parent+'package.json'),ts=require('typescript')
const out='docs/procedencia/editorial/flujo-rentas-actividad-r23-sol/'
const hash=b=>crypto.createHash('sha256').update(b).digest('hex')
const sources=[],cases=[]
function compile(file,fragment='',from='',to=''){
 const text=fs.readFileSync(file,'utf8');assert.equal(hash(text),hash(fs.readFileSync(parent+file)))
 let code=fragment||text
 if(from){assert.equal(code.split(from).length,2);code=code.replace(from,to)}
 sources.push({file,sha256:hash(text),fragmentSha256:hash(code),mutation:from?{from,to}:null})
 const js=ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText
 const exports={};new Function('require','exports',js)(createRequire(parent+file),exports);return exports
}
function fixture(symbol){const file='tests/actividades-economicas-2025.test.ts',text=fs.readFileSync(file,'utf8'),sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);let fragment='';function visit(n){if(ts.isFunctionDeclaration(n)&&n.name?.text===symbol)fragment=n.getText(sf);ts.forEachChild(n,visit)}visit(sf);assert(fragment);return compile(file,fragment+'\nexports.fixture='+symbol).fixture}
const base=fixture('casoBase'),income=fixture('ingreso'),expense=fixture('gasto')
const file='lib/dominio/irpf/actividades-economicas/calcular.ts'
const actual=compile(file).calcularActividad2025
const mutant=compile(file,'','D.min(2000, D.max(P, 0).times("0.05"))','D.min(2000, D.max(P, 0).times("0.06"))').calcularActividad2025
function run(c,fn=actual){const r=fn(c);assert.equal(r.estado,'soportado');return r}
function amounts(r){return Object.fromEntries(r.etapas.map(e=>[e.id,e.importe]))}
let c=base();c.ingresos=[income('20000')];c.gastos=[expense('4000')];c.aplicarRentasBajas=false
const a=run(c),b=run(c,mutant),av=amounts(a),bv=amounts(b)
assert.equal(av.P,'16000');assert.equal(av.G,'800');assert.equal(bv.G,'960');assert.equal(av.RN,'15200');assert.equal(bv.RN,'15040');assert.equal(av.ingresos,bv.ingresos);assert.equal(av.gastos,bv.gastos);assert.equal(av.retenciones,bv.retenciones)
cases.push({id:'G05-G06',input:c,before:av,after:bv,reason:'Muta solo coeficiente G; P/diarios/pagos invariantes, RN/aporte cambian. No propagar G a importe de ingresos.'})
c=base();c.ingresos=[income('1000')];c.gastos=[expense('2000')];const loss=run(c);assert.equal(loss.aporte.importeEurosExactos,'-1000');assert.equal(amounts(loss).G,'0');cases.push({id:'EDS-PERDIDA',input:c,result:loss})
c=base();c.ingresos=[income('10000',true)];c.opcion='cliente-unico';const unique=run(c);assert.equal(amounts(unique).G,'0');assert.equal(amounts(unique).adicional,'6498');assert.equal(amounts(unique).reduccion32_2,'8498');assert.equal(unique.aporte.importeEurosExactos,'1502');cases.push({id:'CLIENTE-UNICO',input:c,result:unique})
c.ingresos[0].sujetoRetencion=false;assert.equal(actual(c).estado,'no-soportado');cases.push({id:'CLIENTE-70',input:c,result:actual(c),reason:'Cambiar clasificación de base sujeta selecciona admisión, no resta retención al ingreso.'})
c=base();c.ingresos=[income('10000')];c.aplicarRentasBajas=false;c.aplicarInicio=true;const start=run(c);assert.equal(amounts(start).RN,'9500');assert.equal(amounts(start).reduccionInicio,'1900');assert.equal(start.aporte.importeEurosExactos,'7600');cases.push({id:'INICIO',input:c,result:start})
c.clientes[0].empleadorEnAnioAnteriorAlInicio=true;const excluded=run(c);assert.equal(amounts(excluded).reduccionInicio,'0');cases.push({id:'EMPLEADOR',input:c,result:excluded})
const adapter=compile('lib/dominio/irpf/actividades-economicas/adaptador.ts').adaptarActividadGeneral(c)
assert.equal(adapter.aporte.importeEurosExactos,excluded.aporte.importeEurosExactos);assert.deepEqual(adapter.etapas,excluded.etapas)
cases.push({id:'ADAPTADOR',result:adapter,reason:'Alias aporte/etapas conservan valor exacto y orden; no convierte a céntimos.'})
fs.writeFileSync(out+'actividad-casos.json',JSON.stringify({sources,cases},null,2));console.log(JSON.stringify({passed:cases.length}))
c=base();c.ingresos=[income('10000',true)];c.activos=[fixture('activo')()];c.aplicarRentasBajas=false
const assets=run(c),v=amounts(assets);assert.equal(v.pc,'260');assert.equal(v['pc:saldo'],'740');assert.equal(v.amortizacion,'260');assert.equal(v.P,'9740')
cases.push({id:'ACTIVO-SALDO',input:c,result:assets,reason:'Submotor aislado: gasto consume cuota260, nunca saldo740; conexión anual excluye este caso.'})
c=base();c.ingresos=[income('10000',true)];c.opcion='cliente-unico';c.discapacidad.grado=33
const disability=run(c);assert.equal(amounts(disability).discapacidad,'3500');assert.equal(amounts(disability).reduccion32_2,'10000');cases.push({id:'DISCAPACIDAD-AISLADA',input:c,result:disability,reason:'Submotor aislado; reducción acotada a RN, anual rechaza grado33.'})
c=base();c.ingresos=[income('10000',true)];c.aplicarRentasBajas=false
c.reta=[{id:'reta-1',justificante:'j-reta',fecha:'2025-06-01',importe:'300',tipo:'ordinaria',propia:true,efectiva:true,periodo:'2025-06'}]
c.retenciones=[{id:'r1',justificante:'certificado',fecha:'2025-06-01',operacionId:'operacion-r1',ingresoId:'factura',importe:'1500',efectiva:true}]
c.pagosFraccionados=[{id:'p1',justificante:'pago130',fecha:'2025-07-20',operacionId:'operacion-p1',periodo:'2025-2T',modelo:'130',importe:'500',efectivo:true}]
const payment=run(c),pv=amounts(payment);assert.equal(pv['reta:reta-1'],'300');assert.equal(pv.reta,'300');assert.equal(pv.P,'9700');assert.equal(pv.retenciones,'1500');assert.equal(pv.pagos,'500');assert.equal(payment.aporte.importeEurosExactos,'9215')
cases.push({id:'RETA-Y-PAGOS',input:c,result:payment,reason:'RETA una vez en gastos; retenciones y pagos permanecen fuera de P/RN/aporteBIG.'})
fs.writeFileSync(out+'actividad-casos.json',JSON.stringify({sources,cases},null,2));console.log(JSON.stringify({passed:cases.length}))
