# Puerta de privacidad de publicación

`scripts/publication_guard.py` inspecciona contenido y metadatos antes de publicar.
No modifica archivos, originales ni sellos CAS. Un hallazgo, un formato no
soportado, una herramienta ausente o un límite de inspección bloquean la salida.

La configuración privada se proporciona desde fuera del repositorio. Nunca se
versiona: contiene los patrones locales y los identificadores que no deben
aparecer en el proyecto público. La variable `PRIVATE_PUBLICATION_POLICY` debe
apuntar al archivo externo entregado por el responsable de publicación.

```sh
timeout -k 30s 5m nix develop path:tools/procedencia#publication --command \
  python3 -B scripts/publication_guard.py \
  --policy "$PRIVATE_PUBLICATION_POLICY" \
  --base "$AUDITED_BASE" --revision "$CANDIDATE_COMMIT"
```

La base debe ser un commit previamente auditado del historial público vigente.
El candidato debe descender de ella sin fusiones. Se comprueban **todos** los
commits nuevos, incluso archivos borrados después, mensajes, rutas, autor y
committer. Ambos deben usar `IRoboPF <irobopf@users.noreply.github.com>`.
La comprobación no sustituye el CI ni autoriza publicar un historial anterior.

Para una auditoría completa se omite `--base` y se repite `--public-ref` con
cada rama y etiqueta que vaya a publicarse. Por ejemplo:

```sh
timeout -k 30s 5m nix develop path:tools/procedencia#publication --command \
  python3 -B scripts/publication_guard.py \
  --policy "$PRIVATE_PUBLICATION_POLICY" \
  --public-ref refs/heads/procedencia-documental
```

Esta modalidad recorre todas las versiones de los archivos y verifica también
las etiquetas anotadas, sus mensajes y la identidad del tagger. No enumera
ramas privadas por defecto. Los nombres de referencias deben ser explícitos.

## Superficies y límites

Se aplican todos los patrones externos, incluidos los de hogar, hardware,
copias, credenciales y datos personales. Se normalizan Unicode, camelCase,
escapes y codificación URL. Se inspeccionan transportes base64 reconocibles,
incluido el plegado MIME, gzip, bzip2, xz, zlib, ZIP y TAR recursivos. Los ZIP
incluyen los documentos OOXML, sus propiedades y recursos interiores. Se
comprueban nombres de entradas y cabeceras; los enlaces y los contenedores
cifrados se rechazan.

Las cabeceras y comentarios admitidos se inspeccionan recursivamente. Los
campos extra ZIP no admitidos, los directorios con carga y los bytes sobrantes
tras un contenedor bloquean la publicación; no se omiten silenciosamente.
Se verifican tanto las cabeceras ZIP locales como las centrales. Los huecos y
descriptores de streaming no admitidos también se rechazan.

Los PDF requieren extracción de texto, metadatos y OCR de todas sus páginas.
Los adjuntos PDF se rechazan expresamente. PNG y JPEG requieren metadatos y
OCR; las imágenes con datos añadidos, miniaturas incrustadas o contenedores
políglotas se rechazan. Las imágenes animadas y formatos
multipágina no admitidos quedan bloqueados, al igual que otros binarios sin
lector. El entorno Nix fija los extractores. La salida sólo identifica
hallazgos mediante hashes y reglas, sin reproducir valores ni rutas sensibles.

La auditoría completa rechaza clones superficiales. Los archivos partidos
requieren `--splits` con un manifiesto externo: nombre
del conjunto, lista ordenada `parts` y `sha256` del contenido recompuesto.
Se inspecciona el conjunto; las partes reconocibles sin manifiesto bloquean.
No se aceptan conjuntos incompletos ni una identidad distinta de la declarada.

Hay límites de profundidad, tamaño, volumen total, páginas, memoria y tiempo
por extractor. Alcanzarlos significa **inspección incompleta y rechazo**.
La terminación incluye el grupo de procesos del extractor.

Ningún detector automático demuestra por sí solo que una cifra o un nombre
desconocido sea sintético. La revisión independiente debe comprobar la
procedencia de datos fiscales, documentos e imágenes y descartar información
real, contenido oculto y formatos deliberadamente ofuscados. Un OCR sin
hallazgos no constituye autorización para publicar una declaración real.

## Excepciones

`--exceptions` recibe una lista de autorizaciones revisadas. Cada entrada
requiere `path`, `sha256`, `kind`, `rules`, `justification` y `evidence`.
Sólo se admiten `synthetic-fixture` y `official-uuid`. Una modificación de
contenido invalida la excepción. No hay permisos por directorio o por glob.
No se pueden eximir credenciales, rutas personales, máquinas ni identificadores
privados conocidos.
Las reglas del archivo privado nunca pueden recibir una excepción. Las
autorizaciones sólo afectan a los detectores genéricos expresamente admitidos.
Sus evidencias deben ser públicas y no contener los propios datos privados.
Los UUID oficiales deben acreditarse
en su fuente; los fixtures deben ser inventados y estar documentados como tales.

El CI ejecuta `tests/publication_guard_test.py` con una política exclusivamente
sintética, extractores reales y casos adversos. No recibe la configuración
privada. Antes de publicar se ejecuta además la puerta con la política privada
vigente, se revisa el diff preparado y se exige el CI completo del candidato.
