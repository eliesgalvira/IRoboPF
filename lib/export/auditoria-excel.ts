import ExcelJS from "exceljs"
import { Clock, Effect } from "effect"
import { Deflate } from "fflate"

import type {
  HallazgoAuditoria,
  AuditoriaRangoSalarial,
  OpcionesRangoSalarialEuros,
  PuntoAuditoriaRangoSalarial,
  RangoSalarialEuros,
  TablaCompatible,
} from "../domain/progresividad"
import {
  aniosFiscalesLegacy,
  configuracionExportacionCompatibleLegacy,
  construirTablaComparativaInflacionCompatible,
  construirTablaControlGeneralCompatible,
  construirTablaControlTramosIrpfCompatible,
  construirTablaDetalleAnualCompatible,
} from "../domain/progresividad"

const centimosAEuros = (centimos: number) => centimos / 100

const porcentaje = (valor: number) => Number((valor * 100).toFixed(2))

export interface OpcionesLibroAuditoriaCompatible {
  readonly comparativa?: OpcionesRangoSalarialEuros
  readonly detalle?: OpcionesRangoSalarialEuros
}

export interface ProgresoExportacionCompatible {
  readonly fase:
    | "preparando"
    | "generando"
    | "empaquetando"
    | "descargando"
    | "completado"
  readonly hoja: string
  readonly filasHoja: number
  readonly filasHojaTotales: number
  readonly filasTotales: number
  readonly filasProcesadas: number
  readonly hojasTotales: number
  readonly hojasProcesadas: number
  readonly porcentaje: number
  readonly milisegundosTranscurridos: number
  readonly mensaje: string
}

export interface OpcionesExportacionCompatibleConProgreso extends OpcionesLibroAuditoriaCompatible {
  readonly filasPorBloque?: number
  readonly onProgreso?: (progreso: ProgresoExportacionCompatible) => void
}

interface PlanHojaCompatible {
  readonly nombre: string
  readonly filasTotales: number
  readonly construirTabla: () => TablaCompatible
}

const crearLibro = () => {
  const libro = new ExcelJS.Workbook()
  libro.creator = "IRoboPF"
  libro.created = new Date()
  return libro
}

const descargarLibro = async (
  libro: ExcelJS.Workbook,
  nombreArchivo: string
) => {
  const contenido = await libro.xlsx.writeBuffer()
  const archivo = new Blob([contenido], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url = URL.createObjectURL(archivo)
  const enlace = document.createElement("a")
  enlace.href = url
  enlace.download = nombreArchivo
  enlace.click()
  URL.revokeObjectURL(url)
}

const textoCabecera = (cabecera: unknown) => {
  if (cabecera === undefined) {
    return ""
  }

  if (cabecera === null) {
    return ""
  }

  if (globalThis.Array.isArray(cabecera)) {
    return cabecera.join(" ")
  }

  return cabecera.toString()
}

const aplicarEstiloCabecera = (hoja: ExcelJS.Worksheet) => {
  hoja.getRow(1).font = { bold: true }
  hoja.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF3F4F6" },
  }
  hoja.columns.forEach((columna) => {
    columna.width = Math.max(textoCabecera(columna.header).length, 16)
  })
}

const anadirTabla = (
  libro: ExcelJS.Workbook,
  nombreHoja: string,
  tabla: TablaCompatible
) => {
  const hoja = libro.addWorksheet(nombreHoja)
  hoja.columns = tabla.cabeceras.map((cabecera) => ({
    header: cabecera,
    key: cabecera,
  }))

  for (const fila of tabla.filas) {
    hoja.addRow([...fila])
  }

  aplicarEstiloCabecera(hoja)
}

const rangoSalarialEuros = (
  rangoPorDefecto: RangoSalarialEuros,
  opciones: OpcionesRangoSalarialEuros | undefined
): RangoSalarialEuros => ({
  salarioMinimoEuros:
    opciones?.salarioMinimoEuros ?? rangoPorDefecto.salarioMinimoEuros,
  salarioMaximoEuros:
    opciones?.salarioMaximoEuros ?? rangoPorDefecto.salarioMaximoEuros,
  pasoEuros: opciones?.pasoEuros ?? rangoPorDefecto.pasoEuros,
})

