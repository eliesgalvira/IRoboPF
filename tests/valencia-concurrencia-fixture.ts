import type { CensoBasesFamiliares2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import type { SolicitudDeduccionesValencianasAnual2025 } from "../lib/dominio/irpf/deducciones/valenciana-2025/anual"
import { derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
type Mutable<T> = { -readonly [K in keyof T]: T[K] extends object ? Mutable<T[K]> : T[K] }
function censo(): Mutable<CensoBasesFamiliares2025> {
 return { referencia:"censo-sintetico", ejercicio:2025, devengo:"2025-12-31", contribuyente:"s-1", estadoCivil:"sin-vinculo", censoCompleto:true, hijosCompletos:true,
 hijos:["s-3","s-4"].map(id => ({id, nacimiento:"2017-01-01", progenitores:["s-1","s-2"], conviveCon:["s-1","s-2"], independienteConConsentimiento:false, apoyoJudicial:"ninguno", soporte:"filiacion"})),
 personas:["s-1","s-2","s-3","s-4"].map(id => ({id, soporte:"censo", residenteComunTodo2025:true, vivoTodo2025:true, economia:id === "s-1" ? {perfil:"declarante-en-composicion"} : {perfil:"sin-rentas", censoRentasCompleto:true}})) }
}
const codigo="valenciana_dos_o_mas_descendientes"
const solicitud = (): Mutable<SolicitudDeduccionesValencianasAnual2025> => ({ejercicio:2025, territorio:"comunitat-valenciana", modalidad:"individual", devengo:"2025-12-31", contribuyente:"s-1", cantidades:[], solicitudes:[{codigo,eleccion:"aplicar",unidades:[{id:"u",titulares:["s-1"],fecha:"2025-12-31",numeros:{},textos:{}}], referencias:[{unidad:"u",sujetos:["s-3","s-4"],bienes:[],eventos:[],cantidades:[]}]}], ordenBase30:[],consignaciones:[],arrastres:[],ordenConsumo:[JSON.stringify([codigo,2025,"s-1"])], criterioOrden:"eleccion_experta"})
function familia(territorio:"madrid"|"comunitat-valenciana") {
 const ds=["s-3","s-4"].map(sujetoId=>({...derechos.descendientes[0]!,sujetoId,titulares:derechos.descendientes[0]!.titulares.map(t=>({...t,rentasNoExentasCentimos:t.titularId==="s-1"?2605600:0}))}))
 return {...derechos,territorio,descendientes:ds}
}

export { censo, familia, solicitud }
export const deporte = "valenciana_deporte_actividades_saludables"
export function concurrente(): Mutable<SolicitudDeduccionesValencianasAnual2025> {
 const s: Mutable<SolicitudDeduccionesValencianasAnual2025> = structuredClone(solicitud())
 s.cantidades = [{id:"pago",euros:100}]
 s.solicitudes.push({codigo:deporte,eleccion:"aplicar",unidades:[{id:"gimnasio",titulares:["s-1"],fecha:"2025-06-02",numeros:{edad:40,grado:0,gasto:100,ayudas:0,reembolsos:0},textos:{}}],referencias:[{unidad:"gimnasio",sujetos:["s-1"],bienes:[],eventos:["cuota-gimnasio-facturada-transferencia"],cantidades:["pago"]}]})
 s.ordenConsumo.push(JSON.stringify([deporte,2025,"s-1"]))
 return s
}
