import { describe, it, expect } from "vitest"
import {
  evaluarAmpliacionB2025,
  resolverDependenciaAnualB,
  type HechosAmpliacionB,
  type MarcoB,
  type ResultadoAmpliacion,
  type DependenciaAnual,
} from "../lib/dominio/irpf/deducciones/asturias-cantabria-ampliacion-2025"
import {
  ast,
  can,
  doc,
  rep,
  pago,
  persona,
  hijo,
  vivienda,
  trabajo,
  cualificacion,
  traslado,
  empresa,
  operacion,
  participaciones,
  donataria,
} from "./asturias-cantabria-ampliacion-fixtures"

function importe(x: ResultadoAmpliacion, n: string, d = "1"): void {
  expect(x.estado).toBe("calculo_parcial")
  if (x.estado !== "calculo_parcial")
    throw new Error("No se produjo cálculo parcial")
  expect(BigInt(x.importeExacto.numeradorEuros) * BigInt(d)).toBe(
    BigInt(n) * BigInt(x.importeExacto.divisor)
  )
  expect(x.aceptacionFiscal).toBe("pendiente")
  expect(x.aplicacionCuota).toBe("pendiente_padre")
}
function caso(m: MarcoB, h: HechosAmpliacionB, n: string, d = "1"): void {
  it(h.codigo, () => importe(evaluarAmpliacionB2025(m, h), n, d))
}
function anual(
  m: MarcoB,
  h: HechosAmpliacionB,
  clase: DependenciaAnual["clase"]
): void {
  it(h.codigo, () => {
    const x = evaluarAmpliacionB2025(m, h)
    expect(x.estado).toBe("dependencia_anual")
    if (x.estado === "dependencia_anual") expect(x.formula.clase).toBe(clase)
  })
}
// Oráculos tomados de artículos/casos discriminantes auditados; números literales
// independientes de constantes y fórmulas del módulo.
describe("Familia:13 códigos", () => {
  caso(
    ast,
    {
      codigo: "asturias_adopcion_internacional",
      adopciones: [
        {
          id: "AD1",
          hijo: hijo(),
          resolucion: { ...doc, fecha: "2024-12-01" },
          registroCivil: doc,
          inscripcion: "necesaria",
          residenciaAnterior: "extranjero",
          residenciaAdoptantes: "espana",
          desplazamientoEspana: "2025-01-01",
          declaracionAdoptabilidad: { ...doc, fecha: "2024-11-01" },
        },
      ],
    },
    "1500"
  )
  caso(
    ast,
    {
      codigo: "asturias_partos_multiples_adopciones_misma_fecha",
      eventos: [
        {
          id: "E1",
          fecha: "2025-01-01",
          tipo: "parto",
          hijos: [hijo("H1", "2025-01-01"), hijo("H2", "2025-01-01")],
          adopciones: [],
          unionProgenitores: "sin_union",
        },
      ],
    },
    "2000"
  )
  caso(
    ast,
    {
      codigo: "asturias_familias_numerosas",
      titulo: null,
      hijos: [hijo("H1"), hijo("H2")],
      ascendientes: ["A"],
      reparto: rep,
    },
    "1000"
  )
  caso(
    ast,
    {
      codigo: "asturias_familias_monoparentales",
      familia: {
        convivientes: [
          { clase: "descendiente", persona: hijo(), custodia: "exclusiva" },
        ],
        exhaustividad: "completa",
        rentaPeriodo: "20000",
        alimentosExentos: "0",
        cambioSituacion: null,
      },
    },
    "500"
  )
  // General:15% de4000=600, tope500, ayuda200 =>300 (no570 ni500).
  caso(
    ast,
    {
      codigo: "asturias_centros_cero_tres",
      municipio: "33044",
      usos: [],
      hijos: [
        {
          ...hijo("H", "2023-01-01"),
          centro: doc,
          escolarizacion: { inicio: "2025-01-01", fin: "2025-12-31" },
          pagosFamilia: [pago("4000")],
          ayudaAsturias: "200",
        },
      ],
    },
    "300"
  )
  caso(
    { ...ast, baseGeneral: "6500" },
    {
      codigo: "asturias_libros_texto_material_escolar",
      titulo: null,
      hijos: [
        {
          ...hijo(),
          etapa: "primaria",
          pagosFamilia: [pago("80")],
          becasPublicas: "0",
        },
      ],
    },
    "50"
  )
  caso(
    ast,
    {
      codigo: "asturias_cuidado_descendientes_hasta_25",
      usos: [],
      hijos: [hijo("H", "2000-01-01")],
    },
    "600"
  )
  caso(
    ast,
    {
      codigo:
        "asturias_descendiente_fallecimiento_progenitor_accidente_laboral",
      hijos: [
        {
          ...hijo(),
          progenitorFallecido: "B",
          fallecimiento: doc,
          accidenteLaboral: doc,
        },
      ],
    },
    "1000"
  )
  caso(
    ast,
    {
      codigo: "asturias_enfermedad_celiaca",
      personas: [
        {
          id: "H",
          persona: hijo(),
          relacion: "descendiente",
          reparto: rep,
          informe: doc,
          fechaDiagnostico: "2025-01-01",
          diagnostico: "definitivo",
          servicio: "SNS",
          identificadorMedico: "CNP1",
          gastos: [pago("10")],
        },
      ],
    },
    "100"
  )
  caso(
    can,
    {
      codigo: "cantabria_cuidado_familiares",
      ipremAnual: { ejercicio: 2025, euros: "8400", documento: doc },
      usos: [],
      familiares: [
        {
          id: "H",
          persona: persona("H", "2023-01-01"),
          relacion: "descendiente",
          registroPareja: null,
        },
      ],
    },
    "100"
  )
  caso(
    can,
    {
      codigo: "cantabria_acogimiento_familiar_menores",
      pareja: rep,
      acogidos: [
        {
          ...hijo("H1"),
          parentesco: "acogimiento",
          progenitores: [],
          seleccion: doc,
          acogimiento: { inicio: "2025-01-01", fin: "2025-06-30" },
          parentescoAcogedor: null,
          adopcion: null,
          supervisionExacogido: null,
          interrupciones: [],
        },
        {
          ...hijo("H2"),
          parentesco: "acogimiento",
          progenitores: [],
          seleccion: doc,
          acogimiento: { inicio: "2025-07-01", fin: "2025-12-31" },
          parentescoAcogedor: null,
          adopcion: null,
          supervisionExacogido: null,
          interrupciones: [],
        },
      ],
    },
    "240"
  )
  caso(
    can,
    {
      codigo: "cantabria_gastos_guarderia",
      municipio: "39075",
      usos: [],
      hijos: [
        {
          ...hijo("H", "2023-01-01"),
          centro: doc,
          pagosFamilia: [pago("4000")],
        },
      ],
    },
    "300"
  )
  caso(
    can,
    {
      codigo: "cantabria_guarderia_municipios_riesgo_despoblamiento",
      municipio: "39003",
      usos: [],
      hijos: [
        {
          ...hijo("H", "2023-01-01"),
          centro: doc,
          pagosFamilia: [pago("4000")],
        },
      ],
    },
    "600"
  )
})
describe("Vivienda:7 códigos", () => {
  caso(
    ast,
    {
      codigo: "asturias_vivienda_discapacidad",
      inmueble: vivienda(),
      compromisoOcupacion: null,
      pagos: [pago("15000")],
      accesibilidad: doc,
      persona: {
        ...persona("A", "1980-01-01"),
        discapacidad: { grado: 65, resolucion: doc },
      },
      relacion: "propio",
      reparto: rep,
      gradoSolicitante: 1,
      solicitantes: [{ id: "A", grado: 1 }],
      usos: [],
    },
    "450"
  )
  caso(
    ast,
    {
      codigo: "asturias_arrendamiento_vivienda_habitual",
      inmueble: vivienda("33001", "alquiler"),
      titulares: rep,
      personas: [
        {
          id: "A",
          nacimiento: "1980-01-01",
          numerosa: null,
          monoparental: null,
          violenciaGenero: null,
          pagos: [pago("6000")],
        },
      ],
    },
    "1500"
  )
  caso(
    ast,
    {
      codigo: "asturias_vivienda_determinados_colectivos",
      inmueble: vivienda(),
      compromisoOcupacion: null,
      valorInmueble: "260000",
      colectivo: {
        nacimiento: "1990-01-01",
        numerosa: null,
        monoparental: null,
        violenciaGenero: null,
      },
      pagos: [pago("20000")],
      reparto: rep,
    },
    "1000"
  )
  caso(
    ast,
    {
      codigo: "asturias_gastos_arrendamiento_viviendas",
      contratos: [
        {
          id: "C1",
          inmueble: vivienda(),
          arrendatario: "T",
          rentaMensual: "600",
          referencia: {
            origen: "serpavi",
            municipio: "33001",
            ejercicio: 2025,
            documento: doc,
            rentaMensual: "600",
          },
          ingresosCapitalInmobiliario: "7200",
          gastos: [{ ...pago("800"), concepto: "conservacion_reparacion" }],
        },
      ],
    },
    "500"
  )
  caso(
    can,
    {
      codigo: "cantabria_arrendamiento_municipios_riesgo_despoblamiento",
      inmueble: vivienda("39003", "alquiler"),
      pagos: [pago("6000")],
      usos: [],
    },
    "600"
  )
  caso(
    can,
    {
      codigo: "cantabria_obras_mejora",
      obras: [
        {
          id: "O1",
          inmueble: vivienda("39003"),
          objeto: "telecomunicaciones",
          calificacion: null,
          ejecucion: { inicio: "2025-01-01", fin: "2025-12-31" },
          gastos: [{ ...pago("10000"), subvencionNoSujetaExenta: "0" }],
        },
      ],
      derechosEstatales: [],
      discapacidades: [],
    },
    "1000"
  )
  caso(
    can,
    {
      codigo: "cantabria_arrendamiento_viviendas_vacias",
      cartera: ["V1"],
      exhaustividadCartera: "completa",
      viviendas: [
        {
          id: "V1",
          inmueble: vivienda("39003"),
          porcentajePropiedad: "50",
          vaciaDesde: "2024-01-01",
          usosPrevios: [],
          contratos: [
            {
              id: "C1",
              inicio: "2025-01-01",
              finPactado: "2028-01-01",
              finEfectivo: null,
              arrendatario: "T",
              parentesco: null,
              vinculo: "otro",
              rentaMensualConAnejos: "1000",
              destino: "habitual",
            },
          ],
        },
      ],
    },
    "250"
  )
})
describe("Trabajo,territorio y magnitudes anuales:12 códigos", () => {
  caso(
    ast,
    {
      codigo: "asturias_segundo_sucesivos_hijos_concejos_despoblamiento",
      municipio: "33001",
      hijos: [
        {
          ...hijo("H1", "2015-01-01"),
          incorporacion: "2015-01-01",
          acta: { ...doc, fecha: "2015-01-01" },
        },
        { ...hijo("H2", "2025-01-01"), incorporacion: "2025-01-01", acta: doc },
      ],
    },
    "300"
  )
  caso(
    ast,
    {
      codigo: "asturias_autonomos_concejos_despoblamiento",
      personas: [
        {
          id: "A",
          municipio: "33001",
          trabajo: {
            clase: "propia",
            alta: doc,
            grupoCotizacion: 1,
            actividad: "ACT1",
            modalidad: "autonomo",
            baja: null,
            fallecimiento: null,
            bajasPrevias: [],
          },
        },
      ],
    },
    "1000"
  )
  caso(
    ast,
    {
      codigo: "asturias_transporte_publico_despoblamiento",
      municipio: "33001",
      abonos: [{ id: "AB1", titular: "A", nominal: "A", pagos: [pago("200")] }],
      descendientes: [
        {
          id: "H",
          persona: hijo(),
          municipioEstudio: "33044",
          etapa: "bachillerato",
          abonos: [
            { id: "AB2", nominal: "H", pagosFamilia: [pago("4000", "P2")] },
          ],
        },
      ],
    },
    "400"
  )
  caso(
    ast,
    {
      codigo: "asturias_formacion_trabajos_cualificados_idi",
      personas: [
        {
          id: "A",
          finFormacion: "2024-12-31",
          inicioFormacion: "2023-01-01",
          trabajo: trabajo(),
          cualificacion: cualificacion(),
          gastos: [{ ...pago("3000"), fecha: "2024-10-01" }],
          aplicacionesPrevias: [],
          formacion: "FOR1",
          residencia: {
            inicio: "2025-01-01",
            fin: "2025-12-31",
            territorio: "asturias",
            municipio: "33001",
          },
        },
      ],
      usos: [],
    },
    "2000"
  )
  caso(
    ast,
    {
      codigo: "asturias_traslado_domicilio_fiscal_motivos_laborales",
      personas: [traslado()],
      usos: [],
    },
    "600"
  )
  caso(
    ast,
    {
      codigo: "asturias_vehiculos_electricos",
      vehiculos: [
        {
          id: "VE1",
          compra: doc,
          categoria: "M1",
          estado: "nuevo",
          propulsion: "enchufable",
          uso: "privado",
          ficha: {
            documento: doc,
            ruedas: 4,
            asientosSinConductor: 4,
            transporte: "pasajeros",
            masaSinBateriasKg: "1500",
            masaMaximaCargaKg: "2000",
            velocidadMaxKmh: "150",
            potenciaKW: "100",
            cilindradaCm3: "0",
            pesoBrutoKg: "2000",
          },
          compradores: rep,
          compradorExpreso: "A",
          regimen: "otro",
          pagos: [pago("30000")],
          ayudasPublicas: "5000",
        },
      ],
    },
    "3750"
  )
  caso(
    ast,
    {
      codigo: "asturias_emancipacion_jovenes_hasta_35",
      personas: [
        {
          id: "A",
          nacimiento: "1990-01-01",
          fechaSalidaAscendientes: "2025-01-01",
          emancipacionesPrevias: [],
          retornos: [],
          vivienda: vivienda(),
          gastos: [pago("1500")],
        },
      ],
    },
    "1000"
  )
  anual(
    ast,
    {
      codigo: "asturias_ayudas_ela",
      ayudas: [
        {
          id: "A1",
          beneficiario: "A",
          organismo: "principado_asturias",
          concesion: doc,
          enfermedad: "ELA",
          importeConcedido: "5000",
          integradoBaseGeneral: "5000",
          integradoBaseLiquidable: "4000",
        },
      ],
    },
    "ela_tipos_medios"
  )
  anual(
    can,
    {
      codigo: "cantabria_traslado_residencia_motivos_laborales_despoblamiento",
      personas: [traslado("cantabria")],
    },
    "traslado_rural_trabajo"
  )
  anual(
    can,
    {
      codigo: "cantabria_residencia_municipio_riesgo_despoblamiento",
      personas: [
        {
          id: "A",
          nacimiento: "1990-01-01",
          residencias: [
            {
              inicio: "2025-01-01",
              fin: "2025-12-31",
              territorio: "cantabria",
              municipio: "39003",
            },
          ],
        },
      ],
    },
    "residencia_rural_cuota"
  )
  caso(
    can,
    {
      codigo: "cantabria_ayuda_domestica",
      empleado: "T",
      altaCantabria: doc,
      vivienda: vivienda("39003"),
      empleadores: [
        {
          id: "A",
          nacimiento: "1950-01-01",
          altaTGSS: doc,
          rendimientosTrabajo: "0",
          rendimientosActividad: "0",
          porcentajeReparto: "100",
        },
      ],
      vinculo: "monoparental",
      registroPareja: null,
      hijos: [],
      cotizaciones: [pago("2000")],
    },
    "300"
  )
  caso(
    can,
    {
      codigo: "cantabria_desplazamiento_permanencia_nuevos_residentes",
      personas: [traslado("cantabria")],
      usos: [],
    },
    "1000"
  )
})
describe("Inversión y donación:5 códigos", () => {
  caso(
    ast,
    {
      codigo: "asturias_inversion_entidades_nuevas_reciente_creacion",
      operaciones: [operacion()],
      usos: [],
    },
    "6000"
  )
  caso(
    can,
    {
      codigo: "cantabria_inversion_entidades_nuevas_reciente_creacion",
      operaciones: [operacion("cantabria")],
      usos: [],
    },
    "1000"
  )
  caso(
    can,
    {
      codigo:
        "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad",
      baseLiquidable: "20000",
      baseEstatal68_3: "1000",
      baseEstatal68_5: "0",
      donaciones: [{ id: "D1", entidad: donataria(), pagos: [pago("1500")] }],
      usos: [],
    },
    "150"
  )
  caso(
    can,
    {
      codigo: "cantabria_inversiones_donaciones_economia_social",
      operaciones: [
        {
          id: "S1",
          clase: "donacion_actividad",
          empresa: { ...empresa("cantabria"), forma: "cooperativa" },
          pagos: [pago("10000")],
          participaciones: participaciones(),
          escritura: doc,
          certificacion: doc,
          caracter: "irrevocable",
          actividadDifusion: "otra",
          transmisiones: [],
        },
      ],
      usos: [],
    },
    "3000"
  )
  caso(
    can,
    {
      codigo: "cantabria_inversiones_nuevos_contribuyentes_extranjero",
      fechaResidenciaFiscal: "2025-01-01",
      paisesPrevios: [2020, 2021, 2022, 2023, 2024].map((ejercicio) => ({
        ejercicio,
        pais: "otro" as const,
        documento: doc,
      })),
      residenciaActual: {
        inicio: "2025-01-01",
        fin: "2025-12-31",
        territorio: "cantabria",
        municipio: "39003",
      },
      inversiones: [
        {
          id: "I1",
          fecha: "2025-01-01",
          clase: "inmueble",
          destinoInmueble: "no_vivienda",
          municipio: "39003",
          entidadEspanola: "si",
          empresa: null,
          participaciones: [],
          funciones: [],
          pagos: [
            { ...pago("100000"), concepto: "precio" },
            { ...pago("1000", "P2"), concepto: "interes" },
          ],
          transmisiones: [],
        },
      ],
      usos: [],
    },
    "20000"
  )
})
describe("Resolución de dependencias identificadas, sin consumo de cuota común", () => {
  it("ELA:4000 por(10%+8%)=720", () =>
    importe(
      resolverDependenciaAnualB(
        ast,
        {
          clase: "ela_tipos_medios",
          contribuyente: "A",
          ayudaEnBaseLiquidable: { numeradorEuros: "4000", divisor: "1" },
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
            liquidacion: "L1",
            concepto: "tipo_medio_estatal_2025",
            valor: "10",
          },
          {
            ejercicio: 2025,
            contribuyente: "A",
            liquidacion: "L1",
            concepto: "tipo_medio_autonomico_2025",
            valor: "8",
          },
        ]
      ),
      "720"
    ))
  it("Residencia:cuota1000 genera200;cuota3000 se limita500", () => {
    for (const [valor, esperado] of [
      ["1000", "200"],
      ["3000", "500"],
    ])
      importe(
        resolverDependenciaAnualB(
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
              liquidacion: "L1",
              concepto: "cuota_integra_autonomica_2025",
              valor,
            },
          ]
        ),
        esperado
      )
  })
  it("Traslado500 se limita a cuota de trabajo240", () =>
    importe(
      resolverDependenciaAnualB(
        can,
        {
          clase: "traslado_rural_trabajo",
          personas: ["A"],
          maximoPorPersona: "500",
          referencia:
            "cuota_integra_autonomica_2025_trabajo_actividad_por_contribuyente",
        },
        [
          {
            ejercicio: 2025,
            contribuyente: "A",
            liquidacion: "L1",
            concepto: "cuota_integra_autonomica_2025_trabajo_actividad",
            valor: "240",
          },
        ]
      ),
      "240"
    ))
  it("Falta de magnitud anual no genera cero", () => {
    const x = resolverDependenciaAnualB(
      can,
      {
        clase: "residencia_rural_cuota",
        personas: ["A"],
        porcentaje: "20",
        maximoPorPersona: "500",
        referencia: "cuota_integra_autonomica_2025_por_contribuyente",
      },
      []
    )
    expect(x.estado).toBe("no_soportado")
    expect(x).not.toHaveProperty("importeExacto")
  })
})

