# CI de los auxiliares exactos · 5 de noviembre de 2026

Los 31 comandos de `.github/workflows/checks.yml` pasan localmente con PATH limpio, versiones Node 24.20.0, Bun 1.3.13 y Python 3.13.15, y los comandos Nix del trabajo de corpus. El inventario está regenerado y verificado. Se incluyen las pruebas de filiación y el contraste independiente en el paso de deducciones. La reproducción conserva la secuencia de instalación del PATH; no emula Ubuntu ni las acciones de instalación de GitHub.

El primer intento local detectó identidades antiguas en el contrato documental F. Se conserva ese fallo; se actualizan únicamente seis fuentes F revisadas y la regresión R30 verifica los cuerpos concretos sin aceptación fiscal automática. El segundo intento repite los 31 comandos completos. Tipos, ambos linters, canarios, pruebas de motor y corpus, contratos e inventarios terminan correctamente. ESLint conserva los 18 avisos anteriores. Las suites pueden solaparse en sus casos y no se suman como pruebas distintas. Los dos casos de maternidad apartados previamente no se cuentan como verdes.

Las ejecuciones locales usan dos CPU, un worker por suite y una guardia de 3 GiB para el árbol propio y 6 GiB para el grupo. Las mediciones, comandos y hashes figuran en [CI.json](CI.json). Primera revisión monetaria y contraste del hallazgo grave recibidos; no se atribuye cierre de todos los supuestos de Madrid, Murcia ni 2025.

Este registro acredita el control local previo al push. El CI remoto se comprueba después sobre el commit publicado.
