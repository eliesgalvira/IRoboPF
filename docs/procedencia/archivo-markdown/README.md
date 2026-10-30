# Versiones documentales conservadas

Los Markdown de procedencia se mantienen como documentación legible. Las versiones anteriores citadas por manifiestos, recibos o pruebas siguen disponibles en este archivo, sin reescribir aquellas referencias históricas ni alterar su significado.

[limpieza.json](limpieza.json) enumera todos los archivos revisados, cuáles cambiaron y sus hashes anteriores y actuales. Para cada archivo modificado, `previousObject` contiene un gzip del texto anterior exacto; el nombre del objeto es el SHA-256 de los bytes descomprimidos. También se conserva el commit de origen. Los documentos con evidencia activa que exige sus bytes exactos permanecen en su ubicación original.

Un manifiesto histórico describe su versión fijada, no necesariamente el Markdown editable actual. Para reproducirlo debe usarse el objeto anterior o el commit indicado. Los originales oficiales, los datos de pruebas y los archivos de `.cache/` quedan fuera de esta limpieza. La conservación de bytes no amplía ninguna aceptación fiscal.
