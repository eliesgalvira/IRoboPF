import Decimal from "decimal.js"

import {
  AusenteEnManual,
  ClaveDuplicada,
  SinHomologoEnMotor,
  UnidadDistinta,
  ValorDistinto,
  type ExcepcionCotejo,
} from "./excepciones"
import type {
  ColaExcepciones,
  Contadores,
  EntradaCotejo,
  EstadoCotejo,
  ExtraccionTabla,
  Resumen,
  ValorMotor,
} from "./resultado"
import {
  compararClaves,
  textoClave,
  type Clave,
  type Valor,
} from "./vocabulario"
import { EXCLUIDOS_DEL_MOTOR } from "./motor-2025"

const mismoValor = (a: Valor, b: Valor): boolean =>
  a._tag === "Numero" && b._tag === "Numero"
    ? new Decimal(a.decimal).eq(b.decimal)
    : a._tag === "Centinela" &&
      b._tag === "Centinela" &&
      a.centinela === b.centinela

const ambito = (territorio: string, magnitud: string) =>
  `${territorio}|${magnitud}`

const FALLOS_DE_TABLA = new Set([
  "TablaNoLocalizada",
  "TablaAmbigua",
  "CabeceraNoLocalizada",
  "CabeceraAmbigua",
  "EstructuraNoAdmitida",
  "PaginaInexistente",
])

export interface Cotejo {
  readonly entradas: ReadonlyArray<EntradaCotejo>
  readonly excepciones: ColaExcepciones
  readonly resumen: Resumen
}

