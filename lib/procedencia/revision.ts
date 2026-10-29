import { Schema } from "effect"
import { RevisionExterna, type Entidad } from "./modelo"
import { bytesEntidad, hash } from "./verificador"

// El registro lo proporciona el integrador tras acreditar independencia fuera del payload.
// Un nombre de autor/revisor nunca autoriza este registro por sí solo.
export interface InformeRegistrado {
  readonly hash: string
  readonly bytes: Uint8Array
  readonly sujetoRevision: string
  readonly alcanceHash: string
  readonly independenciaAcreditada: boolean
}
export function verificarRevision(
  revision: typeof RevisionExterna.Type,
  entidad: Entidad,
  informes: ReadonlyMap<string, InformeRegistrado>
) {
  Schema.decodeUnknownSync(RevisionExterna)(revision, {
    onExcessProperty: "error",
  })
  const digest = hash(bytesEntidad(entidad))
  if (revision.sujeto.id !== entidad.id || revision.sujeto.revision !== digest)
    throw new Error("Payload no examinado")
  if (
    revision.ambito.estado !== "conocido" ||
    JSON.stringify(revision.ambito) !== JSON.stringify(entidad.ambito)
  )
    throw new Error("Alcance no acreditado")
  const informe = informes.get(revision.informe)
  const alcance = hash(
    JSON.stringify({
      proposicion: revision.proposicion,
      fuentes: revision.fuentes,
      ambito: revision.ambito,
    })
  )
  if (
    informe === undefined ||
    hash(informe.bytes) !== revision.informe ||
    informe.hash !== revision.informe ||
    informe.sujetoRevision !== digest ||
    informe.alcanceHash !== alcance ||
    !informe.independenciaAcreditada
  )
    throw new Error("Informe independiente no acreditado")
  if (
    revision.fuentes.length === 0 ||
    revision.fuentes.some((f) => !entidad.fuentes.some((s) => s.sha256 === f))
  )
    throw new Error("Fuentes fuera de alcance")
  return { revisionDocumentada: true, aceptacionFiscal: "pendiente" }
}
