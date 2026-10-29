# Comprobaciones de recepción

El instrumento de recepción del padre queda en `.cache/orquestador-recepcion/r20/recibir.py` durante la sesión. Comprueba HEAD y diff de la base, recorre `git ls-tree -rz` y compara cada blob mediante `git cat-file --batch` con los bytes físicos o `readlink`, sin escrituras VCS. Para la entrega aplica SHA-256/tamaño, rutas del ámbito, baseSha256 nulo, IDs únicos y ausencia de archivos no declarados excepto el propio manifiesto. Copia nueve originales al CAS externo y coteja de nuevo bytes/SHA-512. Los resultados por archivo están preservados en los dos recibos JSON.

El primer pase usó `flock /tmp/irobopf-validacion-pesada.lock`; el segundo `flock /tmp/irobopf-recepcion-acotada.lock`, ambos con `nix shell nixpkgs#python3 -c python3`. La espera global motivó la excepción de D063. La tentativa intermedia de retirar solo el proceso propio terminó con una aserción de lista vacía: no se canceló ningún proceso. Ambos pases completos terminaron con salida 0; no hay doble cómputo.

Se inspeccionaron el informe, los comandos, los logs finales del autor y las matrices: 80 IDs y 44 ramas únicos con aceptación false, 187 entradas de página y de cita. No se repitieron aquí los programas del autor que escriben resultados en su carpeta, ni se anuncia una ejecución del motor. La revisión nueva debe ejecutarlos en scratch y contrastar semántica y primarios.
