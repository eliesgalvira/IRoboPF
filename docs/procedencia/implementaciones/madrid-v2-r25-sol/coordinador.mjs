import { verifyLinks } from '../../../../scripts/procedencia/verificar-enlaces.mjs'
import { resolve } from 'node:path'

const scratch = resolve('.cache/madrid-v2-r25-sol/ensayo')
const result = await verifyLinks(scratch, {
  casRoots: ['/home/local/Repos/IRoboPF/.cache/procedencia'],
})
process.stdout.write(JSON.stringify(result, null, 2) + '\n')
