import { createRequire } from "node:module";
import { executeRentasFinite } from "./flujo-rentas-r36-consumidor.mjs";
const { Schema } = createRequire("/home/elies/Repos/IRoboPF/package.json")(
  "effect",
);
/** Exclusivamente decodificación estructural de contratos; no evalúa cuerpos financieros. */
export function decodeEscalasSchema(program, id, value) {
  let node = program.program.find((n) => n.id === id);
  if (node?.op === "global") {
    const binding = program.globalBindings.find(
      (b) => b.name === node.data.name,
    );
    node = program.program.find((n) => n.id === binding?.node);
  }
  if (!node || !/\/[^/]*contrato\.ts$/.test(node.source.file))
    throw Error("Schema fuera de contrato estructural");
  const schema = executeRentasFinite(program, null, [], false, id).result;
  return Schema.decodeUnknownResult(schema)(value, {
    onExcessProperty: "error",
  });
}
