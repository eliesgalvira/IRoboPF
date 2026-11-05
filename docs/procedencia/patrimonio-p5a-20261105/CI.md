# CI de patrimonio riojano y etapas monetarias de 2018

Pasan los 31 comandos de `.github/workflows/checks.yml` con PATH limpio y las versiones fijadas: Node 24.20.0, Bun 1.3.13 y Python 3.13.15. Incluye los comandos Nix del trabajo de corpus, generación previa y verificación del inventario. La secuencia prueba que Bun sólo está disponible después de su instalación declarada. Se reproducen comandos y versiones; no se emulan Ubuntu ni las acciones de instalación de GitHub.

La guardia de memoria interrumpió el paso 14 del primer intento. Los trece pasos correctos se conservan con sus hashes; se repiten el 14 y los posteriores con fuentes y comandos idénticos y sin captura concurrente. La interrupción permanece registrada y no cuenta como ejecución correcta.

El paso territorial incorpora las pruebas P5a del autor, el traslado del revisor y los 22 adversos del contraste de residencia. El paso del motor añade las pruebas de etapas, guardas y revisión independiente de 2018. Tipos estrictos/Effect, ambos linters, controles de detección, motor y corpus pasan. Las omisiones preexistentes y las advertencias de ESLint se conservan; no cuentan como pruebas correctas.

Los controles previos de P5a tienen 1.562 pruebas únicas y los de integración de 2018 tienen 809; no se suman a las suites del workflow porque se solapan. El ajuste privado del arnés de tipos de 2018 se limita a resolver las fixtures JSON, sin cambiar código productivo ni esperados oficiales. El contraste de residencia mantiene el alcance 32.2 sin préstamo y 32.11 financiada representada.

[CI.json](CI.json) fija los comandos, duraciones, hashes y memoria. Una suite a la vez, dos CPU, límite temporal global de 45 minutos y guardias de 3 GiB por árbol y 6 GiB por grupo. El CI no acredita hechos fiscales declarados ni todas las ramas del catálogo. La comparación de las 60 entradas de 2018 se repite después de publicar. Las 29 diferencias anteriores y los originales se conservan.

La comprobación remota corresponde al commit publicado después de este informe.
