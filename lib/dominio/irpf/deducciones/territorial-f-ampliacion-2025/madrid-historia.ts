import type { HistoriaNacimientoMadrid } from "./madrid-historia-esquema"
import Decimal from "decimal.js"
import { adaptarTrabajoAnual } from "../../trabajo-anual/adaptador"
import { calcularReduccionTrabajoConOtrasRentas } from "../../reducciones/reduccion-rendimientos-trabajo"
import type { SolicitudAnualF2025 } from "./anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { falta, excluir, requerido, fecha, unicos, texto } from "./comun"
const D = Decimal.clone({ precision: 80 })
function mismos(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every(id => b.includes(id))
}
/** Núcleo de hechos históricos. Art19 y art20 públicos por año; sin cuota ni deducciones. */
export function comprobarHistoriaNacimientoMadrid(s: SolicitudAnualF2025, m: MagnitudesTerritorialesAnuales): void {
  const aux = requerido(s.auxiliares, "auxiliares")
  const origenes = aux.eventos.map(e => Number(fecha(e.fecha, "evento.fecha").slice(0, 4)))
  if (origenes.some(y => y < 2023)) excluir("evento.fuera_ventana", "Evento anterior a los dos periodos siguientes aplicables en 2025")
  if (origenes.every(y => y >= 2025)) {
    if (s.historiaNacimientoMadrid !== undefined) falta("historia.sin_evento", "Historia sin evento histórico")
    return
  }
  if (new Set(origenes).size > 1) falta("historia.origenes_distintos", "Perfil técnico inicial de un único ejercicio de origen; no excluir en bloque eventos de otros años")
  const historia = requerido(s.historiaNacimientoMadrid, "historiaNacimientoMadrid")
  const propio = texto(m.caso.contribuyenteId, "contribuyenteId")
  if (historia.contribuyente !== propio) falta("historia.identidad", "Declarante distinto")
  unicos(historia.periodos.map(p => String(p.ejercicio)), "historia.ejercicio")
  const desde = Math.min(...origenes)
  const requeridos = desde === 2023 ? [2023, 2024] : [2024]
  if (!mismos(historia.periodos.map(p => String(p.ejercicio)), requeridos.map(String)))
    falta("historia.periodos", "Faltan hechos desde el evento hasta 2024 o hay ejercicios ajenos")
  const ds = requerido(m.caso.derechosMinimos, "derechosMinimos").descendientes
  // Primer perfil estable: el libro actual o el perfil monoparental sigue validando 2025.
  const actual = m.libroBasesFamiliares2025
  if (actual?.censo !== undefined && !mismos(actual.censo.hijos.map(h => h.id), ds.map(d => d.sujetoId)))
    falta("historia.censo_actual", "Hijos del libro actual fuera del grafo conciliable: falta cobertura histórica completa")
  const conyuge = actual?.conyuge
  if (actual?.estadoCivil === "separado-legalmente") falta("historia.estado_civil", "Separación requiere historia civil específica")
  const miembrosActuales = actual?.miembrosUnidad ?? aux.miembrosUnidad
  for (const p of historia.periodos) {
    const campo = "historia:" + p.ejercicio
    if (p.estadoCivil !== aux.estadoCivil || p.conyuge !== conyuge || (p.estadoCivil === "casado") !== (p.conyuge !== undefined))
      falta(campo + ":estado_civil", "Perfil técnico estable: estado civil o cónyuge no conciliado")
    unicos(p.personas.map(x => x.id), campo + ":personas"); unicos(p.hijos.map(x => x.id), campo + ":hijos")
    if (!mismos(p.hijos.map(x => x.id), ds.map(x => x.sujetoId)))
      falta(campo + ":censo", "Perfil estable requiere el censo completo de hijos en cada ejercicio")
    const personas = new Set([propio, ...(conyuge === undefined ? [] : [conyuge])])
    const miembros = [propio, ...(conyuge === undefined ? [] : [conyuge])]
    for (const h of p.hijos) {
      const d = ds.find(x => x.sujetoId === h.id)!
      const padres = d.titulares.filter(t => t.grado === 1 && (t.vinculo.clase === "consanguinidad" || t.vinculo.clase === "adopcion"))
      const convivientes = padres.filter(t => t.relacion === "convivencia").map(t => t.titularId)
      unicos(h.progenitores, campo + ":progenitores"); unicos(h.convivientesDevengo, campo + ":convivientes")
      unicos(h.vinculos.map(v => v.progenitor), campo + ":vinculos")
      if (fecha(h.nacimiento, campo + ":nacimiento") !== d.fechaNacimiento || h.nacimiento > p.ejercicio + "-12-31" ||
          !mismos(h.progenitores, padres.map(t => t.titularId)) || !mismos(h.convivientesDevengo, convivientes) ||
          !mismos(h.vinculos.map(v => v.progenitor), h.progenitores) || !h.progenitores.includes(propio))
        falta(campo + ":filiacion", "Nacimiento, padres o convivencia histórica no conciliados; no se infieren de 2025")
      for (const v of h.vinculos) {
        const t = padres.find(t => t.titularId === v.progenitor)!
        if (v.clase !== t.vinculo.clase || (v.clase === "consanguinidad" && v.constitucion !== undefined) ||
            (t.vinculo.clase === "adopcion" && (v.constitucion !== t.vinculo.fechaConstitucionVinculo ||
              fecha(v.constitucion, campo + ":adopcion") > p.ejercicio + "-12-31")))
          falta(campo + ":vinculo", "Vínculo y constitución históricos contradictorios")
      }
      personas.add(h.id); h.progenitores.forEach(id => personas.add(id))
      const edad = p.ejercicio - Number(h.nacimiento.slice(0, 4))
      if (edad >= 18) falta(campo + ":unidad", "Perfil técnico inicial: sólo hijos menores sin emancipación ni apoyo judicial")
      if (h.convivientesDevengo.includes(propio) || (conyuge !== undefined && h.convivientesDevengo.includes(conyuge))) miembros.push(h.id)
    }
    if (!mismos([...personas], p.personas.map(x => x.id)) || !mismos(miembros, miembrosActuales))
      falta(campo + ":unidad", "Censo de personas o unidad art82 incompleto o cambiante")
    const bases = producirBasesHistoriaNacimientoMadrid(p, propio)
    const propia = bases.get(propio)!
    const familiar = miembros.reduce((a, id) => a.plus(bases.get(id)!), new D(0))
    if (propia.gt("30930") || familiar.gt("61860")) {
      if (!origenes.includes(p.ejercicio))
        falta(campo + ":criterio_anualidad_intermedia", "Bases intermedias excedidas: continuidad o recuperación no acreditada en esta primera cobertura")
      excluir(campo + ":bases_origen", "Bases derivadas en origen superiores al límite individual o familiar")
    }
  }
}

