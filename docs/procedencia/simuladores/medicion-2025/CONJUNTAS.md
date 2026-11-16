# Ocho declaraciones conjuntas sintéticas

Las ocho capturas matrimoniales conservan su entrada familiar, los controles
del formulario, el SES y el PDF. Cinco diferenciales coinciden al céntimo;
Murcia y las dos entradas aragonesas difieren en un céntimo. No se aplica una
tolerancia para contarlos como coincidencias. Las dos monoparentales aún no
forman parte de estas ocho vinculaciones.

`conjuntas-oficiales/` contiene paquetes JSON comprimidos sin pérdida. Conservan
el PDF original, las acciones, los censos de controles, todos
los HTML necesarios para releerlos y los detalles de rendimientos y cotizaciones.
El SES se transcribe íntegramente de Latin1 a UTF8. Su recompresión zlib de nivel 6
reproduce exactamente los bytes originales en los ocho casos: el verificador
exige también ese SHA, no sólo igualdad del texto. Si no puede reconstruirlos,
rechaza el paquete. No se publica un binario Latin1 que el sanitizador no pueda
inspeccionar. Los demás archivos internos
se codifican en base64: eso no los exime del análisis recursivo de privacidad.

El recibo completo identifica también los archivos auxiliares omitidos, como
capturas de pantalla y cuerpos de red. La derivación privada coteja todos los
originales; la reproducción pública verifica sólo las fuentes necesarias
retenidas. No afirma haber reproducido los auxiliares ausentes. Las huellas
anclan la integridad de los documentos, no son firmas de autenticidad de AEAT.

La vinculación comprueba el censo de personas y sus fechas, residencia y
condiciones representadas, titularidad, modalidad conjunta y territorio. Relee
cinco controles monetarios, incluidos los ceros escritos y reabiertos. El
resultado conjunto del SES debe coincidir con el PDF y con la observación. Los
hechos jurídicos externos siguen siendo contratos explícitamente sintéticos.
La comparación con el motor se realiza después, por separado.

Aragón-02-v2 conserva los originales de su versión anterior. Una adición
documental enlaza la entrada de 47.000 euros con el diseño fijado antes de la
captura; no se modifica el expediente antiguo para simular que ya contenía
esos hechos. La deduplicación excluye entradas económicas repetidas, también
del contador exploratorio.

La reproducción utiliza `vincular-conjunta-open.mjs` y las referencias ancladas
en `tools/procedencia/simuladores/conjunta-referencias/`. Los controles del CI
incluyen corrupción de bytes, sustitución de entrada, pérdida de fuentes,
contradicciones del censo y cambios en el resultado. El alcance no acredita
otros hogares, deducciones ni el ejercicio completo.
