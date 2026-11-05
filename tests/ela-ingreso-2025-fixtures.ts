import type { CensoIngresosIdentificados2025 } from "../lib/dominio/irpf/ingresos-identificados-2025/contrato"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import type { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"

type CensoAsturias = Omit<CensoIngresosIdentificados2025, "ayudas"> & {
  readonly ayudas: readonly Extract<CensoIngresosIdentificados2025["ayudas"][number], { readonly programa: "asturias-ela-2025" }>[]
}
export function censoELA(euros = "20000"): CensoAsturias {
  return {
    ejercicio: 2025, contribuyenteId: "A", ambito: "ayudas-publicas-no-transmision", exhaustividad: "completa",
    ayudas: [{
      ayudaId: "ELA1", beneficiario: "A", programa: "asturias-ela-2025", administracion: "principado_asturias", enfermedad: "ELA",
      clasificacionFiscal: "ganancia-patrimonial-no-transmision-no-exenta",
      resolucion: { referencia: "RES1", organismo: "Consejería de Salud del Principado de Asturias", fecha: "2025-09-01", importeConcedido: euros },
      cobros: [{ cobroId: "C1", beneficiario: "A", ordenante: "principado_asturias", fecha: "2025-10-01", euros, justificante: "JUST-C1" }],
    }],
  }
}
export function solicitudELA(censo = censoELA()): SolicitudDeduccionesTerritoriales2025 {
  return { solicitudes: [{ lote: "B-ampliado", hechos: { codigo: "asturias_ayudas_ela", ayudas: censo.ayudas.map(a => ({
    id: a.ayudaId, beneficiario: a.beneficiario, organismo: a.administracion,
    concesion: { referencia: a.resolucion.referencia, organismo: a.resolucion.organismo, fecha: a.resolucion.fecha },
    enfermedad: a.enfermedad, importeConcedido: a.resolucion.importeConcedido,
  })) } }] }
}
export function casoCanonicoELA(censo = censoELA(), solicitud = solicitudELA(censo)): CasoFiscalAnual {
  return { anio: 2025, comunidadAutonoma: "asturias", contribuyenteId: "A", situacionFamiliar: { tipo: "individual", edad: 45, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] },
    rendimientos: { trabajo: [] }, reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0,
    ingresosIdentificados2025: censo, deduccionesTerritoriales2025: solicitud,
  }
}
type CasoEfectivoELA = Extract<CasoFiscalAnualExplicito, { readonly perfil: "trabajo-y-ayudas-ela" }>
export function casoEfectivoELA(censo = censoELA(), solicitud = solicitudELA(censo), bruto = "0", clase: "pension" | "empleo-laboral" = "pension"): CasoEfectivoELA {
  return {
    ejercicio: 2025, comunidadAutonoma: "asturias", contribuyenteId: "A", edad: 45, modalidad: "individual", residenciaTodoElAnio: true, devengo: "2025-12-31", otrasRentas: "solo-ingresos-identificados",
    familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: "territoriales-por-hechos-y-da61", rentasExtranjeras: "ninguna", especialidades: "ninguna",
    perfil: "trabajo-y-ayudas-ela", ingresosIdentificados2025: censo, deduccionesTerritoriales2025: solicitud,
    conciliacion: { ejercicio: 2025, estado: "totales-anuales-sin-duplicados", procedencia: ["certificado-2025"] },
    trabajo: { ejercicio: 2025, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna", rendimientos: [{
      id: "T1", clase, integro: bruto, cotizaciones: { clase: "efectivas", seguridadSocial: "0", derechosPasivos: "0", colegiosHuerfanos: "0" }, sindicato: { importe: "0", satisfecho: "no" }, colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" }, defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" },
    }] }, retenciones: [],
  }
}
