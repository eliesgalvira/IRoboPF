# Reproducción

Desde la raíz de este checkout. No inicializar JJ ni modificar VCS. Node/Bun se proporcionan por Nix; las dependencias del padre solo se leen. Los instrumentos no escriben Effect nuevo; se consultaron previamente `effect-solutions list`, `show basics testing` y la fuente local DateTime para los contratos de prueba/civil.

Recepción, con un blob cada vez:

```sh
flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#nodejs -c node docs/procedencia/editorial/flujo-rentas-actividad-r23-sol/fisico.mjs
```

El argumento opcional `final` guarda el segundo cotejo. El inicial se conserva; no repetirlo sobre su ruta para simular una recepción anterior.

Construcción, clasificación individual, cotejo de referencias, discriminantes TS real, lint y checkJs del alcance, un trabajador:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bash docs/procedencia/editorial/flujo-rentas-actividad-r23-sol/calidad.sh
```

`calidad.log` registra los códigos; los logs de cada instrumento contienen sus diagnósticos. Se conservan los intentos iniciales fallidos. `tsc` comprueba los instrumentos JS con checkJs; no se atribuye tipado estricto de todo el motor. Oxlint conserva16reglas aerror, `--threads=1 --disable-nested-config`; ninguna regla relajada. No Next build ni suites legacy masivas.

El generador `construir.mjs` es una especificación manual de relaciones; el AST localiza símbolos y argumentos, no descubre causalidad por contención. `completar.mjs` añade escrituras efectivas, contrato civil y predicados de dominio. `terminales.mjs` clasifica cada ocurrencia histórica y conserva los selectores. `verificar.mjs` coteja bytes/rangos y referencias de grafo y comprueba exclusiones de causalidad. `actividad.mjs` y `discriminantes.mjs` compilan TS real en memoria; sus importaciones usan el padre solo después de cotejar los hashes de las fuentes explícitamente cargadas. Las fuentes no cargadas directamente se toman de las dependencias locales de ese padre: es un límite de reproducibilidad, no una copia del motor mantenida aquí.

Entrega por archivos, después de los cotejos:

```sh
nix shell nixpkgs#nodejs -c node docs/procedencia/editorial/flujo-rentas-actividad-r23-sol/entregar.mjs
```

El manifiesto excluye solo manifiesto/patch/mapa binario, que son metadatos autorreferentes. Los controles mayores de1MB se comprimen y el patch contiene los textos UTF8; el mapa binario identifica los gzip por ruta/hash. Sin commit, push, PR, cambios de motor o confianza.
