import Decimal from "decimal.js"
import { Effect } from "effect"
import { expect, it } from "vitest"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { clasica, explicita, censo } from "./productores-anuales-fixtures"
import { hechos81 } from "./maternidad-guarderia-fixtures"

function casoClasico(maternidad: boolean, donativo: boolean, anticipo = false) {
  const h = hechos81()
  const base = clasica(maternidad ? h : undefined)
  return {
    ...base,
    comunidadAutonoma: "murcia" as const,
    derechosMinimos: base.derechosMinimos === undefined ? undefined : { ...base.derechosMinimos, territorio: "murcia" as const },
    maternidad2025: !maternidad ? undefined : {
      ...h,
      hijos: h.hijos.map(n => ({ ...n, anticipos140: anticipo ? [{ id: "anticipo-combinado", beneficiaria: "s-1", fechaCobro: "2025-02-01", periodo: "2025-01-01", importe: "100" }] : [] })),
    },
    deduccionesTerritoriales2025: donativo ? { solicitudes: [], donativosEstatales2025: censo() } : undefined,
  }
}

function casoExplicito(maternidad: boolean, donativo: boolean, anticipo = false) {
  const base = explicita(undefined)
  if (base.derechosMinimos === undefined) throw new Error("Fixture de mínimos ausente")
  return {
    ...base,
    comunidadAutonoma: "murcia" as const,
    derechosMinimos: { ...base.derechosMinimos, territorio: "murcia" as const },
    maternidad2025: casoClasico(maternidad, donativo, anticipo).maternidad2025,
    deduccionesTerritoriales2025: donativo ? { solicitudes: [], donativosEstatales2025: censo() } : { solicitudes: [] },
  }
}

