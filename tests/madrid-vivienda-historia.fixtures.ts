import Decimal from "decimal.js"
import { producirBasesFamiliares2025, type CensoBasesFamiliares2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { type MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import type { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import { analitico, efectivo, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { casos } from "./p7-madrid-fixtures"
const D = Decimal.clone({ precision: 80 })
const hipoteca = "madrid_incremento_costes_financiacion_vivienda"
const nacimiento = "madrid_vivienda_nacimiento_adopcion_hijos"
export function censo(): CensoBasesFamiliares2025 {
  return {
    referencia: "Madrid-P13-sintetico", ejercicio: 2025, devengo: "2025-12-31", contribuyente: "s-1",
    estadoCivil: "casado-no-separado", conyuge: "s-2", censoCompleto: true, hijosCompletos: true,
    hijos: [{ id: "s-3", nacimiento: "2023-01-01", progenitores: ["s-1", "s-2"], conviveCon: ["s-1", "s-2"], independienteConConsentimiento: false, apoyoJudicial: "ninguno", soporte: "filiacion" }],
    personas: ["s-1", "s-2", "s-3"].map(id => ({ id, soporte: "economia", residenteComunTodo2025: true, vivoTodo2025: true,
      economia: id === "s-1" ? { perfil: "declarante-en-composicion" } : id === "s-2" ? {
        perfil: "solo-trabajo", censoRentasCompleto: true, otrasRentas: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", trabajo: efectivo.trabajo,
      } : { perfil: "sin-rentas", censoRentasCompleto: true } })),
  }
}
export function familia(adopcion = false) {
  return { ...derechos, descendientes: derechos.descendientes.map(d => ({ ...d, fechaNacimiento: "2023-01-01", edadDevengo: 2, titulares: d.titulares.map(t => ({ ...t, vinculo: adopcion ? { clase: "adopcion" as const, fechaConstitucionVinculo: "2023-01-01", fechaInicioIncremento: "2023-01-01", fundamento: "inscripcion-registro-civil" as const, historialCompleto: true as const } : t.vinculo })) })) }
}
export function solicitud(codigo: typeof hipoteca | typeof nacimiento): SolicitudAnualF2025 {
  if (codigo === hipoteca) {
    const s = casos[0]!.solicitud
    const { miembrosUnidad: _miembros, ...hechos } = s.hechos
    return { ...s, hechos }
  }
  return { lote: "F-ampliado", codigo, hechos: {
    viviendas: [{ id: "v", territorio: "madrid", adquisicion: "2025-01-01", precioEUR: "100000", gastosEUR: "2000", tributosEUR: "8000", ocupacionDesde: "2025-02-01", permanenciaHasta: "2025-12-31", titulares: ["s-1"], porcentajePropiedad: "100" }],
    personas: [{ id: "s-3", relacion: "hijo", nacimiento: "2023-01-01", certificadoParentesco: "filiacion", situacionDevengo: "vivo", alimentos64175: "no", rentasNoExentasEUR: "0", declaracionTipo: "no_presentada", discapacidadPorcentaje: "0", convivencia: [{ desde: "2025-01-01", hasta: "2025-12-31" }], gradoMasCercanoConPrioridad: [], titularesMinimo: ["s-1", "s-2"] }],
  } }
}
export function magnitudes(general = "20000", cuota = "10000", c = censo()): MagnitudesTerritorialesAnuales {
  const caso = { ...analitico, contribuyenteId: "s-1", derechosMinimos: familia() }
  return { caso, baseGeneral: new D(general), baseAhorro: new D(0), minimoPersonalFamiliar: new D(5550), cuotaAutonomica: new D(cuota), sujetosConMinimo: ["s-3"], atribucionesMinimo: [{ sujetoId: "s-3", titulares: ["s-1", "s-2"] }], libroBasesFamiliares2025: producirBasesFamiliares2025(c, caso, { general: new D(general), ahorro: new D(0) }) }
}

import type { HistoriaViviendaMadrid } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/madrid-vivienda-historia-esquema"
export function fixture(y: 2023 | 2024 | 2025, adopcion = false) {
  const s = solicitud(nacimiento), v = s.hechos.viviendas![0]!
  const compra = y + "-03-01", ocupacion = y + "-04-01"
  const historia: HistoriaViviendaMadrid = {
    contribuyente: "s-1", viviendaId: "v", adquisicion: compra, referencia: "escritura-censo-padron",
    modalidadAdquisicion: "compraventa-terminada", unidadHabitualDesde: ocupacion, unidadHabitualHasta: "2025-12-31",
    periodos: (y === 2023 ? [2023, 2024] as const : [2024] as const).map(ejercicio => ({
      ejercicio, referencia: "hechos-" + ejercicio, modalidad: "individual", estadoCivil: "casado-no-separado", conyuge: "s-2",
      censoCompleto: true, hijosCompletos: true,
      personas: ["s-1", "s-2", "s-3"].map(id => ({ id, soporte: "rentas-" + ejercicio,
        residenteComunTodoEjercicio: true, vivoTodoEjercicio: true, residenciaAutonomica: "madrid",
        economia: id === "s-3" ? { perfil: "sin-rentas", censoRentasCompleto: true } : {
          perfil: "solo-trabajo", censoRentasCompleto: true, otrasRentas: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno",
          trabajo: { ...efectivo.trabajo, ejercicio },
        },
      })),
      hijos: [{ id: "s-3", nacimiento: "2023-01-01", progenitores: ["s-1", "s-2"], convivientesDevengo: ["s-1", "s-2"],
        vinculos: ["s-1", "s-2"].map(progenitor => adopcion ? { progenitor, clase: "adopcion", constitucion: "2023-01-01" } : { progenitor, clase: "consanguinidad" }),
        independienteConConsentimiento: false, apoyoJudicial: "ninguno", declaracion: "no-presenta", soporte: "registro-padron",
      }],
    })),
  }
  let solicitudCompra: SolicitudAnualF2025 = { ...s,
    hechos: { ...s.hechos, viviendas: [{ ...v, adquisicion: compra, ocupacionDesde: ocupacion }],
      personas: s.hechos.personas!.map(p => adopcion ? { ...p, adopcionFecha: "2023-01-01" } : p) },
  }
  if (y !== 2025) solicitudCompra = { ...solicitudCompra, historiaViviendaMadrid: historia }
  return { s: solicitudCompra, c: censo(), d: familia(adopcion), m: magnitudes() }
}
