# Recursos de ejecución y entregas

Cada orden de prueba o script lleva un límite externo, por ejemplo
`timeout -k 30s 20m`. El límite alcanza también sus procesos hijos. Una ejecución
interrumpida no cuenta como aprobada.

El máximo es de dos suites pesadas simultáneas en toda la máquina, contando las
de todos los subagentes. El orquestador asigna los turnos y cada agente ocupa
como máximo uno. La memoria utilizable es de 11 GiB; las protecciones del
sistema no sustituyen estos límites.

Una entrega es un commit o un parche más su manifiesto. No contiene copias
completas del repositorio, entornos virtuales, `node_modules` ni cachés. Se usa
una sola caché compartida de Python mediante `UV_CACHE_DIR`, y la caché de bun
por defecto del usuario. Las dependencias se instalan fuera de las entregas.

La suma de copias y worktrees del proyecto debe permanecer por debajo de
150 GB. Tras comprobar la integración y publicación en `procedencia-documental`,
se retiran la carpeta de entrega y su worktree con rutas absolutas explícitas,
sin globs. Antes se preservan los originales y cambios únicos que todavía
hagan falta. Los candidatos pendientes pueden conservarse como parches y
manifiestos sin mantener una copia completa de trabajo; esto no los acepta
ni los integra.

Cada brief de subagente debe incluir estas reglas. No se crea un repositorio
Jujutsu dentro de un worktree Git generado por T3. Los registros privados de
limpieza permiten recuperar archivos por hash y commit, distinguen lo cotejado
de lo efectivamente eliminado y no se publican con las evidencias fiscales.
