import { racional, type Racional } from "../anual-territorial-racional"
import { DonativoNoSoportado, type LibroDonativosEstatales2025 } from "./productor"
export type PagoRegionalDonativo = { readonly id: string; readonly pagador: string; readonly fecha: string; readonly euros: string; readonly documento: string }
/** Comparte la operación fiscal, no sólo un importe igual. */
export function baseEstatalMismaOperacion(libro: LibroDonativosEstatales2025, operacionId: string, entidadId: string, pago: PagoRegionalDonativo): Racional {
  if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(pago.euros))
    throw new DonativoNoSoportado({ siguienteHecho: "pago_regional.euros", motivo: "Pago regional declarado requiere EUR exactos en céntimos;la magnitud derivada usa canal separado" })
  const o = libro.operaciones.find((x) => x.operacionId === operacionId)
  if (o === undefined) throw new DonativoNoSoportado({ siguienteHecho: "censo68_3.operacionId:" + operacionId, motivo: "Donativo regional ausente del censo:identificar su elección o clasificación; no suponer base estatal cero" })
  if (o.entidadId !== entidadId || o.pago.id !== pago.id || o.pago.pagador !== pago.pagador || o.pago.fecha !== pago.fecha || o.pago.documento !== pago.documento || racional(o.pago.euros).numeradorEuros !== racional(pago.euros).numeradorEuros || racional(o.pago.euros).divisor !== racional(pago.euros).divisor)
    throw new DonativoNoSoportado({ siguienteHecho: "conciliacion_operacion_pago_entidad", motivo: "Identidad,fecha,importe,entidad o soporte contradictorios entre el libro estatal y regional" })
  if (!libro.atribucionBaseRegionalCompleta && o.eleccion === "aplicar")
    throw new DonativoNoSoportado({ siguienteHecho: "atribucion_base_estatal_con_cuota_insuficiente", motivo: "Deducción estatal parcialmente aplicada:la atribución de base efectivamente deducida no se inventa mediante prorrata inversa" })
  return o.baseComputada68_3
}
