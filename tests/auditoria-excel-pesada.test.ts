import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { resolve } from "node:path"

import { Clock, Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  aniosFiscalesLegacy,
  construirTablaComparativaInflacionCompatible,
  construirTablaControlGeneralCompatible,
  construirTablaControlTramosIrpfCompatible,
  construirTablaDetalleAnualCompatible,
  type AnioFiscal,
  type TablaCompatible,
} from "../lib/domain/progresividad"

const ARCHIVO_LEGACY_EXCEL =
  "Auditoria_Integral_Nominas_e_Inflacion_2012_2026.xlsx"
const COMANDO_REGENERACION_LEGACY =
  "uv run --with-requirements requirements.txt python Calculo_Salario_IRPF.py"
const EJECUTAR_VALIDACION_PESADA =
  process.env.IROBOPF_VALIDACION_LEGACY_COMPLETA === "1"
const MOSTRAR_OBSERVABILIDAD =
  process.env.IROBOPF_OBSERVABILIDAD_LEGACY_COMPLETA === "1"
const CONCURRENCIA_VALIDACION_LEGACY =
  Number(process.env.IROBOPF_CONCURRENCIA_LEGACY_COMPLETA ?? 3) || 1

const rutaLegacyExcel = resolve(process.cwd(), ARCHIVO_LEGACY_EXCEL)

const HOJAS_LEGACY_COMPLETAS = [
  "CONTROL_GENERAL",
  "CONTROL_TRAMOS_IRPF",
  "COMPARATIVA_INFLACION",
  ...aniosFiscalesLegacy.map((anio) => `DAT_${anio}`),
] as const

type ValorTabular = number | string

interface MedicionHoja {
  readonly hoja: string
  readonly filasDatos: number
  readonly columnas: number
  readonly millis: number
}

interface HojaLegacyEsperada {
  readonly nombre: (typeof HOJAS_LEGACY_COMPLETAS)[number]
  readonly ruta: string
}

const HOJAS_LEGACY_ESPERADAS = HOJAS_LEGACY_COMPLETAS.map(
  (nombre, indice): HojaLegacyEsperada => ({
    nombre,
    ruta: `xl/worksheets/sheet${indice + 1}.xml`,
  })
)

const millisEntre = (inicioNanos: bigint, finNanos: bigint) =>
  Number(finNanos - inicioNanos) / 1_000_000

const segundos = (millis: number) => `${(millis / 1000).toFixed(2)}s`

const decodificarXml = (valor: string) =>
  valor
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&")

const escribirObservabilidad = (medicion: MedicionHoja) => {
  if (!MOSTRAR_OBSERVABILIDAD) {
    return
  }

  process.stderr.write(
    [
      `[observabilidad legacy] ${medicion.hoja}`,
      `filas=${medicion.filasDatos.toLocaleString("es-ES")}`,
      `columnas=${medicion.columnas}`,
      `tiempo=${segundos(medicion.millis)}`,
      `filas/s=${Math.round(
        medicion.filasDatos / Math.max(medicion.millis / 1000, 0.001)
      ).toLocaleString("es-ES")}`,
      "\n",
    ].join("\n")
  )
}

const valoresFilaXml = (filaXml: string): ReadonlyArray<ValorTabular> => {
  const valores = new Array<ValorTabular>()
  const celdas =
    /<c ([^>]*)>(?:<v>(.*?)<\/v>|<is><t[^>]*>(.*?)<\/t><\/is>)<\/c>/g

  for (const celda of filaXml.matchAll(celdas)) {
    const atributos = celda[1] ?? ""
    const tipo = /\bt="([^"]+)"/.exec(atributos)?.[1]
    const valorNumerico = celda[2]
    const valorTexto = celda[3]

    if (tipo === "inlineStr") {
      valores.push(decodificarXml(valorTexto ?? ""))
      continue
    }

    valores.push(Number(Number(valorNumerico ?? 0).toFixed(2)))
  }

  return valores
}

const normalizarEsperado = (valor: ValorTabular): ValorTabular => {
  if (typeof valor === "number") {
    return Number(valor.toFixed(2))
  }

  return valor
}

const compararCelda = (
  hoja: string,
  fila: number,
  columna: number,
  legacy: ValorTabular,
  esperado: ValorTabular
) => {
  const posicion = `${hoja} fila ${fila}, columna ${columna}`

  if (typeof legacy !== typeof esperado) {
    throw new Error(
      `Tipo distinto en ${posicion}: legacy=${typeof legacy}, esperado=${typeof esperado}, legacyValor=${legacy}, esperadoValor=${esperado}`
    )
  }

  if (typeof legacy === "number" && typeof esperado === "number") {
    const diferenciaCentimos = Math.abs(
      Math.round(legacy * 100) - Math.round(esperado * 100)
    )
    if (diferenciaCentimos > 1) {
      throw new Error(
        `Valor distinto en ${posicion}: legacy=${legacy}, esperado=${esperado}, diferenciaCentimos=${diferenciaCentimos}`
      )
    }
    return
  }

  expect(legacy, posicion).toBe(esperado)
}

const tablaEsperadaPorHoja = (nombreHoja: string): TablaCompatible => {
  if (nombreHoja === "CONTROL_GENERAL") {
    return construirTablaControlGeneralCompatible()
  }

  if (nombreHoja === "CONTROL_TRAMOS_IRPF") {
    return construirTablaControlTramosIrpfCompatible()
  }

  if (nombreHoja === "COMPARATIVA_INFLACION") {
    return construirTablaComparativaInflacionCompatible()
  }

  if (nombreHoja.startsWith("DAT_")) {
    return construirTablaDetalleAnualCompatible(
      Number(nombreHoja.slice(4)) as AnioFiscal
    )
  }

  throw new Error(`Hoja legacy no esperada: ${nombreHoja}`)
}

