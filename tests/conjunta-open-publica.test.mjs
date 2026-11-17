// Replay y adversas de capturas exclusivamente sintéticas, sin motor fiscal.
import {test} from 'vitest';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {gzipSync, gunzipSync, deflateSync} from 'node:zlib';
import {canonical, hash} from '../tools/procedencia/simuladores/conjunta-estricta.mjs';
import {necessaryOpen, replayOpenBytes, vincularConjuntaOpen} from '../tools/procedencia/simuladores/vincular-conjunta-open.mjs';

const bytes = Buffer.from('synthetic');
const pin = file => ({file, bytes: bytes.length, sha256: hash(bytes)});
const required = ['acciones.json','readbacks.json','inicio-declaracion.json','detalle-IDICLDED2.json','detalle-GSSCLDED2.json','exportado.ses','exportado.pdf'];
test('closure keeps all inventory HTML and excludes screenshot/network bytes', () => {
  const receipt = {files: [...required,'001-accion.html','002-accion.html','foto.png','red-observada.json'].map(pin)};
  assert.deepEqual(necessaryOpen(receipt, [{step:1,controls:[]},{step:2,controls:[]}]), [...required,'001-accion.html','002-accion.html'].sort());
});
test('reject duplicate files, ambiguous HTML, repeated steps, missing sources', () => {
  const receipt = {files: [...required,'001-accion.html'].map(pin)};
  assert.throws(() => necessaryOpen({...receipt,files:[...receipt.files,pin('acciones.json')]}, []), /open-duplicado/);
  assert.throws(() => necessaryOpen({...receipt,files:[...receipt.files,pin('001-otro.html')]}, [{step:1,controls:[]}]), /open-html-no-unico/);
  assert.throws(() => necessaryOpen(receipt, [{step:1,controls:[]},{step:1,controls:[]}]), /open-step/);
  assert.throws(() => necessaryOpen({files:receipt.files.slice(1)}, []), /open-fuente-ausente/);
});

