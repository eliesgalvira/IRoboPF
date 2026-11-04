import { describe, expect, it } from "vitest"
import type {
  Marco,
  Pago,
  Descendiente,
  Resultado,
  Traslado,
  Conciliacion,
  Seguros,
  Enfermedad,
} from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025"
import {
  evaluarTraslado,
  evaluarConciliacion,
  evaluarEnfermedad,
  evaluarEstudiosNoSuperiores,
  evaluarGuarderia,
  evaluarIdiomas,
  evaluarSegurosImpago,
  evaluarTercerSector,
  evaluarDiscapacidad,
  presentar,
} from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025"

const marco = (territorio: Marco["territorio"] = "canarias"): Marco => ({
  ejercicio: 2025,
  territorio,
  contribuyente: "P",
  modalidad: "individual",
  devengo: "2025-12-31",
  causaDevengo: "fin_ejercicio",
  baseGeneral: "20000",
  baseAhorro: "0",
  exhaustividad: "declaracion_completa",
})
const pago = (importe = "1000", id = "F1"): Pago => ({
  id,
  fecha: "2025-02-15",
  pagador: "P",
  perceptor: "CENTRO",
  factura: id,
  importe,
  ayudasExentas: "0",
  reembolsos: "0",
  medio: "transferencia",
})
const hijo = (id = "H"): Descendiente => ({
  id,
  nacimiento: "2023-01-01",
  titulares: ["P"],
  minimo: {
    ejercicio: 2025,
    persona: id,
    contribuyente: "P",
    expediente: "MIN-" + id,
  },
  convivenciaDesde: "2023-01-01",
  convivenciaHasta: "2025-12-31",
})
function importe(r: Resultado, valor: string): void {
  expect(r.estado).toBe("calculo_parcial")
  if (r.estado === "calculo_parcial") {
    expect(r.importeExacto).toBe(valor)
    expect(r.aceptacionFiscal).toBe("pendiente")
    expect(r.reservas.length).toBeGreaterThan(1)
  }
}
function rechazo(r: Resultado): void {
  expect(r.estado).toBe("no_soportado")
  expect(r).not.toHaveProperty("importeExacto")
  expect(presentar(r)).toBeUndefined()
}
const traslado = (): Traslado => ({
  ...marco(),
  traslado: {
    fecha: "2024-09-01",
    persona: "P",
    islaOrigen: "Tenerife",
    islaDestino: "La Palma",
    actividad: "trabajo",
    contratoOAlta: "CT1",
    modalidadOrigen: "individual",
    baseGeneralOrigen: "45500",
    baseAhorroOrigen: "0",
    permanenciaHasta: "2025-12-31",
  },
  cuotaTrabajoActividad: {
    ejercicio: 2025,
    persona: "P",
    importe: "900",
    liquidacion: "L1",
  },
})
const conciliacion = (): Conciliacion => ({
  ...marco("illes-balears"),
  nacimiento: "1990-01-01",
  discapacidad: 0,
  resolucionDiscapacidad: "",
  familia: "ordinaria",
  tituloFamilia: "",
  minimoDiscapacidad: [],
  actividad: { tipo: "trabajo", identificador: "CT1", diasRETA: 0 },
  titulares: ["P"],
  menores: [
    {
      ...hijo(),
      gastos: [{ ...pago(), servicio: "guarderia", altaSeguridadSocial: "" }],
    },
  ],
})
const seguro = (territorio: Marco["territorio"]): Seguros => ({
  ...marco(territorio),
  viviendas: [
    {
      catastro: "RC1",
      territorio,
      arrendatario: "INQ1",
      inicio: "2024-02-01",
      finInicial: "2026-02-01",
      destino: "vivienda",
      fianzaDeposito: "DEP1",
      rendimiento: "capital_inmobiliario",
      rentaMensual: "800",
      certificadoObligacionesFiscales: "CERT1",
      poliza: "POL1",
      cobertura: "impago_rentas",
      gastos: [pago()],
    },
  ],
})
const enfermedad = (): Enfermedad => ({
  ...marco(),
  nacimiento: "1960-01-01",
  discapacidad: 0,
  pacientesMinimo: [],
  gastos: [
    {
      ...pago(),
      paciente: "P",
      concepto: "dental",
      profesional: "medico",
      colegiacion: "COL1",
    },
  ],
})

