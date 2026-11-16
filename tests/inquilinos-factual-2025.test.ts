import { describe, expect, it } from "vitest"
import { Effect } from "effect"
import fixtures from "./fixtures/inquilinos-factual-2025.json"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
// Todos los datos son sintéticos. Los oráculos documentales anteceden a cuota y Open.
const caso = (territorio: string) => structuredClone(fixtures.find(f => f.entrada.comunidadAutonoma === territorio)!.entrada)
type Entrada = ReturnType<typeof caso>
const murcia = (a: Entrada) => a.deduccionesTerritoriales2025!.solicitudes[0].hechos
const solicitud = (a: Entrada) => a.deduccionesValencianas2025!
const unidad = (a: Entrada) => solicitud(a).solicitudes[0].unidades[0]
const factual = (a: Entrada) => unidad(a).arrendamientoFactual2025
function clasica(a: Entrada) {
  // La API técnica deriva sus cotizaciones de perfil uniforme: no admite SS efectivas.
  // Este control de conexión no acredita equivalencia salarial con la API explícita.
  return {
    anio: a.ejercicio, comunidadAutonoma: a.comunidadAutonoma, contribuyenteId: a.contribuyenteId,
    situacionFamiliar: { tipo: "individual", edad: a.edad, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] },
    rendimientos: { trabajo: [{ importeIntegroCentimos: Number(a.trabajo.rendimientos[0].integro) * 100 }] },
    reducciones: [], deducciones: [], retencionesSoportadasCentimos: Number(a.retenciones[0].importe) * 100,
    pagosACuentaCentimos: 0,
    deduccionesTerritoriales2025: a.deduccionesTerritoriales2025,
    deduccionesValencianas2025: a.deduccionesValencianas2025,
  }
}
for (const api of ["explicita", "tecnica"] as const) describe(api, () => {
  function ejecutar(a: Entrada) {
    // SAFETY: Pruebas de admisión con JSON sintético y mutaciones deliberadas validadas por las APIs.
    return api === "explicita"
      // @ts-expect-error JSON sintético adverso sin sanitizar: la frontera pública valida su esquema.
      ? Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(a)))
      : Effect.runSync(Effect.result(liquidarIrpfAnual(clasica(a) as CasoFiscalAnual, { modo: "canonico" })))
  }
  function positivo(a: Entrada, importe: number) {
    const r = ejecutar(a)
    expect(r._tag, JSON.stringify(r)).toBe("Success")
    if (r._tag === "Failure") throw new Error("Admisión pendiente")
    const territorial = "deduccionesTerritoriales2025" in r.success ? r.success.deduccionesTerritoriales2025 : undefined
    const valenciana = "deduccionesValencianas2025" in r.success ? r.success.deduccionesValencianas2025 : undefined
    if (a.comunidadAutonoma === "murcia") expect(territorial?.total).toEqual(racional(String(importe)))
    else if (a.comunidadAutonoma === "comunitat-valenciana")
      expect(valenciana?.composicion.totalParcialAntesCuota).toBe(importe)
    else {
      expect(territorial).toBeUndefined()
      expect(valenciana).toBeUndefined()
    }
    return r.success
  }
  const rechazar = (a: Entrada) => expect(ejecutar(a)._tag).toBe("Failure")
  it("P01-P04: conserva los cuatro slots y conecta los oráculos previos a cuota", () => {
    for (const [t,n] of [["castilla-la-mancha",0],["murcia",300],["comunitat-valenciana",800],["catalunya",0]] as const) positivo(caso(t),n)
  })
  it("A01-A02: sin compra del inquilino; compra ajena antigua no altera Murcia", () => {
    const a=caso("murcia"); expect(murcia(a).viviendas[0]).not.toHaveProperty("adquisicion");positivo(a,300)
    Object.assign(murcia(a).viviendas[0], { adquisicion: "2000-01-01" }); positivo(a,300)
  })
  it("A03: variante independiente de edad41", () => {
    const a=caso("murcia");a.edad=41;murcia(a).nacimientoContribuyente="1984-01-01";murcia(a).personas[0].nacimiento="1984-01-01";positivo(a,0)
  })
  it.each(["contratos","itpPresentado"])("A04: falta %s no es cero jurídico", campo => {
    const a=caso("murcia");if(campo==="contratos") Reflect.deleteProperty(murcia(a),campo); else Reflect.deleteProperty(murcia(a).contratos[0],campo);rechazar(a)
  })
  it("A05: ITP presentado y exento, sin pago de impuesto como entrada", () => positivo(caso("murcia"),300))
  it("A06: contrato de otra vivienda", () => {const a=caso("murcia");murcia(a).contratos[0].viviendaId="otra";rechazar(a)})
  it("A07: efectivo conocido da cero; medio ausente queda pendiente", () => {
    const m=caso("murcia");murcia(m).pagos.forEach(p=>p.medio="efectivo");positivo(m,0)
    Reflect.deleteProperty(murcia(m).pagos[0],"medio");rechazar(m)
    const v=caso("comunitat-valenciana");factual(v).pagos.forEach(p=>p.medio="efectivo");solicitud(v).cantidades.forEach(p=>p.euros=0);positivo(v,0)
    Reflect.deleteProperty(factual(v).pagos[0],"medio");rechazar(v)
  })
  it("A08: días escalares no sustituyen fechas", () => {
    const a=caso("comunitat-valenciana");Object.assign(unidad(a).numeros,{diasContrato:365,alquilerSinServicios:7200});Reflect.deleteProperty(factual(a),"hasta");rechazar(a)
  })
  it("A09: Valencia no exige ITP", () => {const a=caso("comunitat-valenciana");expect(factual(a)).not.toHaveProperty("itpPresentado");positivo(a,800)})
  it("A10: bruto no es base; explicitamente SS1950 y gasto legal2000", () => {
    const a=caso("comunitat-valenciana");const r=positivo(a,800)
    expect(a.trabajo.rendimientos[0].integro).toBe("30000.00")
    if(api==="explicita" && "baseLiquidableGeneral" in r) expect(r.baseLiquidableGeneral).toBe("26050")
  })
  it("A11: bases o cuota ajenas al anual no entran", () => {
    for(const campo of ["bases","cuota"]) {const a=caso("comunitat-valenciana");Object.assign(solicitud(a),{[campo]:{general:30000,disponible:800}});rechazar(a)}
    const m=caso("murcia");Object.assign(murcia(m),{bases:[{id:"s-1",generalEUR:"26050",ahorroEUR:"0"}]});rechazar(m)
  })
  it("A12: falta ALQ12 o identidad duplicada", () => {
    const a=caso("comunitat-valenciana");solicitud(a).cantidades.pop();rechazar(a)
    const b=caso("comunitat-valenciana");solicitud(b).cantidades[11].id="ALQ1";rechazar(b)
  })
  it("H2: eliminar productor no permite aprobación escalar", () => {
    const a=caso("comunitat-valenciana");Reflect.deleteProperty(unidad(a),"arrendamientoFactual2025");Object.assign(unidad(a).numeros,{diasContrato:365,alquilerSinServicios:7200,condicionesReforzadas:0});rechazar(a)
  })
  it("A15: inversión o derecho alternativo excluyen", () => {
    const m=caso("murcia");murcia(m).viviendas[0].derechoInversionVivienda="si";positivo(m,0)
    const v=caso("comunitat-valenciana");factual(v).derechoInversionVivienda=true;positivo(v,0)
    const b=caso("comunitat-valenciana");Object.assign(factual(b),{derechosOtrasViviendas:[{porcentaje:100,distanciaKm:1}]});rechazar(b)
  })
  it("A16: sólo cambian retenciones", () => {
    for(const [t,n] of [["murcia",300],["comunitat-valenciana",800]] as const) {const a=caso(t);a.retenciones[0].importe="0.00";positivo(a,n)}
  })
})
