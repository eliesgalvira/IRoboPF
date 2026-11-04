# Contraste independiente de E-REV-01

4 de noviembre de 2026. Base publicada: `e03ce06729b85f55ec76ddfe24234f7afc4fccab`.
Recepción: las 27 rutas de `recepcion-correccion-precision.json` y su parche.

**Dictamen: E-REV-01 corregido. No se identifica otro bloqueo en el alcance
acotado de precisión revisado.** La regresión original obtiene exactamente
`570.011728394956172839495617283949561728394955` estatal y
`510.010493827066049382706604938270660493827065` autonómico. No se cambian
expectativas financieras para conseguir este resultado. El dictamen permite
al integrador continuar el cierre técnico motor/API, sujeto al cierre de su CI
y a la integración y publicación que le corresponden. No acredita aceptación
fiscal ni amplía los ámbitos admitidos.

## Inspección de la corrección

Se leyeron AGENTS.md, IMPLEMENTACION.md, REVISION.md,
CORRECCION-PRECISION.md y API-MOTOR.md, el parche recibido y las piezas
de producto y pruebas afectadas. Se trabajó sin subdelegar, sin operaciones
mutantes de VCS y sin modificar archivos existentes del integrador.

- **Escalas:** el helper convierte base, límites, cuota fija y receptor de
  suma al constructor seleccionado. Los excesos se calculan desde la base
  convertida; `A.min/max` y el acumulador usan ese mismo constructor.
  Comparar límites de tablas no hace operaciones que redondeen. La rama de
  cuotas publicadas y la integración por tramos quedan cubiertas por las
  regresiones recibidas; la suma de ordinaria y complementaria también se
  contrasta en la nueva prueba histórica.
- **Ahorro:** se propaga el constructor a tarifa, desgloses, componentes,
  remanentes y minoraciones. Hasta 2014 se grava la base tras el remanente;
  desde 2015 se resta a la cuota bruta la cuota de su remanente. El nuevo
  contraste cruza 6.000 euros con remanentes estatales y autonómicos distintos:
  en 2014 el neto cae al primer tramo; en 2015 distingue la resta de cuotas
  y la asimetría estatal/autonómica. Otros dos casos comprueban que una base
  fraccionaria pequeña limita el remanente íntegro con base general negativa.
- **Derechos:** la división periódica y los acumuladores de descendientes y
  discapacidad parten de `A`; también la suma total. La composición pasa
  `A` a ambos cálculos de derechos y a la suma de mínimos. Las piezas de
  contribuyente/discapacidad que conservan operaciones globales solo suman
  cuantías tabuladas exactas en el ámbito soportado; no se identifica allí
  una pérdida de precisión. No se promete recuperar cifras perdidas por un
  productor antes de la entrada al núcleo.
- **Políticas:** el productor analítico conserva `precision: 20`; el efectivo
  pasa 80. Los helpers sin argumento conservan `Decimal` global (20 en la
  configuración actual), no fuerzan 80. No se introduce `Decimal.set` ni
  mutación global. La regresión recibida comprueba precisión global y el
  resultado por defecto antes y después de usar 80. Open sigue cuantizando
  artículo 20 en el adaptador y gravámenes/DA61 en la composición, con
  `ROUND_HALF_UP` explícito. La precisión elegida también llega a los tipos
  duplicados del escenario simulado y a los desgloses.
- **Admisión y expectativas:** se conservan los validadores y rechazos,
  incluidos derechos limitados a Madrid 2025. En las suites de conexión y
  vertical salarial el parche cambia expectativas de procedencia histórica,
  sin cambiar importes ni casillas Open. Se ejecutan las siete referencias
  Open, derechos, retenciones, frontera 2014 y rechazos de la revisión previa.

## Integridad del caso original

Se cotejó el original respaldado cuyo SHA256 es
`2ab08b404412a9ffd459522cf0e6d875ff05f6787e2247a4dfe56bc668f98d1a`.
El único bloque diferente prepara los cuatro rechazos por territorio, edad,
discapacidad y rentas: las selecciones explícitas conservan los valores del
objeto original cuando la variante no aplica y sustituyen los mismos valores
cuando aplica. Todo el archivo fuera de ese bloque es idéntico por bytes,
incluidas E-REV-01, sus dos aserciones exactas y las demás expectativas.
El diff y el cotejo quedan en `cotejo-original.log` del respaldo.

