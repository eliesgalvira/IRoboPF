import { it, expect } from "vitest"
import { evaluarAmpliacionE2025 as E } from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025"
import {
  ctx,
  casos,
  contratoAlquiler,
  pago as pe,
  ayudaComun,
  tiposMedios,
} from "./galicia-rioja-ampliacion-2025.casos"
import type { HechosAmpliacionE2025 } from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025"
import type { Pago } from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/comun"
function eEuros(x: ReturnType<typeof E>) {
  if (x.estado !== "calculo_parcial") return null
  return Number(x.exacto.numeradorCentimos) / Number(x.exacto.denominador) / 100
}
const tercero = (p: Pago): Pago => ({ ...p, pagador: "TERCERO" })
function pagosAjenos(h: HechosAmpliacionE2025): HechosAmpliacionE2025 {
  switch (h.codigo) {
    case "rioja_internet_jovenes_emancipados":
    case "rioja_luz_gas_jovenes_emancipados":
      return {
        ...h,
        contratos: h.contratos.map((x) => ({
          ...x,
          pagos: x.pagos.map(tercero),
        })),
      }
    case "galicia_climatizacion_agua_caliente_renovables":
      return {
        ...h,
        inmuebles: h.inmuebles.map((x) => ({
          ...x,
          pagos: x.pagos.map(tercero),
        })),
      }
    case "galicia_aldeas_modelo":
      return {
        ...h,
        viviendas: h.viviendas.map((x) => ({
          ...x,
          pagos: x.pagos.map(tercero),
        })),
      }
    case "galicia_adecuacion_inmueble_vacio_arrendamiento":
      return {
        ...h,
        viviendas: h.viviendas.map((x) => ({
          ...x,
          obra: { ...x.obra, pagos: x.obra.pagos.map(tercero) },
        })),
      }
    case "rioja_paliar_subida_intereses_hipotecarios":
      return {
        ...h,
        viviendas: h.viviendas.map((x) => ({
          ...x,
          prestamos: x.prestamos.map((p) => ({
            ...p,
            pagos: p.pagos.map(tercero),
          })),
        })),
      }
    case "galicia_libros_texto_material_escolar":
      return {
        ...h,
        descendientes: h.descendientes.map((x) => ({
          ...x,
          compras: x.compras.map((a) => ({ ...a, pago: tercero(a.pago) })),
        })),
      }
    default:
      throw Error("Código sin mutación de pagos preparada")
  }
}
it.each([
  "rioja_internet_jovenes_emancipados",
  "rioja_luz_gas_jovenes_emancipados",
  "galicia_climatizacion_agua_caliente_renovables",
  "galicia_aldeas_modelo",
  "galicia_adecuacion_inmueble_vacio_arrendamiento",
  "rioja_paliar_subida_intereses_hipotecarios",
  "galicia_libros_texto_material_escolar",
])(
  "%s conserva el positivo y rechaza gastos de tercero sin atribución",
  (codigo) => {
    const x = casos.find((x) => x.hechos.codigo === codigo)
    if (x === undefined) throw Error("fixture ausente")
    const bien = E(x.contexto, x.hechos)
    expect(bien.estado).toBe("calculo_parcial")
    if (bien.estado === "calculo_parcial")
      expect(bien.presentacionEuros).toBe(x.esperado)
    const mal = E(x.contexto, pagosAjenos(x.hechos))
    expect(mal.estado).toBe("no_soportado")
    if (mal.estado === "no_soportado")
      expect(mal.motivos.join(" ")).toMatch(/Pagador.*atribución/)
  }
)
const electric = casos.find(
  (x) => x.hechos.codigo === "rioja_vehiculos_electricos_nuevos"
)!
for (const categoria of ["M1", "L6e", "L7e", "L3e", "L5e"] as const) {
  it(`E-BLOQUEO suspension DA3 categoria${categoria}`, () => {
    const h = structuredClone(electric.hechos)
    if (h.codigo !== "rioja_vehiculos_electricos_nuevos") throw Error("fixture")
    expect(
      eEuros(
        E(electric.contexto, {
          ...h,
          vehiculos: h.vehiculos.map((x) => ({ ...x, categoria })),
        })
      ) ?? 0
    ).toBe(0)
  })
}
for (const categoria of ["N1", "L1e", "L2e"] as const) {
  it(`E control excepcion DA3 ${categoria}:150`, () => {
    const h = structuredClone(electric.hechos)
    if (h.codigo !== "rioja_vehiculos_electricos_nuevos") throw Error("fixture")
    expect(
      eEuros(
        E(electric.contexto, {
          ...h,
          vehiculos: h.vehiculos.map((x) => ({ ...x, categoria })),
        })
      )
    ).toBe(150)
  })
}
it("E consumo declaracion290 deja10", () => {
  const h = structuredClone(electric.hechos),
    c = ctx("la-rioja")
  if (h.codigo !== "rioja_vehiculos_electricos_nuevos") throw Error("fixture")
  expect(
    eEuros(
      E(
        {
          ...c,
          magnitudes: c.magnitudes.map((x) =>
            x.clave === "cuotaElectricoConsumidaDeclaracion"
              ? { ...x, euros: "290" }
              : x
          ),
        },
        { ...h, vehiculos: h.vehiculos.map((x) => ({ ...x, categoria: "N1" })) }
      )
    )
  ).toBe(10)
})
const alquiler = (pagador: string) => ({
  codigo: "galicia_alquiler_vivienda_habitual" as const,
  contratos: [
    {
      ...contratoAlquiler,
      titularesContrato: ["A"],
      titularesDerecho: ["A"],
      pagos: [pe("alquiler", "1000", "P", pagador)],
    },
  ],
  hijosMenores: [],
  derechoInversionVivienda: "sin_derecho" as const,
})
it("E control alquiler propio:100", () =>
  expect(eEuros(E(ctx(), alquiler("A")))).toBe(100))
