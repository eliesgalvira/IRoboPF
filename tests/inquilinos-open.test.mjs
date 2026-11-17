import {test} from 'vitest';
import {reconstruirPaquete} from '../tools/procedencia/simuladores/inquilinos-public-loader.mjs';
const publicRef=JSON.parse(readFileSync(new URL('../tools/procedencia/simuladores/inquilinos-public-reference.json',import.meta.url)));
const publicBytes=readFileSync(new URL('../docs/procedencia/simuladores/medicion-2025/inquilinos-oficiales/inquilino-murcia-02.json.gz',import.meta.url));
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync,deflateSync} from 'node:zlib';
import {accessSES} from '../tools/procedencia/simuladores/conjunta-ses.mjs';
import {conciliarMedidaObservada,prepararInquilinoMurcia,vincularInquilinoMurcia,inspeccionarSESInquilinoMurcia} from '../tools/procedencia/simuladores/inquilinos-open.mjs';
const pins=JSON.parse(readFileSync(new URL('../tools/procedencia/simuladores/inquilinos-pins.json',import.meta.url)));
const fixture=JSON.parse(readFileSync(new URL('./fixtures/inquilinos-factual-2025.json',import.meta.url)));
const slot=publicRef.casePre;
const f=fixture.find(c=>c.id===pins.id);
const reject=r=>{assert.equal(r.estado,'no-verificado');assert.equal(r.countedAsMatch,false);assert.equal(r.resultadoOpenEUR,null);};
test('salarios solos o flags completos no acreditan alquiler',()=>{
 const p={id:pins.id,entradaAPI:f.entrada};
 for(const ev of [null,{finalCapture:true,transportComplete:true,resultadoOpenEUR:'264.55'}, {files:{}}])reject(vincularInquilinoMurcia(p,ev));
 assert.throws(()=>prepararInquilinoMurcia(slot,fixture,Buffer.from('{}')));
});
test('puente sintético rechaza ausencia, tipo, duplicidad, ámbito, subcéntimos y PDF ambiguo',()=>{
 const ses=rows=>accessSES('<?xml CodModelo="100" EjModelo="2025"?><PERSISTENCIAV2>\n[DECLARACIONES]\n  [IRPF2025]\n'+rows+'</PERSISTENCIAV2>\n');
 const d={path:'DECLARACIONES/IRPF2025',key:'SINTETICO',type:'1',flag:null,box:'9999'};
 const rows=[{text:'Medida 0,00 9999'}];
 for(const body of ['', '   SINTETICO~2~254\n','   SINTETICO~1~0.001\n','   SINTETICO~1~1\n'])assert.throws(()=>conciliarMedidaObservada(ses(body),rows,d));
 assert.throws(()=>ses('   SINTETICO~1~0\n   SINTETICO~1~0\n'));
 for(const pdf of [[],[...rows,...rows]])assert.throws(()=>conciliarMedidaObservada(ses('   SINTETICO~1~0\n'),pdf,d));
 assert.throws(()=>conciliarMedidaObservada(ses('   SINTETICO~1~0\n'),rows,{...d,path:'DECLARACIONES'}));
 assert.equal(conciliarMedidaObservada(ses('   SINTETICO~1~0\n'),rows,d).ses,'0');
});
// Replay público obligatorio, sin almacén privado ni skips.
test('originales: aceptación y adversas de cada evidencia y condición',()=>{
 const {files}=reconstruirPaquete(publicBytes,publicRef.package.sha256);
 const prepared=prepararInquilinoMurcia(slot,fixture,files['inquilinos-transporte38/inquilinos-transporte.json']);
 const before=structuredClone({slot,fixture,prepared});
 const result=vincularInquilinoMurcia(prepared,{files});
 assert.equal(result.estado,'entrada-ses-y-resultado-pdf-vinculados');
 assert.equal(result.resultadoEUR,'264.55');
 assert.equal(result.countedAsMatch,false);assert.equal(result.transportComplete,false);assert.equal(result.resultadoOpenEUR,null);
 assert.deepEqual({slot,fixture,prepared},before);
 for(const file of Object.keys(files)) {
   const missing={...files};delete missing[file];reject(vincularInquilinoMurcia(prepared,{files:missing}));
   const changed={...files,[file]:Buffer.concat([files[file],Buffer.from(' ')])};reject(vincularInquilinoMurcia(prepared,{files:changed}));
 }
 reject(vincularInquilinoMurcia(prepared,{files:{...files,extra:Buffer.from('')}}));
 const final='inquilinos-captura49/'; const old='inquilinos-inspeccion38/open2025-murcia-02/';
 for(const ext of ['ses','pdf'])reject(vincularInquilinoMurcia(prepared,{files:{...files,[final+'exportado.'+ext]:files[old+'parcial-trabajo.'+ext]}}));
 const text=inflateSync(files[final+'exportado.ses']).toString('latin1');
 assert.doesNotThrow(()=>inspeccionarSESInquilinoMurcia(text));
 const mutations=[
   t=>t.replace('INDV~1~true','INDV~1~false'),
   t=>t.replace('CAC_D~1~13','CAC_D~1~12'),
   t=>t.replace('DPNIF_D~3~90000000B~254','DPNIF_D~3~90000001N~254'),
   t=>t.replace('IMP1MU14~1~7200.0','IMP1MU14~1~7200.001'),
   t=>t.replace('IMP1MU14~1~7200.0','IMP1MU14~2~254'),
   t=>t.replace('NUM1MU14~1~1','NUM1MU14~1~2'),
   t=>t.replace('NIF1MU14~1~90000001N','NIF1MU14~1~90000000B'),
   t=>t.replace('     MU14~1~300.0','     MU14~1~300.0\n     MU14~1~300.0'),
   t=>t.replace('    [MURCIA]','    [MURCIA]\n    [MURCIA]'),
   t=>t.replace('  [RESUMEN]','  [INMUEBLES]\n  [RESUMEN]'),
   t=>t.replace('     IMP1MU14~1~7200.0','   IMP1MU14~1~7200.0'),
 ];
 for(const mutate of mutations){const altered=mutate(text);assert.notEqual(altered,text);
   assert.throws(()=>inspeccionarSESInquilinoMurcia(altered));
   reject(vincularInquilinoMurcia(prepared,{files:{...files,[final+'exportado.ses']:deflateSync(Buffer.from(altered,'latin1'))}}));}
 for(const mutate of [p=>p.entradaAPI.edad++,p=>p.contratoExterno.familiaNumerosa=true,p=>p.contratoExterno.titulares.push('extra')]){
   const bad=structuredClone(prepared);mutate(bad);reject(vincularInquilinoMurcia(bad,{files}));}
});

