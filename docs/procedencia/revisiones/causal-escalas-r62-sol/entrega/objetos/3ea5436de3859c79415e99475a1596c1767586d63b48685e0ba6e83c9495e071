import { createRequire } from "node:module";
import { verifyRetencionesR34 } from "./flujo-retenciones-r34.mjs";
import { validateSS } from "./flujo-ss-r36.mjs";
import type { SSFragment, SSCase } from "./evidencia-causal-r57.ts";
import type {
  RetFragment,
  AnnualInput,
  ContextInput,
} from "./causal-retenciones-r57.ts";
const { Schema }: typeof import("effect") = createRequire(
  "/home/elies/Repos/IRoboPF/package.json",
)("effect");
const record = Schema.is(Schema.Record(Schema.String, Schema.Unknown));
const caseSchema = Schema.Struct({
  anio: Schema.Number,
  rendimientos: Schema.Struct({
    trabajo: Schema.Array(
      Schema.Struct({ importeIntegroCentimos: Schema.Number }),
    ),
  }),
});
const contextSchema = Schema.Struct({ modo: Schema.String });
export function requireExecutableSS(g: SSFragment): void {
  validateSS(g);
  if (
    g.pending.length > 0 ||
    g.obligations.some((o) => o.status !== "satisfied")
  )
    throw Error("Evidencia insuficiente: obligaciones pendientes");
}
export function requireRetExecutable(g: RetFragment): void {
  verifyRetencionesR34(g);
  if (g.obligations.some((o) => o.status !== "satisfied"))
    throw Error("Evidencia insuficiente: obligaciones pendientes");
  const annualOrder = [
    "retencionTrabajoAeat",
    "retencionTrabajoAeatCentimos",
    "pagosACuentaAplicadosCentimos",
  ];
  const outputOrder = [
    "anual.retencion.base",
    "anual.retencion.cuota",
    "anual.retencion.tipo",
    "anual.retencion.anual",
    "anual.pagos.retenciones",
    "anual.pagos.cuenta",
  ];
  if (
    !annualOrder.every((name, i) => g.annualBindings[i]?.name === name) ||
    !outputOrder.every((site, i) => g.outputBindings[i]?.siteId === site)
  )
    throw Error("Evidencia insuficiente: orden anual de bindings/salidas");
}
function adapted(g: RetFragment): SSFragment {
  const conversionUnits: { id: string; unit: string }[] = [];
  const nodes = new Map(g.program.map((n) => [n.id, n]));
  for (const [name, unit] of [
    ["centimosAEuros", "EUR"],
    ["eurosACentimos", "centimos"],
  ]) {
    const binding = g.globalBindings.find((b) => b.name === name);
    if (binding === undefined) throw Error("Conversión omitida");
    const visit = (id: string): void => {
      const n = nodes.get(id);
      if (n === undefined) throw Error("Nodo ausente");
      if (n.op === "call") conversionUnits.push({ id, unit });
      for (const a of n.args) visit(a);
    };
    visit(binding.node);
  }
  const boundaryUnits: { id: string; unit: string }[] = [];
  for (const binding of g.annualBindings)
    if (binding.name.endsWith("Centimos")) {
      boundaryUnits.push({ id: binding.node, unit: "centimos" });
      const n = nodes.get(binding.node);
      if (
        n?.op === "binary" &&
        n.data.operator === "??" &&
        n.args[1] !== undefined
      )
        boundaryUnits.push({ id: n.args[1], unit: "centimos" });
    }
  for (const n of g.program) {
    if (n.op === "get" && n.data.key?.endsWith("Centimos") === true)
      boundaryUnits.push({ id: n.id, unit: "centimos" });
    if (n.op === "binary" && n.data.operator === "??") {
      const left = nodes.get(n.args[0]);
      const field = g.fieldBindings.find((f) => f.property === left?.data.key);
      if (field !== undefined && n.args[1] !== undefined)
        boundaryUnits.push({ id: n.args[1], unit: field.unit });
    }
  }
  const hundred = g.globalBindings.find((b) => b.name === "CIEN");
  if (hundred !== undefined)
    boundaryUnits.push({ id: hundred.node, unit: "percent-divisor" });
  return {
    ...g,
    pending: [],
    functionUnits: g.globalBindings.flatMap((b) => {
      if (["calcularTipoInicial", "aplicarMinimoContrato"].includes(b.name))
        return [{ id: b.node, unit: "percent" }];
      if (b.name === "multiplicadorDescendiente")
        return [{ id: b.node, unit: "ratio" }];
      if (
        [
          "importeOpcional",
          "incrementoMovilidadGeografica",
          "incrementoGastosDiscapacidadTrabajador",
          "calcularOtrosGastos",
          "calcularReduccionActual",
          "reduccionLineal",
          "calcularReduccionTrabajo",
          "cuantiaMinimoDescendiente",
          "calcularMinimoDescendientes",
          "calcularMinimoAscendientes",
          "minimoDiscapacidad",
          "minimoAsistencia",
          "calcularMinimoDiscapacidad",
          "calcularMinimoPersonalFamiliar",
          "calcularCuotaEscala",
          "calcularCuotaRetencion",
          "cuotaRetencionInicial",
          "calcularLimite43",
          "calcularMinoracionVivienda",
          "calcularDiferenciaPositiva",
        ].includes(b.name)
      )
        return [{ id: b.node, unit: "EUR" }];
      return [];
    }),
    outputBindings: g.outputBindings.map((b) => ({ ...b, node: b.expression })),
    fieldUnits: g.fieldBindings.flatMap((b) =>
      b.reads.map((id) => ({ id, unit: b.unit })),
    ),
    literalUnits: [
      ...g.scaleCells.flatMap((c) => [
        { id: c.id, unit: c.unit },
        { id: c.valueNode, unit: c.unit },
      ]),
      ...conversionUnits,
      ...boundaryUnits,
      ...g.outputBindings.map((b) => ({ id: b.expression, unit: b.unit })),
    ],
  };
}
export function prepareRetenciones(
  g: RetFragment,
  caso: AnnualInput,
  contexto: ContextInput,
): SSFragment {
  requireRetExecutable(g);
  if (
    !record(caso) ||
    !record(contexto) ||
    !["canonico", "compatible-legacy"].includes(String(contexto.modo))
  )
    throw Error("Contexto fuera del dominio técnico");
  if (
    caso.retencionTrabajoAeat !== undefined &&
    (!record(caso.retencionTrabajoAeat) ||
      caso.anio !== caso.retencionTrabajoAeat.anio)
  )
    throw Error(
      "Ejercicio anual/subcaso incoherente; precondición no acreditada",
    );
  return adapted(g);
}
export function prepareSS(
  g: SSFragment,
  caso: SSCase | AnnualInput,
  contexto: ContextInput,
): SSFragment {
  requireExecutableSS(g);
  const input = Schema.decodeUnknownSync(caseSchema)(caso);
  const context = Schema.decodeUnknownSync(contextSchema)(contexto);
  if (
    !Number.isInteger(input.anio) ||
    input.anio < 2012 ||
    input.anio > 2026 ||
    !["canonico", "compatible-legacy"].includes(context.modo)
  )
    throw Error("Fuera del dominio técnico");
  if (
    !Array.isArray(input.rendimientos.trabajo) ||
    input.rendimientos.trabajo.some(
      (x) => !Number.isSafeInteger(x.importeIntegroCentimos),
    )
  )
    throw Error("Trabajo ordinario en céntimos requerido");
  return g;
}
