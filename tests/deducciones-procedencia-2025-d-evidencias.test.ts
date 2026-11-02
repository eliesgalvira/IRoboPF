import { describe, expect, it } from "vitest"
import lote from "../docs/procedencia/deducciones-2025/lotes/d/dictamenes.json"
import { DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS as catalogo } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025"

const articulos = {
  extremadura_intereses_vivienda_jovenes: "Artículo 11 quater",
  extremadura_donaciones_entidades_culturales_deportistas:
    "Artículo 11 quinquies",
  extremadura_traslado_residencia_habitual: "Artículo 11 sexies",
  extremadura_ayudas_subvenciones_ela: "Artículo 11 septies",
  extremadura_enfermos_ela_familiares: "Artículo 11 octies",
}
function registro(codigo: string) {
  const r = lote.deducciones.find((r) => r.codigo === codigo)
  if (r === undefined) throw new Error(codigo)
  return r
}
describe("rectificación de evidencia del lote D", () => {
  for (const [codigo, articulo] of Object.entries(articulos)) {
    it(codigo, () => {
      const r = registro(codigo)
      expect(r.vigencia.articulo.startsWith(articulo)).toBe(true)
      expect(
        r.citas.some(
          (c) =>
            c.documentoId !== "D-manual" &&
            c.articulo !== undefined &&
            c.articulo.includes(articulo)
        )
      ).toBe(true)
    })
  }
  it("separa ayuda integrada de la deducción personal ELA", () => {
    const r = registro("extremadura_ayudas_subvenciones_ela")
    expect(
      r.comparaciones.some((c) =>
        c.reglaOficial.includes("tipos medios de gravamen")
      )
    ).toBe(true)
    expect(JSON.stringify(r.comparaciones)).not.toContain("2.000 euros")
  })
  it("familiares con discapacidad no heredan condiciones de cuidado infantil", () => {
    expect(
      JSON.stringify(
        registro("extremadura_cuidado_familiares_discapacidad").comparaciones
      )
    ).not.toContain("hijos menores de hasta 14")
  })
  it("conserva origen y preservación de la DT quinta de vivienda", () => {
    const r = registro("cyl_vivienda_nueva_construccion")
    expect(
      r.citas.some(
        (c) =>
          c.documentoId === "R-D-cyl2012" && c.textoLiteral.includes("9.040")
      )
    ).toBe(true)
    expect(
      r.citas.some((c) => c.textoLiteral.includes("Mantendrá su vigencia"))
    ).toBe(true)
  })
  for (const r of lote.deducciones) {
    it(`${r.codigo}: describe condiciones propias`, () => {
      const f = catalogo.valor.find((f) => f.codigo === r.codigo)
      expect(f).toBeDefined()
      expect(f?.requisitos.join(" ")).not.toContain(
        "Cumplir los requisitos indicados en la ficha normativa normalizada"
      )
      expect(f?.requisitos.join(" ").length).toBeGreaterThan(80)
    })
  }
})

describe("fronteras y cadenas recuperadas", () => {
  it("CLM conserva el tramo rural de 2019 y separa su corrección ajena al IRPF", () => {
    const r = registro("clm_arrendamiento_menores_36")
    expect(
      r.citas.some(
        (c) =>
          c.documentoId === "D-clm2019-original" &&
          c.textoLiteral.includes("612 euros")
      )
    ).toBe(true)
    expect(
      r.citas.some(
        (c) =>
          c.documentoId === "D-clm2019-correccion" &&
          c.textoLiteral.includes("Disposición adicional cuarta")
      )
    ).toBe(true)
  })
  it("recupera la convalidación del DL 11/2020", () => {
    const r = registro("extremadura_cuidado_hijos_hasta_14")
    expect(
      r.citas.some(
        (c) =>
          c.documentoId === "D-ext2020-convalidacion" &&
          c.textoLiteral.replace(/\s+/g, " ").includes("resultado convalidado")
      )
    ).toBe(true)
  })
  it("no mezcla las tablas educativas individual y conjunta", () => {
    const f = catalogo.valor.find(
      (f) => f.codigo === "clm_libros_idiomas_otros_gastos_educacion"
    )
    const reglas = f?.limites.join(" ") ?? ""
    expect(reglas).toContain("Hasta 6.500 euros 100 euros")
    expect(reglas).toContain("Entre 6.500,01 y 10.000,00 euros 75 euros")
    expect(reglas).toContain("Hasta 12.000 euros 200 euros")
    expect(reglas).toContain("Hasta 40.000 euros 300 euros")
    expect(f?.requisitos.join(" ")).toContain(
      "no se aplican individualmente a cada uno de los hijos"
    )
  })
  for (const codigo of [
    "clm_intereses_primera_vivienda_menores_40",
    "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales",
  ]) {
    it(`${codigo}: explicita la contradicción temporal`, () => {
      const f = catalogo.valor.find((f) => f.codigo === codigo)
      expect(f?.incompatibilidades.join(" ")).toContain("DF6")
      expect(f?.incompatibilidades.join(" ")).toContain(
        "aviso oficial de campaña"
      )
    })
  }
  it("conserva el prorrateo anterior sin atribuirlo al contribuyente actual", () => {
    const r = registro("clm_mayores_75")
    expect(r.comparaciones.find((c) =>
      c.campoCodigo === "prorrateo" && c.momento === "antes"
    )?.valorCodigo).toEqual(expect.stringContaining("cuidado de ascendiente"))
    expect(r.comparaciones.find((c) =>
      c.campoCodigo === "prorrateo" && c.momento === "despues"
    )?.valorCodigo).toEqual([])
    expect(catalogo.valor.find((f) => f.codigo === r.codigo)?.prorrateo).toEqual([])
  })
  it("cada comparación descriptiva actual corresponde al valor exportado", () => {
    for (const r of lote.deducciones) {
      const f = catalogo.valor.find((f) => f.codigo === r.codigo)
      for (const c of r.comparaciones) {
        if (c.momento === "antes") continue
        if (c.campoCodigo === "requisitos")
          expect(f?.requisitos).toContain(c.valorCodigo)
        if (c.campoCodigo === "limites")
          expect(f?.limites).toContain(c.valorCodigo)
        if (c.campoCodigo === "prorrateo") {
          // La comparación describe un elemento o la lista completa, incluida la vacía.
          expect([f?.prorrateo, ...(f?.prorrateo ?? [])]).toContainEqual(c.valorCodigo)
        }
        if (c.campoCodigo === "incompatibilidades")
          expect(f?.incompatibilidades).toContain(c.valorCodigo)
      }
    }
  })
})
