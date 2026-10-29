import Decimal from "decimal.js"
import { Result, Schema } from "effect"
import { DeduccionTrabajo, GastosTrabajo } from "./contrato"
import type { NoSoportado, ResultadoDeduccion } from "./contrato"

const D = Decimal.clone({ precision: 60 })
const rechazo = (motivo: string): NoSoportado => ({
  estado: "no-soportado",
  motivo,
})
export type ResultadoGastos =
  | NoSoportado
  | {
      readonly estado: "calculado"
      readonly integro: string
      readonly gastosAE: string
      readonly generalesTeoricos: string
      readonly generalesAplicados: string
      readonly discapacidadAplicada: string
      readonly netoPrevioArt20: string
      readonly netoArt19: string
      readonly fuente: string
      readonly aceptacionFiscal: "pendiente"
    }

export function calcularGastosTrabajo(caso: GastosTrabajo): ResultadoGastos {
  const decoded = Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  })
  if (Result.isFailure(decoded))
    return rechazo("Entrada inválida, incompleta o con campos ajenos")
  const c = decoded.success
  if (c.territorio !== "comun" || c.ejercicio === 2026)
    return rechazo("Ámbito territorial o vigencia 2026 no cerrados")
  if (c.movilidad !== "ninguna")
    return rechazo(
      "Movilidad ordinaria/histórica y DT6 requieren contrato temporal y de rendimientos asociados; no acumulables"
    )
  if (c.discapacidadActiva === "pendiente")
    return rechazo("Discapacidad activa desconocida")
  if (
    c.discapacidadActiva !== "ninguna" &&
    (c.ejercicio < 2015 ||
      c.rendimientos.length !== 1 ||
      c.rendimientos.some(
        (r) => r.clase !== "empleo-laboral" && r.clase !== "empleo-estatutario"
      ) ||
      c.discapacidadActiva.acreditadaDuranteTodoElTrabajo !== "si" ||
      c.discapacidadActiva.ayudaOMovilidadReducida === "desconocido")
  )
    return rechazo(
      "Discapacidad: solo empleo efectivo único con acreditación durante todos los rendimientos, desde 2015; asociación parcial/histórica pendiente"
    )
  if (c.reduccionesArt18 !== "ninguna")
    return rechazo("Imputación y reducciones art18 pendientes")
  if (new Set(c.rendimientos.map((r) => r.id)).size !== c.rendimientos.length)
    return rechazo("Rendimiento duplicado")
  let bruto = new D(0),
    ordinarios = new D(0),
    colegio = new D(0),
    defensa = new D(0)
  for (const r of c.rendimientos) {
    if (r.clase === "desconocido" || r.cotizaciones.clase !== "efectivas")
      return rechazo("Clase de trabajo o cotizaciones efectivas no acreditadas")
    if (
      [
        r.sindicato.satisfecho,
        r.colegio.satisfecho,
        r.colegio.obligatorio,
        r.colegio.finesEsenciales,
        r.defensa.satisfecho,
        r.defensa.litigioDirectoPagador,
      ].includes("desconocido")
    )
      return rechazo("Requisitos de los gastos desconocidos")
    bruto = bruto.plus(r.integro)
    ordinarios = ordinarios
      .plus(r.cotizaciones.seguridadSocial)
      .plus(r.cotizaciones.derechosPasivos)
      .plus(r.cotizaciones.colegiosHuerfanos)
    if (r.sindicato.satisfecho === "si")
      ordinarios = ordinarios.plus(r.sindicato.importe)
    if (
      r.colegio.satisfecho === "si" &&
      r.colegio.obligatorio === "si" &&
      r.colegio.finesEsenciales === "si"
    )
      colegio = colegio.plus(r.colegio.importe)
    if (
      r.defensa.satisfecho === "si" &&
      r.defensa.litigioDirectoPagador === "si"
    )
      defensa = defensa.plus(r.defensa.importe)
  }
  const gastos = ordinarios.plus(D.min(colegio, 500)).plus(D.min(defensa, 300))
  const previo = bruto.minus(gastos)
  const teoricos = c.ejercicio >= 2015 ? 2000 : 0
  const generales = D.min(teoricos, D.max(0, previo))
  const incremento =
    c.discapacidadActiva === "ninguna"
      ? 0
      : c.discapacidadActiva.grado === "65-o-mas" ||
          c.discapacidadActiva.ayudaOMovilidadReducida === "si"
        ? 7750
        : 3500
  const discapacidad = D.min(incremento, D.max(0, previo.minus(generales)))
  return {
    estado: "calculado",
    discapacidadAplicada: discapacidad.toString(),
    integro: bruto.toString(),
    gastosAE: gastos.toString(),
    generalesTeoricos: String(teoricos),
    generalesAplicados: generales.toString(),
    netoPrevioArt20: previo.toString(),
    netoArt19: previo.minus(generales).minus(discapacidad).toString(),
    fuente: "LIRPF art19; Ley26/2014 pp11–12; RIRPF art10",
    aceptacionFiscal: "pendiente",
  }
}

