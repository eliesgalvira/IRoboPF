import { Schema } from "effect"
import { Id, Hash, Referencia, Resultado } from "./modelo"

export const VersionesRastro = Schema.Struct({
  snapshot: Hash,
  algoritmo: Hash,
  datos: Hash,
  explicacion: Schema.String,
})
export const PuntoRastro = Schema.Struct({
  siteId: Id,
  instanceId: Id,
  sujeto: Referencia,
})
export type PuntoRastro = typeof PuntoRastro.Type
export type VersionesRastro = typeof VersionesRastro.Type
export const LineaRastro = Schema.Struct({
  punto: PuntoRastro,
  resultado: Resultado,
})
export function adaptarLegado() {
  return {
    estado: "pendiente",
    motivo:
      "Rastro antiguo sin siteId ni versiones. No se deducen enlaces de etiquetas.",
  }
}
export function enlaceRastro(versiones: VersionesRastro, punto: PuntoRastro) {
  Schema.decodeUnknownSync(VersionesRastro)(versiones, {
    onExcessProperty: "error",
  })
  Schema.decodeUnknownSync(PuntoRastro)(punto, { onExcessProperty: "error" })
  return `/procedencia/${versiones.snapshot}/${punto.sujeto.id}/${punto.sujeto.revision}`
}
export function verificarRastro(
  versiones: VersionesRastro,
  esperadas: VersionesRastro,
  lineas: ReadonlyArray<typeof LineaRastro.Type>,
  bindings: ReadonlyMap<string, typeof Referencia.Type>
) {
  if (JSON.stringify(versiones) !== JSON.stringify(esperadas))
    throw new Error("Versiones incompatibles")
  const instancias = new Set<string>()
  for (const linea of lineas) {
    Schema.decodeUnknownSync(LineaRastro)(linea, { onExcessProperty: "error" })
    if (instancias.has(linea.punto.instanceId))
      throw new Error("Instancia repetida")
    instancias.add(linea.punto.instanceId)
    const sujeto = bindings.get(linea.punto.siteId)
    if (
      sujeto === undefined ||
      sujeto.id !== linea.punto.sujeto.id ||
      sujeto.revision !== linea.punto.sujeto.revision
    )
      throw new Error("Binding incompatible")
  }
}
