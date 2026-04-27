import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const archivosInterfaz = [
  "app/errata/page.tsx",
  "components/auditoria.tsx",
  "components/navegacion-sitio.tsx",
  "components/simulador.tsx",
  "components/ui/accordion.tsx",
  "components/ui/button.tsx",
  "components/ui/card.tsx",
  "components/ui/chart.tsx",
] as const

describe("tipografia de la interfaz", () => {
  it("no declara texto visible por debajo de 14px", () => {
    const infracciones = archivosInterfaz.flatMap((archivo) => {
      const contenido = readFileSync(join(process.cwd(), archivo), "utf8")
      const lineas = contenido.split("\n")

      return lineas.flatMap((linea, indice) => {
        const problemas: string[] = []
        if (/\btext-xs\b/.test(linea)) {
          problemas.push("text-xs equivale a 12px")
        }
        for (const coincidencia of linea.matchAll(/\btext-\[(\d+)px\]/g)) {
          const px = Number(coincidencia[1])
          if (px < 14) {
            problemas.push(`${coincidencia[0]} declara ${px}px`)
          }
        }
        for (const coincidencia of linea.matchAll(/fontSize(?:=|: )\{?(\d+)/g)) {
          const px = Number(coincidencia[1])
          if (px < 14) {
            problemas.push(`fontSize declara ${px}px`)
          }
        }

        return problemas.map(
          (problema) => `${archivo}:${indice + 1}: ${problema}`
        )
      })
    })

    expect(infracciones).toEqual([])
  })
})
