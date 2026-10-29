import fs from 'node:fs';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
const base='07c07e6376a72f229be735a904ecf36517a1b571';
const dir='docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/';
const phase=process.argv[2];
const head=cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(head!==base) throw Error('HEAD incorrecto');
const entries=cp.execFileSync('git',['ls-tree','-rz','--full-tree',base],{maxBuffer:16e6}).toString().split('\0').filter(Boolean);
if(entries.length!==14957) throw Error('Número de entradas incorrecto');
const rows=[];
for(const e of entries){ const [meta,path]=e.split('\t'); const [mode,,oid]=meta.split(' '); const blob=cp.execFileSync('git',['cat-file','blob',oid],{maxBuffer:64e6}); let status='igual'; let actual=null;try{const st=fs.lstatSync(path); actual=st.isSymbolicLink()?Buffer.from(fs.readlinkSync(path)):st.isFile()?fs.readFileSync(path):null;if(!actual?.equals(blob)|| (mode==='120000')!==st.isSymbolicLink() || (!st.isSymbolicLink() && (mode==='100755')!==!!(st.mode&0o111)))status='diferente';}catch{status='ausente';}rows.push({path,mode,baseSha256:crypto.createHash('sha256').update(blob).digest('hex'),status}); }
const diff=cp.execFileSync('git',['diff',base,'--'],{maxBuffer:16e6}).toString();
fs.writeFileSync(dir+`fisico-${phase}.json.gz`,zlib.gzipSync(JSON.stringify({head,entries:rows.length,differences:rows.filter(x=>x.status!=='igual'),rows,diff})));
console.log(JSON.stringify({head,entries:rows.length,differences:rows.filter(x=>x.status!=='igual'),diffBytes:diff.length}));
