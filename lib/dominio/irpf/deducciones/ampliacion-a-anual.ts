import { hechosConyugeAndalucia2025 } from "./andalucia-conyuge-anual-2025"
import { eleccionesTerritorialesB } from "./b-ampliado-anual-2025/conciliacion-lotes"
import { Schema } from "effect"
import type { MagnitudesTerritorialesAnuales } from "./anual-territorial"
import type { SolicitudDeduccionesTerritoriales2025 } from "./anual-territorial-esquemas"
import type { SolicitudAmpliacionAnualA2025 } from "./ampliacion-a-anual-esquemas"
import {
  evaluarAmpliacionLoteA2025,
  type ResultadoAmpliacion,
} from "./lote-a-ampliacion-2025"
import { eur, edad } from "./lote-a-ampliacion-2025/comun"
export type ContextoAmpliacionAnualA2025 = MagnitudesTerritorialesAnuales
const esLista = Schema.is(Schema.Array(Schema.Json))
const esObjeto = Schema.is(Schema.Record(Schema.String, Schema.Json))
const esTexto = Schema.is(Schema.String)
function exigir(condicion: boolean, motivo: string): asserts condicion {
  if (!condicion) throw new RangeError(motivo)
}
function finito(divisor: number): void {
  let d = divisor
  while (d > 0 && d % 2 === 0) d /= 2
  while (d > 0 && d % 5 === 0) d /= 5
  exigir(
    d === 1,
    "A40: reparto no decimal finito; transporte racional de esta rama pendiente, no se acepta un tercio aproximado"
  )
}
function gradoConciliado(grado: number, etiqueta: string): void {
  exigir(
    etiqueta ===
      (grado >= 65
        ? "Discapacidad65OMas"
        : grado >= 33
          ? "Discapacidad33a64"
          : "SinDiscapacidad"),
    "A40: discapacidad contradictoria con la anual"
  )
}
/** Inspección estructural tras Schema cerrado; las referencias no conceden derechos. */
function conciliarMinimos(
  datos: Schema.Json,
  m: ContextoAmpliacionAnualA2025
): void {
  if (esLista(datos)) {
    datos.forEach((d) => conciliarMinimos(d, m))
    return
  }
  if (!esObjeto(datos)) return
  exigir(
    datos.relacion !== "conyuge" && datos.relacion !== "pareja-inscrita",
    "A40: pareja sin datos personales y rentas anuales representados"
  )
  if (
    esTexto(datos.persona) &&
    ("inscripcionCivil" in datos ||
      "convivientes" in datos ||
      "referenciaCargo" in datos)
  )
    exigir(
      m.sujetosConMinimo.includes(datos.persona),
      "A40: causante familiar sin derecho anual conciliado"
    )
  if ("referenciaDerechos" in datos) {
    exigir(
      datos.clase === "descendiente",
      "A40: ascendientes sin representación anual; no se admite acreditar su mínimo con expediente externo"
    )
    exigir(
      esTexto(datos.persona) && esTexto(datos.nacimiento),
      "A40: mínimo sin sujeto concreto"
    )
    const sujeto = m.caso.derechosMinimos?.descendientes.find(
      (d) => d.sujetoId === datos.persona
    )
    const atribucion = m.atribucionesMinimo?.find(
      (a) => a.sujetoId === datos.persona
    )
    exigir(
      sujeto !== undefined &&
        atribucion !== undefined &&
        m.sujetosConMinimo.includes(datos.persona),
      "A40: sujeto sin mínimo anual atribuido"
    )
    exigir(
      datos.nacimiento === sujeto.fechaNacimiento,
      "A40: nacimiento de otro sujeto de mínimo"
    )
    exigir(
      esLista(datos.titulares) &&
        datos.titulares.length === atribucion.titulares.length &&
        atribucion.titulares.every(
          (id) => esLista(datos.titulares) && datos.titulares.includes(id)
        ),
      "A40: censo de titulares distinto del mínimo de ese sujeto"
    )
    const grado = Schema.decodeUnknownSync(Schema.Number)(datos.discapacidad)
    gradoConciliado(grado, sujeto.discapacidad._tag)
    if (datos.asistencia === "grado65")
      exigir(
        sujeto.discapacidad._tag === "Discapacidad65OMas",
        "A40: incremento65 sin discapacidad anual correspondiente"
      )
    if (
      datos.asistencia === "ayuda-terceros" ||
      datos.asistencia === "movilidad-reducida"
    )
      exigir(
        sujeto.discapacidad._tag === "Discapacidad65OMas" ||
          (sujeto.discapacidad._tag === "Discapacidad33a64" &&
            sujeto.discapacidad.necesitaAyudaOMovilidadReducida),
        "A40: asistencia no conciliada con derechosMinimos"
      )
  }
  for (const [campo, valor] of Object.entries(datos)) {
    if (campo === "hijosUnidadFamiliar" && esLista(valor))
      for (const id of valor)
        exigir(
          esTexto(id) && m.sujetosConMinimo.includes(id),
          "A40: hijo de unidad familiar sin derecho anual representado"
        )
    if (
      ["titulares", "convivientes", "declarantesConDerecho"].includes(campo) &&
      esLista(valor) &&
      valor.length > 0
    )
      finito(valor.length)
    if (campo === "horasTotales" && datos.clase === "escolar")
      finito(Schema.decodeUnknownSync(Schema.Number)(valor))
    conciliarMinimos(valor, m)
  }
}
function objetos(datos: Schema.Json): readonly string[] {
  if (esLista(datos)) return datos.flatMap(objetos)
  if (!esObjeto(datos)) return []
  const propios = [datos.persona, datos.empleado, datos.entidad].filter(esTexto)
  return [...propios, ...Object.values(datos).flatMap(objetos)]
}
function conciliarConvivientes(
  eventos: readonly { persona: string; convivientes: readonly string[] }[],
  m: ContextoAmpliacionAnualA2025
): void {
  for (const evento of eventos) {
    const familiar = m.caso.derechosMinimos?.descendientes.find(
      (d) => d.sujetoId === evento.persona
    )
    exigir(familiar !== undefined, "A40: evento sin sujeto familiar anual")
    const conocidos = familiar.titulares.filter(
      (t) =>
        t.residenteIrpf &&
        (t.relacion === "convivencia" || t.custodia === "compartida")
    )
    exigir(
      conocidos.every((t) => evento.convivientes.includes(t.titularId)),
      "A40: conviviente anual conocido omitido del reparto del evento"
    )
  }
}
export function evaluarAmpliacionAnualA2025(
  s: SolicitudAmpliacionAnualA2025,
  m: ContextoAmpliacionAnualA2025,
  solicitudes: SolicitudDeduccionesTerritoriales2025["solicitudes"]
): ResultadoAmpliacion {
  const contribuyente = m.caso.contribuyenteId
  exigir(contribuyente !== undefined, "A40: contribuyente anual obligatorio")
  exigir(
    edad(s.nacimiento) === m.caso.situacionFamiliar.edad,
    "A40: nacimiento propio contradictorio con edad anual"
  )
  const liquidables = m.basesLiquidables
  exigir(
    liquidables !== undefined,
    "A40: bases liquidables no suministradas por composición anual"
  )
  const componentes = m.componentesMinimoEstatal
  exigir(
    componentes !== undefined,
    "A40: mínimos estatales por componentes no suministrados por composición anual"
  )
  const hechos = Schema.decodeUnknownSync(Schema.Json)(s.hechos)
  if (s.codigo !== "andalucia_conyuge_pareja_discapacidad") conciliarMinimos(hechos, m)
  if (s.codigo !== "andalucia_conyuge_pareja_discapacidad" && "grado" in s.hechos)
    gradoConciliado(s.hechos.grado, m.caso.situacionFamiliar.discapacidad._tag)
  // Elecciones derivadas de los códigos realmente solicitados y su objeto, nunca listas externas.
  const elecciones = solicitudes.flatMap((p) => {
    // Aragón2 concilia operaciones por pago/justificante y entidad+escritura: no convierte toda la entidad en una elección de la misma inversión.
    if (p.lote === "A-aragon-dos") return []
    const codigo = "codigo" in p ? p.codigo : p.hechos.codigo
    const identificados = objetos(
      Schema.decodeUnknownSync(Schema.Json)(p.hechos)
    )
    return [...new Set([contribuyente, ...identificados])].map((objeto) => ({
      codigo,
      objeto,
    }))
  })
  // Mantener las elecciones A40 previas y añadir los sujetos/objetos del nuevo contrato B.
  const eleccionesB = eleccionesTerritorialesB(solicitudes.filter(p => p.lote === "B-ampliado"), contribuyente).map(e => ({ codigo: e.codigo, objeto: e.objeto }))
  const contexto = {
    ejercicio: 2025 as const,
    modalidad: "individual" as const,
    devengo: "2025-12-31" as const,
    contribuyente,
    nacimiento: s.nacimiento,
    elecciones: [...elecciones, ...eleccionesB],
    imponibleGeneralCentimos: { euros: m.baseGeneral.toFixed() },
    imponibleAhorroCentimos: { euros: m.baseAhorro.toFixed() },
    liquidableGeneralCentimos: { euros: liquidables.general.toFixed() },
    liquidableAhorroCentimos: { euros: liquidables.ahorro.toFixed() },
    minimoContribuyenteCentimos: { euros: componentes.contribuyente.toFixed() },
    minimoDescendientesCentimos: { euros: componentes.descendientes.toFixed() },
    minimoPersonalFamiliarCentimos: {
      euros: m.minimoPersonalFamiliar.toFixed(),
    },
  }
  switch (s.codigo) {
    case "andalucia_gastos_educativos": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "andalucia",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "andalucia_defensa_juridica_laboral": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "andalucia",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "andalucia_donativos_finalidad_ecologica": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "andalucia",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "andalucia_ejercicio_fisico_deporte": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "andalucia",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "andalucia_gastos_veterinarios_animales_compania_perros_asistencia": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "andalucia",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "andalucia_enfermedad_celiaca": {
      for (const persona of s.hechos.personas) {
        if (persona.relacion !== "minimo") continue
        const minimo = persona.minimo
        exigir(
          minimo !== null && minimo.persona === persona.persona,
          "A40: celiaquía sin mínimo del mismo sujeto"
        )
        exigir(
          persona.titulares.length === minimo.titulares.length &&
            minimo.titulares.every((id) => persona.titulares.includes(id)),
          "A40: titulares monetarios de celiaquía distintos del mínimo anual"
        )
      }
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "andalucia",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "andalucia_adopcion_internacional": {
      const adopciones = s.hechos.adopciones.map((a) => {
        exigir(
          a.titulares.length === 1 && a.titulares[0] === contribuyente,
          "A40: otros adoptantes requieren sus bases anuales no representadas"
        )
        return {
          ...a,
          titulares: [
            {
              id: contribuyente,
              imponibleTotalCentimos: {
                euros: eur({ euros: m.baseGeneral.toFixed() })
                  .plus(m.baseAhorro)
                  .toFixed(),
              },
            },
          ],
        }
      })
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "andalucia",
        codigo: s.codigo,
        hechos: { ...s.hechos, adopciones },
      })
    }
    case "andalucia_familia_numerosa": {
      exigir(
        s.hechos.familia.titulares.length === 1 &&
          s.hechos.familia.titulares[0] === contribuyente,
        "A40: familia numerosa con otros titulares requiere sus bases anuales no representadas"
      )
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "andalucia",
        codigo: s.codigo,
        hechos: {
          ...s.hechos,
          rentasTitulares: [
            {
              id: contribuyente,
              imponibleTotalCentimos: {
                euros: eur({ euros: m.baseGeneral.toFixed() })
                  .plus(m.baseAhorro)
                  .toFixed(),
              },
            },
          ],
        },
      })
    }
    case "andalucia_familia_monoparental_ascendientes_mayores_75": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "andalucia",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "andalucia_contribuyente_discapacidad": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "andalucia",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "andalucia_conyuge_pareja_discapacidad": {
      const imponibles = m.basesImponiblesE38
      exigir(imponibles !== undefined, "Andalucía art17: faltan bases imponibles propias antes de reducciones de base")
      return evaluarAmpliacionLoteA2025({ ...contexto, territorio: "andalucia", codigo: s.codigo,
        imponibleGeneralCentimos: { euros: imponibles.general.toFixed() },
        imponibleAhorroCentimos: { euros: imponibles.ahorro.toFixed() },
        hechos: hechosConyugeAndalucia2025(s, m) })
    }
    case "andalucia_asistencia_personas_discapacidad": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "andalucia",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "andalucia_ayuda_domestica": {
      exigir(
        s.hechos.vinculoPareja === "sin-pareja" &&
          s.hechos.personaPareja === "",
        "A40: ayuda doméstica con pareja requiere ingresos y datos personales anuales de esa persona"
      )
      const rentas = m.rentasTrabajoAnuales
      exigir(
        rentas !== undefined,
        "A40: ingresos propios de ayuda doméstica no derivables en este perfil"
      )
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "andalucia",
        codigo: s.codigo,
        hechos: {
          ...s.hechos,
          trabajoTitularCentimos: { euros: rentas.integroTrabajo.toFixed() },
          trabajoParejaCentimos: 0,
        },
      })
    }
    case "andalucia_alquiler_vivienda_habitual": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "andalucia",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "andalucia_inversion_vivienda_habitual_protegida_jovenes": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "andalucia",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "andalucia_inversion_acciones_participaciones_mercantiles": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "andalucia",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "aragon_nacimiento_adopcion_hijo_discapacidad_33": {
      conciliarConvivientes(s.hechos.eventos, m)
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "aragon_adopcion_internacional": {
      conciliarConvivientes(s.hechos.eventos, m)
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "aragon_nacimiento_adopcion_tercer_hijo_sucesivos": {
      conciliarConvivientes(s.hechos.eventos, m)
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "aragon_primer_segundo_hijo_poblaciones_menos_10000": {
      conciliarConvivientes(s.hechos.eventos, m)
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "aragon_libros_texto_material_escolar": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "aragon_clases_apoyo_refuerzo": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "aragon_formacion_autonomia_menores_discapacidad": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "aragon_guarderia_menores_3": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "aragon_mayores_70": {
      const rentas = m.rentasTrabajoAnuales
      exigir(
        rentas !== undefined && rentas.restoRentas.isZero(),
        "A40: mayores70 requiere composición de categorías de renta; sólo trabajo sin otras rentas en este perfil"
      )
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: {
          ...s.hechos,
          rendimientosTrabajoCentimos: {
            euros: rentas.integroTrabajo.toFixed(),
          },
          rendimientosActividadCentimos: 0,
          gananciasNoTransmisionCentimos: 0,
          otrosNoCapital: "",
        },
      })
    }
    case "aragon_residencia_determinados_municipios": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "aragon_cuidado_personas_dependientes": {
      const dependientes = s.hechos.dependientes.map((d) => {
        exigir(
          d.vinculo !== "ascendiente" && m.sujetosConMinimo.includes(d.persona),
          "A40: dependiente sin identidad/derecho anual representado"
        )
        const sujeto = m.caso.derechosMinimos?.descendientes.find(
          (p) => p.sujetoId === d.persona
        )
        exigir(
          sujeto !== undefined && sujeto.fechaNacimiento === d.nacimiento,
          "A40: dependiente con nacimiento no conciliado"
        )
        gradoConciliado(d.gradoDiscapacidad, sujeto.discapacidad._tag)
        const atribucion = m.atribucionesMinimo?.find(
          (a) => a.sujetoId === d.persona
        )
        exigir(
          atribucion !== undefined &&
            atribucion.titulares.length === d.cuidadores.length &&
            d.cuidadores.every((p) => atribucion.titulares.includes(p.id)),
          "A40: cuidadores distintos de la atribución efectiva del sujeto"
        )
        exigir(
          d.cuidadores.every((p) => p.id === contribuyente),
          "A40: cuidadores de otras personas requieren rentas anuales no representadas"
        )
        return {
          ...d,
          rentasNoExentasCentimos: sujeto.rentasNoExentasCentimos,
          cuidadores: d.cuidadores.map((p) => {
            const titular = sujeto.titulares.find((t) => t.titularId === p.id)
            exigir(
              titular !== undefined,
              "A40: cuidador sin rentas conciliadas en derechosMinimos"
            )
            return {
              ...p,
              rentasNoExentasCentimos: titular.rentasNoExentasCentimos,
            }
          }),
        }
      })
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: { ...s.hechos, dependientes },
      })
    }
    case "aragon_donaciones_ecologicas_idi": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: {
          ...s.hechos,
          cuotaIntegraAutonomicaCentimos: {
            euros: m.cuotaAutonomica.toFixed(),
          },
        },
      })
    }
    case "aragon_vivienda_nucleos_rurales": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "aragon_vivienda_victimas_terrorismo": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "aragon_arrendamiento_dacion_pago": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "aragon_inversion_acciones_mab": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "aragon_inversion_economia_social": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "aragon",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "cataluna_rehabilitacion_vivienda_habitual": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "catalunya",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "cataluna_tramo_autonomico_inversion_vivienda_habitual": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "catalunya",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "cataluna_angel_inversor": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "catalunya",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "cataluna_alquiler_vivienda_habitual": {
      exigir(
        s.hechos.declarantesConDerecho.length === 1 &&
          s.hechos.declarantesConDerecho[0] === contribuyente,
        "A40: alquiler consolidado de otras personas requiere su caso anual; no se suman gastos de otros declarantes"
      )
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "catalunya",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "cataluna_alquiler_victimas_violencia_machista": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "catalunya",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "cataluna_inversion_cooperativas_agrarias_vivienda": {
      return evaluarAmpliacionLoteA2025({
        ...contexto,
        territorio: "catalunya",
        codigo: s.codigo,
        hechos: s.hechos,
      })
    }
    case "cataluna_obligacion_declarar_mas_de_un_pagador": {
      const libro = m.pagadoresCatalunya2025
      exigir(libro !== undefined && libro.titular === contribuyente && libro.referenciaCenso === s.hechos.referenciaCenso,
        "A40: pagadores requieren el perfil efectivo conciliado Catalunya2025; no aceptar totales/certificación fiscal externos")
      exigir(m.rentasTrabajoAnuales !== undefined && m.rentasTrabajoAnuales.integroTrabajo.eq(libro.integro) && m.rentasTrabajoAnuales.restoRentas.isZero(),
        "A40: pagadores con otras rentas o íntegro anual contradictorio")
      exigir(m.cuotaEstatal681 !== undefined, "A40: cuota estatal íntegra interna ausente")
      return evaluarAmpliacionLoteA2025({
        ...contexto, territorio: "catalunya", codigo: s.codigo,
        hechos: {
          cuotaIntegraAutonomicaCentimos: { euros: m.cuotaAutonomica.toFixed() },
          cuotaIntegraEstatalCentimos: { euros: m.cuotaEstatal681.toFixed() },
          pagadores: libro.pagadores,
          otrasRentasCentimos: 0, altaAutonomo2025: "no", otrasCausasObligacion: [],
        },
      })
    }
  }
}
