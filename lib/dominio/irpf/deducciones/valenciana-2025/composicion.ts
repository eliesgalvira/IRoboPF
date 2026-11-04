import Decimal from "decimal.js"
import { Schema } from "effect"
import type { ResultadoDeduccion } from "../contratos-2025"
import type { HechosValencianos2025, UnidadValenciana } from "./comun"
import { evaluarDeduccionValenciana2025 } from "./index"

type Bases = Pick<
  HechosValencianos2025,
  | "liquidableGeneral"
  | "liquidableAhorro"
  | "imponibleGeneral"
  | "imponibleAhorro"
>
export type ReferenciasComposicion = {
  readonly unidad: string
  readonly sujetos: readonly string[]
  readonly bienes: readonly string[]
  readonly eventos: readonly string[]
  /** Porciones monetarias indivisibles, identificadas una sola vez en el libro. */
  readonly cantidades: readonly string[]
}
export type PeticionComposicion = {
  readonly codigo: string
  readonly eleccion: "aplicar" | "omitir"
  readonly unidades: readonly UnidadValenciana[]
  readonly referencias: readonly ReferenciasComposicion[]
  /** Sólo aa: personas que generan el incremento, nunca las del importe fijo. */
  readonly descendientesIncremento?: readonly string[]
}
export type CuotaSeparada = {
  readonly referencia: string
  readonly disponible: number
  readonly arrastres: readonly {
    readonly id: string
    readonly codigo: string
    readonly contribuyente: string
    readonly origen: number
    readonly pendiente: number
    readonly soporte: string
  }[]
}
export type ComposicionValenciana2025 = {
  readonly ejercicio: 2025
  readonly territorio: "comunitat-valenciana"
  readonly modalidad: "individual"
  readonly devengo: "2025-12-31"
  readonly contribuyente: string
  readonly bases: Bases
  readonly cantidades: readonly {
    readonly id: string
    readonly euros: number
  }[]
  readonly solicitudes: readonly PeticionComposicion[]
  /** Todos y sólo los códigos elegidos q2/q3/r/s, en orden de consumo. */
  readonly ordenBase30: readonly string[]
  /** Ocupaciones externas, no importes: nunca se suman a hechos evaluados. */
  readonly consignaciones: readonly {
    readonly codigo: string
    readonly contribuyente: string
  }[]
  readonly cuota?: CuotaSeparada
}
export type FilaComposicion = {
  readonly codigo: string
  readonly eleccion: "aplicar" | "omitir"
  readonly resultado: ResultadoDeduccion
  readonly base30?: {
    readonly solicitada: number
    readonly asignada: number
    readonly exceso: number
  }
}
export type ResultadoComposicion = {
  readonly estado: "calculo_parcial" | "no_soportado"
  readonly aceptacionFiscal: "pendiente"
  readonly resultados: readonly FilaComposicion[]
  readonly incidencias: readonly string[]
  /** Ausente si hay un rechazo: nunca se sustituye por cero. Antes de cuota. */
  readonly totalParcialAntesCuota?: number
  readonly limiteBase30?: number
  readonly cuotaSinAplicar?: CuotaSeparada
}

const c = (s: string) => "valenciana_" + s
const Q2 = c("donativos_conservacion_patrimonio_cultural")
const Q3 = c("conservacion_patrimonio_cultural_titulares")
const R = c("donaciones_lengua_valenciana")
const S = c("donaciones_cesiones_fines_culturales_cientificos_deportivos")
const grupo30 = new Set([Q2, Q3, R, S])
const K = c("primera_vivienda_menores_35"),
  L = c("vivienda_discapacidad"),
  M = c("vivienda_ayudas_publicas")
