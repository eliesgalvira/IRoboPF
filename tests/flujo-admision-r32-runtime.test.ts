// Las pruebas son entradas Effect y proporcionan explícitamente el layer real.
// @effect-diagnostics effect/strictEffectProvide:off
import { expect, it } from "vitest"
import { Effect, Result } from "effect"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import type { CasoRetencionTrabajo } from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat"
import type { DerechosMinimos2025, DescendienteDerechos } from "../lib/dominio/irpf/minimos/derechos-contrato"
import { liquidarIrpfAnual, liquidarIrpfAnualConDerechos, liquidarIrpfAnualExplicito, LiquidacionIrpfAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { calcularRetencionTrabajoAeat } from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat"
import { calcularSalarioLegacy } from "../lib/dominio/compatibilidad-legacy/calculo-salario-legacy"
import { siteIds } from "../scripts/procedencia/flujo-admision-r32.mjs"

const familiar = { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } as const
const base: CasoFiscalAnual = { anio: 2025, comunidadAutonoma: "madrid", situacionFamiliar: familiar, rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] }, reducciones: [], deducciones: [], retencionesSoportadasCentimos: 12345, pagosACuentaCentimos: 67890 }
const ret: CasoRetencionTrabajo = { anio: 2025, perfilTemporal: "cierre", retribucionAnualCentimos: 4100000, cotizacionesCentimos: 222222, situacionFamiliar: "situacion3", situacionLaboral: "activo", contrato: "general", discapacidad: "sin-discapacidad", descendientes: [], ascendientes: [] }
const hijo: DescendienteDerechos = { sujetoId: "s-2", fechaNacimiento: "2017-12-31", edadDevengo: 8, vivoAlDevengo: true, rentasNoExentasCentimos: 0, declaracion: { modalidad: "no-presenta" }, discapacidad: { _tag: "SinDiscapacidad" }, titularesCompletos: true, titulares: [{ titularId: "s-1", grado: 1, vinculo: { clase: "consanguinidad" }, relacion: "convivencia", custodia: "exclusiva", alimentosJudiciales: false, aplicaEspecialidadAlimentos: false, residenteIrpf: true, rentasNoExentasCentimos: 2605600 }] }
const derechos: DerechosMinimos2025 = { ejercicio: 2025, territorio: "madrid", regimen: "comun", modalidad: "individual", devengo: "2025-12-31", contribuyenteId: "s-1", edadContribuyenteDevengo: 40, discapacidadContribuyente: { _tag: "SinDiscapacidad" }, ascendientes: "ninguno", fallecimientosEnElEjercicio: "ninguno", descendientesCompletos: true, conciliacionRentasContribuyente: { perfil: "caso-anual-parcial", otrasRentasOGastosNoRepresentados: "ninguno" }, descendientes: [hijo] }
const annual = (caso: CasoFiscalAnual = base, modo: "canonico" | "compatible-legacy" = "canonico") => Effect.runSync(Effect.result(liquidarIrpfAnual(caso, { modo })))
const fail = (caso: CasoFiscalAnual, message: string) => {
  const r = annual(caso)
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure.motivo).toContain(message)
}
const lineIds = (rastro: { readonly pasos: ReadonlyArray<{ readonly lineasCalculo?: ReadonlyArray<{ readonly origen?: { readonly siteId: string } }> }> }) => rastro.pasos.flatMap((p) => p.lineasCalculo ?? []).map((l) => l.origen?.siteId).filter((id) => siteIds.includes(id ?? ""))

