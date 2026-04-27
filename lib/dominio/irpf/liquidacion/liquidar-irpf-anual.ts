import Decimal from "decimal.js"

import type { CasoFiscalAnual } from "../caso-fiscal-anual"
import type { RastroCalculo } from "../../explicacion/rastro-calculo"
import {
  centimosAEuros,
  eurosACentimos,
  redondearImporteLiquidado,
} from "../../dinero/importe-monetario"
import { calcularCuotaDiferencialCentimos } from "../cuotas/cuota-diferencial"
import { calcularCuotaPorEscalaGeneral } from "../cuotas/escalas-gravamen"
import { calcularBaseImponibleGeneral } from "../integracion/base-imponible-general"
import { obtenerMinimoContribuyente } from "../minimos/minimo-contribuyente"
import {
  calcularRendimientoNetoTrabajo,
  sumarRendimientosTrabajo,
} from "../rendimientos/rendimientos-trabajo"

export type { CasoFiscalAnual } from "../caso-fiscal-anual"

export interface ContextoLiquidacionIrpf {
  readonly modo: "canonico" | "compatible-legacy"
}

export interface ResultadoNoSoportado {
  readonly _tag: "ResultadoNoSoportado"
  readonly motivo: string
  readonly fuenteReconocida: string
  readonly rastro: RastroCalculo
}

export interface ResultadoLiquidacionIrpfSoportada {
  readonly _tag: "ResultadoLiquidacionIrpf"
  readonly perfil: "renta-individual-general"
  readonly anio: CasoFiscalAnual["anio"]
  readonly baseImponibleGeneralCentimos: number
  readonly baseLiquidableGeneralCentimos: number
  readonly cuotaIntegraGeneralCentimos: number
  readonly cuotaMinimoPersonalCentimos: number
  readonly cuotaLiquidaCentimos: number
  readonly cuotaDiferencialCentimos: number
  readonly rastro: RastroCalculo
}

export type ResultadoLiquidacionIrpf =
  | ResultadoLiquidacionIrpfSoportada
  | ResultadoNoSoportado

export const liquidarIrpfAnual = (
  caso: CasoFiscalAnual,
  _contexto: ContextoLiquidacionIrpf
): ResultadoLiquidacionIrpf => {
  if ((caso.rendimientos.capitalInmobiliario?.length ?? 0) > 0) {
    return {
      _tag: "ResultadoNoSoportado",
      motivo: "Rendimientos de capital inmobiliario aun no implementados",
      fuenteReconocida: "docs/fuentes/aeat/manual-renta-2025-parte-1.md",
      rastro: rastroResultadoNoSoportado({
        caso,
        tituloPaso: "Rendimiento no soportado",
        descripcionPaso:
          "Los rendimientos de capital inmobiliario estan reconocidos por el dominio, pero esta vertical slice aun no liquida sus reglas.",
      }),
    }
  }

  const resultadoNoSoportado = detectarCasoNoSoportado(caso)
  if (resultadoNoSoportado !== null) {
    return resultadoNoSoportado
  }

  return liquidarTrabajoIndividualSimple(caso)
}