const contarFilasRango = (rango: RangoSalarialEuros): number => {
  if (
    rango.pasoEuros <= 0 ||
    rango.salarioMaximoEuros < rango.salarioMinimoEuros
  ) {
    return 0
  }

  return (
    Math.floor(
      (rango.salarioMaximoEuros - rango.salarioMinimoEuros) / rango.pasoEuros
    ) + 1
  )
}

const crearPlanCompatible = (
  opciones: OpcionesLibroAuditoriaCompatible
): ReadonlyArray<PlanHojaCompatible> => {
  const tablaControlGeneral = construirTablaControlGeneralCompatible()
  const tablaControlTramos = construirTablaControlTramosIrpfCompatible()
  const filasComparativa =
    aniosFiscalesLegacy.length *
    contarFilasRango(
      rangoSalarialEuros(
        configuracionExportacionCompatibleLegacy.comparativa,
        opciones.comparativa
      )
    )
  const filasDetalle = contarFilasRango(
    rangoSalarialEuros(
      configuracionExportacionCompatibleLegacy.detalleAnual,
      opciones.detalle
    )
  )

  return [
    {
      nombre: "CONTROL_GENERAL",
      filasTotales: Array.from(tablaControlGeneral.filas).length,
      construirTabla: () => tablaControlGeneral,
    },
    {
      nombre: "CONTROL_TRAMOS_IRPF",
      filasTotales: Array.from(tablaControlTramos.filas).length,
      construirTabla: () => tablaControlTramos,
    },
    {
      nombre: "COMPARATIVA_INFLACION",
      filasTotales: filasComparativa,
      construirTabla: () =>
        construirTablaComparativaInflacionCompatible(opciones.comparativa),
    },
    ...aniosFiscalesLegacy.map(
      (anio) =>
        ({
          nombre: `DAT_${anio}`,
          filasTotales: filasDetalle,
          construirTabla: () =>
            construirTablaDetalleAnualCompatible(anio, opciones.detalle),
        }) satisfies PlanHojaCompatible
    ),
  ]
}

const emitirProgreso = (
  onProgreso: ((progreso: ProgresoExportacionCompatible) => void) | undefined,
  inicioMillis: number,
  progreso: Omit<ProgresoExportacionCompatible, "milisegundosTranscurridos">
) =>
  Effect.gen(function* () {
    const ahoraMillis = yield* Clock.currentTimeMillis
    yield* Effect.sync(() =>
      onProgreso?.({
        ...progreso,
        milisegundosTranscurridos: Math.max(0, ahoraMillis - inicioMillis),
      })
    )
  })

const construirProgreso = ({
  fase,
  hoja,
  filasHoja,
  filasHojaTotales,
  filasTotales,
  filasProcesadas,
  hojasTotales,
  hojasProcesadas,
  mensaje,
}: Omit<
  ProgresoExportacionCompatible,
  "porcentaje" | "milisegundosTranscurridos"
>) => ({
  fase,
  hoja,
  filasHoja,
  filasHojaTotales,
  filasTotales,
  filasProcesadas,
  hojasTotales,
  hojasProcesadas,
  porcentaje:
    filasTotales === 0
      ? 0
      : Math.min(100, (filasProcesadas / filasTotales) * 100),
  mensaje,
})

