import { Result, Schema } from "effect"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { CODIGOS_TERRITORIAL_F_HECHOS_2025 } from "../territorial-f-2025"
import type { SolicitudF } from "./esquemas"
import { SolicitudAnualF2025 } from "./anual-esquemas"
import { evaluarAmpliacionFDerivada2025 } from "./index"
import { CITAS_F } from "./citas"
import { CausaF, D, edad, dinero, decimal, falta, fecha, texto, unicos, type ResultadoF, type ConstruccionF } from "./comun"

function mismos(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && new Set(a).size === a.length && a.every((id) => b.includes(id))
}
function conciliarPersonas(s: SolicitudAnualF2025, m: MagnitudesTerritorialesAnuales): void {
  const propio = texto(m.caso.contribuyenteId, "caso.contribuyenteId")
  const ds = m.caso.derechosMinimos?.descendientes ?? []
  for (const p of s.hechos.personas ?? []) {
    const id = texto(p.id, "persona.id")
    if (p.relacion === "conyuge" || p.relacion === "ascendiente")
      falta("identidad_anual:" + id, "Cónyuge/ascendiente no representado por la API individual ordinaria con descendientes")
    if ((p.progenitores ?? []).includes(id)) falta("persona.progenitores", "Hijo incluido entre sus propios progenitores")
    const d = ds.find((x) => x.sujetoId === id)
    if (id === propio) {
      if (p.relacion !== "contribuyente") falta("persona.relacion", "Identidad propia declarada como familiar")
      if (p.nacimiento !== undefined && edad(p.nacimiento) !== m.caso.situacionFamiliar.edad)
        falta("persona.nacimiento", "Edad propia contradictoria con el anual")
    } else if (p.relacion === "acogido" && d === undefined) {
      if ((p.titularesMinimo?.length ?? 0) > 0)
        falta("persona.titularesMinimo", "El acogido sin derecho anual no puede declarar titulares de mínimo")
      // Un adulto acogido sin parentesco no se convierte en descendiente fiscal.
      // El evaluador conserva edad, convivencia, ayudas, parentesco y certificados propios.
    } else {
      if (d === undefined) falta("identidad_anual:" + id, "Familiar no identificado en los derechos anuales")
      if (!["hijo", "descendiente", "tutela", "acogimiento"].includes(p.relacion ?? ""))
        falta("persona.relacion", "Vínculo familiar no conciliable con descendiente anual")
      if (p.nacimiento !== undefined && p.nacimiento !== d.fechaNacimiento)
        falta("persona.nacimiento", "Nacimiento contradictorio con el anual")
      if (p.rentasNoExentasEUR !== undefined && !dinero(p.rentasNoExentasEUR, "persona.rentasNoExentasEUR", true).times(100).eq(d.rentasNoExentasCentimos))
        falta("persona.rentasNoExentasEUR", "Rentas familiares contradictorias con los derechos anuales")
      if (p.declaracionTipo !== undefined && p.declaracionTipo !== (d.declaracion.modalidad === "no-presenta" ? "no_presentada" : "individual"))
        falta("persona.declaracionTipo", "Declaración familiar contradictoria")
      if (p.rentasDeclaracionEUR !== undefined && (d.declaracion.modalidad !== "individual" || !dinero(p.rentasDeclaracionEUR, "persona.rentasDeclaracionEUR", true).times(100).eq(d.declaracion.rentasCentimos)))
        falta("persona.rentasDeclaracionEUR", "Rentas de declaración familiar contradictorias")
      const a = m.atribucionesMinimo?.find((x) => x.sujetoId === id)
      if (p.titularesMinimo !== undefined && (a === undefined || !mismos(p.titularesMinimo, a.titulares)))
        falta("persona.titularesMinimo", "Titulares del sujeto incompletos o ajenos al mínimo anual")
      const vinculo = d.titulares.find((t) => t.titularId === propio)
      if (p.progenitores !== undefined && !mismos(p.progenitores, d.titulares.filter((t) => ["consanguinidad", "adopcion"].includes(t.vinculo.clase)).map((t) => t.titularId)))
        falta("persona.progenitores", "Censo de progenitores contradictorio con el vínculo anual")
      if (p.adopcionFecha !== undefined && (vinculo?.vinculo.clase !== "adopcion" || vinculo.vinculo.fechaConstitucionVinculo !== p.adopcionFecha))
        falta("persona.adopcionFecha", "Fecha o vínculo adoptivo no conciliado con el anual")
      if (p.relacion === "acogimiento" && vinculo?.vinculo.clase.startsWith("acogimiento") !== true)
        falta("persona.relacion", "Acogimiento incompatible con el vínculo anual")
      if (p.relacion === "tutela" && vinculo?.vinculo.clase !== "guarda-judicial")
        falta("persona.relacion", "Tutela no conciliada con el vínculo anual")
      if ((p.convivencia?.length ?? 0) > 0 && vinculo?.relacion !== "convivencia")
        falta("persona.convivencia", "Convivencia distinta de la relación anual")
      if (p.alimentos64175 !== undefined && (p.alimentos64175 !== "no" || vinculo?.aplicaEspecialidadAlimentos !== false))
        falta("persona.alimentos64175", "Especialidad de alimentos no conciliada")
    }
    const discapacidad = id === propio ? m.caso.situacionFamiliar.discapacidad : d?.discapacidad
    if (p.discapacidadPorcentaje !== undefined) {
      const grado = decimal(p.discapacidadPorcentaje, "persona.discapacidadPorcentaje")
      const tag = grado.gte(65) ? "Discapacidad65OMas" : grado.gte(33) ? "Discapacidad33a64" : "SinDiscapacidad"
      if (grado.gt(100) || (discapacidad !== undefined && tag !== discapacidad._tag))
        falta("persona.discapacidadPorcentaje", "Discapacidad contradictoria con el anual")
    }
    if (p.situacionDevengo !== undefined && p.situacionDevengo !== "vivo")
      falta("persona.situacionDevengo", "Fallecimiento familiar fuera del perfil anual ordinario")
    for (const titular of p.titularesDeduccion ?? []) {
      if (titular === id && id !== propio) falta("persona.titularesDeduccion", "Familiar titular de su propia deducción")
      if (p.relacion !== "acogido" && titular !== propio && !ds.some((x) => x.titulares.some((t) => t.titularId === titular)))
        falta("identidad_titular:" + titular, "Titular ajeno al grafo familiar anual")
    }
  }
  if (s.hechos.nacimientoContribuyente !== undefined && edad(s.hechos.nacimientoContribuyente) !== m.caso.situacionFamiliar.edad)
    falta("nacimientoContribuyente", "Edad propia contradictoria con el anual")
  for (const p of s.hechos.pagos ?? []) {
    const d = ds.find((x) => x.sujetoId === p.beneficiarioId)
    if (d !== undefined && fecha(p.fecha, "pago.fecha") < d.fechaNacimiento)
      falta("pago.fecha", "Pago del beneficiario anterior a su nacimiento")
  }
  for (const id of s.hechos.miembrosUnidad ?? [])
    if (id !== propio && !ds.some((d) => d.sujetoId === id))
      falta("identidad_miembro_unidad:" + id, "Miembro de unidad no identificado en el caso anual")
}

