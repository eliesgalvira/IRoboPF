import { Effect, Result, Schema } from "effect"
import { expect, it } from "vitest"
import { CasoInmobiliarioP4a } from "../lib/dominio/irpf/inmobiliario-2025/contrato"
import { determinarDerechoDT18Rioja2025 } from "../lib/dominio/irpf/vivienda-dt18-2025/productor"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { perfilRioja, conHistoria, conSolicitud, type PerfilRioja } from "./rioja-alquiler-derecho.fixtures"
import oraculos from "./rioja-alquiler-derecho.oraculos.json"
const apis: readonly ("uniforme" | "explicita")[] = ["uniforme", "explicita"]
const elecciones: readonly ("aplicar" | "no_aplicar")[] = ["aplicar", "no_aplicar"]
const ingresos: readonly ("30000" | "10000")[] = ["30000", "10000"]
function ejecutar(api: "uniforme" | "explicita", caso: CasoInmobiliarioP4a) {
  return api === "uniforme" ? liquidarIrpfAnual(caso, { modo: "canonico" }) : liquidarIrpfAnualExplicito(caso)
}
for (const api of apis) {
  for (const conDerecho of [true, false]) for (const ingreso of ingresos) for (const eleccion of elecciones) {
    it(`${api}: derecho material ${conDerecho}, elección ${eleccion}, renta ${ingreso}`, () => {
      const x = perfilRioja(conDerecho, eleccion, ingreso)
      expect(Result.isSuccess(Schema.decodeUnknownResult(CasoInmobiliarioP4a)(x.caso, { onExcessProperty: "error" }))).toBe(true)
      const r = Effect.runSync(ejecutar(api, x.caso))
      if (r._tag !== "LiquidacionInmobiliariaP4a") throw new Error("No alcanzó la API inmobiliaria")
      const t = r.composicion.deduccionesTerritoriales2025
      if (t === undefined) throw new Error("No alcanzó evaluación territorial")
      const o = oraculos.rentas.find(f => f.ingreso === ingreso)
      if (o === undefined) throw new Error("Oráculo Fraction ausente")
      expect(r.baseImponibleGeneral.toFixed(18)).toBe(o.base18)
      expect(r.inmuebles[0]?.diasAlquilados).toBe(184)
      expect(r.imputacion.n).toBe(0n)
      expect(t.aplicaciones).toHaveLength(1)
      expect(t.aplicaciones[0]?.generado).toEqual({ numeradorEuros: conDerecho ? "0" : "300", divisor: "1" })
      expect(t.total).toEqual({ numeradorEuros: conDerecho ? "0" : o.alquilerSinDerecho, divisor: "1" })
      expect(t.viviendaDT182025).toBeUndefined()
      expect(r.composicion.dt18Aplicada.isZero()).toBe(true)
      if (ingreso === "10000") expect(r.composicion.cuotaAutonomicaDisponible.isZero()).toBe(true)
      else expect(r.composicion.cuotaAutonomicaDisponible.gte(300)).toBe(true)
      const traza = JSON.stringify(t.evaluaciones)
      if (conDerecho) {
        expect(traza).toContain(`RIOJA_DT18: derecho=true; eleccion=${eleccion}; baseCentimos=305000/1`)
        // La condición se produce durante la liquidación, sin usar la cuota disponible.
        const material = determinarDerechoDT18Rioja2025(x.derecho, {
          anio: 2025, comunidadAutonoma: "la-rioja", contribuyenteId: "s-1",
          situacionFamiliar: { tipo: "individual", edad: 35, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] },
        })
        expect(material.conDerecho).toBe(true)
        expect(material.baseDerecho).toEqual({ n: 305000n, d: 1n })
        expect(x.derecho.historia.ejercicios).toHaveLength(1)
      } else expect(traza).toContain("RIOJA_POST2012: ausencia material")
    })
  }
  // Diferencia observable en el mismo período: ambas elecciones deniegan con
  // derecho y ambas conceden300 sin derecho; la cuota no es el discriminante.
  for (const ingreso of ingresos) it(`${api}: igualdad de elecciones con cuota ${ingreso}`, () => {
    for (const derecho of [true, false]) {
      const a = Effect.runSync(ejecutar(api, perfilRioja(derecho,"aplicar",ingreso).caso))
      const b = Effect.runSync(ejecutar(api, perfilRioja(derecho,"no_aplicar",ingreso).caso))
      if (a._tag !== "LiquidacionInmobiliariaP4a" || b._tag !== "LiquidacionInmobiliariaP4a") throw new Error("Sin liquidación P4a")
      const ta = a.composicion.deduccionesTerritoriales2025, tb = b.composicion.deduccionesTerritoriales2025
      if (ta === undefined || tb === undefined) throw new Error("Sin territorial")
      expect(ta.total).toEqual(tb.total)
      expect(ta.aplicaciones).toEqual(tb.aplicaciones)
      expect(a.cuotaDiferencial.toFixed(18)).toBe(b.cuotaDiferencial.toFixed(18))
    }
  })
  for (const eleccion of elecciones) it(`${api}: historia negativa incompleta no es cero (${eleccion})`, () => {
    const x = perfilRioja(false,eleccion), s = x.caso.deduccionesTerritoriales2025?.solicitudes[0]
    if (s?.lote !== "E38" || s.historiaInversionAlquilerRioja === undefined) throw new Error("Fixture negativa sin historia")
    const caso: CasoInmobiliarioP4a = { ...x.caso, deduccionesTerritoriales2025: { solicitudes: [{ ...s,
      historiaInversionAlquilerRioja: { ...s.historiaInversionAlquilerRioja, historia: { ...s.historiaInversionAlquilerRioja.historia, derechos: [] } },
    }] } }
    const e = Effect.runSync(Effect.flip(ejecutar(api,caso)))
    if (e._tag !== "ResultadoNoSoportado") throw new Error("Historia negativa debía rechazar")
    expect(e).not.toHaveProperty("total")
    expect(e).not.toHaveProperty("composicion")
  })
  const adversas: readonly [string, (x: PerfilRioja) => CasoInmobiliarioP4a][] = [
    ["sin historia", x => ({ ...x.caso, deduccionesTerritoriales2025: { solicitudes: [x.solicitud] } })],
    ["sin declaración decisiva", x => conHistoria(x,{ ...x.derecho, historia: { ...x.derecho.historia, ejercicios: [] } })],
    ["aplicación sólo2013", x => conHistoria(x,{ ...x.derecho, proyectos: x.derecho.proyectos.map(p => ({ ...p, aplicacionAnterior: { ...p.aplicacionAnterior, ejercicio: 2013 } })) })],
    ["sin pago de adquisición", x => conHistoria(x,{ ...x.derecho, proyectos: x.derecho.proyectos.map(p => ({ ...p, pagosOriginales: [] })) })],
    ["principal sin trayectoria", x => conHistoria(x,{ ...x.derecho, proyectos: x.derecho.proyectos.map(p => {
      if (p.prestamo === null) throw new Error("Fixture sin préstamo")
      return { ...p, prestamo: { ...p.prestamo, amortizacionesAnteriores: [] } }
    }) })],
    ["saldo bancario contradictorio", x => conHistoria(x,{ ...x.derecho, cuentas: x.derecho.cuentas.map(c => ({ ...c, cierre: { ...c.cierre, importe: "19999" } })) })],
    ["pago tras abandono", x => conHistoria(x,{ ...x.derecho, proyectos: x.derecho.proyectos.map(p => ({ ...p, vivienda: { ...p.vivienda, pagos: p.vivienda.pagos.map(q => ({ ...q, fecha: "2025-07-02" })) } })) })],
    ["permanencia insuficiente", x => conHistoria(x,{ ...x.derecho, proyectos: x.derecho.proyectos.map(p => ({ ...p, vivienda: { ...p.vivienda, primeraOcupacion: "2024-01-01" } })) })],
    ["censo sin título", x => conHistoria(x,{ ...x.derecho, historia: { ...x.derecho.historia, derechos: [] } })],
    ["anticipos no representados", x => conHistoria(x,{ ...x.derecho, historia: { ...x.derecho.historia, anticipos: [{ inmueble: "OTRA", fecha: "2011-01-01", importe: "1", documento: { referencia: "ANTICIPO", emisor: "registro", fecha: "2011-01-01" } }] } })],
    ["inventario omitido", x => conSolicitud(x,{ ...x.solicitud, inversionesViviendaEjercicio: [] })],
    ["inventario importe", x => conSolicitud(x,{ ...x.solicitud, inversionesViviendaEjercicio: x.solicitud.inversionesViviendaEjercicio.map(q => ({ ...q, importe: "1" })) })],
    ["inventario documento", x => conSolicitud(x,{ ...x.solicitud, inversionesViviendaEjercicio: x.solicitud.inversionesViviendaEjercicio.map(q => ({ ...q, documento: "OTRO" })) })],
    ["inventario duplicado", x => conSolicitud(x,{ ...x.solicitud, inversionesViviendaEjercicio: [...x.solicitud.inversionesViviendaEjercicio,...x.solicitud.inversionesViviendaEjercicio] })],
    ["renta bancaria contradictoria", x => conHistoria(x,{ ...x.derecho, movimientos: x.derecho.movimientos.map(m => m.id === "RENTA" ? { ...m, importe: "1" } : m) })],
    ["base externa", x => ({ ...x.caso, deduccionesTerritoriales2025: { derechoInversionAlquilerRioja2025: { ...x.derecho, baseDerecho: "0" }, solicitudes: [x.solicitud] } })],
    ["booleano externo", x => ({ ...x.caso, deduccionesTerritoriales2025: { derechoInversionAlquilerRioja2025: { ...x.derecho, conDerecho: false }, solicitudes: [x.solicitud] } })],
    ["localización sin excluir art32.11", x => ({ ...x.caso, inmuebles: [{ ...x.inmueble, ubicacion: "resto-espana" }] })],
    ["dos inmuebles", x => ({ ...x.caso, inmuebles: [x.inmueble,x.inmueble] })],
    ["solicitud duplicada", x => ({ ...x.caso, deduccionesTerritoriales2025: { derechoInversionAlquilerRioja2025: x.derecho, solicitudes: [x.solicitud,x.solicitud] } })],
  ]
  for (const [nombre, transformar] of adversas) for (const eleccion of elecciones) it(`${api}: ${eleccion}, rechaza sin importe ${nombre}`, () => {
    const e = Effect.runSync(Effect.flip(ejecutar(api, transformar(perfilRioja(true,eleccion)))))
    if (e._tag !== "ResultadoNoSoportado" && e._tag !== "RechazoP4a") throw new Error("Fallo fuera del dominio esperado")
    expect(e.motivo).not.toMatch(/TypeError|ReferenceError|Cannot read/)
    expect(e).not.toHaveProperty("total")
    expect(e).not.toHaveProperty("composicion")
  })
}
