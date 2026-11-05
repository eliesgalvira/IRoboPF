// Revisión independiente recibida; adaptación de localización explícita documentada por el integrador.
import { Effect } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { ViviendaC36 } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-esquemas"
import { casoUniformeC36, casoExplicitoC36, viviendaConexionC36 } from "./c36-conexion-anual.fixtures"
export type Solicitud = typeof ViviendaC36.Type
export type Api = "uniforme" | "efectiva"
export function hechos(edad = 29, importe = "1000"): Solicitud {
  const base = viviendaConexionC36("balears_arrendamiento_vivienda_habitual")
  const nacimiento = `${2025 - edad}-01-01`
  return { ...base, hechos: { nacimientoContribuyente: nacimiento, exhaustividad: "completa",
    censoViviendaInversion: { persona: "s-1", desde: nacimiento, hasta: "2025-12-31",
      cobertura: "vivienda_titulos_operaciones_completo", soporte: "SINTETICO-COMPLETO",
      altasRETA: [], operaciones: [], titulos: [{ id: "T", documento: "C", catastro: "RC1",
        derecho: "arrendatario", desde: "2025-01-01", hasta: "2025-12-31" }] },
    viviendas: [{ id: "V-R", catastro: "RC1", localizacion: { territorio: "illes-balears", isla: "Mallorca", catastro: "RC1", documento: "CATASTRO" }, derecho: "arrendatario", uso: "habitual_propia",
      habitualDesde: "2025-01-01", ocupacion: "2025-01-01", propietarios: [],
      historiaContratos: [], censoContratos: "completo_desde_adquisicion",
      alquiler: { arrendador: "s-8", arrendatario: "s-1", desde: "2025-01-01", hasta: "2026-01-01",
        fianza: "DEPOSITO-IBAVI", programa: "ordinario", parientesGrado: 0, islaDestino: "Mallorca" },
      gastos: [{ id: "P-R", factura: "F-R", fecha: "2025-06-01", pagador: "s-1", perceptor: "s-8",
        importe, ayudasExentas: "0", reembolsos: "0", medio: "transferencia", naturaleza: "propio",
        distribucion: [{ persona: "s-1", porcentaje: "100" }], concepto: "alquiler" }] }],
  } }
}
// Misma remuneración y mismas cotizaciones, sin usar una API como oráculo de la otra.
// 2025: .047 + .0155 + .001 + .0013 = .0648; 30000 * .0648 = 1944.
export function ejecutar(api: Api, solicitudes: readonly Solicitud[], edad = 29, alto = false) {
  const salario = alto ? "40000" : "30000"
  const cotizacion = alto ? "2592" : "1944"
  if (api === "uniforme") {
    const c = casoUniformeC36()
    return Effect.runSync(liquidarIrpfAnual({ ...c, comunidadAutonoma: "illes-balears",
      situacionFamiliar: { ...c.situacionFamiliar, edad },
      rendimientos: { trabajo: [{ importeIntegroCentimos: alto ? 4000000 : 3000000 }] },
      deduccionesTerritoriales2025: { solicitudes } }, { modo: "canonico" }))
  }
  const c = casoExplicitoC36(solicitudes)
  return Effect.runSync(liquidarIrpfAnualExplicito({ ...c, comunidadAutonoma: "illes-balears", edad,
    deduccionesTerritoriales2025: { solicitudes },
    trabajo: { ...c.trabajo, rendimientos: c.trabajo.rendimientos.map(r => ({ ...r, integro: salario,
      cotizaciones: { clase: "efectivas" as const, seguridadSocial: cotizacion, derechosPasivos: "0", colegiosHuerfanos: "0" } })) } }))
}
export function conObra(s: Solicitud): Solicitud {
  const v = s.hechos.viviendas[0]
  return { lote: "C36", codigo: "balears_mejora_sostenibilidad_vivienda", hechos: {
    nacimientoContribuyente: s.hechos.nacimientoContribuyente, exhaustividad: "completa",
    viviendas: [{ ...v, id: "V-OBRA", certificadoAntes: { registro: "E-ANTES", calificacion: "D" },
      certificadoDespues: { registro: "E-DESPUES", calificacion: "C" },
      gastos: v.gastos.map(p => ({ ...p, id: "P-OBRA", factura: "F-OBRA", perceptor: "s-7", concepto: "energia", importe: "100" })) }],
  } }
}
