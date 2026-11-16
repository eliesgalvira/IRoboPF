# Cuatro expedientes sintéticos de arrendatarios, 2025

Implementación acotada con validación focal. N=80, pesos, objetivos, salarios y edades conservados. Sólo cambian los slots CLM01, Murcia02, Valencia05 y Catalunya10; los otros 76 se preservan por valor. Todos los datos y soportes añadidos son sintéticos.

Murcia reutiliza la rama F y su productor anual de bases y mínimos. La habitualidad arrendataria enlaza vivienda, contrato, titulares y ocupación sin exigir adquisición del contribuyente. La compra del arrendador no participa en esa comprobación. Los medios bancarios acreditados son deducibles; efectivo conocido queda fuera, medio ausente es pendiente. La presentación ITP se conserva incluso con exención; la fecha de vencimiento declarada no certifica por sí sola su plazo legal.

Valencia reutiliza fórmula, libro, composición y cuota anuales existentes. Un expediente contractual y sus pagos identificados produce días, alquiler neto y cero condiciones reforzadas para el perfil general de único titular, mayor de35 y sin discapacidad cualificada. Se comprueban firma posterior al23-4-1998, duración mínima anual, ocupación, derechos alternativos, incompatibilidad por inversión y medios bancarios. Falta documental o especialidad fuera del productor es pendiente, nunca cero. No se introduce cumplimiento global, base ni cuota externa. La ruta anual exige este expediente; el evaluador escalar aislado conserva su alcance parcial anterior. La API técnica calcula cotizaciones de perfil uniforme y sus controles de conexión no acreditan equivalencia con las cotizaciones efectivas del expediente.

Oráculos documentales previos a cuota: Murcia300/1, Valencia800/1, CLM0/1 y Cataluña0/1. Con empleo efectivo30000, SS1950 y gasto legal2000, base liquidable26050, ahorro0. Son expectativas de revisión contrastadas en pruebas; no observaciones Open. CLM/Cataluña mantienen habitación en el expediente aunque su API salarial no la codifique. El cero está motivado por edad40 sin alternativas personales, no por ausencia de vivienda.

Las pruebas nuevas cubren positivos y adversos mediante las APIs explícita y técnica. A13 (transporte) permanece pendiente de observación; A14 se verifica mediante precondiciones e invariantes documentales. No se añaden selectores, casillas ni controles supuestos.

## Hallazgos y correcciones de la revisión

La reproducción previa de la revisión dio 22 casos conformes y diez fallos. Se conservan las entradas, los resultados y las expectativas originales de esa revisión. Las correcciones mantienen los importes de los perfiles ordinarios:

- Valencia: un contrato del 1 de enero al 31 de diciembre cubre un año completo. El fin inclusivo se compara con el día anterior al aniversario, sin exigir un día adicional.
- Murcia: arrendador y arrendatario no pueden ser el mismo sujeto. La contradicción se rechaza antes de calcular una deducción.
- Valencia: porcentaje y distancia aislados no bastan para decidir el requisito sobre otras viviendas. La norma considera el pleno dominio o derecho de uso, los miembros de la unidad familiar, la duración y excepciones específicas. La condición anterior de porcentaje y distancia se retira. Un censo no vacío queda pendiente de esos hechos; no genera cero fiscal ni un derecho positivo supuesto. El perfil probado tiene el censo vacío.

La revisión esperaba inicialmente 800 euros en tres variantes de derechos sobre otra vivienda. Esas expectativas originales se conservan, pero la implementación no certifica sus positivos: las seis comprobaciones de ambas API pasan a exigir rechazo por hechos insuficientes. También se conserva la expectativa anterior de cero del caso A15 del autor. Este cambio delimita la cobertura; no demuestra que esos derechos sean legalmente incompatibles. Los otros 26 casos de la revisión y los 32 del autor mantienen sus controles monetarios o de rechazo, salvo A15.

La regla de duración y las condiciones de otras viviendas se contrastaron con el [manual AEAT 2025 de arrendamiento de vivienda habitual en la Comunitat Valenciana](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunitat-valenciana/arrendamiento-pago-cesion-uso-vivienda-habitual.html). No se extiende el perfil a derechos cuya historia no esté representada.

Tras las correcciones pasan los 64 casos conjuntos del autor y de la revisión de alquileres. Esta evidencia no sustituye la captura de Open ni aumenta el numerador de coincidencias.

Tipos y lint focales pasan. La segunda revisión confirma la duración inclusiva, el rechazo de identidades contradictorias y el oráculo asturiano; los derechos sobre otras viviendas siguen pendientes fuera del censo vacío. El transporte real de los cuatro inquilinos y sus SES/PDF permanecen abiertos. Estas pruebas no suman coincidencias con Open.

Comprobación focal reproducible con Bun:

`timeout -k 30s 12m bun run test tests/inquilinos-factual-2025.test.ts tests/deducciones-f-conexion-anual-2025.test.ts tests/deducciones-valencianas-anual.test.ts tests/deducciones-valencianas-composicion.test.ts --maxWorkers=1`

Antes de publicar: reproducir todos los comandos de los workflows vigentes con Node24.20.0, Bun1.3.13, Python3.13.15 y los entornos Nix declarados, incluyendo archivos generados e inventario:verificar. El workflow incluye los nuevos controles de alquiler y vinculación. La validación focal no sustituye su ejecución completa.
