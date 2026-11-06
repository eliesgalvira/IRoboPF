import { producirAscendientes2025 } from "./ascendientes-2025"
import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import type { MinimosPersonalesFamiliaresIrpf } from "../../normativa/datos/minimos-autonomicos-2025"
import {
  DerechosMinimosAnuales,
  DerechosMinimosNoSoportados,
  type DescendienteDerechos,
  type TitularDescendiente,
} from "./derechos-contrato"
import { obtenerMinimoContribuyente } from "./minimo-contribuyente"
import {
  obtenerMinimoDiscapacidadContribuyente,
  obtenerMinimoPorDiscapacidad,
} from "./minimo-discapacidad"

const rechazar = (motivo: string) =>
  Effect.fail(new DerechosMinimosNoSoportados({ motivo }))
const fechaValida = (fecha: string) => {
  const anio = Number(fecha.slice(0, 4))
  const mes = Number(fecha.slice(5, 7))
  const dia = Number(fecha.slice(8, 10))
  const bisiesto = anio % 4 === 0 && (anio % 100 !== 0 || anio % 400 === 0)
  const dias =
    mes === 2 ? (bisiesto ? 29 : 28) : [4, 6, 9, 11].includes(mes) ? 30 : 31
  return anio >= 1875 && mes >= 1 && mes <= 12 && dia >= 1 && dia <= dias
}
const cumpleRentas = (d: DescendienteDerechos) =>
  d.rentasNoExentasCentimos <= 800000 &&
  (d.declaracion.modalidad === "no-presenta" ||
    d.declaracion.rentasCentimos <= 180000)
const tieneRelacion = (t: TitularDescendiente, ejercicio: number) =>
  t.residenteIrpf &&
  (t.relacion === "convivencia" ||
    (ejercicio >= 2015 && t.relacion === "dependencia-economica") ||
    t.custodia === "compartida") &&
  !(t.alimentosJudiciales && t.custodia === "sin-custodia")

const titularesConDerecho = (d: DescendienteDerechos, ejercicio: number) => {
  if (
    !cumpleRentas(d) ||
    (d.edadDevengo >= 25 && d.discapacidad._tag === "SinDiscapacidad")
  )
    return []
  const posibles = d.titulares.filter((t) => tieneRelacion(t, ejercicio))
  const grado = Math.min(...posibles.map((t) => t.grado))
  const cercanos = posibles.filter((t) => t.grado === grado)
  const siguientes = posibles.filter((t) => t.grado > grado)
  return siguientes.length > 0 &&
    cercanos.every((t) => t.rentasNoExentasCentimos <= 800000)
    ? siguientes
    : cercanos
}

/** Reserva del contrato anual; no decide la especialidad ni calcula alimentos. */
export const hayAlimentosPropiosSinMinimo = (caso: DerechosMinimosAnuales) =>
  caso.descendientes.some(
    (d) =>
      d.titulares.some(
        (t) => t.titularId === caso.contribuyenteId && t.alimentosJudiciales
      ) &&
      (caso.ejercicio <= 2014 ||
        !titularesConDerecho(d, caso.ejercicio).some(
          (t) => t.titularId === caso.contribuyenteId
        ))
  )

