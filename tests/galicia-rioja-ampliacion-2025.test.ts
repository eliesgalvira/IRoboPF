import { describe, it, expect } from "vitest"
import { evaluarAmpliacionE2025 } from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025"
import type { HechosAmpliacionE2025 } from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025"
import {
  r,
  euros,
  por,
  mas,
  presenta,
  serial,
  moverMes,
  dias2025,
} from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/comun"
import type {
  Contexto,
  Resultado,
  ClaveAnual,
} from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/comun"
import {
  casos,
  ctx,
  doc,
  pago,
  cuidado,
  H,
  inmueble,
  obra,
  alquilerVacio,
  ayudaComun,
  tiposMedios,
  A,
  viviendaHistorica,
  operacion,
  seguimiento,
} from "./galicia-rioja-ampliacion-2025.casos"
function parcial(r: Resultado, esperado: string): void {
  expect(r.estado).toBe("calculo_parcial")
  if (r.estado !== "calculo_parcial") throw new Error(r.motivos.join(";"))
  expect(r.presentacionEuros).toBe(esperado)
  expect(r.aceptacionFiscal).toBe("pendiente")
  expect(r.ambito).toBe("atribucion_titular_no_total_declaracion")
  expect(r.rastro.length).toBeGreaterThan(0)
}
function rechaza(c: Contexto, h: HechosAmpliacionE2025, motivo?: string): void {
  const r = evaluarAmpliacionE2025(c, h)
  expect(r.estado).toBe("no_soportado")
  expect("exacto" in r).toBe(false)
  if (motivo !== undefined && r.estado === "no_soportado")
    expect(r.motivos.join(";")).toContain(motivo)
}
function m(c: Contexto, clave: ClaveAnual, valor: string): Contexto {
  return {
    ...c,
    magnitudes: c.magnitudes.map((v) =>
      v.clave === clave ? { ...v, euros: valor } : v
    ),
  }
}
describe("38 oráculos monetarios por código, fijados desde fuente", () => {
  for (const x of casos)
    it(`${x.hechos.codigo} · ${x.fuente}`, () =>
      parcial(evaluarAmpliacionE2025(x.contexto, x.hechos), x.esperado))
  for (const x of casos)
    it(`${x.hechos.codigo}: ámbito e identidad`, () => {
      rechaza({ ...x.contexto, titular: "AJENO" }, x.hechos)
      rechaza(
        {
          ...x.contexto,
          territorio:
            x.contexto.territorio === "galicia" ? "la-rioja" : "galicia",
        },
        x.hechos
      )
    })
})
describe("Contrato racional y calendario sin redondeo intermedio", () => {
  it("500/3 exacto y presentación166.67", () => {
    const f = por(euros("500"), 1, 3)
    expect(serial(f)).toEqual({ numeradorCentimos: "50000", denominador: "3" })
    expect(presenta(f)).toBe("166.67")
  })
  it("céntimo al15% conserva3/20 de céntimo", () => {
    const f = por(euros("0.01"), 15, 100)
    expect(serial(f)).toEqual({ numeradorCentimos: "3", denominador: "20" })
    expect(presenta(f)).toBe("0.00")
  })
  it("se agregan fracciones antes de presentar", () =>
    expect(presenta(mas(r(1n, 3n), r(1n, 3n)))).toBe("0.01"))
  it("fin de febrero bisiesto y mes civil", () => {
    expect(moverMes("2024-01-31", 1)).toBe("2024-02-29")
    expect(moverMes("2025-01-31", 1)).toBe("2025-02-28")
  })
  it("183 días exactos e inclusión de extremos", () =>
    expect(dias2025([{ desde: "2025-01-01", hasta: "2025-07-02" }])).toBe(183))
  it("solapamientos no duplican estancia", () =>
    expect(() =>
      dias2025([
        { desde: "2025-01-01", hasta: "2025-02-01" },
        { desde: "2025-02-01", hasta: "2025-03-01" },
      ])
    ).toThrow())
})
describe("Gasto común de pagadores múltiples y dimensión de límites", () => {
  const h = {
    codigo: "rioja_hijo_0_3_escolarizado",
    hijos: [
      {
        ...cuidado,
        centro: { ...cuidado.centro, territorio: "la-rioja" },
        pagos: [
          pago("asistencia", "1000", "A1", "A"),
          pago("asistencia", "1000", "B1", "B"),
        ],
      },
    ],
    municipio: "Ábalos",
    trasladoResidencia: "2025-01-01",
    residencia: { desde: "2025-01-01", hasta: "2030-01-01" },
  } as const
  it("A1000+B1000 =>400 total y200 por titular", () =>
    parcial(evaluarAmpliacionE2025(ctx("la-rioja"), h), "200.00"))
  it("cap600 común se reparte:10000 gasto =>300 paraA", () =>
    parcial(
      evaluarAmpliacionE2025(ctx("la-rioja"), {
        ...h,
        hijos: [
          {
            ...h.hijos[0],
            pagos: [
              pago("asistencia", "5000", "A1", "A"),
              pago("asistencia", "5000", "B1", "B"),
            ],
          },
        ],
      }),
      "300.00"
    ))
  it("renovables: máximo personal280 se aplica después de atribuir coste", () =>
    parcial(
      evaluarAmpliacionE2025(ctx(), {
        codigo: "galicia_climatizacion_agua_caliente_renovables",
        inmuebles: [
          {
            inmueble,
            renovable: "solar",
            obra: "unifamiliar",
            instalador: "R",
            registroOVI: doc(),
            documentacionOVI: doc(),
            certificadoComunero: null,
            pagos: [pago("generacion", "20000")],
          },
        ],
        plazoAutoliquidacion: "2026-06-30",
        eleccion: "renovables",
      }),
      "280.00"
    ))
  it("adecuación: base3000 por vivienda antes de propiedad1/2 =>225", () =>
    parcial(
      evaluarAmpliacionE2025(ctx(), {
        codigo: "galicia_adecuacion_inmueble_vacio_arrendamiento",
        viviendas: [
          {
            alquiler: alquilerVacio,
            obra: {
              ...obra,
              inicio: "2024-01-01",
              fin: "2025-01-01",
              pagos: [pago("reparacion", "6000")],
            },
            baseConsumidaAnterior: "0",
            basePendienteAnterior: [],
          },
        ],
        inventarioArrendables: ["I"],
        ordenBase: ["AV"],
      }),
      "225.00"
    ))
  // SAFETY: valor de exhaustividad inválido intencionado para comprobar rechazo runtime.
  it("sin expediente completo no se usa pago propio como total común", () => {
    const entrada = ctx("la-rioja")
    Object.assign(entrada, { expediente: "solo_pagador_A" })
    rechaza(entrada, h)
  })
  it("renta18030 inclusiva;18030.01 excluye", () => {
    parcial(
      evaluarAmpliacionE2025(
        m(ctx("la-rioja"), "baseLiquidableGeneral", "18030"),
        h
      ),
      "200.00"
    )
    parcial(
      evaluarAmpliacionE2025(
        m(ctx("la-rioja"), "baseLiquidableGeneral", "18030.01"),
        h
      ),
      "0.00"
    )
  })
  it("renta ahorro1800 inclusiva;1800.01 excluye", () => {
    parcial(
      evaluarAmpliacionE2025(
        m(ctx("la-rioja"), "baseLiquidableAhorro", "1800"),
        h
      ),
      "200.00"
    )
    parcial(
      evaluarAmpliacionE2025(
        m(ctx("la-rioja"), "baseLiquidableAhorro", "1800.01"),
        h
      ),
      "0.00"
    )
  })
  it("duplicado de pago no se acepta", () =>
    rechaza(ctx("la-rioja"), {
      ...h,
      hijos: [
        { ...h.hijos[0], pagos: [h.hijos[0].pagos[0], h.hijos[0].pagos[0]] },
      ],
    }))
  it("pago a sí mismo se rechaza", () =>
    rechaza(ctx("la-rioja"), {
      ...h,
      hijos: [
        { ...h.hijos[0], pagos: [pago("asistencia", "1000", "A1", "A", "A")] },
      ],
    }))
  it("fecha imposible no produce impuesto cero", () =>
    rechaza(ctx("la-rioja"), {
      ...h,
      hijos: [
        {
          ...h.hijos[0],
          pagos: [{ ...pago("asistencia"), fecha: "2025-02-29" }],
        },
      ],
    }))
})
describe("Ayudas clasificadas y magnitudes anuales concretas", () => {
  const h = {
    codigo: "galicia_ayudas_incendios_peifoga_2025",
    ayudas: [{ ...ayudaComun, concepto: "decreto76_2025" }],
    tiposMedios,
  } as const
  it("800 enBL,resto no base =>160, nunca200 sobre concedido", () =>
    parcial(evaluarAmpliacionE2025(ctx(), h), "160.00"))
  it("ayuda personal exenta dentro intervalo no necesita tipo anual", () =>
    parcial(
      evaluarAmpliacionE2025(ctx(), {
        ...h,
        tiposMedios: [],
        ayudas: [
          {
            ...h.ayudas[0],
            partes: [
              {
                id: "EX",
                clasificacion: "exenta_RDL10_2026",
                importe: "1000",
                siniestro: "2025-08-25",
                acuerdoEstatal: doc(),
                inclusionPersonal: doc(),
              },
            ],
          },
        ],
      }),
      "0.00"
    ))
  it("septiembre no hereda exención estatal", () =>
    rechaza(
      ctx(),
      {
        ...h,
        ayudas: [
          {
            ...h.ayudas[0],
            partes: [
              {
                id: "EX",
                clasificacion: "exenta_RDL10_2026",
                importe: "1000",
                siniestro: "2025-09-01",
                acuerdoEstatal: doc(),
                inclusionPersonal: doc(),
              },
            ],
          },
        ],
      },
      "siniestros"
    ))
  it("imputación2026 no calcula declaración2025", () =>
    parcial(
      evaluarAmpliacionE2025(ctx(), {
        ...h,
        ayudas: [{ ...h.ayudas[0], ejercicioImputacion: 2026 }],
      }),
      "0.00"
    ))
  it("clasificación incompleta no supone exención", () =>
    rechaza(ctx(), { ...h, ayudas: [{ ...h.ayudas[0], partes: [] }] }))
  it("tipo medio de otro declarante se rechaza", () =>
    rechaza(ctx(), {
      ...h,
      tiposMedios: [{ ...tiposMedios[0], declarantes: ["B"] }, tiposMedios[1]],
    }))
  it("magnitud anual ausente identifica base liquidable necesaria", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "rioja_inversion_vivienda_jovenes_menores_36"
    )
    if (x === undefined) throw new Error("fixture")
    rechaza(
      {
        ...x.contexto,
        magnitudes: x.contexto.magnitudes.filter(
          (m) => m.clave !== "baseLiquidableGeneral"
        ),
      },
      x.hechos,
      "baseLiquidableGeneral"
    )
  })
})
describe("Tiempo e incompatibilidades por rama", () => {
  it("acogimiento90 días cero;91 días75;183 días150", () => {
    for (const [hasta, esperado] of [
      ["2025-03-31", "0.00"],
      ["2025-04-01", "75.00"],
      ["2025-07-02", "150.00"],
    ] as const)
      parcial(
        evaluarAmpliacionE2025(ctx("la-rioja"), {
          codigo: "rioja_menor_acogimiento_guarda_adopcion",
          menores: [
            {
              hijo: H,
              resolucion: doc(),
              regimen: "temporal",
              convivencia: [{ desde: "2025-01-01", hasta }],
              adopcion: null,
            },
          ],
        }),
        esperado
      )
  })
  it("adecuación discapacidad no habilitada por compra anterior2013 con obra nueva2025", () =>
    parcial(
      evaluarAmpliacionE2025(
        { ...ctx("la-rioja"), personas: [{ ...A, discapacidad: 33 }] },
        {
          codigo: "rioja_adecuacion_vivienda_discapacidad",
          viviendas: [
            {
              ...viviendaHistorica,
              operacion: "adecuacion",
              primerPagoObra: "2025-01-01",
              finConstruccion: "2025-06-01",
            },
          ],
          otrasModalidadesElegidas: [],
        }
      ),
      "0.00"
    ))
  it("capital1% inclusive,0.99 excluido;40%inclusive,40.01 excluido", () => {
    for (const [participacion, esperado] of [
      [1, "300.00"],
      [0.99, "0.00"],
      [40, "300.00"],
      [40.01, "0.00"],
    ] as const)
      parcial(
        evaluarAmpliacionE2025(ctx(), {
          codigo: "galicia_inversion_entidades_nuevas_reciente_creacion",
          operaciones: [
            {
              ...operacion,
              participacionFamiliarPorcentaje: participacion,
              participacionPropiaPorcentaje: Math.min(10, participacion),
            },
          ],
        }),
        esperado
      )
  })
  it("financiación préstamo exige superior a1% patrimonio, no igualdad", () =>
    parcial(
      evaluarAmpliacionE2025(ctx(), {
        codigo: "galicia_inversion_entidades_nuevas_financiacion",
        operaciones: [
          {
            ...operacion,
            modalidad: "prestamo",
            patrimonioNeto: "100000",
            participacionFamiliarPorcentaje: 0,
            participacionPropiaPorcentaje: 0,
            mantenimiento: seguimiento,
          },
        ],
      }),
      "0.00"
    ))
  it("importe de otra persona no se atribuye como inversión propia", () =>
    parcial(
      evaluarAmpliacionE2025(ctx(), {
        codigo: "galicia_inversion_entidades_nuevas_reciente_creacion",
        operaciones: [
          {
            ...operacion,
            titular: "B",
            pagos: [pago("inversion", "1000", "P", "B", "E")],
          },
        ],
      }),
      "0.00"
    ))
  it("libros permite efectivo solo en su rama2025", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "galicia_libros_texto_material_escolar"
    )
    if (
      x === undefined ||
      x.hechos.codigo !== "galicia_libros_texto_material_escolar"
    )
      throw new Error("fixture")
    parcial(
      evaluarAmpliacionE2025(x.contexto, {
        ...x.hechos,
        descendientes: x.hechos.descendientes.map((h) => ({
          ...h,
          compras: h.compras.map((a) => ({
            ...a,
            pago: { ...a.pago, medio: "efectivo" },
          })),
        })),
      }),
      "52.50"
    )
  })
  it("código desconocido se rechaza sin importe", () => {
    // SAFETY: discriminante deliberadamente inválido para probar rechazo runtime.
    const entrada = { ...casos[0].hechos }
    Object.assign(entrada, { codigo: "galicia_desconocida" })
    rechaza(ctx(), entrada)
  })
})