function conciliarPrevios(s: SolicitudAnualF2025, m: MagnitudesTerritorialesAnuales): void {
  const h = s.hechos.hechosPrevios
  if (h === undefined) return
  const propio = m.caso.contribuyenteId!
  const ds = m.caso.derechosMinimos?.descendientes ?? []
  if (h.nacimientoContribuyente !== undefined && edad(h.nacimientoContribuyente) !== m.caso.situacionFamiliar.edad)
    falta("hechosPrevios.nacimientoContribuyente", "Edad propia contradictoria")
  if (h.gradoPorcentaje !== undefined) {
    const grado = decimal(h.gradoPorcentaje, "hechosPrevios.gradoPorcentaje")
    const tag = grado.gte(65) ? "Discapacidad65OMas" : grado.gte(33) ? "Discapacidad33a64" : "SinDiscapacidad"
    if (grado.gt(100) || tag !== m.caso.situacionFamiliar.discapacidad._tag)
      falta("hechosPrevios.gradoPorcentaje", "Discapacidad propia contradictoria")
  }
  for (const b of h.beneficiarios ?? []) {
    const id = texto(b.id, "beneficiario.id")
    if (b.relacion === "conyuge") falta("identidad_anual:" + id, "Cónyuge no representado en la API individual actual")
    if (b.relacion === "hijo" || b.progenitoresConvivientes !== undefined) {
      const d = ds.find((x) => x.sujetoId === id)
      if (d === undefined || !m.sujetosConMinimo.includes(id))
        falta("minimo_anual:" + id, "Beneficiario sin identidad y mínimo anual conciliados")
      if (b.nacimiento !== undefined && b.nacimiento !== d.fechaNacimiento)
        falta("beneficiario.nacimiento", "Nacimiento familiar contradictorio")
      if (b.rentasNoExentas !== undefined && !dinero(b.rentasNoExentas, "beneficiario.rentasNoExentas", true).times(100).eq(d.rentasNoExentasCentimos))
        falta("beneficiario.rentasNoExentas", "Rentas familiares contradictorias")
      if (b.progenitoresConvivientes !== undefined && !mismos(b.progenitoresConvivientes, d.titulares.filter((t) => t.relacion === "convivencia").map((t) => t.titularId)))
        falta("beneficiario.progenitoresConvivientes", "Censo de titulares convivientes contradictorio")
    }
  }
  for (const e of h.eventos ?? []) {
    const hijos = e.hijo === undefined ? e.hijos ?? [] : [e.hijo]
    for (const hijo of hijos) {
      if (hijo === propio || (e.progenitoresConvivientesConDerecho ?? e.progenitoresConvivientes ?? []).includes(hijo))
        falta("evento.hijo", "Hijo incluido entre sus propios progenitores")
      const d = ds.find((x) => x.sujetoId === hijo)
      if (d === undefined) falta("identidad_anual:" + hijo, "Hijo del evento no identificado en los derechos anuales")
      const v = d.titulares.find((t) => t.titularId === propio)?.vinculo
      if (e.fecha !== undefined) {
        const f = fecha(e.fecha, "evento.fecha")
        if (f < d.fechaNacimiento || f > "2025-12-31") falta("evento.fecha", "Evento anterior al nacimiento o posterior al devengo")
        if (e.tipo === "nacimiento" && f !== d.fechaNacimiento) falta("evento.fecha", "Nacimiento anual contradictorio")
        if ((e.tipo === "adopcion" || e.tipo === "adopcion_internacional") && (v?.clase !== "adopcion" || v.fechaConstitucionVinculo !== f))
          falta("evento.adopcion", "Fecha o vínculo de adopción no conciliados con el anual")
      }
      const titulares = e.progenitoresConvivientesConDerecho ?? e.progenitoresConvivientes
      const atribucion = m.atribucionesMinimo?.find((x) => x.sujetoId === hijo)
      if (titulares !== undefined && (atribucion === undefined || !mismos(titulares, atribucion.titulares)))
        falta("evento.progenitores", "Reparto del sujeto distinto del mínimo anual o incompleto")
    }
  }
}

