import { producirNodosFiscalesB2025 } from "../lib/dominio/irpf/deducciones/b-ampliado-anual-2025/productores"
import { describe, expect, it } from "vitest"
import { Effect, Result, Schema } from "effect"
import Decimal from "decimal.js"
import { HistoriaTrasladoCLM, producirBaseInicialTrasladoCLM } from "../lib/dominio/irpf/deducciones/clm-traslado-historia-2025"
import { SolicitudDeduccionesTerritoriales2025, aplicarDeduccionesTerritoriales2025, type MagnitudesTerritorialesAnuales as M } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito, type CasoFiscalAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import oracle from "./fixtures/b10-revision-oraculo.json"
import type { GastosTrabajo } from "../lib/dominio/irpf/trabajo-anual/contrato"
const D = Decimal.clone({ precision: 200 })
function trabajo(anio: number, bruto = "23000", ss = "0") {
  return { ejercicio: anio, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna", rendimientos: [{ id: "nomina-A", clase: "empleo-laboral", integro: bruto, cotizaciones: { clase: "efectivas", seguridadSocial: ss, derechosPasivos: "0", colegiosHuerfanos: "0" }, sindicato: { importe: "0", satisfecho: "no" }, colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" }, defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" } }] }
}
function origen(bruto = "23000", ss = "0") {
  return { contribuyente: "titular-A", referencia: "exp-A", ejercicio: 2024, modalidad: "individual", primerEjercicioAplicacion: 2024, residenteComunTodoEjercicio: true, vivoTodoEjercicio: true, otrasRentas: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", censoRentasCompleto: true, trabajo: trabajo(2024, bruto, ss), certificados: [{ rendimiento: "nomina-A", titular: "titular-A", pagador: "empresa-A", referencia: "cert-A", ejercicio: 2024, integro: bruto, seguridadSocial: ss, derechosPasivos: "0", colegiosHuerfanos: "0" }], traslado: { persona: "titular-A", fecha: "2024-02-29", viviendaAnterior: "inmueble-A", viviendaNueva: "inmueble-B", municipio: "02001", categoria: "intensa", soporteClasificacion2024: "clasif-2024", soporteClasificacion2025: "clasif-2025", causa: "trabajo", soporteLaboral: "contrato-A", residenciaDesde: "2024-02-29", residenciaHasta: "2025-12-31", soporteResidencia: "padron-A", sinInterrupciones: true, seguimiento: "pendiente-hasta-2027-12-31", gastos: [{ id: "factura-A", pagador: "titular-A", fecha: "2024-02-29", importe: "80", soporte: "documento-A" }], otrosIncentivosMismoGasto: "ninguno" } }
}
type H = ReturnType<typeof origen>
function solicitud(h = origen()) {
  const raw = { solicitudes: [{ lote: "D51", codigo: "clm_traslado_vivienda_habitual", historiaTrasladoCLM: h, hechos: { fechaTraslado: h.traslado.fecha, categoria: h.traslado.categoria, causa: h.traslado.causa, exhaustividad: "completa" } }] }
  const r = Schema.decodeUnknownResult(SolicitudDeduccionesTerritoriales2025)(raw, { onExcessProperty: "error" })
  if (Result.isFailure(r)) throw new Error(String(r.failure))
  return r.success
}
type S = ReturnType<typeof solicitud>
const familia = { tipo: "individual" as const, edad: 40, discapacidad: { _tag: "SinDiscapacidad" as const }, descendientes: [], ascendientes: [] }
function marco(cuota = "1000"): M { return { caso: { anio: 2025, comunidadAutonoma: "castilla-la-mancha", contribuyenteId: "titular-A", situacionFamiliar: familia }, baseGeneral: new D(28000), baseAhorro: new D(0), minimoPersonalFamiliar: new D(5550), cuotaAutonomica: new D(cuota), nodosFiscalesB2025: producirNodosFiscalesB2025("titular-A", new D(28000), new D(cuota), new D(cuota), "solo-trabajo"), sujetosConMinimo: [], basesLiquidables: { general: new D(28000), ahorro: new D(0) }, rentasTrabajoAnuales: { integroTrabajo: new D(30000), restoRentas: new D(0) } } }
function base(h: H) { const d = Schema.decodeUnknownResult(HistoriaTrasladoCLM)(h, { onExcessProperty: "error" }); if (Result.isFailure(d)) throw new Error(String(d.failure)); return producirBaseInicialTrasladoCLM(d.success, { fechaTraslado: h.traslado.fecha, categoria: h.traslado.categoria, causa: h.traslado.causa }, marco()) }
function racional(r: { numeradorEuros: string; divisor: string } | undefined, n: string, d = "1") { expect(r).toBeDefined(); if (r === undefined) throw new Error("racional ausente"); expect(BigInt(r.numeradorEuros) * BigInt(d)).toBe(BigInt(n) * BigInt(r.divisor)) }
function clasico(s: S): CasoFiscalAnual { return { anio: 2025, comunidadAutonoma: "castilla-la-mancha", contribuyenteId: "titular-A", situacionFamiliar: familia, rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] }, reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0, deduccionesTerritoriales2025: s } }
function efectivo(s: S) {
  // Decodificación pública del anual hará la validación de las cadenas de hechos.
  return { ejercicio: 2025, comunidadAutonoma: "castilla-la-mancha", contribuyenteId: "titular-A", edad: 40, modalidad: "individual", residenciaTodoElAnio: true, devengo: "2025-12-31", otrasRentas: "ninguna", familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: s, rentasExtranjeras: "ninguna", especialidades: "ninguna", perfil: "solo-trabajo", conciliacion: { ejercicio: 2025, estado: "totales-anuales-sin-duplicados", procedencia: ["cert-A"] }, trabajo: { ...trabajo(2025, "30000"), territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna", rendimientos: trabajo(2025, "30000").rendimientos.map((r): GastosTrabajo["rendimientos"][number] => ({ ...r, clase: "empleo-laboral", cotizaciones: { ...r.cotizaciones, clase: "efectivas" }, sindicato: { ...r.sindicato, satisfecho: "no" }, colegio: { ...r.colegio, satisfecho: "no", obligatorio: "no", finesEsenciales: "no" }, defensa: { ...r.defensa, satisfecho: "no", litigioDirectoPagador: "no" } })) }, retenciones: [] } satisfies CasoFiscalAnualExplicito
}
for (const c of oracle.casos) it(`oráculo primario independiente ${c.id}`, () => {
  const h = origen(c.bruto, c.ss)
  h.trabajo.rendimientos[0].sindicato = { importe: c.sindicato, satisfecho: c.sindicato === "0" ? "no" : "si" }
  h.trabajo.rendimientos[0].colegio = { importe: c.colegio, satisfecho: "si", obligatorio: "si", finesEsenciales: "si" }
  h.trabajo.rendimientos[0].defensa = { importe: c.defensa, satisfecho: "si", litigioDirectoPagador: "si" }
  expect(new D(base(h)).times(c.baseD).toFixed()).toBe(c.baseN)
  racional(aplicarDeduccionesTerritoriales2025(solicitud(h), marco()).total, c.generado)
})
for (const api of ["clasica", "efectiva"] as const) describe(api, () => {
  const ejecutar = (s: S) => api === "clasica" ? Effect.runSync(liquidarIrpfAnual(clasico(s), { modo: "canonico" })) : Effect.runSync(liquidarIrpfAnualExplicito(efectivo(s)))
  for (const [bruto, esperado] of [["24945.99", "500"], ["24946", "0"], ["24946.01", "0"], ["30000", "0"]]) it(`origen ${bruto}; actual alto no sustituye origen`, () => racional(ejecutar(solicitud(origen(bruto))).deduccionesTerritoriales2025?.total, esperado))
  it("una sola aplicación respecto al anual sin solicitud", () => {
    const s = solicitud(), r = ejecutar(s), sin = api === "clasica" ? Effect.runSync(liquidarIrpfAnual({ ...clasico(s), deduccionesTerritoriales2025: undefined }, { modo: "canonico" })) : Effect.runSync(liquidarIrpfAnualExplicito({ ...efectivo(s), deducciones: "solo-da61-si-procede", deduccionesTerritoriales2025: undefined }))
    expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(1)
    racional(r.deduccionesTerritoriales2025?.total, "500")
    // El libro racional del territorial es la evidencia; el resto de salida depende del contrato anual.
    expect(sin.deduccionesTerritoriales2025?.aplicaciones ?? []).toHaveLength(0)
  })
  it("identidad falsa: error tipado sin importe", () => {
    const h = origen(); h.certificados[0].titular = "otro"
    const e = api === "clasica" ? Effect.runSync(Effect.flip(liquidarIrpfAnual(clasico(solicitud(h)), { modo: "canonico" }))) : Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(efectivo(solicitud(h)))))
    expect(e._tag).toBe("ResultadoNoSoportado"); expect("importe" in e).toBe(false)
  })
})
for (const q of ["0", "20.079", "499.999", "500", "1000"]) it(`libro único cuota ${q}`, () => {
  const r = aplicarDeduccionesTerritoriales2025(solicitud(), marco(q)), n = new D(q), aplicado = D.min(500, n)
  racional(r.total, aplicado.times(1000).toFixed(0), "1000")
  racional(r.disponible, n.minus(aplicado).times(1000).toFixed(0), "1000")
})
it("código repetido se rechaza", () => { const s = solicitud(); expect(() => aplicarDeduccionesTerritoriales2025({ solicitudes: [...s.solicitudes, ...s.solicitudes] }, marco())).toThrow(/duplicado/i) })
for (const [id, mutar] of Object.entries({
  titular: (h: H) => { h.contribuyente = "otro" },
  certificado: (h: H) => { h.certificados[0].seguridadSocial = "1" },
  ejercicio: (h: H) => { h.certificados[0].ejercicio = 2025 },
  ausente: (h: H) => { h.certificados = [] },
  duplicado: (h: H) => { h.certificados.push({ ...h.certificados[0] }) },
  residencia: (h: H) => { h.traslado.residenciaDesde = "2024-03-01" },
  continuidad: (h: H) => { h.traslado.sinInterrupciones = false },
  vivienda: (h: H) => { h.traslado.viviendaNueva = h.traslado.viviendaAnterior },
  fecha: (h: H) => { h.traslado.fecha = "2024-02-30" },
  vencido: (h: H) => { h.traslado.fecha = "2023-12-31" },
  gasto: (h: H) => { h.traslado.gastos[0].importe = "-1" },
  ssNegativa: (h: H) => { h.trabajo.rendimientos[0].cotizaciones.seguridadSocial = "-1" },
  pagoAjeno: (h: H) => { h.traslado.gastos[0].pagador = "otro" },
  incompleto: (h: H) => { h.censoRentasCompleto = false },
  incentivo: (h: H) => { h.traslado.otrosIncentivosMismoGasto = "si" },
  inicio2025: (h: H) => { h.primerEjercicioAplicacion = 2025 },
  rentaMixta: (h: H) => { h.otrasRentas = "hay" },
})) it(`rechazo técnico sin fabricar cero: ${id}`, () => { const h = origen(); mutar(h); expect(() => aplicarDeduccionesTerritoriales2025(solicitud(h), marco())).toThrow() })
it("no admite magnitudes externas ni ayudas no representadas", () => {
  const conBaseExterna = { ...origen(), baseLiquidable: "0" }
  const conAyudaAjena = { ...origen(), ayudas: [{ importe: "80", exenta: true }] }
  expect(() => solicitud(conBaseExterna)).toThrow()
  expect(() => solicitud(conAyudaAjena)).toThrow()
})
it("caracterización: pagador certificado no está vinculado a una fuente salarial", () => {
  const a = origen(), b = origen(); b.certificados[0].pagador = "empresa-inventada"
  expect(base(b)).toBe(base(a)) // B10-R2: observación estática pendiente de runtime, no aceptación fiscal.
})
it("caracterización: municipio INE inexistente sólo se comprueba sintácticamente", () => {
  const h = origen(); h.traslado.municipio = "99999"; expect(base(h)).toBe(base(origen()))
})
it("B10-R1: pérdidas y rentas que se cancelan no acreditan perfil sólo salarial", () => {
  const c = clasico(solicitud())
  const e = Effect.runSync(Effect.result(liquidarIrpfAnual({ ...c, rendimientos: { ...c.rendimientos, capitalInmobiliario: [{ importeIntegroCentimos: 100000 }], gananciasPatrimoniales: [{ importeGananciaCentimos: -100000, tratamientoMayores65: { _tag: "SinExencionMayores65" } }] } }, { modo: "canonico" })))
  expect(Result.isFailure(e), Result.isSuccess(e) ? JSON.stringify(e.success.deduccionesTerritoriales2025?.total) : "rechazo").toBe(true)
  if (Result.isFailure(e)) expect(e.failure._tag).toBe("ResultadoNoSoportado")
})