test('conciliación conserva signo y distingue millares, duplicados y flags',()=>{
 const ses=body=>accessSES('<?xml CodModelo="100" EjModelo="2025"?><PERSISTENCIAV2>\n[DECLARACIONES]\n  [IRPF2025]\n'+body+'</PERSISTENCIAV2>\n');
 const d={path:'DECLARACIONES/IRPF2025',key:'SINTETICO',type:'1',flag:null,box:'9999'};
 const source=ses('   SINTETICO~1~-1234.56\n');
 const pdf=[{text:'Importe sintético -1.234,56 9999'}];
 assert.equal(conciliarMedidaObservada(source,pdf,d).pdf,'-1234.56');
 assert.throws(()=>conciliarMedidaObservada(source,[{text:'Importe sintético 1.234,56 9999'}],d));
 assert.throws(()=>conciliarMedidaObservada(source,[...pdf,{text:'Otro importe 0,00 9999'}],d));
 assert.throws(()=>conciliarMedidaObservada(source,pdf,{...d,flag:'254'}));
 assert.throws(()=>conciliarMedidaObservada(ses('   SINTETICO~3~-1234.56~254\n'),pdf,d));
 assert.throws(()=>conciliarMedidaObservada(source,[{text:'Importe -1.234,560 9999'}],d));
 assert.throws(()=>conciliarMedidaObservada(source,[{text:'Importe -1.234,56 9998'}],d));
});
