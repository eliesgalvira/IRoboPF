import fs from "node:fs";
import path from "node:path";
import {createRequire} from "node:module";
const require=createRequire("/home/elies/Repos/IRoboPF/package.json");
const ts=require("typescript");
export function loadTs(file, cache = new Map()) {
  file = path.resolve(file)
  if (file.endsWith(".json")) return JSON.parse(fs.readFileSync(file,"utf8"))
  if (cache.has(file)) return cache.get(file)
  const exports = {}
  cache.set(file, exports)
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText
  new Function("require", "exports", js)(
    (name) =>
      name.startsWith(".")
        ? loadTs(path.resolve(path.dirname(file), name) + (name.endsWith(".json") ? "" : ".ts"), cache)
        : require(name),
    exports
  )
  return exports
}
export const real = loadTs("lib/dominio/irpf/trabajo-anual/conexion.ts").liquidarIrpfAnualExplicito;
export const Effect = require("effect").Effect;
