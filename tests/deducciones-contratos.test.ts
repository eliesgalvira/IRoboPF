import {
  evaluarCeliaquiaRioja,
  evaluarNacimientoMadrid,
  calcularGuarderiaMurciaParcial,
  excluirAlquilerCatalan,
  excluirCooperativaCatalana,
  comprobarIncompatibilidadExtremena,
  totalDeduccionesEvaluadas,
} from "../lib/dominio/irpf/deducciones/contratos-2025"
import { expect, it } from "vitest"
import {
  evaluarNacimientoAndaluz,
  calcularNacimientoCanarioParcial,
  evaluarConsignacion,
} from "../lib/dominio/irpf/deducciones/contratos-2025"

const contexto = {
  ejercicio: 2025,
  territorio: "andalucia",
  contribuyente: "madre",
  modalidad: "individual" as const,
}

it("DED-I-05 agregado vacío fuera de 2025 no declara evaluación automática", () => {
  expect(
    totalDeduccionesEvaluadas(
      { ...contexto, ejercicio: 2024, territorio: "galicia" },
      []
    )
  ).toMatchObject({ estado: "no_soportado" })
})
const evento = {
  id: "parto",
  ejercicio: 2025,
  tipo: "nacimiento" as const,
  hijos: ["a", "b"],
  titulares: ["madre"],
  municipio: "ordinario" as const,
  diasAcogimiento: 0,
  ayudaAcogimiento: 0,
}

it("DED-I-01 una exclusión individual no cancela un cálculo parcial colectivo", () => {
  const ctx = { ...contexto, territorio: "la-rioja" }
  const p = {
    id: "hijo",
    relacion: "descendiente" as const,
    titularesDeduccion: ["madre", "padre"],
    titularesDelMinimo: ["madre"],
    certificado: {
      referencia: "informe",
      medico: "medico",
      colegiado: "numero",
      especialidad: "especialidad",
      fechaEmision: "2025-06-01",
      fechaDiagnostico: "2025-01-01",
      diagnostico: "definitivo" as const,
      ejercicioMedico: "activo" as const,
    },
  }
  for (const otro of [
    { ...p, id: "otro", titularesDelMinimo: [] },
    {
      ...p,
      id: "otro",
      certificado: {
        ...p.certificado,
        fechaDiagnostico: "2026-01-01",
        fechaEmision: "2026-01-01",
      },
    },
  ]) {
    expect(evaluarCeliaquiaRioja(ctx, [p, otro])).toMatchObject({
      estado: "calculo_parcial",
      importe: 125,
    })
    expect(
      totalDeduccionesEvaluadas(ctx, [
        { tipo: "rioja_celiaquia", contexto: ctx, personas: [p, otro] },
      ])
    ).toMatchObject({ estado: "no_soportado" })
  }
})
it.each([NaN, Infinity, 2024.5])(
  "DED-I-04 rechaza año de evento inválido %s",
  (ejercicio) => {
    expect(
      evaluarNacimientoMadrid(
        { ...contexto, territorio: "madrid" },
        { ejercicio, hijos: ["hijo"], progenitoresConvivientes: ["madre"] },
        []
      )
    ).toMatchObject({ estado: "no_soportado" })
  }
)
it("gemelos andaluces con hechos y titulares", () => {
  expect(evaluarNacimientoAndaluz(contexto, [evento], [])).toMatchObject({
    estado: "evaluacion_automatica",
    importe: 800,
  })
})
it("reparte sin personas fraccionarias", () => {
  expect(
    evaluarNacimientoAndaluz(
      contexto,
      [{ ...evento, hijos: ["a"], titulares: ["madre", "padre"] }],
      []
    )
  ).toMatchObject({ importe: 100 })
})
it("no acumula familia numerosa", () => {
  expect(
    evaluarNacimientoAndaluz(
      contexto,
      [evento],
      [{ contribuyente: "madre", codigo: "andalucia_familia_numerosa" }]
    )
  ).toMatchObject({ estado: "no_soportado" })
})
it("canarias distingue orden general y de discapacidad", () => {
  expect(
    calcularNacimientoCanarioParcial(
      [{ id: "a", orden: 3, ordenDiscapacidad: 1 }],
      ["madre"],
      "madre"
    )
  ).toMatchObject({ estado: "calculo_parcial", importe: 1130 })
  expect(
    calcularNacimientoCanarioParcial(
      [
        { id: "a", orden: 3, ordenDiscapacidad: 0 },
        { id: "b", orden: 4, ordenDiscapacidad: 0 },
      ],
      ["madre"],
      "madre"
    )
  ).toMatchObject({ importe: 1326 })
})
it("consignación ajena no se aplica", () => {
  expect(
    evaluarConsignacion(contexto, {
      ejercicio: 2025,
      territorio: "galicia",
      contribuyente: "madre",
      codigo: "galicia_familias_dos_hijos",
      importe: 999999,
      soporte: "expediente-profesional",
    })
  ).toMatchObject({ estado: "excluida" })
})

