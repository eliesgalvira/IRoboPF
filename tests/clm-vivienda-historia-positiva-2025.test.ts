import { trabajoActualFixture, proyectarVariantePositiva } from "./fixtures/clm-vivienda-proyeccion"
import { expect, it } from "vitest"
import { Effect, Schema } from "effect"
import Decimal from "decimal.js"
import { SolicitudDeduccionesTerritoriales2025, aplicarDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import type { MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { producirAplicacionViviendaCLM2024 } from "../lib/dominio/irpf/deducciones/clm-vivienda-historia-positiva-2025"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import fixture from "./fixtures/clm-vivienda-aplicacion-2024.json"
import vectores from "./fixtures/clm-vivienda-fracciones.json"
const D = Decimal.clone({ precision: 80 })
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

it("origen2024: base, cuota generada y cuota monetaria no se confunden", () => {
  const r = producir()
  expect(r.origenNormativo).toBe(2021)
  expect(r.origenAplicacion).toBe(2024)
  expect(r.magnitud.valor).toBe("10000.01")
  expect(r.baseAplicada2024).toBe("10000.01")
  expect(r.cuotaGenerada2024).toBe("1500.0015")
  expect(r.cuotaEfectiva2024).toBe("1500.00")
  expect(r.arrastre2025).toBe("0")
})
for (const v of vectores) it("Fraction independiente: " + v.id, () => {
  const raw = proyectarVariantePositiva(v)
  const r = producir(raw)
  expect(new D(r.baseAplicada2024).eq(v.base2024)).toBe(true)
  const marco: MagnitudesTerritorialesAnuales = {
    caso: clasico(sobre({ solicitudes: [raw] }), "castilla-la-mancha"),
    rentasTrabajoAnuales: { integroTrabajo: new D(25000), restoRentas: new D(0), hechosCLM2025: trabajoActualFixture() }, baseGeneral: new D(40000),
    baseAhorro: new D(0), minimoPersonalFamiliar: new D(5550), cuotaAutonomica: new D(10000), sujetosConMinimo: [],
  }
  const s = sobre({ solicitudes: [raw] })
  igual(aplicarDeduccionesTerritoriales2025(s, marco).total, v.generado2025)
  const agotada = aplicarDeduccionesTerritoriales2025(s, { ...marco, cuotaAutonomica: new D(0) })
  igual(agotada.total, "0")
  igual(agotada.aplicaciones[0]?.generado, v.generado2025)
  igual(agotada.aplicaciones[0]?.pendiente, v.generado2025)
})
const adversos: readonly [string, (x: ReturnType<typeof entrada>) => void][] = [
  ["identidad", x => { x.aplicacionViviendaCLM2024.titular = "otro" }],
  ["vivienda", x => { x.aplicacionViviendaCLM2024.vivienda = "otra" }],
  ["municipio", x => { x.aplicacionViviendaCLM2024.compra.municipio = "no-INE" }],
  ["población2024", x => { x.aplicacionViviendaCLM2024.compra.poblacion2024 = 5000 }],
  ["categoría", x => { x.aplicacionViviendaCLM2024.compra.categoria = "intensa" }],
  ["padrón2025", x => { x.aplicacionViviendaCLM2024.compra.poblacion2025++ }],
  ["ocupación", x => { x.aplicacionViviendaCLM2024.compra.ocupacionDesde = "2024-02-30" }],
  ["patrimonio2024", x => {
    const p = x.aplicacionViviendaCLM2024.patrimonioHistorico
    p.cortes2024.movimientos[2]!.importe = "30000"
    p.cortes2024.cuentas[0]!.cierre.importe = "19999.99"
    p.cortes2025.cuentas[0]!.inicio.importe = "19999.99"
    p.cortes2025.cuentas[0]!.cierre.importe = "25000"
  }],
  ["patrimonio2025", x => {
    const e = x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2025
    e.movimientos[2]!.importe = "21000.01"; e.cuentas[0]!.cierre.importe = "28999.99"
  }],
  ["certificado", x => { x.aplicacionViviendaCLM2024.certificados[0]!.integro = "40001" }],
  ["cuota insuficiente", x => {
    x.aplicacionViviendaCLM2024.trabajo.rendimientos[0]!.integro = "10000"
    x.aplicacionViviendaCLM2024.certificados[0]!.integro = "10000"
  }],
  ["pago2025", x => { x.hechos.pagos[0]!.importe = "4999.98" }],
  ["duplicado", x => { x.historiaBases.operaciones.push(x.historiaBases.operaciones[0]!) }],
  ["aplicación distinta", x => { x.aplicacionViviendaCLM2024.documento.referencia = "otra-renta" }],
  ["coste", x => { x.aplicacionViviendaCLM2024.compra.coste = "14000" }],
]
for (const api of ["canonica", "efectiva"] as const) {
  const ejecutar = (s: Sobre) => Effect.gen(function* () {
    if (api === "canonica") return yield* liquidarIrpfAnual(clasico(s, "castilla-la-mancha"), { modo: "canonico" })
    return yield* liquidarIrpfAnualExplicito(efectivo(s, "castilla-la-mancha"))
  })
  for (const v of vectores) it(api + ": variante factual " + v.id, () => {
    const raw = proyectarVariantePositiva(v)
    const r = Effect.runSync(ejecutar(sobre({ solicitudes: [raw] })))
    igual(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado, v.generado2025)
  })
  it(api + ": origen positivo conectado a2025", () => {
    const r = Effect.runSync(ejecutar(sobre({ solicitudes: [entrada()] })))
    igual(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado, "1499997/2000")
  })
  for (const [nombre, cambiar] of adversos) it(api + ": rechaza " + nombre + " sin importe", () => {
    const x = entrada(); cambiar(x)
    // Las dos fronteras deben rechazar también si el contrato falla antes del motor.
    let s: Sobre
    try { s = sobre({ solicitudes: [x] }) } catch { return }
    const r = Effect.runSync(Effect.flip(ejecutar(s)))
    expect(r._tag).toBe("ResultadoNoSoportado")
    expect("importe" in r).toBe(false)
  })
  it(api + ": sin productor no equivale a base cero", () => {
    const { aplicacionViviendaCLM2024: omitida, ...raw } = entrada()
    expect(omitida.ejercicio).toBe(2024)
    const r = Effect.runSync(Effect.flip(ejecutar(sobre({ solicitudes: [raw] }))))
    expect(r._tag).toBe("ResultadoNoSoportado")
  })
}
for (const campo of ["base", "cuota", "saldoFiscal", "baseConsumidaAnterior"])
  it("contrato profundo rechaza magnitud externa " + campo, () => {
    const x = entrada()
    expect(() => sobre({ solicitudes: [{ ...x, aplicacionViviendaCLM2024: { ...x.aplicacionViviendaCLM2024, [campo]: "1" } }] })).toThrow()
    expect(() => sobre({ solicitudes: [{ ...x, aplicacionViviendaCLM2024: { ...x.aplicacionViviendaCLM2024,
      compra: { ...x.aplicacionViviendaCLM2024.compra, [campo]: "1" } } }] })).toThrow()
  })
it("censo negativo no admite otra deducción ni traslado CLM", () => {
  const x = entrada()
  expect(() => sobre({ solicitudes: [{ ...x, aplicacionViviendaCLM2024: { ...x.aplicacionViviendaCLM2024, otrasDeducciones: "residencia-rural" } }] })).toThrow()
  expect(() => sobre({ solicitudes: [{ lote: "D51", codigo: "clm_traslado_vivienda_habitual", aplicacionViviendaCLM2024: x.aplicacionViviendaCLM2024,
    hechos: { fechaTraslado: "2024-01-02", categoria: "extrema", causa: "trabajo", exhaustividad: "completa" } }] })).toThrow()
})

for (const api of ["canonica", "efectiva"] as const) {
  it(api + ": R2 concilia nacimiento con la edad de2025", () => {
    const s = sobre({solicitudes:[entrada()]})
    const c = clasico(s, "castilla-la-mancha")
    const e = Effect.gen(function* () {
      if (api === "canonica") return yield* liquidarIrpfAnual({...c,situacionFamiliar:{...c.situacionFamiliar,edad:80}}, {modo:"canonico"})
      return yield* liquidarIrpfAnualExplicito({...efectivo(s,"castilla-la-mancha"),edad:80})
    })
    const error = Effect.runSync(Effect.flip(e))
    expect(error._tag).toBe("ResultadoNoSoportado")
    expect(JSON.stringify(error)).toContain("nacimiento y edades")
  })
  it(api + ": R3 un certificado nominal no aumenta salario con otro id", () => {
    const x = entrada(), h = x.aplicacionViviendaCLM2024
    h.trabajo.rendimientos.push({...h.trabajo.rendimientos[0]!,id:"duplicado"})
    h.certificados.push({...h.certificados[0]!,rendimiento:"duplicado"})
    const s = sobre({solicitudes:[x]})
    const e = Effect.gen(function* () {
      if (api === "canonica") return yield* liquidarIrpfAnual(clasico(s,"castilla-la-mancha"),{modo:"canonico"})
      return yield* liquidarIrpfAnualExplicito(efectivo(s,"castilla-la-mancha"))
    })
    const error = Effect.runSync(Effect.flip(e))
    expect(error._tag).toBe("ResultadoNoSoportado")
    expect(JSON.stringify(error)).toContain("certificados incompletos/duplicados")
  })
}
