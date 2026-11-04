import { describe, expect, it } from "vitest"
import { VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025 as fichas } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/comunitat-valenciana"
import matriz from "../docs/procedencia/deducciones-2025/correcciones/g/matriz-completada.json"
import previo from "./deducciones-valencianas-datos-producto.previo.json"

// Expectativas normativas de los dictámenes g-vivienda-inversion,
// g-localizador, g-cultura-lengua y remisiones-documentales; no prueban cuotas.
function ficha(codigo: string) {
  const f = fichas.find((f) => f.codigo === codigo)
  if (f === undefined) throw new Error(`Falta ficha ${codigo}`)
  return f
}
const texto = (codigo: string) => ficha(codigo).requisitos.join(" ")
const entradas = (codigo: string) => ficha(codigo).entradaNecesaria.join(" ")

describe("composición documental valenciana de producto", () => {
  it("conserva las 40 fichas, importes, límites, páginas y estados previos", () => {
    expect(fichas).toHaveLength(40)
    expect(new Set(fichas.map((f) => f.codigo)).size).toBe(40)
    expect(
      fichas.map((f) => ({
        codigo: f.codigo,
        cuantia: f.cuantia,
        limites: f.limites,
        fuenteManual: f.fuenteManual,
        estado: f.estado,
      }))
    ).toEqual(previo)
    expect(
      fichas.every((f) => f.estado === "normalizada_pendiente_tests")
    ).toBe(true)
  })
  it("q.3 sustituye las entradas de donación por gasto propio acreditado", () => {
    const c = "valenciana_conservacion_patrimonio_cultural_titulares"
    const e = entradas(c)
    for (const concepto of [
      "titularidad",
      "Inventario",
      "intervención",
      "facturas",
      "ejecución",
      "pagos",
      "DA16",
    ])
      expect(e).toContain(concepto)
    expect(e).not.toMatch(
      /beneficiario|donatario|entrega|certificado|aceptación|interés social/i
    )
    expect(texto(c)).toContain("no certificado4.Tres")
    expect(texto(c)).toContain("no declaración interés social")
    expect(e).toContain("sin presumir descuentos no normados")
  })
  it("q.1/q.2 conservan donatarios restringidos, inscripción y certificado", () => {
    const q1 = "valenciana_donaciones_bienes_patrimonio_cultural"
    const q2 = "valenciana_donativos_conservacion_patrimonio_cultural"
    expect(texto(q1)).toContain("art3.1.a (fin cultural), b–f")
    expect(texto(q1)).toContain("No trasladar g/h/i")
    expect(entradas(q1)).toContain("acto de inclusión")
    for (const c of [q1, q2])
      expect(entradas(c)).toContain("certificado4.Tres.a")
    expect(texto(q2)).toContain("no exigir al donante autorización personal")
    expect(entradas(q2)).toContain("siguiente presupuesto")
  })
  it("r limita el censo al quinto grupo y al último día del período", () => {
    const c = "valenciana_donaciones_lengua_valenciana"
    expect(entradas(c)).toContain("grupos1–4 acreditan su categoría sin censo")
    expect(entradas(c)).toContain("solo grupo5")
    expect(entradas(c)).toContain("último día del período")
    expect(entradas(c)).toContain("fallecimiento")
    expect(texto(c)).toContain("no queda acreditada")
  })
  it("s distingue beneficiario e interés social y exige comunicación sin denegación", () => {
    const c =
      "valenciana_donaciones_cesiones_fines_culturales_cientificos_deportivos"
    expect(texto(c)).toContain("universidades privadas")
    expect(texto(c)).toContain(
      "no adquieren por ello interés social automático"
    )
    expect(entradas(c)).toContain(
      "comunicación cursada y ausencia de denegación"
    )
    expect(texto(c)).toContain("desde30diciembre2025")
    expect(entradas(c)).toContain("certificados diferenciados4.Tres.a/b")
  })
  it("x exige abono cubierto y adhesión vigente, sin certificado de donación", () => {
    const c = "valenciana_abonos_culturales"
    expect(entradas(c)).toContain("prórroga expresa")
    expect(entradas(c)).toContain("modalidad del abono cubierto")
    expect(entradas(c)).not.toMatch(
      /beneficiario|entrega|certificado|aceptación/i
    )
    expect(ficha(c).normativa).toContain("art4.Uno.x")
    expect(ficha(c).prorrateo.join(" ")).toContain("DA16")
    expect(texto(c)).not.toContain("Ley9/2014")
  })
  it("j conserva superficie construida y reserva histórica, sin indexar el visor", () => {
    const c = "valenciana_arrendador_renta_precio_referencia"
    expect(texto(c)).toContain("superficie construida catastral")
    expect(texto(c)).toContain("excluidos otros usos y comunes")
    expect(texto(c)).toContain("celda y versión histórica")
    expect(texto(c)).toContain("no autoriza indexarlo por IPC o IRAV")
    expect(entradas(c)).toContain("justificante del depósito y fecha")
  })
  it("w y DA13 separan ejecución actual e histórica sin exigir concesión", () => {
    const w = texto("valenciana_obras_conservacion_mejora_periodo")
    const da13 = texto("valenciana_obras_conservacion_mejora_2014_2015")
    expect(w).toContain("No exigir concesión de subvención")
    expect(w).toContain("DC23 quedó derogada")
    expect(w).toContain("desde30diciembre")
    expect(da13).toContain("RD233/2013 histórico o normativa autonómica")
    expect(da13).toContain(
      "No exigir planes2022–2025 ni Decreto65/2019 retroactivamente"
    )
  })
  it("z separa EECV material, ENISA y el corte del 30 de diciembre", () => {
    const r = matriz.articulos.find(
      (r) =>
        r.codigo === "valenciana_inversion_entidades_nuevas_reciente_creacion"
    )!
    const t = r.remisionesContrastadas.join(" ")
    expect(t).toContain("2025-12-30")
    expect(t).toContain("umbral >=30% del personal")
    expect(t).toContain("No se infiere un acto constitutivo autonómico")
    expect(t).toContain("Rechazar incremento por EECV con solo ENISA")
    expect(t).toContain("No exigir EECV para esa ampliación estatal")
    expect(r.pendienteConcreto).toContain("particular")
  })
  it("DANA conserva subámbitos fiscales y no hereda anexos de ayudas", () => {
    for (const codigo of [
      "valenciana_dana_danos_materiales_vivienda_habitual",
      "valenciana_dana_aportaciones_fondos_propios_entidades",
    ]) {
      const r = matriz.articulos.find((r) => r.codigo === codigo)!
      const t = [...r.remisionesContrastadas, r.remisionesYReserva].join(" ")
      expect(t).toMatch(/Loriguilla solo núcleo.*A3/)
      expect(t).toContain("València solo pedanías sur")
      expect(t).toContain("ayudas163/164 no amplían")
      expect(r.pendienteConcreto).toContain("particular")
    }
    const r = matriz.articulos.find(
      (r) =>
        r.codigo === "valenciana_dana_aportaciones_fondos_propios_entidades"
    )!
    expect(r.remisionesContrastadas.join(" ")).toContain(
      "Domicilio social y fiscal"
    )
    expect(r.remisionesContrastadas.join(" ")).toContain(
      "29oct2024 y solicitud ERTE"
    )
  })
})