describe("Dimensiones familiares y datos desconocidos", () => {
  it("cuidado gallego:dos hijos,aunque solo uno genere gasto0–3,habilitan tope600", () =>
    parcial(
      evaluarAmpliacionE2025(ctx(), {
        codigo: "galicia_cuidado_hijos_menores",
        hijos: [
          { ...cuidado, pagos: [pago("asistencia", "3000")] },
          {
            ...cuidado,
            persona: { ...H.persona, id: "H2", nacimiento: "2015-01-01" },
            pagos: [],
          },
        ],
        municipio: "A Coruña",
        trasladoResidencia: "2020-01-01",
        residencia: { desde: "2020-01-01", hasta: "2030-01-01" },
      }),
      "300.00"
    ))
  it("mecenazgo no admite autopago como donación fiscal", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "rioja_donaciones_fomento_mecenazgo"
    )
    if (
      x === undefined ||
      x.hechos.codigo !== "rioja_donaciones_fomento_mecenazgo"
    )
      throw new Error("fixture")
    rechaza(x.contexto, {
      ...x.hechos,
      donaciones: x.hechos.donaciones.map((d) => ({
        ...d,
        beneficiario: { ...d.beneficiario, id: "A" },
      })),
    })
  })
  it("conjunta usa identidad completa de magnitudes, no renta individual para aplicar umbral30050", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "rioja_hijo_0_3_escolarizado"
    )
    if (x === undefined) throw new Error("fixture")
    const c: Contexto = {
      ...x.contexto,
      modalidad: "conjunta",
      declarantes: ["A", "B"],
      personas: [A, { ...A, id: "B" }],
      magnitudes: x.contexto.magnitudes.map((m) => ({
        ...m,
        declarantes: ["A", "B"],
        euros: m.clave === "baseLiquidableGeneral" ? "30050" : m.euros,
      })),
    }
    parcial(evaluarAmpliacionE2025(c, x.hechos), "100.00")
  })
})

