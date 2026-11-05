import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect, Result } from "effect"
import {
  liquidarIrpfAnual,
  liquidarIrpfAnualExplicito,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import type {
  DerechosMinimosAnuales,
  TitularDescendiente,
} from "../lib/dominio/irpf/minimos/derechos-contrato"
import type { SolicitudDeduccionesTerritoriales2025 as Solicitud } from "../lib/dominio/irpf/deducciones/anual-territorial"

type Territorio = DerechosMinimosAnuales["territorio"]
type Salida = Pick<
  Effect.Success<ReturnType<typeof liquidarIrpfAnual>>,
  "cuotaLiquidaCentimos" | "deduccionesTerritoriales2025"
>
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
const renta = Effect.runSync(
  liquidarIrpfAnual(base, { modo: "canonico" })
).rendimientoNetoTrabajoCentimos
const adoptivo: TitularDescendiente["vinculo"] = {
  clase: "adopcion",
  fechaConstitucionVinculo: "2025-02-01",
  fechaInicioIncremento: "2025-02-02",
  fundamento: "inscripcion-registro-civil",
  historialCompleto: true,
}
const biologico: TitularDescendiente["vinculo"] = { clase: "consanguinidad" }
function titular(
  vinculo: TitularDescendiente["vinculo"],
  id = "s-1"
): TitularDescendiente {
  return {
    titularId: id,
    grado: 1,
    vinculo,
    relacion: "convivencia",
    custodia: "compartida",
    alimentosJudiciales: false,
    aplicaEspecialidadAlimentos: false,
    residenteIrpf: true,
    rentasNoExentasCentimos: renta,
  }
}
function derechos(
  territorio: Territorio,
  titulares: readonly TitularDescendiente[],
  nacimiento = "2023-01-01"
): DerechosMinimosAnuales {
  return {
    ejercicio: 2025,
    territorio,
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
        fechaNacimiento: nacimiento,
        edadDevengo: 2025 - Number(nacimiento.slice(0, 4)),
        vivoAlDevengo: true,
        rentasNoExentasCentimos: 0,
        declaracion: { modalidad: "no-presenta" },
        discapacidad: { _tag: "SinDiscapacidad" },
        titularesCompletos: true,
        titulares,
      },
    ],
  }
}
const cyl = (
  titularesMinimo: readonly string[] = ["s-1"],
  fechaResolucion = "2025-02-01",
  fechaInscripcion = "2025-02-02"
): Solicitud => ({
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
            titularesMinimo,
            fechaResolucion,
            fechaInscripcion,
            ayudaAnalogica: "no_solicitada",
          },
        ],
      },
    },
  ],
})
function efectiva(
  territorio: Territorio,
  d: DerechosMinimosAnuales,
  solicitud?: Solicitud
) {
  return liquidarIrpfAnualExplicito({
    ejercicio: 2025,
    comunidadAutonoma: territorio,
    contribuyenteId: "s-1",
    edad: 40,
    modalidad: "individual",
    residenciaTodoElAnio: true,
    devengo: "2025-12-31",
    otrasRentas: "ninguna",
    familiaresConDerechoMinimo: "segun-derechos",
    derechosMinimos: {
      ...d,
      descendientes: d.descendientes.map((h) => ({
        ...h,
        titulares: h.titulares.map((t) => ({
          ...t,
          rentasNoExentasCentimos: renta,
        })),
      })),
    },
    discapacidad: "ninguna",
    reduccionesBase: "ninguna",
    saldosAnteriores: "ninguno",
    deducciones:
      solicitud === undefined
        ? "solo-da61-si-procede"
        : "territoriales-por-hechos-y-da61",
    deduccionesTerritoriales2025: solicitud,
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
            seguridadSocial: String((2800000 - renta) / 100),
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
  })
}
function ejecutar(
  api: "analitica" | "efectiva",
  territorio: Territorio,
  d: DerechosMinimosAnuales,
  solicitud?: Solicitud
): Effect.Effect<Salida, Effect.Error<ReturnType<typeof liquidarIrpfAnual>>> {
  return api === "efectiva"
    ? efectiva(territorio, d, solicitud).pipe(
        Effect.map((r) => ({
          ...r,
          cuotaLiquidaCentimos: new Decimal(r.cuotaLiquidaLegal)
            .times(100)
            .toNumber(),
        }))
      )
    : liquidarIrpfAnual(
        {
          ...base,
          comunidadAutonoma: territorio,
          derechosMinimos: d,
          deduccionesTerritoriales2025: solicitud,
        },
        { modo: "canonico" }
      )
}
function rechazo(
  api: "analitica" | "efectiva",
  territorio: Territorio,
  d: DerechosMinimosAnuales,
  s: Solicitud,
  motivo: RegExp
) {
  const r = Effect.runSync(Effect.result(ejecutar(api, territorio, d, s)))
  if (Result.isSuccess(r)) {
    const sin = Effect.runSync(ejecutar(api, territorio, d))
    process.stdout.write(
      JSON.stringify({
        api,
        importeIndebido:
          r.success.deduccionesTerritoriales2025?.aplicaciones[0],
        cuotaSin: sin.cuotaLiquidaCentimos,
        cuotaCon: r.success.cuotaLiquidaCentimos,
        diferenciaCentimos:
          sin.cuotaLiquidaCentimos - r.success.cuotaLiquidaCentimos,
      }) + "\n"
    )
  }
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) {
    expect(r.failure._tag).toBe("ResultadoNoSoportado")
    expect(r.failure.motivo).toMatch(motivo)
  }
}
for (const api of ["analitica", "efectiva"] as const) {
  it(`${api}: P1 consanguinidad no admite adopción CYL`, () =>
    rechazo(
      api,
      "castilla-y-leon",
      derechos("castilla-y-leon", [titular(biologico)]),
      cyl(),
      /vínculo.*adopción/i
    ))
  it.each([1, 2])(
    `${api}: adopción coherente %s titulares conserva784/392`,
    (n) => {
      const d = derechos(
        "castilla-y-leon",
        n === 1
          ? [titular(adoptivo)]
          : [titular(adoptivo), titular(adoptivo, "s-3")]
      )
      const ids = d.descendientes[0].titulares.map((t) => t.titularId)
      const con = Effect.runSync(ejecutar(api, "castilla-y-leon", d, cyl(ids)))
      const sin = Effect.runSync(ejecutar(api, "castilla-y-leon", d))
      expect(
        con.deduccionesTerritoriales2025?.aplicaciones[0].generado
      ).toEqual({ numeradorEuros: n === 1 ? "784" : "392", divisor: "1" })
      expect(sin.cuotaLiquidaCentimos - con.cuotaLiquidaCentimos).toBe(
        n === 1 ? 78400 : 39200
      )
    }
  )
  it(`${api}: constitución conocida contradictoria`, () =>
    rechazo(
      api,
      "castilla-y-leon",
      derechos("castilla-y-leon", [titular(adoptivo)]),
      cyl(["s-1"], "2025-03-01", "2025-03-02"),
      /constitución|fecha/i
    ))
  it(`${api}: inscripción anterior al inicio conocido`, () =>
    rechazo(
      api,
      "castilla-y-leon",
      derechos("castilla-y-leon", [
        titular({ ...adoptivo, fechaInicioIncremento: "2025-03-02" }),
      ]),
      cyl(),
      /inscripción/i
    ))
  it(`${api}: mixto queda pendiente de contrato`, () =>
    rechazo(
      api,
      "castilla-y-leon",
      derechos("castilla-y-leon", [
        titular(adoptivo),
        titular(biologico, "s-3"),
      ]),
      cyl(["s-3", "s-1"]),
      /mixtos.*pendiente/i
    ))
  it(`${api}: fecha constitución ausente mantiene exclusión explícita`, () =>
    rechazo(
      api,
      "castilla-y-leon",
      derechos("castilla-y-leon", [
        titular({ ...adoptivo, fechaConstitucionVinculo: undefined }),
      ]),
      cyl(),
      /Falta una fecha de constitución/i
    ))
  for (const territorio of ["madrid", "murcia"] as const) {
    const s: Solicitud = {
      solicitudes: [
        {
          lote: "F",
          codigo:
            territorio === "madrid"
              ? "madrid_adopcion_internacional"
              : "murcia_nacimiento_adopcion",
          hechos: {
            eventos: [
              {
                hijo: "s-2",
                fecha: "2025-02-01",
                tipo:
                  territorio === "madrid"
                    ? "adopcion_internacional"
                    : "adopcion",
                soporte: "resolucion",
                normaConvenioAplicable: "convenio",
                progenitoresConvivientesConDerecho: ["s-1"],
                ordenParaContribuyente: 1,
                soporteOrden: "registro",
              },
            ],
          },
        },
      ],
    }
    it(`${api}: ${territorio} adopción contradictoria`, () =>
      rechazo(
        api,
        territorio,
        derechos(territorio, [titular(biologico)]),
        s,
        /vínculo.*adopción/i
      ))
    it(`${api}: ${territorio} adopción coherente`, () =>
      expect(
        Effect.runSync(
          ejecutar(
            api,
            territorio,
            derechos(territorio, [titular(adoptivo)]),
            s
          )
        ).deduccionesTerritoriales2025?.aplicaciones[0].generado
      ).toEqual(
        territorio === "madrid"
          ? { numeradorEuros: "7217", divisor: "10" }
          : { numeradorEuros: "100", divisor: "1" }
      ))
  }
  const cat: Solicitud = {
    solicitudes: [
      {
        lote: "A",
        hechos: {
          codigo: "cataluna_nacimiento_adopcion_acogimiento",
          eventos: [
            {
              id: "adopcion",
              fecha: "2025-02-01",
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
  }
  it(`${api}: Catalunya contradicción adoptiva`, () =>
    rechazo(
      api,
      "catalunya",
      derechos("catalunya", [titular(biologico)]),
      cat,
      /vínculo.*adopción/i
    ))
  it(`${api}: Catalunya control150`, () =>
    expect(
      Effect.runSync(
        ejecutar(
          api,
          "catalunya",
          derechos("catalunya", [titular(adoptivo)]),
          cat
        )
      ).deduccionesTerritoriales2025?.aplicaciones[0].generado
    ).toEqual({ numeradorEuros: "150", divisor: "1" }))
  const hogar = (hijoNacimiento: string): Solicitud => ({
    solicitudes: [
      {
        lote: "CYL",
        codigo: "cyl_cuotas_seguridad_social_empleados_hogar",
        hechos: {
          exhaustividad: "todos_los_pagos",
          hijo: "s-2",
          hijoNacimiento,
          titularesMinimo: ["s-1"],
          ayudaAnalogica: "no_solicitada",
          pagos: [
            {
              id: "cotizacion",
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
  })
  it(`${api}: hogar control150 y contradicción nacimiento`, () => {
    const d = derechos("castilla-y-leon", [titular(biologico)])
    expect(
      Effect.runSync(ejecutar(api, "castilla-y-leon", d, hogar("2023-01-01")))
        .deduccionesTerritoriales2025?.aplicaciones[0].generado
    ).toEqual({ numeradorEuros: "150", divisor: "1" })
    rechazo(api, "castilla-y-leon", d, hogar("2023-01-02"), /nacimiento/i)
  })
  const numerosa = (
    descendientes: readonly string[],
    discapacidad65: readonly string[] = []
  ): Solicitud => ({
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
  })
  it(`${api}: familia numerosa censo efectivo y discapacidad conocida`, () => {
    const d = derechos("castilla-y-leon", [titular(biologico)])
    const h = d.descendientes[0]
    const dos = { ...d, descendientes: [h, { ...h, sujetoId: "s-4" }] }
    expect(
      Effect.runSync(
        ejecutar(api, "castilla-y-leon", dos, numerosa(["s-4", "s-2"]))
      ).deduccionesTerritoriales2025?.aplicaciones[0].generado
    ).toEqual({ numeradorEuros: "600", divisor: "1" })
    rechazo(
      api,
      "castilla-y-leon",
      dos,
      numerosa(["s-2"]),
      /censo.*incompleto/i
    )
    rechazo(api, "castilla-y-leon", d, numerosa(["s-2", "s-9"]), /mínimo/i)
    rechazo(
      api,
      "castilla-y-leon",
      d,
      numerosa(["s-2"], ["s-2"]),
      /discapacidad/i
    )
    const disc = {
      ...d,
      descendientes: [
        { ...h, discapacidad: { _tag: "Discapacidad65OMas" as const } },
      ],
    }
    expect(
      Effect.runSync(
        ejecutar(api, "castilla-y-leon", disc, numerosa(["s-2"], ["s-2"]))
      ).deduccionesTerritoriales2025?.aplicaciones[0].generado
    ).toEqual({ numeradorEuros: "1200", divisor: "1" })
  })
  const parto: Solicitud = {
    solicitudes: [
      {
        lote: "CLM",
        codigo: "clm_nacimiento_adopcion_hijos",
        hechos: {
          exhaustividad: "todos_los_eventos",
          eventos: [
            {
              id: "evento-independiente-del-hijo",
              tipo: "parto",
              fecha: "2025-02-01",
              hijos: ["s-2"],
              titularesMinimo: ["s-1"],
            },
          ],
        },
      },
    ],
  }
  it(`${api}: parto CLM con id ajeno al hijo válido`, () =>
    expect(
      Effect.runSync(
        ejecutar(
          api,
          "castilla-la-mancha",
          derechos("castilla-la-mancha", [titular(biologico)], "2025-02-01"),
          parto
        )
      ).deduccionesTerritoriales2025?.aplicaciones[0].generado
    ).toEqual({ numeradorEuros: "100", divisor: "1" }))
  it(`${api}: parto CLM contradice nacimiento conocido`, () =>
    rechazo(
      api,
      "castilla-la-mancha",
      derechos("castilla-la-mancha", [titular(biologico)], "2025-01-31"),
      parto,
      /parto|nacimiento/i
    ))
}
