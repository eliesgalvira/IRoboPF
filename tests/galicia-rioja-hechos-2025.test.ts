import { describe, expect, it } from "vitest"
import {
  evaluarHechosE2025,
  reutilizarCeliaquiaRioja2025,
} from "../lib/dominio/irpf/deducciones/galicia-rioja-hechos-2025"
import type { HechosE2025 } from "../lib/dominio/irpf/deducciones/galicia-rioja-hechos-2025"

const marco = {
  contexto: {
    ejercicio: 2025,
    territorio: "galicia",
    modalidad: "individual",
    contribuyente: "A",
  },
  coleccion: "exhaustiva_2025",
  creditoFiscalMecenazgoRioja: "no_aplicado",
} as const
const rioja = {
  ...marco,
  contexto: { ...marco.contexto, territorio: "la-rioja" },
} as const
const persona = { id: "A", nacimiento: "1960-01-01", discapacidad: 0 }
const pago = {
  id: "P",
  pagador: "A",
  receptor: "R",
  fecha: "2025-08-01",
  importe: "1000",
  factura: "F",
}
function importe(
  h: HechosE2025,
  esperado: string,
  numerador = esperado,
  divisor = 1
): void {
  const r = evaluarHechosE2025(h)
  expect(r.estado).toBe("calculo_parcial")
  if (r.estado !== "calculo_parcial") throw new Error(r.motivos.join(";"))
  expect(r.presentacionEuros).toBe(esperado)
  // Compara valor racional sin comparar la escala textual del numerador.
  expect(Number(r.exacto.numeradorEuros)).toBe(Number(numerador))
  expect(r.exacto.divisor).toBe(divisor)
  expect(r.aceptacionFiscal).toBe("pendiente")
  expect(r.cuota).toBe("pendiente_aplicacion_compartida")
  expect(r.rastro.length).toBeGreaterThan(0)
}
function rechaza(h: HechosE2025): void {
  const r = evaluarHechosE2025(h)
  expect(r.estado).toBe("no_soportado")
  expect("exacto" in r).toBe(false)
  expect("presentacionEuros" in r).toBe(false)
}
const bici = {
  ...rioja,
  codigo: "rioja_bicicletas_pedaleo_no_asistido",
  regimen: "privativo",
  conyuges: [],
  bicicletas: [
    { id: "B1", asistencia: "no", pago: { ...pago, importe: "200" } },
  ],
} as const
const ayuda = {
  ...marco,
  codigo: "galicia_discapacidad_mayor_65_ayuda_terceras_personas",
  persona: { ...persona, discapacidad: 65 },
  baseImponible: "30000",
  minimoPersonalFamiliar: "8000",
  necesidadTerceros: "dictamen-1",
  residencia: "domicilio",
  pagos: [pago],
} as const
const familia = {
  ...marco,
  codigo: "galicia_familias_dos_hijos",
  familia: {
    contribuyente: persona,
    descendientes: [
      {
        id: "H1",
        nacimiento: "2010-04-01",
        discapacidad: 0,
        titularesMinimo: ["A", "B", "C"],
      },
      {
        id: "H2",
        nacimiento: "2012-04-01",
        discapacidad: 0,
        titularesMinimo: ["A", "B", "C"],
      },
    ],
    titularesMismosDescendientes: ["A", "B", "C"],
    eleccionFamilia: "dos_hijos",
  },
} as const
const tecnologia = {
  ...marco,
  codigo: "galicia_nuevas_tecnologias_hogares",
  contratos: [
    {
      id: "C1",
      titular: "A",
      alta: "2025-01-01",
      velocidad: "alta",
      uso: "hogar_exclusivo",
      contratoAnterior: null,
      lineasAnterioresSimultaneas: [],
      pagos: [{ ...pago, importe: "200", concepto: "cuota" }],
    },
  ],
} as const
const deporte = {
  ...rioja,
  codigo: "rioja_ejercicio_fisico_deporte",
  beneficiario: persona,
  relacion: "contribuyente",
  beneficiariosDelEjercicio: ["A"],
  titularesMinimo: [],
  titularesDeduccion: ["A"],
  diagnosticoEla: null,
  pagos: [
    {
      ...pago,
      importe: "100",
      facturaTipo: "ordinaria",
      concepto: "clases_deporte",
      territorio: "la-rioja",
      origenServicio: "2025-08-01",
    },
  ],
} as const
const ela = {
  ...deporte,
  codigo: "rioja_enfermos_ela",
  diagnosticoEla: "diagnostico-1",
  pagos: [
    { ...deporte.pagos[0], importe: "1000", concepto: "profesional_sanitario" },
  ],
} as const
const acogimiento = {
  ...marco,
  codigo: "galicia_acogimiento_menores",
  menores: [
    {
      id: "H",
      nacimiento: "2010-01-01",
      desde: "2025-12-31",
      hasta: "2026-01-01",
      regimen: "preadoptivo",
      resolucionXunta: "X",
      adopcion: null,
      acogedores: ["A", "B"],
      vinculoAcogedores: "matrimonio",
    },
  ],
} as const
const cuotas = {
  ...rioja,
  codigo: "rioja_cuotas_organizaciones_profesionales_agrarias",
  cuotas: [{ pago, constitucion: "ley_19_1977", certificadoAnual: "cert-1" }],
} as const
const inversion = {
  ...marco,
  codigo: "galicia_inversion_proyectos_especial_interes",
  entidades: [
    {
      id: "R",
      objeto: "exclusivo_proyecto",
      declaracionLey2_2024: "declaracion",
      fechaDeclaracion: "2025-01-01",
      operaciones: [
        {
          id: "O",
          tipo: "ampliacion",
          fecha: "2025-02-01",
          pago: { ...pago, importe: "3000" },
        },
      ],
      baseConsumidaAnterior: "9000",
      historia: "exhaustiva",
      otrasDeduccionesMismaInversion: [],
    },
  ],
} as const
const donacion = {
  ...marco,
  codigo: "galicia_donaciones_idi",
  cuotaIntegraAutonomica: "800",
  donaciones: [
    {
      pago,
      destinatario: "centro_universidad_gallega",
      objeto: "investigacion_desarrollo_innovacion",
      comunicacionAtriGa: "acuse",
      fechaComunicacion: "2026-01-20",
    },
  ],
} as const