for (const modo of ["canonico", "compatible-legacy"] as const) for (const enabled of [false, true]) {
  it(`presencia real ${modo} subcaso=${enabled}`, () => {
    // SAFETY: se retira un opcional para ensayar el camino legacy sin selección temporal.
    const casoRetencion: CasoRetencionTrabajo = enabled && modo === "compatible-legacy" ? { ...ret, fechaPago: "2025-12-31" } : ret
    const caso = enabled ? { ...base, retencionTrabajoAeat: casoRetencion } : base
    if (enabled && modo === "compatible-legacy") {
      const temporal = annual(caso, modo)
      expect(Result.isFailure(temporal)).toBe(true)
      const { perfilTemporal: _temporal, ...legacy } = ret
      void _temporal
      const r = annual({ ...base, retencionTrabajoAeat: legacy }, modo)
      expect(Result.isSuccess(r)).toBe(true)
      if (Result.isSuccess(r)) expect(lineIds(r.success.rastro).sort()).toEqual([...siteIds].sort())
    } else {
      const r = annual(caso, modo)
      expect(Result.isSuccess(r)).toBe(true)
      if (Result.isSuccess(r)) expect(lineIds(r.success.rastro).sort()).toEqual(siteIds.filter((id) => enabled || !id.startsWith("anual.retencion.")).sort())
    }
  })
}
it("rechaza ejercicio antes de derechos y deducción; ConDerechos valida primero", () => {
  const badRights = { ...derechos, descendientes: [hijo, hijo] }
  const c = { ...base, derechosMinimos: badRights, deducciones: [{ codigo: "inexistente" }], retencionTrabajoAeat: { ...ret, anio: 2024 as const } }
  fail(c, "mismo ejercicio")
  const r = Effect.runSync(Effect.result(liquidarIrpfAnualConDerechos(c)))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure.motivo).toContain("duplicado")
})
for (const codigo of ["inexistente", "MAD-NACIMIENTO"]) it(`deducción ${codigo} corta antes de retención`, () => {
  fail({ ...base, deducciones: [{ codigo }], retencionTrabajoAeat: { ...ret, procedimiento: "regularizacion" } }, "Deducción")
})
it("territorio 2026 real falla; simulada alcanza sitios SS/pagos", () => {
  fail({ ...base, anio: 2026 }, "2026")
  const r = annual({ ...base, anio: 2026, comunidadAutonoma: "simulada-estatal" })
  expect(Result.isSuccess(r)).toBe(true)
})
for (const [name, patch, message] of [
  ["modo", {}, "incompatibles"],
  ["edad", { situacionFamiliar: { ...familiar, edad: 41 } }, "incompatibles"],
  ["territorio", { comunidadAutonoma: "aragon" }, "incompatibles"],
  ["familia parcial", { situacionFamiliar: { ...familiar, descendientes: [{ edad: 8, discapacidad: { _tag: "SinDiscapacidad" } }] } }, "incompatibles"],
] as const) it(`derechos compatibilidad ${name}`, () => {
  const c = { ...base, derechosMinimos: derechos, ...patch }
  const r = annual(c, name === "modo" ? "compatible-legacy" : "canonico")
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure.motivo).toContain(message)
})
for (const [name, d, message] of [
  ["duplicados", { ...derechos, descendientes: [hijo, hijo] }, "duplicado"],
  ["nacimiento", { ...derechos, descendientes: [{ ...hijo, fechaNacimiento: "2017-02-30" }] }, "Nacimiento"],
  ["titulares", { ...derechos, descendientes: [{ ...hijo, titulares: [hijo.titulares[0]!, hijo.titulares[0]!] }] }, "Titulares"],
  ["residencia", { ...derechos, descendientes: [{ ...hijo, titulares: [{ ...hijo.titulares[0]!, residenteIrpf: false }] }] }, "residente"],
  ["convivencia", { ...derechos, descendientes: [{ ...hijo, titulares: [{ ...hijo.titulares[0]!, relacion: "ninguna" }] }] }, "convivencia"],
  ["alimentos", { ...derechos, descendientes: [{ ...hijo, titulares: [{ ...hijo.titulares[0]!, alimentosJudiciales: true, custodia: "sin-custodia" }] }] }, "alimentos"],
  ["renta", { ...derechos, descendientes: [{ ...hijo, titulares: [{ ...hijo.titulares[0]!, rentasNoExentasCentimos: 3000000 }] }] }, "no concilia"],
  ["conciliacion", { ...derechos, conciliacionRentasContribuyente: undefined }, "conciliación"],
] as const) it(`derechos rechazo ${name}`, () => {
  const { conciliacionRentasContribuyente, ...without } = d
  const value: DerechosMinimos2025 = conciliacionRentasContribuyente === undefined ? without : { ...without, conciliacionRentasContribuyente }
  fail({ ...base, derechosMinimos: value }, message)
})
it("derechos coherentes alcanzan 13; renta del bruto transportada no", () => {
  const r = annual({ ...base, derechosMinimos: derechos })
  expect(Result.isSuccess(r)).toBe(true)
  if (Result.isSuccess(r)) expect(lineIds(r.success.rastro)).toHaveLength(13)
})

