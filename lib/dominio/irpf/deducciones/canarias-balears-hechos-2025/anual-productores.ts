import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import type { DescendienteDerechos } from "../../minimos/derechos-contrato"
import type {
  DeclaracionC,
  MagnitudesAnualesC,
  MinimoC,
  PagoC,
} from "./ampliacion-comun"
import { comprobar, eurosC, ceroC } from "./ampliacion-comun"
import { edad, fecha, unico, pagos } from "./comun"

export function necesarioC36<T>(v: T | undefined, motivo: string): T {
  comprobar(v !== undefined, motivo)
  return v
}
export function gradoC36(
  d: MagnitudesTerritorialesAnuales["caso"]["situacionFamiliar"]["discapacidad"]
): number {
  return d._tag === "Discapacidad65OMas"
    ? 65
    : d._tag === "Discapacidad33a64"
      ? 33
      : 0
}
export function sujetoC36(m: MagnitudesTerritorialesAnuales): string {
  comprobar(
    m.caso.anio === 2025 &&
      m.caso.fechaFallecimiento === undefined &&
      m.caso.situacionFamiliar.tipo === "individual",
    "C36 anual sólo2025 individual ordinaria"
  )
  const id = necesarioC36(
    m.caso.contribuyenteId,
    "C36 requiere identidad anual del contribuyente"
  )
  comprobar(id.trim() !== "", "C36 requiere identidad anual no vacía")
  return id
}
export function censoC36(
  m: MagnitudesTerritorialesAnuales
): readonly DescendienteDerechos[] {
  sujetoC36(m)
  const d = m.caso.derechosMinimos
  if (d === undefined) return []
  comprobar(
    d.contribuyenteId === m.caso.contribuyenteId &&
      d.ejercicio === 2025 &&
      d.territorio === m.caso.comunidadAutonoma &&
      d.regimen === "comun" &&
      d.edadContribuyenteDevengo === m.caso.situacionFamiliar.edad &&
      d.discapacidadContribuyente._tag ===
        m.caso.situacionFamiliar.discapacidad._tag &&
      d.fallecimientosEnElEjercicio === "ninguno" &&
      d.devengo === "2025-12-31" &&
      d.modalidad === "individual" &&
      d.ascendientes === "ninguno" &&
      d.descendientesCompletos,
    "Censo C36 contradictorio con el núcleo anual"
  )
  return d.descendientes
}
export function familiarC36(
  m: MagnitudesTerritorialesAnuales,
  id: string
): DescendienteDerechos {
  const d = censoC36(m).find((d) => d.sujetoId === id)
  return necesarioC36(
    d,
    "C36: sujeto sin nacimiento/vínculo en el censo anual: " + id
  )
}
export function titularesMinimoC36(
  m: MagnitudesTerritorialesAnuales,
  id: string
): readonly string[] {
  comprobar(
    m.sujetosConMinimo.includes(id),
    "C36: sujeto sin mínimo por descendientes anual: " + id
  )
  const titulares = necesarioC36(
    m.atribucionesMinimo?.find((a) => a.sujetoId === id),
    "C36: falta productor del reparto del mínimo: " + id
  ).titulares
  const d = familiarC36(m, id)
  unico(titulares)
  comprobar(
    titulares.includes(sujetoC36(m)) &&
      titulares.every((p) => d.titulares.some((t) => t.titularId === p)),
    "C36: titular ajeno al censo v4 del sujeto"
  )
  return titulares
}
export function minimoC36(
  m: MagnitudesTerritorialesAnuales,
  id: string
): MinimoC {
  familiarC36(m, id)
  return {
    persona: id,
    ejercicio: 2025,
    relacion: "descendiente",
    titulares: titularesMinimoC36(m, id),
    resolucion: "derivado-nucleo-v4:" + id,
  }
}
export function progenitoresC36(d: DescendienteDerechos): readonly string[] {
  return d.titulares
    .filter(
      (t) =>
        t.grado === 1 &&
        (t.vinculo.clase === "consanguinidad" || t.vinculo.clase === "adopcion")
    )
    .map((t) => t.titularId)
}
export function conciliarNacimientoPropioC36(
  m: MagnitudesTerritorialesAnuales,
  nacimiento: string
): void {
  fecha(nacimiento)
  comprobar(
    edad(nacimiento, "2025-12-31") === m.caso.situacionFamiliar.edad,
    "C36: nacimiento propio incompatible con edad anual"
  )
}
export function contextoC36(m: MagnitudesTerritorialesAnuales): DeclaracionC {
  const id = sujetoC36(m),
    territorio = m.caso.comunidadAutonoma
  comprobar(
    territorio === "canarias" || territorio === "illes-balears",
    "C36: territorio anual ajeno"
  )
  return {
    ejercicio: 2025,
    territorio,
    contribuyente: id,
    declarantes: [id],
    miembrosUnidadFamiliar: [id, ...censoC36(m).map((d) => d.sujetoId)],
    modalidad: "individual",
    devengo: "2025-12-31",
    causaDevengo: "fin_ejercicio",
    baseGeneral: m.baseGeneral.toFixed(),
    baseAhorro: m.baseAhorro.toFixed(),
    exhaustividad: "declaracion_completa",
  }
}
export function magnitudesC36(
  m: MagnitudesTerritorialesAnuales
): MagnitudesAnualesC {
  const id = sujetoC36(m),
    g = necesarioC36(
      m.basesLiquidables?.general,
      "C36: falta productor de base liquidable general"
    ),
    a = necesarioC36(
      m.basesLiquidables?.ahorro,
      "C36: falta productor de base liquidable del ahorro"
    )
  const minimos: MagnitudesAnualesC["minimos"][number][] = []
  for (const d of censoC36(m)) {
    if (!m.sujetosConMinimo.includes(d.sujetoId)) continue
    const titulares = titularesMinimoC36(m, d.sujetoId)
    minimos.push({ beneficiario: d.sujetoId, tipo: "descendiente", titulares })
    if (d.discapacidad._tag !== "SinDiscapacidad")
      minimos.push({
        beneficiario: d.sujetoId,
        tipo: "discapacidad",
        titulares,
      })
    if (
      d.discapacidad._tag === "Discapacidad65OMas" ||
      (d.discapacidad._tag === "Discapacidad33a64" &&
        d.discapacidad.necesitaAyudaOMovilidadReducida)
    )
      minimos.push({ beneficiario: d.sujetoId, tipo: "asistencia", titulares })
  }
  return {
    origen: "motor_anual",
    calculoId: "composicion-unica:2025:" + id,
    ejercicio: 2025,
    devengo: "2025-12-31",
    declarantes: [id],
    cuotaIntegraAutonomica: m.cuotaAutonomica.toFixed(),
    baseLiquidableGeneral: g.toFixed(),
    baseLiquidableAhorro: a.toFixed(),
    personas: [
      {
        persona: id,
        imponibleGeneral: m.baseGeneral.toFixed(),
        imponibleAhorro: m.baseAhorro.toFixed(),
        liquidableGeneral: g.toFixed(),
        liquidableAhorro: a.toFixed(),
        rendimientosTrabajoActividad:
          m.rentasTrabajoAnuales?.integroTrabajo.toFixed(),
      },
    ],
    minimos,
  }
}
export function conciliarPagoC36(
  m: MagnitudesTerritorialesAnuales,
  p: PagoC
): void {
  const id = sujetoC36(m)
  comprobar(
    p.pagador === id,
    "C36: pago de otro sujeto no representado por el anual individual"
  )
  pagos(contextoC36(m), [p])
  unico(p.distribucion.map((d) => d.persona))
  comprobar(
    p.distribucion.some((d) => d.persona === id),
    "C36: pago sin atribución al sujeto anual"
  )
  comprobar(
    p.distribucion
      .reduce((s, d) => s.sumar(eurosC(d.porcentaje)), ceroC())
      .comparar(eurosC("100")) === 0n,
    "C36: atribución de pago incompleta"
  )
}
