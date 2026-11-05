import { describe, expect, it } from "vitest"
import {
  rehabilitacionAlquilerExt,
  viviendaRuralExt,
} from "../lib/dominio/irpf/deducciones/extremadura-hechos-2025"

const contexto = {
  ejercicio: 2025,
  territorio: "extremadura",
  contribuyente: "a",
  declarantes: ["a"],
  modalidad: "individual",
  baseGeneral: "10000",
  baseAhorro: "0",
  minimoPersonalFamiliar: "0",
}
const historial = (valor: string) => ({
  ejercicio: 2025,
  declarantes: ["a"],
  concepto: "base_historica_vivienda:v",
  valor,
})
const pagos = [{ id: "p", fecha: "2025-06-01", pagador: "a", importe: "9040" }]
const rehabilitacion = {
  pagos,
  costeRehabilitacion: "400000",
  baseHistorica: historial("90000"),
  porcentajePropiedad: "50",
  ayudaReconocida: "0",
  diasRequisitos: 365,
  parentesco: 0,
  actividadEconomica: "no",
  ubicacion: "municipio_menor3000",
  vivienda: "v",
  exhaustividad: "completa",
}
const vivienda = {
  fechaOperacion: "2025-01-01",
  poblacion: 2000,
  porcentajePropiedad: "50",
  coste: "400000",
  ayudasJunta: "0",
  baseHistorica: historial("89000"),
  pagos,
  eleccion: "rural",
  vivienda: "v",
  exhaustividad: "completa",
}

describe("D51: topes personales y ayudas sin imputación anual", () => {
  it.each([
    ["400000", "50", "179000", "150"],
    ["100000", "50", "49000", "150"],
    ["400000", "25", "90000", "1356"],
    ["400000", "100", "179999.99", "0.0015"],
  ])(
    "rehabilitación coste %s, titularidad %s e histórico %s",
    (coste, parte, usado, esperado) => {
      expect(
        rehabilitacionAlquilerExt(contexto, {
          ...rehabilitacion,
          costeRehabilitacion: coste,
          porcentajePropiedad: parte,
          baseHistorica: historial(usado),
        })
      ).toMatchObject({ estado: "calculo_parcial", importeExacto: esperado })
    }
  )
  it("conserva el máximo por vivienda del artículo 11 bis", () => {
    expect(viviendaRuralExt(contexto, vivienda)).toMatchObject({
      estado: "calculo_parcial",
      importeExacto: "100",
    })
  })
  it.each(["0.01", "1000"])(
    "ayuda %s de rehabilitación requiere imputación",
    (ayuda) => {
      const resultado = rehabilitacionAlquilerExt(contexto, {
        ...rehabilitacion,
        ayudaReconocida: ayuda,
      })
      expect(resultado).toMatchObject({
        estado: "no_soportado",
        motivo: expect.stringContaining("imputación"),
      })
      expect(resultado).not.toHaveProperty("importeExacto")
    }
  )
  it.each(["0.01", "1000"])(
    "ayuda %s de vivienda requiere atribución anual",
    (ayuda) => {
      const resultado = viviendaRuralExt(contexto, {
        ...vivienda,
        ayudasJunta: ayuda,
      })
      expect(resultado).toMatchObject({
        estado: "no_soportado",
        motivo: expect.stringContaining("imputación anual"),
      })
      expect(resultado).not.toHaveProperty("importeExacto")
    }
  )
})
