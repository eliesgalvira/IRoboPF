# Familia monoparental y límite de renta en estudios

Se corrigen BC01 y BC02 de la [revisión de condiciones](../../revisiones/b-condiciones/INFORME.md), sin cambiar importes ni fórmulas financieras.

La ficha de familia monoparental incluye a los hijos mayores con curatela representativa judicial. Se identifica expresamente como criterio del Manual AEAT 2025, página física 220, sobre la aplicación de la Ley 8/2021; no se presenta como una nueva frase del artículo autonómico. Las citas exactas `rbc-manual-3/4` se incorporan al expediente por hash y coordenadas. La redacción anterior sobre patria potestad prorrogada o rehabilitada permanece para las situaciones transitorias.

En estudios se registra la discrepancia entre [Ley 3/2024, artículo 3.Uno](https://www.boe.es/eli/es-cb/l/2024/12/23/3) y el manual, página física 226. A 8.000 euros exactos, la norma excluye la deducción; el texto del manual permite ese extremo. La ficha conserva la desigualdad legal estricta. Las citas `rb-1` y `rbc-manual-5` permiten contrastar ambos textos.

Los dos casos fallaban antes del arreglo. Para reproducirlos sin corpus externo:

```sh
bun run test --config docs/procedencia/deducciones-2025/revisiones/b-condiciones/vitest.config.mjs
```

La ambigüedad asturiana de los 30 años sigue abierta. Las correcciones requieren revisión independiente; no acreditan una liquidación completa.