const anadirTablaIncremental = Effect.fn(
  "export.auditoriaExcel.anadirTablaIncremental"
)(function* (
  libro: ExcelJS.Workbook,
  plan: PlanHojaCompatible,
  indiceHoja: number,
  hojasTotales: number,
  filasTotales: number,
  filasProcesadasAntes: number,
  filasPorBloque: number,
  inicioMillis: number,
  onProgreso?: (progreso: ProgresoExportacionCompatible) => void
) {
  const tabla = plan.construirTabla()
  const hoja = libro.addWorksheet(plan.nombre)
  hoja.columns = tabla.cabeceras.map((cabecera) => ({
    header: cabecera,
    key: cabecera,
  }))

  yield* emitirProgreso(
    onProgreso,
    inicioMillis,
    construirProgreso({
      fase: "generando",
      hoja: plan.nombre,
      filasHoja: 0,
      filasHojaTotales: plan.filasTotales,
      filasTotales,
      filasProcesadas: filasProcesadasAntes,
      hojasTotales,
      hojasProcesadas: indiceHoja,
      mensaje: `${plan.nombre}: preparando columnas`,
    })
  )
  yield* Effect.yieldNow

  let filasHoja = 0
  for (const fila of tabla.filas) {
    hoja.addRow([...fila])
    filasHoja += 1

    if (filasHoja % filasPorBloque === 0) {
      yield* emitirProgreso(
        onProgreso,
        inicioMillis,
        construirProgreso({
          fase: "generando",
          hoja: plan.nombre,
          filasHoja,
          filasHojaTotales: plan.filasTotales,
          filasTotales,
          filasProcesadas: filasProcesadasAntes + filasHoja,
          hojasTotales,
          hojasProcesadas: indiceHoja,
          mensaje: `${plan.nombre}: ${filasHoja.toLocaleString("es-ES")} de ${plan.filasTotales.toLocaleString("es-ES")} filas`,
        })
      )
      yield* Effect.yieldNow
    }
  }

  aplicarEstiloCabecera(hoja)
  yield* emitirProgreso(
    onProgreso,
    inicioMillis,
    construirProgreso({
      fase: "generando",
      hoja: plan.nombre,
      filasHoja,
      filasHojaTotales: plan.filasTotales,
      filasTotales,
      filasProcesadas: filasProcesadasAntes + filasHoja,
      hojasTotales,
      hojasProcesadas: indiceHoja + 1,
      mensaje: `${plan.nombre}: hoja completada`,
    })
  )
  yield* Effect.yieldNow

  return filasHoja
})

const anadirHojaManual = (
  libro: ExcelJS.Workbook,
  auditoria: AuditoriaRangoSalarial
) => {
  const hoja = libro.addWorksheet("MANUAL_AUDITORIA")
  hoja.columns = [
    { header: "Concepto", key: "concepto" },
    { header: "Explicacion", key: "explicacion", width: 72 },
  ]
  hoja.addRows([
    {
      concepto: "Periodo comparado",
      explicacion: `${auditoria.anioComparado} frente a ${auditoria.anioReferencia}, siempre ajustado por IPC.`,
    },
    {
      concepto: "Rango salarial",
      explicacion: `${centimosAEuros(auditoria.salarioBrutoAnualMinimoCentimos).toLocaleString("es-ES")} EUR - ${centimosAEuros(auditoria.salarioBrutoAnualMaximoCentimos).toLocaleString("es-ES")} EUR`,
    },
    {
      concepto: "Lectura del signo",
      explicacion:
        "Una perdida positiva significa que el año comparado dejaba mas salario neto real que la legislacion actual.",
    },
  ])
  aplicarEstiloCabecera(hoja)
}

const filaHallazgo = (hallazgo: HallazgoAuditoria) => ({
  titulo: hallazgo.titulo,
  salario: centimosAEuros(hallazgo.salarioBrutoAnualCentimos),
  severidad: hallazgo.severidad,
  descripcion: hallazgo.descripcion,
})

const anadirHojaHallazgos = (
  libro: ExcelJS.Workbook,
  auditoria: AuditoriaRangoSalarial
) => {
  const hoja = libro.addWorksheet("HALLAZGOS")
  hoja.columns = [
    { header: "Hallazgo", key: "titulo", width: 34 },
    { header: "Salario bruto 2026", key: "salario", width: 20 },
    { header: "Severidad", key: "severidad", width: 14 },
    { header: "Explicacion", key: "descripcion", width: 82 },
  ]
  hoja.addRows(auditoria.hallazgos.map(filaHallazgo))
  aplicarEstiloCabecera(hoja)
}

