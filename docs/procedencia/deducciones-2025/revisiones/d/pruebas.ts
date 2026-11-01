// Ejecutar desde la raíz con bun. NODE_PATH puede señalar dependencias ya instaladas.
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS as catalogo } from "../../../../../lib/dominio/normativa/datos/deducciones-autonomicas-2025"
import { evaluarConsignacion } from "../../../../../lib/dominio/irpf/deducciones/contratos-2025"
import { calcularDeduccionesAutonomicasAplicadas as parcial } from "../../../../../lib/dominio/irpf/deducciones-autonomicas-aplicadas"
const root = "docs/procedencia/deducciones-2025/"
const secciones = JSON.parse(readFileSync(root + "lotes/d/secciones-manual.json", "utf8")).secciones
const dictamenes = JSON.parse(readFileSync(root + "lotes/d/dictamenes.json", "utf8")).deducciones
const fichas = catalogo.valor.filter(f => f.codigo in secciones)
let verdes = 0
function prueba(nombre: string, accion: () => void) { accion(); verdes++ }
prueba("cobertura", () => assert.equal(fichas.length, 63))
for (const ficha of fichas) prueba(ficha.codigo, () => assert.deepEqual(ficha.fuenteManual.paginas, secciones[ficha.codigo].paginas))
prueba("alcance corregido", () => { for (const f of fichas) if (f.entradaNecesaria.includes(`${f.codigo}:importe`)) assert(!JSON.stringify(f).includes("aplicar fórmula, límites, prorrateos e incompatibilidades operativas")) })
console.log(`Reproducción independiente de expectativas del autor: ${verdes}/65`)
if (process.argv.includes("--autor")) process.exit(0)
const ambito = { ejercicio: 2025, territorio: "castilla-la-mancha" }
const contexto = { ...ambito, contribuyente: "sujeto-hipotetico", modalidad: "individual" as const }
const entrada = { ...ambito, contribuyente: contexto.contribuyente, codigo: "clm_familia_monoparental", soporte: "supuesto sintético", importe: 123 }
prueba("externo no es automático", () => { const r = evaluarConsignacion(contexto, entrada); assert.equal(r.estado, "importe_externo"); assert.equal((r as any).aceptacionFiscal, "pendiente") })
for (const importe of [-1, NaN, Infinity]) prueba("importe inválido", () => assert.equal(evaluarConsignacion(contexto, {...entrada, importe}).estado, "no_soportado"))
prueba("titular ajeno", () => assert.equal(evaluarConsignacion(contexto, {...entrada, contribuyente: "otro-sujeto-hipotetico"}).estado, "excluida"))
prueba("partos distintos no suman hijos en un solo parto", () => assert.equal(parcial({clmPartosAdopcionesUnHijo: 2, clmNacimientoCumpleLimites: true}, ambito), 200))
prueba("parto doble", () => assert.equal(parcial({clmPartosAdopcionesDosHijos: 1, clmNacimientoCumpleLimites: true}, ambito), 500))
for (const [categoria, discapacidad, esperado] of [["general",false,200],["general",true,300],["especial",false,400],["especial",true,900]] as const) prueba("tabla familia numerosa parcial", () => assert.equal(parcial({clmCategoriaFamiliaNumerosa:categoria, clmFamiliaNumerosaDiscapacidad65:discapacidad,clmFamiliaNumerosaCumpleLimites:true},ambito),esperado))
prueba("discapacidad propia parcial", () => assert.equal(parcial({clmContribuyenteDiscapacidad65:true,clmDiscapacidadContribuyenteCumpleLimites:true},ambito),300))
prueba("ascendientes descendientes parcial", () => assert.equal(parcial({clmAscDescDiscapacidad65:2,clmAscDescDiscapacidadCumpleLimites:true},ambito),600))
console.log(`Comprobaciones técnicas y parciales: ${verdes}; no acreditan derecho completo`)
const rojos: string[] = []
function rojo(nombre: string, accion: () => void) { try {accion()} catch {rojos.push(nombre)} }
const esperados = {
 extremadura_intereses_vivienda_jovenes:"Artículo 11 quater",
 extremadura_donaciones_entidades_culturales_deportistas:"Artículo 11 quinquies",
 extremadura_traslado_residencia_habitual:"Artículo 11 sexies",
 extremadura_ayudas_subvenciones_ela:"Artículo 11 septies",
 extremadura_enfermos_ela_familiares:"Artículo 11 octies",
}
for (const [codigo, articulo] of Object.entries(esperados)) rojo(`referencia documental ${codigo}`,()=>assert(dictamenes.find((r:any)=>r.codigo===codigo).vigencia.articulo.startsWith(articulo)))
rojo("ayudas ELA: no atribuir importe fijo de enfermos",()=>assert(!dictamenes.find((r:any)=>r.codigo==="extremadura_ayudas_subvenciones_ela").comparaciones.some((c:any)=>c.reglaOficial==="2.000 euros anuales por contribuyente.")))
rojo("familiares discapacidad: no importar cuidado de hijos",()=>assert(!dictamenes.find((r:any)=>r.codigo==="extremadura_cuidado_familiares_discapacidad").comparaciones.some((c:any)=>c.reglaOficial.includes("hijos menores de hasta 14"))))
console.log(JSON.stringify({rojosDocumentales:rojos},null,2))
process.exitCode = rojos.length ? 1 : 0
