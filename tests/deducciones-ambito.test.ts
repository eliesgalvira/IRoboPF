import { expect, it } from "vitest"
import {
  calcularDeduccionesAutonomicasAplicadas,
  calcularDeduccionesConsignadas,
} from "../lib/dominio/irpf/deducciones-autonomicas-aplicadas"

it("DED-I-02 solo traslada consignaciones explícitas al anual", () => {
  const entradas = {
    andaluciaHijosNacimientoAdopcion: 2,
    "galicia_familias_dos_hijos:importe": 250,
    "galicia_familias_dos_hijos:cumple": true,
  }
  expect(
    calcularDeduccionesConsignadas(entradas, {
      ejercicio: 2025,
      territorio: "andalucia",
    })
  ).toBe(0)
  expect(
    calcularDeduccionesConsignadas(entradas, {
      ejercicio: 2025,
      territorio: "galicia",
    })
  ).toBe(250)
  expect(
    calcularDeduccionesConsignadas(
      { catalunyaAportacionesCooperativas: 1000 },
      { ejercicio: 2025, territorio: "catalunya" }
    )
  ).toBe(0)
})

it.each([0.5, -1, "1"])("DED-I-03 contador específico inválido %s", (valor) => {
  expect(() =>
    calcularDeduccionesAutonomicasAplicadas(
      { andaluciaHijosNacimientoAdopcion: valor },
      { ejercicio: 2025, territorio: "andalucia" }
    )
  ).toThrow()
})

it("aísla A → B → A antes de sumar", () => {
  const entradas = { andaluciaHijosNacimientoAdopcion: 1 }
  expect(
    calcularDeduccionesAutonomicasAplicadas(entradas, {
      ejercicio: 2025,
      territorio: "andalucia",
    })
  ).toBe(200)
  expect(
    calcularDeduccionesAutonomicasAplicadas(entradas, {
      ejercicio: 2025,
      territorio: "madrid",
    })
  ).toBe(0)
  expect(
    calcularDeduccionesAutonomicasAplicadas(entradas, {
      ejercicio: 2025,
      territorio: "andalucia",
    })
  ).toBe(200)
})
it.each([2024, 2026])("no hereda catálogo en %s", (ejercicio) => {
  expect(() =>
    calcularDeduccionesAutonomicasAplicadas(
      { madridHijosNacimientoAdopcion: 1 },
      { ejercicio, territorio: "madrid" }
    )
  ).toThrow()
})

it("Madrid → Murcia → Madrid tampoco contamina", () => {
  const entradas = { madridHijosNacimientoAdopcion: 1 }
  expect(
    calcularDeduccionesAutonomicasAplicadas(entradas, {
      ejercicio: 2025,
      territorio: "madrid",
    })
  ).toBe(721.7)
  expect(
    calcularDeduccionesAutonomicasAplicadas(entradas, {
      ejercicio: 2025,
      territorio: "murcia",
    })
  ).toBe(0)
  expect(
    calcularDeduccionesAutonomicasAplicadas(entradas, {
      ejercicio: 2025,
      territorio: "madrid",
    })
  ).toBe(721.7)
})
it.each([0.5, -1])(
  "no usa personas fraccionarias ni negativas: %s",
  (unidades) => {
    expect(() =>
      calcularDeduccionesAutonomicasAplicadas(
        { "rioja_enfermedad_celiaca:unidades": unidades },
        { ejercicio: 2025, territorio: "la-rioja" }
      )
    ).toThrow()
  }
)
