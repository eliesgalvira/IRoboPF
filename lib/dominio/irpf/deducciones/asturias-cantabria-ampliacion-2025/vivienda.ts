import {
  r,
  cuenta,
  reparto,
  pagos,
  lista,
  exigir,
  edad,
  grado,
  persona,
  dias,
  limiteBase,
  resultado,
  conRegimen,
  excluida,
  documento,
  fecha,
  mesesDesde,
  asturiasRural,
  cantabriaRural,
  incompatibles,
  vivienda,
  type Vivienda,
  type MarcoB,
  type Persona,
  type Reparto,
  type ResolucionB,
  type PagoB,
  type Uso,
  type Intervalo,
} from "./comun"
import {
  titulo,
  monoAst,
  type TituloNumerosa,
  type MonoparentalAst,
} from "./familia"
export type Colectivo = {
  readonly nacimiento: string
  readonly numerosa: TituloNumerosa | null
  readonly monoparental: MonoparentalAst | null
  readonly violenciaGenero: ResolucionB | null
}
function jovenFamilia(m: MarcoB, c: Colectivo): boolean {
  return (
    edad(c.nacimiento) <= 35 ||
    titulo(c.numerosa) ||
    (c.monoparental !== null && monoAst(m, c.monoparental))
  )
}
export type HechosVivienda =
  | {
      readonly codigo: "asturias_vivienda_discapacidad"
      readonly inmueble: Vivienda
      readonly compromisoOcupacion: ResolucionB | null
      readonly pagos: readonly PagoB[]
      readonly accesibilidad: ResolucionB
      readonly persona: Persona
      readonly relacion: "propio" | "conyuge" | "ascendiente" | "descendiente"
      readonly reparto: Reparto
      readonly gradoSolicitante: number
      readonly solicitantes: readonly {
        readonly id: string
        readonly grado: number
      }[]
      readonly usos: readonly Uso[]
    }
  | {
      readonly codigo: "asturias_arrendamiento_vivienda_habitual"
      readonly inmueble: Vivienda
      readonly titulares: Reparto
      readonly personas: readonly (Colectivo & {
        readonly id: string
        readonly pagos: readonly PagoB[]
      })[]
    }
  | {
      readonly codigo: "asturias_vivienda_determinados_colectivos"
      readonly inmueble: Vivienda
      readonly compromisoOcupacion: ResolucionB | null
      readonly valorInmueble: string
      readonly colectivo: Colectivo
      readonly pagos: readonly PagoB[]
      readonly reparto: Reparto
    }
  | {
      readonly codigo: "asturias_gastos_arrendamiento_viviendas"
      readonly contratos: readonly {
        readonly id: string
        readonly inmueble: Vivienda
        readonly arrendatario: string
        readonly rentaMensual: string
        readonly referencia: {
          readonly origen: "norma_asturiana" | "serpavi"
          readonly municipio: string
          readonly ejercicio: 2025
          readonly documento: ResolucionB
          readonly rentaMensual: string
        }
        readonly ingresosCapitalInmobiliario: string
        readonly gastos: readonly (PagoB & {
          readonly concepto:
            | "conservacion_reparacion"
            | "formalizacion"
            | "seguro_danos_impagos"
            | "certificado_energetico"
            | "otro"
        })[]
      }[]
    }
  | {
      readonly codigo: "cantabria_arrendamiento_municipios_riesgo_despoblamiento"
      readonly inmueble: Vivienda
      readonly pagos: readonly PagoB[]
      readonly usos: readonly Uso[]
    }
  | {
      readonly codigo: "cantabria_obras_mejora"
      readonly obras: readonly {
        readonly id: string
        readonly inmueble: Vivienda
        readonly objeto:
          | "rehabilitacion_calificada"
          | "eficiencia_higiene_salud_accesibilidad"
          | "renovables_seguridad_estanqueidad"
          | "telecomunicaciones"
          | "garaje_jardin_piscina"
        readonly calificacion: ResolucionB | null
        readonly ejecucion: Intervalo
        readonly gastos: readonly (PagoB & {
          readonly subvencionNoSujetaExenta: string
        })[]
      }[]
      readonly derechosEstatales: readonly {
        readonly pago: string
        readonly norma: string
      }[]
      readonly discapacidades: readonly {
        readonly id: string
        readonly grado: number
        readonly documento: ResolucionB
      }[]
    }
  | {
      readonly codigo: "cantabria_arrendamiento_viviendas_vacias"
      readonly cartera: readonly string[]
      readonly exhaustividadCartera: "completa" | "incompleta"
      readonly viviendas: readonly {
        readonly id: string
        readonly inmueble: Vivienda
        readonly porcentajePropiedad: string
        readonly vaciaDesde: string
        readonly usosPrevios: readonly {
          readonly inicio: string
          readonly fin: string
          readonly uso: "habitada" | "arrendada" | "actividad"
        }[]
        readonly contratos: readonly {
          readonly id: string
          readonly inicio: string
          readonly finPactado: string
          readonly finEfectivo: string | null
          readonly arrendatario: string
          readonly parentesco: number | null
          readonly vinculo: "conyuge_pareja_equiparada" | "otro"
          readonly rentaMensualConAnejos: string
          readonly destino: "habitual" | "temporada"
        }[]
      }[]
    }

