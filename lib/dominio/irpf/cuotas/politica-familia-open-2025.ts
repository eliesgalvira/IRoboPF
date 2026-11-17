import Decimal from "decimal.js"
import type { EntradaComposicionAnual } from "../liquidacion/composicion-anual"
import { calcularReduccionTrabajoConOtrasRentas } from "../reducciones/reduccion-rendimientos-trabajo"

/** Selección monetaria posterior a validar derechos, rentas y producir mínimos.
 * No otorga derechos ni cambia el alcance de sus productores. */
export function seleccionarCuantizacionFamilia2025(
  e: EntradaComposicionAnual,
  minimoEstatal: Decimal,
  minimoAutonomico: Decimal,
  atribuciones: readonly { readonly sujetoId: string; readonly titulares: readonly string[] }[],
): "open-familia-cuatro-gravamenes-2025" | undefined {
  const c = e.hechosFamiliaOpen2025
  const h = e.ambito.derechosMinimos
  if (c === undefined || c.perfil !== "solo-trabajo" || c.ejercicio !== 2025 ||
    h === undefined || c.derechosMinimos !== h ||
    (c.contribuyenteId !== undefined && c.contribuyenteId !== h.contribuyenteId) ||
    e.ambito.anio !== 2025 || c.comunidadAutonoma !== e.ambito.comunidadAutonoma ||
    c.contribuyenteId !== e.ambito.contribuyenteId || c.edad !== e.ambito.situacionFamiliar.edad ||
    e.ambito.situacionFamiliar.tipo !== "individual" || e.ambito.fechaFallecimiento !== undefined ||
    c.edad < 18 || c.edad >= 65 || c.discapacidad !== "ninguna" ||
    e.ambito.situacionFamiliar.discapacidad._tag !== "SinDiscapacidad" ||
    e.cotizaciones.naturaleza !== "efectivas" || e.origenBaseGeneralB !== "solo-trabajo" ||
    (e.politica !== "decimal-hasta-salida" && e.politica !== "open-empleo-madrid-2025") ||
    (e.politica === "open-empleo-madrid-2025" && c.comunidadAutonoma !== "madrid") ||
    !e.baseAhorro.isZero() || e.deduccionesAutonomicasCentimos !== 0 ||
    e.deduccionesTerritoriales2025 !== undefined || e.deduccionesValencianas2025 !== undefined ||
    e.maternidad2025 !== undefined || e.ingresosIdentificados2025 !== undefined ||
    e.inmueblesP4a !== undefined || e.aragonSocialMixto2025 !== undefined ||
    e.basesFamiliares2025 !== undefined || e.conjunta2025 !== undefined ||
    e.rentaActividadAnualB !== undefined || e.pagadoresCatalunya2025 !== undefined ||
    e.hechosOpen2020A2022 !== undefined || e.hechosOpen2023A2024 !== undefined ||
    c.deducciones !== "solo-da61-si-procede" || c.saldosAnteriores !== "ninguno" ||
    c.familiaresConDerechoMinimo !== "segun-derechos" ||
    c.conciliacion.estado !== "totales-anuales-sin-duplicados" ||
    c.conciliacion.ejercicio !== 2025 || c.devengo !== "2025-12-31" ||
    c.trabajo.ejercicio !== 2025 || c.trabajo.territorio !== "comun" ||
    c.trabajo.movilidad !== "ninguna" || c.trabajo.reduccionesArt18 !== "ninguna" ||
    c.trabajo.discapacidadActiva !== "ninguna" ||
    c.trabajo.rendimientos.length === 0 || c.trabajo.rendimientos.some(r =>
      (r.clase !== "empleo-laboral" && r.clase !== "empleo-estatutario") ||
      r.cotizaciones.clase !== "efectivas" ||
      !new Decimal(r.sindicato.importe).isZero() || !new Decimal(r.colegio.importe).isZero() ||
      !new Decimal(r.defensa.importe).isZero()) ||
    c.retenciones.some(r => r.ejercicio !== 2025 || !r.efectiva ||
      !new Decimal(r.importe).isFinite() || new Decimal(r.importe).lt(0) || new Decimal(r.importe).decimalPlaces() > 2) ||
    ![e.baseGeneral, minimoEstatal, minimoAutonomico].every(v => v.isFinite() && v.gte(0)) ||
    e.baseGeneral.lt(minimoEstatal) || e.baseGeneral.lt(minimoAutonomico) ||
    !e.baseGeneral.eq(e.rentasAntesReducciones) ||
    e.rentasTrabajoAnuales === undefined || !e.rentasTrabajoAnuales.restoRentas.isZero() ||
    e.serviciosLaborales === undefined || e.serviciosLaborales.otrasRentas !== undefined ||
    e.serviciosLaborales.netoReducido !== undefined) return undefined
  // SAFETY: baseGeneral es una instancia Decimal validada por composición;
  // su constructor es el clon Decimal con la precisión de esta liquidación.
  const A = e.baseGeneral.constructor as Decimal.Constructor
  const bruto = c.trabajo.rendimientos.reduce((s,r) => s.plus(r.integro), new A(0))
  const cotizaciones = c.trabajo.rendimientos.reduce((s,r) => s.plus(r.cotizaciones.seguridadSocial)
    .plus(r.cotizaciones.derechosPasivos).plus(r.cotizaciones.colegiosHuerfanos), new A(0))
  // Reconcilia empleo ordinario sin art20; DA61 legal nula desde 18.276 EUR.
  if (bruto.lt(18276) || !bruto.eq(e.rentasTrabajoAnuales.integroTrabajo) ||
    !bruto.eq(e.serviciosLaborales.bruto) || !cotizaciones.eq(e.cotizaciones.trabajador) ||
    !e.baseGeneral.eq(bruto.minus(cotizaciones).minus(2000)) ||
    !calcularReduccionTrabajoConOtrasRentas({ anio: 2025,
      rendimientoPrevioNeto: bruto.minus(cotizaciones), otrasRentasNoExentas: new A(0),
    }).isZero()) return undefined
  const asc = h.ascendientes === "ninguno" ? [] : h.ascendientes
  const desc = h.descendientes
  const d = desc[0], a = asc[0]
  const descendiente = desc.length === 1 && asc.length === 0 && d !== undefined &&
    ["andalucia", "catalunya", "galicia", "madrid", "comunitat-valenciana"].includes(c.comunidadAutonoma) &&
    d.discapacidad._tag === "SinDiscapacidad" && d.edadDevengo < 25 &&
    (d.titulares.length === 1 || d.titulares.length === 2) &&
    d.titulares.every(t => t.grado === 1 && t.vinculo.clase === "consanguinidad" &&
      !t.alimentosJudiciales && !t.aplicaEspecialidadAlimentos)
  const ascendiente = asc.length === 1 && desc.length === 0 && a !== undefined &&
    ["aragon", "canarias", "castilla-y-leon", "comunitat-valenciana"].includes(c.comunidadAutonoma) &&
    a.gradoDiscapacidad === 0 && a.situacionDevengo === "vivo" &&
    a.fechaFallecimiento === undefined && a.titulares.length === 1
  const sujeto = descendiente ? d : ascendiente ? a : undefined
  if (sujeto === undefined || atribuciones.length !== 1 || atribuciones[0]?.sujetoId !== sujeto.sujetoId ||
    atribuciones[0].titulares.length !== sujeto.titulares.length ||
    !sujeto.titulares.every(t => atribuciones[0]!.titulares.includes(t.titularId))) return undefined
  return "open-familia-cuatro-gravamenes-2025"
}

/** Una llamada por gravamen completo; nunca por tramo, cuota neta o resultado. */
export const cuantizarGravamenFamilia2025 = (v: Decimal): Decimal =>
  v.toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
