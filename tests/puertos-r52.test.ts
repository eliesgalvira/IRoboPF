import { expect, it } from "vitest"
import Decimal from "decimal.js"
import type { CasoActividad2025 } from "../lib/dominio/irpf/actividades-economicas/contrato"
import { adaptarActividadGeneral } from "../lib/dominio/irpf/actividades-economicas/adaptador"
import { produceComposition } from "../scripts/procedencia/composicion-r43"
import { createPortComposition, producePortContract, verifyPortContract } from "../scripts/procedencia/puertos-composicion-r47"
import { executeRentasFinite } from "../scripts/procedencia/flujo-rentas-r36-consumidor.mjs"
import { routeContract } from "../.cache/puertos-composicion-r47-sol/privado"

const candidate = produceComposition()
const contract = producePortContract(candidate)
const scaleExplicit = "lib/dominio/irpf/trabajo-anual/conexion.ts#liquidarIrpfAnualExplicito"

it("R52: el observador conserva registros sin prototipo anidados, arrays y Decimal", () => {
  const expression = "lib/dominio/irpf/trabajo-anual/conexion.ts:8193:8215:global"
  const fragment = candidate.fragments.rentas
  const general = new Decimal("5550.25")
  const minimum = Object.assign(Object.create(null), {
    contribuyente: Object.assign(Object.create(null), { general }),
    otros: [Object.assign(Object.create(null), { etiqueta: "x", importe: general })],
  })
  const boundaries = { "boundary:MINIMOS_ESTATALES_2025": minimum }
  let observed = 0
  const result = executeRentasFinite(fragment, null, [], false, expression, [], boundaries, (event) => {
    observed++
    expect(event.result).toEqual({ contribuyente: { general: { decimal: "5550.25" } }, otros: [{ etiqueta: "x", importe: { decimal: "5550.25" } }] })
  }).result
  expect(result).toBe(minimum)
  expect(observed).toBe(1)
  expect(executeRentasFinite(fragment, null, [], false, expression, [], boundaries).result).toBe(minimum)
})

it("R52: trabajo declara y observa ambos gastos en la variante disponible", () => {
  const router = createPortComposition(candidate, contract)
  router.roots.scales(scaleExplicit, [explicit])
  const witness = router.witnesses.find(w => w.port.endsWith("#adaptarTrabajoAnual"))!
  expect(witness.variant).toEqual({ property: "estado", equals: "aporte-disponible" })
  for (const [path, value] of [["gastos.gastosAE", "0"], ["gastos.generalesAplicados", "2000"]]) {
    expect(witness.properties.find(p => p.path === path)).toEqual({ path, representation: "EUR-string", value })
  }
  expect(witness.properties.some(p => p.path === "motivo")).toBe(false)
})

it("R52: cada propiedad de las etapas conserva la colección y su orden", () => {
  const actividad = portActivityFixture()
  const expected = adaptarActividadGeneral(actividad)
  expect(expected.estado).toBe("aporte-disponible")
  if (expected.estado !== "aporte-disponible") throw Error("Fixture EDS fuera del dominio")
  const router = createPortComposition(candidate, contract)
  router.roots.scales(scaleExplicit, [{ ...portScope, perfil: "solo-actividad-eds", actividad }])
  const witness = router.witnesses.find(w => w.port.endsWith("#adaptarActividadGeneral"))!
  expect(witness.variant).toEqual({ property: "estado", equals: "aporte-disponible" })
  expect(expected.etapas.length).toBeGreaterThan(1)
  for (const field of ["importe", "reglaId", "id", "formula"] as const) {
    expect(witness.properties.find(p => p.path === `etapas[].${field}`)).toEqual({
      path: `etapas[].${field}`, representation: field === "importe" ? "EUR-string" : "string",
      value: expected.etapas.map(e => e[field]),
    })
  }
  expect(witness.properties.some(p => p.path === "motivos[].motivo")).toBe(false)
})

it("R52: el discriminante autonómico se observa sin atribuir motivo a la variante soportada", () => {
  const router = createPortComposition(candidate, contract)
  expect(router.explicit(explicit).status).toBe("success")
  const witness = router.witnesses.find(w => w.port === "rentas::boundary:obtenerParametrosComunidadAutonoma")!
  expect(witness.variant).toEqual({ property: "_tag", equals: "ParametrosComunidadAutonoma" })
  expect(witness.properties.find(p => p.path === "_tag")).toEqual({ path: "_tag", representation: "discrete", value: "ParametrosComunidadAutonoma" })
  expect(witness.properties.some(p => p.path === "motivo")).toBe(false)
})

