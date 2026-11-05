import Decimal from "decimal.js"
import type { ContextoDeduccion } from "../contratos-2025"
// Se conserva el evaluador admitido, incluido su contrato de salida y redondeo.
export { evaluarCeliaquiaRioja as reutilizarCeliaquiaRioja2025 } from "../contratos-2025"

const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
type Dinero = string
type Pago = {
  readonly id: string
  readonly pagador: string
  readonly receptor: string
  readonly fecha: string
  readonly importe: Dinero
  readonly factura: string
}
type Persona = {
  readonly id: string
  readonly nacimiento: string
  readonly discapacidad: number
}
type Marco = {
  readonly contexto: ContextoDeduccion
  /** Afirmación específica del alcance de la colección, no de elegibilidad. */
  readonly coleccion: "exhaustiva_2025"
}
type Familia = {
  readonly contribuyente: Persona
  readonly descendientes: readonly (Persona & {
    readonly titularesMinimo: readonly string[]
  })[]
  readonly titularesMismosDescendientes: readonly string[]
  readonly eleccionFamilia: "dos_hijos" | "numerosa"
}
type Acogido = {
  readonly id: string
  readonly nacimiento: string
  readonly desde: string
  readonly hasta: string
  readonly regimen: "simple" | "permanente" | "provisional" | "preadoptivo"
  readonly resolucionXunta: string
  readonly adopcion: string | null
  readonly acogedores: readonly string[]
  readonly vinculoAcogedores: "unico" | "matrimonio" | "pareja_ley_2_2006"
}
type GastosPersona = {
  readonly beneficiariosDelEjercicio: readonly string[]
  readonly beneficiario: Persona
  readonly relacion: "contribuyente" | "conyuge" | "minimo"
  readonly titularesMinimo: readonly string[]
  readonly titularesDeduccion: readonly string[]
  readonly pagos: readonly (Pago & {
    readonly facturaTipo: "ordinaria" | "simplificada"
    readonly concepto: string
    readonly territorio: string
    readonly origenServicio: string
  })[]
}
export type HechosE2025 = Marco &
  (
    | {
        readonly codigo: "galicia_familias_dos_hijos"
        readonly familia: Familia
      }
    | {
        readonly codigo: "galicia_acogimiento_menores"
        readonly menores: readonly Acogido[]
      }
    | {
        readonly codigo: "galicia_discapacidad_mayor_65_ayuda_terceras_personas"
        readonly persona: Persona
        readonly baseImponible: Dinero
        readonly minimoPersonalFamiliar: Dinero
        readonly necesidadTerceros: string
        readonly residencia: "domicilio" | "publica" | "concertada"
        readonly pagos: readonly Pago[]
      }
    | {
        readonly codigo: "galicia_nuevas_tecnologias_hogares"
        readonly contratos: readonly {
          readonly id: string
          readonly titular: string
          readonly alta: string
          readonly velocidad: "alta" | "otra"
          readonly uso: "hogar_exclusivo" | "actividad"
          readonly contratoAnterior: { readonly alta: string } | null
          readonly lineasAnterioresSimultaneas: readonly string[]
          readonly pagos: readonly (Pago & {
            readonly concepto: "alta" | "cuota" | "equipo"
          })[]
        }[]
      }
    | {
        readonly codigo: "rioja_bicicletas_pedaleo_no_asistido"
        readonly regimen: "privativo" | "gananciales"
        readonly conyuges: readonly string[]
        readonly bicicletas: readonly {
          readonly id: string
          readonly asistencia: "no" | "electrica"
          readonly pago: Pago
        }[]
      }
    | ({
        readonly codigo: "rioja_ejercicio_fisico_deporte" | "rioja_enfermos_ela"
        readonly diagnosticoEla: string | null
      } & GastosPersona)
    | {
        readonly codigo: "rioja_cuotas_organizaciones_profesionales_agrarias"
        readonly cuotas: readonly {
          readonly pago: Pago
          readonly constitucion: "ley_19_1977" | "otra"
          readonly certificadoAnual: string
        }[]
      }
    | {
        readonly codigo: "galicia_inversion_proyectos_especial_interes"
        readonly entidades: readonly {
          readonly id: string
          readonly objeto: "exclusivo_proyecto" | "otro"
          readonly declaracionLey2_2024: string
          readonly fechaDeclaracion: string
          readonly operaciones: readonly {
            readonly id: string
            readonly tipo: "constitucion" | "ampliacion"
            readonly fecha: string
            readonly pago: Pago
          }[]
          readonly baseConsumidaAnterior: Dinero
          readonly historia: "exhaustiva"
          readonly otrasDeduccionesMismaInversion: readonly string[]
        }[]
      }
    | {
        readonly codigo: "galicia_donaciones_idi"
        readonly cuotaIntegraAutonomica: Dinero
        readonly donaciones: readonly {
          readonly pago: Pago
          readonly destinatario:
            | "centro_universidad_gallega"
            | "centro_promovido_participado_galicia"
          readonly objeto: "investigacion_desarrollo_innovacion" | "otro"
          readonly comunicacionAtriGa: string
          readonly fechaComunicacion: string
        }[]
      }
  ) & { readonly creditoFiscalMecenazgoRioja: "no_aplicado" | "aplicado" }

