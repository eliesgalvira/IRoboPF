import { describe, expect, it } from "vitest"
import { Effect, Result, Schema } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { CensoIngresosIdentificados2025 } from "../lib/dominio/irpf/ingresos-identificados-2025/contrato"
import { prepararIngresosIdentificados2025, atribuirIngresosIdentificados2025, DecimalIngreso2025 as D } from "../lib/dominio/irpf/ingresos-identificados-2025/productor"
import { producirNodosFiscalesB2025 } from "../lib/dominio/irpf/deducciones/b-ampliado-anual-2025/productores"
import { resolverDependenciaAnualB } from "../lib/dominio/irpf/deducciones/asturias-cantabria-ampliacion-2025"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { aplicarDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { marcoPropioB } from "./b-conexion-completa-fixtures"
import { ast } from "./asturias-cantabria-ampliacion-fixtures"
import { marco as marcoFamilia } from "./b-ampliado-anual-fixtures"
import { censoELA, solicitudELA, casoCanonicoELA, casoEfectivoELA } from "./ela-ingreso-2025-fixtures"

const ambito = { anio: 2025, comunidadAutonoma: "asturias", contribuyenteId: "A", fallecimiento: false }
type Api = "canonica" | "efectiva"
function ejecutar(api: Api, censo = censoELA(), solicitud = solicitudELA(censo)) {
  return api === "canonica"
    ? Effect.runSync(liquidarIrpfAnual(casoCanonicoELA(censo, solicitud), { modo: "canonico" }))
    : Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoELA(censo, solicitud)))
}
function rechazar(api: Api, censo = censoELA(), solicitud = solicitudELA(censo)) {
  return api === "canonica"
    ? Effect.runSync(Effect.flip(liquidarIrpfAnual(casoCanonicoELA(censo, solicitud), { modo: "canonico" }))).motivo
    : Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(casoEfectivoELA(censo, solicitud)))).motivo
}

