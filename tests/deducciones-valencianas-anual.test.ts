import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect, Result } from "effect"
import {
  componerLiquidacionAnual,
  type EntradaComposicionAnual,
} from "../lib/dominio/irpf/liquidacion/composicion-anual"
import type { CuotaSeparada } from "../lib/dominio/irpf/deducciones/valenciana-2025/composicion"
import {
  aplicarCuotaAnualValenciana2025,
  aplicarCuotaConjuntaValenciana2025,
} from "../lib/dominio/irpf/deducciones/valenciana-2025/cuota-conjunta"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"
import hechosRevision from "./fixtures/deducciones-valencianas-anual/entrada-hechos.json"
import agregadoRevision from "./fixtures/deducciones-valencianas-anual/entrada-publica.json"
import deporteRevision from "./fixtures/deducciones-valencianas-anual/entrada-deporte.json"
const k = "valenciana_primera_vivienda_menores_35"
const l = "valenciana_vivienda_discapacidad"
const o = "valenciana_autoconsumo_renovables"
const id = (c: string) => JSON.stringify([c, 2025, "A"])
import type { SolicitudDeduccionesValencianasAnual2025 } from "../lib/dominio/irpf/deducciones/valenciana-2025/anual"
type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> }
const solicitud = (): Mutable<SolicitudDeduccionesValencianasAnual2025> => ({
  contribuyente: "A",
  ejercicio: 2025 as const,
  territorio: "comunitat-valenciana" as const,
  modalidad: "individual" as const,
  devengo: "2025-12-31" as const,
  cantidades: [{ id: "pago", euros: 10000 }],
  ordenBase30: [],
  consignaciones: [],
  solicitudes: [k, l].map((codigo) => ({
    codigo,
    eleccion: "aplicar" as const,
    unidades: [
      {
        id: "A",
        titulares: ["A"],
        fecha: "2025-06-02",
        numeros: { pagosSinIntereses: 10000, edad: 30 },
        textos: { discapacidadCualificadaDevengo: "expediente" },
      },
    ],
    referencias: [
      {
        unidad: "A",
        sujetos: ["A"],
        bienes: ["vivienda"],
        eventos: ["compra"],
        cantidades: ["pago"],
      },
    ],
  })),
  arrastres: Array<CuotaSeparada["arrastres"][number]>(),
  criterioOrden: "eleccion_experta" as const,
  ordenConsumo: [id(k), id(l)],
})
// Misma acumulación k/l revisada en cuota-conjunta-valenciana.casos; 5% de pagos cada una.
function entrada(base = 10000) {
  return {
    ambito: {
      anio: 2025,
      comunidadAutonoma: "comunitat-valenciana",
      contribuyenteId: "A",
      situacionFamiliar: {
        tipo: "individual",
        edad: 30,
        discapacidad: {
          _tag: "Discapacidad33a64",
          necesitaAyudaOMovilidadReducida: false,
        },
        descendientes: [],
        ascendientes: [],
      },
    },
    cotizaciones: { naturaleza: "efectivas", trabajador: new Decimal(0) },
    precision: 80,
    politica: "decimal-hasta-salida",
    baseGeneral: new Decimal(base),
    baseAhorro: new Decimal(0),
    rentasAntesReducciones: new Decimal(base),
    minimosEstatales: MINIMOS_ESTATALES_2025,
    deduccionesAutonomicasCentimos: 0,
    deduccionesValencianas2025: solicitud(),
  } satisfies EntradaComposicionAnual
}
const ejecutar = (a: EntradaComposicionAnual) =>
  Effect.runSync(componerLiquidacionAnual(a))
