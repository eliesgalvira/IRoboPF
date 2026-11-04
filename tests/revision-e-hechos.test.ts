import { expect, it } from "vitest"
import {
  evaluarHechosE2025,
  type HechosE2025,
} from "../lib/dominio/irpf/deducciones/galicia-rioja-hechos-2025"

// Oráculos literales fijados desde los artículos, nunca desde el retorno del candidato.
const marco = (territorio: "galicia" | "la-rioja") =>
  ({
    contexto: {
      ejercicio: 2025,
      territorio,
      modalidad: "individual",
      contribuyente: "A",
    },
    coleccion: "exhaustiva_2025",
    creditoFiscalMecenazgoRioja: "no_aplicado",
  }) as const
const pago = (importe: string, id = "p1") => ({
  id,
  pagador: "A",
  receptor: "R",
  fecha: "2025-06-15",
  importe,
  factura: id,
})
function importe(h: HechosE2025, esperado: string): void {
  const r = evaluarHechosE2025(h)
  expect(r.estado).toBe("calculo_parcial")
  if (r.estado !== "calculo_parcial") throw new Error(r.motivos.join("; "))
  expect(r.presentacionEuros).toBe(esperado)
  expect(r.aceptacionFiscal).toBe("pendiente")
}
const familia = (grado: number, titulares: readonly string[]): HechosE2025 => ({
  ...marco("galicia"),
  codigo: "galicia_familias_dos_hijos",
  familia: {
    contribuyente: { id: "A", nacimiento: "1980-01-01", discapacidad: grado },
    descendientes: ["H", "J"].map((id) => ({
      id,
      nacimiento: "2010-02-01",
      discapacidad: 0,
      titularesMinimo: titulares,
    })),
    titularesMismosDescendientes: titulares,
    eleccionFamilia: "dos_hijos",
  },
})
it.each([
  [0, ["A"], "250.00"],
  [65, ["A"], "500.00"],
  [64.99, ["A", "B"], "125.00"],
  [65, ["A", "B"], "250.00"],
] as const)("dos hijos: grado %s", (g, t, e) => importe(familia(g, t), e))

it.each([
  ["simple", null, "300.00"],
  ["preadoptivo", "2025-10-01", "0.00"],
  ["preadoptivo", "2026-01-01", "300.00"],
] as const)("acogimiento %s adopción %s", (regimen, adopcion, e) => {
  importe(
    {
      ...marco("galicia"),
      codigo: "galicia_acogimiento_menores",
      menores: [
        {
          id: "H",
          nacimiento: "2010-01-01",
          desde: "2025-01-01",
          hasta: "2025-12-31",
          regimen,
          adopcion,
          resolucionXunta: "exp-X",
          acogedores: ["A"],
          vinculoAcogedores: "unico",
        },
      ],
    },
    e
  )
})