describe("Fronteras y hechos adversos", () => {
  it("6500,01 reduce máximo de libros a37,50; beca minora deducción", () => {
    const h: HechosAmpliacionB = {
      codigo: "asturias_libros_texto_material_escolar",
      titulo: null,
      hijos: [
        {
          ...hijo(),
          etapa: "primaria",
          pagosFamilia: [pago("80")],
          becasPublicas: "10",
        },
      ],
    }
    importe(
      evaluarAmpliacionB2025({ ...ast, baseGeneral: "6500.01" }, h),
      "55",
      "2"
    )
  })
  it("Base35000 incluida y35000,01 excluida en vivienda rural", () => {
    const h: HechosAmpliacionB = {
      codigo: "asturias_vivienda_determinados_colectivos",
      inmueble: vivienda(),
      compromisoOcupacion: null,
      valorInmueble: "250000",
      colectivo: {
        nacimiento: "1990-01-01",
        numerosa: null,
        monoparental: null,
        violenciaGenero: null,
      },
      pagos: [pago("10000")],
      reparto: rep,
    }
    importe(evaluarAmpliacionB2025({ ...ast, baseGeneral: "35000" }, h), "1000")
    expect(
      evaluarAmpliacionB2025({ ...ast, baseGeneral: "35000.01" }, h).estado
    ).toBe("excluida")
  })
  it("No confunde progenitor e hijo ni acepta pagos duplicados", () => {
    const h: HechosAmpliacionB = {
      codigo: "cantabria_gastos_guarderia",
      municipio: "39003",
      usos: [],
      hijos: [
        {
          ...hijo("A", "2023-01-01"),
          centro: doc,
          pagosFamilia: [pago("1000")],
        },
      ],
    }
    expect(evaluarAmpliacionB2025(can, h).estado).toBe("no_soportado")
    const duplicado: HechosAmpliacionB = {
      ...h,
      hijos: [
        {
          ...hijo("H", "2023-01-01"),
          centro: doc,
          pagosFamilia: [pago("1000"), pago("1000")],
        },
      ],
    }
    expect(evaluarAmpliacionB2025(can, duplicado).estado).toBe("no_soportado")
  })
  it("Guardería cántabra individual atribuye según pagos, no mitades arbitrarias", () => {
    const h: HechosAmpliacionB = {
      codigo: "cantabria_gastos_guarderia",
      municipio: "39075",
      usos: [],
      hijos: [
        {
          ...hijo("H", "2023-01-01"),
          titulares: ["A", "B"],
          centro: doc,
          pagosFamilia: [pago("1000"), pago("3000", "P2", "B")],
        },
      ],
    }
    importe(evaluarAmpliacionB2025(can, h), "75")
  })
  it("Custodia compartida y ajeno conviviente impiden monoparental asturiana", () => {
    const a: HechosAmpliacionB = {
      codigo: "asturias_familias_monoparentales",
      familia: {
        convivientes: [
          { clase: "descendiente", persona: hijo(), custodia: "compartida" },
        ],
        exhaustividad: "completa",
        rentaPeriodo: "20000",
        alimentosExentos: "0",
        cambioSituacion: null,
      },
    }
    expect(evaluarAmpliacionB2025(ast, a).estado).toBe("excluida")
    expect(
      evaluarAmpliacionB2025(ast, {
        ...a,
        familia: {
          ...a.familia,
          convivientes: [
            { clase: "descendiente", persona: hijo(), custodia: "exclusiva" },
            { clase: "ajeno", persona: persona("X", "1980-01-01") },
          ],
        },
      }).estado
    ).toBe("excluida")
  })
  it("Alimentos exentos cuentan para límite monoparental", () => {
    const h: HechosAmpliacionB = {
      codigo: "asturias_familias_monoparentales",
      familia: {
        convivientes: [
          { clase: "descendiente", persona: hijo(), custodia: "exclusiva" },
        ],
        exhaustividad: "completa",
        rentaPeriodo: "40000",
        alimentosExentos: "5000.01",
        cambioSituacion: null,
      },
    }
    expect(evaluarAmpliacionB2025(ast, h).estado).toBe("excluida")
  })
  it("Cuidado conserva edad25 y prorratea26 con cumpleaños al inicio del mes", () => {
    importe(
      evaluarAmpliacionB2025(ast, {
        codigo: "asturias_cuidado_descendientes_hasta_25",
        usos: [],
        hijos: [hijo("H", "1999-06-01")],
      }),
      "250"
    )
    const p = {
      ...hijo("H", "1999-06-01"),
      discapacidad: { grado: 33, resolucion: doc },
    }
    importe(
      evaluarAmpliacionB2025(ast, {
        codigo: "asturias_cuidado_descendientes_hasta_25",
        usos: [],
        hijos: [p],
      }),
      "600"
    )
  })
  it("No selecciona por fuera un contador para el mes de cumpleaños partido", () => {
    const x = evaluarAmpliacionB2025(ast, {
      codigo: "asturias_cuidado_descendientes_hasta_25",
      usos: [],
      hijos: [hijo("H", "1999-06-15")],
    })
    expect(x.estado).toBe("no_soportado")
    expect(x).not.toHaveProperty("importeExacto")
  })
  it("Mínimo familiar no asimila grado1% a discapacidad legal", () => {
    importe(
      evaluarAmpliacionB2025(ast, {
        codigo: "asturias_cuidado_descendientes_hasta_25",
        usos: [],
        hijos: [
          {
            ...hijo("H", "1990-01-01"),
            discapacidad: { grado: 1, resolucion: doc },
          },
        ],
      }),
      "0"
    )
  })
  it("Cuidados no acumula100 por edad y100 por discapacidad de la misma persona", () => {
    importe(
      evaluarAmpliacionB2025(can, {
        codigo: "cantabria_cuidado_familiares",
        ipremAnual: { ejercicio: 2025, euros: "8400", documento: doc },
        usos: [],
        familiares: [
          {
            id: "H",
            persona: {
              ...persona("H", "2023-01-01"),
              discapacidad: { grado: 65, resolucion: doc },
            },
            relacion: "descendiente",
            registroPareja: null,
          },
        ],
      }),
      "100"
    )
  })
  it("No redondea repartos de guardería a céntimos durante el cálculo", () => {
    const h: HechosAmpliacionB = {
      codigo: "cantabria_gastos_guarderia",
      municipio: "39075",
      usos: [],
      hijos: [
        {
          ...hijo("H", "2023-01-01"),
          titulares: ["A", "B"],
          centro: doc,
          pagosFamilia: [pago("1"), pago("2", "P2", "B")],
        },
      ],
    }
    importe(evaluarAmpliacionB2025(can, h), "3", "20")
  })
  it("Incompatibilidades no se resuelven sumando ni eligiendo automáticamente", () => {
    const h: HechosAmpliacionB = {
      codigo: "cantabria_guarderia_municipios_riesgo_despoblamiento",
      municipio: "39003",
      usos: [
        {
          contribuyente: "A",
          codigo: "cantabria_gastos_guarderia",
          objeto: "H",
        },
      ],
      hijos: [],
    }
    expect(evaluarAmpliacionB2025(can, h).estado).toBe("no_soportado")
  })
  it("Acogimiento cuenta simultaneidad, incluido día común de entrada/salida", () => {
    const a = {
      ...hijo("H1"),
      parentesco: "acogimiento" as const,
      progenitores: [],
      seleccion: doc,
      acogimiento: { inicio: "2025-01-01", fin: "2025-06-30" },
      parentescoAcogedor: null,
      adopcion: null,
      supervisionExacogido: null,
      interrupciones: [],
    }
    const b = {
      ...a,
      id: "H2",
      acogimiento: { inicio: "2025-06-30", fin: "2025-12-31" },
    }
    importe(
      evaluarAmpliacionB2025(can, {
        codigo: "cantabria_acogimiento_familiar_menores",
        pareja: rep,
        acogidos: [a, b],
      }),
      "480"
    )
  })
  it("Socio mercantil y colaborador no son autónomo rural elegible", () => {
    for (const modalidad of ["colaborador", "socio_mercantil"] as const) {
      importe(
        evaluarAmpliacionB2025(ast, {
          codigo: "asturias_autonomos_concejos_despoblamiento",
          personas: [
            {
              id: "A",
              municipio: "33001",
              trabajo: {
                clase: "propia",
                alta: doc,
                grupoCotizacion: 1,
                actividad: "ACT1",
                modalidad,
                baja: null,
                fallecimiento: null,
                bajasPrevias: [],
              },
            },
          ],
        }),
        "0"
      )
    }
  })
  it("Misma actividad cesada en últimos seis meses excluye alta", () => {
    importe(
      evaluarAmpliacionB2025(ast, {
        codigo: "asturias_autonomos_concejos_despoblamiento",
        personas: [
          {
            id: "A",
            municipio: "33001",
            trabajo: {
              clase: "propia",
              alta: doc,
              grupoCotizacion: 1,
              actividad: "ACT1",
              modalidad: "autonomo",
              baja: null,
              fallecimiento: null,
              bajasPrevias: [{ fecha: "2024-08-01", actividad: "ACT1" }],
            },
          },
        ],
      }),
      "0"
    )
  })
  it("Formación sólo una vez y software sin informe favorable no basta", () => {
    const h: HechosAmpliacionB = {
      codigo: "asturias_formacion_trabajos_cualificados_idi",
      personas: [
        {
          id: "A",
          finFormacion: "2024-12-31",
          inicioFormacion: "2023-01-01",
          trabajo: trabajo(),
          cualificacion: { ...cualificacion(), actividad: "software_avanzado" },
          gastos: [{ ...pago("3000"), fecha: "2024-01-01" }],
          aplicacionesPrevias: [],
          formacion: "F",
          residencia: {
            inicio: "2025-01-01",
            fin: "2025-12-31",
            territorio: "asturias",
            municipio: "33001",
          },
        },
      ],
      usos: [],
    }
    importe(evaluarAmpliacionB2025(ast, h), "0")
    importe(
      evaluarAmpliacionB2025(ast, {
        ...h,
        personas: h.personas.map((p) => ({
          ...p,
          cualificacion: cualificacion(),
          aplicacionesPrevias: [{ ejercicio: 2024, formacion: "F" }],
        })),
      }),
      "0"
    )
  })
  it("Residencia rural de julio no satisface todo2025;cumplir40 tampoco", () => {
    const h: HechosAmpliacionB = {
      codigo: "cantabria_residencia_municipio_riesgo_despoblamiento",
      personas: [
        {
          id: "A",
          nacimiento: "1990-01-01",
          residencias: [
            {
              inicio: "2025-01-01",
              fin: "2025-06-30",
              territorio: "madrid",
              municipio: "28079",
            },
            {
              inicio: "2025-07-01",
              fin: "2025-12-31",
              territorio: "cantabria",
              municipio: "39003",
            },
          ],
        },
      ],
    }
    importe(evaluarAmpliacionB2025(can, h), "0")
    const cuarenta: HechosAmpliacionB = {
      ...h,
      personas: [
        {
          id: "A",
          nacimiento: "1985-12-31",
          residencias: [
            {
              inicio: "2025-01-01",
              fin: "2025-12-31",
              territorio: "cantabria",
              municipio: "39003",
            },
          ],
        },
      ],
    }
    importe(evaluarAmpliacionB2025(can, cuarenta), "0")
  })
  it("Cuota anual ausente y duplicada se rechazan sin cero", () => {
    const formula: DependenciaAnual = {
      clase: "traslado_rural_trabajo",
      personas: ["A"],
      maximoPorPersona: "500",
      referencia:
        "cuota_integra_autonomica_2025_trabajo_actividad_por_contribuyente",
    }
    const q = {
      ejercicio: 2025 as const,
      contribuyente: "A",
      liquidacion: "L1",
      concepto: "cuota_integra_autonomica_2025_trabajo_actividad" as const,
      valor: "200",
    }
    for (const xs of [[], [q, q]]) {
      const x = resolverDependenciaAnualB(can, formula, xs)
      expect(x.estado).toBe("no_soportado")
      expect(x).not.toHaveProperty("importeExacto")
    }
  })
  it("Participación familiar40 admitida;40,01 excluida", () => {
    for (const [capital, esperado] of [
      ["40", "6000"],
      ["40.01", "0"],
    ]) {
      const o = operacion()
      importe(
        evaluarAmpliacionB2025(ast, {
          codigo: "asturias_inversion_entidades_nuevas_reciente_creacion",
          operaciones: [
            {
              ...o,
              participaciones: [
                {
                  inicio: "2025-01-01",
                  fin: "2025-12-31",
                  personas: [
                    {
                      id: "A",
                      vinculo: "titular",
                      grado: 0,
                      registroPareja: null,
                      capital,
                      votos: capital,
                    },
                  ],
                },
              ],
            },
          ],
          usos: [],
        }),
        esperado
      )
    }
  })
  it("Inversión asturiana no hereda prohibición cántabra de empleo", () => {
    const a = {
      ...operacion(),
      funciones: [
        {
          persona: "A",
          desde: "2025-01-01",
          hasta: "2025-12-31",
          funcion: "empleo" as const,
        },
      ],
    }
    importe(
      evaluarAmpliacionB2025(ast, {
        codigo: "asturias_inversion_entidades_nuevas_reciente_creacion",
        operaciones: [a],
        usos: [],
      }),
      "6000"
    )
    importe(
      evaluarAmpliacionB2025(can, {
        codigo: "cantabria_inversion_entidades_nuevas_reciente_creacion",
        operaciones: [{ ...a, empresa: empresa("cantabria") }],
        usos: [],
      }),
      "0"
    )
  })
  it("PYME agrega vinculadas:250 personas no son menos de250", () => {
    const e = empresa()
    const ampliada = {
      ...e,
      agregacionPyme: [
        ...e.agregacionPyme,
        {
          id: "V",
          relacion: "vinculada" as const,
          porcentajeCapital: "100",
          porcentajeVoto: "100",
          trabajadores: "249",
          facturacion: "1000",
          balance: "1000",
        },
      ],
    }
    importe(
      evaluarAmpliacionB2025(ast, {
        codigo: "asturias_inversion_entidades_nuevas_reciente_creacion",
        operaciones: [{ ...operacion(), empresa: ampliada }],
        usos: [],
      }),
      "0"
    )
  })
  it("Economía social suma modalidades antes del tope3000 y rechaza duplicidad", () => {
    const base = {
      id: "S1",
      clase: "donacion_actividad" as const,
      empresa: { ...empresa("cantabria"), forma: "cooperativa" as const },
      pagos: [pago("2000")],
      participaciones: participaciones(),
      escritura: doc,
      certificacion: doc,
      caracter: "irrevocable" as const,
      actividadDifusion: "otra" as const,
      transmisiones: [],
    }
    importe(
      evaluarAmpliacionB2025(can, {
        codigo: "cantabria_inversiones_donaciones_economia_social",
        operaciones: [
          base,
          {
            ...base,
            id: "S2",
            clase: "donacion_difusion",
            actividadDifusion: "formacion",
            pagos: [pago("2000", "P2")],
          },
        ],
        usos: [],
      }),
      "1500"
    )
    expect(
      evaluarAmpliacionB2025(can, {
        codigo: "cantabria_inversiones_donaciones_economia_social",
        operaciones: [base, base],
        usos: [],
      }).estado
    ).toBe("no_soportado")
  })
  it("Donativos restan conjuntamente bases estatales68.3 y68.5", () => {
    importe(
      evaluarAmpliacionB2025(can, {
        codigo:
          "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad",
        baseLiquidable: "20000",
        baseEstatal68_3: "1000",
        baseEstatal68_5: "500",
        donaciones: [
          {
            id: "D1",
            entidad: donataria("fondo_cantabria_coopera"),
            pagos: [pago("1500")],
          },
        ],
        usos: [],
      }),
      "60"
    )
  })
  it("No acepta fundación por el mero nombre sin rendición y depósito", () => {
    expect(
      evaluarAmpliacionB2025(can, {
        codigo:
          "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad",
        baseLiquidable: "20000",
        baseEstatal68_3: "0",
        baseEstatal68_5: "0",
        donaciones: [
          {
            id: "D1",
            entidad: { ...donataria(), depositoCuentas: null },
            pagos: [pago("1000")],
          },
        ],
        usos: [],
      }).estado
    ).toBe("no_soportado")
  })
  it("Todo pago en efectivo de guardería queda fuera", () => {
    importe(
      evaluarAmpliacionB2025(can, {
        codigo: "cantabria_gastos_guarderia",
        municipio: "39075",
        usos: [],
        hijos: [
          {
            ...hijo("H", "2023-01-01"),
            centro: doc,
            pagosFamilia: [{ ...pago("1000"), medio: "efectivo" }],
          },
        ],
      }),
      "0"
    )
  })
  it("No mezcla territorio ni acepta colección incompleta", () => {
    const h: HechosAmpliacionB = {
      codigo: "cantabria_gastos_guarderia",
      municipio: "39075",
      usos: [],
      hijos: [],
    }
    expect(evaluarAmpliacionB2025(ast, h).estado).toBe("no_soportado")
    expect(
      evaluarAmpliacionB2025({ ...can, exhaustividad: "incompleta" }, h).estado
    ).toBe("no_soportado")
  })
})