/** Un resultado por rama; las carencias no impiden evaluar las otras solicitudes. */
export function evaluarAnualF2025(
  entrada: SolicitudAnualF2025,
  m: MagnitudesTerritorialesAnuales,
  solicitudes: readonly SolicitudAnualF2025[] = [entrada]
): ResultadoF {
  const dec = Schema.decodeUnknownResult(SolicitudAnualF2025)(entrada, { onExcessProperty: "error" })
  if (Result.isFailure(dec)) return {
    codigo: entrada.codigo, estado: "no_soportado", motivo: String(dec.failure),
    siguienteHecho: "hechos_anuales_sin_magnitudes_consignadas", citas: [], reservas: [], rastro: [],
  }
  const s = dec.success
  try {
    const c = m.caso, contribuyente = texto(c.contribuyenteId, "caso.contribuyenteId")
    if (c.anio !== 2025 || c.situacionFamiliar.tipo !== "individual" || c.fechaFallecimiento !== undefined)
      falta("perfil_anual", "Sólo 2025 individual ordinaria sin fallecimiento")
    if (c.comunidadAutonoma !== (s.codigo.startsWith("madrid_") ? "madrid" : "murcia"))
      falta("territorio", "Código de otro territorio")
    conciliarPersonas(s, m)
    conciliarPrevios(s, m)
    const anteriores = s.hechos.hechosPrevios
    if (anteriores?.historia?.some((h) => h.ejercicio === undefined || h.ejercicio >= 2025 || h.ejercicio < 2022) === true)
      falta("historia.ejercicio", "Historia sólo de periodos2022–2024; 2025 se deriva del mismo anual")
    if (s.codigo === "madrid_nacimiento_adopcion_hijos" || s.codigo === "murcia_gastos_guarderia")
      falta("productor_exacto_auxiliar:" + s.codigo, "Evaluador reutilizado conserva su alcance parcial; falta salida exacta y conciliación del historial/centros para esta conexión anual, sin duplicar su fórmula ni afirmar elegibilidad global")
    if (CODIGOS_TERRITORIAL_F_HECHOS_2025.some((x) => x === s.codigo)) {
      const R = D.clone({ precision: 40 })
      if (!new R(m.baseGeneral).plus(m.baseAhorro).eq(new D(m.baseGeneral).plus(m.baseAhorro)))
        falta("productor_precision80_reutilizado:" + s.codigo, "El evaluador publicado usa40 cifras; esta base requiere más y no se redondea para decidir un límite")
    }
    if (s.codigo === "murcia_recarga_vehiculos_electricos") {
      const h = s.historialRecarga
      if (h === undefined) falta("historialRecarga.2022_2024", "Censo de infraestructuras de origen2022–2024 y su soporte para determinar prelación; no se presume historial vacío")
      texto(h.referencia, "historialRecarga.referencia")
      if (h.contribuyente !== contribuyente) falta("historialRecarga.contribuyente", "Historia de otro titular")
      unicos(h.infraestructuras.map((i) => i.objetoId), "historialRecarga.objetoId")
      if (h.infraestructuras.length > 0)
        falta("productor_saldo_recarga_origen:" + h.infraestructuras[0]!.ejercicioOrigen, "Reconstruir gastos, condiciones y aplicaciones del periodo de origen; no se admite saldo ni consumo calculado externamente")
    }
    if (s.codigo === "murcia_vehiculos_electricos" || s.codigo === "murcia_instalaciones_recursos_energeticos_renovables") {
      const h = s.historialSaldosIncentivoMurcia
      const periodos = s.codigo === "murcia_vehiculos_electricos" ? [2022, 2023, 2024] : [2023, 2024]
      if (h === undefined || h.codigo !== s.codigo || h.contribuyente !== contribuyente)
        falta("historialSaldosIncentivoMurcia:" + s.codigo, "Identificar titular, incentivo y censo de operaciones de los periodos de arrastre")
      texto(h.referencia, "historialSaldosIncentivoMurcia.referencia")
      if (h.periodos.length !== periodos.length || new Set(h.periodos).size !== h.periodos.length || h.periodos.some((a) => !periodos.includes(a)))
        falta("historialSaldosIncentivoMurcia.periodos", "Periodos previos exigidos: " + periodos.join(","))
      if (h.operaciones.length > 0)
        falta("productor_saldo_origen:" + h.operaciones[0]!.ejercicioOrigen, "Reconstruir la generación y aplicaciones de cada año; no se recibe un importe de saldo ni se presume consumido")
    }
    const hechos: ConstruccionF<SolicitudF["hechos"]> = {
      ...s.hechos,
        elecciones: [
          ...(s.hechos.elecciones ?? []),
          ...solicitudes.filter((x) => x.codigo !== s.codigo).flatMap((x) => {
            const objetos = [...(x.hechos.viviendas ?? []), ...(x.hechos.inversiones ?? []), ...(x.hechos.contratos ?? [])]
            return objetos.length === 0 ? [{ codigo: x.codigo, objetoId: "declaracion" }]
              : objetos.map((o) => ({ codigo: x.codigo, objetoId: texto(o.id, "eleccion.objetoId") }))
          }),
        ],
      bases: [{ id: contribuyente, generalEUR: m.baseGeneral.toFixed(), ahorroEUR: m.baseAhorro.toFixed() }],
      minimoPersonalFamiliarEUR: m.minimoPersonalFamiliar.toFixed(),
    }
    if (m.basesLiquidables !== undefined) {
      hechos.liquidableGeneralEUR = m.basesLiquidables.general.toFixed()
      hechos.liquidableAhorroEUR = m.basesLiquidables.ahorro.toFixed()
    }
    // La composición actual no admite deducciones estatales sobre donativos.
    // Ausencia estructural del mismo anual, no saldo histórico supuesto.
    if (s.hechos.pagos !== undefined)
      hechos.pagos = s.hechos.pagos.map((p) => ({ ...p, computoBaseEstatalEUR: "0" }))
    if (anteriores !== undefined)
      hechos.hechosPrevios = { ...anteriores, baseGeneralEUR: m.baseGeneral.toFixed(), baseAhorroEUR: m.baseAhorro.toFixed() }
    const solicitud: SolicitudF = {
      tipo: "territorial_f_ampliacion_2025", codigo: s.codigo,
      contexto: { ejercicio: 2025, territorio: c.comunidadAutonoma, contribuyente, modalidad: "individual", declarantes: [contribuyente] },
      hechos,
    }
    const r = evaluarAmpliacionFDerivada2025(solicitud, {
      contribuyente, general: m.baseGeneral, ahorro: m.baseAhorro,
      liquidableGeneral: m.basesLiquidables?.general, liquidableAhorro: m.basesLiquidables?.ahorro,
      minimoPersonalFamiliar: m.minimoPersonalFamiliar,
    })
    const resultado: ConstruccionF<ResultadoF> = {
      ...r, rastro: ["Magnitudes internas de la única composición anual; precisión80, sin presentación", ...r.rastro],
    }
    if (r.estado === "calculo_parcial" && s.codigo === "madrid_inversiones_nuevos_contribuyentes_extranjero")
      resultado.aplicacionAnualSaldoMadrid = {
        ejercicioOrigen: 2025, contribuyente, primerEjercicio: 2026, ultimoEjercicio: 2030,
        objetosIds: (s.hechos.inversiones ?? []).map((x) => texto(x.id, "origen.objetoId")),
      }
    if (r.estado === "calculo_parcial" && (s.codigo === "murcia_vehiculos_electricos" || s.codigo === "murcia_instalaciones_recursos_energeticos_renovables"))
      resultado.aplicacionAnualSaldoMurcia = {
        ejercicioOrigen: 2025, contribuyente, primerEjercicio: 2026,
        ultimoEjercicio: s.codigo === "murcia_vehiculos_electricos" ? 2028 : 2027,
        objetosIds: (s.codigo === "murcia_vehiculos_electricos" ? s.hechos.vehiculos ?? [] : s.hechos.instalaciones ?? []).map((x) => texto(x.id, "origen.objetoId")),
      }
    return resultado
  } catch (e) {
    if (!Schema.is(CausaF)(e)) throw e
    return { codigo: s.codigo, estado: e.estado, motivo: e.message, siguienteHecho: e.campo,
      citas: CITAS_F.find((x) => x.codigo === s.codigo)?.citas ?? [], reservas: [], rastro: [] }
  }
}
