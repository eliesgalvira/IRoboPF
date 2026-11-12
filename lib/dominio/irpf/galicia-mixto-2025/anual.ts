import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { CasoGaliciaMixto2025 } from "./contrato"
import { RechazoP4a } from "../inmobiliario-2025/contrato"
import {
  producirCensoInmuebles2025,
  type ExactoP4a,
} from "../inmobiliario-2025/productor"
import { adaptarTrabajoAnual } from "../trabajo-anual/adaptador"
import { calcularReduccionTrabajoConOtrasRentas } from "../reducciones/reduccion-rendimientos-trabajo"
import { componerLiquidacionAnual } from "../liquidacion/composicion-anual"
import { MINIMOS_ESTATALES_2025 } from "../../normativa/datos/minimos-autonomicos-2025"

const D = Decimal.clone({ precision: 80 })
const decimal = (r: ExactoP4a) => new D(r.n.toString()).div(r.d.toString())
const rechazo = (motivo: string) =>
  new RechazoP4a({ codigo: "renta-mixta", motivo: `Galicia mixto: ${motivo}` })
const unicos = (xs: readonly string[]) => new Set(xs).size === xs.length
// Orden HAC/277/2026, art. 7.1; sólo el plazo ordinario de Renta 2025.
const finPlazoOrdinario2025 = "2026-06-30"

