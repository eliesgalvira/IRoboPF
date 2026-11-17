import oraculos from "./familia-cuantizacion-open2025.oraculos.json"
import Decimal from "decimal.js"
import { DateTime, Effect, Result, Schema, SchemaIssue } from "effect"
import { describe, expect, it } from "vitest"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion"
import { CasoFiscalAnualExplicitoBase } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { componerLiquidacionAnual, type EntradaComposicionAnual } from "../lib/dominio/irpf/liquidacion/composicion-anual"
import { cuantizarGravamenFamilia2025, seleccionarCuantizacionFamilia2025 } from "../lib/dominio/irpf/cuotas/politica-familia-open-2025"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"
import { validarDerechosMinimos } from "../lib/dominio/irpf/minimos/derechos"

// Esperados monetarios literales: transcripción del oráculo independiente.
// Nunca se calculan usando las funciones de producto bajo prueba.
const { vectores } = Schema.decodeUnknownSync(Schema.Struct({
  vectores: Schema.Array(Schema.Struct({
    id: Schema.String, entrada: Schema.Unknown, base: Schema.String, minimos: Schema.Array(Schema.String),
    gravamenesExactos: Schema.Array(Schema.String),
    casillas: Schema.Array(Schema.Struct({ casilla: Schema.String, importe: Schema.String })),
    soloCuotas: Schema.String, soloFinal: Schema.String,
  })),
}))(oraculos)
const entrada = (v: typeof vectores[number]) => {
  const c = Schema.decodeUnknownSync(CasoFiscalAnualExplicitoBase)(v.entrada)
  if (c.perfil !== "solo-trabajo" || c.ejercicio !== 2025) throw Error("Vector laboral 2025 requerido")
  return c
}
const D = Decimal.clone({ precision: 80 })
const esperado = (v: typeof vectores[number], box: string) => v.casillas.find(c => c.casilla === box)!.importe
const normal = (s: string) => new D(s).toFixed(2)
function composicion(v: typeof vectores[number]): EntradaComposicionAnual {
  const c = entrada(v)
  if (c.perfil !== "solo-trabajo" || c.ejercicio !== 2025) throw Error("Vector no laboral")
  const bruto = c.trabajo.rendimientos.reduce((s,r) => s.plus(r.integro), new D(0))
  const cot = c.trabajo.rendimientos.reduce((s,r) => s.plus(r.cotizaciones.seguridadSocial)
    .plus(r.cotizaciones.derechosPasivos).plus(r.cotizaciones.colegiosHuerfanos), new D(0))
  return {
    hechosFamiliaOpen2025: c, precision: 80,
    politica: c.comunidadAutonoma === "madrid" ? "open-empleo-madrid-2025" : "decimal-hasta-salida",
    origenBaseGeneralB: "solo-trabajo", cotizaciones: { naturaleza: "efectivas", trabajador: cot },
    ambito: { contribuyenteId: c.contribuyenteId, anio: c.ejercicio, comunidadAutonoma: c.comunidadAutonoma,
      derechosMinimos: c.derechosMinimos, situacionFamiliar: { tipo: "individual", edad: c.edad,
        discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } },
    baseGeneral: new D(v.base), baseAhorro: new D(0), rentasAntesReducciones: new D(v.base),
    rentasTrabajoAnuales: { integroTrabajo: bruto, restoRentas: new D(0) }, serviciosLaborales: { bruto },
    minimosEstatales: MINIMOS_ESTATALES_2025, deduccionesAutonomicasCentimos: 0,
  }
}
describe("Familia ordinaria: cuatro gravámenes antes de mínimos", () => {
  it("contiene 22 originales sin sustituir esperados oficiales", () => expect(vectores).toHaveLength(22))
  for (const v of vectores) {
    it(v.id + ": todos los componentes y casillas", () => {
      const r = Effect.runSync(liquidarIrpfAnualExplicito(entrada(v)))
      const campos = ["gravamenEstatal", "gravamenAutonomico", "gravamenMinimoEstatal", "gravamenMinimoAutonomico", "cuotaEstatal", "cuotaAutonomica"] as const
      for (const [i, k] of campos.entries()) expect(normal(r.componentesCuota[k])).toBe(esperado(v, ["0528","0529","0530","0531","0532","0533"][i]!))
      expect(normal(r.baseLiquidableGeneral)).toBe(normal(v.base))
      expect(normal(r.baseImponibleGeneral)).toBe(normal(v.base))
      expect(r.baseLiquidableAhorro).toBe("0")
      expect(r.reduccionArt20).toBe("0")
      expect(r.deduccionTrabajo).toBe("0")
      expect(normal(r.cuotaLiquidaLegal)).toBe(esperado(v,"0587"))
      expect(normal(r.cuotaPosterior)).toBe(esperado(v,"0587"))
      expect(normal(r.cuotaDiferencial)).toBe(esperado(v,"0610"))
      expect(r.cuotaDiferencialPresentada).toBe(esperado(v,"0670"))
      for (const [site, gravamen, minimo] of [["estatal", "0528", "0530"], ["autonomica", "0529", "0531"]]) {
        const lineas = r.rastro.pasos.flatMap(p => p.lineasCalculo ?? []).filter(l => l.origen?.siteId === `anual.explicito.cuota.${site}`)
        expect(lineas).toHaveLength(1)
        expect(lineas[0]!.formula).toContain("gravámenes familiares a céntimos Open 2025")
        expect(lineas[0]!.formula).toContain(`${esperado(v,gravamen!)} − ${esperado(v,minimo!)}`)
      }
      const s = Effect.runSync(componerLiquidacionAnual(composicion(v)))
      expect(s.politicaCuantizacionFamilia).toBe("open-familia-cuatro-gravamenes-2025")
      expect(s.minimoPersonalYFamiliar.toFixed(2)).toBe(v.minimos[0])
      expect(s.minimoPersonalYFamiliarAutonomico.toFixed(2)).toBe(v.minimos[1])
      // Las cuatro expectativas raw son independientes de la implementación.
      const cuotas = [s.cuotaIntegraGeneralEstatal,s.cuotaIntegraGeneralAutonomica,s.cuotaMinimoPersonalEstatal,s.cuotaMinimoPersonalAutonomica]
      cuotas.forEach((x,i) => expect(x.toFixed(2)).toBe(esperado(v,["0528","0529","0530","0531"][i]!)))
      v.gravamenesExactos.forEach((raw,i) => expect(cuantizarGravamenFamilia2025(new D(raw)).toFixed(2))
        .toBe(esperado(v,["0528","0529","0530","0531"][i]!)))
    })
  }
  it("Andalucía refuta redondear sólo cuotas netas; Canarias sólo resultado", () => {
    const a = vectores.find(v => v.id === "open2025-andalucia-11")!
    const c = vectores.find(v => v.id === "open2025-canarias-02")!
    expect(a.soloCuotas).toBe("429.23")
    expect(esperado(a,"0670")).toBe("429.22")
    expect(c.soloFinal).toBe("226.79")
    expect(esperado(c,"0670")).toBe("226.80")
    // Comprueba la frontera en el producto y no sólo la aritmética del oráculo.
    const s = Effect.runSync(componerLiquidacionAnual(composicion(a)))
    expect(s.cuotaMinimoPersonalAutonomica.toFixed(2)).toBe("669.28")
    expect(s.cuotaAutonomicaGeneralDespuesMinimo.toFixed(2)).toBe("2280.22")
    expect(cuantizarGravamenFamilia2025(new D("5264.625")).toFixed(2)).toBe("5264.63")
  })
  it("redondea el gravamen completo, no cada tramo (adversa aritmética sintética)", () => {
    const tramos = [new D("1.004"),new D("2.004")]
    expect(cuantizarGravamenFamilia2025(tramos[0]!.plus(tramos[1]!)).toFixed(2)).toBe("3.01")
    expect(tramos.map(x=>cuantizarGravamenFamilia2025(x)).reduce((a,b)=>a.plus(b)).toFixed(2)).toBe("3.00")
  })
  const base = () => composicion(vectores.find(v => v.id === "open2025-andalucia-11")!)
  const conDerechos = (e: EntradaComposicionAnual, h: NonNullable<EntradaComposicionAnual["ambito"]["derechosMinimos"]>): EntradaComposicionAnual => {
    const c=e.hechosFamiliaOpen2025!
    if (c.perfil !== "solo-trabajo" || c.ejercicio !== 2025) throw Error("Control 2025 requerido")
    return {...e,hechosFamiliaOpen2025:{...c,derechosMinimos:h},ambito:{...e.ambito,derechosMinimos:h}}
  }
  const exclusiones: [string, (e: EntradaComposicionAnual) => EntradaComposicionAnual][] = [
    ["sin hechos explícitos", e=>({...e,hechosFamiliaOpen2025:undefined})],
    ["cotizaciones estimadas", e=>({...e,cotizaciones:{...e.cotizaciones,naturaleza:"estimadas-perfil-uniforme"}})],
    ["ahorro", e=>({...e,baseAhorro:new D(1)})],
    ["art20", e=>({...e,rentasAntesReducciones:e.baseGeneral.plus(1)})],
    ["base inferior al mínimo", e=>({...e,baseGeneral:new D(1)})],
    ["otra deducción", e=>({...e,deduccionesAutonomicasCentimos:1})],
    ["territorio fuera del censo observado", e=>{
      const c=e.hechosFamiliaOpen2025!
      if (c.perfil !== "solo-trabajo" || c.ejercicio !== 2025) throw Error("Control 2025 requerido")
      return {...e,ambito:{...e.ambito,comunidadAutonoma:"illes-balears"},hechosFamiliaOpen2025:{...c,comunidadAutonoma:"illes-balears"}}
    }],
    ["discapacidad propia", e=>({...e,ambito:{...e.ambito,situacionFamiliar:{...e.ambito.situacionFamiliar,discapacidad:{_tag:"Discapacidad65OMas"}}}})],
    ["fallecimiento", e=>({...e,ambito:{...e.ambito,fechaFallecimiento:DateTime.toDateUtc(DateTime.makeUnsafe("2025-06-01T00:00:00Z"))}})],
    ["otro año", e=>({...e,ambito:{...e.ambito,anio:2024}})],
    ["rentas sin conciliar", e=>({...e,rentasAntesReducciones:e.baseGeneral.plus("0.01")})],
    ["base no finita", e=>({...e,baseGeneral:new D(NaN)})],
    ["tercer titular", e=>{ const h=e.ambito.derechosMinimos!; const d=h.descendientes[0]!;
      return conDerechos(e,{...h,descendientes:[{...d,titulares:[...d.titulares,{...d.titulares[0]!,titularId:"s-99"}]}]}) }],
    ["varios miembros", e=>{ const h=e.ambito.derechosMinimos!; return conDerechos(e,{...h,descendientes:[...h.descendientes,{...h.descendientes[0]!,sujetoId:"s-98"}]}) }],
  ]
  it.each(exclusiones)("no selecciona: %s", (_, cambiar) => {
    // Estas mutaciones originales son exclusiones del selector. La validación
    // de composición se comprueba aparte con canales y motivos concretos.
    const seleccionar = (e: EntradaComposicionAnual) => seleccionarCuantizacionFamilia2025(
      e, new D("6750"), new D("7045"), [{ sujetoId: "s-3", titulares: ["s-1", "s-2"] }]
    )
    expect(seleccionar(base())).toBe("open-familia-cuatro-gravamenes-2025")
    expect(seleccionar(cambiar(base()))).toBeUndefined()
  })
  it("reserva de ascendientes del consumidor general sigue cerrada", () => {
    const c=entrada(vectores.find(v=>v.id==="open2025-canarias-02")!)
    const r = Effect.runSync(Effect.result(validarDerechosMinimos(c.derechosMinimos!,"general")))
    if (Result.isSuccess(r)) throw Error("Se esperaba la reserva de ascendientes")
    expect(r.failure).toMatchObject({ _tag: "DerechosMinimosNoSoportados",
      motivo: "Ascendientes limitados al productor ordinario2025 Madrid/CLM/Valencia" })
  })
  it("la API explícita rechaza retención con fracción de céntimo", () => {
    const v=vectores[0]!, c=entrada(v)
    const invalida={...c,retenciones:c.retenciones.map((r,i)=>i===0?{...r,importe:"4200.001"}:r)}
    const r = Schema.decodeUnknownResult(CasoFiscalAnualExplicitoBase)(invalida)
    if (Result.isSuccess(r)) throw Error("Se esperaba rechazo de la fracción de céntimo")
    expect(r.failure._tag).toBe("AnyOf")
    const diagnostico = SchemaIssue.makeFormatterDefault()(r.failure)
    expect(diagnostico).toContain("retenciones")
    expect(diagnostico).toContain("4200.001")
  })
})
