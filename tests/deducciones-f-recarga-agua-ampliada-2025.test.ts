import { describe, expect, it } from "vitest"
import { evaluarAmpliacionF2025 as evaluar } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025"

const instalacion = {
  id: "inst", viviendaId: "v", vehiculoId: "veh", tipoCoste: "programa2_rd266_2021",
  puestaMarcha: "2025-06-01", finalizacion: "2025-06-01", facturaFecha: "2025-06-01",
  uso: "particular", titulares: ["a"], regimenPago: "propio",
  propiedadHastaDevengo: "2025-12-31", funcionamientoHastaDevengo: "2025-12-31",
  referenciaPropiedadInstalacion: "titulo_inst", referenciaMantenimientoDosAnios: "obligacion2",
}
const inmueble = {
  id: "v", territorio: "murcia", adquisicion: "2020-01-01", titulares: ["a"], porcentajePropiedad: "100",
  ocupacionDesde: "2020-01-01", permanenciaHasta: "2025-12-31",
  reconocimientoAhorroAgua: "resolucion_region", fechaReconocimientoAhorroAgua: "2025-01-01",
  reconocimientoAhorroAguaTitular: "a", reconocimientoAhorroAguaVivienda: "v",
  organoReconocimientoAhorroAgua: "administracion_regional_murcia",
  ahorroAguaDispositivo: "dispositivo_identificado_art4_en_resolucion",
}
const pago = (concepto: string, importeEUR = "1000", objetoId = "inst") => ({
  id: "p", fecha: "2025-06-01", importeEUR, ayudasEUR: "0", concepto, objetoId,
  pagador: "a", factura: "factura", soportePago: "pago",
})
function solicitud<T extends object>(codigo: string, hechos: T) {
  return { tipo: "territorial_f_ampliacion_2025", codigo,
    contexto: { ejercicio: 2025, territorio: "murcia", contribuyente: "a", modalidad: "individual" },
    hechos: { viviendas: [inmueble], instalaciones: [instalacion], pagos: [pago("infraestructura_recarga")], ...hechos },
  }
}

describe("Recarga: contrato anual sin cuota alternativa", () => {
  it("ordena entre vehículo y renovables y conserva seguimiento2/arrastre3", () => {
    const r = evaluar(solicitud("murcia_recarga_vehiculos_electricos", {}))
    expect(r.importe).toBe(1000)
    expect(r.aceptacionFiscal).toBe("pendiente")
    expect(r.aplicacionAnualRecarga).toMatchObject({
      ejercicioOrigen: 2025, limiteBaseEUR: "4000", limite: "por_infraestructura_y_contribuyente",
      orden: { despuesDe: ["deducciones_sin_arrastre", "murcia_vehiculos_electricos"], antesDe: "murcia_instalaciones_recursos_energeticos_renovables" },
      arrastre: { periodosPosteriores: 3, ultimoEjercicio: 2028 },
      seguimiento: { desde: "2025-06-01", hasta: "2027-06-01", fechaCorte: "2025-12-31", estado: "obligacion_futura_pendiente" },
    })
    expect(r.citas).toContain("f-aeat2025-recarga-cuantia")
    expect(r.dependenciaAnual).toBeUndefined()
  })
  it("un título de vehículo ajeno no afecta: la titularidad exigida es instalación/finca", () => {
    const r = evaluar(solicitud("murcia_recarga_vehiculos_electricos", { instalaciones: [{ ...instalacion, vehiculoId: "vehiculo_uso_particular_de_otro" }] }))
    expect(r.importe).toBe(1000)
  })
  it("gananciales documentados:10000/2, máximo4000 por contribuyente", () => {
    const r = evaluar(solicitud("murcia_recarga_vehiculos_electricos", {
      instalaciones: [{ ...instalacion, titulares: ["a", "b"], regimenPago: "gananciales", referenciaRegimenEconomico: "matrimonio_ganancial", alcancePagos: "todos_los_costes_instalacion", inversionesPorTitular: [{ id: "a", importeEUR: "10000" }, { id: "b", importeEUR: "0" }] }],
      pagos: [pago("infraestructura_recarga", "10000")],
    }))
    expect(r.importe).toBe(4000)
  })
  it("pagos separados documentados: cada uno deduce su gasto, no mitad automática", () => {
    const r = evaluar(solicitud("murcia_recarga_vehiculos_electricos", {
      instalaciones: [{ ...instalacion, titulares: ["a", "b"], regimenPago: "pagos_separados", referenciaRegimenEconomico: "copropiedad", alcancePagos: "todos_los_costes_instalacion", inversionesPorTitular: [{ id: "a", importeEUR: "600" }, { id: "b", importeEUR: "400" }] }],
      pagos: [pago("infraestructura_recarga", "600"), { ...pago("instalacion_electrica", "400"), id: "pb", pagador: "b" }],
    }))
    expect(r.importe).toBe(600)
  })
  it("no acepta aportaciones que no concilian con pagos", () => {
    const r = evaluar(solicitud("murcia_recarga_vehiculos_electricos", {
      instalaciones: [{ ...instalacion, titulares: ["a", "b"], regimenPago: "gananciales", referenciaRegimenEconomico: "matrimonio", alcancePagos: "todos_los_costes_instalacion", inversionesPorTitular: [{ id: "a", importeEUR: "600" }, { id: "b", importeEUR: "400" }] }],
    }))
    expect(r.siguienteHecho).toBe("inversionesPorTitular"); expect(r.importe).toBeUndefined()
  })
  it.each([
    { puestaMarcha: "2025-02-29" }, { finalizacion: "2025-06-02" },
    { propiedadHastaDevengo: "2027-06-01" }, { funcionamientoHastaDevengo: "2027-06-01" },
  ])("no confunde fechas ni obligación futura con hechos: %j", cambios => {
    const r = evaluar(solicitud("murcia_recarga_vehiculos_electricos", { instalaciones: [{ ...instalacion, ...cambios }] }))
    expect(r.importe).toBeUndefined()
  })
  it("rechaza una segunda infraestructura, sin elegir automáticamente", () => {
    const r = evaluar(solicitud("murcia_recarga_vehiculos_electricos", { instalaciones: [instalacion, { ...instalacion, id: "otra" }] }))
    expect(r.siguienteHecho).toBe("instalaciones"); expect(r.importe).toBeUndefined()
  })
  it("no tiene propiedad quien declara porcentaje0 aunque figure en lista", () => {
    const r = evaluar(solicitud("murcia_recarga_vehiculos_electricos", { viviendas: [{ ...inmueble, porcentajePropiedad: "0" }] }))
    expect(r.importe).toBeUndefined()
  })
  it("producción local exclusiva <=capacidad sí; conexión parcial no", () => {
    const datos = { ...instalacion, generacionExclusiva: "si", potenciaProduccionKW: 3.5, potenciaRecargaKW: 7.4 }
    const positivo = evaluar(solicitud("murcia_recarga_vehiculos_electricos", { instalaciones: [datos], pagos: [pago("generacion_almacenamiento_local")] }))
    expect(positivo.importe).toBe(1000)
    const negativo = evaluar(solicitud("murcia_recarga_vehiculos_electricos", { instalaciones: [{ ...datos, generacionExclusiva: "no" }], pagos: [pago("generacion_almacenamiento_local")] }))
    expect(negativo.importe).toBeUndefined()
  })
})

