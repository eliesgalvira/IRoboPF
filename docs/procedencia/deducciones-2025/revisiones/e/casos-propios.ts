import assert from "node:assert/strict"
import { evaluarCeliaquiaRioja, totalDeduccionesEvaluadas, type PersonaCeliacaRioja } from "../../../../../lib/dominio/irpf/deducciones/contratos-2025"

const contexto = { ejercicio: 2025, territorio: "la-rioja", contribuyente: "a", modalidad: "individual" } as const
const certificado = { referencia: "supuesto", medico: "facultativo ficticio", colegiado: "ficticio", especialidad: "digestivo", fechaEmision: "2026-02-01", fechaDiagnostico: "2025-12-31", diagnostico: "definitivo", ejercicioMedico: "activo" } as const
const persona = (cambio: Partial<PersonaCeliacaRioja> = {}): PersonaCeliacaRioja => ({ id: "a", relacion: "contribuyente", titularesDelMinimo: [], titularesDeduccion: ["a"], certificado, ...cambio })
const cuota = (p: PersonaCeliacaRioja, conjunta = false) => evaluarCeliaquiaRioja({ ...contexto, modalidad: conjunta ? "conjunta" : "individual" }, [p])
assert.deepEqual(cuota(persona()), { estado: "calculo_parcial", importe: 250, motivo: "Cuantía y reparto 2025; derecho al mínimo y vínculo conyugal aportados externamente, no evaluados aquí", aceptacionFiscal: "pendiente" })
// Un cónyuge también puede tener derecho por la misma persona. El positivo del lote
// puede ser admisible bajo este hecho, aunque su entrada no lo documenta.
assert.equal((cuota(persona({ titularesDeduccion: ["a", "b"] })) as {importe:number}).importe, 125)
for (const relacion of ["descendiente", "ascendiente"] as const) {
  const p = persona({ id: "familiar", relacion, titularesDelMinimo: ["a", "b"], titularesDeduccion: ["a", "b"] })
  assert.equal((cuota(p) as {importe:number}).importe, 125)
  assert.equal((cuota({ ...p, titularesDelMinimo: ["b"] }) as {importe:number}).importe, 0)
  assert.equal((cuota(p, true) as {importe:number}).importe, 125)
}
assert.equal((cuota(persona({ certificado: { ...certificado, fechaDiagnostico: "2026-01-01" } })) as {importe:number}).importe, 0)
assert.equal(cuota(persona({ certificado: null })).estado, "no_soportado")
assert.equal(cuota(persona({ certificado: {...certificado, fechaDiagnostico: "2025-02-30"} })).estado, "no_soportado")
assert.equal(totalDeduccionesEvaluadas(contexto, [{ tipo: "rioja_celiaquia", contexto, personas: [persona()] }]).estado, "no_soportado")
// Oráculo documental, no evaluación del producto: artículo 5.Dos y tablas AEAT 365–366.
const tramo = (general: number, ahorro: number, minimo: number, posterior = false) => {
  const neta = general + ahorro - minimo
  return neta <= 22000 ? 360 : posterior && neta > 31000 ? 0 : 300
}
assert.equal(tramo(27000, 1000, 6000), 360)
assert.equal(tramo(27000.01, 1000, 6000), 300)
assert.equal(tramo(36000, 1000, 6000, true), 300)
assert.equal(tramo(36000.01, 1000, 6000, true), 0)
assert.equal(tramo(36000.01, 1000, 6000), 300)
console.log("Controles propios conformes; pendiente el caso rojo de coherencia del certificado")
// Un certificado emitido en enero no puede recoger como definitivo un diagnóstico
// fechado en diciembre siguiente. No imponer emisión en 2025: puede emitirse en 2026.
const contradictorio = cuota(persona({ certificado: { ...certificado, fechaEmision: "2025-01-01" } }))
console.log(JSON.stringify({ caso: "certificado-anterior-al-diagnostico", observado: contradictorio, esperado: "no_soportado" }))
assert.equal(contradictorio.estado, "no_soportado")
