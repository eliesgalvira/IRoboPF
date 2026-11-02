import { expect, it } from "vitest"
import { evaluarNacimientoMadrid, calcularGuarderiaMurciaParcial, evaluarDeduccion } from "../../../../lib/dominio/irpf/deducciones/contratos-2025"
import { evaluarHechosAuxiliar2025 } from "../../../../lib/dominio/irpf/deducciones/hechos-auxiliar-2025"
const historia = [{ ejercicio: 2025, general: 20000, ahorro: 0, basesUnidadFamiliar: [10000,10000] }]
const contexto = { ejercicio: 2025, territorio: "madrid", contribuyente: "a", modalidad: "conjunta" as const, declarantes: ["a","b"] }
const evento = { ejercicio: 2025, hijos: ["h"], progenitoresConvivientes: ["b"] }
const gasto = { hijo: "h", titulares: ["b"], custodia: 10000, alimentacion: 0, vestuarioEscolar: 0, ayudas: 0 }
for (const declarantes of [[], ["a","a"], ["b"], ["a",""]]) {
  it(`rechaza identidades inválidas en dispatcher ${JSON.stringify(declarantes)}`, () => {
    expect(evaluarDeduccion({ tipo: "madrid_nacimiento", contexto: {...contexto, declarantes}, evento, historia }).estado).toBe("no_soportado")
    expect(evaluarDeduccion({ tipo: "murcia_guarderia", contexto: {...contexto, territorio: "murcia", declarantes}, gastos: [gasto], baseImponible: 20000 }).estado).toBe("no_soportado")
  })
}
it("rechaza hijos repetidos en Madrid y Murcia y eventos que repiten hijo", () => {
  expect(evaluarNacimientoMadrid(contexto, {...evento,hijos:["h","h"]}, historia).estado).toBe("no_soportado")
  expect(calcularGuarderiaMurciaParcial({...contexto, territorio:"murcia"}, [gasto,gasto],20000).estado).toBe("no_soportado")
  expect(evaluarHechosAuxiliar2025({ codigo:"madrid_nacimiento_adopcion_hijos",contexto,declarantes:["a","b"],elegibilidadExterna:true,eventos:[evento,evento],historia }).estado).toBe("no_soportado")
})
it("rechaza discrepancia entre unidad del hecho y unidad del contexto", () => {
  expect(evaluarHechosAuxiliar2025({ codigo:"madrid_nacimiento_adopcion_hijos", contexto:{...contexto,declarantes:["a","x"]}, declarantes:["a","b"], elegibilidadExterna:true,eventos:[evento],historia }).estado).toBe("no_soportado")
})
it("los titulares múltiples conservan el tope por hijo en ambas referencias", () => {
  for (const contribuyente of ["a","b"]) {
    expect(calcularGuarderiaMurciaParcial({...contexto,contribuyente,territorio:"murcia"}, [{...gasto,titulares:["a","b"]},{...gasto,hijo:"h2",titulares:["a","b"]}],20000)).toMatchObject({importe:2000})
    expect(evaluarNacimientoMadrid({...contexto,contribuyente}, {...evento,progenitoresConvivientes:["a","b"]},historia)).toMatchObject({importe:721.7})
  }
})
