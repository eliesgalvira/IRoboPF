import { expect, it } from "vitest"
import { ANDALUCIA_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/andalucia"
import { ARAGON_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/aragon"
import { CATALUNYA_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/catalunya"
import paquete from "../docs/procedencia/deducciones-2025/lotes/a/dictamenes.json"

const fichas = [
  ...ANDALUCIA_DEDUCCIONES_AUTONOMICAS_2025,
  ...ARAGON_DEDUCCIONES_AUTONOMICAS_2025,
  ...CATALUNYA_DEDUCCIONES_AUTONOMICAS_2025,
]

it.each([
  [
    "andalucia_inversion_vivienda_habitual_protegida_jovenes",
    /protegida o.*menor de 35/i,
  ],
  ["andalucia_alquiler_vivienda_habitual", /mayores de 65/],
  ["andalucia_nacimiento_adopcion_acogimiento_menores", /al menos 90 días/],
  [
    "aragon_primer_segundo_hijo_poblaciones_menos_10000",
    /residido.*año.*anterior/,
  ],
  ["aragon_guarderia_menores_3", /autorizado.*Educación/],
  ["cataluna_nacimiento_adopcion_acogimiento", /incompatible/i],
  ["cataluna_alquiler_vivienda_habitual", /35 años o menos/],
  ["cataluna_obligacion_declarar_mas_de_un_pagador", /puedan acogerse.*89.A/],
])(
  "%s: hace explícita la condición que discrimina el derecho",
  (codigo, regla) => {
    const ficha = fichas.find((f) => f.codigo === codigo)
    expect(
      JSON.stringify({ limites: ficha?.limites, requisitos: ficha?.requisitos })
    ).toMatch(regla)
  }
)

it("la facturación de ángel inversor también limita la constitución", () => {
  const f = fichas.find((f) => f.codigo === "cataluna_angel_inversor")
  expect(
    f?.limites.some(
      (s) => s.includes("facturación") && !s.includes("En ampliación")
    )
  ).toBe(true)
  expect(
    f?.limites.some(
      (s) => s.includes("facturación") && s.includes("En ampliación")
    )
  ).toBe(false)
})

it("no traslada el límite por vivienda de 612-3 a víctimas de 612-11", () => {
  const f = fichas.find(
    (f) => f.codigo === "cataluna_alquiler_victimas_violencia_machista"
  )
  expect(f?.limites.join(" ")).not.toMatch(/Una misma vivienda/)
})

it("cooperativas conserva mantenimiento de condiciones y excepciones", () => {
  const f = fichas.find(
    (f) => f.codigo === "cataluna_inversion_cooperativas_agrarias_vivienda"
  )
  expect(JSON.stringify(f)).toMatch(/reinvierte/)
  expect(JSON.stringify(f)).toMatch(/transmi/)
  expect(JSON.stringify(f)).toMatch(/cinco años.*2.1.*2.2/)
})

it("la base histórica de adecuación no se confunde con adquisición", () => {
  const f = fichas.find(
    (f) => f.codigo === "cataluna_tramo_autonomico_inversion_vivienda_habitual"
  )
  expect(f?.limites.join(" ")).toContain("12.080")
  expect(f?.limites.join(" ")).toContain("9.040")
})

it("el pariente más cercano con renta hasta 8.000 cede al siguiente grado", () => {
  const f = fichas.find(
    (f) => f.codigo === "aragon_cuidado_personas_dependientes"
  )
  expect(f?.prorrateo.join(" ")).toMatch(/no superiores a 8.000/)
})

it("la reforma andaluza incluye el apartado uno y efectos desde 2025", () => {
  const f = paquete.deducciones.find(
    (d) => d.codigo === "andalucia_alquiler_vivienda_habitual"
  )
  const efectos = f?.citas
    .filter((c) => c.articulo === "DF decimoctava")
    .map((c) => c.textoLiteral)
    .join(" ")
  expect(efectos).toMatch(/uno, dos, tres, cuatro y cinco/)
  expect(efectos).toMatch(/enero de 2025/)
})

it("la vivienda histórica se acredita con 68.1 de vivienda y dos bases", () => {
  const f = paquete.deducciones.find(
    (d) => d.codigo === "cataluna_tramo_autonomico_inversion_vivienda_habitual"
  )
  const historica = f?.citas
    .filter((c) => c.documentoId === "RDL20-2011")
    .map((c) => c.textoLiteral)
    .join(" ")
  expect(historica).toMatch(/9.040/)
  expect(historica).toMatch(/12.080/)
  expect(historica).not.toMatch(/empresas de nueva/)
})

it("la regla de cooperativas incluye las excepciones en el original", () => {
  const f = paquete.deducciones.find(
    (d) => d.codigo === "cataluna_inversion_cooperativas_agrarias_vivienda"
  )
  const original = f?.citas
    .filter((c) => c.documentoId === "DOGC-DL5-2025")
    .map((c) => c.textoLiteral)
    .join(" ")
  expect(original).toMatch(/reinverteix/)
  expect(original).toMatch(/transmet/)
})

it("la ficha de investigación remite a su sección física del manual", () => {
  const ficha = fichas.find((f) => f.codigo === "cataluna_donativos_idi")
  expect(ficha?.fuenteManual.paginas).toEqual([321, 322])
})
