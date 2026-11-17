Proyección sintética acotada de Murcia

El replay público obligatorio usa inquilinos-oficiales/inquilino-murcia-02.json.gz y la referencia fijada en tools/procedencia/simuladores/inquilinos-public-reference.json. Reconstruye los 79 originales íntegros y verifica sus bytes antes de interpretar SES/PDF. No requiere un almacén privado ni permite skips.

Se observa salario, identidad y diálogo regional aceptado y reabierto: 7200 EUR, una persona, arrendador sintético, familia numerosa false y segunda vivienda vacía. El PDF 1129 expresa importe con derecho, no personas. El resultado se lee de SES y PDF: 264.55; el resumen residual se conserva íntegro.

Recibos, ITP, fianza, ayudas, reembolsos, titularidad y permanencia futura son hechos externos sintéticos preservados; el replay no verifica su autenticidad jurídica. No acredita domicilio, catastro ni hechos futuros.

El contrato permanente conserva entrada completa, siete campos de identidad/peso, fixture completo y toda metadata histórica. Sólo permite una observación de esquema cerrado conciliada con el resultado leído. casePre sigue histórico con resultado null. La transacción publicar-inquilino.mjs comprueba el PRE íntegro separado antes de escribir exclusivamente esta observación en casos y observaciones. Requiere integración autorizada y el entorno Nix declarado.

El wrapper declara transporte validado y countedAsMatch=false. El medidor decide la coincidencia comparando la API; no usa flags para contabilizar. La antigua proyección salarial no acredita este slot.

El replay, las adversas y la medición ejecutados conservan 69/80 coincidencias,
72 comparables y tres diferencias de un céntimo. La revisión independiente no
encontró bloqueantes en el vínculo permanente y añadió adversas de presencia,
referencias y separación entre igualdad monetaria y evidencia válida.

La escritura de los dos documentos usa bloqueo cooperativo, comprobación de
preimágenes y rollback ante excepciones; no es atómica frente a una terminación
del proceso o un escritor que ignore el bloqueo. Las pruebas del preparador no
acreditan por sí solas todas las operaciones de escritura del comando.
