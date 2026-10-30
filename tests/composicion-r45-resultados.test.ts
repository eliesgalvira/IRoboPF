import { expect, it } from "vitest"
import { Effect } from "effect"
import { produceComposition } from "../scripts/procedencia/composicion-r43"
import { captureFinite, createResultConsumer, consumeRetentionResult, preserveFailureOperands } from "../scripts/procedencia/composicion-r45-resultados"
import { calcularRetencionTrabajoAeat } from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat"
import type { CasoRetencionTrabajo } from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat"

const candidate = produceComposition()
const subcase: CasoRetencionTrabajo = { anio: 2020, edad: 40, retribucionAnualCentimos: 4020000, cotizacionesCentimos: 20000, situacionFamiliar: "situacion3", situacionLaboral: "activo", contrato: "general", descendientes: [], ascendientes: [], discapacidad: "sin-discapacidad" }
for (const modo of ["canonico", "compatible-legacy"] as const) {
 for (const bruto of [0, 4020000]) {
  it(`normaliza éxito ${modo}, bruto propio ${bruto}`, () => {
   const input = { ...subcase, retribucionAnualCentimos: bruto }
   const expected = Effect.runSync(calcularRetencionTrabajoAeat(input, { modo }))
   const actual = consumeRetentionResult(candidate.fragments.retenciones, input, { modo })
   expect(actual.status).toBe("success")
   if (actual.status !== "success") throw Error("Sin resultado utilizable")
   expect(actual.value).toEqual(expected)
  })
 }
 for (const procedimiento of ["inicial", "regularizacion"] as const) {
  it(`conserva payload de rechazo ${modo}, ${procedimiento}`, () => {
   const input = { ...subcase, retribucionAnualCentimos: procedimiento === "inicial" ? -1 : 4020000, procedimiento }
   const expected = Effect.runSync(Effect.result(calcularRetencionTrabajoAeat(input, { modo })))
   expect(expected._tag).toBe("Failure")
   const actual = consumeRetentionResult(candidate.fragments.retenciones, input, { modo })
   expect(actual.status).toBe("fail")
   if (actual.status !== "fail" || expected._tag !== "Failure") throw Error("Rechazo perdido")
   expect(actual.payload).toEqual(expected.failure)
   expect(actual.operation).toContain(":call")
  })
 }
}
it("no ejecuta la retención ausente ni produce cero", () => {
 expect(consumeRetentionResult(candidate.fragments.retenciones, undefined, { modo: "canonico" })).toEqual({ status: "not-reached", operation: "calcularRetencionTrabajoAeatImpl", condition: "subcase-absent" })
})
it("no clasifica un Error con texto fiscal como fail", () => {
 const actual = captureFinite("primitive", () => { throw Error("ResultadoNoSoportado: desconocido") })
 expect(actual.status).toBe("defect")
 expect(actual).not.toHaveProperty("value")
})
it("no modifica el fragmento original ni ningún operando de la señal fail", () => {
 const original = structuredClone(candidate.fragments.retenciones)
 const adapted = preserveFailureOperands(candidate.fragments.retenciones)
 expect(candidate.fragments.retenciones).toEqual(original)
 const rewritten = adapted.program.filter((n: { op: string; id: string; args: string[] }) => n.op === "throw" && n.args[0]?.endsWith("::r45:signal"))
 expect(rewritten.length).toBeGreaterThan(0)
 for (const node of rewritten) {
  const before = original.program.find((n: { id: string }) => n.id === node.id)
  const field = adapted.program.find((n: { id: string }) => n.id === node.id + "::r45:field:payload")
  expect(field.args).toEqual([before.args[1]])
  expect(node.source).toEqual(before.source)
 }
})

