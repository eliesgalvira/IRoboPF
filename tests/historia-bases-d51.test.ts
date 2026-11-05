import { describe, expect, it } from "vitest"
import { Effect, Result, Schema } from "effect"
import Decimal from "decimal.js"
import { SolicitudDeduccionesTerritoriales2025, aplicarDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import type { MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { HistoriaBasesD51, producirHistoriaBasesD51 } from "../lib/dominio/irpf/deducciones/historia-bases-d51"
import { crearSesionD51 } from "../lib/dominio/irpf/deducciones/d51-anual"
import { SolicitudD51 } from "../lib/dominio/irpf/deducciones/d51-anual-esquemas"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import corpus from "./fixtures/historia-bases-d51.json"
import oraculos from "./fixtures/historia-bases-d51-oraculos.json"

const D = Decimal.clone({ precision: 80 })
type Sobre = typeof SolicitudDeduccionesTerritoriales2025.Type
type Territorio = "castilla-la-mancha" | "extremadura"
type EntradaFixture = Omit<typeof corpus[number]["solicitud"], "historiaBases"> & { readonly historiaBases?: typeof corpus[number]["solicitud"]["historiaBases"] }
function sobre(s: EntradaFixture): Sobre { return Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({solicitudes:[s]}, {onExcessProperty:"error"}) }
function marco(territorio: Territorio, cuota = "10000"): MagnitudesTerritorialesAnuales {
  return { caso: { anio: 2025, comunidadAutonoma: territorio, contribuyenteId:"s-1", situacionFamiliar:{tipo:"individual",edad:30,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]} }, baseGeneral:new D(15000),baseAhorro:new D(0),minimoPersonalFamiliar:new D(5550),cuotaAutonomica:new D(cuota),sujetosConMinimo:[] }
}
function territorio(codigo: string): Territorio { return codigo.startsWith("clm_") ? "castilla-la-mancha" : "extremadura" }
function igual(x: { readonly numeradorEuros: string; readonly divisor: string } | undefined, n: bigint, d = 1n): void {
  if (x === undefined) throw new Error("Falta racional")
  expect(BigInt(x.numeradorEuros)*d).toBe(n*BigInt(x.divisor))
}
function clasico(s: Sobre, t: Territorio): CasoFiscalAnual {
  return {anio:2025,comunidadAutonoma:t,contribuyenteId:"s-1",situacionFamiliar:{tipo:"individual",edad:30,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:2500000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0,deduccionesTerritoriales2025:s}
}
function efectivo(s: Sobre, t: Territorio): CasoFiscalAnualExplicito {
  return {ejercicio:2025,comunidadAutonoma:t,contribuyenteId:"s-1",edad:30,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s,rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"r",clase:"empleo-laboral",integro:"25000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[]}
}
for (const c of corpus) {
  const t = territorio(c.codigo)
  it(c.id+": productor interno, reutiliza evaluador y tope anual", () => {
    const s=sobre(c.solicitud), r=aplicarDeduccionesTerritoriales2025(s,marco(t))
    igual(r.total,BigInt(c.generado));igual(r.aplicaciones[0]?.generado,BigInt(c.generado))
  })
  it(c.id+": agotamiento de cuota no altera generación ni inventa aplicación histórica", () => {
    const r=aplicarDeduccionesTerritoriales2025(sobre(c.solicitud),marco(t,"0"))
    igual(r.total,0n);igual(r.aplicaciones[0]?.generado,BigInt(c.generado));igual(r.aplicaciones[0]?.pendiente,BigInt(c.generado))
  })
  for (const api of ["canonica","efectiva"] as const) {
    it(c.id+":"+api+": cuota compartida una sola vez", () => {
      const s=sobre(c.solicitud)
      const r=api==="canonica"?Effect.runSync(liquidarIrpfAnual(clasico(s,t),{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito(efectivo(s,t)))
      const libro=r.deduccionesTerritoriales2025
      if(libro===undefined)throw new Error("Sin libro anual")
      igual(libro.aplicaciones[0]?.generado,BigInt(c.generado))
      const a=libro.aplicaciones[0]?.aplicado
      if(a===undefined)throw new Error("Sin aplicación")
      expect(BigInt(a.numeradorEuros)*BigInt(libro.total.divisor)).toBe(BigInt(libro.total.numeradorEuros)*BigInt(a.divisor))
    })
    it(c.id+":"+api+": titular, objeto y operaciones no intercambian historia", () => {
      const original=sobre(c.solicitud).solicitudes[0]
      if(original===undefined||!("historiaBases" in original)||original.historiaBases===undefined)throw new Error("Falta historia")
      const h=original.historiaBases
      const historias=[
        {...h,titular:"otro-contribuyente"},
        {...h,objeto:"otra-cuenta-o-vivienda"},
        {...h,operaciones:h.operaciones.map(p=>({...p,titular:"otro-contribuyente"}))},
        {...h,operaciones:h.operaciones.map(p=>({...p,objeto:"otra-cuenta-o-vivienda"}))},
      ]
      for(const historiaBases of historias){
        const corrupta={solicitudes:[{...original,historiaBases}]}
        const r=api==="canonica"?Effect.runSync(Effect.flip(liquidarIrpfAnual(clasico(corrupta,t),{modo:"canonico"}))):Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(efectivo(corrupta,t))))
        expect(r._tag).toBe("ResultadoNoSoportado");expect("importe" in r).toBe(false)
      }
    })
    it(c.id+":"+api+": saldo fiscal externo se rechaza en frontera pública", () => {
      const original=sobre(c.solicitud).solicitudes[0]
      if(original===undefined||!("historiaBases" in original)||original.historiaBases===undefined)throw new Error("Falta historia")
      const corrupta={solicitudes:[{...original,historiaBases:{...original.historiaBases,saldoFiscal:"0"}}]}
      const r=api==="canonica"?Effect.runSync(Effect.flip(liquidarIrpfAnual(clasico(corrupta,t),{modo:"canonico"}))):Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(efectivo(corrupta,t))))
      expect(r._tag).toBe("ResultadoNoSoportado");expect("importe" in r).toBe(false)
    })
    it(c.id+":"+api+": falta historia no equivale a cero", () => {
      const {historiaBases: historiaOmitida,...sinHistoria}=c.solicitud
      expect(historiaOmitida.censo).toBe("completo-desde-primera-operacion")
      const s=sobre(sinHistoria)
      const r=api==="canonica"?Effect.runSync(Effect.flip(liquidarIrpfAnual(clasico(s,t),{modo:"canonico"}))):Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(efectivo(s,t))))
      expect(r._tag).toBe("ResultadoNoSoportado");expect(r.motivo).toMatch(/censo histórico/);expect("importe" in r).toBe(false)
    })
  }
}
const primero=corpus[0]
if(primero===undefined)throw new Error("Falta fixture")
const historia=Schema.decodeUnknownSync(HistoriaBasesD51)(primero.solicitud.historiaBases)
const contexto={codigo:"clm_adquisicion_rehabilitacion_vivienda_zonas_rurales",titular:"s-1",objeto:"vivienda-1",fechaOperacion:"2025-01-02",pagos:[{id:"p-1",importe:"15000",pagador:"s-1",fecha:"2025-01-02"}],costePropio:"200000"} as const
const doc={referencia:"renta2024",emisor:"AEAT",fecha:"2025-06-01"}
describe("historia por origen, no saldo fiscal externo",()=>{
  it("saldo derivado cero conserva semántica base aplicada, no cuota",()=>{
    const h=producirHistoriaBasesD51(historia,contexto)
    expect(h.semantica).toBe("base-aplicada-vivienda");expect(h.magnitud.valor).toBe("0");expect(h.origenNormativo).toBe(2021)
  })
  it("operación2024 con no solicitud documentada produce cero en2025",()=>{
    const h={...historia,objetos:historia.objetos.map(o=>({...o,primeraOperacion:"2024-01-02",documento:{...o.documento,fecha:"2024-01-02"}})),operaciones:[{...historia.operaciones[0]!,id:"p-ant",fecha:"2024-01-02",importe:"5000",documento:{...doc,referencia:"p-ant",fecha:"2024-01-02"}},...historia.operaciones],aplicaciones:[{ejercicio:2024,titular:"s-1",objeto:"vivienda-1",estado:"no-solicitada",documento:doc}]}
    const dec=Schema.decodeUnknownSync(HistoriaBasesD51)(h)
    expect(producirHistoriaBasesD51(dec,contexto).magnitud.valor).toBe("0")
    expect(()=>producirHistoriaBasesD51({...dec,aplicaciones:[]},contexto)).toThrow(/falta aplicación/)
    expect(()=>producirHistoriaBasesD51({...dec,aplicaciones:[{...dec.aplicaciones[0]!,estado:"aplicacion-no-reconstruida"}]},contexto)).toThrow(/base efectivamente aplicada/)
  })
  it("cuota/base fiscal externa se rechaza en niveles anidados",()=>{
    for(const h of [{...historia,baseHistorica:"0"},{...historia,operaciones:historia.operaciones.map(p=>({...p,baseAplicada:"15000"}))},{...historia,objetos:historia.objetos.map(o=>({...o,cuotaDeducida:"0"}))}])expect(Result.isFailure(Schema.decodeUnknownResult(HistoriaBasesD51)(h,{onExcessProperty:"error"}))).toBe(true)
  })
  it("titular,objeto,duplicados,fechas,primera operación y pagos deben conciliar",()=>{
    const p=historia.operaciones[0]!
    for(const h of [{...historia,titular:"otro"},{...historia,objeto:"otro"},{...historia,operaciones:[p,p]},{...historia,operaciones:[{...p,fecha:"2025-02-30"}]},{...historia,operaciones:[{...p,importe:"14999.99"}]},{...historia,operaciones:[]}])expect(()=>producirHistoriaBasesD51(h,contexto)).toThrow(/HistoriaD51/)
  })
  it("transmisión no se convierte en ganancia exenta cero",()=>{
    expect(()=>producirHistoriaBasesD51({...historia,transmisiones:[{objeto:"vivienda-1",fecha:"2025-06-01",documento:doc}]},contexto)).toThrow(/reinversión/)
  })
  it("el consumidor no aplica tope total dos veces ni confunde base y cuota",()=>{
    const s=Schema.decodeUnknownSync(SolicitudD51)(primero.solicitud)
    const r=crearSesionD51(marco("castilla-la-mancha")).evaluar(s)
    if(r.estado!=="calculo_parcial")throw new Error(r.motivo)
    expect(r.importeExacto).toBe("1800")
  })
})