describe("CAMP-01: renta y modalidad del traslado, fronteras inclusivas", () => {
  it.each([
    [2024, "individual", "45499.99", true],
    [2024, "individual", "45500", true],
    [2024, "individual", "45500.01", false],
    [2024, "conjunta", "60499.99", true],
    [2024, "conjunta", "60500", true],
    [2024, "conjunta", "60500.01", false],
    [2025, "individual", "46454.99", true],
    [2025, "individual", "46455", true],
    [2025, "individual", "46455.01", false],
    [2025, "conjunta", "61769.99", true],
    [2025, "conjunta", "61770", true],
    [2025, "conjunta", "61770.01", false],
  ] as const)("%s %s %s", (ano, modalidad, renta, admite) => {
    const h = traslado()
    h.traslado.fecha = ano + "-02-01"
    h.traslado.modalidadOrigen = modalidad
    h.traslado.baseGeneralOrigen = renta
    const r = evaluarTraslado(h)
    if (admite) importe(r, "300")
    else rechazo(r)
  })
  it("renta corriente alta no elimina derecho nacido y la baja no lo crea", () => {
    const h = traslado()
    h.baseGeneral = "90000"
    importe(evaluarTraslado(h), "300")
    h.baseGeneral = "0"
    h.traslado.baseGeneralOrigen = "46000"
    rechazo(evaluarTraslado(h))
  })
  it("aplica solo la magnitud de cuota identificada", () => {
    const h = traslado()
    h.cuotaTrabajoActividad.importe = "123.45"
    importe(evaluarTraslado(h), "123.45")
    h.cuotaTrabajoActividad.persona = "OTRA"
    rechazo(evaluarTraslado(h))
  })
  it("suma ahorro de origen y no usa el ahorro corriente para el acceso", () => {
    const h = traslado()
    h.baseAhorro = "90000"
    importe(evaluarTraslado(h), "300")
    h.traslado.baseAhorroOrigen = "0.01"
    rechazo(evaluarTraslado(h))
  })
  it("rechaza isla idéntica, permanencia rota y fecha inexistente", () => {
    const h = traslado()
    h.traslado.islaDestino = "Tenerife"
    rechazo(evaluarTraslado(h))
    h.traslado.islaDestino = "La Palma"
    h.traslado.permanenciaHasta = "2025-03-01"
    rechazo(evaluarTraslado(h))
    h.traslado.permanenciaHasta = "2025-12-31"
    h.traslado.fecha = "2025-02-29"
    rechazo(evaluarTraslado(h))
  })
})

