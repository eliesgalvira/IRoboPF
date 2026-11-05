import { describe, expect, it } from "vitest"
import { Effect, Schema } from "effect"
import { CasoPagadoresCatalunya2025 } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
function textos(...ids: string[]) { return ids }
function rendimiento(id: string, integro: string) {
  return { id, clase: "empleo-laboral", integro,
    cotizaciones: { clase: "efectivas", seguridadSocial: "0", derechosPasivos: "0", colegiosHuerfanos: "0" },
    sindicato: { importe: "0", satisfecho: "no" },
    colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" },
    defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" } }
}
function caso(principal = "20000", restante = "2000") {
  const altas: { regimen: string; desde: string; hasta: string; referencia: string }[] = []
  const imv: { expediente: string; miembroUnidad: string; referencia: string }[] = []
  const aportaciones: { operacionId: string; importe: string; referencia: string }[] = []
  return { ejercicio: 2025, comunidadAutonoma: "catalunya", edad: 40, modalidad: "individual", residenciaTodoElAnio: true,
    devengo: "2025-12-31", otrasRentas: "ninguna", familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna",
    reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: "territoriales-por-hechos-y-da61", rentasExtranjeras: "ninguna", especialidades: "ninguna",
    perfil: "trabajo-pagadores-catalunya-2025", contribuyenteId: "titular",
    conciliacion: { ejercicio: 2025, estado: "totales-anuales-sin-duplicados", procedencia: ["certificados2025"] },
    trabajo: { ejercicio: 2025, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna",
      rendimientos: [rendimiento("a", principal), rendimiento("b", restante)] },
    retenciones: [{ operacionId: "ret-a", procedencia: "cert-a", contribuyenteId: "titular", ejercicio: 2025, importe: "100", efectiva: true },
      { operacionId: "ret-b", procedencia: "cert-b", contribuyenteId: "titular", ejercicio: 2025, importe: "100", efectiva: true }],
    deduccionesTerritoriales2025: { solicitudes: [{ lote: "A40", codigo: "cataluna_obligacion_declarar_mas_de_un_pagador", nacimiento: "1985-01-01",
      hechos: { ejercicio: 2025, titular: "titular", censo: "todos-los-rendimientos-y-retenciones-2025", referenciaCenso: "censo2025",
        pagadores: [{ nif: "A12345674", naturaleza: "persona-juridica-residente", concepto: "salario-ordinario", certificado: "cert-a", integro: principal, rendimientos: textos("a"), retenciones: textos("ret-a") },
          { nif: "B12345674", naturaleza: "persona-juridica-residente", concepto: "salario-ordinario", certificado: "cert-b", integro: restante, rendimientos: textos("b"), retenciones: textos("ret-b") }],
        altasCuentaPropia: altas, prestacionesIMV: imv, aportacionesPrevision: aportaciones } }] } }
}
function ejecutar(raw: Schema.Json, canonica: boolean) {
  const c = Schema.decodeUnknownSync(CasoPagadoresCatalunya2025)(raw, { onExcessProperty: "error" })
  return canonica ? liquidarIrpfAnual(c, { modo: "canonico" }) : liquidarIrpfAnualExplicito(c)
}
describe.each([false, true])("pagadores API canónica=%s", canonica => {
  it("reutiliza cuotas internas y resta retenciones una vez", () => {
    const r = Effect.runSync(ejecutar(caso(), canonica))
    expect(r).toMatchObject({ baseImponibleGeneral: "20000", componentesCuota: { cuotaEstatal: "1561.5", cuotaAutonomica: "1597.75" }, cuotaLiquidaLegal: "3123", retenciones: "200", cuotaDiferencial: "2923", aceptacionFiscal: "pendiente" })
  })
  it("orden de certificados/rendimientos/retenciones no decide principal", () => {
    const c = caso();c.trabajo.rendimientos.reverse();c.retenciones.reverse();c.deduccionesTerritoriales2025.solicitudes[0]!.hechos.pagadores.reverse()
    expect(Effect.runSync(ejecutar(c, canonica)).cuotaLiquidaLegal).toBe("3123")
  })
  it.each([{"bruto": "15875.99", "restantes": "2000", "habilita": false, "cuotas": {"base": "8365.9725", "estatal": "267.52", "autonomica": "267.52", "deduccion": "0", "liquida": "535.04"}, "principal": "13875.99"}, {"bruto": "15876", "restantes": "2000", "habilita": false, "cuotas": {"base": "8366", "estatal": "267.52", "autonomica": "267.52", "deduccion": "0", "liquida": "535.04"}, "principal": "13876"}, {"bruto": "15876.01", "restantes": "2000", "habilita": true, "cuotas": {"base": "8366.0275", "estatal": "267.52", "autonomica": "267.52", "deduccion": "0", "liquida": "535.04"}, "principal": "13876.01"}, {"bruto": "15877", "restantes": "2000", "habilita": true, "cuotas": {"base": "8368.75", "estatal": "267.78", "autonomica": "267.78", "deduccion": "0", "liquida": "535.56"}, "principal": "13877"}, {"bruto": "21999.99", "restantes": "2000", "habilita": true, "cuotas": {"base": "19999.99", "estatal": "1561.5", "autonomica": "1597.75", "deduccion": "36.25", "liquida": "3123"}, "principal": "19999.99"}, {"bruto": "22000", "restantes": "2000", "habilita": true, "cuotas": {"base": "20000", "estatal": "1561.5", "autonomica": "1597.75", "deduccion": "36.25", "liquida": "3123"}, "principal": "20000"}, {"bruto": "22000.01", "restantes": "2000", "habilita": false, "cuotas": {"base": "20000.01", "estatal": "1561.5", "autonomica": "1597.75", "deduccion": "36.25", "liquida": "3123"}, "principal": "20000.01"}, {"bruto": "22001", "restantes": "2000", "habilita": false, "cuotas": {"base": "20001", "estatal": "1561.62", "autonomica": "1597.88", "deduccion": "36.26", "liquida": "3123.24"}, "principal": "20001"}, {"bruto": "21000", "restantes": "1499.99", "habilita": false, "cuotas": {"base": "19000", "estatal": "1441.5", "autonomica": "1472.75", "deduccion": "31.25", "liquida": "2883"}, "principal": "19500.01"}, {"bruto": "21000", "restantes": "1500", "habilita": false, "cuotas": {"base": "19000", "estatal": "1441.5", "autonomica": "1472.75", "deduccion": "31.25", "liquida": "2883"}, "principal": "19500"}, {"bruto": "21000", "restantes": "1500.01", "habilita": true, "cuotas": {"base": "19000", "estatal": "1441.5", "autonomica": "1472.75", "deduccion": "31.25", "liquida": "2883"}, "principal": "19499.99"}, {"bruto": "21000", "restantes": "1501", "habilita": true, "cuotas": {"base": "19000", "estatal": "1441.5", "autonomica": "1472.75", "deduccion": "31.25", "liquida": "2883"}, "principal": "19499"}, {"bruto": "21000", "restantes": "2499.99", "habilita": true, "cuotas": {"base": "19000", "estatal": "1441.5", "autonomica": "1472.75", "deduccion": "31.25", "liquida": "2883"}, "principal": "18500.01"}, {"bruto": "21000", "restantes": "2500", "habilita": true, "cuotas": {"base": "19000", "estatal": "1441.5", "autonomica": "1472.75", "deduccion": "31.25", "liquida": "2883"}, "principal": "18500"}, {"bruto": "21000", "restantes": "2500.01", "habilita": true, "cuotas": {"base": "19000", "estatal": "1441.5", "autonomica": "1472.75", "deduccion": "31.25", "liquida": "2883"}, "principal": "18499.99"}])("frontera %j", (o) => {
    const principal = o.principal
    const result = Effect.runSync(Effect.result(ejecutar(caso(principal, o.restantes), canonica)))
    if (o.habilita) {
      expect(result._tag).toBe("Success")
      if (result._tag === "Success") expect(result.success).toMatchObject({ componentesCuota: { cuotaEstatal: o.cuotas.estatal, cuotaAutonomica: o.cuotas.autonomica }, cuotaLiquidaLegal: o.cuotas.liquida })
    } else expect(result._tag).toBe("Failure")
  })
  it.each(["mismo-nif", "importe", "duplicado", "omitido", "certificado", "retencion-duplicada", "retencion-ajena", "sin-identidad", "pension", "tipo-fijo", "no-retiene", "reta", "imv", "prevision", "titular"])("rechaza %s con motivo", razon => {
    const c = caso(), h = c.deduccionesTerritoriales2025.solicitudes[0]!.hechos
    if (razon === "mismo-nif") h.pagadores[1]!.nif = h.pagadores[0]!.nif
    if (razon === "importe") h.pagadores[0]!.integro = "19999.99"
    if (razon === "duplicado") h.pagadores[1]!.rendimientos = textos("a")
    if (razon === "omitido") c.trabajo.rendimientos.push(rendimiento("omitido", "1"))
    if (razon === "certificado") { h.pagadores[1]!.certificado = "cert-a"; h.pagadores[1]!.nif = h.pagadores[0]!.nif }
    if (razon === "retencion-duplicada") h.pagadores[1]!.retenciones = textos("ret-a")
    if (razon === "retencion-ajena") h.pagadores[1]!.retenciones = textos("inexistente")
    if (razon === "sin-identidad") c.retenciones[0]!.contribuyenteId = "otro"
    if (razon === "pension") { c.trabajo.rendimientos.forEach(r => { r.clase = "pension" });h.pagadores.forEach(p => { p.concepto = "prestacion-pasiva" }) }
    if (razon === "tipo-fijo") h.pagadores[0]!.concepto = "administrador"
    if (razon === "no-retiene") h.pagadores[0]!.naturaleza = "persona-fisica"
    if (razon === "reta") h.altasCuentaPropia.push({ regimen: "RETA", desde: "2025-01-01", hasta: "2025-01-01", referencia: "alta" })
    if (razon === "imv") h.prestacionesIMV.push({ expediente: "imv", miembroUnidad: "titular", referencia: "resolucion" })
    if (razon === "prevision") h.aportacionesPrevision.push({ operacionId: "pp", importe: "1", referencia: "cert" })
    if (razon === "titular") h.titular = "otro"
    const r = Effect.runSync(Effect.result(ejecutar(c, canonica)))
    expect(r._tag).toBe("Failure")
    if (r._tag === "Failure") expect(r.failure).toMatchObject({ _tag: "ResultadoNoSoportado" })
  })
  it("R1: dos NIF distintos pueden usar la misma referencia local de certificado", () => {
    const c = caso(), h = c.deduccionesTerritoriales2025.solicitudes[0]!.hechos
    h.pagadores.forEach(p => { p.certificado = "cert0" })
    expect(Effect.runSync(ejecutar(c, canonica))).toMatchObject({ cuotaLiquidaLegal: "3123", retenciones: "200", cuotaDiferencial: "2923" })
  })
  it("R1: el mismo NIF no puede reutilizar un certificado aunque haya otro pagador", () => {
    const c = caso("18000", "2000"), h = c.deduccionesTerritoriales2025.solicitudes[0]!.hechos
    c.trabajo.rendimientos.push(rendimiento("c", "2000"))
    h.pagadores.push({ ...h.pagadores[0]!, integro: "2000", rendimientos: textos("c"), retenciones: textos() })
    const error = Effect.runSync(Effect.flip(ejecutar(c, canonica)))
    expect(error._tag).toBe("ResultadoNoSoportado")
    expect(error.motivo).toContain("certificado repetido")
  })
  it("agrega certificados del mismo NIF antes de ordenar y contar", () => {
    const c = caso("18000", "2000"), h = c.deduccionesTerritoriales2025.solicitudes[0]!.hechos
    c.trabajo.rendimientos.push(rendimiento("c", "2000"))
    h.pagadores.push({ ...h.pagadores[0]!, certificado: "cert-c", integro: "2000", rendimientos: textos("c"), retenciones: textos() })
    const r = Effect.runSync(ejecutar(c, canonica))
    expect(r).toMatchObject({ cuotaLiquidaLegal: "3123", retenciones: "200" })
  })
  it("pensión y empleo mezclados permanecen rechazados", () => {
    const c = caso();c.trabajo.rendimientos[1]!.clase = "pension"
    expect(Effect.runSync(Effect.result(ejecutar(c, canonica)))._tag).toBe("Failure")
  })
  it("rechaza cuota/base/obligación fiscal externa en contrato", () => {
    const c = caso(), s = c.deduccionesTerritoriales2025.solicitudes[0]!
    expect(() => ejecutar({ ...c, deduccionesTerritoriales2025: { solicitudes: [{ ...s, hechos: { ...s.hechos, obligadoDeclarar: true, cuotaIntegraEstatalCentimos: 1 } }] } }, canonica)).toThrow()
  })
})
