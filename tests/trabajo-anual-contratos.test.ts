import { describe, expect, it } from "vitest"
import {
  calcularDeduccionTrabajo,
  calcularGastosTrabajo,
} from "../lib/dominio/irpf/trabajo-anual/calcular"
import { adaptarTrabajoAnual } from "../lib/dominio/irpf/trabajo-anual/adaptador"
import type {
  GastosTrabajo,
  DeduccionTrabajo,
} from "../lib/dominio/irpf/trabajo-anual/contrato"

const gastos = (): GastosTrabajo => ({
  ejercicio: 2025,
  territorio: "comun",
  reduccionesArt18: "ninguna",
  movilidad: "ninguna",
  discapacidadActiva: "ninguna",
  rendimientos: [
    {
      id: "empleo",
      clase: "empleo-laboral",
      integro: "16500",
      cotizaciones: {
        clase: "efectivas",
        seguridadSocial: "1200",
        derechosPasivos: "0",
        colegiosHuerfanos: "0",
      },
      sindicato: { importe: "0", satisfecho: "si" },
      colegio: {
        importe: "0",
        satisfecho: "si",
        obligatorio: "si",
        finesEsenciales: "si",
      },
      defensa: { importe: "0", satisfecho: "si", litigioDirectoPagador: "si" },
    },
  ],
})
const da61 = (): Extract<DeduccionTrabajo, { regla: "da61" }> => ({
  regla: "da61",
  ambito: "comun-individual",
  ejercicio: 2025,
  brutoServicios: "16500",
  otrasRentasNoExentas: "0",
  netoReducidoServicios: "5998",
  baseLiquidableGeneral: "5998",
  cuotaIntegraGeneral: "187.19",
  cuotaLiquidaTotal: "187.19",
  cuotaTrasArt80: "187.19",
  etapa: "despues-art80-sin-deduccion-trabajo",
  calificacion: "laboral-estatutaria-acreditada",
})
const historica = (): Extract<DeduccionTrabajo, { regla: "art80bis" }> => ({
  regla: "art80bis",
  ambito: "comun-individual",
  computo: "netos-tras-art20-art32-sin-exterior-no-gravado",
  ejercicio: 2012,
  baseImponible: "8000",
  tipoMedioEstatalPorcentaje: "5",
  tipoMedioAutonomicoPorcentaje: "5",
  rendimientoComputableTrabajoActividad: "1000",
  cuotaTrasArt80: "600",
  etapa: "despues-art80-sin-deduccion-trabajo",
})

