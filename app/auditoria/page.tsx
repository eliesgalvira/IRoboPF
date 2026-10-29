import { Match } from "effect"
import { use } from "react"

import { Auditoria } from "@/components/auditoria"

type SearchParams = Record<string, string | ReadonlyArray<string> | undefined>

export default function PaginaAuditoria({
  searchParams,
}: {
  readonly searchParams?: Promise<SearchParams>
}) {
  const parametros = new URLSearchParams()
  const parametrosResueltos =
    searchParams === undefined ? {} : use(searchParams)

  for (const [clave, valor] of Object.entries(parametrosResueltos ?? {})) {
    if (Match.string(valor)) {
      parametros.set(clave, valor)
    } else if (Array.isArray(valor)) {
      for (const elemento of valor) {
        parametros.append(clave, elemento)
      }
    }
  }

  return <Auditoria parametrosIniciales={parametros.toString()} />
}
