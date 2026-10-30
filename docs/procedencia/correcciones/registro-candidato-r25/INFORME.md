# Proyección candidata de revisores

Se prepara `revisores-candidatos.json`, compatible con el schema v2 existente, a partir del registro derivado de la revisión técnica R23. Contiene dos identidades exactas y 264 aprobaciones propuestas: 78 estatales y 186 autonómicas. **No se instala en el registro activo y no constituye una promoción.** Los payloads, atestaciones, informes e identidades originales no cambian.

`preparar.py` coteja los bytes originales embebidos en la derivación, ambos hashes y tamaños de sus referencias, índices y objetos de las dos delegaciones R19, mapa R21, identidad exacta de cada atestación, informe, inventario, ámbito, autor distinto del revisor y unicidad de los pares. La representación autonómica queda anclada a la commandKey concreta ya observada; no se introduce una regla de alias en el consumidor.

El auxiliar real `verify_attestation` rechaza los 264 pares con el registro vacío. En un árbol físico de ensayo bajo `.cache/orquestador-recepcion/r25/registro-ensayo`, con los mismos bytes documentales y el registro candidato, admite los 264 como `accepted-limited`. `DocumentaryReadSet.finish` relee sus dependencias. El registro activo conserva exactamente sus bytes anteriores. `comprobaciones.json` fija entradas, resultados y dependencias del ensayo.

Esto verifica el contrato de registro del auxiliar; **no ejecuta el coordinador completo**, la reextracción, la evaluación temporal, la publicación ni la autenticación histórica. El ensayo no acredita residencia o elegibilidad. `completeRuleAcceptance` sigue siendo false. Una revisión independiente nueva debe comprobar el recorrido completo y sus negativos antes de cualquier decisión operativa de integración. Madrid v1 queda fuera de estos 264 pares.

Decisión: proyección de datos sin modificar el parser. Objeción experta: normalizar identidades puede ocultar una autorrevisión o ampliar confianza a cualquier texto parecido. Respuesta: referencias fijadas, objetos originales íntegros, igualdad exacta y aprobación por pareja; el consumidor mantiene su comparación estricta. Coste: conservar y revisar un artefacto derivado adicional y no propagar aceptaciones a payloads nuevos.

Decisión: conservar la confianza activa vacía durante el ensayo. Objeción experta: una demostración aislada no prueba que la aplicación completa acepte solo lo autorizado. Respuesta: el límite queda explícito y la revisión siguiente debe usar coordinador y publicador reales en scratch, sin confundir el resultado técnico con calificación fiscal. Coste: una etapa adicional de integración y revisión, necesaria antes de publicar esos estados.

Comandos ejecutados desde la raíz, serializados con `flock /tmp/irobopf-validacion-pesada.lock`:

```sh
env PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT=/home/elies/Repos/IRoboPF/.cache/procedencia/derechos-r15-venv bash tools/procedencia/run.sh docs/procedencia/correcciones/registro-candidato-r25/preparar.py
nix shell nixpkgs#ruff -c ruff check docs/procedencia/correcciones/registro-candidato-r25/preparar.py
env PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT=/home/elies/Repos/IRoboPF/.cache/procedencia/derechos-r15-venv MYPYPATH=/home/elies/Repos/IRoboPF/tools/procedencia nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/orquestador-recepcion/r25/mypy docs/procedencia/correcciones/registro-candidato-r25/preparar.py'
```

Ruff y el último mypy terminan correctamente. Se conservan el intento sin mypy instalado y el diagnóstico posterior de ruta de imports e inferencia del contenedor heterogéneo. Se corrige la anotación del instrumento y se usa MYPYPATH explícito, sin suprimir diagnósticos ni modificar las expectativas. El tipado de datos JSON sigue siendo dinámico; las aserciones de recepción y el schema cumplen una función distinta.
