import Decimal from "decimal.js"
import { Effect } from "effect"
import { expect, it } from "vitest"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CensoBasesFamiliares2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import type { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import { consumirCuotaAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-cuota"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { analitico, efectivo, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { censo, operacion } from "./p5-fixtures"
import oraculos from "./madrid-art14-tabla-oficial.json"
const codigo = "madrid_familias_dos_descendientes_ingresos_reducidos"
function fixture(chosen = true) {
  const hijos = ["s-3", "s-4"]
  const d = { ...derechos, descendientes: hijos.map(sujetoId => ({ ...derechos.descendientes[0]!, sujetoId,
    titulares: derechos.descendientes[0]!.titulares.map(t => ({ ...t, rentasNoExentasCentimos: t.titularId === "s-1" ? 2044480 : 0 })) })) }
  const bases: CensoBasesFamiliares2025 = {
    referencia: "art14-hechos", ejercicio: 2025, devengo: "2025-12-31", contribuyente: "s-1", estadoCivil: "sin-vinculo", censoCompleto: true, hijosCompletos: true,
    hijos: hijos.map(id => ({ id, nacimiento: "2017-01-01", progenitores: ["s-1", "s-2"], conviveCon: ["s-1", "s-2"], independienteConConsentimiento: false, apoyoJudicial: "ninguno", soporte: "filiacion" })),
    personas: ["s-1", "s-2", ...hijos].map(id => ({ id, soporte: "censo", residenteComunTodo2025: true, vivoTodo2025: true,
      economia: id === "s-1" ? { perfil: "declarante-en-composicion" } : { perfil: "sin-rentas", censoRentasCompleto: true } })),
  }
  const art14: SolicitudAnualF2025 = { lote: "F-ampliado", codigo, hechos: { titularesConMismoMinimo: ["s-1", "s-2"], personas: hijos.map(id => ({
    id, relacion: "hijo", nacimiento: "2017-01-01", rentasNoExentasEUR: "0", declaracionTipo: "no_presentada", discapacidadPorcentaje: "0", situacionDevengo: "vivo", certificadoParentesco: "filiacion", alimentos64175: "no",
    progenitores: ["s-1", "s-2"], titularesMinimo: ["s-1", "s-2"], titularesDeduccion: ["s-1", "s-2"], gradoMasCercanoConPrioridad: [], convivencia: [{ desde: "2025-01-01", hasta: "2025-12-31" }], declarantesConDerechoReferencia: "derechos" })) } }
  const op = { ...operacion(), eleccion: chosen ? "aplicar" as const : "no_aplicar" as const }
  const art9: SolicitudAnualF2025 = { lote: "F-ampliado", codigo: "madrid_donativos_fundaciones_clubes_deportivos", hechos: {
    entidades: [{ id: op.entidad.id, forma: "fundacion", registro: "registro-madrid", cuentasPresentadas: "si", certificado: "cert-regional" }],
    pagos: [{ id: op.pago.id, operacionId: op.operacionId, pagador: op.pago.pagador, objetoId: op.entidad.id, fecha: op.pago.fecha, importeEUR: op.pago.euros, concepto: "donativo_dinerario", medio: op.pago.medio, soportePago: op.pago.documento }],
  } }
  const a = { ...analitico, contribuyenteId: "s-1", rendimientos: { trabajo: [{ importeIntegroCentimos: 2400000 }] }, derechosMinimos: d, basesFamiliares2025: bases }
  const e = { ...efectivo, contribuyenteId: "s-1", derechosMinimos: d, basesFamiliares2025: bases, familiaresConDerechoMinimo: "segun-derechos" as const, deducciones: "territoriales-por-hechos-y-da61" as const,
    trabajo: { ...efectivo.trabajo, rendimientos: efectivo.trabajo.rendimientos.map(r => ({ ...r, integro: "24000", cotizaciones: { ...r.cotizaciones, seguridadSocial: "1555.20" } })) } }
  return { a, e, bases, art14, art9, donativos: censo([op]) }
}
it.each([false, true])("R1: el rastro incluye art14 con censo de donativos=%s", conDonativos => {
  const f = fixture(false)
  const deduccionesTerritoriales2025 = conDonativos
    ? { solicitudes: [f.art14], donativosEstatales2025: f.donativos }
    : { solicitudes: [f.art14] }
  const r = Effect.runSync(liquidarIrpfAnualExplicito({ ...f.e, deduccionesTerritoriales2025 }))
  const linea = r.rastro.pasos.flatMap(p => p.lineasCalculo ?? [])
    .find(l => l.origen?.siteId === "anual.explicito.cuota.liquida-legal")
  expect(r.cuotaLiquidaLegal).toBe("2446.398")
  expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("118.492"))
  expect(linea?.origen?.decimal).toBe("2446.398")
  expect(linea?.formula).toContain("deducciones aplicadas")
  expect(linea?.formula).not.toContain("sin otras deducciones")
})
it("R1 resumen: no niega las deducciones aplicadas a una pensión", () => {
  const f = fixture(false)
  const trabajo = { ...f.e.trabajo, rendimientos: f.e.trabajo.rendimientos.map(r => ({ ...r, clase: "pension" as const })) }
  const r = Effect.runSync(liquidarIrpfAnualExplicito({ ...f.e, trabajo, deduccionesTerritoriales2025: { solicitudes: [f.art14] } }))
  const total = r.deduccionesTerritoriales2025?.total
  expect(total).toBeDefined()
  expect(new Decimal(total!.numeradorEuros).gt(0)).toBe(true)
  const resumen = r.rastro.pasos.find(p => p.titulo === "Bases, cuotas y pagos anuales")
  expect(resumen?.descripcion).not.toContain("ni otras deducciones")
  expect(resumen?.descripcion).toContain("deducciones admitidos por el perfil anual")
})
for (const row of oraculos) for (const reverse of [false, true]) {
  it(`ART14_LIBRO_UNICO ${row.api} estatal=${row.chosen} art9=${row.regional} inverso=${reverse}`, () => {
    const f = fixture(row.chosen)
    const solicitudes = row.regional ? [f.art14, f.art9] : [f.art14]
    const deduccionesTerritoriales2025 = { solicitudes: reverse ? [...solicitudes].reverse() : solicitudes, donativosEstatales2025: f.donativos }
    const r = row.api === "canonico"
      ? Effect.runSync(liquidarIrpfAnual({ ...f.a, deduccionesTerritoriales2025 }, { modo: "canonico" }))
      : Effect.runSync(liquidarIrpfAnualExplicito({ ...f.e, deduccionesTerritoriales2025 }))
    const libro = r.deduccionesTerritoriales2025
    expect(libro?.total).toEqual(row.totalRegional)
    expect(libro?.disponible).toEqual(row.disponible)
    if (libro === undefined || !("ordenAplicado" in libro)) throw new Error("Falta secuencia F")
    expect(libro.aplicaciones.filter(x => x.codigo === codigo)).toHaveLength(1)
    expect(libro.aplicaciones.find(x => x.codigo === codigo)?.generado).toEqual(row.art14)
    if (libro === undefined || !("donativosEstatales2025" in libro)) throw new Error("Falta libro común")
    expect(libro.donativosEstatales2025.autonomica.integra).toEqual(row.integra)
    expect(libro.donativosEstatales2025.autonomica.aplicada).toEqual(row.general)
    expect(libro.donativosEstatales2025.estatal.aplicada).toEqual(row.estatal)
    expect(libro.donativosEstatales2025.operaciones).toHaveLength(1)
    const total = new Decimal(row.totalRegional.numeradorEuros).div(row.totalRegional.divisor)
    expect(total.gte(0)).toBe(true)
  })
}
for (const api of ["canonico", "explicito"] as const) {
  it(api + ": rechaza identidades, omisiones, duplicados y bases externas", () => {
    const f = fixture()
    const malos = [
      { ...f.art14, hechos: { ...f.art14.hechos, titularesConMismoMinimo: ["s-1"] } },
      { ...f.art14, hechos: { ...f.art14.hechos, personas: f.art14.hechos.personas!.slice(0, 1) } },
      { ...f.art14, hechos: { ...f.art14.hechos, personas: f.art14.hechos.personas!.map(p => ({ ...p, nacimiento: "2018-01-01" })) } },
      { ...f.art14, hechos: { ...f.art14.hechos, basesOtrosTitulares: [{ id: "s-2", generalEUR: "0", ahorroEUR: "0" }] } },
    ]
    for (const s of malos) {
      // SAFETY: hechos deliberadamente ajenos al contrato para acreditar rechazo, nunca oráculo monetario.
      const solicitudes = [s] as readonly SolicitudAnualF2025[]
      const deduccionesTerritoriales2025 = { solicitudes, donativosEstatales2025: f.donativos }
      const r = api === "canonico" ? Effect.runSync(Effect.result(liquidarIrpfAnual({ ...f.a, deduccionesTerritoriales2025 }, { modo: "canonico" })))
        : Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...f.e, deduccionesTerritoriales2025 })))
      expect(r._tag).toBe("Failure")
    }
    const deduccionesTerritoriales2025 = { solicitudes: [f.art14, f.art14], donativosEstatales2025: f.donativos }
    expect(() => api === "canonico" ? Effect.runSync(liquidarIrpfAnual({ ...f.a, deduccionesTerritoriales2025 }, { modo: "canonico" }))
      : Effect.runSync(liquidarIrpfAnualExplicito({ ...f.e, deduccionesTerritoriales2025 }))).toThrow()
  })
}
it("prioridad art14 consume resto regional, numerosa sobre íntegra y extranjero después", () => {
  const art14 = { codigo, estado: "calculo_parcial" as const, motivo: "fórmula normativa pendiente de cuota", citas: [], reservas: [], rastro: [], dependenciaAnual: { magnitud: "cuota_tras_resto_deducciones" as const, factor: "0.1", operacion: "art14" } }
  const fn = { ...art14, codigo: "madrid_condicion_familia_numerosa", dependenciaAnual: { magnitud: "cuota_integra_autonomica" as const, factor: "0.5", operacion: "art13bis" } }
  const r = consumirCuotaAnualF2025(racional("890"), [codigo, fn.codigo, "madrid_inversiones_nuevos_contribuyentes_extranjero"], [art14, fn, racional("100")], racional("1000"))
  expect(r.aplicaciones.find(x => x.codigo === codigo)?.generado).toEqual(racional("39"))
  expect(r.total).toEqual(racional("639"))
})
it.each(["26743.99", "26744", "26744.01"])("frontera art14 desde hechos laborales propios: %s", bruto => {
  const f = fixture()
  const base = new Decimal(bruto).minus(2000)
  const derechosMinimos = { ...f.e.derechosMinimos, descendientes: f.e.derechosMinimos.descendientes.map(d => ({ ...d, titulares: d.titulares.map(t => ({ ...t, rentasNoExentasCentimos: t.titularId === "s-1" ? base.times(100).toNumber() : 0 })) })) }
  const trabajo = { ...f.e.trabajo, rendimientos: f.e.trabajo.rendimientos.map(r => ({ ...r, integro: bruto, cotizaciones: { ...r.cotizaciones, seguridadSocial: "0" } })) }
  const r = Effect.runSync(liquidarIrpfAnualExplicito({ ...f.e, trabajo, derechosMinimos, deduccionesTerritoriales2025: { solicitudes: [f.art14], donativosEstatales2025: f.donativos } }))
  const libro = r.deduccionesTerritoriales2025
  if (libro === undefined || !("ordenAplicado" in libro)) throw new Error("Falta evaluación F")
  expect(libro.aplicaciones.find(x => x.codigo === codigo)?.estado).toBe(base.lte(24744) ? "aplicada" : "excluida")
})
it("art14 nunca convierte una rama anterior pendiente en cero", () => {
  const parcial = { codigo, estado: "calculo_parcial" as const, motivo: "fórmula normativa pendiente de cuota", citas: [], reservas: [], rastro: [], dependenciaAnual: { magnitud: "cuota_tras_resto_deducciones" as const, factor: "0.1", operacion: "art14" } }
  const sinHechos = { codigo: "madrid_gastos_educativos", estado: "no_soportado" as const, motivo: "censo incompleto", citas: [], reservas: [], rastro: [] }
  const r = consumirCuotaAnualF2025(racional("100"), [codigo, sinHechos.codigo], [parcial, sinHechos])
  expect(r.aplicaciones.find(x => x.codigo === codigo)?.generado).toBeUndefined()
  expect(r.completoEnRamasSolicitadas).toBe(false)
})
for (const api of ["canonico", "explicito"] as const) it(api + ": insuficiencia por mínimos de dos descendientes con discapacidad, sin trasladar cuotas", () => {
  const f = fixture()
  const derechosMinimos = { ...f.a.derechosMinimos, descendientes: f.a.derechosMinimos.descendientes.map(d => ({ ...d, discapacidad: { _tag: "Discapacidad65OMas" as const } })) }
  const solicitud = { ...f.art14, hechos: { ...f.art14.hechos, personas: f.art14.hechos.personas!.map(p => ({ ...p, discapacidadPorcentaje: "65", certificadoDiscapacidad: "certificado" })) } }
  const deduccionesTerritoriales2025 = { solicitudes: [solicitud], donativosEstatales2025: censo([operacion("20000")]) }
  const r = api === "canonico" ? Effect.runSync(liquidarIrpfAnual({ ...f.a, derechosMinimos, deduccionesTerritoriales2025 }, { modo: "canonico" }))
    : Effect.runSync(liquidarIrpfAnualExplicito({ ...f.e, derechosMinimos, deduccionesTerritoriales2025 }))
  const libro = r.deduccionesTerritoriales2025
  if (libro === undefined || !("donativosEstatales2025" in libro)) throw new Error("Falta libro")
  expect(libro.total).toEqual(racional("0"))
  expect(libro.donativosEstatales2025.autonomica.disponible).toEqual(racional("0"))
  expect(libro.donativosEstatales2025.atribucionBaseRegionalCompleta).toBe(false)
  expect(libro.donativosEstatales2025.autonomica.generada).not.toEqual(libro.donativosEstatales2025.autonomica.aplicada)
})

