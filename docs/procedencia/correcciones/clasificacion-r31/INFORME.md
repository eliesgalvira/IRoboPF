# Clasificación contextual de origen y documento

CL01 puntual queda corroborado: la selección real ya no se confunde con el documento contiguo. Las dos reservas nuevas son distintas y requieren corregir el clasificador actual, sin modificar el paquete congelado.

RC30-01 queda confirmado. `sourceSha256` identifica una procedencia, no necesariamente código. El productor editorial `flujo-escalas-r21-sol/verificar.py` calcula la huella de `entry.source`; cuatro referencias reales apuntan a JSON editorial. El recolector calcula también esa huella antes del saneamiento de dependencias arbitrarias. Los dos casos sintéticos de origen documental o indeterminado no justifican `fuente-software`.

RC30-02 queda confirmado en su dominio sintético: `documentSha256` dentro de `/facsimiles/0` refiere al documento de un recorte, no al PNG. Es un límite anterior conservado por R30; no se presenta como un defecto introducido allí ni se afirma que todos los documentos del corpus usen esa forma.

## Corrección acotada

La política pasa a `v5-r26-clasificacion-r31`. Los campos exactos `sourceSha256` y `sourceHash`, normalizados, usan un contrato estrecho de contexto. Una ruta de origen explícita prevalece sobre la de destino; valores inválidos o distintos, rutas no relativas, tipos contradictorios o formas no admitidas dan desconocido. El subconjunto de extensiones de código admite MIME vacío o texto plano; PDF identificado da desconocido-documental, incluso junto a una URL oficial. No se atribuye autenticidad ni recuperación de bytes a esa URL. JSON editorial permanece desconocido, con su referencia disponible para resolver su significado después. Un nombre como `resourceSha256` ya no hereda software por contener el substring source.

Los campos documentales explícitos se resuelven antes del ancestro de facsímil. El hash genérico de un recorte conserva su contexto; no se promueve a original por la URL del documento que lo rodea. Las otras reglas del clasificador siguen siendo candidatas y no reciben aprobación semántica general por esta corrección.

El registro de observación conserva ahora los campos de origen utilizados para la inferencia, pasados por el saneador existente. Una prueba previa demuestra que ese contexto antes se omitía. Esto permite inspeccionar la decisión sobre los datos declarados; no restaura valores eliminados por privacidad ni certifica la política de saneamiento.

Decisión: preferir desconocido cuando el contrato de origen no basta. Objeción experta: una extensión o MIME declarado puede mentir y varios campos pueden corresponder al resultado, no al origen. Respuesta: mantener la categoría como inferencia contextual candidata, priorizar el origen explícito, rechazar conflictos y no usarla como autoridad jurídica ni autorización de publicación. Coste: más observaciones sin resolver y un contrato estrecho que no cubre todos los MIME o nombres de campo posibles.

Decisión: separar campo documental y contenedor de recorte. Objeción: poner siempre la URL primero volvería a clasificar PNG o texto como original. Respuesta: solo las formas documentales explícitas tienen esa prioridad; selección, texto, software declarado y hash genérico conservan sus contratos separados. Coste: mantener reglas y pruebas de conflicto, sin prometer una taxonomía universal.

## Pruebas y límites

Se reejecutan las 22 sondas del revisor con sus esperados intactos: antes hay tres rojos; después, ninguno. Las pruebas nuevas de integración fallan en doce de catorce casos antes del cambio; una prueba adicional de conservación de contexto falla también. Después pasan las quince, incluidas las cuatro referencias editoriales reales con su hash comprobado. Pasan además las diez regresiones R30 y las veintiocho de preservación. Los recuentos se solapan en garantías; no son reglas fiscales validadas.

Ruff pasa sobre el alcance Python; mypy comprueba cuatro fuentes con `check-untyped-defs` y `follow-imports=silent`. No se presenta como tipado estricto del corpus JSON ni como revisión independiente. No cambia código TS/Effect, cálculo fiscal, inventario, snapshots o confianza, por lo que no se repiten build, suites legacy ni regeneración de contenido.

La verificación de integración coteja ambos hashes y tamaño del manifiesto v5 r2 y del recolector histórico conservado. Este mantiene la política `v5-r26-1`. No se reexporta ni reclasifica el corte R26, ni se repite una restauración de 2 GB. Los dos residuales de privacidad —localizador dentro de prosa y FILE://— siguen abiertos; no hay certificación de anonimización ni distribución autorizada.
