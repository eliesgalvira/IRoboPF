import { describe, expect, it } from "@effect/vitest"
import { Effect, Result, Schema } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { producirInmueblesP4a } from "../lib/dominio/irpf/inmobiliario-2025/productor"
import { CasoInmobiliarioP4a, type InmuebleP4a } from "../lib/dominio/irpf/inmobiliario-2025/contrato"
import { casoExtVacia } from "./ext-vacia.fixtures"
import oraculos from "./ext-vacia-oraculos.json"
const modificar = (f: (v: InmuebleP4a) => InmuebleP4a): CasoInmobiliarioP4a => {
  const c = casoExtVacia(); return { ...c, inmuebles: c.inmuebles.map(f) }
}
describe("EXT vivienda vacía: candidato pendiente de validación y revisión independiente", () => {
  for (const o of oraculos.filter(x => x.rnr !== "0")) it.effect("Fraction: " + o.ingreso + "; ambasAPI y cuota única", () => Effect.gen(function* () {
    const c = casoExtVacia(o.ingreso)
    const p = yield* producirInmueblesP4a(c), v = p.inmuebles[0]
    if (v === undefined) throw new Error("sin inmueble")
    expect(v.neto.n).toBe(BigInt(o.neto) * v.neto.d)
    expect(v.netoReducido.n).toBe(BigInt(o.rnr) * v.netoReducido.d)
    expect(v.amortizacion.n).toBe(BigInt(o.amortizacion) * v.amortizacion.d)
    const previa = v.comprobacionVacia2024
    if (previa === undefined) throw new Error("sin comprobación2024")
    expect(previa.dias).toBe(366)
    expect(previa.imputacion.n).toBe(660n * previa.imputacion.d)
    expect(p.imputacion.n).toBe(0n)
    const a = yield* liquidarIrpfAnual(c, { modo: "canonico" }), b = yield* liquidarIrpfAnualExplicito(c)
    expect(a.baseImponibleGeneral.eq(o.rnr)).toBe(true)
    expect(b.baseImponibleGeneral.eq(a.baseImponibleGeneral)).toBe(true)
    expect(b.cuotaDiferencial.eq(a.cuotaDiferencial)).toBe(true)
    const sin = yield* liquidarIrpfAnualExplicito({ ...c, deduccionesTerritoriales2025: { solicitudes: [] } })
    const total = a.composicion.deduccionesTerritoriales2025?.total
    if (total === undefined) throw new Error("sin libro territorial")
    expect(BigInt(total.numeradorEuros) <= BigInt(o.deduccion) * BigInt(total.divisor)).toBe(true)
    expect(sin.cuotaDiferencial.minus(a.cuotaDiferencial).eq(a.composicion.deduccionesAutonomicasAplicadas)).toBe(true)
    const generado = a.composicion.deduccionesTerritoriales2025?.aplicaciones[0]?.generado
    if (generado === undefined) throw new Error("sin generación")
    expect(BigInt(generado.numeradorEuros)).toBe(BigInt(o.deduccion) * BigInt(generado.divisor))
    const disponible = sin.composicion.cuotaAutonomicaGeneralDespuesMinimo
    expect(a.composicion.deduccionesAutonomicasAplicadas.eq(disponible.lt(o.deduccion) ? disponible : o.deduccion)).toBe(true)
    expect(b.composicion.deduccionesAutonomicasAplicadas.eq(a.composicion.deduccionesAutonomicasAplicadas)).toBe(true)
    expect(a.seguimiento.length).toBeGreaterThan(0)
  }))
  for (const [vigor, procedimiento, esperado] of [["2011-12-31", "colectivo-general", 1200n], ["2012-01-01", "colectivo-general", 660n], ["2014-01-01", "otro", 1200n]] as const) it.effect("ventana2024 " + vigor + procedimiento, () => Effect.gen(function* () {
    const c = modificar(v => ({ ...v, vaciaExt2025: v.vaciaExt2025 === undefined ? undefined : { ...v.vaciaExt2025, catastro2024: { ...v.vaciaExt2025.catastro2024, entradaVigor: vigor, procedimiento } } }))
    // La notificación es independiente, anterior a la entrada en vigor.
    const p = yield* producirInmueblesP4a(c), q = p.inmuebles[0]?.comprobacionVacia2024?.imputacion
    if (q === undefined) throw new Error("sin2024")
    expect(q.n).toBe(esperado * q.d)
  }))
  const cambiarPrimarios = (f: (p: NonNullable<InmuebleP4a["vaciaExt2025"]>) => NonNullable<InmuebleP4a["vaciaExt2025"]>) => modificar(v => {
    if (v.vaciaExt2025 === undefined) throw new Error("fixture sin primarios")
    return { ...v, vaciaExt2025: f(v.vaciaExt2025) }
  })
  const primeraObservacion = (p: NonNullable<InmuebleP4a["vaciaExt2025"]>) => {
    const h = p.observaciones2024[0]
    if (h === undefined) throw new Error("fixture sin observación")
    return h
  }
  const primariosAdversos = [
    () => cambiarPrimarios(p => ({ ...p, observaciones2024: p.observaciones2024.map(h => ({ ...h, desde: "2024-01-02" })) })),
    () => cambiarPrimarios(p => ({ ...p, observaciones2024: [...p.observaciones2024, ...p.observaciones2024] })),
    () => cambiarPrimarios(p => ({ ...p, observaciones2024: [{ ...primeraObservacion(p), desde: "2024-01-01", hasta: "2024-02-28" }, { ...primeraObservacion(p), desde: "2024-03-01", hasta: "2024-12-31" }] })),
    () => cambiarPrimarios(p => ({ ...p, censoDerechos: { ...p.censoDerechos, inmuebles: ["V1", "OTRA"] } })),
    () => cambiarPrimarios(p => ({ ...p, censoDerechos: { ...p.censoDerechos, inmuebles: ["V1", "V1"] } })),
    () => cambiarPrimarios(p => ({ ...p, catastro2024: { ...p.catastro2024, notificacion: "2024-01-02" } })),
    () => cambiarPrimarios(p => ({ ...p, catastro2024: { ...p.catastro2024, entradaVigor: "2024-02-30" } })),
    () => cambiarPrimarios(p => ({ ...p, catastro2024: { ...p.catastro2024, suelo: "0", construccion: "0" } })),
    () => cambiarPrimarios(p => ({ ...p, procedimientos: [{ fecha: "2025-06-01", documento: "REG", objeto: "deduccion", resultado: "regularizacion" }] })),
    () => cambiarPrimarios(p => ({ ...p, observacion2025: { ...p.observacion2025, arrendatario: "otro" } })),
  ]
  for (const [i, crear] of primariosAdversos.entries()) it.effect("primarios adversos ambasAPI " + i, () => Effect.gen(function* () {
    const c = crear()
    const a = yield* Effect.flip(liquidarIrpfAnual(c, { modo: "canonico" })), b = yield* Effect.flip(liquidarIrpfAnualExplicito(c))
    expect(a._tag).toBe("RechazoP4a"); expect(b._tag).toBe("RechazoP4a")
  }))
  it("esquema cerrado: usufructo, uso, exenciones y magnitudes no entran como hechos válidos", () => {
    const c = casoExtVacia(), v = c.inmuebles[0]
    if (v === undefined || v.vaciaExt2025 === undefined) throw new Error("fixture vacía")
    for (const inmueble of [
      { ...v, derecho: "usufructo" },
      { ...v, vaciaExt2025: { ...v.vaciaExt2025, naturaleza: "en-construccion" } },
      { ...v, vaciaExt2025: { ...v.vaciaExt2025, observaciones2024: [{ desde: "2024-01-01", hasta: "2024-12-31", documento: "USO", ocupacion: "habitual", afectacion: "ninguna", obras: "ninguna", impedimentoUrbanistico: "ninguno" }] } },
      { ...v, vaciaExt2025: { ...v.vaciaExt2025, importeImputado: "660" } },
    ]) expect(Result.isFailure(Schema.decodeUnknownResult(CasoInmobiliarioP4a)({ ...c, inmuebles: [inmueble] }, { onExcessProperty: "error" }))).toBe(true)
  })
  const adversos = [
    () => modificar(v => ({ ...v, vaciaExt2025: undefined })),
    () => modificar(v => ({ ...v, contrato: { ...v.contrato, firma: "2025-01-02" } })),
    () => modificar(v => ({ ...v, contrato: { ...v.contrato, hasta: "2027-12-31" } })),
    () => modificar(v => ({ ...v, ubicacion: "resto-espana" })),
    () => modificar(v => ({ ...v, titulares: [v.titular, "otro"] })),
    () => modificar(v => ({ ...v, usosDesdeAdquisicion: v.usosDesdeAdquisicion.map(u => u.hasta < "2025-01-01" ? { ...u, uso: "personal" } : u) })),
    () => modificar(v => ({ ...v, gastos: [...v.gastos, ...v.gastos] })),
    () => modificar(v => ({ ...v, exigibilidades: [...v.exigibilidades, ...v.exigibilidades] })),
    () => casoExtVacia("3400"),
    () => modificar(v => ({ ...v, importeImputado2024: "660" })),
    () => modificar(v => ({ ...v, cumpleVacia: true })),
    () => modificar(v => ({ ...v, rendimientoNetoReducido: "16300" })),
    () => { const c = casoExtVacia(); return { ...c, inmuebles: [...c.inmuebles, ...c.inmuebles] } },
  ]
  for (const [i, crear] of adversos.entries()) it.effect("ambasAPI rechazan " + i, () => Effect.gen(function* () {
    const c = crear()
    const a = yield* Effect.flip(liquidarIrpfAnual(c, { modo: "canonico" })), b = yield* Effect.flip(liquidarIrpfAnualExplicito(c))
    expect(a._tag).toBe("RechazoP4a"); expect(b._tag).toBe("RechazoP4a")
  }))
  for (const dias of [365, 367]) it.effect("diasVaciaAntes no conciliados " + dias, () => Effect.gen(function* () {
    const c = casoExtVacia()
    const entrada = { ...c, deduccionesTerritoriales2025: { solicitudes: [{ lote: "D51" as const, codigo: "extremadura_arrendadores_viviendas_vacias" as const, hechos: { exhaustividad: "completa" as const, viviendas: [{ id: "V1", diasVaciaAntes: dias, inicioContrato: "2025-01-01", finContrato: "2028-01-01", destino: "habitual" as const }] } }] } }
    const a = yield* Effect.flip(liquidarIrpfAnual(entrada, { modo: "canonico" })), b = yield* Effect.flip(liquidarIrpfAnualExplicito(entrada))
    expect(a._tag).toBe(b._tag)
  }))

})
