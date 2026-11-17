import {afterEach, expect, test, vi} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gzipSync, gunzipSync, deflateSync} from 'node:zlib';
import {spawnSync} from 'node:child_process';
import {originalCompression, replayOpenBytes} from '../tools/procedencia/simuladores/vincular-conjunta-open.mjs';

const refs=new URL('../tools/procedencia/simuladores/conjunta-referencias/',import.meta.url);
const index=JSON.parse(readFileSync(new URL('index.json',refs)));
const hash=b=>createHash('sha256').update(b).digest('hex');
const incompatible=()=>Buffer.from('compresor-alternativo-sintetico');
function example(pin) {
  const referenceBytes=readFileSync(new URL(pin.file,refs));
  const ref=JSON.parse(referenceBytes);
  const bundle=readFileSync(new URL('../docs/procedencia/simuladores/medicion-2025/conjuntas-oficiales/'+pin.id+'.json.gz',import.meta.url));
  return {trusted:{referenceBytes,referenceSha256:pin.sha256,
    fixtureBytes:Buffer.from(JSON.stringify(ref.casePlan.fixture))},
    payload:JSON.parse(gunzipSync(bundle)),expected:ref.source.sesSha256};
}
afterEach(()=>vi.unstubAllEnvs());

test.each(index.cases)('$id: compresor fijado con PATH vacío y biblioteca nativa incompatible',pin=>{
  const {payload,expected}=example(pin);
  expect(process.env.C_SES_NODE).toBeTruthy();
  vi.stubEnv('PATH','');
  const calls=[];
  const output=originalCompression(Buffer.from(payload.ses.utf8,'latin1'),expected,{
    native:incompatible,executable:process.env.C_SES_NODE,
    execute:(...args)=>{calls.push(args[0]);return spawnSync(...args)},
  });
  expect(hash(output)).toBe(expected);
  expect(calls).toEqual([process.env.C_SES_NODE]);
});

test('un ejecutable ausente no degrada la integridad a igualdad textual',()=>{
  const {payload,expected}=example(index.cases[0]);
  vi.stubEnv('PATH','');
  expect(()=>originalCompression(Buffer.from(payload.ses.utf8,'latin1'),expected,{
    native:incompatible,executable:'compresor-inexistente-sintetico',execute:spawnSync,
  })).toThrow('open-ses-recompresion-no-exacta');
});

test.each(index.cases)('$id: status cero con bytes incorrectos sigue rechazado',pin=>{
  const {payload,expected}=example(pin);
  expect(()=>originalCompression(Buffer.from(payload.ses.utf8,'latin1'),expected,{
    native:incompatible,executable:'compresor-sintetico',
    execute:()=>({status:0,stdout:Buffer.from('salida-incorrecta-sintetica')}),
  })).toThrow('open-ses-recompresion-no-exacta');
});

test.each(index.cases)('$id: recompresión válida y hashes editables no sustituyen al recibo anclado',pin=>{
  const {payload,trusted}=example(pin);
  payload.ses.utf8+='\nMUTACION-SINTETICA';
  const raw=Buffer.from(payload.ses.utf8,'latin1');
  payload.ses.latin1Sha256=hash(raw);
  payload.ses.compressedSha256=hash(deflateSync(raw,{level:6}));
  const altered=gzipSync(Buffer.from(JSON.stringify(payload)));
  expect(()=>replayOpenBytes(altered,trusted)).toThrow('open-fuente-integridad');
});