describe("CAMP-02: ley11/2023 y reforma11/7/2025", () => {
  it.each([
    ["1980-01-01", "330"],
    ["1990-01-01", "450"],
  ])(
    "dos titulares y pago propio1000, nacimiento%s: máximo personal%s",
    (nacimiento, esperado) => {
      const h = conciliacion()
      h.nacimiento = nacimiento
      h.titulares = ["P", "Q"]
      h.menores[0].titulares = ["P", "Q"]
      importe(evaluarConciliacion(h), esperado)
    }
  )
  it.each([193, 365])(
    "rechaza RETA%s días tras devengo11/7 (192 días)",
    (diasRETA) => {
      const h = conciliacion()
      h.devengo = "2025-07-11"
      h.causaDevengo = "fallecimiento"
      h.nacimiento = "1980-01-01"
      h.actividad = { tipo: "economica", identificador: "RETA", diasRETA }
      rechazo(evaluarConciliacion(h))
    }
  )
  it.each([
    ["2025-07-11", 192],
    ["2025-12-31", 365],
  ] as const)("admite RETA hasta devengo%s: %s días", (devengo, diasRETA) => {
    const h = conciliacion()
    h.devengo = devengo
    h.causaDevengo =
      devengo === "2025-12-31" ? "fin_ejercicio" : "fallecimiento"
    h.nacimiento = "1980-01-01"
    h.actividad = { tipo: "economica", identificador: "RETA", diasRETA }
    importe(evaluarConciliacion(h), "500")
  })
  it.each([
    ["1000", "500"],
    ["2000", "900"],
  ])("35 años, fallecimiento10/7: %s -> %s", (gasto, esperado) => {
    const h = conciliacion()
    h.devengo = "2025-07-10"
    h.causaDevengo = "fallecimiento"
    h.menores[0].gastos[0].importe = gasto
    importe(evaluarConciliacion(h), esperado)
  })
  it.each([
    ["2025-07-10", 182, "400"],
    ["2025-07-10", 183, "400"],
    ["2025-07-11", 182, "400"],
    ["2025-07-11", 183, "500"],
  ] as const)("RETA devengo%s días%s", (devengo, dias, esperado) => {
    const h = conciliacion()
    h.devengo = devengo
    h.causaDevengo = "fallecimiento"
    h.nacimiento = "1980-01-01"
    h.actividad.tipo = "economica"
    h.actividad.diasRETA = dias
    importe(evaluarConciliacion(h), esperado)
  })
  it("especial: antes20% de renta, desde11/7 30%; tipo sigue50%", () => {
    const h = conciliacion()
    h.familia = "numerosa_especial"
    h.tituloFamilia = "FN1"
    h.devengo = "2025-07-10"
    h.causaDevengo = "fallecimiento"
    h.baseGeneral = "39600"
    importe(evaluarConciliacion(h), "500")
    h.baseGeneral = "39600.01"
    rechazo(evaluarConciliacion(h))
    h.devengo = "2025-07-11"
    h.baseGeneral = "42900"
    importe(evaluarConciliacion(h), "500")
    h.baseGeneral = "42900.01"
    rechazo(evaluarConciliacion(h))
  })
  it("36 exactos sin otro colectivo: régimen general", () => {
    const h = conciliacion()
    h.nacimiento = "1989-12-31"
    importe(evaluarConciliacion(h), "400")
  })
  it("renta ordinaria33000 inclusiva y suma ahorro; familia general no gana30%", () => {
    const h = conciliacion()
    h.baseGeneral = "33000"
    importe(evaluarConciliacion(h), "500")
    h.baseAhorro = "0.01"
    rechazo(evaluarConciliacion(h))
    h.familia = "numerosa_general"
    h.tituloFamilia = "FN1"
    h.baseGeneral = "39600"
    h.baseAhorro = "0"
    importe(evaluarConciliacion(h), "500")
    h.baseAhorro = "0.01"
    rechazo(evaluarConciliacion(h))
  })
  it("fecha imposible, devengo ordinario anticipado y nacimiento del menor en2025", () => {
    const h = conciliacion()
    h.devengo = "2025-02-29"
    h.causaDevengo = "fallecimiento"
    rechazo(evaluarConciliacion(h))
    h.devengo = "2025-07-10"
    h.causaDevengo = "fin_ejercicio"
    rechazo(evaluarConciliacion(h))
    h.devengo = "2025-12-31"
    h.menores[0].nacimiento = "2025-01-02"
    h.menores[0].convivenciaDesde = "2025-01-02"
    rechazo(evaluarConciliacion(h))
  })
  it("reparto, máximo agregado y rechazo de prorrateo diario pendiente", () => {
    const h = conciliacion()
    h.titulares = ["P", "Q"]
    h.menores[0].titulares = ["P", "Q"]
    h.menores[0].gastos[0].importe = "4000"
    importe(evaluarConciliacion(h), "450")
    h.menores[0].nacimiento = "2019-03-01"
    rechazo(evaluarConciliacion(h))
  })
  it("pago en efectivo, sin actividad, pago posterior y sin alta cuidador", () => {
    const h = conciliacion()
    h.menores[0].gastos[0].medio = "efectivo"
    rechazo(evaluarConciliacion(h))
    h.menores[0].gastos[0].medio = "tarjeta"
    h.actividad.identificador = ""
    rechazo(evaluarConciliacion(h))
    h.actividad.identificador = "CT1"
    h.menores[0].gastos[0].fecha = "2026-01-01"
    rechazo(evaluarConciliacion(h))
    h.menores[0].gastos[0].fecha = "2025-02-15"
    h.menores[0].gastos[0].servicio = "empleado_hogar"
    rechazo(evaluarConciliacion(h))
  })
})

