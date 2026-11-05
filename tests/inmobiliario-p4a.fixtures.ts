import type { CasoInmobiliarioP4a } from "../lib/dominio/irpf/inmobiliario-2025/contrato"
import { viviendaConexionC36 } from "./c36-conexion-anual.fixtures"

export function casoP4a(): CasoInmobiliarioP4a {
  return {
    perfil: "solo-inmobiliario-p4a", ejercicio: 2025, contribuyenteId: "s-1", liquidacionId: "L2025",
    comunidadAutonoma: "canarias", edad: 40, otrasRentas: "ninguna", familiares: "ninguno", discapacidad: "ninguna", reduccionesBase: "ninguna", retenciones: [],
    inmuebles: [{
      id: "V1", catastro: "RC1", ubicacion: "canarias", titular: "s-1", titulo: "TIT1", derecho: "propiedad", regimenMatrimonial: "no-casado", titulares: ["s-1"],
      adquisicion: { fecha: "2020-01-01", escritura: "ESC1", precio: "100000", gastosTributos: "0", sueloPrecio: "20000", sueloGastosTributos: "0" },
      catastro2025: { documento: "IBI1", suelo: "10000", construccion: "50000" },
      usosDesdeAdquisicion: [{ desde: "2020-01-01", hasta: "2024-12-31", uso: "personal" }, { desde: "2025-01-01", hasta: "2025-12-31", uso: "alquiler-vivienda" }],
      contrato: { id: "C1", documento: "CONTRATO1", firma: "2024-12-01", desde: "2025-01-01", hasta: "2026-01-01", arrendador: "s-1", arrendatario: "inquilino", destino: "vivienda-permanente-persona-fisica", parentesco: "ninguno", fianzaDepositada: "IBAVI1", zonaTensionada: false, alquilerSocial: false, rehabilitacionesTresAnios: "ninguna", repercusionObras: "0" },
      exigibilidades: [{ id: "R1", documento: "EXIGIBLE1", fecha: "2025-01-01", importe: "12000" }],
      gastos: [{ id: "P1", factura: "F1", lineaFactura: "1", totalFactura: "1000", fechaOperacion: "2025-06-01", fechaFactura: "2025-06-01", fechaPago: "2025-06-01", importe: "1000", clase: "reparacion", prestadorNif: "B12345678" }],
      censo: "contratos-ingresos-gastos-usos-y-titulares-completos", serviciosHospedaje: "ninguno", personalJornadaCompleta: "ninguno", ayudas: "ninguna", saldosPrevios: "ninguno", insolvencia: "ninguna", mobiliario: "ninguno", mejorasAnteriores2025: "ninguna", ingresosIrregulares: "ninguno",
    }],
  }
}
export function solicitudP4a(balears = false) {
  const codigo = balears ? "balears_mejora_sostenibilidad_vivienda" : "canarias_adecuacion_inmueble_arrendamiento"
  const s = viviendaConexionC36(codigo), v = s.hechos.viviendas[0]
  if (v === undefined || v.gastos[0] === undefined) throw new Error("Fixture publicada sin vivienda/pago")
  return {
    ...s, hechos: { ...s.hechos, viviendas: [{ ...v, uso: "arrendada" as const,
      alquiler: { arrendador: "s-1", arrendatario: "inquilino", desde: "2025-01-01", hasta: "2026-01-01", fianza: "IBAVI1", repercusionObras: "0", programa: "ordinario" as const, parientesGrado: 0 },
      gastos: [{ ...v.gastos[0], fecha: "2025-06-01", perceptor: "B12345678", concepto: balears ? "energia" as const : "reparacion" as const, importe: "1000", ayudasExentas: "0", reembolsos: "0", naturaleza: "propio" as const }],
      certificadoAntes: { registro: "REG-A", calificacion: "D" as const }, certificadoDespues: { registro: "REG-B", calificacion: "C" as const },
      historiaContratos: [{ id: "C1", desde: "2025-01-01", hasta: "2026-01-01" }],
    }] },
  }
}
