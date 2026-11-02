import Decimal from "decimal.js"
import { describe, expect, it } from "vitest"
import { calcularDesgloseCotizacionesPerfilUniforme } from "../lib/dominio/laboral/cotizaciones-perfil-uniforme"

describe("X-referencia-privada: reparto ya corregido, sin aceptar redondeo TGSS", () => {
  it("132500 euros: conserva los tres tipos legales de cada pagador", () => {
    const resultado = calcularDesgloseCotizacionesPerfilUniforme({
      anio: 2025,
      salarioBrutoAnual: new Decimal("132500"),
    })
    // Oracle aritmético independiente: 5891.4*.0077 + 23565.6*.0083 + 44129*.0098.
    expect(resultado.solidaridadEmpresarial.toString()).toBe("673.42246")
    expect(resultado.solidaridadTrabajador.toString()).toBe("132.74372")
    expect(resultado.redondeoTgss).toBe("pendiente")
  })
})
