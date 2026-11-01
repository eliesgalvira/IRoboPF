# Revisión independiente A — ejercicio 2025

HEAD comprobado antes de escribir: `a6abaf0c35b018fe54d75fe7e4f16197f1600f42`. Base original de contraste: `016ec72d9539ccd887202735960ce306bd2354e5`. Sin mutaciones VCS ni cambios de producto. No se acepta globalmente el lote ni se valida una liquidación completa.

[Decisiones individuales](decisiones.json): los 49 códigos están cubiertos, con magnitudes, condiciones, diez aspectos de alcance, fronteras y reservas. Hay **nueve diferencias documentales actuales**, incluida una ambigüedad; los otros cuarenta quedan provisionalmente no verificables para el alcance completo. Este último resultado significa investigación parcial pendiente, no imposibilidad probada. No se acepta automáticamente el recuento de 49 del autor.

Las diferencias son: vivienda joven/protegida andaluza (alternativa edad/VPO); alquiler andaluz (sujetos habilitados y conjunta); nacimiento/acogimiento andaluz (90 días); primer/segundo hijo aragonés (residencia del contribuyente en ambos años); guardería aragonesa (autorización y reparto); nacimiento/acogimiento catalán (incompatibilidad); alquiler catalán (habilitación y reparto); varios pagadores catalán (exclusión de quienes pueden acogerse al artículo 89.A RIRPF); ángel inversor (facturación aparece dentro de la frase «En ampliación», aunque es requisito autónomo). Los discriminantes conservan lo observado y lo esperado. Son omisiones o ambigüedad de descripción: **no demuestran errores de cuota** en declaraciones actuales. El arreglo mínimo consiste en ampliar o aclarar esas fichas, manteniendo sus campos y la consignación externa. No se ha aplicado.

## Ocho cambios del autor

[Contraste completo](cambios-revisados.json) y [pruebas independientes](pruebas.py). Se reproduce la diferencia entre base y HEAD en los ocho casos. En Aragón, restar ayudas después del tope produce 30 frente a los 50 anteriores en libros, y 80 frente a 100 en apoyo y formación; ayudas superiores a la deducción dejan cero. El apartado 3 de cada artículo dice «deducción resultante». Las tablas del manual fijado, páginas físicas 74 y 85, se inspeccionaron visualmente: los extremos 6.500/6.500,01 y 12.000/12.000,01 pertenecen a tramos distintos. No se ha cambiado ni acreditado un evaluador financiero por esos textos.

Las cinco ampliaciones catalanas recuperan las magnitudes omitidas. Investigación exige además el límite combinado estatal del 100% del donativo: donativo 100 y deducción estatal 80 permiten como máximo 20 autonómicos, antes del límite de cuota. Ángel inversor mantiene la ambigüedad indicada. La vivienda transitoria sigue necesitando reconstrucción estatal histórica, incluida base distinta de adecuación por discapacidad; las tasas por sí solas no cierran el régimen.

## Fuentes y vigencia

Reextracción independiente: 21 documentos íntegros y 1.261 citas del autor. Se añaden [25 citas](citas-refinadas.json), [ocho adquisiciones oficiales](fuentes-complementarias.json) y una [matriz por artículo/código](matriz-vigencia.json). Los originales permanecen en CAS externo; los metadatos públicos permiten resolverlos por hash. Las citas complementarias se reextraen con `verificar-citas.py`. La coincidencia literal de las 1.261 citas no certifica que cada etiqueta de apartado del autor sea correcta: las etiquetas «párrafo» y los fragmentos de disposiciones modificadoras requieren afinar correspondencia; esta revisión no afirma haber cerrado semánticamente todas ellas.

La cadena andaluza necesita una corrección importante de explicación. Ley 7/2024 DF5.2 fijó 900/1.000 euros para alquiler, con entrada en vigor el 1/1/2025. **Ley 8/2025 DF18.b da efectos desde el 1/1/2025 también a DF9.1 (artículo 10)**, además de DF9.2–5. Por eso 1.200/1.500 tienen apoyo para 2025; no son simplemente un cambio que deba reservarse a 2026. La supresión del límite de renta del artículo 11 también tiene esos efectos. La ficha no debe volver a 900/1.000 ni imponer al nacimiento el límite suprimido. Citas separadas a la disposición de efectos y al artículo reformado evitan confundir publicación, entrada y efectos.

Se recuperan los originales regionales de Ley 17/2023 y Ley 13/2023 aragonesas. La residencia de 600 euros nace de **160-2.8**, condicionado por 160-1, no de 160-1 aislado. La condición común de pago bancario está en **DA segunda**, añadida por Ley 17/2023 art64.10; 110-1 regula la escala. Se incorporan ambas correcciones BOE de Ley 10/2012: 3095 afecta 132.5 y tasas; 5622 afecta su artículo 30 sobre vivienda protegida. Su lectura completa no modifica los artículos IRPF examinados. Queda pendiente cotejar sus publicaciones regionales BOA45/2013 y91/2013 y las restantes reformas históricas identificadas. Un 404 inicial por fecha BOE equivocada se resolvió con la fecha oficial correcta; no se usa como bloqueo.