const filaExploracionEducativa = (punto: PuntoAuditoriaRangoSalarial) => ({
  bruto: centimosAEuros(punto.salarioBrutoAnualCentimos),
  nominal: centimosAEuros(
    punto.comparacion.comparado.salarioBrutoNominalAnualCentimos
  ),
  netoComparado: centimosAEuros(
    punto.comparacion.comparado.ajustado.salarioNetoAnualCentimos
  ),
  netoReferencia: centimosAEuros(
    punto.comparacion.referencia.salarioNetoAnualCentimos
  ),
  diferencia: centimosAEuros(
    punto.comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos
  ),
  cargaActual: porcentaje(punto.tipoCargaActual),
  cargaComparada: porcentaje(punto.tipoCargaComparada),
  cunaActual: porcentaje(punto.tipoCunaLaboralActual),
  cunaComparada: porcentaje(punto.tipoCunaLaboralComparada),
})

const anadirHojaExploracion = (
  libro: ExcelJS.Workbook,
  auditoria: AuditoriaRangoSalarial
) => {
  const hoja = libro.addWorksheet("EXPLORACION_RANGO")
  hoja.columns = [
    { header: "Salario bruto 2026", key: "bruto" },
    { header: `Bruto nominal ${auditoria.anioComparado}`, key: "nominal" },
    {
      header: `Neto ${auditoria.anioComparado} ajustado`,
      key: "netoComparado",
    },
    { header: `Neto ${auditoria.anioReferencia}`, key: "netoReferencia" },
    { header: "Perdida/Ganancia anual", key: "diferencia" },
    { header: "Carga bruto actual %", key: "cargaActual" },
    { header: "Carga bruto comparada %", key: "cargaComparada" },
    { header: "Cuna fiscal actual %", key: "cunaActual" },
    { header: "Cuna fiscal comparada %", key: "cunaComparada" },
  ]
  hoja.addRows(auditoria.puntos.map(filaExploracionEducativa))
  aplicarEstiloCabecera(hoja)
}

export const construirLibroAuditoriaEducativa = (
  auditoria: AuditoriaRangoSalarial
) => {
  const libro = crearLibro()
  anadirHojaManual(libro, auditoria)
  anadirHojaHallazgos(libro, auditoria)
  anadirHojaExploracion(libro, auditoria)
  return libro
}

export const exportarAuditoriaEducativaExcel = async (
  auditoria: AuditoriaRangoSalarial
) => {
  await descargarLibro(
    construirLibroAuditoriaEducativa(auditoria),
    `IRoboPF_Auditoria_Educativa_${auditoria.anioComparado}_${auditoria.anioReferencia}.xlsx`
  )
}

export const construirLibroAuditoriaCompatible = (
  _auditoria: AuditoriaRangoSalarial,
  opciones: OpcionesLibroAuditoriaCompatible = {}
) => {
  const libro = crearLibro()
  anadirTabla(
    libro,
    "CONTROL_GENERAL",
    construirTablaControlGeneralCompatible()
  )
  anadirTabla(
    libro,
    "CONTROL_TRAMOS_IRPF",
    construirTablaControlTramosIrpfCompatible()
  )
  anadirTabla(
    libro,
    "COMPARATIVA_INFLACION",
    construirTablaComparativaInflacionCompatible(opciones.comparativa)
  )

  // La exportacion compatible replica el oracle congelado completo; por eso las
  // hojas DAT_YYYY no dependen del rango educativo elegido en la pantalla.
  for (const anio of aniosFiscalesLegacy) {
    anadirTabla(
      libro,
      `DAT_${anio}`,
      construirTablaDetalleAnualCompatible(anio, opciones.detalle)
    )
  }

  return libro
}

export const construirLibroAuditoriaCompatibleConProgreso = Effect.fn(
  "export.auditoriaExcel.construirLibroAuditoriaCompatibleConProgreso"
)(function* (
  _auditoria: AuditoriaRangoSalarial,
  opciones: OpcionesExportacionCompatibleConProgreso = {}
) {
  const libro = crearLibro()
  const inicioMillis = yield* Clock.currentTimeMillis
  const planes = crearPlanCompatible(opciones)
  const hojasTotales = planes.length
  const filasTotales = planes.reduce(
    (total, plan) => total + plan.filasTotales,
    0
  )
  const filasPorBloque = opciones.filasPorBloque ?? 1_000
  let filasProcesadas = 0

  yield* emitirProgreso(
    opciones.onProgreso,
    inicioMillis,
    construirProgreso({
      fase: "preparando",
      hoja: "LIBRO",
      filasHoja: 0,
      filasHojaTotales: 0,
      filasTotales,
      filasProcesadas,
      hojasTotales,
      hojasProcesadas: 0,
      mensaje: `Preparando ${hojasTotales} hojas y ${filasTotales.toLocaleString("es-ES")} filas`,
    })
  )
  yield* Effect.yieldNow

  for (const [indiceHoja, plan] of planes.entries()) {
    const filasHoja = yield* anadirTablaIncremental(
      libro,
      plan,
      indiceHoja,
      hojasTotales,
      filasTotales,
      filasProcesadas,
      filasPorBloque,
      inicioMillis,
      opciones.onProgreso
    )
    filasProcesadas += filasHoja
  }

  return libro
})

