import { expect, it } from "vitest"
import { Effect, Result } from "effect"
import type { DerechosMinimos2025, DescendienteDerechos, TitularDescendiente } from "/home/elies/.t3/worktrees/IRoboPF/t3-c190fe20/lib/dominio/irpf/minimos/derechos-contrato"
import { sinDiscapacidad, type CasoFiscalAnual } from "/home/elies/.t3/worktrees/IRoboPF/t3-c190fe20/lib/dominio/irpf/caso-fiscal-anual"
import { liquidarIrpfAnualConDerechos, liquidarIrpfAnual } from "/home/elies/.t3/worktrees/IRoboPF/t3-c190fe20/lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { calcularDerechosMinimos } from "/home/elies/.t3/worktrees/IRoboPF/t3-c190fe20/lib/dominio/irpf/minimos/derechos"
import { MINIMOS_ESTATALES_2025 } from "/home/elies/.t3/worktrees/IRoboPF/t3-c190fe20/lib/dominio/normativa/datos/minimos-autonomicos-2025"

const t = (renta = 2605600, extra: Partial<TitularDescendiente> = {}): TitularDescendiente => ({
 titularId: "s-1", grado: 1, rentasNoExentasCentimos: renta, residenteIrpf: true,
 vinculo: { clase: "consanguinidad" }, relacion: "convivencia", custodia: "no-procede",
 alimentosJudiciales: false, aplicaEspecialidadAlimentos: false, ...extra,
})
const d = (titulares = [t()], fechaNacimiento = "2017-12-31"): DescendienteDerechos => ({
 sujetoId: "s-81", fechaNacimiento, edadDevengo: 2025 - Number(fechaNacimiento.slice(0,4)),
 vivoAlDevengo: true, rentasNoExentasCentimos: 0, declaracion: { modalidad: "no-presenta" },
 discapacidad: sinDiscapacidad, titulares, titularesCompletos: true,
})
const h = (descendientes = [d()]): DerechosMinimos2025 => ({
 ejercicio: 2025, territorio: "madrid", regimen: "comun", modalidad: "individual", devengo: "2025-12-31",
 contribuyenteId: "s-1", edadContribuyenteDevengo: 40, discapacidadContribuyente: sinDiscapacidad,
 ascendientes: "ninguno", fallecimientosEnElEjercicio: "ninguno", descendientesCompletos: true,
 conciliacionRentasContribuyente: { perfil: "caso-anual-parcial", otrasRentasOGastosNoRepresentados: "ninguno" }, descendientes,
})
const c = (derechosMinimos = h(), bruto = 3000000, ganancia = 0): CasoFiscalAnual & { derechosMinimos: DerechosMinimos2025 } => ({
 anio: 2025, comunidadAutonoma: "madrid", derechosMinimos,
 situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: sinDiscapacidad, descendientes: [], ascendientes: [] },
 rendimientos: { trabajo: [{ importeIntegroCentimos: bruto }], gananciasPatrimoniales: [{ importeGananciaCentimos: ganancia, tratamientoMayores65: { _tag: "SinExencionMayores65" } }] },
 reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0,
})
const run = (caso = c()) => Effect.runSync(liquidarIrpfAnualConDerechos(caso))
const no = (caso: ReturnType<typeof c>, motivo?: string) => {
 const r = Effect.runSync(Effect.result(liquidarIrpfAnualConDerechos(caso)))
 expect(Result.isFailure(r)).toBe(true)
 if (Result.isFailure(r)) {
 expect(r.failure._tag).toBe("ResultadoNoSoportado")
 if (motivo !== undefined) expect(r.failure.motivo).toContain(motivo)
 }
}
const adoption = (constitucion: string | undefined, inicio = "2025-06-16") => t(2605600, {
 vinculo: { clase: "adopcion", fechaConstitucionVinculo: constitucion, fechaInicioIncremento: inicio,
 fundamento: "inscripcion-registro-civil", historialCompleto: true },
})
it.each([0, 3000000, 2605000])("MDV1-01 corregido rechaza renta contradictoria %s con contrato completo", renta => no(c(h([d([t(renta), t(3000000,{ titularId:"s-2", grado:2 })])])), "renta"))
it("MDV1-01 positivo neto y vía pública general", () => {
 const caso=c()
 expect(run(caso).rendimientoNetoTrabajoCentimos).toBe(2605600)
 expect(Effect.runSync(liquidarIrpfAnual(caso,{ modo:"canonico" })).cuotaLiquidaCentimos).toBe(run(caso).cuotaLiquidaCentimos)
})
it("trabajo 10000 neto 7352, anterior art20", () => {
 const caso=c(h([d([t(735200)])]),1000000)
 const r=run(caso)
 expect(r.rendimientoNetoTrabajoCentimos).toBe(735200)
 expect(r.baseLiquidableGeneralCentimos).toBeLessThan(735200)
 no(c(h([d([t(r.baseLiquidableGeneralCentimos)])]),1000000),"renta")
 no(c(h([d([t(1000000)])]),1000000),"renta")
})
it.each([[-2000000,605600],[-3000000,-394400],[100000,2705600]])("saldo algebraico ganancia %s, renta %s", (g,renta) => {
 const caso=c(h([d([t(renta)])]),3000000,g)
 expect(run(caso)._tag).toBe("LiquidacionIrpfAnualCalculada")
 no(c(h([d([t(2605600)])]),3000000,g),"renta")
})
it.each([[1069289,799999],[1069290,800000],[1069291,800001]])("umbral con fracciones bruto %s", (bruto,renta) => {
 const caso=c(h([d([t(renta)])]),bruto)
 if(bruto===1069290) no(caso,"renta")
 else expect(run(caso)._tag).toBe("LiquidacionIrpfAnualCalculada")
})
it("categorías múltiples preservan neto de alquiler no reducido", () => {
 // 26056 trabajo + 10000 alquiler neto simplificado -20000 pérdida =16056.
 const caso=c(h([d([t(1605600)])]),3000000,-2000000)
 const mixto={...caso,rendimientos:{...caso.rendimientos,capitalInmobiliario:[{importeIntegroCentimos:1000000}]}}
 expect(run(mixto)._tag).toBe("LiquidacionIrpfAnualCalculada")
 no({...mixto,derechosMinimos:h([d([t(1005600)])])},"renta")
})
it("exención representada se excluye; pérdida sigue computable", () => {
 const caso=c(h([d([t(3105600)])]),3000000,1000000)
 const exento={...caso,rendimientos:{...caso.rendimientos,gananciasPatrimoniales:[{
 importeGananciaCentimos:1000000,tratamientoMayores65:{_tag:"SinExencionMayores65" as const},
 exencionInmuebleUrbanoAdquirido2012:{inmuebleUrbano:true,tituloOneroso:true,fechaAdquisicion:"2012-06-01"},
 }]}}
 expect(run(exento).gananciaPatrimonialExentaCentimos).toBe(500000)
 no({...exento,derechosMinimos:h([d([t(3605600)])])},"renta")
})
it("mismo contribuyente en varios censos concilia todos", () => {
 const dos=h([d(),{...d(),sujetoId:"s-82",fechaNacimiento:"2020-12-31",edadDevengo:5}])
 expect(run(c(dos)).cuotaMinimoPersonalCentimos).toBeGreaterThan(0)
 no(c({...dos,descendientes:[d(),{...d([t(0)]),sujetoId:"s-82"}]}),"contradictorias")
})
it("helper no exige conciliación; anual sí", () => {
 const {conciliacionRentasContribuyente,...sin}=h()
 expect(conciliacionRentasContribuyente?.perfil).toBe("caso-anual-parcial")
 expect(Effect.runSync(calcularDerechosMinimos(sin,MINIMOS_ESTATALES_2025)).descendientes.toNumber()).toBe(2400)
 no(c(sin),"conciliación")
})
it.each([NaN,Infinity,-Infinity,1.5,1000000000001,-1000000000001])("renta inválida %s sin Die", renta=>no(c(h([d([t(renta)])]))))
it.each([undefined,"2025-02-29","2016-12-31","2026-01-01"])("fecha constitución inválida %s",fecha=>no(c(h([d([adoption(fecha)])]))))
it.each(["2025-06-14","2025-06-15","2025-06-16"])("MDV1-02 cumpleaños y constitución %s",fecha=>{
 const caso=c(h([d([adoption(fecha)],"2007-06-15")]))
 if(fecha==="2025-06-14") expect(run(caso).cuotaMinimoPersonalCentimos).toBe(200195)
 else no(caso,"mayoría de edad")
})
it("MDV1-02 diciembre 2007, enero 2025 todavía menor",()=>{
 expect(run(c(h([d([adoption("2025-01-02","2025-01-02")],"2007-12-31")]))).cuotaMinimoPersonalCentimos).toBe(200195)
})
it("acogimiento previo no atraviesa exclusión adulta",()=>no(c(h([d([adoption("2025-06-16","2024-01-01")],"2007-06-15")])),"mayoría de edad"))
it.each([2022,2023])("primer evento %s no se reinicia por adopción 2025",anio=>{
 const caso=c(h([d([adoption("2025-06-14",anio+"-01-01")])]))
 expect(run(caso).cuotaMinimoPersonalCentimos).toBe(anio===2022?148051:200195)
})
it("bisiesto sigue capacidad pendiente",()=>no(c(h([d([adoption("2022-02-28","2022-02-28")],"2004-02-29")])),"bisiesto"))
it.each([false,true])("MDV1-03 alimentos propios flag %s, aun sin derecho por renta hijo",flag=>{
 const pagador=t(2605600,{relacion:"dependencia-economica",custodia:"sin-custodia",alimentosJudiciales:true,aplicaEspecialidadAlimentos:flag})
 for(const rentaHijo of [0,800001]) no(c(h([{...d([pagador,t(2605600,{titularId:"s-2",custodia:"exclusiva"})]),rentasNoExentasCentimos:rentaHijo}])),"alimentos")
})
it.each([false,true])("otro pagador no bloquea al custodio flag %s",flag=>{
 const otro=t(2605600,{titularId:"s-2",relacion:"dependencia-economica",custodia:"sin-custodia",alimentosJudiciales:true,aplicaEspecialidadAlimentos:flag})
 expect(run(c(h([d([t(2605600,{custodia:"exclusiva"}),otro])]))).cuotaMinimoPersonalCentimos).toBe(148051)
})
it.each(["exclusiva","compartida","no-procede"] as const)("flag alimentos incoherente custodia %s",custodia=>no(c(h([d([t(2605600,{custodia,alimentosJudiciales:true,aplicaEspecialidadAlimentos:true})])])),"alimentos"))
it("doble custodia exclusiva se conserva rechazada",()=>no(c(h([d([t(2605600,{custodia:"exclusiva"}),t(2605600,{titularId:"s-2",custodia:"exclusiva"})])])),"custodia"))
it("rastro no publica IDs y declara alcance",()=>{
 const r=run()
 const texto=JSON.stringify(r.rastro)
 expect(texto).toContain("renta propia conciliada internamente")
 expect(texto).not.toMatch(/s-81|s-1"/)
})
it.each([NaN,Infinity,-Infinity])("renta anual no finita en trabajo %s sin defectos",bruto=>no(c(h([d([t(0)])]),bruto)))
it.each([NaN,Infinity,-Infinity])("renta anual no finita en ganancia %s sin defectos",g=>no(c(h([d([t(0)])]),3000000,g)))
it.each([NaN,Infinity,-Infinity])("renta anual no finita alquiler %s sin defectos",importe=>{
 const caso=c()
 no({...caso,rendimientos:{...caso.rendimientos,capitalInmobiliario:[{importeIntegroCentimos:importe}]}})
})
it("límite inferior representable de renta se admite si coincide exactamente",()=>{
 expect(run(c(h([d([t(-1000000000000)])]),0,-1000000000000))._tag).toBe("LiquidacionIrpfAnualCalculada")
})
it.each(["2025-02-29","2016-12-31","2026-01-01"])("primer evento imposible o fuera del período %s",fecha=>no(c(h([d([adoption("2025-06-14",fecha)])]))))
it.each([800001,180001])("custodio pagador pierde mínimo por otra condición %s: caracterización, sin cuota fiscal esperada",renta=>{
 const sujeto={...d([t(2605600,{custodia:"exclusiva",alimentosJudiciales:true})]),rentasNoExentasCentimos:renta,
 declaracion:renta===180001?{modalidad:"individual" as const,rentasCentimos:renta}:{modalidad:"no-presenta" as const}}
 const hechos=h([sujeto])
 expect(Effect.runSync(calcularDerechosMinimos(hechos,MINIMOS_ESTATALES_2025)).descendientes.toNumber()).toBe(0)
 // Solo caracteriza la aceptación actual. No afirma que la cuota sin alimentos sea jurídicamente correcta.
 expect(run(c(hechos))._tag).toBe("LiquidacionIrpfAnualCalculada")
})
