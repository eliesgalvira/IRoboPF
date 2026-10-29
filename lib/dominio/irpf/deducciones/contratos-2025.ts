import Decimal from "decimal.js"
import type { AmbitoDeducciones } from "./ambito"

export type ContextoDeduccion = AmbitoDeducciones & {
  readonly contribuyente: string
  readonly modalidad: "individual" | "conjunta"
}
export type ResultadoDeduccion =
  | { readonly estado: "no_soportado" | "excluida"; readonly motivo: string }
  | {
      readonly estado:
        | "evaluacion_automatica"
        | "calculo_parcial"
        | "importe_externo"
      readonly importe: number
      readonly motivo: string
      readonly aceptacionFiscal: "pendiente"
    }
export type EleccionDeduccion = {
  readonly contribuyente: string
  readonly codigo: string
}

function importe(
  estado: "evaluacion_automatica" | "calculo_parcial" | "importe_externo",
  euros: Decimal.Value,
  motivo: string
): ResultadoDeduccion {
  return {
    estado,
    importe: new Decimal(euros).toDecimalPlaces(2).toNumber(),
    motivo,
    aceptacionFiscal: "pendiente",
  }
}
function noSoportado(motivo: string): ResultadoDeduccion {
  return { estado: "no_soportado", motivo }
}
function excluida(motivo: string): ResultadoDeduccion {
  return { estado: "excluida", motivo }
}
function identidadesValidas(ids: readonly string[]): boolean {
  return (
    ids.length > 0 &&
    ids.every((id) => id.trim().length > 0) &&
    new Set(ids).size === ids.length
  )
}
function ambitoValido(
  contexto: ContextoDeduccion,
  territorio: string
): boolean {
  return (
    contexto.ejercicio === 2025 &&
    contexto.territorio === territorio &&
    contexto.contribuyente.trim().length > 0
  )
}
export type ConsignacionProfesional = ContextoDeduccion & {
  readonly codigo: string
  readonly importe: number
  readonly soporte: string
}
export function evaluarConsignacion(
  contexto: ContextoDeduccion,
  entrada: Omit<ConsignacionProfesional, "modalidad">
): ResultadoDeduccion {
  if (
    entrada.ejercicio !== contexto.ejercicio ||
    entrada.territorio !== contexto.territorio ||
    entrada.contribuyente !== contexto.contribuyente
  )
    return excluida("Consignación de otro ámbito o titular")
  if (
    !Number.isFinite(entrada.importe) ||
    entrada.importe < 0 ||
    entrada.soporte.trim() === "" ||
    entrada.codigo.trim() === ""
  )
    return noSoportado("Importe o soporte profesional inválido")
  return importe(
    "importe_externo",
    entrada.importe,
    "Consignación profesional: no acredita cálculo ni requisitos fiscales"
  )
}
export type EventoAndaluz = {
  readonly id: string
  readonly ejercicio: number
  readonly tipo: "nacimiento" | "adopcion" | "acogimiento"
  readonly hijos: readonly string[]
  readonly titulares: readonly string[]
  readonly municipio: "ordinario" | "despoblacion" | "desconocido"
  readonly diasAcogimiento: number
  readonly ayudaAcogimiento: number
}
/** Núcleo ordinario del art. 11 reformado por Ley 8/2025; sin bases suprimidas. */
export function evaluarNacimientoAndaluz(
  contexto: ContextoDeduccion,
  eventos: readonly EventoAndaluz[],
  elecciones: readonly EleccionDeduccion[]
): ResultadoDeduccion {
  if (!ambitoValido(contexto, "andalucia"))
    return noSoportado("Solo Andalucía, ejercicio 2025")
  if (contexto.modalidad !== "individual")
    return noSoportado("Pendiente composición y reparto en conjunta")
  if (
    elecciones.some(
      (e) =>
        e.contribuyente === contexto.contribuyente &&
        [
          "andalucia_familia_numerosa",
          "andalucia_adopcion_internacional",
        ].includes(e.codigo)
    )
  )
    return noSoportado(
      "Debe resolver elección incompatible; no se suma ni se elige automáticamente"
    )
  if (eventos.length === 0)
    return importe("evaluacion_automatica", 0, "Sin eventos")
  if (
    !identidadesValidas(eventos.map((e) => e.id)) ||
    !identidadesValidas(eventos.flatMap((e) => e.hijos))
  )
    return noSoportado(
      "Identidades vacías o duplicadas: posible doble cómputo de acogimiento/adopción"
    )
  let total = new Decimal(0)
  for (const evento of eventos) {
    if (!Number.isInteger(evento.ejercicio))
      return noSoportado("Ejercicio de evento inválido")
    if (
      !identidadesValidas(evento.titulares) ||
      evento.titulares.length > 2 ||
      !identidadesValidas(evento.hijos)
    )
      return noSoportado("Titulares o beneficiarios inválidos")
    if (evento.municipio !== "ordinario")
      return noSoportado(
        "Falta acreditar clasificación municipal del artículo 8"
      )
    if (
      evento.ejercicio !== 2025 ||
      !evento.titulares.includes(contexto.contribuyente)
    )
      continue
    if (evento.tipo === "acogimiento") {
      if (
        !Number.isInteger(evento.diasAcogimiento) ||
        evento.diasAcogimiento < 0 ||
        evento.diasAcogimiento > 365 ||
        !Number.isFinite(evento.ayudaAcogimiento) ||
        evento.ayudaAcogimiento < 0
      )
        return noSoportado("Hechos de acogimiento inválidos")
      if (evento.diasAcogimiento < 90 || evento.ayudaAcogimiento > 0) continue
    }
    total = total.plus(
      new Decimal(evento.hijos.length)
        .times(evento.hijos.length > 1 ? 400 : 200)
        .div(evento.titulares.length)
    )
  }
  return importe(
    "evaluacion_automatica",
    total,
    "Ámbito ordinario individual; titulares identificados; interpretación candidata pendiente de revisión"
  )
}
export type HijoCanario = {
  readonly id: string
  readonly orden: number
  readonly ordenDiscapacidad: number
}
export function calcularNacimientoCanarioParcial(
  hijos: readonly HijoCanario[],
  titulares: readonly string[],
  contribuyente: string
): ResultadoDeduccion {
  if (!identidadesValidas(titulares) || !titulares.includes(contribuyente))
    return noSoportado("Titulares inválidos")
  if (hijos.length > 0 && !identidadesValidas(hijos.map((h) => h.id)))
    return noSoportado("Beneficiarios duplicados")
  let total = new Decimal(0)
  for (const hijo of hijos) {
    if (
      !Number.isInteger(hijo.orden) ||
      hijo.orden < 1 ||
      !Number.isInteger(hijo.ordenDiscapacidad) ||
      hijo.ordenDiscapacidad < 0 ||
      hijo.ordenDiscapacidad > hijo.orden
    )
      return noSoportado("Órdenes inválidos")
    const base =
      hijo.orden <= 2
        ? 265
        : hijo.orden === 3
          ? 530
          : hijo.orden === 4
            ? 796
            : 928
    const suplemento =
      hijo.ordenDiscapacidad === 0
        ? 0
        : hijo.ordenDiscapacidad <= 2
          ? 600
          : 1100
    total = total.plus(base + suplemento)
  }
  return importe(
    "calculo_parcial",
    total.div(titulares.length),
    "Solo cuantía y reparto individual: faltan cadena de rentas, convivencia, supervivencia e historial para aplicación"
  )
}
export type BasesMadrid = {
  readonly ejercicio: number
  readonly general: number
  readonly ahorro: number
  readonly basesUnidadFamiliar: readonly number[]
}
export type EventoMadrid = {
  readonly ejercicio: number
  readonly hijos: readonly string[]
  readonly progenitoresConvivientes: readonly string[]
}
export function evaluarNacimientoMadrid(
  contexto: ContextoDeduccion,
  evento: EventoMadrid,
  historia: readonly BasesMadrid[]
): ResultadoDeduccion {
  if (!ambitoValido(contexto, "madrid"))
    return noSoportado("Solo Madrid, ejercicio 2025")
  if (!Number.isInteger(evento.ejercicio))
    return noSoportado("Año del evento no entero o no finito")
  if (
    !identidadesValidas(evento.hijos) ||
    !identidadesValidas(evento.progenitoresConvivientes) ||
    evento.progenitoresConvivientes.length > 2
  )
    return noSoportado("Beneficiarios o progenitores inválidos")
  if (
    evento.ejercicio > 2025 ||
    evento.ejercicio < 2023 ||
    !evento.progenitoresConvivientes.includes(contexto.contribuyente)
  )
    return excluida("Fuera de ventana temporal o sin convivencia")
  for (let ejercicio = evento.ejercicio; ejercicio <= 2025; ejercicio++) {
    const registros = historia.filter((h) => h.ejercicio === ejercicio)
    if (registros.length !== 1)
      return noSoportado("Falta historial único de bases desde el evento")
    const bases = registros[0]
    if (
      ![bases.general, bases.ahorro, ...bases.basesUnidadFamiliar].every(
        Number.isFinite
      ) ||
      bases.basesUnidadFamiliar.length === 0
    )
      return noSoportado("Bases incompletas o no finitas")
    const limite = contexto.modalidad === "individual" ? 30930 : 37322.2
    if (
      bases.general + bases.ahorro > limite ||
      bases.basesUnidadFamiliar.reduce((a, b) => a + b, 0) > 61860
    )
      return excluida("Límite de base imponible personal o familiar excedido")
  }
  const multiple = evento.hijos.length > 1 && evento.ejercicio === 2025 ? 2 : 1
  const divisor =
    contexto.modalidad === "individual"
      ? evento.progenitoresConvivientes.length
      : 1
  return importe(
    "calculo_parcial",
    new Decimal("721.70")
      .times(evento.hijos.length)
      .times(multiple)
      .div(divisor),
    "Historial y cuantía calculados; falta acreditar unidad familiar y modalidad histórica por período"
  )
}
export type GastoGuarderia = {
  readonly hijo: string
  readonly titulares: readonly string[]
  readonly custodia: number
  readonly alimentacion: number
  readonly vestuarioEscolar: number
  readonly ayudas: number
}
export function calcularGuarderiaMurciaParcial(
  contexto: ContextoDeduccion,
  gastos: readonly GastoGuarderia[],
  baseImponible: number
): ResultadoDeduccion {
  if (!ambitoValido(contexto, "murcia") || !Number.isFinite(baseImponible))
    return noSoportado("Ámbito o base inválidos")
  if (baseImponible > (contexto.modalidad === "individual" ? 30000 : 50000))
    return excluida("Base imponible excedida")
  if (gastos.length > 0 && !identidadesValidas(gastos.map((g) => g.hijo)))
    return noSoportado("Hijo duplicado")
  let total = new Decimal(0)
  for (const gasto of gastos) {
    if (
      !identidadesValidas(gasto.titulares) ||
      !gasto.titulares.includes(contexto.contribuyente) ||
      ![
        gasto.custodia,
        gasto.alimentacion,
        gasto.vestuarioEscolar,
        gasto.ayudas,
      ].every((v) => Number.isFinite(v) && v >= 0)
    )
      return noSoportado("Titulares o gastos inválidos")
    const base = Decimal.max(
      0,
      new Decimal(gasto.custodia)
        .plus(gasto.alimentacion)
        .plus(gasto.vestuarioEscolar)
        .minus(gasto.ayudas)
    )
    const divisor =
      contexto.modalidad === "individual" ? gasto.titulares.length : 1
    total = total.plus(Decimal.min(1000, base.times("0.2")).div(divisor))
  }
  return importe(
    "calculo_parcial",
    total,
    "Gastos comunes y tope por hijo repartidos; pendientes centro, etapa, mínimo, convivencia, pagadores y facturas"
  )
}
export function excluirAlquilerCatalan(
  baseMenosMinimo: number
): ResultadoDeduccion {
  if (!Number.isFinite(baseMenosMinimo)) return noSoportado("Base desconocida")
  return baseMenosMinimo > 30000
    ? excluida("Base menos mínimo superior a 30.000")
    : noSoportado("Faltan acreditación, vivienda, pagos y duración del derecho")
}
export function excluirCooperativaCatalana(
  claseSocio: "temporal" | "permanente" | "desconocida"
): ResultadoDeduccion {
  return claseSocio === "temporal"
    ? excluida("Socio temporal excluido")
    : noSoportado(
        "Faltan votos, registro, destino, certificación, mantenimiento y arrastre"
      )
}
export function comprobarIncompatibilidadExtremena(
  elecciones: readonly EleccionDeduccion[]
): ResultadoDeduccion {
  const viudos = elecciones.filter(
    (e) => e.codigo === "extremadura_contribuyentes_viudos"
  )
  return viudos.some((v) =>
    elecciones.some(
      (e) =>
        e.contribuyente === v.contribuyente &&
        e.codigo === "extremadura_trabajo_dependiente"
    )
  )
    ? noSoportado(
        "Viudedad y trabajo incompatibles por contribuyente: requiere elección"
      )
    : noSoportado(
        "Sin conflicto detectado; falta evaluar requisitos individuales"
      )
}
export type PersonaCeliacaRioja = {
  readonly id: string
  readonly relacion:
    | "contribuyente"
    | "conyuge"
    | "ascendiente"
    | "descendiente"
  readonly titularesDelMinimo: readonly string[]
  readonly titularesDeduccion: readonly string[]
  readonly certificado: {
    readonly referencia: string
    readonly medico: string
    readonly colegiado: string
    readonly especialidad: string
    readonly fechaEmision: string
    readonly fechaDiagnostico: string
    readonly diagnostico: "definitivo" | "provisional"
    readonly ejercicioMedico: "activo" | "desconocido"
  } | null
}
/** Ley 9/2025 art. 1.4 y DF única.2: efectos expresos desde 1/1/2025. */
export function evaluarCeliaquiaRioja(
  contexto: ContextoDeduccion,
  personas: readonly PersonaCeliacaRioja[]
): ResultadoDeduccion {
  if (!ambitoValido(contexto, "la-rioja"))
    return noSoportado("Solo La Rioja 2025; no heredar a otros ejercicios")
  if (personas.length > 0 && !identidadesValidas(personas.map((p) => p.id)))
    return noSoportado("Personas duplicadas o sin identidad")
  let total = new Decimal(0)
  for (const persona of personas) {
    if (!identidadesValidas(persona.titularesDeduccion))
      return noSoportado("Titularidad desconocida")
    if (!persona.titularesDeduccion.includes(contexto.contribuyente)) continue
    if (
      (persona.relacion === "ascendiente" ||
        persona.relacion === "descendiente") &&
      !persona.titularesDelMinimo.includes(contexto.contribuyente)
    )
      continue
    if (
      persona.relacion === "contribuyente" &&
      persona.id !== contexto.contribuyente
    )
      return noSoportado("Identidad del contribuyente contradictoria")
    const certificado = persona.certificado
    if (
      certificado === null ||
      certificado.diagnostico !== "definitivo" ||
      certificado.ejercicioMedico !== "activo" ||
      [
        certificado.referencia,
        certificado.medico,
        certificado.colegiado,
        certificado.especialidad,
      ].some((s) => s.trim() === "")
    )
      return noSoportado(
        "Falta certificado con diagnóstico definitivo e identificación del médico activo"
      )
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(certificado.fechaDiagnostico) ||
      !Number.isFinite(Date.parse(certificado.fechaDiagnostico)) ||
      !Number.isFinite(Date.parse(certificado.fechaEmision))
    )
      return noSoportado("Fechas del certificado inválidas")
    if (certificado.fechaDiagnostico > "2025-12-31") continue
    total = total.plus(new Decimal(250).div(persona.titularesDeduccion.length))
  }
  return importe(
    "calculo_parcial",
    total,
    "Cuantía y reparto 2025; derecho al mínimo y vínculo conyugal aportados externamente, no evaluados aquí"
  )
}