it("el núcleo compartido conserva 80 cifras y el contrato aislado exige céntimos", () => {
  const { arrastres, ordenConsumo, criterioOrden, ...hechos } = solicitud()
  const disponible = "20." + "1234567890".repeat(8)
  const a = {
    hechos: {
      ...hechos,
      solicitudes: hechos.solicitudes.map(({ descendientesIncremento, ...p }) =>
        descendientesIncremento === undefined ? p : { ...p, descendientesIncremento }
      ),
      bases: {
        imponibleGeneral: 10000,
        imponibleAhorro: 0,
        liquidableGeneral: 10000,
        liquidableAhorro: 0,
      },
      cuota: { disponible, referencia: "anual-exacta", arrastres },
    },
    ordenConsumo,
    criterioOrden,
  }
  const r = aplicarCuotaAnualValenciana2025(a)
  const D = Decimal.clone({ precision: 120 })
  expect(r.estado).toBe("calculo_parcial")
  expect(new D(r.totalAplicado!).eq(disponible)).toBe(true)
  expect(r.cuotaRestante).toBe("0")
  expect(
    new D(r.movimientos[0].aplicado)
      .plus(r.movimientos[0].perdidoPorCuota)
      .eq(500)
  ).toBe(true)
  expect(
    aplicarCuotaConjuntaValenciana2025({
      ...a,
      hechos: { ...a.hechos, cuota: { ...a.hechos.cuota, disponible: 20.079 } },
    }).estado
  ).toBe("no_soportado")
})
it("R1: conserva la cuota decimal y el importe previo por la API pública", () => {
  // SAFETY: Casos sintéticos independientes conservados; la API pública valida sus datos.
  const hechos = Effect.runSync(
    liquidarIrpfAnual(hechosRevision as CasoFiscalAnual, { modo: "canonico" })
  )
  // SAFETY: La preimagen del revisor contiene el agregado externo del mismo caso.
  const agregado = Effect.runSync(
    liquidarIrpfAnual(agregadoRevision as CasoFiscalAnual, { modo: "canonico" })
  )
  expect(agregado.cuotaLiquidaCentimos).toBe(10242)
  expect(hechos.cuotaLiquidaCentimos).toBe(agregado.cuotaLiquidaCentimos)
  expect(hechos.deduccionesValencianas2025?.totalAplicado).toBe("20.079")
})
it.each(["edad", "grado", "ambiguedad"])(
  "R2: concilia el sujeto referido por un gasto: %s",
  (dato) => {
    const a = structuredClone(deporteRevision)
    if (dato !== "edad")
      a.deduccionesValencianas2025.solicitudes[0].unidades[0].numeros.edad = 30
    if (dato === "grado")
      a.deduccionesValencianas2025.solicitudes[0].unidades[0].numeros.grado = 65
    if (dato === "ambiguedad")
      a.deduccionesValencianas2025.solicitudes[0].referencias[0].sujetos.push(
        "B"
      )
    // SAFETY: Contradicciones deliberadas sobre la identidad del caso sintético independiente.
    const r = Effect.runSync(
      Effect.result(liquidarIrpfAnual(a as CasoFiscalAnual, { modo: "canonico" }))
    )
    expect(Result.isFailure(r)).toBe(true)
  }
)
it("admite el gasto con edad y grado coherentes aunque su id no sea el del sujeto", () => {
  const a = structuredClone(deporteRevision)
  a.deduccionesValencianas2025.solicitudes[0].unidades[0].numeros.edad = 30
  // SAFETY: Entrada sintética por la API pública, con id de unidad distinto del sujeto.
  const r = Effect.runSync(liquidarIrpfAnual(a as CasoFiscalAnual, { modo: "canonico" }))
  expect(r.deduccionesValencianas2025?.totalAplicado).toBe("30")
})
it.each(["perdida", "pendiente", "caducado"])(
  "concilia el subcéntimo en movimientos y %s",
  (destino) => {
    const a = entrada(9628.1)
    const s = a.deduccionesValencianas2025
    if (destino !== "perdida") {
      s.solicitudes = []
      s.cantidades = []
      s.arrastres = [
        {
          id: "h",
          codigo: o,
          contribuyente: "A",
          origen: destino === "pendiente" ? 2024 : 2021,
          pendiente: 30,
          soporte: "declaracion-origen",
        },
      ]
      s.ordenConsumo = ["h"]
    }
    const r = ejecutar(a),
      c = r.deduccionesValencianas2025!
    const D = Decimal.clone({ precision: 100 })
    expect(c.totalAplicado).toBe("20.079")
    expect(c.cuotaRestante).toBe("0")
    expect(
      c.movimientos
        .reduce((total, m) => total.plus(m.aplicado), new D(0))
        .eq(c.totalAplicado!)
    ).toBe(true)
    for (const m of c.movimientos)
      expect(
        new D(m.aplicado)
          .plus(m.pendiente)
          .plus(m.perdidoPorCuota)
          .plus(m.caducadoAlCierre)
          .eq(m.deduccionDisponible)
      ).toBe(true)
    expect(
      r.cuotaLiquida.eq(
        r.cuotaEstatalDespuesMinimo.plus(
          r.ahorroConMinimos.estatal.despuesMinimo
        )
      )
    ).toBe(true)
  }
)
it("consume una cuota calculada, conserva dos movimientos y aplica pagos después", () => {
  const r = ejecutar(entrada())
  expect(r.deduccionesValencianas2025?.estado).toBe("calculo_parcial")
  expect(r.deduccionesValencianas2025?.movimientos).toHaveLength(2)
  // CV: 9% de (10.000 - mínimo propio 6.105 - discapacidad 3.300).
  expect(r.deduccionesValencianas2025?.totalAplicado).toBe("53.55")
  expect(r.deduccionesValencianas2025?.totalAplicado).toBe(
    r.deduccionesAutonomicasAplicadas.toString()
  )
  expect(r.deduccionesValencianas2025?.movimientos[1].aplicado).toBe("0")
  expect(
    r.cuotaLiquida.eq(
      r.cuotaEstatalDespuesMinimo.plus(r.ahorroConMinimos.estatal.despuesMinimo)
    )
  ).toBe(true)
})
it("cero cuota distingue pérdida actual y caducidad histórica", () => {
  const a = entrada(0)
  a.deduccionesValencianas2025.arrastres = [
    {
      id: "h",
      codigo: o,
      contribuyente: "A",
      origen: 2021,
      pendiente: 30,
      soporte: "declaracion",
    },
  ]
  a.deduccionesValencianas2025.ordenConsumo.unshift("h")
  const r = ejecutar(a)
  expect(
    r.deduccionesValencianas2025?.movimientos.map((m) => [
      m.aplicado,
      m.perdidoPorCuota,
      m.caducadoAlCierre,
    ])
  ).toEqual([
    ["0", "0", "30"],
    ["0", "500", "0"],
    ["0", "500", "0"],
  ])
})
it.each([
  "identidad",
  "territorio",
  "ejercicio",
  "modalidad",
  "bases",
  "cuota",
  "agregado",
  "consignacion",
  "edad",
  "rama",
])("rechaza contradicción %s sin cuota cero ficticia", (tipo) => {
  const a = entrada(),
    s = a.deduccionesValencianas2025
  if (tipo === "identidad") s.contribuyente = "B"
  if (tipo === "territorio") Object.assign(s, { territorio: "madrid" })
  if (tipo === "ejercicio") Object.assign(s, { ejercicio: 2026 })
  if (tipo === "modalidad") Object.assign(s, { modalidad: "conjunta" })
  if (tipo === "bases") Object.assign(s, { bases: { liquidableGeneral: 1 } })
  if (tipo === "cuota") Object.assign(s, { cuota: { disponible: 1 } })
  if (tipo === "agregado") a.deduccionesAutonomicasCentimos = 1
  if (tipo === "consignacion")
    s.consignaciones = [{ codigo: k, contribuyente: "A" }]
  if (tipo === "edad") s.solicitudes[0].unidades[0].numeros.edad = 31
  if (tipo === "rama") s.solicitudes[0].codigo = "valenciana_inexistente"
  expect(
    Result.isFailure(Effect.runSync(Effect.result(componerLiquidacionAnual(a))))
  ).toBe(true)
})

