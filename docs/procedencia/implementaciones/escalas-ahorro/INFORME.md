# Implementación de cuotas publicadas y ahorro por componente

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Base del candidato documentado: `d9ff49c7`.

## Resultado y contrato

La fila nueva contiene base inferior, cuota publicada y tipo Decimal. Se selecciona la fila aplicable y se calcula **cuota publicada + (base − base inferior) × tipo**. La cuota fija nunca se reconstruye integrando anchuras. En 2012–2014 se ejecutan separadamente la escala estatal ordinaria y la complementaria. A 17.707,21 euros producen 2.257,6616, liquidado 2.257,66; el integrador anterior daba 2.257,6696, liquidado 2.257,67.

La función existente admite opcionalmente escalas publicadas. Sin ellas conserva el algoritmo anterior y sus desgloses. La liquidación selecciona filas para Estado 2012–2014 y los supuestos territoriales acotados siguientes. Los mismos datos se aplican al mínimo general. El desglose identifica cuota fija además del exceso; el rastro muestra la suma, sin presentar el resultado como mera multiplicación del exceso.

- Andalucía 2012–2015: Ley 3/2012, art.2.Dos, PDF p4; decisión `autonomicas-2012-2016-cuotas-andalucia`.
- Comunitat Valenciana 2014–2016: Ley 7/2014, art45 y DF4.b, PDF pp58/127; decisiones `autonomicas-2012-2016-cuotas-valencia` y `CAD-C-comunitat-valenciana-2014/2015/2016`.
- Catalunya 2020–2021: Ley 5/2020, art87, p62; `cadena-b-cat-cuotas-2020`.
- Catalunya 2022–2024: Ley 2/2021, art41, pp46–47, y refundición DL1/2024 art611-1, DOGC p6; `cadena-b-cat-cuotas-2022`.
- Madrid 2022: Ley 8/2022, art.único.Dos p3 y DF p5; `CAD-C-madrid-2022`. No se vuelve a modificar el límite Madrid2020.
- Murcia 2022 ordinario, sin fecha de fallecimiento: DL4/2022, artículo único, BORM4846 pp3–4; `CAD-C-murcia-2022` y `AUT22-26-2022-murcia-general`. A 59.999,99: 8.625,831378; a 60.000 exactos: 8.625,8332; a 60.000,01: 8.716,67227. La cláusula superior es estricta. La diferencia liquidada con el integrador anterior por encima del corte es 90,83; no se suaviza la discontinuidad.

Estas decisiones aceptan discrepancias de representación de cuota bruta. No se cambian los estados históricos de las auditorías ni se promueven las demás filas cotejadas a reglas aceptadas. Se transcriben tablas suficientes para calcular los casos y sus mínimos; eso no constituye una nueva aceptación independiente de todas las filas o declaraciones.

## Ahorro y consignación autonómica

`calcularAhorroConMinimos` recibe las cuantías de ambos mínimos y devuelve, por componente, cuota bruta, remanente, cuota después del mínimo y minoración. El remanente se limita a la base del ahorro disponible. Antes de 2015 aplica F(base−remanente); desde 2015, F(base)−F(remanente). No se toma el mayor mínimo ni se divide una cuota conjunta por dos.

Los datos de ahorro son filas publicadas explícitas. En 2012–2014, la escala ordinaria común y el recargo estatal se conservan separados; en 2015, la estatal es 9,5/10,5/11,5 y la autonómica 10/11/12. Desde 2016 se representan expresamente las tablas comunes, incluidas sus reformas de 2021, 2023 y 2025. La herencia técnica 2026 conserva la hipótesis previa, sin aceptar cierre normativo ni abrir territorios reales no soportados.

Casos discriminantes: BG=0, ahorro=10.000 y mínimos=5.151 da 1.018,29 en 2012–2014. En 2025, con mínimos suministrados 5.550/5.956,65 da 886,86825, liquidado 886,87, frente a 848,24 anterior. Se prueban inversión de mínimos, agotamiento de base, absorción por base general, reparto desigual de 2015 y bases altas. Ninguna prueba de fórmula acredita el derecho ni las cuantías legales de esos mínimos.

El límite general de la consignación autonómica agregada usa cuota autonómica general después del mínimo **más cuota autonómica del ahorro después de su mínimo**. Se conserva el campo agregado existente. Con el caso Madrid2025 anterior, una consignación de 100 euros reduce a 786,87; una consignación superior a la cuota disponible solo consume 424,11825 y deja 462,75 estatales. No se valida elegibilidad, requisitos ni reglas especiales de deducciones: el evaluador externo debe seguir haciéndolo.