export const exportarAuditoriaCompatibleExcel = async (
  auditoria: AuditoriaRangoSalarial
) => {
  await descargarLibro(
    construirLibroAuditoriaCompatible(auditoria),
    "Auditoria_Integral_Nominas_e_Inflacion_2012_2026.xlsx"
  )
}

const tipoMimeXlsx =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

const codificadorTexto = new TextEncoder()

const tablaCrc32 = (() => {
  const tabla = new Uint32Array(256)
  for (let indice = 0; indice < 256; indice += 1) {
    let valor = indice
    for (let bit = 0; bit < 8; bit += 1) {
      valor = valor & 1 ? 0xedb88320 ^ (valor >>> 1) : valor >>> 1
    }
    tabla[indice] = valor >>> 0
  }
  return tabla
})()

const actualizarCrc32 = (crc: number, datos: Uint8Array) => {
  let siguiente = crc
  for (const byte of datos) {
    siguiente = tablaCrc32[(siguiente ^ byte) & 0xff] ^ (siguiente >>> 8)
  }
  return siguiente >>> 0
}

const escribirUint16 = (vista: DataView, offset: number, valor: number) => {
  vista.setUint16(offset, valor, true)
}

const escribirUint32 = (vista: DataView, offset: number, valor: number) => {
  vista.setUint32(offset, valor >>> 0, true)
}

const bufferZip = (tamano: number, escribir: (vista: DataView) => void) => {
  const buffer = new ArrayBuffer(tamano)
  escribir(new DataView(buffer))
  return new Uint8Array(buffer)
}

const fechaZip = () => {
  const fecha = new Date()
  const hora =
    (fecha.getHours() << 11) |
    (fecha.getMinutes() << 5) |
    Math.floor(fecha.getSeconds() / 2)
  const dia =
    ((fecha.getFullYear() - 1980) << 9) |
    ((fecha.getMonth() + 1) << 5) |
    fecha.getDate()
  return { hora, dia }
}

interface EntradaZip {
  readonly nombre: string
  readonly crc: number
  readonly tamanoComprimido: number
  readonly tamanoSinComprimir: number
  readonly offset: number
}

interface EntradaZipAbierta {
  readonly nombre: string
  readonly offset: number
  readonly deflate: Deflate
  crc: number
  tamanoComprimido: number
  tamanoSinComprimir: number
}

class ZipComprimido {
  readonly partes: Array<Uint8Array> = []
  readonly entradas: Array<EntradaZip> = []
  private offset = 0

  anadir(nombre: string, contenido: Iterable<string>) {
    const entrada = this.iniciar(nombre)
    for (const fragmento of contenido) {
      this.anadirFragmento(entrada, fragmento)
    }
    this.cerrar(entrada)
  }

