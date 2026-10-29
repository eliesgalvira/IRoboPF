import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import ts from "typescript"
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

// Lee la lista literal del helper conservado, sin ejecutar código histórico.
function validarBindingHistorico(fuente, declaracion) {
  let ambiguo = false
  const visitar = (nodo) => {
    if (ts.isExportDeclaration(nodo)) {
      const clausula = nodo.exportClause
      if (
        !clausula ||
        (ts.isNamedExports(clausula) &&
          clausula.elements.some((e) => e.name.text === "FUENTES_EXPLICACION")) ||
        (ts.isNamespaceExport(clausula) &&
          clausula.name.text === "FUENTES_EXPLICACION")
      )
        ambiguo = true
    }
    if (
      ts.isIdentifier(nodo) &&
      nodo.text === "FUENTES_EXPLICACION" &&
      nodo !== declaracion.name
    ) {
      // Gramática histórica admitida: lectura directa con map; sin aliases,
      // otras declaraciones ni escrituras. No prueba ejecución del módulo.
      const acceso = nodo.parent
      const llamada = acceso.parent
      if (
        !ts.isPropertyAccessExpression(acceso) ||
        acceso.expression !== nodo ||
        acceso.name.text !== "map" ||
        !ts.isCallExpression(llamada) ||
        llamada.expression !== acceso
      )
        ambiguo = true
    }
    ts.forEachChild(nodo, visitar)
  }
  visitar(fuente)
  if (ambiguo)
    throw new Error("Lista histórica de software con binding ambiguo")
}

function fuentesHistoricas(bytes) {
  const fuente = ts.createSourceFile(
    "explicacion-version.mjs",
    bytes.toString("utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS
  )
  const declaraciones = fuente.statements
    .filter(ts.isVariableStatement)
    .filter((s) =>
      s.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    )
    .flatMap((s) => [...s.declarationList.declarations])
    .filter(
      (d) => ts.isIdentifier(d.name) && d.name.text === "FUENTES_EXPLICACION"
    )
  if (fuente.parseDiagnostics.length !== 0 || declaraciones.length !== 1)
    throw new Error("Lista histórica de software ausente o ambigua")
  if (!(declaraciones[0].parent.flags & ts.NodeFlags.Const))
    throw new Error("Lista histórica de software sin declaración const")
  validarBindingHistorico(fuente, declaraciones[0])
  const lista = declaraciones[0].initializer
  if (
    !lista ||
    !ts.isArrayLiteralExpression(lista) ||
    !lista.elements.every(ts.isStringLiteral)
  )
    throw new Error("Lista histórica de software no literal")
  const rutas = lista.elements.map((e) => e.text)
  if (
    rutas.length === 0 ||
    new Set(rutas).size !== rutas.length ||
    !rutas.includes("scripts/procedencia/explicacion-version.mjs") ||
    rutas.some(
      (p) =>
        /[^A-Za-z0-9_./\[\]-]/.test(p) ||
        p.startsWith("/") ||
        p.split("/").some((s) => ["", ".", ".."].includes(s))
    )
  )
    throw new Error("Rutas históricas de software ambiguas")
  return rutas
}

export function verificarSoftwareRecibo(snapshot, dependencias, leer) {
  const porRuta = new Map()
  for (const d of dependencias) {
    if (porRuta.has(d.path))
      throw new Error("Dependencia de software duplicada")
    porRuta.set(d.path, d.sha256)
  }
  const conservar = (ruta) => {
    const h = porRuta.get(ruta)
    if (!h || !snapshot.auxiliares.includes(h))
      throw new Error("Fuente de software ausente del recibo")
    const bytes = leer(h)
    if (hash(bytes) !== h) throw new Error("Fuente de software corrupta")
    return { hash: h, bytes }
  }
  const generador = conservar("scripts/procedencia/contenido-generar.mjs").hash
  const helper = conservar("scripts/procedencia/explicacion-version.mjs")
  const fuentesSoftware = fuentesHistoricas(helper.bytes).map(
    (ruta) => conservar(ruta).hash
  )
  if (
    generador !== snapshot.generador ||
    hash(JSON.stringify({ generador, fuentesSoftware })) !==
      snapshot.versiones.explicacion
  )
    throw new Error("Software del recibo distinto de la explicación conservada")
}
