// Productor documental síncrono: analiza firmas; nunca evalúa código financiero.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { createRequire } from "node:module"
// @effect-diagnostics effect/nodeBuiltinImport:off
import { readFileSync } from "node:fs"
import type { Source } from "./puertos-composicion-r47"
const ts: typeof import("typescript") = createRequire("/home/elies/Repos/IRoboPF/package.json")("typescript")
const asts = new Map<string, import("typescript").SourceFile>()
export function signature(source: Source) {
 let ast=asts.get(source.file)
 if(ast === undefined){ast=ts.createSourceFile(source.file,readFileSync(source.file,"utf8"),ts.ScriptTarget.Latest,true);asts.set(source.file,ast)}
 const matches: import("typescript").Node[]=[]
 function visit(n:import("typescript").Node){if(n.getStart()>=source.start && n.end<=source.end && (ts.isFunctionDeclaration(n)||ts.isFunctionExpression(n)||ts.isArrowFunction(n)))matches.push(n);ts.forEachChild(n,visit)}
 visit(ast)
 const fn=matches[0]
 if(fn === undefined || !(ts.isFunctionDeclaration(fn)||ts.isFunctionExpression(fn)||ts.isArrowFunction(fn)))return {parameters:[],returns:null}
 return { parameters:fn.parameters.map((p,index)=>({index,binding:p.name.getText(),type:p.type?.getText()??null,source:{...source,start:p.getStart(),end:p.end}})),returns:fn.type?.getText()??null }
}

const Decimal: typeof import("decimal.js").default = createRequire("/home/elies/Repos/IRoboPF/package.json")("decimal.js").Decimal
/** Frontera de datos ordinarios de las APIs del laboratorio. Las funciones internas de IR
 * atraviesan el router por sus conexiones privadas; el usuario no aporta callbacks financieros. */
export function assertPortInputs(values: ReturnType<typeof import("./flujo-ss-r36-consumidor.mjs").executeFinite>["result"][]) {
 const seen=new WeakSet()
 function visit(value: ReturnType<typeof import("./flujo-ss-r36-consumidor.mjs").executeFinite>["result"]): void {
  if(value instanceof Function)throw Error("Callback externo fuera del dominio de puertos")
  if(value === null || value === undefined || Object(value) !== value)return
  if(Decimal.isDecimal(value) || value instanceof Date)return
  if(seen.has(value))throw Error("Referencia circular fuera del dominio de puertos")
  seen.add(value)
  if(!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null)throw Error("Prototipo fuera del dominio de puertos")
  for(const descriptor of Object.values<PropertyDescriptor>(Object.getOwnPropertyDescriptors(value))){
   if(descriptor.get !== undefined || descriptor.set !== undefined)throw Error("Accessor fuera del dominio de puertos")
   visit(descriptor.value)
  }
  seen.delete(value)
 }
 values.forEach(visit)
}
