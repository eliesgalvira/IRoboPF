import { readFileSync, writeFileSync } from 'node:fs'
import { filaDetalleTabular } from '/home/elies/.t3/worktrees/IRoboPF/t3-dc46a039/lib/dominio/compatibilidad-legacy/detalle-tabular.ts'
import { redondearNumpy, redondearPython } from '/home/elies/.t3/worktrees/IRoboPF/t3-dc46a039/lib/dominio/compatibilidad-legacy/aritmetica-tabular.ts'
const data=JSON.parse(readFileSync(`${import.meta.dirname}/boundaries.json`,'utf8'))
const findings=[]
for(const c of data.cases){const row=filaDetalleTabular(c.year,c.salary);row.forEach((v,i)=>{if(v!==c.row[i])findings.push({year:c.year,salary:c.salary,column:i+1,python:c.row[i],motor:v})})}
for(const c of data.roundings){for(const [name,fn] of [['python',redondearPython],['numpy',redondearNumpy]]){const v=fn(c.value,c.digits);if(!Object.is(v,c[name]))findings.push({rounding:name,...c,motor:v})}}
const previous=JSON.parse(readFileSync('/home/elies/.t3/worktrees/IRoboPF/t3-dc46a039/docs/procedencia/correcciones/integracion-ronda10/caracterizacion-python.json','utf8'))
for(const c of data.characterization){const old=previous.casos.find(v=>v.anio===c.anio&&v.salarioBrutoAnualCentimos===c.salarioBrutoAnualCentimos);if(JSON.stringify(old.fila)!==JSON.stringify(c.fila))findings.push({characterization:c})}
writeFileSync(`${import.meta.dirname}/boundaries-result.json`,JSON.stringify({rows:data.cases.length,roundings:data.roundings.length,characterization:data.characterization.length,findings},null,2))
console.log(JSON.stringify({rows:data.cases.length,findings:findings.length}))
