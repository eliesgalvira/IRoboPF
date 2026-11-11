import { proyectarSalarioHistorico, trabajoActualFixture } from "./fixtures/clm-vivienda-proyeccion"
import { expect, it } from "vitest"
import { Effect, Schema } from "effect"
import { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { producirAplicacionViviendaCLM2024 } from "../lib/dominio/irpf/deducciones/clm-vivienda-historia-positiva-2025"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import fixture from "./fixtures/clm-vivienda-aplicacion-2024.json"
import fixtureAgregada from "./fixtures/clm-vivienda-agregada-original.json"
import hechosPatrimoniales from "./fixtures/clm-patrimonio-factual.json"
import { producirPatrimonioHistoricoCLM } from "../lib/dominio/irpf/patrimonio-historico-clm/productor"
import { PatrimonioHistoricoCLM } from "../lib/dominio/irpf/patrimonio-historico-clm/contrato"
import { producirHistoriaBasesD51 } from "../lib/dominio/irpf/deducciones/historia-bases-d51"
type Sobre = typeof SolicitudDeduccionesTerritoriales2025.Type
type Territorio = "castilla-la-mancha"
const sobre = <Entrada>(raw: Entrada): Sobre => Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)(raw, { onExcessProperty: "error" })
const entrada = () => structuredClone(fixture)
const solicitud = (raw = entrada()) => {
  const s = sobre({ solicitudes: [raw] }).solicitudes[0]!
  if (s.lote !== "D51" || s.codigo !== "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales" || s.aplicacionViviendaCLM2024 === undefined)
    throw new Error("Fixture de otra ruta")
  return s
}
const producir = (raw = entrada()) => {
  const s = solicitud(raw)
  return producirAplicacionViviendaCLM2024(s.aplicacionViviendaCLM2024!, s.historiaBases, {
    codigo: s.codigo, titular: "s-1", objeto: "v", fechaOperacion: s.hechos.fechaOperacion,
    pagos: s.hechos.pagos, costePropio: s.hechos.coste,
  }, s.hechos, 30, trabajoActualFixture())
}
function igual(r: { readonly numeradorEuros: string; readonly divisor: string } | undefined, fraccion: string) {
  if (r === undefined) throw new Error("Falta racional")
  const [n, d = "1"] = fraccion.split("/")
  expect(BigInt(r.numeradorEuros) * BigInt(d)).toBe(BigInt(n!) * BigInt(r.divisor))
}
function clasico(s: Sobre, t: Territorio): CasoFiscalAnual {
  return {anio:2025,comunidadAutonoma:t,contribuyenteId:"s-1",situacionFamiliar:{tipo:"individual",edad:30,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:2500000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0,deduccionesTerritoriales2025:s}
}
function efectivo(s: Sobre, t: Territorio): CasoFiscalAnualExplicito {
  return {ejercicio:2025,comunidadAutonoma:t,contribuyenteId:"s-1",edad:30,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s,rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"r",clase:"empleo-laboral",integro:"25000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[]}
}

const factual = (raw = entrada()) => {
  const s = solicitud(raw), h = s.aplicacionViviendaCLM2024!
  return producirPatrimonioHistoricoCLM(h.patrimonioHistorico, s.historiaBases!, {
    titular: "s-1", vivienda: "v", fecha: h.compra.fecha, coste: h.compra.coste,
    escritura: h.compra.escritura, certificados2024: h.certificados, trabajoActual2025: trabajoActualFixture(),
  })
}
const ahorroSinCrecimiento = (x: ReturnType<typeof entrada>) => {
  const p = x.aplicacionViviendaCLM2024.patrimonioHistorico
  p.cortes2024.movimientos[2]!.importe = "40000"
  p.cortes2024.cuentas[0]!.cierre.importe = "9999.99"
  p.cortes2025.cuentas[0]!.inicio.importe = "9999.99"
  p.cortes2025.cuentas[0]!.cierre.importe = "15000"
}
it("Fraction independiente: banco + activo - deuda, crecimiento20000/10000", () => {
  const p = factual()
  expect(p.cortes2024.traza.inicial).toEqual({ numeradorCentimos: "2000000", denominador: "1" })
  expect(p.cortes2024.traza.final).toEqual({ numeradorCentimos: "4000000", denominador: "1" })
  expect(p.cortes2024.traza.deudaFin).toEqual({ numeradorCentimos: "499999", denominador: "1" })
  expect(p.cortes2025.traza.inicial).toEqual(p.cortes2024.traza.final)
  expect(p.cortes2025.traza.final).toEqual({ numeradorCentimos: "5000000", denominador: "1" })
  expect(producir().baseAplicada2024).toBe("10000.01")
  expect(producir().cuotaGenerada2024).toBe("1500.0015")
  expect(producir().cuotaEfectiva2024).toBe("1500.00")
})
it("ahorro previo paga compra; salario consumido no fabrica incremento", () => {
  const x = entrada(); ahorroSinCrecimiento(x)
  expect(factual(x).cortes2024.traza.incremento).toEqual({ numeradorCentimos: "0", denominador: "1" })
  expect(() => producir(x)).toThrow(/incremento patrimonial factual insuficiente/)
})
it("la ruta histórica general sigue rechazando deuda vendedor", () => {
  const s = solicitud()
  expect(() => producirHistoriaBasesD51(s.historiaBases, { codigo: s.codigo, titular: "s-1", objeto: "v",
    fechaOperacion: s.hechos.fechaOperacion, pagos: s.hechos.pagos, costePropio: s.hechos.coste })).toThrow(/financiación/)
})
const adversos: readonly [string, (x: ReturnType<typeof entrada>) => void][] = [
  ["ahorro previo sin crecimiento", ahorroSinCrecimiento],
  ["revalorización no cura crecimiento cero", x => { ahorroSinCrecimiento(x); x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2024.valorVivienda.importe = "900000" }],
  ["salario2025 íntegramente consumido", x => {
    const e = x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2025
    e.movimientos[2]!.importe = "25000"; e.cuentas[0]!.cierre.importe = "25000"
  }],
  ["otro activo no soportado no se omite", x => { x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2024.censo[0]!.tipo = "otro" }],
  ["continuidad rota", x => { x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2025.cuentas[0]!.inicio.importe = "0" }],
  ["deuda vendedor omitida", x => { x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2024.deudaVendedor.cierre.importe = "0" }],
  ["original de deuda inventado", x => { x.aplicacionViviendaCLM2024.patrimonioHistorico.adquisicion.precioAplazado.importeOriginal = "4000" }],
  ["pago duplicado", x => { const e = x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2024; e.movimientos.push(e.movimientos[1]!) }],
  ["soporte repetido con otro id", x => { const e = x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2024; e.movimientos[2]!.documento = e.movimientos[1]!.documento }],
  ["inventario incompleto", x => { x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2024.censo.pop() }],
  ["ISD sin cronología del derecho", x => { x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2024.movimientos[0]!.clase = "herencia" }],
  ["identidad errónea", x => { x.aplicacionViviendaCLM2024.patrimonioHistorico.titular = "otro" }],
  ["HistoriaBases sin financiación contradice vendedor", x => { x.historiaBases.financiacion = "sin-financiacion" }],
  ["pago no coincide con HistoriaBases", x => { x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2025.movimientos[1]!.importe = "4999.98" }],
  ["salario bruto sin neto bancario", x => { x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2024.salarios[0]!.retenciones = "1" }],
  ["trayectoria desordenada", x => { x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2024.movimientos.reverse() }],
]
for (const api of ["canonica", "efectiva"] as const) {
  const ejecutar = (s: Sobre) => Effect.gen(function* () {
    if (api === "canonica") return yield* liquidarIrpfAnual(clasico(s, "castilla-la-mancha"), { modo: "canonico" })
    return yield* liquidarIrpfAnualExplicito(efectivo(s, "castilla-la-mancha"))
  })
  it(api + ": salario nuevo suficiente y deuda vendedor conciliada", () => {
    const r = Effect.runSync(ejecutar(sobre({ solicitudes: [entrada()] })))
    igual(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado, "1499997/2000")
  })
  it(api + ": valoración excluida conserva base/generación", () => {
    const x = entrada()
    x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2024.valorVivienda.importe = "900000"
    x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2025.valorVivienda.importe = "1"
    const r = Effect.runSync(ejecutar(sobre({ solicitudes: [x] })))
    igual(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado, "1499997/2000")
  })
  for (const [nombre, cambiar] of adversos) it(api + ": " + nombre, () => {
    const x = entrada(); cambiar(x)
    // Todos estos adversos son contratos válidos; se exige rechazo económico sin importe.
    const r = Effect.runSync(Effect.flip(ejecutar(sobre({ solicitudes: [x] }))))
    expect(r._tag).toBe("ResultadoNoSoportado")
    expect("importe" in r).toBe(false)
  })
}
it("contrato rechaza patrimonio fiscal agregado y suficiencia literal", () => {
  expect(() => sobre({ solicitudes: [fixtureAgregada] })).toThrow()
  for (const campo of ["sinRevalorizaciones", "patrimonioFinal", "suficiente"])
    expect(() => Schema.decodeUnknownSync(PatrimonioHistoricoCLM)({ ...hechosPatrimoniales, [campo]: "1" }, { onExcessProperty: "error" })).toThrow()
})

for (const api of ["canonica", "efectiva"] as const) {
  it(api + ": el salario2025 del libro no puede sustituir el anual real", () => {
    const s = sobre({ solicitudes: [entrada()] })
    const c = clasico(s, "castilla-la-mancha"), e = efectivo(s, "castilla-la-mancha")
    if (e.perfil !== "solo-trabajo" || e.ejercicio !== 2025) throw new Error("Fixture debe ser trabajo2025")
    const op = Effect.gen(function* () {
      if (api === "canonica") return yield* liquidarIrpfAnual({ ...c, rendimientos: { trabajo: [{ importeIntegroCentimos: 2600000 }] } }, { modo: "canonico" })
      return yield* liquidarIrpfAnualExplicito({ ...e, trabajo: { ...e.trabajo, rendimientos: e.trabajo.rendimientos.map(r => ({ ...r, integro: "26000" })) } })
    })
    const error = Effect.runSync(Effect.flip(op))
    expect(error._tag).toBe("ResultadoNoSoportado"); expect("importe" in error).toBe(false)
  })
  it(api + ": retención2025 del libro concilia con la anual", () => {
    const s = sobre({ solicitudes: [entrada()] })
    const c = clasico(s, "castilla-la-mancha"), e = efectivo(s, "castilla-la-mancha")
    if (e.perfil !== "solo-trabajo" || e.ejercicio !== 2025) throw new Error("Fixture debe ser trabajo2025")
    const op = Effect.gen(function* () {
      if (api === "canonica") return yield* liquidarIrpfAnual({ ...c, retencionesSoportadasCentimos: 100 }, { modo: "canonico" })
      return yield* liquidarIrpfAnualExplicito({ ...e, retenciones: [{ operacionId: "ret", procedencia: "certificado", ejercicio: 2025, importe: "1", efectiva: true }] })
    })
    const error = Effect.runSync(Effect.flip(op))
    expect(error._tag).toBe("ResultadoNoSoportado"); expect("importe" in error).toBe(false)
  })
}

it("suficiencia patrimonial no confunde cuota monetaria con base exacta", () => {
  expect(producir(proyectarSalarioHistorico("21487.59")).cuotaEfectiva2024).toBe("1500.00")
  expect(() => producir(proyectarSalarioHistorico("21487.50"))).toThrow(/cuota insuficiente/)
})
it("la API explícita concilia cotizaciones2025 por rendimiento", () => {
  const s = sobre({ solicitudes: [entrada()] }), e = efectivo(s, "castilla-la-mancha")
  if (e.perfil !== "solo-trabajo" || e.ejercicio !== 2025) throw new Error("Fixture debe ser trabajo2025")
  const error = Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito({ ...e,
    trabajo: { ...e.trabajo, rendimientos: e.trabajo.rendimientos.map(r => ({ ...r,
      cotizaciones: { clase: "efectivas", seguridadSocial: "1", derechosPasivos: "0", colegiosHuerfanos: "0" } })) } })))
  expect(error._tag).toBe("ResultadoNoSoportado"); expect("importe" in error).toBe(false)
})

it("R1: los cortes agregados se rechazan también con nacimiento conciliado", () => {
  const x = entrada(), { patrimonioHistorico: factual, ...h } = x.aplicacionViviendaCLM2024
  expect(factual.version).toBe("clm-patrimonio-factual-2024-2025-v1")
  expect(() => sobre({ solicitudes: [{ ...x, aplicacionViviendaCLM2024: { ...h,
    patrimonio2024: fixtureAgregada.aplicacionViviendaCLM2024.patrimonio2024,
    patrimonio2025: fixtureAgregada.aplicacionViviendaCLM2024.patrimonio2025 } }] })).toThrow()
})
