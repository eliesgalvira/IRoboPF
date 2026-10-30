# Corrección del consumidor de preservación v4

Los cinco métodos protectores de la revisión R24 fallan antes del cambio: referencias repetidas, hashes no resueltos repetidos, archivo extra, SHA-512 con salto final e identidad no transformada incoherente. Se conservan los esperados y `rojos-antes.log`. Los controles propios previos añaden prefijos auxiliares incompatibles, adquisiciones duplicadas fuera del pin histórico, extras vacíos y valores privados en URLs/localizadores; diez métodos registran doce fallos de aserción/subcaso, no doce defectos fiscales.

## Cambio y alcance

`edicion.py` valida unicidad de referencias, hashes y fuentes no resueltos, adquisiciones de sobres nuevos, prefijos auxiliares incompatibles y las tres identidades de un metadato declarado no transformado. `schema.json` sustituye 16 patrones por fin absoluto. `verify` exige conjunto exacto de nombres en raíz y ambas carpetas CAS, además de las comprobaciones existentes de tipos, ancestros, hashes y tamaños. Un directorio vacío extra tampoco pasa. No se presenta el schema aislado como equivalente a load y verify.

El manifiesto v4 publicado permanece byte a byte intacto bajo el pin `938f230888d2f71a999d5083c3b484e37687ebad03c4b1ca887535710c6071f2`. Contiene 33 registros de adquisición, 23 distintos por objeto; diez repeticiones exactas son observaciones históricas. La excepción de multiplicidad solo vale para esos bytes fijados, no para cualquier sobre que declare edición 4 o base R21. En sobres nuevos se rechazan duplicados. El recolector deduplica registros idénticos por serialización canónica; no se ejecuta collect ni se reexporta el corte.

El saneamiento nuevo elimina valores de URL con credenciales o ciertos parámetros privados explícitos y localizadores de las familias `/tmp`, `/var/tmp`, `/run/user`, `/Users` y `file://`, además de la política anterior de claves y `/home`. Conserva queries documentales como el identificador BOE. Es una política mecánica declarada, **no anonimización universal de prosa, código, Markdown o strings arbitrarios**. Los metadatos históricos exactos no se reescriben. El pin v4 conocido se verifica con su política original; el recibo diferencia `v4-historica-fijada` de `v4-valores-r26` y siempre conserva `privacyCertification=false`.

## Decisiones y costes

1. Compatibilidad por pin único, no por etiqueta. Objeción: admitir duplicados puede inflar evidencia o convertirse en puerta de escape. Respuesta: solo se conserva el sobre ya examinado por hash externo; cualquier modificación cambia el pin y exige unicidad. El recibo informa observaciones y registros distintos. Coste: una excepción histórica explícita y mantener separados formato, versión del consumidor y política de metadatos.
2. Conjunto exacto en verify. Objeción: un archivo extra puede ser inocuo y útil al archivero. Respuesta: el paquete promete un conjunto fijado; notas externas deben quedar fuera del directorio verificado. Coste: rechazo de carpetas auxiliares no inventariadas, sin borrar residuos ni notas automáticamente.
3. Identidad coherente antes de materializar. Objeción: no se dispone del original de todos los metadatos saneados. Respuesta: la comprobación exige igualdad solo cuando el sobre afirma que no hubo transformación; no inventa la recuperación de fuentes ausentes. Se rechazan prefijos archivo/directorio incompatibles antes de escribir. Coste: el origen saneado sigue necesitando evidencia externa para recomputarlo.
4. Privacidad versionada. Objeción: aplicar otra política retrospectivamente podría romper restauración sin borrar un dato realmente sensible. Respuesta: se conserva el histórico y se identifica la política efectiva, mientras sobres nuevos usan el saneamiento ampliado. Coste: el paquete histórico no recibe una nueva certificación de privacidad; antes de distribuirlo hace falta revisión adecuada a su propósito. No hay transferencia externa autorizada.

## Recuperación pendiente y fuentes localizadas

PV24-01 no se cierra aumentando una lista de URLs y llamando exhaustivo al resultado. El mapa `faltantes-localizados.json` coteja las dos respuestas INE, el PDF CARM y el boletín de Cantabria ya conservados fuera del paquete. Una edición posterior debe incorporar adquisiciones, originales y recetas por identidad; conservar clases y ausencias justificadas; ampliar el censo por referencias tipadas de JSON y JSON.gz. No se incluyen fixtures, documentación técnica y corpus de X como originales fiscales por coincidencia de un hash.

Las copias v1–v4 y sus marcadores quedan intactos. Los hashes de la fuente del consumidor recibida originalmente siguen documentados en su manifiesto de entrega y dentro del paquete; esta corrección es otra versión en Git, no una sustitución del código conservado en el corte. Crossa permanece v1 desfasado.

Los resultados posteriores, comandos y versión de software se registran junto a este informe. Las correcciones nuevas requieren contrarrevisión independiente. La mera lectura correcta de un paquete no acredita vigencia, PAdES/CSV, completitud del corpus o la posibilidad de reinstalar Nix/Python sin red.

## Resultado efectivo

Después del cambio pasan los cinco métodos protectores originales, diez métodos nuevos y nueve regresiones del autor. No se suman subcasos como reglas fiscales. `reales.py` verifica paquete y restauración completos: 1.443 objetos y 6.816 referencias auxiliares por copia, con ambos hashes, tamaño y conjunto exacto, conservando 33 observaciones de adquisición y 23 registros distintos. No se efectúa otra restauración completa ni se cambia el paquete. `copias-reales.json` fija el software efectivamente usado y la política histórica aplicada.

Ruff pasa sobre consumidor y dos instrumentos propios; mypy con `--check-untyped-defs --follow-imports=silent` termina sin diagnósticos en esas tres fuentes. Es comprobación parcial de Python dinámico, no tipado estricto de todo el corpus. Los originales, expectativas previas y cinco rojos antes del cambio permanecen intactos.
