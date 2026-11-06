import Decimal from "decimal.js"
import { DateTime, Effect, Result, Schema } from "effect"
import { describe, expect, it } from "vitest"
import { aplicarDeduccionesTerritoriales2025 as aplicar, type MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { SolicitudAnualF2025, type SolicitudAnualF2025 as Solicitud } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual"
import { evaluarAmpliacionF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025"
import { consumirCuotaAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-cuota"
import { racional, sumar } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import { D, sumarRepartoExactoF, salidaExactaF } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/comun"

const m = (cuota = "100", territorio: "madrid" | "murcia" = "murcia"): MagnitudesTerritorialesAnuales => ({
  caso: { anio: 2025, comunidadAutonoma: territorio, contribuyenteId: "s-1",
    situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } },
  baseGeneral: new Decimal("20000.0000000000000000000000000000000000000001"),
  baseAhorro: new Decimal(0), minimoPersonalFamiliar: new Decimal(5550),
  basesLiquidables: { general: new Decimal("20000.0000000000000000000000000000000000000001"), ahorro: new Decimal(0) },
  cuotaAutonomica: new Decimal(cuota), sujetosConMinimo: [],
})
const vivienda = {
  id: "v", territorio: "murcia", adquisicion: "2020-01-01", porcentajePropiedad: "100", titulares: ["s-1"],
  ocupacionDesde: "2020-01-01", permanenciaHasta: "2025-12-31",
  reconocimientoAhorroAgua: "resolucion_region", fechaReconocimientoAhorroAgua: "2025-01-01",
  reconocimientoAhorroAguaTitular: "s-1", reconocimientoAhorroAguaVivienda: "v",
  organoReconocimientoAhorroAgua: "administracion_regional_murcia", ahorroAguaDispositivo: "dispositivo_art4_identificado",
}
const pago = (id: string, concepto: string, importeEUR: string, objetoId: string) => ({
  id, fecha: "2025-06-01", importeEUR, ayudasEUR: "0", concepto, objetoId, pagador: "s-1", factura: "factura-" + id, soportePago: "soporte-" + id,
})
const agua = (): Solicitud => ({ lote: "F-ampliado", codigo: "murcia_dispositivos_ahorro_agua",
  hechos: { viviendas: [vivienda], pagos: [pago("p-agua", "dispositivo_ahorro_agua", "300", "v")] } })
const recarga = (): Solicitud => ({ lote: "F-ampliado", codigo: "murcia_recarga_vehiculos_electricos",
  historialRecarga: { periodos: [2022, 2023, 2024], contribuyente: "s-1", referencia: "censo_documentado", infraestructuras: [] },
  hechos: { viviendas: [vivienda], instalaciones: [{
    id: "inst", viviendaId: "v", vehiculoId: "vehiculo_uso_particular", tipoCoste: "programa2_rd266_2021",
    puestaMarcha: "2025-06-01", finalizacion: "2025-06-01", facturaFecha: "2025-06-01", uso: "particular", titulares: ["s-1"], regimenPago: "propio",
    propiedadHastaDevengo: "2025-12-31", funcionamientoHastaDevengo: "2025-12-31",
    referenciaPropiedadInstalacion: "titulo", referenciaMantenimientoDosAnios: "seguimiento2",
  }], pagos: [pago("p-recarga", "infraestructura_recarga", "1000", "inst")] },
})
function recargaMaxima(): Solicitud {
  const s = recarga()
  return { ...s, hechos: { ...s.hechos, pagos: [pago("p-recarga", "infraestructura_recarga", "4000", "inst")] } }
}
type LibroTerritorial = ReturnType<typeof aplicar>
function comprobarLibroRecargaAnual(r: LibroTerritorial | undefined): void {
  if (r === undefined || !("saldoEjercicio" in r)) throw new Error("Falta libro anual F")
  expect(r).toMatchObject({ completoEnRamasSolicitadas: true, ordenAplicado: [agua().codigo, recarga().codigo] })
  expect(r.aplicaciones[0]).toMatchObject({ generado: racional("60"), aplicado: racional("60") })
  // AEAT:100% de4000; la cuota viene del mismo anual, no de una liquidación auxiliar.
  expect(r.total).toEqual(r.saldoEjercicio.cuotaInicial)
  expect(r.disponible).toEqual(racional("0"))
  const a = r.aplicaciones.find((x) => "codigo" in x && x.codigo === recarga().codigo)
  if (a === undefined || !("arrastre" in a) || a.aplicado === undefined || a.pendiente === undefined || a.arrastre === undefined)
    throw new Error("Falta aplicación y saldo derivados de recarga")
  expect(a).toMatchObject({ generado: racional("4000"), origen: { ejercicio: 2025, objetoId: "inst", contribuyente: "s-1" } })
  expect(sumar(a.aplicado, a.pendiente)).toEqual(racional("4000"))
  expect(a.arrastre).toEqual({ primerEjercicio: 2026, ultimoEjercicio: 2028, saldo: a.pendiente })
  expect(r).toMatchObject({ seguimiento: [{ origen: { ejercicio: 2025, objetoId: "inst", contribuyente: "s-1" }, desde: "2025-06-01", hasta: "2027-06-01", estado: "obligacion_futura_pendiente" }] })
}

describe("F anual: una cuota y reservas por rama", () => {
  // f-aeat2025-agua-cuantia-base:20% de300=60; f-aeat2025-recarga-cuantia:100% de1000.
  it("consume60 antes de recarga y deriva saldo960 con origen2025 y plazo2026–2028", () => {
    const r = aplicar({ solicitudes: [recarga(), agua()] }, m())
    expect(r.total).toEqual(racional("100")); expect(r.disponible).toEqual(racional("0"))
    expect(r.aplicaciones).toMatchObject([
      { codigo: agua().codigo, generado: racional("60"), aplicado: racional("60"), pendiente: racional("0") },
      { codigo: recarga().codigo, generado: racional("1000"), aplicado: racional("40"), pendiente: racional("960"),
        origen: { ejercicio: 2025, objetoId: "inst", contribuyente: "s-1" }, arrastre: { primerEjercicio: 2026, ultimoEjercicio: 2028, saldo: racional("960") } },
    ])
    expect(r).toMatchObject({ completoEnRamasSolicitadas: true,
      seguimiento: [{ desde: "2025-06-01", hasta: "2027-06-01", fechaCorte: "2025-12-31", estado: "obligacion_futura_pendiente" }] })
    expect(aplicar({ solicitudes: [agua(), recarga()] }, m()).total).toEqual(r.total)
  })
  it("cuota cero es real: genera1000 y conserva su saldo, sin inventar importe aplicado", () => {
    const r = aplicar({ solicitudes: [recarga()] }, m("0"))
    expect(r.aplicaciones[0]).toMatchObject({ generado: racional("1000"), aplicado: racional("0"), pendiente: racional("1000") })
  })
  it("el incentivo nuevo de2025 no exige un historial anterior sin vigencia", () => {
    const { historialRecarga: historia, ...sinHistoria } = recarga()
    expect(historia).toBeDefined()
    const r = aplicar({ solicitudes: [sinHistoria, agua()] }, m())
    expect(r).toMatchObject({ completoEnRamasSolicitadas: true })
    const aplicacion = r.aplicaciones.find((x) => "codigo" in x && x.codigo === recarga().codigo)
    expect(aplicacion).toMatchObject({ generado: racional("1000"), aplicado: racional("40"), pendiente: racional("960") })
    expect(r.total).toEqual(racional("100"))
  })
  it("una historia positiva anterior a la vigencia no habilita un saldo", () => {
    const s = recarga()
    const r = evaluarAnualF2025({ ...s, historialRecarga: { periodos: [2022, 2023, 2024], contribuyente: "s-1", referencia: "historia", infraestructuras: [{ objetoId: "antigua", ejercicioOrigen: 2024, referencia: "facturas2024" }] } }, m())
    expect(r.siguienteHecho).toBe("historialRecarga.sin_vigencia_anterior_2025"); expect(r.importe).toBeUndefined()
  })
  it("ayudas ambiguas siguen concretamente pendientes junto a una rama calculable", () => {
    const s = recarga()
    const r = aplicar({ solicitudes: [{ ...s, hechos: { ...s.hechos, pagos: [{ ...pago("p-recarga", "infraestructura_recarga", "1000", "inst"), ayudasEUR: "100" }] } }, agua()] }, m())
    expect(r.evaluacionesF.find((x) => x.codigo === s.codigo)?.siguienteHecho).toBe("ayudas.clasificacionPrograma2YConciliacionLegal")
    expect(r.total).toEqual(racional("60"))
  })
  it("el orden con vehículos y renovables precede al orden de entrada", () => {
    const r = consumirCuotaAnualF2025(racional("100"), ["murcia_instalaciones_recursos_energeticos_renovables", "murcia_recarga_vehiculos_electricos", "murcia_vehiculos_electricos", "murcia_dispositivos_ahorro_agua"], [racional("20"), racional("60"), racional("30"), racional("10")])
    expect(r.ordenAplicado).toEqual(["murcia_dispositivos_ahorro_agua", "murcia_vehiculos_electricos", "murcia_recarga_vehiculos_electricos", "murcia_instalaciones_recursos_energeticos_renovables"])
    expect(r.aplicaciones.at(-1)).toMatchObject({ aplicado: racional("0"), pendiente: racional("20") })
  })
  it("un importe previo desconocido no inventa consumo ni saldo de una rama posterior", () => {
    const s = recarga(), r = consumirCuotaAnualF2025(racional("100"), ["murcia_vehiculos_electricos", s.codigo], [
      { codigo: "murcia_vehiculos_electricos", estado: "no_soportado", motivo: "Historia por reconstruir", siguienteHecho: "origen2024", rastro: [], citas: [], reservas: [] },
      evaluarAnualF2025(s, m()),
    ])
    expect(r.aplicaciones[1]).toMatchObject({ estado: "pendiente_cuota", generado: racional("1000") })
    expect(r.aplicaciones[1]).not.toHaveProperty("aplicado"); expect(r.aplicaciones[1]).not.toHaveProperty("arrastre")
    expect(r.completoEnRamasSolicitadas).toBe(false)
  })
  it("duplicación de código, pago o factura nunca consume dos veces", () => {
    expect(() => aplicar({ solicitudes: [agua(), agua()] }, m())).toThrow(/duplicado/)
    const a = agua(), b = recarga()
    expect(() => aplicar({ solicitudes: [a, { ...b, hechos: { ...b.hechos, pagos: [{ ...pago("p-agua", "infraestructura_recarga", "1000", "inst") }] } }] }, m())).toThrow(/duplicado/)
    expect(() => aplicar({ solicitudes: [a, { ...b, hechos: { ...b.hechos, pagos: [{ ...pago("otro", "infraestructura_recarga", "1000", "inst"), factura: "factura-p-agua" }] } }] }, m())).toThrow(/duplicado/)
  })
  it("las solicitudes reales prevalecen sobre elecciones vacías en una incompatibilidad", () => {
    const hechos = { nacimientoContribuyente: "1985-01-01", miembrosUnidad: ["s-1"], elecciones: [],
      viviendas: [{ ...vivienda, territorio: "madrid", precioEUR: "200000" }],
      prestamos: [{ id: "hipoteca", tipo: "hipoteca_variable", viviendaId: "v", destinoContrato: "adquisicion_habitual" }], pagos: [],
    }
    const a: Solicitud = { lote: "F-ampliado", codigo: "madrid_intereses_vivienda_jovenes_menores_30", hechos }
    const b: Solicitud = { lote: "F-ampliado", codigo: "madrid_incremento_costes_financiacion_vivienda", hechos }
    const r = aplicar({ solicitudes: [a, b] }, m("100", "madrid"))
    expect(r.evaluacionesF.every((x) => x.siguienteHecho === "eleccionIncompatible")).toBe(true)
  })
})

describe("F anual: precisión y frontera cerrada", () => {
  const donativo = (): Solicitud => ({ lote: "F-ampliado", codigo: "madrid_donativos_fundaciones_clubes_deportivos", hechos: {
    entidades: [{ id: "e", forma: "fundacion", registro: "registro", cuentasPresentadas: "si", certificado: "certificado" }],
    pagos: [pago("don", "donativo_dinerario", "1000", "e")],
  } })
  // Art.9 Madrid auditado:15% de la base del donativo, limitada al10% de base liquidable.
  it("deriva liquidables largos sin parser de céntimos ni lectura de presentación", () => {
    const mm = m("100", "madrid")
    const r = aplicar({ solicitudes: [donativo()] }, { ...mm, basesLiquidables: { general: new Decimal("100.0000000000000000000000000000000000000001"), ahorro: new Decimal(0) } })
    expect(r.total).toEqual(racional("1.5000000000000000000000000000000000000000015"))
  })
  it("la misma fracción es rechazada cuando se consigna como hecho monetario", () => {
    const s = donativo()
    const r = evaluarAnualF2025({ ...s, hechos: { ...s.hechos, pagos: [pago("don", "donativo_dinerario", "1000.001", "e")] } }, m("100", "madrid"))
    expect(r.estado).toBe("no_soportado"); expect(r.importe).toBeUndefined()
    expect(r.siguienteHecho).toBe("pago.importeEUR")
  })
  it("un productor liquidable ausente conserva la fórmula y su condición concreta", () => {
    const { basesLiquidables: liquidables, ...mm } = m("100", "madrid")
    expect(liquidables).toBeDefined()
    const r = evaluarAnualF2025(donativo(), mm)
    expect(r.dependenciaAnual?.magnitud).toBe("base_liquidable"); expect(r.importe).toBeUndefined()
  })
  it.each(["bases", "basesOtrosTitulares", "liquidableGeneralEUR", "liquidableAhorroEUR", "minimoPersonalFamiliarEUR", "baseViviendaEstatalEUR", "cuota", "tipo"])("no permite consignar%s", campo => {
    const s = agua()
    expect(Result.isFailure(Schema.decodeUnknownResult(SolicitudAnualF2025)({ ...s, hechos: { ...s.hechos, [campo]: "1" } }, { onExcessProperty: "error" }))).toBe(true)
  })
  it("cierra magnitudes anidadas de los previos y asignación estatal del donativo", () => {
    for (const hechos of [{ hechosPrevios: { baseGeneralEUR: "0" } }, { pagos: [{ ...pago("p", "donativo_dinerario", "100", "e"), computoBaseEstatalEUR: "100" }] }])
      expect(Result.isFailure(Schema.decodeUnknownResult(SolicitudAnualF2025)({ ...agua(), hechos }, { onExcessProperty: "error" }))).toBe(true)
  })
  it("familia numerosa usa cuota interna:50% de20.079=10.0395; tope6186", () => {
    const s: Solicitud = { lote: "F-ampliado", codigo: "madrid_condicion_familia_numerosa", hechos: { miembrosUnidad: ["s-1"], titulo: { categoria: "general", efectos: "2025-01-01", referencia: "titulo", titulares: ["s-1"] } } }
    expect(aplicar({ solicitudes: [s] }, m("20.079", "madrid")).total).toEqual(racional("10.0395"))
    expect(aplicar({ solicitudes: [s] }, m("13000", "madrid")).total).toEqual(racional("6186"))
  })
  it("el parser público autónomo de bases mantiene céntimos; no se debilita por el canal interno", () => {
    const r = evaluarAmpliacionF2025({ tipo: "territorial_f_ampliacion_2025", codigo: "madrid_condicion_familia_numerosa", contexto: { ejercicio: 2025, territorio: "madrid", contribuyente: "s-1", modalidad: "individual" }, hechos: { miembrosUnidad: ["s-1"], bases: [{ id: "s-1", generalEUR: "20000.001", ahorroEUR: "0" }] } })
    expect(r.estado).toBe("no_soportado"); expect(r.importe).toBeUndefined()
  })
  it("transporta tercios y365 sin redondear antes del consumo", () => {
    const s = { tipo: "territorial_f_ampliacion_2025" as const, codigo: "madrid_cuidado_ascendientes", contexto: { ejercicio: 2025, territorio: "madrid", contribuyente: "s-1", modalidad: "individual" as const }, hechos: {} }
    const tercio = sumarRepartoExactoF(s, racional("0"), new D("515.50"), ["s-1", "s-3", "s-4"])
    expect(tercio).toEqual(racional("515.50", "3"))
    const r = salidaExactaF(s, racional("300", "365"))
    expect(consumirCuotaAnualF2025(racional("1"), [s.codigo], [r]).aplicaciones[0]?.generado).toEqual(racional("60", "73"))
  })
})

describe("F anual: identidades y condición del periodo", () => {
  const persona = { id: "s-2", nacimiento: "2015-01-01", relacion: "hijo", rentasNoExentasEUR: "0", declaracionTipo: "no_presentada", discapacidadPorcentaje: "0", situacionDevengo: "vivo", certificadoParentesco: "registro", alimentos64175: "no", titularesMinimo: ["s-1"], titularesDeduccion: ["s-1"], gradoMasCercanoConPrioridad: [], progenitores: ["s-1"], convivencia: [{ desde: "2025-01-01", hasta: "2025-12-31" }], etapa: "primaria", certificadoEducativo: "centro", ayudasEscolaresEUR: "0" }
  const familiar = (): MagnitudesTerritorialesAnuales => ({ ...m(), sujetosConMinimo: ["s-2"], atribucionesMinimo: [{ sujetoId: "s-2", titulares: ["s-1"] }], caso: { ...m().caso, derechosMinimos: {
    ejercicio: 2025, territorio: "murcia", regimen: "comun", modalidad: "individual", devengo: "2025-12-31", contribuyenteId: "s-1", edadContribuyenteDevengo: 40,
    discapacidadContribuyente: { _tag: "SinDiscapacidad" }, ascendientes: "ninguno", fallecimientosEnElEjercicio: "ninguno", descendientesCompletos: true,
    descendientes: [{ sujetoId: "s-2", fechaNacimiento: "2015-01-01", edadDevengo: 10, vivoAlDevengo: true, rentasNoExentasCentimos: 0, declaracion: { modalidad: "no-presenta" }, discapacidad: { _tag: "SinDiscapacidad" }, titularesCompletos: true,
      titulares: [{ titularId: "s-1", grado: 1, vinculo: { clase: "consanguinidad" }, relacion: "convivencia", custodia: "exclusiva", alimentosJudiciales: false, aplicaEspecialidadAlimentos: false, residenteIrpf: true, rentasNoExentasCentimos: 2000000 }] }],
  } } })
  const escolar = (): Solicitud => ({ lote: "F-ampliado", codigo: "murcia_material_escolar_libros_texto", hechos: { personas: [persona], titulo: { categoria: "no_numerosa" }, pagos: [{ ...pago("libros", "libros_texto", "100", "escuela"), beneficiarioId: "s-2" }] } })
  it("acepta el descendiente conciliado y mantiene el importe120 de la fuente auditada", () => {
    const r = evaluarAnualF2025(escolar(), { ...familiar(), baseGeneral: new Decimal("20000") })
    expect(r.estado, r.motivo).toBe("calculo_parcial"); expect(r.importeExactoRacional).toEqual(racional("120"))
  })
  it.each([
    { nacimiento: "2014-01-01" }, { id: "s-1" }, { relacion: "conyuge" }, { progenitores: ["s-1", "s-2"] },
    { titularesMinimo: ["s-1", "s-3"] }, { discapacidadPorcentaje: "65" }, { rentasNoExentasEUR: "1" },
    { adopcionFecha: "2025-01-01" },
  ])("rechaza identidad/vínculo contradictorio:%j", cambio => {
    const s = escolar(), r = evaluarAnualF2025({ ...s, hechos: { ...s.hechos, personas: [{ ...persona, ...cambio }] } }, familiar())
    expect(r.estado).toBe("no_soportado"); expect(r.importe).toBeUndefined(); expect(r.siguienteHecho).toBeDefined()
  })
  it("el progenitor no puede ser el hijo de una adopción previa", () => {
    const r = evaluarAnualF2025({ lote: "F-ampliado", codigo: "madrid_adopcion_internacional", hechos: { hechosPrevios: { eventos: [{ hijo: "s-1", tipo: "adopcion_internacional", fecha: "2025-06-01", progenitoresConvivientesConDerecho: ["s-1"] }] } } }, m("100", "madrid"))
    expect(r.siguienteHecho).toBe("evento.hijo"); expect(r.importe).toBeUndefined()
  })
  it("ninguna etiqueta habilita fallecimiento", () => {
    expect(() => aplicar({ solicitudes: [agua()] }, { ...m(), caso: { ...m().caso, fechaFallecimiento: DateTime.toDateUtc(DateTime.makeUnsafe("2025-06-01T00:00:00Z")) } })).toThrow(/fallecimiento/)
  })
})

describe("F conectado a las dos API públicas", () => {
  it("la API canónica resta sólo la deducción de agua producida por hechos", () => {
    const caso: CasoFiscalAnual = { ...m().caso, rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] }, reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0 }
    const sin = Effect.runSync(liquidarIrpfAnual(caso, { modo: "canonico" }))
    const con = Effect.runSync(liquidarIrpfAnual({ ...caso, deduccionesTerritoriales2025: { solicitudes: [agua()] } }, { modo: "canonico" }))
    expect(sin.cuotaLiquidaCentimos - con.cuotaLiquidaCentimos).toBe(6000)
    expect(con.deduccionesTerritoriales2025?.total).toEqual(racional("60"))
  })
  const efectivo = () => ({
    ejercicio: 2025, comunidadAutonoma: "murcia", contribuyenteId: "s-1", edad: 40, modalidad: "individual", residenciaTodoElAnio: true, devengo: "2025-12-31", otrasRentas: "ninguna", familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: { solicitudes: [agua()] }, rentasExtranjeras: "ninguna", especialidades: "ninguna", perfil: "solo-trabajo", conciliacion: { ejercicio: 2025, estado: "totales-anuales-sin-duplicados", procedencia: ["certificado"] }, retenciones: [],
    trabajo: { ejercicio: 2025, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna", rendimientos: [{ id: "r", clase: "empleo-laboral", integro: "30000", cotizaciones: { clase: "efectivas", seguridadSocial: "0", derechosPasivos: "0", colegiosHuerfanos: "0" }, sindicato: { importe: "0", satisfecho: "no" }, colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" }, defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" } }] },
  } as const)
  it("la API efectiva usa el mismo Schema y la misma composición", () => {
    const r = Effect.runSync(liquidarIrpfAnualExplicito(efectivo()))
    expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("60"))
  })
  it("API canónica: orden, cuota única agotada, saldo2025 y seguimiento de recarga", () => {
    const caso: CasoFiscalAnual = { ...m().caso, rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] }, reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0,
      deduccionesTerritoriales2025: { solicitudes: [recargaMaxima(), agua()] } }
    const r = Effect.runSync(liquidarIrpfAnual(caso, { modo: "canonico" }))
    comprobarLibroRecargaAnual(r.deduccionesTerritoriales2025)
  })
  it("API efectiva: orden, cuota única agotada, saldo2025 y seguimiento de recarga", () => {
    const r = Effect.runSync(liquidarIrpfAnualExplicito({ ...efectivo(), deduccionesTerritoriales2025: { solicitudes: [recargaMaxima(), agua()] } }))
    comprobarLibroRecargaAnual(r.deduccionesTerritoriales2025)
  })
  it("una rama desconocida no publica cuota como si su deducción fuese cero", () => {
    const solicitud = recarga()
    const historia = { periodos: [2022, 2023, 2024] as const, contribuyente: "s-1", referencia: "incompatible",
      infraestructuras: [{ objetoId: "inst-anterior", ejercicioOrigen: 2024 as const, referencia: "origen2024" }] }
    const r = Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...efectivo(), deduccionesTerritoriales2025: { solicitudes: [agua(), { ...solicitud, historialRecarga: historia }] } })))
    expect(Result.isFailure(r)).toBe(true)
    if (Result.isFailure(r)) expect(r.failure).toMatchObject({ _tag: "ResultadoNoSoportado", deduccionesTerritoriales2025: { total: racional("60"), completoEnRamasSolicitadas: false } })
  })
})
