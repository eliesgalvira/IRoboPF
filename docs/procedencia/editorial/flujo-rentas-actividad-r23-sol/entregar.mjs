import fs from 'node:fs'
import cp from 'node:child_process'
import crypto from 'node:crypto'
import zlib from 'node:zlib'
const out='docs/procedencia/editorial/flujo-rentas-actividad-r23-sol/'
const base='07c07e6376a72f229be735a904ecf36517a1b571'
const hash=b=>crypto.createHash('sha256').update(b).digest('hex')
const excluded=['manifiesto.json','patch.diff.gz','binarios.json']
const rows=[],binary=[],patch=[]
for(const name of fs.readdirSync(out).sort()){
 if(excluded.includes(name))continue
 const path=out+name,stat=fs.lstatSync(path)
 if(!stat.isFile())throw new Error('No se entregan directorios/cache '+path)
 const b=fs.readFileSync(path)
 let previous=null
 try {previous=cp.execFileSync('git',['show',base+':'+path],{stdio:['ignore','pipe','ignore']})}catch{ /* Ruta nueva permitida en propiedad exclusiva. */ }
 rows.push({path,sha256:hash(b),size:b.length,baseSha256:previous?hash(previous):null})
 if(b.includes(0)||name.endsWith('.gz')){binary.push({path,sha256:hash(b),size:b.length});continue}
 if(b.length===0){patch.push('diff --git a/'+path+' b/'+path+'\nnew file mode 100644\nindex 0000000..e69de29\n');continue}
 const lines=b.toString('utf8').split('\n');if(lines.at(-1)==='')lines.pop()
 patch.push('diff --git a/'+path+' b/'+path+'\nnew file mode 100644\n--- /dev/null\n+++ b/'+path+'\n@@ -0,0 +1,'+lines.length+' @@\n'+lines.map(s=>'+'+s+'\n').join('')+(b.at(-1)!==10?'\\ No newline at end of file\n':''))
}
fs.writeFileSync(out+'patch.diff.gz',zlib.gzipSync(patch.join('')))
cp.execFileSync('git',['apply','--numstat','-'],{input:Buffer.from(patch.join('')),maxBuffer:1024*1024})
fs.writeFileSync(out+'binarios.json',JSON.stringify(binary,null,2)+'\n')
fs.writeFileSync(out+'manifiesto.json',JSON.stringify({base,head:cp.execFileSync('git',['rev-parse','HEAD']).toString().trim(),physical:'fisico-final.json.gz',excludedMetadata:excluded,files:rows},null,2)+'\n')
console.log(JSON.stringify({files:rows.length,binaries:binary.length,base}))
