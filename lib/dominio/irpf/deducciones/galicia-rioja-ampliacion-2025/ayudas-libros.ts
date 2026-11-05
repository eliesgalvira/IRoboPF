import {
  cero,
  conciliar,
  mas,
  menos,
  por,
  producto,
  compara,
  min,
  euros,
  r,
  exige,
  ids,
  fecha,
  documento,
  contexto,
  reparto,
  pagos,
  resultado,
  paso,
  proteger,
} from "./comun"
import type { Contexto, Documento, Pago, Resultado, Persona } from "./comun"
/** Porcentajes legales derivados por la anual, con denominador y procedencia explícitos.
 * No se reciben importes de deducción ni se infiere una tasa marginal. */
export type TipoMedio = {
  readonly ambito: "estatal" | "autonomico"
  readonly numeradorPorcentaje: string
  readonly denominador: string
  readonly ejercicio: 2025
  readonly declarantes: readonly string[]
  readonly nodoDerivacion: string
}
export type ParteAyuda =
  | {
      readonly id: string
      readonly clasificacion: "exenta_RDL10_2026"
      readonly importe: string
      readonly siniestro: string
      readonly acuerdoEstatal: Documento
      readonly inclusionPersonal: Documento
    }
  | {
      readonly id: string
      readonly clasificacion: "no_integracion_DA5"
      readonly importe: string
      readonly expedienteDanio: Documento
      readonly costeReparacion: string
      readonly otrasCoberturas: string
      readonly asignacionFiscal: Documento
    }
  | {
      readonly id: string
      readonly clasificacion: "integrada"
      readonly importe: string
      readonly baseLiquidableAtribuida: string
      readonly nodoImputacionAnual: string
      readonly declaracionIntegracion: Documento
    }
  | {
      readonly id: string
      readonly clasificacion: "otra_exencion"
      readonly importe: string
      readonly normaYExpediente: Documento
    }
