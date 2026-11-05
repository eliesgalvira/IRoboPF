import { expect, it } from "vitest"
import { evaluarAmpliacionF2025 as evaluar, type SolicitudF } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025"

function solicitud(codigo: string, hechos: SolicitudF["hechos"]) {
  return {
    tipo: "territorial_f_ampliacion_2025",
    codigo,
    contexto: { ejercicio: 2025, territorio: codigo.startsWith("madrid") ? "madrid" : "murcia", contribuyente: "a", modalidad: "individual" },
    hechos: { bases: [{ id: "a", generalEUR: "20000", ahorroEUR: "0" }], miembrosUnidad: ["a"], elecciones: [], ...hechos },
  }
}
const acogido = (id: string, nacimiento: string) => ({
  id, nacimiento, relacion: "acogido", orden: 1,
  convivencia: [{ desde: "2025-01-01", hasta: "2025-12-31" }],
  acogimientoTipo: "permanente", acogimientoCertificado: "consejeria", titularesDeduccion: ["a"],
})
// Calendario civil 2025: 1 enero–2 julio =183 días; hasta3 julio =184.
// El cumpleaños18 pone fin al régimen; la convivencia posterior no se cuenta.
for (const [nacimiento, esperado] of [
  ["2007-01-01", "0"], ["2007-07-03", "0"], ["2007-07-04", "618.6"],
  ["2007-12-31", "618.6"], ["2008-01-01", "618.6"],
]) {
  it(`N1 convivencia como menor: nacimiento ${nacimiento}`, () => {
    expect(evaluar(solicitud("madrid_acogimiento_familiar_menores", {
      personas: [acogido("h", nacimiento!)],
    }))).toMatchObject({ estado: "calculo_parcial", importeAntesPresentacionEUR: esperado })
  })
}
it("N1 no suma convivencia adulta posterior a un intervalo de cien días como menor", () => {
  expect(evaluar(solicitud("madrid_acogimiento_familiar_menores", {
    personas: [{ ...acogido("h", "2007-07-04"), convivencia: [
      { desde: "2025-01-01", hasta: "2025-04-10" },
      { desde: "2025-07-04", hasta: "2025-12-31" },
    ] }],
  }))).toMatchObject({ importeAntesPresentacionEUR: "0" })
})
it("N1 el adulto excluido no desplaza el orden del menor válido", () => {
  expect(evaluar(solicitud("madrid_acogimiento_familiar_menores", {
    personas: [acogido("adulto", "1990-01-01"), acogido("menor", "2015-01-01")],
  }))).toMatchObject({ importeAntesPresentacionEUR: "618.6" })
})

function vivienda(adquisicion: string) {
  return { id: "v", territorio: "madrid", adquisicion, precioEUR: "100000", gastosEUR: "0", tributosEUR: "0",
    porcentajePropiedad: "100", titulares: ["a"], ocupacionDesde: adquisicion, permanenciaHasta: "2025-12-31",
    municipio: "municipio", poblacion: 1000, fechaPoblacion: "2024-01-01", referenciaPoblacion: "ine" }
}
const hijo = { id: "h", relacion: "hijo", nacimiento: "2022-01-01", rentasNoExentasEUR: "0", declaracionTipo: "no_presentada",
  discapacidadPorcentaje: "0", situacionDevengo: "vivo", certificadoParentesco: "registro", alimentos64175: "no",
  titularesMinimo: ["a"], titularesDeduccion: ["a"], gradoMasCercanoConPrioridad: [], progenitores: ["a"],
  convivencia: [{ desde: "2025-01-01", hasta: "2025-12-31" }] }
for (const [codigo, adquisicion, admisible] of [
  ["madrid_vivienda_municipios_despoblacion", "2023-12-31", false],
  ["madrid_vivienda_municipios_despoblacion", "2024-01-01", true],
  ["madrid_vivienda_nacimiento_adopcion_hijos", "2022-12-31", false],
  ["madrid_vivienda_nacimiento_adopcion_hijos", "2023-01-01", true],
] as const) {
  it(`N3 frontera de entrada ${codigo} ${adquisicion}`, () => {
    const r = evaluar(solicitud(codigo, { nacimientoContribuyente: "2000-01-01", viviendas: [vivienda(adquisicion)], personas: [hijo] }))
    if (admisible) expect(r).toMatchObject({ importeAntesPresentacionEUR: "1000" })
    else {
      expect(r.estado).toBe("excluida")
      expect(r.importeAntesPresentacionEUR).toBeUndefined()
    }
  })
}
for (const [nacimiento, admisible] of [["1990-12-31", true], ["1989-12-31", false]] as const) {
  it(`N4 edad al cierre del ejercicio de adquisición para ${nacimiento}`, () => {
    const r = evaluar(solicitud("madrid_vivienda_municipios_despoblacion", {
      nacimientoContribuyente: nacimiento, viviendas: [vivienda("2024-01-01")],
    }))
    if (admisible) expect(r).toMatchObject({ importeAntesPresentacionEUR: "1000" })
    else {
      expect(r.estado).toBe("excluida")
      expect(r.importeAntesPresentacionEUR).toBeUndefined()
    }
  })
}
for (const territorio of ["madrid", "murcia"]) {
  it(`N2 constitución posterior al pago dentro de2025 en ${territorio}`, () => {
    const r = evaluar(solicitud(territorio + "_inversion_entidades_nuevas_reciente_creacion", {
      entidades: [{ id: "e", forma: "sl", domicilioSocial: territorio, domicilioFiscal: territorio,
        actividad: "economica_no_patrimonial", creacion: "2025-12-01", empleadosJornadaCompleta: 1,
        universidadInvestigacion: "no", funcionesEjecutivas: "no", relacionLaboral: "no", comunicacionPrevia: "comunicacion" }],
      inversiones: [{ id: "i", entidadId: "e", fecha: "2025-06-01", tipo: "constitucion", importeEUR: "1000",
        gastosEUR: "0", tributosEUR: "0", porcentajeCapitalPropio: "10", porcentajeVotosPropio: "10",
        porcentajeCapitalFamiliar: "40", porcentajeVotosFamiliar: "40", patrimonioHastaDevengo: "sin_transmision",
        escritura: "escritura", comunicacionPrevia: "comunicacion" }],
    }))
    expect(r.estado).toBe("excluida")
    expect(r.importeAntesPresentacionEUR).toBeUndefined()
  })
}
