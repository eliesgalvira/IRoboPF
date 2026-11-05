import { describe, expect, it } from "vitest"
import Decimal from "decimal.js"
import { Schema } from "effect"
import * as clm from "../lib/dominio/irpf/deducciones/castilla-la-mancha-hechos-2025"
import * as cyl from "../lib/dominio/irpf/deducciones/castilla-y-leon-hechos-2025"
import * as ext from "../lib/dominio/irpf/deducciones/extremadura-hechos-2025"

const contexto = (territorio: string, extra = {}) => ({
  ejercicio: 2025,
  territorio,
  contribuyente: "a",
  declarantes: ["a"],
  modalidad: "individual",
  baseGeneral: "10000",
  baseAhorro: "0",
  minimoPersonalFamiliar: "0",
  ...extra,
})
const cm = contexto("castilla-la-mancha")
const cy = contexto("castilla-y-leon")
const ex = contexto("extremadura")
const conjunta = { modalidad: "conjunta", declarantes: ["a", "b"] }
function importe(r: clm.ResultadoHechos | ext.ResultadoHechos): string {
  expect(r.estado).toBe("calculo_parcial")
  if (r.estado !== "calculo_parcial") throw new Error(r.motivo)
  expect(r.aceptacionFiscal).toBe("pendiente")
  expect(r.pendientes.length).toBeGreaterThan(0)
  expect(r.magnitudesAnualesPendientes).toEqual([
    "cuota_integra_autonomica_disponible_2025",
  ])
  if (!Schema.is(Schema.String)(r.importeExacto))
    throw new Error("Este oráculo requiere un decimal finito exacto")
  return r.importeExacto
}
const discapacidad = {
  persona: "a",
  nacimiento: "1960-01-01",
  grado: 65,
  elecciones: [],
}
const mayor = {
  persona: "a",
  nacimiento: "1949-12-31",
  grado: 0,
  diasCentro: 30,
  diasConvalecenciaSescam: 0,
}
const parto = {
  exhaustividad: "todos_los_eventos",
  eventos: [
    {
      id: "p",
      fecha: "2025-01-01",
      tipo: "parto",
      hijos: ["h1", "h2"],
      titularesMinimo: ["a", "b"],
    },
  ],
}
const cuidado = {
  exhaustividad: "todos_los_ascendientes",
  ascendientes: [
    {
      id: "abuela",
      nacimiento: "1940-01-01",
      grado: 0,
      diasCentro: 31,
      diasConvalecenciaSescam: 1,
      titularesMinimo: ["a", "b"],
    },
  ],
}
const adopcion = {
  exhaustividad: "todas_las_adopciones",
  adopciones: [
    {
      hijo: "h",
      fechaResolucion: "2024-12-31",
      fechaInscripcion: "2025-01-01",
      clase: "internacional",
      ayudaAnalogica: "denegada",
      titularesMinimo: ["a", "b"],
    },
  ],
}
const cuotas = {
  exhaustividad: "todos_los_pagos",
  hijo: "h",
  hijoNacimiento: "2022-01-01",
  titularesMinimo: ["a", "b"],
  ayudaAnalogica: "bono_concilia",
  pagos: [
    {
      id: "p",
      fecha: "2025-06-01",
      importe: "4000",
      nifEmpleado: "empleada",
      empleador: "a",
      regimen: "gananciales",
      conyuge: "b",
    },
  ],
}
const familia = {
  tituloInicio: "2024-01-01",
  tituloFin: "2026-01-01",
  descendientes: ["h1", "h2", "h3", "h4", "h5", "h6"],
  discapacidad65: ["h1", "h2"],
  titulares: ["a", "b"],
  residenciaConyuge: "castilla-y-leon",
  conyuge: "b",
}
const trabajo = {
  exhaustividad: "todos_los_declarantes",
  personas: [
    {
      id: "a",
      integroTrabajo: "12000",
      restoRentas: "300",
      eleccion: "trabajo",
    },
  ],
}
const multiple = {
  exhaustividad: "todos_los_partos",
  regimenRenta: "ordinario",
  partos: [
    {
      id: "p",
      fecha: "2025-01-01",
      hijosConvivientes: ["h1", "h2", "h3"],
      titulares: ["a", "b"],
    },
  ],
}
const escolar = {
  exhaustividad: "todos_los_descendientes",
  regimenRenta: "ordinario",
  descendientes: [
    {
      id: "h",
      etapa: "primaria",
      titularesMinimo: ["a", "b"],
    },
  ],
}
const ela = {
  exhaustividad: "todos_los_diagnosticados",
  personas: [
    {
      id: "a",
      fechaDiagnostico: "2025-01-01",
      relacion: "propio",
      familiaresConDerecho: ["b", "c"],
    },
  ],
}

