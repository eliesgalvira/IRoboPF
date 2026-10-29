import fs from 'node:fs'
import {execFileSync} from 'node:child_process'
import {gzipSync} from 'node:zlib'
import {sha} from './flujo-ast.mjs'
const base='5e69c68077ffd18be20457160595adb3f0ff52e4',out='docs/procedencia/implementaciones/composicion-flujo-r28-sol/'
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()
if(head!==base)throw Error('HEAD inesperado')
const tree=execFileSync('git',['ls-tree','-rz','--full-tree',base],{maxBuffer:8*1024*1024}).toString().split('\0').filter(Boolean)
const records=[]
for(const row of tree){
 const tab=row.indexOf('\t'),[mode,kind,oid]=row.slice(0,tab).split(' '),file=row.slice(tab+1)
 if(kind!=='blob')throw Error('Entrada no blob')
 const original=execFileSync('git',['cat-file','blob',oid],{maxBuffer:64*1024*1024})
 let physical
 try{const stat=fs.lstatSync(file),symlink=stat.isSymbolicLink(),bytes=symlink?Buffer.from(fs.readlinkSync(file)):fs.readFileSync(file);physical={mode:symlink?'120000':stat.mode&0o111?'100755':'100644',sha256:sha(bytes),size:bytes.length};records.push({path:file,baseSha256:sha(original),mode,physical,equal:mode===physical.mode&&original.equals(bytes)})}
 catch(error){records.push({path:file,baseSha256:sha(original),mode,missing:true,error:String(error),equal:false})}
}
const differences=records.filter(r=>!r.equal),diff=execFileSync('git',['diff','--name-status',base],{encoding:'utf8'}),report={base,head,entries:tree.length,differences,records,diff}
fs.writeFileSync(out+'fisico-final.json.gz',gzipSync(JSON.stringify(report,null,2)+'\n',{level:9}))
console.log(JSON.stringify({head,entries:tree.length,differences: differences.length,diff}))
if(tree.length!==15914||differences.length||diff)process.exitCode=1