describe("Enfermedad y custodia", () => {
  it("65 exactos no es mayor de65; discapacidad65 sí incrementa", () => {
    const h = enfermedad()
    h.gastos[0].importe = "10000"
    importe(evaluarEnfermedad(h), "500")
    h.discapacidad = 65
    importe(evaluarEnfermedad(h), "600")
    h.baseGeneral = "46455.01"
    importe(evaluarEnfermedad(h), "150")
  })
  it("neto y redondeo solo de presentación", () => {
    const h = enfermedad()
    h.gastos[0].importe = "10.01"
    h.gastos[0].ayudasExentas = "0.01"
    importe(evaluarEnfermedad(h), "1.2")
    h.gastos[0].ayudasExentas = "0"
    const r = evaluarEnfermedad(h)
    importe(r, "1.2012")
    expect(presentar(r)).toBe("1.20")
  })
  it("excluye seguro, paciente sin mínimo y farmacéutico", () => {
    const h = enfermedad()
    h.gastos[0].concepto = "prima_seguro"
    rechazo(evaluarEnfermedad(h))
    h.gastos[0].concepto = "dental"
    h.gastos[0].paciente = "OTRO"
    rechazo(evaluarEnfermedad(h))
    h.gastos[0].paciente = "P"
    h.gastos[0].profesional = "farmaceutico"
    rechazo(evaluarEnfermedad(h))
  })
  it("guardería 18%, tope530 por menor y titulares", () => {
    const h = {
      ...marco(),
      hijos: [
        {
          ...hijo(),
          centro: "CENTRO",
          autorizacion: "AUT1",
          gastos: [pago("4000")],
        },
      ],
    }
    importe(evaluarGuarderia(h), "530")
    h.hijos[0].titulares = ["P", "Q"]
    importe(evaluarGuarderia(h), "265")
    h.hijos[0].nacimiento = "2022-05-01"
    rechazo(evaluarGuarderia(h))
  })
})

