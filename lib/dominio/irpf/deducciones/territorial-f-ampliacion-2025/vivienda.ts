import { hipotecaMadrid } from "./hipoteca-madrid"
import { racional, menor } from "../anual-territorial-racional"
import { aguaF, recargaF } from "./recarga-agua"
import type { SolicitudF, ViviendaF } from "./esquemas"
import {
  D,
  requerido,
  texto,
  opcion,
  entero,
  fecha,
  aniversario,
  edad,
  dinero,
  magnitudF,
  decimal,
  ids,
  unicos,
  minimo,
  reparto,
  renta,
  rentaFamiliarMadrid,
  baseFamiliar,
  base,
  pagos,
  sumaPagos,
  bancario,
  habitual,
  incompatible,
  falta,
  excluir,
  salida,
  salidaExactaF,
  sumarRepartoExactoF,
  dependencia,
  type ResultadoF,
} from "./comun"
export const CODIGOS_VIVIENDA_F = [
  "madrid_gastos_arrendamiento_viviendas",
  "madrid_arrendamiento_viviendas_vacias",
  "madrid_incremento_costes_financiacion_vivienda",
  "madrid_cambio_residencia_municipio_despoblacion",
  "madrid_vivienda_municipios_despoblacion",
  "madrid_intereses_vivienda_jovenes_menores_30",
  "madrid_intereses_estudios_grado_master_doctorado",
  "madrid_vivienda_nacimiento_adopcion_hijos",
  "madrid_arrendamiento_vivienda_habitual",
  "murcia_vivienda_jovenes_hasta_40",
  "murcia_dispositivos_ahorro_agua",
  "murcia_instalaciones_recursos_energeticos_renovables",
  "murcia_nueva_vivienda_o_ampliacion_familias_numerosas",
  "murcia_acceso_internet",
  "murcia_vehiculos_electricos",
  "murcia_recarga_vehiculos_electricos",
  "murcia_regimen_transitorio_inversion_vivienda_habitual",
  "murcia_arrendamiento_vivienda_habitual",
] as const
function viviendaUnica(s: SolicitudF): ViviendaF {
  const vs = requerido(s.hechos.viviendas, "viviendas")
  if (vs.length !== 1)
    falta(
      "viviendas",
      "Esta rama requiere una vivienda identificada; no aplicar topes separando solicitudes del mismo código"
    )
  const v = requerido(vs[0], "vivienda")
  texto(v.id, "vivienda.id")
  if (v.territorio !== s.contexto.territorio)
    excluir("vivienda.territorio", "Vivienda fuera del territorio")
  return v
}
function propiedad(v: ViviendaF, s: SolicitudF): import("./comun").Decimal {
  if (
    !ids(v.titulares, "vivienda.titulares").includes(s.contexto.contribuyente)
  )
    excluir("vivienda.titulares", "Titular ajeno a la propiedad")
  const p = decimal(v.porcentajePropiedad, "porcentajePropiedad")
  if (p.gt(100)) falta("porcentajePropiedad", "Porcentaje>100")
  return p.div(100)
}
function fianza(c: import("./esquemas").ContratoF, denuncia = false): void {
  if (c.fianza === undefined && denuncia) texto(c.denuncia, "denuncia")
  else texto(c.fianza, "fianza")
}
function coste(v: ViviendaF): import("./comun").Decimal {
  return dinero(v.precioEUR, "precioEUR")
    .plus(dinero(v.gastosEUR, "gastosEUR"))
    .plus(dinero(v.tributosEUR, "tributosEUR"))
}
function despoblacion(v: ViviendaF, s: SolicitudF, corteEdad = "2025-12-31"): void {
  if (edad(s.hechos.nacimientoContribuyente, corteEdad) >= 35)
    excluir("nacimientoContribuyente", "Edad>=35 en el ejercicio exigido: " + corteEdad.slice(0, 4))
  texto(v.municipio, "municipio")
  texto(v.referenciaPoblacion, "referenciaPoblacion")
  if (fecha(v.fechaPoblacion, "fechaPoblacion") !== "2024-01-01")
    falta(
      "fechaPoblacion",
      "Población INE a1/1 del ejercicio anterior al devengo2025"
    )
  if (entero(v.poblacion, "poblacion", 0, 10000000) >= 2500)
    excluir("poblacion", "Municipio>=2500 habitantes")
}
export function viviendaF(s: SolicitudF): ResultadoF {
  const c = s.codigo
  if (c === "madrid_intereses_estudios_grado_master_doctorado") {
    const prestamos = requerido(s.hechos.prestamos, "prestamos")
    unicos(
      prestamos.map((p) => texto(p.id, "prestamo.id")),
      "prestamos.id"
    )
    const ps = pagos(s, ["intereses_estudios"])
    for (const p of prestamos) {
      fecha(p.fecha, "prestamo.fecha")
      opcion(p.tipo, ["entidad_credito_estudios"], "prestamo.tipo")
      texto(p.entidadCredito, "entidadCredito")
      texto(p.destinoContrato, "destinoContrato")
      texto(p.soporteDestino, "soporteDestino")
      if (p.obligadoIntereses !== s.contexto.contribuyente)
        falta(
          "obligadoIntereses",
          "Obligado a satisfacer intereses distinto al titular"
        )
      const estudio = opcion(
        p.estudios,
        [
          "grado_oficial",
          "master_oficial",
          "doctorado_oficial",
          "master_propio",
        ],
        "estudios"
      )
      if (estudio === "master_propio")
        opcion(p.entidadImparteOficial, ["si"], "entidadImparteOficial")
      if (p.beneficiarioId !== s.contexto.contribuyente) {
        const b = requerido(s.hechos.personas, "personas").find(
          (x) => x.id === p.beneficiarioId
        )
        if (b === undefined)
          falta("prestamo.beneficiarioId", "Falta vínculo del estudiante")
        if (b.relacion === "conyuge")
          texto(b.certificadoParentesco, "certificadoParentesco")
        else if (b.alimentos64175 === "si")
          texto(b.certificadoParentesco, "resolucionAlimentos64175")
        else minimo(s, b)
      }
    }
    if (
      ps.some(
        (p) =>
          !prestamos.some(
            (x) =>
              x.id === p.objetoId &&
              fecha(x.fecha, "prestamo.fecha") <= fecha(p.fecha, "pago.fecha")
          )
      )
    )
      falta("pago.objetoId", "Intereses de préstamo sin identificar")
    return salida(s, sumaPagos(ps), [
      "Intereses satisfechos sin porcentaje reductor ni límite de renta de18.2",
    ])
  }
  if (c === "murcia_vehiculos_electricos") {
    const b = base(s)
    if (b.eq(35000))
      return {
        ...dependencia(
          s,
          {
            magnitud: "criterio_normativo",
            factor: "sin_resolver",
            operacion:
              "resolver solapamiento30%/22,50% de base imponible exactamente35000",
          },
          "F-N01: base imponible, no precio del vehículo"
        ),
        reservas: ["F-N01 sólo frontera individual exactamente35.000"],
      }
    if (b.gte(60000)) excluir("bases", "Renta>=60000")
    if (s.hechos.residenciaFiscalAdquisicion !== "murcia")
      excluir(
        "residenciaFiscalAdquisicion",
        "Domicilio fiscal fuera deMurcia al adquirir"
      )
    const vs = requerido(s.hechos.vehiculos, "vehiculos")
    unicos(
      vs.map((v) => texto(v.id, "vehiculo.id")),
      "vehiculos.id"
    )
    let total = new D(0)
    for (const v of vs) {
      const f = fecha(v.adquisicion, "vehiculo.adquisicion")
      if (!f.startsWith("2025-"))
        falta(
          "vehiculo.adquisicion",
          "Saldos de años anteriores requieren historial separado"
        )
      opcion(v.uso, ["particular"], "vehiculo.uso")
      const cat = opcion(
        v.categoria,
        ["M1", "L3e", "L4e", "L5e", "L1e"],
        "vehiculo.categoria"
      )
      const tecnologia = opcion(
        v.tecnologia,
        ["BEV", "EREV", "PHEV", "FCV", "FCHV"],
        "vehiculo.tecnologia"
      )
      const modalidad = opcion(
        v.modalidad,
        ["compraventa", "leasing", "renting"],
        "vehiculo.modalidad"
      )
      const origen = opcion(
        v.procedencia,
        ["nuevo", "importado", "demostracion"],
        "vehiculo.procedencia"
      )
      const matricula = fecha(v.matriculacion, "vehiculo.matriculacion")
      if (matricula > f)
        falta(
          "matriculacion",
          "Matriculación posterior a adquisición: falta alta efectiva"
        )
      if (origen === "demostracion") {
        const meses =
          (Number(f.slice(0, 4)) - Number(matricula.slice(0, 4))) * 12 +
          Number(f.slice(5, 7)) -
          Number(matricula.slice(5, 7))
        if (meses > 18 || (meses === 18 && f.slice(8) > matricula.slice(8)))
          excluir("matriculacion", "Demostración antigüedad>18 meses")
        texto(v.factura, "facturaDemostracionFabricanteImportador")
      }
      texto(v.contrato, "vehiculo.contrato")
      if (modalidad !== "renting" && v.titular !== s.contexto.contribuyente)
        falta(
          "vehiculo.titular",
          "Primera matrícula no identifica al beneficiario"
        )
      if (
        cat !== "M1" &&
        cat !== "L1e" &&
        (entero(v.potenciaKW, "potenciaKW", 0, 10000) < 3 ||
          entero(v.autonomiaKM, "autonomiaKM", 0, 10000) < 70)
      )
        excluir("potencia/autonomia", "Moto requiere>=3kW y>=70km")
      opcion(
        v.propiedadHastaDevengo,
        ["sin_transmision"],
        "propiedadHastaDevengo"
      )
      if (
        modalidad === "renting" &&
        fecha(v.rentingHasta, "rentingHasta") < aniversario(f, 2)
      )
        excluir("rentingHasta", "Contrato inferior a2 años")
      const ts = ids(v.titularesReparto, "vehiculo.titularesReparto")
      if (ts.length > 1) {
        if (ts.length !== 2)
          falta(
            "vehiculo.titularesReparto",
            "Reparto de más de2 titulares requiere contrato específico"
          )
        opcion(
          v.regimenTitularidad,
          modalidad === "compraventa"
            ? ["gananciales"]
            : ["gananciales", "cotitulares_contrato"],
          "regimenTitularidad"
        )
        if (v.regimenTitularidad === "gananciales")
          texto(v.certificadoGananciales, "certificadoGananciales")
      }
      const factor = reparto(s, ts)
      const limite =
        cat === "M1"
          ? tecnologia === "BEV" &&
            [8, 9].includes(entero(v.plazas, "plazas", 1, 100))
            ? 53000
            : 45000
          : cat === "L1e"
            ? 3000
            : 10000
      const neto = D.max(
        0,
        dinero(v.importeEUR, "importeEUR")
          .plus(dinero(v.gastosEUR, "gastosEUR"))
          .plus(dinero(v.tributosEUR, "tributosEUR"))
          .minus(dinero(v.ayudasEUR, "ayudasEUR"))
      )
      total = total.plus(
        D.min(
          7000,
          D.min(limite, neto).times(
            b.lt(35000) ? "0.30" : b.lt(45000) ? "0.225" : "0.15"
          )
        ).times(factor)
      )
    }
    return salida(
      s,
      total,
      ["Topes por vehículo antes del reparto; base no precio para tramo"],
      [
        "Mantener titularidad5 años/renting2 salvo excepciones; saldo por cuota arrastrable3 años, no aplicado aquí",
      ]
    )
  }
  if (c === "madrid_arrendamiento_viviendas_vacias") {
    const vs = requerido(s.hechos.viviendas, "viviendas")
    const cc = requerido(s.hechos.contratos, "contratos")
    if (vs.length > 5)
      falta(
        "viviendas",
        "Elegir máximo5 viviendas; no seleccionar automáticamente las favorables"
      )
    unicos(
      vs.map((v) => texto(v.id, "vivienda.id")),
      "viviendas.id"
    )
    unicos(
      cc.map((x) => texto(x.viviendaId, "contrato.viviendaId")),
      "contratos.viviendaId"
    )
    if (cc.length !== vs.length)
      falta("contratos", "Conciliar un contrato2025 por inmueble vacío")
    let total = new D(0)
    for (const v of vs) {
      if (v.territorio !== "madrid")
        excluir("vivienda.territorio", "Vivienda fuera deMadrid")
      const contrato = cc.find((x) => x.viviendaId === v.id)
      if (contrato === undefined)
        falta("contrato.viviendaId", "Falta contrato del inmueble")
      fianza(contrato)
      const inicio = fecha(contrato.desde, "contrato.desde")
      if (!inicio.startsWith("2025-"))
        excluir("contrato.desde", "No arrendada inicialmente en2025")
      if (aniversario(fecha(contrato.vaciaDesde, "vaciaDesde"), 1) > inicio)
        excluir("vaciaDesde", "Vacía menos de1 año")
      if (entero(contrato.parentescoGrado, "parentescoGrado", 0, 10) <= 3)
        excluir(
          "parentescoGrado",
          "Arrendatario pariente hasta tercero/cónyuge"
        )
      if (fecha(contrato.hasta, "contrato.hasta") < aniversario(inicio, 3))
        falta(
          "contrato.hasta",
          "Contrato3 años o cadena de reemplazos en6 meses"
        )
      total = total.plus(new D(1000).times(propiedad(v, s)))
    }
    return salida(
      s,
      total,
      ["Hasta5 inmuebles; propiedad individual por inmueble"],
      [
        "Contratos efectivos3 años; regularización al incumplir; sustitución de contrato exige cronología específica",
      ]
    )
  }
  const v = viviendaUnica(s)
  if (c === "madrid_gastos_arrendamiento_viviendas") {
    const contratos = requerido(s.hechos.contratos, "contratos")
    if (contratos.length !== 1)
      falta("contratos", "Una vivienda arrendada con contrato identificado")
    fianza(requerido(contratos[0], "contrato"))
    propiedad(v, s)
    return salida(
      s,
      D.min(
        "154.65",
        sumaPagos(
          pagos(
            s,
            [
              "conservacion",
              "reparacion",
              "formalizacion",
              "seguro",
              "certificado_energetico",
            ],
            texto(v.id, "vivienda.id")
          )
        ).times("0.10")
      ),
      ["Gastos propios de arrendador, tope anual154,65"]
    )
  }
  if (
    c === "madrid_arrendamiento_vivienda_habitual" ||
    c === "murcia_arrendamiento_vivienda_habitual"
  ) {
    habitual(v)
    const cc = requerido(s.hechos.contratos, "contratos")
    if (cc.length !== 1) falta("contratos", "Un contrato de vivienda habitual")
    const contrato = requerido(cc[0], "contrato")
    reparto(s, contrato.titulares)
    const titulares = ids(contrato.titulares, "contrato.titulares")
    const ps = pagos(
      s,
      ["alquiler"],
      texto(v.id, "vivienda.id"),
      c.startsWith("madrid") ? [s.contexto.contribuyente] : titulares
    )
    const neto = sumaPagos(ps, true)
    if (c.startsWith("murcia") && titulares.length > 1) {
      opcion(
        contrato.regimenReparto,
        ["gananciales_gasto_comun", "cotitulares_gasto_comun"],
        "contrato.regimenReparto"
      )
      ps.forEach((x) =>
        opcion(x.atribucion, ["gasto_comun"], "pago.atribucion")
      )
    }
    const inicio = fecha(contrato.desde, "contrato.desde")
    const fin = fecha(contrato.hasta, "contrato.hasta")
    if (
      fin < inicio ||
      ps.some(
        (p) =>
          fecha(p.fecha, "pago.fecha") < inicio ||
          fecha(p.fecha, "pago.fecha") > fin
      )
    )
      falta("pago.fecha/contrato", "Pago fuera del periodo contractual")
    if (c.startsWith("madrid")) {
      if (edad(s.hechos.nacimientoContribuyente) >= 40)
        excluir("edad", "Edad>=40")
      renta(s, "26414.22")
      if (baseFamiliar(s).gt(61860)) excluir("bases", "Unidad familiar>61860")
      fianza(contrato, true)
      if (neto.lte(base(s).times("0.20")))
        excluir("alquiler", "Alquiler no supera20% de base")
      return salida(s, D.min("1237.20", neto.times("0.30")), [
        "Pagos propios; no prorratea de nuevo importes atribuidos al pagador individual",
      ])
    }
    bancario(ps)
    const titulo = requerido(s.hechos.titulo, "titulo")
    const discapacidad = decimal(
      requerido(s.hechos.personas, "personas").find(
        (p) => p.id === s.contexto.contribuyente
      )?.discapacidadPorcentaje,
      "discapacidadPropia"
    )
    if (
      edad(s.hechos.nacimientoContribuyente) > 40 &&
      titulo.categoria === "no_numerosa" &&
      discapacidad.lt(65)
    )
      excluir("edad/titulo/grado", "No alcanza alternativa de elegibilidad")
    if (titulo.categoria !== "no_numerosa")
      texto(titulo.referencia, "titulo.referencia")
    if (
      fecha(contrato.itpPresentado, "itpPresentado") >
      fecha(contrato.itpVence, "itpVence")
    )
      excluir("itpPresentado", "Modelo ITP fuera de plazo")
    const b = requerido(s.hechos.bases, "bases").find(
      (b) => b.id === s.contexto.contribuyente
    )
    if (b === undefined) falta("bases", "Faltan bases")
    if (
      magnitudF(s, "general", b.generalEUR, b.id)
        .minus(
          magnitudF(s, "minimoPersonalFamiliar", s.hechos.minimoPersonalFamiliarEUR)
        )
        .gte(40000) ||
      magnitudF(s, "ahorro", b.ahorroEUR, b.id).gt(1800)
    )
      excluir("bases", "General-mínimo>=40000 o ahorro>1800")
    if (
      decimal(
        v.porcentajeOtraViviendaFamiliar,
        "porcentajeOtraViviendaFamiliar"
      ).gt(50)
    )
      excluir(
        "otraVivienda",
        "Titularidad otra vivienda>50% de miembro familiar"
      )
    opcion(v.derechoInversionVivienda, ["no"], "derechoInversionVivienda")
    return salidaExactaF(s, sumarRepartoExactoF(s, racional("0"), D.min(300, neto.times("0.10")), contrato.titulares), [
      "Tope300 por contrato antes de reparto individual",
    ])
  }
  if (c === "murcia_acceso_internet") {
    habitual(v)
    if (entero(v.poblacion, "poblacion", 0, 10000000) >= 15000)
      excluir("poblacion", "Municipio>=15000")
    if (fecha(v.fechaPoblacion, "fechaPoblacion") !== "2025-12-31")
      falta("fechaPoblacion", "Población de derecho a31 diciembre2025")
    texto(v.referenciaPoblacion, "referenciaPoblacion")
    const cc = requerido(s.hechos.contratos, "contratos")
    unicos(
      cc.map((x) => texto(x.id, "contrato.id")),
      "contratos.id"
    )
    for (const contrato of cc) {
      opcion(contrato.tipo, ["internet_alta_velocidad"], "contrato.tipo")
      if (!fecha(contrato.desde, "contrato.desde").startsWith("2025-"))
        excluir("contrato.desde", "Contrato fuera de2025")
      opcion(contrato.usoProfesional, ["no"], "usoProfesional")
      if (
        contrato.contratoAnteriorFecha !== undefined &&
        fecha(contrato.contratoAnteriorFecha, "contratoAnteriorFecha") <
          "2025-01-01"
      )
        excluir(
          "contratoAnteriorFecha",
          "Mero cambio de proveedor de contrato anterior"
        )
      if (
        requerido(contrato.lineasAnterioresVigentes, "lineasAnterioresVigentes")
          .length > 0
      )
        excluir(
          "lineasAnterioresVigentes",
          "Mantiene línea anterior simultánea"
        )
      opcion(
        contrato.historialDeduccionVivienda,
        ["ninguna"],
        "historialDeduccionVivienda"
      )
      opcion(
        contrato.historialDeduccionTitular,
        ["ninguna"],
        "historialDeduccionTitular"
      )
      if (
        contrato.fechaPrimeraDeduccionVivienda !== undefined ||
        contrato.fechaPrimeraDeduccionTitular !== undefined
      )
        excluir(
          "historial",
          "Deducción aplicada anteriormente en vivienda o titular"
        )
    }
    if (cc.length === 0) falta("contratos", "Falta contrato de alta")
    const ps = pagos(s, ["internet_alta", "internet_mensual"])
    if (ps.some((p) => !cc.some((x) => x.id === p.objetoId)))
      falta("pago.objetoId", "Pago sin contrato")
    return salidaExactaF(
      s,
      sumarRepartoExactoF(s, racional("0"), D.min(300, sumaPagos(ps).times("0.30")), requerido(cc[0], "contrato").titulares),
      ["Tope conjunto de contratos; una vez por vivienda/titular"]
    )
  }
  if (
    c === "madrid_cambio_residencia_municipio_despoblacion" ||
    c === "madrid_vivienda_municipios_despoblacion" ||
    c === "madrid_vivienda_nacimiento_adopcion_hijos"
  ) {
    rentaFamiliarMadrid(s)
    habitual(v)
    const compra = fecha(v.adquisicion, "vivienda.adquisicion")
    if (c !== "madrid_vivienda_nacimiento_adopcion_hijos")
      despoblacion(v, s, c === "madrid_vivienda_municipios_despoblacion"
        ? compra.slice(0, 4) + "-12-31"
        : "2025-12-31")
    if (c === "madrid_cambio_residencia_municipio_despoblacion") {
      const traslado = fecha(s.hechos.fechaTraslado, "fechaTraslado")
      if (traslado < "2024-01-01" || traslado > "2025-12-31")
        excluir("fechaTraslado", "Fuera del traslado y año siguiente")
      opcion(
        s.hechos.modalidadAccesoActividad,
        ["compra_onerosa", "alquiler_lau"],
        "modalidadAccesoActividad"
      )
      if (s.hechos.modalidadAccesoActividad === "alquiler_lau") {
        const cc = requerido(s.hechos.contratos, "contratos")
        const contrato = requerido(cc[0], "contrato")
        if (entero(contrato.parentescoGrado, "parentescoGrado", 0, 10) <= 3)
          excluir(
            "parentescoGrado",
            "Arrendador cónyuge/pariente hasta tercero"
          )
      }
      return salida(
        s,
        new D(1000),
        ["Art10bis traslado y siguiente"],
        ["Mantener municipio año traslado+3; regularizar incumplimiento"]
      )
    }
    incompatible(s, [c === "madrid_vivienda_municipios_despoblacion"
      ? "madrid_vivienda_nacimiento_adopcion_hijos"
      : "madrid_vivienda_municipios_despoblacion"], v.id)
    const inicioIncentivo = c === "madrid_vivienda_municipios_despoblacion"
      ? "2024-01-01"
      : "2023-01-01"
    if (compra < inicioIncentivo || compra > "2025-12-31")
      excluir("adquisicion", "Adquisición fuera de vigencia del incentivo: " + inicioIncentivo + "/2025-12-31")
    if (
      v.transmision !== undefined &&
      fecha(v.transmision, "transmision") <= "2025-12-31"
    )
      excluir("transmision", "Transmisión extingue anualidades restantes")
    if (c === "madrid_vivienda_nacimiento_adopcion_hijos") {
      const ps = requerido(s.hechos.personas, "personas")
      if (ps.length !== 1)
        falta("personas", "Identificar evento que motivó esta adquisición")
      const p = requerido(ps[0], "persona")
      minimo(s, p)
      const evento = fecha(p.adopcionFecha ?? p.nacimiento, "evento.fecha")
      if (compra < evento || compra > aniversario(evento, 3))
        excluir("adquisicion", "Compra fuera de3 años fecha a fecha del evento")
    }
    return salida(
      s,
      D.min("1546.50", coste(v).times(propiedad(v, s)).times("0.01")),
      ["10% de adquisición por décimas, máximo anual1546,50"],
      [
        "Habitualidad3 años y, si despoblación, residencia municipio año adquisición+3; regularizar incumplimiento",
      ]
    )
  }
  if (
    c === "madrid_intereses_vivienda_jovenes_menores_30" ||
    c === "madrid_incremento_costes_financiacion_vivienda"
  ) {
    habitual(v)
    const prestamos = requerido(s.hechos.prestamos, "prestamos")
    if (prestamos.length !== 1)
      falta("prestamos", "Hipoteca identificada de la vivienda habitual")
    const prestamo = requerido(prestamos[0], "prestamo")
    if (prestamo.viviendaId !== v.id)
      falta("prestamo.viviendaId", "Hipoteca de otra vivienda")
    texto(prestamo.destinoContrato, "destinoContrato")
    const ps = pagos(
      s,
      ["intereses_hipoteca"],
      texto(prestamo.id, "prestamo.id")
    )
    if (c === "madrid_intereses_vivienda_jovenes_menores_30") {
      opcion(prestamo.tipo, ["hipoteca", "hipoteca_variable"], "prestamo.tipo")
      incompatible(s, ["madrid_incremento_costes_financiacion_vivienda"])
      const nacimiento = fecha(
        s.hechos.nacimientoContribuyente,
        "nacimientoContribuyente"
      )
      const cumple30 = aniversario(nacimiento, 30).slice(0, 7)
      const elegibles = ps.filter(
        (p) => fecha(p.fecha, "pago.fecha").slice(0, 7) < cumple30
      )
      return salida(s, D.min(1031, sumaPagos(elegibles).times("0.25")), [
        "Excluido mes del30 cumpleaños y posteriores; sin límite renta art18.2",
      ])
    }
    opcion(prestamo.tipo, ["hipoteca_variable"], "prestamo.tipo")
    rentaFamiliarMadrid(s)
    incompatible(s, ["madrid_intereses_vivienda_jovenes_menores_30"])
    if (
      fecha(v.adquisicion, "adquisicion") >= "2025-01-01" ||
      dinero(v.precioEUR, "precioEUR").gt(390000)
    )
      excluir(
        "adquisicion/precio",
        "Compra no anterior a2025 o precio sin gastos>390000"
      )
    return hipotecaMadrid(s, v, ps)
  }
  if (c === "murcia_dispositivos_ahorro_agua") return aguaF(s, v)
  if (
    c === "murcia_vivienda_jovenes_hasta_40" ||
    c === "murcia_regimen_transitorio_inversion_vivienda_habitual"
  ) {
    const pp = pagos(
      s,
      [
        "adquisicion_vivienda",
        "rehabilitacion",
        "amortizacion_hipoteca",
        "intereses_hipoteca",
        "gastos_financiacion",
      ],
      texto(v.id, "vivienda.id")
    )
    incompatible(s, ["murcia_nueva_vivienda_o_ampliacion_familias_numerosas"])
    if (c === "murcia_vivienda_jovenes_hasta_40") {
      if (edad(s.hechos.nacimientoContribuyente) > 40)
        excluir("edad", "Edad>40")
      renta(s, 40000, true)
      const b = requerido(s.hechos.bases, "bases").find(
        (b) => b.id === s.contexto.contribuyente
      )
      if (b === undefined || magnitudF(s, "ahorro", b.ahorroEUR, b.id).gt(1800))
        excluir("ahorroEUR", "Ahorro>1800")
      return {
        ...dependencia(
          s,
          {
            magnitud: "criterio_normativo",
            factor: "0.05",
            topeEUR: "300",
            operacion:
              "5% × min(gastos, max(0,9040-baseEstatalVivienda)); resolver comparación patrimonio final/final",
          },
          "F-N02: no corregir ley por interpretación",
          sumaPagos(pp)
        ),
        reservas: [
          "F-N02 patrimonio final/final; base estatal canónica aún requerida",
        ],
      }
    }
    const rama = opcion(
      s.hechos.ramaTransitoria,
      ["1998_2000", "Uno_vigente", "estatal_pre2013"],
      "ramaTransitoria"
    )
    texto(s.hechos.derechoHistoricoReferencia, "derechoHistoricoReferencia")
    if (rama === "Uno_vigente")
      return {
        ...dependencia(
          s,
          {
            magnitud: "criterio_normativo",
            factor: "0.05",
            topeEUR: "300",
            operacion: "DTprimera.2 remite aUno vigente",
          },
          "DTprimera.2: acceso histórico documentado, inciso patrimonial F-N02 pendiente",
          sumaPagos(pp)
        ),
        reservas: ["F-N02 sólo ramaUno_vigente"],
      }
    return dependencia(
      s,
      {
        magnitud: "historial_inversion_vivienda",
        factor: rama === "1998_2000" ? "0.02_o_0.03" : "regimen_estatal",
        operacion:
          rama === "1998_2000"
            ? "2% cantidades;3% si general-mínimo<24200 y ahorro<=1800; conciliar acceso histórico Ley9/1999 y bases vivienda anterior/reinversión"
            : "DT18 y art68.1 versión2012; acceso, pagos y fecha terminación históricos",
      },
      "Falta historial individual de acceso y consumo de bases, no una deducción externa calculada",
      sumaPagos(pp)
    )
  }
  if (c === "murcia_nueva_vivienda_o_ampliacion_familias_numerosas") {
    habitual(v)
    incompatible(s, ["murcia_vivienda_jovenes_hasta_40"])
    const t = requerido(s.hechos.titulo, "titulo")
    const cat = opcion(t.categoria, ["general", "especial"], "titulo.categoria")
    texto(t.referencia, "titulo.referencia")
    const fechaTitulo = fecha(t.efectos, "titulo.efectos")
    const compra = fecha(v.adquisicion, "adquisicion")
    if (compra < fechaTitulo || compra > aniversario(fechaTitulo, 5))
      falta(
        "adquisicion/titulo",
        "Fuera de5 años del título; identificar nacimiento alternativo si es el desencadenante"
      )
    if (compra < "2011-01-01") excluir("adquisicion", "Fuera de15 años")
    if (
      decimal(v.superficieNueva, "superficieNueva").lte(
        decimal(v.superficieAnterior, "superficieAnterior").times("1.10")
      )
    )
      excluir("superficieNueva", "Ampliación no supera10%")
    const tipo = opcion(
      s.hechos.tipoAmpliacion,
      ["nueva_vivienda", "anexo_unido_fisicamente"],
      "tipoAmpliacion"
    )
    if (tipo === "nueva_vivienda") {
      const venta = fecha(s.hechos.fechaVentaAnterior, "fechaVentaAnterior")
      if (venta > "2025-12-31")
        falta(
          "fechaVentaAnterior",
          "Venta futura no es hecho consumado; declarar situación de venta al devengo y plazo pendiente"
        )
      if (venta > aniversario(compra, 5))
        excluir("fechaVentaAnterior", "Venta anterior fuera de5 años")
      texto(s.hechos.pruebaVentaAnterior, "pruebaVentaAnterior")
    }
    const importe = D.min(
      5000,
      sumaPagos(
        pagos(
          s,
          [
            "adquisicion_vivienda",
            "ampliacion_vivienda",
            "amortizacion_hipoteca",
            "intereses_hipoteca",
          ],
          texto(v.id, "vivienda.id")
        ),
        true
      )
    )
    return salida(
      s,
      importe.times(cat === "general" ? "0.10" : "0.15"),
      ["Base anual<=5000; máximo15 años; superficie>110%"],
      [
        "Regularizar incumplimiento de habitualidad/venta; anexos requieren unión física documentada",
      ]
    )
  }
  const instalaciones = requerido(s.hechos.instalaciones, "instalaciones")
  if (instalaciones.length !== 1)
    falta(
      "instalaciones",
      "Una instalación por vivienda con libro de importes y límite compartido"
    )
  const i = requerido(instalaciones[0], "instalacion")
  if (i.viviendaId !== v.id)
    falta("instalacion.viviendaId", "Instalación de otra vivienda")
  if (c === "murcia_recarga_vehiculos_electricos") return recargaF(s, v)
  const uso = opcion(
    i.uso,
    ["habitual", "alquiler_no_actividad"],
    "instalacion.uso"
  )
  if (uso === "habitual") habitual(v)
  opcion(
    i.tecnologia,
    ["solar_fotovoltaica", "solar_termica", "eolica", "biomasa", "geotermia"],
    "tecnologia"
  )
  if (i.tecnologia === "solar_fotovoltaica")
    opcion(
      i.modalidadExcedentes,
      ["sin_excedentes", "excedentes_compensados"],
      "modalidadExcedentes"
    )
  texto(i.declaracionResponsable, "declaracionResponsable")
  texto(i.instaladorHabilitado, "instaladorHabilitado")
  const pp = pagos(s, ["instalacion_renovable"], texto(i.id, "instalacion.id"))
  bancario(pp)
  pp.forEach((p) => texto(p.factura, "pago.factura"))
  const b = base(s)
  if (b.gte(60000)) excluir("bases", "Renta>=60000")
  const inversiones = requerido(
    i.inversionesPorTitular,
    "inversionesPorTitular"
  )
  unicos(
    inversiones.map((x) => x.id),
    "inversionesPorTitular.id"
  )
  const propia = inversiones.find((x) => x.id === s.contexto.contribuyente)
  if (propia === undefined)
    falta("inversionesPorTitular", "No consta aportación del titular")
  const total = inversiones.reduce(
    (a, x) => a.plus(dinero(x.importeEUR, "aportacionEUR")),
    new D(0)
  )
  if (total.isZero()) excluir("aportaciones", "Sin aportación")
  const neto = sumaPagos(pp, true)
  if (dinero(propia.importeEUR, "aportacionPropia").lt(neto))
    falta("aportacionPropia", "Pagos netos superiores a aportación declarada")
  const topeProporcional = racional(new D(7000).times(dinero(propia.importeEUR, "aportacionPropia")).toFixed(), total.toFixed())
  return salidaExactaF(
    s,
    menor(topeProporcional, racional(neto.times(b.lt(35000) ? "0.50" : b.lt(45000) ? "0.375" : "0.25").toFixed())),
    ["Tope7000 proporcional a inversión; gastos propios netos ayudas"],
    [
      "Aplicar en último lugar; saldo por insuficiencia de cuota arrastrable2 años",
    ]
  )
}
