import { Effect } from "effect"
import Decimal from "decimal.js"
import { expect, it } from "vitest"
import vectores from "./fixtures/revision-murcia81-independiente.json"
import { hechos81 } from "./maternidad-guarderia-fixtures"
import { clasica, explicita, solicitudMurcia } from "./murcia81-api.fixtures"
import type { HechosMaternidad2025 } from "../lib/dominio/irpf/maternidad-2025/contrato"
import type { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import type { DerechosMinimosAnuales } from "../lib/dominio/irpf/minimos/derechos-contrato"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

type Vector = typeof vectores[number]
type Api = "clasica" | "explicita"
const racionalDecimal = (r: { numeradorEuros: string; divisor: string }) => new Decimal(r.numeradorEuros).div(r.divisor)

// Sólo generadores de hechos preexistentes; ningún esperado ni helper del candidato.
function perfil(v: Vector) {
  const original = hechos81(2, 10000), n = original.hijos[0]!
  const facturas = n.facturas.map((f, i) => {
    const primero = new Decimal(v.propios[i]!).div(2).toDecimalPlaces(2, Decimal.ROUND_DOWN)
    return { ...f, pagos: [
      { id: `r-m${i}a`, pagador: "s-1", fecha: f.pagos[0]!.fecha, importe: primero.toFixed(2) },
      { id: `r-m${i}b`, pagador: "s-1", fecha: f.pagos[0]!.fecha, importe: new Decimal(v.propios[i]!).minus(primero).toFixed(2) },
      { id: `r-p${i}`, pagador: "s-3", fecha: f.pagos[0]!.fecha, importe: v.ajenos[i]! },
    ], pagosEmpresa: i === 0 && v.empresa !== "0" ? [{ id: "r-empresa", fecha: "2025-01-31", empleado: "s-1", empresa: "empresa1", importe: v.empresa, contratoServicio: "r-contrato-empresa", nomina: "r-nomina", forma: "contratacion_directa_custodia" as const }] : [] }
  })
  const h: HechosMaternidad2025 = { ...original, hijos: [{ ...n,
    progenitores: [...n.progenitores, { id: "s-3", papel: "padre_biologico", altas: [], actividades: [] }],
    centros: n.centros.map(c => ({ ...c, municipio: "30030", clase: "centro_educacion_infantil", autorizacion: { ...c.autorizacion, clase: "educativa" }, registroCyl: { estado: "no_consta" } })),
    calendario: n.calendario.map(m => !v.capi || m.mes !== 1 ? m : { ...m, complementoInfancia: [{ id: "r-capi", perceptor: "s-3", resolucion: "r-imv", fechaCobro: "2025-01-31", importe: "100" }] }),
    facturas,
    ayudas: facturas.flatMap((f, i) => [
      { id: `r-aym${i}`, beneficiario: "s-1", fechaCobro: f.pagos[0]!.fecha, atribucion: "nominal" as const, programa: "ordinaria" as const, importe: v.ayudasPropias[i]!, facturas: [{ id: f.id, importe: v.ayudasPropias[i]! }] },
      { id: `r-ayp${i}`, beneficiario: "s-3", fechaCobro: f.pagos[0]!.fecha, atribucion: "nominal" as const, programa: "ordinaria" as const, importe: v.ayudasAjenas[i]!, facturas: [{ id: f.id, importe: v.ayudasAjenas[i]! }] },
    ]),
  }] }
  const base = solicitudMurcia(h), a = base.auxiliares!
  const pagos = facturas.flatMap((f, i) => {
    const primeraAyuda = Decimal.min(v.ayudasPropias[i]!, f.pagos[0]!.importe)
    return f.pagos.map((p, j) => ({ ...base.hechos.pagos![i]!, id: p.id, pagador: p.pagador, importeEUR: p.importe,
      ayudasEUR: j === 2 ? v.ayudasAjenas[i]! : j === 0 ? primeraAyuda.toFixed(2) : new Decimal(v.ayudasPropias[i]!).minus(primeraAyuda).toFixed(2) }))
  })
  const s: SolicitudAnualF2025 = { ...base, hechos: { pagos }, auxiliares: { ...a,
    progenitores: [{ ...a.progenitores[0]!, convivientesDevengo: ["s-1", "s-3"] }],
    servicios: facturas.flatMap((f, i) => f.pagos.map(p => ({ pagoId: p.id, periodo: a.servicios[i]!.periodo }))),
    pagadoresMurcia: { referencia: "r-censo", ejercicio: 2025, contribuyente: "s-1", censo: "completo", convivencia: "estable_desde_inicio2025_o_nacimiento",
      hijos: [{ id: n.id, nacimiento: n.nacimiento, progenitores: ["s-1", "s-3"], conviveCon: ["s-1", "s-3"], independienteConConsentimiento: false, apoyoJudicial: "ninguno", soporte: "r-registro" }],
      personas: [
        { id: "s-1", soporte: "r-propio", vivoTodo2025: true, residenteComunTodo2025: true, residencia: { comunidad: "murcia", desde: "2025-01-01", hasta: "2025-12-31", soporte: "r-padron1" }, modalidad: "individual", economia: { perfil: "declarante-en-composicion" } },
        { id: "s-3", soporte: "r-ajeno", vivoTodo2025: true, residenteComunTodo2025: true, residencia: { comunidad: v.derechoAjeno ? "murcia" : "otra-comunidad-comun", desde: "2025-01-01", hasta: "2025-12-31", soporte: "r-padron3" }, modalidad: "individual", economia: { perfil: "sin-rentas", censoRentasCompleto: true } },
      ],
    },
  } }
  return { h, s }
}
function dosTitulares(d: DerechosMinimosAnuales): DerechosMinimosAnuales {
  return { ...d, descendientes: d.descendientes.map(n => ({ ...n, titulares: [...n.titulares, { ...n.titulares[0]!, titularId: "s-3", rentasNoExentasCentimos: 0 }] })) }
}
function ejecutar(api: Api, h: HechosMaternidad2025 | undefined, s: SolicitudAnualF2025) {
  if (api === "clasica") {
    const c = clasica(h)
    return liquidarIrpfAnual({ ...c, derechosMinimos: dosTitulares(c.derechosMinimos!), deduccionesTerritoriales2025: { solicitudes: [s] } }, { modo: "canonico" }).pipe(Effect.map(r => ({ region: r.deduccionesTerritoriales2025, estatal: r.maternidad2025, diferencial: new Decimal(r.cuotaDiferencialCentimos).div(100), liquida: new Decimal(r.cuotaLiquidaCentimos).div(100) })))
  }
  const c = explicita(h)
  return liquidarIrpfAnualExplicito({ ...c, derechosMinimos: dosTitulares(c.derechosMinimos!), deduccionesTerritoriales2025: { solicitudes: [s] } }).pipe(Effect.map(r => ({ region: r.deduccionesTerritoriales2025, estatal: r.maternidad2025, diferencial: new Decimal(r.cuotaDiferencial), liquida: new Decimal(r.cuotaLiquidaLegal) })))
}
for (const api of ["clasica", "explicita"] as const) {
  for (const v of vectores) it(`${api}: revisión independiente ${v.id}`, () => {
    const x = perfil(v)
    const con = Effect.runSync(ejecutar(api, x.h, x.s))
    const sin = Effect.runSync(ejecutar(api, undefined, x.s))
    for (const r of [con, sin]) {
      expect(r.region?.aplicaciones).toHaveLength(1)
      expect(r.region?.total).toEqual(v.regional)
      expect(r.region?.aplicaciones[0]?.generado).toEqual(v.regional)
      expect(r.region?.aplicaciones[0]?.aplicado).toEqual(v.regional)
    }
    expect(con.estatal?.maternidad).toEqual(v.maternidad)
    expect(con.estatal?.incremento).toEqual(v.incremento)
    expect(con.liquida.eq(sin.liquida)).toBe(true)
    // Diferencia entre salidas legales redondeadas: margen máximo de un céntimo.
    expect(con.diferencial.minus(sin.diferencial).minus(racionalDecimal(v.delta)).abs().lte("0.01")).toBe(true)
    const inversa = { ...x.s, hechos: { pagos: [...x.s.hechos.pagos!].reverse() }, auxiliares: { ...x.s.auxiliares!, servicios: [...x.s.auxiliares!.servicios].reverse() } }
    expect(Effect.runSync(ejecutar(api, x.h, inversa)).region?.total).toEqual(v.regional)
  })
  it(`${api}: cruce de ayudas entre facturas conserva suma por pagador y debe rechazar`, () => {
    const v = vectores.find(v => v.id === "ayudas_dos_facturas")!, x = perfil(v)
    // Cambia sólo factura de imputación: enero 100->200; febrero 200->100.
    // Mismo total familiar Y mismo total del pagador. No depende de cero neto.
    const pagos = x.s.hechos.pagos!.map(p => p.pagador !== "s-1" ? p : { ...p,
      ayudasEUR: p.id?.endsWith("a") === true ? (p.factura === "factura1" ? "200" : "100") : "0" })
    expect(Effect.runSync(Effect.flip(ejecutar(api, x.h, { ...x.s, hechos: { pagos } })))._tag).toBe("ResultadoNoSoportado")
  })
  it(`${api}: trasladar contratación empresarial al pago familiar debe rechazar`, () => {
    const x = perfil(vectores.find(v => v.id === "empresa_no_transfiere")!)
    const s = { ...x.s, hechos: { pagos: x.s.hechos.pagos!.map((p, i) => i !== 0 ? p : { ...p, importeEUR: new Decimal(p.importeEUR!).plus("5000").toFixed(2) }) } }
    expect(Effect.runSync(Effect.flip(ejecutar(api, x.h, s)))._tag).toBe("ResultadoNoSoportado")
  })
  it(`${api}: contradicciones familiares, regionales y entre pagos de una factura`, () => {
    const x = perfil(vectores[0]!), a = x.s.auxiliares!, ps = x.s.hechos.pagos!
    const variantes: SolicitudAnualF2025[] = [
      { ...x.s, auxiliares: { ...a, pagadoresMurcia: { ...a.pagadoresMurcia!, hijos: a.pagadoresMurcia!.hijos.map(h => ({ ...h, nacimiento: "2023-01-02" })) } } },
      { ...x.s, auxiliares: { ...a, pagadoresMurcia: { ...a.pagadoresMurcia!, hijos: a.pagadoresMurcia!.hijos.map(h => ({ ...h, conviveCon: ["s-1"] })) } } },
      { ...x.s, auxiliares: { ...a, servicios: a.servicios.map((s, i) => i !== 1 ? s : { ...s, periodo: { ...s.periodo, desde: "2025-01-02" } }) } },
      { ...x.s, hechos: { pagos: ps.map((p, i) => i !== 1 ? p : { ...p, concepto: "alimentacion" }) } },
      { ...x.s, hechos: { pagos: ps.map((p, i) => i !== 1 ? p : { ...p, factura: "factura2" }) } },
    ]
    for (const s of variantes) expect(Effect.runSync(Effect.flip(ejecutar(api, x.h, s)))._tag).toBe("ResultadoNoSoportado")
    // Estos dos adversarios también deben rechazar sin libro81: la factura sigue siendo única.
    for (const s of variantes.slice(2)) expect(Effect.runSync(Effect.flip(ejecutar(api, undefined, s)))._tag).toBe("ResultadoNoSoportado")
  })
}
