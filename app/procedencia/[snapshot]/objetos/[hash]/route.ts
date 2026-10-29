import { responderObjeto } from "@/lib/procedencia/http"

export const dynamic = "force-dynamic"
export function GET(
  _request: Request,
  contexto: { params: Promise<{ snapshot: string; hash: string }> }
) {
  return contexto.params.then(({ snapshot, hash }) =>
    responderObjeto(snapshot, hash)
  )
}
