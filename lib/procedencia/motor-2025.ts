import Decimal from "decimal.js"
import { Result } from "effect"

import {
  ESCALAS_AUTONOMICAS_IRPF_2025,
  TRAMOS_IRPF_ESTATAL_GENERAL_2025,
} from "../dominio/normativa/datos/irpf-autonomico-2025"
import {
  TRAMOS_IRPF_AHORRO_2025,
  type TramosIrpf,
} from "../dominio/normativa/datos/irpf-estatal-2012-2026"
import {
  MINIMOS_AUTONOMICOS_IRPF_2025,
  MINIMOS_ESTATALES_2025,
  type MinimoDiscapacidadIrpf,
  type MinimosPersonalesFamiliaresIrpf,
} from "../dominio/normativa/datos/minimos-autonomicos-2025"
import { DatoDelMotorInvalido } from "./excepciones"
import type { ValorMotor } from "./resultado"
import {
  TERRITORIOS_AUTONOMICOS,
  type ColumnaEscala,
  type Magnitud,
  type MagnitudEscala,
  type PosicionMinimo,
  type Territorio,
  type Valor,
} from "./vocabulario"

export const EXCLUIDOS_DEL_MOTOR = [
  {
    identificador: "simulada-estatal",
    motivo:
      "caso técnico del motor, no es un territorio fiscal: su cuota autonómica se iguala a la estatal y la liquidación usa la escala conjunta TRAMOS_IRPF_DESDE_2021",
  },
] as const

// Sólo para decimales ya validados como finitos.
const numero = (decimal: Decimal): Valor => ({
  _tag: "Numero",
  decimal: decimal.toFixed(),
})

const CIEN = new Decimal(100)

const invalido = (territorio: Territorio, magnitud: Magnitud, motivo: string) =>
  Result.fail(new DatoDelMotorInvalido({ territorio, magnitud, motivo }))

// El tramo abierto es explícito: los cerrados tienen límite finito y el
// último, y sólo él, no lo tiene.
interface EscalaValidada {
  readonly cerrados: ReadonlyArray<{
    readonly limite: Decimal
    readonly tipo: Decimal
  }>
  readonly abierto: { readonly tipo: Decimal }
}

// Una escala del motor es [límite superior, tipo como fracción] por tramo. Se
// valida antes de proyectarla: tipos finitos, límites finitos y estrictamente
// crecientes desde 0 y el último, +Infinity. Un fallo es un error, no un
// centinela.
const validarEscala = (
  territorio: Territorio,
  magnitud: MagnitudEscala,
  tramos: TramosIrpf
): Result.Result<EscalaValidada, DatoDelMotorInvalido> => {
  const ultimo = tramos.at(-1)
  if (ultimo === undefined) {
    return invalido(territorio, magnitud, "la escala no tiene tramos")
  }
  const tipoNoFinito = tramos.findIndex(([, tipo]) => !tipo.isFinite())
  if (tipoNoFinito !== -1) {
    return invalido(
      territorio,
      magnitud,
      `el tipo del tramo ${tipoNoFinito} no es finito`
    )
  }
  const cerrados = tramos.slice(0, -1)
  let inicio = new Decimal(0)
  for (const [indice, [limite]] of cerrados.entries()) {
    if (!limite.isFinite()) {
      return invalido(
        territorio,
        magnitud,
        `el límite del tramo ${indice} no es finito y sólo el último tramo es abierto`
      )
    }
    if (!limite.gt(inicio)) {
      return invalido(
        territorio,
        magnitud,
        `el límite del tramo ${indice} (${limite.toFixed()}) no supera su inicio (${inicio.toFixed()})`
      )
    }
    inicio = limite
  }
  if (!ultimo[0].eq(Infinity)) {
    return invalido(
      territorio,
      magnitud,
      `el último tramo ha de ser abierto (+Infinity), no ${ultimo[0].toString()}`
    )
  }
  return Result.succeed({
    cerrados: cerrados.map(([limite, tipo]) => ({ limite, tipo })),
    abierto: { tipo: ultimo[1] },
  })
}

// Proyecta la escala validada sobre las columnas del manual. El tipo se
// convierte a porcentaje multiplicando por 100, exacto en decimal.
export const proyectarEscala = (
  territorio: Territorio,
  magnitud: MagnitudEscala,
  tramos: TramosIrpf
): Result.Result<ReadonlyArray<ValorMotor>, DatoDelMotorInvalido> =>
  Result.map(validarEscala(territorio, magnitud, tramos), (escala) => {
    const valores: Array<ValorMotor> = []
    let inicio = new Decimal(0)
    let cuota = new Decimal(0)
    const tramo = (indice: number, tipo: Decimal, resto: Valor) => {
      const clave = (columna: ColumnaEscala) => ({
        territorio,
        magnitud,
        fila: indice,
        columna,
      })
      valores.push(
        {
          clave: clave("base-liquidable"),
          unidad: "EUR",
          valor: numero(inicio),
          ...(indice === 0
            ? { origen: "derivado", regla: "la escala empieza en 0" }
            : {
                origen: "almacenado",
                regla: "límite superior del tramo anterior",
              }),
        },
        {
          clave: clave("cuota-integra"),
          unidad: "EUR",
          valor: numero(cuota),
          origen: "derivado",
          regla:
            "suma exacta de (límite superior − inicio) × tipo de los tramos anteriores",
        },
        {
          clave: clave("resto-base-liquidable"),
          unidad: "EUR",
          valor: resto,
          origen: "derivado",
          regla:
            "límite superior − inicio del tramo; un límite infinito da el centinela sin-limite",
        },
        {
          clave: clave("tipo-aplicable"),
          unidad: "porcentaje",
          valor: numero(tipo.mul(CIEN)),
          origen: "almacenado",
          regla: "tipo almacenado como fracción × 100",
        }
      )
    }
    escala.cerrados.forEach(({ limite, tipo }, indice) => {
      tramo(indice, tipo, numero(limite.minus(inicio)))
      cuota = cuota.plus(limite.minus(inicio).mul(tipo))
      inicio = limite
    })
    tramo(escala.cerrados.length, escala.abierto.tipo, {
      _tag: "Centinela",
      centinela: "sin-limite",
    })
    return valores
  })

