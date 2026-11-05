import type Decimal from "decimal.js"
import { Schema } from "effect"
import {
  D,
  Texto,
  Centimos,
  Pago,
  type Ambito,
  exigir,
  fecha,
  ref,
  pagos,
  eur,
  unicos,
} from "./comun"

/** Hechos históricos, sin exigir DT18 a las deducciones autonómicas que sólo remiten a conceptos2012. */
export const Vivienda = Schema.Struct({
  id: Texto,
  adquisicion: Texto,
  terminacionObras: Texto,
  ocupacion: Texto,
  residenciaDesde: Texto,
  situacion: Schema.Literals([
    "residencia-continuada",
    "pendiente-tres-anios",
    "cambio-necesario",
    "divorcio-hijos",
    "no-ocupada",
  ]),
  referenciaOcupacion: Texto,
  referenciaMantenimiento: Texto,
  operacion: Schema.Literals([
    "adquisicion",
    "rehabilitacion",
    "adecuacion-discapacidad",
    "construccion",
  ]),
  anterior: Schema.Literals([
    "primera-vivienda",
    "sin-deducciones-previas",
    "con-deducciones-previas",
  ]),
  inversionAcumuladaAntes2025Centimos: Centimos,
  baseDeducidaViviendasAnterioresCentimos: Centimos,
  gananciaExentaReinversionCentimos: Centimos,
  incrementoPatrimonialComputableCentimos: Centimos,
  referenciaPatrimonio: Texto,
  pagosCapitalYGastos: Schema.Array(Pago),
  pagosIntereses: Schema.Array(Pago),
  coberturasInteresesPercibidasCentimos: Centimos,
  rehabilitacion: Schema.Struct({
    via: Schema.Literals([
      "no-aplica",
      "actuacion-protegida",
      "reconstruccion-estructural",
    ]),
    inicio: Texto,
    resolucionPlan: Schema.String,
    costeGlobalCentimos: Centimos,
    valorSinSueloCentimos: Centimos,
    referenciaValoracion: Schema.String,
    fechaValoracion: Texto,
    naturalezaValor: Schema.Literals([
      "adquisicion-dos-anios",
      "mercado-inicio",
    ]),
    memoriaEstructurasFachadasCubiertas: Schema.String,
  }),
  transitorio: Schema.Struct({
    primeraInversion: Texto,
    primeraInversionNaturaleza: Schema.optional(
      Schema.Literals([
        "adquisicion",
        "construccion",
        "anticipo-vivienda-terminada",
      ])
    ),
    referenciaPrimeraInversion: Schema.optional(Texto),
    deduccionAntes2013: Schema.Literals([
      "practicada",
      "excepcion-68.1.2",
      "no-practicada",
    ]),
    referencia: Schema.String,
    finObras: Texto,
    resolucionAdecuacionDiscapacidad: Schema.String,
  }),
})
export type Vivienda = typeof Vivienda.Type
export function habitual(v: Vivienda): void {
  const compra = fecha(v.adquisicion),
    fin = fecha(v.terminacionObras),
    oc = fecha(v.ocupacion)
  fecha(v.residenciaDesde)
  ref(v.referenciaOcupacion)
  ref(v.referenciaMantenimiento)
  exigir(
    v.situacion === "residencia-continuada" ||
      v.situacion === "pendiente-tres-anios",
    "Cambio necesario/divorcio/no ocupada: aportar encaje específico art54 histórico; esta rama conserva motivos y no genera importe"
  )
  exigir(
    fin <= "2025-12-31",
    "Obras pendientes: concretar ocupación futura antes de generar base"
  )
  const inicio = compra
  const limite = String(Number(inicio.slice(0, 4)) + 1) + inicio.slice(4)
  exigir(
    oc >= inicio &&
      oc <= limite &&
      oc <= "2025-12-31" &&
      v.residenciaDesde <= oc,
    "Ocupación efectiva fuera de doce meses o posterior al devengo"
  )
  if (v.situacion === "residencia-continuada")
    exigir(
      v.residenciaDesde <= "2022-12-31",
      "No constan tres años continuados de residencia"
    )
}
export function rehabilitacion(v: Vivienda): void {
  const r = v.rehabilitacion
  const inicio = fecha(r.inicio)
  fecha(r.fechaValoracion)
  if (r.via === "actuacion-protegida") {
    ref(r.resolucionPlan)
    return
  }
  exigir(
    r.via === "reconstruccion-estructural",
    "Obra no calificada como rehabilitación histórica"
  )
  ref(r.memoriaEstructurasFachadasCubiertas)
  ref(r.referenciaValoracion)
  if (r.naturalezaValor === "adquisicion-dos-anios")
    exigir(
      v.adquisicion <= inicio &&
        v.adquisicion >=
          String(Number(inicio.slice(0, 4)) - 2) + inicio.slice(4),
      "Precio adquisición fuera de los dos años anteriores"
    )
  else
    exigir(
      r.fechaValoracion === inicio,
      "Valor de mercado no referido al inicio de las obras"
    )
  exigir(
    r.valorSinSueloCentimos > 0 &&
      eur(r.costeGlobalCentimos).gt(eur(r.valorSinSueloCentimos).times("0.25")),
    "Reconstrucción no supera estrictamente25% del valor sin suelo"
  )
}
export function baseVivienda(
  v: Vivienda,
  h: Ambito,
  bancario: boolean,
  adecuacion = false
): Decimal {
  habitual(v)
  ref(v.referenciaPatrimonio)
  unicos([...v.pagosCapitalYGastos, ...v.pagosIntereses].map((p) => p.id))
  exigir(
    v.operacion !== "construccion",
    "Construcción con prórrogas y pagos a promotor: concretar cronología y límites históricos antes de generar base"
  )
  if (v.operacion === "rehabilitacion") rehabilitacion(v)
  if (v.operacion === "adecuacion-discapacidad")
    ref(v.transitorio.resolucionAdecuacionDiscapacidad)
  const capital = pagos(v.pagosCapitalYGastos, h, bancario)
  const intereses = D.max(
    0,
    pagos(v.pagosIntereses, h, bancario).minus(
      eur(v.coberturasInteresesPercibidasCentimos)
    )
  )
  exigir(
    eur(v.incrementoPatrimonialComputableCentimos).gte(capital),
    "Incremento patrimonial computable no cubre inversión sin financiación/intereses"
  )
  const obstaculo = eur(v.baseDeducidaViviendasAnterioresCentimos).plus(
    eur(v.gananciaExentaReinversionCentimos)
  )
  if (v.anterior !== "con-deducciones-previas")
    exigir(
      v.baseDeducidaViviendasAnterioresCentimos === 0,
      "Base de vivienda anterior contradictoria"
    )
  const pendiente = D.max(
    0,
    obstaculo.minus(eur(v.inversionAcumuladaAntes2025Centimos))
  )
  return D.min(
    adecuacion ? 12080 : 9040,
    D.max(0, capital.plus(intereses).minus(pendiente))
  )
}
export function transitorio(v: Vivienda): void {
  const t = v.transitorio
  ref(t.referencia)
  const primera = fecha(t.primeraInversion)
  exigir(primera < "2013-01-01", "DT18: primera inversión no anterior2013")
  exigir(
    t.deduccionAntes2013 !== "no-practicada",
    "DT18: sin deducción anterior2013 ni excepción68.1.2"
  )
  if (v.operacion === "adquisicion")
    exigir(v.adquisicion < "2013-01-01", "DT18: adquisición posterior2012")
  else
    exigir(
      fecha(t.finObras) < "2017-01-01",
      "DT18: obras no terminadas antes2017"
    )
}

/** Art. 613-1.2: adquisición o pagos para construcción; no cualquier anticipo. */
export function anteriorJulio2011(v: Vivienda): boolean {
  const compra = fecha(v.adquisicion)
  const primera = fecha(v.transitorio.primeraInversion)
  const naturaleza = v.transitorio.primeraInversionNaturaleza
  exigir(primera <= compra, "Primera inversión posterior a adquisición")
  if (naturaleza !== undefined) {
    ref(v.transitorio.referenciaPrimeraInversion ?? "")
    if (naturaleza === "adquisicion")
      exigir(
        primera === compra,
        "Adquisición histórica con fechas contradictorias"
      )
  }
  if (compra < "2011-07-30") return true
  if (primera >= "2011-07-30") return false
  exigir(
    naturaleza !== undefined,
    "Falta distinguir pago para construcción de anticipo de vivienda terminada"
  )
  return naturaleza === "construccion"
}
