import Decimal from "decimal.js"
import { Effect } from "effect"
import { expect, it } from "vitest"
import { fixture } from "./madrid-historia-fixtures"
import { casoUniformeC36, casoExplicitoC36 } from "./c36-conexion-anual.fixtures"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual"
import { aplicarDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"

// Independiente de fixtures y oráculos nuevos de B02. Sólo hechos, nunca bases externas.
function renombrar<T>(x: T, ids: Readonly<Record<string, string>>): T {
  const texto = Object.entries(ids).reduce((serializado, [origen, destino]) =>
    serializado.replaceAll(JSON.stringify(origen), JSON.stringify(destino)), JSON.stringify(x))
  // SAFETY: fixtures JSON sin clases; sólo se sustituyen tokens completos de identificadores,
  // nunca claves de este contrato ni valores monetarios; la estructura T queda intacta.
  return JSON.parse(texto) as T
}
function hogar(dos = false, adopcion23 = false, adopcion24 = false, alias = false) {
  const f = fixture(2023, dos, false, adopcion23)
  const g = fixture(2024, dos, false, adopcion24)
  const segundo = renombrar(g.s, { "s-2": "s-4" })
  const derecho = renombrar(g.m.caso.derechosMinimos!.descendientes[0]!, { "s-2": "s-4" })
  const a = f.s.auxiliares!, b = segundo.auxiliares!
  const h = f.s.historiaNacimientoMadrid!, nuevo = segundo.historiaNacimientoMadrid!.periodos[0]!
  let s: typeof f.s = { ...f.s, auxiliares: { ...a,
    miembrosUnidad: [...a.miembrosUnidad, "s-4"],
    progenitores: [...a.progenitores, ...b.progenitores],
    eventos: [a.eventos[0]!, { ...b.eventos[0]!, id: "segundo-origen" }],
  }, historiaNacimientoMadrid: { ...h, periodos: h.periodos.map(p => p.ejercicio === 2023 ? p : {
    ...p, hijos: [...p.hijos, ...nuevo.hijos],
    personas: [...p.personas, nuevo.personas.find(p => p.id === "s-4")!],
  }) } }
  let derechos = { ...f.m.caso.derechosMinimos!, descendientes: [
    ...f.m.caso.derechosMinimos!.descendientes, derecho,
  ] }
  if (alias) {
    // Cambia también al declarante, sin suponer sufijos s-1/s-2 en el motor.
    const ids = { "s-1": "s-71", "s-2": "s-84", "s-3": "s-96", "s-4": "s-52" }
    s = renombrar(s, ids); derechos = renombrar(derechos, ids)
  }
  const propio = derechos.contribuyenteId
  const hijos = derechos.descendientes.map(d => d.sujetoId)
  const m = { ...f.m, caso: { ...f.m.caso, contribuyenteId: propio, derechosMinimos: derechos },
    sujetosConMinimo: hijos, atribucionesMinimo: hijos.map(sujetoId => ({ sujetoId,
      titulares: derechos.descendientes.find(d => d.sujetoId === sujetoId)!.titulares.map(t => t.titularId),
    })) }
  return { s, m, trabajo: f.trabajo }
}
type Hogar = ReturnType<typeof hogar>
function bruto(f: Hogar, ejercicio: 2023 | 2024, importe: string): Hogar {
  const h = f.s.historiaNacimientoMadrid!
  return { ...f, s: { ...f.s, historiaNacimientoMadrid: { ...h, periodos: h.periodos.map(p =>
    p.ejercicio !== ejercicio ? p : { ...p, personas: p.personas.map(x =>
      x.id !== f.m.caso.contribuyenteId ? x : { ...x, economia: {
        perfil: "solo-trabajo" as const, censoRentasCompleto: true as const,
        otrasRentas: "ninguna" as const, reduccionesBase: "ninguna" as const,
        saldosAnteriores: "ninguno" as const, trabajo: { ...f.trabajo, ejercicio,
          rendimientos: f.trabajo.rendimientos.map(t => ({ ...t, integro: importe })),
        },
      } }),
    }) } } }
}
// Oráculo racional propio: no importa racional/sumar/menor ni cuantías del candidato.
type Q = { n: bigint; d: bigint }
const q = (s: string): Q => {
  const [a, b = ""] = s.split(".")
  return { n: BigInt(a + b), d: 10n ** BigInt(b.length) }
}
const sub = (a: Q, b: Q): Q => ({ n: a.n * b.d - b.n * a.d, d: a.d * b.d })
const min = (a: Q, b: Q): Q => a.n * b.d <= b.n * a.d ? a : b
function igual(actual: { numeradorEuros: string; divisor: string } | undefined, esperado: Q) {
  expect(actual).toBeDefined()
  const n = q(actual!.numeradorEuros), d = q(actual!.divisor)
  expect(n.n * d.d * esperado.d).toBe(esperado.n * n.d * d.n)
}
function nominal(dos: boolean, origenes = 2): Q {
  return { n: 72170n * BigInt(origenes), d: 100n * (dos ? 2n : 1n) }
}

for (const dos of [false, true]) for (const alias of [false, true])
  for (const adopcion of [false, true]) for (const cuota of ["0", "0.01", "360.849", "360.85", "721.69", "721.70", "1000", "1443.40", "2000"])
    it(`Revisión B02 cuota y residual único ${dos}/${alias}/${adopcion}/${cuota}`, () => {
      const f = hogar(dos, adopcion, adopcion, alias)
      const disponible = q(cuota), generado = nominal(dos), aplicado = min(disponible, generado)
      const r = aplicarDeduccionesTerritoriales2025({ solicitudes: [f.s] }, { ...f.m,
        cuotaAutonomica: new Decimal("3000"), cuotaAutonomicaResidual: new Decimal(cuota) })
      igual(r.total, aplicado); igual(r.disponible, sub(disponible, aplicado))
      expect(r.aplicaciones).toHaveLength(1)
      const a = r.aplicaciones[0]!
      igual(a.generado, generado); igual(a.aplicado, aplicado)
      igual(a.pendiente, sub(generado, aplicado)); expect(a).not.toHaveProperty("arrastre")
    })

for (const dos of [false, true]) for (const alias of [false, true])
  it(`Revisión B02 origen inválido no contamina, intermedio conserva rechazo ${dos}/${alias}`, () => {
    for (const [b23, b24, estado, origenes] of [
      ["32930", "32930", "calculo_parcial", 2],
      ["32930.01", "32930", "calculo_parcial", 1],
      ["32930", "32930.01", "no_soportado", 0],
      ["32930.01", "32930.01", "excluida", 0],
    ] as const) {
      const f = bruto(bruto(hogar(dos, true, true, alias), 2023, b23), 2024, b24)
      const r = evaluarAnualF2025(f.s, f.m)
      expect(r.estado).toBe(estado)
      if (estado === "calculo_parcial") igual(r.importeExactoRacional, nominal(dos, origenes))
      if (estado === "no_soportado") expect(r.siguienteHecho).toBe("historia:2024:criterio_anualidad_intermedia")
    }
  })

for (const dos of [false, true]) it(`Revisión B02 no omite hechos del origen sin derecho ${dos}`, () => {
  const f = bruto(hogar(dos, true, true), 2023, "32930.01"), a = f.s.auxiliares!
  const s = { ...f.s, auxiliares: { ...a, eventos: a.eventos.map(e =>
    e.fecha.startsWith("2023") ? { ...e, fecha: "2023-03-01" } : e) } }
  const r = evaluarAnualF2025(s, f.m)
  expect(r.estado).toBe("no_soportado"); expect(r.siguienteHecho).toBe("evento.vinculo_fecha")
})

it("Revisión B02 adopción2024 de nacido2020 no pertenece al censo2023", () => {
  const f = hogar(true, false, true), h = f.s.historiaNacimientoMadrid!
  igual(evaluarAnualF2025(f.s, f.m).importeExactoRacional, nominal(true))
  const p24 = h.periodos.find(p => p.ejercicio === 2024)!
  const s = { ...f.s, historiaNacimientoMadrid: { ...h, periodos: h.periodos.map(p => p.ejercicio !== 2023 ? p : {
    ...p, hijos: p24.hijos, personas: p24.personas,
  }) } }
  const r = evaluarAnualF2025(s, f.m)
  expect(r.estado).toBe("no_soportado"); expect(r.siguienteHecho).toBe("historia:2023:censo")
})

for (const api of ["canonica", "explicita"] as const) for (const dos of [false, true])
  for (const alias of [false, true]) for (const escasa of [false, true])
    it(`Revisión B02 API y descuento final único ${api}/${dos}/${alias}/${escasa}`, () => {
      // 18.500 bruto busca cuota escasa también con reparto; la aserción lo exige.
      const f = hogar(dos, true, true, alias), integro = escasa ? 18500 : 32000
      const renta = api === "canonica" ? integro * 100 - (integro + 2000) * 648 / 100 : integro * 100 - 200000
      const derechosMinimos = { ...f.m.caso.derechosMinimos!, descendientes:
        f.m.caso.derechosMinimos!.descendientes.map(d => ({ ...d, titulares: d.titulares.map(t => ({ ...t,
          rentasNoExentasCentimos: t.titularId === f.m.caso.contribuyenteId ? renta : t.rentasNoExentasCentimos,
        })) })) }
      const comunes = { comunidadAutonoma: "madrid" as const, contribuyenteId: f.m.caso.contribuyenteId, derechosMinimos }
      const solicitudes = { solicitudes: [f.s] }
      if (api === "canonica") {
        const c = { ...casoUniformeC36(), ...comunes,
          rendimientos: { trabajo: [{ importeIntegroCentimos: (integro + 2000) * 100 }] } }
        const base = Effect.runSync(liquidarIrpfAnual(c, { modo: "canonico" }))
        const r = Effect.runSync(liquidarIrpfAnual({ ...c, deduccionesTerritoriales2025: solicitudes }, { modo: "canonico" }))
        if (base._tag !== "LiquidacionIrpfAnualCalculada" || r._tag !== "LiquidacionIrpfAnualCalculada")
          throw new Error("Se requiere liquidación canónica completa")
        const libro = r.deduccionesTerritoriales2025
        if (libro === undefined || !("saldoEjercicio" in libro) || libro.saldoEjercicio === undefined)
          throw new Error("Falta libro territorial F")
        const inicial = libro.saldoEjercicio.cuotaInicial
        const qi = { n: BigInt(inicial.numeradorEuros), d: BigInt(inicial.divisor) }
        const esperado = min(qi, nominal(dos))
        igual(libro.total, esperado)
        expect(libro.aplicaciones).toHaveLength(1)
        expect(escasa ? qi.n * nominal(dos).d < nominal(dos).n * qi.d : qi.n * nominal(dos).d >= nominal(dos).n * qi.d).toBe(true)
        const centimos = Number((esperado.n * 100n * 2n + esperado.d) / (2n * esperado.d))
        expect(r.deduccionesAutonomicasCentimos).toBe(centimos)
        // Redondear el total antes/después puede diferir un céntimo al restar.
        expect(Math.abs(base.cuotaLiquidaCentimos - r.cuotaLiquidaCentimos - centimos)).toBeLessThanOrEqual(1)
        expect(base.cuotaLiquidaCentimos - r.cuotaLiquidaCentimos).toBe(base.cuotaDiferencialCentimos - r.cuotaDiferencialCentimos)
      } else {
        const c0 = casoExplicitoC36([])
        const c = { ...c0, ...comunes, familiaresConDerechoMinimo: "segun-derechos" as const,
          trabajo: { ...c0.trabajo, rendimientos: c0.trabajo.rendimientos.map(t => ({ ...t, integro: String(integro) })) } }
        const base = Effect.runSync(liquidarIrpfAnualExplicito(c))
        const r = Effect.runSync(liquidarIrpfAnualExplicito({ ...c, deduccionesTerritoriales2025: solicitudes }))
        const qi = q(r.componentesCuota.cuotaAutonomica), esperado = min(qi, nominal(dos))
        igual(r.deduccionesTerritoriales2025!.total, esperado)
        expect(escasa ? qi.n * nominal(dos).d < nominal(dos).n * qi.d : qi.n * nominal(dos).d >= nominal(dos).n * qi.d).toBe(true)
        const dif = new Decimal(base.cuotaLiquidaLegal).minus(r.cuotaLiquidaLegal)
        const delta = new Decimal(base.cuotaDiferencial).minus(r.cuotaDiferencial)
        expect(dif.times(String(esperado.d)).toFixed()).toBe(String(esperado.n))
        expect(delta.toFixed()).toBe(dif.toFixed())
      }
    })

for (const mutacion of ["declarante", "hijo", "vinculo", "persona", "unidad"] as const)
  it(`Revisión B02 identidades y filiación adversas ${mutacion}`, () => {
    const f = hogar(true, true, true, true), h = f.s.historiaNacimientoMadrid!
    const s = { ...f.s, historiaNacimientoMadrid: { ...h,
      contribuyente: mutacion === "declarante" ? "s-99" : h.contribuyente,
      periodos: h.periodos.map(p => p.ejercicio !== 2024 ? p : { ...p,
        personas: mutacion === "persona" ? [...p.personas, { ...p.personas[0]!, id: "s-99" }] : p.personas,
        hijos: p.hijos.map((x, i) => i !== 1 ? x : { ...x,
          id: mutacion === "hijo" ? "s-99" : x.id,
          convivientesDevengo: mutacion === "unidad" ? ["s-99"] : x.convivientesDevengo,
          vinculos: mutacion === "vinculo" ? x.vinculos.map(v => ({ ...v, constitucion: "2023-02-01" })) : x.vinculos,
        }),
      }),
    } }
    expect(evaluarAnualF2025(s, f.m).estado).toBe("no_soportado")
  })
