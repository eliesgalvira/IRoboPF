import { describe, expect, it } from "vitest"
import * as clm from "../lib/dominio/irpf/deducciones/castilla-la-mancha-hechos-2025"
import * as cyl from "../lib/dominio/irpf/deducciones/castilla-y-leon-hechos-2025"
import * as ext from "../lib/dominio/irpf/deducciones/extremadura-hechos-2025"

function comprobar(resultado: clm.ResultadoHechos | ext.ResultadoHechos, esperado: string): void {
  expect(resultado.estado).toBe("calculo_parcial")
  if (resultado.estado !== "calculo_parcial") throw new Error(resultado.motivo)
  expect(resultado.importeExacto).toBe(esperado)
  expect(resultado.aceptacionFiscal).toBe("pendiente")
  expect(resultado.magnitudesAnualesPendientes).toEqual([
    "cuota_integra_autonomica_disponible_2025",
  ])
}

describe("Revision independiente monetaria D: oraculos literales de fuentes", () => {
  it("CLM discapacidad umbral inclusivo y suma con signo", () => {
    comprobar(
      clm.discapacidadPropia(
        {
          ejercicio: 2025,
          territorio: "castilla-la-mancha",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "28000",
          baseAhorro: "-1000",
          minimoPersonalFamiliar: "0",
        },
        { persona: "a", nacimiento: "1960-12-31", grado: 65, elecciones: [] }
      ),
      "300"
    )
  })
  it("CLM discapacidad no resta minimo", () => {
    comprobar(
      clm.discapacidadPropia(
        {
          ejercicio: 2025,
          territorio: "castilla-la-mancha",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "27000.01",
          baseAhorro: "0",
          minimoPersonalFamiliar: "10000",
        },
        { persona: "a", nacimiento: "1960-12-31", grado: 65, elecciones: [] }
      ),
      "0"
    )
  })
  it("CLM 75 exactos no basta", () => {
    comprobar(
      clm.mayores75(
        {
          ejercicio: 2025,
          territorio: "castilla-la-mancha",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          persona: "a",
          nacimiento: "1950-01-01",
          grado: 0,
          diasCentro: 0,
          diasConvalecenciaSescam: 0,
        }
      ),
      "0"
    )
  })
  it("CLM convalecencia deja 30 dias efectivos", () => {
    comprobar(
      clm.mayores75(
        {
          ejercicio: 2025,
          territorio: "castilla-la-mancha",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          persona: "a",
          nacimiento: "1949-12-31",
          grado: 0,
          diasCentro: 31,
          diasConvalecenciaSescam: 1,
        }
      ),
      "150"
    )
  })
  it("CLM discapacidad65 prevalece sobre mayor", () => {
    comprobar(
      clm.mayores75(
        {
          ejercicio: 2025,
          territorio: "castilla-la-mancha",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          persona: "a",
          nacimiento: "1940-01-01",
          grado: 65,
          diasCentro: 0,
          diasConvalecenciaSescam: 0,
        }
      ),
      "0"
    )
  })
  it("CLM cuatro nacidos un evento no cuatro cuantias", () => {
    comprobar(
      clm.nacimientoAdopcion(
        {
          ejercicio: 2025,
          territorio: "castilla-la-mancha",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_eventos",
          eventos: [
            {
              id: "p",
              tipo: "parto",
              fecha: "2025-12-31",
              hijos: ["h1", "h2", "h3", "h4"],
              titularesMinimo: ["a", "b"],
            },
          ],
        }
      ),
      "450"
    )
  })
  it("CLM evento anterior excluido", () => {
    comprobar(
      clm.nacimientoAdopcion(
        {
          ejercicio: 2025,
          territorio: "castilla-la-mancha",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_eventos",
          eventos: [
            {
              id: "p",
              tipo: "parto",
              fecha: "2024-12-31",
              hijos: ["h1", "h2", "h3", "h4"],
              titularesMinimo: ["a", "b"],
            },
          ],
        }
      ),
      "0"
    )
  })
  it("CLM mantiene tres titulares aunque fuera declaracion", () => {
    comprobar(
      clm.cuidadoAscendientes75(
        {
          ejercicio: 2025,
          territorio: "castilla-la-mancha",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "27000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_ascendientes",
          ascendientes: [
            {
              id: "abuelo",
              nacimiento: "1940-12-31",
              grado: 0,
              diasCentro: 0,
              diasConvalecenciaSescam: 0,
              titularesMinimo: ["a", "b", "c"],
            },
          ],
        }
      ),
      "50"
    )
  })
  it("CLM cuidado 31 dias efectivos excluye", () => {
    comprobar(
      clm.cuidadoAscendientes75(
        {
          ejercicio: 2025,
          territorio: "castilla-la-mancha",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_ascendientes",
          ascendientes: [
            {
              id: "abuelo",
              nacimiento: "1940-12-31",
              grado: 0,
              diasCentro: 31,
              diasConvalecenciaSescam: 0,
              titularesMinimo: ["a", "b", "c"],
            },
          ],
        }
      ),
      "0"
    )
  })
  it("CyL 65 cumplidos al devengo", () => {
    comprobar(
      cyl.discapacidadPropia(
        {
          ejercicio: 2025,
          territorio: "castilla-y-leon",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "24450",
          baseAhorro: "0",
          minimoPersonalFamiliar: "5550",
        },
        {
          persona: "a",
          nacimiento: "1960-12-31",
          grado: 65,
          residencia: "fuera",
        }
      ),
      "656"
    )
  })
  it("CyL 64 discapacidad65", () => {
    comprobar(
      cyl.discapacidadPropia(
        {
          ejercicio: 2025,
          territorio: "castilla-y-leon",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          persona: "a",
          nacimiento: "1961-01-01",
          grado: 65,
          residencia: "fuera",
        }
      ),
      "300"
    )
  })
  it("CyL residencia concertada excluye", () => {
    comprobar(
      cyl.discapacidadPropia(
        {
          ejercicio: 2025,
          territorio: "castilla-y-leon",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          persona: "a",
          nacimiento: "1960-12-31",
          grado: 65,
          residencia: "concertada",
        }
      ),
      "0"
    )
  })
  it("CyL renta tras minimo un centimo superior", () => {
    comprobar(
      cyl.discapacidadPropia(
        {
          ejercicio: 2025,
          territorio: "castilla-y-leon",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "24450.01",
          baseAhorro: "0",
          minimoPersonalFamiliar: "5550",
        },
        {
          persona: "a",
          nacimiento: "1960-12-31",
          grado: 65,
          residencia: "fuera",
        }
      ),
      "0"
    )
  })
  it("CyL internacional no suma general y sin limite renta art4", () => {
    comprobar(
      cyl.adopcion(
        {
          ejercicio: 2025,
          territorio: "castilla-y-leon",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "90000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todas_las_adopciones",
          adopciones: [
            {
              hijo: "h",
              fechaResolucion: "2024-01-01",
              fechaInscripcion: "2025-01-01",
              clase: "internacional",
              ayudaAnalogica: "denegada",
              titularesMinimo: ["a", "b"],
            },
          ],
        }
      ),
      "1812.5"
    )
  })
  it("CyL inscripcion 2026 no corresponde 2025", () => {
    comprobar(
      cyl.adopcion(
        {
          ejercicio: 2025,
          territorio: "castilla-y-leon",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todas_las_adopciones",
          adopciones: [
            {
              hijo: "h",
              fechaResolucion: "2024-01-01",
              fechaInscripcion: "2026-01-01",
              clase: "internacional",
              ayudaAnalogica: "denegada",
              titularesMinimo: ["a", "b"],
            },
          ],
        }
      ),
      "0"
    )
  })
  it("CyL ayuda concedida excluye adopcion", () => {
    comprobar(
      cyl.adopcion(
        {
          ejercicio: 2025,
          territorio: "castilla-y-leon",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todas_las_adopciones",
          adopciones: [
            {
              hijo: "h",
              fechaResolucion: "2024-01-01",
              fechaInscripcion: "2025-01-01",
              clase: "internacional",
              ayudaAnalogica: "concedida",
              titularesMinimo: ["a", "b"],
            },
          ],
        }
      ),
      "0"
    )
  })
  it("CyL 5000 compartidos tope personal despues de reparto", () => {
    comprobar(
      cyl.cuotasHogar(
        {
          ejercicio: 2025,
          territorio: "castilla-y-leon",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_pagos",
          hijo: "h",
          hijoNacimiento: "2022-01-01",
          titularesMinimo: ["a", "b"],
          ayudaAnalogica: "bono_concilia",
          pagos: [
            {
              id: "q",
              fecha: "2025-12-31",
              importe: "5000",
              nifEmpleado: "empleado",
              empleador: "a",
              regimen: "gananciales",
              conyuge: "b",
            },
          ],
        }
      ),
      "300"
    )
  })
  it("CyL 3000 compartidos detecta tope previo erroneo", () => {
    comprobar(
      cyl.cuotasHogar(
        {
          ejercicio: 2025,
          territorio: "castilla-y-leon",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_pagos",
          hijo: "h",
          hijoNacimiento: "2022-01-01",
          titularesMinimo: ["a", "b"],
          ayudaAnalogica: "bono_concilia",
          pagos: [
            {
              id: "q",
              fecha: "2025-12-31",
              importe: "3000",
              nifEmpleado: "empleado",
              empleador: "a",
              regimen: "gananciales",
              conyuge: "b",
            },
          ],
        }
      ),
      "225"
    )
  })
  it("CyL conjunta tope unico300", () => {
    comprobar(
      cyl.cuotasHogar(
        {
          ejercicio: 2025,
          territorio: "castilla-y-leon",
          contribuyente: "a",
          declarantes: ["a", "b"],
          modalidad: "conjunta",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_pagos",
          hijo: "h",
          hijoNacimiento: "2022-01-01",
          titularesMinimo: ["a", "b"],
          ayudaAnalogica: "bono_concilia",
          pagos: [
            {
              id: "q",
              fecha: "2025-12-31",
              importe: "5000",
              nifEmpleado: "empleado",
              empleador: "a",
              regimen: "gananciales",
              conyuge: "b",
            },
          ],
        }
      ),
      "300"
    )
  })
  it("CyL cuatro anos exactos excluye cuotas", () => {
    comprobar(
      cyl.cuotasHogar(
        {
          ejercicio: 2025,
          territorio: "castilla-y-leon",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_pagos",
          hijo: "h",
          hijoNacimiento: "2021-12-31",
          titularesMinimo: ["a", "b"],
          ayudaAnalogica: "bono_concilia",
          pagos: [
            {
              id: "q",
              fecha: "2025-12-31",
              importe: "5000",
              nifEmpleado: "empleado",
              empleador: "a",
              regimen: "gananciales",
              conyuge: "b",
            },
          ],
        }
      ),
      "0"
    )
  })
  it("CyL siete hijos suplemento unico600 sin limite renta art3", () => {
    comprobar(
      cyl.familiaNumerosa(
        {
          ejercicio: 2025,
          territorio: "castilla-y-leon",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "90000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          tituloInicio: "2024-01-01",
          tituloFin: "2025-12-31",
          descendientes: ["h1", "h2", "h3", "h4", "h5", "h6", "h7"],
          discapacidad65: ["h1", "h2"],
          titulares: ["a", "b"],
          residenciaConyuge: "castilla-y-leon",
          conyuge: "b",
        }
      ),
      "2550"
    )
  })
  it("CyL titulo expirado no hay cuantia", () => {
    comprobar(
      cyl.familiaNumerosa(
        {
          ejercicio: 2025,
          territorio: "castilla-y-leon",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          tituloInicio: "2024-01-01",
          tituloFin: "2025-12-30",
          descendientes: ["h1", "h2", "h3", "h4", "h5", "h6", "h7"],
          discapacidad65: ["h1", "h2"],
          titulares: ["a", "b"],
          residenciaConyuge: "castilla-y-leon",
          conyuge: "b",
        }
      ),
      "0"
    )
  })
  it("Ext trabajo dos titulares umbrales individuales", () => {
    comprobar(
      ext.trabajoDependiente(
        {
          ejercicio: 2025,
          territorio: "extremadura",
          contribuyente: "a",
          declarantes: ["a", "b"],
          modalidad: "conjunta",
          baseGeneral: "99999",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_declarantes",
          personas: [
            {
              id: "a",
              integroTrabajo: "12000",
              restoRentas: "300",
              eleccion: "trabajo",
            },
            {
              id: "b",
              integroTrabajo: "12000",
              restoRentas: "-100",
              eleccion: "trabajo",
            },
          ],
        }
      ),
      "150"
    )
  })
  it("Ext eleccion viudedad personal no elimina trabajo otro", () => {
    comprobar(
      ext.trabajoDependiente(
        {
          ejercicio: 2025,
          territorio: "extremadura",
          contribuyente: "a",
          declarantes: ["a", "b"],
          modalidad: "conjunta",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_declarantes",
          personas: [
            {
              id: "a",
              integroTrabajo: "12000",
              restoRentas: "300",
              eleccion: "viudedad",
            },
            {
              id: "b",
              integroTrabajo: "12000",
              restoRentas: "-100",
              eleccion: "trabajo",
            },
          ],
        }
      ),
      "75"
    )
  })
  it("Ext parto individual reparte300", () => {
    comprobar(
      ext.partosMultiples(
        {
          ejercicio: 2025,
          territorio: "extremadura",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "19000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_partos",
          regimenRenta: "ordinario",
          partos: [
            {
              id: "p",
              fecha: "2025-01-01",
              hijosConvivientes: ["h1", "h2"],
              titulares: ["a", "b"],
            },
          ],
        }
      ),
      "300"
    )
  })
  it("Ext parto conjunta progenitor e hijos sin otro progenitor NO reparto individual", () => {
    comprobar(
      ext.partosMultiples(
        {
          ejercicio: 2025,
          territorio: "extremadura",
          contribuyente: "a",
          declarantes: ["a", "h1", "h2"],
          modalidad: "conjunta",
          baseGeneral: "24000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_partos",
          regimenRenta: "ordinario",
          partos: [
            {
              id: "p",
              fecha: "2025-01-01",
              hijosConvivientes: ["h1", "h2"],
              titulares: ["a", "b"],
            },
          ],
        }
      ),
      "600"
    )
  })
  it("Ext parto exceso renta ordinaria", () => {
    comprobar(
      ext.partosMultiples(
        {
          ejercicio: 2025,
          territorio: "extremadura",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "19000.01",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_partos",
          regimenRenta: "ordinario",
          partos: [
            {
              id: "p",
              fecha: "2025-01-01",
              hijosConvivientes: ["h1", "h2"],
              titulares: ["a", "b"],
            },
          ],
        }
      ),
      "0"
    )
  })
  it("Ext escolar individual comparte15", () => {
    comprobar(
      ext.materialEscolar(
        {
          ejercicio: 2025,
          territorio: "extremadura",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_descendientes",
          regimenRenta: "ordinario",
          descendientes: [
            { id: "h", etapa: "primaria", titularesMinimo: ["a", "b"] },
          ],
        }
      ),
      "7.5"
    )
  })
  it("Ext escolar conjunta progenitor e hijo sin otro progenitor NO reparto individual", () => {
    comprobar(
      ext.materialEscolar(
        {
          ejercicio: 2025,
          territorio: "extremadura",
          contribuyente: "a",
          declarantes: ["a", "h"],
          modalidad: "conjunta",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_descendientes",
          regimenRenta: "ordinario",
          descendientes: [
            { id: "h", etapa: "primaria", titularesMinimo: ["a", "b"] },
          ],
        }
      ),
      "15"
    )
  })
  it("Ext ELA propio no dividido por familiares externos", () => {
    comprobar(
      ext.ela(
        {
          ejercicio: 2025,
          territorio: "extremadura",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_diagnosticados",
          personas: [
            {
              id: "a",
              fechaDiagnostico: "2024-01-01",
              relacion: "propio",
              familiaresConDerecho: ["b", "c"],
            },
          ],
        }
      ),
      "2000"
    )
  })
  it("Ext ELA propio y familiar de otro compatibles M11", () => {
    comprobar(
      ext.ela(
        {
          ejercicio: 2025,
          territorio: "extremadura",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_diagnosticados",
          personas: [
            {
              id: "a",
              fechaDiagnostico: "2024-01-01",
              relacion: "propio",
              familiaresConDerecho: ["b", "c"],
            },
            {
              id: "d",
              fechaDiagnostico: "2025-12-31",
              relacion: "ascendiente",
              familiaresConDerecho: ["a", "e"],
            },
          ],
        }
      ),
      "3000"
    )
  })
  it("Ext ELA conjunta propio mas reparto familiar separado", () => {
    comprobar(
      ext.ela(
        {
          ejercicio: 2025,
          territorio: "extremadura",
          contribuyente: "a",
          declarantes: ["a", "b"],
          modalidad: "conjunta",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_diagnosticados",
          personas: [
            {
              id: "a",
              fechaDiagnostico: "2024-01-01",
              relacion: "propio",
              familiaresConDerecho: ["b", "c"],
            },
          ],
        }
      ),
      "3000"
    )
  })
  it("Ext ELA diagnostico futuro sin importe", () => {
    comprobar(
      ext.ela(
        {
          ejercicio: 2025,
          territorio: "extremadura",
          contribuyente: "a",
          declarantes: ["a"],
          modalidad: "individual",
          baseGeneral: "10000",
          baseAhorro: "0",
          minimoPersonalFamiliar: "0",
        },
        {
          exhaustividad: "todos_los_diagnosticados",
          personas: [
            {
              id: "a",
              fechaDiagnostico: "2026-01-01",
              relacion: "propio",
              familiaresConDerecho: ["b", "c"],
            },
          ],
        }
      ),
      "0"
    )
  })
})
