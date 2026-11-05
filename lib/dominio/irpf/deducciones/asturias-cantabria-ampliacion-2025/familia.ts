import {
  r,
  magnitudAnualR,
  cuenta,
  total,
  exigir,
  documento,
  edad,
  lista,
  persona,
  grado,
  dias,
  minimoDesc,
  minimoAsc,
  reparto,
  pagos,
  limiteBase,
  contiene,
  intervalo,
  mesesDesde,
  resultado,
  excluida,
  incompatibles,
  asturiasRural,
  cantabriaRural,
  fecha,
  ids,
  type Persona,
  type Reparto,
  type MarcoB,
  type PagoB,
  type ResolucionB,
  type ResultadoAmpliacion,
  type Uso,
  type Intervalo,
} from "./comun"

export type Descendiente = Persona &
  Reparto & {
    readonly parentesco:
      | "hijo"
      | "adoptado"
      | "tutela"
      | "acogimiento"
      | "nieto"
    readonly progenitores: readonly string[]
    readonly gradoTitular: number
    readonly gradosOtrosAscendientes: readonly number[]
  }
export function descendiente(p: Descendiente, m: MarcoB): void {
  persona(p, [...p.titulares, ...p.progenitores, ...m.declarantes])
  exigir(
    (p.progenitores.length === 0 || ids(p.progenitores)) &&
      p.progenitores.length <= 2,
    "Progenitores y titularidad incoherentes"
  )
  if (["hijo", "adoptado"].includes(p.parentesco))
    exigir(
      p.titulares.every((id) => p.progenitores.includes(id)),
      "Titular no identificado como progenitor del hijo"
    )
  if (p.parentesco === "acogimiento")
    exigir(
      !p.progenitores.some((id) => p.titulares.includes(id)),
      "Acogedor identificado como progenitor biológico"
    )
  exigir(
    Number.isInteger(p.gradoTitular) &&
      p.gradoTitular > 0 &&
      p.gradosOtrosAscendientes.every((g) => Number.isInteger(g) && g > 0),
    "Grados de parentesco inválidos"
  )
  reparto(m, p)
}
export function prioridad(p: Descendiente): boolean {
  return !p.gradosOtrosAscendientes.some((g) => g < p.gradoTitular)
}
export type TituloNumerosa = {
  readonly documento: ResolucionB
  readonly vigencia: Intervalo
  readonly categoria: "general" | "especial"
}
export function titulo(t: TituloNumerosa | null): boolean {
  if (t === null) return false
  documento(t.documento)
  return contiene(t.vigencia, "2025-12-31")
}
export type Conviviente =
  | {
      readonly clase: "descendiente"
      readonly persona: Descendiente
      readonly custodia: "exclusiva" | "compartida"
    }
  | { readonly clase: "ascendiente"; readonly persona: Persona }
  | { readonly clase: "ajeno"; readonly persona: Persona }
