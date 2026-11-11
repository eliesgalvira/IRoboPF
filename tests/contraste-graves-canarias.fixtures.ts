// Escaffolding de entrada B04; omite ingreso cero para el control al contado.
import { Schema } from "effect"
import { ViviendaC36 } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-esquemas"
import { viviendaConexionC36 } from "./c36-conexion-anual.fixtures"
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
    ...(base + margen > 0 ? [{ id: "renta", cuenta: "B04-C", fecha: "2025-01-02", importe: dinero(base + margen), clase: "ingreso", sentido: "entrada", documento: doc("renta") }] : []),
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

export { hechos }
