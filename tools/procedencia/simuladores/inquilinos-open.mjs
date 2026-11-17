import {Schema} from 'effect';
const isString=Schema.is(Schema.String);
const isRecord=Schema.is(Schema.Record(Schema.String,Schema.Unknown));
/** Vinculación factual sintética aislada. Sin integración ni ejecución fiscal. */
import {createHash} from 'node:crypto';
import {isDeepStrictEqual as equal} from 'node:util';
import {readFileSync} from 'node:fs';
import {accessSES} from './conjunta-ses.mjs';
import {rawPdfRows} from './conjunta-pdf.mjs';
import {decodificarPersistencia} from './vincular-open.mjs';

const pins = JSON.parse(readFileSync(new URL('./inquilinos-pins.json', import.meta.url)));
const need = (ok, code) => { if (!ok) throw Error(code); };
const sha = b => createHash('sha256').update(b).digest('hex');
const canonical = v => JSON.stringify(Array.isArray(v) ? v.map(x => JSON.parse(canonical(x)))
  : isRecord(v) ? Object.fromEntries(Object.keys(v).sort().map(k => [k, JSON.parse(canonical(v[k]))])) : v);
const digest = v => sha(canonical(v));

/** El contrato externo completo se entrega como bytes originales, no como resumen. */
export function prepararInquilinoMurcia(caso, fixture, contratoBytes) {
  need(caso?.id === pins.id && !Object.hasOwn(caso, 'entrada') && caso.modalidadObjetivo !== 'conjunta', 'inq-slot-o-entrada-ambiguos');
  need(sha(contratoBytes) === pins.contratoSha256, 'inq-contrato-externo-distinto');
  const contrato = JSON.parse(Buffer.from(contratoBytes).toString('utf8'));
  const rows = contrato.cases.filter(c => c.id === pins.id);
  need(rows.length === 1, 'inq-censo-contrato');
  const f = fixture.filter(c => c.id === pins.id);
  need(f.length === 1 && digest(f[0].entrada) === pins.entradaSha256, 'inq-fixture-distinto');
  need(equal(rows[0].entry, f[0].entrada) && digest(rows[0].housing) === pins.housingSha256, 'inq-hechos-externos-distintos');
  // La evidencia salarial previa no acredita alquiler; se fija todo el slot,
  // incluidos pesos, pendientes y resultado nulo, sin mutarlo para fingir captura.
  need(digest(caso) === pins.slotSha256 && digest(caso.entradaAPI) === pins.entradaSha256, 'inq-slot-vigente-distinto');
  const entradaAPI = structuredClone(f[0].entrada);
  need(entradaAPI.deduccionesTerritoriales2025?.solicitudes.length === 1
    && entradaAPI.deduccionesTerritoriales2025.solicitudes[0].codigo === 'murcia_arrendamiento_vivienda_habitual', 'inq-productor-incompleto');
  return {id: pins.id, entradaAPI, contratoExterno: structuredClone(rows[0].housing),
    estado: 'preparado-sin-captura', transportComplete: false, countedAsMatch: false, resultadoOpenEUR: null};
}

const signedCents = v => {
  need(isString(v) && /^-?\d+(?:\.\d{1,2})?$/.test(v), 'inq-importe-ausente-o-ambiguo');
  const negative = v.startsWith('-'), [a, b = ''] = v.replace(/^-/, '').split('.');
  const n = BigInt(a) * 100n + BigInt(b.padEnd(2, '0'));
  return negative ? -n : n;
};

/** Puente genérico entre lectores existentes. El descriptor debe fijarse en código
 * tras observar el SES/PDF final; nunca se acepta un descriptor del expediente.
 * Ausencia, duplicidad y tipo incorrecto se rechazan incluso para cero.
 */
export function conciliarMedidaObservada(ses, pdfRows, descriptor) {
  const {path, key, type, flag, box} = descriptor;
  need(isString(path) && isString(key) && type === '1' && flag === null
    && /^\d{4}$/.test(box), 'inq-descriptor-incompleto');
  const value = ses.row(ses.path(path), key, type, flag);
  const lines = pdfRows.filter(r => new RegExp(`\\s${box}\\s*$`).test(r.text));
  const match = lines.length === 1 && /(?:^|\s)(-?(?:\d{1,3}(?:\.\d{3})+|\d+),\d{2})\s+\d{4}\s*$/.exec(lines[0].text);
  need(match, 'inq-pdf-medida-no-unica');
  const pdfValue = match[1].replaceAll('.', '').replace(',', '.');
  need(signedCents(value) === signedCents(pdfValue), 'inq-importes-ses-pdf-distintos');
  return {ses: value, pdf: pdfValue, box};
}

// Candidato aislado. No se invoca desde vincular-open ni desde medir.
export const contratoRegionalMurcia = Object.freeze({habilitado: false,
  candidato: 'captura-final-fijada', limite: 'pendiente-integracion-y-validacion-del-padre'});