const I = c("empleados_hogar_cuidado_personas")
const AA = c("municipio_riesgo_despoblamiento")
const Z = c("inversion_entidades_nuevas_reciente_creacion")
const DANA = c("dana_aportaciones_fondos_propios_entidades")
const ABC = new Set([
  c("nacimiento_adopcion_guarda_acogimiento"),
  c("nacimiento_adopcion_multiples"),
  c("nacimiento_adopcion_acogimiento_discapacidad"),
])
const incompatiblesI = new Set([
  c("custodia_guarderias_menores_3"),
  c("conciliacion_trabajo_familia"),
  c("ascendientes_mayores_discapacidad"),
])
function exigir(v: boolean, motivo: string): asserts v {
  if (!v) throw new RangeError(motivo)
}
function texto(v: string): boolean {
  return Schema.is(Schema.String)(v) && v.trim().length > 0
}
function dinero(v: number): boolean {
  return (
    Schema.is(Schema.Number)(v) &&
    Number.isFinite(v) &&
    v >= 0 &&
    v <= Number.MAX_SAFE_INTEGER / 100
  )
}
function esLista<T>(v: readonly T[]): boolean {
  return Array.isArray(v)
}
function ids(v: readonly string[]) {
  return esLista(v) && v.every(texto) && new Set(v).size === v.length
}
const Registro = Schema.Record(Schema.String, Schema.Unknown)
function claves<T>(o: T, permitidas: readonly string[]) {
  exigir(
    Schema.is(Registro)(o) &&
      Object.keys(o).every((k) => permitidas.includes(k)),
    "Campos ajenos al contrato de composición"
  )
}
function comun(a: readonly string[], b: readonly string[]) {
  return a.some((x) => b.includes(x))
}
function refs(
  p: PeticionComposicion,
  k: "sujetos" | "bienes" | "eventos" | "cantidades"
) {
  return p.referencias.flatMap((r) => [...r[k]])
}
function plazo(codigo: string) {
  return [
    c("autoconsumo_renovables"),
    c("dana_danos_materiales_vivienda_habitual"),
  ].includes(codigo)
    ? 4
    : [Z, DANA].includes(codigo)
      ? 3
      : 0
}