it("R52: eliminar una propiedad o su condición invalida el contrato por su obligación", () => {
  const cases = [
    ["#adaptarTrabajoAnual", "gastos.gastosAE"],
    ["#adaptarTrabajoAnual", "gastos.generalesAplicados"],
    ...["importe", "reglaId", "id", "formula"].map(f => ["#adaptarActividadGeneral", `etapas[].${f}`]),
    ["boundary:obtenerParametrosComunidadAutonoma", "_tag"],
    ["boundary:obtenerParametrosComunidadAutonoma", "motivo"],
  ]
  for (const [target, path] of cases) {
    for (const area of ["output", "variants"]) {
      const altered = structuredClone(contract)
      const port = altered.ports.find(p => p.target.endsWith(target!))!
      if (area === "output") port.output = port.output.filter(p => p.path !== path)
      else for (const variant of port.variants) variant.outputs = variant.outputs.filter(p => p.split(":")[0] !== path)
      expect(() => verifyPortContract(altered, candidate), `${target} ${path} ${area}`).toThrow(new RegExp(":" + area))
    }
  }
})

it("R52: sensibilidad privada del rechazo autonómico conserva solo discriminante y motivo", () => {
  // Esta IR alterada ejercita la rama; no se acepta por el constructor público.
  const altered = structuredClone(candidate)
  const year = altered.fragments.rentas.program.find((n: { id: string }) => n.id === "lib/dominio/irpf/trabajo-anual/conexion.ts:7473:7477:literal")!
  expect(year.data.value).toBe(2025)
  year.data.value = 2030
  const router = routeContract(altered, contract)
  expect(router.explicit(explicit).status).not.toBe("success")
  const witness = router.witnesses.find(w => w.port === "rentas::boundary:obtenerParametrosComunidadAutonoma")!
  expect(witness.variant).toEqual({ property: "_tag", equals: "ComunidadAutonomaNoSoportada" })
  expect(witness.properties).toEqual([
    { path: "_tag", representation: "discrete", value: "ComunidadAutonomaNoSoportada" },
    { path: "motivo", representation: "string", value: "Escalas autonomicas del anio 2030 aun no implementadas" },
  ])
})

// Fixtures reutilizados de R47; las expectativas de campos/testigos de R52 son nuevas.
function portActivityFixture(): CasoActividad2025 {
  return {
    ejercicio: 2025,
    territorio: "comun",
    individual: true,
    actividadId: "profesion",
    iae: "servicios",
    fechaInicio: "2025-01-01",
    fechaFin: "2025-12-31",
    serviciosOrdinarios: true,
    hechos: {
      otrasActividades: false,
      otrasRentas: false,
      existencias: false,
      empleados: false,
      artistica: false,
      irregular: false,
      subvenciones: false,
      transmisiones: false,
      extranjero: false,
      mutualidad: false,
      especialidadesTerritoriales: false,
      saldosPendientes: false,
      serviciosGratuitos: false,
      autoconsumo: false,
      noFacturados: false,
      subvalorados: false,
      trade: false,
      hechosDesconocidos: false,
    },
    historial: [],
    actividadPreviaAlInicio: "ausente",
    regimen2025: "eds",
    criterio2025: "devengo",
    documentoCriterio2025: "alta",
    renuncia2025: false,
    exclusion2025: false,
    volumen2024: "0",
    diasActividad2024: 0,
    documentoVolumen2024: "sin-actividad",
    clientes: [
      {
        id: "cliente",
        vinculado: false,
        empleadorEnAnioAnteriorAlInicio: false,
        documento: "contrato",
      },
    ],
    ingresos: [],
    gastos: [],
    reta: [],
    activos: [],
    obligacionesFormales: true,
    documentoObligaciones: "libros",
    discapacidad: {
      grado: 0,
      ayudaOMovilidad: false,
      ejercicioEfectivo: true,
      documento: "sin-discapacidad",
    },
    opcion: "gastos-dificiles",
    aplicarRentasBajas: true,
    aplicarInicio: false,
    retenciones: [],
    pagosFraccionados: [],
  }
}

const portScope = {
  ejercicio: 2025,
  comunidadAutonoma: "madrid",
  edad: 40,
  modalidad: "individual",
  residenciaTodoElAnio: true,
  devengo: "2025-12-31",
  otrasRentas: "ninguna",
  familiaresConDerechoMinimo: "ninguno",
  discapacidad: "ninguna",
  reduccionesBase: "ninguna",
  saldosAnteriores: "ninguno",
  deducciones: "solo-da61-si-procede",
  rentasExtranjeras: "ninguna",
  especialidades: "ninguna",
}

const explicit={ejercicio:2025,comunidadAutonoma:"madrid",edad:40,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"solo-da61-si-procede",rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado-anual#2025"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"anual",clase:"empleo-laboral",integro:"30000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[]}
