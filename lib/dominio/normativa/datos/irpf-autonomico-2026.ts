import { crearImporteMonetario as importe } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import type { EscalaPublicada } from "../../irpf/cuotas/escalas-publicadas"
import type { EscalaAutonomicaIrpf2025 } from "./irpf-autonomico-2025"
import type { TramosIrpf } from "./irpf-estatal-2012-2026"

/** LIRPF art.63, redacción vigente al 4-11-2026. Tipos en fracción, euros. */
export const TRAMOS_IRPF_ESTATAL_GENERAL_2026: TramosIrpf = [
  [importe("12450"), importe("0.095")],
  [importe("20200"), importe("0.12")],
  [importe("35200"), importe("0.15")],
  [importe("60000"), importe("0.185")],
  [importe("300000"), importe("0.225")],
  [importe(Infinity), importe("0.245")],
]
const filas = (
  datos: ReadonlyArray<readonly [string, string, string]>
): EscalaPublicada =>
  datos.map(([base, cuota, tipo]) => ({
    baseInferior: importe(base),
    cuota: importe(cuota),
    tipo: importe(tipo),
  }))
/** Cuotas fijas oficiales: consumir por tabla + exceso, no integrar tipos.
 * Corte 4-11-2026; evidencia literal y reformas en referencias de B2026.
 */
