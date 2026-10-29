import fs from 'node:fs'
import cp from 'node:child_process'
import crypto from 'node:crypto'
import zlib from 'node:zlib'
const base='960773f909d4ecff290edfa3d7a7b2699a8445d3'
const out='docs/procedencia/editorial/flujo-rentas-r21-sol/'
const sha=b=>crypto.createHash('sha256').update(b).digest('hex')
const entries=cp.execFileSync('git',['ls-tree','-rz',base],{maxBuffer:8*1024*1024}).toString('utf8').split('\0').filter(Boolean)
const rows=[]
for(const e of entries){const tab=e.indexOf('\t'),meta=e.slice(0,tab).split(' '),path=e.slice(tab+1);const [mode,,oid]=meta;const st=fs.lstatSync(path);const actual=st.isSymbolicLink()?Buffer.from(fs.readlinkSync(path)):fs.readFileSync(path);const expected=cp.execFileSync('git',['cat-file','blob',oid],{maxBuffer:64*1024*1024});rows.push({path,mode,kind:st.isSymbolicLink()?'symlink':'file',link:st.isSymbolicLink()?fs.readlinkSync(path):null,size:actual.length,sha256:sha(actual),baseSha256:sha(expected),same:actual.equals(expected),kindOk:st.isSymbolicLink()===(mode==='120000'),executableOk:mode==='120000'||Boolean(st.mode&0o111)===(mode==='100755')})}
const report={head:cp.execFileSync('git',['rev-parse','HEAD']).toString().trim(),base,entries:rows.length,different:rows.filter(r=>!r.same||!r.kindOk||!r.executableOk),diff:cp.execFileSync('git',['diff',base,'--stat']).toString(),deleted:cp.execFileSync('git',['diff',base,'--name-only','--diff-filter=D']).toString(),rows}
fs.writeFileSync(out+'fisico-final.json.gz',zlib.gzipSync(JSON.stringify(report)))
if(report.head!==base||rows.length!==14537||report.different.length||report.deleted)throw new Error('Base física alterada')
console.log(JSON.stringify({head:report.head,entries:rows.length,differences:report.different.length,deleted:report.deleted,diff:report.diff}))
