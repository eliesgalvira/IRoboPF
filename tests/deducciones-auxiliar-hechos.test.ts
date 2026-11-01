import { describe, expect, it } from "vitest"
import {
  calcularDeduccionesAutonomicasAplicadas as calcular,
  calcularDeduccionesConsignadas,
} from "../lib/dominio/irpf/deducciones-autonomicas-aplicadas"
import {
  CODIGOS_AUXILIAR_CON_HECHOS,
  evaluarHechosAuxiliar2025,
  type HechosDeduccionAuxiliar,
} from "../lib/dominio/irpf/deducciones/hechos-auxiliar-2025"
import { totalDeduccionesEvaluadas } from "../lib/dominio/irpf/deducciones/contratos-2025"

const marco = (
  territorio: string,
  modalidad: "individual" | "conjunta" = "individual"
) => ({
  contexto: { ejercicio: 2025, territorio, contribuyente: "a", modalidad },
  declarantes: modalidad === "individual" ? ["a"] : ["a", "b"],
  elegibilidadExterna: true,
})
const historia = (desde = 2025) =>
  Array.from({ length: 2026 - desde }, (_, i) => ({
    ejercicio: desde + i,
    general: 20000,
    ahorro: 0,
    basesUnidadFamiliar: [20000],
  }))
