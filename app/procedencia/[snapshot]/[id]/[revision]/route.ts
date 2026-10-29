import { createElement } from "react"
import { renderToReadableStream } from "react-dom/server.edge"
import {
  resolver,
  leerSnapshot,
  enlacesDocumentales,
} from "@/lib/procedencia/almacen"
import { Ficha } from "@/lib/procedencia/ficha"

export const dynamic = "force-dynamic"
const noDisponible = () =>
  new Response(
    "Contenido prometido no disponible. No se sustituye por otra revisión.",
    {
      status: 503,
      headers: { "Cache-Control": "no-store", "Retry-After": "60" },
    }
  )
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
      const fichaSnapshot = leerSnapshot(snapshot)
      const evidencias =
        fichaSnapshot?.version === 2
          ? fichaSnapshot.evidencias.filter(
              (e) => e.sujeto.id === id && e.sujeto.revision === revision
            )
          : []
      const documento = createElement(
        "html",
        { lang: "es" },
        createElement(
          "head",
          null,
          createElement("meta", { charSet: "utf-8" }),
          createElement("meta", {
            name: "viewport",
            content: "width=device-width",
          }),
          createElement("title", null, "Procedencia documental")
        ),
        createElement(
          "body",
          null,
          createElement(Ficha, {
            entidad,
            snapshot,
            evidencias,
            enlaces: enlacesDocumentales(snapshot, entidad),
          })
        )
      )
      // API de Web Streams expuesta por React y por el adaptador de Next.
      // Esperar allReady permite mantener el 503 antes de enviar el documento.
      return renderToReadableStream(documento)
        .then((stream) =>
          stream.allReady.then(
            () =>
              new Response(stream, {
                headers: {
                  "Content-Type": "text/html; charset=utf-8",
                  "Cache-Control": "no-store",
                  "Content-Security-Policy":
                    "default-src 'none'; style-src 'self'; frame-ancestors 'none'",
                  "Referrer-Policy": "no-referrer",
                },
              })
          )
        )
        .catch(noDisponible)
    } catch {
      return noDisponible()
    }
  })
}
