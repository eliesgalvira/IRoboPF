# Candidato privado: cuotas territoriales C300 y renta propia familiar

Implementación terminada para **una revisión independiente posterior**. No se
declara aceptación fiscal ni cierre del cambio. PESADO2 liberado. Cero navegador,
capturas nuevas, worktree, subagentes, commits, push, PR o CI global. Raíz fiscal
en lectura; hashes pre/post iguales. El padre conserva PESADO1 y la publicación.

## Resultado y separación de causas

| Etapa | Casos calculados | Rechazados | Iguales | Diferentes | Ausencias |
|---|---:|---:|---:|---:|---:|
| Originales / raíz | 5 | 4 | 30 | 30 | 10 |
| Derivadas familiares / raíz | 9 | 0 | 78 | 30 | 18 |
| Derivadas y candidato | 9 | 0 | 108 | 0 | 18 |
| Regresión C301 / candidato | 301 | 0 | 3562 | 0 | 652 |

`tabla-por-casilla.csv/json` conserva cada valor por etapa y casilla. No hay
tolerancia de céntimo ni sustitución de ausencias por cero. La igualdad es
monetaria y condicionada, sin certificar hechos o derechos externos. Las dos
variantes sin captura siguen pendientes y no se cuentan como calculadas.

Los seis archivos del primer cotejo se verificaron antes y después contra
`PRIMER-COTEJO.json`; permanecen en su ubicación original, sin sobrescribir.
`primer-cotejo-preservado.json` fija sus tamaños y SHA. El primer cotejo se
ejecutó sobre `eb4670cfa0ee13c3fb4748a8625f0ec5bc9051e3`. La base observada en
la comprobación final es `3dcd12606d0c0d280f276585a04918181d7093bf`; el resultado
del candidato se atribuye a raíz más inventario y overlays explícitos, jamás a
un commit limpio. Los cuatro archivos fiscales/tooling vigilados en
`root-pre.json` y `root-post.json` son idénticos.

## Política monetaria propuesta

Se confirma la cuantización de los cuatro gravámenes a dos decimales HALF_UP
antes de restar mínimos y sumar cuotas. La hipótesis y sus operandos están en
`hipotesis-cuantizacion.json`; el ensayo real usa el núcleo común, no esa tabla
como motor alternativo. Se resuelven las etapas discrepantes de Catalunya,
Comunitat Valenciana, Galicia, Canarias y Aragón. Los resultados presentados de
Valencia y Aragón pasan a 66,64 y 122,03, respectivamente.

La nueva política se selecciona sólo para empleo laboral efectivo en 2025,
en esos cinco territorios, sin derechos familiares y con íntegro positivo.
Composición exige además sus aportes laborales; no se introduce una ruta de
fórmulas paralela. Reutiliza `gravar` y `cuantizarAnual` ya existentes. Art20,
DA61, escalas y sus datos no cambian. No se traslada la compatibilidad binaria
de Madrid. Andalucía conserva su política anterior y Madrid la suya. Familia,
pensiones, actividad, otros territorios y otros años quedan fuera de la nueva
selección. Las pruebas distinguen observaciones oficiales de negativos
sintéticos de alcance. No se modifica el histórico.

Se añade un rastro explícito sólo a la política nueva, manteniendo los siteIds.
Los 301 resultados y SHA de rastros son idénticos a su ejecución sobre raíz
sin el candidato (`c301-baseline.json` frente a `c301-candidate.json`).

El guardia anterior del test andaluz que esperaba precisión decimal en Catalunya
queda limitado a Murcia: Catalunya ya aporta evidencia propia en el nuevo test.
Ese ajuste es un hunk portable; no se duplican los cuerpos SES/PDF embebidos del
test existente. Sus hashes pre/post y transformación exacta quedan declarados.

## Corrección de entradas familiares, sin relajar el validador

`diagnostic-original.json` conserva el rechazo como objeto con `_tag`, `motivo`,
fuente y rastro. `Effect.result` evita perderlo en `[object Object]`. Los cuatro
casos declaran 0 en la renta propia de los titulares del contribuyente; el
adaptador común obtiene 20.446,72 EUR antes de art20. `validarRentasAnualesDerechos`
rechaza correctamente esa incoherencia. Su código no se modifica.