## Ejecuciones propias

Todos los comandos se envolvieron en `timeout -k 30s`; el entorno se cargó
dentro de `timeout ... bash -c` mediante el archivo de entorno compartido facilitado por el integrador.
Se respetó el turno 2 asignado: una sola suite propia a la vez, sin repetir
el CI ni las suites Python del integrador. Se declaró
`UV_CACHE_DIR="$HOME/.cache/uv"` en la selección dirigida; no hubo instalación
de dependencias ni entregas de cachés o entornos.

Comandos de validación (dentro de ese entorno):

```sh
timeout -k 30s 15m bun run test tests/composicion-anual-revision.test.ts tests/composicion-precision.test.ts tests/composicion-anual-unica.test.ts tests/anual-salarial-completo.test.ts tests/conexion-anual.test.ts tests/retirada-rutas.test.ts tests/motor-unico-revision.test.ts tests/minimos-derechos.test.ts tests/retenciones-derechos.test.ts tests/liquidacion-irpf-anual.test.ts tests/correcciones-x-solidaridad.test.ts tests/puertos-composicion-r47.test.ts tests/puertos-r52.test.ts --maxWorkers=1
timeout -k 30s 5m bun run test tests/composicion-precision-contraste.test.ts --maxWorkers=1
timeout -k 30s 5m bun run typecheck
timeout -k 30s 5m bun run lint
```

- Selección recibida: **227/227**, 13 archivos, código 0. Incluye las 26 de
  revisión y las tres regresiones del integrador.
- Nuevas pruebas independientes: **4/4**, código 0. Sus oráculos son valores
  literales derivados de operaciones decimales finitas fuera del motor con
  100 cifras, sin tolerancias ni llamadas a otro helper del producto para
  calcular el esperado. No contienen código Effect nuevo.
- Tipos: **pasan ambos proyectos**, código 0.
- Lint: **pasa**, código 0, con las 18 advertencias ya declaradas, fuera
  de las dos altas de este contraste.

El intento inicial de cotejo con `python` fuera del entorno falló porque ese
binario no estaba en PATH; se repitió correctamente cargando el entorno antes
de revisar o cambiar nada. Una búsqueda posterior usó por error una ruta de
rg mal transcrita y se repitió con la ruta facilitada. No son pruebas fiscales.

Los 94/94, 220/220 y el CI completo descritos por el integrador son evidencia
recibida, no ejecuciones propias. El cierre del log privado `ci-precision-final.log`
lo recogerá el integrador; este contraste no lo certifica ni lo repite.

## Entrega y límites

Los **27/27 hashes de recepción y el hash del parche coinciden al inicio y
al final**. El inventario comprimido recibido se verifica por hash; no se
incluye en el parche textual ni se regenera desde esta revisión.

Solo se añaden este informe y
`tests/composicion-precision-contraste.test.ts`. El respaldo privado compacto del contraste contiene
logs, `altas.patch` y `manifiesto.json`, con hashes y tamaños. El parche
contiene exclusivamente las dos altas. No incorpora CLAUDE.md, cambios
ajenos, copias del repositorio ni dependencias. La nueva suite se ha ejecutado
manualmente; el integrador decidirá su incorporación a las listas explícitas
de CI, que ya contienen las dos suites recibidas de revisión y precisión.

No quedan correcciones bloqueantes identificadas para E-REV-01. Quedan al
integrador cierre del CI, integración y publicación. Se mantienen las reservas
de REVISION.md sobre extensión familiar, A/F, TGSS mensual y revisión
simbólica/documental del núcleo. No se ha repetido la revisión general ni
realizado un nuevo contraste normativo oficial, build o corpus CAS completo.
No se atribuyen pérdidas monetarias públicas no observadas.

Nota de integración: se omiten las rutas privadas de la publicación. El
informe original y sus hashes se conservan en el respaldo. El integrador ha
recogido el CI completo correcto y añadido la nueva suite a ambas listas de CI;
[registro de cierre](CIERRE.md).
