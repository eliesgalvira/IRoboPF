import type Decimal from "decimal.js"
import { Schema } from "effect"
import {
  D,
  Texto,
  Entero,
  Centimos,
  BaseCentimos,
  Grado,
  Contexto,
  Pago,
  Minimo,
  FamiliaNumerosa,
  exigir,
  ref,
  fecha,
  edad,
  unicos,
  titulares,
  eur,
  renta,
  limiteRenta,
  minimo,
  numerosa,
  pagado,
  pagos,
  incompatible,
} from "./comun"
import { Vivienda, baseVivienda } from "./vivienda"
import { Inversion, sociedad, ampliacionTresAnios } from "./inversion"
const S0 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal("andalucia_gastos_educativos"),
  hechos: Schema.Struct({
    descendientes: Schema.Array(
      Schema.Struct({
        minimo: Minimo,
        gastos: Schema.Array(
          Schema.Struct({
            pago: Pago,
            centro: Texto,
            clase: Schema.Literals(["escolar", "academia", "particular-iae"]),
            horasMateria: Entero,
            horasTotales: Entero,
            altaIAE: Schema.String,
          })
        ),
      })
    ),
  }),
})
const S1 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal("andalucia_defensa_juridica_laboral"),
  hechos: Schema.Struct({
    procedimientos: Schema.Array(
      Schema.Struct({
        id: Texto,
        clase: Schema.Literals([
          "despido",
          "extincion",
          "reclamacion-cantidades",
        ]),
        expedienteJudicial: Texto,
        pagos: Schema.Array(Pago),
      })
    ),
  }),
})
const S2 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal("andalucia_donativos_finalidad_ecologica"),
  hechos: Schema.Struct({
    donaciones: Schema.Array(
      Schema.Struct({
        pago: Pago,
        entidad: Texto,
        clase: Schema.Literals([
          "publica-andaluza",
          "ley49-art2",
          "ley49-art16",
        ]),
        finalidad: Schema.Literals([
          "exclusiva-ambiental",
          "ambiental-publica",
          "otra",
        ]),
        registroAndaluz: Schema.String,
        destinoPrograma: Texto,
        certificadoArt24: Texto,
      })
    ),
  }),
})
const S3 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal("andalucia_ejercicio_fisico_deporte"),
  hechos: Schema.Struct({
    cuotas: Schema.Array(
      Schema.Struct({
        pago: Pago,
        entidad: Texto,
        claseEntidad: Schema.Literals([
          "gimnasio",
          "centro-deportivo",
          "club",
          "federacion",
          "seccion-deportiva",
        ]),
        persona: Texto,
        relacion: Schema.Literals([
          "propio",
          "conyuge",
          "pareja-inscrita",
          "minimo",
        ]),
        referenciaRelacion: Texto,
        derechoMinimo: Schema.NullOr(Minimo),
      })
    ),
  }),
})
const S4 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal(
    "andalucia_gastos_veterinarios_animales_compania_perros_asistencia"
  ),
  hechos: Schema.Struct({
    animales: Schema.Array(
      Schema.Struct({
        id: Texto,
        clase: Schema.Literals(["compania", "asistencia", "aviso-violencia"]),
        adquisicion: Texto,
        via: Schema.Literals(["venta", "cesion", "adopcion"]),
        tituloAdquisicionLegal: Texto,
        calificacionAnimal: Texto,
        tenenciaHasta: Texto,
        acreditacionViolencia: Schema.String,
        gastos: Schema.Array(
          Schema.Struct({
            pago: Pago,
            clase: Schema.Literals([
              "tratamiento-obligatorio",
              "esterilizacion-preceptiva",
              "voluntario",
            ]),
            normaPreceptiva: Texto,
            profesionalAutorizado: Texto,
          })
        ),
      })
    ),
  }),
})
const S5 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal("andalucia_enfermedad_celiaca"),
  hechos: Schema.Struct({
    personas: Schema.Array(
      Schema.Struct({
        persona: Texto,
        relacion: Schema.Literals([
          "propio",
          "conyuge",
          "pareja-inscrita",
          "minimo",
        ]),
        referenciaRelacion: Texto,
        minimo: Schema.NullOr(Minimo),
        titulares: Schema.Array(Texto),
        informe: Texto,
        emisor: Schema.Literals(["SNS", "aseguradora"]),
        referenciaProfesional: Texto,
        fechaDiagnostico: Texto,
      })
    ),
  }),
})
const S6 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal("andalucia_adopcion_internacional"),
  hechos: Schema.Struct({
    adopciones: Schema.Array(
      Schema.Struct({
        persona: Texto,
        inscripcionCivil: Texto,
        normaConvenio: Texto,
        asiento: Texto,
        titulares: Schema.Array(
          Schema.Struct({ id: Texto, imponibleTotalCentimos: BaseCentimos })
        ),
      })
    ),
  }),
})
const S7 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal("andalucia_familia_numerosa"),
  hechos: Schema.Struct({
    familia: FamiliaNumerosa,
    rentasTitulares: Schema.Array(
      Schema.Struct({ id: Texto, imponibleTotalCentimos: BaseCentimos })
    ),
    posicion: Schema.Literals([
      "ascendiente",
      "hermano-huerfano-art2d",
      "hermano-huerfano-art2e",
    ]),
  }),
})
const S8 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal(
    "andalucia_familia_monoparental_ascendientes_mayores_75"
  ),
  hechos: Schema.Struct({
    estadoCivil: Schema.Literals(["separado-legal", "sin-vinculo-matrimonial"]),
    hijos: Schema.Array(
      Schema.Struct({
        persona: Texto,
        nacimiento: Texto,
        convivencia: Texto,
        independenciaConsentida: Schema.Literals(["si", "no"]),
        grado: Grado,
        curatelaJudicial: Schema.String,
      })
    ),
    ascendientes: Schema.Array(Minimo),
    tituloEstadoCivil: Texto,
  }),
})
const S9 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal("andalucia_contribuyente_discapacidad"),
  hechos: Schema.Struct({
    grado: Grado,
    titulo: Texto,
    fechaReconocimiento: Texto,
    asimilacion: Schema.Literals([
      "ninguna",
      "incapacidad-total",
      "incapacidad-absoluta",
      "gran-invalidez",
      "clases-pasivas-inutilidad",
    ]),
  }),
})
const S10 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal("andalucia_conyuge_pareja_discapacidad"),
  hechos: Schema.Struct({
    persona: Texto,
    relacion: Schema.Literals(["conyuge", "pareja-inscrita"]),
    registroRelacion: Texto,
    grado: Grado,
    resolucion: Texto,
    declaracionPropia: Schema.Literals(["no-presenta", "individual"]),
    deduccionPropiaArt16: Schema.Literals(["no-aplicada", "aplicada"]),
  }),
})
const S11 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal("andalucia_asistencia_personas_discapacidad"),
  hechos: Schema.Struct({
    personas: Schema.Array(Minimo),
    asistencia: Schema.Array(
      Schema.Struct({
        persona: Texto,
        necesidadTerceros: Texto,
        empleado: Texto,
        titularTGSS: Texto,
        afiliacionAndalucia: Texto,
        cuotas: Schema.Array(Pago),
      })
    ),
  }),
})
const S12 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal("andalucia_ayuda_domestica"),
  hechos: Schema.Struct({
    titularTGSS: Texto,
    afiliacionAndalucia: Texto,
    viviendaHabitual: Texto,
    personaPareja: Schema.String,
    vinculoPareja: Schema.Literals([
      "sin-pareja",
      "conyuge",
      "pareja-inscrita",
    ]),
    registroPareja: Schema.String,
    nacimientoPareja: Schema.String,
    trabajoTitularCentimos: Centimos,
    trabajoParejaCentimos: Centimos,
    hijos: Schema.Array(Minimo),
    empleado: Texto,
    cuotas: Schema.Array(Pago),
    eleccionBeneficiario: Texto,
  }),
})
const S13 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal("andalucia_alquiler_vivienda_habitual"),
  hechos: Schema.Struct({
    vivienda: Texto,
    contrato: Texto,
    arrendadorFiscal: Texto,
    habitualidad: Texto,
    grado: Grado,
    resolucionDiscapacidad: Schema.String,
    victima: Schema.Literals([
      "ninguna",
      "domestica",
      "terrorismo",
      "afectada-terrorismo",
    ]),
    tituloVictima: Schema.String,
    pagos: Schema.Array(Pago),
  }),
})
const S14 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal(
    "andalucia_inversion_vivienda_habitual_protegida_jovenes"
  ),
  hechos: Schema.Struct({
    vivienda: Vivienda,
    calificacionProtegida: Schema.String,
  }),
})
const S15 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("andalucia"),
  codigo: Schema.Literal(
    "andalucia_inversion_acciones_participaciones_mercantiles"
  ),
  hechos: Schema.Struct({ inversiones: Schema.Array(Inversion) }),
})
export const SolicitudAndalucia = Schema.Union([
  S0,
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  S11,
  S12,
  S13,
  S14,
  S15,
])
export type HechosAndalucia = typeof SolicitudAndalucia.Type
export function calcularAndalucia(h: HechosAndalucia): Decimal {
  switch (h.codigo) {
    case "andalucia_gastos_educativos": {
      const f = h.hechos
      limiteRenta(h, 80000)
      unicos(f.descendientes.map((d) => d.minimo.persona))
      unicos(f.descendientes.flatMap((d) => d.gastos.map((g) => g.pago.id)))
      let total = new D(0)
      for (const d of f.descendientes) {
        minimo(d.minimo, h, "descendiente")
        unicos(d.gastos.map((g) => g.pago.id))
        let base = new D(0)
        for (const g of d.gastos) {
          ref(g.centro)
          let gasto = pagado(g.pago, h, false, true)
          if (g.clase === "escolar") {
            exigir(
              g.horasTotales > 0 && g.horasMateria <= g.horasTotales,
              "Proporción horaria escolar inválida"
            )
            gasto = gasto.times(g.horasMateria).div(g.horasTotales)
          }
          if (g.clase === "particular-iae") ref(g.altaIAE)
          base = base.plus(gasto)
        }
        total = total.plus(D.min(base.times("0.15"), 150))
      }
      return total
    }
    case "andalucia_defensa_juridica_laboral": {
      const f = h.hechos
      unicos(f.procedimientos.map((p) => p.id))
      unicos(f.procedimientos.flatMap((p) => p.pagos.map((p) => p.id)))
      let total = new D(0)
      for (const p of f.procedimientos) {
        ref(p.expedienteJudicial)
        total = total.plus(pagos(p.pagos, h))
      }
      return D.min(total, 200)
    }
    case "andalucia_donativos_finalidad_ecologica": {
      const f = h.hechos
      unicos(f.donaciones.map((d) => d.pago.id))
      let total = new D(0)
      for (const d of f.donaciones) {
        ref(d.entidad)
        ref(d.certificadoArt24)
        ref(d.destinoPrograma)
        if (d.clase === "publica-andaluza")
          exigir(
            d.finalidad === "ambiental-publica",
            "Entidad pública sin programa ambiental"
          )
        else {
          exigir(
            d.finalidad === "exclusiva-ambiental",
            "Entidad privada sin finalidad ambiental exclusiva"
          )
          ref(d.registroAndaluz)
        }
        total = total.plus(pagado(d.pago, h))
      }
      return D.min(total.times("0.10"), 150)
    }
    case "andalucia_ejercicio_fisico_deporte": {
      const f = h.hechos
      unicos(f.cuotas.map((c) => c.pago.id))
      let total = new D(0)
      for (const c of f.cuotas) {
        ref(c.entidad)
        ref(c.referenciaRelacion)
        if (c.relacion === "propio")
          exigir(c.persona === h.contribuyente, "Cuota propia de persona ajena")
        else
          exigir(
            c.persona !== h.contribuyente,
            "Beneficiario familiar coincide con contribuyente"
          )
        if (c.relacion === "minimo") {
          exigir(
            c.derechoMinimo !== null,
            "Falta derecho individualizado al mínimo"
          )
          minimo(c.derechoMinimo, h)
          exigir(
            c.persona === c.derechoMinimo.persona,
            "Mínimo de otro beneficiario"
          )
        }
        total = total.plus(pagado(c.pago, h))
      }
      return D.min(total.times("0.15"), 100)
    }
    case "andalucia_gastos_veterinarios_animales_compania_perros_asistencia": {
      const f = h.hechos
      limiteRenta(h, 80000)
      unicos(f.animales.map((a) => a.id))
      let total = new D(0)
      const todos: string[] = []
      for (const a of f.animales) {
        const compra = fecha(a.adquisicion)
        const fin = fecha(a.tenenciaHasta)
        ref(a.tituloAdquisicionLegal)
        ref(a.calificacionAnimal)
        exigir(compra <= fin, "Tenencia anterior a adquisición")
        if (a.clase === "compania")
          exigir(
            compra >= "2025-01-01",
            "Adquisición de compañía anterior a2025 no habilita"
          )
        if (a.clase === "aviso-violencia") ref(a.acreditacionViolencia)
        for (const g of a.gastos) {
          todos.push(g.pago.id)
          ref(g.profesionalAutorizado)
          ref(g.normaPreceptiva)
          const dia = fecha(g.pago.fecha)
          exigir(dia >= compra && dia <= fin, "Gasto fuera de tenencia")
          if (a.clase === "compania") {
            const anos = a.via === "adopcion" ? 3 : 1
            const termino =
              String(Number(compra.slice(0, 4)) + anos) + compra.slice(4)
            exigir(
              dia < termino,
              "Extremo o gasto posterior al aniversario: precisar ventana legal"
            )
          }
          const gasto = pagado(g.pago, h)
          if (g.clase !== "voluntario") total = total.plus(gasto)
        }
      }
      unicos(todos)
      return D.min(total.times("0.30"), 100)
    }
    case "andalucia_enfermedad_celiaca": {
      const f = h.hechos
      unicos(f.personas.map((p) => p.persona))
      let total = new D(0)
      for (const p of f.personas) {
        ref(p.referenciaRelacion)
        ref(p.informe)
        ref(p.referenciaProfesional)
        exigir(
          fecha(p.fechaDiagnostico) <= h.devengo,
          "Diagnóstico posterior a devengo"
        )
        if (p.relacion === "propio")
          exigir(
            p.persona === h.contribuyente,
            "Identidad propia inconsistente"
          )
        else
          exigir(
            p.persona !== h.contribuyente,
            "Beneficiario familiar coincide con contribuyente"
          )
        if (p.relacion === "minimo") {
          exigir(p.minimo !== null, "Falta mínimo de familiar")
          minimo(p.minimo, h)
          exigir(
            p.minimo.persona === p.persona,
            "Diagnóstico y mínimo de distinta persona"
          )
        }
        total = total.plus(
          new D(100).times(titulares(p.titulares, h.contribuyente))
        )
      }
      return total
    }
    case "andalucia_adopcion_internacional": {
      const f = h.hechos
      limiteRenta(h, 80000)
      unicos(f.adopciones.map((a) => a.persona))
      let total = new D(0)
      for (const a of f.adopciones) {
        exigir(a.persona !== h.contribuyente, "Adoptado coincide con titular")
        exigir(
          fecha(a.inscripcionCivil).startsWith("2025-"),
          "Inscripción fuera de2025"
        )
        ref(a.normaConvenio)
        ref(a.asiento)
        unicos(a.titulares.map((t) => t.id))
        const propio = a.titulares.find((t) => t.id === h.contribuyente)
        exigir(
          propio !== undefined &&
            eur(propio.imponibleTotalCentimos).eq(renta(h)),
          "Censo adoptantes no concilia con bases propias"
        )
        const conDerecho = a.titulares.filter((t) =>
          eur(t.imponibleTotalCentimos).lte(80000)
        )
        exigir(
          a.titulares.length <= 2,
          "Más de dos adoptantes: concretar atribución"
        )
        exigir(
          !h.elecciones.some(
            (e) =>
              e.codigo === "andalucia_nacimiento_adopcion_acogimiento_menores"
          ),
          "Resolver elección adopción internacional/nacimiento art11"
        )
        total = total.plus(new D(600).div(conDerecho.length))
      }
      return total
    }
    case "andalucia_familia_numerosa": {
      const f = h.hechos
      limiteRenta(h, 25000)
      exigir(numerosa(f.familia, h), "Sin título de familia numerosa")
      exigir(
        !h.elecciones.some(
          (e) =>
            e.codigo === "andalucia_nacimiento_adopcion_acogimiento_menores"
        ),
        "Resolver elección familia numerosa/nacimiento art11"
      )
      unicos(f.rentasTitulares.map((t) => t.id))
      exigir(
        f.rentasTitulares.length === f.familia.titulares.length &&
          f.familia.titulares.every((id) =>
            f.rentasTitulares.some((t) => t.id === id)
          ),
        "Censo de rentas no concilia con titulares de familia numerosa"
      )
      const propio = f.rentasTitulares.find((t) => t.id === h.contribuyente)
      exigir(
        propio !== undefined && eur(propio.imponibleTotalCentimos).eq(renta(h)),
        "Renta propia no conciliada"
      )
      const elegibles = f.rentasTitulares.filter((t) =>
        eur(t.imponibleTotalCentimos).lte(25000)
      )
      return new D(f.familia.categoria === "especial" ? 400 : 200).times(
        titulares(
          elegibles.map((t) => t.id),
          h.contribuyente
        )
      )
    }
    case "andalucia_familia_monoparental_ascendientes_mayores_75": {
      const f = h.hechos
      limiteRenta(h, 80000)
      ref(f.tituloEstadoCivil)
      unicos(f.hijos.map((p) => p.persona))
      exigir(f.hijos.length > 0, "Familia sin hijos convivientes")
      for (const p of f.hijos) {
        exigir(p.persona !== h.contribuyente, "Hijo coincide con progenitor")
        ref(p.convivencia)
        if (edad(p.nacimiento) < 18)
          exigir(
            p.independenciaConsentida === "no",
            "Menor independiente con consentimiento"
          )
        else {
          exigir(p.grado >= 33, "Hijo mayor de edad sin discapacidad")
          ref(p.curatelaJudicial)
        }
      }
      unicos([
        ...f.hijos.map((p) => p.persona),
        ...f.ascendientes.map((m) => m.persona),
      ])
      let total = new D(100)
      for (const m of f.ascendientes) {
        const factor = minimo(m, h, "ascendiente")
        exigir(
          edad(m.nacimiento) > 75 && m.diasConvivencia >= 183,
          "Ascendiente sin edad/convivencia para incremento"
        )
        total = total.plus(new D(100).times(factor))
      }
      return total
    }
    case "andalucia_contribuyente_discapacidad": {
      const f = h.hechos
      limiteRenta(h, 25000)
      ref(f.titulo)
      exigir(
        fecha(f.fechaReconocimiento) <= h.devengo,
        "Reconocimiento discapacidad posterior a devengo"
      )
      exigir(
        f.grado >= 33 || f.asimilacion !== "ninguna",
        "Sin grado33 ni asimilación legal art3"
      )
      return new D(150)
    }
    case "andalucia_conyuge_pareja_discapacidad": {
      const f = h.hechos
      limiteRenta(h, 25000)
      exigir(
        f.persona !== h.contribuyente,
        "Cónyuge coincide con contribuyente"
      )
      ref(f.registroRelacion)
      ref(f.resolucion)
      exigir(f.grado >= 65, "Discapacidad de cónyuge inferior65")
      exigir(
        f.declaracionPropia === "no-presenta",
        "Cónyuge declara individual"
      )
      exigir(
        f.deduccionPropiaArt16 === "no-aplicada",
        "Cónyuge aplica deducción propia art16"
      )
      return new D(100)
    }
    case "andalucia_asistencia_personas_discapacidad": {
      const f = h.hechos
      limiteRenta(h, 80000)
      unicos(f.personas.map((p) => p.persona))
      let total = new D(0)
      for (const m of f.personas) {
        const factor = minimo(m, h)
        exigir(m.discapacidad >= 33, "Sin mínimo por discapacidad reconocido")
        total = total.plus(new D(100).times(factor))
      }
      let ss = new D(0)
      unicos(f.asistencia.map((a) => a.empleado))
      unicos(f.asistencia.flatMap((a) => a.cuotas.map((p) => p.id)))
      for (const a of f.asistencia) {
        const m = f.personas.find((p) => p.persona === a.persona)
        exigir(
          m !== undefined && m.asistencia !== "sin-incremento",
          "Sin mínimo de gastos de asistencia para persona"
        )
        ref(a.necesidadTerceros)
        ref(a.afiliacionAndalucia)
        exigir(
          a.titularTGSS === h.contribuyente,
          "Asistencia: contribuyente no titular TGSS"
        )
        incompatible(h, a.empleado, ["andalucia_ayuda_domestica"])
        ss = ss.plus(pagos(a.cuotas, h))
      }
      return total.plus(D.min(ss.times("0.20"), 500))
    }
    case "andalucia_ayuda_domestica": {
      const f = h.hechos
      ref(f.afiliacionAndalucia)
      ref(f.viviendaHabitual)
      exigir(
        f.eleccionBeneficiario === h.contribuyente,
        "Elección de beneficiario distinta de declarante"
      )
      const pareja = f.vinculoPareja !== "sin-pareja"
      if (pareja) {
        ref(f.personaPareja)
        ref(f.registroPareja)
        exigir(
          f.personaPareja !== h.contribuyente,
          "Pareja coincide con contribuyente"
        )
      }
      exigir(
        f.titularTGSS === h.contribuyente ||
          (pareja && f.titularTGSS === f.personaPareja),
        "Titular TGSS ajeno al hogar"
      )
      const mayores =
        edad(h.nacimiento) >= 75 || (pareja && edad(f.nacimientoPareja) >= 75)
      if (!mayores) {
        exigir(
          f.hijos.length > 0 &&
            f.trabajoTitularCentimos > 0 &&
            (!pareja || f.trabajoParejaCentimos > 0),
          "Vía hijos requiere mínimo y rendimientos laborales/actividad de ambos miembros"
        )
        for (const m of f.hijos) minimo(m, h, "descendiente")
      }
      incompatible(h, f.empleado, [
        "andalucia_asistencia_personas_discapacidad",
      ])
      return D.min(
        pagos(f.cuotas, { ...h, contribuyente: f.titularTGSS }).times("0.20"),
        500
      )
    }
    case "andalucia_alquiler_vivienda_habitual": {
      const f = h.hechos
      limiteRenta(h, 25000)
      ref(f.vivienda)
      ref(f.contrato)
      ref(f.arrendadorFiscal)
      ref(f.habitualidad)
      const disc = f.grado >= 33
      if (disc) ref(f.resolucionDiscapacidad)
      if (f.victima !== "ninguna") ref(f.tituloVictima)
      exigir(
        disc ||
          edad(h.nacimiento) < 35 ||
          edad(h.nacimiento) > 65 ||
          f.victima !== "ninguna",
        "Sin edad, discapacidad o condición de víctima habilitante"
      )
      return D.min(pagos(f.pagos, h).times("0.15"), disc ? 1500 : 1200)
    }
    case "andalucia_inversion_vivienda_habitual_protegida_jovenes": {
      const f = h.hechos
      limiteRenta(h, 25000)
      exigir(
        edad(h.nacimiento) < 35 || f.calificacionProtegida.trim().length > 0,
        "Vivienda sin calificación protegida y adquirente no menor35"
      )
      exigir(
        f.vivienda.operacion === "adquisicion" ||
          f.vivienda.operacion === "rehabilitacion",
        "Operación distinta adquisición/rehabilitación"
      )
      return baseVivienda(f.vivienda, h, false).times("0.06")
    }
    case "andalucia_inversion_acciones_participaciones_mercantiles": {
      const f = h.hechos
      unicos(f.inversiones.map((i) => i.pago.id))
      let general = new D(0),
        universidad = new D(0)
      for (const i of f.inversiones) {
        sociedad(i, "andalucia")
        exigir(
          i.operacion !== "aportacion-social",
          "Inversión no constitución/ampliación"
        )
        exigir(
          i.capitalFamiliarMaxPuntosBasicos <= 4000 &&
            i.votosFamiliarMaxPuntosBasicos <= 4000,
          "Capital/voto familiar supera40% en algún día2025"
        )
        ampliacionTresAnios(i)
        if (i.operacion === "constitucion") {
          exigir(
            i.empleadosJornadaCompleta >= 1,
            "Constitución sin empleado jornada completa desde primer ejercicio"
          )
          ref(i.referenciaContratosAlta)
        }
        const base = pagado(i.pago, h)
        if (i.universidadCentro.trim().length > 0) {
          ref(i.universidadCentro)
          universidad = universidad.plus(base.times("0.50"))
        } else general = general.plus(base.times("0.20"))
      }
      exigir(
        general.eq(0) || universidad.eq(0),
        "Inversiones mixtas general/universidad: precisar concurrencia de topes4000/12000 antes de agregar"
      )
      return general.gt(0) ? D.min(general, 4000) : D.min(universidad, 12000)
    }
  }
}
