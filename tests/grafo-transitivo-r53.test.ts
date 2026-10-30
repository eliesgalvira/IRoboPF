import { expect, it } from "vitest"
import { produceComposition } from "../scripts/procedencia/composicion-r43"
import { produceTransitiveGraph, verifyTransitiveGraph, inspectOutput } from "../scripts/procedencia/grafo-transitivo-r53"
const composition = produceComposition()
const graph = produceTransitiveGraph(composition)
it("R53: universo individual y normalización compartida sin cierres inferidos", () => {
 expect(new Set(graph.outputs.map(o=>o.id)).size).toBe(65)
 expect(new Set(graph.families.map(o=>o.id)).size).toBe(19)
 expect(graph.edges.some(e=>e.kind === "declaration")).toBe(true)
 expect(graph.families.some(f=>!f.annualReachable)).toBe(true)
 expect(graph.pending.length).toBeGreaterThan(0)
 expect(Object.values(graph.gates)).toEqual([false,false,false,false])
})
it("R53: un censo de IDs no sustituye las aristas y restaurar hashes no lo salva", () => {
 const altered=structuredClone(graph)
 altered.edges=[]
 expect(()=>verifyTransitiveGraph(composition,altered)).toThrow(/edges/)
})
it("R53: la propiedad forma parte del vínculo incluso conservando todos los extremos", () => {
 const altered=structuredClone(graph)
 const property=altered.edges.find(e=>e.kind === "port" && e.property === "cotizacionTrabajador")
 expect(property).toBeDefined()
 if(property === undefined) throw Error("Propiedad de SS ausente")
 property.property="cotizacionEmpresarial"
 expect(()=>verifyTransitiveGraph(composition,altered)).toThrow(/edges/)
})
it("R53: cada relación usa el programa propietario y extremo existente", () => {
 const ids=new Set(graph.vertices.map(v=>v.id))
 for(const edge of graph.edges){expect(ids.has(edge.from)).toBe(true);expect(ids.has(edge.to)).toBe(true)}
 for(const root of graph.outputs)expect(ids.has(root.value),root.id).toBe(true)
 for(const root of graph.families){expect(ids.has(root.call),root.id).toBe(true);expect(ids.has(root.value),root.id).toBe(true)}
})
it("R53: pagos soportados llega al caso y no a una estimación por igualdad monetaria", () => {
 const output=graph.outputs.find(o=>o.id === "anual.pagos.retenciones")
 if(output === undefined) throw Error("Salida pagos ausente")
 const slice=inspectOutput(graph,output.value)
 expect(slice.relations.some(e=>e.property === "retencionesSoportadasCentimos")).toBe(true)
 expect(slice.valueClosed).toBe(false)
 expect(slice.selectionClosed).toBe(false)
})
it("R53: cardinalidad cero conserva la obligación de familia; aislada no se admite en anual", () => {
 const family=graph.families.find(f=>f.cardinality === "activos.length")
 if(family === undefined) throw Error("Familia de activos ausente")
 expect(family.annualReachable).toBe(false)
 expect(graph.pending.some(p=>p.node === family.call && p.kind === "collection-instance")).toBe(true)
 expect(inspectOutput(graph,family.value).valueClosed).toBe(false)
})
it("R53: ciclos explícitos no se presentan como obligaciones satisfechas", () => {
 const altered=structuredClone(graph)
 const root=altered.outputs[0]
 if(root === undefined) throw Error("Raíz ausente")
 altered.edges.push({from:root.value,to:root.value,kind:"declaration",slot:0,property:null,context:null})
 const evidence=inspectOutput(altered,root.value)
 expect(evidence.cycles.length).toBeGreaterThan(0)
 expect(evidence.valueClosed).toBe(false)
})
for(const family of graph.families) it("R53: argumento cuarto exacto de "+family.id+" (relación estática, no ejecución)", () => {
 const operand=graph.edges.find(e=>e.from===family.call && e.kind === "operand" && e.slot === 4)
 expect(operand?.to).toBe(family.value)
})
