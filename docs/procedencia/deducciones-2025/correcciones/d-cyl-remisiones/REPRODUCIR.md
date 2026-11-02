# Reproducción

Desde la raíz, sin red, Git ni CAS para las pruebas ordinarias:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 tests/d-cyl-remisiones-documentales.py -v
```

La matriz conserva los campos exportados; `MATRIZ.md` es su lectura por campo y `CONDICIONES.md` explica el efecto de las remisiones por código. Los IDs de cita resuelven literal, localizador y hashes en `citas.json` y `fuentes.json`. Las tres reservas tienen discriminantes explícitos. Ninguna conformidad documental acepta un cálculo automático ni una liquidación individual.

Reextracción local opcional con originales proporcionados expresamente, usando un entorno y caché externos:

```sh
uv run --no-project --with beautifulsoup4==4.15.0 --with pymupdf==2.0 python docs/procedencia/deducciones-2025/correcciones/d-cyl-remisiones/verificar.py --cas "$ORIGINALES_REUTILIZADOS" --cas "$ORIGINALES_NUEVOS"
```

No descarga documentos. En sistemas con bibliotecas nativas aisladas, el entorno debe proporcionar las bibliotecas de ejecución de PyMuPDF. El script verifica ambos hashes y tamaño antes de extraer XML, HTML o páginas PDF. Su conformidad no sustituye la revisión fiscal independiente.

`propuestas-por-codigo.json` incluye preimágenes y hashes de archivos compartidos. No se aplica automáticamente. Una prueba anterior de igualdad descriptiva permanece roja hasta componer las sustituciones de texto propuestas con el catálogo: no debe alterarse su expectativa ni ocultarse ese rojo. El padre ejecutará la CI global después de esa composición.