it("respeta prioridad histórica y arrastra sólo deducción generada, invirtiendo orden rechaza", () => {
  const a = entrada(),
    s = a.deduccionesValencianas2025
  s.cantidades = [{ id: "pago", euros: 100 }]
  s.solicitudes = [
    {
      ...s.solicitudes[0],
      codigo: o,
      unidades: [
        {
          id: "u",
          titulares: ["A"],
          fecha: "2025-06-02",
          numeros: {
            gasto: 100,
            ayudas: 0,
            reembolsos: 0,
            fraccionPagadaVivienda: 1,
          },
          textos: { vivienda: "habitual" },
        },
      ],
      referencias: [
        {
          unidad: "u",
          sujetos: ["A"],
          bienes: ["vivienda"],
          eventos: ["obra"],
          cantidades: ["pago"],
        },
      ],
    },
  ]
  s.arrastres = [
    {
      id: "hist",
      codigo: o,
      origen: 2021,
      pendiente: 60,
      contribuyente: "A",
      soporte: "declaracion-origen",
    },
  ]
  s.ordenConsumo = ["hist", id(o)]
  const r = ejecutar(a)
  expect(
    r.deduccionesValencianas2025?.movimientos.map((m) => [
      m.aplicado,
      m.pendiente,
      m.caducadoAlCierre,
    ])
  ).toEqual([
    ["53.55", "0", "6.45"],
    ["0", "40", "0"],
  ])
  s.ordenConsumo = [id(o), "hist"]
  expect(
    Result.isFailure(Effect.runSync(Effect.result(componerLiquidacionAnual(a))))
  ).toBe(true)
})

