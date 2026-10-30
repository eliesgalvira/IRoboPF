# Comandos reproducibles

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Desde la raíz del checkout. Herramientas de terceros del integrador, solo lectura. Los instrumentos temporales y logs intermedios se conservan en `.cache/flujo-rentas-r36/`. No se ejecutan productores históricos con sus destinos originales.

3. Productor/ensayos: `flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node .cache/flujo-rentas-r36/run.mjs`. Importa runRentasSuite, guarda fragmento gzip, casos y ejecuciones. No escribe en informes recibidos.
4. Schema y rojos: bajo el mismo bloqueo, `node .cache/flujo-rentas-r36/controles.mjs`, que llama writeControls. Seis rangos R25 siguen rojos al contrastar los originales contra las llamadas actuales. No son defectos fiscales.
5. Calidad final: `flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c bash .cache/flujo-rentas-r36/final.sh`. Ejecuta Prettier core; ensayos; controles; Vitest con un trabajador; tsc del test estricto y checkJs de los cuatro MJS; Oxlint con16 reglas a error/un hilo/--disable-nested-config y ESLint. No Next build ni suites legacy. Los primeros fallos se conservan separadamente.
6. Python/schema: `flock /tmp/irobopf-validacion-pesada.lock env PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-3f15a57c/.cache/flujo-rentas-r36/uv-env tools/procedencia/run.sh /home/elies/.t3/worktrees/IRoboPF/t3-3f15a57c/.cache/flujo-rentas-r36/schema.py schemas/procedencia/flujo/rentas-r36.schema.json docs/procedencia/implementaciones/flujo-rentas-r36-sol/fragmento.json.gz`.
7. Transporte: mismo entorno Python, bloqueo pesado y `nix shell nixpkgs#patch -c env ... tools/procedencia/run.sh .../.cache/flujo-rentas-r36/entregar.py`. Aplica patch y binarios en scratch nuevo sin VCS y compara todos los bytes con el manifiesto.

`manifiesto.json` cubre los archivos de carga; patch, catálogo binario, ensayo de transporte, cotejo final y sobre se excluyen de su propia autorreferencia. `ENTREGA.json` fija sus hashes salvo el suyo. Esto es transporte e integridad, sin aceptación fiscal, atestación ni conclusión independiente de suficiencia.

Los instrumentos scratch exactos se preservan como `*.txt` junto al informe (run, controles, calidad, configuración Vitest, schema, cotejo y entrega). Para reproducirlos después de transportar, copiarlos a scratch propio, adaptar únicamente destinos y rutas de imports, conservar ese diff y ejecutar allí. No ejecutar un productor sobre esta carpeta recibida ni actualizar los esperados/rojos. El productor/consumidor mantenidos y el schema tienen sus rutas originales en el manifiesto.
