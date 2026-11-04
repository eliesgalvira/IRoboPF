import { describe, expect, it } from "vitest"
import {
  evaluarHechosB2025,
  presentarB,
  type MarcoB,
  type PagoB,
  type ResolucionB,
  type ResultadoB,
} from "../lib/dominio/irpf/deducciones/asturias-cantabria-hechos-2025"
import type {
  AcogidoB,
  HechosB,
} from "../lib/dominio/irpf/deducciones/asturias-cantabria-hechos-2025"

const ast: MarcoB = {
  ejercicio: 2025,
  territorio: "asturias",
  modalidad: "individual",
  contribuyente: "A",
  declarantes: ["A"],
  baseGeneral: "20000",
  baseAhorro: "0",
  exhaustividad: "completa",
}
const can: MarcoB = { ...ast, territorio: "cantabria" }
const conjunta: MarcoB = {
  ...can,
  modalidad: "conjunta",
  declarantes: ["A", "B"],
}
const resolucion: ResolucionB = {
  referencia: "R1",
  organismo: "Organismo del expediente",
  fecha: "2025-01-01",
}
const reparto = {
  titulares: ["A"],
  exhaustividadTitulares: "completa" as const,
}
function pago(euros: string, id = "P1"): PagoB {
  return {
    id,
    pagador: "A",
    receptor: "Proveedor",
    fecha: "2025-04-01",
    euros,
    documento: "F1",
    medio: "transferencia",
  }
}
function exacto(r: ResultadoB, n: string, d = "1"): void {
  expect(r.estado).toBe("calculo_parcial")
  if (r.estado !== "calculo_parcial") throw new Error(r.motivo)
  // Comparación racional por productos enteros, independiente de Decimal del módulo.
  const parse = (v: string): [bigint, bigint] => {
    const [i, f = ""] = v.split(".")
    return [BigInt(i + f), 10n ** BigInt(f.length)]
  }
  const [a, b] = parse(r.importeExacto.numeradorEuros),
    [c, e] = parse(r.importeExacto.divisor),
    [f, g] = parse(n),
    [h, j] = parse(d)
  expect(a * e * g * h).toBe(f * j * b * c)
  expect(r.aplicacionCuota).toBe("pendiente_padre")
  expect(r.aceptacionFiscal).toBe("pendiente")
}
function acogido(dias = 183): AcogidoB {
  return {
    ...reparto,
    id: "menor",
    nacimiento: "2015-01-01",
    diasConvivencia: dias,
    inicioAcogimiento: "2025-01-01",
    finAcogimiento: "2025-12-31",
    resolucion,
    regimen: "familiar",
    contraprestacion: "0",
    ayudasAsturiasAcogedor: "0",
    ayudasAsturiasAcogido: "0",
    gradoParentesco: null,
  }
}
const menores = (p: AcogidoB): HechosB => ({
  codigo: "asturias_acogimiento_familiar_menores",
  personas: [p],
})
const mayores = (p: AcogidoB): HechosB => ({
  codigo: "asturias_acogimiento_no_remunerado_mayores_65",
  personas: [p],
})
const mayor = (): AcogidoB => ({
  ...acogido(184),
  nacimiento: "1959-12-31",
  regimen: "no_remunerado_mayores",
})
function vital(nacimiento: string, euros = "5000"): HechosB {
  return {
    codigo: "asturias_gastos_vitales_hasta_35",
    nacimiento,
    gastos: [{ ...pago(euros), concepto: "educacion" }],
  }
}
function estudios(
  rentaAnual: string
): Extract<HechosB, { codigo: "cantabria_traslado_estudios_despoblamiento" }> {
  return {
    codigo: "cantabria_traslado_estudios_despoblamiento",
    municipioResidencia: "39003",
    pruebaResidencia: resolucion,
    hijos: [
      {
        id: "H",
        nacimiento: "2005-01-01",
        progenitores: ["A", "B"],
        inicioEstudios: "2024-09-01",
        finEstudios: "2025-06-30",
        rentaAnual,
        relacion: "hijo",
        municipioEstudios: "39075",
        etapa: "universidad",
        pagosTraslado: [pago("20")],
      },
    ],
  }
}
function salud(
  euros = "10000"
): Extract<HechosB, { codigo: "cantabria_gastos_enfermedad" }> {
  return {
    codigo: "cantabria_gastos_enfermedad",
    baseLiquidableMenosMinimo: "20000",
    personasMinimo: [],
    discapacidades: [],
    gastos: [
      {
        ...pago(euros),
        paciente: "A",
        concepto: "dental",
        honorarios: "profesional_sanitario",
        coberturaSSMutuaSeguro: "0",
      },
    ],
  }
}

