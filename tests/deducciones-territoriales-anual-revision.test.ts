import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect } from "effect"
import {
  aplicarDeduccionesTerritoriales2025 as aplicar,
  type MagnitudesTerritorialesAnuales as M,
  type SolicitudDeduccionesTerritoriales2025 as S,
} from "../lib/dominio/irpf/deducciones/anual-territorial"
import { liquidarIrpfAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"

const m = (territorio: M["caso"]["comunidadAutonoma"]): M => ({
  caso: {
    anio: 2025,
    comunidadAutonoma: territorio,
    contribuyenteId: "A",
    situacionFamiliar: {
      tipo: "individual",
      edad: 40,
      discapacidad: { _tag: "SinDiscapacidad" },
      descendientes: [],
      ascendientes: [],
    },
  },
  baseGeneral: new Decimal(20000),
  baseAhorro: new Decimal(0),
  minimoPersonalFamiliar: new Decimal(5550),
  cuotaAutonomica: new Decimal(10000),
  sujetosConMinimo: [],
  rentasTrabajoAnuales: {
    integroTrabajo: new Decimal(30000),
    restoRentas: new Decimal(0),
  },
})
// Oráculo independiente: multiplicación cruzada, sin usar racional() del producto.
function importe(s: S, mm: M, n: bigint, d = 1n) {
  const r = aplicar(s, mm)
  expect(BigInt(r.total.numeradorEuros) * d).toBe(n * BigInt(r.total.divisor))
  return r
}
const pago = {
  id: "p",
  fecha: "2025-06-01",
  pagador: "A",
  perceptor: "medico",
  factura: "f",
  importe: "10000",
  ayudasExentas: "0",
  reembolsos: "0",
  medio: "transferencia" as const,
}
const enfermedad = (nacimiento = "1985-01-01", discapacidad = 0): S => ({
  solicitudes: [
    {
      lote: "C",
      codigo: "canarias_gasto_enfermedad",
      hechos: {
        nacimiento,
        discapacidad,
        pacientesMinimo: [],
        gastos: [
          {
            ...pago,
            paciente: "A",
            concepto: "dental",
            profesional: "medico",
            colegiacion: "c",
          },
        ],
      },
    },
  ],
})
it("C Canarias: control sano, límite 500", () => {
  importe(enfermedad(), m("canarias"), 500n)
})
it("H1 C Canarias: nacimiento propio contradictorio debe rechazarse (500 -> 600)", () => {
  const s = enfermedad("1940-01-01")
  expect(() => aplicar(s, m("canarias"))).toThrow()
})
it("H1 C Canarias: discapacidad propia contradictoria debe rechazarse (500 -> 600)", () => {
  const s = enfermedad("1985-01-01", 65)
  expect(() => aplicar(s, m("canarias"))).toThrow()
})
const trabajo: S = {
  solicitudes: [
    {
      lote: "EXT",
      codigo: "extremadura_trabajo_dependiente",
      hechos: {
        exhaustividad: "todos_los_declarantes",
        personas: [
          {
            id: "A",
            integroTrabajo: "10000",
            restoRentas: "0",
            eleccion: "trabajo",
          },
        ],
      },
    },
  ],
}
const caso = (territorio: M["caso"]["comunidadAutonoma"]): CasoFiscalAnual => ({
  ...m(territorio).caso,
  anio: 2025,
  situacionFamiliar: m(territorio).caso.situacionFamiliar,
  rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 0,
  pagosACuentaCentimos: 0,
})
it("H2 API: ingresos EXT contradictorios con los 30000 de trabajo anual no deben dar 75", () => {
  const c = caso("extremadura")
  const sin = Effect.runSync(liquidarIrpfAnual(c, { modo: "canonico" }))
  const con = Effect.runSync(
    liquidarIrpfAnual(
      { ...c, deduccionesTerritoriales2025: trabajo },
      { modo: "canonico" }
    )
  )
  expect(con.cuotaLiquidaCentimos).toBe(sin.cuotaLiquidaCentimos)
})
const adopcion: S = {
  solicitudes: [
    {
      lote: "CYL",
      codigo: "cyl_gastos_adopcion",
      hechos: {
        exhaustividad: "todas_las_adopciones",
        adopciones: [
          {
            hijo: "fantasma",
            clase: "nacional",
            titularesMinimo: ["A"],
            fechaResolucion: "2025-01-01",
            fechaInscripcion: "2025-01-02",
            ayudaAnalogica: "no_solicitada",
          },
        ],
      },
    },
  ],
}
it("H3 CYL: mínimo de adoptado inexistente debe rechazarse", () => {
  expect(() => aplicar(adopcion, m("castilla-y-leon"))).toThrow()
})
it("H3 API CYL: no atribuir 784 sin ningún descendiente anual", () => {
  const c = caso("castilla-y-leon")
  const rechazo = Effect.runSync(
    Effect.flip(
      liquidarIrpfAnual(
        { ...c, deduccionesTerritoriales2025: adopcion },
        { modo: "canonico" }
      )
    )
  )
  expect(rechazo._tag).toBe("ResultadoNoSoportado")
  expect(rechazo.motivo).toMatch(/mínimo anual/)
})
it("A Catalunya: viudedad 150 y cuota fraccionaria 20.079", () => {
  const s: S = {
    solicitudes: [
      {
        lote: "A",
        hechos: {
          codigo: "cataluna_viudedad_2023_2024_2025",
          viudedad: {
            fecha: "2025-01-01",
            certificado: "c",
            descendientes: [],
          },
        },
      },
    ],
  }
  importe(s, m("catalunya"), 150n)
  importe(
    s,
    { ...m("catalunya"), cuotaAutonomica: new Decimal("20.079") },
    20079n,
    1000n
  )
})
it("B Asturias: vivienda protegida, reparto exacto 5000/3", () => {
  importe(
    {
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
                receptor: "R",
                fecha: "2025-01-01",
                euros: "10000",
                documento: "d",
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
    },
    m("asturias"),
    5000n,
    3n
  )
})
it("C Balears: tercer sector 25% de 1.01 conserva 0.2525", () => {
  importe(
    {
      solicitudes: [
        {
          lote: "C",
          codigo: "balears_entidades_tercer_sector",
          hechos: {
            donaciones: [
              {
                entidad: "E",
                registro: "r",
                regimen: "ley49_art2_3",
                certificado: "c",
                pago: { ...pago, perceptor: "E", importe: "1.01" },
              },
            ],
          },
        },
      ],
    },
    m("illes-balears"),
    2525n,
    10000n
  )
})
it("D CLM: discapacidad propia 300 sin presentación", () => {
  const mm = m("castilla-la-mancha")
  importe(
    {
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
    },
    {
      ...mm,
      caso: {
        ...mm.caso,
        situacionFamiliar: {
          ...mm.caso.situacionFamiliar,
          discapacidad: { _tag: "Discapacidad65OMas" },
        },
      },
    },
    300n
  )
})
it("E Rioja: bici 15% de 1.01 = 0.1515", () => {
  importe(
    {
      solicitudes: [
        {
          lote: "E",
          hechos: {
            codigo: "rioja_bicicletas_pedaleo_no_asistido",
            coleccion: "exhaustiva_2025",
            creditoFiscalMecenazgoRioja: "no_aplicado",
            regimen: "privativo",
            conyuges: [],
            bicicletas: [
              {
                id: "b",
                asistencia: "no",
                pago: {
                  id: "p",
                  pagador: "A",
                  receptor: "R",
                  fecha: "2025-06-01",
                  importe: "1.01",
                  factura: "f",
                },
              },
            ],
          },
        },
      ],
    },
    m("la-rioja"),
    1515n,
    10000n
  )
})
it("E Galicia: tecnología 30% de 200 = 60", () => {
  importe(
    {
      solicitudes: [
        {
          lote: "E",
          hechos: {
            codigo: "galicia_nuevas_tecnologias_hogares",
            coleccion: "exhaustiva_2025",
            creditoFiscalMecenazgoRioja: "no_aplicado",
            contratos: [
              {
                id: "c",
                titular: "A",
                alta: "2025-01-01",
                velocidad: "alta",
                uso: "hogar_exclusivo",
                contratoAnterior: null,
                lineasAnterioresSimultaneas: [],
                pagos: [
                  {
                    id: "p",
                    pagador: "A",
                    receptor: "R",
                    fecha: "2025-06-01",
                    importe: "200",
                    factura: "f",
                    concepto: "cuota",
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    m("galicia"),
    60n
  )
})

it("H4 C: base anual a 70 decimales superior a 46455 no debe redondearse al umbral", () => {
  const mm = m("canarias")
  const A = Decimal.clone({ precision: 80 })
  importe(
    enfermedad(),
    { ...mm, baseGeneral: new A("46455." + "0".repeat(69) + "1") },
    150n
  )
})
it("H3 C: paciente familiar sin mínimo anual no puede justificarse con expediente", () => {
  const s: S = {
    solicitudes: [
      {
        lote: "C",
        codigo: "canarias_gasto_enfermedad",
        hechos: {
          nacimiento: "1985-01-01",
          discapacidad: 0,
          pacientesMinimo: [{ persona: "fantasma", expediente: "referencia" }],
          gastos: [
            {
              ...pago,
              paciente: "fantasma",
              concepto: "dental",
              profesional: "medico",
              colegiacion: "c",
            },
          ],
        },
      },
    ],
  }
  expect(() => aplicar(s, m("canarias"))).toThrow()
})
it("B Cantabria: sanitario 10%, máximo individual 500", () => {
  importe(
    {
      solicitudes: [
        {
          lote: "B",
          hechos: {
            codigo: "cantabria_gastos_enfermedad",
            personasMinimo: [],
            discapacidades: [],
            gastos: [
              {
                id: "p",
                fecha: "2025-01-01",
                pagador: "A",
                receptor: "R",
                euros: "10000",
                documento: "f",
                medio: "transferencia",
                paciente: "A",
                concepto: "dental",
                honorarios: "profesional_sanitario",
                coberturaSSMutuaSeguro: "0",
              },
            ],
          },
        },
      ],
    },
    m("cantabria"),
    500n
  )
})
it("F Madrid: adopción internacional individual 721.70", () => {
  importe(
    {
      solicitudes: [
        {
          lote: "F",
          codigo: "madrid_adopcion_internacional",
          hechos: {
            eventos: [
              {
                hijo: "H",
                fecha: "2025-01-01",
                tipo: "adopcion_internacional",
                soporte: "resolucion",
                normaConvenioAplicable: "convenio",
                progenitoresConvivientesConDerecho: ["A"],
              },
            ],
          },
        },
      ],
    },
    m("madrid"),
    7217n,
    10n
  )
})
it("F Murcia: deporte exacto 30% de 1.01", () => {
  importe(
    {
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
    },
    m("murcia"),
    303n,
    1000n
  )
})
it("D: rechazo explícito del tercio acorde al alcance, sin fingir exactitud decimal", () => {
  const s: S = {
    solicitudes: [
      {
        lote: "CYL",
        codigo: "cyl_familia_numerosa",
        hechos: {
          titulares: ["A", "B", "C"],
          descendientes: ["H"],
          conyuge: null,
          discapacidad65: [],
          tituloInicio: "2025-01-01",
          tituloFin: "2025-12-31",
          residenciaConyuge: "fuera",
        },
      },
    ],
  }
  expect(() => aplicar(s, m("castilla-y-leon"))).toThrow(/divisor no finito/)
})
it("D EXT control: ingresos declarados superiores a 12000 generan cero", () => {
  importe(
    {
      solicitudes: [
        {
          lote: "EXT",
          codigo: "extremadura_trabajo_dependiente",
          hechos: {
            exhaustividad: "todos_los_declarantes",
            personas: [
              {
                id: "A",
                integroTrabajo: "30000",
                restoRentas: "0",
                eleccion: "trabajo",
              },
            ],
          },
        },
      ],
    },
    m("extremadura"),
    0n
  )
})

it("E Rioja: fracción 30% de 1.01 entre tres = 101/1000 exactos", () => {
  importe(
    {
      solicitudes: [
        {
          lote: "E",
          hechos: {
            codigo: "rioja_ejercicio_fisico_deporte",
            coleccion: "exhaustiva_2025",
            creditoFiscalMecenazgoRioja: "no_aplicado",
            beneficiario: {
              id: "A",
              nacimiento: "1985-01-01",
              discapacidad: 0,
            },
            relacion: "contribuyente",
            beneficiariosDelEjercicio: ["A"],
            titularesMinimo: [],
            titularesDeduccion: ["A", "B", "C"],
            diagnosticoEla: null,
            pagos: [
              {
                id: "p",
                pagador: "A",
                receptor: "R",
                fecha: "2025-08-01",
                importe: "1.01",
                factura: "f",
                facturaTipo: "ordinaria",
                concepto: "clases_deporte",
                territorio: "la-rioja",
                origenServicio: "2025-08-01",
              },
            ],
          },
        },
      ],
    },
    m("la-rioja"),
    101n,
    1000n
  )
})

it("H2 usa el rendimiento anual aunque el duplicado diga lo contrario", () => {
  const solicitud: S = {
    solicitudes: [
      {
        lote: "EXT",
        codigo: "extremadura_trabajo_dependiente",
        hechos: {
          exhaustividad: "todos_los_declarantes",
          personas: [
            {
              id: "A",
              integroTrabajo: "30000",
              restoRentas: "999",
              eleccion: "trabajo",
            },
          ],
        },
      },
    ],
  }
  const anual = {
    ...m("extremadura"),
    rentasTrabajoAnuales: {
      integroTrabajo: new Decimal(10000),
      restoRentas: new Decimal(300),
    },
  }
  importe(solicitud, anual, 75n)
  importe(
    solicitud,
    {
      ...anual,
      rentasTrabajoAnuales: {
        ...anual.rentasTrabajoAnuales,
        restoRentas: new Decimal("300.01"),
      },
    },
    0n
  )
  expect(() =>
    aplicar(solicitud, { ...anual, rentasTrabajoAnuales: undefined })
  ).toThrow(/rentas.*anual/i)
})
const familia = (sujetosConMinimo: readonly string[] = ["H"]): M => ({
  ...m("castilla-y-leon"),
  sujetosConMinimo,
  atribucionesMinimo: sujetosConMinimo.map((sujetoId) => ({
    sujetoId,
    titulares: ["A"],
  })),
  caso: {
    ...m("castilla-y-leon").caso,
    derechosMinimos: {
      ejercicio: 2025,
      territorio: "castilla-y-leon",
      regimen: "comun",
      modalidad: "individual",
      devengo: "2025-12-31",
      contribuyenteId: "A",
      edadContribuyenteDevengo: 40,
      discapacidadContribuyente: { _tag: "SinDiscapacidad" },
      ascendientes: "ninguno",
      fallecimientosEnElEjercicio: "ninguno",
      descendientesCompletos: true,
      conciliacionRentasContribuyente: {
        perfil: "caso-anual-parcial",
        otrasRentasOGastosNoRepresentados: "ninguno",
      },
      descendientes: [
        {
          sujetoId: "H",
          edadDevengo: 2,
          fechaNacimiento: "2023-01-01",
          vivoAlDevengo: true,
          rentasNoExentasCentimos: 0,
          declaracion: { modalidad: "no-presenta" },
          discapacidad: { _tag: "SinDiscapacidad" },
          titularesCompletos: true,
          titulares: [
            {
              titularId: "A",
              grado: 1,
              vinculo: {
                clase: "adopcion",
                fechaConstitucionVinculo: "2025-01-01",
                fechaInicioIncremento: "2025-01-02",
                fundamento: "inscripcion-registro-civil",
                historialCompleto: true,
              },
              relacion: "convivencia",
              custodia: "exclusiva",
              alimentosJudiciales: false,
              aplicaEspecialidadAlimentos: false,
              residenteIrpf: true,
              rentasNoExentasCentimos: 2800000,
            },
          ],
        },
      ],
    },
  },
})
const adopcionDe = (hijo: string, titularesMinimo: readonly string[]): S => ({
  solicitudes: [
    {
      lote: "CYL",
      codigo: "cyl_gastos_adopcion",
      hechos: {
        exhaustividad: "todas_las_adopciones",
        adopciones: [
          {
            hijo,
            clase: "nacional",
            titularesMinimo,
            fechaResolucion: "2025-01-01",
            fechaInscripcion: "2025-01-02",
            ayudaAnalogica: "no_solicitada",
          },
        ],
      },
    },
  ],
})
it("H3 conserva la adopción con mínimo efectivo y rechaza el mero censo", () => {
  importe(adopcionDe("H", ["A"]), familia(), 784n)
  expect(() => aplicar(adopcionDe("H", ["A"]), familia([]))).toThrow(
    /mínimo anual/
  )
  expect(() => aplicar(adopcionDe("H", ["B"]), familia())).toThrow(/Titular/)
})
it("H3 el mínimo de un hijo no acredita el derecho de otro paciente", () => {
  const mm = familia()
  const canarias: M = {
    ...mm,
    caso: {
      ...mm.caso,
      comunidadAutonoma: "canarias",
      derechosMinimos: undefined,
    },
  }
  const solicitud = (persona: string): S => ({
    solicitudes: [
      {
        lote: "C",
        codigo: "canarias_gasto_enfermedad",
        hechos: {
          nacimiento: "1985-01-01",
          discapacidad: 0,
          pacientesMinimo: [{ persona, expediente: "referencia" }],
          gastos: [
            {
              ...pago,
              paciente: persona,
              concepto: "dental",
              profesional: "medico",
              colegiacion: "c",
            },
          ],
        },
      },
    ],
  })
  importe(solicitud("H"), canarias, 500n)
  expect(() => aplicar(solicitud("OTRO"), canarias)).toThrow(/mínimo anual/)
})
it("H4 conserva también el último decimal admitido en la base anual", () => {
  const Exacto = Decimal.clone({ precision: 110 })
  importe(
    enfermedad(),
    {
      ...m("canarias"),
      baseGeneral: new Exacto("46455." + "0".repeat(79) + "1"),
    },
    150n
  )
})
