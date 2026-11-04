import type { Marco, Pago, Descendiente, Resultado } from "./comun"
import {
  D,
  evaluar,
  exigir,
  fecha,
  texto,
  unico,
  dinero,
  positivo,
  edad,
  pagos,
  reparto,
  mismosTitulares,
  descendiente,
  limiteRenta,
  renta,
  parcial,
} from "./comun"

export type Traslado = Marco & {
  traslado: {
    fecha: string
    persona: string
    islaOrigen: string
    islaDestino: string
    actividad: "trabajo" | "economica"
    contratoOAlta: string
    modalidadOrigen: "individual" | "conjunta"
    baseGeneralOrigen: string
    baseAhorroOrigen: string
    permanenciaHasta: string
  }
  cuotaTrabajoActividad: {
    ejercicio: 2025
    persona: string
    importe: string
    liquidacion: string
  }
}
const islas = [
  "Tenerife",
  "La Palma",
  "La Gomera",
  "El Hierro",
  "Gran Canaria",
  "Fuerteventura",
  "Lanzarote",
  "La Graciosa",
]
export function evaluarTraslado(h: Traslado): Resultado {
  return evaluar(h, "canarias", () => {
    const t = h.traslado
    fecha(t.fecha)
    fecha(t.permanenciaHasta)
    texto(t.contratoOAlta)
    exigir(
      t.persona === h.contribuyente && t.fecha <= h.devengo,
      "Traslado sin identidad o fecha concordantes"
    )
    exigir(
      islas.includes(t.islaOrigen) &&
        islas.includes(t.islaDestino) &&
        t.islaOrigen !== t.islaDestino,
      "Traslado entre islas canarias distintas requerido"
    )
    exigir(
      t.actividad === "trabajo" || t.actividad === "economica",
      "Traslado sin actividad identificada"
    )
    const origen = Number(t.fecha.slice(0, 4))
    exigir(
      origen === 2024 || origen === 2025,
      "Solo anualidades originadas en 2024/2025"
    )
    exigir(
      t.modalidadOrigen === "individual" || t.modalidadOrigen === "conjunta",
      "Modalidad de origen ausente"
    )
    const limite =
      origen === 2024
        ? t.modalidadOrigen === "individual"
          ? 45500
          : 60500
        : t.modalidadOrigen === "individual"
          ? 46455
          : 61770
    exigir(
      dinero(t.baseGeneralOrigen).plus(dinero(t.baseAhorroOrigen)).lte(limite),
      "Renta del ejercicio de origen supera umbral inclusivo"
    )
    exigir(
      t.permanenciaHasta >= h.devengo,
      "Permanencia interrumpida: requiere regularización"
    )
    const c = h.cuotaTrabajoActividad
    exigir(
      c.ejercicio === 2025 && c.persona === h.contribuyente,
      "Cuota de trabajo/actividad sin identificación concordante"
    )
    texto(c.liquidacion)
    return parcial(
      D.min(300, positivo(c.importe)),
      [
        "CAMP-01: art.8.4; DF décima.Tres, efectos 1/1/2024",
        `Origen ${origen}; modalidad ${t.modalidadOrigen}; umbral ${limite}`,
        `Cuota identificada ${c.liquidacion}`,
      ],
      [
        `Permanencia hasta ${origen + 3}-12-31 y regularización por incumplimiento futuro`,
      ]
    )
  })
}

