import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import ts from '/home/elies/Repos/IRoboPF/node_modules/typescript/lib/typescript.js'
const root = process.cwd()
const out = []
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = path.join(dir, entry.name)
    if (entry.isDirectory()) scan(name)
    else if (name.endsWith('.ts')) {
      const text = fs.readFileSync(name, 'utf8')
      const source = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true)
      const sha256 = crypto.createHash('sha256').update(text).digest('hex')
      const declarations = []
      const imports = []
      function visit(node) {
        if ((ts.isVariableDeclaration(node) || ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) && node.name && ts.isIdentifier(node.name)) {
          declarations.push({ symbol: node.name.text, start: node.getStart(source), end: node.end, text: node.getText(source) })
        }
        if (ts.isImportDeclaration(node)) imports.push({ start: node.getStart(source), end: node.end, text: node.getText(source) })
        ts.forEachChild(node, visit)
      }
      visit(source)
      out.push({ file: path.relative(root, name), sha256, declarations, imports })
    }
  }
}
scan('lib/dominio')
fs.writeFileSync('docs/procedencia/editorial/flujo-escalas-r21-sol/ast.json', JSON.stringify(out))
