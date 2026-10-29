# Comandos y límites de reproducción

Ejecutados desde `/home/elies/Repos/IRoboPF`. Todos los scripts auxiliares están en `.cache/procedencia/retenciones-2020-2026/`; no forman parte del motor. No se escribieron archivos de otros auditores. Las adquisiciones se serializaron mediante `tools/procedencia/descargar.py`, con User-Agent IRoboPF, lock compartido y espera del helper. No se realizaron descargas paralelas propias.

Python estándar, por ejemplo:

```sh
nix shell nixpkgs#python3 -c python .cache/procedencia/retenciones-2020-2026/ejemplos.py
nix shell nixpkgs#python3 -c python .cache/procedencia/retenciones-2020-2026/excel.py
nix shell nixpkgs#python3 -c python .cache/procedencia/retenciones-2020-2026/bordes.py
nix shell nixpkgs#python3 -c python .cache/procedencia/retenciones-2020-2026/regularizacion_ejemplos.py
nix shell nixpkgs#python3 -c python .cache/procedencia/retenciones-2020-2026/salto43.py
nix shell nixpkgs#python3 -c python .cache/procedencia/retenciones-2020-2026/verificar_tablas.py
```

PyMuPDF se ejecutó con Python y biblioteca de Nix. No se instaló globalmente:

```sh
LD_LIBRARY_PATH=/nix/store/3b7njvjfc2w5lhj1jklrsw4lq7nwypri-gcc-15.2.0-lib/lib nix shell nixpkgs#python3 -c bash -c 'uv run --python "$(command -v python3)" --with pymupdf python .cache/procedencia/retenciones-2020-2026/verificar_citas.py'
```

La ruta de libstdc++ es la de esta máquina y debe resolverse de nuevo si se reproduce en otro entorno. El intento inicial con Python descargado por uv falló por el enlazador de NixOS; la primera carga de PyMuPDF con Python Nix falló por libstdc++ ausente. No se ocultaron esos fallos: la combinación anterior permitió la extracción.

`adquirir.py`, `normas.py`, `normas_comunicacion.py` y `normas_finales.py` adquirieron originales; `extraer.py`, `complemento.py`, `extraer_comunicacion.py` y `extraer_finales.py` produjeron bloques. `tablas_exactas.py` y `escalas.py` delimitaron celdas/filas. `sanear.py` elimina cabeceras de sesión recursivamente de los JSON publicables. `hallazgos.py`, `enlazar_legal.py`, `cobertura.py` y `finalizar.py` produjeron la primera composición, complementada por `objeciones.py`, `enlazar_inventario.py` y `cerrar_documentos.py` y la edición documental final. No ejecutar estos generadores sobre la entrega revisada sin comparar el resultado: algunos son etapas intermedias y no un pipeline idempotente de publicación.

El libro Excel se abrió con `zipfile` y `XML.iterparse`, conservando solo filas/celdas seleccionadas. No se cargó completo en memoria. Los cálculos Decimal son reconstrucciones independientes, no ejecuciones del motor TS.

`verificar_citas.py` reabre los originales, verifica SHA-256 y compara texto literal de cada caja con el candidato. `verificar_tablas.py` comprueba orden geométrico de las 117 celdas y secuencia de las 77 filas. `verificar_entrega.py` verifica campos, referencias, SHA-256/SHA-512/tamaño de originales y ausencia de cabeceras de sesión, sin imprimir sus valores.

Se usó `nix shell nixpkgs#ripgrep -c rg` para búsquedas y `diff -u` para comparar en lectura los dos archivos modificados concurrentemente con el checkout del inventario. El código 1 de `diff` significa diferencias, no un fallo de lectura. Las diferencias son tres guardas `typeof` sustituidas por predicados Match y un test de entradas malformadas. No se ejecutó Git CLI, no se inicializó JJ, ni se realizaron commits, push, bookmarks, reparaciones de índice, builds o suites legacy. La única operación VCS fue lectura con `jj log` al comienzo. No hay TypeScript nuevo que someter a anti-slop.

La primera comprobación de tablas detectó la palabra del encabezado «hasta» dentro de dos cajas de la primera fila de escala (2021 v2 y 2022). `ajustar_dos_filas.py` las sustituyó por cuatro cajas de celda, ajustando el borde superior de la tercera por solapamiento de cajas tipográficas, y reextrajo ambas citas. El control completo de citas y el control específico de esas dos correcciones se conservan separados. No se cambió el texto original ni su hash.

La primera pasada completa verificó 14.203 citas sin diferencias de texto, pero emitió 1.400 alertas de geometría al comparar coordenadas sin rotar con dimensiones visuales. `normalizar_coordenadas.py` declara ambas convenciones, transforma las cajas visibles de 1.520 citas de páginas rotadas y recorta/reextrae 84 bloques que excedían algún borde. El control final no presenta errores de texto o de límites. `verificar_citas.py` utiliza ahora `extractionBoxes` para texto y `boxes` para geometría visual, por lo que puede reproducir la entrega corregida. El informe inicial se conserva como historial del fallo, no como resultado final.
