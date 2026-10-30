import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { executeFiniteCausal } from "./evidencia-causal-r57.ts";
/** @param {string} execution */
export function executeCausalExplicitos(
  g,
  caso,
  contexto,
  execution = randomUUID(),
) {
  return executeFiniteCausal(g, caso, contexto, execution, {
    kind: "causal-explicitos-r62",
  });
}
export function verifyCausalExplicitos(g, e, caso, contexto, execution) {
  if (
    !isDeepStrictEqual(
      e,
      executeCausalExplicitos(g, caso, contexto, execution).evidence,
    )
  )
    throw Error("Ejecución/relaciones/contrato R60 no reproducidos");
  return true;
}