import type { CasoActividad2025 } from "../lib/dominio/irpf/actividades-economicas/contrato"
import { calcularActividad2025 } from "../lib/dominio/irpf/actividades-economicas/calcular"
import { consumeActivityResult } from "../scripts/procedencia/composicion-r45-resultados"
function casoBase(): CasoActividad2025 {
  return {
    ejercicio: 2025,
    territorio: "comun",
    individual: true,
    actividadId: "profesion",
    iae: "servicios",
    fechaInicio: "2025-01-01",
    fechaFin: "2025-12-31",
    serviciosOrdinarios: true,
    hechos: {
      otrasActividades: false,
      otrasRentas: false,
      existencias: false,
      empleados: false,
      artistica: false,
      irregular: false,
      subvenciones: false,
      transmisiones: false,
      extranjero: false,
      mutualidad: false,
      especialidadesTerritoriales: false,
      saldosPendientes: false,
      serviciosGratuitos: false,
      autoconsumo: false,
      noFacturados: false,
      subvalorados: false,
      trade: false,
      hechosDesconocidos: false,
    },
    historial: [],
    actividadPreviaAlInicio: "ausente",
    regimen2025: "eds",
    criterio2025: "devengo",
    documentoCriterio2025: "alta",
    renuncia2025: false,
    exclusion2025: false,
    volumen2024: "0",
    diasActividad2024: 0,
    documentoVolumen2024: "sin-actividad",
    clientes: [
      {
        id: "cliente",
        vinculado: false,
        empleadorEnAnioAnteriorAlInicio: false,
        documento: "contrato",
      },
    ],
    ingresos: [],
    gastos: [],
    reta: [],
    activos: [],
    obligacionesFormales: true,
    documentoObligaciones: "libros",
    discapacidad: {
      grado: 0,
      ayudaOMovilidad: false,
      ejercicioEfectivo: true,
      documento: "sin-discapacidad",
    },
    opcion: "gastos-dificiles",
    aplicarRentasBajas: true,
    aplicarInicio: false,
    retenciones: [],
    pagosFraccionados: [],
  }
}

for (const opcion of ["gastos-dificiles", "cliente-unico"] as const) {
 it(`actividad ${opcion}: conserva íntegros resultado y etapas`, () => {
  const input: CasoActividad2025 = { ...casoBase(), opcion, ingresos: [{ id: "factura", justificante: "factura", fecha: "2025-06-01", base: "24000", iva: "0", ivaRecuperable: "0", afectacionExclusiva: true, registrado: true, categoria: "servicio", clienteId: "cliente", sujetoRetencion: true, rectificativa: false }] }
  const expected = calcularActividad2025(input)
  const actual = consumeActivityResult(candidate.fragments.rentas, input)
  expect(actual.status).toBe("success")
  if (actual.status !== "success") throw Error("Actividad perdida")
  expect(actual.value).toEqual(expected)
  if (actual.value.estado !== "soportado") throw Error("Sin aporte")
  expect(actual.value.aporte.importeEurosExactos).toBe(opcion === "cliente-unico" ? "22000" : "22800")
  expect(actual.value.aporte.retencionesEuros).toBe("0")
  expect(actual.value.aporte.pagosFraccionadosEuros).toBe("0")
 })
 it(`actividad ${opcion}: rechazo conserva lista de motivos`, () => {
  const input = { ...casoBase(), opcion, territorio: "foral" as const }
  const actual = consumeActivityResult(candidate.fragments.rentas, input)
  expect(actual.status).toBe("fail")
  if (actual.status !== "fail") throw Error("Rechazo perdido")
  expect(actual.payload).toEqual(calcularActividad2025(input))
  expect(actual).not.toHaveProperty("value")
 })
}
it("una señal textual falsificada sigue siendo defecto", () => {
 const actual = captureFinite("unknown", () => { throw { r45Failure: "composicion-r45:finite-effect-fail:v1", operation: "fake", payload: { _tag: "ResultadoNoSoportado" } } })
 expect(actual.status).toBe("defect")
})
it("defecto real legacy fuera del tipo anual: nunca resultado utilizable", () => {
 // Mutación JS negativa deliberada fuera de AnioFiscal; no concede admisión.
 const input: CasoRetencionTrabajo = { ...subcase }
 Object.assign(input, { anio: 1900 })
 const expected = Effect.runSync(Effect.exit(calcularRetencionTrabajoAeat(input, { modo: "compatible-legacy" })))
 expect(expected._tag).toBe("Failure")
 expect(consumeRetentionResult(candidate.fragments.retenciones, input, { modo: "compatible-legacy" }).status).toBe("defect")
})

it("el consumidor verificado mantiene cerradas las cuatro puertas", () => {
 const consumer = createResultConsumer(candidate)
 expect([consumer.admissionClosed, consumer.siteClosed, consumer.wiringAllowed, consumer.completeRuleAcceptance]).toEqual([false, false, false, false])
 expect(consumer.retention(undefined, { modo: "canonico" }).status).toBe("not-reached")
 const changed = structuredClone(candidate)
 changed.links[0]!.producer = "otra-raiz"
 expect(() => createResultConsumer(changed)).toThrow()
})
