# Censo y extracción de datos 2012–2026: primer tramo A

Canalización ejecutada sobre `67f56a147c04db2e5fb11b7ebc2e88a337b12ac1`. El bloque A permanece abierto. No se han cambiado datos, motor, resolver, interfaz ni puertas. Los resultados describen esa base histórica; no se atribuyen a cambios posteriores del motor.

[Manifiesto de ejecución](ejecucion.json), [contrato](CONTRATO.md), [mappings explícitos](tablas.json), [manuales por ejercicio](manuales.json). Los artefactos detallados se resuelven por hash desde CAS externo. [Puntos de entrada para los lotes siguientes](LOTES.md). Git contiene código e índices, no originales ni tablas extraídas voluminosas.

## Resultado

Se censan los 57 módulos de `lib/dominio/normativa/datos/`, sus exports, bindings y hojas efectivas, incluidos metadatos, texto y ausencias. El censo conserva 116.170 rutas efectivas: 11.334 candidatos fiscales, 27.635 metadatos, 62.813 textos/ausencias ambiguos y 14.388 contenedores vacíos o auxiliares. Son ocurrencias con aliases, no conceptos fiscales únicos. El grafo de bindings y las páginas del inventario están conservados por hash. Las 351 deducciones se enlazan al censo/evidencias de sus siete lotes; no se repite ni se acepta su auditoría.

El inventario común obtiene 25.099 ocurrencias sintácticas, 17.299 hojas numéricas efectivas y 11.727 valores de sondeo del selector, con solapamientos. No son parámetros fiscales únicos. El censo complementario tampoco deduplica conceptos jurídicos: conserva todas las rutas y señala ambigüedad.

| Tabla real | Celdas | Coinciden | Difieren | Sin binding cotejable | Trazo de ausencia |
| --- | ---: | ---: | ---: | ---: | ---: |
| Escala ordinaria estatal 2014, manual p. física 467 | 24 | 23 | 0 | 1 | 0 |
| Escala complementaria estatal 2014, p. 468 | 28 | 27 | 0 | 1 | 0 |
| Mínimo por discapacidad estatal 2014, p. 452 | 9 | 8 | 0 | 0 | 1 |
| Escala estatal 2025, p. 1120 | 24 | 16 | 0 | 8 | 0 |
| Importes de mínimos estatales 2025, p. 1094 | 15 | 13 | 0 | 2 | 0 |
| Serie INE IPC290751, observaciones mensuales | 177 | 0 | 0 | 177 | 0 |
| Total | 277 | 87 | 0 | 189 | 1 |

Se extraen todas las celdas monetarias/tipos de las tres escalas, las nueve del cuadro de discapacidad de 2014 y los quince importes del renglón estatal comparativo de 2025. Las longitudes abiertas de las escalas de 2014 quedan sin expresión monetaria comparable. Los exports admitidos del inventario revisado representan tipos y fronteras de 2025, pero no aportan binding para sus seis cuotas publicadas; tampoco se inventan una frontera inicial ni una longitud final. Los importes de fallecimiento del cuadro de mínimos no tienen hoja en ese export. El cuadro de discapacidad de 2014 contiene un trazo de ausencia en asistencia: no se convierte en cero. Los mínimos 2025 por discapacidad se vinculan al contribuyente; contrastar las rutas paralelas de descendientes/ascendientes queda abierto en el censo.

No hay discrepancias numéricas en este piloto, ni correcciones forzadas. La cola conserva los 190 casos restantes con ejercicio, territorio, localizador, esperado y observado; los índices INE mensuales prueban el formato sin equipararse con inflación anual. Esto no cubre condiciones, textos ni reglas completas, ni todos los mínimos históricos.

## Fuentes