/** Composición ordinaria parcial. No acredita hechos ni aplica cuota ni usa la ruta genérica. */
export function componerDeduccionesValencianas2025(
  a: ComposicionValenciana2025
): ResultadoComposicion {
  const resultados: FilaComposicion[] = []
  const incidencias: string[] = []
  try {
    claves(a, [
      "ejercicio",
      "territorio",
      "modalidad",
      "devengo",
      "contribuyente",
      "bases",
      "cantidades",
      "solicitudes",
      "ordenBase30",
      "consignaciones",
      "cuota",
    ])
    exigir(
      a.ejercicio === 2025 &&
        a.territorio === "comunitat-valenciana" &&
        a.modalidad === "individual" &&
        a.devengo === "2025-12-31" &&
        texto(a.contribuyente),
      "Sólo individual ordinaria a 31/12/2025"
    )
    const nombresBases = [
      "liquidableGeneral",
      "liquidableAhorro",
      "imponibleGeneral",
      "imponibleAhorro",
    ] as const
    claves(a.bases, nombresBases)
    exigir(
      nombresBases.every((k) => dinero(a.bases[k])),
      "Bases únicas incompletas o inválidas"
    )
    exigir(
      esLista(a.solicitudes) &&
        (a.solicitudes.length > 0 || (a.cuota?.arrastres.length ?? 0) > 0) &&
        ids(a.solicitudes.map((p) => p.codigo)),
      "Una sola solicitud consolidada por código; no se repiten topes/tramos"
    )
    exigir(
      esLista(a.cantidades) && ids(a.cantidades.map((v) => v.id)),
      "Libro de cantidades inválido o duplicado"
    )
    const libro = new Map<string, Decimal>()
    for (const v of a.cantidades) {
      claves(v, ["id", "euros"])
      exigir(
        dinero(v.euros) && new Decimal(v.euros).decimalPlaces() <= 2,
        "Cantidad inválida: exige céntimos"
      )
      libro.set(v.id, new Decimal(v.euros))
    }
    exigir(
      esLista(a.consignaciones),
      "Falta inventario explícito de consignaciones"
    )
    exigir(
      ids(a.consignaciones.map((v) => v.contribuyente + ":" + v.codigo)),
      "Consignación duplicada"
    )
    for (const v of a.consignaciones) {
      claves(v, ["codigo", "contribuyente"])
      exigir(
        texto(v.codigo) && v.contribuyente === a.contribuyente,
        "Consignación ajena o inválida"
      )
      exigir(
        !a.solicitudes.some((p) => p.codigo === v.codigo),
        "Doble consignación y evaluación: " + v.codigo
      )
    }
    const elegidas = a.solicitudes.filter((p) => p.eleccion === "aplicar")
    for (const p of a.solicitudes) {
      claves(p, [
        "codigo",
        "eleccion",
        "unidades",
        "referencias",
        "descendientesIncremento",
      ])
      exigir(
        p.eleccion === "aplicar" || p.eleccion === "omitir",
        "Elección incompleta: " + p.codigo
      )
      // Una unidad consolidada por código evita ampliar los límites de los evaluadores.
      // Salud tiene un tope por categoría; requiere categorías distintas (lo valida el evaluador).
      exigir(
        esLista(p.unidades) &&
          (p.unidades.length === 1 ||
            (p.codigo === c("gastos_salud") && p.unidades.length > 0)),
        "Consolidar unidades/topes del código: " + p.codigo
      )
      exigir(
        ids(p.unidades.map((u) => u.id)) &&
          esLista(p.referencias) &&
          p.referencias.length === p.unidades.length &&
          ids(p.referencias.map((r) => r.unidad)),
        "Referencias de unidades incompletas o duplicadas"
      )
      for (const u of p.unidades) {
        claves(u, ["id", "titulares", "fecha", "numeros", "textos"])
        exigir(
          !("cumple" in u.numeros) && !("cumple" in u.textos),
          "No se admite cumplimiento global"
        )
      }
      for (const r of p.referencias) {
        claves(r, ["unidad", "sujetos", "bienes", "eventos", "cantidades"])
        exigir(
          p.unidades.some((u) => u.id === r.unidad) &&
            [r.sujetos, r.bienes, r.eventos, r.cantidades].every(ids) &&
            r.sujetos.length > 0 &&
            r.eventos.length > 0,
          "Falta identidad de sujeto/evento o referencias duplicadas"
        )
        exigir(
          r.cantidades.every((id) => libro.has(id)),
          "Cantidad sin asiento en libro"
        )
      }
      exigir(
        ids(refs(p, "cantidades")),
        "Misma cantidad repetida dentro de código"
      )
      if ([K, L, M, Z, DANA, c("autoconsumo_renovables")].includes(p.codigo))
        exigir(
          refs(p, "bienes").length === 1,
          "Requiere bien/entidad único identificado"
        )
      for (const u of p.unidades) {
        // Vincula pagos reales al libro, no sólo sus identificadores. Ayudas y
        // reembolsos siguen siendo hechos separados de la fórmula neta.
        const campos = [
          "gasto",
          "gastoCustodia",
          "cuotasMesesDerecho",
          "pagosSinIntereses",
          "ayudaIntegradaDestinada",
          "alquilerNoReembolsado",
          "alquilerSinServicios",
          "valorAportado",
          "inversionDesembolsada",
          "gastoTratamiento",
          "intereses2025",
          "ayudaTotal",
        ]
        const presentes = campos.filter((k) => k in u.numeros)
        exigir(
          presentes.length <= 1,
          "Varias magnitudes monetarias primarias: separar representación"
        )
        const obligatoria =
          [K, L, M, Q2, Q3, R].includes(p.codigo) ||
          (p.codigo === S && u.textos.clase === "dinero")
        exigir(
          !obligatoria || presentes.length === 1,
          "Falta cantidad monetaria identificada"
        )
        if (presentes.length > 0) {
          const idsCantidad = p.referencias.find(
            (r) => r.unidad === u.id
          )!.cantidades
          exigir(idsCantidad.length > 0, "Faltan cantidades identificadas")
          const suma = idsCantidad.reduce(
            (n, id) => n.plus(libro.get(id)!),
            new Decimal(0)
          )
          exigir(
            dinero(u.numeros[presentes[0]]) && suma.eq(u.numeros[presentes[0]]),
            "Libro no concuerda con " + presentes[0]
          )
        }
      }
      if (p.codigo === AA) {
        exigir(
          p.descendientesIncremento !== undefined &&
            ids(p.descendientesIncremento) &&
            p.descendientesIncremento.length ===
              p.unidades[0].numeros.descendientesSinABC,
          "Identificar cada descendiente del incremento aa"
        )
      } else
        exigir(
          p.descendientesIncremento === undefined,
          "Incremento aa en código ajeno"
        )
    }
    // También en un conflicto entre elecciones se conservan los parciales
    // originales de cada código, sin total que pudiera ocultar el rechazo.
    for (const p of a.solicitudes)
      resultados.push({
        codigo: p.codigo,
        eleccion: p.eleccion,
        resultado: evaluarDeduccionValenciana2025({
          ...a.bases,
          codigo: p.codigo,
          ejercicio: 2025,
          territorio: "comunitat-valenciana",
          modalidad: "individual",
          devengo: "2025-12-31",
          contribuyente: a.contribuyente,
          declarantes: [a.contribuyente],
          unidades: [...p.unidades],
        }),
      })
    // Art.4.Uno.i: incompatibilidad por contribuyente (no sólo el mismo menor).
    if (elegidas.some((p) => p.codigo === I))
      exigir(
        !elegidas.some((p) => incompatiblesI.has(p.codigo)),
        "Elección incompatible: i con e/f/h (art.4.Uno.i)"
      )
    for (const p of elegidas)
      for (const q of elegidas) {
        if ((p.codigo === K || p.codigo === L) && q.codigo === M)
          exigir(
            !comun(refs(p, "cantidades"), refs(q, "cantidades")),
            "k/l con m por las mismas cantidades (art.4.Uno.m)"
          )
        if (p.codigo === Z && q.codigo === DANA)
          exigir(
            !comun(refs(p, "bienes"), refs(q, "bienes")),
            "z/DANA: misma entidad y ejercicio"
          )
        if (p.codigo === AA && ABC.has(q.codigo))
          exigir(
            !comun(p.descendientesIncremento!, refs(q, "sujetos")),
            "Incremento aa incompatible por el mismo descendiente con a/b/c"
          )
        if (
          p.codigo < q.codigo &&
          comun(refs(p, "cantidades"), refs(q, "cantidades"))
        ) {
          const compatibleKL = [p.codigo, q.codigo].every((codigo) =>
            [K, L].includes(codigo)
          )
          exigir(
            compatibleKL,
            "Concurrencia de la misma cantidad sin regla de acumulación implementada; elegir alternativa: " +
              p.codigo +
              "/" +
              q.codigo
          )
        }
      }
    const limitadas = elegidas.filter((p) => grupo30.has(p.codigo))
    exigir(
      ids(a.ordenBase30) &&
        a.ordenBase30.length === limitadas.length &&
        a.ordenBase30.every((codigo) =>
          limitadas.some((p) => p.codigo === codigo)
        ),
      "Orden de asignación del 30% incompleto o ajeno"
    )
    const techo = new Decimal(a.bases.liquidableGeneral)
      .plus(a.bases.liquidableAhorro)
      .times("0.3")
    let disponible = techo
    const asignaciones = new Map<
      string,
      { solicitada: Decimal; asignada: Decimal }
    >()
    for (const codigo of a.ordenBase30) {
      const u = limitadas.find((p) => p.codigo === codigo)!.unidades[0]
      let base: Decimal
      if (codigo === S && u.textos.clase === "comodato_inmueble") {
        exigir(
          dinero(u.numeros.valorCatastral) &&
            Number.isInteger(u.numeros.diasComodato) &&
            u.numeros.diasComodato >= 0 &&
            u.numeros.diasComodato <= 365,
          "Comodato inválido"
        )
        base = new Decimal(u.numeros.valorCatastral)
          .times("0.04")
          .times(u.numeros.diasComodato)
          .div(365)
      } else {
        exigir(
          codigo !== S || u.textos.clase === "dinero",
          "Valoración especial no soportada"
        )
        exigir(dinero(u.numeros.valorAportado), "Falta base de donación")
        base = new Decimal(u.numeros.valorAportado)
      }
      const asignada = Decimal.min(base, disponible)
      asignaciones.set(codigo, { solicitada: base, asignada })
      disponible = disponible.minus(asignada)
    }
    if (a.cuota !== undefined) {
      claves(a.cuota, ["referencia", "disponible", "arrastres"])
      exigir(
        texto(a.cuota.referencia) &&
          dinero(a.cuota.disponible) &&
          new Decimal(a.cuota.disponible).decimalPlaces() <= 2 &&
          ids(a.cuota.arrastres.map((v) => v.id)),
        "Cuota/saldos separados inválidos"
      )
      const clavesHistoricas = new Set<string>()
      for (const v of a.cuota.arrastres) {
        claves(v, [
          "id",
          "codigo",
          "contribuyente",
          "origen",
          "pendiente",
          "soporte",
        ])
        const key = v.codigo + ":" + v.origen
        exigir(
          !clavesHistoricas.has(key) &&
            v.contribuyente === a.contribuyente &&
            plazo(v.codigo) > 0 &&
            Number.isInteger(v.origen) &&
            v.origen < 2025 &&
            v.origen + plazo(v.codigo) >= 2025 &&
            texto(v.soporte) &&
            dinero(v.pendiente) &&
            new Decimal(v.pendiente).decimalPlaces() <= 2,
          "Arrastre duplicado, ajeno o fuera de plazo"
        )
        exigir(
          (v.codigo !== c("dana_aportaciones_fondos_propios_entidades") &&
            v.codigo !== c("dana_danos_materiales_vivienda_habitual")) ||
            v.origen === 2024,
          "Origen anterior al régimen DANA"
        )
        clavesHistoricas.add(key)
      }
    }
    let total = new Decimal(0)
    resultados.length = 0
    for (const p of a.solicitudes) {
      const hechos: HechosValencianos2025 = {
        ...a.bases,
        codigo: p.codigo,
        ejercicio: 2025,
        territorio: "comunitat-valenciana",
        modalidad: "individual",
        devengo: "2025-12-31",
        contribuyente: a.contribuyente,
        declarantes: [a.contribuyente],
        unidades: p.unidades.map((u) => ({
          ...u,
          titulares: [...u.titulares],
          numeros: { ...u.numeros },
          textos: { ...u.textos },
        })),
      }
      const ajuste = asignaciones.get(p.codigo)
      // Primero validar/evaluar los hechos originales: el límite nunca sanea un rechazo.
      let resultado = evaluarDeduccionValenciana2025(hechos)
      if (ajuste !== undefined && resultado.estado === "calculo_parcial") {
        // Dinero y comodato comparten la misma base; después de valorarlo se usa
        // la rama dinero con igual régimen porcentual, conservando reservas originales.
        const acotado = evaluarDeduccionValenciana2025({
          ...hechos,
          unidades: hechos.unidades.map((u) => ({
            ...u,
            numeros: {
              ...u.numeros,
              valorAportado: ajuste.asignada.toNumber(),
            },
            textos:
              p.codigo === S
                ? { ...u.textos, clase: "dinero" }
                : { ...u.textos },
          })),
        })
        resultado =
          acotado.estado === "calculo_parcial"
            ? {
                ...acotado,
                motivo:
                  resultado.motivo +
                  " Base acotada conjuntamente por art.4.Dos; orden declarado.",
              }
            : acotado
      }
      const fila: FilaComposicion = {
        codigo: p.codigo,
        eleccion: p.eleccion,
        resultado,
      }
      resultados.push(
        ajuste === undefined
          ? fila
          : {
              ...fila,
              base30: {
                solicitada: ajuste.solicitada.toNumber(),
                asignada: ajuste.asignada.toNumber(),
                exceso: ajuste.solicitada.minus(ajuste.asignada).toNumber(),
              },
            }
      )
      if (p.eleccion === "aplicar") {
        if (resultado.estado === "calculo_parcial")
          total = total.plus(resultado.importe)
        else incidencias.push(p.codigo + ": " + resultado.motivo)
      }
    }
    exigir(
      dinero(total.toNumber()),
      "Total fuera del intervalo monetario representable"
    )
    const salida: ResultadoComposicion = {
      estado: incidencias.length > 0 ? "no_soportado" : "calculo_parcial",
      aceptacionFiscal: "pendiente",
      resultados,
      incidencias,
      limiteBase30: techo.toNumber(),
    }
    const conTotal: ResultadoComposicion =
      incidencias.length > 0
        ? salida
        : { ...salida, totalParcialAntesCuota: total.toNumber() }
    return a.cuota === undefined
      ? conTotal
      : { ...conTotal, cuotaSinAplicar: structuredClone(a.cuota) }
  } catch (error) {
    return {
      estado: "no_soportado",
      aceptacionFiscal: "pendiente",
      resultados,
      incidencias: [
        error instanceof RangeError
          ? error.message
          : "Composición no conforme al contrato runtime",
      ],
    }
  }
}
