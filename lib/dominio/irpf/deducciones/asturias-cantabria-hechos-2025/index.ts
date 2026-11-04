import { MUNICIPIOS_CANTABRIA_2025 } from "./territorio"
import {
  D,
  Suma,
  base,
  diasPosibles,
  dinero,
  documento,
  edad,
  entero,
  exigir,
  factor,
  fecha,
  identidad,
  ids,
  marco,
  pagos,
  parcial,
  protegido,
  rechazo,
  type MarcoB,
  type PagoB,
  type ResolucionB,
  type ResultadoB,
} from "./comun"
export { presentarB } from "./comun"
export type { MarcoB, PagoB, ResolucionB, ResultadoB, Exacto } from "./comun"

type Reparto = {
  readonly titulares: readonly string[]
  readonly exhaustividadTitulares: "completa" | "incompleta"
}
function reparto(m: MarcoB, r: Reparto) {
  exigir(
    r.exhaustividadTitulares === "completa" && r.titulares.length <= 10,
    "Faltan titulares exhaustivos (máximo diez)"
  )
  return { n: factor(m, r.titulares), d: String(r.titulares.length) }
}
function unicos(xs: readonly { readonly id: string }[]): void {
  exigir(
    xs.length <= 1000 && (xs.length === 0 || ids(xs.map((x) => x.id))),
    "Colección duplicada, sin identidad o superior a mil registros"
  )
}
export type AcogidoB = Reparto & {
  readonly id: string
  readonly nacimiento: string
  readonly diasConvivencia: number
  readonly inicioAcogimiento: string
  readonly finAcogimiento: string
  readonly resolucion: ResolucionB
  readonly regimen: "familiar" | "preadoptivo" | "no_remunerado_mayores"
  readonly contraprestacion: string
  readonly ayudasAsturiasAcogedor: string
  readonly ayudasAsturiasAcogido: string
  readonly gradoParentesco: number | null
}
export type GastoVitalB = PagoB & {
  readonly concepto:
    | "vivienda_suministros"
    | "educacion"
    | "transporte_movilidad"
    | "tecnologia"
    | "deporte"
    | "cultura"
}
export type EstudianteB = {
  readonly id: string
  readonly nacimiento: string
  readonly rentaAnual: string
  readonly progenitores: readonly string[]
  readonly inicioEstudios: string
  readonly finEstudios: string
  readonly relacion: "hijo" | "otro"
  readonly municipioEstudios: string
  readonly etapa: "bachillerato" | "fp" | "universidad" | "otra"
  readonly pagosTraslado: readonly PagoB[]
}
export type HechosB =
  | {
      readonly codigo:
        | "asturias_acogimiento_familiar_menores"
        | "asturias_acogimiento_no_remunerado_mayores_65"
      readonly personas: readonly AcogidoB[]
    }
  | {
      readonly codigo: "asturias_certificacion_gestion_forestal_sostenible"
      readonly monte: string
      readonly municipioAsturias: string
      readonly fechaAdquisicionMonte: string
      readonly propietarios: readonly string[]
      readonly certificacion: ResolucionB
      readonly emisor: "entidad_regional" | "equivalente"
      readonly pagosCertificacion: readonly PagoB[]
      readonly subvenciones: string
      readonly reparto: Reparto
    }
  | {
      readonly codigo: "asturias_gastos_vitales_hasta_35"
      readonly nacimiento: string
      readonly gastos: readonly GastoVitalB[]
    }
  | {
      readonly codigo: "asturias_vivienda_protegida"
      readonly vivienda: string
      readonly calificacion: ResolucionB
      readonly fechaAdquisicionRehabilitacion: string
      readonly destino: "habitual" | "otro"
      readonly pagos: readonly PagoB[]
      readonly reparto: Reparto
    }
  | {
      readonly codigo: "cantabria_traslado_estudios_despoblamiento"
      readonly municipioResidencia: string
      readonly pruebaResidencia: ResolucionB
      readonly hijos: readonly EstudianteB[]
    }
  | {
      readonly codigo: "cantabria_gastos_educacion"
      readonly unidadFamiliar: string
      readonly miembros: readonly string[]
      readonly gastos: readonly (PagoB & {
        readonly descendiente: string
        readonly etapa: "primaria" | "eso" | "otra"
        readonly concepto: "libros" | "idiomas_extraescolares"
        readonly prestador:
          | "centro_docente"
          | "centro_publico_privado"
          | "persona_iae"
          | "otro"
      })[]
    }
  | {
      readonly codigo: "cantabria_gastos_enfermedad"
      readonly baseLiquidableMenosMinimo: string
      readonly personasMinimo: readonly string[]
      readonly discapacidades: readonly {
        readonly id: string
        readonly grado: number
        readonly certificado: ResolucionB
      }[]
      readonly gastos: readonly (PagoB & {
        readonly paciente: string
        readonly concepto:
          | "enfermedad"
          | "dental"
          | "embarazo_nacimiento"
          | "accidente_invalidez"
          | "otro"
        readonly honorarios: "profesional_sanitario" | "otro"
        readonly coberturaSSMutuaSeguro: string
      })[]
    }
  | {
      readonly codigo: "cantabria_familias_monoparentales"
      readonly baseLiquidableMenosMinimo: string
      readonly estadoCivil: "sin_vinculo" | "separacion_legal" | "otro"
      readonly hijos: readonly {
        readonly id: string
        readonly nacimiento: string
        readonly convivencia: "si" | "no"
        readonly emancipacionConsentida: "si" | "no"
        readonly medida:
          | "ninguna"
          | "patria_prorrogada_transitoria"
          | "patria_rehabilitada_transitoria"
          | "curatela_representativa"
          | "curatela_asistencial"
        readonly resolucion: ResolucionB | null
        readonly representante: string | null
      }[]
    }

