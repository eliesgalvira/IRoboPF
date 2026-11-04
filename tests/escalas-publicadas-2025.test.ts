import Decimal from "decimal.js"
import { DateTime } from "effect"
import { expect, it } from "vitest"
import { calcularCuotaPorEscala } from "../lib/dominio/irpf/cuotas/escalas-gravamen"
import { obtenerEscalaAutonomicaPublicada } from "../lib/dominio/irpf/cuotas/escalas-publicadas"
import { obtenerParametrosComunidadAutonoma } from "../lib/dominio/irpf/comunidades/comunidad-autonoma"

// Esperados de las filas oficiales y fórmula cuota + exceso × tipo.
// Evidencia independiente: datos-2012-2026/producto-escalas2025/casos-monetarios.json.
it.each([
  ["aragon", "13072.5", "1241.89", "1241.89"],
  ["aragon", "13072.51", "1241.8912", "1241.89"],
  ["aragon", "13195.95", "1256.704", "1256.70"],
  ["aragon", "21209.99", "2218.3888", "2218.39"],
  ["aragon", "21210", "2218.39", "2218.39"],
  ["aragon", "21210.01", "2218.3915", "2218.39"],
  ["aragon", "21333.45", "2236.9075", "2236.91"],
  ["aragon", "36959.99", "4580.8885", "4580.89"],
  ["aragon", "36960", "4580.89", "4580.89"],
  ["aragon", "36960.01", "4580.89185", "4580.89"],
  ["aragon", "37083.45", "4603.72825", "4603.73"],
  ["aragon", "52499.99", "7455.78815", "7455.79"],
  ["aragon", "52500", "7455.79", "7455.79"],
  ["aragon", "52500.01", "7455.79205", "7455.79"],
  ["aragon", "52623.45", "7481.09725", "7481.10"],
  ["aragon", "59999.99", "8993.28795", "8993.29"],
  ["aragon", "60000", "8993.29", "8993.29"],
  ["aragon", "60000.01", "8993.2923", "8993.29"],
  ["aragon", "60123.45", "9021.6835", "9021.68"],
  ["aragon", "79999.99", "13593.2877", "13593.29"],
  ["aragon", "80000", "13593.29", "13593.29"],
  ["aragon", "80000.01", "13593.2924", "13593.29"],
  ["aragon", "80123.45", "13622.918", "13622.92"],
  ["aragon", "89999.99", "15993.2876", "15993.29"],
  ["aragon", "90000", "15993.29", "15993.29"],
  ["aragon", "90000.01", "15993.2925", "15993.29"],
  ["aragon", "90123.45", "16024.1525", "16024.15"],
  ["aragon", "129999.99", "25993.2875", "25993.29"],
  ["aragon", "130000", "25993.29", "25993.29"],
  ["aragon", "130000.01", "25993.29255", "25993.29"],
  ["aragon", "130123.45", "26024.76975", "26024.77"],
  ["asturias", "17707.2", "1751.36", "1751.36"],
  ["asturias", "17707.21", "1751.3614", "1751.36"],
  ["asturias", "17830.65", "1768.643", "1768.64"],
  ["asturias", "33007.19", "3893.3586", "3893.36"],
  ["asturias", "33007.2", "3893.36", "3893.36"],
  ["asturias", "33007.21", "3893.36192", "3893.36"],
  ["asturias", "33130.65", "3917.0624", "3917.06"],
  ["asturias", "53407.19", "7810.15808", "7810.16"],
  ["asturias", "53407.2", "7810.16", "7810.16"],
  ["asturias", "53407.21", "7810.16215", "7810.16"],
  ["asturias", "53530.65", "7836.70175", "7836.70"],
  ["asturias", "69999.99", "11377.60985", "11377.61"],
  ["asturias", "70000", "11377.62", "11377.62"],
  ["asturias", "70000.01", "11377.62225", "11377.62"],
  ["asturias", "70123.45", "11405.39625", "11405.40"],
  ["asturias", "89999.99", "15877.61775", "15877.62"],
  ["asturias", "90000", "15877.62", "15877.62"],
  ["asturias", "90000.01", "15877.6225", "15877.62"],
  ["asturias", "90123.45", "15908.4825", "15908.48"],
  ["asturias", "174999.99", "37127.6175", "37127.62"],
  ["asturias", "175000", "37127.62", "37127.62"],
  ["asturias", "175000.01", "37127.6226", "37127.62"],
  ["asturias", "175123.45", "37159.717", "37159.72"],
  ["castilla-y-leon", "53407.2", "7518.83", "7518.83"],
  ["castilla-y-leon", "53407.21", "7518.83215", "7518.83"],
  ["castilla-y-leon", "53530.65", "7545.37175", "7545.37"],
  ["galicia", "12985.35", "1168.68", "1168.68"],
  ["galicia", "12985.36", "1168.681165", "1168.68"],
  ["galicia", "13108.8", "1183.061925", "1183.06"],
  ["galicia", "21068.59", "2110.37746", "2110.38"],
  ["galicia", "21068.6", "2110.38", "2110.38"],
  ["galicia", "21068.61", "2110.38149", "2110.38"],
  ["galicia", "21192.05", "2128.77405", "2128.77"],
  ["galicia", "35199.99", "4215.95711", "4215.96"],
  ["galicia", "35200", "4215.96", "4215.96"],
  ["galicia", "35200.01", "4215.96184", "4215.96"],
  ["galicia", "35323.45", "4238.6748", "4238.67"],
  ["galicia", "59999.99", "8779.15816", "8779.16"],
  ["galicia", "60000", "8779.16", "8779.16"],
  ["galicia", "60000.01", "8779.16225", "8779.16"],
  ["galicia", "60123.45", "8806.93625", "8806.94"],
] as const)(
  "cuota publicada 2025 %s, base %s",
  (comunidadAutonoma, base, exacta, centimos) => {
    const ambito = { anio: 2025, comunidadAutonoma } as const
    const parametros = obtenerParametrosComunidadAutonoma({
      ...ambito,
      baseLiquidableGeneral: new Decimal(base),
    })
    if (parametros._tag !== "ParametrosComunidadAutonoma")
      throw new Error("Territorio no admitido")
    const escala = obtenerEscalaAutonomicaPublicada(ambito)
    if (escala === undefined)
      throw new Error("Falta la cuota publicada de 2025")
    const cuota = calcularCuotaPorEscala({
      base: new Decimal(base),
      tramos: parametros.escalaAutonomica.tramos,
      escalasPublicadas: [escala],
    })
    expect(cuota.eq(exacta)).toBe(true)
    expect(cuota.toFixed(2, Decimal.ROUND_HALF_UP)).toBe(centimos)
  }
)
it.each(["aragon", "asturias", "galicia", "castilla-y-leon"] as const)(
  "reserva de alcance de %s",
  (comunidadAutonoma) => {
    expect(
      obtenerEscalaAutonomicaPublicada({
        anio: 2025,
        comunidadAutonoma,
        fechaFallecimiento: DateTime.toDateUtc(DateTime.makeUnsafe("2025-06-30T12:00:00Z")),
      })
    ).toBeUndefined()
    expect(
      obtenerEscalaAutonomicaPublicada({ anio: 2024, comunidadAutonoma })
    ).toBeUndefined()
  }
)
