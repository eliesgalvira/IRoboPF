import { expect, it } from "vitest"
import { Effect, Result, Schema } from "effect"
import Decimal from "decimal.js"
import entradas from "../docs/procedencia/implementaciones/conjunta-ordinaria-2025/entradas-candidatas.json"
import { CasoFiscalAnualConConjunta2025, CasoFiscalAnualExplicitoBase } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion"
import { prepararConjunta2025, reducirBaseConjunta2025 } from "../lib/dominio/irpf/conjunta-2025/preparar"
import { CasoConjunta2025 } from "../lib/dominio/irpf/conjunta-2025/contrato"
import { obtenerMinimosAutonomicosIrpf2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"
import { componerLiquidacionAnual, type EntradaComposicionAnual } from "../lib/dominio/irpf/liquidacion/composicion-anual"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"

// Fixtures de diseño, sin cuotas oficiales ni tolerancias atribuidas a Open.
for (const fixture of entradas.casos) it(`contrato y etapas normativas ${fixture.id}`, () => {
  const c = Schema.decodeUnknownSync(CasoConjunta2025)(fixture.entradaCandidata)
  expect(Result.isSuccess(Schema.decodeUnknownResult(CasoFiscalAnualConConjunta2025)(c))).toBe(true)
  expect(Result.isFailure(Schema.decodeUnknownResult(CasoFiscalAnualExplicitoBase)(c))).toBe(true)
  const r = Effect.runSync(liquidarIrpfAnualExplicito(c))
  const b = prepararConjunta2025(c)
  expect(r.modalidad).toBe("conjunta")
  expect(r.baseImponibleGeneral).toBe(b.base.general.toFixed())
  expect(new Decimal(r.baseImponibleGeneral).minus(r.baseLiquidableGeneral).toFixed()).toBe(c.tipoUnidad === "matrimonial" ? "3400" : "2150")
  expect(r.minimoContribuyente).toBe("5550")
  expect(r.minimoDescendientes).toBe("5200")
  const m = obtenerMinimosAutonomicosIrpf2025(c.comunidadAutonoma)
  expect(r.minimos.autonomico).toBe(m.contribuyente.general.plus(m.descendientes.primero).plus(m.descendientes.adicionalMenorTres).toFixed())
  expect(r.retenciones).toBe(b.retenciones.toFixed())
  expect(new Decimal(r.cuotaPosterior).minus(r.retenciones).toFixed()).toBe(r.cuotaDiferencial)
  expect(r.miembros).toHaveLength(c.miembros.length)
  expect(r.aceptacionFiscal).toBe("pendiente")
})

it("reducción antes de escala limitada a las bases y remanente a ahorro", () => {
  const r = reducirBaseConjunta2025("matrimonial", new Decimal(1000), new Decimal(300))
  expect(r.aplicadaGeneral.toFixed()).toBe("1000")
  expect(r.aplicadaAhorro.toFixed()).toBe("300")
  expect(r.general.toFixed()).toBe("0")
  expect(r.ahorro.toFixed()).toBe("0")
})

const matrimonio = entradas.casos.find(c => c.entradaCandidata.tipoUnidad === "matrimonial")!.entradaCandidata
const monoparental = entradas.casos.find(c => c.entradaCandidata.tipoUnidad === "monoparental")!.entradaCandidata
const negativos: Array<[string, (c: typeof matrimonio) => void, (typeof matrimonio)?]> = [
  ["miembro duplicado", c => c.miembros.push(c.miembros[0])],
  ["identidad hijo duplicada", c => c.hijos[0].id = c.declarante.id],
  ["individual incompatible", c => c.conyuge!.declaracionSeparada = "individual"],
  ["opción parcial", c => c.conyuge!.opcion = "individual"],
  ["otra unidad", c => c.hijos[0].otraUnidad = true],
  ["unidad distinta", c => c.hijos[0].unidadId = "otra"],
  ["otro progenitor conviviente", c => c.otroProgenitorExterno!.convive = true, monoparental],
  ["otro titular del mínimo", c => c.otroProgenitorExterno!.derechoMinimo = true, monoparental],
  ["guarda desconocida", c => Reflect.deleteProperty(c.hijos[0], "guardaCustodia"), monoparental],
  ["guarda compartida ajena al corte", c => c.hijos[0].guardaCustodia = "compartida", monoparental],
  ["guarda matrimonial en monoparental", c => c.hijos[0].guardaCustodia = "ambos-conyuges-convivientes", monoparental],
  ["guarda exclusiva en matrimonio", c => c.hijos[0].guardaCustodia = "exclusiva-declarante-todo2025"],
  ["sin censo exhaustivo", c => c.censoAlDevengoCompleto = false],
  ["falta cónyuge", c => c.conyuge = null],
  ["hijo con rentas", c => c.hijos[0].rentaNoExenta = "1.00"],
  ["fecha imposible", c => c.hijos[0].fechaNacimiento = "2023-02-30"],
  ["hijo tres años", c => c.hijos[0].fechaNacimiento = "2022-01-01"],
  ["ahorro ajeno", c => Object.assign(c.economia, { ahorro: "10" })],
  ["retención duplicada", c => c.economia.retenciones.push(c.economia.retenciones[0])],
  ["SS estimada", c => c.economia.trabajo.rendimientos[0].cotizaciones.clase = "estimadas"],
  ["discapacidad", c => c.declarante.discapacidad = "33-a-64"],
  ["fallecimiento", c => c.declarante.vivoTodo2025 = false],
  ["salario fuera del corte DA61", c => c.economia.trabajo.rendimientos[0].integro = "16000"],
]
for (const [nombre, mutate, origen] of negativos) it(`rechaza ${nombre}`, () => {
  const c = structuredClone(origen ?? matrimonio)
  mutate(c)
  expect(() => prepararConjunta2025(Schema.decodeUnknownSync(CasoConjunta2025)(c, { onExcessProperty: "error" }))).toThrow()
  expect(() => Effect.runSync(liquidarIrpfAnualExplicito(Schema.decodeUnknownSync(CasoConjunta2025)(c, { onExcessProperty: "error" })))).toThrow()
})

it("reutilización DA61 conserva rechazo individual a conjunta encubierta", () => {
  const c = {...matrimonio, modalidad: "individual"}
  expect(Result.isFailure(Schema.decodeUnknownResult(CasoFiscalAnualExplicitoBase)(c))).toBe(true)
})

for (const fixture of entradas.casos) it(`regresión individual ordinaria independiente ${fixture.id}`, () => {
  const c = Schema.decodeUnknownSync(CasoConjunta2025)(fixture.entradaCandidata)
  // Caso individual sintético autónomo de control; no modifica slots conjuntos.
  const individual = Schema.decodeUnknownSync(CasoFiscalAnualExplicitoBase)({
    ejercicio: 2025, comunidadAutonoma: c.comunidadAutonoma, edad: 40,
    modalidad: "individual", residenciaTodoElAnio: true, devengo: "2025-12-31",
    otrasRentas: "ninguna", familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna",
    reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: "solo-da61-si-procede",
    rentasExtranjeras: "ninguna", especialidades: "ninguna", perfil: "solo-trabajo",
    trabajo: c.economia.trabajo, conciliacion: c.economia.conciliacion, retenciones: c.economia.retenciones,
  })
  const r = Effect.runSync(liquidarIrpfAnualExplicito(individual))
  const b = prepararConjunta2025(c)
  expect(r.baseImponibleGeneral).toBe(b.base.general.toFixed())
  expect(r.baseLiquidableGeneral).toBe(r.baseImponibleGeneral)
  expect(r.retenciones).toBe(b.retenciones.toFixed())
  expect(r.deduccionTrabajo).toBe("0")
  expect(new Decimal(r.cuotaPosterior).minus(r.retenciones).toFixed()).toBe(r.cuotaDiferencial)
})

it("frontera común rechaza bases contradictorias y conjunta sin contrato", () => {
  const p = prepararConjunta2025(Schema.decodeUnknownSync(CasoConjunta2025)(matrimonio))
  const e: EntradaComposicionAnual = {
    conjunta2025: p.caso,
    ambito: { anio: 2025, comunidadAutonoma: p.caso.comunidadAutonoma, contribuyenteId: p.caso.declarante.id,
      situacionFamiliar: { tipo: "conjunta", edad: p.edad, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } },
    cotizaciones: { naturaleza: "efectivas", trabajador: p.cotizaciones }, precision: 80,
    politica: "decimal-hasta-salida", origenBaseGeneralB: "solo-trabajo",
    baseGeneral: p.base.general, baseAhorro: new Decimal(0), rentasAntesReducciones: p.base.rentaAntesReducciones!,
    rentasTrabajoAnuales: { integroTrabajo: p.bruto, restoRentas: new Decimal(0) },
    minimosEstatales: MINIMOS_ESTATALES_2025, deduccionesAutonomicasCentimos: 0, serviciosLaborales: { bruto: p.bruto },
  }
  expect(() => Effect.runSync(componerLiquidacionAnual({...e, baseGeneral: p.base.general.plus(1)}))).toThrow()
  expect(() => Effect.runSync(componerLiquidacionAnual({...e, conjunta2025: undefined}))).toThrow()
  expect(() => Effect.runSync(componerLiquidacionAnual({...e, politica: "open-empleo-madrid-2025"}))).toThrow()
})
