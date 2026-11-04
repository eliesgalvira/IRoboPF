import { describe, expect, it } from "vitest"
import {
  evaluarTerritorialF2025 as evaluar,
  evaluarLoteTerritorialF2025,
} from "../lib/dominio/irpf/deducciones/territorial-f-2025"
import type { SolicitudTerritorialF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-2025"

// Oráculos monetarios independientes: artículos/citas del lote F en matriz-51.
// No se importa el catálogo ni se deriva el esperado de la implementación.
const contexto = {
  ejercicio: 2025,
  territorio: "murcia",
  contribuyente: "a",
  modalidad: "individual",
} as const
function solicitud<T extends object>(
  codigo: string,
  hechos: T
): SolicitudTerritorialF2025 {
  return {
    tipo: "territorial_f_hechos_2025",
    codigo,
    contexto: {
      ...contexto,
      territorio: codigo.startsWith("madrid_") ? "madrid" : "murcia",
    },
    hechos: { baseGeneralEUR: "20000", baseAhorroEUR: "0", ...hechos },
  }
}
const pago = (beneficiario: string, concepto: string, importeEUR = "100") => ({
  id: "p1",
  fecha: "2025-06-01",
  pagador: "a",
  atribucion: "propia_exclusiva",
  factura: "f1",
  soportePago: "recibo1",
  conservacionFactura: "hasta_prescripcion",
  beneficiario,
  concepto,
  importeEUR,
})
const hijo = () => ({
  id: "h",
  nacimiento: "2015-02-02",
  progenitoresConvivientes: ["a"],
  situacionDevengo: "vivo_convive_sin_anualidades",
  soporteParentescoConvivencia: "registro",
  rentasNoExentas: "0",
  declaracion: { tipo: "no_presentada" },
  etapa: "primaria",
  regimenPago: "progenitor_unico",
  soporteRegimenPago: "registro",
})
function importe(
  s: SolicitudTerritorialF2025,
  esperado: number,
  centimos: string
) {
  const r = evaluar(s)
  expect(r.estado).toBe("calculo_parcial")
  if (!("importe" in r)) throw new Error(r.motivo)
  expect(r.importe).toBe(esperado)
  expect(r.importeCentimos).toBe(centimos)
  expect(r.aceptacionFiscal).toBe("pendiente")
  expect(
    r.rastro.some((x) => x.includes("Citas lote F")) ||
      r.reservas.some((x) => x.includes("revisado"))
  ).toBe(true)
}
const gasto = <T extends { id: string }>(
  codigo: string,
  beneficiario: T,
  concepto: string,
  cantidad = "100",
  otros = {}
) =>
  solicitud(codigo, {
    beneficiarios: [beneficiario],
    pagos: [pago(String(beneficiario.id), concepto, cantidad)],
    ...otros,
  })

describe("F: importes por hechos declarados, antes de cuota", () => {
  it.each([
    ["madrid_adopcion_internacional", "a", ["a"]],
    ["madrid_adopcion_internacional", "b", ["a", "b"]],
    ["murcia_nacimiento_adopcion", "a", ["a"]],
    ["murcia_nacimiento_adopcion", "b", ["a", "b"]],
  ] as const)(
    "rechaza %s cuando el hijo %s figura entre sus progenitores",
    (codigo, identidadHijo, progenitores) => {
      const r = evaluar(
        solicitud(codigo, {
          eventos: [
            {
              hijo: identidadHijo,
              fecha: "2025-12-31",
              tipo: codigo.startsWith("madrid_")
                ? "adopcion_internacional"
                : "nacimiento",
              soporte: "registro",
              normaConvenioAplicable: "convenio",
              progenitoresConvivientesConDerecho: [...progenitores],
              ordenParaContribuyente: 1,
              soporteOrden: "libro",
            },
          ],
        })
      )
      expect(r.estado).toBe("no_soportado")
      expect(r).not.toHaveProperty("importe")
      expect(r.siguienteHecho).toBe("evento.hijo")
    }
  )
  it("discapacidad 33 %, base 40.000 inclusive: 150", () =>
    importe(
      solicitud("murcia_contribuyentes_discapacidad", {
        gradoPorcentaje: "33",
        certificado: "c1",
        fechaEfectos: "2025-12-31",
        baseGeneralEUR: "40000",
      }),
      150,
      "15000"
    ))
  it.each(["32.99", "0"])("grado %s excluido", (gradoPorcentaje) =>
    expect(
      evaluar(
        solicitud("murcia_contribuyentes_discapacidad", {
          gradoPorcentaje,
          certificado: "c1",
          fechaEfectos: "2025-01-01",
        })
      ).estado
    ).toBe("excluida")
  )
  it("discapacidad base superior en céntimo excluida", () =>
    expect(
      evaluar(
        solicitud("murcia_contribuyentes_discapacidad", {
          gradoPorcentaje: "33",
          certificado: "c1",
          fechaEfectos: "2025-01-01",
          baseGeneralEUR: "40000.01",
        })
      ).estado
    ).toBe("excluida"))
  it.each([
    [1, 100, "10000"],
    [2, 200, "20000"],
    [3, 300, "30000"],
    [5, 300, "30000"],
  ] as const)("nacimiento orden %s", (orden, valor, centimos) =>
    importe(
      solicitud("murcia_nacimiento_adopcion", {
        baseGeneralEUR: "30000",
        eventos: [
          {
            hijo: "h",
            fecha: "2025-01-01",
            tipo: "nacimiento",
            soporte: "registro",
            progenitoresConvivientesConDerecho: ["a"],
            ordenParaContribuyente: orden,
            soporteOrden: "libro",
          },
        ],
      }),
      valor,
      centimos
    )
  )
  it("nacimiento reparto mitad del segundo hijo: 100", () =>
    importe(
      solicitud("murcia_nacimiento_adopcion", {
        eventos: [
          {
            hijo: "h",
            fecha: "2025-12-31",
            tipo: "adopcion",
            soporte: "registro",
            progenitoresConvivientesConDerecho: ["a", "b"],
            ordenParaContribuyente: 2,
            soporteOrden: "libro",
          },
        ],
      }),
      100,
      "10000"
    ))
  it.each([
    [1, 721.7, "72170"],
    [2, 541.28, "54128"],
  ] as const)(
    "adopción Madrid %s progenitores: art5, 721,70 y aumento 50%% antes de mitad",
    (n, esperado, centimos) =>
      importe(
        solicitud("madrid_adopcion_internacional", {
          baseGeneralEUR: "100000",
          eventos: [
            {
              hijo: "h",
              fecha: "2025-01-01",
              tipo: "adopcion_internacional",
              soporte: "resolucion",
              normaConvenioAplicable: "convenio",
              progenitoresConvivientesConDerecho: n === 1 ? ["a"] : ["a", "b"],
            },
          ],
        }),
        esperado,
        centimos
      )
  )
  it("lentes 30 % sin renta máxima importada", () =>
    importe(
      gasto(
        "murcia_cristales_lentes_soluciones_limpieza",
        hijo(),
        "cristales_graduados",
        "200",
        { baseGeneralEUR: "90000" }
      ),
      60,
      "6000"
    ))
  it("lentes máximo 100 global con dos hijos, no por hijo", () => {
    const h2 = { ...hijo(), id: "h2" }
    importe(
      solicitud("murcia_cristales_lentes_soluciones_limpieza", {
        beneficiarios: [hijo(), h2],
        pagos: [
          pago("h", "lentes_contacto", "300"),
          { ...pago("h2", "solucion_limpieza", "300"), id: "p2" },
        ],
      }),
      100,
      "10000"
    )
  })
  it("idiomas 15 % y máximo 300 por hijo", () =>
    importe(
      gasto(
        "murcia_ensenanza_idiomas",
        hijo(),
        "idioma_extranjero_extraescolar",
        "3000"
      ),
      300,
      "30000"
    ))
  it("idiomas renta 24.999,99 admitida", () =>
    importe(
      gasto(
        "murcia_ensenanza_idiomas",
        hijo(),
        "idioma_extranjero_extraescolar",
        "100",
        { baseGeneralEUR: "24999.99" }
      ),
      15,
      "1500"
    ))
  it("idiomas 25.000 exactos excluidos", () =>
    expect(
      evaluar(
        gasto(
          "murcia_ensenanza_idiomas",
          hijo(),
          "idioma_extranjero_extraescolar",
          "100",
          { baseGeneralEUR: "25000" }
        )
      ).estado
    ).toBe("excluida"))
  it("idiomas gananciales común: máximo por hijo antes de mitad", () =>
    importe(
      gasto(
        "murcia_ensenanza_idiomas",
        {
          ...hijo(),
          progenitoresConvivientes: ["a", "b"],
          regimenPago: "gananciales_gasto_comun",
        },
        "idioma_extranjero_extraescolar",
        "3000"
      ),
      150,
      "15000"
    ))
  it.each([
    ["1960-01-01", 30, "3000"],
    ["1959-12-31", 100, "10000"],
  ] as const)(
    "deporte edad de pagador %s",
    (nacimientoContribuyente, esperado, centimos) =>
      importe(
        gasto(
          "murcia_deporte_actividades_saludables",
          { id: "a", relacion: "contribuyente" },
          "gimnasio",
          "100",
          { nacimientoContribuyente, baseGeneralEUR: "25000" }
        ),
        esperado,
        centimos
      )
  )
  it("deporte excluye cuota estatutaria aun con factura", () =>
    importe(
      gasto(
        "murcia_deporte_actividades_saludables",
        { id: "a", relacion: "contribuyente" },
        "cuota_estatutaria_club",
        "500",
        { nacimientoContribuyente: "1959-01-01" }
      ),
      0,
      "0"
    ))
  it("deporte máximo 150", () =>
    importe(
      gasto(
        "murcia_deporte_actividades_saludables",
        { id: "a", relacion: "contribuyente" },
        "yoga",
        "1000",
        { nacimientoContribuyente: "1980-01-01" }
      ),
      150,
      "15000"
    ))
  it("enfermedad rara gasto íntegro, sin umbral ajeno", () =>
    importe(
      gasto(
        "murcia_enfermedades_raras",
        {
          id: "a",
          relacion: "contribuyente",
          diagnostico: {
            clase: "enfermedad_rara",
            certificado: "c1",
            fechaEfectos: "2024-01-01",
          },
        },
        "tratamiento",
        "400",
        { baseGeneralEUR: "100000" }
      ),
      300,
      "30000"
    ))
  it("veterinario 30 % tope global 100", () =>
    importe(
      gasto(
        "murcia_gastos_veterinarios",
        {
          id: "perro",
          clase: "animal_domestico",
          titular: "a",
          soporteTitularidad: "registro",
        },
        "servicio_veterinario",
        "500"
      ),
      100,
      "10000"
    ))
  it("cero real con colección declarada vacía", () =>
    importe(
      solicitud("murcia_gastos_veterinarios", { pagos: [], beneficiarios: [] }),
      0,
      "0"
    ))
  it("centavos: 0,05 × 30 % = 0,015 -> 0,02 a la salida", () =>
    importe(
      gasto(
        "murcia_gastos_veterinarios",
        {
          id: "gato",
          clase: "animal_domestico",
          titular: "a",
          soporteTitularidad: "registro",
        },
        "servicio_veterinario",
        "0.05"
      ),
      0.02,
      "2"
    ))
})

describe("F: rechazo acotado, nunca importe cero por insuficiencia", () => {
  it("el contribuyente no puede figurar como su propio hijo", () => {
    const r = evaluar(
      gasto(
        "murcia_cristales_lentes_soluciones_limpieza",
        { ...hijo(), id: "a" },
        "cristales_graduados"
      )
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.siguienteHecho).toBe("hijo.id")
  })
  it("el cónyuge debe tener identidad diferente del contribuyente", () => {
    const r = evaluar(
      gasto(
        "murcia_deporte_actividades_saludables",
        { id: "a", relacion: "conyuge", soporteMatrimonioVigente: "registro" },
        "gimnasio",
        "100",
        { nacimientoContribuyente: "1980-01-01" }
      )
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.siguienteHecho).toBe("beneficiario.id")
  })
  it.each([
    undefined,
    null,
    NaN,
    Infinity,
    -1,
    "-1",
    "0.001",
    "1e3",
    "01",
    "1,00",
    " 1",
    {},
    true,
  ])("importe inválido %j", (importeEUR) => {
    const r = evaluar(
      solicitud("murcia_gastos_veterinarios", {
        beneficiarios: [
          {
            id: "gato",
            clase: "animal_domestico",
            titular: "a",
            soporteTitularidad: "r",
          },
        ],
        pagos: [{ ...pago("gato", "servicio_veterinario"), importeEUR }],
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect("importe" in r).toBe(false)
    expect(r.siguienteHecho).toContain("importeEUR")
  })
  it.each(["2025-02-29", "2025-13-01", "2024-12-31", "2026-01-01"])(
    "fecha pago %s inválida o ajena",
    (fecha) => {
      const r = evaluar(
        solicitud("murcia_gastos_veterinarios", {
          beneficiarios: [],
          pagos: [{ ...pago("gato", "servicio_veterinario"), fecha }],
        })
      )
      expect(r.estado).toBe("no_soportado")
      expect(r.siguienteHecho).toContain("fecha")
    }
  )
  it.each([
    "factura",
    "soportePago",
    "pagador",
    "conservacionFactura",
    "atribucion",
  ])("falta %s", (campo) => {
    const p = Object.fromEntries(
      Object.entries(pago("h", "cristales_graduados")).filter(
        ([clave]) => clave !== campo
      )
    )
    expect(
      evaluar(
        solicitud("murcia_cristales_lentes_soluciones_limpieza", {
          beneficiarios: [hijo()],
          pagos: [p],
        })
      ).estado
    ).toBe("no_soportado")
  })
  it("dos pagos misma identidad rechazados", () =>
    expect(
      evaluar(
        solicitud("murcia_gastos_veterinarios", {
          pagos: [
            pago("gato", "servicio_veterinario"),
            pago("gato", "servicio_veterinario"),
          ],
          beneficiarios: [],
        })
      ).siguienteHecho
    ).toBe("pagos.id"))
  it.each(["2013-12-31", "2013-01-01"])(
    "lentes a los 12 años %s rechazados",
    (nacimiento) =>
      expect(
        evaluar(
          gasto(
            "murcia_cristales_lentes_soluciones_limpieza",
            { ...hijo(), nacimiento },
            "cristales_graduados"
          )
        ).estado
      ).toBe("no_soportado")
  )
  it("mínimo rentas 8.000 inclusive y declaración 1.800 inclusive", () =>
    importe(
      gasto(
        "murcia_cristales_lentes_soluciones_limpieza",
        {
          ...hijo(),
          rentasNoExentas: "8000",
          declaracion: { tipo: "individual", rentas: "1800" },
        },
        "cristales_graduados"
      ),
      30,
      "3000"
    ))
  it.each([
    { rentasNoExentas: "8000.01" },
    { declaracion: { tipo: "individual", rentas: "1800.01" } },
    { declaracion: { tipo: "conjunta" } },
    { progenitoresConvivientes: ["b"] },
  ])("mínimo no acreditado %j", (cambio) =>
    expect(
      evaluar(
        gasto(
          "murcia_cristales_lentes_soluciones_limpieza",
          { ...hijo(), ...cambio },
          "cristales_graduados"
        )
      ).estado
    ).toBe("no_soportado")
  )
  it("individual no se convierte en conjunta", () => {
    const s = gasto(
      "murcia_gastos_veterinarios",
      {
        id: "gato",
        clase: "animal_domestico",
        titular: "a",
        soporteTitularidad: "r",
      },
      "servicio_veterinario"
    )
    expect(
      evaluar({
        ...s,
        contexto: {
          ...s.contexto,
          modalidad: "conjunta",
          declarantes: ["a", "b"],
        },
      }).estado
    ).toBe("no_soportado")
  })
  it("no aplica dos veces código ni pago en lote", () => {
    const s = gasto(
      "murcia_gastos_veterinarios",
      {
        id: "gato",
        clase: "animal_domestico",
        titular: "a",
        soporteTitularidad: "r",
      },
      "servicio_veterinario"
    )
    expect(evaluarLoteTerritorialF2025([s, s])[1]?.estado).toBe("no_soportado")
    const s2 = gasto(
      "murcia_deporte_actividades_saludables",
      { id: "a", relacion: "contribuyente" },
      "gimnasio",
      "100",
      { nacimientoContribuyente: "1980-01-01" }
    )
    expect(evaluarLoteTerritorialF2025([s, s2])[1]?.siguienteHecho).toBe(
      "eleccionYLibroPagos"
    )
  })
  it("reserva 35.000 es base, no precio", () => {
    const r = evaluar(
      solicitud("murcia_vehiculos_electricos", {
        baseGeneralEUR: "34000",
        baseAhorroEUR: "1000",
        precioEUR: "10000",
      })
    )
    expect(r.reservas.join()).toContain("F-N01")
    expect(
      evaluar(
        solicitud("murcia_vehiculos_electricos", {
          baseGeneralEUR: "20000",
          precioEUR: "35000",
        })
      ).reservas
    ).toEqual([])
    expect(
      evaluar(
        gasto(
          "murcia_gastos_veterinarios",
          {
            id: "gato",
            clase: "animal_domestico",
            titular: "a",
            soporteTitularidad: "r",
          },
          "servicio_veterinario"
        )
      ).reservas.join()
    ).not.toContain("F-N01")
  })
  it.each([
    null,
    {},
    {
      tipo: "territorial_f_hechos_2025",
      codigo: "murcia_gastos_guarderia",
      contexto,
      hechos: {},
    },
  ])("entrada incompleta %j no lanza", (s) =>
    expect(evaluar(s).estado).toBe("no_soportado")
  )
})

describe("F: reutilización de fórmulas revisadas y conjunta de identidad", () => {
  it("Madrid progenitor b, referencia a: 721,70", () => {
    const c = {
      ...contexto,
      territorio: "madrid",
      modalidad: "conjunta",
      declarantes: ["a", "b"],
    }
    const r = evaluar({
      tipo: "territorial_f_hechos_2025",
      codigo: "madrid_nacimiento_adopcion_hijos",
      contexto: c,
      hechos: {
        codigo: "madrid_nacimiento_adopcion_hijos",
        contexto: c,
        declarantes: ["a", "b"],
        elegibilidadExterna: true,
        eventos: [
          { ejercicio: 2025, hijos: ["h"], progenitoresConvivientes: ["b"] },
        ],
        historia: [
          {
            ejercicio: 2025,
            general: 20000,
            ahorro: 0,
            basesUnidadFamiliar: [20000],
          },
        ],
      },
    })
    expect("importe" in r && r.importe).toBe(721.7)
  })
  it("guardería titular b, referencia a: tope 1000 por hijo", () => {
    const c = { ...contexto, modalidad: "conjunta", declarantes: ["a", "b"] }
    const r = evaluar({
      tipo: "territorial_f_hechos_2025",
      codigo: "murcia_gastos_guarderia",
      contexto: c,
      hechos: {
        codigo: "murcia_gastos_guarderia",
        contexto: c,
        declarantes: ["a", "b"],
        elegibilidadExterna: true,
        baseImponible: 20000,
        gastos: [
          {
            hijo: "h",
            titulares: ["b"],
            custodia: 10000,
            alimentacion: 0,
            vestuarioEscolar: 0,
            ayudas: 0,
          },
        ],
      },
    })
    expect("importe" in r && r.importe).toBe(1000)
  })
})
