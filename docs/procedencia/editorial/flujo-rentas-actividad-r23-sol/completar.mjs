import fs from 'node:fs'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import {createRequire} from 'node:module'
const require=createRequire('/home/elies/Repos/IRoboPF/package.json'),ts=require('typescript')
const out='docs/procedencia/editorial/flujo-rentas-actividad-r23-sol/'
const g=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'))
const hash=b=>crypto.createHash('sha256').update(b).digest('hex')
function ref(file,symbol){const text=fs.readFileSync(file,'utf8'),sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);const matches=[];function visit(n){if((ts.isVariableDeclaration(n)||ts.isFunctionDeclaration(n))&&n.name?.getText(sf)===symbol)matches.push(n);ts.forEachChild(n,visit)}visit(sf);assert.equal(matches.length,1,symbol);const found=matches[0];return {file,sha256:hash(Buffer.from(text)),start:found.getStart(sf),end:found.end,offsetEncoding:'utf16',text:found.getText(sf),rangeRole:'declaration; not literal'}}
const file='lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts'
g.nodes.push({id:'h.date.plusYear',kind:'derived',symbol:'sumarUnAnioFechaCivilIso',property:'return',formula:'split fecha: year=0,month=1,day=1 por defecto; DateTime.makeUnsafe({year:year+1,month,day}); toPartsUtc; padStart 4/2/2; compara fechaTransmisión estrictamente > aniversario',source:ref(file,'sumarUnAnioFechaCivilIso')})
g.nodes.find(n=>n.id==='h.classify.helper').formula='derivaDeTransmision=true en este llamador; si falta cualquiera de fechas→ahorro; fechas presentes: transmisión > aniversario civil→ahorro; igualdad/anterior→general; no duración en365 días'
for(const [from,to,kind,reason] of [['public.general','h.date.plusYear','value','caso.ganancias[*].fechaAdquisicion'],['h.date.plusYear','h.classify.helper','selection','elige general/ahorro según comparación estricta'],['primitive.decimal','money','value','constructor Decimal y divisor100']])g.edges.push({from,to,kind,propertyPath:reason,condition:'2013/2014 para clasificación por fecha; resto ahorro',reason,evidence:ref(file,'sumarUnAnioFechaCivilIso')})
// Registrar contratos de admisión completos sin atribuir cada predicado al importe.
for(const [id,path,symbol,origin] of [
 ['validation.work.schema','lib/dominio/irpf/trabajo-anual/contrato.ts','GastosTrabajo','public.explicit'],
 ['validation.da.schema','lib/dominio/irpf/trabajo-anual/contrato.ts','DeduccionTrabajo','public.explicit']]){g.nodes.push({id,kind:'validation',symbol,property:'admisión estructural',source:ref(path,symbol)});g.edges.push({from:origin,to:id,kind:'domain-validation',propertyPath:'argumento',condition:'solo vía explícita',reason:'decodeUnknownResult con exceso de propiedades error',evidence:ref(path,symbol)})}