describe("E: oráculos numéricos independientes y límites", () => {
  it("fracción periódica conservada: 250/3", () =>
    importe(familia, "83.33", "250", 3))
  it("65% duplica antes del reparto", () =>
    importe(
      {
        ...familia,
        familia: {
          ...familia.familia,
          contribuyente: { ...persona, discapacidad: 65 },
        },
      },
      "166.67",
      "500",
      3
    ))
  it("un descendiente no da derecho a dos hijos", () =>
    importe(
      {
        ...familia,
        familia: {
          ...familia.familia,
          descendientes: [familia.familia.descendientes[0]],
        },
      },
      "0.00",
      "0",
      3
    ))
  it("acogimiento vigente un día y reparto por mitad", () =>
    importe(acogimiento, "150.00"))
  it("adopción preadoptiva actual excluida", () =>
    importe(
      {
        ...acogimiento,
        menores: [{ ...acogimiento.menores[0], adopcion: "2025-12-31" }],
      },
      "0.00"
    ))
  it("adopción en 2026 no excluye", () =>
    importe(
      {
        ...acogimiento,
        menores: [{ ...acogimiento.menores[0], adopcion: "2026-01-01" }],
      },
      "150.00"
    ))
  it("ayuda: igualdad 22000 incluida", () => importe(ayuda, "100.00"))
  it("ayuda: un céntimo sobre umbral excluye", () =>
    importe({ ...ayuda, baseImponible: "30000.01" }, "0.00"))
  it("ayuda: máximo600", () =>
    importe({ ...ayuda, pagos: [{ ...pago, importe: "7000" }] }, "600.00"))
  it("ayuda: cumple65 durante el año", () =>
    importe(
      { ...ayuda, persona: { ...ayuda.persona, nacimiento: "1960-12-31" } },
      "100.00"
    ))
  it("ayuda: aún64 excluye", () =>
    importe(
      { ...ayuda, persona: { ...ayuda.persona, nacimiento: "1961-01-01" } },
      "0.00"
    ))
  it("ayuda: residencia concertada excluye", () =>
    importe({ ...ayuda, residencia: "concertada" }, "0.00"))
  it("internet30%", () => importe(tecnologia, "60.00"))
  it("internet equipo excluido", () =>
    importe(
      {
        ...tecnologia,
        contratos: [
          {
            ...tecnologia.contratos[0],
            pagos: [
              { ...tecnologia.contratos[0].pagos[0], concepto: "equipo" },
            ],
          },
        ],
      },
      "0.00"
    ))
  it("internet cap conjunto contratos100", () =>
    importe(
      {
        ...tecnologia,
        contratos: [
          tecnologia.contratos[0],
          {
            ...tecnologia.contratos[0],
            id: "C2",
            pagos: [
              { ...tecnologia.contratos[0].pagos[0], id: "P2", factura: "F2" },
            ],
          },
        ],
      },
      "100.00"
    ))
  it("cambio de compañía del año anterior excluye", () =>
    importe(
      {
        ...tecnologia,
        contratos: [
          {
            ...tecnologia.contratos[0],
            contratoAnterior: { alta: "2024-12-31" },
          },
        ],
      },
      "0.00"
    ))
  it("bicicleta15%", () => importe(bici, "30.00"))
  it("bicicleta cap50 y reparto ganancial", () =>
    importe(
      {
        ...bici,
        regimen: "gananciales",
        conyuges: ["A", "B"],
        bicicletas: [{ ...bici.bicicletas[0], pago }],
      },
      "25.00",
      "50",
      2
    ))
  it("bicicleta eléctrica excluida", () =>
    importe(
      {
        ...bici,
        bicicletas: [{ ...bici.bicicletas[0], asistencia: "electrica" }],
      },
      "0.00"
    ))
  it("deporte exactamente65 aplica30%, no100%", () => importe(deporte, "30.00"))
  it("deporte mayor65 aplica100%", () =>
    importe(
      { ...deporte, beneficiario: { ...persona, nacimiento: "1959-12-31" } },
      "100.00"
    ))
  it("deporte discapacidad33 aplica100%", () =>
    importe(
      { ...deporte, beneficiario: { ...persona, discapacidad: 33 } },
      "100.00"
    ))
  it("deporte simplificada excluida", () =>
    importe(
      {
        ...deporte,
        pagos: [{ ...deporte.pagos[0], facturaTipo: "simplificada" }],
      },
      "0.00"
    ))
  it("deporte servicio2024 excluido", () =>
    importe(
      {
        ...deporte,
        pagos: [{ ...deporte.pagos[0], origenServicio: "2024-12-31" }],
      },
      "0.00"
    ))
  it("deporte base y límite por mitad", () =>
    importe(
      {
        ...deporte,
        titularesDeduccion: ["A", "B"],
        pagos: [{ ...deporte.pagos[0], importe: "4000" }],
      },
      "150.00",
      "300",
      2
    ))
  it("ELA1000 produce500", () => importe(ela, "500.00"))
  it("ELA máximo2000 antes reparto", () =>
    importe(
      {
        ...ela,
        titularesDeduccion: ["A", "B"],
        pagos: [{ ...ela.pagos[0], importe: "5000" }],
      },
      "1000.00",
      "2000",
      2
    ))
  it("cuotas100", () => importe(cuotas, "100.00"))
  it("cuotas menores100", () =>
    importe(
      {
        ...cuotas,
        cuotas: [{ ...cuotas.cuotas[0], pago: { ...pago, importe: "73.29" } }],
      },
      "73.29"
    ))
  it("inversión consume solo1000 de base histórica", () =>
    importe(inversion, "200.00"))
  it("inversión historia agotada", () =>
    importe(
      {
        ...inversion,
        entidades: [
          { ...inversion.entidades[0], baseConsumidaAnterior: "10000" },
        ],
      },
      "0.00"
    ))
  it("donación limitada por10% cuota800", () => importe(donacion, "80.00"))
  it("donación25% con cuota suficiente", () =>
    importe({ ...donacion, cuotaIntegraAutonomica: "5000" }, "250.00"))
  it("presentación separada: 0.01*15%=0.0015", () =>
    importe(
      {
        ...bici,
        bicicletas: [
          { ...bici.bicicletas[0], pago: { ...pago, importe: "0.01" } },
        ],
      },
      "0.00",
      "0.0015"
    ))
})

