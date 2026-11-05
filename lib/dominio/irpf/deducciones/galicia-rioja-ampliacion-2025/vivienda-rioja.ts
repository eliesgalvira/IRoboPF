import { anexoI, anexoII } from "./territorio"
import { propiedad, rehabilitacion } from "./vivienda-galicia"
import type { Inmueble, Obra } from "./vivienda-galicia"
import {
  cero,
  conciliar,
  mas,
  menos,
  por,
  producto,
  compara,
  min,
  max,
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
  rentaRioja,
  magnitud,
  pagos,
  resultado,
  paso,
  proteger,
} from "./comun"
import type { Contexto, Documento, Periodo, Pago, Resultado } from "./comun"
export type ViviendaRioja = {
  readonly inmueble: Inmueble
  readonly municipio: string
  readonly municipioHabitual: string
  readonly operacion:
    | "adquisicion"
    | "construccion"
    | "rehabilitacion"
    | "adecuacion"
  readonly fechaInicioInversion: string
  readonly finConstruccion: string
  readonly primeraOcupacion: string
  readonly excepcionOcupacion: Documento | null
  readonly excepcionPermanencia: Documento | null
  readonly ampliacionPlazoConstruccion: Documento | null
  readonly obra: Obra | null
  readonly pagos: readonly Pago[]
  readonly coberturaIntereses: string
  readonly inversionAnteriorDeducida: string
  readonly gananciaExentaReinversion: string
  readonly inversionNuevaAcumuladaAntes2025: string
  readonly deduccionPre2013: Documento | null
  readonly ejercicioDeduccionAnterior: number | null
  readonly excepcion6812: Documento | null
  readonly primerPagoObra: string
  readonly informeDiscapacidad: Documento | null
}
export type CodigoViviendaRioja =
  | "rioja_vivienda_habitual_pequenos_municipios"
  | "rioja_inversion_vivienda_jovenes_menores_36"
  | "rioja_obras_rehabilitacion_vivienda_habitual"
  | "rioja_adquisicion_construccion_vivienda_jovenes"
  | "rioja_segunda_vivienda_medio_rural"
  | "rioja_adecuacion_vivienda_discapacidad"
