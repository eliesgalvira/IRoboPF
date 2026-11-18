// Replay documental, sin capturas ni esperados nuevos. Ejecutar con Bun.
import fs from "node:fs"
import { createHash } from "node:crypto"
import Decimal from "decimal.js"
import { Schema } from "effect"
import { analizarMadrid } from "../lib/dominio/irpf/analisis-madrid/analizar.ts"

const D = Decimal.clone({ precision: 80 })
const esTexto = Schema.is(Schema.String)
const esObjeto = Schema.is(Schema.Record(Schema.String, Schema.Unknown))
const load = file => ({ file, sha256: createHash("sha256").update(fs.readFileSync(file)).digest("hex"), data: JSON.parse(fs.readFileSync(file, "utf8")) })
const a = load("tests/fixtures/open-2018-etapas.json"), b = load("tests/fixtures/open-2019-etapas.json")
const c = load("tests/fixtures/open-2020-2022-control.json"), d = load("tests/fixtures/causa2023-2024.json")
const e = load("docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json")
const f = load("tests/fixtures/open-2020-2022-referencias.json")
const selections = [ [a,0], [b,0], [c,0], ...[2021,2022].map(y => [f,f.data.cases.findIndex(x => x.year === y)]),
  ...[2023,2024].map(y => [d,d.data.cases.findIndex(x => x.year === y)]), [e,0] ]
