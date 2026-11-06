import Decimal from "decimal.js"
import { sumaBasesPersonas2025, type LibroBasesFamiliares2025 } from "./productor"
import type { SolicitudDeduccionesValencianasAnual2025 } from "../deducciones/valenciana-2025/anual"
import type { ResultadoCuotaConjuntaValenciana2025 } from "../deducciones/valenciana-2025/cuota-conjunta"
const D = Decimal.clone({ precision: 80 })
const codigo = "valenciana_dos_o_mas_descendientes"
/** Corte ordinario de art4.Uno.t: sin otras deducciones; no toma cuotas de familiares.
 * La ampliación a concurrencias exige resolver sus minoraciones antes de este 10%.
 */
export function aplicarDosDescendientesAnual2025(
  s: SolicitudDeduccionesValencianasAnual2025,
  libro: LibroBasesFamiliares2025 | undefined,
  atribuciones: readonly { readonly sujetoId: string; readonly titulares: readonly string[] }[],
  cuotaPropia: Decimal
): ResultadoCuotaConjuntaValenciana2025<string> {
  if (libro === undefined) throw new RangeError("Valencia art4.Uno.t: falta censo económico completo2025 por persona, filiación y convivencia; no se reciben bases ni cuotas externas")
  const p = s.solicitudes[0]
  if (s.solicitudes.length !== 1 || p?.codigo !== codigo || p.eleccion !== "aplicar" || s.arrastres.length !== 0 || s.ordenBase30.length !== 0 || s.cantidades.length !== 0)
    throw new RangeError("Valencia art4.Uno.t: falta conciliación de las demás minoraciones/deducciones y sus operaciones; primer corte sólo deducción única sin arrastres")
  if (p.unidades.length !== 1 || p.unidades[0]!.fecha !== "2025-12-31" || Object.keys(p.unidades[0]!.numeros).length !== 0 || Object.keys(p.unidades[0]!.textos).length !== 0 || p.unidades[0]!.titulares.length !== 1 || p.unidades[0]!.titulares[0] !== s.contribuyente)
    throw new RangeError("Valencia art4.Uno.t: una unidad propia al devengo sin magnitudes ni cuotas consignadas")
  const ds = atribuciones.filter(a => a.titulares.includes(s.contribuyente))
  const sujetos = p.referencias.flatMap(r => r.sujetos)
  if (p.referencias.length !== 1 || p.referencias[0]!.unidad !== p.unidades[0]!.id || sujetos.length !== ds.length || new Set(sujetos).size !== sujetos.length || ds.some(a => !sujetos.includes(a.sujetoId)) || p.referencias.some(r => r.bienes.length + r.eventos.length + r.cantidades.length !== 0))
    throw new RangeError("Valencia art4.Uno.t: referencias deben identificar todos los descendientes con mínimo propio; sin gastos ni eventos inventados")
  const ids = [...new Set(ds.flatMap(a => [a.sujetoId, ...a.titulares]))]
  const agregadas = sumaBasesPersonas2025(libro, ids)
  const generado = ds.length >= 2 && agregadas.lte(30000) ? D.max(0, cuotaPropia).times("0.1") : new D(0)
  const aplicado = D.min(D.max(0, cuotaPropia), generado)
  const id = JSON.stringify([codigo, 2025, s.contribuyente])
  if (s.ordenConsumo.length !== 1 || s.ordenConsumo[0] !== id || s.criterioOrden !== "eleccion_experta") throw new RangeError("Valencia art4.Uno.t: orden de consumo único propio ausente")
  const motivo = "Art4.Uno.t2025: bases imponibles por personas únicas=" + agregadas.toFixed() + "; descendientes con mínimo=" + ds.length + "; sin otras minoraciones; cuota propia única. Censo=" + libro.referencia
  return {
    estado: "calculo_parcial", aceptacionFiscal: "pendiente", incidencias: [], reserva: "Primer corte individual ordinario sin concurrencias; autenticidad documental pendiente",
    // El evaluador histórico usa number: no se publica una fila redondeada que aparente ser el importe interno.
    composicion: { estado: "calculo_parcial", aceptacionFiscal: "pendiente", resultados: [], incidencias: [] },
    referenciaCuota: "cuota-autonomica-anual-2025:" + s.contribuyente,
    totalAplicado: aplicado.toFixed(), cuotaRestante: new D(cuotaPropia).minus(aplicado).toFixed(),
    movimientos: [{ id, codigo, contribuyente: s.contribuyente, origen: 2025, soporte: motivo, clase: "generado_2025", deduccionDisponible: generado.toFixed(), aplicado: aplicado.toFixed(), pendiente: "0", perdidoPorCuota: generado.minus(aplicado).toFixed(), caducadoAlCierre: "0" }],
  }
}

