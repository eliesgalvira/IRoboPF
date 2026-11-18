import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { escenarioBruto, HIPOTESIS_2026, renderizarAcompanamiento } from "../scripts/acompanamiento-madrid.mjs"
import { beforeAll, expect, it } from "vitest"
import { readFileSync, existsSync } from "node:fs"
import Decimal from "decimal.js"
import { ejecutarCLI, renderizar, resumen, actualizarREADME, comprobar } from "../scripts/resultados-madrid.mjs"
import { evidenciaFilas, validarFila, validarReadbacks, compararPublicado, leerCAS, parsearOriginales, parsearPDFSESTextual, validarSESTextual, derivarSESTextual, sha256 } from "../scripts/evidencia-filas-madrid.mjs"
import { deflateSync, inflateSync } from "node:zlib"

let filas
let documento

it("evidencia offline conserva 2/22 y rechaza contradicciones, desplazamientos y tipos heterogéneos", () => {
  const rows = evidenciaFilas(filas)
  expect(rows.filter(r => r.open)).toHaveLength(2)
  expect(rows.filter(r => !r.open)).toHaveLength(22)
  for (const [i, r] of rows.entries()) {
    const extracto = JSON.parse(leerCAS(r.extracto, "json"))
    expect(() => validarReadbacks(extracto.readbacks)).not.toThrow()
    for (const modify of [
      x => { x.id += "-shift" },
      x => { x.ejercicio += 1 },
      x => { x.ss = "0" },
      x => { x.entradaSHA256 = "0".repeat(64) },
    ]) {
      const changed = structuredClone(r); modify(changed)
      expect(() => validarFila(filas[i], changed, extracto)).toThrow()
    }
    const bad = structuredClone(extracto.readbacks)
    const region = bad.find(x => x.key === "region")
    region.observed = "MADRID"
    expect(() => validarReadbacks(bad)).toThrow(/region/)
    const importe = structuredClone(extracto.readbacks)
    importe.find(x => x.key === "GSS").tipo = "seleccion"
    expect(() => validarReadbacks(importe)).toThrow(/tipo importe/)
    const ssCambiada = structuredClone(extracto)
    ssCambiada.readbacks.find(x => x.key === "GSS").requested = "0"
    expect(() => validarFila(filas[i], r, ssCambiada)).toThrow(/SS solicitado/)
    expect(() => leerCAS(r.extracto, "json", () => Buffer.from("alterado"))).toThrow(/SHA/)
    expect(() => leerCAS(r.extracto, "json", () => { throw Error("missing") })).toThrow(/missing/)
  }
  expect(() => compararPublicado("1119.85125", "999", "999", "1119.85125")).toThrow(/PDF\/SES/)
  expect(() => compararPublicado("1119.86", "1119.86", "1119.86", "1119.85125")).toThrow(/diferencia publicada/)
  expect(compararPublicado("1119.85", "1119.85", "1119.85", "1119.85125")).toEqual({deltaInterna:"-0.00125",exactaInterna:false})
  expect(compararPublicado("4795.14", "4795.14", "4795.14", "4795.1374")).toEqual({deltaInterna:"0.0026",exactaInterna:false})
  const r = rows.find(r => r.open)
  const pdf = leerCAS(r.open.fuentes["captura.pdf"].sha256, "b64")
  const textual = leerCAS(r.open.fuentes["ses-texto.json"].sha256, "json")
  const ses = deflateSync(Buffer.from(validarSESTextual(textual).texto, "latin1"))
  const cambiado = inflateSync(ses).toString("latin1").replace(/CAUTLIQ~1~[^\r\n]+/, "CAUTLIQ~1~999")
  expect(() => parsearOriginales(pdf, deflateSync(Buffer.from(cambiado, "latin1")))).toThrow(/contradicción PDF\/SES/)
  const otroAnio = inflateSync(ses).toString("latin1").replace('EjModelo="2018"', 'EjModelo="2019"')
  expect(() => parsearOriginales(pdf, deflateSync(Buffer.from(otroAnio, "latin1")))).toThrow(/año SES/)
})

