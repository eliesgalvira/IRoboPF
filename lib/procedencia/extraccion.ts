import Decimal from "decimal.js"
import { Result } from "effect"

import {
  HUECO_IMPORTE,
  type BloqueDeclarado,
  type CeldaCuadro,
  type EspecificacionCuadro,
  type EspecificacionEscala,
  type LocalizadorTabla,
  type Partida,
} from "./especificacion"
import {
  CabeceraAmbigua,
  CabeceraNoLocalizada,
  CeldaAmbigua,
  CeldaAusente,
  CeldaNoCoincide,
  EscalaIncoherente,
  EstructuraNoAdmitida,
  FilaIrregular,
  FilaNoDeclarada,
  LiteralFueraDeGramatica,
  TablaAmbigua,
  TablaNoLocalizada,
  type ExcepcionExtraccion,
  type Ubicacion,
} from "./excepciones"
import {
  modeloDeTabla,
  tablasDelDocumento,
  type Bloque,
  type CeldaHtml,
  type FilaHtml,
  type TablaHtml,
} from "./html"
import { leerLiteral } from "./literales"
import type { AlcanceExtraido, Origen } from "./resultado"
import type {
  Clave,
  ClaveEscala,
  ColumnaEscala,
  Territorio,
  Unidad,
  Valor,
} from "./vocabulario"

export interface ValorPendienteDeTestigo {
  readonly ubicacion: Ubicacion
  readonly literal: string
  readonly unidad: Unidad
  readonly valor: Valor
  readonly claves: ReadonlyArray<Clave>
  readonly alcance: AlcanceExtraido
  readonly origen: Origen
  // null cuando el valor procede de una remisión y no de un literal propio.
  readonly literalTestigo: string | null
}

export interface ExtraccionHtml {
  readonly tablaLocalizada: {
    readonly linea: number
    readonly columnaFuente: number
    readonly caption: string | null
  }
  readonly valores: ReadonlyArray<ValorPendienteDeTestigo>
  readonly notas: ReadonlyArray<{
    readonly ubicacion: Ubicacion
    readonly literal: string
  }>
  readonly excepciones: ReadonlyArray<ExcepcionExtraccion>
}

export type FalloDeTabla =
  | TablaNoLocalizada
  | TablaAmbigua
  | CabeceraNoLocalizada
  | CabeceraAmbigua
  | EstructuraNoAdmitida

const describirLocalizador = (localizador: LocalizadorTabla): string =>
  localizador._tag === "Caption"
    ? `caption «${localizador.literal}»`
    : "única tabla del documento"

const localizarTabla = (
  tabla: string,
  localizador: LocalizadorTabla,
  html: string
): Result.Result<TablaHtml, FalloDeTabla> => {
  const todas = tablasDelDocumento(html)
  const candidatas =
    localizador._tag === "Caption"
      ? todas.filter((candidata) => candidata.caption === localizador.literal)
      : todas
  const [unica, ...resto] = candidatas
  if (unica === undefined) {
    return Result.fail(
      new TablaNoLocalizada({
        tabla,
        localizador: describirLocalizador(localizador),
        encontradas: 0,
      })
    )
  }
  if (resto.length > 0) {
    return Result.fail(
      new TablaAmbigua({
        tabla,
        localizador: describirLocalizador(localizador),
        encontradas: candidatas.length,
      })
    )
  }
  return Result.mapError(
    modeloDeTabla(unica),
    (problema) => new EstructuraNoAdmitida({ tabla, ...problema })
  )
}

interface TablaConCabecera {
  readonly tablaLocalizada: ExtraccionHtml["tablaLocalizada"]
  readonly posicionDe: ReadonlyMap<string, number>
  readonly datos: ReadonlyArray<FilaHtml>
  readonly excepciones: ReadonlyArray<ExcepcionExtraccion>
}

// La fila de cabecera es la única cuyas celdas son, exactamente, las
// cabeceras declaradas; las filas de datos son las de <tbody> que la siguen.
// Una fila anterior, o posterior fuera de <tbody> (un <tfoot>), no es de datos
// ni está declarada: si contara, desplazaría o añadiría tramos.
const localizar = (
  tabla: string,
  localizador: LocalizadorTabla,
  html: string,
  declaradas: ReadonlyArray<string>
): Result.Result<TablaConCabecera, FalloDeTabla> =>
  Result.flatMap(localizarTabla(tabla, localizador, html), (modelo) =>
    localizarCabecera(tabla, modelo, declaradas)
  )

