import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

import {
  ARCHIVO_LEGACY_EXCEL,
  HOJAS_LEGACY_COMPLETAS,
  crearAcumuladorHashTabular,
  tablaEsperadaPorHoja,
  valorACentimos,
  type FixtureLegacyDerivado,
  type PatchToleranciaCentimo,
  type ValorCeldaCompatible,
} from "../tests/helpers/legacy-tabular-hashes"

const SALIDA_FIXTURE = "tests/fixtures/legacy-tabular-hashes.json"
const rutaLegacyExcel = resolve(process.cwd(), ARCHIVO_LEGACY_EXCEL)

const decodificarXml = (valor: string) =>
  valor
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&")

const valoresFilaXml = (
  filaXml: string
): ReadonlyArray<ValorCeldaCompatible> => {
  const valores = new Array<ValorCeldaCompatible>()
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

const derivarHoja = async (nombreHoja: string, rutaHoja: string) => {
  const iterator = filasXmlLegacy(rutaHoja)[Symbol.asyncIterator]()
  const primeraFila = await iterator.next()
  if (primeraFila.done === true) {
    throw new Error(`La hoja ${nombreHoja} no tiene cabeceras`)
  }

  const cabeceras = valoresFilaXml(primeraFila.value)
  const acumulador = crearAcumuladorHashTabular(cabeceras)
  const filasEsperadas =
    tablaEsperadaPorHoja(nombreHoja).filas[Symbol.iterator]()
  const tolerancePatches = new Array<PatchToleranciaCentimo>()
  let numeroFilaDatos = 0

  while (true) {
    const siguiente = await iterator.next()
    if (siguiente.done === true) {
      break
    }
    numeroFilaDatos += 1
    const filaLegacy = valoresFilaXml(siguiente.value)
    const filaEsperada = filasEsperadas.next()
    if (filaEsperada.done === true) {
      throw new Error(`La hoja ${nombreHoja} tiene filas legacy sobrantes`)
    }

    filaLegacy.forEach((valorLegacy, indice) => {
      const valorEsperado = filaEsperada.value[indice]
      if (
        typeof valorLegacy !== "number" ||
        typeof valorEsperado !== "number"
      ) {
        return
      }

      const legacyCents = valorACentimos(valorLegacy)
      const esperadoCents = valorACentimos(valorEsperado)
      const diferencia = Math.abs(legacyCents - esperadoCents)
      if (diferencia > 1) {
        throw new Error(
          `Diferencia superior a tolerancia en ${nombreHoja} fila ${numeroFilaDatos}, columna ${indice + 1}: legacy=${valorLegacy}, effect=${valorEsperado}`
        )
      }
      if (diferencia === 1) {
        tolerancePatches.push({
          row: numeroFilaDatos,
          column: indice + 1,
          legacyCents,
        })
      }
    })

    acumulador.anadirFilaDatos(filaLegacy)
  }

  if (filasEsperadas.next().done !== true) {
    throw new Error(`La hoja ${nombreHoja} tiene menos filas legacy`)
  }

  return {
    ...acumulador.finalizar(),
    name: nombreHoja,
    ...(tolerancePatches.length > 0 ? { tolerancePatches } : {}),
  }
}

const main = async () => {
  if (!existsSync(rutaLegacyExcel)) {
    throw new Error(`Falta ${ARCHIVO_LEGACY_EXCEL}`)
  }

  const sheets = []
  for (const [indice, nombreHoja] of HOJAS_LEGACY_COMPLETAS.entries()) {
    const rutaHoja = `xl/worksheets/sheet${indice + 1}.xml`
    sheets.push(await derivarHoja(nombreHoja, rutaHoja))
  }

  const fixture: FixtureLegacyDerivado = {
    schemaVersion: 1,
    source: ARCHIVO_LEGACY_EXCEL,
    canonicalization: "tipo+valor-tabular-normalizado-a-2-decimales-v1",
    sheets,
  }

  await mkdir(resolve(process.cwd(), "tests/fixtures"), { recursive: true })
  await writeFile(
    resolve(process.cwd(), SALIDA_FIXTURE),
    `${JSON.stringify(fixture, null, 2)}\n`
  )
}

await main()
