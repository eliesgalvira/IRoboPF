// Dependencia transitiva ya presente; no se instala ni cambia ningún paquete.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { createRequire } from "node:module"
import schema from "../../schemas/procedencia/flujo/puertos-composicion-r47.schema.json"
import type { PortContract } from "./puertos-composicion-r47"
const Ajv: typeof import("ajv") = createRequire("/home/elies/Repos/IRoboPF/package.json")("ajv")
const validate = new Ajv({allErrors:true}).compile(schema)
export function checkPortSchema(contract:PortContract) {
 if(validate(contract) !== true)throw Error("Schema de puertos: "+JSON.stringify(validate.errors))
}
