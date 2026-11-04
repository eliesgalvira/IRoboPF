import Decimal from "decimal.js"
import {
  acceso,
  entero,
  evidencia,
  factor,
  n,
  proporcion,
  rechazar,
  t,
  type Formula,
} from "./comun"

export const familia = {
  nacimiento_adopcion_multiples: (h, u) => {
    if (
      entero(u, "personasMismaFecha", 20) < 2 ||
      u.fecha.slice(0, 4) !== "2025"
    )
      return new Decimal(0)
    return new Decimal(246).times(factor(h)).times(proporcion(h, u))
  },
  nacimiento_adopcion_acogimiento_discapacidad: (h, u) => {
    const tipo = t(u, "tipo", [
      "nacimiento",
      "adopcion",
      "guarda",
      "acogimiento",
    ])
    if (u.fecha.slice(0, 4) !== "2025") return new Decimal(0)
    if (h.devengo < "2025-06-01" && ["guarda", "acogimiento"].includes(tipo))
      return new Decimal(0)
    const cualificada =
      n(u, "grado").gte(65) ||
      (t(u, "claseDiscapacidad", ["fisica", "intelectual_mental"]) ===
        "intelectual_mental" &&
        n(u, "grado").gte(33) &&
        (h.devengo < "2025-12-30" || t(u, "permanente", ["si", "no"]) === "si"))
    if (!cualificada) return new Decimal(0)
    if (h.devengo < "2025-12-30" && entero(u, "otrasPersonasDerecho", 20) > 0)
      evidencia(u, "hermanoCualificado")
    return new Decimal(entero(u, "otrasPersonasDerecho", 20) > 0 ? 303 : 246)
      .times(factor(h))
      .times(proporcion(h, u))
  },
  familia_numerosa_monoparental: (h, u) => {
    const especial = t(u, "categoria", ["general", "especial"]) === "especial"
    return new Decimal(especial ? 660 : 330)
      .times(especial ? factor(h, 35000, 58000, 4000) : factor(h))
      .times(proporcion(h, u))
  },
  custodia_guarderias_menores_3: (h, u) =>
    Decimal.min(
      n(u, "gastoCustodia").times("0.15"),
      new Decimal(297)
        .times(entero(u, "diasMenorTres", 365))
        .div(365)
        .times(factor(h))
    ).times(proporcion(h, u)),
  conciliacion_trabajo_familia: (h, u) => {
    acceso(h)
    return Decimal.min(
      new Decimal(460)
        .times(entero(u, "mesesDerecho", 12))
        .div(12)
        .times(proporcion(h, u)),
      n(u, "cotizacionIntegraIntervalo")
    )
  },
  discapacidad_65: (h, u) => {
    if (
      n(u, "edad").lt(65) ||
      n(u, "grado").lt(33) ||
      t(u, "prestacionExenta", ["si", "no"]) === "si"
    )
      return new Decimal(0)
    if (!h.declarantes.includes(u.id))
      return rechazar("Discapacidad propia exige identidad declarante")
    return new Decimal(197).times(factor(h))
  },
  empleados_hogar_cuidado_personas: (h, u) => {
    const menores = t(u, "grupo", ["menores", "ascendientes"]) === "menores"
    const reforzado = t(u, "limite", ["ordinario", "reforzado"]) === "reforzado"
    return Decimal.min(
      n(u, "cuotasMesesDerecho").times("0.5"),
      new Decimal(
        menores ? (reforzado ? 1100 : 660) : reforzado ? 550 : 330
      ).times(factor(h))
    ).times(proporcion(h, u))
  },
  material_escolar: (h, u) =>
    new Decimal(110)
      .times(entero(u, "diasDesempleo", 365))
      .div(365)
      .times(factor(h))
      .times(proporcion(h, u)),
  municipio_riesgo_despoblamiento: (h, u) => {
    evidencia(u, "municipioFondo2024o2025")
    const hijos = entero(u, "descendientesSinABC", 30)
    return new Decimal(330).plus(
      new Decimal(
        hijos === 0 ? 0 : hijos === 1 ? 132 : hijos === 2 ? 198 : 264
      ).times(proporcion(h, u))
    )
  },
  tratamientos_fertilidad: (h, u) => {
    if (
      n(u, "edad").lt(40) ||
      n(u, "edad").gt(45) ||
      n(u, "gastoTratamiento").isZero()
    )
      return new Decimal(0)
    if (!h.declarantes.includes(u.id))
      return rechazar("La mujer tratada debe ser declarante")
    evidencia(u, "clinicaAutorizada")
    return new Decimal(100).times(factor(h))
  },
  nacimiento_adopcion_guarda_acogimiento: (h, u) => {
    const tipo = t(u, "tipo", [
      "nacimiento",
      "adopcion",
      "guarda",
      "acogimiento",
    ])
    const anio = Number(u.fecha.slice(0, 4))
    if (anio < 2023 || anio > 2025) return new Decimal(0)
    if (["guarda", "acogimiento"].includes(tipo)) {
      if (
        h.devengo < "2025-06-01" ||
        anio !== 2025 ||
        entero(u, "diasMedida", 365) <= 183
      )
        return new Decimal(0)
      evidencia(u, "resolucionMedida")
    }
    if (anio < 2025) {
      if (["guarda", "acogimiento"].includes(tipo)) return new Decimal(0)
      evidencia(u, "derechoPrevio")
    }
    const orden = entero(u, "ordenPorContribuyente", 30)
    if (orden < 1)
      return rechazar("Orden por contribuyente debe empezar en uno")
    const cuantia =
      anio < 2025 || h.devengo < "2025-06-01"
        ? 300
        : orden === 1
          ? 600
          : orden === 2
            ? 750
            : 900
    return new Decimal(cuantia).times(factor(h)).times(proporcion(h, u))
  },
  ascendientes_mayores_discapacidad: (h, u) => {
    const grado = n(u, "grado")
    const cualificada =
      grado.gte(65) ||
      (t(u, "claseDiscapacidad", ["fisica", "intelectual_mental"]) ===
        "intelectual_mental" &&
        grado.gte(33) &&
        (h.devengo < "2025-12-30" || t(u, "permanente", ["si", "no"]) === "si"))
    if (
      !(n(u, "edad").gt(75) || (n(u, "edad").gt(65) && cualificada)) ||
      n(u, "rentaNoExenta").gt(8000) ||
      n(u, "rentaDeclaracion").gt(1800) ||
      n(u, "diasConvivencia").lt("182.5")
    )
      return new Decimal(0)
    return new Decimal(197).times(factor(h)).times(proporcion(h, u))
  },
} satisfies Readonly<Record<string, Formula>>
