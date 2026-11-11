import { fixture } from "./madrid-historia-fixtures"
import type { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"

/** El hogar sólo cambia por la filiación ordinaria del segundo hijo en 2024. */
export function dosOrigenes(dos = false, adopcion2023 = false, adopcion2024 = false) {
  const primero = fixture(2023, dos, false, adopcion2023)
  const segundo = fixture(2024, dos, false, adopcion2024)
  const a = primero.s.auxiliares!, b = segundo.s.auxiliares!
  const h = primero.s.historiaNacimientoMadrid!, p24 = segundo.s.historiaNacimientoMadrid!.periodos[0]!
  const nuevo = { ...segundo.m.caso.derechosMinimos!.descendientes[0]!, sujetoId: "s-4" }
  const s: SolicitudAnualF2025 = { ...primero.s,
    auxiliares: { ...a, miembrosUnidad: [...a.miembrosUnidad, "s-4"],
      progenitores: [...a.progenitores, { ...b.progenitores[0]!, hijo: "s-4" }],
      eventos: [a.eventos[0]!, { ...b.eventos[0]!, id: "evento-2024", hijos: ["s-4"] }],
    },
    historiaNacimientoMadrid: { ...h, periodos: h.periodos.map(p => p.ejercicio === 2023 ? p : { ...p,
      personas: [...p.personas, { ...p24.personas.find(x => x.id === "s-2")!, id: "s-4" }],
      hijos: [...p.hijos, { ...p24.hijos[0]!, id: "s-4" }],
    }) },
  }
  const m = { ...primero.m, sujetosConMinimo: ["s-2", "s-4"],
    atribucionesMinimo: [...primero.m.atribucionesMinimo, { sujetoId: "s-4", titulares: dos ? ["s-1", "s-3"] : ["s-1"] }],
    caso: { ...primero.m.caso, derechosMinimos: { ...primero.m.caso.derechosMinimos!,
      descendientes: [...primero.m.caso.derechosMinimos!.descendientes, nuevo],
    } },
  }
  return { s, m, trabajo: primero.trabajo }
}

export function conBruto(s: SolicitudAnualF2025, ejercicio: 2023 | 2024, bruto: string, persona = "s-1"): SolicitudAnualF2025 {
  const trabajo = fixture(2023).trabajo
  const h = s.historiaNacimientoMadrid!
  return { ...s, historiaNacimientoMadrid: { ...h, periodos: h.periodos.map(p => p.ejercicio !== ejercicio ? p : { ...p,
    personas: p.personas.map(x => x.id !== persona ? x : { ...x, economia: {
      perfil: "solo-trabajo" as const, censoRentasCompleto: true as const,
      otrasRentas: "ninguna" as const, reduccionesBase: "ninguna" as const, saldosAnteriores: "ninguno" as const,
      trabajo: { ...trabajo, ejercicio, rendimientos: trabajo.rendimientos.map(r => ({ ...r, integro: bruto })) },
    } }),
  }) } }
}
