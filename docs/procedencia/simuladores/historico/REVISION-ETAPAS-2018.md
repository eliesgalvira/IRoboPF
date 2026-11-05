# Primera revisión independiente — histórico2018

**Favorable en el alcance monetario revisado, sin bloqueo por importe incorrecto ni publicación falsa. No es certificación universal ni aprobación de publicación. Tipos propios pendientes por guardia de memoria. PESADO1 LIBERADO.**

Revisión realizada en raíz sólo lectura, sin subdelegación/worktree/cambios productivos. Candidato congelado: candidato.patch SHA256 bc1a57a4ecc74dbabf65544eff324b282cb79c4276743983b0990c7a3e6b0b35; base ff92d0da162e7732102d754304502c398cfaa018 confirmada con jj de lectura. Se revisaron las diez postimágenes y delta mínimo tests/art20-open-c300.test.ts; autonomo.patch no se confundió con el parche final.

## Evidencia propia

- 156/156 pruebas propias:131 entradas sintéticas con oráculo stdlib separado, resultados completos de reducción/base/gravámenes/mínimos/cuota, por API directa y pública; límites de edad, año, origen, transporte, gastos enteros y precisión80. Datos pseudoaleatorios con semilla20181105, más vecinos de umbrales art20 y escalas y cotas. No son testigos oficiales.
- 72/72 focales del candidato ejecutados aquí (log rojo.log tiene etiqueta equivocada pero ejecución verde real); rojo02 ejecuta29aserciones sobre preimágenes con16fallos monetarios, incluidos los9originales. Errores anteriores de arnés/sintaxis se conservan y no cuentan como rojos monetarios.
- 151/151 regresiones en8archivos: ámbito/cuotas/pilotos históricos, canónica, precisión80, C300 y salarial2025. Es selección razonada por superficies afectadas, no nueva auditoría fiscal ni reproducción propia de los473del autor.
- 28 identidades oficiales: hashes/bytes de referencias, importes acreditados extraídos nuevamente de cada PDF con pdftotext y localizadores SES inflados; cabeceras pin2018/N000068672/0.20. Reservas0023/0414 y ausencias intactas. Journals oficiales y recepción original íntegros por SHA. Sin nuevas capturas, red ni promoción del experimento a matriz oficial.
- ESLint/oxlint sobre prueba propia final:0errores/avisos, threads1. Verificación estática recibida ejecutada en lectura: hashes y reconstrucción del parche final correctos. Evidencia del autor y sus canarios sólo examinados/hash verificados: no se presentan como nuevas ejecuciones propias.

## Juicio monetario y alcance

Art20 (reduccion-rendimientos-trabajo.ts:181,186,227): las operaciones binarias están encapsuladas en la rama2018 con operandos explícitos; el camino canónico no los suministra. Se conserva transporte decimal corto y HALF_UP por cada rama, mezcla Decimal y cuantización final; no se sustituye por redondear el número binario exacto ni por Math.round. Con cota1e6/gastos enteros y céntimos, Decimal20 del helper no recorta los valores cortos transportados antes de Q. La base y gasto f continúan Decimal, y el límite de saldo permanece en conexión.

Escalas (escalas-gravamen.ts, composicion-anual.ts:135,175,279,366): el selector predeterminado continúa Decimal. El modo nuevo sólo cambia operaciones del estatal en2018, incluidos los mínimos, cuantizando cada gravamen antes de restarlos. Autonómica conserva tabla fija publicada y aritmética Decimal. El oráculo Python integra estatal por tramos y evalúa autonómica por cuota publicada: son vías separadas de la implementación del motor y no usan sus helpers.

La admisibilidad rechaza gastos fraccionarios, bruto/cota excesivos y subcéntimos; negativos y subcéntimos se rechazan también por Schema en frontera pública. Se verificó rechazo de política en2017/2019/2024/2025 y edades17/65, aceptación18/64, origen distinto y Decimal80 canónico. Ambas API coinciden e input permanece intacto. La generalización de1000EUR observado a otros gastos enteros es inferencia técnica expresamente declarada, no nueva observación fiscal. Los131discriminantes reducen riesgo de sobreajuste a9casos, pero ni éstos ni los28testigos demuestran equivalencia universal del servidor. No se solicita ampliar el perfil/cota ni admitir fracciones.

Los dos cambios de esperado son SINTÉTICOS y quedan justificados independientemente: bruto15876.01/gastos1000 produce reducción1461.74 y base11414.27; mutación C3002018 con bruto15876.02/gastos0 produce711.74. La llamada canónica para ese segundo argumento conserva711.735. No se alteran el original C3002025 ni esperados oficiales2018. oraculo.py y logs/oraculo contienen cálculo separado reproducible; no se aceptó el verde recibido como su justificación.

## Límites técnicos y cierre

Tipos/Effect propios no completados: la guardia abortó el proceso a9.89s, árbol1129570304bytes/grupo6450130944bytes (>6GiB). No hay diagnóstico final ni se declara typecheck correcto. Ninguna suite relanzada tras dispararse. Pico árbol propio observado1.13GB; pico grupo6.45GB;1activación. Guardias muestreadas no aseguran máximos entre muestras. Concurrencia1, heap1792MiB, worker1/fileParallelismfalse, timeout global45min durable/hijos15min/-k30s.

CIERRE.json acredita0procesos propios supervivientes, lock libre, turno cerrado. Los719archivos protegidos de raíz lib/tests, candidato, originales/recepción y journals tienen SHA pre=post. El cotejo PDF/SES verificó además los blobs referenciados. No hace falta prolongar la congelación para esta revisión. El padre puede retomar su trabajo y deberá completar tipos y sus controles de integración/CI antes de publicación según AGENTS.md. La falta de tipos se informa como limitación técnica, no como fallo monetario demostrado.

Entrega compacta: revision.patch añade sólo prueba portable+JSON+oráculo; manifiesto.json identifica entradas y artefactos. Sin repo/lib/tests completos, dependencias, cachés ni cambios al candidato. COMANDOS.md explica errores del arnés conservados, selección y reproducción. No CI completo/inventario/publicación.
