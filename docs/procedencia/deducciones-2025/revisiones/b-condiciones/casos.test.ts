import { describe, expect, it } from "vitest"
import lote from "../../lotes/b/dictamenes.json"
import complemento from "./citas-complementarias.json"
import { CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025 } from "../../../../../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/cantabria"
import { ASTURIAS_DEDUCCIONES_AUTONOMICAS_2025 } from "../../../../../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/asturias"
import {
  calcularDeduccionesAutonomicasAplicadas,
  calcularDeduccionesConsignadas,
} from "../../../../../lib/dominio/irpf/deducciones-autonomicas-aplicadas"

const fichas = [
  ...ASTURIAS_DEDUCCIONES_AUTONOMICAS_2025,
  ...CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025,
]

const textoFicha = (codigo: string) =>
  JSON.stringify(fichas.find((f) => f.codigo === codigo))

describe("discriminantes de la revisión de condiciones B", () => {
  for (const codigo of [
    "cantabria_arrendamiento_jovenes_mayores_discapacidad",
    "cantabria_nacimiento_adopcion_hijos",
  ]) {
    it(`${codigo}: rechaza la entrada histórica insuficiente`, () => {
      const entradas = {
        [`${codigo}:cumple`]: true,
        [`${codigo}:base`]: 6000,
        [`${codigo}:unidades`]: 1,
      }
      const ambito = { ejercicio: 2025, territorio: "cantabria" }
      expect(() =>
        calcularDeduccionesAutonomicasAplicadas(entradas, ambito)
      ).toThrow(RangeError)
      expect(calcularDeduccionesConsignadas(entradas, ambito)).toBe(0)
    })
  }

  it("la consignación de un exceso no demuestra cálculo fiscal", () => {
    const codigo = "cantabria_arrendamiento_jovenes_mayores_discapacidad"
    expect(
      calcularDeduccionesConsignadas(
        { [`${codigo}:cumple`]: true, [`${codigo}:importe`]: 900 },
        { ejercicio: 2025, territorio: "cantabria" }
      )
    ).toBe(900)
  })

  it("conserva la desigualdad estricta legal pese al texto distinto del manual", () => {
    const codigo = "cantabria_traslado_estudios_despoblamiento"
    expect(textoFicha(codigo)).toContain("rentas anuales inferiores a 8.000")
    const norma = lote.deducciones
      .find((r) => r.codigo === codigo)
      ?.citas.find((c) => c.id === "rb-1")
    expect(norma?.textoLiteral).toContain("iguales o superiores")
    expect(
      complemento.citas.find((c) => c.id === "rbc-manual-5")?.textoLiteral
    ).toContain("superior a 8.000")
  })

  it("las asimilaciones cántabras no autorizan conjunta estatal", () => {
    expect(textoFicha("cantabria_cuidado_familiares")).toContain(
      "no permite por sí sola tributar conjuntamente"
    )
  })

  it("inversión distingue PYME agregada, exclusión laboral y segundo grado", () => {
    const nueva = textoFicha(
      "cantabria_inversion_entidades_nuevas_reciente_creacion"
    )
    expect(nueva).toContain("asociadas y vinculadas")
    expect(nueva).toContain("Tampoco puede mantener una relación laboral")
    expect(
      textoFicha("cantabria_inversiones_nuevos_contribuyentes_extranjero")
    ).toContain("segundo grado")
    expect(
      textoFicha("asturias_inversion_entidades_nuevas_reciente_creacion")
    ).toContain("tercer grado")
  })

  it("limita la reserva etaria a una deducción", () => {
    const reservadas = lote.deducciones.filter((r) =>
      r.vigencia.reservas.some((s) => s.includes("solapamiento"))
    )
    expect(reservadas.map((r) => r.codigo)).toEqual([
      "asturias_gastos_vitales_hasta_35",
    ])
  })
})

describe("rojos documentales para recepción, sin modificar producto", () => {
  it("BC01: incluye hijo mayor con curatela representativa", () => {
    expect(
      complemento.citas.find((c) => c.id === "rbc-manual-3")?.textoLiteral
    ).toContain("curatela")
    expect(textoFicha("cantabria_familias_monoparentales")).toContain(
      "curatela representativa"
    )
  })

  it("BC02: registra la discrepancia del manual en el umbral de estudios", () => {
    const manual = lote.deducciones.find(
      (r) => r.codigo === "cantabria_traslado_estudios_despoblamiento"
    )?.manual
    expect(manual?.discrepancias.join(" ")).toMatch(/8[. ]?000/)
  })
})
