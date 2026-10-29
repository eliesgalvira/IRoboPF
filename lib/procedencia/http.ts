import { blobPublico, directorioContenido } from "./almacen"

export function responderObjeto(
  snapshot: string,
  hash: string,
  raiz = directorioContenido
) {
  try {
    const blob = blobPublico(snapshot, hash, raiz)
    if (blob === null)
      return new Response("Objeto público desconocido", { status: 404 })
    return new Response(
      new Uint8Array(
        blob.bytes.buffer,
        blob.bytes.byteOffset,
        blob.bytes.byteLength
      ),
      {
        headers: {
          "Content-Type": blob.mime,
          "Content-Length": String(blob.bytes.length),
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "public, max-age=31536000, immutable",
          "Referrer-Policy": "no-referrer",
          "Content-Security-Policy":
            "default-src 'none'; frame-ancestors 'none'",
        },
      }
    )
  } catch {
    return new Response("Objeto prometido no disponible", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    })
  }
}
