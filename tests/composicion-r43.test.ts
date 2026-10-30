import { expect, it } from "vitest"
import { produceComposition, createComposition } from "../scripts/procedencia/composicion-r43"

const caso = {
  anio: 2025, comunidadAutonoma: "madrid",
  situacionFamiliar: { tipo: "individual", edad: 40, descendientes: [], ascendientes: [], discapacidad: { _tag: "SinDiscapacidad" } },
  rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] },
  reducciones: [], deducciones: [], retencionesSoportadasCentimos: 123, pagosACuentaCentimos: 321
}
it("compone las fronteras financieras sin callbacks del llamante", () => {
  const result = createComposition(produceComposition()).annual(caso, { modo: "canonico" })
  expect(result.lines.length).toBeGreaterThan(0)
})

import { Effect } from "effect"
import { liquidarIrpfAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import { consumePublic, verifyComposition } from "../scripts/procedencia/composicion-r43"
const candidate = produceComposition()
const composed = createComposition(candidate)
function projection(lines: { origen?: { siteId: string; decimal: string; unidad: string } }[]) {
  return lines.flatMap(l => l.origen !== undefined ? [[l.origen.siteId, l.origen.decimal, l.origen.unidad]] : []).sort((a,b) => a[0]!.localeCompare(b[0]!))
}
for (const modo of ["canonico", "compatible-legacy"] as const) {
  for (const salario of [0, 1000000, 8000000]) {
    it(`anual ${modo} ${salario}: alcanzabilidad y Decimal contra API TS`, () => {
      const input: CasoFiscalAnual = { ...caso, anio: 2025, comunidadAutonoma: "madrid", situacionFamiliar: { tipo: "individual", edad: 40, descendientes: [], ascendientes: [], discapacidad: { _tag: "SinDiscapacidad" } }, rendimientos: { trabajo: [{ importeIntegroCentimos: salario }] } }
      const actual = Effect.runSync(liquidarIrpfAnual(input, { modo }))
      if (actual._tag !== "LiquidacionIrpfAnualCalculada") throw Error("Resultado inesperado")
      const expected = actual.rastro.pasos.flatMap(p => p.lineasCalculo ?? []).filter(l => l.origen !== undefined)
      expect(projection(composed.annual(input, { modo }).lines)).toEqual(projection(expected))
    })
  }
}
it("rechaza paquete alterado y mantiene cerrada la puerta pública", () => {
  const m = structuredClone(candidate)
  m.links[0]!.producer = m.links[1]!.producer
  expect(() => verifyComposition(m)).toThrow()
  expect(() => consumePublic(candidate, "annual-public-admission")).toThrow(/Admisión/)
})

import type { CasoActividad2025 } from "../lib/dominio/irpf/actividades-economicas/contrato"
function casoBase(): CasoActividad2025 {
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

const alcance = {
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
function trabajo(bruto = "16576.01", clase = "empleo-laboral") {
  return {
    ...alcance,
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
          clase,
          integro: bruto,
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
}

import { calcularActividad2025 } from "../lib/dominio/irpf/actividades-economicas/calcular"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion"

it("actividad aislada conserva discriminantes y todas las etapas alcanzadas", () => {
 for (const opcion of ["gastos-dificiles", "cliente-unico"] as const) {
  const input = { ...casoBase(), opcion }
  expect(composed.activity(input)).toEqual(calcularActividad2025(input))
 }
})
it("explícito trabajo: conecta cuotas y mínimos sin oráculo en producción", () => {
 const input = trabajo()
 // SAFETY: the fixture is checked by the real schema in the oracle and candidate.
 const expected = Effect.runSync(liquidarIrpfAnualExplicito(input as Parameters<typeof liquidarIrpfAnualExplicito>[0]))
 const actual = composed.explicit(input)
 expect(actual.status).toBe("success")
 expect(projection(actual.result.rastro.pasos.flatMap((p: { lineasCalculo?: { origen: { siteId: string; decimal: string; unidad: string } }[] }) => p.lineasCalculo ?? []))).toEqual(projection(expected.rastro.pasos.flatMap(p=>p.lineasCalculo??[])))
})
import Decimal from "decimal.js"
import { executeFinite as executeSS } from "../scripts/procedencia/flujo-ss-r36-consumidor.mjs"
import type { CasoRetencionTrabajo } from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat"
const subcase: CasoRetencionTrabajo = { anio: 2020, edad: 40, retribucionAnualCentimos: 4020000, cotizacionesCentimos: 20000, situacionFamiliar: "situacion3", situacionLaboral: "activo", contrato: "general", descendientes: [], ascendientes: [], discapacidad: "sin-discapacidad" }
for (const retribucion of [0, 4020000]) {
 it(`retención subcaso ${retribucion}, bruto anual distinto y pagos efectivos distintos`, () => {
  const input: CasoFiscalAnual = { ...caso, anio: 2020, comunidadAutonoma: "madrid", situacionFamiliar: { tipo: "individual", edad: 40, descendientes: [], ascendientes: [], discapacidad: { _tag: "SinDiscapacidad" } }, retencionTrabajoAeat: { ...subcase, retribucionAnualCentimos: retribucion } }
  const result = Effect.runSync(liquidarIrpfAnual(input, { modo: "canonico" }))
  if(result._tag !== "LiquidacionIrpfAnualCalculada") throw Error("Resultado inesperado")
  expect(projection(composed.annual(input, { modo: "canonico" }).lines)).toEqual(projection(result.rastro.pasos.flatMap(p=>p.lineasCalculo??[])))
 })
}
it("sensibilidad financiera de SS por lado y año, aparte del pin", () => {
 const args = [{ anio: 2025, salarioBrutoAnual: new Decimal(10000) }]
 const run = (fragment: typeof candidate.fragments.ss) => executeSS(fragment, "calcularDesgloseCotizacionesPerfilUniforme", args, false).result
 const original = run(candidate.fragments.ss)
 expect(original.meiEmpresarial.toFixed()).toBe("67")
 expect(original.meiTrabajador.toFixed()).toBe("13")
 const m = structuredClone(candidate.fragments.ss)
 for (const n of m.program) {
  if(n.op === "get" && n.data.key === "empresarial") n.data.key = "trabajador"
 }
 expect(run(m).cotizacionEmpresarial.toFixed()).not.toBe(original.cotizacionEmpresarial.toFixed())
 expect(executeSS(candidate.fragments.ss,"calcularDesgloseCotizacionesPerfilUniforme",[{...args[0],anio:2024}],false).result.meiTrabajador.toFixed()).toBe("12")
})
it("reconoce rechazo explícito y nunca fabrica cero", () => {
 const input = trabajo()
 input.trabajo.discapacidadActiva = "33-a-64"
 expect(composed.explicit(input).status).toBe("fail")
})
it("actividad anual EDS usa aporte y conserva pagos separados", () => {
 const input = { ...alcance, perfil: "solo-actividad-eds", actividad: casoBase() }
 // SAFETY: intentional JS fixture is decoded by both implementations before arithmetic.
 const expected = Effect.runSync(liquidarIrpfAnualExplicito(input as Parameters<typeof liquidarIrpfAnualExplicito>[0]))
 const actual = composed.explicit(input)
 expect(actual.status).toBe("success")
 expect(actual.result.cuotaDiferencial).toBe(expected.cuotaDiferencial)
 expect(projection(actual.result.rastro.pasos.flatMap((p: { lineasCalculo?: { origen: { siteId: string; decimal: string; unidad: string } }[] })=>p.lineasCalculo??[]))).toEqual(projection(expected.rastro.pasos.flatMap(p=>p.lineasCalculo??[])))
 expect(composed.explicit({ ...input, actividad: { ...input.actividad, discapacidad: { ...input.actividad.discapacidad, grado: 33 } } }).status).toBe("fail")
})

function ingreso(
  base: string,
  sujetoRetencion = false,
  id = "factura",
  clienteId = "cliente"
): CasoActividad2025["ingresos"][number] {
  return {
    id,
    justificante: id,
    fecha: "2025-06-01",
    base,
    iva: "0",
    ivaRecuperable: "0",
    afectacionExclusiva: true,
    registrado: true,
    categoria: "servicio",
    clienteId,
    sujetoRetencion,
    rectificativa: false,
  }
}
function gasto(base: string): CasoActividad2025["gastos"][number] {
  return {
    id: "gasto",
    justificante: "gasto",
    fecha: "2025-06-01",
    base,
    iva: "0",
    ivaRecuperable: "0",
    afectacionExclusiva: true,
    registrado: true,
    categoria: "alquiler-local",
    correlacion: true,
    rectificativa: false,
  }
}
function activo(): CasoActividad2025["activos"][number] {
  return {
    id: "pc",
    justificante: "compra",
    fecha: "2025-01-01",
    grupo: "hardware",
    coste: "1000",
    puestaMarcha: "0",
    residual: "0",
    acumulada: "0",
    iva: "210",
    ivaRecuperable: "210",
    coeficiente: "0.26",
    fechaUso: "2025-01-01",
    fechaAdquisicion: "2025-01-01",
    usoHasta: "2025-12-31",
    nuevo: true,
    exclusivo: true,
    oneroso: true,
    mejoras: false,
    deterioros: false,
    subvencionado: false,
    leasing: false,
    incentivo: false,
    metodoHistorico: "lineal",
    coeficienteHistorico: "0.26",
    saldoDocumentado: "registro-activo",
  }
}


for(const opcion of ["gastos-dificiles", "cliente-unico"] as const) {
 for(const grado of [0,33,65] as const) {
  it(`instancias aisladas: ${opcion}, discapacidad ${grado}, activos e importes efectivos`,()=>{
   const input: CasoActividad2025 = { ...casoBase(), opcion, ingresos:[ingreso("24000",true)], gastos:[gasto("1000")], activos:[activo()], reta:[{id:"reta",justificante:"tgss",fecha:"2025-06-01",importe:"300",tipo:"ordinaria",propia:true,efectiva:true,periodo:"2025-06"}], discapacidad:{grado,ayudaOMovilidad:false,ejercicioEfectivo:true,documento:"testigo"} }
   const actual=composed.activity(input),expected=calcularActividad2025(input)
   expect(actual).toEqual(expected)
   expect(actual.estado).toBe("soportado")
   if(actual.estado === "soportado") {
    const amortizacion=actual.etapas.find((e:{id:string})=>e.id==="pc")
    expect(amortizacion).toBeDefined()
    expect(new Decimal(amortizacion.importe).eq(260)).toBe(true)
   }
  })
 }
}
