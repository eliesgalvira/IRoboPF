import fs from 'node:fs';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import {createRequire} from 'node:module';
const require=createRequire('/home/elies/Repos/IRoboPF/package.json');
const ts=require('typescript');
const out='docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/';
const r='lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts',s='lib/dominio/laboral/cotizaciones-sociales.ts',u='lib/dominio/laboral/cotizaciones-perfil-uniforme.ts',t='lib/dominio/normativa/datos/irpf-retenciones-trabajo-2012-2026.ts',v='lib/dominio/irpf/retenciones/versiones/catalogo.ts',a='lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts',m='lib/dominio/dinero/importe-monetario.ts',b='lib/dominio/normativa/datos/seguridad-social-2012-2026.ts';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const trees=new Map(),facts=[];
for(const file of [r,s,u,t,v,a,m,b,'lib/dominio/dinero/redondeo.ts']){
 const text=fs.readFileSync(file,'utf8'),tree=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);trees.set(file,tree);
 const loc=n=>({file,sha256:hash(text),start:n.getStart(tree),end:n.end,offsetEncoding:'utf16',text:n.getText(tree)});
 function visit(n){if(ts.isVariableDeclaration(n)||ts.isFunctionDeclaration(n)||ts.isReturnStatement(n)||ts.isCallExpression(n))facts.push({kind:ts.SyntaxKind[n.kind],symbol:(ts.isVariableDeclaration(n)||ts.isFunctionDeclaration(n))?n.name?.getText(tree)??'':'',source:loc(n)});ts.forEachChild(n,visit);} visit(tree);
}
function source(file,symbol){const f=facts.find(x=>x.source.file===file&&x.symbol===symbol);if(!f)throw Error(file+':'+symbol);return f.source;}
const nodes=[];
function node(id,file,symbol,formula,inputs='',conditions='Inicial parcial; sin aceptación fiscal',output='return'){
 nodes.push({id,file,symbol,output,formula,inputs:inputs.split('|').filter(Boolean),conditions,source:source(file,symbol)});
}
node('A.soportadas',a,'cuotaDiferencialCentimos','caso.retencionesSoportadasCentimos / 100; entrada declarada, independiente de estimación','entrada:caso.retencionesSoportadasCentimos');
node('A.cuenta',a,'pagosACuentaAplicadosCentimos','caso.pagosACuentaCentimos + (retencionTrabajoAeat?.importeRetencionAnualCentimos ?? 0)','entrada:caso.pagosACuentaCentimos|R.importe','Solo se llama al estimador si caso.retencionTrabajoAeat !== undefined; igualdad de anio validada, no de bruto/cotizaciones/familia.');
node('A.bruto',a,'rendimientoIntegroTrabajo','sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)','frontera:sumarRendimientosTrabajo.return');
node('A.modo',a,'cotizacionesSociales','canonico ? perfilUniforme({anio:caso.anio,salarioBrutoAnual:rendimientoIntegroTrabajo}) : legacy(mismos argumentos)','A.bruto|entrada:caso.anio|entrada:contexto.modo');
node('A.coste',a,'resultado','costeLaboralCentimos de calcularImportesLiquidacion; bruto + cotizacionEmpresarial, liquidado a céntimos','A.bruto|S.empresa|frontera:calcularImportesLiquidacion.costeLaboralCentimos');
node('R.dominio',r,'esCasoCalculable','Enteros seguros no negativos; edad opcional; cotizaciones obligatorias; importes opcionales; arrays familiares; convivencia > 0; situación1 requiere hijos','entrada:caso','Validación de dominio; no afirma requisitos jurídicos familiares.');
node('R.version',v,'seleccionarVersionRetencion','Filtra VERSIONES_RETENCION por anio; fecha civil válida y única modalidad; intervalo inclusivo. cierre exige hasta=31/12. Sin fecha exige una única versión anual completa.','entrada:caso.anio|entrada:caso.fechaPago|entrada:caso.perfilTemporal|R.catalogo|R.calendario');
node('R.catalogo',v,'VERSIONES_RETENCION','Filas fechadas con id/anio/desde/hasta/reduccion/hash/referencia; tabla declarada, no prueba de vigencia','literal:VERSIONES_RETENCION');
node('R.calendario',t,'esFechaCivilDelAnio','YYYY-MM-DD, coincide ejercicio, mes 1..12, día 1..dias[mes-1], febrero gregoriano 4/100/400','entrada:fecha|entrada:anio|literal:calendario');
node('R.guardas',r,'calcularRetencionTrabajoAeatImpl','Dominio → rechaza regularizacion → legacy sin fecha/perfil → canónico selecciona versión, irregular1<=9000000 cent y <=30%, rechaza manuales, filtra edad<25 o discapacidad, revalida situación1','R.dominio|R.version|entrada:contexto.modo|entrada:caso','Guardas de acceso; 2012–2016 no tienen versión canónica. Legacy admite esos años solo como reproducción sin vigencia.');
node('R.R',r,'retribucion','centimosAEuros(caso.retribucionAnualCentimos)','entrada:caso.retencionTrabajoAeat.retribucionAnualCentimos|M.conversion');
node('R.C',r,'cotizaciones','centimosAEuros(caso.cotizacionesCentimos)','entrada:caso.retencionTrabajoAeat.cotizacionesCentimos|M.conversion');
node('R.opcional',r,'importeOpcional','centimosAEuros(centimos ?? 0)','entrada:irregular1Centimos,irregular2Centimos,pensionCompensatoriaConyugeCentimos,anualidadesAlimentosHijosCentimos|M.conversion');
node('R.rnt',r,'rendimientoNetoTrabajo','max(0,R-irregular1-irregular2-C)','R.R|R.C|R.opcional');
node('R.movilidad',r,'incrementoMovilidadGeografica','movilidadGeografica true ? 2000 : 0','entrada:caso.movilidadGeografica|literal:2000');
node('R.discGasto',r,'incrementoGastosDiscapacidadTrabajador','activo y desde65 → 7750; activo/de33a65/movilidadReducida →7750; activo/de33a65 →3500; resto0','entrada:caso.situacionLaboral,discapacidad,movilidadReducidaPerceptor|literal:7750,3500');
node('R.gastos',r,'calcularOtrosGastos','R-C<0 ? 0 : min(2000+movilidad+discapacidad,R-C); no usa irregular1/2 para el techo','R.R|R.C|R.movilidad|R.discGasto|literal:2000');
node('R.lineal',r,'reduccionLineal','max(0,maximo-max(0,rnt-inicio)*pendiente)','R.rnt|entrada:maximo,inicio,pendiente');
node('R.actual',r,'calcularReduccionActual','rnt<=14852:7302; <=17673.52:7302-(rnt-14852)*1.75; <19747.5:2364.34-(rnt-17673.52)*1.14; resto0; cada rama redondeada','R.rnt|literal:tramos-reduccion|M.redondeo');
node('R.reduccion',r,'calcularReduccionTrabajo','antigua lineal(3700,11250,1.15625); media2018 media de antigua y lineal(5565,13115,1.5); 2019 nueva; 2023 lineal(6498,14047.5,1.14); default actual','R.lineal|R.actual|R.version|M.redondeo','Legacy version undefined usa actual, aunque calcula antigua/nueva sin consumirlas; canónico según version.reduccion.');
node('R.rnr',r,'rendimientoNetoReducido','max(0,rnt-otrosGastos-reduccion)','R.rnt|R.gastos|R.reduccion');
node('R.laboral',r,'reduccionPorSituacionLaboral','{pensionista:600 si pensionista; desempleado:1200 si desempleado; hijos:600 si length>2, resto0}','entrada:caso.situacionLaboral|entrada:descendientes.length|literal:600,1200,2');
node('R.base',r,'baseRetencion','max(0,rnr-pensionista-hijos-desempleado-pensionCompensatoria)','R.rnr|R.laboral|R.opcional');
node('R.multiplicador',r,'multiplicadorDescendiente','computoPorEntero true ? 1 : 0.5','entrada:descendiente.computoPorEntero|literal:1,0.5');
node('R.ordenHijos',r,'cuantiaMinimoDescendiente','índice0:2400;1:2700;2:4000;resto4500','entrada:indice|literal:2400,2700,4000,4500');
node('R.menor3',r,'esDescendienteMenorTres','edad<3 || adopcionOAcogimientoMenosTresAnios','entrada:descendiente.edad,adopcionOAcogimientoMenosTresAnios|literal:3');
node('R.minHijos',r,'calcularMinimoDescendientes','ordena por edad descendente; suma cuantia(indice)*multiplicador; suma 2800*multiplicador si menor3; redondea separadamente ambas sumas y las suma','R.ordenHijos|R.multiplicador|R.menor3|entrada:descendientes|M.redondeo|literal:2800');
node('R.minAsc',r,'calcularMinimoAscendientes','suma1150/convivencia si edad>=65 o discapacidad; suma1400/convivencia si edad>=75; redondeo separado de ambos grupos','entrada:ascendientes.edad,discapacidad,convivencia|literal:1150,1400,65,75|M.redondeo');
node('R.discapacidad',r,'minimoDiscapacidad','desde65→9000;de33a65→3000;resto0','entrada:discapacidad|literal:9000,3000');
node('R.asistencia',r,'minimoAsistencia','desde65 o de33a65 con movilidadReducida→3000;resto0','entrada:discapacidad,movilidadReducida|literal:3000');
node('R.minDisc',r,'calcularMinimoDiscapacidad','perceptor D+A; hijos suma D*m y A*m redondeadas separadas; ascendientes suma D/convivencia y A/convivencia redondeadas separadas','R.discapacidad|R.asistencia|R.multiplicador|entrada:caso.discapacidad,movilidadReducidaPerceptor|entrada:descendientes|entrada:ascendientes|M.redondeo');
node('R.minimo',r,'calcularMinimoPersonalFamiliar','edad=caso.edad??40;5550+(edad>=75?2550:edad>=65?1150:0)+minHijos+minAsc+minDisc','entrada:caso.edad|R.minHijos|R.minAsc|R.minDisc|literal:5550,2550,1150,40','No recibe comunidadAutonoma, derechosMinimos ni mínimos de liquidación. Familia comunicada, no validación jurídica de elegibilidad.');
node('R.escala',r,'calcularCuotaEscala','version.anio<=2020 y base>=60000 →17901.5+(base-60000)*.45; resto elige último desde<=base y devuelve cuota+(base-desde)*tipo','entrada:base|R.version|literal:tramos','Tabla: [0,0,.19],[12450,2365.5,.24],[20200,4225.5,.30],[35200,8725.5,.37],[60000,17901.5,.45],[300000,125901.5,.47]. resto no se consume; Infinity cohabita, no afecta elección.');
node('R.cuotaEscala',r,'calcularCuotaRetencion','si anualidades>0 y base-anualidades>0: max(0,E(base-anualidades)+E(anualidades)-E(minimo+1980)); resto max(0,E(base)-E(minimo))','R.base|R.opcional|R.minimo|R.escala|literal:1980');
node('R.tablaCierre',t,'tablaVigenteAlCierreDelAnio','UMBRALES_RETENCION_NOMINA_POR_ANIO[anio].at(-1).tabla; implementación usa índice length-1','entrada:anio|R.tablas');
node('R.tablas',t,'UMBRALES_RETENCION_NOMINA_POR_ANIO','2012–14:2012_2014;2015–17:2015_2017;2018 cambia05jul;2019–22:2019_2022;2023 cambia01feb;2024 cambia08feb;2025–26:2024_2026','literal:tablas-umbrales');
node('R.tabla',t,'tablaUmbralesRetencionTrabajo','fecha undefined→cierre; fecha inválida throw;2018 desde05jul pensionista/desempleado tabla PENSIONES; resto find desde<=fecha<=hasta','R.tablaCierre|R.tablas|R.calendario|entrada:anio,fecha,situacionLaboral','En canónico fecha=version.desde, no fechaFallecimiento; legacy fecha undefined ignora situación laboral para tabla especial2018.');
node('R.columna',t,'umbralPorDescendientes','numero<=0→sinDescendientes;===1→unDescendiente;resto dosOMas','entrada:numeroDescendientes|entrada:umbrales');
node('R.umbral',t,'umbralRetencionTrabajoRequeridoEuros','tabla[situacionFamiliar] → columna(length hijos filtrados) → null throw','R.tabla|R.columna|entrada:situacionFamiliar,numeroDescendientes');
node('R.umbralMax',t,'maximoUmbralRetencionTrabajoEuros','Math.max de las nueve celdas de tabla quitando null','R.tabla|primitiva:Math.max','No depende de columna familiar elegida; puede depender de celdas de otras situaciones por ser máximo.');
node('R.exento',r,'exento','R<=umbralMax+pensionista+desempleado && R<=umbral+pensionista+desempleado','R.R|R.umbral|R.umbralMax|R.laboral','hijos600 no se suma a umbral; número de hijos sí selecciona columna.');
node('R.inicial',r,'cuotaRetencionInicial','exento ? 0 : calcularCuotaRetencion(...)','R.exento|R.cuotaEscala');
node('R.limite',r,'calcularLimite43','exento o R>techo→cuotaInicial; resto max(0,(R-umbralConReducciones)*.43); techo22000 si version y (anio<2023 o reduccion2019), resto35200','R.inicial|R.exento|R.R|R.umbral|R.laboral|R.version|literal:.43,22000,35200');
node('R.cuota',r,'cuotaRetencion','min(cuotaInicial,limite43)','R.inicial|R.limite');
node('R.ceuta',r,'ceutaMelilla','residenciaCeutaMelilla===true && rendimientosCeutaMelilla===true','entrada:caso.residenciaCeutaMelilla,rendimientosCeutaMelilla','Control territorial propio de retención, sin mínimos autonómicos.');
node('R.vivienda',r,'calcularMinoracionVivienda','pagosViviendaHabitual && R<33007.2 ? trunc(R*.02,2) : 0','R.R|entrada:caso.pagosViviendaHabitual|literal:33007.2,.02|M.truncar');
node('R.diferencia',r,'calcularDiferenciaPositiva','max(0,cuota*(ceuta?(version2017 o id2018enero?.5:.4):1)-vivienda)','R.cuota|R.ceuta|R.version|R.vivienda');
node('R.tipoCalc',r,'calcularTipoInicial','R<=0?0:trunc(diferencia/R*100,2)','R.diferencia|R.R|M.truncar|literal:100');
node('R.tipo',r,'aplicarMinimoContrato','Ceuta especial mínimo8 antes2019/6 resto; Ceuta inferior-anio mínimo1/.8; noCeuta especial15/inferior2; general/manuales preservan calculado','R.tipoCalc|R.ceuta|R.version|entrada:caso.contrato|literal:8,6,1,.8,15,2','manuales solo alcanzable legacy; canónico rechaza antes. No implica derecho al mínimo ni procedimiento completo aceptado.');
node('R.importe',r,'importeRetencion','redondear1(R*tipo/100) → aCentimos; rastro anual convierte esos céntimos a euros','R.R|R.tipo|M.redondeo|M.conversion');
node('M.conversion',m,'centimosAEuros','new Decimal(centimos)/100; eurosACentimos redondea2, multiplica100,toNumber','entrada:importe|literal:100|primitiva:Decimal');
node('M.redondeo','lib/dominio/dinero/redondeo.ts','redondearHalfUp','valor.toDecimalPlaces(decimales,Decimal.ROUND_HALF_UP); llamadas monetarias decimales=2','primitiva:Decimal.ROUND_HALF_UP|literal:2');
node('M.truncar','lib/dominio/dinero/redondeo.ts','truncarDecimal','valor.toDecimalPlaces(decimales,Decimal.ROUND_DOWN); tipo y vivienda decimales=2','primitiva:Decimal.ROUND_DOWN|literal:2');
node('S.max',b,'BASE_MAXIMA_COTIZACION_LEGACY','tabla[anio], máximo anual heredado, selector efectivo por año','entrada:caso.anio|literal:BASE_MAXIMA_COTIZACION_LEGACY');
node('S.tipos',s,'TIPOS_SEGURIDAD_SOCIAL_LEGACY','comunes .236/.047;desempleo .055/.0155;fogasa .002/0;fp .006/.001;atep .015/0; suma por lado','literal:TIPOS_SEGURIDAD_SOCIAL_LEGACY');
node('S.meiTipos',s,'obtenerTiposMei','2023 .005/.001;2024 .0058/.0012;2025 .0067/.0013;>=2026 .0075/.0015;resto0/0','entrada:caso.anio|literal:MEI');
node('S.politica',s,'obtenerPoliticaSolidaridad','2025 .0092/.0100/.0117;>=2026 .0115/.0125/.0146;resto SinSolidaridad','entrada:caso.anio|literal:solidaridad-legacy');
node('S.LB',s,'baseCotizacionPara','baseOrdinaria=min(S,max);excesoBase=max(0,S-max)','A.bruto|S.max','legacy; no se eleva salario al mínimo', 'baseOrdinaria,excesoBase');
node('S.Ltramos',s,'calcularTotalSolidaridad','SinSolidaridad o exceso<=0→0; resto min(X,.10M)*t1 + min(max(0,X-.10M),.40M)*t2 + max(0,X-.50M)*t3','S.LB|S.max|S.politica','legacy; M=parametros.baseMaxima');
node('S.LrepartoE',s,'repartirCotizacionSolidaridad','totalSolidaridad*5/6','S.Ltramos|literal:5,6','solo legacy','cotizacionEmpresarial');
node('S.LrepartoT',s,'repartirCotizacionSolidaridad','totalSolidaridad/6','S.Ltramos|literal:6','solo legacy','cotizacionTrabajador');
node('S.B',u,'baseOrdinaria','canónico2018: (min(S,3751.20*12)*7+min(S,3803.70*12)*5)/12; resto legacy.baseOrdinaria','A.bruto|S.max|S.LB|entrada:caso.anio|literal:3751.20,3803.70,12,7,5','A.modo selecciona; legacy siempre min(S,M); no confundir ejecución legacy previa en uniforme con consumo de sus totales.');
node('S.X',u,'excesoBase','canónico max(0,S-B); legacy max(0,S-M)','A.bruto|S.B|S.LB');
node('S.tiposSolid',u,'tiposSolidaridad','2025 empresa .0077/.0083/.0098 trabajador .0015/.0017/.0019;2026 empresa .0096/.0104/.0122 trabajador .0019/.0021/.0024;otros ceros','entrada:caso.anio|literal:tiposSolidaridad');
node('S.tramos',u,'cuotaSolidaridad','min(X,.1M)*tipos[0] + min(max(0,X-.1M),.4M)*tipos[1] + max(0,X-.5M)*tipos[2]','S.X|S.max|S.tiposSolid','canónico: llamada por lado con solidaridad.empresa o trabajador. M sigue heredado, B2018 no lo sustituye.');
for(const [suffix,side,legacy] of [['E','empresarial','S.LrepartoE'],['T','trabajador','S.LrepartoT']]){
 node('S.ordinaria'+suffix,u,'cotizacion'+(suffix==='E'?'Empresarial':'Trabajador')+'Ordinaria','B * suma tipos.'+side,'S.B|S.tipos','Ambos modos; sumarTipoCotizacionLegacy reduce Object.values desde IMPORTE_CERO, tipoCotizacionPorLado selecciona '+side);
 node('S.mei'+suffix,u,'mei'+(suffix==='E'?'Empresarial':'Trabajador'),'B * mei.'+side,'S.B|S.meiTipos','Ambos modos; solo componente del lado');
 node('S.sol'+suffix,u,'solidaridad'+(suffix==='E'?'Empresarial':'Trabajador'),'canónico cuotaSolidaridad(X,M,tipos lado); legacy reparto de total','S.tramos|'+legacy,'A.modo decide; no mezclar 5/6 con tipos publicados');
 node(suffix==='E'?'S.empresa':'S.trabajador',u,'calcularDesgloseCotizacionesPerfilUniforme','ordinaria+mei+solidaridad del mismo lado','S.ordinaria'+suffix+'|S.mei'+suffix+'|S.sol'+suffix,'Ambos modos; legacy usa sumarCotizacionesSociales dos veces sin mezclar propiedades', 'cotizacion'+(suffix==='E'?'Empresarial':'Trabajador'));
}
const r21=JSON.parse(fs.readFileSync('docs/procedencia/editorial/flujo-rentas-r21-sol/flujo.json','utf8'));
const roots=['A.soportadas','A.cuenta','R.base','R.cuota','R.tipo','R.importe','S.B','S.X','S.ordinariaE','S.ordinariaT','S.meiE','S.meiT','S.solE','S.solT','S.empresa','S.trabajador','A.coste'];
const selected=r21.sites.filter(x=>/^anual\.(ss|retencion|pagos)/.test(x.siteId));
const sites=selected.map((x,i)=>({siteId:x.siteId,subject:x.subject,historicalSnapshot:x.snapshot,currentSource:x.source,root:roots[i],validation: x.siteId.includes('retencion')||x.siteId==='anual.pagos.cuenta'?'R.guardas':'entrada:contrato-anual',review:'pendiente',composition:'pendiente',legalAcceptance:false}));
const edges=nodes.flatMap(n=>n.inputs.map(from=>({from,to:n.id,property:n.output,relation:from.startsWith('entrada:contexto')||from==='R.version'||from==='R.ceuta'||from==='R.guardas'?'control-seleccion':'valor',reason:n.formula,conditions:n.conditions,source:n.source})));
fs.writeFileSync(out+'grafo.json',JSON.stringify({version:1,head:'07c07e6376a72f229be735a904ecf36517a1b571',inventory:'30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7',artifact:'59bae155b45e791b1e1ec4f0003c4a3fa443c3d29bf91bb02ad931bfd797a2f7',sites,nodes,edges},null,2));
fs.writeFileSync(out+'asignaciones-argumentos-retornos.json.gz',zlib.gzipSync(JSON.stringify(facts)));
console.log({nodes:nodes.length,edges:edges.length,sites:sites.length,facts:facts.length});
// Ampliación por llamadas y propiedades; la localización AST no crea causalidad.
const calls=[];
for(const file of [r,s,u,t,v]){
 const tree=trees.get(file);
 function visit(n){if(ts.isCallExpression(n)){
 const target=n.expression.getText(tree);
 const local=facts.find(f=>f.source.file===file&&f.symbol===target);
 const alternatives=facts.filter(f=>f.symbol===target);
 const decl=local??(alternatives.length===1?alternatives[0]:undefined);
 if(decl){const func=decl.source;calls.push({file,callee:target,calleeSource:func,call:{file,sha256:hash(tree.text),start:n.getStart(tree),end:n.end,offsetEncoding:'utf16',text:n.getText(tree)},actualArguments:n.arguments.map(q=>q.getText(tree)),qualification:'Contrato sintáctico de argumentos; propiedades consumidas y condiciones en grafo, no arista por contención.'});}
 }ts.forEachChild(n,visit);}visit(tree);
}
fs.writeFileSync(out+'llamadas.json',JSON.stringify(calls,null,2));
const old=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'));
const cost=old.nodes.find(n=>n.id==='A.coste');cost.symbol='importesLiquidacion';cost.source=source(a,'importesLiquidacion');cost.inputs=['A.bruto','S.empresa','M.redondeo','M.conversion'];cost.formula='eurosACentimos(rendimientoIntegroTrabajo.plus(cotizacionesSociales.cotizacionEmpresarial)); rastro vuelve a euros';
const tables=facts.filter(f=>f.source.file===t&&f.symbol.startsWith('UMBRALES_RETENCION_')&&f.symbol!=='UMBRALES_RETENCION_NOMINA_POR_ANIO');
for(const f of tables)old.nodes.push({id:'tabla:'+f.symbol,file:t,symbol:f.symbol,output:'[situacionFamiliar][columna]',formula:'Valores literales de tabla; columna se resuelve en R.columna. Cada token mantiene ubicación individual en literales.json.',inputs:['literal:'+f.symbol],conditions:'R.tabla y R.tablas seleccionan ejercicio/período/situación laboral; 2012–2016 inaccesibles canónico, disponibles en legacy.',source:f.source});
old.nodes.find(n=>n.id==='R.tablas').inputs=tables.map(f=>'tabla:'+f.symbol);
old.edges=old.nodes.flatMap(n=>n.inputs.map(from=>({from,to:n.id,property:n.output,relation:from==='R.version'||from==='R.ceuta'?'control-seleccion':'valor',reason:n.formula,conditions:n.conditions,source:n.source})));
old.externalContracts=[{file:'lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts',symbol:'sumarRendimientosTrabajo',arguments:['caso.rendimientos.trabajo','centimosAEuros'],output:'return Decimal EUR → rendimientoIntegroTrabajo → salarioBrutoAnual',owner:'lote rentas',status:'pendiente de composición'}];
fs.writeFileSync(out+'grafo.json',JSON.stringify(old,null,2));
const literals=[];
for(const file of [r,t,v,s,u,b,m,'lib/dominio/dinero/redondeo.ts']){
 const tree=trees.get(file);
 function visit(n){if(ts.isNumericLiteral(n)||ts.isStringLiteral(n)||n.kind===ts.SyntaxKind.NullKeyword||(ts.isIdentifier(n)&&n.text==='Infinity')){let p=n.parent;const properties=[];let cursor=n.parent,typeOnly=false;while(cursor){if(ts.isTypeNode(cursor))typeOnly=true;cursor=cursor.parent;}while(p&&!ts.isVariableDeclaration(p)&&!ts.isFunctionDeclaration(p)){if(ts.isPropertyAssignment(p))properties.unshift(p.name.getText(tree));p=p.parent;} literals.push({file,sha256:hash(tree.text),start:n.getStart(tree),end:n.end,offsetEncoding:'utf16',text:n.getText(tree),owner:p?.name?.getText(tree)??'module',propertyPath:properties,typeOnly,qualification:'Token literal; efectos solo por fórmulas/llamadas declaradas. No genera arista automáticamente.'});}ts.forEachChild(n,visit);}visit(tree);
}
fs.writeFileSync(out+'literales.json',JSON.stringify(literals,null,2));
const originals=JSON.parse(fs.readFileSync('docs/procedencia/editorial/flujo-rentas-r21-sol/ocurrencias-325.json','utf8'));
const sym=new Map([['baseOrdinaria','S.B'],['excesoBase','S.X'],['primerExceso','S.tramos'],['segundoExceso','S.tramos'],['excesoRestante','S.tramos'],['tiposSolidaridad','S.tiposSolid'],['solidaridad','S.tiposSolid'],['cuotaSolidaridad','S.tramos'],['BASE_MAXIMA_COTIZACION_LEGACY','S.max'],['obtenerTiposMei','S.meiTipos'],['obtenerPoliticaSolidaridad','S.politica'],['TIPOS_SEGURIDAD_SOCIAL_LEGACY','S.tipos'],['repartirCotizacionSolidaridad','S.LrepartoE'],['limitePrimerTramo','S.Ltramos'],['limiteSegundoTramo','S.Ltramos'],['calcularTotalSolidaridad','S.Ltramos']]);
const classified=originals.map(x=>{
 const own=[s,u,b].includes(x.source.file);let target=own?sym.get(x.symbol):null;if(own&&!target)throw Error(x.symbol);
 if(x.symbol==='repartirCotizacionSolidaridad'&&x.selector.includes('valor:cotizacionTrabajador'))target='S.LrepartoT';
 let relation= x.role==='indice-de-acceso'?'control-seleccion':x.expression.text.includes('Match.when(')&&['2023','2024','2025','2026'].includes(x.value)?'control-seleccion':'valor';
 if(x.symbol==='baseOrdinaria'&&x.value==='2018')relation='control-seleccion';
 return {occurrenceId:x.occurrenceId,layer:x.layer,selector:x.selector,source:x.source,symbol:x.symbol,value:x.value,status:own?'resuelta-candidata':'otro-lote',target,relation:own?relation:'cohabitacion-excluida',conditions:own?old.nodes.find(n=>n.id===target).conditions:'No hay camino desde esta ocurrencia a las17 propiedades del lote; rendimientoIntegroTrabajo es frontera externa por propiedad, no consume neto/reducciones/EDS/ganancias.',reason:own?`${x.occurrenceId}: ${x.expression.text}; consumidor ${target}; selector ${x.selector}; ${old.nodes.find(n=>n.id===target).formula}`:'Asignación explícita al lote rentas; no copiar dependencia por módulo, igualdad numérica o por base de liquidación.',review:'pendiente',legalAcceptance:false};
});
fs.writeFileSync(out+'ocurrencias-r21.json',JSON.stringify(classified,null,2));
const boundaries=JSON.parse(fs.readFileSync(out+'contratos.json','utf8')).boundaries.map(x=>({...x,sourceSha256:hash(fs.readFileSync(x.file))}));
fs.writeFileSync(out+'fronteras.json',JSON.stringify(boundaries,null,2));
// Rutas de consumo específicas: no se atribuye todo un objeto a ambos lados.
const ssProperties=[['baseOrdinaria','min(S,M)','2018? (7min(S,3751.20*12)+5min(S,3803.70*12))/12 : min(S,M)'],['excesoBase','max(0,S-M)','max(0,S-B)'],['cotizacionEmpresarialOrdinaria','B*sum(tipos.empresarial)','B*sum(tipos.empresarial)'],['cotizacionTrabajadorOrdinaria','B*sum(tipos.trabajador)','B*sum(tipos.trabajador)'],['meiEmpresarial','B*mei.empresarial','B*mei.empresarial'],['meiTrabajador','B*mei.trabajador','B*mei.trabajador'],['solidaridadEmpresarial','totalSolidaridad*5/6','bandas(X,M) dot tiposSolidaridad[anio].empresa'],['solidaridadTrabajador','totalSolidaridad/6','bandas(X,M) dot tiposSolidaridad[anio].trabajador'],['cotizacionEmpresarial','ordinariaEmpresarial+meiEmpresarial+solidaridadEmpresarial','misma suma, componentes canónicos'],['cotizacionTrabajador','ordinariaTrabajador+meiTrabajador+solidaridadTrabajador','misma suma, componentes canónicos']];
fs.writeFileSync(out+'rutas-ss.json',JSON.stringify({definitions:{S:'rendimientoIntegroTrabajo del llamador',M:'BASE_MAXIMA_COTIZACION_LEGACY[caso.anio]',B:'baseOrdinaria del modo',X:'excesoBase del modo',bandas:'min(X,.1M),min(max(0,X-.1M),.4M),max(0,X-.5M)'},properties:ssProperties.map(([property,legacy,canonico])=>({property,legacy,canonico,conditions:'Tipos MEI año/lado; solidaridad legacy SinSolidaridad antes2025; canónico tipos nulos excepto2025/2026; rama2018 solo base canónica. No usar fechaPago o fallecimiento para SS.',sourceLegacy:source(s,'calcularDesgloseCotizacionesSocialesLegacy'),sourceCanonical:source(u,'calcularDesgloseCotizacionesPerfilUniforme')}))},null,2));
const enriched=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'));
enriched.nodes.push({id:'R.umbralEuros',file:t,symbol:'umbralRetencionTrabajoEuros',output:'return number|null',formula:'fecha undefined llama tablaUmbralesRetencionTrabajo({anio}); definida llama con anio,fecha,situacionLaboral. Después tabla[situacionFamiliar] y umbralPorDescendientes(...,numeroDescendientes).',inputs:['R.tabla','R.columna','entrada:situacionFamiliar,numeroDescendientes'],conditions:'Argumentos efectivos: anio subcaso, fecha version?.desde, situación del subcaso, length de descendientes filtrados según modo.',source:source(t,'umbralRetencionTrabajoEuros')});
enriched.nodes.find(n=>n.id==='R.umbral').inputs=['R.umbralEuros'];
enriched.nodes.push({id:'M.toCentimos',file:m,symbol:'eurosACentimos',output:'return number',formula:'redondearImporteLiquidado(euros).mul(100).toNumber(); redondearImporteLiquidado llama redondearHalfUp(euros,2)',inputs:['M.redondeo','primitiva:Decimal.mul,toNumber','literal:100'],conditions:'No política mensual TGSS; rastro vuelve a convertir según sitio.',source:source(m,'eurosACentimos')});
enriched.nodes.find(n=>n.id==='R.importe').inputs.push('M.toCentimos');
enriched.nodes.find(n=>n.id==='A.coste').inputs.push('M.toCentimos');
const selection=new Set(['R.version','R.calendario','R.menor3','R.ordenHijos','R.columna','R.exento','R.ceuta','R.dominio','R.guardas']);
enriched.edges=enriched.nodes.flatMap(n=>n.inputs.map(from=>({from,to:n.id,property:n.output,relation:n.id==='R.dominio'||n.id==='R.guardas'?'validacion-dominio':from==='R.version'||from==='R.ceuta'||selection.has(n.id)?'control-seleccion':'valor',reason:n.formula,conditions:n.conditions,source:n.source})));
fs.writeFileSync(out+'grafo.json',JSON.stringify(enriched,null,2));
const occurrenceRows=JSON.parse(fs.readFileSync(out+'ocurrencias-r21.json','utf8'));
for(let i=0;i<occurrenceRows.length;i++){
 const x=occurrenceRows[i],original=originals[i];x.origin=original.origin;
 x.outputProperty=x.target?enriched.nodes.find(n=>n.id===x.target).output:null;
 if(x.target==='S.meiTipos'||x.target==='S.tipos'||x.target==='S.tiposSolid'){
 x.outputProperty=x.selector.includes('empresarial')||x.selector.includes('empresa')?'empresarial':x.selector.includes('trabajador')?'trabajador':'selector-año';
 if(x.outputProperty==='selector-año')x.relation='control-seleccion';
 }
 x.exclusions=x.status==='otro-lote'?['Sin expansión de implementación ajena']:x.target==='S.max'?['No afecta base canónica2018; sí base legacy2018. En2018 solidaridad canónica tipos0; ejecución del producto no implica efecto numérico del máximo.']:x.outputProperty==='empresarial'?['No hay tránsito de este tipo al lado trabajador']:x.outputProperty==='trabajador'?['No hay tránsito de este tipo al lado empresarial']:[];
}
fs.writeFileSync(out+'ocurrencias-r21.json',JSON.stringify(occurrenceRows,null,2));
// Los parámetros internos son puertos formales, nunca entradas públicas ficticias.
const parameterGraph=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'));
const formalOwners=new Map([
 ['R.lineal',['maximo','inicio','pendiente']],['R.escala',['base']],['R.columna',['umbrales','numeroDescendientes']],['R.calendario',['fecha','anio']],['R.discapacidad',['discapacidad']],['R.asistencia',['discapacidad','movilidadReducida']],['R.multiplicador',['descendiente']],['R.menor3',['descendiente']],['R.ordenHijos',['indice']],['R.umbralEuros',['situacionFamiliar','numeroDescendientes']],['R.tabla',['anio','fecha','situacionLaboral']],['R.tablaCierre',['anio']],['R.opcional',['centimos']]
]);
for(const n of parameterGraph.nodes){
 const formals=formalOwners.get(n.id)??[];n.formalParameters=formals;
 n.inputs=n.inputs.map(input=>input.startsWith('entrada:')&&formals.some(p=>input.slice(8).split(/[,.]/).includes(p))?'formal:'+n.symbol+'.'+input.slice(8):input);
 if(n.id==='R.lineal')n.argumentBindings=[{caller:'calcularReduccionTrabajo',arguments:['rnt','3700','11250','1.15625'],condition:'antigua o componente antigua media2018'},{caller:'calcularReduccionTrabajo',arguments:['rnt','5565','13115','1.5'],condition:'2019 o componente nueva media2018'},{caller:'calcularReduccionTrabajo',arguments:['rnt','6498','14047.5','1.14'],condition:'2023'}];
 else n.argumentBindings=calls.filter(c=>c.callee===n.symbol).map(c=>({callerSource:c.call,arguments:c.actualArguments,condition:n.conditions}));
}
parameterGraph.edges=parameterGraph.nodes.flatMap(n=>n.inputs.map(from=>({from,to:n.id,property:n.output,relation:n.id==='R.dominio'||n.id==='R.guardas'?'validacion-dominio':from==='R.version'||from==='R.ceuta'||selection.has(n.id)?'control-seleccion':'valor',reason:n.formula,conditions:n.conditions,source:n.source})));
fs.writeFileSync(out+'grafo.json',JSON.stringify(parameterGraph,null,2));
// Separa propiedades de objetos compartidos que tienen consumidores distintos.
const splitGraph=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'));
function splitNode(id,symbol,formula,inputs,output='return'){
 splitGraph.nodes.push({id,file:r,symbol,output,formula,inputs,conditions:'Argumento del subcaso de retención, rama y modo según R.guardas.',source:source(r,symbol),formalParameters:[],argumentBindings:[]});
}
for(const [id,symbol,field] of [['R.irregular1','irregular1','irregular1Centimos'],['R.irregular2','irregular2','irregular2Centimos'],['R.pension','pensionCompensatoria','pensionCompensatoriaConyugeCentimos'],['R.anualidades','anualidades','anualidadesAlimentosHijosCentimos']])splitNode(id,symbol,'importeOpcional(caso.'+field+') = centimosAEuros(caso.'+field+' ?? 0)',['entrada:caso.retencionTrabajoAeat.'+field,'M.conversion']);
splitNode('R.laboralP','pensionista','situacionLaboral===pensionista ? 600 : 0',['entrada:caso.retencionTrabajoAeat.situacionLaboral','literal:600'],'pensionista');
splitNode('R.laboralD','desempleado','situacionLaboral===desempleado ? 1200 : 0',['entrada:caso.retencionTrabajoAeat.situacionLaboral','literal:1200'],'desempleado');
splitNode('R.laboralH','hijos','descendientes.length > 2 ? 600 : 0',['entrada:descendientes.length-filtrado-segun-modo','literal:2,600'],'hijos');
splitGraph.nodes.find(n=>n.id==='R.laboral').inputs=['R.laboralP','R.laboralD','R.laboralH'];
splitGraph.nodes.find(n=>n.id==='R.opcional').inputs=['formal:importeOpcional.centimos','M.conversion'];
splitGraph.nodes.find(n=>n.id==='R.rnt').inputs=['R.R','R.C','R.irregular1','R.irregular2'];
splitGraph.nodes.find(n=>n.id==='R.base').inputs=['R.rnr','R.laboralP','R.laboralD','R.laboralH','R.pension'];
splitGraph.nodes.find(n=>n.id==='R.cuotaEscala').inputs=['R.base','R.anualidades','R.minimo','R.escala','literal:1980'];
for(const id of ['R.exento','R.limite']){const n=splitGraph.nodes.find(x=>x.id===id);n.inputs=n.inputs.flatMap(x=>x==='R.laboral'?['R.laboralP','R.laboralD']:x);}
splitGraph.edges=splitGraph.nodes.flatMap(n=>n.inputs.map(from=>({from,to:n.id,property:n.output,relation:n.id==='R.dominio'||n.id==='R.guardas'?'validacion-dominio':from==='R.version'||from==='R.ceuta'||selection.has(n.id)?'control-seleccion':'valor',reason:n.formula,conditions:n.conditions,source:n.source})));
fs.writeFileSync(out+'grafo.json',JSON.stringify(splitGraph,null,2));
