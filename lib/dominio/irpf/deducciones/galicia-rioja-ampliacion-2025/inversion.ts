import {
  cero,
  mas,
  menos,
  por,
  compara,
  min,
  euros,
  exige,
  ids,
  fecha,
  dia,
  moverMes,
  documento,
  contexto,
  pagos,
  resultado,
  paso,
  proteger,
} from "./comun"
import type { Contexto, Documento, Periodo, Pago, Resultado } from "./comun"
export type Vigilancia = {
  readonly desde: string
  readonly hasta: string
  readonly corte: string
  readonly estado: "observado_sin_incumplimiento" | "incumplido"
  readonly soporte: Documento
}
function vigila(v: Vigilancia, desde: string, meses: number): boolean {
  documento(v.soporte)
  exige(
    fecha(v.desde) &&
      fecha(v.hasta) &&
      fecha(v.corte) &&
      v.desde <= desde &&
      v.hasta >= moverMes(desde, meses) &&
      v.corte >= "2025-12-31" &&
      ["observado_sin_incumplimiento", "incumplido"].includes(v.estado),
    "Seguimiento temporal incompleto"
  )
  return v.estado === "observado_sin_incumplimiento"
}
export type Empleo = {
  readonly id: string
  readonly contrato: Periodo
  readonly jornadaPorcentaje: number
  readonly residencia: "galicia" | "otra"
  readonly altaSS: Documento
}
export type Entidad = {
  readonly id: string
  readonly forma: "SA" | "SL" | "laboral" | "cooperativa"
  readonly socios: number
  readonly constitucion: string
  readonly domicilioSocial: "galicia" | "otro"
  readonly domicilioFiscal: "galicia" | "otro"
  readonly actividad: "economica" | "gestion_patrimonial"
  readonly seguimiento: Vigilancia
  readonly empleos: readonly Empleo[]
  readonly plantillaAnterior: string
  readonly plantillaPosterior: string
  readonly permanenciaPlantilla: Vigilancia
  readonly inicioEjercicioIS: string
  readonly selloInnovadora: Documento | null
  readonly calificacionIEBT: Documento | null
  readonly participacionUniversidad: Documento | null
  readonly agraria:
    | "SOFOR"
    | "gestion_conjunta"
    | "agraria_exclusiva"
    | "recuperacion_ley11_2021"
    | "otra"
  readonly registroAgrario: Documento | null
}
export type Operacion = {
  readonly id: string
  readonly entidad: Entidad
  readonly titular: string
  readonly fecha: string
  readonly modalidad:
    | "capital"
    | "prestamo"
    | "garantia"
    | "reservas"
    | "cuenta_participacion"
  readonly acuerdo: "constitucion" | "ampliacion"
  readonly escritura: Documento
  readonly pagos: readonly Pago[]
  readonly importeGarantizado: string
  readonly valorNoDinerario: string
  readonly tasacion: Documento | null
  readonly patrimonioNeto: string
  readonly participacionFamiliarPorcentaje: number
  readonly participacionPropiaPorcentaje: number
  readonly fechaVencimiento: string
  readonly amortizaciones: readonly {
    readonly ejercicio: number
    readonly principal: string
  }[]
  readonly mantenimiento: Vigilancia
  readonly funciones: "sin_ejecutivas_sin_laboral" | "ejecutivas_o_laboral"
  readonly funcionesSeguimiento: Vigilancia
  readonly otrasDeduccionesMismaOperacion: readonly string[]
}
export type Inversion = {
  readonly codigo:
    | "galicia_inversion_entidades_nuevas_reciente_creacion"
    | "galicia_inversion_entidades_nuevas_financiacion"
    | "galicia_inversion_empresas_agrarias"
  readonly operaciones: readonly Operacion[]
}
function entidad(e: Entidad): void {
  exige(
    [
      "SOFOR",
      "gestion_conjunta",
      "agraria_exclusiva",
      "recuperacion_ley11_2021",
      "otra",
    ].includes(e.agraria),
    "Clasificación agraria desconocida"
  )
  exige(
    ids([e.id]) &&
      ["SA", "SL", "laboral", "cooperativa"].includes(e.forma) &&
      Number.isInteger(e.socios) &&
      e.socios > 0 &&
      fecha(e.constitucion) &&
      fecha(e.inicioEjercicioIS),
    "Entidad no identificada"
  )
  exige(ids(e.empleos.map((p) => p.id)), "Empleos duplicados")
  e.empleos.forEach((p) => {
    documento(p.altaSS)
    exige(
      p.contrato.desde >= e.constitucion &&
        p.contrato.desde <= p.contrato.hasta &&
        fecha(p.contrato.desde) &&
        fecha(p.contrato.hasta) &&
        p.jornadaPorcentaje > 0 &&
        p.jornadaPorcentaje <= 100,
      "Empleo inválido"
    )
  })
}
export function inversion(c: Contexto, h: Inversion): Resultado {
  return proteger(() => {
    contexto(c, "galicia")
    exige(ids(h.operaciones.map((o) => o.id)), "Operación repetida")
    const simple =
        h.codigo === "galicia_inversion_entidades_nuevas_reciente_creacion",
      agr = h.codigo === "galicia_inversion_empresas_agrarias"
    let ordinario = cero
    let mejorado = cero
    const tr = []
    const pendientes = []
    // Un único límite personal por código; las operaciones de otros titulares son hechos del expediente,
    // pero nunca base del solicitante. Todos sus importes se validan antes de atribuirlos.
    const idsPagos = h.operaciones.flatMap((o) => o.pagos.map((p) => p.id))
    exige(ids(idsPagos), "Pago repetido entre operaciones")
    for (const o of h.operaciones) {
      entidad(o.entidad)
      documento(o.escritura)
      exige(
        ids([o.titular]) &&
          fecha(o.fecha) &&
          o.escritura.fecha === o.fecha &&
          o.fecha >= o.entidad.constitucion &&
          Number.isFinite(o.participacionFamiliarPorcentaje) &&
          o.participacionFamiliarPorcentaje >= 0 &&
          o.participacionFamiliarPorcentaje <= 100 &&
          ids(o.otrasDeduccionesMismaOperacion),
        "Operación/participación/escritura contradictorias"
      )
      exige(
        [
          "capital",
          "prestamo",
          "garantia",
          "reservas",
          "cuenta_participacion",
        ].includes(o.modalidad) &&
          ["constitucion", "ampliacion"].includes(o.acuerdo),
        "Modalidad desconocida"
      )
      const pagado = pagos(o.pagos, ["inversion"])
      exige(
        o.pagos.every(
          (p) => p.pagador === o.titular && p.receptor === o.entidad.id
        ),
        "Atribución económica de inversión contradictoria"
      )
      const base =
        o.modalidad === "garantia"
          ? euros(o.importeGarantizado)
          : mas(pagado, euros(o.valorNoDinerario))
      if (compara(euros(o.valorNoDinerario), cero) > 0) {
        exige(
          agr && o.tasacion !== null,
          "Aportación no dineraria requiere rama agraria y valoración"
        )
        documento(o.tasacion)
      }
      exige(
        Number.isFinite(o.participacionPropiaPorcentaje) &&
          o.participacionPropiaPorcentaje >= 0 &&
          o.participacionPropiaPorcentaje <= o.participacionFamiliarPorcentaje,
        "Participación propia/familiar contradictoria"
      )
      exige(
        o.modalidad === "prestamo" || o.amortizaciones.length === 0,
        "Amortizaciones solo se declaran para préstamos;las garantías requieren vigencia"
      )
      const e = o.entidad,
        especial = e.forma === "laboral" || e.forma === "cooperativa",
        dosSocios = especial && e.socios === 2
      const participacion = dosSocios || o.participacionFamiliarPorcentaje <= 40
      let apto =
        o.fecha >= "2025-01-01" &&
        o.fecha <= "2025-12-31" &&
        o.titular === c.titular
      if (agr) {
        exige(
          e.registroAgrario !== null,
          "Falta registro/perímetro de entidad agraria"
        )
        documento(e.registroAgrario)
        apto =
          apto && e.agraria !== "otra" && vigila(o.mantenimiento, o.fecha, 60)
        if (o.modalidad === "prestamo" || o.modalidad === "garantia")
          apto =
            apto &&
            fecha(o.fechaVencimiento) &&
            o.fechaVencimiento >= moverMes(o.fecha, 60)
      } else {
        apto =
          apto &&
          e.domicilioSocial === "galicia" &&
          e.domicilioFiscal === "galicia" &&
          e.actividad === "economica" &&
          vigila(e.seguimiento, o.fecha, 36) &&
          ((o.modalidad !== "capital" &&
            o.participacionPropiaPorcentaje === 0) ||
            participacion)
        if (o.modalidad === "capital")
          apto =
            apto &&
            o.participacionPropiaPorcentaje > 0 &&
            o.participacionFamiliarPorcentaje >= 1 &&
            vigila(o.mantenimiento, o.fecha, 36)
        else {
          exige(
            !simple && ["prestamo", "garantia"].includes(o.modalidad),
            "Modalidad no admitida en inversión de capital"
          )
          apto =
            apto &&
            compara(base, por(euros(o.patrimonioNeto), 1, 100)) > 0 &&
            vigila(o.mantenimiento, o.fecha, 60) &&
            fecha(o.fechaVencimiento) &&
            (o.modalidad === "prestamo"
              ? o.fechaVencimiento > moverMes(o.fecha, 60)
              : o.fechaVencimiento >= moverMes(o.fecha, 60))
        }
        const completos = e.empleos
          .filter(
            (p) => p.jornadaPorcentaje === 100 && p.residencia === "galicia"
          )
          .sort((a, b) => a.contrato.desde.localeCompare(b.contrato.desde))
        let siguiente = dia(o.fecha)
        for (const p of completos) {
          if (dia(p.contrato.desde) > siguiente) break
          if (dia(p.contrato.hasta) >= siguiente)
            siguiente = dia(p.contrato.hasta) + 1
        }
        const empleo = simple
          ? siguiente > dia(moverMes(o.fecha, 36))
          : completos.some(
              (p) =>
                p.contrato.desde >= o.fecha &&
                p.contrato.desde <= moverMes(o.fecha, 24) &&
                p.contrato.hasta >= moverMes(p.contrato.desde, 12)
            )
        apto = apto && ((especial && !simple) || empleo)
        if (o.acuerdo === "ampliacion") {
          apto = apto && e.constitucion >= moverMes(o.fecha, -36)
          if (simple || !especial)
            apto =
              apto &&
              compara(
                menos(euros(e.plantillaPosterior), euros(e.plantillaAnterior)),
                euros("1")
              ) >= 0 &&
              vigila(
                e.permanenciaPlantilla,
                e.inicioEjercicioIS,
                simple ? 48 : 36
              )
        }
      }
      if (!simple) {
        apto =
          apto &&
          (especial ||
            (o.funciones === "sin_ejecutivas_sin_laboral" &&
              vigila(o.funcionesSeguimiento, o.fecha, 120)))
        exige(
          ids(o.amortizaciones.map((a) => String(a.ejercicio))),
          "Amortización anual repetida"
        )
        apto =
          apto &&
          o.amortizaciones.every(
            (a) =>
              Number.isInteger(a.ejercicio) &&
              compara(euros(a.principal), por(base, 20, 100)) <= 0
          )
      }
      exige(
        o.otrasDeduccionesMismaOperacion.length === 0,
        "Resolver incompatibilidad de misma inversión entre5.Nueve/Diez/Once/Quince"
      )
      const plus =
        !agr &&
        o.modalidad === "capital" &&
        (e.selloInnovadora !== null ||
          e.calificacionIEBT !== null ||
          e.participacionUniversidad !== null)
      for (const d of [
        e.selloInnovadora,
        e.calificacionIEBT,
        e.participacionUniversidad,
      ])
        if (d !== null) {
          documento(d)
          exige(
            d.fecha <= o.fecha,
            "Calificación posterior a operación: acreditar efectos aplicables"
          )
        }
      const v = apto ? por(base, agr ? 20 : plus ? 45 : 30, 100) : cero
      if (plus) mejorado = mas(mejorado, v)
      else ordinario = mas(ordinario, v)
      tr.push(
        paso(
          o.id,
          "Modalidad,participación,domicilios,empleo,escritura,mantenimiento e incompatibilidad",
          base,
          v
        )
      )
      pendientes.push(
        `Seguimiento ${o.id}: mantenimiento y empleo hasta plazos declarados; no certifica hechos futuros`
      )
    }
    // Tramos ordinario/mejorado comparten el máximo ampliado: no suman dos topes completos.
    const limite = agr
      ? euros("20000")
      : simple
        ? euros(compara(mejorado, cero) > 0 ? "9000" : "6000")
        : euros(compara(mejorado, cero) > 0 ? "35000" : "20000")
    const v = min(limite, mas(ordinario, mejorado))
    return resultado(
      c,
      v,
      [
        ...tr,
        paso(
          "limite_personal",
          "Límite conjunto por titular, aplicado tras agregar operaciones",
          mas(ordinario, mejorado),
          v
        ),
      ],
      pendientes
    )
  })
}
export type Mab = {
  readonly codigo: "galicia_inversion_mab"
  readonly operaciones: readonly {
    readonly id: string
    readonly titular: string
    readonly fecha: string
    readonly importe: string
    readonly escritura: Documento
    readonly mercado: "segmento_expansion_MAB" | "otro"
    readonly participacionPorcentaje: number
    readonly entidad: Entidad
    readonly mantenimiento: Vigilancia
    readonly otrasDeduccionesMismaInversion: readonly string[]
  }[]
}
export function mab(c: Contexto, h: Mab): Resultado {
  return proteger(() => {
    contexto(c, "galicia")
    exige(ids(h.operaciones.map((o) => o.id)), "OperacionesMAB repetidas")
    let total = cero
    const tr = []
    for (const o of h.operaciones) {
      entidad(o.entidad)
      documento(o.escritura)
      exige(
        fecha(o.fecha) &&
          o.fecha >= o.entidad.constitucion &&
          o.escritura.fecha === o.fecha &&
          Number.isFinite(o.participacionPorcentaje) &&
          o.participacionPorcentaje >= 0 &&
          o.participacionPorcentaje <= 100 &&
          ids(o.otrasDeduccionesMismaInversion) &&
          o.otrasDeduccionesMismaInversion.length === 0,
        "MAB:participación/incompatibilidad/escritura"
      )
      const mismos = h.operaciones.filter((x) => x.entidad.id === o.entidad.id)
      exige(
        mismos.every(
          (x) =>
            x.fecha !== o.fecha ||
            x.participacionPorcentaje === o.participacionPorcentaje
        ),
        "Dos instantáneas contradictorias de participaciónMAB del mismo emisor/fecha"
      )
      exige(
        mismos.every(
          (x) => x.participacionPorcentaje === o.participacionPorcentaje
        ),
        "ParticipacionesMAB variables requieren historial temporal del emisor, no suma de porcentajes por operación"
      )
      const year = Number(o.fecha.slice(0, 4))
      const base = euros(o.importe)
      const apto =
        o.titular === c.titular &&
        year >= 2022 &&
        year <= 2025 &&
        o.mercado === "segmento_expansion_MAB" &&
        o.participacionPorcentaje <= 10 &&
        o.entidad.domicilioFiscal === "galicia" &&
        o.entidad.domicilioSocial === "galicia" &&
        o.entidad.actividad === "economica" &&
        vigila(o.mantenimiento, o.fecha, 36)
      // Se agrupa por año de generación antes del máximo4000 y el reparto cuatrienal.
      const v = apto ? por(base, 15, 100) : cero
      tr.push(
        paso(
          o.id,
          "15% generación; máximo4000 de la cohorte antes de dividir cuatro años",
          base,
          v
        )
      )
    }
    for (const year of [2022, 2023, 2024, 2025]) {
      const bases = tr.filter((p) =>
        h.operaciones.some(
          (o) => o.id === p.hecho && Number(o.fecha.slice(0, 4)) === year
        )
      )
      let cohorte = cero
      for (const x of bases)
        cohorte = mas(cohorte, {
          n: BigInt(x.resultado.numeradorCentimos),
          d: BigInt(x.resultado.denominador),
        })
      total = mas(total, por(min(euros("4000"), cohorte), 1, 4))
    }
    return resultado(c, total, tr, [
      "Seguimiento de permanencia; no tratar la cuarta parte2025 como nuevo crédito de otros ejercicios",
    ])
  })
}