/** Concurrencia acotada: deporte propio validado por la composición ordinaria.
 * El callback es interno al núcleo anual: no es un resultado fiscal del usuario.
 * La secuencia legal no depende del orden de solicitudes ni de ordenConsumo.
 */
export function aplicarConcurrenciaDosDescendientesAnual2025(
  s: SolicitudDeduccionesValencianasAnual2025,
  libro: LibroBasesFamiliares2025 | undefined,
  atribuciones: readonly { readonly sujetoId: string; readonly titulares: readonly string[] }[],
  cuotaPropia: Decimal,
  evaluar: (solicitud: SolicitudDeduccionesValencianasAnual2025) => ResultadoCuotaConjuntaValenciana2025<string>
): ResultadoCuotaConjuntaValenciana2025<string> {
  if (libro === undefined) throw new RangeError("Valencia art4.Uno.t: falta censo económico completo2025 por persona, filiación y convivencia; no se reciben bases ni cuotas externas")
  const deporte = "valenciana_deporte_actividades_saludables"
  const t = s.solicitudes.filter(p => p.codigo === codigo)
  const otras = s.solicitudes.filter(p => p.codigo !== codigo)
  if (t.length !== 1 || t[0]!.eleccion !== "aplicar" || otras.length !== 1 ||
      otras[0]!.codigo !== deporte || otras[0]!.eleccion !== "aplicar" ||
      s.arrastres.length !== 0 || s.ordenBase30.length !== 0 || s.consignaciones.length !== 0)
    throw new RangeError("Valencia art4.Uno.t: concurrencia implementada sólo con deporte propio sin arrastres; las demás minoraciones requieren productor y coordinación explícitos")
  const ids = [deporte, codigo].map(c => JSON.stringify([c, 2025, s.contribuyente]))
  if (s.criterioOrden !== "eleccion_experta" || s.ordenConsumo.length !== 2 ||
      new Set(s.ordenConsumo).size !== 2 || s.ordenConsumo.some(id => !ids.includes(id)))
    throw new RangeError("Valencia art4.Uno.t: orden incompleto, duplicado o ajeno en concurrencia")
  const p = otras[0]!
  if (p.unidades.some(u => u.titulares.length !== 1 || u.titulares[0] !== s.contribuyente) ||
      p.referencias.some(r => r.sujetos.length !== 1 || r.sujetos[0] !== s.contribuyente) ||
      t[0]!.descendientesIncremento !== undefined)
    throw new RangeError("Valencia art4.Uno.t: deporte limitado a gasto propio; incremento de otro código no admitido")
  const usados = p.referencias.flatMap(r => r.cantidades)
  if (s.cantidades.some(c => !usados.includes(c.id)))
    throw new RangeError("Valencia art4.Uno.t: cantidades sin gasto conciliado")
  const previa = evaluar({ ...s, solicitudes: otras, ordenConsumo: [ids[0]!] })
  if (previa.estado !== "calculo_parcial") return previa
  if (previa.cuotaRestante === undefined || previa.totalAplicado === undefined ||
      previa.movimientos.length !== 1 || previa.movimientos[0]!.id !== ids[0])
    throw new RangeError("Valencia art4.Uno.t: falta libro de minoraciones completo; no se sustituye por cero")
  const residual = new D(previa.cuotaRestante)
  if (!residual.isFinite() || residual.lt(0) || !new D(previa.totalAplicado).plus(residual).eq(cuotaPropia))
    throw new RangeError("Valencia art4.Uno.t: libro previo incoherente con cuota anual")
  const final = aplicarDosDescendientesAnual2025(
    { ...s, solicitudes: t, cantidades: [], ordenConsumo: [ids[1]!] },
    libro, atribuciones, residual
  )
  return {
    ...final,
    composicion: previa.composicion,
    reserva: "Concurrencia individual ordinaria art4.Uno.t con deporte propio; acreditaciones pendientes",
    totalAplicado: new D(previa.totalAplicado).plus(final.totalAplicado!).toFixed(),
    movimientos: [...previa.movimientos, ...final.movimientos.map(m => ({
      ...m, soporte: m.soporte.replace("sin otras minoraciones; cuota propia única", "después de deporte propio; residual=" + residual.toFixed() + "; consumo único")
    }))],
  }
}
