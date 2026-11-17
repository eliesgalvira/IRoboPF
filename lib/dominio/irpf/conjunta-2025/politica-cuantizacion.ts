import Decimal from "decimal.js"
import type { prepararConjunta2025 } from "./preparar"
import type { CasoConjunta2025 } from "./contrato"
import { calcularCuotaPorEscala } from "../cuotas/escalas-gravamen"
import { ARAGON_2025, GALICIA_2025, CASTILLA_Y_LEON_2025, type EscalaPublicada } from "../cuotas/escalas-publicadas"

const A = Decimal.clone({ precision: 80 })
const filas = (datos: readonly (readonly [string, string, string])[]): EscalaPublicada =>
  datos.map(([baseInferior, cuota, tipo]) => ({ baseInferior: new A(baseInferior), cuota: new A(cuota), tipo: new A(tipo) }))
// Manual AEAT Renta 2025 parte 1, pp.942, 945, 947, 950–952.
// Tablas locales de esta política: no modifican el selector individual.
const estatal = filas([
  ["0", "0", ".095"], ["12450", "1182.75", ".12"], ["20200", "2112.75", ".15"],
  ["35200", "4362.75", ".185"], ["60000", "8950.75", ".225"], ["300000", "62950.75", ".245"],
])
const clm = estatal.slice(0, 5)
const murcia = filas([
  ["0", "0", ".095"], ["12450", "1182.75", ".112"], ["20200", "2050.75", ".133"],
  ["34000", "3886.15", ".179"], ["60000", "8540.15", ".225"],
])
const balears = filas([
  ["0", "0", ".09"], ["10000", "900", ".1125"], ["18000", "1800", ".1425"],
  ["30000", "3510", ".175"], ["48000", "6660", ".19"], ["70000", "10840", ".2175"],
  ["90000", "15190", ".2275"], ["120000", "22015", ".2375"], ["175000", "35077.50", ".2475"],
])
const valencia = filas([
  ["0", "0", ".09"], ["12000", "1080", ".12"], ["22000", "2280", ".15"],
  ["32000", "3780", ".175"], ["42000", "5530", ".20"], ["52000", "7530", ".225"],
  ["62000", "9780", ".25"], ["72000", "12280", ".265"], ["100000", "19700", ".275"],
  ["150000", "33450", ".285"], ["200000", "47700", ".295"],
])
const tablas = {
  aragon: ARAGON_2025, galicia: GALICIA_2025, "castilla-y-leon": CASTILLA_Y_LEON_2025,
  "castilla-la-mancha": clm, murcia, "illes-balears": balears, "comunitat-valenciana": valencia,
  madrid: undefined,
} satisfies Record<CasoConjunta2025["comunidadAutonoma"], EscalaPublicada | undefined>
export const cuantizarComponenteConjunto = (valor: Decimal): Decimal =>
  new A(valor).toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
const centesimal = (v: Decimal) => v.isFinite() && v.decimalPlaces() <= 2
const equivalentes = (base: Decimal, minimo: Decimal) =>
  centesimal(minimo) || base.mod(".01").eq(minimo.mod(".01"))

/** Sólo después de validar y conciliar el contrato en composición.
 * Frontera suficiente A=B: no identifica la etapa interna de Open.
 * undefined conserva íntegra la ruta decimal anterior, también si BLG<mínimo.
 */
export function seleccionarCuantizacionConjunta(
  preparada: ReturnType<typeof prepararConjunta2025> | undefined,
  base: Decimal, minimoEstatal: Decimal, minimoAutonomico: Decimal,
) {
  if (preparada === undefined ||
    !base.isFinite() || base.lt(minimoEstatal) || base.lt(minimoAutonomico) ||
    !preparada.caso.economia.retenciones.every(r => centesimal(new A(r.importe)))) return undefined
  const autonomica = tablas[preparada.caso.comunidadAutonoma]
  if (autonomica === undefined) return undefined
  const gravar = (b: Decimal, escala: EscalaPublicada) => calcularCuotaPorEscala({
    base: b, tramos: [], escalasPublicadas: [escala], aritmetica: A,
  })
  if (!equivalentes(gravar(base, estatal), gravar(minimoEstatal, estatal)) ||
    !equivalentes(gravar(base, autonomica), gravar(minimoAutonomico, autonomica))) return undefined
  return { nombre: "conjunta-2025-componentes-half-up" as const, estatal, autonomica }
}
