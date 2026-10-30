import { expect, test } from "vitest";
import { composeSS } from "../scripts/procedencia/flujo-ss-r36.mjs";
import {
  executeCausalSS,
  verifyCausalSS,
} from "../scripts/procedencia/causal-ss-r54.ts";
import { executeCausalSS as previous } from "./fixtures/procedencia/ss-pre-r57.ts";
const g = composeSS();
for (const anio of [2018, 2022, 2023, 2025, 2026])
  for (const modo of ["canonico", "compatible-legacy"])
    test(`núcleo compartido conserva once salidas, frames y relaciones ${anio}/${modo}`, () => {
      for (const amounts of [[], [0], [307, 307], [1234567, 7654321]]) {
        const caso = {
            anio,
            rendimientos: {
              trabajo: amounts.map((importeIntegroCentimos) => ({
                importeIntegroCentimos,
              })),
            },
          },
          contexto = { modo };
        const a = previous(g, caso, contexto, "compatibilidad-r57"),
          b = executeCausalSS(g, caso, contexto, "compatibilidad-r57");
        expect(b.lines).toEqual(a.lines);
        expect({ ...b.evidence, software: [] }).toEqual({
          ...a.evidence,
          software: [],
        });
        expect(
          verifyCausalSS(g, b.evidence, caso, contexto, b.evidence.execution),
        ).toBe(true);
      }
    });
import { inspectSS } from "../scripts/procedencia/flujo-ss-r36.mjs";
import { executeFiniteCausal } from "../scripts/procedencia/evidencia-causal-r57.ts";
test("N01 alcanza también la exportación del núcleo compartido", () => {
  const pending = structuredClone(g);
  pending.pending = [g.obligations[0].id];
  Object.assign(pending, inspectSS(pending, g));
  const caso = { anio: 2025, rendimientos: { trabajo: [] } },
    contexto = { modo: "canonico" };
  expect(() =>
    executeFiniteCausal(pending, caso, contexto, "frontera-compartida", {
      kind: "causal-ss-r54",
    }),
  ).toThrow(/obligaciones pendientes/);
});
import {
  composeRetencionesR34,
  verifyRetencionesR34,
} from "../scripts/procedencia/flujo-retenciones-r34.mjs";
import { executeCausalRetenciones } from "../scripts/procedencia/causal-retenciones-r57.ts";
test("núcleo directo de retenciones deriva preparación y rechaza pendientes/metadatos inyectados", () => {
  const ret = composeRetencionesR34(),
    caso = {
      anio: 2020,
      pagosACuentaCentimos: 123,
      retencionesSoportadasCentimos: 123,
    },
    contexto = { modo: "canonico" };
  expect(
    executeFiniteCausal(ret, caso, contexto, "frontera-ret", {
      kind: "causal-retenciones-r57",
    }),
  ).toEqual(executeCausalRetenciones(ret, caso, contexto, "frontera-ret"));
  const pending = structuredClone(ret);
  pending.obligations[0].status = "pending";
  pending.obligations[0].reason = "contraste pendiente";
  for (const s of pending.sites)
    if (s.siteId !== "anual.pagos.retenciones") {
      s.valueClosed = false;
      s.selectionClosed = false;
    }
  expect(verifyRetencionesR34(pending)).toBe(true);
  expect(() =>
    executeFiniteCausal(pending, caso, contexto, "frontera-ret", {
      kind: "causal-retenciones-r57",
    }),
  ).toThrow(/obligaciones pendientes/);
  Object.assign(ret, {
    functionUnits: [{ id: ret.globalBindings[0].node, unit: "EUR" }],
  });
  expect(() =>
    executeFiniteCausal(ret, caso, contexto, "frontera-ret", {
      kind: "causal-retenciones-r57",
    }),
  ).toThrow(/Campos extra/);
});
test("el orden ejecutado de bindings y salidas procede del contrato, no del llamante", () => {
  const ret = composeRetencionesR34(),
    caso = {
      anio: 2020,
      pagosACuentaCentimos: 123,
      retencionesSoportadasCentimos: 123,
    },
    contexto = { modo: "canonico" };
  ret.outputBindings.reverse();
  expect(verifyRetencionesR34(ret)).toBe(true);
  expect(() =>
    executeFiniteCausal(ret, caso, contexto, "orden-ret", {
      kind: "causal-retenciones-r57",
    }),
  ).toThrow(/orden/);
});
