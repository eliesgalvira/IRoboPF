import { Auditoria } from "@/components/auditoria"

type SearchParams = Record<string, string | ReadonlyArray<string> | undefined>

export default async function PaginaAuditoria({
  searchParams,
}: {
  readonly searchParams?: Promise<SearchParams>
}) {
  const parametros = new URLSearchParams()
  const parametrosResueltos = await searchParams

  for (const [clave, valor] of Object.entries(parametrosResueltos ?? {})) {
    if (typeof valor === "string") {
      parametros.set(clave, valor)
    } else if (Array.isArray(valor)) {
      for (const elemento of valor) {
        parametros.append(clave, elemento)
      }
    }
  }

  return <Auditoria parametrosIniciales={parametros.toString()} />
}
