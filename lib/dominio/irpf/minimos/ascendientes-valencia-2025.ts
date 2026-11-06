import type { SolicitudDeduccionesValencianasAnual2025 } from "../deducciones/valenciana-2025/anual"
import type { DerechosMinimosAnuales } from "./derechos-contrato"
import { producirAscendientes2025 } from "./ascendientes-2025"

/** Traduce hechos del censo al evaluador publicado; jamás recibe magnitudes fiscales. */
export function prepararAscendientesValencianos2025(s: SolicitudDeduccionesValencianasAnual2025, derechos: DerechosMinimosAnuales | undefined): SolicitudDeduccionesValencianasAnual2025 {
  const codigo = "valenciana_ascendientes_mayores_discapacidad"
  if (!s.solicitudes.some(p => p.codigo === codigo && p.eleccion === "aplicar")) return s
  if (derechos === undefined || derechos.ascendientes === "ninguno") throw new RangeError("Valencia: falta censo anual de ascendientes")
  const libro = producirAscendientes2025(derechos.ascendientes, s.contribuyente, s.territorio)
  const usados = new Set<string>()
  const solicitudes = s.solicitudes.map(p => {
    if (p.codigo !== codigo || p.eleccion !== "aplicar") return p
    return { ...p, unidades: p.unidades.map(u => {
      const refs = p.referencias.filter(r => r.unidad === u.id)
      if (refs.length !== 1 || refs[0]!.sujetos.length !== 1) throw new RangeError("Valencia: una identidad por unidad de ascendiente")
      const id = refs[0]!.sujetos[0]!
      const a = libro.find(a => a.sujetoId === id)
      if (a === undefined || usados.has(id)) throw new RangeError("Valencia: ascendiente duplicado o ajeno al censo")
      usados.add(id)
      if (Object.keys(u.numeros).length > 0 || Object.keys(u.textos).length > 0 || u.titulares.length > 0) throw new RangeError("Valencia: edad, discapacidad, rentas, convivencia y titulares proceden del censo; deje vacíos numeros/textos/titulares")
      if (a.renta.isNegative() || !a.renta.eq(a.renta.toNumber())) throw new RangeError("Valencia: renta no representable sin pérdida en el evaluador publicado")
      const posibles = a.titularesCalculados.filter(t => t.residenteIrpf && t.dias >= 183 && t.declaracion === "individual" && t.base.lte(30000))
      const grado = Math.min(...posibles.map(t => t.grado))
      const cercanos = posibles.filter(t => t.grado === grado)
      const siguientes = posibles.filter(t => t.grado > grado)
      if (new Set(posibles.map(t => t.grado)).size > 2 || (siguientes.length > 0 && cercanos.some(t => t.renta.lte(8000)) && cercanos.some(t => t.renta.gt(8000)))) throw new RangeError("Valencia: concurrencia de grados no representada")
      const titulares = (siguientes.length > 0 && cercanos.every(t => t.renta.lte(8000)) ? siguientes : cercanos).map(t => t.titularId)
      const dias = a.titularesCalculados.find(t => t.titularId === s.contribuyente)!.dias
      // El evaluador exige lista no vacía incluso para exclusión. Si no hay derecho propio,
      // se omite la unidad; el consumidor de cuota sigue recibiendo la solicitud completa.
      if (!titulares.includes(s.contribuyente)) throw new RangeError("Valencia: sin titular regional propio; el evaluador publicado no representa listas vacías. No se publica cuota para esta rama")
      let divisor = titulares.length
      while (divisor % 2 === 0) divisor /= 2
      while (divisor % 5 === 0) divisor /= 5
      if (divisor !== 1) throw new RangeError("Valencia: transporte racional1/3 del evaluador publicado pendiente; no se aproxima")
      return { ...u, titulares, numeros: { edad: a.edadDevengo, grado: a.gradoDiscapacidad, rentaNoExenta: a.renta.toNumber(), rentaDeclaracion: a.declaracion === "no-presenta" ? 0 : a.renta.toNumber(), diasConvivencia: dias }, textos: { claseDiscapacidad: a.claseDiscapacidad, permanente: a.permanente ? "si" : "no", parentesco: "consanguinidad", convivencia: "si" } }
    }).filter((u): u is NonNullable<typeof u> => u !== undefined) }
  })
  if (usados.size !== libro.length) throw new RangeError("Valencia: solicitud no enumera el censo completo de ascendientes")
  return { ...s, solicitudes }
}
