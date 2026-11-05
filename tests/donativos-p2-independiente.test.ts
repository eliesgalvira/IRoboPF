import Decimal from "decimal.js"
import { expect, it } from "vitest"
import { producirDonativosEstatales2025 as producir, eurosDonativos, type MagnitudesDonativos } from "../lib/dominio/irpf/deducciones/donativos-estatales-2025/productor"
import type { SolicitudDonativosEstatales2025 as Censo, OperacionDonativo2025 as Operacion } from "../lib/dominio/irpf/deducciones/donativos-estatales-2025/esquemas"
import { baseEstatalMismaOperacion as baseRegional } from "../lib/dominio/irpf/deducciones/donativos-estatales-2025/regionales"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { aplicarDeduccionesTerritoriales2025 as aplicar, type MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
const D = Decimal.clone({ precision: 80 })
function op(euros = "300", id = "o1", entidad = "e1", nif = "G12345674"): Operacion {
 return { operacionId: id, eleccion: "aplicar", incremento: "general_40",
 entidad: { id: entidad, nif, clase: "fundacion", registro: "registro", regimen: "titulo_II_Ley49_2002", referenciaRegimen: "regimen", referenciaOpcionRegimen: "opcion", regimenDesde: "2020-01-01", regimenHasta: "2025-12-31" },
 pago: { id: "p"+id, operacionId: id, fecha: "2025-09-03", pagador: "revisor", receptorNIF: nif, euros, documento: "banco"+id, medio: "transferencia" },
 certificado: { referencia: "cert"+id, operacionId: id, donante: "revisor", nifDonante: "12345678Z", entidadNIF: nif, inclusionArt16: "entidad_titulo_II", fechaDonativo: "2025-09-03", euros, destino: "fin de interes general", caracter: "irrevocable_puro_simple", contraprestacionEUR: "0" } }
}
const censo = (operaciones: readonly Operacion[] = [op()]): Censo => ({ ejercicio: 2025, contribuyente: "revisor", nifContribuyente: "12345678Z", exhaustividad: "completo_68_3_y_68_5", referenciaCenso: "revision", operaciones68_3: operaciones, operaciones68_5: [] })
const mag = (bl = "20000", e = "1000", a = "1000"): MagnitudesDonativos => ({ contribuyente: "revisor", baseLiquidableGeneral: new D(bl), baseLiquidableAhorro: new D(0), cuotaEstatal: new D(e), cuotaAutonomica: new D(a) })
// Importes calculados en papel: sin usar helpers de cálculo de producción.
it.each([["0","0"],["0.01","0.008"],["249.99","199.992"],["250","200"],["250.01","200.004"],["300","220"],["301.37","220.548"]])("franquicia global %s => %s", (pago, esperado) => {
 expect(producir(censo([op(pago)]), mag()).generado).toEqual(racional(esperado))
})
it.each([["0","0"],["0.01","0.0008"],["1.23","0.0984"],["1000","80"],["2499.999","199.99992"],["2500","200"],["2500.001","200.00004"],["3000.001","220.00004"]])("BL %s limita base antes de tabla: %s", (bl, esperado) => {
 expect(producir(censo([op("1000")]),mag(bl)).generado).toEqual(racional(esperado))
})
it.each([["3","200","113"],["200","3","113"],["0","200","110"],["1.001","2.003","3.004"],["109.9999","110.0001","219.9999"]])("partes %s/%s no transfieren ni arrastran", (e,a,total) => {
 const r=producir(censo(),mag("20000",e,a)); expect(r.aplicado).toEqual(racional(total))
 expect(eurosDonativos(r.estatal.disponible).gte(0)).toBe(true); expect(eurosDonativos(r.autonomica.disponible).gte(0)).toBe(true)
})
it("80 cifras: una BL con resto diminuto conserva importe subcéntimo", () => {
 const bl="3000."+"0".repeat(65)+"1"
 const esperado="220."+"0".repeat(67)+"4"
 expect(producir(censo([op("400")]),mag(bl)).generado).toEqual(racional(esperado))
})
function historia(o: Operacion, p23="100", p24="200"): Operacion {
 return {...o, incremento:"reiteracion_45", historialExhaustivo:"todos_donativos_misma_entidad_2023_2024", historial: ([2023,2024] as const).map((ejercicio,i)=>({ ejercicio, pago:{...o.pago,id:"p"+ejercicio,operacionId:"o"+ejercicio,fecha:ejercicio+"-09-03",euros:i===0?p23:p24}, certificado:{...o.certificado,referencia:"c"+ejercicio,operacionId:"o"+ejercicio,fechaDonativo:ejercicio+"-09-03",euros:i===0?p23:p24} }))}
}
it.each([["249.99","199.992"],["250","200"],["250.01","200.0045"],["300","222.5"]])("45 completo %s => %s",(v,e)=>expect(producir(censo([historia(op(v))]),mag()).generado).toEqual(racional(e)))
it("45 histórico exige titular, entidad, períodos, no decrecimiento y exhaustividad",()=>{
 const o=historia(op()), hs=o.historial!; const h=hs[0]!
 const malas: Operacion[]=[(({historialExhaustivo: omitido, ...resto}) => { void omitido; return resto })(o),{...o,historial:[h,h]},historia(op(),"0","200"),historia(op(),"201","200"),historia(op(),"100","301"),{...o,historial:[{...h,pago:{...h.pago,pagador:"otro"}},hs[1]!]},{...o,historial:[{...h,certificado:{...h.certificado,entidadNIF:"G76543214"}},hs[1]!]}]
 for(const mala of malas) expect(()=>producir(censo([mala]),mag())).toThrow()
})
it("ausencia de elección no es cero; no_aplicar explícita sí",()=>{
 const o=op(); expect(()=>Schema.decodeUnknownSync(CensoSchema)({...censo(),operaciones68_3:[{...o,eleccion:undefined}]},{onExcessProperty:"error"})).toThrow()
 expect(producir(censo([{...o,eleccion:"no_aplicar"}]),mag()).aplicado).toEqual(racional("0"))
})
it("identidad, NIF, fecha y soportes contradictorios se rechazan",()=>{
 const o=op(); const malos: Operacion[]=[{...o,entidad:{...o.entidad,nif:"G12345670"}},{...o,certificado:{...o.certificado,nifDonante:"00000000T"}},{...o,pago:{...o.pago,operacionId:"otra"}},{...o,pago:{...o.pago,fecha:"2025-02-29"}},{...o,certificado:{...o.certificado,fechaDonativo:"2024-09-03"}},{...o,certificado:{...o.certificado,euros:"299.99"}},{...o,entidad:{...o.entidad,regimenDesde:"2025-10-01"}}]
 for(const malo of malos) expect(()=>producir(censo([malo]),mag())).toThrow()
 expect(()=>producir({...censo(),contribuyente:"otro"},mag())).toThrow()
})
it("censo cerrado, duplicados y selección múltiple",()=>{
 const o=op(), b={...op("50","o2","e2","G76543214"),eleccion:"no_aplicar" as const}
 for(const operaciones of [[o,{...b,pago:{...b.pago,id:o.pago.id}}],[o,{...b,certificado:{...b.certificado,referencia:o.certificado.referencia}}],[o,{...b,pago:{...b.pago,documento:o.pago.documento}}],[o,{...b,eleccion:"aplicar" as const}]]) expect(()=>producir(censo(operaciones),mag())).toThrow()
 expect(()=>producir({...censo(),operaciones68_5:[{operacionId:"bien",documento:"doc"}]},mag())).toThrow()
 for(const extra of [{base68_3:"0"},{cuotaEstatal:"999"},{baseLiquidable:"999"}]) expect(()=>producir({...censo(),...extra},mag())).toThrow()
})
const region = (o:Operacion) => ({lote:"F-ampliado" as const,codigo:"murcia_donativos_patrimonio_cultural_actividades" as const,hechos:{entidades:[{id:o.entidad.id,certificado:"cert-region",registro:"art3",proyectoMurcia:"si",situacionTributaria:"al_corriente",situacionSS:"al_corriente",cuentasPresentadas:"si",gradoVinculo:4,interesComun:"no",creditoFiscalVigente:"no",destino:"cultural",forma:"entidad49_2002"}],pagos:[{id:o.pago.id,operacionId:o.operacionId,pagador:o.pago.pagador,objetoId:o.entidad.id,fecha:o.pago.fecha,importeEUR:o.pago.euros,concepto:"donativo_dinerario",medio:"transferencia",soportePago:o.pago.documento}]}})
function marco(s:Censo,bl="20000",e="1000",a="1000",territorio:"murcia"|"madrid"|"cantabria"="murcia"): MagnitudesTerritorialesAnuales {
 const m=mag(bl,e,a),libro=producir(s,m)
 return {caso:{anio:2025,comunidadAutonoma:territorio,contribuyenteId:"revisor",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]}},baseGeneral:m.baseLiquidableGeneral,baseAhorro:m.baseLiquidableAhorro,basesLiquidables:{general:m.baseLiquidableGeneral,ahorro:m.baseLiquidableAhorro},minimoPersonalFamiliar:new D(5550),cuotaAutonomica:m.cuotaAutonomica,cuotaAutonomicaResidual:eurosDonativos(libro.autonomica.disponible),donativosEstatales:libro,sujetosConMinimo:[]}
}
it.each([["0","150"],["1000","100"],["2999.999","0.00005"],["3000","0"]])("Murcia BL%s: base de la misma operación antes del 50%%",(bl,esperado)=>{
 const o=op(),s=censo([o]); expect(aplicar({donativosEstatales2025:s,solicitudes:[region(o)]},marco(s,bl)).total).toEqual(racional(esperado))
})
it("Murcia no atribuye bases de otra operación ni cero a ausencias",()=>{
 const a=op(), b={...op("300","o2","e2","G76543214"),eleccion:"no_aplicar" as const},s=censo([a,b]),libro=producir(s,mag())
 expect(baseRegional(libro,b.operacionId,b.entidad.id,b.pago)).toEqual(racional("0"))
 expect(()=>baseRegional(libro,"ausente",b.entidad.id,b.pago)).toThrow(/ausente/)
 expect(()=>baseRegional(libro,b.operacionId,b.entidad.id,{...b.pago,documento:"otro"})).toThrow(/contradictorios/)
 expect(aplicar({donativosEstatales2025:s,solicitudes:[region(b)]},marco(s)).total).toEqual(racional("150"))
})
it("parcial estatal aislado válido; regional misma operación exige atribución",()=>{
 const o=op(),s=censo([o]),m=marco(s,"20000","3","200")
 expect(m.donativosEstatales?.aplicado).toEqual(racional("113"))
 const r=aplicar({donativosEstatales2025:s,solicitudes:[region(o)]},m)
 expect(r.total).toEqual(racional("0")); expect(JSON.stringify(r)).toMatch(/atribucion_base_estatal_con_cuota_insuficiente/); expect(JSON.stringify(r)).toMatch(/pendiente_hechos/)
})
it.each([["1000","500"],["200","90"],["100","0"]])("Madrid tope usa íntegra %s y aplicación consume residual",(a,esperado)=>{
 const s=censo(),m=marco(s,"20000","1000",a,"madrid")
 expect(aplicar({donativosEstatales2025:s,solicitudes:[{lote:"F-ampliado",codigo:"madrid_condicion_familia_numerosa",hechos:{miembrosUnidad:["revisor"],titulo:{categoria:"general",efectos:"2025-01-01",referencia:"titulo",titulares:["revisor"]}}}]},m).total).toEqual(racional(esperado))
})
const ref = { referencia:"revision",organismo:"registro",fecha:"2025-01-01" }
function cantabria(o:Operacion) { return {lote:"B-ampliado" as const,hechos:{codigo:"cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad" as const,donaciones:[{id:o.operacionId,entidad:{id:o.entidad.id,clase:"fundacion" as const,domicilio:"cantabria",registro:ref,cuentasProtectorado:ref,depositoCuentas:ref,fines:["cultural" as const],utilidadPublica:null,ingresos:"0",aplicadoFinesInteresGeneral:"0",memoriaEconomica:null,certificacionDonacion:ref},pagos:[{id:o.pago.id,pagador:o.pago.pagador,receptor:o.entidad.id,fecha:o.pago.fecha,euros:o.pago.euros,documento:o.pago.documento,medio:"transferencia" as const}]}]}} }
it.each([["5000","0"],["20000","150"],["20000.001","150.000015"],["25000","225"]])("Cantabria BL%s comparte 10%% con base estatal real1000",(bl,esperado)=>{
 const a=op("1000"),b={...op("1500","o2","e2","G76543214"),eleccion:"no_aplicar" as const},s=censo([a,b])
 expect(aplicar({donativosEstatales2025:s,solicitudes:[cantabria(b)]},marco(s,bl,"1000","1000","cantabria")).total).toEqual(racional(esperado))
})
it("Cantabria rechaza atribución parcial y operación no censada",()=>{
 const a=op("1000"),b={...op("1500","o2","e2","G76543214"),eleccion:"no_aplicar" as const},s=censo([a,b])
 expect(()=>aplicar({donativosEstatales2025:s,solicitudes:[cantabria(b)]},marco(s,"20000","3","1000","cantabria"))).toThrow(/atribuci|insuficiencia/i)
 const sin=censo([a]);expect(()=>aplicar({donativosEstatales2025:sin,solicitudes:[cantabria(b)]},marco(sin,"20000","1000","1000","cantabria"))).toThrow(/censo/i)
})
import { Effect, Schema } from "effect"
import { SolicitudDonativosEstatales2025 as CensoSchema } from "../lib/dominio/irpf/deducciones/donativos-estatales-2025/esquemas"
import { liquidarIrpfAnual as anual, liquidarIrpfAnualExplicito as efectivo } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
const canon = ():CasoFiscalAnual => ({anio:2025,comunidadAutonoma:"murcia",contribuyenteId:"revisor",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:3000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0})
const entrada = (bruto="30000") => ({ejercicio:2025,comunidadAutonoma:"murcia",contribuyenteId:"revisor",edad:40,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:{solicitudes:[]},rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},retenciones:[],trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"empleo",clase:"empleo-laboral",integro:bruto,cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]}} as const)
it.each([["249.99",19999],["250",20000],["250.01",20001],["301.37",22055]])("ambas API aplican una vez: %s",(importe,centimos)=>{
 const s=censo([op(importe)]),c=canon(),e=entrada()
 const a=Effect.runSync(anual(c,{modo:"canonico"})),b=Effect.runSync(anual({...c,deduccionesTerritoriales2025:{solicitudes:[],donativosEstatales2025:s}},{modo:"canonico"}))
 expect(a.cuotaLiquidaCentimos-b.cuotaLiquidaCentimos).toBe(centimos)
 const ae=Effect.runSync(efectivo(e)),be=Effect.runSync(efectivo({...e,deduccionesTerritoriales2025:{solicitudes:[],donativosEstatales2025:s}}))
 const esperado=importe==="249.99"?"199.992":importe==="250"?"200":importe==="250.01"?"200.004":"220.548"
 expect(new D(ae.cuotaLiquidaLegal).minus(be.cuotaLiquidaLegal).toFixed()).toBe(esperado)
})
it("DA61 se aplica después de donativos, limitada a cuota líquida remanente",()=>{
 const e=entrada("16000"),sin=Effect.runSync(efectivo(e))
 // El 10%BL limita la donación; DA61 consume sólo el remanente, inferior a340.
 const con=Effect.runSync(efectivo({...e,deduccionesTerritoriales2025:{solicitudes:[],donativosEstatales2025:censo([op("20000")])}}))
 expect(new D(sin.deduccionTrabajo).gt(0)).toBe(true)
 expect(new D(con.cuotaLiquidaLegal).gt(0)).toBe(true); expect(new D(con.cuotaLiquidaLegal).lt(340)).toBe(true)
 expect(con.deduccionTrabajo).toBe(con.cuotaLiquidaLegal); expect(con.cuotaDiferencial).toBe("0")
})
it("API canónica cierra ámbito personal y territorial para P2",()=>{
 const c={...canon(),deduccionesTerritoriales2025:{solicitudes:[],donativosEstatales2025:censo()}}
 for(const mala of [{...c,comunidadAutonoma:"andalucia" as const},{...c,anio:2024 as const}]) expect(Effect.runSync(Effect.exit(anual(mala,{modo:"canonico"})))._tag).toBe("Failure")
})