export type SolicitudDeduccion =
  | {
      readonly tipo: "andalucia_nacimiento"
      readonly contexto: ContextoDeduccion
      readonly eventos: readonly EventoAndaluz[]
      readonly elecciones: readonly EleccionDeduccion[]
    }
  | {
      readonly tipo: "madrid_nacimiento"
      readonly contexto: ContextoDeduccion
      readonly evento: EventoMadrid
      readonly historia: readonly BasesMadrid[]
    }
  | {
      readonly tipo: "canarias_nacimiento"
      readonly contexto: ContextoDeduccion
      readonly hijos: readonly HijoCanario[]
      readonly titulares: readonly string[]
    }
  | {
      readonly tipo: "murcia_guarderia"
      readonly contexto: ContextoDeduccion
      readonly gastos: readonly GastoGuarderia[]
      readonly baseImponible: number
    }
  | {
      readonly tipo: "rioja_celiaquia"
      readonly contexto: ContextoDeduccion
      readonly personas: readonly PersonaCeliacaRioja[]
    }
  | {
      readonly tipo: "consignacion"
      readonly contexto: ContextoDeduccion
      readonly entrada: ConsignacionProfesional
    }

export function evaluarDeduccion(
  solicitud: SolicitudDeduccion
): ResultadoDeduccion {
  switch (solicitud.tipo) {
    case "andalucia_nacimiento":
      return evaluarNacimientoAndaluz(
        solicitud.contexto,
        solicitud.eventos,
        solicitud.elecciones
      )
    case "madrid_nacimiento":
      return evaluarNacimientoMadrid(
        solicitud.contexto,
        solicitud.evento,
        solicitud.historia
      )
    case "canarias_nacimiento":
      if (
        !ambitoValido(solicitud.contexto, "canarias") ||
        solicitud.contexto.modalidad !== "individual"
      )
        return noSoportado(
          "Canarias 2025 individual: otros ámbitos no soportados"
        )
      return calcularNacimientoCanarioParcial(
        solicitud.hijos,
        solicitud.titulares,
        solicitud.contexto.contribuyente
      )
    case "murcia_guarderia":
      return calcularGuarderiaMurciaParcial(
        solicitud.contexto,
        solicitud.gastos,
        solicitud.baseImponible
      )
    case "rioja_celiaquia":
      return evaluarCeliaquiaRioja(solicitud.contexto, solicitud.personas)
    case "consignacion":
      return evaluarConsignacion(solicitud.contexto, solicitud.entrada)
  }
}

