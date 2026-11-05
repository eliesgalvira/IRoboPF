// Preparado en fase ligera. Ninguna ejecución del candidato autorizada todavía.
import { describe, expect, it } from "vitest"
import { Effect, Schema } from "effect"
import { CensoIngresosIdentificados2025 } from "../lib/dominio/irpf/ingresos-identificados-2025/contrato"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { casoCanonicoELA, casoEfectivoELA } from "./ela-ingreso-2025-fixtures"
import type { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
function hechos(coste = "4000") {
 return {ejercicio:2025,contribuyenteId:"A",ambito:"ayudas-publicas-no-transmision",exhaustividad:"completa",ayudas:[{
 ayudaId:"BE1",beneficiario:"A",programa:"balears-d33-2018-art3_2e-cobro2025",administracion:"comunidad_illes_balears",
 expediente:{referencia:"EXP1",solicitud:"2019-04-15",acuerdo:"Consejo de Ministros 2018-10-19",municipio:"Manacor",siniestro:"inundacion-2018-10-09",objeto:"danos-vivienda-habitual-sin-destruccion-ni-estructura",propietarioPleno:"A",adquisicion:"2010-01-01",inicioResidenciaHabitual:"2010-01-01",continuidad:"pleno-dominio-exclusivo-y-uso-propio-sin-cambios-hasta-cobro",vivienda:"V1",uso:"habitual-propio-no-arrendado-no-afecto",informeTecnico:{referencia:"PER1",emisor:"Arquitecto",fecha:"2019-04-20",vivienda:"V1",propietario:"A",danosValorados:"10000"},segurosYOtrasAyudas:"ninguno",cobrosPrevios:"ninguno",reparacionFinalizada:{referencia:"FIN1",emisor:"Arquitecto",fecha:"2025-12-01",vivienda:"V1",informeDanos:"PER1",alcance:"totalidad-danos-peritados-reparados",gastosAnteriores2025:"ninguno",otrasReparaciones:"ninguna"},pagoTardio:{notificacionConcesion:"2019-06-02",impugnaciones:"ninguna",procesoJudicial:"ninguno",revocacionesYReintegros:"ninguno",interesesYCostasPercibidos2025:"ninguno",reclamacionesPago:[{referencia:"REQ1",registro:"REG1",fecha:"2022-05-03",acreedor:"A",expediente:"EXP1",importePrincipal:"6000"},{referencia:"REQ2",registro:"REG2",fecha:"2025-05-05",acreedor:"A",expediente:"EXP1",importePrincipal:"6000"}]},reparaciones:[{factura:"F1",concepto:"reparacion-dano-inundacion-2018-sin-mejoras",prestador:"EMPRESA1",pagador:"A",vivienda:"V1",fecha:"2025-10-01",euros:coste,justificante:"PF1"}]},
 resolucion:{referencia:"RES1",organismo:"Consejero de Territorio, Energia y Movilidad",condicionesEjecucionObras:"ninguna",fecha:"2019-06-01",importeConcedido:"6000"},cobros:[{cobroId:"C1",beneficiario:"A",ordenante:"comunidad_illes_balears",fecha:"2025-09-01",euros:"6000",justificante:"PC1"}]
 }]}
}
const solicitud: SolicitudDeduccionesTerritoriales2025={solicitudes:[{lote:"C36",codigo:"balears_subvenciones_zona_emergencia_proteccion_civil",hechos:{ingresoId:"BE1",exhaustividad:"completa"}}]}
function ejecutar(api:"canonica"|"efectiva",raw:ReturnType<typeof hechos>,seleccion=solicitud) {
 const c=Schema.decodeUnknownSync(CensoIngresosIdentificados2025)(raw,{onExcessProperty:"error"})
 return api==="canonica"?Effect.runSync(liquidarIrpfAnual({...casoCanonicoELA(),comunidadAutonoma:"illes-balears",ingresosIdentificados2025:c,deduccionesTerritoriales2025:seleccion,rendimientos:{trabajo:[{importeIntegroCentimos:3300000}]}},{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito({...casoEfectivoELA(undefined,undefined,"33000"),comunidadAutonoma:"illes-balears",ingresosIdentificados2025:c,deduccionesTerritoriales2025:seleccion}))
}
describe.each(["canonica","efectiva"] as const)("Balears %s",api=>{
 it.each([["4000","2000"],["6000","0"],["6000.01","0"],["5999.99","0.01"]])("DA5.3 coste%s integra%s",(coste,integrado)=>{
  const r=ejecutar(api,hechos(coste)),sin=ejecutar(api,hechos(coste),{solicitudes:[]})
  expect(r.libroIngresosIdentificados2025?.totalIntegradoGeneral).toEqual(racional(integrado))
  expect(r.libroIngresosIdentificados2025?.ingresos[0]).toMatchObject({integradoBaseGeneral:integrado,integradoBaseLiquidable:integrado,clasificacionFiscal:integrado==="0"?"ayuda-reparacion-DA5_3-sin-exceso":"ayuda-reparacion-DA5_3-con-exceso-general",criterio:"cobro-art14_2_c-exceso-reparacion-DA5_3"})
  expect(r.nodosFiscalesB2025).toEqual(sin.nodosFiscalesB2025)
  const t=r.nodosFiscalesB2025?.tiposMediosGenerales
  expect(t).toBeDefined()
  if(t === undefined)throw new Error("Falta tipo del productor común")
  // Oráculo racional independiente: porcentajes oficiales truncados por componente.
  const cents=(s:string)=>BigInt(s.replace(".",""))
  const g=racional(integrado),num=BigInt(g.numeradorEuros)*(cents(t.estatal)+cents(t.autonomico)),den=BigInt(g.divisor)*10000n
  const generado=r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado
  expect(generado).toBeDefined()
  expect(BigInt(generado!.numeradorEuros)*den).toBe(num*BigInt(generado!.divisor))
  expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(1)
 })
 const adversos:readonly [string,(h:ReturnType<typeof hechos>)=>ReturnType<typeof hechos>][]=[
 ["beneficiario ajeno",h=>{h.ayudas[0]!.beneficiario="B";return h}],
 ["ordenante insular",h=>{h.ayudas[0]!.cobros[0]!.ordenante="consell";return h}],
 ["otra convocatoria",h=>{h.ayudas[0]!.programa="balears-emergencia-2025";return h}],
 ["destruccion",h=>{h.ayudas[0]!.expediente.objeto="destruccion";return h}],
 ["seguro concurrente",h=>{h.ayudas[0]!.expediente.segurosYOtrasAyudas="seguro";return h}],
 ["pago2024",h=>{h.ayudas[0]!.cobros[0]!.fecha="2024-09-01";return h}],
 ["pago parcial",h=>{h.ayudas[0]!.cobros[0]!.euros="5000";return h}],
 ["factura duplicada",h=>{h.ayudas[0]!.expediente.reparaciones.push(h.ayudas[0]!.expediente.reparaciones[0]!);return h}],
 ["cierre anterior",h=>{h.ayudas[0]!.expediente.reparacionFinalizada.fecha="2025-01-01";return h}],
 ["importe sobre limite",h=>{h.ayudas[0]!.resolucion.importeConcedido="10000.01";h.ayudas[0]!.cobros[0]!.euros="10000.01";return h}],
 ["fecha civil invalida",h=>{h.ayudas[0]!.expediente.reparaciones[0]!.fecha="2025-02-30";return h}],
 ["ventana de reapertura no representada",h=>{h.ayudas[0]!.expediente.solicitud="2019-04-05";return h}],
 ["condicion adicional de obras",h=>{h.ayudas[0]!.resolucion.condicionesEjecucionObras="ejecutar-antes2019";return h}],
 ["derecho sin reclamaciones",h=>{h.ayudas[0]!.expediente.pagoTardio.reclamacionesPago=[];return h}],
 ["reclamacion tardia",h=>{h.ayudas[0]!.expediente.pagoTardio.reclamacionesPago[0]!.fecha="2024-05-01";return h}],
 ["compra posterior al siniestro",h=>{h.ayudas[0]!.expediente.adquisicion="2019-01-01";return h}],
 ["reintegro",h=>{h.ayudas[0]!.expediente.pagoTardio.revocacionesYReintegros="acordado";return h}],
 ["importe peritado menor",h=>{h.ayudas[0]!.expediente.informeTecnico.danosValorados="5999.99";return h}],
 ["solicitud nueva2025",h=>{h.ayudas[0]!.expediente.solicitud="2025-01-01";return h}],
 ["2mayo requiere calendario fuera del corte",h=>{h.ayudas[0]!.expediente.solicitud="2019-05-02";return h}],
 ["intereses cobrados",h=>{h.ayudas[0]!.expediente.pagoTardio.interesesYCostasPercibidos2025="300";return h}],
 ["litigio",h=>{h.ayudas[0]!.expediente.pagoTardio.procesoJudicial="sentencia2025";return h}],
 ["base del cliente",h=>({...h,baseIntegrada:"2000"})],
 ["tipo del cliente",h=>({...h,tipoMedio:"20"})],
 ["clasificacion del cliente",h=>({...h,ayudas:[{...h.ayudas[0],clasificacionFiscal:"exenta"}]})],
 ]
 for(const [nombre,mutar] of adversos)it(nombre,()=>expect(()=>ejecutar(api,mutar(hechos()))).toThrow())
 it.each(["2019-04-01","2019-04-15","2019-05-01"])("solicitud admitida %s",fecha=>{const h=hechos();h.ayudas[0]!.expediente.solicitud=fecha;expect(()=>ejecutar(api,h)).not.toThrow()})
 it("etiqueta antigua de cierre no suple hechos",()=>{const h=hechos();const conCierre={...h,ayudas:[{...h.ayudas[0]!,expediente:{...h.ayudas[0]!.expediente,cierreReparacion:{reintegro:"ninguno-segun-cierre-administrativo"}}}]};expect(()=>ejecutar(api,conCierre)).toThrow()})
 it("referencia ajena",()=>expect(()=>ejecutar(api,hechos(),{solicitudes:[{lote:"C36",codigo:"balears_subvenciones_zona_emergencia_proteccion_civil",hechos:{ingresoId:"OTRO",exhaustividad:"completa"}}]})).toThrow())
})
