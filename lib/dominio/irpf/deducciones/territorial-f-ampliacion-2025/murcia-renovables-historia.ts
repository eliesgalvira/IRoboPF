import { Result, Schema } from "effect"
import Decimal from "decimal.js"
import { HistoriaRenovablesMurcia2024 } from "./murcia-renovables-historia-esquema"
import { producirCuotaTrabajoMurcia2024 } from "./murcia-renovables-cuota2024"
import type { SolicitudAnualF2025 } from "./anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { racional, type Racional } from "../anual-territorial-racional"
import { falta, fecha, requerido, unicos, type ResultadoF } from "./comun"

const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
const codigo = "murcia_instalaciones_recursos_energeticos_renovables"
export interface LibroOrigenRenovablesMurcia2024 {
  readonly ejercicio: 2024
  readonly contribuyente: string
  readonly operacionId: string
  readonly instalacionId: string
  readonly referencia: string
  readonly ultimoEjercicio: 2026
  readonly politica: "decimal80-casillas2024-centimos-half-up"
  readonly inversionNeta: Racional
  readonly generacionAntesTope: Racional
  readonly excesoSobreTope: Racional
  readonly generado: Racional
  readonly ajusteCuantizacionGenerado: Racional
  readonly ayudasNoIntegrables: readonly {
    id: string; norma: "Real Decreto 477/2021"; programa: 4; referenciaResolucion: string; importe: Racional
  }[]
  readonly aplicado2024: Racional
  readonly saldoPorInsuficiencia2024: Racional
  readonly liquidacion: {
    readonly bruto: Racional; readonly gastosArt19: Racional; readonly netoArt19: Racional
    readonly reduccionArt20: Racional; readonly baseGeneral: Racional
    readonly minimoEstatal: Racional; readonly minimoAutonomico: Racional
    readonly cuotaEstatal: Racional; readonly cuotaAutonomica: Racional
    readonly cuotaLiquida: Racional; readonly retenciones: Racional; readonly diferencial: Racional
  }
}
function exigir(b: boolean, campo: string, motivo: string): asserts b {
  if (!b) falta("renovables2024." + campo, motivo)
}
function en2024(f: string, campo: string): string {
  const valor = fecha(f, "renovables2024." + campo)
  exigir(valor >= "2024-01-01" && valor <= "2024-12-31", campo, "Hecho fuera del origen2024")
  return valor
}
/** Productor privado: sin cuotas, bases ni saldo externos. Sólo origen2024 aplicado. */
export function producirOrigenRenovablesMurcia2024(s: SolicitudAnualF2025, m: MagnitudesTerritorialesAnuales): ResultadoF {
  const dec = Schema.decodeUnknownResult(HistoriaRenovablesMurcia2024)(s.historiaRenovablesMurcia2024, { onExcessProperty: "error" })
  if (Result.isFailure(dec)) falta("renovables2024.contrato", "Historia incompleta o magnitud fiscal externa: " + String(dec.failure))
  const h = dec.success, c = m.caso, propio = c.contribuyenteId
  exigir(s.codigo === codigo && h.contribuyente === propio && c.anio === 2025 && c.comunidadAutonoma === "murcia" &&
    c.situacionFamiliar.tipo === "individual" && c.fechaFallecimiento === undefined, "identidad", "Titular/territorio/devengo de origen y anual no conciliados")
  const nacimiento = fecha(h.nacimiento, "renovables2024.nacimiento"), edad2024 = 2024 - Number(nacimiento.slice(0, 4))
  exigir(edad2024 >= 18 && edad2024 < 65 && c.situacionFamiliar.edad === edad2024 + 1 &&
    c.situacionFamiliar.discapacidad._tag === "SinDiscapacidad" && c.derechosMinimos === undefined &&
    c.situacionFamiliar.descendientes.length === 0 && c.situacionFamiliar.ascendientes.length === 0,
    "perfil", "Perfil estable18–64 en origen, sin familia ni discapacidad")
  exigir(m.rentasTrabajoAnuales !== undefined && m.rentasTrabajoAnuales.integroTrabajo.gt(0) &&
    m.rentasTrabajoAnuales.restoRentas.isZero() && m.baseAhorro.isZero() && m.libroIngresosIdentificados2025 === undefined &&
    m.inmueblesP4a === undefined && m.libroDT18 === undefined && m.donativosEstatales === undefined,
    "economia2025", "Anual ordinario de trabajo sin otras rentas ni libros concurrentes fuera de cobertura")
  exigir(Object.keys(s.hechos).length === 0, "sin_inversion2025", "El origen se aporta en historia; sin hechos ni inversión nueva2025")
  exigir(h.eleccion2024 === "aplicar" && h.eleccion2025 === "aplicar", "eleccion", "Sólo origen expresamente aplicado y solicitud de remanente2025; no_aplicar no acredita insuficiencia")
  exigir(h.empleo.perceptor === propio && h.empleo.pagador !== propio, "empleo", "Certificado del mismo perceptor y pagador distinto")
  const inventario = requerido(s.historialSaldosIncentivoMurcia, "historialSaldosIncentivoMurcia:" + codigo)
  exigir(inventario.codigo === codigo && inventario.contribuyente === propio && inventario.periodos.length === 2 &&
    new Set(inventario.periodos).size === 2 && inventario.periodos.includes(2023) && inventario.periodos.includes(2024) &&
    inventario.operaciones.length === 1 && inventario.operaciones[0]!.ejercicioOrigen === 2024 &&
    inventario.operaciones[0]!.objetoId === h.instalacion.id && inventario.operaciones[0]!.referencia === h.factura.soporte,
    "inventario", "Censo2023–2024 completo: sólo esta instalación y documento2024, sin otro origen")
  const v = h.vivienda, i = h.instalacion, f = h.factura, dr = i.declaracionResponsable
  exigir(v.titular === propio && i.titular === propio && dr.titular === propio && f.destinatario === propio &&
    i.viviendaId === v.id && dr.instalacionId === i.id && f.instalacionId === i.id && f.operacionId === i.operacionId &&
    f.emisor === i.instalador && i.instalador !== propio,
    "instalacion", "Vivienda, instalación, operación, factura, instalador y titulares incoherentes")
  const compra = fecha(v.adquisicion, "renovables2024.adquisicion"), ocupacion = fecha(v.ocupacionDesde, "renovables2024.ocupacion")
  exigir(compra >= nacimiento && compra <= ocupacion && ocupacion <= "2021-01-01", "habitualidad", "Primer perfil: propiedad y ocupación estables con tres años cumplidos al inicio2024")
  const fin = en2024(i.finalizacion, "finalizacion"), factura = en2024(f.fecha, "factura.fecha")
  exigir(en2024(dr.fecha, "declaracionResponsable.fecha") <= "2024-12-31" && fin <= factura,
    "fechas", "Instalación terminada antes de factura y declaración responsable de origen")
  unicos(h.pagos.map(p => p.id), "renovables2024.pago.id")
  unicos(h.pagos.map(p => p.soporte), "renovables2024.pago.soporte")
  unicos(h.ayudas.map(a => a.id), "renovables2024.ayuda.id")
  unicos(h.ayudas.map(a => a.soporte), "renovables2024.ayuda.soporte")
  unicos([...h.pagos.map(p => p.id), ...h.ayudas.map(a => a.id)], "renovables2024.flujo.id")
  unicos([...h.pagos.map(p => p.soporte), ...h.ayudas.map(a => a.soporte)], "renovables2024.flujo.soporte")
  let pagado = new D(0), ayudas = new D(0)
  for (const p of h.pagos) {
    exigir(p.pagador === propio && p.beneficiario === i.instalador && p.facturaId === f.id && p.instalacionId === i.id && p.operacionId === i.operacionId &&
      en2024(p.fecha, "pago.fecha") >= factura && new D(p.importeEUR).gt(0), "pago", "Pago bancario de origen ajeno, anterior a factura o sin importe positivo")
    pagado = pagado.plus(p.importeEUR)
  }
  exigir(pagado.eq(f.importeEUR) && pagado.lte(1000000), "factura", "Factura íntegramente pagada una vez; cota técnica1M")
  for (const a of h.ayudas) {
    exigir(a.beneficiario === propio && a.instalacionId === i.id && new D(a.importeEUR).gt(0), "ayuda", "Ayuda de otro titular/instalación o sin importe positivo")
    const cobro = en2024(a.fecha, "ayuda.fecha")
    const concesion = a.concesion
    exigir(concesion !== undefined && concesion.norma === "Real Decreto 477/2021" && concesion.programa === 4,
      "ayuda.regimen", "Falta concesión identificada RD477/2021 programa4; otra ayuda requiere clasificar su renta antes de reconstruir cuota")
    const fechaConcesion = fecha(concesion.fecha, "renovables2024.ayuda.concesion.fecha")
    exigir(concesion.beneficiario === propio && concesion.instalacionId === i.id &&
      fechaConcesion >= "2021-06-30" && fechaConcesion <= cobro,
      "ayuda.concesion", "Resolución de otro titular/instalación o cronología no conciliada")
    ayudas = ayudas.plus(a.importeEUR)
  }
  unicos(h.ayudas.map(a => a.concesion!.referencia), "renovables2024.ayuda.resolucion")
  exigir(ayudas.lte(pagado), "ayudas", "Ayudas superiores al coste; no presumir saldo ni base cero")
  const q = producirCuotaTrabajoMurcia2024(h, edad2024)
  // Ley4/2023 art55.Tres, art1.Cinco: sólo franja<35000,50%, límite7000.
  const neto = pagado.minus(ayudas), antesTope = neto.times("0.5"), sinCuantizar = D.min(7000, antesTope)
  const generado = sinCuantizar.toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
  const aplicado = D.min(generado, q.cuotaAutonomica), saldo = generado.minus(aplicado)
  const cuotaLiquida = q.cuotaEstatal.plus(q.cuotaAutonomica).minus(aplicado)
  const r = (n: Decimal) => racional(n.toFixed())
  const libro: LibroOrigenRenovablesMurcia2024 = {
    ejercicio: 2024, contribuyente: h.contribuyente, operacionId: i.operacionId, instalacionId: i.id,
    referencia: h.declaracion, ultimoEjercicio: 2026, politica: q.politica,
    inversionNeta: r(neto), generacionAntesTope: r(antesTope), excesoSobreTope: r(antesTope.minus(sinCuantizar)),
    ajusteCuantizacionGenerado: r(generado.minus(sinCuantizar)),
    generado: r(generado), aplicado2024: r(aplicado), saldoPorInsuficiencia2024: r(saldo),
    ayudasNoIntegrables: h.ayudas.map(a => ({id:a.id,norma:"Real Decreto 477/2021",programa:4,
      referenciaResolucion:a.concesion!.referencia,importe:r(new D(a.importeEUR))})),
    liquidacion: { bruto: r(q.bruto), gastosArt19: r(q.gastosArt19), netoArt19: r(q.netoArt19), reduccionArt20: r(q.reduccionArt20),
      baseGeneral: r(q.base), minimoEstatal: r(q.minimoEstatal), minimoAutonomico: r(q.minimoAutonomico),
      cuotaEstatal: r(q.cuotaEstatal), cuotaAutonomica: r(q.cuotaAutonomica), cuotaLiquida: r(cuotaLiquida),
      retenciones: r(q.retenciones), diferencial: r(cuotaLiquida.minus(q.retenciones)) },
  }
  return { codigo, estado: "calculo_parcial", motivo: "Remanente de cuota de origen2024 producido desde hechos certificados", origenRenovablesMurcia2024: libro,
    citas: ["Ley4/2023 art55.Tres:art1.Cinco", "LIRPF arts19,20,56,63,74,77 y DA5.4; RD477/2021 programa4; AEAT2024 escalaMurcia"],
    reservas: ["Documentos declarados, sin autenticación automática; aceptación fiscal pendiente"],
    rastro: ["Origen2024:50% inversión neta hasta7000, generación a céntimos; aplicación=min(generado,cuota2024), remanente sólo por insuficiencia",
      "Cuota2024 con núcleos comunes; art20, gravámenes y generación cuantizados HALF_UP a céntimos; cinco casos PDF/SES Murcia2024 contrastados",
      "Ayudas admitidas sólo con concesión RD477/2021 programa4: no integración DA5.4, minoración de inversión; autenticidad documental pendiente",
      "Sin generación2025; consumidor único sobre residual2025; vencimiento2026 inalterado"], aceptacionFiscal: "pendiente" }
}