describe("E: rechazo explícito sin importe ficticio", () => {
  for (const [nombre, h] of [
    ["desconocido", { ...bici, codigo: "rioja_inexistente" }],
    ["otro año", { ...bici, contexto: { ...bici.contexto, ejercicio: 2026 } }],
    ["territorio", { ...bici, contexto: marco.contexto }],
    [
      "conjunta pendiente",
      { ...bici, contexto: { ...bici.contexto, modalidad: "conjunta" } },
    ],
    [
      "declarante distinto",
      { ...bici, contexto: { ...bici.contexto, declarantes: ["B"] } },
    ],
    ["no exhaustivo", { ...bici, coleccion: "muestra" }],
    [
      "fecha imposible",
      {
        ...bici,
        bicicletas: [
          { ...bici.bicicletas[0], pago: { ...pago, fecha: "2025-02-29" } },
        ],
      },
    ],
    [
      "pago ajeno",
      {
        ...bici,
        bicicletas: [
          { ...bici.bicicletas[0], pago: { ...pago, pagador: "B" } },
        ],
      },
    ],
    [
      "negativo",
      {
        ...bici,
        bicicletas: [
          { ...bici.bicicletas[0], pago: { ...pago, importe: "-1" } },
        ],
      },
    ],
    [
      "duplicado",
      { ...bici, bicicletas: [bici.bicicletas[0], bici.bicicletas[0]] },
    ],
    [
      "pago duplicado",
      { ...cuotas, cuotas: [cuotas.cuotas[0], cuotas.cuotas[0]] },
    ],
    [
      "crédito incompatible",
      { ...bici, creditoFiscalMecenazgoRioja: "aplicado" },
    ],
    [
      "familia numerosa elegida",
      {
        ...familia,
        familia: { ...familia.familia, eleccionFamilia: "numerosa" },
      },
    ],
    ["ELA sin diagnóstico", { ...ela, diagnosticoEla: null }],
    [
      "historia no exhaustiva",
      {
        ...inversion,
        entidades: [{ ...inversion.entidades[0], historia: "parcial" }],
      },
    ],
    [
      "incompatibilidad inversión",
      {
        ...inversion,
        entidades: [
          {
            ...inversion.entidades[0],
            otrasDeduccionesMismaInversion: ["otra"],
          },
        ],
      },
    ],
    [
      "comunicación tardía",
      {
        ...donacion,
        donaciones: [
          { ...donacion.donaciones[0], fechaComunicacion: "2026-01-21" },
        ],
      },
    ],
    [
      "varios beneficiarios sin composición",
      { ...deporte, beneficiariosDelEjercicio: ["A", "B"] },
    ],
    [
      "factura repetida con otro pago",
      {
        ...cuotas,
        cuotas: [
          cuotas.cuotas[0],
          { ...cuotas.cuotas[0], pago: { ...pago, id: "P2" } },
        ],
      },
    ],
    ["datos ausentes", {}],
  ] as const)
    it(nombre, () => {
      // SAFETY: entrada deliberadamente inválida para probar el rechazo runtime, sin uso posterior.
      rechaza(h as HechosE2025)
    })
  it("reutiliza celiaquía existente sin segunda fórmula", () => {
    const r = reutilizarCeliaquiaRioja2025(rioja.contexto, [
      {
        id: "A",
        relacion: "contribuyente",
        titularesDelMinimo: [],
        titularesDeduccion: ["A", "B"],
        certificado: {
          referencia: "C",
          medico: "M",
          colegiado: "N",
          especialidad: "E",
          fechaEmision: "2025-12-31",
          fechaDiagnostico: "2025-01-01",
          diagnostico: "definitivo",
          ejercicioMedico: "activo",
        },
      },
    ])
    expect(r.estado).toBe("calculo_parcial")
    expect("importe" in r && r.importe).toBe(125)
  })
})

