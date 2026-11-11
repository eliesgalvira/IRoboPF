import { expect, it } from "vitest"
import { Effect } from "effect"
import Decimal from "decimal.js"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { galiciaInversion, solicitudGalicia } from "./galicia-alquiler-inversion.fixtures"
const D = Decimal.clone({ precision: 80 })
const ejecutar = (api: "uniforme" | "explicita", c: ReturnType<typeof galiciaInversion>) =>
  api === "uniforme" ? liquidarIrpfAnual(c, { modo: "canonico" }) : liquidarIrpfAnualExplicito(c)
for (const api of ["uniforme", "explicita"] as const) {
  for (const mejora of [false, true]) it(`${api}: cambio habitual e inversión integrada ${mejora}`, () => {
    const r = Effect.runSync(ejecutar(api, galiciaInversion(true, "30000", mejora)))
    // Art23/RIRPF14: 3% de80000 (+1000 de mejora) por184/365; principal3000 no es gasto.
    const bi = new D(mejora ? "5251440" : "5254200").div(365)
    expect(r.baseImponibleGeneral.toFixed(18)).toBe(bi.toFixed(18))
    expect(r.imputacion.n).toBe(0n)
    expect(r.inmuebles[0]?.diasAlquilados).toBe(184)
    expect(r.composicion.deduccionesTerritoriales2025?.total).toEqual({ numeradorEuros: "300", divisor: "1" })
    expect(r.composicion.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(1)
    expect(r.composicion.deduccionesTerritoriales2025?.viviendaDT182025).toBeUndefined()
  })
  for (const [ingreso, total] of [["46400", "300"], ["46400.02", "0"]])
    it(`${api}: base imponible22000 frente22000.01, inversión no resta base`, () => {
      const r = Effect.runSync(ejecutar(api, galiciaInversion(false, ingreso)))
      expect(r.baseImponibleGeneral.toFixed(2)).toBe(ingreso === "46400" ? "22000.00" : "22000.01")
      expect(r.composicion.deduccionesTerritoriales2025?.total).toEqual({ numeradorEuros: total, divisor: "1" })
    })
  it(`${api}: cuota0 conserva generación sin segundo consumo`, () => {
    const r = Effect.runSync(ejecutar(api, galiciaInversion(true, "3000")))
    const t = r.composicion.deduccionesTerritoriales2025!
    expect(t.aplicaciones).toHaveLength(1)
    expect(t.aplicaciones[0]?.generado).toEqual({ numeradorEuros: "300", divisor: "1" })
    expect(t.total).toEqual({ numeradorEuros: "0", divisor: "1" })
  })
  const adversas: readonly [string, (c: ReturnType<typeof galiciaInversion>) => void][] = [
    ["inventario omitido", c => Object.assign(solicitudGalicia(c), { inversionesViviendaEjercicio: [] })],
    ["inversión ajena", c => Object.assign(solicitudGalicia(c).inversionesViviendaEjercicio[0]!, { titular: "OTRO" })],
    ["importe distinto", c => Object.assign(solicitudGalicia(c).inversionesViviendaEjercicio[0]!, { importe: "2999" })],
    ["documento distinto", c => Object.assign(solicitudGalicia(c).inversionesViviendaEjercicio[0]!, { documento: "AJENO" })],
    ["fecha distinta", c => Object.assign(solicitudGalicia(c).inversionesViviendaEjercicio[0]!, { fecha: "2025-03-02" })],
    ["sin calendario", c => { Reflect.deleteProperty(c.inmuebles[0]!, "cambioHabitual2025") }],
    ["hueco usos", c => Object.assign(c.inmuebles[0]!.usosDesdeAdquisicion[0]!, { hasta: "2025-06-29" })],
    ["fecha imposible", c => Object.assign(c.inmuebles[0]!.contrato, { desde: "2025-02-30" })],
    ["contrato distinto", c => Object.assign(c.inmuebles[0]!.cambioHabitual2025!.nuevaHabitual, { contrato: "OTRO" })],
    ["nacimiento distinto", c => Object.assign(c.inmuebles[0]!.cambioHabitual2025!, { nacimiento: "1989-01-01" })],
    ["censo duplicado", c => Object.assign(c, { inmuebles: [...c.inmuebles, ...c.inmuebles] })],
    ["renta ajena", c => Object.assign(c, { otrasRentas: "trabajo-no-integrado" })],
    ["gasto sin período", c => Object.assign(c.inmuebles[0]!.gastos[0]!, { clase: "intereses" })],
  ]
  for (const [nombre, mutar] of adversas) it(`${api}: rechaza hechos insuficientes ${nombre}`, () => {
    const c = galiciaInversion(); mutar(c)
    const e = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(["ResultadoNoSoportado", "RechazoP4a"]).toContain(e._tag)
    expect(e).not.toHaveProperty("total")
    expect(JSON.stringify(e)).not.toMatch(/TypeError|ReferenceError|Cannot read/)
  })
  for (const eleccion of ["aplicar", "no_aplicar"]) it(`${api}: ${eleccion} externo no sustituye derecho ni renta`, () => {
    const c = galiciaInversion()
    Object.assign(solicitudGalicia(c).hechos, { derechoInversionVivienda: eleccion === "aplicar" ? "con_derecho" : "sin_derecho" })
    const e = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(e._tag).toBe("RechazoP4a")
    expect(e.motivo).toContain("esquema cerrado")
  })
}

// Oráculo normativo de compatibilidad, sin tomar la salida de otra API como expected.
import { alquiler } from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/alquiler-suministros"
import { casos } from "./galicia-rioja-ampliacion-2025.casos"
for (const derecho of ["con_derecho", "sin_derecho"] as const)
  it(`Galicia conserva100 con derecho ${derecho}; Rioja conserva condición material`, () => {
    for (const codigo of ["galicia_alquiler_vivienda_habitual", "rioja_arrendamiento_menores_36"] as const) {
      const f = casos.find(x => x.hechos.codigo === codigo)
      if (f === undefined || (f.hechos.codigo !== "galicia_alquiler_vivienda_habitual" && f.hechos.codigo !== "rioja_arrendamiento_menores_36")) throw new Error("fixture alquiler")
      const r = alquiler(f.contexto, { ...f.hechos, derechoInversionVivienda: derecho })
      expect(r.estado).toBe("calculo_parcial")
      if (r.estado !== "calculo_parcial") throw new Error("sin cálculo")
      expect(r.presentacionEuros).toBe(codigo === "rioja_arrendamiento_menores_36" && derecho === "con_derecho" ? "0.00" : "100.00")
    }
  })

for (const api of ["uniforme", "explicita"] as const) it(`${api}: inversión sin renta inmobiliaria producida no se presume inocua`, () => {
  const s = solicitudGalicia(galiciaInversion())
  const c = { anio: 2025, comunidadAutonoma: "galicia", contribuyenteId: "s-1",
    situacionFamiliar: { tipo: "individual", edad: 35, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] },
    rendimientos: { trabajo: [{ importeIntegroCentimos: 2000000 }] }, reducciones: [], deducciones: [],
    retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0, deduccionesTerritoriales2025: { solicitudes: [s] } } as const
  const explicito = { ejercicio: 2025, comunidadAutonoma: "galicia", contribuyenteId: "s-1", edad: 35,
    modalidad: "individual", residenciaTodoElAnio: true, devengo: "2025-12-31", otrasRentas: "ninguna",
    familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno",
    deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: { solicitudes: [s] }, rentasExtranjeras: "ninguna",
    especialidades: "ninguna", perfil: "solo-trabajo", conciliacion: { ejercicio: 2025, estado: "totales-anuales-sin-duplicados", procedencia: ["CERT"] },
    trabajo: { ejercicio: 2025, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna",
      rendimientos: [{ id: "TR", clase: "empleo-laboral", integro: "20000", cotizaciones: { clase: "efectivas", seguridadSocial: "0", derechosPasivos: "0", colegiosHuerfanos: "0" },
        sindicato: { importe: "0", satisfecho: "no" }, colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" },
        defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" } }] }, retenciones: [] } as const
  const e = api === "uniforme"
    ? Effect.runSync(Effect.flip(liquidarIrpfAnual(c, { modo: "canonico" })))
    : Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(explicito)))
  expect(e._tag).toBe("ResultadoNoSoportado")
  expect(e.motivo).toContain("inversión sin libro inmobiliario")
})
