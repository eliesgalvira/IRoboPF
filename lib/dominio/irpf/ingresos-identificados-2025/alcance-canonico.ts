import type { CasoFiscalAnual } from "../caso-fiscal-anual"

const campos = new Set([
  "ingresosIdentificados2025", "contribuyenteId", "anio", "comunidadAutonoma",
  "fechaFallecimiento", "situacionFamiliar", "derechosMinimos", "rendimientos",
  "reducciones", "deducciones", "deduccionesTerritoriales2025", "deduccionesValencianas2025",
  "deduccionAutonomicaAgregadaCentimos", "retencionesSoportadasCentimos", "pagosACuentaCentimos", "retencionTrabajoAeat",
])
/** Cierra exclusivamente la rama nueva, sin ampliar perfiles heredados. */
export function motivoFueraAlcanceIngresosCanonico(caso: CasoFiscalAnual): string | undefined {
  if (Object.keys(caso).some(k => !campos.has(k)) || Object.keys(caso.rendimientos).some(k => !["trabajo", "capitalInmobiliario", "gananciasPatrimoniales"].includes(k)))
    return "P1 no admite bases, compensaciones, tipos ni otras magnitudes externas"
  if (caso.reducciones.length !== 0 || (caso.rendimientos.capitalInmobiliario?.length ?? 0) !== 0)
    return "P1 sólo trabajo y ayudas identificadas, con ahorro positivo opcional; sin alquiler simplificado, reducciones ni compensaciones de base"
  if (caso.rendimientos.trabajo.some(r => !Number.isSafeInteger(r.importeIntegroCentimos) || r.importeIntegroCentimos < 0))
    return "Trabajo P1 necesita importes íntegros no negativos en céntimos seguros"
  if (caso.rendimientos.gananciasPatrimoniales?.some(g => !Number.isSafeInteger(g.importeGananciaCentimos) || g.importeGananciaCentimos < 0 || g.tratamientoMayores65._tag !== "SinExencionMayores65" || g.exencionInmuebleUrbanoAdquirido2012 !== undefined) === true)
    return "Ahorro P1: transmisión sujeta positiva; pérdidas, exenciones y compensaciones fuera de la atribución soportada"
  return undefined
}
