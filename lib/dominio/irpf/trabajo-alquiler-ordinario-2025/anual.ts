import Decimal from "decimal.js"
import { Effect } from "effect"
import type { CasoTrabajoAlquilerOrdinario2025 } from "./contrato"
import { prepararTrabajoAlquilerOrdinario2025 } from "./preparar"
import { componerLiquidacionAnual } from "../liquidacion/composicion-anual"
import { MINIMOS_ESTATALES_2025 } from "../../normativa/datos/minimos-autonomicos-2025"
import { crearLineaCalculo } from "../../explicacion/linea-calculo"
/** Ambas API comparten preparación y composición; legal y operativo se conservan separados. */
export const liquidarTrabajoAlquilerOrdinario2025 = Effect.fn("Trabajo.alquilerOrdinario2025")(function* (entrada: CasoTrabajoAlquilerOrdinario2025, cotizacionesModo: "efectivas" | "estimadas-perfil-uniforme" = "efectivas") {
 const {c,inm,neto,renta,base,bruto,cotizaciones,cero,empleo,politicaOpen}=yield* prepararTrabajoAlquilerOrdinario2025(entrada,cotizacionesModo)
 const composicion=yield* componerLiquidacionAnual({
  hechosAlquilerOpen2025:politicaOpen===undefined?undefined:c,
  inmueblesP4a:inm.inmuebles,
  ambito:{anio:2025,comunidadAutonoma:c.comunidadAutonoma,contribuyenteId:c.contribuyenteId,situacionFamiliar:{tipo:"individual",edad:c.edad,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]}},
  cotizaciones:{naturaleza:cotizacionesModo,trabajador:cotizaciones},precision:80,
  politica:"decimal-hasta-salida",
  rentasTrabajoAnuales:{integroTrabajo:bruto,restoRentas:renta},
  serviciosLaborales:empleo?{bruto,netoReducido:neto,otrasRentas:renta}:undefined,
  basesImponiblesE38:{general:base,ahorro:cero},baseGeneral:base,baseAhorro:cero,
  rentasAntesReducciones:neto.plus(renta),minimosEstatales:MINIMOS_ESTATALES_2025,
  deduccionesAutonomicasCentimos:0,
 })
 const retenciones=c.retenciones.reduce((a,r)=>a.plus(r.importe),cero)
 const diferencial=composicion.cuotaPosterior.minus(retenciones)
 const libro=composicion.politicaAlquilerOpen2025
 const operandos=libro===undefined?[]:[
  ["adquisicion",libro.totalAdquisicion],["catastro-total",libro.totalCatastro],
  ["catastro-construccion",libro.construccionCatastral],["coste-operativo",libro.costeOperativo],
  ["amortizacion",libro.amortizacion],["ingresos",libro.ingresos],["gastos",libro.gastos],
  ["neto-inmobiliario",libro.neto],["reduccion",libro.reduccion],["neto-reducido",libro.netoReducido],
  ["trabajo-bruto",bruto],["cotizaciones-efectivas",cotizaciones],["trabajo-neto",neto],["base",base],
  ["general-estatal",composicion.cuotaIntegraGeneralEstatal],["minimo-estatal",composicion.cuotaMinimoPersonalEstatal],
  ["general-autonomico",composicion.cuotaIntegraGeneralAutonomica],["minimo-autonomico",composicion.cuotaMinimoPersonalAutonomica],
  ["cuota-posterior",composicion.cuotaPosterior],["retenciones",retenciones],["diferencial",diferencial],
 ] as const
 return {_tag:"LiquidacionTrabajoAlquilerOrdinario2025" as const,perfil:c.perfil,ejercicio:2025 as const,contribuyenteId:c.contribuyenteId,liquidacionId:c.liquidacionId,
  politicaOpen:composicion.politicaAlquilerOpen2025,
  rastro:libro===undefined?undefined:{titulo:libro.nombre,pasos:[{
   _tag:"PasoExplicacion" as const,titulo:"Política operativa de alquiler ordinario",
   descripcion:"Porcentaje HALF_UP2 antes del coste sin cuantizar; amortización anual HALF_UP2; 50% exacto a céntimos; cuatro gravámenes HALF_UP2 antes de diferencias. Historia declarada pendiente de acreditación independiente.",
   lineasCalculo:[crearLineaCalculo({siteId:"alquiler.open.porcentaje",instancia:0,importe:libro.porcentaje,unidad:"percent",etiqueta:"Porcentaje catastral operativo",formula:"HALF_UP2(100 × construcción / total catastral)"}),
    ...operandos.map(([etiqueta,importe])=>crearLineaCalculo({siteId:`alquiler.open.${etiqueta}`,instancia:0,importe,unidad:"EUR",etiqueta,formula:"Operando producido por la preparación y composición común; véase libro operativo"}))],fuentes:[],
  }]},
  rastroOperativo:composicion.politicaAlquilerOpen2025===undefined?undefined:{
   alquiler:composicion.politicaAlquilerOpen2025, trabajo:{bruto,cotizaciones,neto}, base,
   gravamenes:{generalEstatal:composicion.cuotaIntegraGeneralEstatal,minimoEstatal:composicion.cuotaMinimoPersonalEstatal,
    generalAutonomico:composicion.cuotaIntegraGeneralAutonomica,minimoAutonomico:composicion.cuotaMinimoPersonalAutonomica},
   cuotaPosterior:composicion.cuotaPosterior,retenciones,diferencial,
  },
  inmuebles:inm.inmuebles,rendimientoNetoTrabajo:neto,baseImponibleGeneral:base,composicion,retenciones,
  cuotaDiferencial:diferencial,cuotaDiferencialPresentada:diferencial.toFixed(2,Decimal.ROUND_HALF_UP),legalRuleSelected:null,aceptacionFiscal:"pendiente" as const,
 }
})
