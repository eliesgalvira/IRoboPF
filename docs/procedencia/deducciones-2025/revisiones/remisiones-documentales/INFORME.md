# Revisión de tres rectificaciones documentales

Base exacta: `a1be4f9dadacb1fdd1ec0e4b4d8387a39a342dd3`. **Tres decisiones favorables dentro del alcance documental.** No se evalúan cuotas ni se reabren los dictámenes anteriores de otras familias. Producto y API sin cambios.

1. **CLM: aceptar el recuento de 25 municipios.** La página física 2 del Acuerdo de 7/2/2023 contiene 25 filas sin duplicados: 5 Albacete, 4 Ciudad Real y 16 Toledo. Provincia, INE y nombre coinciden con [municipios.json](../d-clm-remisiones/municipios.json) y con la evidencia de esa revisión. Las [tres sustituciones propuestas](../d-clm-remisiones/propuestas-documentales.json) explican exactamente los 11 reemplazos (1/9/1) del informe, matriz y propuestas; no hay otras diferencias en esos archivos frente a la preimagen preservada. El registro común `lotes/d/dictamenes.json` también dice 25. Se conservan las dos reservas de concurrencia de vivienda y sus evidencias contrapuestas; esta rectificación no cambia conclusiones.
2. **Abonos valencianos: aceptar la nueva atribución.** Se contrastaron los originales de Ley 13/1997 en las versiones fijadas de enero, junio y diciembre: artículo 4.Uno.x y DA decimosexta contienen la regla y los medios de pago. El artículo 30 de Ley 9/2014 pertenece a sucesiones. `gl-67` mantiene su literal como contexto identificado y ninguna de las seis propuestas lo utiliza. La reserva sobre vigencia particular del convenio permanece; las dos transcripciones visuales históricas se conservan idénticas y señaladas como tales.
3. **Manual: aceptar los 18 pasajes y su asignación.** Reextracción independiente con `pdftotext -layout`, UTF-8 y normalización `' '.join(texto.split())`, sobre el PDF completo. Se confirmó cada literal mediante `texto[inicio:fin]`, su longitud y su inclusión íntegra en la página física declarada (577–587, 601–602). Las [fronteras fijadas](fronteras.json) conservan página, offsets y hash de cada pasaje, más la asignación por los seis códigos. Se mantienen la excepción temporal de fallecidos, los beneficiarios y comparables, las exclusiones de parentesco/atribución de rentas de 583–584, los medios de pago y las continuaciones de certificación de 585–587. Ningún fragmento invade la deducción siguiente. El gasto propio q.3 y los abonos no reciben certificado de donación; q.2, q.3, r y s conservan la remisión al requisito conjunto de 587. La reserva del censo sigue limitada al quinto grupo de r.

No se reproduce ningún defecto nuevo que requiera corrección del candidato. Condiciones de aceptación: mantener los literales, localizadores y asignaciones comprobados, las reservas anteriores y la distinción entre evidencia normativa y hechos individuales. El contraste no acredita derechos particulares ni aceptación financiera.

Los [seis originales verificados](fuentes-verificadas.json) incluyen URL oficial, SHA-256, SHA-512 y tamaño. Anexo: SHA-256 `51f847c6e5bd7a76c382c3245a1b1130c87d0460a13b356806211910c5ecabd3`, 268.989 bytes, p. 2. Manual: SHA-256 `765c89ade626abf9726835373d5f15c671b610b00e72109c547f66b8ef9a005c`, 3.861.057 bytes. Las versiones legales y ambos hashes completos figuran en ese manifiesto; no se incorporan originales.

Pruebas: los seis métodos del discriminante raíz reproducen **18 fallos sobre la preimagen** y pasan sobre la base actual. El verificador histórico valenciano se ejerció intacto contra sus siete preimágenes, incluidos sus hashes; no se usó para aprobar bytes nuevos. Las once sustituciones CLM se verificaron con hashes previos y comparación exacta. Pasan la comprobación estructural y siete pruebas propias, con cinco mutaciones rechazadas (página, desplazamiento conservando longitud, recorte de exclusión, certificado trasladado y atribución ISD).

Las tres suites de integración pasan **176/176**, con `--maxWorkers=1`; tipos principales y vendor conformes. El contraste de las adaptaciones confirma imports estáticos y Schema en los tres JSON CLM, conservando las expectativas; la ausencia de `articulo` se descarta antes de `includes`, sin aceptar citas ajenas. No se añadieron casts, skips ni relajaciones para ocultar errores.

Reproducción ordinaria autocontenida, sin red, CAS ni historial:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 docs/procedencia/deducciones-2025/revisiones/remisiones-documentales/verificar.py -v
PYTHONDONTWRITEBYTECODE=1 python3 tests/remisiones-clm-cultura-documentales.py -v
PYTHONDONTWRITEBYTECODE=1 python3 docs/procedencia/deducciones-2025/correcciones/g-cultura-lengua/verificar.py
```

La reextracción por ambos hashes, los rojos previos, los logs y el ensayo de reconstrucción por archivos entregables quedan en la entrega privada duradera. Los tests ordinarios no dependen de ella.
