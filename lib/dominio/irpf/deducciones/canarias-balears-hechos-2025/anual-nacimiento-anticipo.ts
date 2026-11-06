import type { FamiliaC36, SolicitudAnualC36 } from "./anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import type { Racional } from "../anual-territorial-racional"
import { racional, restar, type consumirCuota } from "../anual-territorial-racional"
import { comprobar, eurosC, RacionalC } from "./ampliacion-comun"
import { fecha, unico } from "./comun"
import { familiarC36, necesarioC36, sujetoC36 } from "./anual-productores"

type Solicitud = typeof FamiliaC36.Type
const leer = (q: Racional) => new RacionalC(BigInt(q.numeradorEuros), BigInt(q.divisor))

/** Concilia hechos; una resolución no sustituye el derecho producido por C36. */
export function conciliarAnticipoNacimientoC36(s: Solicitud, m: MagnitudesTerritorialesAnuales) {
  const registro = necesarioC36(s.hechos.registroCobrosNacimiento,
    "C36 nacimiento: falta registro exhaustivo de cobros anticipados; no se presume saldo cero")
  comprobar(registro.consulta.trim() !== "", "C36 nacimiento: consulta vacía")
  unico(registro.cobros.map(p => p.id))
  const resoluciones = registro.resoluciones ?? []
  if (registro.cobros.length === 0) {
    comprobar(resoluciones.length === 0, "C36 nacimiento: resolución sin pago conciliado")
    return undefined
  }
  // Primera cobertura nominal. Los perfiles existentes sin cobros (incluido
  // parto múltiple y adopción) conservan sus productores y políticas.
  comprobar(registro.cobros.length === 1, "C36 nacimiento: varios pagos/duplicados fuera de perfil nominal")
  const pago = registro.cobros[0]
  fecha(pago.fecha)
  comprobar(pago.beneficiario === sujetoC36(m), "C36 nacimiento: anticipo de otro beneficiario")
  comprobar(pago.fecha.startsWith("2025-"), "C36 nacimiento: pago fuera de 2025")
  comprobar(eurosC(pago.importe).n > 0n, "C36 nacimiento: pago no positivo")
  comprobar(resoluciones.length === 1, "C36 nacimiento: existen anticipos sin resolución nominal única")
  const resolucion = resoluciones[0]
  fecha(resolucion.fecha)
  fecha(resolucion.fechaNacimiento)
  comprobar(resolucion.id.trim() !== "" && pago.resolucion === resolucion.id &&
    resolucion.beneficiario === pago.beneficiario && resolucion.fecha >= resolucion.fechaNacimiento &&
    resolucion.fecha <= pago.fecha && resolucion.fechaNacimiento.startsWith("2025-") &&
    eurosC(resolucion.importeConcedido).comparar(eurosC(pago.importe)) === 0n,
    "C36 nacimiento: resolución contradictoria con pago/beneficiario/fechas/importe")
  comprobar(pago.ordenante === "ATIB" && pago.justificante !== undefined && pago.justificante.trim() !== "",
    "C36 nacimiento: falta ordenante ATIB o justificante nominal")
  const hijo = familiarC36(m, resolucion.hijo)
  comprobar(hijo.fechaNacimiento === resolucion.fechaNacimiento &&
    hijo.titulares.some(t => t.titularId === pago.beneficiario && t.vinculo.clase === "consanguinidad"),
    "C36 nacimiento: resolución ajena al nacimiento/vínculo anual")
  comprobar(s.hechos.contribuyente.familia.categoria === "ordinaria" &&
    s.hechos.personas.length === 1 && s.hechos.personas[0].id === resolucion.hijo &&
    s.hechos.censoDescendientes.length === 1 && s.hechos.registroPartoMultiple === undefined,
    "C36 nacimiento: anticipo sólo para familia ordinaria con nacimiento único; otros perfiles pendientes")
  return { pago, resolucion }
}

export type LibroAnticipoNacimientoC36 = {
  readonly derechoBruto: Racional
  readonly anticipoConciliado: Racional
  readonly deduccionNeta: Racional
  readonly reservaBruta: Racional
  readonly cuotaDisponibleOtras: Racional
  readonly cuotaReservadaSinMinoracion: Racional
  readonly resolucion: string
  readonly pago: string
  readonly beneficiario: string
  readonly estado: "condicionado"
  readonly aceptacionFiscal: "pendiente"
}

type ResultadoAnticipoNacimientoC36 = {
  readonly importe: Racional
  readonly libro: LibroAnticipoNacimientoC36 | undefined
}

