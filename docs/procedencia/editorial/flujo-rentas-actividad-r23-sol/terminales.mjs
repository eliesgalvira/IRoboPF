import fs from 'node:fs'
import assert from 'node:assert/strict'
const out='docs/procedencia/editorial/flujo-rentas-actividad-r23-sol/'
const prior=JSON.parse(fs.readFileSync('docs/procedencia/editorial/flujo-rentas-r21-sol/ocurrencias-325.json','utf8'))
const graph=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'))
const mapping={
 reduccionTrabajoDesde2024:['r.reduccionTrabajoDesde2024','x.R.function'],reduccionTrabajoHasta2014:['r.reduccionTrabajoHasta2014'],reduccionTrabajo2015A2017:['r.reduccionTrabajo2015A2017'],reduccionTrabajo2019A2022:['r.reduccionTrabajo2019A2022'],reduccionTrabajo2023:['r.reduccionTrabajo2023'],reduccionTrabajo2018:['r.2018'],calcularReduccionTrabajoConOtrasRentas:['g.R'],fechaCivilIsoUtc:['r.civil'],GASTOS_FIJOS_IRPF_LEGACY:['g.F'],EXENCION_50_POR_CIENTO_GANANCIAS_INMUEBLES_URBANOS_ADQUIRIDOS_2012:['h.window'],clasificarBaseGanancia:['h.classify'],proporcionExenta:['h.life'],margenReinversion:['h.life'],LIMITE_REINVERSION_RENTA_VITALICIA_MAYORES_65:['h.life.limit'],calcularGananciaExentaMayores65:['h.age'],calcularGananciaExentaInmuebleUrbanoAdquirido2012:['h.old'],gananciaExenta:['h.exempt'],calcularExencionPorReinversionEnRentaVitalicia:['h.life']
}
const work={gastos:['w.AE'],teoricos:['w.F'],incremento:['w.dis'],bruto:['w.I'],generales:['w.F'],defensa:['w.AE'],ordinarios:['w.AE'],colegio:['w.AE'],discapacidad:['w.dis']}
const activity={elegible:['a.eligible'],inicioElegible:['a.startEligible'],reduccionRentasBajas2025:['a.low'],G:['a.G'],adicional:['a.additional'],reduccionInicio:['a.start'],excluidoEmpleador:['a.employer'],primerPositivo:['a.first'],anteriores:['a.previous'],incremento:['a.dis'],reduccion:['a.reduction'],suma:['a.income','a.ordinary','a.reta','a.withholding','a.payments'],unico:['a.unique'],amortizacion:['a.amort'],inicio:['a.startEligible']}
const rows=prior.map(r=>{
 const file=r.source.file,expr=r.expression?.text??r.source.text??'',isSS=file.includes('/laboral/')||file.includes('seguridad-social-')
 let targets=[],kind='value',reason='',status='resuelta-candidata'
 if(isSS){status='frontera-otro-lote';kind='boundary';reason='Lote retenciones/SS; aquí solo se consume return.cotizacionTrabajador por modo, nunca sus otras propiedades.'}
 else if(file.includes('/trabajo-anual/')){
  if(r.symbol==='calcularDeduccionTrabajo'){
   const t=r.source.text??'';const dead=r.source.start<fileWorkDA61()
   targets=dead?[]:['x.da'];kind=dead?'cohabitation':r.terminal?.relation==='control'?'domain-validation':'value';reason=dead?'Rama art80bis/guardas propias, inalcanzable desde conexión regla=da61; no arista hacia DA61.':'DA61: legal usa bruto/O; límite usa cuota×neto/base; guardas restringen dominio; aquí O0 y cuotas enlazadas a x.liquid.'
  }else if(r.symbol==='calcularGastosTrabajo'){targets=['validation.work'];kind='domain-validation';reason='Predicado de admisión de ejercicio/discapacidad/rendimientos; no cuantía sumada.'}
  else if(r.symbol==='D'){targets=['w.I','w.AE','w.N','x.da'];kind='numeric-policy';reason='Precisión60 de Decimal clonado; no umbral fiscal.'}
  else {targets=work[r.symbol]??[];kind=r.terminal?.relation==='control'?'selection':'value';reason='Asignación específica de trabajo: '+(targets.map(t=>graph.nodes.find(n=>n.id===t)?.formula).join('; '))}
 }else if(file.includes('/actividades-economicas/')){
  if(r.symbol==='calcularActividad2025'||['dias','previos','bisiesto','fechaValida','[y = 0, m = 0, d = 0]','[, mes = 0, dia = 0]'].includes(r.symbol)){targets=['validation.activity'];kind='domain-validation';reason='Admisión: calendario, historial, volumen, fechas, activos, importes/relaciones documentales. No sumando del rendimiento; activo validado solo submotor.'}
  else if(r.symbol==='D'){targets=['a.P','a.RN','a.contribution'];kind='numeric-policy';reason='Precisión80; política aritmética del submotor, no cuantía fiscal.'}
  else{targets=activity[r.symbol]??[];kind=r.terminal?.relation==='control'?'selection':'value';reason='Asignación específica EDS: '+targets.map(t=>graph.nodes.find(n=>n.id===t)?.formula).join('; ')}
 }else{targets=mapping[r.symbol]??[];kind=r.terminal?.relation==='control'||r.terminal?.relation==='branch'?'selection':r.terminal?.relation==='structural-index'?'structural-index':'value';reason='Propiedad consumida: '+targets.map(t=>graph.nodes.find(n=>n.id===t)?.formula).join('; ')}
 assert(isSS||reason.length>20,r.occurrenceId)
 if(!isSS&&!targets.length&&kind!=='cohabitation')throw new Error('Sin resolución '+r.symbol)
 return {occurrenceId:r.occurrenceId,source:r.source,layer:r.layer,selector:r.selector,symbol:r.symbol,expression:r.expression,kind,targets,status,reason,condition:targets.some(t=>t.startsWith('a.'))?'Submotor común2025; conexión anual solo sin activos y grado0; cliente-unico/rentas-bajas/inicio según nodo':targets.some(t=>t.startsWith('w.')||t.startsWith('x.'))?'Trabajo explícito2025 Madrid; ramas de otras fechas solo API aislada; ver predicado exacto':isSS?'Contrato de cuota obrera por modo; composición pendiente':'Año/fechas de llamada general; ver selector exacto del nodo',literalClaim:r.layer==='effective'?'Rango productor completo; selector identifica hoja efectiva. No es token literal.':'Token individual conservado con contexto; nunca unión por valor numérico',legalAcceptance:false}
})
function fileWorkDA61(){const text=fs.readFileSync('lib/dominio/irpf/trabajo-anual/calcular.ts','utf8');return text.indexOf('if (c.ejercicio !== 2025)')}
assert.equal(rows.length,325)
fs.writeFileSync(out+'ocurrencias.json',JSON.stringify(rows))
console.log(JSON.stringify({individual:rows.length,local:rows.filter(r=>r.targets.length).length,boundary:rows.filter(r=>r.kind==='boundary').length,excluded:rows.filter(r=>r.kind==='cohabitation').length}))
