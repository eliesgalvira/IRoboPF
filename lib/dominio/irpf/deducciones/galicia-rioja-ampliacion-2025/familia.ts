import { anexoI } from "./territorio"
import {
  cero,
  conciliar,
  mas,
  por,
  producto,
  compara,
  min,
  euros,
  exige,
  ids,
  fecha,
  edad,
  cubre,
  dias2025,
  moverMes,
  documento,
  contexto,
  propia,
  reparto,
  rentaRioja,
  rentaGalicia,
  pagos,
  resultado,
  paso,
  proteger,
} from "./comun"
import type {
  Contexto,
  Persona,
  Documento,
  Periodo,
  Pago,
  Resultado,
  Saldo,
} from "./comun"
export type Hijo = {
  readonly persona: Persona
  readonly titularesMinimo: readonly string[]
  readonly convivientes: readonly string[]
}
function hijo(h: Hijo, c: Contexto): void {
  exige(
    h.persona.id !== c.titular &&
      ids([h.persona.id]) &&
      fecha(h.persona.nacimiento) &&
      h.persona.nacimiento > propia(c).nacimiento &&
      h.persona.nacimiento <= "2025-12-31" &&
      Number.isFinite(h.persona.discapacidad) &&
      h.persona.discapacidad >= 0 &&
      h.persona.discapacidad <= 100 &&
      ids(h.titularesMinimo) &&
      !h.titularesMinimo.includes(h.persona.id) &&
      ids(h.convivientes),
    "Identidad/fecha del hijo o mínimo imposibles"
  )
}
export type Evento = {
  readonly id: string
  readonly fecha: string
  readonly tipo: "nacimiento" | "adopcion"
  readonly hijos: readonly (Hijo & {
    readonly ordenPorProgenitor: readonly {
      readonly titular: string
      readonly orden: number
    }[]
  })[]
  readonly progenitores: readonly string[]
  readonly soporte: Documento
}
export type Nacimiento = {
  readonly codigo:
    | "galicia_nacimiento_adopcion_hijos"
    | "rioja_nacimiento_adopcion_hijos"
  readonly eventos: readonly Evento[]
  readonly municipioGallego: {
    readonly habitantes: number
    readonly fusionIncorporacion: Documento | null
  }
}
export function nacimiento(c: Contexto, h: Nacimiento): Resultado {
  return proteger(() => {
    const gal = h.codigo === "galicia_nacimiento_adopcion_hijos"
    contexto(c, gal ? "galicia" : "la-rioja")
    exige(
      ids(h.eventos.map((e) => e.id)) &&
        ids(h.eventos.flatMap((e) => e.hijos.map((x) => x.persona.id))),
      "Eventos/hijos repetidos"
    )
    const renta = gal ? rentaGalicia(c) : cero
    let total = cero
    const tr = []
    for (const e of h.eventos) {
      documento(e.soporte)
      exige(
        fecha(e.fecha) &&
          ["nacimiento", "adopcion"].includes(e.tipo) &&
          ids(e.progenitores) &&
          e.progenitores.includes(c.titular) &&
          e.progenitores.length <= 2,
        "Evento inválido"
      )
      exige(
        e.hijos.length > 0 &&
          e.hijos.every((x) => !e.progenitores.includes(x.persona.id)),
        "Evento sin hijos o hijo idéntico a progenitor"
      )
      for (const x of e.hijos) {
        hijo(x, c)
        exige(
          x.ordenPorProgenitor.every(
            (o) =>
              e.progenitores.includes(o.titular) &&
              Number.isInteger(o.orden) &&
              o.orden >= 1
          ),
          "Ordinal parental inválido"
        )
        exige(
          x.persona.nacimiento <= e.fecha &&
            (e.tipo !== "nacimiento" || x.persona.nacimiento === e.fecha) &&
            ids(x.ordenPorProgenitor.map((o) => o.titular)) &&
            e.progenitores.every((t) =>
              x.ordenPorProgenitor.some((o) => o.titular === t)
            ),
          "Cronología u órdenes incompletos"
        )
        const orden = x.ordenPorProgenitor.find(
          (o) => o.titular === c.titular
        )?.orden
        exige(
          orden !== undefined && Number.isInteger(orden) && orden >= 1,
          "Orden filial inválido"
        )
        let base = cero
        const year = Number(e.fecha.slice(0, 4))
        const convive = x.convivientes.includes(c.titular)
        if (gal && year >= 2023 && year <= 2025 && convive) {
          if (compara(renta, euros("22000")) <= 0)
            base = euros(orden === 1 ? "360" : orden === 2 ? "1200" : "2400")
          else if (year === 2025 || compara(renta, euros("31000")) <= 0)
            base = euros(year === 2025 && e.hijos.length > 1 ? "360" : "300")
          exige(
            Number.isInteger(h.municipioGallego.habitantes) &&
              h.municipioGallego.habitantes >= 0,
            "Población municipal inválida"
          )
          if (h.municipioGallego.fusionIncorporacion !== null)
            documento(h.municipioGallego.fusionIncorporacion)
          if (
            h.municipioGallego.habitantes < 5000 ||
            h.municipioGallego.fusionIncorporacion !== null
          )
            base = por(base, 6, 5)
          if (x.persona.discapacidad >= 33) base = por(base, 2)
        } else if (!gal && year === 2025 && convive)
          base = euros(
            String(
              (orden === 1 ? 600 : orden === 2 ? 750 : 900) +
                (e.hijos.length > 1 ? 60 : 0)
            )
          )
        const titulares = e.progenitores.filter((t) =>
          x.convivientes.includes(t)
        )
        const valor = convive ? producto(base, reparto(titulares, c)) : cero
        total = mas(total, valor)
        tr.push(
          paso(
            x.persona.id,
            gal
              ? "art5.Dos: renta/orden,20% rural,discapacidad33%, reparto"
              : "art32.1: orden propio600/750/900,múltiples+60,reparto",
            base,
            valor
          )
        )
      }
    }
    return resultado(c, total, tr)
  })
}
export type FamiliaNumerosa = {
  readonly codigo: "galicia_familia_numerosa"
  readonly titulo: Documento
  readonly vigencia: Periodo
  readonly categoria: "general" | "especial"
  readonly hijos: readonly Hijo[]
  readonly titulares: readonly string[]
  readonly eleccion: "numerosa" | "dos_hijos"
}
export function numerosa(c: Contexto, h: FamiliaNumerosa): Resultado {
  return proteger(() => {
    contexto(c, "galicia")
    documento(h.titulo)
    exige(h.eleccion === "numerosa", "Resolver elección incompatible dos hijos")
    exige(ids(h.hijos.map((x) => x.persona.id)), "Hijos duplicados")
    h.hijos.forEach((x) => hijo(x, c))
    exige(
      ["general", "especial"].includes(h.categoria),
      "Categoría desconocida"
    )
    let base = euros(
      String(
        (h.categoria === "especial" ? 400 : 250) +
          Math.max(0, h.hijos.length - 2) * 250
      )
    )
    if (
      propia(c).discapacidad >= 65 ||
      h.hijos.some((x) => x.persona.discapacidad >= 65)
    )
      base = por(base, 2)
    if (!cubre(h.vigencia, "2025-12-31", "2025-12-31")) base = cero
    const v = producto(base, reparto(h.titulares, c))
    return resultado(c, v, [
      paso(
        h.titulo.referencia,
        "art5.Tres.2: categoría, incremento desde tercero,duplicación65%,reparto",
        base,
        v
      ),
    ])
  })
}
export type CuidadoHijo = Hijo & {
  readonly periodo: Periodo
  readonly centro: {
    readonly territorio: "galicia" | "la-rioja"
    readonly tipo: "escuela" | "empleado_hogar"
    readonly jornadaPorcentaje: number
    readonly altaSS: Documento | null
  }
  readonly progenitores: readonly {
    readonly id: string
    readonly actividad: Periodo
    readonly altaSS: Documento
    readonly lugar: "fuera_hogar" | "hogar"
  }[]
  readonly pagos: readonly Pago[]
  readonly titularesDeduccion: readonly string[]
}
export type Cuidados = {
  readonly codigo:
    | "galicia_cuidado_hijos_menores"
    | "rioja_escuelas_infantiles_pequenos_municipios"
    | "rioja_hijo_0_3_escolarizado"
  readonly hijos: readonly CuidadoHijo[]
  readonly municipio: string
  readonly trasladoResidencia: string
  readonly residencia: Periodo
}
export function cuidados(c: Contexto, h: Cuidados): Resultado {
  return proteger(() => {
    const gal = h.codigo === "galicia_cuidado_hijos_menores"
    contexto(c, gal ? "galicia" : "la-rioja")
    exige(
      ids(h.hijos.map((x) => x.persona.id)) &&
        ids(h.hijos.flatMap((x) => x.pagos.map((p) => p.id))),
      "Hijos/pagos repetidos"
    )
    const acceso = gal
      ? compara(
          rentaGalicia(c),
          euros(c.modalidad === "individual" ? "22000" : "31000")
        ) <= 0
      : rentaRioja(c)
    const rural = h.codigo === "rioja_escuelas_infantiles_pequenos_municipios"
    if (rural) exige(fecha(h.trasladoResidencia), "Falta fecha traslado")
    let total = cero
    const tr = []
    for (const x of h.hijos) {
      hijo(x, c)
      exige(
        x.periodo.desde >= x.persona.nacimiento &&
          x.progenitores.some((p) => p.id === c.titular) &&
          x.progenitores.every((p) => p.id !== x.persona.id) &&
          x.titularesDeduccion.every((t) =>
            x.progenitores.some((p) => p.id === t)
          ),
        "Identidades parentales/titulares o cronología de cuidado contradictorias"
      )
      conciliar(
        x.pagos,
        x.progenitores.map((p) => p.id)
      )
      exige(
        ids(x.progenitores.map((p) => p.id)) && x.progenitores.length > 0,
        "Progenitores desconocidos"
      )
      exige(
        ["escuela", "empleado_hogar"].includes(x.centro.tipo),
        "Tipo de centro de cuidado desconocido"
      )
      if (x.centro.altaSS !== null) documento(x.centro.altaSS)
      exige(
        x.centro.tipo !== "empleado_hogar" || x.centro.altaSS !== null,
        "Cuidador sin altaSS"
      )
      const activos = x.progenitores.every((p) => {
        documento(p.altaSS)
        return (
          cubre(p.actividad, x.periodo.desde, x.periodo.hasta) &&
          (!rural || p.lugar === "fuera_hogar")
        )
      })
      const base = pagos(x.pagos, [
        "matricula",
        "asistencia",
        "alimentacion",
        "cuidador",
      ])
      const apto =
        acceso &&
        edad(x.persona.nacimiento) <= 3 &&
        x.convivientes.includes(c.titular) &&
        x.titularesMinimo.includes(c.titular) &&
        x.centro.territorio === (gal ? "galicia" : "la-rioja") &&
        activos &&
        (!rural ||
          (anexoI(h.municipio) &&
            h.trasladoResidencia >= "2025-01-01" &&
            h.trasladoResidencia <= "2025-12-31" &&
            cubre(h.residencia, "2025-12-31", "2025-12-31") &&
            (x.centro.tipo === "empleado_hogar" ||
              x.centro.jornadaPorcentaje >= 50)))
      const tasa = gal || rural ? 30 : 20
      // Galicia tiene límite de deducción compartido400/600 para el conjunto, no por hijo.
      const bruto = apto ? por(base, tasa, 100) : cero
      const cuota = gal ? bruto : min(bruto, euros("600"))
      const v = producto(cuota, reparto(x.titularesDeduccion, c))
      total = mas(total, v)
      tr.push(
        paso(
          x.persona.id,
          "Gasto común neto; edad, actividad, mínimos y reparto",
          base,
          v
        )
      )
    }
    if (gal) {
      const grupos = new Set(
        h.hijos.map((x) => [...x.titularesDeduccion].sort().join("|"))
      )
      exige(
        grupos.size <= 1,
        "Titulares distintos: composición del máximo400/600 por expediente pendiente"
      )
      if (h.hijos.length > 0)
        total = min(
          total,
          producto(
            euros(h.hijos.length >= 2 ? "600" : "400"),
            reparto(h.hijos[0].titularesDeduccion, c)
          )
        )
    }
    return resultado(c, total, tr)
  })
}
export type Mensual = {
  readonly codigo: "rioja_hijo_0_3_pequenos_municipios"
  readonly hijos: readonly Hijo[]
  readonly meses: readonly {
    readonly mes: number
    readonly municipio: string
    readonly titularesPorHijo: readonly {
      readonly hijo: string
      readonly titulares: readonly string[]
    }[]
  }[]
  readonly inicioResidencia: string
  readonly residencia: Periodo
  readonly excepcionPermanencia: Documento | null
}
export function mensual(c: Contexto, h: Mensual): Resultado {
  return proteger(() => {
    contexto(c, "la-rioja")
    exige(
      fecha(h.inicioResidencia) &&
        ids(h.hijos.map((x) => x.persona.id)) &&
        h.meses.length === 12 &&
        new Set(h.meses.map((m) => m.mes)).size === 12,
      "Residencia/hijos/meses inválidos"
    )
    h.hijos.forEach((x) => hijo(x, c))
    let total = cero
    const tr = []
    for (const m of h.meses) {
      exige(
        Number.isInteger(m.mes) && m.mes >= 1 && m.mes <= 12,
        "Mes inválido"
      )
      let ultimo = moverMes(`2025-${String(m.mes).padStart(2, "0")}-01`, 1)
      const next = diaAnterior(ultimo)
      ultimo = next
      exige(
        ids(m.titularesPorHijo.map((x) => x.hijo)) &&
          m.titularesPorHijo.length === h.hijos.length &&
          m.titularesPorHijo.every(
            (x) =>
              h.hijos.some((a) => a.persona.id === x.hijo) && ids(x.titulares)
          ),
        "Identidad mensual desconocida"
      )
      for (const x of h.hijos) {
        const t = m.titularesPorHijo.find((t) => t.hijo === x.persona.id)
        exige(t !== undefined, "Falta identidad mensual")
        exige(
          !t.titulares.includes(x.persona.id),
          "El hijo no puede ser titular de su propio mínimo mensual"
        )
        const v =
          t.titulares.includes(c.titular) &&
          anexoI(m.municipio) &&
          x.persona.nacimiento <= ultimo &&
          edad(x.persona.nacimiento, ultimo) <= 3 &&
          cubre(h.residencia, ultimo, ultimo) &&
          h.inicioResidencia <= ultimo
            ? producto(euros("100"), reparto(t.titulares, c))
            : cero
        total = mas(total, v)
        tr.push(
          paso(
            `${x.persona.id}:${m.mes}`,
            "100 por mes a último día; edad0–3 y mínimo mensual",
            euros("100"),
            v
          )
        )
      }
    }
    if (h.excepcionPermanencia !== null) documento(h.excepcionPermanencia)
    return resultado(c, total, tr, [
      `Mantener residencia hasta ${moverMes(h.inicioResidencia, 36)} o acreditar excepción necesaria; regularizar si se incumple`,
    ])
  })
}
function diaAnterior(v: string): string {
  const y = Number(v.slice(0, 4)),
    m = Number(v.slice(5, 7))
  const prev = moverMes(`${y}-${String(m).padStart(2, "0")}-01`, -1)
  let d = 31
  while (!fecha(prev.slice(0, 8) + String(d))) d--
  return prev.slice(0, 8) + String(d)
}
export type AcogidaRioja = {
  readonly codigo: "rioja_menor_acogimiento_guarda_adopcion"
  readonly menores: readonly {
    readonly hijo: Hijo
    readonly resolucion: Documento
    readonly regimen: "urgencia" | "temporal" | "permanente" | "guarda_adopcion"
    readonly convivencia: readonly Periodo[]
    readonly adopcion: string | null
  }[]
}
export function acogida(c: Contexto, h: AcogidaRioja): Resultado {
  return proteger(() => {
    contexto(c, "la-rioja")
    exige(ids(h.menores.map((x) => x.hijo.persona.id)), "Menores duplicados")
    let total = cero
    let cortos = 0
    const tr = []
    for (const x of h.menores) {
      hijo(x.hijo, c)
      documento(x.resolucion)
      exige(
        ["urgencia", "temporal", "permanente", "guarda_adopcion"].includes(
          x.regimen
        ),
        "Régimen desconocido"
      )
      exige(
        x.adopcion === null ||
          (fecha(x.adopcion) && x.adopcion >= x.hijo.persona.nacimiento),
        "Adopción inválida"
      )
      exige(
        x.convivencia.every((p) => p.desde >= x.hijo.persona.nacimiento),
        "Acogimiento antes de nacimiento"
      )
      exige(
        x.hijo.convivientes.includes(c.titular),
        "Convivencia contradictoria con periodo de acogida"
      )
      const dias = dias2025(x.convivencia)
      exige(
        edad(x.hijo.persona.nacimiento) < 18,
        "Cumplimiento18 requiere separar días de minoría"
      )
      const adoptado = x.adopcion !== null && x.adopcion <= "2025-12-31"
      let base = cero
      if (!adoptado) {
        if (dias >= 183) base = euros("300")
        else if (dias > 90) base = euros("150")
        else cortos += dias
      }
      // Ley32.4 exige50% en individuales incluso con un único acogedor.
      const v =
        c.modalidad === "individual"
          ? por(base, 1, 2)
          : por(base, 1, c.declarantes.length)
      total = mas(total, v)
      tr.push(
        paso(
          x.hijo.persona.id,
          "90 estricto/183 inclusivo; adopción excluye; mitad individual",
          base,
          v
        )
      )
    }
    exige(
      cortos <= 90,
      "Acogimientos cortos acumulados>90: concretar cuantía y concurrencia de la regla32.4 antes de atribuir;no aplicar cero"
    )
    return resultado(c, total, tr)
  })
}
export type ActividadRural = {
  readonly codigo: "rioja_fijacion_poblacion_ocupada_medio_rural"
  readonly alta: Documento
  readonly tipo: "agraria_propia" | "colaborador" | "socio_capital"
  readonly cesesPrevios: readonly string[]
  readonly residenciaRioja: Periodo
  readonly actividad: Periodo
  readonly historia: "completa"
}
export function actividad(c: Contexto, h: ActividadRural): Resultado {
  return proteger(() => {
    contexto(c, "la-rioja")
    exige(
      ["agraria_propia", "colaborador", "socio_capital"].includes(h.tipo),
      "Situación agraria desconocida"
    )
    documento(h.alta)
    exige(
      h.historia === "completa" && h.cesesPrevios.every(fecha),
      "Historia de actividad desconocida"
    )
    const year = Number(h.alta.fecha.slice(0, 4))
    const plazo = (2025 - year + 1) * 12
    const apto =
      year >= 2023 &&
      year <= 2025 &&
      h.tipo === "agraria_propia" &&
      !h.cesesPrevios.some(
        (f) => f >= moverMes(h.alta.fecha, -24) && f < h.alta.fecha
      ) &&
      cubre(h.residenciaRioja, h.alta.fecha, "2025-12-31") &&
      cubre(h.actividad, h.alta.fecha, "2025-12-31")
    const v = apto ? euros("1000") : cero
    const saldos: Saldo[] = []
    return resultado(
      c,
      v,
      [
        paso(
          h.alta.referencia,
          "1000 por titular; alta2023–2025,actividad/residencia; aplicación última",
          euros("1000"),
          v
        ),
      ],
      [
        `Actividad y residencia hasta ${moverMes(h.alta.fecha, plazo)}; aplicar después de las restantes deducciones; cuota no aplicada arrastrable hasta2028`,
      ],
      saldos
    )
  })
}
