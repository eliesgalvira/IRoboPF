import Decimal from "decimal.js"
import { DateTime, Effect } from "effect"
import { calcularReduccionRendimientosTrabajo } from "../../../../lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo"
import { calcularRendimientoNetoTrabajo } from "../../../../lib/dominio/irpf/rendimientos/rendimientos-trabajo"
import { liquidarIrpfAnual } from "../../../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../../../../lib/dominio/irpf/caso-fiscal-anual"
import type { AnioFiscal } from "../../../../lib/dominio/normativa/anio-fiscal"

const reducciones = ([2012,2013,2014,2015,2018,2019,2023,2024,2025,2026] satisfies AnioFiscal[]).flatMap(anio =>
 [0,9000,11250,13115,14047.5,14852,17673.52,19747.49,19747.5,19747.51].map(r => ({
  input: { anio, rendimientoPrevioNeto: r },
  actual: calcularReduccionRendimientosTrabajo({anio,rendimientoPrevioNeto: new Decimal(r)}).toString(),
 })))
const fechas = ["2018-07-04T12:00:00Z","2018-07-05T00:00:00Z","2018-07-05T00:00:00+02:00"].map(fecha => ({
 fecha,actual:calcularReduccionRendimientosTrabajo({anio:2018,fechaFallecimiento:DateTime.toDateUtc(DateTime.makeUnsafe(fecha)),rendimientoPrevioNeto:new Decimal(10000)}).toString(),
}))
const casos = ([2012,2014,2015,2024,2025,2026] satisfies AnioFiscal[]).flatMap(anio => [0,9000,12000,16576,17094,30000].flatMap(bruto => [0,6500,6500.01,7000].map(otras => {
 const input: CasoFiscalAnual = {
  anio,comunidadAutonoma:anio === 2026 ? "simulada-estatal" : "madrid",situacionFamiliar:{tipo:"individual",edad:40,descendientes:[],ascendientes:[],discapacidad:{_tag:"SinDiscapacidad"}},
  rendimientos:{trabajo:[{importeIntegroCentimos:Math.round(bruto*100)}],gananciasPatrimoniales:[{importeGananciaCentimos:Math.round(otras*100),tratamientoMayores65:{_tag:"SinExencionMayores65"}}]},
  reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0,
 }
 const actual = Effect.runSync(liquidarIrpfAnual(input,{modo:"canonico"}))
 const neto = calcularRendimientoNetoTrabajo({anio,rendimientoIntegro:new Decimal(bruto)})
 return {input,contexto:{modo:"canonico",supuesto:"Empleo efectivo; SS estimada asumida igual a efectiva solo para aislar este caso; ganancia sujeta no exenta sin pérdidas ni arrastres"},neto,actual}
})))
process.stdout.write(JSON.stringify({reducciones,fechas,casos},null,2)+"\n")
