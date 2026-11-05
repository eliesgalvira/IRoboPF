import { describe, expect, it } from "vitest"
import {
  anualesC,
  eurosAnualesC,
  rentaC,
} from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/ampliacion-comun"
import { evaluarDonacionesAmpliacionC } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/donaciones-ampliacion"
import { anualC, solicitudDonacionC } from "./canarias-balears-ampliacion.fixtures"

describe("C36: transporte anual sin redondear a céntimos", () => {
  it("conserva el octogésimo decimal de una magnitud derivada", () => {
    const valor = eurosAnualesC("20000." + "0".repeat(79) + "1")
    expect(valor.n).toBe(20000n * 10n ** 80n + 1n)
    expect(valor.d).toBe(10n ** 80n)
  })

  it("suma bases anuales negativas sin perder la fracción", () => {
    const h = solicitudDonacionC("canarias_donaciones_finalidad_ecologica")
    h.baseGeneral = "-0." + "0".repeat(79) + "1"
    h.baseAhorro = "1"
    const r = rentaC(h)
    expect(r.n).toBe(10n ** 80n - 1n)
    expect(r.d).toBe(10n ** 80n)
  })

  it("concilia las bases derivadas de la misma anual sin redondearlas", () => {
    const h = solicitudDonacionC("canarias_donaciones_finalidad_ecologica")
    h.baseGeneral = "20000.123456789123456789"
    const m = anualC(h)
    m.baseLiquidableGeneral = h.baseGeneral
    m.personas[0].liquidableGeneral = h.baseGeneral
    expect(() => anualesC(h, m)).not.toThrow()
    m.personas[0].liquidableGeneral = "20000.123456789123456788"
    expect(() => anualesC(h, m)).toThrow("Atribución de base liquidable")
  })

  it("consume el diez por ciento exacto de la cuota anual fraccionaria", () => {
    const h = solicitudDonacionC("canarias_donaciones_finalidad_ecologica")
    const m = anualC(h)
    m.cuotaIntegraAutonomica = "700.12345"
    const r = evaluarDonacionesAmpliacionC(h, m)
    expect(r.estado).toBe("calculo_parcial")
    if (r.estado === "calculo_parcial") {
      expect(BigInt(r.importeExacto.numerador) * 200000n).toBe(
        14002469n * BigInt(r.importeExacto.denominador)
      )
      expect(r.presentacionEuros).toBe("70.01")
    }
  })

  it("mantiene el rechazo de pagos externos con fracción de céntimo", () => {
    const h = solicitudDonacionC("canarias_donaciones_finalidad_ecologica")
    h.donaciones[0].pagos[0].importe = "1000.001"
    expect(evaluarDonacionesAmpliacionC(h, anualC(h)).estado).toBe("no_soportado")
  })

  it.each(["NaN", "Infinity", "1e3", "0." + "0".repeat(80) + "1"])(
    "rechaza una representación anual fuera del contrato: %s",
    (valor) => expect(() => eurosAnualesC(valor)).toThrow("Magnitud anual inválida")
  )
})
