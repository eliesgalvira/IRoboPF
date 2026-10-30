import { fuentesActividad2025 } from "./fuentes"
import Decimal from "decimal.js"
import { Result, Schema } from "effect"
import { CasoActividad2025 } from "./contrato"
import type {
  EtapaActividad,
  MotivoActividad,
  ResultadoActividad2025,
} from "./contrato"

// Entradas acotadas a 12 enteros, 2 decimales y 10.000 documentos.
// 80 cifras conservan exactamente las operaciones finitas de esta vertical.
const D = Decimal.clone({ precision: 80 })
const suma = (valores: readonly string[]) =>
  valores.reduce((a, b) => a.plus(b), new D(0))
function fechaValida(fecha: string): boolean {
  const [y = 0, m = 0, d = 0] = fecha.split("-").map(Number)
  const bisiesto = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)
  const dias = [31, bisiesto ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return (
    y >= 1900 &&
    y <= 2026 &&
    m >= 1 &&
    m <= 12 &&
    d >= 1 &&
    d <= (dias[m - 1] ?? 0)
  )
}

/** Fórmula aislada: la admisión y la incompatibilidad se comprueban en calcularActividad2025. */
export function reduccionRentasBajas2025(RN: Decimal): Decimal {
  return D.min(
    D.max(RN, 0),
    D.max(0, new D(1620).minus(D.max(0, RN.minus(8000)).times("0.405")))
  )
}