/** No convertir un cálculo parcial o desconocido en un cero sumable. No limita por cuota. */
export function totalDeduccionesEvaluadas(
  ambito: ContextoDeduccion,
  solicitudes: readonly SolicitudDeduccion[]
): ResultadoDeduccion {
  let total = new Decimal(0)
  let externo = false
  const claves = solicitudes.map((s) =>
    s.tipo === "consignacion" ? s.entrada.codigo : s.tipo
  )
  if (new Set(claves).size !== claves.length)
    return noSoportado(
      "Solicitud duplicada: agrupar beneficiarios antes de sumar"
    )
  const elecciones = solicitudes.flatMap((s) =>
    s.tipo === "consignacion"
      ? [{ contribuyente: s.entrada.contribuyente, codigo: s.entrada.codigo }]
      : []
  )
  if (
    elecciones.some(
      (e) =>
        e.codigo === "extremadura_contribuyentes_viudos" &&
        elecciones.some(
          (otra) =>
            otra.contribuyente === e.contribuyente &&
            otra.codigo === "extremadura_trabajo_dependiente"
        )
    )
  )
    return noSoportado("Elección extremeña incompatible por contribuyente")
  if (
    solicitudes.some((s) => s.tipo === "andalucia_nacimiento") &&
    elecciones.some(
      (e) =>
        e.contribuyente === ambito.contribuyente &&
        [
          "andalucia_familia_numerosa",
          "andalucia_adopcion_internacional",
          "andalucia_nacimiento_adopcion_acogimiento_menores",
        ].includes(e.codigo)
    )
  )
    return noSoportado(
      "Consignación incompatible o duplicada con nacimiento andaluz"
    )
  for (const solicitud of solicitudes) {
    const contexto = solicitud.contexto
    if (
      contexto.ejercicio !== ambito.ejercicio ||
      contexto.territorio !== ambito.territorio ||
      contexto.contribuyente !== ambito.contribuyente ||
      contexto.modalidad !== ambito.modalidad
    )
      return noSoportado("Solicitud ajena al ámbito del agregado")
    const resultado = evaluarDeduccion(solicitud)
    if (resultado.estado === "no_soportado") return resultado
    if (resultado.estado === "calculo_parcial")
      return noSoportado(resultado.motivo)
    if (resultado.estado === "excluida") continue
    if ("importe" in resultado) total = total.plus(resultado.importe)
    if (resultado.estado === "importe_externo") externo = true
  }
  if (!externo && ambito.ejercicio !== 2025)
    return noSoportado("Sin evaluación automática fuera del catálogo 2025")
  return importe(
    externo ? "importe_externo" : "evaluacion_automatica",
    total,
    "Importe generado antes de cuota; aceptación fiscal pendiente"
  )
}
