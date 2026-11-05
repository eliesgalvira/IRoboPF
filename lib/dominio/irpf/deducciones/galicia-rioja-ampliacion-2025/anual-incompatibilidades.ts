import {Schema} from "effect"
function exige(b:boolean,m:string):asserts b{if(!b)throw new RangeError(m)}
export type HechoTerritorialParaConcurrencia={readonly lote:string;readonly codigo:string;readonly hechos:Schema.Json}
const objeto=Schema.is(Schema.Record(Schema.String,Schema.Json)),lista=Schema.is(Schema.Array(Schema.Json)),texto=Schema.is(Schema.String)
export function validarConcurrenciaE38(v:readonly HechoTerritorialParaConcurrencia[]):void{
 if(!v.some(s=>s.lote==="E38"))return
 const codigos=v.map(s=>s.codigo)
 for(const [a,b]of [["galicia_familias_dos_hijos","galicia_familia_numerosa"],["galicia_climatizacion_agua_caliente_renovables","galicia_obras_eficiencia_energetica"],["rioja_paliar_subida_intereses_hipotecarios","rioja_vivienda_habitual_pequenos_municipios"],["rioja_paliar_subida_intereses_hipotecarios","rioja_inversion_vivienda_jovenes_menores_36"],["rioja_arrendamiento_menores_36","rioja_vivienda_habitual_pequenos_municipios"],["rioja_arrendamiento_menores_36","rioja_inversion_vivienda_jovenes_menores_36"]])exige(!(codigos.includes(a)&&codigos.includes(b)),`Elecciones E38 incompatibles: ${a}/${b}`)
 const rural=codigos.indexOf("rioja_fijacion_poblacion_ocupada_medio_rural")
 exige(rural<0||rural===v.length-1,"rioja_fijacion_poblacion_ocupada_medio_rural debe aplicarse en último lugar")
 const inversiones=new Map<string,string>(),inmuebles=new Map<string,string>()
 for(const s of v){
  const capital=["galicia_inversion_entidades_nuevas_reciente_creacion","galicia_inversion_entidades_nuevas_financiacion","galicia_inversion_mab","galicia_inversion_empresas_agrarias","galicia_inversion_proyectos_especial_interes"].includes(s.codigo)
  function recorrer(x:Schema.Json,entidad?:string):void{
   if(lista(x)){x.forEach(z=>recorrer(z,entidad));return}if(!objeto(x))return
   const e=objeto(x.entidad)&&texto(x.entidad.id)?x.entidad.id:lista(x.operaciones)&&texto(x.id)?x.id:entidad
   if(capital&&e!==undefined&&texto(x.fecha)&&texto(x.id)&&("modalidad"in x||"mercado"in x||"pago"in x)){
    const key=e+":"+x.fecha,previa=inversiones.get(key)
    exige(previa===undefined||previa===s.codigo,`Misma entidad/fecha de inversión en códigos incompatibles E38: ${previa??""}/${s.codigo};separación económica no representada`)
    inversiones.set(key,s.codigo)
   }
   if(objeto(x.inmueble)&&texto(x.inmueble.id)&&["galicia_aldeas_modelo","galicia_climatizacion_agua_caliente_renovables","galicia_obras_eficiencia_energetica"].includes(s.codigo)){
    const key=x.inmueble.id,previa=inmuebles.get(key)
    exige(previa===undefined||previa===s.codigo,`Inversiones E38 en mismo inmueble sin partición de proyecto para resolver incompatibilidad: ${key}`);inmuebles.set(key,s.codigo)
   }
   Object.values(x).forEach(z=>recorrer(z,e))
  }
  recorrer(s.hechos)
 }
}
