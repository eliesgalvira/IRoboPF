# Reproducción

Reproducción desde la raíz del repositorio, con Node/Bun de Nix y las dependencias locales fijadas por los instrumentos.


Construcción, clasificación individual, cotejo de referencias, discriminantes TS real, lint y checkJs del alcance, un trabajador:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bash docs/procedencia/editorial/flujo-rentas-actividad-r23-sol/calidad.sh
```

`calidad.log` registra los códigos; los logs de cada instrumento contienen sus diagnósticos. Se conservan los intentos iniciales fallidos. `tsc` comprueba los instrumentos JS con checkJs; no se atribuye tipado estricto de todo el motor. Oxlint conserva16reglas aerror, `--threads=1 --disable-nested-config`; ninguna regla relajada. No Next build ni suites legacy masivas.

El generador `construir.mjs` es una especificación manual de relaciones; el AST localiza símbolos y argumentos, no descubre causalidad por contención. `completar.mjs` añade escrituras efectivas, contrato civil y predicados de dominio. `terminales.mjs` clasifica cada ocurrencia histórica y conserva los selectores. `verificar.mjs` coteja bytes/rangos y referencias de grafo y comprueba exclusiones de causalidad. `actividad.mjs` y `discriminantes.mjs` compilan TS real en memoria; sus importaciones usan las dependencias locales solo después de cotejar los hashes de las fuentes explícitamente cargadas. Las fuentes no cargadas directamente se toman de las dependencias locales del repositorio: es un límite de reproducibilidad, no una copia del motor mantenida aquí.
