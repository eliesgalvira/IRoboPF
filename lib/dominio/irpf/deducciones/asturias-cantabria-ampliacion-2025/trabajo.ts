import {
  r,
  magnitudAnualR,
  total,
  lista,
  exigir,
  edad,
  fecha,
  documento,
  intervalo,
  contiene,
  mesesDesde,
  limiteBase,
  pagos,
  reparto,
  resultado,
  conRegimen,
  excluida,
  dependencia,
  asturiasRural,
  cantabriaRural,
  incompatibles,
  vivienda,
  type MarcoB,
  type ResolucionB,
  type PagoB,
  type Intervalo,
  type Vivienda,
  type Uso,
  type Reparto,
} from "./comun"
import { descendiente, type Descendiente } from "./familia"
import { minimoTransporte } from "./transporte-minimo"
export type Residencia = Intervalo & {
  readonly territorio: string
  readonly municipio: string
}
export type Trabajo =
  | {
      readonly clase: "ajena"
      readonly contrato: ResolucionB
      readonly grupoCotizacion: number
    }
  | {
      readonly clase: "propia"
      readonly alta: ResolucionB
      readonly grupoCotizacion: number
      readonly actividad: string
      readonly modalidad: "autonomo" | "colaborador" | "socio_mercantil"
      readonly baja: string | null
      readonly fallecimiento: string | null
      readonly bajasPrevias: readonly {
        readonly fecha: string
        readonly actividad: string
      }[]
    }
