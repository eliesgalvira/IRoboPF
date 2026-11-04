import { expect, it } from "vitest"
import {
  evaluarHechosB2025,
  type HechosB,
  type MarcoB,
  type PagoB,
  type ResultadoB,
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
const doc = { referencia: "EXP", organismo: "Autoridad", fecha: "2025-01-01" }
const reparto = {
  titulares: ["A", "B"],
  exhaustividadTitulares: "completa" as const,
}
function pago(euros: string, id = "P"): PagoB {
  return {
    id,
    euros,
    pagador: "A",
    receptor: "Proveedor",
    documento: "Factura",
    fecha: "2025-05-01",
    medio: "transferencia",
  }
}
function euros(r: ResultadoB, n: bigint, d = 1n): void {
  expect(r.estado).toBe("calculo_parcial")
  if (r.estado === "calculo_parcial") {
    // La salida promete enteros racionales reducidos; ninguna fórmula del producto actúa como oráculo.
    expect(BigInt(r.importeExacto.numeradorEuros) * d).toBe(
      n * BigInt(r.importeExacto.divisor)
    )
    expect(r.aceptacionFiscal).toBe("pendiente")
    expect(r.aplicacionCuota).toBe("pendiente_padre")
  }
}
const forestal: Extract<
  HechosB,
  { codigo: "asturias_certificacion_gestion_forestal_sostenible" }
> = {
  codigo: "asturias_certificacion_gestion_forestal_sostenible",
  monte: "Parcela única",
  municipioAsturias: "33001",
  fechaAdquisicionMonte: "2020-01-01",
  propietarios: ["A", "B"],
  certificacion: doc,
  emisor: "entidad_regional",
  pagosCertificacion: [pago("3000"), { ...pago("3000", "P2"), pagador: "B" }],
  subvenciones: "0",
  reparto,
}
// Art.14.3: máximo 1000 POR CONTRIBUYENTE; art.14.4 reparto individual.
// 6000 comunes /2 -> 3000 por persona; 30%=900, inferior al máximo personal.
it("RBM01: no convierte el máximo personal forestal en máximo de la parcela", () => {
  euros(evaluarHechosB2025(ast, forestal), 900n)
  euros(
    evaluarHechosB2025(
      { ...ast, contribuyente: "B", declarantes: ["B"] },
      forestal
    ),
    900n
  )
})
it("RBM01: cada titular puede alcanzar 1000, total 2000 entre dos", () => {
  euros(
    evaluarHechosB2025(ast, {
      ...forestal,
      pagosCertificacion: [pago("10000")],
    }),
    1000n
  )
})
it("forestal sin activación de tope: gasto 6000 menos ayuda4000, mitad de600", () => {
  euros(evaluarHechosB2025(ast, { ...forestal, subvenciones: "4000" }), 300n)
})

it.each([
  [90, 0n],
  [91, 125n],
  [182, 125n],
  [183, 250n],
  [365, 250n],
])("menores: %i días y dos titulares individuales", (dias, esperado) => {
  euros(
    evaluarHechosB2025(ast, {
      codigo: "asturias_acogimiento_familiar_menores",
      personas: [
        {
          ...reparto,
          id: "H",
          nacimiento: "2015-06-01",
          diasConvivencia: dias,
          inicioAcogimiento: "2025-01-01",
          finAcogimiento: "2025-12-31",
          resolucion: doc,
          regimen: "familiar",
          contraprestacion: "0",
          ayudasAsturiasAcogedor: "0",
          ayudasAsturiasAcogido: "0",
          gradoParentesco: null,
        },
      ],
    }),
    esperado
  )
})
it.each([
  ["2000-12-31", 2000n],
  ["1999-12-31", 1500n],
  ["1996-12-31", 1500n],
  ["1994-12-31", 1000n],
  ["1990-12-31", 1000n],
])("vitales individual: nacimiento %s", (nacimiento, esperado) => {
  euros(
    evaluarHechosB2025(
      { ...ast, baseGeneral: "27999.99", baseAhorro: "0.01" },
      {
        codigo: "asturias_gastos_vitales_hasta_35",
        nacimiento,
        gastos: [{ ...pago("9999"), concepto: "cultura" }],
      }
    ),
    esperado
  )
})
it("R30 queda reservada y conjunta vitales fuera del contrato", () => {
  const h: HechosB = {
    codigo: "asturias_gastos_vitales_hasta_35",
    nacimiento: "1995-12-31",
    gastos: [{ ...pago("2000"), concepto: "educacion" }],
  }
  expect(evaluarHechosB2025(ast, h).estado).toBe("no_soportado")
  expect(
    evaluarHechosB2025(
      { ...ast, modalidad: "conjunta", declarantes: ["A", "B"] },
      { ...h, nacimiento: "1994-12-31" }
    ).estado
  ).toBe("no_soportado")
})
function estudios(rentaAnual: string, municipioResidencia = "39003"): HechosB {
  return {
    codigo: "cantabria_traslado_estudios_despoblamiento",
    municipioResidencia,
    pruebaResidencia: doc,
    hijos: [
      {
        id: "H",
        nacimiento: "2001-12-31",
        rentaAnual,
        progenitores: ["A", "B"],
        inicioEstudios: "2025-09-01",
        finEstudios: "2026-06-30",
        relacion: "hijo",
        municipioEstudios: "39075",
        etapa: "fp",
        pagosTraslado: [pago("0.01")],
      },
    ],
  }
}
it.each([
  ["7999.99", 100n],
  ["8000", 0n],
  ["8000.01", 0n],
])("BC02 renta %s estricta", (renta, esperado) =>
  euros(evaluarHechosB2025(can, estudios(renta)), esperado)
)
it.each(["39003", "39032", "39070", "39086"])(
  "residencia auditada %s",
  (municipio) => euros(evaluarHechosB2025(can, estudios("0", municipio)), 100n)
)
it("Santander fuera de lista", () =>
  expect(evaluarHechosB2025(can, estudios("0", "39075")).estado).toBe(
    "excluida"
  ))
it("educación conjunta suma gastos de ambos y limita a200 por familia", () => {
  const h: HechosB = {
    codigo: "cantabria_gastos_educacion",
    unidadFamiliar: "UF",
    miembros: ["A", "B", "H"],
    gastos: [
      {
        ...pago("180"),
        descendiente: "H",
        etapa: "eso",
        concepto: "libros",
        prestador: "centro_docente",
      },
      {
        ...pago("400", "P2"),
        pagador: "B",
        descendiente: "H",
        etapa: "eso",
        concepto: "idiomas_extraescolares",
        prestador: "persona_iae",
      },
    ],
  }
  euros(
    evaluarHechosB2025(
      { ...can, modalidad: "conjunta", declarantes: ["A", "B"] },
      h
    ),
    200n
  )
  expect(evaluarHechosB2025(can, h).estado).toBe("no_soportado")
})
function mono(
  medida:
    | "curatela_representativa"
    | "curatela_asistencial"
    | "patria_prorrogada_transitoria",
  fecha: string
): HechosB {
  return {
    codigo: "cantabria_familias_monoparentales",
    baseLiquidableMenosMinimo: "31484.99",
    estadoCivil: "separacion_legal",
    hijos: [
      {
        id: "H",
        nacimiento: "1997-01-01",
        convivencia: "si",
        emancipacionConsentida: "no",
        medida,
        resolucion: { ...doc, fecha },
        representante: "A",
      },
    ],
  }
}
it("BC01 representativa tiene200; asistencial insuficiente", () => {
  euros(
    evaluarHechosB2025(can, mono("curatela_representativa", "2025-01-01")),
    200n
  )
  expect(
    evaluarHechosB2025(can, mono("curatela_asistencial", "2025-01-01")).estado
  ).toBe("excluida")
})
it("antecedente transitorio: frontera2/9 frente3/9/2021", () => {
  euros(
    evaluarHechosB2025(
      can,
      mono("patria_prorrogada_transitoria", "2021-09-02")
    ),
    200n
  )
  expect(
    evaluarHechosB2025(can, mono("patria_prorrogada_transitoria", "2021-09-03"))
      .estado
  ).toBe("no_soportado")
})
