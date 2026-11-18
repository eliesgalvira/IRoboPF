import { expect, it } from "vitest"
import { replayMadrid } from "../scripts/analisis-madrid-replay.mjs"

it("sin CAS conserva faltantes tipados y nunca maquilla ocho aceptaciones", () => {
  const resultados = replayMadrid()
  expect(resultados).toHaveLength(8)
  expect(resultados.filter(r => r.estado === "original-no-disponible")).toHaveLength(5)
  expect(resultados.filter(r => r.estado === "exacto-en-casillas-acreditadas-del-fixture")).toHaveLength(3)
})
it("cotejo contractual mantiene importe original, reservas y representación separada", () => {
  for (const r of replayMadrid().filter(r => r.estado === "exacto-en-casillas-acreditadas-del-fixture")) {
    expect(r.fixtureSHA256).toMatch(/^[a-f0-9]{64}$/)
    expect(r.entrada.brutoNominalObservadoEUR).toBe(r.hechos.bruto)
    expect(r.cotejo.every(x => x.igual)).toBe(true)
    expect(r.cotejo.some(x => ["0023","0414"].includes(x.box))).toBe(false)
    expect(r.reservas).toContain("0023")
    expect(r.reservas).toContain("0414")
    expect(r.Hcontractual.estado).toBe("disponible")
    expect(r.Hdecimal.politica).toBe("decimal-hasta-salida")
    expect(r.identidadAnalitica.exactaAntesDivision).toBe(true)
    expect(r.comparacionIConOpen).toBe("no-aplicable")
  }
})