export type Cualificacion = {
  readonly actividad:
    | "investigacion_basica"
    | "investigacion_aplicada"
    | "desarrollo_experimental"
    | "software_avanzado"
    | "innovacion_tecnologica"
    | "medioambiente"
    | "empresa_innovadora"
    | "promocion_empresarial"
    | "proyecto_pyme"
    | "rutinaria"
  readonly memoria: ResolucionB
  readonly proyecto: string
  readonly informeSoftware: ResolucionB | null
  readonly costesInvestigacion: readonly {
    readonly ejercicio: number
    readonly totalCostes: string
    readonly costesID: string
    readonly auditoria: ResolucionB
  }[]
  readonly fechaConstitucionEmpresa: string
  readonly evidenciasEuropeas: readonly {
    readonly clase:
      | "sello_excelencia"
      | "inversion_EIC"
      | "accion_CASSINI"
      | "inversion_CASSINI"
      | "ISEP"
      | "premio_CASSINI"
      | "espacio_empresa_emergente"
      | "Fondo_Europeo_Defensa"
      | "Programa_Desarrollo_Industrial_Defensa"
    readonly documento: ResolucionB
  }[]
  readonly evaluacionExternaRiesgo: ResolucionB | null
  readonly nuevosProductos: readonly string[]
  readonly nuevosMercados: readonly string[]
  readonly empleosEstablesCreados: number
  readonly trabajadoresAgregados: number
  readonly facturacionAgregada: string
  readonly balanceAgregado: string
}
function cualificado(t: Trabajo, c: Cualificacion | null): boolean {
  if (c === null) return false
  documento(c.memoria)
  exigir(c.proyecto.trim() !== "", "Proyecto cualificado sin identidad")
  if (t.grupoCotizacion !== 1 || c.actividad === "rutinaria") return false
  if (c.actividad === "software_avanzado") {
    if (c.informeSoftware === null) return false
    documento(c.informeSoftware)
  }
  if (c.actividad === "empresa_innovadora") {
    const f = fechaTrabajo(t),
      anio = Number(f.slice(0, 4))
    exigir(
      fecha(c.fechaConstitucionEmpresa),
      "Empresa innovadora sin fecha de constitución"
    )
    if (c.evaluacionExternaRiesgo !== null) documento(c.evaluacionExternaRiesgo)
    const europea = c.evidenciasEuropeas.some((e) => {
      documento(e.documento)
      return e.documento.fecha >= mesesDesde(f, -36) && e.documento.fecha <= f
    })
    const id = c.costesInvestigacion.some((e) => {
      documento(e.auditoria)
      exigir(Number.isInteger(e.ejercicio), "Ejercicio de costes inválido")
      const dentro = e.ejercicio >= anio - 3 && e.ejercicio < anio
      const nueva =
        e.ejercicio === anio && c.fechaConstitucionEmpresa >= `${anio}-01-01`
      return (
        (dentro || nueva) &&
        r(e.totalCostes).cmp(r("0")) > 0 &&
        r(e.costesID).cmp(r(e.totalCostes).times(r("0.10"))) >= 0
      )
    })
    if (c.evaluacionExternaRiesgo === null && !europea && !id) return false
  }
  if (
    c.actividad === "promocion_empresarial" &&
    c.nuevosProductos.length === 0 &&
    c.nuevosMercados.length === 0 &&
    c.empleosEstablesCreados <= 0
  )
    return false
  if (
    c.actividad === "proyecto_pyme" &&
    (c.trabajadoresAgregados >= 250 ||
      (r(c.facturacionAgregada).cmp(r("50000000")) > 0 &&
        r(c.balanceAgregado).cmp(r("43000000")) > 0))
  )
    return false
  return true
}
export function fechaTrabajo(t: Trabajo): string {
  const d = t.clase === "ajena" ? t.contrato : t.alta
  documento(d)
  return d.fecha
}
function trabajoVigente(t: Trabajo): boolean {
  const f = fechaTrabajo(t)
  if (t.clase === "ajena") return true
  if (t.baja !== null) {
    exigir(
      fecha(t.baja) && t.baja >= f && t.baja <= "2025-12-31",
      "Baja no observable o anterior al alta"
    )
    if (t.baja < mesesDesde(f, 12) && t.fallecimiento === null) return false
  }
  if (t.fallecimiento !== null)
    exigir(
      fecha(t.fallecimiento) &&
        t.fallecimiento >= f &&
        t.fallecimiento <= "2025-12-31",
      "Fallecimiento no observable o anterior al alta"
    )
  return true
}
export function diaSiguiente(f: string): string {
  exigir(fecha(f), "Día inválido")
  const candidato =
    f.slice(0, 8) + String(Number(f.slice(8, 10)) + 1).padStart(2, "0")
  return fecha(candidato) ? candidato : mesesDesde(f.slice(0, 8) + "01", 1)
}
export function historiaResidencia(
  xs: readonly Residencia[],
  desde: string,
  hasta: string
): void {
  exigir(
    fecha(desde) && fecha(hasta) && desde <= hasta && xs.length > 0,
    "Falta historial de residencia del período requerido"
  )
  const orden = [...xs].sort((a, b) => a.inicio.localeCompare(b.inicio))
  let cubiertoHasta: string | null = null
  for (const x of orden) {
    intervalo(x)
    if (x.fin < desde || x.inicio > hasta) continue
    exigir(
      cubiertoHasta === null
        ? x.inicio <= desde
        : x.inicio === diaSiguiente(cubiertoHasta),
      "Historial de residencia con huecos o solapamientos"
    )
    cubiertoHasta = x.fin
  }
  exigir(
    cubiertoHasta !== null && cubiertoHasta >= hasta,
    "Historial de residencia no alcanza fecha requerida"
  )
}
export function fueraAntes(
  xs: readonly Residencia[],
  territorio: string,
  traslado: string,
  anios: number
): boolean {
  const desde = mesesDesde(traslado, -12 * anios)
  const hasta = traslado
  historiaResidencia(xs, desde, hasta)
  return !xs.some(
    (x) => x.territorio === territorio && x.inicio < traslado && x.fin >= desde
  )
}
export type GastoTraslado = PagoB & {
  readonly concepto:
    | "viaje_mudanza"
    | "escolarizacion"
    | "adquisicion"
    | "alquiler"
    | "alta_suministro"
    | "consumo_suministro"
  readonly etapa: "obligatoria" | "bachillerato" | "otra"
}
export type Traslado = {
  readonly id: string
  readonly fecha: string
  readonly origen: Residencia
  readonly destino: Vivienda
  readonly historia: readonly Residencia[]
  readonly trabajo: Trabajo | null
  readonly cualificacion: Cualificacion | null
  readonly gastos: readonly GastoTraslado[]
}
function validarTraslado(
  m: MarcoB,
  t: Traslado,
  territorio: string,
  cuatroAniosPrevios = true
): void {
  exigir(
    m.declarantes.includes(t.id) && fecha(t.fecha) && t.fecha <= "2025-12-31",
    "Traslado ajeno o futuro"
  )
  intervalo(t.origen)
  exigir(
    t.origen.inicio < t.fecha && diaSiguiente(t.origen.fin) === t.fecha,
    "Origen sin continuidad con el traslado"
  )
  exigir(
    t.destino.ocupacion.inicio === t.fecha && t.destino.destino === "habitual",
    "Destino distinto de residencia habitual desde traslado"
  )
  if (t.trabajo !== null) fechaTrabajo(t.trabajo)
  const anio = Number(t.fecha.slice(0, 4))
  exigir(anio <= 2025 && anio >= 2022, "Ventana anual de traslado no aplicable")
  historiaResidencia(
    t.historia,
    cuatroAniosPrevios ? mesesDesde(t.fecha, -48) : t.fecha,
    "2025-12-31"
  )
  exigir(
    t.historia.some(
      (x) => x.territorio === territorio && contiene(x, "2025-12-31")
    ),
    "Sin residencia actual en destino"
  )
}
export type FichaVehiculo = {
  readonly documento: ResolucionB
  readonly ruedas: number
  readonly asientosSinConductor: number
  readonly transporte: "pasajeros" | "mercancias"
  readonly masaSinBateriasKg: string
  readonly masaMaximaCargaKg: string
  readonly velocidadMaxKmh: string
  readonly potenciaKW: string
  readonly cilindradaCm3: string
  readonly pesoBrutoKg: string
}
function categoriaVehiculo(c: string, f: FichaVehiculo): boolean {
  documento(f.documento)
  exigir(
    Number.isInteger(f.ruedas) &&
      f.ruedas >= 2 &&
      Number.isInteger(f.asientosSinConductor) &&
      f.asientosSinConductor >= 0,
    "Dimensiones de vehículo inválidas"
  )
  const ligera =
    r(f.masaSinBateriasKg).cmp(r("350")) <= 0 &&
    r(f.velocidadMaxKmh).cmp(r("45")) <= 0 &&
    r(f.potenciaKW).cmp(r("4")) <= 0
  if (c === "M1")
    return (
      f.ruedas >= 4 &&
      f.transporte === "pasajeros" &&
      f.asientosSinConductor <= 8
    )
  if (c === "N1")
    return (
      f.transporte === "mercancias" &&
      r(f.masaMaximaCargaKg).cmp(r("3500")) <= 0
    )
  if (c === "L6e") return f.ruedas === 4 && ligera
  if (c === "L7e")
    return (
      f.ruedas === 4 &&
      !ligera &&
      r(f.masaSinBateriasKg).cmp(
        r(f.transporte === "pasajeros" ? "450" : "600")
      ) <= 0
    )
  if (["L3e", "L4e", "L5e"].includes(c))
    return (
      [2, 3].includes(f.ruedas) &&
      (r(f.cilindradaCm3).cmp(r("50")) > 0 ||
        r(f.velocidadMaxKmh).cmp(r("50")) > 0) &&
      r(f.pesoBrutoKg).cmp(r("1000")) <= 0
    )
  return false
}
export type HechosTrabajo =
  | {
      readonly codigo: "asturias_segundo_sucesivos_hijos_concejos_despoblamiento"
      readonly municipio: string
      readonly hijos: readonly (Descendiente & {
        readonly incorporacion: string
        readonly acta: ResolucionB
      })[]
    }
  | {
      readonly codigo: "asturias_autonomos_concejos_despoblamiento"
      readonly personas: readonly {
        readonly id: string
        readonly municipio: string
        readonly trabajo: Extract<Trabajo, { clase: "propia" }>
      }[]
    }
  | {
      readonly codigo: "asturias_transporte_publico_despoblamiento"
      readonly municipio: string
      readonly abonos: readonly {
        readonly id: string
        readonly titular: string
        readonly nominal: string
        readonly pagos: readonly PagoB[]
      }[]
      readonly descendientes: readonly {
        readonly id: string
        readonly persona: Descendiente
        readonly municipioEstudio: string
        readonly etapa: "bachillerato" | "fp" | "universidad" | "otra"
        readonly abonos: readonly {
          readonly id: string
          readonly nominal: string
          readonly pagosFamilia: readonly PagoB[]
        }[]
      }[]
    }
  | {
      readonly codigo: "asturias_formacion_trabajos_cualificados_idi"
      readonly personas: readonly {
        readonly id: string
        readonly finFormacion: string
        readonly inicioFormacion: string
        readonly trabajo: Trabajo
        readonly cualificacion: Cualificacion
        readonly gastos: readonly PagoB[]
        readonly aplicacionesPrevias: readonly {
          readonly ejercicio: number
          readonly formacion: string
        }[]
        readonly formacion: string
        readonly residencia: Residencia
      }[]
      readonly usos: readonly Uso[]
    }
  | {
      readonly codigo:
        | "asturias_traslado_domicilio_fiscal_motivos_laborales"
        | "cantabria_desplazamiento_permanencia_nuevos_residentes"
      readonly personas: readonly Traslado[]
      readonly usos: readonly Uso[]
    }
  | {
      readonly codigo: "asturias_vehiculos_electricos"
      readonly vehiculos: readonly {
        readonly id: string
        readonly compra: ResolucionB
        readonly categoria:
          | "M1"
          | "N1"
          | "L6e"
          | "L7e"
          | "L3e"
          | "L4e"
          | "L5e"
          | "otra"
        readonly estado: "nuevo" | "km0" | "usado"
        readonly propulsion: "enchufable" | "pila_combustible" | "otra"
        readonly uso: "privado" | "actividad"
        readonly ficha: FichaVehiculo
        readonly compradores: Reparto
        readonly compradorExpreso: string | null
        readonly regimen: "gananciales" | "otro"
        readonly pagos: readonly PagoB[]
        readonly ayudasPublicas: string
      }[]
    }
  | {
      readonly codigo: "asturias_emancipacion_jovenes_hasta_35"
      readonly personas: readonly {
        readonly id: string
        readonly nacimiento: string
        readonly fechaSalidaAscendientes: string
        readonly emancipacionesPrevias: readonly string[]
        readonly retornos: readonly string[]
        readonly vivienda: Vivienda
        readonly gastos: readonly PagoB[]
      }[]
    }
  | {
      readonly codigo: "asturias_ayudas_ela"
      readonly ayudas: readonly {
        readonly id: string
        readonly beneficiario: string
        readonly organismo: "principado_asturias" | "otro"
        readonly concesion: ResolucionB
        readonly enfermedad: "ELA" | "otra"
        readonly importeConcedido: string
        readonly integradoBaseGeneral: string
        readonly integradoBaseLiquidable: string
      }[]
    }
  | {
      readonly codigo: "cantabria_traslado_residencia_motivos_laborales_despoblamiento"
      readonly personas: readonly Traslado[]
    }
  | {
      readonly codigo: "cantabria_residencia_municipio_riesgo_despoblamiento"
      readonly personas: readonly {
        readonly id: string
        readonly nacimiento: string
        readonly residencias: readonly Residencia[]
      }[]
    }
  | {
      readonly codigo: "cantabria_ayuda_domestica"
      readonly empleado: string
      readonly altaCantabria: ResolucionB
      readonly vivienda: Vivienda
      readonly empleadores: readonly {
        readonly id: string
        readonly nacimiento: string
        readonly altaTGSS: ResolucionB
        readonly rendimientosTrabajo: string
        readonly rendimientosActividad: string
        readonly porcentajeReparto: string
      }[]
      readonly vinculo: "matrimonio" | "pareja_inscrita" | "monoparental"
      readonly registroPareja: ResolucionB | null
      readonly hijos: readonly Descendiente[]
      readonly cotizaciones: readonly PagoB[]
    }

