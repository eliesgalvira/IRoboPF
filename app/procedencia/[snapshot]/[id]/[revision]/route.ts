import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { resolver } from "@/lib/procedencia/almacen"
import { Ficha } from "@/lib/procedencia/ficha"

export const dynamic = "force-dynamic"
export function GET(
  _request: Request,
  contexto: {
    params: Promise<{ snapshot: string; id: string; revision: string }>
  }
) {
  return contexto.params.then(({ snapshot, id, revision }) => {
    try {
      const entidad = resolver(snapshot, id, revision)
      if (entidad === null)
        return new Response("Ficha desconocida", { status: 404 })
      const html = renderToStaticMarkup(
        createElement(Ficha, { entidad, snapshot })
      )
      return new Response(
        `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Procedencia documental</title></head><body>${html}</body></html>`,
        {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store",
            "Content-Security-Policy":
              "default-src 'none'; style-src 'self'; frame-ancestors 'none'",
            "Referrer-Policy": "no-referrer",
          },
        }
      )
    } catch {
      return new Response(
        "Contenido prometido no disponible. No se sustituye por otra revisión.",
        {
          status: 503,
          headers: { "Cache-Control": "no-store", "Retry-After": "60" },
        }
      )
    }
  })
}
