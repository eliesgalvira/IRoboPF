# Recetas y límites

Raíz: `/home/elies/.t3/worktrees/IRoboPF/t3-8e772810`. No inicialización JJ ni mutaciones Git/JJ. Las lecturas Git son `rev-parse HEAD`, `ls-tree -rz BASE`, `cat-file blob OID`, `diff BASE --`. El control físico procesa un blob cada vez; incluye lstat y readlink. Base exacta en control.py.

El control inicial estándar se ejecutó con `flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#python3 -c python3 .../control.py inicial`. No dependencias gestionadas en ese script estándar. El pase final usa el wrapper pedido. Solo para recepción acotada; no renders, suites o tipos bajo ese lock.

Para los demás programas Python:

```
flock /tmp/irobopf-validacion-pesada.lock env \
  PYTHONDONTWRITEBYTECODE=1 \
  UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-8e772810/.cache/contraste-1214/venv \
  bash tools/procedencia/run.sh docs/procedencia/revisiones/retenciones-2012-2014-contraste-sol/preparar.py
```

Sustituir último archivo por `contrastar.py`, `finalizar_controles.py`, `decidir.py`, `casos_propios.py`, `auditar_bandas.py` y `paquete.py` según operación. Un solo trabajador; comandos secuenciales. Los dos programas del autor se copian con bytes idénticos a scratch y se ejecutan allí, nunca en su carpeta original. Repetición.json coteja tres salidas, incluidos los44fixtures. Ninguna copia de aplicación ni entorno en la entrega.

preparar.py verifica ambos hashes/tamaño de referencias, lee originales por mapas, reextrae187páginas y reproduce PNG95dpi. PyMuPDF1.26.7 fijado por el wrapper. Recortes10/16: matriz2, alphaFalse, cajas exactas en el script. No OCR. El mismo render que coincide en bytes puede conservar una extracción defectuosa del signo: lectura personal aparte.

contrastar.py conserva un primer diagnóstico incorrecto de bandas comparadas con página completa; finalizar_controles.py usa sus cajas. auditar_bandas.py prueba también ordenación y textbox, sin normalizar ni sobrescribir citas. Los resultados no coincidentes se conservan y no se convierten en citas válidas por coincidencia del número.

CalidadPython: Nix proporcionaRuff yMypy, con `--check-untyped-defs` y seguimiento de imports no anotados. Los logs distinguen intentos de entorno de comprobaciones finales; no se cambia una prueba fiscal por una regla de lintTS. El formato se aplica solo a scripts propios, nunca a scratch recibido. No hay códigoTypeScript,Effect oRust nuevo; no se ejecuta compilador ajeno a este alcance. Las16reglasanti-slop continúan aerror en la configuración base. No Nextbuild ni suiteslegacy.

Búsquedaweb de descubrimiento: consultas `site.petete.tributos.hacienda.gob.es "600" "más de dos descendientes" "pensiones" retención` y BOE histórico. No resultadoDGT histórico discriminante. Los resultadosconsolidado2026/algoritmo2024/manual2025 se descartan para resolver2012–2014. No se adquieren blobs nuevos ni se transforma esa búsqueda negativa en inexistencia de criterio.

paquete.py produce transportes sin commit: manifiesto relativo conSHA256/size/baseSha256, texto gzip y binarios por ruta/hash. No incluye a sí mismo el manifiesto para evitar ciclo. El parche se identifica en manifiesto; binarios.json no se referencia circularmente a sí mismo. El control final de base debe preceder al empaquetado.

Resolución del diagnóstico de bandas: las72coinciden byte a byte con `Page.get_textbox(bbox)`; las diferencias del método clip son espacios y saltos, conservadas en diagnostico-bandas.json. No son72defectos del corpus.