describe("P2: adversos de contrato e identidad", () => {
  it("un hijo no puede ser su propio progenitor", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "galicia_nacimiento_adopcion_hijos"
    )
    if (
      x === undefined ||
      x.hechos.codigo !== "galicia_nacimiento_adopcion_hijos"
    )
      throw new Error("fixture")
    rechaza(x.contexto, {
      ...x.hechos,
      eventos: x.hechos.eventos.map((e) => ({
        ...e,
        progenitores: ["A", "H"],
        hijos: e.hijos.map((h) => ({
          ...h,
          convivientes: ["A", "H"],
          ordenPorProgenitor: [
            { titular: "A", orden: 1 },
            { titular: "H", orden: 1 },
          ],
        })),
      })),
    })
  })
  it("todos los ordinales parentales deben ser enteros positivos, incluso el otro progenitor", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "rioja_nacimiento_adopcion_hijos"
    )
    if (
      x === undefined ||
      x.hechos.codigo !== "rioja_nacimiento_adopcion_hijos"
    )
      throw new Error("fixture")
    rechaza(x.contexto, {
      ...x.hechos,
      eventos: x.hechos.eventos.map((e) => ({
        ...e,
        hijos: e.hijos.map((h) => ({
          ...h,
          ordenPorProgenitor: [
            { titular: "A", orden: 2 },
            { titular: "B", orden: -1 },
          ],
        })),
      })),
    })
  })
  it("evento de nacimiento sin hijos no es un expediente de importe cero", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "galicia_nacimiento_adopcion_hijos"
    )
    if (
      x === undefined ||
      x.hechos.codigo !== "galicia_nacimiento_adopcion_hijos"
    )
      throw new Error("fixture")
    rechaza(x.contexto, {
      ...x.hechos,
      eventos: x.hechos.eventos.map((e) => ({ ...e, hijos: [] })),
    })
  })
  const cuidadoH = {
    codigo: "galicia_cuidado_hijos_menores",
    hijos: [cuidado],
    municipio: "A Coruña",
    trasladoResidencia: "2020-01-01",
    residencia: { desde: "2020-01-01", hasta: "2030-01-01" },
  } as const
  it("el menor no puede ser progenitor de sí mismo para cuidado", () =>
    rechaza(ctx(), {
      ...cuidadoH,
      hijos: [
        {
          ...cuidado,
          progenitores: [
            cuidado.progenitores[0],
            { ...cuidado.progenitores[1], id: "H" },
          ],
        },
      ],
    }))
  it("titular del cuidado debe ser progenitor identificado", () =>
    rechaza(ctx(), {
      ...cuidadoH,
      hijos: [
        {
          ...cuidado,
          progenitores: cuidado.progenitores.map((p) => ({
            ...p,
            id: p.id === "A" ? "X" : p.id,
          })),
        },
      ],
    }))
  it("el menor no puede ser titular de su propia deducción", () =>
    rechaza(ctx(), {
      ...cuidadoH,
      hijos: [{ ...cuidado, titularesDeduccion: ["A", "H"] }],
    }))
  it("derecho del cuidado no se reparte a un tercero ajeno a progenitores", () =>
    rechaza(ctx(), {
      ...cuidadoH,
      hijos: [{ ...cuidado, titularesDeduccion: ["A", "X"] }],
    }))
  it("periodo de cuidado no puede preceder al nacimiento", () =>
    rechaza(ctx(), {
      ...cuidadoH,
      hijos: [
        {
          ...cuidado,
          periodo: { desde: "2020-01-01", hasta: "2025-12-31" },
          progenitores: cuidado.progenitores.map((p) => ({
            ...p,
            actividad: { desde: "2020-01-01", hasta: "2030-01-01" },
          })),
        },
      ],
    }))
  it("pago de tercero no identificado no se concilia automáticamente como gasto parental", () =>
    rechaza(ctx(), {
      ...cuidadoH,
      hijos: [{ ...cuidado, pagos: [pago("asistencia", "1000", "P", "X")] }],
    }))
  it("mínimo mensual no puede atribuirse al propio hijo", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "rioja_hijo_0_3_pequenos_municipios"
    )
    if (
      x === undefined ||
      x.hechos.codigo !== "rioja_hijo_0_3_pequenos_municipios"
    )
      throw new Error("fixture")
    rechaza(x.contexto, {
      ...x.hechos,
      meses: x.hechos.meses.map((m) => ({
        ...m,
        titularesPorHijo: [{ hijo: "H", titulares: ["A", "H"] }],
      })),
    })
  })
  it("adopción anterior al nacimiento se rechaza", () =>
    rechaza(ctx("la-rioja"), {
      codigo: "rioja_menor_acogimiento_guarda_adopcion",
      menores: [
        {
          hijo: H,
          resolucion: doc(),
          regimen: "temporal",
          convivencia: [{ desde: "2025-01-01", hasta: "2025-07-02" }],
          adopcion: "2020-01-01",
        },
      ],
    }))
  it("contradicción entre convivencia explícita y periodo de acogida no es cero", () =>
    rechaza(ctx("la-rioja"), {
      codigo: "rioja_menor_acogimiento_guarda_adopcion",
      menores: [
        {
          hijo: { ...H, convivientes: ["B"] },
          resolucion: doc(),
          regimen: "temporal",
          convivencia: [{ desde: "2025-01-01", hasta: "2025-07-02" }],
          adopcion: null,
        },
      ],
    }))
  it("magnitud anual duplicada se rechaza antes de cualquier fórmula", () => {
    const x = casos[0]
    rechaza(
      {
        ...x.contexto,
        magnitudes: [...x.contexto.magnitudes, x.contexto.magnitudes[0]],
      },
      x.hechos
    )
  })
  it("magnitud anual requerida ajena no se asume propia", () => {
    const x = casos[0]
    rechaza(
      {
        ...x.contexto,
        magnitudes: x.contexto.magnitudes.map((m) =>
          m.clave === "baseImponibleTotal" ? { ...m, declarantes: ["B"] } : m
        ),
      },
      x.hechos
    )
  })
  it("consumo anual negativo no amplía el máximo", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "rioja_vivienda_habitual_pequenos_municipios"
    )
    if (x === undefined) throw new Error("fixture")
    rechaza(m(x.contexto, "baseConsumidaViviendaMunicipios", "-100"), x.hechos)
  })
})

