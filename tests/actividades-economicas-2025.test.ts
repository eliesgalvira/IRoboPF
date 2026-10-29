import { adaptarActividadGeneral } from "../lib/dominio/irpf/actividades-economicas/adaptador"
import { describe, expect, it } from "vitest"
import Decimal from "decimal.js"
import especificacion from "../docs/procedencia/auditorias/actividades-economicas-2025/especificacion-implementacion.json"
import {
  calcularActividad2025,
  reduccionRentasBajas2025,
} from "../lib/dominio/irpf/actividades-economicas/calcular"
import type { CasoActividad2025 } from "../lib/dominio/irpf/actividades-economicas/contrato"

function casoBase(): CasoActividad2025 {
  return {
    ejercicio: 2025,
    territorio: "comun",
    individual: true,
    actividadId: "profesion",
    iae: "servicios",
    fechaInicio: "2025-01-01",
    fechaFin: "2025-12-31",
    serviciosOrdinarios: true,
    hechos: {
      otrasActividades: false,
      otrasRentas: false,
      existencias: false,
      empleados: false,
      artistica: false,
      irregular: false,
      subvenciones: false,
      transmisiones: false,
      extranjero: false,
      mutualidad: false,
      especialidadesTerritoriales: false,
      saldosPendientes: false,
      serviciosGratuitos: false,
      autoconsumo: false,
      noFacturados: false,
      subvalorados: false,
      trade: false,
      hechosDesconocidos: false,
    },
    historial: [],
    actividadPreviaAlInicio: "ausente",
    regimen2025: "eds",
    criterio2025: "devengo",
    documentoCriterio2025: "alta",
    renuncia2025: false,
    exclusion2025: false,
    volumen2024: "0",
    diasActividad2024: 0,
    documentoVolumen2024: "sin-actividad",
    clientes: [
      {
        id: "cliente",
        vinculado: false,
        empleadorEnAnioAnteriorAlInicio: false,
        documento: "contrato",
      },
    ],
    ingresos: [],
    gastos: [],
    reta: [],
    activos: [],
    obligacionesFormales: true,
    documentoObligaciones: "libros",
    discapacidad: {
      grado: 0,
      ayudaOMovilidad: false,
      ejercicioEfectivo: true,
      documento: "sin-discapacidad",
    },
    opcion: "gastos-dificiles",
    aplicarRentasBajas: true,
    aplicarInicio: false,
    retenciones: [],
    pagosFraccionados: [],
  }
}
function ingreso(
  base: string,
  sujetoRetencion = false,
  id = "factura",
  clienteId = "cliente"
): CasoActividad2025["ingresos"][number] {
  return {
    id,
    justificante: id,
    fecha: "2025-06-01",
    base,
    iva: "0",
    ivaRecuperable: "0",
    afectacionExclusiva: true,
    registrado: true,
    categoria: "servicio",
    clienteId,
    sujetoRetencion,
    rectificativa: false,
  }
}
function gasto(base: string): CasoActividad2025["gastos"][number] {
  return {
    id: "gasto",
    justificante: "gasto",
    fecha: "2025-06-01",
    base,
    iva: "0",
    ivaRecuperable: "0",
    afectacionExclusiva: true,
    registrado: true,
    categoria: "alquiler-local",
    correlacion: true,
    rectificativa: false,
  }
}
function activo(): CasoActividad2025["activos"][number] {
  return {
    id: "pc",
    justificante: "compra",
    fecha: "2025-01-01",
    grupo: "hardware",
    coste: "1000",
    puestaMarcha: "0",
    residual: "0",
    acumulada: "0",
    iva: "210",
    ivaRecuperable: "210",
    coeficiente: "0.26",
    fechaUso: "2025-01-01",
    fechaAdquisicion: "2025-01-01",
    usoHasta: "2025-12-31",
    nuevo: true,
    exclusivo: true,
    oneroso: true,
    mejoras: false,
    deterioros: false,
    subvencionado: false,
    leasing: false,
    incentivo: false,
    metodoHistorico: "lineal",
    coeficienteHistorico: "0.26",
    saldoDocumentado: "registro-activo",
  }
}