describe("CLM · cuantías y fronteras independientes", () => {
  it("grado65 y renta27000 admiten 300; 27000,01 y grado64 generan cero parcial", () => {
    expect(
      importe(
        clm.discapacidadPropia({ ...cm, baseGeneral: "27000" }, discapacidad)
      )
    ).toBe("300")
    expect(
      importe(
        clm.discapacidadPropia({ ...cm, baseGeneral: "27000.01" }, discapacidad)
      )
    ).toBe("0")
    expect(
      importe(clm.discapacidadPropia(cm, { ...discapacidad, grado: 64 }))
    ).toBe("0")
  })
  it("resuelve incompatibilidad explícita; rechaza persona ajena", () => {
    expect(
      clm.discapacidadPropia(cm, {
        ...discapacidad,
        elecciones: ["clm_mayores_75"],
      }).estado
    ).toBe("no_soportado")
    expect(
      clm.discapacidadPropia(cm, { ...discapacidad, persona: "b" }).estado
    ).toBe("no_soportado")
    expect(
      clm.discapacidadPropia(cm, {
        ...discapacidad,
        elecciones: ["desconocida"],
      }).estado
    ).toBe("no_soportado")
  })
  it(">75; 30 días admiten, 31 excluyen y convalecencia resta", () => {
    expect(importe(clm.mayores75(cm, mayor))).toBe("150")
    expect(
      importe(clm.mayores75(cm, { ...mayor, nacimiento: "1950-01-01" }))
    ).toBe("0")
    expect(importe(clm.mayores75(cm, { ...mayor, diasCentro: 31 }))).toBe("0")
    expect(
      importe(
        clm.mayores75(cm, {
          ...mayor,
          diasCentro: 31,
          diasConvalecenciaSescam: 1,
        })
      )
    ).toBe("150")
    expect(importe(clm.mayores75(cm, { ...mayor, grado: 65 }))).toBe("0")
    expect(
      clm.mayores75(cm, { ...mayor, diasConvalecenciaSescam: 31 }).estado
    ).toBe("no_soportado")
  })
  it("gemelos500 por evento, mitad250; conjunta500; dos partos simples200", () => {
    expect(importe(clm.nacimientoAdopcion(cm, parto))).toBe("250")
    expect(importe(clm.nacimientoAdopcion({ ...cm, ...conjunta }, parto))).toBe(
      "500"
    )
    expect(
      importe(
        clm.nacimientoAdopcion(cm, {
          ...parto,
          eventos: [
            { ...parto.eventos[0], hijos: ["h1"], titularesMinimo: ["a"] },
            {
              ...parto.eventos[0],
              id: "q",
              hijos: ["h2"],
              titularesMinimo: ["a"],
            },
          ],
        })
      )
    ).toBe("200")
  })
  it("reparto conserva titular fuera de declaración y renta conjunta36000", () => {
    expect(
      importe(
        clm.nacimientoAdopcion(
          { ...cm, ...conjunta, baseGeneral: "36000" },
          parto
        )
      )
    ).toBe("500")
    expect(
      importe(
        clm.nacimientoAdopcion(
          { ...cm, ...conjunta, baseGeneral: "36000.01" },
          parto
        )
      )
    ).toBe("0")
    expect(
      clm.nacimientoAdopcion(cm, {
        ...parto,
        eventos: [...parto.eventos, ...parto.eventos],
      }).estado
    ).toBe("no_soportado")
    expect(
      clm.nacimientoAdopcion(cm, { ...parto, exhaustividad: "desconocida" })
        .estado
    ).toBe("no_soportado")
  })
  it("cuidado75: mitad75, sin importar reparto al mayor propio", () => {
    expect(importe(clm.cuidadoAscendientes75(cm, cuidado))).toBe("75")
    expect(
      importe(clm.cuidadoAscendientes75({ ...cm, ...conjunta }, cuidado))
    ).toBe("150")
    expect(
      importe(
        clm.cuidadoAscendientes75(cm, {
          ...cuidado,
          ascendientes: [{ ...cuidado.ascendientes[0], grado: 65 }],
        })
      )
    ).toBe("0")
  })
})

