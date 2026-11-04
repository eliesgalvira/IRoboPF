import Decimal from "decimal.js"
import {
  acceso,
  entero,
  evidencia,
  factor,
  n,
  neto,
  proporcion,
  rechazar,
  renta,
  t,
  type Formula,
} from "./comun"

export const gastos = {
  arrendador_renta_precio_referencia: (_h, u) => {
    evidencia(u, "celdaCaLabVersion2025")
    if (
      n(u, "rentaMensualConRepercusiones").gt(n(u, "precioReferenciaHistorico"))
    )
      return new Decimal(0)
    return Decimal.min(n(u, "rendimientoIntegro"), 3300).times("0.05")
  },
  primera_vivienda_menores_35: (h, u) => {
    acceso(h)
    return n(u, "edad").gt(35)
      ? new Decimal(0)
      : n(u, "pagosSinIntereses").times("0.05")
  },
  vivienda_discapacidad: (h, u) => {
    acceso(h)
    evidencia(u, "discapacidadCualificadaDevengo")
    return n(u, "pagosSinIntereses").times("0.05")
  },
  vivienda_ayudas_publicas: (_h, u) => {
    const regimen = t(u, "regimen", ["fijo", "regeneracion"])
    if (regimen === "regeneracion")
      return n(u, "ayudaIntegradaDestinada")
        .times(n(u, "tipoMedioAutonomico"))
        .div(100)
    const fraccion = n(u, "fraccionImputacion")
    if (fraccion.gt(1)) return rechazar("Fracción de imputación superior a uno")
    return new Decimal(112).times(fraccion)
  },
  arrendamiento_actividad_distinto_municipio: (h, u) => {
    if (n(u, "distanciaKm").lte(50)) return new Decimal(0)
    return Decimal.min(
      n(u, "alquilerNoReembolsado").times("0.1"),
      new Decimal(224)
        .times(entero(u, "diasContrato", 365))
        .div(365)
        .times(factor(h))
    ).times(proporcion(h, u))
  },
  dos_o_mas_descendientes: (_h, u) => {
    if (
      entero(u, "descendientesMinimo", 30) < 2 ||
      n(u, "imponiblesAgregadasPersonasUnicas").gt(30000)
    )
      return new Decimal(0)
    return Decimal.max(
      0,
      n(u, "cuotaIntegraAutonomica").minus(n(u, "minoracionesEstatales"))
    ).times("0.1")
  },
  incremento_costes_financiacion_vivienda: (h, u) => {
    const dias = entero(u, "diasPrestamoAnterior", 360)
    if (dias === 0) return rechazar("Préstamo anterior sin días")
    const incremento = n(u, "intereses2025")
      .times(dias)
      .div(360)
      .minus(n(u, "intereses2024"))
    return Decimal.min(
      Decimal.max(0, incremento).times("0.5"),
      new Decimal(100).times(factor(h))
    )
  },
  obras_conservacion_mejora_periodo: (h, u) => {
    evidencia(u, "planYActuacionCalificados")
    return Decimal.min(neto(u), new Decimal(5500).times(factor(h)))
      .times(t(u, "accesibilidad33", ["si", "no"]) === "si" ? "0.5" : "0.2")
      .times(proporcion(h, u))
  },
  obras_conservacion_mejora_2014_2015: (h, u) => {
    const anio = t(u, "anioObra", ["2014", "2015"])
    evidencia(u, "plan2013a2015YBaseHistorica")
    return Decimal.min(
      neto(u),
      new Decimal(4500).times(
        factor(h, 25000, 40000, h.modalidad === "individual" ? 2000 : 3000)
      ),
      Decimal.max(0, new Decimal(5000).minus(n(u, "baseConsumidaHistorica")))
    )
      .times(anio === "2014" ? "0.1" : "0.25")
      .times(proporcion(h, u))
  },
  abonos_culturales: (h, u) => {
    evidencia(u, "adhesionYProrrogaVigentes2025")
    return renta(h).gte(50000)
      ? new Decimal(0)
      : Decimal.min(neto(u), 165).times("0.21")
  },
  vehiculos_orden_5_2020: (h, u) => {
    acceso(h)
    evidencia(u, "caracteristicasOrden5")
    const clase = t(u, "clase", ["bicicleta", "kit", "vmp"])
    return Decimal.min(
      neto(u),
      clase === "bicicleta" ? 1540 : clase === "kit" ? 660 : 495
    )
      .times("0.1")
      .times(proporcion(h, u))
  },
  gastos_salud: (h, u) => {
    const clase = t(u, "clase", [
      "cronica_rara",
      "cerebral_alzheimer",
      "dental",
      "mental",
      "optica",
    ])
    const fijo = ["cronica_rara", "cerebral_alzheimer"].includes(clase)
    const max = fijo
      ? t(u, "familiaReforzada", ["si", "no"]) === "si"
        ? 150
        : 100
      : clase === "optica"
        ? 100
        : 150
    return Decimal.min(
      neto(u)
        .times(proporcion(h, u))
        .times(fijo ? 1 : "0.3"),
      new Decimal(max).times(factor(h, 60000, 78000, 6000))
    )
  },
  fomento_formacion_musical: (h, u) => {
    t(u, "relacion", ["contribuyente", "conyuge", "descendienteMinimo"])
    return neto(u).times(proporcion(h, u))
  },
  ayudas_publicas_erte_covid: (_h, u) => {
    const integrada = n(u, "ayudaIntegrada")
    if (integrada.plus(n(u, "ayudaExenta")).gt(n(u, "ayudaTotal")))
      return rechazar("Clasificación de ayuda inconsistente")
    if (n(u, "tipoMedioAutonomico").gt(100))
      return rechazar("Tipo medio fuera de rango")
    return integrada.times(n(u, "tipoMedioAutonomico")).div(100)
  },
  arrendamiento_cesion_uso_vivienda: (h, u) => {
    if (
      t(u, "contrato", ["alquiler", "cesion"]) === "cesion" &&
      h.devengo < "2025-12-30"
    )
      return rechazar("Cesión de uso anterior a 30 diciembre")
    const condiciones = entero(u, "condicionesReforzadas", 3)
    return Decimal.min(
      n(u, "alquilerSinServicios").times(
        condiciones === 0 ? "0.2" : condiciones === 1 ? "0.25" : "0.3"
      ),
      new Decimal(condiciones === 0 ? 800 : condiciones === 1 ? 950 : 1100)
        .times(entero(u, "diasContrato", 365))
        .div(365)
        .times(factor(h))
    ).times(proporcion(h, u))
  },
  deporte_actividades_saludables: (h, u) => {
    const edad = n(u, "edad")
    const grado = n(u, "grado")
    return neto(u)
      .times(proporcion(h, u))
      .times(
        edad.gt(75) || grado.gte(65)
          ? 1
          : edad.gt(65) || grado.gte(33)
            ? "0.5"
            : "0.3"
      )
  },
} satisfies Readonly<Record<string, Formula>>
