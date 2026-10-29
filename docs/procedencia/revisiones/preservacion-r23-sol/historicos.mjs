import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
const { verificarContenido } = await import("../../../../scripts/procedencia/contenido-verificar.mjs")
const { leerSnapshot } = await import("../../../../lib/procedencia/almacen.ts")
const own = resolve("docs/procedencia/revisiones/preservacion-r23-sol")
const store = resolve("docs/procedencia/implementaciones/contenidos/datos")
const snapshots = JSON.parse(readFileSync(resolve(store, "snapshots.json")))
if (snapshots.length !== 36) throw new Error("Corte inesperado")
for (const id of snapshots) verificarContenido(leerSnapshot(id, store), store)
writeFileSync(resolve(own, "historicos.json"), JSON.stringify({ snapshots, verificados: snapshots.length }) + "\n")
