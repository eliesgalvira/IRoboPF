import {Schema} from 'effect';
import {verifyMoney11} from './conjunta-readbacks11.mjs';
// Fixtures exclusivamente sintéticos. Sin producto, liquidación ni promoción a matches.
import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
import {accessSES} from './conjunta-ses.mjs';
import {rawPdfRows} from './conjunta-pdf.mjs';
export const need = (ok, code) => { if (!ok) throw Error(code); };
export const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const sorted = value => Array.isArray(value) || Schema.is(Schema.Record(Schema.String, Schema.Unknown))(value)
  ? Array.isArray(value) ? value.map(sorted)
    : Object.fromEntries(Object.keys(value).sort().filter(k=>value[k]!==undefined).map(k => [k, sorted(value[k])])) : value;
export const canonical = value => JSON.stringify(sorted(value));
export const equal = (a,b,code) => need(canonical(a) === canonical(b),code);
export const versionMetadata = p => Object.fromEntries(['VersionReglas','CodModelo','EjModelo','VersionModelo','encoding','version','standalone'].map(k=>[k,p.metadata[k]]));
export function cents(s) {
  need(Schema.is(Schema.String)(s) && /^-?\d+(?:\.\d{1,2})?$/.test(s),'decimal');
  const [a,b=''] = s.replace(/^-/, '').split('.');
  return (s.startsWith('-') ? -1n : 1n)*(BigInt(a)*100n+BigInt(b.padEnd(2,'0')));
}
const fromUI = s => s.replaceAll('.','').replace(',','.');
const iso = s => s.split('-').reverse().join('/');
const holders = ['CONJUNTA','CONYUGE','DECLARANTE'];
const opaque = new Set(['COD_TRAMITE','DF_DATOS_SI','DF_AVISOS']);
const regionCodes = {'aragon':'02','illes-balears':'04','castilla-la-mancha':'07','castilla-y-leon':'08','galicia':'11','murcia':'13','comunitat-valenciana':'17'};
// Árbol completo: conserva duplicados, tipos, flags y secciones vacías. Sólo los
// tres campos opacos de transporte omiten valor; nunca se omite dinero.
export function census(text) {
  const p=accessSES(text);
  const visit = s => ({name:s.name,
    fields:p.records.filter(r=>r.scope===s.id).map(r=>[r.key,r.type,r.flag,opaque.has(r.key)?null:r.value]).sort((a,b)=>a[0].localeCompare(b[0])),
    children:p.sections.filter(c=>c.parent===s.id).map(visit).sort((a,b)=>canonical(a).localeCompare(canonical(b)))});
  return visit(p.sections[0]);
}
export function validateSES(text, reference, entry) {
  need(entry.tipoUnidad==='matrimonial','monoparental-sin-evidencia');
  const p=accessSES(text), root=p.path('DECLARACIONES'), dp=p.path('DECLARACIONES/DP');
  equal(versionMetadata(p),reference.metadata,'ses-version');
  for(const [name,key] of [['IRPF2025','TITULAR'],['RESUMEN','R_TIT']]) {
    const nodes=p.sections.filter(s=>s.parent===root.id && s.name===name);
    equal(nodes.map(s=>p.row(s,key)).sort(),holders,'titulares-censo');
  }
  equal(census(text),reference.census,'ses-censo-cerrado');
  const instances=Object.fromEntries(holders.map(h=>[h,p.instance('IRPF2025','TITULAR',h)]));
  const summaries=Object.fromEntries(holders.map(h=>[h,p.instance('RESUMEN','R_TIT',h)]));
  const check=(s,k,v)=>equal(p.row(s,k),v,'ses-correspondencia-'+k.toLowerCase());
  need(entry.modalidad==='conjunta' && entry.ejercicio===2025 && entry.hijos.length===1,'entrada-alcance');
  equal(entry.miembros,[entry.declarante.id,entry.conyuge.id,entry.hijos[0].id],'entrada-miembros');
  need(entry.miembros.every(x=>Schema.is(Schema.String)(x)&&x.length>0)&&new Set(entry.miembros).size===3,'entrada-identidades');
  const region=regionCodes[entry.comunidadAutonoma];
  need(region!==undefined,'entrada-territorio');
  for(const key of ['CAC_D','CAC_C'])check(dp,key,region);
  for(const node of Object.values(instances))check(node,'ZCCAD',region);
  need(entry.economia.perceptorId===entry.declarante.id,'perceptor');
  need(entry.economia.censoCompleto===true&&entry.economia.otrasRentasIncluidasExentas==='ninguna'&&entry.economia.actividadesAhorroInmueblesGanancias==='ninguno','economia-corte');
  equal([...entry.economia.miembrosSinRentas].sort(),[entry.conyuge.id,entry.hijos[0].id].sort(),'economia-miembros-sin-rentas');
  need(cents(entry.hijos[0].rentaNoExenta)===0n,'hijo-rentas');
  need(entry.economia.trabajo.ejercicio===2025&&entry.economia.trabajo.territorio==='comun','trabajo-corte');
  const wages=entry.economia.trabajo.rendimientos, ret=entry.economia.retenciones;
  need(wages.length===1 && ret.length===1,'salario-cardinalidad');
  const wage=wages[0];
  for(const key of ['sindicato','colegio','defensa'])need(cents(wage[key]?.importe)===0n,'gastos-especificos-fuera-corte');
  for(const key of ['derechosPasivos','colegiosHuerfanos'])need(cents(wage.cotizaciones[key])===0n,'cotizaciones-fuera-corte');
  const amounts={IDII:wages[0].integro,GSS:wages[0].cotizaciones.seguridadSocial,IDRE:ret[0].importe};
  const d=instances.DECLARANTE,c=instances.CONYUGE,j=instances.CONJUNTA;
  const children=(s,n)=>p.sections.filter(x=>x.parent===s.id && x.name===n);
  const unique=(s,n)=>{const xs=children(s,n);need(xs.length===1,'ses-cardinalidad-'+n.toLowerCase());return xs[0];};
  need(children(c,'ATRABAJO').length===0,'conyuge-trabajo-extra');
  const original=unique(d,'ATRABAJO'), aggregate=unique(j,'ATRABAJO'), dialog=unique(original,'DLGTRABAJO');
  need(children(aggregate,'DLGTRABAJO').length===0,'conjunta-dialogo-extra');
  for(const work of [original,aggregate]) {
    check(work,'TITA','DECLARANTE');
    need(cents(p.row(work,'TPDIN'))===cents(amounts.IDII) && cents(p.row(work,'TPGSS'))===cents(amounts.GSS),'salario-agregado');
  }
  for(const [key,value] of Object.entries(amounts)) need(cents(p.row(dialog,key))===cents(value),'salario-dialogo');
  for(const [h,node] of Object.entries(instances)) {
    const summary=summaries[h];
    check(summary,'R_SPNIF',p.row(node,'SPNIF')); check(summary,'R_SPNOM',p.row(node,'SPNOM'));
    for(const r of p.records.filter(r=>r.scope===summary.id && !['R_TIT','R_SPNIF','R_SPNOM'].includes(r.key)))
      need(cents(r.value)===cents(r.key==='R_TPING'?p.row(h==='CONJUNTA'?aggregate:original,'TPING'):p.row(node,r.key.slice(2))),'resumen-titular');
  }
  for(const node of [d,j]) need(cents(p.row(node,'RET1'))===cents(amounts.IDRE),'retenciones');
  const desc=unique(dp,'DESCENDIENTES'), minor=unique(dp,'RWHIJOSMENOR18');
  for(const [person,suffix,node] of [[entry.declarante,'D',d],[entry.conyuge,'C',c]]) {
    check(dp,'DPFNAC_'+suffix,iso(person.fechaNacimiento));
    equal(p.row(dp,'DPNIF_'+suffix,'3','254'),p.row(node,'SPNIF'),'identidad-persona');
    equal(p.row(dp,'DP_APENOM_'+suffix),p.row(node,'SPNOM'),'nombre-persona');
    check(j,'ZFNAC_'+suffix,iso(person.fechaNacimiento));
    check(j,'ZAPENOM_'+suffix,p.row(node,'SPNOM'));
  }
  check(desc,'FNAC',iso(entry.hijos[0].fechaNacimiento));check(minor,'FNACHMEN',iso(entry.hijos[0].fechaNacimiento));
  for(const key of ['NIFDLG']) check(desc,key,p.row(desc,'NIFH'));
  check(minor,'NIFHMEN',p.row(desc,'NIFH'));check(j,'ZDNIU1',p.row(desc,'NIFH'));
  check(j,'ZAPENU1',p.row(desc,'APENOMDLG_SR'));check(j,'ZANOU1',p.row(desc,'FNAC'));
  check(j,'SPNIF',p.row(d,'SPNIF'));check(j,'ZNIF_C',p.row(c,'SPNIF'));check(c,'ZNIF_C',p.row(d,'SPNIF'));
  check(j,'ZCCAD',p.row(dp,'CAC_D'));check(minor,'CACHMEN',p.row(dp,'CAC_D'));
  for(const name of ['ASCENDIENTES','RWHIJOSMAYOR18']) {const s=unique(dp,name);need(!p.records.some(r=>r.scope===s.id),'familia-extra');}
  const other=unique(root,'OTROSPROGENITORES');need(!p.records.some(r=>r.scope===other.id),'progenitor-extra');
  return {p,joint:j,summary:summaries.CONJUNTA,amounts};
}
export function controlsProjection(controls) {
  return controls.map(c=>({title:c.title,containerTitle:c.containerTitle,type:c.type,value:c.value,
    checked:c.checked,disabled:c.disabled,labels:c.labels}));
}
export function catalogs(html) {
  // Catálogo observado, sin interpretar códigos de custodia/renta como hechos legales.
  return [...html.matchAll(/<span[^>]*class="z-comboitem-text"[^>]*>([^<]*)<\/span>/g)].map(m=>m[1]);
}
export const pdfMapping={'0511':'MPER','0512':'MPERAU','0513':'MDES','0514':'MDESAU','0519':'MPERFA','0520':'MPERFAAU',
  '0461':'REDCONJUNTA','0491':'JREDU11','0500':'BLGRAL','0505':'BLGGRAV','0545':'CINTEST','0546':'CINTAUT',
  '0570':'CLIQEST','0571':'CLIQAUT','0585':'CLEIN','0586':'CLAIN','0587':'CLIQT','0595':'CAUTLIQ','0596':'RET1','0609':'PAGOS','0610':'CDIF','0670':'RESULTADO'};