it("AEI-01 rechaza un justificante económico repetido entre gasto y RETA", () => {
  rechazo({
    ...casoBase(),
    gastos: [{ ...gasto("300"), justificante: "r" }],
    reta: [
      {
        id: "reta",
        justificante: "r",
        fecha: "2025-06-01",
        importe: "300",
        tipo: "ordinaria",
        propia: true,
        efectiva: true,
        periodo: "2025-06",
      },
    ],
  })
})
it("AEI-02 rechaza acumulada imposible con un único año previo lineal", () => {
  rechazo({
    ...casoBase(),
    fechaInicio: "2024-01-01",
    diasActividad2024: 366,
    historial: [
      {
        ejercicio: 2024,
        documento: "2024",
        regimen: "eds",
        renuncia: false,
        exclusion: false,
        criterio: "devengo",
        netoAntesReducciones: "0",
      },
    ],
    activos: [
      {
        ...activo(),
        fechaUso: "2024-01-01",
        fechaAdquisicion: "2024-01-01",
        acumulada: "999",
      },
    ],
  })
})
it("AEI-03 acepta coeficientes históricamente iguales en valor", () => {
  expect(
    calcularActividad2025({
      ...casoBase(),
      activos: [{ ...activo(), coeficiente: "0.260" }],
    }).estado
  ).toBe("soportado")
})
function importe(c: CasoActividad2025, id: string): string {
  const r = calcularActividad2025(c)
  expect(r.estado, JSON.stringify(r)).toBe("soportado")
  if (r.estado !== "soportado") return "rechazado"
  const e = r.etapas.find((e) => e.id === id)
  expect(e).toBeDefined()
  return e?.importe ?? "ausente"
}
function rechazo(c: CasoActividad2025, id?: string) {
  const r = calcularActividad2025(c)
  expect(r.estado).toBe("no-soportado")
  if (id !== undefined && r.estado === "no-soportado")
    expect(r.motivos.some((m) => m.id === id)).toBe(true)
}

describe("18 ejemplos documentales: aritmética condicionada, sin aceptación fiscal", () => {
  for (const e of especificacion.independentExamples)
    it(e.id, () => {
      const x = e.input
      const c: CasoActividad2025 = {
        ...casoBase(),
        ingresos: [ingreso(x.ingresos, x.elegibleClienteUnico)],
        gastos: [gasto(x.gastos)],
        reta: [
          {
            id: "reta",
            justificante: "tgss",
            fecha: "2025-06-01",
            importe: x.RETA,
            tipo: "ordinaria",
            propia: true,
            efectiva: true,
            periodo: "2025-06",
          },
        ],
        activos: x.amortizacion === "0" ? [] : [activo()],
        opcion: x.opcionClienteUnico ? "cliente-unico" : "gastos-dificiles",
        aplicarInicio: x.inicioElegible,
        discapacidad: {
          grado:
            x.discapacidadIncremento === "7750"
              ? 65
              : x.discapacidadIncremento === "3500"
                ? 33
                : 0,
          ayudaOMovilidad: false,
          ejercicioEfectivo: true,
          documento: "certificado",
        },
      }
      // Los nombres históricos «trade» solo identifican aritmética; aquí se prueba cliente único.
      for (const [id, esperado] of Object.entries(e.expected))
        expect(new Decimal(importe(c, id)).eq(esperado)).toBe(true)
    })
})

