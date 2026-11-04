import DecimalBase from "decimal.js"
import { DateTime, Function, Option, Result, Schema } from "effect"
import {
  decodificarTerritorialF,
  type BeneficiarioF2025,
  type PagoDeclaradoF2025,
} from "./territorial-f-esquemas-2025"
import {
  evaluarHechosAuxiliar2025,
  type HechosDeduccionAuxiliar,
} from "./hechos-auxiliar-2025"
import type { ContextoDeduccion, ResultadoDeduccion } from "./contratos-2025"
import { COBERTURA_TERRITORIAL_F_2025 } from "./territorial-f-cobertura-2025"
type Decimal = DecimalBase
const Decimal = DecimalBase.clone({
  precision: 40,
  rounding: DecimalBase.ROUND_HALF_UP,
})

/** API modular propuesta. Nunca aplica cuota ni agrega importes a la anual.
 * Importes declarados: texto EUR exacto hasta dos decimales, nunca number.
 * Los documentos son referencias declaradas; no se afirma autenticidad.
 */
export type SolicitudTerritorialF2025 = {
  readonly tipo: "territorial_f_hechos_2025"
  readonly contexto: ContextoDeduccion
  readonly codigo: string
  readonly hechos: unknown
}
export type ResultadoTerritorialF2025 = ResultadoDeduccion & {
  readonly codigo: string
  readonly rastro: readonly string[]
  readonly reservas: readonly string[]
  readonly siguienteHecho?: string
  readonly importeCentimos?: string
}
class FaltaHecho extends Schema.TaggedErrorClass<FaltaHecho>()("FaltaHecho", {
  campo: Schema.String,
  message: Schema.String,
}) {}
function falta(campo: string, motivo: string): never {
  throw new FaltaHecho({ campo, message: motivo })
}
function objeto<T>(v: T | undefined, campo: string): T {
  if (v === undefined) falta(campo, "Falta registro de hechos")
  return v
}
function texto(v: string | undefined, campo: string): string {
  if (v === undefined || v.trim() !== v || v.length === 0)
    falta(campo, "Identidad o referencia vacía/inválida")
  return v
}
function lista<T>(v: readonly T[] | undefined, campo: string): readonly T[] {
  if (v === undefined) falta(campo, "Falta colección exhaustiva")
  return v
}
function ids(v: readonly string[] | undefined, campo: string): string[] {
  const r = lista(v, campo).map((x) => texto(x, campo))
  if (r.length === 0 || new Set(r).size !== r.length)
    falta(campo, "Identidades vacías o repetidas")
  return r
}
function euros(v: string | undefined, campo: string, firmado = false): Decimal {
  if (
    v === undefined ||
    !(
      firmado ? /^-?(0|[1-9]\d*)(\.\d{1,2})?$/ : /^(0|[1-9]\d*)(\.\d{1,2})?$/
    ).test(v)
  )
    falta(campo, "Se exige texto EUR finito hasta dos decimales")
  // Cota técnica del transporte compatible con ResultadoDeduccion (number).
  const d = new Decimal(v)
  if (d.abs().gt("90071992547409.91"))
    falta(campo, "Importe fuera del transporte seguro en céntimos")
  return d
}
function entero(
  v: number | undefined,
  campo: string,
  min: number,
  max: number
): number {
  if (v === undefined || !Number.isSafeInteger(v) || v < min || v > max)
    falta(campo, "Entero fuera de dominio")
  return v
}
function fecha(v: string | undefined, campo: string): string {
  const s = texto(v, campo)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) falta(campo, "Fecha civil ISO requerida")
  const t = DateTime.make(`${s}T00:00:00Z`)
  if (Option.isNone(t) || DateTime.formatIsoDateUtc(t.value) !== s)
    falta(campo, "Fecha civil inexistente")
  return s
}
function edad(v: string | undefined, campo: string): number {
  const s = fecha(v, campo)
  if (s > "2025-12-31" || s < "1895-01-01")
    falta(campo, "Nacimiento fuera del dominio de edad")
  return 2025 - Number(s.slice(0, 4))
}
function es(
  v: string | undefined,
  opciones: readonly string[],
  campo: string
): string {
  const s = texto(v, campo)
  if (!opciones.includes(s)) falta(campo, "Discriminante no admitido")
  return s
}
function unico(valores: readonly string[], campo: string): void {
  if (new Set(valores).size !== valores.length)
    falta(campo, "Identidad duplicada: posible doble aplicación")
}