describe.each(["canonica", "efectiva"] as const)("P1 ingreso y deducción por API %s", api => {
  it("20000 cobrados entran realmente en BIG/BLG; tipos de escalas y consumo único", () => {
    // Oráculo independiente: estatal=1182.75+(20000-12450)*.12-5550*.095=1561.5.
    // Asturias=1751.36+(20000-17707.20)*.14-6105*.09=1522.902.
    // Tipos truncados:7.80+7.61. Generación=20000*.1541=3082; aplica1522.902.
    const r = ejecutar(api)
    expect(r.nodosFiscalesB2025?.tiposMediosGenerales).toMatchObject({ baseLiquidableGeneral: "20000", cuotaGeneralEstatalArt63_1: "1561.5", cuotaGeneralAutonomicaArt74_1: "1522.902", estatal: "7.80", autonomico: "7.61" })
    expect(r.libroIngresosIdentificados2025?.totalIntegradoGeneral).toEqual(racional("20000"))
    expect(r.libroIngresosIdentificados2025?.ingresos[0]).toMatchObject({ ayudaId: "ELA1", integradoBaseGeneral: "20000", integradoBaseLiquidable: "20000", cobrado: racional("20000") })
    expect(r.deduccionesTerritoriales2025?.aplicaciones[0]).toMatchObject({ generado: racional("3082"), aplicado: racional("1522.902"), pendiente: racional("1559.098") })
    expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(1)
    expect(r.libroIngresosIdentificados2025?.aceptacionFiscal).toBe("pendiente")
    if (r._tag === "LiquidacionIrpfAnualCalculada") {
      expect(r.baseImponibleGeneralCentimos).toBe(2000000)
      expect(r.cuotaLiquidaCentimos).toBe(156150)
    } else {
      expect(r.baseImponibleGeneral).toBe("20000")
      expect(r.cuotaLiquidaLegal).toBe("1561.5")
    }
  })
  it("integra aunque no se solicite deducción; selección no crea ni elimina renta", () => {
    const r = ejecutar(api, censoELA(), { solicitudes: [] })
    expect(r.nodosFiscalesB2025?.tiposMediosGenerales?.baseLiquidableGeneral).toBe("20000")
    expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(0)
    if (r._tag === "LiquidacionIrpfAnualCalculada") expect(r.cuotaLiquidaCentimos).toBe(308440)
    else expect(r.cuotaLiquidaLegal).toBe("3084.402")
  })
  it("concesión20000 con cobro4000 integra sólo4000", () => {
    const c = censoELA("4000")
    Object.defineProperty(c.ayudas[0].resolucion, "importeConcedido", { value: "20000" })
    expect(ejecutar(api, c).libroIngresosIdentificados2025?.totalIntegradoGeneral).toEqual(racional("4000"))
  })
  it("ayudaId duplicada rechazada aunque cambien resolución y cobro", () => {
    const c = censoELA(), a = c.ayudas[0]
    const duplicado = { ...a, resolucion: { ...a.resolucion, referencia: "RES2" }, cobros: [{ ...a.cobros[0], cobroId: "C2", justificante: "JUST2" }] }
    expect(rechazar(api, { ...c, ayudas: [a, duplicado] })).toMatch(/duplicad/)
  })
  it("resolución duplicada no permite disfrazar la misma ayuda con otro ID", () => {
    const c = censoELA(), a = c.ayudas[0]
    expect(rechazar(api, { ...c, ayudas: [a, { ...a, ayudaId: "ELA2" }] })).toMatch(/duplicad/)
  })
  it.each(["beneficiario", "beneficiario-cobro"])("rechaza %s distinto", campo => {
    const c = censoELA()
    Object.defineProperty(campo === "beneficiario" ? c.ayudas[0] : c.ayudas[0].cobros[0], "beneficiario", { value: "OTRO" })
    expect(rechazar(api, c)).toMatch(/eneficiario|Entrada incompleta/)
  })
  it("concesión sin cobro no integra ni genera un cero supuesto", () => {
    const c = censoELA(); Object.defineProperty(c.ayudas[0], "cobros", { value: [] })
    expect(rechazar(api, c)).toMatch(/cobros2025|Entrada incompleta/)
  })
  it.each(["2024-10-01", "2025-02-29", "2025-08-31"])("rechaza fecha cobro %s", fecha => {
    const c = censoELA(); Object.defineProperty(c.ayudas[0].cobros[0], "fecha", { value: fecha })
    expect(rechazar(api, c)).toMatch(/Cobro|cobros2025|Entrada incompleta/)
  })
  it.each(["ganancia-patrimonial-transmision", "exenta"])("clasificación incompatible %s", clasificacionFiscal => {
    const c = censoELA(); Object.defineProperty(c.ayudas[0], "clasificacionFiscal", { value: clasificacionFiscal })
    expect(rechazar(api, c)).toMatch(/clasificación|Entrada incompleta/)
  })
  it.each(["programa", "administracion"])("rechaza otro %s sin cambiar importe", campo => {
    const c = censoELA(); Object.defineProperty(c.ayudas[0], campo, { value: "otro" })
    expect(rechazar(api, c)).toMatch(/programa|Entrada incompleta/)
  })
  it.each(["baseAtribuida", "compensaciones", "cuota", "tipoMedio"])("censo no acepta magnitud externa %s", campo => {
    const c = censoELA(); Object.defineProperty(c, campo, { value: "1", enumerable: true })
    expect(rechazar(api, c)).toMatch(/cerrado|Entrada incompleta/)
  })
  it("censo incompleto no acredita ausencia de otros ingresos", () => {
    const c = censoELA(); Object.defineProperty(c, "exhaustividad", { value: "incompleta" })
    expect(rechazar(api, c)).toMatch(/cerrado|Entrada incompleta/)
  })
  it("cobro duplicado no se suma dos veces", () => {
    const c = censoELA(), a = c.ayudas[0]
    expect(rechazar(api, { ...c, ayudas: [{ ...a, cobros: [a.cobros[0], a.cobros[0]] }] })).toMatch(/repetido/)
  })
  it("la deducción no puede citar otra ayudaId", () => {
    const c = censoELA(), otro = censoELA(); Object.defineProperty(otro.ayudas[0], "ayudaId", { value: "FICTICIA" })
    expect(rechazar(api, c, solicitudELA(otro))).toMatch(/ayudaId/)
  })
  it("la deducción no puede ocultar un segundo ingreso cobrado", () => {
    const c = censoELA("4000"), a = c.ayudas[0]
    const doble = { ...c, ayudas: [a, { ...a, ayudaId: "ELA2", resolucion: { ...a.resolucion, referencia: "RES2" }, cobros: [{ ...a.cobros[0], cobroId: "C2", justificante: "JUST2" }] }] }
    expect(rechazar(api, doble, solicitudELA(c))).toMatch(/incompleto|omitidos/)
  })
  it("censo completo con dos ayudas se integra una vez por expediente", () => {
    const c = censoELA("4000"), a = c.ayudas[0]
    const doble = { ...c, ayudas: [a, { ...a, ayudaId: "ELA2", resolucion: { ...a.resolucion, referencia: "RES2" }, cobros: [{ ...a.cobros[0], cobroId: "C2", justificante: "JUST2" }] }] }
    expect(ejecutar(api, doble).libroIngresosIdentificados2025?.totalIntegradoGeneral).toEqual(racional("8000"))
  })
  it("solicitar dos veces ELA no duplica aplicación", () => {
    const s = solicitudELA()
    expect(rechazar(api, censoELA(), { solicitudes: [...s.solicitudes, ...s.solicitudes] })).toMatch(/duplicad/)
  })
})

