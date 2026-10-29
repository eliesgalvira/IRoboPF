import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { hash } from "../../lib/procedencia/verificador.ts"

// Orden canónico de las fuentes que definen la explicación y su comprobación.
export const FUENTES_EXPLICACION = [
  "next.config.mjs",
  "scripts/procedencia/ambito-publicado.mjs",
  "tools/procedencia/enlaces.py",
  "schemas/procedencia/executable-cell-scope.schema.json",
  "scripts/procedencia/contenido-publicar.mjs",
  "scripts/procedencia/evidencia-contenido.mjs",
  "lib/procedencia/ficha.tsx",
  "lib/procedencia/http.ts",
  "app/procedencia/[snapshot]/[id]/[revision]/route.ts",
  "app/procedencia/[snapshot]/objetos/[hash]/route.ts",
  "lib/procedencia/modelo.ts",
  "lib/procedencia/verificador.ts",
  "lib/procedencia/almacen.ts",
  "lib/procedencia/io.mjs",
  "lib/procedencia/revision.ts",
  "lib/procedencia/rastro.ts",
  "lib/procedencia/rastro-anual.ts",
  "scripts/procedencia/rastro-extraer.mjs",
  "scripts/procedencia/explicacion-version.mjs",
  "scripts/procedencia/rastro-verificar.mjs",
  "scripts/procedencia/contenido-verificar.mjs",
]
export function verificarSoftwareExplicacion(snapshot, root) {
  const generador = hash(
    readFileSync(resolve(root, "scripts/procedencia/contenido-generar.mjs"))
  )
  const fuentesSoftware = FUENTES_EXPLICACION.map((file) =>
    hash(readFileSync(resolve(root, file)))
  )
  if (
    snapshot.generador !== generador ||
    snapshot.versiones.explicacion !==
      hash(JSON.stringify({ generador, fuentesSoftware })) ||
    fuentesSoftware.some((h) => !snapshot.auxiliares.includes(h))
  )
    throw new Error("Software de explicación distinto del snapshot actual")
}
