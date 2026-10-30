// Productor documental estático. No ejecuta ni transpila el motor.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { createRequire } from "node:module"
// @effect-diagnostics effect/nodeBuiltinImport:off
import { readFileSync } from "node:fs"
import { verifyComposition } from "./composicion-r43"
import type { Composition } from "./composicion-r43"
import { producePortContract, verifyPortContract } from "./puertos-composicion-r47"
import type { Source, PortContract } from "./puertos-composicion-r47"
import { hashFile } from "./composicion-r43-archivos.mjs"
const ts: typeof import("typescript") = createRequire("/home/elies/Repos/IRoboPF/package.json")("typescript")
export type Group = "ss" | "retenciones" | "rentas" | "escalas"
interface Data { name?: string; key?: string; target?: string }
interface Operation { id: string; op: string; args: string[]; source: Source; data: Data }
interface Fragment { program: Operation[]; globalBindings: { name: string; node: string | null }[] }
export interface Vertex { id: string; group: Group; node: string; op: string; source: Source }
export interface Edge { from: string; to: string; kind: "operand" | "declaration" | "global" | "port" | "selection"; slot: number; property: string | null; context: string | null }
export interface Pending { node: string; kind: "parameter" | "missing-declaration" | "invocation" | "effective-property" | "selection-execution" | "collection-instance"; detail: string }
export interface OutputRoot { id: string; group: Group; value: string; unit: string; frequency: string; destination: "origen.decimal" }
export interface FamilyRoot { id: string; value: string; call: string; cardinality: string; annualReachable: boolean; destination: string }
export interface Graph {
 version: "grafo-transitivo-r53.1";
 domain: "static-relations-candidate";
 vertices: Vertex[]; edges: Edge[]; outputs: OutputRoot[]; families: FamilyRoot[]; pending: Pending[];
 dependencies: { path: string; sha256: string }[];
 gates: { admissionClosed: false; siteClosed: false; wiringAllowed: false; completeRuleAcceptance: false };
}
const groups: Group[] = ["ss", "retenciones", "rentas", "escalas"]
const key = (group: Group, id: string) => group + "::" + id
function exact(root: import("typescript").Node, start: number, end: number): import("typescript").Node | undefined {
 if(root.getStart() === start && root.end === end) return root
 let found: import("typescript").Node | undefined
 ts.forEachChild(root, child => { if(child.getStart() <= start && child.end >= end) found ??= exact(child,start,end) })
 return found
}
/** Las declaraciones proceden del símbolo léxico del identificador exacto. No busca por nombre/rango de archivo. */
export function produceTransitiveGraph(candidate: Composition, ports: PortContract = producePortContract(candidate)): Graph {
 const checked = verifyComposition(candidate)
 const contract = verifyPortContract(ports, checked)
 const fragments: { [K in Group]: Fragment } = checked.fragments
 const files = [...new Set(groups.flatMap(group => fragments[group].program.map(n=>n.source.file)))]
 const compiler = ts.createProgram(files, { noResolve:true, noLib:true, target:ts.ScriptTarget.Latest })
 const checker = compiler.getTypeChecker()
 const vertices: Vertex[] = [], edges: Edge[] = [], pending: Pending[] = []
 const add = (group: Group, from: string, to: string, kind: Edge["kind"], slot = 0, property: string | null = null, context: string | null = null) => edges.push({from:key(group,from),to:key(group,to),kind,slot,property,context})
 for(const group of groups) {
  const fragment = fragments[group]
  const byRange = new Map(fragment.program.map(n=>[n.source.file+":"+n.source.start+":"+n.source.end,n]))
  const locate = (node: import("typescript").Node) => byRange.get(node.getSourceFile().fileName+":"+node.getStart()+":"+node.end)
  for(const n of fragment.program) {
   vertices.push({id:key(group,n.id),group,node:n.id,op:n.op,source:{file:n.source.file,start:n.source.start,end:n.source.end,sha256:n.source.sha256,offsetEncoding:n.source.offsetEncoding}})
   n.args.forEach((arg,slot)=>add(group,n.id,arg,"operand",slot,n.data.key??null))
   if(n.op === "global") {
    const binding = fragment.globalBindings.find(b=>b.name===n.data.name)
    if(binding !== undefined && binding.node !== null) add(group,n.id,binding.node,"global")
   }
   if(n.op === "local") {
    const source = compiler.getSourceFile(n.source.file)
    const identifier = source === undefined ? undefined : exact(source,n.source.start,n.source.end)
    const declarations = identifier === undefined ? [] : checker.getSymbolAtLocation(identifier)?.declarations ?? []
    let linked = false
    for(const declaration of declarations) {
     let owner = declaration
     const propertyPath: string[] = []
     while(ts.isBindingElement(owner)) {
      const pattern = owner.parent
      propertyPath.unshift(ts.isArrayBindingPattern(pattern) ? String(pattern.elements.indexOf(owner)) : owner.propertyName?.getText()??owner.name.getText())
      owner = pattern.parent
     }
     if(ts.isVariableDeclaration(owner) && owner.initializer !== undefined) {
      const initializer = locate(owner.initializer)
      if(initializer !== undefined) { add(group,n.id,initializer.id,"declaration",0,propertyPath.length === 0 ? null : propertyPath.join(".")); linked=true }
     }
     if(ts.isParameter(owner)) {
      pending.push({node:key(group,n.id),kind:"parameter",detail:owner.getSourceFile().fileName+":"+owner.getStart()+":"+owner.end})
      linked = true
     }
    }
    if(!linked) pending.push({node:key(group,n.id),kind:"missing-declaration",detail:n.data.name??"local sin nombre"})
   }
   if(["call","boundaryCall"].includes(n.op)) pending.push({node:key(group,n.id),kind:"invocation",detail:"Resolver contexto de llamada/retorno efectivo; referencia estática no basta"})
   if(["get","index"].includes(n.op)) pending.push({node:key(group,n.id),kind:"effective-property",detail:n.data.key??"índice dinámico"})
   if(["conditional","if","switch","binary"].includes(n.op) && n.args[0] !== undefined) {
    add(group,n.id,n.args[0],"selection")
    pending.push({node:key(group,n.id),kind:"selection-execution",detail:"Discriminar predicado, cortocircuito y rama realmente alcanzada"})
   }
  }
 }
 for(const p of contract.ports) for(const call of p.calls) for(const output of p.output)
  edges.push({from:key(p.consumer,call.node),to:key(p.provider.group,p.provider.node),kind:"port",slot:0,property:output.path,context:p.id})
 const outputs: OutputRoot[] = []
 const append = (group: Group, bindings: {siteId:string; valueNode?:string|null; expression?:string|null; unit:string;frequency?:string}[]) => {
  for(const output of bindings) {
   const value = output.valueNode??output.expression
   if(value === undefined || value === null) throw Error("Raíz de valor ausente: "+output.siteId)
   outputs.push({id:output.siteId,group,value:key(group,value),unit:output.unit,frequency:output.frequency??"anual",destination:"origen.decimal"})
  }
 }
 append("ss",checked.fragments.ss.outputBindings.map(b=>({...b,valueNode:b.amount})))
 append("retenciones",checked.fragments.retenciones.outputBindings)
 append("escalas",checked.fragments.escalas.outputBindings)
 append("rentas",checked.fragments.rentas.outputs)
 const families: FamilyRoot[] = checked.fragments.rentas.stages.map((s: {id:string;valueNode:string;call:Source;cardinality:string;annualReachable:boolean;outputSite:string}) => {
  const call = fragments.rentas.program.find(n=>n.op === "call" && n.source.file===s.call.file && n.source.start===s.call.start && n.source.end===s.call.end)
  if(call === undefined) throw Error("Llamada exacta de familia ausente: "+s.id)
  pending.push({node:key("rentas",call.id),kind:"collection-instance",detail:"Cardinalidad por entrada, selección y transporte ordenado: "+s.cardinality})
  return {id:s.id,value:key("rentas",s.valueNode),call:key("rentas",call.id),cardinality:s.cardinality,annualReachable:s.annualReachable,destination:s.outputSite}
 })
 const dependencies = [...new Set([...files,...candidate.dependencies.map(d=>d.path),...contract.dependencies.map(d=>d.path),"scripts/procedencia/grafo-transitivo-r53.ts","schemas/procedencia/flujo/grafo-transitivo-r53.schema.json"])].sort().map(path=>({path,sha256:hashFile(path)}))
 return {version:"grafo-transitivo-r53.1",domain:"static-relations-candidate",vertices,edges,outputs,families,pending,dependencies,gates:{admissionClosed:false,siteClosed:false,wiringAllowed:false,completeRuleAcceptance:false}}
}
/** Consume las relaciones aportadas, comprueba extremos/slots/propiedades y rechaza sustracciones aun con hashes restaurados.
 * La reconstrucción es integridad estructural, nunca suficiencia causal. */
