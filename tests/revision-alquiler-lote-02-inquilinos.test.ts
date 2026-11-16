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

// Revisión lote02. H1 conserva fuera del perfil los tres derechos sin historia;
// el original monetario de 800 EUR se preserva en la recepción independiente.
for (const api of ["explicita", "tecnica"] as const) describe(`lote02 ${api}`, () => {
  function ejecutar(a: Entrada) {
    if (api === "explicita") {
      // @ts-expect-error Entrada JSON y adversas sin sanitizar, validadas en la API.
      return Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(a)))
    }
    // SAFETY: Fixture técnica conocida; las adversas se envían sin filtrar al validador público para exigir su rechazo.
    const entrada = clasica(a) as CasoFiscalAnual
    return Effect.runSync(Effect.result(liquidarIrpfAnual(entrada, { modo: "canonico" })))
  }
  function positivo(a: Entrada, importe: number) {
    const x = ejecutar(a)
    expect(x._tag).toBe("Success")
    if (x._tag !== "Success") throw new Error("Admisión pendiente")
    const territorial = "deduccionesTerritoriales2025" in x.success ? x.success.deduccionesTerritoriales2025 : undefined
    const valenciana = "deduccionesValencianas2025" in x.success ? x.success.deduccionesValencianas2025 : undefined
    if (a.comunidadAutonoma === "murcia")
      expect(territorial?.total).toEqual(racional(String(importe)))
    else expect(valenciana?.composicion.totalParcialAntesCuota).toBe(importe)
  }
  const rechazar = (a: Entrada) => expect(ejecutar(a)._tag).toBe("Failure")
  it("control: Murcia300 y Valencia800 conservan SS propia de cada API", () => {
    positivo(caso("murcia"),300); positivo(caso("comunitat-valenciana"),800)
  })
  it.each([[50,10],[100,75],[100,50]])("H1: porcentaje %s y distancia %s sin censo ni historia quedan pendientes", (porcentaje,distanciaKm) => {
    const a=caso("comunitat-valenciana")
    Object.assign(factual(a),{derechosOtrasViviendas:[{porcentaje,distanciaKm}]})
    rechazar(a)
  })
  it("H1 control: sin otros derechos no hay historia externa pendiente", () => positivo(caso("comunitat-valenciana"),800))
  it("H2: un año natural completo no exige contratar un día adicional", () => {
    const a=caso("comunitat-valenciana")
    Object.assign(factual(a),{firma:"2025-01-01",desde:"2025-01-01",hasta:"2025-12-31",ocupacionDesde:"2025-01-01"})
    positivo(a,800)
  })
  it("H2 control: un día adicional conserva el derecho anual", () => {
    const a=caso("comunitat-valenciana")
    Object.assign(factual(a),{firma:"2025-01-01",desde:"2025-01-01",hasta:"2026-01-01",ocupacionDesde:"2025-01-01"})
    positivo(a,800)
  })
  it("H3: Murcia no admite al mismo sujeto como arrendador e inquilino", () => {
    const a=caso("murcia"); murcia(a).contratos[0].arrendador=a.contribuyenteId; rechazar(a)
  })
  it("control: pago de otro titular no se asimila a pago propio", () => {
    const m=caso("murcia"); murcia(m).pagos[0].pagador="otro"; rechazar(m)
    const v=caso("comunitat-valenciana"); factual(v).pagos[0].pagadorId="otro"; rechazar(v)
  })
  it("control: ni otra vivienda contractual ni otro contrato del pago", () => {
    const m=caso("murcia"); murcia(m).contratos[0].viviendaId="otra"; rechazar(m)
    const v=caso("comunitat-valenciana"); factual(v).pagos[0].contratoId="otro"; rechazar(v)
  })
  it("control: el nacimiento factual debe conciliar con edad anual", () => {
    const a=caso("comunitat-valenciana"); a.edad=70; rechazar(a)
  })
  it("control: soporte bancario ausente es pendiente", () => {
    const m=caso("murcia"); Reflect.deleteProperty(murcia(m).pagos[0],"soportePago"); rechazar(m)
    const v=caso("comunitat-valenciana"); Reflect.deleteProperty(factual(v).pagos[0],"soporte"); rechazar(v)
  })
  it("control: expediente ausente no equivale a alquiler cero", () => {
    const a=caso("comunitat-valenciana"); Reflect.deleteProperty(unidad(a),"arrendamientoFactual2025"); rechazar(a)
  })
})