describe("CyL · renta menos mínimo, adopción, cuotas y familia", () => {
  it.each([
    ["1960-01-01", 33, "300"],
    ["1960-01-01", 65, "656"],
    ["1961-01-01", 33, "0"],
    ["1961-01-01", 65, "300"],
  ])("edad/grado %s/%s", (nacimiento, grado, esperado) => {
    expect(
      importe(
        cyl.discapacidadPropia(cy, {
          persona: "a",
          nacimiento,
          grado,
          residencia: "fuera",
        })
      )
    ).toBe(esperado)
  })
  it("descuenta mínimo y comprueba residencia", () => {
    const f = {
      persona: "a",
      nacimiento: "1960-01-01",
      grado: 65,
      residencia: "fuera",
    }
    expect(
      importe(
        cyl.discapacidadPropia(
          { ...cy, baseGeneral: "24000", minimoPersonalFamiliar: "5100" },
          f
        )
      )
    ).toBe("656")
    expect(
      importe(
        cyl.discapacidadPropia(
          { ...cy, baseGeneral: "24000.01", minimoPersonalFamiliar: "5100" },
          f
        )
      )
    ).toBe("0")
    expect(
      importe(cyl.discapacidadPropia(cy, { ...f, residencia: "concertada" }))
    ).toBe("0")
    expect(
      cyl.discapacidadPropia(cy, { ...f, residencia: "desconocida" }).estado
    ).toBe("no_soportado")
  })
  it("inscripción2025 internacional3625/2; nacional784/2; ayuda concedida excluye", () => {
    expect(importe(cyl.adopcion(cy, adopcion))).toBe("1812.5")
    expect(
      importe(cyl.adopcion({ ...cy, baseGeneral: "100000" }, adopcion))
    ).toBe("1812.5")
    expect(
      importe(
        cyl.adopcion(cy, {
          ...adopcion,
          adopciones: [{ ...adopcion.adopciones[0], clase: "nacional" }],
        })
      )
    ).toBe("392")
    expect(
      importe(
        cyl.adopcion(cy, {
          ...adopcion,
          adopciones: [
            { ...adopcion.adopciones[0], ayudaAnalogica: "concedida" },
          ],
        })
      )
    ).toBe("0")
    expect(
      importe(
        cyl.adopcion(cy, {
          ...adopcion,
          adopciones: [
            { ...adopcion.adopciones[0], fechaInscripcion: "2024-12-31" },
          ],
        })
      )
    ).toBe("0")
    expect(
      cyl.adopcion(cy, {
        ...adopcion,
        adopciones: [
          { ...adopcion.adopciones[0], ayudaAnalogica: "pendiente" },
        ],
      }).estado
    ).toBe("no_soportado")
  })
  it("cuotas4000/2*15%=300; conjunta no duplica máximo300", () => {
    expect(importe(cyl.cuotasHogar(cy, cuotas))).toBe("300")
    expect(importe(cyl.cuotasHogar({ ...cy, ...conjunta }, cuotas))).toBe("300")
    const poco = {
      ...cuotas,
      pagos: [{ ...cuotas.pagos[0], importe: "1000.10" }],
    }
    expect(importe(cyl.cuotasHogar(cy, poco))).toBe("75.0075")
    expect(cyl.presentar(cyl.cuotasHogar(cy, poco))).toMatchObject({
      importe: 75.01,
    })
    expect(
      importe(cyl.cuotasHogar(cy, { ...cuotas, hijoNacimiento: "2021-12-31" }))
    ).toBe("0")
    expect(
      cyl.cuotasHogar(cy, {
        ...cuotas,
        pagos: [...cuotas.pagos, ...cuotas.pagos],
      }).estado
    ).toBe("no_soportado")
  })
  it("cuotas fuera2025, pago inválido y reparto contradictorio", () => {
    expect(
      importe(
        cyl.cuotasHogar(cy, {
          ...cuotas,
          pagos: [{ ...cuotas.pagos[0], fecha: "2024-12-31" }],
        })
      )
    ).toBe("0")
    expect(
      cyl.cuotasHogar(cy, {
        ...cuotas,
        pagos: [{ ...cuotas.pagos[0], fecha: "2025-02-29" }],
      }).estado
    ).toBe("no_soportado")
    expect(
      cyl.cuotasHogar(cy, {
        ...cuotas,
        pagos: [{ ...cuotas.pagos[0], importe: "-1" }],
      }).estado
    ).toBe("no_soportado")
    expect(
      cyl.cuotasHogar(cy, { ...cuotas, titularesMinimo: ["a"] }).estado
    ).toBe("no_soportado")
  })
  it("sexto+1000, discapacidad suplemento único600: (2500+1000+600)/2=2050", () => {
    expect(importe(cyl.familiaNumerosa(cy, familia))).toBe("2050")
    expect(
      importe(cyl.familiaNumerosa({ ...cy, baseGeneral: "100000" }, familia))
    ).toBe("2050")
    expect(
      importe(
        cyl.familiaNumerosa(cy, {
          ...familia,
          descendientes: ["h1", "h2"],
          discapacidad65: [],
        })
      )
    ).toBe("300")
    expect(
      importe(cyl.familiaNumerosa(cy, { ...familia, tituloFin: "2025-12-30" }))
    ).toBe("0")
    expect(
      cyl.familiaNumerosa(cy, { ...familia, residenciaConyuge: "otra" }).estado
    ).toBe("no_soportado")
  })
})