for (const dia of ["2024-01-01", "2024-02-29", "2024-12-31"]) it(`frontera civil válida ${dia}`, () => { const h = origen(); h.traslado.fecha = dia; h.traslado.residenciaDesde = dia; h.traslado.gastos[0].fecha = dia; racional(aplicarDeduccionesTerritoriales2025(solicitud(h), marco()).total, "500") })
it("dos empleos: generales2000 y límites colegio500/defensa300 son anuales", () => {
  const h = origen("12500"); const r = h.trabajo.rendimientos[0]
  r.colegio = { importe: "400", satisfecho: "si", obligatorio: "si", finesEsenciales: "si" }; r.defensa = { importe: "200", satisfecho: "si", litigioDirectoPagador: "si" }
  h.trabajo.rendimientos.push({ ...r, id: "nomina-B" }); h.certificados.push({ ...h.certificados[0], rendimiento: "nomina-B", referencia: "cert-B", pagador: "empresa-B" })
  expect(base(h)).toBe("22200") // 25000 -500 -300 -2000; art20=0.
})
for (const api of ["clasica", "efectiva"] as const) it(`${api}: cuota interna cero`, () => {
  const s = solicitud(), c = clasico(s), e = efectivo(s)
  if (e.perfil !== "solo-trabajo") throw new Error("fixture salarial")
  const r = api === "clasica" ? Effect.runSync(liquidarIrpfAnual({ ...c, rendimientos: { trabajo: [{ importeIntegroCentimos: 1000000 }] } }, { modo: "canonico" })) : Effect.runSync(liquidarIrpfAnualExplicito({ ...e, trabajo: { ...e.trabajo, rendimientos: e.trabajo.rendimientos.map(x => ({ ...x, integro: "10000" })) } }))
  racional(r.deduccionesTerritoriales2025?.total, "0")
})

it("B10-R4: pérdida histórica no se disfraza de base cero en perfil sin saldos", () => {
  expect(() => base(origen("100", "200"))).toThrow(/negativ|pérdida|saldo/i)
})
