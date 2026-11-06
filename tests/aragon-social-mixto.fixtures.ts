import type { CasoAragonSocialMixto2025 } from "../lib/dominio/irpf/aragon-social-mixto-2025/contrato"
/** Hechos sintéticos de los originales AEAT conservados; Plan administrativo declarado por separado. */
export function social(bruto="40000",renta="4800"): CasoAragonSocialMixto2025 {
 return {
  perfil:"aragon-social-mixto-2025",ejercicio:2025,comunidadAutonoma:"aragon",modalidad:"individual",devengo:"2025-12-31",residenciaTodoElAnio:true,
  contribuyenteId:"90000000B",liquidacionId:"L-social",edad:40,familiares:"ninguno",discapacidad:"ninguna",otrasRentas:"ninguna",reduccionesBase:"ninguna",compensaciones:"ninguna",otrasDeducciones:"ninguna",
  censoInmobiliario:{documento:"CENSO",cobertura:"mundial-propiedad-usufructo-cualquier-porcentaje-todo-2025",inmuebles:["V1"]},
  trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{
   id:"T1",clase:"empleo-laboral",integro:bruto,cotizaciones:{clase:"efectivas",seguridadSocial:"2000",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},
  conciliacion:{contribuyenteId:"90000000B",ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["CERT-TRABAJO"]},retenciones:[],
  inmuebles:[{
   id:"V1",catastro:"RC-SINTETICO",ubicacion:"aragon",titular:"90000000B",titulo:"TIT1",derecho:"propiedad",regimenMatrimonial:"no-casado",titulares:["90000000B"],
   adquisicion:{fecha:"2020-01-01",escritura:"ESC1",precio:"50000",gastosTributos:"0",sueloPrecio:"10000",sueloGastosTributos:"0"},catastro2025:{documento:"IBI",suelo:"8000",construccion:"32000"},
   usosDesdeAdquisicion:[{desde:"2020-01-01",hasta:"2024-12-31",uso:"a-disposicion"},{desde:"2025-01-01",hasta:"2025-12-31",uso:"alquiler-vivienda"}],
   contrato:{id:"C1",documento:"CONTRATO",firma:"2024-12-15",desde:"2025-01-01",hasta:"2025-12-31",arrendador:"90000000B",arrendatario:"90000001N",destino:"vivienda-permanente-persona-fisica",parentesco:"ninguno",fianzaDepositada:"FIANZA",zonaTensionada:false,alquilerSocial:false,rehabilitacionesTresAnios:"ninguna",repercusionObras:"0"},
   exigibilidades:[{id:"R1",documento:"RENTA",fecha:"2025-12-31",importe:renta}],gastos:[],censo:"contratos-ingresos-gastos-usos-y-titulares-completos",serviciosHospedaje:"ninguno",personalJornadaCompleta:"ninguno",ayudas:"ninguna",saldosPrevios:"ninguno",insolvencia:"ninguna",mobiliario:"ninguno",mejorasAnteriores2025:"ninguna",ingresosIrregulares:"ninguno",
  }],
  deduccionesTerritoriales2025:{solicitudes:[{lote:"A-aragon-dos",codigo:"aragon_arrendamiento_vivienda_social_arrendador",hechos:{viviendasPlan:[{inmueble:"V1",titular:"90000000B",titulo:"TIT1",gestor:{entidad:"gestor-distinto-arrendatario",clase:"entidad-gestora-Plan",habilitacion:"HABILITACION",mandatoPorCuentaPropietario:"MANDATO"},acta:"ACTA",desde:"2025-01-01",hasta:"2025-12-31"}]}}]},
 }
}