for(const c of oraculos.casos)it("Fraction independiente: "+c.codigo+"/"+c.importe,()=>{
  const f=corpus.find(x=>x.codigo===c.codigo)
  if(f===undefined)throw new Error("Falta caso")
  const decoded=Schema.decodeUnknownSync(SolicitudD51)(f.solicitud)
  if(!("historiaBases" in decoded)||decoded.historiaBases===undefined)throw new Error("Falta historia")
  const h={...decoded.historiaBases,operaciones:decoded.historiaBases.operaciones.map(p=>({...p,importe:c.importe}))}
  const sesion=crearSesionD51(marco(territorio(c.codigo),"100000"))
  let r
  switch(decoded.codigo){
    case "clm_ahorro_inversion_primera_vivienda":r=sesion.evaluar({...decoded,historiaBases:h,hechos:{...decoded.hechos,saldoFin:c.importe}});break
    case "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales":r=sesion.evaluar({...decoded,historiaBases:h,hechos:{...decoded.hechos,pagos:decoded.hechos.pagos.map(p=>({...p,importe:c.importe}))}});break
    case "extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler":r=sesion.evaluar({...decoded,historiaBases:h,hechos:{...decoded.hechos,pagos:decoded.hechos.pagos.map(p=>({...p,importe:c.importe}))}});break
    case "extremadura_vivienda_zonas_rurales":r=sesion.evaluar({...decoded,historiaBases:h,hechos:{...decoded.hechos,pagos:decoded.hechos.pagos.map(p=>({...p,importe:c.importe}))}});break
    default:throw new Error("Código de otro corte")
  }
  if(r.estado!=="calculo_parcial")throw new Error(r.motivo)
  const [n,d="1"]=c.generado.split("/")
  if(n===undefined)throw new Error("Oráculo incompleto")
  if (Schema.is(Schema.String)(r.importeExacto)) {
    expect(new D(r.importeExacto).times(d).eq(n)).toBe(true)
  } else {
    igual(r.importeExacto, BigInt(n), BigInt(d))
  }
})

