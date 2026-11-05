import type { Marco, Pago, Territorio } from "./comun"
import { dinero, positivo, marco, pagos, fecha, texto, unico, magnitudAnual } from "./comun"

/** Fracción racional: ni días/365 ni los repartos se redondean antes de cuota. */
export class RacionalC {
  readonly n: bigint
  readonly d: bigint
  constructor(n: bigint, d = 1n) {
    if (d === 0n) throw new RangeError("Denominador cero")
    let a = n < 0n ? -n : n
    let b = d < 0n ? -d : d
    while (b !== 0n) {
      const r = a % b
      a = b
      b = r
    }
    const g = a === 0n ? 1n : a
    this.n = (n / g) * (d < 0n ? -1n : 1n)
    this.d = (d / g) * (d < 0n ? -1n : 1n)
  }
  sumar(q: RacionalC): RacionalC {
    return new RacionalC(this.n * q.d + q.n * this.d, this.d * q.d)
  }
  restar(q: RacionalC): RacionalC {
    return new RacionalC(this.n * q.d - q.n * this.d, this.d * q.d)
  }
  por(q: RacionalC): RacionalC {
    return new RacionalC(this.n * q.n, this.d * q.d)
  }
  dividir(q: RacionalC): RacionalC {
    return new RacionalC(this.n * q.d, this.d * q.n)
  }
  comparar(q: RacionalC): bigint {
    return this.n * q.d - q.n * this.d
  }
  minimo(q: RacionalC): RacionalC {
    return this.comparar(q) <= 0n ? this : q
  }
  maximo(q: RacionalC): RacionalC {
    return this.comparar(q) >= 0n ? this : q
  }
}
export const enteroC = (n: number): RacionalC => {
  comprobar(Number.isSafeInteger(n), "Entero inválido")
  return new RacionalC(BigInt(n))
}
export function eurosC(s: string): RacionalC {
  return new RacionalC(BigInt(dinero(s).times(100).toFixed(0)), 100n)
}
/** Transporte exacto de magnitudes del motor; los pagos conservan el parser de céntimos. */
export function eurosAnualesC(s: string): RacionalC {
  magnitudAnual(s)
  const [entera, fraccion = ""] = s.split(".")
  return new RacionalC(BigInt(entera + fraccion), 10n ** BigInt(fraccion.length))
}
export function noNegativoAnualC(s: string): RacionalC {
  const valor = eurosAnualesC(s)
  comprobar(valor.n >= 0n, "Magnitud anual negativa")
  return valor
}
export function noNegativoC(s: string): RacionalC {
  positivo(s)
  return eurosC(s)
}
export const ceroC = (): RacionalC => enteroC(0)
export function comprobar(
  condicion: boolean,
  motivo: string
): asserts condicion {
  if (!condicion) throw new RangeError(motivo)
}
export type DeclaracionC = Marco & {
  declarantes: readonly string[]
  miembrosUnidadFamiliar: readonly string[]
}

/** Puerto INTERNO del motor anual, separado del DTO de hechos del usuario.
 * Las magnitudes se obtienen de una misma liquidación antes de deducciones C.
 * La etiqueta identifica el contrato, no autentica por sí sola su procedencia. */
export type MagnitudesAnualesC = {
  origen: "motor_anual"
  calculoId: string
  ejercicio: 2025
  devengo: string
  declarantes: readonly string[]
  cuotaIntegraAutonomica: string
  baseLiquidableGeneral: string
  baseLiquidableAhorro: string
  personas: readonly {
    persona: string
    imponibleGeneral: string
    imponibleAhorro: string
    liquidableGeneral: string
    liquidableAhorro: string
    rendimientosTrabajoActividad?: string | undefined
  }[]
  minimos: readonly {
    beneficiario: string
    tipo: "descendiente" | "ascendiente" | "discapacidad" | "asistencia"
    titulares: readonly string[]
  }[]
}
export type LimiteComposicionC =
  | {
      grupo: "cuota_autonomica" | "canarias_arts6_14_14bis_14ter"
      porcentaje: string
    }
  | { grupo: "limite_codigo"; codigo: string; porcentaje: string }
