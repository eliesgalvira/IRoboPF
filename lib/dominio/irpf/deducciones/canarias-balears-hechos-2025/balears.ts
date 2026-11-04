import type { Marco, Pago, Descendiente, Resultado } from "./comun"
import {
  D,
  evaluar,
  exigir,
  texto,
  unico,
  edad,
  pagos,
  reparto,
  mismosTitulares,
  descendiente,
  limiteRenta,
  parcial,
} from "./comun"

export type Idiomas = Marco & {
  hijos: readonly (Descendiente & {
    etapa: "infantil_segundo_ciclo" | "primaria" | "eso" | "bachillerato" | "fp"
    idioma: string
    actividad: "extraescolar"
    gastos: readonly Pago[]
  })[]
}
export function evaluarIdiomas(h: Idiomas): Resultado {
  return evaluar(h, "illes-balears", () => {
    limiteRenta(h, 33000)
    unico(h.hijos.map((u) => u.id))
    unico(h.hijos.flatMap((u) => u.gastos.map((p) => p.id)))
    const total = h.hijos.reduce((s, u) => {
      descendiente(h, u)
      texto(u.idioma)
      exigir(
        u.actividad === "extraescolar" &&
          [
            "infantil_segundo_ciclo",
            "primaria",
            "eso",
            "bachillerato",
            "fp",
          ].includes(u.etapa),
        "Estudio o actividad fuera de alcance"
      )
      return s.plus(
        D.min(pagos(h, u.gastos).times("0.15"), 110).times(
          reparto(h, u.titulares)
        )
      )
    }, new D(0))
    return parcial(
      total,
      ["Art.4 bis: 15%, máximo 110 por hijo; reparto individual"],
      ["Idioma extranjero, facturas y mínimos sujetos a cotejo particular"]
    )
  })
}

export type TercerSector = Marco & {
  donaciones: readonly {
    entidad: string
    registro: string
    regimen: "ley49_art2_3" | "is9_3"
    certificado: string
    pago: Pago
  }[]
}
export function evaluarTercerSector(h: TercerSector): Resultado {
  return evaluar(h, "illes-balears", () => {
    h.donaciones.forEach((u) => {
      texto(u.entidad)
      texto(u.registro)
      texto(u.certificado)
      exigir(
        u.regimen === "ley49_art2_3" || u.regimen === "is9_3",
        "Régimen de entidad no soportado"
      )
      exigir(
        u.entidad === u.pago.perceptor,
        "Beneficiario no coincide con perceptor"
      )
    })
    const base = pagos(
      h,
      h.donaciones.map((u) => u.pago)
    )
    return parcial(
      D.min(base, 165).times("0.25"),
      ["Art.5 quinquies: base máxima agregada 165; 25%"],
      [
        "Inscripción, régimen fiscal y efectividad de donación sujetos a acreditación particular",
      ]
    )
  })
}

export type Discapacidad = Marco & {
  personas: readonly {
    persona: string
    residencia: "illes-balears"
    condicion: "contribuyente" | "descendiente"
    naturaleza: "fisica_sensorial" | "psiquica"
    grado: number
    resolucion: string
    minimo: { contribuyente: string; ejercicio: 2025; expediente: string }
  }[]
}
export function evaluarDiscapacidad(h: Discapacidad): Resultado {
  return evaluar(h, "illes-balears", () => {
    limiteRenta(h, 33000)
    unico(h.personas.map((u) => u.persona))
    const total = h.personas.reduce((s, u) => {
      texto(u.resolucion)
      exigir(
        u.residencia === "illes-balears" &&
          Number.isFinite(u.grado) &&
          u.grado >= 0 &&
          u.grado <= 100,
        "Residencia o grado inválido"
      )
      exigir(
        u.condicion === "contribuyente" || u.condicion === "descendiente",
        "Miembro fuera de alcance individual"
      )
      if (u.condicion === "contribuyente")
        exigir(u.persona === h.contribuyente, "Contribuyente no coincide")
      else {
        exigir(
          u.persona !== h.contribuyente,
          "Descendiente y contribuyente deben ser personas distintas"
        )
        exigir(
          u.minimo.contribuyente === h.contribuyente &&
            u.minimo.ejercicio === 2025,
          "Mínimo no concordante"
        )
        texto(u.minimo.expediente)
      }
      exigir(
        u.naturaleza === "fisica_sensorial" || u.naturaleza === "psiquica",
        "Naturaleza desconocida"
      )
      return s.plus(
        u.grado < 33
          ? 0
          : u.naturaleza === "psiquica" || u.grado >= 65
            ? 165
            : 88
      )
    }, new D(0))
    return parcial(
      total,
      ["Art.6: 88/165; descendientes íntegros por cada titular con mínimo"],
      [
        "Resolución y mínimo sujetos a acreditación particular; sin dividir descendientes por dos",
      ]
    )
  })
}