describe("Agua: criterio AEAT sin enmendar Cuatro.3=>Uno.5", () => {
  // AEAT2025:20%, base anual300, máximo60; el reconocimiento identifica dispositivo y vivienda.
  it.each([["0",0],["100",20],["299.99",60],["300",60],["400",60]] as const)("inversión%s =>%s", (importeEUR, esperado) => {
    const r = evaluar(solicitud("murcia_dispositivos_ahorro_agua", { pagos: [pago("dispositivo_ahorro_agua", importeEUR, "v")] }))
    expect(r.estado,r.motivo).toBe("calculo_parcial"); expect(r.importe).toBe(esperado)
    expect(r.dependenciaAnual).toBeUndefined(); expect(r.reservas.join()).toContain("F-N03 literal")
    expect(r.citas).toContain("f-aeat2025-agua-habitualidad")
  })
  it("gastos propios no se vuelven a repartir por porcentaje de propiedad", () => {
    const r = evaluar(solicitud("murcia_dispositivos_ahorro_agua", { viviendas: [{ ...inmueble, porcentajePropiedad: "50", titulares: ["a","b"] }], pagos: [pago("instalacion_ahorro_agua", "100", "v")] }))
    expect(r.importe).toBe(20)
  })
  it("residencia exactamente3 años está consolidada", () => {
    const r = evaluar(solicitud("murcia_dispositivos_ahorro_agua", { viviendas: [{ ...inmueble, ocupacionDesde: "2022-12-31" }], pagos: [pago("dispositivo_ahorro_agua", "100", "v")] }))
    expect(r.importe).toBe(20)
  })
  it("traslado laboral documentado antes3 años mantiene habitualidad operativa", () => {
    const r = evaluar(solicitud("murcia_dispositivos_ahorro_agua", { viviendas: [{ ...inmueble, ocupacionDesde: "2024-01-01", permanenciaHasta: "2025-08-01", excepcionHabitualidad: "traslado_laboral", fechaCambioHabitualidad: "2025-08-01", referenciaCircunstanciaCambio: "traslado_documentado" }], pagos: [pago("dispositivo_ahorro_agua", "100", "v")] }))
    expect(r.importe).toBe(20)
  })
  it.each([
    { ocupacionDesde: "2023-01-01" }, { fechaReconocimientoAhorroAgua: "2026-01-01" },
    { reconocimientoAhorroAguaTitular: "b" }, { reconocimientoAhorroAguaVivienda: "otra" },
    { organoReconocimientoAhorroAgua: "otra_administracion" }, { fechaReconocimientoAhorroAgua: "2025-02-29" },
    { reconocimientoAhorroAgua: "" },
  ])("requiere el hecho concreto sin emitir cero: %j", cambios => {
    const r = evaluar(solicitud("murcia_dispositivos_ahorro_agua", { viviendas: [{ ...inmueble, ...cambios }], pagos: [pago("dispositivo_ahorro_agua", "100", "v")] }))
    expect(r.estado).toBe("no_soportado"); expect(r.importe).toBeUndefined(); expect(r.siguienteHecho).toBeDefined()
  })
  it("no reabre patrimonio final/final de vivienda joven", () => {
    const r = evaluar(solicitud("murcia_vivienda_jovenes_hasta_40", { nacimientoContribuyente: "2000-01-01", bases: [{ id: "a", generalEUR: "20000", ahorroEUR: "0" }], elecciones: [], pagos: [pago("adquisicion_vivienda", "6000", "v")] }))
    expect(r.importe).toBeUndefined(); expect(r.reservas.join()).toContain("F-N02")
  })
})
