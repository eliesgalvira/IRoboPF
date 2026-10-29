import ts from "typescript"
import { relative, resolve } from "node:path"
import { readFileSync } from "node:fs"
import { hash } from "./inventario-ast.mjs"

/** Grafo estático de definiciones; no afirma que una rama sea alcanzable. */
export function bindingGraph(root, paths) {
  const program = ts.createProgram(paths, {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.Preserve,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
    noEmit: true,
  })
  const checker = program.getTypeChecker()
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
                symbol: symbol.name,
                file: relative(root, file.fileName),
                start,
                line: file.getLineAndCharacterOfPosition(start).line + 1,
                sha256: hash(readFileSync(file.fileName)),
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