describe("Precisión racional y regresión del módulo previo integrado", () => {
  it("Una cuota cero identificada produce cero; su ausencia ya está discriminada", () =>
    importe(
      resolverDependenciaAnualB(
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
            liquidacion: "L1",
            concepto: "cuota_integra_autonomica_2025",
            valor: "0",
          },
        ]
      ),
      "0"
    ))
  it("Cuotas de distintas liquidaciones no se mezclan", () => {
    expect(
      resolverDependenciaAnualB(
        ast,
        {
          clase: "ela_tipos_medios",
          contribuyente: "A",
          ayudaEnBaseLiquidable: { numeradorEuros: "1000", divisor: "1" },
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
            liquidacion: "L1",
            concepto: "tipo_medio_estatal_2025",
            valor: "10",
          },
          {
            ejercicio: 2025,
            contribuyente: "A",
            liquidacion: "L2",
            concepto: "tipo_medio_autonomico_2025",
            valor: "8",
          },
        ]
      ).estado
    ).toBe("no_soportado")
  })
  it("Tipo medio con ocho decimales no se transforma en Number", () =>
    importe(
      resolverDependenciaAnualB(
        ast,
        {
          clase: "ela_tipos_medios",
          contribuyente: "A",
          ayudaEnBaseLiquidable: { numeradorEuros: "1000", divisor: "1" },
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
            liquidacion: "L1",
            concepto: "tipo_medio_estatal_2025",
            valor: "10.12345678",
          },
          {
            ejercicio: 2025,
            contribuyente: "A",
            liquidacion: "L1",
            concepto: "tipo_medio_autonomico_2025",
            valor: "0",
          },
        ]
      ),
      "506172839",
      "5000000"
    ))
})