describe("Gastos, donaciones y discapacidad", () => {
  it("un hijo no puede ser su propio progenitor: estudios, guardería, idiomas y conciliación", () => {
    const u = hijo("P")
    rechazo(
      evaluarEstudiosNoSuperiores({
        ...marco(),
        hijos: [
          {
            ...u,
            etapa: "infantil",
            gastos: [{ ...pago(), concepto: "material" }],
          },
        ],
      })
    )
    rechazo(
      evaluarGuarderia({
        ...marco(),
        hijos: [
          { ...u, centro: "CENTRO", autorizacion: "AUT1", gastos: [pago()] },
        ],
      })
    )
    rechazo(
      evaluarIdiomas({
        ...marco("illes-balears"),
        hijos: [
          {
            ...u,
            etapa: "infantil_segundo_ciclo",
            idioma: "ingles",
            actividad: "extraescolar",
            gastos: [pago()],
          },
        ],
      })
    )
    const h = conciliacion()
    h.menores[0].id = "P"
    h.menores[0].minimo.persona = "P"
    rechazo(evaluarConciliacion(h))
  })
  it("tampoco puede figurar otro progenitor como hijo", () => {
    const h = conciliacion()
    h.titulares = ["P", "Q"]
    h.menores[0].titulares = ["P", "Q"]
    h.menores[0].id = "Q"
    h.menores[0].minimo.persona = "Q"
    rechazo(evaluarConciliacion(h))
  })
  it("discapacidad no admite autorreferencia como descendiente", () => {
    rechazo(
      evaluarDiscapacidad({
        ...marco("illes-balears"),
        personas: [
          {
            persona: "P",
            residencia: "illes-balears",
            condicion: "descendiente",
            naturaleza: "fisica_sensorial",
            grado: 65,
            resolucion: "RES1",
            minimo: { contribuyente: "P", ejercicio: 2025, expediente: "MIN1" },
          },
        ],
      })
    )
  })
  it("mínimo por discapacidad de ascendiente/descendiente no admite al propio contribuyente", () => {
    const h = conciliacion()
    h.nacimiento = "1980-01-01"
    h.minimoDiscapacidad = [{ persona: "P", expediente: "MIN1" }]
    rechazo(evaluarConciliacion(h))
  })
  it("no superiores: límite agregado133+66, no133 por hijo", () => {
    const h = {
      ...marco(),
      hijos: ["H", "I"].map((id) => ({
        ...hijo(id),
        etapa: "infantil" as const,
        gastos: [{ ...pago("500", id), concepto: "material" as const }],
      })),
    }
    importe(evaluarEstudiosNoSuperiores(h), "199")
    h.hijos.forEach((u) => {
      u.titulares = ["P", "Q"]
    })
    importe(evaluarEstudiosNoSuperiores(h), "99.5")
  })
  it("idiomas 15%,110 por hijo y reparto", () => {
    const h = {
      ...marco("illes-balears"),
      hijos: [
        {
          ...hijo(),
          etapa: "infantil_segundo_ciclo" as const,
          idioma: "ingles",
          actividad: "extraescolar" as const,
          gastos: [pago()],
        },
      ],
    }
    importe(evaluarIdiomas(h), "110")
    h.hijos[0].titulares = ["P", "Q"]
    importe(evaluarIdiomas(h), "55")
    h.baseGeneral = "33000.01"
    rechazo(evaluarIdiomas(h))
  })
  it.each([
    ["canarias", "150"],
    ["illes-balears", "440"],
  ] as const)(
    "impago%s agrega y limita una sola vez",
    (territorio, esperado) => {
      const h = seguro(territorio)
      h.viviendas = [
        ...h.viviendas,
        { ...h.viviendas[0], catastro: "RC2", gastos: [pago("500", "F2")] },
      ]
      importe(evaluarSegurosImpago(h), esperado)
      h.viviendas[1].gastos = [pago()]
      rechazo(evaluarSegurosImpago(h))
    }
  )
  it("impago canario renta800 inclusiva; balear no impone800", () => {
    const h = seguro("canarias")
    h.viviendas[0].rentaMensual = "800.01"
    rechazo(evaluarSegurosImpago(h))
    h.territorio = "illes-balears"
    h.viviendas[0].territorio = "illes-balears"
    importe(evaluarSegurosImpago(h), "440")
    h.baseGeneral = "52800.01"
    rechazo(evaluarSegurosImpago(h))
  })
  it("tercer sector: base máxima165 agregada, deducción41.25", () => {
    const h = {
      ...marco("illes-balears"),
      donaciones: ["F1", "F2"].map((id) => ({
        entidad: "CENTRO",
        registro: "REG1",
        regimen: "is9_3" as const,
        certificado: "CERT1",
        pago: pago("100", id),
      })),
    }
    importe(evaluarTercerSector(h), "41.25")
    h.donaciones[0].certificado = ""
    rechazo(evaluarTercerSector(h))
  })
  it("discapacidad vigente88/165 íntegros, no80/150 ni reparto", () => {
    const h = {
      ...marco("illes-balears"),
      personas: [
        {
          persona: "H",
          residencia: "illes-balears" as const,
          condicion: "descendiente" as const,
          naturaleza: "fisica_sensorial" as const,
          grado: 33,
          resolucion: "RES1",
          minimo: {
            contribuyente: "P",
            ejercicio: 2025 as const,
            expediente: "MIN1",
          },
        },
      ],
    }
    importe(evaluarDiscapacidad(h), "88")
    h.personas[0].grado = 65
    importe(evaluarDiscapacidad(h), "165")
    h.personas[0].grado = 32.99
    importe(evaluarDiscapacidad(h), "0")
  })
  it("no soportado carece de importe: conjunta, importes y duplicados", () => {
    const h = enfermedad()
    h.modalidad = "conjunta"
    rechazo(evaluarEnfermedad(h))
    h.modalidad = "individual"
    h.gastos[0].importe = "NaN"
    rechazo(evaluarEnfermedad(h))
    h.gastos[0].importe = "-1"
    rechazo(evaluarEnfermedad(h))
    h.gastos[0].importe = "100"
    h.gastos = [...h.gastos, { ...h.gastos[0] }]
    rechazo(evaluarEnfermedad(h))
  })
})
