import { it, expect } from "vitest"
import {
  evaluarAmpliacionB2025 as B,
  resolverDependenciaAnualB as anualB,
} from "../lib/dominio/irpf/deducciones/asturias-cantabria-ampliacion-2025"
import {
  ast,
  can,
  doc,
  rep,
  pago,
  hijo,
  persona,
  vivienda,
  operacion,
  participaciones,
  donataria,
} from "./asturias-cantabria-ampliacion-fixtures"
function bEuros(x: ReturnType<typeof B>) {
  if (x.estado === "excluida") return 0
  if (x.estado !== "calculo_parcial") return null
  return (
    Number(x.importeExacto.numeradorEuros) / Number(x.importeExacto.divisor)
  )
}
const fallecimiento = (fecha: string) => ({
  codigo:
    "asturias_descendiente_fallecimiento_progenitor_accidente_laboral" as const,
  hijos: [
    {
      ...hijo(),
      progenitorFallecido: "B",
      fallecimiento: { ...doc, fecha },
      accidenteLaboral: { ...doc, fecha },
    },
  ],
})
it("B control fallecimiento anterior:1000", () =>
  expect(bEuros(B(ast, fallecimiento("2024-01-01")))).toBe(1000))
it("B-BLOQUEO fallecimiento2026 no genera1000 en2025", () =>
  expect(bEuros(B(ast, fallecimiento("2026-01-01"))) ?? 0).toBe(0))
const celiaquia = (fecha: string) => ({
  codigo: "asturias_enfermedad_celiaca" as const,
  personas: [
    {
      id: "A",
      persona: persona("A", "1990-01-01"),
      relacion: "propio" as const,
      reparto: rep,
      informe: { ...doc, fecha },
      fechaDiagnostico: fecha,
      diagnostico: "definitivo" as const,
      servicio: "SNS" as const,
      identificadorMedico: "MED",
      gastos: [pago("50")],
    },
  ],
})
it("B control celiaquia2025:100", () =>
  expect(bEuros(B(ast, celiaquia("2025-01-01")))).toBe(100))
it("B-BLOQUEO diagnostico2026 no genera100 en2025", () =>
  expect(bEuros(B(ast, celiaquia("2026-01-01"))) ?? 0).toBe(0))
it("B alquiler pagos propios900 y limite compartido750", () =>
  expect(
    bEuros(
      B(ast, {
        codigo: "asturias_arrendamiento_vivienda_habitual",
        inmueble: vivienda("33044", "alquiler"),
        titulares: { titulares: ["A", "B"], exhaustividad: "completa" },
        personas: [
          {
            id: "A",
            nacimiento: "1990-01-01",
            numerosa: null,
            monoparental: null,
            violenciaGenero: null,
            pagos: [pago("3000")],
          },
          {
            id: "B",
            nacimiento: "1990-01-01",
            numerosa: null,
            monoparental: null,
            violenciaGenero: null,
            pagos: [pago("100", "P2", "B")],
          },
        ],
      })
    )
  ).toBe(750))
it("B ayuda centro posterior al tope:500-499.99", () =>
  expect(
    bEuros(
      B(ast, {
        codigo: "asturias_centros_cero_tres",
        municipio: "33044",
        usos: [],
        hijos: [
          {
            ...hijo("H", "2023-01-01"),
            centro: doc,
            escolarizacion: { inicio: "2025-01-01", fin: "2025-12-31" },
            pagosFamilia: [pago("9000")],
            ayudaAsturias: "499.99",
          },
        ],
      })
    )
  ).toBe(0.01))
it("B ELA tipos10.5+7.25 sobre123.45", () =>
  expect(
    bEuros(
      anualB(
        ast,
        {
          clase: "ela_tipos_medios",
          contribuyente: "A",
          ayudaEnBaseLiquidable: { numeradorEuros: "2469", divisor: "20" },
          referencias: [
            "tipo_medio_estatal_2025",
            "tipo_medio_autonomico_2025",
          ],
          operacion: "importe_por_suma_tipos_dividida_100",
        },
        [
          {
            ejercicio: 2025,
            contribuyente: "A",
            liquidacion: "L",
            concepto: "tipo_medio_estatal_2025",
            valor: "10.5",
          },
          {
            ejercicio: 2025,
            contribuyente: "A",
            liquidacion: "L",
            concepto: "tipo_medio_autonomico_2025",
            valor: "7.25",
          },
        ]
      )
    )
  ).toBe(21.912375))
