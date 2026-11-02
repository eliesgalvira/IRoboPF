import { readSourceBytes } from "./composicion-r43-archivos.mjs"
import { createHash } from "node:crypto"
import ts from "typescript"
import { verificarFuente } from "./fuente-fijada.mjs"

const rutas = [
  "lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts",
  "lib/dominio/irpf/trabajo-anual/conexion.ts",
  "lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts",
  "lib/dominio/irpf/minimos/derechos.ts",
  "lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts",
  "lib/dominio/analisis-salarial/calculo-salario.ts",
  "lib/dominio/laboral/cotizaciones-sociales.ts",
  "lib/dominio/laboral/cotizaciones-perfil-uniforme.ts",
] as const

/** Censo actual de llamadas y fuentes. No interpreta fórmulas ni hereda los
 * certificados simbólicos R43/R47/R52, cuyo dominio incluía rutas retiradas. */
export function producirContratoMotor() {
  const sources = rutas.map((path) => {
    const bytes = readSourceBytes(path)
    verificarFuente(path, bytes)
    const ast = ts.createSourceFile(
      path,
      bytes.toString(),
      ts.ScriptTarget.Latest,
      true
    )
    const calls: {
      callee: string
      arguments: string[]
      start: number
      end: number
    }[] = []
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node))
        calls.push({
          callee: node.expression.getText(ast),
          arguments: node.arguments.map((a) => a.getText(ast)),
          start: node.getStart(ast),
          end: node.end,
        })
      ts.forEachChild(node, visit)
    }
    visit(ast)
    return {
      path,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      calls,
    }
  })
  return {
    version: "motor-unico-censo-1",
    sources,
    alcance:
      "censo AST de llamadas; semántica contrastada por pruebas de producto",
    gates: {
      admissionClosed: false,
      siteClosed: false,
      wiringAllowed: false,
      completeRuleAcceptance: false,
    },
  }
}
export type ContratoMotor = ReturnType<typeof producirContratoMotor>
const contratoActual = producirContratoMotor()
export function verificarContratoMotor(candidate: ContratoMotor) {
  for (const path of rutas) verificarFuente(path, readSourceBytes(path))
  const expected = contratoActual
  if (JSON.stringify(candidate) !== JSON.stringify(expected))
    throw Error("Contrato del motor distinto de fuentes actuales")
  return candidate
}