export type Conciliacion = Marco & {
  nacimiento: string
  discapacidad: number
  resolucionDiscapacidad: string
  familia:
    | "ordinaria"
    | "numerosa_general"
    | "numerosa_especial"
    | "monoparental_7_7"
  tituloFamilia: string
  minimoDiscapacidad: readonly { persona: string; expediente: string }[]
  actividad: {
    tipo: "trabajo" | "economica"
    identificador: string
    diasRETA: number
  }
  titulares: readonly string[]
  menores: readonly (Descendiente & {
    gastos: readonly (Pago & {
      servicio:
        | "guarderia"
        | "custodia_centro"
        | "comedor_centro"
        | "extraescolar_centro"
        | "empleado_hogar"
      altaSeguridadSocial: string
    })[]
  })[]
}
export function evaluarConciliacion(h: Conciliacion): Resultado {
  return evaluar(h, "illes-balears", () => {
    const reforma = h.devengo >= "2025-07-11"
    const anos = edad(h.nacimiento, h.devengo)
    exigir(
      [
        "ordinaria",
        "numerosa_general",
        "numerosa_especial",
        "monoparental_7_7",
      ].includes(h.familia),
      "Familia no soportada"
    )
    exigir(
      Number.isFinite(h.discapacidad) &&
        h.discapacidad >= 0 &&
        h.discapacidad <= 100,
      "Grado inválido"
    )
    if (h.discapacidad >= 33) texto(h.resolucionDiscapacidad)
    if (h.familia !== "ordinaria") texto(h.tituloFamilia)
    unico(h.minimoDiscapacidad.map((u) => u.persona))
    h.minimoDiscapacidad.forEach((u) => {
      exigir(
        u.persona !== h.contribuyente && !h.titulares.includes(u.persona),
        "El mínimo por discapacidad requiere ascendiente/descendiente distinto de los titulares"
      )
      texto(u.expediente)
    })
    texto(h.actividad.identificador)
    exigir(
      h.actividad.tipo === "trabajo" || h.actividad.tipo === "economica",
      "Falta actividad generadora de rendimientos"
    )
    // El marco ya valida el devengo civil de 2025, año no bisiesto.
    const diasAntesDelMes = [
      0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334,
    ]
    const diasPeriodo =
      diasAntesDelMes[Number(h.devengo.slice(5, 7)) - 1] +
      Number(h.devengo.slice(8, 10))
    exigir(
      Number.isInteger(h.actividad.diasRETA) &&
        h.actividad.diasRETA >= 0 &&
        h.actividad.diasRETA <= diasPeriodo,
      "Días RETA incompatibles con la duración del período impositivo"
    )
    // CAMP-02: 30% amplía la renta; nunca es tipo de deducción.
    const factorRenta =
      h.familia === "ordinaria"
        ? "1"
        : h.familia === "numerosa_especial" && reforma
          ? "1.30"
          : "1.20"
    limiteRenta(h, new D(33000).times(factorRenta))
    const reforzado =
      anos < 36 ||
      h.discapacidad >= 33 ||
      h.minimoDiscapacidad.length > 0 ||
      h.familia !== "ordinaria" ||
      (reforma &&
        h.actividad.tipo === "economica" &&
        h.actividad.diasRETA >= 183)
    const tipo = reforzado ? "0.50" : "0.40"
    const tope = reforzado ? 900 : 660
    const parte = reparto(h, h.titulares)
    unico(h.menores.map((u) => u.id))
    unico(h.menores.flatMap((u) => u.gastos.map((p) => p.id)))
    exigir(h.menores.length > 0, "Faltan menores identificados")
    const base = h.menores.reduce((s, u) => {
      descendiente(h, u)
      exigir(
        mismosTitulares(h.titulares, u.titulares),
        "Titulares heterogéneos: composición pendiente"
      )
      exigir(
        edad(u.nacimiento, "2025-12-31") < 6,
        "Cumple seis, nacimiento, adopción o acogida en 2025: requiere rama de prorrateo diario"
      )
      u.gastos.forEach((p) => {
        const anosServicio = edad(u.nacimiento, p.fecha)
        exigir(
          [
            "guarderia",
            "custodia_centro",
            "comedor_centro",
            "extraescolar_centro",
            "empleado_hogar",
          ].includes(p.servicio),
          "Servicio no soportado"
        )
        if (p.servicio === "empleado_hogar") texto(p.altaSeguridadSocial)
        else
          exigir(
            p.servicio === "guarderia"
              ? anosServicio < 3
              : anosServicio >= 3 && anosServicio < 6,
            "Edad no concordante con el servicio"
          )
      })
      return s.plus(pagos(h, u.gastos, true))
    }, new D(0))
    return parcial(
      D.min(base.times(tipo), new D(tope).times(parte)),
      [
        "CAMP-02: Ley11/2023 preserva 50%/900 antes de julio",
        `Devengo ${h.devengo}; tipo ${tipo}; máximo ${tope}; factor límite renta ${factorRenta}`,
        "Ley3/2025: RETA183 y renta especial30% desde11/7",
        "Manual AEAT2025 p155: se reparte el máximo; el porcentaje recae sobre pagos propios",
      ],
      [
        "Rama de menores convivientes desde 1 de enero y menores de seis todo el año; sin prorrateo diario",
        "Actividad, título familiar, mínimos y alta del cuidador sujetos a cotejo particular",
        "El artículo6bis.4 describe el prorrateo en términos generales; se conserva la concreción operativa del manual sobre el máximo",
      ]
    )
  })
}
