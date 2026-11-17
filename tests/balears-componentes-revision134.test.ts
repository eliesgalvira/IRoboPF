import { DateTime, Effect, Result } from "effect"
import { expect, it } from "vitest"
import { efectivo, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion"
import { esAmbitoCuotasTerritorialesOpen2025 } from "../lib/dominio/irpf/cuotas/politica-cuotas-open-2025"

// Oráculo racional propio: no importa tablas, redondeadores ni resultados del motor.
// Transcripción local de escalas 2025, sólo BLG 35.200..48.000; art20/DA61=0.
// Un céntimo de base por un punto básico de tipo produce una millonésima EUR.
// Salvo el testigo 45000/48, son adversas de política, NO observaciones de Open.
const decimal = (n: bigint, places: number) => {
  const sign = n < 0n ? "-" : ""
  const s = (n < 0n ? -n : n).toString().padStart(places + 1, "0")
  return sign + `${s.slice(0, -places)}.${s.slice(-places)}`.replace(/\.?0+$/, "")
}
const cents = (s: string) => BigInt(s.replace(".", ""))
const oracle = (bruto: string, edad: number, quantized = true) => {
  const base = cents(bruto) - 292500n - 200000n
  if (base < 3520000n || base > 4800000n) throw new Error("Fuera del oráculo acotado")
  const e = 4362750000n + (base - 3520000n) * 1850n
  const a = 3510000000n + (base - 3000000n) * 1750n
  const me = (555000n + (edad >= 65 ? 115000n : 0n) + (edad >= 75 ? 140000n : 0n)) * 950n
  const ma = (555000n + (edad >= 65 ? 182000n : 0n) + (edad >= 75 ? 154000n : 0n)) * 900n
  const q = (n: bigint) => quantized ? ((n + 5000n) / 10000n) * 10000n : n
  const [ge, ga, gme, gma] = [q(e), q(a), q(me), q(ma)]
  return {
    componentes: {
      gravamenEstatal: decimal(ge, 6), gravamenAutonomico: decimal(ga, 6),
      gravamenMinimoEstatal: decimal(gme, 6), gravamenMinimoAutonomico: decimal(gma, 6),
      cuotaEstatal: decimal(ge - gme, 6), cuotaAutonomica: decimal(ga - gma, 6),
    },
    posterior: ge + ga - gme - gma,
  }
}
const entrada = (bruto = "45000.00", edad = 48, retencion = "8500.00") => ({
  ...efectivo, comunidadAutonoma: "illes-balears" as const, edad,
  trabajo: { ...efectivo.trabajo, rendimientos: [{
    ...efectivo.trabajo.rendimientos[0]!, integro: bruto,
    cotizaciones: { clase: "efectivas" as const, seguridadSocial: "2925.00", derechosPasivos: "0", colegiosHuerfanos: "0" },
  }] },
  retenciones: [{ operacionId: "ret-revision", procedencia: "sintetico:revision", ejercicio: 2025 as const, importe: retencion, efectiva: true as const }],
})
const calcular = (c: Parameters<typeof liquidarIrpfAnualExplicito>[0]) => {
  const r = Effect.runSync(liquidarIrpfAnualExplicito(c))
  if (!("_tag" in r) || r._tag !== "LiquidacionIrpfAnualExplicitaCalculada") throw Error("Se esperaba liquidación laboral explícita")
  return r
}
const casos = [
  ["40125.00", 48], ["40125.01", 48], ["44999.97", 48], ["44999.99", 48],
  ["45000.00", 48], ["45000.01", 48], ["45000.03", 48], ["52924.99", 48],
  ["52925.00", 48], ["45000.00", 64], ["45000.00", 65],
  ["45000.00", 74], ["45000.00", 75],
] as const

it.each(casos)("oráculo racional acotado bruto%s edad%s y rastro íntegro", (bruto, edad) => {
  const r = calcular(entrada(bruto, edad))
  const o = oracle(bruto, edad)
  expect(r.componentesCuota).toMatchObject(o.componentes)
  expect(r.reduccionArt20).toBe("0")
  expect(r.deduccionTrabajo).toBe("0")
  expect(r.cuotaPosterior).toBe(decimal(o.posterior, 6))
  expect(r.cuotaDiferencial).toBe(decimal(o.posterior - 8500000000n, 6))
  expect(r.aceptacionFiscal).toBe("pendiente")
  const lineas = r.rastro.pasos.flatMap(p => p.lineasCalculo ?? [])
  for (const [site, importe] of [
    ["cuota.estatal", o.componentes.cuotaEstatal], ["cuota.autonomica", o.componentes.cuotaAutonomica],
    ["cuota.posterior", r.cuotaPosterior], ["diferencial", r.cuotaDiferencial],
  ]) {
    const matches = lineas.filter(l => l.origen?.siteId === `anual.explicito.${site}`)
    expect(matches).toHaveLength(1)
    expect(matches[0]?.origen?.decimal).toBe(importe)
  }
  const estatal = lineas.find(l => l.origen?.siteId === "anual.explicito.cuota.estatal")
  const autonomica = lineas.find(l => l.origen?.siteId === "anual.explicito.cuota.autonomica")
  expect(estatal?.formula).toContain("gravámenes a céntimos Open 2025")
  expect(autonomica?.formula).toContain("illes-balears")
})

it.each(["0.00", "9511.01", "10000.00"])("retención%s no cambia componentes y permite devolución", ret => {
  const r = calcular(entrada("45000.00", 48, ret))
  const o = oracle("45000.00", 48)
  expect(r.componentesCuota).toMatchObject(o.componentes)
  expect(r.cuotaDiferencial).toBe(decimal(o.posterior - cents(ret) * 10000n, 6))
})

it("art20 y DA61 no se cuantizan al extender sólo los cuatro gravámenes", () => {
  const c = entrada("17000.01", 48, "0.00")
  const r = calcular({ ...c, trabajo: { ...c.trabajo, rendimientos: c.trabajo.rendimientos.map(p => ({ ...p, cotizaciones: { ...p.cotizaciones, seguridadSocial: "1000.00" } })) } })
  // Aritmética manual racional, sin helpers del motor:
  // 7302 - 7/4 * (16000.01 - 14852) = 5292.9825.
  // base=14000.01-5292.9825=8707.0275; tipos 9.5% y 9%.
  // DA61=340-(17000.01-16576)/5=255.198, límite de cuota no vinculante.
  expect(r.reduccionArt20).toBe("5292.9825")
  expect(r.baseLiquidableGeneral).toBe("8707.0275")
  expect(r.componentesCuota).toMatchObject({ gravamenEstatal: "827.17", gravamenAutonomico: "783.63",
    gravamenMinimoEstatal: "527.25", gravamenMinimoAutonomico: "499.5", cuotaEstatal: "299.92", cuotaAutonomica: "284.13" })
  expect(r.cuotaLiquidaLegal).toBe("584.05")
  expect(r.deduccionTrabajo).toBe("255.198")
  expect(r.cuotaPosterior).toBe("328.852")
  expect(r.cuotaDiferencialPresentada).toBe("328.85")
})

it("pensión y derechos explícitos vacíos conservan los subcéntimos anteriores", () => {
  const c = entrada()
  const pension = { ...c, trabajo: { ...c.trabajo, rendimientos: c.trabajo.rendimientos.map(r => ({ ...r, clase: "pension" as const })) } }
  const familiar = { ...c, contribuyenteId: "s-1", familiaresConDerechoMinimo: "segun-derechos" as const,
    derechosMinimos: { ...derechos, territorio: "illes-balears" as const, edadContribuyenteDevengo: 48, descendientes: [] } }
  for (const caso of [pension, familiar]) {
    const r = calcular(caso)
    const o = oracle("45000.00", 48, false)
    expect(r.componentesCuota).toMatchObject(o.componentes)
    expect(r.cuotaDiferencialPresentada).toBe("1011.00")
    expect(r.rastro.pasos.flatMap(p => p.lineasCalculo ?? []).find(l => l.origen?.siteId === "anual.explicito.cuota.estatal")?.formula).not.toContain("gravámenes a céntimos")
  }
})

it("el censo vacío de ingresos identificados se rechaza antes de producir cuotas", () => {
  const r = Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...entrada(), perfil: "trabajo-y-ayudas-ela", otrasRentas: "solo-ingresos-identificados", contribuyenteId: "s-revision",
    ingresosIdentificados2025: { ejercicio: 2025, contribuyenteId: "s-revision", ambito: "ayudas-publicas-no-transmision", exhaustividad: "completa", ayudas: [] } })))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure).toMatchObject({
    _tag: "ResultadoNoSoportado", motivo: "Entrada incompleta o fuera del alcance anual efectivo declarado",
  })
})

