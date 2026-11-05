import type Decimal from "decimal.js"
import { Schema } from "effect"
import {
  D,
  Texto,
  Entero,
  Centimos,
  BaseCentimos,
  MagnitudBaseAnual,
  MagnitudAnual,
  Grado,
  Contexto,
  Pago,
  Minimo,
  FamiliaNumerosa,
  Fiscalidad,
  exigir,
  ref,
  fecha,
  edad,
  unicos,
  titulares,
  eur,
  renta,
  rentaMinorada,
  limiteRenta,
  minimo,
  numerosa,
  pagado,
  pagos,
  incompatible,
  diferenciada,
} from "./comun"
import { Vivienda, habitual, baseVivienda } from "./vivienda"
import { Inversion, sociedad } from "./inversion"
export const S0 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_nacimiento_adopcion_hijo_discapacidad_33"),
  hechos: Schema.Struct({
    eventos: Schema.Array(
      Schema.Struct({
        persona: Texto,
        nacimiento: Texto,
        fecha: Texto,
        clase: Schema.Literals(["nacimiento", "adopcion"]),
        resolucion: Texto,
        convivientes: Schema.Array(Texto),
        orden: Entero,
        grado: Grado,
        resolucionDiscapacidad: Schema.String,
        normaConvenio: Texto,
        residencia2024Poblacion: Entero,
        residencia2025Poblacion: Entero,
        padron2024: Texto,
        padron2025: Texto,
      })
    ),
    fiscalidad: Fiscalidad,
  }),
})
export const S1 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_adopcion_internacional"),
  hechos: Schema.Struct({
    eventos: Schema.Array(
      Schema.Struct({
        persona: Texto,
        nacimiento: Texto,
        fecha: Texto,
        clase: Schema.Literals(["nacimiento", "adopcion"]),
        resolucion: Texto,
        convivientes: Schema.Array(Texto),
        orden: Entero,
        grado: Grado,
        resolucionDiscapacidad: Schema.String,
        normaConvenio: Texto,
        residencia2024Poblacion: Entero,
        residencia2025Poblacion: Entero,
        padron2024: Texto,
        padron2025: Texto,
      })
    ),
    fiscalidad: Fiscalidad,
  }),
})
export const S2 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_nacimiento_adopcion_tercer_hijo_sucesivos"),
  hechos: Schema.Struct({
    eventos: Schema.Array(
      Schema.Struct({
        persona: Texto,
        nacimiento: Texto,
        fecha: Texto,
        clase: Schema.Literals(["nacimiento", "adopcion"]),
        resolucion: Texto,
        convivientes: Schema.Array(Texto),
        orden: Entero,
        grado: Grado,
        resolucionDiscapacidad: Schema.String,
        normaConvenio: Texto,
        residencia2024Poblacion: Entero,
        residencia2025Poblacion: Entero,
        padron2024: Texto,
        padron2025: Texto,
      })
    ),
    fiscalidad: Fiscalidad,
  }),
})
export const S3 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_primer_segundo_hijo_poblaciones_menos_10000"),
  hechos: Schema.Struct({
    eventos: Schema.Array(
      Schema.Struct({
        persona: Texto,
        nacimiento: Texto,
        fecha: Texto,
        clase: Schema.Literals(["nacimiento", "adopcion"]),
        resolucion: Texto,
        convivientes: Schema.Array(Texto),
        orden: Entero,
        grado: Grado,
        resolucionDiscapacidad: Schema.String,
        normaConvenio: Texto,
        residencia2024Poblacion: Entero,
        residencia2025Poblacion: Entero,
        padron2024: Texto,
        padron2025: Texto,
      })
    ),
    fiscalidad: Fiscalidad,
  }),
})
export const S4 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_libros_texto_material_escolar"),
  hechos: Schema.Struct({
    familia: FamiliaNumerosa,
    fiscalidad: Fiscalidad,
    descendientes: Schema.Array(
      Schema.Struct({
        minimo: Minimo,
        ayudasAtribuidasCentimos: Centimos,
        referenciaAyudas: Texto,
        etapa: Schema.Literals([
          "infantil",
          "primaria",
          "ESO",
          "FP-basica",
          "otra",
        ]),
        materia: Texto,
        proveedor: Schema.Literals([
          "centro-educativo",
          "centro-externo",
          "particular-iae",
        ]),
        referenciaProveedor: Texto,
        pagos: Schema.Array(Pago),
      })
    ),
  }),
})
export const S5 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_clases_apoyo_refuerzo"),
  hechos: Schema.Struct({
    familia: FamiliaNumerosa,
    fiscalidad: Fiscalidad,
    descendientes: Schema.Array(
      Schema.Struct({
        minimo: Minimo,
        ayudasAtribuidasCentimos: Centimos,
        referenciaAyudas: Texto,
        etapa: Schema.Literals([
          "infantil",
          "primaria",
          "ESO",
          "FP-basica",
          "otra",
        ]),
        materia: Texto,
        proveedor: Schema.Literals([
          "centro-educativo",
          "centro-externo",
          "particular-iae",
        ]),
        referenciaProveedor: Texto,
        pagos: Schema.Array(Pago),
      })
    ),
  }),
})
export const S6 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_formacion_autonomia_menores_discapacidad"),
  hechos: Schema.Struct({
    familia: FamiliaNumerosa,
    fiscalidad: Fiscalidad,
    descendientes: Schema.Array(
      Schema.Struct({
        minimo: Minimo,
        ayudasAtribuidasCentimos: Centimos,
        referenciaAyudas: Texto,
        etapa: Schema.Literals([
          "infantil",
          "primaria",
          "ESO",
          "FP-basica",
          "otra",
        ]),
        materia: Texto,
        proveedor: Schema.Literals([
          "centro-educativo",
          "centro-externo",
          "particular-iae",
        ]),
        referenciaProveedor: Texto,
        pagos: Schema.Array(Pago),
      })
    ),
  }),
})
export const S7 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_guarderia_menores_3"),
  hechos: Schema.Struct({
    fiscalidad: Fiscalidad,
    hijos: Schema.Array(
      Schema.Struct({
        minimo: Minimo,
        centroAutorizadoEducacion: Texto,
        pagosConsolidados: Schema.Array(
          Schema.Struct({
            pago: Pago,
            servicioDesde: Texto,
            servicioHasta: Texto,
          })
        ),
        convivientes: Schema.Array(Texto),
      })
    ),
  }),
})
export const S8 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_mayores_70"),
  hechos: Schema.Struct({
    rendimientosTrabajoCentimos: MagnitudBaseAnual,
    rendimientosActividadCentimos: MagnitudBaseAnual,
    gananciasNoTransmisionCentimos: MagnitudAnual,
    otrosNoCapital: Schema.String,
  }),
})
export const S9 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_residencia_determinados_municipios"),
  hechos: Schema.Struct({ fiscalidad: Fiscalidad }),
})
export const S10 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_cuidado_personas_dependientes"),
  hechos: Schema.Struct({
    fiscalidad: Fiscalidad,
    dependientes: Schema.Array(
      Schema.Struct({
        persona: Texto,
        nacimiento: Texto,
        vinculo: Schema.Literals(["ascendiente", "descendiente"]),
        gradoDiscapacidad: Grado,
        resolucion: Texto,
        rentasNoExentasCentimos: BaseCentimos,
        cuidadores: Schema.Array(
          Schema.Struct({
            id: Texto,
            gradoParentesco: Entero,
            diasConvivencia: Entero,
            rentasNoExentasCentimos: BaseCentimos,
            referencia: Texto,
          })
        ),
      })
    ),
  }),
})
export const S11 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_donaciones_ecologicas_idi"),
  hechos: Schema.Struct({
    cuotaIntegraAutonomicaCentimos: MagnitudAnual,
    donaciones: Schema.Array(
      Schema.Struct({
        pago: Pago,
        entidad: Texto,
        clase: Schema.Literals(["publica-aragonesa", "ley49-art2y3"]),
        finalidad: Schema.Literals([
          "medio-ambiente",
          "investigacion-desarrollo",
        ]),
        caracter: Schema.Literals(["pura-simple", "onerosa"]),
        registroAragones: Schema.String,
        estatutosFinalidadPrincipal: Texto,
        certificado: Texto,
      })
    ),
  }),
})
export const S12 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_vivienda_nucleos_rurales"),
  hechos: Schema.Struct({
    vivienda: Vivienda,
    fiscalidad: Fiscalidad,
    municipioAragones: Texto,
    poblacion: Entero,
    entidadDiferenciada: Schema.Literals([
      "ninguna",
      "local-menor",
      "singular",
    ]),
    referenciaEntidad: Schema.String,
  }),
})
export const S13 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_vivienda_victimas_terrorismo"),
  hechos: Schema.Struct({
    vivienda: Vivienda,
    municipioAragones: Texto,
    calificacionProtegida: Texto,
    viviendaNueva: Schema.Literals(["nueva", "usada"]),
    condicion: Schema.Literals([
      "victima",
      "conyuge-pareja",
      "hijo-conviviente",
    ]),
    expedienteVictima: Texto,
    ausenciaTitularPrioritario: Schema.String,
    convivenciaVictima: Schema.String,
  }),
})
export const S14 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_arrendamiento_dacion_pago"),
  hechos: Schema.Struct({
    vivienda: Vivienda,
    contratoArrendamiento: Texto,
    escrituraDacion: Texto,
    deudaAntesCentimos: Centimos,
    deudaCanceladaCentimos: Centimos,
    opcionCompra: Texto,
    fianzaDepositada: Texto,
    fechaDeposito: Texto,
    finPlazoLegal: Texto,
    referenciaPlazoLegal: Texto,
    pagosAlquiler: Schema.Array(Pago),
  }),
})
export const S15 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_inversion_acciones_mab"),
  hechos: Schema.Struct({ inversiones: Schema.Array(Inversion) }),
})
export const S16 = Schema.Struct({
  ...Contexto,
  territorio: Schema.Literal("aragon"),
  codigo: Schema.Literal("aragon_inversion_economia_social"),
  hechos: Schema.Struct({ inversiones: Schema.Array(Inversion) }),
})
export const SolicitudAragon = Schema.Union([
  S0,
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  S11,
  S12,
  S13,
  S14,
  S15,
  S16,
])
export type HechosAragon = typeof SolicitudAragon.Type
export function calcularAragon(h: HechosAragon): Decimal {
  switch (h.codigo) {
    case "aragon_nacimiento_adopcion_hijo_discapacidad_33": {
      const f = h.hechos
      const especial = diferenciada(f.fiscalidad)
      unicos(f.eventos.map((e) => e.persona))
      let total = new D(0)
      for (const e of f.eventos) {
        exigir(e.persona !== h.contribuyente, "Hijo coincide con contribuyente")
        exigir(fecha(e.fecha).startsWith("2025-"), "Evento fuera2025")
        exigir(fecha(e.nacimiento) <= e.fecha, "Evento anterior al nacimiento")
        ref(e.resolucion)
        if (e.clase === "nacimiento")
          exigir(e.fecha === e.nacimiento, "Fecha de nacimiento incoherente")
        exigir(
          !e.convivientes.includes(e.persona),
          "Hijo beneficiario incluido entre sus propios titulares"
        )
        const factor = titulares(e.convivientes, h.contribuyente)
        exigir(e.grado >= 33, "Grado del hijo inferior33 a devengo")
        ref(e.resolucionDiscapacidad)
        incompatible(h, e.persona, [
          "aragon_primer_segundo_hijo_poblaciones_menos_10000",
        ])
        const cuantia = especial ? 240 : 200
        total = total.plus(new D(cuantia).times(factor))
      }
      return total
    }
    case "aragon_adopcion_internacional": {
      const f = h.hechos
      const especial = diferenciada(f.fiscalidad)
      unicos(f.eventos.map((e) => e.persona))
      let total = new D(0)
      for (const e of f.eventos) {
        exigir(e.persona !== h.contribuyente, "Hijo coincide con contribuyente")
        exigir(fecha(e.fecha).startsWith("2025-"), "Evento fuera2025")
        exigir(fecha(e.nacimiento) <= e.fecha, "Evento anterior al nacimiento")
        ref(e.resolucion)
        if (e.clase === "nacimiento")
          exigir(e.fecha === e.nacimiento, "Fecha de nacimiento incoherente")
        exigir(
          !e.convivientes.includes(e.persona),
          "Hijo beneficiario incluido entre sus propios titulares"
        )
        const factor = titulares(e.convivientes, h.contribuyente)
        exigir(e.clase === "adopcion", "No es adopción internacional")
        ref(e.normaConvenio)
        const cuantia = especial ? 720 : 600
        total = total.plus(new D(cuantia).times(factor))
      }
      return total
    }
    case "aragon_nacimiento_adopcion_tercer_hijo_sucesivos": {
      const f = h.hechos
      const especial = diferenciada(f.fiscalidad)
      unicos(f.eventos.map((e) => e.persona))
      let total = new D(0)
      for (const e of f.eventos) {
        exigir(e.persona !== h.contribuyente, "Hijo coincide con contribuyente")
        exigir(fecha(e.fecha).startsWith("2025-"), "Evento fuera2025")
        exigir(fecha(e.nacimiento) <= e.fecha, "Evento anterior al nacimiento")
        ref(e.resolucion)
        if (e.clase === "nacimiento")
          exigir(e.fecha === e.nacimiento, "Fecha de nacimiento incoherente")
        exigir(
          !e.convivientes.includes(e.persona),
          "Hijo beneficiario incluido entre sus propios titulares"
        )
        const factor = titulares(e.convivientes, h.contribuyente)
        exigir(e.orden >= 3, "Orden del hijo inferior a tercero")
        const cuantia = new D(rentaMinorada(h).lte(21000) ? 600 : 500).times(
          especial ? "1.2" : "1"
        )
        total = total.plus(new D(cuantia).times(factor))
      }
      return total
    }
    case "aragon_primer_segundo_hijo_poblaciones_menos_10000": {
      const f = h.hechos
      unicos(f.eventos.map((e) => e.persona))
      let total = new D(0)
      for (const e of f.eventos) {
        exigir(e.persona !== h.contribuyente, "Hijo coincide con contribuyente")
        exigir(fecha(e.fecha).startsWith("2025-"), "Evento fuera2025")
        exigir(fecha(e.nacimiento) <= e.fecha, "Evento anterior al nacimiento")
        ref(e.resolucion)
        if (e.clase === "nacimiento")
          exigir(e.fecha === e.nacimiento, "Fecha de nacimiento incoherente")
        exigir(
          !e.convivientes.includes(e.persona),
          "Hijo beneficiario incluido entre sus propios titulares"
        )
        const factor = titulares(e.convivientes, h.contribuyente)
        exigir(
          e.orden === 1 || e.orden === 2,
          "Hijo fuera del orden primero/segundo"
        )
        exigir(
          e.residencia2024Poblacion < 10000 &&
            e.residencia2025Poblacion < 10000,
          "Residencia del contribuyente en ambos años requiere municipio inferior10000"
        )
        ref(e.padron2024)
        ref(e.padron2025)
        incompatible(h, e.persona, [
          "aragon_nacimiento_adopcion_hijo_discapacidad_33",
        ])
        const cuantia =
          (e.orden === 1 ? 100 : 150) * (renta(h).lte(23000) ? 2 : 1)
        total = total.plus(new D(cuantia).times(factor))
      }
      return total
    }
    case "aragon_libros_texto_material_escolar": {
      const f = h.hechos
      const fn = numerosa(f.familia, h)
      const especial = diferenciada(f.fiscalidad)
      exigir(
        renta(h).lte(fn ? 30000 : 12500),
        "Renta supera tabla individual de gastos educativos"
      )
      unicos(f.descendientes.map((d) => d.minimo.persona))
      unicos(f.descendientes.flatMap((d) => d.pagos.map((p) => p.id)))
      let total = new D(0)
      for (const d of f.descendientes) {
        minimo(d.minimo, h, "descendiente")
        ref(d.referenciaAyudas)
        ref(d.referenciaProveedor)
        ref(d.materia)
        exigir(
          d.etapa === "primaria" || d.etapa === "ESO",
          "Libros/material fuera de Primaria o ESO"
        )
        const tope = new D(
          fn ? 75 : renta(h).lte(6500) ? 50 : renta(h).lte(10000) ? 37.5 : 25
        ).times(especial ? "1.2" : "1")
        const bruto = pagos(d.pagos, h, true, true)
        total = total.plus(
          D.max(0, D.min(bruto, tope).minus(eur(d.ayudasAtribuidasCentimos)))
        )
      }
      return total
    }
    case "aragon_clases_apoyo_refuerzo": {
      const f = h.hechos
      const fn = numerosa(f.familia, h)
      exigir(
        renta(h).lte(fn ? 30000 : 12500),
        "Renta supera tabla individual de gastos educativos"
      )
      unicos(f.descendientes.map((d) => d.minimo.persona))
      unicos(f.descendientes.flatMap((d) => d.pagos.map((p) => p.id)))
      let total = new D(0)
      for (const d of f.descendientes) {
        minimo(d.minimo, h, "descendiente")
        ref(d.referenciaAyudas)
        ref(d.referenciaProveedor)
        ref(d.materia)
        exigir(
          d.etapa !== "otra",
          "Clases fuera de etapas educativas admitidas"
        )
        const tope = fn
          ? 300
          : renta(h).lte(6500)
            ? 100
            : renta(h).lte(10000)
              ? 80
              : 50
        const bruto = pagos(d.pagos, h, true, true).times("0.25")
        total = total.plus(
          D.max(0, D.min(bruto, tope).minus(eur(d.ayudasAtribuidasCentimos)))
        )
      }
      return total
    }
    case "aragon_formacion_autonomia_menores_discapacidad": {
      const f = h.hechos
      const fn = numerosa(f.familia, h)
      exigir(
        renta(h).lte(fn ? 30000 : 12500),
        "Renta supera tabla individual de gastos educativos"
      )
      unicos(f.descendientes.map((d) => d.minimo.persona))
      unicos(f.descendientes.flatMap((d) => d.pagos.map((p) => p.id)))
      let total = new D(0)
      for (const d of f.descendientes) {
        minimo(d.minimo, h, "descendiente")
        ref(d.referenciaAyudas)
        ref(d.referenciaProveedor)
        ref(d.materia)
        exigir(
          edad(d.minimo.nacimiento) < 18 && d.minimo.discapacidad >= 65,
          "Autonomía: descendiente no menor18 con grado65"
        )
        const tope = fn
          ? 300
          : renta(h).lte(6500)
            ? 100
            : renta(h).lte(10000)
              ? 80
              : 50
        const bruto = pagos(d.pagos, h, true, true).times("0.25")
        total = total.plus(
          D.max(0, D.min(bruto, tope).minus(eur(d.ayudasAtribuidasCentimos)))
        )
      }
      return total
    }
    case "aragon_guarderia_menores_3": {
      const f = h.hechos
      exigir(
        eur(h.liquidableGeneralCentimos)
          .plus(eur(h.liquidableAhorroCentimos))
          .lt(35000) && eur(h.imponibleAhorroCentimos).lte(4000),
        "Guardería: BL debe ser inferior35000 y BI ahorro no superior4000"
      )
      const especial = diferenciada(f.fiscalidad)
      unicos(f.hijos.map((c) => c.minimo.persona))
      unicos(f.hijos.flatMap((c) => c.pagosConsolidados.map((p) => p.pago.id)))
      let total = new D(0)
      for (const c of f.hijos) {
        minimo(c.minimo, h, "descendiente")
        ref(c.centroAutorizadoEducacion)
        const edadFinal = edad(c.minimo.nacimiento)
        exigir(edadFinal <= 3, "Hijo mayor de3 al finalizar2025")
        const factor = titulares(c.convivientes, h.contribuyente)
        unicos(c.pagosConsolidados.map((p) => p.pago.id))
        let gasto = new D(0)
        for (const servicio of c.pagosConsolidados) {
          const p = servicio.pago
          exigir(
            fecha(servicio.servicioDesde) <= fecha(servicio.servicioHasta) &&
              servicio.servicioDesde.startsWith("2025-") &&
              servicio.servicioHasta.startsWith("2025-"),
            "Período de custodia no individualizado en2025"
          )
          exigir(
            c.convivientes.includes(p.pagador),
            "Pagador fuera de convivientes"
          )
          exigir(
            edad(c.minimo.nacimiento, servicio.servicioHasta) < 3,
            "Custodia posterior al tercer cumpleaños: aportar desglose del servicio anterior"
          )
          gasto = gasto.plus(
            pagado(p, { ...h, contribuyente: p.pagador }, true)
          )
        }
        const max = new D(edadFinal === 3 ? 125 : 250).times(
          especial ? "1.2" : "1"
        )
        total = total.plus(D.min(gasto.times("0.15"), max).times(factor))
      }
      return total
    }
    case "aragon_mayores_70": {
      const f = h.hechos
      limiteRenta(h, 23000)
      exigir(edad(h.nacimiento) >= 70, "Contribuyente menor70")
      exigir(
        !eur(f.rendimientosTrabajoCentimos).isZero() ||
          !eur(f.rendimientosActividadCentimos).isZero(),
        "Sólo capital/ganancias no transmisión: sección propia del manual exige trabajo o actividad; otra categoría necesita calificación concreta"
      )
      return new D(75)
    }
    case "aragon_residencia_determinados_municipios": {
      const f = h.hechos
      exigir(
        diferenciada(f.fiscalidad) && f.fiscalidad.rango === "X",
        "Residencia600 requiere rangoX y condiciones160-1"
      )
      exigir(
        eur(h.liquidableGeneralCentimos)
          .plus(eur(h.liquidableAhorroCentimos))
          .lt(35000) && eur(h.imponibleAhorroCentimos).lte(4000),
        "Residencia600 requiere BL inferior35000 y BI ahorro no superior4000"
      )
      return new D(600)
    }
    case "aragon_cuidado_personas_dependientes": {
      const f = h.hechos
      exigir(
        rentaMinorada(h).lte(21000),
        "Dependientes: BI menos mínimos contribuyente/descendiente superior21000"
      )
      const especial = diferenciada(f.fiscalidad)
      unicos(f.dependientes.map((d) => d.persona))
      exigir(
        f.dependientes.length <= 1,
        "Varios dependientes con censos distintos: falta resolver deducción única por contribuyente del art110-5, no multiplicar150"
      )
      let factor = new D(0)
      for (const d of f.dependientes) {
        exigir(
          d.persona !== h.contribuyente,
          "Dependiente coincide con cuidador"
        )
        ref(d.resolucion)
        exigir(
          (d.vinculo === "ascendiente" && edad(d.nacimiento) > 75) ||
            d.gradoDiscapacidad >= 65,
          "Dependiente sin edad/discapacidad habilitante"
        )
        exigir(
          eur(d.rentasNoExentasCentimos).lte(8000),
          "Dependiente con rentas superiores8000"
        )
        unicos(d.cuidadores.map((c) => c.id))
        const cs = d.cuidadores.filter((c) => {
          ref(c.referencia)
          exigir(c.id !== d.persona, "Cuidador coincide con dependiente")
          exigir(
            c.diasConvivencia <= 365 && c.gradoParentesco > 0,
            "Convivencia/grado inválido"
          )
          return c.diasConvivencia >= 183
        })
        exigir(cs.length > 0, "Sin convivencia durante mitad del período")
        const grados = [...new Set(cs.map((c) => c.gradoParentesco))].sort(
          (a, b) => a - b
        )
        let elegidos = cs.filter((c) => c.gradoParentesco === grados[0])
        exigir(
          !elegidos.some((c) => eur(c.rentasNoExentasCentimos).lte(8000)) ||
            !elegidos.some((c) => eur(c.rentasNoExentasCentimos).gt(8000)),
          "Cuidadores del mismo grado con rentas mixtas: precisar cesión al siguiente grado antes de prorratear"
        )
        if (
          elegidos.every((c) => eur(c.rentasNoExentasCentimos).lte(8000)) &&
          grados.length > 1
        )
          elegidos = cs.filter((c) => c.gradoParentesco === grados[1])
        factor = titulares(
          elegidos.map((c) => c.id),
          h.contribuyente
        )
      }
      return new D(especial ? 300 : 150).times(factor)
    }
    case "aragon_donaciones_ecologicas_idi": {
      const f = h.hechos
      unicos(f.donaciones.map((d) => d.pago.id))
      let total = new D(0)
      for (const d of f.donaciones) {
        exigir(d.caracter === "pura-simple", "Donación no pura y simple")
        ref(d.entidad)
        ref(d.estatutosFinalidadPrincipal)
        ref(d.certificado)
        if (d.clase === "ley49-art2y3") ref(d.registroAragones)
        total = total.plus(pagado(d.pago, h, true))
      }
      return D.min(
        total.times("0.20"),
        eur(f.cuotaIntegraAutonomicaCentimos).times("0.10")
      )
    }
    case "aragon_vivienda_nucleos_rurales": {
      const f = h.hechos
      exigir(
        edad(h.nacimiento) < 36 && rentaMinorada(h).lte(21000),
        "Vivienda rural: edad o BI minorada fuera del límite"
      )
      ref(f.municipioAragones)
      exigir(
        f.poblacion < 3000 || f.entidadDiferenciada !== "ninguna",
        "Municipio no inferior3000 ni entidad diferenciada"
      )
      if (f.entidadDiferenciada !== "ninguna") ref(f.referenciaEntidad)
      exigir(
        f.vivienda.anterior === "primera-vivienda" &&
          f.vivienda.adquisicion >= "2012-01-01",
        "Rural: no primera vivienda o inversión anterior2012"
      )
      exigir(
        f.vivienda.operacion === "adquisicion" ||
          f.vivienda.operacion === "rehabilitacion",
        "Operación rural no adquisición/rehabilitación"
      )
      const especial = diferenciada(f.fiscalidad)
      return baseVivienda(f.vivienda, h, true).times(
        especial ? "0.075" : "0.05"
      )
    }
    case "aragon_vivienda_victimas_terrorismo": {
      const f = h.hechos
      ref(f.municipioAragones)
      ref(f.calificacionProtegida)
      ref(f.expedienteVictima)
      exigir(
        f.viviendaNueva === "nueva" &&
          f.vivienda.anterior === "primera-vivienda" &&
          f.vivienda.operacion === "adquisicion",
        "Terrorismo requiere nueva primera vivienda adquirida"
      )
      if (f.condicion !== "victima") ref(f.ausenciaTitularPrioritario)
      if (f.condicion === "hijo-conviviente") ref(f.convivenciaVictima)
      return baseVivienda(f.vivienda, h, true).times("0.03")
    }
    case "aragon_arrendamiento_dacion_pago": {
      const f = h.hechos
      limiteRenta(h, 15000)
      habitual(f.vivienda)
      ref(f.contratoArrendamiento)
      ref(f.escrituraDacion)
      ref(f.opcionCompra)
      exigir(
        f.deudaAntesCentimos > 0 &&
          f.deudaAntesCentimos === f.deudaCanceladaCentimos,
        "Dación no cancela totalidad de deuda art121-10"
      )
      ref(f.fianzaDepositada)
      ref(f.referenciaPlazoLegal)
      exigir(
        fecha(f.fechaDeposito) <= fecha(f.finPlazoLegal),
        "Fianza fuera del plazo legal aportado"
      )
      return D.min(pagos(f.pagosAlquiler, h, true), 4800).times("0.10")
    }
    case "aragon_inversion_acciones_mab": {
      const f = h.hechos
      unicos(f.inversiones.map((i) => i.pago.id))
      let total = new D(0)
      for (const i of f.inversiones) {
        sociedad(i, "aragon", "MAB")
        exigir(
          i.operacion === "ampliacion" && i.mercado === "MAB-expansion",
          "Suscripción no ampliación por segmentoMAB expansión"
        )
        exigir(
          i.capitalPropioMaxPuntosBasicos <= 1000,
          "Participación propia supera10%"
        )
        incompatible(h, i.entidad, [
          "aragon_inversion_entidades_nuevas_reciente_creacion",
          "aragon_inversion_economia_social",
        ])
        total = total.plus(pagado(i.pago, h, true))
      }
      return D.min(total.times("0.20"), 10000)
    }
    case "aragon_inversion_economia_social": {
      const f = h.hechos
      unicos(f.inversiones.map((i) => i.pago.id))
      let total = new D(0)
      for (const i of f.inversiones) {
        sociedad(i, "aragon", "economia-social")
        ref(i.economiaSocialLey5)
        exigir(
          i.capitalFamiliarMaxPuntosBasicos <= 4000 &&
            i.votosFamiliarMaxPuntosBasicos <= 4000,
          "Participación/voto familiar supera40%"
        )
        exigir(
          i.empleadosJornadaCompleta >= 1,
          "Economía social sin empleado jornada completa Régimen General"
        )
        ref(i.referenciaContratosAlta)
        incompatible(h, i.entidad, [
          "aragon_inversion_acciones_mab",
          "aragon_inversion_entidades_nuevas_reciente_creacion",
        ])
        total = total.plus(pagado(i.pago, h, true))
      }
      return D.min(total.times("0.20"), 4000)
    }
  }
}