## Decisiones, objeciones y costes

1. **Mantener aritmética exacta hasta la frontera existente.** Objeción: redondear cada casilla o cada componente podría alterar céntimos. Motivo: las revisiones no aceptan una regla universal distinta. Coste: se mantienen Decimal y `eurosACentimos` al exportar importes de liquidación; sumar campos ya redondeados puede diferir de redondear la suma exacta. No se altera política monetaria general. Los discriminantes de cuotas y los totales históricos no dependen de decidir un empate de medio céntimo.
2. **Separar cuota publicada de integración legacy.** Objeción: sustituir globalmente el integrador rompería un contrato observable. Motivo: ADR0001–0004 y legacy-scope-gap preservan el perfil salarial simulado y el oracle. Coste: dos representaciones explícitas. Las funciones legacy sin filas conservan comportamiento; la selección estatal nueva excluye `simulada-estatal`. Se ejecuta la suite salarial rápida, sin regenerar fixture ni ejecutar la suite completa pesada. No se afirma equivalencia de todo el libro a partir de estos controles.
3. **Limitar la selección territorial.** Objeción: una tabla reextraída puede tener vigencia pendiente. Motivo: solo las proposiciones individuales suficientemente revisadas permiten corregir esta representación. Coste: territorios no seleccionados conservan integración previa, con limitación expresa en el rastro. Murcia con fallecimiento se mantiene fuera de esta selección; no se infiere retroactividad desde publicación. No se tocan los selectores condicionales de Galicia, Canarias o mínimos catalanes.
4. **Asturias no se promociona.** La revisión A reproduce 1.875,8614 frente a 1.875,8654 a base17.707,21 en2015, pero `CAA-CAD-014` sigue `needs-evidence` y las únicas aceptaciones de esa revisión son ancho2013–2014 y ausencia2026. Objeción: implementar ese dato como aceptado contradiría la decisión individual. Motivo: respetar el cierre externo requerido. Coste: cuota asturiana pendiente; no se convierte el ejemplo accionable en aceptación fiscal. El integrador puede ampliar esta selección cuando cierre esa proposición.
5. **Separar prueba, evidencia e interpretación.** Objeción: un test verde puede repetir una transcripción incorrecta. Motivo: se releyeron originales PDF locales por hash y páginas precisas, con Poppler, además de auditorías y contrarrevisiones. Coste: las nuevas filas aún requieren revisión independiente de implementación y binding al nuevo inventario. No se validaron firmas, CSV, facsímiles ni autenticidad archivística. El corpus de integridad y su puerta `--accepted` permanecen intactos.

## Evidencia y reproducción

`fuentes.json` identifica los 15 originales reabiertos, SHA-256, páginas físicas 1-based, huella de la extracción y proposiciones. Los originales siguen en el CAS del integrador. No se publican rutas privadas ni cabeceras. Las citas geométricas y decisiones externas siguen en `revisiones/escalas-estatales-ahorro`, `revisiones/autonomicas-2012-2016`, `revisiones/autonomicas-2017-2021`, `revisiones/autonomicas-2022-2026` y `revisiones/cadena-autonomica-{a,b,c}`. Los informes previos se conservan sin reescritura.

`rojo-escalas.log`: 15 fallos ejecutados antes de añadir soporte de filas al integrador. `rojo-ahorro.log`: cinco fallos ejecutados antes de corregir la liquidación y el límite agregado. Los demás ensayos amplían controles; no se presentan retrospectivamente como pruebas rojas. `typecheck.log` conserva el primer diagnóstico de booleano opcional, corregido con comparación explícita, sin desactivar reglas.

Validación final: consultar `validacion-final.log`, `oxlint-final.log` y `eslint-final.log`. Comandos con Nix, node_modules compartido solo lectura, sin instalación ni cambios globales:

```sh
nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock bun run typecheck
nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock bun run test tests/escalas-publicadas.test.ts tests/ahorro-regimen-historico.test.ts tests/comunidades-autonomas.test.ts tests/liquidacion-irpf-anual.test.ts tests/calculo-salario-legacy.test.ts --maxWorkers=1
```

El manifiesto y el diff de entrega comparan bytes contra `d9ff49c7`, incluidos archivos nuevos. La comprobación de presencia de todos los archivos del árbol base permite detectar borrados fuera del diff de rutas asignadas. No se usa el índice como prueba del contenido ni se repara.
