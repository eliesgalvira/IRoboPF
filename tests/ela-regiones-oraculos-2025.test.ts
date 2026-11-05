import { assert, describe, it } from "@effect/vitest"
import { Effect, Schema } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { CensoIngresosIdentificados2025 } from "../lib/dominio/irpf/ingresos-identificados-2025/contrato"
import { ingresoRegionalELA2025 } from "../lib/dominio/irpf/ingresos-identificados-2025/regiones"
import { marcoPropioB, decimalB } from "./b-conexion-completa-fixtures"
import { prepararIngresosIdentificados2025 } from "../lib/dominio/irpf/ingresos-identificados-2025/productor"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import type { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { censoELA, casoCanonicoELA, casoEfectivoELA } from "./ela-ingreso-2025-fixtures"
type Region = "galicia" | "extremadura"
type Api = "canonica" | "efectiva"
function datos(region: Region, euros: string, concedido = euros) {
  const a = censoELA().ayudas[0]
  const gal = region === "galicia"
  const admin = gal ? "xunta_galicia" : "junta_extremadura"
  const c = Schema.decodeUnknownSync(CensoIngresosIdentificados2025)({ ...censoELA(), ayudas: [{ ...a,
    programa: gal ? "galicia-bs215a-2025" : "extremadura-ela-2025", administracion: admin,
    enfermedad: gal ? "ELA_o_fenotipo" : "ELA",
    resolucion: { ...a.resolucion, organismo: gal ? "Dirección General de Mayores y Atención Sociosanitaria" : "Secretaría General de la Consejería de Salud y Servicios Sociales", importeConcedido: concedido },
    cobros: [{ ...a.cobros[0], ordenante: admin, euros }],
  }] })
  const diagnostico = { referencia: "DIAG1", fecha: "2025-01-01", emisor: "Hospital" }
  const solicitud: SolicitudDeduccionesTerritoriales2025 = gal
    ? { solicitudes: [{ lote: "E38", nacimientoContribuyente: "1980-01-01", exhaustividad: "expediente_comun_completo_todos_pagadores", inversionesViviendaEjercicio: [], hechos: { codigo: "galicia_ayudas_ela_fenotipos", ingresoId: "ELA1", diagnostico } }] }
    : { solicitudes: [{ lote: "D51", codigo: "extremadura_ayudas_subvenciones_ela", hechos: { ingresoId: "ELA1", diagnostico, exhaustividad: "completa" } }] }
  return { c, solicitud }
}
function ejecutarEfectiva(region: Region, c: CensoIngresosIdentificados2025, solicitud: SolicitudDeduccionesTerritoriales2025, bruto: string) {
  return liquidarIrpfAnualExplicito({ ...casoEfectivoELA(censoELA(), { solicitudes: [] }, bruto), comunidadAutonoma: region, ingresosIdentificados2025: c, deduccionesTerritoriales2025: solicitud })
}
type EfectoRegional = ReturnType<typeof liquidarIrpfAnual> | ReturnType<typeof ejecutarEfectiva>
function ejecutar(api: Api, region: Region, c: CensoIngresosIdentificados2025, solicitud: SolicitudDeduccionesTerritoriales2025, bruto: string): Effect.Effect<Effect.Success<EfectoRegional>, Effect.Error<EfectoRegional>> {
  return api === "canonica"
    ? liquidarIrpfAnual({ ...casoCanonicoELA(), comunidadAutonoma: region, ingresosIdentificados2025: c, deduccionesTerritoriales2025: solicitud, rendimientos: { trabajo: [{ importeIntegroCentimos: Number(bruto) * 100 }] } }, { modo: "canonico" })
    : ejecutarEfectiva(region, c, solicitud, bruto)
}
// Valores generados sólo por oraculos.py (Fraction); no se derivan del resultado del motor.
it.effect("galicia/canonica/bruto0/cobro12000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "12000", "12000")
  const r = yield* ejecutar("canonica", "galicia", c, solicitud, "0")
  const sin = yield* ejecutar("canonica", "galicia", c, { solicitudes: [] }, "0")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("12000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "12000")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "612.75")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "558.99")
  assert.equal(t?.estatal, "5.10")
  assert.equal(t?.autonomico, "4.65")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("1170"))
  assert.deepEqual(a?.aplicado, racional("558.99"))
  assert.deepEqual(a?.pendiente, racional("611.01"))
  assert.equal(r._tag, "LiquidacionIrpfAnualCalculada")
  if (r._tag === "LiquidacionIrpfAnualCalculada") {
    assert.equal(r.baseImponibleGeneralCentimos, 1200000)
    assert.equal(r.baseLiquidableGeneralCentimos, 1200000)
    assert.equal(r.reduccionRendimientosTrabajoCentimos, 0)
    assert.equal(r.cuotaLiquidaCentimos, 61275)
  }
}))
it.effect("galicia/canonica/bruto0/cobro6500: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "6500", "6500")
  const r = yield* ejecutar("canonica", "galicia", c, solicitud, "0")
  const sin = yield* ejecutar("canonica", "galicia", c, { solicitudes: [] }, "0")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("6500"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "6500")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "90.25")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "63.99")
  assert.equal(t?.estatal, "1.38")
  assert.equal(t?.autonomico, "0.98")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("153.4"))
  assert.deepEqual(a?.aplicado, racional("63.99"))
  assert.deepEqual(a?.pendiente, racional("89.41"))
  assert.equal(r._tag, "LiquidacionIrpfAnualCalculada")
  if (r._tag === "LiquidacionIrpfAnualCalculada") {
    assert.equal(r.baseImponibleGeneralCentimos, 650000)
    assert.equal(r.baseLiquidableGeneralCentimos, 650000)
    assert.equal(r.reduccionRendimientosTrabajoCentimos, 0)
    assert.equal(r.cuotaLiquidaCentimos, 9025)
  }
}))
it.effect("galicia/canonica/bruto0/cobro6500.01: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "6500.01", "6500.01")
  const r = yield* ejecutar("canonica", "galicia", c, solicitud, "0")
  const sin = yield* ejecutar("canonica", "galicia", c, { solicitudes: [] }, "0")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("6500.01"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "6500.01")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "90.25095")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "63.9909")
  assert.equal(t?.estatal, "1.38")
  assert.equal(t?.autonomico, "0.98")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("153.400236"))
  assert.deepEqual(a?.aplicado, racional("63.9909"))
  assert.deepEqual(a?.pendiente, racional("89.409336"))
  assert.equal(r._tag, "LiquidacionIrpfAnualCalculada")
  if (r._tag === "LiquidacionIrpfAnualCalculada") {
    assert.equal(r.baseImponibleGeneralCentimos, 650001)
    assert.equal(r.baseLiquidableGeneralCentimos, 650001)
    assert.equal(r.reduccionRendimientosTrabajoCentimos, 0)
    assert.equal(r.cuotaLiquidaCentimos, 9025)
  }
}))
it.effect("galicia/canonica/bruto14000/cobro12000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "12000", "12000")
  const r = yield* ejecutar("canonica", "galicia", c, solicitud, "14000")
  const sin = yield* ejecutar("canonica", "galicia", c, { solicitudes: [] }, "14000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("12000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "23092.8")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "2019.42")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "1890.9758")
  assert.equal(t?.estatal, "8.74")
  assert.equal(t?.autonomico, "8.18")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("2030.4"))
  assert.deepEqual(a?.aplicado, racional("1890.9758"))
  assert.deepEqual(a?.pendiente, racional("139.4242"))
  assert.equal(r._tag, "LiquidacionIrpfAnualCalculada")
  if (r._tag === "LiquidacionIrpfAnualCalculada") {
    assert.equal(r.baseImponibleGeneralCentimos, 2309280)
    assert.equal(r.baseLiquidableGeneralCentimos, 2309280)
    assert.equal(r.reduccionRendimientosTrabajoCentimos, 0)
    assert.equal(r.cuotaLiquidaCentimos, 201942)
  }
}))
it.effect("galicia/canonica/bruto14000/cobro6500: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "6500", "6500")
  const r = yield* ejecutar("canonica", "galicia", c, solicitud, "14000")
  const sin = yield* ejecutar("canonica", "galicia", c, { solicitudes: [] }, "14000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("6500"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "10290.8")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "450.376")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "405.162")
  assert.equal(t?.estatal, "4.37")
  assert.equal(t?.autonomico, "3.93")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("539.5"))
  assert.deepEqual(a?.aplicado, racional("405.162"))
  assert.deepEqual(a?.pendiente, racional("134.338"))
  assert.equal(r._tag, "LiquidacionIrpfAnualCalculada")
  if (r._tag === "LiquidacionIrpfAnualCalculada") {
    assert.equal(r.baseImponibleGeneralCentimos, 1029080)
    assert.equal(r.baseLiquidableGeneralCentimos, 1029080)
    assert.equal(r.reduccionRendimientosTrabajoCentimos, 730200)
    assert.equal(r.cuotaLiquidaCentimos, 45038)
  }
}))
it.effect("galicia/canonica/bruto14000/cobro6500.01: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "6500.01", "6500.01")
  const r = yield* ejecutar("canonica", "galicia", c, solicitud, "14000")
  const sin = yield* ejecutar("canonica", "galicia", c, { solicitudes: [] }, "14000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("6500.01"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "17592.81")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "1272.6372")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "1184.43909")
  assert.equal(t?.estatal, "7.23")
  assert.equal(t?.autonomico, "6.73")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("907.401396"))
  assert.deepEqual(a?.aplicado, racional("907.401396"))
  assert.deepEqual(a?.pendiente, racional("0"))
  assert.equal(r._tag, "LiquidacionIrpfAnualCalculada")
  if (r._tag === "LiquidacionIrpfAnualCalculada") {
    assert.equal(r.baseImponibleGeneralCentimos, 1759281)
    assert.equal(r.baseLiquidableGeneralCentimos, 1759281)
    assert.equal(r.reduccionRendimientosTrabajoCentimos, 0)
    assert.equal(r.cuotaLiquidaCentimos, 154967)
  }
}))
it.effect("galicia/canonica/bruto33000/cobro12000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "12000", "12000")
  const r = yield* ejecutar("canonica", "galicia", c, solicitud, "33000")
  const sin = yield* ejecutar("canonica", "galicia", c, { solicitudes: [] }, "33000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("12000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "40861.6")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "4882.896")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "4736.6844")
  assert.equal(t?.estatal, "11.94")
  assert.equal(t?.autonomico, "11.59")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("2823.6"))
  assert.deepEqual(a?.aplicado, racional("2823.6"))
  assert.deepEqual(a?.pendiente, racional("0"))
  assert.equal(r._tag, "LiquidacionIrpfAnualCalculada")
  if (r._tag === "LiquidacionIrpfAnualCalculada") {
    assert.equal(r.baseImponibleGeneralCentimos, 4086160)
    assert.equal(r.baseLiquidableGeneralCentimos, 4086160)
    assert.equal(r.reduccionRendimientosTrabajoCentimos, 0)
    assert.equal(r.cuotaLiquidaCentimos, 679598)
  }
}))
it.effect("galicia/canonica/bruto33000/cobro6500: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "6500", "6500")
  const r = yield* ejecutar("canonica", "galicia", c, solicitud, "33000")
  const sin = yield* ejecutar("canonica", "galicia", c, { solicitudes: [] }, "33000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("6500"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "35361.6")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "3865.396")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "3724.6844")
  assert.equal(t?.estatal, "10.93")
  assert.equal(t?.autonomico, "10.53")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("1394.9"))
  assert.deepEqual(a?.aplicado, racional("1394.9"))
  assert.deepEqual(a?.pendiente, racional("0"))
  assert.equal(r._tag, "LiquidacionIrpfAnualCalculada")
  if (r._tag === "LiquidacionIrpfAnualCalculada") {
    assert.equal(r.baseImponibleGeneralCentimos, 3536160)
    assert.equal(r.baseLiquidableGeneralCentimos, 3536160)
    assert.equal(r.reduccionRendimientosTrabajoCentimos, 0)
    assert.equal(r.cuotaLiquidaCentimos, 619518)
  }
}))
it.effect("galicia/canonica/bruto33000/cobro6500.01: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "6500.01", "6500.01")
  const r = yield* ejecutar("canonica", "galicia", c, solicitud, "33000")
  const sin = yield* ejecutar("canonica", "galicia", c, { solicitudes: [] }, "33000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("6500.01"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "35361.61")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "3865.39785")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "3724.68624")
  assert.equal(t?.estatal, "10.93")
  assert.equal(t?.autonomico, "10.53")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("1394.902146"))
  assert.deepEqual(a?.aplicado, racional("1394.902146"))
  assert.deepEqual(a?.pendiente, racional("0"))
  assert.equal(r._tag, "LiquidacionIrpfAnualCalculada")
  if (r._tag === "LiquidacionIrpfAnualCalculada") {
    assert.equal(r.baseImponibleGeneralCentimos, 3536161)
    assert.equal(r.baseLiquidableGeneralCentimos, 3536161)
    assert.equal(r.reduccionRendimientosTrabajoCentimos, 0)
    assert.equal(r.cuotaLiquidaCentimos, 619518)
  }
}))
it.effect("galicia/efectiva/bruto0/cobro12000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "12000", "12000")
  const r = yield* ejecutar("efectiva", "galicia", c, solicitud, "0")
  const sin = yield* ejecutar("efectiva", "galicia", c, { solicitudes: [] }, "0")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("12000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "12000")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "612.75")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "558.99")
  assert.equal(t?.estatal, "5.10")
  assert.equal(t?.autonomico, "4.65")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("1170"))
  assert.deepEqual(a?.aplicado, racional("558.99"))
  assert.deepEqual(a?.pendiente, racional("611.01"))
  if ("cuotaLiquidaLegal" in r) {
    assert.equal(r.baseImponibleGeneral, "12000")
    assert.equal(r.baseLiquidableGeneral, "12000")
    assert.equal(r.reduccionArt20, "0")
    assert.equal(r.cuotaLiquidaLegal, "612.75")
  } else assert.fail("Falta resultado explícito")
}))
it.effect("galicia/efectiva/bruto0/cobro6500: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "6500", "6500")
  const r = yield* ejecutar("efectiva", "galicia", c, solicitud, "0")
  const sin = yield* ejecutar("efectiva", "galicia", c, { solicitudes: [] }, "0")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("6500"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "6500")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "90.25")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "63.99")
  assert.equal(t?.estatal, "1.38")
  assert.equal(t?.autonomico, "0.98")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("153.4"))
  assert.deepEqual(a?.aplicado, racional("63.99"))
  assert.deepEqual(a?.pendiente, racional("89.41"))
  if ("cuotaLiquidaLegal" in r) {
    assert.equal(r.baseImponibleGeneral, "6500")
    assert.equal(r.baseLiquidableGeneral, "6500")
    assert.equal(r.reduccionArt20, "0")
    assert.equal(r.cuotaLiquidaLegal, "90.25")
  } else assert.fail("Falta resultado explícito")
}))
it.effect("galicia/efectiva/bruto0/cobro6500.01: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "6500.01", "6500.01")
  const r = yield* ejecutar("efectiva", "galicia", c, solicitud, "0")
  const sin = yield* ejecutar("efectiva", "galicia", c, { solicitudes: [] }, "0")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("6500.01"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "6500.01")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "90.25095")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "63.9909")
  assert.equal(t?.estatal, "1.38")
  assert.equal(t?.autonomico, "0.98")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("153.400236"))
  assert.deepEqual(a?.aplicado, racional("63.9909"))
  assert.deepEqual(a?.pendiente, racional("89.409336"))
  if ("cuotaLiquidaLegal" in r) {
    assert.equal(r.baseImponibleGeneral, "6500.01")
    assert.equal(r.baseLiquidableGeneral, "6500.01")
    assert.equal(r.reduccionArt20, "0")
    assert.equal(r.cuotaLiquidaLegal, "90.25095")
  } else assert.fail("Falta resultado explícito")
}))
it.effect("galicia/efectiva/bruto14000/cobro12000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "12000", "12000")
  const r = yield* ejecutar("efectiva", "galicia", c, solicitud, "14000")
  const sin = yield* ejecutar("efectiva", "galicia", c, { solicitudes: [] }, "14000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("12000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "24000")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "2155.5")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "2026.1486")
  assert.equal(t?.estatal, "8.98")
  assert.equal(t?.autonomico, "8.44")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("2090.4"))
  assert.deepEqual(a?.aplicado, racional("2026.1486"))
  assert.deepEqual(a?.pendiente, racional("64.2514"))
  if ("cuotaLiquidaLegal" in r) {
    assert.equal(r.baseImponibleGeneral, "24000")
    assert.equal(r.baseLiquidableGeneral, "24000")
    assert.equal(r.reduccionArt20, "0")
    assert.equal(r.cuotaLiquidaLegal, "2155.5")
  } else assert.fail("Falta resultado explícito")
}))
it.effect("galicia/efectiva/bruto14000/cobro6500: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "6500", "6500")
  const r = yield* ejecutar("efectiva", "galicia", c, solicitud, "14000")
  const sin = yield* ejecutar("efectiva", "galicia", c, { solicitudes: [] }, "14000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("6500"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "11198")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "536.56")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "486.81")
  assert.equal(t?.estatal, "4.79")
  assert.equal(t?.autonomico, "4.34")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("593.45"))
  assert.deepEqual(a?.aplicado, racional("486.81"))
  assert.deepEqual(a?.pendiente, racional("106.64"))
  if ("cuotaLiquidaLegal" in r) {
    assert.equal(r.baseImponibleGeneral, "11198")
    assert.equal(r.baseLiquidableGeneral, "11198")
    assert.equal(r.reduccionArt20, "7302")
    assert.equal(r.cuotaLiquidaLegal, "536.56")
  } else assert.fail("Falta resultado explícito")
}))
it.effect("galicia/efectiva/bruto14000/cobro6500.01: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "6500.01", "6500.01")
  const r = yield* ejecutar("efectiva", "galicia", c, solicitud, "14000")
  const sin = yield* ejecutar("efectiva", "galicia", c, { solicitudes: [] }, "14000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("6500.01"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "18500.01")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "1381.5012")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "1290.12789")
  assert.equal(t?.estatal, "7.46")
  assert.equal(t?.autonomico, "6.97")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("937.951443"))
  assert.deepEqual(a?.aplicado, racional("937.951443"))
  assert.deepEqual(a?.pendiente, racional("0"))
  if ("cuotaLiquidaLegal" in r) {
    assert.equal(r.baseImponibleGeneral, "18500.01")
    assert.equal(r.baseLiquidableGeneral, "18500.01")
    assert.equal(r.reduccionArt20, "0")
    assert.equal(r.cuotaLiquidaLegal, "1733.677647")
  } else assert.fail("Falta resultado explícito")
}))
it.effect("galicia/efectiva/bruto33000/cobro12000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "12000", "12000")
  const r = yield* ejecutar("efectiva", "galicia", c, solicitud, "33000")
  const sin = yield* ejecutar("efectiva", "galicia", c, { solicitudes: [] }, "33000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("12000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "43000")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "5278.5")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "5130.15")
  assert.equal(t?.estatal, "12.27")
  assert.equal(t?.autonomico, "11.93")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("2904"))
  assert.deepEqual(a?.aplicado, racional("2904"))
  assert.deepEqual(a?.pendiente, racional("0"))
  if ("cuotaLiquidaLegal" in r) {
    assert.equal(r.baseImponibleGeneral, "43000")
    assert.equal(r.baseLiquidableGeneral, "43000")
    assert.equal(r.reduccionArt20, "0")
    assert.equal(r.cuotaLiquidaLegal, "7504.65")
  } else assert.fail("Falta resultado explícito")
}))
it.effect("galicia/efectiva/bruto33000/cobro6500: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "6500", "6500")
  const r = yield* ejecutar("efectiva", "galicia", c, solicitud, "33000")
  const sin = yield* ejecutar("efectiva", "galicia", c, { solicitudes: [] }, "33000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("6500"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "37500")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "4261")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "4118.15")
  assert.equal(t?.estatal, "11.36")
  assert.equal(t?.autonomico, "10.98")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("1452.1"))
  assert.deepEqual(a?.aplicado, racional("1452.1"))
  assert.deepEqual(a?.pendiente, racional("0"))
  if ("cuotaLiquidaLegal" in r) {
    assert.equal(r.baseImponibleGeneral, "37500")
    assert.equal(r.baseLiquidableGeneral, "37500")
    assert.equal(r.reduccionArt20, "0")
    assert.equal(r.cuotaLiquidaLegal, "6927.05")
  } else assert.fail("Falta resultado explícito")
}))
it.effect("galicia/efectiva/bruto33000/cobro6500.01: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("galicia", "6500.01", "6500.01")
  const r = yield* ejecutar("efectiva", "galicia", c, solicitud, "33000")
  const sin = yield* ejecutar("efectiva", "galicia", c, { solicitudes: [] }, "33000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("6500.01"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "37500.01")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "4261.00185")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "4118.15184")
  assert.equal(t?.estatal, "11.36")
  assert.equal(t?.autonomico, "10.98")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("1452.102234"))
  assert.deepEqual(a?.aplicado, racional("1452.102234"))
  assert.deepEqual(a?.pendiente, racional("0"))
  if ("cuotaLiquidaLegal" in r) {
    assert.equal(r.baseImponibleGeneral, "37500.01")
    assert.equal(r.baseLiquidableGeneral, "37500.01")
    assert.equal(r.reduccionArt20, "0")
    assert.equal(r.cuotaLiquidaLegal, "6927.051456")
  } else assert.fail("Falta resultado explícito")
}))
it.effect("extremadura/canonica/bruto0/cobro2000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("extremadura", "2000", "2000")
  const r = yield* ejecutar("canonica", "extremadura", c, solicitud, "0")
  const sin = yield* ejecutar("canonica", "extremadura", c, { solicitudes: [] }, "0")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("2000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "2000")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "0")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "0")
  assert.equal(t?.estatal, "0.00")
  assert.equal(t?.autonomico, "0.00")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("0"))
  assert.deepEqual(a?.aplicado, racional("0"))
  assert.deepEqual(a?.pendiente, racional("0"))
  assert.equal(r._tag, "LiquidacionIrpfAnualCalculada")
  if (r._tag === "LiquidacionIrpfAnualCalculada") {
    assert.equal(r.baseImponibleGeneralCentimos, 200000)
    assert.equal(r.baseLiquidableGeneralCentimos, 200000)
    assert.equal(r.reduccionRendimientosTrabajoCentimos, 0)
    assert.equal(r.cuotaLiquidaCentimos, 0)
  }
}))
it.effect("extremadura/canonica/bruto0/cobro1000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("extremadura", "1000", "2000")
  const r = yield* ejecutar("canonica", "extremadura", c, solicitud, "0")
  const sin = yield* ejecutar("canonica", "extremadura", c, { solicitudes: [] }, "0")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("1000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "1000")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "0")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "0")
  assert.equal(t?.estatal, "0.00")
  assert.equal(t?.autonomico, "0.00")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("0"))
  assert.deepEqual(a?.aplicado, racional("0"))
  assert.deepEqual(a?.pendiente, racional("0"))
  assert.equal(r._tag, "LiquidacionIrpfAnualCalculada")
  if (r._tag === "LiquidacionIrpfAnualCalculada") {
    assert.equal(r.baseImponibleGeneralCentimos, 100000)
    assert.equal(r.baseLiquidableGeneralCentimos, 100000)
    assert.equal(r.reduccionRendimientosTrabajoCentimos, 0)
    assert.equal(r.cuotaLiquidaCentimos, 0)
  }
}))
it.effect("extremadura/canonica/bruto14000/cobro2000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("extremadura", "2000", "2000")
  const r = yield* ejecutar("canonica", "extremadura", c, solicitud, "14000")
  const sin = yield* ejecutar("canonica", "extremadura", c, { solicitudes: [] }, "14000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("2000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "5790.8")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "22.876")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "19.264")
  assert.equal(t?.estatal, "0.39")
  assert.equal(t?.autonomico, "0.33")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("14.4"))
  assert.deepEqual(a?.aplicado, racional("14.4"))
  assert.deepEqual(a?.pendiente, racional("0"))
  assert.equal(r._tag, "LiquidacionIrpfAnualCalculada")
  if (r._tag === "LiquidacionIrpfAnualCalculada") {
    assert.equal(r.baseImponibleGeneralCentimos, 579080)
    assert.equal(r.baseLiquidableGeneralCentimos, 579080)
    assert.equal(r.reduccionRendimientosTrabajoCentimos, 730200)
    assert.equal(r.cuotaLiquidaCentimos, 2774)
  }
}))
it.effect("extremadura/canonica/bruto14000/cobro1000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("extremadura", "1000", "2000")
  const r = yield* ejecutar("canonica", "extremadura", c, solicitud, "14000")
  const sin = yield* ejecutar("canonica", "extremadura", c, { solicitudes: [] }, "14000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("1000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "4790.8")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "0")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "0")
  assert.equal(t?.estatal, "0.00")
  assert.equal(t?.autonomico, "0.00")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("0"))
  assert.deepEqual(a?.aplicado, racional("0"))
  assert.deepEqual(a?.pendiente, racional("0"))
  assert.equal(r._tag, "LiquidacionIrpfAnualCalculada")
  if (r._tag === "LiquidacionIrpfAnualCalculada") {
    assert.equal(r.baseImponibleGeneralCentimos, 479080)
    assert.equal(r.baseLiquidableGeneralCentimos, 479080)
    assert.equal(r.reduccionRendimientosTrabajoCentimos, 730200)
    assert.equal(r.cuotaLiquidaCentimos, 0)
  }
}))
it.effect("extremadura/canonica/bruto33000/cobro2000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("extremadura", "2000", "2000")
  const r = yield* ejecutar("canonica", "extremadura", c, solicitud, "33000")
  const sin = yield* ejecutar("canonica", "extremadura", c, { solicitudes: [] }, "33000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("2000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "30861.6")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "3184.74")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "3132.78")
  assert.equal(t?.estatal, "10.31")
  assert.equal(t?.autonomico, "10.15")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("409.2"))
  assert.deepEqual(a?.aplicado, racional("409.2"))
  assert.deepEqual(a?.pendiente, racional("0"))
  assert.equal(r._tag, "LiquidacionIrpfAnualCalculada")
  if (r._tag === "LiquidacionIrpfAnualCalculada") {
    assert.equal(r.baseImponibleGeneralCentimos, 3086160)
    assert.equal(r.baseLiquidableGeneralCentimos, 3086160)
    assert.equal(r.reduccionRendimientosTrabajoCentimos, 0)
    assert.equal(r.cuotaLiquidaCentimos, 590832)
  }
}))
it.effect("extremadura/canonica/bruto33000/cobro1000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("extremadura", "1000", "2000")
  const r = yield* ejecutar("canonica", "extremadura", c, solicitud, "33000")
  const sin = yield* ejecutar("canonica", "extremadura", c, { solicitudes: [] }, "33000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("1000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "29861.6")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "3034.74")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "2957.78")
  assert.equal(t?.estatal, "10.16")
  assert.equal(t?.autonomico, "9.90")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("200.6"))
  assert.deepEqual(a?.aplicado, racional("200.6"))
  assert.deepEqual(a?.pendiente, racional("0"))
  assert.equal(r._tag, "LiquidacionIrpfAnualCalculada")
  if (r._tag === "LiquidacionIrpfAnualCalculada") {
    assert.equal(r.baseImponibleGeneralCentimos, 2986160)
    assert.equal(r.baseLiquidableGeneralCentimos, 2986160)
    assert.equal(r.reduccionRendimientosTrabajoCentimos, 0)
    assert.equal(r.cuotaLiquidaCentimos, 579192)
  }
}))
it.effect("extremadura/efectiva/bruto0/cobro2000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("extremadura", "2000", "2000")
  const r = yield* ejecutar("efectiva", "extremadura", c, solicitud, "0")
  const sin = yield* ejecutar("efectiva", "extremadura", c, { solicitudes: [] }, "0")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("2000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "2000")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "0")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "0")
  assert.equal(t?.estatal, "0.00")
  assert.equal(t?.autonomico, "0.00")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("0"))
  assert.deepEqual(a?.aplicado, racional("0"))
  assert.deepEqual(a?.pendiente, racional("0"))
  if ("cuotaLiquidaLegal" in r) {
    assert.equal(r.baseImponibleGeneral, "2000")
    assert.equal(r.baseLiquidableGeneral, "2000")
    assert.equal(r.reduccionArt20, "0")
    assert.equal(r.cuotaLiquidaLegal, "0")
  } else assert.fail("Falta resultado explícito")
}))
it.effect("extremadura/efectiva/bruto0/cobro1000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("extremadura", "1000", "2000")
  const r = yield* ejecutar("efectiva", "extremadura", c, solicitud, "0")
  const sin = yield* ejecutar("efectiva", "extremadura", c, { solicitudes: [] }, "0")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("1000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "1000")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "0")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "0")
  assert.equal(t?.estatal, "0.00")
  assert.equal(t?.autonomico, "0.00")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("0"))
  assert.deepEqual(a?.aplicado, racional("0"))
  assert.deepEqual(a?.pendiente, racional("0"))
  if ("cuotaLiquidaLegal" in r) {
    assert.equal(r.baseImponibleGeneral, "1000")
    assert.equal(r.baseLiquidableGeneral, "1000")
    assert.equal(r.reduccionArt20, "0")
    assert.equal(r.cuotaLiquidaLegal, "0")
  } else assert.fail("Falta resultado explícito")
}))
it.effect("extremadura/efectiva/bruto14000/cobro2000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("extremadura", "2000", "2000")
  const r = yield* ejecutar("efectiva", "extremadura", c, solicitud, "14000")
  const sin = yield* ejecutar("efectiva", "extremadura", c, { solicitudes: [] }, "14000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("2000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "6698")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "109.06")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "91.84")
  assert.equal(t?.estatal, "1.62")
  assert.equal(t?.autonomico, "1.37")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("59.8"))
  assert.deepEqual(a?.aplicado, racional("59.8"))
  assert.deepEqual(a?.pendiente, racional("0"))
  if ("cuotaLiquidaLegal" in r) {
    assert.equal(r.baseImponibleGeneral, "6698")
    assert.equal(r.baseLiquidableGeneral, "6698")
    assert.equal(r.reduccionArt20, "7302")
    assert.equal(r.cuotaLiquidaLegal, "141.1")
  } else assert.fail("Falta resultado explícito")
}))
it.effect("extremadura/efectiva/bruto14000/cobro1000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("extremadura", "1000", "2000")
  const r = yield* ejecutar("efectiva", "extremadura", c, solicitud, "14000")
  const sin = yield* ejecutar("efectiva", "extremadura", c, { solicitudes: [] }, "14000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("1000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "5698")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "14.06")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "11.84")
  assert.equal(t?.estatal, "0.24")
  assert.equal(t?.autonomico, "0.20")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("4.4"))
  assert.deepEqual(a?.aplicado, racional("4.4"))
  assert.deepEqual(a?.pendiente, racional("0"))
  if ("cuotaLiquidaLegal" in r) {
    assert.equal(r.baseImponibleGeneral, "5698")
    assert.equal(r.baseLiquidableGeneral, "5698")
    assert.equal(r.reduccionArt20, "7302")
    assert.equal(r.cuotaLiquidaLegal, "21.5")
  } else assert.fail("Falta resultado explícito")
}))
it.effect("extremadura/efectiva/bruto33000/cobro2000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("extremadura", "2000", "2000")
  const r = yield* ejecutar("efectiva", "extremadura", c, solicitud, "33000")
  const sin = yield* ejecutar("efectiva", "extremadura", c, { solicitudes: [] }, "33000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("2000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "33000")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "3505.5")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "3507")
  assert.equal(t?.estatal, "10.62")
  assert.equal(t?.autonomico, "10.62")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("424.8"))
  assert.deepEqual(a?.aplicado, racional("424.8"))
  assert.deepEqual(a?.pendiente, racional("0"))
  if ("cuotaLiquidaLegal" in r) {
    assert.equal(r.baseImponibleGeneral, "33000")
    assert.equal(r.baseLiquidableGeneral, "33000")
    assert.equal(r.reduccionArt20, "0")
    assert.equal(r.cuotaLiquidaLegal, "6587.7")
  } else assert.fail("Falta resultado explícito")
}))
it.effect("extremadura/efectiva/bruto33000/cobro1000: escalas y consumo único", () => Effect.gen(function* () {
  const { c, solicitud } = datos("extremadura", "1000", "2000")
  const r = yield* ejecutar("efectiva", "extremadura", c, solicitud, "33000")
  const sin = yield* ejecutar("efectiva", "extremadura", c, { solicitudes: [] }, "33000")
  assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional("1000"))
  assert.lengthOf(r.libroIngresosIdentificados2025?.ingresos ?? [], 1)
  assert.equal(r.libroIngresosIdentificados2025?.aceptacionFiscal, "pendiente")
  assert.deepEqual(r.nodosFiscalesB2025?.tiposMediosGenerales, sin.nodosFiscalesB2025?.tiposMediosGenerales)
  const t = r.nodosFiscalesB2025?.tiposMediosGenerales
  assert.equal(t?.baseLiquidableGeneral, "32000")
  assert.equal(t?.cuotaGeneralEstatalArt63_1, "3355.5")
  assert.equal(t?.cuotaGeneralAutonomicaArt74_1, "3332")
  assert.equal(t?.estatal, "10.48")
  assert.equal(t?.autonomico, "10.41")
  assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
  assert.lengthOf(sin.deduccionesTerritoriales2025?.aplicaciones ?? [], 0)
  const a = r.deduccionesTerritoriales2025?.aplicaciones[0]
  assert.deepEqual(a?.generado, racional("208.9"))
  assert.deepEqual(a?.aplicado, racional("208.9"))
  assert.deepEqual(a?.pendiente, racional("0"))
  if ("cuotaLiquidaLegal" in r) {
    assert.equal(r.baseImponibleGeneral, "32000")
    assert.equal(r.baseLiquidableGeneral, "32000")
    assert.equal(r.reduccionArt20, "0")
    assert.equal(r.cuotaLiquidaLegal, "6478.6")
  } else assert.fail("Falta resultado explícito")
}))
describe.each(["galicia", "extremadura"] as const)("Fronteras %s", region => {
  const ambito = { anio: 2025, comunidadAutonoma: region, contribuyenteId: "A", fallecimiento: false }
  it("parcial gallego rechazado; extremeño conciliado sin anticipar saldo", () => {
    const { c } = datos(region, "1000", region === "galicia" ? "12000" : "2000")
    const r = prepararIngresosIdentificados2025(c, ambito)
    assert.equal(r.estado, region === "galicia" ? "no_soportado" : "preparado")
    if (r.estado === "preparado") assert.equal(r.preparacion.totalGeneral.toFixed(), "1000")
    if (r.estado === "no_soportado") assert.match(r.motivo, /parcial/)
  })
  it.each(["2025-02-29", "2025-08-31", "2026-01-01"])("cobro %s rechazado", fecha => {
    const { c } = datos(region, "2000")
    Object.defineProperty(c.ayudas[0].cobros[0], "fecha", { value: fecha })
    assert.equal(prepararIngresosIdentificados2025(c, ambito).estado, "no_soportado")
  })
  it("identidad, concesión y consumo duplicado", () => {
    const { c } = datos(region, "2000")
    assert.equal(prepararIngresosIdentificados2025(c, { ...ambito, contribuyenteId: "OTRO" }).estado, "no_soportado")
    assert.equal(prepararIngresosIdentificados2025({ ...c, ayudas: [c.ayudas[0], c.ayudas[0]] }, ambito).estado, "no_soportado")
    const excesivo = datos(region, region === "galicia" ? "12000.01" : "1999.99")
    assert.equal(prepararIngresosIdentificados2025(excesivo.c, ambito).estado, "no_soportado")
  })
  for (const api of ["canonica", "efectiva"] as const) {
    it.effect(api + ": selección ajena y duplicada rechazada", () => Effect.gen(function* () {
      const { c, solicitud } = datos(region, region === "galicia" ? "12000" : "2000")
      const duplicada = { solicitudes: [...solicitud.solicitudes, ...solicitud.solicitudes] }
      const error = yield* Effect.flip(ejecutar(api, region, c, duplicada, "33000"))
      assert.match(error.motivo, /duplicad/)
    }))
  }
})

