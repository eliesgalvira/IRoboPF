import Decimal from "decimal.js"
import { DateTime, Option, Result, Schema } from "effect"
import { CasoConjunta2025 } from "./contrato"
import { baseTrabajoMiembro2025 } from "../bases-familiares-2025/productor"
import { adaptarTrabajoAnual } from "../trabajo-anual/adaptador"

const D = Decimal.clone({ precision: 80 })
function exigir(ok: boolean, motivo: string): asserts ok {
  if (!ok) throw new RangeError("Conjunta2025: " + motivo)
}
function mismos(a: readonly string[], b: readonly string[]): boolean {
  return new Set(a).size === a.length && a.length === b.length && a.every(id => b.includes(id))
}
function edad(fecha: string): number {
  const d = DateTime.make(fecha + "T00:00:00Z")
  exigir(Option.isSome(d) && DateTime.formatIsoDateUtc(d.value) === fecha && fecha <= "2025-12-31", "nacimiento inválido")
  return 2025 - DateTime.toPartsUtc(d.value).year
}
/** Validación civil y económica compartida también por la frontera de composición.
 * No acepta bases ni mínimos calculados por el llamante. No activa política Open. */
export function prepararConjunta2025(entrada: CasoConjunta2025) {
  const r = Schema.decodeUnknownResult(CasoConjunta2025)(entrada, { onExcessProperty: "error" })
  exigir(Result.isSuccess(r), "contrato incompleto, incompatible o fuera del corte")
  const c = r.success
  const adultos = [c.declarante, ...(c.conyuge === null ? [] : [c.conyuge])]
  const personas = [...adultos, ...c.hijos]
  const ids = personas.map(p => p.id)
  exigir(new Set(ids).size === ids.length, "miembros duplicados")
  exigir(mismos(c.miembros, ids) && mismos(c.convivientesTodo2025, ids), "miembros/convivencia no exhaustivos")
  exigir(personas.every(p => p.unidadId === c.unidadId), "doble pertenencia u opción de unidad incompatible")
  exigir(adultos.every(p => edad(p.fechaNacimiento) >= 18 && edad(p.fechaNacimiento) < 65), "adultos fuera de18–64")
  exigir(c.hijos.every(h => edad(h.fechaNacimiento) < 3 && mismos(h.progenitoresTitulares, adultos.map(a => a.id))), "hijo fuera del corte o titulares incompletos")
  exigir(c.hijos.every(h => h.fechaNacimiento <= "2025-01-01"), "nacimiento incompatible con vida y convivencia durante todo2025")
  if (c.tipoUnidad === "matrimonial") {
    exigir(c.conyuge !== null && adultos.every(a => a.estadoCivil === "casado-no-separado") && c.otroProgenitorExterno === null, "matrimonio no separado con ambos titulares convivientes requerido")
    exigir(c.hijos.every(h => h.guardaCustodia === "ambos-conyuges-convivientes"), "guarda matrimonial contradictoria")
  } else {
    exigir(c.conyuge === null && c.declarante.estadoCivil === "sin-vinculo" && c.otroProgenitorExterno !== null, "monoparental único sin otro progenitor conviviente requerido")
    exigir(c.hijos.every(h => h.guardaCustodia === "exclusiva-declarante-todo2025"), "guarda exclusiva monoparental no acreditada")
  }
  const e = c.economia
  exigir(e.perceptorId === c.declarante.id && mismos(e.miembrosSinRentas, ids.filter(id => id !== e.perceptorId)), "economía no exhaustiva o varios perceptores")
  const t = e.trabajo
  exigir(t.ejercicio === 2025 && t.territorio === "comun" && t.reduccionesArt18 === "ninguna" && t.movilidad === "ninguna" && t.discapacidadActiva === "ninguna", "especialidades de trabajo excluidas")
  exigir(t.rendimientos.length === 1 && t.rendimientos.every(r => r.clase === "empleo-laboral" && r.cotizaciones.clase === "efectivas"), "empleo laboral único con cotizaciones efectivas requerido")
  exigir(new Set(e.retenciones.map(r => r.operacionId)).size === e.retenciones.length, "retención duplicada")
  const aporte = adaptarTrabajoAnual(t)
  exigir(aporte.estado !== "no-soportado", aporte.estado === "no-soportado" ? aporte.motivo : "trabajo no disponible")
  // Art19/art20 ya existentes; false impide extrapolar compatibilidad Open individual.
  const base = baseTrabajoMiembro2025(t, false, new D(0), aporte)
  const bruto = new D(aporte.gastos.integro)
  exigir(bruto.gte(30000), "bruto inferior al corte mínimo30000; DA61 conjunta positiva pendiente de atribución")
  const retenciones = e.retenciones.reduce((s, r) => s.plus(r.importe), new D(0))
  return { caso: c, edad: edad(c.declarante.fechaNacimiento), base, bruto,
    cotizaciones: t.rendimientos.reduce((s, r) => s.plus(r.cotizaciones.seguridadSocial).plus(r.cotizaciones.derechosPasivos).plus(r.cotizaciones.colegiosHuerfanos), new D(0)), retenciones,
    miembros: ids.map(id => ({ id, general: id === e.perceptorId ? base.general.toFixed() : "0", ahorro: "0", retenciones: id === e.perceptorId ? retenciones.toFixed() : "0" })),
  }
}

/** Art84: general primero y remanente a ahorro, ambos limitados a cero.
 * La API de este corte rechaza ahorro; se conserva explícita la etapa normativa. */
export function reducirBaseConjunta2025(tipo: CasoConjunta2025["tipoUnidad"], general: Decimal, ahorro: Decimal) {
  const teorica = new D(tipo === "matrimonial" ? 3400 : 2150)
  const aplicadaGeneral = D.min(D.max(0, general), teorica)
  const aplicadaAhorro = D.min(D.max(0, ahorro), teorica.minus(aplicadaGeneral))
  return { teorica, aplicadaGeneral, aplicadaAhorro,
    general: D.max(0, general.minus(aplicadaGeneral)),
    ahorro: D.max(0, ahorro.minus(aplicadaAhorro)),
  }
}
