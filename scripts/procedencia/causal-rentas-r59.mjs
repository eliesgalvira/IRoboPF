import { executeFiniteCausal } from "./evidencia-causal-r57.ts"
import { causalSlice } from "./evidencia-ejecucion-r54.ts"
import { prepareRentas } from "./causal-rentas-r59-contratos.mjs"
import { isDeepStrictEqual } from "node:util"
import { randomUUID } from "node:crypto"
/** @param {string} execution */
export function executeCausalRentas(
  g,
  caso,
  contexto,
  execution = randomUUID()
) {
  prepareRentas(g, caso, contexto)
  return executeFiniteCausal(g, caso, contexto, execution, {
    kind: "causal-rentas-r59",
  })
}
export function verifyCausalRentas(g, e, caso, contexto, execution) {
  prepareRentas(g, caso, contexto)
  const events = new Map(),
    frames = new Map(e.frames.map((f) => [f.id, f])),
    nodes = new Set(g.program.map((n) => n.id))
  if (frames.size !== e.frames.length) throw Error("Frames duplicados")
  for (const [i, v] of e.events.entries()) {
    if (
      v.id !== execution + ":" + i ||
      !frames.has(v.frame) ||
      (v.node !== null && !nodes.has(v.node))
    )
      throw Error("Identidad/nodo/frame inválido")
    for (const edge of v.edges)
      if (!events.has(edge.to)) throw Error("Productor ausente o futuro")
    const value = v.edges.find((x) => x.role === "value")
    if (value && !isDeepStrictEqual(events.get(value.to).value, v.value))
      throw Error("Alias sin productor")
    if (["array-selection", "collection-selection"].includes(v.operation)) {
      const receivers = v.edges.filter((x) => x.role === "identity:receiver")
      const members = v.edges.filter((x) =>
        x.role.startsWith("identity:element:")
      )
      const input = events.get(receivers[0]?.to)?.value
      if (
        receivers.length !== 1 ||
        !Array.isArray(input) ||
        input.length !== v.value ||
        members.length !== input.length
      )
        throw Error("Colección sin estructura completa")
      members.forEach((m, i) => {
        if (
          m.role !== "identity:element:" + i ||
          !isDeepStrictEqual(events.get(m.to)?.value, input[i])
        )
          throw Error("Pertenencia/índice/orden inválidos")
      })
      if (
        v.operation === "collection-selection" &&
        ["seed", "callback"].some(
          (role) => v.edges.filter((x) => x.role === role).length !== 1
        )
      )
        throw Error("Fold sin semilla/callback")
    }
    events.set(v.id, v)
  }
  if (e.annualBindings.length !== g.annualBindings.length)
    throw Error("Fases omitidas")
  g.annualBindings.forEach((b, i) => {
    const actual = e.annualBindings[i],
      producer = events.get(actual.producer)
    if (
      actual.name !== b.name ||
      producer?.operation !== "annual-binding" ||
      producer.property !== b.name ||
      producer.frame !== actual.frame
    )
      throw Error("Binding/frame sin productor")
  })
  for (const o of e.outputs) {
    const root = events.get(o.root)
    if (
      root?.operation !== "transport" ||
      root.property !== o.siteId ||
      root.value !== o.decimal ||
      root.unit !== "EUR-decimal-string" ||
      !isDeepStrictEqual(o.slice, causalSlice(e.events, o.root))
    )
      throw Error("Transporte o slice inválido")
  }
  if (
    !isDeepStrictEqual(
      e,
      executeCausalRentas(g, caso, contexto, execution).evidence
    )
  )
    throw Error("Ejecución/relaciones/contrato no reproducidos")
  return true
}
