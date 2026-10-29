import { expect, it } from "vitest"
import { Effect } from "effect"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { calcularDeduccionTrabajo } from "../lib/dominio/irpf/trabajo-anual/calcular"

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
it("conserva magnitudes calculadas de más de dos decimales en DA61", () => {
  expect(
    calcularDeduccionTrabajo({
      regla: "da61",
      ambito: "comun-individual",
      ejercicio: 2025,
      brutoServicios: "16576.01",
      otrasRentasNoExentas: "0",
      netoReducidoServicios: "10291.0275",
      baseLiquidableGeneral: "10291.0275",
      cuotaIntegraGeneral: "859.68835375",
      cuotaLiquidaTotal: "859.68835375",
      cuotaTrasArt80: "859.68835375",
      etapa: "despues-art80-sin-deduccion-trabajo",
      calificacion: "laboral-estatutaria-acreditada",
    })
  ).toMatchObject({
    estado: "calculado",
    importeAplicable: "339.998",
    cuotaPosterior: "519.69035375",
  })
})
it("conecta gastos efectivos, art20 y DA61 sin cotización simulada ni doble SMI", () => {
  const r = Effect.runSync(liquidarEntradaJavaScript(trabajo()))
  expect(r).toMatchObject({
    baseImponibleGeneral: "10291.0275",
    baseLiquidableGeneral: "10291.0275",
    reduccionArt20: "4284.9825",
    deduccionTrabajo: "339.998",
    aceptacionFiscal: "pendiente",
  })
})
it("pensión sola no es empleo para DA61", () => {
  expect(
    Effect.runSync(liquidarEntradaJavaScript(trabajo("16576.01", "pension")))
      .deduccionTrabajo
  ).toBe("0")
})
it("conserva pérdidas y no crea reducción negativa", () => {
  const c = trabajo("0")
  c.trabajo.rendimientos[0]!.cotizaciones.seguridadSocial = "100"
  expect(Effect.runSync(liquidarEntradaJavaScript(c))).toMatchObject({
    baseImponibleGeneral: "-100",
    baseLiquidableGeneral: "-100",
    cuotaLiquidaLegal: "0",
    reduccionArt20: "0",
  })
})
it.each([
  { ejercicio: 2026 },
  { otrasRentas: "presentes" },
  { modalidad: "conjunta" },
  { comunidadAutonoma: "simulada-estatal" },
  { conciliacion: undefined },
  { retencionTrabajoAeat: {} },
  { pagosACuentaCentimos: 100 },
])("rechaza incompatibilidad o hecho ausente %j", (cambio) => {
  const r = Effect.runSync(
    Effect.result(liquidarEntradaJavaScript({ ...trabajo(), ...cambio }))
  )
  expect(r).toMatchObject({
    _tag: "Failure",
    failure: { _tag: "ResultadoNoSoportado" },
  })
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
function actividad() {
  return {
    ...alcance,
    perfil: "solo-actividad-eds",
    actividad: {
      ...casoBase(),
      ingresos: [ingreso("10000", true)],
      retenciones: [
        {
          id: "ret",
          justificante: "cert",
          fecha: "2025-12-31",
          operacionId: "ret-1",
          ingresoId: "factura",
          importe: "1500",
          efectiva: true,
        },
      ],
      pagosFraccionados: [
        {
          id: "pago",
          justificante: "130",
          fecha: "2025-04-20",
          operacionId: "pago-1",
          periodo: "2025-1T",
          modelo: "130",
          importe: "100",
          efectivo: true,
        },
      ],
    },
  }
}
it("EDS integra art32 una vez y pagos fuera de la base", () => {
  // Cliente único elegible elige gasto difícil: no acumula reducción por rentas bajas.
  const r = Effect.runSync(liquidarEntradaJavaScript(actividad()))
  expect(r).toMatchObject({
    baseImponibleGeneral: "9500",
    baseLiquidableGeneral: "9500",
    reduccionArt20: "0",
    deduccionTrabajo: "0",
    retenciones: "1500",
    pagosFraccionados: "100",
  })
  // Madrid: (9500-5550)*9,5% + (9500-5956,65)*8,5% = 676,43475.
  expect(r).toMatchObject({
    cuotaLiquidaLegal: "676.43475",
    cuotaDiferencial: "-923.56525",
    cuotaDiferencialPresentada: "-923.57",
  })
})
it("inicio se aplica después de art32 sin restar pagos de la BIG", () => {
  const c = actividad()
  c.actividad.aplicarInicio = true
  expect(
    Effect.runSync(liquidarEntradaJavaScript(c)).baseImponibleGeneral
  ).toBe("7600")
})
it("rechaza pagos repetidos entre retenciones y modelo130", () => {
  const c = actividad()
  c.actividad.pagosFraccionados[0]!.operacionId = "ret-1"
  expect(
    Effect.runSync(Effect.result(liquidarEntradaJavaScript(c)))
  ).toMatchObject({
    _tag: "Failure",
    failure: { _tag: "ResultadoNoSoportado" },
  })
})
it("rechaza pensión y empleo mezclados aunque se aporten totales", () => {
  const c = trabajo()
  c.trabajo.rendimientos.push({
    ...c.trabajo.rendimientos[0]!,
    id: "pension",
    clase: "pension",
  })
  expect(
    Effect.runSync(Effect.result(liquidarEntradaJavaScript(c)))
  ).toMatchObject({
    _tag: "Failure",
    failure: { _tag: "ResultadoNoSoportado" },
  })
})
it("dos importes iguales con operaciones distintas no se deduplican", () => {
  const c = trabajo()
  const retenciones = ["r1", "r2"].map((operacionId) => ({
    operacionId,
    procedencia: "cert#" + operacionId,
    ejercicio: 2025,
    importe: "100",
    efectiva: true,
  }))
  expect(
    Effect.runSync(liquidarEntradaJavaScript({ ...c, retenciones })).retenciones
  ).toBe("200")
})
it("rastro conserva decimales e identidades distintas", () => {
  const r = Effect.runSync(liquidarEntradaJavaScript(trabajo()))
  const lineas = r.rastro.pasos.flatMap((p) => p.lineasCalculo ?? [])
  expect(
    lineas.find((l) => l.origen?.siteId === "anual.explicito.big")?.origen
      ?.decimal
  ).toBe("10291.0275")
  expect(new Set(lineas.map((l) => l.origen?.instanceId)).size).toBe(
    lineas.length
  )
})
it("cuota legal de trabajo y posterior mantienen el orden con expectativa independiente", () => {
  // 4741,0275 * 9,5% + 4334,3775 * 8,5%; DA61 = 340 − 0,01 * 0,2.
  expect(Effect.runSync(liquidarEntradaJavaScript(trabajo()))).toMatchObject({
    cuotaLiquidaLegal: "818.8197",
    cuotaPosterior: "478.8217",
    cuotaDiferencialPresentada: "478.82",
  })
})
it.each(["16576", "18276", "19747.50"])(
  "fronteras anuales %s sin doble deducción",
  (bruto) => {
    const r = Effect.runSync(liquidarEntradaJavaScript(trabajo(bruto)))
    expect(r.deduccionTrabajo).toBe(bruto === "16576" ? "340" : "0")
    if (bruto === "19747.50") expect(r.reduccionArt20).toBe("0")
  }
)
it("gastos conciliados tienen límites anuales, no por pagador", () => {
  const c = trabajo("20000")
  const primero = c.trabajo.rendimientos[0]!
  primero.sindicato = { importe: "600", satisfecho: "si" }
  primero.colegio = {
    importe: "400",
    satisfecho: "si",
    obligatorio: "si",
    finesEsenciales: "si",
  }
  primero.defensa = {
    importe: "200",
    satisfecho: "si",
    litigioDirectoPagador: "si",
  }
  c.trabajo.rendimientos.push({ ...primero, id: "segundo" })
  // 40000 − 1200 sindicato − 500 colegio − 300 defensa − 2000 generales.
  expect(
    Effect.runSync(liquidarEntradaJavaScript(c)).baseImponibleGeneral
  ).toBe("36000")
})
it.each(["ordinaria", "desconocida"])(
  "no presume movilidad %s",
  (movilidad) => {
    const c = trabajo()
    c.trabajo.movilidad = movilidad
    expect(
      Effect.runSync(Effect.result(liquidarEntradaJavaScript(c)))
    ).toMatchObject({
      _tag: "Failure",
      failure: { _tag: "ResultadoNoSoportado" },
    })
  }
)
it("pérdida EDS llega con signo a BIG y BLG", () => {
  const c = actividad()
  const actividadConPerdida = {
    ...c.actividad,
    ingresos: [],
    retenciones: [],
    pagosFraccionados: [],
    reta: [
      {
        id: "cuota",
        justificante: "extracto#op1",
        fecha: "2025-06-30",
        importe: "300",
        tipo: "ordinaria",
        propia: true,
        efectiva: true,
        periodo: "2025-06",
      },
    ],
  }
  expect(
    Effect.runSync(
      liquidarEntradaJavaScript({ ...c, actividad: actividadConPerdida })
    )
  ).toMatchObject({
    baseImponibleGeneral: "-300",
    baseLiquidableGeneral: "-300",
    cuotaDiferencial: "0",
  })
})

/** Simula consumidores JavaScript para probar la frontera runtime, incluso entradas inválidas. */
interface CasoAnualJavaScript { readonly ejercicio: number }
function liquidarEntradaJavaScript<Entrada extends CasoAnualJavaScript>(entrada: Entrada) {
  // @ts-expect-error El ensayo omite deliberadamente la garantía estática del contrato.
  return liquidarIrpfAnualExplicito(entrada)
}
