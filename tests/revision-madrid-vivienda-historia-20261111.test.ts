import { Effect } from "effect"
import { expect, it } from "vitest"
import { analitico, efectivo, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import type { HistoriaViviendaMadrid } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/madrid-vivienda-historia-esquema"
import type { CensoBasesFamiliares2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
// Datos propios: no importa fixtures ni esperados del autor.
function datos(origen: 2023 | 2024 | 2025 = 2023) {
  const trabajo = (ejercicio: 2023 | 2024 | 2025, integro = "30000") => ({ ...efectivo.trabajo, ejercicio,
    rendimientos: efectivo.trabajo.rendimientos.map(r => ({ ...r, integro })) })
  const d = { ...derechos, descendientes: derechos.descendientes.map(h => ({ ...h, fechaNacimiento: "2023-01-01", edadDevengo: 2 })) }
  const c: CensoBasesFamiliares2025 = {
    referencia: "revision-propia", ejercicio: 2025, devengo: "2025-12-31", contribuyente: "s-1",
    estadoCivil: "casado-no-separado", conyuge: "s-2", censoCompleto: true, hijosCompletos: true,
    hijos: [{ id: "s-3", nacimiento: "2023-01-01", progenitores: ["s-1", "s-2"], conviveCon: ["s-1", "s-2"], independienteConConsentimiento: false, apoyoJudicial: "ninguno", soporte: "registro-padron" }],
    personas: ["s-1", "s-2", "s-3"].map(id => ({ id, soporte: "certificado", residenteComunTodo2025: true, vivoTodo2025: true,
      economia: id === "s-1" ? { perfil: "declarante-en-composicion" } : id === "s-3" ? { perfil: "sin-rentas", censoRentasCompleto: true } : {
        perfil: "solo-trabajo", censoRentasCompleto: true, otrasRentas: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", trabajo: trabajo(2025),
      } })),
  }
  const h: HistoriaViviendaMadrid = {
    contribuyente: "s-1", viviendaId: "revision-v", adquisicion: origen + "-06-15", referencia: "escritura",
    modalidadAdquisicion: "compraventa-terminada", unidadHabitualDesde: origen + "-07-01", unidadHabitualHasta: "2025-12-31",
    periodos: (origen === 2023 ? [2023, 2024] as const : [2024] as const).map(ejercicio => ({
      ejercicio, referencia: "padron-certificados", modalidad: "individual", estadoCivil: "casado-no-separado", conyuge: "s-2", censoCompleto: true, hijosCompletos: true,
      personas: ["s-1", "s-2", "s-3"].map(id => ({ id, soporte: "certificado", residenteComunTodoEjercicio: true, vivoTodoEjercicio: true, residenciaAutonomica: "madrid",
        economia: id === "s-3" ? { perfil: "sin-rentas", censoRentasCompleto: true } : { perfil: "solo-trabajo", censoRentasCompleto: true, otrasRentas: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", trabajo: trabajo(ejercicio) } })),
      hijos: [{ id: "s-3", nacimiento: "2023-01-01", progenitores: ["s-1", "s-2"], convivientesDevengo: ["s-1", "s-2"],
        vinculos: ["s-1", "s-2"].map(progenitor => ({ progenitor, clase: "consanguinidad" })), independienteConConsentimiento: false, apoyoJudicial: "ninguno", declaracion: "no-presenta", soporte: "registro" }],
    })),
  }
  let s: SolicitudAnualF2025 = { lote: "F-ampliado", codigo: "madrid_vivienda_nacimiento_adopcion_hijos", hechos: {
    viviendas: [{ id: "revision-v", territorio: "madrid", adquisicion: h.adquisicion, ocupacionDesde: h.unidadHabitualDesde, permanenciaHasta: "2025-12-31", precioEUR: "123456.78", gastosEUR: "2345.67", tributosEUR: "9876.54", titulares: ["s-1"], porcentajePropiedad: "100" }],
    personas: [{ id: "s-3", relacion: "hijo", nacimiento: "2023-01-01", certificadoParentesco: "registro", situacionDevengo: "vivo", alimentos64175: "no", rentasNoExentasEUR: "0", declaracionTipo: "no_presentada", discapacidadPorcentaje: "0", convivencia: [{ desde: "2025-01-01", hasta: "2025-12-31" }], gradoMasCercanoConPrioridad: [], titularesMinimo: ["s-1", "s-2"] }],
  } }
  if (origen !== 2025) s = { ...s, historiaViviendaMadrid: h }
  return { s, c, d }
}
type Datos = ReturnType<typeof datos>
type Resultado = ReturnType<typeof ejecutar>
function esExito(r: Resultado): r is Extract<Resultado, { readonly _tag: "Success" }> { return r._tag === "Success" }
function esFallo(r: Resultado): r is Extract<Resultado, { readonly _tag: "Failure" }> { return r._tag === "Failure" }
function ejecutar(api: "canonico" | "explicito", f: Datos) {
  const base = { contribuyenteId: "s-1", derechosMinimos: f.d, deduccionesTerritoriales2025: { solicitudes: [f.s] } }
  const comun = f.s.codigo === "madrid_cuidado_ascendientes" ? base : { ...base, basesFamiliares2025: f.c }
  return api === "canonico" ? Effect.runSync(Effect.result(liquidarIrpfAnual({ ...analitico, ...comun }, { modo: "canonico" })))
    : Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...efectivo, ...comun, familiaresConDerechoMinimo: "segun-derechos", deducciones: "territoriales-por-hechos-y-da61" })))
}
function importe(api: "canonico" | "explicito", f: Datos, esperado: string) {
  const r = ejecutar(api, f)
  expect(esExito(r), esFallo(r) ? String(r.failure) : "").toBe(true)
  if (esExito(r)) expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional(esperado))
}
function rentaHistorica(f: Datos, ejercicio: 2023 | 2024, bruto: string): Datos {
  const h = f.s.historiaViviendaMadrid!
  return { ...f, s: { ...f.s, historiaViviendaMadrid: { ...h, periodos: h.periodos.map(p => p.ejercicio !== ejercicio ? p : { ...p,
    personas: p.personas.map(x => x.id !== "s-2" || x.economia.perfil !== "solo-trabajo" ? x : { ...x, economia: { ...x.economia, trabajo: { ...x.economia.trabajo, rendimientos: x.economia.trabajo.rendimientos.map(r => ({ ...r, integro: bruto })) } } }),
  }) } } }
}
for (const api of ["canonico", "explicito"] as const) {
  for (const y of [2023, 2024, 2025] as const) it(`${api}: importe exacto con fracciones de céntimo, compra ${y}`, () => importe(api, datos(y), "1356.7899"))
  for (const bruto of ["70677.99", "70678.00", "70678.01"]) {
    it(`${api}: origen art18.2 ${bruto}`, () => importe(api, rentaHistorica(datos(), 2023, bruto), bruto === "70678.01" ? "0" : "1356.7899"))
    it(`${api}: exceso intermedio no extingue ${bruto}`, () => importe(api, rentaHistorica(datos(), 2024, bruto), "1356.7899"))
  }
  it(`${api}: límite 2025 independiente del origen`, () => {
    const f = datos(); const bruto = "70678.01"
    f.c = { ...f.c, personas: f.c.personas.map(p => p.id !== "s-2" || p.economia.perfil !== "solo-trabajo" ? p : { ...p, economia: { ...p.economia, trabajo: { ...p.economia.trabajo, rendimientos: p.economia.trabajo.rendimientos.map(r => ({ ...r, integro: bruto })) } } }) }
    f.d = { ...f.d, descendientes: f.d.descendientes.map(h => ({ ...h, titulares: h.titulares.map(t => t.titularId === "s-2" ? { ...t, rentasNoExentasCentimos: 6673401 } : t) })) }
    importe(api, f, "0")
  })
  it(`${api}: tope anual sin acumular anualidades no aplicadas`, () => {
    const f = datos(); f.s = { ...f.s, hechos: { ...f.s.hechos, viviendas: f.s.hechos.viviendas!.map(v => ({ ...v, precioEUR: "200000" })) } }; importe(api, f, "1546.50")
  })
  it(`${api}: transmisión extingue 2025`, () => {
    const f = datos(); f.s = { ...f.s, hechos: { ...f.s.hechos, viviendas: f.s.hechos.viviendas!.map(v => ({ ...v, transmision: "2025-12-31" })) } }; importe(api, f, "0")
  })
  it(`${api}: historia incompleta o identidad ajena se rechaza`, () => {
    const f = datos(), h = f.s.historiaViviendaMadrid!
    const sinHistoria = { ...f.s }; Reflect.deleteProperty(sinHistoria, "historiaViviendaMadrid")
    for (const historia of [undefined, { ...h, periodos: [h.periodos[0]!] }, { ...h, periodos: [h.periodos[0]!, h.periodos[0]!] }, { ...h, viviendaId: "otra" },
      { ...h, periodos: h.periodos.map(p => ({ ...p, hijos: p.hijos.map(x => ({ ...x, convivientesDevengo: ["s-2"] })) })) }])
      expect(esFallo(ejecutar(api, { ...f, s: historia === undefined ? sinHistoria : { ...f.s, historiaViviendaMadrid: historia } }))).toBe(true)
  })
  it(`${api}: dos viviendas no se reducen silenciosamente a la primera`, () => {
    const f = datos(); f.s = { ...f.s, hechos: { ...f.s.hechos, viviendas: [...f.s.hechos.viviendas!, { ...f.s.hechos.viviendas![0]!, id: "otra" }] } }
    expect(esFallo(ejecutar(api, f))).toBe(true)
  })
  it(`${api}: guardia de historia también antes del retorno de ascendientes (hipótesis R1)`, () => {
    const f = datos(), h = f.s.historiaViviendaMadrid!
    f.d = { ...f.d, ascendientes: [], ascendientesCompletos: true }
    const ajena: SolicitudAnualF2025 = { lote: "F-ampliado", codigo: "madrid_cuidado_ascendientes", hechos: { personas: [] } }
    importe(api, { ...f, s: ajena }, "0") // control positivo de alcanzabilidad
    expect(esFallo(ejecutar(api, { ...f, s: { ...ajena, historiaViviendaMadrid: h } }))).toBe(true)
  })
}

for (const api of ["canonico", "explicito"] as const) it(`${api}: cuota cero derivada sin saldo art13`, () => {
  const f = datos()
  const d = { ...f.d, descendientes: f.d.descendientes.map(h => ({ ...h, titulares: h.titulares.map(t => t.titularId !== "s-1" ? t : { ...t, rentasNoExentasCentimos: api === "canonico" ? 735200 : 605600 }) })) }
  const comun = { contribuyenteId: "s-1", derechosMinimos: d, basesFamiliares2025: f.c, deduccionesTerritoriales2025: { solicitudes: [f.s] } }
  // Canónico: SS ordinaria 6,48% => renta 7352; explícito conserva SS1944 =>6056.
  // Tras art20, base inferior al mínimo personal: cuota autonómica cero.
  const r = api === "canonico" ? Effect.runSync(Effect.result(liquidarIrpfAnual({ ...analitico, ...comun, rendimientos: { trabajo: [{ importeIntegroCentimos: 1000000 }] } }, { modo: "canonico" })))
    : Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...efectivo, ...comun, familiaresConDerechoMinimo: "segun-derechos", deducciones: "territoriales-por-hechos-y-da61", trabajo: { ...efectivo.trabajo, rendimientos: efectivo.trabajo.rendimientos.map(r => ({ ...r, integro: "10000" })) } })))
  expect(esExito(r)).toBe(true)
  if (esExito(r)) expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional("0"))
})