  iniciar(nombre: string): EntradaZipAbierta {
    const nombreCodificado = codificadorTexto.encode(nombre)
    const { hora, dia } = fechaZip()
    const offsetEntrada = this.offset

    this.anadirBytes(
      bufferZip(30 + nombreCodificado.byteLength, (vista) => {
        escribirUint32(vista, 0, 0x04034b50)
        escribirUint16(vista, 4, 20)
        escribirUint16(vista, 6, 0x0808)
        escribirUint16(vista, 8, 8)
        escribirUint16(vista, 10, hora)
        escribirUint16(vista, 12, dia)
        escribirUint32(vista, 14, 0)
        escribirUint32(vista, 18, 0)
        escribirUint32(vista, 22, 0)
        escribirUint16(vista, 26, nombreCodificado.byteLength)
        escribirUint16(vista, 28, 0)
        new Uint8Array(vista.buffer).set(nombreCodificado, 30)
      })
    )

    const entrada: EntradaZipAbierta = {
      nombre,
      offset: offsetEntrada,
      crc: 0xffffffff,
      tamanoComprimido: 0,
      tamanoSinComprimir: 0,
      deflate: new Deflate({ level: 6, mem: 8 }, (datos) => {
        entrada.tamanoComprimido += datos.byteLength
        this.anadirBytes(datos)
      }),
    }
    return entrada
  }

  anadirFragmento(entrada: EntradaZipAbierta, fragmento: string) {
    if (fragmento.length === 0) return
    const datos = codificadorTexto.encode(fragmento)
    entrada.crc = actualizarCrc32(entrada.crc, datos)
    entrada.tamanoSinComprimir += datos.byteLength
    entrada.deflate.push(datos)
  }

  cerrar(entrada: EntradaZipAbierta) {
    entrada.deflate.push(new Uint8Array(0), true)
    const crcFinal = (entrada.crc ^ 0xffffffff) >>> 0
    this.anadirBytes(
      bufferZip(16, (vista) => {
        escribirUint32(vista, 0, 0x08074b50)
        escribirUint32(vista, 4, crcFinal)
        escribirUint32(vista, 8, entrada.tamanoComprimido)
        escribirUint32(vista, 12, entrada.tamanoSinComprimir)
      })
    )
    this.entradas.push({
      nombre: entrada.nombre,
      crc: crcFinal,
      tamanoComprimido: entrada.tamanoComprimido,
      tamanoSinComprimir: entrada.tamanoSinComprimir,
      offset: entrada.offset,
    })
  }

  blob() {
    const inicioDirectorio = this.offset
    const { hora, dia } = fechaZip()

    for (const entrada of this.entradas) {
      const nombreCodificado = codificadorTexto.encode(entrada.nombre)
      this.anadirBytes(
        bufferZip(46 + nombreCodificado.byteLength, (vista) => {
          escribirUint32(vista, 0, 0x02014b50)
          escribirUint16(vista, 4, 20)
          escribirUint16(vista, 6, 20)
          escribirUint16(vista, 8, 0x0808)
          escribirUint16(vista, 10, 8)
          escribirUint16(vista, 12, hora)
          escribirUint16(vista, 14, dia)
          escribirUint32(vista, 16, entrada.crc)
          escribirUint32(vista, 20, entrada.tamanoComprimido)
          escribirUint32(vista, 24, entrada.tamanoSinComprimir)
          escribirUint16(vista, 28, nombreCodificado.byteLength)
          escribirUint16(vista, 30, 0)
          escribirUint16(vista, 32, 0)
          escribirUint16(vista, 34, 0)
          escribirUint16(vista, 36, 0)
          escribirUint32(vista, 38, 0)
          escribirUint32(vista, 42, entrada.offset)
          new Uint8Array(vista.buffer).set(nombreCodificado, 46)
        })
      )
    }

    const tamanoDirectorio = this.offset - inicioDirectorio
    this.anadirBytes(
      bufferZip(22, (vista) => {
        escribirUint32(vista, 0, 0x06054b50)
        escribirUint16(vista, 4, 0)
        escribirUint16(vista, 6, 0)
        escribirUint16(vista, 8, this.entradas.length)
        escribirUint16(vista, 10, this.entradas.length)
        escribirUint32(vista, 12, tamanoDirectorio)
        escribirUint32(vista, 16, inicioDirectorio)
        escribirUint16(vista, 20, 0)
      })
    )

    return new Blob(this.partes as unknown as BlobPart[], {
      type: tipoMimeXlsx,
    })
  }

  private anadirBytes(datos: Uint8Array) {
    this.partes.push(datos)
    this.offset += datos.byteLength
  }
}

const escaparXml = (valor: string) =>
  valor
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")

const atributoEspacio = (valor: string) =>
  valor.trim() === valor ? "" : ' xml:space="preserve"'

