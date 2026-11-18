// Aritmética y procedencia acotadas: no certifica hechos negativos ni identidad completa.
import { readFileSync } from "node:fs"
import { createHash } from "node:crypto"
import { inflateSync } from "node:zlib"
import { spawnSync } from "node:child_process"
import Decimal from "decimal.js"
import { Predicate } from "effect"

const D = Decimal.clone({ precision: 100, rounding: Decimal.ROUND_HALF_UP })
export const sha256 = bytes => createHash("sha256").update(bytes).digest("hex")
const exigir = (ok, mensaje) => { if (!ok) throw Error(`Evidencia: ${mensaje}`) }
const ui = valor => {
  exigir(Predicate.isString(valor) && /^\d{1,3}(?:\.\d{3})*,\d{2}$|^\d+,\d{2}$/.test(valor), "readback importe inválido")
  return new D(valor.replaceAll(".", "").replace(",", "."))
}
const base = new URL("../docs/analisis-madrid/evidencia-filas/", import.meta.url)
// Ancla revisable en código: alterar el manifiesto exige revisión explícita del contrato.
const manifiestoSHA = "f1060002e86f20b60263492db0172119d54521c50ae48de91294f546a3016196"
export function leerCAS(hash, extension, cargar = ruta => readFileSync(new URL(ruta, base))) {
  exigir(/^[a-f0-9]{64}$/.test(hash), "SHA mal formado")
  const raw = cargar(`sha256/${hash}.${extension}`)
  const bytes = extension === "b64" ? Buffer.from(raw.toString().trim(), "base64") : raw
  exigir(sha256(bytes) === hash, "SHA bytes CAS")
  return bytes
}
export function validarReadbacks(readbacks) {
  exigir(Array.isArray(readbacks) && readbacks.length === 4 && new Set(readbacks.map(r => r.key)).size === 4, "readbacks incompletos")
  for (const key of ["IDII", "GSS", "birth", "region"]) {
    const r = readbacks.find(x => x.key === key)
    exigir(r, `readback ausente ${key}`)
    if (key === "region") {
      exigir(r.tipo === "seleccion" && r.selected === "MADRID" && Array.isArray(r.options) && r.options.includes(r.selected) && !("observed" in r), "region exige selected/options")
    } else if (key === "birth") {
      exigir(r.tipo === "texto" && r.requested === "01/01/1985" && r.observed === r.requested, "nacimiento")
    } else {
      exigir(r.tipo === "importe" && Predicate.isString(r.requested) && /^\d+(\.\d+)?$/.test(r.requested), "tipo importe")
      ui(r.observed)
    }
  }
}
export function compararPublicado(valor, pdf, ses, interno) {
  exigir(new D(valor).eq(pdf) && new D(valor).eq(ses), "valor distinto de PDF/SES")
  exigir(new D(valor).toFixed(2) === new D(interno).toFixed(2), "diferencia publicada; ninguna tolerancia de 0.01")
  return { deltaInterna: new D(valor).minus(interno).toString(), exactaInterna: new D(valor).eq(interno) }
}
const serializarSES = dato => Buffer.from(JSON.stringify(dato, null, 2) + "\n", "utf8")
// El hash comprimido es procedencia declarada; sin sus bytes no se verifica en runtime.
export function validarSESTextual(bytes) {
  const json = new TextDecoder("utf-8", { fatal: true }).decode(bytes)
  const dato = JSON.parse(json)
  const keys = ["version", "tipo", "encodingFuente", "metodo", "originalComprimidoSHA256", "infladoLatin1SHA256", "texto"]
  exigir(dato && Object.keys(dato).join() === keys.join() && serializarSES(dato).equals(Buffer.from(bytes)), "formato SES textual exacto/ambiguo")
  exigir(dato.version === 1 && dato.tipo === "DERIVADO-SES-TEXTO" && dato.encodingFuente === "ISO-8859-1" && dato.metodo === "zlib.inflate completo; ISO-8859-1 a Unicode; JSON UTF-8 sin selección de campos", "formato/encoding SES textual")
  exigir([dato.originalComprimidoSHA256, dato.infladoLatin1SHA256].every(x => Predicate.isString(x) && /^[a-f0-9]{64}$/.test(x)), "SHA SES textual")
  exigir(Predicate.isString(dato.texto) && [...dato.texto].every(c => c.codePointAt(0) <= 255), "texto fuera de Latin1")
  const latin1 = Buffer.from(dato.texto, "latin1")
  exigir(latin1.toString("latin1") === dato.texto && sha256(latin1) === dato.infladoLatin1SHA256, "roundtrip/hash Latin1")
  return dato
}
export function derivarSESTextual(sesBytes, originalSHA) {
  exigir(sha256(sesBytes) === originalSHA, "SHA SES comprimido original")
  const { buffer, engine } = inflateSync(sesBytes, { maxOutputLength: 1024 * 1024, info: true })
  exigir(engine.bytesWritten === sesBytes.length, "trailing comprimido SES")
  const texto = buffer.toString("latin1")
  exigir(Buffer.from(texto, "latin1").equals(buffer), "roundtrip Latin1 antes")
  const bytes = serializarSES({ version: 1, tipo: "DERIVADO-SES-TEXTO", encodingFuente: "ISO-8859-1", metodo: "zlib.inflate completo; ISO-8859-1 a Unicode; JSON UTF-8 sin selección de campos", originalComprimidoSHA256: originalSHA, infladoLatin1SHA256: sha256(buffer), texto })
  exigir(Buffer.from(validarSESTextual(bytes).texto, "latin1").equals(buffer), "roundtrip Latin1 después")
  return bytes
}
export function parsearOriginales(pdfBytes, sesBytes) {
  const bytes = derivarSESTextual(sesBytes, sha256(sesBytes))
  return parsearPDFSESTextual(pdfBytes, bytes)
}
export function parsearPDFSESTextual(pdfBytes, sesTextualBytes, fuente) {
  const dato = validarSESTextual(sesTextualBytes)
  if (fuente) exigir(fuente.tipo === dato.tipo && fuente.originalComprimidoSHA256 === dato.originalComprimidoSHA256 && fuente.infladoLatin1SHA256 === dato.infladoLatin1SHA256, "binding SES textual")
  const ses = dato.texto
  const fields = {}
  for (const line of ses.split("\n")) {
    const m = /^\s*(\w+)~1~([^~\r\n]*)$/.exec(line)
    if (m) (fields[m[1]] ??= []).push(m[2])
  }
  exigir(/EjModelo="2018"/.test(ses), "año SES")
  const result = spawnSync("timeout", ["-k", "30s", "20s", "pdftotext", "-layout", "-", "-"], { input: pdfBytes, maxBuffer: 2e6, timeout: 55_000 })
  exigir(!result.error && result.status === 0, "pdftotext requerido para verificar originales offline")
  const boxes = {}
  for (const line of result.stdout.toString().split("\n")) {
    const m = /(-?[\d.]+,\d{2})\s+(\d{4})\s*$/.exec(line)
    if (m) (boxes[m[2]] ??= []).push(ui(m[1]).toString())
  }
  const campo = k => { exigir(fields[k]?.length === 1, `SES ${k}`); return fields[k][0] }
  const casilla = k => { exigir(boxes[k]?.length === 1, `PDF ${k}`); return boxes[k][0] }
  for (const [key, expected] of Object.entries({ EJERCICIO: "2018", EDADD: "33", DPFNAC_D: "01/01/1985", CAC_D: "12", INDV: "true" })) exigir(campo(key) === expected, `identidad positiva SES ${key}`)
  for (const [box, key] of [["0003", "IDII"], ["0013", "GSS"], ["0595", "CAUTLIQ"], ["0610", "CDIF"], ["0500", "BLGRAL"], ["0511", "MPER"], ["0512", "MPERAU"]]) exigir(new D(casilla(box)).eq(campo(key)), `contradicción PDF/SES ${box}`)
  return { cuotaPDF: casilla("0595"), cuotaSES: campo("CAUTLIQ"), bruto: campo("IDII"), ss: campo("GSS") }
}
export function validarFila(f, r, extracto, originales) {
  exigir(r.id === `madrid-${f.entrada.ejercicio}-base${f.entrada.brutoBaseEUR2018}` && r.ejercicio === f.entrada.ejercicio && extracto.id === r.id, "año/id desplazado")
  exigir(sha256(JSON.stringify(f.entrada)) === r.entradaSHA256, "hash input CLI")
  exigir(r.bruto === f.Hdecimal.bruto && r.ss === f.Hdecimal.ssTrabajador, "importe CLI cambió")
  exigir(extracto.tipo === "extracto" && extracto.original.sha256 && r.reservas.length === 3, "extracto/reservas")
  validarReadbacks(extracto.readbacks)
  const get = key => extracto.readbacks.find(x => x.key === key)
  exigir(get("IDII").requested === r.bruto && ui(get("IDII").observed).eq(r.bruto) && get("GSS").requested === r.ss, "bruto/SS solicitado")
  const ssLeida = ui(get("GSS").observed)
  if (r.estado === "entrada-no-conservada") {
    exigir(!r.open && !ssLeida.eq(r.ss) && ssLeida.eq(new D(r.ss).toDecimalPlaces(2, Decimal.ROUND_DOWN)), "truncación SS acotada")
    return { ...r, ssLeida: ssLeida.toString(), deltaSS: ssLeida.minus(r.ss).toString() }
  }
  exigir(r.estado === "coincide-presentacion-diferencia-interna-abierta" && r.open && originales && ssLeida.eq(r.ss), "par original ausente")
  exigir(new D(originales.bruto).eq(r.bruto) && new D(originales.ss).eq(r.ss), "entrada original distinta")
  const q = compararPublicado(r.open.cuota, originales.cuotaPDF, originales.cuotaSES, f.Hdecimal.Q)
  const neto = new D(r.bruto).minus(r.ss).minus(r.open.cuota).toString()
  const n = compararPublicado(r.open.netoDerivado, neto, neto, f.Hdecimal.neto)
  exigir(q.deltaInterna === r.open.deltaCuota && n.deltaInterna === r.open.deltaNeto && !q.exactaInterna && !n.exactaInterna && r.open.certificacionInterna === false, "subcéntimo abierto")
  exigir(r.open.interno.Q === f.Hdecimal.Q && r.open.interno.neto === f.Hdecimal.neto, "interno CLI cambió")
  return { ...r, ssLeida: ssLeida.toString(), deltaSS: "0" }
}
export function evidenciaFilas(filas) {
  const bytes = readFileSync(new URL("filas.json", base))
  exigir(sha256(bytes) === manifiestoSHA, "manifiesto modificado")
  const manifest = JSON.parse(bytes)
  exigir(manifest.version === 1 && filas.length === 24 && manifest.filas.length === 24, "24 filas requeridas")
  const out = filas.map((f, i) => {
    const r = manifest.filas[i], extracto = JSON.parse(leerCAS(r.extracto, "json"))
    if (r.open) exigir(Object.keys(r.open.fuentes).join() === "captura.pdf,ses-texto.json", "fuentes PDF original/SES textual requeridas")
    const fuentes = r.open?.fuentes
    const originales = fuentes ? parsearPDFSESTextual(leerCAS(fuentes["captura.pdf"].sha256, "b64"), leerCAS(fuentes["ses-texto.json"].sha256, "json"), fuentes["ses-texto.json"]) : undefined
    return validarFila(f, r, extracto, originales)
  })
  exigir(out.filter(r => r.open).length === 2 && out.filter(r => !r.open).length === 22, "recuento 2/22")
  return out
}