/** Valida estructura y coherencia antes de cualquier operación monetaria. */
export const validarDerechosMinimos = Effect.fn("Minimos.validarDerechos")(
  function* (entrada: DerechosMinimosAnuales) {
    const caso = yield* Schema.decodeUnknownEffect(DerechosMinimosAnuales)(
      entrada,
      { onExcessProperty: "error" }
    ).pipe(
      Effect.mapError(
        () =>
          new DerechosMinimosNoSoportados({
            motivo:
              "Hechos incompletos o fuera del alcance común 2012–2026 individual sin fallecimientos ni ascendientes",
          })
      )
    )
    if (caso.devengo !== `${caso.ejercicio}-12-31`)
      return yield* rechazar(
        "El devengo debe ser el cierre del ejercicio declarado"
      )
    const datosTitulares = new Map<
      string,
      { readonly renta: number; readonly residente: boolean }
    >()
    const sujetos = new Set(caso.descendientes.map((d) => d.sujetoId))
    if (
      sujetos.size !== caso.descendientes.length ||
      sujetos.has(caso.contribuyenteId)
    )
      return yield* rechazar(
        "Sujeto duplicado o confundido con el contribuyente"
      )
    for (const d of caso.descendientes) {
      if (
        !fechaValida(d.fechaNacimiento) ||
        d.fechaNacimiento > caso.devengo ||
        caso.ejercicio - Number(d.fechaNacimiento.slice(0, 4)) !== d.edadDevengo
      )
        return yield* rechazar("Nacimiento y edad al devengo incoherentes")
      if (
        new Set(d.titulares.map((t) => t.titularId)).size !==
          d.titulares.length ||
        !d.titulares.some((t) => t.titularId === caso.contribuyenteId)
      )
        return yield* rechazar(
          "Titulares duplicados o contribuyente ausente del censo de relaciones"
        )
      if (
        d.titulares.filter((t) => t.custodia === "exclusiva").length > 1 ||
        (d.titulares.some((t) => t.custodia === "exclusiva") &&
          d.titulares.some((t) => t.custodia === "compartida"))
      )
        return yield* rechazar("Hechos contradictorios de custodia")
      for (const t of d.titulares) {
        const anterior = datosTitulares.get(t.titularId)
        if (
          anterior !== undefined &&
          (anterior.renta !== t.rentasNoExentasCentimos ||
            anterior.residente !== t.residenteIrpf)
        )
          return yield* rechazar(
            "Renta o residencia contradictorias para un mismo titular"
          )
        datosTitulares.set(t.titularId, {
          renta: t.rentasNoExentasCentimos,
          residente: t.residenteIrpf,
        })
        if (t.titularId === caso.contribuyenteId && !t.residenteIrpf)
          return yield* rechazar(
            "El contribuyente de esta ruta individual debe ser residente IRPF"
          )

        if (t.custodia === "exclusiva" && t.relacion !== "convivencia")
          return yield* rechazar("Custodia exclusiva sin convivencia declarada")
        if (sujetos.has(t.titularId))
          return yield* rechazar(
            "Grafos con un sujeto también titular pendientes de soporte"
          )
        if (
          (t.aplicaEspecialidadAlimentos &&
            (!t.alimentosJudiciales || t.custodia !== "sin-custodia")) ||
          (t.titularId === caso.contribuyenteId &&
            (t.aplicaEspecialidadAlimentos ||
              (t.alimentosJudiciales && t.custodia === "no-procede")))
        )
          return yield* rechazar(
            "Especialidad de alimentos incompatible o hechos de custodia insuficientes"
          )
        if (t.vinculo.clase !== "consanguinidad" && t.grado !== 1)
          return yield* rechazar(
            "Grados de vínculos asimilados o adoptivos superiores a uno pendientes de soporte"
          )
        if (
          "fechaInicioIncremento" in t.vinculo &&
          (!fechaValida(t.vinculo.fechaInicioIncremento) ||
            t.vinculo.fechaInicioIncremento < d.fechaNacimiento ||
            t.vinculo.fechaInicioIncremento > caso.devengo)
        )
          return yield* rechazar(
            "Fecha de adopción/acogimiento incompatible con nacimiento o devengo"
          )
        if ("fechaInicioIncremento" in t.vinculo) {
          const constitucion = t.vinculo.fechaConstitucionVinculo
          if (
            constitucion === undefined ||
            !fechaValida(constitucion) ||
            constitucion < d.fechaNacimiento ||
            constitucion > caso.devengo
          )
            return yield* rechazar(
              "Falta una fecha de constitución del vínculo compatible con nacimiento y devengo"
            )
          const mayoria =
            String(Number(d.fechaNacimiento.slice(0, 4)) + 18) +
            d.fechaNacimiento.slice(4)
          if (
            !fechaValida(mayoria) &&
            constitucion === mayoria.slice(0, 4) + "-02-28"
          )
            return yield* rechazar(
              "Cómputo civil del aniversario bisiesto pendiente de soporte"
            )
          if (constitucion >= mayoria)
            return yield* rechazar(
              "Adopción o acogimiento en mayoría de edad pendiente de soporte"
            )
        }
      }
      const posibles = d.titulares.filter((t) =>
        tieneRelacion(t, caso.ejercicio)
      )
      const grados = new Set(posibles.map((t) => t.grado))
      const cercanos = posibles.filter(
        (t) => t.grado === Math.min(...posibles.map((p) => p.grado))
      )
      if (
        grados.size > 2 ||
        (grados.size > 1 &&
          cercanos.some((t) => t.rentasNoExentasCentimos <= 800000) &&
          cercanos.some((t) => t.rentasNoExentasCentimos > 800000))
      )
        return yield* rechazar(
          "Más de dos grados o rentas mixtas dentro del grado próximo: concurrencia pendiente de soporte"
        )
    }
    if (caso.ascendientes !== "ninguno") {
      if (caso.ascendientesCompletos !== true)
        return yield* rechazar("Falta declaración de censo completo de ascendientes")
      if (caso.ascendientes.some(a => Number(a.fechaNacimiento.slice(0,4)) >= caso.ejercicio - caso.edadContribuyenteDevengo))
        return yield* rechazar("Ascendiente nacido en año igual o posterior al contribuyente: filiación no soportada")
      if (caso.ascendientes.length > 0 && caso.descendientes.length > 0)
        return yield* rechazar("Concurrencia de ambos censos generacionales pendiente de conciliación económica completa")
      if (caso.ejercicio !== 2025 || !["madrid", "castilla-la-mancha", "comunitat-valenciana"].includes(caso.territorio))
        return yield* rechazar("Ascendientes limitados al productor ordinario2025 Madrid/CLM/Valencia")
      const libro = yield* Effect.try({
        try: () => producirAscendientes2025(caso.ascendientes === "ninguno" ? [] : caso.ascendientes, caso.contribuyenteId, caso.territorio),
        catch: (e) => new DerechosMinimosNoSoportados({ motivo: e instanceof RangeError ? e.message : "Censo de ascendientes inválido" }),
      })
      if (libro.some(a => sujetos.has(a.sujetoId) || a.titulares.some(t => sujetos.has(t.titularId))))
        return yield* rechazar("Identidad repetida entre ascendientes, descendientes y titulares")
    }
    return caso
  }
)

