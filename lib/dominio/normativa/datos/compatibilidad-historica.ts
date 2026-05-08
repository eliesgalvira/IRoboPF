import type Decimal from "decimal.js"
import { Match, Option } from "effect"

import {
  IMPORTE_CERO,
  crearImporteMonetario,
} from "../../dinero/importe-monetario"
import type { AnioFiscal } from "../anio-fiscal"
import {
  fuenteAeatManualRenta2025Parte1,
  fuenteAeatRetenciones2026,
} from "../fuente-normativa"
import type { MedidaNormativaComputable } from "../medida-normativa"
import { LIMITE_RETENCION_LEGACY_43_POR_CIENTO } from "./irpf-retenciones-2026"
import { MINIMO_EXENTO_RETENCION_LEGACY } from "./irpf-estatal-2012-2026"

type PoliticaDeduccionObtencionRendimientosTrabajo = (bruto: Decimal) => Decimal

export interface EspecificacionCompatibilidadHistorica {
  readonly anio: AnioFiscal
  readonly minimoExentoRetencion: Decimal
  readonly tipoMaximoRetencionNomina: Decimal
  readonly deduccionObtencionRendimientosTrabajo: PoliticaDeduccionObtencionRendimientosTrabajo
  readonly medidas: ReadonlyArray<MedidaNormativaComputable>
}

const importe = crearImporteMonetario

const maximo = (a: Decimal, b: Decimal): Decimal =>
  Match.value(a.greaterThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  )

const sinDeduccionObtencionRendimientosTrabajo = () => IMPORTE_CERO

export const medidaDeduccionObtencionRendimientosTrabajo2025 = {
  id: "irpf-2025-deduccion-obtencion-rendimientos-trabajo-smi",
  tipo: "deduccion_estatal",
  nombre: "Deducción por obtención de rendimientos del trabajo 2025",
  anioIntroduccion: 2025,
  fuentes: [fuenteAeatManualRenta2025Parte1],
} as const satisfies MedidaNormativaComputable

export const medidaDeduccionObtencionRendimientosTrabajo2026 = {
  id: "irpf-2026-deduccion-obtencion-rendimientos-trabajo-smi",
  tipo: "deduccion_estatal",
  nombre: "Deducción por obtención de rendimientos del trabajo 2026",
  anioIntroduccion: 2026,
  fuentes: [fuenteAeatRetenciones2026],
} as const satisfies MedidaNormativaComputable

export const medidaLimiteRetencionCompatibilidadHistorica43PorCiento = {
  id: "irpf-compatibilidad-historica-limite-retencion-43-por-ciento",
  tipo: "limite_retencion",
  nombre: "Límite final de retención del 43 por ciento",
  anioIntroduccion: 2012,
  fuentes: [LIMITE_RETENCION_LEGACY_43_POR_CIENTO.fuente],
} as const satisfies MedidaNormativaComputable

const deduccionObtencionRendimientosTrabajo2025: PoliticaDeduccionObtencionRendimientosTrabajo =
  (bruto) =>
    Match.value(bruto).pipe(
      Match.when(
        (bruto) => bruto.lte(16576),
        () => importe(340)
      ),
      Match.when(
        (bruto) => bruto.lte(18276),
        (bruto) =>
          maximo(
            IMPORTE_CERO,
            importe(340).minus(importe("0.20").mul(bruto.minus(16576)))
          )
      ),
      Match.orElse(() => IMPORTE_CERO)
    )

const deduccionObtencionRendimientosTrabajo2026: PoliticaDeduccionObtencionRendimientosTrabajo =
  (bruto) =>
    Match.value(bruto).pipe(
      Match.when(
        (bruto) => bruto.lte(17094),
        () => importe("590.89")
      ),
      Match.orElse((bruto) =>
        maximo(
          IMPORTE_CERO,
          importe("590.89").minus(importe("0.20").mul(bruto.minus(17094)))
        )
      )
    )

export const obtenerMedidaDeduccionObtencionRendimientosTrabajo = (
  anio: AnioFiscal
): Option.Option<MedidaNormativaComputable> =>
  Match.value(anio).pipe(
    Match.when(2025, () =>
      Option.some(medidaDeduccionObtencionRendimientosTrabajo2025)
    ),
    Match.when(2026, () =>
      Option.some(medidaDeduccionObtencionRendimientosTrabajo2026)
    ),
    Match.orElse(() => Option.none())
  )

export const obtenerDeduccionObtencionRendimientosTrabajoCompatibilidadHistorica =
  (anio: AnioFiscal): PoliticaDeduccionObtencionRendimientosTrabajo =>
    Match.value(anio).pipe(
      Match.when(2025, () => deduccionObtencionRendimientosTrabajo2025),
      Match.when(2026, () => deduccionObtencionRendimientosTrabajo2026),
      Match.orElse(() => sinDeduccionObtencionRendimientosTrabajo)
    )

export const obtenerEspecificacionCompatibilidadHistorica = (
  anio: AnioFiscal
): EspecificacionCompatibilidadHistorica => {
  const medidaDeduccion =
    obtenerMedidaDeduccionObtencionRendimientosTrabajo(anio)

  return {
    anio,
    minimoExentoRetencion: MINIMO_EXENTO_RETENCION_LEGACY[anio],
    tipoMaximoRetencionNomina: LIMITE_RETENCION_LEGACY_43_POR_CIENTO.valor,
    deduccionObtencionRendimientosTrabajo:
      obtenerDeduccionObtencionRendimientosTrabajoCompatibilidadHistorica(anio),
    medidas: [
      medidaLimiteRetencionCompatibilidadHistorica43PorCiento,
      ...Option.match(medidaDeduccion, {
        onNone: () => [],
        onSome: (medida) => [medida],
      }),
    ],
  }
}
