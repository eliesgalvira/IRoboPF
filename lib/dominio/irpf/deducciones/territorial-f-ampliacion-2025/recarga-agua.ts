import type { SolicitudF, ViviendaF } from "./esquemas"
import {
  D, requerido, texto, opcion, fecha, aniversario, dinero, decimal, ids, unicos,
  pagos, sumaPagos, falta, salida, type ResultadoF,
} from "./comun"

export const CITAS_AEAT_RECARGA_F = [
  "f-aeat2025-recarga-cuantia", "f-aeat2025-recarga-base-ayudas",
  "f-aeat2025-recarga-ayudas-programa2", "f-aeat2025-recarga-limite",
  "f-aeat2025-recarga-titularidad", "f-aeat2025-recarga-reparto",
  "f-aeat2025-recarga-fechas", "f-aeat2025-recarga-seguimiento",
  "f-aeat2025-recarga-orden-arrastre",
] as const
export const CITAS_AEAT_AGUA_F = [
  "f-aeat2025-agua-cuantia-base", "f-aeat2025-agua-habitualidad",
  "f-aeat2025-agua-reconocimiento",
] as const

/** Criterio administrativo explícito, separado del tenor legal conservado.
 * La rama monetaria exige ayudas declaradas cero. No resuelve la contradicción
 * entre minoración general y la excepción de costes Programa2. */