const localizarCabecera = (
  tabla: string,
  modelo: TablaHtml,
  declaradas: ReadonlyArray<string>
): Result.Result<TablaConCabecera, FalloDeTabla> => {
  const esperadas = new Set(declaradas)
  const candidatas = modelo.filas.filter(
    (fila) =>
      fila.celdas.length === esperadas.size &&
      new Set(fila.celdas.map((celda) => celda.texto)).size ===
        esperadas.size &&
      fila.celdas.every((celda) => esperadas.has(celda.texto))
  )
  const [unica, ...resto] = candidatas
  if (unica === undefined) {
    return Result.fail(
      new CabeceraNoLocalizada({
        tabla,
        cabecerasDeclaradas: declaradas,
        filasDeLaTabla: modelo.filas.map((fila) =>
          fila.celdas.map((celda) => celda.texto)
        ),
      })
    )
  }
  if (resto.length > 0) {
    return Result.fail(
      new CabeceraAmbigua({
        tabla,
        lineas: candidatas.map((fila) => fila.linea),
      })
    )
  }
  const indice = modelo.filas.indexOf(unica)
  const posteriores = modelo.filas.slice(indice + 1)
  return Result.succeed({
    tablaLocalizada: {
      linea: modelo.linea,
      columnaFuente: modelo.columnaFuente,
      caption: modelo.caption,
    },
    posicionDe: new Map(
      unica.celdas.map((celda, indice) => [celda.texto, indice])
    ),
    datos: posteriores.filter((fila) => fila.seccion === "tbody"),
    excepciones: [
      ...modelo.filas.slice(0, indice),
      ...posteriores.filter((fila) => fila.seccion !== "tbody"),
    ].map(
      (fila) =>
        new FilaNoDeclarada({
          tabla,
          literal: fila.celdas.map((celda) => celda.texto).join(" | "),
          linea: fila.linea,
        })
    ),
  })
}

const ubicacionDe = (
  fila: string,
  columna: string,
  lugar: { readonly linea: number; readonly columnaFuente: number }
): Ubicacion => ({
  fila,
  columna,
  linea: lugar.linea,
  columnaFuente: lugar.columnaFuente,
})

export const extraerEscala = (
  especificacion: EspecificacionEscala,
  html: string
): Result.Result<ExtraccionHtml, FalloDeTabla> => {
  const { tabla, magnitud, territorios } = especificacion
  const declaradas = especificacion.columnas.map((columna) => columna.cabecera)
  return Result.map(
    localizar(tabla, especificacion.documento.localizador, html, declaradas),
    ({ tablaLocalizada, posicionDe, datos, excepciones: previas }) => {
      const valores: Array<ValorPendienteDeTestigo> = []
      const excepciones: Array<ExcepcionExtraccion> = [...previas]
      const clavesDe = (
        fila: number,
        columna: ColumnaEscala
      ): ReadonlyArray<ClaveEscala> =>
        territorios.map((territorio) => ({
          territorio,
          magnitud,
          fila,
          columna,
        }))
      datos.forEach((fila, indice) => {
        if (fila.celdas.length !== declaradas.length) {
          excepciones.push(
            new FilaIrregular({
              tabla,
              fila: String(indice),
              linea: fila.linea,
              celdas: fila.celdas.length,
              esperadas: declaradas.length,
              claves: especificacion.columnas.flatMap((columna) =>
                clavesDe(indice, columna.columna)
              ),
            })
          )
          return
        }
        for (const columna of especificacion.columnas) {
          const celda = fila.celdas[
            posicionDe.get(columna.cabecera) ?? -1
          ] as CeldaHtml
          const ubicacion = ubicacionDe(String(indice), columna.cabecera, celda)
          const claves = clavesDe(indice, columna.columna)
          const [bloque, ...otros] = celda.bloques
          if (bloque === undefined) {
            excepciones.push(
              new CeldaAusente({
                tabla,
                fila: ubicacion.fila,
                columna: ubicacion.columna,
                buscado: "un literal en la celda",
                claves,
              })
            )
            continue
          }
          if (otros.length > 0) {
            excepciones.push(
              new CeldaAmbigua({
                tabla,
                fila: ubicacion.fila,
                columna: ubicacion.columna,
                buscado: "un único literal en la celda",
                coincidencias: celda.bloques.map((b) =>
                  ubicacionDe(ubicacion.fila, ubicacion.columna, b)
                ),
                claves,
              })
            )
            continue
          }
          const leido = leerLiteral(bloque.texto, columna.gramatica)
          if (Result.isFailure(leido)) {
            excepciones.push(
              new LiteralFueraDeGramatica({
                tabla,
                ubicacion,
                literal: bloque.texto,
                motivo: leido.failure,
                claves,
              })
            )
            continue
          }
          valores.push({
            ubicacion,
            literal: bloque.texto,
            unidad: columna.unidad._tag,
            valor: leido.success.valor,
            claves,
            alcance: { _tag: "CabeceraDeColumna", literal: columna.cabecera },
            origen: { _tag: "Directo" },
            literalTestigo: leido.success.literalTestigo,
          })
        }
      })
      excepciones.push(...incoherencias(tabla, datos.length, valores, clavesDe))
      return { tablaLocalizada, valores, notas: [], excepciones }
    }
  )
}