export type Ayudas = {
  readonly codigo:
    | "galicia_ayudas_incendios_peifoga_2025"
    | "galicia_ayudas_deportistas_alto_nivel"
    | "galicia_ayudas_ela_fenotipos"
    | "galicia_ayudas_talidomida"
  readonly ayudas: readonly {
    readonly id: string
    readonly beneficiario: string
    readonly pagador:
      | "administracion_gallega"
      | "sector_publico_autonomico"
      | "otro_publico"
    readonly resolucion: Documento
    readonly fechaCobro: string
    readonly ejercicioImputacion: number
    readonly concedido: string
    readonly concepto:
      | "decreto76_2025"
      | "actividad_deportiva"
      | "ELA_fenotipo"
      | "talidomida1950_1985"
    readonly partes: readonly ParteAyuda[]
    readonly deportistaAltoNivel: Documento | null
    readonly actividadDeportiva:
      | "sin_rendimiento_economico"
      | "actividad_economica"
    readonly diagnostico: Documento | null
  }[]
  readonly tiposMedios: readonly TipoMedio[]
}
export function ayudas(c: Contexto, h: Ayudas): Resultado {
  return proteger(() => {
    contexto(c, "galicia")
    exige(ids(h.ayudas.map((a) => a.id)), "Ayudas duplicadas")
    let integrada = cero
    const tr = []
    for (const a of h.ayudas) {
      documento(a.resolucion)
      exige(
        ids([a.beneficiario]) &&
          a.beneficiario === c.titular &&
          fecha(a.fechaCobro) &&
          Number.isInteger(a.ejercicioImputacion) &&
          ids(a.partes.map((p) => p.id)),
        "Identidad/imputación de ayuda inválida"
      )
      let clasificada = cero
      let base = cero
      const concepto =
        h.codigo === "galicia_ayudas_incendios_peifoga_2025"
          ? "decreto76_2025"
          : h.codigo === "galicia_ayudas_deportistas_alto_nivel"
            ? "actividad_deportiva"
            : h.codigo === "galicia_ayudas_ela_fenotipos"
              ? "ELA_fenotipo"
              : "talidomida1950_1985"
      exige(
        a.concepto === concepto,
        "Concepto de ayuda no corresponde al código"
      )
      for (const p of a.partes) {
        const cantidad = euros(p.importe)
        clasificada = mas(clasificada, cantidad)
        switch (p.clasificacion) {
          case "exenta_RDL10_2026":
            documento(p.acuerdoEstatal)
            documento(p.inclusionPersonal)
            exige(
              concepto === "decreto76_2025" &&
                fecha(p.siniestro) &&
                p.siniestro >= "2025-06-23" &&
                p.siniestro <= "2025-08-25",
              "Exención personal fuera de siniestros23/6–25/8;no extender a otoño"
            )
            break
          case "no_integracion_DA5":
            documento(p.expedienteDanio)
            documento(p.asignacionFiscal)
            exige(
              compara(
                cantidad,
                menos(euros(p.costeReparacion), euros(p.otrasCoberturas))
              ) <= 0,
              "Parte no integrada excede daño/coste neto acreditado"
            )
            break
          case "otra_exencion":
            documento(p.normaYExpediente)
            break
          case "integrada":
            documento(p.declaracionIntegracion)
            exige(
              p.nodoImputacionAnual.trim().length > 0,
              "Falta distribución anual a base liquidable"
            )
            exige(
              compara(euros(p.baseLiquidableAtribuida), cantidad) <= 0,
              "Parte en base liquidable superior a ayuda integrada"
            )
            base = mas(base, euros(p.baseLiquidableAtribuida))
            break
          default:
            exige(
              false,
              "Clasificación fiscal desconocida; no se presume exención"
            )
        }
      }
      exige(
        compara(clasificada, euros(a.concedido)) === 0,
        "Clasificación no agota ayuda concedida"
      )
      let apto = a.ejercicioImputacion === 2025
      if (concepto === "decreto76_2025")
        apto = apto && a.pagador === "administracion_gallega"
      if (concepto === "actividad_deportiva") {
        exige(
          a.deportistaAltoNivel !== null,
          "Falta resolución deportista alto nivel"
        )
        documento(a.deportistaAltoNivel)
        apto =
          apto &&
          a.pagador !== "otro_publico" &&
          a.actividadDeportiva === "sin_rendimiento_economico"
      }
      if (concepto === "ELA_fenotipo") {
        exige(a.diagnostico !== null, "Falta diagnósticoELA/fenotipo")
        documento(a.diagnostico)
      }
      if (apto) integrada = mas(integrada, base)
      tr.push(
        paso(
          a.id,
          "Clasificar concedido/exento/no integrado;solo imputación2025 en BL",
          euros(a.concedido),
          apto ? base : cero
        )
      )
    }
    let tasa = cero
    if (compara(integrada, cero) > 0) {
      exige(
        h.tiposMedios.length === 2 && ids(h.tiposMedios.map((t) => t.ambito)),
        "Faltan tipos medios estatal/autonómico derivables de anual"
      )
      for (const t of h.tiposMedios) {
        exige(
          t.ejercicio === 2025 &&
            t.nodoDerivacion.trim().length > 0 &&
            ids(t.declarantes) &&
            t.declarantes.length === c.declarantes.length &&
            t.declarantes.every((id) => c.declarantes.includes(id)) &&
            /^\d+$/.test(t.numeradorPorcentaje) &&
            /^[1-9]\d*$/.test(t.denominador),
          "Tipo medio de otro ámbito o fracción inválida"
        )
        const ratio = r(
          BigInt(t.numeradorPorcentaje),
          BigInt(t.denominador) * 100n
        )
        exige(compara(ratio, r(1n)) <= 0, "Tipo medio>100%")
        tasa = mas(tasa, ratio)
      }
    }
    const v = producto(integrada, tasa)
    return resultado(
      c,
      v,
      [
        ...tr,
        paso(
          "tipos_medios",
          "Suma de tipos medios anual estatal/autonómico,solo parte incluida en BL",
          integrada,
          v
        ),
      ],
      [
        "Tipos medios y porciones de base liquidable tienen nodos de derivación anual;no se fabrican con renta marginal",
        "La cadenaRDL10/2026 y convalidación está contrastada;los documentos del caso y su clasificación siguen pendientes de acreditación",
      ]
    )
  })
}
export type Libros = {
  readonly codigo: "galicia_libros_texto_material_escolar"
  readonly miembros2024: readonly {
    readonly persona: Persona
    readonly renta2024: string
    readonly pensionIncapacidad:
      | "ninguna"
      | "total"
      | "absoluta"
      | "gran_invalidez"
  }[]
  readonly descendientes: readonly {
    readonly persona: Persona
    readonly progenitores: readonly string[]
    readonly titularesMinimo: readonly string[]
    readonly titularesDeduccion: readonly string[]
    readonly nivel: "primaria" | "ESO" | "especial" | "otro"
    readonly centro: "fondos_publicos" | "privado"
    readonly curso: string
    readonly ayudasCurso: readonly Documento[]
    readonly compras: readonly {
      readonly pago: Pago
      readonly facturaFecha: string
      readonly categoria:
        | "texto"
        | "lectura_prescrita"
        | "diccionario"
        | "calculadora_basica"
        | "mochila"
        | "fungible"
        | "deportivo_EF"
        | "electronica"
        | "uniforme"
        | "otro"
    }[]
  }[]
}
export function libros(c: Contexto, h: Libros): Resultado {
  return proteger(() => {
    contexto(c, "galicia")
    exige(
      ids(h.miembros2024.map((x) => x.persona.id)) &&
        h.miembros2024.length > 0 &&
        ids(h.descendientes.map((x) => x.persona.id)) &&
        ids(h.descendientes.flatMap((x) => x.compras.map((a) => a.pago.id))),
      "Miembros2024/descendientes desconocidos o duplicados"
    )
    let renta = cero
    let peso = 0
    for (const m of h.miembros2024) {
      exige(
        fecha(m.persona.nacimiento) &&
          Number.isFinite(m.persona.discapacidad) &&
          m.persona.discapacidad >= 0 &&
          m.persona.discapacidad <= 100 &&
          ["ninguna", "total", "absoluta", "gran_invalidez"].includes(
            m.pensionIncapacidad
          ),
        "Miembro2024 o pensión desconocidos"
      )
      renta = mas(renta, euros(m.renta2024, true))
      peso +=
        m.persona.discapacidad >= 33 || m.pensionIncapacidad !== "ninguna"
          ? 2
          : 1
    }
    const acceso = compara(renta, por(euros("30000"), peso)) <= 0
    let total = cero
    const tr = []
    for (const x of h.descendientes) {
      exige(
        ["primaria", "ESO", "especial", "otro"].includes(x.nivel) &&
          ["fondos_publicos", "privado"].includes(x.centro),
        "Nivel o centro desconocidos"
      )
      exige(
        x.persona.id !== c.titular &&
          fecha(x.persona.nacimiento) &&
          ids(x.progenitores) &&
          ids(x.titularesMinimo) &&
          !x.titularesMinimo.includes(x.persona.id),
        "Identidad filial imposible"
      )
      let textoBase = cero,
        material = cero,
        deporte = cero
      exige(ids(x.compras.map((a) => a.pago.id)), "Compra duplicada")
      conciliar(
        x.compras.map((a) => a.pago),
        [...x.progenitores, ...x.titularesMinimo, ...x.titularesDeduccion]
      )
      for (const a of x.compras) {
        exige(fecha(a.facturaFecha), "Fecha factura inválida")
        const base = pagos(
          [a.pago],
          [a.pago.concepto],
          true,
          "ejercicio",
          "satisfecho"
        )
        if (a.facturaFecha < "2025-07-01" || a.facturaFecha > "2025-12-31")
          continue
        if (a.categoria === "texto") textoBase = mas(textoBase, base)
        else if (a.categoria === "deportivo_EF") deporte = mas(deporte, base)
        else if (
          [
            "lectura_prescrita",
            "diccionario",
            "calculadora_basica",
            "mochila",
            "fungible",
          ].includes(a.categoria)
        )
          material = mas(material, base)
      }
      const base = mas(
        textoBase,
        min(euros("300"), mas(material, min(deporte, euros("150"))))
      )
      x.ayudasCurso.forEach(documento)
      const derecho =
        x.titularesMinimo.includes(c.titular) ||
        (x.progenitores.includes(c.titular) &&
          x.compras.some((a) => a.pago.pagador === c.titular))
      const v =
        acceso &&
        derecho &&
        x.nivel !== "otro" &&
        x.centro === "fondos_publicos" &&
        x.ayudasCurso.length === 0
          ? producto(
              min(euros("105"), por(base, 15, 100)),
              reparto(x.titularesDeduccion, c)
            )
          : cero
      total = mas(total, v)
      tr.push(
        paso(
          x.persona.id,
          "15%,105/hijo;material300 incluido deportivo150;facturas semestre2;efectivo2025 admitido",
          base,
          v
        )
      )
    }
    return resultado(c, total, tr, [
      "Renta2024 per cápita ponderada;documentar curso,matrícula,ayudas y atribución excepcional de progenitor pagador sin mínimo",
    ])
  })
}
