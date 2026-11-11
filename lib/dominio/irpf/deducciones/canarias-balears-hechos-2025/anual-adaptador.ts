import { conciliarAnticipoNacimientoC36 } from "./anual-nacimiento-anticipo"
import { producirHistoriaAdquisicionCanarias2025 } from "./anual-vivienda-historia"
import { comprobarAusenciaInversionAlquilerC36 } from "./anual-alquiler-derechos"
import { ingresoRegionalIdentificado2025 } from "../../ingresos-identificados-2025/regiones"
import { producirCuotasHogarC36 } from "./anual-hogar"
import { conciliarInmuebleP4a, evaluarPrimerAlquiler2025 } from "../../inmobiliario-2025/consumidores"
import { Schema } from "effect"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { fecha, unico } from "./comun"
import type { ResultadoAmpliacionC, MinimoC } from "./ampliacion-comun"
import { comprobar, eurosC, ceroC } from "./ampliacion-comun"
import { evaluarDonacionesAmpliacionC } from "./donaciones-ampliacion"
import {
  evaluarViviendaAmpliacionC,
  type ViviendaC,
} from "./vivienda-ampliacion"
import {
  evaluarFamiliaEstudiosAmpliacionC,
  type PersonaFamiliaC,
} from "./familia-estudios-ampliacion"
import {
  evaluarInversionAmpliacionC,
  evaluarAutoocupacionAmpliacionC,
  evaluarPlazasAmpliacionC,
  evaluarEmergenciaAmpliacionC,
} from "./inversion-trabajo-ampliacion"
import {
  DonacionesC36,
  ViviendaC36,
  FamiliaC36,
  InversionC36,
  AutoocupacionC36,
  PlazasC36,
  EmergenciaC36,
  type SolicitudAnualC36,
  type EstudioC36,
} from "./anual-esquemas"
import {
  sujetoC36,
  censoC36,
  familiarC36,
  minimoC36,
  progenitoresC36,
  conciliarNacimientoPropioC36,
  contextoC36,
  magnitudesC36,
  conciliarPagoC36,
  necesarioC36,
} from "./anual-productores"