/** Conciliación interna del perfil anual parcial, previa a reducciones y bases. */
export const validarRentasAnualesDerechos = Effect.fn(
  "Minimos.validarRentasAnuales"
)(function* (caso: DerechosMinimosAnuales, rentaNoExenta: Decimal) {
  if (caso.conciliacionRentasContribuyente === undefined)
    return yield* rechazar(
      "Falta declarar la conciliación de rentas y gastos con el perfil anual parcial"
    )
  if (!rentaNoExenta.isFinite())
    return yield* rechazar("La renta calculada del contribuyente no es finita")
  if (caso.ascendientes !== "ninguno") {
    const libro = producirAscendientes2025(caso.ascendientes, caso.contribuyenteId, caso.territorio)
    for (const a of libro) {
      const t = a.titularesCalculados.find(t => t.titularId === caso.contribuyenteId)
      if (t === undefined || !t.renta.eq(rentaNoExenta))
        return yield* rechazar("Economía propia del censo de ascendientes no concilia con el neto anual antes de reducciones")
    }
  }
  const centimosDelPerfil = rentaNoExenta
    .times(100)
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
  for (const d of caso.descendientes)
    for (const t of d.titulares) {
      if (t.titularId !== caso.contribuyenteId) continue
      if (
        !centimosDelPerfil.eq(t.rentasNoExentasCentimos) ||
        rentaNoExenta.lte(8000) !== t.rentasNoExentasCentimos <= 800000
      )
        return yield* rechazar(
          "La renta propia declarada no concilia con el neto del perfil anual antes de reducciones y compensaciones"
        )
    }
})

