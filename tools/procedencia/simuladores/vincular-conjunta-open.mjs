import {Schema} from 'effect';
// Fixtures exclusivamente sintéticos. Replay documental, sin motor fiscal.
import {readFileSync, realpathSync, statSync} from 'node:fs';
import {resolve, relative, isAbsolute} from 'node:path';
import {gzipSync, gunzipSync, inflateSync, deflateSync} from 'node:zlib';
import {bindStrict, canonical, equal, hash, need} from './conjunta-estricta.mjs';
import {adaptMoney11} from './conjunta-readbacks11.mjs';
import {accessSES} from './conjunta-ses.mjs';
import {spawnSync} from 'node:child_process';

export const schemaOpen = 'conjunta-open-lossless-v2';
const maxExpanded = 96 * 1024 * 1024;
const nameOK = n => Schema.is(Schema.String)(n) && /^[a-zA-Z0-9_.-]+$/.test(n) && n !== '.' && n !== '..';
const json = b => JSON.parse(b.toString('utf8'));
// La interfaz del compresor permite contrastar bibliotecas incompatibles sin
// sustituir módulos. Replay siempre utiliza las dependencias reales por defecto.
export function originalCompression(latin1,expectedHash, compressor = {
  native: deflateSync, execute: spawnSync, executable: process.env.C_SES_NODE ?? 'node',
}) {
  const native=compressor.native(latin1,{level:6});
  if(hash(native)===expectedHash)return native;
  // La versión de Node no fija su biblioteca de compresión. El entorno Nix
  // aporta una derivación exacta; stdin sólo contiene datos, nunca código.
  // Fuera de Nix, un compresor distinto sólo se acepta si reconstruye el SHA.
  const program="import{readFileSync}from'node:fs';import{deflateSync}from'node:zlib';process.stdout.write(deflateSync(readFileSync(0),{level:6}));";
  const run=compressor.execute(compressor.executable,['--input-type=module','-e',program],{input:latin1,timeout:10000,maxBuffer:4194304});
  need(!run.error&&run.status===0&&hash(run.stdout)===expectedHash,'open-ses-recompresion-no-exacta');
  return run.stdout;
}
export function readOpenRelative(base, name) {
  need(Schema.is(Schema.String)(name) && !isAbsolute(name) && !name.includes('\\') && name.split('/').every(nameOK), 'open-ruta');
  const root = realpathSync(base), file = realpathSync(resolve(root, name)), rel = relative(root, file);
  need(rel && !isAbsolute(rel) && rel !== '..' && !rel.startsWith('../'), 'open-fuera-base');
  const st = statSync(file);
  need(st.isFile() && st.size <= 16 * 1024 * 1024, 'open-tamano');
  return readFileSync(file);
}
function inventory(receipt) {
  need(Array.isArray(receipt.files), 'open-recibo');
  const pins = new Map();
  for (const p of receipt.files) {
    need(nameOK(p.file) && !pins.has(p.file), 'open-duplicado');
    need(Number.isSafeInteger(p.bytes) && p.bytes >= 0 && p.bytes <= 16 * 1024 * 1024 && /^[a-f0-9]{64}$/.test(p.sha256), 'open-pin');
    pins.set(p.file, p);
  }
  return pins;
}
// Exact closure of the existing semantic readers. No cropped DOM, census or PDF.
export function necessaryOpen(receipt, readbacks) {
  const pins = inventory(receipt);
  need(Array.isArray(readbacks), 'open-readbacks');
  const names = new Set(['acciones.json', 'readbacks.json', 'inicio-declaracion.json',
    'detalle-IDICLDED2.json', 'detalle-GSSCLDED2.json', 'exportado.ses', 'exportado.pdf']);
  const steps = new Set();
  for (const r of readbacks.filter(r => Object.hasOwn(r, 'controls'))) {
    need(Number.isSafeInteger(r.step) && r.step > 0 && !steps.has(r.step), 'open-step');
    steps.add(r.step);
    const matches = [...pins.keys()].filter(n => n.startsWith(String(r.step).padStart(3, '0') + '-') && n.endsWith('.html'));
    need(matches.length === 1, 'open-html-no-unico'); names.add(matches[0]);
  }
  for (const n of names) need(pins.has(n), 'open-fuente-ausente');
  return [...names].sort();
}
function checkedFiles(receipt, files, names) {
  const pins = inventory(receipt);
  equal(Object.keys(files).sort(), [...names].sort(), 'open-cierre');
  for (const n of names) {
    const p = pins.get(n), b = files[n];
    need(p && Buffer.isBuffer(b) && b.length === p.bytes && hash(b) === p.sha256, 'open-fuente-integridad');
  }
}
function htmlSources(receipt, readbacks, files) {
  return Object.fromEntries(readbacks.filter(r => Object.hasOwn(r, 'controls')).map(r => {
    const names = receipt.files.filter(f => f.file.startsWith(String(r.step).padStart(3, '0') + '-') && f.file.endsWith('.html'));
    need(names.length === 1, 'open-html-no-unico');
    const bytes = files[names[0].file], text = bytes.toString('utf8');
    need(Buffer.from(text, 'utf8').equals(bytes), 'open-html-utf8');
    return [r.step, text];
  }));
}
const semanticMoney = money => money.map(r => Object.fromEntries(Object.entries(r).filter(([key]) => key !== 'rawBundleSha256')));
function argumentsStrict({fixtureBytes, expedienteBytes, referenceBytes, referenceSha256, authorityBytes, authoritySources}, receipt, files) {
  const readbacks = json(files['readbacks.json']);
  return {fixtureBytes, expedienteBytes, referenceBytes, referenceSha256, authorityBytes, authoritySources,
    sesBytes: files['exportado.ses'], pdfBytes: files['exportado.pdf'], readbacks,
    htmlByStep: htmlSources(receipt, readbacks, files)};
}
function checkedContext(c, receiptBytes) {
  need(Buffer.isBuffer(c.referenceBytes) && hash(c.referenceBytes) === c.referenceSha256, 'open-referencia');
  const ref = json(c.referenceBytes), fixture = json(c.fixtureBytes);
  need(ref.casePlan && ref.casePlan.id === ref.id, 'open-plan');
  equal(ref.casePlan.fixture, fixture, 'open-plan-fixture');
  need(hash(receiptBytes) === ref.source.receiptSha256, 'open-recibo-integridad');
  const receipt = json(receiptBytes);
  need(receipt.id === fixture.id && receipt.id === ref.id, 'open-caso');
  return {ref, receipt};
}

