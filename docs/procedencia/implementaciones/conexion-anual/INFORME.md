# Conexión anual explícita de 2025

Entrega personal contra `c61a306107f280c399eb57e57a7c45452bd68864`. Sin subdelegación ni operaciones VCS mutantes. El padre integra por archivos, hashes y presencia de la base. Ninguna salida se autoacepta fiscalmente.

## Decisión, objeción experta y coste

Se añade `liquidarIrpfAnualExplicito` y el contrato `CasoFiscalAnualExplicito`. Es una entrada optativa y separada; no cambia los perfiles canónico ni compatible-legacy existentes. Calcula rendimiento, BIG, BLG, cuotas estatal y madrileña con mínimos propios, deducción de trabajo cuando corresponde y diferencial. No reutiliza una cuota fixture ni presenta un aporte aislado como liquidación.

Alcance declarado y validado: ejercicio 2025 completo, devengo 31 de diciembre, residencia todo el año en Madrid, tributación individual, edad 18–64, sin discapacidad ni familiares con derecho a mínimo. Exige ausencia de otras rentas, rentas extranjeras, especialidades, saldos anteriores, reducciones de base y deducciones distintas de DA61. Solo trabajo homogéneo (empleos laborales/estatutarios o pensiones) o solo actividad profesional EDS admitida por su contrato. Rechaza empleo mezclado con pensión, otros trabajos, mezclas de actividad/trabajo, art18, movilidad, conjunta y 2026. No calcula obligación de declarar.

Objeción: muchos contribuyentes tienen otras rentas, familiares o deducciones. Decisión: rechazarlos explícitamente en lugar de inferir atribuciones o dejar importes sin integrar. Coste: cobertura territorial y personal pequeña. Las limitaciones son técnicas, no requisitos nuevos de la ley ni una negación del derecho a deducir.

En EDS se usa el adaptador real y su historia, asientos, opciones de art32, RETA efectiva y control de identidades. Se excluyen TODOS los activos en esta conexión: la cota histórica de amortización del adaptador no es una conciliación. Objeción: también excluye activos sencillos correctos; coste aceptado hasta cerrar esa historia. No cambia el módulo de actividad ni extiende su aceptación previa.

## Gastos y pagos

Trabajo exige una declaración de totales anuales conciliados sin duplicados, ejercicio 2025 y una o más referencias de procedencia. El cálculo sigue sumando las categorías reales y aplica los límites anuales de colegio, defensa y gasto general una sola vez. No se infiere cotización a partir del bruto. Las referencias son hechos aportados: no autentican certificados ni prueban por sí mismas una conciliación contable. No se deduplican importes por igualdad de euros. El coste es exigir conciliación previa al consumidor; no permite importar indiscriminadamente certificados repetidos.

Para trabajo, cada retención efectiva lleva identidad de operación y procedencia. Para EDS los pagos y retenciones solo llegan por el diario del contrato de actividad. No existe un segundo agregado anual que permita repetirlos. Se rechaza retención estimada y campos legacy ajenos. Dos operaciones distintas de igual importe se suman; una operación repetida se rechaza. Identidades fraudulentas distintas no pueden detectarse con strings: no se promete autenticación de hechos.

## Orden y signos

Trabajo: art19 a–e, gasto f limitado, art20 sobre el argumento sin f y con otras rentas cero por alcance. La reducción aplicada se limita al neto positivo. Una pérdida por gastos a–e se conserva. Solo los servicios laborales/estatutarios alimentan DA61. Pensión sola recibe art19/art20 pero nunca se convierte en servicio para DA61; mezclas se rechazan porque requieren atribución.

Actividad: el aporte ya incluye RETA, gasto difícil y art32 según su opción. El anual no vuelve a restar esos importes, no aplica art20 ni usa cotizaciones salariales. La base conserva signo. BIG=BLG solamente porque el contrato excluye otras rentas, reducciones de base y saldos anteriores. La escala se aplica a la base positiva; una pérdida permanece en BIG/BLG con cuota cero. No se gestiona su arrastre futuro. Ahorro es cero por exclusión declarada, no por omisión silenciosa.

