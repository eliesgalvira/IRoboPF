import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs'
import {resolve} from 'node:path'
import {spawnSync} from 'node:child_process'
import antiSlop from '../../../../tools/oxlint/anti-slop/index.ts'
import effect from '../../../../tools/oxlint/anti-slop/effect/index.ts'
const config=JSON.parse(readFileSync('.oxlintrc.json'))
for(const [prefix,plugin] of [['anti-slop',antiSlop],['anti-slop-effect',effect]]){
 for(const name of Object.keys(plugin.rules))assert.equal(config.rules[`${prefix}/${name}`],'error')
}
assert.equal(Object.keys(config.rules).length,16)
const scratch=resolve('.cache/contratos-publicacion-r19-sol/humo')
mkdirSync(scratch,{recursive:true})
const local={...config,ignorePatterns:[],jsPlugins:config.jsPlugins.map(p=>resolve(p))}
writeFileSync(resolve(scratch,'oxlint.json'),JSON.stringify(local))
writeFileSync(resolve(scratch,'sample.ts'),'import { makeExample } from "./example.ts";\nexport function accept(value: unknown) { return value; }\n')
const result=spawnSync('bun',[resolve('node_modules/oxlint/bin/oxlint'),'--threads=1','--disable-nested-config','--no-ignore','--config',resolve(scratch,'oxlint.json'),'--format','json','sample.ts'],{cwd:scratch,encoding:'utf8'})
console.log(JSON.stringify(result))
assert.equal(result.status,1)
const codes=JSON.parse(result.stdout).diagnostics.map(item=>item.code)
assert.ok(codes.includes('anti-slop(no-unknown-parameters)'))
assert.ok(codes.includes('anti-slop-effect(no-service-constructor-imports)'))
console.log('16 reglas a error y rechazos efectivos de ambos plugins; solo ignorePatterns vacío en fixture aislado')
