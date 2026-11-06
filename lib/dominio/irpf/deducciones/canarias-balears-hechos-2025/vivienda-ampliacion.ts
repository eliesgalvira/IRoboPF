import { edad, fecha, texto, unico } from "./comun"
import type {
  DeclaracionC,
  MagnitudesAnualesC,
  PagoC,
  ResultadoAmpliacionC,
} from "./ampliacion-comun"
import {
  noNegativoAnualC,
  eurosAnualesC,
  accesoC,
  anualesC,
  aniversarioC,
  ceroC,
  comprobar,
  diasC,
  diasUnionC,
  enteroC,
  eurosC,
  evaluarC,
  gastosC,
  noNegativoC,
  ordinalC,
  personaC,
  resultadoC,
  rentaC,
} from "./ampliacion-comun"

export type CodigoViviendaC =
  | "canarias_restauracion_bienes_interes_cultural"
  | "canarias_inversion_vivienda_habitual"
  | "canarias_rehabilitacion_energetica_vivienda"
  | "canarias_adecuacion_vivienda_discapacidad"
  | "canarias_arrendamiento_dacion_pago"
  | "canarias_adecuacion_inmueble_arrendamiento"
  | "canarias_puesta_viviendas_mercado_arrendamiento"
  | "canarias_alquiler_vivienda_habitual"
  | "balears_mejora_sostenibilidad_vivienda"
  | "balears_arrendador_vivienda_permanente_otros_gastos"
  | "balears_arrendamiento_traslado_laboral"
  | "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento"
  | "balears_arrendamiento_vivienda_habitual"
export type ViviendaC = {
  id: string
  persona: string
  catastro: string
  territorio: "canarias" | "illes-balears"
  nacimientoContribuyente: string
  derecho: "propiedad" | "usufructo" | "arrendatario"
  porcentaje: string
  habitualDesde: string
  adquisicion: string
  ocupacion: string
  finObras: string
  gastos: readonly (PagoC & {
    concepto:
      | "adquisicion"
      | "rehabilitacion"
      | "energia"
      | "agua"
      | "accesibilidad"
      | "reparacion"
      | "contrato"
      | "seguro_danos"
      | "seguro_impago"
      | "certificado"
      | "alquiler"
      | "tributo"
      | "comunidad"
      | "suministro"
      | "judicial"
  })[]
  titulares: readonly string[]
  proteccionPatrimonial: string
  autorizacionObras: string
  certificadoAntes: {
    registro: string
    calificacion: "A" | "B" | "C" | "D" | "E" | "F" | "G"
  }
  certificadoDespues: {
    registro: string
    calificacion: "A" | "B" | "C" | "D" | "E" | "F" | "G"
  }
  discapacidad: {
    persona: string
    nacimiento: string
    grado: number
    parentesco: "propio" | "conyuge" | "ascendiente" | "descendiente"
    rentaNoExenta: string
    convivenciaDesde: string
    convivenciaHasta: string
    certificadoNecesidad: string
  }
  alquiler: {
    arrendador: string
    arrendatario: string
    desde: string
    hasta: string
    fianza: string
    rentaMensual: string
    superficieUtil: string
    rendimiento: "capital_inmobiliario" | "actividad" | "no_aplica_arrendatario"
    repercusionObras: string
    programa: "ordinario" | "alquiler_seguro"
    parientesGrado: number
    islaOrigen: string
    islaDestino: string
    relacionLaboralAntes: string
    relacionLaboralDespues: string
  }
  historial: {
    alquileres2023: readonly string[]
    alquileres2024: readonly string[]
    imputacion2024: "todo_ejercicio" | "no"
    aplicacionesPrevias: readonly number[]
  }
  ocupacionIlegal: {
    situacion: "ocupacion" | "suspension_vulnerabilidad"
    resolucion: string
  }
  colectivo: {
    discapacidad: number
    resolucion: string
    familia:
      | "ordinaria"
      | "numerosa_general"
      | "numerosa_especial"
      | "monoparental_7_7"
    titulo: string
    altaRETA: readonly { desde: string; hasta: string }[]
    actividad: "ninguna" | "trabajo" | "economica"
    minimoDiscapacidad: string
  }
  otrasViviendas: readonly {
    titular: string
    isla: string
    territorio: string
    distanciaKm: string
    diasDerecho: readonly { desde: string; hasta: string }[]
    rentasCapital: string
  }[]
  dacion: {
    fecha: string
    escritura: string
    acreedor: string
    deudaExtinguida: string
  }
}
/** Magnitudes por vivienda calculadas desde históricos de IRPF por el motor,
 * nunca una base elegible o una deducción final aportada por el usuario. */
