import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { centimosAEuros, eurosACentimos } from "../lib/dominio/dinero/importe-monetario"
import { calcularDesgloseCotizacionesPerfilUniforme } from "../lib/dominio/laboral/cotizaciones-perfil-uniforme"
import { calcularRendimientoNetoTrabajo } from "../lib/dominio/irpf/rendimientos/rendimientos-trabajo"
import { calcularBaseImponibleGeneral } from "../lib/dominio/irpf/integracion/base-imponible-general"

for (const precision of [4, 6, 20, 80]) {
  it(`preparación monetaria conserva cifras con Decimal global ${precision}`, () => {
    const saved = { precision: Decimal.precision, rounding: Decimal.rounding }
    try {
      Decimal.set({ precision, rounding: Decimal.ROUND_DOWN })
      expect(centimosAEuros(6_000_001).toFixed()).toBe("60000.01")
      expect(eurosACentimos(centimosAEuros(6_000_001))).toBe(6_000_001)
      expect(eurosACentimos(new Decimal("12345.67"))).toBe(1_234_567)
      const salario = new Decimal("60000")
      const ss = calcularDesgloseCotizacionesPerfilUniforme({ anio: 2025, salarioBrutoAnual: salario })
      expect(ss.baseOrdinaria.toFixed()).toBe("58914")
      expect(ss.solidaridadTrabajador.toFixed()).toBe("1.629")
      expect(ss.cotizacionTrabajador.toFixed()).toBe("3819.2562")
      const trabajo = calcularRendimientoNetoTrabajo({ anio: 2025, rendimientoIntegro: salario, cotizacionTrabajador: ss.cotizacionTrabajador })
      expect(trabajo.rendimientoNeto.toFixed()).toBe("54180.7438")
      expect(calcularBaseImponibleGeneral({ rendimientoTrabajo: trabajo }).toFixed()).toBe("54180.7438")
      expect(Decimal.precision).toBe(precision)
      expect(Decimal.rounding).toBe(Decimal.ROUND_DOWN)
    } finally {
      Decimal.set(saved)
    }
  })
}
