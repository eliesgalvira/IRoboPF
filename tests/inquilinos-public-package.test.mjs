// Preparadas; requieren concesión explícita de ejecución y paquete sanitizado.
import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {gzipSync,gunzipSync,deflateSync} from 'node:zlib';
import {comprobarReferenciaPublica,reconstruirPaquete,cargarInquilinoPublico,hash,originalCompression,readRelative} from '../tools/procedencia/simuladores/inquilinos-public-loader.mjs';
const ref=JSON.parse(readFileSync(new URL('../tools/procedencia/simuladores/inquilinos-public-reference.json',import.meta.url)));
const bytes=readFileSync(new URL('../docs/procedencia/simuladores/medicion-2025/inquilinos-oficiales/inquilino-murcia-02.json.gz',import.meta.url));
const payload=()=>JSON.parse(gunzipSync(bytes));
const alter=f=>{const p=payload();f(p);return gzipSync(Buffer.from(JSON.stringify(p)),{level:9});};
const current=()=>({bytes,sha256:ref.package.sha256,entradaAPI:structuredClone(ref.casePre.entradaAPI),identidadPeso:structuredClone(ref.identidadPeso),fixture:structuredClone(ref.fixture),resultadoOfrecidoEUR:'264.55'});
test('cierre exacto de 79 originales y bytes fijados',()=>{
  const {files}=reconstruirPaquete(bytes,ref.package.sha256);
  expect(Object.keys(files).sort()).toEqual(ref.files.map(f=>f.file).sort());
  for(const d of ref.files){expect(files[d.file].length).toBe(d.size);expect(hash(files[d.file])).toBe(d.sha256);}
});
test.each(['extra','hash','path','ses','fixture','formato','missing'])('paquete mutado %s aunque ofrezca su nuevo SHA',kind=>{
  const b=alter(p=>{
    const name=Object.keys(p.files)[0];
    if(kind==='extra')p.files['extra.txt']={...p.files[name]};
    if(kind==='hash')p.files[name].sha256='0'.repeat(64);
    if(kind==='path')p.files['../escape.txt']={...p.files[name]};
    if(kind==='ses'){const s=Object.values(p.files).find(f=>f.format==='ses-latin1-as-utf8');s.content+='\n';s.sha256=hash(deflateSync(Buffer.from(s.content,'latin1')));}
    if(kind==='fixture')p.fixture={entrada:'ofrecida'};
    if(kind==='formato')p.files[name].format='base64-oculto';
    if(kind==='missing')delete p.files[name];
  });
  expect(()=>reconstruirPaquete(b,hash(b))).toThrow('inq-open-package-root');
});
test('otra recompresión gzip del mismo contenido no cambia raíz de confianza',()=>{
  const b=gzipSync(gunzipSync(bytes),{level:0});
  expect(()=>reconstruirPaquete(b,hash(b))).toThrow('inq-open-package-root');
});
test('SHA ofrecido distinto del anclado',()=>expect(()=>reconstruirPaquete(bytes,'0'.repeat(64))).toThrow('inq-open-package-root'));
test('expansión excesiva rechazada antes de interpretar',()=>{
  const b=gzipSync(Buffer.alloc(33*1024*1024));
  expect(()=>reconstruirPaquete(b,hash(b))).toThrow('inq-open-package-root');
});
test('ruta traversal rechazada antes de acceso',()=>expect(()=>readRelative('.', '../escape')).toThrow('inq-open-path'));
test('recompresión SES distinta nunca es equivalente sólo por texto',()=>{
  expect(()=>originalCompression(Buffer.from('mutacion-sintetica'),ref.pins.archivos['inquilinos-captura49/exportado.ses'],ref.compressor)).toThrow();
});
test('fixture alterado no sustituye fuente anclada',()=>{
  const a=current();a.fixture=[];
  expect(()=>cargarInquilinoPublico(a)).toThrow('inq-open-fixture');
});
test.each(['entrada','peso','identidad'])('entrada estable: cambio %s rechazado',kind=>{
  const a=current();
  if(kind==='entrada')a.entradaAPI.edad=41;
  if(kind==='peso')a.identidadPeso.pesoExterno='1';
  if(kind==='identidad')a.identidadPeso.id='otro';
  expect(()=>cargarInquilinoPublico(a)).toThrow('inq-open-current-input');
});
test('binding real explícito sin skips conserva caso pre y no activa medición',()=>{
  const a=current(),before={...structuredClone(a),bytes:Buffer.from(a.bytes)},r=cargarInquilinoPublico(a);
  expect(r.estado).toBe('entrada-ses-y-resultado-pdf-vinculados');
  expect(r.resultadoEUR).toBe('264.55');expect(r.resultadoOpenEUR).toBe('264.55');
  expect(r.countedAsMatch).toBe(false);expect(r.transportComplete).toBe(false);
  expect(r.casePre).toEqual(ref.casePre);expect(r.casePre.resultadoOpenEUR).toBeNull();
  expect(a).toEqual(before);
});
test('resultado ofrecido distinto no sustituye resultado leído',()=>{
  expect(()=>cargarInquilinoPublico({...current(),resultadoOfrecidoEUR:'300.00'})).toThrow('inq-open-result');
});
test('referencia mutada no se convierte en raíz recalculando hashes',()=>{
 const changed=structuredClone(ref);changed.package.sha256='0'.repeat(64);
 expect(()=>comprobarReferenciaPublica(Buffer.from(JSON.stringify(changed)))).toThrow('inq-open-trust-root');
});