const columnaExcel = (indice: number) => {
  let restante = indice + 1
  let columna = ""
  while (restante > 0) {
    const modulo = (restante - 1) % 26
    columna = String.fromCharCode(65 + modulo) + columna
    restante = Math.floor((restante - modulo) / 26)
  }
  return columna
}

const celdaXml = (
  valor: string | number,
  indiceFila: number,
  indiceColumna: number,
  estilo?: number
) => {
  const referencia = `${columnaExcel(indiceColumna)}${indiceFila}`
  const atributoEstilo = estilo === undefined ? "" : ` s="${estilo}"`
  if (typeof valor === "number") {
    return `<c r="${referencia}"${atributoEstilo}><v>${Number.isFinite(valor) ? valor : 0}</v></c>`
  }

  return `<c r="${referencia}" t="inlineStr"${atributoEstilo}><is><t${atributoEspacio(valor)}>${escaparXml(valor)}</t></is></c>`
}

const libroXml = (planes: ReadonlyArray<PlanHojaCompatible>) =>
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${planes.map((plan, indice) => `<sheet name="${escaparXml(plan.nombre)}" sheetId="${indice + 1}" r:id="rId${indice + 1}"/>`).join("")}</sheets></workbook>`

const relacionesLibroXml = (planes: ReadonlyArray<PlanHojaCompatible>) =>
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${planes.map((_, indice) => `<Relationship Id="rId${indice + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${indice + 1}.xml"/>`).join("")}<Relationship Id="rId${planes.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`

