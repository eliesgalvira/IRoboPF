import { Effect, Result } from "effect"
import { componerLiquidacionAnual, type EntradaComposicionAnual } from "../lib/dominio/irpf/liquidacion/composicion-anual"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion"
import original2018 from "./fixtures/open-2018-etapas.json"
import matriz from "../docs/procedencia/datos-2012-2026/producto-series-historicas/matriz.json"
import { materializarPaqueteMadrid } from "../lib/dominio/irpf/analisis-madrid/parametros"
import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { analizarMadrid, type EntradaAnalisisMadrid } from "../lib/dominio/irpf/analisis-madrid/analizar"
import { parametrosMadrid2018, reduccionIndexada2018 } from "../lib/dominio/irpf/analisis-madrid/parametros"
import { ipcMadrid, METODO_IPC_LEGACY } from "../lib/dominio/irpf/analisis-madrid/ipc"

const D = Decimal.clone({ precision: 80 })
const entrada = (ejercicio = 2018): EntradaAnalisisMadrid & { readonly brutoBaseEUR2018: string } => ({
  metodoIpc: "ipc-diciembre-producto-tasas-1decimal-legacy-v1", ejercicio, edad: ejercicio - 1985, brutoBaseEUR2018: "30000", retenciones: "100",
  alcance: "madrid-individual-empleo-anual-sin-otras-rentas-familia-discapacidad-especialidades",
  ssTrabajador: { naturaleza: "efectivas", importe: "1000", ejercicio, procedencia: "sintetico-unitario", operacion: "ss" },
  ssEmpresa: { naturaleza: "no-disponible" },
})
function calcular(e = entrada()) {
  const r = analizarMadrid(e)
  if (r.estado !== "calculado") throw new Error(r.motivo)
  return r
}
it("F=1, cuotas fijas publicadas y racional independiente", () => {
  const r = calcular()
  // Base27000: estatal3132.75-527.25; Madrid2945.2524-499.50.
  expect(r.X.Q).toBe("5051.2524")
  expect(r.X.neto).toBe("23948.7476")
  expect(JSON.parse(JSON.stringify(r.I))).toEqual(JSON.parse(JSON.stringify(r.X)))
  expect(r.Hdecimal.Q).toBe(r.X.Q)
  expect(r.Hcontractual.estado).toBe("disponible")
  expect(r.efectos.Eindex).toBe("0")
})
it("art20 conserva mezcla2018 y dimensionalidad", () => {
  // N12000: A=2832.8125; B=5565; mezcla=4198.90625.
  expect(reduccionIndexada2018(new D(12000), parametrosMadrid2018(new D(1))).toFixed()).toBe("4198.90625")
  expect(reduccionIndexada2018(new D(24000), parametrosMadrid2018(new D(2))).toFixed()).toBe("8397.8125")
  expect(() => reduccionIndexada2018(new D(12000), { ...parametrosMadrid2018(new D(1)) })).toThrow()
})
it.each([2018,2019,2020,2021,2022,2023,2024,2025])("SS común e identidad antes de división %i", anio => {
  const r = calcular(entrada(anio))
  expect([r.X.ssTrabajador,r.I.ssTrabajador,r.Hdecimal.ssTrabajador]).toEqual(["1000","1000","1000"])
  expect(r.efectos.identidad.exactaAntesDivision).toBe(true)
  expect(r.coste).toBeNull(); expect(r.cuna).toBeNull()
  const s = calcular({ ...entrada(anio), retenciones: "900" })
  expect(s.Hdecimal.neto).toBe(r.Hdecimal.neto)
  expect(s.Hcontractual.estado).toBe(r.Hcontractual.estado)
})
it("IPC inverso y aislamiento de Decimal global", () => {
  const previo = Decimal.precision
  try {
    Decimal.set({ precision: 5 })
    const r = calcular(entrada(2025))
    expect(Decimal.precision).toBe(5)
    const f = ipcMadrid(2025, METODO_IPC_LEGACY).factor
    const inverso = new D(1).div(f)
    expect(new D(f).mul(inverso).minus(1).abs().lt("1e-75")).toBe(true)
    expect(new D(r.factor).minus(f).abs().lt("1e-18")).toBe(true)
  } finally { Decimal.set({ precision: previo }) }
})
it("estimación no se convierte en nómina ni fuerza Open", () => {
  const r = calcular({ ...entrada(2025), ssTrabajador: { naturaleza: "estimadas-perfil-uniforme" } })
  expect(r.Hcontractual.estado).toBe("no-disponible")
  expect(r.efectos.Erepresentacion).toBeNull()
  expect(r.cotizaciones.estimacion?.redondeoTgss).toBe("pendiente")
})
it("DA61 sólo en H2025 y neto usa cuota posterior", () => {
  const r = calcular({ ...entrada(2025), brutoBaseEUR2018: "14500" })
  expect(r.X.deduccionTrabajo).toBe("0"); expect(r.I.deduccionTrabajo).toBe("0")
  expect(new D(r.Hdecimal.deduccionTrabajo).gte(0)).toBe(true)
  expect(new D(r.Hdecimal.bruto).minus(r.Hdecimal.ssTrabajador).minus(r.Hdecimal.Q).toFixed()).toBe(r.Hdecimal.neto)
})
it("errores no son cero; no acepta override ni años fuera del corte", () => {
  for (const e of [{ ...entrada(), ejercicio: 2026 }, { ...entrada(), ejercicio: 2017 }, { ...entrada(), politica: "open" }, { ...entrada(), parametrosAnaliticosMadrid: {} }])
    expect(analizarMadrid(e)).toMatchObject({ estado: "no-disponible" })
  expect(calcular().evidencia).toMatchObject({ verificacionAlgoritmoSnapshot: "pendiente", snapshotPromovido: false })
})

