import { describe, expect, it } from "vitest"
import { ASTURIAS_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/asturias"
import { CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/cantabria"
import {
  calcularDeduccionesAutonomicasAplicadas,
  calcularDeduccionesConsignadas,
} from "../lib/dominio/irpf/deducciones-autonomicas-aplicadas"

const fichas = [
  ...ASTURIAS_DEDUCCIONES_AUTONOMICAS_2025,
  ...CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025,
]

describe("procedencia de Asturias y Cantabria en 2025", () => {
  it("conserva las 48 identidades sin prometer fórmulas en fichas manuales", () => {
    expect(fichas).toHaveLength(48)
    expect(new Set(fichas.map((ficha) => ficha.codigo)).size).toBe(48)
    for (const ficha of CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025) {
      expect(JSON.stringify(ficha)).not.toContain(
        "Ficha implementada con control de interfaz"
      )
    }
  })

  it("documenta el límite de obras y los tres porcentajes de economía social", () => {
    const obras = fichas.find(
      (ficha) => ficha.codigo === "cantabria_obras_mejora"
    )
    const social = fichas.find(
      (ficha) =>
        ficha.codigo === "cantabria_inversiones_donaciones_economia_social"
    )
    expect(JSON.stringify(obras)).toContain("1.500")
    for (const porcentaje of ["20%", "50%", "25%"])
      expect(JSON.stringify(social)).toContain(porcentaje)
  })

  it("no inventa un límite de base del contribuyente para cuidado de familiares", () => {
    const ficha = fichas.find(
      (ficha) => ficha.codigo === "cantabria_cuidado_familiares"
    )
    expect(JSON.stringify(ficha)).not.toContain("31.485")
    expect(JSON.stringify(ficha)).toContain("6.000")
  })

  it("excluye la renta de exactamente 8.000 euros en traslado por estudios", () => {
    const ficha = fichas.find(
      (ficha) => ficha.codigo === "cantabria_traslado_estudios_despoblamiento"
    )
    // Ley 3/2024, art. 3.Uno: art. 2.11.4, rentas inferiores a 8.000.
    expect(JSON.stringify(ficha)).toContain(
      "rentas anuales inferiores a 8.000 euros"
    )
    expect(JSON.stringify(ficha)).not.toContain("no superiores a 8.000")
  })

  it("reproduce la limitación del helper parcial de alquiler conjunto", () => {
    const codigo = "cantabria_arrendamiento_jovenes_mayores_discapacidad"
    const entradas = { [`${codigo}:cumple`]: true, [`${codigo}:base`]: 6000 }
    const ambito = { ejercicio: 2025, territorio: "cantabria" }
    // Artículo 2.1: con 6.000 elegibles en conjunta corresponde min(10%, 600).
    expect(Math.min(6000 * 0.1, 600)).toBe(600)
    expect(calcularDeduccionesAutonomicasAplicadas(entradas, ambito)).toBe(300)
    // La ruta de consignación no aplica esa fórmula parcial.
    expect(calcularDeduccionesConsignadas(entradas, ambito)).toBe(0)
    expect(
      calcularDeduccionesConsignadas(
        { ...entradas, [`${codigo}:importe`]: 600 },
        ambito
      )
    ).toBe(600)
  })

  it("reproduce la ausencia de reparto por progenitor del helper de nacimientos", () => {
    const codigo = "cantabria_nacimiento_adopcion_hijos"
    const ambito = { ejercicio: 2025, territorio: "cantabria" }
    const entradas = { [`${codigo}:cumple`]: true, [`${codigo}:unidades`]: 1 }
    expect(1400 / 2).toBe(700)
    expect(calcularDeduccionesAutonomicasAplicadas(entradas, ambito)).toBe(1400)
    expect(calcularDeduccionesConsignadas(entradas, ambito)).toBe(0)
  })
})
