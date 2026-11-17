import { riojaId, vincularRiojaProyeccion } from "./rioja-proyeccion.mjs"
// Bun: medir-casos.mjs casos.json
// Lista JSON (o {casos: [...]}); cada caso:
// {id, entradaAPI, resultadoOpenEUR, integridadReferencias: {
//   referencias: [{archivo, sha256}]}, componentesOpenEUR?: {nombreAPI: decimal},
//   pesoExterno?: decimal}. Archivos relativos al JSON; hash de sus bytes reales.
// Referencias verificadas acreditan bytes, no autenticidad ni vínculo fiscal.
import { readFileSync } from "node:fs"
import { createHash } from "node:crypto"
import { dirname, resolve } from "node:path"
import { Effect, Schema } from "effect"
import { CasoFiscalAnualExplicito } from "../../../lib/dominio/irpf/trabajo-anual/conexion-contrato.ts"
import { CasoConjunta2025 } from "../../../lib/dominio/irpf/conjunta-2025/contrato.ts"
import { CasoTrabajoAlquilerOrdinario2025 } from "../../../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/contrato.ts"
import { liquidarIrpfAnualExplicito } from "../../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts"
import { vincularOpen } from "./vincular-open.mjs"
import { vincularDT18Open } from "./vincular-dt18-open.mjs"
import { vincularConjuntaOpen } from "./vincular-conjunta-open.mjs"

import { vincularInquilinoOpen, inquilinoId } from "./vincular-inquilino-open.mjs"

import { vincularValenciaOpen, valenciaId } from './vincular-valencia-open.mjs'

import { idsProyeccion, admitirProyeccionMedida } from "./inquilinos-proyeccion.mjs"

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex")
const objeto = Schema.is(Schema.Record(Schema.String, Schema.Unknown))
const cadena = Schema.is(Schema.String)
const CasoMedible2025 = Schema.Union([CasoFiscalAnualExplicito, CasoConjunta2025, CasoTrabajoAlquilerOrdinario2025])
const canon = (v) => JSON.stringify(v, (_, x) => objeto(x)
  ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x)
// El nombre del expediente no convierte los mismos hechos en otro perfil.
// Se preservan identidades personales, vínculos y cualquier contradicción de unidad.
const identidadEconomica = (entrada) => {
  if (entrada.perfil === "conjunta-trabajo-ordinario-2025") {
    const unidad = entrada.unidadId
    return canon(JSON.parse(JSON.stringify(entrada, (key, value) =>
      key === "unidadId" && value === unidad ? "unidad-sintetica-normalizada" : value)))
  }
  if (entrada.perfil === "trabajo-alquiler-ordinario-2025")
    return canon({ ...entrada, liquidacionId: "liquidacion-sintetica-normalizada" })
  return canon(entrada)
}
// Aritmética decimal exacta del medidor, nunca fórmulas fiscales ni Number monetario.
const decimal = (v) => {
  if (!cadena(v) || !/^-?\d{1,24}(?:\.\d{1,100})?$/.test(v))
    throw new Error("decimal-texto-requerido")
  const [entero, fraccion = ""] = v.split(".")
  return [BigInt(entero + fraccion), fraccion.length]
}
const potencia = (n) => 10n ** BigInt(n)
const sumar = ([a, s], [b, t]) => {
  const u = Math.max(s, t)
  return [a * potencia(u - s) + b * potencia(u - t), u]
}
const texto = ([n, s]) => {
  const signo = n < 0n ? "-" : ""
  const digitos = (n < 0n ? -n : n).toString().padStart(s + 1, "0")
  return signo + (s ? digitos.slice(0, -s) + "." + digitos.slice(-s) : digitos)
}
const centimos = (v) => {
  const [n, s] = decimal(v)
  if (s > 2 && n % potencia(s - 2) !== 0n) throw new Error("resultado-no-expresable-al-centimo")
  return s > 2 ? n / potencia(s - 2) : n * potencia(2 - s)
}
const iguales = (a, b) => {
  const [n, s] = decimal(b)
  return sumar(decimal(a), [-n, s])[0] === 0n
}
const escalares = ["reduccionArt20", "rendimientoNetoReducido", "baseImponibleGeneral",
  "baseLiquidableGeneral", "deduccionTrabajo", "cuotaPosterior", "cuotaDiferencial",
  "cuotaDiferencialPresentada"]