describe("Extremadura · personas y causantes exhaustivos", () => {
  it("trabajo12000/resto300 incluye; exceso de un céntimo excluye", () => {
    expect(importe(ext.trabajoDependiente(ex, trabajo))).toBe("75")
    for (const campos of [
      { integroTrabajo: "12000.01" },
      { restoRentas: "300.01" },
      { integroTrabajo: "0" },
      { eleccion: "viudedad" },
    ])
      expect(
        importe(
          ext.trabajoDependiente(ex, {
            ...trabajo,
            personas: [{ ...trabajo.personas[0], ...campos }],
          })
        )
      ).toBe("0")
    expect(ext.trabajoDependiente({ ...ex, ...conjunta }, trabajo).estado).toBe(
      "no_soportado"
    )
    expect(
      importe(
        ext.trabajoDependiente(
          { ...ex, ...conjunta },
          {
            ...trabajo,
            personas: [
              { ...trabajo.personas[0], eleccion: "viudedad" },
              { ...trabajo.personas[0], id: "b" },
            ],
          }
        )
      )
    ).toBe("75")
  })
  it("trillizos900 compartido450; umbral19000/24000 y rural desconocido", () => {
    expect(
      importe(ext.partosMultiples({ ...ex, baseGeneral: "19000" }, multiple))
    ).toBe("450")
    expect(
      importe(ext.partosMultiples({ ...ex, baseGeneral: "19000.01" }, multiple))
    ).toBe("0")
    expect(
      importe(
        ext.partosMultiples(
          { ...ex, ...conjunta, baseGeneral: "24000" },
          multiple
        )
      )
    ).toBe("900")
    expect(
      ext.partosMultiples(ex, { ...multiple, regimenRenta: "rural" }).estado
    ).toBe("no_soportado")
  })
  it("escolar15/2=7.5; infantil no obligatorio; etapa desconocida se rechaza", () => {
    expect(importe(ext.materialEscolar(ex, escolar))).toBe("7.5")
    expect(
      importe(
        ext.materialEscolar(ex, {
          ...escolar,
          descendientes: [{ ...escolar.descendientes[0], etapa: "infantil" }],
        })
      )
    ).toBe("0")
    expect(
      ext.materialEscolar(ex, {
        ...escolar,
        descendientes: [{ ...escolar.descendientes[0], etapa: "desconocida" }],
      }).estado
    ).toBe("no_soportado")
  })
  it("ELA propio2000 íntegro; conjunta propio2000 más familiar1000=3000", () => {
    expect(importe(ext.ela(ex, ela))).toBe("2000")
    expect(importe(ext.ela({ ...ex, ...conjunta }, ela))).toBe("3000")
    expect(
      importe(
        ext.ela(ex, {
          ...ela,
          personas: [
            {
              ...ela.personas[0],
              id: "madre",
              relacion: "ascendiente",
              familiaresConDerecho: ["a", "b"],
            },
          ],
        })
      )
    ).toBe("1000")
    expect(
      ext.ela(ex, { ...ela, personas: [...ela.personas, ...ela.personas] })
        .estado
    ).toBe("no_soportado")
    expect(
      ext.ela(ex, {
        ...ela,
        personas: [{ ...ela.personas[0], familiaresConDerecho: ["a"] }],
      }).estado
    ).toBe("no_soportado")
    expect(
      importe(
        ext.ela(ex, {
          ...ela,
          personas: [{ ...ela.personas[0], fechaDiagnostico: "2026-01-01" }],
        })
      )
    ).toBe("0")
  })
})