const gasto = (hijo: string, custodia = 5000, ayudas = 0) => ({
  hijo,
  custodia,
  ayudas,
  alimentacion: 0,
  vestuarioEscolar: 0,
  titulares: ["a"],
})
const casos: readonly (readonly [HechosDeduccionAuxiliar, number])[] = [
  [
    {
      ...marco("cantabria", "conjunta"),
      codigo: "cantabria_arrendamiento_jovenes_mayores_discapacidad",
      gastoElegible: 6000,
    },
    600,
  ],
  [
    {
      ...marco("cantabria"),
      codigo: "cantabria_nacimiento_adopcion_hijos",
      hijos: [{ hijo: "h", ejercicio: 2025, progenitores: ["a", "b"] }],
    },
    700,
  ],
  [
    {
      ...marco("canarias"),
      codigo: "canarias_nacimiento_adopcion_hijos",
      hijos: [{ id: "h", ejercicio: 2025, orden: 3, ordenDiscapacidad: 1 }],
      titulares: ["a"],
      renta: 20000,
    },
    1130,
  ],
  [
    {
      ...marco("canarias"),
      codigo: "canarias_familia_numerosa",
      categoria: "general",
      discapacidad65: false,
      titulares: ["a", "b"],
    },
    298.5,
  ],
  [
    {
      ...marco("canarias", "conjunta"),
      codigo: "canarias_discapacidad_mayores_65",
      personas: [
        { id: "a", edad: 40, discapacidad: 33 },
        { id: "b", edad: 42, discapacidad: 33 },
      ],
      renta: 20000,
    },
    800,
  ],
  [
    {
      ...marco("canarias", "conjunta"),
      codigo: "canarias_contribuyentes_desempleados",
      personas: ["a", "b"].map((id) => ({
        id,
        mesesDesempleoLegal: 8,
        percibePrestacion: true,
        rendimientosTrabajo: 9000,
      })),
      otrasBases: 0,
    },
    240,
  ],
  [
    {
      ...marco("illes-balears"),
      codigo: "balears_gastos_mayores_65_discapacidad",
      personas: ["p1", "p2"].map((id) => ({
        id,
        relacion: "ascendiente",
        gastoElegible: 2000,
        ayudas: 0,
        titulares: ["a"],
      })),
      baseImponible: 20000,
    },
    1320,
  ],
  [
    {
      ...marco("madrid"),
      codigo: "madrid_nacimiento_adopcion_hijos",
      eventos: [
        {
          ejercicio: 2025,
          hijos: ["h1", "h2"],
          progenitoresConvivientes: ["a"],
        },
      ],
      historia: historia(),
    },
    2886.8,
  ],
  [
    {
      ...marco("murcia"),
      codigo: "murcia_gastos_guarderia",
      gastos: [gasto("h1"), gasto("h2")],
      baseImponible: 30000,
    },
    2000,
  ],
]
function importe(h: HechosDeduccionAuxiliar): number {
  return calcular({}, h.contexto, [h])
}
describe("auxiliar con hechos explícitos, siempre parcial", () => {
  it.each(casos)("%j => %s", (h, esperado) => {
    expect(importe(h)).toBe(esperado)
    expect(evaluarHechosAuxiliar2025(h)).toMatchObject({
      estado: "calculo_parcial",
      aceptacionFiscal: "pendiente",
      importe: esperado,
    })
    expect(() =>
      calcular({ [h.codigo + ":cumple"]: true }, h.contexto)
    ).toThrow("Hechos insuficientes para deducción: " + h.codigo)
    expect(() =>
      calcular({ [h.codigo + ":importe"]: esperado }, h.contexto, [h])
    ).toThrow("Importe manual incompatible")
    expect(
      calcularDeduccionesConsignadas(
        { [h.codigo + ":cumple"]: true, [h.codigo + ":importe"]: esperado },
        h.contexto
      )
    ).toBe(esperado)
    expect(() => calcular({}, h.contexto, [h, h])).toThrow("duplicados")
    expect(() =>
      calcular({}, { ...h.contexto, territorio: "galicia" }, [h])
    ).toThrow("otro ámbito")
    expect(() =>
      calcular({}, { ...h.contexto, ejercicio: 2026 }, [h])
    ).toThrow()
  })
  it("cubre los nueve códigos y rechaza los aliases heredados activos", () => {
    expect(casos.map(([h]) => h.codigo)).toEqual([
      ...CODIGOS_AUXILIAR_CON_HECHOS,
    ])
    for (const clave of [
      "canariasHijosNacimientoAdopcion",
      "canariasContribuyenteDiscapacidad33",
      "canariasContribuyenteMayor65",
      "canariasDesempleadoCumpleRequisitos",
      "canariasCategoriaFamiliaNumerosa",
      "madridHijosNacimientoAdopcion",
    ]) {
      const territorio = clave.startsWith("madrid") ? "madrid" : "canarias"
      const valor = clave.includes("Categoria") ? "general" : 1
      expect(() =>
        calcular({ [clave]: valor }, { ejercicio: 2025, territorio })
      ).toThrow("Hechos insuficientes")
    }
  })
  it("no duplica el derivado con contadores y base heredados", () => {
    for (const [h, esperado] of casos)
      expect(
        calcular(
          {
            [h.codigo + ":cumple"]: true,
            [h.codigo + ":base"]: 10000,
            [h.codigo + ":unidades"]: 2,
          },
          h.contexto,
          [h]
        )
      ).toBe(esperado)
  })
  it("Cantabria: topes individual/conjunta y ventana 2024-2025", () => {
    for (const gastoElegible of [2999, 3000, 3001, 5999, 6000, 6001])
      for (const modalidad of ["individual", "conjunta"] as const)
        expect(
          importe({
            ...marco("cantabria", modalidad),
            codigo: "cantabria_arrendamiento_jovenes_mayores_discapacidad",
            gastoElegible,
          })
        ).toBe(
          Math.min(gastoElegible / 10, modalidad === "individual" ? 300 : 600)
        )
    for (const ejercicio of [2023, 2024, 2025, 2026])
      expect(
        importe({
          ...marco("cantabria"),
          codigo: "cantabria_nacimiento_adopcion_hijos",
          hijos: [{ hijo: "h", ejercicio, progenitores: ["a", "b"] }],
        })
      ).toBe([2024, 2025].includes(ejercicio) ? 700 : 0)
  })
  it("Canarias: órdenes independientes, reparto y renta", () => {
    for (const [orden, ordenDiscapacidad, esperado] of [
      [1, 1, 865],
      [3, 1, 1130],
      [4, 1, 1396],
      [4, 3, 1896],
      [5, 3, 2028],
    ]) {
      expect(
        importe({
          ...marco("canarias"),
          codigo: "canarias_nacimiento_adopcion_hijos",
          hijos: [{ id: "h", ejercicio: 2025, orden, ordenDiscapacidad }],
          renta: 46455,
          titulares: ["a"],
        })
      ).toBe(esperado)
    }
    expect(
      importe({
        ...marco("canarias"),
        codigo: "canarias_familia_numerosa",
        categoria: "especial",
        discapacidad65: false,
        titulares: ["a", "b"],
      })
    ).toBe(398)
    expect(
      importe({
        ...marco("canarias", "conjunta"),
        codigo: "canarias_familia_numerosa",
        categoria: "general",
        discapacidad65: false,
        titulares: ["a", "b"],
      })
    ).toBe(597)
    for (const discapacidad of [32.99, 33, 64.99, 65])
      expect(
        importe({
          ...marco("canarias"),
          codigo: "canarias_discapacidad_mayores_65",
          personas: [{ id: "a", edad: 66, discapacidad }],
          renta: 46455,
        })
      ).toBe((discapacidad >= 33 ? 400 : 0) + 160)
  })
  it("desempleo: intervalo sobre sumatorio, seis meses y otras bases", () => {
    for (const [trabajo, esperado] of [
      [15876, 0],
      [15876.01, 240],
      [22000, 240],
      [22000.01, 0],
    ]) {
      const h: HechosDeduccionAuxiliar = {
        ...marco("canarias", "conjunta"),
        codigo: "canarias_contribuyentes_desempleados",
        personas: ["a", "b"].map((id) => ({
          id,
          mesesDesempleoLegal: 8,
          percibePrestacion: true,
          rendimientosTrabajo: trabajo / 2,
        })),
        otrasBases: 1600,
      }
      expect(importe(h)).toBe(esperado)
      expect(importe({ ...h, otrasBases: 1600.01 })).toBe(0)
      expect(
        importe({
          ...h,
          personas: h.personas.map((p) => ({ ...p, mesesDesempleoLegal: 6 })),
        })
      ).toBe(0)
    }
  })
  it("Baleares: límite por persona, ayudas y reparto distinto por parentesco", () => {
    for (const relacion of ["ascendiente", "descendiente"] as const)
      for (const [gastoElegible, esperado] of [
        [1000, 800],
        [2000, 1320],
      ])
        expect(
          importe({
            ...marco("illes-balears"),
            codigo: "balears_gastos_mayores_65_discapacidad",
            personas: ["p1", "p2"].map((id) => ({
              id,
              relacion,
              gastoElegible,
              ayudas: 0,
              titulares: ["a", "b"],
            })),
            baseImponible: 33000,
          })
        ).toBe(relacion === "ascendiente" ? esperado : esperado / 2)
  })
  it("Madrid distingue partos separados, años, titulares y duplicados", () => {
    for (const [ejercicio, esperado] of [
      [2024, 1443.4],
      [2025, 2886.8],
    ]) {
      const h: HechosDeduccionAuxiliar = {
        ...marco("madrid"),
        codigo: "madrid_nacimiento_adopcion_hijos",
        eventos: [
          { ejercicio, hijos: ["h1", "h2"], progenitoresConvivientes: ["a"] },
        ],
        historia: historia(ejercicio),
      }
      expect(importe(h)).toBe(esperado)
      expect(() =>
        importe({ ...h, eventos: [...h.eventos, ...h.eventos] })
      ).toThrow("Hechos insuficientes")
    }
    expect(
      importe({
        ...marco("madrid"),
        codigo: "madrid_nacimiento_adopcion_hijos",
        eventos: ["h1", "h2"].map((hijo) => ({
          ejercicio: 2025,
          hijos: [hijo],
          progenitoresConvivientes: ["a"],
        })),
        historia: historia(),
      })
    ).toBe(1443.4)
  })
  it("Murcia: un menor, ayuda, prorrateo, céntimos y límites", () => {
    for (const [custodia, ayudas, esperado] of [
      [10000, 0, 1000],
      [5000, 1000, 800],
      [1000.05, 0, 200.01],
      [1000, 2000, 0],
    ]) {
      const h: HechosDeduccionAuxiliar = {
        ...marco("murcia"),
        codigo: "murcia_gastos_guarderia",
        gastos: [gasto("h", custodia, ayudas)],
        baseImponible: 30000,
      }
      expect(importe(h)).toBe(esperado)
      expect(importe({ ...h, baseImponible: 30000.01 })).toBe(0)
      expect(() =>
        importe({ ...h, gastos: [...h.gastos, ...h.gastos] })
      ).toThrow()
      expect(
        importe({
          ...h,
          gastos: h.gastos.map((g) => ({ ...g, titulares: ["a", "b"] })),
        })
      ).toBe(Math.round((esperado / 2 + Number.EPSILON) * 100) / 100)
    }
  })
  it("agregado fiscal sigue rechazando los parciales", () => {
    const contexto = marco("murcia").contexto
    expect(
      totalDeduccionesEvaluadas(contexto, [
        {
          tipo: "murcia_guarderia",
          contexto,
          gastos: [gasto("h")],
          baseImponible: 20000,
        },
      ]).estado
    ).toBe("no_soportado")
  })
})

