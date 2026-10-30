# Dictamen y resultados ejecutados

Corroboración técnica condicionada de valor y selección en los seis sitios del candidato R34: anual.retencion.base/cuota/tipo/anual y anual.pagos.retenciones/cuenta. La condición es la implementación concreta, fuentes fijadas, entradas y primitivas del contrato; no se concede admisión anual, inyección arbitraria, wiring, cierre del sitio ni aceptación fiscal completa. Se conserva lo corroborado en R33 de soportadas y se consideran resueltas en este candidato las omisiones concretas RF33-01/02. 

La razón no son los true ni la igualdad del artefacto: cada cuerpo tiene operadores/operandos y binding navegables hasta entradas/constantes. Se han contrastado con expectativas racionales y TS real las selecciones, los retornos y la separación entre productores. En particular, la función de escala clonada por llamada permite demostrar sensibilidad de cada una de sus18 celdas en las cinco instancias sin cancelación entre llamadas. Los helpers son ensayos internos de valor/selección; no se presentan como declaraciones fiscales ni como casos anuales admitidos.

Resultado: **305 pruebas correctas y cero fallidas**: 46 originales R32, 31 de R33 sobre TypeScript real, 69 R34 integradas y 159 adicionales. Se excluye el grupo de 31 repeticiones sobre IR para no duplicar cobertura. `controles/tests3.json` conserva los nombres y resultados individuales.

`tests1.json`, `casos-intento1.json` y `propios-intento1.mjs.txt` conservan cinco fallos instrumentales del ensayo inicial. La versión final aísla las copias de datos en mutaciones, discrimina la rama mediante el objeto Match y reconoce movilidadGeografica tanto en accesos como en patrones. Los esperados históricos permanecen iguales. Los fallos iniciales no son defectos fiscales ni se contabilizan como pases.

Tipos:tsc0 sobre las tres copias de pruebas TS y helpers reales adaptados, proyecto estricto sin incremental; MJS/checkJs=false permanece fuera de garantía estática completa. Oxlint final0, ocho archivos propios,16 reglas a error, un hilo y disable-nested-config; el log JSON y debug=files acreditan el alcance. ESLint0 con dos warnings de root sin uso en instrumentos de cotejo inicial/final, sin errores ni reglas relajadas. Schema0: original y todos-pending válidos; program vacío también pasa schema, mientras el verificador exacto lo rechaza. El ejecutor privado no sustituye esa puerta.

Ruff de Nix y mypy estricto sobre `schema.py` terminan con código 0. El intento de Ruff por uv terminó 127 y no acredita una comprobación. Python usa entorno UV absoluto propio, `PYTHONDONTWRITEBYTECODE=1` y run.sh para schema.

El control físico final y el ensayo de transporte tienen recibos independientes. El manifiesto enumera únicamente adiciones de esta revisión: baseSha256=null por archivo. Para las20.227 entradas originales, inicial/final.json.gz conservan hash anterior, hash actual, tipo de entrada, ejecutabilidad y comparación exacta de bytes o readlink. Cero modificaciones/borrados de base es condición de entrega; alcance enumera altas físicas y rechaza rutas ajenas a informe/scratch. El patch gzip contiene texto contra /dev/null; binarios.json enumera rutas/hashes de controles comprimidos. Se aplica y verifica en scratch, sin checkout ni VCS mutante. Los sobres excluyen autorreferencias y ENTREGA fija sus hashes.



`incidencia-ruff.json` conserva los hashes de tres archivos de caché que el control inicial de altas rechazó por ubicación. Tras reubicarlos al scratch se repitió ese control; las entradas originales permanecieron intactas. El resultado final no acredita confinamiento de todas las escrituras transitorias.