it("--check comprueba también evidencia generada y documentos", () => {
  const r = spawnSync("timeout", ["-k", "30s", "2m", "bun", "scripts/resultados-madrid.mjs", "--check"], {
    cwd: fileURLToPath(new URL("../", import.meta.url)), encoding: "utf8", timeout:150_000,
  })
  expect(r.stderr).toBe("")
  expect(r.status).toBe(0)
}, 150_000)
beforeAll(() => {
  // Ejecuta Bun y scripts/analisis-madrid.ts; ningún snapshot monetario en el test.
  filas = ejecutarCLI()
  documento = renderizar(filas)
}, 150_000)

it("documento completo y narración de README coinciden exactamente con el CLI real", () => {
  const actual = readFileSync(new URL("../docs/analisis-madrid/RESULTADOS.md", import.meta.url), "utf8")
  comprobar(actual, documento, "RESULTADOS.md")
  for (const [, destino] of documento.matchAll(/\]\(([^)]+)\)/g)) {
    const [ruta, ancla] = destino.split("#")
    const url = new URL("../docs/analisis-madrid/" + ruta, import.meta.url)
    expect(existsSync(url), destino).toBe(true)
    if (ancla) expect(readFileSync(url, "utf8")).toContain("## Referencia técnica original")
  }
  const readme = readFileSync(new URL("../docs/analisis-madrid/README.md", import.meta.url), "utf8")
  comprobar(readme, actualizarREADME(readme, filas), "README.md")
  expect(existsSync(new URL("../docs/analisis-madrid/RESULTADOS.md", import.meta.url))).toBe(true)
  expect(readme).toContain("](RESULTADOS.md)")
  for (const [, ruta] of readme.matchAll(/\]\(([^)#]+)\)/g)) {
    expect(existsSync(new URL("../docs/analisis-madrid/" + ruta, import.meta.url)), ruta).toBe(true)
  }
  expect(documento.indexOf("F es el factor")).toBeGreaterThan(documento.lastIndexOf("| 2025 |"))
  for (const grupo of ["16000", "30000", "60000"]) {
    const trayectoria = filas.filter(f => f.entrada.brutoBaseEUR2018 === grupo)
    expect(documento).toContain(resumen(trayectoria))
  }
})

it("rechaza documentos alterados en tabla, narración y resumen de README", () => {
  const tablaAlterada = documento.replace(/(\| 2025 \| )[^|]+/, "$10,00 ")
  const relatoAlterado = documento.replace(/el neto pasa de [\d.,]+/i, "el neto pasa de 0,00")
  const enlaceAlterado = documento.replace("](resultados-entradas.json)", "](no-existe.json)")
  for (const alterado of [tablaAlterada, relatoAlterado, enlaceAlterado]) {
    expect(alterado).not.toBe(documento)
    expect(() => comprobar(alterado, documento, "RESULTADOS.md")).toThrow(/diverge del CLI/)
  }
  const readme = readFileSync(new URL("../docs/analisis-madrid/README.md", import.meta.url), "utf8")
  const alterado = readme.replace(/el neto pasa de [\d.,]+/i, "el neto pasa de 0,00")
  const enlaceREADMEAlterado = readme.replace("](RESULTADOS.md)", "](no-existe.md)")
  for (const adverso of [alterado, enlaceREADMEAlterado]) {
    expect(adverso).not.toBe(readme)
    expect(() => comprobar(adverso, actualizarREADME(adverso, filas), "README.md")).toThrow(/diverge del CLI/)
  }
})

