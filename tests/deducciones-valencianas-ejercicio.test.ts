import { expect, it } from "vitest"
import {
  componerDeduccionesValencianas2025,
  evaluarDeduccionValenciana2025,
  type ComposicionValenciana2025,
  type HechosValencianos2025,
} from "../lib/dominio/irpf/deducciones/valenciana-2025"

const codigo = "valenciana_dana_aportaciones_fondos_propios_entidades"
const hechos = (fecha: string): HechosValencianos2025 => ({
  codigo,
  ejercicio: 2025,
  territorio: "comunitat-valenciana",
  contribuyente: "A",
  declarantes: ["A"],
  modalidad: "individual",
  devengo: "2025-12-31",
  liquidableGeneral: 2000,
  liquidableAhorro: 0,
  imponibleGeneral: 2000,
  imponibleAhorro: 0,
  unidades: [
    {
      id: "aportacion",
      titulares: ["A"],
      fecha,
      numeros: { inversionDesembolsada: 300 },
      textos: {
        municipio: "anexo_fiscal",
        anexoFiscalAcuerdo4nov2024: "declarado",
        entidad: "nueva",
        domiciliosSocialFiscalYMantenimiento: "declarado",
      },
    },
  ],
})
const composicion = (fecha: string): ComposicionValenciana2025 => ({
  ejercicio: 2025,
  territorio: "comunitat-valenciana",
  modalidad: "individual",
  devengo: "2025-12-31",
  contribuyente: "A",
  bases: {
    liquidableGeneral: 2000,
    liquidableAhorro: 0,
    imponibleGeneral: 2000,
    imponibleAhorro: 0,
  },
  cantidades: [{ id: "g1", euros: 300 }],
  solicitudes: [
    {
      codigo,
      eleccion: "aplicar",
      unidades: hechos(fecha).unidades,
      referencias: [
        {
          unidad: "aportacion",
          sujetos: ["A"],
          bienes: ["entidad"],
          eventos: ["desembolso"],
          cantidades: ["g1"],
        },
      ],
    },
  ],
  ordenBase30: [],
  consignaciones: [],
})

// DL 12/2024, art. 5.3 (DF 1 DL 17/2024): generación en el ejercicio
// de la aportación; sólo la insuficiencia de cuota permite arrastre identificado.
it.each(["2024-11-13", "2024-12-01", "2024-12-31"])(
  "C01: no regenera en 2025 una aportación de %s",
  (fecha) => {
    const individual = evaluarDeduccionValenciana2025(hechos(fecha))
    expect(individual.estado).toBe("excluida")
    expect(individual).not.toHaveProperty("importe")
    const agregado = componerDeduccionesValencianas2025(composicion(fecha))
    expect(agregado.estado).toBe("no_soportado")
    expect(agregado).not.toHaveProperty("totalParcialAntesCuota")
    expect(agregado.resultados[0]!.resultado.motivo).toContain("fuera de 2025")
  }
)
it.each(["2025-01-01", "2025-12-31"])(
  "conserva generación corriente de %s",
  (fecha) => {
    expect(evaluarDeduccionValenciana2025(hechos(fecha))).toMatchObject({
      estado: "calculo_parcial",
      importe: 135,
    })
    expect(
      componerDeduccionesValencianas2025(composicion(fecha))
    ).toMatchObject({ estado: "calculo_parcial", totalParcialAntesCuota: 135 })
  }
)
it("el saldo identificado de 2024 permanece separado de la generación de 2025", () => {
  const entrada: ComposicionValenciana2025 = {
    ...composicion("2025-01-01"),
    cuota: {
      disponible: 200,
      referencia: "sintetico:cuota",
      arrastres: [
        {
          id: "saldo-2024",
          codigo,
          contribuyente: "A",
          origen: 2024,
          pendiente: 50,
          soporte: "sintetico:saldo-2024",
        },
      ],
    },
  }
  const resultado = componerDeduccionesValencianas2025(entrada)
  expect(resultado.totalParcialAntesCuota).toBe(135)
  expect(resultado.cuotaSinAplicar).toEqual(entrada.cuota)
})
