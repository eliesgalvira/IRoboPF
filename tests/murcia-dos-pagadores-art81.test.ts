import { Effect } from "effect"
import Decimal from "decimal.js"
import { expect, it } from "vitest"
import oraculos from "./fixtures/murcia-dos-pagadores-art81.json"
import { hechos81 } from "./maternidad-guarderia-fixtures"
import { clasica, explicita, solicitudMurcia } from "./murcia81-api.fixtures"
import type { HechosMaternidad2025 } from "../lib/dominio/irpf/maternidad-2025/contrato"
import type { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import type { DerechosMinimosAnuales } from "../lib/dominio/irpf/minimos/derechos-contrato"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"

type Vector = typeof oraculos[number]
function perfil(v: Vector) {
  const h = hechos81(1, 10000), n = h.hijos[0]!, f = n.facturas[0]!
  const pagos = [
    { id: "p-m1", fecha: "2025-01-31", pagador: "s-1", importe: v.propio },
    { id: "p-p", fecha: "2025-01-31", pagador: "s-3", importe: v.ajeno },
  ]
  const hechos: HechosMaternidad2025 = { ...h, hijos: [{ ...n,
    progenitores: [...n.progenitores, { id: "s-3", papel: "padre_biologico", altas: [], actividades: [] }],
    centros: n.centros.map(c => ({ ...c, municipio: "30030", clase: "centro_educacion_infantil",
      autorizacion: { ...c.autorizacion, clase: "educativa" }, registroCyl: { estado: "no_consta" } })),
    facturas: [{ ...f, pagos }],
    ayudas: [
      { id: "ayuda-m", fechaCobro: "2025-01-31", beneficiario: "s-1", programa: "ordinaria", atribucion: "nominal", importe: v.ayudaPropia, facturas: [{ id: f.id, importe: v.ayudaPropia }] },
      { id: "ayuda-p", fechaCobro: "2025-01-31", beneficiario: "s-3", programa: "ordinaria", atribucion: "nominal", importe: v.ayudaAjena, facturas: [{ id: f.id, importe: v.ayudaAjena }] },
    ],
  }] }
  const s = solicitudMurcia(hechos), a = s.auxiliares!
  const solicitud: SolicitudAnualF2025 = { ...s, auxiliares: { ...a,
    progenitores: [{ ...a.progenitores[0]!, convivientesDevengo: ["s-1", "s-3"] }],
    pagadoresMurcia: { referencia: "censo-estable", ejercicio: 2025, contribuyente: "s-1", censo: "completo",
      convivencia: "estable_desde_inicio2025_o_nacimiento",
      hijos: [{ id: n.id, nacimiento: n.nacimiento, progenitores: ["s-1", "s-3"], conviveCon: ["s-1", "s-3"], independienteConConsentimiento: false, apoyoJudicial: "ninguno", soporte: "registro-padron" }],
      personas: [
        { id: "s-1", soporte: "propio", vivoTodo2025: true, residenteComunTodo2025: true, residencia: { comunidad: "murcia", desde: "2025-01-01", hasta: "2025-12-31", soporte: "padron1" }, modalidad: "individual", economia: { perfil: "declarante-en-composicion" } },
        { id: "s-3", soporte: "ajeno", vivoTodo2025: true, residenteComunTodo2025: true, residencia: { comunidad: v.derechoAjeno ? "murcia" : "otra-comunidad-comun", desde: "2025-01-01", hasta: "2025-12-31", soporte: "padron3" }, modalidad: "individual", economia: { perfil: "sin-rentas", censoRentasCompleto: true } },
      ],
    },
    servicios: pagos.map(p => ({ pagoId: p.id, periodo: a.servicios[0]!.periodo })),
  }, hechos: { pagos: pagos.map(p => ({ ...s.hechos.pagos![0]!, id: p.id, pagador: p.pagador, importeEUR: p.importe, ayudasEUR: p.pagador === "s-1" ? v.ayudaPropia : v.ayudaAjena })) } }
  return { h: hechos, s: solicitud }
}
function derechos(d: DerechosMinimosAnuales, cero: boolean): DerechosMinimosAnuales {
  return { ...d, descendientes: d.descendientes.map(n => ({ ...n, titulares: [
    { ...n.titulares[0]!, rentasNoExentasCentimos: cero ? 0 : n.titulares[0]!.rentasNoExentasCentimos },
    { ...n.titulares[0]!, titularId: "s-3", rentasNoExentasCentimos: 0 },
  ] })) }
}
function ejecutar(api: "clasica" | "explicita", h: HechosMaternidad2025 | undefined, s: SolicitudAnualF2025, cero = false, retencion = false) {
  if (api === "clasica") {
    const c = clasica(h)
    return liquidarIrpfAnual({ ...c, derechosMinimos: derechos(c.derechosMinimos!, cero),
      rendimientos: cero ? { trabajo: [{ importeIntegroCentimos: 0 }] } : c.rendimientos,
      retencionesSoportadasCentimos: retencion ? 100000 : 0,
      deduccionesTerritoriales2025: { solicitudes: [s] } }, { modo: "canonico" }).pipe(Effect.map(r => ({ maternidad2025: r.maternidad2025, deduccionesTerritoriales2025: r.deduccionesTerritoriales2025, diferencial: new Decimal(r.cuotaDiferencialCentimos).div(100), liquida: new Decimal(r.cuotaLiquidaCentimos).div(100) })))
  }
  const c = explicita(h)
  return liquidarIrpfAnualExplicito({ ...c, derechosMinimos: derechos(c.derechosMinimos!, cero),
    trabajo: { ...c.trabajo, rendimientos: c.trabajo.rendimientos.map(r => ({ ...r, integro: cero ? "0" : r.integro })) },
    retenciones: retencion ? [{ ejercicio: 2025, operacionId: "retencion", procedencia: "certificado", importe: "1000", efectiva: true }] : [],
    deduccionesTerritoriales2025: { solicitudes: [s] } }).pipe(Effect.map(r => ({ maternidad2025: r.maternidad2025, deduccionesTerritoriales2025: r.deduccionesTerritoriales2025, diferencial: new Decimal(r.cuotaDiferencial), liquida: new Decimal(r.cuotaLiquidaLegal) })))
}
for (const api of ["clasica", "explicita"] as const) {
  for (const v of oraculos) it(`${api}: Fraction ${v.id}, con/sin81 y orden inverso`, () => {
    const x = perfil(v)
    const a = Effect.runSync(ejecutar(api, x.h, x.s))
    const b = Effect.runSync(ejecutar(api, undefined, x.s))
    const invertida = { ...x.s, hechos: { pagos: [...x.s.hechos.pagos!].reverse() }, auxiliares: { ...x.s.auxiliares!, servicios: [...x.s.auxiliares!.servicios].reverse() } }
    const c = Effect.runSync(ejecutar(api, x.h, invertida))
    for (const r of [a, b, c]) {
      expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(1)
      expect(r.deduccionesTerritoriales2025?.total).toEqual(racional(v.regional.numeradorEuros, v.regional.divisor))
    }
    expect(a.maternidad2025?.incremento).toEqual(racional(v.incremento.numeradorEuros, v.incremento.divisor))
    expect(a.maternidad2025?.maternidad).toEqual(racional("1200"))
    expect(b.maternidad2025).toBeUndefined()
    expect(c.diferencial.toFixed()).toBe(a.diferencial.toFixed())
    expect(a.diferencial.minus(b.diferencial).toDecimalPlaces(2).toFixed(2)).toBe(v.deltaDiferencialEUR)
  })
  it(`${api}: cuota agotada y retenciones no consumen art81 como cuota regional`, () => {
    const x = perfil(oraculos[0]!)
    const a = Effect.runSync(ejecutar(api, x.h, x.s, true, true))
    expect(a.deduccionesTerritoriales2025?.aplicaciones[0]?.generado).toEqual(racional("500"))
    expect(a.deduccionesTerritoriales2025?.aplicaciones[0]?.aplicado).toEqual(racional("0"))
    expect(a.liquida.toFixed()).toBe("0")
    expect(a.diferencial.toDecimalPlaces(2).toFixed(2)).toBe("-2283.33")
  })
  it(`${api}: complemento bloquea81 sin borrar el derecho regional ni el mínimo`, () => {
    const x = perfil(oraculos[0]!)
    const h = { ...x.h, hijos: x.h.hijos.map(n => ({ ...n, calendario: n.calendario.map(m => m.mes !== 1 ? m : { ...m,
      complementoInfancia: [{ id: "capi", perceptor: "s-3", resolucion: "imv", fechaCobro: "2025-01-31", importe: "100" }] }) })) }
    const a = Effect.runSync(ejecutar(api, h, x.s))
    expect(a.deduccionesTerritoriales2025?.total).toEqual(racional("500"))
    expect(a.maternidad2025?.maternidad).toEqual(racional("1100"))
    expect(a.maternidad2025?.incremento).toEqual(racional("0"))
  })
  it(`${api}: varios pagos del mismo pagador sin prorratear ayuda implícita`, () => {
    const x = perfil(oraculos[0]!), n = x.h.hijos[0]!, f = n.facturas[0]!, p = f.pagos[0]!
    const h = { ...x.h, hijos: [{ ...n, facturas: [{ ...f, pagos: [{ ...p, importe: "2000" }, { ...p, id: "p-m2", importe: "3000" }, f.pagos[1]!] }] }] }
    const regional = x.s.hechos.pagos![0]!
    const s = { ...x.s, hechos: { pagos: [{ ...regional, importeEUR: "2000" }, { ...regional, id: "p-m2", importeEUR: "3000" }, x.s.hechos.pagos![1]!] },
      auxiliares: { ...x.s.auxiliares!, servicios: [...x.s.auxiliares!.servicios, { ...x.s.auxiliares!.servicios[0]!, pagoId: "p-m2" }] } }
    for (const libro of [h, undefined]) expect(Effect.runSync(ejecutar(api, libro, s)).deduccionesTerritoriales2025?.total).toEqual(racional("500"))
  })
  it(`${api}: ayuda nominal distribuida entre varios pagos se concilia por factura/pagador`, () => {
    const x = perfil(oraculos[0]!), n = x.h.hijos[0]!, f = n.facturas[0]!, p = f.pagos[0]!
    const h = { ...x.h, hijos: [{ ...n,
      facturas: [{ ...f, pagos: [{ ...p, importe: "200" }, { ...p, id: "p-m2", importe: "800" }, f.pagos[1]!] }],
      ayudas: n.ayudas.map(a => a.beneficiario !== "s-1" ? a : { ...a, importe: "300", facturas: [{ id: f.id, importe: "300" }] }),
    }] }
    const pRegional = x.s.hechos.pagos![0]!
    const s = { ...x.s, hechos: { pagos: [{ ...pRegional, importeEUR: "200", ayudasEUR: "100" }, { ...pRegional, id: "p-m2", importeEUR: "800", ayudasEUR: "200" }, x.s.hechos.pagos![1]!] },
      auxiliares: { ...x.s.auxiliares!, servicios: [...x.s.auxiliares!.servicios, { ...x.s.auxiliares!.servicios[0]!, pagoId: "p-m2" }] } }
    // Fraction: (1000 - 300) / 5 = 140; incremento = min(1000/12, 1700).
    const r = Effect.runSync(ejecutar(api, h, s))
    expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("140"))
    expect(r.maternidad2025?.incremento).toEqual(racional("250", "3"))
    // Mismo total de ayudas, beneficiario falso: no basta cuadrar la suma familiar.
    const cruzada = { ...s, hechos: { pagos: s.hechos.pagos.map(p => ({ ...p, ayudasEUR: p.id === "p-p" ? "300" : "0" })) } }
    expect(Effect.runSync(Effect.flip(ejecutar(api, h, cruzada)))._tag).toBe("ResultadoNoSoportado")
  })
  it(`${api}: identidad, omisión, ayudas cruzadas y duplicados rechazan sin cero`, () => {
    const x = perfil(oraculos[0]!), ps = x.s.hechos.pagos!, a = x.s.auxiliares!
    const variantes: readonly SolicitudAnualF2025[] = [
      ...[{ beneficiarioId: "s-3" }, { objetoId: "otro" }, { factura: "otra" }, { pagador: "s-1" }, { importeEUR: "999" }, { ayudasEUR: "1" }, { fecha: "2025-01-30" }, { concepto: "matricula" }].map(delta => ({ ...x.s, hechos: { pagos: [ps[0]!, { ...ps[1]!, ...delta }] } })),
      { ...x.s, hechos: { pagos: [ps[0]!] } },
      { ...x.s, hechos: { pagos: [...ps, ps[1]!] } },
      { ...x.s, auxiliares: { ...a, regimenPagos: "gananciales" } },
      { ...x.s, auxiliares: { ...a, centros: a.centros.map(c => ({ ...c, autorizacion: "otra" })) } },
      { ...x.s, auxiliares: { ...a, servicios: a.servicios.map(s => ({ ...s, periodo: { ...s.periodo, desde: "2025-01-02" } })) } },
    ]
    for (const s of variantes) expect(Effect.runSync(Effect.flip(ejecutar(api, x.h, s)))._tag).toBe("ResultadoNoSoportado")
    const h = { ...x.h, hijos: x.h.hijos.map(n => ({ ...n, convivencia: "cambio_o_custodia_especial" as const })) }
    expect(Effect.runSync(Effect.flip(ejecutar(api, h, x.s)))._tag).toBe("ResultadoNoSoportado")
  })
}
