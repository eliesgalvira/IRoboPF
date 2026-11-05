import Decimal from "decimal.js"
import { Schema } from "effect"

/** Módulo puro: genera derechos parciales; no liquida ni consume cuota. */
const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
export const CODIGOS_CATALUNYA_HECHOS_2025 = [
  "cataluna_donativos_lengua_catalana_occitana",
  "cataluna_donativos_idi",
  "cataluna_donaciones_medio_ambiente_patrimonio_natural",
  "cataluna_nacimiento_adopcion_acogimiento",
  "cataluna_viudedad_2023_2024_2025",
  "cataluna_intereses_prestamos_master_doctorado",
] as const
export type CodigoCatalunyaHechos2025 =
  (typeof CODIGOS_CATALUNYA_HECHOS_2025)[number]

const Centimos = Schema.Number.check(
  Schema.isInt(),
  Schema.isGreaterThanOrEqualTo(0),
  Schema.isLessThanOrEqualTo(Number.MAX_SAFE_INTEGER)
)
const Anio = Schema.Number.check(
  Schema.isInt(),
  Schema.isGreaterThanOrEqualTo(1),
  Schema.isLessThanOrEqualTo(2025)
)
const Texto = Schema.String.check(Schema.isMinLength(1))
const pagoCampos = {
  id: Texto,
  fecha: Texto,
  pagador: Texto,
  importeCentimos: Centimos,
  justificante: Texto,
}
const Pago = Schema.Struct(pagoCampos)
type Pago = typeof Pago.Type
const Donativo = Schema.Struct({
  ...pagoCampos,
  entidad: Texto,
  claseEntidad: Schema.Literals([
    "iec",
    "iea",
    "privada-sin-lucro",
    "sindicato",
    "empresarial",
    "colegio-corporacion",
    "universidad-catalana",
    "centro-universitario-catalan",
    "centro-generalitat",
    "fundacion",
    "asociacion",
  ]),
  calificacionEntidad: Texto,
  censo: Schema.Literals(["incluida", "no-incluida", "no-exigible"]),
  referenciaCenso: Schema.String,
  finalidad: Schema.Literals([
    "lengua-catalana-occitana",
    "investigacion-desarrollo-innovacion",
    "medio-ambiente",
  ]),
  certificado: Texto,
  modelo993: Schema.Struct({
    fecha: Texto,
    ejercicioInformado: Schema.Literal(2025),
    via: Schema.Literal("telematica"),
    referencia: Texto,
  }),
  deduccionEstatalMismoDonativoCentimos: Centimos,
})
const Evento = Schema.Struct({
  id: Texto,
  persona: Texto,
  fecha: Texto,
  nacimiento: Texto,
  clase: Schema.Literals(["nacimiento", "adopcion", "acogimiento"]),
  titulares: Schema.Array(Texto),
  tituloVinculo: Texto,
  familia: Schema.Literals(["ordinaria", "monoparental"]),
  tituloMonoparental: Schema.String,
  normaAcogimiento: Schema.Literals(["Ley14/2010", "no-aplica"]),
  acuerdoAcogimiento: Schema.String,
  antecedenteAcogimiento: Schema.optional(
    Schema.Struct({
      persona: Texto,
      contribuyente: Texto,
      estado: Schema.Literals([
        "sin-acogimiento-previo",
        "previo",
        "desconocido",
      ]),
      soporte: Texto,
    })
  ),
})
const contexto = {
  ejercicio: Schema.Literal(2025),
  territorio: Schema.Literal("catalunya"),
  modalidad: Schema.Literal("individual"),
  contribuyente: Texto,
  devengo: Schema.Literal("2025-12-31"),
}
export const SolicitudCatalunyaHechos2025 = Schema.Union([
  Schema.Struct({
    ...contexto,
    codigo: Schema.Literals([
      "cataluna_donativos_lengua_catalana_occitana",
      "cataluna_donativos_idi",
      "cataluna_donaciones_medio_ambiente_patrimonio_natural",
    ]),
    cuotaIntegraAutonomicaCentimos: Schema.optional(Centimos),
    cuotaIntegraAutonomicaEuros: Schema.optional(
      Schema.String.check(Schema.isPattern(/^\d+(\.\d{1,80})?$/))
    ),
    donativos: Schema.Array(Donativo),
  }),
  Schema.Struct({
    ...contexto,
    codigo: Schema.Literal("cataluna_nacimiento_adopcion_acogimiento"),
    eventos: Schema.Array(Evento),
  }),
  Schema.Struct({
    ...contexto,
    codigo: Schema.Literal("cataluna_viudedad_2023_2024_2025"),
    viudedad: Schema.Struct({
      fecha: Texto,
      certificado: Texto,
      descendientes: Schema.Array(
        Schema.Struct({
          id: Texto,
          ejerciciosConMinimo: Schema.Array(Anio),
          referenciaDerechos: Texto,
        })
      ),
    }),
  }),
  Schema.Struct({
    ...contexto,
    codigo: Schema.Literal("cataluna_intereses_prestamos_master_doctorado"),
    prestamos: Schema.Array(
      Schema.Struct({
        id: Texto,
        prestatario: Texto,
        canal: Schema.Literals(["AGAUR", "otro"]),
        tituloConcesion: Texto,
        estudios: Schema.Literals(["master", "doctorado", "otros"]),
        pagosIntereses: Schema.Array(Pago),
      })
    ),
  }),
])
export type SolicitudCatalunyaHechos2025 =
  typeof SolicitudCatalunyaHechos2025.Type
