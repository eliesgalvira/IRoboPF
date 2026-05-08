import { describe, expect, it } from "@effect/vitest"

import { aniosFiscalesLegacy } from "../lib/dominio/normativa/anio-fiscal"
import {
  GASTOS_FIJOS_IRPF_LEGACY,
  METADATOS_ARTICULO_20_LEGACY,
  MINIMO_EXENTO_RETENCION_LEGACY,
  MINIMO_PERSONAL_IRPF_LEGACY,
  obtenerTramosIrpfLegacy,
} from "../lib/dominio/normativa/datos/irpf-estatal-2012-2026"
import { IPC_ANUAL_DICIEMBRE } from "../lib/dominio/normativa/datos/ipc-2012-2026"
import { LIMITE_RETENCION_LEGACY_43_POR_CIENTO } from "../lib/dominio/normativa/datos/irpf-retenciones-2026"
import { BASE_MAXIMA_COTIZACION_LEGACY } from "../lib/dominio/normativa/datos/seguridad-social-2012-2026"

describe("parámetros normativos ejecutables legacy", () => {
  it("declara el periodo legacy 2012-2026", () => {
    expect(aniosFiscalesLegacy).toEqual([
      2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
      2024, 2025, 2026,
    ])
  })

  it("expone IPC y base máxima de cotización usados por el perfil legacy", () => {
    expect(IPC_ANUAL_DICIEMBRE[2026]?.toString()).toBe("0.03")
    expect(BASE_MAXIMA_COTIZACION_LEGACY[2012].toString()).toBe("39150")
    expect(BASE_MAXIMA_COTIZACION_LEGACY[2026].toString()).toBe("61214.4")
  })

  it("expone los parámetros IRPF estatales usados por el perfil legacy", () => {
    expect(MINIMO_EXENTO_RETENCION_LEGACY[2012].toString()).toBe("11162")
    expect(MINIMO_EXENTO_RETENCION_LEGACY[2026].toString()).toBe("15876")
    expect(MINIMO_PERSONAL_IRPF_LEGACY[2012].toString()).toBe("5151")
    expect(MINIMO_PERSONAL_IRPF_LEGACY[2026].toString()).toBe("5550")
    expect(GASTOS_FIJOS_IRPF_LEGACY[2012].toString()).toBe("0")
    expect(GASTOS_FIJOS_IRPF_LEGACY[2026].toString()).toBe("2000")
    expect(obtenerTramosIrpfLegacy(2012)).toHaveLength(7)
    expect(obtenerTramosIrpfLegacy(2026)).toHaveLength(6)
    expect(METADATOS_ARTICULO_20_LEGACY[2018].umbralInferior).toBe(
      "Transitorio"
    )
  })

  it("traza parámetros ejecutables a fuentes normalizadas", () => {
    expect(LIMITE_RETENCION_LEGACY_43_POR_CIENTO.valor.toString()).toBe("0.43")
    expect(LIMITE_RETENCION_LEGACY_43_POR_CIENTO.fuente.referencia).toBe(
      "docs/fuentes/aeat/algoritmo-retenciones-2026.md"
    )
  })
})
