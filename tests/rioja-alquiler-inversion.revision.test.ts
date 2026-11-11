import { Effect } from "effect"
import { expect, it } from "vitest"
import type { CasoInmobiliarioP4a } from "../lib/dominio/irpf/inmobiliario-2025/contrato"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { perfilRioja, conHistoria, type PerfilRioja } from "./rioja-alquiler-derecho.fixtures"
import esperado from "./rioja-alquiler-inversion.revision.esperados.json"

const apis: readonly ("uniforme" | "explicita")[] = ["uniforme", "explicita"]
const elecciones: readonly ("aplicar" | "no_aplicar")[] = ["aplicar", "no_aplicar"]
function ejecutar(api: "uniforme" | "explicita", caso: CasoInmobiliarioP4a) {
  return api === "uniforme" ? liquidarIrpfAnual(caso, { modo: "canonico" }) : liquidarIrpfAnualExplicito(caso)
}
function perfil(derecho: boolean, eleccion: "aplicar" | "no_aplicar", ingreso: string): PerfilRioja {
  const x = perfilRioja(derecho, eleccion)
  const h = { ...x.derecho, movimientos: x.derecho.movimientos.map(m => m.id === "RENTA"
    ? { ...m, importe: ingreso } : m.id === "CON" ? { ...m, importe: String(BigInt(ingreso) - 9050n) } : m) }
  const inmueble = { ...x.inmueble, exigibilidades: x.inmueble.exigibilidades.map(r => ({ ...r, importe: ingreso })) }
  const caso = { ...x.caso, inmuebles: [inmueble] }
  return { ...x, derecho: h, inmueble, caso: derecho
    ? { ...caso, deduccionesTerritoriales2025: { derechoInversionAlquilerRioja2025: h, solicitudes: [x.solicitud] } } : caso }
}
for (const api of apis) {
  it(`${api}: revalorizar la vivienda no crea incremento art70`, () => {
    const x = perfilRioja(true, "no_aplicar")
    const h = { ...x.derecho, adquisicion: { ...x.derecho.adquisicion,
      valorCierre: { ...x.derecho.adquisicion.valorCierre, importe: "150000" } } }
    const r = Effect.runSync(ejecutar(api, conHistoria(x, h)))
    if (r._tag !== "LiquidacionInmobiliariaP4a") throw new Error("Revalorización sin P4a")
    const t = r.composicion.deduccionesTerritoriales2025
    if (t === undefined) throw new Error("Falta evaluación patrimonial")
    expect(JSON.stringify(t.evaluaciones)).toContain("baseCentimos=305000/1")
    expect(t.total).toEqual({ numeradorEuros: "0", divisor: "1" })
    expect(r.baseImponibleGeneral.toFixed(18)).toBe(esperado.rentas[0]?.base18)
  })
  for (const eleccion of elecciones) for (const o of esperado.rentas) for (const derecho of [true, false]) {
    it(`${api}/${eleccion}/${o.ingreso}/${derecho}: resultado monetario y cuota limitada`, () => {
      const r = Effect.runSync(ejecutar(api, perfil(derecho, eleccion, o.ingreso).caso))
      if (r._tag !== "LiquidacionInmobiliariaP4a") throw new Error("La API no produjo una liquidación P4a")
      const t = r.composicion.deduccionesTerritoriales2025
      if (t === undefined) throw new Error("Falta libro territorial")
      expect(r.baseImponibleGeneral.toFixed(18)).toBe(o.base18)
      expect(r.inmuebles[0]?.diasAlquilados).toBe(184)
      expect(r.imputacion.n).toBe(0n)
      expect(t.aplicaciones).toHaveLength(1)
      expect(t.aplicaciones[0]?.generado).toEqual({ numeradorEuros: derecho ? "0" : "300", divisor: "1" })
      expect(t.viviendaDT182025).toBeUndefined()
      expect(r.composicion.dt18Aplicada.isZero()).toBe(true)
      const cuota = r.composicion.cuotaAutonomicaDisponible
      if (o.ingreso === "10000") expect(cuota.isZero()).toBe(true)
      if (o.ingreso === "30000") expect(cuota.gte(300)).toBe(true)
      if (o.ingreso === "16000") { expect(cuota.gt(0)).toBe(true); expect(cuota.lt(300)).toBe(true) }
      // Comparación exacta del transporte racional con Decimal: sin céntimos aproximados.
      const aplicado = derecho || o.ingreso === "10000" ? cuota.times(0)
        : o.ingreso === "30000" ? cuota.times(0).plus(300) : cuota
      expect(aplicado.times(t.total.divisor).eq(t.total.numeradorEuros)).toBe(true)
      if (derecho) expect(JSON.stringify(t.evaluaciones)).toContain("baseCentimos=305000/1")
    })
  }
  it(`${api}: alternar perfiles y elecciones no conserva el derecho anterior`, () => {
    for (const derecho of [false, true, false, true, false]) for (const eleccion of elecciones) {
      const r = Effect.runSync(ejecutar(api, perfil(derecho, eleccion, "30000").caso))
      if (r._tag !== "LiquidacionInmobiliariaP4a") throw new Error("Secuencia sin P4a")
      expect(r.composicion.deduccionesTerritoriales2025?.total).toEqual({ numeradorEuros: derecho ? "0" : "300", divisor: "1" })
    }
  })
  const negativos: readonly [string, (x: PerfilRioja) => CasoInmobiliarioP4a][] = [
    ["historia positiva ausente", x => ({ ...x.caso, deduccionesTerritoriales2025: { solicitudes: [x.solicitud] } })],
    ["práctica no acreditada", x => conHistoria(x, { ...x.derecho, historia: { ...x.derecho.historia, ejercicios: [] } })],
    ["título civil ajeno", x => conHistoria(x, { ...x.derecho, historia: { ...x.derecho.historia, derechos: x.derecho.historia.derechos.map(d => ({ ...d, titular: "OTRO" })) } })],
    ["declaración decisiva ajena", x => conHistoria(x, { ...x.derecho, historia: { ...x.derecho.historia, ejercicios: x.derecho.historia.ejercicios.map(e => ({ ...e, documento: { ...e.documento, referencia: "OTRA" } })) } })],
    ["banco inconciliable", x => conHistoria(x, { ...x.derecho, cuentas: x.derecho.cuentas.map(c => ({ ...c, cierre: { ...c.cierre, importe: "20001" } })) })],
    ["censo prestamo omitido", x => conHistoria(x, { ...x.derecho, censo: x.derecho.censo.filter(c => c.tipo !== "prestamo") })],
    ["valor suelo contradictorio", x => ({ ...x.caso, inmuebles: [{ ...x.inmueble, adquisicion: { ...x.inmueble.adquisicion, sueloPrecio: "25000" } }] })],
    ["concurrencia DT18 no representada", x => ({ ...x.caso, deduccionesTerritoriales2025: { derechoInversionAlquilerRioja2025: x.derecho, solicitudes: [x.solicitud, x.solicitud] } })],
  ]
  for (const [nombre, transformar] of negativos) it(`${api}: ${nombre} rechaza y no publica cero`, () => {
    const r = Effect.runSync(Effect.flip(ejecutar(api, transformar(perfilRioja(true)))))
    if (r._tag !== "RechazoP4a" && r._tag !== "ResultadoNoSoportado") throw new Error("Rechazo ajeno al dominio P4a")
    expect(r).not.toHaveProperty("composicion")
    expect(r).not.toHaveProperty("total")
    expect(r.motivo).not.toMatch(/TypeError|ReferenceError|Cannot read/)
  })
  for (const alteracion of ["sin_titulo", "otro_derecho", "anticipo", "sin_escritura", "fecha_pre2013"]) it(`${api}: ausencia material ${alteracion} no se infiere del flag`, () => {
    const x = perfilRioja(false), s = x.caso.deduccionesTerritoriales2025?.solicitudes[0]
    if (s?.lote !== "E38" || s.historiaInversionAlquilerRioja === undefined) throw new Error("Falta historia negativa")
    const h = s.historiaInversionAlquilerRioja.historia
    const historia = { ...h,
      derechos: alteracion === "sin_titulo" ? [] : alteracion === "otro_derecho"
        ? [...h.derechos, ...h.derechos.map(d => ({ ...d, inmueble: "V2" }))] : h.derechos,
      anticipos: alteracion === "anticipo" ? [{ inmueble: "V2", fecha: "2011-01-01", importe: "1", documento: { referencia: "ANT", fecha: "2011-01-01", emisor: "registro" } }] : h.anticipos,
      ejercicios: alteracion === "sin_escritura" ? [] : h.ejercicios,
    }
    const caso: CasoInmobiliarioP4a = { ...x.caso,
      inmuebles: alteracion === "fecha_pre2013" ? [{ ...x.inmueble, adquisicion: { ...x.inmueble.adquisicion, fecha: "2010-01-01" } }] : x.caso.inmuebles,
      deduccionesTerritoriales2025: { solicitudes: [{ ...s, historiaInversionAlquilerRioja: { ...s.historiaInversionAlquilerRioja, historia } }] },
    }
    const r = Effect.runSync(Effect.flip(ejecutar(api, caso)))
    if (r._tag !== "RechazoP4a" && r._tag !== "ResultadoNoSoportado") throw new Error("Ausencia desconocida aceptada")
    expect(r).not.toHaveProperty("composicion")
    expect(r).not.toHaveProperty("total")
  })
}
