# CI de productores anuales · 5 de noviembre de 2026

Pasan los 31 comandos de `.github/workflows/checks.yml` con PATH limpio, runtimes fijados y afinidad a dos CPU. Incluyen tipos, ambos linters, canarios, pruebas de motor y corpus, inventario regenerado y sus archivos derivados. Se conservan los 18 avisos de ESLint anteriores. La reproducción proporciona las versiones del workflow; no emula Ubuntu ni las acciones de instalación de GitHub.

El primer intento local se detuvo en R52 por una dependencia nueva de ELA no declarada en el extractor documental. Se conserva ese rojo. La corrección mantiene los productores como contratos externos sin admisión y añade un discriminante de rechazo. El segundo intento detectó una anotación demasiado amplia en el nuevo test, corregida sin modificar sus expectativas. El tercer intento fue detenido por la guardia del grupo compartido durante inventario, con 2,75 GB del árbol y caché acumulada. Tras liberar caché recuperable sin cambiar límites, el cuarto intento repite los 31 pasos completos.

El cierre focal anterior pasa 310 pruebas y conserva dos hipótesis apartadas; las suites del workflow pueden solaparse y no se suman como casos independientes. La primera revisión de cada cambio monetario está recibida y sus hallazgos resueltos dentro del alcance declarado.

Véanse [comandos, tiempos y mediciones](CI.json). Evidencia local previa al push; el estado remoto se comprobará sobre el commit publicado.
