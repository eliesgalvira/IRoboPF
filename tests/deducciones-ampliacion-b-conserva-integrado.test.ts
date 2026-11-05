import { expect, it } from "vitest"
import { evaluarHechosB2025 } from "../lib/dominio/irpf/deducciones/asturias-cantabria-hechos-2025"
import { ast, doc, pago } from "./asturias-cantabria-ampliacion-fixtures"
// Regresión RBM01, contra el módulo CANÓNICO integrado; no importa la entrega privada anterior.
it("forestal integrado reparte antes de aplicar máximo personal:6000/2 al30%=900", () => {
  const x = evaluarHechosB2025(ast, {
    codigo: "asturias_certificacion_gestion_forestal_sostenible",
    monte: "MONTE1",
    municipioAsturias: "33001",
    fechaAdquisicionMonte: "2020-01-01",
    propietarios: ["A", "B"],
    certificacion: doc,
    emisor: "entidad_regional",
    pagosCertificacion: [pago("3000"), pago("3000", "P2", "B")],
    subvenciones: "0",
    reparto: { titulares: ["A", "B"], exhaustividadTitulares: "completa" },
  })
  expect(x.estado).toBe("calculo_parcial")
  if (x.estado === "calculo_parcial")
    expect(BigInt(x.importeExacto.numeradorEuros)).toBe(
      900n * BigInt(x.importeExacto.divisor)
    )
})
