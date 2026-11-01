import { describe, expect, it } from "vitest"
import lote from "../docs/procedencia/deducciones-2025/lotes/b/dictamenes.json"
import { CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/cantabria"

const registro = (codigo: string) =>
  lote.deducciones.find((r) => r.codigo === codigo)!

describe("atribución jurídica de la evidencia B", () => {
  it("educación no usa inflación 2022 ni sus límites de renta", () => {
    const r = registro("cantabria_gastos_educacion")
    for (const c of r.citas)
      expect(c.textoLiteral).not.toContain("mitigar el impacto")
    for (const c of r.comparaciones) {
      expect(c.reglaOficial).not.toMatch(/22\.946|31\.485|inflación/)
    }
    expect(
      r.citas.some(
        (c) =>
          c.articulo.includes("3.Ocho") && c.textoLiteral.includes("200 euros")
      )
    ).toBe(true)
  })
  it("vehículos usa la prórroga 2025 de Ley 8/2024 y excluye la ampliación 2026", () => {
    const r = registro("asturias_vehiculos_electricos")
    const c = r.citas.find((c) => c.id.endsWith("-n1"))!
    expect(c.articulo).toContain("39.Tres")
    expect(c.textoLiteral).toContain("2025")
    expect(c.textoLiteral).not.toContain("2026")
    expect(
      r.citas
        .filter((c) => !c.id.endsWith("-vigencia"))
        .some((c) => c.textoLiteral.includes("2025 y \n2026"))
    ).toBe(false)
  })
  it("emancipación prueba su propia renta y acreditación, no el artículo de vivienda", () => {
    const r = registro("asturias_emancipacion_jovenes_hasta_35")
    for (const c of r.citas.filter((c) => c.id.includes("-original-pdf-"))) {
      expect(c.articulo).toContain("38.Dieciocho")
      expect(c.articulo).toContain("14 terdecies")
    }
  })
  it("gastos vitales acredita el apartado 3 propio y no 6.4", () => {
    const c = registro("asturias_gastos_vitales_hasta_35").citas.find((c) =>
      c.id.endsWith("-original-pdf-1")
    )!
    expect(c.articulo).toContain("39.Seis")
    expect(c.textoLiteral).toMatch(/3\./)
  })
  it("las páginas activas corresponden a la sección de la edición fijada", () => {
    for (const f of CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025) {
      expect(f.fuenteManual.paginas).toEqual(
        registro(f.codigo).manual.paginasComprobadas
      )
    }
  })
})

describe("condiciones documentales que no valida la consignación", () => {
  const texto = (codigo: string) =>
    JSON.stringify(
      CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025.find((f) => f.codigo === codigo)
    )
  it("donativos comparte el límite de base con las deducciones estatales", () => {
    expect(
      texto(
        "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad"
      )
    ).toContain("68.3 y 68.5")
  })
  it("obras incrementa por cada contribuyente con discapacidad en conjunta", () => {
    expect(texto("cantabria_obras_mejora")).toContain(
      "500 euros por cada contribuyente"
    )
  })
  it("economía social distingue cinco años de inversión y tres de entidad", () => {
    const t = texto("cantabria_inversiones_donaciones_economia_social")
    expect(t).toContain("cinco años")
    expect(t).toContain("tres años")
  })
  it("vivienda vacía excluye una cartera de cuatro viviendas", () => {
    expect(texto("cantabria_arrendamiento_viviendas_vacias")).toContain(
      "titular de más de tres viviendas"
    )
  })
})

it("no atribuye a artículos de escala, tasas o créditos pasajes de deducción", () => {
  const esperadas = {
    cantabria_arrendamiento_jovenes_mayores_discapacidad: "3.Dos",
    cantabria_obras_mejora: "3.Cuatro",
    cantabria_inversion_entidades_nuevas_reciente_creacion: "10.Uno",
    cantabria_gastos_guarderia: "3.Cinco",
    cantabria_residencia_municipio_riesgo_despoblamiento: "3.Uno",
    cantabria_gastos_educacion: "3.Ocho",
    cantabria_ayuda_domestica: "3.Nueve",
    cantabria_inversiones_nuevos_contribuyentes_extranjero: "3.Dos",
  }
  for (const [codigo, articulo] of Object.entries(esperadas)) {
    for (const c of registro(codigo).citas.filter((c) => /-o\d+$/.test(c.id))) {
      expect(c.articulo).toContain(articulo)
      expect(c.articulo).toContain(" -> DL 62/2008, 2.")
    }
  }
  const autonomos = registro(
    "asturias_autonomos_concejos_despoblamiento"
  ).citas.find((c) => c.id.endsWith("-original-pdf-2"))!
  expect(autonomos.textoLiteral).not.toContain("familia numerosa")
  expect(autonomos.articulo).toContain("38.Doce")
  const transporte = registro(
    "asturias_transporte_publico_despoblamiento"
  ).citas.find((c) => c.id.endsWith("-original-pdf-2"))!
  expect(transporte.articulo).toContain("38.Trece")
  expect(transporte.textoLiteral.startsWith("3.")).toBe(true)
})

it("formación conserva las actividades de 2020 y sustituye los apartados 1–2", () => {
  const r = registro("asturias_formacion_trabajos_cualificados_idi")
  const actividades = r.citas.find(
    (c) => c.articulo.includes("39.Seis") && c.apartado.includes("completo")
  )!
  expect(actividades.textoLiteral).toContain("Grupo de Cotización")
  expect(actividades.textoLiteral).toContain("informe favorable")
  expect(actividades.textoLiteral).toContain("alto potencial de crecimiento")
  const gastos = r.citas.find(
    (c) => c.articulo.includes("39.Dos") && c.apartado.includes("completo")
  )!
  expect(gastos.textoLiteral).toContain("una sola vez")
  expect(gastos.textoLiteral).toContain("gastos de formación satisfechos")
})