// Called only by the private materializer with EVERY inventoried original byte.
// A receipt saying approved is never used as a semantic verdict.
export function deriveOpen(context, receiptBytes, allFiles) {
  const {ref, receipt} = checkedContext(context, receiptBytes);
  checkedFiles(receipt, allFiles, receipt.files.map(f => f.file));
  const args = argumentsStrict(context, receipt, allFiles);
  const original = adaptMoney11({casePlan: ref.casePlan, receiptBytes, files: allFiles});
  const strict = bindStrict({...args, ...original});
  need(strict.controlesMonetariosAportados && strict.pendientes.length === 0, 'open-original-incompleto');
  const names = necessaryOpen(receipt, args.readbacks);
  const files = Object.fromEntries(names.map(n => [n, allFiles[n]]));
  const projectedReceiptBytes = Buffer.from(canonical({...receipt, files: receipt.files.filter(f => names.includes(f.file))}));
  const projected = adaptMoney11({casePlan: ref.casePlan, receiptBytes: projectedReceiptBytes, files});
  equal(semanticMoney(original.money), semanticMoney(projected.money), 'open-proyeccion-semantica');
  const latin1 = inflateSync(files['exportado.ses'], {maxOutputLength: 4194304});
  const sesText = latin1.toString('latin1');
  need(originalCompression(latin1,hash(files['exportado.ses'])).equals(files['exportado.ses']),'open-ses-recompresion-no-exacta');
  const encode = b => b.toString('base64');
  const payload = {schema: schemaOpen, naturaleza: 'fixture-exclusivamente-sintetico',
    receipt: encode(receiptBytes), fixture: encode(context.fixtureBytes), expediente: encode(context.expedienteBytes),
    files: Object.fromEntries(names.filter(n=>n!=='exportado.ses').map(n => [n, encode(files[n])])),
    ses: {utf8: sesText, compression:'zlib-level6-byte-identical', latin1Sha256: hash(latin1), compressedSha256: hash(files['exportado.ses'])},
    authority: context.authorityBytes ? encode(context.authorityBytes) : null,
    authoritySources: Object.fromEntries(Object.entries(context.authoritySources ?? {}).map(([h,b]) => [h,encode(b)]))};
  const bytes = gzipSync(Buffer.from(canonical(payload)), {level: 9});
  // Public replay is also mandatory during materialization. No stored success flag.
  replayOpenBytes(bytes, {referenceBytes: context.referenceBytes, referenceSha256: context.referenceSha256,
    fixtureBytes: context.fixtureBytes});
  return {bytes, derivation: {schema: 'conjunta-open-derivacion-privada-v1', id: ref.id,
    sourceReceiptSha256: hash(receiptBytes), referenceSha256: context.referenceSha256,
    packageSha256: hash(bytes), packageBytes: bytes.length,
    originalBytes: receipt.files.reduce((n,f) => n + f.bytes, 0),
    retainedBytes: names.reduce((n,k) => n + files[k].length, 0),
    retained: names.map(n => ({...receipt.files.find(f => f.file === n)})),
    omitted: receipt.files.filter(f => !names.includes(f.file)).map(f => ({...f})),
    comparison: 'cinco-controles-iguales-excepto-descriptor-de-bundle', countedAsMatch: false}};
}