const finalDir = 'inquilinos-captura49/';
const salaryDir = 'inquilinos-inspeccion38/open2025-murcia-02/';
const rowValue = (ses, path, key, type = '1', flag = null) => ses.row(ses.path(path), key, type, flag);
const regionPath = 'DECLARACIONES/IRPF2025/MURCIA';
const taxPath = 'DECLARACIONES/IRPF2025';

/** Censo literal por instancia y descriptor fijado desde SES original, nunca del recibo. */
export function inspeccionarSESInquilinoMurcia(text) {
  const ses = accessSES(text);
  need(equal(ses.sections.map(s => s.path), pins.censo), 'inq-censo-ses-distinto');
  for (const d of pins.descriptores)
    need(rowValue(ses, d.path, d.key, d.type, d.flag) === d.value, 'inq-descriptor-ses-distinto');
  // No inferir cero/false de ausencia. La negativa de familia numerosa está
  // leída explícitamente en UI y en el contrato; no tiene descriptor SES aquí.
  const expectedRegionalKeys = ['IMP4AMU3','IMP2AMU3','IMP1MU14','NUM1MU14','NUMVHMU21',
    'IMP3AMU3','VNONIF1MU14','IMP1AMU3','DEDAUTMU','MU15','IMPMU19','MU11','MU14','NIF1MU14'];
  need(equal(ses.records.filter(r => r.scope === ses.path(regionPath).id).map(r => r.key).sort(),
    expectedRegionalKeys.sort()), 'inq-censo-regional-distinto');
  need(rowValue(ses,taxPath+'/ATRABAJO','TITA') === 'DECLARANTE'
    && signedCents(rowValue(ses,taxPath+'/ATRABAJO/DLGTRABAJO','IDII')) === 3000000n
    && signedCents(rowValue(ses,taxPath+'/ATRABAJO/DLGTRABAJO','GSS')) === 195000n
    && signedCents(rowValue(ses,taxPath+'/ATRABAJO/DLGTRABAJO','IDRE')) === 420000n,
  'inq-salarios-distintos');
  return ses;
}

function comprobarUI(load, preparado) {
  const readbacks = JSON.parse(load(finalDir+'alquiler-readbacks.json'));
  const housing = preparado.contratoExterno;
  need(equal(readbacks.externalFacts,housing) && readbacks.officialLegalVerification === false,
    'inq-externas-confundidas');
  const titles = {
    importe: 'Vivienda 1: Importe satisfecho que corresponde al contribuyente:',
    personas: 'Vivienda 1: Nº de personas con derecho a la deducción:',
    arrendador: 'Vivienda 1: NIF del arrendador:',
  };
  const observations = {importe: ['7.200,00','7200,00'], personas: ['1','1'], arrendador: ['90000001N','90000001N']};
  need(readbacks.monetary.length === 6 && readbacks.familyLarge === false
    && equal(readbacks.nifMapping,{'arrendador-ficticio':'90000001N'}), 'inq-readbacks-incompletos');
  for (const [key,title] of Object.entries(titles)) {
    const rs=readbacks.monetary.filter(r=>r.key===key);
    need(rs.length===2 && rs.every(r=>r.title===title)
      && rs[0].reopened===undefined && rs[1].reopened===true
      && equal(rs.map(r=>r.observed),observations[key]), 'inq-readback-distinto');
  }
  const census=readbacks.census;
  need(census.length===9,'inq-censo-ui-distinto');
  for (const title of Object.values(titles)) {
    const rs=census.filter(r=>r.title===title);
    need(rs.length===1 && !rs[0].disabled && !rs[0].readOnly,'inq-control-no-unico');
  }
  const second=census.filter(r=>r.title.startsWith('Vivienda 2:'));
  need(second.length===4 && second.every(r=>r.value===''),'inq-segunda-vivienda');
  const family=census.filter(r=>r.parentTitle==='Si forma parte de una familia numerosa, marque la casilla:');
  need(family.length===1 && family[0].type==='checkbox' && family[0].checked===false && !family[0].disabled,'inq-familia-no-explicita');
  // Los originales completos antes/aceptado/reabierto están exigidos por SHA;
  // el resumen de readbacks no puede reemplazarlos ni modificar su procedencia.
  const actions=JSON.parse(load(finalDir+'acciones.json'));
  const labels=['aceptar-alquiler','reabrir-alquiler','cerrar-alquiler-reabierto','exportar-ses','resumen','vista-previa'];
  let previous=-1;
  for(const label of labels){const indices=actions.actions.flatMap((a,i)=>a.label===label&&a.status==='completed'?[i]:[]);
    need(indices.length===1&&indices[0]>previous,'inq-cadena-temporal');previous=indices[0];}
  const receipt=JSON.parse(load(finalDir+'captura.json'));
  need(receipt.caseId===pins.id && receipt.seedSha256===pins.archivos[salaryDir+'parcial-trabajo.ses']
    && receipt.sesSha256===pins.archivos[finalDir+'exportado.ses']
    && receipt.pdfSha256===pins.archivos[finalDir+'exportado.pdf'], 'inq-recibo-desvinculado');
  const pagos=preparado.entradaAPI.deduccionesTerritoriales2025.solicitudes[0].hechos.pagos;
  need(pagos.length===12 && pagos.reduce((n,p)=>n+signedCents(p.importeEUR),0n)===720000n
    && pagos.every(p=>p.objetoId==='V'&&p.pagador==='s-1'&&p.beneficiarioId==='s-1'&&signedCents(p.ayudasEUR)===0n), 'inq-pagos-distintos');
}