it.each([false, true])(
  "sin activos y pérdida con opción rentas bajas=%s",
  (aplicarRentasBajas) => {
    expect(
      importe(
        { ...casoBase(), gastos: [gasto("1000")], aplicarRentasBajas },
        "aporteBIG"
      )
    ).toBe("-1000")
  }
)
it.each([
  "serviciosGratuitos",
  "autoconsumo",
  "noFacturados",
  "subvalorados",
  "trade",
  "otrasRentas",
  "artistica",
  "irregular",
  "otrasActividades",
  "hechosDesconocidos",
] as const)("rechaza %s", (hecho) => {
  const c = casoBase()
  rechazo({ ...c, hechos: { ...c.hechos, [hecho]: true } }, hecho)
})
it("REV-DEVENGO: historia de cobros/pagos bloquea aunque hoy declare devengo", () => {
  rechazo(
    {
      ...casoBase(),
      fechaInicio: "2024-01-01",
      diasActividad2024: 366,
      historial: [
        {
          ejercicio: 2024,
          documento: "declaracion2024",
          regimen: "eds",
          renuncia: false,
          exclusion: false,
          criterio: "cobros-pagos",
          netoAntesReducciones: "0",
        },
      ],
    },
    "declaracion2024"
  )
})
it.each(["cobros-pagos", "desconocido"] as const)(
  "criterio actual %s",
  (criterio2025) => rechazo({ ...casoBase(), criterio2025 })
)
it.each(["regularizacion", "devolucion"] as const)(
  "F07 pendiente: %s rechazada",
  (tipo) =>
    rechazo(
      {
        ...casoBase(),
        reta: [
          {
            id: "reta",
            justificante: "tgss",
            fecha: "2025-06-01",
            importe: "1000",
            tipo,
            propia: true,
            efectiva: true,
            periodo: "2025-06",
          },
        ],
      },
      "reta"
    )
)
it("F08/F10: cuota elegida y saldo, sin obligar al máximo", () => {
  expect(
    importe(
      {
        ...casoBase(),
        activos: [
          { ...activo(), coeficiente: "0.25", coeficienteHistorico: "0.25" },
        ],
      },
      "amortizacion"
    )
  ).toBe("250")
  expect(
    importe(
      {
        ...casoBase(),
        fechaInicio: "2021-01-01",
        diasActividad2024: 366,
        historial: [2021, 2022, 2023, 2024].map((ejercicio) => ({
          ejercicio,
          documento: String(ejercicio),
          regimen: "eds",
          renuncia: false,
          exclusion: false,
          criterio: "devengo",
          netoAntesReducciones: "0",
        })),
        activos: [
          {
            ...activo(),
            fechaUso: "2021-07-15",
            fechaAdquisicion: "2021-07-15",
            fecha: "2021-07-15",
            acumulada: "900",
          },
        ],
      },
      "amortizacion"
    )
  ).toBe("100")
})
it("F09: alta intermedia rechazada; saldo incoherente e incentivo también", () => {
  rechazo(
    { ...casoBase(), activos: [{ ...activo(), fechaUso: "2025-09-23" }] },
    "pc"
  )
  rechazo(
    { ...casoBase(), activos: [{ ...activo(), acumulada: "1001" }] },
    "pc"
  )
  rechazo({ ...casoBase(), activos: [{ ...activo(), incentivo: true }] }, "pc")
})
it.each(["600000", "600000.01"])("F16 umbral %s", (volumen2024) => {
  const c: CasoActividad2025 = {
    ...casoBase(),
    fechaInicio: "2024-01-01",
    diasActividad2024: 366,
    volumen2024,
    historial: [
      {
        ejercicio: 2024,
        documento: "2024",
        regimen: "eds",
        renuncia: false,
        exclusion: false,
        criterio: "devengo",
        netoAntesReducciones: "0",
      },
    ],
  }
  expect(calcularActividad2025(c).estado).toBe(
    volumen2024 === "600000" ? "soportado" : "no-soportado"
  )
})
it("F03 y REV-GASTOS30: incluye RETA", () => {
  const c: CasoActividad2025 = {
    ...casoBase(),
    ingresos: [ingreso("10000", true)],
    gastos: [gasto("2500")],
    opcion: "cliente-unico",
    reta: [
      {
        id: "reta",
        justificante: "tgss",
        fecha: "2025-06-01",
        importe: "500",
        tipo: "ordinaria",
        propia: true,
        efectiva: true,
        periodo: "2025-06",
      },
    ],
  }
  expect(calcularActividad2025(c).estado).toBe("soportado")
  rechazo({ ...c, reta: [{ ...c.reta[0], importe: "500.01" }] }, "opcion")
})
it.each(["7000", "6999.99"])("F04 ingresos sujetos %s", (sujetos) => {
  const c: CasoActividad2025 = {
    ...casoBase(),
    opcion: "cliente-unico",
    ingresos: [
      ingreso(sujetos, true),
      ingreso(new Decimal(10000).minus(sujetos).toFixed(), false, "otra"),
    ],
  }
  expect(calcularActividad2025(c).estado).toBe(
    sujetos === "7000" ? "soportado" : "no-soportado"
  )
})
it.each(["5000", "5000.01"])("F06 empleador %s", (empleador) => {
  const c: CasoActividad2025 = {
    ...casoBase(),
    aplicarInicio: true,
    clientes: [
      {
        id: "a",
        documento: "a",
        vinculado: false,
        empleadorEnAnioAnteriorAlInicio: true,
      },
      {
        id: "b",
        documento: "b",
        vinculado: false,
        empleadorEnAnioAnteriorAlInicio: true,
      },
    ],
    ingresos: [
      ingreso(empleador, false, "a", "a"),
      ingreso(new Decimal(10000).minus(empleador).toFixed(), false, "b", "b"),
    ],
  }
  expect(importe(c, "reduccionInicio")).toBe(
    empleador === "5000" ? "1697.5" : "0"
  )
})
it("F12 pagos separados y deduplicados por factura/operación", () => {
  const c: CasoActividad2025 = {
    ...casoBase(),
    ingresos: [ingreso("20000", true)],
    retenciones: [
      {
        id: "cert",
        justificante: "cert",
        fecha: "2025-12-31",
        operacionId: "r",
        ingresoId: "factura",
        importe: "3000",
        efectiva: true,
      },
    ],
    pagosFraccionados: [
      {
        id: "pago",
        justificante: "banco",
        fecha: "2026-01-20",
        operacionId: "p",
        periodo: "2025-4T",
        modelo: "130",
        importe: "1000",
        efectivo: true,
      },
    ],
  }
  expect(importe(c, "RN")).toBe("19000")
  expect(importe(c, "retenciones")).toBe("3000")
  expect(importe(c, "pagos")).toBe("1000")
  rechazo({
    ...c,
    retenciones: [
      ...c.retenciones,
      { ...c.retenciones[0], id: "factura-retencion", operacionId: "otra" },
    ],
  })
})
it("F13/REV-INICIO-ORDEN: el siguiente período consume la ventana", () => {
  const c: CasoActividad2025 = {
    ...casoBase(),
    fechaInicio: "2023-01-01",
    diasActividad2024: 366,
    aplicarInicio: true,
    ingresos: [ingreso("10000")],
    historial: [2023, 2024].map((ejercicio) => ({
      ejercicio,
      documento: String(ejercicio),
      regimen: "eds",
      renuncia: false,
      exclusion: false,
      criterio: "devengo",
      netoAntesReducciones: ejercicio === 2023 ? "5000" : "-1000",
    })),
  }
  expect(importe(c, "reduccionInicio")).toBe("0")
})
it("F11 y entrada incompleta: rechazo runtime sin defectos Decimal", () => {
  const c = casoBase()
  // @ts-expect-error Frontera JavaScript deliberadamente malformada.
  rechazo({ ...c, gastos: [{ ...gasto("1"), categoria: "otros" }] })
  // @ts-expect-error Frontera JavaScript deliberadamente malformada.
  rechazo({ ...c, volumen2024: null })
  rechazo({ ...c, ingresos: [ingreso("NaN")] })
  rechazo({ ...c, ingresos: [{ ...ingreso("1"), fecha: "2025-02-30" }] })
  rechazo({ ...c, ingresos: [ingreso("1"), ingreso("1")] })
})

