import { composeRetencionesR34 } from "./flujo-retenciones-r34.mjs";
import { prepareRetenciones } from "./evidencia-causal-r57-contratos.ts";
import { isDeepStrictEqual } from "node:util";
import {
  composeExplicitosIR,
  verifyExplicitosIR,
  dimensionContracts,
} from "./causal-explicitos-r62-ir.mjs";
import { composeCausalRentas } from "./causal-rentas-r59-contratos.mjs";
const declaredR62Sites = Object.freeze(["anual.explicito.trabajo.integro", "anual.explicito.trabajo.gastos-a-e", "anual.explicito.trabajo.gasto-f", "anual.explicito.trabajo.art19", "anual.explicito.trabajo.art20", "anual.explicito.da61", "anual.explicito.retenciones", "anual.explicito.pagos", "anual.explicito.diferencial", "anual.explicito.actividad.etapa"]);
const declaredDimensions = structuredClone(dimensionContracts);
/** Enlace local de llamadas; las familias de actividad no se exportan como raíces. */
export function composeCausalExplicitos() {
  const e = composeExplicitosIR(),
    r = composeCausalRentas();
  verifyExplicitosIR(e);
  if (!isDeepStrictEqual(e.dimensionContracts, declaredDimensions))
    throw Error("Metadatos R36 alterados fuera de sus fuentes");
  if (
    !isDeepStrictEqual(
      e.sites.map((s) => s.siteId).sort(),
      [...declaredR62Sites].sort(),
    ) ||
    !isDeepStrictEqual(
      e.outputBindings.map((s) => s.siteId).sort(),
      [...declaredR62Sites].sort(),
    )
  )
    throw Error("Catálogo R36 alterado: se requieren los 10 sitios declarados");
  const ret = prepareRetenciones(
    composeRetencionesR34(),
    { anio: 2025 },
    { modo: "canonico" },
  );
  const retNames = new Set(ret.globalBindings.map((b) => b.name));
  const retProgram = rename(
    ret.program,
    "retenciones:",
    (name) => (retNames.has(name) ? "retenciones:" + name : name),
    false,
  );
  const prefix = "escalas:";
  const globals = e.globalBindings
    .filter((b) => e.program.find((n) => n.id === b.node).op !== "boundary")
    .map((b) => ({ ...b, name: prefix + b.name, node: prefix + b.node }));
  const link = new Map();
  for (const b of e.globalBindings) {
    if (e.program.find((n) => n.id === b.node).op !== "boundary") continue;
    const [file, symbol] = b.name.split("#");
    const name = file.startsWith("lib/dominio/laboral/")
      ? "ss:" + symbol
      : "rentas:" + file + ":" + symbol;
    if (
      symbol !== "adaptarActividadGeneral" &&
      r.globalBindings.some((b) => b.name === name)
    )
      link.set(b.name, name);
  }
  let program = rename(
    e.program,
    prefix,
    (name) =>
      link.get(name) ??
      (e.globalBindings.some((b) => b.name === name) ? prefix + name : name),
    true,
  );
  // Se incorporan solo definiciones alcanzables, no las 19 familias ni un grafo global.
  const bindings = [
    ...globals,
    ...r.globalBindings,
    ...ret.globalBindings.map((b) => ({
      ...b,
      name: "retenciones:" + b.name,
      node: "retenciones:" + b.node,
    })),
  ];
  const resolve = (name) => bindings.find((b) => b.name === name);
  for (const n of r.program)
    if (n.op === "global" && n.data.name.startsWith("rentas:boundary:")) {
      const symbol = n.data.name.slice("rentas:boundary:".length);
      const b = globals.find((b) => b.name.endsWith("#" + symbol));
      if (b) bindings.push({ name: n.data.name, node: b.node });
      else if (symbol === "calcularCotizacionesSocialesLegacy")
        bindings.push({
          name: n.data.name,
          node: required(
            r.globalBindings.find(
              (b) => b.name === "ss:calcularDesgloseCotizacionesSocialesLegacy",
            ),
          ).node,
        });
    }
  program = program.map((n) =>
    n.op === "boundary"
      ? {
          ...n,
          op: n.data.target.endsWith("#adaptarActividadGeneral")
            ? "blockedFamily"
            : "preadmitted",
          args: [],
        }
      : n,
  );
  for (const b of e.globalBindings.filter(
    (b) =>
      e.program.find((n) => n.id === b.node).op === "boundary" &&
      !link.has(b.name),
  ))
    bindings.push({ name: prefix + b.name, node: prefix + b.node });
  const rentNodes = new Map(r.program.map((n) => [n.id, n]));
  const decodeNodes = [];
  const rp = r.program.map((n) => {
    const fn = rentNodes.get(n.args[0]),
      method = rentNodes.get(fn?.args[0]);
    if (
      n.op !== "call" ||
      fn?.op !== "call" ||
      method?.op !== "get" ||
      method.data.key !== "decodeUnknownResult"
    )
      return n;
    decodeNodes.push({ id: n.id, schema: fn.args[1] });
    return {
      ...n,
      op: "schemaDecode",
      args: n.args.slice(1),
      data: { schema: fn.args[1] },
    };
  });
  const explicitDecode = program.find(
    (n) => n.op === "boundaryCall" && n.data.target === "explicit.decode",
  );
  const original = r.program.find(
    (n) =>
      n.source.file === explicitDecode.source.file &&
      n.source.start === explicitDecode.source.start &&
      n.source.end === explicitDecode.source.end &&
      n.op === "call",
  );
  const schema = decodeNodes.find((n) => n.id === original.id).schema;
  program = program.map((n) =>
    n === explicitDecode ? { ...n, op: "schemaDecode", data: { schema } } : n,
  );
  const serviceNodes = [];
  program = program.map((n) => {
    if (n.op !== "boundaryCall" || n.data.target !== "retencion.calcular")
      return n;
    const id = n.id + ":service";
    serviceNodes.push({
      ...n,
      id,
      op: "global",
      args: [],
      data: { name: "retenciones:calcularRetencionTrabajoAeatImpl" },
    });
    return { ...n, op: "call", args: [id, ...n.args] };
  });
  const all = new Map(
    [...program, ...rp, ...retProgram, ...serviceNodes].map((n) => [n.id, n]),
  );
  const entries = {
    annual:
      prefix +
      "lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts#liquidarTrabajoIndividualSimple",
    explicit:
      prefix +
      "lib/dominio/irpf/trabajo-anual/conexion.ts#liquidarIrpfAnualExplicito",
  };
  const seen = new Set(),
    used = new Set();
  function visit(id) {
    if (seen.has(id)) return;
    seen.add(id);
    const n = all.get(id);
    if (!n) throw Error("Nodo ausente " + id);
    for (const a of n.args) visit(a);
    const visitPattern = (p) => {
      for (const f of p.fields ?? []) {
        if (f.default) visit(f.default);
        visitPattern(f.binding);
      }
      for (const f of p.elements ?? [])
        if (f) {
          if (f.default) visit(f.default);
          visitPattern(f.binding);
        }
    };
    if (n.data.binding) visitPattern(n.data.binding);
    for (const p of n.data.parameters ?? []) {
      if (p.default) visit(p.default);
      visitPattern(p.binding);
    }
    if (n.op === "global") {
      const b = resolve(n.data.name);
      if (!b && n.data.name.includes("boundary:"))
        throw Error("Frontera financiera sin enlace: " + n.data.name);
      if (b) {
        used.add(b.name);
        visit(b.node);
      }
    }
  }
  for (const name of [entries.explicit]) {
    const b = required(resolve(name));
    used.add(name);
    visit(b.node);
  }
  const line = required(
    globals.find((b) => b.name.endsWith("#crearLineaCalculo")),
  ).node;
  return structuredClone({
    version: 5,
    kind: "causal-explicitos-r62",
    pending: [],
    obligations: [],
    program: [...all.values()].filter((n) => seen.has(n.id)),
    globalBindings: bindings.filter((b) => used.has(b.name)),
    annualBindings: [],
    outputBindings: e.outputBindings.map((b) => ({
      siteId: b.siteId,
      node: prefix + b.valueNode,
      unit: "EUR",
    })),
    sources: [
      ...new Map(
        [...e.sources, ...r.sources, ...ret.sources].map((s) => [s.file, s]),
      ).values(),
    ],
    fieldUnits: [
      ...e.propertyBindings.map((b) => ({ id: prefix + b.id, unit: ["integro", "gastosAE", "generalesAplicados", "rendimientoAntesArt20", "argumentoArt20", "importeAplicable", "cuotaPosterior", "importe"].includes(b.property) ? "EUR" : b.unit })),
      ...r.fieldUnits,
      ...ret.fieldUnits.map((f) => ({ ...f, id: "retenciones:" + f.id })),
    ],
    literalUnits: [
      ...r.literalUnits,
      ...ret.literalUnits.map((f) => ({ ...f, id: "retenciones:" + f.id })),
      ...e.outputBindings.map((b) => ({
        id: prefix + b.valueNode,
        unit: "EUR",
      })),
    ],
    functionUnits: [
      ...r.functionUnits,
      ...(ret.functionUnits ?? []).map((f) => ({
        ...f,
        id: "retenciones:" + f.id,
      })),
    ],
    entryPoints: entries,
    lineNode: line,
    schemaProgram: r,
    participants: { escalas: e },
    admissionClosed: false,
    siteClosed: false,
    wiringAllowed: false,
    completeRuleAcceptance: false,
  });
}
export function prepareExplicitos(g, caso, contexto) {
  if (contexto.route !== "explicit" || contexto.modo !== "canonico") throw Error("R62 requiere ruta explicit y modo canonico");
  if (!isDeepStrictEqual(g, composeCausalExplicitos()))
    throw Error("Contrato R62 no derivado");
  if (
    !["canonico", "compatible-legacy"].includes(contexto.modo) ||
    !["annual", "explicit"].includes(contexto.route ?? "annual")
  )
    throw Error("Contexto R62 fuera de contrato");
  if (
    (contexto.route ?? "annual") === "annual" &&
    (!Number.isInteger(caso.anio) ||
      caso.anio < 2012 ||
      caso.anio > 2026 ||
      !Array.isArray(caso.rendimientos?.trabajo))
  )
    throw Error("Entrada anual fuera de contrato");
  if ((contexto.route ?? "annual") === "annual") {
    if (
      !Number.isSafeInteger(caso.pagosACuentaCentimos) ||
      !Number.isSafeInteger(caso.retencionesSoportadasCentimos) ||
      caso.rendimientos.trabajo.some(
        (x) => !Number.isSafeInteger(x.importeIntegroCentimos),
      ) ||
      !Array.isArray(caso.deducciones) ||
      caso.deducciones.length !== 0
    )
      throw Error(
        "Fuera del contrato anual previamente admitido: céntimos enteros y ausencia de códigos",
      );
    if (
      caso.derechosMinimos !== undefined &&
      contexto.rightsPreadmitted !== true
    )
      throw Error(
        "Derechos requieren preadmisión externa explícita; no se acredita en R62",
      );
  }
  if (
    caso.retencionTrabajoAeat !== undefined &&
    caso.anio !== caso.retencionTrabajoAeat.anio
  )
    throw Error(
      "Ejercicio anual/subcaso incoherente; precondición no acreditada",
    );
  return g;
}

