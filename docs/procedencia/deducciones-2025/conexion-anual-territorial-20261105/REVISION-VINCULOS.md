# Contraste independiente acotado de vínculos v4

Dictamen: sin hallazgos bloqueantes nuevos en el alcance contrastado. El P1 reproducido en v3 queda corregido en v4. No se certifican derechos externos ni la integridad fiscal de todas las ramas. Quedan para el padre integración y CI completo antes de publicar.

Candidato: producto-deducciones-anual-vinculos-20261105. Parche SHA256 295c7922684b925c2ae9b15be5c23f913d4837c6b5acb0b49823a486d3fe5559. Se verificaron las 25 postimágenes y las preimágenes declaradas. No se propone modificación de producto.

## Reproducción mínima P1

Individual CYL 2025, s-1 de 40 años, trabajo íntegro 30.000 euros; descendiente s-2 nacido 2023-01-01 sin rentas ni discapacidad y con un solo titular efectivo s-1. Vínculo anual consanguíneo. Solicitud cyl_gastos_adopcion del mismo sujeto: nacional, resolución 2025-02-01, inscripción 2025-02-02, titular s-1, sin ayuda análoga solicitada.

v3 genera y aplica 784 euros en ambas API, pendiente cero. Cuota sin solicitud 387274 céntimos; con solicitud 308874. Diferencia indebida exacta 78400 céntimos. v3-p1.log reproduce ambas rutas. v4 rechaza con ResultadoNoSoportado por vínculo incompatible con adopción, sin importe.

Las cotizaciones efectivas del harness se equiparan a las estimadas del caso analítico y se concilia su rendimiento neto. El helper convierte cuotaLiquidaLegal de la salida efectiva a céntimos únicamente para comparar el impacto monetario.

## Pruebas

34 propias (17 por API): todas verdes en v4. Mismo contraste sobre v3: 22 fallos y 12 controles verdes. Los fallos incluyen guardas nuevas y el antiguo rechazo del id de evento CLM; no son 22 defectos fiscales distintos. Se ejecutaron además las 41 permanentes de revisión/titulares recibidas: 75/75 verdes en conjunto. Tipos estrictos y diagnósticos Effect, incluyendo fuentes y pruebas del candidato y prueba propia: exit0. Oxlint/anti-slop en post/lib, post/tests y prueba propia: exit0.

- CYL adopción coherente: 784/392 euros con uno/dos titulares adoptivos; caída exacta de cuota de 78400/39200 céntimos en ambas API. Fechas contradictorias de constitución o inicio posterior a inscripción rechazadas. Constitución ausente mantiene el no soportado previo de mínimos.
- Reparto CYL mixto: rechazo específico de contrato pendiente, también con orden de titulares invertido. Es limitación de representación; no exclusión fiscal legal del progenitor biológico. El mínimo no se toma como prueba automática de los titulares de la deducción.
- Catalunya adopción coherente: 150 euros; vínculo consanguíneo rechazado. Madrid internacional: 721,70 euros y contradicción rechazada. Murcia: 100 euros y contradicción rechazada.
- CLM parto: 100 euros con id de evento distinto del hijo. Nacimiento anual desplazado un día frente al parto se rechaza.
- CYL hogar: 150 euros sobre 1000; hijoNacimiento desplazado un día se rechaza sin depender del cambio de edad.
- CYL numerosa: 600 euros con dos descendientes efectivos en orden invertido. Rechazo de omisión de uno efectivo, añadido ajeno y discapacidad65 contradictoria. Control con discapacidad65 anual coherente: 1200 euros generados. El título sigue declarado y condicionado, sin acreditar su concesión externa.

No se modifican oráculos monetarios recibidos. Las fixtures adoptivas recibidas se consideran corrección de hechos manteniendo sus esperados. No se repiten las 607 regresiones, inventario ni CI global. No se reabren H1/H2, acreditación universal o fórmulas fiscales heredadas. No se reclama cobertura exhaustiva de eventos múltiples ni ramas ajenas al cambio.

## Evidencia y conservación

Se leyeron AGENTS.md, CONTRATO v4, diferencias del adaptador v3/v4 y controles de evaluadores. Se consultaron effect-solutions list/show testing/error-handling y fuente Effect local antes de escribir las pruebas. No hubo subdelegación, VCS mutante, commits, push o publicación. Una sola suite pesada simultánea propia, Vitest maxWorkers=1; todos los tests/scripts con timeout -k 30s. Sin dependencias nuevas, worktree, copia completa ni cuerpos CAS. du inicial: raíz 25G y Backups/IRoboPF 63G.

Las huellas iniciales/finales vigilan 25410 archivos de raíz y recepciones. Candidatos v3/v4 y revisión previa intactos. Cambio concurrente autorizado del padre, confirmado por mensaje: docs/procedencia/ESTADO-POR-ANIO.md cambió durante la revisión por actualización de planificación del padre. Las altas B37 anunciadas por el padre se distinguen en integridad-final.json si ya están presentes. Este revisor no escribió en raíz. No se declara conservación total de raíz; integridad-final.json conserva la excepción y ambas listas mantienen sus hashes para contraste del padre. Ninguna fuente de cálculo o prueba vigilada cambió.

Los logs v4-01/02/03 y tipos-01 documentan preparación fallida del harness propio: conciliación omitida, constitución ausente inicialmente tratada como positiva, discriminante efectivo sin solicitud, campo de salida equivocado y cotización cero que superaba el límite CLM. Se corrigieron las pruebas propias, sin cambios de producto. No son hallazgos del candidato. v4-final.log y v4-recibidas-final.log son ejecuciones válidas; tipos-final.log y anti-slop.log tienen exit0.

PESADO1 liberado al terminar las validaciones. Pendiente del padre: integrar, ejecutar CI completo y verificar remoto si publica.
