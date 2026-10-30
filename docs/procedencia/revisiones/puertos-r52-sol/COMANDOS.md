# Reproducción

Desde el checkout fijado, con dependencias del padre en lectura. Los originales, adaptaciones y configs ejecutadas están en el payload bajo `.cache/puertos-r52-sol/`; no ejecutar scripts del padre que escriban fuera de ese destino. Las rutas absolutas están fijadas en las configuraciones. `preparar.py` comprueba los CAS y prepara copias anteriores/actuales; `harness.mjs` es el preparador R47 con destino adaptado.

```sh
nix shell nixpkgs#python3 -c python3 .cache/puertos-r52-sol/preparar.py
nix shell nixpkgs#nodejs -c node .cache/puertos-r52-sol/harness.mjs
nix shell nixpkgs#python3 -c python3 .cache/puertos-r52-sol/validar.py rojos-antes '.cache/puertos-r52-sol/antes/*.test.ts'
nix shell nixpkgs#python3 -c python3 .cache/puertos-r52-sol/validar.py actual '.cache/puertos-r52-sol/actual/*.test.ts' '.cache/puertos-r52-sol/padre.test.ts' '.cache/puertos-r52-sol/independiente.test.ts'
nix shell nixpkgs#python3 -c python3 .cache/puertos-r52-sol/validar.py regresiones tests/flujo-escalas-r36.test.ts tests/flujo-rentas-r36.test.ts
bash .cache/puertos-r52-sol/calidad.sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun -c bun .cache/puertos-r52-sol/artefactos.mjs
```

Cada comando de validar.py envuelve Vitest en flock, usa configLoader native, config propia, reporter JSON y outputFile propio; los archivos *-comando.json fijan invocación/env include y salida. El rojo anterior termina 1 con cinco fallos esperados. Un pase completo con el instrumento final debe terminar 0; actual.json conserva el primer intento real (dos errores propios), sin reemplazarlo por un verde ficticio.

Repeticiones focalizadas realmente ejecutadas: con REVIEW_INCLUDE='[".cache/puertos-r52-sol/independiente.test.ts"]', mismo comando Vitest del wrapper y `-t 'SOL-02|SOL-03'` para ajuste.json; `-t 'SOL-01|SOL-06'` para complemento.json; `-t SOL-07` para autonomica.json y autonomica-ajuste.json. Cada ejecución adquiere/libera su lock y conserva el log homónimo. Los archivos de primer/segundo/tercer intento y el de autonómica conservan las fuentes de esos intentos; ajuste-instrumento.diff compara primer intento con fuente final.

Tipos: tipos.mjs usa TypeScript instalado del padre, tsconfig real, host virtual para dependencias y preparador, incremental:false para evitar escribir tsbuildinfo; salida tipos.json. El primer log registra cuatro errores; el segundo dos; tipos-final.log/calidad.txt recogen el final. Oxlint usa plugins byte idénticos del padre y las dieciséis reglas a error, no-ignore para incluir explícitamente los cuatro TS de scratch. lint.log conserva el fallo inicial por dos parámetros object; lint-final.log termina 0. La configuración temporal no desactiva reglas.

```sh
nix shell nixpkgs#python3 -c python3 .cache/puertos-r52-sol/transportar.py
flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#python3 -c python3 .cache/puertos-r52-sol/fisico.py
```

transportar.py exige destinos nuevos: no borra ni sobrescribe transportes históricos. La reconstrucción se efectúa solo desde patch/objetos, sin copia del origen. Para una recepción nueva, aplicar patch -p0 descomprimido en un directorio independiente autorizado, materializar BINARIOS desde objetos y restaurar modos de MANIFIESTO; cotejar su lista exacta. fisico.py verifica una entrada/blob cada vez mediante cat-file --batch con petición/respuesta secuencial, y escribe el recibo terminal separado. No ejecutar el cotejo terminal otra vez sobre el mismo recibo: su propio censo explica que aún no existía durante la entrega original.
