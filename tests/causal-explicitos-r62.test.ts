import { expect, test } from "vitest";
import { runExplicitos, runBloqueo } from "../scripts/procedencia/causal-explicitos-r62-ensayos.mjs";
test("nueve sitios explícitos: API real, racionales, relaciones y fronteras", () => {
  expect(runExplicitos()).toMatchObject({ sites: 9, blocked: 1 });
}, 1800000);
test("actividad admitida requiere las familias excluidas y se rechaza causalmente", () => {
  expect(runBloqueo()).toBe(true);
}, 600000);