export type ViviendaH = {
  readonly codigo: CodigoViviendaRioja
  readonly viviendas: readonly ViviendaRioja[]
  readonly otrasModalidadesElegidas: readonly string[]
}
function habitual(x: ViviendaRioja): boolean {
  const i = x.inmueble
  exige(
    fecha(x.fechaInicioInversion) &&
      fecha(x.finConstruccion) &&
      fecha(x.primeraOcupacion) &&
      fecha(i.adquisicion),
    "Fechas de vivienda incompletas"
  )
  for (const d of [
    x.excepcionOcupacion,
    x.excepcionPermanencia,
    x.ampliacionPlazoConstruccion,
    x.excepcion6812,
    x.deduccionPre2013,
  ])
    if (d !== null) documento(d)
  const referencia =
    x.operacion === "adquisicion" ? i.adquisicion : x.finConstruccion
  const ocupacion =
    x.primeraOcupacion <= moverMes(referencia, 12) ||
    x.excepcionOcupacion !== null
  const permanencia =
    x.excepcionPermanencia !== null ||
    cubre(i.residencia, x.primeraOcupacion, moverMes(x.primeraOcupacion, 36))
  const construccion =
    x.operacion !== "construccion" ||
    x.finConstruccion <= moverMes(x.fechaInicioInversion, 48) ||
    x.ampliacionPlazoConstruccion !== null
  return i.uso === "habitual" && ocupacion && permanencia && construccion
}
export function viviendaRioja(c: Contexto, h: ViviendaH): Resultado {
  return proteger(() => {
    contexto(c, "la-rioja")
    exige(
      ids(h.viviendas.map((x) => x.inmueble.id)) &&
        ids(h.viviendas.flatMap((x) => x.pagos.map((p) => p.id))) &&
        ids(h.otrasModalidadesElegidas),
      "Vivienda/elección repetida"
    )
    const segunda = h.codigo === "rioja_segunda_vivienda_medio_rural",
      reha = h.codigo === "rioja_obras_rehabilitacion_vivienda_habitual",
      dis = h.codigo === "rioja_adecuacion_vivienda_discapacidad",
      adq = h.codigo === "rioja_adquisicion_construccion_vivienda_jovenes",
      pequena = h.codigo === "rioja_vivienda_habitual_pequenos_municipios",
      joven = h.codigo === "rioja_inversion_vivienda_jovenes_menores_36"
    if (segunda)
      exige(
        h.viviendas.length <= 1,
        "Única segunda vivienda por contribuyente;resolver elección"
      )
    if (joven)
      exige(
        !h.otrasModalidadesElegidas.some((x) => ["DT1a", "DT1b"].includes(x)),
        "Joven15% incompatible con regímenes anteriores2013"
      )
    let baseTotal = cero,
      capitalTotal = cero
    const tr = []
    for (const x of h.viviendas) {
      const i = x.inmueble
      conciliar(
        x.pagos,
        i.titulares.map((t) => t.titular)
      )
      if (x.deduccionPre2013 !== null)
        exige(
          x.ejercicioDeduccionAnterior !== null &&
            Number.isInteger(x.ejercicioDeduccionAnterior) &&
            x.ejercicioDeduccionAnterior < 2013,
          "Ejercicio de deducción anterior no es previo a2013"
        )
      const fr = propiedad(i, c)
      const interesesComunes = pagos(
        x.pagos,
        ["intereses"],
        true,
        "ejercicio",
        "satisfecho"
      )
      exige(
        compara(euros(x.coberturaIntereses), interesesComunes) <= 0,
        "Cobertura superior a intereses del expediente común"
      )
      const bruto = producto(
        pagos(
          x.pagos,
          [
            "adquisicion",
            "rehabilitacion",
            "adecuacion",
            "amortizacion",
            "intereses",
            "cobertura",
            "gastos",
          ],
          true,
          "ejercicio",
          "satisfecho"
        ),
        fr
      )
      const neto = max(
        cero,
        menos(bruto, producto(euros(x.coberturaIntereses), fr))
      )
      const prev = mas(
        euros(x.inversionAnteriorDeducida),
        euros(x.gananciaExentaReinversion)
      )
      const pendientePrev = max(
        cero,
        menos(prev, euros(x.inversionNuevaAcumuladaAntes2025))
      )
      let base = max(cero, menos(neto, pendientePrev))
      const capital = producto(
        pagos(
          x.pagos,
          ["adquisicion", "rehabilitacion", "adecuacion", "amortizacion"],
          true,
          "ejercicio",
          "satisfecho"
        ),
        fr
      )
      capitalTotal = mas(capitalTotal, capital)
      const modalidadAdmitida = adq
        ? ["adquisicion", "construccion"].includes(x.operacion)
        : reha
          ? x.operacion === "rehabilitacion"
          : dis
            ? x.operacion === "adecuacion"
            : segunda
              ? ["adquisicion", "rehabilitacion"].includes(x.operacion)
              : ["adquisicion", "construccion", "rehabilitacion"].includes(
                  x.operacion
                )
      let apto =
        modalidadAdmitida &&
        i.territorio === "la-rioja" &&
        (segunda
          ? i.uso === "esporadico" && i.territorio === "la-rioja"
          : habitual(x))
      if (x.operacion === "rehabilitacion")
        apto = apto && x.obra !== null && rehabilitacion(i, x.obra)
      if (pequena)
        apto =
          apto && anexoI(x.municipio) && x.fechaInicioInversion >= "2017-01-01"
      if (joven)
        apto =
          apto &&
          edad(propia(c).nacimiento) < 36 &&
          rentaRioja(c) &&
          x.fechaInicioInversion >= "2013-01-01"
      if (adq)
        apto =
          apto &&
          edad(propia(c).nacimiento) < 36 &&
          x.fechaInicioInversion < "2013-01-01" &&
          (x.deduccionPre2013 !== null || x.excepcion6812 !== null)
      if (reha)
        apto =
          apto &&
          fecha(x.primerPagoObra) &&
          x.primerPagoObra < "2013-01-01" &&
          x.finConstruccion < "2017-01-01" &&
          (x.deduccionPre2013 !== null || x.excepcion6812 !== null)
      if (segunda)
        apto =
          apto &&
          anexoII(x.municipio) &&
          x.municipio !== x.municipioHabitual &&
          (x.operacion === "adquisicion"
            ? i.adquisicion < "2013-01-01"
            : fecha(x.primerPagoObra) &&
              x.primerPagoObra < "2013-01-01" &&
              x.finConstruccion < "2017-01-01")
      if (dis) {
        exige(
          x.informeDiscapacidad !== null,
          "Informe técnico de accesibilidad necesario"
        )
        documento(x.informeDiscapacidad)
        apto =
          apto &&
          propia(c).discapacidad >= 33 &&
          fecha(x.primerPagoObra) &&
          x.primerPagoObra < "2013-01-01" &&
          x.finConstruccion < "2017-01-01"
      }
      if (!apto) base = cero
      baseTotal = mas(baseTotal, base)
      tr.push(
        paso(
          i.id,
          "Fechas/remisión histórica,patrimonio,uso,municipio y pagos;restar inversión anterior/reinversión pendiente",
          bruto,
          base
        )
      )
    }
    const crecimiento = menos(
      magnitud(c, "patrimonioFinalAjustado"),
      magnitud(c, "patrimonioInicialAjustado")
    )
    if (compara(crecimiento, capitalTotal) < 0)
      return resultado(c, cero, [
        ...tr,
        paso(
          "patrimonio",
          "Incremento ajustado menor que inversión sin financiación",
          capitalTotal,
          cero
        ),
      ])
    let limite = euros("9040"),
      tasa = 5,
      limiteCuota: ReturnType<typeof euros> | null = null
    if (pequena) {
      limite = max(
        cero,
        menos(euros("9040"), magnitud(c, "baseConsumidaViviendaMunicipios"))
      )
      limiteCuota = euros("452")
    }
    if (joven) {
      limite = euros("9000")
      tasa = 15
    }
    if (adq || segunda)
      limite = max(
        cero,
        menos(
          menos(euros("9040"), magnitud(c, "baseEstatalViviendaSinAdecuacion")),
          magnitud(c, "baseConsumidaAdquisicionSegunda")
        )
      )
    if (reha || dis)
      limite = max(
        cero,
        menos(
          euros("9040"),
          magnitud(c, "baseConsumidaRehabilitacionAdecuacion")
        )
      )
    if (adq) tasa = rentaRioja(c) ? 5 : 3
    if (segunda) {
      tasa = 8
      limiteCuota = euros("450.76")
    }
    if (reha)
      tasa = edad(propia(c).nacimiento) < 36 ? (rentaRioja(c) ? 7 : 5) : 2
    if (dis) tasa = 15
    let v = por(min(baseTotal, limite), tasa, 100)
    if (limiteCuota !== null) v = min(v, limiteCuota)
    return resultado(
      c,
      v,
      [
        ...tr,
        paso(
          "base_compartida",
          `${tasa}%;base regional compartida y límite anual, sin fingir deducción estatal`,
          baseTotal,
          v
        ),
      ],
      [
        "Las magnitudes de base consumida deben proceder de composición anual única; no sumar llamadas que reutilicen el mismo saldo de base",
        "Permanencia/ocupación y excepciones deben acreditarse; los documentos no certifican derechos",
      ]
    )
  })
}
export type Intereses = {
  readonly codigo: "rioja_paliar_subida_intereses_hipotecarios"
  readonly viviendas: readonly {
    readonly inmueble: Inmueble
    readonly prestamos: readonly {
      readonly id: string
      readonly destino: "financiacion_habitual" | "otro"
      readonly pagos: readonly Pago[]
      readonly cobertura: string
    }[]
    readonly diasResidenciaHabitual: readonly Periodo[]
    readonly diasOtraVivienda: readonly {
      readonly inmueble: string
      readonly dias: number
    }[]
    readonly titularesDerecho: readonly string[]
  }[]
  readonly deduccionesElegidas: readonly string[]
}
export function intereses(c: Contexto, h: Intereses): Resultado {
  return proteger(() => {
    contexto(c, "la-rioja")
    exige(
      !h.deduccionesElegidas.some((k) =>
        ["32.2", "32.11", "estatal_DT18"].includes(k)
      ),
      "Intereses incompatible con vivienda32.2,32.11 y estatalDT18"
    )
    exige(ids(h.viviendas.map((x) => x.inmueble.id)), "Viviendas duplicadas")
    let total = cero
    const tr = []
    for (const x of h.viviendas) {
      const dias = dias2025(x.diasResidenciaHabitual)
      exige(
        ids(x.titularesDerecho) &&
          x.titularesDerecho.includes(c.titular) &&
          ids(x.prestamos.map((p) => p.id)),
        "Titulares/préstamos incompletos"
      )
      let base = cero
      for (const p of x.prestamos) {
        conciliar(
          p.pagos,
          x.inmueble.titulares.map((t) => t.titular)
        )
        const b = max(
          cero,
          menos(
            pagos(p.pagos, ["intereses"], true, "ejercicio", "satisfecho"),
            euros(p.cobertura)
          )
        )
        if (p.destino === "financiacion_habitual") base = mas(base, b)
      }
      const apto =
        x.inmueble.territorio === "la-rioja" &&
        x.inmueble.adquisicion >= "2013-01-01" &&
        x.diasOtraVivienda.every(
          (v) => Number.isInteger(v.dias) && v.dias < dias
        )
      // Base5000 por vivienda: atribución proporcional explícita antes del límite personal.
      const fr = propiedad(x.inmueble, c)
      const v = apto
        ? producto(por(min(base, euros("5000")), 15, 100), fr)
        : cero
      total = mas(total, v)
      tr.push(
        paso(
          x.inmueble.id,
          "Intereses netos de cobertura;mayor número de días,base5000/vivienda",
          base,
          v
        )
      )
    }
    return resultado(c, total, tr)
  })
}
