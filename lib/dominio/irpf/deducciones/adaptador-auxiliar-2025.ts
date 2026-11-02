import Decimal from "decimal.js"
import type { EntradasDeduccionesAutonomicas } from "../deducciones-autonomicas-aplicadas"
import type { AmbitoDeducciones } from "./ambito"
import {
  CODIGOS_AUXILIAR_CON_HECHOS,
  evaluarHechosAuxiliar2025,
  type CodigoAuxiliarConHechos,
  type HechosAuxiliar2025,
} from "./hechos-auxiliar-2025"

const clavesHeredadas = new Map<CodigoAuxiliarConHechos, readonly string[]>([
  [
    "canarias_nacimiento_adopcion_hijos",
    [
      "canariasHijosNacimientoAdopcion",
      "canariasHijosNacimientoAdopcionDiscapacidad65",
    ],
  ],
  ["canarias_familia_numerosa", ["canariasCategoriaFamiliaNumerosa"]],
  [
    "canarias_discapacidad_mayores_65",
    ["canariasContribuyenteDiscapacidad33", "canariasContribuyenteMayor65"],
  ],
  [
    "canarias_contribuyentes_desempleados",
    ["canariasDesempleadoCumpleRequisitos"],
  ],
  ["madrid_nacimiento_adopcion_hijos", ["madridHijosNacimientoAdopcion"]],
])
export function exigeHechosAuxiliar(codigo: string): boolean {
  return CODIGOS_AUXILIAR_CON_HECHOS.some((c) => c === codigo)
}
function activa(
  entradas: EntradasDeduccionesAutonomicas,
  codigo: CodigoAuxiliarConHechos
): boolean {
  return (
    entradas[codigo + ":cumple"] === true ||
    (clavesHeredadas.get(codigo) ?? []).some((clave) => {
      const v = entradas[clave]
      return (
        v === true ||
        (Number.isFinite(v) && v !== 0) ||
        v === "general" ||
        v === "especial"
      )
    })
  )
}
/** Puente explícito para el auxiliar numérico heredado, siempre parcial.
 * Las consignaciones pertenecen a calcularDeduccionesConsignadas. */
export function adaptarHechosAuxiliar(
  entradas: EntradasDeduccionesAutonomicas,
  ambito: AmbitoDeducciones,
  hechos: HechosAuxiliar2025
): number {
  if (new Set(hechos.map((h) => h.codigo)).size !== hechos.length)
    throw new RangeError("Hechos de deducción duplicados")
  let total = new Decimal(0)
  for (const h of hechos) {
    if (
      !exigeHechosAuxiliar(h.codigo) ||
      h.contexto.ejercicio !== ambito.ejercicio ||
      h.contexto.territorio !== ambito.territorio ||
      (ambito.modalidad !== undefined &&
        h.contexto.modalidad !== ambito.modalidad) ||
      (ambito.contribuyente !== undefined &&
        !h.declarantes.includes(ambito.contribuyente)) ||
      (ambito.declarantes !== undefined &&
        (new Set(ambito.declarantes).size !== ambito.declarantes.length ||
          ambito.declarantes.length !== h.declarantes.length ||
          ambito.declarantes.some((id) => !h.declarantes.includes(id))))
    )
      throw new RangeError("Hechos de otro ámbito")
    if (entradas[h.codigo + ":importe"] !== undefined)
      throw new RangeError(
        "Importe manual incompatible con hechos derivados: " + h.codigo
      )
    const resultado = evaluarHechosAuxiliar2025(h)
    if (resultado.estado === "no_soportado")
      throw new RangeError("Hechos insuficientes para deducción: " + h.codigo)
    const referencia = hechos[0]
    if (
      (h.contexto.modalidad === "individual" &&
        h.contexto.contribuyente !== referencia.contexto.contribuyente) ||
      h.contexto.modalidad !== referencia.contexto.modalidad ||
      h.declarantes.length !== referencia.declarantes.length ||
      h.declarantes.some((id) => !referencia.declarantes.includes(id))
    )
      throw new RangeError("Hechos de distintas declaraciones")
    if ("importe" in resultado) total = total.plus(resultado.importe)
  }
  for (const codigo of CODIGOS_AUXILIAR_CON_HECHOS) {
    if (activa(entradas, codigo) && !hechos.some((h) => h.codigo === codigo))
      throw new RangeError("Hechos insuficientes para deducción: " + codigo)
  }
  return total.toDecimalPlaces(2).toNumber()
}
