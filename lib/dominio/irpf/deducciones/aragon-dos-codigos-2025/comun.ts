import Decimal from "decimal.js"
import { Schema } from "effect"

export const D = Decimal.clone({precision:80,rounding:Decimal.ROUND_HALF_UP})
export const Texto = Schema.String.check(Schema.isMinLength(1))
export const Entero = Schema.Number.check(Schema.isInt(),Schema.isGreaterThanOrEqualTo(0),Schema.isLessThanOrEqualTo(Number.MAX_SAFE_INTEGER))
export const Centimos = Entero
export const SaldoCentimos = Schema.Number.check(Schema.isInt(),Schema.isGreaterThanOrEqualTo(-Number.MAX_SAFE_INTEGER),Schema.isLessThanOrEqualTo(Number.MAX_SAFE_INTEGER))
export const Puntos = Schema.Number.check(Schema.isInt(),Schema.isGreaterThanOrEqualTo(0),Schema.isLessThanOrEqualTo(10000))
export const Contexto = { ejercicio:Schema.Literal(2025),territorio:Schema.Literal("aragon"),modalidad:Schema.Literal("individual"),
 devengo:Schema.Literal("2025-12-31"),contribuyente:Texto,casoAnual:Texto }
export const Ambito=Schema.Struct(Contexto)
export type Ambito=typeof Ambito.Type
export function exigir(b: boolean, motivo: string): asserts b { if(!b)throw new RangeError(motivo) }
export function ref(s: string): void { exigir(s.trim().length>0,"Falta referencia específica") }
export function unicos(ids: readonly string[]): void { ids.forEach(ref);exigir(new Set(ids).size===ids.length,"Identidad repetida") }
export function euros(c: number): Decimal {return new D(c).div(100)}
export function fecha(s: string): string {
 exigir(/^\d{4}-\d{2}-\d{2}$/.test(s),"Fecha civil inválida")
 const [y,m,d]=s.split("-").map(Number)
 const meses=[31,y%4===0 && (y%100!==0 || y%400===0)?29:28,31,30,31,30,31,31,30,31,30,31]
 exigir(y>0 && m>=1 && m<=12 && d>=1 && d<=meses[m-1],"Fecha civil inválida");return s
}
export function siguiente(s: string): string {
 fecha(s);let [y,m,d]=s.split("-").map(Number)
 const meses=[31,y%4===0 && (y%100!==0 || y%400===0)?29:28,31,30,31,30,31,31,30,31,30,31]
 d++;if(d>meses[m-1]){d=1;m++;if(m>12){m=1;y++}}
 return String(y).padStart(4,"0")+"-"+String(m).padStart(2,"0")+"-"+String(d).padStart(2,"0")
}
export function aniversario(s: string, anos: number): string {
 fecha(s);const y=Number(s.slice(0,4))+anos
 // Para las suscripciones2025 no hay29/2. Otras fronteras civiles29/2 se rechazan para no inventar cómputo jurídico.
 exigir(s.slice(5)!=="02-29","Aniversario jurídico de29/2: concretar regla de cómputo")
 return String(y).padStart(4,"0")+s.slice(4)
}
export type Periodo={readonly desde:string;readonly hasta:string}
export function cobertura(ps: readonly Periodo[], inicio: string, fin: string): void {
 fecha(inicio);fecha(fin);exigir(inicio<=fin,"Cronología invertida");exigir(ps.length>0,"Falta historial temporal exhaustivo")
 let esperado=inicio
 for(const p of ps){fecha(p.desde);fecha(p.hasta);exigir(p.desde===esperado && p.hasta>=p.desde && p.hasta<=fin,"Historial con hueco, solape o fecha fuera de ámbito");esperado=siguiente(p.hasta)}
 exigir(esperado===siguiente(fin),"Historial no alcanza el devengo")
}
export const Pago = Schema.Struct({id:Texto,fecha:Texto,pagador:Texto,importeCentimos:Centimos,
 medio:Schema.Literals(["tarjeta","transferencia","cheque-nominativo","ingreso-cuenta","efectivo"]),justificante:Texto})
export type Pago=typeof Pago.Type
export function pago(p: Pago,h: Ambito): Decimal {
 ref(p.id);ref(p.justificante);exigir(fecha(p.fecha).startsWith("2025-") && p.pagador===h.contribuyente,"Pago fuera2025 o de otro contribuyente")
 exigir(p.medio!=="efectivo","DA segunda Aragón: pago bancario requerido");return euros(p.importeCentimos)
}
export type Rechazo = {readonly estado:"no_soportado";readonly motivo:string}


export const Fraccion=Schema.Struct({numerador:Entero,denominador:Entero})
export type Fraccion=typeof Fraccion.Type
/** Comparación exacta de participaciones, incluida cualquier frontera alrededor40%, sin redondear porcentajes. */
export function participacionAdmisible(fracciones: readonly Fraccion[], exento40: boolean): void {
 let n=0n,d=1n
 for(const f of fracciones){exigir(f.denominador>0 && f.numerador<=f.denominador,"Fracción de participación inválida o superior100%");n=n*BigInt(f.denominador)+BigInt(f.numerador)*d;d*=BigInt(f.denominador)}
 exigir(n<=d,"Participación familiar incoherente: supera100% incluyendo la propia")
 exigir(exento40 || n*5n<=d*2n,"Participación familiar de segundo grado superior40% sin excepción de fundador emergente")
}
