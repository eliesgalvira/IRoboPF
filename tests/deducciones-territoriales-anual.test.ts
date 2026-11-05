import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect } from "effect"
import {
  aplicarDeduccionesTerritoriales2025 as aplicar,
  type MagnitudesTerritorialesAnuales,
  type SolicitudDeduccionesTerritoriales2025 as Solicitud,
} from "../lib/dominio/irpf/deducciones/anual-territorial"
import {
  racional,
  consumirCuota,
} from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import {
  componerLiquidacionAnual,
  type EntradaComposicionAnual,
} from "../lib/dominio/irpf/liquidacion/composicion-anual"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"
const m = (
  comunidadAutonoma: MagnitudesTerritorialesAnuales["caso"]["comunidadAutonoma"] = "catalunya"
): MagnitudesTerritorialesAnuales => ({
  caso: {
    anio: 2025,
    comunidadAutonoma,
    contribuyenteId: "A",
    situacionFamiliar: {
      tipo: "individual",
      edad: 40,
      discapacidad: { _tag: "SinDiscapacidad" },
      descendientes: [],
      ascendientes: [],
    },
  },
  baseGeneral: new Decimal("20079.1234567890123456789"),
  baseAhorro: new Decimal(0),
  minimoPersonalFamiliar: new Decimal(5550),
  cuotaAutonomica: new Decimal("20.079"),
  sujetosConMinimo: [],
})
const viuda: Solicitud = {
  solicitudes: [
    {
      lote: "A",
      hechos: {
        codigo: "cataluna_viudedad_2023_2024_2025",
        viudedad: {
          fecha: "2025-01-01",
          certificado: "declarado",
          descendientes: [],
        },
      },
    },
  ],
}
it("cuota 20.079 sin truncar y agotamiento metamórfico", () => {
  const r = aplicar(viuda, m())
  expect(r.total).toEqual(racional("20.079"))
  expect(r.disponible).toEqual(racional("0"))
  expect(
    aplicar(viuda, { ...m(), cuotaAutonomica: new Decimal(0) }).total
  ).toEqual(racional("0"))
  expect(
    aplicar(viuda, { ...m(), cuotaAutonomica: new Decimal(200) }).total
  ).toEqual(racional("150"))
})
it("tercios exactos y una sola cuota compartida", () => {
  const r = consumirCuota(racional("1"), [
    racional("1", "3"),
    racional("1", "3"),
    racional("1", "3"),
    racional("1", "3"),
  ])
  expect(r.total).toEqual(racional("1"))
  expect(r.aplicaciones[3].aplicado).toEqual(racional("0"))
  expect(r.aplicaciones[3].pendiente).toEqual(racional("1", "3"))
})
it("duplicados de código y ámbito", () => {
  expect(() =>
    aplicar({ solicitudes: [...viuda.solicitudes, ...viuda.solicitudes] }, m())
  ).toThrow(/duplicado/)
  expect(() => aplicar(viuda, m("madrid"))).toThrow(/territorio/)
})
it("rechaza magnitudes externas e identidad ausente", () => {
  expect(() =>
    // SAFETY: entrada inválida intencionada para comprobar el rechazo de Schema; no se leen propiedades sin validar.
    aplicar({ ...viuda, baseGeneral: "0" } as Solicitud, m())
  ).toThrow(/externas/)
  expect(() =>
    aplicar(viuda, {
      ...m(),
      caso: { ...m().caso, contribuyenteId: undefined },
    })
  ).toThrow(/identidad/)
  expect(() =>
    aplicar(viuda, { ...m(), caso: { ...m().caso, anio: 2024 } })
  ).toThrow(/2025/)
})
const b = {
  solicitudes: [
    {
      lote: "B",
      hechos: {
        codigo: "asturias_gastos_vitales_hasta_35",
        nacimiento: "2000-01-01",
        gastos: [
          {
            id: "g",
            pagador: "A",
            receptor: "tienda",
            fecha: "2025-01-01",
            euros: "100",
            documento: "factura",
            medio: "transferencia",
            concepto: "cultura",
          },
        ],
      },
    },
  ],
} satisfies Solicitud
it("B transporta bases anuales largas conservando precisión", () => {
  const mm = m("asturias")
  const r = aplicar(b, {
    ...mm,
    caso: {
      ...mm.caso,
      situacionFamiliar: { ...mm.caso.situacionFamiliar, edad: 25 },
    },
    cuotaAutonomica: new Decimal(500),
  })
  expect(r.total).toEqual(racional("100"))
})
it("no_soportado no es cero (rama edad 30 de B)", () => {
  const mm = m("asturias")
  expect(() =>
    aplicar(
      {
        solicitudes: [
          {
            lote: "B",
            hechos: { ...b.solicitudes[0].hechos, nacimiento: "1995-01-01" },
          },
        ],
      },
      {
        ...mm,
        caso: {
          ...mm.caso,
          situacionFamiliar: { ...mm.caso.situacionFamiliar, edad: 30 },
        },
      }
    )
  ).toThrow(/30/)
})
it("F conserva fracción de céntimo previa a presentación", () => {
  const s: Solicitud = {
    solicitudes: [
      {
        lote: "F",
        codigo: "murcia_deporte_actividades_saludables",
        hechos: {
          nacimientoContribuyente: "1985-01-01",
          beneficiarios: [
            { id: "A", nacimiento: "1985-01-01", relacion: "contribuyente" },
          ],
          pagos: [
            {
              id: "p",
              fecha: "2025-06-01",
              pagador: "A",
              atribucion: "propia_exclusiva",
              factura: "f",
              soportePago: "r",
              conservacionFactura: "hasta_prescripcion",
              beneficiario: "A",
              concepto: "gimnasio",
              importeEUR: "1.01",
            },
          ],
        },
      },
    ],
  }
  const r = aplicar(s, m("murcia"))
  expect(r.total).toEqual(racional("0.303"))
})
const entrada = (): EntradaComposicionAnual => ({
  ambito: m().caso,
  cotizaciones: { naturaleza: "efectivas", trabajador: new Decimal(0) },
  precision: 80,
  politica: "decimal-hasta-salida",
  baseGeneral: new Decimal(20079),
  baseAhorro: new Decimal(0),
  rentasAntesReducciones: new Decimal(20079),
  minimosEstatales: MINIMOS_ESTATALES_2025,
  deduccionesAutonomicasCentimos: 0,
})
it("composición común conserva sin deducciones y descuenta una sola vez", () => {
  const e = entrada(),
    sin = Effect.runSync(componerLiquidacionAnual(e)),
    vacio = Effect.runSync(
      componerLiquidacionAnual({
        ...e,
        deduccionesTerritoriales2025: { solicitudes: [] },
      })
    ),
    con = Effect.runSync(
      componerLiquidacionAnual({ ...e, deduccionesTerritoriales2025: viuda })
    )
  expect(vacio.cuotaPosterior.eq(sin.cuotaPosterior)).toBe(true)
  expect(sin.cuotaPosterior.minus(con.cuotaPosterior).toFixed()).toBe("150")
  expect(con.deduccionesTerritoriales2025?.estado).toBe("condicionado")
})
const donativo = {
  id: "don",
  fecha: "2025-06-01",
  pagador: "A",
  importeCentimos: 10000000,
  justificante: "recibo",
  entidad: "iec",
  claseEntidad: "iec" as const,
  calificacionEntidad: "declarada",
  censo: "no-exigible" as const,
  referenciaCenso: "",
  finalidad: "lengua-catalana-occitana" as const,
  certificado: "cert",
  modelo993: {
    fecha: "2026-01-20",
    ejercicioInformado: 2025 as const,
    via: "telematica" as const,
    referencia: "acuse",
  },
  deduccionEstatalMismoDonativoCentimos: 0,
}
it("Catalunya limita sobre cuota derivada 20.079: 2.0079 exactos", () => {
  const s: Solicitud = {
    solicitudes: [
      {
        lote: "A",
        hechos: {
          codigo: "cataluna_donativos_lengua_catalana_occitana",
          donativos: [donativo],
        },
      },
    ],
  }
  expect(aplicar(s, m()).total).toEqual(racional("2.0079"))
})
it("detecta duplicación de hecho entre códigos antes de sumar", () => {
  const s: Solicitud = {
    solicitudes: [
      {
        lote: "A",
        hechos: {
          codigo: "cataluna_donativos_lengua_catalana_occitana",
          donativos: [donativo],
        },
      },
      {
        lote: "A",
        hechos: {
          codigo: "cataluna_donativos_idi",
          donativos: [
            {
              ...donativo,
              id: "otro",
              claseEntidad: "universidad-catalana",
              finalidad: "investigacion-desarrollo-innovacion",
            },
          ],
        },
      },
    ],
  }
  expect(() => aplicar(s, m())).toThrow(/duplicado/)
})
it("incompatibilidad CLM resuelta por códigos aun con elecciones vacías", () => {
  const s: Solicitud = {
    solicitudes: [
      {
        lote: "CLM",
        codigo: "clm_discapacidad_contribuyente",
        hechos: {
          persona: "A",
          nacimiento: "1949-01-01",
          grado: 65,
          elecciones: [],
        },
      },
      {
        lote: "CLM",
        codigo: "clm_mayores_75",
        hechos: {
          persona: "A",
          nacimiento: "1949-01-01",
          grado: 65,
          diasCentro: 0,
          diasConvalecenciaSescam: 0,
        },
      },
    ],
  }
  expect(() => aplicar(s, m("castilla-la-mancha"))).toThrow(/incompatibles/)
})
it("familiares de viudedad exigen derecho actual concreto, no referencia genérica", () => {
  const s: Solicitud = {
    solicitudes: [
      {
        lote: "A",
        hechos: {
          codigo: "cataluna_viudedad_2023_2024_2025",
          viudedad: {
            fecha: "2025-01-01",
            certificado: "c",
            descendientes: [
              {
                id: "s-2",
                ejerciciosConMinimo: [2025],
                referenciaDerechos: "referencia-generica",
              },
            ],
          },
        },
      },
    ],
  }
  expect(() => aplicar(s, m())).toThrow(/mínimo anual/)
})
import {
  liquidarIrpfAnual,
  liquidarIrpfAnualExplicito,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
it("API pública canónica propaga hechos y resultado condicionado", () => {
  const caso: CasoFiscalAnual = {
    ...m().caso,
    anio: 2025,
    situacionFamiliar: m().caso.situacionFamiliar,
    rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] },
    reducciones: [],
    deducciones: [],
    retencionesSoportadasCentimos: 0,
    pagosACuentaCentimos: 0,
  }
  const sin = Effect.runSync(liquidarIrpfAnual(caso, { modo: "canonico" }))
  const con = Effect.runSync(
    liquidarIrpfAnual(
      { ...caso, deduccionesTerritoriales2025: viuda },
      { modo: "canonico" }
    )
  )
  expect(sin.cuotaLiquidaCentimos - con.cuotaLiquidaCentimos).toBe(15000)
  expect(con.deduccionesTerritoriales2025?.estado).toBe("condicionado")
})
it("API efectiva conecta su schema con la misma composición", () => {
  const caso = {
    ejercicio: 2025,
    comunidadAutonoma: "catalunya",
    contribuyenteId: "A",
    edad: 40,
    modalidad: "individual",
    residenciaTodoElAnio: true,
    devengo: "2025-12-31",
    otrasRentas: "ninguna",
    familiaresConDerechoMinimo: "ninguno",
    discapacidad: "ninguna",
    reduccionesBase: "ninguna",
    saldosAnteriores: "ninguno",
    deducciones: "territoriales-por-hechos-y-da61",
    deduccionesTerritoriales2025: viuda,
    rentasExtranjeras: "ninguna",
    especialidades: "ninguna",
    perfil: "solo-trabajo",
    conciliacion: {
      ejercicio: 2025,
      estado: "totales-anuales-sin-duplicados",
      procedencia: ["certificado"],
    },
    trabajo: {
      ejercicio: 2025,
      territorio: "comun",
      reduccionesArt18: "ninguna",
      movilidad: "ninguna",
      discapacidadActiva: "ninguna",
      rendimientos: [
        {
          id: "r",
          clase: "empleo-laboral",
          integro: "30000",
          cotizaciones: {
            clase: "efectivas",
            seguridadSocial: "0",
            derechosPasivos: "0",
            colegiosHuerfanos: "0",
          },
          sindicato: { importe: "0", satisfecho: "no" },
          colegio: {
            importe: "0",
            satisfecho: "no",
            obligatorio: "no",
            finesEsenciales: "no",
          },
          defensa: {
            importe: "0",
            satisfecho: "no",
            litigioDirectoPagador: "no",
          },
        },
      ],
    },
    retenciones: [],
  } as const
  const r = Effect.runSync(liquidarIrpfAnualExplicito(caso))
  expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("150"))
})
it("B entrega 5000/3 a la anual sin sumar su presentación", () => {
  const s: Solicitud = {
    solicitudes: [
      {
        lote: "B",
        hechos: {
          codigo: "asturias_vivienda_protegida",
          vivienda: "v",
          calificacion: {
            referencia: "r",
            organismo: "o",
            fecha: "2025-01-01",
          },
          fechaAdquisicionRehabilitacion: "2025-01-01",
          destino: "habitual",
          pagos: [
            {
              id: "p",
              pagador: "A",
              receptor: "proveedor",
              fecha: "2025-01-01",
              euros: "10000",
              documento: "f",
              medio: "transferencia",
            },
          ],
          reparto: {
            titulares: ["A", "B", "C"],
            exhaustividadTitulares: "completa",
          },
        },
      },
    ],
  }
  const r = aplicar(s, {
    ...m("asturias"),
    cuotaAutonomica: new Decimal(2000),
  })
  expect(r.total).toEqual(racional("5000", "3"))
  expect(r.disponible).toEqual(racional("1000", "3"))
})
it("selección de contribuyente no atribuye pagos de otra persona", () => {
  const mm = m("asturias")
  expect(() =>
    aplicar(b, {
      ...mm,
      caso: {
        ...mm.caso,
        contribuyenteId: "B",
        situacionFamiliar: { ...mm.caso.situacionFamiliar, edad: 25 },
      },
    })
  ).toThrow()
})
it("edad y discapacidad propias contradictorias no generan derecho", () => {
  const s: Solicitud = {
    solicitudes: [
      {
        lote: "CLM",
        codigo: "clm_discapacidad_contribuyente",
        hechos: {
          persona: "A",
          nacimiento: "1985-01-01",
          grado: 65,
          elecciones: [],
        },
      },
    ],
  }
  expect(() => aplicar(s, m("castilla-la-mancha"))).toThrow(
    /Discapacidad contradictoria/
  )
  expect(() => aplicar(b, m("asturias"))).toThrow(/Edad contradictoria/)
})