it("todas las trayectorias están admitidas y la descomposición no duplica congelación", () => {
  const D = Decimal.clone({ precision: 80 })
  expect(filas).toHaveLength(24)
  for (const bruto of ["16000", "30000", "60000"]) {
    const grupo = filas.filter(f => f.entrada.brutoBaseEUR2018 === bruto)
    expect(grupo.map(f => f.entrada.ejercicio)).toEqual([2018,2019,2020,2021,2022,2023,2024,2025])
    const inicial = new D(grupo[0].Hdecimal.neto)
    for (const f of grupo) {
      expect(f.entrada.edad).toBe(33 + f.entrada.ejercicio - 2018)
      expect(f.cotizaciones.estimacion.bases.minimosNoVinculantes).toBe(true)
      expect(f.cotizaciones.estimacion.metodo).toBe(f.entrada.ssTrabajador.perfil)
      expect(f.Hcontractual.estado).toBe("no-disponible")
      const c = new D(f.X.neto).minus(f.I.neto)
      const r = new D(f.Hdecimal.neto).minus(f.X.neto)
      const saldo = new D(f.Hdecimal.neto).minus(f.I.neto)
      expect(c.plus(r).eq(saldo)).toBe(true)
      // Identidad completa en el numerador nominal; dividir cada término por F
      // introduce únicamente el último redondeo Decimal80, no otra causa fiscal.
      const benchmark = new D(f.I.neto).minus(inicial.mul(f.factor))
      expect(saldo.plus(benchmark).eq(new D(f.Hdecimal.neto).minus(inicial.mul(f.factor)))).toBe(true)
      expect(new D(f.efectos.Eley).eq(saldo.div(f.factor))).toBe(true)
      expect(new D(f.efectos.Eindex).eq(c.negated().div(f.factor))).toBe(true)
    }
  }
})


it("acompañamiento exacto, enlaces y aritmética sin doble redondeo", () => {
  const esperado = renderizarAcompanamiento(filas)
  comprobar(readFileSync(new URL("../docs/analisis-madrid/ACOMPANAMIENTO.md", import.meta.url), "utf8"), esperado, "ACOMPANAMIENTO.md")
  for (const [, destino] of esperado.matchAll(/\]\(([^)]+)\)/g)) {
    expect(existsSync(new URL("../docs/analisis-madrid/" + destino.split("#")[0], import.meta.url)), destino).toBe(true)
  }
  for (const anio of [2012,2013,2014,2015,2016,2017]) expect(esperado).toContain("| " + anio + " | No disponible con este contrato |")
  expect(HIPOTESIS_2026).toMatchObject({desde:"2025-12",hasta:"2026-12",estado:"hipotesis-no-observada"})
  const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
  const ultimas = filas.filter(f => f.entrada.ejercicio === 2025)
  expect(ultimas).toHaveLength(3)
  for (const f of ultimas) {
    const escenario = escenarioBruto(f)
    // Camino decimal independiente; usa los operandos del CLI, sin nominal cuantizado.
    expect(escenario.brutoEUR).toBe(new D(f.entrada.brutoBaseEUR2018).mul(f.ipc.numerador).mul("1.03").div(f.ipc.denominador).toFixed(2))
    expect(() => escenarioBruto({...f, entrada:{...f.entrada, ejercicio:2026}})).toThrow(/2025/)
    expect(() => escenarioBruto({...f, ipc:{...f.ipc, metodo:"legacy"}})).toThrow(/cociente/)
  }
  // Este perfil distingue multiplicar el bruto ya redondeado de redondear sólo al final.
  const alto = ultimas.find(f => f.entrada.brutoBaseEUR2018 === "60000")
  expect(escenarioBruto(alto).brutoEUR).not.toBe(new D(alto.Hdecimal.bruto).mul("1.03").toFixed(2))
  expect(() => comprobar(esperado.replace("No disponible", "Calculado"), esperado, "ACOMPANAMIENTO.md")).toThrow(/diverge/)
  const readme = readFileSync(new URL("../docs/analisis-madrid/README.md", import.meta.url), "utf8")
  expect(readme).toContain("](ACOMPANAMIENTO.md)")
  expect(documento).toContain("](ACOMPANAMIENTO.md)")
})