export const ESCALAS_PUBLICADAS_AUTONOMICAS_2026 = {
  andalucia: filas([
    ["0.00", "0.00", "0.095"],
    ["13000.00", "1235.00", "0.12"],
    ["21100.00", "2207.00", "0.15"],
    ["35200.00", "4322.00", "0.185"],
    ["60000.00", "8910.00", "0.225"],
  ]),
  aragon: filas([
    ["0.00", "0.00", "0.095"],
    ["13072.50", "1241.89", "0.12"],
    ["21210.00", "2218.39", "0.15"],
    ["36960.00", "4580.89", "0.185"],
    ["52500.00", "7455.79", "0.205"],
    ["60000.00", "8993.29", "0.23"],
    ["80000.00", "13593.29", "0.24"],
    ["90000.00", "15993.29", "0.25"],
    ["130000.00", "25993.29", "0.255"],
  ]),
  asturias: filas([
    ["0", "0.00", "0.09"],
    ["12450.00", "1120.50", "0.12"],
    ["17707.20", "1751.36", "0.14"],
    ["33007.20", "3893.36", "0.192"],
    ["53407.20", "7810.16", "0.215"],
    ["70000.00", "11377.62", "0.225"],
    ["90000.00", "15877.62", "0.25"],
    ["175000.00", "37127.62", "0.26"],
  ]),
  "illes-balears": filas([
    ["0", "0", "0.09"],
    ["10000", "900", "0.1125"],
    ["18000", "1800", "0.1425"],
    ["30000", "3510", "0.175"],
    ["48000", "6660", "0.19"],
    ["70000", "10840", "0.2175"],
    ["90000", "15190", "0.2275"],
    ["120000", "22015", "0.2375"],
    ["175000", "35077.50", "0.2475"],
  ]),
  canarias: filas([
    ["0", "0", "0.09"],
    ["13748.00", "1237.32", "0.115"],
    ["19422.00", "1889.83", "0.14"],
    ["35924.00", "4200.11", "0.185"],
    ["57566.00", "8203.88", "0.235"],
    ["93268.00", "16593.85", "0.25"],
    ["123745.00", "24213.1", "0.26"],
  ]),
  cantabria: filas([
    ["0", "0", "0.085"],
    ["13000.00", "1105.00", "0.11"],
    ["21000.00", "1985.00", "0.145"],
    ["35200.00", "4044.00", "0.18"],
    ["60000.00", "8508.00", "0.225"],
    ["90000.00", "15258.00", "0.245"],
  ]),
  "castilla-la-mancha": filas([
    ["0", "0", "0.095"],
    ["12450.00", "1182.75", "0.12"],
    ["20200.00", "2112.75", "0.15"],
    ["35200.00", "4362.75", "0.185"],
    ["60000.00", "8950.75", "0.225"],
  ]),
  "castilla-y-leon": filas([
    ["0.00", "0.00", "0.09"],
    ["12450.00", "1120.5", "0.12"],
    ["20200.00", "2050.5", "0.14"],
    ["35200.00", "4150.5", "0.185"],
    ["53407.20", "7518.83", "0.215"],
  ]),
  catalunya: filas([
    ["0.00", "0.00", "0.095"],
    ["12500.00", "1187.50", "0.125"],
    ["22000.00", "2375.00", "0.16"],
    ["33000.00", "4135.00", "0.19"],
    ["53000.00", "7935.00", "0.215"],
    ["90000.00", "15890.00", "0.235"],
    ["120000.00", "22940.00", "0.245"],
    ["175000.00", "36415.00", "0.255"],
  ]),
  extremadura: filas([
    ["0.00", "0.00", "0.0775"],
    ["12450.00", "964.88", "0.0975"],
    ["20200.00", "1720.50", "0.16"],
    ["24200.00", "2360.50", "0.175"],
    ["35200.00", "4285.50", "0.21"],
    ["60000.00", "9493.50", "0.235"],
    ["80200.00", "14240.50", "0.24"],
    ["99200.00", "18800.50", "0.245"],
    ["120200.00", "23945.50", "0.25"],
  ]),
  galicia: filas([
    ["0.00", "0.00", "0.09"],
    ["12985.35", "1168.68", "0.1165"],
    ["21068.60", "2110.38", "0.149"],
    ["35200.00", "4215.96", "0.184"],
    ["60000.00", "8779.16", "0.225"],
  ]),
  madrid: filas([
    ["0", "0", "0.085"],
    ["13362.22", "1135.79", "0.107"],
    ["19004.63", "1739.53", "0.128"],
    ["35425.68", "3841.42", "0.174"],
    ["57320.40", "7651.10", "0.205"],
  ]),
  murcia: filas([
    ["0", "0", "0.095"],
    ["12450.00", "1182.75", "0.112"],
    ["20200.00", "2050.75", "0.133"],
    ["34000.00", "3886.15", "0.179"],
    ["60000.00", "8540.15", "0.225"],
  ]),
  "la-rioja": filas([
    ["0.00", "0.00", "0.08"],
    ["12450.00", "996.00", "0.106"],
    ["20200.00", "1817.50", "0.136"],
    ["35200.00", "3857.50", "0.178"],
    ["40000.00", "4711.90", "0.183"],
    ["50000.00", "6541.90", "0.19"],
    ["60000.00", "8441.90", "0.245"],
    ["120000.00", "23141.90", "0.27"],
  ]),
  "comunitat-valenciana": filas([
    ["0", "0", "0.088"],
    ["12000", "1056", "0.117"],
    ["22000", "2226", "0.146"],
    ["32000", "3686", "0.17"],
    ["42000", "5386", "0.194"],
    ["52000", "7326", "0.219"],
    ["62000", "9516", "0.244"],
    ["72000", "11956", "0.261"],
    ["100000", "19264", "0.2735"],
    ["150000", "32939", "0.2835"],
    ["200000", "47114", "0.2935"],
  ]),
  ceuta: filas([
    ["0", "0", "0.095"],
    ["12450.00", "1182.75", "0.12"],
    ["20200.00", "2112.75", "0.15"],
    ["35200.00", "4362.75", "0.185"],
    ["60000.00", "8950.75", "0.225"],
  ]),
  melilla: filas([
    ["0", "0", "0.095"],
    ["12450.00", "1182.75", "0.12"],
    ["20200.00", "2112.75", "0.15"],
    ["35200.00", "4362.75", "0.185"],
    ["60000.00", "8950.75", "0.225"],
  ]),
} as const

export const ESCALAS_AUTONOMICAS_IRPF_2026: Readonly<
  Record<ComunidadAutonoma, EscalaAutonomicaIrpf2025>
