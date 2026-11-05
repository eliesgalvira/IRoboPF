import { expect, it } from "vitest"
import { Effect } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { censoELA, solicitudELA, casoEfectivoELA, casoCanonicoELA } from "./ela-ingreso-2025-fixtures"

it("cobro4000 con concesión20000 conserva art20, DA61 y tipos del ingreso real efectivo", () => {
  const c = censoELA("4000")
  const sinDiferencia = Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoELA(c, solicitudELA(c), "14000", "empleo-laboral")))
  Object.defineProperty(c.ayudas[0].resolucion, "importeConcedido", { value: "20000" })
  const r = Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoELA(c, solicitudELA(c), "14000", "empleo-laboral")))
  // Trabajo:14000-2000-7302=4698. BIG/BLG=8698. Estatal8698*.095-527.25=299.06;
  // Asturias8698*.09-549.45=233.37. Tipos truncados3.43/2.68; generación244.4.
  expect(r.reduccionArt20).toBe("7302")
  expect(r.rendimientoNetoReducido).toBe("4698")
  expect(r.baseLiquidableGeneral).toBe("8698")
  expect(r.nodosFiscalesB2025?.tiposMediosGenerales).toMatchObject({ estatal: "3.43", autonomico: "2.68", cuotaGeneralEstatalArt63_1: "299.06", cuotaGeneralAutonomicaArt74_1: "233.37" })
  expect(r.deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual(racional("244.4"))
  expect(r.deduccionTrabajo).toBe(sinDiferencia.deduccionTrabajo)
  // DA61 legal340; límite299.06*4698/8698=35124597/217450, oráculo Fraction.
  // Compara contra esa fracción, tolerando sólo el transporte periódico60/80.
  const observado = racional(r.deduccionTrabajo)
  const diferencia = BigInt(observado.numeradorEuros) * 217450n - 35124597n * BigInt(observado.divisor)
  const errorAbsoluto = diferencia < 0n ? -diferencia : diferencia
  expect(errorAbsoluto * 10n ** 55n <= 217450n * BigInt(observado.divisor)).toBe(true)
})
it("concesión20000 y sólo6500.01 cobrados anula DA61 y artículo20 por renta real", () => {
  const c = censoELA("6500.01")
  Object.defineProperty(c.ayudas[0].resolucion, "importeConcedido", { value: "20000" })
  const r = Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoELA(c, { solicitudes: [] }, "14000", "empleo-laboral")))
  expect(r.reduccionArt20).toBe("0")
  expect(r.deduccionTrabajo).toBe("0")
  expect(r.baseLiquidableGeneral).toBe("18500.01")
})
it("concesión distinta con idénticos cobros no modifica art20 ni tipos canónicos", () => {
  const c = censoELA("4000")
  const entrada = { ...casoCanonicoELA(c), rendimientos: { trabajo: [{ importeIntegroCentimos: 1400000 }] } }
  const inicial = Effect.runSync(liquidarIrpfAnual(entrada, { modo: "canonico" }))
  Object.defineProperty(c.ayudas[0].resolucion, "importeConcedido", { value: "20000" })
  const r = Effect.runSync(liquidarIrpfAnual({ ...entrada, deduccionesTerritoriales2025: solicitudELA(c) }, { modo: "canonico" }))
  expect(r.reduccionRendimientosTrabajoCentimos).toBe(730200)
  expect(r.baseImponibleGeneralCentimos).toBe(inicial.baseImponibleGeneralCentimos)
  expect(r.nodosFiscalesB2025).toEqual(inicial.nodosFiscalesB2025)
  expect(r.libroIngresosIdentificados2025?.totalIntegradoGeneral).toEqual(racional("4000"))
})