const x='lib/dominio/irpf/trabajo-anual/conexion.ts'
g.nodes.push({id:'validation.annual.activity',kind:'validation',symbol:'liquidarIrpfAnualExplicito',property:'perfil actividad/soporte anual',source:ref(x,'liquidarIrpfAnualExplicito'),formula:'caso.actividad.activos.length>0 o discapacidad.grado!==0 rechaza antes del adaptador; trabajo ejercicio2025 y discapacidad ninguna; empleo homogéneo o pensión homogénea y no vacío'})
for(const to of ['a.adapter','x.net','x.ret','x.pay'])g.edges.push({from:'validation.annual.activity',to,kind:'domain-validation',propertyPath:'admisión anual',condition:'perfil correspondiente',reason:'No se promueven activos ni discapacidad aislada',evidence:ref(x,'liquidarIrpfAnualExplicito')})
for(const to of ['w.I','w.AE','w.N'])g.edges.push({from:'validation.work.schema',to,kind:'domain-validation',propertyPath:'argumento',condition:'GastosTrabajo admitido',reason:'Contrato y rechazo, no cuantía',evidence:ref('lib/dominio/irpf/trabajo-anual/contrato.ts','GastosTrabajo')})
g.edges.push({from:'validation.da.schema',to:'x.da',kind:'domain-validation',propertyPath:'argumento DA61',condition:'2025 y regla da61',reason:'MagnitudesCalculadas no negativas y precisión hasta60 decimales; extra fields error',evidence:ref('lib/dominio/irpf/trabajo-anual/contrato.ts','DeduccionTrabajo')})
fs.writeFileSync(out+'grafo.json',JSON.stringify(g))
const omissions=g.sites.map(s=>({siteId:s.siteId,sourceR21:'docs/procedencia/editorial/flujo-rentas-r21-sol/flujo.json#'+s.siteId,root:s.root,decisions:[{omission:'Cadena interna por propiedad',status:'resuelta-candidata',evidence:'grafo.json#'+s.root},{omission:'Hojas/controles R21 y selector',status:'resuelta-candidata',evidence:'ocurrencias.json; targets son propiedades, no unión de archivo'},{omission:'SS legacy/canónica',status:s.siteId.startsWith('anual.trabajo.')&&s.root!=='g.I'&&s.root!=='g.F'?'frontera-exacta':'no-aplicable',evidence:'ss.canonical/ss.legacy: return.cotizacionTrabajador({anio,salarioBrutoAnual}); contexto.modo'},{omission:'Escalas/mínimos',status:['x.deduction','x.diff'].includes(s.root)?'frontera-exacta':'no-aplicable',evidence:'scale.parameters/scale.published/minimum.state/scale.integrate: propiedades/argumentos en nodos'},{omission:'Instancias dinámicas',status:s.siteId.endsWith('actividad.etapa')?'resuelta-candidata':'no-aplicable',evidence:'instancias.json: cuarto argumento individual y retorno/adaptador'}],review:'pendiente de contraste de nuevas aristas y composición',legalAcceptance:false}))
fs.writeFileSync(out+'omisiones.json',JSON.stringify(omissions,null,2))
console.log('Contratos de fechas, admisión y matriz de omisiones escritos')
const updated=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'))
for(const node of updated.nodes){
 if(!node.source||!node.symbol)continue
 const file=node.source.file,text=fs.readFileSync(file,'utf8'),sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true),writes=[]
 function scan(n){if(ts.isBinaryExpression(n)&&n.left.getText(sf)===node.symbol&&[ts.SyntaxKind.EqualsToken,ts.SyntaxKind.PlusEqualsToken].includes(n.operatorToken.kind)){writes.push({file,sha256:hash(Buffer.from(text)),start:n.getStart(sf),end:n.end,offsetEncoding:'utf16',text:n.getText(sf),rangeRole:'assignment'})}ts.forEachChild(n,scan)}scan(sf)
 if(writes.length)node.assignments=writes
}
for(const edge of updated.edges){
 const to=edge.to,from=edge.from
 const branch=to.startsWith('r.reduccionTrabajoHasta2014')?'anio<=2014 y O<=6500':to.startsWith('r.reduccionTrabajo2015A2017')?'2015–2017 o componente anterior de2018; O<=6500':to.startsWith('r.reduccionTrabajo2019A2022')?'2019–2022 o componente nuevo de2018; O<=6500':to.startsWith('r.reduccionTrabajo2023')?'anio===2023; O<=6500':to.startsWith('r.reduccionTrabajoDesde2024')?'anio>=2024 del contrato general; O<=6500':to==='r.2018'?'anio===2018; O<=6500; fallecimiento civil antes5julio selecciona anterior':to==='x.R.function'?'solo-trabajo; Madrid2025; O fijado0':to.startsWith('a.')?'submotor común2025; opción/historial del nodo; anual solo activos=[] y grado0':to.startsWith('x.')||to.startsWith('w.')?'perfil explícito Madrid2025; solo-trabajo o solo-actividad según fórmula':from==='ss.canonical'?'contexto.modo===canonico':from==='ss.legacy'?'contexto.modo!==canonico':'ejercicio/contexto general admitidos; predicado exacto de la fórmula'
 edge.condition=branch+'; '+(edge.kind==='domain-validation'?'rechazo/admisión, no sumando':'valor/selector por propiedad, no módulo compartido')
}
fs.writeFileSync(out+'grafo.json',JSON.stringify(updated))
const finalGraph=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'))
for(const [id,property] of [['primitive.DateTime','DateTime.makeUnsafe/toPartsUtc: año civil +1, semántica externa Effect'],['primitive.Math','Math.min de ejercicios positivos; Number/slice/split y String.padStart']])finalGraph.nodes.push({id,kind:'external-primitive',symbol:id.slice(10),property,source:ref('lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts','sumarUnAnioFechaCivilIso')})
for(const [from,to] of [['primitive.DateTime','h.date.plusYear'],['primitive.Math','a.first'],['primitive.Math','r.civil']])finalGraph.edges.push({from,to,kind:'value',propertyPath:finalGraph.nodes.find(n=>n.id===to).property,condition:'solo si se ejecuta el helper correspondiente',reason:'Primitiva externa identificada; no se presenta como constante normativa',evidence:finalGraph.nodes.find(n=>n.id===to).source})
for(const e of finalGraph.edges.filter(e=>e.to==='g.R')){
 const scope={'r.reduccionTrabajoHasta2014':'anio<=2014','r.reduccionTrabajo2015A2017':'2015<=anio<=2017','r.2018':'anio===2018','r.reduccionTrabajo2019A2022':'2019<=anio<=2022','r.reduccionTrabajo2023':'anio===2023','r.reduccionTrabajoDesde2024':'anio>=2024'}[e.from]
 if(scope)e.condition='O<=6500 && '+scope+'; otras ramas no contribuyen al valor seleccionado'
}
fs.writeFileSync(out+'grafo.json',JSON.stringify(finalGraph))
const propertyGraph=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'))
const localTotal={...propertyGraph.nodes.find(n=>n.id==='h.total'),id:'h.item.total',symbol:'calcularGananciaPatrimonialPorTransmision',property:'ganancias[j].gananciaTotal',formula:'convertirCentimos(caso.rendimientos.gananciasPatrimoniales[j].importeGananciaCentimos); operación por transmisión j',source:ref('lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts','calcularGananciaPatrimonialPorTransmision')}
const localExempt={...propertyGraph.nodes.find(n=>n.id==='h.exempt'),id:'h.item.exempt',property:'ganancias[j].gananciaExenta',formula:'max(0,min(ganancias[j].total,ganancias[j].exencion65+ganancias[j].DA37)); mismo índice j'}
propertyGraph.nodes.push(localTotal,localExempt)
for(const e of propertyGraph.edges){
 if(['h.age','h.life','h.old','h.exempt','h.subject'].includes(e.to)&&e.from==='h.total')e.from='h.item.total'
 if(e.to==='h.exempt')e.to='h.item.exempt'
 if(e.to==='h.subject'&&e.from==='h.exempt')e.from='h.item.exempt'
 if(e.to.startsWith('h.')&&!['h.total','h.exempt','h.general','h.savings'].includes(e.to))e.condition+='; operación correlacionada por transmisión j, nunca agregado de otros índices'
}
propertyGraph.nodes.find(n=>n.id==='h.exempt').formula='Σ gananciaExenta[j]; reduce empieza IMPORTE_CERO; no se limita la suma después de agregar'
for(const [from,to,propertyPath] of [['public.general','h.item.total','ganancias[j].importeGananciaCentimos'],['money','h.item.total','centimos/100'],['h.item.exempt','h.exempt','Σ exenta[j]'],['public.explicit','public.activity','entrada.actividad → caso de adaptarActividadGeneral → calcularActividad2025']])propertyGraph.edges.push({from,to,kind:'value',propertyPath,condition:to==='public.activity'?'solo perfil solo-actividad-eds y guardas anuales satisfechas':'mismo índice j; array ausente→[]',reason:'Distinguir valor por transmisión de su suma y entrada pública del adaptador',evidence:to==='public.activity'?ref('lib/dominio/irpf/trabajo-anual/conexion.ts','liquidarIrpfAnualExplicito'):localTotal.source})
fs.writeFileSync(out+'grafo.json',JSON.stringify(propertyGraph))
const domainGraph=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'))
const lfile='lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts'
domainGraph.nodes.push({id:'validation.general',kind:'validation',symbol:'construirLiquidarIrpfAnual',property:'admisión general hasta perfil simple',formula:'retención estimada presente exige mismo año. Derechos presentes exigen validación, ausencia de alimentos propios sin mínimo y concordancia modo canónico/ejercicio/territorio/sin fallecimiento/familia individual/edad/familiares legacy vacíos/discapacidad. Deducciones no vacías se rechazan por detectarCasoNoSoportado: el catálogo cambia diagnóstico, nunca importe admitido.',source:ref(lfile,'construirLiquidarIrpfAnual')})
domainGraph.nodes.push({id:'validation.general.deductions',kind:'validation',symbol:'detectarCasoNoSoportado',property:'Option.none si sin deducción, Option.some rechazo si hay primera',formula:'deducciones[0] ausente→none; presente→catálogo solo selecciona motivo/rastro; siempre some ResultadoNoSoportado',source:ref(lfile,'detectarCasoNoSoportado')})
for(const to of ['g.I','g.C','g.P','g.F','g.N','g.R','i.I','i.N','h.total','h.exempt'])domainGraph.edges.push({from:'validation.general',to,kind:'domain-validation',propertyPath:'existencia de salida pública',condition:'caso/contexto admitidos; ramas de derechos/retención/deducciones según presencia',reason:'Se distingue admisión global de cálculo del importe',evidence:ref(lfile,'construirLiquidarIrpfAnual')})
for(const [symbol,property,args] of [['validarDerechosMinimos','return derechos validados o error',{entrada:'caso.derechosMinimos'}],['hayAlimentosPropiosSinMinimo','return boolean',{derechos:'derechos validados'}],['validarRentasAnualesDerechos','Effect éxito/error',{derechos:'caso.derechosMinimos',renta:'g.N+g.O'}]]){
 const id='minimum.validation.'+symbol
 domainGraph.nodes.push({id,kind:'boundary',symbol,property,arguments:args,source:ref('lib/dominio/irpf/minimos/derechos.ts',symbol),contract:'Lote mínimos: contrato de admisión familiar. No tránsito de cantidad al íntegro/neto/reducción; una discrepancia rechaza salida pública. Composición pendiente.'})
 domainGraph.edges.push({from:id,to:'validation.general',kind:'domain-validation',propertyPath:property,condition:'solo si caso.derechosMinimos presente',reason:'Guardas familiares externas por propiedad',evidence:ref(lfile,'construirLiquidarIrpfAnual')})
}
domainGraph.edges.push({from:'validation.general.deductions',to:'validation.general',kind:'domain-validation',propertyPath:'admisión',condition:'deducciones.length!==0',reason:'No hay deducción evaluada por este camino',evidence:ref(lfile,'detectarCasoNoSoportado')})
fs.writeFileSync(out+'grafo.json',JSON.stringify(domainGraph))
const finalOmissions=JSON.parse(fs.readFileSync(out+'omisiones.json','utf8'))
for(const row of finalOmissions)if(!row.siteId.startsWith('anual.explicito.'))row.decisions.push({omission:'Admisión por derechos familiares del llamador público',status:'frontera-exacta',evidence:'minimum.validation.validarDerechosMinimos/ hayAlimentosPropiosSinMinimo/ validarRentasAnualesDerechos; propiedades de retorno y argumentos en grafo; control de existencia, no cuantía'})
fs.writeFileSync(out+'omisiones.json',JSON.stringify(finalOmissions,null,2))
const transportGraph=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'))
for(const [id,file,symbol,formula,kind] of [
 ['r.cutoff','lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts','FECHA_CORTE_REDUCCION_TRABAJO_2018','2018-07-05; literal civil inclusividad por comparación <','derived'],
 ['r.maximo','lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts','maximo','argumentos a,b Decimal; a.greaterThan(b) devuelve a, si no b; sin redondear','derived'],
 ['money.create','lib/dominio/dinero/importe-monetario.ts','crearImporteMonetario','new Decimal(valor); valor literal/argumento según llamador','external-primitive'],
 ['money.zero','lib/dominio/dinero/importe-monetario.ts','IMPORTE_CERO','crearImporteMonetario(0), identidad aditiva','derived'],
 ['a.sum','lib/dominio/irpf/actividades-economicas/calcular.ts','suma','valores.reduce((a,b)=>a.plus(b),new D(0)); cada llamador pasa su array de strings, nunca documento/id','derived']
])transportGraph.nodes.push({id,kind,symbol,property:'return/value',formula,source:ref(file,symbol)})
for(const [from,to,args] of [['r.cutoff','r.before','fechaCorte'],['r.maximo','r.2018','a=IMPORTE_CERO,b=nueva−anterior'],['r.maximo','r.reduccionTrabajo2019A2022','a=0,b=5565−1.5×(P−13115)'],['r.maximo','r.reduccionTrabajo2023','a=0,b=6498−1.14×(P−14047.5)'],['money.create','money','centimos como valor antes de div100'],['money.create','money.zero','valor=0'],['money.zero','g.R','salidas IMPORTE_CERO según rama'],['a.sum','a.income','caso.ingresos.map(i=>i.base)'],['a.sum','a.ordinary','caso.gastos.map(g=>g.base)'],['a.sum','a.reta','caso.reta.map(r=>r.importe)'],['a.sum','a.subject','ingresos filtrados sujetoRetencion, base'],['a.sum','a.withholding','retenciones.map(r=>r.importe)'],['a.sum','a.payments','pagosFraccionados.map(p=>p.importe)'],['a.sum','a.employer','bases ingresos filtrados clienteId']])transportGraph.edges.push({from,to,kind:'value',propertyPath:args,condition:'solo rama indicada por el consumidor; auxiliares numéricos no validan dominio',reason:'Expansión explícita de helper/identidad con argumentos de llamada',evidence:transportGraph.nodes.find(n=>n.id===from).source})
for(const s of transportGraph.sites)s.outputTransport={symbol:'crearLineaCalculo',property:'origen.decimal',formula:'importe.toFixed() sin decimales prefijados; resultado visual EUR=importe.toFixed(2)+" euros"; siteId/instancia solo identidad, no valor',source:ref('lib/dominio/explicacion/linea-calculo.ts','crearLineaCalculo')}
fs.writeFileSync(out+'grafo.json',JSON.stringify(transportGraph))
const instanceGraph=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'))
const paths=[['a.asset.quota','caso.activos[k]','min(base−acumulada,base×coeficiente), con base=coste+puestaMarcha−residual',0,'a.amort'],['a.item.income','caso.ingresos[k].base','new D(i.base)',2,'a.income'],['a.item.expense','caso.gastos[k].base','new D(g.base)',3,'a.ordinary'],['a.item.reta','caso.reta[k].importe','new D(r.importe)',4,'a.reta']]
for(const [id,property,formula,index,aggregate] of paths){
 const instance=instanceGraph.instances[index]
 instance.root=id
 instanceGraph.nodes.push({id,kind:'derived',symbol:'etapa',property,formula,source:instance.argument4})
 instanceGraph.edges.push({from:'public.activity',to:id,kind:'value',propertyPath:property,condition:index===0?'por activo k; solo submotor aislado, anual rechaza activos':'por asiento k admitido, sin mezclar otro diario',reason:formula,evidence:instance.argument4})
 instanceGraph.edges.push({from:id,to:aggregate,kind:'value',propertyPath:'Σ valores por k de este diario; nunca IDs/documentos',condition:'array correspondiente; vacío→0',reason:'Agregación posterior distinta de la instancia individual',evidence:instance.argument4})
}
instanceGraph.edges.push({from:'a.asset.quota',to:'a.saldo',kind:'value',propertyPath:'saldo[k]−cuota[k]',condition:'mismo activo k; solo submotor aislado',reason:'Saldo posterior no vuelve al gasto/amortización',evidence:instanceGraph.instances[1].argument4})
fs.writeFileSync(out+'grafo.json',JSON.stringify(instanceGraph))
fs.writeFileSync(out+'instancias.json',JSON.stringify(instanceGraph.instances,null,2))
