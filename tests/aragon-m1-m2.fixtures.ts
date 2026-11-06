// Entradas sintéticas originales de la primera revisión AR, conservadas sin normalizar.
export const casosAragonM1M2 = [
  {
    "id": "gasto-devengo-2024",
    "input": {
      "perfil": "aragon-social-mixto-2025",
      "ejercicio": 2025,
      "comunidadAutonoma": "aragon",
      "modalidad": "individual",
      "devengo": "2025-12-31",
      "residenciaTodoElAnio": true,
      "contribuyenteId": "90000000B",
      "liquidacionId": "REV-INDEPENDIENTE",
      "edad": 40,
      "familiares": "ninguno",
      "discapacidad": "ninguna",
      "otrasRentas": "ninguna",
      "reduccionesBase": "ninguna",
      "compensaciones": "ninguna",
      "otrasDeducciones": "ninguna",
      "censoInmobiliario": {
        "documento": "REV-CENSO",
        "cobertura": "mundial-propiedad-usufructo-cualquier-porcentaje-todo-2025",
        "inmuebles": [
          "REV-V"
        ]
      },
      "conciliacion": {
        "contribuyenteId": "90000000B",
        "ejercicio": 2025,
        "estado": "totales-anuales-sin-duplicados",
        "procedencia": [
          "REV-CERT"
        ]
      },
      "retenciones": [],
      "trabajo": {
        "ejercicio": 2025,
        "territorio": "comun",
        "reduccionesArt18": "ninguna",
        "movilidad": "ninguna",
        "discapacidadActiva": "ninguna",
        "rendimientos": [
          {
            "id": "REV-T",
            "clase": "empleo-laboral",
            "integro": "40000",
            "cotizaciones": {
              "clase": "efectivas",
              "seguridadSocial": "2000",
              "derechosPasivos": "0",
              "colegiosHuerfanos": "0"
            },
            "sindicato": {
              "importe": "0",
              "satisfecho": "no"
            },
            "colegio": {
              "importe": "0",
              "satisfecho": "no",
              "obligatorio": "no",
              "finesEsenciales": "no"
            },
            "defensa": {
              "importe": "0",
              "satisfecho": "no",
              "litigioDirectoPagador": "no"
            }
          }
        ]
      },
      "inmuebles": [
        {
          "id": "REV-V",
          "catastro": "9999999ZZ9999Z0001OI",
          "ubicacion": "aragon",
          "titular": "90000000B",
          "titulo": "REV-TITULO",
          "derecho": "propiedad",
          "regimenMatrimonial": "no-casado",
          "titulares": [
            "90000000B"
          ],
          "adquisicion": {
            "fecha": "2020-01-01",
            "escritura": "REV-ESC",
            "precio": "50000",
            "gastosTributos": "0",
            "sueloPrecio": "10000",
            "sueloGastosTributos": "0"
          },
          "catastro2025": {
            "documento": "REV-IBI",
            "suelo": "8000",
            "construccion": "32000"
          },
          "usosDesdeAdquisicion": [
            {
              "desde": "2020-01-01",
              "hasta": "2024-12-31",
              "uso": "a-disposicion"
            },
            {
              "desde": "2025-01-01",
              "hasta": "2025-12-31",
              "uso": "alquiler-vivienda"
            }
          ],
          "contrato": {
            "id": "REV-CON",
            "documento": "REV-CONTRATO",
            "firma": "2024-12-15",
            "desde": "2025-01-01",
            "hasta": "2025-12-31",
            "arrendador": "90000000B",
            "arrendatario": "90000001N",
            "destino": "vivienda-permanente-persona-fisica",
            "parentesco": "ninguno",
            "fianzaDepositada": "REV-FIANZA",
            "zonaTensionada": false,
            "alquilerSocial": false,
            "rehabilitacionesTresAnios": "ninguna",
            "repercusionObras": "0"
          },
          "exigibilidades": [
            {
              "id": "REV-R",
              "documento": "REV-RENTA",
              "fecha": "2025-12-31",
              "importe": "4800"
            }
          ],
          "gastos": [
            {
              "id": "REV-G",
              "factura": "REV-F",
              "lineaFactura": "1",
              "totalFactura": "100",
              "fechaOperacion": "2025-02-01",
              "fechaFactura": "2025-02-01",
              "fechaPago": "2025-02-01",
              "importe": "100",
              "prestadorNif": "REV-PRESTADOR",
              "clase": "seguro",
              "periodoDevengo": {
                "desde": "2024-01-01",
                "hasta": "2024-12-31"
              }
            }
          ],
          "censo": "contratos-ingresos-gastos-usos-y-titulares-completos",
          "serviciosHospedaje": "ninguno",
          "personalJornadaCompleta": "ninguno",
          "ayudas": "ninguna",
          "saldosPrevios": "ninguno",
          "insolvencia": "ninguna",
          "mobiliario": "ninguno",
          "mejorasAnteriores2025": "ninguna",
          "ingresosIrregulares": "ninguno"
        }
      ],
      "deduccionesTerritoriales2025": {
        "solicitudes": [
          {
            "lote": "A-aragon-dos",
            "codigo": "aragon_arrendamiento_vivienda_social_arrendador",
            "hechos": {
              "viviendasPlan": [
                {
                  "inmueble": "REV-V",
                  "titular": "90000000B",
                  "titulo": "REV-TITULO",
                  "gestor": {
                    "entidad": "REV-GESTOR-SEPARADO",
                    "clase": "entidad-gestora-Plan",
                    "habilitacion": "REV-HABIL",
                    "mandatoPorCuentaPropietario": "REV-MANDATO"
                  },
                  "acta": "REV-ACTA",
                  "desde": "2025-01-01",
                  "hasta": "2025-12-31"
                }
              ]
            }
          }
        ]
      }
    }
  },
  {
    "id": "gestor-propietario",
    "input": {
      "perfil": "aragon-social-mixto-2025",
      "ejercicio": 2025,
      "comunidadAutonoma": "aragon",
      "modalidad": "individual",
      "devengo": "2025-12-31",
      "residenciaTodoElAnio": true,
      "contribuyenteId": "90000000B",
      "liquidacionId": "REV-INDEPENDIENTE",
      "edad": 40,
      "familiares": "ninguno",
      "discapacidad": "ninguna",
      "otrasRentas": "ninguna",
      "reduccionesBase": "ninguna",
      "compensaciones": "ninguna",
      "otrasDeducciones": "ninguna",
      "censoInmobiliario": {
        "documento": "REV-CENSO",
        "cobertura": "mundial-propiedad-usufructo-cualquier-porcentaje-todo-2025",
        "inmuebles": [
          "REV-V"
        ]
      },
      "conciliacion": {
        "contribuyenteId": "90000000B",
        "ejercicio": 2025,
        "estado": "totales-anuales-sin-duplicados",
        "procedencia": [
          "REV-CERT"
        ]
      },
      "retenciones": [],
      "trabajo": {
        "ejercicio": 2025,
        "territorio": "comun",
        "reduccionesArt18": "ninguna",
        "movilidad": "ninguna",
        "discapacidadActiva": "ninguna",
        "rendimientos": [
          {
            "id": "REV-T",
            "clase": "empleo-laboral",
            "integro": "40000",
            "cotizaciones": {
              "clase": "efectivas",
              "seguridadSocial": "2000",
              "derechosPasivos": "0",
              "colegiosHuerfanos": "0"
            },
            "sindicato": {
              "importe": "0",
              "satisfecho": "no"
            },
            "colegio": {
              "importe": "0",
              "satisfecho": "no",
              "obligatorio": "no",
              "finesEsenciales": "no"
            },
            "defensa": {
              "importe": "0",
              "satisfecho": "no",
              "litigioDirectoPagador": "no"
            }
          }
        ]
      },
      "inmuebles": [
        {
          "id": "REV-V",
          "catastro": "9999999ZZ9999Z0001OI",
          "ubicacion": "aragon",
          "titular": "90000000B",
          "titulo": "REV-TITULO",
          "derecho": "propiedad",
          "regimenMatrimonial": "no-casado",
          "titulares": [
            "90000000B"
          ],
          "adquisicion": {
            "fecha": "2020-01-01",
            "escritura": "REV-ESC",
            "precio": "50000",
            "gastosTributos": "0",
            "sueloPrecio": "10000",
            "sueloGastosTributos": "0"
          },
          "catastro2025": {
            "documento": "REV-IBI",
            "suelo": "8000",
            "construccion": "32000"
          },
          "usosDesdeAdquisicion": [
            {
              "desde": "2020-01-01",
              "hasta": "2024-12-31",
              "uso": "a-disposicion"
            },
            {
              "desde": "2025-01-01",
              "hasta": "2025-12-31",
              "uso": "alquiler-vivienda"
            }
          ],
          "contrato": {
            "id": "REV-CON",
            "documento": "REV-CONTRATO",
            "firma": "2024-12-15",
            "desde": "2025-01-01",
            "hasta": "2025-12-31",
            "arrendador": "90000000B",
            "arrendatario": "90000001N",
            "destino": "vivienda-permanente-persona-fisica",
            "parentesco": "ninguno",
            "fianzaDepositada": "REV-FIANZA",
            "zonaTensionada": false,
            "alquilerSocial": false,
            "rehabilitacionesTresAnios": "ninguna",
            "repercusionObras": "0"
          },
          "exigibilidades": [
            {
              "id": "REV-R",
              "documento": "REV-RENTA",
              "fecha": "2025-12-31",
              "importe": "4800"
            }
          ],
          "gastos": [],
          "censo": "contratos-ingresos-gastos-usos-y-titulares-completos",
          "serviciosHospedaje": "ninguno",
          "personalJornadaCompleta": "ninguno",
          "ayudas": "ninguna",
          "saldosPrevios": "ninguno",
          "insolvencia": "ninguna",
          "mobiliario": "ninguno",
          "mejorasAnteriores2025": "ninguna",
          "ingresosIrregulares": "ninguno"
        }
      ],
      "deduccionesTerritoriales2025": {
        "solicitudes": [
          {
            "lote": "A-aragon-dos",
            "codigo": "aragon_arrendamiento_vivienda_social_arrendador",
            "hechos": {
              "viviendasPlan": [
                {
                  "inmueble": "REV-V",
                  "titular": "90000000B",
                  "titulo": "REV-TITULO",
                  "gestor": {
                    "entidad": "90000000B",
                    "clase": "entidad-gestora-Plan",
                    "habilitacion": "REV-HABIL",
                    "mandatoPorCuentaPropietario": "REV-MANDATO"
                  },
                  "acta": "REV-ACTA",
                  "desde": "2025-01-01",
                  "hasta": "2025-12-31"
                }
              ]
            }
          }
        ]
      }
    }
  },
  {
    "id": "gestor-arrendatario",
    "input": {
      "perfil": "aragon-social-mixto-2025",
      "ejercicio": 2025,
      "comunidadAutonoma": "aragon",
      "modalidad": "individual",
      "devengo": "2025-12-31",
      "residenciaTodoElAnio": true,
      "contribuyenteId": "90000000B",
      "liquidacionId": "REV-INDEPENDIENTE",
      "edad": 40,
      "familiares": "ninguno",
      "discapacidad": "ninguna",
      "otrasRentas": "ninguna",
      "reduccionesBase": "ninguna",
      "compensaciones": "ninguna",
      "otrasDeducciones": "ninguna",
      "censoInmobiliario": {
        "documento": "REV-CENSO",
        "cobertura": "mundial-propiedad-usufructo-cualquier-porcentaje-todo-2025",
        "inmuebles": [
          "REV-V"
        ]
      },
      "conciliacion": {
        "contribuyenteId": "90000000B",
        "ejercicio": 2025,
        "estado": "totales-anuales-sin-duplicados",
        "procedencia": [
          "REV-CERT"
        ]
      },
      "retenciones": [],
      "trabajo": {
        "ejercicio": 2025,
        "territorio": "comun",
        "reduccionesArt18": "ninguna",
        "movilidad": "ninguna",
        "discapacidadActiva": "ninguna",
        "rendimientos": [
          {
            "id": "REV-T",
            "clase": "empleo-laboral",
            "integro": "40000",
            "cotizaciones": {
              "clase": "efectivas",
              "seguridadSocial": "2000",
              "derechosPasivos": "0",
              "colegiosHuerfanos": "0"
            },
            "sindicato": {
              "importe": "0",
              "satisfecho": "no"
            },
            "colegio": {
              "importe": "0",
              "satisfecho": "no",
              "obligatorio": "no",
              "finesEsenciales": "no"
            },
            "defensa": {
              "importe": "0",
              "satisfecho": "no",
              "litigioDirectoPagador": "no"
            }
          }
        ]
      },
      "inmuebles": [
        {
          "id": "REV-V",
          "catastro": "9999999ZZ9999Z0001OI",
          "ubicacion": "aragon",
          "titular": "90000000B",
          "titulo": "REV-TITULO",
          "derecho": "propiedad",
          "regimenMatrimonial": "no-casado",
          "titulares": [
            "90000000B"
          ],
          "adquisicion": {
            "fecha": "2020-01-01",
            "escritura": "REV-ESC",
            "precio": "50000",
            "gastosTributos": "0",
            "sueloPrecio": "10000",
            "sueloGastosTributos": "0"
          },
          "catastro2025": {
            "documento": "REV-IBI",
            "suelo": "8000",
            "construccion": "32000"
          },
          "usosDesdeAdquisicion": [
            {
              "desde": "2020-01-01",
              "hasta": "2024-12-31",
              "uso": "a-disposicion"
            },
            {
              "desde": "2025-01-01",
              "hasta": "2025-12-31",
              "uso": "alquiler-vivienda"
            }
          ],
          "contrato": {
            "id": "REV-CON",
            "documento": "REV-CONTRATO",
            "firma": "2024-12-15",
            "desde": "2025-01-01",
            "hasta": "2025-12-31",
            "arrendador": "90000000B",
            "arrendatario": "90000001N",
            "destino": "vivienda-permanente-persona-fisica",
            "parentesco": "ninguno",
            "fianzaDepositada": "REV-FIANZA",
            "zonaTensionada": false,
            "alquilerSocial": false,
            "rehabilitacionesTresAnios": "ninguna",
            "repercusionObras": "0"
          },
          "exigibilidades": [
            {
              "id": "REV-R",
              "documento": "REV-RENTA",
              "fecha": "2025-12-31",
              "importe": "4800"
            }
          ],
          "gastos": [],
          "censo": "contratos-ingresos-gastos-usos-y-titulares-completos",
          "serviciosHospedaje": "ninguno",
          "personalJornadaCompleta": "ninguno",
          "ayudas": "ninguna",
          "saldosPrevios": "ninguno",
          "insolvencia": "ninguna",
          "mobiliario": "ninguno",
          "mejorasAnteriores2025": "ninguna",
          "ingresosIrregulares": "ninguno"
        }
      ],
      "deduccionesTerritoriales2025": {
        "solicitudes": [
          {
            "lote": "A-aragon-dos",
            "codigo": "aragon_arrendamiento_vivienda_social_arrendador",
            "hechos": {
              "viviendasPlan": [
                {
                  "inmueble": "REV-V",
                  "titular": "90000000B",
                  "titulo": "REV-TITULO",
                  "gestor": {
                    "entidad": "90000001N",
                    "clase": "entidad-gestora-Plan",
                    "habilitacion": "REV-HABIL",
                    "mandatoPorCuentaPropietario": "REV-MANDATO"
                  },
                  "acta": "REV-ACTA",
                  "desde": "2025-01-01",
                  "hasta": "2025-12-31"
                }
              ]
            }
          }
        ]
      }
    }
  }
] as const
