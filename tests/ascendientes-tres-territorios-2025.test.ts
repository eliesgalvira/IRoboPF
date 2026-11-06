import { expect, it } from "vitest"
import { Effect } from "effect"
import Decimal from "decimal.js"
import { analitico, efectivo, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { producirAscendientes2025, diasAscendiente2025, type AscendienteAnual2025 } from "../lib/dominio/irpf/minimos/ascendientes-2025"
import type { DerechosMinimosAnuales } from "../lib/dominio/irpf/minimos/derechos-contrato"
import oraculos from "./ascendientes-oraculos.json"

if (efectivo.perfil !== "solo-trabajo") throw new Error("Fixture empleo requerida")
const trabajo = efectivo.trabajo
const ausencia = { perfil: "sin-rentas", exhaustividad: "completa", soporte: "ausencia-sintetica" } as const
function asc(n = 1): AscendienteAnual2025 {
  return { sujetoId: "s-3", fechaNacimiento: "1949-01-01", situacionDevengo: "vivo", gradoDiscapacidad: 0,
    ayudaOMovilidadReducida: false, claseDiscapacidad: "fisica", permanente: false, soporteDiscapacidad: "sin-discapacidad",
    declaracion: "no-presenta", economia: ausencia, titularesCompletos: true,
    titulares: Array.from({ length: n }, (_,i) => ({ titularId: `s-${i+1}`, grado: 1, vinculo: "consanguinidad", residenteIrpf: true,
      declaracion: "individual", economia: { perfil: "solo-trabajo", exhaustividad: "completa", soporte: "economia-titular", otrasRentas: "ninguna", trabajo },
      convivencia: [{ desde: "2025-01-01", hasta: "2025-12-31" }], internamientoEspecializado: [], dependenciaEconomica: false, soporte: "parentesco-padron" })) }
}
const libro = (a: AscendienteAnual2025) => producirAscendientes2025([a], "s-1", "madrid")[0]!
it.each([182,183,184])("convivencia %i días: umbral legal mitad de365",dias=>{
  const hasta = dias === 182 ? "2025-07-01" : dias === 183 ? "2025-07-02" : "2025-07-03"
  const a=asc();const t=a.titulares[0]!
  const r=libro({...a,titulares:[{...t,convivencia:[{desde:"2025-01-01",hasta}]}]})
  expect(r.titularesMinimo).toEqual(dias>=183?["s-1"]:[])
})
it.each(["2025-02-30","2024-12-31"])("fecha o período no soportado %s",hasta=>{
 expect(()=>diasAscendiente2025([{desde:"2025-01-01",hasta}])).toThrow()
})
it("solapamiento no duplica convivencia",()=>expect(()=>diasAscendiente2025([{desde:"2025-01-01",hasta:"2025-08-01"},{desde:"2025-08-01",hasta:"2025-12-31"}])).toThrow())
it.each([65,66,75,76])("edad %i sin discapacidad",edad=>expect(libro({...asc(),fechaNacimiento:`${2025-edad}-01-01`}).titularesMinimo).toEqual(edad>65?["s-1"]:[]))
it("discapacidad abre mínimo sin edad65",()=>expect(libro({...asc(),fechaNacimiento:"1970-01-01",gradoDiscapacidad:33}).titularesMinimo).toEqual(["s-1"]))
function pension(bruto:string) { return {...ausencia,perfil:"solo-trabajo",otrasRentas:"ninguna",trabajo:{...trabajo,rendimientos:[{...trabajo.rendimientos[0]!,clase:"pension",integro:bruto,cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"}}]}} as const }
it.each([["10000",true],["10000.01",false]])("renta8000 antes art20: pensión%s",(bruto,cumple)=>expect(libro({...asc(),economia:pension(bruto)}).titularesMinimo.length>0).toBe(cumple))
it.each([["3800",true],["3800.01",false]])("declaración1800: pensión%s",(bruto,cumple)=>expect(libro({...asc(),declaracion:"individual",economia:pension(bruto)}).titularesMinimo.length>0).toBe(cumple))
it("presentar declaración sin renta no elimina derecho",()=>expect(libro({...asc(),declaracion:"individual"}).titularesMinimo).toEqual(["s-1"]))
it.each(["conjunta","fallecido"])("rechazo productor motivado%s",rama=>{
 const a=asc();expect(()=>libro(rama==="conjunta"?{...a,declaracion:"conjunta"}:{...a,situacionDevengo:"fallecido",fechaFallecimiento:"2025-10-01"})).toThrow(/conjunta|fallecimiento/)
})
it("prioridad de grado y excepción de renta del cercano",()=>{
 const a=asc(2),t=a.titulares[1]!
 expect(libro({...a,titulares:[a.titulares[0]!,{...t,grado:2}]}).titularesMinimo).toEqual(["s-1"])
 expect(libro({...a,titulares:[{...a.titulares[0]!,economia:ausencia},{...t,grado:2}]}).titularesMinimo).toEqual(["s-2"])
})
it("no residente no participa en prorrateo",()=>{const a=asc(2);expect(libro({...a,titulares:[a.titulares[0]!,{...a.titulares[1]!,residenteIrpf:false}]}).titularesMinimo).toEqual(["s-1"])})
it("rechaza identidad propia y titular duplicado",()=>{const a=asc();expect(()=>libro({...a,sujetoId:"s-1"})).toThrow();expect(()=>libro({...a,titulares:[a.titulares[0]!,a.titulares[0]!]})).toThrow()})
it.each(oraculos)("ambas API: $territorio $titulares titulares; cuota única Fraction",o=>{
 const territorio = o.territorio === "madrid" ? "madrid" : o.territorio === "castilla-la-mancha" ? "castilla-la-mancha" : "comunitat-valenciana"
 const a=asc(o.titulares)
 const d: DerechosMinimosAnuales={...derechos,territorio,descendientes:[],ascendientes:[a],ascendientesCompletos:true}
 const codigo=territorio==="madrid"?"madrid_cuidado_ascendientes":territorio==="castilla-la-mancha"?"clm_cuidado_ascendientes_mayores_75":"valenciana_ascendientes_mayores_discapacidad"
 const territorial=territorio==="madrid"?{solicitudes:[{lote:"F-ampliado",codigo:"madrid_cuidado_ascendientes",hechos:{personas:[{id:"s-3",relacion:"ascendiente"}]}}]} as const:territorio==="castilla-la-mancha"?{solicitudes:[{lote:"CLM",codigo:"clm_cuidado_ascendientes_mayores_75",hechos:{exhaustividad:"todos_los_ascendientes",ascendientes:[{id:"s-3",nacimiento:a.fechaNacimiento,grado:0,diasCentro:30,diasConvalecenciaSescam:0,titularesMinimo:a.titulares.map(t=>t.titularId)}]}}]} as const:undefined
 const valenciana=territorio!=="comunitat-valenciana"?undefined:{ejercicio:2025,territorio,modalidad:"individual",devengo:"2025-12-31",contribuyente:"s-1",cantidades:[],solicitudes:[{codigo,eleccion:"aplicar",unidades:[{id:"u",fecha:"2025-12-31",titulares:[],numeros:{},textos:{}}],referencias:[{unidad:"u",sujetos:["s-3"],bienes:[],eventos:["convivencia-s-3-2025"],cantidades:[]}]}],ordenBase30:[],consignaciones:[],arrastres:[],ordenConsumo:[JSON.stringify([codigo,2025,"s-1"])],criterioOrden:"eleccion_experta"} as const
 const comunes={contribuyenteId:"s-1",derechosMinimos:d,deduccionesTerritoriales2025:territorial,deduccionesValencianas2025:valenciana}
 const canon=Effect.runSync(liquidarIrpfAnual({...analitico,...comunes,comunidadAutonoma:territorio},{modo:"canonico"}))
 expect(canon.cuotaLiquidaCentimos).toBe(o.canonCentimos)
 const real=Effect.runSync(liquidarIrpfAnualExplicito({...efectivo,...comunes,comunidadAutonoma:territorio,familiaresConDerechoMinimo:"segun-derechos",deducciones:territorio==="comunitat-valenciana"?"valencianas-por-hechos-y-da61":"territoriales-por-hechos-y-da61"}))
 expect(new Decimal(real.cuotaLiquidaLegal).eq(o.explicito)).toBe(true)
})

it("internamiento especializado asimila convivencia sólo con discapacidad y dependencia",()=>{
 const a=asc(),t=a.titulares[0]!,periodos=[{desde:"2025-01-01",hasta:"2025-12-31"}]
 const titular={...t,convivencia:[],internamientoEspecializado:periodos,dependenciaEconomica:true}
 expect(()=>libro({...a,titulares:[titular]})).toThrow(/discapacidad/)
 expect(libro({...a,gradoDiscapacidad:33,titulares:[titular]}).titularesMinimo).toEqual(["s-1"])
})
it("rechaza renta calculada del cliente y ausencia económica incompleta",()=>{
 const a=asc()
 // SAFETY: se introducen campos ajenos deliberadamente para probar el rechazo del Schema.
 expect(()=>libro({...a,rentaNoExenta:0} as AscendienteAnual2025)).toThrow(/externas/)
 // SAFETY: ausencia incompleta deliberada; nunca se usa como renta cero.
 expect(()=>libro({...a,economia:{perfil:"sin-rentas"}} as AscendienteAnual2025)).toThrow()
})