it("art20 efectivo:6500 exactos conserva7302;6500.01 anula reducción y DA61", () => {
  const menor = Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoELA(censoELA("6500"), { solicitudes: [] }, "14000", "empleo-laboral")))
  const mayor = Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoELA(censoELA("6500.01"), { solicitudes: [] }, "14000", "empleo-laboral")))
  expect(menor.reduccionArt20).toBe("7302")
  expect(menor.baseImponibleGeneral).toBe("11198")
  expect(mayor.reduccionArt20).toBe("0")
  expect(mayor.baseImponibleGeneral).toBe("18500.01")
  expect(mayor.deduccionTrabajo).toBe("0")
})
it("trabajo33000 más cobro4000: tipos propios10.87/10.64, generación860.40 sin agotar cuota", () => {
  // BLG=33000-2000+4000=35000; qE=2112.75+14800*.15-527.25=3805.5;
  // qA=3893.36+1992.8*.192-549.45=3726.5276. Tipos se truncan por separado.
  const r = Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoELA(censoELA("4000"), solicitudELA(censoELA("4000")), "33000", "empleo-laboral")))
  expect(r.baseLiquidableGeneral).toBe("35000")
  expect(r.rendimientoNetoReducido).toBe("31000")
  expect(r.nodosFiscalesB2025?.tiposMediosGenerales).toMatchObject({ estatal: "10.87", autonomico: "10.64", cuotaGeneralEstatalArt63_1: "3805.5", cuotaGeneralAutonomicaArt74_1: "3726.5276" })
  expect(r.deduccionesTerritoriales2025?.aplicaciones[0]).toMatchObject({ generado: racional("860.4"), aplicado: racional("860.4"), pendiente: racional("0") })
  expect(r.cuotaLiquidaLegal).toBe("6671.6276")
})
it("art20 canónico también considera la ayuda antes de calcular bases", () => {
  const base = casoCanonicoELA(censoELA("6500"), { solicitudes: [] })
  const bajo = Effect.runSync(liquidarIrpfAnual({ ...base, rendimientos: { trabajo: [{ importeIntegroCentimos: 1400000 }] } }, { modo: "canonico" }))
  const alto = Effect.runSync(liquidarIrpfAnual({ ...base, ingresosIdentificados2025: censoELA("6500.01"), rendimientos: { trabajo: [{ importeIntegroCentimos: 1400000 }] } }, { modo: "canonico" }))
  expect(bajo.reduccionRendimientosTrabajoCentimos).toBe(730200)
  expect(alto.reduccionRendimientosTrabajoCentimos).toBe(0)
  expect(alto.baseImponibleGeneralCentimos - bajo.baseImponibleGeneralCentimos).toBe(730201)
})
it("ahorro canónico separado del tipo general; no usa la cuota total ni antes del mínimo", () => {
  const caso = casoCanonicoELA()
  const conAhorro = Effect.runSync(liquidarIrpfAnual({ ...caso, rendimientos: { trabajo: [], gananciasPatrimoniales: [{ importeGananciaCentimos: 5000000, tratamientoMayores65: { _tag: "SinExencionMayores65" } }] } }, { modo: "canonico" }))
  expect(conAhorro.baseLiquidableAhorroCentimos).toBe(5000000)
  expect(conAhorro.nodosFiscalesB2025?.tiposMediosGenerales).toEqual(ejecutar("canonica").nodosFiscalesB2025?.tiposMediosGenerales)
  expect(conAhorro.deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual(racional("3082"))
  expect(conAhorro.deduccionesTerritoriales2025?.aplicaciones[0].aplicado).toEqual(racional("3082"))
})
it("API efectiva mantiene rechazo de ahorro no representado", () => {
  const entrada = { ...casoEfectivoELA(), ahorro: "50000" }
  expect(Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(entrada))).motivo).toMatch(/Entrada incompleta/)
})
it("rechaza compensación externa canónica y efectiva", () => {
  const canonico = { ...casoCanonicoELA(), compensacionesBase: "1000" }
  expect(Effect.runSync(Effect.flip(liquidarIrpfAnual(canonico, { modo: "canonico" }))).motivo).toMatch(/compensaciones/)
  const efectivo = { ...casoEfectivoELA(), compensacionesBase: "1000" }
  expect(Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(efectivo))).motivo).toMatch(/Entrada incompleta/)
})
it("pérdidas de ahorro no abren atribución ficticia ni prorrateo", () => {
  const c = casoCanonicoELA()
  expect(Effect.runSync(Effect.flip(liquidarIrpfAnual({ ...c, rendimientos: { trabajo: [], gananciasPatrimoniales: [{ importeGananciaCentimos: -10000, tratamientoMayores65: { _tag: "SinExencionMayores65" } }] } }, { modo: "canonico" }))).motivo).toMatch(/pérdidas/)
})
it("familiares conservados por ambas API; censo de titulares no cambia", () => {
  const c = censoELA(); Object.defineProperty(c, "contribuyenteId", { value: "s-1" }); Object.defineProperty(c.ayudas[0], "beneficiario", { value: "s-1" }); Object.defineProperty(c.ayudas[0].cobros[0], "beneficiario", { value: "s-1" })
  const m = marcoFamilia(), derechos = m.caso.derechosMinimos
  if (derechos !== undefined) Object.defineProperty(derechos, "conciliacionRentasContribuyente", { value: { perfil: "caso-anual-parcial", otrasRentasOGastosNoRepresentados: "ninguno" }, enumerable: true })
  if (derechos !== undefined) for (const d of derechos.descendientes) for (const t of d.titulares)
    if (t.vinculo.clase === "adopcion") Object.defineProperty(t.vinculo, "fechaConstitucionVinculo", { value: "2025-01-01" })
  const canonico = { ...casoCanonicoELA(c), contribuyenteId: "s-1", situacionFamiliar: m.caso.situacionFamiliar, derechosMinimos: derechos }
  const efectivo = { ...casoEfectivoELA(c), contribuyenteId: "s-1", edad: 40, familiaresConDerechoMinimo: "segun-derechos" as const, derechosMinimos: derechos }
  const r1 = Effect.runSync(liquidarIrpfAnual(canonico, { modo: "canonico" })), r2 = Effect.runSync(liquidarIrpfAnualExplicito(efectivo))
  expect(r1.libroIngresosIdentificados2025?.ingresos[0].beneficiario).toBe("s-1")
  expect(r1.nodosFiscalesB2025).toEqual(r2.nodosFiscalesB2025)
})
it("80º decimal llega a tipos sin truncar base ni usar Number", () => {
  const base = "3." + "0".repeat(79) + "1"
  const nodos = producirNodosFiscalesB2025("A", new D(base), new D("1"), new D("1"))
  expect(nodos.tiposMediosGenerales?.baseLiquidableGeneral).toBe(base)
  expect(nodos.tiposMediosGenerales?.estatal).toBe("33.33")
  expect(nodos.tiposMediosGenerales?.autonomico).toBe("33.33")
  const frontera = producirNodosFiscalesB2025("A", new D("1"), new D("0." + "9".repeat(80)), new D("0"))
  expect(frontera.tiposMediosGenerales?.estatal).toBe("99.99")
  expect(producirNodosFiscalesB2025("A", new D("0"), new D("0"), new D("0")).tiposMediosGenerales).toBeUndefined()
})
it("80º decimal no desaparece al atribuir BIG=BLG interna", () => {
  const p = prepararIngresosIdentificados2025(censoELA("4000"), ambito)
  if (p.estado !== "preparado") throw new Error(p.motivo)
  const base = new D("20000." + "0".repeat(79) + "1")
  const r = atribuirIngresosIdentificados2025(p.preparacion, base, base.minus("0." + "0".repeat(79) + "1"))
  expect(r.estado).toBe("no_soportado")
})
it("reducciones no atribuidas mantienen rechazo; nunca devuelve ayuda base0", () => {
  const p = prepararIngresosIdentificados2025(censoELA("4000"), ambito)
  if (p.estado !== "preparado") throw new Error(p.motivo)
  expect(atribuirIngresosIdentificados2025(p.preparacion, new D("20000"), new D("19999")).estado).toBe("no_soportado")
})
it("mantiene oráculo aislado B720; tasas10/8 no son esperado anual", () => {
  const r = resolverDependenciaAnualB(ast, { clase: "ela_tipos_medios", contribuyente: "A", ayudaEnBaseLiquidable: { numeradorEuros: "4000", divisor: "1" }, referencias: ["tipo_medio_estatal_2025", "tipo_medio_autonomico_2025"], operacion: "importe_por_suma_tipos_dividida_100" }, [
    { ejercicio: 2025, contribuyente: "A", liquidacion: "fixture-aislado", concepto: "tipo_medio_estatal_2025", valor: "10" }, { ejercicio: 2025, contribuyente: "A", liquidacion: "fixture-aislado", concepto: "tipo_medio_autonomico_2025", valor: "8" },
  ])
  expect(r.estado === "calculo_parcial" ? r.importeExacto : r).toEqual(racional("720"))
})
it("deducción sin libro mantiene rechazo anterior ayudaELAIntegrada2025", () => {
  expect(() => aplicarDeduccionesTerritoriales2025(solicitudELA(), marcoPropioB())).toThrow(/ayudaELAIntegrada2025/)
})
it("esquema cerrado no admite bases integradas desde cliente", () => {
  const c = censoELA(), a = c.ayudas[0]
  expect(Result.isFailure(Schema.decodeUnknownResult(CensoIngresosIdentificados2025)({ ...c, ayudas: [{ ...a, integradoBaseLiquidable: "20000" }] }, { onExcessProperty: "error" }))).toBe(true)
})
it("otro territorio, fallecimiento y titular anual ajeno conservan rechazo", () => {
  const c = censoELA()
  expect(prepararIngresosIdentificados2025(c, { ...ambito, comunidadAutonoma: "galicia" }).estado).toBe("no_soportado")
  expect(prepararIngresosIdentificados2025(c, { ...ambito, fallecimiento: true }).estado).toBe("no_soportado")
  expect(prepararIngresosIdentificados2025(c, { ...ambito, contribuyenteId: "OTRO" }).estado).toBe("no_soportado")
})