const alcanceEfectivo = {
  ejercicio: 2025,
  comunidadAutonoma: "madrid",
  edad: 40,
  modalidad: "individual",
  residenciaTodoElAnio: true,
  devengo: "2025-12-31",
  otrasRentas: "ninguna",
  familiaresConDerechoMinimo: "ninguno",
  discapacidad: "ninguna",
  reduccionesBase: "ninguna",
  saldosAnteriores: "ninguno",
  deducciones: "solo-da61-si-procede",
  rentasExtranjeras: "ninguna",
  especialidades: "ninguna",
}
function trabajoEfectivo(bruto = "16576.01", clase = "empleo-laboral") {
  return {
    ...alcanceEfectivo,
    perfil: "solo-trabajo",
    conciliacion: {
      ejercicio: 2025,
      estado: "totales-anuales-sin-duplicados",
      procedencia: ["certificado-anual#2025"],
    },
    trabajo: {
      ejercicio: 2025,
      territorio: "comun",
      reduccionesArt18: "ninguna",
      movilidad: "ninguna",
      discapacidadActiva: "ninguna",
      rendimientos: [
        {
          id: "anual",
          clase,
          integro: bruto,
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
  }
}

import {
  liquidarIrpfAnual,
  liquidarIrpfAnualExplicito,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
it("la entrada efectiva usa hechos y cuota común con retenciones únicas", () => {
  const s = solicitud()
  s.solicitudes = s.solicitudes.slice(0, 1)
  s.ordenConsumo = [id(k)]
  const a = {
    ...trabajoEfectivo("20000"),
    comunidadAutonoma: "comunitat-valenciana",
    edad: 30,
    contribuyenteId: "A",
    deducciones: "valencianas-por-hechos-y-da61",
    deduccionesValencianas2025: s,
  }
  // SAFETY: Entrada JavaScript deliberada; la API valida en ejecución y la prueba comprueba aceptación o rechazo.
  const r = Effect.runSync(liquidarIrpfAnualExplicito(a as CasoFiscalAnualExplicito))
  expect(r.deduccionesValencianas2025?.totalAplicado).toBe("500")
  expect(
    new Decimal(r.cuotaLiquidaLegal)
      .plus(500)
      .eq(
        new Decimal(r.componentesCuota.cuotaEstatal).plus(
          r.componentesCuota.cuotaAutonomica
        )
      )
  ).toBe(true)
  expect(r.cuotaDiferencial).toBe(r.cuotaPosterior)
  expect(JSON.stringify(r.rastro)).toContain("acreditaciones")
  const incorrecta = { ...a, deducciones: "solo-da61-si-procede" }
  expect(
    Result.isFailure(
      Effect.runSync(
        // SAFETY: Entrada JavaScript deliberada; la API valida en ejecución y la prueba comprueba aceptación o rechazo.
        Effect.result(liquidarIrpfAnualExplicito(incorrecta as CasoFiscalAnualExplicito))
      )
    )
  ).toBe(true)
})
it("la entrada técnica conserva pagos, salida sin hechos y rechaza agregado incluso cero", () => {
  const a = {
    anio: 2025,
    comunidadAutonoma: "comunitat-valenciana",
    situacionFamiliar: {
      tipo: "individual",
      edad: 30,
      discapacidad: { _tag: "SinDiscapacidad" },
      descendientes: [],
      ascendientes: [],
    },
    rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] },
    reducciones: [],
    deducciones: [],
    retencionesSoportadasCentimos: 10000,
    pagosACuentaCentimos: 20000,
  }
  const sin = Effect.runSync(
    // SAFETY: Entrada JavaScript deliberada; la API valida en ejecución y la prueba comprueba aceptación o rechazo.
    liquidarIrpfAnual(a as CasoFiscalAnual, { modo: "canonico" })
  )
  expect(sin.deduccionesValencianas2025).toBeUndefined()
  const s = solicitud()
  s.solicitudes = s.solicitudes.slice(0, 1)
  s.ordenConsumo = [id(k)]
  const b = { ...a, contribuyenteId: "A", deduccionesValencianas2025: s }
  const con = Effect.runSync(
    // SAFETY: Entrada JavaScript deliberada; la API valida en ejecución y la prueba comprueba aceptación o rechazo.
    liquidarIrpfAnual(b as CasoFiscalAnual, { modo: "canonico" })
  )
  expect(con.deduccionesAutonomicasCentimos).toBeGreaterThan(0)
  expect(sin.cuotaDiferencialCentimos - con.cuotaDiferencialCentimos).toBe(
    con.deduccionesAutonomicasCentimos
  )
  expect(
    Result.isFailure(
      Effect.runSync(
        Effect.result(
          liquidarIrpfAnual(
            // SAFETY: Entrada JavaScript deliberada; la API valida en ejecución y la prueba comprueba aceptación o rechazo.
            { ...b, deduccionAutonomicaAgregadaCentimos: 0 } as CasoFiscalAnual,
            { modo: "canonico" }
          )
        )
      )
    )
  ).toBe(true)
})

it("dos códigos disputan la misma cuota: 15 y 5,07 según orden experto", () => {
  const a = entrada(9628)
  a.deduccionesValencianas2025.cantidades[0].euros = 300
  for (const p of a.deduccionesValencianas2025.solicitudes)
    p.unidades[0].numeros.pagosSinIntereses = 300
  const r = ejecutar(a)
  // (9.628 - 6.105 - 3.300) × 9% = 20,07; cada inversión genera 15.
  expect(
    r.deduccionesValencianas2025?.movimientos.map((m) => [
      m.codigo,
      m.aplicado,
      m.perdidoPorCuota,
    ])
  ).toEqual([
    [k, "15", "0"],
    [l, "5.07", "9.93"],
  ])
  a.deduccionesValencianas2025.ordenConsumo.reverse()
  expect(
    ejecutar(a).deduccionesValencianas2025?.movimientos.map((m) => [
      m.codigo,
      m.aplicado,
    ])
  ).toEqual([
    [l, "15"],
    [k, "5.07"],
  ])
})
it("dos descendientes sin bases familiares representadas se rechaza con motivo acotado", () => {
  const a = entrada()
  a.deduccionesValencianas2025.solicitudes[0].codigo =
    "valenciana_dos_o_mas_descendientes"
  const r = Effect.runSync(Effect.result(componerLiquidacionAnual(a)))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r))
    expect(r.failure.motivo).toContain(
      "falta censo económico completo2025 por persona, filiación y convivencia"
    )
})

