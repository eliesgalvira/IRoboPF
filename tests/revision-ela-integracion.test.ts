import { describe, expect, it } from "vitest"
import { Effect } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { marco } from "./b-ampliado-anual-fixtures"
import { censoELA, solicitudELA, casoCanonicoELA, casoEfectivoELA } from "./ela-ingreso-2025-fixtures"

// Fixture recibido sólo para hechos; esperados derivados aquí sin constantes del producto.
function pagos() {
  const c = structuredClone(censoELA("4000"))
  const a = c.ayudas[0], pago = a.cobros[0]
  return { ...c, ayudas: [{ ...a, resolucion: { ...a.resolucion, importeConcedido: "20000" }, cobros: [
    { ...pago, euros: "1234.56" },
    { ...pago, euros: "2765.44", cobroId: "C2", justificante: "J2" },
  ] }] }
}
describe.each(["canonica", "efectiva"] as const)("revisión propia %s", api => {
  function entradaCanonica(c = pagos()) {
    return { ...casoCanonicoELA(c), rendimientos: { trabajo: [{ importeIntegroCentimos: 3300000 }] } }
  }
  function run(c = pagos()) {
    return api === "canonica"
      ? Effect.runSync(liquidarIrpfAnual(entradaCanonica(c), { modo: "canonico" }))
      : Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoELA(c, solicitudELA(c), "33000", "empleo-laboral")))
  }
  it("dos pagos4000 con concesión20000: cuota y tipos por API", () => {
    const r = run()
    // Efectiva:33000-2000+4000=35000. Canónica: SS uniforme33000*.0648=2138.4; base32861.6.
    // Canónica:qE3484.74;qA3323.526; tipos10.60/10.11; genera828.4; líquida5979.866.
    // qE=2112.75+14800*.15-527.25=3805.5; qA=3893.36+1992.8*.192-549.45=3726.5276.
    // floor(10000*q/base)/100:10.87 y10.64 =>4000*.2151=860.4.
    expect(r.nodosFiscalesB2025?.tiposMediosGenerales).toMatchObject({ baseLiquidableGeneral: api === "canonica" ? "32861.6" : "35000", estatal: api === "canonica" ? "10.60" : "10.87", autonomico: api === "canonica" ? "10.11" : "10.64" })
    expect(r.libroIngresosIdentificados2025?.totalIntegradoGeneral).toEqual(racional("4000"))
    expect(r.libroIngresosIdentificados2025?.ingresos).toHaveLength(1)
    expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(1)
    expect(r.deduccionesTerritoriales2025?.aplicaciones[0]).toMatchObject({ generado: racional(api === "canonica" ? "828.4" : "860.4"), aplicado: racional(api === "canonica" ? "828.4" : "860.4") })
    if (r._tag === "LiquidacionIrpfAnualCalculada") expect(r.cuotaLiquidaCentimos).toBe(597987)
    else expect(r.cuotaLiquidaLegal).toBe("6671.6276")
  })
  it("reordenar cobros no altera bases ni tipos ni cuota", () => {
    const c = pagos(), r = run(c)
    const inverso = { ...c, ayudas: [{ ...c.ayudas[0], cobros: [...c.ayudas[0].cobros].reverse() }] }
    expect(run(inverso).nodosFiscalesB2025).toEqual(r.nodosFiscalesB2025)
    expect(run(inverso).deduccionesTerritoriales2025).toEqual(r.deduccionesTerritoriales2025)
  })
  const adversos: [string, (c: ReturnType<typeof pagos>) => void][] = [
    ["pago repetido con otro id", c => { c.ayudas[0].cobros[1].justificante = c.ayudas[0].cobros[0].justificante }],
    ["id repetido con otro justificante", c => { c.ayudas[0].cobros[1].cobroId = c.ayudas[0].cobros[0].cobroId }],
    ["identidad del censo ajena", c => { c.contribuyenteId = "B" }],
    ["beneficiario ajeno", c => { c.ayudas[0].cobros[1].beneficiario = "B" }],
    ["resolución antes convocatoria", c => { c.ayudas[0].resolucion.fecha = "2025-06-26" }],
    ["sin cobro real", c => { c.ayudas[0].cobros[0].euros = "0" }],
    ["cobro sobre concesión", c => { c.ayudas[0].resolucion.importeConcedido = "3999.99" }],
    ["clasificación trabajo", c => { Object.assign(c.ayudas[0], { clasificacionFiscal: "rendimiento-trabajo" }) }],
    ["otro programa", c => { Object.assign(c.ayudas[0], { programa: "asturias-ela-2024" }) }],
    ["año cobro2026", c => { c.ayudas[0].cobros[1].fecha = "2026-01-01" }],
    ["tipo cliente anidado", c => { Object.assign(c.ayudas[0].cobros[1], { tipoMedio: "99" }) }],
    ["base cliente resolución", c => { Object.assign(c.ayudas[0].resolucion, { base: "20000" }) }],
    ["censo incompleto", c => { Object.assign(c, { exhaustividad: "parcial" }) }],
  ]
  it.each(adversos)("rechaza %s sin resultado monetario", (_, mutar) => {
    const c = pagos(); mutar(c)
    expect(() => run(c)).toThrow()
  })
  it("conjunta fuera del alcance sin declarar ilegalidad", () => {
    if (api === "canonica") {
      const e = entradaCanonica()
      Object.assign(e, { situacionFamiliar: { ...e.situacionFamiliar, tipo: "conjunta" } })
      expect(() => Effect.runSync(liquidarIrpfAnual(e, { modo: "canonico" }))).toThrow()
    } else {
      const c = pagos()
      const e = casoEfectivoELA(c, solicitudELA(c), "33000", "empleo-laboral")
      Object.assign(e, { modalidad: "conjunta" })
      expect(() => Effect.runSync(liquidarIrpfAnualExplicito(e))).toThrow()
    }
  })
})
it.each(["6499.99", "6500", "6500.01"])("frontera propia art20 con %s", euros => {
  const c = censoELA(euros)
  const r = Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoELA(c, { solicitudes: [] }, "14000", "empleo-laboral")))
  const dentro = euros !== "6500.01"
  expect(r.reduccionArt20).toBe(dentro ? "7302" : "0")
  expect(r.baseImponibleGeneral).toBe(euros === "6499.99" ? "11197.99" : dentro ? "11198" : "18500.01")
})

