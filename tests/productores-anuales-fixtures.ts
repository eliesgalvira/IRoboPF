import { Effect } from "effect"
import { liquidarIrpfAnual, type CasoFiscalAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import type { HechosMaternidad2025 } from "../lib/dominio/irpf/maternidad-2025/contrato"
import { derechos81 } from "./maternidad-guarderia-fixtures"

export function clasica(h: HechosMaternidad2025 | undefined): CasoFiscalAnual {
 const base:CasoFiscalAnual={anio:2025,comunidadAutonoma:"castilla-y-leon",contribuyenteId:"s-1",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:3000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0}
 // Sólo concilia la renta propia del contrato de mínimos; los esperados monetarios son independientes.
 const neto=Effect.runSync(liquidarIrpfAnual(base,{modo:"canonico"})).rendimientoNetoTrabajoCentimos
 return {...base,derechosMinimos:derechos81("2023-01-01",neto),maternidad2025:h}
}
type Empleo2025 = Extract<CasoFiscalAnualExplicito, { ejercicio: 2025; perfil: "solo-trabajo" }>
export function explicita(h: HechosMaternidad2025 | undefined): Empleo2025 {
 return {ejercicio:2025,comunidadAutonoma:"castilla-y-leon",contribuyenteId:"s-1",edad:40,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"segun-derechos",derechosMinimos:derechos81(),maternidad2025:h,discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:{solicitudes:[]},rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"empleo",clase:"empleo-laboral",integro:"30000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[]}
}

import type { SolicitudDonativosEstatales2025 as Solicitud } from "../lib/dominio/irpf/deducciones/donativos-estatales-2025/esquemas"
function operacion(importe = "300", id = "op-estatal", entidadId = "e-estatal", nif = "G12345674") {
  return { operacionId: id, eleccion: "aplicar" as const, incremento: "general_40" as const,
    entidad: { id: entidadId, nif, clase: "fundacion" as const, registro: "registro-" + entidadId, regimen: "titulo_II_Ley49_2002" as const, referenciaRegimen: "regimen-" + entidadId, referenciaOpcionRegimen: "opcion-" + entidadId, regimenDesde: "2020-01-01", regimenHasta: "2025-12-31" },
    pago: { id: "p-" + id, operacionId: id, fecha: "2025-06-01", pagador: "s-1", receptorNIF: nif, euros: importe, documento: "doc-" + id, medio: "transferencia" as const },
    certificado: { referencia: "cert-" + id, operacionId: id, donante: "s-1", nifDonante: "12345678Z", inclusionArt16: "entidad_titulo_II" as const, entidadNIF: nif, fechaDonativo: "2025-06-01", euros: importe, destino: "fines-generales", caracter: "irrevocable_puro_simple" as const, contraprestacionEUR: "0" },
  }
}
export const censo = (operaciones: Solicitud["operaciones68_3"] = [operacion()]): Solicitud => ({ ejercicio: 2025, contribuyente: "s-1", nifContribuyente: "12345678Z", exhaustividad: "completo_68_3_y_68_5", referenciaCenso: "censo-documentado", operaciones68_3: operaciones, operaciones68_5: [] })