export function evaluarTrabajo(m: MarcoB, h: HechosTrabajo) {
  switch (h.codigo) {
    case "asturias_segundo_sucesivos_hijos_concejos_despoblamiento": {
      if (!asturiasRural(h.municipio) || !limiteBase(m, "35000", "45000"))
        return excluida("Sin concejo rural o base excedida")
      lista(h.hijos)
      const orden = [...h.hijos].sort(
        (a, b) =>
          a.incorporacion.localeCompare(b.incorporacion) ||
          a.id.localeCompare(b.id)
      )
      let sum = r("0")
      for (const [i, p] of orden.entries()) {
        descendiente(p, m)
        documento(p.acta)
        exigir(
          fecha(p.incorporacion) && p.incorporacion >= p.nacimiento,
          "Incorporación anterior al nacimiento"
        )
        if (
          i > 0 &&
          p.incorporacion.startsWith("2025-") &&
          contiene(p.convivencia, "2025-12-31")
        )
          sum = sum.plus(r("300").times(reparto(m, p)))
      }
      return resultado(
        sum,
        "Asturias art.14quater:segundo y sucesivos por incorporación familiar,300/reparto"
      )
    }
    case "asturias_autonomos_concejos_despoblamiento": {
      if (!limiteBase(m, "35000", "45000"))
        return excluida("Base excedida para autónomos rurales")
      lista(h.personas)
      let sum = r("0")
      const pendientes: string[] = []
      for (const p of h.personas) {
        exigir(m.declarantes.includes(p.id), "Autónomo ajeno")
        const f = fechaTrabajo(p.trabajo)
        if (
          !asturiasRural(p.municipio) ||
          !f.startsWith("2025-") ||
          p.trabajo.modalidad !== "autonomo" ||
          !trabajoVigente(p.trabajo)
        )
          continue
        if (
          p.trabajo.bajasPrevias.some((b) => {
            exigir(fecha(b.fecha) && b.fecha <= f, "Baja previa inválida")
            return (
              b.actividad === p.trabajo.actividad &&
              b.fecha >= mesesDesde(f, -6)
            )
          })
        )
          continue
        sum = sum.plus(r("1000"))
        if (mesesDesde(f, 12) > "2025-12-31")
          pendientes.push(
            `${p.id}:mantener alta hasta${mesesDesde(f, 12)} salvo fallecimiento`
          )
      }
      return resultado(
        sum,
        "Asturias art.14quinquies:alta2025,excluye colaboradores y socios de capital,ceses últimos6meses",
        pendientes
      )
    }
    case "asturias_transporte_publico_despoblamiento": {
      if (!asturiasRural(h.municipio) || !limiteBase(m, "35000", "45000"))
        return excluida("Sin residencia rural o base excedida")
      lista(h.abonos)
      lista(h.descendientes)
      lista([...h.abonos, ...h.descendientes.flatMap((x) => x.abonos)])
      const porPersona = m.declarantes.map((id) =>
        total(
          h.abonos
            .filter((a) => a.titular === id)
            .map((a) => {
              exigir(a.nominal === id, "Abono no nominal al titular")
              return pagos(a.pagos, m.declarantes)
            })
        ).min(r("100"))
      )
      let sum = total(porPersona)
      for (const x of h.descendientes) {
        descendiente(x.persona, m)
        exigir(x.id === x.persona.id, "Identidad de estudiante incoherente")
        lista(x.abonos)
        if (
          !minimoTransporte(x.persona) ||
          x.municipioEstudio === h.municipio ||
          x.etapa === "otra"
        )
          continue
        const gasto = total(
          x.abonos.map((a) => {
            exigir(a.nominal === x.id, "Abono no nominal al descendiente")
            return pagos(a.pagosFamilia, x.persona.titulares)
          })
        )
        sum = sum.plus(
          gasto.times(r("0.10")).min(r("300")).times(reparto(m, x.persona))
        )
      }
      return resultado(
        sum,
        "Asturias art.14sexies:abonos nominales100 por declarante y10%/300 por descendiente; año de pago"
      )
    }
    case "asturias_formacion_trabajos_cualificados_idi": {
      incompatibles(m, h.usos, [
        "asturias_traslado_domicilio_fiscal_motivos_laborales",
      ])
      lista(h.personas)
      let sum = r("0")
      const pendientes: string[] = []
      for (const p of h.personas) {
        exigir(
          m.declarantes.includes(p.id) &&
            fecha(p.inicioFormacion) &&
            fecha(p.finFormacion) &&
            p.inicioFormacion <= p.finFormacion,
          "Formación sin fechas o titular"
        )
        const f = fechaTrabajo(p.trabajo)
        if (
          !f.startsWith("2025-") ||
          f < p.finFormacion ||
          f > mesesDesde(p.finFormacion, 36) ||
          !cualificado(p.trabajo, p.cualificacion) ||
          !trabajoVigente(p.trabajo)
        )
          continue
        exigir(
          p.aplicacionesPrevias.every(
            (a) =>
              Number.isInteger(a.ejercicio) &&
              a.ejercicio <= 2025 &&
              a.formacion.trim() !== ""
          ),
          "Antecedente de formación inválido o futuro"
        )
        if (p.aplicacionesPrevias.length > 0) continue
        exigir(
          p.residencia.territorio === "asturias" &&
            contiene(p.residencia, "2025-12-31"),
          "Sin residencia asturiana"
        )
        lista(p.gastos)
        const gasto = total(
          p.gastos.map((g) => {
            exigir(
              g.fecha >= p.inicioFormacion && g.fecha <= p.finFormacion,
              "Gasto fuera de formación"
            )
            return pagos([g], [p.id], false, Number(g.fecha.slice(0, 4)))
          })
        )
        sum = sum.plus(gasto.min(r("2000")))
        pendientes.push(
          `${p.id}:residencia asturiana3años desde${p.residencia.inicio};alta propia1año salvo fallecimiento`
        )
      }
      return resultado(
        sum,
        "Asturias art.14septies:gastos históricos de formación,una vez al incorporarse;grupo1 y actividad concreta",
        pendientes
      )
    }
    case "asturias_traslado_domicilio_fiscal_motivos_laborales":
    case "cantabria_desplazamiento_permanencia_nuevos_residentes": {
      const ast =
          h.codigo === "asturias_traslado_domicilio_fiscal_motivos_laborales",
        territorio = ast ? "asturias" : "cantabria"
      lista(h.personas)
      let sum = r("0")
      const pendientes: string[] = []
      for (const p of h.personas) {
        validarTraslado(m, p, territorio)
        if (!fueraAntes(p.historia, territorio, p.fecha, 4)) continue
        if (ast && p.trabajo === null) continue
        if (p.trabajo !== null && !trabajoVigente(p.trabajo)) continue
        const cuali =
          p.trabajo !== null && cualificado(p.trabajo, p.cualificacion)
        if (ast && cuali)
          incompatibles(m, h.usos, [
            "asturias_formacion_trabajos_cualificados_idi",
          ])
        const permitidos = p.gastos.filter(
          (g) =>
            g.concepto !== "consumo_suministro" &&
            (ast || g.concepto !== "adquisicion") &&
            (ast ||
              g.concepto !== "escolarizacion" ||
              ["obligatoria", "bachillerato"].includes(g.etapa))
        )
        const gasto = pagos(permitidos, [p.id])
        const laboral = p.trabajo !== null
        sum = sum.plus(
          gasto
            .times(r(ast ? "0.15" : laboral ? "0.25" : "0.10"))
            .min(r(ast ? (cuali ? "2000" : "1000") : laboral ? "1500" : "1000"))
        )
        pendientes.push(
          `${p.id}:mantener residencia hasta31/12/${Number(p.fecha.slice(0, 4)) + 3}`
        )
        if (!ast)
          pendientes.push(
            `${p.id}:prioridad de cuota de art.2.16;arrastre de cuatro ejercicios por insuficiencia`
          )
      }
      const calculo = resultado(
        sum,
        ast
          ? "Asturias art.14octies:15%,1000/2000 y4anualidades"
          : "Cantabria art.2.16:10%/1000 o25%/1500 y4anualidades",
        pendientes
      )
      return ast
        ? calculo
        : conRegimen(calculo, {
            ejercicioOrigen: 2025,
            prioridadCuota: "primera",
            arrastreInsuficiencia: 4,
            arrastreExcesoLimite: 0,
            excesoLimiteGenerado: r("0").exacto(),
            pagosOrigen: h.personas.flatMap((p) => p.gastos.map((g) => g.id)),
          })
    }
    case "asturias_vehiculos_electricos": {
      lista(h.vehiculos)
      lista(h.vehiculos.flatMap((v) => v.pagos))
      let sum = r("0")
      for (const v of h.vehiculos) {
        documento(v.compra)
        if (
          v.compra.fecha < "2022-01-01" ||
          v.compra.fecha > "2025-12-31" ||
          v.estado === "usado" ||
          v.propulsion === "otra" ||
          v.categoria === "otra" ||
          v.uso === "actividad" ||
          !categoriaVehiculo(v.categoria, v.ficha)
        )
          continue
        const f = reparto(m, v.compradores)
        if (v.compradorExpreso !== null)
          exigir(
            v.compradores.titulares.length === 1 &&
              v.compradores.titulares[0] === v.compradorExpreso,
            "Comprador expreso no coincide con titular único"
          )
        else
          exigir(
            v.regimen === "gananciales" || v.compradores.titulares.length === 1,
            "Sin comprador expreso no procede reparto fuera de gananciales"
          )
        const gasto = pagos(v.pagos, v.compradores.titulares),
          base = gasto.minus(r(v.ayudasPublicas)).max(r("0")).min(r("50000"))
        sum = sum.plus(base.times(r("0.15")).times(f))
      }
      return resultado(
        sum.min(r("7500")),
        "Asturias art.14undecies:15% sobre gasto neto de ayudas,base máxima50000;categorías derivadas de ficha técnica MOVES,sin afectación"
      )
    }
    case "asturias_emancipacion_jovenes_hasta_35": {
      if (!limiteBase(m, "35000", "45000"))
        return excluida("Base excedida para emancipación")
      lista(h.personas)
      let sum = r("0")
      const pendientes: string[] = []
      for (const p of h.personas) {
        exigir(
          m.declarantes.includes(p.id) && fecha(p.fechaSalidaAscendientes),
          "Emancipación sin titular o fecha"
        )
        exigir(
          p.emancipacionesPrevias.every(
            (f) => fecha(f) && f < p.fechaSalidaAscendientes
          ) &&
            p.retornos.every(
              (f) =>
                fecha(f) && f >= p.fechaSalidaAscendientes && f <= "2025-12-31"
            ),
          "Historial de emancipaciones/retornos contradictorio"
        )
        if (
          edad(p.nacimiento) > 35 ||
          !p.fechaSalidaAscendientes.startsWith("2025-") ||
          p.emancipacionesPrevias.length > 0 ||
          !vivienda(p.vivienda) ||
          p.vivienda.ocupacion.inicio !== p.fechaSalidaAscendientes
        )
          continue
        if (
          p.retornos.some((f) => {
            exigir(fecha(f) && f <= "2025-12-31", "Retorno futuro o inválido")
            return f < mesesDesde(p.fechaSalidaAscendientes, 36)
          })
        )
          continue
        sum = sum.plus(pagos(p.gastos, [p.id]).min(r("1000")))
        pendientes.push(
          `${p.id}:no retornar al hogar familiar antes de${mesesDesde(p.fechaSalidaAscendientes, 36)}`
        )
      }
      return resultado(
        sum,
        "Asturias art.14terdecies:primera emancipación,edad<=35 y gasto efectivo hasta1000",
        pendientes
      )
    }
    case "asturias_ayudas_ela": {
      lista(h.ayudas)
      let liquidable = r("0")
      for (const a of h.ayudas) {
        documento(a.concesion)
        exigir(
          m.declarantes.includes(a.beneficiario),
          "Ayuda de otro beneficiario"
        )
        const concedido = r(a.importeConcedido),
          general = magnitudAnualR(a.integradoBaseGeneral),
          bl = magnitudAnualR(a.integradoBaseLiquidable)
        exigir(
          general.cmp(concedido) <= 0 && bl.cmp(general) <= 0,
          "Importes integrados contradictorios"
        )
        if (
          a.organismo === "principado_asturias" &&
          a.enfermedad === "ELA" &&
          general.cmp(r("0")) > 0
        )
          liquidable = liquidable.plus(bl)
      }
      if (liquidable.cmp(r("0")) === 0)
        return resultado(
          r("0"),
          "Asturias art.14quaterdecies:sin ayuda ELA integrada en base liquidable"
        )
      exigir(
        m.modalidad === "individual",
        "ELA conjunta:separar cuantía integrada y tipos medios por contribuyente"
      )
      return dependencia(
        {
          clase: "ela_tipos_medios",
          contribuyente: m.contribuyente,
          ayudaEnBaseLiquidable: liquidable.exacto(),
          referencias: [
            "tipo_medio_estatal_2025",
            "tipo_medio_autonomico_2025",
          ],
          operacion: "importe_por_suma_tipos_dividida_100",
        },
        "Asturias art.14quaterdecies:ayuda enBL por suma de tipos medios /100",
        [
          "Conectar tipos medios2025 identificados en liquidación, no importe de deducción externo",
        ]
      )
    }
    case "cantabria_traslado_residencia_motivos_laborales_despoblamiento": {
      lista(h.personas)
      const personas: string[] = [],
        pendientes: string[] = []
      for (const p of h.personas) {
        validarTraslado(m, p, "cantabria", false)
        const anio = Number(p.fecha.slice(0, 4))
        if (
          anio < 2024 ||
          !cantabriaRural(p.destino.municipio) ||
          p.trabajo === null ||
          p.origen.territorio === "extranjero"
        )
          continue
        if (pagos(p.gastos, [p.id], true).cmp(r("0")) === 0) continue
        personas.push(p.id)
        pendientes.push(
          `${p.id}:residencia en destino año${anio} y tres siguientes`
        )
      }
      if (personas.length === 0)
        return resultado(
          r("0"),
          "Cantabria art.2.11.3:sin traslado laboral en2024/2025"
        )
      return dependencia(
        {
          clase: "traslado_rural_trabajo",
          personas,
          maximoPorPersona: "500",
          referencia:
            "cuota_integra_autonomica_2025_trabajo_actividad_por_contribuyente",
        },
        "Cantabria art.2.11.3:min(500 por persona,cuota atribuible a trabajo/actividad)",
        pendientes
      )
    }
    case "cantabria_residencia_municipio_riesgo_despoblamiento": {
      lista(h.personas)
      const personas: string[] = []
      for (const p of h.personas) {
        exigir(m.declarantes.includes(p.id), "Residente ajeno")
        historiaResidencia(p.residencias, "2025-01-01", "2025-12-31")
        if (
          edad(p.nacimiento) >= 40 ||
          !p.residencias
            .filter((x) => x.inicio <= "2025-12-31" && x.fin >= "2025-01-01")
            .every(
              (x) => x.territorio === "cantabria" && cantabriaRural(x.municipio)
            )
        )
          continue
        personas.push(p.id)
      }
      if (personas.length === 0)
        return resultado(
          r("0"),
          "Cantabria art.2.11.5:sin persona menor40 residente rural todo2025"
        )
      return dependencia(
        {
          clase: "residencia_rural_cuota",
          personas,
          porcentaje: "20",
          maximoPorPersona: "500",
          referencia: "cuota_integra_autonomica_2025_por_contribuyente",
        },
        "Cantabria art.2.11.5:min(20%cuota,500) por contribuyente",
        [
          "Conectar cuota íntegra autonómica identificada una vez;no cuota líquida ni gasto",
        ]
      )
    }
    case "cantabria_ayuda_domestica": {
      documento(h.altaCantabria)
      lista(h.empleadores)
      lista(h.hijos)
      exigir(
        h.empleado.trim() !== "" &&
          !h.empleadores.some((p) => p.id === h.empleado) &&
          h.empleadores.length >= 1 &&
          h.empleadores.length <= 2,
        "Empleado confundido con empleador o sin hogar definido"
      )
      if (!vivienda(h.vivienda) || !/^39\d{3}$/.test(h.vivienda.municipio))
        return excluida("Sin hogar habitual en Cantabria")
      if (h.vinculo === "pareja_inscrita") {
        exigir(h.registroPareja !== null, "Pareja sin inscripción")
        documento(h.registroPareja)
      }
      if (h.vinculo === "monoparental")
        exigir(
          h.empleadores.length === 1,
          "Monoparental con dos titulares de hogar"
        )
      for (const e of h.empleadores) documento(e.altaTGSS)
      const padres = h.empleadores.map((p) => p.id),
        hijos = h.hijos.filter((p) => {
          descendiente(p, m)
          return (
            edad(p.nacimiento) < 18 && contiene(p.convivencia, "2025-12-31")
          )
        })
      const mayores = h.empleadores.some((p) => edad(p.nacimiento) >= 75),
        laboral = h.empleadores.every(
          (p) =>
            magnitudAnualR(p.rendimientosTrabajo)
              .plus(magnitudAnualR(p.rendimientosActividad, true))
              .cmp(r("0")) > 0
        )
      if (!mayores && !(hijos.length > 0 && laboral))
        return excluida(
          "Sin titular/pareja>=75 ni familia con menor y rentas de trabajo/actividad requeridas"
        )
      exigir(
        total(h.empleadores.map((p) => r(p.porcentajeReparto))).cmp(
          r("100")
        ) === 0,
        "Porcentajes de reparto doméstico no suman100"
      )
      const comun = pagos(h.cotizaciones, padres),
        porcentaje = total(
          h.empleadores
            .filter((e) => m.declarantes.includes(e.id))
            .map((e) => r(e.porcentajeReparto))
        ).div(r("100"))
      return resultado(
        comun.times(r("0.20")).min(r("300")).times(porcentaje),
        "Cantabria art.2.14:20%cotizaciones,300 por única persona empleada;reparto acordado entre empleadores TGSS"
      )
    }
  }
}
