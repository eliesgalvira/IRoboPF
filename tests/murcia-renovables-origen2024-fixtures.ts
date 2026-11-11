import type { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import type { HistoriaRenovablesMurcia2024 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/murcia-renovables-historia-esquema"
import { efectivo } from "./revision-f-fixtures"
export const codigoRenovables = "murcia_instalaciones_recursos_energeticos_renovables" as const
export function historia2024(): HistoriaRenovablesMurcia2024 {
  const t = efectivo().trabajo
  return {
    ejercicio: 2024, contribuyente: "s-1", referencia: "expediente-2024", nacimiento: "1985-01-01",
    residencia: "murcia-todo-2024-y-2025", modalidad: "individual", devengo: "2024-12-31",
    familia: "ninguna", discapacidad: "ninguna", otrasRentas: "ninguna", reduccionesBase: "ninguna",
    deduccionesGenerales: "ninguna", otrasDeduccionesAutonomicas: "ninguna", otrosSaldos: "ninguno",
    declaracion: "declaracion2024", eleccion2024: "aplicar", eleccion2025: "aplicar",
    empleo: { perceptor: "s-1", pagador: "empresa", rendimientoId: "r", certificado: "certificado2024",
      desde: "2024-01-01", hasta: "2024-12-31", retencionesEUR: "1000" },
    trabajo: { ...t, ejercicio: 2024, rendimientos: [{ ...t.rendimientos[0], integro: "30000",
      cotizaciones: { ...t.rendimientos[0].cotizaciones, seguridadSocial: "2000" } }] },
    inventario: { referencia: "censo-completo", completoHasta: "2025-12-31", otrasInstalaciones: "ninguna",
      inversiones2023: "ninguna", inversiones2025: "ninguna", ayudasPosteriores2024: "ninguna" },
    vivienda: { id: "v2024", titular: "s-1", territorio: "murcia", porcentajePropiedad: "100", uso: "habitual",
      adquisicion: "2020-01-01", ocupacionDesde: "2020-01-01", permanenciaHasta: "2025-12-31", soporte: "escritura-padron" },
    instalacion: { id: "solar2024", operacionId: "op2024", titular: "s-1", viviendaId: "v2024", finalizacion: "2024-05-01",
      tecnologia: "solar_fotovoltaica", autoconsumo: "excedentes_compensados", instalador: "instalador", habilitacionInstalador: "registro",
      declaracionResponsable: { referencia: "dr2024", titular: "s-1", instalacionId: "solar2024", fecha: "2024-05-01" } },
    factura: { id: "factura2024", concepto: "adquisicion-e-instalacion-renovable", operacionId: "op2024", instalacionId: "solar2024", destinatario: "s-1", emisor: "instalador",
      fecha: "2024-05-01", importeEUR: "10000", soporte: "factura-original2024" },
    pagos: [{ id: "p2024", operacionId: "op2024", instalacionId: "solar2024", facturaId: "factura2024", pagador: "s-1", beneficiario: "instalador",
      fecha: "2024-06-01", importeEUR: "10000", medio: "transferencia", soporte: "banco2024" }], ayudas: [],
  }
}
export function renovables2024(h = historia2024()): SolicitudAnualF2025 {
  return { lote: "F-ampliado", codigo: codigoRenovables, hechos: {}, historiaRenovablesMurcia2024: h,
    historialSaldosIncentivoMurcia: { codigo: codigoRenovables, periodos: [2023, 2024], contribuyente: "s-1",
      referencia: "censo-origenes", operaciones: [{ objetoId: "solar2024", ejercicioOrigen: 2024, referencia: "factura-original2024" }] } }
}
