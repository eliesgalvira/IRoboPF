import assert from "node:assert/strict"
import { evaluarCeliaquiaRioja, totalDeduccionesEvaluadas, type PersonaCeliacaRioja } from "../../../../../lib/dominio/irpf/deducciones/contratos-2025"

// Descendiente común con mínimo acreditado externamente para ambos titulares.
for (const contribuyente of ["a", "b"]) {
  for (const modalidad of ["individual", "conjunta"] as const) {
    const contexto = { ejercicio: 2025, territorio: "la-rioja", contribuyente, modalidad }
    for (const [diagnostico, emision, estado] of [
      ["2025-06-15", "2025-06-14", "no_soportado"],
      ["2025-06-15", "2025-06-15", "calculo_parcial"],
      ["2025-06-15", "2026-01-10", "calculo_parcial"],
    ]) {
      const persona: PersonaCeliacaRioja = {
        id: "hijo-comun", relacion: "descendiente",
        titularesDelMinimo: ["a", "b"], titularesDeduccion: ["a", "b"],
        certificado: { referencia: "sintetica", medico: "facultativo ficticio",
          colegiado: "ficticio", especialidad: "digestivo", diagnostico: "definitivo",
          ejercicioMedico: "activo", fechaDiagnostico: diagnostico, fechaEmision: emision },
      }
      const resultado = evaluarCeliaquiaRioja(contexto, [persona])
      assert.equal(resultado.estado, estado)
      if (resultado.estado === "calculo_parcial") {
        assert.equal(resultado.importe, 125)
        assert.equal(totalDeduccionesEvaluadas(contexto, [
          { tipo: "rioja_celiaquia", contexto, personas: [persona] },
        ]).estado, "no_soportado")
      }
    }
  }
}
console.log("12 combinaciones conformes; parcial por titular y agregado bloqueado")
