import assert from "node:assert/strict";
import { test } from "vitest";
import { Schema } from "effect";
import { composeCausalExplicitos } from "../scripts/procedencia/causal-explicitos-r62-contratos.mjs";
import { executeCausalExplicitos } from "../scripts/procedencia/causal-explicitos-r62.mjs";
import { consumeExplicitRentas } from "../scripts/procedencia/flujo-rentas-r36-consumidor.mjs";
import { composeRentasR36 } from "../scripts/procedencia/flujo-rentas-r36.mjs";
import { causalSlice } from "../scripts/procedencia/evidencia-ejecucion-r54";
import { explicit } from "../scripts/procedencia/causal-escalas-r60-casos.mjs";
import { real, Effect } from "../scripts/procedencia/causal-explicitos-r62-oracle.mjs";

const isRecord = Schema.is(Schema.Record(Schema.String, Schema.Json));
const isReturn = Schema.is(Schema.TaggedStruct("LiquidacionIrpfAnualExplicitaCalculada", {
  rastro: Schema.Struct({ pasos: Schema.Array(Schema.Unknown) }),
}));

// La frontera editorial está excluida: se comparan todos los datos del rastro
// anteriores a la incorporación de enlaces documentales, no solo nueve líneas.
function beforeEditorial(value: Schema.Json): Schema.Json {
  if (Array.isArray(value)) return value.map(beforeEditorial);
  if (!isRecord(value)) return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => key !== "procedencia")
    .map(([key, child]) => [key, beforeEditorial(child)]));
}

test.each(["empleo-laboral", "empleo-estatutario", "pension"])(
  "R64-PUSH-01: aliases, retorno y eventos conservados en %s",
  (clase) => {
    const seed = explicit(clase === "pension" ? "0" : "20000", clase);
    const first = seed.trabajo.rendimientos[0];
    assert.ok(first);
    const caso = { ...seed, trabajo: { ...seed.trabajo,
      rendimientos: [{ ...first, id: "a" }, { ...first, id: "b" }],
    }, retenciones: [
      { operacionId: "r1", procedencia: "certificado", ejercicio: 2025, importe: "31.29", efectiva: true },
      { operacionId: "r2", procedencia: "certificado", ejercicio: 2025, importe: "7.13", efectiva: true },
    ] };
    const expected = Effect.runSync(real(caso));
    const execution = "push-r65-" + clase;
    const out = executeCausalExplicitos(composeCausalExplicitos(), caso, { route: "explicit", modo: "canonico" }, execution);
    const events = out.evidence.events;
    assert.deepEqual(events.filter(e => e.operation === "push-length").map(e => e.value), [1, 2]);
    const mutations = events.filter(e => e.operation === "array-push");
    assert.equal(mutations.length, 2);
    assert.deepEqual(mutations.map(e => {
      assert.ok(Array.isArray(e.value));
      return e.value.length;
    }), [1, 2], "el segundo push no reescribe la instantánea del primero");
    const returned = events.find(e => e.operation === "function-return" && isReturn(e.value));
    assert.ok(returned && isReturn(returned.value));
    assert.equal(returned.value.rastro.pasos.length, 2);
    assert.deepEqual(
      beforeEditorial(Schema.decodeUnknownSync(Schema.Json)(returned.value.rastro.pasos)),
      beforeEditorial(Schema.decodeUnknownSync(Schema.Json)(expected.rastro.pasos)),
    );
    const ancestry = causalSlice(events, returned.id);
    for (const mutation of mutations) assert.ok(ancestry.includes(mutation.id), "retorno depende de cada mutación");
    const positions = new Map(events.map((event, position) => [event.id, position]));
    for (const [position, event] of events.entries()) {
      for (const edge of event.edges) {
        const target = positions.get(edge.to);
        assert.ok(target !== undefined && target < position, "arista causal hacia un evento anterior");
      }
    }
    if (clase === "pension") {
      const consumed = consumeExplicitRentas(composeRentasR36(), caso, {}, null, { causal: true, execution });
      assert.deepEqual(consumed.evidence, out.evidence);
    }
  },
  600000,
);
