import invData from './aragon-dos-inversion.casos.json'
import socData from './aragon-dos-social.casos.json'
import { describe, it, expect } from 'vitest'
import { evaluarInversionAragonesa2025 as evaluar, prepararArrendadorSocial2025 as preparar } from '../lib/dominio/irpf/deducciones/aragon-dos-codigos-2025/index'
const inv=JSON.parse(JSON.stringify(invData))
const soc=JSON.parse(JSON.stringify(socData))
const base=()=>structuredClone(inv[0].entrada)
const vivienda=()=>structuredClone(soc[0].entrada)
function importe(h: ReturnType<typeof base>, exacto:string){const r=evaluar(h);expect(r.estado,JSON.stringify(r)).toBe('calculo_parcial');if(r.estado==='calculo_parcial')expect(r.importeExactoEuros).toBe(exacto)}
function rechazo(h: ReturnType<typeof base>){expect(evaluar(h).estado).toBe('no_soportado')}
describe('Oráculos monetarios independientes en céntimos racionales',()=>{
 for(const [centimos,esperado] of [[9999999,'0'],[10000000,'0'],[10000002,'0.004'],[10000003,'0.006'],[10000101,'0.202'],[11999999,'3999.998'],[12000002,'4000']] as const)it('inversión total '+centimos,()=>{
  const h=base();const i=h.inversiones[1];i.pago.importeCentimos=centimos-5000000;i.asignacion.estatalCentimos=Math.min(5000000,i.pago.importeCentimos);i.asignacion.aragonCentimos=Math.max(0,centimos-10000000);importe(h,esperado)
 })
 it('presentación a céntimos a ambos lados del medio céntimo',()=>{for(const [extra,cent] of [[2,0],[3,1]]){const h=base();const i=h.inversiones[1];i.pago.importeCentimos=5000000+extra;i.asignacion.aragonCentimos=extra;const r=evaluar(h);expect(r.estado).toBe('calculo_parcial');if(r.estado==='calculo_parcial')expect(r.importePresentadoCentimos).toBe(cent)}})
 it('cantidad regional voluntaria menor que exceso, sin optimizar',()=>{const h=base();h.inversiones[1].asignacion.aragonCentimos=12345;h.inversiones[1].asignacion.sinDeduccionCentimos=987655;importe(h,'24.69')})
 // Los esperados del autor se leen, nunca se reescriben. Oráculo entero independiente de Decimal/producto.
 for(const c of inv.filter((c: {exacto:string|null})=>c.exacto!==null))it('confrontación original '+c.nombre,()=>{let b=0n;for(const i of c.entrada.inversiones)b+=BigInt(i.asignacion.aragonCentimos);const n=b>2000000n?2000000n:b;const scaled=n*2n;const expected=(scaled/1000n).toString()+(scaled%1000n !== 0n?'.'+(scaled%1000n).toString().padStart(3,'0').replace(/0+$/,''):'');expect(c.exacto).toBe(expected)})
})
describe('Admisión, familia y cronología',()=>{
 for(const [n,d,admite] of [[39999999,100000000,true],[2,5,true],[40000001,100000000,false]] as const)for(const campo of ['capitalPropio','votoPropio'])it(campo+' frontera '+n+'/'+d,()=>{const h=base();for(const i of h.inversiones)for(const p of i.historialParticipacion)p[campo]={numerador:n,denominador:d};if(admite)importe(h,'2000');else rechazo(h)})
 for(const vinculo of ['conyuge','consanguinidad','afinidad'])for(const extra of [0,1])it(vinculo+' límite familiar +'+extra,()=>{const h=base();for(const i of h.inversiones)for(const p of i.historialParticipacion){p.capitalPropio={numerador:30,denominador:100};p.votoPropio={numerador:0,denominador:1};p.familiares=[{id:'familiar',vinculo,grado:vinculo==='conyuge'?0:2,capitalDirectoIndirecto:{numerador:10000000+extra,denominador:100000000},votoDirectoIndirecto:{numerador:0,denominador:1}}]}if(extra !== 0)rechazo(h);else importe(h,'2000')})
 for(const nombre of ['contribuyente','pagador'])it('identidad ajena '+nombre,()=>{const h=base();if(nombre==='contribuyente')h.inversiones[1].entidad=h.contribuyente;else h.inversiones[1].pago.pagador='ajeno';rechazo(h)})
 for(const [idx,offset,admite] of [[48,-1,true],[48,0,true],[48,1,false],[50,-1,true],[50,0,true],[50,1,false]] as const)it('plazo cinco/siete años '+idx+' '+offset,()=>{const h=structuredClone(inv[idx].entrada);if(offset !== 0){for(const i of h.inversiones){i.fechaSuscripcion=offset<0?'2025-02-28':'2025-03-02';i.pago.fecha=i.fechaSuscripcion;i.vinculacion[0].desde=i.fechaSuscripcion}}if(admite)importe(h,'2000');else rechazo(h)})
 it('fundador sin presencia en escritura no obtiene excepción',()=>{const h=structuredClone(inv[52].entrada);for(const i of h.inversiones)if(i.calificacion.tipo==='emergente-Ley28')i.calificacion.fundadoresEscritura=['otro'];rechazo(h)})
 for(const id of ['aragon_inversion_acciones_mab','aragon_inversion_economia_social'])it('incompatibilidad sólo estatal no contamina regional distinta '+id,()=>{const h=base();h.elecciones=[{codigo:id,inversion:h.inversiones[0].id}];importe(h,'2000')})
 for(const obtenido of [11000001,11000000,10999999])it('reinversión a ambos lados del importe obtenido '+obtenido,()=>{const h=structuredClone(inv[54].entrada);h.reinversion.transmisiones[0].importeTotalObtenidoCentimos=obtenido;if(obtenido>=11000000)importe(h,'0');else rechazo(h)})
 it('destino inexistente rechaza reinversión aunque importe cero',()=>{const h=structuredClone(inv[54].entrada);h.reinversion.inversionesDestino[0]='ajeno';rechazo(h)})
 it('cartera mixta permanece rechazada expresamente',()=>{const h=structuredClone(inv[54].entrada);h.reinversion.inversionesDestino.pop();rechazo(h)})
})
describe('Dependencia anual social concreta, sin sustitutos de cuota',()=>{
 for(const [desde,hasta,admite] of [['2024-12-31','2024-12-31',false],['2025-01-01','2025-01-01',true],['2025-12-31','2025-12-31',true],['2026-01-01','2026-01-01',false]] as const)it('intersección de cesión '+desde,()=>{const h=vivienda();const v=h.viviendas[0];v.cesion.desde=desde;v.cesion.hasta=hasta;v.rendimientos[0].desde=desde;v.rendimientos[0].hasta=hasta;expect(preparar(h).estado).toBe(admite?'requiere_atribucion_anual':'no_soportado')})
 for(const neto of ['0','-0.01','0.000000000000000000001','4000'])it('petición enlazada al productor para '+neto,()=>{const h=vivienda();const v=h.viviendas[0];v.participacionPuntosBasicos=1;const n=v.rendimientos[0];n.netoAntesReduccionesEuros=neto;n.reduccionArt23_2Euros='0';n.reduccionArt23_3Euros='0';n.netoReducidoEuros=neto;const r=preparar(h);expect(r.estado).toBe('requiere_atribucion_anual');if(r.estado==='requiere_atribucion_anual'){expect(r.peticion.sumaNetoReducidoEuros).toBe(neto);expect(r.peticion.rendimientos).toEqual([{vivienda:v.id,rendimiento:n.id,productor:n.procedencia.calculo,netoReducidoEuros:neto}]);expect(r.peticion.contribuyente).toBe(h.contribuyente);expect(r.peticion.casoAnual).toBe(h.casoAnual);expect(r.formula.numerador/r.formula.denominador).toBe(0.3)}expect(Object.keys(r).some(k=>/importe|cuota.*Euros/i.test(k))).toBe(false)})
 for(const campo of ['cuotaIntegraAutonomicaDerivadaEuros','tipoMarginal','tipoMedio','importeDeduccion'])it('rechazo de consignación externa '+campo,()=>{const h=vivienda();h[campo]='1000';expect(preparar(h).estado).toBe('no_soportado')})
 it('productor genérico no sustituye inmobiliario',()=>{const h=vivienda();h.viviendas[0].rendimientos[0].procedencia.tipo='composicion-anual';expect(preparar(h).estado).toBe('no_soportado')})
})
describe('Oráculo social racional independiente para esperados originales',()=>{
 for(const c of soc.filter((c:{neto:string|null})=>c.neto!==null))it(c.nombre,()=>{
  const scale=10n**60n
  const entero=(s:string)=>{const neg=s.startsWith('-');const [a,b='']=s.replace(/^-/,'').split('.');return (BigInt(a)*scale+BigInt(b.padEnd(60,'0')))*(neg?-1n:1n)}
  let total=0n
  for(const v of c.entrada.viviendas)for(const r of v.rendimientos){const neto=entero(r.netoAntesReduccionesEuros)-entero(r.reduccionArt23_2Euros)-entero(r.reduccionArt23_3Euros);expect(neto).toBe(entero(r.netoReducidoEuros));total+=neto}
  expect(total).toBe(entero(c.neto))
 })
})