it("DA61: fracción construida con operaciones legales independientes, error menor1e-75", () => {
  const c = pagos()
  const r = Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoELA(c, solicitudELA(c), "14000", "empleo-laboral")))
  // qE299.06+qA233.37=532.43 antes de deducciones; neto4698. DA61.1 usa ambas íntegras.
  const n = 53243n * 4698n, d = 100n * 8698n
  expect(n * 434900n).toBe(125067807n * d)
  const observado = racional(r.deduccionTrabajo)
  const error = BigInt(observado.numeradorEuros)*d - n*BigInt(observado.divisor)
  expect((error < 0n ? -error : error)*10n**75n < d*BigInt(observado.divisor)).toBe(true)
  expect(r.baseLiquidableGeneral).toBe("8698")
})
it.each([1, 6000000])("ahorro %s céntimos no entra en tipo general", importeGananciaCentimos => {
  const c = casoCanonicoELA()
  const sin = Effect.runSync(liquidarIrpfAnual(c, { modo: "canonico" }))
  const con = Effect.runSync(liquidarIrpfAnual({ ...c, rendimientos: { trabajo: [], gananciasPatrimoniales: [{ importeGananciaCentimos, tratamientoMayores65: { _tag: "SinExencionMayores65" } }] } }, { modo: "canonico" }))
  expect(con.nodosFiscalesB2025?.tiposMediosGenerales).toEqual(sin.nodosFiscalesB2025?.tiposMediosGenerales)
  expect(con.deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual(racional("3082"))
})

it("familia: hijo10 años compartido reduce las cuotas que originan tipos ELA", () => {
  const original = marco().caso.derechosMinimos
  if (original === undefined) throw new Error("Faltan hechos familiares recibidos")
  const derechos = { ...original,
    conciliacionRentasContribuyente: { perfil: "caso-anual-parcial" as const, otrasRentasOGastosNoRepresentados: "ninguno" as const },
    descendientes: original.descendientes.map(d => ({ ...d, titulares: d.titulares.map(t => ({ ...t, vinculo: { clase: "consanguinidad" as const } })) })),
  }
  const c = censoELA()
  Object.assign(c, { contribuyenteId: "s-1" })
  Object.assign(c.ayudas[0], { beneficiario: "s-1" })
  Object.assign(c.ayudas[0].cobros[0], { beneficiario: "s-1" })
  const canonico = { ...casoCanonicoELA(c), contribuyenteId: "s-1", derechosMinimos: derechos,
    situacionFamiliar: { ...casoCanonicoELA(c).situacionFamiliar, edad: 40 } }
  const efectivo = { ...casoEfectivoELA(c), contribuyenteId: "s-1", edad: 40, familiaresConDerechoMinimo: "segun-derechos" as const, derechosMinimos: derechos }
  // Mínimos:5550+2400/2=6750;6105+2640/2=7425.
  // qE=2088.75-641.25=1447.5;qA=2072.352-668.25=1404.102.
  // Tipos7.23+7.02; generación2850; aplica1404.102 una vez.
  for (const r of [Effect.runSync(liquidarIrpfAnual(canonico, { modo: "canonico" })), Effect.runSync(liquidarIrpfAnualExplicito(efectivo))]) {
    expect(r.nodosFiscalesB2025?.tiposMediosGenerales).toMatchObject({ estatal: "7.23", autonomico: "7.02", cuotaGeneralEstatalArt63_1: "1447.5", cuotaGeneralAutonomicaArt74_1: "1404.102" })
    expect(r.deduccionesTerritoriales2025?.aplicaciones[0]).toMatchObject({ generado: racional("2850"), aplicado: racional("1404.102") })
  }
})
