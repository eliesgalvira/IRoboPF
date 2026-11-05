import { Effect } from "effect"
import { expect, it } from "vitest"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { casoUniformeC36, casoExplicitoC36 } from "./c36-conexion-anual.fixtures"
import { derechos, solicitud } from "./f-auxiliares-revision-fixtures"

for (const api of ["uniforme", "explicita"] as const) {
  for (const escenario of ["padre_y_abuelo", "nieto_en_unidad"] as const) {
    it(`${api}: concilia hijos y progenitores en ${escenario}`, () => {
      const d = derechos("madrid", escenario === "padre_y_abuelo", api === "uniforme" ? 2605600 : 2800000)
      const s = solicitud("madrid")
      const hijo = d.descendientes[0]!
      const auxiliares = s.auxiliares!
      const grafo = {
        ...d,
        descendientes: escenario === "padre_y_abuelo"
          ? [{ ...hijo, titulares: hijo.titulares.map(t => ({ ...t, grado: t.titularId === "s-1" ? 1 : 2 })) }]
          : [hijo, {
              ...hijo, sujetoId: "s-4", fechaNacimiento: "2020-02-01", edadDevengo: 5,
              titulares: hijo.titulares.map(t => ({ ...t, grado: 2 })),
            }],
      }
      const peticion = {
        ...s,
        auxiliares: { ...auxiliares, miembrosUnidad: escenario === "nieto_en_unidad" ? ["s-1", "s-2", "s-4"] : auxiliares.miembrosUnidad },
      }
      const r = api === "uniforme"
        ? Effect.runSync(Effect.result(liquidarIrpfAnual({
            ...casoUniformeC36(), comunidadAutonoma: "madrid", derechosMinimos: grafo,
            deduccionesTerritoriales2025: { solicitudes: [peticion] },
          }, { modo: "canonico" })))
        : Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({
            ...casoExplicitoC36([]), comunidadAutonoma: "madrid", familiaresConDerechoMinimo: "segun-derechos",
            derechosMinimos: grafo, deduccionesTerritoriales2025: { solicitudes: [peticion] },
          })))
      if (escenario === "nieto_en_unidad") {
        expect(r._tag).toBe("Failure")
        if (r._tag === "Success") throw new Error("Unidad familiar contradictoria admitida")
        expect(r.failure).toMatchObject({ _tag: "ResultadoNoSoportado", deduccionesTerritoriales2025: { total: racional("0") } })
      } else {
        expect(r._tag).toBe("Success")
        if (r._tag === "Failure") throw r.failure
        expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional("721.70"))
      }
    })
  }
}