for (const region of ["galicia", "extremadura"] as const) {
  it.effect(region + ": adapter concilia identidad, BLG, diagnóstico y cobro", () => Effect.gen(function* () {
    const { c, solicitud } = datos(region, region === "galicia" ? "12000" : "2000")
    const r = yield* ejecutar("efectiva", region, c, solicitud, "33000")
    const libro = r.libroIngresosIdentificados2025
    const nodos = r.nodosFiscalesB2025
    assert.isDefined(libro); assert.isDefined(nodos)
    if (libro === undefined || nodos === undefined) return assert.fail("Falta productor")
    const t = nodos.tiposMediosGenerales
    if (t === undefined) return assert.fail("Faltan tipos")
    const m = { ...marcoPropioB(), caso: { ...marcoPropioB().caso, comunidadAutonoma: region }, baseGeneral: decimalB(t.baseLiquidableGeneral), libroIngresosIdentificados2025: libro, nodosFiscalesB2025: nodos }
    const programa = region === "galicia" ? "galicia-bs215a-2025" : "extremadura-ela-2025"
    const diag = { referencia: "D", emisor: "Hospital", fecha: "2025-01-01" }
    assert.equal(ingresoRegionalELA2025(m, "ELA1", diag, programa).ingreso.ayudaId, "ELA1")
    for (const diagnostico of [{ ...diag, referencia: " " }, { ...diag, emisor: " " }, { ...diag, fecha: "2025-10-02" }, { ...diag, fecha: "2025-02-29" }])
      assert.throws(() => ingresoRegionalELA2025(m, "ELA1", diagnostico, programa), /diagnóstico/)
    assert.throws(() => ingresoRegionalELA2025(m, "AJENO", diag, programa), /ajeno/)
    assert.throws(() => ingresoRegionalELA2025({ ...m, baseGeneral: decimalB("1") }, "ELA1", diag, programa), /base/)
    for (const ajeno of [{ ...libro, contribuyente: "OTRO" }, { ...libro, liquidacion: "OTRA" }])
      assert.throws(() => ingresoRegionalELA2025({ ...m, libroIngresosIdentificados2025: ajeno }, "ELA1", diag, programa), /identidad/)
    const ingreso = libro.ingresos[0]
    assert.throws(() => ingresoRegionalELA2025({ ...m, libroIngresosIdentificados2025: { ...libro, ingresos: [{ ...ingreso, integradoBaseLiquidable: "1" }] } }, "ELA1", diag, programa), /conciliación/)
  }))
}