for (const api of ["clasica", "explicita"] as const) {
  it(api + ": donativo 300 genera 220 antes del ajuste 1200+1000 del art. 81", () => {
    if (api === "clasica") {
      const base = Effect.runSync(liquidarIrpfAnual(casoClasico(false, false), { modo: "canonico" }))
      const donativo = Effect.runSync(liquidarIrpfAnual(casoClasico(false, true), { modo: "canonico" }))
      const ambas = Effect.runSync(liquidarIrpfAnual(casoClasico(true, true), { modo: "canonico" }))
      expect(donativo.cuotaLiquidaCentimos).toBe(base.cuotaLiquidaCentimos - 22000)
      expect(ambas.cuotaLiquidaCentimos).toBe(donativo.cuotaLiquidaCentimos)
      expect(ambas.cuotaDiferencialCentimos).toBe(base.cuotaDiferencialCentimos - 242000)
    } else {
      const base = Effect.runSync(liquidarIrpfAnualExplicito(casoExplicito(false, false)))
      const donativo = Effect.runSync(liquidarIrpfAnualExplicito(casoExplicito(false, true)))
      const ambas = Effect.runSync(liquidarIrpfAnualExplicito(casoExplicito(true, true)))
      expect(new Decimal(donativo.cuotaLiquidaLegal).minus(base.cuotaLiquidaLegal).toString()).toBe("-220")
      expect(ambas.cuotaLiquidaLegal).toBe(donativo.cuotaLiquidaLegal)
      expect(new Decimal(ambas.cuotaDiferencial).minus(base.cuotaDiferencial).toString()).toBe("-2420")
    }
  })
  it(api + ": el anticipo 140 suma 100 una sola vez, sin alterar la cuota líquida", () => {
    if (api === "clasica") {
      const a = Effect.runSync(liquidarIrpfAnual(casoClasico(true, true), { modo: "canonico" }))
      const b = Effect.runSync(liquidarIrpfAnual(casoClasico(true, true, true), { modo: "canonico" }))
      expect(b.cuotaLiquidaCentimos).toBe(a.cuotaLiquidaCentimos)
      expect(b.cuotaDiferencialCentimos - a.cuotaDiferencialCentimos).toBe(10000)
    } else {
      const a = Effect.runSync(liquidarIrpfAnualExplicito(casoExplicito(true, true)))
      const b = Effect.runSync(liquidarIrpfAnualExplicito(casoExplicito(true, true, true)))
      expect(b.cuotaLiquidaLegal).toBe(a.cuotaLiquidaLegal)
      expect(new Decimal(b.cuotaDiferencial).minus(a.cuotaDiferencial).toString()).toBe("100")
    }
  })
  it(api + ": CyL más donativos conserva el rechazo territorial, sin ampliar el alcance", () => {
    const solicitudes = [{ lote: "CYL81" as const, codigo: "cyl_cuidado_hijos_menores" as const, hechos: { hijo: "s-2", eleccion: "centro" as const } }]
    const error = api === "clasica"
      ? Effect.runSync(Effect.flip(liquidarIrpfAnual({ ...clasica(hechos81()), deduccionesTerritoriales2025: { solicitudes, donativosEstatales2025: censo() } }, { modo: "canonico" })))
      : Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito({ ...explicita(hechos81()), deduccionesTerritoriales2025: { solicitudes, donativosEstatales2025: censo() } })))
    expect(error._tag).toBe("ResultadoNoSoportado")
    expect(error.motivo).toMatch(/donativos|Donativos/)
  })
  it.each(["pago", "factura"] as const)(api + ": no reutiliza %s de guardería como donativo", identidad => {
    const donativos = censo()
    const primera = donativos.operaciones68_3[0]
    if (primera === undefined) throw new Error("Fixture de donativo ausente")
    const operacion = { ...primera, pago: identidad === "pago" ? { ...primera.pago, id: "pago1" } : { ...primera.pago, documento: "factura1" } }
    const repetido = { ...donativos, operaciones68_3: [operacion] }
    const solicitud = { solicitudes: [], donativosEstatales2025: repetido }
    const error = api === "clasica"
      ? Effect.runSync(Effect.flip(liquidarIrpfAnual({ ...casoClasico(true, false), deduccionesTerritoriales2025: solicitud }, { modo: "canonico" })))
      : Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito({ ...casoExplicito(true, false), deduccionesTerritoriales2025: solicitud })))
    expect(error._tag).toBe("ResultadoNoSoportado")
    expect(error.motivo).toMatch(/repetid|reutiliz|duplicad/)
  })
  it.each(["operacion-pago", "operacion-factura", "pago-factura", "documento-pago"] as const)(api + ": distingue las clases de identidad %s", clase => {
    const donativos = censo(), primera = donativos.operaciones68_3[0]
    if (primera === undefined) throw new Error("Fixture de donativo ausente")
    const id = clase === "operacion-pago" ? "pago1" : "factura1"
    const operacion = clase.startsWith("operacion-")
      ? { ...primera, operacionId: id, pago: { ...primera.pago, operacionId: id }, certificado: { ...primera.certificado, operacionId: id } }
      : { ...primera, pago: clase === "pago-factura" ? { ...primera.pago, id: "factura1" } : { ...primera.pago, documento: "pago1" } }
    const solicitud = { solicitudes: [], donativosEstatales2025: { ...donativos, operaciones68_3: [operacion] } }
    if (api === "clasica") {
      const esperado = Effect.runSync(liquidarIrpfAnual(casoClasico(true, true), { modo: "canonico" }))
      const actual = Effect.runSync(liquidarIrpfAnual({ ...casoClasico(true, false), deduccionesTerritoriales2025: solicitud }, { modo: "canonico" }))
      expect(actual.cuotaDiferencialCentimos).toBe(esperado.cuotaDiferencialCentimos)
    } else {
      const esperado = Effect.runSync(liquidarIrpfAnualExplicito(casoExplicito(true, true)))
      const actual = Effect.runSync(liquidarIrpfAnualExplicito({ ...casoExplicito(true, false), deduccionesTerritoriales2025: solicitud }))
      expect(actual.cuotaDiferencial).toBe(esperado.cuotaDiferencial)
    }
  })
}