export type ResultadoCatalunyaHechos2025 =
  | { estado: "no_soportado" | "excluida"; motivo: string }
  | {
      estado: "calculo_parcial"
      importeExactoEuros: string
      importePresentadoCentimos: number
      aceptacionFiscal: "pendiente"
      motivo: string
      citas: readonly string[]
    }

function fallo(motivo: string): never {
  throw new RangeError(motivo)
}
function texto(x: string): string {
  if (x.trim() === "") fallo("Falta referencia o identidad específica")
  return x
}
function opcion(x: string, opciones: readonly string[]): string {
  texto(x)
  if (!opciones.includes(x)) fallo("Discriminante no soportado: " + x)
  return x
}
function ids(xs: readonly string[]): void {
  if (new Set(xs).size !== xs.length) fallo("Identidad duplicada")
}
function fecha(x: string): string {
  const s = texto(x)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) fallo("Fecha civil inválida")
  const [anio, mes, dia] = s.split("-").map(Number)
  const bisiesto = anio % 4 === 0 && (anio % 100 !== 0 || anio % 400 === 0)
  const diasMes = [
    31,
    bisiesto ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ]
  if (anio < 1 || mes < 1 || mes > 12 || dia < 1 || dia > diasMes[mes - 1])
    fallo("Fecha civil inválida")
  return s
}
function dinero(centimos: number): Decimal {
  return new D(centimos).div(100)
}
function pago(p: Pago, contribuyente: string): Decimal {
  texto(p.id)
  texto(p.justificante)
  const f = fecha(p.fecha)
  if (!f.startsWith("2025-"))
    fallo("Pago fuera de 2025: separar el período antes de evaluar")
  if (texto(p.pagador) !== contribuyente)
    fallo("Pago de otro titular: no se infiere atribución")
  return dinero(p.importeCentimos)
}
function parcial(
  importe: Decimal,
  citas: readonly string[]
): ResultadoCatalunyaHechos2025 {
  const centimos = importe.times(100).toDecimalPlaces(0, D.ROUND_HALF_UP)
  if (centimos.gt(Number.MAX_SAFE_INTEGER))
    fallo("Importe presentado fuera del rango seguro")
  return {
    estado: "calculo_parcial",
    importeExactoEuros: importe.toFixed(),
    importePresentadoCentimos: centimos.toNumber(),
    aceptacionFiscal: "pendiente",
    citas,
    motivo:
      "Hechos jurídicos y referencias aportados, sin verificación documental automática. Importe generado antes de cuota compartida; céntimos presentados HALF_UP, exacto conservado. No acredita liquidación ni aceptación fiscal.",
  }
}

