import { cuotaFrancesa, interesMensual, tipoMensual } from "../../../financiero/hipoteca-mensual"
import { dia } from "../../inmobiliario-2025/calendario"
import { racional } from "../anual-territorial-racional"
import type { PagoF, SolicitudF, ViviendaF } from "./esquemas"
import { D, dinero, entero, falta, fecha, ids, opcion, requerido, salidaExactaF, texto, type ResultadoF } from "./comun"

/** Porcentaje contractual, distinto de un importe EUR; acepta índice firmado. */
function porcentaje(v: string | undefined, campo: string, firmado = false): import("./comun").Decimal {
  const valor = texto(v, campo)
  if (!(firmado ? /^-?(0|[1-9]\d?)(\.\d{1,6})?$/ : /^(0|[1-9]\d?)(\.\d{1,6})?$/).test(valor))
    falta(campo, "Porcentaje exacto menor100 y máximo6decimales requerido")
  return new D(valor)
}

/** Art10 Madrid: mismo saldo inicial, trayectoria contrafactual propia durante2025.
 * Enero es revisión contractual: evita inferir la cuota vigente desde un saldo suelto.
 */
export function hipotecaMadrid(s: SolicitudF, v: ViviendaF, ps: readonly PagoF[]): ResultadoF {
  const p = requerido(s.hechos.prestamos?.[0], "prestamo")
  const h = requerido(p.contratoMadrid, "contratoMadrid: calendario contractual y saldo documentado")
  texto(h.documento, "contrato.documento")
  texto(h.certificadoSaldo, "contrato.certificadoSaldo")
  texto(h.referenciaHabitualAplicacion, "referenciaHabitualAplicacion")
  opcion(h.situacionAplicacion, ["sigue_habitual"], "situacionAplicacion")
  if (h.incidencias2025.length > 0) falta("incidencias2025", "Novación, mixto, carencia, mora, coberturas, cancelación o amortización extraordinaria: aportar trayectoria específica; no inferir ausencia")
  if (ids(h.prestatarios, "prestatarios").length !== 1 || h.prestatarios[0] !== s.contexto.contribuyente ||
      ids(v.titulares, "vivienda.titulares").length !== 1 || v.titulares?.[0] !== s.contexto.contribuyente ||
      !dinero(v.porcentajePropiedad, "porcentajePropiedad").eq(100))
    falta("prestatarios/titulares", "Primer perfil: único prestatario y propietario, pagos íntegros propios")
  texto(p.entidadCredito, "prestamo.entidadCredito")
  texto(p.soporteDestino, "prestamo.soporteDestino")
  opcion(h.destino, ["adquisicion_integra_vivienda"], "destino")
  const firma = fecha(p.fecha, "prestamo.fecha")
  if (firma >= "2025-01-01" || firma !== fecha(v.adquisicion, "adquisicion"))
    falta("prestamo.fecha", "Préstamo de adquisición anterior a2025; refinanciación requiere trazabilidad distinta")
  const n = entero(h.mesesPendientesInicio2025, "mesesPendientes", 12, 600)
  const diaRecibo = entero(h.diaRecibo, "diaRecibo", 1, 28)
  const lag = entero(h.desfaseIndiceMeses, "desfaseIndiceMeses", 1, 2)
  const meses = h.revision === "enero_anual" ? [1] : [1, 7]
  if (h.revisiones.length !== meses.length || h.revisiones.some((r, i) => r.mes !== meses[i]))
    falta("revisiones", "Calendario completo y ordenado según revisión contractual enero/anual o enero/julio")
  const saldo = dinero(h.saldoInicio2025EUR, "saldoInicio2025EUR")
  if (saldo.lte(0) || !saldo.times(100).isInteger()) falta("saldoInicio2025EUR", "Capital positivo en céntimos")
  const diferencial = porcentaje(h.diferencialPorcentaje, "diferencialPorcentaje")
  const tinRef = new D("3.018").plus(diferencial).toFixed()
  if (!/^\d{1,2}(\.\d{1,6})?$/.test(tinRef)) falta("diferencialPorcentaje", "TIN con máximo6 decimales y menor100")
  const ref = tipoMensual(tinRef)
  let real = BigInt(saldo.times(100).toFixed(0)), contra = real
  let cuotaReal = 0n, cuotaContra = 0n, exceso = 0n
  let tipo = ref
  const rastro: string[] = []
  if (h.recibos.length !== 12 || ps.length !== 12 || (s.hechos.pagos ?? []).length !== 12)
    falta("pagos", "Doce recibos íntegros sin atrasos, duplicados ni pagos ajenos al préstamo")
  for (let mes = 1; mes <= 12; mes++) {
    const revision = h.revisiones.find(r => r.mes === mes)
    if (revision !== undefined) {
      texto(revision.documento, "revision.documento")
      const previo = mes - lag
      const mesIndice = previo > 0 ? `2025-${String(previo).padStart(2, "0")}` : `2024-${String(12 + previo).padStart(2, "0")}`
      if (revision.mesIndice !== mesIndice) falta("revision.mesIndice", "Índice fuera del desfase contractual")
      // El índice es un hecho económico del recibo/revisión, no una magnitud fiscal.
      const euribor = porcentaje(revision.euriborPorcentaje, "euriborPorcentaje", true)
      const tin = euribor.plus(diferencial)
      if (tin.lt(0) || tin.gte(100)) falta("TIN", "Tipos negativos/suelo/techo requieren perfil específico")
      if (!/^\d{1,2}(\.\d{1,6})?$/.test(tin.toFixed())) falta("TIN", "TIN con máximo6 decimales")
      tipo = tipoMensual(tin.toFixed())
      cuotaReal = cuotaFrancesa(real, tipo, n - mes + 1)
      cuotaContra = cuotaFrancesa(contra, ref, n - mes + 1)
    }
    const f = `2025-${String(mes).padStart(2, "0")}-${String(diaRecibo).padStart(2, "0")}`
    if (!Number.isFinite(dia(f))) falta("calendario", "Fecha de recibo inválida")
    const recibos = ps.filter(x => fecha(x.fecha, "pago.fecha") === f)
    if (recibos.length !== 1) falta("pagos.fecha", "Recibo mensual ausente o repetido; no trasladar pagos entre meses")
    const pago = requerido(recibos[0], "recibo")
    const i = interesMensual(real, tipo), j = interesMensual(contra, ref)
    const totales = h.recibos.filter(r => r.mes === mes)
    if (totales.length !== 1) falta("recibos", "Cuota pagada ausente o duplicada")
    const total = requerido(totales[0], "recibo.total")
    texto(total.soporte, "recibo.soporte")
    if (!dinero(total.cuotaSatisfechaEUR, "cuotaSatisfechaEUR").times(100).eq((n === mes ? real + i : cuotaReal).toString()))
      falta("cuotaSatisfechaEUR", "Amortización y cuota efectivamente pagadas no concilian con contrato")
    if (!dinero(pago.importeEUR, "pago.importeEUR").times(100).eq(i.toString()))
      falta("pago.importeEUR", "Interés satisfecho incompatible con contrato y saldo; no admitir exceso calculado por cliente")
    if (pago.ayudasEUR !== undefined && !dinero(pago.ayudasEUR, "ayudasEUR").eq(0)) falta("ayudasEUR", "Cobertura/ayuda requiere reconstrucción distinta")
    if (cuotaReal <= i || cuotaContra <= j) falta("cuota", "Amortización nula o negativa fuera de perfil")
    exceso += i > j ? i - j : 0n
    rastro.push(`${f}: intereses céntimos real=${i}; contrafactual=${j}`)
    real -= n === mes ? real : cuotaReal - i
    contra -= n === mes ? contra : cuotaContra - j
    if (real < 0n || contra < 0n) falta("saldo", "Cancelación anticipada por redondeo: perfil específico")
  }
  // 25% de céntimos /100 = euros /400, sin presentación decimal intermedia.
  return salidaExactaF(s, racional((exceso > 120000n ? 120000n : exceso).toString(), "400"), [
    "Art10/18.2 Madrid2025; euríbor diciembre2022=3.018%; exceso positivo por mes; tope300", ...rastro,
  ], ["Perfil enero francés sin incidencias; no acredita perfiles mixtos, múltiples prestatarios ni cambios contractuales"])
}
