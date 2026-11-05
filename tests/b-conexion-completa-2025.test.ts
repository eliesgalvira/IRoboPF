import { describe, expect, it } from "vitest"
import { Effect, Schema, Result } from "effect"
import { aplicarDeduccionesTerritoriales2025 as aplicar, type SolicitudDeduccionesTerritoriales2025 as Solicitud } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { producirNodosFiscalesB2025 } from "../lib/dominio/irpf/deducciones/b-ampliado-anual-2025/productores"
import { eleccionesTerritorialesB, conciliarPagosEntreLotesB } from "../lib/dominio/irpf/deducciones/b-ampliado-anual-2025/conciliacion-lotes"
import { magnitudAnualR, r } from "../lib/dominio/irpf/deducciones/asturias-cantabria-ampliacion-2025/comun"
import { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial-esquemas"
import { marco, solicitudAdopcion, solicitudCelia } from "./b-ampliado-anual-fixtures"
import { operacion, pago, traslado, doc, vivienda } from "./asturias-cantabria-ampliacion-fixtures"
import { marcoPropioB, casoCanonicoB, casoEfectivoB, alquilerB, autonomoB, inversionB, trasladoRuralB, obrasB, socialB, decimalB } from "./b-conexion-completa-fixtures"

const positivos = [
  { nombre: "vivienda", solicitud: alquilerB, esperado: "1500" },
  { nombre: "trabajo", solicitud: autonomoB, esperado: "1000" },
  { nombre: "inversión", solicitud: inversionB, esperado: "6000" },
]
describe.each(positivos)("Familia de cálculo:$nombre", ({ solicitud, esperado }) => {
  const entrada = { solicitudes: [solicitud] }
  it("dispatcher entrega generación exacta y consume sólo una cuota", () => {
    const salida = aplicar(entrada, marcoPropioB())
    expect(salida.aplicaciones[0].generado).toEqual(racional(esperado))
    expect(salida.total).toEqual(racional(esperado))
    expect(salida.evaluaciones[0].resultado.estado).toBe("calculo_parcial")
  })
  it("API canónica conserva generación independiente de la cuota disponible", () => {
    const r = Effect.runSync(liquidarIrpfAnual(casoCanonicoB(entrada), { modo: "canonico" }))
    expect(r.deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual(racional(esperado))
  })
  it("API efectiva admite el mismo contrato sin bases externas", () => {
    const r = Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoB(entrada)))
    expect(r.deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual(racional(esperado))
  })
})

function marcoFamiliaB(rentaPropiaCentimos: number) {
  const m = marco(), derechos = m.caso.derechosMinimos
  if (derechos === undefined) throw new Error("Fixture")
  return { ...m, caso: { ...m.caso, derechosMinimos: { ...derechos, conciliacionRentasContribuyente: { perfil: "caso-anual-parcial" as const, otrasRentasOGastosNoRepresentados: "ninguno" as const }, descendientes: derechos.descendientes.map(d => ({ ...d, titulares: d.titulares.map(t => ({ ...t, rentasNoExentasCentimos: t.titularId === derechos.contribuyenteId ? rentaPropiaCentimos : t.rentasNoExentasCentimos, vinculo: { clase: "adopcion" as const, fechaInicioIncremento: "2025-01-01", fechaConstitucionVinculo: "2024-12-01", fundamento: "inscripcion-registro-civil" as const, historialCompleto: true as const } })) })) } } }
}
it("familia en API canónica:750 para dos titulares conciliados desde el motor", () => {
  // El perfil sin deducción sólo establece la renta de conciliación;el oráculo de la deducción es1500/2.
  const base = Effect.runSync(liquidarIrpfAnual(casoCanonicoB({ solicitudes: [] }), { modo: "canonico" }))
  const m = marcoFamiliaB(base.rendimientoNetoTrabajoCentimos)
  const r = Effect.runSync(liquidarIrpfAnual(casoCanonicoB({ solicitudes: [solicitudAdopcion()] }, m), { modo: "canonico" }))
  expect(r.deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual(racional("750"))
})
it("familia en API efectiva:750 con renta neta33000-2000,sin certificado como derecho", () => {
  const r = Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoB({ solicitudes: [solicitudAdopcion()] }, marcoFamiliaB(3100000))))
  expect(r.deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual(racional("750"))
})

it("80º decimal decide el límite;no usa un representante de tramo", () => {
  const m = marco("asturias", ["s-1", "s-3", "s-4"]), entrada = { solicitudes: [solicitudCelia()] }
  const inferior = "34999." + "9".repeat(80), superior = "35000." + "0".repeat(79) + "1"
  expect(aplicar(entrada, { ...m, baseGeneral: decimalB(inferior) }).aplicaciones[0].generado).toEqual(racional("100", "3"))
  expect(aplicar(entrada, { ...m, baseGeneral: decimalB(superior) }).evaluaciones[0].resultado.estado).toBe("excluida")
  expect(magnitudAnualR(inferior).exacto()).toEqual(racional("34999" + "9".repeat(80), "1" + "0".repeat(80)))
  expect(() => r("1.001")).toThrow(/dos decimales/)
})
it("magnitud interna conserva signo sin admitir pagos negativos ni exceso de precisión", () => {
  expect(magnitudAnualR("-0." + "0".repeat(79) + "1", true).exacto()).toEqual(racional("-1", "1" + "0".repeat(80)))
  expect(() => magnitudAnualR("0." + "1".repeat(81))).toThrow(/18\+80/)
  expect(() => r("-1")).toThrow()
})
it("cuota con80 decimales llega exacta a residencia rural y al libro", () => {
  const valor = "1000." + "0".repeat(79) + "1"
  const m = marcoPropioB("cantabria", 35)
  const s: Solicitud = { solicitudes: [{ lote: "B-ampliado", hechos: { codigo: "cantabria_residencia_municipio_riesgo_despoblamiento", personas: [{ id: "A", nacimiento: "1990-01-01", residencias: [{ inicio: "2025-01-01", fin: "2025-12-31", territorio: "cantabria", municipio: "39003" }] }] } }] }
  const r = aplicar(s, { ...m, cuotaAutonomica: decimalB(valor) })
  expect(r.aplicaciones[0].generado).toEqual(racional("1000" + "0".repeat(79) + "1", "5" + "0".repeat(80)))
})
it("tipos medios generales usan cuotas de los arts.63.1/74.1 y dos decimales sin redondeo", () => {
  const nodos = producirNodosFiscalesB2025("A", decimalB("300"), decimalB("32.99999"), decimalB("45.59999"))
  expect(nodos.tiposMediosGenerales?.estatal).toBe("10.99")
  expect(nodos.tiposMediosGenerales?.autonomico).toBe("15.19")
  expect(nodos.cuotaTrabajoActividad).toBeUndefined()
  expect(producirNodosFiscalesB2025("A", decimalB("0"), decimalB("0"), decimalB("0")).tiposMediosGenerales).toBeUndefined()
})
it("traslado rural reutiliza componente de trabajo de composición, no cuota total", () => {
  const nodos = producirNodosFiscalesB2025("A", decimalB("20000"), decimalB("1000"), decimalB("300.123456789"), "solo-trabajo")
  const r = aplicar({ solicitudes: [trasladoRuralB()] }, { ...marcoPropioB("cantabria"), nodosFiscalesB2025: nodos })
  expect(r.aplicaciones[0].generado).toEqual(racional("300.123456789"))
  expect(() => aplicar({ solicitudes: [trasladoRuralB()] }, marcoPropioB("cantabria"))).toThrow(/base general mixta|procedencia/)
})
it.each(["canonico", "efectivo"])("API%s produce cuota de trabajo y conecta traslado rural500", api => {
  const s = { solicitudes: [trasladoRuralB()] }, m = marcoPropioB("cantabria")
  const resultado = api === "canonico" ? Effect.runSync(liquidarIrpfAnual(casoCanonicoB(s, m), { modo: "canonico" })) : Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoB(s, m)))
  expect(resultado.deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual(racional("500"))
})
it("tipos medios existentes no acreditan que una ayuda ELA se haya integrado", () => {
  const nodos = producirNodosFiscalesB2025("A", decimalB("20000"), decimalB("1000"), decimalB("1000"), "solo-trabajo")
  expect(() => aplicar({ solicitudes: [{ lote: "B-ampliado", hechos: { codigo: "asturias_ayudas_ela", ayudas: [] } }] }, { ...marcoPropioB(), nodosFiscalesB2025: nodos })).toThrow(/ayudaELAIntegrada2025/)
})
it("cuota de trabajo de otra identidad no se admite como magnitud propia", () => {
  const nodos = producirNodosFiscalesB2025("otro", decimalB("20000"), decimalB("1000"), decimalB("1000"), "solo-trabajo")
  expect(() => aplicar({ solicitudes: [trasladoRuralB()] }, { ...marcoPropioB("cantabria"), nodosFiscalesB2025: nodos })).toThrow(/otra persona/)
})
it("actividad negativa conserva signo;mayor de75 no necesita rendimiento positivo para ayuda doméstica", () => {
  const nodos=producirNodosFiscalesB2025("A",decimalB("0"),decimalB("0"),decimalB("0"),"solo-actividad")
  const s:Solicitud={solicitudes:[{lote:"B-ampliado",hechos:{codigo:"cantabria_ayuda_domestica",empleado:"empleado",altaCantabria:doc,vivienda:vivienda("39003"),empleadores:[{id:"A",nacimiento:"1950-01-01",altaTGSS:doc}],vinculo:"monoparental",registroPareja:null,hijos:[],cotizaciones:[pago("2000")]}}]}
  const m={...marcoPropioB("cantabria",75),baseGeneral:decimalB("-1"),baseAhorro:decimalB("20000"),rentaActividadAnualB:decimalB("-1"),nodosFiscalesB2025:nodos}
  expect(aplicar(s,m).aplicaciones[0].generado).toEqual(racional("300"))
})
it("renta de período familiar tras cambio no se sustituye por renta anual ni por importe de cliente",()=>{
  const s:Solicitud={solicitudes:[{lote:"B-ampliado",hechos:{codigo:"asturias_familias_monoparentales",familia:{convivientes:[],exhaustividad:"completa",alimentosExentos:"0",cambioSituacion:"2025-03-01"}}}]}
  expect(()=>aplicar(s,{...marcoPropioB(),rentaNoExentaAntesReduccionesB:decimalB("20000")})).toThrow(/renta computable del período/)
})