/** Productor compartido por ambas API: art19/art20, base, cuota y pagos una sola vez. */
export const liquidarGaliciaMixto2025 = Effect.fn("Galicia.mixto2025")(
  function* (entrada: CasoGaliciaMixto2025) {
    const decoded = Schema.decodeUnknownResult(CasoGaliciaMixto2025)(entrada, {
      onExcessProperty: "error",
    })
    if (Result.isFailure(decoded))
      return yield* rechazo(
        `esquema cerrado fuera de alcance: ${String(decoded.failure)}`
      )
    const c = decoded.success,
      v = c.inmuebles[0]
    if (
      v === undefined ||
      c.censoInmobiliario.inmuebles[0] !== v.id ||
      v.ubicacion !== "galicia" ||
      v.primerAlquiler2025 !== undefined ||
      v.vaciaExt2025 !== undefined ||
      v.cambioHabitual2025 !== undefined ||
      v.cambioHabitualBalears2025 !== undefined ||
      v.contrato.firma <= "2023-05-26"
    )
      return yield* rechazo(
        "censo único gallego y contrato posterior26/05/2023; cambios de residencia y otros perfiles pendientes"
      )
    const solicitud = c.deduccionesTerritoriales2025.solicitudes[0]
    if (
      c.deduccionesTerritoriales2025.solicitudes.length !== 1 ||
      solicitud?.lote !== "E38" ||
      solicitud.hechos.codigo !== "galicia_alquiler_vivienda_habitual" ||
      Object.keys(c.deduccionesTerritoriales2025).some(
        (k) => k !== "solicitudes"
      )
    )
      return yield* rechazo(
        "una solicitud de alquiler propio; otras deducciones y concurrencias pendientes"
      )
    if (
      c.conciliacion.contribuyenteId !== c.contribuyenteId ||
      c.trabajo.ejercicio !== 2025 ||
      c.trabajo.rendimientos.length !== 1 ||
      c.trabajo.discapacidadActiva !== "ninguna" ||
      c.trabajo.rendimientos.some(
        (r) => r.clase !== "empleo-laboral" && r.clase !== "empleo-estatutario"
      ) ||
      c.retenciones.some((r) => r.contribuyenteId !== c.contribuyenteId)
    )
      return yield* rechazo(
        "identidad o ejercicio laboral contradictorios; sólo empleo ordinario único"
      )
    const contratos = solicitud.hechos.contratos
    if (
      contratos.some(
        (x) =>
          x.fecha > x.ocupacion.desde || x.pagos.some((p) => p.fecha < x.fecha)
      )
    )
      return yield* rechazo(
        "contrato posterior a la ocupación o al pago; título anterior no representado"
      )
    if (
      contratos.some((x) =>
        [x.fianzaIGVS, x.denunciaFianza].some(
          (d) => d !== null && d.fecha > finPlazoOrdinario2025
        )
      )
    )
      return yield* rechazo(
        "fianza o denuncia posterior al plazo ordinario de Renta2025; otros contextos de presentación pendientes"
      )
    const pagos = contratos.flatMap((x) => x.pagos)
    const ids = [
      ...c.trabajo.rendimientos.map((x) => x.id),
      ...v.exigibilidades.map((x) => x.id),
      ...v.gastos.map((x) => x.id),
      ...pagos.map((x) => x.id),
      ...c.retenciones.map((x) => x.id),
    ]
    const docsTrabajo = c.conciliacion.procedencia
    const docsRenta = [
      ...v.exigibilidades.map((x) => x.documento),
      ...v.gastos.map((x) => x.factura),
      ...pagos.map((x) => x.factura),
      ...c.retenciones.map((x) => x.documento),
    ]
    if (
      !unicos(ids) ||
      !unicos(docsTrabajo) ||
      !unicos(c.retenciones.map((x) => x.documento)) ||
      docsTrabajo.some((x) => docsRenta.includes(x)) ||
      c.retenciones.some((r) =>
        [
          ...v.exigibilidades.map((x) => x.documento),
          ...v.gastos.map((x) => x.factura),
          ...pagos.map((x) => x.factura),
        ].includes(r.documento)
      )
    )
      return yield* rechazo(
        "operación o documento reutilizado entre trabajo, inmuebles y pagos"
      )
    const inm = yield* producirCensoInmuebles2025(c)
    const propiedad = inm.inmuebles[0]
    if (
      propiedad === undefined ||
      propiedad.neto.n < 0n ||
      propiedad.imputacion.n !== 0n ||
      propiedad.excesoNoAplicado.n !== 0n ||
      propiedad.regimen !== "art23-50" ||
      propiedad.diasAlquilados !== 365
    )
      return yield* rechazo(
        "inmueble anual con neto no negativo y reducción50%; pérdidas, imputaciones y excesos pendientes"
      )
    const t = adaptarTrabajoAnual(c.trabajo)
    if (t.estado !== "aporte-disponible") return yield* rechazo(t.motivo)
    const netoArt19 = new D(t.rendimientoAntesArt20),
      renta = decimal(inm.neto),
      rnr = decimal(inm.netoReducido)
    if (netoArt19.lt(0))
      return yield* rechazo("trabajo negativo y compensaciones pendientes")
    const teorica = calcularReduccionTrabajoConOtrasRentas({
      anio: 2025,
      rendimientoPrevioNeto: new D(t.argumentoArt20),
      otrasRentasNoExentas: renta,
    })
    const reduccionArt20 = D.min(netoArt19, D.max(0, teorica))
    const netoTrabajo = netoArt19.minus(reduccionArt20),
      base = netoTrabajo.plus(rnr),
      cero = new D(0)
    const bruto = new D(t.gastos.integro)
    const cotizaciones = c.trabajo.rendimientos.reduce(
      (a, r) =>
        a
          .plus(r.cotizaciones.seguridadSocial)
          .plus(r.cotizaciones.derechosPasivos)
          .plus(r.cotizaciones.colegiosHuerfanos),
      cero
    )
    const composicion = yield* componerLiquidacionAnual({
      inmueblesP4a: inm.inmuebles,
      ambito: {
        anio: 2025,
        comunidadAutonoma: "galicia",
        contribuyenteId: c.contribuyenteId,
        situacionFamiliar: {
          tipo: "individual",
          edad: c.edad,
          discapacidad: { _tag: "SinDiscapacidad" },
          descendientes: [],
          ascendientes: [],
        },
      },
      cotizaciones: { naturaleza: "efectivas", trabajador: cotizaciones },
      precision: 80,
      politica: "decimal-hasta-salida",
      baseGeneral: base,
      baseAhorro: cero,
      basesImponiblesE38: { general: base, ahorro: cero },
      rentasAntesReducciones: netoArt19.plus(renta),
      rentasTrabajoAnuales: { integroTrabajo: bruto, restoRentas: renta },
      serviciosLaborales: {
        bruto,
        netoReducido: netoTrabajo,
        otrasRentas: renta,
      },
      minimosEstatales: MINIMOS_ESTATALES_2025,
      deduccionesAutonomicasCentimos: 0,
      deduccionesTerritoriales2025: c.deduccionesTerritoriales2025,
    })
    const retenciones = c.retenciones.reduce((a, r) => a.plus(r.importe), cero)
    return {
      _tag: "LiquidacionGaliciaMixta2025" as const,
      perfil: c.perfil,
      ejercicio: 2025 as const,
      contribuyenteId: c.contribuyenteId,
      liquidacionId: c.liquidacionId,
      inmuebles: inm.inmuebles,
      netoTrabajoArt19: netoArt19,
      reduccionArt20,
      netoTrabajoReducido: netoTrabajo,
      otrasRentasAntesReducciones: renta,
      baseImponibleGeneral: base,
      composicion,
      retenciones,
      cuotaDiferencial: composicion.cuotaPosterior.minus(retenciones),
      aceptacionFiscal: "pendiente" as const,
    }
  }
)