const esLista = Schema.is(Schema.Array(Schema.Json))
const esObjeto = Schema.is(Schema.Record(Schema.String, Schema.Json))
const esTexto = Schema.is(Schema.String)
/** Sólo documentos monetarios: un título familiar común no es un gasto reutilizado. */
export function registrarMonetariosC36(
  s: SolicitudAnualC36,
  vistos: Set<string>,
  m?: MagnitudesTerritorialesAnuales,
): void {
  const locales = new Set<string>()
  function alta(id: string) {
    comprobar(
      !locales.has(id) && !vistos.has(id),
      "C36: pago o documento monetario reutilizado: " + id
    )
    locales.add(id)
  }
  function recorrer(x: Schema.Json): void {
    if (esLista(x)) {
      x.forEach(recorrer)
      return
    }
    if (!esObjeto(x)) return
    if (esTexto(x.id) && esTexto(x.importe)) {
      alta(x.id)
      if (esTexto(x.factura)) {
        const partida = m?.inmueblesP4a?.flatMap(r => r.inmueble.gastos)
          .find(g => g.id === x.id && g.factura === x.factura && g.prestadorNif === x.perceptor)
        alta("documento-monetario:" + (partida === undefined ? x.factura : [partida.prestadorNif, partida.factura, partida.lineaFactura].map(valor => `${valor.length}:${valor}`).join("")))
      }
    }
    if (esTexto(x.aportacion) && esTexto(x.id) && esTexto(x.escritura)) {
      alta(x.id)
      alta("documento-monetario:" + x.escritura)
    }
    if (esTexto(x.modalidad) && esTexto(x.certificado))
      alta("documento-monetario:" + x.certificado)
    if (
      esTexto(x.documentoValoracion) &&
      x.documentoValoracion !== "" &&
      x.modalidad !== "dinero"
    )
      alta("documento-monetario:" + x.documentoValoracion)
    Object.values(x).forEach(recorrer)
  }
  if (Schema.is(ViviendaC36)(s) && s.codigo === "canarias_inversion_vivienda_habitual") {
    // El libro patrimonial referencia el mismo pago; no es otra aplicación.
    // El productor concilia ID, importe, fecha y factura antes de calcular.
    const { historiaAdquisicion, ...hechos } = s.hechos
    void historiaAdquisicion
    recorrer(Schema.decodeUnknownSync(Schema.Json)(hechos))
  } else if (Schema.is(ViviendaC36)(s) && s.codigo === "balears_arrendamiento_vivienda_habitual") {
    // El censo DT18 referencia los pagos y movimientos de la misma persona.
    // Conciliación integral y anti-duplicación en alquiler-dt18-balears.ts.
    const { derechoInversionAlquiler, ...hechos } = s.hechos
    void derechoInversionAlquiler
    recorrer(Schema.decodeUnknownSync(Schema.Json)(hechos))
  } else recorrer(Schema.decodeUnknownSync(Schema.Json)(s.hechos))
  locales.forEach((id) => vistos.add(id))
}
export function prioridadC36(s: {
  readonly lote: string
  readonly codigo?: string
}): number {
  return s.lote === "C36" &&
    (s.codigo === "balears_nacimiento" || s.codigo === "balears_adopcion")
    ? 0
    : 1
}
export function validarEleccionesC36(plan: readonly SolicitudAnualC36[]): void {
  comprobar(
    !(
      plan.some((s) => s.codigo === "balears_fomento_lengua_catalana") &&
      plan.some(
        (s) => s.codigo === "balears_mecenazgo_cultural_cientifico_tecnologico"
      )
    ),
    "C36: incompatibilidad declarativa arts5bis/5quater balear; debe elegirse una deducción, también con beneficiarios distintos"
  )
}
export function evaluarAnualC36(
  s: SolicitudAnualC36,
  m: MagnitudesTerritorialesAnuales,
  plan: readonly SolicitudAnualC36[]
): ResultadoAmpliacionC {
  const h = contextoC36(m),
    a = magnitudesC36(m),
    id = sujetoC36(m)
  comprobar(
    (s.codigo.startsWith("canarias_") ? "canarias" : "illes-balears") ===
      h.territorio,
    "C36: código de otro territorio"
  )
  if (Schema.is(DonacionesC36)(s)) {
    const donaciones = s.hechos.donaciones.map((d) => {
      d.pagos.forEach((p) => conciliarPagoC36(m, p))
      let aportacion2023 = "",
        aportacion2024 = ""
      if (s.codigo === "canarias_donaciones_entidades_sin_animo_lucro") {
        comprobar(
          s.hechos.censoHistoria2023Y2024 === "completo",
          "C36 art4ter: falta censo completo de recibos2023/2024"
        )
        const historia = necesarioC36(
          s.hechos.historiaDonativos,
          "C36 art4ter: faltan recibos históricos, no se presupone reiteración"
        ).filter((p) => p.entidad === d.entidad.nif)
        historia.forEach((p) => {
          fecha(p.fecha)
          comprobar(
            p.fecha >= "2023-01-01" && p.fecha <= "2024-12-31",
            "C36: recibo histórico fuera de2023/2024"
          )
        })
        // Ceros constructivos sólo por ausencia en un censo de recibos completo,
        // nunca importes aplicados declarados ni una historia fiscal inventada.
        const q23 = historia
          .filter((p) => p.fecha.startsWith("2023-"))
          .reduce((q, p) => q.sumar(eurosC(p.importe)), ceroC())
        const q24 = historia
          .filter((p) => p.fecha.startsWith("2024-"))
          .reduce((q, p) => q.sumar(eurosC(p.importe)), ceroC())
        // Todos los recibos son de céntimos: sus sumas tienen expansión finita.
        const decimal = (q: typeof q23) => {
          const c = (q.n * 100n) / q.d
          return (
            (c / 100n).toString() + "." + (c % 100n).toString().padStart(2, "0")
          )
        }
        aportacion2023 = decimal(q23)
        aportacion2024 = decimal(q24)
      }
      const otras: ("art3" | "art4bis" | "art5bis")[] = []
      for (const solicitud of plan) {
        if (solicitud === s || !Schema.is(DonacionesC36)(solicitud)) continue
        if (
          !solicitud.hechos.donaciones.some(
            (x) => x.entidad.nif === d.entidad.nif
          )
        )
          continue
        if (solicitud.codigo === "canarias_donaciones_finalidad_ecologica")
          otras.push("art3")
        if (
          solicitud.codigo ===
          "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia"
        )
          otras.push("art4bis")
        if (
          solicitud.codigo ===
          "balears_mecenazgo_cultural_cientifico_tecnologico"
        )
          otras.push("art5bis")
      }
      return {
        ...d,
        donante: id,
        aportacion2023,
        aportacion2024,
        otrasDeduccionesMismoBeneficiario: otras,
      }
    })
    return evaluarDonacionesAmpliacionC(
      {
        ...h,
        codigo: s.codigo,
        donaciones,
        ordenTramoInicial: s.hechos.ordenTramoInicial,
      },
      a
    )
  }
  if (Schema.is(ViviendaC36)(s)) {
    conciliarNacimientoPropioC36(m, s.hechos.nacimientoContribuyente)
    comprobar(s.codigo === "balears_arrendamiento_vivienda_habitual" || s.hechos.derechoInversionAlquiler === undefined,
      "T06_CODIGO_AJENO: hechos de derecho sólo para alquiler balear")
    const historiaInversion = s.codigo === "canarias_inversion_vivienda_habitual"
      ? producirHistoriaAdquisicionCanarias2025(s, m)
      : undefined
    comprobar(s.hechos.historiaAdquisicion === undefined || historiaInversion !== undefined, "C36: historia de adquisición ajena al código")
    if (s.codigo === "canarias_puesta_viviendas_mercado_arrendamiento" || s.codigo === "balears_arrendador_vivienda_permanente_otros_gastos") {
      s.hechos.viviendas.forEach(v => v.gastos.forEach(p => conciliarPagoC36(m, p)))
      return evaluarPrimerAlquiler2025(s, m)
    }
    const derechoAlquiler = s.codigo === "balears_arrendamiento_vivienda_habitual"
      ? comprobarAusenciaInversionAlquilerC36(s, m, plan) : undefined
    const viviendas = s.hechos.viviendas.map((v): ViviendaC => {
      if (s.codigo === "canarias_arrendamiento_dacion_pago")
        comprobar(
          necesarioC36(
            v.dacion,
            "C36: dación documentada ausente"
          ).acreedor.trim() !== "",
          "C36: acreedor de dación no identificado"
        )
      const requiereP4a = s.codigo === "canarias_adecuacion_inmueble_arrendamiento" ||
        (s.codigo === "balears_mejora_sostenibilidad_vivienda" && (m.inmueblesP4a !== undefined || v.uso !== "habitual_propia"))
      const producidoP4a = requiereP4a ? conciliarInmuebleP4a(m, v) : undefined
      if (s.codigo === "balears_mejora_sostenibilidad_vivienda" && producidoP4a !== undefined)
        comprobar(producidoP4a.inmueble.ubicacion === "illes-balears", "P4a: la inversión balear requiere inmueble situado en Illes Balears")
      comprobar(
        v.ocupacionIlegal?.situacion !== "suspension_vulnerabilidad" ||
          s.codigo !==
            "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento",
        "C36 suspensión: falta productor de saldo dudoso deducible en2025; no se sustituye por cero"
      )
      v.gastos.forEach((p) => conciliarPagoC36(m, p))
      const propietarios =
        v.derecho === "arrendatario"
          ? (v.propietarios ?? [])
          : necesarioC36(
              v.propietarios,
              "C36: falta censo completo de propiedad"
            )
      unico(propietarios.map((p) => p.persona))
      propietarios.forEach((p) =>
        comprobar(p.titulo.trim() !== "", "C36: título de propiedad ausente")
      )
      if (v.derecho !== "arrendatario")
        comprobar(
          propietarios
            .reduce((q, p) => q.sumar(eurosC(p.porcentaje)), ceroC())
            .comparar(eurosC("100")) === 0n,
          "C36: censo de propiedad incompleto"
        )
      const propietario = propietarios.find((p) => p.persona === id)
      const porcentaje =
        v.derecho === "arrendatario"
          ? "100"
          : necesarioC36(propietario, "C36: sujeto sin título de propiedad")
              .porcentaje
      if (v.alquiler !== undefined && v.derecho === "arrendatario")
        comprobar(
          v.alquiler.arrendatario === id,
          "C36: arrendatario distinto del sujeto anual"
        )
      if (s.codigo === "balears_arrendamiento_traslado_laboral")
        comprobar(
          v.derecho === "arrendatario" && v.alquiler?.arrendatario === id && v.alquiler.arrendador !== id,
          "C36: traslado requiere arrendatario contractual y arrendador distinto"
        )
      if (
        s.codigo === "canarias_rehabilitacion_energetica_vivienda" ||
        s.codigo === "balears_mejora_sostenibilidad_vivienda"
      ) {
        necesarioC36(v.certificadoAntes, "C36: falta certificado anterior")
        necesarioC36(v.certificadoDespues, "C36: falta certificado posterior")
      }
      if (
        s.codigo ===
        "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento"
      )
        necesarioC36(v.ocupacionIlegal, "C36: falta resolución de ocupación")
      const alquiler = v.alquiler
      // El puerto histórico vacío sólo se usa en ramas que NO leen históricos.
      // Las ramas sin productor se rechazan arriba, no reciben ceros fiscales.
      return {
        ...v,
        gastos: historiaInversion?.gastosElegibles ?? v.gastos,
        porcentaje,
        ocupacionIlegal: v.ocupacionIlegal ?? {
          situacion: "ocupacion",
          resolucion: "",
        },
        persona: id,
        territorio: historiaInversion?.ubicacion ?? h.territorio,
        nacimientoContribuyente: s.hechos.nacimientoContribuyente,
        habitualDesde: v.habitualDesde ?? "",
        adquisicion: v.adquisicion ?? "",
        ocupacion: v.ocupacion ?? "",
        finObras: v.finObras ?? "",
        titulares: propietarios.map((p) => p.persona),
        proteccionPatrimonial: v.proteccionPatrimonial ?? "",
        autorizacionObras: v.autorizacionObras ?? "",
        certificadoAntes: v.certificadoAntes ?? {
          registro: "",
          calificacion: "G",
        },
        certificadoDespues: v.certificadoDespues ?? {
          registro: "",
          calificacion: "G",
        },
        discapacidad: {
          persona: id,
          nacimiento: s.hechos.nacimientoContribuyente,
          grado: gradoPropio(m),
          parentesco: "propio",
          rentaNoExenta: h.baseGeneral,
          convivenciaDesde: "2025-01-01",
          convivenciaHasta: h.devengo,
          certificadoNecesidad: v.certificadoNecesidadAccesibilidad ?? "",
        },
        alquiler: {
          arrendador: alquiler?.arrendador ?? "",
          arrendatario: alquiler?.arrendatario ?? "",
          desde: alquiler?.desde ?? "",
          hasta: alquiler?.hasta ?? "",
          fianza: alquiler?.fianza ?? "",
          rentaMensual: alquiler?.rentaMensual ?? "",
          superficieUtil: alquiler?.superficieUtil ?? "",
          rendimiento: producidoP4a?.categoria ?? "no_aplica_arrendatario",
          repercusionObras: alquiler?.repercusionObras ?? "",
          programa: alquiler?.programa ?? "ordinario",
          parientesGrado: alquiler?.parientesGrado ?? 0,
          islaOrigen: alquiler?.islaOrigen ?? "",
          islaDestino: alquiler?.islaDestino ?? "",
          relacionLaboralAntes: alquiler?.relacionLaboralAntes ?? "",
          relacionLaboralDespues: alquiler?.relacionLaboralDespues ?? "",
        },
        historial: {
          alquileres2023: v.historiaContratos
            .filter((c) => c.desde <= "2023-12-31" && c.hasta >= "2023-01-01")
            .map((c) => c.id),
          alquileres2024: v.historiaContratos
            .filter((c) => c.desde <= "2024-12-31" && c.hasta >= "2024-01-01")
            .map((c) => c.id),
          imputacion2024: "no",
          aplicacionesPrevias: [],
        },
        colectivo: {
          discapacidad: gradoPropio(m),
          resolucion: "",
          familia: "ordinaria",
          titulo: "",
          altaRETA: [],
          actividad: "ninguna",
          minimoDiscapacidad: "",
        },
        otrasViviendas: [],
        dacion: v.dacion ?? {
          fecha: "",
          escritura: "",
          acreedor: "",
          deudaExtinguida: "",
        },
      }
    })
    const resultadoVivienda = evaluarViviendaAmpliacionC(
      { ...h, codigo: s.codigo, viviendas },
      a,
      historiaInversion?.historico ?? { calculoId: a.calculoId, ejercicio: 2025, viviendas:
        s.codigo === "balears_arrendamiento_vivienda_habitual"
          ? viviendas.map(v => ({ catastro: v.catastro, persona: id,
            // Magnitudes ajenas a art3bis; el derecho se deriva de hechos arriba.
            pagadoHasta2024: "0", inversionesAnterioresDeducidas: "0",
            gananciaExentaReinvertida: "0", saldoDudosoCobroDeducible2025: "0",
            deduccionesInversionConDerecho: derechoAlquiler?.conDerecho === true ? ["estatal_DT18_adquisicion"] : [],
          })) : [] }
    )
    if (derechoAlquiler !== undefined && resultadoVivienda.estado === "calculo_parcial") {
      const b = derechoAlquiler.baseDerecho
      const rastro = [...resultadoVivienda.rastro,
        "T06_ART3BIS1B_EXCEPCION_RENTA_P4A: título propio con rendimientos integrados; no hay dos habituales simultáneas",
        `T06_DT18_PRODUCTOR baseCentimos=${b.n}/${b.d}; derecho=${derechoAlquiler.conDerecho}; eleccion=${derechoAlquiler.eleccion}`,
        derechoAlquiler.conDerecho ? "T06_ART3BIS1C_EXCLUIDO: derecho material DT18, independiente de elección y cuota" : "T06_ART3BIS1C_SIN_DERECHO: base material nula por hechos, sin usar elección ni cuota"]
      return { ...resultadoVivienda, rastro }
    }
    return resultadoVivienda
  }
  if (Schema.is(FamiliaC36)(s)) return evaluarFamiliaAnualC36(s, m)
  if (Schema.is(InversionC36)(s)) {
    const inversiones = s.hechos.inversiones.map((i) => {
      comprobar(
        i.fecha >= "2025-01-01" && i.fecha <= "2025-12-31",
        "C36 inversión anterior: falta productor de aplicaciones2023/2024; no se inventa remanente"
      )
      i.participaciones.forEach((p) =>
        p.tenedores.forEach((t) => {
          if (t.relacion === "propio")
            comprobar(t.persona === id, "C36: inversor no conciliado")
          else {
            comprobar(
              t.relacion !== "conyuge",
              "C36: cónyuge del grupo inversor no representado por anual"
            )
            const d = familiarC36(m, t.persona)
            comprobar(
              d.titulares.some(
                (v) => v.titularId === id && v.grado === t.grado
              ),
              "C36: parentesco del grupo inversor incompatible con núcleo v4"
            )
          }
        })
      )
      return { ...i, persona: id }
    })
    // Para una inversión nacida en2025, aplicación2023/2024 es jurídicamente
    // imposible. Es un cero derivado de fecha/escritura, no un histórico omitido.
    const operaciones = inversiones.map((i) => ({
      id: i.id,
      aplicado2023: "0",
      aplicado2024: "0",
    }))
    return evaluarInversionAmpliacionC(
      { ...h, codigo: s.codigo, inversiones },
      a,
      { calculoId: a.calculoId, ejercicio: 2025, operaciones }
    )
  }
  if (Schema.is(AutoocupacionC36)(s))
    return evaluarAutoocupacionAmpliacionC(
      {
        ...h,
        codigo: s.codigo,
        altas: s.hechos.altas.map((v) => ({ ...v, persona: id })),
      },
      a
    )
  if (Schema.is(PlazasC36)(s)) {
    s.hechos.gastos.forEach((p) => conciliarPagoC36(m, p))
    return evaluarPlazasAmpliacionC(
      {
        ...h,
        codigo: s.codigo,
        destinos: s.hechos.destinos.map((v) => ({ ...v, persona: id })),
        gastos: s.hechos.gastos,
      },
      a
    )
  }
  if (Schema.is(EmergenciaC36)(s)) {
    const { ingreso, tipos } = ingresoRegionalIdentificado2025(m, s.hechos.ingresoId, "balears-d33-2018-art3_2e-cobro2025")
    const totalTipo = eurosC(tipos.estatal).sumar(eurosC(tipos.autonomico))
    return evaluarEmergenciaAmpliacionC({ ...h, codigo: s.codigo, ayudas: [{
      id: ingreso.ayudaId, persona: id, concedente: "comunidad_illes_balears",
      acuerdoConsejoMinistros: "Consejo de Ministros 2018-10-19", resolucion: ingreso.resolucion.referencia,
      importeRecibido: ingreso.cobros[0]!.euros,
    }] }, a, { calculoId: a.calculoId, ejercicio: 2025,
      tipoMedioGravamen: { numerador: totalTipo.n.toString(), denominador: (totalTipo.d * 100n).toString() },
      ayudasIntegradas: [{ ayudaId: ingreso.ayudaId, persona: id, incluidaBaseImponibleGeneral: ingreso.integradoBaseGeneral, incluidaBaseLiquidable: ingreso.integradoBaseLiquidable }],
    })
  }
  throw new RangeError("C36: solicitud no representada")
}
function gradoPropio(m: MagnitudesTerritorialesAnuales): number {
  return m.caso.situacionFamiliar.discapacidad._tag === "Discapacidad65OMas"
    ? 65
    : m.caso.situacionFamiliar.discapacidad._tag === "Discapacidad33a64"
      ? 33
      : 0
}