/** Subcontrato familiar ordinario: hijos vivos, parentesco directo, convivencia
 * al devengo y sin anualidades. Especialidades se rechazan, nunca se suponen. */
function hijoMinimo(p: BeneficiarioF2025, contribuyente: string): void {
  const id = texto(p.id, "hijo.id")
  if (id === contribuyente)
    falta(
      "hijo.id",
      "El descendiente y el contribuyente tienen la misma identidad"
    )
  const e = edad(p.nacimiento, "hijo.nacimiento")
  const progenitores = ids(
    p.progenitoresConvivientes,
    "hijo.progenitoresConvivientes"
  )
  if (progenitores.includes(id))
    falta("hijo.id", "El descendiente figura como su propio progenitor")
  if (progenitores.length > 2 || !progenitores.includes(contribuyente))
    falta(
      "hijo.progenitoresConvivientes",
      "Falta vínculo directo y convivencia del titular al devengo"
    )
  es(
    p.situacionDevengo,
    ["vivo_convive_sin_anualidades"],
    "hijo.situacionDevengo"
  )
  texto(p.soporteParentescoConvivencia, "hijo.soporteParentescoConvivencia")
  if (e >= 25)
    falta(
      "hijo.discapacidad",
      "Rama de descendiente de 25 o más años requiere discapacidad y mínimo específico"
    )
  if (euros(p.rentasNoExentas, "hijo.rentasNoExentas", true).gt(8000))
    falta(
      "hijo.rentasNoExentas",
      "No genera mínimo: rentas superiores a 8.000 EUR"
    )
  const declaracion = objeto(p.declaracion, "hijo.declaracion")
  const tipo = es(
    declaracion.tipo,
    ["no_presentada", "individual"],
    "hijo.declaracion.tipo"
  )
  if (
    tipo === "individual" &&
    euros(declaracion.rentas, "hijo.declaracion.rentas", true).gt(1800)
  )
    falta(
      "hijo.declaracion.rentas",
      "No genera mínimo: declaración con rentas superiores a 1.800 EUR"
    )
}
type Pago = {
  id: string
  beneficiario: string
  concepto: string
  importe: Decimal
}
function pagos(
  v: readonly PagoDeclaradoF2025[] | undefined,
  contribuyente: string,
  conceptos: readonly string[],
  rastro: string[]
): Pago[] {
  const r = lista(v, "pagos").map((x, i) => {
    const p = objeto(x, `pagos.${i}`)
    const id = texto(p.id, `pagos.${i}.id`)
    const f = fecha(p.fecha, `pagos.${i}.fecha`)
    if (f < "2025-01-01" || f > "2025-12-31")
      falta(`pagos.${i}.fecha`, "Pago fuera del ejercicio 2025")
    if (texto(p.pagador, `pagos.${i}.pagador`) !== contribuyente)
      falta(
        `pagos.${i}.pagador`,
        "Rama sólo de desembolsos propios; falta atribución del pago"
      )
    es(p.atribucion, ["propia_exclusiva"], `pagos.${i}.atribucion`)
    const factura = texto(p.factura, `pagos.${i}.factura`)
    texto(p.soportePago, `pagos.${i}.soportePago`)
    es(
      p.conservacionFactura,
      ["hasta_prescripcion"],
      `pagos.${i}.conservacionFactura`
    )
    const importe = euros(p.importeEUR, `pagos.${i}.importeEUR`)
    rastro.push(
      `Pago declarado ${id}; factura ${factura}; fecha ${f}; EUR ${importe.toFixed(2)}`
    )
    return {
      id,
      beneficiario: texto(p.beneficiario, `pagos.${i}.beneficiario`),
      concepto: es(p.concepto, conceptos, `pagos.${i}.concepto`),
      importe,
    }
  })
  unico(
    r.map((p) => p.id),
    "pagos.id"
  )
  return r
}
function resultado(
  codigo: string,
  rastro: string[],
  valor: Decimal,
  motivo: string
): ResultadoTerritorialF2025 {
  // Un único redondeo de presentación, igual al contrato existente.
  const d = valor.toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
  return {
    codigo,
    estado: "calculo_parcial",
    importe: d.toNumber(),
    importeCentimos: d.times(100).toFixed(0),
    motivo,
    aceptacionFiscal: "pendiente",
    rastro,
    reservas: [
      "Hechos y soportes declarados; autenticidad y exhaustividad no acreditadas por el motor",
      "Antes de cuota; sin composición anual ni aceptación fiscal",
    ],
  }
}
const NUEVOS = [
  "madrid_adopcion_internacional",
  "murcia_nacimiento_adopcion",
  "murcia_contribuyentes_discapacidad",
  "murcia_cristales_lentes_soluciones_limpieza",
  "murcia_deporte_actividades_saludables",
  "murcia_enfermedades_raras",
  "murcia_ensenanza_idiomas",
  "murcia_gastos_veterinarios",
] as const
export const CODIGOS_TERRITORIAL_F_HECHOS_2025 = [
  ...NUEVOS,
  "madrid_nacimiento_adopcion_hijos",
  "murcia_gastos_guarderia",
] as const

