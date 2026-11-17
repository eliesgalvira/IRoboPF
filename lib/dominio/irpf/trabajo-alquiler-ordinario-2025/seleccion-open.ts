import { SolicitudAsturiasArrendadorDerivada } from "./asturias-arrendador"
import { SolicitudMadridArrendadorDerivada } from "./madrid-arrendador"
import { Effect, Result, Schema } from "effect"
import type { EntradaComposicionAnual } from "../liquidacion/composicion-anual"
import { prepararTrabajoAlquilerOrdinario2025 } from "./preparar"
import { RechazoP4a } from "../inmobiliario-2025/contrato"
import { MINIMOS_ESTATALES_2025, type MinimosPersonalesFamiliaresIrpf } from "../../normativa/datos/minimos-autonomicos-2025"
import type { ResultadoInmuebleP4a } from "../inmobiliario-2025/censo"
import { InmuebleP4a } from "../inmobiliario-2025/hechos"

// La unión excluye las claves del otro formato mediante Never. Su equivalencia
// se define por los campos admitidos, sin derivar una equivalencia de Never.
const mismaAdquisicion = (a: InmuebleP4a["adquisicion"], b: InmuebleP4a["adquisicion"]) => {
 if (a.fecha !== b.fecha || a.escritura !== b.escritura || a.precio !== b.precio || a.gastosTributos !== b.gastosTributos) return false
 if (a.costeSuelo === undefined || b.costeSuelo === undefined)
  return a.costeSuelo === undefined && b.costeSuelo === undefined && a.sueloPrecio === b.sueloPrecio && a.sueloGastosTributos === b.sueloGastosTributos
 if (a.costeSuelo.estado === "desconocido" || b.costeSuelo.estado === "desconocido")
  return a.costeSuelo.estado === b.costeSuelo.estado
 return a.costeSuelo.precio === b.costeSuelo.precio && a.costeSuelo.gastosTributos === b.costeSuelo.gastosTributos
}
const mismosHechos = Schema.toEquivalence(Schema.Struct({
 ...InmuebleP4a.fields,
 adquisicion: InmuebleP4a.fields.adquisicion.pipe(Schema.overrideToEquivalence(() => mismaAdquisicion)),
}))
const mismosMinimos = (a: MinimosPersonalesFamiliaresIrpf, b: MinimosPersonalesFamiliaresIrpf) =>
 (["general", "adicionalMayor65", "adicionalMayor75"] as const).every(k=>a.contribuyente[k].eq(b.contribuyente[k])) &&
 (["primero", "segundo", "tercero", "cuartoYSiguientes", "adicionalMenorTres"] as const).every(k=>a.descendientes[k].eq(b.descendientes[k])) &&
 (["mayor65OConDiscapacidad", "adicionalMayor75"] as const).every(k=>a.ascendientes[k].eq(b.ascendientes[k])) &&
 (["contribuyente", "descendiente", "ascendiente"] as const).every(s=>
  (["grado33Hasta65", "grado65OMas", "gastosAsistencia"] as const).every(k=>a.discapacidad[s][k].eq(b.discapacidad[s][k])))

const mismoInmueble = (a: ResultadoInmuebleP4a, b: ResultadoInmuebleP4a) =>
 a.comprobacionVacia2024 === undefined && b.comprobacionVacia2024 === undefined &&
 a.categoria === b.categoria && a.regimen === b.regimen &&
 a.diasAlquilados === b.diasAlquilados && a.diasImputados === b.diasImputados &&
 mismosHechos(a.inmueble,b.inmueble) &&
 a.seguimiento.length === b.seguimiento.length && a.seguimiento.every((v,i)=>v===b.seguimiento[i]) &&
 (["integro", "gastosLimitados", "excesoNoAplicado", "otrosGastos", "amortizacion", "neto", "reduccion", "netoReducido", "imputacion"] as const)
  .every(k => a[k].n === b[k].n && a[k].d === b[k].d)

/** Ningún flag otorga cuantización: reproduce productores y concilia hechos y magnitudes.
 * Patrón Effect.fn/Effect.fail del núcleo anual; sin nuevos servicios ni capas.
 */
