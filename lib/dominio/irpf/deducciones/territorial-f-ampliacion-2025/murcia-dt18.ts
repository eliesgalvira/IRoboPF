import type { SolicitudAnualF2025 } from "./anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import type { ResultadoF } from "./comun"
import { falta } from "./comun"
import { racionalDT18 } from "../../vivienda-dt18-2025/cuota"
import { restar } from "../anual-territorial-racional"

/** DT primera.4 identifica el tramo autonómico ya consumido; nunca genera otro7,5%. */
export function evaluarMurciaDT18Estatal2025(s:SolicitudAnualF2025,m:MagnitudesTerritorialesAnuales):ResultadoF {
 const libro=m.libroDT18,cuotas=m.cuotasDT18
 if(s.codigo!=="murcia_regimen_transitorio_inversion_vivienda_habitual"||s.hechos.ramaTransitoria!=="estatal_pre2013")
  falta("ramaTransitoria","Consumidor exclusivo DT primera.4 estatal_pre2013")
 // Los hechos históricos se reciben una sola vez en viviendaDT182025.
 if(Object.keys(s.hechos).some(k=>k!=="ramaTransitoria"))
  falta("viviendaDT182025","Representar hechos/pagos/documentos sólo en el censo DT18; no derecho fiscal ni bases de cliente")
 if(libro===undefined||libro.territorio!=="murcia"||cuotas===undefined||libro.persona!==m.caso.contribuyenteId)
  falta("viviendaDT182025","Falta acceso histórico estatal reconstruido y consumo único por composición anual")
 const generado=racionalDT18(libro.generadaAutonomica),aplicado=cuotas.autonomica.total
 return {
  codigo:s.codigo,estado:"calculo_parcial",motivo:"DT primera.4: tramo autonómico del régimen estatal consumido en DT18",
  consumoCompartidoDT18:{generado,aplicado,pendiente:restar(generado,aplicado)},
  citas:["BOE-A-2011-10542.DTprimera.4","LIRPF.DT18","LIRPF2012.68.1.70.78"],
  reservas:["Sólo primera adquisición ordinaria, individual, ejercicio íntegro; no cierre del código completo"],
  rastro:["Acceso por escritura pre2013 y declaración efectivamente practicada, historia vital, préstamo original, pagos y patrimonio conciliados","Cuota autonómica ya descontada una sola vez; el total F recoge únicamente deducciones adicionales"],
 }
}