describe("Contrato de conexión anual", () => {
  it("No cambia territorio por elegir una dependencia anual", () => {
    const x = resolverDependenciaAnualB(
      ast,
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
          liquidacion: "L1",
          concepto: "cuota_integra_autonomica_2025",
          valor: "1000",
        },
      ]
    )
    expect(x.estado).toBe("no_soportado")
    expect(x).not.toHaveProperty("importeExacto")
  })
  it("Obras entrega exceso calculado500 para arrastre de límite anual, no insuficiencia", () => {
    const x = evaluarAmpliacionB2025(can, {
      codigo: "cantabria_obras_mejora",
      obras: [
        {
          id: "O1",
          inmueble: vivienda("39003"),
          objeto: "telecomunicaciones",
          calificacion: null,
          ejecucion: { inicio: "2025-01-01", fin: "2025-12-31" },
          gastos: [{ ...pago("10000"), subvencionNoSujetaExenta: "0" }],
        },
      ],
      derechosEstatales: [],
      discapacidades: [],
    })
    importe(x, "1000")
    if (x.estado === "calculo_parcial") {
      expect(x.regimenPosterior?.arrastreExcesoLimite).toBe(2)
      expect(x.regimenPosterior?.arrastreInsuficiencia).toBe(0)
      expect(x.regimenPosterior?.excesoLimiteGenerado).toEqual({
        numeradorEuros: "500",
        divisor: "1",
      })
    }
  })
  it("Nuevos residentes conserva prioridad primera y arrastre4 sin consumir cuota", () => {
    const x = evaluarAmpliacionB2025(can, {
      codigo: "cantabria_desplazamiento_permanencia_nuevos_residentes",
      personas: [traslado("cantabria")],
      usos: [],
    })
    importe(x, "1000")
    if (x.estado === "calculo_parcial") {
      expect(x.regimenPosterior?.prioridadCuota).toBe("primera")
      expect(x.regimenPosterior?.arrastreInsuficiencia).toBe(4)
    }
  })
})