function habitualAdquirida(v: Vivienda, compromiso: ResolucionB | null) {
  if (vivienda(v)) return { habitual: true, pendientes: [] }
  if (compromiso === null) return { habitual: false, pendientes: [] }
  documento(compromiso)
  exigir(
    v.destino === "habitual" &&
      v.titulo === "propiedad" &&
      v.fechaTitulo <= "2025-12-31" &&
      v.ocupacion.inicio > "2025-12-31" &&
      v.ocupacion.inicio <= mesesDesde(v.fechaTitulo, 12),
    "Proyecto de ocupación fuera del plazo ordinario12meses"
  )
  return {
    habitual: true,
    pendientes: [
      `${v.id}:ocupar efectivamente antes de${mesesDesde(v.fechaTitulo, 12)} y mantener vivienda habitual;ocupación futura es previsión,no hecho acreditado`,
    ],
  }
}
export function evaluarVivienda(m: MarcoB, h: HechosVivienda) {
  switch (h.codigo) {
    case "asturias_vivienda_discapacidad": {
      documento(h.accesibilidad)
      persona(h.persona, h.relacion === "propio" ? [] : m.declarantes)
      exigir(
        h.relacion !== "propio" || m.declarantes.includes(h.persona.id),
        "Discapacidad propia de persona ajena"
      )
      const habitual = habitualAdquirida(h.inmueble, h.compromisoOcupacion)
      if (!habitual.habitual || grado(h.persona) < 65)
        return excluida("Vivienda no habitual o discapacidad inferior65")
      if (
        h.relacion !== "propio" &&
        (dias(h.persona) <= 183 ||
          r(h.persona.rentaBrutaIncluidasExentas).cmp(r("35000")) > 0)
      )
        return excluida(
          "Familiar sin convivencia>183 o renta incluida exenta>35000"
        )
      lista(h.solicitantes)
      exigir(
        h.solicitantes.length > 0 &&
          h.solicitantes.every((x) => Number.isInteger(x.grado) && x.grado > 0),
        "Faltan grados de solicitantes"
      )
      const cercano = Math.min(...h.solicitantes.map((x) => x.grado))
      if (
        (h.relacion === "ascendiente" || h.relacion === "descendiente") &&
        h.gradoSolicitante > cercano
      )
        return excluida("Otro contribuyente tiene parentesco más cercano")
      incompatibles(
        m,
        h.usos,
        ["asturias_vivienda_discapacidad"],
        h.inmueble.id
      )
      const f =
          h.relacion === "ascendiente" || h.relacion === "descendiente"
            ? reparto(m, {
                titulares: h.solicitantes
                  .filter((s) => s.grado === cercano)
                  .map((s) => s.id),
                exhaustividad: h.reparto.exhaustividad,
              })
            : r("1"),
        gasto = pagos(h.pagos, m.declarantes)
      return resultado(
        gasto.min(r("15000").times(f)).times(r("0.03")),
        "Asturias art.4:base máxima15000 repartida y3%; accesibilidad específica",
        [
          ...habitual.pendientes,
          "Una vivienda y un beneficiario por expediente; composición propia/familiar sin acumulación debe conservarse por solicitud",
        ]
      )
    }
    case "asturias_arrendamiento_vivienda_habitual": {
      if (
        !limiteBase(m, "35000", "45000") ||
        !vivienda(h.inmueble) ||
        h.inmueble.titulo !== "alquiler"
      )
        return excluida("Base excedida o sin arrendamiento habitual")
      lista(h.personas)
      lista(h.personas.flatMap((p) => p.pagos))
      exigir(
        h.personas.length === h.titulares.titulares.length &&
          h.personas.every((p) => h.titulares.titulares.includes(p.id)),
        "Arrendatarios no exhaustivos"
      )
      reparto(m, h.titulares)
      const rural = asturiasRural(h.inmueble.municipio)
      let sum = r("0")
      for (const p of h.personas) {
        const f = r("1").div(cuenta(h.titulares.titulares.length))
        if (p.violenciaGenero !== null) documento(p.violenciaGenero)
        const reforzado =
          rural || jovenFamilia(m, p) || p.violenciaGenero !== null
        const gasto = pagos(p.pagos, [p.id])
        if (!m.declarantes.includes(p.id)) continue
        sum = sum.plus(
          gasto
            .times(r(reforzado ? "0.30" : "0.10"))
            .min(r(reforzado ? "1500" : "500").times(f))
        )
      }
      return resultado(
        sum,
        "Asturias art.7:10%/500 o30%/1500; sólo máximo prorrateado",
        [
          "Colectivo monoparental se comprueba con art.12, no con etiqueta genérica",
        ]
      )
    }
    case "asturias_vivienda_determinados_colectivos": {
      const habitual = habitualAdquirida(h.inmueble, h.compromisoOcupacion)
      if (
        !limiteBase(m, "35000", "45000") ||
        !habitual.habitual ||
        h.inmueble.titulo !== "propiedad"
      )
        return excluida("Sin vivienda habitual en propiedad o base excedida")
      exigir(
        m.declarantes.length === 1 || titulo(h.colectivo.numerosa),
        "Colectivos de edad o monoparentalidad en conjunta mixta:separar hechos y gastos por declarante"
      )
      const rural = asturiasRural(h.inmueble.municipio),
        joven = edad(h.colectivo.nacimiento) <= 35
      if (!rural && (!joven || r(h.valorInmueble).cmp(r("250000")) > 0))
        return excluida(
          "Fuera de concejo rural requiere edad<=35 y valor<=250000"
        )
      const porcentaje = rural && jovenFamilia(m, h.colectivo) ? "0.10" : "0.05"
      return resultado(
        pagos(h.pagos, m.declarantes)
          .min(r("10000").times(reparto(m, h.reparto)))
          .times(r(porcentaje)),
        "Asturias art.14decies:base máxima10000 repartida,5%/10%",
        [
          ...habitual.pendientes,
          ...(rural
            ? [
                "Mantener domicilio fiscal tres años en concejo rural; seguimiento futuro",
              ]
            : []),
        ]
      )
    }
    case "asturias_gastos_arrendamiento_viviendas": {
      lista(h.contratos)
      const todos = h.contratos.flatMap((x) => x.gastos)
      lista(todos)
      let sum = r("0")
      for (const c of h.contratos) {
        documento(c.referencia.documento)
        exigir(
          c.referencia.ejercicio === 2025 &&
            c.referencia.municipio === c.inmueble.municipio &&
            c.arrendatario.trim() !== "" &&
            !m.declarantes.includes(c.arrendatario),
          "Referencia social o arrendatario ajenos"
        )
        if (
          c.inmueble.destino !== "habitual" ||
          r(c.ingresosCapitalInmobiliario).cmp(r("0")) === 0 ||
          r(c.rentaMensual).cmp(r(c.referencia.rentaMensual)) > 0
        )
          continue
        sum = sum.plus(
          pagos(
            c.gastos.filter((p) => p.concepto !== "otro"),
            m.declarantes
          )
        )
      }
      return resultado(
        sum.min(r("500")),
        "Asturias art.14quindecies:gastos tasados y precio con sostenibilidad social",
        [
          "Referencia normativa o SERPAVI identificada por vivienda/ejercicio, no precio libre elegido por contribuyente; su correspondencia se contrasta en el expediente",
        ]
      )
    }
    case "cantabria_arrendamiento_municipios_riesgo_despoblamiento": {
      if (
        !cantabriaRural(h.inmueble.municipio) ||
        !vivienda(h.inmueble) ||
        h.inmueble.titulo !== "alquiler"
      )
        return excluida("Sin alquiler habitual en municipio PRE/1/2025")
      incompatibles(m, h.usos, [
        "cantabria_arrendamiento_jovenes_mayores_discapacidad",
      ])
      return resultado(
        pagos(h.pagos, m.declarantes, true)
          .times(r("0.20"))
          .min(r(m.modalidad === "individual" ? "600" : "1200")),
        "Cantabria art.2.11.1:20%,600/1200 y pago bancario"
      )
    }
    case "cantabria_obras_mejora": {
      lista(h.obras)
      lista(h.discapacidades)
      lista(h.obras.flatMap((x) => x.gastos))
      let suplemento = r("0")
      for (const p of h.discapacidades) {
        documento(p.documento)
        exigir(
          m.declarantes.includes(p.id) &&
            Number.isInteger(p.grado) &&
            p.grado >= 0 &&
            p.grado <= 100,
          "Discapacidad de declarante inválida"
        )
        if (p.grado >= 65) suplemento = suplemento.plus(r("500"))
      }
      let base = r("0")
      for (const o of h.obras) {
        exigir(
          /^39\d{3}$/.test(o.inmueble.municipio) &&
            o.inmueble.titulo === "propiedad",
          "Obras fuera de vivienda propia cántabra"
        )
        if (
          o.inmueble.destino === "actividad" ||
          o.objeto === "garaje_jardin_piscina"
        )
          continue
        if (o.objeto === "rehabilitacion_calificada") {
          exigir(
            o.calificacion !== null,
            "Rehabilitación sin calificación de Vivienda"
          )
          documento(o.calificacion)
        }
        exigir(
          fecha(o.ejecucion.inicio) &&
            fecha(o.ejecucion.fin) &&
            o.ejecucion.inicio <= o.ejecucion.fin,
          "Ejecución de obra inválida"
        )
        if (o.ejecucion.inicio > "2025-12-31" || o.ejecucion.fin < "2025-01-01")
          continue
        for (const p of o.gastos) {
          const gasto = pagos([p], m.declarantes, true),
            sub = r(p.subvencionNoSujetaExenta)
          exigir(sub.cmp(r(p.euros)) <= 0, "Subvención superior al pago")
          if (h.derechosEstatales.some((d) => d.pago === p.id)) {
            exigir(
              h.derechosEstatales
                .filter((d) => d.pago === p.id)
                .every((d) => d.norma.trim() !== ""),
              "Derecho estatal sin norma identificada"
            )
            continue
          }
          if (gasto.cmp(r("0")) > 0) base = base.plus(gasto.minus(sub))
        }
      }
      const generada = base.times(r("0.15")),
        maximo = r(m.modalidad === "individual" ? "1000" : "1500").plus(
          suplemento
        )
      return conRegimen(
        resultado(
          generada.min(maximo),
          "Cantabria art.2.3:15%,máximo anual y500 por declarante>=65",
          [
            "Exceso del límite anual trasladable dos ejercicios;saldo derivado de pagos identificados,no importe externo",
          ]
        ),
        {
          ejercicioOrigen: 2025,
          prioridadCuota: "ordinaria",
          arrastreInsuficiencia: 0,
          arrastreExcesoLimite: 2,
          excesoLimiteGenerado: generada.minus(maximo).max(r("0")).exacto(),
          pagosOrigen: h.obras.flatMap((o) => o.gastos.map((p) => p.id)),
        }
      )
    }
    case "cantabria_arrendamiento_viviendas_vacias": {
      exigir(
        h.exhaustividadCartera === "completa" &&
          (h.cartera.length === 0 ||
            new Set(h.cartera).size === h.cartera.length),
        "Cartera no exhaustiva o repetida"
      )
      if (h.cartera.length > 3)
        return excluida("Titular de más de tres viviendas")
      lista(h.viviendas)
      let sum = r("0")
      const pendientes: string[] = []
      for (const v of h.viviendas) {
        exigir(
          h.cartera.includes(v.id) &&
            v.id === v.inmueble.id &&
            ["propiedad", "usufructo"].includes(v.inmueble.titulo),
          "Vivienda no incluida en cartera o sin derecho real"
        )
        exigir(
          fecha(v.vaciaDesde) && r(v.porcentajePropiedad).cmp(r("100")) <= 0,
          "Fecha vacía/porcentaje inválidos"
        )
        lista(v.contratos)
        const cs = [...v.contratos].sort((a, b) =>
          a.inicio.localeCompare(b.inicio)
        )
        if (cs.length === 0) continue
        const primero = cs[0]
        documento(v.inmueble.contrato)
        exigir(
          fecha(v.inmueble.fechaTitulo) &&
            v.inmueble.fechaTitulo <= primero.inicio,
          "Arrendamiento anterior a la adquisición o usufructo"
        )
        exigir(
          fecha(primero.inicio) && primero.inicio.startsWith("2025-"),
          "Sólo nuevas altas de contratos2025; historial de deducciones previas requiere composición"
        )
        if (
          v.vaciaDesde > mesesDesde(primero.inicio, -12) ||
          v.usosPrevios.some(
            (u) =>
              u.inicio < primero.inicio &&
              u.fin >= mesesDesde(primero.inicio, -12)
          )
        )
          continue
        let incompatible = false,
          mesesEfectivos = 0,
          ultimoFin: string | null = null
        for (const c of cs) {
          exigir(
            fecha(c.inicio) &&
              fecha(c.finPactado) &&
              c.inicio <= c.finPactado &&
              !m.declarantes.includes(c.arrendatario),
            "Contrato con fecha o arrendatario inválidos"
          )
          if (
            c.vinculo === "conyuge_pareja_equiparada" ||
            (c.parentesco !== null && c.parentesco <= 3) ||
            c.destino !== "habitual" ||
            r(c.rentaMensualConAnejos).cmp(r("1000")) > 0
          ) {
            incompatible = true
            break
          }
          if (ultimoFin !== null && c.inicio > mesesDesde(ultimoFin, 6)) {
            incompatible = true
            break
          }
          if (c.finEfectivo === null) {
            exigir(
              c.finPactado >= mesesDesde(c.inicio, 36),
              "Contrato vigente pactado por menos de tres años: falta trayectoria alternativa"
            )
            pendientes.push(
              `${v.id}:mantener duración efectiva total tres años`
            )
            ultimoFin = null
          } else {
            exigir(
              fecha(c.finEfectivo) &&
                c.finEfectivo >= c.inicio &&
                c.finEfectivo <= "2025-12-31",
              "Fin efectivo imposible o futuro"
            )
            let meses = 0
            while (mesesDesde(c.inicio, meses + 1) <= c.finEfectivo) meses++
            mesesEfectivos += meses
            ultimoFin = c.finEfectivo
          }
        }
        if (incompatible) continue
        if (ultimoFin !== null && mesesEfectivos < 36) {
          exigir(
            mesesDesde(ultimoFin, 6) > "2025-12-31",
            "Plazo de sustitución vencido sin duración efectiva suficiente"
          )
          pendientes.push(
            `${v.id}:nuevo contrato antes de${mesesDesde(ultimoFin, 6)} y duración total>=3años`
          )
        }
        sum = sum.plus(r("500").times(r(v.porcentajePropiedad)).div(r("100")))
      }
      return resultado(
        sum,
        "Cantabria art.2.17:500 por inmueble por participación, vacío un año y cartera<=3",
        pendientes
      )
    }
  }
}