it("cuenta abierta2024: saldo previo es dinero, no deducción anterior",()=>{
  const f=corpus.find(c=>c.codigo==="clm_ahorro_inversion_primera_vivienda")
  if(f===undefined)throw new Error("Falta cuenta")
  const h=Schema.decodeUnknownSync(HistoriaBasesD51)(f.solicitud.historiaBases)
  const apertura="2024-01-02",docAnt={referencia:"deposito-ant",emisor:"banco",fecha:apertura}
  const entrada={...h,objetos:h.objetos.map(o=>({...o,primeraOperacion:apertura,documento:docAnt})),operaciones:[{...h.operaciones[0]!,id:"deposito-ant",fecha:apertura,importe:"9000",documento:docAnt},...h.operaciones]}
  const libro=producirHistoriaBasesD51(entrada,{codigo:"clm_ahorro_inversion_primera_vivienda",titular:"s-1",objeto:"cuenta-1",fechaOperacion:apertura,pagos:[],costePropio:"0"})
  expect(libro.origenNormativo).toBe(2025);expect(libro.semantica).toBe("cuota-deducida-cuenta")
  expect(libro.magnitud.valor).toBe("0");expect(libro.saldoInicioCuenta).toBe("9000");expect(libro.saldoFinCuenta).toBe("10000")
})
it("rehabilitación alquiler con pagos2024: la regla9ter comienza2025",()=>{
  const f=corpus.find(c=>c.codigo==="extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler")
  if(f===undefined)throw new Error("Falta alquiler")
  const h=Schema.decodeUnknownSync(HistoriaBasesD51)(f.solicitud.historiaBases)
  const primera="2024-01-02",docAnt={referencia:"obra-ant",emisor:"contratista",fecha:primera}
  const entrada={...h,objetos:h.objetos.map(o=>({...o,primeraOperacion:primera,documento:docAnt})),operaciones:[{...h.operaciones[0]!,id:"obra-ant",fecha:primera,importe:"10000",documento:docAnt},...h.operaciones]}
  const libro=producirHistoriaBasesD51(entrada,{codigo:"extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler",titular:"s-1",objeto:"vivienda-1",fechaOperacion:primera,pagos:[{id:"p-1",importe:"15000",pagador:"s-1",fecha:"2025-01-02"}],costePropio:"200000"})
  expect(libro.origenNormativo).toBe(2025);expect(libro.magnitud.valor).toBe("0")
})