const compararFila = (
  hoja: string,
  numeroFila: number,
  legacy: ReadonlyArray<ValorTabular>,
  esperada: ReadonlyArray<ValorTabular>
) => {
  expect(legacy, `${hoja} fila ${numeroFila}`).toHaveLength(esperada.length)

  esperada.forEach((valorEsperado, indice) => {
    compararCelda(
      hoja,
      numeroFila,
      indice + 1,
      legacy[indice] ?? "",
      normalizarEsperado(valorEsperado)
    )
  })
}

const compararHoja = async (nombreHoja: string, rutaHoja: string) => {
  const tablaEsperada = tablaEsperadaPorHoja(nombreHoja)
  const filasEsperadas = tablaEsperada.filas[Symbol.iterator]()
  let numeroFila = 0
  let filasDatos = 0

  for await (const filaXml of filasXmlLegacy(rutaHoja)) {
    numeroFila += 1

    if (numeroFila === 1) {
      compararFila(
        nombreHoja,
        numeroFila,
        valoresFilaXml(filaXml),
        tablaEsperada.cabeceras
      )
      continue
    }

    const siguienteEsperada = filasEsperadas.next()
    if (siguienteEsperada.done === true) {
      throw new Error(
        `La hoja ${nombreHoja} tiene mas filas legacy que filas Effect esperadas`
      )
    }

    filasDatos += 1
    compararFila(
      nombreHoja,
      numeroFila,
      valoresFilaXml(filaXml),
      siguienteEsperada.value
    )
  }

  const sobrante = filasEsperadas.next()
  if (sobrante.done !== true) {
    throw new Error(
      `La hoja ${nombreHoja} tiene menos filas legacy que filas Effect esperadas`
    )
  }

  return {
    hoja: nombreHoja,
    filasDatos,
    columnas: tablaEsperada.cabeceras.length,
  }
}

async function* filasXmlLegacy(rutaHoja: string): AsyncIterable<string> {
  const proceso = spawn("unzip", ["-p", rutaLegacyExcel, rutaHoja], {
    stdio: ["ignore", "pipe", "pipe"],
  })
  let pendiente = ""
  let error = ""

  proceso.stderr.setEncoding("utf8")
  proceso.stderr.on("data", (trozo) => {
    error += trozo
  })

  proceso.stdout.setEncoding("utf8")
  for await (const trozo of proceso.stdout) {
    pendiente += trozo

    while (true) {
      const inicio = pendiente.indexOf("<row")
      if (inicio === -1) {
        pendiente = pendiente.slice(-20)
        break
      }

      const fin = pendiente.indexOf("</row>", inicio)
      if (fin === -1) {
        pendiente = pendiente.slice(inicio)
        break
      }

      const fila = pendiente.slice(inicio, fin)
      pendiente = pendiente.slice(fin + "</row>".length)
      yield fila
    }
  }

  const codigo = await new Promise<number | null>((resolve) => {
    proceso.on("close", resolve)
  })
  if (codigo !== 0) {
    throw new Error(
      `No se pudo leer ${rutaHoja} del fixture legacy XLSX: ${error}`
    )
  }
}

const validarHojaFixtureLegacyCompleto = Effect.fn(
  "tests.auditoriaExcelPesada.validarHojaFixtureLegacyCompleto"
)(function* (hoja: HojaLegacyEsperada) {
  if (!existsSync(rutaLegacyExcel)) {
    throw new Error(
      `Falta el fixture legacy Excel ${ARCHIVO_LEGACY_EXCEL}. Regeneralo con: ${COMANDO_REGENERACION_LEGACY}`
    )
  }

  const inicioHoja = yield* Clock.currentTimeNanos
  const resultado = yield* Effect.promise(() =>
    compararHoja(hoja.nombre, hoja.ruta)
  )
  const finHoja = yield* Clock.currentTimeNanos
  const medicion = {
    ...resultado,
    millis: millisEntre(inicioHoja, finHoja),
  } satisfies MedicionHoja
  escribirObservabilidad(medicion)

  if (hoja.nombre === "CONTROL_GENERAL") {
    expect(medicion.filasDatos).toBe(15)
  }
  if (hoja.nombre === "COMPARATIVA_INFLACION") {
    expect(medicion.filasDatos).toBe(1_290)
  }
  if (hoja.nombre === "DAT_2012" || hoja.nombre === "DAT_2026") {
    expect(medicion.filasDatos).toBe(100_001)
  }
})

const validarFixtureLegacyCompletoConcurrente = Effect.fn(
  "tests.auditoriaExcelPesada.validarFixtureLegacyCompletoConcurrente"
)(function* () {
  yield* Effect.forEach(
    HOJAS_LEGACY_ESPERADAS,
    validarHojaFixtureLegacyCompleto,
    {
      concurrency: CONCURRENCIA_VALIDACION_LEGACY,
      discard: true,
    }
  )
})

describe("validacion pesada de equivalencia tabular legacy", () => {
  if (EJECUTAR_VALIDACION_PESADA) {
    it.live(
      "compara el fixture Excel completo contra las tablas Effect",
      () => validarFixtureLegacyCompletoConcurrente(),
      900_000
    )
  } else {
    it.skip("compara el fixture Excel completo contra las tablas Effect", () => {})
  }
})
