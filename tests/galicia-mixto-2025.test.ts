import { expect, it } from "vitest"
import { Effect } from "effect"
import {
  liquidarIrpfAnual,
  liquidarIrpfAnualExplicito,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { galiciaMixto } from "./galicia-mixto-2025.fixtures"
import oraculos from "./fixtures/galicia-mixto-2025-oraculos.json"

type Caso = ReturnType<typeof galiciaMixto>
const solicitud = (c: Caso) => {
  const s = c.deduccionesTerritoriales2025.solicitudes[0]
  if (
    s?.lote !== "E38" ||
    s.hechos.codigo !== "galicia_alquiler_vivienda_habitual"
  )
    throw new Error("fixture Galicia")
  return { solicitud: s, hechos: s.hechos }
}
const ejecutar = (api: "canonica" | "explicita", c: Caso) =>
  api === "canonica"
    ? liquidarIrpfAnual(c, { modo: "canonico" })
    : liquidarIrpfAnualExplicito(c)

// Oráculos por hechos: amortización anual2400; principal3000 no deducible.
// Art20 usa íntegro laboral menos SS, y otras rentas ANTES de art23.
const frontera = [
  ["8900", "6500", "852.1528", "19397.8472", "300"],
  ["8900.01", "6500.01", "0", "20250.005", "300"],
  ["12400", "10000", "0", "22000", "300"],
  ["12400.01", "10000.01", "0", "22000.005", "0"],
  ["12400.02", "10000.02", "0", "22000.01", "0"],
] as const
for (const api of ["canonica", "explicita"] as const) {
  for (const o of oraculos.casos)
    it(`${api}: oráculo completo ${o.entrada.bruto}/${o.entrada.renta}`, () => {
      const r = Effect.runSync(
        ejecutar(
          api,
          galiciaMixto(o.entrada.bruto, o.entrada.renta, o.entrada.ss)
        )
      )
      const magnitudes = {
        netoTrabajo: r.netoTrabajoArt19,
        art20: r.reduccionArt20,
        laboral: r.netoTrabajoReducido,
        otras: r.otrasRentasAntesReducciones,
        base: r.baseImponibleGeneral,
        estatal: r.composicion.cuotaEstatalDespuesMinimo,
        autonomica: r.composicion.cuotaAutonomicaGeneralDespuesMinimo,
        integra: r.composicion.cuotaGeneralDespuesMinimo,
        alquiler: r.composicion.deduccionesAutonomicasAplicadas,
        liquida: r.composicion.cuotaLiquida,
        da61: r.composicion.deduccionTrabajo,
        diferencial: r.cuotaDiferencial,
      }
      expect(
        Object.fromEntries(
          Object.entries(magnitudes).map(([k, v]) => [k, v.toFixed(12)])
        )
      ).toEqual(o.proyeccion12)
    })
  for (const [renta, otras, art20, base, deduccion] of frontera)
    it(`${api}: frontera ${renta}`, () => {
      const r = Effect.runSync(ejecutar(api, galiciaMixto("20000", renta)))
      expect(r.otrasRentasAntesReducciones.toFixed()).toBe(otras)
      expect(r.netoTrabajoArt19.toFixed()).toBe("17000")
      expect(r.reduccionArt20.toFixed()).toBe(art20)
      expect(r.baseImponibleGeneral.toFixed()).toBe(base)
      expect(r.composicion.deduccionesTerritoriales2025?.total).toEqual({
        numeradorEuros: deduccion,
        divisor: "1",
      })
      expect(
        r.composicion.deduccionesTerritoriales2025?.aplicaciones
      ).toHaveLength(1)
      expect(r.cuotaDiferencial.toFixed()).toBe(
        r.composicion.cuotaPosterior.minus(100).toFixed()
      )
    })
  for (const [renta, reduccion, base, da61] of [
    ["8900", "5293", "11957", "255.2"],
    ["8900.01", "0", "17250.005", "0"],
  ])
    it(`${api}: DA61 y otras rentas ${renta}`, () => {
      const r = Effect.runSync(ejecutar(api, galiciaMixto("17000", renta)))
      expect(r.reduccionArt20.toFixed()).toBe(reduccion)
      expect(r.baseImponibleGeneral.toFixed()).toBe(base)
      expect(r.composicion.deduccionTrabajo.toFixed()).toBe(da61)
    })
  it(`${api}: cuota agotada y art20 no hacen negativo el trabajo`, () => {
    const r = Effect.runSync(ejecutar(api, galiciaMixto("1000", "2400", "0")))
    expect(r.baseImponibleGeneral.toFixed()).toBe("0")
    expect(r.composicion.deduccionTrabajo.toFixed()).toBe("0")
    expect(
      r.composicion.deduccionesTerritoriales2025?.aplicaciones[0]?.generado
    ).toEqual({ numeradorEuros: "300", divisor: "1" })
    expect(r.composicion.deduccionesTerritoriales2025?.total).toEqual({
      numeradorEuros: "0",
      divisor: "1",
    })
    expect(r.cuotaDiferencial.toFixed()).toBe("-100")
  })
  it(`${api}: DA61 conserva la cuota íntegra en el límite proporcional`, () => {
    const r = Effect.runSync(ejecutar(api, galiciaMixto("13902", "8900")))
    // Base6850: estatal123.50 + autonómica95.49 = íntegra218.99.
    // Alquiler consume95.49; líquida123.50. DA61 limita218.99*3600/6850.
    expect(r.baseImponibleGeneral.toFixed()).toBe("6850")
    expect(r.netoTrabajoReducido.toFixed()).toBe("3600")
    expect(r.composicion.cuotaGeneralDespuesMinimo.toFixed()).toBe("218.99")
    expect(r.composicion.cuotaLiquida.toFixed()).toBe("123.5")
    expect(r.composicion.deduccionTrabajo.toDecimalPlaces(12).toFixed(12)).toBe(
      "115.089635036496"
    )
    expect(r.cuotaDiferencial.toDecimalPlaces(12).toFixed(12)).toBe(
      "-91.589635036496"
    )
  })
  const adversas: readonly [string, (c: Caso) => void][] = [
    [
      "persona laboral",
      (c) => Object.assign(c.conciliacion, { contribuyenteId: "OTRO" }),
    ],
    ["año laboral", (c) => Object.assign(c.trabajo, { ejercicio: 2024 })],
    [
      "pensión",
      (c) => Object.assign(c.trabajo.rendimientos[0]!, { clase: "pension" }),
    ],
    [
      "trabajo negativo",
      (c) => Object.assign(c.trabajo.rendimientos[0]!, { integro: "100" }),
    ],
    [
      "cotización estimada",
      (c) =>
        Object.assign(c.trabajo.rendimientos[0]!.cotizaciones, {
          clase: "estimadas",
        }),
    ],
    [
      "doble empleo",
      (c) =>
        Object.assign(c.trabajo, {
          rendimientos: [...c.trabajo.rendimientos, ...c.trabajo.rendimientos],
        }),
    ],
    [
      "censo ajeno",
      (c) => Object.assign(c.censoInmobiliario, { inmuebles: ["AJENO"] }),
    ],
    [
      "titular ajeno",
      (c) => Object.assign(c.inmuebles[0]!, { titular: "OTRO" }),
    ],
    [
      "territorio",
      (c) => Object.assign(c.inmuebles[0]!, { ubicacion: "aragon" }),
    ],
    [
      "contrato antiguo",
      (c) => Object.assign(c.inmuebles[0]!.contrato, { firma: "2023-05-26" }),
    ],
    [
      "temporada",
      (c) => Object.assign(c.inmuebles[0]!.contrato, { destino: "temporada" }),
    ],
    [
      "renta negativa",
      (c) =>
        Object.assign(c.inmuebles[0]!.exigibilidades[0]!, { importe: "1000" }),
    ],
    [
      "retención ajena",
      (c) => Object.assign(c.retenciones[0]!, { contribuyenteId: "OTRO" }),
    ],
    [
      "retención fecha",
      (c) => Object.assign(c.retenciones[0]!, { fecha: "2025-02-30" }),
    ],
    [
      "retención año",
      (c) => Object.assign(c.retenciones[0]!, { ejercicio: 2024 }),
    ],
    [
      "retención repetida",
      (c) =>
        Object.assign(c, { retenciones: [...c.retenciones, ...c.retenciones] }),
    ],
    [
      "operación repetida",
      (c) =>
        Object.assign(c.retenciones[0]!, { id: c.trabajo.rendimientos[0]!.id }),
    ],
    [
      "certificado como renta",
      (c) =>
        Object.assign(c.inmuebles[0]!.exigibilidades[0]!, {
          documento: "CERT-LABORAL",
        }),
    ],
    ["base externa", (c) => Object.assign(c, { baseGeneral: "1000" })],
    ["renta externa", (c) => Object.assign(c, { otrasRentas: "capital" })],
    [
      "solicitud repetida",
      (c) =>
        Object.assign(c.deduccionesTerritoriales2025, {
          solicitudes: [
            ...c.deduccionesTerritoriales2025.solicitudes,
            ...c.deduccionesTerritoriales2025.solicitudes,
          ],
        }),
    ],
    [
      "nacimiento incompatible",
      (c) =>
        Object.assign(solicitud(c).solicitud, { nacimientoContribuyente: "1980-01-01" }),
    ],
    [
      "contrato propio y cedido idéntico",
      (c) =>
        Object.assign(solicitud(c).hechos.contratos[0]!, {
          id: c.inmuebles[0]!.contrato.id,
        }),
    ],
    [
      "arrendador propio",
      (c) =>
        Object.assign(solicitud(c).hechos.contratos[0]!, {
          arrendador: c.contribuyenteId,
        }),
    ],
    [
      "pagador ajeno",
      (c) =>
        Object.assign(solicitud(c).hechos.contratos[0]!.pagos[0]!, {
          pagador: "AJENO",
        }),
    ],
    [
      "inversión omitida",
      (c) => Object.assign(solicitud(c).solicitud, { inversionesViviendaEjercicio: [] }),
    ],
    [
      "certificado como retención",
      (c) => Object.assign(c.retenciones[0]!, { documento: "CERT-LABORAL" }),
    ],
    [
      "hechos anuales incompletos",
      (c) => Object.assign(c, { residenciaTodoElAnio: false }),
    ],
    ["otro ejercicio", (c) => Object.assign(c, { ejercicio: 2026 })],
    [
      "contrato parcial",
      (c) => Object.assign(c.inmuebles[0]!.contrato, { hasta: "2025-06-30" }),
    ],
  ]
  for (const [name, mutate] of adversas)
    it(`${api}: rechaza ${name} antes de importe`, () => {
      const c = galiciaMixto()
      mutate(c)
      const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
      expect(["RechazoP4a", "ResultadoNoSoportado"]).toContain(error._tag)
      expect(error).not.toHaveProperty("cuotaDiferencial")
    })
}
it("ambas API conservan las magnitudes fiscales y pagos", () => {
  const c = galiciaMixto("17000", "8900")
  const valores = (["canonica", "explicita"] as const).map((api) => {
    const r = Effect.runSync(ejecutar(api, c))
    return {
      inmueble: r.inmuebles,
      deducciones: r.composicion.deduccionesTerritoriales2025?.total,
      importes: [
        r.netoTrabajoArt19,
        r.reduccionArt20,
        r.netoTrabajoReducido,
        r.otrasRentasAntesReducciones,
        r.baseImponibleGeneral,
        r.composicion.cuotaGeneralDespuesMinimo,
        r.composicion.cuotaLiquida,
        r.composicion.deduccionTrabajo,
        r.composicion.cuotaPosterior,
        r.retenciones,
        r.cuotaDiferencial,
      ].map((x) => x.toFixed()),
    }
  })
  expect(valores[0]).toEqual(valores[1])
})