it("año anterior sin pagos: no exige autoliquidación fiscal de base inexistente",()=>{
  const h={...historia,objetos:historia.objetos.map(o=>({...o,primeraOperacion:"2023-01-02",documento:{...o.documento,fecha:"2023-01-02"}})),operaciones:[{...historia.operaciones[0]!,id:"p2023",fecha:"2023-01-02",importe:"5000",documento:{...doc,referencia:"p2023",fecha:"2023-01-02"}},...historia.operaciones],aplicaciones:[{ejercicio:2023,titular:"s-1",objeto:"vivienda-1",estado:"no-solicitada",documento:doc}]}
  const dec=Schema.decodeUnknownSync(HistoriaBasesD51)(h)
  // Censo completo:2023 no solicitada;2024 sin operación ni generación;2025 se evalúa.
  expect(producirHistoriaBasesD51(dec,contexto).magnitud.valor).toBe("0")
})

it("registro de aplicación de otro titular/objeto no acredita ausencia de consumo",()=>{
  const h={...historia,objetos:historia.objetos.map(o=>({...o,primeraOperacion:"2024-01-02",documento:{...o.documento,fecha:"2024-01-02"}})),operaciones:[{...historia.operaciones[0]!,id:"p2024",fecha:"2024-01-02",importe:"5000",documento:{...doc,referencia:"p2024",fecha:"2024-01-02"}},...historia.operaciones],aplicaciones:[{ejercicio:2024,titular:"s-1",objeto:"vivienda-1",estado:"no-solicitada",documento:doc}]}
  const dec=Schema.decodeUnknownSync(HistoriaBasesD51)(h)
  for(const cambio of [{titular:"s-otro",objeto:"vivienda-1"},{titular:"s-1",objeto:"vivienda-otra"}]){
    expect(()=>producirHistoriaBasesD51({...dec,aplicaciones:dec.aplicaciones.map(a=>({...a,...cambio}))},contexto)).toThrow(/aplicación de otro titular/)
  }
})
it("historia de dos cuentas no compensa saldos ni usa otro titular",()=>{
  const f=corpus.find(c=>c.codigo==="clm_ahorro_inversion_primera_vivienda")
  if(f===undefined)throw new Error("Falta cuenta")
  const h=Schema.decodeUnknownSync(HistoriaBasesD51)(f.solicitud.historiaBases)
  const ctx={codigo:"clm_ahorro_inversion_primera_vivienda",titular:"s-1",objeto:"cuenta-1",fechaOperacion:"2025-01-02",pagos:[],costePropio:"0"} as const
  const o=h.objetos[0]
  if(o===undefined)throw new Error("Falta cuenta")
  expect(()=>producirHistoriaBasesD51({...h,objetos:[o,{...o,id:"cuenta-otra"}]},ctx)).toThrow(/cuenta única/)
  expect(()=>producirHistoriaBasesD51(h,{...ctx,titular:"s-otro"})).toThrow(/titular/)
})

