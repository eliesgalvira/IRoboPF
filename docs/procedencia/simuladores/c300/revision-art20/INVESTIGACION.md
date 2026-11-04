# Investigación monetaria C300 / artículo 20 — 2026-11-04

La causa demostrada en el candidato es la cuantización decimal half-up de cuatro resultados exactos terminados en medio céntimo. El cálculo binario64 de la misma expresión, incluyendo la resta bruto−gastos a–e, cae por debajo de esos empates y reproduce Open. **No es una regla matemática nueva de redondeo del producto ni half-even.** La hipótesis binaria reproduce los 218 importes 0023 del corte, y el parche privado corrige mediante la API real todas las diferencias monetarias presentes, conservando las 214 coincidencias. No se ha demostrado el código interno del servidor de Open: compatibilidad observada y explicación numérica reproducible, no atribución de implementación oficial.

## Cuatro causas concretas

| Caso | RNT sin f exacto | Reducción matemática | Evaluación binaria64 antes de redondear | Decimal actual → Open/propuesta |
|---|---:|---:|---:|---:|
| 016 | 15876.02 | 5509.965 | 5509.9649999999992360 | 5509.97 → 5509.96 |
| 017 | 14876.02 | 7259.965 | 7259.9649999999992360 | 7259.97 → 7259.96 |
| 047 | 17326.02 | 2972.465 | 2972.4649999999992360 | 2972.47 → 2972.46 |
| 057 | 17368.58 | 2897.985 | 2897.9849999999969441 | 2897.99 → 2897.98 |

Los cuatro pertenecen al tramo `7302 − 1.75 × (RNT − 14852)`; 057 no pertenece al tramo superior pese a su bruto 19747.49: hay que restar 2378.91 de SS antes de elegir tramo. El argumento excluye el gasto f de 2000. El código actual obtiene la expresión exacta en `reduccion-rendimientos-trabajo.ts`, limita por saldo positivo y `conexion.ts` cuantiza la reducción final con `cuantizarEtapa`. La cuantización es coherente con esa matemática decimal, pero difiere del simulador.

En 016, base 8366.05 → 8366.06; gravamen estatal 794.77 → 794.78 y autonómico 711.11 → 711.12. Las dos cuotas netas suben un céntimo: cuota posterior 132.31 → 132.33; resultado −1310.96 → −1310.94. No es una segunda causa de dos céntimos. En 017 se corrigen componentes aunque el resultado final continúa −1443.27.

## Discriminantes y fuentes

Sondeo exacto del corte cerrado, sin consultar journal vivo:

- Decimal final half-up: falla precisamente 016, 017, 047 y 057.
- Redondear el producto antes de restar: falla 004, 005, 025, 026, 035, 045 y 203. Por ejemplo, 004 tiene reducción exacta 5510.035 y Open 5510.04; el producto redondeado daría 5510.03. Queda descartada esa corrección.
- Half-even final: falla 025, 026 y 203; sus oficiales son 3542.27, 5292.27 y 7223.99. Queda descartado sustituir simplemente el modo de redondeo.
- Binary64 con `RNT = Number(bruto) − Number(gastosAE)`, expresión compartida y `Math.round(valor × 100) / 100`: cero diferencias 0023 en los 218 casos.

El orden importa: 045 (`18326.01 − 2378.91`) genera RNT binario 15947.099999999999; convertir directamente el RNT decimal 15947.10 a número produce otro recorrido y puede dar 5385.57 en vez de 5385.58. Tampoco sirve convertir únicamente el resultado decimal final a número. En 026, `toFixed(2)` de la expresión binaria da 5292.26, mientras `Math.round(valor × 100) / 100` da el oficial 5292.27. Estos son discriminantes contra imitaciones incompletas.

`monetario.json` conserva valores exactos, binarios y representación hexadecimal; 24 predicciones vecinas ±0.01 alrededor de ocho puntos, incluidos 14852, 17673.52 y 19747.50. Son predicciones locales, **no capturas oficiales nuevas**. Los anclajes oficiales vecinos ya presentes (004/005 frente a 016/017, 035 frente a 047, 025/026/203) discriminan las hipótesis sin extrapolar desde cuatro ejemplos.