it("elegibilidad externa no sustituye el mínimo ni el censo de ascendientes", () => {
  for (const codigo of [
    "valenciana_material_escolar",
    "valenciana_ascendientes_mayores_discapacidad",
  ]) {
    const a = entrada()
    a.deduccionesValencianas2025.solicitudes[0].codigo = codigo
    const r = Effect.runSync(Effect.result(componerLiquidacionAnual(a)))
    expect(Result.isFailure(r)).toBe(true)
    if (Result.isFailure(r)) {
      if (codigo === "valenciana_ascendientes_mayores_discapacidad")
        expect(r.failure.motivo).toBe("Valencia: falta censo anual de ascendientes")
      else expect(r.failure.motivo).toMatch(/mínimo/)
    }
  }
})

it("la entrada efectiva exige declarar sus arrastres sin habilitar saldos de bases", () => {
  const s = solicitud()
  s.solicitudes = []
  s.cantidades = []
  s.arrastres = [
    {
      id: "h",
      codigo: o,
      contribuyente: "A",
      origen: 2024,
      pendiente: 5,
      soporte: "declaracion-origen",
    },
  ]
  s.ordenConsumo = ["h"]
  const a = {
    ...trabajoEfectivo("20000"),
    comunidadAutonoma: "comunitat-valenciana",
    edad: 30,
    contribuyenteId: "A",
    deducciones: "valencianas-por-hechos-y-da61",
    saldosAnteriores: "solo-deducciones-valencianas",
    deduccionesValencianas2025: s,
  }
  // SAFETY: Entrada JavaScript deliberada; el esquema público comprueba todo el expediente.
  expect(
    Effect.runSync(liquidarIrpfAnualExplicito(a as CasoFiscalAnualExplicito))
      .deduccionesValencianas2025?.totalAplicado
  ).toBe("5")
  Object.assign(a, { saldosAnteriores: "ninguno" })
  // SAFETY: Contradicción deliberada para comprobar el rechazo recuperable de la API pública.
  expect(
    Result.isFailure(
      Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(a as CasoFiscalAnualExplicito)))
    )
  ).toBe(true)
})