/** Frontera tipada y comprobada en runtime; nunca interpreta un rechazo como cero. */
export function calcularActividad2025(
  caso: CasoActividad2025
): ResultadoActividad2025 {
  if (
    Result.isFailure(
      Schema.decodeUnknownResult(CasoActividad2025)(caso, {
        onExcessProperty: "error",
      })
    )
  ) {
    return {
      estado: "no-soportado",
      motivos: [
        {
          reglaId: "AE25-01",
          id: "entrada",
          motivo: "Estructura, categoría o dato desconocido/no válido",
        },
      ],
    }
  }
  const motivos: MotivoActividad[] = []
  const rechazar = (reglaId: string, id: string, motivo: string) => {
    motivos.push({ reglaId, id, motivo })
  }
  const etapas: EtapaActividad[] = []
  const etapa = (
    reglaId: string,
    id: string,
    formula: string,
    valor: Decimal,
    documentos: readonly string[] = []
  ) => {
    etapas.push({
      reglaId,
      id,
      formula,
      importe: valor.toFixed(),
      fuentes:
        fuentesActividad2025.find((f) => f.reglaId === reglaId)?.fuentes ?? [],
      documentos,
    })
    return valor
  }
  if (
    caso.ejercicio !== 2025 ||
    caso.territorio !== "comun" ||
    !caso.individual ||
    !caso.serviciosOrdinarios
  )
    rechazar(
      "AE25-01",
      "ambito",
      "Solo servicios profesionales individuales, régimen común y ejercicio 2025"
    )
  for (const [id, presente] of Object.entries(caso.hechos))
    if (presente)
      rechazar(
        id === "trade" ? "AE25-08" : "AE25-01",
        id,
        "Hecho fuera del ámbito o desconocido; requiere ampliación y revisión"
      )
  if (caso.criterio2025 !== "devengo")
    rechazar(
      "AE25-02",
      "criterio2025",
      "Criterio vigente no soportado o desconocido"
    )
  if (caso.regimen2025 !== "eds" || caso.renuncia2025 || caso.exclusion2025)
    rechazar("AE25-01", "regimen2025", "Renuncia o exclusión vigente")
  const inicio = Number(caso.fechaInicio.slice(0, 4))
  if (
    !fechaValida(caso.fechaInicio) ||
    !fechaValida(caso.fechaFin) ||
    caso.fechaInicio > caso.fechaFin ||
    caso.fechaInicio > "2025-12-31" ||
    caso.fechaFin < "2025-01-01" ||
    caso.fechaFin > "2025-12-31"
  )
    rechazar("AE25-01", "fechas", "Intervalo de actividad inválido")
  if (caso.actividadPreviaAlInicio !== "ausente")
    rechazar(
      "AE25-12",
      "historia-previa",
      "Actividades previas (incluida atribución) o historia desconocida fuera de alcance"
    )
  if (caso.historial.length !== 2025 - inicio)
    rechazar(
      "AE25-01",
      "historial",
      "Se exige un registro por ejercicio desde inicio hasta 2024"
    )
  const anios = new Set<number>()
  for (const h of caso.historial) {
    if (
      !Number.isInteger(h.ejercicio) ||
      h.ejercicio < inicio ||
      h.ejercicio >= 2025 ||
      anios.has(h.ejercicio)
    )
      rechazar(
        "AE25-01",
        h.documento,
        "Ejercicio histórico duplicado o inválido"
      )
    anios.add(h.ejercicio)
    if (h.regimen !== "eds" || h.renuncia || h.exclusion)
      rechazar(
        "AE25-01",
        h.documento,
        "Solo historial EDS continuo sin renuncias/exclusiones; no presumir caducidad"
      )
    if (h.criterio !== "devengo")
      rechazar(
        "AE25-02",
        h.documento,
        "Opción temporal previa o desconocida: no imputar automáticamente por devengo"
      )
  }
  // La anualización se compara por productos, sin redondear el cociente.
  if (inicio === 2025) {
    if (caso.diasActividad2024 !== 0 || !new D(caso.volumen2024).isZero())
      rechazar(
        "AE25-01",
        "volumen",
        "Inicio 2025 incompatible con actividad 2024"
      )
  } else {
    const dias = caso.diasActividad2024
    if (inicio === 2024) {
      const [, mes = 0, dia = 0] = caso.fechaInicio.split("-").map(Number)
      const previos = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
      if (dias !== 367 - ((previos[mes - 1] ?? 0) + dia))
        rechazar(
          "AE25-01",
          "dias2024",
          "Días no coinciden con inicio y actividad continua hasta fin de 2024"
        )
    }
    if (
      !Number.isInteger(dias) ||
      dias < 1 ||
      dias > 366 ||
      (inicio < 2024 && dias !== 366)
    )
      rechazar("AE25-01", "dias2024", "Días de actividad 2024 incoherentes")
    if (new D(caso.volumen2024).times(366).gt(new D(600000).times(dias)))
      rechazar(
        "AE25-01",
        "volumen",
        "Cifra anterior anualizada superior a 600.000 euros"
      )
  }
  const ids = new Set<string>()
  const documentos = [
    ...caso.ingresos,
    ...caso.gastos,
    ...caso.reta,
    ...caso.activos,
    ...caso.retenciones,
    ...caso.pagosFraccionados,
  ]
  if (documentos.length > 10000)
    rechazar("AE25-01", "documentos", "Máximo técnico 10.000 registros")
  for (const d of documentos) {
    if (ids.has(d.id))
      rechazar(
        "AE25-02",
        d.id,
        "ID duplicado entre diarios; no sumar dos veces"
      )
    ids.add(d.id)
    if (!fechaValida(d.fecha)) rechazar("AE25-02", d.id, "Fecha inexistente")
  }
  const facturas = new Set<string>()
  for (const a of [
    ...caso.ingresos,
    ...caso.gastos,
    ...caso.reta,
    ...caso.activos,
  ]) {
    if (facturas.has(a.justificante))
      rechazar(
        "AE25-02",
        a.id,
        "Documento económico repetido o capitalizado y deducido como gasto"
      )
    facturas.add(a.justificante)
  }
  const clientes = new Map(caso.clientes.map((c) => [c.id, c]))
  if (clientes.size !== caso.clientes.length)
    rechazar("AE25-02", "clientes", "Identidad de cliente duplicada")
  for (const c of caso.clientes)
    if (c.vinculado)
      rechazar("AE25-02", c.id, "Cliente vinculado fuera del ámbito")
  for (const a of [...caso.ingresos, ...caso.gastos]) {
    if (
      a.fecha < "2025-01-01" ||
      a.fecha > "2025-12-31" ||
      a.fecha < caso.fechaInicio ||
      a.fecha > caso.fechaFin ||
      !a.afectacionExclusiva ||
      !a.registrado ||
      a.rectificativa ||
      (a.iva !== a.ivaRecuperable && !new D(a.iva).eq(a.ivaRecuperable))
    )
      rechazar(
        "AE25-02",
        a.id,
        "Devengo, afectación, registro, rectificación o IVA fuera del ámbito (solo IVA plenamente recuperable)"
      )
  }
  for (const i of caso.ingresos)
    if (!clientes.has(i.clienteId))
      rechazar("AE25-02", i.id, "Cliente sin hechos documentados")
  for (const g of caso.gastos)
    if (!g.correlacion)
      rechazar("AE25-16", g.id, "Correlación con ingresos no acreditada")
  const periodosReta = new Set<string>()
  for (const r of caso.reta) {
    if (
      r.tipo !== "ordinaria" ||
      !r.propia ||
      !r.efectiva ||
      !/^2025-(0[1-9]|1[0-2])$/.test(r.periodo) ||
      r.fecha < "2025-01-01" ||
      r.fecha < caso.fechaInicio ||
      r.periodo < caso.fechaInicio.slice(0, 7) ||
      r.periodo > caso.fechaFin.slice(0, 7) ||
      r.fecha > "2025-12-31" ||
      periodosReta.has(r.periodo)
    )
      rechazar(
        "AE25-03",
        r.id,
        "Solo cuota ordinaria propia efectivamente pagada en 2025, una por período; regularización/devolución/deuda excluidas"
      )
    periodosReta.add(r.periodo)
  }
  let amortizacion = new D(0)
  for (const a of caso.activos) {
    const base = new D(a.coste).plus(a.puestaMarcha).minus(a.residual)
    const saldo = base.minus(a.acumulada)
    const coef = new D(a.coeficiente)
    if (
      !new D(a.iva).eq(a.ivaRecuperable) ||
      !a.nuevo ||
      !a.exclusivo ||
      !a.oneroso ||
      a.mejoras ||
      a.deterioros ||
      a.subvencionado ||
      a.leasing ||
      a.incentivo ||
      a.metodoHistorico !== "lineal" ||
      !coef.eq(a.coeficienteHistorico) ||
      !fechaValida(a.fechaUso) ||
      !fechaValida(a.fechaAdquisicion) ||
      !fechaValida(a.usoHasta) ||
      a.fechaAdquisicion < "2005-01-01" ||
      a.fechaAdquisicion > a.fechaUso ||
      a.fechaUso > "2025-01-01" ||
      a.fechaUso < caso.fechaInicio ||
      (a.fechaUso >= "2025-01-01" && new D(a.acumulada).gt(0)) ||
      a.usoHasta !== "2025-12-31" ||
      caso.fechaInicio > "2025-01-01" ||
      caso.fechaFin !== "2025-12-31" ||
      base.lt(0) ||
      saldo.lt(0) ||
      new D(a.acumulada).gt(
        base.times(coef).times(2025 - Number(a.fechaUso.slice(0, 4)))
      ) ||
      coef.lt(a.grupo === "hardware" ? "0.1" : "0.05") ||
      coef.gt(a.grupo === "hardware" ? "0.26" : "0.10")
    )
      rechazar(
        "AE25-04",
        a.id,
        "Activo, saldo, coeficiente o historia fuera de amortización lineal ordinaria de año completo"
      )
    const cuota = D.min(saldo, base.times(coef))
    amortizacion = amortizacion.plus(cuota)
    etapa(
      "AE25-04",
      a.id,
      "min(coste+puestaMarcha-residual-acumulada, (coste+puestaMarcha-residual)*coeficiente)",
      cuota,
      [a.justificante, a.saldoDocumentado]
    )
    etapa(
      "AE25-04",
      `${a.id}:saldo`,
      "saldoAnterior-cuota",
      saldo.minus(cuota),
      [a.saldoDocumentado]
    )
  }
  const operaciones = new Set<string>()
  const retenidos = new Set<string>()
  const periodosPago = new Set<string>()
  for (const r of [...caso.retenciones, ...caso.pagosFraccionados]) {
    if (operaciones.has(r.operacionId))
      rechazar(
        "AE25-15",
        r.id,
        "Operación de pago duplicada, aunque cambie justificante"
      )
    operaciones.add(r.operacionId)
  }
  for (const r of caso.retenciones) {
    const ingreso = caso.ingresos.find((i) => i.id === r.ingresoId)
    if (
      !r.efectiva ||
      ingreso === undefined ||
      !ingreso.sujetoRetencion ||
      new D(r.importe).gt(ingreso.base) ||
      retenidos.has(r.ingresoId) ||
      r.fecha < "2025-01-01" ||
      r.fecha > "2025-12-31"
    )
      rechazar(
        "AE25-15",
        r.id,
        "Retención no soportada o factura ya cubierta por otro certificado"
      )
    retenidos.add(r.ingresoId)
  }
  for (const p of caso.pagosFraccionados) {
    const cierre =
      p.periodo === "2025-1T"
        ? "2025-03-31"
        : p.periodo === "2025-2T"
          ? "2025-06-30"
          : p.periodo === "2025-3T"
            ? "2025-09-30"
            : "2025-12-31"
    if (
      p.fecha <= cierre ||
      !p.efectivo ||
      periodosPago.has(p.periodo) ||
      p.fecha < "2025-01-01" ||
      p.fecha > "2026-01-30"
    )
      rechazar(
        "AE25-15",
        p.id,
        "Pago no efectivo, duplicado o fecha fuera del ámbito"
      )
    periodosPago.add(p.periodo)
  }
  const discapacidad = caso.discapacidad
  if (
    !Number.isInteger(discapacidad.grado) ||
    discapacidad.grado < 0 ||
    discapacidad.grado > 100 ||
    (discapacidad.ayudaOMovilidad && discapacidad.grado < 33)
  )
    rechazar("AE25-10", "discapacidad", "Grado/ayuda incoherentes")
  if (motivos.length > 0) return { estado: "no-soportado", motivos }
  for (const i of caso.ingresos)
    etapa(
      "AE25-02",
      `ingreso:${i.id}`,
      "base devengada, antes de retención y sin IVA recuperable",
      new D(i.base),
      [i.id]
    )
  for (const g of caso.gastos)
    etapa(
      "AE25-16",
      `gasto:${g.id}`,
      "base de categoría admitida correlacionada, sin IVA recuperable",
      new D(g.base),
      [g.id]
    )
  for (const r of caso.reta)
    etapa(
      "AE25-03",
      `reta:${r.id}`,
      "cuota propia ordinaria efectivamente satisfecha",
      new D(r.importe),
      [r.id]
    )
  const ingresos = etapa(
    "AE25-02",
    "ingresos",
    "sum(base antes de retención; IVA recuperable excluido)",
    suma(caso.ingresos.map((i) => i.base)),
    caso.ingresos.map((i) => i.id)
  )
  const ordinarios = etapa(
    "AE25-02",
    "gastos",
    "sum(base gastos admitidos)",
    suma(caso.gastos.map((g) => g.base)),
    caso.gastos.map((g) => g.id)
  )
  const reta = etapa(
    "AE25-03",
    "reta",
    "sum(cuotas ordinarias efectivas)",
    suma(caso.reta.map((r) => r.importe)),
    caso.reta.map((r) => r.id)
  )
  etapa(
    "AE25-04",
    "amortizacion",
    "sum(cuotas activos)",
    amortizacion,
    caso.activos.map((a) => a.id)
  )
  const gastos = ordinarios.plus(reta).plus(amortizacion)
  const P = etapa(
    "AE25-02",
    "P",
    "ingresos-gastos-RETA-amortizacion",
    ingresos.minus(gastos)
  )
  const sujetos = suma(
    caso.ingresos.filter((i) => i.sujetoRetencion).map((i) => i.base)
  )
  const unico = new Set(caso.ingresos.map((i) => i.clienteId)).size === 1
  const elegible =
    unico &&
    ingresos.gt(0) &&
    gastos.lte(ingresos.times("0.3")) &&
    sujetos.gte(ingresos.times("0.7")) &&
    caso.obligacionesFormales
  if (caso.opcion === "cliente-unico" && !elegible)
    return {
      estado: "no-soportado",
      motivos: [
        {
          reglaId: "AE25-08",
          id: "opcion",
          motivo:
            "Elección cliente único sin cumplir todas las condiciones (30% incluye RETA y amortización; 70% ingresos sujetos)",
        },
      ],
    }
  const G = etapa(
    "AE25-05",
    "G",
    "opcion cliente único ? 0 : min(2000, 0.05*max(P,0))",
    caso.opcion === "cliente-unico"
      ? new D(0)
      : D.min(2000, D.max(P, 0).times("0.05"))
  )
  const RN = etapa("AE25-06", "RN", "P-G (con signo)", P.minus(G))
  let reduccion = new D(0)
  if (caso.opcion === "cliente-unico") {
    const adicional = RN.lte("14047.5")
      ? new D(6498)
      : D.max(0, new D(6498).minus(RN.minus("14047.5").times("1.14")))
    const incremento =
      discapacidad.ejercicioEfectivo && discapacidad.grado >= 33
        ? new D(
            discapacidad.grado >= 65 || discapacidad.ayudaOMovilidad
              ? 7750
              : 3500
          )
        : new D(0)
    etapa(
      "AE25-09",
      "adicional",
      "RN<=14047.5 ? 6498 : max(0,6498-1.14*(RN-14047.5))",
      adicional
    )
    etapa(
      "AE25-10",
      "discapacidad",
      "3500 o 7750 alternativos, con ejercicio efectivo y acreditación",
      incremento,
      [discapacidad.documento]
    )
    reduccion = D.min(D.max(RN, 0), adicional.plus(incremento).plus(2000))
  } else if (!elegible && caso.aplicarRentasBajas) {
    reduccion = reduccionRentasBajas2025(RN)
  }
  etapa(
    caso.opcion === "cliente-unico" ? "AE25-08" : "AE25-11",
    "reduccion32_2",
    "reducción limitada a RN positivo; 32.2.3 solo si NO elegible 32.2.2",
    reduccion
  )
  const anteriores = caso.historial
    .filter((h) => new D(h.netoAntesReducciones).gt(0))
    .map((h) => h.ejercicio)
  const primerPositivo =
    anteriores.length > 0 ? Math.min(...anteriores) : RN.gt(0) ? 2025 : null
  const excluidoEmpleador = caso.clientes.some(
    (c) =>
      c.empleadorEnAnioAnteriorAlInicio &&
      suma(
        caso.ingresos.filter((i) => i.clienteId === c.id).map((i) => i.base)
      ).gt(ingresos.times("0.5"))
  )
  const inicioElegible =
    inicio >= 2013 &&
    primerPositivo !== null &&
    2025 <= primerPositivo + 1 &&
    !excluidoEmpleador
  const reduccionInicio = etapa(
    "AE25-12",
    "reduccionInicio",
    "si elegible y opción: 0.20*min(100000,max(RN-R32_2,0))",
    caso.aplicarInicio && inicioElegible
      ? D.min(100000, D.max(0, RN.minus(reduccion))).times("0.2")
      : new D(0)
  )
  const aporte = etapa(
    "AE25-14",
    "aporteBIG",
    "RN-R32_2-Rinicio (con signo; no liquidación anual)",
    RN.minus(reduccion).minus(reduccionInicio)
  )
  const retenciones = etapa(
    "AE25-15",
    "retenciones",
    "sum(retenciones efectivas únicas); separado del rendimiento",
    suma(caso.retenciones.map((r) => r.importe)),
    caso.retenciones.map((r) => r.id)
  )
  const pagos = etapa(
    "AE25-15",
    "pagos",
    "sum(pagos efectivos únicos); separado del rendimiento",
    suma(caso.pagosFraccionados.map((p) => p.importe)),
    caso.pagosFraccionados.map((p) => p.id)
  )
  return {
    estado: "soportado",
    revisionFiscal: "pendiente",
    etapas,
    elegibleClienteUnico: elegible,
    primerPositivo,
    aporte: {
      clase: "rendimiento-actividad-2025",
      importeEurosExactos: aporte.toFixed(),
      retencionesEuros: retenciones.toFixed(),
      pagosFraccionadosEuros: pagos.toFixed(),
      liquidacionAnual: "no-calculada",
    },
  }
}
