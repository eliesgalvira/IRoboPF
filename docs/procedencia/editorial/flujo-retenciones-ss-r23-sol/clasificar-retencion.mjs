import fs from 'node:fs';
const out='docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/';
const tokens=JSON.parse(fs.readFileSync(out+'literales.json','utf8'));
const map=new Map(Object.entries({CIEN:'R.importe',truncar:'M.truncar',esCasoCalculable:'R.dominio',importeOpcional:'R.opcional',multiplicadorDescendiente:'R.multiplicador',incrementoMovilidadGeografica:'R.movilidad',incrementoGastosDiscapacidadTrabajador:'R.discGasto',gastosGenerales:'R.gastos',calcularOtrosGastos:'R.gastos',calcularReduccionActual:'R.actual',antigua:'R.reduccion',nueva:'R.reduccion',calcularReduccionTrabajo:'R.reduccion',cuantiaMinimoDescendiente:'R.ordenHijos',esDescendienteMenorTres:'R.menor3',minimoMenoresTres:'R.minHijos',computaPorEdad:'R.minAsc',minimo65:'R.minAsc',minimo75:'R.minAsc',minimoDiscapacidad:'R.discapacidad',minimoAsistencia:'R.asistencia',edad:'R.minimo',incrementoEdad:'R.minimo',minimoContribuyente:'R.minimo',calcularCuotaEscala:'R.escala',tramos:'R.escala',tramo:'R.escala',aplicaAnualidades:'R.cuotaEscala',cuotas:'R.cuotaEscala',pensionista:'R.laboralP',hijos:'R.laboralH',desempleado:'R.laboralD',calcularLimite43:'R.limite',calcularMinoracionVivienda:'R.vivienda',calcularDiferenciaPositiva:'R.diferencia',calcularTipoInicial:'R.tipoCalc',aplicarMinimoContrato:'R.tipo',irregular:'R.guardas',calcularRetencionTrabajoAeatImpl:'R.guardas',descendientes:'R.guardas',tablaVigenteAlCierreDelAnio:'R.tablaCierre',tablaUmbralesRetencionTrabajo:'R.tabla',umbralPorDescendientes:'R.columna',umbralRetencionTrabajoRequeridoEuros:'R.umbral',mes:'R.calendario',dia:'R.calendario',bisiesto:'R.calendario',dias:'R.calendario',esFechaCivilDelAnio:'R.calendario',VERSIONES_RETENCION:'R.catalogo',seleccionarVersionRetencion:'R.version'}));
const graph=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'));
const rows=[];
for(const x of tokens.filter(x=>/retencion/.test(x.file))){
 let target=map.get(x.owner)??null,role='valor',reason='La operación y argumentos efectivos se expanden en el nodo consumidor, no se deriva del número.';
 if(x.owner.startsWith('UMBRALES_RETENCION_'))target=x.owner==='UMBRALES_RETENCION_NOMINA_POR_ANIO'?'R.tablas':'tabla:'+x.owner;
 if(x.owner.startsWith('UMBRALES_RETENCION_')&&x.owner!=='UMBRALES_RETENCION_NOMINA_POR_ANIO')reason='Celda '+x.propertyPath.join('.')+': umbral individual solo con esta fila/columna, período y situación laboral; máximo toma todas las celdas no nulas. No afecta base ni mínimo familiar; selecciona exención/límite43.';
 if(x.owner==='CERO'){target='R.rnt';reason='CERO es identidad compartida, con usos independientes: suelos, acumuladores y ramas nulas. Este enlace localiza su definición; no implica que cada cero sea regla fiscal.';}
 if(['euros','porcentaje','calcularRetencionTrabajo'].includes(x.owner)){target=null;role='cohabitacion-excluida';reason='Precisión de formato del rastro, sin modificar base/cuota/tipo/importe numérico.';}
 if(x.owner==='tramos'&&x.propertyPath.includes('resto')){target=null;role='cohabitacion-excluida';reason='Campo resto, incluido Infinity, no leído por find ni cuota+(base-desde)*tipo. Mutación real de resto conserva salida.';}
 if(x.owner==='module'){target=null;role='cohabitacion-excluida';reason='Literal de tipo TypeScript borrado antes de ejecutar; no parámetro del cálculo.';}
 if(x.propertyPath.some(p=>['sha256','referencia'].includes(p))){target=null;role='cohabitacion-excluida';reason='Metadato documental del catálogo, leído para rastro; no selecciona el importe.';}
 if(x.text.startsWith('"')){
 const raw=x.text.slice(1,-1);
 const selectors=['activo','pensionista','desempleado','desde65','de33a65','sin-discapacidad','situacion1','general','especial','inferior-anio','manuales','compatible-legacy','regularizacion','antigua','media2018','2019','2023','2024','cierre'];
 if(selectors.includes(raw)&&target)role=target==='R.guardas'?'validacion-dominio':'control-seleccion';
 else if(raw.includes(' ')||raw.startsWith('retencion.')||raw.startsWith('docs/')||raw.startsWith('https:')){target=null;role='cohabitacion-excluida';reason='Mensaje, etiqueta o referencia documental; no valor ni selector numérico de salida.';}
 }
 if(['R.version','R.tablas','R.tabla','R.columna','R.calendario'].includes(target))role='control-seleccion';
 if(target==='R.dominio'||target==='R.guardas')role='validacion-dominio';
 if(x.text==='null'){role='validacion-dominio';reason='Ausencia de umbral, situación1 sin hijos; no importe cero.';}
 if(x.owner==='tramos'&&x.propertyPath.includes('desde'))role='control-seleccion';
 if(x.typeOnly){target=null;role='cohabitacion-excluida';reason='Token dentro de un tipo TypeScript, borrado antes de ejecución; incluye Parameters<...>[0], que no indexa ningún valor en runtime.';}
 if(!target&&role!=='cohabitacion-excluida'){
 if(x.inventory)throw Error('Token inventariado sin disposición: '+x.owner+' '+x.text);
 role='cohabitacion-excluida';reason='Texto de fuente/rastro/diagnóstico sin valor numérico de salida; las fechas y discriminantes del selector se conservan en sus nodos específicos.';
 }
 if(target&&!graph.nodes.some(n=>n.id===target))throw Error(target);
 rows.push({source:x,occurrenceId:x.inventory?.occurrenceId??null,selector:x.inventory?.selector??x.propertyPath,consumer:target,relation:role,reason,condition:target?graph.nodes.find(n=>n.id===target).conditions:'No se crea dependencia de valor',review:'pendiente'});
}
fs.writeFileSync(out+'terminales-retencion.json',JSON.stringify(rows,null,2));console.log({classified:rows.length,inventoryOccurrences:rows.filter(x=>x.occurrenceId).length});
