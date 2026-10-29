import { use } from "react"
import { notFound } from "next/navigation"
import { buscar } from "@/lib/procedencia/almacen"

export const dynamic = "force-dynamic"
export default function Ambito({
  params,
}: {
  params: Promise<{ snapshot: string; territorio: string; ejercicio: string }>
}) {
  const { snapshot, territorio, ejercicio } = use(params)
  if (
    !/^[a-z-]{1,40}$/.test(territorio) ||
    !/^20(1[2-9]|2[0-6])$/.test(ejercicio)
  )
    notFound()
  const entradas = buscar(snapshot, "", territorio, ejercicio)
  if (entradas === null) notFound()
  return (
    <main>
      <h1>
        Ámbito candidato: {territorio}, {ejercicio}
      </h1>
      <p>
        Dimensiones inferidas, sin aceptación de vigencia. Máximo 30 resultados.
      </p>
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
