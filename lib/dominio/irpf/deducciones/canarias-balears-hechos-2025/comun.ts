import Decimal from "decimal.js"

// La precisión y el redondeo no modifican la configuración del resto del motor.
export const D = Decimal.clone({
  precision: 200,
  rounding: Decimal.ROUND_HALF_UP,
})
export type Territorio = "canarias" | "illes-balears"
export type Marco = {
  ejercicio: 2025
  territorio: Territorio
  contribuyente: string
  modalidad: "individual" | "conjunta"
  devengo: string
  causaDevengo: "fin_ejercicio" | "fallecimiento"
  baseGeneral: string
  baseAhorro: string
  exhaustividad: "declaracion_completa"
}
export type Resultado =
  | {
      estado: "calculo_parcial"
      importeExacto: string
      motivo: string
      rastro: readonly string[]
      reservas: readonly string[]
      aceptacionFiscal: "pendiente"
    }
  | { estado: "no_soportado"; motivo: string; rastro: readonly string[] }

export function exigir(condicion: boolean, motivo: string): asserts condicion {
  if (!condicion) throw new RangeError(motivo)
}
export function texto(s: string): void {
  exigir(s.trim().length > 0, "Falta identidad o referencia concreta")
}
export function dinero(s: string): Decimal {
  exigir(
    s.match(/^-?\d{1,13}(?:\.\d{1,2})?$/) !== null,
    "Importe decimal inválido"
  )
  return new D(s)
}
export function positivo(s: string): Decimal {
  const v = dinero(s)
  exigir(v.gte(0), "Importe negativo")
  return v
}
export function fecha(s: string): void {
  exigir(s.match(/^\d{4}-\d{2}-\d{2}$/) !== null, "Fecha inválida")
  const [y, m, d] = s.split("-").map(Number)
  const dias = [
    31,
    y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 29 : 28,
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
  exigir(
    y >= 1900 && m >= 1 && m <= 12 && d >= 1 && d <= dias[m - 1],
    "Fecha inexistente"
  )
}
export function edad(nacimiento: string, al: string): number {
  fecha(nacimiento)
  fecha(al)
  exigir(nacimiento <= al, "Nacimiento posterior al hecho")
  return (
    Number(al.slice(0, 4)) -
    Number(nacimiento.slice(0, 4)) -
    (al.slice(5) < nacimiento.slice(5) ? 1 : 0)
  )
}
export function unico(ids: readonly string[]): void {
  exigir(Array.isArray(ids) && ids.length <= 1000, "Colección inválida")
  ids.forEach(texto)
  exigir(new Set(ids).size === ids.length, "Identidades duplicadas")
}
export function marco(h: Marco, territorio: Territorio): void {
  exigir(
    h.ejercicio === 2025 && h.territorio === territorio,
    "Ejercicio o territorio fuera de alcance"
  )
  texto(h.contribuyente)
  fecha(h.devengo)
  exigir(h.devengo.startsWith("2025-"), "Devengo fuera de 2025")
  exigir(
    h.causaDevengo === "fin_ejercicio" || h.causaDevengo === "fallecimiento",
    "Causa de devengo ausente"
  )
  exigir(
    h.causaDevengo !== "fin_ejercicio" || h.devengo === "2025-12-31",
    "Devengo ordinario inconsistente"
  )
  exigir(
    h.modalidad === "individual",
    "Conjunta: requiere composición por contribuyente en el padre"
  )
  exigir(
    h.exhaustividad === "declaracion_completa",
    "Falta exhaustividad de hechos y pagos"
  )
  magnitudAnual(h.baseGeneral)
  magnitudAnual(h.baseAhorro)
}
export function renta(h: Marco): Decimal {
  return magnitudAnual(h.baseGeneral).plus(magnitudAnual(h.baseAhorro))
}
export function limiteRenta(h: Marco, limite: Decimal.Value): void {
  exigir(renta(h).lte(limite), "Renta supera el límite de esta rama")
}
export type Pago = {
  id: string
  fecha: string
  pagador: string
  perceptor: string
  factura: string
  importe: string
  ayudasExentas: string
  reembolsos: string
  medio:
    | "transferencia"
    | "tarjeta"
    | "cheque_nominativo"
    | "ingreso"
    | "efectivo"
}
export function pagos(
  h: Marco,
  lista: readonly Pago[],
  bancario = false
): Decimal {
  unico(lista.map((p) => p.id))
  return lista.reduce((total, p) => {
    fecha(p.fecha)
    texto(p.perceptor)
    texto(p.factura)
    exigir(
      p.pagador === h.contribuyente &&
        p.fecha >= "2025-01-01" &&
        p.fecha <= h.devengo,
      "Pago ajeno o fuera del período"
    )
    exigir(
      [
        "transferencia",
        "tarjeta",
        "cheque_nominativo",
        "ingreso",
        "efectivo",
      ].includes(p.medio),
      "Medio de pago desconocido"
    )
    exigir(!bancario || p.medio !== "efectivo", "Pago en efectivo no admitido")
    const neto = positivo(p.importe)
      .minus(positivo(p.ayudasExentas))
      .minus(positivo(p.reembolsos))
    exigir(neto.gte(0), "Ayudas/reembolsos superan el pago")
    return total.plus(neto)
  }, new D(0))
}
export function reparto(h: Marco, titulares: readonly string[]): Decimal {
  unico(titulares)
  exigir(
    titulares.length >= 1 &&
      titulares.length <= 2 &&
      titulares.includes(h.contribuyente),
    "Titulares ausentes o rama de más de dos titulares"
  )
  return new D(1).div(titulares.length)
}
export function mismosTitulares(
  a: readonly string[],
  b: readonly string[]
): boolean {
  return a.length === b.length && a.every((id) => b.includes(id))
}
export function parcial(
  importe: Decimal,
  rastro: readonly string[],
  reservas: readonly string[] = []
): Resultado {
  return {
    estado: "calculo_parcial",
    importeExacto: importe.toFixed(),
    motivo: "Cuantía previa a composición y cuota autonómica",
    rastro,
    reservas: [
      "Autenticidad de documentos particulares y derechos externos no certificada",
      "Aplicación única sobre cuota y concurrencias a cargo de la composición del padre",
      ...reservas,
    ],
    aceptacionFiscal: "pendiente",
  }
}
export function presentar(r: Resultado): string | undefined {
  return r.estado === "calculo_parcial"
    ? new D(r.importeExacto).toFixed(2)
    : undefined
}
export function evaluar(
  h: Marco,
  territorio: Territorio,
  formula: () => Resultado
): Resultado {
  try {
    marco(h, territorio)
    return formula()
  } catch (error) {
    return {
      estado: "no_soportado",
      motivo:
        error instanceof RangeError
          ? error.message
          : "Hechos incompletos o malformados",
      rastro: ["Sin importe ni impuesto inferido"],
    }
  }
}

/** Identifica la resolución concreta del mínimo; su autenticidad sigue reservada. */
export type Descendiente = {
  id: string
  nacimiento: string
  titulares: readonly string[]
  minimo: {
    ejercicio: 2025
    persona: string
    contribuyente: string
    expediente: string
  }
  convivenciaDesde: string
  convivenciaHasta: string
}
export function descendiente(h: Marco, u: Descendiente): void {
  texto(u.id)
  fecha(u.nacimiento)
  fecha(u.convivenciaDesde)
  fecha(u.convivenciaHasta)
  exigir(
    u.id !== h.contribuyente && !u.titulares.includes(u.id),
    "El descendiente debe ser distinto del contribuyente y de sus progenitores/titulares"
  )
  exigir(
    u.nacimiento <= u.convivenciaDesde &&
      u.convivenciaDesde <= "2025-01-01" &&
      u.convivenciaHasta >= h.devengo,
    "Rama requiere convivencia continua desde 1 de enero, posterior al nacimiento"
  )
  exigir(
    u.minimo.ejercicio === 2025 &&
      u.minimo.persona === u.id &&
      u.minimo.contribuyente === h.contribuyente,
    "Mínimo sin identidad/ejercicio concordantes"
  )
  texto(u.minimo.expediente)
  reparto(h, u.titulares)
}

export function magnitudAnual(s: string): Decimal {
  exigir(/^-?\d{1,18}(\.\d{1,80})?$/.test(s), "Magnitud anual inválida")
  return new D(s)
}
