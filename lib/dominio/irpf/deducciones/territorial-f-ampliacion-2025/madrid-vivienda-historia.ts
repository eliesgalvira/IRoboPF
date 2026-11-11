import Decimal from "decimal.js"
import type { SolicitudAnualF2025 } from "./anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { producirBasesHistoriaNacimientoMadrid } from "./madrid-historia"
import { falta, excluir, requerido, texto, fecha, dinero, unicos } from "./comun"
const D = Decimal.clone({ precision: 80 })
const mismos = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every(id => b.includes(id))
/** Acceso art13 en origen y condiciones anuales. No saldo ni cuotas históricas. */
export function comprobarHistoriaViviendaMadrid(s: SolicitudAnualF2025, m: MagnitudesTerritorialesAnuales): void {
  const vs = requerido(s.hechos.viviendas, "viviendas")
  if (vs.length !== 1) falta("viviendas", "Una compra identificada")
  const v = vs[0]!, compra = fecha(v.adquisicion, "vivienda.adquisicion")
  const origen = Number(compra.slice(0, 4))
  if (origen < 2023 || origen > 2025) excluir("adquisicion", "Compra fuera de vigencia o posterior al ejercicio2025")
  const propio = texto(m.caso.contribuyenteId, "contribuyenteId")
  if (!mismos(v.titulares ?? [], [propio]) || !dinero(v.porcentajePropiedad, "porcentajePropiedad").eq(100))
    falta("vivienda.titulares", "Perfil de propietario único100%; no cotitularidad")
  if (origen === 2025) {
    if (s.historiaViviendaMadrid !== undefined) falta("historiaViviendaMadrid.sin_compra_anterior", "Compra2025 no consume historia2023/24")
    return
  }
  const h = requerido(s.historiaViviendaMadrid, "historiaViviendaMadrid")
  const libro = requerido(m.libroBasesFamiliares2025, "libroBasesFamiliares2025")
  if (h.contribuyente !== propio || h.viviendaId !== v.id || fecha(h.adquisicion, "historia.adquisicion") !== compra)
    falta("historiaViviendaMadrid.identidad", "Historia de otro titular, inmueble o compra")
  if (libro.estadoCivil === "separado-legalmente") falta("historiaViviendaMadrid.estadoCivil", "Separación fuera del perfil estable")
  const desde = fecha(h.unidadHabitualDesde, "historia.unidadHabitualDesde")
  if (desde !== fecha(v.ocupacionDesde, "vivienda.ocupacionDesde") || desde < compra ||
      fecha(h.unidadHabitualHasta, "historia.unidadHabitualHasta") !== "2025-12-31")
    falta("historiaViviendaMadrid.habitualidad", "Acreditar ocupación de toda la unidad desde compra/ocupación hasta devengo; sin construcción ni interrupciones")
  const periodos = origen === 2023 ? [2023, 2024] : [2024]
  unicos(h.periodos.map(p => String(p.ejercicio)), "historiaViviendaMadrid.ejercicio")
  if (!mismos(h.periodos.map(p => String(p.ejercicio)), periodos.map(String)))
    falta("historiaViviendaMadrid.periodos", "Reconstruir todos los ejercicios desde compra hasta2024, sin duplicados ni ajenos")
  const ds = requerido(m.caso.derechosMinimos, "derechosMinimos")
  if (!ds.descendientesCompletos) falta("historiaViviendaMadrid.censo", "Censo actual incompleto")
  for (const p of h.periodos) {
    const campo = "historiaViviendaMadrid:" + p.ejercicio
    if (p.estadoCivil !== libro.estadoCivil || p.conyuge !== libro.conyuge || (p.estadoCivil === "casado-no-separado") !== (p.conyuge !== undefined))
      falta(campo + ":estadoCivil", "Perfil inicial de familia estable; no inferir cambios civiles")
    unicos(p.personas.map(x => x.id), campo + ":personas"); unicos(p.hijos.map(x => x.id), campo + ":hijos")
    if (!mismos(p.hijos.map(x => x.id), ds.descendientes.map(x => x.sujetoId))) falta(campo + ":censo", "Censo completo estable requerido")
    const miembros = [propio, ...(p.conyuge === undefined ? [] : [p.conyuge])]
    for (const hijo of p.hijos) {
      const actual = ds.descendientes.find(x => x.sujetoId === hijo.id)!
      const nacimiento = fecha(hijo.nacimiento, campo + ":nacimiento")
      unicos(hijo.progenitores, campo + ":progenitores"); unicos(hijo.convivientesDevengo, campo + ":convivientes")
      unicos(hijo.vinculos.map(x => x.progenitor), campo + ":vinculos")
      const padres = actual.titulares.filter(t => t.grado === 1 && ["consanguinidad", "adopcion"].includes(t.vinculo.clase))
      if (nacimiento !== actual.fechaNacimiento || nacimiento > compra || p.ejercicio - Number(nacimiento.slice(0, 4)) >= 18 ||
          !mismos(hijo.progenitores, padres.map(t => t.titularId)) || !mismos(hijo.vinculos.map(x => x.progenitor), hijo.progenitores) ||
          !mismos(hijo.convivientesDevengo, padres.filter(t => t.relacion === "convivencia").map(t => t.titularId)) ||
          !hijo.progenitores.includes(propio) || !hijo.convivientesDevengo.includes(propio))
        falta(campo + ":filiacion", "Perfil de hijos propios menores convivientes ya nacidos al adquirir; identidad/fechas no conciliadas")
      for (const vinculo of hijo.vinculos) {
        const t = padres.find(t => t.titularId === vinculo.progenitor)!
        if (vinculo.clase !== t.vinculo.clase || (vinculo.clase === "consanguinidad" && vinculo.constitucion !== undefined) ||
            (t.vinculo.clase === "adopcion" && (vinculo.constitucion !== t.vinculo.fechaConstitucionVinculo || fecha(vinculo.constitucion, campo + ":adopcion") > compra)))
          falta(campo + ":vinculo", "Constitución del vínculo histórico no acreditada al adquirir")
      }
      // Perfil sin rentas de hijos: prueba económica y declaración, no booleano de mínimo.
      if (p.personas.find(x => x.id === hijo.id)?.economia.perfil !== "sin-rentas")
        falta(campo + ":economia_hijo", "Hijos con rentas requieren productor histórico de mínimo específico")
      miembros.push(hijo.id)
    }
    if (!mismos(miembros, libro.miembrosUnidad) || !mismos(miembros, p.personas.map(x => x.id)))
      falta(campo + ":unidad", "Art82: censo económico completo de unidad estable; sin personas ajenas")
    const bases = producirBasesHistoriaNacimientoMadrid(p, propio)
    const suma = miembros.reduce((a, id) => a.plus(bases.get(id)!), new D(0))
    // Art18.2, sin límite propio de30930 ni tope fijo61860 del art4.
    if (p.ejercicio === origen && suma.gt(new D(30930).times(miembros.length)))
      excluir(campo + ":bases_origen", "Art18.2 excedido al adquirir: no nace derecho a anualidades posteriores")
    // Un exceso intermedio no extingue el derecho en años de renta admisible (CTE44-25/R).
  }
}
