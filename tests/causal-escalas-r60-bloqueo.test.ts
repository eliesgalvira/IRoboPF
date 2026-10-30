import { test, expect } from "vitest";
import { actividad } from "../scripts/procedencia/causal-escalas-r60-bloqueo-ensayo.mjs";
import { composeCausalEscalas } from "../scripts/procedencia/causal-escalas-r60-contratos.mjs";
import { executeCausalEscalas } from "../scripts/procedencia/causal-escalas-r60.mjs";
import { Effect } from "effect";
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion";
test("actividad admitida real alcanza aporte excluido: bloqueo local explícito", () => {
  const input = actividad();
  // SAFETY: fixture estructural de la prueba pública previa, que vuelve a pasar por su schema real.
  const real = Effect.runSync(
    liquidarIrpfAnualExplicito(
      input as Parameters<typeof liquidarIrpfAnualExplicito>[0],
    ),
  );
  expect(
    real.rastro.pasos
      .flatMap((p) => p.lineasCalculo ?? [])
      .some((l) => l.origen?.siteId === "anual.explicito.big"),
  ).toBe(true);
  expect(() =>
    executeCausalEscalas(
      composeCausalEscalas(),
      input,
      { modo: "canonico", route: "explicit" },
      "actividad-bloqueada",
    ),
  ).toThrow(
    /BloqueoFamilia: adaptarActividadGeneral.aporte.importeEurosExactos exige calcularActividad2025/,
  );
}, 600000);
import { composeEscalasR36 } from "../scripts/procedencia/flujo-escalas-r36.mjs";
import { consumeEscalasR36 } from "../scripts/procedencia/flujo-escalas-r36-consumidor.mjs";
test("las seis salidas explícitas consumen la propiedad exacta aporte.importeEurosExactos", () => {
  const g = composeEscalasR36(),
    target = g.boundaryContracts.find((b) =>
      b.id.endsWith("#adaptarActividadGeneral"),
    )?.id;
  if (target === undefined) throw Error("Adaptador sin contrato");
  // Testigo de sensibilidad del consumidor anterior; no es un productor ni cierra actividad.
  const run = (importe: string) => {
    const boundaries = new Map();
    boundaries.set("explicit.decode", (x: ReturnType<typeof actividad>) => ({
      _tag: "Success",
      success: x,
    }));
    boundaries.set(target, () => ({
      estado: "aporte-disponible",
      aporte: {
        importeEurosExactos: importe,
        retencionesEuros: "0",
        pagosFraccionadosEuros: "0",
      },
      etapas: [],
    }));
    return consumeEscalasR36(
      g,
      "explicit",
      actividad(),
      { modo: "canonico" },
      boundaries,
    );
  };
  const a = run("10000"),
    b = run("20000");
  if ("evidence" in a || "evidence" in b)
    throw Error("Se esperaba consumidor anterior");
  expect(a.lines).toHaveLength(6);
  expect(b.lines).toHaveLength(6);
  for (let i = 0; i < 6; i++)
    expect(a.lines[i]?.origen.decimal).not.toBe(b.lines[i]?.origen.decimal);
}, 600000);
