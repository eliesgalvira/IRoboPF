import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { expect, it } from "vitest"
import muestras from "./fixtures/ampliacion-a-anual-20261105.json"
import { SolicitudAmpliacionAnualA2025 } from "../lib/dominio/irpf/deducciones/ampliacion-a-anual-esquemas"
import {
  evaluarAmpliacionAnualA2025,
  type ContextoAmpliacionAnualA2025,
} from "../lib/dominio/irpf/deducciones/ampliacion-a-anual"
import {
  aplicarDeduccionesTerritoriales2025,
  SolicitudDeduccionesTerritoriales2025,
} from "../lib/dominio/irpf/deducciones/anual-territorial"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import {
  liquidarIrpfAnual,
  liquidarIrpfAnualExplicito,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import { DerechosMinimosAnuales } from "../lib/dominio/irpf/minimos/derechos-contrato"
function decodificar(datos: Schema.Json) {
  return Schema.decodeUnknownSync(SolicitudAmpliacionAnualA2025)(datos, {
    onExcessProperty: "error",
  })
}
const contexto = (
  territorio: CasoFiscalAnual["comunidadAutonoma"] = "andalucia"
): ContextoAmpliacionAnualA2025 => ({
  caso: {
    anio: 2025,
    comunidadAutonoma: territorio,
    contribuyenteId: "t",
    situacionFamiliar: {
      tipo: "individual",
      edad: 30,
      discapacidad: { _tag: "SinDiscapacidad" },
      descendientes: [],
      ascendientes: [],
    },
  },
  basesLiquidables: { general: new Decimal(10000), ahorro: new Decimal(0) },
  baseGeneral: new Decimal(10000),
  baseAhorro: new Decimal(0),
  minimoPersonalFamiliar: new Decimal(5550),
  cuotaAutonomica: new Decimal(1000),
  sujetosConMinimo: [],
  atribucionesMinimo: [],
  componentesMinimoEstatal: {
    contribuyente: new Decimal(5550),
    descendientes: new Decimal(0),
  },
  rentasTrabajoAnuales: {
    integroTrabajo: new Decimal(10000),
    restoRentas: new Decimal(0),
  },
})
for (const muestra of muestras)
  it("A40 genera antes de cuota: " + muestra.codigo, () => {
    const solicitud = decodificar({
      lote: "A40",
      codigo: muestra.codigo,
      nacimiento: muestra.nacimiento,
      hechos: muestra.hechos,
    })
    const m = contexto(
      muestra.territorio === "aragon"
        ? "aragon"
        : muestra.territorio === "catalunya"
          ? "catalunya"
          : "andalucia"
    )
    const r = evaluarAmpliacionAnualA2025(solicitud, m, [solicitud])
    expect(r.estado).toBe("calculo_parcial")
    if (r.estado !== "calculo_parcial") throw new Error(r.motivo)
    expect(r.importeExactoEuros).toBe(muestra.esperado)
    expect(r.aceptacionFiscal).toBe("pendiente")
  })
const pago = (id = "p", importeCentimos = 100000) => ({
  id,
  fecha: "2025-06-01",
  pagador: "t",
  importeCentimos,
  medio: "transferencia",
  justificante: "recibo-" + id,
  regimen: "personal",
  conyuges: [],
})
const defensa = () => ({
  lote: "A40",
  codigo: "andalucia_defensa_juridica_laboral",
  nacimiento: "1995-01-01",
  hechos: {
    procedimientos: [
      {
        id: "proceso",
        clase: "despido",
        expedienteJudicial: "exp",
        pagos: [pago()],
      },
    ],
  },
})
const donacion = () => ({
  lote: "A40",
  codigo: "andalucia_donativos_finalidad_ecologica",
  nacimiento: "1995-01-01",
  hechos: {
    donaciones: [
      {
        pago: pago("otro"),
        entidad: "ayuntamiento",
        clase: "publica-andaluza",
        finalidad: "ambiental-publica",
        registroAndaluz: "",
        destinoPrograma: "p",
        certificadoArt24: "c",
      },
    ],
  },
})
const solicitud = (solicitudes: readonly Schema.Json[]) =>
  Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({
    solicitudes,
  })
it("A40 comparte una única cuota con dos reglas", () => {
  const r = aplicarDeduccionesTerritoriales2025(
    solicitud([defensa(), donacion()]),
    { ...contexto(), cuotaAutonomica: new Decimal("20.079") }
  )
  expect(r.total).toEqual(racional("20.079"))
  expect(r.disponible).toEqual(racional("0"))
  expect(r.aplicaciones[1].aplicado).toEqual(racional("0"))
})
it("A40 no acepta bases, cuotas, componentes de mínimo ni elecciones externas", () => {
  for (const campo of [
    "imponibleGeneralCentimos",
    "liquidableGeneralCentimos",
    "cuotaIntegraAutonomicaCentimos",
    "minimoDescendientesCentimos",
    "elecciones",
  ])
    expect(() => decodificar({ ...defensa(), [campo]: 0 })).toThrow()
  const mayores = {
    lote: "A40",
    codigo: "aragon_mayores_70",
    nacimiento: "1955-01-01",
    hechos: { rendimientosTrabajoCentimos: 1 },
  }
  expect(() => decodificar(mayores)).toThrow()
  expect(() =>
    decodificar({
      lote: "A40",
      codigo: "andalucia_ayuda_domestica",
      nacimiento: "1995-01-01",
      hechos: { trabajoTitularCentimos: 1 },
    })
  ).toThrow()
})
it("A40 detecta pago duplicado entre deducciones", () => {
  const d = donacion()
  d.hechos.donaciones[0].pago = pago()
  expect(() =>
    aplicarDeduccionesTerritoriales2025(solicitud([defensa(), d]), contexto())
  ).toThrow(/duplicado/)
})
it("A40 no trunca una base al umbral aragonés35000", () => {
  const muestra = muestras.find(
    (x) => x.codigo === "aragon_residencia_determinados_municipios"
  )
  if (muestra === undefined) throw new Error("Falta oráculo")
  const s = decodificar({
    lote: "A40",
    codigo: muestra.codigo,
    nacimiento: muestra.nacimiento,
    hechos: muestra.hechos,
  })
  const m = contexto("aragon")
  expect(
    evaluarAmpliacionAnualA2025(
      s,
      {
        ...m,
        baseGeneral: new Decimal("34999.999"),
        basesLiquidables: {
          general: new Decimal("34999.999"),
          ahorro: new Decimal(0),
        },
      },
      [s]
    ).estado
  ).toBe("calculo_parcial")
  const r = evaluarAmpliacionAnualA2025(
    s,
    {
      ...m,
      baseGeneral: new Decimal(
        "35000.0000000000000000000000000000000000000000000000000000000000000000000001"
      ),
      basesLiquidables: {
        general: new Decimal(
          "35000.0000000000000000000000000000000000000000000000000000000000000000000001"
        ),
        ahorro: new Decimal(0),
      },
    },
    [s]
  )
  expect(r.estado).toBe("no_soportado")
})
const minimo = {
  persona: "s-2",
  nacimiento: "2020-01-01",
  clase: "descendiente",
  titulares: ["s-1"],
  referenciaDerechos: "exp",
  diasConvivencia: 365,
  discapacidad: 0,
  asistencia: "sin-incremento",
}
const educativo = () => ({
  lote: "A40",
  codigo: "andalucia_gastos_educativos",
  nacimiento: "1995-01-01",
  hechos: {
    descendientes: [
      {
        minimo,
        gastos: [
          {
            pago: { ...pago(), pagador: "s-1" },
            centro: "academia",
            clase: "academia",
            horasMateria: 1,
            horasTotales: 1,
            altaIAE: "",
          },
        ],
      },
    ],
  },
})
function familia(): ContextoAmpliacionAnualA2025 {
  const m = contexto()
  const derechos = Schema.decodeUnknownSync(DerechosMinimosAnuales)({
    ejercicio: 2025,
    territorio: "andalucia",
    regimen: "comun",
    modalidad: "individual",
    devengo: "2025-12-31",
    contribuyenteId: "s-1",
    edadContribuyenteDevengo: 30,
    discapacidadContribuyente: { _tag: "SinDiscapacidad" },
    ascendientes: "ninguno",
    fallecimientosEnElEjercicio: "ninguno",
    descendientesCompletos: true,
    descendientes: [
      {
        sujetoId: "s-2",
        fechaNacimiento: "2020-01-01",
        edadDevengo: 5,
        vivoAlDevengo: true,
        rentasNoExentasCentimos: 0,
        declaracion: { modalidad: "no-presenta" },
        discapacidad: { _tag: "SinDiscapacidad" },
        titularesCompletos: true,
        titulares: [
          {
            titularId: "s-1",
            grado: 1,
            vinculo: { clase: "consanguinidad" },
            relacion: "convivencia",
            custodia: "exclusiva",
            alimentosJudiciales: false,
            aplicaEspecialidadAlimentos: false,
            residenteIrpf: true,
            rentasNoExentasCentimos: 1000000,
          },
          {
            titularId: "s-3",
            grado: 1,
            vinculo: { clase: "consanguinidad" },
            relacion: "ninguna",
            custodia: "sin-custodia",
            alimentosJudiciales: false,
            aplicaEspecialidadAlimentos: false,
            residenteIrpf: true,
            rentasNoExentasCentimos: 0,
          },
        ],
      },
    ],
  })
  return {
    ...m,
    caso: { ...m.caso, contribuyenteId: "s-1", derechosMinimos: derechos },
    sujetosConMinimo: ["s-2"],
    atribucionesMinimo: [{ sujetoId: "s-2", titulares: ["s-1"] }],
    componentesMinimoEstatal: {
      contribuyente: new Decimal(5550),
      descendientes: new Decimal(2400),
    },
    minimoPersonalFamiliar: new Decimal(7950),
  }
}
it("A40 acepta mínimo del sujeto con titulares efectivos y rechaza censo sin derecho", () => {
  const s = decodificar(educativo()),
    m = familia()
  expect(evaluarAmpliacionAnualA2025(s, m, [s]).estado).toBe("calculo_parcial")
  const adversa = educativo()
  adversa.hechos.descendientes[0].minimo = {
    ...minimo,
    titulares: ["s-1", "s-3"],
  }
  const a = decodificar(adversa)
  expect(() => evaluarAmpliacionAnualA2025(a, m, [a])).toThrow(/titulares/)
})
it("A40 no usa mínimo ni nacimiento de otro hijo", () => {
  const s = decodificar(educativo()),
    m = familia()
  expect(() =>
    evaluarAmpliacionAnualA2025(
      s,
      {
        ...m,
        sujetosConMinimo: ["s-9"],
        atribucionesMinimo: [{ sujetoId: "s-9", titulares: ["s-1"] }],
      },
      [s]
    )
  ).toThrow(/mínimo anual/)
  const adversa = educativo()
  adversa.hechos.descendientes[0].minimo = {
    ...minimo,
    nacimiento: "2021-01-01",
  }
  const a = decodificar(adversa)
  expect(() => evaluarAmpliacionAnualA2025(a, m, [a])).toThrow(/nacimiento/)
})
it("A40 rechaza tercio escolar y no declara exacta la aproximación", () => {
  const a = educativo()
  a.hechos.descendientes[0].gastos[0].clase = "escolar"
  a.hechos.descendientes[0].gastos[0].horasTotales = 3
  const s = decodificar(a)
  expect(() => evaluarAmpliacionAnualA2025(s, familia(), [s])).toThrow(
    /no decimal finito/
  )
})
it("A40 deriva incompatibilidad asistencia y ayuda doméstica del mismo empleado", () => {
  const minima = { ...minimo, discapacidad: 65, asistencia: "grado65" }
  const asistencia = {
    lote: "A40",
    codigo: "andalucia_asistencia_personas_discapacidad",
    nacimiento: "1995-01-01",
    hechos: {
      personas: [minima],
      asistencia: [
        {
          persona: "s-2",
          necesidadTerceros: "necesidad",
          empleado: "e",
          titularTGSS: "s-1",
          afiliacionAndalucia: "alta",
          cuotas: [{ ...pago(), pagador: "s-1" }],
        },
      ],
    },
  }
  const domestica = {
    lote: "A40",
    codigo: "andalucia_ayuda_domestica",
    nacimiento: "1995-01-01",
    hechos: {
      titularTGSS: "s-1",
      afiliacionAndalucia: "alta",
      viviendaHabitual: "v",
      personaPareja: "",
      vinculoPareja: "sin-pareja",
      registroPareja: "",
      nacimientoPareja: "",
      hijos: [minima],
      empleado: "e",
      cuotas: [{ ...pago("otra-cuota"), pagador: "s-1" }],
      eleccionBeneficiario: "s-1",
    },
  }
  const m = familia(),
    derechos = m.caso.derechosMinimos
  if (derechos === undefined) throw new Error("Derechos ausentes")
  const mm = {
    ...m,
    caso: {
      ...m.caso,
      derechosMinimos: {
        ...derechos,
        descendientes: derechos.descendientes.map((d) => ({
          ...d,
          discapacidad: { _tag: "Discapacidad65OMas" as const },
        })),
      },
    },
  }
  const a = decodificar(asistencia),
    d = decodificar(domestica)
  expect(evaluarAmpliacionAnualA2025(a, mm, [a, d])).toMatchObject({
    estado: "no_soportado",
    motivo: expect.stringMatching(/incompatible/),
  })
})
it("A40 conecta la entrada canónica", () => {
  const s = solicitud([{ ...defensa(), nacimiento: "1985-01-01" }])
  const caso: CasoFiscalAnual = {
    anio: 2025,
    comunidadAutonoma: "andalucia",
    contribuyenteId: "t",
    situacionFamiliar: {
      tipo: "individual",
      edad: 40,
      discapacidad: { _tag: "SinDiscapacidad" },
      ascendientes: [],
      descendientes: [],
    },
    rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] },
    reducciones: [],
    deducciones: [],
    retencionesSoportadasCentimos: 0,
    pagosACuentaCentimos: 0,
    deduccionesTerritoriales2025: s,
  }
  const r = Effect.runSync(liquidarIrpfAnual(caso, { modo: "canonico" }))
  expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("200"))
})
it("A40 conecta la entrada efectiva", () => {
  const s = solicitud([{ ...defensa(), nacimiento: "1985-01-01" }])
  const caso = {
    ejercicio: 2025,
    comunidadAutonoma: "andalucia",
    contribuyenteId: "t",
    edad: 40,
    modalidad: "individual",
    residenciaTodoElAnio: true,
    devengo: "2025-12-31",
    otrasRentas: "ninguna",
    familiaresConDerechoMinimo: "ninguno",
    discapacidad: "ninguna",
    reduccionesBase: "ninguna",
    saldosAnteriores: "ninguno",
    deducciones: "territoriales-por-hechos-y-da61",
    deduccionesTerritoriales2025: s,
    rentasExtranjeras: "ninguna",
    especialidades: "ninguna",
    perfil: "solo-trabajo",
    conciliacion: {
      ejercicio: 2025,
      estado: "totales-anuales-sin-duplicados",
      procedencia: ["certificado"],
    },
    trabajo: {
      ejercicio: 2025,
      territorio: "comun",
      reduccionesArt18: "ninguna",
      movilidad: "ninguna",
      discapacidadActiva: "ninguna",
      rendimientos: [
        {
          id: "r",
          clase: "empleo-laboral",
          integro: "30000",
          cotizaciones: {
            clase: "efectivas",
            seguridadSocial: "0",
            derechosPasivos: "0",
            colegiosHuerfanos: "0",
          },
          sindicato: { importe: "0", satisfecho: "no" },
          colegio: {
            importe: "0",
            satisfecho: "no",
            obligatorio: "no",
            finesEsenciales: "no",
          },
          defensa: {
            importe: "0",
            satisfecho: "no",
            litigioDirectoPagador: "no",
          },
        },
      ],
    },
    retenciones: [],
  } as const
  const r = Effect.runSync(liquidarIrpfAnualExplicito(caso))
  expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("200"))
})