describe("fronteras de contrato y precisión local", () => {
  it.each([
    null,
    {},
    "desconocido",
    { ...cm, ejercicio: 2026 },
    { ...cm, territorio: "extremadura" },
    { ...cm, baseGeneral: NaN },
    { ...cm, baseGeneral: "Infinity" },
    { ...cm, baseGeneral: "1e3" },
    { ...cm, declarantes: ["a", "a"] },
    { ...cm, modalidad: "desconocida" },
    { ...cm, extra: true },
  ])("rechaza contexto incompleto/ajeno/desconocido %j", (c) => {
    expect(clm.mayores75(c, mayor).estado).toBe("no_soportado")
  })
  it("rechaza desconocidos, fechas inexistentes, fracciones de días y alias con espacios", () => {
    for (const f of [
      { ...mayor, nacimiento: "1949-02-29" },
      { ...mayor, diasCentro: 30.5 },
      { ...mayor, persona: " a " },
      { ...mayor, cumple: true },
    ])
      expect(clm.mayores75(cm, f).estado).toBe("no_soportado")
  })
})

describe("regresión de identidades imposibles", () => {
  it("nadie puede ser hijo nacido y titular del mismo mínimo", () => {
    expect(
      clm.nacimientoAdopcion(cm, {
        ...parto,
        eventos: [{ ...parto.eventos[0], hijos: ["a", "h2"] }],
      }).estado
    ).toBe("no_soportado")
    expect(
      ext.partosMultiples(ex, {
        ...multiple,
        partos: [{ ...multiple.partos[0], hijosConvivientes: ["a", "h2"] }],
      }).estado
    ).toBe("no_soportado")
  })
  it("nadie puede ser su propio adoptante ni descendiente", () => {
    expect(
      cyl.adopcion(cy, {
        ...adopcion,
        adopciones: [{ ...adopcion.adopciones[0], hijo: "a" }],
      }).estado
    ).toBe("no_soportado")
    expect(
      cyl.familiaNumerosa(cy, { ...familia, descendientes: ["a", "h1", "h2"] })
        .estado
    ).toBe("no_soportado")
  })
  it("un ascendiente no puede figurar como titular de su propio mínimo", () => {
    expect(
      clm.cuidadoAscendientes75(cm, {
        ...cuidado,
        ascendientes: [
          { ...cuidado.ascendientes[0], titularesMinimo: ["a", "abuela"] },
        ],
      }).estado
    ).toBe("no_soportado")
  })
})

