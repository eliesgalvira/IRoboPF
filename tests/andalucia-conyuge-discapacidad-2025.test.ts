import { consumirCuota, racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { it, expect } from "vitest"
import { Effect, Schema } from "effect"
import Decimal from "decimal.js"
import { analitico, efectivo } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { evaluarAmpliacionAnualA2025 } from "../lib/dominio/irpf/deducciones/ampliacion-a-anual"
import { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial-esquemas"
import { producirEconomiaAjena2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
const codigo = "andalucia_conyuge_pareja_discapacidad"
function solicitud() {
  return { lote: "A40", codigo, nacimiento: "1985-01-01", hechos: {
    persona: "s-2", contribuyente: "s-1", nacimiento: "1980-01-01", relacion: "conyuge",
    registroRelacion: "matrimonio-sintetico", administracionRegistro: "civil", desde: "2010-01-01",
    residenteComunTodo2025: true, vivoTodo2025: true, grado: 65, resolucion: "resolucion-sintetica", reconocimientoDesde: "2020-01-01",
    declaracion: { ejercicio: 2025, persona: "s-2", modalidad: "no-presenta", soporte: "no-presentacion2025" },
    economia: { perfil: "sin-rentas", censoRentasCompleto: true },
  }} as const
}
const contexto = (base = "25000") => ({ caso: { anio:2025, comunidadAutonoma:"andalucia", contribuyenteId:"s-1", situacionFamiliar:analitico.situacionFamiliar },
  basesImponiblesE38:{general:new Decimal(base),ahorro:new Decimal(0)}, baseGeneral:new Decimal(base), baseAhorro:new Decimal(0), basesLiquidables:{general:new Decimal(base),ahorro:new Decimal(0)},
  componentesMinimoEstatal:{contribuyente:new Decimal(5550),descendientes:new Decimal(0)},
  minimoPersonalFamiliar:new Decimal(5550), cuotaAutonomica:new Decimal(1000), sujetosConMinimo:[] }) as const
it.each(["25000", "24999.99999999999999999999999999999999999999"])("límite inclusivo propio %s", b => {
 const s=solicitud(), r=evaluarAmpliacionAnualA2025(s,contexto(b),[s])
 expect(r.estado).toBe("calculo_parcial")
 if(r.estado!=="calculo_parcial")throw Error("sin importe")
 expect(r.importeExactoEuros).toBe("100")
})
it("exceso infinitesimal no se redondea antes de elegibilidad",()=>{
 const s=solicitud();expect(evaluarAmpliacionAnualA2025(s,contexto("25000.00000000000000000000000000000000000001"),[s]).estado).toBe("no_soportado")
})
it("pareja registrada es independiente de hijos/unidad art82",()=>{
 const s=solicitud(), p={...s,hechos:{...s.hechos,relacion:"pareja-inscrita",administracionRegistro:"otra-administracion-publica"}} as const
 expect(evaluarAmpliacionAnualA2025(p,contexto(),[p]).estado).toBe("calculo_parcial")
})
it("DT1 judicial anterior2022 acredita65 sin equiparar pensión por sí sola",()=>{
 const s=solicitud(), p={...s,hechos:{...s.hechos,grado:33,incapacitacionJudicial:{fecha:"2021-12-31",resolucion:"judicial"}}}
 expect(evaluarAmpliacionAnualA2025(p,contexto(),[p]).estado).toBe("calculo_parcial")
 expect(evaluarAmpliacionAnualA2025({...s,hechos:{...s.hechos,grado:33}},contexto(),[s]).estado).toBe("no_soportado")
})
it.each(["empleo-laboral", "pension"] as const)("no declarante con %s tiene renta económica propia; 8000 no es límite art17", clase=>{
 if(efectivo.perfil!=="solo-trabajo")throw Error("fixture")
 const economia={perfil:"solo-trabajo",censoRentasCompleto:true,otrasRentas:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",trabajo:{...efectivo.trabajo,discapacidadActiva:clase === "pension" ? "ninguna" : {grado:"65-o-mas",ayudaOMovilidadReducida:"no",acreditadaDuranteTodoElTrabajo:"si"} as const,rendimientos:efectivo.trabajo.rendimientos.map(r=>({...r,clase}))}} as const
 // Oráculo racional: empleo resta además7750; pensión no. Art20 cero por argumento28056.
 const b=producirEconomiaAjena2025(economia,false);expect(b.general.toFixed()).toBe(clase === "pension" ? "26056" : "18306");expect(b.rentaAntesReducciones!.toFixed()).toBe(clase === "pension" ? "26056" : "18306")
 const s=solicitud(), p={...s,hechos:{...s.hechos,economia}}
 expect(evaluarAmpliacionAnualA2025(p,contexto(),[p]).estado).toBe("calculo_parcial")
 const solicitudD={solicitudes:[p]}, e=explicito()
 const antes=Effect.runSync(liquidarIrpfAnual(a,{modo:"canonico"})),despues=Effect.runSync(liquidarIrpfAnual({...a,deduccionesTerritoriales2025:solicitudD},{modo:"canonico"}))
 expect(antes.cuotaLiquidaCentimos-despues.cuotaLiquidaCentimos).toBe(10000)
 const eb=Effect.runSync(liquidarIrpfAnualExplicito({...e,deducciones:"solo-da61-si-procede"})),ed=Effect.runSync(liquidarIrpfAnualExplicito({...e,deduccionesTerritoriales2025:solicitudD}))
 expect(new Decimal(eb.cuotaLiquidaLegal).minus(ed.cuotaLiquidaLegal).toFixed()).toBe("100")
})
const a={...analitico,contribuyenteId:"s-1",comunidadAutonoma:"andalucia",rendimientos:{trabajo:[{importeIntegroCentimos:2600000}]}} as const
function explicito() {
 if(efectivo.perfil!=="solo-trabajo")throw Error("fixture")
 return {...efectivo,contribuyenteId:"s-1",comunidadAutonoma:"andalucia",deducciones:"territoriales-por-hechos-y-da61",trabajo:{...efectivo.trabajo,rendimientos:efectivo.trabajo.rendimientos.map(r=>({...r,integro:"28000"}))}} as const
}
it("ambas API: 100 íntegros una vez, sin mínimos inventados",()=>{
 const s={solicitudes:[solicitud()]}, e=explicito()
 const antes=Effect.runSync(liquidarIrpfAnual(a,{modo:"canonico"})),despues=Effect.runSync(liquidarIrpfAnual({...a,deduccionesTerritoriales2025:s},{modo:"canonico"}))
 expect(antes.cuotaLiquidaCentimos-despues.cuotaLiquidaCentimos).toBe(10000)
 const eb=Effect.runSync(liquidarIrpfAnualExplicito({...e,deducciones:"solo-da61-si-procede"})),ed=Effect.runSync(liquidarIrpfAnualExplicito({...e,deduccionesTerritoriales2025:s}))
 expect(new Decimal(eb.cuotaLiquidaLegal).minus(ed.cuotaLiquidaLegal).toFixed()).toBe("100")
 expect(ed.baseLiquidableGeneral).toBe(eb.baseLiquidableGeneral)
})
it("ambas API cuota cero: no crea devolución por100",()=>{
 const solicitudD={solicitudes:[solicitud()]}
 const ac={...a,rendimientos:{trabajo:[{importeIntegroCentimos:0}]},deduccionesTerritoriales2025:solicitudD}
 expect(Effect.runSync(liquidarIrpfAnual(ac,{modo:"canonico"})).cuotaLiquidaCentimos).toBe(0)
 const e=explicito(),ec={...e,trabajo:{...e.trabajo,rendimientos:e.trabajo.rendimientos.map(r=>({...r,integro:"0",cotizaciones:{...r.cotizaciones,seguridadSocial:"0"}}))},deduccionesTerritoriales2025:solicitudD}
 expect(Effect.runSync(liquidarIrpfAnualExplicito(ec)).cuotaLiquidaLegal).toBe("0")
})
it.each([
 { persona:"s-1" },{ contribuyente:"s-9" },{ desde:"2026-01-01" },{ hasta:"2025-12-30" },
 { desde:"2025-02-30" },{ nacimiento:"2010-01-01" },{ reconocimientoDesde:"2026-01-01" },
 { reconocimientoHasta:"2025-12-30" },{ administracionRegistro:"andalucia" },
 { declaracion:{ejercicio:2025,persona:"s-2",modalidad:"individual",soporte:"declaracion-cero"} },
 { declaracion:{ejercicio:2025,persona:"s-2",modalidad:"conjunta",soporte:"conjunta"} },
 { declaracion:{ejercicio:2025,persona:"s-9",modalidad:"no-presenta",soporte:"ajena"} },
 { economia:{perfil:"declarante-en-composicion"} },{ economia:{perfil:"sin-rentas",censoRentasCompleto:true,baseGeneral:0} },
 { economia:{perfil:"capital"} },{ deduccionPropiaArt16:"no-aplicada" },{ declaracionPropia:"no-presenta" },
 { incapacitacionJudicial:{fecha:"2022-01-01",resolucion:"tardia"} },
])("ambas API rechazan por causa hechos adversos %j", cambio=>{
 const original=solicitud(), datos={solicitudes:[{...original,hechos:{...original.hechos,...cambio}}]}
 const r=Schema.decodeUnknownResult(SolicitudDeduccionesTerritoriales2025)(datos,{onExcessProperty:"error"})
 // La API debe rechazar también cuando el objeto pasa su contrato estructural.
 expect(r).toBeDefined()
 /* SAFETY: mezcla adversa intencional; se exige rechazo de la API sin calcular dinero. */
 expect(()=>Effect.runSync(liquidarIrpfAnual({...a,deduccionesTerritoriales2025:datos} as never,{modo:"canonico"}))).toThrow()
 /* SAFETY: mismo objeto adverso para validar la segunda frontera pública. */
 expect(()=>Effect.runSync(liquidarIrpfAnualExplicito({...explicito(),deduccionesTerritoriales2025:datos} as never))).toThrow()
})

it("BIG y BLG no se confunden tras reducciones de base",()=>{
 const s=solicitud(), m={...contexto("20000"),basesImponiblesE38:{general:new Decimal("25000.01"),ahorro:new Decimal(0)}}
 expect(evaluarAmpliacionAnualA2025(s,m,[s]).estado).toBe("no_soportado")
})
it("cuota insuficiente ambas API: el oráculo limita100 por la cuota autonómica disponible",()=>{
 const s={solicitudes:[solicitud()]}, e=explicito()
 const ab={...a,rendimientos:{trabajo:[{importeIntegroCentimos:1500000}]}}
 const ra=Effect.runSync(liquidarIrpfAnual(ab,{modo:"canonico"})), rb=Effect.runSync(liquidarIrpfAnual({...ab,deduccionesTerritoriales2025:s},{modo:"canonico"}))
 expect(ra.cuotaLiquidaCentimos).toBeGreaterThanOrEqual(rb.cuotaLiquidaCentimos)
 expect(ra.cuotaLiquidaCentimos-rb.cuotaLiquidaCentimos).toBeLessThanOrEqual(10000)
 const eb={...e,trabajo:{...e.trabajo,rendimientos:e.trabajo.rendimientos.map(r=>({...r,integro:"15000",cotizaciones:{...r.cotizaciones,seguridadSocial:"0"}}))}}
 const re=Effect.runSync(liquidarIrpfAnualExplicito({...eb,deducciones:"solo-da61-si-procede"})),rf=Effect.runSync(liquidarIrpfAnualExplicito({...eb,deduccionesTerritoriales2025:s}))
 expect(new Decimal(re.cuotaLiquidaLegal).minus(rf.cuotaLiquidaLegal).lte(100)).toBe(true)
})

it("renta de mínimos es neto art19 antes de art20, no BIG ni bruto",()=>{
 if(efectivo.perfil!=="solo-trabajo")throw Error("fixture")
 const economia={perfil:"solo-trabajo",censoRentasCompleto:true,otrasRentas:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",trabajo:{...efectivo.trabajo,rendimientos:efectivo.trabajo.rendimientos.map(r=>({...r,integro:"12000",cotizaciones:{...r.cotizaciones,seguridadSocial:"0"}}))}} as const
 const b=producirEconomiaAjena2025(economia,false)
 expect(b.rentaAntesReducciones!.toFixed()).toBe("10000")
 expect(b.general.toFixed()).toBe("2698")
})

it.each([64,65,100])("frontera grado %s; alta civil al devengo no prorratea100",grado=>{
 const s=solicitud(), p={...s,hechos:{...s.hechos,grado,desde:"2025-12-31",reconocimientoDesde:"2025-12-31"}}
 const r=evaluarAmpliacionAnualA2025(p,contexto(),[p])
 expect(r.estado).toBe(grado<65?"no_soportado":"calculo_parcial")
 if(r.estado==="calculo_parcial")expect(r.importeExactoEuros).toBe("100")
})

it("consumo común exacto de100: insuficiencia37/3 y cero sin una segunda reserva",()=>{
 const s=solicitud(), r=evaluarAmpliacionAnualA2025(s,contexto(),[s])
 if(r.estado!=="calculo_parcial")throw Error("sin generación")
 const consumo=consumirCuota(racional("37","3"),[racional(r.importeExactoEuros)])
 expect(consumo.total).toEqual({numeradorEuros:"37",divisor:"3"})
 expect(consumo.disponible).toEqual({numeradorEuros:"0",divisor:"1"})
 expect(consumo.aplicaciones[0]!.pendiente).toEqual({numeradorEuros:"263",divisor:"3"})
 expect(consumirCuota(racional("0"),[racional(r.importeExactoEuros)]).total).toEqual({numeradorEuros:"0",divisor:"1"})
})

it.each(["1799.99","1800","1800.01","7999.99","8000","8000.01"])("renta pareja %s no aplica umbrales de mínimos a art17", renta=>{
 if(efectivo.perfil!=="solo-trabajo")throw Error("fixture")
 const trabajo={...efectivo.trabajo,rendimientos:efectivo.trabajo.rendimientos.map(r=>({...r,clase:"pension" as const,integro:new Decimal(renta).plus(2000).toFixed(),cotizaciones:{...r.cotizaciones,seguridadSocial:"0"}}))} as const
 const economia={perfil:"solo-trabajo",censoRentasCompleto:true,otrasRentas:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",trabajo} as const
 const original=solicitud(), s={...original,hechos:{...original.hechos,economia}}
 const r=evaluarAmpliacionAnualA2025(s,contexto(),[s])
 expect(r.estado).toBe("calculo_parcial")
 expect(producirEconomiaAjena2025(economia,false).rentaAntesReducciones!.eq(renta)).toBe(true)
})
