import Decimal from "decimal.js"
import oraculos from "./balears-alquiler-dt18-oraculos.json"
import { Effect, Schema, Result } from "effect"
import { expect, it } from "vitest"
import { perfilDerecho, solicitud, historia } from "./balears-alquiler-dt18.fixtures"
import { CasoInmobiliarioP4a } from "../lib/dominio/irpf/inmobiliario-2025/contrato"
import { HechosDerechoDT18Balears2025 } from "../lib/dominio/irpf/vivienda-dt18-2025/balears-contrato"
import { determinarDerechoDT18Balears2025 } from "../lib/dominio/irpf/vivienda-dt18-2025/productor"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
const D = Decimal.clone({ precision: 80 })
const caso = { anio: 2025, comunidadAutonoma: "illes-balears", contribuyenteId: "s-1",
  situacionFamiliar: { tipo: "individual", edad: 35, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } } as const
const ejecutar = (api: "uniforme" | "efectiva", c: typeof CasoInmobiliarioP4a.Type) =>
  api === "uniforme" ? liquidarIrpfAnual(c, { modo: "canonico" }) : liquidarIrpfAnualExplicito(c)
for (const api of ["uniforme", "efectiva"] as const) {
  for (const eleccion of ["aplicar", "no_aplicar"] as const) {
    for (const conPagos of [true, false]) for (const ingreso of ["30000", "15000", "10000"]) {
      it(`${api} T06 derecho material ${conPagos} elección ${eleccion} renta ${ingreso}`, () => {
        const c = perfilDerecho(conPagos, eleccion, ingreso)
        // El fixture válido debe atravesar el esquema público cerrado antes de
        // importar ningún resultado fiscal. No basta que falle por TypeError.
        expect(Result.isSuccess(Schema.decodeUnknownResult(CasoInmobiliarioP4a)(c, { onExcessProperty: "error" }))).toBe(true)
        const derecho = determinarDerechoDT18Balears2025(historia(c), caso)
        expect(derecho.conDerecho).toBe(conPagos)
        expect(derecho.baseDerecho).toEqual({ n: conPagos ? 305000n : 0n, d: 1n })
        const r = Effect.runSync(ejecutar(api, c)), territorial = r.composicion.deduccionesTerritoriales2025
        expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
        expect(r.imputacion.n).toBe(0n)
        expect(r.inmuebles[0]?.diasAlquilados).toBe(184)
        expect(r.inmuebles[0]?.diasImputados).toBe(0)
        expect(territorial?.estado).toBe("condicionado")
        expect(territorial?.aceptacionFiscal).toBe("pendiente")
        const total = territorial?.total
        if (territorial === undefined || total === undefined) throw new Error("Fixture válida no alcanzó cálculo territorial")
        const o = oraculos.rentas.find(o => o.ingreso === ingreso)
        if (o === undefined) throw new Error("Oráculo independiente ausente")
        const esperado = conPagos ? new D(0) : new D(o.alquilerAplicadoSinDerecho.numeradorEuros).div(o.alquilerAplicadoSinDerecho.divisor)
        expect(new D(total.numeradorEuros).div(total.divisor).toFixed(18)).toBe(esperado.toFixed(18))
        const traza = JSON.stringify(territorial.evaluaciones)
        expect(traza).toContain(`T06_DT18_PRODUCTOR baseCentimos=${conPagos ? "305000" : "0"}/1; derecho=${conPagos}; eleccion=${eleccion}`)
        expect(traza).toContain(conPagos ? "T06_ART3BIS1C_EXCLUIDO" : "T06_ART3BIS1C_SIN_DERECHO")
        expect(territorial.aplicaciones).toHaveLength(1)
        // Determinación no ejerce DT18: no segundo consumo ni compensación de tramos.
        expect(territorial.viviendaDT182025).toBeUndefined()
      })
    }
  }
  for (const [cierre, consumo, baseCentimos] of [["19999.99", "25950.01", 304999n], ["18000", "27950", 105000n], ["17000", "28950", 5000n]] as const) {
    it(`${api} T06 patrimonio parcial ${cierre} no equivale a ausencia`, () => {
      const c = perfilDerecho(), h = historia(c)
      Object.assign(h.cuentas[0].cierre, { importe: cierre })
      Object.assign(h.movimientos.find(x => x.id === "CON")!, { importe: consumo })
      const material = determinarDerechoDT18Balears2025(h, caso)
      expect(material.baseDerecho).toEqual({ n: baseCentimos, d: 1n })
      expect(material.conDerecho).toBe(true)
      const r = Effect.runSync(ejecutar(api, c))
      expect(r.composicion.deduccionesTerritoriales2025?.total).toEqual({ numeradorEuros: "0", divisor: "1" })
      expect(JSON.stringify(r.composicion.deduccionesTerritoriales2025?.evaluaciones)).toContain(`baseCentimos=${baseCentimos}/1; derecho=true`)
    })
  }
  it(`${api} T06 capital pagado sin aumento ni intereses: derecho material cero`, () => {
    const c = perfilDerecho(), h = historia(c), p = h.proyectos[0], cs = solicitud(c).hechos.censoViviendaInversion
    if (p.prestamo === null || cs === undefined) throw new Error("fixture préstamo/censo")
    Object.assign(p.vivienda, { pagos: p.vivienda.pagos.filter(x => x.id !== "INT") })
    Object.assign(p.prestamo, { pagos2025: ["CAP"] })
    Object.assign(cs, { operaciones: cs.operaciones.filter(x => x.id !== "INT") })
    Object.assign(h, { movimientos: h.movimientos.filter(x => x.id !== "INT") })
    Object.assign(h.cuentas[0].cierre, { importe: "17000" })
    Object.assign(h.movimientos.find(x => x.id === "CON")!, { importe: "29000" })
    const material = determinarDerechoDT18Balears2025(h, caso)
    expect(material.baseDerecho).toEqual({ n: 0n, d: 1n })
    expect(material.conDerecho).toBe(false)
    const r = Effect.runSync(ejecutar(api, c))
    expect(r.composicion.deduccionesTerritoriales2025?.total).toEqual({ numeradorEuros: "150", divisor: "1" })
    expect(JSON.stringify(r.composicion.deduccionesTerritoriales2025?.evaluaciones)).toContain("T06_ART3BIS1C_SIN_DERECHO")
  })
  for (const externo of ["sin_derecho", "baseDerecho", "cuota", "saldoFiscal"]) it(`${api} T06 contrato externo ${externo}`, () => {
    const c = perfilDerecho(); Object.assign(historia(c), { [externo]: "0" })
    const fallo = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(fallo._tag).toBe("RechazoP4a")
    expect(fallo.motivo).toContain("Perfil P4a fuera del esquema cerrado")
  })
  type C = typeof CasoInmobiliarioP4a.Type
  const adversas: readonly [string, string, (c: C) => void][] = [
    ["hogar", "T06_HOGAR", c => Object.assign(historia(c).hogar, { miembros: ["s-1", "HIJO"] })],
    ["sujeto", "T06_IDENTIDAD", c => Object.assign(historia(c), { persona: "s-9" })],
    ["habituales-solapadas", "T06_HABITUALES", c => Object.assign(historia(c).proyectos[0].vivienda.inmueble.residencia, { hasta: "2025-07-01" })],
    ["titulo-usufructo", "T06_TITULOS", c => {
      const cs = solicitud(c).hechos.censoViviendaInversion
      if (cs === undefined) throw new Error("fixture sin censo")
      Object.assign(cs.titulos[0], { derecho: "usufructo" })
    }],
    ["operacion-ajena", "T06_OPERACIONES", c => {
      const cs = solicitud(c).hechos.censoViviendaInversion
      if (cs === undefined) throw new Error("fixture sin censo")
      Object.assign(cs, { operaciones: [...cs.operaciones, { id: "OBRA", catastro: "RC-P", fecha: "2025-01-01", documento: "OBRA-DOC", clase: "rehabilitacion" }] })
    }],
    ["operacion-duplicada-otro-id", "T06_OPERACIONES", c => {
      const cs = solicitud(c).hechos.censoViviendaInversion
      if (cs === undefined) throw new Error("fixture sin censo")
      Object.assign(cs, { operaciones: [...cs.operaciones, { ...cs.operaciones[0], id: "COPIA" }] })
    }],
    ["historia-desconocida", "T06_DT18_HISTORIA", c => {
      const h = historia(c); Object.assign(h.historia, { ejercicios: h.historia.ejercicios.slice(1) })
    }],
    ["sin-historia", "T06_HISTORIA", c => {
      const s = solicitud(c), { derechoInversionAlquiler: omitida, ...hechos } = s.hechos
      expect(omitida).toBeDefined(); Object.assign(s, { hechos })
    }],
    ["pre2013-no-practicada", "T06_DT18_HISTORIA", c => Object.assign(historia(c).proyectos[0].aplicacionAnterior, { ejercicio: 2013 })],
    ["prestamo-no-reconstruido", "T06_DT18_HISTORIA", c => {
      const l = historia(c).proyectos[0].prestamo
      if (l === null) throw new Error("fixture sin préstamo")
      Object.assign(l.principalInicio, { importe: "2999" })
    }],
    ["banco", "T06_BANCO", c => Object.assign(historia(c).movimientos.find(x => x.id === "RENTA-P")!, { importe: "29999" })],
    ["renta-ajena", "T06_INGRESOS", c => {
      const h = historia(c), r = h.movimientos.find(x => x.id === "RENTA-P")
      if (r === undefined) throw new Error("fixture sin cobro")
      Object.assign(h, { movimientos: [...h.movimientos, { ...r, id: "AJENO", documento: { ...r.documento, referencia: "AJENO" } }] })
    }],
    ["localizacion", "T06_P4A_IDENTIDAD", c => Object.assign(c.inmuebles[0].cambioHabitualBalears2025!.localizacion, { isla: "Madrid" })],
    ["periodos-p4a", "T06_P4A_PERIODOS", c => Object.assign(c.inmuebles[0].contrato, { desde: "2025-07-02" })],
    ["fecha-invalida", "T06_P4A_FECHA", c => Object.assign(c.inmuebles[0].contrato, { desde: "2025-02-30" })],
    ["territorio", "T06_P4A_AMBITO", c => Object.assign(c.inmuebles[0], { ubicacion: "canarias" })],
    ["solicitud-duplicada", "T06_P4A_AMBITO", c => Object.assign(c.deduccionesTerritoriales2025!, { solicitudes: [solicitud(c), solicitud(c)] })],
    ["pago-posterior-habitual", "T06_DT18_HISTORIA: T06_DT18_PAGO_FUERA_HABITUAL", c => {
      const h = historia(c), x = h.proyectos[0].vivienda.pagos[0], cs = solicitud(c).hechos.censoViviendaInversion
      if (x === undefined || cs === undefined) throw new Error("fixture sin pago/censo")
      Object.assign(x, { fecha: "2025-07-10" })
      const b = h.movimientos.find(b => b.id === x.id), o = cs.operaciones.find(o => o.id === x.id)
      if (b === undefined || o === undefined) throw new Error("fixture sin vínculos")
      Object.assign(b, { fecha: x.fecha }); Object.assign(b.documento, { fecha: x.fecha }); Object.assign(o, { fecha: x.fecha })
      Object.assign(h, { movimientos: [...h.movimientos].sort((a, b) => a.fecha.localeCompare(b.fecha)) })
    }],
  ]
  for (const [nombre, causa, mutar] of adversas) it(`${api} T06 dominio ${nombre}`, () => {
    const c = structuredClone(perfilDerecho()); mutar(c)
    const fallo = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(["ResultadoNoSoportado", "RechazoP4a"]).toContain(fallo._tag)
    expect(fallo.motivo).toContain(causa)
    expect(JSON.stringify(fallo)).not.toMatch(/TypeError|ReferenceError|Cannot read|not a function/)
    expect(fallo).not.toHaveProperty("total")
  })
}
it("T06 contrato rechaza booleano fiscal y base externa", () => {
  const h = historia(perfilDerecho())
  for (const dato of [{ ...h, sin_derecho: true }, { ...h, baseDerecho: "0" }, { ...h, cuota: "0" }])
    expect(Result.isFailure(Schema.decodeUnknownResult(HechosDerechoDT18Balears2025)(dato, { onExcessProperty: "error" }))).toBe(true)
})