describe("Acogimientos asturianos: días, edades y reparto exacto", () => {
  it.each([
    [90, "0"],
    [91, "250"],
    [182, "250"],
    [183, "500"],
    [365, "500"],
  ])("menor %i días", (d, euros) =>
    exacto(evaluarHechosB2025(ast, menores(acogido(d))), euros)
  )
  it("rechaza días imposibles y resolución futura", () => {
    expect(evaluarHechosB2025(ast, menores(acogido(366))).estado).toBe(
      "no_soportado"
    )
    expect(
      evaluarHechosB2025(
        ast,
        menores({
          ...acogido(),
          resolucion: { ...resolucion, fecha: "2026-01-01" },
        })
      ).estado
    ).toBe("no_soportado")
  })
  it("no cuenta preadopción ni mayores", () => {
    exacto(
      evaluarHechosB2025(
        ast,
        menores({ ...acogido(), regimen: "preadoptivo" })
      ),
      "0"
    )
    exacto(
      evaluarHechosB2025(
        ast,
        menores({ ...acogido(), nacimiento: "2007-01-01" })
      ),
      "0"
    )
  })
  it("preserva tercio sin aproximarlo", () => {
    const r = evaluarHechosB2025(
      ast,
      menores({ ...acogido(), titulares: ["A", "B", "C"] })
    )
    exacto(r, "500", "3")
    if (r.estado === "calculo_parcial")
      expect(presentarB(r.importeExacto)).toBe("166.67")
  })
  it("no duplica personas ni acepta titulares incompletos", () => {
    expect(
      evaluarHechosB2025(ast, {
        codigo: "asturias_acogimiento_familiar_menores",
        personas: [acogido(), acogido()],
      }).estado
    ).toBe("no_soportado")
    expect(
      evaluarHechosB2025(
        ast,
        menores({ ...acogido(), exhaustividadTitulares: "incompleta" })
      ).estado
    ).toBe("no_soportado")
  })
  it("mayor requiere >65 y >183, renta inclusiva 26000", () => {
    exacto(
      evaluarHechosB2025({ ...ast, baseGeneral: "26000" }, mayores(mayor())),
      "500"
    )
    exacto(
      evaluarHechosB2025(ast, mayores({ ...mayor(), diasConvivencia: 183 })),
      "0"
    )
    exacto(
      evaluarHechosB2025(
        ast,
        mayores({ ...mayor(), nacimiento: "1960-01-01" })
      ),
      "0"
    )
    expect(
      evaluarHechosB2025({ ...ast, baseGeneral: "26000.01" }, mayores(mayor()))
        .estado
    ).toBe("excluida")
  })
  it("ayuda de cualquiera, parentesco tercero o remuneración excluyen", () => {
    for (const cambios of [
      { ayudasAsturiasAcogido: "0.01" },
      { ayudasAsturiasAcogedor: "0.01" },
      { gradoParentesco: 3 },
      { contraprestacion: "0.01" },
    ])
      exacto(evaluarHechosB2025(ast, mayores({ ...mayor(), ...cambios })), "0")
    exacto(
      evaluarHechosB2025(ast, mayores({ ...mayor(), gradoParentesco: 4 })),
      "500"
    )
  })
})
describe("Gastos vitales: R30 acotada", () => {
  it.each([
    ["2000-12-31", "2000"],
    ["1999-01-01", "1500"],
    ["1996-01-01", "1500"],
    ["1994-01-01", "1000"],
    ["1990-01-01", "1000"],
  ])("nacimiento %s", (n, v) => exacto(evaluarHechosB2025(ast, vital(n)), v))
  it("reserva sólo exactamente30", () => {
    expect(evaluarHechosB2025(ast, vital("1995-01-01")).estado).toBe(
      "no_soportado"
    )
    expect(evaluarHechosB2025(ast, vital("1989-01-01")).estado).toBe("excluida")
    exacto(
      evaluarHechosB2025(
        { ...ast, baseGeneral: "28000" },
        vital("1994-01-01", "123.45")
      ),
      "123.45"
    )
    expect(
      evaluarHechosB2025(
        { ...ast, baseGeneral: "28000.01" },
        vital("1994-01-01")
      ).estado
    ).toBe("excluida")
  })
  it("fecha civil imposible y magnitudes hostiles", () => {
    expect(evaluarHechosB2025(ast, vital("2000-02-30")).estado).toBe(
      "no_soportado"
    )
    for (const euros of ["NaN", "Infinity", "-1", "1e3", "1.001"])
      expect(evaluarHechosB2025(ast, vital("2000-01-01", euros)).estado).toBe(
        "no_soportado"
      )
  })
})
describe("Base neta forestal y generación de vivienda", () => {
  const forestal: Extract<
    HechosB,
    { codigo: "asturias_certificacion_gestion_forestal_sostenible" }
  > = {
    codigo: "asturias_certificacion_gestion_forestal_sostenible",
    monte: "Monte",
    municipioAsturias: "33001",
    fechaAdquisicionMonte: "2020-01-01",
    propietarios: ["A", "B"],
    certificacion: resolucion,
    emisor: "entidad_regional",
    pagosCertificacion: [pago("5000"), { ...pago("1000", "P2"), pagador: "B" }],
    subvenciones: "4000",
    reparto: { ...reparto, titulares: ["A", "B"] },
  }
  it("30% de 6000-4000=600, mitad=300; total previo al reparto", () =>
    exacto(evaluarHechosB2025(ast, forestal), "300"))
  it("ayuda superior no crea negativo; tope y fecha obtención", () => {
    exacto(evaluarHechosB2025(ast, { ...forestal, subvenciones: "9000" }), "0")
    // Art.14.3: el máximo es personal. 6.000 comunes / 2 * 30% = 900.
    exacto(evaluarHechosB2025(ast, { ...forestal, subvenciones: "0" }), "900")
    expect(
      evaluarHechosB2025(ast, {
        ...forestal,
        certificacion: { ...resolucion, fecha: "2024-01-01" },
      }).estado
    ).toBe("excluida")
  })
  it("máximo forestal personal después del reparto: 1000 por copropietario", () => {
    const h = {
      ...forestal,
      pagosCertificacion: [
        pago("5000"),
        { ...pago("5000", "P2"), pagador: "B" },
      ],
      subvenciones: "0",
    }
    exacto(evaluarHechosB2025(ast, h), "1000")
    exacto(
      evaluarHechosB2025({ ...ast, contribuyente: "B", declarantes: ["B"] }, h),
      "1000"
    )
  })
  it("no extrapola el máximo forestal a una composición conjunta pendiente", () => {
    expect(
      evaluarHechosB2025(
        { ...ast, modalidad: "conjunta", declarantes: ["A", "B"] },
        forestal
      ).estado
    ).toBe("no_soportado")
  })
  const vivienda: Extract<HechosB, { codigo: "asturias_vivienda_protegida" }> =
    {
      codigo: "asturias_vivienda_protegida",
      vivienda: "V1",
      calificacion: resolucion,
      fechaAdquisicionRehabilitacion: "2025-03-01",
      destino: "habitual",
      pagos: [pago("4000")],
      reparto: { ...reparto, titulares: ["A", "B"] },
    }
  it("reparte tope, no gasto propio, y deja arrastre al padre", () => {
    exacto(evaluarHechosB2025(ast, vivienda), "2500")
    exacto(
      evaluarHechosB2025(ast, { ...vivienda, pagos: [pago("1000")] }),
      "1000"
    )
    exacto(
      evaluarHechosB2025(ast, {
        ...vivienda,
        fechaAdquisicionRehabilitacion: "2024-01-01",
      }),
      "500"
    )
  })
})
describe("Cantabria: estudios, educación y enfermedad", () => {
  it.each([
    ["7999.99", "100"],
    ["8000", "0"],
    ["8000.01", "0"],
  ])("BC02 renta %s", (r, v) => exacto(evaluarHechosB2025(can, estudios(r)), v))
  it("conjunta 200 por hijo y sin salida ficticia ante municipio inventado", () => {
    exacto(evaluarHechosB2025(conjunta, estudios("0")), "200")
    expect(
      evaluarHechosB2025(can, { ...estudios("0"), municipioResidencia: "M1" })
        .estado
    ).toBe("no_soportado")
    const h = estudios("0")
    exacto(
      evaluarHechosB2025(can, {
        ...h,
        hijos: h.hijos.map((x) => ({ ...x, nacimiento: "2000-01-01" })),
      }),
      "0"
    )
    exacto(
      evaluarHechosB2025(can, {
        ...h,
        hijos: h.hijos.map((x) => ({
          ...x,
          pagosTraslado: [{ ...pago("20"), medio: "efectivo" }],
        })),
      }),
      "0"
    )
  })
  const educacion: Extract<HechosB, { codigo: "cantabria_gastos_educacion" }> =
    {
      codigo: "cantabria_gastos_educacion",
      unidadFamiliar: "U1",
      miembros: ["A", "B", "H"],
      gastos: [
        {
          ...pago("100"),
          descendiente: "H",
          etapa: "eso",
          concepto: "libros",
          prestador: "centro_docente",
        },
        {
          ...pago("200", "P2"),
          descendiente: "H",
          etapa: "eso",
          concepto: "idiomas_extraescolares",
          prestador: "persona_iae",
        },
      ],
    }
  it("100 libros+15% de 200 idiomas=130; tope familiar200", () => {
    exacto(evaluarHechosB2025(conjunta, educacion), "130")
    exacto(
      evaluarHechosB2025(conjunta, {
        ...educacion,
        gastos: educacion.gastos.map((p) => ({ ...p, euros: "1000" })),
      }),
      "200"
    )
    expect(evaluarHechosB2025(can, educacion).estado).toBe("no_soportado")
  })
  it("enfermedad: 10%, coberturas y pagos bancarios", () => {
    exacto(evaluarHechosB2025(can, salud("1200.30")), "120.03")
    const h = salud("1200")
    exacto(
      evaluarHechosB2025(can, {
        ...h,
        gastos: h.gastos.map((p) => ({ ...p, coberturaSSMutuaSeguro: "200" })),
      }),
      "100"
    )
    exacto(
      evaluarHechosB2025(can, {
        ...h,
        gastos: h.gastos.map((p) => ({ ...p, medio: "efectivo" })),
      }),
      "0"
    )
    expect(
      evaluarHechosB2025(can, {
        ...h,
        gastos: h.gastos.map((p) => ({
          ...p,
          coberturaSSMutuaSeguro: "1200.01",
        })),
      }).estado
    ).toBe("no_soportado")
  })
  it("tope 500/700 y suplemento por cada declarante >=65", () => {
    exacto(evaluarHechosB2025(can, salud()), "500")
    exacto(evaluarHechosB2025(conjunta, salud()), "700")
    exacto(
      evaluarHechosB2025(conjunta, {
        ...salud(),
        discapacidades: [
          { id: "A", grado: 65, certificado: resolucion },
          { id: "B", grado: 65, certificado: resolucion },
        ],
      }),
      "900"
    )
    exacto(
      evaluarHechosB2025(can, {
        ...salud(),
        discapacidades: [{ id: "A", grado: 64, certificado: resolucion }],
      }),
      "500"
    )
  })
  it.each([
    [can, "22946"],
    [conjunta, "31485"],
  ])("base minorada estricta", (m, b) =>
    expect(
      evaluarHechosB2025(m, { ...salud(), baseLiquidableMenosMinimo: b }).estado
    ).toBe("excluida")
  )
})
describe("BC01 y rechazos de contrato", () => {
  const mono: Extract<
    HechosB,
    { codigo: "cantabria_familias_monoparentales" }
  > = {
    codigo: "cantabria_familias_monoparentales",
    baseLiquidableMenosMinimo: "20000",
    estadoCivil: "sin_vinculo",
    hijos: [
      {
        id: "H",
        nacimiento: "1997-01-01",
        convivencia: "si",
        emancipacionConsentida: "no",
        medida: "curatela_representativa",
        resolucion,
        representante: "A",
      },
    ],
  }
  it("representativa del manual frente a asistencial; conserva patria transitoria", () => {
    exacto(evaluarHechosB2025(can, mono), "200")
    for (const medida of [
      "patria_prorrogada_transitoria",
      "patria_rehabilitada_transitoria",
    ] as const)
      exacto(
        evaluarHechosB2025(can, {
          ...mono,
          hijos: mono.hijos.map((p) => ({
            ...p,
            medida,
            resolucion: { ...resolucion, fecha: "2020-01-01" },
          })),
        }),
        "200"
      )
    expect(
      evaluarHechosB2025(can, {
        ...mono,
        hijos: mono.hijos.map((p) => ({
          ...p,
          medida: "curatela_asistencial" as const,
        })),
      }).estado
    ).toBe("excluida")
  })
  it("no acepta afirmación sin resolución y excluye límite exacto", () => {
    expect(
      evaluarHechosB2025(can, {
        ...mono,
        hijos: mono.hijos.map((p) => ({ ...p, resolucion: null })),
      }).estado
    ).toBe("no_soportado")
    expect(
      evaluarHechosB2025(can, { ...mono, baseLiquidableMenosMinimo: "31485" })
        .estado
    ).toBe("excluida")
  })
  it("no mezcla territorios o colecciones parciales", () => {
    expect(evaluarHechosB2025(ast, salud()).estado).toBe("no_soportado")
    expect(
      evaluarHechosB2025({ ...can, exhaustividad: "incompleta" }, salud())
        .estado
    ).toBe("no_soportado")
    const r = evaluarHechosB2025({ ...can, declarantes: ["A", "A"] }, salud())
    expect(r.estado).toBe("no_soportado")
    expect(r).not.toHaveProperty("importeExacto")
  })
})