describe("P2: porcentajes propios/familiares y financiación", () => {
  it("préstamo sin participación propia: familia50% no importa límite de capital", () => {
    const o = {
      ...operacion,
      modalidad: "prestamo",
      participacionFamiliarPorcentaje: 50,
      patrimonioNeto: "10000",
    } as const
    Object.assign(o, { participacionPropiaPorcentaje: 0 })
    parcial(
      evaluarAmpliacionE2025(ctx(), {
        codigo: "galicia_inversion_entidades_nuevas_financiacion",
        operaciones: [o],
      }),
      "300.00"
    )
  })
  it("participación propia no puede superar la familiar computada", () => {
    const o = { ...operacion }
    Object.assign(o, { participacionPropiaPorcentaje: 50 })
    rechaza(ctx(), {
      codigo: "galicia_inversion_entidades_nuevas_reciente_creacion",
      operaciones: [o],
    })
  })
  it("amortización de garantía no es amortización de préstamo", () => {
    const o = {
      ...operacion,
      modalidad: "garantia",
      importeGarantizado: "1000",
      pagos: [],
      amortizaciones: [{ ejercicio: 2025, principal: "300" }],
    } as const
    rechaza(ctx(), {
      codigo: "galicia_inversion_entidades_nuevas_financiacion",
      operaciones: [o],
    })
  })
  it("vigencia de garantía inferior a cinco años no se inventa como mantenimiento", () =>
    parcial(
      evaluarAmpliacionE2025(ctx(), {
        codigo: "galicia_inversion_entidades_nuevas_financiacion",
        operaciones: [
          {
            ...operacion,
            modalidad: "garantia",
            importeGarantizado: "1000",
            pagos: [],
            fechaVencimiento: "2029-12-31",
          },
        ],
      }),
      "0.00"
    ))
  it("dos participaciones propiasMAB del mismo emisor se concilian antes del10%", () => {
    const x = casos.find((x) => x.hechos.codigo === "galicia_inversion_mab")
    if (x === undefined || x.hechos.codigo !== "galicia_inversion_mab")
      throw new Error("fixture")
    rechaza(x.contexto, {
      ...x.hechos,
      operaciones: [
        x.hechos.operaciones[0],
        { ...x.hechos.operaciones[0], id: "M2", participacionPorcentaje: 9 },
      ],
    })
  })
})

