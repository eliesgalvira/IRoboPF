import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { DateTime, Effect, Schema } from "effect"
import { efectivo } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion"
import { componerLiquidacionAnual } from "../lib/dominio/irpf/liquidacion/composicion-anual"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"
import {
  obtenerEscalaAutonomicaPublicada,
  MADRID_2022,
  MADRID_2025,
} from "../lib/dominio/irpf/cuotas/escalas-publicadas"
import evidencia from "./fixtures/madrid-series-2018-2024.json"

// El oráculo documental conserva la cuota exacta, sin cuantización intermedia.
// La API histórica usa ahora la política Open revisada: cuatro gravámenes a céntimos.
// No se cambian los importes del fixture para acomodarlos a esa política.
it.each(evidencia.casos)(
  "escala exacta y política Open Madrid $ejercicio, bruto $bruto EUR",
  ({ ejercicio, bruto, cuotaEsperada, presentadaEsperada }) => {
    if (efectivo.perfil !== "solo-trabajo")
      throw new Error("El ejemplo histórico debe conservar el perfil de trabajo")
    const entrada = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)({
      ...efectivo,
      ejercicio,
      devengo: `${ejercicio}-12-31`,
      deducciones: "ninguna",
      conciliacion: { ...efectivo.conciliacion, ejercicio },
      trabajo: {
        ...efectivo.trabajo,
        ejercicio,
        rendimientos: efectivo.trabajo.rendimientos.map((r) => ({
          ...r,
          integro: bruto,
          cotizaciones: { ...r.cotizaciones, seguridadSocial: "0" },
        })),
      },
    })
    const resultado = Effect.runSync(liquidarIrpfAnualExplicito(entrada))
    // Todos los casos documentales tienen SS cero y bruto superior al ámbito
    // del artículo 20: la base se obtiene sólo restando el gasto general de 2.000.
    const base = new Decimal(bruto).minus(2000)
    expect(new Decimal(resultado.baseLiquidableGeneral).eq(base)).toBe(true)
    const exacta = Effect.runSync(componerLiquidacionAnual({
      ambito: {
        anio: entrada.ejercicio,
        comunidadAutonoma: "madrid",
        situacionFamiliar: {
          tipo: "individual",
          edad: entrada.edad,
          discapacidad: { _tag: "SinDiscapacidad" },
          descendientes: [],
          ascendientes: [],
        },
      },
      cotizaciones: { naturaleza: "efectivas", trabajador: new Decimal(0) },
      precision: 80,
      politica: "decimal-hasta-salida",
      baseGeneral: base,
      baseAhorro: new Decimal(0),
      rentasAntesReducciones: base,
      minimosEstatales: MINIMOS_ESTATALES_2025,
      deduccionesAutonomicasCentimos: 0,
    }))
    expect(exacta.cuotaLiquida.eq(cuotaEsperada)).toBe(true)
    expect(exacta.cuotaLiquida.toFixed(2, Decimal.ROUND_HALF_UP)).toBe(presentadaEsperada)
    // Comprueba la selección de política por la API sobre las mismas escalas
    // contrastadas; los pilotos oficiales y su oráculo entero viven en otra suite.
    const centimos = (importe: Decimal) => importe.toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
    const porGravamen = centimos(exacta.cuotaIntegraGeneralEstatal)
      .plus(centimos(exacta.cuotaIntegraGeneralAutonomica))
      .minus(centimos(exacta.cuotaMinimoPersonalEstatal))
      .minus(centimos(exacta.cuotaMinimoPersonalAutonomica))
    expect(new Decimal(resultado.cuotaLiquidaLegal).eq(porGravamen)).toBe(true)
    expect(resultado.cuotaDiferencialPresentada).toBe(porGravamen.toFixed(2))
  }
)
it.each([2018, 2019, 2020, 2021, 2023, 2024] as const)(
  "no amplía a fallecimientos la selección nueva de %s",
  (anio) => {
    expect(
      obtenerEscalaAutonomicaPublicada({
        anio,
        comunidadAutonoma: "madrid",
        fechaFallecimiento: DateTime.toDateUtc(
          DateTime.makeUnsafe(`${anio}-06-30T00:00:00Z`)
        ),
      })
    ).toBeUndefined()
  }
)
it("conserva las selecciones vecinas y las referencias de 2025", () => {
  expect(
    obtenerEscalaAutonomicaPublicada({
      anio: 2017,
      comunidadAutonoma: "madrid",
    })
  ).toBeUndefined()
  expect(
    obtenerEscalaAutonomicaPublicada({
      anio: 2022,
      comunidadAutonoma: "madrid",
    })
  ).toBe(MADRID_2022)
  expect(
    obtenerEscalaAutonomicaPublicada({
      anio: 2025,
      comunidadAutonoma: "madrid",
    })
  ).toBe(MADRID_2025)
})
