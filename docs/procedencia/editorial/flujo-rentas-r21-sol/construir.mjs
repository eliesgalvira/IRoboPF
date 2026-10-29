import fs from 'node:fs'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import zlib from 'node:zlib'
const require = createRequire('/home/elies/Repos/IRoboPF/package.json')
const ts = require('typescript')
const out = 'docs/procedencia/editorial/flujo-rentas-r21-sol/'
const read = p => JSON.parse(fs.readFileSync(p,'utf8'))
const sha = b => crypto.createHash('sha256').update(b).digest('hex')
const write = (p,d) => fs.writeFileSync(out+p,JSON.stringify(d)+'\n')
const cache = new Map()
function source(file) {
  if (!cache.has(file)) { const bytes=fs.readFileSync(file); const text=bytes.toString('utf8');cache.set(file,{file,sha256:sha(bytes),text,ast:ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true)}) }
  return cache.get(file)
}
function ref(file,start,end) { const s=source(file); return {file,sha256:s.sha256,start,end,offsetEncoding:'utf16',text:s.text.slice(start,end)} }
function walk(n,fn) {fn(n);ts.forEachChild(n,c=>walk(c,fn))}
function anchor(file,symbol,kind='writes') {
  const s=source(file), nodes=[]
  walk(s.ast,n=>{
    if (kind==='function' && ts.isFunctionDeclaration(n) && n.name?.text===symbol) nodes.push(n)
    if (kind==='writes' && ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text===symbol && n.initializer) nodes.push(n)
    if (kind==='writes' && ts.isBinaryExpression(n) && n.left.getText(s.ast)===symbol && n.operatorToken.kind===ts.SyntaxKind.EqualsToken) nodes.push(n)
    if (kind==='property' && ts.isPropertyAssignment(n) && n.name.getText(s.ast)===symbol) nodes.push(n)
  })
  if (!nodes.length) throw new Error(`Sin ancla ${file} ${symbol} ${kind}`)
  return nodes.map(n=>ref(file,n.getStart(s.ast),n.end))
}
const L='lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts', W='lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts', C='lib/dominio/irpf/trabajo-anual/conexion.ts', G='lib/dominio/irpf/trabajo-anual/calcular.ts', R='lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts', S='lib/dominio/laboral/cotizaciones-perfil-uniforme.ts', T='lib/dominio/laboral/cotizaciones-sociales.ts', A='lib/dominio/irpf/actividades-economicas/calcular.ts', H='lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts', K='lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts', V='lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts'
const nodes=new Map()
function node(id,file,symbol,deps,reason,kind='writes') {nodes.set(id,{id,symbol,evidence:anchor(file,symbol,kind),dependsOn:deps,reason})}
node('I',L,'rendimientoIntegroTrabajo',[],'Suma de importes íntegros declarados en céntimos, convertidos a euros; no usa gastos.')
node('I.sum',W,'sumarRendimientosTrabajo',[],'Reduce trabajo.importeIntegroCentimos; cero inicial y conversor son operaciones técnicas.','writes')
nodes.get('I').dependsOn=['I.sum']
node('SS.select',L,'cotizacionesSociales',[],'Selecciona función por contexto.modo; recibe año y suma de salarios.')
node('W.P',W,'rendimientoPrevioNeto',['I','SS.worker'],'I menos cotización aplicada; anual suministra la cuota y evita fallback.')
node('W.F',W,'gastosDeducibles',[],'GASTOS_FIJOS_IRPF_LEGACY[anio]; valor teórico sin limitar por P.')
node('W.net',W,'rendimientoNeto',['W.P','W.F'],'max(0,P-F), perfil simplificado; no regla universal de pérdidas.','property')
node('W.result',L,'rendimientoTrabajo',['I','SS.worker','W.P','W.F','W.net'],'Argumentos suministrados a calcularRendimientoNetoTrabajo.')
node('O',L,'otrasRentasNoExentas',['K.net','H.subject'],'Suma algebraica antes de compensaciones; no base ahorro saturada.')
node('R',L,'reduccionRendimientosTrabajo',['W.P','O','R.formula'],'Año y fallecimiento eligen rama; f no reduce P.')
node('R.formula',R,'calcularReduccionTrabajoConOtrasRentas',[],'Selector anual, O>6500 y funciones por período; cierre normativo aparte.')
for(const n of ['reduccionTrabajoHasta2014','reduccionTrabajo2015A2017','reduccionTrabajo2018','reduccionTrabajo2019A2022','reduccionTrabajo2023','reduccionTrabajoDesde2024']) node('R.'+n,R,n,[],'Rama exacta de artículo20; consultar predicado en R.formula.')
nodes.get('R.reduccionTrabajo2018').dependsOn=['R.reduccionTrabajo2015A2017','R.reduccionTrabajo2019A2022']
nodes.get('R.formula').dependsOn=[...nodes.keys()].filter(k=>k.startsWith('R.reduccion'))
node('K.sum',K,'sumarRendimientosCapitalInmobiliario',[],'Suma de importes íntegros declarados; lista opcional vacía.')
node('K.net',K,'calcularRendimientoNetoCapitalInmobiliarioSimplificado',['K.sum'],'Identidad N=I: no hay gastos ni reducciones de alquiler.')
node('H.total',H,'gananciaTotal',[],'Importe declarado convertido; no depende de exenciones.')
node('H.old',H,'calcularGananciaExentaInmuebleUrbanoAdquirido2012',[],'Fecha adquisición en ventana, urbano oneroso no vinculado; porcentaje sobre ganancia positiva residual.')
node('H.age',H,'calcularGananciaExentaMayores65',[],'Edad y tratamiento; vitalicia desde2015, vivienda por otra rama.')
node('H.life',H,'calcularExencionPorReinversionEnRentaVitalicia',[],'Margen240000-previas, reinversión/transmisión limitada a1; se limita gananciaExenta después.')
nodes.get('H.age').dependsOn=['H.total','H.life'];nodes.get('H.old').dependsOn=['H.total','H.age']
node('H.exempt',H,'gananciaExenta',['H.total','H.age','H.old'],'max(0,min(gananciaTotal,exenciones)); pérdidas no producen exención negativa.')
node('H.subject',H,'gananciaSujeta',['H.total','H.exempt'],'Resta de exención y clasificación general/ahorro por fechas y año.','property')
node('E.admission',G,'calcularGastosTrabajo',[],'Admisión de gastos del trabajo, solo rama trabajo; no es valor de ninguna suma.','function')
node('E.I',G,'bruto',[],'Inicial0 y acumulación exclusiva r.integro; los gastos no retroalimentan bruto.')
node('E.ordinary',G,'ordinarios',[],'Cotizaciones efectivas y sindicato satisfecho. No aplica límite colegial al sindicato.')
node('E.college',G,'colegio',[],'Importes solo si satisfecho, obligatorio y fines esenciales.')
node('E.defence',G,'defensa',[],'Importes solo si satisfecho y litigio directo con pagador.')
node('E.AE',G,'gastos',['E.ordinary','E.college','E.defence'],'Ordinarios+min(colegio,500)+min(defensa,300); límites anuales sobre agregados.')
node('E.P',G,'previo',['E.I','E.AE'],'Bruto menos a-e, conserva signo; argumento art20.')
node('E.theory',G,'teoricos',[],'2000 desde2015;0 antes. No es gasto efectivo.')
node('E.f',G,'generales',['E.P','E.theory'],'min(teoricos,max(0,previo)).')
node('E.disability',G,'discapacidad',['E.P','E.f','E.increment'],'Limita incremento a saldo después de f; conexión anual exige ninguna.')
node('E.increment',G,'incremento',[],'0,7750 o3500 según discapacidad y ayuda; rama anual sin discapacidad.')
node('E.art19',G,'netoArt19',['E.P','E.f','E.disability'],'previo-generales-discapacidad; pérdidas efectivas permanecen.','property')
node('E.art20',C,'reduccionArt20',['E.P','E.art19','R.formula'],'min(max(art19,0),R2025(P,0)); el tope art19 añade dependencia transitiva de f.')
node('E.net',C,'neto',['E.art19','E.art20','A.aporte'],'Asignaciones disjuntas solo-trabajo/solo-actividad; no suma de ambos perfiles.')
node('E.base',C,'base',['E.net'],'max(neto,0) solo para cuota; BIG/BLG con signo en rastro.')
node('E.state',C,'cuotaEstatal',['E.base'],'Escala estatal menos escala mínimo limitado; fuentes exactas en llamadas, terminal normativo del loteA no analizado.')
node('E.region',C,'cuotaAutonomica',['E.base'],'Escala Madrid publicada menos escala mínimo limitado; terminal normativo loteA no analizado.')
node('E.liquid',C,'liquida',['E.state','E.region'],'Suma estatal/autonómica; no otras deducciones en contrato.')
node('E.services',C,'brutoServicios',['E.I'],'Solo empleo laboral/estatutario; pensión y actividad dejan0.')
node('E.da61.fn',G,'calcularDeduccionTrabajo',[],'Rama DA61: legal=max(0,340-.2max(0,S-16576)) si O<=6500; límite proporcional y cuotaTrasArt80. Art80bis cohabita pero no se llama.','function')
node('E.da61',C,'deduccion',['E.services','E.base','E.liquid','E.da61.fn'],'Solo si brutoServicios>0 y ejercicio2025; resultado.importeAplicable.')
node('E.after',C,'posterior',['E.liquid','E.da61'],'Inicial líquida o resultado.cuotaPosterior de DA61.')
node('E.withheld',C,'retenciones',['A.retenciones'],'Trabajo suma caso.retenciones; actividad usa aporte.retencionesEuros. No algoritmo estimado.')
node('E.payments',C,'pagos',['A.pagos'],'Trabajo0; actividad suma pagos efectivos del aporte.')
node('E.diff',C,'diferencial',['E.after','E.withheld','E.payments'],'posterior-retenciones-pagos; retenciones no reducen rendimiento.')
/** @type {Array<[string,string,string[],string]>} */
const componentSpecs = [
 ['B','baseOrdinaria',[],'2018 pondera7/5 topes3751.20/3803.70; otro año legacy.baseOrdinaria.'],
 ['X','excesoBase',['SS.B'],'max(0,S-B).'],
 ['employerOrd','cotizacionEmpresarialOrdinaria',['SS.B'],'B por suma tipos empresariales.'],
 ['workerOrd','cotizacionTrabajadorOrdinaria',['SS.B'],'B por suma tipos obreros.'],
 ['meiEmployer','meiEmpresarial',['SS.B'],'B por parametros.mei.empresarial.'],
 ['meiWorker','meiTrabajador',['SS.B'],'B por parametros.mei.trabajador.'],
 ['solidEmployer','solidaridadEmpresarial',['SS.X','SS.tranches'],'cuotaSolidaridad(X,maximo,tipos empresa por año).'],
 ['solidWorker','solidaridadTrabajador',['SS.X','SS.tranches'],'cuotaSolidaridad(X,maximo,tipos trabajador por año).'],
 ['employer','cotizacionEmpresarial',['SS.employerOrd','SS.meiEmployer','SS.solidEmployer'],'Suma tres componentes empresa.'],
 ['worker','cotizacionTrabajador',['SS.workerOrd','SS.meiWorker','SS.solidWorker'],'Suma tres componentes obrero.']
]
for(const [id,symbol,deps,reason] of componentSpecs)node('SS.'+id,S,symbol,deps,reason,['employer','worker'].includes(id)?'property':'writes')
node('SS.tranches',S,'cuotaSolidaridad',[],'Exceso10%,40%,resto y tipos publicados por lado; no reparto5/6.')
node('SS.legacy',T,'calcularDesgloseCotizacionesSocialesLegacy',[],'Legacy: base anual y solidaridad total repartida5/6 y1/6; no tipos por pagador publicados.')
node('SS.params',T,'obtenerParametrosCotizacionLegacy',[],'Base máxima por año, tipos ordinarios, MEI por año, política solidaridad legacy.')
node('SS.baseParam',T,'baseMaxima',[],'Lectura BASE_MAXIMA_COTIZACION_LEGACY[anio], sin MEI ni tipos ordinarios.','property')
node('SS.ordinaryTypes',T,'TIPOS_SEGURIDAD_SOCIAL_LEGACY',[],'Seleccionar solo empresarial o trabajador en sumarTipoCotizacionLegacy; no cruzar los lados.')
node('SS.meiParams',T,'obtenerTiposMei',[],'Rama año y lado: cero anterior2023; no solidaridad.')
nodes.get('SS.B').dependsOn.push('SS.baseParam')
node('SS.employerTypes',T,'TIPOS_SEGURIDAD_SOCIAL_LEGACY',[],'Seleccionar propiedad empresarial en cada concepto; trabajador excluido.')
node('SS.workerTypes',T,'TIPOS_SEGURIDAD_SOCIAL_LEGACY',[],'Seleccionar propiedad trabajador en cada concepto; empresarial excluido.')
node('SS.meiEmployerParams',T,'obtenerTiposMei',[],'Seleccionar empresarial en objeto devuelto por año; componente trabajador excluido.')
node('SS.meiWorkerParams',T,'obtenerTiposMei',[],'Seleccionar trabajador en objeto devuelto por año; componente empresarial excluido.')
nodes.get('SS.employerOrd').dependsOn.push('SS.employerTypes')
nodes.get('SS.workerOrd').dependsOn.push('SS.workerTypes')
nodes.get('SS.meiEmployer').dependsOn.push('SS.meiEmployerParams')
nodes.get('SS.meiWorker').dependsOn.push('SS.meiWorkerParams')
for(const id of ['solidEmployer','solidWorker'])nodes.get('SS.'+id).dependsOn.push('SS.baseParam')
node('SS.cost',L,'costeLaboralCentimos',['I','SS.employer'],'S+empresa; obrero ya forma parte de S.','property')
node('A.aporte',A,'aporte',['A.RN','A.reduccion','A.inicio'],'RN-R32_2-Rinicio con signo.')
node('A.RN',A,'RN',['A.P','A.G'],'P-G.')
node('A.P',A,'P',['A.ingresos','A.gastos'],'Ingresos menos ordinarios+RETA+amortización, deducidos una sola vez.')
node('A.ingresos',A,'ingresos',[],'Suma bases antes de retención sin IVA recuperable.')
node('A.gastos',A,'gastos',['A.ordinary','A.reta','A.amort'],'Ordinarios+RETA+amortización.')
node('A.ordinary',A,'ordinarios',[],'Suma bases de gastos correlacionados admitidos.')
node('A.reta',A,'reta',[],'Suma cuotas efectivas ordinarias propias por período único.')
node('A.amort',A,'amortizacion',['A.cuota'],'Suma cuotas activos; conexión rechaza activos y queda0.')
node('A.cuota',A,'cuota',[],'min(saldo,base*coef); saldo patrimonial no vuelve a ser gasto.')
node('A.G',A,'G',['A.P'],'Opción cliente único0; otra min(2000,.05max(P,0)).')
node('A.elegible',A,'elegible',['A.ingresos','A.gastos'],'Un cliente,I>0,gastos<=.30I,sujetos>=.70I,obligaciones. Condición material y de elección.')
node('A.adicional',A,'adicional',['A.RN'],'6498/14047.5/1.14; distinto de7302 salarial.')
node('A.incremento',A,'incremento',[],'Ejercicio efectivo y grado33/65/ayuda;3500/7750; anual rechaza grado no0.')
node('A.low',A,'reduccionRentasBajas2025',[],'min(RN+,max(0,1620-.405max(RN-8000,0))).','function')
node('A.reduccion',A,'reduccion',['A.RN','A.adicional','A.incremento','A.low'],'Opción cliente único min(RN+,2000+adicional+incremento); otra solo si !elegible y aplicarRentasBajas.')
node('A.inicio',A,'reduccionInicio',['A.RN','A.reduccion'],'Si elección/elegible .20min(100000,(RN-R32_2)+); otro0.')
node('A.inicioEligible',A,'inicioElegible',[],'Inicio>=2013, primer positivo y siguiente, exclusión antiguo empleador>50%; historial no reinicia tras pérdidas.')
node('A.retenciones',A,'retenciones',[],'Suma operaciones efectivas únicas correlacionadas con ingresos; separada de aporteBIG.')
node('A.pagos',A,'pagos',[],'Suma pagos efectivos únicos por período; fechas hasta2026-01-30 no cambian ejercicio2025.')
node('A.etapas',A,'etapa',[],'Cada invocación conserva reglaId,id,valor,documentos. Se entrega además catálogo de cada llamada.')
node('V.base',V,'baseRetencion',[],'max(0,rendimientoNetoReducido-reducciones): cotizaciones,irregularidades,art20 versionado,otrosGastos,pensión/alimentos.')
node('V.quota',V,'cuotaRetencion',['V.base'],'min(cuotaInicial,limite43); cuotaInicial integra escala,mínimos,anualidades,exento.')
node('V.type',V,'tipoRetencion',['V.quota'],'Diferencia positiva tras Ceuta/Melilla y vivienda; cociente truncado2; mínimo por contrato.')
node('V.amount',V,'importeRetencion',['V.type'],'redondear1(retribucion*tipo/100), aCentimos y volver a euros para rastro.')
node('V.payments',L,'pagosACuentaAplicadosCentimos',['V.amount'],'caso.pagosACuentaCentimos+estimación opcional; no suma aquí soportadas.')
node('V.actual',L,'retencionesSoportadasCentimos',[],'Importe consignado por llamador, conversión a euros.','property')
nodes.get('A.etapas').dependsOn=['A.ingresos','A.ordinary','A.reta','A.cuota','A.amort','A.P','A.G','A.RN','A.adicional','A.incremento','A.reduccion','A.inicio','A.aporte','A.retenciones','A.pagos']
const fichas=read('docs/procedencia/correcciones/editorial-r21/rentas-fichas.json')
const spec={
'anual.trabajo.integro':'I','anual.trabajo.cotizacion':'SS.worker','anual.trabajo.previo-neto':'W.P','anual.trabajo.gastos':'W.F','anual.trabajo.neto':'W.net','anual.trabajo.reduccion':'R',
'anual.explicito.trabajo.integro':'E.I','anual.explicito.trabajo.gastos-a-e':'E.AE','anual.explicito.trabajo.gasto-f':'E.f','anual.explicito.trabajo.art19':'E.art19','anual.explicito.trabajo.art20':'E.art20','anual.explicito.da61':'E.da61','anual.explicito.retenciones':'E.withheld','anual.explicito.pagos':'E.payments','anual.explicito.diferencial':'E.diff','anual.explicito.actividad.etapa':'A.etapas',
'anual.inmobiliario.integro':'K.sum','anual.inmobiliario.neto':'K.net','anual.ganancias.total':'H.total','anual.ganancias.exenta':'H.exempt','anual.pagos.retenciones':'V.actual','anual.pagos.cuenta':'V.payments','anual.retencion.base':'V.base','anual.retencion.cuota':'V.quota','anual.retencion.tipo':'V.type','anual.retencion.anual':'V.amount',
'anual.ss.base':'SS.B','anual.ss.exceso':'SS.X','anual.ss.empresarial-ordinaria':'SS.employerOrd','anual.ss.trabajador-ordinaria':'SS.workerOrd','anual.ss.mei-empresarial':'SS.meiEmployer','anual.ss.mei-trabajador':'SS.meiWorker','anual.ss.solidaridad-empresarial':'SS.solidEmployer','anual.ss.solidaridad-trabajador':'SS.solidWorker','anual.ss.empresarial-total':'SS.employer','anual.ss.trabajador-total':'SS.worker','anual.ss.coste-laboral':'SS.cost'}
const contract={temporal:'Ejercicio elige tablas; fallecimiento art20 anual2018; fechaPago elige versión de retención; no equivalentes.',territorial:'General condicionado por caso.comunidadAutonoma; explícito solo Madrid2025; SS no valida grupo/jornada.',contract:'Canonico/compatible-legacy son procedimientos distintos. Explícito solo trabajo o EDS, sin familiares, otras rentas ni activos; hechos conciliados externos.'}
function conditionsFor(id) {
 const territorial=id.startsWith('E.')?'Madrid2025 en conexión; régimen común declarado.':id.startsWith('A.')?'Submotor común2025; conexión solo Madrid2025.':'Ámbito del caso general; no inferir territorio por archivo.'
 let temporal='Sin selector temporal en esta operación; recibe importes ya admitidos por llamador.'
 let scope='Solo las variables/propiedades indicadas; no se presume regla jurídica completa.'
 if(id.startsWith('E.')){temporal='Conexión: ejercicio2025,devengo2025-12-31; DA61 rechaza2026.';scope='Ramas solo-trabajo o solo-actividad-eds disjuntas; sin familiares/otras rentas/activos. '+nodes.get(id).reason}
 else if(id.startsWith('A.')){temporal='Ejercicio2025; fechaInicio/historial/fechas documentales condicionan admisión; pagos hasta2026-01-30.';scope='EDS devengo continuo; instancia reglaId+id de etapa. '+nodes.get(id).reason}
 else if(id.startsWith('SS.')){temporal=id==='SS.B'?'anio===2018:7/5 topes; resto:base anual seleccionada [anio].':id.includes('mei')?'MEI:2023/2024/2025/>=2026; otro año0,por lado.':id.includes('solid')||id==='SS.tranches'?'Tipos canónicos2025/2026,otro año0; tres bandas de exceso.':'Parámetros por [anio]; tipos ordinarios heredados, no vigencia jurídica acreditada.';scope=id==='SS.legacy'?'Modo compatible-legacy: reparto5/6 y1/6.':'Modo canónico: doce mensualidades uniformes,indefinido,sin especialidades; redondeoTGSS pendiente.'}
 else if(id.startsWith('R.')){temporal={'R.reduccionTrabajoHasta2014':'anio<=2014','R.reduccionTrabajo2015A2017':'2015<=anio<=2017; también fórmula anterior de media2018','R.reduccionTrabajo2018':'anio===2018; fallecimiento civil antes2018-07-05 selecciona anterior','R.reduccionTrabajo2019A2022':'2019<=anio<=2022; también fórmula nueva de media2018','R.reduccionTrabajo2023':'anio===2023','R.reduccionTrabajoDesde2024':'anio>=2024 en código; no aceptación vigencia2026'}[id]??'Selector por anio,O>6500 y fallecimiento2018.';scope='P excluye f; O algebraico no exento; explícito fija2025 yO0.'}
 else if(id.startsWith('H.')){temporal=id==='H.life'||id==='H.age'?'Edad>=65; vitalicia solo anio>=2015; vivienda por otra rama.':id==='H.old'?'Adquisición en ventana DA37 de2012, no fecha de venta.':id==='H.subject'?'Clasificación2013/2014 por fechas; otros años ahorro.':'Importe declarado, sin selector de exención en suma total.';scope='Ganancia/pérdida con signo; exención limitada a ganancia positiva; acumulados/hechos externos.'}
 else if(id==='V.actual'){temporal='Importe soportado consignado en caso anual; no depende del catálogo estimador.';scope='Conversión céntimos/euros; conciliación externa de pagos efectivos.'}
 else if(id.startsWith('V.')){temporal='Canónico: selector por anio y fechaPago/perfilTemporal;2012-2016 sin versión;2026 solo10sept–29oct.';scope='Procedimiento inicial; regularización rechazada. Compatible-legacy no selecciona fecha. Familia,contrato,Ceuta/Melilla según predicados.'}
 else if(id==='R'){temporal='Anio2012–2026 técnico y fallecimiento2018; reforma2026 no cerrada.';scope='Perfil general: reducción sobre P antes f y O antes compensación.'}
 else if(id.startsWith('W.')){temporal='Tabla gasto fijo por anio;2012–2014:0,desde2015:2000 en código.';scope='Perfil general simplificado; cotización obrera suministrada, fallback no ejecutado en esta llamada.'}
 return {temporal,territorial,contract:scope}
}
function edge(id,chain,reason) {const n=nodes.get(id);return {symbol:n.symbol,nodeId:id,chain:chain.map(k=>({nodeId:k,symbol:nodes.get(k).symbol,sources:nodes.get(k).evidence.map(e=>({file:e.file,sha256:e.sha256,start:e.start,end:e.end,offsetEncoding:e.offsetEncoding}))})),conditions:conditionsFor(id),reason:reason??n.reason}}
function paths(root) {
 const result=[], visited=new Set()
 function visit(id,chain){for(const dep of nodes.get(id).dependsOn){if(root.startsWith('E.')&&dep.startsWith('R.reduccion')&&dep!=='R.reduccionTrabajoDesde2024')continue;if(chain.includes(dep))throw new Error('Ciclo');if(visited.has(dep))continue;visited.add(dep);const path=[...chain,dep];result.push({id:dep,path});visit(dep,path)}}
 visit(root,[root]);return result
}
const excluded={
 I:['W.F','R','SS.worker'], 'E.I':['E.AE','E.f','E.art20'], 'H.total':['H.exempt','H.life'], 'SS.B':['SS.tranches','SS.meiEmployer'], 'E.withheld':['E.da61'], 'A.ingresos':['A.G','A.reduccion','A.retenciones'], 'V.base':['V.type'], 'V.actual':['V.amount']
}
const sites=fichas.filter(f=>f.objetivo.siteId).map(f=>{
 const id=f.objetivo.siteId,root=spec[id]; if(!root)throw new Error(id)
 const p=paths(root),direct=nodes.get(root).dependsOn.map(dep=>edge(dep,[root,dep]));
 const seen=new Set(direct.map(e=>e.nodeId)); const transit=p.filter(x=>{if(x.path.length<=2||seen.has(x.id))return false;seen.add(x.id);return true}).map(x=>edge(x.id,x.path));
 const code=f.codigo.map(c=>{const sel=c.selector;const r=ref(c.archivo,sel.inicio,sel.fin);if(r.sha256!==c.sha256)throw new Error('Fuente histórica difiere');return r})
 const controls=[]
 if(root==='A.etapas'||root==='E.diff'||root==='E.payments'||root==='E.withheld'){for(const k of ['A.elegible','A.inicioEligible'])controls.push(edge(k,[k],'Selector material de la rama de actividad; no se suma al resultado. Aplicable solo en perfil EDS y en la instancia pertinente.'))}
 if(root.startsWith('E.'))controls.push(edge('E.admission',['E.admission'],'Solo rama trabajo: rechazos del contrato; no importe ni acreditación externa de hechos.'))
 if(id.includes('.ss.') || root.startsWith('SS.') || ['W.P','W.net'].includes(root))controls.push(edge('SS.select',['SS.select'],'Modo selecciona cálculo canónico o legacy; condiciona componentes, no es una cuantía.'))
 if(id.includes('explicito'))controls.push({symbol:'CasoFiscalAnualExplicito',chain:[{symbol:'CasoFiscalAnualExplicito',sources:anchor('lib/dominio/irpf/trabajo-anual/conexion-contrato.ts','CasoFiscalAnualExplicito')}],conditions:contract,reason:'Schema y rechazos de conexión restringen dominio; no se suman al importe.'})
 const omit=[]
 if(root.startsWith('SS.') || ['W.P','W.net','R'].includes(root))omit.push('Ruta legacy conservada como nodo SS.legacy; falta desagregar su tránsito por cada propiedad y registrar selección de hojas efectivas anuales como aristas finales.')
 if(root.startsWith('V.'))omit.push('Auxiliares retención y selección por versión descritos y localizados en anexo; falta expansión de todas sus tablas/familiares a hojas terminales.')
 if(['E.da61','E.diff'].includes(root))omit.push('Escalas y mínimos son terminales de llamada del loteA; no se examina el trabajo activo del otro autor ni se afirma cierre de sus hojas.')
 if(root==='A.etapas')omit.push('Cada llamada etapa se cataloga aparte; falta resolver alias por instancia y conectar automáticamente catálogo con grafo del sitio.')
 omit.push('Aristas terminales hacia las325 ocurrencias se mantienen en anexo con clasificación individual; no se promueve una asociación por módulo a dependencia definitiva.')
 return {siteId:id,subject:f.objetivo.sujeto,snapshot:f.objetivo.snapshot,source:code,root:edge(root,[root]),valueDependencies:{direct,transitive:transit},controlDependencies:controls,excludedCoLocations:(excluded[root]??[]).map(k=>edge(k,[root,k],'Sin camino de valor en las expresiones examinadas; cohabitación no es dependencia.')),completeness:{technical:'partial-explicit',omissions:omit,legalAcceptance:false},explanation:nodes.get(root).reason,review:'pendiente de contraste independiente'}
})
write('flujo.json',{version:1,base:{head:'960773f909d4ecff290edfa3d7a7b2699a8445d3',physical:'fisico-inicial.json.gz'},inventory:{manifestSha256:'30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7',artifactSha256:'59bae155b45e791b1e1ec4f0003c4a3fa443c3d29bf91bb02ad931bfd797a2f7',occurrences:52461,totalSites:65},sites})
write('nodos.json',[...nodes.values()])
const concepts=fichas.filter(f=>!f.objetivo.siteId).map((f,i)=>({id:f.id,subject:f.objetivo.sujeto,snapshot:f.objetivo.snapshot,root:edge(['H.subject','H.old','H.life'][i],[['H.subject','H.old','H.life'][i]]),interpretation:f.secciones,complete:false,review:'pendiente'}));write('conceptos.json',concepts)
const stageCalls=[];walk(source(A).ast,n=>{if(ts.isCallExpression(n)&&n.expression.getText(source(A).ast)==='etapa')stageCalls.push({source:ref(A,n.getStart(),n.end),regla:n.arguments[0]?.getText(),instance:n.arguments[1]?.getText(),value:n.arguments[3]?.getText(),annualExclusions:'Activos y discapacidad de actividad rechazados por conexión; historial y pagos preservados.'})});write('instancias-actividad.json',stageCalls)
const occurrences=[]
for(const file of ['rentas-parametros','rentas-controles-tecnicos'])for(const row of read('docs/procedencia/correcciones/editorial-r21/'+file+'.json')){
 const o=row.ocurrencia,s=source(o.fuente.file),st=o.fuente.start,en=o.fuente.end
 if(s.sha256!==o.fuente.sha256)throw new Error('Hash ocurrencia '+o.id)
 let best=s.ast;walk(s.ast,n=>{if(n.getStart(s.ast)<=st&&n.end>=en&&n.end-n.getStart(s.ast)<best.end-best.getStart(s.ast))best=n})
 const ancestors=[];let a=best
 while(a&&!ts.isSourceFile(a)){ancestors.push(a);a=a.parent}
 const expression=ancestors.find(n=>ts.isBinaryExpression(n)||ts.isConditionalExpression(n)||ts.isCallExpression(n)||ts.isElementAccessExpression(n))??best
 const statement=ancestors.find(n=>ts.isIfStatement(n)||ts.isReturnStatement(n)||ts.isVariableDeclaration(n)||ts.isExpressionStatement(n))??expression
 const isPredicate=ancestors.some(n=>ts.isIfStatement(n)&&n.expression.pos<=st&&n.expression.end>=en)||ancestors.some(n=>ts.isBinaryExpression(n)&&[ts.SyntaxKind.LessThanToken,ts.SyntaxKind.GreaterThanToken,ts.SyntaxKind.EqualsEqualsEqualsToken,ts.SyntaxKind.LessThanEqualsToken,ts.SyntaxKind.GreaterThanEqualsToken,ts.SyntaxKind.ExclamationEqualsEqualsToken].includes(n.operatorToken.kind))
 const effective=o.capa!=='syntactic'
 let role=isPredicate?'control-material-o-dominio':'valor-operacion'
 if(ancestors.some(n=>ts.isElementAccessExpression(n)&&n.argumentExpression.pos<=st&&n.argumentExpression.end>=en))role='indice-de-acceso'
 if(['dias','bisiesto','previos'].includes(o.simbolo)||o.simbolo==='fechaValida'||o.simbolo==='fechaCivilIsoUtc')role='calendario-o-representacion'
 if(o.simbolo==='D')role='precision-decimal'
 if(['bruto','ordinarios','colegio','defensa','amortizacion','suma'].includes(o.simbolo)&&row.valor==='0')role='identidad-aditiva-inicial'
 if(o.id==='inv-052ac8b7a07f282dd9c3fb7ade0d8261')role='condicion-material-discapacidad-actividad'
 if(o.id==='inv-1df2eac53e8332f88fe46ef5a3aae75a')role='condicion-temporal-discapacidad-trabajo'
 if(effective)role='hoja-efectiva-con-selector-no-token'
 const matches=[...nodes.values()].filter(n=>n.evidence.some(e=>e.file===s.file&&e.start<=st&&e.end>=en))
 occurrences.push({occurrenceId:o.id,source:ref(s.file,st,en),symbol:o.simbolo,value:row.valor,origin:file,layer:o.capa,selector:o.ruta,role,expression:ref(s.file,expression.getStart(s.ast),expression.end),statement:ref(s.file,statement.getStart(s.ast),statement.end),reason:effective?`${o.id}: valor efectivo ${row.valor} seleccionado por ruta ${o.ruta} en ${o.simbolo}; el rango conserva la declaración que lo produce, no un token literal. Vincular año/ruta, nunca buscar por número.`:`${o.id}: el token ${s.text.slice(st,en)} ocupa ${ts.SyntaxKind[best.kind]} en ${expression.getText(s.ast)}. Papel ${role}; se conserva el contexto de evaluación y no se asigna vigencia por el nombre del archivo.`,enclosingNodes:matches.map(n=>n.id),edgeStatus:'localizacion AST; no arista de valor por contención',conditions:row.ejercicios??[],legalAcceptance:false,omission:'Revisión de tránsito terminal y selector por cada camino antes del wiring definitivo.'})
}
write('ocurrencias-325.json',occurrences)
const sourceList=[...cache.values()].map(s=>({file:s.file,sha256:s.sha256,utf16Length:s.text.length}));write('fuentes.json',sourceList)
console.log(JSON.stringify({sites:sites.length,concepts:concepts.length,nodes:nodes.size,occurrences:occurrences.length,stageCalls:stageCalls.length,sources:sourceList.length}))