const retentionCases: ReadonlyArray<readonly [string, Partial<CasoRetencionTrabajo>, string]> = [
  ["edad", { edad: -1 }, "Entradas"], ["retribucion", { retribucionAnualCentimos: 0.5 }, "Entradas"],
  ["SS", { cotizacionesCentimos: -1 }, "Entradas"], ["irregular2", { irregular2Centimos: -1 }, "Entradas"],
  ["pension", { pensionCompensatoriaConyugeCentimos: NaN }, "Entradas"], ["alimentos", { anualidadesAlimentosHijosCentimos: Infinity }, "Entradas"],
  ["familiar", { situacionFamiliar: "general" }, "Entradas"], ["hijos numero", { descendientes: 1 }, "Entradas"],
  ["ascendientes numero", { ascendientes: 1 }, "Entradas"],
  ["convivencia", { ascendientes: [{ edad: 70, convivencia: 0, discapacidad: "sin-discapacidad", movilidadReducida: false }] }, "Entradas"],
  ["situacion1 sin hijos", { situacionFamiliar: "situacion1" }, "Entradas"],
  ["regularizacion", { procedimiento: "regularizacion" }, "Regularización"],
  ["fecha imposible", { fechaPago: "2025-02-30" }, "versión"],
  ["cierre y fecha", { fechaPago: "2025-12-31" }, "versión"],
  ["irregular30", { irregular1Centimos: 1230001 }, "IRREGULAR1"],
  ["irregular90000", { retribucionAnualCentimos: 50000000, irregular1Centimos: 9000001 }, "IRREGULAR1"],
  ["manuales", { contrato: "manuales" }, "Jornales"],
  ["hijo filtrado", { situacionFamiliar: "situacion1", descendientes: [{ edad: 25, discapacidad: "sin-discapacidad", computoPorEntero: true, movilidadReducida: false, adopcionOAcogimientoMenosTresAnios: false }] }, "Entradas"],
]
for (const [name, patch, message] of retentionCases) it(`subservicio ${name} y propagación anual`, () => {
  const c = { ...ret, ...patch }
  const r = Effect.runSync(Effect.result(calcularRetencionTrabajoAeat(c, { modo: "canonico" })))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure.motivo).toContain(message)
  fail({ ...base, retencionTrabajoAeat: c }, message)
})
for (const [anio, selection, success] of [
  [2016, {}, false], [2017, {}, true], [2018, {}, false], [2018, { fechaPago: "2018-07-04" }, true], [2018, { fechaPago: "2018-07-05" }, true],
  [2025, {}, false], [2025, { perfilTemporal: "cierre" }, true],
  [2026, { fechaPago: "2026-09-09" }, false], [2026, { fechaPago: "2026-09-10" }, true], [2026, { fechaPago: "2026-10-29" }, true], [2026, { fechaPago: "2026-10-30" }, false], [2026, { perfilTemporal: "cierre" }, false],
] as const) it(`versión ${anio} ${JSON.stringify(selection)}`, () => {
  const { perfilTemporal: _p, ...r } = ret
  void _p
  expect(Result.isSuccess(Effect.runSync(Effect.result(calcularRetencionTrabajoAeat({ ...r, anio, ...selection }, { modo: "canonico" }))))).toBe(success)
})
it("legacy retorna antes de irregular/manuales/versión", () => {
  const { perfilTemporal: _p, ...r } = ret
  void _p
  expect(Result.isSuccess(Effect.runSync(Effect.result(calcularRetencionTrabajoAeat({ ...r, anio: 2012, contrato: "manuales", irregular1Centimos: 9500000 }, { modo: "compatible-legacy" }))))).toBe(true)
})
it("transporte conserva subcaso independiente y pagos en campos separados", () => {
  const r = annual({ ...base, retencionTrabajoAeat: ret })
  const sub = Effect.runSync(calcularRetencionTrabajoAeat(ret, { modo: "canonico" }))
  expect(Result.isSuccess(r)).toBe(true)
  if (Result.isSuccess(r)) {
    expect(r.success.retencionesYPagosACuentaCentimos).toBe(12345 + 67890 + sub.importeRetencionAnualCentimos)
    const changed = annual({ ...base, retencionTrabajoAeat: { ...ret, retribucionAnualCentimos: 5200000 } })
    expect(Result.isSuccess(changed)).toBe(true)
    if (Result.isSuccess(changed)) expect(changed.success.cotizacionTrabajadorCentimos).toBe(r.success.cotizacionTrabajadorCentimos)
  }
})
it("servicio real alcanza sitios; wrapper público no hereda servicio anual arbitrario", () => {
  const r = Effect.runSync(Effect.gen(function* () { const service = yield* LiquidacionIrpfAnual; return yield* service.liquidar(base, { modo: "canonico" }) }).pipe(Effect.provide(LiquidacionIrpfAnual.layer)))
  expect(lineIds(r.rastro)).toHaveLength(13)
})
it("adaptador salarial real propaga rechazo temporal con perfil explícito", () => {
  const r = Effect.runSync(Effect.result(calcularSalarioLegacy({ anio: 2025, salarioBrutoAnualCentimos: 3000000, modo: "canonico", perfilAuditoria: "soltero_sin_hijos" })))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure.motivo).toContain("versión")
  expect(Effect.runSync(calcularSalarioLegacy({ anio: 2025, salarioBrutoAnualCentimos: 3000000, modo: "canonico", seleccionRetencion: { perfilTemporal: "cierre" } })).salarioBrutoAnualCentimos).toBe(3000000)
})
it("ruta explícita rechazada no devuelve estos sitios", () => {
  // @ts-expect-error entrada JS deliberadamente incompleta para comprobar el decode de la API.
  const r = Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ejercicio: 2025 })))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(lineIds(r.failure.rastro)).toEqual([])
})
it("carencia de validación: pagos negativos pasan, no inventar rechazo jurídico", () => {
  const r = annual({ ...base, pagosACuentaCentimos: -100, retencionesSoportadasCentimos: -200 })
  expect(Result.isSuccess(r)).toBe(true)
  if (Result.isSuccess(r)) expect(r.success.retencionesYPagosACuentaCentimos).toBe(-300)
})
const titular = hijo.titulares[0]!
for (const [name, desc, message] of [
  ["custodias exclusivas", { ...hijo, titulares: [titular, { ...titular, titularId: "s-4" }] }, "custodia"],
  ["renta contradictoria", { ...hijo, sujetoId: "s-3", titulares: [{ ...titular, rentasNoExentasCentimos: 0 }] }, "contradictorias"],
  ["sujeto titular", { ...hijo, titulares: [titular, { ...titular, titularId: "s-2", custodia: "no-procede" }] }, "también titular"],
  ["especialidad propia", { ...hijo, titulares: [{ ...titular, alimentosJudiciales: true, custodia: "sin-custodia", aplicaEspecialidadAlimentos: true }] }, "Especialidad"],
  ["grado adoptivo", { ...hijo, titulares: [{ ...titular, grado: 2, vinculo: { clase: "acogimiento-temporal" } }] }, "Grados"],
  ["inicio imposible", { ...hijo, titulares: [{ ...titular, vinculo: { clase: "adopcion", fechaInicioIncremento: "2025-02-30", fechaConstitucionVinculo: "2020-01-01", fundamento: "inscripcion-registro-civil", historialCompleto: true } }] }, "Fecha"],
  ["constitucion ausente", { ...hijo, titulares: [{ ...titular, vinculo: { clase: "adopcion", fechaInicioIncremento: "2025-01-01", fundamento: "inscripcion-registro-civil", historialCompleto: true } }] }, "constitución"],
  ["adulto adoptado", { ...hijo, fechaNacimiento: "2000-12-31", edadDevengo: 25, titulares: [{ ...titular, vinculo: { clase: "adopcion", fechaInicioIncremento: "2025-01-01", fechaConstitucionVinculo: "2020-01-01", fundamento: "inscripcion-registro-civil", historialCompleto: true } }] }, "mayoría"],
  ["bisiesto", { ...hijo, fechaNacimiento: "2004-02-29", edadDevengo: 21, titulares: [{ ...titular, vinculo: { clase: "adopcion", fechaInicioIncremento: "2022-02-28", fechaConstitucionVinculo: "2022-02-28", fundamento: "inscripcion-registro-civil", historialCompleto: true } }] }, "bisiesto"],
  ["grados mixtos", { ...hijo, titulares: [{ ...titular, custodia: "no-procede" }, { ...titular, titularId: "s-4", custodia: "no-procede", rentasNoExentasCentimos: 0 }, { ...titular, titularId: "s-5", custodia: "no-procede", grado: 2 }] }, "concurrencia"],
] as const) it(`clase de guarda familiar ${name}`, () => {
  const descendants: ReadonlyArray<DescendienteDerechos> = name === "renta contradictoria" ? [hijo, desc] : [desc]
  fail({ ...base, derechosMinimos: { ...derechos, descendientes: descendants } }, message)
})
it("empate nacimiento y divisor distinto falla después de conciliar renta", () => {
  const second: DescendienteDerechos = { ...hijo, sujetoId: "s-3", titulares: [{ ...titular, custodia: "compartida" }, { ...titular, titularId: "s-4", custodia: "compartida" }] }
  fail({ ...base, derechosMinimos: { ...derechos, descendientes: [hijo, second] } }, "Empate")
})
it("la entrada explícita válida usa sitios separados", () => {
  const r = Effect.runSync(liquidarIrpfAnualExplicito({ ejercicio: 2025, comunidadAutonoma: "madrid", edad: 40, modalidad: "individual", residenciaTodoElAnio: true, devengo: "2025-12-31", otrasRentas: "ninguna", familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: "solo-da61-si-procede", rentasExtranjeras: "ninguna", especialidades: "ninguna", perfil: "solo-trabajo", conciliacion: { ejercicio: 2025, estado: "totales-anuales-sin-duplicados", procedencia: ["ensayo-r32"] }, trabajo: { ejercicio: 2025, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna", rendimientos: [{ id: "t1", clase: "empleo-laboral", integro: "30000", cotizaciones: { clase: "efectivas", seguridadSocial: "2000", derechosPasivos: "0", colegiosHuerfanos: "0" }, sindicato: { importe: "0", satisfecho: "no" }, colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" }, defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" } }] }, retenciones: [] }))
  expect(r._tag).toBe("LiquidacionIrpfAnualExplicitaCalculada")
  expect(lineIds(r.rastro)).toEqual([])
})
it("proporcionar un servicio anual externo no sustituye el layer del wrapper", () => {
  const external = { liquidar: () => Effect.fail({ _tag: "ResultadoNoSoportado" as const, motivo: "inyeccion-ensayo", fuenteReconocida: "ensayo-scratch", rastro: { titulo: "ensayo", pasos: [] } }) }
  const r = Effect.runSync(Effect.result(liquidarIrpfAnual(base, { modo: "canonico" }).pipe(Effect.provideService(LiquidacionIrpfAnual, external))))
  expect(Result.isSuccess(r)).toBe(true)
  const other = Effect.runSync(Effect.result(Effect.gen(function* () { const service = yield* LiquidacionIrpfAnual; return yield* service.liquidar(base, { modo: "canonico" }) }).pipe(Effect.provideService(LiquidacionIrpfAnual, external))))
  expect(Result.isFailure(other)).toBe(true)
  if (Result.isFailure(other)) expect(other.failure.motivo).toBe("inyeccion-ensayo")
})
for (const fechaPago of ["2025-02-30", "2024-12-31", "2025-13-01", "2025-2-01"]) it(`calendario sin perfil ${fechaPago}`, () => {
  const { perfilTemporal: _perfil, ...c } = ret
  void _perfil
  const r = Effect.runSync(Effect.result(calcularRetencionTrabajoAeat({ ...c, fechaPago }, { modo: "canonico" })))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure.motivo).toContain("versión")
})
import { VERSIONES_RETENCION } from "../lib/dominio/irpf/retenciones/versiones/catalogo"
for (const version of VERSIONES_RETENCION) for (const fechaPago of [version.desde, version.hasta]) it(`extremo inclusivo ${version.id} ${fechaPago}`, () => {
  const { perfilTemporal: _perfil, ...c } = ret
  void _perfil
  const r = Effect.runSync(calcularRetencionTrabajoAeat({ ...c, anio: version.anio, fechaPago }, { modo: "canonico" }))
  expect(r.version).toBe(version.id)
})
it("SS ausente se rechaza antes de seleccionar versión", () => {
  const { cotizacionesCentimos: _ss, ...c } = ret
  void _ss
  const r = Effect.runSync(Effect.result(calcularRetencionTrabajoAeat(c, { modo: "canonico" })))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure.motivo).toContain("Entradas")
})
it("string ajeno al enum no equivale a guarda runtime de contrato", () => {
  const c: CasoRetencionTrabajo = { ...ret,
    // @ts-expect-error entrada JavaScript fuera del enum para caracterizar la guarda real.
    contrato: "contrato-inexistente",
  }
  const r = Effect.runSync(Effect.result(calcularRetencionTrabajoAeat(c, { modo: "canonico" })))
  expect(Result.isSuccess(r)).toBe(true)
})
import { evaluateRetentionAdmission } from "../scripts/procedencia/flujo-admision-r32.mjs"
for (const [name, patch] of retentionCases) it(`predicado exportado concuerda con rechazo real ${name}`, () => {
  expect(evaluateRetentionAdmission({ ...ret, ...patch }, { modo: "canonico" }).outcome).toBe("Effect.fail")
})
for (const version of VERSIONES_RETENCION) it(`predicado exportado alcanza versión ${version.id}`, () => {
  const { perfilTemporal: _perfil, ...c } = ret
  void _perfil
  const r = evaluateRetentionAdmission({ ...c, anio: version.anio, fechaPago: version.desde }, { modo: "canonico" })
  expect(r).toMatchObject({ outcome: "success", version: version.id })
})
it("predicado conserva cortocircuito legacy", () => {
  const { perfilTemporal: _perfil, ...c } = ret
  void _perfil
  const r = evaluateRetentionAdmission({ ...c, anio: 2012, contrato: "manuales", irregular1Centimos: 9500000 }, { modo: "compatible-legacy" })
  expect(r.outcome).toBe("success")
  expect(r.visited.map((step: { id: string }) => step.id)).toEqual(["calculable", "inicial", "legacy-sin-temporal"])
})