export function recargaF(s: SolicitudF, v: ViviendaF): ResultadoF {
  const instalaciones = requerido(s.hechos.instalaciones, "instalaciones")
  if (instalaciones.length !== 1)
    falta("instalaciones", "Una infraestructura por contribuyente y periodo; no elegir automáticamente")
  const i = requerido(instalaciones[0], "instalacion")
  const objetoId = texto(i.id, "instalacion.id")
  if (i.viviendaId !== v.id) falta("instalacion.viviendaId", "Instalación en otra finca")
  const propietarios = ids(v.titulares, "vivienda.titulares")
  const porcentaje = decimal(v.porcentajePropiedad, "porcentajePropiedad")
  if (porcentaje.gt(100)) falta("porcentajePropiedad", "Porcentaje superior a100")
  if (!propietarios.includes(s.contexto.contribuyente) || porcentaje.isZero())
    falta("vivienda.titulares", "Finca ajena; usufructo o arrendamiento no prueban propiedad")
  // Si se aporta garaje comunitario, su título debe ser identificable.
  if (i.localizacion !== undefined) {
    opcion(i.localizacion, ["finca_propia", "garaje_comunitario"], "localizacion")
    if (i.localizacion === "garaje_comunitario") texto(i.documentoComunidad, "documentoComunidad")
  }
  const titulares = ids(i.titulares, "instalacion.titulares")
  if (!titulares.includes(s.contexto.contribuyente)) falta("instalacion.titulares", "Titularidad de la infraestructura no corresponde al contribuyente")
  texto(i.referenciaPropiedadInstalacion, "referenciaPropiedadInstalacion")
  texto(i.vehiculoId, "vehiculoId")
  opcion(i.uso, ["particular"], "instalacion.uso")
  opcion(i.tipoCoste, ["programa2_rd266_2021"], "tipoCoste")
  const fin = fecha(i.finalizacion, "finalizacion")
  const facturaFecha = fecha(i.facturaFecha, "facturaFecha")
  const marcha = fecha(i.puestaMarcha, "puestaMarcha")
  if (!fin.startsWith("2025-") || !facturaFecha.startsWith("2025-"))
    falta("finalizacion/facturaFecha", "Esta rama genera deducción sólo con finalización y factura en2025")
  if (marcha < fin || marcha > "2025-12-31")
    falta("puestaMarcha", "Conciliar puesta en marcha efectiva, finalización y devengo2025")
  const propiedadHasta = fecha(i.propiedadHastaDevengo, "propiedadHastaDevengo")
  const funcionaHasta = fecha(i.funcionamientoHastaDevengo, "funcionamientoHastaDevengo")
  if (propiedadHasta !== "2025-12-31" || funcionaHasta !== "2025-12-31")
    falta("seguimientoAlDevengo", "Falta continuidad efectiva al devengo; fechas futuras no acreditan dos años ya cumplidos")
  const seguimientoRef = texto(i.referenciaMantenimientoDosAnios, "referenciaMantenimientoDosAnios")

  const regimen = opcion(i.regimenPago, ["propio", "gananciales", "pagos_separados"], "regimenPago")
  if (regimen === "propio" && (titulares.length !== 1 || titulares[0] !== s.contexto.contribuyente))
    falta("regimenPago/titulares", "Rama propia exige un titular; identificar régimen y pagos comunes para cotitulares")
  if (regimen !== "propio") {
    if (titulares.length < 2 || (regimen === "gananciales" && titulares.length !== 2))
      falta("instalacion.titulares", "Unidad de reparto incompleta para el régimen declarado")
    texto(i.referenciaRegimenEconomico, "referenciaRegimenEconomico")
    opcion(i.alcancePagos, ["todos_los_costes_instalacion"], "alcancePagos")
  }
  const conceptos = [
    "proyecto", "obra_civil", "ingenieria", "direccion_obra", "infraestructura_recarga",
    "instalacion_electrica", "conexion", "adecuacion", "permisos", "senalizacion",
    "gestion_seguridad", "generacion_almacenamiento_local",
  ]
  const todos = requerido(s.hechos.pagos, "pagos")
  if (todos.some(p => p.objetoId !== objetoId)) falta("pago.objetoId", "Otros costes/infraestructuras no pertenecen a la única instalación declarada")
  const pp = pagos(s, conceptos, objetoId, regimen === "propio" ? [s.contexto.contribuyente] : titulares)
  if (pp.length === 0) falta("pagos", "Colección de pagos vacía; declarar al menos la operación real, aunque su importe sea cero")
  for (const p of pp) {
    texto(p.factura, "pago.factura")
    if (dinero(p.ayudasEUR, "pago.ayudasEUR").gt(0))
      falta("ayudas.clasificacionPrograma2YConciliacionLegal", "Ayudas positivas: conservar minoración general legal y excepción AEAT Programa2; esta rama sólo admite sin ayudas")
  }
  if (pp.some(p => p.concepto === "generacion_almacenamiento_local")) {
    opcion(i.generacionExclusiva, ["si"], "generacionExclusiva")
    const produccion = requerido(i.potenciaProduccionKW, "potenciaProduccionKW")
    const recarga = requerido(i.potenciaRecargaKW, "potenciaRecargaKW")
    if (produccion <= 0 || recarga <= 0 || produccion > recarga)
      falta("potenciaProduccionKW", "Producción local debe servir exclusivamente al punto y no exceder su capacidad")
  }
  const total = sumaPagos(pp)
  let atribuible = total
  if (regimen !== "propio") {
    const aportaciones = requerido(i.inversionesPorTitular, "inversionesPorTitular")
    unicos(aportaciones.map(a => a.id), "inversionesPorTitular.id")
    if (aportaciones.length !== titulares.length || aportaciones.some(a => !titulares.includes(a.id)))
      falta("inversionesPorTitular", "Conciliar aportaciones exhaustivas con titulares")
    for (const a of aportaciones) {
      const pagosTitular = sumaPagos(pp.filter(p => p.pagador === a.id))
      if (!dinero(a.importeEUR, "aportacionEUR").eq(pagosTitular))
        falta("inversionesPorTitular", "La aportación declarada no coincide con las operaciones de ese pagador")
    }
    atribuible = regimen === "gananciales" ? total.div(2) : sumaPagos(pp.filter(p => p.pagador === s.contexto.contribuyente))
  }
  const base = D.min(4000, atribuible)
  const r = salida(s, base, [
    `Criterio AEAT2025:100% de base, límite4000 por infraestructura y contribuyente; régimen ${regimen}`,
    `Instalación ${objetoId}; finalización ${fin}; factura ${facturaFecha}; puesta en marcha ${marcha}; sin ayudas`,
    `Gasto total EUR ${total.toString()}; atribuido EUR ${atribuible.toString()}; base EUR ${base.toString()}`,
  ], [
    "La ley original no expresa porcentaje; se aplica criterio administrativo AEAT2025 documentado, no porcentajes MOVES",
    "Seguimiento de titularidad y funcionamiento dos años; obligación futura pendiente, no acreditación ya cumplida",
  ])
  return {
    ...r,
    baseCalculadaEUR: base.toString(),
    citas: [...new Set([...r.citas, ...CITAS_AEAT_RECARGA_F, "cf-moves-original-81", "cf-moves-original-82", "cf-moves-821-3"])],
    aplicacionAnualRecarga: {
      ejercicioOrigen: 2025, objetoId, contribuyente: s.contexto.contribuyente,
      limiteBaseEUR: "4000", limite: "por_infraestructura_y_contribuyente", unaInfraestructuraPorPeriodo: true,
      orden: { despuesDe: ["deducciones_sin_arrastre", "murcia_vehiculos_electricos"], antesDe: "murcia_instalaciones_recursos_energeticos_renovables" },
      arrastre: { periodosPosteriores: 3, ultimoEjercicio: 2028 },
      seguimiento: { desde: marcha, hasta: aniversario(marcha, 2), fechaCorte: "2025-12-31", estado: "obligacion_futura_pendiente", referencia: seguimientoRef, excepcionLegal: "fallecimiento" },
    },
  }
}

