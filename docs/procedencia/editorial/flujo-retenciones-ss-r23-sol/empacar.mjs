import fs from 'node:fs';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import cp from 'node:child_process';
const dir='docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/';
const base='07c07e6376a72f229be735a904ecf36517a1b571';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const excluded=['manifiesto.json','entrega.patch.gz','binarios.json'];
const rows=[],binaries=[],patch=[];
for(const name of fs.readdirSync(dir).sort()){
 if(excluded.includes(name))continue;
 const relativePath=dir+name,st=fs.lstatSync(relativePath);if(!st.isFile())throw Error('Objeto ajeno al contrato');
 const data=fs.readFileSync(relativePath);if(data.length>1000000&&/\.log$/.test(name))throw Error('Log sin comprimir');
 const tracked=cp.spawnSync('git',['cat-file','-e',base+':'+relativePath]).status===0;if(tracked)throw Error('No se permite reemplazo histórico en este paquete');
 const row={path:relativePath,sha256:hash(data),size:data.length,baseSha256:null};rows.push(row);
 if(data.includes(0)||name.endsWith('.gz')){binaries.push(row);continue;}
 const text=data.toString('utf8');const lines=text.endsWith('\n')?text.slice(0,-1).split('\n'):text.split('\n');
 patch.push(`diff --git a/${relativePath} b/${relativePath}\nnew file mode 100644\n`);
 if(data.length){patch.push(`--- /dev/null\n+++ b/${relativePath}\n@@ -0,0 +1,${lines.length} @@\n`+lines.map(x=>'+'+x+'\n').join('')+(text.endsWith('\n')?'':'\\ No newline at end of file\n'));}
}
fs.writeFileSync(dir+'binarios.json',JSON.stringify({head:base,binaries},null,2));
fs.writeFileSync(dir+'entrega.patch.gz',zlib.gzipSync(patch.join('')));
fs.writeFileSync(dir+'manifiesto.json',JSON.stringify({head:base,baseEntries:14957,paths:rows,excludedSelfMetadata:excluded.map(x=>dir+x),patchSha256:hash(fs.readFileSync(dir+'entrega.patch.gz')),binaryMapSha256:hash(fs.readFileSync(dir+'binarios.json')),legalAcceptance:false,review:'pendiente'},null,2));
console.log({files:rows.length,bytes:rows.reduce((a,b)=>a+b.size,0),binaries:binaries.length});