/** El expediente es un mapa de bytes originales con nombres relativos. Ningún
 * flag, descriptor, resultado aportado o hash aportado habilita el candidato.
 * El éxito expresa una vinculación sintética; jamás cuenta una coincidencia.
 */
export function vincularInquilinoMurcia(preparado, evidencia) {
  try {
    need(preparado?.id===pins.id && digest(preparado.entradaAPI)===pins.entradaSha256
      && digest(preparado.contratoExterno)===pins.housingSha256,'inq-preparacion-distinta');
    need(evidencia?.files && equal(Object.keys(evidencia.files).sort(),Object.keys(pins.archivos).sort()),'inq-paquete-incompleto');
    const load = file => {
      const bytes=evidencia.files[file];
      need((Buffer.isBuffer(bytes)||bytes instanceof Uint8Array) && sha(bytes)===pins.archivos[file], 'inq-evidencia-hash-distinto');
      return Buffer.from(bytes);
    };
    // Verificar TODOS los originales antes de interpretar el primero.
    for(const file of Object.keys(pins.archivos)) load(file);
    const contract=JSON.parse(load('inquilinos-transporte38/inquilinos-transporte.json'));
    const external=contract.cases.filter(c=>c.id===pins.id);
    need(external.length===1 && equal(external[0].entry,preparado.entradaAPI)
      && equal(external[0].housing,preparado.contratoExterno),'inq-contrato-desvinculado');
    need(equal(JSON.parse(load(salaryDir+'entrada-intacta.json')),preparado.entradaAPI),'inq-semilla-entrada-distinta');
    comprobarUI(load,preparado);
    const ses=inspeccionarSESInquilinoMurcia(decodificarPersistencia(load(finalDir+'exportado.ses'),{}));
    // El PDF original es PDF-1.4 con tres páginas, ámbito del lector existente.
    // Si cambia el formato, fallar; no ampliar el parser por conjetura.
    const lectorPDF=rawPdfRows;
    const rows=lectorPDF(load(finalDir+'exportado.pdf'));
    const measures=[
      [regionPath,'IMP1MU14','1124'], [taxPath,'IMPTARR','1128'],
      [taxPath,'CANTARR1','1129'], [regionPath,'MU14','0991'],
      [taxPath,'IMPARR','1130'], [taxPath,'SUMADEDAUT','0564'],
      [taxPath,'CLIQEST','0570'], [taxPath,'CLIQAUT','0571'],
      [taxPath,'CLIQT','0587'], [taxPath,'PAGOS','0609'],
      [taxPath,'CDIF','0610'], [taxPath,'RESULTADO','0670'],
    ].map(([path,key,box])=>({key,...conciliarMedidaObservada(ses,rows,{path,key,box,type:'1',flag:null})}));
    need(signedCents(rowValue(ses,regionPath,'IMP1MU14'))===720000n,'inq-pago-ui-ses-distinto');
    const nifs=rows.filter(r=>/\s1122\s*$/.test(r.text));
    need(nifs.length===1 && /\s90000001N\s+1122\s*$/.test(nifs[0].text),'inq-arrendador-pdf-distinto');
    const resultado=measures.find(m=>m.box==='0670').pdf;
    return {estado:'entrada-ses-y-resultado-pdf-vinculados',tipoVinculo:'proyeccion-de-predicados-sinteticos',
      resultadoEUR:resultado,resultadoOpenEUR:null,transportComplete:false,countedAsMatch:false,
      sesSha256:pins.archivos[finalDir+'exportado.ses'],pdfSha256:pins.archivos[finalDir+'exportado.pdf'],
      medidas:measures,tenencia:'contrato-externo-sintetico-y-dialogo-regional-aceptado-reabierto',
      limite:'No acredita propiedad, dirección/catastro, hechos futuros ni autenticidad jurídica. Integración y medición pendientes.'};
  } catch(e) {
    return {estado:'no-verificado',motivo:/^inq-[a-z-]+$/.test(e?.message)?e.message:'inq-vinculo-fallo',
      transportComplete:false,countedAsMatch:false,resultadoOpenEUR:null};
  }
}