Se usan escalas existentes, incluida la cuota publicada madrileña, y mínimos estatal/autonómico propios. La cuota íntegra general fiscal utilizada para DA61 es la suma después de la minoración por mínimos de arts63/74. Sin otras deducciones coincide aquí con cuota líquida legal. Art80 es cero por ausencia exigida de rentas extranjeras. DA61 se aplica después; se conserva `cuotaLiquidaLegal` y se devuelve `cuotaPosterior`. Luego se restan retenciones y pagos. No hay conciliación ni deducción SMI legacy en esta API.

## Precisión y etapas

Los importes aportados siguen limitados a dos decimales. Únicamente cinco campos DA61 que reciben resultados calculados admiten más decimales: neto reducido, BLG y tres cuotas. No se amplían bruto ni pagos. La fórmula existente no se cambia.

Se conservan decimales entre etapas; la conexión usa Decimal con precisión 80 y el helper DA61 mantiene 60. Los auxiliares de escalas/art20 conservan su propia precisión: no se afirma exactitud racional ilimitada. El alcance excluye mezclas, por lo que la proporción DA61 es 1 cuando existe base positiva y no introduce atribución periódica. Los resultados monetarios calculados salen como strings decimales; `cuotaDiferencialPresentada` redondea únicamente al final half-up a dos decimales. Esta es una política de presentación explícita pendiente de aceptación fiscal, no una afirmación de equivalencia con todas las casillas de Renta WEB. El diferencial sin redondear queda disponible; no se trunca para satisfacer un schema.

Objeción: una política final de presentación no demuestra la política de redondeo de cada casilla de una declaración oficial. Coste: conservar resultado decimal y presentación separados, exigir revisión antes de atribuir equivalencia completa. No se cambia el oracle ni se ajustan expectativas a su salida.

## Evidencia y los cinco planos

Se leyeron BRIEF, AGENTS, CONTRATO-AUDITORIA, COORDINACION, ESTADO, DECISIONES, coherencia-ronda9 y contratos/revisiones de trabajo-anual-implementacion, actividades-implementacion y contratos-v2; adaptadores y auditorías primarias de trabajo/actividad. Se consultó effect-solutions list, show data-modeling/error-handling/testing y Schema.ts local de Effect v4. La ruta breve `correcciones/coherencia-ronda9` no existe en raíz: se leyó su ubicación real bajo docs/procedencia.

- Integridad: manifiesto de archivos con SHA256, tamaño y baseSha256, parche textual y originales locales cotejados. No se cambia inventario ni se reconstruye contenido; corresponde al padre tras integrar.
- Autenticidad: sin nuevas comprobaciones PAdES, CSV o cadena histórica. Se reutiliza el corpus autorizado, no se descarga ni modifica un original.
- Interpretación: contratos de etapas previamente revisados, exclusiones nuevas explícitas y orden descrito arriba. Fuentes: LIRPF arts19,20,32,48,50,63,74,79,80 y DA61; Ley5/2025 DF3 pp46–47; manual AEAT 2025 y las auditorías enlazadas. La conexión y su alcance requieren revisión independiente nueva.
- Exactitud: pruebas con expectativas independientes en tests/conexion-anual.test.ts; logs reales adjuntos. No equivalencia con Excel/Python ni prueba de declaración enviada a AEAT. Casos sintéticos ejercitan contratos reales y cálculo de cuotas, no una simulación con cuota suministrada.
- Aceptación: `aceptacionFiscal: pendiente` en todas las salidas nuevas. No se añade atestación, se migra binding ni se eleva alcance jurídico de una fuente o escala.

## Pruebas y reproducción

`rojo.log`: 11 fallos previos. Uno demuestra el rechazo de DA61 a magnitudes calculadas de más de dos decimales; los restantes demuestran ausencia de la nueva API. Después se implementan la conexión y la separación de precisión. La prueba independiente de DA61 usa cuota aportada solo para probar esa etapa; los tests anuales sí calculan las cuotas.