/** Entrada unknown para consumidores JS: toda insuficiencia conserva motivo y
 * siguiente campo; nunca se convierte en importe cero. */
function evaluarDecodificada(
  decoded: ReturnType<typeof decodificarTerritorialF>
): ResultadoTerritorialF2025 {
  if (Result.isFailure(decoded))
    return {
      codigo: "desconocido",
      estado: "no_soportado",
      motivo: String(decoded.failure),
      siguienteHecho: String(decoded.failure),
      rastro: [],
      reservas: [],
    }
  let codigo = "desconocido"
  const rastro: string[] = []
  try {
    const s = decoded.success
    es(s.tipo, ["territorial_f_hechos_2025"], "tipo")
    codigo = texto(s.codigo, "codigo")
    const c = objeto(s.contexto, "contexto")
    if (
      c.ejercicio !== 2025 ||
      c.territorio !== (codigo.startsWith("madrid_") ? "madrid" : "murcia")
    )
      falta("contexto", "Ejercicio o territorio ajeno al código")
    const contribuyente = texto(c.contribuyente, "contexto.contribuyente")
    const modalidad = es(
      c.modalidad,
      ["individual", "conjunta"],
      "contexto.modalidad"
    )
    const declarantes =
      c.declarantes === undefined && modalidad === "individual"
        ? [contribuyente]
        : ids(c.declarantes, "contexto.declarantes")
    if (
      !declarantes.includes(contribuyente) ||
      (modalidad === "individual" && declarantes.length !== 1)
    )
      falta("contexto.declarantes", "Unidad de declaración contradictoria")
    const h = objeto(s.hechos, "hechos")
    rastro.push(
      `Hechos declarados ${codigo}; 2025; ${c.territorio}; ${modalidad}; referencia ${contribuyente}`
    )
    if (
      codigo === "madrid_nacimiento_adopcion_hijos" ||
      codigo === "murcia_gastos_guarderia"
    ) {
      // El auxiliar conserva validación de unidades, identidades y duplicados y
      // delega en contratos-2025.ts. No hay una segunda fórmula monetaria.
      if (h.codigo !== codigo)
        falta("hechos.codigo", "Código auxiliar distinto")
      const hc = objeto(h.contexto, "hechos.contexto")
      const hd = ids(h.declarantes, "hechos.declarantes")
      if (
        hc.ejercicio !== c.ejercicio ||
        hc.territorio !== c.territorio ||
        hc.contribuyente !== contribuyente ||
        hc.modalidad !== modalidad ||
        hd.length !== declarantes.length ||
        hd.some((id) => !declarantes.includes(id))
      )
        falta("hechos.contexto", "Hechos auxiliares de otra declaración")
      if (hc.declarantes !== undefined) {
        const internos = ids(hc.declarantes, "hechos.contexto.declarantes")
        if (
          internos.length !== hd.length ||
          internos.some((id) => !hd.includes(id))
        )
          falta("hechos.contexto.declarantes", "Unidad auxiliar contradictoria")
      }
      if (h.elegibilidadExterna !== true)
        falta(
          "hechos.elegibilidadExterna",
          "La ruta reutilizada requiere elegibilidad externa expresamente afirmada; no se transforma falta de elegibilidad en cero"
        )
      const numero = (
        v: number | undefined,
        campo: string,
        firmado = false
      ): number => {
        if (
          v === undefined ||
          !Number.isFinite(v) ||
          (!firmado && v < 0) ||
          Math.abs(v) > 90071992547409.91
        )
          falta(campo, "Importe numérico del contrato reutilizado inválido")
        return v
      }
      let auxiliar: HechosDeduccionAuxiliar
      if (codigo === "madrid_nacimiento_adopcion_hijos") {
        const eventos = lista(h.eventos, "hechos.eventos").map((ev) => ({
          ejercicio: entero(ev.ejercicio, "evento.ejercicio", 1900, 2100),
          hijos: ids(ev.hijos, "evento.hijos"),
          progenitoresConvivientes: ids(
            ev.progenitoresConvivientes,
            "evento.progenitoresConvivientes"
          ),
        }))
        const historia = lista(h.historia, "hechos.historia").map((b) => {
          const unidad = lista(
            b.basesUnidadFamiliar,
            "historia.basesUnidadFamiliar"
          )
          if (unidad.length === 0)
            falta("historia.basesUnidadFamiliar", "Historial familiar vacío")
          return {
            ejercicio: entero(b.ejercicio, "historia.ejercicio", 1900, 2100),
            general: numero(b.general, "historia.general", true),
            ahorro: numero(b.ahorro, "historia.ahorro", true),
            basesUnidadFamiliar: unidad.map((v) =>
              numero(v, "historia.basesUnidadFamiliar", true)
            ),
          }
        })
        auxiliar = {
          codigo,
          contexto: { ...hc, declarantes: hd },
          declarantes: hd,
          elegibilidadExterna: true,
          eventos,
          historia,
        }
      } else {
        const gastos = lista(h.gastos, "hechos.gastos").map((g) => ({
          hijo: texto(g.hijo, "gasto.hijo"),
          titulares: ids(g.titulares, "gasto.titulares"),
          custodia: numero(g.custodia, "gasto.custodia"),
          alimentacion: numero(g.alimentacion, "gasto.alimentacion"),
          vestuarioEscolar: numero(
            g.vestuarioEscolar,
            "gasto.vestuarioEscolar"
          ),
          ayudas: numero(g.ayudas, "gasto.ayudas"),
        }))
        auxiliar = {
          codigo,
          contexto: { ...hc, declarantes: hd },
          declarantes: hd,
          elegibilidadExterna: true,
          gastos,
          baseImponible: numero(h.baseImponible, "hechos.baseImponible", true),
        }
      }
      const r = evaluarHechosAuxiliar2025(auxiliar)
      return {
        ...r,
        codigo,
        rastro: [...rastro, r.motivo],
        reservas: [
          "Alcance parcial ya revisado de contratos-2025.ts; sin ampliar elegibilidad externa",
        ],
        ...("importe" in r
          ? { importeCentimos: new Decimal(r.importe).times(100).toFixed(0) }
          : { siguienteHecho: "hechos auxiliares completos según motivo" }),
      }
    }
    if (!NUEVOS.some((c) => c === codigo)) {
      const pendiente = COBERTURA_TERRITORIAL_F_2025.find(
        (x) => x.codigo === codigo
      )
      if (pendiente === undefined) falta("codigo", "Código ajeno al lote F")
      let reservas: string[] = []
      if (
        codigo === "murcia_vehiculos_electricos" &&
        modalidad === "individual" &&
        euros(h.baseGeneralEUR, "baseGeneralEUR", true)
          .plus(euros(h.baseAhorroEUR, "baseAhorroEUR", true))
          .eq(35000)
      )
        reservas = [
          "F-N01: base imponible general + ahorro exactamente 35.000 EUR; no es el precio del vehículo; dos tipos legales superpuestos",
        ]
      if (codigo === "murcia_vivienda_jovenes_hasta_40")
        reservas = [
          "F-N02: comparación patrimonial final/final sin resolución; sólo rama vivienda joven",
        ]
      if (
        codigo === "murcia_regimen_transitorio_inversion_vivienda_habitual" &&
        h.rama === "Uno_vigente"
      )
        reservas = [
          "F-N02: remisión de DT primera.2 a Uno vigente; reserva del inciso patrimonial sólo en esta rama",
        ]
      if (codigo === "murcia_dispositivos_ahorro_agua")
        reservas = [
          "F-N03: remisión de Cuatro.3 a Uno.5 sin resolución; sólo ahorro de agua",
        ]
      return {
        codigo,
        estado: "no_soportado",
        motivo: "Rama pendiente de implementación; no es una exclusión fiscal",
        siguienteHecho: pendiente.siguienteHecho,
        rastro,
        reservas,
      }
    }
    if (modalidad !== "individual")
      falta(
        "composicionConjuntaTerritorial",
        "Este sublote nuevo sólo evalúa individual; no agrega derechos de conjunta"
      )
    if (h.unidad !== undefined && h.unidad !== "EUR")
      falta("unidad", "Importes de esta entrada en EUR, no en céntimos")
    const general = euros(h.baseGeneralEUR, "baseGeneralEUR", true)
    const ahorro = euros(h.baseAhorroEUR, "baseAhorroEUR", true)
    const base = general.plus(ahorro)
    rastro.push(
      `Bases declaradas general ${general.toFixed(2)} + ahorro ${ahorro.toFixed(2)} = ${base.toFixed(2)} EUR`
    )
    const excluir = (motivo: string): ResultadoTerritorialF2025 => ({
      codigo,
      estado: "excluida",
      motivo,
      rastro,
      reservas: [],
    })
    const fin = (v: Decimal, cita: string) =>
      resultado(
        codigo,
        [...rastro, `Citas lote F: ${cita}`],
        v,
        "Evaluación individual acotada por hechos; antes de cuota"
      )
    if (codigo === "murcia_contribuyentes_discapacidad") {
      const grado = euros(h.gradoPorcentaje, "gradoPorcentaje")
      if (grado.gt(100)) falta("gradoPorcentaje", "Grado superior a 100")
      texto(h.certificado, "certificado")
      if (fecha(h.fechaEfectos, "fechaEfectos") > "2025-12-31")
        return excluir("Discapacidad sin efectos al devengo")
      if (base.gt(40000) || grado.lt(33))
        return excluir(
          "Base superior a 40.000 EUR o discapacidad inferior al 33 %"
        )
      return fin(new Decimal(150), `${codigo}-original`)
    }
    if (
      codigo === "madrid_adopcion_internacional" ||
      codigo === "murcia_nacimiento_adopcion"
    ) {
      const eventos = lista(h.eventos, "eventos").map((x) =>
        objeto(x, "eventos")
      )
      unico(
        eventos.map((e) => texto(e.hijo, "evento.hijo")),
        "eventos.hijo"
      )
      let total = new Decimal(0)
      for (const e of eventos) {
        const f = fecha(e.fecha, "evento.fecha")
        texto(e.soporte, "evento.soporte")
        const titulares = ids(
          e.progenitoresConvivientesConDerecho,
          "evento.progenitoresConvivientesConDerecho"
        )
        if (titulares.includes(texto(e.hijo, "evento.hijo")))
          falta(
            "evento.hijo",
            "El hijo no puede ser uno de sus propios progenitores"
          )
        if (titulares.length > 2 || !titulares.includes(contribuyente))
          falta(
            "evento.progenitoresConvivientesConDerecho",
            "Titularidad o convivencia contradictoria"
          )
        if (codigo === "madrid_adopcion_internacional") {
          es(e.tipo, ["adopcion_internacional"], "evento.tipo")
          texto(e.normaConvenioAplicable, "evento.normaConvenioAplicable")
          if (f.startsWith("2025-"))
            total = total.plus(
              new Decimal("721.70")
                .times(titulares.length === 2 ? "1.5" : 1)
                .div(titulares.length)
            )
        } else {
          es(e.tipo, ["nacimiento", "adopcion"], "evento.tipo")
          const orden = entero(
            e.ordenParaContribuyente,
            "evento.ordenParaContribuyente",
            1,
            100
          )
          texto(e.soporteOrden, "evento.soporteOrden")
          if (f.startsWith("2025-"))
            total = total.plus(
              new Decimal(orden === 1 ? 100 : orden === 2 ? 200 : 300).div(
                titulares.length
              )
            )
        }
        rastro.push(
          `Evento ${e.hijo}; fecha ${f}; reparto 1/${titulares.length}`
        )
      }
      if (codigo === "murcia_nacimiento_adopcion" && base.gt(30000))
        return excluir("Base superior a 30.000 EUR")
      return fin(
        total,
        `${codigo}-original; ${codigo === "madrid_adopcion_internacional" ? `${codigo}-regla-10-p4` : `${codigo}-regla-14-p48`}`
      )
    }
    const lentes = codigo === "murcia_cristales_lentes_soluciones_limpieza"
    const idiomas = codigo === "murcia_ensenanza_idiomas"
    const deporte = codigo === "murcia_deporte_actividades_saludables"
    const raras = codigo === "murcia_enfermedades_raras"
    const veterinarios = codigo === "murcia_gastos_veterinarios"
    const conceptos = lentes
      ? ["cristales_graduados", "lentes_contacto", "solucion_limpieza"]
      : idiomas
        ? ["idioma_extranjero_extraescolar"]
        : deporte
          ? [
              "gimnasio",
              "federacion",
              "entrenador",
              "pilates",
              "yoga",
              "cuota_estatutaria_club",
            ]
          : raras
            ? ["tratamiento", "cuidado"]
            : ["servicio_veterinario"]
    const ps = pagos(h.pagos, contribuyente, conceptos, rastro)
    const personas = lista(h.beneficiarios, "beneficiarios").map((x) =>
      objeto(x, "beneficiarios")
    )
    unico(
      personas.map((p) => texto(p.id, "beneficiario.id")),
      "beneficiarios.id"
    )
    if (
      personas.some((p) => !ps.some((pago) => pago.beneficiario === p.id)) ||
      ps.some((p) => !personas.some((b) => b.id === p.beneficiario))
    )
      falta(
        "beneficiarios",
        "Colecciones de pagos y beneficiarios no conciliadas"
      )
    let total = new Decimal(0)
    const edadPagador = deporte
      ? edad(h.nacimientoContribuyente, "nacimientoContribuyente")
      : 0
    for (const p of personas) {
      if (veterinarios) {
        es(p.clase, ["animal_domestico"], "beneficiario.clase")
        if (texto(p.titular, "beneficiario.titular") !== contribuyente)
          falta("beneficiario.titular", "Animal ajeno al contribuyente")
        texto(p.soporteTitularidad, "beneficiario.soporteTitularidad")
      } else if (lentes || idiomas) {
        hijoMinimo(p, contribuyente)
        if (lentes && edad(p.nacimiento, "hijo.nacimiento") >= 12)
          falta(
            "hijo.nacimiento",
            "Gasto óptico de persona de 12 o más años: no elegible"
          )
        if (idiomas) {
          es(
            p.etapa,
            [
              "infantil_segundo_ciclo",
              "primaria",
              "eso",
              "bachillerato",
              "fp_especifica",
            ],
            "hijo.etapa"
          )
          // Se limita al gasto familiar común documentado o progenitor único.
          // No se extiende la mitad a pagos separados de parejas de hecho.
          const padres = ids(
            p.progenitoresConvivientes,
            "hijo.progenitoresConvivientes"
          )
          es(
            p.regimenPago,
            padres.length === 2
              ? ["gananciales_gasto_comun"]
              : ["progenitor_unico"],
            "hijo.regimenPago"
          )
          texto(p.soporteRegimenPago, "hijo.soporteRegimenPago")
        }
      } else {
        const relacion = es(
          p.relacion,
          ["contribuyente", "conyuge", "hijo"],
          "beneficiario.relacion"
        )
        if (relacion === "contribuyente" && p.id !== contribuyente)
          falta("beneficiario.id", "Identidad propia contradictoria")
        if (relacion === "conyuge" && p.id === contribuyente)
          falta(
            "beneficiario.id",
            "El cónyuge y el contribuyente tienen la misma identidad"
          )
        if (relacion === "conyuge")
          texto(
            p.soporteMatrimonioVigente,
            "beneficiario.soporteMatrimonioVigente"
          )
        if (relacion === "hijo") hijoMinimo(p, contribuyente)
        if (raras) {
          const diag = objeto(p.diagnostico, "beneficiario.diagnostico")
          es(diag.clase, ["enfermedad_rara"], "diagnostico.clase")
          texto(diag.certificado, "diagnostico.certificado")
          const f = fecha(diag.fechaEfectos, "diagnostico.fechaEfectos")
          if (ps.some((pago) => pago.beneficiario === p.id && f > "2025-01-01"))
            falta(
              "diagnostico.fechaEfectos",
              "Diagnóstico sobrevenido: falta conciliación temporal de tratamiento y diagnóstico"
            )
        }
      }
      let gasto = ps
        .filter(
          (x) =>
            x.beneficiario === p.id && x.concepto !== "cuota_estatutaria_club"
        )
        .reduce((a, x) => a.plus(x.importe), new Decimal(0))
      if (idiomas)
        gasto = Decimal.min(300, gasto.times("0.15")).div(
          ids(p.progenitoresConvivientes, "hijo.progenitoresConvivientes")
            .length
        )
      total = total.plus(gasto)
    }
    if (idiomas && base.gte(25000))
      return excluir("Idiomas exige base estrictamente inferior a 25.000 EUR")
    if ((deporte || veterinarios) && base.gt(25000))
      return excluir("Base superior a 25.000 EUR")
    if (lentes) total = Decimal.min(100, total.times("0.30"))
    if (deporte)
      total = Decimal.min(150, total.times(edadPagador > 65 ? 1 : "0.30"))
    if (raras) total = Decimal.min(300, total)
    if (veterinarios) total = Decimal.min(100, total.times("0.30"))
    return fin(
      total,
      `${codigo}-original${deporte ? `; ${codigo}-c8 (edad del pagador)` : ""}`
    )
  } catch (e) {
    if (!Schema.is(FaltaHecho)(e)) throw e
    return {
      codigo,
      estado: "no_soportado",
      motivo: e.message,
      siguienteHecho: e.campo,
      rastro,
      reservas: [],
    }
  }
}

