import { expect, it } from "vitest"
import { Effect } from "effect"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { censoELA, casoEfectivoELA, solicitudELA } from "./ela-ingreso-2025-fixtures"

it("rebase conserva DA61 del agregado a80 y argumentos P1 de renta real", () => {
  const c = censoELA("4000")
  Object.defineProperty(c.ayudas[0].resolucion, "importeConcedido", { value: "20000" })
  const r = Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoELA(c, solicitudELA(c), "14000", "empleo-laboral")))
  // Oráculo normativo ya conservado:532.43*4698/8698=125067807/434900.
  // <1e-75 discrimina el transporte80 del antiguo60 sin importar sus constantes.
  const observado = racional(r.deduccionTrabajo)
  const diferencia = BigInt(observado.numeradorEuros) * 434900n - 125067807n * BigInt(observado.divisor)
  const error = diferencia < 0n ? -diferencia : diferencia
  expect(error * 10n ** 75n <= 434900n * BigInt(observado.divisor)).toBe(true)
  expect(r.rendimientoNetoReducido).toBe("4698")
  expect(r.baseLiquidableGeneral).toBe("8698")
  expect(r.libroIngresosIdentificados2025?.totalIntegradoGeneral).toEqual(racional("4000"))
})
