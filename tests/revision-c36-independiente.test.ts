import { describe, expect, it } from "vitest"
import { evaluarFamiliaEstudiosAmpliacionC } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/familia-estudios-ampliacion"
import { evaluarViviendaAmpliacionC } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/vivienda-ampliacion"
import {
  anualC,
  historicoViviendaC,
  solicitudFamiliaC,
  solicitudViviendaC,
} from "./canarias-balears-ampliacion.fixtures"

// Preparadas por revisión estática; la ejecución del integrador se registra aparte.
// Se permite rechazar una rama sin derecho o calcular cero; nunca publicarla
// como deducción positiva. No se presupone cómo debe implementar el fix.
describe("Revisión C36 independiente: parentesco y base máxima", () => {
  it("libros baleares: el mínimo de un descendiente no sustituye la relación de hijo", () => {
    const h = solicitudFamiliaC("balears_libros_texto")
    h.personas[0].progenitores = ["Q"]
    expect(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)).estado).toBe(
      "no_soportado"
    )
  })
  it.each([
    "balears_estudios_superiores_fuera_isla",
    "balears_libros_texto",
  ] as const)(
    "%s no atribuye deducción de descendiente a ascendiente",
    (codigo) => {
      const h = solicitudFamiliaC(codigo)
      const u = h.personas[0]
      u.nacimiento = "1950-01-01"
      u.discapacidad = 0
      u.minimo.relacion = "ascendiente"
      u.progenitores = []
      if (codigo === "balears_libros_texto") u.estudio.nivel = "fp"
      else {
        u.estudio.islaResidencia = "Mallorca"
        u.estudio.islaCentro = "Menorca"
      }
      const m = anualC(h)
      m.minimos = [{ beneficiario: "H", tipo: "ascendiente", titulares: ["P"] }]
      const r = evaluarFamiliaEstudiosAmpliacionC(h, m)
      if (r.estado === "calculo_parcial") {
        expect(BigInt(r.importeExacto.numerador)).toBe(0n)
      } else expect(r.estado).toBe("no_soportado")
    }
  )

  it("art14ter: cotitular sin discapacidad no reduce el máximo de discapacidad propia", () => {
    const h = solicitudViviendaC("canarias_adecuacion_vivienda_discapacidad")
    const v = h.viviendas[0]
    v.nacimientoContribuyente = "1990-01-01"
    v.discapacidad.nacimiento = "1990-01-01"
    v.porcentaje = "50"
    v.titulares = ["P", "Q"]
    v.gastos[0].importe = "15000"
    const m = anualC(h)
    m.cuotaIntegraAutonomica = "20000"
    const r = evaluarViviendaAmpliacionC(h, m, historicoViviendaC())
    expect(r.estado).toBe("calculo_parcial")
    if (r.estado === "calculo_parcial") {
      // min(15000,15000) × 14/100 = 2100, no 1050.
      expect(BigInt(r.importeExacto.numerador)).toBe(
        2100n * BigInt(r.importeExacto.denominador)
      )
    }
  })
  it("art14ter: el cónyuge conserva el máximo aunque la vivienda sea compartida", () => {
    const h = solicitudViviendaC("canarias_adecuacion_vivienda_discapacidad")
    const v = h.viviendas[0]
    v.porcentaje = "50"
    v.titulares = ["P", "Q"]
    v.discapacidad.persona = "Q"
    v.discapacidad.parentesco = "conyuge"
    v.discapacidad.nacimiento = "1990-01-01"
    v.gastos[0].importe = "15000"
    const m = anualC(h)
    m.cuotaIntegraAutonomica = "20000"
    const r = evaluarViviendaAmpliacionC(h, m, historicoViviendaC())
    expect(r.estado).toBe("calculo_parcial")
    if (r.estado === "calculo_parcial")
      expect(BigInt(r.importeExacto.numerador)).toBe(
        2100n * BigInt(r.importeExacto.denominador)
      )
  })
  it.each(["ascendiente", "descendiente"] as const)(
    "art14ter: %s requiere el censo de derechos, no sólo propiedad",
    (parentesco) => {
      const h = solicitudViviendaC("canarias_adecuacion_vivienda_discapacidad")
      const v = h.viviendas[0]
      v.discapacidad.persona = "H"
      v.discapacidad.parentesco = parentesco
      const r = evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC())
      expect(r.estado).toBe("no_soportado")
      if (r.estado === "no_soportado")
        expect(r.motivo).toContain("censo de contribuyentes con derecho")
    }
  )
})
