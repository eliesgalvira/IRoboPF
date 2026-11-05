import { describe, expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { aplicarDeduccionesTerritoriales2025 as aplicar, SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { FamiliaC36 } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-esquemas"
import { RegistroHogarC36 } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-hogar"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { magnitudesConexionC36, nacimientoConexionC36, casoUniformeC36, casoExplicitoC36, derechosConexionC36 } from "./c36-conexion-anual.fixtures"

type AyudaHogar = typeof RegistroHogarC36.Type["contratos"][number]["cuotas"][number]["ayudas"][number]
type Regimen = typeof RegistroHogarC36.Type["civil"]["regimen"]
function hogar(regimen: Regimen = "sin_matrimonio", importe = "1000.01", edad = 75) {
  const f = nacimientoConexionC36()
  const ayudas: AyudaHogar[] = []
  return {
    lote: "C36" as const,
    codigo: "canarias_cuotas_seguridad_social_empleados_hogar" as const,
    hechos: {
      ...f.hechos,
      contribuyente: { ...f.hechos.contribuyente, nacimientoContribuyente: `${2025 - edad}-01-01` },
      personas: [], censoDescendientes: [], cuotasHogar: [],
      registroHogar: {
        consulta: "TGSS-CIVIL-2025", censo: "completo_cuotas_pagos_ayudas_altas_2025" as const,
        civil: { desde: "2025-01-01", hasta: "2025-12-31", documento: "RC-capitulaciones", regimen, conyuge: regimen === "sin_matrimonio" ? "" : "s-3" },
        contratos: [{ id: "empleo-1", empleador: "s-1", empleado: "12345678Z",
          vivienda: { id: "RC-habitual", ocupante: "s-1", desde: "2020-01-01", hasta: "2025-12-31", documento: "padron" },
          altas: [{ desde: "2025-01-01", hasta: "2025-12-31", empleador: "s-1", empleado: "12345678Z", vivienda: "RC-habitual", documento: "alta-1", sistema: "especial_empleados_hogar" as const }],
          cuotas: [{ desde: "2025-01-01", hasta: "2025-01-31", censoAyudas: "completo" as const,
            ayudas,
            pago: { id: "p-1", fecha: "2025-02-01", pagador: "s-1", perceptor: "TGSS", factura: "recibo-1", importe, ayudasExentas: "0", reembolsos: "0", medio: "transferencia" as const },
          }],
        }],
      },
    },
  } satisfies typeof FamiliaC36.Type
}
function magnitudes(edad = 75) {
  const m = magnitudesConexionC36()
  return { ...m, caso: { ...m.caso, situacionFamiliar: { ...m.caso.situacionFamiliar, edad } } }
}
function total(s: typeof FamiliaC36.Type, edad = 75) {
  return aplicar({ solicitudes: [s] }, magnitudes(edad)).total
}
describe("Canarias hogar: productor primario sin motor paralelo", () => {
  it.each(["sin_matrimonio", "separacion"] as const)("%s atribuye todo y conserva milésima de euro", regimen => {
    expect(total(hogar(regimen))).toEqual({ numeradorEuros: "100001", divisor: "500" })
  })
  it("gananciales atribuye mitad antes del20%, sin derechos del cónyuge", () => {
    expect(total(hogar("gananciales"))).toEqual({ numeradorEuros: "100001", divisor: "1000" })
  })
  it.each(["2500", "2500.01", "10000"])("límite500 sobre%s", importe => expect(total(hogar("sin_matrimonio", importe))).toEqual(racional("500")))
  it("dos empleados comparten el límite500 por contribuyente", () => {
    const s = hogar("sin_matrimonio", "1500"), c = structuredClone(s.hechos.registroHogar.contratos[0])
    c.id = "empleo-2"; c.empleado = "87654321X"; c.altas[0].empleado = c.empleado; c.altas[0].documento = "alta-2"
    c.cuotas[0].pago.id = "p-2"; c.cuotas[0].pago.factura = "recibo-2"
    s.hechos.registroHogar.contratos.push(c)
    expect(total(s)).toEqual(racional("500"))
  })
  it("ayuda exenta identificada reduce base antes del reparto", () => {
    const s = hogar("gananciales", "1000")
    const q = s.hechos.registroHogar.contratos[0].cuotas[0]
    q.pago.ayudasExentas = "100"
    q.ayudas.push({ id: "ayuda-1", resolucion: "res-1", concedente: "administracion-canaria", concesion: "2025-06-01", importe: "100", exenta: "si" })
    expect(total(s)).toEqual(racional("90"))
  })
  it.each([65, 66, 74, 75])("umbral%s sin descendientes ni discapacidad", edad => {
    if (edad < 75) expect(() => total(hogar("sin_matrimonio", "1000", edad), edad)).toThrow(/habilitante/)
    else expect(total(hogar("sin_matrimonio", "1000", edad), edad)).toEqual(racional("200"))
  })
  it.each([65, 66])("discapacidad65 edad%s exige mayor de65", edad => {
    const s = hogar("separacion", "1000", edad)
    s.hechos.contribuyente.resolucionDiscapacidad = "certificado"
    const m = magnitudes(edad)
    const ctx = { ...m, caso: { ...m.caso, situacionFamiliar: { ...m.caso.situacionFamiliar, discapacidad: { _tag: "Discapacidad65OMas" as const } } } }
    if (edad === 65) expect(() => aplicar({ solicitudes: [s] }, ctx)).toThrow(/habilitante/)
    else expect(aplicar({ solicitudes: [s] }, ctx).total).toEqual(racional("200"))
  })
  it.each(["fisica_sensorial", "psiquica"] as const)("grado33 y66 años: naturaleza%s", naturaleza => {
    const s = hogar("separacion", "1000", 66), m = magnitudes(66)
    s.hechos.contribuyente.naturalezaDiscapacidad = naturaleza
    s.hechos.contribuyente.resolucionDiscapacidad = "certificado33"
    const ctx = { ...m, caso: { ...m.caso, situacionFamiliar: { ...m.caso.situacionFamiliar, discapacidad: { _tag: "Discapacidad33a64" as const, necesitaAyudaOMovilidadReducida: false } } } }
    if (naturaleza === "psiquica") expect(aplicar({ solicitudes: [s] }, ctx).total).toEqual(racional("200"))
    else expect(() => aplicar({ solicitudes: [s] }, ctx)).toThrow(/habilitante/)
  })
  it("derecho propio por descendiente y trabajo se concilia con núcleo", () => {
    const s = hogar("sin_matrimonio", "1000", 40), f = nacimientoConexionC36(), d = derechosConexionC36(), m = magnitudes(40)
    const solicitud = { ...s, hechos: { ...s.hechos, personas: f.hechos.personas, censoDescendientes: ["s-2"] } }
    const ctx = { ...m, caso: { ...m.caso, derechosMinimos: { ...d, territorio: "canarias" as const } }, sujetosConMinimo: ["s-2"], atribucionesMinimo: [{ sujetoId: "s-2", titulares: ["s-1"] }] }
    expect(aplicar({ solicitudes: [solicitud] }, ctx).total).toEqual(racional("200"))
    expect(() => aplicar({ solicitudes: [solicitud] }, { ...ctx, rentasTrabajoAnuales: { integroTrabajo: new Decimal(0), restoRentas: new Decimal(0) } })).toThrow(/habilitante/)
    expect(() => aplicar({ solicitudes: [solicitud] }, { ...ctx, sujetosConMinimo: [], atribucionesMinimo: [] })).toThrow(/mínimo|habilitante/)
  })
  it.each(["extranjero", "herencia", "cambio_intranual"] as const)("%s no se convierte en cero", regimen => expect(() => total(hogar(regimen))).toThrow(/falta productor/))
  it.each([
    ["empleador ajeno", (s: ReturnType<typeof hogar>) => { s.hechos.registroHogar.contratos[0].empleador = "s-9" }],
    ["pago ajeno", (s: ReturnType<typeof hogar>) => { s.hechos.registroHogar.contratos[0].cuotas[0].pago.pagador = "s-9" }],
    ["fecha imposible", (s: ReturnType<typeof hogar>) => { s.hechos.registroHogar.contratos[0].cuotas[0].pago.fecha = "2025-02-30" }],
    ["pago fuera2025", (s: ReturnType<typeof hogar>) => { s.hechos.registroHogar.contratos[0].cuotas[0].pago.fecha = "2026-01-01" }],
    ["alta insuficiente", (s: ReturnType<typeof hogar>) => { s.hechos.registroHogar.contratos[0].altas[0].desde = "2025-01-02" }],
    ["vivienda ajena", (s: ReturnType<typeof hogar>) => { s.hechos.registroHogar.contratos[0].vivienda.ocupante = "s-9" }],
    ["ayuda omitida", (s: ReturnType<typeof hogar>) => { s.hechos.registroHogar.contratos[0].cuotas[0].pago.ayudasExentas = "100" }],
    ["civil parcial", (s: ReturnType<typeof hogar>) => { s.hechos.registroHogar.civil.desde = "2025-02-01" }],
    ["cuota duplicada con recibo nuevo", (s: ReturnType<typeof hogar>) => { const c = s.hechos.registroHogar.contratos[0]; const q = structuredClone(c.cuotas[0]); q.pago.id = "p-2"; q.pago.factura = "f-2"; c.cuotas.push(q) }],
  ] as const)("rechaza%s", (_nombre, cambiar) => { const s = hogar(); cambiar(s); expect(() => total(s)).toThrow() })
  it("contrato cerrado rechaza reparto fiscal del cliente", () => {
    const s = hogar(), q = s.hechos.registroHogar.contratos[0].cuotas[0]
    const r = Schema.decodeUnknownResult(SolicitudDeduccionesTerritoriales2025)({ solicitudes: [{ ...s, hechos: { ...s.hechos, registroHogar: { ...s.hechos.registroHogar, contratos: [{ ...s.hechos.registroHogar.contratos[0], cuotas: [{ ...q, pago: { ...q.pago, distribucion: [{ persona: "s-1", porcentaje: "100" }] } }] }] } } }] }, { onExcessProperty: "error" })
    expect(Result.isFailure(r)).toBe(true)
  })
  it("no acumula asistencia y hogar sobre mismas cuotas", () => {
    const s = hogar(), asistencia = { ...s, codigo: "canarias_familiares_dependientes_discapacidad" as const }
    expect(() => aplicar({ solicitudes: [s, asistencia] }, magnitudes())).toThrow()
  })
  it("ambas API rechazan hechos primarios ausentes sin cuota cero", () => {
    const completo = hogar(), { registroHogar, ...hechos } = completo.hechos
    expect(registroHogar).toBeDefined()
    const s = { ...completo, hechos }, c = casoUniformeC36(), datos = casoExplicitoC36([])
    const u = Effect.runSync(Effect.flip(liquidarIrpfAnual({ ...c, situacionFamiliar: { ...c.situacionFamiliar, edad: 75 }, deduccionesTerritoriales2025: { solicitudes: [s] } }, { modo: "canonico" })))
    const e = Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito({ ...datos, edad: 75, deduccionesTerritoriales2025: { solicitudes: [s] } })))
    expect(u._tag).toBe("ResultadoNoSoportado")
    expect(e._tag).toBe("ResultadoNoSoportado")
  })
  it("ambas API aplican200 y reducen20000 céntimos de cuota", () => {
    const s = hogar("sin_matrimonio", "1000"), c = casoUniformeC36()
    const caso = { ...c, situacionFamiliar: { ...c.situacionFamiliar, edad: 75 } }
    const sin = Effect.runSync(liquidarIrpfAnual(caso, { modo: "canonico" }))
    const u = Effect.runSync(liquidarIrpfAnual({ ...caso, deduccionesTerritoriales2025: { solicitudes: [s] } }, { modo: "canonico" }))
    const datos = casoExplicitoC36([])
    const e = Effect.runSync(liquidarIrpfAnualExplicito({ ...datos, edad: 75, deduccionesTerritoriales2025: { solicitudes: [s] } }))
    expect(u.deduccionesTerritoriales2025?.total).toEqual(racional("200"))
    expect(e.deduccionesTerritoriales2025?.total).toEqual(racional("200"))
    expect(sin.cuotaLiquidaCentimos - u.cuotaLiquidaCentimos).toBe(20000)
  })
})