it("A40 mayores70 admite hechos vacíos y deriva ingresos conocidos", () => {
  const s = decodificar({
    lote: "A40",
    codigo: "aragon_mayores_70",
    nacimiento: "1955-01-01",
    hechos: {},
  })
  const m = contexto("aragon")
  const r = evaluarAmpliacionAnualA2025(
    s,
    {
      ...m,
      caso: {
        ...m.caso,
        situacionFamiliar: { ...m.caso.situacionFamiliar, edad: 70 },
      },
    },
    [s]
  )
  expect(r).toMatchObject({
    estado: "calculo_parcial",
    importeExactoEuros: "75",
  })
})
const adopcionAragon = () => ({
  lote: "A40",
  codigo: "aragon_adopcion_internacional",
  nacimiento: "1995-01-01",
  hechos: {
    eventos: [
      {
        persona: "s-2",
        nacimiento: "2020-01-01",
        fecha: "2025-06-01",
        clase: "adopcion",
        resolucion: "r",
        convivientes: ["s-1"],
        orden: 1,
        grado: 0,
        resolucionDiscapacidad: "",
        normaConvenio: "convenio",
        residencia2024Poblacion: 1000,
        residencia2025Poblacion: 1000,
        padron2024: "p24",
        padron2025: "p25",
      },
    ],
    fiscalidad: {
      rango: "ordinario",
      isdtMilesimas: 0,
      referenciaClasificacion: "",
      residenciaDesde: "2020-01-01",
      padron2025: "p",
      mantenimiento: "pendiente-cuatro-anios",
      referenciaSeguimiento: "s",
    },
  },
})
function familiaAdoptiva(): ContextoAmpliacionAnualA2025 {
  const m = familia(),
    derechos = m.caso.derechosMinimos
  if (derechos === undefined) throw new Error("Derechos ausentes")
  return {
    ...m,
    caso: {
      ...m.caso,
      comunidadAutonoma: "aragon",
      derechosMinimos: {
        ...derechos,
        territorio: "aragon",
        descendientes: derechos.descendientes.map((d) => ({
          ...d,
          titulares: d.titulares.map((t) =>
            t.titularId === "s-1"
              ? {
                  ...t,
                  vinculo: {
                    clase: "adopcion" as const,
                    fechaInicioIncremento: "2025-06-01",
                    fechaConstitucionVinculo: "2025-06-01",
                    fundamento: "resolucion-sin-inscripcion-necesaria" as const,
                    historialCompleto: true as const,
                  },
                }
              : t
          ),
        })),
      },
    },
  }
}
it("A40 adopción no sustituye un vínculo consanguíneo anual conocido", () => {
  const m = familia()
  expect(() =>
    aplicarDeduccionesTerritoriales2025(solicitud([adopcionAragon()]), {
      ...m,
      caso: { ...m.caso, comunidadAutonoma: "aragon" },
    })
  ).toThrow(/Vínculo anual/)
})
it("A40 adopción respeta fecha de constitución y excluye reparto mixto", () => {
  const m = familiaAdoptiva()
  expect(
    aplicarDeduccionesTerritoriales2025(solicitud([adopcionAragon()]), m).total
  ).toEqual(racional("600"))
  const fecha = adopcionAragon()
  fecha.hechos.eventos[0].fecha = "2025-07-01"
  expect(() =>
    aplicarDeduccionesTerritoriales2025(solicitud([fecha]), m)
  ).toThrow(/Fecha de constitución/)
  const mixto = adopcionAragon()
  mixto.hechos.eventos[0].convivientes = ["s-1", "s-3"]
  expect(() =>
    aplicarDeduccionesTerritoriales2025(solicitud([mixto]), m)
  ).toThrow(/mixto/)
})
it("A40 adopción andaluza conserva inscripción distinta de constitución y rechaza la contradictoria", () => {
  const s = {
    lote: "A40",
    codigo: "andalucia_adopcion_internacional",
    nacimiento: "1995-01-01",
    hechos: {
      adopciones: [
        {
          persona: "s-2",
          inscripcionCivil: "2025-06-20",
          normaConvenio: "convenio",
          asiento: "asiento",
          titulares: ["s-1"],
        },
      ],
    },
  }
  const original = familiaAdoptiva(),
    derechos = original.caso.derechosMinimos
  if (derechos === undefined) throw new Error("Derechos ausentes")
  const m = {
    ...original,
    caso: {
      ...original.caso,
      comunidadAutonoma: "andalucia" as const,
      derechosMinimos: { ...derechos, territorio: "andalucia" as const },
    },
  }
  expect(aplicarDeduccionesTerritoriales2025(solicitud([s]), m).total).toEqual(
    racional("600")
  )
  s.hechos.adopciones[0].inscripcionCivil = "2025-05-01"
  expect(() => aplicarDeduccionesTerritoriales2025(solicitud([s]), m)).toThrow(
    /posterior a la inscripción/
  )
})
it("A40 mayores70 no sustituye ausencia de ingresos por una cifra externa", () => {
  const s = decodificar({
      lote: "A40",
      codigo: "aragon_mayores_70",
      nacimiento: "1955-01-01",
      hechos: {},
    }),
    m = contexto("aragon")
  const r = evaluarAmpliacionAnualA2025(
    s,
    {
      ...m,
      caso: {
        ...m.caso,
        situacionFamiliar: { ...m.caso.situacionFamiliar, edad: 70 },
      },
      rentasTrabajoAnuales: {
        integroTrabajo: new Decimal(0),
        restoRentas: new Decimal(0),
      },
    },
    [s]
  )
  expect(r).toMatchObject({
    estado: "no_soportado",
    motivo: expect.stringMatching(/trabajo o actividad/),
  })
})
it("A40 distingue mínimo contribuyente/descendientes del total con discapacidad", () => {
  const muestra = muestras.find(
    (c) => c.codigo === "aragon_vivienda_nucleos_rurales"
  )
  if (muestra === undefined) throw new Error("Falta oráculo")
  const s = decodificar({
      lote: "A40",
      codigo: muestra.codigo,
      nacimiento: muestra.nacimiento,
      hechos: muestra.hechos,
    }),
    m = contexto("aragon")
  const mm = {
    ...m,
    caso: {
      ...m.caso,
      situacionFamiliar: {
        ...m.caso.situacionFamiliar,
        discapacidad: { _tag: "Discapacidad65OMas" as const },
      },
    },
    baseGeneral: new Decimal(27000),
    basesLiquidables: { general: new Decimal(27000), ahorro: new Decimal(0) },
    minimoPersonalFamiliar: new Decimal(14550),
  }
  expect(evaluarAmpliacionAnualA2025(s, mm, [s])).toMatchObject({
    estado: "no_soportado",
    motivo: expect.stringMatching(/BI minorada/),
  })
  const r = evaluarAmpliacionAnualA2025(
    s,
    {
      ...mm,
      baseGeneral: new Decimal(26000),
      basesLiquidables: { general: new Decimal(26000), ahorro: new Decimal(0) },
    },
    [s]
  )
  expect(r).toMatchObject({
    estado: "calculo_parcial",
    importeExactoEuros: "452",
  })
})
