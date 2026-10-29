import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { verificarContenido } from "../../../../scripts/procedencia/contenido-verificar.mjs"
import { leerSnapshot } from "../../../../lib/procedencia/almacen.ts"
const own = resolve("docs/procedencia/correcciones/integracion-r19")
const store = resolve("docs/procedencia/implementaciones/contenidos/datos")
const ids = JSON.parse(readFileSync(resolve(store, "snapshots.json")))
for (const id of ids) {
  verificarContenido(leerSnapshot(id, store), store)
  process.stdout.write("Histórico verificado " + id + "\n")
}
writeFileSync(resolve(own, "historicos.json"), JSON.stringify({ count: ids.length, ids }) + "\n")