describe("Discriminantes de autor PESADO2", () => {
  it("alquiler conjunto no duplica el identificador del mismo pago entre titulares", () => {
    const h: HechosAmpliacionB = {
      codigo: "asturias_arrendamiento_vivienda_habitual",
      inmueble: vivienda("33001", "alquiler"),
      titulares: { titulares: ["A", "B"], exhaustividad: "completa" },
      personas: [
        {
          id: "A",
          nacimiento: "1990-01-01",
          numerosa: null,
          monoparental: null,
          violenciaGenero: null,
          pagos: [pago("1000", "P1", "A")],
        },
        {
          id: "B",
          nacimiento: "1990-01-01",
          numerosa: null,
          monoparental: null,
          violenciaGenero: null,
          pagos: [pago("1000", "P1", "B")],
        },
      ],
    }
    expect(
      evaluarAmpliacionB2025(
        { ...ast, modalidad: "conjunta", declarantes: ["A", "B"] },
        h
      ).estado
    ).toBe("no_soportado")
  })
  it("dos pagos distintos en alquiler conjunto se conservan aunque compartan factura", () => {
    const h: HechosAmpliacionB = {
      codigo: "asturias_arrendamiento_vivienda_habitual",
      inmueble: vivienda("33001", "alquiler"),
      titulares: { titulares: ["A", "B"], exhaustividad: "completa" },
      personas: [
        {
          id: "A",
          nacimiento: "1990-01-01",
          numerosa: null,
          monoparental: null,
          violenciaGenero: null,
          pagos: [{ ...pago("1000", "P1", "A"), documento: "FACTURA-COMUN" }],
        },
        {
          id: "B",
          nacimiento: "1990-01-01",
          numerosa: null,
          monoparental: null,
          violenciaGenero: null,
          pagos: [{ ...pago("2000", "P2", "B"), documento: "FACTURA-COMUN" }],
        },
      ],
    }
    importe(
      evaluarAmpliacionB2025(
        { ...ast, modalidad: "conjunta", declarantes: ["A", "B"] },
        h
      ),
      "900"
    )
  })
  it("vivienda vacía no genera deducción por alquiler anterior a la adquisición", () => {
    const h: HechosAmpliacionB = {
      codigo: "cantabria_arrendamiento_viviendas_vacias",
      cartera: ["V1"],
      exhaustividadCartera: "completa",
      viviendas: [
        {
          id: "V1",
          inmueble: { ...vivienda("39003"), fechaTitulo: "2026-01-01" },
          porcentajePropiedad: "100",
          vaciaDesde: "2024-01-01",
          usosPrevios: [],
          contratos: [
            {
              id: "C1",
              inicio: "2025-01-01",
              finPactado: "2028-01-01",
              finEfectivo: null,
              arrendatario: "T",
              parentesco: null,
              vinculo: "otro",
              rentaMensualConAnejos: "900",
              destino: "habitual",
            },
          ],
        },
      ],
    }
    expect(evaluarAmpliacionB2025(can, h).estado).toBe("no_soportado")
  })
  it("fecha de adopción del acogido se valida antes de decidir incompatibilidad", () => {
    const h: HechosAmpliacionB = {
      codigo: "cantabria_acogimiento_familiar_menores",
      pareja: rep,
      acogidos: [
        {
          ...hijo("H"),
          parentesco: "acogimiento",
          progenitores: [],
          seleccion: doc,
          acogimiento: { inicio: "2025-01-01", fin: "2025-12-31" },
          parentescoAcogedor: null,
          adopcion: "2025-02-30",
          supervisionExacogido: null,
          interrupciones: [],
        },
      ],
    }
    expect(evaluarAmpliacionB2025(can, h).estado).toBe("no_soportado")
  })
  it("cantidad ELA en base liquidable no puede ser negativa aunque el racional sea sintáctico", () => {
    const x = resolverDependenciaAnualB(
      ast,
      {
        clase: "ela_tipos_medios",
        contribuyente: "A",
        ayudaEnBaseLiquidable: { numeradorEuros: "-1000", divisor: "1" },
        referencias: ["tipo_medio_estatal_2025", "tipo_medio_autonomico_2025"],
        operacion: "importe_por_suma_tipos_dividida_100",
      },
      [
        {
          ejercicio: 2025,
          contribuyente: "A",
          liquidacion: "L1",
          concepto: "tipo_medio_estatal_2025",
          valor: "10",
        },
        {
          ejercicio: 2025,
          contribuyente: "A",
          liquidacion: "L1",
          concepto: "tipo_medio_autonomico_2025",
          valor: "8",
        },
      ]
    )
    expect(x.estado).toBe("no_soportado")
    expect(x).not.toHaveProperty("importeExacto")
  })
  it("magnitud anual de otra persona no se reutiliza por coincidir ejercicio y concepto", () => {
    const x = resolverDependenciaAnualB(
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
          contribuyente: "B",
          liquidacion: "L1",
          concepto: "cuota_integra_autonomica_2025",
          valor: "1000",
        },
      ]
    )
    expect(x.estado).toBe("no_soportado")
    expect(x).not.toHaveProperty("importeExacto")
  })
  it("titular de hijo debe figurar entre progenitores, sin reutilizar filiación ajena", () => {
    const h: HechosAmpliacionB = {
      codigo: "cantabria_gastos_guarderia",
      municipio: "39075",
      usos: [],
      hijos: [
        {
          ...hijo("H", "2023-01-01"),
          progenitores: ["X", "Y"],
          centro: doc,
          pagosFamilia: [pago("1000")],
        },
      ],
    }
    expect(evaluarAmpliacionB2025(can, h).estado).toBe("no_soportado")
  })
})