import { producirBasesFamiliares2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { producirDonativosEstatales2025, eurosDonativos } from "../lib/dominio/irpf/deducciones/donativos-estatales-2025/productor"
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual"
it("adaptador art14: acredita secuencia_completa_art14_con_generales sobre base", () => {
  const f = fixture(), baseGeneral = new Decimal("20444.8"), baseAhorro = new Decimal(0)
  // Cuotas del mismo caso reconstruidas por Fraction desde escala/mínimos en oraculo.py;
  // sólo prueba del adaptador interno, no contrato público de cuotas consignadas.
  const cuotaAutonomica = new Decimal("1184.92511")
  const donativosEstatales = producirDonativosEstatales2025(f.donativos, { contribuyente: "s-1", baseLiquidableGeneral: baseGeneral, baseLiquidableAhorro: baseAhorro, cuotaEstatal: new Decimal("1379.97"), cuotaAutonomica })
  const r = evaluarAnualF2025(f.art14, { caso: f.a, baseGeneral, baseAhorro, cuotaAutonomica,
    cuotaAutonomicaResidual: eurosDonativos(donativosEstatales.autonomica.disponible), donativosEstatales,
    minimoPersonalFamiliar: new Decimal(8100), sujetosConMinimo: ["s-3", "s-4"], atribucionesMinimo: ["s-3", "s-4"].map(sujetoId => ({ sujetoId, titulares: ["s-1", "s-2"] })),
    libroBasesFamiliares2025: producirBasesFamiliares2025(f.bases, f.a, { general: baseGeneral, ahorro: baseAhorro }),
  })
  expect(r.dependenciaAnual?.magnitud, JSON.stringify(r)).toBe("cuota_tras_resto_deducciones")
  const resuelto = consumirCuotaAnualF2025(donativosEstatales.autonomica.disponible, [codigo], [r])
  expect(resuelto.aplicaciones[0]?.estado).toBe("aplicada")
  expect(resuelto.total).toEqual(oraculos.find(x => x.api === "canonico" && x.chosen && !x.regional)?.art14)
})