export type HistoricoViviendasC = {
  calculoId: string
  ejercicio: 2025
  viviendas: readonly {
    catastro: string
    persona: string
    pagadoHasta2024: string
    inversionesAnterioresDeducidas: string
    gananciaExentaReinvertida: string
    saldoDudosoCobroDeducible2025: string
    deduccionesInversionConDerecho: readonly string[]
  }[]
}
export type SolicitudViviendaC = DeclaracionC & {
  codigo: CodigoViviendaC
  viviendas: readonly ViviendaC[]
}

function arrendamientoC(h: DeclaracionC, v: ViviendaC, verificarRendimiento = true): void {
  texto(v.alquiler.arrendador)
  texto(v.alquiler.arrendatario)
  texto(v.alquiler.fianza)
  fecha(v.alquiler.desde)
  fecha(v.alquiler.hasta)
  comprobar(
    v.alquiler.desde <= h.devengo &&
      v.alquiler.hasta >= aniversarioC(v.alquiler.desde, 1),
    "Contrato inferior a un año o posterior al devengo"
  )
  comprobar(
    !verificarRendimiento || v.alquiler.rendimiento === "capital_inmobiliario",
    "Arrendamiento como actividad excluido"
  )
}
function porcentajesC(v: ViviendaC): void {
  comprobar(
    noNegativoC(v.porcentaje).comparar(enteroC(100)) <= 0n &&
      noNegativoC(v.porcentaje).n > 0n,
    "Porcentaje de titularidad inválido"
  )
}
export function evaluarViviendaAmpliacionC(
  h: SolicitudViviendaC,
  m: MagnitudesAnualesC,
  historico: HistoricoViviendasC
): ResultadoAmpliacionC {
  const can = h.codigo.startsWith("canarias_")
  return evaluarC(h, can ? "canarias" : "illes-balears", () => {
    anualesC(h, m)
    unico(h.viviendas.map((v) => v.catastro))
    h.viviendas.forEach((v) => personaC(h, v.persona))
    unico(h.viviendas.flatMap((v) => v.gastos.map((p) => p.id)))
    comprobar(
      historico.calculoId === m.calculoId && historico.ejercicio === 2025,
      "Histórico de viviendas ajeno a cálculo anual"
    )
    unico(historico.viviendas.map((v) => v.catastro + "|" + v.persona))
    let total = ceroC()
    const cuota = noNegativoAnualC(m.cuotaIntegraAutonomica)
    const traza = [h.codigo, `Magnitudes anuales ${m.calculoId}`]
    const grupo = [
      "canarias_restauracion_bienes_interes_cultural",
      "canarias_inversion_vivienda_habitual",
      "canarias_rehabilitacion_energetica_vivienda",
      "canarias_adecuacion_vivienda_discapacidad",
    ].includes(h.codigo)
    for (const persona of h.declarantes) {
      const vs = h.viviendas.filter((v) => v.persona === persona)
      let base = ceroC()
      let importe = ceroC()
      comprobar(
        h.codigo !== "canarias_puesta_viviendas_mercado_arrendamiento" ||
          vs.length <= 5,
        "Máximo cinco inmuebles, contados por unidad"
      )
      // Las ramas con máximo por contribuyente agregan primero todos los inmuebles.
      for (const v of vs) {
        personaC(h, v.persona)
        texto(v.catastro)
        porcentajesC(v)
        comprobar(
          v.territorio === (can ? "canarias" : "illes-balears"),
          "Inmueble fuera de territorio"
        )
        const parte = noNegativoC(v.porcentaje).dividir(enteroC(100))
        const gasto = gastosC(h, v.gastos, persona)
        const antiguedad = (anos: number) => {
          fecha(v.habitualDesde)
          comprobar(
            aniversarioC(v.habitualDesde, anos) <= h.devengo,
            "Habitualidad o permanencia insuficiente"
          )
        }
        const tipos = (permitidos: readonly string[]) =>
          comprobar(
            v.gastos.every((p) => permitidos.includes(p.concepto)),
            "Concepto de gasto excluido"
          )
        const hist = historico.viviendas.find(
          (x) => x.catastro === v.catastro && x.persona === persona
        )
        switch (h.codigo) {
          case "canarias_restauracion_bienes_interes_cultural":
            comprobar(
              v.derecho === "propiedad",
              "Restauración requiere propietario"
            )
            texto(v.proteccionPatrimonial)
            texto(v.autorizacionObras)
            tipos(["rehabilitacion", "reparacion"])
            base = base.sumar(gasto)
            break
          case "canarias_inversion_vivienda_habitual": {
            comprobar(
              v.derecho === "propiedad",
              "Adquisición requiere propietario"
            )
            fecha(v.adquisicion)
            fecha(v.ocupacion)
            comprobar(
              v.ocupacion >= v.adquisicion &&
                v.ocupacion <= aniversarioC(v.adquisicion, 1) &&
                v.ocupacion <= h.devengo,
              "Ocupación fuera de doce meses"
            )
            tipos(["adquisicion", "rehabilitacion"])
            comprobar(
              hist !== undefined,
              "Falta histórico de inversión y reinversión derivado del anual"
            )
            const umbral = noNegativoC(
              hist.inversionesAnterioresDeducidas
            ).sumar(noNegativoC(hist.gananciaExentaReinvertida))
            base = base.sumar(
              noNegativoC(hist.pagadoHasta2024)
                .sumar(gasto)
                .restar(umbral)
                .maximo(ceroC())
                .minimo(gasto)
            )
            comprobar(
              vs.every(
                (x) => x.nacimientoContribuyente === v.nacimientoContribuyente
              ),
              "Edad inconsistente"
            )
            break
          }
          case "canarias_rehabilitacion_energetica_vivienda":
            comprobar(
              v.derecho === "propiedad",
              "Rehabilitación requiere propiedad identificada"
            )
            antiguedad(3)
            tipos(["energia", "agua"])
            texto(v.certificadoAntes.registro)
            texto(v.certificadoDespues.registro)
            texto(v.autorizacionObras)
            comprobar(
              v.titulares.length === 1 && v.titulares[0] === persona,
              "Rehabilitación energética con varios titulares: requiere reparto específico"
            )
            base = base.sumar(gastosC(h, v.gastos, persona, true))
            break
          case "canarias_adecuacion_vivienda_discapacidad": {
            const d = v.discapacidad
            texto(d.persona)
            texto(d.certificadoNecesidad)
            comprobar(
              Number.isFinite(d.grado) && d.grado >= 65 && d.grado <= 100,
              "Discapacidad inferior65 o inválida"
            )
            if (d.parentesco === "propio")
              comprobar(
                d.persona === persona,
                "Persona con discapacidad no coincide"
              )
            else {
              comprobar(
                d.persona !== persona &&
                  ["conyuge", "ascendiente", "descendiente"].includes(
                    d.parentesco
                  ),
                "Parentesco excluido"
              )
              fecha(d.convivenciaDesde)
              fecha(d.convivenciaHasta)
              comprobar(
                d.convivenciaDesde <= h.devengo &&
                  d.convivenciaHasta >= h.devengo &&
                  noNegativoC(d.rentaNoExenta).comparar(enteroC(35735)) <= 0n,
                "Renta familiar o convivencia incumplidas"
              )
            }
            tipos(["accesibilidad"])
            comprobar(
              vs.length === 1,
              "Adecuación con varias personas/viviendas: composición de base máxima pendiente"
            )
            comprobar(
              d.parentesco === "propio" || d.parentesco === "conyuge",
              "Adecuación de ascendientes o descendientes: falta censo de contribuyentes con derecho y grado; los copropietarios no lo sustituyen"
            )
            // Art. 14 ter.6: el reparto por concurrencia sólo alcanza a
            // ascendientes/descendientes, no a discapacidad propia o conyugal.
            const maximo = enteroC(15000)
            importe = gasto
              .minimo(maximo)
              .por(eurosC(edad(d.nacimiento, h.devengo) > 65 ? "0.18" : "0.14"))
            break
          }
          case "canarias_arrendamiento_dacion_pago":
            accesoC(h, 46455, 61770)
            texto(v.dacion.escritura)
            fecha(v.dacion.fecha)
            comprobar(
              v.dacion.fecha <= v.alquiler.desde &&
                v.dacion.acreedor === v.alquiler.arrendador &&
                noNegativoC(v.dacion.deudaExtinguida).n > 0n,
              "Dación sin deuda extinguida, acreedor o fecha concordantes"
            )
            comprobar(
              v.derecho === "arrendatario" &&
                v.alquiler.arrendatario === persona,
              "Arrendatario no concordante"
            )
            antiguedad(1)
            tipos(["alquiler"])
            base = base.sumar(gasto)
            break
          case "canarias_adecuacion_inmueble_arrendamiento": {
            arrendamientoC(h, v)
            tipos([
              "reparacion",
              "contrato",
              "seguro_danos",
              "seguro_impago",
              "certificado",
            ])
            comprobar(
              v.derecho === "propiedad" || v.derecho === "usufructo",
              "Sin propiedad/usufructo"
            )
            // La literalidad15ter prorratea la deducción total del inmueble por título.
            comprobar(
              v.porcentaje === "100" ||
                v.gastos.every((p) => p.naturaleza === "comun"),
              "Copropiedad con gasto exclusivamente propio: reparto15ter pendiente"
            )
            const todos = {
              ...h,
              declarantes: [
                ...new Set(
                  v.gastos.flatMap((p) => p.distribucion.map((d) => d.persona))
                ),
              ],
            }
            importe = importe.sumar(
              gastosC(todos, v.gastos)
                .por(eurosC("0.10"))
                .minimo(enteroC(150))
                .por(parte)
            )
            break
          }
          case "canarias_puesta_viviendas_mercado_arrendamiento":
            comprobar(
              ["propiedad", "usufructo"].includes(v.derecho) &&
                v.historial.aplicacionesPrevias.length === 0,
              "Derecho ausente o deducción ya aplicada"
            )
            arrendamientoC(h, v)
            comprobar(
              v.alquiler.desde.startsWith("2025-") &&
                v.historial.alquileres2024.length === 0 &&
                v.alquiler.parientesGrado > 3 &&
                v.alquiler.arrendatario !== persona,
              "Primer alquiler, parentesco o fecha incumplidos"
            )
            fecha(v.adquisicion)
            if (v.historial.imputacion2024 !== "todo_ejercicio") {
              comprobar(
                v.adquisicion.startsWith("2025-") &&
                  v.alquiler.desde >= v.adquisicion,
                "No imputación previa ni adquisición actual"
              )
              const y = Number(v.adquisicion.slice(0, 4)),
                mo = Number(v.adquisicion.slice(5, 7)) + 6
              const limite = `${y + Math.floor((mo - 1) / 12)}-${String(((mo - 1) % 12) + 1).padStart(2, "0")}-${v.adquisicion.slice(8)}`
              comprobar(
                v.alquiler.desde <= limite,
                "Arrendamiento posterior a seis meses"
              )
            }
            importe = importe.sumar(enteroC(1000).por(parte))
            break
          case "canarias_alquiler_vivienda_habitual":
            accesoC(h, 46455, 61770)
            comprobar(
              v.derecho === "arrendatario" &&
                v.alquiler.arrendatario === persona,
              "Arrendatario ajeno"
            )
            antiguedad(1)
            comprobar(
              v.habitualDesde < aniversarioC(h.devengo, -1),
              "Residencia debe superar un año"
            )
            texto(v.alquiler.arrendador)
            tipos(["alquiler"])
            base = base.sumar(gasto)
            break
          case "balears_mejora_sostenibilidad_vivienda": {
            accesoC(h, 33000, 52800)
            tipos(["energia", "agua"])
            texto(v.certificadoAntes.registro)
            texto(v.certificadoDespues.registro)
            const niveles = ["A", "B", "C", "D", "E", "F", "G"]
            comprobar(
              niveles.includes(v.certificadoAntes.calificacion) &&
                niveles.includes(v.certificadoDespues.calificacion) &&
                niveles.indexOf(v.certificadoDespues.calificacion) <
                  niveles.indexOf(v.certificadoAntes.calificacion),
              "No mejora al menos un nivel energético"
            )
            if (v.alquiler.arrendatario !== persona) {
              arrendamientoC(h, v)
              comprobar(
                noNegativoC(v.alquiler.repercusionObras).n === 0n,
                "Obras repercutidas al inquilino"
              )
            }
            base = base.sumar(gasto)
            break
          }
          case "balears_arrendador_vivienda_permanente_otros_gastos":
            accesoC(h, 52800, 84480)
            arrendamientoC(h, v)
            tipos([
              "seguro_danos",
              "reparacion",
              "comunidad",
              "tributo",
              "contrato",
              "certificado",
            ])
            comprobar(
              v.historial.alquileres2023.length === 0 &&
                v.historial.alquileres2024.length === 0 &&
                v.historial.aplicacionesPrevias.length === 0,
              "Dos ejercicios previos alquilados o aplicación previa"
            )
            comprobar(
              noNegativoC(v.alquiler.superficieUtil).n > 0n &&
                noNegativoC(v.alquiler.rentaMensual).comparar(
                  noNegativoC(v.alquiler.superficieUtil).por(enteroC(15))
                ) <= 0n,
              "Renta supera15euros/m² útil"
            )
            comprobar(
              vs.every((x) => x.alquiler.programa === v.alquiler.programa),
              "Programas mixtos1500/1800: asignación de límite pendiente"
            )
            base = base.sumar(gasto)
            break
          case "balears_arrendamiento_traslado_laboral":
            comprobar(
              v.derecho === "arrendatario" && v.alquiler.arrendatario === v.persona && v.alquiler.arrendador !== v.persona,
              "Traslado requiere arrendatario contractual y arrendador distinto"
            )
            accesoC(h, 33000, 52800)
            arrendamientoC(h, v, false)
            tipos(["alquiler"])
            comprobar(
              ["Mallorca", "Menorca", "Ibiza", "Formentera"].includes(
                v.alquiler.islaOrigen
              ) &&
                ["Mallorca", "Menorca", "Ibiza", "Formentera"].includes(
                  v.alquiler.islaDestino
                ) &&
                v.alquiler.islaOrigen !== v.alquiler.islaDestino,
              "Traslado interinsular requerido"
            )
            texto(v.alquiler.relacionLaboralAntes)
            comprobar(
              v.alquiler.relacionLaboralAntes ===
                v.alquiler.relacionLaboralDespues &&
                v.alquiler.hasta <= aniversarioC(v.alquiler.desde, 3),
              "Relación laboral distinta o traslado superior a tres años"
            )
            base = base.sumar(gasto)
            break
          case "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento":
            comprobar(
              h.devengo >= "2025-07-25",
              "Deducción4sexties no vigente al devengo"
            )
            accesoC(h, 33000, 52800)
            comprobar(
              v.derecho === "propiedad",
              "Ocupación requiere propietario"
            )
            texto(v.ocupacionIlegal.resolucion)
            tipos([
              "seguro_danos",
              "suministro",
              "tributo",
              "comunidad",
              "reparacion",
              "judicial",
            ])
            comprobar(
              v.ocupacionIlegal.situacion === "ocupacion" ||
                v.ocupacionIlegal.situacion === "suspension_vulnerabilidad",
              "Situación de posesión desconocida"
            )
            if (v.ocupacionIlegal.situacion === "suspension_vulnerabilidad")
              comprobar(
                hist !== undefined &&
                  noNegativoC(hist.saldoDudosoCobroDeducible2025).n > 0n,
                "Suspensión sin deuda deducible determinada por anual"
              )
            base = base.sumar(gasto)
            break
          case "balears_arrendamiento_vivienda_habitual": {
            arrendamientoC(h, v, false)
            tipos(["alquiler"])
            comprobar(
              hist !== undefined,
              "Falta comprobación anual de derechos de inversión en vivienda"
            )
            comprobar(
              v.alquiler.arrendatario === persona &&
                v.derecho === "arrendatario",
              "Arrendatario o incompatibilidad de inversión incumplidos"
            )
            const c = v.colectivo,
              a = edad(v.nacimientoContribuyente, h.devengo)
            const diasRETA = diasC(h, c.altaRETA)
            comprobar(
              Number.isFinite(c.discapacidad) &&
                c.discapacidad >= 0 &&
                c.discapacidad <= 100,
              "Grado de discapacidad inválido"
            )
            if (c.minimoDiscapacidad !== "")
              comprobar(
                m.minimos.some(
                  (v) =>
                    v.tipo === "discapacidad" &&
                    v.beneficiario === c.minimoDiscapacidad &&
                    v.titulares.includes(persona)
                ),
                "Mínimo por discapacidad no identificado en anual"
              )
            const reforzado =
              a < 30 ||
              c.discapacidad >= 33 ||
              m.minimos.some(
                (v) =>
                  v.tipo === "discapacidad" && v.titulares.includes(persona)
              ) ||
              c.familia !== "ordinaria" ||
              (h.devengo >= "2025-07-25" && diasRETA >= 183)
            comprobar(
              a < 36 || (a > 65 && c.actividad === "ninguna") || reforzado,
              "Colectivo no habilitado"
            )
            if (c.discapacidad >= 33) texto(c.resolucion)
            if (c.familia !== "ordinaria") texto(c.titulo)
            comprobar(
              c.familia !== "numerosa_especial" || h.devengo >= "2025-07-25",
              "Numerosa especial antes25julio: rama de versión de renta pendiente"
            )
            accesoC(
              h,
              33000,
              52800,
              eurosC(
                c.familia === "ordinaria"
                  ? "1"
                  : c.familia === "numerosa_especial"
                    ? "1.30"
                    : "1.20"
              )
            )
            const prohibidos: { desde: string; hasta: string }[] = []
            for (const otra of v.otrasViviendas) {
              texto(otra.titular)
              comprobar(
                h.miembrosUnidadFamiliar.includes(otra.titular),
                "Inventario de viviendas con titular ajeno a unidad familiar"
              )
              comprobar(
                ["canarias", "illes-balears", "otra"].includes(otra.territorio),
                "Territorio de otra vivienda desconocido"
              )
              if (
                otra.territorio === "illes-balears" &&
                otra.isla === v.alquiler.islaDestino &&
                noNegativoC(otra.distanciaKm).comparar(enteroC(70)) < 0n &&
                noNegativoC(otra.rentasCapital).n === 0n
              )
                prohibidos.push(...otra.diasDerecho)
            }
            comprobar(
              diasUnionC(h, prohibidos) * 2 <= ordinalC(h.devengo),
              "Otras viviendas a menos70km durante más de medio período"
            )
            comprobar(
              vs.length === 1,
              "Varias viviendas habituales: agregar gasto antes de máximo por persona"
            )
            if (hist.deduccionesInversionConDerecho.length > 0) {
              traza.push("T06_ART3BIS1C_EXCLUIDO: derecho material a inversión en el mismo período")
              importe = ceroC()
              break
            }
            importe = gasto
              .por(eurosC(reforzado ? "0.20" : "0.15"))
              .minimo(enteroC(reforzado ? 650 : 530))
            break
          }
          default:
            throw new RangeError("Código de vivienda no soportado")
        }
      }
      switch (h.codigo) {
        case "canarias_restauracion_bienes_interes_cultural":
          importe = base.por(eurosC("0.10")).minimo(cuota.por(eurosC("0.10")))
          break
        case "canarias_inversion_vivienda_habitual": {
          if (vs.length === 0) break
          const p = m.personas.find((v) => v.persona === persona)
          comprobar(p !== undefined, "Renta por persona ausente")
          const r = eurosAnualesC(p.imponibleGeneral).sumar(eurosAnualesC(p.imponibleAhorro))
          comprobar(
            r.comparar(enteroC(46455)) < 0n,
            "Renta46455 excluida en art14"
          )
          const joven = edad(vs[0].nacimientoContribuyente, h.devengo) < 40
          importe = base
            .minimo(enteroC(6000))
            .por(
              r.comparar(enteroC(26035)) < 0n
                ? joven
                  ? enteroC(55).dividir(enteroC(1000))
                  : eurosC("0.05")
                : joven
                  ? eurosC("0.04")
                  : enteroC(35).dividir(enteroC(1000))
            )
          break
        }
        case "canarias_rehabilitacion_energetica_vivienda":
          importe = base
            .minimo(enteroC(7000))
            .por(eurosC("0.12"))
            .minimo(cuota.por(eurosC("0.10")))
          break
        case "canarias_arrendamiento_dacion_pago":
          importe = base.por(eurosC("0.25")).minimo(enteroC(1200))
          break
        case "canarias_alquiler_vivienda_habitual": {
          if (vs.length === 0) break
          const ayudas = vs
            .flatMap((v) => v.gastos)
            .reduce((s, p) => s.sumar(noNegativoC(p.ayudasExentas)), ceroC())
          comprobar(
            base.comparar(rentaC(h).restar(ayudas).por(eurosC("0.10"))) > 0n,
            "Alquiler no supera10% renta ajustada"
          )
          const a = edad(vs[0].nacimientoContribuyente, h.devengo)
          importe = base
            .por(eurosC("0.24"))
            .minimo(enteroC(a < 40 || a >= 75 ? 760 : 740))
          break
        }
        case "balears_mejora_sostenibilidad_vivienda":
          importe = base.minimo(enteroC(10000)).por(eurosC("0.50"))
          break
        case "balears_arrendador_vivienda_permanente_otros_gastos":
          importe = base
            .por(eurosC("0.50"))
            .minimo(
              enteroC(
                vs[0]?.alquiler.programa === "alquiler_seguro" ? 1800 : 1500
              )
            )
          break
        case "balears_arrendamiento_traslado_laboral":
          importe = base.por(eurosC("0.15")).minimo(enteroC(440))
          break
        case "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento":
          importe = base.por(eurosC("0.40")).minimo(enteroC(500))
          break
      }
      total = total.sumar(importe)
      traza.push(
        `Persona ${persona}: ${importe.n}/${importe.d}; base ${base.n}/${base.d}`
      )
    }
    const limiteCodigo =
      h.codigo === "canarias_restauracion_bienes_interes_cultural" ||
      h.codigo === "canarias_rehabilitacion_energetica_vivienda"
    if (limiteCodigo) total = total.minimo(cuota.por(eurosC("0.10")))
    return resultadoC(
      total,
      traza,
      [
        "Períodos futuros de permanencia y regularización no certificables al devengo",
        "Catastro, residencia, obras, grado de parentesco, dación art35bis, energía y resoluciones particulares sujetos a cotejo",
        "Art15ter: no reutilizar los mismos pagos en15quater; arts6/14/14bis incompatibles sobre mismas cantidades",
      ],
      grupo,
      limiteCodigo ? { codigo: h.codigo, porcentaje: "10" } : undefined
    )
  })
}