describe("P2: identidades y coherencia temporal", () => {
  it("el contribuyente no puede ser su propio cónyuge", () =>
    rechaza({ ...deporte, relacion: "conyuge" }))
  it("el contribuyente no es su propio beneficiario por mínimo ajeno", () =>
    rechaza({ ...deporte, relacion: "minimo", titularesMinimo: ["A"] }))
  it("no hay pago a un tercero cuando receptor y pagador coinciden", () =>
    rechaza({ ...ayuda, pagos: [{ ...pago, receptor: "A" }] }))
  it("el menor no puede figurar como su propio acogedor", () =>
    rechaza({
      ...acogimiento,
      menores: [{ ...acogimiento.menores[0], acogedores: ["A", "H"] }],
    }))
  it("el descendiente no puede ser titular de su propio mínimo", () =>
    rechaza({
      ...familia,
      familia: {
        ...familia.familia,
        descendientes: familia.familia.descendientes.map((p) => ({
          ...p,
          titularesMinimo: ["A", "B", "H1"],
        })),
        titularesMismosDescendientes: ["A", "B", "H1"],
      },
    }))
  it("un descendiente no puede ser mayor que el contribuyente", () =>
    rechaza({
      ...familia,
      familia: {
        ...familia.familia,
        contribuyente: { ...persona, nacimiento: "2020-01-01" },
      },
    }))
  it("adopción en 2024 contradice acogimiento preadoptivo vigente en 2025", () =>
    rechaza({
      ...acogimiento,
      menores: [
        {
          ...acogimiento.menores[0],
          desde: "2024-01-01",
          adopcion: "2024-12-01",
        },
      ],
    }))
  it("ELA10000/2 *50%, límite compartido2000/2 =1000", () =>
    importe(
      {
        ...ela,
        titularesDeduccion: ["A", "B"],
        pagos: [{ ...ela.pagos[0], importe: "10000" }],
      },
      "1000.00",
      "2000",
      2
    ))
  it("dos cuotas distintas del mismo contribuyente comparten100", () =>
    importe(
      {
        ...cuotas,
        cuotas: [
          { ...cuotas.cuotas[0], pago: { ...pago, importe: "75" } },
          {
            ...cuotas.cuotas[0],
            pago: { ...pago, id: "P2", factura: "F2", importe: "75" },
          },
        ],
      },
      "100.00"
    ))
  it("cuota de otro contribuyente no consume ni amplía el límite propio", () =>
    rechaza({
      ...cuotas,
      cuotas: [{ ...cuotas.cuotas[0], pago: { ...pago, pagador: "B" } }],
    }))
  it("donación con cuota propia cero conserva parcial cero", () =>
    importe({ ...donacion, cuotaIntegraAutonomica: "0" }, "0.00"))
  it("pago2024 excluido con rastro", () =>
    importe(
      {
        ...bici,
        bicicletas: [
          { ...bici.bicicletas[0], pago: { ...pago, fecha: "2024-12-31" } },
        ],
      },
      "0.00"
    ))
  it("fecha2024 bisiesta válida aunque fuera del ejercicio", () =>
    importe(
      {
        ...bici,
        bicicletas: [
          { ...bici.bicicletas[0], pago: { ...pago, fecha: "2024-02-29" } },
        ],
      },
      "0.00"
    ))
  it("31 abril inválido", () =>
    rechaza({
      ...bici,
      bicicletas: [
        { ...bici.bicicletas[0], pago: { ...pago, fecha: "2025-04-31" } },
      ],
    }))
})

