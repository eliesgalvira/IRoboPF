# Revisión independiente de privacidad Markdown

**Los dos rojos históricos quedan corregidos, pero el fix introduce una regresión de recorte en otros destinos Markdown válidos. Dictamen desfavorable acotado a ese límite.** No se modifica producto, pruebas recibidas ni dictámenes ajenos. No se reabre E, fechas nulas ni la auditoría regional, ni se infiere aceptación fiscal. La eliminación de compatibilidad de fichas/API no cambia la exigencia de privacidad.

Base y HEAD comprobados: `9062620236b51cbaacff22f3aa8106700751d6ef`. Se revisa el fix `58644b0433d0bb62ec955bccd64bd69f7b8b4e52`; los bytes actuales de sus tres archivos coinciden con ese commit. El anterior se obtiene de su padre `c95de0b34b8807ab6b89d8e028faf697ece697ae` mediante `git show`, en scratch privado, sin checkout ni mutación VCS.

## Defectos históricos

Las pruebas URL de correcciones A/E se ejecutaron sin alterar su aserción histórica: dos URL directas rechazadas, dos enlaces Markdown admitidos, aserción satisfecha y salida 1 deliberada. El verificador actual rechaza esos mismos cuatro casos. Para ambos defectos históricos, el dictamen es **corregido**. Las 49 regresiones actuales pasan.

## Hallazgo reproducido: recorte prematuro del destino

**Severidad media. Alcance: privacidad de reservas en prosa, en `destino_url_en_texto` de `scripts/procedencia/deducciones-2025/verificar.py`.** El primer cierre sin apertura previa termina el candidato incluso cuando pertenece al destino: Markdown permite paréntesis sin balancear dentro de destinos entre ángulos y cierres escapados en destinos ordinarios. El recorte descarta la query posterior antes de comprobar sus nombres sensibles. Se esperaba rechazo; el paquete A con esa reserva se admite.

[Casos reproducibles](casos.py) ejercita el paquete completo sin modificar sus fixtures; solo imprime identificadores y resultados, nunca valores sospechosos. [Control de sintaxis](sintaxis.py) confirma con el parser CommonMark independiente que los cuatro enlaces contienen realmente el parámetro sensible en su destino. Todos usan nombres sensibles vacíos y dominios sintéticos, sin credenciales reales.

| Caso | Esperado | Anterior al fix | Actual |
| --- | --- | --- | --- |
| limite-0-angular | Rechazar | Rechaza | Admite |
| limite-1-angular | Rechazar | Rechaza | Admite |
| limite-0-escapado | Rechazar | Admite | Admite |
| limite-1-escapado | Rechazar | Rechaza | Admite |

Tres variantes regresan respecto al anterior; la cuarta ya era residual. Son manifestaciones de un único problema de límites, no cuatro defectos independientes. El fix debe conservar el destino real al reconocer escapes y destinos angulares antes de analizar las credenciales. No se propone ni aplica código en esta revisión.

## Controles y límites

De 36 casos propios, 32 pasan y cuatro fallan con el verificador actual. Pasan los cierres ordinarios, paréntesis balanceados, enlaces adyacentes, puntuación después del enlace, nombre de query codificado y cinco nombres sensibles vacíos. Se admiten URL documentales inocuas, incluida una dirección BOE con identificador público, texto que menciona nombres de parámetros y una query que contiene ese nombre como valor inocuo. No se etiqueta ese texto como secreto. Estas pruebas no descargan ni verifican el contenido jurídico de las URL.

Los rechazos comprobados emiten exclusivamente los diagnósticos genéricos previstos y no revelan destinos ni valores recibidos. Los cuatro casos admitidos no emiten un diagnóstico de privacidad: el problema es la aceptación, no una filtración reproducida por el mensaje. No se afirma que exista una credencial real filtrada ni que se cubran todas las formas de Markdown o de URL.

Reproducción desde la raíz con Nix y uv: ejecutar `casos.py` con Python 3.13 y `jsonschema==4.26.0` (salida esperada actual: 1, cuatro fallos), y `sintaxis.py` con `markdown-it-py==4.0.0` (salida 0). Para las regresiones recibidas se usa el comando Nix+uv prescrito, con `REVIEW_TMP` privado externo. Ruff pasa sobre los dos Python nuevos. El binario Ruff descargado por uv no pudo arrancar en NixOS; se ejecutó correctamente el proporcionado por Nix.

La entrega pública contiene solo este informe y las dos pruebas pequeñas. Transporte, logs, exportación anterior, patch y manifiesto SHA256 por archivo permanecen privados. Se cotejan los 15.396 archivos versionados físicamente antes y después, además de HEAD y altas nuevas; el patch se reconstruye desde la ausencia de estos tres archivos en la base, sin checkout. No hay modificación ni baja de archivos previos, ni alta fuera de esta carpeta. No se exige repetir ninguna revisión favorable anterior; queda pendiente corregir el único hallazgo de límites descrito.