export type ResultadoE2025 =
  | { readonly estado: "no_soportado"; readonly motivos: readonly string[] }
  | {
      readonly estado: "calculo_parcial"
      readonly aceptacionFiscal: "pendiente"
      /** Fracción exacta en euros. La presentación nunca alimenta otro cálculo. */
      readonly exacto: {
        readonly numeradorEuros: string
        readonly divisor: number
      }
      readonly presentacionEuros: string
      readonly motivos: readonly string[]
      readonly rastro: readonly {
        readonly hecho: string
        readonly base: string
        readonly operacion: string
        readonly resultado: string
      }[]
      readonly pendientes: readonly string[]
      readonly cuota: "pendiente_aplicacion_compartida"
    }

function fallo(motivo: string): ResultadoE2025 {
  return { estado: "no_soportado", motivos: [motivo] }
}
function texto(v: string): boolean {
  return String(v) === v && v.trim().length > 0
}
function coleccion<T>(v: readonly T[]): boolean {
  return Array.isArray(v)
}
function identidad(v: string): boolean {
  return texto(v) && v === v.trim()
}
function ids(v: readonly string[]): boolean {
  return coleccion(v) && v.every(identidad) && new Set(v).size === v.length
}
function fecha(v: string): boolean {
  if (String(v) !== v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false
  // Validación civil gregoriana sin construir un instante ni depender de zona horaria.
  const year = Number(v.slice(0, 4))
  const month = Number(v.slice(5, 7))
  const day = Number(v.slice(8, 10))
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const days =
    month === 2 ? (leap ? 29 : 28) : [4, 6, 9, 11].includes(month) ? 30 : 31
  return year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= days
}
function dinero(v: string): boolean {
  return (
    String(v) === v && v.length <= 32 && /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(v)
  )
}
function edad(nacimiento: string): number {
  if (!fecha(nacimiento) || nacimiento > "2025-12-31")
    throw new Error("Nacimiento inválido")
  return 2025 - Number(nacimiento.slice(0, 4))
}
function persona(p: Persona): boolean {
  return (
    identidad(p.id) &&
    edad(p.nacimiento) >= 0 &&
    Number.isFinite(p.discapacidad) &&
    p.discapacidad >= 0 &&
    p.discapacidad <= 100
  )
}
function titulares(v: readonly string[], id: string): boolean {
  return ids(v) && v.length > 0 && v.includes(id)
}
function pago(p: Pago, id: string): boolean {
  return (
    identidad(p.id) &&
    p.pagador === id &&
    identidad(p.receptor) &&
    p.receptor !== id &&
    texto(p.factura) &&
    fecha(p.fecha) &&
    dinero(p.importe)
  )
}
function actual(v: string): boolean {
  return v >= "2025-01-01" && v <= "2025-12-31"
}

/** API aislada para declaraciones individuales 2025. No recibe importes de deducción.
 * Una fecha fuera del ejercicio se excluye con rastro; los datos desconocidos se rechazan.
 * Las ramas no admitidas se identifican en la matriz del módulo. */
export function evaluarHechosE2025(h: HechosE2025): ResultadoE2025 {
  try {
    return evaluar(h)
  } catch {
    return fallo(
      "Hechos incompletos o inválidos: revisar identidades, fechas y colecciones"
    )
  }
}
function evaluar(h: HechosE2025): ResultadoE2025 {
  const c = h.contexto
  if (
    c.ejercicio !== 2025 ||
    c.modalidad !== "individual" ||
    !identidad(c.contribuyente) ||
    (c.declarantes !== undefined &&
      (c.declarantes.length !== 1 || c.declarantes[0] !== c.contribuyente)) ||
    h.coleccion !== "exhaustiva_2025"
  )
    return fallo("Se requiere ámbito individual 2025 e inventario exhaustivo")
  if (
    (h.codigo.startsWith("galicia_") ? "galicia" : "la-rioja") !== c.territorio
  )
    return fallo("Territorio contradictorio")
  if (!["no_aplicado", "aplicado"].includes(h.creditoFiscalMecenazgoRioja))
    return fallo("Elección de crédito fiscal desconocida")
  const id = c.contribuyente
  let total = new D(0)
  let divisor = 1
  const rastro: {
    hecho: string
    base: string
    operacion: string
    resultado: string
  }[] = []
  const vistos = new Set<string>()
  const facturas = new Set<string>()
  const pendientes = [
    "Acreditación externa de documentos y derechos particulares",
    "Aplicación coordinada con cuota y restantes deducciones; sin conexión anual",
  ]
  function sumar(
    hecho: string,
    base: Decimal,
    operacion: string,
    resultado: Decimal
  ): void {
    rastro.push({
      hecho,
      base: base.toFixed(),
      operacion,
      resultado: resultado.toFixed(),
    })
    total = total.plus(resultado)
  }
  function gastos(
    pagos: readonly Pago[],
    filtro: (p: Pago) => boolean = () => true
  ): Decimal {
    if (!coleccion(pagos)) throw new Error("Pagos ausentes")
    let base = new D(0)
    for (const p of pagos) {
      const claveFactura = JSON.stringify([p.receptor, p.factura])
      if (!pago(p, id) || vistos.has(p.id) || facturas.has(claveFactura))
        throw new Error("Pago inválido o repetido")
      vistos.add(p.id)
      facturas.add(claveFactura)
      const incluido = actual(p.fecha) && filtro(p)
      rastro.push({
        hecho: p.id,
        base: p.importe,
        operacion: incluido
          ? "pago incluido"
          : "pago excluido por fecha/concepto",
        resultado: incluido ? p.importe : "0",
      })
      if (incluido) base = base.plus(p.importe)
    }
    return base
  }
  switch (h.codigo) {
    case "galicia_familias_dos_hijos": {
      const f = h.familia
      if (
        !persona(f.contribuyente) ||
        f.contribuyente.id !== id ||
        !coleccion(f.descendientes) ||
        !ids(f.descendientes.map((p) => p.id)) ||
        !titulares(f.titularesMismosDescendientes, id)
      )
        return fallo("Familia o reparto incompletos")
      if (
        f.descendientes.some(
          (p) =>
            !persona(p) ||
            p.id === id ||
            p.nacimiento <= f.contribuyente.nacimiento ||
            p.titularesMinimo.includes(p.id) ||
            !titulares(p.titularesMinimo, id)
        )
      )
        return fallo("Mínimo por descendientes no identificado")
      if (f.eleccionFamilia !== "dos_hijos")
        return fallo("Resolver elección incompatible con familia numerosa")
      // Familias no simétricas requieren composición propia, no una fracción inventada.
      if (
        f.descendientes.some(
          (p) =>
            p.titularesMinimo.length !==
              f.titularesMismosDescendientes.length ||
            p.titularesMinimo.some(
              (t) => !f.titularesMismosDescendientes.includes(t)
            )
        )
      )
        return fallo("Rama de mínimos con titulares distintos pendiente")
      divisor = f.titularesMismosDescendientes.length
      const importe =
        f.descendientes.length === 2
          ? f.contribuyente.discapacidad >= 65 ||
            f.descendientes.some((p) => p.discapacidad >= 65)
            ? 500
            : 250
          : 0
      sumar(
        "familia",
        new D(f.descendientes.length),
        "exactamente dos; discapacidad >=65; reparto",
        new D(importe)
      )
      break
    }
    case "galicia_acogimiento_menores": {
      if (!ids(h.menores.map((m) => m.id))) return fallo("Menores repetidos")
      for (const m of h.menores) {
        if (
          !fecha(m.desde) ||
          !fecha(m.hasta) ||
          m.desde > m.hasta ||
          m.desde < m.nacimiento ||
          edad(m.nacimiento) < 0 ||
          edad(m.nacimiento) >= 18 ||
          m.id === id ||
          m.acogedores.includes(m.id) ||
          !texto(m.resolucionXunta) ||
          !titulares(m.acogedores, id) ||
          !["simple", "permanente", "provisional", "preadoptivo"].includes(
            m.regimen
          ) ||
          (m.adopcion !== null &&
            (!fecha(m.adopcion) ||
              m.adopcion < m.desde ||
              (m.adopcion < "2025-01-01" && m.hasta >= "2025-01-01")))
        )
          return fallo(
            "Acogimiento incompleto; mayores durante 2025 requieren rama específica"
          )
        if (
          (m.vinculoAcogedores === "unico" && m.acogedores.length !== 1) ||
          (["matrimonio", "pareja_ley_2_2006"].includes(m.vinculoAcogedores) &&
            m.acogedores.length !== 2) ||
          !["unico", "matrimonio", "pareja_ley_2_2006"].includes(
            m.vinculoAcogedores
          )
        )
          return fallo("Vínculo de acogedores contradictorio")
        // Permite distintos repartos por menor mediante numeradores decimales finitos (1/2).
        const incluido =
          m.desde <= "2025-12-31" &&
          m.hasta >= "2025-01-01" &&
          !(
            m.regimen === "preadoptivo" &&
            m.adopcion !== null &&
            actual(m.adopcion)
          )
        sumar(
          m.id,
          new D(300),
          "acogimiento vigente; excluir adopción preadoptiva 2025; mitad si pareja",
          new D(incluido ? 300 : 0).div(m.acogedores.length)
        )
      }
      break
    }
    case "galicia_discapacidad_mayor_65_ayuda_terceras_personas": {
      if (
        !persona(h.persona) ||
        h.persona.id !== id ||
        !magnitudAnual(h.baseImponible) ||
        !magnitudAnual(h.minimoPersonalFamiliar) ||
        !texto(h.necesidadTerceros) ||
        !["domicilio", "publica", "concertada"].includes(h.residencia)
      )
        return fallo("Edad, renta o necesidad de terceros sin identificar")
      const base = gastos(h.pagos)
      const acceso =
        edad(h.persona.nacimiento) >= 65 &&
        h.persona.discapacidad >= 65 &&
        new D(h.baseImponible).minus(h.minimoPersonalFamiliar).lte(22000) &&
        h.residencia === "domicilio"
      sumar(
        id,
        base,
        "10%; máximo600; edad>=65; discapacidad>=65; BI-mínimos<=22000",
        acceso ? D.min(600, base.times("0.1")) : new D(0)
      )
      break
    }
    case "galicia_nuevas_tecnologias_hogares": {
      if (!ids(h.contratos.map((x) => x.id)))
        return fallo("Contratos repetidos")
      let base = new D(0)
      for (const x of h.contratos) {
        if (
          x.titular !== id ||
          !fecha(x.alta) ||
          !["alta", "otra"].includes(x.velocidad) ||
          !["hogar_exclusivo", "actividad"].includes(x.uso) ||
          !ids(x.lineasAnterioresSimultaneas) ||
          (x.contratoAnterior !== null &&
            (!fecha(x.contratoAnterior.alta) ||
              x.contratoAnterior.alta > x.alta)) ||
          x.lineasAnterioresSimultaneas.includes(x.id) ||
          x.pagos.some((p) => !["alta", "cuota", "equipo"].includes(p.concepto))
        )
          return fallo("Contrato o historia de líneas desconocida")
        const elegible =
          actual(x.alta) &&
          x.velocidad === "alta" &&
          x.uso === "hogar_exclusivo" &&
          x.lineasAnterioresSimultaneas.length === 0 &&
          (x.contratoAnterior === null || actual(x.contratoAnterior.alta))
        if (x.pagos.some((p) => p.fecha < x.alta))
          return fallo("Pago anterior a contratación")
        base = base.plus(
          gastos(
            x.pagos,
            (p) =>
              elegible &&
              x.pagos.some((q) => q.id === p.id && q.concepto !== "equipo")
          )
        )
      }
      sumar(
        "contratos",
        base,
        "30%; máximo100 entre todos los contratos",
        D.min(100, base.times("0.3"))
      )
      break
    }
    case "rioja_bicicletas_pedaleo_no_asistido": {
      if (
        !ids(h.bicicletas.map((b) => b.id)) ||
        !["privativo", "gananciales"].includes(h.regimen)
      )
        return fallo("Vehículos o régimen inválidos")
      if (h.regimen === "gananciales") {
        if (!titulares(h.conyuges, id) || h.conyuges.length !== 2)
          return fallo("Identidad de ambos cónyuges necesaria")
        divisor = 2
      } else if (!ids(h.conyuges) || h.conyuges.length !== 0)
        return fallo("Rama privativa requiere inventario propio separado")
      const elegibles: Decimal[] = []
      for (const b of h.bicicletas) {
        if (!["no", "electrica"].includes(b.asistencia))
          return fallo("Asistencia desconocida")
        const base = gastos([b.pago], () => b.asistencia === "no")
        if (actual(b.pago.fecha) && b.asistencia === "no")
          elegibles.push(D.min(50, base.times("0.15")))
      }
      // Elección explícita pendiente cuando más de dos: no elegir por orden de entrada.
      if (elegibles.length > 2)
        return fallo(
          "Más de dos bicicletas: aportar elección de dos y composición familiar"
        )
      sumar(
        "bicicletas",
        new D(elegibles.length),
        "15%; máximo50/vehículo; máximo2/unidad; gananciales mitad",
        elegibles.reduce((a, b) => a.plus(b), new D(0))
      )
      pendientes.push(
        "Inventario de adquisiciones de toda la unidad familiar, incluidas las de otros miembros"
      )
      break
    }
    case "rioja_ejercicio_fisico_deporte":
    case "rioja_enfermos_ela": {
      if (
        !persona(h.beneficiario) ||
        !titulares(h.titularesDeduccion, id) ||
        !ids(h.titularesMinimo) ||
        !["contribuyente", "conyuge", "minimo"].includes(h.relacion)
      )
        return fallo("Beneficiario o titulares desconocidos")
      if (h.relacion !== "contribuyente" && h.beneficiario.id === id)
        return fallo(
          "El cónyuge o beneficiario del mínimo ajeno no puede ser el contribuyente"
        )
      if (h.relacion === "contribuyente" && h.beneficiario.id !== id)
        return fallo("Identidad contradictoria")
      if (
        h.relacion === "minimo" &&
        (!h.titularesMinimo.includes(id) ||
          h.titularesMinimo.includes(h.beneficiario.id))
      )
        return fallo("Derecho al mínimo no identificado")
      if (
        !ids(h.beneficiariosDelEjercicio) ||
        h.beneficiariosDelEjercicio.length !== 1 ||
        h.beneficiariosDelEjercicio[0] !== h.beneficiario.id
      )
        return fallo(
          "Varios beneficiarios o inventario desconocido: falta composición del límite anual"
        )
      // Un solo beneficiario exhaustivo: múltiples beneficiarios y límites compartidos son otra rama.
      divisor = h.titularesDeduccion.length
      const deporte = h.codigo === "rioja_ejercicio_fisico_deporte"
      if (!deporte && !texto(h.diagnosticoEla ?? ""))
        return fallo("Diagnóstico ELA sin referencia")
      const conceptos = deporte
        ? [
            "gimnasio_instalacion",
            "entidad_registro_deporte_rioja",
            "clases_deporte",
            "licencia_federacion_riojana",
          ]
        : ["profesional_sanitario", "tratamiento_prescrito", "paliar_sintomas"]
      if (
        h.pagos.some(
          (p) =>
            !["ordinaria", "simplificada"].includes(p.facturaTipo) ||
            ![...conceptos, "otro"].includes(p.concepto) ||
            !texto(p.territorio) ||
            !fecha(p.origenServicio)
        )
      )
        return fallo("Factura o servicio desconocido")
      const base = gastos(h.pagos, (p) =>
        h.pagos.some(
          (q) =>
            q.id === p.id &&
            q.facturaTipo === "ordinaria" &&
            conceptos.includes(q.concepto) &&
            (!deporte ||
              (q.territorio === "la-rioja" && actual(q.origenServicio)))
        )
      )
      const porcentaje = deporte
        ? edad(h.beneficiario.nacimiento) > 65 ||
          h.beneficiario.discapacidad >= 33
          ? "1"
          : "0.3"
        : "0.5"
      sumar(
        h.beneficiario.id,
        base,
        `${porcentaje}; límite ${deporte ? 300 : 2000}; base y límite repartidos`,
        D.min(deporte ? 300 : 2000, base.times(porcentaje))
      )
      pendientes.push(
        "Alcance: un único beneficiario exhaustivo; otros beneficiarios requieren composición del límite anual"
      )
      break
    }
    case "rioja_cuotas_organizaciones_profesionales_agrarias": {
      if (
        h.cuotas.some(
          (q) =>
            !["ley_19_1977", "otra"].includes(q.constitucion) ||
            !texto(q.certificadoAnual)
        )
      )
        return fallo("Organización o certificado desconocidos")
      const base = gastos(
        h.cuotas.map((q) => q.pago),
        (p) =>
          h.cuotas.some(
            (q) => q.pago.id === p.id && q.constitucion === "ley_19_1977"
          )
      )
      sumar(id, base, "cuotas; máximo100 por contribuyente", D.min(100, base))
      break
    }
    case "galicia_inversion_proyectos_especial_interes": {
      if (!ids(h.entidades.map((e) => e.id))) return fallo("Entidad repetida")
      for (const e of h.entidades) {
        if (
          !texto(e.declaracionLey2_2024) ||
          !fecha(e.fechaDeclaracion) ||
          e.fechaDeclaracion > "2025-12-31" ||
          e.historia !== "exhaustiva" ||
          !dinero(e.baseConsumidaAnterior) ||
          new D(e.baseConsumidaAnterior).gt(10000) ||
          !["exclusivo_proyecto", "otro"].includes(e.objeto) ||
          !ids(e.operaciones.map((o) => o.id)) ||
          !ids(e.otrasDeduccionesMismaInversion)
        )
          return fallo("Declaración, objeto o historia por entidad incompletos")
        if (e.otrasDeduccionesMismaInversion.length > 0)
          return fallo("Resolver incompatibilidad por misma inversión")
        if (e.operaciones.filter((o) => o.tipo === "constitucion").length > 1)
          return fallo(
            "Una entidad no puede tener dos operaciones de constitución"
          )
        if (
          e.operaciones.some(
            (o) =>
              !fecha(o.fecha) ||
              !["constitucion", "ampliacion"].includes(o.tipo) ||
              o.pago.receptor !== e.id ||
              o.pago.fecha < o.fecha
          )
        )
          return fallo("Operación societaria contradictoria")
        const base = gastos(
          e.operaciones.map((o) => o.pago),
          (p) =>
            e.objeto === "exclusivo_proyecto" &&
            e.operaciones.some((o) => o.pago.id === p.id && actual(o.fecha))
        )
        const restante = D.max(0, new D(10000).minus(e.baseConsumidaAnterior))
        sumar(
          e.id,
          base,
          "20%; base acumulada10000 por entidad",
          D.min(base, restante).times("0.2")
        )
      }
      break
    }
    case "galicia_donaciones_idi": {
      if (!magnitudAnual(h.cuotaIntegraAutonomica))
        return fallo("Falta cuota íntegra autonómica como magnitud de límite")
      for (const d of h.donaciones) {
        if (
          ![
            "centro_universidad_gallega",
            "centro_promovido_participado_galicia",
          ].includes(d.destinatario) ||
          !["investigacion_desarrollo_innovacion", "otro"].includes(d.objeto) ||
          !texto(d.comunicacionAtriGa) ||
          !fecha(d.fechaComunicacion) ||
          d.fechaComunicacion < "2026-01-01" ||
          d.fechaComunicacion > "2026-01-20"
        )
          return fallo("Destinatario o comunicación fuera de rama admitida")
      }
      const base = gastos(
        h.donaciones.map((d) => d.pago),
        (p) =>
          h.donaciones.some(
            (d) =>
              d.pago.id === p.id &&
              d.objeto === "investigacion_desarrollo_innovacion"
          )
      )
      sumar(
        id,
        base,
        "25%; máximo10% cuota íntegra autonómica",
        D.min(base.times("0.25"), new D(h.cuotaIntegraAutonomica).times("0.1"))
      )
      pendientes.push(
        "Entidades Ley49/2002 con condición2.83: siguiente rama; no asimilar a centro universitario"
      )
      break
    }
    default:
      return fallo(
        "Código desconocido o rama aún no implementada; no se asigna impuesto cero"
      )
  }
  if (
    c.territorio === "la-rioja" &&
    h.creditoFiscalMecenazgoRioja === "aplicado"
  )
    return fallo("Crédito fiscal de mecenazgo incompatible: resolver elección")
  return {
    estado: "calculo_parcial",
    aceptacionFiscal: "pendiente",
    exacto: { numeradorEuros: total.toFixed(), divisor },
    presentacionEuros: total.div(divisor).toFixed(2),
    motivos: [
      "Reglas concretas evaluadas sobre hechos declarados; sin certificación fiscal",
    ],
    rastro,
    pendientes,
    cuota: "pendiente_aplicacion_compartida",
  }
}

function magnitudAnual(s: string): boolean {
  return /^\d+(\.\d{1,80})?$/.test(s)
}
