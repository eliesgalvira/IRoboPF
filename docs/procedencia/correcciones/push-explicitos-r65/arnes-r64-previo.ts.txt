import { expect, test } from "vitest";
import { mkdirSync } from "node:fs";
import { runExplicitos, runBloqueo } from "../scripts/procedencia/causal-explicitos-r62-ensayos.mjs";
test("nueve sitios explícitos: API real, racionales, relaciones y fronteras", () => {
  mkdirSync(".cache/causal-explicitos-r62-sol", { recursive: true });
  expect(runExplicitos()).toMatchObject({ sites: 9, blocked: 1 });
}, 1800000);
test("actividad admitida requiere las familias excluidas y se rechaza causalmente", () => {
  mkdirSync(".cache/causal-explicitos-r62-sol", { recursive: true });
  expect(runBloqueo()).toBe(true);
}, 600000);