export function verifyTransitiveGraph(candidate: Composition, graph: Graph): Graph {
 const expected = produceTransitiveGraph(candidate)
 const schema = JSON.parse(readFileSync("schemas/procedencia/flujo/grafo-transitivo-r53.schema.json","utf8"))
 const Ajv: typeof import("ajv") = createRequire("/home/elies/Repos/IRoboPF/package.json")("ajv")
 const validate = new Ajv({allErrors:true}).compile(schema)
 if(validate(graph) !== true) throw Error("Schema R53: "+JSON.stringify(validate.errors))
 const ids = new Set(graph.vertices.map(v=>v.id))
 if(ids.size !== graph.vertices.length || graph.edges.some(e=>!ids.has(e.from)||!ids.has(e.to))) throw Error("Extremo R53 ausente o duplicado")
 for(const field of ["version","domain","vertices","edges","outputs","families","pending","dependencies","gates"] as const)
  if(JSON.stringify(graph[field]) !== JSON.stringify(expected[field])) throw Error("Relación R53 alterada: "+field)
 return structuredClone(graph)
}
/** Auditoría de alcanzabilidad estática. Un ciclo se informa: visitado no significa satisfecho. */
export function inspectOutput(graph: Graph, root: string) {
 const vertices = new Map(graph.vertices.map(v=>[v.id,v]))
 const adjacent = new Map<string,Edge[]>()
 for(const edge of graph.edges) { const list=adjacent.get(edge.from)??[]; list.push(edge); adjacent.set(edge.from,list) }
 if(!vertices.has(root)) throw Error("Raíz R53 inexistente: "+root)
 const reached=new Set<string>(), active=new Set<string>(), cycles: Edge[]=[]
 const relations: Edge[]=[]
 function visit(id:string):void {
  if(reached.has(id)) return
  reached.add(id);active.add(id)
  for(const edge of adjacent.get(id)??[]) { relations.push(edge); if(active.has(edge.to)) cycles.push(edge); else visit(edge.to) }
  active.delete(id)
 }
 visit(root)
 return {root,relations,cycles,pending:graph.pending.filter(p=>reached.has(p.node)),valueClosed:false,selectionClosed:false,scope:"static-reachability-only"}
}
