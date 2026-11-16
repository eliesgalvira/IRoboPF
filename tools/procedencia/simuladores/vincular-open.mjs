// Vinculación de una captura salarial con su entrada y resultado: no calcula IRPF.
import { readFileSync } from "node:fs"
import { createHash } from "node:crypto"
import { inflateSync } from "node:zlib"
import { resolve, isAbsolute } from "node:path"
import { spawnSync } from "node:child_process"
import { Schema } from "effect"
import { validateCase, sesReadback } from "./capturar-casos.mjs"
import { familyPredicateReadback } from "./familia-open.mjs"

const hash = (b) => createHash("sha256").update(b).digest("hex")
const requireValue = (ok, message) => { if (!ok) throw Error(message) }
// Publicación textual reversible: todos los caracteres del SES quedan visibles
// al sanitizador. El SHA del original comprimido es procedencia, no una prueba
// de bytes disponibles en este formato. Se verifica el contenido Latin1 íntegro.
export function decodificarPersistencia(bytes, referencia) {
  if (referencia.formato === undefined)
    return inflateSync(bytes, { maxOutputLength: 4 * 1024 * 1024 }).toString("latin1")
  requireValue(referencia.formato === "ses-latin1-transcrito-utf8", "ses-formato-no-soportado")
  requireValue(bytes.length <= 8 * 1024 * 1024, "ses-transcripcion-excesiva")
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes)
  requireValue([...text].every(c => c.codePointAt(0) <= 255), "ses-transcripcion-no-latin1")
  requireValue(/^[a-f0-9]{64}$/.test(referencia.contenidoLatin1Sha256 ?? "")
    && hash(Buffer.from(text, "latin1")) === referencia.contenidoLatin1Sha256,
  "ses-transcripcion-contenido-distinto")
  return text
}
const cents = (v) => {
  requireValue(Schema.is(Schema.String)(v) && /^-?\d+(?:\.\d+)?$/.test(v), "resultado-ambiguo")
  const [a, b = ""] = v.split(".")
  requireValue(b.slice(2).replaceAll("0", "") === "", "resultado-subcentimo")
  return BigInt(a + b.padEnd(2, "0").slice(0, 2))
}

// Códigos observados en las capturas originales del corte salarial 2025.
// Una etiqueta textual no sustituye al código que determina el cálculo.
const codigosObservados = {
  andalucia: "01", asturias: "03", "illes-balears": "04", canarias: "05",
  cantabria: "06", "castilla-la-mancha": "07", "castilla-y-leon": "08",
  catalunya: "09", extremadura: "10", galicia: "11", madrid: "12",
  "comunitat-valenciana": "17",
}

export function sesDeclaracionReadback(decoded, territorio) {
  const wanted = { INDV: ["DECLARACIONES", "true"],
    TITULAR: ["DECLARACIONES/IRPF2025", "DECLARANTE"],
    CAC_D: ["DECLARACIONES/DP", codigosObservados[territorio]],
    ZCCAD: ["DECLARACIONES/IRPF2025", codigosObservados[territorio]] }
  requireValue(codigosObservados[territorio], "ses-territorio-no-acreditado")
  const stack = [], seen = new Set(), sections = new Map()
  for (const line of decoded.split("\n").slice(1)) {
    if (!line.trim()) continue
    const indent = line.length - line.trimStart().length
    while (stack.length && stack.at(-1).indent >= indent) stack.pop()
    const section = /^ *\[([A-Z0-9_]+)\]$/.exec(line)
    if (section) {
      stack.push({ indent, name: section[1] })
      const path = stack.map(s => s.name).join("/")
      sections.set(path, (sections.get(path) ?? 0) + 1)
      continue
    }
    const key = /^ *(\w+)~/.exec(line)?.[1]
    if (!Object.hasOwn(wanted, key)) continue
    const record = /^ *(\w+)~1~([^~\r\n]*)$/.exec(line)
    requireValue(record && !seen.has(key), "ses-identidad-duplicada-o-malformada")
    requireValue(stack.map(s => s.name).join("/") === wanted[key][0]
      && record[2] === wanted[key][1], "ses-modalidad-titular-territorio-distintos")
    seen.add(key)
  }
  requireValue(seen.size === Object.keys(wanted).length, "ses-identidad-incompleta")
  for (const path of ["DECLARACIONES", "DECLARACIONES/DP", "DECLARACIONES/IRPF2025"])
    requireValue(sections.get(path) === 1, "ses-declaracion-ambigua")
  return { modalidad: "individual", titular: "DECLARANTE", codigoTerritorial: codigosObservados[territorio] }
}

