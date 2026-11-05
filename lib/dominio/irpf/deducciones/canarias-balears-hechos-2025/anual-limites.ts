import type { Racional } from "../anual-territorial-racional"
import { racional } from "../anual-territorial-racional"
import {
  RacionalC,
  enteroC,
  comprobar,
  type LimiteComposicionC,
} from "./ampliacion-comun"

/** Restricciones legales sobre candidatos, sin consumir una segunda cuota.
 * Recibe el orden experto, con nacimiento/adopción ya priorizados por la API.
 * La cuota global se consume exactamente una vez en consumirCuota del anual. */
export function limitarCandidatosC36(
  importes: readonly Racional[],
  restricciones: readonly (readonly LimiteComposicionC[])[],
  cuota: Racional
) {
  comprobar(
    importes.length === restricciones.length,
    "C36: restricciones sin candidato identificado"
  )
  const leer = (q: Racional) =>
    new RacionalC(BigInt(q.numeradorEuros), BigInt(q.divisor))
  const salir = (q: RacionalC) => racional(q.n.toString(), q.d.toString())
  const integra = leer(cuota)
  comprobar(integra.n >= 0n, "C36: cuota anual negativa")
  let grupo = integra.por(enteroC(15)).dividir(enteroC(100))
  const codigos = new Map<string, RacionalC>()
  const ajustes = importes.map((importe, i) => {
    const original = leer(importe)
    let limitado = original
    const rs = restricciones[i]
    for (const r of rs) {
      if (r.grupo !== "limite_codigo") continue
      comprobar(
        /^(?:5|10|15|40|50)$/.test(r.porcentaje),
        "C36: porcentaje por código no reconocido"
      )
      const disponible =
        codigos.get(r.codigo) ??
        integra.por(enteroC(Number(r.porcentaje))).dividir(enteroC(100))
      limitado = limitado.minimo(disponible)
    }
    const afecta = rs.some((r) => r.grupo === "canarias_arts6_14_14bis_14ter")
    if (afecta) limitado = limitado.minimo(grupo)
    if (afecta) grupo = grupo.restar(limitado)
    for (const r of rs)
      if (r.grupo === "limite_codigo") {
        const disponible =
          codigos.get(r.codigo) ??
          integra.por(enteroC(Number(r.porcentaje))).dividir(enteroC(100))
        codigos.set(r.codigo, disponible.restar(limitado))
      }
    return {
      original: importe,
      trasLimites: salir(limitado),
      limitadoPorNorma: salir(original.restar(limitado)),
      restricciones: rs,
    }
  })
  return {
    importes: ajustes.map((a) => a.trasLimites),
    ajustes,
    grupoCanarioRestante: salir(grupo),
  }
}
