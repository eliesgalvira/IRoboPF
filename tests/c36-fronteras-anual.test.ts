import { expect, it } from "vitest"
import { aplicarDeduccionesTerritoriales2025 as aplicar } from "../lib/dominio/irpf/deducciones/anual-territorial"
import {
  magnitudesConexionC36 as marco,
  magnitudesConFamiliaC36 as familia,
  viviendaConexionC36 as vivienda,
  nacimientoConexionC36 as nacimiento,
  donativoConexionC36 as donativo,
  derechosConexionC36 as derechos,
} from "./c36-conexion-anual.fixtures"

it.each([
  "canarias_inversion_vivienda_habitual",
  "canarias_adecuacion_inmueble_arrendamiento",
  "canarias_puesta_viviendas_mercado_arrendamiento",
  "balears_arrendador_vivienda_permanente_otros_gastos",
  "balears_arrendamiento_vivienda_habitual",
] as const)("productor ausente no habilita %s", (codigo) => {
  expect(() =>
    aplicar(
      { solicitudes: [vivienda(codigo)] },
      marco(codigo.startsWith("canarias_") ? "canarias" : "illes-balears")
    )
  ).toThrow(/falta productor/)
})

it("hogar no infiere separación de bienes de una declaración individual", () => {
  const s = nacimiento()
  expect(() =>
    aplicar(
      {
        solicitudes: [
          { ...s, codigo: "canarias_cuotas_seguridad_social_empleados_hogar" },
        ],
      },
      marco()
    )
  ).toThrow(/régimen matrimonial/)
})

it("adopción concilia el vínculo pero no supone exclusión de pareja ni anticipos", () => {
  const s = nacimiento(),
    m = familia(),
    d = derechos(),
    hijo = d.descendientes[0]
  const v4 = {
    ...d,
    descendientes: [
      {
        ...hijo,
        titulares: hijo.titulares.map((t) => ({
          ...t,
          vinculo: {
            clase: "adopcion" as const,
            fechaInicioIncremento: "2025-03-01",
            fechaConstitucionVinculo: "2025-03-01",
            fundamento: "inscripcion-registro-civil" as const,
            historialCompleto: true as const,
          },
        })),
      },
    ],
  }
  expect(() =>
    aplicar(
      {
        solicitudes: [
          {
            ...s,
            codigo: "balears_adopcion",
            hechos: {
              ...s.hechos,
              personas: s.hechos.personas.map((p) => ({
                ...p,
                inscripcionCivil: "2025-03-01",
              })),
            },
          },
        ],
      },
      { ...m, caso: { ...m.caso, derechosMinimos: v4 } }
    )
  ).toThrow(/falta productor de exclusión/)
})

it("emergencias no convierte ayuda recibida en importe integrado ni tipo legal", () => {
  expect(() =>
    aplicar(
      {
        solicitudes: [
          {
            lote: "C36",
            codigo: "balears_subvenciones_zona_emergencia_proteccion_civil",
            hechos: {
              ayudas: [
                {
                  id: "ayuda-1",
                  concedente: "comunidad_illes_balears",
                  acuerdoConsejoMinistros: "acuerdo-1",
                  resolucion: "resolucion-1",
                  importeRecibido: "1000",
                },
              ],
              exhaustividad: "completa",
            },
          },
        ],
      },
      marco("illes-balears")
    )
  ).toThrow(/falta productor anual de integración/)
})

it("base liquidable ausente no se sustituye por cero", () => {
  const { basesLiquidables: omitida, ...m } = marco()
  expect(omitida).toBeDefined()
  expect(() => aplicar({ solicitudes: [donativo()] }, m)).toThrow(
    /falta productor de base liquidable/
  )
})

it("censo v4 de otro territorio no pertenece a la misma anual", () => {
  const m = familia()
  expect(() =>
    aplicar(
      { solicitudes: [donativo("balears_fomento_lengua_catalana")] },
      {
        ...m,
        caso: {
          ...m.caso,
          derechosMinimos: { ...derechos(), territorio: "canarias" },
        },
      }
    )
  ).toThrow(/Censo C36 contradictorio/)
})

it("edad nativa del contribuyente debe coincidir con el caso anual", () => {
  const m = familia()
  expect(() =>
    aplicar(
      { solicitudes: [donativo("balears_fomento_lengua_catalana")] },
      {
        ...m,
        caso: {
          ...m.caso,
          derechosMinimos: { ...derechos(), edadContribuyenteDevengo: 41 },
        },
      }
    )
  ).toThrow(/Censo C36 contradictorio/)
})

it("discapacidad nativa del contribuyente debe coincidir con el caso anual", () => {
  const m = familia()
  expect(() =>
    aplicar(
      { solicitudes: [donativo("balears_fomento_lengua_catalana")] },
      {
        ...m,
        caso: {
          ...m.caso,
          derechosMinimos: {
            ...derechos(),
            discapacidadContribuyente: { _tag: "Discapacidad65OMas" },
          },
        },
      }
    )
  ).toThrow(/Censo C36 contradictorio/)
})
