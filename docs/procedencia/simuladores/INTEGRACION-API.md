# Integración reproducible C y API actual

Informe de recepción del candidato del 4 de noviembre de 2026.
**C permanece abierto. No se ejecutaron miles ni nuevas peticiones AEAT.**
No se amplía el dictamen anterior F1–F5 al código nuevo.

La revisión posterior encontró R1–R3; las correcciones recibieron contraste
independiente favorable y el CI completo del integrador pasa. El código y sus
pruebas portables se incorporan a la rama de trabajo. Véanse los
[cambios y pruebas finales](CORRECCIONES-INTEGRACION.md).
Los resultados siguientes describen la recepción histórica y conservan sus
identidades. El vínculo pendiente se refiere a demostrar la equivalencia de
configuración de personas sintéticas; no exige probar hechos reales de personas
ficticias. La aceptación fiscal sigue siendo un contrato distinto y pendiente.

El transporte se incorpora en `tools/procedencia/simuladores/`: parser, CAS,
journal, validación PDF/SES, captura serial, adquisición y verificación. Código,
directorio de ejecución, originales y CAS quedan separados. Configuración por
variables explícitas y resolución de herramientas de entorno, sin rutas de un
equipo ni dependencias privadas. `launch.sh` impone timeout del grupo; bloqueo
propio común entre captura y adquisición, pausa y límite 1–20. Cambios de código,
plantilla, política, configuración o entorno invalidan la identidad. Reutilizar
un recibo vuelve a verificar evidencia y significa histórico fijado, no captura
actual. CAS y recuperación del último sufijo parcial conservan las garantías
revisadas; resultado provisional no equivale a done.

`engine.mjs` ejecuta `liquidarIrpfAnualExplicito` desde la API pública con la
entrada completa decodificada estrictamente. Rechaza propiedades extra y casos
no admitidos con salida 2. Conserva entrada original, efectiva y sus hashes;
inventario completo conservador de fuentes y dependencias instaladas antes de
importar y después de ejecutar, runtime y hash de ejecutable. La base obtenida
realmente en esta recepción es `181a17b6e063a6459baf983007fd3644821cc742`.
Los recibos declaran **candidato base más inventario**, no ejecución del commit
limpio: incluyen la proyección aún no publicada. No atribuyen cambios fiscales
al motor base `ab29bae79b238f1d96b568cd1ba3d4b9688985fb`.

La única modificación productiva devuelve los seis componentes que composición
ya calculaba, con unidad EUR y texto decimal completo, sin fórmula ni redondeo
nuevo. Su correspondencia 0528–0533 está documentada en API-MOTOR.md. Con los
ocho campos previos se cubren catorce casillas sin leer strings del rastro ni
tolerar un céntimo. Las siete expectativas Open permanecen intactas.

## Comparación real offline

Se ejecutó la API real sobre 17 filas de comparación: siete referencias completas
y diez capturas 2025 conservadas (nueve v1 y un recibo posterior). Las diez
incluyen dos recibos del mismo piloto con idéntico SES; no son dos casos nuevos.
Se separaron además siete capturas 2018–2024, fuera del perfil actual: no cuentan
como éxitos ni discrepancias 2025.

Resultado monetario condicionado: **224 casillas iguales, cero diferentes,
14 ausencias oficiales, cero componentes sin proyección**. Las siete referencias
aportan 92 igualdades y seis ausencias; las diez capturas aportan 132 igualdades
y ocho ausencias. Se distinguen **nueve entradas fiscales distintas y ocho filas
repetidas** dentro de las 17, normalizando importes/hechos y conservando los
recibos por separado. Las ausencias 0023/0414 no se convierten en cero ni en
comparación monetaria. PDF exige las otras doce y coteja todas las ocurrencias.

Los originales de las siete referencias se seleccionan por SHA-256, cotejando
SES y PDF; las capturas se validan desde sus referencias CAS. La retención
100,01 y el piloto DA61 bruto 17.000,41 / SS 1.000 / retención 1.000 se ejecutan
contra el motor actual. El piloto conserva resultado −721,23. Son ejecuciones
nuevas del motor sobre evidencia oficial histórica, no capturas nuevas.

