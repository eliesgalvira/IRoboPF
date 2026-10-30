/** Protocolo finito de ocurrencias. Las referencias identifican productores, nunca importes. */
export interface Edge {
  role: string
  to: string
}
export interface Event {
  id: string
  frame: string
  node: string | null
  operation: string
  property: string
  unit: string
  value: unknown
  edges: Edge[]
}
export interface Frame {
  id: string
  parent: string | null
  call: string | null
  function: string | null
}
export interface AnnualBinding {
  name: string
  producer: string
  frame: string
}
export interface Output {
  siteId: string
  decimal: string
  display: unknown
  root: string
  slice: string[]
}
export interface ExecutionEvidence {
  version: 1
  kind: "causal-ss-r54"
  execution: string
  program: string
  software: { file: string; sha256: string }[]
  sources: { file: string; sha256: string }[]
  input: object
  context: object
  frames: Frame[]
  events: Event[]
  annualBindings: AnnualBinding[]
  outputs: Output[]
  admissionClosed: false
  siteClosed: false
  wiringAllowed: false
  completeRuleAcceptance: false
}
export function causalSlice(events: readonly Event[], root: string): string[] {
  const byId = new Map(events.map((e) => [e.id, e]))
  const done = new Set<string>(),
    active = new Set<string>()
  function visit(id: string): void {
    if (active.has(id)) throw Error("Ciclo ejecutado")
    if (done.has(id)) return
    const e = byId.get(id)
    if (e === undefined) throw Error("Referencia ausente: " + id)
    active.add(id)
    for (const edge of e.edges)
      if (!edge.role.startsWith("identity:")) visit(edge.to)
    active.delete(id)
    done.add(id)
  }
  visit(root)
  return [...done].sort(
    (a, b) => Number(a.split(":").at(-1)) - Number(b.split(":").at(-1)),
  )
}
