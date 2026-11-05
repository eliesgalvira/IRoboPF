import Decimal from "decimal.js"
import { Effect } from "effect"
import { MINIMOS_ESTATALES_2025 } from "../../normativa/datos/minimos-autonomicos-2025"
import { componerLiquidacionAnual } from "../liquidacion/composicion-anual"
import type { CasoInmobiliarioP4a } from "./contrato"
import { producirInmueblesP4a, type ExactoP4a } from "./productor"

const D = Decimal.clone({ precision: 80 })
const decimal = (x: ExactoP4a) => new D(x.n.toString()).div(x.d.toString())

/** Ambas entradas delegan aquí: una integración de renta y un libro de cuota. */
export const liquidarInmobiliarioP4a = Effect.fn("P4a.liquidar")(function* (entrada: CasoInmobiliarioP4a) {
  const producido = yield* producirInmueblesP4a(entrada)
  const { caso, inmuebles } = producido
  const cero = new D(0), netoReducido = decimal(producido.netoReducido)
  const composicion = yield* componerLiquidacionAnual({
    inmueblesP4a: inmuebles,
    ambito: {
      anio: 2025, comunidadAutonoma: caso.comunidadAutonoma, contribuyenteId: caso.contribuyenteId,
      situacionFamiliar: { tipo: "individual", edad: caso.edad, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] },
    },
    cotizaciones: { naturaleza: "efectivas", trabajador: cero },
    precision: 80,
    politica: "decimal-hasta-salida",
    baseGeneral: D.max(0, netoReducido),
    basesImponiblesE38: { general: netoReducido, ahorro: cero },
    baseAhorro: cero,
    rentasAntesReducciones: decimal(producido.neto),
    rentasTrabajoAnuales: { integroTrabajo: cero, restoRentas: decimal(producido.neto) },
    minimosEstatales: MINIMOS_ESTATALES_2025,
    deduccionesAutonomicasCentimos: 0,
    deduccionesTerritoriales2025: caso.deduccionesTerritoriales2025,
  })
  const retenciones = caso.retenciones.reduce((a, r) => a.plus(r.importe), cero)
  return {
    _tag: "LiquidacionInmobiliariaP4a" as const,
    perfil: caso.perfil,
    liquidacionId: caso.liquidacionId,
    contribuyenteId: caso.contribuyenteId,
    ejercicio: 2025 as const,
    inmuebles,
    netoAntesReducciones: producido.neto,
    netoReducido: producido.netoReducido,
    reduccionArt20: cero,
    deduccionDA61: composicion.deduccionTrabajo,
    baseImponibleGeneral: netoReducido,
    composicion,
    retenciones,
    cuotaDiferencial: composicion.cuotaPosterior.minus(retenciones),
    limite: "Perfil inmobiliario 2025 acotado; cálculo condicionado a los hechos declarados y sus restricciones",
  }
})
