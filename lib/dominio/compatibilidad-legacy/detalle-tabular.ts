import type { AnioFiscal } from "../normativa/anio-fiscal"
import { obtenerParametrosCotizacionLegacy } from "../laboral/cotizaciones-sociales"
import {
  GASTOS_FIJOS_IRPF_LEGACY,
  MINIMO_PERSONAL_IRPF_LEGACY,
  obtenerTramosIrpfLegacy,
} from "../normativa/datos/irpf-estatal-2012-2026"
import { obtenerEspecificacionCompatibilidadHistorica } from "../normativa/datos/compatibilidad-historica"
import { redondearNumpy, redondearPython } from "./aritmetica-tabular"

// Una operación con np.int64/float64 propaga NumPy; constantes y tramos
// totalmente agotados siguen siendo floats Python en el original.
interface Escalar {
  readonly valor: number
  readonly numpy: boolean
}
const py = (valor: number): Escalar => ({ valor, numpy: false })
const np = (valor: number): Escalar => ({ valor, numpy: true })
const sumar = (a: Escalar, b: Escalar): Escalar => ({
  valor: a.valor + b.valor,
  numpy: a.numpy || b.numpy,
})
const restar = (a: Escalar, b: Escalar): Escalar => ({
  valor: a.valor - b.valor,
  numpy: a.numpy || b.numpy,
})
const multiplicar = (a: Escalar, b: number): Escalar => ({
  valor: a.valor * b,
  numpy: a.numpy,
})
const positivo = (a: Escalar) => (a.valor > 0 ? a : py(0))
const redondear = (a: Escalar) =>
  a.numpy ? redondearNumpy(a.valor) : redondearPython(a.valor)
const reduccionLineal = (
  r: Escalar,
  inferior: number,
  superior: number,
  maxima: number,
  pendiente: number,
  minima = 0
): Escalar =>
  r.valor <= inferior
    ? py(maxima)
    : r.valor <= superior
      ? positivo(
          restar(py(maxima), multiplicar(restar(r, py(inferior)), pendiente))
        )
      : py(minima)

const reduccion = (r: Escalar, anio: AnioFiscal): Escalar => {
  if (anio <= 2014) return reduccionLineal(r, 9180, 13260, 4080, 0.35, 2652)
  if (anio <= 2017) return reduccionLineal(r, 11250, 14450, 3700, 1.15625)
  if (anio === 2018)
    return sumar(
      multiplicar(reduccionLineal(r, 11250, 14450, 3700, 1.15625), 0.5),
      multiplicar(reduccionLineal(r, 13115, 16825, 5565, 1.5), 0.5)
    )
  if (anio <= 2022) return reduccionLineal(r, 13115, 16825, 5565, 1.5)
  if (anio === 2023) return reduccionLineal(r, 14047.5, 19747.5, 6498, 1.14)
  if (r.valor <= 14852) return py(7302)
  if (r.valor <= 17673.52)
    return restar(py(7302), multiplicar(restar(r, py(14852)), 1.75))
  if (r.valor <= 19747.5)
    return restar(py(2364.34), multiplicar(restar(r, py(17673.52)), 1.14))
  return py(0)
}

export const filaDetalleTabular = (
  anio: AnioFiscal,
  salario: number
): ReadonlyArray<number> => {
  const bruto = np(salario)
  const p = obtenerParametrosCotizacionLegacy(anio)
  const maximo = p.baseMaxima.toNumber()
  const base = salario <= maximo ? bruto : py(maximo)
  const tipos = Object.values(p.tiposSeguridadSocial)
  const empresa = multiplicar(
    base,
    tipos.reduce((n, t) => n + t.empresarial.toNumber(), 0) +
      p.mei.empresarial.toNumber()
  )
  const trabajador = multiplicar(
    base,
    tipos.reduce((n, t) => n + t.trabajador.toNumber(), 0) +
      p.mei.trabajador.toNumber()
  )
  const exceso = salario - maximo
  const sol = p.solidaridad
  const cuotaSol =
    sol._tag === "ConSolidaridad" && exceso > 0
      ? np(
          Math.min(exceso, maximo * 0.1) * sol.tipoPrimerExceso.toNumber() +
            Math.min(
              Math.max(0, exceso - maximo * 0.1),
              maximo * 0.5 - maximo * 0.1
            ) *
              sol.tipoSegundoExceso.toNumber() +
            Math.max(0, exceso - maximo * 0.5) *
              sol.tipoExcesoRestante.toNumber()
        )
      : py(0)
  const cotEmpresa = sumar(empresa, multiplicar(cuotaSol, 5 / 6))
  const cotTrabajador = sumar(trabajador, multiplicar(cuotaSol, 1 / 6))
  const previo = restar(bruto, cotTrabajador)
  const red = reduccion(previo, anio)
  const gastos = GASTOS_FIJOS_IRPF_LEGACY[anio].toNumber()
  const imponible = positivo(restar(positivo(restar(previo, py(gastos))), red))
  const tramos = obtenerTramosIrpfLegacy(anio)
  const cuotas = tramos.map(([limite, tipo], i) => {
    const anterior = i === 0 ? 0 : tramos[i - 1][0].toNumber()
    if (imponible.valor <= 0 || imponible.valor < anterior) return py(0)
    return imponible.valor > limite.toNumber()
      ? py((limite.toNumber() - anterior) * tipo.toNumber())
      : multiplicar(restar(imponible, py(anterior)), tipo.toNumber())
  })
  const integra = cuotas.reduce(sumar, py(0))
  const minimo = py(
    MINIMO_PERSONAL_IRPF_LEGACY[anio].toNumber() * tramos[0][1].toNumber()
  )
  const teorica = positivo(restar(integra, minimo))
  // Importes y umbrales del Python heredado; no cambiar por normas posteriores.
  const deduccion =
    anio === 2026
      ? salario <= 17094
        ? py(590.89)
        : positivo(
            restar(py(590.89), multiplicar(restar(bruto, py(17094)), 0.2))
          )
      : anio === 2025
        ? salario <= 16576
          ? py(340)
          : salario <= 18276
            ? positivo(
                restar(py(340), multiplicar(restar(bruto, py(16576)), 0.2))
              )
            : py(0)
        : py(0)
  const trasSmi = positivo(restar(teorica, deduccion))
  const especificacion = obtenerEspecificacionCompatibilidadHistorica(anio)
  const limite = positivo(
    multiplicar(
      restar(bruto, py(especificacion.minimoExentoRetencion.toNumber())),
      0.43
    )
  )
  const final = trasSmi.valor <= limite.valor ? trasSmi : limite
  return [
    salario,
    ...[
      cotEmpresa,
      sumar(bruto, cotEmpresa),
      cotTrabajador,
      previo,
      py(gastos),
      red,
      imponible,
      ...cuotas,
      integra,
      minimo,
      teorica,
      deduccion,
      trasSmi,
      limite,
      final,
      restar(restar(bruto, cotTrabajador), final),
    ].map(redondear),
  ]
}
