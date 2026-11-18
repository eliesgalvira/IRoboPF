// Presentación síncrona: el cálculo fiscal se ejecuta exclusivamente en el CLI.
import { readFileSync, writeFileSync } from "node:fs"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import Decimal from "decimal.js"
import { renderizarAcompanamiento } from "./acompanamiento-madrid.mjs"

const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
const raiz = fileURLToPath(new URL("../", import.meta.url))
const leer = ruta => readFileSync(new URL(ruta, import.meta.url), "utf8")
const entradas = JSON.parse(leer("../docs/analisis-madrid/resultados-entradas.json"))

export function ejecutarCLI() {
  const r = spawnSync("timeout", ["-k", "30s", "2m", "bun", "scripts/analisis-madrid.ts"], {
    cwd: raiz, input: JSON.stringify(entradas), encoding: "utf8", timeout: 150_000, maxBuffer: 8 * 1024 * 1024,
  })
  if (r.error || r.status !== 0) throw Error(`CLI de análisis falló: ${r.error?.message ?? r.stderr ?? r.status}`)
  const filas = JSON.parse(r.stdout)
  if (filas.length !== entradas.length) throw Error("CLI: número de filas inesperado")
  for (const [i, f] of filas.entries()) {
    if (f.estado !== "calculado" || JSON.stringify(f.entrada) !== JSON.stringify(entradas[i]) || f.precision !== 80 ||
      f.cotizaciones.estimacion?.bases.minimosNoVinculantes !== true || f.Hcontractual.estado !== "no-disponible") {
      throw Error(`CLI: fila ${i} fuera del perfil analítico de oficina`)
    }
    // Identidad fiscal antes de dividir por IPC y antes del redondeo de presentación.
    const congelacion = new D(f.X.neto).minus(f.I.neto)
    const reformas = new D(f.Hdecimal.neto).minus(f.X.neto)
    if (!congelacion.plus(reformas).eq(new D(f.Hdecimal.neto).minus(f.I.neto))) throw Error("Identidad fiscal incumplida")
  }
  return filas
}

const numero = valor => (new D(valor).toDecimalPlaces(2).abs().isZero() ? "0.00" : new D(valor).toFixed(2)).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
export function resumen(filas) {
  const primera = filas[0], ultima = filas.at(-1)
  const cambio = new D(ultima.Hdecimal.netoEUR2018).minus(primera.Hdecimal.netoEUR2018)
  return `El salario bruto acompaña a los precios: parte de ${numero(primera.Hdecimal.bruto)} EUR anuales en ${primera.entrada.ejercicio} y llega a ${numero(ultima.Hdecimal.bruto)} EUR anuales en ${ultima.entrada.ejercicio}. Con la ley de cada año, el neto pasa de ${numero(primera.Hdecimal.neto)} a ${numero(ultima.Hdecimal.neto)} EUR del año. Sin embargo, en euros de diciembre de ${primera.entrada.ejercicio}, pasa de ${numero(primera.Hdecimal.netoEUR2018)} a ${numero(ultima.Hdecimal.netoEUR2018)} EUR anuales: el cambio de poder adquisitivo es ${numero(cambio)} EUR anuales. Aunque el bruto siga los precios, el neto real puede bajar.`
}

