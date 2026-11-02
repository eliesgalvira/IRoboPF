# Revisión del localizador de gv-31

Dictamen favorable acotado a la corrección de RV01 sobre `922da249abb7cf06fb1ce92e3f089bb96270a924`. No se detectan defectos en el localizador corregido. No supone aceptación fiscal ni promoción de confianza y no reitera los dictámenes de los seis códigos.

El original del [Decreto ley 14/2025](https://dogv.gva.es/datos/2025/12/29/pdf/2025_52316_es.pdf), SHA-256 `f02475336a032c236b02d32ebeaf1a092ce726714f9395426afc3f09aa04abff`, se ha contrastado por tamaño, SHA-256 y SHA-512 con `fuentes.json`, sin nueva descarga. La extracción con PyMuPDF 1.26.7 coincide carácter por carácter con `gv-31`: intervalo semiabierto `425731:428476`, 2745 caracteres, páginas 87–88. Se ha inspeccionado visualmente ambas páginas: el artículo comienza en la 87, continúa en la 88 y cierra antes del artículo 61.

El apartado único modifica la letra c) del apartado 2 del anexo II del Decreto 65/2019. Incluye ocupación del 20 %, superficie perforada del 25 %, retorno automático, escalera, medidas compensatorias y remisión al CTE sobre incendios. No incorpora el artículo siguiente ni el índice.

La disposición final cuarta establece la entrada en vigor al día siguiente de la publicación de 29 de diciembre de 2025. La cadena conserva efectos desde `2025-12-30` y la exclusión de obra histórica. Comparados con la entrega revisada anteriormente, solo cambia `gv-31` dentro de las citas: las demás citas, cadenas, propuestas, fuentes y archivos de aquella revisión conservan sus bytes. No cambia la regla, el catálogo, el producto, el estado ni la confianza; no hay API afectada.

Las tres pruebas de `tests/g-vivienda-localizador.py` pasan en exportación sin Git. Con la preimagen recibida fallan contenido material y delimitación; pasa conservación de documento/remisión. El verificador histórico anterior permanece intacto: pasa con sus bytes históricos y reproduce RV01; contra la cita actual falla su comprobación de integridad, como corresponde. No se ha adaptado para presentarlo como verificación actual.

Los controles propios fijan las coordenadas y el hash del literal reextraído, la cadena y los hashes conservados. Rechazan un desplazamiento de igual longitud, un porcentaje alterado y cambios en fecha o exclusión histórica. No requieren red, CAS, cachés ni objetos Git:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 tests/g-vivienda-localizador.py -v
PYTHONDONTWRITEBYTECODE=1 python3 docs/procedencia/deducciones-2025/revisiones/g-localizador/verificar.py -v
```

El ensayo adicional explícito `correcciones/g-vivienda/verificar.py --cas <almacen>` pasa reextrayendo los originales con las dependencias fijadas. Los originales y registros de ejecución quedan fuera de la documentación pública. El alcance no incluye otras regiones, una nueva revisión favorable de los seis códigos ni CI global, que corresponde a la integración.
