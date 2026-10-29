import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { CasoFiscalAnualExplicito } from "./conexion-contrato"
import { adaptarTrabajoAnual } from "./adaptador"
import { adaptarActividadGeneral } from "../actividades-economicas/adaptador"
import { calcularDeduccionTrabajo } from "./calcular"
import { calcularReduccionTrabajoConOtrasRentas } from "../reducciones/reduccion-rendimientos-trabajo"
import { obtenerParametrosComunidadAutonoma } from "../comunidades/comunidad-autonoma"
import { obtenerEscalaAutonomicaPublicada } from "../cuotas/escalas-publicadas"
import { MINIMOS_ESTATALES_2025 } from "../../normativa/datos/minimos-autonomicos-2025"
import { calcularCuotaPorEscala } from "../cuotas/escalas-gravamen"
import { crearLineaCalculo } from "../../explicacion/linea-calculo"
import type { RastroCalculo } from "../../explicacion/rastro-calculo"
import type { ResultadoNoSoportado } from "../liquidacion/liquidar-irpf-anual"

const D = Decimal.clone({ precision: 80 })
const rechazar = (motivo: string): ResultadoNoSoportado => ({
  _tag: "ResultadoNoSoportado",
  motivo,
  fuenteReconocida:
    "docs/procedencia/implementaciones/conexion-anual/INFORME.md",
  rastro: { titulo: "Alcance anual explícito 2025", pasos: [] },
})

