import { test, expect } from "vitest";
import { Effect } from "effect";
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion";
import { composeCausalEscalas } from "../scripts/procedencia/causal-escalas-r60-contratos.mjs";
import { executeCausalEscalas } from "../scripts/procedencia/causal-escalas-r60.mjs";
import { explicit } from "../scripts/procedencia/causal-escalas-r60-casos.mjs";
test("API real explícita independiente: pensión y empleo, salida y rechazo", () => {
  const g = composeCausalEscalas();
  for (const bruto of ["0", "10000", "16576.01", "50000"])
    for (const clase of ["pension", "empleo-laboral"]) {
      const input = explicit(bruto, clase);
      // El schema de la API real decodifica esta entrada desconocida en runtime.
      // SAFETY: el fixture usa los literales y campos del contrato; no sustituye la validación de la API.
      const result = Effect.runSync(
        liquidarIrpfAnualExplicito(
          input as Parameters<typeof liquidarIrpfAnualExplicito>[0],
        ),
      );
      const actual = executeCausalEscalas(g, input, {
        modo: "canonico",
        route: "explicit",
      });
      const lines = result.rastro.pasos
        .flatMap((p) => p.lineasCalculo ?? [])
        .filter((l) =>
          actual.evidence.outputs.some((a) => a.siteId === l.origen?.siteId),
        );
      expect(
        actual.evidence.outputs.map((o) => ({
          siteId: o.siteId,
          decimal: o.decimal,
          display: o.display,
        })),
      ).toEqual(
        lines.map((l) => ({
          siteId: l.origen?.siteId,
          decimal: l.origen?.decimal,
          display: l.resultado,
        })),
      );
    }
}, 600000);
import { liquidarIrpfAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual";
import { annual } from "../scripts/procedencia/causal-escalas-r60-casos.mjs";
test("API anual real: valores y selección de los 22 sitios generales", () => {
  const g = composeCausalEscalas();
  for (const anio of [2014, 2015, 2025, 2026])
    for (const modo of ["canonico", "compatible-legacy"]) {
      const input = annual(anio, anio === 2026 ? "simulada-estatal" : "madrid");
      // SAFETY: fixture ordinario completo; el ensayo llama a la admisión real y exige éxito.
      const result = Effect.runSync(
        liquidarIrpfAnual(input as Parameters<typeof liquidarIrpfAnual>[0], {
          modo: modo as "canonico" | "compatible-legacy",
        }),
      );
      expect(result._tag).toBe("LiquidacionIrpfAnualCalculada");
      const actual = executeCausalEscalas(g, input, { modo });
      const sites = new Set(actual.evidence.outputs.map((o) => o.siteId));
      const expected = result.rastro.pasos
        .flatMap((p) => p.lineasCalculo ?? [])
        .filter((l) => l.origen && sites.has(l.origen.siteId))
        .map((l) => ({
          siteId: l.origen?.siteId,
          decimal: l.origen?.decimal,
          display: l.resultado,
        }));
      expect(
        actual.evidence.outputs.map((o) => ({
          siteId: o.siteId,
          decimal: o.decimal,
          display: o.display,
        })),
      ).toEqual(expected);
    }
}, 600000);
import { calcularRetencionTrabajoAeat } from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat";
import Decimal from "decimal.js";
test("el diferencial invoca el estimador real con su subcaso independiente", () => {
  const g = composeCausalEscalas(),
    c = annual(2020),
    ctx = { modo: "canonico" } as const;
  const sub = {
    anio: 2020,
    retribucionAnualCentimos: 4020000,
    cotizacionesCentimos: 20000,
    situacionFamiliar: "situacion3",
    situacionLaboral: "activo",
    contrato: "general",
    descendientes: [],
    ascendientes: [],
    discapacidad: "sin-discapacidad",
  } as const;
  const ret = Effect.runSync(calcularRetencionTrabajoAeat(sub, ctx));
  expect(() =>
    executeCausalEscalas(
      g,
      { ...c, retencionTrabajoAeat: { ...sub, anio: 2025 } },
      ctx,
    ),
  ).toThrow(/Ejercicio anual\/subcaso incoherente/);
  const before = executeCausalEscalas(g, c, ctx, "antes"),
    after = executeCausalEscalas(
      g,
      { ...c, retencionTrabajoAeat: sub },
      ctx,
      "estimada",
    );
  const value = (e: typeof before) =>
    e.evidence.outputs.find((o) => o.siteId === "anual.cuota.diferencial")
      ?.decimal;
  expect(
    new Decimal(value(before) ?? "NaN")
      .minus(value(after) ?? "NaN")
      .mul(100)
      .toFixed(),
  ).toBe(String(ret.importeRetencionAnualCentimos));
  expect(
    after.evidence.frames.some((f) => f.function?.startsWith("retenciones:")),
  ).toBe(true);
}, 600000);
