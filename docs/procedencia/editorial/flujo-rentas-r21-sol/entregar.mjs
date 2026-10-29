import fs from 'node:fs'
import cp from 'node:child_process'
import crypto from 'node:crypto'
import zlib from 'node:zlib'
const dir='docs/procedencia/editorial/flujo-rentas-r21-sol/'
const base='960773f909d4ecff290edfa3d7a7b2699a8445d3'
const hash=b=>crypto.createHash('sha256').update(b).digest('hex')
const excludes=new Set(['manifiesto.json','patch.diff.gz','binarios.json'])
const names=fs.readdirSync(dir).filter(n=>!excludes.has(n)).sort()
const rows=[],binaries=[],patches=[]
for(const name of names){const path=dir+name,stat=fs.lstatSync(path);if(!stat.isFile())throw new Error('Entrada no archivo '+path);const raw=fs.readFileSync(path);const entry={path,size:raw.length,sha256:hash(raw),baseSha256:null};rows.push(entry);const text=raw.toString('utf8');if(!Buffer.from(text).equals(raw)||raw.includes(0)){binaries.push(entry);continue}const d=cp.spawnSync('git',['diff','--no-index','--','/dev/null',path],{maxBuffer:16*1024*1024});if(d.status!==1&&d.status!==0)throw new Error(d.stderr.toString());patches.push(d.stdout)}
const patch=zlib.gzipSync(Buffer.concat(patches));fs.writeFileSync(dir+'patch.diff.gz',patch)
fs.writeFileSync(dir+'binarios.json',JSON.stringify({version:1,binaries},null,2)+'\n')
const manifest={version:1,head:cp.execFileSync('git',['rev-parse','HEAD']).toString().trim(),base,scope:dir,files:rows,deleted:[],physical:'fisico-final.json.gz',patch:{path:dir+'patch.diff.gz',sha256:hash(patch),size:patch.length},binaryMap:dir+'binarios.json',selfExclusions:[...excludes],note:'Todos los archivos de entrega son nuevos respecto de base; SHA256 nulo en base. Rechazar cualquier borrado y verificar el cotejo físico por separado.'}
fs.writeFileSync(dir+'manifiesto.json',JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({files:rows.length,binaries:binaries.length,patchSha256:hash(patch),base,head:manifest.head}))