> = {
  "simulada-estatal": {
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal (escenario técnico)",
    tramos: TRAMOS_IRPF_ESTATAL_GENERAL_2026,
    fuente: {
      titulo: "LIRPF art.63; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104#a63",
    },
  },
  // SHA256 38bee1f4a2726db599b5955c89e0f86f994e537c42f258ef979f403bbe80405e
  andalucia: {
    comunidadAutonoma: "andalucia",
    nombre: "andalucia",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 23; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOE-A-2021-17915&p=20261104&tn=1#a2-5",
    },
    tramos: [
      [importe("13000.00"), importe("0.095")],
      [importe("21100.00"), importe("0.12")],
      [importe("35200.00"), importe("0.15")],
      [importe("60000.00"), importe("0.185")],
      [importe(Infinity), importe("0.225")],
    ],
  },
  // SHA256 fa282a231a7a0d9ad67237af2086b67b59bd8e27cc05ff9eeda8519954ccd307
  aragon: {
    comunidadAutonoma: "aragon",
    nombre: "aragon",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 110-1; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOA-d-2005-90006&p=20261104&tn=1#a1",
    },
    tramos: [
      [importe("13072.50"), importe("0.095")],
      [importe("21210.00"), importe("0.12")],
      [importe("36960.00"), importe("0.15")],
      [importe("52500.00"), importe("0.185")],
      [importe("60000.00"), importe("0.205")],
      [importe("80000.00"), importe("0.23")],
      [importe("90000.00"), importe("0.24")],
      [importe("130000.00"), importe("0.25")],
      [importe(Infinity), importe("0.255")],
    ],
  },
  // SHA256 2465b13736a4bb690dd8e43aa9097d57e70898cc90f5864cb0e126313704a427
  asturias: {
    comunidadAutonoma: "asturias",
    nombre: "asturias",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 2; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOE-A-2015-945&p=20261104&tn=1#a2",
    },
    tramos: [
      [importe("12450.00"), importe("0.09")],
      [importe("17707.20"), importe("0.12")],
      [importe("33007.20"), importe("0.14")],
      [importe("53407.20"), importe("0.192")],
      [importe("70000.00"), importe("0.215")],
      [importe("90000.00"), importe("0.225")],
      [importe("175000.00"), importe("0.25")],
      [importe(Infinity), importe("0.26")],
    ],
  },
  // SHA256 570c97f0645b68d4bf3b1bdedfc03fbc8e19b8eb106caa87c47cda41dce193fe
  "illes-balears": {
    comunidadAutonoma: "illes-balears",
    nombre: "illes-balears",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 1; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOE-A-2014-6925&p=20261104&tn=1#a1",
    },
    tramos: [
      [importe("10000"), importe("0.09")],
      [importe("18000"), importe("0.1125")],
      [importe("30000"), importe("0.1425")],
      [importe("48000"), importe("0.175")],
      [importe("70000"), importe("0.19")],
      [importe("90000"), importe("0.2175")],
      [importe("120000"), importe("0.2275")],
      [importe("175000"), importe("0.2375")],
      [importe(Infinity), importe("0.2475")],
    ],
  },
  // SHA256 43493754a4ce65d4b621290afd967e346f75ecfd9619cff962ecc3824e01a488
  canarias: {
    comunidadAutonoma: "canarias",
    nombre: "canarias",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 18 bis; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOC-j-2009-90008&p=20261104&tn=1#a18bis",
    },
    tramos: [
      [importe("13748.00"), importe("0.09")],
      [importe("19422.00"), importe("0.115")],
      [importe("35924.00"), importe("0.14")],
      [importe("57566.00"), importe("0.185")],
      [importe("93268.00"), importe("0.235")],
      [importe("123745.00"), importe("0.25")],
      [importe(Infinity), importe("0.26")],
    ],
  },
  // SHA256 c0371131618572887560e8aa31b7a52a7a782bc297456c37697100ac9aa4153b
  cantabria: {
    comunidadAutonoma: "cantabria",
    nombre: "cantabria",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 1; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOCT-c-2008-90028&p=20261104&tn=1#a1",
    },
    tramos: [
      [importe("13000.00"), importe("0.085")],
      [importe("21000.00"), importe("0.11")],
      [importe("35200.00"), importe("0.145")],
      [importe("60000.00"), importe("0.18")],
      [importe("90000.00"), importe("0.225")],
      [importe(Infinity), importe("0.245")],
    ],
  },
  // SHA256 bd3e2b89befad6a190d80ed4ab33f74820a8aa1be336711537c87393eb1aaebd
  "castilla-la-mancha": {
    comunidadAutonoma: "castilla-la-mancha",
    nombre: "castilla-la-mancha",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 13 bis; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOE-A-2014-1368&p=20261104&tn=1#a13bis",
    },
    tramos: [
      [importe("12450.00"), importe("0.095")],
      [importe("20200.00"), importe("0.12")],
      [importe("35200.00"), importe("0.15")],
      [importe("60000.00"), importe("0.185")],
      [importe(Infinity), importe("0.225")],
    ],
  },
  // SHA256 cb5a0ab67029f42bbc95bed62947ed46ce5149b31517aaa1f55153cf9cbaf2aa
  "castilla-y-leon": {
    comunidadAutonoma: "castilla-y-leon",
    nombre: "castilla-y-leon",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 1; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOCL-h-2013-90254&p=20261104&tn=1#a1",
    },
    tramos: [
      [importe("12450.00"), importe("0.09")],
      [importe("20200.00"), importe("0.12")],
      [importe("35200.00"), importe("0.14")],
      [importe("53407.20"), importe("0.185")],
      [importe(Infinity), importe("0.215")],
    ],
  },
  // SHA256 02533fa01eef47e0e6d66a79b97655919a99f6f6704a0fdd12f47b23c1023d42
  catalunya: {
    comunidadAutonoma: "catalunya",
    nombre: "catalunya",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 611-1; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOE-A-2024-6951&p=20261104&tn=1#a6",
    },
    tramos: [
      [importe("12500.00"), importe("0.095")],
      [importe("22000.00"), importe("0.125")],
      [importe("33000.00"), importe("0.16")],
      [importe("53000.00"), importe("0.19")],
      [importe("90000.00"), importe("0.215")],
      [importe("120000.00"), importe("0.235")],
      [importe("175000.00"), importe("0.245")],
      [importe(Infinity), importe("0.255")],
    ],
  },
  // SHA256 85e27a881435c0bdc0ba76a8d271601480655b8db0f9fdbe5193090a363ff070
  extremadura: {
    comunidadAutonoma: "extremadura",
    nombre: "extremadura",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 1; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOE-A-2018-8159&p=20261104&tn=1#a1",
    },
    tramos: [
      [importe("12450.00"), importe("0.0775")],
      [importe("20200.00"), importe("0.0975")],
      [importe("24200.00"), importe("0.16")],
      [importe("35200.00"), importe("0.175")],
      [importe("60000.00"), importe("0.21")],
      [importe("80200.00"), importe("0.235")],
      [importe("99200.00"), importe("0.24")],
      [importe("120200.00"), importe("0.245")],
      [importe(Infinity), importe("0.25")],
    ],
  },
  // SHA256 a0e7a4375c604e7f4e8bbf8b98b276036dfac4e6f634f41de6d3a24760efcaef
  galicia: {
    comunidadAutonoma: "galicia",
    nombre: "galicia",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 4; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOE-A-2011-18161&p=20261104&tn=1#a4",
    },
    tramos: [
      [importe("12985.35"), importe("0.09")],
      [importe("21068.60"), importe("0.1165")],
      [importe("35200.00"), importe("0.149")],
      [importe("60000.00"), importe("0.184")],
      [importe(Infinity), importe("0.225")],
    ],
  },
  // SHA256 f48006f3ddb2bdb1974ef9bea3f81924dace933a3b884ee64288c6db370065eb
  madrid: {
    comunidadAutonoma: "madrid",
    nombre: "madrid",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 1; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOCM-m-2010-90068&p=20261104&tn=1#a1",
    },
    tramos: [
      [importe("13362.22"), importe("0.085")],
      [importe("19004.63"), importe("0.107")],
      [importe("35425.68"), importe("0.128")],
      [importe("57320.40"), importe("0.174")],
      [importe(Infinity), importe("0.205")],
    ],
  },
  // SHA256 6b8f53bff12350f89ab343bbbb9c847c32b4b5169bac6f80cd733821f37a9659
  murcia: {
    comunidadAutonoma: "murcia",
    nombre: "murcia",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 2; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOE-A-2011-10542&p=20261104&tn=1#a2",
    },
    tramos: [
      [importe("12450.00"), importe("0.095")],
      [importe("20200.00"), importe("0.112")],
      [importe("34000.00"), importe("0.133")],
      [importe("60000.00"), importe("0.179")],
      [importe(Infinity), importe("0.225")],
    ],
  },
  // SHA256 83a2dc38d6ed8f64647496d06ad6f62d2c8c5915cffcc015a79880148647a432
  "la-rioja": {
    comunidadAutonoma: "la-rioja",
    nombre: "la-rioja",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 31; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOE-A-2017-13750&p=20261104&tn=1#a3-3",
    },
    tramos: [
      [importe("12450.00"), importe("0.08")],
      [importe("20200.00"), importe("0.106")],
      [importe("35200.00"), importe("0.136")],
      [importe("40000.00"), importe("0.178")],
      [importe("50000.00"), importe("0.183")],
      [importe("60000.00"), importe("0.19")],
      [importe("120000.00"), importe("0.245")],
      [importe(Infinity), importe("0.27")],
    ],
  },
  // SHA256 57a82f942da47dffda23c09062248d325fd289033579a5fe2ed6ee4ce0dfd976
  "comunitat-valenciana": {
    comunidadAutonoma: "comunitat-valenciana",
    nombre: "comunitat-valenciana",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 2; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOE-A-1998-8202&p=20261104&tn=1#a2",
    },
    tramos: [
      [importe("12000"), importe("0.088")],
      [importe("22000"), importe("0.117")],
      [importe("32000"), importe("0.146")],
      [importe("42000"), importe("0.17")],
      [importe("52000"), importe("0.194")],
      [importe("62000"), importe("0.219")],
      [importe("72000"), importe("0.244")],
      [importe("100000"), importe("0.261")],
      [importe("150000"), importe("0.2735")],
      [importe("200000"), importe("0.2835")],
      [importe(Infinity), importe("0.2935")],
    ],
  },
  // SHA256 00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674
  ceuta: {
    comunidadAutonoma: "ceuta",
    nombre: "ceuta",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 74; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#datrigesimasegunda",
    },
    tramos: [
      [importe("12450.00"), importe("0.095")],
      [importe("20200.00"), importe("0.12")],
      [importe("35200.00"), importe("0.15")],
      [importe("60000.00"), importe("0.185")],
      [importe(Infinity), importe("0.225")],
    ],
  },
  // SHA256 00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674
  melilla: {
    comunidadAutonoma: "melilla",
    nombre: "melilla",
    fuente: {
      titulo: "Normativa IRPF 2026 art. 74; corte 4-11-2026",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#datrigesimasegunda",
    },
    tramos: [
      [importe("12450.00"), importe("0.095")],
      [importe("20200.00"), importe("0.12")],
      [importe("35200.00"), importe("0.15")],
      [importe("60000.00"), importe("0.185")],
      [importe(Infinity), importe("0.225")],
    ],
  },
}
export const obtenerEscalaAutonomicaIrpf2026 = (
  comunidad: ComunidadAutonoma
): EscalaAutonomicaIrpf2025 => ESCALAS_AUTONOMICAS_IRPF_2026[comunidad]