/** Etapa posterior al art80: no redefine la cuota líquida del art79. */
export function calcularDeduccionTrabajo(
  caso: DeduccionTrabajo
): ResultadoDeduccion {
  const decoded = Schema.decodeUnknownResult(DeduccionTrabajo)(caso, {
    onExcessProperty: "error",
  })
  if (Result.isFailure(decoded))
    return rechazo("Entrada de deducción inválida o etapa incorrecta")
  const c = decoded.success
  let legal: Decimal, limite: Decimal, fuente: string
  if (c.regla === "art80bis") {
    if (
      new D(c.tipoMedioEstatalPorcentaje).gt(100) ||
      new D(c.tipoMedioAutonomicoPorcentaje).gt(100)
    )
      return rechazo("Tipos medios fuera de rango")
    legal = D.max(
      0,
      new D(400).minus(
        D.max(0, new D(c.baseImponible).minus(8000)).times("0.1")
      )
    )
    limite = new D(c.rendimientoComputableTrabajoActividad)
      .times(
        new D(c.tipoMedioEstatalPorcentaje).plus(
          c.tipoMedioAutonomicoPorcentaje
        )
      )
      .div(100)
    fuente = "LIRPF art80bis histórico; Ley26/2009 art70; arts63.2 y74.2"
  } else {
    if (c.ejercicio !== 2025)
      return rechazo(
        "DA61 2026: vigencia y alcance pendientes de cierre en esta implementación"
      )
    if (c.calificacion !== "laboral-estatutaria-acreditada")
      return rechazo("Servicios efectivos sin calificación acreditada")
    if (new D(c.cuotaTrasArt80).gt(c.cuotaLiquidaTotal))
      return rechazo("Cuota posterior al art80 superior a cuota líquida")
    if (new D(c.netoReducidoServicios).gt(c.brutoServicios))
      return rechazo("Neto atribuible superior a sus servicios íntegros")
    if (new D(c.netoReducidoServicios).gt(c.baseLiquidableGeneral))
      return rechazo("Proporción con pérdidas/compensaciones no cerrada")
    legal =
      new D(c.otrasRentasNoExentas).gt(6500) || new D(c.brutoServicios).eq(0)
        ? new D(0)
        : D.max(
            0,
            new D(340).minus(
              D.max(0, new D(c.brutoServicios).minus(16576)).times("0.2")
            )
          )
    limite = new D(c.baseLiquidableGeneral).eq(0)
      ? new D(0)
      : new D(c.cuotaIntegraGeneral)
          .times(c.netoReducidoServicios)
          .div(c.baseLiquidableGeneral)
    fuente = "Ley5/2025 DF3 pp46–47; AEAT2025 pp1372–1375"
  }
  const aplicable = D.min(legal, limite, c.cuotaTrasArt80)
  return {
    estado: "calculado",
    deduccionLegal: legal.toString(),
    limiteAtribuible: limite.toString(),
    importeAplicable: aplicable.toString(),
    cuotaPosterior: new D(c.cuotaTrasArt80).minus(aplicable).toString(),
    fuente,
    aceptacionFiscal: "pendiente",
  }
}