const vinculoVerificado = (v) => (v?.estado === "proyeccion-rioja-ses-pdf-vinculada" && v.proyeccionFiscalVerificada === true && v.transportComplete === false && v.regionalControlsAccepted === false && v.regionalAmountOpen === null) || (v?.estado === "proyeccion-inquilino-ses-pdf-vinculada" && v.proyeccionFiscalVerificada === true && v.viviendaTransportada === false && v.transportComplete === false) || v?.estado === "transporte-valencia-ses-pdf-vinculado" || v?.estado === "transporte-inquilino-ses-pdf-vinculado"
  || v?.estado === "entrada-ses-y-resultado-pdf-vinculados"
  || v?.estado === "transporte-dt18-ses-pdf-vinculado"
  || v?.estado === "transporte-conjunta-ses-pdf-vinculado"

function referencias(integridad, base) {
  const refs = integridad?.referencias
  if (!Array.isArray(refs) || refs.length === 0) return { estado: "ausente" }
  let verificadas = 0
  const vistas = new Set()
  for (const ref of refs) {
    if (!objeto(ref) || !cadena(ref.archivo) || !ref.archivo.trim()
      || !/^[a-f0-9]{64}$/.test(ref.sha256 ?? "")) return { estado: "invalida" }
    const archivo = resolve(base, ref.archivo)
    if (vistas.has(archivo)) return { estado: "duplicada" }
    vistas.add(archivo)
    try {
      if (hash(readFileSync(archivo)) !== ref.sha256) return { estado: "hash-discrepante" }
      verificadas++
    } catch { return { estado: "no-legible" } }
  }
  return { estado: "bytes-verificados", verificadas }
}

function medirCaso(caso, base) {
  const salida = { id: caso.id, identidadSha256: hash(canon(caso)), estado: "rechazado" }
  try {
    salida.integridadReferencias = referencias(caso.integridadReferencias, base)
    if (salida.integridadReferencias.estado !== "bytes-verificados") {
      salida.motivo = "referencias-no-verificadas"
      return salida
    }
    const open = centimos(caso.resultadoOpenEUR)
    // Una API rechazada no borra el resultado observado ni equivale a cuota cero.
    salida.resultadoOpenEUR = texto([open, 2])
    salida.pesoExterno = caso.pesoExterno ?? null
    if (caso.pesoExterno !== undefined && decimal(caso.pesoExterno)[0] < 0n)
      throw new Error("peso-externo-negativo")
    if (caso.componentesOpenEUR !== undefined && !objeto(caso.componentesOpenEUR))
      throw new Error("componentes-no-son-objeto")
    for (const v of Object.values(caso.componentesOpenEUR ?? {})) if (v !== null) decimal(v)
    const proyeccion = (idsProyeccion.includes(caso.id) || caso.evidenciaOpen?.proyeccionInquilino)
      ? admitirProyeccionMedida(caso, base) : null
    if (proyeccion && proyeccion.estado !== "proyeccion-inquilino-ses-pdf-vinculada") {
      salida.motivo = "proyeccion-inquilino-no-verificada"
      return salida
    }
    const rioja = (caso.id === riojaId || caso.evidenciaOpen?.riojaProyeccion)
      ? vincularRiojaProyeccion(caso, base) : null
    if (rioja && rioja.estado !== "proyeccion-rioja-ses-pdf-vinculada") {
      salida.motivo = "proyeccion-rioja-no-verificada"
      return salida
    }
    let entrada
    try {
      if (caso.entradaAPI?.ejercicio !== 2025) throw new Error("ejercicio")
      entrada = Schema.decodeUnknownSync(CasoMedible2025)(caso.entradaAPI, { onExcessProperty: "error" })
    } catch {
      salida.estado = "no-admitido"
      salida.motivo = "entrada-fuera-de-contratos-medibles-2025; contrato-ampliado-o-entrada-completa-requeridos"
      return salida
    }
    let resultado
    try { resultado = Effect.runSync(liquidarIrpfAnualExplicito(entrada)) }
    catch {
      salida.motivo = "API-rechaza-liquidacion"
      return salida
    }
    if (resultado._tag === "ResultadoNoSoportado") {
      salida.estado = "no-admitido"
      salida.motivo = "API-no-soporta-caso"
      return salida
    }
    // El productor mixto conserva Decimal en su API técnica. La medición consume
    // su representación decimal exacta; no pasa por Number ni redondea componentes.
    const serializado = resultado._tag === "LiquidacionTrabajoAlquilerOrdinario2025"
      ? { ...resultado, baseImponibleGeneral: resultado.baseImponibleGeneral.toFixed(),
        cuotaDiferencial: resultado.cuotaDiferencial.toFixed() } : resultado
    const monetario = { ...Object.fromEntries(escalares.filter((k) => serializado[k] !== undefined)
      .map((k) => [k, serializado[k]])), ...Object.fromEntries(Object.entries(serializado.componentesCuota ?? {})
      .filter(([k]) => k !== "unidad")) }
    const nombres = new Set([...Object.keys(monetario), ...Object.keys(caso.componentesOpenEUR ?? {})])
    salida.componentes = Object.fromEntries([...nombres].sort().map((k) => {
      const open = caso.componentesOpenEUR?.[k] ?? null
      const motor = monetario[k]
      return [k, { openEUR: open, motorEUR: motor ?? null, estado: open === null ? "open-ausente"
        : motor === undefined ? "motor-no-proyectado" : motor === null ? "motor-ausente"
          : iguales(open, motor) ? "coincide" : "difiere" }]
    }))
    const motor = resultado.cuotaDiferencialPresentada
    if (motor === undefined || motor === null) {
      salida.estado = "resultado-ausente"
      return salida
    }
    const diferencia = centimos(motor) - open
    salida.estado = diferencia === 0n ? "igual-al-centimo" : "discrepante"
    salida.resultadoOpenEUR = texto([open, 2])
    salida.resultadoMotorEUR = texto([centimos(motor), 2])
    salida.discrepanciaEUR = texto([diferencia, 2])
    salida.pesoExterno = caso.pesoExterno ?? null
    salida.vinculacion = rioja ?? proyeccion ?? ((caso.id === valenciaId || caso.evidenciaOpen?.valencia)
      ? vincularValenciaOpen(caso, base) : (caso.id === inquilinoId || caso.evidenciaOpen?.inquilino)
      ? vincularInquilinoOpen(caso, base) : caso.evidenciaOpen?.conjunta
      ? vincularConjuntaOpen(caso, base) : caso.evidenciaOpen?.dt18
        ? vincularDT18Open(caso, base) : Object.hasOwn(caso, "preparacionVivienda")
          ? { estado: "hechos-vivienda-sin-vinculo-especifico" } : vincularOpen(caso, base))
    salida.coincidenciaVerificada = diferencia === 0n && vinculoVerificado(salida.vinculacion)
    return salida
  } catch (error) {
    // No emitir entradas, rutas ni mensajes de las dependencias.
    salida.motivo = ["decimal-texto-requerido", "resultado-no-expresable-al-centimo",
      "peso-externo-negativo", "componentes-no-son-objeto"].includes(error.message)
      ? error.message : "caso-invalido"
    return salida
  }
}