// The reference and fixture are supplied by the caller's trusted inventory, NOT
// selected by package content. Their hashes establish integrity, not authenticity.
export function replayOpenBytes(bytes, {referenceBytes, referenceSha256, fixtureBytes}) {
  need(Buffer.isBuffer(bytes) && bytes.length <= 16 * 1024 * 1024, 'open-paquete-tamano');
  const p = json(gunzipSync(bytes, {maxOutputLength: maxExpanded}));
  need(p.schema === schemaOpen && p.naturaleza === 'fixture-exclusivamente-sintetico', 'open-schema');
  const decode = s => {need(Schema.is(Schema.String)(s) && s.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(s), 'open-base64'); const b = Buffer.from(s, 'base64'); need(b.toString('base64') === s, 'open-base64'); return b;};
  const embeddedFixture = decode(p.fixture);
  need(Buffer.isBuffer(fixtureBytes) && embeddedFixture.equals(fixtureBytes), 'open-entrada-esperada');
  const context = {fixtureBytes: embeddedFixture, expedienteBytes: decode(p.expediente), referenceBytes, referenceSha256,
    authorityBytes: p.authority === null ? undefined : decode(p.authority),
    authoritySources: Object.fromEntries(Object.entries(p.authoritySources).map(([h,b]) => [h,decode(b)]))};
  const receiptBytes = decode(p.receipt), {ref,receipt} = checkedContext(context, receiptBytes);
  const files = Object.fromEntries(Object.entries(p.files).map(([n,b]) => [n,decode(b)]));
  need(!Object.hasOwn(files,'exportado.ses')&&p.ses.compression==='zlib-level6-byte-identical','open-ses-transporte');
  need(Schema.is(Schema.String)(p.ses.utf8) && [...p.ses.utf8].every(c => c.codePointAt(0) <= 255), 'open-ses-latin1');
  const latin1=Buffer.from(p.ses.utf8,'latin1');
  need(latin1.length<=4194304&&hash(latin1)===p.ses.latin1Sha256,'open-ses-derivacion');
  files['exportado.ses']=originalCompression(latin1,p.ses.compressedSha256);
  need(hash(files['exportado.ses'])===p.ses.compressedSha256,'open-ses-recompresion-no-exacta');
  const names = necessaryOpen(receipt, json(files['readbacks.json']));
  checkedFiles(receipt, files, names);
  need(hash(files['exportado.ses']) === ref.source.sesSha256 && hash(files['exportado.pdf']) === ref.source.pdfSha256, 'open-exportaciones');
  const decoded = inflateSync(files['exportado.ses'], {maxOutputLength: 4194304});
  need(Schema.is(Schema.String)(p.ses.utf8) && [...p.ses.utf8].every(c => c.codePointAt(0) <= 255), 'open-ses-latin1');
  need(Buffer.from(p.ses.utf8, 'latin1').equals(decoded) && hash(decoded) === p.ses.latin1Sha256 && hash(files['exportado.ses']) === p.ses.compressedSha256, 'open-ses-derivacion');
  const args = argumentsStrict(context, receipt, files);
  // No change to bindStrict or its source hashes; the original full-bundle proof
  // cannot be replayed without the omitted bytes. Keep that limitation explicit.
  const base = bindStrict(args);
  const projectedReceiptBytes = Buffer.from(canonical({...receipt, files: receipt.files.filter(f => names.includes(f.file))}));
  const {money} = adaptMoney11({casePlan: ref.casePlan, receiptBytes: projectedReceiptBytes, files});
  need(money.length === 5, 'open-cinco-controles');
  const ses = accessSES(decoded.toString('latin1'));
  const resultado = ses.row(ses.instance('IRPF2025','TITULAR','CONJUNTA'),'RESULTADO');
  need(/^-?\d+(?:\.\d{1,2})?$/.test(resultado),'open-resultado-decimal');
  const [entero,fraccion=''] = resultado.split('.');
  return {...base, schema: 'conjunta-binding-open-v1', estado: 'pendiente', countedAsMatch: false,
    resultadoConjuntaEUR: entero+'.'+fraccion.padEnd(2,'0'),
    controlesMonetariosReplay: semanticMoney(money),
    replayFuentesRetenidas: 'verificado-con-verificadores-existentes',
    procedenciaOriginales: 'requiere-cotejo-privado-de-derivacion',
    // base.pendientes and controlesMonetariosAportados stay as reported by strict:
    // this is deliberately not a substitute for verifyMoney11(full raw bundle).
    promocion: 'requiere-integracion-sanitizacion-y-validacion-privada',
    origen: {receiptSha256: hash(receiptBytes), sesLatin1Sha256: hash(decoded), packageSha256: hash(bytes)}};
}
export function loadOpen(base, name, trusted) {
  return replayOpenBytes(readOpenRelative(base, name), trusted);
}

