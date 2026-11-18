import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { analizarMadrid, type EntradaAnalisisMadrid } from "../lib/dominio/irpf/analisis-madrid/analizar"
import { ipcMadrid, METODO_IPC, METODO_IPC_LEGACY } from "../lib/dominio/irpf/analisis-madrid/ipc"
import { estimarOficina, PERFIL_OFICINA } from "../lib/dominio/irpf/analisis-madrid/coste"
import { calcularDesgloseCotizacionesPerfilUniforme } from "../lib/dominio/laboral/cotizaciones-perfil-uniforme"
import calendario from "../docs/analisis-madrid/calendario-oficina.json"
import ejemplo from "../docs/analisis-madrid/serie-coste-sintetica.json"
import type { AnioFiscal } from "../lib/dominio/normativa/anio-fiscal"
const D = Decimal.clone({ precision: 80 })
const nominales = ["30000", "30236.41", "30075.52", "32045.43", "33874.49", "34925.25", "35919.61", "36970.07"]
const legacy = ["30000", "30240", "30088.8", "32044.57", "33871.11", "34921.12", "35898.91", "36939.98"]
it("ocho racionales INE publicados, cuantización exacta y legacy explícito por valor", () => {
  for (let i = 0; i < 8; i++) {
    const ipc = ipcMadrid(2018 + i)
    expect(ipc.indexarBruto(new D(30000)).toFixed()).toBe(nominales[i])
    expect(ipc.procedencia.denominador).toBe("97329")
    expect(ipc.procedencia.metodo).toBe(METODO_IPC)
    expect(ipcMadrid(2018 + i, METODO_IPC_LEGACY).indexarBruto(new D(30000)).toFixed()).toBe(legacy[i])
  }
  expect(ipcMadrid(2018).factor.toFixed()).toBe("1")
  expect(ipcMadrid(2021).procedencia.numerador).toBe("103965")
  expect(() => ipcMadrid(2026)).toThrow()
})
it("guardas exactas de mínimos por cada periodo, incluida retroactividad2023/2024", () => {
  // Calendario final de fuentes primarias: no derivar el esperado de la guarda.
  expect(calendario.periodos.map(p => [p.anio,p.desdeMes,p.hastaMes,p.minimoCC,p.minimoCP.numerador,p.minimoCP.denominador,p.tope])).toEqual([
    [2018,1,7,"858.60","858.60","1","3751.20"],
    [2018,8,12,"858.60","858.60","1","3803.70"],
    [2019,1,12,"1050.00","1050.00","1","4070.10"],
    [2020,1,12,"1108.50","6650","6","4070.10"],
    [2021,1,8,"1108.50","6650","6","4070.10"],
    [2021,9,12,"1125.90","1125.90","1","4070.10"],
    [2022,1,12,"1166.70","1166.70","1","4139.40"],
    [2023,1,12,"1260.00","1260.00","1","4495.50"],
    [2024,1,12,"1323.00","1323.00","1","4720.50"],
    [2025,1,12,"1381.20","1381.20","1","4909.50"],
  ])
  for (const p of calendario.periodos) {
    // SAFETY: calendario versionado contiene únicamente ejercicios2018–2025.
    const anio = p.anio as AnioFiscal
    const minimoAnual = D.max(...calendario.periodos.filter(x => x.anio === anio).map(x => new D(x.minimoCC))).mul(12)
    expect(() => estimarOficina(anio, minimoAnual, PERFIL_OFICINA)).not.toThrow()
    expect(() => estimarOficina(anio, minimoAnual.minus("0.01"), PERFIL_OFICINA)).toThrow(/mínimo/)
  }
  expect(calendario.periodos.find(p => p.anio === 2023)).toMatchObject({ desdeMes: 1, minimoCC: "1260.00", minimoCP: { numerador: "1260.00", denominador: "1" }, fuente: "PCM313-2023" })
  expect(() => estimarOficina(2026, new D(30000), PERFIL_OFICINA)).toThrow(/incompleto/)
})
it("diferencial histórico acotado, base7/5, MEI y reparto solidaridad intactos", () => {
  for (const anio of [2018,2019,2020,2021,2022,2023,2024,2025] as const) {
    for (const salario of ["30000", "45300", "100000"]) {
      const l = calcularDesgloseCotizacionesPerfilUniforme({ anio, salarioBrutoAnual: new D(salario) })
      const h = estimarOficina(anio, new D(salario), PERFIL_OFICINA)
      expect(h.cotizacionEmpresarial.minus(l.cotizacionEmpresarial).toFixed()).toBe(anio === 2018 ? l.baseOrdinaria.mul("-0.005").toFixed() : "0")
      for (const k of ["cotizacionTrabajador", "meiEmpresarial", "meiTrabajador", "solidaridadEmpresarial", "solidaridadTrabajador"] as const) expect(h[k].toFixed()).toBe(l[k].toFixed())
    }
  }
  const h = estimarOficina(2018, new D(45300), PERFIL_OFICINA)
  expect(h.baseOrdinaria.toFixed()).toBe("45133.4")
  expect(h.AT.total).toBe("0.01")
  const s = estimarOficina(2025, new D(100000), PERFIL_OFICINA)
  // Cálculo independiente sobre los tres excesos anuales publicados.
  expect(s.solidaridadEmpresarial.toFixed()).toBe(new D("5891.4").mul("0.0077").plus(new D("23565.6").mul("0.0083")).plus(new D("11629").mul("0.0098")).toFixed())
})
it("serie sintética útil, coste/cuñas por rama; estimación no abre API legal", () => {
  for (const [i,e] of ejemplo.entries()) {
    // SAFETY: JSON sintético validado por la frontera cerrada de analizarMadrid.
    const r = analizarMadrid(e as EntradaAnalisisMadrid)
    expect(r.estado).toBe("calculado")
    if (r.estado !== "calculado") throw Error(r.motivo)
    expect(r.Hdecimal.bruto).toBe(nominales[i])
    expect(new D(r.coste!).eq(new D(r.Hdecimal.bruto).plus(r.cotizaciones.empresaEUR!))).toBe(true)
    expect(r.Hcontractual.estado).toBe("no-disponible")
    expect(r.efectos.identidad.exactaAntesDivision).toBe(true)
    expect(r.ipc.metodo).toBe(METODO_IPC)
    for (const rama of ["X", "I", "Hdecimal"] as const)
      expect(r.cunas[rama]).toBe(new D(r.coste!).minus(r[rama].neto).div(r.coste!).toFixed())
  }
})
it("bases y tipos anuales enlazados conservan cada operando por lado", () => {
  const topes = ["45276.9", "48841.2", "48841.2", "48841.2", "49672.8", "53946", "56646", "58914"]
  const meiEmpresa = ["0", "0", "0", "0", "0", "0.005", "0.0058", "0.0067"]
  const meiTrabajador = ["0", "0", "0", "0", "0", "0.001", "0.0012", "0.0013"]
  for (const [i, anio] of ([2018,2019,2020,2021,2022,2023,2024,2025] as const).entries()) {
    const r = estimarOficina(anio, new D(100000), PERFIL_OFICINA)
    expect(r.baseOrdinaria.toFixed()).toBe(topes[i])
    expect(r.meiEmpresarial.toFixed()).toBe(new D(topes[i]!).mul(meiEmpresa[i]!).toFixed())
    expect(r.meiTrabajador.toFixed()).toBe(new D(topes[i]!).mul(meiTrabajador[i]!).toFixed())
    expect(r.cotizacionEmpresarialOrdinaria.toFixed()).toBe(new D(topes[i]!).mul(anio === 2018 ? "0.309" : "0.314").toFixed())
    expect(r.cotizacionTrabajadorOrdinaria.toFixed()).toBe(new D(topes[i]!).mul("0.0635").toFixed())
  }
})
it("no acepta elegibilidad ajena ni mezcla silenciosa con legacy", () => {
  const e = ejemplo[0]!
  for (const input of [
    { ...e, metodoIpc: "externo" },
    { ...e, ssEmpresa: { naturaleza: "estimadas-oficina-historica", perfil: "temporal-parcial" } },
    { ...e, ssEmpresa: { ...e.ssEmpresa, horasExtra: true } },
    { ...e, ssEmpresa: { naturaleza: "estimadas-perfil-uniforme" } },
    { ...e, brutoBaseEUR2018: "1000" },
  ]) {
    // SAFETY: entradas inválidas deliberadas comprueban rechazo de frontera.
    expect(analizarMadrid(input as EntradaAnalisisMadrid).estado).toBe("no-disponible")
  }
})
