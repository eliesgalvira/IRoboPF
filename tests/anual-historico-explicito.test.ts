import { expect, it } from "vitest"
import { Effect, Schema } from "effect"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import referencias from "../docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json"

const base = referencias[1]!.entrada
const entradaHistorica = (ejercicio: number) => ({
  ...base,
  ejercicio,
  devengo: `${ejercicio}-12-31`,
  deducciones: "ninguna",
  trabajo: { ...base.trabajo, ejercicio },
  conciliacion: { ...base.conciliacion, ejercicio },
  retenciones: base.retenciones.map((r) => ({ ...r, ejercicio })),
})
function ejecutarSinGarantia<Entrada extends { readonly ejercicio: number }>(
  entrada: Entrada
) {
  // @ts-expect-error Entrada externa deliberada para comprobar validación runtime.
  return Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(entrada)))
}
it.each([2018, 2019, 2020, 2021, 2022, 2023, 2024])(
  "contrato histórico y pagos efectivos %i",
  (ejercicio) => {
    const entrada = entradaHistorica(ejercicio)
    const copia = structuredClone(entrada)
    const validada = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(entrada)
    const resultado = Effect.runSync(liquidarIrpfAnualExplicito(validada))
    expect(resultado).toMatchObject({
      ejercicio,
      alcance: "individual-madrid-2018-a-2024-hechos-explicitos",
      aceptacionFiscal: "pendiente",
      deduccionTrabajo: "0",
      retenciones: "100",
      rastro: { contexto: { anio: ejercicio } },
    })
    if (validada.perfil !== "solo-trabajo")
      throw new Error("El perfil histórico debe ser trabajo")
    const sinPagos = Effect.runSync(
      liquidarIrpfAnualExplicito({ ...validada, retenciones: [] })
    )
    expect(sinPagos.cuotaPosterior).toBe(resultado.cuotaPosterior)
    expect(sinPagos.retenciones).toBe("0")
    expect(entrada).toEqual(copia)
    const otro = ejercicio === 2018 ? 2019 : 2018
    const invalidas = [
      { ...entrada, devengo: `${otro}-12-31` },
      {
        ...entrada,
        conciliacion: { ...entrada.conciliacion, ejercicio: otro },
      },
      { ...entrada, trabajo: { ...entrada.trabajo, ejercicio: otro } },
      {
        ...entrada,
        retenciones: entrada.retenciones.map((r) => ({
          ...r,
          ejercicio: otro,
        })),
      },
      { ...entrada, comunidadAutonoma: "andalucia" },
      { ...entrada, edad: 65 },
      { ...entrada, deducciones: "solo-da61-si-procede" },
      { ...entrada, familiaresConDerechoMinimo: "segun-derechos" },
      {
        ...entrada,
        trabajo: {
          ...entrada.trabajo,
          rendimientos: entrada.trabajo.rendimientos.map((r) => ({
            ...r,
            clase: "pension",
          })),
        },
      },
    ]
    for (const invalida of invalidas)
      expect(ejecutarSinGarantia(invalida)).toMatchObject({
        _tag: "Failure",
        failure: { _tag: "ResultadoNoSoportado" },
      })
  }
)
it.each([2012, 2017, 2026])("no amplía el contrato a %i", (ejercicio) => {
  expect(ejecutarSinGarantia(entradaHistorica(ejercicio))).toMatchObject({
    _tag: "Failure",
    failure: { _tag: "ResultadoNoSoportado" },
  })
})
it.each(referencias)(
  "conserva el contrato explícito 2025: $id",
  ({ entrada }) => {
    expect(ejecutarSinGarantia(entrada)).toMatchObject({
      _tag: "Success",
      success: {
        ejercicio: 2025,
        alcance: "individual-comun-2025-hechos-explicitos",
        aceptacionFiscal: "pendiente",
      },
    })
  }
)