for (const region of ["galicia", "extremadura"] as const) {
  for (const api of ["canonica", "efectiva"] as const) {
    it.effect(region + api + ": selección omitida no elimina renta", () => Effect.gen(function* () {
      const euros = region === "galicia" ? "12000" : "2000"
      const { c } = datos(region, euros)
      const { deduccionesTerritoriales2025: seleccionC, ...baseC } = casoCanonicoELA()
      const { deduccionesTerritoriales2025: seleccionE, ...baseE } = casoEfectivoELA()
      assert.isDefined(seleccionC); assert.isDefined(seleccionE)
      const r = yield* (api === "canonica"
        ? liquidarIrpfAnual({ ...baseC, comunidadAutonoma: region, ingresosIdentificados2025: c }, { modo: "canonico" })
        : liquidarIrpfAnualExplicito({ ...baseE, deducciones: "solo-da61-si-procede", comunidadAutonoma: region, ingresosIdentificados2025: c }))
      assert.deepEqual(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, racional(euros))
      assert.equal(r.deduccionesTerritoriales2025?.aplicaciones.length ?? 0, 0)
    }))
    for (const campo of ["programa", "administracion", "organismo", "ordenante", "beneficiario", "sin-cobro", "exceso-cobro", "concesion2026", "exenta", "SAAD", "estatal", "art7y"] as const) {
      it.effect(region + api + ": rechaza " + campo, () => Effect.gen(function* () {
        const { c, solicitud } = datos(region, region === "galicia" ? "12000" : "2000")
        const a = c.ayudas[0]
        if (campo === "programa" || campo === "SAAD" || campo === "estatal" || campo === "art7y") Object.defineProperty(a, "programa", { value: campo })
        if (campo === "administracion") Object.defineProperty(a, "administracion", { value: "otra" })
        if (campo === "organismo") Object.defineProperty(a.resolucion, "organismo", { value: "otro" })
        if (campo === "ordenante") Object.defineProperty(a.cobros[0], "ordenante", { value: "otro" })
        if (campo === "beneficiario") Object.defineProperty(a, "beneficiario", { value: "OTRO" })
        if (campo === "sin-cobro") Object.defineProperty(a, "cobros", { value: [] })
        if (campo === "exceso-cobro") Object.defineProperty(a.cobros[0], "euros", { value: "12001" })
        if (campo === "concesion2026") Object.defineProperty(a.resolucion, "fecha", { value: "2026-01-01" })
        if (campo === "exenta") Object.defineProperty(a, "clasificacionFiscal", { value: "exenta" })
        const error = yield* Effect.flip(ejecutar(api, region, c, solicitud, "33000"))
        assert.isNotEmpty(error.motivo)
      }))
    }
  }
}
it.effect("galicia/canonica/bruto14000: referencia sin ayuda", () => Effect.gen(function* () {
  const { ingresosIdentificados2025: ingreso, ...base } = casoCanonicoELA(censoELA(), { solicitudes: [] })
  assert.isDefined(ingreso)
  const r = yield* liquidarIrpfAnual({ ...base, comunidadAutonoma: "galicia", rendimientos: { trabajo: [{ importeIntegroCentimos: 1400000 }] } }, { modo: "canonico" })
  assert.equal(r.baseImponibleGeneralCentimos, 379080)
  assert.equal(r.baseLiquidableGeneralCentimos, 379080)
  assert.equal(r.reduccionRendimientosTrabajoCentimos, 730200)
  assert.equal(r.cuotaLiquidaCentimos, 0)
}))
it.effect("galicia/canonica/bruto33000: referencia sin ayuda", () => Effect.gen(function* () {
  const { ingresosIdentificados2025: ingreso, ...base } = casoCanonicoELA(censoELA(), { solicitudes: [] })
  assert.isDefined(ingreso)
  const r = yield* liquidarIrpfAnual({ ...base, comunidadAutonoma: "galicia", rendimientos: { trabajo: [{ importeIntegroCentimos: 3300000 }] } }, { modo: "canonico" })
  assert.equal(r.baseImponibleGeneralCentimos, 2886160)
  assert.equal(r.baseLiquidableGeneralCentimos, 2886160)
  assert.equal(r.reduccionRendimientosTrabajoCentimos, 0)
  assert.equal(r.cuotaLiquidaCentimos, 563527)
}))
it.effect("galicia/efectiva/bruto14000: referencia sin ayuda", () => Effect.gen(function* () {
  const { ingresosIdentificados2025: ingreso, ...base } = casoEfectivoELA(censoELA(), { solicitudes: [] }, "14000")
  assert.isDefined(ingreso)
  const r = yield* liquidarIrpfAnualExplicito({ ...base, perfil: "solo-trabajo", otrasRentas: "ninguna", comunidadAutonoma: "galicia" })
  assert.equal(r.baseImponibleGeneral, "4698")
  assert.equal(r.baseLiquidableGeneral, "4698")
  assert.equal(r.reduccionArt20, "7302")
  assert.equal(r.cuotaLiquidaLegal, "0")
}))
it.effect("galicia/efectiva/bruto33000: referencia sin ayuda", () => Effect.gen(function* () {
  const { ingresosIdentificados2025: ingreso, ...base } = casoEfectivoELA(censoELA(), { solicitudes: [] }, "33000")
  assert.isDefined(ingreso)
  const r = yield* liquidarIrpfAnualExplicito({ ...base, perfil: "solo-trabajo", otrasRentas: "ninguna", comunidadAutonoma: "galicia" })
  assert.equal(r.baseImponibleGeneral, "31000")
  assert.equal(r.baseLiquidableGeneral, "31000")
  assert.equal(r.reduccionArt20, "0")
  assert.equal(r.cuotaLiquidaLegal, "6274.6486")
}))
it.effect("extremadura/canonica/bruto14000: referencia sin ayuda", () => Effect.gen(function* () {
  const { ingresosIdentificados2025: ingreso, ...base } = casoCanonicoELA(censoELA(), { solicitudes: [] })
  assert.isDefined(ingreso)
  const r = yield* liquidarIrpfAnual({ ...base, comunidadAutonoma: "extremadura", rendimientos: { trabajo: [{ importeIntegroCentimos: 1400000 }] } }, { modo: "canonico" })
  assert.equal(r.baseImponibleGeneralCentimos, 379080)
  assert.equal(r.baseLiquidableGeneralCentimos, 379080)
  assert.equal(r.reduccionRendimientosTrabajoCentimos, 730200)
  assert.equal(r.cuotaLiquidaCentimos, 0)
}))
it.effect("extremadura/canonica/bruto33000: referencia sin ayuda", () => Effect.gen(function* () {
  const { ingresosIdentificados2025: ingreso, ...base } = casoCanonicoELA(censoELA(), { solicitudes: [] })
  assert.isDefined(ingreso)
  const r = yield* liquidarIrpfAnual({ ...base, comunidadAutonoma: "extremadura", rendimientos: { trabajo: [{ importeIntegroCentimos: 3300000 }] } }, { modo: "canonico" })
  assert.equal(r.baseImponibleGeneralCentimos, 2886160)
  assert.equal(r.baseLiquidableGeneralCentimos, 2886160)
  assert.equal(r.reduccionRendimientosTrabajoCentimos, 0)
  assert.equal(r.cuotaLiquidaCentimos, 566752)
}))
it.effect("extremadura/efectiva/bruto14000: referencia sin ayuda", () => Effect.gen(function* () {
  const { ingresosIdentificados2025: ingreso, ...base } = casoEfectivoELA(censoELA(), { solicitudes: [] }, "14000")
  assert.isDefined(ingreso)
  const r = yield* liquidarIrpfAnualExplicito({ ...base, perfil: "solo-trabajo", otrasRentas: "ninguna", comunidadAutonoma: "extremadura" })
  assert.equal(r.baseImponibleGeneral, "4698")
  assert.equal(r.baseLiquidableGeneral, "4698")
  assert.equal(r.reduccionArt20, "7302")
  assert.equal(r.cuotaLiquidaLegal, "0")
}))
it.effect("extremadura/efectiva/bruto33000: referencia sin ayuda", () => Effect.gen(function* () {
  const { ingresosIdentificados2025: ingreso, ...base } = casoEfectivoELA(censoELA(), { solicitudes: [] }, "33000")
  assert.isDefined(ingreso)
  const r = yield* liquidarIrpfAnualExplicito({ ...base, perfil: "solo-trabajo", otrasRentas: "ninguna", comunidadAutonoma: "extremadura" })
  assert.equal(r.baseImponibleGeneral, "31000")
  assert.equal(r.baseLiquidableGeneral, "31000")
  assert.equal(r.reduccionArt20, "0")
  assert.equal(r.cuotaLiquidaLegal, "6362.5")
}))

for (const api of ["canonica", "efectiva"] as const) {
  it.effect(api + ": Galicia parcial rechaza con motivo explícito", () => Effect.gen(function* () {
    const { c, solicitud } = datos("galicia", "1000", "12000")
    const error = yield* Effect.flip(ejecutar(api, "galicia", c, solicitud, "33000"))
    assert.match(error.motivo, /parcial/)
  }))
}