export const cotejar = (
  extracciones: ReadonlyArray<ExtraccionTabla>,
  motor: ReadonlyArray<ValorMotor>
): Cotejo => {
  const tablasPorAmbito = new Map<string, Array<string>>()
  const fallosDeTabla = new Map<string, Array<string>>()
  const manualPorClave = new Map<string, Array<EntradaCotejo["manual"][number]>>()
  const excepcionesPorClave = new Map<string, Set<string>>()
  const claves = new Map<string, Clave>()
  const anotar = <T>(mapa: Map<string, Array<T>>, clave: string, valor: T) =>
    mapa.set(clave, [...(mapa.get(clave) ?? []), valor])

  for (const extraccion of extracciones) {
    for (const territorio of extraccion.territorios) {
      anotar(
        tablasPorAmbito,
        ambito(territorio, extraccion.magnitud),
        extraccion.tabla
      )
    }
    for (const excepcion of extraccion.excepciones) {
      if (FALLOS_DE_TABLA.has(excepcion._tag)) {
        anotar(fallosDeTabla, extraccion.tabla, excepcion._tag)
      }
      if ("claves" in excepcion) {
        for (const clave of excepcion.claves) {
          claves.set(textoClave(clave), clave)
          excepcionesPorClave.set(
            textoClave(clave),
            new Set([
              ...(excepcionesPorClave.get(textoClave(clave)) ?? []),
              excepcion._tag,
            ])
          )
        }
      }
    }
    for (const valor of extraccion.valores) {
      for (const clave of valor.claves) {
        claves.set(textoClave(clave), clave)
        anotar(manualPorClave, textoClave(clave), {
          tabla: extraccion.tabla,
          unidad: valor.unidad,
          valor: valor.valor,
          ubicacion: valor.ubicacion,
          origen: valor.origen._tag,
          testigo: valor.testigo._tag,
        })
      }
    }
  }
  const motorPorClave = new Map(
    motor.map((valor) => [textoClave(valor.clave), valor])
  )
  for (const valor of motor) {
    claves.set(textoClave(valor.clave), valor.clave)
  }

  const entradas: Array<EntradaCotejo> = []
  const excepciones: Array<ExcepcionCotejo> = []
  for (const clave of Array.from(claves.values()).sort(compararClaves)) {
    const texto = textoClave(clave)
    const manual = manualPorClave.get(texto) ?? []
    const valorMotor = motorPorClave.get(texto) ?? null
    const tablas = Array.from(
      new Set([
        ...(tablasPorAmbito.get(ambito(clave.territorio, clave.magnitud)) ??
          []),
        ...manual.map((m) => m.tabla),
      ])
    ).sort()
    const deExtraccion = new Set([
      ...(excepcionesPorClave.get(texto) ?? []),
      ...tablas.flatMap((tabla) => fallosDeTabla.get(tabla) ?? []),
    ])
    let estado: EstadoCotejo
    const [unico] = manual
    if (tablas.length === 0) {
      estado = "fuera-de-alcance"
    } else if (manual.length > 1) {
      estado = "ambigua"
      excepciones.push(
        new ClaveDuplicada({ clave, tablas: manual.map((m) => m.tabla) })
      )
    } else if (unico !== undefined) {
      if (valorMotor === null) {
        estado = "sin-homologo-en-motor"
        excepciones.push(new SinHomologoEnMotor({ clave, tabla: unico.tabla }))
      } else if (valorMotor.unidad !== unico.unidad) {
        estado = "unidad-distinta"
        excepciones.push(
          new UnidadDistinta({
            clave,
            tabla: unico.tabla,
            manual: unico.unidad,
            motor: valorMotor.unidad,
          })
        )
      } else if (mismoValor(unico.valor, valorMotor.valor)) {
        estado = "coincidente"
      } else {
        estado = "distinta"
        excepciones.push(
          new ValorDistinto({
            clave,
            tabla: unico.tabla,
            manual: unico.valor,
            motor: valorMotor.valor,
            origenMotor: valorMotor.origen,
          })
        )
      }
    } else if (deExtraccion.has("CeldaAmbigua")) {
      estado = "ambigua"
    } else if (deExtraccion.has("CeldaAusente")) {
      estado = "ausente-en-manual"
    } else if (deExtraccion.size > 0) {
      estado = "excepcion-de-extraccion"
    } else {
      estado = "ausente-en-manual"
      excepciones.push(new AusenteEnManual({ clave, tablas }))
    }
    entradas.push({
      clave,
      estado,
      tablas,
      manual,
      motor:
        valorMotor === null
          ? null
          : {
              unidad: valorMotor.unidad,
              valor: valorMotor.valor,
              origen: valorMotor.origen,
              regla: valorMotor.regla,
            },
      excepcionesDeExtraccion: Array.from(deExtraccion).sort(),
    })
  }

  const contar = (
    tablas: ReadonlySet<string>
  ): Contadores => {
    const propias = extracciones.filter((e) => tablas.has(e.tabla))
    const valores = propias.flatMap((e) => e.valores)
    const deTablas = entradas.filter((entrada) =>
      entrada.tablas.some((tabla) => tablas.has(tabla))
    )
    const cuantas = (estados: ReadonlyArray<EstadoCotejo>, derivadas = false) =>
      deTablas.filter(
        (entrada) =>
          estados.includes(entrada.estado) &&
          (!derivadas || entrada.motor?.origen === "derivado")
      ).length
    return {
      valoresExtraidos: valores.length,
      conTestigo: valores.filter((v) => v.testigo._tag === "ConTestigo").length,
      sinTestigo: valores.filter((v) => v.testigo._tag === "SinTestigo").length,
      testigoPorRemision: valores.filter((v) => v.testigo._tag === "PorRemision")
        .length,
      excepcionesDeExtraccion: propias.flatMap((e) => e.excepciones).length,
      claves: deTablas.length,
      coincidentes: cuantas(["coincidente"]),
      coincidentesDerivadas: cuantas(["coincidente"], true),
      distintas: cuantas(["distinta"]),
      distintasDerivadas: cuantas(["distinta"], true),
      unidadDistinta: cuantas(["unidad-distinta"]),
      ambiguas: cuantas(["ambigua"]),
      ausentesEnManual: cuantas(["ausente-en-manual"]),
      sinHomologoEnMotor: cuantas(["sin-homologo-en-motor"]),
      conExcepcionDeExtraccion: cuantas(["excepcion-de-extraccion"]),
    }
  }
  const agrupar = (documento: (e: ExtraccionTabla) => string) =>
    Array.from(new Set(extracciones.map(documento)))
      .sort()
      .map((sha256) => {
        const tablas = extracciones
          .filter((e) => documento(e) === sha256)
          .map((e) => e.tabla)
        return { sha256, tablas, contadores: contar(new Set(tablas)) }
      })

  const fueraDeAlcance = new Map<string, { clave: Clave; claves: number }>()
  for (const entrada of entradas) {
    if (entrada.estado === "fuera-de-alcance") {
      const grupo = ambito(entrada.clave.territorio, entrada.clave.magnitud)
      fueraDeAlcance.set(grupo, {
        clave: entrada.clave,
        claves: (fueraDeAlcance.get(grupo)?.claves ?? 0) + 1,
      })
    }
  }

  return {
    entradas,
    excepciones: {
      extraccion: extracciones.flatMap((e) =>
        e.excepciones.map((excepcion) => ({ tabla: e.tabla, excepcion }))
      ),
      cotejo: excepciones,
    },
    resumen: {
      porTabla: extracciones.map((e) => ({
        tabla: e.tabla,
        contadores: contar(new Set([e.tabla])),
      })),
      porDocumentoHtml: agrupar((e) => e.documento.sha256),
      porDocumentoPdf: agrupar((e) => e.testigoPdf.sha256),
      fueraDeAlcance: Array.from(fueraDeAlcance.values()).map(
        ({ clave, claves }) => ({
          territorio: clave.territorio,
          magnitud: clave.magnitud,
          claves,
        })
      ),
      excluidosDelMotor: EXCLUIDOS_DEL_MOTOR,
    },
  }
}