it("B previo y B37 no reutilizan pago aunque sus códigos sean distintos", () => {
  const s: Solicitud = { solicitudes: [alquilerB, { lote: "B", hechos: { codigo: "asturias_gastos_vitales_hasta_35", nacimiento: "1980-01-01", gastos: [{ ...pago("100"), concepto: "cultura" }] } }] }
  expect(() => aplicar(s, marcoPropioB())).toThrow(/Pago duplicado entre lotes/)
})
it("alias factura/documento de A40 no oculta un justificante ya usado por B", () => {
  const a40: Solicitud["solicitudes"][number] = { lote: "A40", codigo: "andalucia_defensa_juridica_laboral", nacimiento: "1980-01-01", hechos: { procedimientos: [{ id: "J1", clase: "despido", expedienteJudicial: "expediente", pagos: [{ id: "p-a40", fecha: "2025-05-01", pagador: "A", importeCentimos: 10000, medio: "transferencia", justificante: "Factura-P1", regimen: "personal", conyuges: [] }] }] } }
  const decoded = Schema.decodeUnknownResult(SolicitudDeduccionesTerritoriales2025)({ solicitudes: [alquilerB, a40] }, { onExcessProperty: "error" })
  expect(Result.isSuccess(decoded)).toBe(true)
  if (Result.isSuccess(decoded)) expect(() => conciliarPagosEntreLotesB(decoded.success.solicitudes)).toThrow(/Documento monetario/)
})
it("incompatibilidad por operación se deriva de solicitudes y no de usos vacíos", () => {
  const inversion = { lote: "B-ampliado" as const, hechos: { codigo: "cantabria_inversion_entidades_nuevas_reciente_creacion" as const, operaciones: [operacion("cantabria")] } }
  expect(() => aplicar({ solicitudes: [inversion, socialB()] }, marcoPropioB("cantabria"))).toThrow(/incompatible/)
  const distintas = aplicar({ solicitudes: [inversion, socialB("O2")] }, marcoPropioB("cantabria"))
  expect(distintas.total).toEqual(racional("4000"))
})
it("no basta cambiar id del justificante para ocultar incompatibilidades por sujeto", () => {
  const s: Solicitud = { solicitudes: [
    { lote: "B-ampliado", hechos: { codigo: "cantabria_gastos_guarderia", municipio: "39003", hijos: [] } },
    { lote: "B-ampliado", hechos: { codigo: "cantabria_guarderia_municipios_riesgo_despoblamiento", municipio: "39003", hijos: [] } },
  ] }
  expect(() => aplicar(s, marcoPropioB("cantabria"))).toThrow(/incompatible/)
})
it("elecciones incluyen identidad real del causante B para los demás lotes", () => {
  const e = eleccionesTerritorialesB([solicitudAdopcion()], "s-1")
  expect(e).toContainEqual({ contribuyente: "s-1", codigo: "asturias_adopcion_internacional", objeto: "s-2" })
})
it("rama con prioridad primera consume antes, conservando el orden público por código", () => {
  const residente: Solicitud["solicitudes"][number] = { lote: "B-ampliado", hechos: { codigo: "cantabria_desplazamiento_permanencia_nuevos_residentes", personas: [
    traslado("cantabria"),
  ] } }
  const r = aplicar({ solicitudes: [obrasB(), residente] }, { ...marcoPropioB("cantabria"), cuotaAutonomica: decimalB("500") })
  expect(r.codigos[0]).toBe("cantabria_obras_mejora")
  expect(r.aplicaciones[0].aplicado).toEqual(racional("0"))
  expect(r.aplicaciones[1].aplicado).toEqual(racional("500"))
  expect(r.total).toEqual(racional("500"))
})
it.each(["canonico", "efectivo"])("API%s rechaza identidad propia contradictoria", api => {
  if (alquilerB.hechos.codigo !== "asturias_arrendamiento_vivienda_habitual") throw new Error("Fixture")
  const s = { solicitudes: [{ ...alquilerB, hechos: { ...alquilerB.hechos, personas: alquilerB.hechos.personas.map(p => ({ ...p, nacimiento: "1990-01-01" })) } }] }
  const error = api === "canonico" ? Effect.runSync(Effect.flip(liquidarIrpfAnual(casoCanonicoB(s), { modo: "canonico" }))) : Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(casoEfectivoB(s))))
  expect(error._tag).toBe("ResultadoNoSoportado")
  expect(error.motivo).toMatch(/Nacimiento propio|Edad contradictoria/)
})
it.each(["canonico", "efectivo"])("API%s rechaza hijo identificado como progenitor",api=>{
  const original=solicitudAdopcion();if(original.hechos.codigo!=="asturias_adopcion_internacional")throw new Error("Fixture")
  const entrada={solicitudes:[{...original,hechos:{...original.hechos,adopciones:original.hechos.adopciones.map(a=>({...a,hijo:{...a.hijo,progenitores:["s-1","s-2"]}}))}}]}
  const renta=api==="canonico"?Effect.runSync(liquidarIrpfAnual(casoCanonicoB({solicitudes:[]}),{modo:"canonico"})).rendimientoNetoTrabajoCentimos:3100000
  const m=marcoFamiliaB(renta)
  const error=api==="canonico"?Effect.runSync(Effect.flip(liquidarIrpfAnual(casoCanonicoB(entrada,m),{modo:"canonico"}))):Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(casoEfectivoB(entrada,m))))
  expect(error.motivo).toMatch(/Identidad del descendiente/)
})
it.each(["canonico", "efectivo"])("API%s rechaza el gasto repetido entre B previo y B37",api=>{
  const entrada:Solicitud={solicitudes:[alquilerB,{lote:"B",hechos:{codigo:"asturias_gastos_vitales_hasta_35",nacimiento:"1980-01-01",gastos:[{...pago("100"),concepto:"cultura"}]}}]}
  const error=api==="canonico"?Effect.runSync(Effect.flip(liquidarIrpfAnual(casoCanonicoB(entrada),{modo:"canonico"}))):Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(casoEfectivoB(entrada))))
  expect(error.motivo).toMatch(/Pago duplicado entre lotes/)
})
it("ambas uniones impiden bases/cuotas/tipos y selecciones externas al cliente", () => {
  for (const campo of ["baseGeneral", "cuotaAutonomica", "nodosFiscalesB2025", "tiposMediosGenerales", "usos"])
    expect(Result.isFailure(Schema.decodeUnknownResult(SolicitudDeduccionesTerritoriales2025)({ solicitudes: [{ ...alquilerB, [campo]: "0" }] }, { onExcessProperty: "error" }))).toBe(true)
})