export function medirCasos(documento, { base = process.cwd(), manifiesto } = {}) {
  let casos = Array.isArray(documento) ? documento : documento?.casos
  if (!Array.isArray(casos) || casos.length === 0) throw new Error("lista-de-casos-no-vacia-requerida")
  if (manifiesto) {
    if (!Array.isArray(manifiesto.casos) || manifiesto.N !== manifiesto.casos.length
      || new Set(manifiesto.casos.map(c => c.id)).size !== manifiesto.N)
      throw new Error("manifiesto-invalido")
    const expected = new Map(manifiesto.casos.map(c => [c.id, c]))
    for (const c of casos) {
      if (!expected.has(c?.id)) throw new Error("caso-fuera-del-manifiesto")
      if (canon(c.entradaAPI) !== canon(expected.get(c.id).entradaAPI)) throw new Error("entrada-distinta-del-manifiesto")
      if (c.pesoExterno !== expected.get(c.id).pesoExterno) throw new Error("peso-distinto-del-manifiesto")
    }
    const received = new Set(casos.map(c => c.id))
    casos = [...casos, ...manifiesto.casos.filter(c => !received.has(c.id))]
  } else if (!Array.isArray(documento) && documento.N !== undefined && documento.N !== casos.length) {
    throw new Error("denominador-declarado-distinto")
  }
  const grupos = new Map()
  casos.forEach((caso, i) => {
    const idValido = objeto(caso) && cadena(caso.id) && caso.id.trim() !== ""
    const clave = idValido ? `id:${caso.id}` : `invalido:${i}`
    const grupo = grupos.get(clave) ?? []
    grupo.push(caso)
    grupos.set(clave, grupo)
  })
  const entradasVistas = new Map()
  const resultados = [...grupos.values()].map((grupo) => {
    const caso = grupo[0]
    if (!objeto(caso) || !cadena(caso.id) || !caso.id.trim())
      return { id: null, estado: "rechazado", motivo: "identidad-ausente" }
    if (grupo.some((otro) => canon(otro) !== canon(caso)))
      return { id: caso.id, estado: "rechazado", motivo: "identidad-con-contenidos-conflictivos" }
    const resultado = medirCaso(caso, base)
    if (caso.entradaAPI) {
      const identidad = hash(identidadEconomica(caso.entradaAPI))
      if (entradasVistas.has(identidad)) {
        resultado.duplicadoEntradaDe = entradasVistas.get(identidad)
        resultado.coincidenciaVerificada = false
      } else entradasVistas.set(identidad, caso.id)
    }
    return resultado
  })
  const comparables = resultados.filter((r) => r.discrepanciaEUR !== undefined)
  const ponderados = comparables.filter((r) => r.pesoExterno !== null && !r.duplicadoEntradaDe)
  let suma = [0n, 0], absoluta = [0n, 0], pesos = [0n, 0]
  for (const r of ponderados) {
    const [p, s] = decimal(r.pesoExterno)
    const d = centimos(r.discrepanciaEUR)
    suma = sumar(suma, [d * p, s + 2])
    absoluta = sumar(absoluta, [(d < 0n ? -d : d) * p, s + 2])
    pesos = sumar(pesos, [p, s])
  }
  const N = resultados.length
  const igualesN = resultados.filter((r) => r.coincidenciaVerificada === true).length
  const igualesExploratorias = resultados.filter((r) => r.estado === "igual-al-centimo" && !r.duplicadoEntradaDe).length
  const completa = ponderados.length === N
  const prioridades = ponderados.filter(r => centimos(r.discrepanciaEUR) !== 0n && !r.duplicadoEntradaDe)
    .map(r => {
      const [p, s] = decimal(r.pesoExterno), d = centimos(r.discrepanciaEUR)
      return { id: r.id, discrepanciaEUR: r.discrepanciaEUR,
        pesoExterno: r.pesoExterno, impacto: [(d < 0n ? -d : d) * p, s + 2],
        evidenciaVinculada: vinculoVerificado(r.vinculacion) }
    }).sort((a, b) => {
      const d = sumar(a.impacto, [-b.impacto[0], b.impacto[1]])[0]
      return d > 0n ? -1 : d < 0n ? 1 : a.id.localeCompare(b.id)
    }).map(({ impacto, ...r }) => ({ ...r, impactoAbsolutoPonderadoEUR: texto(impacto) }))
  return {
    schema: "medicion-c2025-v1",
    alcance: "Resultado presentado por API explicita 2025; medicion condicionada de casos, sin certificado monetario universal",
    contratoAPI: "CasoFiscalAnualExplicito, CasoConjunta2025 y CasoTrabajoAlquilerOrdinario2025; perfiles no admitidos se conservan en N",
    inventario: "no-realizado; no se invoca engine.mjs ni se certifican fuentes o dependencias",
    integridad: "Iguales exige vinculo entrada/SES y resultado/PDF. Comparaciones sin vinculo son exploratorias",
    medicion: { iguales: igualesN, N, fraccion: `${igualesN}/${N}`, comparables: comparables.length,
      igualesExploratorias, fraccionExploratoria: `${igualesExploratorias}/${N}`,
      manifiestoCompleto: manifiesto !== undefined,
      registrosRecibidos: casos.length, duplicados: casos.length - N },
    ponderacionExterna: { estado: completa ? "completa" : "incompleta", casosConPesoYResultado: ponderados.length,
      casosSinPesoOResultado: N - ponderados.length, sumaPesosComparables: texto(pesos),
      discrepanciaPonderadaEUR: completa ? texto(suma) : null,
      discrepanciaAbsolutaPonderadaEUR: completa ? texto(absoluta) : null },
    discrepanciasPorPrioridad: prioridades,
    limitePrioridad: "Peso externo por diferencia absoluta; proxy de diseño, no estimación de afectados. Rechazos sin importe no reciben un cero ni un impacto inventado",
    resultados,
  }
}

if (import.meta.main) {
  try {
    const archivo = resolve(process.argv[2])
    const bytes = readFileSync(archivo)
    const args = process.argv.slice(3)
    if (args.length !== 0 && !(args.length === 2 && args[0] === "--manifest")) throw new Error("argumentos")
    const manifiesto = args.length ? JSON.parse(readFileSync(resolve(args[1]), "utf8")) : undefined
    const medicion = medirCasos(JSON.parse(bytes), { base: dirname(archivo), manifiesto })
    process.stdout.write(JSON.stringify({ ...medicion, entradaSha256: hash(bytes) }) + "\n")
    process.exitCode = medicion.medicion.comparables < medicion.medicion.N ? 2
      : medicion.medicion.iguales < medicion.medicion.N ? 1 : 0
  } catch {
    process.stdout.write(JSON.stringify({ estado: "incompleto", motivo: "JSON-de-casos-no-legible-o-invalido" }) + "\n")
    process.exitCode = 2
  }
}
