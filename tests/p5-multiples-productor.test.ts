import { expect, it } from "vitest"
import { producirDonativosEstatales2025 as producir } from "../lib/dominio/irpf/deducciones/donativos-estatales-2025/productor"
import { baseEstatalMismaOperacion } from "../lib/dominio/irpf/deducciones/donativos-estatales-2025/regionales"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { censo, magnitudes, multiple, operacion } from "./p5-fixtures"

// Expected independientes: oracle.py preservado por valor; 400 =>200+150*.4=260.
it("misma entidad, una escala y trazabilidad de segmentos", () => {
  const r=producir(multiple(),magnitudes())
  expect(r.generado).toEqual(racional("260"));expect(r.aplicado).toEqual(racional("260"))
  expect(r.agrupaciones).toHaveLength(1);expect(r.agrupaciones[0]?.bruto2025).toEqual(racional("400"))
  expect(r.operaciones.map(o=>o.baseTramo80)).toEqual([racional("200"),racional("50")])
  expect(r.operaciones.map(o=>o.generado)).toEqual([racional("160"),racional("100")])
})
it("dos entidades comparten250 y límite; prioridad cambia atribución, no total40",()=>{
  const a=operacion("200","a"),b=operacion("200","b","otra","G76543214")
  const s={...censo([a,b]),prioridad68_3:["b","a"]}
  const r=producir(s,magnitudes("3000"))
  expect(r.base68_3).toEqual(racional("300"));expect(r.generado).toEqual(racional("220"))
  expect(r.operaciones.map(o=>[o.operacionId,o.baseComputada68_3])).toEqual([["b",racional("200")],["a",racional("100")]])
})
it.each([["1000","1000","260"],["30","1000","160"],["1000","30","160"],["30","20","50"],["0","0","0"]])("aplicación por mitades %s/%s=%s",(e,a,total)=>{
  const r=producir(multiple(),magnitudes("20000",e,a))
  expect(r.generado).toEqual(racional("260"));expect(r.aplicado).toEqual(racional(total))
})
it.each([[],["uno"],["uno","uno"],["uno","ajeno"]].map(orden => [orden] as const))("prioridad inválida %j",orden=>{
  expect(()=>producir({...multiple(),prioridad68_3:orden},magnitudes())).toThrow(/Prioridad/)
})
it("historia agregada2023/24 única y agregado2025, sin repetir franquicia",()=>{
  const s=multiple(),a=s.operaciones68_3[0]!,b=s.operaciones68_3[1]!
  const historial=([2023,2024] as const).flatMap(ejercicio=>["1","2"].map(n=>({ejercicio,pago:{...a.pago,id:`h${ejercicio}-${n}`,operacionId:`op${ejercicio}-${n}`,fecha:`${ejercicio}-06-01`,documento:`doc${ejercicio}-${n}`,euros:"100"},certificado:{...a.certificado,operacionId:`op${ejercicio}-${n}`,referencia:`cert${ejercicio}-${n}`,fechaDonativo:`${ejercicio}-06-01`,euros:"100"}})))
  const entrada={...s,operaciones68_3:[{...a,incremento:"reiteracion_45" as const,historial,historialExhaustivo:"todos_donativos_misma_entidad_2023_2024" as const},{...b,incremento:"reiteracion_45" as const}]}
  expect(producir(entrada,magnitudes()).generado).toEqual(racional("267.5"))
  expect(()=>producir({...entrada,operaciones68_3:[entrada.operaciones68_3[0]!,{...entrada.operaciones68_3[1]!,historial}]},magnitudes())).toThrow(/una vez/)
})
it("no_aplicar de otra operación sigue conciliable con insuficiencia; usada no se invierte",()=>{
  const s=multiple(),r=producir(s,magnitudes("20000","1","1000")),o=s.operaciones68_3[0]!
  expect(()=>baseEstatalMismaOperacion(r,o.operacionId,o.entidad.id,o.pago)).toThrow(/parcialmente/)
  const otra={...operacion("100","no","distinta","G76543214"),eleccion:"no_aplicar" as const}
  const con={...s,operaciones68_3:[...s.operaciones68_3,otra],prioridad68_3:["uno","dos","no"]}
  expect(baseEstatalMismaOperacion(producir(con,magnitudes("20000","1","1000")),otra.operacionId,otra.entidad.id,otra.pago)).toEqual(racional("0"))
})
it("rechaza entidad contradictoria, pago repetido y magnitud cliente",()=>{
  const s=multiple(),a=s.operaciones68_3[0]!,b=s.operaciones68_3[1]!
  expect(()=>producir({...s,operaciones68_3:[a,{...b,entidad:{...b.entidad,registro:"otro"}}]},magnitudes())).toThrow(/contradictorios/)
  expect(()=>producir({...s,operaciones68_3:[a,{...b,pago:{...b.pago,id:a.pago.id}}]},magnitudes())).toThrow(/repetidos/)
  const externa={...s,base68_3:"400"}
  expect(()=>producir(externa,magnitudes())).toThrow()
})
