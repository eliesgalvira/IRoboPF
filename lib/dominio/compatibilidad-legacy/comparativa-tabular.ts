import type { AnioFiscal } from "../normativa/anio-fiscal"
import { obtenerParametrosCotizacionLegacy } from "../laboral/cotizaciones-sociales"
import {
  GASTOS_FIJOS_IRPF_LEGACY,
  MINIMO_PERSONAL_IRPF_LEGACY,
  obtenerTramosIrpfLegacy,
} from "../normativa/datos/irpf-estatal-2012-2026"
import { obtenerEspecificacionCompatibilidadHistorica } from "../normativa/datos/compatibilidad-historica"
import {
  IPC_ANUAL_DICIEMBRE,
  ESCENARIO_IPC_2026_LEGACY,
} from "../normativa/datos/ipc-2012-2026"
import { factorIpcPerfilLegacy } from "../inflacion/factor-ipc"
import { redondearNumpy, redondearPython } from "./aritmetica-tabular"

// Contrato de generar_comparativa_inflacion: producto secuencial binary64.
// Comparte datos y metadatos del escenario, no la precisión Decimal de la API.
export const factorComparativaTabular = (anio: AnioFiscal) => {
  let factor = 1
  for (let siguiente = anio + 1; siguiente <= 2026; siguiente++) {
    const tasa =
      siguiente === 2026
        ? Number(ESCENARIO_IPC_2026_LEGACY.tasaDiciembre)
        : IPC_ANUAL_DICIEMBRE[siguiente]?.toNumber()
    if (tasa === undefined)
      throw new RangeError(`IPC ausente para ${siguiente}`)
    factor *= 1 + tasa
  }
  return { factor, procedencia: factorIpcPerfilLegacy(anio, 2026).procedencia }
}

const reduccionLineal = (
  r: number,
  inferior: number,
  superior: number,
  maxima: number,
  pendiente: number,
  minima = 0
) =>
  r <= inferior
    ? maxima
    : r <= superior
      ? Math.max(0, maxima - pendiente * (r - inferior))
      : minima

const reduccion = (r: number, anio: AnioFiscal): number => {
  if (anio <= 2014) return reduccionLineal(r, 9180, 13260, 4080, 0.35, 2652)
  if (anio <= 2017) return reduccionLineal(r, 11250, 14450, 3700, 1.15625)
  if (anio === 2018)
    return (
      reduccionLineal(r, 11250, 14450, 3700, 1.15625) / 2 +
      reduccionLineal(r, 13115, 16825, 5565, 1.5) / 2
    )
  if (anio <= 2022) return reduccionLineal(r, 13115, 16825, 5565, 1.5)
  if (anio === 2023) return reduccionLineal(r, 14047.5, 19747.5, 6498, 1.14)
  if (r <= 14852) return 7302
  if (r <= 17673.52) return 7302 - 1.75 * (r - 14852)
  if (r <= 19747.5) return 2364.34 - 1.14 * (r - 17673.52)
  return 0
}

// No redondear intermedios: la hoja reexpresa antes de redondear cada salida.
// NumPy y Python operan ambos en binary64 aquí; su tipo solo afecta a round,
// que ocurre después de multiplicar por el factor y ya recibe escalares NumPy.
const nominaAgregadaTabular = (salario: number, anio: AnioFiscal) => {
  const p = obtenerParametrosCotizacionLegacy(anio)
  const maximo = p.baseMaxima.toNumber()
  const base = Math.min(salario, maximo)
  const tipos = Object.values(p.tiposSeguridadSocial)
  const empresa =
    base *
    (tipos.reduce((n, t) => n + t.empresarial.toNumber(), 0) +
      p.mei.empresarial.toNumber())
  const trabajador =
    base *
    (tipos.reduce((n, t) => n + t.trabajador.toNumber(), 0) +
      p.mei.trabajador.toNumber())
  const exceso = Math.max(0, salario - maximo)
  const sol = p.solidaridad
  const cuotaSol =
    sol._tag === "ConSolidaridad" && exceso > 0
      ? Math.min(exceso, maximo * 0.1) * sol.tipoPrimerExceso.toNumber() +
        Math.min(
          Math.max(0, exceso - maximo * 0.1),
          maximo * 0.5 - maximo * 0.1
        ) *
          sol.tipoSegundoExceso.toNumber() +
        Math.max(0, exceso - maximo * 0.5) * sol.tipoExcesoRestante.toNumber()
      : 0
  const cotEmpresa = empresa + cuotaSol * (5 / 6)
  const cotTrabajador = trabajador + cuotaSol * (1 / 6)
  const previo = salario - cotTrabajador
  const imponible = Math.max(
    0,
    previo - GASTOS_FIJOS_IRPF_LEGACY[anio].toNumber() - reduccion(previo, anio)
  )
  const tramos = obtenerTramosIrpfLegacy(anio)
  const integra = tramos.reduce(
    (estado, [limite, tipo]) => {
      if (estado.terminado) return estado
      return {
        cuota:
          estado.cuota +
          ((imponible > limite.toNumber() ? limite.toNumber() : imponible) -
            estado.anterior) *
            tipo.toNumber(),
        anterior: limite.toNumber(),
        terminado: imponible <= limite.toNumber(),
      }
    },
    { cuota: 0, anterior: 0, terminado: false }
  ).cuota
  const minimo =
    MINIMO_PERSONAL_IRPF_LEGACY[anio].toNumber() * tramos[0][1].toNumber()
  const teorica = Math.max(0, integra - minimo)
  const deduccion =
    anio === 2026
      ? salario <= 17094
        ? 590.89
        : Math.max(0, 590.89 - 0.2 * (salario - 17094))
      : anio === 2025
        ? salario <= 16576
          ? 340
          : salario <= 18276
            ? Math.max(0, 340 - 0.2 * (salario - 16576))
            : 0
        : 0
  const trasSmi = Math.max(0, teorica - deduccion)
  const limite = Math.max(
    0,
    (salario -
      obtenerEspecificacionCompatibilidadHistorica(
        anio
      ).minimoExentoRetencion.toNumber()) *
      0.43
  )
  const final = Math.min(trasSmi, limite)
  return {
    coste: salario + cotEmpresa,
    empresa: cotEmpresa,
    trabajador: cotTrabajador,
    irpf: final,
    neto: salario - cotTrabajador - final,
  }
}

export const filaComparativaTabular = (
  anio: AnioFiscal,
  salario: number
): ReadonlyArray<number | string> => {
  const { factor } = factorComparativaTabular(anio)
  const nominal = salario / factor
  const anterior = nominaAgregadaTabular(nominal, anio)
  const referencia = nominaAgregadaTabular(salario, 2026)
  const neto = anterior.neto * factor
  const delta = neto - referencia.neto
  const porcentaje = redondearPython((factor - 1) * 100)
  return [
    anio,
    salario,
    redondearPython(factor, 4),
    `${Number.isInteger(porcentaje) ? porcentaje.toFixed(1) : porcentaje}%`,
    ...[
      nominal,
      anterior.coste * factor,
      anterior.empresa * factor,
      anterior.trabajador * factor,
      anterior.irpf * factor,
      neto,
      referencia.neto,
      delta / 12,
      delta,
    ].map((v) => redondearNumpy(v)),
  ]
}