describe("P2: fechas, límites y composición de colecciones", () => {
  it("acogimiento no puede empezar antes de nacer", () =>
    rechaza({
      ...acogimiento,
      menores: [{ ...acogimiento.menores[0], desde: "2009-12-31" }],
    }))
  it("contrato anterior no puede comenzar después del actual", () =>
    rechaza({
      ...tecnologia,
      contratos: [
        {
          ...tecnologia.contratos[0],
          contratoAnterior: { alta: "2025-02-01" },
        },
      ],
    }))
  it("una línea actual no es una línea anterior simultánea", () =>
    rechaza({
      ...tecnologia,
      contratos: [
        { ...tecnologia.contratos[0], lineasAnterioresSimultaneas: ["C1"] },
      ],
    }))
  it("consumo histórico no puede exceder la base máxima acumulada", () =>
    rechaza({
      ...inversion,
      entidades: [
        { ...inversion.entidades[0], baseConsumidaAnterior: "10000.01" },
      ],
    }))
  it("mismo beneficiario del mínimo no puede ser titular de sí mismo", () =>
    rechaza({
      ...deporte,
      beneficiario: { ...persona, id: "H" },
      beneficiariosDelEjercicio: ["H"],
      relacion: "minimo",
      titularesMinimo: ["A", "H"],
    }))
  it("dos constituciones de una misma entidad son datos contradictorios", () =>
    rechaza({
      ...inversion,
      entidades: [
        {
          ...inversion.entidades[0],
          operaciones: [
            { ...inversion.entidades[0].operaciones[0], tipo: "constitucion" },
            {
              ...inversion.entidades[0].operaciones[0],
              id: "O2",
              tipo: "constitucion",
              pago: { ...pago, id: "P2", factura: "F2" },
            },
          ],
        },
      ],
    }))
  it("dos bicicletas comparten máximo familiar100, mitad50 en gananciales", () =>
    importe(
      {
        ...bici,
        regimen: "gananciales",
        conyuges: ["A", "B"],
        bicicletas: [
          { ...bici.bicicletas[0], pago },
          {
            ...bici.bicicletas[0],
            id: "B2",
            pago: { ...pago, id: "P2", factura: "F2" },
          },
        ],
      },
      "50.00",
      "100",
      2
    ))
  it("límite2000 de inversión es independiente por entidad", () =>
    importe(
      {
        ...inversion,
        entidades: [
          {
            ...inversion.entidades[0],
            baseConsumidaAnterior: "0",
            operaciones: [
              {
                ...inversion.entidades[0].operaciones[0],
                pago: { ...pago, importe: "20000" },
              },
            ],
          },
          {
            ...inversion.entidades[0],
            id: "R2",
            baseConsumidaAnterior: "0",
            operaciones: [
              {
                ...inversion.entidades[0].operaciones[0],
                id: "O2",
                pago: {
                  ...pago,
                  id: "P2",
                  factura: "F2",
                  receptor: "R2",
                  importe: "20000",
                },
              },
            ],
          },
        ],
      },
      "4000.00"
    ))
  it("orden de cuotas no modifica el límite personal ni la cifra", () => {
    const primera = { ...cuotas.cuotas[0], pago: { ...pago, importe: "75" } }
    const segunda = {
      ...cuotas.cuotas[0],
      pago: { ...pago, id: "P2", factura: "F2", importe: "125" },
    }
    importe({ ...cuotas, cuotas: [primera, segunda] }, "100.00")
    importe({ ...cuotas, cuotas: [segunda, primera] }, "100.00")
  })
  it("identidades con espacios no pueden eludir duplicación", () =>
    rechaza({
      ...familia,
      familia: {
        ...familia.familia,
        titularesMismosDescendientes: ["A", " A"],
      },
    }))
})
