import { test, expect } from "vitest";
import { Effect } from "effect";
import {saveCase,saveFrontierIndex} from "../scripts/procedencia/causal-escalas-r60-testigos-ensayo.mjs";
import { liquidarIrpfAnual, type CasoFiscalAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual";
import { composeCausalEscalas } from "../scripts/procedencia/causal-escalas-r60-contratos.mjs";
import { executeCausalEscalas, verifyCausalEscalas } from "../scripts/procedencia/causal-escalas-r60.mjs";
const base = {
  anio: 2025, comunidadAutonoma: "madrid",
  situacionFamiliar: { tipo: "individual", edad: 40, descendientes: [], ascendientes: [], discapacidad: { _tag: "SinDiscapacidad" } },
  rendimientos: { trabajo: [{ importeIntegroCentimos: 5000000 }], gananciasPatrimoniales: [{ importeGananciaCentimos: 2000000, tratamientoMayores65: { _tag: "SinExencionMayores65" } }] },
  reducciones: [], deducciones: [], retencionesSoportadasCentimos: 100, pagosACuentaCentimos: 101,
} satisfies CasoFiscalAnual;
test("mínimos positivos por rol, fronteras 65/75 y ausencia/cero con diferencial firmado", () => {
  const g = composeCausalEscalas(), ctx = { modo: "canonico" } as const;
  const records: { id: string; file: string; outputs: { siteId: string; decimal: string }[] }[] = [];
  function check(id: string, input: CasoFiscalAnual) {
    const actual = executeCausalEscalas(g, input, ctx, id);
    const real = Effect.runSync(liquidarIrpfAnual(input, ctx));
    expect(real._tag).toBe("LiquidacionIrpfAnualCalculada");
    const sites = new Set(actual.evidence.outputs.map(o => o.siteId));
    const expected = real.rastro.pasos.flatMap(p => p.lineasCalculo ?? []).filter(l => l.origen !== undefined && sites.has(l.origen.siteId)).map(l => ({ siteId: l.origen?.siteId, decimal: l.origen?.decimal }));
    expect(actual.evidence.outputs.map(o => ({ siteId: o.siteId, decimal: o.decimal }))).toEqual(expected);
    expect(verifyCausalEscalas(g, actual.evidence, input, ctx, id)).toBe(true);
    const file=saveCase(input,ctx,actual.evidence);
    records.push({ id, file, outputs: actual.evidence.outputs.map(o => ({ siteId: o.siteId, decimal: o.decimal })) });
    return actual;
  }
  for (const edad of [65, 66, 75, 76]) check("edad-" + edad, { ...base, situacionFamiliar: { ...base.situacionFamiliar, edad } });
  const positive: CasoFiscalAnual = { ...base, situacionFamiliar: { ...base.situacionFamiliar, discapacidad: { _tag: "Discapacidad33a64", necesitaAyudaOMovilidadReducida: true }, descendientes: [{ edad: 2, discapacidad: { _tag: "Discapacidad65OMas" } }], ascendientes: [{ edad: 76, discapacidad: { _tag: "Discapacidad33a64", necesitaAyudaOMovilidadReducida: false } }] } };
  const roles = check("discapacidad-tres-roles", positive);
  expect(Number(roles.evidence.outputs.find(o => o.siteId === "anual.minimo.discapacidad")?.decimal)).toBeGreaterThan(0);
  const zero: CasoFiscalAnual = { ...base, rendimientos: { trabajo: [] } };
  const absent = check("diferencial-negativo-ausencia", zero);
  const explicitZero = { ...zero, deduccionAutonomicaAgregadaCentimos: 0 };
  const present = check("diferencial-negativo-cero", explicitZero);
  expect(0n - 100n - 101n).toBe(-201n);
  expect(absent.evidence.outputs.find(o => o.siteId === "anual.cuota.diferencial")?.decimal).toBe("-2.01");
  expect(present.evidence.outputs.map(o => o.decimal)).toEqual(absent.evidence.outputs.map(o => o.decimal));
  expect(() => verifyCausalEscalas(g, absent.evidence, explicitZero, ctx, "diferencial-negativo-ausencia")).toThrow();
  saveFrontierIndex(records);
}, 600000);