describe("P2: pagos, cronología y límites de vivienda/vehículo", () => {
  it("cobertura común se resta antes de atribuir propiedad:1000-200,mitad,15%=60", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "rioja_inversion_vivienda_jovenes_menores_36"
    )
    if (
      x === undefined ||
      x.hechos.codigo !== "rioja_inversion_vivienda_jovenes_menores_36"
    )
      throw new Error("fixture")
    parcial(
      evaluarAmpliacionE2025(x.contexto, {
        ...x.hechos,
        viviendas: x.hechos.viviendas.map((v) => ({
          ...v,
          pagos: [pago("intereses", "1000")],
          coberturaIntereses: "200",
        })),
      }),
      "60.00"
    )
  })
  it("pago inmobiliario de tercero no identificado necesita atribución, no participación automática", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "rioja_inversion_vivienda_jovenes_menores_36"
    )
    if (
      x === undefined ||
      x.hechos.codigo !== "rioja_inversion_vivienda_jovenes_menores_36"
    )
      throw new Error("fixture")
    rechaza(x.contexto, {
      ...x.hechos,
      viviendas: x.hechos.viviendas.map((v) => ({
        ...v,
        pagos: [pago("adquisicion", "1000", "P", "X")],
      })),
    })
  })
  it("código de adquisición histórica no aplica obras de adecuación como si fueran adquisición", () =>
    parcial(
      evaluarAmpliacionE2025(ctx("la-rioja"), {
        codigo: "rioja_adquisicion_construccion_vivienda_jovenes",
        viviendas: [{ ...viviendaHistorica, operacion: "adecuacion" }],
        otrasModalidadesElegidas: [],
      }),
      "0.00"
    ))
  it("constancia de deducción previa exige ejercicio fiscal anterior2013", () => {
    const x = casos.find(
      (x) =>
        x.hechos.codigo === "rioja_adquisicion_construccion_vivienda_jovenes"
    )
    if (
      x === undefined ||
      x.hechos.codigo !== "rioja_adquisicion_construccion_vivienda_jovenes"
    )
      throw new Error("fixture")
    const viviendas = x.hechos.viviendas.map((v) => {
      const a = { ...v }
      Object.assign(a, { ejercicioDeduccionAnterior: 2020 })
      return a
    })
    rechaza(x.contexto, { ...x.hechos, viviendas })
  })
  it("duración de arriendo contradictoria requiere cadena, no cuota500 ficticia", () =>
    rechaza(ctx(), {
      codigo: "galicia_arrendamiento_viviendas_vacias",
      viviendas: [
        {
          ...alquilerVacio,
          vacioHasta: "2025-04-01",
          duracion: { desde: "2025-04-01", hasta: "2025-09-01" },
        },
      ],
      inventarioArrendables: ["I"],
      historiaPrimerArriendo: [{ inmueble: "I", primerContrato: "2025-04-01" }],
    }))
  it("misma factura/pago no puede financiar dos inmuebles", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "galicia_rehabilitacion_centros_historicos"
    )
    if (
      x === undefined ||
      x.hechos.codigo !== "galicia_rehabilitacion_centros_historicos"
    )
      throw new Error("fixture")
    rechaza(x.contexto, {
      ...x.hechos,
      inmuebles: [
        x.hechos.inmuebles[0],
        { ...x.hechos.inmuebles[0], inmueble: { ...inmueble, id: "I2" } },
      ],
    })
  })
  it("pago duplicado entre obra y certificado energético no se cuenta dos veces", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "galicia_obras_eficiencia_energetica"
    )
    if (
      x === undefined ||
      x.hechos.codigo !== "galicia_obras_eficiencia_energetica"
    )
      throw new Error("fixture")
    rechaza(x.contexto, {
      ...x.hechos,
      viviendas: x.hechos.viviendas.map((v) => ({
        ...v,
        pagosCertificado: [{ ...v.obra.pagos[0], concepto: "certificado" }],
      })),
    })
  })
  it("vehículo financiado:precio20000 y saldo19000 no reduce adquisición a1000", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "rioja_vehiculos_electricos_nuevos"
    )
    if (
      x === undefined ||
      x.hechos.codigo !== "rioja_vehiculos_electricos_nuevos"
    )
      throw new Error("fixture")
    const vehiculos = x.hechos.vehiculos.map((v) => {
      const a = { ...v, categoria: "N1" as const, precio: "20000" }
      Object.assign(a, {
        saldoPendientePrecio: "19000",
        contratoFinanciacion: doc(),
      })
      return a
    })
    parcial(
      evaluarAmpliacionE2025(x.contexto, { ...x.hechos, vehiculos }),
      "300.00"
    )
  })
  it("pagos por vehículo superiores a contraprestación no se concilian", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "rioja_vehiculos_electricos_nuevos"
    )
    if (
      x === undefined ||
      x.hechos.codigo !== "rioja_vehiculos_electricos_nuevos"
    )
      throw new Error("fixture")
    rechaza(x.contexto, {
      ...x.hechos,
      vehiculos: x.hechos.vehiculos.map((v) => ({
        ...v,
        pagos: [pago("vehiculo", "2000")],
      })),
    })
  })
  it("saldo anual de otra declaración no permite aplicar cupo de vehículo", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "rioja_vehiculos_electricos_nuevos"
    )
    if (x === undefined) throw new Error("fixture")
    rechaza(
      {
        ...x.contexto,
        magnitudes: x.contexto.magnitudes.map((m) =>
          m.clave === "cuotaElectricoConsumidaDeclaracion"
            ? { ...m, declarantes: ["B"] }
            : m
        ),
      },
      x.hechos
    )
  })
})