const liquidarTrabajoIndividualSimple = (
  caso: CasoFiscalAnual
): ResultadoLiquidacionIrpfSoportada => {
  const rendimientoIntegroTrabajo = sumarRendimientosTrabajo(
    caso.rendimientos.trabajo,
    centimosAEuros
  )
  const rendimientoTrabajo = calcularRendimientoNetoTrabajo({
    anio: caso.anio,
    rendimientoIntegro: rendimientoIntegroTrabajo,
  })
  const baseImponibleGeneral = calcularBaseImponibleGeneral({
    rendimientoTrabajo,
  })
  const baseLiquidableGeneral = baseImponibleGeneral
  const cuotaIntegraGeneral = calcularCuotaPorEscalaGeneral({
    anio: caso.anio,
    base: baseLiquidableGeneral,
  })
  const cuotaMinimoPersonal = calcularCuotaPorEscalaGeneral({
    anio: caso.anio,
    base: obtenerMinimoContribuyente(caso.anio),
  })
  const cuotaLiquida = Decimal.max(
    0,
    cuotaIntegraGeneral.minus(cuotaMinimoPersonal)
  )
  const cuotaLiquidaCentimos = eurosACentimos(
    redondearImporteLiquidado(cuotaLiquida)
  )

  return {
    _tag: "ResultadoLiquidacionIrpf",
    perfil: "renta-individual-general",
    anio: caso.anio,
    baseImponibleGeneralCentimos: eurosACentimos(
      redondearImporteLiquidado(baseImponibleGeneral)
    ),
    baseLiquidableGeneralCentimos: eurosACentimos(
      redondearImporteLiquidado(baseLiquidableGeneral)
    ),
    cuotaIntegraGeneralCentimos: eurosACentimos(
      redondearImporteLiquidado(cuotaIntegraGeneral)
    ),
    cuotaMinimoPersonalCentimos: eurosACentimos(
      redondearImporteLiquidado(cuotaMinimoPersonal)
    ),
    cuotaLiquidaCentimos,
    cuotaDiferencialCentimos: calcularCuotaDiferencialCentimos({
      cuotaLiquidaCentimos,
      pagosACuentaCentimos: caso.pagosACuentaCentimos,
      retencionesSoportadasCentimos: caso.retencionesSoportadasCentimos,
    }),
    rastro: {
      titulo: `Liquidacion anual del IRPF ${caso.anio}`,
      pasos: [
        {
          _tag: "PasoExplicacion",
          titulo: "Rendimientos del trabajo",
          descripcion: `Rendimiento integro ${rendimientoIntegroTrabajo.toFixed(2)} euros menos cotizacion del trabajador y gastos deducibles.`,
          fuentes: [
            {
              titulo: "Manual Renta 2025 Parte 1",
              referencia: "docs/fuentes/aeat/manual-renta-2025-parte-1.md",
            },
          ],
        },
        {
          _tag: "PasoExplicacion",
          titulo: "Base general y minimo personal",
          descripcion: `Base liquidable general ${baseLiquidableGeneral.toFixed(2)} euros y minimo del contribuyente ${obtenerMinimoContribuyente(caso.anio).toFixed(2)} euros.`,
          fuentes: [
            {
              titulo: "Parametros IRPF estatal 2012-2026",
              referencia:
                "lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts",
            },
          ],
        },
        {
          _tag: "PasoExplicacion",
          titulo: "Cuota diferencial",
          descripcion: `Cuota liquida ${cuotaLiquida.toFixed(2)} euros menos retenciones y pagos a cuenta declarados.`,
          fuentes: [],
        },
      ],
    },
  }
}

const detectarCasoNoSoportado = (
  caso: CasoFiscalAnual
): ResultadoNoSoportado | null => {
  if (caso.situacionFamiliar.descendientes.length > 0) {
    return resultadoNoSoportado(caso, {
      motivo: "Minimo por descendientes aun no implementado",
      tituloPaso: "Circunstancia familiar no soportada",
      descripcionPaso:
        "El caso fiscal incluye descendientes, pero esta vertical slice solo liquida persona individual sin descendientes.",
    })
  }

  if (caso.situacionFamiliar.ascendientes.length > 0) {
    return resultadoNoSoportado(caso, {
      motivo: "Minimo por ascendientes aun no implementado",
      tituloPaso: "Circunstancia familiar no soportada",
      descripcionPaso:
        "El caso fiscal incluye ascendientes, pero esta vertical slice solo liquida persona individual sin ascendientes.",
    })
  }

  return null
}

const resultadoNoSoportado = (
  caso: CasoFiscalAnual,
  opciones: {
    readonly motivo: string
    readonly tituloPaso: string
    readonly descripcionPaso: string
  }
): ResultadoNoSoportado => ({
  _tag: "ResultadoNoSoportado",
  motivo: opciones.motivo,
  fuenteReconocida: "docs/fuentes/aeat/manual-renta-2025-parte-1.md",
  rastro: rastroResultadoNoSoportado({
    caso,
    tituloPaso: opciones.tituloPaso,
    descripcionPaso: opciones.descripcionPaso,
  }),
})

const rastroResultadoNoSoportado = ({
  caso,
  tituloPaso,
  descripcionPaso,
}: {
  readonly caso: CasoFiscalAnual
  readonly tituloPaso: string
  readonly descripcionPaso: string
}): RastroCalculo => ({
  titulo: `Liquidacion anual del IRPF ${caso.anio}`,
  pasos: [
    {
      _tag: "PasoExplicacion",
      titulo: "Caso fiscal anual reconocido",
      descripcion: `El motor ha recibido un caso individual para la comunidad ${caso.comunidadAutonoma}.`,
      fuentes: [],
    },
    {
      _tag: "PasoExplicacion",
      titulo: tituloPaso,
      descripcion: descripcionPaso,
      fuentes: [
        {
          titulo: "Manual Renta 2025 Parte 1",
          referencia: "docs/fuentes/aeat/manual-renta-2025-parte-1.md",
        },
      ],
    },
  ],
})
