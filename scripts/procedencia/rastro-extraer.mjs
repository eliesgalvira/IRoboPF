import ts from "typescript"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { hash } from "../../lib/procedencia/verificador.ts"

export function extraerPuntosTexto(texto, archivo) {
  const source = ts.createSourceFile(
    archivo,
    texto,
    ts.ScriptTarget.Latest,
    true
  )
  const puntos = []
  const ids = new Set()
  function visitar(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "crearLineaCalculo"
    ) {
      const arg = node.arguments[0]
      if (node.arguments.length !== 1 || !ts.isObjectLiteralExpression(arg))
        throw new Error("Punto del rastro sin objeto literal")
      const props = new Map()
      for (const p of arg.properties) {
        if (
          !ts.isPropertyAssignment(p) ||
          !ts.isIdentifier(p.name) ||
          props.has(p.name.text)
        )
          throw new Error("Propiedad del punto ambigua")
        props.set(p.name.text, p.initializer)
      }
      if (
        props.size !== 6 ||
        ![
          "siteId",
          "instancia",
          "importe",
          "unidad",
          "etiqueta",
          "formula",
        ].every((k) => props.has(k))
      )
        throw new Error("Contrato del punto incompleto")
      const id = props.get("siteId"),
        unidad = props.get("unidad"),
        etiqueta = props.get("etiqueta")
      if (
        !ts.isStringLiteral(id) ||
        !/^[a-z][a-z0-9.-]{0,159}$/.test(id.text) ||
        ids.has(id.text)
      )
        throw new Error("Identidad del punto dinámica o repetida")
      if (
        !ts.isStringLiteral(unidad) ||
        !["EUR", "percent"].includes(unidad.text)
      )
        throw new Error("Unidad del punto no explícita")
      ids.add(id.text)
      puntos.push({
        siteId: id.text,
        unidad: unidad.text,
        titulo: ts.isStringLiteral(etiqueta)
          ? etiqueta.text
          : `Paso del cálculo ${id.text}`,
        expresion: props.get("importe").getText(source),
        formula: props.get("formula").getText(source),
        fuente: {
          archivo,
          sha256: hash(texto),
          localizador: JSON.stringify({
            inicio: node.getStart(source),
            fin: node.end,
            siteId: id.text,
          }),
        },
      })
    }
    ts.forEachChild(node, visitar)
  }
  visitar(source)
  return puntos
}

export function extraerPuntos(root, generationInputs) {
  const puntos = [],
    fuentes = []
  for (const input of generationInputs) {
    if (!input.file.startsWith("lib/dominio/") || !input.file.endsWith(".ts"))
      continue
    const bytes = readFileSync(resolve(root, input.file))
    if (hash(bytes) !== input.sha256)
      throw new Error("Fuente del rastro distinta del inventario")
    const encontrados = extraerPuntosTexto(bytes.toString("utf8"), input.file)
    if (encontrados.length > 0) fuentes.push({ archivo: input.file, bytes })
    puntos.push(...encontrados)
  }
  if (new Set(puntos.map((p) => p.siteId)).size !== puntos.length)
    throw new Error("Punto del rastro repetido entre módulos")
  return {
    puntos: puntos.sort((a, b) => a.siteId.localeCompare(b.siteId)),
    fuentes,
  }
}
