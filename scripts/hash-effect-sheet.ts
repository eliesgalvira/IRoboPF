import fixtureLegacyDerivado from "../tests/fixtures/legacy-tabular-hashes.json"
import {
  hashTablaCompatibleConParches,
  tablaEsperadaPorHoja,
  type FixtureLegacyDerivado,
} from "../tests/helpers/legacy-tabular-hashes"

const nombreHoja = process.argv[2]
if (nombreHoja === undefined) {
  throw new Error("Uso: bun scripts/hash-effect-sheet.ts <HOJA>")
}

const fixture = fixtureLegacyDerivado as FixtureLegacyDerivado
const hoja = fixture.sheets.find((sheet) => sheet.name === nombreHoja)
if (hoja === undefined) {
  throw new Error(`Hoja no encontrada en fixture derivado: ${nombreHoja}`)
}

const hash = hashTablaCompatibleConParches(
  hoja.name,
  tablaEsperadaPorHoja(hoja.name),
  hoja.tolerancePatches
)

process.stdout.write(`${JSON.stringify(hash)}\n`)
