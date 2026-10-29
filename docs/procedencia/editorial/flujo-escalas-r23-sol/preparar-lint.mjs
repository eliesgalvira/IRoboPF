import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
const root=process.cwd()
const scratch=path.join(root,'.cache/flujo-escalas-r23-sol')
fs.mkdirSync(path.join(scratch,'tools'),{recursive:true})
fs.cpSync(path.join(root,'tools/oxlint'),path.join(scratch,'tools/oxlint'),{recursive:true})
const modules=path.join(scratch,'node_modules')
if (!fs.existsSync(modules)) fs.symlinkSync('/home/elies/Repos/IRoboPF/node_modules',modules,'dir')
const hash=(p)=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
let files=0
function verify(relative) {
 for (const entry of fs.readdirSync(path.join(root,relative),{withFileTypes:true})) {
  const child=path.join(relative,entry.name)
  if (entry.isDirectory()) verify(child)
  else {assert.equal(hash(path.join(root,child)),hash(path.join(scratch,child)));files++}
 }
}
verify('tools/oxlint')
const config=JSON.parse(fs.readFileSync(path.join(root,'.oxlintrc.json'),'utf8'))
assert.equal(Object.values(config.rules).filter((x)=>x==='error').length,16)
config.jsPlugins=config.jsPlugins.map((p)=>path.join(scratch,p))
fs.writeFileSync(path.join(scratch,'oxlint.json'),JSON.stringify(config,null,2))
console.log(`${files} archivos de plugins cotejados, 16 reglas a error, node_modules de solo lectura`)
const dependencies='/home/elies/Repos/IRoboPF/node_modules'
fs.writeFileSync(path.join(scratch,'runtime.tsconfig.json'),JSON.stringify({compilerOptions:{baseUrl:root,paths:{effect:[path.join(dependencies,'effect/dist/index.js')],'effect/*':[path.join(dependencies,'effect/dist/*.js')],'decimal.js':[path.join(dependencies,'decimal.js/decimal.mjs')],'@/*':[path.join(root,'*')]}}},null,2))
fs.writeFileSync(path.join(root,'docs/procedencia/editorial/flujo-escalas-r23-sol/runtime-dependencias.json'),JSON.stringify(['effect/package.json','effect/dist/index.js','effect/dist/Schema.js','decimal.js/package.json','decimal.js/decimal.mjs'].map(p=>({path:path.join(dependencies,p),sha256:hash(path.join(dependencies,p))})),null,2)+'\n')