Fuente legal primaria: [LIRPF artículo 20, versión 25-07-2025](https://boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20250725&tn=0#a20); fija coeficientes, tramos, otras rentas y saldo no negativo. El [Manual AEAT Renta 2025](https://sede.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/IRPF-2025/ManualRenta2025Parte1_es_es.pdf), tabla de reducción, identifica RNT como íntegro menos gastos a–e. Estas fuentes sostienen la fórmula, **no especifican binary64 ni un redondeo del producto**. No se invoca el algoritmo de retenciones como norma del cálculo anual.

Se verificaron de nuevo SHA256 y tamaños de los ocho SES/PDF originales de las cuatro discrepancias; referencias completas en `monetario.json`, sin copiar originales. Open visible 1.19, reglas N000088955, modelo 0.12. Se inspeccionaron 44 cuerpos oficiales únicos de JS/WPD/bootstrap referenciados por el tráfico previamente capturado en `c-simuladores-ejecucion-20261104/traffic.jsonl`: no contienen los literales fiscales buscados ni se localizó allí el algoritmo del artículo 20. El cálculo remoto observado no equivale a disponer de su código fuente. El examen no prueba ausencia en todo el CAS ni en toda la web. No hubo navegador, capturas ni peticiones nuevas a Open.

## Propuesta privada y límites

`propuesta.patch` añade una opción interna explícita de compatibilidad 2025 al núcleo existente. `conexion.ts` sólo pasa los operandos ya calculados (íntegro y gastos a–e), usando el selector existente empleo/Madrid/2025. El núcleo reconstruye la resta binaria y evalúa **una única fórmula por tramo**, con operaciones seleccionadas por política. Cuantiza el resultado binario mediante `Math.round(x*100)/100`; el límite por saldo positivo y la composición anual permanecen en la ruta existente. No hay fórmula del artículo 20 en el adaptador, segundo motor ni tabla de excepciones por caso. La ruta decimal conserva su valor por defecto; la opción se ignora fuera de 2025.

Es el candidato mínimo funcional investigado para reproducir esta compatibilidad; no se propone generalizar el comportamiento numérico a ejercicios históricos, pensiones, otros territorios o al resto del motor. Cambia también la evaluación del segundo tramo dentro del perfil Open existente: sus anclajes del corte pasan, pero los vecinos sintéticos sin captura no acreditan todos los empates posibles. Si se exige atribución exacta del algoritmo oficial, falta código del servidor o una especificación oficial numérica. No convertir esta evidencia en una regla fiscal universal. Padre integra y hace la regresión focal; no tocar expectativas, tolerancias ni fuentes.

API real, sin operador `engine.mjs` (evita su consulta VCS e inventario global): base 218 casos / 4 discrepantes; propuesta en memoria 218 / 0 discrepantes en todas las casillas oficiales presentes. Las ausencias siguen ausencias y no se sustituyen por cero en ese cotejo. 016 termina −1310.94. Los dos sondeos Bun duran menos de un segundo cada uno. No se ejecutaron Vitest, tipos, lint, inventario, CI, instalaciones, VCS ni suites pesadas. No se modificó el repositorio. No se ejecutó una regresión histórica: la conservación de la ruta decimal se sustenta aquí en el diff, no en una acreditación nueva.

Antes de escribir el candidato se consultaron `effect-solutions list`, `show basics data-modeling` y `packages/effect/src/BigDecimal.ts` de la fuente local. No se añade servicio Effect ni dependencia; el núcleo sigue siendo puro.

## Reproducción

Desde cualquier directorio, ejecutar secuencialmente:

```sh
source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh
timeout -k 30s 25s python /home/elies/Backups/IRoboPF/producto-c300-art20-investigacion-20261104/repro-monetario.py
timeout -k 30s 25s bun /home/elies/Backups/IRoboPF/producto-c300-art20-investigacion-20261104/repro-api.mjs
timeout -k 30s 25s bun /home/elies/Backups/IRoboPF/producto-c300-art20-investigacion-20261104/repro-api.mjs --propuesta
```

El último usa un plugin Bun que sustituye sólo los dos módulos en memoria; comprueba sus hashes originales y rechaza cambios de base. `transformaciones.json` fija los módulos pequeños antes/después para el sondeo, y `propuesta.patch` es la entrega aplicable. El arnés monetario contiene hipótesis alternativas de investigación; no es código productivo ni modifica oráculos. El manifiesto fija artefactos y referencias externas. Entrega privada; padre decide integración/publicación conforme a sus verificaciones autorizadas.