describe("Regresiones de identidad y antecedentes temporales", () => {
  it("no permite acogido con identidad de acogedor", () => {
    expect(
      evaluarHechosB2025(ast, menores({ ...acogido(), id: "A" })).estado
    ).toBe("no_soportado")
    expect(
      evaluarHechosB2025(
        ast,
        menores({ ...acogido(), id: "B", titulares: ["A", "B"] })
      ).estado
    ).toBe("no_soportado")
  })
  it("no permite hijo estudiante con identidad de declarante/progenitor", () => {
    const h = estudios("0")
    expect(
      evaluarHechosB2025(can, {
        ...h,
        hijos: h.hijos.map((p) => ({ ...p, id: "A" })),
      }).estado
    ).toBe("no_soportado")
  })
  it("no permite hijo monoparental con identidad del progenitor", () => {
    const h: HechosB = {
      codigo: "cantabria_familias_monoparentales",
      baseLiquidableMenosMinimo: "10000",
      estadoCivil: "sin_vinculo",
      hijos: [
        {
          id: "A",
          nacimiento: "2010-01-01",
          convivencia: "si",
          emancipacionConsentida: "no",
          medida: "ninguna",
          resolucion: null,
          representante: null,
        },
      ],
    }
    expect(evaluarHechosB2025(can, h).estado).toBe("no_soportado")
  })
  it("resolución judicial no puede ser anterior al nacimiento del hijo", () => {
    const h: HechosB = {
      codigo: "cantabria_familias_monoparentales",
      baseLiquidableMenosMinimo: "10000",
      estadoCivil: "sin_vinculo",
      hijos: [
        {
          id: "H",
          nacimiento: "1997-01-01",
          convivencia: "si",
          emancipacionConsentida: "no",
          medida: "curatela_representativa",
          resolucion: { ...resolucion, fecha: "1996-01-01" },
          representante: "A",
        },
      ],
    }
    expect(evaluarHechosB2025(can, h).estado).toBe("no_soportado")
  })
  it("acogimiento requiere resolución posterior al nacimiento", () => {
    expect(
      evaluarHechosB2025(
        ast,
        menores({
          ...acogido(),
          resolucion: { ...resolucion, fecha: "2014-12-31" },
        })
      ).estado
    ).toBe("no_soportado")
  })
  it("mínimo familiar no puede contener al propio declarante", () => {
    expect(
      evaluarHechosB2025(can, { ...salud(), personasMinimo: ["A"] }).estado
    ).toBe("no_soportado")
  })
})

