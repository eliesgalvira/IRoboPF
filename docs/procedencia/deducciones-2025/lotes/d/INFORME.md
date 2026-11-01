# Lote D: contraste individual de 2025

Entrega candidata de los 63 códigos del censo: 27 de Castilla-La Mancha, 17 de Castilla y León y 19 de Extremadura. Base documental: `016ec72d9539ccd887202735960ce306bd2354e5`, cuyo padre es `464e0fd80293577b91664cb8a6b3a9cbd2dcb52b`. No equivale a aceptación fiscal ni a cierre íntegro de las cadenas históricas.

[Dictámenes individuales](dictamenes.json) contiene el contraste por pasajes y campos, citas literales reextraídas, reglas comunes, disposiciones temporales, discriminantes documentales y reservas por código. Se conservan las omisiones comprobadas aunque se hayan corregido la referencia de página y la descripción del alcance del cálculo.

- Antes: 63 diferencias documentales de referencia a la sección del manual.
- Después: 59 diferencias por omisiones de ficha y 4 `no_verificable` con reservas; no se emite una coincidencia global.
- Cálculo: los 63 registros son `no_verificable` como evaluación fiscal automática. El contrato actual admite consignación externa. Las cuatro fórmulas CLM del auxiliar heredado son parciales; no se presentan como evaluación del derecho ni como cuota anual incorrecta.

Se corrigieron únicamente las páginas de cada sección y, en las fichas genéricas, la descripción que prometía aplicación/verificación de fórmulas, límites, prorrateos e incompatibilidades. Los tres archivos regionales conservan sus códigos, campos y exports. No se modificaron importes, porcentajes ni evaluadores compartidos.

## Fuentes y literalidad

[Fuentes](fuentes.json) identifica 32 adquisiciones normativas/editoriales por SHA-256, SHA-512, URL oficial y metadatos. Incluye originales DOCM/BOCYL/DOE, reformas y correcciones, además de consolidados expresamente auxiliares. Los bytes quedan en almacenes externos. Las respuestas de portada, documentos vacíos y páginas de “sin otros formatos” no se incluyen como fuentes normativas.

El manual conservado tiene edición impresa **21/10/2026**, SHA-256 `765c89ade626abf9726835373d5f15c671b610b00e72109c547f66b8ef9a005c`. [Secciones](secciones-manual.json) fija las páginas físicas de esta edición. `manual.paginasFicha` conserva el censo; `paginasComprobadas` identifica la sección contrastada. Las diferencias de página no prueban por sí solas cambios de interpretación fiscal. Las tablas educativas CLM de las páginas 243–244 se inspeccionaron visualmente; se conserva su extracción con bbox, sin normalizar a ciegas separadores o límites.

Las citas de redacciones originales no se presentan como prueba autónoma de vigencia en 2025. Las notas de modificación del BOE se conservan para identificar eslabones, sin sustituirlos por una falsa cadena completa. Las reservas concretan las reformas y remisiones cuyo cotejo independiente sigue necesario. El régimen residual de vivienda nueva de Castilla y León remite al texto refundido de 2008; también se reabrió el original autonómico de Ley 19/2010 por su hash.

## Cuestión temporal de Castilla-La Mancha

El original DOCM de Ley 1/2026 contiene efectos 2025 para las deducciones de su artículo 18: incrementos de topes de arrendamiento y nuevas deducciones de ahorro para vivienda y perros de asistencia. El consolidado BOE de Ley 8/2013 consultado no incorpora esa reforma y no se utiliza para negarla.

El [aviso oficial de campaña](https://portaltributario.jccm.es/campana-de-renta-2025) excluye expresamente de 2025 la nueva incompatibilidad entre intereses de primera vivienda y adquisición/rehabilitación rural. Se mantiene la reserva interpretativa entre el tenor temporal de la ley y ese criterio administrativo. [Fuentes adicionales](fuentes-adicionales.json) conserva hash, adquisición y literal reproducible del aviso. El enum común no admite `criterio_administrativo`; se registra separado sin inventar fecha de publicación ni etiquetarlo como norma o manual.

## Verificación y límites

La prueba focalizada conserva una fase roja anterior: 64 fallos y 1 acierto; después pasan las **65 pruebas**. Las cuatro suites focalizadas (documentación y tres regresiones de deducciones) pasan: **99 pruebas**. ESLint focalizado pasa en los tres archivos regionales y la prueba. El verificador central en modo parcial admite los 63 registros del lote; los restantes códigos pertenecen a otros lotes.

[verificar.py](verificar.py) comprueba cobertura, ambos hashes y reextracción exacta de las **3.312 citas** —incluida la adicional— desde los 33 documentos externos. Requiere indicar los roots CAS con `--cas`, repetible; admite CAS plano y `sha256/HASH`. Las dependencias están fijadas en el script; usar `uv run` con entorno y caché externos al repositorio. No descarga ni modifica originales. Pasar esta verificación técnica no acepta la interpretación jurídica.

Persisten fichas genéricas o resumidas que omiten condiciones; corregirlas fiscalmente exige completar los hechos, las remisiones y su revisión independiente. Las consignaciones requieren soporte y comprobación externa; un booleano de cumplimiento no acredita renta, convivencia, titularidad, modalidad, reparto ni compatibilidad. Los `pendientes` individuales describen actuaciones realizadas y evidencia faltante; no son certificados de cadena normativa completa.
