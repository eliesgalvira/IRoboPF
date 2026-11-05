import {
  r,
  magnitudAnualR,
  total,
  lista,
  exigir,
  documento,
  fecha,
  mesesDesde,
  intervalo,
  contiene,
  pagos,
  resultado,
  conRegimen,
  excluida,
  incompatibles,
  type MarcoB,
  type PagoB,
  type ResolucionB,
  type Intervalo,
  type Uso,
} from "./comun"
import { historiaResidencia, type Residencia } from "./trabajo"
export type Participacion = Intervalo & {
  readonly personas: readonly {
    readonly id: string
    readonly vinculo:
      | "titular"
      | "conyuge"
      | "pareja_registrada"
      | "consanguinidad"
      | "afinidad"
    readonly grado: number
    readonly registroPareja: ResolucionB | null
    readonly capital: string
    readonly votos: string
  }[]
}
function participacion(
  xs: readonly Participacion[],
  m: MarcoB,
  hastaGrado: number
): boolean {
  historiaResidencia(
    xs.map((x) => ({ ...x, territorio: "participacion", municipio: "" })),
    "2025-01-01",
    "2025-12-31"
  )
  for (const x of xs) {
    lista(x.personas)
    let capital = r("0"),
      votos = r("0")
    for (const p of x.personas) {
      exigir(
        Number.isInteger(p.grado) &&
          p.grado >= 0 &&
          r(p.capital).cmp(r("100")) <= 0 &&
          r(p.votos).cmp(r("100")) <= 0,
        "Porcentaje/parentesco inválidos"
      )
      if (p.vinculo === "pareja_registrada") {
        exigir(p.registroPareja !== null, "Pareja sin registro")
        documento(p.registroPareja)
      }
      if (p.vinculo === "titular") {
        exigir(m.declarantes.includes(p.id), "Titular de participación ajeno")
      }
      if (
        p.vinculo === "titular" ||
        p.vinculo === "conyuge" ||
        p.vinculo === "pareja_registrada" ||
        p.grado <= hastaGrado
      ) {
        capital = capital.plus(r(p.capital))
        votos = votos.plus(r(p.votos))
      }
    }
    if (capital.cmp(r("40")) > 0 || votos.cmp(r("40")) > 0) return false
  }
  return true
}
export type ActivoEmpresa = {
  readonly id: string
  readonly valor: string
  readonly uso:
    | "explotacion"
    | "patrimonio_mobiliario"
    | "patrimonio_inmobiliario"
} & (
  | { readonly exclusion: "ninguna" }
  | {
      readonly exclusion: "participacion_gestionada"
      readonly porcentajeCapital: string
      readonly desde: string
      readonly mediosPersonales: number
      readonly gestion: ResolucionB
      readonly diasPredominioPatrimonialParticipada: number
    }
  | {
      readonly exclusion: "beneficios_actividad_10_ejercicios"
      readonly beneficios: readonly {
        readonly ejercicio: number
        readonly noDistribuido: string
      }[]
    }
)
function patrimonioActivo(a: ActivoEmpresa): ReturnType<typeof r> {
  const valor = r(a.valor)
  if (a.uso === "explotacion") return r("0")
  if (a.exclusion === "participacion_gestionada") {
    documento(a.gestion)
    exigir(
      fecha(a.desde) &&
        Number.isInteger(a.mediosPersonales) &&
        Number.isInteger(a.diasPredominioPatrimonialParticipada) &&
        a.diasPredominioPatrimonialParticipada >= 0 &&
        a.diasPredominioPatrimonialParticipada <= 365,
      "Datos de participación gestionada inválidos"
    )
    return r(a.porcentajeCapital).cmp(r("5")) >= 0 &&
      a.desde <= "2024-12-31" &&
      a.mediosPersonales > 0 &&
      a.diasPredominioPatrimonialParticipada <= 90
      ? r("0")
      : valor
  }
  if (a.exclusion === "beneficios_actividad_10_ejercicios") {
    exigir(
      new Set(a.beneficios.map((b) => b.ejercicio)).size ===
        a.beneficios.length &&
        a.beneficios.every(
          (b) =>
            Number.isInteger(b.ejercicio) &&
            b.ejercicio >= 2016 &&
            b.ejercicio <= 2025
        ),
      "Beneficios fuera de diez ejercicios o repetidos"
    )
    return valor
      .minus(total(a.beneficios.map((b) => r(b.noDistribuido))))
      .max(r("0"))
  }
  return valor
}
export type Empresa = {
  readonly id: string
  readonly forma:
    | "SA"
    | "SL"
    | "SAL"
    | "SLL"
    | "cooperativa"
    | "mutualidad"
    | "insercion"
    | "centro_empleo"
    | "cofradia"
    | "SAT"
    | "fundacion"
    | "asociacion"
    | "otra"
  readonly constitucion: ResolucionB
  readonly domicilioSocial: string
  readonly domicilioFiscal: string
  readonly agregacionPyme: readonly {
    readonly id: string
    readonly relacion: "propia" | "vinculada" | "asociada"
    readonly porcentajeCapital: string
    readonly porcentajeVoto: string
    readonly trabajadores: string
    readonly facturacion: string
    readonly balance: string
  }[]
  readonly balances: readonly (Intervalo & {
    readonly activos: readonly ActivoEmpresa[]
  })[]
  readonly empleo: readonly {
    readonly id: string
    readonly alta: string
    readonly baja: string | null
    readonly jornada: "completa" | "parcial"
    readonly regimen: "general" | "otro"
    readonly municipioResidencia: string
  }[]
  readonly cierrePrimerEjercicio: string
  readonly plantillas: readonly {
    readonly ejercicio: number
    readonly mediaEquivalentes: string
    readonly documento: ResolucionB
  }[]
  readonly plantilla12MesesPrevios: string
  readonly registroEconomiaSocial: ResolucionB | null
}
function empresa(e: Empresa): void {
  documento(e.constitucion)
  exigir(
    e.id.trim() !== "" && fecha(e.cierrePrimerEjercicio),
    "Empresa sin identidad/cierre fiscal"
  )
  lista(e.agregacionPyme)
  lista(e.empleo)
  for (const p of e.empleo)
    exigir(
      fecha(p.alta) &&
        (p.baja === null ||
          (fecha(p.baja) && p.baja >= p.alta && p.baja <= "2025-12-31")),
      "Empleo con fechas inválidas/no observadas"
    )
}
function pyme(e: Empresa): boolean {
  exigir(
    e.agregacionPyme.length > 0 &&
      e.agregacionPyme.some((x) => x.id === e.id && x.relacion === "propia"),
    "Falta agregación PYME de entidad propia,asociadas/vinculadas"
  )
  let trabajadores = r("0"),
    ventas = r("0"),
    balance = r("0")
  for (const x of e.agregacionPyme) {
    const ponderacion =
      x.relacion === "asociada"
        ? r(x.porcentajeCapital).max(r(x.porcentajeVoto)).div(r("100"))
        : r("1")
    exigir(ponderacion.cmp(r("1")) <= 0, "Porcentaje de asociada>100")
    trabajadores = trabajadores.plus(r(x.trabajadores).times(ponderacion))
    ventas = ventas.plus(r(x.facturacion).times(ponderacion))
    balance = balance.plus(r(x.balance).times(ponderacion))
  }
  return (
    trabajadores.cmp(r("250")) < 0 &&
    (ventas.cmp(r("50000000")) <= 0 || balance.cmp(r("43000000")) <= 0)
  )
}
function economica(e: Empresa): boolean {
  exigir(
    e.balances.length > 0,
    "Faltan balances temporales para distinguir actividad y patrimonio"
  )
  historiaResidencia(
    e.balances.map((x) => ({ ...x, territorio: "balance", municipio: "" })),
    e.constitucion.fecha > "2025-01-01" ? e.constitucion.fecha : "2025-01-01",
    "2025-12-31"
  )
  let diasPatrimoniales = 0
  const orden = [...e.balances].sort((a, b) => a.inicio.localeCompare(b.inicio))
  let anterior = ""
  for (const b of orden) {
    intervalo(b)
    exigir(
      anterior === "" || b.inicio > anterior,
      "Balances temporales solapados"
    )
    anterior = b.fin
    lista(b.activos)
    const completo = total(b.activos.map((a) => r(a.valor))),
      patrimonio = total(b.activos.map(patrimonioActivo))
    if (patrimonio.times(r("2")).cmp(completo) > 0) {
      // Cuenta días civiles con bucle acotado, sin convertir importes a Number.
      let dia = b.inicio
      let n = 0
      while (dia <= b.fin) {
        if (dia >= "2025-01-01" && dia <= "2025-12-31") diasPatrimoniales++
        n++
        exigir(n <= 370, "Balance debe estar segmentado en intervalos anuales")
        dia = siguiente(dia)
      }
    }
  }
  return diasPatrimoniales <= 90
}
function siguiente(f: string): string {
  const s = f.slice(0, 8) + String(Number(f.slice(8, 10)) + 1).padStart(2, "0")
  return fecha(s) ? s : mesesDesde(f.slice(0, 8) + "01", 1)
}
function empleoInicial(e: Empresa, cantabria: boolean): boolean {
  if (e.cierrePrimerEjercicio > "2025-12-31") return true
  return e.empleo.some(
    (p) =>
      p.jornada === "completa" &&
      p.regimen === "general" &&
      p.alta <= e.cierrePrimerEjercicio &&
      (p.baja === null || p.baja >= e.cierrePrimerEjercicio) &&
      (!cantabria || /^39\d{3}$/.test(p.municipioResidencia))
  )
}
export type OperacionNueva = {
  readonly id: string
  readonly fecha: string
  readonly tipo: "constitucion" | "ampliacion"
  readonly empresa: Empresa
  readonly pagos: readonly PagoB[]
  readonly escritura: ResolucionB | null
  readonly participaciones: readonly Participacion[]
  readonly funciones: readonly {
    readonly persona: string
    readonly desde: string
    readonly hasta: string
    readonly funcion:
      | "administracion_no_ejecutiva"
      | "ejecutiva"
      | "direccion"
      | "empleo"
  }[]
  readonly transmisiones: readonly {
    readonly fecha: string
    readonly importe: string
  }[]
}
export type EntidadDonataria = {
  readonly id: string
  readonly clase:
    | "fundacion"
    | "fondo_cantabria_coopera"
    | "asociacion_discapacidad"
  readonly domicilio: string
  readonly registro: ResolucionB | null
  readonly cuentasProtectorado: ResolucionB | null
  readonly depositoCuentas: ResolucionB | null
  readonly fines: readonly (
    | "cultural"
    | "asistencial"
    | "deportivo"
    | "sanitario"
    | "discapacidad"
    | "otro"
  )[]
  readonly utilidadPublica: ResolucionB | null
  readonly ingresos: string
  readonly aplicadoFinesInteresGeneral: string
  readonly memoriaEconomica: ResolucionB | null
  readonly certificacionDonacion: ResolucionB
}
export type HechosInversion =
  | {
      readonly codigo:
        | "asturias_inversion_entidades_nuevas_reciente_creacion"
        | "cantabria_inversion_entidades_nuevas_reciente_creacion"
      readonly operaciones: readonly OperacionNueva[]
      readonly usos: readonly Uso[]
    }
  | {
      readonly codigo: "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad"
      readonly baseLiquidable: string
      readonly baseEstatal68_3: string
      readonly baseEstatal68_5: string
      readonly donaciones: readonly {
        readonly id: string
        readonly entidad: EntidadDonataria
        readonly pagos: readonly PagoB[]
      }[]
      readonly usos: readonly Uso[]
    }
  | {
      readonly codigo: "cantabria_inversiones_donaciones_economia_social"
      readonly operaciones: readonly {
        readonly id: string
        readonly clase:
          | "aportacion_ser_socio"
          | "donacion_actividad"
          | "donacion_difusion"
        readonly empresa: Empresa
        readonly pagos: readonly PagoB[]
        readonly participaciones: readonly Participacion[]
        readonly escritura: ResolucionB
        readonly certificacion: ResolucionB | null
        readonly caracter: "irrevocable" | "revocable"
        readonly actividadDifusion:
          | "formacion"
          | "asesoramiento"
          | "promocion"
          | "otra"
        readonly transmisiones: readonly string[]
      }[]
      readonly usos: readonly Uso[]
    }
  | {
      readonly codigo: "cantabria_inversiones_nuevos_contribuyentes_extranjero"
      readonly fechaResidenciaFiscal: string
      readonly paisesPrevios: readonly {
        readonly ejercicio: number
        readonly pais: "ES" | "otro"
        readonly documento: ResolucionB
      }[]
      readonly residenciaActual: Residencia
      readonly inversiones: readonly {
        readonly id: string
        readonly fecha: string
        readonly clase: "inmueble" | "cesion_capital" | "fondos_propios"
        readonly destinoInmueble: "no_vivienda" | "vivienda" | "turistico"
        readonly municipio: string
        readonly entidadEspanola: "si" | "no"
        readonly empresa: Empresa | null
        readonly participaciones: readonly Participacion[]
        readonly funciones: OperacionNueva["funciones"]
        readonly pagos: readonly (PagoB & {
          readonly concepto: "precio" | "gasto_tributo" | "interes"
        })[]
        readonly transmisiones: readonly {
          readonly fecha: string
          readonly importeCobrado: string
          readonly reinversiones: readonly {
            readonly id: string
            readonly fecha: string
            readonly euros: string
          }[]
        }[]
      }[]
      readonly usos: readonly Uso[]
    }

