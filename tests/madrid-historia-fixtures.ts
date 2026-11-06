import { derechos, solicitud, magnitudes } from "./f-auxiliares-revision-fixtures"
import type { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import type { HistoriaNacimientoMadrid } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/madrid-historia-esquema"
import { casoExplicitoC36 } from "./c36-conexion-anual.fixtures"
export function fixture(y: 2023 | 2024, dos = false, multiple = false, adopcion = false) {
  const d = derechos("madrid", dos)
  const nacimiento = adopcion ? "2020-02-01" : y + "-02-01"
  const hijos = multiple ? ["s-2", "s-4"] : ["s-2"]
  const grafo = { ...d, descendientes: hijos.map(sujetoId => ({ ...d.descendientes[0]!, sujetoId,
    fechaNacimiento: nacimiento, edadDevengo: 2025 - Number(nacimiento.slice(0,4)),
    titulares: d.descendientes[0]!.titulares.map(t => ({ ...t, vinculo: adopcion ? {
      clase: "adopcion" as const, fechaConstitucionVinculo: y + "-02-01", fechaInicioIncremento: y + "-02-01",
      fundamento: "inscripcion-registro-civil" as const, historialCompleto: true as const,
    } : t.vinculo })),
  })) }
  const s0 = solicitud("madrid", dos), a = s0.auxiliares!
  const historia: HistoriaNacimientoMadrid = { contribuyente: "s-1", referencia: "historia-documental",
    periodos: (y === 2023 ? [2023,2024] as const : [2024] as const).map(ejercicio => ({
      ejercicio, referencia: "certificados-" + ejercicio, modalidad: "individual", estadoCivil: "no_casado",
      censoCompleto: true, hijosCompletos: true,
      personas: ["s-1", ...(dos ? ["s-3"] : []), ...hijos].map(id => ({ id, soporte: "censo-rentas",
        residenteComunTodoEjercicio: true, vivoTodoEjercicio: true, residenciaAutonomica: "madrid",
        economia: { perfil: "sin-rentas", censoRentasCompleto: true },
      })),
      hijos: hijos.map(id => ({ id, nacimiento, progenitores: dos ? ["s-1", "s-3"] : ["s-1"],
        convivientesDevengo: dos ? ["s-1", "s-3"] : ["s-1"],
        vinculos: (dos ? ["s-1", "s-3"] : ["s-1"]).map(progenitor => adopcion
          ? { progenitor, clase: "adopcion" as const, constitucion: y + "-02-01" }
          : { progenitor, clase: "consanguinidad" as const }),
        independienteConConsentimiento: false, apoyoJudicial: "ninguno", soporte: "registro-padron",
      })),
    })),
  }
  const s: SolicitudAnualF2025 = { ...s0, historiaNacimientoMadrid: historia, auxiliares: { ...a,
    miembrosUnidad: ["s-1", ...hijos], progenitores: hijos.map(hijo => ({ ...a.progenitores[0]!, hijo })),
    eventos: [{ ...a.eventos[0]!, tipo: adopcion ? "adopcion" : "nacimiento", fecha: y + "-02-01", hijos }],
  } }
  const m0 = magnitudes("madrid", dos)
  const m = { ...m0, caso: { ...m0.caso, derechosMinimos: grafo }, sujetosConMinimo: hijos,
    atribucionesMinimo: hijos.map(sujetoId => ({ sujetoId, titulares: dos ? ["s-1", "s-3"] : ["s-1"] })),
  }
  return { s, m, trabajo: casoExplicitoC36([]).trabajo }
}