// El anclaje público fija la referencia revisada. El recibo del paquete no
// decide la admisión y el resultado fiscal se compara fuera de este verificador.
export function vincularConjuntaOpen(caso, base) {
  try {
    const ev=caso.evidenciaOpen?.conjunta;
    need(ev&&Schema.is(Schema.String)(ev.archivo)&&/^[a-f0-9]{64}$/.test(ev.sha256),'open-evidencia');
    const refs=caso.integridadReferencias?.referencias??[];
    need(refs.filter(r=>r.archivo===ev.archivo&&r.sha256===ev.sha256).length===1,'open-referencia-paquete');
    const index=json(readFileSync(new URL('./conjunta-referencias/index.json',import.meta.url)));
    const pins=index.cases.filter(p=>p.id===caso.id);
    need(pins.length===1&&!index.excluded.some(p=>p.id===caso.id),'open-caso-no-admitido');
    const pin=pins[0];need(nameOK(pin.file),'open-referencia-ruta');
    const referenceBytes=readFileSync(new URL('./conjunta-referencias/'+pin.file,import.meta.url));
    need(hash(referenceBytes)===pin.sha256,'open-referencia');
    const ref=json(referenceBytes),fixtureBytes=Buffer.from(JSON.stringify(ref.casePlan.fixture));
    equal(caso.entradaAPI,ref.casePlan.fixture.entradaCandidata,'open-entrada-distinta');
    const bytes=readOpenRelative(base,ev.archivo);need(hash(bytes)===ev.sha256,'open-paquete-integridad');
    const result=replayOpenBytes(bytes,{referenceBytes,referenceSha256:pin.sha256,fixtureBytes});
    need(result.replayFuentesRetenidas==='verificado-con-verificadores-existentes'&&result.controlesMonetariosReplay.length===5,'open-replay-incompleto');
    need(result.resultadoConjuntaEUR===caso.resultadoOpenEUR,'open-resultado-distinto');
    return {...result,estado:'transporte-conjunta-ses-pdf-vinculado',
      controlesMonetariosReplayAportados:true,
      pendientesOriginales:result.pendientes,
      controlesMonetariosOriginalesAportados:result.controlesMonetariosAportados,
      procedenciaOriginales:'Fuentes necesarias cotejadas con el recibo anclado; archivos auxiliares omitidos no reproducidos',
      alcance:'Fuentes necesarias retenidas y contratos sintéticos; no autentica hechos legales ni reproduce archivos auxiliares omitidos',
      promocion:'comparacion-fiscal-separada'};
  }catch(e){
    return {estado:'no-verificado',countedAsMatch:false,motivo:e instanceof Error&&/^[a-z0-9-]+$/.test(e.message)?e.message:'open-vinculo-fallo'};
  }
}
