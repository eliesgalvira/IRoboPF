// Continuación GRANT0: helper de transporte, sin runtime ejecutado.
import { expect } from "vitest"
import { Effect, Schema } from "effect"
import { SolicitudDeduccionesTerritoriales2025 } from "../../lib/dominio/irpf/deducciones/anual-territorial"
import { producirAplicacionViviendaCLM2024 } from "../../lib/dominio/irpf/deducciones/clm-vivienda-historia-positiva-2025"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../../lib/dominio/irpf/caso-fiscal-anual"
import type { CasoFiscalAnualExplicito } from "../../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import fixture from "./clm-vivienda-aplicacion-2024.json"
type Sobre = typeof SolicitudDeduccionesTerritoriales2025.Type
type Territorio = "castilla-la-mancha"
export const sobre = <Entrada>(raw: Entrada): Sobre => Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)(raw, { onExcessProperty: "error" })
export const entrada = () => structuredClone(fixture)
const solicitud = (raw = entrada()) => {
  const s = sobre({ solicitudes: [raw] }).solicitudes[0]!
  if (s.lote !== "D51" || s.codigo !== "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales" || s.aplicacionViviendaCLM2024 === undefined)
    throw new Error("Fixture de otra ruta")
  return s
}
export const producir = (raw = entrada()) => {
  const s = solicitud(raw)
  return producirAplicacionViviendaCLM2024(s.aplicacionViviendaCLM2024!, s.historiaBases, {
    codigo: s.codigo, titular: "s-1", objeto: "v", fechaOperacion: s.hechos.fechaOperacion,
    pagos: s.hechos.pagos, costePropio: s.hechos.coste,
  }, s.hechos, 30, { ejercicio: 2025, titular: "s-1", origen: "canonica",
    rendimientos: [{ id: null, clase: "empleo-laboral", integro: "25000", cotizaciones: null }], retenciones: "0" })
}
export function igual(r: { readonly numeradorEuros: string; readonly divisor: string } | undefined, fraccion: string) {
  if (r === undefined) throw new Error("Falta racional")
  const [n, d = "1"] = fraccion.split("/")
  expect(BigInt(r.numeradorEuros) * BigInt(d)).toBe(BigInt(n!) * BigInt(r.divisor))
}
export function clasico(s: Sobre, t: Territorio): CasoFiscalAnual {
  return {anio:2025,comunidadAutonoma:t,contribuyenteId:"s-1",situacionFamiliar:{tipo:"individual",edad:30,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:2500000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0,deduccionesTerritoriales2025:s}
}
export function efectivo(s: Sobre, t: Territorio): CasoFiscalAnualExplicito {
  return {ejercicio:2025,comunidadAutonoma:t,contribuyenteId:"s-1",edad:30,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s,rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"r",clase:"empleo-laboral",integro:"25000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[]}
}



export const ejecutar = <Entrada>(api: "canonica" | "explicita", raw: Entrada, edad = 30) => {
  const s = sobre({ solicitudes: [raw] })
  return Effect.gen(function* () {
    if (api === "canonica") return yield* liquidarIrpfAnual({ ...clasico(s, "castilla-la-mancha"), situacionFamiliar: {
        tipo: "individual", edad, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } }, { modo: "canonico" })
    return yield* liquidarIrpfAnualExplicito({ ...efectivo(s, "castilla-la-mancha"), edad })
  })
}
/** Escenarios positivos explícitos. Nunca se llama desde ejecutar/sobre/producir.
 * Saldos y consumo especificados por valor; el motor debe comprobarlos.
 */
export function salario24(bruto: "21487.50" | "21487.59") {
  const x = entrada(), h = x.aplicacionViviendaCLM2024, p = h.patrimonioHistorico
  h.trabajo.rendimientos[0]!.integro = bruto
  h.certificados[0]!.integro = bruto
  p.cortes2024.salarios[0]!.integro = bruto
  p.cortes2024.movimientos[0]!.importe = bruto
  p.cortes2024.movimientos[2]!.importe = bruto === "21487.50" ? "11487.49" : "11487.58"
  p.cortes2024.cuentas[0]!.cierre.importe = "20000"
  p.cortes2025.cuentas[0]!.inicio.importe = "20000"
  p.cortes2025.cuentas[0]!.cierre.importe = "25000.01"
  return x
}
