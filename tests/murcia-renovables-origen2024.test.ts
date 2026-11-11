import { Effect } from "effect"
import { describe, expect, it } from "vitest"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import type { SolicitudAnualF2025 as Solicitud } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import type { HistoriaRenovablesMurcia2024 as Historia } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/murcia-renovables-historia-esquema"
import { racional, menor, restar, sumar } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { agua, efectivo } from "./revision-f-fixtures"
import { codigoRenovables as codigo, historia2024, renovables2024 } from "./murcia-renovables-origen2024-fixtures"
function canonico(ss: readonly Solicitud[], bruto = 5000000) {
  const c: CasoFiscalAnual = {
    anio: 2025, comunidadAutonoma: "murcia", contribuyenteId: "s-1",
    situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] },
    rendimientos: { trabajo: [{ importeIntegroCentimos: bruto }] }, reducciones: [], deducciones: [],
    retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0, deduccionesTerritoriales2025: { solicitudes: ss },
  }
  return Effect.runSync(Effect.result(liquidarIrpfAnual(c, { modo: "canonico" })))
}
function explicito(ss: readonly Solicitud[], bruto = 5000000) {
  const c = efectivo()
  return Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({
    ...c, deduccionesTerritoriales2025: { solicitudes: ss }, trabajo: { ...c.trabajo,
      rendimientos: [{ ...c.trabajo.rendimientos[0], integro: String(bruto / 100) }] },
  })))
}
// Oráculo Fraction independiente; etapas corregidas con PDF/SES Open2024.
// Las expectativas anteriores se conservan en la entrega privada con el PRE causal.
for (const api of [{ nombre: "canónica", resolver: canonico }, { nombre: "explícita", resolver: explicito }]) {
  describe(`Murcia: origen2024 en API ${api.nombre}`, () => {
    function liquidar(ss: readonly Solicitud[], bruto?: number) {
      const r = api.resolver(ss, bruto)
      expect(r._tag).toBe("Success")
      if (r._tag === "Failure") throw new Error(JSON.stringify(r.failure))
      const l = r.success.deduccionesTerritoriales2025
      if (l === undefined || !("completoEnRamasSolicitadas" in l)) throw new Error("Falta libroF")
      expect(l.completoEnRamasSolicitadas).toBe(true)
      return l
    }
    it("produce cuota2024 y saldo efectivo; no recibe magnitudes fiscales", () => {
      const l = liquidar([renovables2024()])
      expect(l.total).toEqual(racional("2705.1"))
      expect(l.evaluacionesF[0]?.origenRenovablesMurcia2024).toMatchObject({
        ejercicio: 2024, ultimoEjercicio: 2026, generado: racional("5000"), aplicado2024: racional("2294.9"),
        saldoPorInsuficiencia2024: racional("2705.1"), excesoSobreTope: racional("0"),
        liquidacion: { bruto: racional("30000"), gastosArt19: racional("4000"), netoArt19: racional("26000"),
          reduccionArt20: racional("0"), baseGeneral: racional("26000"), minimoAutonomico: racional("5550"),
          cuotaAutonomica: racional("2294.9"), cuotaEstatal: racional("2455.5"), cuotaLiquida: racional("2455.5"),
          retenciones: racional("1000"), diferencial: racional("1455.5") },
      })
      expect(l.aplicaciones[0]).not.toHaveProperty("generado")
      expect(l.aplicaciones[0]).not.toHaveProperty("arrastre")
    })
    it("cuota suficiente en origen: toda generación aplicada, sin saldo ni arrastre", () => {
      const h = historia2024(), p = h.pagos[0]!
      const s = renovables2024({ ...h, factura: { ...h.factura, importeEUR: "1000" }, pagos: [{ ...p, importeEUR: "1000" }] })
      const l = liquidar([s])
      expect(l.total).toEqual(racional("0"))
      expect(l.evaluacionesF[0]?.origenRenovablesMurcia2024).toMatchObject({ generado: racional("500"), aplicado2024: racional("500"), saldoPorInsuficiencia2024: racional("0") })
      expect(l.aplicaciones[0]).not.toHaveProperty("arrastre")
    })
    it("cuota escasa2025 aplica una vez y conserva vencimiento2026", () => {
      const l = liquidar([renovables2024()], 3000000)
      const aplicado = menor(l.saldoEjercicio.cuotaInicial, racional("2705.1")), pendiente = restar(racional("2705.1"), aplicado)
      expect(l.total).toEqual(aplicado)
      expect(l.aplicaciones[0]).toMatchObject({ origen: { ejercicio: 2024, objetoId: "solar2024" }, aplicado, pendiente,
        arrastre: { primerEjercicio: 2025, ultimoEjercicio: 2026, saldo: pendiente },
        saldoHistoricoRenovablesMurcia: { aplicado2025: aplicado, pendiente2025: pendiente } })
      if (api.nombre === "explícita") expect(l.total).toEqual(racional("2560.9"))
    })
    it("cuota cero2025 preserva todo el saldo2024", () => {
      const l = liquidar([renovables2024()], 1000000)
      expect(l.total).toEqual(racional("0"))
      expect(l.aplicaciones[0]).toMatchObject({ pendiente: racional("2705.1"), arrastre: { ultimoEjercicio: 2026 } })
    })
    it("agua consume primero; órdenes invertidos preservan residual y conservación", () => {
      const s = renovables2024(), a = liquidar([s, agua()], 3000000), b = liquidar([agua(), s], 3000000)
      expect(a.total).toEqual(b.total)
      expect(a.ordenAplicado).toEqual([agua().codigo, codigo])
      const saldoDisponible = restar(a.saldoEjercicio.cuotaInicial, racional("60"))
      const aplicado = menor(saldoDisponible, racional("2705.1"))
      expect(a.total).toEqual(sumar(racional("60"), aplicado))
      expect(a.aplicaciones[1]).toMatchObject({ aplicado, pendiente: restar(racional("2705.1"), aplicado) })
    })
    const concesion = {norma:"Real Decreto 477/2021",programa:4,referencia:"RD477-expediente",autoridad:"CARM",
      fecha:"2024-06-01",beneficiario:"s-1",instalacionId:"solar2024"} as const
    it("ayuda RD477 programa4 no integrable reduce inversión antes de generar", () => {
      const h = historia2024()
      const l = liquidar([renovables2024({ ...h, ayudas: [{ id: "a", beneficiario: "s-1", instalacionId: "solar2024", fecha: "2024-07-01", importeEUR: "2000", soporte: "resolucion", concesion }] })])
      expect(l.total).toEqual(racional("1705.1"))
      expect(l.evaluacionesF[0]?.origenRenovablesMurcia2024).toMatchObject({ inversionNeta: racional("8000"), generado: racional("4000") })
    })
    it("tope de generación no se confunde con cuota pendiente", () => {
      const h = historia2024()
      const l = liquidar([renovables2024({ ...h, factura: { ...h.factura, importeEUR: "20000" }, pagos: [{ ...h.pagos[0]!, importeEUR: "20000" }] })])
      expect(l.evaluacionesF[0]?.origenRenovablesMurcia2024).toMatchObject({ generacionAntesTope: racional("10000"), excesoSobreTope: racional("3000"), generado: racional("7000"), saldoPorInsuficiencia2024: racional("4705.1") })
    })
    it.each([
      ["17000", "1000", "14000", "5293", "8707", "299.92", "4700.08"],
      ["18000", "1000", "15000", "3543", "11457", "561.17", "4438.83"],
      ["20000", "1000", "17000", "852.15", "16147.85", "1069.66", "3930.34"],
    ])("art19/art20 origen bruto%s con casillas oficiales a céntimos", (bruto, ss, neto, reduccion, base, cuota, saldo) => {
      const h = historia2024(), r = h.trabajo.rendimientos[0]!
      const l = liquidar([renovables2024({ ...h, trabajo: { ...h.trabajo, rendimientos: [{ ...r, integro: bruto,
        cotizaciones: { ...r.cotizaciones, seguridadSocial: ss } }] } })])
      expect(l.evaluacionesF[0]?.origenRenovablesMurcia2024).toMatchObject({ saldoPorInsuficiencia2024: racional(saldo),
        liquidacion: { netoArt19: racional(neto), reduccionArt20: racional(reduccion), baseGeneral: racional(base), cuotaAutonomica: racional(cuota) } })
    })
    it("dos pagos bancarios distintos concilian una única factura", () => {
      const h = historia2024(), p = h.pagos[0]!
      const l = liquidar([renovables2024({ ...h, pagos: [{ ...p, id: "p1", soporte: "banco1", importeEUR: "6000" },
        { ...p, id: "p2", soporte: "banco2", importeEUR: "4000" }] })])
      expect(l.total).toEqual(racional("2705.1"))
    })
    it("subvención total deriva generación cero, sin saldo supuesto", () => {
      const h = historia2024()
      const l = liquidar([renovables2024({ ...h, ayudas: [{ id: "a", beneficiario: "s-1", instalacionId: "solar2024", fecha: "2024-07-01", importeEUR: "10000", soporte: "ayuda", concesion }] })])
      expect(l.evaluacionesF[0]?.origenRenovablesMurcia2024).toMatchObject({ inversionNeta: racional("0"), generado: racional("0"), saldoPorInsuficiencia2024: racional("0") })
      expect(l.aplicaciones[0]).not.toHaveProperty("arrastre")
    })
    const adversos: readonly { nombre: string; cambio: (h: Historia) => Historia; campo?: string }[] = [
      { nombre: "titular", cambio: h => ({ ...h, contribuyente: "otro" }), campo: "renovables2024.identidad" },
      { nombre: "perceptor del certificado", cambio: h => ({ ...h, empleo: { ...h.empleo, perceptor: "otro" } }), campo: "renovables2024.empleo" },
      { nombre: "instalación de otra vivienda", cambio: h => ({ ...h, instalacion: { ...h.instalacion, viviendaId: "otra" } }), campo: "renovables2024.instalacion" },
      { nombre: "factura ajena", cambio: h => ({ ...h, factura: { ...h.factura, destinatario: "otro" } }), campo: "renovables2024.instalacion" },
      { nombre: "no_aplicar en origen", cambio: h => ({ ...h, eleccion2024: "no_aplicar" }), campo: "renovables2024.eleccion" },
      { nombre: "no_aplicar en2025", cambio: h => ({ ...h, eleccion2025: "no_aplicar" }), campo: "renovables2024.eleccion" },
      { nombre: "pago ajeno", cambio: h => ({ ...h, pagos: [{ ...h.pagos[0]!, pagador: "otro" }] }), campo: "renovables2024.pago" },
      { nombre: "pago duplicado", cambio: h => ({ ...h, pagos: [...h.pagos, ...h.pagos] }), campo: "renovables2024.pago.id" },
      { nombre: "soporte bancario duplicado", cambio: h => ({ ...h, pagos: [{ ...h.pagos[0]!, id: "p1", importeEUR: "5000" }, { ...h.pagos[0]!, id: "p2", importeEUR: "5000" }] }), campo: "renovables2024.pago.soporte" },
      { nombre: "factura no conciliada", cambio: h => ({ ...h, factura: { ...h.factura, importeEUR: "10001" } }), campo: "renovables2024.factura" },
      { nombre: "ayuda ajena", cambio: h => ({ ...h, ayudas: [{ id: "a", beneficiario: "otro", instalacionId: "solar2024", fecha: "2024-07-01", importeEUR: "100", soporte: "ayuda" }] }), campo: "renovables2024.ayuda" },
      { nombre: "ayudas superiores al coste", cambio: h => ({ ...h, ayudas: [{ id: "a", beneficiario: "s-1", instalacionId: "solar2024", fecha: "2024-07-01", importeEUR: "10001", soporte: "ayuda", concesion }] }), campo: "renovables2024.ayudas" },
      { nombre: "pago fuera de origen", cambio: h => ({ ...h, pagos: [{ ...h.pagos[0]!, fecha: "2025-01-01" }] }), campo: "renovables2024.pago.fecha" },
      { nombre: "frontera35000 fuera de primer corte", cambio: h => ({ ...h, trabajo: { ...h.trabajo, rendimientos: [{ ...h.trabajo.rendimientos[0]!, integro: "39000" }] } }), campo: "renovables2024.franja" },
    ]
    for (const { nombre, cambio, campo } of adversos) it(`rechaza sin importe: ${nombre}`, () => {
      const r = api.resolver([renovables2024(cambio(historia2024()))])
      expect(r._tag).toBe("Failure")
      if (r._tag === "Success") throw new Error("Adverso aceptado")
      expect(r.failure).toMatchObject({ _tag: "ResultadoNoSoportado", deduccionesTerritoriales2025: { aplicaciones: [
        { estado: "pendiente_hechos", resultado: expect.objectContaining({ estado: "no_soportado", siguienteHecho: campo }) },
      ] } })
    })
    it.each([2022, 2023])("no habilita origen%s ni rejuvenece caducidad", ejercicio => {
      const s = renovables2024()
      const h = historia2024()
      Reflect.set(h, "ejercicio", ejercicio)
      const r = api.resolver([{ ...s, historiaRenovablesMurcia2024: h }])
      expect(r._tag).toBe("Failure")
    })
    it("inventario con otra operación no se omite", () => {
      const s = renovables2024(), h = s.historialSaldosIncentivoMurcia!
      expect(api.resolver([{ ...s, historialSaldosIncentivoMurcia: { ...h, operaciones: [...h.operaciones, { objetoId: "otra", ejercicioOrigen: 2023, referencia: "otra" }] } }])._tag).toBe("Failure")
    })
    it("rechaza solicitud duplicada y cualquier magnitud fiscal externa", () => {
      expect(api.resolver([renovables2024(), renovables2024()])._tag).toBe("Failure")
      const s = renovables2024()
      for (const campo of ["baseGeneralEUR", "cuotaAutonomica", "saldo", "aplicado2024"]) {
        const h = historia2024()
        Reflect.set(h, campo, "1")
        expect(api.resolver([{ ...s, historiaRenovablesMurcia2024: h }])._tag).toBe("Failure")
      }
    })
    it("no admite nueva inversión2025 junto al saldo ni usa historia para otro incentivo", () => {
      expect(api.resolver([{ ...renovables2024(), hechos: { pagos: [] } }])._tag).toBe("Failure")
      expect(api.resolver([{ ...renovables2024(), codigo: "murcia_vehiculos_electricos" }])._tag).toBe("Failure")
    })
    it("referencias históricas no pueden financiar agua2025, en ningún orden", () => {
      const s = renovables2024(), a = agua(), p = a.hechos.pagos![0]!
      for (const cambios of [{ id: "p2024" }, { factura: "factura2024" }, { soportePago: "banco2024" }]) {
        const repetida = { ...a, hechos: { ...a.hechos, pagos: [{ ...p, ...cambios }] } }
        expect(api.resolver([s, repetida])._tag).toBe("Failure")
        expect(api.resolver([repetida, s])._tag).toBe("Failure")
      }
    })
    it("ayuda sin programa ni resolución no equivale a ayuda no integrable", () => {
      const h=historia2024()
      const r=api.resolver([renovables2024({...h,ayudas:[{id:"a",beneficiario:"s-1",instalacionId:"solar2024",
        fecha:"2024-07-01",importeEUR:"2000",soporte:"desconocida"}]})])
      expect(r._tag).toBe("Failure")
      if(r._tag==="Success")throw new Error("Ayuda no clasificada admitida")
      expect(JSON.stringify(r.failure)).toContain("renovables2024.ayuda.regimen")
    })
    it.each(["otro-titular","otra-instalacion","concesion-futura"])("rechaza concesión no conciliada: %s", caso => {
      const h=historia2024(), c={...concesion,
        beneficiario:caso==="otro-titular"?"otra-persona":concesion.beneficiario,
        instalacionId:caso==="otra-instalacion"?"otra":concesion.instalacionId,
        fecha:caso==="concesion-futura"?"2025-01-01":concesion.fecha}
      expect(api.resolver([renovables2024({...h,ayudas:[{id:"a",beneficiario:"s-1",instalacionId:"solar2024",
        fecha:"2024-07-01",importeEUR:"2000",soporte:"resolucion",concesion:c}]})])._tag).toBe("Failure")
    })
    it("pago bancario a persona distinta del instalador no acredita inversión",()=>{
      const h=historia2024()
      const r=api.resolver([renovables2024({...h,pagos:h.pagos.map(p=>({...p,beneficiario:"tercero"}))})])
      expect(r._tag).toBe("Failure")
      if(r._tag==="Success")throw new Error("Pago a tercero admitido")
      expect(JSON.stringify(r.failure)).toContain("renovables2024.pago")
    })
    it("sin nuevo contrato conserva productor_saldo_origen2024", () => {
      const { historiaRenovablesMurcia2024: omitida, ...s } = renovables2024()
      expect(omitida).toBeDefined()
      const r = api.resolver([s])
      expect(r._tag).toBe("Failure")
      if (r._tag === "Success") throw new Error("Historia omitida aceptada")
      expect(r.failure).toMatchObject({ deduccionesTerritoriales2025: { aplicaciones: [
        { resultado: expect.objectContaining({ siguienteHecho: "productor_saldo_origen:2024" }) },
      ] } })
    })
  })
}
