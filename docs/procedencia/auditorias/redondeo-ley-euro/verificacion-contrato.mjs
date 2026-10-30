import assert from "node:assert/strict"
import { writeFileSync } from "node:fs"
import Decimal from "decimal.js"

import { redondearImporteLiquidado } from "../../../../lib/dominio/dinero/importe-monetario.ts"
import { calcularDesgloseCotizacionesPerfilUniforme } from "../../../../lib/dominio/laboral/cotizaciones-perfil-uniforme.ts"

const empate = new Decimal("0.005")
const superior = redondearImporteLiquidado(empate)
const alPar = empate.toDecimalPlaces(2, Decimal.ROUND_HALF_EVEN)
assert.equal(superior.toFixed(2), "0.01")
assert.equal(alPar.toFixed(2), "0.00")

const analitico = calcularDesgloseCotizacionesPerfilUniforme({
  anio: 2025,
  salarioBrutoAnual: new Decimal("132500"),
})
assert.equal(analitico.alcance, "analitico-doce-mensualidades-uniformes")
assert.equal(analitico.redondeoTgss, "pendiente")
assert.equal(analitico.solidaridadEmpresarial.toString(), "673.42246")
assert.equal(analitico.solidaridadTrabajador.toString(), "132.74372")

// La cuantización siguiente es una variante experimental, no un método TGSS.
const meses = [...Array(8).fill("11041.67"), ...Array(4).fill("11041.66")]
const paresTipos = [["0.0077", "0.0083", "0.0098"], ["0.0015", "0.0017", "0.0019"]]
const suma = (valores) => valores.reduce((acc, x) => acc.plus(x), new Decimal(0))
const cuota = (sueldo, tipos) => [
  new Decimal("490.95"),
  new Decimal("1963.80"),
  new Decimal(sueldo).minus("7364.25"),
].map((base, i) => base.mul(tipos[i]))
const porFraccion = paresTipos.map((tipos) => suma(meses.map((sueldo) => suma(cuota(sueldo, tipos).map(redondearImporteLiquidado)))).toFixed(2))
const porMes = paresTipos.map((tipos) => suma(meses.map((sueldo) => redondearImporteLiquidado(suma(cuota(sueldo, tipos))))).toFixed(2))
const anual = [analitico.solidaridadEmpresarial, analitico.solidaridadTrabajador].map((x) => redondearImporteLiquidado(x).toFixed(2))
assert.deepEqual(porFraccion, ["673.44", "132.84"])
assert.deepEqual(porMes, ["673.44", "132.72"])
assert.deepEqual(anual, ["673.42", "132.74"])

writeFileSync(new URL("contrato-existente.json", import.meta.url), JSON.stringify({
  alcance: analitico.alcance,
  redondeoTgss: analitico.redondeoTgss,
  empatePositivo: { entrada: "0.005", helperHalfUp: superior.toFixed(2), alternativaHalfEven: alPar.toFixed(2) },
  solidaridadAnalitica: [analitico.solidaridadEmpresarial.toString(), analitico.solidaridadTrabajador.toString()],
  anualAnaliticoRedondeado: anual,
  variantePorFraccionPagadorMes: porFraccion,
  variantePorPagadorMes: porMes,
  orden: ["empresa", "trabajador"],
  expectedNormativoTgss: null,
  verificacion: "Aserciones contra el contrato existente; no exige cambiarlo por una variante mensual",
}, null, 2) + "\n")
