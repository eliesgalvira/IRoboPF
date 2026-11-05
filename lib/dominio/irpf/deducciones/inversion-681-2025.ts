import { Schema } from "effect"
import { Centimos, Texto, euros, exigir, ref, unicos, D } from "./aragon-dos-codigos-2025/comun"
import type { Cartera681 } from "./inversion-681-comun-2025"

const Cuenta = Schema.Struct({id:Texto,titular:Texto,saldoCentimos:Centimos,referencia:Texto})
/** Perfil patrimonial exhaustivo deliberadamente pequeño: cuentas y suscripciones nuevas, sin deuda ni otros bienes. */
export const HechosEstatales681 = Schema.Struct({
 exhaustividad:Schema.Literal("cuentas-y-censo-sin-otros-bienes-ni-deudas"),
 censo:Texto,contribuyente:Texto,
 fechaInicio:Schema.Literal("2025-01-01"),fechaFin:Schema.Literal("2025-12-31"),
 origenFondos:Schema.Literal("renta2025-sin-cuentas-ahorro-empresa"),referenciaOrigenFondos:Texto,
 cuentasInicio:Schema.Array(Cuenta),cuentasFin:Schema.Array(Cuenta),
 titularidades:Schema.Array(Schema.Struct({inversion:Texto,contribuyente:Texto,entidad:Texto,escritura:Texto,
  fechaAdquisicion:Texto,certificado:Texto,referencia:Texto})),
})
export type HechosEstatales681 = typeof HechosEstatales681.Type
export interface GeneracionEstatal681 {
 readonly codigo:"estatal_inversion_empresas_nueva_reciente_creacion_68_1"
 readonly baseEuros:string
 readonly importeExactoEuros:string
 readonly incrementoPatrimonialEuros:string
 readonly inversiones:readonly string[]
 readonly aceptacionFiscal:"pendiente"
 readonly reservas:readonly string[]
}
/** Sólo se llama tras validar íntegramente la cartera68.1 con el evaluador común publicado. No recibe bases ni deducciones del cliente. */
export function producirEstatal681<H extends Cartera681>(h:H, hechos:HechosEstatales681|undefined):GeneracionEstatal681 {
 exigir(hechos!==undefined,"68.1 positiva: faltan hechos patrimoniales70 y titularidades documentales")
 const p=Schema.decodeUnknownSync(HechosEstatales681)(hechos,{onExcessProperty:"error"})
 ref(p.censo);ref(p.referenciaOrigenFondos);exigir(p.contribuyente===h.contribuyente,"68.1: patrimonio de otro contribuyente")
 unicos(p.titularidades.map(t=>t.inversion))
 exigir(p.titularidades.length===h.inversiones.length,"68.1: censo de titularidades incompleto")
 let invertido=new D(0),base=new D(0)
 const entidades=new Map<string,string>(),escrituras=new Map<string,string>()
 for(const i of h.inversiones){
  exigir(i.calificacion.tipo==="ordinaria","68.1 positiva: calificación emergente pendiente de contrato completo Ley28; no se habilita por nombre")
  const t=p.titularidades.find(t=>t.inversion===i.id)
  exigir(t!==undefined && t.contribuyente===h.contribuyente && t.entidad===i.entidad && t.escritura===i.escritura && t.fechaAdquisicion===i.fechaSuscripcion && t.certificado===i.certificadoEntidad.referencia,"68.1: contribuyente/entidad/escritura/adquisición/certificado ajeno al censo")
  ref(t.referencia)
  const entidad=JSON.stringify([i.constitucion,i.inicioPeriodoSociedad,i.finPeriodoSociedad,i.fondosPropiosInicioCentimos,i.referenciaBalanceInicio,i.grupo,i.calificacion,i.historialEntidad,i.historialParticipacion,i.actividadPrevia])
  exigir(!entidades.has(i.entidad)||entidades.get(i.entidad)===entidad,"68.1: hechos contradictorios de la misma entidad")
  entidades.set(i.entidad,entidad)
  exigir(!escrituras.has(i.escritura)||escrituras.get(i.escritura)===i.entidad,"68.1: escritura atribuida a entidades distintas")
  escrituras.set(i.escritura,i.entidad)
  invertido=invertido.plus(euros(i.pago.importeCentimos));base=base.plus(euros(i.asignacion.estatalCentimos))
 }
 function saldos(cuentas:typeof p.cuentasInicio){
  unicos(cuentas.map(c=>c.id));let total=new D(0)
  for(const c of cuentas){ref(c.referencia);exigir(c.titular===h.contribuyente,"68.1: cuenta de otro titular");total=total.plus(euros(c.saldoCentimos))}
  return total
 }
 // Las únicas acciones al cierre son las del censo y se computan al coste, sin plusvalías latentes aportadas.
 const incremento=saldos(p.cuentasFin).plus(invertido).minus(saldos(p.cuentasInicio))
 exigir(incremento.gte(invertido),"68.1 art70: incremento patrimonial insuficiente para las inversiones realizadas")
 exigir(base.lte(100000),"68.1: máximo anual100000")
 return {codigo:"estatal_inversion_empresas_nueva_reciente_creacion_68_1",baseEuros:base.toFixed(),importeExactoEuros:base.div(2).toFixed(),incrementoPatrimonialEuros:incremento.toFixed(),inversiones:h.inversiones.map(i=>i.id),aceptacionFiscal:"pendiente",
  reservas:["Exhaustividad patrimonial y documentos declarados, sin autenticación automática.","Mantener requisitos de entidad, capital, actividad y tenencia durante los plazos legales; seguimiento futuro condicionado, sin afirmar cumplimiento ni calcular regularizaciones.","Sin arrastre de exceso ni reinversión38.2. La base elegida es una partición monetaria del pago comprobado; los límites fiscales son internos."]}
}