export type MonoparentalAst = {
  readonly convivientes: readonly Conviviente[]
  readonly exhaustividad: "completa" | "incompleta"
  readonly rentaPeriodo: string
  readonly alimentosExentos: string
  readonly cambioSituacion: string | null
}
export function monoAst(m: MarcoB, f: MonoparentalAst): boolean {
  exigir(
    m.declarantes.length === 1,
    "Monoparentalidad asturiana requiere un único progenitor declarante"
  )
  exigir(f.exhaustividad === "completa", "Faltan convivientes exhaustivos")
  exigir(
    f.convivientes.length === 0 || ids(f.convivientes.map((x) => x.persona.id)),
    "Convivientes duplicados"
  )
  if (
    !limiteBase(m, "45000", "45000") ||
    magnitudAnualR(f.rentaPeriodo, true).plus(r(f.alimentosExentos)).cmp(r("45000")) > 0
  )
    return false
  if (f.cambioSituacion !== null)
    exigir(
      fecha(f.cambioSituacion) && f.cambioSituacion <= "2025-12-31",
      "Cambio familiar inválido"
    )
  let hijos = 0
  for (const c of f.convivientes) {
    persona(c.persona, m.declarantes)
    const presente = contiene(c.persona.convivencia, "2025-12-31")
    if (!presente && c.clase !== "descendiente") continue
    if (c.clase === "ajeno") return false
    if (c.clase === "ascendiente") {
      if (!minimoAsc(c.persona, m.declarantes)) return false
      continue
    }
    descendiente(c.persona, m)
    if (c.custodia === "compartida") return false
    if (r(c.persona.rentaNoExenta).cmp(r("8000")) > 0) return false
    if (c.persona.parentesco === "nieto") return false
    const e = edad(c.persona.nacimiento)
    const internado =
      c.persona.centroEspecializado !== null &&
      pagos(c.persona.dependenciaEconomica, c.persona.titulares).cmp(r("0")) > 0
    if (c.persona.centroEspecializado !== null)
      documento(c.persona.centroEspecializado)
    if ((e < 18 || grado(c.persona) >= 33) && (presente || internado)) {
      if (f.cambioSituacion !== null && dias(c.persona) < 183) return false
      hijos++
    }
  }
  return hijos > 0
}
export type EventoAdopcion = {
  readonly id: string
  readonly hijo: Descendiente
  readonly resolucion: ResolucionB
  readonly registroCivil: ResolucionB | null
  readonly inscripcion: "necesaria" | "no_necesaria"
  readonly residenciaAnterior: "extranjero" | "espana"
  readonly residenciaAdoptantes: "espana" | "extranjero"
  readonly desplazamientoEspana: string | null
  readonly declaracionAdoptabilidad: ResolucionB | null
}
function fechaAdopcion(x: EventoAdopcion): string {
  documento(x.resolucion)
  exigir(
    x.resolucion.fecha >= x.hijo.nacimiento,
    "Adopción anterior al nacimiento"
  )
  if (x.inscripcion === "no_necesaria") return x.resolucion.fecha
  exigir(
    x.registroCivil !== null,
    "Falta inscripción necesaria en Registro Civil"
  )
  documento(x.registroCivil)
  exigir(
    x.registroCivil.fecha >= x.resolucion.fecha,
    "Registro anterior a resolución"
  )
  return x.registroCivil.fecha
}
export type HechosFamilia =
  | {
      readonly codigo: "asturias_adopcion_internacional"
      readonly adopciones: readonly EventoAdopcion[]
    }
  | {
      readonly codigo: "asturias_partos_multiples_adopciones_misma_fecha"
      readonly eventos: readonly {
        readonly id: string
        readonly fecha: string
        readonly tipo: "parto" | "adopcion"
        readonly hijos: readonly Descendiente[]
        readonly adopciones: readonly EventoAdopcion[]
        readonly unionProgenitores: "matrimonio" | "hecho" | "sin_union"
      }[]
    }
  | {
      readonly codigo: "asturias_familias_numerosas"
      readonly titulo: TituloNumerosa | null
      readonly hijos: readonly Descendiente[]
      readonly ascendientes: readonly string[]
      readonly reparto: Reparto
    }
  | {
      readonly codigo: "asturias_familias_monoparentales"
      readonly familia: MonoparentalAst
    }
  | {
      readonly codigo: "asturias_centros_cero_tres"
      readonly municipio: string
      readonly usos: readonly Uso[]
      readonly hijos: readonly (Descendiente & {
        readonly centro: ResolucionB
        readonly escolarizacion: Intervalo
        readonly pagosFamilia: readonly PagoB[]
        readonly ayudaAsturias: string
      })[]
    }
  | {
      readonly codigo: "asturias_libros_texto_material_escolar"
      readonly titulo: TituloNumerosa | null
      readonly hijos: readonly (Descendiente & {
        readonly etapa: "primaria" | "eso" | "otra"
        readonly pagosFamilia: readonly PagoB[]
        readonly becasPublicas: string
      })[]
    }
  | {
      readonly codigo: "asturias_cuidado_descendientes_hasta_25"
      readonly usos: readonly Uso[]
      readonly hijos: readonly Descendiente[]
    }
  | {
      readonly codigo: "asturias_descendiente_fallecimiento_progenitor_accidente_laboral"
      readonly hijos: readonly (Descendiente & {
        readonly progenitorFallecido: string
        readonly fallecimiento: ResolucionB
        readonly accidenteLaboral: ResolucionB
      })[]
    }
  | {
      readonly codigo: "asturias_enfermedad_celiaca"
      readonly personas: readonly {
        readonly id: string
        readonly persona: Persona
        readonly relacion: "propio" | "conyuge" | "ascendiente" | "descendiente"
        readonly reparto: Reparto
        readonly informe: ResolucionB
        readonly fechaDiagnostico: string
        readonly diagnostico: "definitivo" | "provisional"
        readonly servicio: "SNS" | "aseguradora"
        readonly identificadorMedico: string
        readonly gastos: readonly PagoB[]
      }[]
    }
  | {
      readonly codigo: "cantabria_cuidado_familiares"
      readonly ipremAnual: {
        readonly ejercicio: 2025
        readonly euros: string
        readonly documento: ResolucionB
      }
      readonly usos: readonly Uso[]
      readonly familiares: readonly {
        readonly id: string
        readonly persona: Persona
        readonly relacion:
          | "ascendiente"
          | "descendiente"
          | "conyuge"
          | "hermano"
        readonly registroPareja: ResolucionB | null
      }[]
    }
  | {
      readonly codigo: "cantabria_acogimiento_familiar_menores"
      readonly pareja: Reparto
      readonly acogidos: readonly (Descendiente & {
        readonly seleccion: ResolucionB
        readonly acogimiento: Intervalo
        readonly parentescoAcogedor: number | null
        readonly adopcion: string | null
        readonly supervisionExacogido: ResolucionB | null
        readonly interrupciones: readonly Intervalo[]
      })[]
    }
  | {
      readonly codigo:
        | "cantabria_gastos_guarderia"
        | "cantabria_guarderia_municipios_riesgo_despoblamiento"
      readonly municipio: string
      readonly usos: readonly Uso[]
      readonly hijos: readonly (Descendiente & {
        readonly centro: ResolucionB
        readonly pagosFamilia: readonly PagoB[]
      })[]
    }

