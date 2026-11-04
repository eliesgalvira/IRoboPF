// Ejecuta el resolver vigente, sin copiar ni ampliar sus adaptadores.
// Cada proceso recibe como máximo 32 bindings para acotar los AST retenidos.
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'

const [repo, input] = process.argv.slice(2)
const bindings = JSON.parse(readFileSync(input, 'utf8'))
if (bindings.length > 32) throw new Error('Máximo 32 bindings por proceso')
const resolver = resolve(repo, 'tools/procedencia/datos/binding-position.mjs')
// Bun puede reutilizar el módulo aunque cambie la query de su URL. Cada tarea
// ejecuta los mismos bytes desde una ruta distinta. No se amplía el resolver.
const code = readFileSync(resolver)
const directory = mkdtempSync(resolve(tmpdir(), 'irobopf-ast-'))
const originalLog = console.log
for (const [index, binding] of bindings.entries()) {
  let output
  console.log = value => { output = JSON.parse(value) }
  process.argv = ['bun', resolver, resolve(repo, binding.file), binding.symbol, JSON.stringify(binding.path)]
  let result
  try {
    const taskModule = resolve(directory, `binding-${index}.mjs`)
    writeFileSync(taskModule, code)
    await import(pathToFileURL(taskModule).href)
    if (!output) throw new Error('Resolver sin salida')
    result = { binding, position: output }
  } catch (error) {
    result = { binding, error: String(error) }
  } finally {
    console.log = originalLog
  }
  process.stdout.write(JSON.stringify(result) + '\n')
}
