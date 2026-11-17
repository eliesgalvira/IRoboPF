/** Vínculo documental cerrado. No ejecuta el motor ni modifica evidencia. */
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateSESContract} from './prospectivos-estructura.mjs';
import {parseSES} from './dt18-ses.mjs';
import {validatePdf} from './prospectivos-pdf.mjs';
import {rawPdfRows} from './prospectivos-pdf-reader.mjs';
import * as core from './prospectivos-core.mjs';
import {bind,transportsSES} from './prospectivos-ses.mjs';
import {need,hash,equal,read,reconstruct,gh,at,decimal,same,sub} from './prospectivos-core.mjs';
const prefix='docs/procedencia/simuladores/alquiler-prospectivo-2025/';
const fixturePath='tests/fixtures/alquiler-prospectivo-2025.json';
const own=['prospectivos-estructura.mjs',"prospectivos-ses.mjs","prospectivos-ses.test.mjs",'prospectivos-core.mjs','prospectivos-pdf.mjs','prospectivos-checker.mjs','prospectivos-censo.json','prospectivos-adversos.test.mjs','PROSPECTIVOS-CHECKER.md','prospectivos-pdf-reader.mjs','dt18-ses.mjs','vincular-conjunta-open.mjs','conjunta-estricta.mjs','conjunta-ses.mjs','conjunta-readbacks11.mjs'];
const keys={base:'baseImponibleGeneral',trabajo:'rendimientoNetoTrabajo',retenciones:'retenciones',diferencial:'cuotaDiferencial',porcentaje:'politicaOpen/porcentaje',amortizacion:'politicaOpen/amortizacion',rnr:'politicaOpen/netoReducido',deduccionMadrid:'composicion/deduccionesAutonomicasAplicadas'};
const gravamenes={generalEstatal:'cuotaIntegraGeneralEstatal',generalAutonomico:'cuotaIntegraGeneralAutonomica',minimoEstatal:'cuotaMinimoPersonalEstatal',minimoAutonomico:'cuotaMinimoPersonalAutonomica'};
export function check(root){
 const c=JSON.parse(read(root,'tools/procedencia/simuladores/prospectivos-censo.json'));
 need(c.schema===1&&equal(c.observaciones.map(o=>o.id),['andalucia-01','madrid-01','madrid-02','asturias-01']),'contrato-censo');
 const seals=[];for(const[n,pin]of Object.entries(c.files)){read(root,n,pin);seals.push({archivo:n,...pin});}
 const json=n=>JSON.parse(read(root,n,c.files[n]));
 const m=json(prefix+'MANIFIESTO.json'),fixture=json(fixturePath),observaciones=[];
 need(m.schema===1&&m.cohorteProspectiva===4&&equal(m.pendientes,[])&&m.gatePublico===false&&fixture.length===4&&m.observaciones.length===4,'cohorte');
 need(new Set(fixture.map(x=>x.id)).size===4,'fixture-ids');
 for(const o of c.observaciones){
  const dir=prefix+o.id+'/',H=json(dir+'escenario-previo.json'),P=json(dir+'prediccion-previa.json'),S=json(dir+'captura-ses.json'),recibo=json(dir+'recibo.json'),obs=m.observaciones.find(x=>x.id===o.id),F=fixture.find(x=>x.id===o.fixtureId);
  need(obs&&equal(recibo,obs)&&obs.peso===null&&equal(obs.contadorOriginal,{coincidentes:76,total:80,modificado:false}),'recibo-manifiesto');
  need(obs.archivos.length===4&&new Set(obs.archivos.map(a=>a.archivo)).size===4,'archivos-censo');
  for(const a of obs.archivos){need(a.archivo.startsWith(o.id+'/'),'archivo-ambito');read(root,prefix+a.archivo,a);}
  need(F&&H.id===F.id&&equal(F.entrada,H.entrada)&&P.escenarioSHA256===hash(read(root,dir+'escenario-previo.json')),'H-P-fixture');
  need(P.at===o.fechaRegistrada&&Number.isFinite(Date.parse(P.at)),'fecha-registrada');
  for(const[k,loc]of Object.entries(keys))need(same(decimal(k==='deduccionMadrid'?(F.referenciaPrevia.deduccionAutonomica??F.referenciaPrevia.deduccionMadrid):F.referenciaPrevia[k]),decimal(String(at(P.result,loc)))),'fixture-P:'+k);
  for(const[k,loc]of Object.entries(gravamenes))need(same(decimal(F.referenciaPrevia.gravamenes[k]),decimal(P.result.composicion[loc])),'fixture-gravamen');
  need(F.integridad.escenarioPrevioSHA256===P.escenarioSHA256&&F.integridad.sesSHA256===S.sesSHA256&&F.integridad.pdfSHA256===hash(read(root,dir+'captura.pdf')),'fixture-sellos');
  const ses=reconstruct(S),original=obs.archivos.find(a=>a.originalReconstruido)?.originalReconstruido;
  need(original&&original.archivo===o.id+'/captura.ses'&&ses.length===original.bytes&&hash(ses)===original.sha256,'ses-manifiesto');
  const parsed=parseSES(S.contenido);validateSESContract(o,parsed);
  need(equal(parsed.sections,o.sections)&&equal(parsed.records,o.records)&&o.rules.length===parsed.records.length,'SES-censo-completo');
  need(equal(S.transportesInternos,o.transportes),'transportes-contrato');transportsSES(S,parsed.records,core);
  const reservas=[];
  for(let i=0;i<parsed.records.length;i++)if(!bind(parsed.records[i],o.rules[i],{H,P},core))reservas.push({ambito:parsed.records[i].path,campo:parsed.records[i].key,motivo:o.rules[i].motivo});
  const rows=rawPdfRows(read(root,dir+'captura.pdf'),{pages:5,positions:true});
  const pdf=validatePdf(rows,o.pdf,H,P);
  const coste=parsed.records.find(r=>r.path==='DECLARACIONES/IRPF2025/INMUEBLES'&&r.key==='C_BASEAMOR');need(coste,'coste-ausente');const GH=gh(H,P,coste.value);
  need(GH.igualdadExacta===(o.id!=='madrid-02'),'intermedio-estado');
  if(o.id==='madrid-02')need(same(sub(decimal(P.result.politicaOpen.costeOperativo),decimal(coste.value)),decimal('0.00004')),'intermedio-diferencia');
  if(o.id.startsWith('madrid'))need(H.entrada.madridArrendador2025?.contratoId===H.entrada.inmuebles[0].contrato.id&&H.entrada.madridArrendador2025?.resguardo?.inmuebleId==='V'&&P.result.politicaOpen.gastos==='1000'&&P.result.composicion.deduccionesAutonomicasAplicadas==='100','madrid-gasto-deduccion');
  if(o.id==='asturias-01'){
   const a=H.entrada.asturiasArrendador2025,i=H.entrada.inmuebles[0];
   need(a?.origen==='serpavi_excluido_tipologia'&&a.tipologia==='unifamiliar'&&a.acreditacion.tipologia==='unifamiliar'&&a.acreditacion.inmuebleId===i.id&&a.acreditacion.catastro===i.catastro,'asturias-tipologia');
   need(a.inmuebleId===i.id&&a.propietario===H.entrada.contribuyenteId&&a.titulo===i.titulo&&a.catastro===i.catastro&&a.localizacion.comunidad==='asturias'&&a.localizacion.municipio==='33044'&&a.municipio==='33044','asturias-identidad-localizacion');
   need(a.contrato.id===i.contrato.id&&a.contrato.documento===i.contrato.documento&&a.contrato.firma===i.contrato.firma&&a.contrato.regimen==='LAU-articulo-2'&&a.rendimiento==='capital_inmobiliario','asturias-contrato');
   need(a.censo.otrosIncentivos==='ninguno'&&a.censo.otrosPagadores==='ninguno'&&a.censo.otrosGastosElegibles==='ninguno'&&a.censo.otrosInmuebles==='ninguno','asturias-censo');
   need(a.pagos.length===1&&a.pagos[0].gastoId===i.gastos[0].id&&a.pagos[0].pagador===H.entrada.contribuyenteId&&P.result.politicaOpen.gastos==='1000'&&P.result.composicion.deduccionesAutonomicasAplicadas==='500','asturias-gasto-deduccion');
  }
  observaciones.push({id:o.id,comparable:reservas.length===0,GH,pdf,reservas,fechaRegistrada:P.at,anterioridadIndependiente:false,secuenciaUIReproducida:false,tentativaUnicaAcreditada:false,incidencias:o.incidencias,peso:null});
 }
 for(const n of own){const archivo='tools/procedencia/simuladores/'+n,b=read(root,archivo);seals.push({archivo,bytes:b.length,sha256:hash(b)});}
 for(const archivo of ['package.json','bun.lock','tools/procedencia/flake.nix','tools/procedencia/flake.lock']){const b=read(root,archivo);seals.push({archivo,bytes:b.length,sha256:hash(b)});}
 for(const s of seals)read(root,s.archivo,s);
 const comparables=observaciones.filter(x=>x.comparable).length;
 return {schema:1,disponibles:4,seleccionados:4,pendientes:[],cohorteCompleta:true,comparables,denominadorComparables:4,igualdadIntermediaExacta:3,denominadorIntermedios:4,condicion:'hechos externos H',original:{iguales:76,N:80,modificado:false},ponderacion:null,observaciones,sellos:seals,gateHabilitado:comparables===4};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const r=check(process.cwd());console.log(JSON.stringify(r,null,2));if(!r.gateHabilitado)process.exitCode=2;}catch{console.error('prospectivos-documental-rechazado');process.exitCode=1;}
}
