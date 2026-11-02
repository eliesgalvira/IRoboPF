# Obligaciones independientes por lote

Candidato técnico de la canalización común. Se añade selección explícita de registro con pin externo, schema estricto y reconstrucción desde manifiesto v3. No se amplían datos, cálculos, vocabulario de cabeceras ni pruebas semánticas acreditadas. No se acepta ningún lote ni el bloque A.

API: `flujo.py --base SHA --cas CAS --work TEMP --mapping MAPEO --obligations REGISTRO --obligations-sha256 PIN --output MANIFIESTO`. Sin selección se conserva el piloto fijado. Reconstrucción: los mismos código/runtime y originales, `--verify MANIFIESTO`; mapping y registro son recuperables del CAS. El wrapper conserva sus variables requeridas y permite la pareja `DATOS_OBLIGATIONS`/`DATOS_OBLIGATIONS_SHA256`.

El registro no contiene expresiones del motor ni importes esperados: declara documento, ámbito, posiciones y unidades, más enlaces a evidencia literal. Se exige cobertura exacta antes de extraer; no se regeneran obligaciones desde mapping. Las únicas pruebas semánticas del motor admisibles son las ya fijadas en el piloto; cada preimagen y cita se vuelve a comprobar. La falta de prueba conserva no verificación. Cabeceras nuevas fallan explícitamente, incluso con la palabra euros; su admisión requiere revisión separada con discriminantes propios.

Las pruebas sintéticas de `tools/procedencia/datos/tests/test_obligaciones_lotes.py` ejercitan dos registros ajenos al piloto mediante la CLI real y su replay desde CAS; rechazan pins erróneos, sustituciones, trasplantes, intercambios, omisiones, schema indebido, pruebas inventadas y preimagen incorrecta. Alterar extracción y metadatos recalculando hashes sigue fallando frente a la reextracción del PDF original. Los fixtures no afirman aceptación fiscal ni cobertura de lotes reales. Las regresiones RP01–RP09 y geometría mantienen sus expectativas.

La validación documental/estructural es técnica. La revisión de obligaciones explícitas y la aceptación jurídica permanecen pendientes; el manifiesto las separa de la selección y del resultado numérico. No se crean revisores ni atestaciones. La revisión independiente de este candidato corresponde a la integración.
