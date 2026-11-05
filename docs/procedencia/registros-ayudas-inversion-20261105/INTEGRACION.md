# Registros familiares, ayudas e inversión de 2025

Este corte conecta cinco ampliaciones parciales a las dos API anuales existentes. Cada cambio monetario ha recibido una primera revisión independiente. Las condiciones externas se reciben como hechos declarados: las pruebas del motor no autentican documentos ni completan todas las ramas de las deducciones de 2025.

| Ampliación | Alcance incorporado | Límites conservados |
| --- | --- | --- |
| Baleares | Nacimiento múltiple documentado y adopción única, conciliados con vínculos y censos familiares. | Anticipos, regularización e historia familiar compleja pendientes. |
| Canarias | Gastos de hogar con empleador identificado, régimen matrimonial y atribución conciliados. | Asistencia permanece fuera del productor; no se admite cuota fiscal externa. |
| Extremadura, inversión | Núcleo del artículo 68.1 compartido con Aragón, asignación estatal y territorial explícita. | Perfil de pago bancario documentado; no se atribuye ese límite técnico al artículo 69.3. Se exige capital social mínimo legal: 60.000 EUR para SA y 1 EUR para SL. |
| Galicia, talidomida | Ayuda RD 574/2023 propia, expediente único y pago íntegro único en 2025; incorporación a la renta aunque no se solicite deducción. | Otras ayudas, pagos parciales, compensaciones y concurrencias no representadas conservan rechazo. |
| Extremadura, vivienda vacía | Un inmueble en pleno dominio, año 2024 vacío completo, alquiler durante 2025 y hechos catastrales conciliados. | Otras fechas, varios inmuebles, prórrogas y otros derechos no están conectados. No son exclusiones fiscales generales. |

Los contratos detallados de [Baleares](../deducciones-2025/baleares-registro-familiar-20261105/CONTRATO.md), [Canarias](../deducciones-2025/canarias-hogar-atribucion-20261105/CONTRATO.md) e [inversión extremeña](../ext-inversion-20261105/CONTRATO.md) mantienen sus reservas. La [API vigente](../API-MOTOR.md) identifica los productores compartidos.

## Talidomida

Se concilian resolución de la Dirección General del Imserso, persona beneficiaria, importe concedido y cobro. Las resoluciones de 2023 o 2024 cobradas en 2025 no se rechazan por ser anteriores. No se exige el registro anulado por el Tribunal Supremo ni se extiende esta clasificación a indemnizaciones privadas o a otros regímenes de ayuda.

La ayuda entra como ganancia sin transmisión en la base general antes de seleccionar deducciones. La aplicación autonómica consume el libro común de cuota una sola vez. La primera revisión no reprodujo diferencias monetarias; encontró una referencia informativa a incendios y RDL 10/2026 que aparecía también para talidomida. Se limita ese texto a incendios y se conserva para las otras ayudas la reserva documental general.

Fuentes: [RD 574/2023, artículos 3, 9 y 10](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2023-15554), [Ley gallega 5/2025, artículo 2.seis y disposición final tercera](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-3385), [LIRPF, redacción seleccionada de 24/12/2025, artículos 14, 33, 45 y 48](https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20251224&tn=1) y [fallo del Tribunal Supremo publicado en 2024](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-22208). Las respuestas que devolvían redacción de 2026 con un parámetro de fecha de 2025 quedan descartadas como prueba temporal.

## Vivienda vacía extremeña

El perfil representa firma e inicio el 1/1/2025, vacío durante los 366 días de 2024 y ocupación observada hasta el devengo. La imputación de 2024 se deriva de hechos catastrales; acredita una condición histórica y no se incorpora a la renta de 2025. La ventana catastral utilizada para 2024 es la de vigencia desde el 1/1/2012 prevista para ese ejercicio, no una ventana móvil de diez años.

La deducción se calcula sobre el rendimiento neto reducido producido por P4, con máximo de 1.200 EUR por contribuyente y aplicación limitada una sola vez por la cuota disponible. El seguimiento futuro queda pendiente. El corte exige un pacto hasta al menos el 1/1/2028: no admite aún el final inclusivo del 31/12/2027 ni las prórrogas obligatorias. Es una restricción técnica documentada, no una afirmación de que esos contratos carezcan de derecho fiscal.

Fuentes: [Ley extremeña 1/2025, artículo 9 bis y efectos temporales](https://doe.juntaex.es/otrosFormatos/html.php?anio=2025&doe=670o&xml=2025010001), [manual AEAT 2025 de la deducción](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-extremadura/arrendadores-viviendas-vacias.html), [determinación de la imputación en 2024](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2024/c10-regimenes-especiales-imputacion-atribucion-rentas/regimen-imputacion-rentas-inmobiliarias/determinacion-importe-renta-imputable.html) y [RDL 9/2024, artículo 6.Segundo, original](https://www.boe.es/buscar/doc.php?id=BOE-A-2024-26915). No se proyecta la vigencia de este decreto a ejercicios posteriores.

## Revisión y ejecución

Las revisiones acotadas de Baleares, Canarias y vivienda vacía son favorables. Inversión extremeña corrige dos P2: capital social incompatible con la forma societaria y cita incorrecta sobre pagos. Talidomida corrige el P2 informativo descrito arriba. Se conservan las pruebas rojas; las correcciones pequeñas las verifica el integrador conforme a la pauta de revisión vigente.

La ejecución conjunta inicial pasa 844 pruebas en 15 archivos, incluidas las pruebas portadas de los revisores y cinco archivos `.mjs` anteriores. Estos últimos estaban nombrados en el workflow, pero la configuración general de Vitest sólo recogía `.test.ts`. Se reproduce primero su exclusión, después se amplía la recogida a ambas extensiones y se comprueba su ejecución real. Sus 237 pruebas anteriores quedan incorporadas al CI ordinario; no se presentan como revisión monetaria nueva ni se suman a ejecuciones históricas superpuestas.

Los 31 pasos completos del workflow pasan en entorno limpio, incluida la verificación de generados. [Comandos, resultados y límites](CI.md). La publicación y comprobación remota son posteriores a este registro local. La campaña histórica conserva 911 capturas: no equivale a 911 comparaciones aprobadas.
