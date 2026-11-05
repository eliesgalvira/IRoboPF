import type { SolicitudF } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025";
import { expect, it } from "vitest";
import Decimal from "decimal.js";
import { evaluarAmpliacionF2025 as evaluar } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025";
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual";
import type { MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial";
import { consumirCuotaAnualF2025 as consumir } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-cuota";
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional";

function solicitud(codigo: string, hechos: SolicitudF["hechos"]) {
  return {
    tipo: "territorial_f_ampliacion_2025",
    codigo,
    contexto: {
      ejercicio: 2025,
      territorio: codigo.startsWith("madrid") ? "madrid" : "murcia",
      contribuyente: "a",
      modalidad: "individual",
    },
    hechos: {
      bases: [{ id: "a", generalEUR: "20000", ahorroEUR: "0" }],
      miembrosUnidad: ["a"],
      elecciones: [],
      ...hechos,
    },
  };
}
const acogido = (nacimiento: string) => ({
  id: "adulto",
  relacion: "acogido",
  nacimiento,
  orden: 1,
  convivencia: [{ desde: "2025-01-01", hasta: "2025-12-31" }],
  acogimientoTipo: "permanente",
  acogimientoCertificado: "consejeria",
  titularesDeduccion: ["a"],
});
const magnitudes = (edad = 40, territorio: "madrid" | "murcia" = "madrid"): MagnitudesTerritorialesAnuales => ({
  caso: {
    anio: 2025,
    comunidadAutonoma: territorio,
    contribuyenteId: "a",
    situacionFamiliar: {
      tipo: "individual",
      edad,
      discapacidad: { _tag: "SinDiscapacidad" },
      descendientes: [],
      ascendientes: [],
    },
  },
  baseGeneral: new Decimal(20000),
  baseAhorro: new Decimal(0),
  minimoPersonalFamiliar: new Decimal(5550),
  cuotaAutonomica: new Decimal(1000),
  sujetosConMinimo: [],
  basesLiquidables: { general: new Decimal(20000), ahorro: new Decimal(0) },
});
const entidad = (territorio = "madrid", creacion = "2025-06-01") => ({
  id: "e",
  forma: "sl",
  domicilioSocial: territorio,
  domicilioFiscal: territorio,
  actividad: "economica_no_patrimonial",
  creacion,
  empleadosJornadaCompleta: 1,
  universidadInvestigacion: "no",
  funcionesEjecutivas: "no",
  relacionLaboral: "no",
  comunicacionPrevia: "comunicacion",
});
const inversion = (tipo = "constitucion") => ({
  id: "i",
  entidadId: "e",
  fecha: "2025-06-01",
  tipo,
  importeEUR: "1000",
  gastosEUR: "0",
  tributosEUR: "0",
  porcentajeCapitalPropio: "10",
  porcentajeVotosPropio: "10",
  porcentajeCapitalFamiliar: "40",
  porcentajeVotosFamiliar: "40",
  patrimonioHastaDevengo: "sin_transmision",
  escritura: "escritura",
  comunicacionPrevia: "comunicacion",
});
const vivienda = (adquisicion: string) => ({
  id: "v",
  territorio: "madrid",
  adquisicion,
  precioEUR: "100000",
  gastosEUR: "0",
  tributosEUR: "0",
  porcentajePropiedad: "100",
  titulares: ["a"],
  ocupacionDesde: adquisicion,
  permanenciaHasta: "2025-12-31",
  municipio: "municipio",
  poblacion: 1000,
  fechaPoblacion: "2024-01-01",
  referenciaPoblacion: "ine",
});

for (const [nacimiento, importe] of [["1990-01-01", "0"], ["2007-07-03", "0"], ["2007-07-04", "618.6"]] as const) {
  it(`propio N1 adaptador y consumidor ${nacimiento}`, () => {
    const codigo = "madrid_acogimiento_familiar_menores"
    const r = evaluarAnualF2025({ lote: "F-ampliado", codigo, hechos: { personas: [acogido(nacimiento)] } }, magnitudes())
    expect(r).toMatchObject({ estado: "calculo_parcial", importeAntesPresentacionEUR: importe })
    const libro = consumir(racional("1000"), [codigo], [r])
    expect(libro.total).toEqual(racional(importe))
    expect(libro.completoEnRamasSolicitadas).toBe(true)
  })
}
for (const nacimiento of ["1990-01-01", "2007-07-04", "2015-01-01"]) {
  for (const convivencia of [
    [{ desde: "2025-02-30", hasta: "2025-12-31" }],
    [{ desde: "2025-01-01", hasta: "2025-07-03" }, { desde: "2025-07-03", hasta: "2025-12-31" }],
  ]) {
    it(`propio N1 valida intervalos aun excluyendo edad ${nacimiento} ${convivencia[0]!.desde}`, () => {
      const r = evaluar(solicitud("madrid_acogimiento_familiar_menores", { personas: [{ ...acogido(nacimiento), convivencia }] }))
      expect(r.estado).toBe("no_soportado")
      expect(r.importeAntesPresentacionEUR).toBeUndefined()
    })
  }
}
for (const territorio of ["madrid", "murcia"]) {
  for (const [creacion, admisible] of [["2022-06-01", true], ["2022-05-31", false], ["2025-06-02", false]] as const) {
    it(`propio N2 ampliacion frontera tres años ${territorio} ${creacion}`, () => {
      const r = evaluar(solicitud(territorio + "_inversion_entidades_nuevas_reciente_creacion", {
        entidades: [{ ...entidad(territorio, creacion), plantillaAntes: "1", plantillaPosterior: "3", certificadoPlantilla: "plantilla", plantillaMantenida: "compromiso_24_meses_adicionales" }], inversiones: [inversion("ampliacion")],
      }))
      expect(r.estado).toBe(admisible ? "calculo_parcial" : "excluida")
      if (admisible) expect(r.importeAntesPresentacionEUR).toBe(territorio === "madrid" ? "400" : "200")
      else expect(r.importeAntesPresentacionEUR).toBeUndefined()
    })
  }
}
for (const [nacimiento, estado, importe] of [["1990-12-31", "calculo_parcial", "1000"], ["1989-12-31", "excluida", undefined]] as const) {
  it(`propio N4 anual y consumo edad ejercicio adquisicion ${nacimiento}`, () => {
    const m = magnitudes(2025 - Number(nacimiento.slice(0,4)))
    const codigo = "madrid_vivienda_municipios_despoblacion"
    const r = evaluarAnualF2025({ lote: "F-ampliado", codigo, hechos: { miembrosUnidad: ["a"], nacimientoContribuyente: nacimiento, viviendas: [vivienda("2024-01-01")] } }, m)
    expect(r.estado).toBe(estado); expect(r.importeAntesPresentacionEUR).toBe(importe)
    const libro = consumir(racional("2000"), [codigo], [r])
    expect(libro.total).toEqual(racional(importe ?? "0"))
    expect(libro.aplicaciones[0]!.estado).toBe(importe === undefined ? "excluida" : "aplicada")
  })
}
for (const [precioEUR, importe] of [["100000", "1000"], ["200000", "1546.5"]] as const) {
  it(`propio N3 anualidad y tope ${precioEUR}`, () => {
    expect(evaluar(solicitud("madrid_vivienda_municipios_despoblacion", { nacimientoContribuyente: "2000-01-01", viviendas: [{ ...vivienda("2024-01-01"), precioEUR }] }))).toMatchObject({ importeAntesPresentacionEUR: importe })
  })
}
it("propio N4 traslado conserva corte2025 y no hereda corte compra2024", () => {
  const r = evaluar(solicitud("madrid_cambio_residencia_municipio_despoblacion", { nacimientoContribuyente: "1990-01-01", fechaTraslado: "2024-06-01", modalidadAccesoActividad: "compra_onerosa", viviendas: [vivienda("2024-06-01")] }))
  expect(r.estado).toBe("excluida"); expect(r.importeAntesPresentacionEUR).toBeUndefined()
})

for (const territorio of ["madrid", "murcia"]) {
  for (const [creacion, esperado] of [["2025-06-01", "positivo"], ["2025-06-02", "excluida"]] as const) {
    it(`propio N2 adaptador consumo ${territorio} ${creacion}`, () => {
      const m = magnitudes(40, territorio === "madrid" ? "madrid" : "murcia")
      const codigo = territorio === "madrid" ? "madrid_inversion_entidades_nuevas_reciente_creacion" : "murcia_inversion_entidades_nuevas_reciente_creacion"
      const r = evaluarAnualF2025({ lote: "F-ampliado", codigo, hechos: { entidades: [entidad(territorio, creacion)], inversiones: [inversion()] } }, m)
      const importe = territorio === "madrid" ? "400" : "200"
      expect(r.estado).toBe(esperado === "positivo" ? "calculo_parcial" : "excluida")
      expect(consumir(racional("1000"), [codigo], [r]).total).toEqual(racional(esperado === "positivo" ? importe : "0"))
    })
  }
}
it("propio N3 consumidor anual excluye compra2023 despoblacion", () => {
  const m = magnitudes(25)
  const codigo = "madrid_vivienda_municipios_despoblacion"
  const r = evaluarAnualF2025({ lote: "F-ampliado", codigo, hechos: { miembrosUnidad: ["a"], nacimientoContribuyente: "2000-01-01", viviendas: [vivienda("2023-12-31")] } }, m)
  expect(r.estado).toBe("excluida")
  expect(consumir(racional("1000"), [codigo], [r]).total).toEqual(racional("0"))
})
