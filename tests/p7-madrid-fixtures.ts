import type { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
export const casos: readonly { nombre: string; solicitud: SolicitudAnualF2025; esperado: { numeradorEuros: string; divisor: string } }[] = [
  {
    "nombre": "positivo",
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
                  "euriborPorcentaje": "4.5",
                  "documento": "revision-1"
                }
              ],
              "recibos": [
                {
                  "mes": 1,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-1"
                },
                {
                  "mes": 2,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-2"
                },
                {
                  "mes": 3,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-3"
                },
                {
                  "mes": 4,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-4"
                },
                {
                  "mes": 5,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-5"
                },
                {
                  "mes": 6,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-6"
                },
                {
                  "mes": 7,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-7"
                },
                {
                  "mes": 8,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-8"
                },
                {
                  "mes": 9,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-9"
                },
                {
                  "mes": 10,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-10"
                },
                {
                  "mes": 11,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-11"
                },
                {
                  "mes": 12,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-12"
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
            "importeEUR": "40.04",
            "soportePago": "cargo-7"
          },
          {
            "id": "pago-8",
            "fecha": "2025-08-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "39.76",
            "soportePago": "cargo-8"
          },
          {
            "id": "pago-9",
            "fecha": "2025-09-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "39.49",
            "soportePago": "cargo-9"
          },
          {
            "id": "pago-10",
            "fecha": "2025-10-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "39.21",
            "soportePago": "cargo-10"
          },
          {
            "id": "pago-11",
            "fecha": "2025-11-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "38.93",
            "soportePago": "cargo-11"
          },
          {
            "id": "pago-12",
            "fecha": "2025-12-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "38.65",
            "soportePago": "cargo-12"
          }
        ]
      }
    },
    "esperado": {
      "numeradorEuros": "899",
      "divisor": "25"
    }
  },
  {
    "nombre": "tope",
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
              "saldoInicio2025EUR": "100000.00",
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
                  "euriborPorcentaje": "4.5",
                  "documento": "revision-1"
                }
              ],
              "recibos": [
                {
                  "mes": 1,
                  "cuotaSatisfechaEUR": "1060.66",
                  "soporte": "cargo-1"
                },
                {
                  "mes": 2,
                  "cuotaSatisfechaEUR": "1060.66",
                  "soporte": "cargo-2"
                },
                {
                  "mes": 3,
                  "cuotaSatisfechaEUR": "1060.66",
                  "soporte": "cargo-3"
                },
                {
                  "mes": 4,
                  "cuotaSatisfechaEUR": "1060.66",
                  "soporte": "cargo-4"
                },
                {
                  "mes": 5,
                  "cuotaSatisfechaEUR": "1060.66",
                  "soporte": "cargo-5"
                },
                {
                  "mes": 6,
                  "cuotaSatisfechaEUR": "1060.66",
                  "soporte": "cargo-6"
                },
                {
                  "mes": 7,
                  "cuotaSatisfechaEUR": "1060.66",
                  "soporte": "cargo-7"
                },
                {
                  "mes": 8,
                  "cuotaSatisfechaEUR": "1060.66",
                  "soporte": "cargo-8"
                },
                {
                  "mes": 9,
                  "cuotaSatisfechaEUR": "1060.66",
                  "soporte": "cargo-9"
                },
                {
                  "mes": 10,
                  "cuotaSatisfechaEUR": "1060.66",
                  "soporte": "cargo-10"
                },
                {
                  "mes": 11,
                  "cuotaSatisfechaEUR": "1060.66",
                  "soporte": "cargo-11"
                },
                {
                  "mes": 12,
                  "cuotaSatisfechaEUR": "1060.66",
                  "soporte": "cargo-12"
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
            "importeEUR": "416.67",
            "soportePago": "cargo-1"
          },
          {
            "id": "pago-2",
            "fecha": "2025-02-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "413.98",
            "soportePago": "cargo-2"
          },
          {
            "id": "pago-3",
            "fecha": "2025-03-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "411.29",
            "soportePago": "cargo-3"
          },
          {
            "id": "pago-4",
            "fecha": "2025-04-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "408.58",
            "soportePago": "cargo-4"
          },
          {
            "id": "pago-5",
            "fecha": "2025-05-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "405.87",
            "soportePago": "cargo-5"
          },
          {
            "id": "pago-6",
            "fecha": "2025-06-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "403.14",
            "soportePago": "cargo-6"
          },
          {
            "id": "pago-7",
            "fecha": "2025-07-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "400.40",
            "soportePago": "cargo-7"
          },
          {
            "id": "pago-8",
            "fecha": "2025-08-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "397.65",
            "soportePago": "cargo-8"
          },
          {
            "id": "pago-9",
            "fecha": "2025-09-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "394.88",
            "soportePago": "cargo-9"
          },
          {
            "id": "pago-10",
            "fecha": "2025-10-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "392.11",
            "soportePago": "cargo-10"
          },
          {
            "id": "pago-11",
            "fecha": "2025-11-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "389.32",
            "soportePago": "cargo-11"
          },
          {
            "id": "pago-12",
            "fecha": "2025-12-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "386.53",
            "soportePago": "cargo-12"
          }
        ]
      }
    },
    "esperado": {
      "numeradorEuros": "300",
      "divisor": "1"
    }
  },
  {
    "nombre": "negativo",
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
                  "euriborPorcentaje": "1.5",
                  "documento": "revision-1"
                }
              ],
              "recibos": [
                {
                  "mes": 1,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-1"
                },
                {
                  "mes": 2,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-2"
                },
                {
                  "mes": 3,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-3"
                },
                {
                  "mes": 4,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-4"
                },
                {
                  "mes": 5,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-5"
                },
                {
                  "mes": 6,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-6"
                },
                {
                  "mes": 7,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-7"
                },
                {
                  "mes": 8,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-8"
                },
                {
                  "mes": 9,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-9"
                },
                {
                  "mes": 10,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-10"
                },
                {
                  "mes": 11,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-11"
                },
                {
                  "mes": 12,
                  "cuotaSatisfechaEUR": "92.01",
                  "soporte": "cargo-12"
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
            "importeEUR": "15.91",
            "soportePago": "cargo-7"
          },
          {
            "id": "pago-8",
            "fecha": "2025-08-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "15.78",
            "soportePago": "cargo-8"
          },
          {
            "id": "pago-9",
            "fecha": "2025-09-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "15.66",
            "soportePago": "cargo-9"
          },
          {
            "id": "pago-10",
            "fecha": "2025-10-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "15.53",
            "soportePago": "cargo-10"
          },
          {
            "id": "pago-11",
            "fecha": "2025-11-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "15.40",
            "soportePago": "cargo-11"
          },
          {
            "id": "pago-12",
            "fecha": "2025-12-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "15.27",
            "soportePago": "cargo-12"
          }
        ]
      }
    },
    "esperado": {
      "numeradorEuros": "0",
      "divisor": "1"
    }
  },
  {
    "nombre": "igual",
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
                  "euriborPorcentaje": "3.018",
                  "documento": "revision-1"
                }
              ],
              "recibos": [
                {
                  "mes": 1,
                  "cuotaSatisfechaEUR": "98.97",
                  "soporte": "cargo-1"
                },
                {
                  "mes": 2,
                  "cuotaSatisfechaEUR": "98.97",
                  "soporte": "cargo-2"
                },
                {
                  "mes": 3,
                  "cuotaSatisfechaEUR": "98.97",
                  "soporte": "cargo-3"
                },
                {
                  "mes": 4,
                  "cuotaSatisfechaEUR": "98.97",
                  "soporte": "cargo-4"
                },
                {
                  "mes": 5,
                  "cuotaSatisfechaEUR": "98.97",
                  "soporte": "cargo-5"
                },
                {
                  "mes": 6,
                  "cuotaSatisfechaEUR": "98.97",
                  "soporte": "cargo-6"
                },
                {
                  "mes": 7,
                  "cuotaSatisfechaEUR": "98.97",
                  "soporte": "cargo-7"
                },
                {
                  "mes": 8,
                  "cuotaSatisfechaEUR": "98.97",
                  "soporte": "cargo-8"
                },
                {
                  "mes": 9,
                  "cuotaSatisfechaEUR": "98.97",
                  "soporte": "cargo-9"
                },
                {
                  "mes": 10,
                  "cuotaSatisfechaEUR": "98.97",
                  "soporte": "cargo-10"
                },
                {
                  "mes": 11,
                  "cuotaSatisfechaEUR": "98.97",
                  "soporte": "cargo-11"
                },
                {
                  "mes": 12,
                  "cuotaSatisfechaEUR": "98.97",
                  "soporte": "cargo-12"
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
            "importeEUR": "29.32",
            "soportePago": "cargo-1"
          },
          {
            "id": "pago-2",
            "fecha": "2025-02-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "29.11",
            "soportePago": "cargo-2"
          },
          {
            "id": "pago-3",
            "fecha": "2025-03-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "28.91",
            "soportePago": "cargo-3"
          },
          {
            "id": "pago-4",
            "fecha": "2025-04-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "28.70",
            "soportePago": "cargo-4"
          },
          {
            "id": "pago-5",
            "fecha": "2025-05-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "28.50",
            "soportePago": "cargo-5"
          },
          {
            "id": "pago-6",
            "fecha": "2025-06-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "28.29",
            "soportePago": "cargo-6"
          },
          {
            "id": "pago-7",
            "fecha": "2025-07-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "28.08",
            "soportePago": "cargo-7"
          },
          {
            "id": "pago-8",
            "fecha": "2025-08-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "27.87",
            "soportePago": "cargo-8"
          },
          {
            "id": "pago-9",
            "fecha": "2025-09-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "27.67",
            "soportePago": "cargo-9"
          },
          {
            "id": "pago-10",
            "fecha": "2025-10-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "27.46",
            "soportePago": "cargo-10"
          },
          {
            "id": "pago-11",
            "fecha": "2025-11-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "27.25",
            "soportePago": "cargo-11"
          },
          {
            "id": "pago-12",
            "fecha": "2025-12-15",
            "concepto": "intereses_hipoteca",
            "objetoId": "p",
            "pagador": "s-1",
            "importeEUR": "27.04",
            "soportePago": "cargo-12"
          }
        ]
      }
    },
    "esperado": {
      "numeradorEuros": "0",
      "divisor": "1"
    }
  },
  {
    "nombre": "cambio_signo",
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
                  "euriborPorcentaje": "4.5",
                  "documento": "revision-1"
                },
                {
                  "mes": 7,
                  "mesIndice": "2025-06",
                  "euriborPorcentaje": "1.5",
                  "documento": "revision-7"
                }
              ],
              "recibos": [
                {
                  "mes": 1,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-1"
                },
                {
                  "mes": 2,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-2"
                },
                {
                  "mes": 3,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-3"
                },
                {
                  "mes": 4,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-4"
                },
                {
                  "mes": 5,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-5"
                },
                {
                  "mes": 6,
                  "cuotaSatisfechaEUR": "106.07",
                  "soporte": "cargo-6"
                },
                {
                  "mes": 7,
                  "cuotaSatisfechaEUR": "92.63",
                  "soporte": "cargo-7"
                },
                {
                  "mes": 8,
                  "cuotaSatisfechaEUR": "92.63",
                  "soporte": "cargo-8"
                },
                {
                  "mes": 9,
                  "cuotaSatisfechaEUR": "92.63",
                  "soporte": "cargo-9"
                },
                {
                  "mes": 10,
                  "cuotaSatisfechaEUR": "92.63",
                  "soporte": "cargo-10"
                },
                {
                  "mes": 11,
                  "cuotaSatisfechaEUR": "92.63",
                  "soporte": "cargo-11"
                },
                {
                  "mes": 12,
                  "cuotaSatisfechaEUR": "92.63",
                  "soporte": "cargo-12"
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
    }
  }
]
