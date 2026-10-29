import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";

const pin = {
  path: "docs/procedencia/correcciones/madrid-nominal-r29/decision-nominal.json",
  sha256: "49deb823a7f462bcf12817b1d59f7e83a0a7ac16d9af8e5557ee6733bc5eb6f5",
};
const data = (name) =>
  JSON.parse(
    readFileSync(
      new URL(
        `../../schemas/procedencia/nominal-${name}.schema.json`,
        import.meta.url,
      ),
      "utf8",
    ),
  ).const;
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");

function parseExact(raw) {
  const text = raw.toString("utf8");
  const value = JSON.parse(text);
  const stack = [];
  let previous;
  for (const token of text.match(/"(?:\\.|[^"\\])*"|[{}\[\]:,]/g) ?? []) {
    if (token === "{") stack.push(new Set());
    else if (token === "[") stack.push(null);
    else if (token === "}" || token === "]") stack.pop();
    else if (token === ":") {
      const key = JSON.parse(previous);
      const keys = stack.at(-1);
      if (keys.has(key)) throw new Error("Clave JSON nominal duplicada");
      keys.add(key);
    }
    previous = token;
  }
  return value;
}

// Cierre ya conservado, con originales suministrados por hash. No crea autoridad.
export function verificarNominalPublicado(
  payloadHash,
  sujeto,
  dependencias,
  leer,
) {
  const paths = new Map();
  const observed = new Map();
  for (const d of dependencias) {
    if (paths.has(d.path)) throw new Error("Dependencia nominal duplicada");
    paths.set(d.path, d.sha256);
  }
  const bytes = (ref) => {
    if (paths.get(ref.path) !== ref.sha256)
      throw new Error("Referencia nominal cruzada");
    const raw = leer(ref.sha256);
    if (sha(raw) !== ref.sha256) throw new Error("Bytes nominales alterados");
    observed.set(ref.path, ref);
    return raw;
  };
  const json = (ref) => parseExact(bytes(ref));
  const registryPath = "docs/procedencia/enlaces/registro.json";
  const registro = json({
    path: registryPath,
    sha256: paths.get(registryPath),
  });
  const entries = registro.entries.filter(
    (e) => e.payload.sha256 === payloadHash,
  );
  if (entries.length !== 1 || entries[0].attestation !== null)
    throw new Error("Binding nominal requiere revisión pendiente");
  const p = json(entries[0].payload);
  if (
    p.schemaVersion !== 3 ||
    p.itemId !== sujeto ||
    !isDeepStrictEqual(p.legalReview.decisions, pin)
  )
    throw new Error("Ancla nominal no autorizada");
  assert.match(p.authorTaskId, /\S/);
  assert.match(p.id, /\S/);
  const payloadKeys = [
    "schemaVersion",
    "id",
    "authorTaskId",
    "inventory",
    "itemId",
    "source",
    "scope",
    "conversion",
    "citation",
    "document",
    "legalReview",
    "executableScope",
  ];
  if (
    !isDeepStrictEqual(Object.keys(p).sort(), payloadKeys.sort()) ||
    !p.authorTaskId ||
    !p.id
  )
    throw new Error("Payload nominal ambiguo");
  const decisions = json(pin);
  if (decisions.length !== 1 || decisions[0].id !== p.legalReview.decisionId)
    throw new Error("Decisión nominal ambigua");
  const d = decisions[0];
  if (
    [d.independentReviewerTaskId, d.projectionAuthorTaskId].includes(
      p.authorTaskId,
    )
  )
    throw new Error("Autoría nominal no independiente");
  const a = json(p.executableScope);
  const { decision, ...projection } = a;
  const expectedScope = {
    year: d.year,
    territory: d.territory,
    unit: d.unit,
    claim: d.meaning,
    conditions: d.conditions,
    completeRule: false,
  };
  if (
    !isDeepStrictEqual(projection, data("projection")) ||
    !isDeepStrictEqual(decision, p.legalReview) ||
    !isDeepStrictEqual(p.scope, expectedScope) ||
    !isDeepStrictEqual(p.source, a.source) ||
    !isDeepStrictEqual(p.inventory, a.inventory) ||
    p.itemId !== a.itemId ||
    p.conversion !== "identity"
  )
    throw new Error("Proposición nominal alterada");
  const closure = data("dependencies");
  for (const [key, kind] of [
    ["citation", "citation"],
    ["document", "document-manifest"],
  ]) {
    const ref = closure.documents.find((r) => r.kind === kind);
    if (!isDeepStrictEqual(p[key], { path: ref.path, sha256: ref.sha256 }))
      throw new Error("Referencia nominal cruzada");
  }
  for (const ref of closure.documents) bytes(ref);
  for (const blob of closure.blobs) {
    const raw = leer(blob.sha256);
    if (
      sha(raw) !== blob.sha256 ||
      raw.length !== blob.size ||
      createHash("sha512").update(raw).digest("hex") !== blob.sha512
    )
      throw new Error("Original contextual alterado");
  }
  const sourceBytes = leer(p.source.sha256);
  if (sha(sourceBytes) !== p.source.sha256)
    throw new Error("Fuente nominal alterada");
  for (const ref of observed.values()) bytes(ref);
  for (const blob of closure.blobs) {
    if (sha(leer(blob.sha256)) !== blob.sha256)
      throw new Error("Original cambió durante la lectura");
  }
  if (sha(leer(p.source.sha256)) !== p.source.sha256)
    throw new Error("Fuente cambió durante la lectura");
  return {
    scope: a,
    bindingReview: "pending",
    authenticity: "trust-indeterminate",
    applicability: "not-established",
    completeRuleAcceptance: false,
  };
}

export function seleccionarContextoNominal() {
  throw new Error("La proposición nominal no selecciona ningún contexto civil");
}
