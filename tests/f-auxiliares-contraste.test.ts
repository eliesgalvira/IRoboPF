import { it, expect } from "vitest"
import { Effect } from "effect"
import { derechos, solicitud } from "./f-auxiliares-revision-fixtures"
import {
  casoUniformeC36,
  casoExplicitoC36,
} from "./c36-conexion-anual.fixtures"
import {
  liquidarIrpfAnual,
  liquidarIrpfAnualExplicito,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
// Oráculos propios. No aceptar cualquier error: exigir libro cero y razón de filiación.
for (const api of ["uniforme", "explicita"] as const) {
  for (const variante of [
    "padre_abuelo_censo_correcto",
    "abuelo_censo_falso",
    "nieto_unidad",
    "adopcion",
    "adopcion_grado2",
    "acogedor_externo",
    "dos_padres",
  ] as const) {
    it(`contraste ${api}: ${variante}`, () => {
      const dos =
        variante === "padre_abuelo_censo_correcto" ||
        variante === "abuelo_censo_falso" ||
        variante === "acogedor_externo" ||
        variante === "dos_padres"
      const d = derechos("madrid", dos, api === "uniforme" ? 2605600 : 2800000)
      const s = solicitud(
        "madrid",
        variante === "abuelo_censo_falso" || variante === "dos_padres"
      )
      const adopta = variante === "adopcion" || variante === "adopcion_grado2"
      const descendientes = d.descendientes.map((h) => ({
        ...h,
        titulares: h.titulares.map((t) => ({
          ...t,
          grado:
            variante === "adopcion_grado2" ||
            (t.titularId === "s-3" &&
              variante !== "dos_padres" &&
              variante !== "acogedor_externo")
              ? 2
              : 1,
          vinculo: adopta
            ? {
                clase: "adopcion" as const,
                fechaInicioIncremento: "2025-02-01",
                fechaConstitucionVinculo: "2025-02-01",
                fundamento: "inscripcion-registro-civil" as const,
                historialCompleto: true as const,
              }
            : variante === "acogedor_externo" && t.titularId === "s-3"
              ? { clase: "guarda-judicial" as const }
              : t.vinculo,
        })),
      }))
      if (variante === "nieto_unidad")
        descendientes.push({
          ...descendientes[0]!,
          sujetoId: "s-4",
          fechaNacimiento: "2020-01-01",
          edadDevengo: 5,
          titulares: descendientes[0]!.titulares.map((t) => ({
            ...t,
            grado: 2,
          })),
        })
      const a = s.auxiliares!
      const peticion = {
        ...s,
        auxiliares: {
          ...a,
          miembrosUnidad:
            variante === "nieto_unidad"
              ? ["s-1", "s-2", "s-4"]
              : a.miembrosUnidad,
          eventos: a.eventos.map((e) => ({
            ...e,
            tipo: adopta ? ("adopcion" as const) : e.tipo,
          })),
        },
      }
      const grafo = { ...d, descendientes }
      const resultado =
        api === "uniforme"
          ? Effect.runSync(
              Effect.result(
                liquidarIrpfAnual(
                  {
                    ...casoUniformeC36(),
                    comunidadAutonoma: "madrid",
                    derechosMinimos: grafo,
                    deduccionesTerritoriales2025: { solicitudes: [peticion] },
                  },
                  { modo: "canonico" }
                )
              )
            )
          : Effect.runSync(
              Effect.result(
                liquidarIrpfAnualExplicito({
                  ...casoExplicitoC36([]),
                  comunidadAutonoma: "madrid",
                  familiaresConDerechoMinimo: "segun-derechos",
                  derechosMinimos: grafo,
                  deduccionesTerritoriales2025: { solicitudes: [peticion] },
                })
              )
            )
      const rechazo =
        variante === "abuelo_censo_falso" ||
        variante === "nieto_unidad" ||
        variante === "adopcion_grado2"
      if (rechazo) {
        expect(resultado._tag).toBe("Failure")
        if (resultado._tag === "Success")
          throw Error("Concedió una liquidación inválida")
        if (variante === "adopcion_grado2") {
          // El productor de mínimos rechaza este grafo antes del libro territorial.
          expect(resultado.failure).toMatchObject({
            _tag: "ResultadoNoSoportado",
          })
          expect(JSON.stringify(resultado.failure)).toContain(
            "Grados de vínculos asimilados o adoptivos superiores a uno pendientes de soporte"
          )
          expect("deduccionesTerritoriales2025" in resultado.failure).toBe(
            false
          )
          return
        }
        expect(resultado.failure).toMatchObject({
          _tag: "ResultadoNoSoportado",
          deduccionesTerritoriales2025: { total: racional("0") },
        })
        expect(JSON.stringify(resultado.failure)).toContain(
          variante === "nieto_unidad"
            ? "auxiliares.filiacion_unidad"
            : "progenitores.convivientesDevengo"
        )
      } else {
        expect(resultado._tag).toBe("Success")
        if (resultado._tag === "Failure") throw resultado.failure
        expect(resultado.success.deduccionesTerritoriales2025?.total).toEqual(
          racional(variante === "dos_padres" ? "360.85" : "721.70")
        )
      }
    })
  }
}
