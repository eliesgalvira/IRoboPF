import Decimal from "decimal.js"
import type { GastosTrabajo } from "../../trabajo-anual/contrato"
import type { HechosPagadoresCatalunya2025 } from "./contrato"
const D = Decimal.clone({ precision: 80 })
export type RetencionPagadores = { readonly operacionId: string; readonly importe: string; readonly ejercicio: number; readonly contribuyenteId?: string | undefined }
export type LibroPagadoresCatalunya2025 = {
  readonly titular: string
  readonly integro: string
  readonly pagadores: readonly { readonly id: string; readonly clase: "empleo" | "estatutario"; readonly integroCentimos: { readonly euros: string }; readonly certificado: string }[]
  readonly referenciaCenso: string
}
function exigir(ok: boolean, motivo: string): asserts ok {
  if (!ok) throw new RangeError("Catalunya pagadores: " + motivo)
}
/** Sólo hechos del perfil efectivo; no calcula art19/20, obligación general ni cuota. */
export function producirPagadoresCatalunya2025(h: HechosPagadoresCatalunya2025, trabajo: GastosTrabajo, retenciones: readonly RetencionPagadores[], titular: string, integroAnual: Decimal): LibroPagadoresCatalunya2025 {
  exigir(h.titular === titular && trabajo.ejercicio === 2025 && trabajo.territorio === "comun", "titular/ejercicio/territorio no conciliado")
  exigir(trabajo.movilidad === "ninguna" && trabajo.reduccionesArt18 === "ninguna" && trabajo.discapacidadActiva === "ninguna", "especialidades laborales no representadas")
  exigir(h.altasCuentaPropia.length === 0, "alta cuenta propia: obligación independiente art96.2; no causada exclusivamente por pagadores")
  exigir(h.prestacionesIMV.length === 0, "IMV de titular/unidad: obligación específica no coordinada")
  exigir(h.aportacionesPrevision.length === 0, "aportaciones previsión: causa específica art96.4 no coordinada")
  const rendimientos = new Map(trabajo.rendimientos.map(r => [r.id, r]))
  const ret = new Map(retenciones.map(r => [r.operacionId, r]))
  exigir(rendimientos.size === trabajo.rendimientos.length && ret.size === retenciones.length, "identificadores anuales duplicados")
  const usados = new Set<string>(), usadas = new Set<string>(), certificados = new Map<string, Set<string>>()
  const grupos = new Map<string, { id: string; clase: "empleo" | "estatutario"; integroCentimos: { euros: string }; certificado: string }>()
  let total = new D(0)
  for (const p of h.pagadores) {
    exigir(p.naturaleza === "persona-juridica-residente", "pagador sin obligación de retener derivable de naturaleza art76 RIRPF; perfil no representado")
    exigir(p.concepto === "salario-ordinario", "prestación pasiva art89.A o tipo fijo/otra causa art96.3: perfil excluido, aunque no se optara por89.A")
    const documentos = certificados.get(p.nif) ?? new Set<string>()
    exigir(!documentos.has(p.certificado), "certificado repetido para el mismo NIF")
    documentos.add(p.certificado)
    certificados.set(p.nif, documentos)
    let suma = new D(0)
    let clase: "empleo" | "estatutario" = "empleo"
    for (const id of p.rendimientos) {
      const r = rendimientos.get(id)
      exigir(r !== undefined && !usados.has(id), "rendimiento ausente, ajeno o asignado dos veces")
      exigir(r.clase === "empleo-laboral" || r.clase === "empleo-estatutario", "pensión/otro trabajo no habilita esta rama; art89.A no se presume inaplicable")
      exigir(new D(r.integro).gt(0), "rendimiento no positivo fuera del perfil ordinario")
      if (r.clase === "empleo-estatutario") clase = "estatutario"
      usados.add(id)
      suma = suma.plus(r.integro)
    }
    exigir(suma.eq(p.integro), "importe por pagador no concilia con rendimientos laborales")
    for (const id of p.retenciones) {
      const r = ret.get(id)
      exigir(r !== undefined && !usadas.has(id) && r.ejercicio === 2025 && r.contribuyenteId === titular, "retención ajena, repetida o sin identidad anual")
      usadas.add(id)
    }
    const anterior = grupos.get(p.nif)
    grupos.set(p.nif, { id: p.nif, clase, integroCentimos: { euros: suma.plus(anterior?.integroCentimos.euros ?? "0").toFixed() }, certificado: anterior === undefined ? p.certificado : anterior.certificado + ";" + p.certificado })
    total = total.plus(suma)
  }
  exigir(usados.size === rendimientos.size && usadas.size === ret.size, "censo omite rendimientos o retenciones anuales")
  exigir(total.eq(integroAnual), "total no concilia con íntegro producido por adaptarTrabajoAnual")
  return { titular, integro: total.toFixed(), pagadores: [...grupos.values()], referenciaCenso: h.referenciaCenso }
}