En Catalunya, el original DL1/2024 y DL5/2025 permiten comprobar directamente los artículos iniciales y los efectos 2025 de 612-1, 612-3, 612-11 y 612-12. Ley8/2025 DF3 vuelve a redactar 612-3 con efectos 1/1/2025; se cotejó su reproducción BOE, quedando pendiente incorporar original DOGC. No se importa al artículo612-11, sin prueba adicional, el límite por vivienda del612-3. Cooperativas exige mantener durante cinco años también las condiciones de socio/entidad y contempla excepciones de reinversión/transmisión; no procede regularizar mecánicamente toda baja.

Se recuperaron versiones históricas LIRPF/RIRPF solicitadas a31/12/2012 como auxiliares. **No sustituyen los originales estatales y sus reformas**, todavía pendientes para cerrar vivienda. Tampoco están agotadas las búsquedas regionales de correcciones ni las órdenes de información ATC de donativos. Cada fila concreta artículo, reformas, efectos, remisiones y siguiente cotejo. No se presenta una reserva general de firma criptográfica como impedimento para verificar una regla material disponible.

## Contrato: URL y fecha

Las dos regresiones anteriores se reproducen desde `2aa38fec`, extrayendo sus archivos en privado, sin checkout alternativo. La URL oficial real de DOGC contiene `/home/`; la fecha nula del manual es correcta porque solo consta el pie editorial 21/10/2026. Ambos positivos pasan ahora. Rutas locales, URL sin host, credenciales en `urlOficial`, parámetros codificados/vacíos, norma con publicación nula, reserva vacía y fecha imposible se rechazan por el verificador actual.

Persisten **dos hallazgos acotados** en [pruebas-contrato.py](pruebas-contrato.py):

- El nuevo atajo de privacidad acepta una URL HTTPS con `/home/` y usuario/contraseña o `?token=…` si aparece en una reserva. La misma entrada era rechazada antes y sigue rechazándose en `urlOficial`. Arreglo mínimo: validar credenciales y parámetros sensibles en toda URL reconocida por `privacidad`, antes de exceptuarla del filtro de rutas. Conservar el positivo oficial real.
- El schema aislado admite `fechaPublicacion:null` en una norma sin reserva; el verificador sí lo rechaza. Añadir condición de schema que limite el nulo a manual con reserva no vacía. Esto es divergencia de validadores, no aceptación por el ejecutable de una fecha normativa ficticia. Una fecha ISO plausible tampoco prueba su verdad documental.

No se reabren R01–R03 ni la ampliación original/reforma/corrección asignada a B.

## Verificación y trabajo pendiente

Pasan las 44 regresiones centrales y las 68 pruebas focalizadas (58 del lote y10 de contrato). Los ocho contrastes de cambios pasan; se conservan nueve rojos documentales nuevos y los tres casos rojos de los dos hallazgos de contrato. Ninguno se convierte en verde modificando el producto. Los dos fallos financieros esperados de la suite integrada no se alteraron ni se declaran reproducidos por estas pruebas documentales.

La entrega permite revisar hallazgos concretos, pero **no completa el cierre exhaustivo solicitado**: quedan cadenas regionales, correcciones, remisiones históricas y correspondencia semántica exhaustiva de citas. Son tareas pendientes identificadas, no imposibilidades ni conformidades. Los 49 sondeos de consignación solo comprueban que importe/cumple se transportan; no califican hechos ni fórmulas.

Comandos reproducibles desde raíz, con dependencias y cachés externas y `REVIEW_TMP` existente fuera del repositorio:

```sh
python3 docs/procedencia/deducciones-2025/revisiones/a/pruebas.py
uv run --no-project --python python3 --no-managed-python --with jsonschema==4.26.0 python docs/procedencia/deducciones-2025/revisiones/a/pruebas-contrato.py
uv run --no-project --python python3 --no-managed-python --with pymupdf==1.26.7 --with beautifulsoup4==4.14.3 python docs/procedencia/deducciones-2025/revisiones/a/verificar-citas.py --cas "$CAS_EXTERNO" --cas "$CAS_LEGACY"
uv run --no-project --python python3 --no-managed-python --with jsonschema==4.26.0 python docs/procedencia/deducciones-2025/contrato/regresiones.py
```

Los dos primeros conservan salida1 cuando reproducen los defectos. Los logs, extracción de versiones anteriores, comprobación física antes/después, manifiesto y patch permanecen privados. La carpeta pública contiene solo revisión, citas, metadatos y pruebas; no originales ni recibos de transporte.