describe("Cronología del expediente", () => {
  it("no confunde nueva patria potestad con antecedente transitorio", () => {
    const h: HechosB = {
      codigo: "cantabria_familias_monoparentales",
      baseLiquidableMenosMinimo: "10000",
      estadoCivil: "sin_vinculo",
      hijos: [
        {
          id: "H",
          nacimiento: "1997-01-01",
          convivencia: "si",
          emancipacionConsentida: "no",
          medida: "patria_prorrogada_transitoria",
          resolucion,
          representante: "A",
        },
      ],
    }
    expect(evaluarHechosB2025(can, h).estado).toBe("no_soportado")
  })
})

describe("Intervalos y precisión de cálculo", () => {
  it("no admite convivencia antes del inicio, tras el fin o mayor que los días posibles", () => {
    for (const cambios of [
      { inicioAcogimiento: "2025-12-31" },
      { inicioAcogimiento: "2014-01-01" },
      { inicioAcogimiento: "2026-01-01", finAcogimiento: "2026-12-31" },
      { inicioAcogimiento: "2025-06-01", finAcogimiento: "2025-05-31" },
    ])
      expect(
        evaluarHechosB2025(ast, menores({ ...acogido(), ...cambios })).estado
      ).toBe("no_soportado")
  })
  it("cuenta ventana anual de acogimiento iniciado antes de2025", () => {
    exacto(
      evaluarHechosB2025(
        ast,
        menores({
          ...acogido(365),
          inicioAcogimiento: "2024-01-01",
          finAcogimiento: "2026-12-31",
        })
      ),
      "500"
    )
  })
  it("rechaza la identidad del segundo progenitor aunque no declare", () => {
    const h = estudios("0")
    expect(
      evaluarHechosB2025(can, {
        ...h,
        hijos: h.hijos.map((p) => ({ ...p, id: "B" })),
      }).estado
    ).toBe("no_soportado")
  })
  it("no genera200 por estudios terminados antes del ejercicio", () => {
    const h = estudios("0")
    exacto(
      evaluarHechosB2025(can, {
        ...h,
        hijos: h.hijos.map((p) => ({
          ...p,
          inicioEstudios: "2023-09-01",
          finEstudios: "2024-06-30",
        })),
      }),
      "0"
    )
    expect(
      evaluarHechosB2025(can, {
        ...h,
        hijos: h.hijos.map((p) => ({ ...p, inicioEstudios: "2004-01-01" })),
      }).estado
    ).toBe("no_soportado")
  })
  it("certificación no supone que ya era propietario", () => {
    const h: HechosB = {
      codigo: "asturias_certificacion_gestion_forestal_sostenible",
      monte: "Monte",
      municipioAsturias: "33001",
      fechaAdquisicionMonte: "2026-01-01",
      propietarios: ["A"],
      certificacion: resolucion,
      emisor: "entidad_regional",
      pagosCertificacion: [pago("1000")],
      subvenciones: "0",
      reparto,
    }
    expect(evaluarHechosB2025(ast, h).estado).toBe("no_soportado")
    expect(
      evaluarHechosB2025(ast, {
        ...h,
        fechaAdquisicionMonte: "2024-12-31",
        certificacion: { ...resolucion, fecha: "2025-12-31" },
        pagosCertificacion: [{ ...pago("1000"), fecha: "2024-01-01" }],
      }).estado
    ).toBe("no_soportado")
  })
  it("suma racional de dos repartos sin redondeos intermedios", () => {
    const h: HechosB = {
      codigo: "asturias_acogimiento_familiar_menores",
      personas: [
        { ...acogido(), id: "H1", titulares: ["A", "B", "C"] },
        {
          ...acogido(91),
          id: "H2",
          titulares: ["A", "B", "C", "D", "E", "F", "G"],
        },
      ],
    }
    exacto(evaluarHechosB2025(ast, h), "4250", "21")
  })
  it("retiene fracciones de céntimo: 15% de0,01=0,0015", () => {
    const h: HechosB = {
      codigo: "cantabria_gastos_educacion",
      unidadFamiliar: "U1",
      miembros: ["A", "B", "H"],
      gastos: [
        {
          ...pago("0.01"),
          descendiente: "H",
          etapa: "eso",
          concepto: "idiomas_extraescolares",
          prestador: "persona_iae",
        },
      ],
    }
    exacto(evaluarHechosB2025(conjunta, h), "3", "2000")
  })
  it("cero gasto de2025 no se sustituye por un pago de otro año", () => {
    const h: HechosB = {
      codigo: "asturias_gastos_vitales_hasta_35",
      nacimiento: "2000-01-01",
      gastos: [
        { ...pago("999.99"), fecha: "2024-12-31", concepto: "educacion" },
      ],
    }
    exacto(evaluarHechosB2025(ast, h), "0")
  })
})
