import { expect, it } from "vitest"
import { Effect } from "effect"
import { liquidarIrpfAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import type {
  DerechosMinimosAnuales,
  TitularDescendiente,
} from "../lib/dominio/irpf/minimos/derechos-contrato"

const base: CasoFiscalAnual = {
  anio: 2025,
  comunidadAutonoma: "castilla-y-leon",
  contribuyenteId: "s-1",
  situacionFamiliar: {
    tipo: "individual",
    edad: 40,
    discapacidad: { _tag: "SinDiscapacidad" },
    descendientes: [],
    ascendientes: [],
  },
  rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 0,
  pagosACuentaCentimos: 0,
}
// La conciliación familiar recibe el rendimiento del caso, no un importe de deducción.
const renta = Effect.runSync(
  liquidarIrpfAnual(base, { modo: "canonico" })
).rendimientoNetoTrabajoCentimos
const titular = (id: string, tieneDerecho: boolean): TitularDescendiente => ({
  titularId: id,
  grado: 1,
  vinculo: {
    clase: "adopcion",
    fechaConstitucionVinculo: "2025-01-01",
    fechaInicioIncremento: "2025-01-02",
    fundamento: "inscripcion-registro-civil",
    historialCompleto: true,
  },
  relacion: tieneDerecho ? "convivencia" : "ninguna",
  custodia: tieneDerecho ? "compartida" : "sin-custodia",
  alimentosJudiciales: false,
  aplicaEspecialidadAlimentos: false,
  residenteIrpf: tieneDerecho,
  rentasNoExentasCentimos: renta,
})
function casoConFamilia(efectivos: readonly TitularDescendiente[]) {
  const derechos: DerechosMinimosAnuales = {
    ejercicio: 2025,
    territorio: "castilla-y-leon",
    regimen: "comun",
    modalidad: "individual",
    devengo: "2025-12-31",
    contribuyenteId: "s-1",
    edadContribuyenteDevengo: 40,
    discapacidadContribuyente: { _tag: "SinDiscapacidad" },
    ascendientes: "ninguno",
    fallecimientosEnElEjercicio: "ninguno",
    descendientesCompletos: true,
    conciliacionRentasContribuyente: {
      perfil: "caso-anual-parcial",
      otrasRentasOGastosNoRepresentados: "ninguno",
    },
    descendientes: [
      {
        sujetoId: "s-2",
        edadDevengo: 2,
        fechaNacimiento: "2023-01-01",
        vivoAlDevengo: true,
        rentasNoExentasCentimos: 0,
        declaracion: { modalidad: "no-presenta" },
        discapacidad: { _tag: "SinDiscapacidad" },
        titularesCompletos: true,
        titulares: efectivos,
      },
    ],
  }
  return { ...base, derechosMinimos: derechos }
}
function liquidar(
  efectivos: readonly TitularDescendiente[],
  declarados: readonly string[]
) {
  return liquidarIrpfAnual(
    {
      ...casoConFamilia(efectivos),
      deduccionesTerritoriales2025: {
        solicitudes: [
          {
            lote: "CYL",
            codigo: "cyl_gastos_adopcion",
            hechos: {
              exhaustividad: "todas_las_adopciones",
              adopciones: [
                {
                  hijo: "s-2",
                  clase: "nacional",
                  titularesMinimo: declarados,
                  fechaResolucion: "2025-01-01",
                  fechaInscripcion: "2025-01-02",
                  ayudaAnalogica: "no_solicitada",
                },
              ],
            },
          },
        ],
      },
    },
    { modo: "canonico" }
  )
}
it("un titular censado sin derecho no reduce 784 a 392 euros", () => {
  const censados = [titular("s-1", true), titular("s-3", false)]
  const control = Effect.runSync(liquidar(censados, ["s-1"]))
  expect(
    control.deduccionesTerritoriales2025?.aplicaciones[0].generado
  ).toEqual({ numeradorEuros: "784", divisor: "1" })
  const rechazo = Effect.runSync(
    Effect.flip(liquidar(censados, ["s-1", "s-3"]))
  )
  expect(rechazo.motivo).toMatch(/Titular ajeno al mínimo del sujeto/)
})
it.each([["s-1"], ["s-3"], ["s-1", "s-1"]])(
  "no permite omitir ni duplicar titulares efectivos: %j",
  (...declarados) => {
    const censados = [titular("s-1", true), titular("s-3", true)]
    const rechazo = Effect.runSync(Effect.flip(liquidar(censados, declarados)))
    expect(rechazo._tag).toBe("ResultadoNoSoportado")
  }
)
it("dos titulares efectivos conservan 392 euros y el orden es irrelevante", () => {
  const censados = [titular("s-1", true), titular("s-3", true)]
  const a = Effect.runSync(liquidar(censados, ["s-1", "s-3"]))
  const b = Effect.runSync(liquidar(censados, ["s-3", "s-1"]))
  expect(a.deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual({
    numeradorEuros: "392",
    divisor: "1",
  })
  expect(b.cuotaLiquidaCentimos).toBe(a.cuotaLiquidaCentimos)
})

it("un vínculo consanguíneo no permite deducir una adopción del mismo sujeto", () => {
  const t: TitularDescendiente = {
    ...titular("s-1", true),
    vinculo: { clase: "consanguinidad" },
  }
  const rechazo = Effect.runSync(Effect.flip(liquidar([t], ["s-1"])))
  expect(rechazo.motivo).toMatch(/adopción.*vínculo|vínculo.*adopción/i)
})
it("no equipara titulares mixtos del mínimo con adoptantes que comparten la deducción", () => {
  const biologico: TitularDescendiente = {
    ...titular("s-3", true),
    vinculo: { clase: "consanguinidad" },
  }
  const rechazo = Effect.runSync(
    Effect.flip(liquidar([titular("s-1", true), biologico], ["s-1", "s-3"]))
  )
  expect(rechazo.motivo).toMatch(/titulares.*adopción.*pendiente/i)
})
it("no acepta una fecha de constitución adoptiva distinta de la resolución anual conocida", () => {
  const t: TitularDescendiente = {
    ...titular("s-1", true),
    vinculo: {
      clase: "adopcion",
      fechaConstitucionVinculo: "2024-01-01",
      fechaInicioIncremento: "2024-01-02",
      fundamento: "inscripcion-registro-civil",
      historialCompleto: true,
    },
  }
  const rechazo = Effect.runSync(Effect.flip(liquidar([t], ["s-1"])))
  expect(rechazo.motivo).toMatch(/fecha|constitución/i)
})
const consanguineo: TitularDescendiente = {
  ...titular("s-1", true),
  vinculo: { clase: "consanguinidad" },
}
const hogar = (nacimiento: string) =>
  ({
    solicitudes: [
      {
        lote: "CYL",
        codigo: "cyl_cuotas_seguridad_social_empleados_hogar",
        hechos: {
          exhaustividad: "todos_los_pagos",
          hijo: "s-2",
          hijoNacimiento: nacimiento,
          titularesMinimo: ["s-1"],
          ayudaAnalogica: "no_solicitada",
          pagos: [
            {
              id: "p",
              fecha: "2025-06-01",
              importe: "1000",
              empleador: "s-1",
              regimen: "privativo",
              conyuge: null,
              nifEmpleado: "empleado",
            },
          ],
        },
      },
    ],
  }) as const
const anualHijo = (nacimiento: string, edad: number) => {
  const c = casoConFamilia([consanguineo])
  return {
    ...c,
    derechosMinimos: {
      ...c.derechosMinimos,
      descendientes: [
        {
          ...c.derechosMinimos.descendientes[0],
          fechaNacimiento: nacimiento,
          edadDevengo: edad,
        },
      ],
    },
  }
}
it("hijoNacimiento no rejuvenece a un hijo anual de ocho años para cuotas del hogar", () => {
  const c = anualHijo("2017-01-01", 8)
  const bien = Effect.runSync(
    liquidarIrpfAnual(
      { ...c, deduccionesTerritoriales2025: hogar("2017-01-01") },
      { modo: "canonico" }
    )
  )
  expect(bien.deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual({
    numeradorEuros: "0",
    divisor: "1",
  })
  const rechazo = Effect.runSync(
    Effect.flip(
      liquidarIrpfAnual(
        { ...c, deduccionesTerritoriales2025: hogar("2023-01-01") },
        { modo: "canonico" }
      )
    )
  )
  expect(rechazo.motivo).toMatch(/nacimiento|edad/i)
})
it("cuotas hogar conserva el 15% de 1000 para un hijo anual de dos años", () => {
  const c = anualHijo("2023-01-01", 2)
  const r = Effect.runSync(
    liquidarIrpfAnual(
      { ...c, deduccionesTerritoriales2025: hogar("2023-01-01") },
      { modo: "canonico" }
    )
  )
  expect(r.deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual({
    numeradorEuros: "150",
    divisor: "1",
  })
})
const parto = {
  solicitudes: [
    {
      lote: "CLM",
      codigo: "clm_nacimiento_adopcion_hijos",
      hechos: {
        exhaustividad: "todos_los_eventos",
        eventos: [
          {
            id: "evento-1",
            tipo: "parto",
            fecha: "2025-01-01",
            hijos: ["s-2"],
            titularesMinimo: ["s-1"],
          },
        ],
      },
    },
  ],
} as const
it("CLM vincula los titulares al hijo, sin tratar el id del parto como sujeto", () => {
  const c = anualHijo("2025-01-01", 0)
  const r = Effect.runSync(
    liquidarIrpfAnual(
      {
        ...c,
        comunidadAutonoma: "castilla-la-mancha",
        derechosMinimos: {
          ...c.derechosMinimos,
          territorio: "castilla-la-mancha",
        },
        deduccionesTerritoriales2025: parto,
      },
      { modo: "canonico" }
    )
  )
  expect(r.deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual({
    numeradorEuros: "100",
    divisor: "1",
  })
})
it("CLM no admite un parto 2025 para un descendiente nacido en 2017", () => {
  const c = anualHijo("2017-01-01", 8)
  const rechazo = Effect.runSync(
    Effect.flip(
      liquidarIrpfAnual(
        {
          ...c,
          comunidadAutonoma: "castilla-la-mancha",
          derechosMinimos: {
            ...c.derechosMinimos,
            territorio: "castilla-la-mancha",
          },
          deduccionesTerritoriales2025: parto,
        },
        { modo: "canonico" }
      )
    )
  )
  expect(rechazo.motivo).toMatch(/nacimiento|parto/i)
})
const numerosa = (
  descendientes: readonly string[],
  discapacidad65: readonly string[] = []
) =>
  ({
    solicitudes: [
      {
        lote: "CYL",
        codigo: "cyl_familia_numerosa",
        hechos: {
          tituloInicio: "2025-01-01",
          tituloFin: "2026-12-31",
          titulares: ["s-1"],
          descendientes,
          discapacidad65,
          conyuge: null,
          residenciaConyuge: "sin_conyuge",
        },
      },
    ],
  }) as const
it("CYL no aumenta familia numerosa con descendientes ajenos al mínimo anual", () => {
  const c = anualHijo("2023-01-01", 2)
  const r = Effect.runSync(
    liquidarIrpfAnual(
      { ...c, deduccionesTerritoriales2025: numerosa(["s-2"]) },
      { modo: "canonico" }
    )
  )
  expect(r.deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual({
    numeradorEuros: "600",
    divisor: "1",
  })
  const rechazo = Effect.runSync(
    Effect.flip(
      liquidarIrpfAnual(
        {
          ...c,
          deduccionesTerritoriales2025: numerosa(["s-2", "s-4", "s-5", "s-6"]),
        },
        { modo: "canonico" }
      )
    )
  )
  expect(rechazo.motivo).toMatch(/mínimo|descendientes/i)
})
it("CYL no añade 600 por discapacidad65 de un hijo anual sin discapacidad", () => {
  const c = anualHijo("2023-01-01", 2)
  const rechazo = Effect.runSync(
    Effect.flip(
      liquidarIrpfAnual(
        { ...c, deduccionesTerritoriales2025: numerosa(["s-2"], ["s-2"]) },
        { modo: "canonico" }
      )
    )
  )
  expect(rechazo.motivo).toMatch(/discapacidad/i)
})

const adopcionesOtras = [
  {
    territorio: "catalunya",
    esperado: { numeradorEuros: "150", divisor: "1" },
    solicitud: {
      solicitudes: [
        {
          lote: "A",
          hechos: {
            codigo: "cataluna_nacimiento_adopcion_acogimiento",
            eventos: [
              {
                id: "e",
                fecha: "2025-01-01",
                clase: "adopcion",
                persona: "s-2",
                nacimiento: "2023-01-01",
                titulares: ["s-1"],
                familia: "ordinaria",
                normaAcogimiento: "no-aplica",
                tituloVinculo: "resolucion",
                tituloMonoparental: "",
                acuerdoAcogimiento: "",
                antecedenteAcogimiento: {
                  persona: "s-2",
                  contribuyente: "s-1",
                  estado: "sin-acogimiento-previo",
                  soporte: "historial",
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    territorio: "madrid",
    esperado: { numeradorEuros: "7217", divisor: "10" },
    solicitud: {
      solicitudes: [
        {
          lote: "F",
          codigo: "madrid_adopcion_internacional",
          hechos: {
            eventos: [
              {
                hijo: "s-2",
                fecha: "2025-01-01",
                tipo: "adopcion_internacional",
                soporte: "resolucion",
                normaConvenioAplicable: "convenio",
                progenitoresConvivientesConDerecho: ["s-1"],
              },
            ],
          },
        },
      ],
    },
  },
] satisfies readonly {
  territorio: "catalunya" | "madrid"
  esperado: { numeradorEuros: string; divisor: string }
  solicitud: SolicitudDeduccionesTerritoriales2025
}[]
it.each(adopcionesOtras)(
  "$territorio concilia el vínculo conocido y conserva la adopción coherente",
  ({ territorio, solicitud, esperado }) => {
    const adoptivo = casoConFamilia([titular("s-1", true)])
    const c = {
      ...adoptivo,
      comunidadAutonoma: territorio,
      derechosMinimos: { ...adoptivo.derechosMinimos, territorio },
      deduccionesTerritoriales2025: solicitud,
    }
    const r = Effect.runSync(liquidarIrpfAnual(c, { modo: "canonico" }))
    expect(r.deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual(
      esperado
    )
    const biologico = casoConFamilia([consanguineo])
    const rechazo = Effect.runSync(
      Effect.flip(
        liquidarIrpfAnual(
          {
            ...c,
            derechosMinimos: { ...biologico.derechosMinimos, territorio },
          },
          { modo: "canonico" }
        )
      )
    )
    expect(rechazo.motivo).toMatch(/vínculo.*adopción/i)
  }
)