export type GastoMedico = Pago & {
  paciente: string
  concepto:
    | "tratamiento"
    | "dental"
    | "embarazo"
    | "accidente"
    | "identidad_sexual"
    | "aparato"
    | "estetica"
    | "prima_seguro"
  profesional: "medico" | "sanitario" | "farmaceutico"
  colegiacion: string
}
export type Enfermedad = Marco & {
  nacimiento: string
  discapacidad: number
  pacientesMinimo: readonly { persona: string; expediente: string }[]
  gastos: readonly GastoMedico[]
}
export function evaluarEnfermedad(h: Enfermedad): Resultado {
  return evaluar(h, "canarias", () => {
    const anos = edad(h.nacimiento, h.devengo)
    exigir(
      Number.isFinite(h.discapacidad) &&
        h.discapacidad >= 0 &&
        h.discapacidad <= 100,
      "Grado inválido"
    )
    unico(h.pacientesMinimo.map((p) => p.persona))
    h.pacientesMinimo.forEach((p) => texto(p.expediente))
    h.gastos.forEach((p) => {
      exigir(
        p.paciente === h.contribuyente ||
          h.pacientesMinimo.some((m) => m.persona === p.paciente),
        "Paciente sin mínimo identificado"
      )
      exigir(
        [
          "tratamiento",
          "dental",
          "embarazo",
          "accidente",
          "identidad_sexual",
          "aparato",
        ].includes(p.concepto),
        "Concepto sanitario excluido o no soportado"
      )
      exigir(
        p.profesional === "medico" || p.profesional === "sanitario",
        "Profesional excluido"
      )
      texto(p.colegiacion)
    })
    const base = pagos(h, h.gastos, true)
    const maximo = renta(h).gt(46455)
      ? 150
      : 500 + (anos > 65 || h.discapacidad >= 65 ? 100 : 0)
    return parcial(
      D.min(base.times("0.12"), maximo),
      [
        "Art.16 ter: base sanitaria neta " + base.toFixed(),
        "Límite individual " + maximo,
      ],
      [
        "Mínimos de familiares y habilitación sanitaria particulares pendientes de acreditación",
      ]
    )
  })
}

export type Escolar = Descendiente & {
  etapa: "infantil" | "basica" | "secundaria_posobligatoria"
  gastos: readonly (Pago & {
    concepto: "libro" | "material" | "transporte" | "uniforme" | "comedor"
  })[]
}
export type Estudios = Marco & { hijos: readonly Escolar[] }
export function evaluarEstudiosNoSuperiores(h: Estudios): Resultado {
  return evaluar(h, "canarias", () => {
    limiteRenta(h, 46455)
    unico(h.hijos.map((u) => u.id))
    // La base es el conjunto de gastos, con un límite por número de descendientes.
    let base = new D(0)
    const titulares = h.hijos[0]?.titulares ?? []
    h.hijos.forEach((u) => {
      descendiente(h, u)
      exigir(
        ["infantil", "basica", "secundaria_posobligatoria"].includes(u.etapa),
        "Etapa no soportada"
      )
      exigir(
        mismosTitulares(u.titulares, titulares),
        "Titulares heterogéneos: requiere composición por unidad"
      )
      u.gastos.forEach((p) =>
        exigir(
          ["libro", "material", "transporte", "uniforme", "comedor"].includes(
            p.concepto
          ),
          "Gasto escolar excluido"
        )
      )
      base = base.plus(pagos(h, u.gastos))
    })
    unico(h.hijos.flatMap((u) => u.gastos.map((p) => p.id)))
    exigir(h.hijos.length > 0, "Faltan descendientes escolarizados")
    const tope = new D(133).plus(new D(h.hijos.length - 1).times(66))
    return parcial(
      D.min(base, tope).times(reparto(h, titulares)),
      [
        "Art.7 bis: gasto agregado " + base.toFixed(),
        "Límite por descendientes " + tope.toFixed(),
      ],
      [
        "Grado de parentesco preferente y mínimos identificados sujetos a acreditación",
      ]
    )
  })
}

export type Guarderia = Marco & {
  hijos: readonly (Descendiente & {
    centro: string
    autorizacion: string
    gastos: readonly Pago[]
  })[]
}
export function evaluarGuarderia(h: Guarderia): Resultado {
  return evaluar(h, "canarias", () => {
    limiteRenta(h, 46455)
    unico(h.hijos.map((u) => u.id))
    unico(h.hijos.flatMap((u) => u.gastos.map((p) => p.id)))
    const total = h.hijos.reduce((s, u) => {
      descendiente(h, u)
      texto(u.centro)
      texto(u.autorizacion)
      exigir(
        edad(u.nacimiento, "2025-12-31") < 3,
        "Cumple tres en 2025: rama mensual pendiente"
      )
      u.gastos.forEach((p) =>
        exigir(p.perceptor === u.centro, "Perceptor distinto de guardería")
      )
      return s.plus(
        D.min(pagos(h, u.gastos).times("0.18"), 530).times(
          reparto(h, u.titulares)
        )
      )
    }, new D(0))
    return parcial(
      total,
      ["Art.12: 18%, máximo 530 por menor; reparto por titulares"],
      [
        "Autorización de apertura y funcionamiento declarada, sin certificación automática",
      ]
    )
  })
}
