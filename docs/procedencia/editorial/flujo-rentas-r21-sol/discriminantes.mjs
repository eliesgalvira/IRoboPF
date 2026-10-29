import fs from 'node:fs'
import crypto from 'node:crypto'
import {createRequire} from 'node:module'
import assert from 'node:assert/strict'
const parent='/home/elies/Repos/IRoboPF/'
const out='docs/procedencia/editorial/flujo-rentas-r21-sol/'
const require=createRequire(parent+'package.json')
const ts=require('typescript')
const Decimal=require('decimal.js').Decimal
const rows=[], runtimeSources=[]
const hash=s=>crypto.createHash('sha256').update(s).digest('hex')
function load(file,from='',to='') {
 const bytes=fs.readFileSync(file), preserved=fs.readFileSync(parent+file)
 assert.equal(hash(bytes),hash(preserved),'Fuente del padre distinta')
 let text=bytes.toString('utf8')
 if(from){assert.equal(text.split(from).length,2);text=text.replace(from,to)}
 const compiled=ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText
 runtimeSources.push({file,sourceSha256:hash(bytes),executedSha256:hash(text),mutation:from?{from,to}:null})
 const exports={};new Function('require','exports',compiled)(createRequire(parent+file),exports)
 return exports
}
function fixture(file,name) {
 const text=fs.readFileSync(file,'utf8'),s=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true)
 let chosen=''
 function visit(n){if((ts.isVariableDeclaration(n)||ts.isFunctionDeclaration(n))&&n.name?.getText(s)===name)chosen=n.getText(s);ts.forEachChild(n,visit)}visit(s)
 assert.notEqual(chosen,'')
 runtimeSources.push({file,sourceSha256:hash(text),fixture:name,fragmentSha256:hash(chosen)})
 const code=ts.transpileModule('const '+(chosen.startsWith('function ')?'f = '+chosen:chosen)+'; return '+(chosen.startsWith('function ')?'f':name),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText
 return new Function(code)()
}
const gasto=fixture('tests/trabajo-anual-contratos.test.ts','gastos')
const workFile='lib/dominio/irpf/trabajo-anual/calcular.ts'
const original=load(workFile),mutant=load(workFile,'D.min(colegio, 500)','D.min(colegio, 700)')
const c=gasto();c.rendimientos[0].colegio.importe='800'
const a=original.calcularGastosTrabajo(c),b=mutant.calcularGastosTrabajo(c)
assert.equal(a.estado,'calculado');assert.equal(b.estado,'calculado')
assert.equal(a.integro,b.integro);assert.equal(new Decimal(b.gastosAE).minus(a.gastosAE).toString(),'200');assert.equal(new Decimal(b.netoPrevioArt20).minus(a.netoPrevioArt20).toString(),'-200')
rows.push({id:'M500',source:workFile,mutation:'500→700 solo colegio',before:a,after:b,conclusion:'Invariante íntegro; gastos+200; P y art19-200. No prueba vigencia ni selector jurídico.'})
const c2=gasto();c2.rendimientos[0].integro='100';c2.rendimientos[0].cotizaciones.seguridadSocial='150'
const loss=original.calcularGastosTrabajo(c2);assert.equal(loss.netoArt19,'-50');assert.equal(loss.generalesAplicados,'0')
rows.push({id:'PERDIDA',input:c2,result:loss,conclusion:'a-e conserva pérdida, f limitado0.'})
const c3=gasto();c3.ejercicio=2026;assert.equal(original.calcularGastosTrabajo(c3).estado,'no-soportado')
rows.push({id:'RECHAZO2026',result:original.calcularGastosTrabajo(c3)})
const red=load('lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts')
const reduction=(y,p,o,death)=>red.calcularReduccionTrabajoConOtrasRentas({anio:y,rendimientoPrevioNeto:new Decimal(p),otrasRentasNoExentas:new Decimal(o),fechaFallecimiento:death}).toString()
assert.equal(reduction(2025,16000,6500),'5293');assert.equal(reduction(2025,16000,'6500.01'),'0');assert.equal(reduction(2014,10000,'6500.01'),'2652')
assert.equal(reduction(2018,12000,0,new Date('2018-07-04T00:00:00Z')),'2832.8125');assert.equal(reduction(2018,12000,0,new Date('2018-07-05T00:00:00Z')),'4198.90625')
rows.push({id:'ART20',conclusion:'O6500/6500.01 cambia selector; fecha devengo2018 distingue4/5julio; no fechaPago.',values:[reduction(2025,16000,6500),reduction(2025,16000,'6500.01'),reduction(2014,10000,'6500.01'),reduction(2018,12000,0,new Date('2018-07-04T00:00:00Z')),reduction(2018,12000,0,new Date('2018-07-05T00:00:00Z'))]})
const uni=load('lib/dominio/laboral/cotizaciones-perfil-uniforme.ts'),leg=load('lib/dominio/laboral/cotizaciones-sociales.ts')
const entry={anio:2018,salarioBrutoAnual:new Decimal(100000)}
const u=uni.calcularDesgloseCotizacionesPerfilUniforme(entry),l=leg.calcularDesgloseCotizacionesSocialesLegacy(entry)
assert.equal(u.baseOrdinaria.minus(l.baseOrdinaria).toString(),'262.5');assert.equal(u.redondeoTgss,'pendiente')
rows.push({id:'SS2018',canonical:u,legacy:l,conclusion:'Discriminante de modo7/5, no regla mensualTGSS.'})
const u25=uni.calcularDesgloseCotizacionesPerfilUniforme({anio:2025,salarioBrutoAnual:new Decimal(60000)})
const l25=leg.calcularDesgloseCotizacionesSocialesLegacy({anio:2025,salarioBrutoAnual:new Decimal(60000)})
assert.equal(u25.solidaridadEmpresarial.minus(l25.solidaridadEmpresarial).toString(),'0.0362')
rows.push({id:'SOLIDARIDAD',canonical:u25,legacy:l25,conclusion:'Reparto publicado vs5/6 con exceso1086; no asigna céntimo residual.'})
const catalog=load('lib/dominio/irpf/retenciones/versiones/catalogo.ts')
for(const y of [2012,2013,2014,2015,2016]) assert.equal(catalog.seleccionarVersionRetencion({anio:y,perfilTemporal:'cierre'}),undefined)
assert.equal(catalog.seleccionarVersionRetencion({anio:2026,fechaPago:'2026-09-09'}),undefined)
assert.equal(catalog.seleccionarVersionRetencion({anio:2026,fechaPago:'2026-10-30'}),undefined)
assert.equal(catalog.seleccionarVersionRetencion({anio:2026,fechaPago:'2026-09-10'}).id,'aeat-2026-09-10')
rows.push({id:'VERSION',conclusion:'Antiguas y extremos2026 rechazados; dentro ventana10sept–29oct selecciona versión.'})
const da={regla:'da61',ambito:'comun-individual',ejercicio:2025,brutoServicios:'17000',otrasRentasNoExentas:'0',netoReducidoServicios:'1000',baseLiquidableGeneral:'4000',cuotaIntegraGeneral:'800',cuotaLiquidaTotal:'250',cuotaTrasArt80:'200',etapa:'despues-art80-sin-deduccion-trabajo',calificacion:'laboral-estatutaria-acreditada'}
const d=original.calcularDeduccionTrabajo(da);assert.equal(d.importeAplicable,'200');assert.equal(d.deduccionLegal,'255.2');rows.push({id:'DA61',input:da,result:d,conclusion:'Límite proporcional y cuota posterior; no confundir legal255.2 con aplicable200.'})
fs.writeFileSync(out+'discriminantes.json',JSON.stringify({sourceValidation:'Hashes iguales al checkout antes de ejecutar importaciones del padre solo lectura; mutación compilada en memoria, no escrita al motor.',runtimeSources,cases:rows},null,2)+'\n')
console.log(JSON.stringify({cases:rows.length,status:'passed'}))
