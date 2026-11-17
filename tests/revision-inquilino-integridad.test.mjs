// Adversas independientes de integridad y conservación del expediente.
import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {deflateSync} from 'node:zlib';
import {originalCompression,hash} from '../tools/procedencia/simuladores/inquilinos-public-loader.mjs';
import {observacionInquilino,comprobarSlotInquilino,vincularInquilinoOpen} from '../tools/procedencia/simuladores/vincular-inquilino-open.mjs';
import {medirCasos} from '../tools/procedencia/simuladores/medir-casos.mjs';
const ref=JSON.parse(readFileSync(new URL('../tools/procedencia/simuladores/inquilinos-public-reference.json',import.meta.url)));
const base=fileURLToPath(new URL('../docs/procedencia/simuladores/medicion-2025/',import.meta.url));
const post=()=>({...structuredClone(ref.casePre),...observacionInquilino('264.55')});
test.each(['resultadoOpenEUR','componentesOpenEUR','evidenciaOpen','integridadReferencias','estado','pendientes'])('observación exige presencia explícita de %s',field=>{
 const c=post();delete c[field];const before=structuredClone(c);
 expect(()=>comprobarSlotInquilino(c)).toThrow('inq-current-observation');
 expect(vincularInquilinoOpen(c,base)).toMatchObject({estado:'no-verificado',resultadoOpenEUR:null,countedAsMatch:false,transportComplete:false});
 expect(c).toEqual(before);
});
test.each(['componentesOpenEUR','evidenciaOpen','integridadReferencias','estado','pendientes'])('observación rechaza null en %s',field=>{
 const c=post();c[field]=null;
 expect(()=>comprobarSlotInquilino(c)).toThrow('inq-current-observation');
});
test('referencias duplicadas con el SHA correcto no satisfacen observación exacta',()=>{
 const c=post();c.integridadReferencias.referencias.push({...c.integridadReferencias.referencias[0]});
 expect(()=>comprobarSlotInquilino(c)).toThrow('inq-current-observation');
});
test('recompresión nativa exacta no exime compresor obligatorio',()=>{
 const input=Buffer.from('fixture-exclusivamente-sintetico');
 const expected=hash(deflateSync(input,{level:6}));
 const saved=process.env.C_SES_NODE;
 try{
  delete process.env.C_SES_NODE;
  expect(()=>originalCompression(input,expected,ref.compressor)).toThrow('inq-open-compressor');
 }finally{
  if(saved===undefined)delete process.env.C_SES_NODE;else process.env.C_SES_NODE=saved;
 }
});
test('mismatch conserva importe ofrecido y no cuenta coincidencia en medidor',()=>{
 const c=post();c.resultadoOpenEUR='300.00';const before=structuredClone(c);
 const r=medirCasos({N:1,casos:[c]},{base});
 expect(r.medicion).toMatchObject({N:1,comparables:1,iguales:0});
 expect(r.resultados[0]).toMatchObject({estado:'discrepante',resultadoOpenEUR:'300.00',resultadoMotorEUR:'264.55',discrepanciaEUR:'-35.45',coincidenciaVerificada:false,vinculacion:{estado:'no-verificado',resultadoOpenEUR:null}});
 expect(c).toEqual(before);
});
test('igualdad monetaria con metadata estable alterada no cuenta coincidencia',()=>{
 const c=post();c.procedenciaEntrada.metodo='alteracion-sintetica';const before=structuredClone(c);
 const r=medirCasos({N:1,casos:[c]},{base});
 expect(r.medicion).toMatchObject({N:1,comparables:1,iguales:0});
 expect(r.resultados[0]).toMatchObject({estado:'igual-al-centimo',coincidenciaVerificada:false,vinculacion:{estado:'no-verificado',resultadoOpenEUR:null}});
 expect(c).toEqual(before);
});