// Una escala es coherente consigo misma, con aritmética exacta: la primera
// base es 0, cada base es mayor que la anterior e igual a la anterior más su
// resto, y el último tramo, y sólo él, es abierto. La cuota no se comprueba
// contra los tipos: que la publicada no sea la integrada es lo que cuenta el
// cotejo. Lo que no se pudo leer ya es una excepción y no entra en la cuenta.
const incoherencias = (
  tabla: string,
  tramos: number,
  valores: ReadonlyArray<ValorPendienteDeTestigo>,
  clavesDe: (fila: number, columna: ColumnaEscala) => ReadonlyArray<ClaveEscala>
): ReadonlyArray<EscalaIncoherente> => {
  const valorDe = (fila: number, columna: ColumnaEscala) =>
    valores.find(
      (valor) =>
        valor.claves[0]?.fila === fila && valor.claves[0].columna === columna
    )?.valor
  const decimal = (valor: Valor | undefined) =>
    valor?._tag === "Numero" ? new Decimal(valor.decimal) : undefined
  const fallos: Array<EscalaIncoherente> = []
  const fallo = (
    tramo: number,
    motivo: string,
    celdas: ReadonlyArray<readonly [number, ColumnaEscala]>
  ) =>
    fallos.push(
      new EscalaIncoherente({
        tabla,
        tramo,
        motivo,
        claves: celdas.flatMap(([fila, columna]) => clavesDe(fila, columna)),
      })
    )
  if (tramos === 0) {
    fallo(0, "la escala no tiene tramos", [])
  }
  for (let tramo = 0; tramo < tramos; tramo++) {
    const base = valorDe(tramo, "base-liquidable")
    const resto = valorDe(tramo, "resto-base-liquidable")
    const ultimo = tramo === tramos - 1
    if (base?._tag === "Centinela") {
      fallo(tramo, "la base no es un número", [[tramo, "base-liquidable"]])
    }
    if (resto?._tag === "Centinela" && !ultimo) {
      fallo(tramo, "el tramo es abierto y no es el último", [
        [tramo, "resto-base-liquidable"],
      ])
    }
    if (resto?._tag === "Numero" && ultimo) {
      fallo(tramo, "el último tramo no es abierto", [
        [tramo, "resto-base-liquidable"],
      ])
    }
    const actual = decimal(base)
    if (tramo === 0) {
      if (actual !== undefined && !actual.isZero()) {
        fallo(tramo, `la primera base es ${actual.toFixed()}, no 0`, [
          [tramo, "base-liquidable"],
        ])
      }
      continue
    }
    const anterior = decimal(valorDe(tramo - 1, "base-liquidable"))
    const restoAnterior = decimal(valorDe(tramo - 1, "resto-base-liquidable"))
    if (actual === undefined || anterior === undefined) {
      continue
    }
    if (!actual.gt(anterior)) {
      fallo(
        tramo,
        `la base ${actual.toFixed()} no es mayor que la anterior, ${anterior.toFixed()}`,
        [
          [tramo - 1, "base-liquidable"],
          [tramo, "base-liquidable"],
        ]
      )
    }
    if (
      restoAnterior !== undefined &&
      !actual.eq(anterior.plus(restoAnterior))
    ) {
      fallo(
        tramo,
        `la base ${actual.toFixed()} no es la anterior más su resto, ${anterior.toFixed()} + ${restoAnterior.toFixed()}`,
        [
          [tramo - 1, "base-liquidable"],
          [tramo - 1, "resto-base-liquidable"],
          [tramo, "base-liquidable"],
        ]
      )
    }
  }
  return fallos
}

// Texto del hueco si el bloque empieza por lo anterior a él y acaba por lo
// posterior; undefined si la plantilla no encaja.
const hueco = (partida: Partida, texto: string): string | undefined => {
  const [prefijo = "", sufijo = ""] = partida.plantilla.split(HUECO_IMPORTE)
  return texto.length > prefijo.length + sufijo.length &&
    texto.startsWith(prefijo) &&
    texto.endsWith(sufijo)
    ? texto.slice(prefijo.length, texto.length - sufijo.length)
    : undefined
}

