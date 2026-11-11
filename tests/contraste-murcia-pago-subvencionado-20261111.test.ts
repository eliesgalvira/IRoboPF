import { Effect } from "effect"
import Decimal from "decimal.js"
import { describe, expect, it } from "vitest"
import { derechos, magnitudes, solicitud } from "./f-auxiliares-revision-fixtures"
import { casoUniformeC36, casoExplicitoC36 } from "./c36-conexion-anual.fixtures"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual"
import { consumirCuotaAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-cuota"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"

// Revisión nueva: ningún esperado del autor se importa ni modifica.
// Setup reutilizado; matriz y oráculos propios del nuevo contraste.
function preparar(api: "uniforme" | "explicita", propio = "5000", ajeno = "1000", bruto = "32000") {
  const original = solicitud("murcia", true, propio)
  const aux = original.auxiliares!
  const pago = original.hechos.pagos![0]!
  const trabajo = casoExplicitoC36([]).trabajo
  const personas = ["s-1", "s-3"].map(id => ({
    id, soporte: "revision-certificado-" + id, vivoTodo2025: true as const,
    residenteComunTodo2025: true as const, modalidad: "individual" as const,
    // SAFETY: «murcia» pertenece a la unión del contrato de residencia de la fixture.
    residencia: { comunidad: "murcia" as "murcia" | "otra-comunidad-comun", desde: "2025-01-01" as const,
      hasta: "2025-12-31" as const, soporte: "residencia-anual" },
    economia: id === "s-1" ? { perfil: "declarante-en-composicion" as const } : {
      perfil: "solo-trabajo" as const, censoRentasCompleto: true as const, otrasRentas: "ninguna" as const,
      reduccionesBase: "ninguna" as const, saldosAnteriores: "ninguno" as const,
      trabajo: { ...trabajo, rendimientos: trabajo.rendimientos.map(r => ({ ...r, integro: bruto })) },
    },
  }))
  const s = { ...original, auxiliares: { ...aux,
    servicios: [...aux.servicios, { ...aux.servicios[0]!, pagoId: "rev-p2" }],
    pagadoresMurcia: { referencia: "revision-independiente", ejercicio: 2025 as const, contribuyente: "s-1",
      censo: "completo" as const, convivencia: "estable_desde_inicio2025_o_nacimiento" as const,
      hijos: [{ id: "s-2", nacimiento: "2025-02-01", progenitores: ["s-1", "s-3"], conviveCon: ["s-1", "s-3"],
        independienteConConsentimiento: false, apoyoJudicial: "ninguno" as const, soporte: "filiacion-padron" }], personas },
  }, hechos: { pagos: [{ ...pago }, { ...pago, id: "rev-p2", factura: "rev-f2", pagador: "s-3", importeEUR: ajeno }] } }
  // Renta nominal conciliada con economía ordinaria, nunca base externa en solicitud.
  const d = derechos("murcia", true, api === "uniforme" ? 2605600 : 2800000)
  const centimosBrutos = BigInt(bruto.replace(".", "").padEnd(bruto.includes(".") ? bruto.length - 1 : bruto.length + 2, "0"))
  const grafo = { ...d, descendientes: d.descendientes.map(h => ({ ...h, titulares: h.titulares.map(t =>
    t.titularId === "s-3" ? { ...t, rentasNoExentasCentimos: Number(centimosBrutos - 200000n) } : t) })) }
  const m = magnitudes("murcia", true)
  return { s, d: grafo, m: { ...m, caso: { ...m.caso, derechosMinimos: grafo } } }
}
type Perfil = ReturnType<typeof preparar>
function ejecutar(api: "uniforme" | "explicita", x: Perfil, sinDeduccion = false) {
  const deduccionesTerritoriales2025 = sinDeduccion ? undefined : { solicitudes: [x.s] }
  const baseUniforme = { ...casoUniformeC36(), comunidadAutonoma: "murcia" as const, derechosMinimos: x.d }
  const uniforme = deduccionesTerritoriales2025 === undefined
    ? baseUniforme : { ...baseUniforme, deduccionesTerritoriales2025 }
  const efecto = api === "uniforme"
    ? liquidarIrpfAnual(uniforme, { modo: "canonico" })
    : liquidarIrpfAnualExplicito({ ...casoExplicitoC36([]), comunidadAutonoma: "murcia", familiaresConDerechoMinimo: "segun-derechos",
      derechosMinimos: x.d, deduccionesTerritoriales2025: deduccionesTerritoriales2025 ?? { solicitudes: [] } })
  const combinado: Effect.Effect<Effect.Success<typeof efecto>, Effect.Error<typeof efecto>> = efecto
  return combinado
}

const matriz = [
 ["total ajena","5000","1000","32000","0","1000","500"],
 ["sin ayudas","5000","1000","32000","0","0","500"],
 ["parcial ajena","5000","1000","32000","0","999.99","500"],
 ["ajeno cero","5000","0","32000","0","0","1000"],
 ["ambos cero","0","0","32000","0","0","0"],
 ["propio cero","0","1000","32000","0","1000","0"],
 ["propia total","5000","1000","32000","5000","0","0"],
 ["propia parcial","5000","1000","32000","4000","1000","200"],
 ["base ajena30000","5000","1000","32000","0","1000","500"],
 ["base ajena30000.01","5000","1000","32000.01","0","1000","1000"],
 ["céntimo ajeno subvencionado","5000","0.01","32000","0","0.01","500"],
 ["sin transferencia ajena","1300","5000","32000","0","5000","260"],
] as const
for(const api of ["uniforme","explicita"] as const) describe(api,()=>{
 for(const [nombre,propio,ajeno,bruto,ap,aa,esperado] of matriz) it(nombre,()=>{
  const x=preparar(api,propio,ajeno,bruto)
  x.s.hechos.pagos[0]!.ayudasEUR=ap;x.s.hechos.pagos[1]!.ayudasEUR=aa
  const r=Effect.runSync(ejecutar(api,x)),libro=r.deduccionesTerritoriales2025!
  expect(libro.aplicaciones).toHaveLength(1)
  expect(libro.aplicaciones[0]!.generado).toEqual(racional(esperado))
  expect(libro.total).toEqual(racional(esperado))
  const sin=Effect.runSync(ejecutar(api,x,true))
  if('cuotaLiquidaCentimos' in r && 'cuotaLiquidaCentimos' in sin)
   expect(sin.cuotaLiquidaCentimos-r.cuotaLiquidaCentimos).toBe(Number(esperado)*100)
  else if('cuotaLiquidaLegal' in r && 'cuotaLiquidaLegal' in sin)
   expect(new Decimal(sin.cuotaLiquidaLegal).minus(r.cuotaLiquidaLegal).eq(esperado)).toBe(true)
  else throw new Error('API desconocida')
 })
 it("sin mínimo ajeno por residencia IRPF: contrato rechaza perfil incoherente",()=>{
  const x=preparar(api)
  x.d={...x.d,descendientes:x.d.descendientes.map((h,i)=>i!==0?h:{...h,
   titulares:h.titulares.map((t,j)=>j!==1?t:{...t,residenteIrpf:false})})}
  expect(Effect.runSync(Effect.flip(ejecutar(api,x)))._tag).toBe('ResultadoNoSoportado')
 })
 it("cuota escasa17.03 tras generado público",()=>{
  const x=preparar(api);x.s.hechos.pagos[1]!.ayudasEUR='1000'
  const r=Effect.runSync(ejecutar(api,x))
  expect(r.deduccionesTerritoriales2025!.aplicaciones[0]!.generado).toEqual(racional('500'))
  const libro=consumirCuotaAnualF2025(racional('17.03'),[x.s.codigo],[evaluarAnualF2025(x.s,x.m)])
  expect(libro.aplicaciones).toHaveLength(1);expect(libro.total).toEqual(racional('17.03'))
  expect(libro.aplicaciones[0]!.pendiente).toEqual(racional('482.97'));expect(libro.disponible).toEqual(racional('0'))
 })
})
it('mínimo nominal ajeno ausente en atribución: tope1000',()=>{
 const x=preparar('uniforme');x.s.hechos.pagos[1]!.ayudasEUR='1000'
 expect(evaluarAnualF2025(x.s,{...x.m,atribucionesMinimo:[{sujetoId:'s-2',titulares:['s-1']}]}).importeExactoRacional).toEqual(racional('1000'))
})

for (const api of ['uniforme','explicita'] as const) it(`${api}: cuota escasa real en API pública`,()=>{
 const x=preparar(api);x.s.hechos.pagos[1]!.ayudasEUR='1000'
 x.d={...x.d,descendientes:x.d.descendientes.map((h,i)=>i!==0?h:{...h,
  titulares:h.titulares.map((t,j)=>j!==0?t:{...t,rentasNoExentasCentimos:api==='uniforme'?1483360:1500000})})}
 const solicitudes={solicitudes:[x.s]}
 const r=api==='uniforme'
  ? Effect.runSync(liquidarIrpfAnual({...casoUniformeC36(),comunidadAutonoma:'murcia',derechosMinimos:x.d,rendimientos:{trabajo:[{importeIntegroCentimos:1800000}]},deduccionesTerritoriales2025:solicitudes},{modo:'canonico'}))
  : Effect.runSync(liquidarIrpfAnualExplicito({...casoExplicitoC36([]),comunidadAutonoma:'murcia',familiaresConDerechoMinimo:'segun-derechos',derechosMinimos:x.d,trabajo:{...casoExplicitoC36([]).trabajo,rendimientos:casoExplicitoC36([]).trabajo.rendimientos.map(t=>({...t,integro:'17000'}))},deduccionesTerritoriales2025:solicitudes}))
 const libro=r.deduccionesTerritoriales2025!,a=libro.aplicaciones[0]!
 expect(a.generado).toEqual(racional('500'))
 if(!('saldoEjercicio' in libro)) throw new Error('La aplicación de cuota no devuelve su saldo de ejercicio')
 const q=libro.saldoEjercicio.cuotaInicial
 const valor=new Decimal(q.numeradorEuros).div(q.divisor)
 expect(valor.gt(0)&&valor.lt(500)).toBe(true)
 expect(libro.total).toEqual(q);expect(a.aplicado).toEqual(q)
 expect(libro.aplicaciones).toHaveLength(1)
 if(a.pendiente===undefined) throw new Error('La cuota escasa no devuelve el importe pendiente')
 expect(new Decimal(a.pendiente.numeradorEuros).div(a.pendiente.divisor).plus(valor).eq(500)).toBe(true)
 expect(libro.disponible).toEqual(racional('0'))
})