const references=new URL('../tools/procedencia/simuladores/conjunta-referencias/',import.meta.url);
const index=JSON.parse(readFileSync(new URL('index.json',references)));
for(const pin of index.cases)test('replay y adversas '+pin.id,()=>{
  const original=readFileSync(new URL('../docs/procedencia/simuladores/medicion-2025/conjuntas-oficiales/'+pin.id+'.json.gz',import.meta.url));
  const referenceBytes=readFileSync(new URL(pin.file,references)),ref=JSON.parse(referenceBytes);
  const trusted={referenceBytes,referenceSha256:pin.sha256,fixtureBytes:Buffer.from(JSON.stringify(ref.casePlan.fixture))};
  const baseline = replayOpenBytes(original, trusted);
  assert.equal(baseline.countedAsMatch, false);
  assert.equal(baseline.estado, 'pendiente');
  assert.equal(baseline.controlesMonetariosAportados, false);
  assert.equal(baseline.controlesMonetariosReplay.length, 5);
  const archivo='conjuntas-oficiales/'+pin.id+'.json.gz';
  const base=fileURLToPath(new URL('../docs/procedencia/simuladores/medicion-2025/',import.meta.url));
  const caso={id:pin.id,entradaAPI:ref.casePlan.fixture.entradaCandidata,
    resultadoOpenEUR:baseline.resultadoConjuntaEUR,
    evidenciaOpen:{conjunta:{archivo,sha256:hash(original)}},
    integridadReferencias:{referencias:[{archivo,sha256:hash(original)}]}};
  const linked=vincularConjuntaOpen(caso,base);
  assert.equal(linked.estado,'transporte-conjunta-ses-pdf-vinculado');
  assert.equal(linked.countedAsMatch,false);
  assert.equal(linked.controlesMonetariosReplayAportados,true);
  assert.equal(linked.controlesMonetariosOriginalesAportados,false);
  assert.equal(linked.controlesMonetariosAportados,false);
  assert.deepEqual(linked.pendientesOriginales,['GCS','GCC','GDJ','IDICLDED2','GSSCLDED2']);
  assert.deepEqual(linked.pendientes,linked.pendientesOriginales);
  const changedInput=structuredClone(caso);
  changedInput.entradaAPI.declarante.fechaNacimiento='1984-01-01';
  assert.equal(vincularConjuntaOpen(changedInput,base).motivo,'open-entrada-distinta');
  assert.equal(vincularConjuntaOpen({...caso,resultadoOpenEUR:'999999999.00'},base).motivo,'open-resultado-distinto');
  assert.equal(vincularConjuntaOpen({...caso,id:'open2025-no-admitido'},base).motivo,'open-caso-no-admitido');
  const source = JSON.parse(gunzipSync(original));
  const encode = p => gzipSync(Buffer.from(canonical(p)), {level:9});
  const changed = fn => {const p = structuredClone(source); fn(p); return encode(p);};
  const reject = (fn, pattern) => assert.throws(() => replayOpenBytes(changed(fn), trusted), pattern);
  reject(p => {p.receipt = Buffer.from('{"estado":"aprobado","files":[]}').toString('base64');}, /open-recibo-integridad/);
  reject(p => {delete p.files['detalle-IDICLDED2.json'];}, /open-cierre/);
  reject(p => {p.files['foto.png'] = bytes.toString('base64');}, /open-cierre/);
  reject(p => {p.files['exportado.pdf'] = bytes.toString('base64');}, /open-fuente-integridad/);
  reject(p => {p.files['exportado.ses'] = bytes.toString('base64');}, /open-ses-transporte/);
  reject(p => {p.ses.compression='zlib-level9';}, /open-ses-transporte/);
  reject(p => {p.ses.compressedSha256='0'.repeat(64);}, /open-ses-recompresion-no-exacta/);
  reject(p => {p.ses.utf8 += '\nEXTRA';}, /open-ses-derivacion/);
  reject(p => {p.ses.utf8 += '\u0100';}, /open-ses-latin1/);
  reject(p => {p.fixture = bytes.toString('base64');}, /open-entrada-esperada/);
  reject(p => {p.expediente = Buffer.from('{}').toString('base64');}, /contrato-externo-integridad/);
  reject(p => {const n = Object.keys(p.files).find(n=>n.endsWith('.html')); delete p.files[n];}, /open-cierre/);
  assert.throws(() => replayOpenBytes(original, {...trusted, referenceSha256:'0'.repeat(64)}), /open-referencia/);
  // Rehash package and editable metadata: reference receipt pin still rejects.
  reject(p => {
    const r = JSON.parse(Buffer.from(p.receipt,'base64'));
    const raw = JSON.parse(Buffer.from(p.files['readbacks.json'],'base64'));
    const c = raw.find(r=>r.controls?.some(c=>c.type==='text')).controls.find(c=>c.type==='text');
    c.value = '999,99';
    const b = Buffer.from(JSON.stringify(raw)); p.files['readbacks.json'] = b.toString('base64');
    Object.assign(r.files.find(f=>f.file==='readbacks.json'),{bytes:b.length,sha256:hash(b)});
    p.receipt = Buffer.from(JSON.stringify(r)).toString('base64');
  }, /open-recibo-integridad/);
  // Deliberately update editable hashes AND the test's reference pin to cross
  // the integrity gate and exercise semantic rejection, not just hash checks.
  const semanticReject = (edit, pattern) => {
    const p = structuredClone(source), ref = JSON.parse(trusted.referenceBytes);
    const r = JSON.parse(Buffer.from(p.receipt,'base64'));
    edit(p, ref);
    for (const f of r.files) if (Object.hasOwn(p.files,f.file)||f.file==='exportado.ses') {
      const b = f.file==='exportado.ses'?deflateSync(Buffer.from(p.ses.utf8,'latin1'),{level:6}):Buffer.from(p.files[f.file],'base64'); Object.assign(f,{bytes:b.length,sha256:hash(b)});
    }
    p.receipt = Buffer.from(JSON.stringify(r)).toString('base64');
    ref.source.receiptSha256 = hash(Buffer.from(p.receipt,'base64'));
    ref.source.sesSha256 = p.ses.compressedSha256;
    ref.source.pdfSha256 = hash(Buffer.from(p.files['exportado.pdf'],'base64'));
    const referenceBytes = Buffer.from(JSON.stringify(ref));
    assert.throws(() => replayOpenBytes(encode(p), {...trusted,referenceBytes,referenceSha256:hash(referenceBytes)}), pattern);
  };
  semanticReject(p => {
    const b = JSON.parse(Buffer.from(p.files['readbacks.json'],'base64'));
    b.find(r=>r.controls?.some(c=>c.type==='text')).controls.find(c=>c.type==='text').value='999,99';
    p.files['readbacks.json']=Buffer.from(JSON.stringify(b)).toString('base64');
  }, /ui-censo-completo/);
  semanticReject(p => {
    const b = JSON.parse(Buffer.from(p.files['acciones.json'],'base64'));
    b.find(a=>a.key==='GCS'&&a.op==='type').value='1,00';
    p.files['acciones.json']=Buffer.from(JSON.stringify(b)).toString('base64');
  }, /acciones-plan/);
  semanticReject(p => {
    const b = JSON.parse(Buffer.from(p.files['detalle-IDICLDED2.json'],'base64'));
    b[0].html=b[0].html.replace('Importe íntegro:','Otra magnitud:');
    p.files['detalle-IDICLDED2.json']=Buffer.from(JSON.stringify(b)).toString('base64');
  }, /detalle-semantica/);
  const mutateSES = (p, mutate) => {
    const before = p.ses.utf8;
    const after = mutate(before); assert.notEqual(after,before);
    const raw = Buffer.from(after,'latin1'), compressed=deflateSync(raw);
    p.ses={utf8:after,compression:'zlib-level6-byte-identical',latin1Sha256:hash(raw),compressedSha256:hash(compressed)};
  };
  semanticReject(p => mutateSES(p,s=>s.replace(/(CAC_D~1~)\d+/, '$199')), /ses-censo-cerrado/);
  semanticReject(p => mutateSES(p,s=>s.replace(/^ *GSS~1~[^\n]+\n/m,'')), /ses-censo-cerrado/);
  // An unrecognized success receipt is inert; only actual facts are replayed.
  const inert = changed(p => {p.veredicto={estado:'aprobado',countedAsMatch:true};});
  assert.equal(replayOpenBytes(inert, trusted).countedAsMatch,false);
  if (source.authority !== null) {
    reject(p => {p.authority = null;}, /autoridad-v2-no-adicionada/);
    reject(p => {p.authoritySources = {};}, /autoridad-v2-fuente/);
  }
},120000);