export type ResultadoAmpliacionC =
  | {
      estado: "calculo_parcial"
      importeExacto: { numerador: string; denominador: string }
      presentacionEuros: string
      rastro: readonly string[]
      reservas: readonly string[]
      limitesComposicion: readonly LimiteComposicionC[]
      aceptacionFiscal: "pendiente"
    }
  | { estado: "no_soportado"; motivo: string; rastro: readonly string[] }
export function validarDeclaracionC(
  h: DeclaracionC,
  territorio: Territorio
): void {
  marco({ ...h, modalidad: "individual" }, territorio)
  comprobar(
    h.modalidad === "individual" || h.modalidad === "conjunta",
    "Modalidad desconocida"
  )
  unico(h.declarantes)
  unico(h.miembrosUnidadFamiliar)
  comprobar(
    h.declarantes.includes(h.contribuyente) &&
      h.declarantes.every((p) => h.miembrosUnidadFamiliar.includes(p)) &&
      (h.modalidad === "individual"
        ? h.declarantes.length === 1
        : h.miembrosUnidadFamiliar.length >= 2),
    "Identidades y modalidad inconsistentes"
  )
}
export function anualesC(h: DeclaracionC, m: MagnitudesAnualesC): void {
  texto(m.calculoId)
  comprobar(
    m.origen === "motor_anual" &&
      m.ejercicio === 2025 &&
      m.devengo === h.devengo,
    "Magnitudes de otro cálculo/ejercicio/devengo"
  )
  unico(m.declarantes)
  unico(m.personas.map((p) => p.persona))
  comprobar(
    m.declarantes.length === h.declarantes.length &&
      m.declarantes.every((p) => h.declarantes.includes(p)) &&
      m.personas.length === h.declarantes.length &&
      m.personas.every((p) => h.declarantes.includes(p.persona)),
    "Magnitudes sin todos los contribuyentes identificados"
  )
  noNegativoAnualC(m.cuotaIntegraAutonomica)
  eurosAnualesC(m.baseLiquidableGeneral)
  eurosAnualesC(m.baseLiquidableAhorro)
  m.personas.forEach((p) => {
    eurosAnualesC(p.imponibleGeneral)
    eurosAnualesC(p.imponibleAhorro)
    eurosAnualesC(p.liquidableGeneral)
    eurosAnualesC(p.liquidableAhorro)
    if(p.rendimientosTrabajoActividad !== undefined) eurosAnualesC(p.rendimientosTrabajoActividad)
  })
  const base = m.personas.reduce(
    (s, p) =>
      s.sumar(eurosAnualesC(p.imponibleGeneral)).sumar(eurosAnualesC(p.imponibleAhorro)),
    ceroC()
  )
  comprobar(
    base.comparar(rentaC(h)) === 0n,
    "Renta declarada distinta del resultado anual identificado"
  )
  const liquidable = m.personas.reduce(
    (s, p) =>
      s.sumar(eurosAnualesC(p.liquidableGeneral)).sumar(eurosAnualesC(p.liquidableAhorro)),
    ceroC()
  )
  comprobar(
    liquidable.comparar(
      eurosAnualesC(m.baseLiquidableGeneral).sumar(eurosAnualesC(m.baseLiquidableAhorro))
    ) === 0n,
    "Atribución de base liquidable no concuerda con declaración"
  )
}
export function evaluarC(
  h: DeclaracionC,
  territorio: Territorio,
  f: () => ResultadoAmpliacionC
): ResultadoAmpliacionC {
  try {
    validarDeclaracionC(h, territorio)
    return f()
  } catch (e) {
    return {
      estado: "no_soportado",
      motivo:
        e instanceof RangeError
          ? e.message
          : "Hechos incompletos o malformados",
      rastro: ["Sin deducción ni impuesto inferidos"],
    }
  }
}
export function resultadoC(
  q: RacionalC,
  rastro: readonly string[],
  reservas: readonly string[] = [],
  viviendaGrupo = false,
  limiteCodigo?: { codigo: string; porcentaje: string }
): ResultadoAmpliacionC {
  comprobar(q.n >= 0n, "Cuantía negativa")
  // Redondeo half-up exacto sobre enteros; no aproxima cocientes periódicos.
  const centimos = (q.n * 200n + q.d) / (q.d * 2n)
  const presentacionEuros =
    (centimos / 100n).toString() +
    "." +
    (centimos % 100n).toString().padStart(2, "0")
  return {
    estado: "calculo_parcial",
    importeExacto: { numerador: q.n.toString(), denominador: q.d.toString() },
    presentacionEuros,
    rastro,
    reservas: [
      "Referencias particulares pendientes de cotejo; no certifican autenticidad ni admisión fiscal",
      "Cuota disponible, incompatibilidades y aplicación única a cargo de composición anual",
      ...reservas,
    ],
    limitesComposicion: [
      { grupo: "cuota_autonomica", porcentaje: "100" },
      ...(viviendaGrupo
        ? [
            {
              grupo: "canarias_arts6_14_14bis_14ter" as const,
              porcentaje: "15",
            },
          ]
        : []),
      ...(limiteCodigo === undefined
        ? []
        : [
            {
              grupo: "limite_codigo" as const,
              codigo: limiteCodigo.codigo,
              porcentaje: limiteCodigo.porcentaje,
            },
          ]),
    ],
    aceptacionFiscal: "pendiente",
  }
}
export function rentaC(h: DeclaracionC): RacionalC {
  return eurosAnualesC(h.baseGeneral).sumar(eurosAnualesC(h.baseAhorro))
}
export function accesoC(
  h: DeclaracionC,
  individual: number,
  conjunta: number,
  factor = enteroC(1)
): void {
  comprobar(
    rentaC(h).comparar(
      enteroC(h.modalidad === "individual" ? individual : conjunta).por(factor)
    ) <= 0n,
    "Renta superior al límite inclusivo"
  )
}
export function personaC(h: DeclaracionC, id: string): void {
  texto(id)
  comprobar(
    h.declarantes.includes(id),
    "Contribuyente no incluido en declaración"
  )
}
export function periodoC(h: DeclaracionC, s: string): void {
  fecha(s)
  comprobar(
    s >= "2025-01-01" && s <= h.devengo,
    "Fecha fuera del período fiscal real"
  )
}
export function ordinalC(s: string): number {
  fecha(s)
  const [y, m, d] = s.split("-").map(Number)
  const bisiesto = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)
  return (
    [
      0,
      31,
      bisiesto ? 60 : 59,
      bisiesto ? 91 : 90,
      bisiesto ? 121 : 120,
      bisiesto ? 152 : 151,
      bisiesto ? 182 : 181,
      bisiesto ? 213 : 212,
      bisiesto ? 244 : 243,
      bisiesto ? 274 : 273,
      bisiesto ? 305 : 304,
      bisiesto ? 335 : 334,
    ][m - 1] + d
  )
}
export function diasC(
  h: DeclaracionC,
  intervalos: readonly { desde: string; hasta: string }[]
): number {
  const ocupados = new Set<number>()
  for (const i of intervalos) {
    periodoC(h, i.desde)
    periodoC(h, i.hasta)
    comprobar(i.desde <= i.hasta, "Intervalo invertido")
    for (let d = ordinalC(i.desde); d <= ordinalC(i.hasta); d++) {
      comprobar(!ocupados.has(d), "Días duplicados/solapados")
      ocupados.add(d)
    }
  }
  return ocupados.size
}
export function diasUnionC(
  h: DeclaracionC,
  intervalos: readonly { desde: string; hasta: string }[]
): number {
  const dias = new Set<number>()
  for (const i of intervalos) {
    periodoC(h, i.desde)
    periodoC(h, i.hasta)
    comprobar(i.desde <= i.hasta, "Intervalo invertido")
    for (let d = ordinalC(i.desde); d <= ordinalC(i.hasta); d++) dias.add(d)
  }
  return dias.size
}
export function recortarPeriodoC(
  h: DeclaracionC,
  desde: string,
  hasta: string
): readonly { desde: string; hasta: string }[] {
  fecha(desde)
  fecha(hasta)
  comprobar(desde <= hasta, "Intervalo invertido")
  const inicio = desde < "2025-01-01" ? "2025-01-01" : desde,
    fin = hasta > h.devengo ? h.devengo : hasta
  return inicio <= fin ? [{ desde: inicio, hasta: fin }] : []
}
export function aniversarioC(s: string, anos: number): string {
  fecha(s)
  const y = Number(s.slice(0, 4)) + anos
  const md =
    s.slice(5) === "02-29" && (y % 4 !== 0 || (y % 100 === 0 && y % 400 !== 0))
      ? "02-28"
      : s.slice(5)
  return `${y}-${md}`
}
export function diasNaturalesC(desde: string, hasta: string): number {
  fecha(desde)
  fecha(hasta)
  comprobar(desde <= hasta, "Intervalo invertido")
  let dias = ordinalC(hasta) - ordinalC(desde) + 1
  for (let y = Number(desde.slice(0, 4)); y < Number(hasta.slice(0, 4)); y++)
    dias += y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 366 : 365
  return dias
}
export type PagoC = Pago & {
  naturaleza: "propio" | "comun"
  distribucion: readonly { persona: string; porcentaje: string }[]
}
export function gastosC(
  h: DeclaracionC,
  lista: readonly PagoC[],
  persona?: string,
  bancario = false
): RacionalC {
  unico(lista.map((p) => p.id))
  return lista.reduce((s, p) => {
    unico(p.distribucion.map((v) => v.persona))
    comprobar(p.distribucion.length > 0, "Pago sin atribución")
    const suma = p.distribucion.reduce(
      (n, v) => n.sumar(noNegativoC(v.porcentaje)),
      ceroC()
    )
    comprobar(
      suma.comparar(enteroC(100)) === 0n,
      "Porcentajes del pago no suman100"
    )
    comprobar(
      p.distribucion.some((v) => v.persona === p.pagador),
      "Pagador ajeno a los titulares del pago"
    )
    comprobar(
      p.naturaleza === "comun" ||
        (p.naturaleza === "propio" &&
          p.distribucion.length === 1 &&
          p.distribucion[0].persona === p.pagador),
      "Gasto propio con atribución ajena"
    )
    const bruto = eurosC(
      pagos({ ...h, contribuyente: p.pagador }, [p], bancario).toFixed()
    )
    const parte = p.distribucion
      .filter((v) =>
        persona === undefined
          ? h.declarantes.includes(v.persona)
          : v.persona === persona
      )
      .reduce((n, v) => n.sumar(eurosC(v.porcentaje)), ceroC())
      .dividir(enteroC(100))
    return s.sumar(bruto.por(parte))
  }, ceroC())
}
export function titularesC(h: DeclaracionC, ids: readonly string[]): RacionalC {
  unico(ids)
  comprobar(ids.length > 0, "Sin titulares")
  const incluidos = ids.filter((p) => h.declarantes.includes(p)).length
  comprobar(incluidos > 0, "Titulares ajenos a declaración")
  return enteroC(incluidos).dividir(enteroC(ids.length))
}
export type MinimoC = {
  persona: string
  titulares: readonly string[]
  ejercicio: 2025
  resolucion: string
  relacion: "descendiente" | "ascendiente"
}
export function minimoC(h: DeclaracionC, m: MinimoC): void {
  texto(m.persona)
  texto(m.resolucion)
  titularesC(h, m.titulares)
  comprobar(
    m.ejercicio === 2025 &&
      !m.titulares.includes(m.persona) &&
      !h.declarantes.includes(m.persona),
    "Mínimo con identidad o ejercicio incoherente"
  )
}
