import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { verificarContenido } from "../../../../scripts/procedencia/contenido-verificar.mjs"
import { leerSnapshot } from "../../../../lib/procedencia/almacen.ts"

const own = resolve("docs/procedencia/correcciones/tecnica-r23")
const store = resolve("docs/procedencia/implementaciones/contenidos/datos")
const anteriores = JSON.parse(readFileSync(resolve(own, "historicos.json"))).ids
const actuales = JSON.parse(readFileSync(resolve(store, "snapshots.json")))
if (anteriores.some((id) => !actuales.includes(id)))
  throw new Error("Falta un snapshot histórico")
const nuevos = actuales.filter((id) => !anteriores.includes(id))
if (nuevos.length !== 2) throw new Error("Se esperaban dos snapshots nuevos")
for (const id of nuevos) verificarContenido(leerSnapshot(id, store), store)
const alias = JSON.parse(readFileSync(resolve("lib/procedencia/rastro-generado.json")))
if (!nuevos.includes(alias.actual.versiones.snapshot))
  throw new Error("Alias actual ajeno a la regeneración")
writeFileSync(resolve(own, "verificacion-cierre.json"), JSON.stringify({
  anterioresVerificados: anteriores.length,
  nuevosVerificados: nuevos,
  totalConservado: actuales.length,
  versiones: alias.actual.versiones,
  aceptacionFiscalCompleta: false,
}, null, 2) + "\n")
