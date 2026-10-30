import { test, expect } from "vitest";
import { Effect } from "effect";
import { liquidarIrpfAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual";
import { derechosCaso } from "../scripts/procedencia/causal-escalas-r60-derechos-ensayo.mjs";
import { executeCausalEscalas } from "../scripts/procedencia/causal-escalas-r60.mjs";
import { composeCausalEscalas } from "../scripts/procedencia/causal-escalas-r60-contratos.mjs";
test("derechos preadmitidos conservan orden, divisor por sujeto y API real", () => {
  const c = derechosCaso(),
    ctx = { modo: "canonico", rightsPreadmitted: true };
  // SAFETY: fixture positivo previo; el oracle ejecuta validación y conciliación reales.
  const real = Effect.runSync(
    liquidarIrpfAnual(c as Parameters<typeof liquidarIrpfAnual>[0], {
      modo: "canonico",
    }),
  );
  expect(real._tag).toBe("LiquidacionIrpfAnualCalculada");
  const g = composeCausalEscalas(),
    out = executeCausalEscalas(g, c, ctx, "derechos");
  expect(
    out.evidence.outputs.find((o) => o.siteId === "anual.minimo.descendientes")
      ?.decimal,
  ).toBe("3900");
  const sites = new Set(out.evidence.outputs.map((o) => o.siteId));
  const expected = real.rastro.pasos
    .flatMap((p) => p.lineasCalculo ?? [])
    .filter((l) => l.origen && sites.has(l.origen.siteId))
    .map((l) => ({ siteId: l.origen?.siteId, decimal: l.origen?.decimal }));
  expect(
    out.evidence.outputs.map((o) => ({ siteId: o.siteId, decimal: o.decimal })),
  ).toEqual(expected);
}, 600000);