/** En los cumpleaños con día1 la ventana de meses se determina sin criterio adicional.
 * Para un mes partido se exige su resolución por el integrador, no se inventa un mes completo. */
function mesesCompletos(p: Descendiente, hastaEdad: number): number {
  const aniversario = mesesDesde(p.nacimiento, hastaEdad * 12)
  if (aniversario > "2025-12-31") return 12
  if (aniversario < "2025-01-01") return 0
  exigir(
    aniversario.slice(8, 10) === "01",
    "Mes de cumpleaños partido: falta criterio de cómputo mensual para art.14bis/14duodecies; no elegir cuantía"
  )
  return Number(aniversario.slice(5, 7)) - 1
}
export function evaluarFamilia(
  m: MarcoB,
  h: HechosFamilia
): ResultadoAmpliacion {
  switch (h.codigo) {
    case "asturias_adopcion_internacional": {
      lista(h.adopciones)
      exigir(
        h.adopciones.length === 0 || ids(h.adopciones.map((x) => x.hijo.id)),
        "Hijo repetido en adopciones"
      )
      const valores = h.adopciones.map((x) => {
        descendiente(x.hijo, m)
        const f = fechaAdopcion(x)
        if (
          x.residenciaAnterior !== "extranjero" ||
          x.residenciaAdoptantes !== "espana"
        )
          return r("0")
        exigir(
          x.declaracionAdoptabilidad !== null &&
            x.desplazamientoEspana !== null,
          "Falta declaración de adoptabilidad o fecha de desplazamiento"
        )
        documento(x.declaracionAdoptabilidad)
        exigir(fecha(x.desplazamientoEspana), "Desplazamiento inválido")
        if (
          !f.startsWith("2025-") ||
          !contiene(x.hijo.convivencia, "2025-12-31")
        )
          return r("0")
        return r("1500").times(reparto(m, x.hijo))
      })
      return resultado(total(valores), "Asturias art.9 y Ley54/2007 art.1.2")
    }
    case "asturias_partos_multiples_adopciones_misma_fecha": {
      lista(h.eventos)
      exigir(
        h.eventos.length === 0 ||
          ids(h.eventos.flatMap((x) => x.hijos.map((p) => p.id))),
        "Hijos duplicados entre eventos"
      )
      let sum = r("0")
      for (const e of h.eventos) {
        exigir(fecha(e.fecha), "Fecha de evento inválida")
        lista(e.hijos)
        if (!e.fecha.startsWith("2025-") || e.hijos.length < 2) continue
        if (e.tipo === "adopcion") {
          exigir(
            e.adopciones.length === e.hijos.length &&
              ids(e.adopciones.map((a) => a.hijo.id)) &&
              e.adopciones.every((a) =>
                e.hijos.some((p) => p.id === a.hijo.id)
              ),
            "Adopciones sin correspondencia única con hijos"
          )
          exigir(
            e.adopciones.every((a) => fechaAdopcion(a) === e.fecha),
            "Adopciones constituidas en fechas distintas"
          )
        }
        for (const p of e.hijos) {
          descendiente(p, m)
          if (e.tipo === "parto")
            exigir(
              p.nacimiento === e.fecha,
              "Parto sin misma fecha de nacimiento"
            )
          if (!contiene(p.convivencia, "2025-12-31")) continue
          const f =
            e.unionProgenitores === "sin_union"
              ? cuenta(
                  p.titulares.filter((id) => m.declarantes.includes(id)).length
                )
              : reparto(m, p)
          sum = sum.plus(r("1000").times(f))
        }
      }
      return resultado(
        sum,
        "Asturias art.10:1000 por hijo; sólo mismo parto/fecha de adopción"
      )
    }
    case "asturias_familias_numerosas": {
      lista(h.hijos)
      exigir(
        ids(h.ascendientes) && h.ascendientes.length <= 2,
        "Ascendientes familiares inválidos"
      )
      const conviven = h.hijos.every((p) => {
        descendiente(p, m)
        return contiene(p.convivencia, "2025-12-31")
      })
      if (!conviven)
        return excluida("Sin convivencia de unidad familiar al devengo")
      exigir(
        h.ascendientes.includes(m.contribuyente) &&
          h.reparto.titulares.every((id) => h.ascendientes.includes(id)),
        "Unidad familiar ajena al contribuyente/titulares"
      )
      const oficial = titulo(h.titulo)
      if (
        !oficial &&
        (h.hijos.length !== 2 || !limiteBase(m, "35000", "45000"))
      )
        return excluida(
          "Sin título ni equiparación de dos hijos dentro de base"
        )
      return resultado(
        r(
          oficial && h.titulo?.categoria === "especial" ? "2000" : "1000"
        ).times(reparto(m, h.reparto)),
        "Asturias art.11; equiparación propia de dos hijos"
      )
    }
    case "asturias_familias_monoparentales":
      return monoAst(m, h.familia)
        ? resultado(
            r("500"),
            "Asturias art.12:convivientes, renta/alimentos, custodia y183 días si cambio"
          )
        : excluida("No reúne composición monoparental asturiana")
    case "asturias_centros_cero_tres": {
      const rural = asturiasRural(h.municipio)
      if (!limiteBase(m, rural ? "35000" : "26000", rural ? "45000" : "37000"))
        return excluida("Base superior al límite de centros0–3")
      incompatibles(m, h.usos, ["asturias_cuidado_descendientes_hasta_25"])
      lista(h.hijos)
      lista(h.hijos.flatMap((p) => p.pagosFamilia))
      let sum = r("0")
      for (const p of h.hijos) {
        descendiente(p, m)
        documento(p.centro)
        intervalo(p.escolarizacion)
        exigir(
          p.escolarizacion.inicio >= p.nacimiento,
          "Centro anterior al nacimiento"
        )
        if (
          p.escolarizacion.inicio > "2025-12-31" ||
          p.escolarizacion.fin < "2025-01-01" ||
          !contiene(p.convivencia, "2025-12-31") ||
          edad(p.nacimiento) > 3
        )
          continue
        const meses = mesesCompletos(p, 3),
          factorMes = cuenta(meses).div(r("12"))
        const gasto = pagos(p.pagosFamilia, p.titulares)
        const ded = gasto
          .times(r(rural ? "0.30" : "0.15"))
          .min(r(rural ? "1000" : "500"))
          .times(factorMes)
          .minus(r(p.ayudaAsturias))
          .max(r("0"))
        sum = sum.plus(ded.times(reparto(m, p)))
      }
      return resultado(
        sum,
        "Asturias art.14bis:ayuda minora deducción después del tope",
        [
          "Cumpleaños con día distinto de1:resolver cómputo del mes partido antes de evaluar esa rama",
        ]
      )
    }
    case "asturias_libros_texto_material_escolar": {
      if (!limiteBase(m, "26000", "37000"))
        return excluida("Base excedida para libros/material")
      const b = r(m.baseGeneral).plus(r(m.baseAhorro)),
        conjunta = m.modalidad === "conjunta"
      const max = titulo(h.titulo)
        ? r(conjunta ? "150" : "75")
        : b.cmp(r(conjunta ? "12000" : "6500")) <= 0
          ? r(conjunta ? "100" : "50")
          : b.cmp(r(conjunta ? "20000" : "10000")) <= 0
            ? r(conjunta ? "75" : "37.50")
            : r(conjunta ? "50" : "25")
      lista(h.hijos)
      lista(h.hijos.flatMap((p) => p.pagosFamilia))
      return resultado(
        total(
          h.hijos.map((p) => {
            descendiente(p, m)
            if (p.etapa === "otra") return r("0")
            return pagos(p.pagosFamilia, p.titulares)
              .min(max)
              .minus(r(p.becasPublicas))
              .max(r("0"))
              .times(reparto(m, p))
          })
        ),
        "Asturias art.14ter:tramos de base; beca minora deducción por descendiente"
      )
    }
    case "asturias_cuidado_descendientes_hasta_25": {
      incompatibles(m, h.usos, ["asturias_centros_cero_tres"])
      if (!limiteBase(m, "35000", "45000"))
        return excluida("Base excedida para cuidado")
      lista(h.hijos)
      let sum = r("0")
      for (const p of h.hijos) {
        descendiente(p, m)
        if (!prioridad(p) || !contiene(p.convivencia, "2025-12-31")) continue
        const meses =
          edad(p.nacimiento) === 26 && grado(p) === 0
            ? mesesCompletos(p, 26)
            : 12
        const cumple =
          minimoDesc(p, p.titulares, true) ||
          (edad(p.nacimiento) === 26 &&
            r(p.rentaNoExenta).cmp(r("8000")) <= 0 &&
            (p.declaracionRentas === null ||
              r(p.declaracionRentas).cmp(r("1800")) <= 0))
        if (cumple)
          sum = sum.plus(
            r("600").times(cuenta(meses)).div(r("12")).times(reparto(m, p))
          )
      }
      return resultado(
        sum,
        "Asturias art.14duodecies:25 años incluidos;26 proporcional",
        [
          "Mes de cumpleaños partido requiere resolver cómputo mensual; no se inventa contador externo",
        ]
      )
    }
    case "asturias_descendiente_fallecimiento_progenitor_accidente_laboral": {
      lista(h.hijos)
      return resultado(
        total(
          h.hijos.map((p) => {
            descendiente(p, m)
            documento(p.fallecimiento)
            documento(p.accidenteLaboral)
            exigir(
              p.progenitores.includes(p.progenitorFallecido) &&
                !m.declarantes.includes(p.progenitorFallecido) &&
                p.fallecimiento.fecha >= p.nacimiento,
              "Fallecimiento sin otro progenitor identificado o anterior al nacimiento"
            )
            return minimoDesc(p, p.titulares) && prioridad(p)
              ? r("1000")
              : r("0")
          })
        ),
        "Asturias art.14septendecies:descendiente con mínimo y otro progenitor fallecido por accidente laboral"
      )
    }
    case "asturias_enfermedad_celiaca": {
      if (!limiteBase(m, "35000", "45000"))
        return excluida("Base excedida en celiaquía")
      lista(h.personas)
      let sum = r("0")
      for (const x of h.personas) {
        persona(
          x.persona,
          ["propio", "conyuge"].includes(x.relacion) ? [] : m.declarantes
        )
        exigir(
          x.id === x.persona.id,
          "Identidad del informe distinta del paciente"
        )
        documento(x.informe)
        exigir(
          fecha(x.fechaDiagnostico) &&
            x.fechaDiagnostico >= x.persona.nacimiento &&
            x.fechaDiagnostico <= x.informe.fecha &&
            x.identificadorMedico.trim() !== "",
          "Diagnóstico/identificación médica inválidos"
        )
        if (x.diagnostico !== "definitivo") continue
        const propio = x.relacion === "propio" && m.declarantes.includes(x.id)
        const conyuge =
          x.relacion === "conyuge" &&
          m.modalidad === "conjunta" &&
          m.declarantes.includes(x.id)
        const familiar =
          x.relacion === "ascendiente"
            ? minimoAsc(x.persona, x.reparto.titulares)
            : x.relacion === "descendiente"
              ? minimoDesc(x.persona, x.reparto.titulares)
              : false
        if (!propio && !conyuge && !familiar) continue
        if (pagos(x.gastos, m.declarantes).cmp(r("0")) === 0) continue
        sum = sum.plus(
          r("100").times(familiar ? reparto(m, x.reparto) : r("1"))
        )
      }
      return resultado(
        sum,
        "Asturias art.14novodecies:100 por paciente, diagnóstico definitivo SNS/aseguradora y gastos"
      )
    }
    case "cantabria_cuidado_familiares": {
      lista(h.familiares)
      let sum = r("0")
      for (const x of h.familiares) {
        exigir(x.id === x.persona.id, "Identidad de familiar incoherente")
        persona(x.persona, m.declarantes)
        if (x.registroPareja !== null) documento(x.registroPareja)
        const disc = grado(x.persona) >= 65
        if (disc) {
          exigir(h.ipremAnual.ejercicio === 2025, "IPREM de otro año")
          documento(h.ipremAnual.documento)
        }
        const e = edad(x.persona.nacimiento),
          menor = x.relacion === "descendiente" && e < 3
        const mayor = x.relacion === "ascendiente" && e > 70
        if (!menor && !mayor && !disc) continue
        if (!menor && dias(x.persona) <= 183) continue
        if (
          r(x.persona.rentaBrutaIncluidasExentas).cmp(
            disc ? r(h.ipremAnual.euros).times(r("1.50")) : r("6000")
          ) > 0
        )
          continue
        if (menor && !disc)
          incompatibles(
            m,
            h.usos,
            ["cantabria_nacimiento_adopcion_hijos"],
            x.id
          )
        sum = sum.plus(r("100"))
      }
      return resultado(
        sum,
        "Cantabria art.2.2:100 por familiar, no por cada condición; renta bruta y1,5IPREM en discapacidad"
      )
    }
    case "cantabria_acogimiento_familiar_menores": {
      lista(h.acogidos)
      const eventos: { f: string; delta: number }[] = []
      for (const p of h.acogidos) {
        exigir(
          p.parentesco === "acogimiento",
          "Acogido sin vínculo de acogimiento"
        )
        descendiente(p, m)
        documento(p.seleccion)
        intervalo(p.acogimiento)
        exigir(
          p.seleccion.fecha <= p.acogimiento.inicio &&
            p.acogimiento.inicio >= p.nacimiento,
          "Selección posterior al acogimiento o intervalo anterior al nacimiento"
        )
        exigir(
          p.parentescoAcogedor === null ||
            (Number.isInteger(p.parentescoAcogedor) &&
              p.parentescoAcogedor > 0),
          "Parentesco del acogedor inválido"
        )
        if (p.adopcion !== null)
          exigir(
            fecha(p.adopcion) &&
              p.adopcion >= p.nacimiento &&
              p.adopcion <= "2025-12-31",
            "Adopción del acogido con fecha imposible o futura"
          )
        if (
          p.parentescoAcogedor !== null ||
          (p.adopcion !== null && p.adopcion.startsWith("2025-"))
        )
          continue
        if (edad(p.nacimiento) >= 18) {
          exigir(
            p.supervisionExacogido !== null,
            "Exacogido sin aprobación/supervisión pública"
          )
          documento(p.supervisionExacogido)
          if (
            p.acogimiento.inicio > mesesDesde(p.nacimiento, 18 * 12) ||
            p.interrupciones.length > 0 ||
            !minimoDesc(p, p.titulares)
          )
            continue
        }
        const inicio =
            p.acogimiento.inicio < "2025-01-01"
              ? "2025-01-01"
              : p.acogimiento.inicio,
          fin =
            p.acogimiento.fin > "2025-12-31" ? "2025-12-31" : p.acogimiento.fin
        if (inicio > fin) continue
        eventos.push({ f: inicio, delta: 1 }, { f: fin, delta: -1 })
      }
      // Orden inclusivo: entran los que comienzan antes de retirar los que terminan ese día.
      eventos.sort((a, b) => a.f.localeCompare(b.f) || b.delta - a.delta)
      let actual = 0,
        max = 0
      for (const e of eventos) {
        actual += e.delta
        max = Math.max(max, actual)
      }
      return resultado(
        r("240").times(cuenta(max)).min(r("1200")).times(reparto(m, h.pareja)),
        "Cantabria art.2.5:simultaneidad máxima, no total anual de acogidos"
      )
    }
    case "cantabria_gastos_guarderia":
    case "cantabria_guarderia_municipios_riesgo_despoblamiento": {
      const rural =
        h.codigo === "cantabria_guarderia_municipios_riesgo_despoblamiento"
      if (rural && !cantabriaRural(h.municipio))
        return excluida("Municipio fuera de PRE/1/2025")
      incompatibles(m, h.usos, [
        rural
          ? "cantabria_gastos_guarderia"
          : "cantabria_guarderia_municipios_riesgo_despoblamiento",
      ])
      lista(h.hijos)
      lista(h.hijos.flatMap((p) => p.pagosFamilia))
      let sum = r("0")
      for (const p of h.hijos) {
        descendiente(p, m)
        documento(p.centro)
        if (
          edad(p.nacimiento) >= 3 ||
          !["hijo", "adoptado"].includes(p.parentesco)
        )
          continue
        const comun = pagos(p.pagosFamilia, p.titulares, true),
          propio = pagos(
            p.pagosFamilia.filter((g) => m.declarantes.includes(g.pagador)),
            m.declarantes,
            true
          )
        if (comun.cmp(r("0")) === 0) continue
        sum = sum.plus(
          comun
            .times(r(rural ? "0.30" : "0.15"))
            .min(r(rural ? "600" : "300"))
            .times(propio)
            .div(comun)
        )
      }
      return resultado(
        sum,
        "Cantabria arts.2.8/2.11.2:gasto bancario por hijo y reparto proporcional a pagos justificados"
      )
    }
  }
}
