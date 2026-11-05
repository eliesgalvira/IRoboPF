import { expect, it } from "vitest"
import { hechos, ejecutar, conObra, type Api, type Solicitud } from "./balears-alquiler-revision-adaptador"
import oraculos from "./balears-alquiler-revision-oraculos.json"
function censo(s: Solicitud) {
  const c = s.hechos.censoViviendaInversion
  if (c === undefined) throw new Error("fixture sin censo")
  return c
}
for (const api of ["uniforme", "efectiva"] as const) {
  for (const o of oraculos) it(`${api} Fraction ${o.edad}/${o.importe}`, () => {
    const r = ejecutar(api, [hechos(o.edad, o.importe)], o.edad)
    expect(r.deduccionesTerritoriales2025?.total).toEqual(o.esperado)
    expect(r.deduccionesTerritoriales2025?.estado).toBe("condicionado")
  })
  const rechazar = (label: string, transformar: (s: Solicitud) => Solicitud, edad = 29) =>
    it(`${api} rechazo ${label}`, () => { expect(() => ejecutar(api, [transformar(hechos(edad))], edad)).toThrow() })
  for (const clase of ["adquisicion", "construccion", "cuenta_vivienda", "financiacion", "rehabilitacion", "adecuacion", "sostenibilidad", "energia", "aportacion", "otra"] as const) {
    for (const fecha of ["2000-01-01", "2024-12-31", "2025-01-01"])
      rechazar(`inversion ${clase} ${fecha} sin aplicar`, s => ({ ...s, hechos: { ...s.hechos,
        censoViviendaInversion: { ...censo(s), operaciones: [{ id: "OP", catastro: "RC-ANTIGUO", documento: "OP-SINTETICA", fecha, clase }] } } }))
  }
  rechazar("sin censo", s => { const { censoViviendaInversion: c, ...h } = s.hechos; void c; return { ...s, hechos: h } })
  rechazar("cobertura parcial", s => ({ ...s, hechos: { ...s.hechos, censoViviendaInversion: { ...censo(s), desde: "2025-01-01" } } }))
  rechazar("persona distinta", s => ({ ...s, hechos: { ...s.hechos, censoViviendaInversion: { ...censo(s), persona: "s-9" } } }))
  rechazar("sin titulo", s => ({ ...s, hechos: { ...s.hechos, censoViviendaInversion: { ...censo(s), titulos: [] } } }))
  for (const derecho of ["propiedad", "usufructo", "uso"] as const)
    rechazar(`titulo real proximo/distante ${derecho}`, s => ({ ...s, hechos: { ...s.hechos,
      censoViviendaInversion: { ...censo(s), titulos: [...censo(s).titulos,
        { id: "T2", documento: "OTRO", catastro: "RC2", derecho, desde: "2025-01-01", hasta: "2025-12-31" }] } } }))
  for (const variante of ["ocupacion", "contrato", "fianza", "pagador", "perceptor", "obra", "certificado", "reembolso", "ayuda", "reparto", "fecha"] as const) {
    const cambiar = (s: Solicitud): Solicitud => ({ ...s, hechos: { ...s.hechos,
      viviendas: s.hechos.viviendas.map(v => {
        const cambiada = { ...v,
        ocupacion: variante === "ocupacion" ? "2025-07-01" : v.ocupacion,
        gastos: v.gastos.map(p => ({ ...p,
          pagador: variante === "pagador" ? "s-9" : p.pagador,
          perceptor: variante === "perceptor" ? "s-7" : p.perceptor,
          fecha: variante === "fecha" ? "2024-12-31" : p.fecha,
          reembolsos: variante === "reembolso" ? "100" : p.reembolsos,
          ayudasExentas: variante === "ayuda" ? "100" : p.ayudasExentas,
          distribucion: variante === "reparto" ? [{ persona: "s-1", porcentaje: "50" }, { persona: "s-9", porcentaje: "50" }] : p.distribucion,
        })) }
        if (v.alquiler !== undefined) {
          const alquiler = { ...v.alquiler, hasta: variante === "contrato" ? "2025-12-31" : v.alquiler.hasta }
          if (variante === "fianza") alquiler.fianza = ""
          cambiada.alquiler = alquiler
        }
        if (variante === "obra") cambiada.finObras = "2024-12-31"
        if (variante === "certificado") cambiada.certificadoAntes = { registro: "E", calificacion: "D" }
        return cambiada
      }) } })
    if (variante === "reembolso" || variante === "ayuda") it(`${api} neto ${variante}`, () => {
      expect(ejecutar(api, [cambiar(hechos())]).deduccionesTerritoriales2025?.total).toEqual({ numeradorEuros: "180", divisor: "1" })
    })
    else rechazar(variante, cambiar)
  }
  rechazar("titulo duplicado", s => ({ ...s, hechos: { ...s.hechos,
    censoViviendaInversion: { ...censo(s), titulos: [...censo(s).titulos, ...censo(s).titulos] } } }))
  rechazar("ubicacion fuera de Balears", s => ({ ...s, hechos: { ...s.hechos,
    viviendas: s.hechos.viviendas.map(v => {
      if (v.alquiler === undefined) return v
      return { ...v, alquiler: { ...v.alquiler, islaDestino: "Madrid" } }
    }) } }))
  for (const variante of ["ausente", "territorio", "catastro", "documento"] as const)
    rechazar(`localizacion material ${variante}`, s => ({ ...s, hechos: { ...s.hechos,
      viviendas: s.hechos.viviendas.map(v => ({ ...v, localizacion: variante === "ausente" ? undefined : {
        territorio: variante === "territorio" ? "otro" as const : "illes-balears" as const,
        isla: "Mallorca", catastro: variante === "catastro" ? "AJENO" : v.catastro,
        documento: variante === "documento" ? "" : "CATASTRO",
      } })) } }))
  it(`${api} renta alta`, () => { expect(() => ejecutar(api, [hechos()], 29, true)).toThrow() })
  for (const edad of [17,36,66]) rechazar(`perfil fuera ${edad}`, s => s, edad)
  it(`${api} duplicacion`, () => { const s = hechos(); expect(() => ejecutar(api, [s,s])).toThrow() })
  it(`${api} censo vacio contradicho por inversion de inquilino en otro productor`, () => {
    const s = hechos(); expect(() => ejecutar(api, [s,conObra(s)])).toThrow()
  })
  it(`${api} orden inverso conserva rechazo`, () => {
    const s = hechos(); expect(() => ejecutar(api, [conObra(s),s])).toThrow()
  })
}
it("ambas API mismos hechos y cotizacion conciliada", () => {
  const s = hechos()
  const a = ejecutar("uniforme", [s]); const b = ejecutar("efectiva", [s])
  expect(a.deduccionesTerritoriales2025).toEqual(b.deduccionesTerritoriales2025)
})
// La unión se mantiene explícita para que el compilador compruebe ambos adaptadores.
const apis: readonly Api[] = ["uniforme", "efectiva"]
void apis

// Garantiza que la entrada adversa llega a la API sin limpieza de la fixture.
for (const api of ["uniforme", "efectiva"] as const) {
  it(`${api} booleano fiscal desconocido llega sin sanear`, () => {
    const s = hechos()
    const adversa = { ...s, hechos: { ...s.hechos, sinDerechoInversion: true } }
    expect(() => ejecutar(api, [adversa])).toThrow()
  })
}