it("B cuota rural2499:499.8", () =>
  expect(
    bEuros(
      anualB(
        can,
        {
          clase: "residencia_rural_cuota",
          personas: ["A"],
          porcentaje: "20",
          maximoPorPersona: "500",
          referencia: "cuota_integra_autonomica_2025_por_contribuyente",
        },
        [
          {
            ejercicio: 2025,
            contribuyente: "A",
            liquidacion: "L",
            concepto: "cuota_integra_autonomica_2025",
            valor: "2499",
          },
        ]
      )
    )
  ).toBe(499.8))
it("B cuota rural2501:500", () =>
  expect(
    bEuros(
      anualB(
        can,
        {
          clase: "residencia_rural_cuota",
          personas: ["A"],
          porcentaje: "20",
          maximoPorPersona: "500",
          referencia: "cuota_integra_autonomica_2025_por_contribuyente",
        },
        [
          {
            ejercicio: 2025,
            contribuyente: "A",
            liquidacion: "L",
            concepto: "cuota_integra_autonomica_2025",
            valor: "2501",
          },
        ]
      )
    )
  ).toBe(500))
it("B magnitud ausente no inventa cero", () =>
  expect(
    anualB(
      can,
      {
        clase: "residencia_rural_cuota",
        personas: ["A"],
        porcentaje: "20",
        maximoPorPersona: "500",
        referencia: "cuota_integra_autonomica_2025_por_contribuyente",
      },
      []
    ).estado
  ).toBe("no_soportado"))

for (const porcentaje of ["40", "40.01"]) {
  it(`B participacion familiar${porcentaje}`, () => {
    const o = operacion()
    const participacion = participaciones().map((x) => ({
      ...x,
      personas: x.personas.map((p) => ({
        ...p,
        capital: porcentaje,
        votos: porcentaje,
      })),
    }))
    expect(
      bEuros(
        B(ast, {
          codigo: "asturias_inversion_entidades_nuevas_reciente_creacion",
          operaciones: [
            { ...o, participaciones: participacion, pagos: [pago("1000")] },
          ],
          usos: [],
        })
      )
    ).toBe(porcentaje === "40" ? 300 : 0)
  })
}
it("B donativos consumo estatal agota limite10%BL", () =>
  expect(
    bEuros(
      B(can, {
        codigo:
          "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad",
        baseLiquidable: "10000",
        baseEstatal68_3: "700",
        baseEstatal68_5: "300",
        usos: [],
        donaciones: [{ id: "D", entidad: donataria(), pagos: [pago("5000")] }],
      })
    )
  ).toBe(0))
it("B donativos saldo200:30", () =>
  expect(
    bEuros(
      B(can, {
        codigo:
          "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad",
        baseLiquidable: "10000",
        baseEstatal68_3: "700",
        baseEstatal68_5: "100",
        usos: [],
        donaciones: [{ id: "D", entidad: donataria(), pagos: [pago("5000")] }],
      })
    )
  ).toBe(30))
it("B guarderia pagos800/200 atribuye120/30", () => {
  const h = {
    codigo: "cantabria_gastos_guarderia" as const,
    municipio: "39003",
    usos: [],
    hijos: [
      {
        ...hijo("H", "2023-01-01"),
        titulares: ["A", "B"],
        centro: doc,
        pagosFamilia: [pago("800"), pago("200", "P2", "B")],
      },
    ],
  }
  expect(bEuros(B(can, h))).toBe(120)
  expect(bEuros(B({ ...can, contribuyente: "B", declarantes: ["B"] }, h))).toBe(
    30
  )
})