it.each([
  ["28000", "6000", "600.00"],
  ["28000.01", "6000", "0.00"],
] as const)("terceros frontera renta %s", (base, min, e) => {
  importe(
    {
      ...marco("galicia"),
      codigo: "galicia_discapacidad_mayor_65_ayuda_terceras_personas",
      persona: { id: "A", nacimiento: "1960-12-31", discapacidad: 65 },
      baseImponible: base,
      minimoPersonalFamiliar: min,
      necesidadTerceros: "dictamen",
      residencia: "domicilio",
      pagos: [pago("9000")],
    },
    e
  )
})
it.each([
  ["2024-01-01", "0.00"],
  ["2025-01-01", "100.00"],
  [null, "100.00"],
] as const)("internet historia anterior %s", (alta, e) => {
  importe(
    {
      ...marco("galicia"),
      codigo: "galicia_nuevas_tecnologias_hogares",
      contratos: [
        {
          id: "C",
          titular: "A",
          alta: "2025-02-01",
          velocidad: "alta",
          uso: "hogar_exclusivo",
          contratoAnterior: alta !== null ? { alta } : null,
          lineasAnterioresSimultaneas: [],
          pagos: [{ ...pago("1000"), concepto: "cuota" }],
        },
      ],
    },
    e
  )
})
it.each([
  ["privativo", [], "65.00"],
  ["gananciales", ["A", "B"], "32.50"],
] as const)(
  "bicicletas %s límite por vehículo antes de reparto",
  (regimen, conyuges, e) => {
    importe(
      {
        ...marco("la-rioja"),
        codigo: "rioja_bicicletas_pedaleo_no_asistido",
        regimen,
        conyuges,
        bicicletas: [
          { id: "b1", asistencia: "no", pago: pago("1000") },
          { id: "b2", asistencia: "no", pago: pago("100", "p2") },
        ],
      },
      e
    )
  }
)
function sanitario(
  codigo: "rioja_enfermos_ela" | "rioja_ejercicio_fisico_deporte",
  euros: string,
  titulares: readonly string[],
  nacimiento = "2010-01-01",
  discapacidad = 0
): HechosE2025 {
  // Un solo beneficiario. A paga TODO el expediente; no se omiten pagos de B.
  return {
    ...marco("la-rioja"),
    codigo,
    beneficiario: { id: "H", nacimiento, discapacidad },
    relacion: "minimo",
    beneficiariosDelEjercicio: ["H"],
    titularesMinimo: titulares,
    titularesDeduccion: titulares,
    diagnosticoEla: "diagnostico",
    pagos: [
      {
        ...pago(euros),
        facturaTipo: "ordinaria",
        concepto:
          codigo === "rioja_enfermos_ela"
            ? "profesional_sanitario"
            : "clases_deporte",
        territorio: "la-rioja",
        origenServicio: "2025-03-01",
      },
    ],
  }
}
it.each([
  ["1000", ["A"], "500.00"],
  ["1000", ["A", "B"], "250.00"],
  ["10000", ["A"], "2000.00"],
  ["10000", ["A", "B"], "1000.00"],
] as const)("ELA expediente completo %s", (v, t, e) =>
  importe(sanitario("rioja_enfermos_ela", v, t), e)
)
it.each([
  ["500", ["A"], "150.00"],
  ["500", ["A", "B"], "75.00"],
  ["2000", ["A", "B"], "150.00"],
] as const)("deporte expediente completo %s", (v, t, e) =>
  importe(sanitario("rioja_ejercicio_fisico_deporte", v, t), e)
)
it.each([
  ["1960-12-31", 0, "30.00"],
  ["1959-12-31", 0, "100.00"],
  ["2010-01-01", 33, "100.00"],
] as const)("deporte edad/discapacidad beneficiario %s", (n, d, e) =>
  importe(sanitario("rioja_ejercicio_fisico_deporte", "100", ["A"], n, d), e)
)
it.each(["rioja_enfermos_ela", "rioja_ejercicio_fisico_deporte"] as const)(
  "%s pagos de dos personas: rama hoy no soportada, no importe cero",
  (codigo) => {
    const h = sanitario(codigo, "1000", ["A", "B"])
    if (
      h.codigo !== "rioja_enfermos_ela" &&
      h.codigo !== "rioja_ejercicio_fisico_deporte"
    )
      throw new Error("fixture")
    expect(
      evaluarHechosE2025({
        ...h,
        pagos: [
          ...h.pagos,
          { ...h.pagos[0], id: "p2", factura: "p2", pagador: "B" },
        ],
      }).estado
    ).toBe("no_soportado")
  }
)
it("cuotas agrarias máximo personal: 75+75 alcanza 100", () =>
  importe(
    {
      ...marco("la-rioja"),
      codigo: "rioja_cuotas_organizaciones_profesionales_agrarias",
      cuotas: ["p1", "p2"].map((id) => ({
        pago: pago("75", id),
        constitucion: "ley_19_1977",
        certificadoAnual: "cert",
      })),
    },
    "100.00"
  ))
it("especial interés remanente por entidad: 1000+10000 de base produce 2200", () =>
  importe(
    {
      ...marco("galicia"),
      codigo: "galicia_inversion_proyectos_especial_interes",
      entidades: ["E1", "E2"].map((id, i) => ({
        id,
        objeto: "exclusivo_proyecto",
        declaracionLey2_2024: "res",
        fechaDeclaracion: "2025-01-01",
        historia: "exhaustiva",
        baseConsumidaAnterior: i === 0 ? "9000" : "0",
        otrasDeduccionesMismaInversion: [],
        operaciones: [
          {
            id: `o${i}`,
            tipo: "ampliacion",
            fecha: "2025-03-01",
            pago: { ...pago("12000", `p${i}`), receptor: id },
          },
        ],
      })),
    },
    "2200.00"
  ))
it.each([
  ["1000", "25.00"],
  ["100", "10.00"],
] as const)("I+D+i cuota %s", (cuota, e) =>
  importe(
    {
      ...marco("galicia"),
      codigo: "galicia_donaciones_idi",
      cuotaIntegraAutonomica: cuota,
      donaciones: [
        {
          pago: pago("100"),
          destinatario: "centro_universidad_gallega",
          objeto: "investigacion_desarrollo_innovacion",
          comunicacionAtriGa: "registro",
          fechaComunicacion: "2026-01-20",
        },
      ],
    },
    e
  )
)