export const seleccionarPoliticaAlquilerOpen2025=Effect.fn("Alquiler.seleccionarOpen2025")(function* (e:EntradaComposicionAnual) {
 const fail=()=>new RechazoP4a({codigo:"renta-mixta",motivo:"Open alquiler: hechos o magnitudes contradictorios"})
 const h=e.hechosAlquilerOpen2025
 if(h===undefined || e.cotizaciones.naturaleza!=="efectivas") return yield* fail()
 const p=yield* prepararTrabajoAlquilerOrdinario2025(h,"efectivas")
 const c=p.c, s=e.ambito.situacionFamiliar
 if(p.politicaOpen===undefined || e.politica!=="decimal-hasta-salida" || e.precision!==80 ||
  e.ambito.anio!==c.ejercicio || e.ambito.contribuyenteId!==c.contribuyenteId ||
  e.ambito.comunidadAutonoma!==c.comunidadAutonoma || s.tipo!=="individual" || s.edad!==c.edad ||
  s.discapacidad._tag!=="SinDiscapacidad" || s.descendientes.length!==0 || s.ascendientes.length!==0 ||
  e.ambito.derechosMinimos!==undefined || e.ambito.fechaFallecimiento!==undefined ||
  !e.cotizaciones.trabajador.eq(p.cotizaciones) || !e.baseGeneral.eq(p.base) || !e.baseAhorro.isZero() ||
  !e.rentasAntesReducciones.eq(p.neto.plus(p.renta)) ||
  e.basesImponiblesE38===undefined || !e.basesImponiblesE38.general.eq(p.base) || !e.basesImponiblesE38.ahorro.isZero() ||
  e.rentasTrabajoAnuales===undefined || !e.rentasTrabajoAnuales.integroTrabajo.eq(p.bruto) || !e.rentasTrabajoAnuales.restoRentas.eq(p.renta) ||
  e.rentasTrabajoAnuales.hechosCLM2025!==undefined || e.serviciosLaborales===undefined ||
  !e.serviciosLaborales.bruto.eq(p.bruto) || e.serviciosLaborales.netoReducido===undefined || !e.serviciosLaborales.netoReducido.eq(p.neto) ||
  e.serviciosLaborales.otrasRentas===undefined || !e.serviciosLaborales.otrasRentas.eq(p.renta) ||
  e.deduccionesAutonomicasCentimos!==0 || e.origenBaseGeneralB!==undefined || e.rentaActividadAnualB!==undefined ||
  e.deduccionesValencianas2025!==undefined ||
  e.maternidad2025!==undefined || e.ingresosIdentificados2025!==undefined || e.basesFamiliares2025!==undefined ||
  e.conjunta2025!==undefined || e.aragonSocialMixto2025!==undefined || e.pagadoresCatalunya2025!==undefined ||
  e.hechosFamiliaOpen2025!==undefined || e.hechosOpen2020A2022!==undefined || e.hechosOpen2023A2024!==undefined)
  return yield* fail()
 // Sólo admite la solicitud reproducida desde los hechos conciliados.
 if(p.solicitudMadrid===undefined) {
  if(e.deduccionesTerritoriales2025!==undefined) return yield* fail()
 } else {
  const forma=Schema.Union([SolicitudMadridArrendadorDerivada,SolicitudAsturiasArrendadorDerivada])
  const decode=Schema.decodeUnknownResult(forma)
  const esperado=decode(p.solicitudMadrid,{onExcessProperty:"error"})
  const recibido=decode(e.deduccionesTerritoriales2025,{onExcessProperty:"error"})
  if(Result.isFailure(esperado) || Result.isFailure(recibido) ||
   !Schema.toEquivalence(forma)(esperado.success,recibido.success)) return yield* fail()
 }
 // Comparación de contenido, no de identidad de objetos. Conserva los racionales exactos.
 if(!mismosMinimos(e.minimosEstatales,MINIMOS_ESTATALES_2025) ||
  e.inmueblesP4a===undefined || e.inmueblesP4a.length!==p.inm.inmuebles.length ||
  e.inmueblesP4a.some((v,i)=>!mismoInmueble(v,p.inm.inmuebles[i]!)))
  return yield* fail()
 return p.politicaOpen
})
