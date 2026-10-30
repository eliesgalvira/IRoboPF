# Reproducción acotada

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Usar un checkout preparado por T3 de HEAD `846f25e183ba07414065d4e6bdf9e98311b98a17` con los archivos de esta propuesta aplicados por transporte. No crear un checkout en shell. No ejecutar sobre registros activos. Los originales permanecen en v5 r2 raíz, con el pin de raiz-durable.json; no se escribe en ese paquete. La raíz node_modules compartido se usa para resolver dependencias, sin instalación.

## Restaurar el snapshot entregado

El instrumento rechaza una raíz scratch ya existente: no sobrescribe un resultado recibido. Desde la raíz del checkout, copiar restaurar.mjs.txt a `.cache/incorporacion-lote-r32/restaurar.mjs` y ejecutar:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c env NODE_PATH=/home/elies/Repos/IRoboPF/node_modules bun .cache/incorporacion-lote-r32/restaurar.mjs
```

El instrumento comprueba siete hashes parciales, tamaño/hash del gzip recompuesto, pin externo v5 y precondición exacta de snapshots de base. Decodifica los objetos nuevos, resuelve los ya presentes por las rutas de snapshot-cierre.json.gz, y copia cada objeto a su raíz propia comprobando bytes/hash. Resuelve el grande desde v5 r2 explícito. Invoca leerSnapshot/verificarContenido reales con el CAS de la restauración. El ensayo terminado figura en restauracion-partes.log. 

El cierre no es un paquete de toda la aplicación: necesita los archivos exactos de la base nombrados por sus hashes y los originales del paquete preservado. snapshot-partes.json fija el orden de concatenación; snapshot-cierre.json.gz describe cada dependencia por ruta/hash/tamaño y diferencia las externas. No basta descomprimir un archivo sin verificar sus pins.

## Registros candidatos y controles

`preparar(root)` en scripts/procedencia/incorporacion-lote-r32.mjs reconstruye el plan exacto desde la derivación R23 fijada. `aplicar(tree, plan)` y `revertir(tree, plan)` solo escriben los dos registros en un árbol dentro del scratch propio. Para iniciar el ensayo se crean allí ambos destinos con los bytes before del plan; los after coinciden con candidatos/. Los dos archivos previos se entregan también en previos/. HEAD, pins de las fuentes, plan y estado físico previo deben coincidir; no se puede aplicar un plan reserializado con identidad/payload/atestación cruzados ni revertir sobre bytes desconocidos.

Las pruebas tests/incorporacion-lote-r32.test.ts crean únicamente registros scratch y cubren conservación/reversión, base inesperada y tres cruces. Para ejecutarlas en un checkout sin node_modules local se puede reutilizar la proyección de test-preparar.mjs.txt dentro de scratch; configurar cacheDir también dentro del scratch y usar `--configLoader runner`. No escribir un enlace node_modules en la raíz del checkout. El tsconfig de alcance entregado activa checkJs=true, noEmit y comprobación de ambos archivos; lint-reglas.json fija las dieciséis severidades. Los comandos finales están congelados en calidad-final.sh.txt y calidad.sh.txt; adaptar la ruta absoluta del cwd al scratch del receptor antes de ejecutarlos y conservar el diff de adaptación.

## Repetir generación, si la revisión la necesita

Los instrumentos ejecutados se conservan como .txt. No ejecutar sus rutas de informe directamente sobre esta carpeta recibida. Copiar a scratch y sustituir **solo** la ruta literal `docs/procedencia/implementaciones/incorporacion-lote-r32-sol` por una carpeta de resultados nueva bajo `.cache/incorporacion-lote-r32/`; conservar el diff y hashes de cada adaptación. Rechazar un árbol ensayo ya existente en lugar de vaciarlo. 

Orden: preparar-ensayo (receta R27 sin .venv y pins no software); completar-ensayo (cierre Madrid previo y fuentes actuales de explicación); preservar-versiones (copias ordinarias por hash); crear explícitamente scratch/externo; recorrido-r2 (recorrido entero con fallo de escritura controlado) o recorrido-r3 únicamente si se reanuda la entrada-r2 ya fijada; comprobar-lote; transportar-snapshot; raiz-durable; inspeccionar-bundle; partir-bundle. Cada validación adquiere y libera el lock pesado, sin anidarlo. No retenerlo mientras se adapta o redacta. Usar Nix con bun/nodejs/python3, PYTHONDONTWRITEBYTECODE=1, UV_OFFLINE=1 y UV_PROJECT_ENVIRONMENT absoluto dentro del scratch propio. run.sh sigue siendo la entrada Python de proyecto. No crear tools/procedencia/.venv.

No volver a ejecutar auditorías fiscales ni cambiar esperados históricos. El ensayo de incorporación no constituye revisión independiente; al integrar se debe contrastar estos bytes antes de decidir cualquier acto operativo.