export const calcularDerechosMinimos = Effect.fn("Minimos.calcularDerechos")(
  function* (
    entrada: DerechosMinimosAnuales,
    minimos: MinimosPersonalesFamiliaresIrpf,
    aritmetica: Decimal.Constructor = Decimal.clone({ precision: 80 })
  ) {
    const caso = yield* validarDerechosMinimos(entrada)
    const elegibles = caso.descendientes
      .map((d) => ({
        descendiente: d,
        titulares: titularesConDerecho(d, caso.ejercicio),
      }))
      .filter((d) =>
        d.titulares.some((t) => t.titularId === caso.contribuyenteId)
      )
      .toSorted(
        (a, b) =>
          a.descendiente.fechaNacimiento.localeCompare(
            b.descendiente.fechaNacimiento
          ) || a.descendiente.sujetoId.localeCompare(b.descendiente.sujetoId)
      )
    // Si dos nacen el mismo día y tienen distinto divisor, no inventar un orden fiscal.
    for (const a of elegibles)
      for (const b of elegibles) {
        if (
          a.descendiente.sujetoId !== b.descendiente.sujetoId &&
          a.descendiente.fechaNacimiento === b.descendiente.fechaNacimiento &&
          a.titulares.length !== b.titulares.length
        )
          return yield* rechazar(
            "Empate de nacimiento con reparto distinto requiere criterio de orden"
          )
      }
    const A = aritmetica
    let descendientes = new A(0)
    let discapacidadFamiliares = new A(0)
    const atribuciones = elegibles.map(
      ({ descendiente: d, titulares }, indice) => {
        const titular = titulares.find(
          (t) => t.titularId === caso.contribuyenteId
        )
        const inicio =
          titular !== undefined && "fechaInicioIncremento" in titular.vinculo
            ? Number(titular.vinculo.fechaInicioIncremento.slice(0, 4))
            : 0
        const incremento =
          d.edadDevengo < 3 ||
          (inicio >= caso.ejercicio - 2 && inicio <= caso.ejercicio)
        const porOrden =
          indice === 0
            ? minimos.descendientes.primero
            : indice === 1
              ? minimos.descendientes.segundo
              : indice === 2
                ? minimos.descendientes.tercero
                : minimos.descendientes.cuartoYSiguientes
        const minimo = new A(porOrden)
          .plus(incremento ? minimos.descendientes.adicionalMenorTres : 0)
          .div(titulares.length)
        const discapacidad = new A(
          obtenerMinimoPorDiscapacidad(
            d.discapacidad,
            minimos.discapacidad.descendiente
          )
        ).div(titulares.length)
        descendientes = descendientes.plus(minimo)
        discapacidadFamiliares = discapacidadFamiliares.plus(discapacidad)
        return {
          sujetoId: d.sujetoId,
          orden: indice + 1,
          titulares: titulares.map((t) => t.titularId),
          divisor: titulares.length,
          incremento,
          minimo,
          discapacidad,
        }
      }
    )
    let ascendientes = new A(0)
    const libroAscendientes = caso.ascendientes === "ninguno" ? [] : producirAscendientes2025(caso.ascendientes, caso.contribuyenteId, caso.territorio)
    for (const a of libroAscendientes) {
      if (!a.titularesMinimo.includes(caso.contribuyenteId)) continue
      const divisor = a.titularesMinimo.length
      const minimo = new A(minimos.ascendientes.mayor65OConDiscapacidad)
        .plus(a.edadDevengo > 75 ? minimos.ascendientes.adicionalMayor75 : 0).div(divisor)
      const discapacidad = new A(obtenerMinimoPorDiscapacidad(a.discapacidad, minimos.discapacidad.ascendiente)).div(divisor)
      ascendientes = ascendientes.plus(minimo)
      discapacidadFamiliares = discapacidadFamiliares.plus(discapacidad)
      atribuciones.push({ sujetoId: a.sujetoId, orden: 0, titulares: a.titularesMinimo,
        divisor, incremento: false, minimo, discapacidad })
    }
    const contribuyente = obtenerMinimoContribuyente({
      anio: caso.ejercicio,
      edad: caso.edadContribuyenteDevengo,
      minimos,
    })
    const discapacidadContribuyente = obtenerMinimoDiscapacidadContribuyente(
      {
        tipo: "individual",
        edad: caso.edadContribuyenteDevengo,
        discapacidad: caso.discapacidadContribuyente,
        descendientes: [],
        ascendientes: [],
      },
      minimos
    )
    return {
      contribuyente,
      descendientes,
      ascendientes,
      discapacidadContribuyente,
      discapacidadFamiliares,
      total: new A(contribuyente)
        .plus(descendientes)
        .plus(ascendientes)
        .plus(discapacidadContribuyente)
        .plus(discapacidadFamiliares),
      atribuciones,
    }
  }
)
