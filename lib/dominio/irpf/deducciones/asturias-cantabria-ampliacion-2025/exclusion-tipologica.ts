import { Result, Schema } from "effect"
import { documento, exigir, fecha, r, type MarcoB, type Vivienda, type PagoB } from "./comun"
const Texto = Schema.String.check(Schema.isPattern(/\S/))
const Euros = Schema.String.check(Schema.isPattern(/^\d{1,13}(?:\.\d{1,2})?$/))
const Documento = Schema.Struct({ referencia: Texto, organismo: Texto, fecha: Schema.String })
/** Hechos nominales; los documentos recibidos no se autentican mediante este esquema. */
export const ExclusionTipologicaAsturias2025 = Schema.Struct({
 origen: Schema.Literal("serpavi_excluido_tipologia"), ejercicio: Schema.Literal(2025),
 inmuebleId: Texto, catastro: Texto, propietario: Texto, titulo: Texto,
 porcentajePropiedad: Schema.Literal("100"), municipio: Texto,
 rendimiento: Schema.Literal("capital_inmobiliario"),
 tipologia: Schema.Literal("unifamiliar"), documento: Documento,
 acreditacion: Schema.Struct({ documento: Documento, inmuebleId: Texto, catastro: Texto, tipologia: Schema.Literal("unifamiliar") }),
 localizacion: Schema.Struct({ comunidad: Schema.Literal("asturias"), municipio: Texto, documento: Documento }),
 contrato: Schema.Struct({ id: Texto, documento: Texto, firma: Schema.String, desde: Schema.String, hasta: Schema.String,
  destino: Schema.Literal("vivienda-permanente-persona-fisica"), regimen: Schema.Literal("LAU-articulo-2") }),
 precio: Schema.Struct({ rentaMensual: Euros, desde: Schema.Literal("2025-01-01"), hasta: Schema.Literal("2025-12-31"),
  gastosPropietarioRepercutidos: Schema.Literal("0"), obligacionesArrendatario: Schema.Literal("0"), cambios: Schema.Literal("ninguno"),
  mensualidades: Schema.Array(Schema.Struct({ id: Texto, fecha: Schema.String, importe: Euros })).check(Schema.isMinLength(12), Schema.isMaxLength(12)) }),
 pagos: Schema.Array(Schema.Struct({ gastoId: Texto, pagador: Texto, soportePago: Texto, medio: Schema.Literal("transferencia") })).check(Schema.isMinLength(1), Schema.isMaxLength(1)),
 censo: Schema.Struct({ documento: Documento, ejercicio: Schema.Literal(2025), propietario: Texto,
  otrosInmuebles: Schema.Literal("ninguno"), otrosGastosElegibles: Schema.Literal("ninguno"), otrosIncentivos: Schema.Literal("ninguno"),
  otrosPagadores: Schema.Literal("ninguno"), cobertura: Schema.Literal("anual-completa") }),
})
export type ExclusionTipologicaAsturias2025 = typeof ExclusionTipologicaAsturias2025.Type
/** Rama cerrada: errores de consulta nunca son exclusión material. */
export function validarExclusionTipologica(m: MarcoB, e: ExclusionTipologicaAsturias2025, c: {
 readonly id: string; readonly inmueble: Vivienda; readonly rentaMensual: string;
 readonly gastos: readonly (PagoB & { readonly concepto: string })[]
}) {
 exigir(Result.isSuccess(Schema.decodeUnknownResult(ExclusionTipologicaAsturias2025)(e, {onExcessProperty:"error"})), "Exclusión tipológica no cerrada")
 for (const d of [e.documento,e.acreditacion.documento,e.localizacion.documento,e.censo.documento]) documento(d)
 const k=e.contrato, v=c.inmueble
 exigir(m.declarantes.length===1 && m.declarantes[0]===e.propietario && m.contribuyente===e.propietario &&
  e.censo.propietario===e.propietario && e.inmuebleId===v.id && e.acreditacion.inmuebleId===v.id &&
  e.acreditacion.catastro===e.catastro && /^33\d{3}$/.test(e.municipio) && e.localizacion.municipio===e.municipio &&
  e.municipio===v.municipio && v.titulo==="propiedad" && v.destino==="habitual" &&
  k.id===c.id && k.documento===v.contrato.referencia && k.firma===v.contrato.fecha &&
  k.firma==="2024-12-01" && k.desde==="2024-12-01" && fecha(k.hasta) && k.hasta>="2025-12-31" &&
  fecha(v.fechaTitulo) && v.fechaTitulo<=k.firma && v.ocupacion.inicio===k.desde && v.ocupacion.fin===k.hasta,
  "Exclusión: identidad, propiedad, Asturias o contrato contradictorios")
 exigir(r(c.rentaMensual).cmp(r(e.precio.rentaMensual))===0 && r(c.rentaMensual).cmp(r("0"))>0,
  "Precio acordado contradictorio o nulo")
 const meses=e.precio.mensualidades
 exigir(new Set(meses.map(x=>x.id)).size===12 && meses.every((x,i)=>
  fecha(x.fecha) && x.fecha==="2025-"+String(i+1).padStart(2,"0")+"-01" && r(x.importe).cmp(r(c.rentaMensual))===0),
  "Calendario o renta pactada no conciliados")
 exigir(c.gastos.length===1 && e.pagos.length===1 && c.gastos.every(g=>
  g.concepto==="conservacion_reparacion" && g.pagador===e.propietario && fecha(g.fecha) &&
  g.fecha>="2025-01-01" && g.fecha<="2025-12-31" && e.pagos.some(p=>
   p.gastoId===g.id && p.pagador===g.pagador && p.soportePago===g.documento && p.medio===g.medio)),
  "Reparación propia o censo de pagos contradictorios")
 const docs=[e.documento.referencia,e.acreditacion.documento.referencia,e.localizacion.documento.referencia,e.censo.documento.referencia,k.documento,...e.pagos.map(p=>p.soportePago)]
 exigir(new Set(docs).size===docs.length,"Documento reutilizado en acreditaciones")
}
