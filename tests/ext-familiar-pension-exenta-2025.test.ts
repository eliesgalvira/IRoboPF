import { DerechosMinimosAnuales } from "../lib/dominio/irpf/minimos/derechos-contrato"
import { describe, expect, it } from "vitest"
import { Effect, Schema } from "effect"
import Decimal from "decimal.js"
import { SolicitudDeduccionesTerritoriales2025, aplicarDeduccionesTerritoriales2025, type MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { HechosFamiliarExentoExt2025 } from "../lib/dominio/irpf/deducciones/ext-familiar-contrato-2025"
import { producirObligacionPatrimonioFamiliar2025, producirRentaExentaFamiliar2025 } from "../lib/dominio/irpf/deducciones/ext-familiar-productor-2025"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito, type CasoFiscalAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import type { CensoBasesFamiliares2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import fixture from "./ext-familiar-fixture.json"
import oraculos from "./ext-familiar-oraculos.json"
type S = typeof SolicitudDeduccionesTerritoriales2025.Type
const D = Decimal.clone({ precision: 200 })
const hechos = (datos: Schema.Json) => Schema.decodeUnknownSync(HechosFamiliarExentoExt2025)(datos, { onExcessProperty: "error" })
const solicitud = (datos: Schema.Json): S => Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({ solicitudes: [{ lote: "D51", codigo: "extremadura_cuidado_familiares_discapacidad", hechos: datos }] }, { onExcessProperty: "error" })
function clasico(s: S): CasoFiscalAnual { return {
  anio: 2025, comunidadAutonoma: "extremadura", contribuyenteId: "s-1", situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] },
  rendimientos: { trabajo: [{ importeIntegroCentimos: 2000000 }] }, reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0, deduccionesTerritoriales2025: s,
} }
function explicito(s: S): Extract<CasoFiscalAnualExplicito, { ejercicio: 2025; perfil: "solo-trabajo" }> { return {
  ejercicio: 2025, comunidadAutonoma: "extremadura", contribuyenteId: "s-1", edad: 40, modalidad: "individual", residenciaTodoElAnio: true, devengo: "2025-12-31", otrasRentas: "ninguna", familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: s, rentasExtranjeras: "ninguna", especialidades: "ninguna", perfil: "solo-trabajo", conciliacion: { ejercicio: 2025, estado: "totales-anuales-sin-duplicados", procedencia: ["certificado"] },
  trabajo: { ejercicio: 2025, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna", rendimientos: [{ id: "r", clase: "empleo-laboral", integro: "20000", cotizaciones: { clase: "efectivas", seguridadSocial: "0", derechosPasivos: "0", colegiosHuerfanos: "0" }, sindicato: { importe: "0", satisfecho: "no" }, colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" }, defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" } }] }, retenciones: [],
} }
function marco(cuota = "1000", base = "18000"): MagnitudesTerritorialesAnuales { return {
  caso: clasico(Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({ solicitudes: [] })), baseGeneral: new D(base), baseAhorro: new D(0), minimoPersonalFamiliar: new D(5550), cuotaAutonomica: new D(cuota), sujetosConMinimo: [],
} }
function igual(r: { numeradorEuros: string; divisor: string } | undefined, n: string, d = "1") {
  if (r === undefined) throw new Error("Sin generación exacta D51")
  expect(BigInt(r.numeradorEuros) * BigInt(d)).toBe(BigInt(n) * BigInt(r.divisor))
}
function escenario(o: typeof oraculos[number]) {
  const h = structuredClone(fixture)
  const p = h.familiar.economia.prestaciones[0], c = h.familiar.patrimonio.cuentas[0], t = h.parientes[0]
  if (p === undefined || c === undefined || t === undefined || p.cobros[0] === undefined) throw new Error("Fixture incompleta")
  p.cobros[0].importe = o.renta
  c.saldo30Septiembre = c.saldo31Diciembre = o.saldo
  c.diarioQ4.forEach(d => { d.saldoCierre = o.saldo })
  h.familiar.discapacidad.grado = o.grado
  // 01/01 inclusivo +182 días =02/07; +181 =01/07. Independiente del candidato.
  t.convivencia.fin = o.dias === 182 ? "2025-07-01" : o.dias === 183 ? "2025-07-02" : "2025-12-31"
  const extras = Array.from({ length: o.titulares - 1 }, (_, i) => ({ ...structuredClone(t), id: "s-" + (i + 3), economia: { perfil: "sin-rentas", censoCompleto: true, soporte: fixture.soporteCensoLineal } }))
  const dependencia = o.ayuda ? { situacion: "reconocida-no-cobrada", importeMensualReconocido: "100", evaluacionSocial: fixture.soporteCensoLineal, resolucion: fixture.soporteCensoLineal, efectosDesde: "2025-01-01", cobrosHastaDevengo: [], censoCobrosCompleto: true } : h.familiar.dependencia
  return { ...h, parientes: [...h.parientes, ...extras], familiar: { ...h.familiar, dependencia } }
}
for (const api of ["canonica", "explicita"] as const) describe(api, () => {
  it("rechaza el censo de bases comunes fuera de su ámbito territorial", () => {
    const censo: CensoBasesFamiliares2025 = {
      referencia: "censo-ausencia", ejercicio: 2025, devengo: "2025-12-31", contribuyente: "s-1",
      estadoCivil: "sin-vinculo", censoCompleto: true, hijosCompletos: true, hijos: [],
      personas: [
        { id: "s-1", soporte: "declarante", residenteComunTodo2025: true, vivoTodo2025: true, economia: { perfil: "declarante-en-composicion" } },
        { id: fixture.familiar.id, soporte: "ausencia", residenteComunTodo2025: true, vivoTodo2025: true, economia: { perfil: "sin-rentas", censoRentasCompleto: true } },
      ],
    }
    const s = solicitud(fixture)
    const r = api === "canonica"
      ? Effect.runSync(Effect.flip(liquidarIrpfAnual({ ...clasico(s), basesFamiliares2025: censo }, { modo: "canonico" })))
      : Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito({ ...explicito(s), basesFamiliares2025: censo })))
    expect(r.motivo).toMatch(/Bases familiares: identidad\/ejercicio\/residencia\/fallecimiento incompatible/)
  })
  for (const o of oraculos) it(o.id + ": oráculo Fraction propio, sin mínimo", () => {
    const s = solicitud(escenario(o))
    const r = api === "canonica" ? Effect.runSync(liquidarIrpfAnual(clasico(s), { modo: "canonico" })) : Effect.runSync(liquidarIrpfAnualExplicito(explicito(s)))
    igual(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado, o.importe.n, o.importe.d)
  })
  it("ausencia expresa de rentas produce150 sin exigir mínimo", () => {
    const h = structuredClone(fixture), s = solicitud({ ...h, familiar: { ...h.familiar, economia: { perfil: "sin-rentas", censoCompleto: true, soporte: h.soporteCensoLineal } } })
    const r = api === "canonica" ? Effect.runSync(liquidarIrpfAnual(clasico(s), { modo: "canonico" })) : Effect.runSync(liquidarIrpfAnualExplicito(explicito(s)))
    igual(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado, "150")
  })
  for (const clase of ["mutualidad", "privada", "extranjero"]) it("rechazo con causa:" + clase, () => {
    const h = structuredClone(fixture)
    h.familiar.economia.prestaciones.forEach(p => { p.organismo = clase })
    const s = solicitud(h)
    const e = api === "canonica" ? Effect.runSync(Effect.flip(liquidarIrpfAnual(clasico(s), { modo: "canonico" }))) : Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(explicito(s))))
    expect(e.motivo).toMatch(/sólo SS pública/); expect("importe" in e).toBe(false)
  })
  for (const estado of ["presentes", "desconocidas"]) it("otras rentas:" + estado, () => {
    const h = structuredClone(fixture); h.familiar.economia.otrasRentasSujetas = estado
    const s = solicitud(h)
    const e = api === "canonica" ? Effect.runSync(Effect.flip(liquidarIrpfAnual(clasico(s), { modo: "canonico" }))) : Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(explicito(s))))
    expect(e.motivo).toMatch(/otras rentas.*mezcla/)
  })
})
it("cuota única: agotamiento exacto y cuota cero", () => {
  for (const cuota of ["0", "100", "149.99", "150"]) {
    const r = aplicarDeduccionesTerritoriales2025(solicitud(fixture), marco(cuota))
    igual(r.total, new D(cuota).times(100).toFixed(0), "100")
    igual(r.aplicaciones[0]?.generado, "150")
  }
})
it("frontera propia19000/19000.01 y población3000", () => {
  igual(aplicarDeduccionesTerritoriales2025(solicitud(fixture), marco("1000", "19000")).total, "150")
  igual(aplicarDeduccionesTerritoriales2025(solicitud(fixture), marco("1000", "19000.01")).total, "0")
  const h = structuredClone(fixture); h.parientes.forEach(t => { t.poblacionMunicipio = 2999 })
  expect(() => solicitud(h)).toThrow()
})
it("exenta íntegra no descuenta art19/20", () => {
  expect(producirRentaExentaFamiliar2025(hechos(fixture).familiar.economia).rentasIncluidasExentas).toBe("16800")
})
it("IP bruto incluye vivienda exenta y no resta financiación; tres valores", () => {
  const r = producirObligacionPatrimonioFamiliar2025(hechos(fixture).familiar.patrimonio)
  expect(BigInt(r.brutoCentimosNumerador)).toBe(13000000n * BigInt(r.brutoDivisor))
  expect(r.obligacionPatrimonio).toBe("no")
})
it("mediaQ4 exacta mayor que saldo final", () => {
  const h = structuredClone(fixture), c = h.familiar.patrimonio.cuentas[0]
  if (c === undefined || c.diarioQ4[91] === undefined) throw new Error("Diario ausente")
  c.saldo30Septiembre = "2000000"; c.saldo31Diciembre = "0"
  c.diarioQ4.forEach(d => { d.saldoCierre = "2000000" })
  const diarioQ4 = c.diarioQ4.map((d, i) => i === 91 ? { fecha: "2025-12-31", saldoCierre: "0", movimientos: [{ id: "salida1", sentido: "salida", importe: "2000000", causa: "consumo", referencia: "gasto" }] } : d)
  const datos = { ...h, familiar: { ...h.familiar, patrimonio: { ...h.familiar.patrimonio, cuentas: [{ ...c, diarioQ4 }] } } }
  expect(producirObligacionPatrimonioFamiliar2025(hechos(datos).familiar.patrimonio).obligacionPatrimonio).toBe("si")
})
for (const mutacion of ["saldo", "fecha", "duplicado", "identidad", "dependencia", "grado-pension", "exentas-desconocidas"]) it("rechazo:" + mutacion, () => {
  const h = structuredClone(fixture), c = h.familiar.patrimonio.cuentas[0]
  if (c === undefined || c.diarioQ4[0] === undefined) throw new Error("Diario ausente")
  if (mutacion === "saldo") c.diarioQ4[0].saldoCierre = "9999"
  if (mutacion === "fecha") c.diarioQ4[0].fecha = "2025-02-30"
  if (mutacion === "duplicado") h.familiar.patrimonio.cuentas.push(c)
  if (mutacion === "identidad") c.titular = "s-3"
  if (mutacion === "grado-pension") h.familiar.economia.prestaciones.forEach(p => { p.grado = "total" })
  if (mutacion === "exentas-desconocidas") h.familiar.economia.otrasExentas = "desconocidas"
  const datos = mutacion === "dependencia" ? { ...h, familiar: { ...h.familiar, dependencia: { situacion: "reconocida-no-cobrada", importeMensualReconocido: "100", evaluacionSocial: h.soporteCensoLineal, resolucion: { ...h.soporteCensoLineal, fecha: "2026-01-01" }, efectosDesde: "2025-01-01", cobrosHastaDevengo: [], censoCobrosCompleto: true } } } : h
  expect(() => aplicarDeduccionesTerritoriales2025(solicitud(datos), marco())).toThrow(/EXT familiar/)
})
it("ausencia de economía no es cero", () => {
  const { economia: omitida, ...familiar } = fixture.familiar
  expect(omitida.perfil).toBe("pension-ss-incapacidad")
  expect(() => solicitud({ ...fixture, familiar })).toThrow()
})
it("cobro diciembre exige enlace uno a uno con diario y referencia", () => {
  const h = structuredClone(fixture), c = h.familiar.patrimonio.cuentas[0], p = h.familiar.economia.prestaciones[0]
  if (c === undefined || p === undefined || p.cobros[0] === undefined) throw new Error("Fixture incompleta")
  p.cobros[0].fecha = p.cobros[0].exigibleEl = "2025-12-31"
  const cobro = p.cobros[0]
  const diarioQ4 = c.diarioQ4.map((d, i) => i === 91 ? { ...d, movimientos: [
    { id: cobro.id, sentido: "entrada", importe: cobro.importe, causa: "pension", referencia: cobro.referenciaBancaria },
    { id: "consumo-diciembre", sentido: "salida", importe: cobro.importe, causa: "consumo", referencia: "gasto" },
  ] } : d)
  const datos = { ...h, familiar: { ...h.familiar, patrimonio: { ...h.familiar.patrimonio, cuentas: [{ ...c, diarioQ4 }] } } }
  igual(aplicarDeduccionesTerritoriales2025(solicitud(datos), marco()).total, "150")
  cobro.referenciaBancaria = "otra"
  expect(() => aplicarDeduccionesTerritoriales2025(solicitud(datos), marco())).toThrow(/no concilia/)
})
it("cobro neto descontado no se trata como íntegro exento", () => {
  const h = structuredClone(fixture)
  h.familiar.economia.prestaciones.forEach(p => p.cobros.forEach(c => { c.descuentosNomina = "1" }))
  expect(() => aplicarDeduccionesTerritoriales2025(solicitud(h), marco())).toThrow(/cobro neto/)
})
it("saldo negativo y ausencia de censo no se transforman en cero", () => {
  const h = structuredClone(fixture), c = h.familiar.patrimonio.cuentas[0]
  if (c === undefined || c.diarioQ4[0] === undefined) throw new Error("Fixture incompleta")
  c.diarioQ4[0].saldoCierre = "-0.01"
  expect(() => solicitud(h)).toThrow()
  const { otrasClases: omitidas, ...patrimonio } = fixture.familiar.patrimonio
  expect(omitidas.inmuebles).toBe("ninguno")
  expect(() => solicitud({ ...fixture, familiar: { ...fixture.familiar, patrimonio } })).toThrow()
})
it("titularidad50% se valora una sola vez; deuda no disminuye bruto", () => {
  const h = structuredClone(fixture)
  h.familiar.patrimonio.cuentas.forEach(c => { c.porcentajeBasisPoints = 5000 })
  h.familiar.patrimonio.vivienda.porcentajeBasisPoints = 5000
  const r = producirObligacionPatrimonioFamiliar2025(hechos(h).familiar.patrimonio)
  expect(BigInt(r.brutoCentimosNumerador)).toBe(6500000n * BigInt(r.brutoDivisor))
})
it("repetir solicitud no consume cuota dos veces", () => {
  const s = solicitud(fixture)
  expect(() => aplicarDeduccionesTerritoriales2025({ solicitudes: [...s.solicitudes, ...s.solicitudes] }, marco())).toThrow(/combinación|duplicado/)
})
it("conciliación con mínimo existente no admite grado/renta/identidad contradictorios", () => {
  const h = structuredClone(fixture)
  h.familiar.nacimiento = "2005-01-01"
  h.familiar.patrimonio.vivienda.plenoDominioDesde = "2005-01-01"
  h.familiar.patrimonio.vivienda.adquisicion.fecha = "2005-01-01"
  h.familiar.patrimonio.vivienda.ocupacionHabitualDesde = "2005-01-01"
  h.familiar.patrimonio.deudas.forEach(d => { d.origen = "2005-01-01" })
  h.parientes.forEach(p => { p.parentescoRespectoFamiliar = "progenitor" })
  const mm = marco()
  const derechos = {
    ejercicio: 2025, territorio: "extremadura", regimen: "comun", modalidad: "individual", devengo: "2025-12-31", contribuyenteId: "s-1", edadContribuyenteDevengo: 40,
    discapacidadContribuyente: { _tag: "SinDiscapacidad" }, ascendientes: "ninguno", fallecimientosEnElEjercicio: "ninguno", descendientesCompletos: true,
    descendientes: [{ sujetoId: "s-2", fechaNacimiento: "2005-01-01", edadDevengo: 20, vivoAlDevengo: true, rentasNoExentasCentimos: 0, declaracion: { modalidad: "no-presenta" }, discapacidad: { _tag: "Discapacidad65OMas" }, titularesCompletos: true,
      titulares: [{ titularId: "s-1", grado: 1, vinculo: { clase: "consanguinidad" }, relacion: "convivencia", custodia: "no-procede", alimentosJudiciales: false, aplicaEspecialidadAlimentos: false, residenteIrpf: true, rentasNoExentasCentimos: 1800000 }] }],
  }
  // Se usa el contrato propietario de derechos antes de preparar el marco interno.
  const minimo = Schema.decodeUnknownSync(DerechosMinimosAnuales)(derechos)
  const m = { ...mm, caso: { ...mm.caso, derechosMinimos: minimo } }
  igual(aplicarDeduccionesTerritoriales2025(solicitud(h), m).total, "150")
  const contrario = { ...minimo, descendientes: minimo.descendientes.map(d => ({ ...d, rentasNoExentasCentimos: 1 })) }
  expect(() => aplicarDeduccionesTerritoriales2025(solicitud(h), { ...m, caso: { ...m.caso, derechosMinimos: contrario } })).toThrow(/contradice/)
})