/** Liquidación condicionada a los hechos declarados, sin aceptación fiscal automática. */
export const liquidarIrpfAnualExplicito = Effect.fn(
  "Liquidacion.explicita2025"
)(function* (entrada: CasoFiscalAnualExplicito) {
  const decoded = Schema.decodeUnknownResult(CasoFiscalAnualExplicito)(
    entrada,
    { onExcessProperty: "error" }
  )
  if (Result.isFailure(decoded))
    return yield* Effect.fail(
      rechazar(
        "Entrada incompleta o fuera del alcance individual Madrid 2025 declarado"
      )
    )
  const caso = decoded.success
  const pasos: RastroCalculo["pasos"][number][] = []
  let neto = new D(0),
    reduccionArt20 = new D(0),
    brutoServicios = new D(0)
  let retenciones = new D(0),
    pagos = new D(0)
  if (caso.perfil === "solo-trabajo") {
    if (
      caso.trabajo.ejercicio !== 2025 ||
      caso.trabajo.discapacidadActiva !== "ninguna"
    )
      return yield* Effect.fail(
        rechazar(
          "Ejercicio o discapacidad del trabajo incompatibles con el alcance anual"
        )
      )
    const clases = new Set(caso.trabajo.rendimientos.map((r) => r.clase))
    const empleo = [...clases].every(
      (c) => c === "empleo-laboral" || c === "empleo-estatutario"
    )
    const pension = clases.size === 1 && clases.has("pension")
    if ((!empleo && !pension) || caso.trabajo.rendimientos.length === 0)
      return yield* Effect.fail(
        rechazar(
          "Atribución de gastos y reducciones entre pensión, empleo u otras rentas no soportada"
        )
      )
    const trabajo = adaptarTrabajoAnual(caso.trabajo)
    if (trabajo.estado === "no-soportado")
      return yield* Effect.fail(rechazar(trabajo.motivo))
    neto = new D(trabajo.rendimientoAntesArt20)
    reduccionArt20 = D.min(
      D.max(neto, 0),
      calcularReduccionTrabajoConOtrasRentas({
        anio: 2025,
        rendimientoPrevioNeto: new D(trabajo.argumentoArt20),
        otrasRentasNoExentas: new D(0),
      })
    )
    neto = neto.minus(reduccionArt20)
    if (empleo) brutoServicios = new D(trabajo.gastos.integro)
    if (
      new Set(caso.retenciones.map((r) => r.operacionId)).size !==
      caso.retenciones.length
    )
      return yield* Effect.fail(rechazar("Operación de retención duplicada"))
    retenciones = caso.retenciones.reduce((a, r) => a.plus(r.importe), new D(0))
    pasos.push({
      _tag: "PasoExplicacion",
      titulo: "Trabajo conciliado y reducción única",
      descripcion: `Totales anuales disjuntos aportados: ${caso.conciliacion.procedencia.join(", ")}. Pensión excluida de DA61.`,
      fuentes: [
        {
          titulo: "Alcance y evidencia de la conexión anual",
          referencia:
            "docs/procedencia/implementaciones/conexion-anual/INFORME.md",
        },
      ],
      lineasCalculo: [
        crearLineaCalculo({
          siteId: "anual.explicito.trabajo.integro",
          instancia: 0,
          importe: new D(trabajo.gastos.integro),
          unidad: "EUR",
          etiqueta: "Trabajo íntegro",
          formula: "suma de rendimientos anuales conciliados",
        }),
        crearLineaCalculo({
          siteId: "anual.explicito.trabajo.gastos-a-e",
          instancia: 0,
          importe: new D(trabajo.gastos.gastosAE),
          unidad: "EUR",
          etiqueta: "Gastos a–e",
          formula:
            "cotizaciones efectivas + sindicato + colegio limitado + defensa limitada, una vez al año",
        }),
        crearLineaCalculo({
          siteId: "anual.explicito.trabajo.gasto-f",
          instancia: 0,
          importe: new D(trabajo.gastos.generalesAplicados),
          unidad: "EUR",
          etiqueta: "Gasto general aplicado",
          formula: "min(2000, saldo positivo después de a–e)",
        }),
        crearLineaCalculo({
          siteId: "anual.explicito.trabajo.art19",
          instancia: 0,
          importe: new D(trabajo.rendimientoAntesArt20),
          unidad: "EUR",
          etiqueta: "Neto artículo 19",
          formula: "íntegro menos gastos efectivos a–e y gasto f limitado",
        }),
        crearLineaCalculo({
          siteId: "anual.explicito.trabajo.art20",
          instancia: 0,
          importe: reduccionArt20,
          unidad: "EUR",
          etiqueta: "Reducción artículo 20",
          formula:
            "min(saldo positivo art19, reducción sobre neto sin f; otras rentas = 0)",
        }),
      ],
    })
  } else {
    // La cota del adaptador no concilia amortizaciones históricas: no promoverlas al anual.
    if (
      caso.actividad.activos.length > 0 ||
      caso.actividad.discapacidad.grado !== 0
    )
      return yield* Effect.fail(
        rechazar(
          "Activos con amortización y discapacidad de actividad fuera del alcance anual integrado"
        )
      )
    const actividad = adaptarActividadGeneral(caso.actividad)
    if (actividad.estado === "no-soportado")
      return yield* Effect.fail(
        rechazar(actividad.motivos.map((m) => m.motivo).join("; "))
      )
    neto = new D(actividad.aporte.importeEurosExactos)
    retenciones = new D(actividad.aporte.retencionesEuros)
    pagos = new D(actividad.aporte.pagosFraccionadosEuros)
    pasos.push({
      _tag: "PasoExplicacion",
      titulo: "Actividad EDS 2025",
      descripcion:
        "RETA y artículo 32 ya incluidos en el aporte; no se aplican cotizaciones salariales ni artículo 20.",
      fuentes: [
        {
          titulo: "Alcance y evidencia de la conexión anual",
          referencia:
            "docs/procedencia/implementaciones/conexion-anual/INFORME.md",
        },
      ],
      lineasCalculo: actividad.etapas.map((e, instancia) =>
        crearLineaCalculo({
          siteId: "anual.explicito.actividad.etapa",
          instancia: instancia,
          importe: new D(e.importe),
          unidad: "EUR",
          etiqueta: `${e.reglaId}: ${e.id}`,
          formula: e.formula,
        })
      ),
    })
  }
  // Sin otras rentas, reducciones de base ni saldos anteriores: BIG = BLG con signo.
  const base = D.max(neto, 0)
  const parametros = obtenerParametrosComunidadAutonoma({
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  })
  if (parametros._tag === "ComunidadAutonomaNoSoportada")
    return yield* Effect.fail(rechazar(parametros.motivo))
  const publicada = obtenerEscalaAutonomicaPublicada({
    anio: 2025,
    comunidadAutonoma: "madrid",
  })
  const estatal = (b: Decimal) =>
    calcularCuotaPorEscala({ base: b, tramos: parametros.escalaEstatalGeneral })
  const autonomica = (b: Decimal) =>
    calcularCuotaPorEscala({
      base: b,
      tramos: parametros.escalaAutonomica.tramos,
      escalasPublicadas: publicada === undefined ? undefined : [publicada],
    })
  const cuotaEstatal = D.max(
    0,
    estatal(base).minus(
      estatal(D.min(base, MINIMOS_ESTATALES_2025.contribuyente.general))
    )
  )
  const cuotaAutonomica = D.max(
    0,
    autonomica(base).minus(
      autonomica(
        D.min(base, parametros.minimosAutonomicos.contribuyente.general)
      )
    )
  )
  const liquida = cuotaEstatal.plus(cuotaAutonomica)
  let deduccion = new D(0),
    posterior = liquida
  if (brutoServicios.gt(0)) {
    const resultado = calcularDeduccionTrabajo({
      regla: "da61",
      ambito: "comun-individual",
      ejercicio: 2025,
      brutoServicios: brutoServicios.toFixed(),
      otrasRentasNoExentas: "0",
      netoReducidoServicios: base.toFixed(),
      baseLiquidableGeneral: base.toFixed(),
      cuotaIntegraGeneral: liquida.toFixed(),
      cuotaLiquidaTotal: liquida.toFixed(),
      cuotaTrasArt80: liquida.toFixed(),
      etapa: "despues-art80-sin-deduccion-trabajo",
      calificacion: "laboral-estatutaria-acreditada",
    })
    if (resultado.estado === "no-soportado")
      return yield* Effect.fail(rechazar(resultado.motivo))
    deduccion = new D(resultado.importeAplicable)
    posterior = new D(resultado.cuotaPosterior)
  }
  const diferencial = posterior.minus(retenciones).minus(pagos)
  pasos.push({
    _tag: "PasoExplicacion",
    titulo: "Bases, cuotas y pagos anuales",
    descripcion:
      "Sin ahorro, reducciones de base ni otras deducciones. Artículo 80 sin importe al excluir rentas extranjeras. Cuota líquida legal conservada antes de DA61. Precisión decimal hasta salida; presentación final half-up a céntimos, pendiente de aceptación fiscal.",
    fuentes: [
      {
        titulo: "Alcance y evidencia de la conexión anual",
        referencia:
          "docs/procedencia/implementaciones/conexion-anual/INFORME.md",
      },
    ],
    lineasCalculo: [
      crearLineaCalculo({
        siteId: "anual.explicito.big",
        instancia: 0,
        importe: neto,
        unidad: "EUR",
        etiqueta: "Base imponible general",
        formula: "rendimiento neto reducido con signo",
      }),
      crearLineaCalculo({
        siteId: "anual.explicito.blg",
        instancia: 0,
        importe: neto,
        unidad: "EUR",
        etiqueta: "Base liquidable general",
        formula: "BIG sin reducciones de base ni compensaciones anteriores",
      }),
      crearLineaCalculo({
        siteId: "anual.explicito.cuota.estatal",
        instancia: 0,
        importe: cuotaEstatal,
        unidad: "EUR",
        etiqueta: "Cuota estatal",
        formula: "escala(base positiva) − escala(mínimo limitado a base)",
      }),
      crearLineaCalculo({
        siteId: "anual.explicito.cuota.autonomica",
        instancia: 0,
        importe: cuotaAutonomica,
        unidad: "EUR",
        etiqueta: "Cuota autonómica",
        formula:
          "escala publicada Madrid(base) − escala(mínimo limitado a base)",
      }),
      crearLineaCalculo({
        siteId: "anual.explicito.cuota.liquida-legal",
        instancia: 0,
        importe: liquida,
        unidad: "EUR",
        etiqueta: "Cuota líquida legal",
        formula: "cuota estatal + autonómica; sin otras deducciones",
      }),
      crearLineaCalculo({
        siteId: "anual.explicito.da61",
        instancia: 0,
        importe: deduccion,
        unidad: "EUR",
        etiqueta: "DA61",
        formula: "deducción de servicios después del artículo 80, una sola vez",
      }),
      crearLineaCalculo({
        siteId: "anual.explicito.cuota.posterior",
        instancia: 0,
        importe: posterior,
        unidad: "EUR",
        etiqueta: "Cuota posterior",
        formula: "cuota líquida legal − DA61",
      }),
      crearLineaCalculo({
        siteId: "anual.explicito.retenciones",
        instancia: 0,
        importe: retenciones,
        unidad: "EUR",
        etiqueta: "Retenciones efectivas",
        formula: "suma por operación única",
      }),
      crearLineaCalculo({
        siteId: "anual.explicito.pagos",
        instancia: 0,
        importe: pagos,
        unidad: "EUR",
        etiqueta: "Pagos fraccionados efectivos",
        formula: "suma por operación única",
      }),
      crearLineaCalculo({
        siteId: "anual.explicito.diferencial",
        instancia: 0,
        importe: diferencial,
        unidad: "EUR",
        etiqueta: "Cuota diferencial",
        formula: "cuota posterior − retenciones − pagos fraccionados",
      }),
    ],
  })
  return {
    _tag: "LiquidacionIrpfAnualExplicitaCalculada" as const,
    perfil: caso.perfil,
    ejercicio: 2025 as const,
    alcance:
      "individual-madrid-18-a-64-sin-familiares-ni-discapacidad" as const,
    rendimientoNetoReducido: neto.toFixed(),
    baseImponibleGeneral: neto.toFixed(),
    baseLiquidableGeneral: neto.toFixed(),
    baseLiquidableAhorro: "0",
    reduccionArt20: reduccionArt20.toFixed(),
    cuotaLiquidaLegal: liquida.toFixed(),
    deduccionTrabajo: deduccion.toFixed(),
    cuotaPosterior: posterior.toFixed(),
    retenciones: retenciones.toFixed(),
    pagosFraccionados: pagos.toFixed(),
    cuotaDiferencial: diferencial.toFixed(),
    cuotaDiferencialPresentada: diferencial.toFixed(2, Decimal.ROUND_HALF_UP),
    aceptacionFiscal: "pendiente" as const,
    rastro: { titulo: "Liquidación anual explícita 2025", pasos },
  }
})
