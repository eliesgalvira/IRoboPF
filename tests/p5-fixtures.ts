import Decimal from "decimal.js"
import type { SolicitudDonativosEstatales2025 as Solicitud } from "../lib/dominio/irpf/deducciones/donativos-estatales-2025/esquemas"
import type { MagnitudesDonativos } from "../lib/dominio/irpf/deducciones/donativos-estatales-2025/productor"
import type { MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
export function operacion(importe = "300", id = "op-estatal", entidadId = "e-estatal", nif = "G12345674") {
  return { operacionId: id, eleccion: "aplicar" as const, incremento: "general_40" as const,
    entidad: { id: entidadId, nif, clase: "fundacion" as const, registro: "registro-" + entidadId, regimen: "titulo_II_Ley49_2002" as const, referenciaRegimen: "regimen-" + entidadId, referenciaOpcionRegimen: "opcion-" + entidadId, regimenDesde: "2020-01-01", regimenHasta: "2025-12-31" },
    pago: { id: "p-" + id, operacionId: id, fecha: "2025-06-01", pagador: "s-1", receptorNIF: nif, euros: importe, documento: "doc-" + id, medio: "transferencia" as const },
    certificado: { referencia: "cert-" + id, operacionId: id, donante: "s-1", nifDonante: "12345678Z", inclusionArt16: "entidad_titulo_II" as const, entidadNIF: nif, fechaDonativo: "2025-06-01", euros: importe, destino: "fines-generales", caracter: "irrevocable_puro_simple" as const, contraprestacionEUR: "0" },
  }
}
export const censo = (operaciones: Solicitud["operaciones68_3"] = [operacion()]): Solicitud => ({ ejercicio: 2025, contribuyente: "s-1", nifContribuyente: "12345678Z", exhaustividad: "completo_68_3_y_68_5", referenciaCenso: "censo-documentado", operaciones68_3: operaciones, operaciones68_5: [] })
export const magnitudes = (bl = "20000", estatal = "1000", autonomica = "1000"): MagnitudesDonativos => ({ contribuyente: "s-1", baseLiquidableGeneral: new Decimal(bl), baseLiquidableAhorro: new Decimal(0), cuotaEstatal: new Decimal(estatal), cuotaAutonomica: new Decimal(autonomica) })
const caso = (territorio: "cantabria" | "murcia" | "madrid" = "murcia"): MagnitudesTerritorialesAnuales["caso"] => ({ anio: 2025, comunidadAutonoma: territorio, contribuyenteId: "s-1", situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } })
export const anualCanonico = (): CasoFiscalAnual => ({ ...caso(), rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] }, reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0 })
export const anualEfectivo = () => ({ ejercicio: 2025, comunidadAutonoma: "murcia", contribuyenteId: "s-1", edad: 40, modalidad: "individual", residenciaTodoElAnio: true, devengo: "2025-12-31", otrasRentas: "ninguna", familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: { solicitudes: [] }, rentasExtranjeras: "ninguna", especialidades: "ninguna", perfil: "solo-trabajo", conciliacion: { ejercicio: 2025, estado: "totales-anuales-sin-duplicados", procedencia: ["certificado"] }, retenciones: [], trabajo: { ejercicio: 2025, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna", rendimientos: [{ id: "r", clase: "empleo-laboral", integro: "30000", cotizaciones: { clase: "efectivas", seguridadSocial: "0", derechosPasivos: "0", colegiosHuerfanos: "0" }, sindicato: { importe: "0", satisfecho: "no" }, colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" }, defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" } }] } } as const)

export const multiple = () => {
  const a = operacion("200", "uno"), b = operacion("200", "dos")
  return { ...censo([a,b]), prioridad68_3: [a.operacionId,b.operacionId] }
}
export const regional = (o: Solicitud["operaciones68_3"][number], biosanitaria = false) => ({
  lote: "F-ampliado" as const,
  codigo: biosanitaria ? "murcia_donativos_investigacion_biosanitaria" as const : "murcia_donativos_patrimonio_cultural_actividades" as const,
  hechos: {
    entidades: [{ id:o.entidad.id, certificado:"cert-regional",registro:"art3",proyectoMurcia:"si",situacionTributaria:"al_corriente",situacionSS:"al_corriente",cuentasPresentadas:"si",gradoVinculo:4,interesComun:"no",creditoFiscalVigente:"no",destino:biosanitaria?"investigacion_biosanitaria":"cultural",forma:biosanitaria?"entidad49_2002_biosanitaria":"entidad49_2002",biosanitaria:"registro-bio" }],
    pagos:[{id:o.pago.id,operacionId:o.operacionId,pagador:o.pago.pagador,objetoId:o.entidad.id,fecha:o.pago.fecha,importeEUR:o.pago.euros,concepto:"donativo_dinerario",medio:"transferencia",soportePago:o.pago.documento}]
  }
})

export const cantabria = (operaciones: Solicitud["operaciones68_3"]) => ({
  lote:"B-ampliado" as const,
  hechos:{codigo:"cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad" as const,donaciones:operaciones.map(o=>({id:o.operacionId,entidad:{id:o.entidad.id,clase:"fundacion" as const,domicilio:"cantabria",registro:{referencia:"registro",organismo:"registro",fecha:"2025-01-01"},cuentasProtectorado:{referencia:"cuentas",organismo:"protectorado",fecha:"2025-01-01"},depositoCuentas:{referencia:"deposito",organismo:"registro",fecha:"2025-01-01"},fines:["cultural" as const],utilidadPublica:null,ingresos:"0",aplicadoFinesInteresGeneral:"0",memoriaEconomica:null,certificacionDonacion:{referencia:"cert-"+o.operacionId,organismo:"entidad",fecha:"2025-06-01"}},pagos:[{id:o.pago.id,pagador:o.pago.pagador,receptor:o.entidad.id,fecha:o.pago.fecha,euros:o.pago.euros,documento:o.pago.documento,medio:o.pago.medio}]}))}
})
