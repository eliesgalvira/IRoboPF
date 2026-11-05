import type { SolicitudF, EntidadF, InversionF } from "./esquemas"
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
  baseEstatalDonativoF,
  decimal,
  unicos,
  pagos,
  bancario,
  incompatible,
  falta,
  excluir,
  salida,
  dependencia,
  type ResultadoF,
} from "./comun"
export const CODIGOS_INVERSION_F = [
  "madrid_donativos_fundaciones_clubes_deportivos",
  "madrid_inversion_entidades_nuevas_reciente_creacion",
  "madrid_autoempleo_jovenes_menores_35",
  "madrid_inversiones_mercado_alternativo_bursatil",
  "madrid_inversiones_nuevos_contribuyentes_extranjero",
  "murcia_donativos_patrimonio_cultural_actividades",
  "murcia_donativos_investigacion_biosanitaria",
  "murcia_donaciones_bienes_patrimonio_cultural",
  "murcia_inversion_entidades_nuevas_reciente_creacion",
  "murcia_inversion_mab",
  "murcia_inversion_economia_social",
] as const
function entidades(s: SolicitudF): readonly EntidadF[] {
  const es = requerido(s.hechos.entidades, "entidades")
  unicos(
    es.map((e) => texto(e.id, "entidad.id")),
    "entidades.id"
  )
  return es
}
function entidad(es: readonly EntidadF[], id: string | undefined): EntidadF {
  const e = es.find((e) => e.id === id)
  if (e === undefined)
    falta("entidadId", "Falta entidad identificada de la operación")
  return e
}
function valor(i: InversionF): import("./comun").Decimal {
  return dinero(i.importeEUR, "inversion.importeEUR")
    .plus(dinero(i.gastosEUR, "inversion.gastosEUR"))
    .plus(dinero(i.tributosEUR, "inversion.tributosEUR"))
}
function coherenciaParticipacion(i: InversionF): void {
  const parejas = [
    {
      propia: i.porcentajeCapitalPropio,
      familiar: i.porcentajeCapitalFamiliar,
      campo: "porcentajeCapital",
    },
    {
      propia: i.porcentajeVotosPropio,
      familiar: i.porcentajeVotosFamiliar,
      campo: "porcentajeVotos",
    },
  ]
  for (const p of parejas) {
    const propia =
      p.propia === undefined ? undefined : decimal(p.propia, p.campo + "Propio")
    const familiar =
      p.familiar === undefined
        ? undefined
        : decimal(p.familiar, p.campo + "Familiar")
    if (propia?.gt(100) === true || familiar?.gt(100) === true)
      falta(p.campo, "Porcentaje superior a100")
    if (propia !== undefined && familiar !== undefined && propia.gt(familiar))
      falta(
        p.campo,
        "Porcentaje propio superior al agregado familiar que lo incluye"
      )
  }
}
function participacion(i: InversionF, maximo: number): void {
  decimal(i.porcentajeCapitalPropio, "porcentajeCapitalPropio")
  decimal(i.porcentajeVotosPropio, "porcentajeVotosPropio")
  coherenciaParticipacion(i)
  if (
    decimal(i.porcentajeCapitalFamiliar, "porcentajeCapitalFamiliar").gt(
      maximo
    ) ||
    decimal(i.porcentajeVotosFamiliar, "porcentajeVotosFamiliar").gt(maximo)
  )
    excluir(
      "participacionFamiliar",
      "Participación capital o votos familiar excede límite"
    )
}
function datosMecenazgo(e: EntidadF): void {
  texto(
    e.certificado,
    "certificadoDonanteDonatarioFechaImporteDestinoIrrevocabilidadTransferencia"
  )
  texto(e.registro, "registroArt3")
  opcion(e.proyectoMurcia, ["si"], "proyectoMurcia")
  opcion(e.situacionTributaria, ["al_corriente"], "situacionTributaria")
  opcion(e.situacionSS, ["al_corriente"], "situacionSS")
  opcion(e.cuentasPresentadas, ["si"], "cuentasPresentadas")
  if (entero(e.gradoVinculo, "gradoVinculo", 0, 10) <= 3)
    excluir("gradoVinculo", "Proyecto de cónyuge/pareja/familiar hasta tercero")
  opcion(e.interesComun, ["no"], "interesComun")
  opcion(e.creditoFiscalVigente, ["no"], "creditoFiscalVigente")
}
export function inversionesF(s: SolicitudF): ResultadoF {
  const c = s.codigo
  if (c === "madrid_autoempleo_jovenes_menores_35") {
    if (edad(s.hechos.nacimientoContribuyente) >= 35)
      excluir("edad", "Edad>=35")
    const alta = fecha(s.hechos.fechaAltaCenso, "fechaAltaCenso")
    if (!alta.startsWith("2025-"))
      excluir("fechaAltaCenso", "Sólo ejercicio de primera alta")
    opcion(s.hechos.primeraAltaCenso, ["si"], "primeraAltaCenso")
    opcion(
      s.hechos.actividadTerritorio,
      ["principalmente_madrid"],
      "actividadTerritorio"
    )
    const es = requerido(s.hechos.empleos, "empleos")
    if (es.length !== 1)
      falta("empleos", "Identificar alta y permanencia en Censo de Empresarios")
    texto(
      requerido(es[0], "empleo").certificadoActividad,
      "certificadoActividadCenso"
    )
    return salida(
      s,
      new D(1031),
      ["Primera alta en2025; no prestación anual recurrente"],
      ["Mantener alta1 año desde fecha declarada; regularización si baja antes"]
    )
  }
  const es = entidades(s)
  if (
    c === "madrid_donativos_fundaciones_clubes_deportivos" ||
    c.startsWith("murcia_donativo") ||
    c === "murcia_donaciones_bienes_patrimonio_cultural"
  ) {
    const bienes = c === "murcia_donaciones_bienes_patrimonio_cultural"
    const pp = pagos(s, bienes ? ["donacion_bien"] : ["donativo_dinerario"])
    let total = new D(0)
    for (const p of pp) {
      const e = entidad(es, p.objetoId)
      if (c.startsWith("madrid")) {
        const tipo = opcion(
          e.forma,
          ["fundacion", "club_deportivo"],
          "entidad.forma"
        )
        texto(e.registro, "registro")
        if (tipo === "fundacion")
          opcion(e.cuentasPresentadas, ["si"], "cuentasPresentadas")
        texto(e.certificado, "certificadoDonacion")
        total = total.plus(dinero(p.importeEUR, "donativoEUR"))
      } else {
        datosMecenazgo(e)
        if (bienes) {
          texto(e.inventarioBien, "inventarioGeneralPatrimonioCulturalMurcia")
          texto(e.documentoEntrega, "documentoAutenticoEntrega")
          const tipo = opcion(
            e.forma,
            ["entidad_contabilidad", "persona_sin_contabilidad"],
            "formaValoracionDonante"
          )
          total = total.plus(
            D.min(
              dinero(
                tipo === "entidad_contabilidad"
                  ? e.valorContableEUR
                  : e.valorPatrimonioEUR,
                "valorBien"
              ),
              dinero(e.valorMercadoEUR, "valorMercadoEUR")
            ).times("0.15")
          )
        } else {
          bancario([p])
          opcion(p.medio, ["transferencia"], "donativo.medio")
          if (c === "murcia_donativos_investigacion_biosanitaria") {
            opcion(e.destino, ["investigacion_biosanitaria"], "destino")
            opcion(
              e.forma,
              [
                "region_murcia",
                "universidad_publica_murcia",
                "entidad49_2002_biosanitaria",
              ],
              "entidad.forma"
            )
            texto(e.biosanitaria, "registroBiosanitario")
          } else
            opcion(
              e.destino,
              [
                "patrimonio_cultural",
                "cultural",
                "artistico",
                "social",
                "ciencia_tecnologia",
                "medioambiente",
              ],
              "destino"
            )
          const bruto = dinero(p.importeEUR, "importeDonativoEUR")
          const estatal = baseEstatalDonativoF(s, p)
          if (estatal.gt(bruto))
            falta(
              "computoBaseEstatalEUR",
              "Asignación estatal superior a donativo; conciliar operación, no importe de deducción"
            )
          total = total.plus(bruto.minus(estatal).times("0.50"))
        }
      }
    }
    if (c.startsWith("madrid")) {
      if (
        s.hechos.liquidableGeneralEUR === undefined ||
        s.hechos.liquidableAhorroEUR === undefined
      )
        return dependencia(
          s,
          {
            magnitud: "base_liquidable",
            factor: "0.15",
            operacion:
              "15% × min(donativos,10% × max(0,baseLiquidableGeneral+ahorro))",
          },
          "Base liquidable canónica pendiente; donativos y entidad ya identificados",
          total
        )
      const bl = D.max(
        0,
        magnitudF(s, "liquidableGeneral", s.hechos.liquidableGeneralEUR).plus(
          magnitudF(s, "liquidableAhorro", s.hechos.liquidableAhorroEUR)
        )
      )
      return salida(s, D.min(total, bl.times("0.10")).times("0.15"), [
        "Límite10% a BASE del donativo, luego15%",
      ])
    }
    return salida(s, total, [
      "Certificado individual, exclusiones art3 y crédito fiscal12; minoración por base estatal de la misma operación",
    ])
  }
  const inversiones = requerido(s.hechos.inversiones, "inversiones")
  unicos(
    inversiones.map((i) => texto(i.id, "inversion.id")),
    "inversiones.id"
  )
  let total = new D(0)
  let limite = 0
  const clases = new Set<string>()
  for (const i of inversiones) {
    const e = entidad(es, i.entidadId)
    const f = fecha(i.fecha, "inversion.fecha")
    if (f > "2025-12-31")
      falta(
        "inversion.fecha",
        "Inversión futura no satisfecha en2025; no aplicar cuota de otro ejercicio"
      )
    coherenciaParticipacion(i)
    texto(i.escritura ?? e.escritura, "inversion.escritura")
    opcion(
      i.patrimonioHastaDevengo,
      ["sin_transmision"],
      "patrimonioHastaDevengo"
    )
    if (c === "madrid_inversiones_nuevos_contribuyentes_extranjero") {
      const residencia = fecha(
        s.hechos.fechaResidenciaMadrid,
        "fechaResidenciaMadrid"
      )
      if (residencia < "2024-01-01" || residencia > "2025-12-31")
        excluir("fechaResidenciaMadrid", "Fuera de contribuyentes desde2024")
      const anio = Number(residencia.slice(0, 4))
      const hist = requerido(
        s.hechos.historialResidencia,
        "historialResidencia"
      )
      if (
        hist.length !== 5 ||
        new Set(hist.map((x) => x.ejercicio)).size !== 5 ||
        hist.some((x) => x.ejercicio < anio - 5 || x.ejercicio >= anio)
      )
        falta(
          "historialResidencia",
          "Cinco años anteriores exhaustivos y únicos"
        )
      if (hist.some((x) => x.territorio === "espana"))
        excluir(
          "historialResidencia",
          "Fue residente enEspaña en quinquenio previo"
        )
      const tipo = opcion(
        i.tipo,
        [
          "cesion_capitales",
          "fondos_propios_cotizados",
          "fondos_propios_no_cotizados",
        ],
        "inversion.tipo"
      )
      const ai = Number(f.slice(0, 4))
      const nacional = opcion(
        e.emisorNacionalidad,
        ["espana", "extranjera"],
        "emisorNacionalidad"
      )
      if (ai < anio - (nacional === "espana" ? 1 : 0) || ai > anio + 1)
        excluir("inversion.fecha", "Fuera de ventana de residencia")
      if (ai < 2025)
        falta(
          "inversion.saldos",
          "Inversión anterior requiere saldo histórico consumido en cuota, no importe externo nuevo"
        )
      if (tipo === "fondos_propios_no_cotizados") {
        participacion(i, 40)
        opcion(e.domicilioFiscal, ["no_paraiso_fiscal"], "domicilioFiscal")
        opcion(e.funcionesEjecutivas, ["no"], "funcionesEjecutivas")
        opcion(e.relacionLaboral, ["no"], "relacionLaboral")
      }
      incompatible(
        s,
        [
          "madrid_inversion_entidades_nuevas_reciente_creacion",
          "madrid_inversiones_mercado_alternativo_bursatil",
        ],
        texto(i.id, "inversion.id")
      )
      total = total.plus(valor(i).times("0.20"))
      continue
    }
    if (!f.startsWith("2025-"))
      falta(
        "inversion.fecha",
        "Ejercicio distinto requiere libro de saldos anterior"
      )
    const territorio = c.startsWith("madrid") ? "madrid" : "murcia"
    if (e.domicilioSocial !== territorio || e.domicilioFiscal !== territorio)
      excluir("entidad.domicilio", "Sede social o fiscal fuera de territorio")
    opcion(e.actividad, ["economica_no_patrimonial"], "entidad.actividad")
    const mab =
      c === "madrid_inversiones_mercado_alternativo_bursatil" ||
      c === "murcia_inversion_mab"
    if (mab) {
      opcion(
        i.tipo,
        territorio === "madrid"
          ? ["mab_expansion_ampliacion", "mab_expansion_oferta_publica"]
          : ["mab_expansion_ampliacion"],
        "inversion.tipo"
      )
      if (decimal(i.porcentajeCapitalPropio, "porcentajeCapitalPropio").gt(10))
        excluir("porcentajeCapitalPropio", "Participación>10%")
      if (territorio === "murcia")
        texto(
          i.comunicacionPrevia ?? e.comunicacionPrevia,
          "comunicacionPrevia"
        )
      incompatible(
        s,
        territorio === "madrid"
          ? [
              "madrid_inversion_entidades_nuevas_reciente_creacion",
              "madrid_inversiones_nuevos_contribuyentes_extranjero",
            ]
          : [
              "murcia_inversion_entidades_nuevas_reciente_creacion",
              "murcia_inversion_economia_social",
            ],
        texto(i.id, "inversion.id")
      )
      limite = territorio === "madrid" ? 10310 : 10000
      total = total.plus(
        dinero(i.importeEUR, "inversion.importeEUR").times("0.20")
      )
      continue
    }
    participacion(i, 40)
    const social = c === "murcia_inversion_economia_social"
    const tipo = opcion(
      i.tipo,
      social
        ? ["aportacion_socio_economia_social"]
        : ["constitucion", "ampliacion"],
      "inversion.tipo"
    )
    if (social) {
      texto(e.registro, "registroLey5_2011EconomiaSocial")
      if (
        entero(
          e.empleadosJornadaCompleta,
          "empleadosJornadaCompleta",
          0,
          100000
        ) < 1
      )
        excluir("empleadosJornadaCompleta", "Sin empleado jornada completa")
      incompatible(
        s,
        [
          "murcia_inversion_entidades_nuevas_reciente_creacion",
          "murcia_inversion_mab",
        ],
        texto(i.id, "inversion.id")
      )
      limite = 4000
      total = total.plus(
        dinero(i.importeEUR, "inversion.importeEUR").times("0.20")
      )
      continue
    }
    const forma = opcion(
      e.forma,
      ["sa", "sl", "sa_laboral", "sl_laboral", "cooperativa"],
      "entidad.forma"
    )
    if (territorio === "murcia") {
      opcion(e.funcionesEjecutivas, ["no"], "funcionesEjecutivas")
      opcion(e.relacionLaboral, ["no"], "relacionLaboral")
      texto(i.comunicacionPrevia ?? e.comunicacionPrevia, "comunicacionPrevia")
      incompatible(
        s,
        ["murcia_inversion_mab", "murcia_inversion_economia_social"],
        texto(i.id, "inversion.id")
      )
    } else
      incompatible(
        s,
        [
          "madrid_inversiones_mercado_alternativo_bursatil",
          "madrid_inversiones_nuevos_contribuyentes_extranjero",
        ],
        texto(i.id, "inversion.id")
      )
    if (territorio === "madrid")
      opcion(
        e.universidadInvestigacion,
        ["si", "no"],
        "universidadInvestigacion"
      )
    const especial =
      territorio === "madrid" &&
      (["sa_laboral", "sl_laboral", "cooperativa"].includes(forma) ||
        e.universidadInvestigacion === "si")
    if (
      territorio === "murcia" ||
      (!["sa_laboral", "sl_laboral", "cooperativa"].includes(forma) &&
        tipo === "constitucion")
    ) {
      if (
        entero(
          e.empleadosJornadaCompleta,
          "empleadosJornadaCompleta",
          0,
          100000
        ) < 1
      )
        excluir(
          "empleadosJornadaCompleta",
          "Sin empleado jornada completa en constitución"
        )
    }
    const creacion = fecha(e.creacion, "entidad.creacion")
    if (creacion > f)
      excluir("entidad.creacion", "Constitución posterior a la inversión")
    if (tipo === "ampliacion") {
      if (creacion < aniversario(f, -3))
        excluir(
          "entidad.creacion",
          "Constitución más de3 años antes de ampliación"
        )
      texto(e.certificadoPlantilla, "certificadoPlantilla")
      const incremento = decimal(
        e.plantillaPosterior,
        "plantillaPosterior"
      ).minus(decimal(e.plantillaAntes, "plantillaAntes"))
      if (incremento.lt(territorio === "madrid" ? 1 : 2))
        excluir("plantillaPosterior", "Incremento plantilla insuficiente")
      opcion(
        e.plantillaMantenida,
        ["compromiso_24_meses_adicionales"],
        "plantillaMantenida"
      )
    }
    clases.add(especial ? "especial" : "ordinaria")
    if (clases.size > 1)
      falta(
        "inversiones.rama",
        "Mezcla de tipos y topes art15: requiere conciliación del límite anual, no sumar ambos máximos"
      )
    limite = territorio === "murcia" ? 4000 : especial ? 12372 : 9279
    total = total.plus(
      dinero(i.importeEUR, "inversion.importeEUR").times(
        territorio === "murcia" ? "0.20" : especial ? "0.50" : "0.40"
      )
    )
  }
  if (c === "madrid_inversiones_nuevos_contribuyentes_extranjero")
    return salida(
      s,
      total,
      [
        "20% valor sin intereses; inversiones2025 identificadas; incompatibilidades por operación",
      ],
      [
        "Aplicar después de otras deducciones; arrastre5 ejercicios; mantener6 años/inversión y residencia; reinversión sobrevenida requiere cronología total y plazo1 mes",
      ]
    )
  return salida(
    s,
    D.min(limite, total),
    [
      "Base invertida directa; participaciones, entidad e incompatibilidades evaluadas por operación",
    ],
    [
      c === "murcia_inversion_economia_social"
        ? "Entidad y aportación5 años"
        : c.includes("mab") || c.includes("mercado_alternativo")
          ? "Mantener participación y sede/no patrimonial2 años"
          : "Mantener3 años; Murcia además no dirección/empleo10 años; ampliar plantilla24+24 meses cuando proceda",
    ]
  )
}