it("bruto cero conserva ruta decimal; un conjunto de clases mixtas se rechaza", () => {
  const c = entrada("0.00")
  const r = calcular({ ...c, trabajo: { ...c.trabajo, rendimientos: c.trabajo.rendimientos.map(p => ({ ...p, cotizaciones: { ...p.cotizaciones, seguridadSocial: "0" } })) } })
  expect(r.componentesCuota.gravamenEstatal).toBe("0")
  expect(r.rastro.pasos.flatMap(p => p.lineasCalculo ?? []).find(l => l.origen?.siteId === "anual.explicito.cuota.estatal")?.formula).not.toContain("gravámenes a céntimos")
  const laboral = entrada().trabajo.rendimientos[0]!
  const mixto = { ...entrada(), trabajo: { ...entrada().trabajo, rendimientos: [laboral, { ...laboral, id: "pension", clase: "pension" as const }] } }
  expect(Result.isFailure(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(mixto))))).toBe(true)
})

it("selector conserva otros territorios, año, derechos y fallecimiento como fronteras", () => {
  const c = { anio: 2025 as const, comunidadAutonoma: "illes-balears" as const }
  expect(esAmbitoCuotasTerritorialesOpen2025(c)).toBe(true)
  for (const comunidadAutonoma of ["catalunya", "comunitat-valenciana", "galicia", "canarias", "aragon"] as const)
    expect(esAmbitoCuotasTerritorialesOpen2025({ ...c, comunidadAutonoma })).toBe(true)
  for (const comunidadAutonoma of ["madrid", "andalucia", "cantabria"] as const)
    expect(esAmbitoCuotasTerritorialesOpen2025({ ...c, comunidadAutonoma })).toBe(false)
  expect(esAmbitoCuotasTerritorialesOpen2025({ ...c, anio: 2024 })).toBe(false)
  expect(esAmbitoCuotasTerritorialesOpen2025({ ...c, fechaFallecimiento: DateTime.toDateUtc(DateTime.makeUnsafe("2025-12-01T00:00:00Z")) })).toBe(false)
  expect(esAmbitoCuotasTerritorialesOpen2025({ ...c, derechosMinimos: { ...derechos, territorio: "illes-balears" } })).toBe(false)
})
