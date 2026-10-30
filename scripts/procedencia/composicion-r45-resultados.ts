import { verifyComposition } from "./composicion-r43"
import type { Composition } from "./composicion-r43"
import type { CasoRetencionTrabajo, ContextoRetencionTrabajo, RetencionTrabajoCalculada } from "../../lib/dominio/irpf/retenciones/retencion-trabajo-aeat"
import type { CasoActividad2025, ResultadoActividad2025 } from "../../lib/dominio/irpf/actividades-economicas/contrato"
import { executeFinite } from "./flujo-retenciones-r34-consumidor.mjs"
import { executeRentasFinite } from "./flujo-rentas-r36-consumidor.mjs"

export type FiniteOutcome<T> =
 | { status: "success"; operation: string; value: T }
 | { status: "fail"; operation: string; payload: object }
 | { status: "defect"; operation: string; reason: string }
 | { status: "not-reached"; operation: string; condition: "subcase-absent" }

interface FailureMarker { readonly protocol: string }
interface Source { file: string; start: number; end: number; sha256: string; offsetEncoding: string }
interface Operation {
 id: string
 op: string
 args: string[]
 data: { key?: string; name?: string; value?: string | FailureMarker }
 source: Source
}
interface FiniteProgram { program: Operation[] }
const signal = Object.freeze({ protocol: "composicion-r45:finite-effect-fail:v1" })

/** Adaptación exclusiva de Effect.fail(x) a throw de señal con el MISMO operando x.
 * No evalúa TS ni cambia operandos financieros. No equivale a Cause ni a mapError.
 * El consumidor histórico pierde el payload al construir Error; aquí lo conserva.
 */
export function preserveFailureOperands<T extends FiniteProgram>(fragment: T): T {
 const copy = structuredClone(fragment)
 const nodes = new Map(copy.program.map(n => [n.id, n]))
 const extra: Operation[] = []
 copy.program = copy.program.map(n => {
  if (n.op !== "call") return n
  const member = nodes.get(n.args[0] ?? "")
  const owner = nodes.get(member?.args[0] ?? "")
  if (member?.op !== "get" || member.data.key !== "fail" || owner?.op !== "global" || owner.data.name !== "Effect") return n
  if (n.args.length !== 2) throw Error("Aridad Effect.fail no soportada: " + n.id)
  const literal = (suffix: string, value: string | FailureMarker) => {
   const id = n.id + "::r45:" + suffix
   extra.push({ id, op: "literal", args: [], data: { value }, source: n.source })
   return id
  }
  const field = (key: string, value: string) => {
   const id = n.id + "::r45:field:" + key
   extra.push({ id, op: "property", args: [value], data: { key }, source: n.source })
   return id
  }
  const id = n.id + "::r45:signal"
  extra.push({ id, op: "object", args: [field("r45Failure", literal("marker", signal)), field("operation", literal("operation", n.id)), field("payload", n.args[1]!)], data: {}, source: n.source })
  return { ...n, op: "throw", args: [id] }
 })
 copy.program.push(...extra)
 if (new Set(copy.program.map(n => n.id)).size !== copy.program.length) throw Error("Colisión de operación R45")
 return copy
}

/** Solo una señal emitida por el fail IR adaptado concede variante fail.
 * Throws, errores del intérprete y primitivas siguen siendo defectos no utilizables. */
export function captureFinite<T>(operation: string, evaluate: () => T): FiniteOutcome<T> {
 try {
  return { status: "success", operation, value: evaluate() }
 } catch (error) {
  if (error instanceof Object && "r45Failure" in error && error.r45Failure === signal && "operation" in error && "payload" in error && error.payload instanceof Object) {
   return { status: "fail", operation: String(error.operation), payload: error.payload }
  }
  return { status: "defect", operation, reason: String(error) }
 }
}

/** Precondición: fragmento original verificado por el compositor, datos ordinarios.
 * La adaptación se realiza después de verificar, sin promover el fragmento derivado
 * como si tuviera el pin del original. La entrada usa SIEMPRE el subcaso propio.
 */
export function consumeRetentionResult(fragment: Composition["fragments"]["retenciones"], subcase: CasoRetencionTrabajo | undefined, context: ContextoRetencionTrabajo): FiniteOutcome<RetencionTrabajoCalculada> {
 const root = "calcularRetencionTrabajoAeatImpl"
 if (subcase === undefined) return { status: "not-reached", operation: root, condition: "subcase-absent" }
 const adapted = preserveFailureOperands(fragment)
 return captureFinite(root, () => executeFinite(adapted, root, [subcase, context], false).result)
}

/** La API aislada devuelve una unión, no un Effect; conserva sus motivos y etapas. */
export function consumeActivityResult(fragment: Composition["fragments"]["rentas"], input: CasoActividad2025): FiniteOutcome<ResultadoActividad2025> {
 const root = "lib/dominio/irpf/actividades-economicas/calcular.ts:calcularActividad2025"
 const outcome: FiniteOutcome<ResultadoActividad2025> = captureFinite(root, () => executeRentasFinite(fragment, root, [input], false).result)
 if (outcome.status === "success" && outcome.value.estado === "no-soportado") return { status: "fail", operation: root, payload: outcome.value }
 return outcome
}

/** Consumidor condicionado: verifica y clona los cuatro programas originales antes
 * de adaptar fail. No recibe servicios ni callbacks financieros del llamante. */
export function createResultConsumer(candidate: Composition) {
 const { fragments } = verifyComposition(candidate)
 return {
  admissionClosed: false as const,
  siteClosed: false as const,
  wiringAllowed: false as const,
  completeRuleAcceptance: false as const,
  retention(subcase: CasoRetencionTrabajo | undefined, context: ContextoRetencionTrabajo) {
   return consumeRetentionResult(fragments.retenciones, subcase, context)
  },
  activity(input: CasoActividad2025) { return consumeActivityResult(fragments.rentas, input) },
 }
}
