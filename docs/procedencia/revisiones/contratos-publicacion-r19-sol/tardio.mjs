import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,mkdirSync,cpSync,symlinkSync} from 'node:fs'
import {resolve,dirname} from 'node:path'
import {prepararEntrada,generarEvidencia} from '../../../../scripts/procedencia/evidencia-contenido.mjs'
const root=process.cwd()
const entrada=prepararEntrada(root,'f74f859aa5ec40532299678b9c067f2537f0e62a6a39a523711d79161a742cbb')
const scratch=resolve('.cache/contratos-publicacion-r19-sol/tardio')
for(const d of entrada.dependencias){const p=resolve(scratch,d.path);mkdirSync(dirname(p),{recursive:true});cpSync(resolve(root,d.path),p)}
cpSync(resolve(root,'tsconfig.json'),resolve(scratch,'tsconfig.json'))
symlinkSync(resolve(root,'node_modules'),resolve(scratch,'node_modules'))
const target=resolve(scratch,'docs/procedencia/corpus/madrid-2020-limite.citation.json')
// Mutación persistente después de que el proceso Python real haya terminado.
const wrapper=`#!/usr/bin/env bash\nbash '${root}/tools/procedencia/run.sh' "$@"\ncode=$?\nprintf ' ' >> '${target}'\nexit "$code"\n`
writeFileSync(resolve(scratch,'tools/procedencia/run.sh'),wrapper)
const pines=prepararEntrada(scratch,entrada.snapshot)
const antes=readFileSync(target)
await assert.rejects(()=>generarEvidencia(scratch,pines),/Documento cambió durante la verificación/)
assert.notDeepEqual(readFileSync(target),antes)
console.log('Cambio persistente tras Python rechazado por Node; sin publicar; original intacto')