El catálogo externo contiene 519 fuentes de auditorías de escalas, mínimos, retenciones, IPC, Seguridad Social y cadenas autonómicas. Se verifican los bytes de 79; 440 no están en las raíces de lectura autorizadas. Es ausencia local, no declaración de indisponibilidad remota. Se reutilizan referencias y versiones intranuales sin copiar originales. Se han adquirido los dos manuales del piloto y la serie INE con los hashes históricos esperados.

El [índice oficial AEAT](https://sede.agenciatributaria.gob.es/Sede/manuales-practicos.html), consultado en este corte, enlaza los manuales 2014–2025. El índice compacto fija sus URLs y hashes históricos; 2015–2024 necesitan restauración o descarga verificada para ejecutarse en estas raíces. No se identifica la fecha editorial impresa del manual 2025 con publicación ni vigencia: el pie dice 20/05/2026, el ejercicio es 2025.

2012 y 2013 no aparecen en ese índice actual. Se buscaron `site:sede.agenciatributaria.gob.es manual práctico renta 2012 pdf` y la misma consulta para 2013; las referencias históricas apuntan a los antiguos nombres `Manual_renta_patrimonio_2012_es_es.pdf` y `Manual_renta_patrimonio_2013_es_es.pdf`, sin original oficial recuperado aquí. Quedan búsquedas y adquisición pendientes, no una conclusión de inexistencia. La tabla histórica exigida se demuestra con el original oficial 2014.

La búsqueda `site:sede.agenciatributaria.gob.es "Manual práctico" "Renta 2026"` y el índice no localizaron ese manual. Permanece pendiente; no se copia 2025. La [licitación editorial del manual 2026](https://www.boe.es/diario_boe/txt.php?id=BOE-B-2026-33961&lang=es) tampoco equivale a su publicación. El IPC anual 2026 no se completa a partir de meses parciales. Publicación, periodo de datos, edición y vigencia tienen campos separados y null cuando no están acreditados.

## Ejecución

Con Bun, Node, Python 3.13 y uv disponibles mediante Nix, dependencias JavaScript del lock ya preparadas y variables externas:

```sh
export DATOS_CAS=/ruta/externa/sha256
export DATOS_WORK=/ruta/externa/temporales
export DATOS_OUTPUT=/ruta/externa/ejecucion.json
bash tools/procedencia/datos/ejecutar.sh \
  --read-root /ruta/externa/objetos \
  --read-root /ruta/externa/deducciones/sha256
# Reconstrucción y verificación de todos los artefactos fijados:
bash tools/procedencia/datos/ejecutar.sh --verify "$DATOS_OUTPUT" \
  --read-root /ruta/externa/objetos \
  --read-root /ruta/externa/deducciones/sha256
```

Las raíces son directorios planos con archivos SHA256. El destino del manifiesto puede estar en Git; los originales y temporales siempre fuera. El script usa versiones fijadas de PyMuPDF 1.26.7 y jsonschema 4.25.1, sin entorno Python en el repo. La primera generación exige un directorio temporal nuevo; los temporales se conservan externamente. No usa `buildArtifact(write)` ni regenera el inventario comprimido histórico.

Las pruebas pequeñas son sintéticas y están identificadas como tales. Cubren mutaciones de valor del motor, unidad, signo, ejercicio, caja, normalización, duplicados, cobertura y originales ausentes/corruptos. La reconstrucción real vuelve a extraer las 277 celdas desde sus bytes oficiales y compara todos los artefactos del censo, citas y resultados. Ruff, MyPy, comprobación JavaScript y las 16 reglas anti-slop se ejecutan sobre el código nuevo; no se han lanzado builds ni suites legacy. La revisión independiente sigue pendiente y deberá evaluar especialmente las cajas, unidades, signos, discriminantes y exhaustividad del censo.

El candidato posterior cambia los controles y la API: [correcciones RP01–RP09](CORRECCIONES-RP.md). Estos resultados históricos no son los del candidato corregido. Para ejecutar el wrapper actual se exige `DATOS_BASE` con el SHA completo declarado.