it("paquete serial congelado, reconstrucción local e input desligado", () => {
  const p = parametrosMadrid2018(new D(2))
  const antes = JSON.stringify(p)
  expect(Object.isFrozen(p.parametrosArt20[0])).toBe(true)
  expect(Object.isFrozen(p.minimos)).toBe(true)
  // SAFETY: adversa intencional fuerza escritura para demostrar congelación en runtime.
  expect(() => {
    // SAFETY: escritura adversa intencional contra el paquete congelado.
    const fila = p.autonomica[1] as { cuota: string }
    fila.cuota = "0"
  }).toThrow()
  const a = materializarPaqueteMadrid(p), b = materializarPaqueteMadrid(p)
  a.autonomica[1]!.cuota.d[0] = 0
  expect(b.autonomica[1]!.cuota.toFixed()).toBe("2241")
  // El constructor expuesto por la reconstrucción tampoco gobierna otras llamadas.
  // SAFETY: instancia construida por materializarPaqueteMadrid con Decimal.clone local.
  const constructorLocal = a.estatal[0]!.tipo.constructor as Decimal.Constructor
  constructorLocal.set({ precision: 3 })
  expect(materializarPaqueteMadrid(p).estatal[1]!.cuota.toFixed()).toBe("2365.5")
  expect(JSON.stringify(p)).toBe(antes)
  const e = entrada(), r = calcular(e)
  // SAFETY: adversa modifica exclusivamente el original mutable de prueba.
  if (e.ssTrabajador.naturaleza === "efectivas") {
    // SAFETY: sólo original mutable para demostrar aislamiento de la copia.
    const cotizacion = e.ssTrabajador as { importe: string }
    cotizacion.importe = "0"
  }
  expect(r.entrada.ssTrabajador).toMatchObject({ importe: "1000" })
})
it("tabla productiva estatal equivale a la matriz2018 y conserva tipos al escalar", () => {
  const p = parametrosMadrid2018(new D(1)), doble = parametrosMadrid2018(new D(2))
  expect(p.estatal.map(r => [r.baseInferior, r.cuota, new D(r.tipo).toFixed()])).toEqual(matriz[0]!.estatal.rowsLowerQuotaRate.map(r => [r[0],r[1],new D(r[2]!).toFixed()]))
  p.autonomica.forEach((r,i) => {
    expect(doble.autonomica[i]!.baseInferior).toBe(new D(r.baseInferior).mul(2).toFixed())
    expect(doble.autonomica[i]!.cuota).toBe(new D(r.cuota).mul(2).toFixed())
    expect(doble.autonomica[i]!.tipo).toBe(r.tipo)
  })
})
it("rechazo legal de override y fallo tipado de paquete interno ajeno", () => {
  // Entrada original existente, sin inventar cuota esperada ni seleccionar política por ID.
  const original = original2018.cases[0]!.input
  // SAFETY: adversa fuerza entrada excedente para comprobar rechazo del Schema legal.
  const legal = Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...original, parametrosAnaliticosMadrid: parametrosMadrid2018(new D(2)) } as never)))
  expect(Result.isFailure(legal)).toBe(true)
  // La procedencia inválida se rechaza antes de consumir cualquier campo fiscal.
  // SAFETY: paquete ajeno se rechaza antes de acceder al resto de campos omitidos deliberadamente.
  const interna = { ambito: { anio: 2018 }, parametrosAnaliticosMadrid: {} } as EntradaComposicionAnual
  const r = Effect.runSync(Effect.result(componerLiquidacionAnual(interna)))
  expect(Result.isFailure(r)).toBe(true)
})
it("signos de las cuatro ramas, factor común y operaciones inspeccionables", () => {
  const r = calcular(entrada(2025))
  expect(new D(r.I.neto).gte(r.X.neto)).toBe(true)
  expect(new D(r.efectos.Eindex).gte(0)).toBe(true)
  expect(new D(r.Hdecimal.neto).minus(r.I.neto).div(r.factor).toFixed()).toBe(r.efectos.Eley)
  if (r.Hcontractual.estado === "disponible") expect(new D(r.Hcontractual.neto).minus(r.Hdecimal.neto).div(r.factor).toFixed()).toBe(r.efectos.Erepresentacion)
  expect(r.rastro).toHaveLength(27)
  expect(r.rastro.every(l => l.instanceId.length > 0 && l.verificacionAlgoritmo === "pendiente")).toBe(true)
})
