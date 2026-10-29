import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { tablaEsperadaPorHoja } from '/home/elies/.t3/worktrees/IRoboPF/t3-dc46a039/tests/helpers/canonical-tabular-hashes.ts'
const dir = import.meta.dirname
const old = JSON.parse(readFileSync('/home/elies/.t3/worktrees/IRoboPF/t3-dc46a039/tests/fixtures/canonical-tabular-hashes.json','utf8'))
const canonical = value => Number.isFinite(value) ? `n:${Math.round(Number(value.toFixed(2))*100)}` : `s:${value.length}:${value}`
const encoded = values => `r:${values.length}\n${values.map(canonical).join('\u001f')}\u001f\n`
const column = index => { let result=''; for(let n=index+1;n>0;n=Math.floor((n-1)/26)) result=String.fromCharCode(65+(n-1)%26)+result; return result }
const proc = spawn('python3',[`${dir}/stream.py`, '/home/elies/Repos/IRoboPF/Auditoria_Integral_Nominas_e_Inflacion_2012_2026.xlsx'],{stdio:['ignore','pipe','inherit']})
const done = new Promise(resolve=>proc.on('exit',resolve))
const sheets=[]
let current, actual, expected, rows, header, motorHeader
for await(const line of createInterface({input:proc.stdout})) {
 const record=JSON.parse(line)
 if(record.sheet) {
  current={name:record.sheet,dataRows:0,cells:0,mismatches:0,rawDifferences:0,byColumn:{},byDelta:{},first:[],samples:{}};
  const table=tablaEsperadaPorHoja(record.sheet); rows=table.filas[Symbol.iterator](); motorHeader=table.cabeceras;
  actual=createHash('sha256'); expected=createHash('sha256');
 } else if(record.dimension) current.dimension=record.dimension;
 else if(record.row) {
  if(record.row!==current.dataRows+(header?2:1) && record.row!==1) throw Error('Row gap')
  const values=record.cells.map(([address,value],i)=>{if(address!==`${column(i)}${record.row}`)throw Error(`Cell gap ${address}`);return value})
  if(record.row===1){header=values;current.columns=values.length;current.header=values;current.headerHash=createHash('sha256').update(encoded(values)).digest('hex');if(encoded(values)!==encoded(motorHeader))throw Error('Header mismatch');continue}
  const next=rows.next(); if(next.done||next.value.length!==values.length)throw Error('Shape mismatch');
  actual.update(encoded(values));expected.update(encoded(next.value));current.dataRows++; current.cells+=values.length;
  if(current.name.startsWith('DAT_') && values[0]!==current.dataRows-1)throw Error('Salary range gap');
  values.forEach((value,i)=>{const v=next.value[i];if(value!==v)current.rawDifferences++;if(canonical(value)!==canonical(v)){current.mismatches++; const c=column(i);current.byColumn[c]=(current.byColumn[c]??0)+1;const delta=Number.isFinite(value)?Math.round(Number(v.toFixed(2))*100)-Math.round(Number(value.toFixed(2))*100):'text';current.byDelta[delta]=(current.byDelta[delta]??0)+1;if(current.first.length<30)current.first.push({cell:`${c}${record.row}`,excel:value,motor:v,deltaCentimos:delta})}})
  if(current.name==='DAT_2012' && [2,12,32,20002].includes(record.row))current.samples[record.row]=values;
 }else if(record.end){if(!rows.next().done)throw Error('Extra engine rows');current.dataHash=actual.digest('hex');current.motorHash=expected.digest('hex');current.oldHash=old.sheets.find(s=>s.name===current.name).dataHash;sheets.push(current);writeFileSync(`${dir}/resultados.json`,JSON.stringify({complete:false,sheets},null,2));console.log(JSON.stringify({sheet:current.name,rows:current.dataRows,cells:current.cells,mismatches:current.mismatches,rss:process.memoryUsage().rss}));header=null}
}
if(await done!==0)throw Error('XML reader failed')
writeFileSync(`${dir}/resultados.json`,JSON.stringify({complete:true,sheets},null,2))
writeFileSync(`${dir}/hashes-excel-independientes.json`,JSON.stringify({schemaVersion:1,source:old.source,canonicalization:old.canonicalization,sheets:sheets.map(({name,columns,dataRows,headerHash,dataHash})=>({name,columns,dataRows,headerHash,dataHash}))},null,2))
