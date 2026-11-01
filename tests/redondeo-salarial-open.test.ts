import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import oficiales from "../docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json"

// Transcripción PDF cotejada con SES: null conserva la omisión oficial.
it.each(oficiales)("Open 1.19: $id", ({ entrada, casillas }) => {
  const r = Effect.runSync(liquidarIrpfAnualExplicito(Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(entrada)))
  const campos = { "0023": r.reduccionArt20, "0025": r.rendimientoNetoReducido, "0500": r.baseImponibleGeneral, "0505": r.baseLiquidableGeneral, "0414": r.deduccionTrabajo, "0595": r.cuotaPosterior, "0610": r.cuotaDiferencial, "0670": r.cuotaDiferencialPresentada }
  for (const casilla of ["0023", "0025", "0500", "0505", "0414", "0595", "0610", "0670"] as const) {
    const actual = campos[casilla]
    const esperado = casillas[casilla]
    if (esperado !== null) expect.soft(new Decimal(actual).toFixed(2), casilla).toBe(esperado)
  }
  const lineas = r.rastro.pasos.flatMap(p => p.lineasCalculo ?? [])
  for (const [casilla, sitio] of [["0532", "estatal"], ["0533", "autonomica"]] as const) {
    const linea = lineas.find(l => l.origen?.siteId === `anual.explicito.cuota.${sitio}`)!
    expect.soft(new Decimal(linea.origen!.decimal).toFixed(2), casilla).toBe(casillas[casilla])
  }
  // Cada gravamen debe figurar en la fórmula ejecutada, antes de la resta.
  expect.soft(lineas.find(l => l.origen?.siteId === "anual.explicito.cuota.estatal")?.formula).toContain(`${casillas["0528"]} − ${casillas["0530"]}`)
  expect.soft(lineas.find(l => l.origen?.siteId === "anual.explicito.cuota.autonomica")?.formula).toContain(`${casillas["0529"]} − ${casillas["0531"]}`)
})

it.each(oficiales)("retenciones no alteran bases ni cuotas: $id", ({ entrada }) => {
  const admitida = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(entrada)
  if (admitida.perfil !== "solo-trabajo") throw new Error("Fixture salarial requerido")
  const antes = Effect.runSync(liquidarIrpfAnualExplicito(admitida))
  const despues = Effect.runSync(liquidarIrpfAnualExplicito({ ...admitida, retenciones: [] }))
  expect(despues).toMatchObject({ baseLiquidableGeneral: antes.baseLiquidableGeneral, reduccionArt20: antes.reduccionArt20, cuotaLiquidaLegal: antes.cuotaLiquidaLegal, deduccionTrabajo: antes.deduccionTrabajo, cuotaPosterior: antes.cuotaPosterior, retenciones: "0" })
  expect(new Decimal(despues.cuotaDiferencial).minus(antes.cuotaDiferencial).toFixed()).toBe(antes.retenciones)
})

it("empleo estatutario usa las mismas etapas contrastadas; empate positivo art20", () => {
  const caso = oficiales.find(c => c.id === "da61")!
  const entrada = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(caso.entrada)
  if (entrada.perfil !== "solo-trabajo") throw new Error("Fixture salarial requerido")
  const r = Effect.runSync(liquidarIrpfAnualExplicito({ ...entrada, trabajo: { ...entrada.trabajo, rendimientos: entrada.trabajo.rendimientos.map(r => ({ ...r, clase: "empleo-estatutario" as const })) } }))
  expect(r.reduccionArt20).toBe("5292.27")
  expect(r.cuotaDiferencialPresentada).toBe("-721.23")
})