/** Productor económico por ejercicio, sin liquidaciones ni magnitudes externas. */
export function producirBasesHistoriaNacimientoMadrid(p: Pick<HistoriaNacimientoMadrid["periodos"][number], "ejercicio" | "personas">, propio: string): ReadonlyMap<string, Decimal> {
  const campo = "historia:" + p.ejercicio
    const bases = new Map<string, Decimal>()
    for (const persona of p.personas) {
      if (persona.id === propio && persona.residenciaAutonomica !== "madrid")
        falta(campo + ":residencia", "Cambio de residencia fuera del perfil histórico estable")
      const e = persona.economia
      if (e.perfil === "sin-rentas") { bases.set(persona.id, new D(0)); continue }
      const t = e.trabajo
      if (t.ejercicio !== p.ejercicio || t.territorio !== "comun" || t.discapacidadActiva !== "ninguna" ||
          t.rendimientos.length === 0 || !(t.rendimientos.every(r => r.clase === "pension") ||
          t.rendimientos.every(r => r.clase === "empleo-laboral" || r.clase === "empleo-estatutario")))
        falta(campo + ":economia:" + persona.id, "Trabajo/pensión ordinarios del ejercicio requeridos; restricción técnica")
      const aporte = adaptarTrabajoAnual(t)
      if (aporte.estado === "no-soportado") falta(campo + ":economia:" + persona.id, aporte.motivo)
      const neto = new D(aporte.rendimientoAntesArt20)
      const reduccion = D.min(D.max(0, neto), calcularReduccionTrabajoConOtrasRentas({
        anio: p.ejercicio, rendimientoPrevioNeto: new D(aporte.argumentoArt20), otrasRentasNoExentas: new D(0),
      }))
      bases.set(persona.id, neto.minus(reduccion))
    }
  return bases
}