export function renderizar(filas) {
  let texto = `# Resultados para un asalariado en Madrid

Si el salario bruto sube al ritmo de los precios, ¿conserva el asalariado lo que puede comprar después de pagar cotizaciones e impuesto? Estos tres ejemplos muestran que el neto real puede bajar. Las cifras de cada año se calculan con el mismo motor y las entradas publicadas; no describen la vida real de una persona.

El bruto es el salario antes de descuentos. El neto anual es lo que queda tras restar la cotización estimada del trabajador a la Seguridad Social y la cuota anual del impuesto sobre la renta (IRPF). Las retenciones son anticipos: cambian lo pendiente en la declaración, pero no este neto final. No es una nómina mensual.

## Qué se compara

Comparamos tres cálculos sobre el mismo salario y las mismas cotizaciones de cada año:

- La ley de 2018 sin actualizar sus importes.
- La ley de 2018 con sus importes actualizados según los precios.
- La ley de cada año, aplicada por el motor con cálculo decimal.

Las dos primeras son referencias inventadas para comparar, no lo que ocurrió realmente. Se actualizan los importes de los tramos (partes de la renta a las que se aplica un porcentaje de impuesto) y los mínimos (cantidades que reconocen necesidades personales y familiares al calcular el impuesto), entre otros parámetros monetarios. Los porcentajes no se actualizan por inflación.

En las tablas, «Congelación de importes» compara la ley de 2018 sin actualizar con esa misma ley actualizada. «Cambios de ley» compara la ley del año con la de 2018 sin actualizar. «Saldo de ambas comparaciones» suma esas dos diferencias y compara la ley del año con la referencia actualizada. Un signo negativo reduce el neto; un signo positivo lo aumenta. Es una descomposición para estos supuestos, no una atribución causal universal.

El saldo no explica todo el cambio de poder adquisitivo desde 2018. «Cambio por cotización y redondeo en la referencia» muestra cuánto cambia el neto aun usando la referencia de 2018 actualizada: recoge el cambio de cotizaciones y el redondeo a céntimos del bruto en ese escenario de comparación, con las reglas de actualización del motor. No es una reforma fiscal. Sumado al saldo permite reconstruir el cambio real desde el neto inicial; no se fuerza ese resto para cuadrar cifras redondeadas.

## Supuestos

Las [24 entradas](resultados-entradas.json) conservan tres salarios iniciales de 16.000, 30.000 y 60.000 EUR anuales de 2018. Son ejemplos, no percentiles: nivel reducido para observar reducciones del trabajo, intermedio y alto para observar tramos y topes de cotización. Declaración individual en Madrid, sin otras rentas, familia con derecho a mínimos, discapacidad ni especialidades; edad de 33 años en 2018 y un año más por ejercicio. El CLI comprueba el perfil de oficina exclusiva, grupo 7, CNAE 62, contrato indefinido, jornada completa y remuneración uniforme. Las cotizaciones siguen siendo estimadas; estas filas no están contrastadas con Open.

El salario bruto sigue el índice general nacional de precios de diciembre, de una misma edición base 2021. No se usa inflación media anual ni una cesta personal. Las tres primeras columnas monetarias indican su unidad; las cuatro comparaciones siguientes son también importes anuales en EUR de diciembre de 2018. No deben sumarse años como pérdida personal. El redondeo visible a dos decimales puede producir diferencias de un céntimo al sumar.

`
  const etiquetas = ["Nivel reducido", "Nivel intermedio", "Nivel alto"]
  const sueldos = [...new Set(filas.map(f => f.entrada.brutoBaseEUR2018))]
  for (const [i, sueldo] of sueldos.entries()) {
    const grupo = filas.filter(f => f.entrada.brutoBaseEUR2018 === sueldo)
    const inicial = new D(grupo[0].Hdecimal.neto)
    texto += `## ${etiquetas[i]}: ${numero(sueldo)} EUR brutos anuales de 2018\n\n${resumen(grupo)}\n\n`
    texto += "| Año | Bruto anual (EUR del año) | Neto anual (EUR del año) | Neto anual (EUR de diciembre 2018) | Congelación de importes | Cambios de ley | Saldo de ambas comparaciones | Cambio por cotización y redondeo en la referencia |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n"
    for (const f of grupo) {
      const factor = new D(f.factor)
      const c = new D(f.X.neto).minus(f.I.neto).div(factor)
      const r = new D(f.Hdecimal.neto).minus(f.X.neto).div(factor)
      const s = new D(f.Hdecimal.neto).minus(f.I.neto).div(factor)
      const b = new D(f.I.neto).div(factor).minus(inicial)
      texto += `| ${f.entrada.ejercicio} | ${[f.Hdecimal.bruto, f.Hdecimal.neto, f.Hdecimal.netoEUR2018, c, r, s, b].map(numero).join(" | ")} |\n`
    }
    texto += "\n"
  }
  return texto + `## Reproducir y comprobar

Desde la raíz del proyecto, con sus dependencias disponibles, este único comando genera este documento, el [acompañamiento](ACOMPANAMIENTO.md) y la apertura del [README de análisis](README.md):

\`\`\`sh
timeout -k 30s 3m bun scripts/resultados-madrid.mjs
\`\`\`

Añadir \`--check\` comprueba los tres documentos sin escribir. La [prueba](../../tests/resultados-madrid.test.mjs) usa el CLI real y rechaza alteraciones en tablas, narración y README; también comprueba estos enlaces. La única fuente de importes es [el CLI](../../scripts/analisis-madrid.ts), mediante su JSON. El [renderizador](../../scripts/resultados-madrid.mjs) resta y convierte unidades; no reimplementa reglas fiscales.

## Apéndice técnico: fórmulas, normas y fuentes

F es el factor de precios entre diciembre del año y diciembre de 2018. NX es el neto con la ley de 2018 sin actualizar; NI, con sus importes actualizados por F; NH, con la ley del año y la política decimal (Hdecimal del CLI). Las tres ramas usan el mismo bruto y las mismas cotizaciones del año. En EUR de diciembre de 2018 por año:

- Congelación = (NX − NI) / F.
- Cambios de ley o reformas = (NH − NX) / F.
- Saldo = (NH − NI) / F = congelación + reformas.
- Cambio por cotización y redondeo en la referencia = NI / F − neto inicial de 2018.
- Cambio real total = saldo + cambio en la referencia.

En la API, Eindex = (NI − NX) / F y Eley = (NH − NI) / F. No sumar congelación a Eley: duplicaría la congelación. La identidad (NX − NI) + (NH − NX) = NH − NI se comprueba antes de dividir y redondear. Se usa Decimal80; el bruto se cuantiza a céntimos por el CLI y la presentación redondea aparte. No se usa la rama contractual ni se atribuye a reformas el resto de la referencia.

Las normas y localizadores por ejercicio están en el [catálogo](catalogo.json) y la [adenda legal](adenda-legal.json). Los [índices IPC](indices-ipc.json), el [método IPC y coste](fuentes-metodo-ipc-coste.json), el [calendario de oficina](calendario-oficina.json) y las [fuentes IPC y cotizaciones](fuentes-ipc-ss-2018-2025.json) documentan operandos y supuestos. La [referencia técnica original](README.md#referencia-técnica-original) conserva los detalles sobre escalas, reducciones, mínimos, reglas de actualización, redondeos, fuentes y reservas de contraste. No hay oráculo oficial de la referencia actualizada ni aceptación fiscal global de estos ejemplos.

## Evidencia y límites

- 2018, 2019, 2020, 2021, 2022, 2023, 2024 y 2025: contraste acotado de ocho originales, uno por año, con 95 casillas en total entre los ocho originales; no 95 por año. Véase la [referencia técnica y el replay](README.md#referencia-técnica-original).
- Las 24 filas de estas tablas son sintéticas y no están contrastadas con Open; no aumentan los contadores de evidencia.
- Cotizaciones estimadas, sin liquidación ni redondeo mensual de la Tesorería General de la Seguridad Social; no acredita convenio ni salario legal. Precios medidos con el IPC de diciembre, cuyos índices publicados también están redondeados.
- [2012–2017 y el escenario 2026](ACOMPANAMIENTO.md) se explican año por año, separados de estas tablas.
`
}

