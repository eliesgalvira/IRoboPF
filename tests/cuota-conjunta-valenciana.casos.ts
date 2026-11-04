import assert from "node:assert/strict"
import * as api from "../lib/dominio/irpf/deducciones/valenciana-2025/index"
import type { AplicacionCuotaConjuntaValenciana2025 as Entrada } from "../lib/dominio/irpf/deducciones/valenciana-2025/cuota-conjunta"
const c = (s: string) => "valenciana_" + s
const k = c("primera_vivienda_menores_35"),
  l = c("vivienda_discapacidad")
const o = c("autoconsumo_renovables"),
  z = c("inversion_entidades_nuevas_reciente_creacion")
const dana = c("dana_aportaciones_fondos_propios_entidades")
const id = (codigo: string) => JSON.stringify([codigo, 2025, "A"])
function entrada(cuota = 20): Entrada {
  return {
    criterioOrden: "eleccion_experta",
    ordenConsumo: [id(k), id(l)],
    hechos: {
      ejercicio: 2025,
      territorio: "comunitat-valenciana",
      modalidad: "individual",
      devengo: "2025-12-31",
      contribuyente: "A",
      bases: {
        liquidableGeneral: 10000,
        liquidableAhorro: 0,
        imponibleGeneral: 10000,
        imponibleAhorro: 0,
      },
      cantidades: [{ id: "pago", euros: 300 }],
      consignaciones: [],
      ordenBase30: [],
      solicitudes: [k, l].map((codigo) => ({
        codigo,
        eleccion: "aplicar",
        unidades: [
          {
            id: "u",
            titulares: ["A"],
            fecha: "2025-06-02",
            numeros: { pagosSinIntereses: 300, edad: 30 },
            textos: { discapacidadCualificadaDevengo: "expediente" },
          },
        ],
        referencias: [
          {
            unidad: "u",
            sujetos: ["A"],
            bienes: ["vivienda"],
            eventos: ["compra"],
            cantidades: ["pago"],
          },
        ],
      })),
      cuota: {
        referencia: "cuota-A-2025-v1",
        disponible: cuota,
        arrastres: [],
      },
    },
  }
}
function historico(
  codigo = o,
  origen = 2021,
  pendiente = 30,
  identificador = "h1"
) {
  return {
    id: identificador,
    codigo,
    origen,
    pendiente,
    contribuyente: "A",
    soporte: "declaracion-origen-y-saldo",
  }
}
function solo(saldos = [historico()], cuota = 20): Entrada {
  const a = entrada(cuota)
  return {
    ...a,
    ordenConsumo: saldos.map((v) => v.id),
    hechos: {
      ...a.hechos,
      solicitudes: [],
      cantidades: [],
      cuota: { ...a.hechos.cuota, arrastres: saldos },
    },
  }
}
const aplicar = (a: Entrada) => {
  assert.equal(
    api.aplicarCuotaConjuntaValenciana2025?.name,
    "aplicarCuotaConjuntaValenciana2025",
    "API publica conjunta ausente"
  )
  return api.aplicarCuotaConjuntaValenciana2025(a)
}
const valido = (a: Entrada, total: number, resto: number) => {
  const r = aplicar(a)
  assert.equal(r.estado, "calculo_parcial", JSON.stringify(r))
  assert.equal(r.totalAplicado, total)
  assert.equal(r.cuotaRestante, resto)
  assert.equal(r.aceptacionFiscal, "pendiente")
  return r
}
const rechaza = (a: Entrada) => {
  const r = aplicar(a)
  assert.equal(r.estado, "no_soportado", JSON.stringify(r))
  assert.equal(r.totalAplicado, undefined)
  assert.equal(r.cuotaRestante, undefined)
  assert.deepEqual(r.movimientos, [])
  return r
}
export const casos = {
  "base30 excesiva permanece separada y reserva de censo conservada": () => {
    const a = entrada(10),
      p = a.hechos.solicitudes[0],
      r = c("donaciones_lengua_valenciana")
    const b: Entrada = {
      ...a,
      ordenConsumo: [id(r)],
      hechos: {
        ...a.hechos,
        bases: { ...a.hechos.bases, liquidableGeneral: 500 },
        ordenBase30: [r],
        solicitudes: [
          {
            ...p,
            codigo: r,
            unidades: [
              {
                ...p.unidades[0],
                numeros: { valorAportado: 300 },
                textos: {
                  grupoDestinatario: "5",
                  inscripcionEficazCenso2025: "expediente",
                },
              },
            ],
          },
        ],
      },
    }
    // Techo de base150; 20% =30; cuota10 deja20 perdidos, nunca150 arrastrados.
    const s = valido(b, 10, 0)
    assert.deepEqual(s.composicion.resultados[0].base30, {
      solicitada: 300,
      asignada: 150,
      exceso: 150,
    })
    assert.deepEqual(
      [
        s.movimientos[0].deduccionDisponible,
        s.movimientos[0].perdidoPorCuota,
        s.movimientos[0].pendiente,
      ],
      [30, 20, 0]
    )
    assert.match(s.movimientos[0].soporte, /censo/i)
    const u = b.hechos.solicitudes[0]
    rechaza({
      ...b,
      hechos: {
        ...b.hechos,
        cuota: { ...b.hechos.cuota, disponible: 0 },
        solicitudes: [
          {
            ...u,
            unidades: [
              { ...u.unidades[0], textos: { grupoDestinatario: "5" } },
            ],
          },
        ],
      },
    })
  },
  "generacion renovable no arrastra exceso de inversion y consume cuota comun":
    () => {
      const a = entrada(20),
        p = a.hechos.solicitudes[0]
      const b: Entrada = {
        ...a,
        ordenConsumo: ["hist", id(o)],
        hechos: {
          ...a.hechos,
          cantidades: [{ id: "pago", euros: 10000 }],
          solicitudes: [
            {
              ...p,
              codigo: o,
              unidades: [
                {
                  ...p.unidades[0],
                  numeros: {
                    gasto: 10000,
                    ayudas: 0,
                    reembolsos: 0,
                    fraccionPagadaVivienda: 1,
                  },
                  textos: { vivienda: "habitual" },
                },
              ],
            },
          ],
          cuota: {
            ...a.hechos.cuota,
            arrastres: [historico(o, 2024, 5, "hist")],
          },
        },
      }
      // 40% de 8.800 = 3.520; cuota20: 5 históricos y 15 corrientes.
      // Los 1.200 de inversión fuera de base nunca son deducción ni saldo.
      const r = valido(b, 20, 0)
      assert.deepEqual(
        r.movimientos.map((v) => [
          v.deduccionDisponible,
          v.aplicado,
          v.pendiente,
        ]),
        [
          [5, 5, 0],
          [3520, 15, 3505],
        ]
      )
      assert.equal(r.movimientos[1].ultimoEjercicio, 2029)
    },
  "autoconsumo prioriza historicos y conserva el saldo corriente": () => {
    const a = entrada(20),
      p = a.hechos.solicitudes[0]
    const b: Entrada = {
      ...a,
      ordenConsumo: ["hist", id(o)],
      hechos: {
        ...a.hechos,
        cantidades: [{ id: "pago", euros: 100 }],
        solicitudes: [
          {
            ...p,
            codigo: o,
            unidades: [
              {
                ...p.unidades[0],
                numeros: {
                  gasto: 100,
                  ayudas: 0,
                  reembolsos: 0,
                  fraccionPagadaVivienda: 1,
                },
                textos: { vivienda: "habitual" },
              },
            ],
          },
        ],
        cuota: {
          ...a.hechos.cuota,
          arrastres: [historico(o, 2021, 30, "hist")],
        },
      },
    }
    const r = valido(b, 20, 0)
    assert.deepEqual(
      r.movimientos.map((v) => [v.aplicado, v.pendiente, v.caducadoAlCierre]),
      [
        [20, 0, 10],
        [0, 40, 0],
      ]
    )
    // Consumir antes los 40 corrientes perdería indebidamente 20 de saldo futuro.
    rechaza({ ...b, ordenConsumo: [id(o), "hist"] })
  },
  "z historicos preceden a generacion conforme al manual AEAT": () => {
    const a = entrada(20),
      p = a.hechos.solicitudes[0]
    const b: Entrada = {
      ...a,
      ordenConsumo: ["hist", id(z)],
      hechos: {
        ...a.hechos,
        solicitudes: [
          {
            ...p,
            codigo: z,
            unidades: [
              {
                ...p.unidades[0],
                numeros: { inversionDesembolsada: 300 },
                textos: { regimen: "general" },
              },
            ],
          },
        ],
        cuota: {
          ...a.hechos.cuota,
          arrastres: [historico(z, 2024, 5, "hist")],
        },
      },
    }
    const r = valido(b, 20, 0)
    assert.deepEqual(
      r.movimientos.map((v) => [v.aplicado, v.pendiente]),
      [
        [5, 0],
        [15, 75],
      ]
    )
    rechaza({ ...b, ordenConsumo: [id(z), "hist"] })
  },
  "API publica ausente es rojo significativo": () => {
    assert.equal(
      api.aplicarCuotaConjuntaValenciana2025?.name,
      "aplicarCuotaConjuntaValenciana2025"
    )
  },
  "cuota cero pierde dos deducciones sin arrastre": () => {
    const r = valido(entrada(0), 0, 0)
    assert.deepEqual(
      r.movimientos.map((v) => [
        v.deduccionDisponible,
        v.aplicado,
        v.perdidoPorCuota,
        v.pendiente,
      ]),
      [
        [15, 0, 15, 0],
        [15, 0, 15, 0],
      ]
    )
  },
  "dos codigos no reutilizan cuota y orden experto cambia el reparto": () => {
    const a = entrada(),
      r = valido(a, 20, 0)
    assert.deepEqual(
      r.movimientos.map((v) => [v.codigo, v.aplicado, v.perdidoPorCuota]),
      [
        [k, 15, 0],
        [l, 5, 10],
      ]
    )
    const s = valido(
      { ...a, ordenConsumo: [...a.ordenConsumo].reverse() },
      20,
      0
    )
    assert.deepEqual(
      s.movimientos.map((v) => [v.codigo, v.aplicado, v.perdidoPorCuota]),
      [
        [l, 15, 0],
        [k, 5, 10],
      ]
    )
    assert.equal(r.composicion.totalParcialAntesCuota, 30)
  },
  "cuota exacta y excedente": () => {
    valido(entrada(30), 30, 0)
    valido(entrada(30.01), 30, 0.01)
  },
  "centimos sin residuo binario": () => {
    const r = valido(
      solo([historico(o, 2024, 0.1, "a"), historico(z, 2024, 0.2, "b")], 0.3),
      0.3,
      0
    )
    assert.deepEqual(
      r.movimientos.map((v) => v.aplicado),
      [0.1, 0.2]
    )
  },
  "ultimo ano utilizable caduca al cierre sin rejuvenecer": () => {
    const r = valido(solo(), 20, 0)
    assert.deepEqual(
      [
        r.movimientos[0].aplicado,
        r.movimientos[0].pendiente,
        r.movimientos[0].caducadoAlCierre,
        r.movimientos[0].ultimoEjercicio,
      ],
      [20, 0, 10, 2025]
    )
  },
  "antiguedades y eleccion explicita sin FIFO implicito": () => {
    const a = solo(
      [historico(o, 2021, 30, "viejo"), historico(o, 2024, 40, "nuevo")],
      50
    )
    const r = valido(a, 50, 0)
    assert.deepEqual(
      r.movimientos.map((v) => [v.aplicado, v.pendiente, v.caducadoAlCierre]),
      [
        [30, 0, 0],
        [20, 20, 0],
      ]
    )
    const s = valido({ ...a, ordenConsumo: ["nuevo", "viejo"] }, 50, 0)
    assert.deepEqual(
      s.movimientos.map((v) => [v.aplicado, v.pendiente, v.caducadoAlCierre]),
      [
        [40, 0, 0],
        [10, 0, 20],
      ]
    )
  },
  "cuatro y tres anos fronteras": () => {
    valido(solo([historico(z, 2022)]), 20, 0)
    rechaza(solo([historico(z, 2021)]))
    rechaza(solo([historico(o, 2020)]))
  },
  "saldo DANA2024 sin generar hecho2025": () => {
    const r = valido(solo([historico(dana, 2024, 135)], 100), 100, 0)
    assert.equal(r.composicion.totalParcialAntesCuota, 0)
    assert.equal(r.composicion.resultados.length, 0)
    assert.deepEqual(
      [
        r.movimientos[0].clase,
        r.movimientos[0].origen,
        r.movimientos[0].pendiente,
      ],
      ["historico", 2024, 35]
    )
    rechaza(solo([historico(dana, 2023)]))
    valido(
      solo([historico(c("dana_danos_materiales_vivienda_habitual"), 2024)]),
      20,
      0
    )
  },
  "composicion y cuota rechazan historicos DANA anteriores al regimen": () => {
    for (const codigo of [dana, c("dana_danos_materiales_vivienda_habitual")]) {
      const anterior = solo([historico(codigo, 2023, 20)], 10)
      const diagnostico = api.componerDeduccionesValencianas2025(
        anterior.hechos
      )
      assert.equal(diagnostico.estado, "no_soportado")
      assert.equal(diagnostico.totalParcialAntesCuota, undefined)
      rechaza(anterior)
      const vigente = solo([historico(codigo, 2024, 20)], 10)
      assert.equal(
        api.componerDeduccionesValencianas2025(vigente.hechos).estado,
        "calculo_parcial"
      )
      const r = valido(vigente, 10, 0)
      assert.deepEqual(
        r.movimientos.map((v) => [v.aplicado, v.pendiente]),
        [[10, 10]]
      )
    }
  },
  "C01 no regenera aportacion 2024": () => {
    const a = entrada()
    const p = a.hechos.solicitudes[0]
    const r = rechaza({
      ...a,
      hechos: {
        ...a.hechos,
        solicitudes: [
          {
            ...p,
            codigo: dana,
            unidades: [
              {
                ...p.unidades[0],
                fecha: "2024-12-01",
                numeros: { inversionDesembolsada: 300 },
                textos: {},
              },
            ],
          },
        ],
      },
    })
    assert.equal(r.composicion.resultados[0].resultado.estado, "excluida")
    assert.equal(r.composicion.totalParcialAntesCuota, undefined)
  },
  "consolidacion por codigo origen titular y duplicados": () => {
    rechaza(solo([historico(), historico(o, 2021, 40, "otro-id")]))
    rechaza(solo([historico(), historico(z, 2024, 40, "h1")]))
    const a = solo()
    rechaza({
      ...a,
      hechos: {
        ...a.hechos,
        cuota: {
          ...a.hechos.cuota,
          arrastres: [{ ...historico(), contribuyente: "B" }],
        },
      },
    })
    rechaza(solo([historico(k, 2024)]))
  },
  "orden exhaustivo sin doble uso ni saldos ajenos": () => {
    const a = entrada()
    rechaza({ ...a, ordenConsumo: [] })
    rechaza({ ...a, ordenConsumo: [id(k), id(k)] })
    rechaza({ ...a, ordenConsumo: [id(k), "ajeno"] })
    // @ts-expect-error Se prueba un criterio runtime fuera del contrato.
    rechaza({ ...a, criterioOrden: "fifo" })
    const b = solo()
    rechaza({
      ...b,
      hechos: {
        ...b.hechos,
        consignaciones: [{ codigo: o, contribuyente: "A" }],
      },
    })
  },
  "colision id generado e historico": () => {
    const a = entrada()
    rechaza({
      ...a,
      hechos: {
        ...a.hechos,
        cuota: {
          ...a.hechos.cuota,
          arrastres: [historico(o, 2024, 30, id(k))],
        },
      },
    })
  },
  "no soportado no saneado por cuota0 ni orden": () => {
    const a = entrada(0),
      p = a.hechos.solicitudes[0]
    const r = rechaza({
      ...a,
      hechos: {
        ...a.hechos,
        solicitudes: [
          { ...p, codigo: "valenciana_inventado" },
          a.hechos.solicitudes[1],
        ],
      },
    })
    assert.equal(r.composicion.resultados[0].resultado.estado, "no_soportado")
    assert.equal(r.composicion.resultados.length, 2)
  },
  "omisiones no consumen pero preservan resultados": () => {
    const a = entrada()
    const r = valido(
      {
        ...a,
        ordenConsumo: [id(l)],
        hechos: {
          ...a.hechos,
          solicitudes: [
            { ...a.hechos.solicitudes[0], eleccion: "omitir" },
            a.hechos.solicitudes[1],
          ],
        },
      },
      15,
      5
    )
    assert.equal(r.composicion.resultados.length, 2)
    assert.equal(r.movimientos.length, 1)
  },
  "reservas y motivos conservados": () => {
    const r = valido(entrada(), 20, 0)
    assert.match(
      r.composicion.resultados[0].resultado.motivo,
      /acreditaciones externas pendientes/
    )
    assert.equal(
      r.movimientos[0].soporte,
      r.composicion.resultados[0].resultado.motivo
    )
    assert.match(r.reserva, /experto/)
    assert.match(r.reserva, /sin persistencia/)
  },
  "importe invalido y datos runtime no generan cero sustitutorio": () => {
    for (const n of [0.001, NaN, Infinity, -1, Number.MAX_SAFE_INTEGER])
      rechaza(entrada(n))
    // @ts-expect-error Se prueba entrada runtime nula.
    rechaza(null)
    // @ts-expect-error Se prueba entrada runtime incompleta.
    rechaza({ hechos: {} })
  },
  "no mutacion ni referencias de saldo compartidas": () => {
    const a = solo(),
      antes = structuredClone(a)
    Object.freeze(a.hechos.cuota.arrastres[0])
    Object.freeze(a.hechos.cuota.arrastres)
    Object.freeze(a.hechos.cuota)
    Object.freeze(a.hechos)
    Object.freeze(a)
    valido(a, 20, 0)
    assert.deepEqual(a, antes)
    const b = entrada(),
      copia = structuredClone(b)
    valido(b, 20, 0)
    assert.deepEqual(b, copia)
  },
}
