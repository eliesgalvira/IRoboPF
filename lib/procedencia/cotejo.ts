import { Result } from "effect"

import { componer } from "./composicion"
import type { Composicion } from "./especificacion"

import {
  AusenteEnManual,
  ClaveDuplicada,
  ClaveRepetidaEnMotor,
  SinHomologoEnMotor,
  type ComposicionNoResuelta,
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
  ValorDelManual,
  ValorMotor,
} from "./resultado"
import {
  compararClaves,
  mismoValor,
  textoClave,
  type Clave,
} from "./vocabulario"
import { EXCLUIDOS_DEL_MOTOR } from "./motor-2025"

const ambito = (territorio: string, magnitud: string) =>
  `${territorio}|${magnitud}`

const tablasDe = (valor: ValorDelManual): ReadonlyArray<string> =>
  valor._tag === "Leido" ? [valor.tabla] : valor.fuentes.map((f) => f.tabla)

export interface Cotejo {
  readonly entradas: ReadonlyArray<EntradaCotejo>
  readonly excepciones: ColaExcepciones
  readonly resumen: Resumen
}

// Una clave identifica un solo valor del motor: si la proyección repite una,
// el cotejo no elige cuál vale.
// Las composiciones declaradas añaden valores derivados del manual para las
// claves de su escala resultado.
export const cotejar = (
  extracciones: ReadonlyArray<ExtraccionTabla>,
  motor: ReadonlyArray<ValorMotor>,
  composiciones: ReadonlyArray<Composicion> = []
): Result.Result<Cotejo, ClaveRepetidaEnMotor> => {
  const motorPorClave = new Map<string, ValorMotor>()
  for (const valor of motor) {
    if (motorPorClave.has(textoClave(valor.clave))) {
      return Result.fail(new ClaveRepetidaEnMotor({ clave: valor.clave }))
    }
    motorPorClave.set(textoClave(valor.clave), valor)
  }
  const tablasPorAmbito = new Map<string, Array<string>>()
  const fallosDeTabla = new Map<string, Array<string>>()
  const manualPorClave = new Map<string, Array<ValorDelManual>>()
  const excepcionesPorClave = new Map<string, Array<string>>()
  const claves = new Map<string, Clave>()
  const anotar = <T>(mapa: Map<string, Array<T>>, clave: string, valor: T) =>
    mapa.set(clave, [...(mapa.get(clave) ?? []), valor])
  const anotarExcepcion = (excepcion: {
    readonly _tag: string
    readonly claves: ReadonlyArray<Clave>
  }) => {
    for (const clave of excepcion.claves) {
      claves.set(textoClave(clave), clave)
      anotar(excepcionesPorClave, textoClave(clave), excepcion._tag)
    }
  }

  for (const extraccion of extracciones) {
    for (const territorio of extraccion.territorios) {
      anotar(
        tablasPorAmbito,
        ambito(territorio, extraccion.magnitud),
        extraccion.tabla
      )
    }
    for (const excepcion of extraccion.excepciones) {
      // Una tabla sin localizar no da ningún valor: su fallo alcanza a todas
      // las claves de su ámbito.
      if (extraccion.documento.tablaLocalizada === null) {
        anotar(fallosDeTabla, extraccion.tabla, excepcion._tag)
      }
      if ("claves" in excepcion) {
        anotarExcepcion(excepcion)
      }
    }
    for (const valor of extraccion.valores) {
      for (const clave of valor.claves) {
        claves.set(textoClave(clave), clave)
        anotar(manualPorClave, textoClave(clave), {
          _tag: "Leido",
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
  const noResueltas: Array<ComposicionNoResuelta> = []
  for (const composicion of composiciones) {
    const { territorio, magnitud } = composicion.resultado
    for (const tabla of composicion.sumandos) {
      anotar(tablasPorAmbito, ambito(territorio, magnitud), tabla)
    }
    const { valores, excepcion } = componer(composicion, extracciones)
    for (const { clave, valor } of valores) {
      claves.set(textoClave(clave), clave)
      anotar(manualPorClave, textoClave(clave), valor)
    }
    if (excepcion !== null) {
      noResueltas.push(excepcion)
      anotarExcepcion(excepcion)
    }
  }
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
        ...manual.flatMap(tablasDe),
      ])
    ).sort()
    const deExtraccion = new Set([
      ...(excepcionesPorClave.get(texto) ?? []),
      ...tablas.flatMap((tabla) => fallosDeTabla.get(tabla) ?? []),
    ])
    // Sólo es coincidente una clave con exactamente un valor del manual y
    // ninguna excepción de extracción.
    let estado: EstadoCotejo
    const [unico] = manual
    if (tablas.length === 0) {
      estado = "fuera-de-alcance"
    } else if (manual.length > 1) {
      estado = "ambigua"
      excepciones.push(
        new ClaveDuplicada({ clave, tablas: manual.flatMap(tablasDe) })
      )
    } else if (deExtraccion.has("CeldaAmbigua")) {
      estado = "ambigua"
    } else if (deExtraccion.size > 0) {
      estado =
        unico === undefined && deExtraccion.has("CeldaAusente")
          ? "ausente-en-manual"
          : "excepcion-de-extraccion"
    } else if (unico !== undefined) {
      if (valorMotor === null) {
        estado = "sin-homologo-en-motor"
        excepciones.push(
          new SinHomologoEnMotor({
            clave,
            tabla: tablasDe(unico).join(" + "),
          })
        )
      } else if (valorMotor.unidad !== unico.unidad) {
        estado = "unidad-distinta"
        excepciones.push(
          new UnidadDistinta({
            clave,
            tabla: tablasDe(unico).join(" + "),
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
            tabla: tablasDe(unico).join(" + "),
            manual: unico.valor,
            motor: valorMotor.valor,
            origenMotor: valorMotor.origen,
          })
        )
      }
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

  const contar = (tablas: ReadonlySet<string>): Contadores => {
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
      testigoMismoLiteral: valores.filter(
        (v) => v.testigo._tag === "MismoLiteral"
      ).length,
      testigoMismoValorOtroLiteral: valores.filter(
        (v) => v.testigo._tag === "MismoValorOtroLiteral"
      ).length,
      sinTestigo: valores.filter((v) => v.testigo._tag === "SinTestigo").length,
      testigoPorRemision: valores.filter(
        (v) => v.testigo._tag === "PorRemision"
      ).length,
      sinClaveDeMotor: valores.filter((v) => v.claves.length === 0).length,
      excepcionesDeExtraccion: propias.flatMap((e) => e.excepciones).length,
      claves: deTablas.length,
      coincidentes: cuantas(["coincidente"]),
      coincidentesDerivadas: cuantas(["coincidente"], true),
      derivadasDelManual: deTablas.filter((entrada) =>
        entrada.manual.some((m) => m._tag === "DerivadoDelManual")
      ).length,
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

  return Result.succeed({
    entradas,
    excepciones: {
      extraccion: extracciones.flatMap((e) =>
        e.excepciones.map((excepcion) => ({ tabla: e.tabla, excepcion }))
      ),
      composicion: noResueltas,
      cotejo: excepciones,
    },
    resumen: {
      porTabla: extracciones.map((e) => ({
        tabla: e.tabla,
        contadores: contar(new Set([e.tabla])),
      })),
      porDocumentoHtml: agrupar((e) => e.documento.sha256),
      porDocumentoPdf: agrupar((e) => e.testigoPdf.sha256),
      sinClaveDeMotor: extracciones.flatMap((e) =>
        e.valores
          .filter((v) => v.claves.length === 0)
          .map((v) => ({
            tabla: e.tabla,
            ubicacion: v.ubicacion,
            literal: v.literal,
            unidad: v.unidad,
            valor: v.valor,
            origen: v.origen,
            testigo: v.testigo._tag,
          }))
      ),
      fueraDeAlcance: Array.from(fueraDeAlcance.values()).map(
        ({ clave, claves }) => ({
          territorio: clave.territorio,
          magnitud: clave.magnitud,
          claves,
        })
      ),
      excluidosDelMotor: EXCLUIDOS_DEL_MOTOR,
    },
  })
}