export function aperturaREADME(filas) {
  return `<!-- resultados-madrid:inicio -->\n## Qué puedes averiguar\n\n¿Cuánto queda del salario tras cotizaciones e impuesto? ¿Conserva su poder adquisitivo cuando el bruto sigue los precios?\n\n${resumen(filas.filter(f => f.entrada.brutoBaseEUR2018 === "30000"))}\n\nLee [los resultados anuales](RESULTADOS.md) para comparar la ley de cada año con dos referencias inventadas: la ley de 2018 sin actualizar sus importes y esa misma ley actualizada con los precios. No representan lo que ocurrió realmente. Las tablas separan las comparaciones fiscales del cambio por cotizaciones y redondeo en la referencia; explican supuestos, fuentes y límites. Son ejemplos educativos con cotizaciones estimadas, sin contraste Open para sus 24 filas.\n\nConsulta también el [acompañamiento 2012–2017 y escenario 2026](ACOMPANAMIENTO.md).\n\nDesde la raíz del proyecto, \`timeout -k 30s 3m bun scripts/resultados-madrid.mjs\` genera los tres documentos; añade \`--check\` para comprobarlos. La referencia técnica original se conserva a continuación.\n<!-- resultados-madrid:fin -->`
}

export function actualizarREADME(actual, filas) {
  const bloque = /<!-- resultados-madrid:inicio -->[\s\S]*?<!-- resultados-madrid:fin -->/
  if (!bloque.test(actual)) throw Error("Falta el bloque generado de README")
  return actual.replace(bloque, aperturaREADME(filas))
}

export function comprobar(actual, esperado, nombre) {
  if (actual !== esperado) throw Error(`${nombre} diverge del CLI; ejecutar bun scripts/resultados-madrid.mjs`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.slice(2).some(a => a !== "--check")) throw Error("Único argumento admitido: --check")
  const filas = ejecutarCLI()
  const readme = leer("../docs/analisis-madrid/README.md")
  const salidas = [["docs/analisis-madrid/ACOMPANAMIENTO.md", renderizarAcompanamiento(filas)], ["docs/analisis-madrid/RESULTADOS.md", renderizar(filas)], ["docs/analisis-madrid/README.md", actualizarREADME(readme, filas)]]
  for (const [ruta, contenido] of salidas) {
    if (process.argv.includes("--check")) comprobar(readFileSync(raiz + ruta, "utf8"), contenido, ruta)
    else writeFileSync(raiz + ruta, contenido)
  }
}
