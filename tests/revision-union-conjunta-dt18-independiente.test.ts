import { expect, it } from "vitest"
import { Schema } from "effect"
import conjuntas from "../docs/procedencia/implementaciones/conjunta-ordinaria-2025/entradas-candidatas.json"
import viviendas from "./fixtures/dt18-open2025-entradas.json"
import { prepararConjunta2025 } from "../lib/dominio/irpf/conjunta-2025/preparar"
import { CasoConjunta2025 } from "../lib/dominio/irpf/conjunta-2025/contrato"
import { HechosDT18Estatal2025 } from "../lib/dominio/irpf/vivienda-dt18-2025/contrato"
import { producirDT18Estatal2025 } from "../lib/dominio/irpf/vivienda-dt18-2025/productor"
import { aplicarCuotasDT18 } from "../lib/dominio/irpf/vivienda-dt18-2025/cuota"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"

// Preparadas por revisión estática: no ejecutadas ni comprobadas por tipos.
// Los dos rechazos de coherencia son regresiones deseadas, no verdes alegados.
const matrimonio = () => structuredClone(conjuntas.casos.find(x => x.entradaCandidata.tipoUnidad === "matrimonial")!.entradaCandidata)
const vivienda = () => structuredClone(viviendas.find(x => x.id === "open2025-canarias-01")!.entradaAPI.deduccionesTerritoriales2025.viviendaDT182025)
const ambito = {
  anio: 2025 as const, comunidadAutonoma: "canarias" as const, contribuyenteId: "s-1",
  situacionFamiliar: { tipo: "individual" as const, edad: 40, discapacidad: { _tag: "SinDiscapacidad" as const }, descendientes: [], ascendientes: [] },
}
function producir(entrada: ReturnType<typeof vivienda>) {
  return producirDT18Estatal2025(Schema.decodeUnknownSync(HechosDT18Estatal2025)(entrada, { onExcessProperty: "error" }), ambito, [])
}

it("no admite nacimiento tardío con vida y convivencia todo 2025", () => {
  const c = matrimonio()
  c.hijos[0]!.fechaNacimiento = "2025-12-31"
  expect(() => prepararConjunta2025(Schema.decodeUnknownSync(CasoConjunta2025)(c))).toThrow()
})

it("no admite inversión en la primera vivienda antes de adquirirla ni anticipos", () => {
  const h = vivienda()
  const anterior = h.historia.ejercicios.find(x => x.anio === 2009)!
  anterior.eventos.push({ tipo: "inversion_vivienda", inmueble: "V", documento: {
    referencia: "sintetico:inversion-imposible-2009", fecha: "2009-12-31", emisor: "Entidad ficticia",
  } })
  expect(() => producir(h)).toThrow()
})

it("un perceptor conserva bruto y SS: oráculo art19 en euros enteros", () => {
  const c = matrimonio()
  const t = c.economia.trabajo.rendimientos[0]!
  t.integro = "30000.00"
  t.cotizaciones.seguridadSocial = "1950.00"
  // 30000 - 1950 - 2000 = 26050; art20 no reduce este neto.
  const p = prepararConjunta2025(Schema.decodeUnknownSync(CasoConjunta2025)(c))
  expect(p.base.general.toFixed()).toBe("26050")
  expect(p.bruto.toFixed()).toBe("30000")
  expect(p.cotizaciones.toFixed()).toBe("1950")
})

it("crédito exclusivo de 90000 para compra de 100000 no prorratea cuotas al 90%", () => {
  // La disposición se destina íntegra a adquisición: 3000 + 50 = 3050.
  // 3050 * 3/40 = 915/4 por tramo; total 915/2.
  const l = producir(vivienda())
  const q = aplicarCuotasDT18(l, racional("1000"), racional("1000"))
  expect(q.estatal.total).toEqual(racional("915", "4"))
  expect(q.autonomica.total).toEqual(racional("915", "4"))
  expect(q.estatal.disponible).toEqual(racional("3085", "4"))
  expect(q.autonomica.disponible).toEqual(racional("3085", "4"))
})

it("cada tramo conserva exactamente un céntimo residual de cuota", () => {
  const l = producir(vivienda())
  // 228.76 - 228.75 = 0.01; otro tramo insuficiente no recibe el sobrante.
  const q = aplicarCuotasDT18(l, racional("5719", "25"), racional("1", "100"))
  expect(q.estatal.total).toEqual(racional("915", "4"))
  expect(q.estatal.disponible).toEqual(racional("1", "100"))
  expect(q.autonomica.total).toEqual(racional("1", "100"))
  expect(q.autonomica.disponible).toEqual(racional("0"))
})

it("censo bancario y préstamo no permiten intercambiar identidad de contribuyente", () => {
  const h = vivienda()
  h.persona = "otro-sujeto-sintetico"
  expect(() => producir(h)).toThrow()
})
