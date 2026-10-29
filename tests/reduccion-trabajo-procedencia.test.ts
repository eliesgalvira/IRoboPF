import { describe, expect, it } from "@effect/vitest"
import Decimal from "decimal.js"

import { calcularReduccionTrabajoConOtrasRentas } from "../lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo"
import type { AnioFiscal } from "../lib/dominio/normativa/anio-fiscal"

describe("TDE-18: extremo excluido del artículo 20", () => {
  it.each<AnioFiscal>([2024, 2025, 2026])(
    "no reduce desde 19747,50 en %s",
    (anio) => {
      expect(
        calcularReduccionTrabajoConOtrasRentas({
          anio,
          rendimientoPrevioNeto: new Decimal("19747.50"),
          otrasRentasNoExentas: new Decimal(0),
        }).toString()
      ).toBe("0")
      expect(
        calcularReduccionTrabajoConOtrasRentas({
          anio,
          rendimientoPrevioNeto: new Decimal("19747.51"),
          otrasRentasNoExentas: new Decimal(0),
        }).toString()
      ).toBe("0")
      expect(
        calcularReduccionTrabajoConOtrasRentas({
          anio,
          rendimientoPrevioNeto: new Decimal("19747.49"),
          otrasRentasNoExentas: new Decimal(0),
        }).toString()
      ).toBe("0.0142")
    }
  )
})
