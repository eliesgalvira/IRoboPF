import ExcelJS from "exceljs"

import type {
  HallazgoAuditoria,
  AuditoriaRangoSalarial,
  PuntoAuditoriaRangoSalarial,
} from "@/lib/domain/progresividad"

const centimosAEuros = (centimos: number) => centimos / 100

const porcentaje = (valor: number) => Number((valor * 100).toFixed(2))

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

const filaAuditoriaCompatible =
  (auditoria: AuditoriaRangoSalarial) =>
  (punto: PuntoAuditoriaRangoSalarial) => {
    const factor = Number(punto.comparacion.factorIpc)

    return {
      anio: auditoria.anioComparado,
      bruto: centimosAEuros(punto.salarioBrutoAnualCentimos),
      factor: Number(factor.toFixed(4)),
      ipc: `${((factor - 1) * 100).toFixed(2)}%`,
      nominal: centimosAEuros(
        punto.comparacion.comparado.salarioBrutoNominalAnualCentimos
      ),
      costeLaboral: centimosAEuros(
        punto.comparacion.comparado.ajustado.costeLaboralCentimos
      ),
      cotizacionEmpresarial: centimosAEuros(
        punto.comparacion.comparado.ajustado.cotizacionEmpresarialCentimos
      ),
      cotizacionTrabajador: centimosAEuros(
        punto.comparacion.comparado.ajustado.cotizacionTrabajadorCentimos
      ),
      irpf: centimosAEuros(
        punto.comparacion.comparado.ajustado.irpfFinalCentimos
      ),
      netoComparado: centimosAEuros(
        punto.comparacion.comparado.ajustado.salarioNetoAnualCentimos
      ),
      netoReferencia: centimosAEuros(
        punto.comparacion.referencia.salarioNetoAnualCentimos
      ),
      mensual: centimosAEuros(
        punto.comparacion.diferenciaPoderAdquisitivoNetoMensualCentimos
      ),
      anual: centimosAEuros(
        punto.comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos
      ),
    }
  }

const anadirHojaComparativaCompatible = (
  libro: ExcelJS.Workbook,
  auditoria: AuditoriaRangoSalarial
) => {
  const hoja = libro.addWorksheet("COMPARATIVA_INFLACION")
  hoja.columns = [
    { header: "Año a Comparar", key: "anio" },
    { header: "Salario Equivalente (2026)", key: "bruto" },
    { header: "Multiplicador IPC Acum.", key: "factor" },
    { header: "IPC Acumulado (%)", key: "ipc" },
    { header: "Salario Bruto Nominal", key: "nominal" },
    { header: "Coste Lab. (Euros 2026)", key: "costeLaboral" },
    { header: "SS Emp. (Euros 2026)", key: "cotizacionEmpresarial" },
    { header: "SS Tra. (Euros 2026)", key: "cotizacionTrabajador" },
    { header: "IRPF (Euros 2026)", key: "irpf" },
    { header: "Neto Real en su Año", key: "netoComparado" },
    { header: "Neto Real en 2026", key: "netoReferencia" },
    {
      header: "Variación Poder Adquisitivo Mensual vs 2026 (12 pagas)",
      key: "mensual",
    },
    { header: "Pérdida/Ganancia Anual Poder Adq.", key: "anual" },
  ]
  hoja.addRows(auditoria.puntos.map(filaAuditoriaCompatible(auditoria)))
  aplicarEstiloCabecera(hoja)
}

export const construirLibroAuditoriaCompatible = (
  auditoria: AuditoriaRangoSalarial
) => {
  const libro = crearLibro()
  anadirHojaComparativaCompatible(libro, auditoria)
  return libro
}

export const exportarAuditoriaCompatibleExcel = async (
  auditoria: AuditoriaRangoSalarial
) => {
  await descargarLibro(
    construirLibroAuditoriaCompatible(auditoria),
    `IRoboPF_Compatible_${auditoria.anioComparado}_${auditoria.anioReferencia}.xlsx`
  )
}
