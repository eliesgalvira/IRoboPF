# Comandos y resultados terminales

Raíz de trabajo: /home/elies/.t3/worktrees/IRoboPF/t3-efe83dcc. Herramientas por Nix. Cada comprobación pesada se invoca con `flock /tmp/irobopf-validacion-pesada.lock`; cada cotejo completo con `flock /tmp/irobopf-recepcion-acotada.lock`. No se anidan.

- Cotejo inicial antes de escribir: `nix shell nixpkgs#python3 -c flock /tmp/irobopf-recepcion-acotada.lock python3 -` con instrumento terminal secuencial descrito en fisico-inicial-terminal.json: exit 0, 20498 iguales, diff/altas vacíos. El primer intento sin Nix falló por python3 ausente; no era un cotejo completado.
- `python3 .cache/revision-ss-r39-sol/fisico.py fisico-inicial`, con Nix/lock recepción: base sin cambios; exit 1 por incluir .git como extra. Se conserva log/JSON; no sustituye el cotejo terminal previo.
- `bun .../effect-solutions@0.5.3@@@1/dist/cli.js list`, `show testing data-modeling` y lectura de Match.valueTags/Array.reduce locales: consultas de patrones, no pruebas.
- `python3 .cache/revision-ss-r39-sol/racionales.py`: primer intento AttributeError por vacío float; corrección propia Fraction(0), exit 0, 438 casos racionales.
- `bun .cache/revision-ss-r39-sol/revisar.mjs`: exit 1, Effect mal resuelto sin dependencias locales; casos.log. No se cuenta como pase.
- `node /home/elies/Repos/IRoboPF/node_modules/vitest/vitest.mjs run --configLoader native --config .cache/revision-ss-r39-sol/vitest.mjs`: exit 1; 21 pasan, suite R32 no carga decimal.js.
- `python3 .cache/revision-ss-r39-sol/preparar.py`: proyección propia en caché, copia de fuentes y enlace solo lectura al node_modules del padre. Adaptación de imports conservada en adaptacion.diff.
- `bun .cache/revision-ss-r39-sol/revisar-ejecucion.mjs`: exit 0, 438 casos ×11 contra racionales/TS, 22 adversos/pending, copia privada y estado por llamada correctos. Siete observaciones inicialmente rojas: cinco dimensiones MEI y dos sondas propias inválidas de anualización, clasificadas en informe.
- En proyeccion: `node node_modules/vitest/vitest.mjs run --configLoader native --config vitest.mjs`: exit 0, 58/58. CacheDir absoluto propio; no temporales de configuración bajo node_modules.
- En proyeccion: `node node_modules/typescript/bin/tsc --noEmit`: exit 0, config strict del proyecto con include de dos tests y dependencias transitivas. checkJs=false heredado: no acredita tipado estático completo del MJS.
- En proyeccion: `node node_modules/oxlint/bin/oxlint --threads=1 --disable-nested-config ...` sobre compilador/consumidor/tests y `revision`: exit 0. Configuración conserva 16 reglas anti-slop a error. No se desactivan reglas ni se reduce a cero archivos.
- En proyeccion: `node node_modules/eslint/bin/eslint.js revision ...`: exit 0. Aviso de pages ausente en proyección conservado.
- `bun .cache/revision-ss-r39-sol/adicional.mjs`: dos intentos fallan por representación seed (string frente a {decimal}); originales propios archivados. Tercer intento exit 1 semántico: doce rojos dimensionales externos, validatorAccepts=true y rawAnnualSeedChanged=true. No hay fix de producto ni esperado histórico cambiado.
- `IROBOPF_AUDITORIA_PERF=1 bun .cache/revision-ss-r39-sol/temporizacion.mjs`: exit 0; valor intacto, callback una vez, finally puede lanzar. Mutación de performance solo dentro del proceso y restaurada.
- `bun .cache/revision-ss-r39-sol/puertas.mjs`: exit 0, ocho controles de promoción/pending/dominio rechazados.
- `bun .cache/revision-ss-r39-sol/replica684.mjs`: exit 0, 684 casos, cero discrepancias. Copia adaptada con diff, salidas nuevas.
- `bun .cache/revision-ss-r39-sol/semilla-r34.mjs`: exit 1, pinRejected=true, once cierres históricos frente a cero esperado. Fuente semilla corregida conservada.
- `bun .cache/revision-ss-r39-sol/casos-r34.mjs`: exit 1, 684 numéricos correctos y ocho rojos semánticos; wrongSeedOrigin=false. No sumar de nuevo esos casos como nueva cobertura.
- `bash tools/procedencia/run.sh .cache/revision-ss-r39-sol/schema.py`: exit 0, schema original/pending admitidos; booleanos de admisión true admitidos por forma, rechazados por API verificada en puertas.json.

Los comandos run.sh usan `PYTHONDONTWRITEBYTECODE=1` y `UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-efe83dcc/.cache/revision-ss-r39-sol/uv`. Los instrumentos Python iniciales estándar por Nix directo son desviación de la instrucción de uv/run.sh, declarada en informe; no instalaron paquetes ni escribieron .venv del proyecto.

Empaque: ejecutar empaque.py.txt desde scratch propio con run.sh, Python sin bytecode y UV absoluto; necesita patch disponible (Nix). Reconstruye todas las altas del manifiesto, aplica patch textual y restaura binarios por hash; verifica bytes/tamaño/modo, exit 0 exigido. No crea checkout ni muta VCS. El recibo transporte.json conserva resultado real.

Final después del sobre: ejecutar fisico.py.txt con argumento fisico-final mediante el bloqueo de recepción/run.sh. El propio recibo final y su log quedan fuera del payload previo por autorreferencia; se transportan aparte junto con sobres. Comprueba 20498 originales, fechas inicial/final, diff, ninguna alta ajena y HEAD exacto. El recibo/log finales contienen el resultado real.
