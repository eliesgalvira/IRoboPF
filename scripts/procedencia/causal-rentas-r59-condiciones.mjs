import assert from "node:assert/strict"
import fs from "node:fs"
import { gzipSync } from "node:zlib"
import { composeCausalRentas } from "./causal-rentas-r59-contratos.mjs"
import {
  executeCausalRentas,
  verifyCausalRentas,
} from "./causal-rentas-r59.mjs"
export function runRentasConditions() {
  const g = composeCausalRentas(),
    ctx = { modo: "canonico" },
    results = []
  const urban = {
    fechaAdquisicion: "2012-12-31",
    inmuebleUrbano: true,
    tituloOneroso: true,
    operacionConPersonaOEntidadVinculada: false,
  }
  const entries = [
    ["urbano-valido", { _tag: "SinExencionMayores65" }, urban, "5000"],
    [
      "no-urbano",
      { _tag: "SinExencionMayores65" },
      { ...urban, inmuebleUrbano: false },
      "0",
    ],
    [
      "no-oneroso",
      { _tag: "SinExencionMayores65" },
      { ...urban, tituloOneroso: false },
      "0",
    ],
    [
      "vinculada",
      { _tag: "SinExencionMayores65" },
      { ...urban, operacionConPersonaOEntidadVinculada: true },
      "0",
    ],
  ]
  for (const [name, transmision, reinv, previas, expected] of [
    ["transmision-cero", 0, 1000000, 0, "0"],
    ["margen-agotado", 2000000, 1000000, 25000000, "0"],
    ["reinversion-completa", 2000000, 3000000, 0, "10000"],
  ])
    entries.push([
      name,
      {
        _tag: "ReinversionRentaVitaliciaMayores65",
        importeTransmisionCentimos: transmision,
        importeReinvertidoRentaVitaliciaCentimos: reinv,
        reinversionesPreviasRentaVitaliciaCentimos: previas,
      },
      undefined,
      expected,
    ])
  fs.mkdirSync(".cache/causal-rentas-r59-sol/condiciones", { recursive: true })
  for (const [name, tratamiento, exencion, expected] of entries) {
    const ganancia = {
      importeGananciaCentimos: 1000000,
      tratamientoMayores65: tratamiento,
    }
    if (exencion !== undefined)
      ganancia.exencionInmuebleUrbanoAdquirido2012 = exencion
    const caso = {
      anio: 2025,
      situacionFamiliar: { edad: 65 },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 2000000 }],
        gananciasPatrimoniales: [ganancia],
      },
    }
    const r = executeCausalRentas(g, caso, ctx, name)
    assert.equal(r.evidence.outputs[8].decimal, "10000")
    assert.equal(r.evidence.outputs[9].decimal, expected)
    assert.equal(verifyCausalRentas(g, r.evidence, caso, ctx, name), true)
    fs.writeFileSync(
      ".cache/causal-rentas-r59-sol/condiciones/" + name + ".json.gz",
      gzipSync(
        JSON.stringify({ caso, contexto: ctx, evidence: r.evidence, expected })
      )
    )
    results.push({ name, expected })
  }
  return results
}
