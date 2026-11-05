# Revisión independiente: dos códigos de Aragón, IRPF 2025

Dictamen: favorable dentro del alcance parcial declarado. No se reproduce un error monetario ni un dato público incorrecto bloqueante. No se autoriza una liquidación social anual: falta su productor concreto. PESADO2 liberado al cierre de esta entrega. Sin cambios productivos, publicación, instalaciones, worktree ni subdelegación.

Se revisaron las once postimágenes, evidencia.json, ALCANCE.md, INTEGRACION.md y matriz-ramas.json del candidato congelado. El padre ya había ejecutado sus 84 tests; aquí no se presenta ese resultado como prueba independiente. La raíz se utilizó sólo para dependencias, configuración y lecturas. `jj --ignore-working-copy` muestra @ 2c54d642 sobre el padre 3dcd12606d0c0d280f276585a04918181d7093bf; su diff incluye CLAUDE.md y tres archivos del histórico ajenos a esta revisión. No se afirma un árbol global limpio ni se altera ese trabajo.

## Fuentes primarias y criterios

Consulta de 2026-11-05, sin guardar cuerpos HTML/PDF/CAS. La legislación consolidada se contrasta con el manual específico 2025 para evitar trasladar cambios posteriores.

- [Texto refundido Aragón, artículos 110-9 y 110-13](https://www.boe.es/buscar/act.php?id=BOA-d-2005-90006): porcentaje regional, exceso sobre base máxima estatal, límite, reinversión, condiciones adicionales y cuota del arrendador. Las respectivas redacciones relevantes figuran con vigencia desde 2014/2015.
- [LIRPF, artículo 68.1](https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764#a68): máximo anual, exclusión de cantidades con deducción autonómica, requisitos de sociedad/grupo y participación, plazos y excepción de fundador. No se calcula la deducción estatal en este módulo.
- [AEAT, inversión Aragón 2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-aragon/inversion-acciones-participaciones-entidades-nuevas-creacion.html): confirma 20%, máximo 4.000, umbral estatal y prohibición regional de funciones ejecutivas, dirección o trabajo, además de incompatibilidades para la misma inversión.
- [AEAT, condiciones 68.1 de 2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c16-deducciones-generales-cuota/deduccion-inversion-empresas-nueva-reciente-creacion/requisitos-condiciones-aplicacion.html): cinco/siete años, tenencia estrictamente entre tres y doce, capital o votos familiares hasta segundo grado, excepción del fundador en escritura y fondos de entidad/grupo. No impone una plantilla mínima laboral específica. La referencia a certificado acredita requisitos del ejercicio adquirido; el tenor de 68.1.5 no exige emitirlo antes del cierre de ese ejercicio.
- [Ejemplo oficial 2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c16-deducciones-generales-cuota/deduccion-inversion-empresas-nueva-reciente-creacion/ejemplo-aplicacion-deduccion-inversion.html): contrasta 110.000 de inversión, 100.000 estatales y 2.000 regionales, bajo la hipótesis expresa de restantes requisitos satisfechos. No demuestra por sí solo admisibilidad de la actividad o identidades del fixture sintético.
- [AEAT, arrendador social 2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-aragon/arrendamiento-vivienda-social.html) y [cumplimentación 10.2.12](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-ayuda-presentacion/irpf-2025/10-cumplimentacion-irpf-deducciones-autonomicas/10_2-aragon/10_2_12-arrendamiento-vivienda-social.html): el neto reducido es entrada, la cuota autonómica derivada es la base y el factor es 3/10. Estas páginas no aportan aquí un método verificable de atribución de cuota.

## Pruebas independientes y hallazgos

75 comprobaciones pasan. Los esperados originales no fueron modificados ni regenerados desde funciones productivas. Se confrontan los importes originales positivos/cero con un oráculo entero BigInt de 20% y tope; los netos sociales originales se concilian mediante enteros escalados a 60 decimales. La admisión se contrasta con los criterios legales anteriores y nuevas variaciones de hechos, no con respuestas grabadas del producto.

Las nuevas variaciones cubren: 99.999,99/100.000/100.000,02/100.000,03/100.001,01/119.999,99/120.000,02 euros; exactos 0,004/0,006 y presentación a ambos lados de medio céntimo; base regional voluntaria 123,45 que produce 24,69; capital y voto 39,999999/40/40,000001%; cónyuge y parentescos de consanguinidad/afinidad segundo grado que alcanzan o superan 40%; identidad de entidad/pagador ajena; días anterior, exacto y posterior a cinco/siete años; fundador fuera de escritura; elecciones incompatibles asignadas a otra inversión exclusivamente estatal; reinversión inferior/igual/superior a lo obtenido, destino inexistente y cartera mixta.

Para social se cubren cesiones el último día de 2024, primero/último de 2025 y primero de 2026, rendimiento cero, negativo y decimal muy pequeño; participación 1/10.000 sin segundo prorrateo; enlace exacto a vivienda/rendimiento/productor/caso/titular; rechazo de cuota externa, deducción externa, tipo medio/marginal y productor de clase incorrecta. Ningún caso admisible devuelve importe de deducción, ni cero sustitutorio.

Hallazgos bloqueantes: ninguno reproducido. Rojos de producto: ninguno. Un ajuste del resolver privado y diagnósticos de estilo Effect del propio test se corrigieron antes del cierre; no eran defectos del candidato.

Se mantienen expresamente fuera de certificación: autenticidad de censos, parentescos, balances y calificación emergente; seguimiento futuro y regularización; suscripciones de años previos y 29 de febrero; coordinación positiva de reinversión y cartera mixta; composición conjunta/fallecimiento y liquidación anual. La rama social sigue requiriendo al núcleo la cuota íntegra autonómica de BLG derivada con método oficial contrastado, sin escoger una media, marginal o diferencia de cuotas. En adquisición 2025 no cabe demostrar una transmisión ya cumplida de más de tres años al devengo 2025: no se falsificó el contexto para probar admisión futura. No se amplió a art.70 u otras auditorías.

## Ejecución e integridad

`COMANDOS.sh` reproduce los controles focales, todos con `timeout -k 30s`, secuenciales y Vitest maxWorkers=1. Node 24.20.0 de Nix y dependencias existentes de la raíz; sin inventario ni CI global.

- Vitest: 75/75, exit 0, vitest.log y vitest-modules.json.
- Tipos del candidato y prueba independiente: Diagnostics: 0, exit 0, tipos.log y tipos-modules.json.
- Antislop del candidato: exit 0; canario rechazado con exit 1; antislop.log, antislop-canario.log y antislop-evidencia.json.
- Antislop de revisión: exit 0, antislop-revision.log.
- ESLint focal del candidato: exit 0, eslint.log.

MANIFIESTO.json registra SHA256 pre/post del candidato y de esta entrega; las once postimágenes se cotejan además con el manifiesto recibido. `revision.patch` añade únicamente la prueba independiente como tests/revision-aragon-independiente.test.ts; se aplica después del candidato, sin cambios productivos. Los drivers privados no forman parte del parche. No se incluyen dependencias ni cuerpos CAS.