it("rechaza identidades duplicadas en todas las colecciones de titulares y beneficiarios", () => {
  for (const [h] of casos) {
    expect(() => importe({ ...h, declarantes: ["a", "a"] })).toThrow(
      "Hechos insuficientes"
    )
    switch (h.codigo) {
      case "cantabria_nacimiento_adopcion_hijos":
        expect(() =>
          importe({ ...h, hijos: [...h.hijos, ...h.hijos] })
        ).toThrow()
        expect(() =>
          importe({
            ...h,
            hijos: h.hijos.map((p) => ({ ...p, progenitores: ["a", "a"] })),
          })
        ).toThrow()
        break
      case "canarias_nacimiento_adopcion_hijos":
        expect(() =>
          importe({ ...h, hijos: [...h.hijos, ...h.hijos] })
        ).toThrow()
        expect(() => importe({ ...h, titulares: ["a", "a"] })).toThrow()
        break
      case "canarias_familia_numerosa":
        expect(() => importe({ ...h, titulares: ["a", "a"] })).toThrow()
        break
      case "canarias_discapacidad_mayores_65":
        expect(() =>
          importe({ ...h, personas: [...h.personas, ...h.personas] })
        ).toThrow()
        break
      case "canarias_contribuyentes_desempleados":
        expect(() =>
          importe({ ...h, personas: [...h.personas, ...h.personas] })
        ).toThrow()
        break
      case "balears_gastos_mayores_65_discapacidad":
        expect(() =>
          importe({ ...h, personas: [...h.personas, ...h.personas] })
        ).toThrow()
        break
    }
    expect(
      evaluarHechosAuxiliar2025({
        ...h,
        contexto: { ...h.contexto, modalidad: "individual" },
        declarantes: ["a", "b"],
      }).estado
    ).toBe("no_soportado")
  }
})
it("redondea céntimos y valida fronteras de renta y las exclusiones externas explícitas", () => {
  for (const [h] of casos)
    expect(importe({ ...h, elegibilidadExterna: false })).toBe(0)
  expect(
    importe({
      ...marco("cantabria"),
      codigo: "cantabria_arrendamiento_jovenes_mayores_discapacidad",
      gastoElegible: 1000.05,
    })
  ).toBe(100.01)
  for (const modalidad of ["individual", "conjunta"] as const) {
    const tope = modalidad === "individual" ? 46455 : 61770
    const declarantes = modalidad === "individual" ? ["a"] : ["a", "b"]
    const h: HechosDeduccionAuxiliar = {
      ...marco("canarias", modalidad),
      codigo: "canarias_discapacidad_mayores_65",
      personas: declarantes.map((id) => ({ id, edad: 65, discapacidad: 33 })),
      renta: tope,
    }
    expect(importe(h)).toBe(declarantes.length * 400)
    expect(importe({ ...h, renta: tope + 0.01 })).toBe(0)
  }
})

it("rechaza explícitamente discriminantes omitidos, sin interpretar ausencia como exclusión", () => {
  const h = {
    ...marco("canarias"),
    codigo: "canarias_nacimiento_adopcion_hijos",
    renta: 20000,
    titulares: ["a"],
  } as const
  // @ts-expect-error Falta deliberadamente la colección de hijos obligatoria.
  expect(evaluarHechosAuxiliar2025(h).estado).toBe("no_soportado")
  const familia = {
    ...marco("canarias"),
    codigo: "canarias_familia_numerosa",
    titulares: ["a"],
    categoria: "general",
  } as const
  // @ts-expect-error El grado que cambia la cuantía debe ser explícito.
  expect(evaluarHechosAuxiliar2025(familia).estado).toBe("no_soportado")
})
