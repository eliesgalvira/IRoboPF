import Decimal from "decimal.js"
import fixture from "./clm-vivienda-aplicacion-2024.json"
import type { TrabajoActualCLM2025 } from "../../lib/dominio/irpf/patrimonio-historico-clm/actual"
const D = Decimal.clone({ precision: 80 })
export const trabajoActualFixture = (): TrabajoActualCLM2025 => ({ ejercicio: 2025, titular: "s-1", origen: "explicita",
  rendimientos: [{ id: "r", clase: "empleo-laboral", integro: "25000", cotizaciones: "0" }], retenciones: "0" })
/** Sólo construye variantes POSITIVAS antes del test: compra, saldo y obligación reales
 * del vector. No se invoca desde sobre(), producir(), ejecutar() ni los adversos.
 * Conserva salario40000/25000 y banco inicial20000. El consumo de cada año es
 * salario menos precio pagado, por lo que el incremento factual iguala la inversión.
 */
export function proyectarVariantePositiva(v: { readonly pago2024: string; readonly pago2025: string; readonly coste: string }) {
  const x = structuredClone(fixture), h = x.aplicacionViviendaCLM2024, p = h.patrimonioHistorico
  x.historiaBases.operaciones[0]!.importe = v.pago2024
  x.historiaBases.operaciones[1]!.importe = v.pago2025
  x.hechos.pagos[0]!.importe = v.pago2025
  x.hechos.coste = v.coste; h.compra.coste = v.coste; p.adquisicion.precio = v.coste
  p.adquisicion.precioAplazado.importeOriginal = v.pago2025
  p.cortes2024.deudaVendedor.cierre.importe = v.pago2025
  p.cortes2025.deudaVendedor.inicio.importe = v.pago2025
  for (const [e, pago, salario] of [[p.cortes2024, v.pago2024, "40000"], [p.cortes2025, v.pago2025, "25000"]] as const) {
    e.movimientos[1]!.importe = pago
    e.movimientos[2]!.importe = new D(salario).minus(pago).toFixed(2)
    e.cuentas[0]!.inicio.importe = "20000"; e.cuentas[0]!.cierre.importe = "20000"
    e.valorVivienda.importe = v.coste
  }
  return x
}

/** Construcción independiente para el umbral de cuota, previa a la prueba. */
export function proyectarSalarioHistorico(salario: string) {
  const x = proyectarVariantePositiva({ pago2024: "10000.01", pago2025: "4999.99", coste: "15000" })
  const h = x.aplicacionViviendaCLM2024, e = h.patrimonioHistorico.cortes2024
  h.trabajo.rendimientos[0]!.integro = salario; h.certificados[0]!.integro = salario
  e.salarios[0]!.integro = salario; e.movimientos[0]!.importe = salario
  e.movimientos[2]!.importe = new D(salario).minus("10000.01").toFixed(2)
  return x
}
