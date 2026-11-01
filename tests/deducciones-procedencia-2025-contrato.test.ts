import { describe, expect, it } from "vitest"
import { crearCasTemporal } from "../scripts/procedencia/deducciones-2025/fixture-cas.mjs"
import censo from "../docs/procedencia/deducciones-2025/censo.json"
import {
  comprobarBytes,
  verificarPaquetes,
} from "../scripts/procedencia/deducciones-2025/verificar.mjs"
import { obtenerProcedenciaDeduccion2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/procedencia"
import { ANDALUCIA_NACIMIENTO_ADOPCION_ACOGIMIENTO_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/andalucia"
import { DEDUCCIONES_AUTONOMICAS_2025_POR_COMUNIDAD } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025"

// Datos hipotéticos de contrato: no constituyen investigación ni dictamen fiscal.
const paquetes = () =>
  Object.keys(censo.lotes).map((lote) => ({
    dictamenes: {
      version: 1,
      ejercicio: 2025,
      lote,
      baseCommit: "016ec72d9539ccd887202735960ce306bd2354e5",
      deducciones: censo.fichas
        .filter((f) => f.lote === lote)
        .map((f) => ({
          codigo: f.codigo,
          comunidad: f.comunidad,
          dictamenAntes: "no_verificable",
          dictamenDespues: "no_verificable",
          dictamenFicha: "no_verificable",
          dictamenCalculo: "no_verificable",
          alcance: "Fixture hipotético de contrato",
          motivo: "No hay originales en este fixture",
          estadoRevision: "candidato",
          vigencia: {},
          manual: {},
          citas: [],
          comparaciones: [],
          contraejemplos: [],
          cambios: [],
          pendientes: [
            {
              causa: "Original ausente del fixture",
              actuacionesRealizadas: ["Inspección del fixture"],
              evidenciaNecesaria: "Original fijado y cotejado",
            },
          ],
        })),
    },
    fuentes: { version: 1, documentos: [] },
  }))
const verificar = (p = paquetes(), modo = "completo") =>
  verificarPaquetes({ censo, paquetes: p, modo, cas: undefined })

describe("contrato documental 2025", () => {
  it("conserva las 351 identidades y devuelve pendiente para literales y catálogo", () => {
    const fichas = Object.values(
      DEDUCCIONES_AUTONOMICAS_2025_POR_COMUNIDAD
    ).flat()
    expect(fichas.map((f) => f.codigo).sort()).toEqual(
      censo.fichas.map((f) => f.codigo).sort()
    )
    expect(DEDUCCIONES_AUTONOMICAS_2025_POR_COMUNIDAD.andalucia).toContain(
      ANDALUCIA_NACIMIENTO_ADOPCION_ACOGIMIENTO_2025
    )
    for (const f of fichas)
      expect(obtenerProcedenciaDeduccion2025(f)).toEqual({
        version: 1,
        ejercicio: 2025,
        codigo: f.codigo,
        estado: "pendiente",
      })
  })
  it("conserva una referencia candidata sin convertir el estado fiscal en aceptación", () => {
    const procedencia = {
      version: 1,
      ejercicio: 2025,
      codigo: "ejemplo",
      estado: "candidato",
    } as const
    expect(
      obtenerProcedenciaDeduccion2025({ codigo: "ejemplo", procedencia })
    ).toBe(procedencia)
  })
  it("valida cobertura completa sin aceptar los dictámenes", () => {
    expect(verificar()).toMatchObject({
      recibidas: 351,
      pendientes: [],
      estadoRevision: "candidato",
      integridadBytes: "no_comprobada",
    })
  })
  it("permite lotes ausentes solo en parcial, nunca omisiones internas", () => {
    expect(verificar([], "parcial").pendientes).toHaveLength(351)
    expect(() => verificar([])).toThrow(/Cobertura incompleta/)
    const p = paquetes().slice(0, 1)
    p[0]!.dictamenes.deducciones.pop()
    expect(() => verificar(p, "parcial")).toThrow(/cobertura incompleta/)
  })
  it("rechaza duplicados, comunidad equivocada y base distinta", () => {
    const p = paquetes()
    p[0]!.dictamenes.deducciones.push(p[0]!.dictamenes.deducciones[0]!)
    expect(() => verificar(p)).toThrow(/duplicado/)
    const q = paquetes()
    q[0]!.dictamenes.deducciones[0]!.comunidad = "madrid"
    expect(() => verificar(q)).toThrow(/Código\/comunidad\/lote/)
    const r = paquetes()
    r[0]!.dictamenes.baseCommit = "464e0fd8"
    expect(() => verificar(r)).toThrow(/const/)
  })
  it("rechaza citas rotas y coincidencias sin evidencia", () => {
    const p = paquetes()
    Object.assign(p[0]!.dictamenes.deducciones[0]!.vigencia, {
      citas: ["inexistente"],
    })
    expect(() => verificar(p)).toThrow(/referencia rota/)
    const q = paquetes()
    q[0]!.dictamenes.deducciones[0]!.dictamenCalculo = "coincide"
    expect(() => verificar(q)).toThrow(/sin original/)
  })
  it("exige límites investigados y rechaza rutas privadas incluso en reservas", () => {
    const p = paquetes()
    p[0]!.dictamenes.deducciones[0]!.pendientes = []
    expect(() => verificar(p)).toThrow(/límite concreto/)
    const q = paquetes()
    Object.assign(q[0]!.dictamenes.deducciones[0]!.manual, {
      localPath: "oculto",
    })
    expect(() => verificar(q)).toThrow(/Campo privado/)
  })
  it("valida vínculos reales del contrato y rechaza documentos, localizadores y manual cruzados", () => {
    const p = paquetes()
    const d = p[0]!.dictamenes.deducciones[0]!
    const documento = (id: string, tipo: string, digito: string) => ({
      id,
      tipo,
      sha256: digito.repeat(64),
      sha512: digito.repeat(128),
      bytes: 100,
      mimeType: "application/pdf",
      urlOficial: "https://www.boe.es/diario_boe/",
      fechaRecuperacion: "2026-11-01",
      fechaPublicacion: "2025-01-01",
      boletin: "Fixture",
      identificador: id,
    })
    Object.assign(p[0]!.fuentes, {
      documentos: [
        documento("norma", "original", "a"),
        documento("manual", "manual", "b"),
      ],
    })
    const cita = (id: string, documentoId: string) => ({
      id,
      documentoId,
      articulo: "1",
      apartado: "",
      textoLiteral: "Cita hipotética del fixture",
      localizador: { tipo: "pdf", paginaFisica: 1, bbox: [0, 0, 100, 100] },
    })
    const normativa = cita("ley-1", "norma"),
      manual = cita("manual-1", "manual")
    Object.assign(d, {
      dictamenAntes: "coincide",
      dictamenDespues: "coincide",
      dictamenFicha: "coincide",
      dictamenCalculo: "coincide",
      citas: [normativa, manual],
      vigencia: { citas: ["ley-1"] },
      manual: {
        documentoId: "manual",
        paginasFicha: censo.fichas[0]!.fuenteManual.paginas,
        paginasComprobadas: [1],
        citas: ["manual-1"],
      },
      comparaciones: [
        {
          campoCodigo: "cuantia",
          valorCodigo: "100",
          reglaOficial: "100",
          citas: ["ley-1"],
          resultado: "coincide",
          motivo: "Hipótesis",
        },
      ],
    })
    expect(verificar(p).recibidas).toBe(351)
    normativa.documentoId = "ausente"
    expect(() => verificar(p)).toThrow(/Documento no declarado/)
    normativa.documentoId = "norma"
    normativa.localizador.bbox = [10, 0, 5, 100]
    expect(() => verificar(p)).toThrow(/bbox vacía/)
    normativa.localizador.bbox = [0, 0, 100, 100]
    manual.documentoId = "norma"
    expect(() => verificar(p)).toThrow(/manual apunta a otro/)
  })
  it("rechaza diferencias sin discriminante y transiciones sin prueba", () => {
    const p = paquetes()
    p[0]!.dictamenes.deducciones[0]!.dictamenFicha = "diferencia"
    expect(() => verificar(p)).toThrow(/sin discriminante/)
    const q = paquetes()
    q[0]!.dictamenes.deducciones[0]!.dictamenAntes = "coincide"
    expect(() => verificar(q)).toThrow(/transición sin prueba/)
  })
  it("verifica ambos CAS externos y detecta alteración de bytes", () => {
    const { root, documento: doc, corromper } = crearCasTemporal()
    expect(() => comprobarBytes(doc, { root, formato: "plano" })).not.toThrow()
    expect(() => comprobarBytes(doc, { root, formato: "sha256" })).not.toThrow()
    corromper()
    expect(() => comprobarBytes(doc, { root, formato: "plano" })).toThrow(
      /Hash sha256/
    )
  })
})