/** Evaluación pura de hechos 2025, aislada de dispatcher, liquidación y cuota.
 * Las resoluciones son datos del expediente: su autenticidad no se certifica.
 */
export function evaluarHechosB2025(m: MarcoB, h: HechosB): ResultadoB {
  return protegido(() => {
    marco(m, h.codigo.startsWith("asturias_") ? "asturias" : "cantabria")
    const s = new Suma()
    switch (h.codigo) {
      case "asturias_acogimiento_familiar_menores":
      case "asturias_acogimiento_no_remunerado_mayores_65": {
        unicos(h.personas)
        const mayores =
          h.codigo === "asturias_acogimiento_no_remunerado_mayores_65"
        if (
          mayores &&
          base(m).gt(m.modalidad === "individual" ? "26000" : "37000")
        )
          return rechazo(
            "excluida",
            "Base imponible superior al límite de acogimiento de mayores"
          )
        for (const p of h.personas) {
          documento(p.resolucion)
          exigir(
            !m.declarantes.includes(p.id) && !p.titulares.includes(p.id),
            "Acogido con identidad de acogedor"
          )
          exigir(
            p.resolucion.fecha >= p.nacimiento,
            "Resolución de acogimiento anterior al nacimiento"
          )
          exigir(
            p.diasConvivencia <=
              diasPosibles(p.inicioAcogimiento, p.finAcogimiento, p.nacimiento),
            "Días de convivencia superiores al intervalo posible en 2025"
          )
          exigir(
            entero(p.diasConvivencia, 0, 365) &&
              (p.gradoParentesco === null || entero(p.gradoParentesco, 1, 20)),
            "Días o parentesco inválidos"
          )
          const r = reparto(m, p),
            e = edad(p.nacimiento)
          if (mayores) {
            const remuneracion = dinero(p.contraprestacion),
              a = dinero(p.ayudasAsturiasAcogedor),
              b = dinero(p.ayudasAsturiasAcogido)
            if (
              e <= 65 ||
              p.diasConvivencia <= 183 ||
              p.regimen !== "no_remunerado_mayores" ||
              remuneracion.gt(0) ||
              a.gt(0) ||
              b.gt(0) ||
              (p.gradoParentesco !== null && p.gradoParentesco <= 3)
            )
              continue
            s.add(r.n.times("500"), r.d)
          } else {
            if (e >= 18 || p.regimen !== "familiar" || p.diasConvivencia <= 90)
              continue
            s.add(r.n.times(p.diasConvivencia >= 183 ? "500" : "250"), r.d)
          }
        }
        return parcial(
          s,
          [
            mayores
              ? "DL2/2014 art.3: >65, >183 días, sin ayuda, contraprestación ni parentesco hasta tercero"
              : "DL2/2014 art.13: 91–182 días 250; 183–365 días 500; sin preadopción",
            "Reparto por titulares exhaustivos; alcance ordinario con edad al devengo",
          ],
          ["Resolución y convivencia declaradas; autenticidad pendiente"]
        )
      }
      case "asturias_certificacion_gestion_forestal_sostenible": {
        if (m.modalidad !== "individual")
          return rechazo(
            "no_soportado",
            "Pendiente composición del máximo forestal en declaración conjunta"
          )
        documento(h.certificacion)
        exigir(
          fecha(h.fechaAdquisicionMonte) &&
            h.fechaAdquisicionMonte <= h.certificacion.fecha,
          "Falta antecedente de propiedad anterior a certificación"
        )
        exigir(
          h.pagosCertificacion.every((p) => p.fecha >= h.fechaAdquisicionMonte),
          "Gastos forestales anteriores a la propiedad: fuera del contrato ordinario"
        )
        exigir(
          identidad(h.monte) &&
            /^330(0[1-9]|[1-6][0-9]|7[0-8])$/.test(h.municipioAsturias) &&
            ids(h.propietarios),
          "Monte, municipio o propietarios ausentes"
        )
        exigir(
          h.emisor === "entidad_regional" || h.emisor === "equivalente",
          "Emisor no identificado"
        )
        exigir(
          h.reparto.titulares.every((x) => h.propietarios.includes(x)),
          "Titular sin propiedad"
        )
        const r = reparto(m, h.reparto)
        const gasto = pagos(
            h.pagosCertificacion,
            { ...m, declarantes: h.reparto.titulares },
            false
          ),
          ayuda = dinero(h.subvenciones)
        if (!h.certificacion.fecha.startsWith("2025-"))
          return rechazo("excluida", "Certificación obtenida fuera de 2025")
        // Expediente completo de la certificación: pagos de todos sus titulares y
        // subvenciones totales, antes del reparto. Sin agregar montes aquí.
        s.add(
          D.min(
            new D("1000").times(r.d),
            D.max(0, gasto.minus(ayuda)).times("0.30").times(r.n)
          ),
          r.d
        )
        return parcial(
          s,
          [
            "DL2/2014 art.14: 30% neto de subvenciones, reparto y máximo 1000 por contribuyente",
          ],
          [
            "Una certificación/monte; acumulación por contribuyente pendiente del padre",
            "Equivalencia del emisor y ubicación declaradas, sin certificación externa",
          ]
        )
      }
      case "asturias_gastos_vitales_hasta_35": {
        const e = edad(h.nacimiento)
        if (e > 35 || base(m).gt("28000"))
          return rechazo("excluida", "Edad >35 o base >28000")
        if (e === 30)
          return rechazo(
            "no_soportado",
            "R30: solapamiento legal 26–30/30–35; no se elige tramo del manual"
          )
        exigir(
          h.gastos.every((p) =>
            [
              "vivienda_suministros",
              "educacion",
              "transporte_movilidad",
              "tecnologia",
              "deporte",
              "cultura",
            ].includes(p.concepto)
          ),
          "Concepto vital desconocido"
        )
        // Alcance individual: evita multiplicar topes personales en conjunta.
        exigir(
          m.modalidad === "individual",
          "Gastos vitales: composición conjunta pendiente"
        )
        s.add(
          D.min(
            e <= 25 ? "2000" : e < 30 ? "1500" : "1000",
            pagos(h.gastos, m, false)
          )
        )
        return parcial(
          s,
          [
            "DL2/2014 art.14 sexdecies: gasto efectivo y máximo personal por edad",
          ],
          [
            "R30 reservada sólo en edad exactamente 30",
            "Clasificación de cada gasto declarada; sin aceptación fiscal",
          ]
        )
      }
      case "asturias_vivienda_protegida": {
        documento(h.calificacion)
        exigir(
          identidad(h.vivienda) && fecha(h.fechaAdquisicionRehabilitacion),
          "Vivienda o fecha inválidas"
        )
        if (
          h.destino !== "habitual" ||
          h.fechaAdquisicionRehabilitacion > "2025-12-31"
        )
          return rechazo(
            "excluida",
            "Sin vivienda habitual adquirida/rehabilitada en plazo"
          )
        const r = reparto(m, h.reparto),
          gasto = pagos(h.pagos, m, false)
        // Se reparte el máximo, no el gasto propio efectivamente pagado.
        const maximo = new D(
          h.fechaAdquisicionRehabilitacion.startsWith("2025-") ? "5000" : "1000"
        )
        s.add(D.min(gasto.times(r.d), maximo.times(r.n)), r.d)
        return parcial(
          s,
          [
            "DL2/2014 art.6: gasto efectivo, máximo 5000 inicial/1000 sucesivo repartido",
            "Generación 2025 antes de cuota; no consume saldos históricos",
          ],
          [
            "El padre aplicará cuota una vez y gestionará arrastre de tres ejercicios, después de deducciones corrientes",
            "Calificación y destino habitual aportados, no certificados",
          ]
        )
      }
      case "cantabria_traslado_estudios_despoblamiento": {
        documento(h.pruebaResidencia)
        exigir(
          /^39\d{3}$/.test(h.municipioResidencia),
          "Código INE de residencia cántabra inválido"
        )
        if (!MUNICIPIOS_CANTABRIA_2025.has(h.municipioResidencia))
          return rechazo(
            "excluida",
            "Residencia fuera de delimitación de riesgo"
          )
        unicos(h.hijos)
        for (const p of h.hijos) {
          const e = edad(p.nacimiento),
            renta = dinero(p.rentaAnual)
          exigir(
            ids(p.progenitores) &&
              p.progenitores.length <= 2 &&
              p.progenitores.some((id) => m.declarantes.includes(id)) &&
              !p.progenitores.includes(p.id) &&
              !m.declarantes.includes(p.id),
            "Hijo/progenitores sin identidad distinta o ajenos"
          )
          const diasEstudios = diasPosibles(
            p.inicioEstudios,
            p.finEstudios,
            p.nacimiento
          )
          exigir(
            p.pagosTraslado.every((pago) => pago.fecha >= p.nacimiento),
            "Pago por estudios anterior al nacimiento"
          )
          if (diasEstudios === 0) continue
          exigir(
            identidad(p.municipioEstudios),
            "Municipio de estudios ausente"
          )
          const gasto = pagos(p.pagosTraslado, m, true)
          if (
            p.relacion !== "hijo" ||
            e >= 25 ||
            renta.gte("8000") ||
            p.municipioEstudios === h.municipioResidencia ||
            !["bachillerato", "fp", "universidad"].includes(p.etapa) ||
            gasto.isZero()
          )
            continue
          s.add("200", m.modalidad === "individual" ? "2" : "1")
        }
        return parcial(
          s,
          [
            "DL62/2008 art.2.11.4: 200 por hijo, mitad en individual; renta legal estricta <8000",
            "Pagos de traslado identificados conforme al apartado común 11",
          ],
          [
            "BC02: manual inclusivo discrepante en 8000; prevalece exclusión legal",
            "PRE/1/2025 fijada desde la evidencia auditada; la residencia habitual del caso se aporta con documento, sin certificación externa",
          ]
        )
      }
      case "cantabria_gastos_educacion": {
        exigir(
          identidad(h.unidadFamiliar) &&
            ids(h.miembros) &&
            m.declarantes.every((x) => h.miembros.includes(x)),
          "Unidad familiar ausente o ajena"
        )
        exigir(
          h.gastos.length <= 1000,
          "Más de mil gastos: dividir expediente requiere composición"
        )
        const vistos = new Set<string>()
        let bruto = new D(0)
        for (const p of h.gastos) {
          exigir(!vistos.has(p.id), "Gasto educativo duplicado")
          vistos.add(p.id)
          exigir(
            h.miembros.includes(p.descendiente) &&
              !m.declarantes.includes(p.descendiente),
            "Descendiente no identificado en unidad familiar"
          )
          const valor = pagos([p], m, true)
          if (
            p.etapa === "otra" ||
            (p.concepto === "idiomas_extraescolares" && p.prestador === "otro")
          )
            continue
          exigir(
            p.concepto === "libros" || p.concepto === "idiomas_extraescolares",
            "Concepto educativo inválido"
          )
          bruto = bruto.plus(
            valor.times(p.concepto === "libros" ? "1" : "0.15")
          )
        }
        // Individual: el expediente requiere gasto completo familiar, pero sus pagos
        // se limitan al declarante; no inferir el gasto del otro progenitor.
        exigir(
          m.modalidad === "conjunta",
          "Educación individual: falta contrato de gasto familiar exhaustivo de ambos progenitores; no inferir mitad sobre gasto propio"
        )
        s.add(D.min("200", bruto))
        return parcial(
          s,
          [
            "DL62/2008 art.2.13: libros 100% e idiomas extraescolares 15%, máximo familiar 200",
          ],
          [
            "Composición estatal art.82 y etapa educativa aportadas; sin certificación externa",
          ]
        )
      }
      case "cantabria_gastos_enfermedad": {
        const b = dinero(h.baseLiquidableMenosMinimo)
        if (b.gte(m.modalidad === "individual" ? "22946" : "31485"))
          return rechazo(
            "excluida",
            "Base liquidable minorada alcanza el límite estricto"
          )
        exigir(
          (h.personasMinimo.length === 0 || ids(h.personasMinimo)) &&
            h.personasMinimo.every((id) => !m.declarantes.includes(id)),
          "Personas del mínimo duplicadas"
        )
        unicos(h.discapacidades)
        let suplemento = new D(0)
        for (const p of h.discapacidades) {
          documento(p.certificado)
          exigir(
            m.declarantes.includes(p.id) && entero(p.grado, 0, 100),
            "Discapacidad ajena a declarantes o grado inválido"
          )
          if (p.grado >= 65) suplemento = suplemento.plus("100")
        }
        exigir(
          h.gastos.length <= 1000,
          "Más de mil gastos: dividir expediente requiere composición"
        )
        const vistos = new Set<string>()
        let neto = new D(0)
        for (const p of h.gastos) {
          exigir(!vistos.has(p.id), "Honorario duplicado")
          vistos.add(p.id)
          const importe = pagos([p], m, true),
            cubierto = dinero(p.coberturaSSMutuaSeguro)
          exigir(
            cubierto.lte(dinero(p.euros)),
            "Cobertura superior al honorario"
          )
          if (
            p.honorarios !== "profesional_sanitario" ||
            p.concepto === "otro" ||
            (!m.declarantes.includes(p.paciente) &&
              !h.personasMinimo.includes(p.paciente))
          )
            continue
          if (!importe.isZero()) neto = neto.plus(importe.minus(cubierto))
        }
        s.add(
          D.min(
            new D(m.modalidad === "individual" ? "500" : "700").plus(
              suplemento
            ),
            neto.times("0.10")
          )
        )
        return parcial(
          s,
          [
            "DL62/2008 art.2.7: 10% honorarios no cubiertos; tope 500/700 +100 por declarante con discapacidad >=65",
            "Base liquidable después de mínimo identificada por su magnitud; no se sustituye por base imponible",
          ],
          [
            "Derecho al mínimo familiar, profesión sanitaria y certificado aportados externamente",
          ]
        )
      }
      case "cantabria_familias_monoparentales": {
        if (
          dinero(h.baseLiquidableMenosMinimo).gte("31485") ||
          h.estadoCivil === "otro"
        )
          return rechazo(
            "excluida",
            "Base liquidable minorada >=31485 o vínculo matrimonial no separado"
          )
        exigir(
          m.modalidad === "individual",
          "Composición monoparental conjunta pendiente"
        )
        unicos(h.hijos)
        let elegibles = 0,
          manual = false
        for (const p of h.hijos) {
          const e = edad(p.nacimiento)
          exigir(
            !m.declarantes.includes(p.id) && p.id !== p.representante,
            "Hijo con identidad de progenitor/representante"
          )
          if (p.convivencia !== "si") continue
          if (e < 18) {
            if (p.emancipacionConsentida === "no") elegibles++
            continue
          }
          if (
            [
              "patria_prorrogada_transitoria",
              "patria_rehabilitada_transitoria",
              "curatela_representativa",
            ].includes(p.medida)
          ) {
            exigir(
              p.resolucion !== null && p.representante === m.contribuyente,
              "Medida judicial sin resolución o representante progenitor"
            )
            documento(p.resolucion)
            exigir(
              p.resolucion.fecha >= p.nacimiento,
              "Resolución judicial anterior al nacimiento"
            )
            if (p.medida !== "curatela_representativa")
              exigir(
                p.resolucion.fecha < "2021-09-03",
                "Falta resolución originaria anterior a Ley8/2021 para patria potestad transitoria"
              )
            elegibles++
            manual ||= p.medida === "curatela_representativa"
          }
        }
        if (elegibles === 0)
          return rechazo(
            "excluida",
            "Sin hijo conviviente incluido; curatela asistencial no basta"
          )
        s.add("200")
        return parcial(
          s,
          [
            "DL62/2008 art.2.9: 200; base minorada estricta <31485",
            "BC01: patria potestad transitoria preservada; curatela asistencial no se equipara",
          ],
          manual
            ? [
                "BC01: curatela representativa según manual p.220 y resolución judicial, sin interpolarla en el artículo autonómico",
              ]
            : []
        )
      }
    }
    return rechazo("no_soportado", "Código sin evaluador en este sublote")
  })
}
