import Decimal from "decimal.js"

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
import type { ValorMotor } from "./resultado"
import {
  TERRITORIOS_AUTONOMICOS,
  type ColumnaEscala,
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

const numero = (decimal: Decimal): Valor =>
  decimal.isFinite()
    ? { _tag: "Numero", decimal: decimal.toFixed() }
    : { _tag: "Centinela", centinela: "sin-limite" }

const CIEN = new Decimal(100)

// Proyecta una escala del motor ([límite superior, tipo como fracción]) sobre
// las columnas del manual. El tipo se convierte a porcentaje multiplicando por
// 100, exacto en decimal.
export const proyectarEscala = (
  territorio: Territorio,
  magnitud: MagnitudEscala,
  tramos: TramosIrpf
): ReadonlyArray<ValorMotor> => {
  const valores: Array<ValorMotor> = []
  let inicio = new Decimal(0)
  let cuota = new Decimal(0)
  tramos.forEach(([limite, tipo], indice) => {
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
        valor: numero(limite.minus(inicio)),
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
    cuota = cuota.plus(limite.minus(inicio).mul(tipo))
    inicio = limite
  })
  return valores
}

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
): ReadonlyArray<ValorMotor> => {
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
  return posiciones.map(([posicion, importe]) => ({
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
}

// Escalas y mínimos de 2025 tal como los usa la liquidación: la cuota estatal
// de los territorios reales se calcula con TRAMOS_IRPF_ESTATAL_GENERAL_2025;
// el ahorro se liquida con una sola escala conjunta (estatal + autonómica)
// que no distingue territorio.
export const proyectarMotor2025 = (): ReadonlyArray<ValorMotor> => [
  ...proyectarEscala(
    "estatal",
    "escala-general-estatal",
    TRAMOS_IRPF_ESTATAL_GENERAL_2025
  ),
  ...TERRITORIOS_AUTONOMICOS.flatMap((territorio) =>
    proyectarEscala(
      territorio,
      "escala-general-autonomica",
      ESCALAS_AUTONOMICAS_IRPF_2025[territorio].tramos
    )
  ),
  ...proyectarEscala(
    "estatal",
    "escala-ahorro-agregada",
    TRAMOS_IRPF_AHORRO_2025
  ),
  ...proyectarMinimos("estatal", MINIMOS_ESTATALES_2025),
  ...TERRITORIOS_AUTONOMICOS.flatMap((territorio) =>
    proyectarMinimos(
      territorio,
      MINIMOS_AUTONOMICOS_IRPF_2025.valor[territorio]
    )
  ),
]