Casos anuales: trabajo 16.576,01 sin cotización imputada produce art20 4.284,9825, BIG 10.291,0275, cuota legal 818,8197, DA61 339,998 y posterior 478,8217. EDS 10.000 sujeto a retención y elegible cliente único que elige G produce BIG 9.500, cuota 676,43475 y diferencial −923,56525 tras retención 1.500 y pago 100. Inicio reduce esa BIG a 7.600, sin volver a descontar pagos. Pérdidas de trabajo y EDS conservan signo. Hay fronteras 16.576, 18.276 y 19.747,50; límites anuales con dos pagadores, pagos iguales legítimos y duplicados, ausencia de conciliación, mixtos, movilidad y rechazos de alcance.

Órdenes ejecutadas mediante Nix, serializadas con `flock /tmp/irobopf-validacion-pesada.lock`, un worker:

```
bun run test tests/conexion-anual.test.ts --maxWorkers=1
bun run test tests/conexion-anual.test.ts tests/trabajo-anual.test.ts tests/actividades-economicas-2025.test.ts --maxWorkers=1
bun run typecheck
bun run lint
```

Los nombres de suites realmente encontradas y resultados finales constan en los logs finales. Memoria observada: 6.713 MiB disponibles; sin swap. No Next build ni suites legacy pesadas. node_modules es enlace autorizado usado solo para lectura. No cambios package/lockfiles/CI. Incidencias: rg y Python ausentes fuera de Nix; ejecutados después en Nix. Un intento de inserción de líneas de rastro falló por aserción de texto, sin escribir, y se rehízo con el fragmento correcto. Lint rechazó el parámetro `unknown`; la API ahora recibe el tipo nominal y conserva schema runtime. Los tests simulan consumidores JavaScript con un @ts-expect-error localizado para comprobar rechazos, sin desactivar reglas lint.

Los IDs de rastro se crean mediante crearLineaCalculo con decimal, unidad EUR e instancia. El padre debe reconstruir fichas/inventario y revisar sus enlaces; no se enlaza este rastro nuevo a un snapshot obsoleto. Persisten los límites de autenticidad, conciliación externa de trabajo, amortización, familias/rentas mezcladas, redondeo oficial y aceptación independiente.

## Cierre comprobado

`pruebas-cierre.log`: 120 tests en tres archivos, incluidos 25 nuevos de conexión, 36 de trabajo y 59 de actividad. Typecheck principal/vendor y lint global terminan con código cero (`typecheck-cierre.log`, `lint-cierre.log`). La ejecución previa de 84 pruebas no había seleccionado trabajo porque se escribió tests/trabajo-anual.test.ts; se corrigió el comando, sin modificar tests ajenos. Un segundo diagnóstico lint sobre `object` en el ejecutor de pruebas se resolvió tipando su contrato mínimo de caso anual JavaScript con ejercicio; la llamada que simula JavaScript queda identificada explícitamente como prueba de frontera estática omitida.

La lectura directa final de los dos originales cotejados queda en ley5-2025-p46-47.txt y aeat-da61.txt (extracciones, no facsímiles). Confirma el orden tras art80 y la distinción de pensión/servicios en DA61. No acredita autenticidad ni reemplaza la revisión jurídica nueva.

Dificultad concreta adicional: los auxiliares compartidos de escalas usan Decimal con precisión propia (20 cifras en su configuración ordinaria), mientras la conexión/DA61 usan 80/60. No se modifica su política fuera de la propiedad asignada ni se afirma precisión arbitraria para acumulaciones extremas. Antes de ampliar el alcance monetario práctico o declarar equivalencia casilla a casilla con Renta WEB, el padre debe revisar conjuntamente precisión de cuotas y redondeo. Las expectativas de integración entregadas conservan todas sus fracciones y pasan sin redondeo intermedio.
