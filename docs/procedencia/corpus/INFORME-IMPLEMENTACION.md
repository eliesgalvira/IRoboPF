<a id="informe-del-editor-del-corpus"></a>

# Diseño y evidencia del corpus

Diseño y evidencia inicial del corpus: helper de descarga, pipeline Python, esquemas, pruebas y fixtures públicos. Para ejecutar el pipeline, consultar `../CORPUS.md`. Estas comprobaciones no aceptan cifras fiscales.

## Decisiones y objeciones expertas

1. **CAS local con manifiestos e historial.** Objeción archivística: un hash no recupera bytes que desaparecieron y un disco único no es un archivo duradero. Decisión: originales inmutables por dirección de contenido, reconstrucción con hash obligatorio, fallo explícito ante fuentes mutables y recomendación de copia independiente. Coste: sin cloud ni segundo soporte provisionado no hay garantía de recuperación. No se disimula con un manifiesto.
2. **Python/MuPDF junto al helper existente.** Objeción de integración: añadir otro runtime aumenta mantenimiento. Decisión: aprovechar el helper estándar compatible, extracción/render con la misma biblioteca y entorno uv aislado. Coste: Python, libstdc++, PyMuPDF y Poppler en CI. La integración con el inventario y el motor requiere contratos y verificadores separados.
3. **Selección estricta y literal, sin OCR automático.** Objeción documental: una capa de texto puede estar equivocada o ausente. Decisión: literal exacto, recorte real y fallo explícito si falta capa. Coste: documentos escaneados requieren otro proceso, revisión humana y contrato OCR antes de aceptarlos. Filas/celdas son citas individuales con su caja; no se infieren relaciones por proximidad.
4. **Firma criptográfica separada de confianza.** Objeción pericial: un certificado actualmente caducado no demuestra que una firma fuera inválida al emitirse, y una firma válida no prueba vigencia fiscal. Decisión: conservar salida de pdfsig y devolver confianza indeterminada ante integridad válida, sin afirmar validación histórica. Coste: falta aprovisionar anclas de confianza, política de algoritmos, revocación y validación temporal. Las pruebas desactivan OCSP y no solicitan AIA; no necesitan red.
5. **CSV limitado a cotejo de bytes.** Objeción: repetir la URL del documento no comprueba la relación jurídica con un identificador. Decisión: conservar ID/enlace impreso y ofrecer comparación exacta de respuesta cuando exista un endpoint oficial descargable; nunca llamarla autenticación. Coste: los ejemplos siguen sin verificación CSV; formularios y captcha requieren adaptación posterior y evidencia de la operación.
6. **WARC y RFC3161 evaluados, no simulados.** Objeción: HTML depende de contexto y el reloj local no prueba fecha cierta. Decisión: conservar original/cabeceras y reconocer límites; no producir WARC incompleto ni sello inventado. Coste: no se acredita contexto web completo ni fecha mediante tercero confiable.
7. **Fixtures completos de tamaño moderado.** Objeción: derivar un PDF de pocas páginas destruiría firma y hash del original. Decisión: dos originales íntegros, uno firmado y otro consolidado, más tres PNG. Coste: aproximadamente 1,3 MB versionables; el BOE original de 2,2 MB y el resto del corpus quedan fuera de Git. Su reconstrucción depende de disponibilidad o respaldo.
8. **Aceptación separada de comprobación.** Objeción: comprobar números no demuestra una fórmula, una condición ni la unidad de una fila. Decisión: spans exactos y Decimal, unidades explícitas, revisión semántica y revisor distinto del autor obligatorios para aceptación atestada. Coste: un humano puede falsificar una atestación JSON; la identidad y la revisión se sostienen mediante revisión del repositorio. No hay firma de revisores ni evaluación simbólica del motor.
9. **Selección de hosts explícita.** Objeción: importar la caché de auditores también puede incorporar documentación técnica no fiscal. Decisión: conservar esos bytes sin elevarlos a oficialidad y marcar el origen pendiente si no está en allowlist. Coste: cada nueva autoridad autonómica requiere autorización explícita; no se permite cualquier subdominio por semejanza.

## Evidencia ejecutada

- Descarga nueva de BOE-A-2025-1 con el helper ampliado, manifiesto con ambos hashes, firma inspeccionada, cita de portada y PNG verificados. El documento demuestra el pipeline, no una regla IRPF.
- Lectura/copia de 27 índices de la caché padre al inicio de la importación; el padre no se modifica. La caché es dinámica: no se afirma que ese recuento sea el inventario completo actual.
- BOE consolidado IRPF: ausencia de firmas. BOCM fiscal y BOE original: integridad de firma válida, certificado caducado, confianza indeterminada. Los reportes conservan el diagnóstico NSS de la máquina.
- Una celda real del BOCM, página física 3, con `8,50 %`, caja, PNG y binding decimal de demostración. Permanece pendiente de interpretación y contrarrevisión; no es validación del valor que use el motor. Alterar el binding a `8.51` falla.
- Pruebas de PDF falso servido con 200, límite de tamaño, allowlist y redireccionamiento inseguro; SHA esperado incompatible; importación no destructiva e historial; texto/caja/página/selectores alterados; original y recorte corruptos o referencia ausente; decimal ambiguo, substring y unidad equivocada; CropBox desplazado y página rotada; documentos oficiales reales; alteración de un byte cubierto por firma.
- La verificación exige un recorte existente y no escribe ni repara el corpus durante la comprobación.

<a id="incidencia-vcs-y-entrega"></a>

## Preservación e integración

Los originales grandes quedan fuera de Git y requieren preservación por hash. Los PDF/PNG de fixtures se identifican en los manifiestos de entrega. Al integrar, comparar los archivos con su base y excluir metadatos de control de versiones y cachés del checkout de origen.