describe("P2: exacto de los38 y contratos cerrados", () => {
  for (const x of casos)
    it(`${x.hechos.codigo}: racional exacto del oráculo`, () => {
      const r = evaluarAmpliacionE2025(x.contexto, x.hechos)
      expect(r.estado).toBe("calculo_parcial")
      if (r.estado !== "calculo_parcial") throw new Error(r.motivos.join(";"))
      expect(r.exacto).toEqual({
        numeradorCentimos: BigInt(x.esperado.replace(".", "")).toString(),
        denominador: "1",
      })
    })
  it("arriendo corto seguido de contrato con vacío<=6meses,total>3años", () =>
    parcial(
      evaluarAmpliacionE2025(ctx(), {
        codigo: "galicia_arrendamiento_viviendas_vacias",
        viviendas: [
          {
            ...alquilerVacio,
            vacioHasta: "2025-04-01",
            duracion: { desde: "2025-04-01", hasta: "2025-09-01" },
            contratosSucesivos: [
              {
                periodo: { desde: "2026-03-01", hasta: "2029-03-01" },
                arrendatarios: [{ id: "INQ2", vinculo: "sin_parentesco" }],
                soporte: doc(),
              },
            ],
          },
        ],
        inventarioArrendables: ["I"],
        historiaPrimerArriendo: [
          { inmueble: "I", primerContrato: "2025-04-01" },
        ],
      }),
      "250.00"
    ))
  it("vacío de seis meses y un día no se cubre por cadena", () =>
    rechaza(ctx(), {
      codigo: "galicia_arrendamiento_viviendas_vacias",
      viviendas: [
        {
          ...alquilerVacio,
          vacioHasta: "2025-04-01",
          duracion: { desde: "2025-04-01", hasta: "2025-09-01" },
          contratosSucesivos: [
            {
              periodo: { desde: "2026-03-02", hasta: "2030-03-01" },
              arrendatarios: [{ id: "INQ2", vinculo: "sin_parentesco" }],
              soporte: doc(),
            },
          ],
        },
      ],
      inventarioArrendables: ["I"],
      historiaPrimerArriendo: [{ inmueble: "I", primerContrato: "2025-04-01" }],
    }))
  it("38 resultados no son cuota aplicada ni total de conjunta", () => {
    for (const x of casos) {
      const r = evaluarAmpliacionE2025(x.contexto, x.hechos)
      expect(r.estado).toBe("calculo_parcial")
      if (r.estado === "calculo_parcial") {
        expect(r.aceptacionFiscal).toBe("pendiente")
        expect(r.titular).toBe(x.contexto.titular)
        expect(r.ambito).toBe("atribucion_titular_no_total_declaracion")
        expect("cuotaAplicada" in r).toBe(false)
      }
    }
  })
})