/** Rama habitual consolidada o cambio forzoso documentado. La remisión legal
 * Cuatro.3=>Uno.5 permanece literalmente reservada; AEAT explicita el criterio. */
export function aguaF(s: SolicitudF, v: ViviendaF): ResultadoF {
  texto(v.reconocimientoAhorroAgua, "reconocimientoAhorroAgua")
  const reconocimiento = fecha(v.fechaReconocimientoAhorroAgua, "fechaReconocimientoAhorroAgua")
  if (reconocimiento > "2025-12-31") falta("fechaReconocimientoAhorroAgua", "Reconocimiento posterior al corte; aportar cronología previa a la aplicación en subrama específica")
  if (v.reconocimientoAhorroAguaTitular !== s.contexto.contribuyente || v.reconocimientoAhorroAguaVivienda !== v.id)
    falta("reconocimientoAhorroAgua.identidad", "Reconocimiento de otro titular o vivienda")
  opcion(v.organoReconocimientoAhorroAgua, ["administracion_regional_murcia"], "organoReconocimientoAhorroAgua")
  texto(v.ahorroAguaDispositivo, "dispositivoArt4Ley6_2006IdentificadoEnReconocimiento")
  const ocupacion = fecha(v.ocupacionDesde, "vivienda.ocupacionDesde")
  const fin = fecha(v.permanenciaHasta, "vivienda.permanenciaHasta")
  if (ocupacion > "2025-12-31" || fin > "2025-12-31" || fin < ocupacion)
    falta("vivienda.habitualidad", "Trayectoria de residencia futura o contradictoria")
  const limiteTres = aniversario(ocupacion, 3)
  const limitePagos = fin
  if (fin < limiteTres) {
    if (v.excepcionHabitualidad === undefined) falta("habitualidad.tresAniosOExcepcion", "Falta residencia consolidada tres años o circunstancia de cambio identificada")
    opcion(v.excepcionHabitualidad, ["separacion_matrimonial", "traslado_laboral", "primer_empleo", "empleo_mas_ventajoso", "fallecimiento", "otra_analoga_documentada"], "excepcionHabitualidad")
    const cambio = fecha(v.fechaCambioHabitualidad, "fechaCambioHabitualidad")
    texto(v.referenciaCircunstanciaCambio, "referenciaCircunstanciaCambio")
    if (cambio !== fin) falta("fechaCambioHabitualidad", "La circunstancia no coincide con el fin de residencia declarado")
    if (v.excepcionHabitualidad === "fallecimiento") falta("devengoPorFallecimiento", "Devengo y composición por fallecimiento requieren contrato anual específico")
  }
  const todos = requerido(s.hechos.pagos, "pagos")
  if (todos.some(p => p.objetoId !== v.id)) falta("pago.objetoId", "Pago de otra vivienda")
  const pp = pagos(s, ["dispositivo_ahorro_agua", "instalacion_ahorro_agua"], texto(v.id, "vivienda.id"))
  if (pp.length === 0) falta("pagos", "Falta operación identificada de adquisición/instalación")
  for (const p of pp) {
    if (fecha(p.fecha, "pago.fecha") < ocupacion || fecha(p.fecha, "pago.fecha") > limitePagos)
      falta("pago.fecha", "Pago fuera de residencia habitual declarada")
    if (dinero(p.ayudasEUR, "pago.ayudasEUR").gt(0)) falta("pago.ayudasEUR", "Precisar qué cantidades corrieron efectivamente a cargo del contribuyente; no presumir importe propio con ayudas")
  }
  const base = D.min(300, sumaPagos(pp))
  const r = salida(s, base.times("0.20"), [
    "Criterio AEAT2025:20% de inversión propia con base máxima300 y máximo60 anual",
    `Reconocimiento regional ${v.reconocimientoAhorroAgua}; fecha ${reconocimiento}; dispositivo ${v.ahorroAguaDispositivo}`,
    `Residencia ${ocupacion} a ${fin}; ${v.excepcionHabitualidad ?? "tres_anios_consolidados"}`,
  ], ["F-N03 literal: Cuatro.3 remite aUno.5; no se enmienda la ley. Habitualidad operativa según manual AEAT2025 documentado"])
  return { ...r, baseCalculadaEUR: base.toString(), citas: [...new Set([...r.citas, ...CITAS_AEAT_AGUA_F])] }
}
