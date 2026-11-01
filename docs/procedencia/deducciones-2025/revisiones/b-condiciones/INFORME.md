# Revisión de condiciones de Asturias y Cantabria, 2025

**Requiere dos rectificaciones documentales.** Las 48 decisiones individuales arrojan 45 coincidencias en el alcance documental, dos diferencias y una reserva legal específica. No constituyen aceptación de la entrega ni certificación de un calculador fiscal completo.

Candidato examinado: `6301c8da457ced81c348bdb10d8e5e04f67ec7fe`. Comparación: `937ea5d504755a337274e420e5123d2b492ef1c6`. Se revisa la ampliación de condiciones y remisiones; se conservan los aspectos favorables anteriores sin cambio. No se modifica producto, evidencia del autor ni informes recibidos.

## Diferencias

**BC01 — Familia monoparental cántabra: falta un beneficiario.** La nueva descripción enumera menores e hijos mayores incapacitados judicialmente sujetos a patria potestad prorrogada o rehabilitada. Omite mayores con curatela representativa. La sección propia del manual, página física 220, los incluye y explica el efecto de Ley 8/2021. Las citas `rbc-manual-3/4` permiten reproducirlo sin inferirlo de otra deducción. La DT segunda de [Ley 8/2021](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2021-9233) distingue las situaciones anteriores de las medidas nuevas; no se usa su DT quinta original para fijar plazos vigentes en 2025.

Contraejemplo: progenitor sin vínculo matrimonial que convive con su hijo de 28 años con curatela representativa ejercida por aquel, con base liquidable minorada de 20.000 euros. El manual permite los 200 euros; la enumeración de beneficiarios de la ficha no representa ese supuesto. Es una omisión descriptiva, sin reproducción de cuota errónea del motor.

**BC02 — Estudios cántabros: discrepancia del manual sin registrar.** La ficha mantiene correctamente renta estrictamente inferior a 8.000 euros, conforme a Ley 3/2024, artículo 3.Uno, redacción del artículo 2.11.4. Sin embargo, `manual.discrepancias` está vacío. La página física 226 dice renta no superior a 8.000 (`rbc-manual-5`; el propio lote conserva también `-m3`). A exactamente 8.000 ambos textos divergen. Debe anotarse la discrepancia y conservarse la exclusión legal; no procede modificar la ficha para seguir el manual.

Los dos rojos de [casos.test.ts](casos.test.ts) exigen esas rectificaciones y fallan sobre el candidato. No son tests de cálculo numérico ni cambios de expectativas para tolerar importes incorrectos.

## Cobertura y límites

[decisiones.json](decisiones.json) contiene 48 motivos y discriminantes, cadenas, efectos, apartados comunes aplicables y no aplicables, remisiones, páginas propias del manual y citas con hash y localizador exacto. El texto literal de las referencias del lote permanece en `lotes/b/dictamenes.json`; las nuevas citas están en [citas-complementarias.json](citas-complementarias.json). Las coincidencias se refieren a las condiciones normativas descritas en cada decisión, no a todos los criterios interpretativos posibles del manual ni a hechos de una declaración concreta.

Se confirma la distinción entre DA primera/segunda cántabras, reescritas por Ley 3/2023 desde 1/1/2024, y unidad familiar estatal. Una pareja equiparada para un beneficio autonómico no adquiere por ello derecho a conjunta estatal. El artículo 24 asturiano limita sus equiparaciones a ISD. Se conservan tercero/segundo grado en inversión, exclusiones de dirección y empleo donde la norma las exige, PYME con asociadas/vinculadas y base conjunta de donativos con artículos 68.3/68.5. No se trasladan exclusiones de inversión cántabra al artículo asturiano por analogía.

Decreto 83/2025: 78 concejos en el anexo II, distinguiendo riesgo/crisis de las demás categorías; publicación 27/6 y entrada 28/6, con remisiones fiscales de Ley 5/2025 al devengo 31/12/2025. PRE/1/2025: 41 municipios (26 riesgo, 13 grave y dos de tratamiento especial), publicación/entrada 3/1 y aplicación de su relación a hechos imponibles desde 1/1/2025. Identificar municipio y residencia reales sigue siendo un hecho que acreditar.

**R30 — Gastos vitales asturianos:** Ley 8/2024, página física 22, imprime 26–30 y 30–35. El manual usa 31–35. Se conserva la reserva para los 30 años, sin resolverla mediante el manual ni propagarla a otras 47 deducciones. Es la única decisión `no_verificable`, limitada a esa frontera, por ambigüedad de fuente; no designa trabajo interno pendiente.

El contrato de la ruta única debe representar y comprobar los hechos enumerados por código, distinguir gasto/base/ayuda/cuota y límites compartidos, ordenar arrastres por ejercicio y aportar procedencia de los valores. Entre las precisiones que deberá representar están el mínimo por ascendientes (edad, renta, declaración y convivencia), la ausencia de acumulación de la inversión propia y familiar en vivienda por discapacidad según manual página 92, y el criterio supletorio SERPAVI para precio sostenible según páginas 124–125. Su descripción legal y sus precisiones administrativas son planos distintos. Las citas complementarias 6/7 conservan estos dos últimos criterios sin convertirlos en otra ruta regional.

## Motor y comprobación

Los casos históricos de alquiler conjunto y nacimiento no describen la salida actual. La API examinada lanza `RangeError` con hechos insuficientes; se comprueba para ambos. Consignar 900 euros de alquiler conserva 900: ese contrato agrega un importe externo, sin validar su elegibilidad. No se afirma que haya calculado fiscalmente 300 o 1.400 en esos casos.

Resultados independientes:

- Reapertura y extracción de los 67 originales por hash; tamaño, SHA-256 y SHA-512 correctos. Reextracción de las 4.106 citas y comprobación de los 15 índices: conforme, estado candidato.
- Cinco suites focalizadas del candidato: 66 pruebas aprobadas, un worker.
- Casos propios: siete pasan y dos rojos documentales reproducen BC01/BC02.
- Tipos y lint del alcance: resultados conservados en el transporte. Sin build ni pasada global pesada.

Pruebas públicas, sin CAS, archivos privados ni historia Git:

```sh
bun install --frozen-lockfile
bun run test tests/deducciones-procedencia-2025-b*.test.ts tests/deducciones-contratos.test.ts tests/deducciones-ambito.test.ts --maxWorkers=1
bun run test --config docs/procedencia/deducciones-2025/revisiones/b-condiciones/vitest.config.mjs
```

La segunda suite debe mostrar los dos rojos hasta la rectificación. Está fuera de las pruebas ordinarias y no cambia su resultado. La suite documental opcional requiere roots CAS explícitos: ejecutar el verificador del lote y después `verificar.py` de esta revisión, con `--cas-plano` para cada almacén. Dependencias de extracción: `pymupdf==1.26.7` y `beautifulsoup4`. El manifiesto complementario identifica la nueva adquisición oficial; los originales permanecen fuera del repositorio.

No cambia la API. La recepción, integración y decisión de aceptación corresponden al padre.
