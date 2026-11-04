import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { calcularReduccionTrabajoConOtrasRentas } from "../lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo"
import oficiales from "../docs/procedencia/simuladores/c300/art20-oficial.json"

it.each(oficiales.cases)(
  "C300 artículo 20 y propagación exacta: $id",
  ({ entrada, casillas }) => {
    const r = Effect.runSync(
      liquidarIrpfAnualExplicito(
        Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(entrada)
      )
    )
    const actual = {
      "0023": r.reduccionArt20,
      "0025": r.rendimientoNetoReducido,
      "0500": r.baseImponibleGeneral,
      "0505": r.baseLiquidableGeneral,
      "0414": r.deduccionTrabajo,
      "0528": r.componentesCuota.gravamenEstatal,
      "0529": r.componentesCuota.gravamenAutonomico,
      "0530": r.componentesCuota.gravamenMinimoEstatal,
      "0531": r.componentesCuota.gravamenMinimoAutonomico,
      "0532": r.componentesCuota.cuotaEstatal,
      "0533": r.componentesCuota.cuotaAutonomica,
      "0595": r.cuotaPosterior,
      "0610": r.cuotaDiferencial,
      "0670": r.cuotaDiferencialPresentada,
    }
    const porCasilla = new Map(Object.entries(actual))
    for (const [box, expected] of Object.entries(casillas)) {
      // La ausencia oficial no se interpreta como cero ni como coincidencia.
      if (expected !== null) {
        const importe = porCasilla.get(box)
        if (importe === undefined) throw new Error(`Casilla no proyectada: ${box}`)
        expect.soft(new Decimal(importe).eq(expected), box).toBe(true)
      }
    }
  }
)

it.each([2024, 2025, 2026] as const)(
  "artículo 20 decimal sin compatibilidad conserva su precisión en %i",
  (anio) => {
    const r = calcularReduccionTrabajoConOtrasRentas({
      anio,
      rendimientoPrevioNeto: new Decimal("15876.02"),
      otrasRentasNoExentas: new Decimal(0),
    })
    expect(r.toFixed()).toBe("5509.965")
  }
)

it.each([
  ["19747.49", "0.01", "17747.48"],
  ["17673.52", "2364.34", "13309.18"],
] as const)(
  "acumulados grandes conservan el neto exacto %s",
  (neto, reduccion, base) => {
    const original = oficiales.cases.find((r) => r.id === "c300-016")!.entrada
    const rendimiento = original.trabajo.rendimientos[0]
    const entrada = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)({
      ...original,
      retenciones: [],
      trabajo: {
        ...original.trabajo,
        rendimientos: Array.from({ length: 100 }, (_, i) => ({
          ...rendimiento,
          id: `r-${i}`,
          integro: "900000000000",
          cotizaciones: {
            ...rendimiento.cotizaciones,
            seguridadSocial:
              i === 0
                ? new Decimal("900000000000").minus(neto).toFixed(2)
                : "900000000000",
          },
        })),
      },
    })
    const r = Effect.runSync(liquidarIrpfAnualExplicito(entrada))
    expect(r.reduccionArt20).toBe(reduccion)
    expect(r.rendimientoNetoReducido).toBe(base)
    expect(r.baseImponibleGeneral).toBe(base)
  }
)

it.each(["pension", "otra-comunidad"] as const)(
  "la compatibilidad Open no alcanza %s",
  (variante) => {
    const original = oficiales.cases.find((r) => r.id === "c300-016")!.entrada
    const entrada = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)({
      ...original,
      comunidadAutonoma: variante === "otra-comunidad" ? "andalucia" : "madrid",
      trabajo: {
        ...original.trabajo,
        rendimientos: original.trabajo.rendimientos.map((r) => ({
          ...r,
          clase: variante === "pension" ? "pension" : r.clase,
        })),
      },
    })
    const r = Effect.runSync(liquidarIrpfAnualExplicito(entrada))
    expect(r.reduccionArt20).toBe("5509.965")
  }
)

it.each([
  [2018, "711.735"],
  [2019, "1423.47"],
  [2023, "4413.4872"],
  [2024, "5509.965"],
] as const)(
  "empleo histórico %i conserva la reducción decimal",
  (ejercicio, esperado) => {
    const original = oficiales.cases.find((r) => r.id === "c300-016")!.entrada
    const entrada = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)({
      ...original,
      ejercicio,
      devengo: `${ejercicio}-12-31`,
      deducciones: "ninguna",
      trabajo: { ...original.trabajo, ejercicio },
      conciliacion: { ...original.conciliacion, ejercicio },
      retenciones: original.retenciones.map((r) => ({ ...r, ejercicio })),
    })
    const r = Effect.runSync(liquidarIrpfAnualExplicito(entrada))
    expect(r.reduccionArt20).toBe(esperado)
  }
)
