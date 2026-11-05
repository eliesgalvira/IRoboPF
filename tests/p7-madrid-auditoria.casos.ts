import type { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
export const casosAuditoria: readonly { nombre: string; solicitud: SolicitudAnualF2025; esperado: { numeradorEuros: string; divisor: string }; real: readonly number[]; contra: readonly number[] }[] = [
  {
    "nombre": "vencimiento12",
    "solicitud": {
      "lote": "F-ampliado",
      "codigo": "madrid_incremento_costes_financiacion_vivienda",
      "hechos": {
        "miembrosUnidad": [
          "s-1"
        ],
        "viviendas": [
          {
            "id": "v",
            "territorio": "madrid",
            "adquisicion": "2020-01-15",
            "precioEUR": "390000",
            "ocupacionDesde": "2020-02-01",
            "permanenciaHasta": "2025-12-31",
            "porcentajePropiedad": "100",
            "titulares": [
              "s-1"
            ]
          }
        ],
        "prestamos": [
          {
            "id": "p",
            "tipo": "hipoteca_variable",
            "fecha": "2020-01-15",
            "viviendaId": "v",
            "destinoContrato": "adquisicion",
            "soporteDestino": "escritura",
            "entidadCredito": "banco",
            "contratoMadrid": {
              "indice": "euribor_12_meses",
              "documento": "escritura",
              "saldoInicio2025EUR": "10000.00",
              "certificadoSaldo": "saldo-2024-12-31",
              "mesesPendientesInicio2025": 12,
              "diaRecibo": 15,
              "revision": "enero_anual",
              "sistema": "frances",
              "computo": "tin_dividido_12",
              "redondeo": "centimo_comercial_cuota_e_interes",
              "prestatarios": [
                "s-1"
              ],
              "destino": "adquisicion_integra_vivienda",
              "situacionAplicacion": "sigue_habitual",
              "referenciaHabitualAplicacion": "padron-aplicacion",
              "incidencias2025": [],
              "diferencialPorcentaje": "0.5",
              "desfaseIndiceMeses": 1,
              "revisiones": [
                {
                  "mes": 1,
                  "mesIndice": "2024-12",
                  "euriborPorcentaje": "4.5",
                  "documento": "revision-audit-1"
                }
              ],
              "recibos": [
                {
                  "mes": 1,
                  "cuotaSatisfechaEUR": "856.07",
                  "soporte": "cargo-audit-1"
                },
                {
                  "mes": 2,
                  "cuotaSatisfechaEUR": "856.07",
                  "soporte": "cargo-audit-2"
                },
                {
                  "mes": 3,
                  "cuotaSatisfechaEUR": "856.07",
                  "soporte": "cargo-audit-3"
                },
                {
                  "mes": 4,
                  "cuotaSatisfechaEUR": "856.07",
                  "soporte": "cargo-audit-4"
                },
                {
                  "mes": 5,
                  "cuotaSatisfechaEUR": "856.07",
                  "soporte": "cargo-audit-5"
                },
                {
                  "mes": 6,
                  "cuotaSatisfechaEUR": "856.07",
                  "soporte": "cargo-audit-6"
                },
                {
                  "mes": 7,
                  "cuotaSatisfechaEUR": "856.07",
                  "soporte": "cargo-audit-7"
                },
                {
                  "mes": 8,
                  "cuotaSatisfechaEUR": "856.07",
                  "soporte": "cargo-audit-8"
                },
                {
                  "mes": 9,
                  "cuotaSatisfechaEUR": "856.07",
                  "soporte": "cargo-audit-9"
                },
                {
                  "mes": 10,
                  "cuotaSatisfechaEUR": "856.07",
                  "soporte": "cargo-audit-10"
                },
                {
                  "mes": 11,
                  "cuotaSatisfechaEUR": "856.07",
                  "soporte": "cargo-audit-11"
                },
                {
                  "mes": 12,
                  "cuotaSatisfechaEUR": "856.12",
                  "soporte": "cargo-audit-12"
                }
              ]
            }
          }
        ],
        "pagos": [
          {
            "id": "pago-1",
            "fecha": "2025-01-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.67",
            "soportePago": "cargo-1"
          },
          {
            "id": "pago-2",
            "fecha": "2025-02-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "38.27",
            "soportePago": "cargo-2"
          },
          {
            "id": "pago-3",
            "fecha": "2025-03-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "34.87",
            "soportePago": "cargo-3"
          },
          {
            "id": "pago-4",
            "fecha": "2025-04-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "31.44",
            "soportePago": "cargo-4"
          },
          {
            "id": "pago-5",
            "fecha": "2025-05-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "28.01",
            "soportePago": "cargo-5"
          },
          {
            "id": "pago-6",
            "fecha": "2025-06-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "24.56",
            "soportePago": "cargo-6"
          },
          {
            "id": "pago-7",
            "fecha": "2025-07-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "21.09",
            "soportePago": "cargo-7"
          },
          {
            "id": "pago-8",
            "fecha": "2025-08-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "17.61",
            "soportePago": "cargo-8"
          },
          {
            "id": "pago-9",
            "fecha": "2025-09-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "14.12",
            "soportePago": "cargo-9"
          },
          {
            "id": "pago-10",
            "fecha": "2025-10-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "10.61",
            "soportePago": "cargo-10"
          },
          {
            "id": "pago-11",
            "fecha": "2025-11-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "7.09",
            "soportePago": "cargo-11"
          },
          {
            "id": "pago-12",
            "fecha": "2025-12-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "3.55",
            "soportePago": "cargo-12"
          }
        ]
      }
    },
    "esperado": {
      "numeradorEuros": "813",
      "divisor": "40"
    },
    "real": [
      4167,
      3827,
      3487,
      3144,
      2801,
      2456,
      2109,
      1761,
      1412,
      1061,
      709,
      355
    ],
    "contra": [
      2932,
      2691,
      2450,
      2208,
      1966,
      1723,
      1479,
      1234,
      989,
      743,
      496,
      248
    ]
  },
  {
    "nombre": "vencimiento13",
    "solicitud": {
      "lote": "F-ampliado",
      "codigo": "madrid_incremento_costes_financiacion_vivienda",
      "hechos": {
        "miembrosUnidad": [
          "s-1"
        ],
        "viviendas": [
          {
            "id": "v",
            "territorio": "madrid",
            "adquisicion": "2020-01-15",
            "precioEUR": "390000",
            "ocupacionDesde": "2020-02-01",
            "permanenciaHasta": "2025-12-31",
            "porcentajePropiedad": "100",
            "titulares": [
              "s-1"
            ]
          }
        ],
        "prestamos": [
          {
            "id": "p",
            "tipo": "hipoteca_variable",
            "fecha": "2020-01-15",
            "viviendaId": "v",
            "destinoContrato": "adquisicion",
            "soporteDestino": "escritura",
            "entidadCredito": "banco",
            "contratoMadrid": {
              "indice": "euribor_12_meses",
              "documento": "escritura",
              "saldoInicio2025EUR": "10000.00",
              "certificadoSaldo": "saldo-2024-12-31",
              "mesesPendientesInicio2025": 13,
              "diaRecibo": 15,
              "revision": "enero_anual",
              "sistema": "frances",
              "computo": "tin_dividido_12",
              "redondeo": "centimo_comercial_cuota_e_interes",
              "prestatarios": [
                "s-1"
              ],
              "destino": "adquisicion_integra_vivienda",
              "situacionAplicacion": "sigue_habitual",
              "referenciaHabitualAplicacion": "padron-aplicacion",
              "incidencias2025": [],
              "diferencialPorcentaje": "0.5",
              "desfaseIndiceMeses": 1,
              "revisiones": [
                {
                  "mes": 1,
                  "mesIndice": "2024-12",
                  "euriborPorcentaje": "4.5",
                  "documento": "revision-audit-1"
                }
              ],
              "recibos": [
                {
                  "mes": 1,
                  "cuotaSatisfechaEUR": "791.85",
                  "soporte": "cargo-audit-1"
                },
                {
                  "mes": 2,
                  "cuotaSatisfechaEUR": "791.85",
                  "soporte": "cargo-audit-2"
                },
                {
                  "mes": 3,
                  "cuotaSatisfechaEUR": "791.85",
                  "soporte": "cargo-audit-3"
                },
                {
                  "mes": 4,
                  "cuotaSatisfechaEUR": "791.85",
                  "soporte": "cargo-audit-4"
                },
                {
                  "mes": 5,
                  "cuotaSatisfechaEUR": "791.85",
                  "soporte": "cargo-audit-5"
                },
                {
                  "mes": 6,
                  "cuotaSatisfechaEUR": "791.85",
                  "soporte": "cargo-audit-6"
                },
                {
                  "mes": 7,
                  "cuotaSatisfechaEUR": "791.85",
                  "soporte": "cargo-audit-7"
                },
                {
                  "mes": 8,
                  "cuotaSatisfechaEUR": "791.85",
                  "soporte": "cargo-audit-8"
                },
                {
                  "mes": 9,
                  "cuotaSatisfechaEUR": "791.85",
                  "soporte": "cargo-audit-9"
                },
                {
                  "mes": 10,
                  "cuotaSatisfechaEUR": "791.85",
                  "soporte": "cargo-audit-10"
                },
                {
                  "mes": 11,
                  "cuotaSatisfechaEUR": "791.85",
                  "soporte": "cargo-audit-11"
                },
                {
                  "mes": 12,
                  "cuotaSatisfechaEUR": "791.85",
                  "soporte": "cargo-audit-12"
                }
              ]
            }
          }
        ],
        "pagos": [
          {
            "id": "pago-1",
            "fecha": "2025-01-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.67",
            "soportePago": "cargo-1"
          },
          {
            "id": "pago-2",
            "fecha": "2025-02-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "38.54",
            "soportePago": "cargo-2"
          },
          {
            "id": "pago-3",
            "fecha": "2025-03-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "35.40",
            "soportePago": "cargo-3"
          },
          {
            "id": "pago-4",
            "fecha": "2025-04-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "32.25",
            "soportePago": "cargo-4"
          },
          {
            "id": "pago-5",
            "fecha": "2025-05-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "29.09",
            "soportePago": "cargo-5"
          },
          {
            "id": "pago-6",
            "fecha": "2025-06-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "25.91",
            "soportePago": "cargo-6"
          },
          {
            "id": "pago-7",
            "fecha": "2025-07-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "22.72",
            "soportePago": "cargo-7"
          },
          {
            "id": "pago-8",
            "fecha": "2025-08-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "19.51",
            "soportePago": "cargo-8"
          },
          {
            "id": "pago-9",
            "fecha": "2025-09-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "16.29",
            "soportePago": "cargo-9"
          },
          {
            "id": "pago-10",
            "fecha": "2025-10-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "13.06",
            "soportePago": "cargo-10"
          },
          {
            "id": "pago-11",
            "fecha": "2025-11-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "9.82",
            "soportePago": "cargo-11"
          },
          {
            "id": "pago-12",
            "fecha": "2025-12-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "6.56",
            "soportePago": "cargo-12"
          }
        ]
      }
    },
    "esperado": {
      "numeradorEuros": "8671",
      "divisor": "400"
    },
    "real": [
      4167,
      3854,
      3540,
      3225,
      2909,
      2591,
      2272,
      1951,
      1629,
      1306,
      982,
      656
    ],
    "contra": [
      2932,
      2710,
      2488,
      2265,
      2041,
      1817,
      1592,
      1367,
      1141,
      914,
      686,
      458
    ]
  },
  {
    "nombre": "plazo600",
    "solicitud": {
      "lote": "F-ampliado",
      "codigo": "madrid_incremento_costes_financiacion_vivienda",
      "hechos": {
        "miembrosUnidad": [
          "s-1"
        ],
        "viviendas": [
          {
            "id": "v",
            "territorio": "madrid",
            "adquisicion": "2020-01-15",
            "precioEUR": "390000",
            "ocupacionDesde": "2020-02-01",
            "permanenciaHasta": "2025-12-31",
            "porcentajePropiedad": "100",
            "titulares": [
              "s-1"
            ]
          }
        ],
        "prestamos": [
          {
            "id": "p",
            "tipo": "hipoteca_variable",
            "fecha": "2020-01-15",
            "viviendaId": "v",
            "destinoContrato": "adquisicion",
            "soporteDestino": "escritura",
            "entidadCredito": "banco",
            "contratoMadrid": {
              "indice": "euribor_12_meses",
              "documento": "escritura",
              "saldoInicio2025EUR": "10000.00",
              "certificadoSaldo": "saldo-2024-12-31",
              "mesesPendientesInicio2025": 600,
              "diaRecibo": 15,
              "revision": "enero_anual",
              "sistema": "frances",
              "computo": "tin_dividido_12",
              "redondeo": "centimo_comercial_cuota_e_interes",
              "prestatarios": [
                "s-1"
              ],
              "destino": "adquisicion_integra_vivienda",
              "situacionAplicacion": "sigue_habitual",
              "referenciaHabitualAplicacion": "padron-aplicacion",
              "incidencias2025": [],
              "diferencialPorcentaje": "0.5",
              "desfaseIndiceMeses": 1,
              "revisiones": [
                {
                  "mes": 1,
                  "mesIndice": "2024-12",
                  "euriborPorcentaje": "4.5",
                  "documento": "revision-audit-1"
                }
              ],
              "recibos": [
                {
                  "mes": 1,
                  "cuotaSatisfechaEUR": "45.41",
                  "soporte": "cargo-audit-1"
                },
                {
                  "mes": 2,
                  "cuotaSatisfechaEUR": "45.41",
                  "soporte": "cargo-audit-2"
                },
                {
                  "mes": 3,
                  "cuotaSatisfechaEUR": "45.41",
                  "soporte": "cargo-audit-3"
                },
                {
                  "mes": 4,
                  "cuotaSatisfechaEUR": "45.41",
                  "soporte": "cargo-audit-4"
                },
                {
                  "mes": 5,
                  "cuotaSatisfechaEUR": "45.41",
                  "soporte": "cargo-audit-5"
                },
                {
                  "mes": 6,
                  "cuotaSatisfechaEUR": "45.41",
                  "soporte": "cargo-audit-6"
                },
                {
                  "mes": 7,
                  "cuotaSatisfechaEUR": "45.41",
                  "soporte": "cargo-audit-7"
                },
                {
                  "mes": 8,
                  "cuotaSatisfechaEUR": "45.41",
                  "soporte": "cargo-audit-8"
                },
                {
                  "mes": 9,
                  "cuotaSatisfechaEUR": "45.41",
                  "soporte": "cargo-audit-9"
                },
                {
                  "mes": 10,
                  "cuotaSatisfechaEUR": "45.41",
                  "soporte": "cargo-audit-10"
                },
                {
                  "mes": 11,
                  "cuotaSatisfechaEUR": "45.41",
                  "soporte": "cargo-audit-11"
                },
                {
                  "mes": 12,
                  "cuotaSatisfechaEUR": "45.41",
                  "soporte": "cargo-audit-12"
                }
              ]
            }
          }
        ],
        "pagos": [
          {
            "id": "pago-1",
            "fecha": "2025-01-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.67",
            "soportePago": "cargo-1"
          },
          {
            "id": "pago-2",
            "fecha": "2025-02-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.65",
            "soportePago": "cargo-2"
          },
          {
            "id": "pago-3",
            "fecha": "2025-03-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.64",
            "soportePago": "cargo-3"
          },
          {
            "id": "pago-4",
            "fecha": "2025-04-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.62",
            "soportePago": "cargo-4"
          },
          {
            "id": "pago-5",
            "fecha": "2025-05-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.60",
            "soportePago": "cargo-5"
          },
          {
            "id": "pago-6",
            "fecha": "2025-06-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.59",
            "soportePago": "cargo-6"
          },
          {
            "id": "pago-7",
            "fecha": "2025-07-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.57",
            "soportePago": "cargo-7"
          },
          {
            "id": "pago-8",
            "fecha": "2025-08-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.56",
            "soportePago": "cargo-8"
          },
          {
            "id": "pago-9",
            "fecha": "2025-09-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.54",
            "soportePago": "cargo-9"
          },
          {
            "id": "pago-10",
            "fecha": "2025-10-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.52",
            "soportePago": "cargo-10"
          },
          {
            "id": "pago-11",
            "fecha": "2025-11-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.51",
            "soportePago": "cargo-11"
          },
          {
            "id": "pago-12",
            "fecha": "2025-12-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.49",
            "soportePago": "cargo-12"
          }
        ]
      }
    },
    "esperado": {
      "numeradorEuros": "2967",
      "divisor": "80"
    },
    "real": [
      4167,
      4165,
      4164,
      4162,
      4160,
      4159,
      4157,
      4156,
      4154,
      4152,
      4151,
      4149
    ],
    "contra": [
      2932,
      2930,
      2928,
      2926,
      2924,
      2923,
      2921,
      2919,
      2917,
      2915,
      2914,
      2912
    ]
  },
  {
    "nombre": "indice_negativo_TIN0",
    "solicitud": {
      "lote": "F-ampliado",
      "codigo": "madrid_incremento_costes_financiacion_vivienda",
      "hechos": {
        "miembrosUnidad": [
          "s-1"
        ],
        "viviendas": [
          {
            "id": "v",
            "territorio": "madrid",
            "adquisicion": "2020-01-15",
            "precioEUR": "390000",
            "ocupacionDesde": "2020-02-01",
            "permanenciaHasta": "2025-12-31",
            "porcentajePropiedad": "100",
            "titulares": [
              "s-1"
            ]
          }
        ],
        "prestamos": [
          {
            "id": "p",
            "tipo": "hipoteca_variable",
            "fecha": "2020-01-15",
            "viviendaId": "v",
            "destinoContrato": "adquisicion",
            "soporteDestino": "escritura",
            "entidadCredito": "banco",
            "contratoMadrid": {
              "indice": "euribor_12_meses",
              "documento": "escritura",
              "saldoInicio2025EUR": "10000.00",
              "certificadoSaldo": "saldo-2024-12-31",
              "mesesPendientesInicio2025": 120,
              "diaRecibo": 15,
              "revision": "enero_anual",
              "sistema": "frances",
              "computo": "tin_dividido_12",
              "redondeo": "centimo_comercial_cuota_e_interes",
              "prestatarios": [
                "s-1"
              ],
              "destino": "adquisicion_integra_vivienda",
              "situacionAplicacion": "sigue_habitual",
              "referenciaHabitualAplicacion": "padron-aplicacion",
              "incidencias2025": [],
              "diferencialPorcentaje": "0.5",
              "desfaseIndiceMeses": 1,
              "revisiones": [
                {
                  "mes": 1,
                  "mesIndice": "2024-12",
                  "euriborPorcentaje": "-0.5",
                  "documento": "revision-audit-1"
                }
              ],
              "recibos": [
                {
                  "mes": 1,
                  "cuotaSatisfechaEUR": "83.33",
                  "soporte": "cargo-audit-1"
                },
                {
                  "mes": 2,
                  "cuotaSatisfechaEUR": "83.33",
                  "soporte": "cargo-audit-2"
                },
                {
                  "mes": 3,
                  "cuotaSatisfechaEUR": "83.33",
                  "soporte": "cargo-audit-3"
                },
                {
                  "mes": 4,
                  "cuotaSatisfechaEUR": "83.33",
                  "soporte": "cargo-audit-4"
                },
                {
                  "mes": 5,
                  "cuotaSatisfechaEUR": "83.33",
                  "soporte": "cargo-audit-5"
                },
                {
                  "mes": 6,
                  "cuotaSatisfechaEUR": "83.33",
                  "soporte": "cargo-audit-6"
                },
                {
                  "mes": 7,
                  "cuotaSatisfechaEUR": "83.33",
                  "soporte": "cargo-audit-7"
                },
                {
                  "mes": 8,
                  "cuotaSatisfechaEUR": "83.33",
                  "soporte": "cargo-audit-8"
                },
                {
                  "mes": 9,
                  "cuotaSatisfechaEUR": "83.33",
                  "soporte": "cargo-audit-9"
                },
                {
                  "mes": 10,
                  "cuotaSatisfechaEUR": "83.33",
                  "soporte": "cargo-audit-10"
                },
                {
                  "mes": 11,
                  "cuotaSatisfechaEUR": "83.33",
                  "soporte": "cargo-audit-11"
                },
                {
                  "mes": 12,
                  "cuotaSatisfechaEUR": "83.33",
                  "soporte": "cargo-audit-12"
                }
              ]
            }
          }
        ],
        "pagos": [
          {
            "id": "pago-1",
            "fecha": "2025-01-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "0.00",
            "soportePago": "cargo-1"
          },
          {
            "id": "pago-2",
            "fecha": "2025-02-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "0.00",
            "soportePago": "cargo-2"
          },
          {
            "id": "pago-3",
            "fecha": "2025-03-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "0.00",
            "soportePago": "cargo-3"
          },
          {
            "id": "pago-4",
            "fecha": "2025-04-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "0.00",
            "soportePago": "cargo-4"
          },
          {
            "id": "pago-5",
            "fecha": "2025-05-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "0.00",
            "soportePago": "cargo-5"
          },
          {
            "id": "pago-6",
            "fecha": "2025-06-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "0.00",
            "soportePago": "cargo-6"
          },
          {
            "id": "pago-7",
            "fecha": "2025-07-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "0.00",
            "soportePago": "cargo-7"
          },
          {
            "id": "pago-8",
            "fecha": "2025-08-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "0.00",
            "soportePago": "cargo-8"
          },
          {
            "id": "pago-9",
            "fecha": "2025-09-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "0.00",
            "soportePago": "cargo-9"
          },
          {
            "id": "pago-10",
            "fecha": "2025-10-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "0.00",
            "soportePago": "cargo-10"
          },
          {
            "id": "pago-11",
            "fecha": "2025-11-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "0.00",
            "soportePago": "cargo-11"
          },
          {
            "id": "pago-12",
            "fecha": "2025-12-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "0.00",
            "soportePago": "cargo-12"
          }
        ]
      }
    },
    "esperado": {
      "numeradorEuros": "0",
      "divisor": "1"
    },
    "real": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "contra": [
      2932,
      2911,
      2891,
      2870,
      2850,
      2829,
      2808,
      2787,
      2767,
      2746,
      2725,
      2704
    ]
  },
  {
    "nombre": "precision6",
    "solicitud": {
      "lote": "F-ampliado",
      "codigo": "madrid_incremento_costes_financiacion_vivienda",
      "hechos": {
        "miembrosUnidad": [
          "s-1"
        ],
        "viviendas": [
          {
            "id": "v",
            "territorio": "madrid",
            "adquisicion": "2020-01-15",
            "precioEUR": "390000",
            "ocupacionDesde": "2020-02-01",
            "permanenciaHasta": "2025-12-31",
            "porcentajePropiedad": "100",
            "titulares": [
              "s-1"
            ]
          }
        ],
        "prestamos": [
          {
            "id": "p",
            "tipo": "hipoteca_variable",
            "fecha": "2020-01-15",
            "viviendaId": "v",
            "destinoContrato": "adquisicion",
            "soporteDestino": "escritura",
            "entidadCredito": "banco",
            "contratoMadrid": {
              "indice": "euribor_12_meses",
              "documento": "escritura",
              "saldoInicio2025EUR": "10000.00",
              "certificadoSaldo": "saldo-2024-12-31",
              "mesesPendientesInicio2025": 120,
              "diaRecibo": 15,
              "revision": "enero_anual",
              "sistema": "frances",
              "computo": "tin_dividido_12",
              "redondeo": "centimo_comercial_cuota_e_interes",
              "prestatarios": [
                "s-1"
              ],
              "destino": "adquisicion_integra_vivienda",
              "situacionAplicacion": "sigue_habitual",
              "referenciaHabitualAplicacion": "padron-aplicacion",
              "incidencias2025": [],
              "diferencialPorcentaje": "0.5",
              "desfaseIndiceMeses": 1,
              "revisiones": [
                {
                  "mes": 1,
                  "mesIndice": "2024-12",
                  "euriborPorcentaje": "3.141592",
                  "documento": "revision-audit-1"
                }
              ],
              "recibos": [
                {
                  "mes": 1,
                  "cuotaSatisfechaEUR": "99.55",
                  "soporte": "cargo-audit-1"
                },
                {
                  "mes": 2,
                  "cuotaSatisfechaEUR": "99.55",
                  "soporte": "cargo-audit-2"
                },
                {
                  "mes": 3,
                  "cuotaSatisfechaEUR": "99.55",
                  "soporte": "cargo-audit-3"
                },
                {
                  "mes": 4,
                  "cuotaSatisfechaEUR": "99.55",
                  "soporte": "cargo-audit-4"
                },
                {
                  "mes": 5,
                  "cuotaSatisfechaEUR": "99.55",
                  "soporte": "cargo-audit-5"
                },
                {
                  "mes": 6,
                  "cuotaSatisfechaEUR": "99.55",
                  "soporte": "cargo-audit-6"
                },
                {
                  "mes": 7,
                  "cuotaSatisfechaEUR": "99.55",
                  "soporte": "cargo-audit-7"
                },
                {
                  "mes": 8,
                  "cuotaSatisfechaEUR": "99.55",
                  "soporte": "cargo-audit-8"
                },
                {
                  "mes": 9,
                  "cuotaSatisfechaEUR": "99.55",
                  "soporte": "cargo-audit-9"
                },
                {
                  "mes": 10,
                  "cuotaSatisfechaEUR": "99.55",
                  "soporte": "cargo-audit-10"
                },
                {
                  "mes": 11,
                  "cuotaSatisfechaEUR": "99.55",
                  "soporte": "cargo-audit-11"
                },
                {
                  "mes": 12,
                  "cuotaSatisfechaEUR": "99.55",
                  "soporte": "cargo-audit-12"
                }
              ]
            }
          }
        ],
        "pagos": [
          {
            "id": "pago-1",
            "fecha": "2025-01-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "30.35",
            "soportePago": "cargo-1"
          },
          {
            "id": "pago-2",
            "fecha": "2025-02-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "30.14",
            "soportePago": "cargo-2"
          },
          {
            "id": "pago-3",
            "fecha": "2025-03-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "29.93",
            "soportePago": "cargo-3"
          },
          {
            "id": "pago-4",
            "fecha": "2025-04-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "29.71",
            "soportePago": "cargo-4"
          },
          {
            "id": "pago-5",
            "fecha": "2025-05-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "29.50",
            "soportePago": "cargo-5"
          },
          {
            "id": "pago-6",
            "fecha": "2025-06-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "29.29",
            "soportePago": "cargo-6"
          },
          {
            "id": "pago-7",
            "fecha": "2025-07-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "29.08",
            "soportePago": "cargo-7"
          },
          {
            "id": "pago-8",
            "fecha": "2025-08-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "28.86",
            "soportePago": "cargo-8"
          },
          {
            "id": "pago-9",
            "fecha": "2025-09-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "28.65",
            "soportePago": "cargo-9"
          },
          {
            "id": "pago-10",
            "fecha": "2025-10-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "28.43",
            "soportePago": "cargo-10"
          },
          {
            "id": "pago-11",
            "fecha": "2025-11-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "28.22",
            "soportePago": "cargo-11"
          },
          {
            "id": "pago-12",
            "fecha": "2025-12-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "28.00",
            "soportePago": "cargo-12"
          }
        ]
      }
    },
    "esperado": {
      "numeradorEuros": "299",
      "divisor": "100"
    },
    "real": [
      3035,
      3014,
      2993,
      2971,
      2950,
      2929,
      2908,
      2886,
      2865,
      2843,
      2822,
      2800
    ],
    "contra": [
      2932,
      2911,
      2891,
      2870,
      2850,
      2829,
      2808,
      2787,
      2767,
      2746,
      2725,
      2704
    ]
  },
  {
    "nombre": "orden_inverso",
    "solicitud": {
      "lote": "F-ampliado",
      "codigo": "madrid_incremento_costes_financiacion_vivienda",
      "hechos": {
        "miembrosUnidad": [
          "s-1"
        ],
        "viviendas": [
          {
            "id": "v",
            "territorio": "madrid",
            "adquisicion": "2020-01-15",
            "precioEUR": "390000",
            "ocupacionDesde": "2020-02-01",
            "permanenciaHasta": "2025-12-31",
            "porcentajePropiedad": "100",
            "titulares": [
              "s-1"
            ]
          }
        ],
        "prestamos": [
          {
            "id": "p",
            "tipo": "hipoteca_variable",
            "fecha": "2020-01-15",
            "viviendaId": "v",
            "destinoContrato": "adquisicion",
            "soporteDestino": "escritura",
            "entidadCredito": "banco",
            "contratoMadrid": {
              "indice": "euribor_12_meses",
              "documento": "escritura",
              "saldoInicio2025EUR": "10000.00",
              "certificadoSaldo": "saldo-2024-12-31",
              "mesesPendientesInicio2025": 120,
              "diaRecibo": 15,
              "revision": "enero_julio",
              "sistema": "frances",
              "computo": "tin_dividido_12",
              "redondeo": "centimo_comercial_cuota_e_interes",
              "prestatarios": [
                "s-1"
              ],
              "destino": "adquisicion_integra_vivienda",
              "situacionAplicacion": "sigue_habitual",
              "referenciaHabitualAplicacion": "padron-aplicacion",
              "incidencias2025": [],
              "diferencialPorcentaje": "0.5",
              "desfaseIndiceMeses": 1,
              "revisiones": [
                {
                  "mes": 1,
                  "mesIndice": "2024-12",
                  "euriborPorcentaje": "1.5",
                  "documento": "revision-audit-1"
                },
                {
                  "mes": 7,
                  "mesIndice": "2025-06",
                  "euriborPorcentaje": "4.5",
                  "documento": "revision-audit-7"
                }
              ],
              "recibos": [
                {
                  "mes": 1,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-audit-1"
                },
                {
                  "mes": 2,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-audit-2"
                },
                {
                  "mes": 3,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-audit-3"
                },
                {
                  "mes": 4,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-audit-4"
                },
                {
                  "mes": 5,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-audit-5"
                },
                {
                  "mes": 6,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-audit-6"
                },
                {
                  "mes": 7,
                  "cuotaSatisfechaEUR": "105.36",
                  "soporte": "cargo-audit-7"
                },
                {
                  "mes": 8,
                  "cuotaSatisfechaEUR": "105.36",
                  "soporte": "cargo-audit-8"
                },
                {
                  "mes": 9,
                  "cuotaSatisfechaEUR": "105.36",
                  "soporte": "cargo-audit-9"
                },
                {
                  "mes": 10,
                  "cuotaSatisfechaEUR": "105.36",
                  "soporte": "cargo-audit-10"
                },
                {
                  "mes": 11,
                  "cuotaSatisfechaEUR": "105.36",
                  "soporte": "cargo-audit-11"
                },
                {
                  "mes": 12,
                  "cuotaSatisfechaEUR": "105.36",
                  "soporte": "cargo-audit-12"
                }
              ]
            }
          }
        ],
        "pagos": [
          {
            "id": "pago-1",
            "fecha": "2025-01-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "16.67",
            "soportePago": "cargo-1"
          },
          {
            "id": "pago-2",
            "fecha": "2025-02-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "16.54",
            "soportePago": "cargo-2"
          },
          {
            "id": "pago-3",
            "fecha": "2025-03-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "16.42",
            "soportePago": "cargo-3"
          },
          {
            "id": "pago-4",
            "fecha": "2025-04-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "16.29",
            "soportePago": "cargo-4"
          },
          {
            "id": "pago-5",
            "fecha": "2025-05-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "16.16",
            "soportePago": "cargo-5"
          },
          {
            "id": "pago-6",
            "fecha": "2025-06-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "16.04",
            "soportePago": "cargo-6"
          },
          {
            "id": "pago-7",
            "fecha": "2025-07-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "39.78",
            "soportePago": "cargo-7"
          },
          {
            "id": "pago-8",
            "fecha": "2025-08-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "39.50",
            "soportePago": "cargo-8"
          },
          {
            "id": "pago-9",
            "fecha": "2025-09-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "39.23",
            "soportePago": "cargo-9"
          },
          {
            "id": "pago-10",
            "fecha": "2025-10-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "38.95",
            "soportePago": "cargo-10"
          },
          {
            "id": "pago-11",
            "fecha": "2025-11-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "38.68",
            "soportePago": "cargo-11"
          },
          {
            "id": "pago-12",
            "fecha": "2025-12-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "38.40",
            "soportePago": "cargo-12"
          }
        ]
      }
    },
    "esperado": {
      "numeradorEuros": "6917",
      "divisor": "400"
    },
    "real": [
      1667,
      1654,
      1642,
      1629,
      1616,
      1604,
      3978,
      3950,
      3923,
      3895,
      3868,
      3840
    ],
    "contra": [
      2932,
      2911,
      2891,
      2870,
      2850,
      2829,
      2808,
      2787,
      2767,
      2746,
      2725,
      2704
    ]
  },
  {
    "nombre": "diferencial6",
    "solicitud": {
      "lote": "F-ampliado",
      "codigo": "madrid_incremento_costes_financiacion_vivienda",
      "hechos": {
        "miembrosUnidad": [
          "s-1"
        ],
        "viviendas": [
          {
            "id": "v",
            "territorio": "madrid",
            "adquisicion": "2020-01-15",
            "precioEUR": "390000",
            "ocupacionDesde": "2020-02-01",
            "permanenciaHasta": "2025-12-31",
            "porcentajePropiedad": "100",
            "titulares": [
              "s-1"
            ]
          }
        ],
        "prestamos": [
          {
            "id": "p",
            "tipo": "hipoteca_variable",
            "fecha": "2020-01-15",
            "viviendaId": "v",
            "destinoContrato": "adquisicion",
            "soporteDestino": "escritura",
            "entidadCredito": "banco",
            "contratoMadrid": {
              "indice": "euribor_12_meses",
              "documento": "escritura",
              "saldoInicio2025EUR": "10000.00",
              "certificadoSaldo": "saldo-2024-12-31",
              "mesesPendientesInicio2025": 120,
              "diaRecibo": 15,
              "revision": "enero_anual",
              "sistema": "frances",
              "computo": "tin_dividido_12",
              "redondeo": "centimo_comercial_cuota_e_interes",
              "prestatarios": [
                "s-1"
              ],
              "destino": "adquisicion_integra_vivienda",
              "situacionAplicacion": "sigue_habitual",
              "referenciaHabitualAplicacion": "padron-aplicacion",
              "incidencias2025": [],
              "diferencialPorcentaje": "0.123456",
              "desfaseIndiceMeses": 1,
              "revisiones": [
                {
                  "mes": 1,
                  "mesIndice": "2024-12",
                  "euriborPorcentaje": "3.900000",
                  "documento": "revision-audit-1"
                }
              ],
              "recibos": [
                {
                  "mes": 1,
                  "cuotaSatisfechaEUR": "101.36",
                  "soporte": "cargo-audit-1"
                },
                {
                  "mes": 2,
                  "cuotaSatisfechaEUR": "101.36",
                  "soporte": "cargo-audit-2"
                },
                {
                  "mes": 3,
                  "cuotaSatisfechaEUR": "101.36",
                  "soporte": "cargo-audit-3"
                },
                {
                  "mes": 4,
                  "cuotaSatisfechaEUR": "101.36",
                  "soporte": "cargo-audit-4"
                },
                {
                  "mes": 5,
                  "cuotaSatisfechaEUR": "101.36",
                  "soporte": "cargo-audit-5"
                },
                {
                  "mes": 6,
                  "cuotaSatisfechaEUR": "101.36",
                  "soporte": "cargo-audit-6"
                },
                {
                  "mes": 7,
                  "cuotaSatisfechaEUR": "101.36",
                  "soporte": "cargo-audit-7"
                },
                {
                  "mes": 8,
                  "cuotaSatisfechaEUR": "101.36",
                  "soporte": "cargo-audit-8"
                },
                {
                  "mes": 9,
                  "cuotaSatisfechaEUR": "101.36",
                  "soporte": "cargo-audit-9"
                },
                {
                  "mes": 10,
                  "cuotaSatisfechaEUR": "101.36",
                  "soporte": "cargo-audit-10"
                },
                {
                  "mes": 11,
                  "cuotaSatisfechaEUR": "101.36",
                  "soporte": "cargo-audit-11"
                },
                {
                  "mes": 12,
                  "cuotaSatisfechaEUR": "101.36",
                  "soporte": "cargo-audit-12"
                }
              ]
            }
          }
        ],
        "pagos": [
          {
            "id": "pago-1",
            "fecha": "2025-01-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "33.53",
            "soportePago": "cargo-1"
          },
          {
            "id": "pago-2",
            "fecha": "2025-02-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "33.30",
            "soportePago": "cargo-2"
          },
          {
            "id": "pago-3",
            "fecha": "2025-03-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "33.07",
            "soportePago": "cargo-3"
          },
          {
            "id": "pago-4",
            "fecha": "2025-04-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "32.84",
            "soportePago": "cargo-4"
          },
          {
            "id": "pago-5",
            "fecha": "2025-05-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "32.61",
            "soportePago": "cargo-5"
          },
          {
            "id": "pago-6",
            "fecha": "2025-06-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "32.38",
            "soportePago": "cargo-6"
          },
          {
            "id": "pago-7",
            "fecha": "2025-07-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "32.15",
            "soportePago": "cargo-7"
          },
          {
            "id": "pago-8",
            "fecha": "2025-08-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "31.92",
            "soportePago": "cargo-8"
          },
          {
            "id": "pago-9",
            "fecha": "2025-09-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "31.69",
            "soportePago": "cargo-9"
          },
          {
            "id": "pago-10",
            "fecha": "2025-10-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "31.45",
            "soportePago": "cargo-10"
          },
          {
            "id": "pago-11",
            "fecha": "2025-11-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "31.22",
            "soportePago": "cargo-11"
          },
          {
            "id": "pago-12",
            "fecha": "2025-12-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "30.98",
            "soportePago": "cargo-12"
          }
        ]
      }
    },
    "esperado": {
      "numeradorEuros": "1067",
      "divisor": "50"
    },
    "real": [
      3353,
      3330,
      3307,
      3284,
      3261,
      3238,
      3215,
      3192,
      3169,
      3145,
      3122,
      3098
    ],
    "contra": [
      2618,
      2599,
      2581,
      2562,
      2543,
      2524,
      2506,
      2487,
      2468,
      2449,
      2430,
      2411
    ]
  },
  {
    "nombre": "desfase2",
    "solicitud": {
      "lote": "F-ampliado",
      "codigo": "madrid_incremento_costes_financiacion_vivienda",
      "hechos": {
        "miembrosUnidad": [
          "s-1"
        ],
        "viviendas": [
          {
            "id": "v",
            "territorio": "madrid",
            "adquisicion": "2020-01-15",
            "precioEUR": "390000",
            "ocupacionDesde": "2020-02-01",
            "permanenciaHasta": "2025-12-31",
            "porcentajePropiedad": "100",
            "titulares": [
              "s-1"
            ]
          }
        ],
        "prestamos": [
          {
            "id": "p",
            "tipo": "hipoteca_variable",
            "fecha": "2020-01-15",
            "viviendaId": "v",
            "destinoContrato": "adquisicion",
            "soporteDestino": "escritura",
            "entidadCredito": "banco",
            "contratoMadrid": {
              "indice": "euribor_12_meses",
              "documento": "escritura",
              "saldoInicio2025EUR": "10000.00",
              "certificadoSaldo": "saldo-2024-12-31",
              "mesesPendientesInicio2025": 120,
              "diaRecibo": 15,
              "revision": "enero_julio",
              "sistema": "frances",
              "computo": "tin_dividido_12",
              "redondeo": "centimo_comercial_cuota_e_interes",
              "prestatarios": [
                "s-1"
              ],
              "destino": "adquisicion_integra_vivienda",
              "situacionAplicacion": "sigue_habitual",
              "referenciaHabitualAplicacion": "padron-aplicacion",
              "incidencias2025": [],
              "diferencialPorcentaje": "0.5",
              "desfaseIndiceMeses": 2,
              "revisiones": [
                {
                  "mes": 1,
                  "mesIndice": "2024-11",
                  "euriborPorcentaje": "4.5",
                  "documento": "revision-audit-1"
                },
                {
                  "mes": 7,
                  "mesIndice": "2025-05",
                  "euriborPorcentaje": "1.5",
                  "documento": "revision-audit-7"
                }
              ],
              "recibos": [
                {
                  "mes": 1,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-audit-1"
                },
                {
                  "mes": 2,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-audit-2"
                },
                {
                  "mes": 3,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-audit-3"
                },
                {
                  "mes": 4,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-audit-4"
                },
                {
                  "mes": 5,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-audit-5"
                },
                {
                  "mes": 6,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-audit-6"
                },
                {
                  "mes": 7,
                  "cuotaSatisfechaEUR": "92.63",
                  "soporte": "cargo-audit-7"
                },
                {
                  "mes": 8,
                  "cuotaSatisfechaEUR": "92.63",
                  "soporte": "cargo-audit-8"
                },
                {
                  "mes": 9,
                  "cuotaSatisfechaEUR": "92.63",
                  "soporte": "cargo-audit-9"
                },
                {
                  "mes": 10,
                  "cuotaSatisfechaEUR": "92.63",
                  "soporte": "cargo-audit-10"
                },
                {
                  "mes": 11,
                  "cuotaSatisfechaEUR": "92.63",
                  "soporte": "cargo-audit-11"
                },
                {
                  "mes": 12,
                  "cuotaSatisfechaEUR": "92.63",
                  "soporte": "cargo-audit-12"
                }
              ]
            }
          }
        ],
        "pagos": [
          {
            "id": "pago-1",
            "fecha": "2025-01-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.67",
            "soportePago": "cargo-1"
          },
          {
            "id": "pago-2",
            "fecha": "2025-02-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.40",
            "soportePago": "cargo-2"
          },
          {
            "id": "pago-3",
            "fecha": "2025-03-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "41.13",
            "soportePago": "cargo-3"
          },
          {
            "id": "pago-4",
            "fecha": "2025-04-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "40.86",
            "soportePago": "cargo-4"
          },
          {
            "id": "pago-5",
            "fecha": "2025-05-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "40.59",
            "soportePago": "cargo-5"
          },
          {
            "id": "pago-6",
            "fecha": "2025-06-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "40.31",
            "soportePago": "cargo-6"
          },
          {
            "id": "pago-7",
            "fecha": "2025-07-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "16.02",
            "soportePago": "cargo-7"
          },
          {
            "id": "pago-8",
            "fecha": "2025-08-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "15.89",
            "soportePago": "cargo-8"
          },
          {
            "id": "pago-9",
            "fecha": "2025-09-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "15.76",
            "soportePago": "cargo-9"
          },
          {
            "id": "pago-10",
            "fecha": "2025-10-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "15.63",
            "soportePago": "cargo-10"
          },
          {
            "id": "pago-11",
            "fecha": "2025-11-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "15.50",
            "soportePago": "cargo-11"
          },
          {
            "id": "pago-12",
            "fecha": "2025-12-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "15.38",
            "soportePago": "cargo-12"
          }
        ]
      }
    },
    "esperado": {
      "numeradorEuros": "7313",
      "divisor": "400"
    },
    "real": [
      4167,
      4140,
      4113,
      4086,
      4059,
      4031,
      1602,
      1589,
      1576,
      1563,
      1550,
      1538
    ],
    "contra": [
      2932,
      2911,
      2891,
      2870,
      2850,
      2829,
      2808,
      2787,
      2767,
      2746,
      2725,
      2704
    ]
  }
]