export function validatePdf(bytes,ses) {
  const lines=rawPdfRows(bytes).map(r=>r.text), text=lines.join('\n');
  const field=(scope,box,value)=>{const rows=scope.filter(l=>l.endsWith(' '+box));need(rows.length===1&&rows[0].endsWith(' '+value+' '+box),'pdf-identidad-'+box);};
  const {p,joint:j}=ses, dp=p.path('DECLARACIONES/DP'), desc=p.path('DECLARACIONES/DP/DESCENDIENTES');
  const header=text.split('Opción de tributación')[0].split('\n');
  for(const [box,key,type,flag] of [['0001','DPNIF_D','3','254'],['0002','DP_APENOM_D'],['0010','DPFNAC_D'],['0013','DPNIF_C','3','254'],['0014','DP_APENOM_C'],['0060','DPFNAC_C']]) field(header,box,p.row(dp,key,type,flag));
  field(lines,'0069','X'); need(!lines.some(l=>l.endsWith(' 0068')),'pdf-modalidad');
  const family=text.split('Situación familiar')[1]?.split('Rendimientos del trabajo')[0]?.split('\n');need(family,'pdf-familia');
  for(const [box,key] of [['0075','NIFH'],['0076','APENOMDLG_SR'],['0077','FNAC']])field(family,box,p.row(desc,key));
  const work=text.split('Rendimientos del trabajo')[1]?.split('Base imponible general y base imponible del ahorro')[0]?.split('\n');need(work,'pdf-trabajo');field(work,'0001','DECLARANTE');
  const amount=(scope,box,expected)=>{const rows=scope.filter(l=>l.endsWith(' '+box));const m=rows.length===1&&/ (-?(?:\d{1,3}(?:\.\d{3})+|\d+),\d{2}) \d{4}$/.exec(rows[0]);need(m&&cents(fromUI(m[1]))===cents(expected),'pdf-dinero-'+box);};
  amount(work,'0003',ses.amounts.IDII);amount(work,'0013',ses.amounts.GSS);
  for(const [box,key] of Object.entries(pdfMapping))amount(lines,box,p.row(j,key));
  return hash(canonical(lines));
}
export const moneyControls=['GCS','GCC','GDJ','IDICLDED2','GSSCLDED2'];
// Ausencia conserva pendiente. Evidencia presente pero incompleta/divergente se rechaza.
export function moneyEvidence(records,amounts,sourceHash,sources={},context={}) {
  if(records===undefined)return [...moneyControls];
  need(Array.isArray(records),'readbacks-formato');
  if(context.rawBundleSha256||records.some(r=>r.schema==='money-raw11-v1'))return verifyMoney11(records,sources,sourceHash,context);
  equal(records.map(r=>r.control).sort(),[...moneyControls].sort(),'readbacks-censo');
  for(const r of records) {
    const expected=['GCS','GCC','GDJ'].includes(r.control)?'0.00':r.control==='IDICLDED2'?amounts.IDII:amounts.GSS;
    need(r.holder==='DECLARANTE' && r.instance===1 && r.dialog==='DLGTRABAJO' && r.captureSha256===sourceHash,'readback-ambito');
    need(r.request?.explicit===true && Number.isSafeInteger(r.request.step) && r.request.step>0,'readback-solicitud');
    need(Schema.is(Schema.String)(r.observedControl) && r.observedControl.length>0 && /^[a-f0-9]{64}$/.test(r.inventorySha256),'readback-control-inventariado');
    const source=digest=>{const bytes=sources[digest];need(bytes && hash(bytes)===digest,'readback-integridad');return JSON.parse(bytes);};
    const inventory=source(r.inventorySha256);
    const observed=inventory.controls.filter(c=>c.id===r.observedControl);
    need(observed.length===1 && observed[0].semanticKey===r.control && observed[0].holder===r.holder && observed[0].dialog===r.dialog && observed[0].instance===r.instance,'readback-mapeo-control');
    for(const key of ['request','afterBlur','afterReopen']) {
      need(cents(r[key]?.value)===cents(expected),'readback-importe');
      need(/^[a-f0-9]{64}$/.test(r[key]?.artifactSha256) && Number.isSafeInteger(r[key].step) && r[key].step>=r.request.step,'readback-fuente');
      const event=source(r[key].artifactSha256);
      const expectedEvent={kind:key,control:r.control,observedControl:r.observedControl,holder:r.holder,dialog:r.dialog,instance:r.instance,captureSha256:sourceHash,step:r[key].step,value:r[key].value};
      if(key==='request')expectedEvent.explicit=true;
      equal(event,expectedEvent,'readback-evento');
    }
    need(r.afterReopen.step>r.afterBlur.step,'readback-reapertura');
    // La persistencia de cero omitido requiere solicitud anterior; nunca blanco.
    need(r.persistence?.key===r.control && (r.persistence.value===null && cents(expected)===0n || Schema.is(Schema.String)(r.persistence.value) && cents(r.persistence.value)===cents(expected)),'readback-persistencia');
  }
  return [];
}
export function validateHouseholdExpediente(expediente,entry) {
  const h=expediente.hogar;
  need(expediente.id===entry.unidadId&&expediente.ejercicio===entry.ejercicio&&expediente.territorio===entry.comunidadAutonoma&&expediente.modalidadObjetivo===entry.modalidad,'expediente-ambito');
  need(h.devengo===entry.devengo&&h.tipoUnidad===entry.tipoUnidad&&h.conyugeId===entry.conyuge.id,'expediente-unidad');
  equal(h.miembros,entry.miembros,'expediente-miembros');
  equal(h.convivenciaTodo2025,entry.convivientesTodo2025,'expediente-convivencia');
  need(h.fallecimientos==='ninguno'&&h.otrosConvivientes==='ninguno'&&h.otrosHijosOAscendientes==='ninguno'&&h.nadieEnOtraUnidad===true&&h.opcionConjuntaTodosMiembros===true&&h.declaracionesIndividualesMiembros==='ninguna','expediente-corte-familiar');
  equal(h.personas.map(p=>p.sujetoId).sort(),[...entry.miembros].sort(),'expediente-censo-personas');
  for(const person of [entry.declarante,entry.conyuge,...entry.hijos]) {
    const p=h.personas.find(p=>p.sujetoId===person.id);
    need(p.fechaNacimiento===person.fechaNacimiento&&p.vivoTodo2025===person.vivoTodo2025&&p.residenteIrpf===person.residenteIrpfTodo2025&&p.residenciaTodo2025===entry.comunidadAutonoma&&p.discapacidad._tag==='SinDiscapacidad'&&person.discapacidad==='ninguna','expediente-persona');
    need(p.declaracionObjetivo.modalidad===person.opcion&&p.declaracionObjetivo.unidadFamiliar===person.unidadId&&p.declaracionObjetivo.presentaIndividual===false&&person.declaracionSeparada==='ninguna'&&person.otraUnidad===false,'expediente-opcion');
    need(p.economia.censoRentasCompleto===true&&cents(p.economia.rentasExentasEUR)===0n,'expediente-censo-rentas');
    if(person.id===entry.economia.perceptorId) {
      equal(p.economia.trabajo,entry.economia.trabajo,'expediente-trabajo');
      equal(p.economia.retenciones,entry.economia.retenciones,'expediente-retenciones');
      equal(p.economia.conciliacion,entry.economia.conciliacion,'expediente-conciliacion');
    }else need(p.economia.perfil==='sin-rentas'&&cents(p.economia.rentasNoExentasEUR)===0n&&p.economia.retenciones.length===0,'expediente-sin-rentas');
  }
  need(h.alcanceEconomico.rentasOtrosMiembros==='ninguna'&&h.alcanceEconomico.capitalAhorroInmueblesActividadesGanancias==='ninguno'&&h.alcanceEconomico.deduccionesSolicitadas===entry.economia.deducciones,'expediente-alcance-economico');
  return true;
}
export function validateAuthorityAddition({fixtureBytes,expedienteBytes,authorityBytes,authoritySha256,authoritySources}) {
  need(authorityBytes&&hash(authorityBytes)===authoritySha256,'autoridad-v2-no-adicionada');
  const a=JSON.parse(authorityBytes),fixture=JSON.parse(fixtureBytes),entry=fixture.entradaCandidata;
  need(a.id===fixture.id&&a.naturaleza==='contrato-ficticio-sintetico'&&a.origen==='diseno-v2-anterior-a-captura'&&a.preservaHogarLegacy===true,'autoridad-v2-formato');
  need(a.expedienteOriginalSha256===hash(expedienteBytes)&&a.fixtureCapturadoSha256===hash(fixtureBytes),'autoridad-v2-originales');
  const source=authoritySources?.[a.disenoSha256];
  need(source&&hash(source)===a.disenoSha256,'autoridad-v2-fuente');
  const candidates=JSON.parse(source).cambios.filter(c=>c.idNuevo===fixture.id);
  need(candidates.length===1,'autoridad-v2-diseno');
  equal(a.diseno,candidates[0].nuevo.entradaTrabajoIndividualReferencia,'autoridad-v2-diseno');
  equal(a.entradaCandidata,entry,'autoridad-v2-entrada');
  equal(a.diseno.trabajo,entry.economia.trabajo,'autoridad-v2-trabajo');
  equal(a.diseno.retenciones,entry.economia.retenciones,'autoridad-v2-retenciones');
  need(a.diseno.comunidadAutonoma===entry.comunidadAutonoma&&a.diseno.ejercicio===entry.ejercicio,'autoridad-v2-territorio-ejercicio');
  return {estado:'adicion-documental-verificada',sha256:authoritySha256,cambio:candidates[0]};
}
// Proyección temporal de las únicas sustituciones documentadas. Los originales
// permanecen intactos y el resto del hogar pasa el mismo control que los demás.
export function validateReconciledHousehold(expediente,entry,cambio) {
  need(cambio.idAnterior==='open2025-aragon-02'&&cambio.idNuevo===entry.unidadId&&entry.unidadId==='open2025-aragon-02-v2','autoridad-hogar-identidad');
  const copy=structuredClone(expediente),before=cambio.original.entradaTrabajoIndividualReferencia,after=cambio.nuevo.entradaTrabajoIndividualReferencia;
  const p=copy.hogar.personas.find(p=>p.sujetoId===entry.economia.perceptorId);
  need(p&&p.economia.trabajo.rendimientos.length===1&&p.economia.retenciones.length===1,'autoridad-hogar-perceptor');
  equal(p.economia.trabajo,before.trabajo,'autoridad-hogar-trabajo-previo');
  equal(p.economia.retenciones,before.retenciones,'autoridad-hogar-retenciones-previas');
  p.economia.trabajo.rendimientos[0].integro=after.trabajo.rendimientos[0].integro;
  p.economia.trabajo.rendimientos[0].cotizaciones.seguridadSocial=after.trabajo.rendimientos[0].cotizaciones.seguridadSocial;
  p.economia.retenciones[0].importe=after.retenciones[0].importe;
  for(const person of copy.hogar.personas) {
    need(person.declaracionObjetivo.unidadFamiliar===cambio.idAnterior,'autoridad-hogar-unidad-previa');
    person.declaracionObjetivo.unidadFamiliar=cambio.idNuevo;
  }
  return validateHouseholdExpediente(copy,entry);
}
export function bindStrict({fixtureBytes,expedienteBytes,sesBytes,pdfBytes,referenceBytes,referenceSha256,readbacks,htmlByStep,money,moneySources,authorityBytes,authoritySources}) {
  need(hash(referenceBytes)===referenceSha256,'referencia-integridad');
  const ref=JSON.parse(referenceBytes), fixture=JSON.parse(fixtureBytes), entry=fixture.entradaCandidata;
  need(entry.tipoUnidad==='matrimonial','monoparental-sin-evidencia');
  need(ref.authority?.estado!=='conflicto-pendiente','autoridad-expediente-conflicto');
  need(hash(fixtureBytes)===ref.fixtureSha256 && hash(expedienteBytes)===fixture.sha256Expediente,'contrato-externo-integridad');
  const expediente=JSON.parse(expedienteBytes);
  if(ref.casePlan&&fixture.id!=='open2025-aragon-02-v2')validateHouseholdExpediente(expediente,entry);
  if(Object.hasOwn(expediente,'entradaCandidata'))equal(expediente.entradaCandidata,entry,'expediente-entrada');
  if(fixture.id==='open2025-aragon-02-v2') {
    const authority=validateAuthorityAddition({fixtureBytes,expedienteBytes,authorityBytes,authoritySha256:ref.authority?.sha256,authoritySources});
    validateReconciledHousehold(expediente,entry,authority.cambio);
  }
  need(fixture.id===ref.id,'referencia-caso');
  const decoded=inflateSync(sesBytes,{maxOutputLength:4194304}), ses=validateSES(decoded.toString('latin1'),ref,entry);
  const inventories=readbacks.filter(r=>Object.hasOwn(r,'controls'));
  equal(inventories.map(r=>({step:r.step,controls:controlsProjection(r.controls)})),ref.controls,'ui-censo-completo');
  equal(readbacks.filter(r=>!Object.hasOwn(r,'controls')),ref.actionObservations,'ui-solicitudes');
  for(const r of inventories) {
    const html=htmlByStep[r.step];need(Schema.is(Schema.String)(html),'ui-html-ausente');
    equal(catalogs(html),ref.catalogs[r.step],'catalogo-version');
    for(const c of r.controls)need(Schema.is(Schema.String)(c.id)&&html.includes('id="'+c.id+'"'),'ui-control-html');
  }
  const pdfSha256=validatePdf(pdfBytes,ses);
  need(pdfSha256===ref.pdfRowsSha256,'pdf-censo-completo');
  const pending=moneyEvidence(money,ses.amounts,hash(sesBytes),moneySources,{fixture,receiptSha256:ref.source.receiptSha256,rawBundleSha256:ref.source.rawBundleSha256});
  if(money)for(const r of money.filter(r=>r.schema!=='money-raw11-v1')) {
    const rows=ses.p.records.filter(x=>x.key===r.control);
    if(r.persistence.value===null)need(!rows.length && ['GCS','GCC','GDJ'].includes(r.control),'readback-cero-omitido');
    else need(rows.length===1 && rows[0].type==='1' && rows[0].value===r.persistence.value && ses.p.sections[rows[0].scope].name==='DLGTRABAJO','readback-ses-persistencia');
  }
  return {schema:'conjunta-binding-estricto-v1',id:fixture.id,estado:'pendiente',countedAsMatch:false,
    pendientes:pending,controlesMonetariosAportados:pending.length===0,
    promocion:'requiere-revision-y-validacion-de-fuentes-readback',pdfRowsSha256:pdfSha256,
    hechosExternos:{fixtureSha256:hash(fixtureBytes),expedienteSha256:hash(expedienteBytes),naturaleza:'contrato-ficticio-sintetico',observadoLegalmenteEnUI:false}};
}
