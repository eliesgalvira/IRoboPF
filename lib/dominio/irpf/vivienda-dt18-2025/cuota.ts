import { racional, consumirCuota } from "../deducciones/anual-territorial-racional"
import type { Racional } from "../deducciones/anual-territorial-racional"
import type { R } from "../deducciones/galicia-rioja-ampliacion-2025/comun"
import type { LibroDT182025 } from "./productor"
export const racionalDT18=(v:R)=>racional(String(v.n),String(v.d*100n))
export function aplicarCuotasDT18(libro:LibroDT182025,estatal:Racional,autonomica:Racional){
 return {estatal:consumirCuota(estatal,[racionalDT18(libro.generadaEstatal)]),autonomica:consumirCuota(autonomica,[racionalDT18(libro.generadaAutonomica)])}
}
