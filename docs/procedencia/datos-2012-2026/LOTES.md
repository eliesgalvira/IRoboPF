# Entradas de los próximos lotes

Cada lote entrega un mapping JSON con el mismo contrato que `tablas.json`. Se ejecuta con `ejecutar.sh --mapping MAPEO_DEL_LOTE.json --obligations OBLIGACIONES_DEL_LOTE.json --obligations-sha256 SHA256_ESPERADO` y raíces explícitas. El wrapper admite también `DATOS_OBLIGATIONS` y `DATOS_OBLIGATIONS_SHA256`, siempre juntos. El hash esperado se declara fuera del registro. El manifiesto resultante enlaza el censo completo de ese checkout y los artefactos `catalog`, `extraction`, `comparison` y `queue`. No modificar los módulos para satisfacer un mapping histórico. Una ruta que desaparezca queda pendiente de remapear al nuevo motor.

| Lote | Datos de entrada del censo | Fuente que hay que fijar | Trabajo restante |
| --- | --- | --- | --- |
| Estado | irpf-estatal y tramos estatales de irpf-autonomico | Manual anual y norma original | Extender las tres escalas del piloto, ahorro y fronteras |
| Autonomías | irpf-autonomico por ejercicio | Manual, boletín y reformas | Cajas completas por tabla, versiones intranuales |
| Mínimos | minimos-autonomicos y estatales | Manual y arts. 56–61/boletín | Importes históricos, restantes sujetos, condiciones |
| Reducciones | metadatos artículo 20 y reglas | Manual y BOE | Separar metadatos de parámetros aplicados |
| Retenciones | irpf-retenciones-trabajo e irpf-retenciones-2026 | Algoritmo AEAT correspondiente | Asociar cada versión con periodo real, no con edición |
| IPC | ipc-2012-2026 | Serie INE exacta y metadatos de medida | Comparar medida anual correcta; no usar índices como tasas |
| SS | seguridad-social-2012-2026 | TGSS y órdenes originales | Bases, tipos, grupos, periodos mensuales |

Las deducciones autonómicas 2025 usan su censo y siete expedientes existentes. Este flujo conserva el enlace y la versión; no duplica sus dictámenes. Ningún lote se considera cubierto por enumerarlo aquí.

La fuente catalogada con `availability=absent` tiene referencia histórica, pero sus bytes no se resolvieron en las raíces de esta ejecución. Restaurar desde el almacén conservado o adquirir con `descargar.py` exigiendo el hash histórico; no modificar el descriptor para simular una restauración. Si la URL devuelve otra versión, registrar un documento nuevo y revisar el mapping.

El registro sigue el [contrato por lote](contrato-obligaciones-lotes/INFORME.md). Seleccionar un lote no acredita su revisión ni aceptación fiscal. Las cabeceras y pruebas de unidad adicionales requieren revisión separada; no basta contener «euros» o un porcentaje. IPC/CSV, anualización SS, nuevos bindings y ampliación del vocabulario quedan fuera de este hito.