/** Valida de nuevo al ejecutar para proteger también llamadas JavaScript. */
export function evaluarCatalunyaHechos2025(
  entrada: SolicitudCatalunyaHechos2025
): ResultadoCatalunyaHechos2025 {
  try {
    const h = Schema.decodeUnknownSync(SolicitudCatalunyaHechos2025)(entrada, {
      onExcessProperty: "error",
    })
    const codigo = h.codigo
    const titular = texto(h.contribuyente)
    let importe = new D(0)
    if ("donativos" in h) {
      if (
        (h.cuotaIntegraAutonomicaCentimos === undefined) ===
        (h.cuotaIntegraAutonomicaEuros === undefined)
      )
        fallo("Se exige una sola representación de cuota")
      const cuota =
        h.cuotaIntegraAutonomicaEuros === undefined
          ? dinero(h.cuotaIntegraAutonomicaCentimos!)
          : new D(h.cuotaIntegraAutonomicaEuros)
      const investigacion = codigo === "cataluna_donativos_idi"
      const ambiente =
        codigo === "cataluna_donaciones_medio_ambiente_patrimonio_natural"
      ids(h.donativos.map((d) => texto(d.id)))
      for (const d of h.donativos) {
        const base = pago(d, titular)
        texto(d.entidad)
        texto(d.calificacionEntidad)
        texto(d.certificado)
        const clase = opcion(
          d.claseEntidad,
          investigacion
            ? [
                "universidad-catalana",
                "centro-universitario-catalan",
                "centro-generalitat",
              ]
            : ambiente
              ? ["fundacion", "asociacion"]
              : [
                  "iec",
                  "iea",
                  "privada-sin-lucro",
                  "sindicato",
                  "empresarial",
                  "colegio-corporacion",
                ]
        )
        opcion(d.finalidad, [
          investigacion
            ? "investigacion-desarrollo-innovacion"
            : ambiente
              ? "medio-ambiente"
              : "lengua-catalana-occitana",
        ])
        if (!investigacion && !["iec", "iea"].includes(clase)) {
          if (d.censo !== "incluida")
            fallo(
              "Destinatario requiere inclusión acreditada en censo específico"
            )
          texto(d.referenciaCenso)
        } else if (d.censo === "no-incluida")
          fallo(
            "Calificación del destinatario contradictoria; precisar censo aplicable"
          )
        const f = fecha(d.modelo993.fecha)
        texto(d.modelo993.referencia)
        if (f < "2026-01-01" || f > "2026-01-20")
          fallo(
            "Modelo 993 fuera del régimen ordinario: falta resolver presentación/corrección particular"
          )
        const estatal = dinero(d.deduccionEstatalMismoDonativoCentimos)
        if (estatal.gt(base))
          fallo("Deducción estatal del mismo donativo supera el donativo")
        const teorico = base.times(investigacion ? "0.30" : "0.15")
        importe = importe.plus(
          investigacion ? D.min(teorico, base.minus(estatal)) : teorico
        )
      }
      importe = D.min(importe, cuota.times(ambiente ? "0.05" : "0.10"))
      return parcial(importe, [
        investigacion
          ? "CA-catalunya-2025-172"
          : ambiente
            ? "CA-catalunya-2025-177"
            : "CA-catalunya-2025-167",
        "RAA-VEH-1-1",
        "RAA-VEH-2-4",
        "RAA-VEH-2-5",
      ])
    }
    if ("eventos" in h) {
      ids(h.eventos.map((e) => texto(e.id)))
      const personas = h.eventos.map((e) => texto(e.persona))
      if (new Set(personas).size !== personas.length)
        fallo(
          "Misma persona con varios eventos: resolver incompatibilidad adopción/acogimiento o duplicado"
        )
      for (const e of h.eventos) {
        const f = fecha(e.fecha),
          n = fecha(e.nacimiento)
        if (n > f || !f.startsWith("2025-"))
          fallo("Evento fuera del período o anterior al nacimiento")
        if (e.clase === "nacimiento" && n !== f)
          fallo("Nacimiento no concilia con fecha del evento")
        const ts = e.titulares.map(texto)
        ids(ts)
        if (ts.includes(e.persona))
          fallo(
            "La persona nacida, adoptada o acogida no puede ser uno de sus titulares"
          )
        if (!ts.includes(titular) || ts.length > 2)
          fallo("Censo de titulares incompatible con contribuyente")
        texto(e.tituloVinculo)
        if (e.clase === "adopcion") {
          const antecedente = e.antecedenteAcogimiento
          if (antecedente === undefined || antecedente.estado === "desconocido")
            fallo(
              "Adopción: falta resolver el acogimiento previo de esa persona por este contribuyente"
            )
          if (
            texto(antecedente.persona) !== e.persona ||
            texto(antecedente.contribuyente) !== titular
          )
            fallo("Antecedente de acogimiento de otra persona o contribuyente")
          texto(antecedente.soporte)
          if (antecedente.estado === "previo")
            fallo(
              "Adopción posterior a acogimiento: no generar una segunda deducción; separar esta rama incompatible"
            )
        }
        if (e.familia === "monoparental") texto(e.tituloMonoparental)
        if (e.clase === "acogimiento") {
          if (e.normaAcogimiento !== "Ley14/2010")
            fallo("Acogimiento sin acuerdo bajo Ley14/2010")
          texto(e.acuerdoAcogimiento)
          const mayoria =
            String(Number(n.slice(0, 4)) + 18).padStart(4, "0") + n.slice(4)
          if (f >= mayoria)
            fallo("Acogimiento de mayor de edad: rama no habilitada")
        } else if (e.normaAcogimiento !== "no-aplica")
          fallo("Norma de acogimiento contradictoria")
        importe = importe.plus(e.familia === "monoparental" ? 300 : 150)
      }
      return parcial(importe, [
        "CA-DOGC-DL5-2025-612-1-14-3",
        "CA-DOGC-DL5-2025-612-1-14-4",
        "CA-DOGC-DL5-2025-612-1-14-5",
        "CA-DOGC-DL5-2025-612-1-14-6",
      ])
    }
    if ("viudedad" in h) {
      const v = h.viudedad
      const f = fecha(v.fecha)
      texto(v.certificado)
      if (f > "2025-12-31") fallo("Viudedad posterior al devengo")
      const anio = Number(f.slice(0, 4))
      ids(v.descendientes.map((d) => texto(d.id)))
      let incremento = false
      for (const d of v.descendientes) {
        texto(d.referenciaDerechos)
        const anos = d.ejerciciosConMinimo
        if (anos.some((a) => a < anio) || new Set(anos).size !== anos.length)
          fallo("Historial de mínimo inválido")
        // Sólo rama inequívoca: un mismo descendiente mantiene derecho todos los años.
        if (
          anio >= 2023 &&
          Array.from({ length: 2026 - anio }, (_, i) => anio + i).every((a) =>
            anos.includes(a)
          )
        )
          incremento = true
        else if (anos.includes(2025))
          fallo(
            "Incremento con cambio/interrupción de descendientes: precisar mantenimiento legal"
          )
      }
      if (anio < 2023)
        return {
          estado: "excluida",
          motivo:
            "Finalizó la ventana del año de viudedad y los dos siguientes",
        }
      return parcial(new D(incremento ? 300 : 150), [
        "CA-catalunya-2025-133",
        "CA-catalunya-2025-134",
      ])
    }
    ids(h.prestamos.map((p) => texto(p.id)))
    const pagos: string[] = []
    for (const p of h.prestamos) {
      texto(p.tituloConcesion)
      if (texto(p.prestatario) !== titular) fallo("Préstamo de otro titular")
      for (const q of p.pagosIntereses) {
        const valor = pago(q, titular)
        pagos.push(texto(q.id))
        if (p.canal === "AGAUR" && p.estudios !== "otros")
          importe = importe.plus(valor)
      }
    }
    ids(pagos)
    return parcial(importe, ["CA-catalunya-2025-163", "CA-catalunya-2025-164"])
  } catch (e) {
    return {
      estado: "no_soportado",
      motivo:
        e instanceof RangeError
          ? e.message
          : "Hechos no conformes al esquema territorial: faltan campos, sobran campos o el ámbito/discriminante es inválido",
    }
  }
}
