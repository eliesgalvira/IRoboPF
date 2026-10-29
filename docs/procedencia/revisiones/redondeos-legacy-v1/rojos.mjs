import { strict as assert } from 'node:assert'
import { readFileSync } from 'node:fs'
const data=JSON.parse(readFileSync(`${import.meta.dirname}/resultados.json`,'utf8'))
assert.equal(data.complete,true)
let failures=0
for(const sheet of data.sheets){
 for(const [contract,hash] of [['fixture antiguo',sheet.oldHash],['motor actual',sheet.motorHash]]){
  try{assert.equal(hash,sheet.dataHash,`${sheet.name}: ${contract} != Excel`)}catch(error){failures++;console.error(error.message)}
 }
}
console.log(`Contratos rojos: ${failures}`)
process.exitCode=failures?1:0
