# Validación del corte Galicia e historia

La ejecución conjunta sobre raíz pasa 573 pruebas en 14 archivos. Incluye los oráculos independientes deportivos, VI100B, las 12 fronteras racionales nuevas en ambas API, controles de expediente mezclado y las regresiones ELA/E38/D51/composición. No se suman las ejecuciones solapadas de autor y revisión.

El primer intento dejó 571 verdes y dos errores del nuevo fixture combinado: el emisor del reconocimiento deportivo era «Xunta» y el Schema exige «Secretaría Xeral para o Deporte». Se conserva el rojo y se corrige sólo ese hecho de prueba; no cambia producto ni expectativas monetarias.

La corrección privada de precisión había pasado 22 pruebas del revisor y 192 de autor/regresión. Su comprobación de tipos se detuvo por la guardia global de 6 GiB al coexistir con otro control pesado. No se considera aprobada esa ejecución. Los controles del conjunto se ejecutan ahora secuencialmente.

Los tipos globales pasan después de adaptar los helpers de cuatro suites al contrato de importe racional y estrechar el discriminante de la fixture extremeña. Se conservan los 38 diagnósticos iniciales; no se cambian los valores de los oráculos.

Los 31 pasos exactos del workflow pasan con PATH limpio, las versiones fijadas y los mismos comandos Nix. Incluyen lint (18 avisos previos, cero errores), tipos globales, inventario regenerado/verificado, corpus y simuladores. El grupo territorial pasa 5.295 pruebas en 117 archivos, con dos omisiones y dos TODO previos. Las 321 regresiones de los cuatro helpers corregidos también pasan; no se suman al grupo territorial, donde vuelven a ejecutarse.

El primer CI completo se detuvo en una huella técnica anterior. Se conservan el fallo y las nueve huellas anteriores; se actualizan esas rutas revisadas y se añaden tres fuentes nuevas. El segundo CI completo termina correctamente. Se conserva el rechazo de fuentes alteradas y no se promueve ninguna aceptación documental.

La ejecución completa duró 17 minutos y 7 segundos, con pico muestreado de 2,80 GiB en el árbol y 4,86 GiB en el grupo, sin guardias. Los hijos ejecutaron sus límites temporales. [Comandos y resultados](CI-LOCAL.json). Publicación sólo en `procedencia-documental`; el CI remoto se comprueba después del push.