El primer generador de entradas descartaba gastos sindicales, colegiales y de
defensa al reconstruir la captura de dos pagadores. Produjo diez diferencias
artificiales y el vínculo la rechazó por GCS contradictorio. Se conservan el
resultado inicial y una prueba roja anterior a la corrección. El generador ahora
coteja una entrada completa de referencia antes de reutilizarla, incluidos esos
gastos; la regresión sintética conserva el desglose de dos pagadores. No hubo
corrección del motor fiscal ni cambio de expectativa para borrar diferencias.

## Vínculo y límites de admisión

`binding.py` coteja ejercicio, Madrid, modalidad individual, edad 40 y nacimiento
en los ámbitos personales/IRPF, bruto, cotizaciones, retenciones y gastos
presentes. Rechaza duplicados/contradicciones, plantillas distintas de los dos
hashes admitidos cuando se aporta plantilla y registros/secciones añadidos fuera
del vocabulario observado. El vocabulario público solo contiene nombres de
campos/secciones, sin datos ni sesiones; no es prueba jurídica de admisión.

**Las 17 filas siguen incompletas en vínculo fiscal, ninguna aceptada.** No se
ha podido acreditar positivamente con esos SES todo lo exigido por el contrato:
residencia anual, inexistencia de otras rentas, familiares, discapacidad,
reducciones, saldos, otras deducciones, rentas extranjeras, especialidades y clase
de empleo. Los originales permiten comprobar datos personales y cantidades;
las secciones vacías, campos derivados y hash de plantilla no prueban todos los
negativos. Falta auditoría exhaustiva de los registros heredados y acreditación
positiva de esos hechos. Los hechos declarados en oficial.json continúan
condicionando el cálculo; no se presentan como hechos acreditados por SES.

Por eso el comparador escalar aislado nunca acepta metadatos meramente
rellenados. `offline.py` devuelve **2 (incompleto)** aun con coincidencia numérica;
si hay diferencia devuelve 1. El 0 queda reservado a cobertura completa y no se
alcanza aquí. No se amplían puertas fiscales o familiares. Esta entrega permite
revisar la conexión y sus límites; no autoriza todavía una campaña masiva.

## Validación y reproducción

Tipos del proyecto: `tsc --noEmit --incremental false`, salida 0. Lint focal
Oxlint y ESLint, con reglas vigentes sin desactivarlas. Vitest del alcance con
`--maxWorkers=1`: siete archivos, **88 pruebas**, incluidas siete Open inmutables,
proyección de los seis componentes y composición/conexión afectadas.

Suite portable Python: **nueve métodos**, sin originales privados ni red;
parser/contrato, CAS/journal, discriminantes de vínculo y conservación de gastos,
configuración, semilla, transporte simulado con validadores reales y operador
real con retención discriminante y rechazo de entrada extra. Suite privada
separada: **21 métodos**, adaptados al código público y a que los metadatos mock
no acreditan ejecución/vínculo. La suite CI omite explícitamente los originales
privados. Requiere dependencias de entorno documentadas (incluidos Poppler y
workspace Jujutsu); el padre decide pines e integración del workflow.

Comandos públicos completos y variables: [README del tooling](../../../tools/procedencia/simuladores/README.md).
Se preparó la semilla idéntica de **2020 brutos distintos** con `--generate` en
salida externa; no se envió a AEAT. Se conserva control reanudable con última
escritura, rechazo de evidencia corrupta y verificación antes de reutilización.

Entrega privada compacta `c-integracion-api-20261104`: parche aplicable al repo,
manifiesto, baseline de archivos modificados, lista exacta de rutas, recibos de
motor, comparación por casilla, comandos/logs y hashes de recepciones antes y
después. Sin copias del repo, entornos o cachés. Recepciones y CAS previos se
mantienen intactos. No se tocan A, fórmulas, UI, estado/balance/decisiones,
TRANSPORTE-REVISADO, workflow o pines. Sin commit, push ni PR. Trabajo individual,
turno pesado 2, suites secuenciales; se libera para revisión independiente.
