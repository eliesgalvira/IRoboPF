import Decimal from "decimal.js"
import { Effect } from "effect"
import { expect, it } from "vitest"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { ambas, controlesSinPagos, fixture } from "./dt18-rioja-fixture"

const fronteras = [
  { consumo: "43900.01", cierre: "1999.99", cumple: false, regional: "0", tramo: "0" },
  { consumo: "43900", cierre: "2000", cumple: true, regional: "610", tramo: "533.75" },
  { consumo: "43899.99", cierre: "2000.01", cumple: true, regional: "610", tramo: "533.75" },
] as const

for (const orden of ["rehabilitacion-primero", "adecuacion-primero"] as const) {
  for (const frontera of fronteras) {
    for (const api of [0, 1] as const) {
      it(`DT18 patrimonio conjunto: ${orden}, cierre ${frontera.cierre}, API ${api}`, () => {
        const solicitud = fixture(["rehabilitacion", "adecuacion"])
        const control = controlesSinPagos(fixture(["rehabilitacion", "adecuacion"]), true)
        const historia = solicitud.viviendaDT182025!
        const consumo = historia.movimientos.find(m => m.id === "CON")!
        Object.assign(consumo, { importe: frontera.consumo })
        Object.assign(historia.cuentas[0]!.cierre, { importe: frontera.cierre })
        if (orden === "adecuacion-primero") {
          Object.assign(solicitud, { solicitudes: [...solicitud.solicitudes].reverse() })
        }
        if (!frontera.cumple) {
          const error = Effect.runSync(Effect.flip(ambas(solicitud, true)[api]!))
          expect(error._tag).toBe("ResultadoNoSoportado")
          expect("motivo" in error && error.motivo).toMatch(/atribución explícita de capital/)
          return
        }
        const liquidacion = Effect.runSync(ambas(solicitud, true)[api]!)
        const territoriales = liquidacion.deduccionesTerritoriales2025
        expect(territoriales).toBeDefined()
        expect(territoriales?.viviendaDT182025?.cumpleCondicionPatrimonial).toBe(frontera.cumple)
        expect(territoriales?.viviendaDT182025?.cuotas?.estatal.total).toEqual(racional(frontera.tramo))
        expect(territoriales?.viviendaDT182025?.cuotas?.autonomica.total).toEqual(racional(frontera.tramo))
        expect(territoriales?.total).toEqual(racional(frontera.regional))
        expect(territoriales?.aplicaciones).toHaveLength(2)
        const sinDeducciones = Effect.runSync(control[api]!)
        const esperada = sinDeducciones.minus(new Decimal(frontera.tramo).times(2)).minus(frontera.regional)
        expect(new Decimal(liquidacion.cuotaLiquidaEuros).eq(esperada)).toBe(true)
      })
    }
  }
}
