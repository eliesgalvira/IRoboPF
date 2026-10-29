import { Effect } from "effect"
import { expect, it } from "@effect/vitest"
import Decimal from "decimal.js"
import { liquidarIrpfAnual } from "/home/elies/.t3/worktrees/IRoboPF/t3-666c0a2b/lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { sinDiscapacidad, type CasoFiscalAnual } from "/home/elies/.t3/worktrees/IRoboPF/t3-666c0a2b/lib/dominio/irpf/caso-fiscal-anual"
import { calcularRetencionTrabajoAeat, type CasoRetencionTrabajo } from "/home/elies/.t3/worktrees/IRoboPF/t3-666c0a2b/lib/dominio/irpf/retenciones/retencion-trabajo-aeat"
import { obtenerMinimoDescendientes } from "/home/elies/.t3/worktrees/IRoboPF/t3-666c0a2b/lib/dominio/irpf/minimos/minimo-descendientes"
import { calcularCuotaPorEscalaGeneral } from "/home/elies/.t3/worktrees/IRoboPF/t3-666c0a2b/lib/dominio/irpf/cuotas/escalas-gravamen"
import { compararAjustadoPorIpc } from "/home/elies/.t3/worktrees/IRoboPF/t3-666c0a2b/lib/dominio/compatibilidad-legacy/progresividad-frio"

const familia = [{edad:8, discapacidad:sinDiscapacidad},{edad:5, discapacidad:sinDiscapacidad}]
it("CX06: la API no representa el reparto entre dos titulares", () => {
  // Contraprueba normativa, NO reconstrucción de la captura: ambos progenitores
  // residentes, convivencia común, hijos sin rentas, declaraciones individuales.
  // Ambos casos colisionan en esta proyección; 2550 corresponde a cada titular.
  expect(obtenerMinimoDescendientes(familia).toString()).toBe("2550")
})
it("CX04: precisión no visible discrimina el último céntimo", () => {
  expect(calcularCuotaPorEscalaGeneral({anio:2025,base:new Decimal("126548.01")}).toFixed(2)).toBe("47848.10")
  expect(calcularCuotaPorEscalaGeneral({anio:2025,base:new Decimal("126548.014")}).toFixed(2)).toBe("47848.11")
})
it.effect("CX05: tabla de retención bajo hipótesis 2026 explícitas", () => Effect.gen(function*(){
 for (const [salario,esperado] of [[20000,31600],[22000,117700],[30000,395700]] as const) {
  const caso: CasoRetencionTrabajo={anio:2026,fechaPago:"2026-10-29",edad:40,retribucionAnualCentimos:salario*100,cotizacionesCentimos:salario*6.5,situacionFamiliar:"situacion2",situacionLaboral:"activo",contrato:"general",discapacidad:"sin-discapacidad",movilidadGeografica:false,descendientes:[8,5].map(edad=>({edad,computoPorEntero:true,discapacidad:"sin-discapacidad",movilidadReducida:false,adopcionOAcogimientoMenosTresAnios:false})),ascendientes:[],irregular1Centimos:0,irregular2Centimos:0,pensionCompensatoriaConyugeCentimos:0,anualidadesAlimentosHijosCentimos:0,residenciaCeutaMelilla:false,rendimientosCeutaMelilla:false,pagosViviendaHabitual:false}
  const r=yield* calcularRetencionTrabajoAeat(caso,{modo:"canonico"})
  expect(r.importeRetencionAnualCentimos).toBe(esperado)
 }
}))
it.effect("CX07: comparación real en base fijada",()=>Effect.gen(function*(){
 const r=yield* compararAjustadoPorIpc({salarioBrutoAnualReferenciaCentimos:2270016,anioComparado:2025,anioReferencia:2026})
 expect(r.factorIpc).toBe("1.030000000000")
}))
it.effect("CX04: liquidación actual conserva decimales antes de presentar",()=>Effect.gen(function*(){
 const caso:CasoFiscalAnual={anio:2025,comunidadAutonoma:"simulada-estatal",situacionFamiliar:{tipo:"individual",edad:40,descendientes:[],ascendientes:[],discapacidad:sinDiscapacidad},rendimientos:{trabajo:[{importeIntegroCentimos:13250000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0}
 const r=yield* liquidarIrpfAnual(caso,{modo:"canonico"})
 expect(r._tag).toBe("LiquidacionIrpfAnualCalculada")
}))
it.effect("CX07-B: el neto anunciado tras obligación de declarar debe usar esa cuota",()=>Effect.gen(function*(){
 const r=yield* compararAjustadoPorIpc({salarioBrutoAnualReferenciaCentimos:2270016,anioComparado:2025,anioReferencia:2026})
 expect(r.comparado.salarioBrutoNominalAnualCentimos).toBeGreaterThan(2200000)
 expect(r.comparado.ajustado.irpfFinalCentimos).toBe(r.comparado.ajustado.irpfConObligacionDeclararCentimos)
}))
