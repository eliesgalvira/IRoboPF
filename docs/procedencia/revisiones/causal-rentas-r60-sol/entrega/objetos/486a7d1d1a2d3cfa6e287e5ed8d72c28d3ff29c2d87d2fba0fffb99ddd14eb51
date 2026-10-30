import { isDeepStrictEqual } from "node:util"
import { composeRentasR36, verifyRentasR36 } from "./flujo-rentas-r36.mjs"
import { composeSS, validateSS } from "./flujo-ss-r36.mjs"
const same = isDeepStrictEqual
const ssNames = [
  "calcularDesgloseCotizacionesPerfilUniforme",
  "calcularDesgloseCotizacionesSocialesLegacy",
]
/** Composición cerrada por programas: no se identifica ningún productor por importe. */
export function composeCausalRentas() {
  const r = composeRentasR36(),
    s = composeSS()
  verifyRentasR36(r)
  validateSS(s)
  if (s.obligations.some((x) => x.status !== "satisfied"))
    throw Error("SS sin cierre técnico")
  const pattern = (b, p) => {
    const out = { ...b }
    if (b.elements)
      out.elements = b.elements.map((e) =>
        e === null
          ? null
          : {
              ...e,
              binding: pattern(e.binding, p),
              default: e.default ? p + e.default : null,
            }
      )
    if (b.fields)
      out.fields = b.fields.map((f) => ({
        ...f,
        binding: pattern(f.binding, p),
      }))
    return out
  }
  const rename = (g, p) =>
    g.program.map((n) => {
      const data = { ...n.data }
      if (n.op === "global") {
        const name = n.data.name
        if (name === "boundary:medirAuditoriaSync")
          data.name = "medirAuditoriaSync"
        else if (
          name.startsWith("boundary:") &&
          ssNames.includes(name.slice(9))
        )
          data.name = "ss:" + name.slice(9)
        else if (g.globalBindings.some((b) => b.name === name))
          data.name = p + name
      }
      if (n.data.parameters)
        data.parameters = n.data.parameters.map((a) => ({
          ...a,
          binding: pattern(a.binding, p),
          default: a.default ? p + a.default : null,
        }))
      if (n.data.binding) data.binding = pattern(n.data.binding, p)
      return { ...n, id: p + n.id, args: n.args.map((x) => p + x), data }
    })
  const program = [...rename(r, "rentas:"), ...rename(s, "ss:")]
  const globals = [
    ...r.globalBindings
      .filter((b) => b.node)
      .map((b) => ({
        ...b,
        name: "rentas:" + b.name,
        node: "rentas:" + b.node,
      })),
    ...s.globalBindings.map((b) => ({
      ...b,
      name: "ss:" + b.name,
      node: "ss:" + b.node,
    })),
  ]
  const byId = new Map(r.program.map((n) => [n.id, n]))
  const units = [
    ...r.fields.map((f) => {
      const node = byId.get(f.id)
      const owner = byId.get(node?.args[0])
      const expense =
        node?.op === "index" &&
        owner?.op === "global" &&
        owner.data.name.endsWith(":GASTOS_FIJOS_IRPF_LEGACY")
      return {
        id: "rentas:" + f.id,
        unit: expense
          ? "EUR"
          : f.property === "anio"
            ? "ejercicio"
            : f.property === "modo"
              ? "modo"
              : f.unit,
      }
    }),
    ...s.fieldUnits.map((f) => ({ ...f, id: "ss:" + f.id })),
  ]
  const outputBindings = r.outputs
    .filter((o) => o.expression)
    .map((o) => ({
      siteId: o.siteId,
      node: "rentas:" + o.expression,
      unit: o.unit,
    }))
  if (outputBindings.length !== 10)
    throw Error("Vertical general distinta de diez salidas")
  return {
    version: 3,
    kind: "causal-rentas-r59",
    pending: [],
    obligations: [],
    program,
    globalBindings: globals,
    annualBindings: r.annualBindings.map((b) => ({
      ...b,
      node: "rentas:" + b.node,
    })),
    outputBindings,
    sources: [
      ...new Map([...r.sources, ...s.sources].map((x) => [x.file, x])).values(),
    ],
    fieldUnits: units,
    literalUnits: s.literalUnits.map((f) => ({ ...f, id: "ss:" + f.id })),
    functionUnits: r.globalBindings
      .filter((b) =>
        [":centimosAEuros", ":calcularReduccionTrabajoConOtrasRentas"].some(
          (x) => b.name.endsWith(x)
        )
      )
      .map((b) => ({ id: "rentas:" + b.node, unit: "EUR" })),
    lineFunction: "rentas:" + r.roots.crearLineaCalculo,
    participants: { rentas: r, ss: s },
    admissionClosed: false,
    siteClosed: false,
    wiringAllowed: false,
    completeRuleAcceptance: false,
  }
}
/** El estado editorial R36 no autoriza ejecución: se reconstruye el contrato. */
export function prepareRentas(g, caso, contexto) {
  if (!same(g, composeCausalRentas()))
    throw Error("Contrato técnico de rentas no derivado")
  if (
    !Number.isInteger(caso.anio) ||
    caso.anio < 2012 ||
    caso.anio > 2026 ||
    !["canonico", "compatible-legacy"].includes(contexto.modo) ||
    !Array.isArray(caso.rendimientos?.trabajo) ||
    caso.rendimientos.trabajo.some(
      (x) => !Number.isSafeInteger(x.importeIntegroCentimos)
    )
  )
    throw Error("Fuera del dominio ordinario de rentas")
  return g
}
