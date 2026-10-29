import { Schema } from "effect"
import type { RastroCalculo } from "../dominio/explicacion/rastro-calculo"
import type { LineaCalculo } from "../dominio/explicacion/paso-explicacion"
import { Hash, Id, Referencia } from "./modelo"
import { VersionesRastro, enlaceRastro } from "./rastro"
import generado from "./rastro-generado.json"

export const CatalogoRastro = Schema.Struct({
  version: Schema.Literal(1),
  actual: Schema.NullOr(
    Schema.Struct({
      versiones: VersionesRastro,
      catalogoSha256: Hash,
    })
  ),
  bindings: Schema.Array(
    Schema.Struct({
      siteId: Id,
      sujeto: Referencia,
      unidad: Schema.Literals(["EUR", "percent"]),
    })
  ),
})

const catalogo = Schema.decodeUnknownSync(CatalogoRastro)(generado, {
  onExcessProperty: "error",
})
const decimalFinito = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/

/** Se llama al producir el resultado; un rastro ya versionado no se retaggea. */
export function enlazarRastroAnualActual(rastro: RastroCalculo): RastroCalculo {
  return enlazarRastroConCatalogo(rastro, catalogo)
}

export function enlazarRastroConCatalogo(
  rastro: RastroCalculo,
  entrada: typeof CatalogoRastro.Type
): RastroCalculo {
  const datos = Schema.decodeUnknownSync(CatalogoRastro)(entrada, {
    onExcessProperty: "error",
  })
  if (
    rastro.pasos.some(
      (p) =>
        p.lineasCalculo?.some((l) => l.procedencia?.estado === "enlazada") ===
        true
    )
  )
    throw new Error("Rastro ya versionado; conservar su snapshot original")
  const porSitio = new Map(datos.bindings.map((b) => [b.siteId, b]))
  if (porSitio.size !== datos.bindings.length)
    throw new Error("Binding duplicado")
  const instancias = new Set<string>()
  function enlazar(linea: LineaCalculo): LineaCalculo {
    const pendiente = (motivo: string): LineaCalculo => ({
      ...linea,
      procedencia: { estado: "pendiente", motivo },
    })
    const origen = linea.origen
    if (origen === undefined)
      return pendiente(
        "Línea anterior a la instrumentación; no se infiere su identidad."
      )
    if (!Schema.is(Id)(origen.instanceId) || instancias.has(origen.instanceId))
      throw new Error("Instancia del rastro inválida o repetida")
    instancias.add(origen.instanceId)
    if (!decimalFinito.test(origen.decimal))
      return pendiente("Resultado no decimal finito.")
    const binding = porSitio.get(origen.siteId)
    if (datos.actual === null || binding === undefined)
      return pendiente("Punto sin ficha en el snapshot generado.")
    if (binding.unidad !== origen.unidad)
      throw new Error("Unidad del rastro distinta del punto")
    const versiones = datos.actual.versiones
    return {
      ...linea,
      procedencia: {
        estado: "enlazada",
        ...versiones,
        sujeto: binding.sujeto,
        href: enlaceRastro(versiones, {
          siteId: origen.siteId,
          instanceId: origen.instanceId,
          sujeto: binding.sujeto,
        }),
      },
    }
  }
  return {
    ...rastro,
    pasos: rastro.pasos.map((p) =>
      p.lineasCalculo === undefined
        ? p
        : { ...p, lineasCalculo: p.lineasCalculo.map(enlazar) }
    ),
  }
}