it("cada año excluido rechaza los tres salarios sin producir importes fiscales", () => {
  const entradas = [2012,2013,2014,2015,2016,2017,2026].flatMap(ejercicio =>
    filas.filter(f => f.entrada.ejercicio === 2018).map(f => ({...f.entrada, ejercicio, edad:33+ejercicio-2018})))
  const r = spawnSync("timeout", ["-k","30s","2m","bun","scripts/analisis-madrid.ts"], {
    cwd: fileURLToPath(new URL("../", import.meta.url)), input:JSON.stringify(entradas), encoding:"utf8", timeout:150_000,
  })
  expect(r.error).toBeUndefined()
  expect(r.status).toBe(1)
  const rechazadas = JSON.parse(r.stdout)
  expect(rechazadas).toHaveLength(21)
  for (const resultado of rechazadas) expect(resultado).toEqual({estado:"no-disponible",motivo:"Fuera del alcance explícito Madrid 2018–2025, edad anual 18–64"})
}, 150_000)

it("SES textual completo: contrato exacto, UTF-8 estricto, hashes, Latin1 y binding sin original privado", () => {
  const r = evidenciaFilas(filas).find(r => r.open)
  const fuente = r.open.fuentes["ses-texto.json"]
  const bytes = leerCAS(fuente.sha256, "json")
  const dato = validarSESTextual(bytes)
  const pdf = leerCAS(r.open.fuentes["captura.pdf"].sha256, "b64")
  const serializar = x => Buffer.from(JSON.stringify(x, null, 2) + "\n")
  expect(parsearPDFSESTextual(pdf, bytes, fuente).cuotaSES).toBe(r.open.cuota)
  expect(sha256(Buffer.from(dato.texto, "latin1"))).toBe(dato.infladoLatin1SHA256)
  for (const cambio of [
    x => { x.version = 2 }, x => { x.tipo = "originalSES" },
    x => { x.encodingFuente = "UTF-8" }, x => { x.metodo += " selección" },
    x => { x.originalComprimidoSHA256 = "bad" }, x => { x.infladoLatin1SHA256 = "0".repeat(64) },
    x => { x.texto += "x" }, x => { x.texto += "€" }, x => { x.texto += "\ud800" },
    x => { x.extra = "oculto" }, x => { delete x.texto },
  ]) {
    const cambiado = structuredClone(dato); cambio(cambiado)
    expect(() => validarSESTextual(serializar(cambiado))).toThrow()
  }
  for (const ambiguo of [Buffer.concat([bytes, Buffer.from(" ")]), Buffer.from(bytes.toString().replace('"version": 1,', '"version": 1, "version": 1,')), Buffer.concat([bytes, Buffer.from([255])])]) {
    expect(() => validarSESTextual(ambiguo)).toThrow()
  }
  for (const key of ["tipo", "originalComprimidoSHA256", "infladoLatin1SHA256"]) {
    expect(() => parsearPDFSESTextual(pdf, bytes, {...fuente, [key]: "0".repeat(64)})).toThrow(/binding/)
  }
  const compressed = deflateSync(Buffer.from(dato.texto, "latin1"))
  expect(() => derivarSESTextual(compressed, "0".repeat(64))).toThrow(/SHA SES comprimido/)
  const trailing = Buffer.concat([compressed, Buffer.from("trailing")])
  expect(() => derivarSESTextual(trailing, sha256(trailing))).toThrow(/trailing/)
  expect(() => parsearOriginales(pdf, trailing)).toThrow(/trailing/)
  const completo = Buffer.from(Array.from({length:256}, (_, i) => i))
  const z = deflateSync(completo)
  expect(Buffer.from(validarSESTextual(derivarSESTextual(z, sha256(z))).texto, "latin1").equals(completo)).toBe(true)
  const contradiccion = structuredClone(dato)
  contradiccion.texto = contradiccion.texto.replace(/CAUTLIQ~1~[^\r\n]+/, "CAUTLIQ~1~999")
  contradiccion.infladoLatin1SHA256 = sha256(Buffer.from(contradiccion.texto, "latin1"))
  expect(() => parsearPDFSESTextual(pdf, serializar(contradiccion))).toThrow(/contradicción PDF\/SES/)
})