const hashes = obj => {
  if (!esObjeto(obj)) return []
  return Object.entries(obj).flatMap(([k,v]) => k === "sha256" && esTexto(v) ? [v] : hashes(v))
}
export function replayMadrid(cas) {
  const originalJSON = ref => {
    if (!cas || !/^[a-f0-9]{64}$/.test(ref.sha256)) throw new Error("CAS de originales requerido por SHA256")
    let bytes
    try { bytes = fs.readFileSync(`${cas}/${ref.sha256}`) }
    catch { throw new Error(`CAS original no legible: SHA256 ${ref.sha256}`) }
    if (bytes.length !== ref.bytes || createHash("sha256").update(bytes).digest("hex") !== ref.sha256) throw new Error("Original CAS no coincide con SHA256/tamaño")
    return JSON.parse(bytes.toString("utf8"))
  }
  return selections.map(([fixture,index]) => {
    try {
    let original = (fixture.data.cases ?? fixture.data)[index]
    if (fixture === f) {
      const batch = originalJSON(original.batch), receipt = originalJSON(original.receipt)
      if (batch.caseHashes[original.index] !== original.caseHash) throw new Error("Identidad original de batch distinta")
      original = { ...original, input: batch.results[original.index].entradaEfectiva, official: receipt.validation.checks, documentos: receipt.row }
    }
    if (fixture === c) original = { ...original, documentos: originalJSON(original.source).row }
    if (fixture === d) original = { ...original, documentos: originalJSON(original.source.capture).row }
    let input = original.input ?? original.entrada
    if (fixture === d) {
      const batch = originalJSON(original.source.batch)
      if (batch.caseHashes[original.source.index] !== original.caseHash) throw new Error("Identidad de batch distinta")
      input = batch.results[original.source.index].entradaEfectiva
    }
    const base = { fixture: fixture.file, fixtureSHA256: fixture.sha256, pointer: `${fixture.data.cases ? "/cases" : ""}/${index}`,
      ejercicio: input.ejercicio, identidad: original.caseHash ?? original.id,
      originales: original.sha256 ?? { referenciasSHA256: hashes(original.documentos ?? original.refs ?? original.source ?? {pdf:original.pdf,ses:original.ses}) },
      reservas: [...new Set(["0023", "0414", ...(original.reserves ?? original.reserved ?? [])])],
      identidadDocumental: "hechos-del-fixture; negativos-explicitos-no-acreditados-por-silencio; bytes-PDF-SES-no-revalidados-en-este-replay" }
    const rendimientos = input.trabajo.rendimientos
    if (input.devengo !== `${input.ejercicio}-12-31` || input.modalidad !== "individual" || input.comunidadAutonoma !== "madrid" ||
        input.residenciaTodoElAnio !== true || input.perfil !== "solo-trabajo" ||
        input.familiaresConDerechoMinimo !== "ninguno" || input.saldosAnteriores !== "ninguno" ||
        input.deducciones !== (input.ejercicio === 2025 ? "solo-da61-si-procede" : "ninguna") ||
        [input.otrasRentas,input.discapacidad,input.reduccionesBase,input.rentasExtranjeras,input.especialidades,
          input.trabajo.reduccionesArt18,input.trabajo.movilidad,input.trabajo.discapacidadActiva].some(v => v !== "ninguna"))
      return { ...base, estado: "fuera-contrato", motivo: "Hechos negativos o devengo del original incompatibles; no se normalizan para admitirlos" }
    if (rendimientos.length !== 1 || input.retenciones.length !== 1) return { ...base, estado: "fuera-contrato", motivo: "Replay exige operación y retención únicas explícitas; no presume totales" }
    const t = rendimientos[0], ret = input.retenciones[0]
    if (t.clase !== "empleo-laboral" || t.cotizaciones.clase !== "efectivas" || ret.efectiva !== true ||
        [ret.ejercicio,input.trabajo.ejercicio,input.conciliacion.ejercicio].some(y => y !== input.ejercicio))
      return { ...base, estado: "fuera-contrato", motivo: "Empleo, SS efectiva o ejercicio original fuera del replay; no se reasignan hechos" }
    if ([t.cotizaciones.derechosPasivos,t.cotizaciones.colegiosHuerfanos,t.sindicato.importe,t.colegio.importe,t.defensa.importe].some(v => !new D(v).isZero()))
      return { ...base, estado: "fuera-contrato", motivo: "Gastos distintos de SS fuera del contrato analítico" }
    const entrada = { ejercicio: input.ejercicio, edad: input.edad, brutoNominalObservadoEUR: t.integro,
      alcance: "madrid-individual-empleo-anual-sin-otras-rentas-familia-discapacidad-especialidades",
      ssTrabajador: { naturaleza: "efectivas", importe: t.cotizaciones.seguridadSocial, ejercicio: input.ejercicio,
        procedencia: input.conciliacion.procedencia.join(";"), operacion: t.id }, ssEmpresa: { naturaleza: "no-disponible" }, retenciones: ret.importe }
    const resultado = analizarMadrid(entrada)
    if (resultado.estado !== "calculado" || resultado.Hcontractual.estado !== "disponible") return { ...base, entrada, estado: "rechazado", motivo: resultado.motivo ?? resultado.Hcontractual.motivo }
    const r = resultado.Hcontractual.resultadoLegal
    const scalars = { "0025": r.rendimientoNetoReducido, "0500": r.baseLiquidableGeneral, "0505": r.baseLiquidableGeneral,
      "0528": r.componentesCuota.gravamenEstatal, "0529": r.componentesCuota.gravamenAutonomico,
      "0530": r.componentesCuota.gravamenMinimoEstatal, "0531": r.componentesCuota.gravamenMinimoAutonomico,
      "0532": r.componentesCuota.cuotaEstatal, "0533": r.componentesCuota.cuotaAutonomica,
      "0595": r.cuotaPosterior, "0610": r.cuotaDiferencial, "0670": r.cuotaDiferencialPresentada }
    const observaciones = original.expected?.map(x => [x.box,x.value]) ?? Object.entries(original.official ?? original.casillas).flatMap(([box,value]) => {
      if (["0023","0414"].includes(box)) return []
      return esObjeto(value) ? value.status === "acreditada" && value.pdf !== null && value.ses !== null && new D(value.pdf).eq(value.ses) ? [[box,value.pdf]] : [] : value !== null ? [[box,value]] : []
    })
    const cotejo = observaciones.map(([box,observado]) => ({ box, observado, actual: scalars[box] ?? null,
      igual: scalars[box] !== undefined && new D(scalars[box]).eq(observado) }))
    return { ...base, hechos: { devengo: input.devengo, edad: input.edad, bruto: t.integro, SS: t.cotizaciones.seguridadSocial, retenciones: ret.importe,
      naturaleza: "supuesto-sintetico-original; no-nomina-real" }, entrada, estado: cotejo.length > 0 && cotejo.every(x => x.igual) ? "exacto-en-casillas-acreditadas-del-fixture" : "discrepancia", cotejo,
      Hcontractual: resultado.Hcontractual, Hdecimal: resultado.Hdecimal, representacion: resultado.efectos.Erepresentacion,
      identidadAnalitica: resultado.efectos.identidad, comparacionIConOpen: "no-aplicable" }
    } catch (error) {
      return { fixture: fixture.file, fixtureSHA256: fixture.sha256, index, estado: "original-no-disponible",
        motivo: error instanceof Error && /^(CAS|Original CAS|Identidad)/.test(error.message) ? error.message : "No se pudo interpretar el original fijado por SHA256; no se sustituye por otra entrada" }
    }
  })
}
if (import.meta.main) {
  const resultados = replayMadrid(process.argv[2])
  process.stdout.write(JSON.stringify(resultados,null,2)+"\n")
  if (resultados.some(r => r.estado !== "exacto-en-casillas-acreditadas-del-fixture")) process.exitCode = 1
}
