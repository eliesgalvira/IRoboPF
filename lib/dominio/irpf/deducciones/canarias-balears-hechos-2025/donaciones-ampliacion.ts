import { texto, unico } from "./comun"
import type {
  DeclaracionC,
  MagnitudesAnualesC,
  PagoC,
  ResultadoAmpliacionC,
} from "./ampliacion-comun"
import {
  accesoC,
  anualesC,
  aniversarioC,
  ceroC,
  comprobar,
  enteroC,
  eurosC,
  evaluarC,
  gastosC,
  noNegativoC,
  resultadoC,
  diasC,
  diasNaturalesC,
  periodoC,
  recortarPeriodoC,
} from "./ampliacion-comun"

export type CodigoDonacionC =
  | "canarias_donaciones_finalidad_ecologica"
  | "canarias_donaciones_patrimonio_historico"
  | "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia"
  | "canarias_donaciones_entidades_sin_animo_lucro"
  | "balears_donaciones_investigacion_desarrollo_innovacion"
  | "balears_fomento_lengua_catalana"
  | "balears_mecenazgo_cultural_cientifico_tecnologico"
  | "balears_mecenazgo_deportivo"
export type BeneficiarioDonacionC = {
  nif: string
  clase:
    | "administracion"
    | "entidad_publica"
    | "universidad"
    | "centro_investigacion"
    | "iglesia_acuerdo"
    | "fundacion49"
    | "entidad_parcialmente_exenta"
    | "empresa_cultural"
    | "empresa_cientifica"
    | "empresa_tecnologica"
  territorio: "canarias" | "illes-balears"
  registro: string
  finalidad:
    | "medio_ambiente_exclusivo"
    | "patrimonio"
    | "cultura"
    | "deporte"
    | "investigacion"
    | "docencia"
    | "acceso_superior"
    | "lengua_catalana"
  fondosPropios: string
  proyecto: string
  declaracionProyecto: string
  naturaleza: "publica" | "privada"
  centroUniversitarioOrigen: string
  patenteResultado: string
}
export type DonacionC = {
  id: string
  donante: string
  entidad: BeneficiarioDonacionC
  certificado: string
  fechaEntrega: string
  aceptacion: "irrevocable_aceptada"
  bienProtegido: string
  modalidad: "dinero" | "capital_tecnologico" | "bien" | "convenio" | "comodato"
  destino4bis: "a" | "b" | "c" | "d" | "e" | "f" | "no_aplica"
  pagos: readonly PagoC[]
  valoracionBien: string
  documentoValoracion: string
  comodato: {
    desde: string
    hasta: string
    ejerciciosPrevios: readonly number[]
    valorFiscal: string
    criterio: "comision_patrimonio" | "catastro"
    documento: string
  }
  aportacion2023: string
  aportacion2024: string
  otrasDeduccionesMismoBeneficiario: readonly ("art3" | "art4bis" | "art5bis")[]
}
export type SolicitudDonacionesC = DeclaracionC & {
  codigo: CodigoDonacionC
  donaciones: readonly DonacionC[]
  ordenTramoInicial: readonly string[]
}

