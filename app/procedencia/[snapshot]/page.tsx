import { use } from "react"
import { notFound } from "next/navigation"
import { buscar } from "@/lib/procedencia/almacen"

export const dynamic = "force-dynamic"
export default function Indice({
  params,
  searchParams,
}: {
  params: Promise<{ snapshot: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { snapshot } = use(params)
  const { q } = use(searchParams)
  const entradas = buscar(snapshot, q ?? "")
  if (entradas === null) notFound()
  return (
    <main>
      <h1>Procedencia pendiente de revisión</h1>
      <p>
        Índice acotado a 30 resultados. Busca solo conceptos públicos, nunca
        datos personales.
      </p>
      <form>
        <label>
          Concepto o ID <input name="q" maxLength={120} />
        </label>
        <button>Buscar</button>
      </form>
      <ul>
        {entradas.map((e) => (
          <li key={e.id}>
            <a href={`/procedencia/${snapshot}/${e.id}/${e.revision}`}>
              {e.titulo}
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
