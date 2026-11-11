import { expect, it } from "vitest"
import { Effect, Schema } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { ViviendaC36 } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-esquemas"
import { casoUniformeC36, casoExplicitoC36, viviendaConexionC36 } from "./c36-conexion-anual.fixtures"

// Revisión B04 independiente. No importa fixtures ni esperados del candidato.
// Importes de entrada en céntimos enteros; el oráculo compara por productos
// cruzados y no importa aritmética fiscal ni racional del producto.
const dinero = (c: number) => `${Math.trunc(c / 100)}.${String(c % 100).padStart(2, "0")}`
const doc = (referencia: string, fecha = "2025-12-31") => ({ referencia, fecha, emisor: "revisor-B04" })
const compra = "2025-03-10"
type Param = { precio?: number; dispuesto?: number; capital?: number; intereses?: number; apertura?: number; margen?: number; valor?: number; inicial?: number }
function hechos(q: Param = {}) {
  const precio = q.precio ?? 1200000, dispuesto = q.dispuesto ?? 1000000
  const capital = q.capital ?? 100000, intereses = q.intereses ?? 40000, apertura = q.apertura ?? 10000
  const propio = precio - dispuesto, base = propio + capital + intereses + apertura
  const inicial = q.inicial ?? 500000, margen = q.margen ?? 0
  const molde = viviendaConexionC36("canarias_inversion_vivienda_habitual")
  const v = molde.hechos.viviendas[0]!, pago = v.gastos[0]!
  const movimientos = [
    { id: "renta", cuenta: "B04-C", fecha: "2025-01-02", importe: dinero(base + margen), clase: "ingreso", sentido: "entrada", documento: doc("renta") },
    ...(dispuesto > 0 ? [{ id: "disp", cuenta: "B04-C", fecha: compra, importe: dinero(dispuesto), clase: "disposicion", sentido: "entrada", documento: doc("disp", compra) }] : []),
    { id: "precio", cuenta: "B04-C", fecha: compra, importe: dinero(precio), clase: "precio", sentido: "salida", documento: doc("precio", compra) },
    ...([["apertura", apertura, "gastos_financiacion", compra], ["capital", capital, "amortizacion", "2025-11-10"], ["interes", intereses, "intereses", "2025-11-10"]] as const)
      .filter(([, importe]) => importe > 0).map(([id, importe, clase, fecha]) => ({ id, cuenta: "B04-C", fecha, importe: dinero(importe), clase, sentido: "salida", documento: doc(id, fecha) })),
  ]
  const censo = [{ id: "B04-C", tipo: "cuenta_euros", inicio: "presente" }, { id: v.id, tipo: "vivienda", inicio: "ausente" }, ...(dispuesto > 0 ? [{ id: "B04-L", tipo: "prestamo", inicio: "ausente" }] : [])]
    .map(x => ({ ...x, titular: "s-1", participacion: [1, 1], cierre: "presente", documento: doc("censo-" + x.id) }))
  type Historia = NonNullable<typeof ViviendaC36.Type["hechos"]["historiaAdquisicion"]>
  type FinanciacionAdicional = { financiacionOriginal?: Historia["financiacionOriginal"] }
  const financiacion: FinanciacionAdicional = {}
  if (dispuesto > 0) financiacion.financiacionOriginal = {
    trayectoria: "original_exclusivo_sin_refinanciacion_ni_disposiciones_adicionales",
    modalidad: "ordinario_sin_coberturas_ni_seguros_vinculados", documento: doc("trayectoria"),
    gastos: apertura > 0 ? [{ movimiento: "apertura", naturaleza: "comision_apertura", documento: doc("apertura", compra) }] : [],
  }
  return Schema.decodeUnknownSync(ViviendaC36)({ ...molde, hechos: { ...molde.hechos,
    viviendas: [{ ...v, adquisicion: compra, ocupacion: compra, habitualDesde: compra, propietarios: [{ persona: "s-1", porcentaje: "100", titulo: "B04-escritura" }],
      gastos: movimientos.filter(x => x.sentido === "salida").map(x => ({ ...pago, id: x.id, factura: x.documento.referencia, fecha: x.fecha, importe: x.importe,
        pagador: "s-1", perceptor: x.clase === "precio" ? "B04-VENDEDOR" : "B04-BANCO", concepto: "adquisicion", naturaleza: "propio", medio: "transferencia", ayudasExentas: "0", reembolsos: "0", distribucion: [{ persona: "s-1", porcentaje: "100" }] })) }],
    historiaAdquisicion: {
      ubicacion: "canarias", catastro: v.catastro, localizacion: doc("localizacion"), residencia: { desde: compra, hasta: "2025-12-31", documento: doc("residencia") },
      ayudas: { documento: doc("ayudas"), censo: "todas_concesiones_y_cobros_desde_adquisicion", expedientes: [] },
      ...financiacion,
      patrimonio: { ejercicio: 2025, persona: "s-1", exhaustividad: "todos_activos_deudas_derechos_y_movimientos", censo,
        cuentas: [{ id: "B04-C", inicio: { importe: dinero(inicial), documento: doc("inicio", "2025-01-01") }, cierre: { importe: dinero(inicial + margen), documento: doc("cierre") } }], movimientos,
        adquisicion: { inmueble: v.id, fecha: compra, vendedor: "B04-VENDEDOR", precio: dinero(precio), escritura: doc("B04-escritura", compra), valorCierre: { importe: dinero(q.valor ?? precio), documento: doc("valor") } },
        prestamo: dispuesto > 0 ? { id: "B04-L", fecha: compra, acreedor: "B04-BANCO", inmueble: v.id, contrato: doc("contrato", compra), principalCierre: { importe: dinero(dispuesto - capital), documento: doc("principal") } } : null,
        historia: { desde: "1985-01-01", hasta: "2025-12-31", documento: doc("vida"), derechos: [{ inmueble: v.id, titular: "s-1", adquisicion: compra, transmision: null, titulo: doc("B04-escritura", compra) }], anticipos: [],
          ejercicios: Array.from({ length: 40 }, (_, i) => ({ anio: 1985 + i, documento: doc("hist-" + i), eventos: [] })) },
      },
    },
  } }, { onExcessProperty: "error" })
}
type S = typeof ViviendaC36.Type
// Esperados fijados manualmente: base en céntimos * 7 / 20000 = euros.
const positivos: readonly [string, Param, string, string][] = [
  ["mixta: 2000+1000+400+100", {}, "245", "2"],
  ["sin apertura", { apertura: 0 }, "119", "1"],
  ["sólo capital", { intereses: 0, apertura: 0 }, "105", "1"],
  ["sin amortizar", { capital: 0 }, "175", "2"],
  ["5999.99", { capital: 349999 }, "4199993", "20000"],
  ["6000", { capital: 350000 }, "210", "1"],
  ["6000.01", { capital: 350001 }, "210", "1"],
  ["financiación íntegra, sólo intereses", { dispuesto: 1200000, capital: 0, apertura: 0 }, "14", "1"],
  ["financiación íntegra con amortización", { dispuesto: 1200000 }, "105", "2"],
  ["precio y disposición en céntimos", { precio: 1200001, dispuesto: 1000002 }, "2449993", "20000"],
  ["revalorización no cuenta otra vez", { valor: 9000000 }, "245", "2"],
  ["depreciación tampoco reduce", { valor: 100000 }, "245", "2"],
  ["exceso patrimonial de un céntimo", { margen: 1 }, "245", "2"],
  ["incremento insuficiente coherente (objeción B04-01)", { margen: -1 }, "2449993", "20000"],
  ["ahorros previos: base parcial (B04-01)", { margen: -300000, inicial: 10000000 }, "35", "2"],
  ["contado 5999.99", { precio: 599999, dispuesto: 0, capital: 0, intereses: 0, apertura: 0 }, "4199993", "20000"],
  ["contado 6000", { precio: 600000, dispuesto: 0, capital: 0, intereses: 0, apertura: 0 }, "210", "1"],
  ["contado 6000.01", { precio: 600001, dispuesto: 0, capital: 0, intereses: 0, apertura: 0 }, "210", "1"],
  ["contado patrimonio insuficiente", { precio: 600000, dispuesto: 0, capital: 0, intereses: 0, apertura: 0, margen: -1 }, "4199993", "20000"],
]
function comprobarExacto(total: { numeradorEuros: string; divisor: string } | undefined, n: string, d: string) {
  expect(total).toBeDefined()
  expect(BigInt(total!.numeradorEuros) * BigInt(d)).toBe(BigInt(n) * BigInt(total!.divisor))
}
const adversos: readonly [string, (s: S) => void, RegExp][] = [
  ["acreedor vendedor", s => Object.assign(s.hechos.historiaAdquisicion!.patrimonio.prestamo!, { acreedor: "B04-VENDEDOR" }), /acreedor/],
  ["acreedor contribuyente", s => Object.assign(s.hechos.historiaAdquisicion!.patrimonio.prestamo!, { acreedor: "s-1" }), /acreedor/],
  ["titular deuda ajeno", s => Object.assign(s.hechos.historiaAdquisicion!.patrimonio.censo[2], { titular: "otro" }), /censo patrimonial/],
  ["deuda inicial no ausente", s => Object.assign(s.hechos.historiaAdquisicion!.patrimonio.censo[2], { inicio: "presente" }), /censo patrimonial/],
  ["principal incorrecto", s => Object.assign(s.hechos.historiaAdquisicion!.patrimonio.prestamo!.principalCierre, { importe: "8999.99" }), /principal de cierre/],
  ["cierre deuda sin documento vigente", s => Object.assign(s.hechos.historiaAdquisicion!.patrimonio.prestamo!.principalCierre.documento, { fecha: "2025-12-30" }), /cierre/],
  ["apertura sin clasificación", s => Object.assign(s.hechos.historiaAdquisicion!.financiacionOriginal!, { gastos: [] }), /clasificación documental/],
  ["clasificación sin movimiento", s => Object.assign(s.hechos.historiaAdquisicion!.financiacionOriginal!.gastos[0], { movimiento: "inexistente" }), /comisión de apertura/],
  ["documento apertura contradictorio", s => Object.assign(s.hechos.historiaAdquisicion!.financiacionOriginal!.gastos[0].documento, { referencia: "otra" }), /comisión de apertura/],
  ["pago a tercero", s => Object.assign(s.hechos.viviendas[0].gastos[1], { perceptor: "tercero" }), /pago no vinculado/],
  ["pagador ajeno", s => Object.assign(s.hechos.viviendas[0].gastos[1], { pagador: "otro" }), /otro sujeto|Pago ajeno/],
  ["reembolso", s => Object.assign(s.hechos.viviendas[0].gastos[1], { reembolsos: "1" }), /pago no vinculado/],
  ["ayuda material", s => Object.assign(s.hechos.historiaAdquisicion!.ayudas, { expedientes: [doc("ayuda-real")] }), /ayudas con concesión/],
  ["titularidad 50%", s => Object.assign(s.hechos.viviendas[0].propietarios![0], { porcentaje: "50" }), /titularidad exclusiva/],
  ["ubicación ajena", s => Object.assign(s.hechos.historiaAdquisicion!, { ubicacion: "otra" }), /ubicación real/],
  ["título anterior", s => Object.assign(s.hechos.historiaAdquisicion!.patrimonio.historia.derechos[0], { adquisicion: "2012-01-01" }), /derechos anteriores/],
  ["movimiento duplicado", s => { const p = s.hechos.historiaAdquisicion!.patrimonio; Object.assign(p, { movimientos: [...p.movimientos, p.movimientos[3]] }) }, /duplicado/],
  ["saldo no conciliado", s => Object.assign(s.hechos.historiaAdquisicion!.patrimonio.cuentas[0].cierre, { importe: "4999.99" }), /saldo bancario/],
  ["signo incorrecto", s => Object.assign(s.hechos.historiaAdquisicion!.patrimonio.movimientos[1], { sentido: "salida" }), /signo/],
  ["orden bancario incorrecto", s => { const p = s.hechos.historiaAdquisicion!.patrimonio; Object.assign(p, { movimientos: [...p.movimientos].reverse() }) }, /orden cronológico/],
  ["patrimonio adicional no omitible", s => { const p = s.hechos.historiaAdquisicion!.patrimonio; Object.assign(p, { censo: [...p.censo, { ...p.censo[0], id: "otro-activo", tipo: "otro" }] }) }, /patrimonio conjunto/],
]
for (const api of ["uniforme", "explicita"] as const) {
  const uniforme = (s: S) => liquidarIrpfAnual({ ...casoUniformeC36(), deduccionesTerritoriales2025: { solicitudes: [s] } }, { modo: "canonico" })
  const explicita = (s: S) => liquidarIrpfAnualExplicito(casoExplicitoC36([s]))
  const liquidar = (s: S) => api === "uniforme" ? Effect.runSync(uniforme(s)) : Effect.runSync(explicita(s))
  const rechazo = (s: S) => api === "uniforme" ? Effect.runSync(Effect.flip(uniforme(s))) : Effect.runSync(Effect.flip(explicita(s)))
  it.each(positivos)(`${api} B04 %s`, (_, entrada, n, d) => {
    const s = hechos(entrada), antes = JSON.stringify(s)
    const r = liquidar(s)
    comprobarExacto(r.deduccionesTerritoriales2025?.total, n, d)
    expect(JSON.stringify(s)).toBe(antes)
  })
  for (const [nombre, mutar, causa] of adversos) it(`${api} B04 rechaza ${nombre}`, () => {
    const s = hechos(); mutar(s)
    const error = rechazo(s)
    expect(error._tag).toBe("ResultadoNoSoportado")
    expect(error.motivo).toMatch(causa)
    expect("cuotaLiquidaCentimos" in error).toBe(false)
  })
  it(`${api} B04 dos cuentas se comparan conjuntamente`, () => {
    const s = hechos(), p = s.hechos.historiaAdquisicion!.patrimonio
    Object.assign(p, {
      cuentas: [...p.cuentas, { id: "otra-cuenta", inicio: { importe: "1000", documento: doc("otra-inicio", "2025-01-01") }, cierre: { importe: "1000", documento: doc("otra-fin") } }],
      censo: [...p.censo, { ...p.censo[0], id: "otra-cuenta" }],
    })
    comprobarExacto(liquidar(s).deduccionesTerritoriales2025?.total, "245", "2")
  })
}
