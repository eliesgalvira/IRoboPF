import {liquidarIrpfAnualExplicito} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import {it,expect} from "vitest"
import {Effect} from "effect"
import {historica} from "./rioja-anterior-fixture"
import {fixture,ambas,controlesSinPagos} from "./dt18-rioja-fixture"
import {racional} from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import Decimal from "decimal.js"
// Expected values are copied from the two received oracle series, never computed by the candidate.
for(const [operacion,regional,tramo] of [["adquisicion","91.5","228.75"],["rehabilitacion","152.5","228.75"],["adecuacion","457.5","305"]] as const)it("conjunto autónomo: positivo de ambas API "+operacion,()=>{
 const discapacidad=operacion==="adecuacion",bases=controlesSinPagos(fixture([operacion]),discapacidad)
 for(const [api,e] of ambas(fixture([operacion]),discapacidad).entries()){
  const r=Effect.runSync(e),t=r.deduccionesTerritoriales2025
  expect(t?.total).toEqual(racional(regional));expect(t?.aplicaciones).toHaveLength(1)
  expect(t?.viviendaDT182025?.cuotas?.estatal.total).toEqual(racional(tramo))
  expect(t?.viviendaDT182025?.cuotas?.autonomica.total).toEqual(racional(tramo))
  expect(new Decimal(r.cuotaLiquidaEuros).eq(Effect.runSync(bases[api]).minus(new Decimal(tramo).times(2)).minus(regional))).toBe(true)
 }
})
it("conjunto autónomo: segunda en ambas API,244 regional sin DT18 ni doble descuento",()=>{
 const bases=controlesSinPagos({solicitudes:[historica()]})
 for(const [api,e] of ambas({solicitudes:[historica()]}).entries()){
  const r=Effect.runSync(e),t=r.deduccionesTerritoriales2025
  expect(t?.total).toEqual(racional("244"));expect(t?.aplicaciones).toHaveLength(1)
  expect(t?.viviendaDT182025).toBeUndefined()
  expect(new Decimal(r.cuotaLiquidaEuros).eq(Effect.runSync(bases[api]).minus("244"))).toBe(true)
 }
})
for(const operacion of ["adquisicion","rehabilitacion","adecuacion"] as const)for(const orden of ["habitual_primero","segunda_primero"] as const)it("rechazo explícito de censos incompatibles en ambas API: "+operacion+"/"+orden,()=>{
 const s=fixture([operacion]),segunda=historica()
 const solicitudes=orden==="habitual_primero"?[...s.solicitudes,segunda]:[segunda,...s.solicitudes]
 for(const e of ambas({...s,solicitudes},operacion==="adecuacion")){
  const r=Effect.runSync(Effect.flip(e))
  expect(r._tag).toBe("ResultadoNoSoportado");expect(r.motivo).toContain("RIOJA_CENSOS_UNICOS_INCOMPATIBLES")
  expect("deduccionesTerritoriales2025"in r).toBe(false)
 }
})
it("no basta retirar solicitud habitual dejando su libro para mezclar censos",()=>{
 const s={...fixture(),solicitudes:[historica()]}
 for(const e of ambas(s))expect(Effect.runSync(Effect.flip(e)).motivo).toContain("RIOJA_CENSOS_UNICOS_INCOMPATIBLES")
})
it("no basta retirar libro DT18 dejando códigos habitual y segunda",()=>{
 const {viviendaDT182025:historia,...s}=fixture();void historia
 for(const e of ambas({...s,solicitudes:[...s.solicitudes,historica()]}))expect(Effect.runSync(Effect.flip(e)).motivo).toContain("RIOJA_CENSOS_UNICOS_INCOMPATIBLES")
})
it("adecuación sin discapacidad propia sigue rechazada en ambas API",()=>{
 for(const e of ambas(fixture(["adecuacion"])))expect(Effect.runSync(Effect.flip(e))._tag).toBe("ResultadoNoSoportado")
})

for(const activa of ["ninguna","pendiente"] as const)it("API efectiva: discapacidad propia en empleo sigue fuera del perfil DT18 de pensión: "+activa,()=>{
 const e={ejercicio:2025,comunidadAutonoma:"la-rioja",contribuyenteId:"A",edad:35,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"33-a-64",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:fixture(["adecuacion"]),rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:activa,rendimientos:[{id:"R",clase:"empleo-laboral",integro:"100000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[]} as const
 const r=Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(e)))
 expect(r._tag).toBe("ResultadoNoSoportado");expect(r.motivo).toContain("Discapacidad efectiva nueva limitada a pensión")
})
