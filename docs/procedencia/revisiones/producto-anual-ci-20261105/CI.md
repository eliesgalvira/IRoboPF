# CI previo a publicar deducciones y variantes Open 2025

Los 31 comandos de `.github/workflows/checks.yml` pasan en reproducción local con PATH limpio, Node 24.20.0, Bun 1.3.13, Python 3.13.15 y el entorno Nix fijado del corpus. Se ejecutan los mismos comandos y en el mismo orden de cada job; no se emula Ubuntu ni la descarga de las acciones de instalación. Los pasos duran 201.5 segundos en checks y 431.8 en corpus, por debajo de los 15 minutos de cada job.

El registro contiene 3335 ejecuciones Vitest y 247 métodos Python; puede haber casos repetidos entre suites. Se conservan los TODO de productores ausentes y las omisiones explícitas de originales privados. Tipos y lint pasan, con los 18 avisos existentes. El inventario y su reconstrucción en otra raíz pasan. [Comandos, duraciones y hashes](comandos.json).

El primer intento local falló al leer el inventario ampliado: 154.522.282 bytes descomprimidos superaban el límite de 128 MiB. Antes de publicar se fijó un techo de 256 MiB tanto en el productor como en ambos lectores y se regeneró el artefacto. Se repitieron los 31 pasos completos; el intento fallido se conserva en el respaldo del corte. No hubo push de ese intento.

Este corte integra A40H12 y B37 en ambas API, las ampliaciones aisladas corregidas E38/D51/C36, los dos contratos aragoneses y las variantes Open 2025. Los hallazgos graves E01/E02 ya tienen contraste favorable. La revisión C2025 fue documental y preparó 15 tests que ejecutó después el padre, junto con dos rojos nuevos corregidos; no se atribuye esa ejecución al revisor. Las conexiones anuales E38/D51/C36/F y la corrección histórica siguen fuera de este corte.

La rama de destino exclusiva es `procedencia-documental`. El resultado remoto se comprobará tras el push; la reproducción local no se presenta como resultado de GitHub.
