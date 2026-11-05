import type { LibroDonativosEstatales2025 } from "../deducciones/donativos-estatales-2025/productor"
import type { LibroMaternidad81 } from "./producir"

/** Rechazo de alcance, no denegación de un derecho fiscal ni importe cero. */
export const MOTIVO_ELA81_PENDIENTE = "Combinación ELA+art81 pendiente: falta representar y contrastar conjuntamente renta nominal, mínimo y calendario; use las ramas individuales sin importar magnitudes fiscales"

/** Identidades monetarias de ambos libros ya validados, antes de componer cuota y diferencial. */
export function motivoPagoReutilizado81(
  maternidad: LibroMaternidad81 | undefined,
  donativos: LibroDonativosEstatales2025 | undefined
): string | undefined {
  if (maternidad === undefined || donativos === undefined) return undefined
  const facturas = maternidad.hijos.flatMap(h => h.hechos.facturas)
  const documentos = new Set(facturas.map(f => f.id))
  const pagos = new Set(facturas.flatMap(f => [
    ...f.pagos.map(p => p.id), ...f.pagosEmpresa.map(p => p.id),
  ]))
  for (const operacion of donativos.operaciones) {
    // La etiqueta local de una operación no identifica un pago ni un documento.
    if (pagos.has(operacion.pago.id))
      return "Identificador de pago reutilizado entre guardería del artículo 81 y donativos: " + operacion.pago.id
    if (documentos.has(operacion.pago.documento))
      return "Referencia documental reutilizada entre guardería del artículo 81 y donativos: " + operacion.pago.documento
  }
  return undefined
}
