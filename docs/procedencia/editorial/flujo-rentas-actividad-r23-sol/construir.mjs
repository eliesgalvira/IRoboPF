import fs from 'node:fs'
import crypto from 'node:crypto'
import {createRequire} from 'node:module'
import assert from 'node:assert/strict'
const require=createRequire('/home/elies/Repos/IRoboPF/package.json')
const ts=require('typescript')
const out='docs/procedencia/editorial/flujo-rentas-actividad-r23-sol/'
const old='docs/procedencia/editorial/flujo-rentas-r21-sol/'
const hash=b=>crypto.createHash('sha256').update(b).digest('hex')
const files={L:'lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts',W:'lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts',R:'lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts',C:'lib/dominio/irpf/trabajo-anual/calcular.ts',X:'lib/dominio/irpf/trabajo-anual/conexion.ts',T:'lib/dominio/irpf/trabajo-anual/adaptador.ts',A:'lib/dominio/irpf/actividades-economicas/calcular.ts',B:'lib/dominio/irpf/actividades-economicas/adaptador.ts',H:'lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts',I:'lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts',D:'lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts',M:'lib/dominio/dinero/importe-monetario.ts'}
function source(file,text){const body=fs.readFileSync(file,'utf8');const start=body.indexOf(text);assert(start>=0,file+' : '+text);return {file,sha256:hash(Buffer.from(body)),start,end:start+text.length,offsetEncoding:'utf16',text,rangeRole:'expression-or-declaration; never presumed literal'}}
function declaration(key,symbol){const file=files[key],text=fs.readFileSync(file,'utf8'),sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);let found=[];function visit(n){if((ts.isFunctionDeclaration(n)||ts.isVariableDeclaration(n))&&n.name?.getText(sf)===symbol)found.push(n);ts.forEachChild(n,visit)}visit(sf);if(key==='L'&&symbol==='cotizacionesSociales')found=found.filter(n=>n.getText(sf).includes('medirAuditoriaSync'));assert.equal(found.length,1,key+':'+symbol);return source(file,found[0].getText(sf))}
const nodes=[],edges=[]
const defaultScope='General: ejercicio y territorio admitidos por caso/contexto. Explícito: individual Madrid 2025, sin otras rentas/familiares/discapacidad, perfil exclusivo. Submotor EDS: común individual 2025, contrato admitido; no supone admisión anual.'
function n(id,key,symbol,property,formula,values=[],controls=[],validation=[]){const s=declaration(key,symbol);nodes.push({id,kind:'derived',symbol,property,formula,source:s,scope:defaultScope});for(const [kind,list] of [['value',values],['selection',controls],['domain-validation',validation]])for(const dep of list)edges.push({from:dep,to:id,kind,propertyPath:property,condition:defaultScope,reason:formula,evidence:s})}
function leaf(id,kind,property,key,symbol){nodes.push({id,kind,property,source:declaration(key,symbol),scope:defaultScope})}
leaf('public.general','public-input','liquidarIrpfAnual(caso,contexto)','L','liquidarIrpfAnual')
leaf('public.explicit','public-input','liquidarIrpfAnualExplicito(entrada)','X','liquidarIrpfAnualExplicito')
leaf('public.activity','public-input','calcularActividad2025(caso)','A','calcularActividad2025')
leaf('primitive.decimal','external-primitive','decimal.js: plus/minus/mul/div/min/max/toFixed; no autoridad fiscal','A','D')
n('money','M','centimosAEuros','return','new Decimal(centimos)/100; entrada pública céntimos → euros',['public.general','primitive.decimal'])
n('g.I','W','sumarRendimientosTrabajo','return','Σ caso.rendimientos.trabajo[*].importeIntegroCentimos /100; reduce empieza 0',['public.general','money'])
// Fronteras SS por propiedad: no se expande la implementación del otro lote.
for(const [id,file,symbol] of [['ss.canonical','lib/dominio/laboral/cotizaciones-perfil-uniforme.ts','calcularDesgloseCotizacionesPerfilUniforme'],['ss.legacy','lib/dominio/laboral/cotizaciones-sociales.ts','calcularDesgloseCotizacionesSocialesLegacy']]){
 nodes.push({id,kind:'boundary',symbol,property:'return.cotizacionTrabajador',source:declarationFrom(file,symbol),arguments:{anio:'caso.anio',salarioBrutoAnual:'g.I'},contract:'EUR Decimal de cuota obrera total; incluye componentes de su modo. Prohibido sustituir por cuota empresarial, base o coste. Canonical si contexto.modo===canonico; legacy en otro caso. Composición y revisión externa pendientes.'});
 edges.push({from:'g.I',to:id,kind:'value',propertyPath:'salarioBrutoAnual → return.cotizacionTrabajador',condition:id==='ss.canonical'?'contexto.modo===canonico':'contexto.modo!==canonico',reason:'argumento efectivo de la llamada anual',evidence:declaration('L','cotizacionesSociales')});edges.push({from:'public.general',to:id,kind:'selection',propertyPath:'anio/contexto.modo',condition:defaultScope,reason:'elige función y ejercicio',evidence:declaration('L','cotizacionesSociales')})
}
function declarationFrom(file,symbol){const key='temp';files[key]=file;return declaration(key,symbol)}
n('g.C','L','cotizacionesSociales','cotizacionTrabajador','selección canónico/legacy; cuota total suministrada explícitamente',['ss.canonical','ss.legacy'],['public.general'])
n('g.P','W','calcularRendimientoNetoTrabajo','rendimientoPrevioNeto','I−C; el fallback ?? legacy es inalcanzable desde llamada anual porque C se suministra',['g.I','g.C'])
n('g.F','D','GASTOS_FIJOS_IRPF_LEGACY','[caso.anio]','selector anual de tabla efectiva; declaración no es token numérico',[],['public.general'])
n('g.N','W','calcularRendimientoNetoTrabajo','rendimientoNeto','max(0,P−F)',['g.P','g.F','primitive.decimal'])
n('i.I','I','sumarRendimientosCapitalInmobiliario','return','Σ capitalInmobiliario[*].importeIntegroCentimos/100; ausente→[]→0',['public.general','money'])
n('i.N','I','calcularRendimientoNetoCapitalInmobiliarioSimplificado','rendimientoNeto','identidad de I; no gastos/amortización/reducción de alquiler',['i.I'])
n('h.total','H','calcularGananciasPatrimonialesPorTransmision','gananciaTotal','Σ convertirCentimos(ganancia.importeGananciaCentimos), conserva signo',['public.general','money'])
n('h.life.limit','H','LIMITE_REINVERSION_RENTA_VITALICIA_MAYORES_65','value','240000 euros',[],[])
n('h.life','H','calcularExencionPorReinversionEnRentaVitalicia','return','transmisión<=0 →0; margen=max(0,240000−previas); computable=min(reinvertido,margen); proporción=min(1,computable/transmisión); total×proporción',['h.total','h.life.limit','public.general','money'])
n('h.age','H','calcularGananciaExentaMayores65','return','edad<65 o SinExencion→0; ViviendaHabitual→total; Vitalicia: año<2015→0, desde2015→h.life',['h.total','h.life'],['public.general'])
n('h.window','D','EXENCION_50_POR_CIENTO_GANANCIAS_INMUEBLES_URBANOS_ADQUIRIDOS_2012','fechaInicioAdquisicion/fechaFinAdquisicion/porcentajeExento','selector fecha de adquisición, porcentaje 50%; no fecha venta')
n('h.old','H','calcularGananciaExentaInmuebleUrbanoAdquirido2012','return','ausente→0; urbano oneroso no vinculado y adquisición en ventana inclusiva → max(0,total−exención65)×porcentaje; resto0',['h.total','h.age','h.window'],['public.general'])
n('h.exempt','H','calcularGananciaPatrimonialPorTransmision','gananciaExenta','max(0,min(total,age+old)), por transmisión; suma en agregado',['h.total','h.age','h.old'])
n('h.subject','H','calcularGananciaPatrimonialPorTransmision','gananciaSujeta','total−exenta, conserva pérdida',['h.total','h.exempt'])
n('h.classify.helper','D','clasificarGananciaPatrimonialHasta2014','return','derivaDeTransmision=true; fechas adquisición/transmisión; algoritmo histórico exacto en fuente, entradas públicas', ['public.general'])
n('h.classify','H','clasificarBaseGanancia','baseIntegracion','2013/2014 helper histórico; otros años base-ahorro', ['h.classify.helper'],['public.general'])
n('h.general','H','calcularGananciasPatrimonialesPorTransmision','gananciaSujetaGeneral','Σ(sujeta si clasificación base-general, si no0)',['h.subject'],['h.classify'])
n('h.savings','H','calcularGananciasPatrimonialesPorTransmision','gananciaSujetaAhorro','Σ(sujeta si clasificación base-ahorro, si no0)',['h.subject'],['h.classify'])
n('g.O','L','otrasRentasNoExentas','return','i.N + h.general + h.savings algebraicamente; antes compensaciones, sin pérdidas eliminadas',['i.N','h.general','h.savings'])
for(const symbol of ['reduccionTrabajoHasta2014','reduccionTrabajo2015A2017','reduccionTrabajo2019A2022','reduccionTrabajo2023','reduccionTrabajoDesde2024'])n('r.'+symbol,'R',symbol,'return','Función por tramos exacta en source; compara P, resta origen y multiplica pendiente; cero/máximo según rama',['g.P','primitive.decimal'],['public.general'])
n('r.civil','R','fechaCivilIsoUtc','return','año/mes/día UTC con padStart, no hora local',['public.general'])
n('r.before','R','fallecidoAntesDeFechaCivil','return','ausente→false; fecha civil UTC < 2018-07-05',['r.civil'],['public.general'])
n('r.2018','R','reduccionTrabajo2018','return','antes corte→anterior; resto anterior+max(0,nueva−anterior)/2',['r.reduccionTrabajo2015A2017','r.reduccionTrabajo2019A2022'],['r.before'])
n('g.R','R','calcularReduccionTrabajoConOtrasRentas','return','O>6500→(año<=2014?2652:0); si no: <=2014,<=2017,2018,<=2022,2023,resto desde2024',['r.reduccionTrabajoHasta2014','r.reduccionTrabajo2015A2017','r.2018','r.reduccionTrabajo2019A2022','r.reduccionTrabajo2023','r.reduccionTrabajoDesde2024'],['g.O','public.general'])
n('w.I','C','calcularGastosTrabajo','integro','bruto=0; por rendimiento bruto+=r.integro; no limita500 ni resta gastos',['public.explicit'])
n('w.AE','C','calcularGastosTrabajo','gastosAE','ordinarios=SS+pasivos+huérfanos+sindicato satisfecho; colegio suma si satisfecho/obligatorio/fines esenciales; defensa si satisfecha/litigio; gastos=ordinarios+min(colegio,500)+min(defensa,300)',['public.explicit'],['public.explicit'])
n('w.P','C','calcularGastosTrabajo','netoPrevioArt20','bruto−gastosAE',['w.I','w.AE'])
n('w.F','C','calcularGastosTrabajo','generalesAplicados','min(ejercicio>=2015?2000:0,max(0,P))',['w.P'],['public.explicit'])
n('w.dis','C','calcularGastosTrabajo','discapacidadAplicada','ninguna→0; grado65-o-mas/ayuda→7750; resto3500; min(incremento,max(0,P−F)); conexión anual obliga ninguna',['w.P','w.F'],['public.explicit'])
n('w.N','C','calcularGastosTrabajo','netoArt19','P−F−discapacidad; puede ser negativo',['w.P','w.F','w.dis'])
n('w.adapter.N','T','adaptarTrabajoAnual','rendimientoAntesArt20','gastos.netoArt19; rechazo preservado',['w.N'])
n('w.adapter.P','T','adaptarTrabajoAnual','argumentoArt20','gastos.netoPrevioArt20; no es netoArt19',['w.P'])
n('x.R.function','R','reduccionTrabajoDesde2024','return','para llamada explícita2025: P<=14852→7302; <=17673.52→7302−1.75(P−14852); <19747.50→2364.34−1.14(P−17673.52); resto0',['w.adapter.P'])
n('x.R','X','reduccionArt20','return','min(max(netoArt19,0), reducción(P,anio2025,O0)); solo perfil trabajo',['w.adapter.N','x.R.function'],['public.explicit'])
n('a.income','A','ingresos','return','Σcaso.ingresos[*].base; no IVA ni retenciones',['public.activity'])
n('a.ordinary','A','ordinarios','return','Σcaso.gastos[*].base',['public.activity'])
n('a.reta','A','reta','return','Σcaso.reta[*].importe; cuotas reales; no estimación salarial',['public.activity'])
n('a.amort','A','amortizacion','return','acumulador0; por a: base=coste+puestaMarcha−residual; saldo=base−acumulada; cuota=min(saldo,base×coeficiente); amortizacion+=cuota. Activos rechazados en conexión anual',['public.activity'])
n('a.expenses','A','gastos','return','ordinarios+reta+amortizacion',['a.ordinary','a.reta','a.amort'])
n('a.P','A','P','return','ingresos−gastos',['a.income','a.expenses'])
n('a.subject','A','sujetos','return','Σingresos.filter(sujetoRetencion).base; es base sujeta, no importe retenido',['public.activity'])
n('a.unique','A','unico','return','Set(ingresos[*].clienteId).size===1',['public.activity'])
n('a.eligible','A','elegible','return','unico && ingresos>0 && gastos<=0.3×ingresos && sujetos>=0.7×ingresos && obligacionesFormales',['a.income','a.expenses','a.subject','a.unique'],['public.activity'])
n('a.G','A','G','return','opcion cliente-unico→0; otra→min(2000,max(P,0)×0.05)',['a.P'],['public.activity'])
n('a.RN','A','RN','return','P−G, con signo',['a.P','a.G'])
n('a.additional','A','adicional','return','RN<=14047.5→6498; resto max(0,6498−1.14×(RN−14047.5)); solo cliente-unico',['a.RN'],['public.activity'])
n('a.dis','A','incremento','return','ejercicioEfectivo && grado>=33 → (grado>=65 || ayuda ?7750:3500); otro0. Anual grado0→0',['public.activity'])
n('a.low','A','reduccionRentasBajas2025','return','min(max(RN,0),max(0,1620−max(0,RN−8000)×0.405))',['a.RN'])
n('a.reduction','A','reduccion','return','cliente-unico→min(max(RN,0),adicional+incremento+2000); otra opción solo si !elegible && aplicarRentasBajas→a.low; resto0',['a.RN','a.additional','a.dis','a.low'],['a.eligible','public.activity'])
n('a.previous','A','anteriores','return','historial.filter(netoAntesReducciones>0).ejercicio',['public.activity'])
n('a.first','A','primerPositivo','return','anteriores no vacío→Math.min(...años); otro RN>0?2025:null',['a.previous','a.RN'])
n('a.employer','A','excluidoEmpleador','return','some cliente empleador año anterior inicio && Σbases ingresos cliente > ingresos×0.5',['public.activity','a.income'])
n('a.startEligible','A','inicioElegible','return','Number(fechaInicio.slice(0,4))>=2013 && primerPositivo!=null && 2025<=primerPositivo+1 && !excluidoEmpleador',['public.activity','a.first','a.employer'])
n('a.start','A','reduccionInicio','return','aplicarInicio && inicioElegible ? min(100000,max(0,RN−reduccion))×0.2 :0',['a.RN','a.reduction'],['a.startEligible','public.activity'])
n('a.contribution','A','aporte','return','RN−reduccion−reduccionInicio; con signo',['a.RN','a.reduction','a.start'])
n('a.withholding','A','retenciones','return','Σcaso.retenciones[*].importe; separado de ingreso/rendimiento',['public.activity'])
n('a.payments','A','pagos','return','Σcaso.pagosFraccionados[*].importe; separado de gastos',['public.activity'])
n('a.adapter','B','adaptarActividadGeneral','aporte/etapas','calcularActividad2025(caso); rechazo intacto; aporte y etapas se devuelven sin convertir a céntimos',['a.contribution','a.withholding','a.payments'])
n('x.net','X','neto','return','trabajo: new D(adapter.rendimientoAntesArt20)−reduccionArt20; actividad: new D(adapter.aporte.importeEurosExactos)',['w.adapter.N','x.R','a.contribution'],['public.explicit'])
n('x.base','X','base','return','max(neto,0) solo para cuotas; BIG/BLG instrumentados conservan neto con signo',['x.net'])
for(const [id,file,symbol,property,args] of [
 ['scale.parameters','lib/dominio/irpf/comunidades/comunidad-autonoma.ts','obtenerParametrosComunidadAutonoma','return.escalaEstatalGeneral; return.escalaAutonomica.tramos; return.minimosAutonomicos.contribuyente.general',{anio:2025,comunidadAutonoma:'madrid',baseLiquidableGeneral:'x.base'}],
 ['scale.published','lib/dominio/irpf/cuotas/escalas-publicadas.ts','obtenerEscalaAutonomicaPublicada','return: escala publicada | undefined',{anio:2025,comunidadAutonoma:'madrid'}],
 ['minimum.state','lib/dominio/normativa/datos/minimos-autonomicos-2025.ts','MINIMOS_ESTATALES_2025','contribuyente.general',{}],
 ['scale.integrate','lib/dominio/irpf/cuotas/escalas-gravamen.ts','calcularCuotaPorEscala','return: Decimal EUR',{base:'x.base o min(x.base,mínimo correspondiente)',tramos:'estatal o autonómica seleccionada',escalasPublicadas:'solo autonómica: undefined o [publicada]'}]
]){nodes.push({id,kind:'boundary',symbol,property,arguments:args,source:declarationFrom(file,symbol),contract:'Propiedades exactas del lote escalas/mínimos; pendiente composición y revisión independiente. Nunca inferir hojas por compartir método.'})}
n('x.liquid','X','liquida','return','max(0,estatal(base)−estatal(min(base,minEstatal))) + max(0,autonómica(base)−autonómica(min(base,minAuto)))',['x.base','scale.parameters','scale.published','minimum.state','scale.integrate'])
n('x.grossService','X','brutoServicios','return','inicial0; solo empleo laboral/estatutario asigna trabajo.gastos.integro; pensión/actividad conserva0',['w.I'],['public.explicit'])
n('x.da','C','calcularDeduccionTrabajo','importeAplicable[regla=da61]','legal=(O>6500 || bruto=0)?0:max(0,340−max(0,bruto−16576)×0.2); límite=base0?0:cuotaIntegraGeneral×netoReducidoServicios/base; min(legal,límite,cuotaTrasArt80). Aquí O0, netoReducidoServicios=base, cuotas=liquida; conserva guarda base0',['x.grossService','x.base','x.liquid'],['public.explicit'])
n('x.deduction','X','deduccion','return','brutoServicios>0→resultado.importeAplicable, otro0; rama art80bis inalcanzable',['x.da'],['x.grossService'])
n('x.after','X','posterior','return','brutoServicios>0→resultado.cuotaPosterior=liquida−aplicable; otro liquida',['x.liquid','x.deduction'],['x.grossService'])
n('x.ret','X','retenciones','return','trabajo Σcaso.retenciones[*].importe, ID operación único; actividad new D(aporte.retencionesEuros)',['public.explicit','a.withholding'],['public.explicit'])
n('x.pay','X','pagos','return','trabajo inicial0 (no campo pagos en contrato); actividad new D(aporte.pagosFraccionadosEuros)',['a.payments'],['public.explicit'])
n('x.diff','X','diferencial','return','posterior−retenciones−pagos; sin suelo0 ni redondeo en línea; presentación final half-up2 separada',['x.after','x.ret','x.pay'])
// Validaciones de dominio son aristas distintas del tránsito numérico.
for(const [id,file,symbol,targets] of [
 ['validation.explicit','lib/dominio/irpf/trabajo-anual/conexion-contrato.ts','CasoFiscalAnualExplicito',['x.net','x.ret','x.pay','x.diff']],
 ['validation.work','lib/dominio/irpf/trabajo-anual/calcular.ts','calcularGastosTrabajo',['w.I','w.AE','w.P','w.F','w.N']],
 ['validation.activity','lib/dominio/irpf/actividades-economicas/calcular.ts','calcularActividad2025',['a.income','a.ordinary','a.reta','a.amort','a.contribution','a.withholding','a.payments']],
 ['validation.activity.schema','lib/dominio/irpf/actividades-economicas/contrato.ts','CasoActividad2025',['a.income','a.ordinary','a.reta','a.amort','a.contribution','a.withholding','a.payments']]
]){nodes.push({id,kind:'validation',symbol,property:'admisión/rechazo; no importe',source:declarationFrom(file,symbol)});for(const to of targets)edges.push({from:id,to,kind:'domain-validation',propertyPath:'admisión del resultado',condition:defaultScope,reason:'schema y predicados del productor; un rechazo no se convierte en cero',evidence:declarationFrom(file,symbol)})}
const roots={'anual.trabajo.integro':'g.I','anual.trabajo.cotizacion':'g.C','anual.trabajo.previo-neto':'g.P','anual.trabajo.gastos':'g.F','anual.trabajo.neto':'g.N','anual.trabajo.reduccion':'g.R','anual.explicito.trabajo.integro':'w.I','anual.explicito.trabajo.gastos-a-e':'w.AE','anual.explicito.trabajo.gasto-f':'w.F','anual.explicito.trabajo.art19':'w.adapter.N','anual.explicito.trabajo.art20':'x.R','anual.explicito.da61':'x.deduction','anual.explicito.retenciones':'x.ret','anual.explicito.pagos':'x.pay','anual.explicito.diferencial':'x.diff','anual.inmobiliario.integro':'i.I','anual.inmobiliario.neto':'i.N','anual.ganancias.total':'h.total','anual.ganancias.exenta':'h.exempt','anual.explicito.actividad.etapa':'a.adapter'}
const r21=JSON.parse(fs.readFileSync(old+'flujo.json','utf8'))
const sites=r21.sites.filter(s=>roots[s.siteId]).map(s=>({siteId:s.siteId,subject:s.subject,snapshot:s.snapshot,source:s.source,root:roots[s.siteId],status:'candidato dentro de fronteras expresas; composición y revisión pendientes',legalAcceptance:false}))
assert.equal(sites.length,20)
const inst=JSON.parse(fs.readFileSync(old+'instancias-actividad.json','utf8'))
const dynamicRoots=['a.amort','a.amort','public.activity','public.activity','public.activity','a.income','a.ordinary','a.reta','a.amort','a.P','a.G','a.RN','a.additional','a.dis','a.reduction','a.start','a.contribution','a.withholding','a.payments']
const sf=ts.createSourceFile(files.A,fs.readFileSync(files.A,'utf8'),ts.ScriptTarget.Latest,true)
const calls=[];function visit(n){if(ts.isCallExpression(n)&&n.expression.getText(sf)==='etapa')calls.push(n);ts.forEachChild(n,visit)}visit(sf)
assert.equal(calls.length,19)
const instances=inst.map((r,i)=>({...r,root:dynamicRoots[i],argument4:source(files.A,calls[i].arguments[3].getText(sf)),argument4Property:i===0?'min(base−acumulada,base×coeficiente)':i===1?'base−acumulada−cuota':i===2?'caso.ingresos[*].base':i===3?'caso.gastos[*].base':i===4?'caso.reta[*].importe':nodes.find(n=>n.id===dynamicRoots[i])?.formula,control:i<2?'for(caso.activos): submotor aislado, rechazado en conexión anual':i<5?'por asiento admitido':i===12||i===13?'opcion===cliente-unico':'tras admisión; ver selectores del nodo',adapterChain:['etapa: valor → etapas.push({importe:valor.toFixed()}); return valor','calcularActividad2025: return etapas/aporte','adaptarActividadGeneral: resultado.etapas y resultado.aporte sin cambiar','liquidarIrpfAnualExplicito: actividad.etapas.map(e) → new D(e.importe) → crearLineaCalculo.importe'],metadataNotValue:'reglaId/id/formula/documentos/fuentes identifican; no se suman al importe',review:'pendiente'}))
// Dos instancias comparten algoritmo, pero tienen resultados distintos; el saldo nunca entra en amortización.
instances[1].root='a.saldo'
n('a.saldo','A','calcularActividad2025','etapa[`${a.id}:saldo`].importe','base−acumulada−min(base−acumulada,base×coeficiente); solo metadato de saldo; no se suma en gastos',['public.activity'])
const graph={version:1,base:'07c07e6376a72f229be735a904ecf36517a1b571',inventory:r21.inventory,scope:defaultScope,edgeDirection:'dependency → output; value transit, selection chooses value, domain-validation rejects, cohabitation never implies edge',sites,nodes,edges,instances,review:'pendiente; no wiring ni aceptación'}
for(const e of edges){assert(nodes.some(n=>n.id===e.from),JSON.stringify(e.from));assert(nodes.some(n=>n.id===e.to),JSON.stringify(e.to))}
fs.writeFileSync(out+'grafo.json',JSON.stringify(graph))
fs.writeFileSync(out+'instancias.json',JSON.stringify(instances,null,2))
fs.writeFileSync(out+'conceptos.json',JSON.stringify(JSON.parse(fs.readFileSync(old+'conceptos.json','utf8')).map(c=>({id:c.id,subject:c.subject,snapshot:c.snapshot,partition:'rentas/actividad: exención y signo; cuotas/compensación fuera',newRoots:c.id.endsWith('perdidas')?['h.subject','h.general','h.savings']:c.id.endsWith('exencion-inmuebles')?['h.old']:['h.life'],authorityReference:old+'conceptos.json#'+c.id,review:'pendiente, autoridad histórica no duplicada'}))))
console.log(JSON.stringify({sites:sites.length,nodes:nodes.length,edges:edges.length,instances:instances.length}))
