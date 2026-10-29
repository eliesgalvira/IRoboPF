import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { describe, expect, it } from "@effect/vitest"
import { crearLineaCalculo } from "../lib/dominio/explicacion/linea-calculo"
import type { RastroCalculo } from "../lib/dominio/explicacion/rastro-calculo"
import { sinDiscapacidad } from "../lib/dominio/irpf/caso-fiscal-anual"
import { liquidarIrpfAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import {
  CatalogoRastro,
  enlazarRastroConCatalogo,
} from "../lib/procedencia/rastro-anual"
import { resolver } from "../lib/procedencia/almacen"
import { extraerPuntosTexto } from "../scripts/procedencia/rastro-extraer.mjs"
import { verificarRastroGenerado } from "../scripts/procedencia/rastro-verificar.mjs"
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  resolve,
  tmpdir,
} from "../lib/procedencia/io.mjs"

it("RV3-01 rechaza software de explicación cambiado fuera del dominio", () => {
  const scratch = mkdtempSync(resolve(tmpdir(), "irobopf-rastro-software-"))
  for (const carpeta of ["lib", "scripts", "app/procedencia"])
    cpSync(resolve(carpeta), resolve(scratch, carpeta), { recursive: true })
  mkdirSync(resolve(scratch, "docs/procedencia"), { recursive: true })
  cpSync(
    resolve("docs/procedencia/inventario.json"),
    resolve(scratch, "docs/procedencia/inventario.json")
  )
  expect(verificarRastroGenerado(scratch).puntos).toBe(65)
  for (const file of [
    "lib/procedencia/rastro-anual.ts",
    "scripts/procedencia/contenido-generar.mjs",
    "scripts/procedencia/rastro-verificar.mjs",
    "app/procedencia/[snapshot]/objetos/[hash]/route.ts",
  ]) {
    const original = readFileSync(resolve(file), "utf8")
    writeFileSync(
      resolve(scratch, file),
      original + "\n// mutación independiente\n"
    )
    expect(() => verificarRastroGenerado(scratch)).toThrow("Software")
    writeFileSync(resolve(scratch, file), original)
  }
})

const catalogo = Schema.decodeUnknownSync(CatalogoRastro)({
  version: 1,
  actual: {
    versiones: {
      snapshot: "a".repeat(64),
      algoritmo: "b".repeat(64),
      datos: "c".repeat(64),
      explicacion: "fixture",
    },
    catalogoSha256: "d".repeat(64),
  },
  bindings: [
    {
      siteId: "prueba.importe",
      unidad: "EUR",
      sujeto: { id: "paso.prueba", revision: "e".repeat(64) },
    },
  ],
})
const linea = crearLineaCalculo({
  siteId: "prueba.importe",
  instancia: 0,
  importe: new Decimal("123.4567"),
  unidad: "EUR",
  etiqueta: "Texto editable",
  formula: "Explicación editable",
})
const rastro = (lineas = [linea]): RastroCalculo => ({
  titulo: "Sintético",
  pasos: [
    {
      _tag: "PasoExplicacion",
      titulo: "Paso",
      descripcion: "Prueba",
      fuentes: [],
      lineasCalculo: lineas,
    },
  ],
})

describe("rastro con identidad explícita", () => {
  it("conserva el decimal anterior al formato y no infiere identidad del texto", () => {
    expect(linea.resultado).toBe("123.46 euros")
    expect(linea.origen?.decimal).toBe("123.4567")
    const a = enlazarRastroConCatalogo(rastro(), catalogo)
    const b = enlazarRastroConCatalogo(
      rastro([
        { ...linea, etiqueta: "Otro idioma", formula: "Texto distinto" },
      ]),
      catalogo
    )
    expect(a.pasos[0].lineasCalculo?.[0].procedencia).toEqual(
      b.pasos[0].lineasCalculo?.[0].procedencia
    )
    expect(() => enlazarRastroConCatalogo(a, catalogo)).toThrow("ya versionado")
  })
  it("rechaza instancias duplicadas y unidades distintas", () => {
    expect(() =>
      enlazarRastroConCatalogo(rastro([linea, linea]), catalogo)
    ).toThrow("repetida")
    const porcentaje = crearLineaCalculo({
      siteId: "prueba.importe",
      instancia: 0,
      importe: new Decimal(10),
      unidad: "percent",
      etiqueta: "Porcentaje",
      formula: "x",
    })
    expect(() =>
      enlazarRastroConCatalogo(rastro([porcentaje]), catalogo)
    ).toThrow("Unidad")
  })
  it("deja sin enlace una línea antigua o no finita", () => {
    const vieja = {
      etiqueta: "prueba.importe",
      formula: "123.4567",
      resultado: "123.46 euros",
    }
    const infinita = crearLineaCalculo({
      siteId: "prueba.importe",
      instancia: 1,
      importe: new Decimal(Infinity),
      unidad: "EUR",
      etiqueta: "Inválida",
      formula: "x",
    })
    const r = enlazarRastroConCatalogo(rastro([vieja, infinita]), catalogo)
    expect(
      r.pasos[0].lineasCalculo?.every(
        (l) => l.procedencia?.estado === "pendiente"
      )
    ).toBe(true)
  })
  it("extrae el ID literal y rechaza IDs dinámicos o repetidos", () => {
    const texto =
      'crearLineaCalculo({siteId:"prueba.x",instancia:0,importe:valor,unidad:"EUR",etiqueta:"Texto",formula:"F"})'
    expect(extraerPuntosTexto(texto, "lib/fixture.ts")[0].siteId).toBe(
      "prueba.x"
    )
    expect(() =>
      extraerPuntosTexto(texto + ";" + texto, "lib/fixture.ts")
    ).toThrow("repetida")
    expect(() =>
      extraerPuntosTexto(
        texto.replace('siteId:"prueba.x"', "siteId:variable"),
        "lib/fixture.ts"
      )
    ).toThrow("dinámica")
  })
  it("coteja el catálogo generado con fuentes, inventario y fichas", () => {
    expect(verificarRastroGenerado().puntos).toBe(65)
  })
  it("cada línea anual propia resuelve su ficha y conserva el contexto", () => {
    const r = Effect.runSync(
      liquidarIrpfAnual(
        {
          anio: 2025,
          comunidadAutonoma: "madrid",
          situacionFamiliar: {
            tipo: "individual",
            edad: 40,
            discapacidad: sinDiscapacidad,
            descendientes: [],
            ascendientes: [],
          },
          rendimientos: { trabajo: [{ importeIntegroCentimos: 5_000_000 }] },
          reducciones: [],
          deducciones: [],
          retencionesSoportadasCentimos: 0,
          pagosACuentaCentimos: 0,
        },
        { modo: "canonico" }
      )
    )
    const lineas = r.rastro.pasos.flatMap((p) => p.lineasCalculo ?? [])
    expect(lineas.length).toBeGreaterThan(40)
    expect(r.rastro.contexto).toEqual({
      anio: 2025,
      territorio: "madrid",
      perfilCalculo: "canonico",
    })
    expect(new Set(lineas.map((l) => l.origen?.instanceId)).size).toBe(
      lineas.length
    )
    for (const l of lineas) {
      const p = l.procedencia
      expect(p?.estado).toBe("enlazada")
      if (p?.estado !== "enlazada") throw new Error("Línea sin enlace")
      expect(p.href).not.toContain("?")
      expect(resolver(p.snapshot, p.sujeto.id, p.sujeto.revision)?.tipo).toBe(
        "Step"
      )
    }
  })
})