it.each([
  ["8000", "1620"],
  ["8000.01", "1619.99595"],
  ["11999.99", "0.00405"],
  ["12000", "0"],
])("F01 fórmula aislada %s", (rn, esperado) => {
  expect(reduccionRentasBajas2025(new Decimal(rn)).toFixed()).toBe(esperado)
})
it("documento repetido con otro ID y propiedad desconocida se rechazan", () => {
  rechazo(
    {
      ...casoBase(),
      ingresos: [ingreso("100"), { ...ingreso("100"), id: "duplicado" }],
    },
    "duplicado"
  )
  // @ts-expect-error Simula payload externo con un hecho no modelado.
  rechazo({ ...casoBase(), otroHecho: true })
})
it("anualización de 2024 e historial de renuncia", () => {
  const c: CasoActividad2025 = {
    ...casoBase(),
    fechaInicio: "2024-07-02",
    diasActividad2024: 183,
    volumen2024: "300000",
    historial: [
      {
        ejercicio: 2024,
        documento: "2024",
        regimen: "eds",
        renuncia: false,
        exclusion: false,
        criterio: "devengo",
        netoAntesReducciones: "0",
      },
    ],
  }
  expect(calcularActividad2025(c).estado).toBe("soportado")
  rechazo({ ...c, volumen2024: "300000.01" }, "volumen")
  rechazo({ ...c, diasActividad2024: 366 }, "dias2024")
  rechazo({ ...c, historial: [{ ...c.historial[0], renuncia: true }] }, "2024")
})
it("F05 vinculación, F14 conjunta y F15 subvenciones", () => {
  const c = casoBase()
  rechazo({ ...c, clientes: [{ ...c.clientes[0], vinculado: true }] })
  rechazo({ ...c, individual: false })
  rechazo({ ...c, hechos: { ...c.hechos, subvenciones: true } })
})

it("adaptador conserva pérdidas y no produce aporte ante rechazo", () => {
  const r = adaptarActividadGeneral({ ...casoBase(), gastos: [gasto("1000")] })
  expect(r.estado).toBe("aporte-disponible")
  if (r.estado === "aporte-disponible") {
    expect(r.aporte.importeEurosExactos).toBe("-1000")
    expect(r.aporte.liquidacionAnual).toBe("no-calculada")
  }
  expect(
    adaptarActividadGeneral({ ...casoBase(), ejercicio: 2026 }).estado
  ).toBe("no-soportado")
})
it("30% incluye amortización y fecha de inicio limita RETA", () => {
  const c: CasoActividad2025 = {
    ...casoBase(),
    ingresos: [ingreso("10000", true)],
    gastos: [gasto("2740")],
    activos: [activo()],
    opcion: "cliente-unico",
  }
  expect(calcularActividad2025(c).estado).toBe("soportado")
  rechazo({ ...c, gastos: [gasto("2740.01")] }, "opcion")
  rechazo(
    {
      ...casoBase(),
      fechaInicio: "2025-07-01",
      reta: [
        {
          id: "reta",
          justificante: "tgss",
          fecha: "2025-06-01",
          importe: "100",
          tipo: "ordinaria",
          propia: true,
          efectiva: true,
          periodo: "2025-06",
        },
      ],
    },
    "reta"
  )
})