const discapacidad = (
  fila: `discapacidad-${"contribuyente" | "descendientes" | "ascendientes"}`,
  minimo: MinimoDiscapacidadIrpf
): ReadonlyArray<readonly [PosicionMinimo, Decimal]> => [
  [{ fila, columna: "grado33Hasta65" }, minimo.grado33Hasta65],
  [{ fila, columna: "grado65OMas" }, minimo.grado65OMas],
  [{ fila, columna: "gastosAsistencia" }, minimo.gastosAsistencia],
]

const proyectarMinimos = (
  territorio: Territorio,
  minimos: MinimosPersonalesFamiliaresIrpf
): Result.Result<ReadonlyArray<ValorMotor>, DatoDelMotorInvalido> => {
  const posiciones: ReadonlyArray<readonly [PosicionMinimo, Decimal]> = [
    [
      { fila: "contribuyente", columna: "general" },
      minimos.contribuyente.general,
    ],
    [
      { fila: "contribuyente", columna: "adicionalMayor65" },
      minimos.contribuyente.adicionalMayor65,
    ],
    [
      { fila: "contribuyente", columna: "adicionalMayor75" },
      minimos.contribuyente.adicionalMayor75,
    ],
    [
      { fila: "descendientes", columna: "primero" },
      minimos.descendientes.primero,
    ],
    [
      { fila: "descendientes", columna: "segundo" },
      minimos.descendientes.segundo,
    ],
    [
      { fila: "descendientes", columna: "tercero" },
      minimos.descendientes.tercero,
    ],
    [
      { fila: "descendientes", columna: "cuartoYSiguientes" },
      minimos.descendientes.cuartoYSiguientes,
    ],
    [
      { fila: "descendientes", columna: "adicionalMenorTres" },
      minimos.descendientes.adicionalMenorTres,
    ],
    [
      { fila: "ascendientes", columna: "mayor65OConDiscapacidad" },
      minimos.ascendientes.mayor65OConDiscapacidad,
    ],
    [
      { fila: "ascendientes", columna: "adicionalMayor75" },
      minimos.ascendientes.adicionalMayor75,
    ],
    ...discapacidad(
      "discapacidad-contribuyente",
      minimos.discapacidad.contribuyente
    ),
    ...discapacidad(
      "discapacidad-descendientes",
      minimos.discapacidad.descendiente
    ),
    ...discapacidad(
      "discapacidad-ascendientes",
      minimos.discapacidad.ascendiente
    ),
  ]
  const noFinito = posiciones.find(([, importe]) => !importe.isFinite())
  if (noFinito !== undefined) {
    return invalido(
      territorio,
      "minimos-personales-familiares",
      `el importe de ${noFinito[0].fila}/${noFinito[0].columna} no es finito`
    )
  }
  return Result.succeed(
    posiciones.map(([posicion, importe]) => ({
      clave: {
        territorio,
        magnitud: "minimos-personales-familiares",
        ...posicion,
      },
      unidad: "EUR",
      valor: numero(importe),
      origen: "almacenado",
      regla: "importe almacenado",
    }))
  )
}

// Escalas y mínimos de 2025 tal como los usa la liquidación: la cuota estatal
// de los territorios reales se calcula con TRAMOS_IRPF_ESTATAL_GENERAL_2025;
// el ahorro se liquida con una sola escala conjunta (estatal + autonómica)
// que no distingue territorio.
export const proyectarMotor2025 = (): Result.Result<
  ReadonlyArray<ValorMotor>,
  DatoDelMotorInvalido
> =>
  Result.map(
    Result.all([
      proyectarEscala(
        "estatal",
        "escala-general-estatal",
        TRAMOS_IRPF_ESTATAL_GENERAL_2025
      ),
      ...TERRITORIOS_AUTONOMICOS.map((territorio) =>
        proyectarEscala(
          territorio,
          "escala-general-autonomica",
          ESCALAS_AUTONOMICAS_IRPF_2025[territorio].tramos
        )
      ),
      proyectarEscala(
        "estatal",
        "escala-ahorro-agregada",
        TRAMOS_IRPF_AHORRO_2025
      ),
      proyectarMinimos("estatal", MINIMOS_ESTATALES_2025),
      ...TERRITORIOS_AUTONOMICOS.map((territorio) =>
        proyectarMinimos(
          territorio,
          MINIMOS_AUTONOMICOS_IRPF_2025.valor[territorio]
        )
      ),
    ]),
    (grupos) => grupos.flat()
  )