describe("límites del contrato tras esquemas concretos", () => {
  it("cuotas requiere hijo identificado distinto de titulares y empleado", () => {
    expect(cyl.cuotasHogar(cy, { ...cuotas, hijo: "a" }).estado).toBe(
      "no_soportado"
    )
    expect(cyl.cuotasHogar(cy, { ...cuotas, hijo: "empleada" }).estado).toBe(
      "no_soportado"
    )
  })
  it("familia no admite cónyuge propio ni suplemento ajeno", () => {
    expect(cyl.familiaNumerosa(cy, { ...familia, conyuge: "a" }).estado).toBe(
      "no_soportado"
    )
    expect(
      cyl.familiaNumerosa(cy, { ...familia, discapacidad65: ["ajeno"] }).estado
    ).toBe("no_soportado")
    expect(
      cyl.familiaNumerosa(cy, { ...familia, residenciaConyuge: "sin_conyuge" })
        .estado
    ).toBe("no_soportado")
  })
  it("fechas, tipos anidados y período2025 se comprueban sin normalizar", () => {
    expect(
      cyl.adopcion(cy, {
        ...adopcion,
        adopciones: [
          { ...adopcion.adopciones[0], fechaResolucion: "2025-02-29" },
        ],
      }).estado
    ).toBe("no_soportado")
    expect(
      cyl.adopcion(cy, {
        ...adopcion,
        adopciones: [
          { ...adopcion.adopciones[0], fechaResolucion: "2025-12-31" },
        ],
      }).estado
    ).toBe("no_soportado")
    expect(
      clm.nacimientoAdopcion(cm, {
        ...parto,
        eventos: [{ ...parto.eventos[0], hijos: [1, 2] }],
      }).estado
    ).toBe("no_soportado")
    expect(
      clm.nacimientoAdopcion(cm, {
        ...parto,
        eventos: [{ ...parto.eventos[0], importe: 500 }],
      }).estado
    ).toBe("no_soportado")
    expect(
      importe(
        clm.nacimientoAdopcion(cm, {
          ...parto,
          eventos: [{ ...parto.eventos[0], fecha: "2026-01-01" }],
        })
      )
    ).toBe("0")
    expect(
      importe(
        clm.nacimientoAdopcion(cm, {
          ...parto,
          eventos: [{ ...parto.eventos[0], fecha: "2025-12-31" }],
        })
      )
    ).toBe("250")
  })
  it("renta conjunta CyL31500 después de mínimo y Ext24000 no se extienden", () => {
    const f = {
      persona: "a",
      nacimiento: "1960-01-01",
      grado: 65,
      residencia: "fuera",
    }
    expect(
      importe(
        cyl.discapacidadPropia(
          {
            ...cy,
            ...conjunta,
            baseGeneral: "37000",
            minimoPersonalFamiliar: "5500",
          },
          f
        )
      )
    ).toBe("656")
    expect(
      importe(
        cyl.discapacidadPropia(
          {
            ...cy,
            ...conjunta,
            baseGeneral: "37000.01",
            minimoPersonalFamiliar: "5500",
          },
          f
        )
      )
    ).toBe("0")
    expect(
      importe(
        ext.partosMultiples(
          { ...ex, ...conjunta, baseGeneral: "24000.01" },
          multiple
        )
      )
    ).toBe("0")
  })
  it("ELA: identidad propia contradictoria y familiar por varios causantes se rechazan", () => {
    expect(
      ext.ela(ex, {
        ...ela,
        personas: [{ ...ela.personas[0], relacion: "descendiente" }],
      }).estado
    ).toBe("no_soportado")
    expect(
      ext.ela(ex, {
        ...ela,
        personas: [
          {
            id: "madre",
            fechaDiagnostico: "2025-01-01",
            relacion: "ascendiente",
            familiaresConDerecho: ["a"],
          },
          {
            id: "padre",
            fechaDiagnostico: "2025-01-01",
            relacion: "ascendiente",
            familiaresConDerecho: ["a"],
          },
        ],
      }).estado
    ).toBe("no_soportado")
  })
})

