import { CENTROS_HISTORICOS } from "./territorio"
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
  serial,
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
  r,
} from "./comun"
import type {
  Contexto,
  Documento,
  Periodo,
  Pago,
  Resultado,
  Saldo,
  R,
} from "./comun"
export type Titularidad = {
  readonly titular: string
  readonly numerador: number
  readonly denominador: number
}
export type Inmueble = {
  readonly id: string
  readonly territorio: "galicia" | "la-rioja"
  readonly titulares: readonly Titularidad[]
  readonly uso: "habitual" | "esporadico" | "arrendamiento"
  readonly residencia: Periodo
  readonly adquisicion: string
  readonly precioAdquisicion: string
  readonly valorMercadoInicio: string
  readonly valorSuelo: string
  readonly catastralSuelo: string
  readonly catastralConstruccion: string
}
export function propiedad(i: Inmueble, c: Contexto): R {
  exige(ids(i.titulares.map((t) => t.titular)), "Titularidad duplicada")
  let total = cero
  for (const t of i.titulares) {
    exige(
      Number.isInteger(t.numerador) &&
        Number.isInteger(t.denominador) &&
        t.numerador > 0 &&
        t.denominador > 0 &&
        t.numerador <= t.denominador,
      "Proporción de propiedad inválida"
    )
    total = mas(total, r(BigInt(t.numerador), BigInt(t.denominador)))
  }
  exige(compara(total, r(1n)) === 0, "Titularidades no suman100%")
  const p = i.titulares.find((t) => t.titular === c.titular)
  exige(p !== undefined, "Titular ajeno al inmueble")
  return r(BigInt(p.numerador), BigInt(p.denominador))
}
export type Obra = {
  readonly inicio: string
  readonly fin: string
  readonly costeGlobal: string
  readonly objeto: "estructuras_fachadas_cubiertas" | "otro"
  readonly permisos: Documento
  readonly pagos: readonly Pago[]
}
export function rehabilitacion(i: Omit<Inmueble, "territorio">, o: Obra): boolean {
  documento(o.permisos)
  exige(
    fecha(o.inicio) &&
      fecha(o.fin) &&
      o.inicio <= o.fin &&
      fecha(i.adquisicion),
    "Cronología de obra inválida"
  )
  const valor =
    i.adquisicion >= moverMes(o.inicio, -24) && i.adquisicion <= o.inicio
      ? euros(i.precioAdquisicion)
      : euros(i.valorMercadoInicio)
  let suelo = euros(i.valorSuelo)
  if (i.valorSuelo === "0") {
    const s = euros(i.catastralSuelo),
      ed = euros(i.catastralConstruccion)
    exige(compara(mas(s, ed), cero) > 0, "Falta proporción catastral del suelo")
    suelo = producto(valor, r(s.n * ed.d, s.n * ed.d + ed.n * s.d))
  }
  exige(compara(suelo, valor) <= 0, "Suelo superior a valor total")
  return (
    o.objeto === "estructuras_fachadas_cubiertas" &&
    compara(euros(o.costeGlobal), por(menos(valor, suelo), 25, 100)) > 0
  )
}
export type Instalacion = {
  readonly codigo: "galicia_climatizacion_agua_caliente_renovables"
  readonly inmuebles: readonly {
    readonly inmueble: Inmueble
    readonly renovable:
      | "solar"
      | "biomasa"
      | "geotermia"
      | "aerotermia_renovable"
      | "otra"
    readonly obra: "unifamiliar" | "horizontal_nueva" | "horizontal_sustitucion"
    readonly instalador: string
    readonly registroOVI: Documento
    readonly documentacionOVI: Documento
    readonly certificadoComunero: Documento | null
    readonly pagos: readonly Pago[]
  }[]
  readonly plazoAutoliquidacion: string
  readonly eleccion: "renovables" | "eficiencia"
}
export function renovables(c: Contexto, h: Instalacion): Resultado {
  return proteger(() => {
    contexto(c, "galicia")
    exige(
      h.eleccion === "renovables" && fecha(h.plazoAutoliquidacion),
      "Elección incompatible eficiencia/renovables o plazo desconocido"
    )
    exige(
      ids(h.inmuebles.map((x) => x.inmueble.id)) &&
        ids(h.inmuebles.flatMap((x) => x.pagos.map((p) => p.id))),
      "Instalación/pago repetidos"
    )
    let total = cero
    const tr = []
    for (const x of h.inmuebles) {
      conciliar(
        x.pagos,
        x.inmueble.titulares.map((t) => t.titular)
      )
      exige(
        [
          "solar",
          "biomasa",
          "geotermia",
          "aerotermia_renovable",
          "otra",
        ].includes(x.renovable),
        "Fuente renovable desconocida"
      )
      documento(x.registroOVI)
      documento(x.documentacionOVI)
      if (x.certificadoComunero !== null) documento(x.certificadoComunero)
      const base = pagos(
        x.pagos,
        ["generacion", "emision_termica", "captacion"],
        false,
        "ejercicio",
        "satisfecho"
      )
      exige(
        x.pagos.every((p) => p.receptor === x.instalador),
        "Instalador y receptor diferentes"
      )
      const fr = propiedad(x.inmueble, c)
      const apto =
        x.inmueble.territorio === "galicia" &&
        x.inmueble.uso === "habitual" &&
        x.renovable !== "otra" &&
        x.documentacionOVI.fecha <= h.plazoAutoliquidacion &&
        (x.obra === "unifamiliar" || x.certificadoComunero !== null)
      const b = producto(base, fr),
        v = apto ? por(b, 5, 100) : cero
      total = mas(total, v)
      tr.push(
        paso(
          x.inmueble.id,
          "5% de participación en coste efectivo no efectivo; registro/documentaciónOVI",
          b,
          v
        )
      )
    }
    const v = min(total, euros("280"))
    return resultado(c, v, [
      ...tr,
      paso(
        "limite_personal",
        "280 por sujeto pasivo después de atribuir gasto",
        total,
        v
      ),
    ])
  })
}
export type Historico = {
  readonly codigo: "galicia_rehabilitacion_centros_historicos"
  readonly inmuebles: readonly {
    readonly inmueble: Inmueble
    readonly obra: Obra
    readonly centro: string
    readonly municipio: string
    readonly instrumento: string
    readonly aprobacion: string
    readonly certificadoPerimetro: Documento
  }[]
}
export function historicos(c: Contexto, h: Historico): Resultado {
  return proteger(() => {
    contexto(c, "galicia")
    conciliar(
      h.inmuebles.flatMap((x) => x.obra.pagos),
      h.inmuebles.flatMap((x) => x.inmueble.titulares.map((t) => t.titular))
    )
    exige(ids(h.inmuebles.map((x) => x.inmueble.id)), "Inmueble duplicado")
    let total = cero
    const tr = []
    for (const x of h.inmuebles) {
      documento(x.certificadoPerimetro)
      const lista = CENTROS_HISTORICOS.some(
        (f) =>
          f[0] === x.centro &&
          f[1] === x.municipio &&
          f[2] === x.instrumento &&
          f[3] === x.aprobacion
      )
      const base = producto(
        pagos(
          x.obra.pagos,
          ["rehabilitacion"],
          true,
          "ejercicio",
          "satisfecho"
        ),
        propiedad(x.inmueble, c)
      )
      const v =
        lista &&
        x.inmueble.territorio === "galicia" &&
        rehabilitacion(x.inmueble, x.obra)
          ? por(base, 15, 100)
          : cero
      total = mas(total, v)
      tr.push(
        paso(
          x.inmueble.id,
          "Centro,instrumento y perímetro acreditado; rehabilitación>25% sin suelo",
          base,
          v
        )
      )
    }
    return resultado(c, min(total, euros("9000")), tr)
  })
}
export type Eficiencia = {
  readonly codigo: "galicia_obras_eficiencia_energetica"
  readonly eleccion: "eficiencia" | "renovables"
  readonly plazoAutoliquidacion: string
  readonly viviendas: readonly {
    readonly inmueble: Inmueble
    readonly obra: Obra
    readonly letraCO2Antes: number
    readonly letraCO2Despues: number
    readonly letraConsumoAntes: number
    readonly letraConsumoDespues: number
    readonly registro: Documento
    readonly informeTecnico: Documento
    readonly presentacionDocumentacion: Documento
    readonly pagosCertificado: readonly Pago[]
  }[]
}
export function eficiencia(c: Contexto, h: Eficiencia): Resultado {
  return proteger(() => {
    contexto(c, "galicia")
    exige(
      h.eleccion === "eficiencia" && fecha(h.plazoAutoliquidacion),
      "Resolver incompatibilidad renovables/eficiencia"
    )
    exige(ids(h.viviendas.map((x) => x.inmueble.id)), "Viviendas repetidas")
    conciliar(
      h.viviendas.flatMap((x) => [...x.obra.pagos, ...x.pagosCertificado]),
      h.viviendas.flatMap((x) => x.inmueble.titulares.map((t) => t.titular))
    )
    let baseTotal = cero
    let certificados = cero
    const tr = []
    for (const x of h.viviendas) {
      documento(x.obra.permisos)
      documento(x.registro)
      documento(x.informeTecnico)
      documento(x.presentacionDocumentacion)
      exige(
        [
          x.letraCO2Antes,
          x.letraCO2Despues,
          x.letraConsumoAntes,
          x.letraConsumoDespues,
        ].every((v) => Number.isInteger(v) && v >= 1 && v <= 7),
        "Escala energética1=A,7=G inválida"
      )
      const fr = propiedad(x.inmueble, c)
      const base = producto(
        pagos(
          x.obra.pagos,
          ["mejora_energetica"],
          false,
          "hasta2025",
          "satisfecho"
        ),
        fr
      )
      const cert = producto(
        pagos(
          x.pagosCertificado,
          ["certificado", "tasa_registro"],
          false,
          "hasta2025",
          "satisfecho"
        ),
        fr
      )
      const apto =
        x.inmueble.territorio === "galicia" &&
        x.obra.fin >= "2025-01-01" &&
        x.obra.fin <= "2025-12-31" &&
        x.letraCO2Despues < x.letraCO2Antes &&
        x.letraConsumoDespues < x.letraConsumoAntes &&
        x.presentacionDocumentacion.fecha <= h.plazoAutoliquidacion &&
        x.registro.fecha >= x.obra.fin
      if (apto) {
        baseTotal = mas(baseTotal, base)
        certificados = mas(certificados, min(cert, producto(euros("150"), fr)))
      }
      tr.push(
        paso(
          x.inmueble.id,
          "Obra finalizada2025 y salto en ambas escalas; certificado con límite150 prorrateado",
          base,
          apto ? por(base, 15, 100) : cero
        )
      )
    }
    const v = mas(
      por(min(baseTotal, euros("9000")), 15, 100),
      min(certificados, euros("150"))
    )
    return resultado(c, v, tr)
  })
}
export type Aldea = {
  readonly codigo: "galicia_aldeas_modelo"
  readonly viviendas: readonly {
    readonly inmueble: Inmueble
    readonly declaracion: Documento
    readonly certificadoPerimetro: Documento
    readonly operacion: "adquisicion" | "rehabilitacion"
    readonly obra: Obra | null
    readonly pagos: readonly Pago[]
    readonly coberturaIntereses: string
    readonly otrasDeduccionesMismaInversion: readonly string[]
  }[]
}
export function aldeas(c: Contexto, h: Aldea): Resultado {
  return proteger(() => {
    contexto(c, "galicia")
    exige(ids(h.viviendas.map((x) => x.inmueble.id)), "Vivienda repetida")
    let habituales = cero,
      otras = cero
    const tr = []
    for (const x of h.viviendas) {
      conciliar(
        x.pagos,
        x.inmueble.titulares.map((t) => t.titular)
      )
      documento(x.declaracion)
      documento(x.certificadoPerimetro)
      exige(
        ids(x.otrasDeduccionesMismaInversion) &&
          x.otrasDeduccionesMismaInversion.length === 0,
        "Resolver incompatibilidad aldeas con5.Trece/Dieciocho"
      )
      const base = producto(
        max(
          cero,
          menos(
            pagos(
              x.pagos,
              [
                "adquisicion",
                "rehabilitacion",
                "amortizacion",
                "intereses",
                "gastos",
                "cobertura",
              ],
              true,
              "ejercicio",
              "satisfecho"
            ),
            euros(x.coberturaIntereses)
          )
        ),
        propiedad(x.inmueble, c)
      )
      const apto =
        x.inmueble.territorio === "galicia" &&
        x.inmueble.uso !== "arrendamiento" &&
        (x.operacion === "adquisicion" ||
          (x.obra !== null && rehabilitacion(x.inmueble, x.obra)))
      if (apto) {
        if (x.inmueble.uso === "habitual") habituales = mas(habituales, base)
        else otras = mas(otras, base)
      }
      tr.push(
        paso(
          x.inmueble.id,
          "15%;aldea declarada y perímetro,uso propio y financiación neta de cobertura",
          base,
          apto ? por(base, 15, 100) : cero
        )
      )
    }
    const v = por(
      mas(min(habituales, euros("9000")), min(otras, euros("4500"))),
      15,
      100
    )
    return resultado(c, v, tr, [
      "Revisar residencia efectiva y declaración/perímetro particular; topes de base9000 habitual y4500 restante",
    ])
  })
}
export type AlquilerVacio = {
  readonly id: string
  readonly inmueble: Inmueble
  readonly vacioDesde: string
  readonly vacioHasta: string
  readonly contrato: string
  readonly tipoContrato: "LAU_art2" | "otro"
  readonly arrendatarios: readonly {
    readonly id: string
    readonly vinculo: "sin_parentesco" | "conyuge" | "pariente_hasta3"
  }[]
  readonly rentaMensual: string
  readonly duracion: Periodo
  readonly contratosSucesivos: readonly {
    readonly periodo: Periodo
    readonly arrendatarios: readonly {
      readonly id: string
      readonly vinculo: "sin_parentesco" | "conyuge" | "pariente_hasta3"
    }[]
    readonly soporte: Documento
  }[]
  readonly seguimiento: Documento
  readonly valorReferencia: string | null
  readonly imposibilidadValorReferencia: Documento | null
  readonly valorMercado: string
}
function vacio(x: AlquilerVacio, c: Contexto, desde: string): boolean {
  exige(
    x.duracion.desde === x.contrato &&
      fecha(x.duracion.hasta) &&
      x.duracion.hasta > x.duracion.desde,
    "Fechas del contrato contradictorias"
  )
  let fin = x.duracion.hasta
  let dias = dia(fin) - dia(x.duracion.desde)
  for (const siguiente of x.contratosSucesivos) {
    documento(siguiente.soporte)
    exige(
      fecha(siguiente.periodo.desde) &&
        fecha(siguiente.periodo.hasta) &&
        siguiente.periodo.desde >= fin &&
        siguiente.periodo.desde <= moverMes(fin, 6) &&
        siguiente.periodo.hasta > siguiente.periodo.desde &&
        ids(siguiente.arrendatarios.map((t) => t.id)) &&
        siguiente.arrendatarios.length > 0 &&
        siguiente.arrendatarios.every(
          (t) => t.id !== c.titular && t.vinculo === "sin_parentesco"
        ),
      "Cadena de arriendos con vacío>6meses o identidad/vínculo inválidos"
    )
    dias += dia(siguiente.periodo.hasta) - dia(siguiente.periodo.desde)
    fin = siguiente.periodo.hasta
  }
  exige(
    dias >= dia(moverMes(x.contrato, 36)) - dia(x.contrato),
    "Arriendo conocido inferior a3años: falta cadena de contratos y vacancias<=6meses"
  )
  exige(
    fecha(x.vacioDesde) &&
      fecha(x.vacioHasta) &&
      fecha(x.contrato) &&
      ids(x.arrendatarios.map((t) => t.id)) &&
      x.arrendatarios.every((t) => t.id !== c.titular),
    "Vacío/contrato/identidad inválidos"
  )
  documento(x.seguimiento)
  return (
    x.inmueble.territorio === "galicia" &&
    x.tipoContrato === "LAU_art2" &&
    x.vacioDesde <= moverMes(desde, -12) &&
    x.vacioHasta >= desde &&
    x.arrendatarios.every((t) => t.vinculo === "sin_parentesco")
  )
}
export type ViviendasVacias = {
  readonly codigo: "galicia_arrendamiento_viviendas_vacias"
  readonly viviendas: readonly AlquilerVacio[]
  readonly inventarioArrendables: readonly string[]
  readonly historiaPrimerArriendo: readonly {
    readonly inmueble: string
    readonly primerContrato: string
  }[]
}
export function vacias(c: Contexto, h: ViviendasVacias): Resultado {
  return proteger(() => {
    contexto(c, "galicia")
    exige(
      ids(h.viviendas.map((x) => x.id)) &&
        ids(h.inventarioArrendables) &&
        h.inventarioArrendables.length <= 3,
      "Inventario mundial arrendable incompleto o superior a tres"
    )
    let total = cero
    const tr = []
    for (const x of h.viviendas) {
      const historial = h.historiaPrimerArriendo.find(
        (a) => a.inmueble === x.inmueble.id
      )
      exige(
        historial !== undefined && fecha(historial.primerContrato),
        "Falta historia primer arriendo"
      )
      const apto =
        vacio(x, c, x.contrato) &&
        h.inventarioArrendables.includes(x.inmueble.id) &&
        x.contrato === historial.primerContrato &&
        x.contrato >= "2025-01-01" &&
        x.contrato <= "2025-12-31" &&
        compara(euros(x.rentaMensual), euros("700")) <= 0
      const v = apto ? producto(euros("500"), propiedad(x.inmueble, c)) : cero
      total = mas(total, v)
      tr.push(
        paso(
          x.id,
          "500 primer arriendo;vacío1año,renta<=700,titularidad y tres viviendas",
          euros("500"),
          v
        )
      )
    }
    return resultado(c, total, tr, [
      "Mantener arriendo3años o sucesión de contratos con vacancia<=6meses; cuota no aplicada genera remanente4años, pendiente aplicación anual",
    ])
  })
}
export type Adecuacion = {
  readonly codigo: "galicia_adecuacion_inmueble_vacio_arrendamiento"
  readonly viviendas: readonly {
    readonly alquiler: AlquilerVacio
    readonly obra: Obra
    readonly baseConsumidaAnterior: string
    readonly basePendienteAnterior: readonly {
      readonly origen: number
      readonly caduca: number
      readonly importe: string
    }[]
  }[]
  readonly inventarioArrendables: readonly string[]
  readonly ordenBase: readonly string[]
}
export function adecuacion(c: Contexto, h: Adecuacion): Resultado {
  return proteger(() => {
    contexto(c, "galicia")
    exige(
      ids(h.inventarioArrendables) &&
        h.inventarioArrendables.length <= 3 &&
        ids(h.viviendas.map((x) => x.alquiler.id)) &&
        ids(h.ordenBase) &&
        h.ordenBase.length === h.viviendas.length &&
        h.ordenBase.every((id) =>
          h.viviendas.some((x) => x.alquiler.id === id)
        ),
      "Inventario/orden experto de base inválido"
    )
    let restante = euros(h.viviendas.length >= 2 ? "6000" : "3000"),
      total = cero
    const tr = []
    const saldos: Saldo[] = []
    for (const ident of h.ordenBase) {
      const x = h.viviendas.find((x) => x.alquiler.id === ident)
      exige(x !== undefined, "Inmueble no encontrado")
      const a = x.alquiler
      conciliar(
        x.obra.pagos,
        a.inmueble.titulares.map((t) => t.titular)
      )
      documento(x.obra.permisos)
      exige(
        fecha(x.obra.inicio) &&
          fecha(x.obra.fin) &&
          x.obra.inicio <= x.obra.fin,
        "Cronología obra"
      )
      if (a.valorReferencia === null) {
        exige(
          a.imposibilidadValorReferencia !== null,
          "Valor de referencia o acreditación de imposibilidad necesario"
        )
        documento(a.imposibilidadValorReferencia)
      }
      const valor = euros(a.valorReferencia ?? a.valorMercado)
      const apto =
        vacio(a, c, x.obra.inicio) &&
        h.inventarioArrendables.includes(a.inmueble.id) &&
        x.obra.fin <= moverMes(x.obra.inicio, 24) &&
        a.contrato >= x.obra.fin &&
        a.contrato <= moverMes(x.obra.fin, 6) &&
        a.contrato <= "2025-12-31" &&
        compara(valor, euros("250000")) <= 0
      const fr = propiedad(a.inmueble, c)
      const coste = pagos(
        x.obra.pagos,
        ["reparacion", "conservacion", "certificado", "contrato"],
        true,
        "hasta2025",
        "satisfecho"
      )
      const consumida = euros(x.baseConsumidaAnterior)
      exige(compara(consumida, euros("9000")) <= 0, "Historia de base>9000")
      exige(
        ids(x.basePendienteAnterior.map((s) => String(s.origen))),
        "Base histórica duplicada por origen"
      )
      let historica = cero
      for (const s of x.basePendienteAnterior) {
        exige(
          s.origen < 2025 && s.caduca >= s.origen && s.caduca <= s.origen + 4,
          "Saldo histórico inválido"
        )
        if (s.caduca >= 2025) historica = mas(historica, euros(s.importe))
      }
      const nueva =
        a.contrato >= "2025-01-01"
          ? max(
              cero,
              menos(min(coste, euros("9000")), mas(consumida, historica))
            )
          : cero
      const base = mas(nueva, historica)
      exige(
        compara(mas(base, consumida), euros("9000")) <= 0,
        "Base histórica+nueva supera9000/vivienda"
      )
      const aplicada = apto ? min(base, min(euros("3000"), restante)) : cero
      restante = menos(restante, aplicada)
      const v = producto(por(aplicada, 15, 100), fr)
      total = mas(total, v)
      tr.push(
        paso(
          a.id,
          "Base9000 total,3000/vivienda y6000 concurrentes;sin límite renta700",
          base,
          v
        )
      )
      if (apto) {
        let consumo = aplicada
        for (const s of [...x.basePendienteAnterior].sort(
          (a, b) => a.caduca - b.caduca || a.origen - b.origen
        )) {
          if (s.caduca < 2025) continue
          const gasto = min(consumo, euros(s.importe))
          consumo = menos(consumo, gasto)
          const resto = menos(euros(s.importe), gasto)
          if (compara(resto, cero) > 0)
            saldos.push({
              inmueble: a.inmueble.id,
              tipo: "base",
              origen: s.origen,
              caduca: s.caduca,
              importe: serial(resto),
              condicion:
                "Base histórica conserva caducidad;continuidad arriendo",
            })
        }
        const exceso = max(cero, menos(nueva, consumo))
        if (compara(exceso, cero) > 0)
          saldos.push({
            inmueble: a.inmueble.id,
            tipo: "base",
            origen: 2025,
            caduca: h.viviendas.length >= 2 ? 2029 : 2027,
            importe: serial(exceso),
            condicion: "Base nueva;continuidad de requisitos del arriendo",
          })
      }
    }
    return resultado(
      c,
      total,
      tr,
      [
        "Aplicación por cuota pendiente: remanente de cuota4años y continuidad arriendo; no confundir base pendiente con cuota pendiente",
      ],
      saldos
    )
  })
}
