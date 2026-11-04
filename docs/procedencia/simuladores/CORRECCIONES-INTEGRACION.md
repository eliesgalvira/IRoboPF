# Correcciones de la revisión de integración C

Candidato del orquestador, 4 de noviembre de 2026. Se conservan las tres pruebas
rojas de la revisión independiente: tres métodos fallidos y seis fallos al contar
los cuatro subcasos personales. El contraste independiente posterior es favorable
para R1–R3, sin defectos nuevos reproducibles. La integración en el CI reproducible
está comprobada; este dictamen no cierra C ni habilita la comparación masiva.

| Hallazgo | Cambio | Regresión |
| --- | --- | --- |
| R1 · Duplicados personales malformados invisibles | Se identifica cada una de las seis claves personales antes de validar el registro. Se exige tipo 1, registro completo, ámbito y presencia única. Los registros de menor indentación terminan el ámbito anterior | Las seis claves, con duplicados válidos, tipos 2/3/9, valor vacío, separador sobrante, falta de separador, ausencia y ámbito incorrecto; se conserva el positivo sintético |
| R2 · Lanzador fuera de la identidad | `launch.sh` entra en el inventario de código. Se verifica antes y después de capturar o reutilizar | Cambio durante el proceso exige reinicio; tras reiniciar cambia la clave. También se prueba cambio durante la verificación de un SKIP |
| R3 · Separación estado/código eludible por enlace | Se normalizan enlaces y `..`, incluso en padres de rutas nuevas, antes de validar y devolver la ruta. Las tres carpetas configuradas deben quedar fuera del checkout y no contenerse entre sí | Alias al código y al checkout, directorios nuevos, ruta relativa, anidamiento entre carpetas y alias externo válido. La salida offline usa la misma barrera del checkout |

Pasan **14 métodos portables, 22 privados y seis métodos del contraste adaptado**.
Los subcasos no se suman a esos métodos. Ruff E9/F pasa para los Python afectados.
No se cambian fórmulas, políticas monetarias, expectativas Open ni archivos de
producción TypeScript. No se repiten los 88 Vitest ni tipos ya contrastados para
la proyección: estos arreglos afectan al tooling Python y a su documentación.

El contraste adaptado conserva las expectativas originales. Solo precisa la
prueba R2: la identidad cargada ahora rechaza el cambio antes de devolver otra
clave; después de simular un reinicio se comprueba que la clave es distinta.
El arnés original y sus fallos previos permanecen intactos en la recepción.

El operador real vuelve a producir **224 coincidencias, cero diferencias y
14 ausencias** en las 17 filas conservadas, con nueve entradas distintas y
siete capturas históricas excluidas. Ninguna fila adquiere aceptación completa:
las 17 mantienen el vínculo incompleto y la CLI devuelve 2. Es comprobación de
conservación de las entradas y cantidades, no una campaña oficial nueva.

La documentación distingue el hash del lanzador de la prueba de haberlo usado.
`launch.sh` impone el timeout del grupo; al invocar directamente `run.py`, el
llamante debe aportar ese timeout. La identidad del transporte fija ejecutables
y versión Playwright, pero no todas sus librerías dinámicas; el inventario
conservador completo corresponde al operador Bun.

La equivalencia de las simulaciones exige una política auditable de plantilla:
hechos sintéticos declarados, opciones y valores que Open consume y exclusiones
del perfil. No exige acreditar residencia o rentas reales de una persona ficticia.
Esa equivalencia y la aceptación fiscal son contratos distintos; esta última
permanece pendiente. El siguiente trabajo es definir y probar la primera con
negativos por campo y una captura pequeña de las opciones que aún falte observar.

Preimágenes, logs, recibo del motor, parche de correcciones y manifiesto se
conservan en la entrega privada. No se modifican los archivos ni el dictamen de
las recepciones anteriores. Las pruebas se ejecutan secuencialmente con timeout
en el turno pesado 2, liberado al finalizar. Sin red ni navegador.

El contraste independiente ejecutó los 14 métodos portables, 22 privados,
seis adaptados y cinco propios. Reprodujo los seis fallos originales sobre
preimágenes y comprobó la conservación del vínculo de las 17 filas SES.
Los 2.541 archivos fijados por su comprobación permanecieron intactos.
El informe completo y sus arneses quedan en el expediente privado
`c-contraste-r123-20261104`; su manifiesto identifica cada artefacto.
No se repite en ese contraste la campaña monetaria completa: se verifican
sus recibos y se vuelve a ejecutar el vínculo de las 17 filas.

El CI completo del integrador termina con salida cero: anti-slop, lint, tipos,
inventario, contratos, corpus de fixtures, unidades/enlaces e IPC/SS, y la suite
portable C con operador real. Esta última ejecuta 14 métodos Python y 88 pruebas
Vitest. Persisten 18 advertencias de lint anteriores, sin errores. El workflow
ejecuta la misma entrada C con el entorno Nix fijado, incluido Jujutsu para
identificar la base; no precisa un historial remoto ni capturas privadas.

Las 22 pruebas privadas y los controles independientes conservan sus recibos
separados; no se presentan como parte de los fixtures públicos de CI. El código
integrado coincide con el revisado. Solo se añade el entorno y la invocación de
CI, se renueva el inventario y se actualiza el pin de la proyección aprobada.