const encaja = (declarado: BloqueDeclarado, bloque: Bloque): boolean =>
  declarado._tag === "Partida"
    ? hueco(declarado, bloque.texto) !== undefined
    : bloque.texto === declarado.literal

const textoDeclarado = (declarado: BloqueDeclarado): string =>
  declarado._tag === "Partida" ? declarado.plantilla : declarado.literal

interface RemisionPendiente {
  readonly territorio: Territorio
  readonly filaDestino: string
  readonly filaOrigen: string
  readonly columna: string
  readonly literal: string
  readonly ubicacion: Ubicacion
}

interface SalidaCuadro {
  readonly valores: Array<ValorPendienteDeTestigo>
  readonly notas: Array<{ ubicacion: Ubicacion; literal: string }>
  readonly excepciones: Array<ExcepcionExtraccion>
  readonly remisiones: Array<RemisionPendiente>
}

interface CeldaLocalizada {
  readonly tabla: string
  readonly territorio: Territorio
  readonly fila: string
  readonly columna: string
  readonly clavesDe: (partida: Partida) => ReadonlyArray<Clave>
}

// La celda del HTML ha de ser, bloque a bloque y en orden, la secuencia
// declarada: cada bloque se compara con la declaración de su misma posición.
// Si no, la celda entera es CeldaNoCoincide y no da ningún valor.
const leerCelda = (
  { tabla, territorio, fila, columna, clavesDe }: CeldaLocalizada,
  celda: CeldaHtml,
  declarada: CeldaCuadro,
  salida: SalidaCuadro
): void => {
  const coincide =
    celda.bloques.length === declarada.bloques.length &&
    declarada.bloques.every((declarado, indice) => {
      const bloque = celda.bloques[indice]
      return bloque !== undefined && encaja(declarado, bloque)
    })
  if (!coincide) {
    salida.excepciones.push(
      new CeldaNoCoincide({
        tabla,
        fila,
        columna,
        linea: celda.linea,
        columnaFuente: celda.columnaFuente,
        declarados: declarada.bloques.map(textoDeclarado),
        encontrados: celda.bloques.map((bloque) => bloque.texto),
        claves: declarada.bloques.flatMap((declarado) =>
          declarado._tag === "Partida" ? clavesDe(declarado) : []
        ),
      })
    )
    return
  }
  const notas = new Map<string, { literal: string; ubicacion: Ubicacion }>()
  declarada.bloques.forEach((declarado, indice) => {
    const bloque = celda.bloques[indice] as Bloque
    const ubicacion = ubicacionDe(fila, columna, bloque)
    if (declarado._tag === "Nota") {
      salida.notas.push({ ubicacion, literal: bloque.texto })
      if (declarado.id !== undefined) {
        notas.set(declarado.id, { literal: bloque.texto, ubicacion })
      }
      return
    }
    if (declarado._tag === "Remision") {
      salida.remisiones.push({
        territorio,
        filaDestino: fila,
        filaOrigen: declarado.fila,
        columna,
        literal: bloque.texto,
        ubicacion,
      })
      return
    }
    const claves = clavesDe(declarado)
    const literalHueco = hueco(declarado, bloque.texto) ?? ""
    const leido = leerLiteral(literalHueco, declarado.gramatica)
    if (Result.isFailure(leido)) {
      salida.excepciones.push(
        new LiteralFueraDeGramatica({
          tabla,
          ubicacion,
          literal: literalHueco,
          motivo: leido.failure,
          claves,
        })
      )
      return
    }
    // La nota del alcance es anterior en la celda (lo exige el esquema) y la
    // secuencia ya coincide, así que está en el HTML antes del importe.
    const nota =
      declarado.alcance._tag === "NotaAnterior"
        ? notas.get(declarado.alcance.nota)
        : undefined
    salida.valores.push({
      ubicacion,
      literal: bloque.texto,
      unidad: declarado.unidad._tag,
      valor: leido.success.valor,
      claves,
      alcance:
        nota === undefined
          ? { _tag: "CabeceraDeColumna", literal: columna }
          : { _tag: "NotaAnterior", ...nota },
      origen: { _tag: "Directo" },
      literalTestigo: leido.success.literalTestigo,
    })
  })
}

