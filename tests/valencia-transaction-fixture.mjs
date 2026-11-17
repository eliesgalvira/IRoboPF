// Instantánea sintética histórica: no se reconstruye a partir del catálogo vivo.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {Schema} from 'effect';
export function preValencia(tx){
 const bytes=readFileSync(new URL('./fixtures/valencia-transaction-pre.json.gz',import.meta.url));
 const documents=Schema.decodeUnknownSync(Schema.Record(Schema.String,Schema.String))(
  JSON.parse(gunzipSync(bytes,{maxOutputLength:4*1024*1024})),
 );
 assert.deepEqual(Object.keys(documents).sort(),Object.keys(tx.pins).sort());
 return Object.fromEntries(Object.entries(tx.pins).map(([name,expected])=>{
  const original=Buffer.from(documents[name],'utf8');
  assert.equal(createHash('sha256').update(original).digest('hex'),expected,'PRE histórico exacto obligatorio');
  return [name,original];
 }));
}
