import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { Schema } from "effect"
import type { CasoActividad2025 } from "../lib/dominio/irpf/actividades-economicas/contrato"
import { adaptarActividadGeneral } from "../lib/dominio/irpf/actividades-economicas/adaptador"
import { adaptarTrabajoAnual } from "../lib/dominio/irpf/trabajo-anual/adaptador"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { composeRentasR36 } from "../scripts/procedencia/flujo-rentas-r36.mjs"
import { executeRentasFinite } from "../scripts/procedencia/flujo-rentas-r36-consumidor.mjs"
const fragment = composeRentasR36()
it("R52 mantiene Aragón mixto fuera de la aceptación documental heredada", () => {
  const name = "boundary:liquidarAragonSocialMixto2025"
  expect(fragment.boundaries.find(b => b.name === name)).toMatchObject({
    owner: "productores-anuales-2025",
    status: "requires-external-contract",
    admissionAvailable: false,
  })
  expect(fragment.globalBindings.find(b => b.name === name)).toMatchObject({ node: null, external: true })
  const expression = fragment.program.find(n => n.op === "global" && n.data.name === name)
  expect(expression).toBeDefined()
  if (expression === undefined) throw Error("Frontera aragonesa ausente")
  expect(() => executeRentasFinite(fragment, null, [], false, expression.id))
    .toThrow("Frontera sin contrato " + name)
  const root = "lib/dominio/irpf/trabajo-anual/conexion.ts:liquidarIrpfAnualExplicito"
  expect(() => executeRentasFinite(fragment, root, [{ perfil: "aragon-social-mixto-2025" }]))
    .toThrow("Frontera sin contrato boundary:liquidarAragonSocialMixto2025")
  expect(fragment.completeRuleAcceptance).toBe(false)
  expect(fragment.wiringAllowed).toBe(false)
})
it("R52 mantiene el productor de pagadores catalanes sin acreditación documental heredada", () => {
  const name = "boundary:producirPagadoresCatalunya2025"
  expect(fragment.boundaries.find((b) => b.name === name)).toMatchObject({
    owner: "productores-anuales-2025",
    status: "requires-external-contract",
    admissionAvailable: false,
  })
  expect(fragment.globalBindings.find((b) => b.name === name)).toMatchObject({
    node: null,
    external: true,
  })
  const expression = fragment.program.find((n) => n.op === "global" && n.data.name === name)
  expect(expression).toBeDefined()
  expect(() => executeRentasFinite(fragment, null, [], false, expression!.id))
    .toThrow("Frontera sin contrato " + name)
  expect(fragment.completeRuleAcceptance).toBe(false)
  expect(fragment.wiringAllowed).toBe(false)
})
it("R52: el productor familiar nuevo conserva su contrato documental pendiente", () => {
  for (const nombre of ["baseTrabajoMiembro2025", "CensoBasesFamiliares2025"]) {
    const frontera = "boundary:" + nombre
    expect(fragment.globalBindings.find((b) => b.name === frontera)).toMatchObject({
      node: null,
      external: true,
    })
    // Sin contrato externo no se fabrica un resultado ni se acredita el núcleo.
    const expresion = fragment.program.find((n) => n.op === "global" && n.data.name === frontera)
    expect(expresion).toBeDefined()
    expect(() => executeRentasFinite(fragment, null, [], false, expresion!.id))
      .toThrow("Frontera sin contrato " + frontera)
  }
})
it("R52: conserva los decimales serializados del rastro de deducciones anuales", () => {
  const resultado = {
    estado: "calculo_parcial",
    movimientos: [{ aplicado: "20.079", perdidoPorCuota: "479.921" }],
    totalAplicado: "20.079",
  }
  const observado = executeRentasFinite(
    fragment,
    "lib/dominio/irpf/deducciones/valenciana-2025/anual.ts:pasosDeduccionesValencianasAnual",
    [resultado]
  ).result
  expect(observado).toHaveLength(1)
  expect(observado[0].descripcion).toContain(JSON.stringify(resultado))
  expect(observado[0].lineasCalculo).toEqual([])
})
it("R52: el observador conserva registros sin prototipo anidados, arrays y Decimal", () => {
  const expression = fragment.program.find(
    (n) =>
      n.op === "global" && n.data.name === "boundary:MINIMOS_ESTATALES_2025"
  )?.id
  if (expression === undefined) throw Error("Constante ausente")
  const general = new Decimal("5550.25")
  const minimum = Object.assign(Object.create(null), {
    contribuyente: Object.assign(Object.create(null), { general }),
    otros: [
      Object.assign(Object.create(null), { etiqueta: "x", importe: general }),
    ],
  })
  const boundaries = { "boundary:MINIMOS_ESTATALES_2025": minimum }
  let observed = 0
  const result = executeRentasFinite(
    fragment,
    null,
    [],
    false,
    expression,
    [],
    boundaries,
    (event) => {
      observed++
      expect(event.result).toEqual({
        contribuyente: { general: { decimal: "5550.25" } },
        otros: [{ etiqueta: "x", importe: { decimal: "5550.25" } }],
      })
    }
  ).result
  expect(result).toBe(minimum)
  expect(observed).toBe(1)
  expect(
    executeRentasFinite(fragment, null, [], false, expression, [], boundaries)
      .result
  ).toBe(minimum)
}, 60000)