// Una remisión copia los valores directos de la celda remitida con el
// territorio de la fila que remite.
const resolverRemisiones = (tabla: string, salida: SalidaCuadro): void => {
  for (const remision of salida.remisiones) {
    const origenes = salida.valores.filter(
      (valor) =>
        valor.origen._tag === "Directo" &&
        valor.ubicacion.fila === remision.filaOrigen &&
        valor.ubicacion.columna === remision.columna
    )
    if (origenes.length === 0) {
      salida.excepciones.push(
        new CeldaAusente({
          tabla,
          fila: remision.filaDestino,
          columna: remision.columna,
          buscado: `valores de la celda remitida «${remision.filaOrigen}»`,
          claves: [],
        })
      )
      continue
    }
    for (const origen of origenes) {
      salida.valores.push({
        ...origen,
        claves: origen.claves.map((clave) => ({
          ...clave,
          territorio: remision.territorio,
        })),
        origen: {
          _tag: "Remision",
          literal: remision.literal,
          ubicacionRemision: remision.ubicacion,
        },
        literalTestigo: null,
      })
    }
  }
}

export const extraerCuadro = (
  especificacion: EspecificacionCuadro,
  html: string
): Result.Result<ExtraccionHtml, FalloDeTabla> => {
  const { tabla, magnitud } = especificacion
  const declaradas = [
    especificacion.cabeceraDeFilas,
    ...especificacion.columnas,
  ]
  const clavesDe =
    (territorio: Territorio) =>
    (partida: Partida): ReadonlyArray<Clave> =>
      partida.claves.map((posicion) => ({ territorio, magnitud, ...posicion }))
  const clavesDeFila = (literal: string, territorio: Territorio) =>
    especificacion.celdas
      .filter((celda) => celda.fila === literal)
      .flatMap((celda) =>
        celda.bloques.flatMap((bloque) =>
          bloque._tag === "Partida" ? clavesDe(territorio)(bloque) : []
        )
      )
  return Result.map(
    localizar(tabla, especificacion.documento.localizador, html, declaradas),
    ({ tablaLocalizada, posicionDe, datos, excepciones: previas }) => {
      const salida: SalidaCuadro = {
        valores: [],
        notas: [],
        excepciones: [...previas],
        remisiones: [],
      }
      const columnaDeFilas =
        posicionDe.get(especificacion.cabeceraDeFilas) ?? -1

      const filasPorLiteral = new Map<string, Array<FilaHtml>>()
      for (const fila of datos) {
        if (fila.celdas.length !== declaradas.length) {
          salida.excepciones.push(
            new FilaIrregular({
              tabla,
              fila: fila.celdas[columnaDeFilas]?.texto ?? "",
              linea: fila.linea,
              celdas: fila.celdas.length,
              esperadas: declaradas.length,
              claves: [],
            })
          )
          continue
        }
        const literal = (fila.celdas[columnaDeFilas] as CeldaHtml).texto
        if (!especificacion.filas.some((f) => f.cabecera === literal)) {
          salida.excepciones.push(
            new FilaNoDeclarada({ tabla, literal, linea: fila.linea })
          )
          continue
        }
        filasPorLiteral.set(literal, [
          ...(filasPorLiteral.get(literal) ?? []),
          fila,
        ])
      }

      for (const {
        cabecera: literalFila,
        territorio,
      } of especificacion.filas) {
        const encontradas = filasPorLiteral.get(literalFila) ?? []
        const [fila, ...otras] = encontradas
        if (fila === undefined || otras.length > 0) {
          const comun = {
            tabla,
            fila: literalFila,
            columna: especificacion.cabeceraDeFilas,
            buscado: `fila «${literalFila}»`,
            claves: clavesDeFila(literalFila, territorio),
          }
          salida.excepciones.push(
            fila === undefined
              ? new CeldaAusente(comun)
              : new CeldaAmbigua({
                  ...comun,
                  coincidencias: encontradas.map((f) =>
                    ubicacionDe(literalFila, especificacion.cabeceraDeFilas, f)
                  ),
                })
          )
          continue
        }
        for (const columna of especificacion.columnas) {
          leerCelda(
            {
              tabla,
              territorio,
              fila: literalFila,
              columna,
              clavesDe: clavesDe(territorio),
            },
            fila.celdas[posicionDe.get(columna) ?? -1] as CeldaHtml,
            // El esquema exige declarar todas las celdas.
            especificacion.celdas.find(
              (c) => c.fila === literalFila && c.columna === columna
            ) as CeldaCuadro,
            salida
          )
        }
      }

      resolverRemisiones(tabla, salida)
      const { valores, notas, excepciones } = salida
      return { tablaLocalizada, valores, notas, excepciones }
    }
  )
}
