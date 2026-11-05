import { anexoI } from "./territorio"
import {
  cero,
  mas,
  por,
  producto,
  compara,
  min,
  euros,
  exige,
  ids,
  fecha,
  edad,
  cubre,
  periodo,
  conciliar,
  moverMes,
  documento,
  contexto,
  propia,
  reparto,
  rentaRioja,
  magnitud,
  pagos,
  resultado,
  paso,
  proteger,
} from "./comun"
import type { Contexto, Documento, Periodo, Pago, Resultado } from "./comun"
export type ContratoAlquiler = {
  readonly id: string
  readonly fecha: string
  readonly territorio: "galicia" | "la-rioja"
  readonly municipio: string
  readonly arrendador: string
  readonly titularesContrato: readonly string[]
  readonly titularesDerecho: readonly string[]
  readonly uso: "habitual" | "otro"
  readonly ocupacion: Periodo
  readonly fianzaIGVS: Documento | null
  readonly denunciaFianza: Documento | null
  readonly modeloITP: Documento | null
  readonly regimen: "privativo" | "gananciales"
  readonly conyuges: readonly string[]
  readonly pagos: readonly Pago[]
}
export type Alquiler = {
  readonly codigo:
    | "galicia_alquiler_vivienda_habitual"
    | "rioja_arrendamiento_menores_36"
  readonly contratos: readonly ContratoAlquiler[]
  readonly hijosMenores: readonly {
    readonly id: string
    readonly nacimiento: string
  }[]
  readonly derechoInversionVivienda: "sin_derecho" | "con_derecho"
}
export function alquiler(c: Contexto, h: Alquiler): Resultado {
  return proteger(() => {
    const gal = h.codigo === "galicia_alquiler_vivienda_habitual"
    contexto(c, gal ? "galicia" : "la-rioja")
    exige(
      ids(h.contratos.map((x) => x.id)) && ids(h.hijosMenores.map((x) => x.id)),
      "Contrato/hijos repetidos"
    )
    const pp = propia(c)
    const acceso = gal
      ? compara(magnitud(c, "baseImponibleTotal"), euros("22000")) <= 0
      : rentaRioja(c) && h.derechoInversionVivienda === "sin_derecho"
    const menores = h.hijosMenores.filter((x) => {
      exige(
        x.id !== c.titular &&
          x.nacimiento > pp.nacimiento &&
          fecha(x.nacimiento),
        "Identidad filial imposible"
      )
      return edad(x.nacimiento) < 18
    }).length
    let total = cero
    const tr = []
    exige(
      ids(h.contratos.flatMap((x) => x.pagos.map((p) => p.id))),
      "Pago duplicado entre contratos"
    )
    for (const x of h.contratos) {
      exige(
        fecha(x.fecha) &&
          ids(x.titularesContrato) &&
          ids(x.titularesDerecho) &&
          x.arrendador !== c.titular,
        "Contrato sin identidad/fecha"
      )
      const base = pagos(x.pagos, ["alquiler"])
      exige(
        x.pagos.every((p) => p.receptor === x.arrendador),
        "Receptor distinto de arrendador"
      )
      let titulo = x.titularesContrato.includes(c.titular)
      if (!gal && x.regimen === "gananciales") {
        exige(
          ids(x.conyuges) &&
            x.conyuges.length === 2 &&
            x.conyuges.includes(c.titular) &&
            x.conyuges.some((t) => x.titularesContrato.includes(t)),
          "Gananciales sin ambos cónyuges"
        )
        titulo = true
      }
      exige(
        x.pagos.every(
          (p) =>
            x.titularesDerecho.includes(p.pagador) &&
            (x.titularesContrato.includes(p.pagador) ||
              (!gal &&
                x.regimen === "gananciales" &&
                x.conyuges.includes(p.pagador)))
        ),
        "Pago de alquiler sin atribución al ámbito económico de los titulares; expediente específico pendiente"
      )
      periodo(x.ocupacion)
      if (x.uso === "habitual")
        exige(
          x.pagos.every(
            (p) =>
              p.concepto !== "alquiler" ||
              p.fecha < "2025-01-01" ||
              p.fecha > "2025-12-31" ||
              cubre(x.ocupacion, p.fecha, p.fecha)
          ),
          "Pago fuera del periodo habitual: falta identificar el periodo arrendado al que corresponde"
        )
      const fianza = x.fianzaIGVS ?? x.denunciaFianza
      if (fianza !== null) documento(fianza)
      if (x.modeloITP !== null) documento(x.modeloITP)
      let edadApta = edad(pp.nacimiento) <= 35
      if (c.modalidad === "conjunta" && x.conyuges.length === 2) {
        exige(
          ids(x.conyuges) &&
            x.conyuges.includes(c.titular) &&
            x.conyuges.every((t) => c.declarantes.includes(t)),
          "Cónyuges conjuntos no identificados"
        )
        edadApta = x.conyuges.some((t) => {
          const p = c.personas.find((p) => p.id === t)
          exige(p !== undefined, "Cónyuge sin fecha de nacimiento")
          return edad(p.nacimiento) <= 35
        })
      }
      const apto =
        acceso &&
        edadApta &&
        titulo &&
        x.territorio === (gal ? "galicia" : "la-rioja") &&
        x.uso === "habitual" &&
        x.ocupacion.desde <= "2025-12-31" &&
        x.ocupacion.hasta >= "2025-01-01" &&
        (gal ? x.fecha > "2003-01-01" && fianza !== null : x.modeloITP !== null)
      const rural = anexoI(x.municipio)
      let porcentaje = gal ? (menores >= 2 ? 20 : 10) : rural ? 20 : 10
      let limite = gal ? (menores >= 2 ? 600 : 300) : rural ? 400 : 300
      if (gal && pp.discapacidad >= 33) {
        porcentaje *= 2
        limite *= 2
      }
      const baseAtribuible = producto(base, reparto(x.titularesDerecho, c))
      const limiteAtribuible = producto(
        euros(String(limite)),
        reparto(x.titularesDerecho, c)
      )
      const v = apto
        ? min(por(baseAtribuible, porcentaje, 100), limiteAtribuible)
        : cero
      total = mas(total, v)
      tr.push(
        paso(
          x.id,
          "Límite por contrato y gasto común repartidos; edad,renta,título y documentos",
          base,
          v
        )
      )
    }
    return resultado(c, total, tr, [
      "El resultado es atribución del titular incluso en declaración conjunta; no sumar parciales con renta/modalidad distinta",
    ])
  })
}
export type Suministros = {
  readonly codigo:
    | "rioja_internet_jovenes_emancipados"
    | "rioja_luz_gas_jovenes_emancipados"
  readonly vivienda: string
  readonly municipio: string
  readonly tenencia: "propiedad" | "arrendamiento"
  readonly residencia: Periodo
  readonly excepcionResidencia: Documento | null
  readonly adquisicionOContrato: string
  readonly monoparental: "si" | "no"
  readonly titularesDerecho: readonly string[]
  readonly ocupantes: readonly {
    readonly id: string
    readonly actividadEnVivienda: "si" | "no"
  }[]
  readonly usosPrevios: readonly {
    readonly vivienda: string
    readonly titular: string
    readonly codigo: string
    readonly ejercicio: number
  }[]
  readonly contratos: readonly {
    readonly id: string
    readonly titulares: readonly string[]
    readonly alta: string
    readonly baja: string | null
    readonly servicio: "internet" | "luz" | "gas"
    readonly pagos: readonly Pago[]
  }[]
}
export function suministros(c: Contexto, h: Suministros): Resultado {
  return proteger(() => {
    contexto(c, "la-rioja")
    exige(
      ids([h.vivienda]) &&
        fecha(h.adquisicionOContrato) &&
        ids(h.ocupantes.map((x) => x.id)) &&
        h.ocupantes.some((x) => x.id === c.titular) &&
        ["propiedad", "arrendamiento"].includes(h.tenencia) &&
        ["si", "no"].includes(h.monoparental),
      "Vivienda/ocupantes desconocidos"
    )
    if (h.excepcionResidencia !== null) documento(h.excepcionResidencia)
    const historial = h.usosPrevios.some(
      (x) =>
        x.vivienda === h.vivienda &&
        x.titular === c.titular &&
        x.codigo === h.codigo
    )
    const habitual =
      cubre(h.residencia, "2025-12-31", "2025-12-31") &&
      (h.residencia.desde <= moverMes("2025-12-31", -36) ||
        h.excepcionResidencia !== null ||
        h.residencia.hasta >= moverMes(h.residencia.desde, 36))
    exige(
      ids(h.contratos.map((x) => x.id)) &&
        ids(h.contratos.flatMap((x) => x.pagos.map((p) => p.id))),
      "Contratos/pagos repetidos"
    )
    let base = cero
    const tr = []
    for (const x of h.contratos) {
      exige(
        fecha(x.alta) &&
          (x.baja === null || (fecha(x.baja) && x.baja >= x.alta)) &&
          ids(x.titulares) &&
          x.titulares.length > 0,
        "Contrato inválido"
      )
      const valor = pagos(x.pagos, ["suministro"])
      conciliar(
        x.pagos,
        x.titulares.filter(
          (id) =>
            h.titularesDerecho.includes(id) &&
            h.ocupantes.some((p) => p.id === id)
        )
      )
      const fechaApta =
        x.alta >= "2025-01-01" &&
        x.alta <= moverMes("2025-12-31", -6) &&
        (x.baja === null || x.baja >= "2025-12-31") &&
        x.titulares.includes(c.titular) &&
        x.pagos.every((p) => p.fecha >= x.alta)
      const servicio =
        h.codigo === "rioja_internet_jovenes_emancipados"
          ? x.servicio === "internet"
          : ["luz", "gas"].includes(x.servicio)
      const incluido = fechaApta && servicio ? valor : cero
      base = mas(base, incluido)
      tr.push(
        paso(
          x.id,
          "Alta2025,seis meses antes de devengo,vigencia y titularidad; pago facturado",
          valor,
          incluido
        )
      )
    }
    const apto =
      edad(propia(c).nacimiento) < 36 &&
      rentaRioja(c) &&
      habitual &&
      !historial &&
      h.ocupantes.every((x) => x.actividadEnVivienda === "no")
    const porcentaje =
      h.codigo === "rioja_internet_jovenes_emancipados"
        ? h.monoparental === "si" || anexoI(h.municipio)
          ? 40
          : 30
        : h.monoparental === "si"
          ? 25
          : anexoI(h.municipio)
            ? 20
            : 15
    const v = apto
      ? producto(por(base, porcentaje, 100), reparto(h.titularesDerecho, c))
      : cero
    return resultado(
      c,
      v,
      [
        ...tr,
        paso(
          h.vivienda,
          "Porcentaje y reparto entre convivientes con derecho;una vez por vivienda/titular",
          base,
          v
        ),
      ],
      [
        "Comprobar permanencia de vivienda histórica y ausencia de actividad de todos los titulares; la lista de pagos incluye todos los pagadores",
      ]
    )
  })
}
