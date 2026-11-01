import { expect, it } from "vitest"
import { Effect, Schema } from "effect"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import casos from "../docs/procedencia/implementaciones/redondeo-salarial-open/recorridos.json"

// Expectativas racionales estáticas con etapas Open; se conserva el JSON analítico histórico.
it.each(casos)("recorrido real: $nombre", ({ entrada, esperado, lineas }) => {
  const copia = structuredClone(entrada)
  const admitida = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(entrada)
  const r = Effect.runSync(liquidarIrpfAnualExplicito(admitida))
  expect(r).toMatchObject({
    ...esperado,
    _tag: "LiquidacionIrpfAnualExplicitaCalculada",
    ejercicio: 2025,
    perfil: "solo-trabajo",
    alcance: "individual-madrid-18-a-64-sin-familiares-ni-discapacidad",
    aceptacionFiscal: "pendiente",
  })
  expect(r.rastro.contexto).toEqual({ anio: 2025, territorio: "madrid", perfilCalculo: "solo-trabajo" })
  expect(r.rastro.pasos).toHaveLength(2)
  expect(r.rastro.pasos.map(p => p.lineasCalculo?.length)).toEqual([5, 10])
  const reales = r.rastro.pasos.flatMap(p => p.lineasCalculo ?? [])
  expect(reales.map(l => ({ siteId: l.origen?.siteId, decimal: l.origen?.decimal, presentado: l.resultado }))).toEqual(lineas)
  expect(new Set(reales.map(l => l.origen?.instanceId)).size).toBe(15)
  for (const linea of reales) {
    expect(linea.origen?.unidad).toBe("EUR")
    expect(linea.origen?.instanceId).toBe(`${linea.origen?.siteId}.0`)
    expect(linea.formula.length).toBeGreaterThan(0)
    expect(linea.procedencia?.estado).toBe("enlazada")
  }
  expect(entrada).toEqual(copia)
})

function liquidarJavaScript<Entrada extends { readonly ejercicio: number }>(entrada: Entrada) {
  // @ts-expect-error Prueba deliberada de la admisión runtime sin garantía estática.
  return Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(entrada)))
}

const base = casos[0]!.entrada
it.each([
  { ejercicio: 2024 }, { ejercicio: 2026 }, { edad: 17 }, { edad: 65 },
  { comunidadAutonoma: "cataluna" }, { modalidad: "conjunta" },
  { residenciaTodoElAnio: false }, { devengo: "2025-06-30" },
  { otrasRentas: "presentes" }, { familiaresConDerechoMinimo: "presentes" },
  { discapacidad: "presente" }, { reduccionesBase: "presentes" },
  { saldosAnteriores: "presentes" }, { deducciones: "otras" },
  { rentasExtranjeras: "presentes" }, { especialidades: "presentes" },
  { conciliacion: undefined }, { perfil: "solo-actividad-eds" },
  { pagosACuentaCentimos: 300000 },
])("rechaza alcance o campos ausentes: %j", cambio => {
  expect(liquidarJavaScript({ ...base, ...cambio })).toMatchObject({
    _tag: "Failure", failure: { _tag: "ResultadoNoSoportado" },
  })
})

it.each([
  { importe: "-1" }, { importe: "1.001" }, { importe: "1e3" },
  { importe: 100 }, { efectiva: false }, { ejercicio: 2024 },
  { procedencia: " " }, { operacionId: " " },
])("rechaza retención incompleta o mal expresada: %j", cambio => {
  expect(liquidarJavaScript({ ...base, retenciones: [{ ...base.retenciones[0], ...cambio }] })).toMatchObject({
    _tag: "Failure", failure: { _tag: "ResultadoNoSoportado" },
  })
})
it("rechaza operación repetida aunque tenga el mismo importe", () => {
  expect(liquidarJavaScript({ ...base, retenciones: [base.retenciones[0], base.retenciones[0]] })).toMatchObject({
    _tag: "Failure", failure: { motivo: "Operación de retención duplicada" },
  })
})
it.each(["estimadas", "desconocidas"])("rechaza cotizaciones %s", clase => {
  const primero = base.trabajo.rendimientos[0]!
  expect(liquidarJavaScript({ ...base, trabajo: { ...base.trabajo, rendimientos: [{ ...primero, cotizaciones: { ...primero.cotizaciones, clase } }] } })).toMatchObject({
    _tag: "Failure", failure: { _tag: "ResultadoNoSoportado" },
  })
})
it("retenciones efectivas alteran solo pagos y diferencial, sin recalcular tipo AEAT", () => {
  const admitida = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(base)
  if (admitida.perfil !== "solo-trabajo") throw new Error("El ejemplo debe ser salarial")
  const antes = Effect.runSync(liquidarIrpfAnualExplicito(admitida))
  const despues = Effect.runSync(liquidarIrpfAnualExplicito({ ...admitida, retenciones: [] }))
  expect(despues).toMatchObject({ cuotaPosterior: antes.cuotaPosterior, cuotaLiquidaLegal: antes.cuotaLiquidaLegal, baseLiquidableGeneral: antes.baseLiquidableGeneral, retenciones: "0", cuotaDiferencial: "4333.92" })
})
