// Oráculo independiente: sólo aritmética BigInt y hechos, sin importar producto.
// Fuentes selladas en suelo-desconocido-2025.fuentes.json: F2 y F3, RIRPF14.2.a.
type Q={n:bigint;d:bigint}
const cents=(s:string)=>{const [e='0',c='']=s.split('.');return BigInt(e+c.padEnd(2,'0'))}
export const igual=(a:Q,b:Q)=>a.n*b.d===b.n*a.d
export function oraculo(precio:string,gastos:string,suelo:string,construccion:string){
 const total=cents(suelo)+cents(construccion)
 if(total<=0n)throw new RangeError('Sin catastro')
 const coste={n:(cents(precio)+cents(gastos))*cents(construccion),d:100n*total}
 const cat={n:cents(construccion),d:100n}
 const base=coste.n*cat.d>cat.n*coste.d?coste:cat
 const amortizacion={n:base.n*3n,d:base.d*100n}
 const neto={n:11000n*amortizacion.d-amortizacion.n,d:amortizacion.d}
 return {coste,amortizacion,neto,rnr:{n:neto.n,d:neto.d*2n}}
}