/** La función pública decodifica en la frontera; el núcleo sólo recibe hechos tipados. */
export const evaluarTerritorialF2025 = Function.flow(
  decodificarTerritorialF,
  evaluarDecodificada
)

/** Sin total: rechaza códigos y operaciones repetidos entre solicitudes.
 * El padre compondrá cuota una vez. No mezclar este lote con consignaciones. */
export function evaluarLoteTerritorialF2025(
  entradas: readonly SolicitudTerritorialF2025[]
): readonly ResultadoTerritorialF2025[] {
  const codigos = new Set<string>()
  const pagosVistos = new Set<string>()
  return entradas.map((entrada) => {
    const decoded = decodificarTerritorialF(entrada)
    if (Result.isFailure(decoded)) return evaluarDecodificada(decoded)
    const s = decoded.success
    const pagosIds = (s.hechos.pagos ?? []).flatMap((p) =>
      p.id === undefined ? [] : [p.id]
    )
    const duplicado =
      codigos.has(s.codigo) || pagosIds.some((id) => pagosVistos.has(id))
    codigos.add(s.codigo)
    pagosIds.forEach((id) => pagosVistos.add(id))
    if (duplicado)
      return {
        codigo: s.codigo,
        estado: "no_soportado",
        motivo:
          "Código o pago ya solicitado: requiere elección explícita y conciliación",
        siguienteHecho: "eleccionYLibroPagos",
        rastro: [],
        reservas: [],
      }
    return evaluarDecodificada(decoded)
  })
}