/** Modelo100/2025 B.2: [1718]-[1719]+[0504]. Sólo se habilita el
 * tramo donde cuota>=derecho y anticipo<=derecho: no hay exceso ni IB52.
 * No consume cuota: D se reserva UNA vez en el consumidor anual común;
 * después se distingue la reserva de la minoración N, sin liberar A a terceros.
 * La composición no redondea: cada API conserva su política monetaria. */
export function liquidarAnticipoNacimientoC36(s: Solicitud, m: MagnitudesTerritorialesAnuales,
  derecho: Racional, plan: readonly (typeof SolicitudAnualC36.Type)[]): ResultadoAnticipoNacimientoC36 {
  const hechos = conciliarAnticipoNacimientoC36(s, m)
  if (hechos === undefined) return { importe: derecho, libro: undefined }
  comprobar(plan.length >= 1 && plan.length <= 2,
    "C36 nacimiento: anticipo admite sólo nacimiento y un mecenazgo cultural público en dinero")
  for (const solicitud of plan) {
    if (solicitud.codigo === "balears_nacimiento") continue
    comprobar(solicitud.codigo === "balears_mecenazgo_cultural_cientifico_tecnologico" &&
      "donaciones" in solicitud.hechos,
      "C36 nacimiento: concurrencia no acreditada; adopción y otras familias fuera de perfil")
    const donaciones = solicitud.hechos.donaciones
    comprobar(donaciones.length === 1 && donaciones.every(d =>
      d.modalidad === "dinero" && d.entidad.clase === "administracion" && d.entidad.naturaleza === "publica"),
      "C36 nacimiento: concurrencia sólo con una donación cultural pública en dinero")
    const soporte = necesarioC36(s.hechos.registroCobrosNacimiento?.mecenazgoConcurrente,
      "C36 nacimiento: falta titularidad documentada del proyecto propio CAIB concurrente")
    const donacion = donaciones[0]
    comprobar(soporte.donacion === donacion.id && soporte.beneficiarioNif === donacion.entidad.nif &&
      soporte.proyecto === donacion.entidad.proyecto &&
      soporte.declaracionProyecto === donacion.entidad.declaracionProyecto &&
      soporte.documentoTitularidad.trim() !== "" && donacion.entidad.territorio === "illes-balears",
      "C36 nacimiento: soporte del mecenazgo CAIB contradictorio con donación/proyecto")
  }
  const cuota = racional((m.cuotaAutonomicaResidual ?? m.cuotaAutonomica).toFixed())
  comprobar(leer(cuota).comparar(leer(derecho)) >= 0n,
    "C36 nacimiento: anticipo con cuota insuficiente; regularización e IB52 pendientes, sin importe habilitado")
  const anticipo = racional(hechos.pago.importe)
  comprobar(leer(anticipo).comparar(leer(derecho)) <= 0n,
    "C36 nacimiento: exceso sobre derecho; distinguir prestación exenta y pérdida de requisitos/reintegro antes de habilitar importe")
  const neto = restar(derecho, anticipo)
  return { importe: derecho, libro: {
    derechoBruto: derecho, anticipoConciliado: anticipo, deduccionNeta: neto,
    reservaBruta: derecho, cuotaDisponibleOtras: restar(cuota, derecho),
    cuotaReservadaSinMinoracion: anticipo,
    resolucion: hechos.resolucion.id, pago: hechos.pago.id, beneficiario: hechos.pago.beneficiario,
    estado: "condicionado", aceptacionFiscal: "pendiente",
  } }
}

/** Proyección de una única reserva ya consumida. La disponibilidad continúa
 * siendo la del libro bruto; el anticipo reduce sólo la minoración fiscal.
 * Q = total neto + disponible para terceros + reserva sin minoración (A).
 * No ejecuta consumirCuota, no transfiere el anticipo a la siguiente deducción. */
export function aplicarAnticipoAlLibroC36(consumo: ReturnType<typeof consumirCuota>,
  codigos: readonly string[], nacimiento: LibroAnticipoNacimientoC36 | undefined) {
  if (nacimiento === undefined) return consumo
  const indice = codigos.indexOf("balears_nacimiento")
  comprobar(indice >= 0, "C36 nacimiento: reserva sin candidato")
  const aplicacion = consumo.aplicaciones[indice]
  comprobar(aplicacion !== undefined &&
    leer(aplicacion.aplicado).comparar(leer(nacimiento.reservaBruta)) === 0n,
    "C36 nacimiento: libro común no reservó íntegro el derecho bruto")
  return {
    ...consumo,
    total: restar(consumo.total, nacimiento.anticipoConciliado),
    aplicaciones: consumo.aplicaciones.map((a, i) => i === indice
      ? { generado: nacimiento.deduccionNeta, aplicado: nacimiento.deduccionNeta, pendiente: racional("0") }
      : a),
  }
}