const tiposContenidoXml = (planes: ReadonlyArray<PlanHojaCompatible>) =>
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${planes.map((_, indice) => `<Override PartName="/xl/worksheets/sheet${indice + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`

const descargarBlob = (archivo: Blob, nombreArchivo: string) =>
  Effect.sync(() => {
    const url = URL.createObjectURL(archivo)
    const enlace = document.createElement("a")
    enlace.href = url
    enlace.download = nombreArchivo
    enlace.click()
    setTimeout(() => URL.revokeObjectURL(url), 0)
  })

export const construirBlobXlsxCompatibleConProgreso = Effect.fn(
  "export.auditoriaExcel.construirBlobXlsxCompatibleConProgreso"
)(function* (
  opciones: OpcionesExportacionCompatibleConProgreso = {},
  inicioMillis: number
) {
  const planes = crearPlanCompatible(opciones)
  const filasTotales = planes.reduce(
    (total, plan) => total + plan.filasTotales,
    0
  )
  const hojasTotales = planes.length
  const filasPorBloque = opciones.filasPorBloque ?? 1_000
  const zip = new ZipComprimido()
  let filasProcesadas = 0

  zip.anadir("_rels/.rels", [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>',
  ])
  zip.anadir("docProps/app.xml", [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>IRoboPF</Application></Properties>',
  ])
  zip.anadir("docProps/core.xml", [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>IRoboPF</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created></cp:coreProperties>`,
  ])
  zip.anadir("[Content_Types].xml", [tiposContenidoXml(planes)])
  zip.anadir("xl/workbook.xml", [libroXml(planes)])
  zip.anadir("xl/_rels/workbook.xml.rels", [relacionesLibroXml(planes)])
  zip.anadir("xl/styles.xml", [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF3F4F6"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs></styleSheet>',
  ])

  for (const [indiceHoja, plan] of planes.entries()) {
    const tabla = plan.construirTabla()
    const entrada = zip.iniciar(`xl/worksheets/sheet${indiceHoja + 1}.xml`)
    const columnas = tabla.cabeceras
      .map((cabecera, indice) => {
        const ancho = Math.max(textoCabecera(cabecera).length, 16)
        return `<col min="${indice + 1}" max="${indice + 1}" width="${ancho}" customWidth="1"/>`
      })
      .join("")
    let filasHoja = 0

    zip.anadirFragmento(
      entrada,
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols>${columnas}</cols><sheetData>`
    )
    zip.anadirFragmento(
      entrada,
      `<row r="1">${tabla.cabeceras.map((cabecera, indice) => celdaXml(cabecera, 1, indice, 1)).join("")}</row>`
    )

    let indiceFila = 1
    let fragmentoFilas = ""
    for (const fila of tabla.filas) {
      indiceFila += 1
      filasHoja += 1
      fragmentoFilas += `<row r="${indiceFila}">${fila.map((valor, indice) => celdaXml(valor, indiceFila, indice)).join("")}</row>`

      if (filasHoja % filasPorBloque === 0) {
        zip.anadirFragmento(entrada, fragmentoFilas)
        fragmentoFilas = ""
        yield* emitirProgreso(
          opciones.onProgreso,
          inicioMillis,
          construirProgreso({
            fase: "generando",
            hoja: plan.nombre,
            filasHoja,
            filasHojaTotales: plan.filasTotales,
            filasTotales,
            filasProcesadas: filasProcesadas + filasHoja,
            hojasTotales,
            hojasProcesadas: indiceHoja,
            mensaje: `${plan.nombre}: ${filasHoja.toLocaleString("es-ES")} de ${plan.filasTotales.toLocaleString("es-ES")} filas escritas`,
          })
        )
        yield* Effect.yieldNow
      }
    }

    zip.anadirFragmento(entrada, fragmentoFilas)
    zip.anadirFragmento(entrada, "</sheetData></worksheet>")
    zip.cerrar(entrada)
    filasProcesadas += filasHoja
    yield* emitirProgreso(
      opciones.onProgreso,
      inicioMillis,
      construirProgreso({
        fase: "generando",
        hoja: plan.nombre,
        filasHoja,
        filasHojaTotales: plan.filasTotales,
        filasTotales,
        filasProcesadas,
        hojasTotales,
        hojasProcesadas: indiceHoja + 1,
        mensaje: `${plan.nombre}: hoja escrita en OOXML`,
      })
    )
    yield* Effect.yieldNow
  }

  yield* emitirProgreso(
    opciones.onProgreso,
    inicioMillis,
    construirProgreso({
      fase: "empaquetando",
      hoja: "XLSX",
      filasHoja: 0,
      filasHojaTotales: 0,
      filasTotales,
      filasProcesadas,
      hojasTotales,
      hojasProcesadas: hojasTotales,
      mensaje: "Cerrando ZIP XLSX comprimido sin modelo ExcelJS en memoria",
    })
  )
  yield* Effect.yieldNow

  return zip.blob()
})

export const exportarAuditoriaCompatibleExcelConProgreso = Effect.fn(
  "export.auditoriaExcel.exportarAuditoriaCompatibleExcelConProgreso"
)(function* (
  auditoria: AuditoriaRangoSalarial,
  opciones: OpcionesExportacionCompatibleConProgreso = {}
) {
  void auditoria
  const inicioMillis = yield* Clock.currentTimeMillis
  const filasTotales = crearPlanCompatible(opciones).reduce(
    (total, plan) => total + plan.filasTotales,
    0
  )

  yield* emitirProgreso(
    opciones.onProgreso,
    inicioMillis,
    construirProgreso({
      fase: "preparando",
      hoja: "LIBRO",
      filasHoja: 0,
      filasHojaTotales: 0,
      filasTotales,
      filasProcesadas: 0,
      hojasTotales: aniosFiscalesLegacy.length + 3,
      hojasProcesadas: 0,
      mensaje: `Preparando ${aniosFiscalesLegacy.length + 3} hojas y ${filasTotales.toLocaleString("es-ES")} filas`,
    })
  )
  yield* Effect.yieldNow

  const archivo = yield* construirBlobXlsxCompatibleConProgreso(
    opciones,
    inicioMillis
  )
  yield* descargarBlob(
    archivo,
    "Auditoria_Integral_Nominas_e_Inflacion_2012_2026.xlsx"
  )

  yield* emitirProgreso(
    opciones.onProgreso,
    inicioMillis,
    construirProgreso({
      fase: "completado",
      hoja: "XLSX",
      filasHoja: 0,
      filasHojaTotales: 0,
      filasTotales,
      filasProcesadas: filasTotales,
      hojasTotales: aniosFiscalesLegacy.length + 3,
      hojasProcesadas: aniosFiscalesLegacy.length + 3,
      mensaje: "Descarga preparada",
    })
  )
})
