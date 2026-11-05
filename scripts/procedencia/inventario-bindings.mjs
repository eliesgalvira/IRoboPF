import ts from "typescript"
import { relative, resolve } from "node:path"
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { hash } from "./inventario-ast.mjs"

/** Grafo estático de definiciones; no afirma que una rama sea alcanzable. */
export function bindingGraph(root, paths, inputs = new Set()) {
  // Una definición puede recibir miles de referencias. Sus bytes son los
  // mismos durante esta generación; no releerlos y hashearlos por cada uso.
  const sourceHashes = new Map()
  function sourceHash(fileName) {
    if (!sourceHashes.has(fileName))
      sourceHashes.set(fileName, hash(readFileSync(fileName)))
    return sourceHashes.get(fileName)
  }
  const program = ts.createProgram(paths, {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.Preserve,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
    noEmit: true,
  })
  const checker = program.getTypeChecker()
  // El checker también lee imports fuera del ámbito numérico inventariado.
  // Deben viajar con la generación aunque no produzcan ocurrencias fiscales.
  for (const file of program.getSourceFiles()) {
    if (resolve(file.fileName).startsWith(`${root}/lib/`))
      inputs.add(relative(root, file.fileName))
  }
  const graph = []
  for (const path of paths) {
    const sf = program.getSourceFile(path)
    function visit(node) {
      if (ts.isVariableDeclaration(node) && node.initializer) {
        const dependencies = new Map()
        function reference(child) {
          if (ts.isIdentifier(child)) {
            let symbol = checker.getSymbolAtLocation(child)
            if (symbol && symbol.flags & ts.SymbolFlags.Alias)
              symbol = checker.getAliasedSymbol(symbol)
            for (const declaration of symbol?.declarations ?? []) {
              const file = declaration.getSourceFile()
              if (
                !resolve(file.fileName).startsWith(`${root}/lib/`) ||
                declaration === node
              )
                continue
              const start = declaration.getStart(file)
              const key = `${relative(root, file.fileName)}:${start}`
              dependencies.set(key, {
                // El símbolo del módulo contiene una ruta absoluta en TypeScript.
                // La declaración y su hash fijan su identidad dentro del proyecto.
                symbol: ts.isSourceFile(declaration)
                  ? JSON.stringify(relative(root, file.fileName))
                  : symbol.name,
                file: relative(root, file.fileName),
                start,
                line: file.getLineAndCharacterOfPosition(start).line + 1,
                sha256: sourceHash(file.fileName),
              })
            }
          }
          ts.forEachChild(child, reference)
        }
        reference(node.initializer)
        graph.push({
          file: relative(root, path),
          symbol: node.name.getText(sf),
          start: node.getStart(sf),
          dependencies: [...dependencies.values()].sort(
            (a, b) => a.file.localeCompare(b.file, "en") || a.start - b.start
          ),
        })
      }
      ts.forEachChild(node, visit)
    }
    visit(sf)
  }
  return graph
}

// El programa y el checker de TypeScript sólo viven en este proceso. Su salida
// es el mismo grafo; terminan antes de construir las ocurrencias del inventario.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(process.argv[2])
  const output = resolve(process.argv[3])
  const paths = JSON.parse(readFileSync(0, "utf8"))
  const inputs = new Set()
  writeFileSync(output, JSON.stringify(bindingGraph(root, paths, inputs)) + "\n")
  process.stdout.write(JSON.stringify([...inputs]) + "\n")
}