export function evaluarDonacionesAmpliacionC(
  h: SolicitudDonacionesC,
  m: MagnitudesAnualesC
): ResultadoAmpliacionC {
  const can = h.codigo.startsWith("canarias_")
  return evaluarC(h, can ? "canarias" : "illes-balears", () => {
    anualesC(h, m)
    unico(h.donaciones.map((d) => d.id))
    unico(h.donaciones.flatMap((d) => d.pagos.map((p) => p.id)))
    comprobar(h.donaciones.length > 0, "Faltan donaciones identificadas")
    h.donaciones.forEach((d) => {
      comprobar(
        h.declarantes.includes(d.donante),
        "Donante ajeno a declaración"
      )
      texto(d.entidad.nif)
      texto(d.certificado)
      texto(d.entidad.proyecto)
      comprobar(
        d.entidad.territorio === (can ? "canarias" : "illes-balears") &&
          d.aceptacion === "irrevocable_aceptada",
        "Destino o aceptación excluidos"
      )
      comprobar(
        d.pagos.every((p) => p.perceptor === d.entidad.nif),
        "Perceptor distinto de donatario"
      )
    })
    const cuota = noNegativoC(m.cuotaIntegraAutonomica)
    let total = ceroC()
    const traza = [
      h.codigo,
      `Magnitudes anuales ${m.calculoId}; límites previos a cuota disponible`,
    ]
    for (const persona of h.declarantes) {
      const ds = h.donaciones.filter((d) => d.donante === persona)
      if (ds.length === 0) continue
      let importe = ceroC()
      const dineroDonado = (d: DonacionC) => {
        comprobar(d.modalidad === "dinero", "Rama requiere donación dineraria")
        return gastosC(h, d.pagos, persona)
      }
      switch (h.codigo) {
        case "canarias_donaciones_finalidad_ecologica":
          ds.forEach((d) => {
            comprobar(
              d.entidad.finalidad === "medio_ambiente_exclusivo" &&
                ["administracion", "entidad_publica", "fundacion49"].includes(
                  d.entidad.clase
                ),
              "Donatario ecológico excluido"
            )
            texto(d.entidad.registro)
          })
          importe = ds
            .reduce((s, d) => s.sumar(dineroDonado(d)), ceroC())
            .por(eurosC("0.10"))
            .minimo(enteroC(150))
            .minimo(cuota.por(eurosC("0.10")))
          break
        case "canarias_donaciones_patrimonio_historico":
          ds.forEach((d) => {
            texto(d.bienProtegido)
            comprobar(
              d.entidad.finalidad === "patrimonio" &&
                [
                  "administracion",
                  "entidad_publica",
                  "iglesia_acuerdo",
                  "fundacion49",
                ].includes(d.entidad.clase),
              "Bien o donatario patrimonial excluido"
            )
          })
          importe = ds
            .reduce((s, d) => s.sumar(dineroDonado(d)), ceroC())
            .por(eurosC("0.20"))
            .minimo(enteroC(150))
            .minimo(cuota.por(eurosC("0.10")))
          break
        case "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia": {
          // Bases separadas por los seis destinos a-f; nunca un máximo por factura.
          let base = ceroC()
          for (const rama of ["a", "b", "c", "d", "e", "f"] as const) {
            const grupo = ds.filter((d) => d.destino4bis === rama)
            let b = ceroC()
            grupo.forEach((d) => {
              comprobar(
                [
                  "cultura",
                  "deporte",
                  "investigacion",
                  "docencia",
                  "acceso_superior",
                ].includes(d.entidad.finalidad),
                "Finalidad ajena a4bis"
              )
              texto(d.entidad.declaracionProyecto)
              comprobar(
                rama === "a"
                  ? ["cultura", "deporte", "investigacion"].includes(
                      d.entidad.finalidad
                    )
                  : rama === "b"
                    ? d.entidad.finalidad === "cultura"
                    : rama === "c"
                      ? d.entidad.finalidad === "investigacion"
                      : rama === "d"
                        ? ["investigacion", "docencia"].includes(
                            d.entidad.finalidad
                          )
                        : rama === "e"
                          ? d.entidad.finalidad === "acceso_superior"
                          : true,
                "Finalidad no comprendida en el apartado4bis declarado"
              )
              comprobar(
                rama === "a"
                  ? ["administracion", "entidad_publica"].includes(
                      d.entidad.clase
                    )
                  : rama === "b"
                    ? d.entidad.clase === "empresa_cultural"
                    : rama === "c"
                      ? d.entidad.clase === "empresa_cientifica"
                      : rama === "d"
                        ? ["universidad", "centro_investigacion"].includes(
                            d.entidad.clase
                          )
                        : rama === "e"
                          ? d.entidad.clase === "universidad" &&
                            d.entidad.naturaleza === "publica" &&
                            d.entidad.finalidad === "acceso_superior"
                          : d.entidad.clase === "empresa_tecnologica",
                "Destinatario distinto del apartado4bis declarado"
              )
              if (rama === "b" || rama === "c")
                comprobar(
                  noNegativoC(d.entidad.fondosPropios).comparar(
                    enteroC(300000)
                  ) < 0n,
                  "Fondos propios no inferiores a300000"
                )
              if (rama === "f") {
                comprobar(
                  d.modalidad === "capital_tecnologico",
                  "Aportación tecnológica requerida"
                )
                texto(d.entidad.centroUniversitarioOrigen)
                texto(d.entidad.patenteResultado)
                texto(d.documentoValoracion)
                periodoC(h, d.fechaEntrega)
                b = b.sumar(noNegativoC(d.valoracionBien))
              } else b = b.sumar(dineroDonado(d))
            })
            base = base.sumar(
              b.minimo(enteroC(rama === "b" || rama === "c" ? 3000 : 50000))
            )
          }
          comprobar(
            ds.every((d) =>
              [
                "administracion",
                "entidad_publica",
                "universidad",
                "centro_investigacion",
                "empresa_cultural",
                "empresa_cientifica",
                "empresa_tecnologica",
              ].includes(d.entidad.clase)
            ),
            "Destinatario4bis excluido"
          )
          comprobar(
            ds.every((d) => d.destino4bis !== "no_aplica"),
            "Donación sin apartado4bis identificado"
          )
          importe = base.por(eurosC("0.15")).minimo(cuota.por(eurosC("0.05")))
          break
        }
        case "canarias_donaciones_entidades_sin_animo_lucro": {
          unico(ds.map((d) => d.entidad.nif))
          comprobar(
            ds.every(
              (d) =>
                d.entidad.clase === "fundacion49" &&
                !d.otrasDeduccionesMismoBeneficiario.some(
                  (x) => x === "art3" || x === "art4bis"
                )
            ),
            "Beneficiario o concurrencia4ter excluidos"
          )
          unico(h.ordenTramoInicial)
          comprobar(
            h.ordenTramoInicial.length === h.donaciones.length &&
              h.ordenTramoInicial.every((id) =>
                h.donaciones.some((d) => d.id === id)
              ),
            "Orden experto del tramo inicial incompleto"
          )
          const magnitud = m.personas.find((p) => p.persona === persona)
          comprobar(
            magnitud !== undefined,
            "Base liquidable por donante ausente"
          )
          let disponible = eurosC(magnitud.liquidableGeneral)
            .sumar(eurosC(magnitud.liquidableAhorro))
            .maximo(ceroC())
            .por(eurosC("0.10"))
          let inicial = enteroC(150)
          for (const id of h.ordenTramoInicial) {
            const d = ds.find((v) => v.id === id)
            if (d === undefined) continue
            const actual = dineroDonado(d),
              base = actual.minimo(disponible)
            disponible = disponible.restar(base)
            const tramo = base.minimo(inicial)
            inicial = inicial.restar(tramo)
            const anterior = noNegativoC(d.aportacion2024),
              previo = noNegativoC(d.aportacion2023)
            const reiterada =
              previo.n > 0n &&
              anterior.comparar(previo) >= 0n &&
              actual.comparar(anterior) >= 0n
            importe = importe
              .sumar(tramo.por(eurosC("0.20")))
              .sumar(
                base
                  .restar(tramo)
                  .por(
                    reiterada
                      ? enteroC(175).dividir(enteroC(1000))
                      : eurosC("0.15")
                  )
              )
          }
          traza.push(
            "4ter: tramo150 único por contribuyente; orden experto identificado, sin optimización inventada"
          )
          break
        }
        case "balears_donaciones_investigacion_desarrollo_innovacion":
        case "balears_fomento_lengua_catalana": {
          const lengua = h.codigo === "balears_fomento_lengua_catalana"
          ds.forEach((d) => {
            comprobar(
              d.entidad.finalidad ===
                (lengua ? "lengua_catalana" : "investigacion") &&
                [
                  "administracion",
                  "entidad_publica",
                  "universidad",
                  "centro_investigacion",
                  "fundacion49",
                  "entidad_parcialmente_exenta",
                ].includes(d.entidad.clase),
              "Beneficiario/finalidad excluidos"
            )
            if (d.entidad.clase === "fundacion49") {
              texto(d.entidad.registro)
              texto(d.entidad.declaracionProyecto)
            }
            if (lengua)
              comprobar(
                !d.otrasDeduccionesMismoBeneficiario.includes("art5bis"),
                "Lengua incompatible con5bis"
              )
          })
          importe = ds
            .reduce((s, d) => s.sumar(dineroDonado(d)), ceroC())
            .por(eurosC(lengua ? "0.15" : "0.25"))
            .minimo(cuota.por(eurosC(lengua ? "0.10" : "0.15")))
          break
        }
        case "balears_mecenazgo_cultural_cientifico_tecnologico":
        case "balears_mecenazgo_deportivo": {
          const publico = ds.every(
            (d) =>
              ["administracion", "entidad_publica"].includes(d.entidad.clase) &&
              h.codigo !== "balears_mecenazgo_deportivo"
          )
          if (!publico) accesoC(h, 33000, 52800)
          comprobar(
            ds.every(
              (d) =>
                publico ===
                (["administracion", "entidad_publica"].includes(
                  d.entidad.clase
                ) && h.codigo !== "balears_mecenazgo_deportivo")
            ),
            "Mecenazgo público/general mixto: composición pendiente"
          )
          let base = ceroC()
          let proporcion = enteroC(1)
          const comodatos = ds.filter((d) => d.modalidad === "comodato")
          comprobar(
            comodatos.length === 0 || ds.length === 1,
            "Comodatos mezclados: composición de límites diarios pendiente"
          )
          for (const d of ds) {
            texto(d.entidad.registro)
            texto(d.entidad.declaracionProyecto)
            if (h.codigo === "balears_mecenazgo_deportivo")
              comprobar(
                d.entidad.finalidad === "deporte",
                "Proyecto no deportivo"
              )
            else
              comprobar(
                ["cultura", "investigacion"].includes(d.entidad.finalidad),
                "Proyecto fuera del mecenazgo cultural/científico/tecnológico"
              )
            if (d.modalidad === "comodato") {
              texto(d.comodato.documento)
              unico(d.comodato.ejerciciosPrevios.map(String))
              comprobar(
                d.comodato.ejerciciosPrevios.length < 3 &&
                  d.comodato.ejerciciosPrevios.every((y) => y < 2025),
                "Máximo tres ejercicios de comodato agotado"
              )
              proporcion = enteroC(
                diasC(
                  h,
                  recortarPeriodoC(h, d.comodato.desde, d.comodato.hasta)
                )
              ).dividir(enteroC(365))
              base = base.sumar(
                noNegativoC(d.comodato.valorFiscal)
                  .por(eurosC("0.04"))
                  .por(proporcion)
              )
              const duracion = diasNaturalesC(
                d.comodato.desde,
                d.comodato.hasta
              )
              const anual =
                diasNaturalesC(
                  d.comodato.desde,
                  aniversarioC(d.comodato.desde, 1)
                ) - 1
              if (duracion >= anual) proporcion = enteroC(1)
            } else if (d.modalidad === "bien") {
              texto(d.documentoValoracion)
              periodoC(h, d.fechaEntrega)
              base = base.sumar(noNegativoC(d.valoracionBien))
            } else {
              comprobar(
                d.modalidad === "dinero" || d.modalidad === "convenio",
                "Modalidad de mecenazgo no soportada"
              )
              if (d.modalidad === "convenio") texto(d.documentoValoracion)
              base = base.sumar(gastosC(h, d.pagos, persona))
            }
          }
          importe = base
            .por(eurosC(publico ? "0.25" : "0.15"))
            .minimo(enteroC(publico ? 1200 : 660).por(proporcion))
          break
        }
        default:
          throw new RangeError("Código de donación desconocido")
      }
      total = total.sumar(importe)
      traza.push(`Donante ${persona}: ${importe.n}/${importe.d}`)
    }
    const porcentaje =
      h.codigo === "canarias_donaciones_finalidad_ecologica" ||
      h.codigo === "canarias_donaciones_patrimonio_historico" ||
      h.codigo === "balears_fomento_lengua_catalana"
        ? 10
        : h.codigo ===
            "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia"
          ? 5
          : h.codigo ===
              "balears_donaciones_investigacion_desarrollo_innovacion"
            ? 15
            : undefined
    if (porcentaje !== undefined)
      total = total.minimo(cuota.por(enteroC(porcentaje)).dividir(enteroC(100)))
    return resultadoC(
      total,
      traza,
      [
        "Registro, protección del bien, finalidad estatutaria, proyecto, valoración y certificaciones particulares sujetos a contraste",
        "Comodato: base anual4% por días; máximo proporcional si contrato inferior a un año; máximo tres ejercicios; ramas mixtas rechazadas",
      ],
      false,
      porcentaje === undefined
        ? undefined
        : { codigo: h.codigo, porcentaje: String(porcentaje) }
    )
  })
}
