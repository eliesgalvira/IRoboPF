import fixtureCanonico from "../tests/fixtures/canonical-tabular-hashes.json"
import {
  hashTablaCompatibleExacta,
  tablaEsperadaPorHoja,
  type FixtureCanonicoTabular,
} from "../tests/helpers/canonical-tabular-hashes"

const nombreHoja = process.argv[2]
if (nombreHoja === undefined) {
  throw new Error("Uso: bun scripts/hash-effect-sheet.ts <HOJA>")
}

const fixture = fixtureCanonico as FixtureCanonicoTabular
const hoja = fixture.sheets.find((sheet) => sheet.name === nombreHoja)
if (hoja === undefined) {
  throw new Error(`Hoja no encontrada en fixture canónico: ${nombreHoja}`)
}

const hash = hashTablaCompatibleExacta(
  hoja.name,
  tablaEsperadaPorHoja(hoja.name)
)

process.stdout.write(`${JSON.stringify(hash)}\n`)
