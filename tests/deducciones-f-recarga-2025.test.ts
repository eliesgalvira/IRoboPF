import { describe, expect, it } from "vitest"
import { evaluarAmpliacionF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025"

const instalacion = {
  id: "inst",
  viviendaId: "v",
  vehiculoId: "vehiculo-particular",
  tipoCoste: "programa2_rd266_2021",
  puestaMarcha: "2025-06-01",
  finalizacion: "2025-06-01",
  facturaFecha: "2025-06-01",
  uso: "particular",
  titulares: ["a"],
  regimenPago: "propio",
  propiedadHastaDevengo: "2025-12-31",
  funcionamientoHastaDevengo: "2025-12-31",
  referenciaPropiedadInstalacion: "titulo-instalacion",
  referenciaMantenimientoDosAnios: "obligacion-identificada",
}

function solicitud(
  importeEUR = "1000",
  cambios: Partial<typeof instalacion> = {},
  ayudasEUR = "0"
) {
  return {
    tipo: "territorial_f_ampliacion_2025",
    codigo: "murcia_recarga_vehiculos_electricos",
    contexto: {
      ejercicio: 2025,
      territorio: "murcia",
      contribuyente: "a",
      modalidad: "individual",
    },
    hechos: {
      bases: [{ id: "a", generalEUR: "20000", ahorroEUR: "0" }],
      miembrosUnidad: ["a"],
      elecciones: [],
      viviendas: [{
        id: "v", territorio: "murcia", adquisicion: "2024-01-01",
        porcentajePropiedad: "100", titulares: ["a"],
      }],
      instalaciones: [{ ...instalacion, ...cambios }],
      pagos: [{
        id: "p", fecha: "2025-06-01", importeEUR, ayudasEUR,
        concepto: "infraestructura_recarga", objetoId: "inst", pagador: "a",
        factura: "factura-instalacion", soportePago: "pago-identificado",
      }],
    },
  }
}

describe("Recarga Murcia: criterio AEAT 2025 y hechos de instalación", () => {
  // Manual AEAT:100% de base, máximo4000. Sin ayudas ni reparto entre titulares.
  it.each([
    ["0", "0"], ["123.45", "123.45"], ["1000", "1000"],
    ["3999.99", "3999.99"], ["4000", "4000"], ["4000.01", "4000"],
  ])("deduce %s con resultado exacto %s", (gasto, esperado) => {
    const r = evaluarAmpliacionF2025(solicitud(gasto))
    expect(r.estado, r.motivo).toBe("calculo_parcial")
    expect(r.importeAntesPresentacionEUR).toBe(esperado)
    expect(r.dependenciaAnual).toBeUndefined()
  })
  it.each([
    { finalizacion: "2026-01-01" },
    { facturaFecha: "2026-01-01" },
    { puestaMarcha: "2026-01-01" },
    { finalizacion: "2024-12-31" },
    { uso: "profesional" },
    { titulares: ["b"] },
    { titulares: ["a", "b"] },
    { regimenPago: "gananciales" },
    { propiedadHastaDevengo: "2025-06-30" },
    { funcionamientoHastaDevengo: "2025-06-30" },
    { referenciaPropiedadInstalacion: "" },
    { referenciaMantenimientoDosAnios: "" },
  ])("no emite importe para hechos fuera de la rama: %j", (cambios) => {
    const r = evaluarAmpliacionF2025(solicitud("1000", cambios))
    expect(r.estado).not.toBe("calculo_parcial")
    expect(r.importe).toBeUndefined()
  })
  it("separa ayudas cuyo tratamiento requiere conciliación", () => {
    const r = evaluarAmpliacionF2025(solicitud("1000", {}, "100"))
    expect(r.estado).toBe("no_soportado")
    expect(r.importe).toBeUndefined()
  })
})
