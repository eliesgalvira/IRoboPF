import fs from 'node:fs'
const dir='docs/procedencia/editorial/flujo-rentas-r21-sol/'
const read=n=>JSON.parse(fs.readFileSync(dir+n,'utf8'))
const rows=read('ocurrencias-325.json'),nodes=read('nodos.json'),flow=read('flujo.json')
function target(o){
 const f=o.source.file,s=o.symbol,l=o.statement.text,e=o.expression.text,r=o.selector
 let node=null,relation='control',reason=''
 if(s==='GASTOS_FIJOS_IRPF_LEGACY'){node='W.F';relation='value';reason='La ruta efectiva elige ejercicio de acceso [anio], no comparte valor por igualdad.'}
 else if(s==='BASE_MAXIMA_COTIZACION_LEGACY'){node='SS.baseParam';relation='value';reason='Acceso [anio] en obtenerParametrosCotizacionLegacy. En2018 canónico B usa topes mensuales propios; este máximo sigue en tramos.'}
 else if(s==='EXENCION_50_POR_CIENTO_GANANCIAS_INMUEBLES_URBANOS_ADQUIRIDOS_2012'){node='H.old';relation='value';reason='parametro.porcentajeExento multiplica saldo positivo tras exención previa.'}
 else if(f.endsWith('trabajo-anual/calcular.ts')){
  if(o.source.start>=0){
   if(s==='gastos'){node='E.AE';relation='value';reason='Límite en min anual, después de sumar colegio/defensa, antes de P.'}
   else if(s==='teoricos'){node='E.theory';relation='value';reason='Año selecciona gasto teórico; generales lo limita por saldo.'}
   else if(s==='generales'){node='E.f';relation='value';reason='Suelo del saldo para limitar f; no borra pérdida a-e.'}
   else if(s==='incremento'||s==='discapacidad'){node=s==='incremento'?'E.increment':'E.disability';relation='value';reason='Selecciona o limita incremento; en conexión anual discapacidad ninguna.'}
   else if(['bruto','ordinarios','colegio','defensa'].includes(s)){node={'bruto':'E.I','ordinarios':'E.ordinary','colegio':'E.college','defensa':'E.defence'}[s];relation='value';reason='Identidad aditiva de acumulador, operación técnica sin cuantía normativa autónoma.'}
   else if(s==='D'){node=null;relation='numeric-policy';reason='Precisión60 de Decimal.clone, política aritmética de todo el módulo; no magnitud fiscal.'}
   else if(s==='calcularDeduccionTrabajo'){
    if(/baseImponible|tipoMedio|rendimientoComputable/.test(l)){relation='excluded';reason='Rama art80bis histórica, no usada por conexión DA61 2025. No inferir dependencia por compartir función.'}
    else{node='E.da61.fn';relation=o.role.startsWith('control')?'control':'value';reason='Rama DA61: elegibilidad2025/O o fórmula/límite proporcional; fuente de rama exacta conservada.'}
   }else{node='E.admission';relation='control';reason=o.occurrenceId==='inv-1df2eac53e8332f88fe46ef5a3aae75a'?'2015 admite discapacidad activa solo desde ese año; no índice ni regla general de existencia de trabajo.':'Rechazo o requisito del contrato trabajo antes de obtener resultado; no suma al íntegro.'}
  }
 }
 else if(f.endsWith('actividades-economicas/calcular.ts')){
  if(s==='reduccionRentasBajas2025'){node='A.low';relation='value';reason='Fórmula acotada de rentas bajas, solo rama !elegible y elección; no salario art20.'}
  else if(s==='G'){node='A.G';relation='value';reason='Opción cliente único0 u operación .05max(P,0) limitada2000.'}
  else if(s==='adicional'){node='A.adicional';relation='value';reason='Umbral/pendiente de reducción de actividad sobre RN; no constante salarial7302.'}
  else if(s==='incremento'){node='A.incremento';relation='value';reason='Grado y ayuda eligen3500/7750 o0; anual bloquea grado no0.'}
  else if(s==='reduccionInicio'){node='A.inicio';relation='value';reason='20% del saldo tras art32, base limitada100000 si elección e historial elegible.'}
  else if(s==='elegible'||s==='unico'){node='A.elegible';relation='control';reason='Cliente único,30% gastos incluidos RETA/amortización y70% bases sujetas; no porcentaje retenido.'}
  else if(s==='inicioElegible'||s==='primerPositivo'||s==='anteriores'||s==='excluidoEmpleador'){node='A.inicioEligible';relation='control';reason='Historial de primer positivo, período siguiente y antiguo empleador>50%; modifica elegibilidad, no resta ingresos.'}
  else if(s==='amortizacion'||s==='suma'||s==='reduccion'){node={'amortizacion':'A.amort','suma':'A.ingresos','reduccion':'A.reduccion'}[s];relation='value';reason='Cero técnico inicial de acumulación/reducción; suma se reutiliza en otras magnitudes y no es regla fiscal.'}
  else if(s==='D'){relation='numeric-policy';reason='Precisión80 del submotor; no umbral material.'}
  else {node='A.etapas';relation='control';reason='Admisión previa a etapas: calendario, historia,duplicación,volumen,activo o grado; debe conservarse el predicado individual.';if(/D\.min\(D\.max\(RN/.test(l)){node='A.reduccion';relation='value';reason='Tope RN positivo y suma2000+adicional+incremento; controla valor de reducción.'}}
 }
 else if(f.endsWith('reduccion-rendimientos-trabajo.ts')){
  if(['fechaCivilIsoUtc','fallecidoAntesDeFechaCivil'].includes(s)){node='R.reduccionTrabajo2018';relation='control';reason='Representación/comparación de fecha civil de fallecimiento para rama2018; no fechaPago.'}
  else{node=s==='calcularReduccionTrabajoConOtrasRentas'?'R.formula':'R.'+s;relation=o.role.startsWith('control')?'branch':'value';reason='Selector anual/O/P o expresión de la rama conservada; umbral por tramos puede cambiar valor, no solo admisibilidad.'}
 }
 else if(f.endsWith('cotizaciones-perfil-uniforme.ts')){
  if(s==='tiposSolidaridad'){node=r.includes('trabajador')?'SS.solidWorker':r.includes('empresa')?'SS.solidEmployer':'SS.tranches';relation=r.includes('StringLiteral')?'value':'branch';reason='Ruta estructural fija año,lado e índice del tramo; las claves de año seleccionan, las cadenas de tipos multiplican.'}
  else if(s==='baseOrdinaria'){node='SS.B';relation='value';reason='Rama2018 con topes mensuales,7/5 y divisor12; año es selector, meses son ponderadores del valor.'}
  else if(['primerExceso','segundoExceso','excesoRestante','cuotaSolidaridad'].includes(s)){node='SS.tranches';relation=o.role==='indice-de-acceso'?'structural-index':'value';reason='Recorta bandas10%,40%,resto; índices0/1/2 eligen tipo, no son cuantía fiscal.'}
  else if(s==='excesoBase'){node='SS.X';relation='value';reason='Suelo0 del exceso computable.'}
  else{node='SS.tranches';relation='branch';reason='Año selecciona tipos2025/2026; anterior devuelve tuplas0, sin acreditar otra vigencia.'}
 }
 else if(f.endsWith('cotizaciones-sociales.ts')){
  if(s==='TIPOS_SEGURIDAD_SOCIAL_LEGACY'){node=r.includes('PropertyAssignment:trabajador')?'SS.workerTypes':'SS.employerTypes';relation='value';reason='Hoja del concepto y lado explícitos en ruta; sumaTipo filtra lado, no todos los tipos a ambas cuotas.'}
  else if(s==='obtenerTiposMei'){node=r.includes('PropertyAssignment:trabajador')?'SS.meiWorkerParams':r.includes('PropertyAssignment:empresarial')?'SS.meiEmployerParams':'SS.meiParams';relation=o.role.startsWith('control')?'branch':'value';reason='Ejercicio y propiedad empresarial/trabajador eligen componente MEI; no solidaridad.'}
  else{node='SS.legacy';relation=o.role.startsWith('control')?'branch':'value';reason='Algoritmo legacy: límites10/50%,total por tramos y reparto5/6,1/6. No promover a tipos publicados canónicos.'}
 }
 else if(f.endsWith('ganancias-perdidas-patrimoniales.ts')){
  const m={calcularGananciaExentaMayores65:'H.age',calcularGananciaExentaInmuebleUrbanoAdquirido2012:'H.old',LIMITE_REINVERSION_RENTA_VITALICIA_MAYORES_65:'H.life',margenReinversion:'H.life',proporcionExenta:'H.life',calcularExencionPorReinversionEnRentaVitalicia:'H.life',gananciaExenta:'H.exempt',clasificarBaseGanancia:'H.subject'};node=m[s]??null;relation=o.role.startsWith('control')?'branch':'value';reason='Exención,ganancia positiva,clasificación o reinversión: fecha adquisición,edad,ejercicio y acumulado distinguen ramas; total declarado no usa estas exenciones.'
 }
 if(node&&!nodes.some(n=>n.id===node))throw new Error('Nodo terminal ausente '+node)
 return {...o,terminal:{nodeId:node,relation,reason:reason||'Omisión explícita: requiere clasificación adicional.',conditionExpression:e,sourceExpression:o.expression,selector:o.selector},edgeStatus:node?'asignacion-semantica-candidata-con-selector':'exclusion-o-politica-explicita'}
}
const result=rows.map(target)
fs.writeFileSync(dir+'ocurrencias-325.json',JSON.stringify(result)+'\n')
for(const site of flow.sites){
 const reachable=new Set([site.root.nodeId,...site.valueDependencies.direct.map(e=>e.nodeId),...site.valueDependencies.transitive.map(e=>e.nodeId),...site.controlDependencies.map(e=>e.nodeId).filter(Boolean)])
 site.terminalCandidates=result.filter(o=>o.terminal.nodeId&&reachable.has(o.terminal.nodeId)).map(o=>({occurrenceId:o.occurrenceId,nodeId:o.terminal.nodeId,relation:o.terminal.relation,detail:'ocurrencias-325.json#'+o.occurrenceId}))
}
fs.writeFileSync(dir+'flujo.json',JSON.stringify(flow)+'\n')
console.log(JSON.stringify({classified:result.length,unassigned:result.filter(o=>!o.terminal.nodeId).map(o=>({id:o.occurrenceId,role:o.terminal.relation})),candidateLinks:flow.sites.reduce((sum,s)=>sum+s.terminalCandidates.length,0)}))