export function resultadoPdf0670(text) {
  const observed = [...text.matchAll(/(-?(?:\d{1,3}(?:\.\d{3})+|\d+),\d{2})\s+0670\s*$/gm)]
  requireValue(observed.length === 1, "pdf-0670-no-unico")
  return observed[0][1].replaceAll(".", "").replace(",", ".")
}

export function vincularOpen(caso, base) {
  try {
    const ev = caso.evidenciaOpen
    requireValue(ev, "sin-evidencia-vinculada")
    const refs = caso.integridadReferencias?.referencias ?? []
    const load = (r) => {
      requireValue(r && /^[a-f0-9]{64}$/.test(r.sha256 ?? "")
        && refs.filter(x => x.archivo === r.archivo && x.sha256 === r.sha256).length === 1, "evidencia-no-referenciada")
      const path = resolve(base, r.archivo), bytes = readFileSync(path)
      requireValue(hash(bytes) === r.sha256, "evidencia-hash-distinto")
      return { path, bytes }
    }
    const ses = load(ev.ses), pdf = load(ev.pdf)
    requireValue(pdf.bytes.subarray(0, 5).toString() === "%PDF-", "pdf-invalido")
    const c = validateCase({ id: caso.id, entrada: caso.entradaAPI })
    const decoded = decodificarPersistencia(ses.bytes, ev.ses)
    const declaracion = sesDeclaracionReadback(decoded, c.entry.comunidadAutonoma)
    const inputs = sesReadback(decoded, c)
    let familia
    if (c.family) {
      requireValue(ev.readbacks, "familia-readbacks-ausentes")
      familia = familyPredicateReadback(decoded, caso, JSON.parse(load(ev.readbacks).bytes.toString("utf8")))
    }
    const lines = decoded.split("\n")
    const resultados = lines.filter(l => /^   RESULTADO~[12]~/.test(l))
    requireValue(resultados.length <= 1, "ses-resultado-duplicado")
    const value = resultados.length === 1 ? /^   RESULTADO~1~(-?\d+(?:\.\d+)?)$/.exec(resultados[0])?.[1] : null
    const tool = process.env.C_PDFTOTEXT
    requireValue(tool && isAbsolute(tool), "lector-pdf-no-configurado")
    const toolSha256 = hash(readFileSync(tool))
    const r = spawnSync("timeout", ["-k", "5s", "20s", tool, "-layout", pdf.path, "-"], { encoding: "utf8", timeout: 26000, maxBuffer: 4 * 1024 * 1024 })
    requireValue(r.status === 0, "lector-pdf-fallo")
    const pdfValue = resultadoPdf0670(r.stdout)
    requireValue(cents(pdfValue) === cents(caso.resultadoOpenEUR), "resultado-aportado-distinto-pdf")
    if (value !== null && value !== undefined) requireValue(cents(value) === cents(pdfValue), "ses-pdf-resultado-distinto")
    else requireValue(cents(pdfValue) === 0n, "ses-ausente-no-cero")
    if (familia) return { estado: "no-verificado", motivo: "familia-predicados-pendientes",
      sesSha256: ev.ses.sha256, pdfSha256: ev.pdf.sha256, readbacksSha256: ev.readbacks.sha256,
      lectorPdfSha256: toolSha256, resultadoEUR: pdfValue, familia }
    return { estado: "entrada-ses-y-resultado-pdf-vinculados", sesSha256: ev.ses.sha256,
      pdfSha256: ev.pdf.sha256, lectorPdfSha256: toolSha256, resultadoEUR: pdfValue,
      declaracion,
      territorio: inputs.personal.CAD_D,
      limite: "Transporte salarial acotado; no certifica autenticidad criptografica AEAT ni otros hechos fiscales" }
  } catch (e) {
    const message = e instanceof Error ? e.message : "vinculo-fallo"
    return { estado: "no-verificado", motivo: /^[a-z0-9-]+$/.test(message) ? message : "vinculo-fallo" }
  }
}
