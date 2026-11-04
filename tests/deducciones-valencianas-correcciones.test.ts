import { expect, it } from "vitest"
import {
  evaluarDeduccionValenciana2025,
  type HechosValencianos2025,
} from "../lib/dominio/irpf/deducciones/valenciana-2025"
import { evaluarCuotaValenciana2025 } from "../lib/dominio/irpf/deducciones/valenciana-2025/cuota"
import {
  evaluarDeduccion,
  totalDeduccionesEvaluadas,
  type ContextoDeduccion,
  type SolicitudDeduccion,
} from "../lib/dominio/irpf/deducciones/contratos-2025"

// Casos rojos de revisión independiente H1–H3, conservando sus expectativas.
const hallazgos: readonly {
  nombre: string
  entrada: HechosValencianos2025
  esperado: { estado?: string; importe?: number }
}[] = [
  {
    nombre: "H1-deporte-reparto-doble",
    entrada: {
      codigo: "valenciana_deporte_actividades_saludables",
      ejercicio: 2025,
      territorio: "comunitat-valenciana",
      contribuyente: "A",
      declarantes: ["A"],
      modalidad: "individual",
      devengo: "2025-12-31",
      liquidableGeneral: 12000,
      liquidableAhorro: 0,
      imponibleGeneral: 12000,
      imponibleAhorro: 0,
      unidades: [
        {
          id: "hijo",
          titulares: ["A", "B"],
          fecha: "2025-01-01",
          numeros: {
            gasto: 200,
            ayudas: 0,
            reembolsos: 0,
            edad: 50,
            grado: 0,
          },
          textos: {},
        },
      ],
    },
    esperado: {
      importe: 30,
    },
  },
  {
    nombre: "H2-fertilidad-mixta",
    entrada: {
      codigo: "valenciana_tratamientos_fertilidad",
      ejercicio: 2025,
      territorio: "comunitat-valenciana",
      contribuyente: "A",
      declarantes: ["A", "B"],
      modalidad: "conjunta",
      devengo: "2025-12-31",
      liquidableGeneral: 12000,
      liquidableAhorro: 0,
      imponibleGeneral: 12000,
      imponibleAhorro: 0,
      unidades: [
        {
          id: "A",
          titulares: ["A"],
          fecha: "2025-01-01",
          numeros: {
            edad: 45,
            gastoTratamiento: 500,
          },
          textos: {
            clinicaAutorizada: "reg",
          },
        },
        {
          id: "B",
          titulares: ["B"],
          fecha: "2025-01-01",
          numeros: {
            edad: 46,
            gastoTratamiento: 500,
          },
          textos: {
            clinicaAutorizada: "reg",
          },
        },
      ],
    },
    esperado: {
      estado: "calculo_parcial",
      importe: 100,
    },
  },
  {
    nombre: "H3-comodato-366dias",
    entrada: {
      codigo:
        "valenciana_donaciones_cesiones_fines_culturales_cientificos_deportivos",
      ejercicio: 2025,
      territorio: "comunitat-valenciana",
      contribuyente: "A",
      declarantes: ["A"],
      modalidad: "individual",
      devengo: "2025-12-31",
      liquidableGeneral: 12000,
      liquidableAhorro: 0,
      imponibleGeneral: 12000,
      imponibleAhorro: 0,
      unidades: [
        {
          id: "A",
          titulares: ["A"],
          fecha: "2025-01-01",
          numeros: {
            valorCatastral: 36500,
            diasComodato: 366,
          },
          textos: {
            clase: "comodato_inmueble",
            deduccionEstatal683a: "no",
          },
        },
      ],
    },
    esperado: {
      estado: "no_soportado",
    },
  },
]
it.each(hallazgos)("corrige $nombre", ({ entrada, esperado }) => {
  expect(evaluarDeduccionValenciana2025(entrada)).toMatchObject(esperado)
})
const comodato = hallazgos[2]!.entrada
it.each([0.5, 365.5, 366])(
  "rechaza días de comodato incompatibles: %s",
  (dias) => {
    const entrada = {
      ...comodato,
      unidades: comodato.unidades.map((u) => ({
        ...u,
        numeros: { ...u.numeros, diasComodato: dias },
      })),
    }
    expect(evaluarDeduccionValenciana2025(entrada)).toMatchObject({
      estado: "no_soportado",
    })
  }
)
it.each([
  ["2025-12-31", 365, 365],
  ["2025-06-30", 181, 181],
] as const)("comodato: límite del período %s", (devengo, dias, importe) => {
  const entrada = {
    ...comodato,
    devengo,
    unidades: comodato.unidades.map((u) => ({
      ...u,
      numeros: { ...u.numeros, diasComodato: dias },
    })),
  }
  expect(evaluarDeduccionValenciana2025(entrada)).toMatchObject({
    estado: "calculo_parcial",
    importe,
  })
  expect(
    evaluarDeduccionValenciana2025({
      ...entrada,
      unidades: entrada.unidades.map((u) => ({
        ...u,
        numeros: { ...u.numeros, diasComodato: dias + 1 },
      })),
    })
  ).toMatchObject({ estado: "no_soportado" })
})
const renovables: HechosValencianos2025 = {
  ...comodato,
  codigo: "valenciana_autoconsumo_renovables",
  unidades: [
    {
      id: "vivienda",
      titulares: ["A"],
      fecha: "2025-01-01",
      numeros: {
        gasto: 2000,
        ayudas: 0,
        reembolsos: 0,
        fraccionPagadaVivienda: 1,
      },
      textos: { vivienda: "habitual" },
    },
  ],
}
it("O1: conserva requisitos de generación en la aplicación a cuota", () => {
  const generado = evaluarDeduccionValenciana2025(renovables)
  const aplicado = evaluarCuotaValenciana2025({
    hechos: renovables,
    cuotaDisponible: 100,
    referenciaCuota: "sintetico:cuota",
    arrastres: [],
  })
  expect(aplicado.resultado).toMatchObject({
    estado: "calculo_parcial",
    importe: 100,
  })
  expect(aplicado.resultado.motivo).toContain(generado.motivo)
  expect(aplicado.resultado.motivo).toContain("CTE")
})
const hechos = hallazgos[0]!.entrada
const contexto: ContextoDeduccion = {
  ejercicio: 2025,
  territorio: "comunitat-valenciana",
  contribuyente: "A",
  modalidad: "individual",
  declarantes: ["A"],
}
const solicitud: SolicitudDeduccion = {
  tipo: "valenciana_hechos",
  contexto,
  hechos,
}
it("entrada común conserva resultado parcial y no permite sumarlo", () => {
  expect(evaluarDeduccion(solicitud)).toEqual(
    evaluarDeduccionValenciana2025(hechos)
  )
  expect(totalDeduccionesEvaluadas(contexto, [solicitud])).toMatchObject({
    estado: "no_soportado",
  })
})
it.each([
  { ejercicio: 2024 },
  { territorio: "madrid" },
  { contribuyente: "B" },
  { modalidad: "conjunta" },
  { declarantes: ["B"] },
] satisfies readonly Partial<ContextoDeduccion>[])(
  "rechaza hechos ajenos: %j",
  (cambio) => {
    expect(
      evaluarDeduccion({ ...solicitud, contexto: { ...contexto, ...cambio } })
    ).toMatchObject({ estado: "no_soportado" })
  }
)
it("detecta duplicados de hechos y consignación por código en ambos órdenes", () => {
  const externa: SolicitudDeduccion = {
    tipo: "consignacion",
    contexto,
    entrada: {
      ...contexto,
      codigo: hechos.codigo,
      importe: 30,
      soporte: "sintetico:dictamen",
    },
  }
  for (const solicitudes of [
    [solicitud, externa],
    [externa, solicitud],
  ])
    expect(totalDeduccionesEvaluadas(contexto, solicitudes)).toMatchObject({
      estado: "no_soportado",
      motivo: expect.stringContaining("duplicada"),
    })
})
