import { describe, expect, it } from "vitest"
import {
  rehabilitacionAlquilerExt,
  viviendaRuralExt,
} from "../lib/dominio/irpf/deducciones/extremadura-hechos-2025"

// Preparados por revisión independiente; NO ejecutados ni comprobados con tsc.
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
const pago = (importe: string) => [
  { id: "p", fecha: "2025-06-01", pagador: "a", importe },
]
const rehabilitacion = {
  pagos: pago("9040"),
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

describe("D51 revisión independiente: importes adversos", () => {
  it("H1: prorratea coste antes del máximo personal de180000", () => {
    expect(rehabilitacionAlquilerExt(contexto, rehabilitacion)).toMatchObject({
      estado: "calculo_parcial",
      importeExacto: "1356",
    })
  })
  it("H2: una ayuda no excluye toda la rehabilitación; evitar cero fiscal", () => {
    // Obra y ayuda íntegramente2025: neto9000, deducción1350.
    // Si el contrato no representa esa cronología, debe rechazar el cálculo.
    const resultado = rehabilitacionAlquilerExt(contexto, {
      ...rehabilitacion,
      costeRehabilitacion: "10000",
      porcentajePropiedad: "100",
      baseHistorica: historial("0"),
      pagos: pago("10000"),
      ayudaReconocida: "1000",
    })
    if (resultado.estado !== "no_soportado")
      expect(resultado).toMatchObject({
        estado: "calculo_parcial",
        importeExacto: "1350",
      })
  })
  it("H3: ayuda anual descuenta pago5000 a4000, no solo techo histórico", () => {
    // Única ayuda1000 cobrada2025; no ayuda de otro año, ni otro titular.
    // Rechazar hasta representar imputación anual también es una salida segura.
    const resultado = viviendaRuralExt(contexto, {
      fechaOperacion: "2025-01-01",
      poblacion: 2000,
      porcentajePropiedad: "100",
      coste: "100000",
      ayudasJunta: "1000",
      baseHistorica: historial("0"),
      pagos: pago("5000"),
      eleccion: "rural",
      vivienda: "v",
      exhaustividad: "completa",
    })
    if (resultado.estado !== "no_soportado")
      expect(resultado).toMatchObject({
        estado: "calculo_parcial",
        importeExacto: "400",
      })
  })
})
