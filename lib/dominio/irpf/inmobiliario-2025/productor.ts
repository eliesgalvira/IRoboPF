import { Effect, Result, Schema } from "effect"
import { CasoInmobiliarioP4a, RechazoP4a } from "./contrato"
import { producirCensoInmuebles2025 } from "./censo"
export { producirCensoInmuebles2025 } from "./censo"
export type { ExactoP4a, ResultadoInmuebleP4a } from "./censo"

export const producirInmueblesP4a = Effect.fn("P4a.producir")(function* (entrada: CasoInmobiliarioP4a | Schema.Json) {
  const decoded = Schema.decodeUnknownResult(CasoInmobiliarioP4a)(entrada, { onExcessProperty: "error" })
  if (Result.isFailure(decoded)) return yield* new RechazoP4a({ codigo: "entrada", motivo: "Perfil P4a fuera del esquema cerrado: " + String(decoded.failure) })
  const caso = decoded.success
  const esRioja = caso.comunidadAutonoma === "la-rioja"
  if (esRioja) {
    const plan = caso.deduccionesTerritoriales2025?.solicitudes
    if (caso.inmuebles.length !== 1 || caso.inmuebles.some(v => v.ubicacion !== "galicia" ||
      v.primerAlquiler2025 !== undefined || v.vaciaExt2025 !== undefined || v.cambioHabitualBalears2025 !== undefined) ||
      plan?.length !== 1 || plan[0]?.lote !== "E38" || plan[0]?.hechos.codigo !== "rioja_arrendamiento_menores_36" ||
      (plan[0]?.historiaInversionAlquilerRioja === undefined && caso.deduccionesTerritoriales2025?.derechoInversionAlquilerRioja2025 === undefined))
      return yield* new RechazoP4a({ codigo: "entrada", motivo: "Rioja: sólo alquiler propio e inversión única en Galicia con historia expresa" })
  }
  const esGalicia = caso.comunidadAutonoma === "galicia"
  if (esGalicia) {
    const plan = caso.deduccionesTerritoriales2025?.solicitudes
    if (caso.inmuebles.length !== 1 || caso.inmuebles.some(v => v.ubicacion !== "galicia" ||
      v.primerAlquiler2025 !== undefined || v.vaciaExt2025 !== undefined || v.cambioHabitualBalears2025 !== undefined) ||
      plan?.length !== 1 || plan[0]?.lote !== "E38" || plan[0]?.hechos.codigo !== "galicia_alquiler_vivienda_habitual")
      return yield* new RechazoP4a({ codigo: "entrada", motivo: "Galicia: inmueble único y solicitud E38 de alquiler propio" })
  } else if (!esRioja && caso.inmuebles.some(v => v.cambioHabitual2025 !== undefined))
    return yield* new RechazoP4a({ codigo: "entrada", motivo: "Cambio2025: consumidor territorial no representado" })
  const esExt = caso.comunidadAutonoma === "extremadura"
  if (esExt ? (caso.inmuebles.length !== 1 || caso.inmuebles[0]?.vaciaExt2025 === undefined || caso.inmuebles.some(v => v.primerAlquiler2025 !== undefined)) : caso.inmuebles.some(v => v.vaciaExt2025 !== undefined))
    return yield* new RechazoP4a({ codigo: "entrada", motivo: "EXT: una vivienda exclusiva con hechos vaciaExt2025; sin mezcla P4b ni otros territorios" })
  const esPrimerAlquiler = caso.inmuebles.some(v => v.primerAlquiler2025 !== undefined)
  if (esPrimerAlquiler && (caso.inmuebles.length !== 1 || caso.inmuebles[0]?.primerAlquiler2025 === undefined))
    return yield* new RechazoP4a({ codigo: "entrada", motivo: "P4b limitado a una vivienda y sin mezcla con P4a" })
  const codigoAdmitido = esExt ? "extremadura_arrendadores_viviendas_vacias" : caso.comunidadAutonoma === "canarias"
    ? (esPrimerAlquiler ? "canarias_puesta_viviendas_mercado_arrendamiento" : "canarias_adecuacion_inmueble_arrendamiento")
    : (esPrimerAlquiler ? "balears_arrendador_vivienda_permanente_otros_gastos" : "balears_mejora_sostenibilidad_vivienda")
  const esCambio = caso.inmuebles.some(v => v.cambioHabitualBalears2025 !== undefined)
  if (esCambio && (caso.comunidadAutonoma !== "illes-balears" || caso.inmuebles.length !== 1 ||
    caso.inmuebles[0]?.cambioHabitualBalears2025 === undefined || esPrimerAlquiler ||
    caso.deduccionesTerritoriales2025?.solicitudes.length !== 1))
    return yield* new RechazoP4a({ codigo: "entrada", motivo: "T06_P4A_AMBITO: una vivienda y solicitud de alquiler balear" })
  if (!esGalicia && !esRioja && caso.deduccionesTerritoriales2025 !== undefined && caso.deduccionesTerritoriales2025.solicitudes.some(s => s.lote !== (esExt ? "D51" : "C36") || s.codigo !== (esCambio ? "balears_arrendamiento_vivienda_habitual" : codigoAdmitido)))
    return yield* new RechazoP4a({ codigo: "entrada", motivo: "Perfil inmobiliario conecta exclusivamente su consumidor regional; combinaciones pendientes" })
  if (esCambio) {
    const h = caso.inmuebles[0]?.cambioHabitualBalears2025
    if (h === undefined || h.persona !== caso.contribuyenteId || 2025 - Number(h.nacimiento.slice(0, 4)) !== caso.edad)
      return yield* new RechazoP4a({ codigo: "identidad", motivo: "T06_P4A_SUJETO: cambio habitual ajeno" })
  }
  const censo = yield* producirCensoInmuebles2025(caso)
  return { ...censo, caso }
})
