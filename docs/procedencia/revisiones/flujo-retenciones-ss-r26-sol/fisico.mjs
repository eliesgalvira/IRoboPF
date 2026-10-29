import fs from 'node:fs';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
const base='6ab4a98e6ce218c30a3a9f18596d0c2f030f47d9';
const run=(...a)=>cp.execFileSync('git',a,{maxBuffer:100*1024*1024});
const head=run('rev-parse','HEAD').toString().trim();
if(head!==base)throw Error('HEAD inesperado');
const rows=run('ls-tree','-rz',base).toString().split('\0').filter(Boolean);
if(rows.length!==15456)throw Error('censo inesperado');
const entries=[];const differences=[];
for(const row of rows){const [meta,path]=row.split('\t');const [mode,type,oid]=meta.split(' ');if(type!=='blob')throw Error(type);const blob=run('cat-file','blob',oid);let actual;let st;try{st=fs.lstatSync(path);actual=st.isSymbolicLink()?Buffer.from(fs.readlinkSync(path)):st.isFile()?fs.readFileSync(path):null;}catch{}const hash=b=>crypto.createHash('sha256').update(b).digest('hex');const same=actual!==null&&actual!==undefined&&actual.equals(blob)&&((mode==='120000')===st.isSymbolicLink())&&(mode==='120000'||Boolean(st.mode&0o111)===(mode==='100755'));const r={path,mode,size:blob.length,baseSha256:hash(blob),same};entries.push(r);if(!same)differences.push(r);}
const phase=process.argv[2];fs.writeFileSync(`docs/procedencia/revisiones/flujo-retenciones-ss-r26-sol/fisico-${phase}.json.gz`,zlib.gzipSync(JSON.stringify({base,head,count:rows.length,differences,entries})));
fs.writeFileSync(`docs/procedencia/revisiones/flujo-retenciones-ss-r26-sol/diff-${phase}.txt`,run('diff','--no-ext-diff',base,'--'));
console.log(JSON.stringify({phase,head,count:rows.length,differences}));