// P2-01: la división por365 conserva la fracción normativa en ambas API.
for (const api of ["canonica", "efectiva"] as const) {
  for (const dias of [0, 1, 73, 182, 364, 365]) {
    it(`rehabilitación EXT ${dias}/365 exacta: ${api}`, () => {
      const fixture = corpus[2]
      if (fixture === undefined) throw new Error("Falta fixture EXT")
      const solicitud = Schema.decodeUnknownSync(SolicitudD51)(fixture.solicitud)
      if (solicitud.codigo !== "extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler")
        throw new Error("La fixture debe ser de rehabilitación EXT")
      const s = Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({
        solicitudes: [{ ...solicitud, hechos: { ...solicitud.hechos, diasRequisitos: dias } }],
      }, { onExcessProperty: "error" })
      const r = api === "canonica"
        ? Effect.runSync(liquidarIrpfAnual(clasico(s, "extremadura"), { modo: "canonico" }))
        : Effect.runSync(liquidarIrpfAnualExplicito(efectivo(s, "extremadura")))
      igual(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado, 1356n * BigInt(dias), 365n)
      const sinCuota = aplicarDeduccionesTerritoriales2025(s, marco("extremadura", "0"))
      igual(sinCuota.aplicaciones[0]?.pendiente, 1356n * BigInt(dias), 365n)
      igual(sinCuota.total, 0n)
    })
  }
}