describe("P2: campos pendientes no se convierten en exclusiones conocidas", () => {
  it("magnitud ajena incluso no utilizada no pertenece al contexto declarado", () => {
    const x = casos.find((x) => x.hechos.codigo === "galicia_familia_numerosa")
    if (x === undefined) throw new Error("fixture")
    rechaza(
      {
        ...x.contexto,
        magnitudes: x.contexto.magnitudes.map((m) =>
          m.clave === "baseLiquidableAhorro" ? { ...m, declarantes: ["B"] } : m
        ),
      },
      x.hechos
    )
  })
  it("cobertura superior a los intereses del expediente es contradicción,no base cero", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "rioja_inversion_vivienda_jovenes_menores_36"
    )
    if (
      x === undefined ||
      x.hechos.codigo !== "rioja_inversion_vivienda_jovenes_menores_36"
    )
      throw new Error("fixture")
    rechaza(x.contexto, {
      ...x.hechos,
      viviendas: x.hechos.viviendas.map((v) => ({
        ...v,
        pagos: [pago("intereses", "100")],
        coberturaIntereses: "200",
      })),
    })
  })
  it("centro de cuidado desconocido no se trata como escuela", () => {
    const centro = { ...cuidado.centro }
    Object.assign(centro, { tipo: "desconocido" })
    rechaza(ctx(), {
      codigo: "galicia_cuidado_hijos_menores",
      hijos: [{ ...cuidado, centro }],
      municipio: "A Coruña",
      trasladoResidencia: "2020-01-01",
      residencia: { desde: "2020-01-01", hasta: "2030-01-01" },
    })
  })
  it("situación agraria desconocida se rechaza,no deducción cero", () => {
    const x = casos.find(
      (x) => x.hechos.codigo === "rioja_fijacion_poblacion_ocupada_medio_rural"
    )
    if (
      x === undefined ||
      x.hechos.codigo !== "rioja_fijacion_poblacion_ocupada_medio_rural"
    )
      throw new Error("fixture")
    const hechos = { ...x.hechos }
    Object.assign(hechos, { tipo: "desconocido" })
    rechaza(x.contexto, hechos)
  })
})
