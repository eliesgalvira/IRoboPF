import { Schema } from "effect"
import type { HechosAnualesTerritoriales } from "../anual-territorial-tipos"
import type { Uso } from "../asturias-cantabria-ampliacion-2025"

const objeto = Schema.is(Schema.Record(Schema.String, Schema.Json))
const lista = Schema.is(Schema.Array(Schema.Json))
const texto = Schema.is(Schema.String)
function codigo(s: HechosAnualesTerritoriales): string {
  return "codigo" in s ? s.codigo : s.hechos.codigo
}
function identificadores(datos: Schema.Json): readonly string[] {
  if (lista(datos)) return datos.flatMap(identificadores)
  if (!objeto(datos)) return []
  const ids = ["persona", "hijo", "descendiente", "paciente", "beneficiario", "empleado", "entidad", "objeto"]
    .flatMap(k => { const valor = datos[k]; return texto(valor) ? [valor] : [] })
  if (texto(datos.id) && ("nacimiento" in datos || "municipio" in datos || "empresa" in datos || "escritura" in datos)) ids.push(datos.id)
  for (const k of ["operaciones", "inversiones", "donaciones"])
    { const valor = datos[k]; if (lista(valor))
      for (const x of valor) if (objeto(x) && texto(x.id)) ids.push(x.id) }
  return [...ids, ...Object.values(datos).flatMap(identificadores)]
}
/** Proceden del censo real de solicitudes, incluyendo B previo y A40; no de usos del cliente. */
export function eleccionesTerritorialesB(
  solicitudes: readonly HechosAnualesTerritoriales[], contribuyente: string
): readonly Uso[] {
  return solicitudes.flatMap(s => [...new Set([contribuyente, ...identificadores(Schema.decodeUnknownSync(Schema.Json)(s.hechos))])]
    .map(objeto => ({ contribuyente, codigo: codigo(s), objeto })))
}
type ReferenciaMonetaria = { readonly id: string; readonly documentos: readonly string[] }
function pagos(datos: Schema.Json): readonly ReferenciaMonetaria[] {
  if (lista(datos)) return datos.flatMap(pagos)
  if (!objeto(datos)) return []
  const propios: ReferenciaMonetaria[] = []
  if (texto(datos.id) && ["importe", "importeEUR", "importeCentimos", "euros"].some(k => k in datos)) {
    const documentos = ["factura", "documento", "justificante"].flatMap(k => {
      const v = datos[k]
      return texto(v) ? [v] : objeto(v) && texto(v.referencia) ? [v.referencia] : []
    })
    propios.push({ id: datos.id, documentos })
  }
  return [...propios, ...Object.values(datos).flatMap(pagos)]
}
/** Normaliza aliases de justificante para impedir ocultación entre contratos de lotes distintos. */
export function conciliarPagosEntreLotesB(solicitudes: readonly HechosAnualesTerritoriales[]): void {
  const ids = new Map<string, number>(), documentos = new Map<string, number>()
  solicitudes.forEach((s, indice) => {
    for (const p of pagos(Schema.decodeUnknownSync(Schema.Json)(s.hechos))) {
      const previo = ids.get(p.id)
      if (previo !== undefined && previo !== indice) throw new RangeError("Pago duplicado entre lotes: " + p.id)
      ids.set(p.id, indice)
      for (const d of p.documentos) {
        const anterior = documentos.get(d)
        if (anterior !== undefined && anterior !== indice) throw new RangeError("Documento monetario duplicado entre lotes: " + d)
        documentos.set(d, indice)
      }
    }
  })
}