`inputs-corregidos.json` es otro archivo: cambia exclusivamente ese campo del
titular propio a 2.044.672 céntimos, sin tocar el otro progenitor ni la renta del
descendiente. El neto procede del adaptador compartido sobre los hechos del
recibo y coincide con 0025 oficial. Las derivadas calculadas confirman art20=0;
ese cero no se infiere de una ausencia SES. Para este lote el neto anterior y
posterior a reducción coinciden. No se ofrece esta derivación como regla para
casos con reducción ni otras rentas.

Cada derivada lleva identificador `-renta-propia-v1`, SHA pre/post, puntero exacto
del campo, clave de captura original y referencias SES/PDF. Las entradas y los
recibos originales permanecen intactos y rechazados; no se reetiquetan como si
hubieran pasado. Los tests siguen exigiendo el rechazo de los cuatro originales.

La reutilización está acotada a estas cuatro capturas: el AST del script
realmente usado, recuperado por hash CAS, sólo lee la renta del descendiente
para los predicados UI; no lee la renta propia del titular. La proyección de
datos consumidos por la UI tiene SHA idéntico antes/después de la corrección,
con control negativo que cambia al alterar un nacimiento consumido. Los campos
familiares SES y las reservas sobre renta exacta/UI del corte original no se
reescriben. `correcciones-familiares.json` documenta esta demostración, no una
equivalencia universal ni acreditación jurídica.

## Verificación e identidad de ejecución

- Guías consultadas: `effect-solutions list/show basics error-handling testing`
  mediante el bundle JS existente (el binario genérico no arrancaba en NixOS),
  y las implementaciones locales Effect v4 de Cause/Result.
- Rojo sobre raíz: cinco tests fiscales fallan, 29 pasan. La primera versión del
  arnés tenía además cinco casos históricos no admitidos por el contrato; se
  corrigieron para verificar el rechazo de frontera y se conserva ese log previo.
- Verde final: 151 pruebas en seis archivos, `maxWorkers=1`, incluidos anclajes
  Madrid, Andalucía, conexión anual y regresiones de alcance.
- Tipos focales de tres módulos y nuevo test: cero diagnósticos. Host TypeScript
  virtual; no se escriben fuentes ni build-info en raíz. ESLint focal sin errores.
  Oxlint/antislop final: cuatro archivos, cero diagnósticos, un hilo. El primer
  intento de lint usó el valor predeterminado de hilos; el final lo fija a uno.
- Los wrappers privados y sus intentos iniciales de resolución no son cambios
  fiscales. Se conserva la configuración final usada y no se publican aliases
  privados `@/lib`: todos los imports del test y los módulos propuestos son relativos.

El runner Bun superpone dos archivos de raíz y un helper nuevo. Sólo en ejecución
reescribe el import del helper a su archivo privado; el import publicado queda
relativo. `*-modules.json` registra ruta lógica, ruta real, SHA de archivo y SHA
efectivo tras esa resolución. Vite aplica la misma superposición y el hunk de
alcance del test existente; sus mapas registran ambas huellas. El host de tipos
declara las rutas virtuales y reales. No hay copia del repositorio ni instalación
de dependencias. La caché Vite está fuera de la entrega.

`*.inventory.json` fija inventario conservador de lib, dependencias instaladas,
tooling y candidato, con igualdad antes/después y ejecutable Bun. Esos catálogos
incluyen archivos disponibles aunque no se carguen; los mapas de módulos
identifican los efectivamente usados y los overlays. Los originales CAS sólo se
referencian por hash; no se incluyen sus cuerpos. No se promete un entorno OS
íntegro a partir de estos inventarios.

Todas las órdenes de pruebas, tipos, lint y scripts se ejecutaron con
`timeout -k 30s`; suites secuenciales en PESADO2. No se ejecutó CI global ni una
revisión independiente propia. Queda la revisión única y la integración/CI del
padre antes de considerar aceptación o cierre.
