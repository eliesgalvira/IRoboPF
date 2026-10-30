import { test, expect } from "vitest";
import { runEscalasCases } from "../scripts/procedencia/causal-escalas-r60-ensayos.mjs";
test("28 sitios conservan valores y rechazan alteraciones de relaciones", () => {
  const result = runEscalasCases();
  expect(result.covered).toHaveLength(28);
}, 1800000);
import {
  executeCausalEscalas,
  verifyCausalEscalas,
} from "../scripts/procedencia/causal-escalas-r60.mjs";
import { composeCausalEscalas } from "../scripts/procedencia/causal-escalas-r60-contratos.mjs";
import { consumeEscalasR36 } from "../scripts/procedencia/flujo-escalas-r36-consumidor.mjs";
import { composeEscalasR36 } from "../scripts/procedencia/flujo-escalas-r36.mjs";
import { annual } from "../scripts/procedencia/causal-escalas-r60-casos.mjs";
import { executeFiniteCausal } from "../scripts/procedencia/evidencia-causal-r57.ts";
test("todas las API nuevas rechazan metadatos y callbacks financieros suministrados", () => {
  const g = composeCausalEscalas(),
    c = annual(),
    ctx = { modo: "canonico" },
    e = executeCausalEscalas(g, c, ctx, "api").evidence;
  const integrated = consumeEscalasR36(
    composeEscalasR36(),
    "annual",
    c,
    ctx,
    new Map(),
    null,
    { causal: true, execution: "api" },
  );
  if (!("evidence" in integrated)) throw Error("Sin evidencia causal");
  expect(integrated.evidence).toEqual(e);
  expect(
    executeFiniteCausal(g, c, ctx, "api", { kind: "causal-escalas-r60" })
      .evidence,
  ).toEqual(e);
  expect(() =>
    consumeEscalasR36(
      composeEscalasR36(),
      "annual",
      c,
      ctx,
      new Map([["financiero", () => 0]]),
      null,
      { causal: true },
    ),
  ).toThrow();
  const bad = structuredClone(g);
  Object.assign(bad, { obligations: [{ status: "satisfied" }] });
  expect(() => executeCausalEscalas(bad, c, ctx)).toThrow();
  expect(() =>
    executeFiniteCausal(bad, c, ctx, "api", { kind: "causal-escalas-r60" }),
  ).toThrow();
  expect(() => verifyCausalEscalas(bad, e, c, ctx, "api")).toThrow();
}, 600000);
test("racional de base y conversión final conserva céntimos firmados", () => {
  const out = executeCausalEscalas(
    composeCausalEscalas(),
    annual(),
    { modo: "canonico" },
    "racional",
  );
  const amount = (site: string) =>
    out.evidence.outputs.filter((o) => o.siteId === site).map((o) => o.decimal);
  // 50.000 euros menos 6,48% de SS y 2.000 de gastos; otras rentas impiden art20.
  expect(5000000n - (5000000n * 648n) / 10000n - 200000n).toBe(4476000n);
  expect(amount("anual.base.general-imponible")).toEqual(["44760"]);
  expect(amount("anual.base.ahorro")).toEqual(["20000"]);
  expect(amount("anual.cuota.ahorro-componente-postminimo")).toEqual([
    "2040",
    "2040",
  ]);
  const equal = out.evidence.outputs.filter(
    (o) => o.siteId === "anual.cuota.ahorro-componente-postminimo",
  );
  expect(equal[0]?.root).not.toBe(equal[1]?.root);
  const changed = structuredClone(out.evidence);
  const positions = changed.outputs
    .map((o, i) =>
      o.siteId === "anual.cuota.ahorro-componente-postminimo" ? i : -1,
    )
    .filter((i) => i >= 0);
  const first = changed.outputs[positions[0]!],
    second = changed.outputs[positions[1]!];
  if (first === undefined || second === undefined)
    throw Error("Dos componentes exigidos");
  first.root = second.root;
  first.slice = second.slice;
  expect(() =>
    verifyCausalEscalas(
      composeCausalEscalas(),
      changed,
      annual(),
      { modo: "canonico" },
      "racional",
    ),
  ).toThrow();
}, 600000);
import { explicit } from "../scripts/procedencia/causal-escalas-r60-casos.mjs";
test("rechazo tipado de territorio/año y schema explícito, sin convertir a cero", () => {
  const g = composeCausalEscalas();
  for (const [input, ctx] of [
    [annual(2026, "madrid"), { modo: "canonico" }],
    [
      { ...explicit(), conciliacion: undefined },
      { modo: "canonico", route: "explicit" },
    ],
  ] as const) {
    try {
      executeCausalEscalas(g, input, ctx, "rechazo");
      throw Error("Debía rechazar");
    } catch (error) {
      expect(error).toMatchObject({
        domainFailure: { _tag: "ResultadoNoSoportado" },
      });
    }
  }
}, 600000);
import { siteIds } from "../scripts/procedencia/flujo-escalas-r36.mjs";
test("el catálogo exportado y los metadatos devueltos no cambian el contrato aceptante", () => {
  const original = [...siteIds];
  try {
    siteIds.pop();
    expect(() => composeCausalEscalas()).toThrow(/Catálogo R36 alterado/);
  } finally {
    siteIds.splice(0, siteIds.length, ...original);
  }
  const g = composeCausalEscalas(),
    good = structuredClone(g),
    c = annual(),
    ctx = { modo: "canonico" };
  g.participants.escalas.dimensionContracts.final.operation = "payload-ajeno";
  expect(() => executeCausalEscalas(g, c, ctx)).toThrow(
    /Contrato R60 no derivado/,
  );
  expect(() =>
    executeFiniteCausal(g, c, ctx, "alias", { kind: "causal-escalas-r60" }),
  ).toThrow(/Contrato R60 no derivado/);
  expect(() => verifyCausalEscalas(g, {}, c, ctx, "alias")).toThrow(
    /Contrato R60 no derivado/,
  );
  expect(composeCausalEscalas()).toEqual(good);
}, 600000);
