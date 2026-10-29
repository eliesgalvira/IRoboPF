import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import zlib from 'node:zlib'
import ts from '/home/elies/Repos/IRoboPF/node_modules/typescript/lib/typescript.js'
const output = 'docs/procedencia/editorial/flujo-escalas-r23-sol'
const modules = []
function scan(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name)
    if (item.isDirectory()) scan(file)
    else if (file.endsWith('.ts')) {
      const text = fs.readFileSync(file, 'utf8')
      const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)
      const source = { file, sha256: crypto.createHash('sha256').update(text).digest('hex'), offsetEncoding: 'utf16' }
      const facts = []
      function walk(node, owner) {
        const declaration = (ts.isVariableDeclaration(node) || ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) && node.name && ts.isIdentifier(node.name)
        const scope = declaration ? `${node.name.text}@${node.getStart(sf)}` : owner
        let kind
        if (declaration) kind = 'declaration'
        else if (ts.isImportDeclaration(node)) kind = 'import'
        else if (ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node)) kind = 'property'
        else if (ts.isReturnStatement(node)) kind = 'return'
        else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) kind = 'assignment'
        else if (ts.isCallExpression(node)) kind = 'call'
        else if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) kind = 'literal'
        else if (ts.isConditionalExpression(node) || ts.isIfStatement(node)) kind = 'branch'
        if (kind) facts.push({kind, owner:scope, symbol:declaration ? node.name.text : null, source:{...source,start:node.getStart(sf),end:node.end}, text:node.getText(sf)})
        ts.forEachChild(node, (child) => walk(child, scope))
      }
      walk(sf, '<module>')
      modules.push({ ...source, facts })
    }
  }
}
scan('lib/dominio')
fs.writeFileSync(`${output}/fuentes.json.gz`, zlib.gzipSync(JSON.stringify({notice:'Hechos sintácticos, nunca aristas semánticas inferidas por contención.',modules})))
console.log(`${modules.length} módulos; rangos UTF16 y tokens separados de declaraciones`)