describe("aislamiento decimal y coherencia por rol", () => {
  it("configuración monetaria local independiente del Decimal global", () => {
    const precision = Decimal.precision,
      rounding = Decimal.rounding
    try {
      Decimal.set({ precision: 3, rounding: Decimal.ROUND_DOWN })
      const poco = {
        ...cuotas,
        pagos: [{ ...cuotas.pagos[0], importe: "1000.10" }],
      }
      expect(importe(cyl.cuotasHogar(cy, poco))).toBe("75.0075")
      expect(cyl.presentar(cyl.cuotasHogar(cy, poco))).toMatchObject({
        importe: 75.01,
      })
    } finally {
      Decimal.set({ precision, rounding })
    }
  })
  it("hijo propio imposible se rechaza aun si lo atribuyen a otro titular", () => {
    expect(
      clm.nacimientoAdopcion(cm, {
        ...parto,
        eventos: [
          { ...parto.eventos[0], hijos: ["a"], titularesMinimo: ["b"] },
        ],
      }).estado
    ).toBe("no_soportado")
    expect(
      cyl.adopcion(cy, {
        ...adopcion,
        adopciones: [
          { ...adopcion.adopciones[0], hijo: "a", titularesMinimo: ["b"] },
        ],
      }).estado
    ).toBe("no_soportado")
    expect(
      ext.partosMultiples(ex, {
        ...multiple,
        partos: [
          {
            ...multiple.partos[0],
            hijosConvivientes: ["a", "h2"],
            titulares: ["b"],
          },
        ],
      }).estado
    ).toBe("no_soportado")
  })
})

describe("Extremadura: regresiones R1/R2 en conjunta", () => {
  it("trillizos conserva 900 con ambos progenitores declarantes", () => {
    expect(importe(ext.partosMultiples({ ...ex, ...conjunta }, multiple))).toBe(
      "900"
    )
  })
  it("escolar conserva importe completo con ambos progenitores declarantes", () => {
    expect(importe(ext.materialEscolar({ ...ex, ...conjunta }, escolar))).toBe(
      "15"
    )
  })
  it("partos no atribuye importe a una conjunta ajena a titulares", () => {
    expect(
      importe(
        ext.partosMultiples(
          {
            ...ex,
            modalidad: "conjunta",
            contribuyente: "x",
            declarantes: ["x", "y"],
          },
          multiple
        )
      )
    ).toBe("0")
  })
  it("escolar no atribuye importe a una conjunta ajena a titulares", () => {
    expect(
      importe(
        ext.materialEscolar(
          {
            ...ex,
            modalidad: "conjunta",
            contribuyente: "x",
            declarantes: ["x", "y"],
          },
          escolar
        )
      )
    ).toBe("0")
  })
})