it("R52 actual: el adaptador salarial conserva los gastos efectivos y la variante", () => {
  const entrada = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(explicit)
  if (entrada.perfil !== "solo-trabajo") throw Error("Fixture salarial")
  const resultado = adaptarTrabajoAnual(entrada.trabajo)
  expect(resultado.estado).toBe("aporte-disponible")
  if (resultado.estado !== "aporte-disponible")
    throw Error("Aporte no disponible")
  expect(resultado.gastos.gastosAE).toBe("0")
  expect(resultado.gastos.generalesAplicados).toBe("2000")
  expect("motivo" in resultado).toBe(false)
})
it("R52 actual: las etapas EDS conservan identidad, fórmula, importe y orden", () => {
  const resultado = adaptarActividadGeneral(portActivityFixture())
  expect(resultado.estado).toBe("aporte-disponible")
  if (resultado.estado !== "aporte-disponible")
    throw Error("Aporte no disponible")
  expect(resultado.etapas.length).toBeGreaterThan(1)
  expect(new Set(resultado.etapas.map((e) => e.id)).size).toBe(
    resultado.etapas.length
  )
  for (const etapa of resultado.etapas) {
    expect(etapa.reglaId.length).toBeGreaterThan(0)
    expect(etapa.formula.length).toBeGreaterThan(0)
    expect(new Decimal(etapa.importe).isFinite()).toBe(true)
  }
  expect(resultado.aceptacionFiscal).toBe("pendiente")
  expect("motivos" in resultado).toBe(false)
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

const explicit = {
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
  perfil: "solo-trabajo",
  conciliacion: {
    ejercicio: 2025,
    estado: "totales-anuales-sin-duplicados",
    procedencia: ["certificado-anual#2025"],
  },
  trabajo: {
    ejercicio: 2025,
    territorio: "comun",
    reduccionesArt18: "ninguna",
    movilidad: "ninguna",
    discapacidadActiva: "ninguna",
    rendimientos: [
      {
        id: "anual",
        clase: "empleo-laboral",
        integro: "30000",
        cotizaciones: {
          clase: "efectivas",
          seguridadSocial: "0",
          derechosPasivos: "0",
          colegiosHuerfanos: "0",
        },
        sindicato: { importe: "0", satisfecho: "no" },
        colegio: {
          importe: "0",
          satisfecho: "no",
          obligatorio: "no",
          finesEsenciales: "no",
        },
        defensa: {
          importe: "0",
          satisfecho: "no",
          litigioDirectoPagador: "no",
        },
      },
    ],
  },
  retenciones: [],
}

it("R52 declara pendiente la composición anual nueva; no hereda aceptación histórica", () => {
  expect(fragment.boundaries.find(b => b.name === "boundary:componerLiquidacionAnual")).toMatchObject({
    status: "requires-external-contract", admissionAvailable: false,
  })
  expect(fragment.completeRuleAcceptance).toBe(false)
  expect(fragment.wiringAllowed).toBe(false)
})

it("R52 mantiene el esquema territorial como contrato externo pendiente", () => {
  const name = "boundary:SolicitudDeduccionesTerritoriales2025"
  const boundary = fragment.boundaries.find((b) => b.name === name)
  expect(boundary).toMatchObject({
    owner: "schema-territorial",
    status: "requires-external-contract",
    admissionAvailable: false,
  })
  expect(boundary?.calls.length).toBeGreaterThan(0)
  expect(fragment.globalBindings.find((b) => b.name === name)).toMatchObject({
    node: null,
    external: true,
  })
  expect(fragment.completeRuleAcceptance).toBe(false)
  expect(fragment.wiringAllowed).toBe(false)
})

type CasoDependenciaIngresoR52 = {
  readonly ingresosIdentificados2025?: Schema.Json | undefined
}

it("R52 no acredita ELA ni artículo 81 al incorporar sus dependencias anuales", () => {
  for (const symbol of [
    "prepararIngresosIdentificados2025",
    "CensoIngresosIdentificados2025",
    "HechosMaternidad2025",
    "aplicarArt81AlDiferencial",
  ]) {
    const name = "boundary:" + symbol
    expect(fragment.boundaries.find((b) => b.name === name)).toMatchObject({
      owner: "productores-anuales-2025",
      status: "requires-external-contract",
      admissionAvailable: false,
    })
    expect(fragment.globalBindings.find((b) => b.name === name)).toMatchObject({
      node: null,
      external: true,
    })
  }
  const binding = fragment.annualBindings.find((b) => b.name === "preparacionIngreso")
  if (binding === undefined) throw Error("Preparación anual ausente")
  const evaluate = (caso: CasoDependenciaIngresoR52) => executeRentasFinite(
    fragment, null, [], false, binding.node, [["caso", caso]]
  ).result
  expect(evaluate({})).toBeUndefined()
  expect(() => evaluate({ ingresosIdentificados2025: {} })).toThrow(
    "Frontera sin contrato boundary:prepararIngresosIdentificados2025"
  )
  expect(fragment.completeRuleAcceptance).toBe(false)
  expect(fragment.wiringAllowed).toBe(false)
})

it("R52 conserva el despachador y rechaza P4a sin contrato documental", () => {
  const name = "boundary:liquidarInmobiliarioP4a"
  expect(fragment.boundaries.find((b) => b.name === name)).toMatchObject({
    owner: "productores-anuales-2025",
    status: "requires-external-contract",
    admissionAvailable: false,
  })
  expect(fragment.globalBindings.find((b) => b.name === name)).toMatchObject({
    node: null,
    external: true,
  })
  const root = "lib/dominio/irpf/trabajo-anual/conexion.ts:liquidarIrpfAnualExplicito"
  expect(fragment.roots).toHaveProperty("liquidarIrpfAnualExplicito", root)
  expect(() => executeRentasFinite(fragment, root, [
    { perfil: "solo-inmobiliario-p4a" },
  ])).toThrow("Frontera sin contrato " + name)
  expect(fragment.globalBindings.find((b) =>
    b.name === "lib/dominio/irpf/trabajo-anual/conexion.ts:liquidarIrpfAnualExplicitoBase"
  )?.external).toBe(false)
  expect(fragment.completeRuleAcceptance).toBe(false)
  expect(fragment.wiringAllowed).toBe(false)
})