function evaluarFamiliaAnualC36(
  s: typeof FamiliaC36.Type,
  m: MagnitudesTerritorialesAnuales
): ResultadoAmpliacionC {
  const h = contextoC36(m),
    a = magnitudesC36(m),
    id = sujetoC36(m),
    f = s.hechos.contribuyente,
    censo = censoC36(m)
  conciliarNacimientoPropioC36(m, f.nacimientoContribuyente)
  comprobar(
    s.hechos.filiacionAdopcion === undefined || s.codigo === "balears_adopcion",
    "C36: filiación de adopción ajena a la solicitud"
  )
  comprobar(
    s.hechos.registroPartoMultiple === undefined || s.codigo === "balears_nacimiento",
    "C36: registro de parto ajeno a la solicitud"
  )
  comprobar(s.hechos.cuotasHogar.length === 0,
    "C36 hogar: cuotas legadas sin hechos primarios; use registroHogar")
  const hogar = s.codigo === "canarias_cuotas_seguridad_social_empleados_hogar"
  comprobar(hogar || s.hechos.registroHogar === undefined,
    "C36 asistencia: falta productor de ayuda efectiva de terceros y separación de supuestos/renta art16quater; cuotas no habilitadas")
  const cuotasHogar = hogar ? producirCuotasHogarC36(s.hechos.registroHogar, m) : []
  unico(s.hechos.censoDescendientes)
  comprobar(
    s.hechos.censoDescendientes.length === censo.length &&
      censo.every((d) => s.hechos.censoDescendientes.includes(d.sujetoId)),
    "C36: censo anual de descendientes omitido o incompleto"
  )
  unico(s.hechos.personas.map((p) => p.id))
  comprobar(
    f.otrosConvivientes.every((p) => censo.some((d) => d.sujetoId === p)),
    "C36 monoparental: conviviente externo sin representación anual; ascendientes/cónyuges no habilitados por etiquetas"
  )
  if (s.codigo === "balears_adopcion") {
    for (const p of s.hechos.personas) {
      const d = familiarC36(m, p.id)
      minimoC36(m, p.id)
      const v = d.titulares.find((t) => t.titularId === id)?.vinculo
      comprobar(
        v?.clase === "adopcion",
        "C36: adopción incompatible con vínculo v4"
      )
      const constitucion = necesarioC36(
        v.fechaConstitucionVinculo,
        "C36: falta fecha constitutiva de adopción en v4"
      )
      const inscripcion = necesarioC36(
        p.inscripcionCivil,
        "C36: falta inscripción civil de adopción"
      )
      fecha(inscripcion)
      comprobar(
        constitucion <= inscripcion &&
          inscripcion >= "2025-01-01" &&
          inscripcion <= "2025-12-31" &&
          v.fechaInicioIncremento <= inscripcion,
        "C36: fechas de adopción incompatibles con núcleo v4"
      )
    }
    const filiacion = necesarioC36(
      s.hechos.filiacionAdopcion,
      "C36 adopción: falta productor de exclusión documentada de hijo del cónyuge/pareja"
    )
    // Perfil deliberadamente único: no ordenar adopciones históricas por DOB,
    // ni inferir el derecho autonómico de un segundo adoptante del mínimo.
    comprobar(
      censo.length === 1 && s.hechos.personas.length === 1,
      "C36 adopción: sólo hijo único; orden de otros hijos fuera de alcance"
    )
    const p = s.hechos.personas[0]
    const d = familiarC36(m, p.id)
    const v = d.titulares.find((t) => t.titularId === id)?.vinculo
    comprobar(
      progenitoresC36(d).length === 1 &&
        minimoC36(m, p.id).titulares.length === 1,
      "C36 adopción: segundo adoptante/derecho ajeno fuera de alcance"
    )
    fecha(filiacion.fechaConstitucion)
    comprobar(
      filiacion.documento.trim() !== "" &&
        filiacion.hijo === p.id && v?.clase === "adopcion" &&
        filiacion.fechaConstitucion === v.fechaConstitucionVinculo &&
        filiacion.fechaConstitucion.startsWith("2025-"),
      "C36 adopción: filiación ajena o constitución fuera de 2025"
    )
    unico(filiacion.progenitoresPrevios)
    unico(filiacion.conyugesOParejas)
    comprobar(
      [...filiacion.progenitoresPrevios, ...filiacion.conyugesOParejas]
        .every((p) => p.trim() !== "" && p !== id && p !== d.sujetoId),
      "C36 adopción: identidad imposible en filiación/pareja"
    )
    comprobar(
      p.progenitorPrevio === undefined ||
        filiacion.progenitoresPrevios.includes(p.progenitorPrevio),
      "C36 adopción: progenitor previo contradictorio con registro"
    )
    comprobar(
      !filiacion.progenitoresPrevios.some((p) => filiacion.conyugesOParejas.includes(p)),
      "C36 adopción: hijo del cónyuge/pareja excluido"
    )
    comprobar(
      s.hechos.registroCobrosNacimiento === undefined,
      "C36 adopción: no se importa un libro de anticipos de nacimiento"
    )
  }
  if (f.familia.categoria !== "ordinaria") {
    fecha(f.familia.desde)
    fecha(f.familia.hasta)
    comprobar(
      f.familia.desde <= f.familia.hasta,
      "C36: intervalo de título familiar invertido"
    )
    unico(f.familia.titulares)
    comprobar(
      f.familia.titulo.trim() !== "" &&
        f.familia.desde <= "2025-12-31" &&
        f.familia.hasta >= "2025-12-31",
      "C36: título familiar fuera del devengo"
    )
    comprobar(
      f.familia.titulares.includes(id) &&
        f.familia.descendientes.every((p) =>
          censo.some((d) => d.sujetoId === p)
        ),
      "C36: título familiar ajeno al sujeto/censo anual"
    )
    unico(f.familia.descendientes)
    const integrantes = f.familia.descendientes.map((p) => familiarC36(m, p))
    const computo = integrantes.reduce(
      (n, d) => n + (d.discapacidad._tag === "SinDiscapacidad" ? 1 : 2),
      0
    )
    if (f.familia.categoria === "numerosa_general")
      comprobar(
        computo >= 3,
        "C36: supuesto equiparado de familia numerosa sin productor material suficiente"
      )
    if (f.familia.categoria === "numerosa_especial")
      comprobar(
        computo >= 4,
        "C36: familia numerosa especial contradictoria con censo anual"
      )
    if (f.familia.categoria === "monoparental_7_7")
      comprobar(
        integrantes.length >= 2 ||
          integrantes.some((d) => d.discapacidad._tag !== "SinDiscapacidad"),
        "C36: familia monoparental7.7 sin hijos habilitantes en censo anual"
      )
  }
  if (s.codigo === "canarias_familias_monoparentales")
    comprobar(
      s.hechos.personas.length === censo.length &&
        censo.every((d) => s.hechos.personas.some((p) => p.id === d.sujetoId)),
      "C36: faltan convivientes/descendientes para monoparentalidad"
    )
  if (s.codigo === "balears_nacimiento") {
    conciliarAnticipoNacimientoC36(s, m)
    comprobar(
      f.documentoResidencia2024.trim() !== "",
      "C36: residencia fiscal anterior sin soporte particular"
    )
    const hijos = m.sujetosConMinimo.filter((p) =>
      progenitoresC36(familiarC36(m, p)).includes(id)
    )
    comprobar(
      s.hechos.personas.length === hijos.length &&
        hijos.every((p) => s.hechos.personas.some((v) => v.id === p)),
      "C36: censo para orden de nacimiento incompleto"
    )
    const fechas = hijos.map((id) => familiarC36(m, id).fechaNacimiento)
    if (new Set(fechas).size !== fechas.length) {
      const registro = necesarioC36(
        s.hechos.registroPartoMultiple,
        "C36: nacimiento múltiple sin productor de orden registral"
      )
      comprobar(registro.documento.trim() !== "", "C36: falta soporte de parto múltiple")
      unico(registro.nacidos.map((p) => p.persona))
      const multiples = hijos.filter((p) => fechas.filter((f) => f === familiarC36(m, p).fechaNacimiento).length > 1)
      comprobar(
        registro.nacidos.length === multiples.length &&
          multiples.every((p) => registro.nacidos.some((n) => n.persona === p)),
        "C36: registro de parto múltiple incompleto o ajeno"
      )
      registro.nacidos.forEach((n) => {
        const d = familiarC36(m, n.persona)
        comprobar(
          n.fechaNacimiento === d.fechaNacimiento &&
            n.fechaNacimiento.startsWith("2025-") &&
            d.titulares.find((t) => t.titularId === id)?.vinculo.clase === "consanguinidad" &&
            Number.isSafeInteger(n.secuenciaParto) && n.secuenciaParto > 0,
          "C36: secuencia de parto incompatible con núcleo v4"
        )
      })
      for (const f of new Set(registro.nacidos.map((n) => n.fechaNacimiento))) {
        const secuencias = registro.nacidos.filter((n) => n.fechaNacimiento === f)
          .map((n) => n.secuenciaParto).sort((a, b) => a - b)
        comprobar(
          secuencias.every((n, i) => n === i + 1),
          "C36: secuencia de parto duplicada o incompleta"
        )
      }
    } else comprobar(
      s.hechos.registroPartoMultiple === undefined,
      "C36: registro de parto múltiple sin empate de nacimientos"
    )
  }
  const sinMinimo =
    s.codigo === "canarias_acogimiento_menores" ||
    s.codigo === "canarias_familias_monoparentales"
  let entradas = [...s.hechos.personas]
  if (s.codigo === "canarias_familiares_dependientes_discapacidad") {
    const ids = m.sujetosConMinimo.filter(
      (sujeto) =>
        familiarC36(m, sujeto).discapacidad._tag === "Discapacidad65OMas"
    )
    entradas = ids.map(
      (sujeto) =>
        s.hechos.personas.find((p) => p.id === sujeto) ?? {
          id: sujeto,
          convivencia: [],
        }
    )
  }
  const personas = entradas.map((p): PersonaFamiliaC => {
    const propia = p.id === id
    comprobar(
      !propia || s.codigo === "balears_gastos_ela",
      "C36: hijo idéntico al contribuyente"
    )
    const d = propia ? undefined : familiarC36(m, p.id)
    const vinculo = d?.titulares.find((t) => t.titularId === id)?.vinculo
    let minimo: MinimoC
    if (propia)
      minimo = {
        persona: id,
        titulares: [id],
        ejercicio: 2025,
        relacion: "descendiente",
        resolucion: "no-aplica-paciente-propio",
      }
    else if (sinMinimo)
      minimo = {
        persona: p.id,
        titulares: necesarioC36(d, "C36: falta familiar").titulares.map(
          (t) => t.titularId
        ),
        ejercicio: 2025,
        relacion: "descendiente",
        resolucion: "no-exigible-por-esta-rama",
      }
    else minimo = minimoC36(m, p.id)
    const acogimiento =
      vinculo?.clase === "acogimiento-urgencia"
        ? "urgencia"
        : vinculo?.clase === "acogimiento-temporal"
          ? "temporal"
          : vinculo?.clase === "acogimiento-permanente"
            ? "permanente"
            : "ninguno"
    if (s.codigo === "canarias_acogimiento_menores")
      comprobar(
        d?.titulares.length === 1 && acogimiento !== "ninguno",
        "C36 acogimiento: vínculo o censo específico de titulares autonómicos no representado"
      )
    if (s.codigo === "balears_nacimiento") {
      const nacido = necesarioC36(d, "C36: falta nacido")
      comprobar(
        progenitoresC36(nacido).includes(id) &&
          (!nacido.fechaNacimiento.startsWith("2025-") ||
            vinculo?.clase === "consanguinidad"),
        "C36: nacimiento o vínculo del núcleo v4 incompatible"
      )
    }
    const estudios =
      s.codigo === "canarias_estudios_educacion_superior" ||
      s.codigo === "balears_estudios_superiores_fuera_isla" ||
      s.codigo === "balears_libros_texto"
    const estudio = estudios
      ? necesarioC36(p.estudio, "C36: estudios del sujeto no aportados")
      : estudioNoAplicableC36()
    const gastos =
      s.codigo === "balears_gastos_ela" || s.codigo === "balears_libros_texto"
        ? necesarioC36(
            p.gastos,
            "C36: falta relación exhaustiva de gastos por paciente/hijo"
          )
        : (p.gastos ?? [])
    gastos.forEach((g) => conciliarPagoC36(m, g))
    if (s.codigo === "balears_gastos_ela")
      necesarioC36(
        p.diagnosticoELA,
        "C36 ELA: diagnóstico causal particular ausente; no se inventa gasto cero"
      )
    const nacimiento = propia
      ? f.nacimientoContribuyente
      : necesarioC36(d, "C36: falta fecha del sujeto").fechaNacimiento
    const fechaVinculo =
      vinculo !== undefined && "fechaConstitucionVinculo" in vinculo
        ? vinculo.fechaConstitucionVinculo
        : undefined
    if (p.inscripcionCivil !== undefined) {
      comprobar(
        vinculo?.clase === "adopcion" &&
          fechaVinculo !== undefined &&
          fechaVinculo <= p.inscripcionCivil,
        "C36: inscripción o fecha constitutiva incompatible con adopción v4"
      )
    }
    return {
      id: p.id,
      nacimiento,
      discapacidad: propia
        ? gradoPropio(m)
        : necesarioC36(d, "C36: falta discapacidad").discapacidad._tag ===
            "Discapacidad65OMas"
          ? 65
          : d?.discapacidad._tag === "Discapacidad33a64"
            ? 33
            : 0,
      naturalezaDiscapacidad: "fisica_sensorial",
      rentaNoExenta: propia
        ? h.baseGeneral
        : eurosCentimosC36(
            necesarioC36(d, "C36: falta renta familiar").rentasNoExentasCentimos
          ),
      minimo,
      progenitores: d === undefined ? [] : progenitoresC36(d),
      titularesAcogimiento: d?.titulares.map((t) => t.titularId) ?? [],
      convivencia: p.convivencia,
      adopcion:
        vinculo?.clase === "adopcion"
          ? necesarioC36(
              fechaVinculo,
              "C36: fecha constitutiva de adopción ausente en núcleo v4"
            )
          : "",
      inscripcionCivil: p.inscripcionCivil ?? "",
      progenitorPrevio: p.progenitorPrevio ?? "",
      expediente: p.expediente ?? "",
      acogimiento,
      ingresoCentroEspecializado: p.ingresoCentroEspecializado ?? "",
      gastos,
      diagnosticoELA: p.diagnosticoELA ?? "",
      estudio,
    }
  })
  const ordenHijos = personas
    .filter((p) => m.sujetosConMinimo.includes(p.id))
    .slice()
    .sort((x, y) => x.nacimiento.localeCompare(y.nacimiento) ||
      (s.codigo === "balears_nacimiento"
        ? (s.hechos.registroPartoMultiple?.nacidos.find((n) => n.persona === x.id)?.secuenciaParto ?? 0) -
          (s.hechos.registroPartoMultiple?.nacidos.find((n) => n.persona === y.id)?.secuenciaParto ?? 0)
        : 0))
    .map((p) => p.id)
  const otros = personas
    .filter((p) => !p.progenitores.includes(id))
    .map((p) => ({
      persona: p.id,
      relacion: "descendiente" as const,
      rentaNoExenta: p.rentaNoExenta,
      minimo: p.minimo,
      intervalos: p.convivencia,
    }))
  return evaluarFamiliaEstudiosAmpliacionC(
    {
      ...h,
      codigo: s.codigo,
      personas,
      contribuyentes: [
        {
          persona: id,
          nacimiento: f.nacimientoContribuyente,
          discapacidad: gradoPropio(m),
          naturalezaDiscapacidad: f.naturalezaDiscapacidad,
          resolucionDiscapacidad: f.resolucionDiscapacidad,
          familia: f.familia.categoria,
          tituloFamilia: f.familia.titulo,
          residenciaFiscal2024: f.residenciaFiscal2024,
          conyugePareja: "",
          ordenHijos,
          diasRETA: f.altasRETA,
          alteracionFamilia: f.alteracionFamilia,
          otrosConvivientes: otros,
        },
      ],
      cuotasHogar,
      ayudasNacimiento: s.hechos.ayudasNacimiento,
    },
    a
  )
}
function eurosCentimosC36(c: number): string {
  comprobar(Number.isSafeInteger(c), "C36: renta familiar en céntimos inválida")
  const q = BigInt(c),
    n = q < 0n ? -q : q
  return (
    (q < 0n ? "-" : "") +
    (n / 100n).toString() +
    "." +
    (n % 100n).toString().padStart(2, "0")
  )
}
function estudioNoAplicableC36(): typeof EstudioC36.Type {
  return {
    nivel: "primaria",
    centro: "",
    inicioCurso: "",
    creditos: 0,
    curso: "parcial",
    ofertaPublicaPresencialIsla: [],
    islaResidencia: "",
    islaCentro: "",
    municipioResidencia: "",
    municipioCentro: "",
    municipioAlojamiento: "",
    municipiosLimitrofes: [],
    alojamiento: "",
    estadoCivil: "soltero",
    sostenimiento: "",
  }
}