it("E-BLOQUEO alquiler pagado por tercero sin atribucion no genera100", () =>
  expect(eEuros(E(ctx(), alquiler("TERCERO"))) ?? 0).toBe(0))
it("E alquiler ayuda200 resta base:80", () => {
  const h = alquiler("A")
  const conAyuda = {
    ...h,
    contratos: h.contratos.map((x) => ({
      ...x,
      pagos: x.pagos.map((p) => ({ ...p, subvencion: "200" })),
    })),
  }
  expect(eEuros(E(ctx(), conAyuda))).toBe(80)
})
it("E magnitud duplicada no genera importe", () => {
  const c = ctx()
  expect(
    E({ ...c, magnitudes: [...c.magnitudes, c.magnitudes[0]] }, alquiler("A"))
      .estado
  ).toBe("no_soportado")
})
it("E-BLOQUEO antiguo alquiler habitual hasta junio pagado mayo:100", () => {
  const h = alquiler("A")
  expect(
    eEuros(
      E(ctx(), {
        ...h,
        contratos: h.contratos.map((x) => ({
          ...x,
          ocupacion: { desde: "2020-01-01", hasta: "2025-06-30" },
          pagos: [{ ...x.pagos[0], fecha: "2025-05-01" }],
        })),
      })
    )
  ).toBe(100)
})
it("E ayuda concedida1000 pero BL400 genera80", () =>
  expect(
    eEuros(
      E(ctx(), {
        codigo: "galicia_ayudas_ela_fenotipos",
        ayudas: [
          {
            ...ayudaComun,
            concepto: "ELA_fenotipo",
            partes: ayudaComun.partes.map((p) => ({
              ...p,
              baseLiquidableAtribuida: "400",
            })),
          },
        ],
        tiposMedios,
      })
    )
  ).toBe(80))
it("E ayuda sin tipos identificados no inventa importe", () =>
  expect(
    E(ctx(), {
      codigo: "galicia_ayudas_ela_fenotipos",
      ayudas: [{ ...ayudaComun, concepto: "ELA_fenotipo" }],
      tiposMedios: [],
    }).estado
  ).toBe("no_soportado"))
it("E ayuda imputada2026 no genera en2025", () =>
  expect(
    eEuros(
      E(ctx(), {
        codigo: "galicia_ayudas_ela_fenotipos",
        ayudas: [
          {
            ...ayudaComun,
            concepto: "ELA_fenotipo",
            ejercicioImputacion: 2026,
          },
        ],
        tiposMedios,
      })
    )
  ).toBe(0))

it.each(["galicia", "la-rioja"] as const)(
  "%s rechaza pagador tercero sin atribución",
  (territorio) => {
    const h = alquiler("TERCERO")
    const codigo =
      territorio === "galicia"
        ? "galicia_alquiler_vivienda_habitual"
        : "rioja_arrendamiento_menores_36"
    const r = E(ctx(territorio), {
      ...h,
      codigo,
      contratos: h.contratos.map((x) => ({ ...x, territorio })),
    })
    expect(r.estado).toBe("no_soportado")
    if (r.estado === "no_soportado")
      expect(r.motivos.join(" ")).toMatch(/atribución/)
  }
)
it("un pago posterior a dejar la vivienda requiere periodo arrendado explícito", () => {
  const h = alquiler("A")
  const r = E(ctx(), {
    ...h,
    contratos: h.contratos.map((x) => ({
      ...x,
      ocupacion: { desde: "2020-01-01", hasta: "2025-06-30" },
      pagos: [{ ...x.pagos[0], fecha: "2025-07-01" }],
    })),
  })
  expect(r.estado).toBe("no_soportado")
  if (r.estado === "no_soportado")
    expect(r.motivos.join(" ")).toMatch(/periodo/)
})
it("ocupación temporal mal formada no se convierte en cero", () => {
  const h = alquiler("A")
  expect(
    E(ctx(), {
      ...h,
      contratos: h.contratos.map((x) => ({
        ...x,
        ocupacion: { desde: "2025-07-01", hasta: "2025-06-30" },
      })),
    }).estado
  ).toBe("no_soportado")
})
it("N1 conserva el cálculo previo de 150 euros", () => {
  const h = electric.hechos
  if (h.codigo !== "rioja_vehiculos_electricos_nuevos") throw Error("fixture")
  expect(
    eEuros(
      E(electric.contexto, {
        ...h,
        vehiculos: h.vehiculos.map((x) => ({ ...x, categoria: "N1" })),
      })
    )
  ).toBe(150)
})
