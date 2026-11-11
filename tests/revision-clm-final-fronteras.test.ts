// Pruebas independientes de frontera. Preparadas; NO ejecutadas en GRANT0.
import { expect, it } from "vitest"
import { Effect } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { entrada, ejecutar, sobre, producir, igual, clasico, efectivo } from "./fixtures/revision-clm-final"

function crecimiento24(exacto: boolean) {
  const x = entrada(), p = x.aplicacionViviendaCLM2024.patrimonioHistorico
  p.cortes2024.movimientos[2]!.importe = exacto ? "29999.99" : "30000"
  p.cortes2024.cuentas[0]!.cierre.importe = exacto ? "20000" : "19999.99"
  p.cortes2025.cuentas[0]!.inicio.importe = exacto ? "20000" : "19999.99"
  p.cortes2025.cuentas[0]!.cierre.importe = exacto ? "25000.01" : "25000"
  return x
}
function crecimiento25(exacto: boolean) {
  const x = entrada(), p = x.aplicacionViviendaCLM2024.patrimonioHistorico
  p.cortes2025.movimientos[2]!.importe = exacto ? "20000.01" : "20000.02"
  p.cortes2025.cuentas[0]!.cierre.importe = exacto ? "29999.99" : "29999.98"
  return x
}
function cotizacion25() {
  const x = entrada(), p = x.aplicacionViviendaCLM2024.patrimonioHistorico
  p.cortes2025.salarios[0]!.cotizaciones = "1000"
  p.cortes2025.movimientos[0]!.importe = "24000"
  p.cortes2025.cuentas[0]!.cierre.importe = "34000"
  return x
}
function pago25(fecha: string) {
  const x = entrada(), p = x.aplicacionViviendaCLM2024.patrimonioHistorico
  x.historiaBases.operaciones[1]!.fecha = fecha
  x.historiaBases.operaciones[1]!.documento.fecha = fecha
  x.hechos.pagos[0]!.fecha = fecha
  p.cortes2025.movimientos[1]!.fecha = fecha
  p.cortes2025.movimientos[1]!.documento.fecha = fecha
  return x
}
const rechazos: readonly [string, (x: ReturnType<typeof entrada>) => void, RegExp][] = [
  ["continuidad bancaria con ambas trayectorias aritméticas válidas", x => {
    const e = x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2025
    e.cuentas[0]!.inicio.importe = "30000"; e.cuentas[0]!.cierre.importe = "35000.01"
  }, /continuidad cierre/],
  ["continuidad nominal de entidad", x => {
    x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2025.cuentas[0]!.entidad = "otro-banco"
  }, /continuidad nominal/],
  ["deuda de apertura2025 inventada", x => {
    x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2025.deudaVendedor.inicio.importe = "4999.98"
  }, /deuda inicial/],
  ["certificado2024 con mismo bruto y cotización contradictoria", x => {
    x.aplicacionViviendaCLM2024.certificados[0]!.seguridadSocial = "1"
  }, /certificado nominal contradictorio/],
  ["certificado bancario2024 ajeno al histórico", x => {
    x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2024.salarios[0]!.documento.referencia = "cert-otro"
  }, /salario2024 sin certificado/],
  ["salario2025 certificado por otro titular", x => {
    x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2025.salarios[0]!.titular = "otro"
  }, /salario nominal/],
  ["cobro2025 desde pagador diferente al certificado", x => {
    x.aplicacionViviendaCLM2024.patrimonioHistorico.cortes2025.movimientos[0]!.contraparte = "otro-empleador"
  }, /otro pagador/],
  ["edad del origen fuera del perfil aunque actual sea30", x => {
    x.aplicacionViviendaCLM2024.nacimiento = "1950-01-01"
  }, /nacimiento y edades/],
  ["contrato vendedor documentado después de adquisición", x => {
    x.aplicacionViviendaCLM2024.patrimonioHistorico.adquisicion.precioAplazado.contrato.fecha = "2024-01-03"
  }, /obligación original/],
  ["vencimiento2026 fuera del perfil", x => {
    x.aplicacionViviendaCLM2024.patrimonioHistorico.adquisicion.precioAplazado.vencimiento = "2026-01-01"
  }, /plazo de precio/],
]
for (const api of ["canonica", "explicita"] as const) {
  for (const year of [2024, 2025]) {
    it(api + ": crecimiento exactamente igual a inversión " + year, () => {
      const x = year === 2024 ? crecimiento24(true) : crecimiento25(true)
      const l = producir(x), c = year === 2024 ? l.patrimonioFactual.cortes2024 : l.patrimonioFactual.cortes2025
      expect(c.incremento).toEqual(c.inversion)
      const r = Effect.runSync(ejecutar(api, x))
      igual(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado, "1499997/2000")
    })
    it(api + ": crecimiento un céntimo inferior " + year + " con saldos coherentes", () => {
      const x = year === 2024 ? crecimiento24(false) : crecimiento25(false)
      const r = Effect.runSync(Effect.flip(ejecutar(api, x)))
      expect(r._tag).toBe("ResultadoNoSoportado"); expect(r.motivo).toMatch(/incremento patrimonial factual insuficiente/)
    })
  }
  it(api + ": revalorizaciones opuestas excluidas incluso en umbral exacto", () => {
    const x = crecimiento24(true), p = x.aplicacionViviendaCLM2024.patrimonioHistorico
    p.cortes2024.valorVivienda.importe = "999999"; p.cortes2025.valorVivienda.importe = "1"
    const l = producir(x)
    expect(l.patrimonioFactual.cortes2025.inicial).toEqual(l.patrimonioFactual.cortes2024.final)
    expect(l.patrimonioFactual.cortes2024.incremento).toEqual(l.patrimonioFactual.cortes2024.inversion)
    const r = Effect.runSync(ejecutar(api, x))
    igual(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado, "1499997/2000")
  })
  for (const [nombre, mutar, causa] of rechazos) it(api + ": " + nombre, () => {
    const x = entrada(); mutar(x)
    const r = Effect.runSync(Effect.flip(ejecutar(api, x)))
    expect(r._tag).toBe("ResultadoNoSoportado"); expect("importe" in r).toBe(false)
    expect(r.motivo).toMatch(causa)
  })
  it(api + ": un día después de vencimiento con pagos y documentos conciliados", () => {
    const r = Effect.runSync(Effect.flip(ejecutar(api, pago25("2025-01-03"))))
    expect(r._tag).toBe("ResultadoNoSoportado"); expect(r.motivo).toMatch(/historia\/vendedor\/plazo/)
  })
  it(api + ": pago anterior a vencimiento conserva generación", () => {
    const x = entrada()
    x.aplicacionViviendaCLM2024.patrimonioHistorico.adquisicion.precioAplazado.vencimiento = "2025-01-03"
    const r = Effect.runSync(ejecutar(api, x))
    igual(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado, "1499997/2000")
  })
  it(api + ": salario2025 bruto distinto no lo sustituye el libro favorable", () => {
    const s = sobre({ solicitudes: [entrada()] })
    const e = efectivo(s, "castilla-la-mancha")
    if (e.perfil === "solo-actividad-eds") throw new Error("Fixture debe tener trabajo")
    const op = Effect.gen(function* () {
      if (api === "canonica") return yield* liquidarIrpfAnual({ ...clasico(s,"castilla-la-mancha"), rendimientos: { trabajo: [{ importeIntegroCentimos: 2600000 }] } }, {modo:"canonico"})
      return yield* liquidarIrpfAnualExplicito({ ...e, trabajo: { ...e.trabajo, rendimientos: e.trabajo.rendimientos.map(r => ({ ...r, integro:"26000" })) } })
    })
    const r = Effect.runSync(Effect.flip(op))
    expect(r._tag).toBe("ResultadoNoSoportado"); expect(r.motivo).toMatch(/bruto contradice entrada anual/)
  })
  it(api + ": cotización nominal1000 se acredita por certificado y extracto", () => {
    const s = sobre({ solicitudes: [cotizacion25()] }), e = efectivo(s, "castilla-la-mancha")
    if (e.perfil === "solo-actividad-eds") throw new Error("Fixture debe tener trabajo")
    // La canónica sólo da bruto/retenciones: no comparar1000 con su estimación.
    const op = Effect.gen(function* () {
      if (api === "canonica") return yield* liquidarIrpfAnual(clasico(s,"castilla-la-mancha"),{modo:"canonico"})
      return yield* liquidarIrpfAnualExplicito({ ...e, trabajo: { ...e.trabajo, rendimientos: e.trabajo.rendimientos.map(r => ({ ...r,
        cotizaciones: { clase:"efectivas", seguridadSocial:"1000", derechosPasivos:"0", colegiosHuerfanos:"0" } })) } })
    })
    const r = Effect.runSync(op)
    igual(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado, "1499997/2000")
  })
}
it("explícita: cotización nominal1000 no concilia con efectiva0 aunque coincida el bruto", () => {
  const r = Effect.runSync(Effect.flip(ejecutar("explicita", cotizacion25())))
  expect(r._tag).toBe("ResultadoNoSoportado"); expect(r.motivo).toMatch(/cotizaciones nominales contradictorias/)
})
