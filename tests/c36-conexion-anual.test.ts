import { describe, expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import {
  aplicarDeduccionesTerritoriales2025 as aplicar,
  SolicitudDeduccionesTerritoriales2025 as Solicitud,
} from "../lib/dominio/irpf/deducciones/anual-territorial"
import {
  liquidarIrpfAnual,
  liquidarIrpfAnualExplicito,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { limitarCandidatosC36 } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-limites"
import { prioridadC36 } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-adaptador"
import {
  magnitudesConexionC36 as m,
  donativoConexionC36 as don,
  viviendaConexionC36 as viv,
  magnitudesConFamiliaC36,
  nacimientoConexionC36,
  derechosConexionC36,
  casoUniformeC36,
  casoExplicitoC36,
} from "./c36-conexion-anual.fixtures"
import { familiarC, inversionC } from "./canarias-balears-ampliacion.fixtures"
import { InversionC36 } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-esquemas"
import { InversionEntidadCHechos } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-esquemas-base"

describe("C36: API única, sin magnitudes del cliente", () => {
  it("ecología deriva renta/cuota exactas del motor y genera100", () => {
    const r = aplicar({ solicitudes: [don()] }, m())
    expect(r.total).toEqual(racional("100"))
    expect(r.disponible).toEqual(racional("900"))
  })
  it("el octogésimo decimal de cuota llega al límite10% sin presentación", () => {
    const q = "700." + "0".repeat(79) + "1"
    const r = aplicar(
      { solicitudes: [don(undefined, "5000")] },
      { ...m(), cuotaAutonomica: new Decimal(q) }
    )
    expect(BigInt(r.total.numeradorEuros) * 10n ** 81n).toBe(
      (700n * 10n ** 80n + 1n) * BigInt(r.total.divisor)
    )
  })
  it.each([
    "baseGeneral",
    "baseLiquidableGeneral",
    "cuotaIntegraAutonomica",
    "magnitudes",
    "historico",
    "tipoMedioGravamen",
  ])("schema cerrado rechaza%s externo", (campo) => {
    const s = don()
    const r = Schema.decodeUnknownResult(Solicitud)(
      { solicitudes: [{ ...s, hechos: { ...s.hechos, [campo]: "100" } }] },
      { onExcessProperty: "error" }
    )
    expect(Result.isFailure(r)).toBe(true)
  })
  it("pago externo con fracción de céntimo sigue rechazado", () => {
    const s = don()
    const d = s.hechos.donaciones[0]
    const cambio = {
      ...s,
      hechos: {
        ...s.hechos,
        donaciones: [{ ...d, pagos: [{ ...d.pagos[0], importe: "1000.001" }] }],
      },
    }
    expect(() => aplicar({ solicitudes: [cambio] }, m())).toThrow(
      /soportad|inválid/
    )
  })
  it("otro pagador no se habilita por etiqueta de gasto común", () => {
    const s = don()
    const d = s.hechos.donaciones[0]
    const cambio = {
      ...s,
      hechos: {
        ...s.hechos,
        donaciones: [
          {
            ...d,
            pagos: [
              {
                ...d.pagos[0],
                pagador: "s-3",
                naturaleza: "comun" as const,
                distribucion: [
                  { persona: "s-1", porcentaje: "50" },
                  { persona: "s-3", porcentaje: "50" },
                ],
              },
            ],
          },
        ],
      },
    }
    expect(() => aplicar({ solicitudes: [cambio] }, m())).toThrow(/otro sujeto/)
  })
  it("factura repetida con IDs distintos no financia dos códigos", () => {
    const a = don(),
      b = don("canarias_donaciones_patrimonio_historico")
    const d = b.hechos.donaciones[0]
    const repetido = {
      ...b,
      hechos: {
        ...b.hechos,
        donaciones: [
          {
            ...d,
            pagos: [
              {
                ...d.pagos[0],
                factura: a.hechos.donaciones[0].pagos[0].factura,
              },
            ],
          },
        ],
      },
    }
    expect(() => aplicar({ solicitudes: [a, repetido] }, m())).toThrow(
      /reutilizado/
    )
  })
  it("no oculta un documento monetario cambiando factura por certificado", () => {
    const a = don(),
      b = don("canarias_donaciones_patrimonio_historico")
    const segundo = {
      ...b,
      hechos: {
        ...b.hechos,
        donaciones: b.hechos.donaciones.map((d) => ({
          ...d,
          certificado: a.hechos.donaciones[0].pagos[0].factura,
        })),
      },
    }
    expect(() => aplicar({ solicitudes: [a, segundo] }, m())).toThrow(
      /reutilizado/
    )
  })
  it("grupo canario15% limita100+100 a100+50 una sola vez", () => {
    const r = aplicar(
      {
        solicitudes: [
          viv("canarias_restauracion_bienes_interes_cultural", "1"),
          viv("canarias_rehabilitacion_energetica_vivienda", "2"),
        ],
      },
      m()
    )
    expect(r.total).toEqual(racional("150"))
    expect(r.aplicaciones.map((a) => a.aplicado)).toEqual([
      racional("100"),
      racional("50"),
    ])
    expect(r.limitesC36?.grupoCanarioRestante).toEqual(racional("0"))
  })
  it("no aplica dos deducciones canarias sobre el mismo inmueble", () => {
    const a = viv("canarias_restauracion_bienes_interes_cultural", "1"),
      b = viv("canarias_rehabilitacion_energetica_vivienda", "2")
    const repetido = {
      ...b,
      hechos: {
        ...b.hechos,
        viviendas: b.hechos.viviendas.map((v) => ({ ...v, catastro: "RC1" })),
      },
    }
    expect(() => aplicar({ solicitudes: [a, repetido] }, m())).toThrow(
      /mismo bien canario/
    )
  })
  it("lengua y mecenazgo cultural son incompatibles aunque cambie el beneficiario", () => {
    const a = don("balears_fomento_lengua_catalana"),
      b = don("balears_mecenazgo_cultural_cientifico_tecnologico")
    const d = b.hechos.donaciones[0],
      otro = {
        ...b,
        hechos: {
          ...b.hechos,
          donaciones: [
            {
              ...d,
              entidad: { ...d.entidad, nif: "OTRO" },
              pagos: d.pagos.map((p) => ({ ...p, perceptor: "OTRO" })),
            },
          ],
        },
      }
    expect(() =>
      aplicar({ solicitudes: [a, otro] }, m("illes-balears"))
    ).toThrow(/incompatibilidad.*5bis/)
  })
  it("normas por código, grupo y cuota global conservan fracciones exactas", () => {
    const r = limitarCandidatosC36(
      [racional("1", "3"), racional("1", "3")],
      [
        [{ grupo: "canarias_arts6_14_14bis_14ter", porcentaje: "15" }],
        [{ grupo: "canarias_arts6_14_14bis_14ter", porcentaje: "15" }],
      ],
      racional("1")
    )
    expect(r.importes).toEqual([racional("15", "100"), racional("0")])
    expect(r.ajustes[0].limitadoPorNorma).toEqual(racional("11", "60"))
  })
  it("cuota global cero es agotamiento, no un resultado por falta de productor", () => {
    const r = aplicar(
      { solicitudes: [don()] },
      { ...m(), cuotaAutonomica: new Decimal(0) }
    )
    expect(r.total).toEqual(racional("0"))
    expect(r.evaluaciones[0].resultado.estado).toBe("calculo_parcial")
  })
  it.each([
    "canarias_inversion_vivienda_habitual",
    "canarias_puesta_viviendas_mercado_arrendamiento",
    "balears_arrendador_vivienda_permanente_otros_gastos",
    "balears_arrendamiento_vivienda_habitual",
  ] as const)("%s sin histórico no recibe ceros", (codigo) => {
    const territorio = codigo.startsWith("canarias_")
      ? "canarias"
      : "illes-balears"
    expect(() =>
      aplicar({ solicitudes: [viv(codigo)] }, m(territorio))
    ).toThrow(/falta productor/)
  })
  it("R2: discapacidad propia no divide15000 por copropietarios", () => {
    const s = viv("canarias_adecuacion_vivienda_discapacidad")
    const v = s.hechos.viviendas[0]
    const solicitud = {
      ...s,
      hechos: {
        ...s.hechos,
        viviendas: [
          {
            ...v,
            propietarios: [
              { persona: "s-1", porcentaje: "50", titulo: "P1" },
              { persona: "s-9", porcentaje: "50", titulo: "P2" },
            ],
            gastos: [{ ...v.gastos[0], importe: "15000" }],
          },
        ],
      },
    }
    const ctx = m()
    const r = aplicar(
      { solicitudes: [solicitud] },
      {
        ...ctx,
        cuotaAutonomica: new Decimal(20000),
        caso: {
          ...ctx.caso,
          situacionFamiliar: {
            ...ctx.caso.situacionFamiliar,
            discapacidad: { _tag: "Discapacidad65OMas" },
          },
        },
      }
    )
    expect(r.total).toEqual(racional("2100"))
  })
  it("R2: un ascendiente en hechos no habilita la rama sin censo específico", () => {
    const s = viv("canarias_adecuacion_vivienda_discapacidad"),
      v = s.hechos.viviendas[0]
    const r = Schema.decodeUnknownResult(Solicitud)(
      {
        solicitudes: [
          {
            ...s,
            hechos: {
              ...s.hechos,
              viviendas: [
                {
                  ...v,
                  discapacidad: {
                    parentesco: "ascendiente",
                    persona: "s-9",
                    grado: 65,
                  },
                },
              ],
            },
          },
        ],
      },
      { onExcessProperty: "error" }
    )
    expect(Result.isFailure(r)).toBe(true)
  })
})

describe("C36: censo y vínculo v4, prioridades", () => {
  it("nacimiento antes del mecenazgo:800 y200 sobre una cuota1000", () => {
    const mecenazgo = don(
      "balears_mecenazgo_cultural_cientifico_tecnologico",
      "10000"
    )
    const d = mecenazgo.hechos.donaciones[0]
    const publico = {
      ...mecenazgo,
      hechos: {
        ...mecenazgo.hechos,
        donaciones: [
          {
            ...d,
            entidad: {
              ...d.entidad,
              clase: "administracion" as const,
              naturaleza: "publica" as const,
            },
          },
        ],
      },
    }
    const r = aplicar(
      { solicitudes: [publico, nacimientoConexionC36()] },
      magnitudesConFamiliaC36()
    )
    expect(r.codigos).toEqual([
      "balears_nacimiento",
      "balears_mecenazgo_cultural_cientifico_tecnologico",
    ])
    expect(r.aplicaciones.map((a) => a.aplicado)).toEqual([
      racional("800"),
      racional("200"),
    ])
    expect(r.total).toEqual(racional("1000"))
  })
  it("nacimiento sin registro de anticipos no presupone cero", () => {
    const s = nacimientoConexionC36()
    const { registroCobrosNacimiento: omitido, ...hechos } = s.hechos
    expect(omitido).toBeDefined()
    expect(() =>
      aplicar({ solicitudes: [{ ...s, hechos }] }, magnitudesConFamiliaC36())
    ).toThrow(/registro exhaustivo/)
  })
  it("nacimiento con cobro anticipado no ignora la regularización anual", () => {
    const s = nacimientoConexionC36()
    const hechos = {
      ...s.hechos,
      registroCobrosNacimiento: {
        consulta: "consulta-identificada",
        censo: "completo" as const,
        cobros: [
          {
            id: "abono-1",
            fecha: "2025-06-01",
            beneficiario: "s-1",
            resolucion: "resolucion-1",
            importe: "800",
          },
        ],
      },
    }
    expect(() =>
      aplicar({ solicitudes: [{ ...s, hechos }] }, magnitudesConFamiliaC36())
    ).toThrow(/existen anticipos/)
  })
  it("adopción tiene la misma prioridad legal, sin orden inventado entre ambas", () => {
    expect(prioridadC36({ lote: "C36", codigo: "balears_adopcion" })).toBe(0)
    expect(prioridadC36({ lote: "C36", codigo: "balears_nacimiento" })).toBe(0)
  })
  it("censo omitido se rechaza aunque la persona solicitada sí tenga mínimo", () => {
    const s = nacimientoConexionC36()
    expect(() =>
      aplicar(
        {
          solicitudes: [
            { ...s, hechos: { ...s.hechos, censoDescendientes: [] } },
          ],
        },
        magnitudesConFamiliaC36()
      )
    ).toThrow(/censo.*incompleto/)
  })
  it("hijo no puede ser el sujeto anual ni un familiar inventado", () => {
    const s = nacimientoConexionC36(),
      p = s.hechos.personas[0]
    for (const id of ["s-1", "s-99"])
      expect(() =>
        aplicar(
          {
            solicitudes: [
              { ...s, hechos: { ...s.hechos, personas: [{ ...p, id }] } },
            ],
          },
          magnitudesConFamiliaC36()
        )
      ).toThrow()
  })
  it("R1: no admite mínimo de otra relación ni progenitor inventado", () => {
    const s = nacimientoConexionC36()
    const r = Schema.decodeUnknownResult(Solicitud)(
      {
        solicitudes: [
          {
            ...s,
            hechos: {
              ...s.hechos,
              personas: [
                {
                  ...s.hechos.personas[0],
                  minimo: { relacion: "ascendiente" },
                  progenitores: ["s-1"],
                },
              ],
            },
          },
        ],
      },
      { onExcessProperty: "error" }
    )
    expect(Result.isFailure(r)).toBe(true)
  })
  it("R1: un nieto con mínimo anual no se convierte en hijo para libros", () => {
    const s = nacimientoConexionC36(),
      f = familiarC(),
      p = s.hechos.personas[0]
    const libro = {
      ...s,
      codigo: "balears_libros_texto" as const,
      hechos: {
        ...s.hechos,
        personas: [
          {
            ...p,
            convivencia: [{ desde: "2025-01-01", hasta: "2025-12-31" }],
            estudio: f.estudio,
            gastos: [
              {
                ...f.gastos[0],
                pagador: "s-1",
                distribucion: [{ persona: "s-1", porcentaje: "100" }],
              },
            ],
          },
        ],
      },
    }
    const c = magnitudesConFamiliaC36(),
      d = derechosConexionC36(),
      h = d.descendientes[0]
    const derechos = {
      ...d,
      descendientes: [
        {
          ...h,
          fechaNacimiento: "2018-01-01",
          edadDevengo: 7,
          titulares: h.titulares.map((t) => ({ ...t, grado: 2 })),
        },
      ],
    }
    expect(() =>
      aplicar(
        { solicitudes: [libro] },
        { ...c, caso: { ...c.caso, derechosMinimos: derechos } }
      )
    ).toThrow(/hijo/)
  })
  it("R1: sin mínimo derivado no basta el censo o la matrícula", () => {
    const s = nacimientoConexionC36(),
      f = familiarC(),
      c = magnitudesConFamiliaC36()
    const estudios = {
      ...s,
      codigo: "balears_estudios_superiores_fuera_isla" as const,
      hechos: {
        ...s.hechos,
        personas: s.hechos.personas.map((p) => ({
          ...p,
          estudio: { ...f.estudio, nivel: "universidad" as const },
        })),
      },
    }
    expect(() =>
      aplicar(
        { solicitudes: [estudios] },
        { ...c, sujetosConMinimo: [], atribucionesMinimo: [] }
      )
    ).toThrow(/sin mínimo/)
  })
  it("vínculo adoptivo no se puede declarar como nacimiento para recibir800", () => {
    const d = derechosConexionC36(),
      p = d.descendientes[0],
      t = p.titulares[0]
    const ctx = magnitudesConFamiliaC36()
    const derechos = {
      ...d,
      descendientes: [
        {
          ...p,
          titulares: [
            {
              ...t,
              vinculo: {
                clase: "adopcion" as const,
                fechaInicioIncremento: "2025-03-01",
                fechaConstitucionVinculo: "2025-03-01",
                fundamento: "inscripcion-registro-civil" as const,
                historialCompleto: true as const,
              },
            },
          ],
        },
      ],
    }
    expect(() =>
      aplicar(
        { solicitudes: [nacimientoConexionC36()] },
        { ...ctx, caso: { ...ctx.caso, derechosMinimos: derechos } }
      )
    ).toThrow(/vínculo/)
  })
  it("ELA requiere diagnóstico y pagos reales; no inventa un historial cero", () => {
    const s = nacimientoConexionC36()
    const ela = { ...s, codigo: "balears_gastos_ela" as const }
    expect(() =>
      aplicar({ solicitudes: [ela] }, magnitudesConFamiliaC36())
    ).toThrow(/gastos|diagnóstico/)
  })
  it("inversión balear nueva deriva cero anterior de fecha2025;2024 se rechaza", () => {
    const v = inversionC()
    v.entidad.domicilioFiscal = "illes-balears"
    v.entidad.domicilioSocial = "illes-balears"
    v.participaciones = [
      {
        ...v.participaciones[0],
        tenedores: [{ ...v.participaciones[0].tenedores[0], persona: "s-1" }],
      },
    ]
    const datos = Schema.decodeUnknownSync(InversionEntidadCHechos)(v)
    const s: typeof InversionC36.Type = {
      lote: "C36",
      codigo: "balears_inversion_entidades_nuevas_reciente_creacion",
      hechos: { inversiones: [datos], exhaustividad: "completa" },
    }
    expect(aplicar({ solicitudes: [s] }, m("illes-balears")).total).toEqual(
      racional("300")
    )
    const anterior = {
      ...s,
      hechos: { ...s.hechos, inversiones: [{ ...datos, fecha: "2024-01-01" }] },
    }
    expect(() =>
      aplicar({ solicitudes: [anterior] }, m("illes-balears"))
    ).toThrow(/aplicaciones2023\/2024/)
  })
})

describe("C36: las dos entradas públicas comparten la composición", () => {
  it("uniforme aplica100 exactos y reduce10000céntimos de cuota", () => {
    const c = casoUniformeC36(),
      sin = Effect.runSync(liquidarIrpfAnual(c, { modo: "canonico" })),
      con = Effect.runSync(
        liquidarIrpfAnual(
          { ...c, deduccionesTerritoriales2025: { solicitudes: [don()] } },
          { modo: "canonico" }
        )
      )
    expect(con.deduccionesTerritoriales2025?.total).toEqual(racional("100"))
    expect(sin.cuotaLiquidaCentimos - con.cuotaLiquidaCentimos).toBe(10000)
  })
  it("explícita y uniforme generan la misma deducción C36 sin cuota del cliente", () => {
    const s = don(),
      c = casoUniformeC36()
    const u = Effect.runSync(
      liquidarIrpfAnual(
        { ...c, deduccionesTerritoriales2025: { solicitudes: [s] } },
        { modo: "canonico" }
      )
    )
    const e = Effect.runSync(liquidarIrpfAnualExplicito(casoExplicitoC36([s])))
    expect(e.deduccionesTerritoriales2025?.total).toEqual(
      u.deduccionesTerritoriales2025?.total
    )
    expect(e.deduccionesTerritoriales2025?.total).toEqual(racional("100"))
  })
  it("ambas API rechazan sin impuesto cero la rama histórica de vivienda", () => {
    const s = viv("canarias_inversion_vivienda_habitual"),
      c = casoUniformeC36()
    const u = Effect.runSync(
      Effect.flip(
        liquidarIrpfAnual(
          { ...c, deduccionesTerritoriales2025: { solicitudes: [s] } },
          { modo: "canonico" }
        )
      )
    )
    const datos = casoExplicitoC36([])
    const e = Effect.runSync(
      Effect.flip(
        liquidarIrpfAnualExplicito({
          ...datos,
          deduccionesTerritoriales2025: { solicitudes: [s] },
        })
      )
    )
    expect(u._tag).toBe("ResultadoNoSoportado")
    expect(e._tag).toBe("ResultadoNoSoportado")
    expect(u.motivo).toMatch(/históric|anteriores/)
    expect(e.motivo).toMatch(/históric|anteriores/)
  })
})
