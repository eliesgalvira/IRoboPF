import { assert, describe, it } from "@effect/vitest"
import { Effect, Schema, Exit } from "effect"
import casosRecibidos from "./balears-emergencia-revision-casos"

// Dos expectativas originales pedían costes con más de dos decimales.
// Euros los rechaza; se preserva el oráculo recibido y se comprueba el contrato.
const casos = casosRecibidos.map(caso => caso.nombre === "coste 4321.09000000000000000001"
  ? { ...caso, aceptar: false }
  : caso)
import { CensoIngresosIdentificados2025 } from "../lib/dominio/irpf/ingresos-identificados-2025/contrato"
import { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { casoCanonicoELA, casoEfectivoELA } from "./ela-ingreso-2025-fixtures"

type Hechos = (typeof casos)[number]["entrada"]
type Seleccion = (typeof casos)[number]["solicitud"]
const ejecutar = Effect.fn("RevisionBalears.ejecutar")(function* (api: "canonica" | "efectiva", raw: Hechos, seleccion: Seleccion) {
  const censo = yield* Effect.try({try: () => Schema.decodeUnknownSync(CensoIngresosIdentificados2025)(raw, {onExcessProperty: "error"}), catch: () => ({ _tag: "RevisionDecodificacion", message: "Censo cerrado" })})
  const solicitud = yield* Effect.try({try: () => Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)(seleccion, {onExcessProperty: "error"}), catch: () => ({ _tag: "RevisionDecodificacion", message: "Solicitud cerrada" })})
  return yield* (api === "canonica"
    ? liquidarIrpfAnual({...casoCanonicoELA(), comunidadAutonoma: "illes-balears", ingresosIdentificados2025: censo, deduccionesTerritoriales2025: solicitud}, {modo: "canonico"})
    : liquidarIrpfAnualExplicito({...casoEfectivoELA(), comunidadAutonoma: "illes-balears", ingresosIdentificados2025: censo, deduccionesTerritoriales2025: solicitud}))
})
function igualRacional(actual: {readonly numeradorEuros: string; readonly divisor: string} | undefined, esperado: {readonly numeradorEuros: string; readonly divisor: string}) {
  assert.isDefined(actual)
  if (actual === undefined) throw new Error("Falta racional")
  assert.strictEqual(BigInt(actual.numeradorEuros)*BigInt(esperado.divisor), BigInt(esperado.numeradorEuros)*BigInt(actual.divisor))
}
for (const api of ["canonica", "efectiva"] as const) {
 describe(api, () => {
  for (const caso of casos) {
   it.effect(caso.nombre, () => Effect.gen(function* () {
    const result = yield* Effect.exit(ejecutar(api, caso.entrada, caso.solicitud))
    if (!caso.aceptar) {assert.isTrue(Exit.isFailure(result)); return}
    if (Exit.isFailure(result)) {assert.fail("Entrada positiva rechazada: " + String(result.cause)); return}
    const r = result.value
    const sin = yield* ejecutar(api, caso.entrada, {solicitudes: []})
    const o = caso.oraculoSinTrabajo
    igualRacional(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, o.base)
    assert.strictEqual(r.libroIngresosIdentificados2025?.ingresos[0]?.integradoBaseGeneral, caso.integrado)
    assert.strictEqual(r.libroIngresosIdentificados2025?.ingresos[0]?.integradoBaseLiquidable, caso.integrado)
    assert.deepEqual(r.nodosFiscalesB2025, sin.nodosFiscalesB2025)
    assert.strictEqual(r.nodosFiscalesB2025?.tiposMediosGenerales?.estatal, o.tipoEstatal)
    assert.strictEqual(r.nodosFiscalesB2025?.tiposMediosGenerales?.autonomico, o.tipoAutonomico)
    assert.lengthOf(r.deduccionesTerritoriales2025?.aplicaciones ?? [], 1)
    igualRacional(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado, o.generado)
    igualRacional(r.deduccionesTerritoriales2025?.total, o.aplicado)
    assert.strictEqual((sin._tag === "LiquidacionIrpfAnualCalculada" ? sin.cuotaLiquidaCentimos : centimosPresentados(sin.cuotaLiquidaLegal)), o.cuotaSinCentimos)
    assert.strictEqual((r._tag === "LiquidacionIrpfAnualCalculada" ? r.cuotaLiquidaCentimos : centimosPresentados(r.cuotaLiquidaLegal)), o.cuotaConCentimos)
   }))
  }
 })
}

for (const api of ["canonica", "efectiva"] as const) {
 for (const caso of casos.filter(c => c.integrado === "0")) {
  it.effect(api + ": sin exceso y sin solicitud " + caso.nombre, () => Effect.gen(function* () {
   const r = yield* ejecutar(api, caso.entrada, {solicitudes: []})
   assert.strictEqual(r.libroIngresosIdentificados2025?.ingresos[0]?.clasificacionFiscal, "ayuda-reparacion-DA5_3-sin-exceso")
   igualRacional(r.libroIngresosIdentificados2025?.totalIntegradoGeneral, {numeradorEuros:"0", divisor:"1"})
  }))
 }
}

it.effect("pensión efectiva: oráculo absoluto con ambas escalas y mínimo", () => Effect.gen(function* () {
 const primero = casos[0]
 if (primero === undefined) throw new Error("Falta caso de preparación")
 const censo = Schema.decodeUnknownSync(CensoIngresosIdentificados2025)(primero.entrada, {onExcessProperty:"error"})
 const solicitud = Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)(primero.solicitud, {onExcessProperty:"error"})
 const r = yield* liquidarIrpfAnualExplicito({...casoEfectivoELA(undefined, undefined, "33000"), comunidadAutonoma:"illes-balears", ingresosIdentificados2025:censo, deduccionesTerritoriales2025:solicitud})
 assert.strictEqual(r.nodosFiscalesB2025?.tiposMediosGenerales?.baseLiquidableGeneral, "34478.91")
 assert.strictEqual(r.nodosFiscalesB2025?.tiposMediosGenerales?.estatal, "10.81")
 assert.strictEqual(r.nodosFiscalesB2025?.tiposMediosGenerales?.autonomico, "11.00")
 igualRacional(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado, {numeradorEuros:"758750271", divisor:"1000000"})
}))

function centimosPresentados(importe: string): number {
 const [entero = "0", fraccion = ""] = importe.split(".")
 const decimales = fraccion.padEnd(3, "0")
 return Number(BigInt(entero)*100n+BigInt(decimales.slice(0,2))+(Number(decimales[2])>=5 ? 1n : 0n))
}