it("cero beneficiarios no genera una persona", () => {
  expect(
    evaluarCeliaquiaRioja({ ...contexto, territorio: "la-rioja" }, [])
  ).toMatchObject({ importe: 0 })
})
it("Madrid excluye un céntimo sobre base y exige historia", () => {
  const ctx = { ...contexto, territorio: "madrid" }
  const eventoMadrid = {
    ejercicio: 2025,
    hijos: ["a", "b"],
    progenitoresConvivientes: ["madre"],
  }
  expect(
    evaluarNacimientoMadrid(ctx, eventoMadrid, [
      {
        ejercicio: 2025,
        general: 30930,
        ahorro: 0,
        basesUnidadFamiliar: [30930],
      },
    ])
  ).toMatchObject({ importe: 2886.8 })
  expect(
    evaluarNacimientoMadrid(ctx, eventoMadrid, [
      {
        ejercicio: 2025,
        general: 30930.01,
        ahorro: 0,
        basesUnidadFamiliar: [30930.01],
      },
    ])
  ).toMatchObject({ estado: "excluida" })
  expect(
    evaluarNacimientoMadrid(ctx, { ...eventoMadrid, ejercicio: 2024 }, [])
  ).toMatchObject({ estado: "no_soportado" })
})
it("Murcia reparte el tope por hijo después de calcular gastos comunes", () => {
  const gasto = {
    hijo: "a",
    titulares: ["madre"],
    custodia: 5000,
    alimentacion: 0,
    vestuarioEscolar: 0,
    ayudas: 0,
  }
  expect(
    calcularGuarderiaMurciaParcial(
      { ...contexto, territorio: "murcia" },
      [gasto, { ...gasto, hijo: "b" }],
      30000
    )
  ).toMatchObject({ importe: 2000 })
  expect(
    calcularGuarderiaMurciaParcial(
      { ...contexto, territorio: "murcia" },
      [{ ...gasto, custodia: 10000, titulares: ["madre", "padre"] }],
      30000
    )
  ).toMatchObject({ importe: 500 })
})
it("Andalucía pierde derecho al acogimiento sin 90 días", () => {
  expect(
    evaluarNacimientoAndaluz(
      contexto,
      [{ ...evento, hijos: ["a"], tipo: "acogimiento", diasAcogimiento: 89 }],
      []
    )
  ).toMatchObject({ importe: 0 })
  expect(
    evaluarNacimientoAndaluz(
      contexto,
      [{ ...evento, hijos: ["a"], tipo: "acogimiento", diasAcogimiento: 90 }],
      []
    )
  ).toMatchObject({ importe: 200 })
})

it("exclusiones catalanas no confunden base admisible con cobertura completa", () => {
  expect(excluirAlquilerCatalan(30000.01)).toMatchObject({ estado: "excluida" })
  expect(excluirAlquilerCatalan(30000)).toMatchObject({
    estado: "no_soportado",
  })
  expect(excluirCooperativaCatalana("temporal")).toMatchObject({
    estado: "excluida",
  })
})
it("incompatibilidad extremeña refiere al mismo contribuyente", () => {
  expect(
    comprobarIncompatibilidadExtremena([
      { contribuyente: "a", codigo: "extremadura_contribuyentes_viudos" },
      { contribuyente: "a", codigo: "extremadura_trabajo_dependiente" },
    ])
  ).toMatchObject({ motivo: expect.stringContaining("incompatibles") })
  expect(
    comprobarIncompatibilidadExtremena([
      { contribuyente: "a", codigo: "extremadura_contribuyentes_viudos" },
      { contribuyente: "b", codigo: "extremadura_trabajo_dependiente" },
    ])
  ).toMatchObject({ motivo: expect.stringContaining("Sin conflicto") })
})
it("el agregado rechaza parcial y duplicado, sin cero ficticio", () => {
  expect(
    totalDeduccionesEvaluadas({ ...contexto, territorio: "canarias" }, [
      {
        tipo: "canarias_nacimiento",
        contexto: { ...contexto, territorio: "canarias" },
        hijos: [{ id: "a", orden: 3, ordenDiscapacidad: 1 }],
        titulares: ["madre"],
      },
    ])
  ).toMatchObject({ estado: "no_soportado" })
  const solicitud = {
    tipo: "andalucia_nacimiento" as const,
    contexto,
    eventos: [evento],
    elecciones: [],
  }
  expect(
    totalDeduccionesEvaluadas(contexto, [solicitud, solicitud])
  ).toMatchObject({ estado: "no_soportado" })
})
it.each([2024, 2026])("contrato nuevo no hereda %s", (ejercicio) => {
  expect(
    evaluarNacimientoAndaluz({ ...contexto, ejercicio }, [evento], [])
  ).toMatchObject({ estado: "no_soportado" })
})

it("Rioja reparte 250 entre dos titulares de una persona diagnosticada", () => {
  const persona = {
    id: "hijo",
    relacion: "descendiente" as const,
    titularesDelMinimo: ["madre", "padre"],
    titularesDeduccion: ["madre", "padre"],
    certificado: {
      referencia: "cert-1",
      medico: "medico-1",
      colegiado: "col-1",
      especialidad: "digestivo",
      fechaEmision: "2025-10-10",
      fechaDiagnostico: "2025-10-01",
      diagnostico: "definitivo" as const,
      ejercicioMedico: "activo" as const,
    },
  }
  expect(
    evaluarCeliaquiaRioja({ ...contexto, territorio: "la-rioja" }, [persona])
  ).toMatchObject({ importe: 125 })
  expect(
    evaluarCeliaquiaRioja({ ...contexto, territorio: "la-rioja" }, [
      { ...persona, certificado: null },
    ])
  ).toMatchObject({ estado: "no_soportado" })
})
it("consignación gallega conserva su naturaleza y su importe", () => {
  const ctx = { ...contexto, territorio: "galicia" }
  expect(
    evaluarConsignacion(ctx, {
      ...ctx,
      codigo: "galicia_familias_dos_hijos",
      importe: 999999,
      soporte: "expediente-1",
    })
  ).toMatchObject({ estado: "importe_externo", importe: 999999 })
})
it.each([0.5, -1, Number.NaN])(
  "rechaza órdenes canarios inválidos: %s",
  (orden) => {
    expect(
      calcularNacimientoCanarioParcial(
        [{ id: "a", orden, ordenDiscapacidad: 0 }],
        ["madre"],
        "madre"
      )
    ).toMatchObject({ estado: "no_soportado" })
  }
)