describe("contrato anual separado, expectativas de originales", () => {
  it("AEAT2025 p1373 limita 340 a 187,19", () =>
    expect(calcularDeduccionTrabajo(da61())).toMatchObject({
      estado: "calculado",
      deduccionLegal: "340",
      importeAplicable: "187.19",
      cuotaPosterior: "0",
    }))
  it.each([
    ["16575.99", "340"],
    ["16576", "340"],
    ["16576.01", "339.998"],
    ["18275.99", "0.002"],
    ["18276", "0"],
    ["18276.01", "0"],
    ["17500", "155.2"],
  ])("DA61 bruto %s", (bruto, esperado) =>
    expect(
      calcularDeduccionTrabajo({ ...da61(), brutoServicios: bruto })
    ).toMatchObject({ deduccionLegal: esperado })
  )
  it.each([
    ["6500", "340"],
    ["6500.01", "0"],
    ["12150", "0"],
  ])("otras rentas %s, pensión incluida", (otras, esperado) =>
    expect(
      calcularDeduccionTrabajo({ ...da61(), otrasRentasNoExentas: otras })
    ).toMatchObject({ deduccionLegal: esperado })
  )
  it("límite proporcional íntegro y orden tras art80", () =>
    expect(
      calcularDeduccionTrabajo({
        ...da61(),
        netoReducidoServicios: "1000",
        baseLiquidableGeneral: "4000",
        cuotaIntegraGeneral: "800",
        cuotaTrasArt80: "50",
      })
    ).toMatchObject({
      limiteAtribuible: "200",
      importeAplicable: "50",
      cuotaPosterior: "0",
    }))
  it.each([
    ["7999.99", "400"],
    ["8000", "400"],
    ["8000.01", "399.999"],
    ["11999.99", "0.001"],
    ["12000", "0"],
    ["12000.01", "0"],
  ])("80bis BI %s", (base, esperado) =>
    expect(
      calcularDeduccionTrabajo({ ...historica(), baseImponible: base })
    ).toMatchObject({ deduccionLegal: esperado })
  )
  it("80bis no resta 400 si límite atribuible 100", () =>
    expect(calcularDeduccionTrabajo(historica())).toMatchObject({
      importeAplicable: "100",
      cuotaPosterior: "500",
    }))
  it("cotización efectiva 1200, no estimada", () =>
    expect(calcularGastosTrabajo(gastos())).toMatchObject({
      gastosAE: "1200",
      netoPrevioArt20: "15300",
      netoArt19: "13300",
    }))
  it("topes anuales 300 y 500; sindicato sin ese tope", () => {
    const c = gastos()
    const r = c.rendimientos[0]!
    expect(
      calcularGastosTrabajo({
        ...c,
        rendimientos: [
          {
            ...r,
            sindicato: { importe: "600", satisfecho: "si" },
            colegio: { ...r.colegio, importe: "800" },
            defensa: { ...r.defensa, importe: "350" },
          },
        ],
      })
    ).toMatchObject({ gastosAE: "2600" })
  })
  it("gastos generales limitados; pérdidas de a–e conservadas", () => {
    const c = gastos()
    expect(
      calcularGastosTrabajo({
        ...c,
        rendimientos: [{ ...c.rendimientos[0]!, integro: "1000" }],
      })
    ).toMatchObject({ generalesAplicados: "0", netoArt19: "-200" })
  })
  it("discapacidad activa limitada al rendimiento asociado único", () => {
    const c = gastos()
    expect(
      calcularGastosTrabajo({
        ...c,
        discapacidadActiva: {
          grado: "65-o-mas",
          ayudaOMovilidadReducida: "no",
          acreditadaDuranteTodoElTrabajo: "si",
        },
        rendimientos: [{ ...c.rendimientos[0]!, integro: "4000" }],
      })
    ).toMatchObject({ discapacidadAplicada: "800", netoArt19: "0" })
  })
  it.each(["ordinaria", "dt6-2015", "desconocida"] as const)(
    "rechaza movilidad %s",
    (movilidad) =>
      expect(calcularGastosTrabajo({ ...gastos(), movilidad })).toMatchObject({
        estado: "no-soportado",
      })
  )
  it.each(["17094", "20048.45"])(
    "2026 no certificado para %s",
    (brutoServicios) =>
      expect(
        calcularDeduccionTrabajo({ ...da61(), ejercicio: 2026, brutoServicios })
      ).toMatchObject({ estado: "no-soportado" })
  )
  it("adapter no resta otra vez gastos", () =>
    expect(adaptarTrabajoAnual(gastos())).toMatchObject({
      rendimientoAntesArt20: "13300",
      argumentoArt20: "15300",
    }))
  it("rechaza propiedades extra en runtime", () => {
    const c = { ...gastos(), deduccionManual: "400" }
    expect(calcularGastosTrabajo(c)).toMatchObject({ estado: "no-soportado" })
  })
  it("rechaza estimaciones", () => {
    const c = gastos()
    const r = c.rendimientos[0]!
    expect(
      calcularGastosTrabajo({
        ...c,
        rendimientos: [
          { ...r, cotizaciones: { ...r.cotizaciones, clase: "estimadas" } },
        ],
      })
    ).toMatchObject({ estado: "no-soportado" })
  })
})

it("autorrevisión: rechaza neto atribuible mayor que su bruto", () => {
  expect(
    calcularDeduccionTrabajo({
      ...da61(),
      brutoServicios: "100",
      netoReducidoServicios: "200",
      baseLiquidableGeneral: "200",
    })
  ).toMatchObject({ estado: "no-soportado" })
})
it("dos pagadores no duplican topes ni gasto general", () => {
  const c = gastos()
  const r = c.rendimientos[0]!
  const gasto = {
    ...r,
    colegio: { ...r.colegio, importe: "400" },
    defensa: { ...r.defensa, importe: "250" },
  }
  expect(
    calcularGastosTrabajo({
      ...c,
      rendimientos: [gasto, { ...gasto, id: "segundo" }],
    })
  ).toMatchObject({ gastosAE: "3200", generalesAplicados: "2000" })
})
it("colegio voluntario y defensa sin litigio directo no deducen", () => {
  const c = gastos(),
    r = c.rendimientos[0]!
  expect(
    calcularGastosTrabajo({
      ...c,
      rendimientos: [
        {
          ...r,
          colegio: { ...r.colegio, importe: "500", obligatorio: "no" },
          defensa: {
            ...r.defensa,
            importe: "300",
            litigioDirectoPagador: "no",
          },
        },
      ],
    })
  ).toMatchObject({ gastosAE: "1200" })
})
it("pensión no acredita discapacidad activa", () => {
  const c = gastos()
  expect(
    calcularGastosTrabajo({
      ...c,
      discapacidadActiva: {
        grado: "65-o-mas",
        ayudaOMovilidadReducida: "no",
        acreditadaDuranteTodoElTrabajo: "si",
      },
      rendimientos: [{ ...c.rendimientos[0]!, clase: "pension" }],
    })
  ).toMatchObject({ estado: "no-soportado" })
})
it("histórico no recibe gasto general de 2000", () =>
  expect(calcularGastosTrabajo({ ...gastos(), ejercicio: 2014 })).toMatchObject(
    { generalesAplicados: "0", netoArt19: "15300" }
  ))
