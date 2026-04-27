import type Decimal from "decimal.js"

import type { AnioFiscal } from "../../normativa/anio-fiscal"
import { MINIMO_PERSONAL_IRPF_LEGACY } from "../../normativa/datos/irpf-estatal-2012-2026"

export const obtenerMinimoContribuyente = (anio: AnioFiscal): Decimal =>
  MINIMO_PERSONAL_IRPF_LEGACY[anio]
