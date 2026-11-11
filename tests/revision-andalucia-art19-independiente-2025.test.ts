import { Effect, Result, Schema } from "effect"
import { describe, expect, it } from "vitest"
import { analitico, efectivo, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial-esquemas"
import { consumirCuota } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
function ejecutarOError<A, E>(programa: Effect.Effect<A, E>): A {
  const salida = Effect.runSync(Effect.result(programa))
  if (Result.isFailure(salida)) throw new Error(JSON.stringify(salida.failure))
  return salida.success
}


// Oráculo propio: no importa reglas, redondeos ni esperados del autor.
class Fraction {
  readonly n: bigint
  readonly d: bigint
  constructor(n: bigint, d = 1n) {
    if (d <= 0n) throw new Error("denominador no positivo")
    let a = n < 0n ? -n : n, b = d
    while (b !== 0n) { const r = a % b; a = b; b = r }
    const g = a === 0n ? 1n : a; this.n = n / g; this.d = d / g
  }
  static of(s: string | number) {
    const v = String(s)
    if (!/^-?\d+(\.\d+)?$/.test(v)) throw new Error(`decimal inesperado ${v}`)
    const [a, b = ""] = v.split(".")
    return new Fraction(BigInt(a + b), 10n ** BigInt(b.length))
  }
  add(x: Fraction) { return new Fraction(this.n*x.d+x.n*this.d, this.d*x.d) }
  sub(x: Fraction) { return new Fraction(this.n*x.d-x.n*this.d, this.d*x.d) }
  mul(x: Fraction) { return new Fraction(this.n*x.n, this.d*x.d) }
  min(x: Fraction) { return this.n*x.d <= x.n*this.d ? this : x }
  max(x: Fraction) { return this.n*x.d >= x.n*this.d ? this : x }
  cents() { // presentación positiva: céntimo más próximo, mitad hacia arriba
    if (this.n < 0n) throw new Error("importe negativo")
    return new Fraction((this.n*200n+this.d)/(2n*this.d), 100n)
  }
  transport() { return { numeradorEuros: String(this.n), divisor: String(this.d) } }
  number() { return Number(this.n)/Number(this.d) }
}
const F = Fraction.of, zero = F(0)
const generado = (centimos: number) => new Fraction(BigInt(centimos), 100n).mul(new Fraction(1n,5n)).min(F(500))
function fixture(cuotas = 312345, brutoAjeno = "37000", mayor = false) {
  return { lote: "A40", codigo: "andalucia_ayuda_domestica", nacimiento: "1985-04-09", hechos: {
    titularTGSS: "s-42", afiliacionAndalucia: "CCC-sevilla-2025", viviendaHabitual: "domicilio-empleador",
    vinculoPareja: "conyuge", personaPareja: "s-42", registroPareja: "asiento-civil-2011",
    nacimientoPareja: mayor ? "1950-12-31" : "1984-06-01",
    hijos: mayor ? [] : [{persona:"s-43", nacimiento:"2017-01-01",clase:"descendiente",titulares:["s-41","s-42"],
      referenciaDerechos:"minimo-anual-43",diasConvivencia:365,discapacidad:0,asistencia:"sin-incremento"}],
    empleado:"empleado-hogar-A",cuotas:[{id:"ss-empleador-A",fecha:"2025-10-15",pagador:"s-42",importeCentimos:cuotas,
      medio:"transferencia",justificante:"recibo-TGSS-empleador",regimen:"personal",conyuges:[]}],eleccionBeneficiario:"s-41",
    parejaOrdinaria:{contribuyente:"s-41",persona:"s-42",administracionRegistro:"civil",desde:"2011-01-01",
      residenteComunTodo2025:true,vivoTodo2025:true,
      declaracion:{persona:"s-42",ejercicio:2025,modalidad:"individual",soporte:"constancia-declaracion-42"},
      economia:{perfil:"solo-trabajo",censoRentasCompleto:true,otrasRentas:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",
        trabajo:{...efectivo.trabajo,rendimientos:efectivo.trabajo.rendimientos.map(r=>({...r,id:"pagador-42",integro:brutoAjeno,
          cotizaciones:{...r.cotizaciones,seguridadSocial:"0"}}))}},
      eleccion:{titulares:["s-41","s-42"],beneficiario:"s-41",otraPersonaNoAplica:true,soporte:"acuerdo-eleccion-41"}}
  }}
}
type Fixture = ReturnType<typeof fixture>
type FixtureAdversa = Omit<Fixture,"hechos"> & {hechos: Omit<Fixture["hechos"],"parejaOrdinaria"> & {parejaOrdinaria?: Fixture["hechos"]["parejaOrdinaria"] & {hasta?: string}}}
function entradas(d: Fixture, propio = 30000) {
  // Sólo reutiliza formas de hechos existentes, nunca resultados de pruebas.
  // Perfil analítico 30000: SS ordinaria 1944; explícito: SS efectiva 0.
  const rentaAjena = F(d.hechos.parejaOrdinaria.economia.trabajo.rendimientos[0]!.integro).sub(F(2000)).max(zero).mul(F(100)).number()
  const minimos = (rentaPropia: number) => ({...derechos,territorio:"andalucia" as const,contribuyenteId:"s-41",
    descendientes:derechos.descendientes.map(h=>({...h,sujetoId:"s-43",discapacidad:d.hechos.hijos[0]?.discapacidad===65?{_tag:"Discapacidad65OMas" as const}:h.discapacidad,titulares:h.titulares.map((t,i)=>({...t,
      titularId:i===0?"s-41":"s-42",rentasNoExentasCentimos:i===0?rentaPropia:rentaAjena}))}))})
  const familia = d.hechos.hijos.length > 0
  const a={...analitico,contribuyenteId:"s-41",comunidadAutonoma:"andalucia" as const,
      rendimientos:{trabajo:[{importeIntegroCentimos:propio*100}]}}
  const e={...efectivo,contribuyenteId:"s-41",comunidadAutonoma:"andalucia" as const,
      familiaresConDerechoMinimo:familia?"segun-derechos" as const:"ninguno" as const,
      trabajo:{...efectivo.trabajo,rendimientos:efectivo.trabajo.rendimientos.map(r=>({...r,integro:String(propio),
        cotizaciones:{...r.cotizaciones,seguridadSocial:"0"}}))}}
  if (familia) { a.derechosMinimos=minimos(2605600); e.derechosMinimos=minimos(2800000) }
  return {a,e}
}
const decode = (solicitudes: unknown[]) => Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({solicitudes},{onExcessProperty:"error"})
function correr(api: "analitica" | "explicita", d: Fixture, solicitudes: unknown[], propio = 30000) {
  const {a,e}=entradas(d,propio)
  const s=decode(solicitudes)
  if(api==="analitica") {
    const b=ejecutarOError(liquidarIrpfAnual(a,{modo:"canonico"}))
    const r=ejecutarOError(liquidarIrpfAnual({...a,deduccionesTerritoriales2025:s},{modo:"canonico"}))
    return {delta:new Fraction(BigInt(b.cuotaLiquidaCentimos-r.cuotaLiquidaCentimos),100n),base:r.baseLiquidableGeneralCentimos,generado:r.deduccionesTerritoriales2025!.aplicaciones[0]!.generado}
  }
  const b=ejecutarOError(liquidarIrpfAnualExplicito(e))
  const r=ejecutarOError(liquidarIrpfAnualExplicito({...e,deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s}))
  expect(r.baseLiquidableGeneral).toEqual(b.baseLiquidableGeneral)
  return {delta:F(String(b.cuotaLiquidaLegal)).sub(F(String(r.cuotaLiquidaLegal))),base:r.baseLiquidableGeneral,generado:r.deduccionesTerritoriales2025!.aplicaciones[0]!.generado}
}
const defensa = {lote:"A40",codigo:"andalucia_defensa_juridica_laboral",nacimiento:"1985-04-09",hechos:{procedimientos:[{
  id:"reclamacion-salario",clase:"reclamacion-cantidades",expedienteJudicial:"autos-41",pagos:[{
    id:"honorarios-41",fecha:"2025-09-02",pagador:"s-41",importeCentimos:20000,medio:"transferencia",
    justificante:"factura-autos-41",regimen:"personal",conyuges:[]}]}]}}
for(const api of ["analitica","explicita"] as const) describe(`revisión independiente art19 ${api}`,()=>{
  it.each([0,1,123456,249998,249999,250000,250001,999999])("20%% y tope sin prorratear: %s céntimos",c=>{
    const d=fixture(c), esperado=generado(c)
    const r=correr(api,d,[d])
    expect(r.generado).toEqual(esperado.transport())
    if(api==="explicita") expect(r.delta).toEqual(esperado)
  })
  it.each(["0.01","1200","7999.99","8000.01","25000.01","120000"])("íntegro ajeno %s, sin umbral art17",bruto=>{
    const d=fixture(312345,bruto)
    expect(correr(api,d,[d]).delta).toEqual(F(500))
  })
  it.each(["conyuge","pareja-inscrita"])("elección íntegra con %s; TGSS del beneficiario",vinculo=>{
    const d=fixture(); d.hechos.vinculoPareja=vinculo
    d.hechos.parejaOrdinaria.administracionRegistro=vinculo==="conyuge"?"civil":"otra-administracion-publica"
    d.hechos.titularTGSS="s-41";d.hechos.cuotas[0]!.pagador="s-41"
    expect(correr(api,d,[d]).delta).toEqual(F(500))
  })
  it("no presentación y pensión son compatibles con la vía hijos",()=>{
    const d=fixture();d.hechos.parejaOrdinaria.declaracion.modalidad="no-presenta"
    const r=d.hechos.parejaOrdinaria.economia.trabajo.rendimientos[0]!
    d.hechos.parejaOrdinaria.economia.trabajo.rendimientos=[{...r,clase:"pension"}]
    expect(correr(api,d,[d]).delta).toEqual(F(500))
  })
  it("75 años del miembro ajeno permite ausencia de ingresos e hijos",()=>{
    const d=fixture(312345,"0",true)
    const raw={...d,hechos:{...d.hechos,parejaOrdinaria:{...d.hechos.parejaOrdinaria,
      economia:{perfil:"sin-rentas",censoRentasCompleto:true}}}}
    expect(correr(api,d,[raw]).delta).toEqual(F(500))
  })
  it("74 años sin hijos no accede a la alternativa75",()=>{
    const d=fixture(312345,"0",true);d.hechos.nacimientoPareja="1951-01-01"
    expect(()=>correr(api,d,[d])).toThrow(/hijos/)
  })
  it("íntegro propio externo no sustituye rendimientos derivados",()=>{
    const d=fixture(),raw={...d,hechos:{...d.hechos,trabajoTitularCentimos:99999999}}
    expect(()=>correr(api,d,[raw])).toThrow()
  })
  it.each([0,16200])("cuota propia escasa/cero y orden de otras deducciones, bruto %s",bruto=>{
    const d=fixture(312345,"0",true)
    const uno=correr(api,d,[d,defensa],bruto).delta, dos=correr(api,d,[defensa,d],bruto).delta
    expect(uno).toEqual(dos)
    if(bruto===0) expect(uno).toEqual(zero)
    else if(api==="explicita") {
      // Art20 usa bruto sin SS: 7302 - 1.75*(16200-14852) = 4943.
      // Base9257; cuota329.365, salida legal329.37.
      const reduccion=F(7302).sub(F(bruto).sub(F(14852)).mul(new Fraction(7n,4n)))
      const disponible=F(bruto).sub(F(2000)).sub(reduccion).sub(F(5790)).mul(new Fraction(19n,200n)).cents()
      expect(uno).toEqual(disponible)
      expect(correr(api,d,[d],bruto).delta).toEqual(disponible)
    } else { expect(uno.number()).toBeGreaterThan(0);expect(uno.number()).toBeLessThan(500) }
  })
  it.each([false,true])("art18.3 con empleado igual: %s (otro empleado compatible)",mismo=>{
    const d=fixture();d.hechos.hijos[0]!.discapacidad=65;d.hechos.hijos[0]!.asistencia="ayuda-terceros"
    const asistencia={lote:"A40",codigo:"andalucia_asistencia_personas_discapacidad",nacimiento:d.nacimiento,
      hechos:{personas:d.hechos.hijos,asistencia:[{persona:"s-43",necesidadTerceros:"asistencia-acreditada",
        empleado:mismo?d.hechos.empleado:"empleado-asistencia-B",titularTGSS:"s-41",afiliacionAndalucia:"CCC-asistencia",
        cuotas:[{...d.hechos.cuotas[0]!,id:"ss-asistencia-B",justificante:"recibo-TGSS-asistencia",pagador:"s-41",importeCentimos:100000}]}]}}
    if(mismo) expect(()=>correr(api,d,[d,asistencia])).toThrow(/incompatib/i)
    else expect(correr(api,d,[d,asistencia]).delta).toEqual(F(750)) // 500 + 100/2 + 1000*20%
  })
  it("art18.1 sin empleado asistente conserva compatibilidad",()=>{
    const d=fixture();d.hechos.hijos[0]!.discapacidad=65
    const asistencia={lote:"A40",codigo:"andalucia_asistencia_personas_discapacidad",nacimiento:d.nacimiento,
      hechos:{personas:d.hechos.hijos,asistencia:[]}}
    expect(correr(api,d,[d,asistencia]).delta).toEqual(F(550))
  })
  const adversos: [string,(d:Fixture)=>FixtureAdversa,RegExp][] = [
    ["sin hechos pareja",d=>{const {parejaOrdinaria:omitida,...hechos}=d.hechos;expect(omitida.persona).toBe("s-42");return {...d,hechos}},/hechos civiles|pareja/],
    ["sin íntegro ajeno",d=>{d.hechos.parejaOrdinaria.economia.trabajo.rendimientos[0]!.integro="0";return d},/rendimientos|laborales|actividad/],
    ["persona propia como pareja",d=>{d.hechos.parejaOrdinaria.persona="s-41";return d},/identidad|pareja/i],
    ["otro contribuyente",d=>{d.hechos.parejaOrdinaria.contribuyente="s-99";return d},/identidad/i],
    ["TGSS externo",d=>{d.hechos.titularTGSS="s-99";return d},/TGSS/],
    ["pago ajeno",d=>{d.hechos.cuotas[0]!.pagador="s-99";return d},/pagador|contribuyente|pago/i],
    ["sin afiliación",d=>{d.hechos.afiliacionAndalucia=" ";return d},/referencia|Pattern|pattern|filter|Expected/i],
    ["elección doble",d=>{d.hechos.parejaOrdinaria.eleccion.otraPersonaNoAplica=false;return d},/true|Expected|Literal/i],
    ["censo duplicado",d=>{d.hechos.parejaOrdinaria.eleccion.titulares=["s-41","s-41"];return d},/elección/],
    ["beneficiario distinto",d=>{d.hechos.eleccionBeneficiario="s-42";return d},/elección/i],
    ["registro civil para pareja inscrita",d=>{d.hechos.vinculoPareja="pareja-inscrita";return d},/registro/],
    ["fecha imposible",d=>{d.hechos.parejaOrdinaria.desde="2023-02-29";return d},/Fecha civil/],
    ["fin antes del devengo",d=>({...d,hechos:{...d.hechos,parejaOrdinaria:{...d.hechos.parejaOrdinaria,hasta:"2025-12-30"}}}),/estable/],
    ["alta parcial (límite perfil)",d=>{d.hechos.parejaOrdinaria.desde="2025-02-01";return d},/estable/],
    ["declaración de tercero",d=>{d.hechos.parejaOrdinaria.declaracion.persona="s-99";return d},/declaración/],
    ["conjunta (límite perfil)",d=>{d.hechos.parejaOrdinaria.declaracion.modalidad="conjunta";return d},/conjunta/],
    ["nacimiento propio contradice edad",d=>{d.nacimiento="1950-12-31";return d},/nacimiento propio/],
    ["mínimo con nacimiento contradictorio",d=>{d.hechos.hijos[0]!.nacimiento="2016-01-01";return d},/Edad|Nacimiento|nacimiento/],
    ["titulares mínimo incompletos",d=>{d.hechos.hijos[0]!.titulares=["s-41"];return d},/titulares|censo/],
  ]
  it.each(adversos)("rechazo causal: %s",(_nombre,mutar,motivo)=>{
    const d=fixture(), raw=mutar(d)
    expect(()=>correr(api,d,[raw])).toThrow(motivo)
  })
  it.each([
    {perfil:"solo-trabajo",baseGeneral:"0"},
    {perfil:"actividad",integro:"1"},
    {perfil:"declarante-en-composicion"},
    {perfil:"sin-rentas",censoRentasCompleto:true,cuota:"500"},
  ])("economía externa/incompleta no sustituye hechos: %j",economia=>{
    const d=fixture(),raw={...d,hechos:{...d.hechos,parejaOrdinaria:{...d.hechos.parejaOrdinaria,economia}}}
    expect(()=>correr(api,d,[raw])).toThrow()
  })
  it("renta neta censada no puede igualarse al íntegro",()=>{
    const d=fixture(), {a,e}=entradas(d)
    const alterar=(m:NonNullable<typeof a.derechosMinimos>)=>({...m,descendientes:m.descendientes.map(h=>({...h,
      titulares:h.titulares.map(t=>t.titularId==="s-42"?{...t,rentasNoExentasCentimos:3700000}:t)}))})
    const s=decode([d])
    if(api==="analitica") expect(()=>ejecutarOError(liquidarIrpfAnual({...a,derechosMinimos:alterar(a.derechosMinimos!),deduccionesTerritoriales2025:s},{modo:"canonico"}))).toThrow(/renta|mínimo/i)
    else expect(()=>ejecutarOError(liquidarIrpfAnualExplicito({...e,derechosMinimos:alterar(e.derechosMinimos!),deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s}))).toThrow(/renta|mínimo/i)
  })
})
it("libro racional: conservación, prioridad del orden recibido, ninguna cuota negativa",()=>{
  for(const disponible of [zero,new Fraction(97n,7n),F("105.26"),F(900)]) for(const importes of [[F(500),F(200)],[F(200),F(500)]]) {
    let queda=disponible, total=zero
    const esperado=importes.map(g=>{const a=queda.min(g);queda=queda.sub(a);total=total.add(a)
      return {generado:g.transport(),aplicado:a.transport(),pendiente:g.sub(a).transport()}})
    const r=consumirCuota(disponible.transport(),importes.map(x=>x.transport()))
    expect(r).toEqual({total:total.transport(),disponible:queda.transport(),aplicaciones:esperado})
    expect(total.add(queda)).toEqual(disponible)
  }
})
