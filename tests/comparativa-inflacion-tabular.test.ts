import { factorComparativaTabular } from "../lib/dominio/compatibilidad-legacy/comparativa-tabular"
import { factorIpcPerfilLegacy } from "../lib/dominio/inflacion/factor-ipc"
import { Predicate } from "effect"
import { describe, expect, it } from "vitest"
import excel from "../docs/procedencia/implementaciones/comparativa-inflacion/excel.json"
import python from "../docs/procedencia/implementaciones/comparativa-inflacion/python.json"
import {
  aniosFiscalesLegacy,
  construirTablaComparativaInflacionCompatible,
  construirTablaControlGeneralCompatible,
  construirTablaControlTramosIrpfCompatible,
} from "../lib/dominio/compatibilidad-legacy/progresividad-frio"
import {
  redondearNumpy,
  redondearPython,
  mensualizarCentimosPresentacionLegacy,
} from "../lib/dominio/compatibilidad-legacy/aritmetica-tabular"

// openpyxl escribe números con %.16g. Igualdad de esa serialización,
// no tolerancia monetaria ni redondeo a céntimos de la expectativa.
const xml = (v: number | string) =>
  Predicate.isNumber(v) ? Number(v.toPrecision(16)) : v
const filas = () =>
  Array.from(construirTablaComparativaInflacionCompatible().filas)
describe("COMPARATIVA_INFLACION independiente", () => {
  it("conserva producto binario, metadatos y diferencia de precisión", () => {
    for (const anio of aniosFiscalesLegacy) {
      const resultado = factorComparativaTabular(anio)
      expect(resultado.factor).toBe(python.factores[anio])
      expect(resultado.procedencia).toEqual(
        factorIpcPerfilLegacy(anio, 2026).procedencia
      )
    }
    expect(factorComparativaTabular(2012).factor).not.toBe(
      factorIpcPerfilLegacy(2012, 2026).factor.toNumber()
    )
  })

  it("compara las 16770 celdas contra Python original exactamente", () => {
    expect(filas()).toEqual(python.filas)
  })
  it("compara las 1290 filas y 13 columnas del XML", () => {
    const tabla = construirTablaComparativaInflacionCompatible()
    expect(tabla.cabeceras).toEqual(excel.hojas.COMPARATIVA_INFLACION[0])
    expect(excel.hojas.COMPARATIVA_INFLACION).toHaveLength(1291)
    expect(filas().map((r) => r.map(xml))).toEqual(
      excel.hojas.COMPARATIVA_INFLACION.slice(1)
    )
  })
  it("el Python original explica el XML con serialización discriminante", () => {
    expect(python.filas.map((r) => r.map(xml))).toEqual(
      excel.hojas.COMPARATIVA_INFLACION.slice(1)
    )
    expect(xml(9.36)).toBe(9.36)
    expect(xml(9.37)).not.toBe(xml(9.36))
  })
  it("fronteras y negativos contra cuerpos originales", () => {
    for (const esperada of python.fronteras) {
      const salario = Number(esperada[1])
      const actual = Array.from(
        construirTablaComparativaInflacionCompatible({
          salarioMinimoEuros: salario,
          salarioMaximoEuros: salario,
          pasoEuros: 1,
        }).filas
      ).find((r) => r[0] === esperada[0])
      expect(actual).toEqual(esperada)
    }
  })
  it("mantiene las 543 celdas CONTROL y sus cabeceras", () => {
    const tablas = [
      construirTablaControlGeneralCompatible(),
      construirTablaControlTramosIrpfCompatible(),
    ]
    const hojas = [excel.hojas.CONTROL_GENERAL, excel.hojas.CONTROL_TRAMOS_IRPF]
    tablas.forEach((t, i) => {
      expect(t.cabeceras).toEqual(hojas[i][0])
      expect(Array.from(t.filas).map((r) => r.map(xml))).toEqual(
        hojas[i].slice(1)
      )
      expect(Array.from(t.filas)).toEqual(python.controles[i])
    })
  })
  it("distingue empates negativos y doble redondeo", () => {
    expect(redondearNumpy(-0.005)).toBe(-0)
    expect(redondearPython(-0.005)).toBe(-0.01)
    expect(mensualizarCentimosPresentacionLegacy(-18)).toBe(-1)
    expect(mensualizarCentimosPresentacionLegacy(18)).toBe(2)
    expect(redondearNumpy(0.059 / 12)).toBe(0)
    expect(mensualizarCentimosPresentacionLegacy(6)).toBe(1)
  })
})