export function evaluarInversion(m: MarcoB, h: HechosInversion) {
  switch (h.codigo) {
    case "asturias_inversion_entidades_nuevas_reciente_creacion":
    case "cantabria_inversion_entidades_nuevas_reciente_creacion": {
      const cant = h.codigo.startsWith("cantabria_")
      lista(h.operaciones)
      lista(h.operaciones.flatMap((o) => o.pagos))
      let sum = r("0")
      const pendientes: string[] = []
      for (const o of h.operaciones) {
        empresa(o.empresa)
        exigir(
          fecha(o.fecha) && o.fecha >= o.empresa.constitucion.fecha,
          "Operación anterior a constitución"
        )
        if (!o.fecha.startsWith("2025-")) continue
        const formas = cant
          ? ["SA", "SL", "SAL", "SLL"]
          : ["SA", "SL", "SAL", "SLL", "cooperativa"]
        const territorio = cant ? "cantabria" : "asturias"
        if (
          !formas.includes(o.empresa.forma) ||
          o.empresa.domicilioSocial !== territorio ||
          o.empresa.domicilioFiscal !== territorio ||
          !pyme(o.empresa) ||
          !economica(o.empresa) ||
          !participacion(o.participaciones, m, 3)
        )
          continue
        if (cant) {
          exigir(
            o.escritura !== null,
            "Inversión cántabra sin escritura pública"
          )
          documento(o.escritura)
          if (
            o.funciones.some(
              (f) =>
                m.declarantes.includes(f.persona) &&
                f.funcion !== "administracion_no_ejecutiva"
            )
          )
            continue
          incompatibles(
            m,
            h.usos,
            [
              "cantabria_inversiones_donaciones_economia_social",
              "cantabria_inversiones_nuevos_contribuyentes_extranjero",
            ],
            o.id
          )
        }
        if (
          o.transmisiones.some((t) => {
            exigir(
              fecha(t.fecha) && t.fecha >= o.fecha && t.fecha <= "2025-12-31",
              "Transmisión no observable o anterior a inversión"
            )
            return t.fecha < mesesDesde(o.fecha, 36)
          })
        )
          continue
        if (o.tipo === "constitucion" && !empleoInicial(o.empresa, cant))
          continue
        if (o.tipo === "ampliacion") {
          if (o.fecha > mesesDesde(o.empresa.constitucion.fecha, 36)) continue
          const previo = r(o.empresa.plantilla12MesesPrevios)
          for (const p of o.empresa.plantillas) {
            documento(p.documento)
            if (
              p.ejercicio > Number(o.fecha.slice(0, 4)) &&
              p.ejercicio <= Number(o.fecha.slice(0, 4)) + 2 &&
              r(p.mediaEquivalentes).cmp(previo.plus(r("1"))) < 0
            )
              return excluida(
                "Plantilla posterior conocida no incrementa una persona equivalente"
              )
          }
          pendientes.push(
            `${o.id}:incremento plantilla al menos1 en dos ejercicios posteriores y mantenimiento24meses adicionales`
          )
        }
        sum = sum.plus(
          pagos(o.pagos, m.declarantes).times(r(cant ? "0.15" : "0.30"))
        )
        pendientes.push(
          `${o.id}:mantener participación hasta${mesesDesde(o.fecha, 36)};domicilios/actividad y demás condiciones societarias del régimen`
        )
      }
      return resultado(
        sum.min(r(cant ? "1000" : "6000")),
        cant
          ? "Cantabria art.2.6:15%/1000,escritura y sin funciones ejecutivas/empleo"
          : "Asturias art.14octodecies:30%/6000;no importar prohibiciones cántabras",
        pendientes
      )
    }
    case "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad": {
      lista(h.donaciones)
      lista(h.donaciones.flatMap((d) => d.pagos))
      let disponible = magnitudAnualR(h.baseLiquidable)
          .times(r("0.10"))
          .minus(magnitudAnualR(h.baseEstatal68_3))
          .minus(magnitudAnualR(h.baseEstatal68_5))
          .max(r("0")),
        sum = r("0")
      const pendientes: string[] = []
      // Orden explícito de la colección, conservado para base compartida; no se optimiza.
      for (const d of h.donaciones) {
        const e = d.entidad
        documento(e.certificacionDonacion)
        incompatibles(
          m,
          h.usos,
          ["cantabria_inversiones_donaciones_economia_social"],
          d.id
        )
        if (e.clase !== "fondo_cantabria_coopera") {
          if (e.domicilio !== "cantabria") continue
          exigir(e.registro !== null, "Donatario sin registro")
          documento(e.registro)
          if (e.clase === "fundacion") {
            exigir(
              e.cuentasProtectorado !== null && e.depositoCuentas !== null,
              "Fundación sin cuentas rendidas y depósito ordenado por Protectorado"
            )
            documento(e.cuentasProtectorado)
            documento(e.depositoCuentas)
            if (
              !e.fines.some((f) =>
                ["cultural", "asistencial", "deportivo", "sanitario"].includes(
                  f
                )
              )
            ) {
              exigir(
                !e.fines.includes("otro"),
                "Fundación con finalidad análoga no tipificada:aportar correspondencia normativa concreta antes de calcular"
              )
              continue
            }
          } else {
            exigir(
              e.utilidadPublica !== null && e.memoriaEconomica !== null,
              "Asociación sin utilidad pública o memoria económica"
            )
            documento(e.utilidadPublica)
            documento(e.memoriaEconomica)
            if (
              !e.fines.includes("discapacidad") ||
              r(e.aplicadoFinesInteresGeneral).cmp(
                r(e.ingresos).times(r("0.70"))
              ) < 0
            )
              continue
            pendientes.push(
              `${e.id}:art.3 Ley49/2002,límites a actividades ajenas,destinatarios y remuneración;aportar sus magnitudes antes de certificar rama completa`
            )
          }
        }
        const base = pagos(d.pagos, m.declarantes).min(disponible)
        sum = sum.plus(
          base.times(r(e.clase === "fondo_cantabria_coopera" ? "0.12" : "0.15"))
        )
        disponible = disponible.minus(base)
      }
      return resultado(
        sum,
        "Cantabria art.2.4:15% fundación/asociación o12%Fondo;10%BL compartido con68.3/68.5",
        pendientes
      )
    }
    case "cantabria_inversiones_donaciones_economia_social": {
      lista(h.operaciones)
      lista(h.operaciones.flatMap((o) => o.pagos))
      let sum = r("0")
      const pendientes: string[] = []
      for (const o of h.operaciones) {
        empresa(o.empresa)
        documento(o.escritura)
        if (o.certificacion !== null) documento(o.certificacion)
        incompatibles(
          m,
          h.usos,
          [
            "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad",
            "cantabria_inversion_entidades_nuevas_reciente_creacion",
          ],
          o.id
        )
        if (
          o.empresa.domicilioSocial !== "cantabria" ||
          o.empresa.domicilioFiscal !== "cantabria" ||
          !participacion(o.participaciones, m, 3)
        )
          continue
        exigir(
          o.empresa.registroEconomiaSocial !== null,
          "Entidad sin registro/catálogo de economía social"
        )
        documento(o.empresa.registroEconomiaSocial)
        if (
          ![
            "cooperativa",
            "mutualidad",
            "SAL",
            "SLL",
            "insercion",
            "centro_empleo",
            "cofradia",
            "SAT",
            "fundacion",
            "asociacion",
          ].includes(o.empresa.forma)
        )
          continue
        const plantilla = o.empresa.plantillas.find((p) => p.ejercicio === 2025)
        exigir(plantilla !== undefined, "Falta media anual de empleo2025")
        documento(plantilla.documento)
        if (
          r(plantilla.mediaEquivalentes).cmp(r("1")) < 0 ||
          !o.empresa.empleo.some(
            (p) => p.jornada === "completa" && p.regimen === "general"
          )
        )
          continue
        if (
          o.clase !== "aportacion_ser_socio" &&
          (o.certificacion === null || o.caracter !== "irrevocable")
        )
          continue
        if (o.clase === "donacion_difusion" && o.actividadDifusion === "otra")
          continue
        const origen = o.escritura.fecha
        if (
          o.clase === "aportacion_ser_socio" &&
          o.transmisiones.some((f) => {
            exigir(
              fecha(f) && f <= "2025-12-31",
              "Transmisión futura no observada"
            )
            return f < mesesDesde(origen, 60)
          })
        )
          continue
        sum = sum.plus(
          pagos(o.pagos, m.declarantes, true).times(
            r(
              o.clase === "aportacion_ser_socio"
                ? "0.20"
                : o.clase === "donacion_actividad"
                  ? "0.50"
                  : "0.25"
            )
          )
        )
        pendientes.push(
          `${o.id}:registro,domicilios y media anual de empleo>=1 durante3años${o.clase === "aportacion_ser_socio" ? ";participación patrimonial5años" : ""}`
        )
      }
      return resultado(
        sum.min(r("3000")),
        "Cantabria art.2.12:20%/50%/25%,máximo conjunto3000,sin duplicar operación",
        pendientes
      )
    }
    case "cantabria_inversiones_nuevos_contribuyentes_extranjero": {
      exigir(
        fecha(h.fechaResidenciaFiscal) &&
          h.fechaResidenciaFiscal >= "2025-01-01",
        "Primera residencia anterior al régimen2025"
      )
      const anio = Number(h.fechaResidenciaFiscal.slice(0, 4))
      if (anio > 2025)
        return excluida(
          "Aplicación diferida al ejercicio de residencia fiscal,posterior a2025"
        )
      exigir(
        h.residenciaActual.territorio === "cantabria" &&
          contiene(h.residenciaActual, "2025-12-31"),
        "Sin residencia actual cántabra"
      )
      exigir(
        h.paisesPrevios.length === 5 &&
          new Set(h.paisesPrevios.map((p) => p.ejercicio)).size === 5,
        "Faltan cinco ejercicios previos de residencia extranjera"
      )
      for (let y = anio - 5; y < anio; y++) {
        const p = h.paisesPrevios.find((p) => p.ejercicio === y)
        exigir(p !== undefined, "Falta ejercicio previo identificado")
        documento(p.documento)
        if (p.pais === "ES")
          return excluida(
            "Residencia española en alguno de los cinco años previos"
          )
      }
      lista(h.inversiones)
      lista(h.inversiones.flatMap((x) => x.pagos))
      let sum = r("0")
      const pendientes: string[] = []
      for (const i of h.inversiones) {
        exigir(fecha(i.fecha), "Fecha de inversión inválida")
        incompatibles(
          m,
          h.usos,
          ["cantabria_inversion_entidades_nuevas_reciente_creacion"],
          i.id
        )
        const anterior = i.clase !== "inmueble" && i.entidadEspanola === "si"
        const y = Number(i.fecha.slice(0, 4))
        if (y < anio - (anterior ? 1 : 0) || y > anio + 1 || y > 2025) continue
        if (i.clase === "inmueble") {
          if (
            i.destinoInmueble !== "no_vivienda" ||
            !/^39\d{3}$/.test(i.municipio)
          )
            continue
        } else {
          exigir(i.empresa !== null, "Valor sin entidad identificada")
          empresa(i.empresa)
          if (
            i.empresa.domicilioSocial !== "cantabria" ||
            i.empresa.domicilioFiscal !== "cantabria" ||
            !economica(i.empresa) ||
            !participacion(i.participaciones, m, 2)
          )
            continue
          if (
            i.funciones.some(
              (f) =>
                m.declarantes.includes(f.persona) &&
                f.funcion !== "administracion_no_ejecutiva"
            )
          )
            continue
        }
        let perdida = false
        for (const t of i.transmisiones) {
          exigir(
            fecha(t.fecha) && t.fecha >= i.fecha && t.fecha <= "2025-12-31",
            "Transmisión no observada o anterior a inversión"
          )
          if (t.fecha >= mesesDesde(i.fecha, 72)) continue
          lista(t.reinversiones)
          const reinvertido = total(
            t.reinversiones.map((re) => {
              exigir(
                fecha(re.fecha) &&
                  re.fecha >= t.fecha &&
                  re.fecha <= "2025-12-31",
                "Reinversión no observada"
              )
              return re.fecha <= mesesDesde(t.fecha, 1) ? r(re.euros) : r("0")
            })
          )
          if (reinvertido.cmp(r(t.importeCobrado)) < 0) {
            if (mesesDesde(t.fecha, 1) <= "2025-12-31") perdida = true
            else
              pendientes.push(
                `${i.id}:completar reinversión total antes de${mesesDesde(t.fecha, 1)}`
              )
          }
        }
        if (perdida) continue
        const gasto = total(
          i.pagos
            .filter((p) => p.concepto !== "interes")
            .map((p) => {
              exigir(
                p.fecha <= "2025-12-31",
                "Coste de adquisición aún no satisfecho"
              )
              return pagos(
                [p],
                m.declarantes,
                false,
                Number(p.fecha.slice(0, 4))
              )
            })
        )
        sum = sum.plus(gasto.times(r("0.20")))
        pendientes.push(
          `${i.id}:mantener inversión y residencia cántabra seis años hasta${mesesDesde(i.fecha, 72)};arrastre cinco ejercicios por insuficiencia de cuota`
        )
      }
      return conRegimen(
        resultado(
          sum,
          "Cantabria art.2.15:20%precio,gastos y tributos sin intereses;valores españoles pueden invertir año previo",
          pendientes
        ),
        {
          ejercicioOrigen: 2025,
          prioridadCuota: "ordinaria",
          arrastreInsuficiencia: 5,
          arrastreExcesoLimite: 0,
          excesoLimiteGenerado: r("0").exacto(),
          pagosOrigen: h.inversiones.flatMap((i) => i.pagos.map((p) => p.id)),
        }
      )
    }
  }
}
