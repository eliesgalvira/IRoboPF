// Oráculo independiente y deliberadamente acotado a los cuatro hechos originales.
// No importa producto, Decimal ni tablas ejecutables; todos los importes son racionales BigInt EUR.
type Q = { n: bigint; d: bigint }
const q=(n:bigint,d=1n):Q=>({n,d})
const add=(a:Q,b:Q)=>q(a.n*b.d+b.n*a.d,a.d*b.d)
const sub=(a:Q,b:Q)=>q(a.n*b.d-b.n*a.d,a.d*b.d)
const mul=(a:Q,b:Q)=>q(a.n*b.n,a.d*b.d)
const le=(a:Q,b:Q)=>a.n*b.d<=b.n*a.d
const min=(a:Q,b:Q)=>le(a,b)?a:b
const max=(a:Q,b:Q)=>le(a,b)?b:a
const money=(s:string)=>{const [a='',b='']=s.split('.');return q(BigInt(a+b.padEnd(2,'0')),100n)}
export const equalRational=(a:Q,b:Q)=>a.n*b.d===b.n*a.d
export const present=(a:Q)=>{
 const negativo=a.n<0n, n=(negativo?-a.n:a.n)*100n
 const c=n/a.d+(n%a.d*2n>=a.d?1n:0n)
 return (negativo?'-':'')+(c/100n).toString()+'.'+(c%100n).toString().padStart(2,'0')
}
// Transcripción manual de escalas 2025: arts63/74 LIRPF, escalas autonómicas y mínimos AEAT.
const estatal=[['12450','0.095'],['20200','0.12'],['35200','0.15']] as const
// Los tipos son milésimas exactas; money sólo admite céntimos. Usar parser racional general.
const ratio=(s:string)=>{const [a='',b='']=s.split('.');return q(BigInt(a+b),10n**BigInt(b.length))}
function gravamen(base:Q,rows:readonly (readonly [string,string])[]){
 let prev=q(0n),total=q(0n)
 for(const [ceiling,rate] of rows){const upper=money(ceiling);total=add(total,mul(max(q(0n),sub(min(base,upper),prev)),ratio(rate)));prev=upper}
 if(!le(base,prev))throw Error('Fuera de alcance del oráculo')
 return total
}
const regiones={
 asturias:{minimo:'6105',rows:[['12450','0.09'],['17707.20','0.12'],['33007.20','0.14']]},
 andalucia:{minimo:'5790',rows:[['13000','0.095'],['21100','0.12'],['35200','0.15']]},
 madrid:{minimo:'5956.65',rows:[['13362.22','0.085'],['19004.63','0.107'],['35425.68','0.128']]},
} as const
export function oracle(region:keyof typeof regiones){
 const coste=sub(money('100000'),money('20000'))
 const amortizacion=mul(max(coste,money('50000')),q(3n,100n))
 const reparacion=min(money('12000'),money('1000'))
 const neto=sub(sub(money('12000'),reparacion),amortizacion)
 const rnr=mul(neto,q(1n,2n)) // contrato2024, sin circunstancias incrementadas
 const trabajo=sub(sub(money('30000'),money('1950')),money('2000'))
 const base=add(trabajo,rnr), r=regiones[region]
 const cuotaEstatal=sub(gravamen(base,estatal),gravamen(money('5550'),estatal))
 // Asturias publica cuota acumulada 1751.36 en 17707.20, no 1751.364.
 // El oráculo usa la fila legal, sin reconstruir esa cuota sumando tramos.
 const gravamenAutonomico=region==='asturias'
  ? add(money('1751.36'),mul(sub(base,money('17707.20')),ratio('0.14')))
  : gravamen(base,r.rows)
 const cuotaAutonomica=sub(gravamenAutonomico,gravamen(money(r.minimo),r.rows))
 const cuota=add(cuotaEstatal,cuotaAutonomica)
 return {amortizacion,neto,rnr,trabajo,base,cuotaEstatal,cuotaAutonomica,cuota,diferencial:sub(cuota,money('4200'))}
}
