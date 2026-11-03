// Explicit runtime aliases; no automatic package installation or global fallback.
import { isAbsolute } from 'node:path'
const root = process.argv[2]
if (!root || !isAbsolute(root)) throw Error('DATOS_RUNTIME_ROOT debe ser absoluto')
const paths = Object.fromEntries(['decimal.js', 'typescript', 'effect'].map(name => [name, [Bun.resolveSync(name, root)]]))
process.stdout.write(JSON.stringify({compilerOptions:{paths}}))