function required(value) {
  if (value === undefined) throw Error("Contrato sin extremo requerido");
  return value;
}

function renamePattern(p, prefix, legacy) {
  const out = { ...p };
  if (p.fields)
    out.fields = p.fields.map((f) => ({
      ...f,
      binding: renamePattern(f.binding, prefix, legacy),
      default: f.default ? prefix + f.default : null,
    }));
  if (p.elements)
    out.elements = p.elements.map((f) =>
      f === null
        ? null
        : legacy
          ? { binding: renamePattern(f, prefix, legacy), default: null }
          : {
              ...f,
              binding: renamePattern(f.binding, prefix, legacy),
              default: f.default ? prefix + f.default : null,
            },
    );
  return out;
}
function rename(program, prefix, globalName, legacy) {
  return program.map((n) => {
    const data = { ...n.data };
    if (n.op === "global") data.name = globalName(n.data.name);
    if (n.data.parameters)
      data.parameters = n.data.parameters.map((p) => ({
        ...p,
        binding: renamePattern(p.binding, prefix, legacy),
        default: p.default ? prefix + p.default : null,
      }));
    if (n.data.binding)
      data.binding = renamePattern(n.data.binding, prefix, legacy);
    return {
      ...n,
      id: prefix + n.id,
      args: n.args.map((a) => prefix + a),
      data,
    };
  });
}
