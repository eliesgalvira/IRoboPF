import { describe, expect, it } from "vitest"
import { VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025 as fichas } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/comunitat-valenciana"

const texto = (codigo: string) => {
  const ficha = fichas.find((f) => f.codigo === `valenciana_${codigo}`)
  expect(ficha).toBeDefined()
  return JSON.stringify({
    cuantia: ficha?.cuantia,
    requisitos: ficha?.requisitos,
    limites: ficha?.limites,
    prorrateo: ficha?.prorrateo,
    compatibilidades: ficha?.compatibilidades,
  })
}

describe("fronteras documentales contrastadas con originales y manual", () => {
  it("z: límite reforzado final y ámbito exacto de 4.Dos", () => {
    const t = texto("inversion_entidades_nuevas_reciente_creacion")
    expect(t).toContain("15.000")
    expect(t).toContain("30 de diciembre de 2025")
    expect(t).toContain("no incluye z")
    expect(t).toContain("q.2/q.3/r/s")
  })
  it("DANA conserva el límite propio del artículo 5", () => {
    const t = texto("dana_aportaciones_fondos_propios_entidades")
    expect(t).toContain("9.900")
    expect(t).toContain("30%")
  })
  it("nacimiento: régimen previo y frontera estricta de acogimiento", () => {
    const t = texto("nacimiento_adopcion_guarda_acogimiento")
    expect(t).toContain("antes de 2025 con derecho previo")
    expect(t).toContain("más de 183 días")
    expect(t).toContain("183 no basta")
  })
  it("fertilidad: reducción del importe, no porcentaje del gasto", () => {
    const t = texto("tratamientos_fertilidad")
    expect(t).toContain("4.Cinco")
    expect(t).toContain("28.500")
    expect(t).toContain("50 euros")
  })
  it("renovables: el exceso sobre base no origina arrastre", () => {
    const t = texto("autoconsumo_renovables")
    expect(t).toContain("insuficiencia de cuota")
    expect(t).toContain("exceso de inversión sobre la base máxima no genera")
  })
  it("vehículo compartido y conjunta: base máxima única", () => {
    const t = texto("vehiculos_orden_5_2020")
    expect(t).toContain("repartir entre contribuyentes")
    expect(t).toContain("no se multiplica")
  })
  for (const codigo of [
    "gastos_salud",
    "deporte_actividades_saludables",
    "fomento_formacion_musical",
  ]) {
    it(`${codigo}: reformas de 2026 con efectos expresos en 2025`, () => {
      const t = texto(codigo)
      expect(t).toContain("desde 1 de enero de 2025")
      expect(t).toContain("78.000")
      expect(t).toContain("6.000")
    })
  }
})
