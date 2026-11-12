import Decimal from "decimal.js"
import { Effect } from "effect"
import { expect, it } from "vitest"
import type { CensoBasesFamiliares2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import type { AlquilerViviendaFamilia2025 } from "../lib/dominio/irpf/bases-familiares-2025/alquiler-vivienda"
import type { InteresesBancariosFamilia2025 } from "../lib/dominio/irpf/bases-familiares-2025/intereses-bancarios"
import type { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { analitico, efectivo } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { censo, familia, solicitud } from "./madrid-vivienda-historia.fixtures"
import { galiciaInversion } from "./galicia-alquiler-inversion.fixtures"
const D = Decimal.clone({ precision: 80 })
const nacimiento = "madrid_vivienda_nacimiento_adopcion_hijos"
type Titular = "s-1" | "s-2"
type Mutable<T> = T extends object ? { -readonly [K in keyof T]: Mutable<T[K]> } : T
function compartida(porcentaje = "50", precio = "100000", propio: Titular = "s-1"): SolicitudAnualF2025 {
  const s = solicitud(nacimiento)
  const porcentajes = [porcentaje, new D(100).minus(porcentaje).toFixed()]
  const titulares = [propio, propio === "s-1" ? "s-2" : "s-1"]
  return {
    ...s,
    hechos: { ...s.hechos, viviendas: [{ ...s.hechos.viviendas![0]!, precioEUR: precio, titulares, porcentajePropiedad: porcentaje }] },
    adquisicionCompartidaMadrid2025: {
      ejercicio: 2025, contribuyente: propio, viviendaId: "v", adquisicion: "2025-01-01",
      modalidad: "compraventa-terminada", escritura: "escritura-sintetica", regimen: "separacion-bienes",
      soporteRegimen: "capitulaciones-sinteticas", regimenDesde: "2020-01-01", regimenHasta: "2025-12-31",
      titularesCompletos: true, titularidadHasta: "2025-12-31",
      titulares: titulares.map((id, i) => ({ id, porcentaje: porcentajes[i]!,
        precioAdquiridoEUR: new D(precio).times(porcentajes[i]!).div(100).toFixed(),
        gastosAtribuidosEUR: new D(2000).times(porcentajes[i]!).div(100).toFixed(),
        tributosAtribuidosEUR: new D(8000).times(porcentajes[i]!).div(100).toFixed(),
        soporte: "escritura-facturas-" + id,
      })),
    },
  }
}

function alquiler(neto = "1000", sujeto = "s-2"): Mutable<AlquilerViviendaFamilia2025> {
  // SAFETY: la fixture está tipada como InmuebleP4a; structuredClone crea arrays y objetos propios. Sólo se elimina readonly.
  const v = structuredClone(galiciaInversion(false, new D(neto).plus(2400).toFixed()).inmuebles[0]!) as Mutable<AlquilerViviendaFamilia2025["inmueble"]>
  const id = v.id + "-" + sujeto
  return { referencia: "arrendador-familiar", ejercicio: 2025, tituloAdquisicion: "compraventa-onerosa", sujetoId: sujeto, nacimiento: "1985-01-01",
    inmueble: { ...v, id, catastro: v.catastro + "-" + sujeto, titular: sujeto, titulares: [sujeto], regimenMatrimonial: "separacion-bienes",
      contrato: { ...v.contrato, arrendador: sujeto } },
    censoDerechos: { documento: "censo-mundial", cobertura: "mundial-propiedad-usufructo-cualquier-porcentaje-todo-2025", inmuebles: [id] },
    contextoRendimientos: "calculo-ordinario-sin-procedimiento-ni-rectificacion", retenciones: "ninguna" }
}
function economia(neto = "1000", sujeto = "s-2") {
  return { perfil: "solo-alquiler-vivienda", censoRentasCompleto: true, otrasRentas: "ninguna", reduccionesBase: "ninguna",
    saldosAnteriores: "ninguno", alquilerVivienda2025: alquiler(neto, sujeto) } as const
}
function intereses(importe = "1000", sujeto = "s-2"): Mutable<typeof InteresesBancariosFamilia2025.Type> {
  return { referencia: "certificado-anual", sujetoId: sujeto, ejercicio: 2025, censoCuentasCompleto: true,
    cuentas: [{ id: "cuenta-1", titularId: sujeto, entidad: "banco-1", soporteTitularidad: "contrato-cuenta",
      titularidad: "privativa-exclusiva", producto: "cuenta", entidadResidenteEspana: true, establecimientoEnEspana: true,
      vinculacion: "no-vinculada", litigio: "ninguno", retribucion: "dineraria", liquidacionesCompletas: true,
      liquidaciones: [{ id: "intereses-anuales", fechaExigibilidad: "2025-12-31", fechaAbono: "2025-12-31", soporte: "extracto",
        integroEUR: importe, retencionEUR: new D(importe).times("0.19").toFixed(2) }] }] }
}
type Economia = CensoBasesFamiliares2025["personas"][number]["economia"]
function ejecutar(api: "canonica" | "explicita", economiaAjena: Economia, renta: string, conCompra = true) {
  const base = censo()
  const basesFamiliares2025 = { ...base, personas: base.personas.map(p => ({ ...p, economia: p.id === "s-2" ? economiaAjena : p.economia })) }
  const f = familia()
  const derechosMinimos = { ...f, descendientes: f.descendientes.map(d => ({ ...d, titulares: d.titulares.map(t => ({ ...t,
    rentasNoExentasCentimos: t.titularId === "s-2" ? new D(renta).times(100).toNumber() : t.rentasNoExentasCentimos })) })) }
  const comunes = { contribuyenteId: "s-1", derechosMinimos, basesFamiliares2025,
    deduccionesTerritoriales2025: { solicitudes: conCompra ? [compartida()] : [] } }
  return api === "canonica"
    ? Effect.runSync(Effect.result(liquidarIrpfAnual({ ...analitico, ...comunes }, { modo: "canonico" })))
    : Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...efectivo, ...comunes, familiaresConDerechoMinimo: "segun-derechos", deducciones: "territoriales-por-hechos-y-da61" })))
}
for (const api of ["canonica", "explicita"] as const) {
  for (const importe of ["66734", "66734.01"]) it(`${api}: ahorro ajeno y compra compartida en frontera92790 ${importe}`, () => {
    const e = { perfil: "solo-intereses-bancarios", censoRentasCompleto: true, otrasRentas: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", interesesBancarios2025: intereses(importe) } as const
    const r = ejecutar(api, e, importe)
    expect(r._tag).toBe("Success")
    if (r._tag === "Success") expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional(importe === "66734" ? "550" : "0"))
  })
  for (const idCoincide of [false, true]) it(`${api}: rechaza censo mundial exclusivo y compra compartida idCoincide=${idCoincide}`, () => {
    const e = economia("2000")
    if (idCoincide) { e.alquilerVivienda2025.inmueble.id = "v"; e.alquilerVivienda2025.censoDerechos.inmuebles = ["v"] }
    // El alquiler aislado es admisible; la compra añade un derecho que el censo
    // mundial niega, o contradice su titularidad exclusiva si comparte identidad.
    expect(ejecutar(api, e, "2000", false)._tag).toBe("Success")
    expect(ejecutar(api, e, "2000")._tag).toBe("Failure")
  })
}
