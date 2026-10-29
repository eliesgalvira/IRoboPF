import {lstatSync,readlinkSync,readFileSync,writeFileSync} from 'node:fs'
import {execFileSync} from 'node:child_process'
import {createHash} from 'node:crypto'
const base='6e210920a9063b7a7efd0730ae4ab1ac73a2141e',sha=b=>createHash('sha256').update(b).digest('hex')
const rows=execFileSync('git',['ls-tree','-rz',base],{maxBuffer:16*1024*1024}).toString().split('\0').filter(Boolean),files=[],missing=[]
for(const row of rows){const [meta,path]=row.split('\t'),[mode,,blob]=meta.split(' ');try{lstatSync(path);const bytes=mode==='120000'?Buffer.from(readlinkSync(path)):readFileSync(path);const same=createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex')===blob;files.push({path,mode,size:bytes.length,sha256:sha(bytes),baseSha256:same?sha(bytes):sha(execFileSync('git',['cat-file','blob',blob],{maxBuffer:100*1024*1024})),gitBlob:blob})}catch(e){missing.push({path,error:e.code})}}
writeFileSync('.cache/publicacion-cuota-v2/base.json',JSON.stringify({base,archivos:files.length,ausentes:missing,diff:execFileSync('git',['diff','--name-status',base]).toString(),files},null,2)+'\n')
