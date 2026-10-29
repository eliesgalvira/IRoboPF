# Validación de la entrega

Base indicada: `d9ff49c7`. Se entregan archivos nuevos, sin commits, bookmarks, push, PR, deploy ni reparación de índices. El enlace local node_modules solo permite usar dependencias compartidas; no se instalaron ni modificaron. No se ejecutó Next build, suite legacy, ni inventario.

Comandos (entorno `nix shell nixpkgs#bun nixpkgs#nodejs -c`):

- `bun run test -- tests/actividades-economicas-2025.test.ts --maxWorkers=1`: 56 pruebas correctas.
- `bun run lint:oxlint -- lib/dominio/irpf/actividades-economicas tests/actividades-economicas-2025.test.ts`: correcto, sin desactivar reglas.
- `bunx --no-install eslint lib/dominio/irpf/actividades-economicas tests/actividades-economicas-2025.test.ts`: correcto. También se ejecutó previamente ESLint global, correcto.
- `flock /tmp/irobopf-validacion-pesada.lock bun run typecheck`: aplicación y vendor: correcto, código de salida 0.

Se consultaron effect-solutions list, data-modeling y testing, así como Schema.ts/SchemaParser.ts de Effect v4. El primer typecheck señaló uso de opciones en Schema.is y un predicado de objeto no booleano; corregidos usando decodeUnknownResult con exceso de propiedades a error y comparación explícita contra undefined. No se ocultaron diagnósticos.

La suite recorre los 18 ejemplos históricos, compara cada etapa numéricamente y no modifica las expectativas documentales. Los ejemplos llamados `trade-*` comprueban únicamente las fórmulas bajo hechos de cliente único; la entrada TRADE real tiene prueba separada de rechazo. Los importes no se redondean a céntimos: se comprueban, entre otros, G=1999.9995, reducción baja=0.00405 y las fronteras del adicional.

F01: cuatro fronteras de fórmula aislada. F02: otras rentas/desconocidos. F03: gastos 30%, RETA y amortización incluidos. F04: ingresos sujetos 70%. F05: vinculación/TRADE. F06: 50% y comparación por empleador, sin sumarlos. F07: regularización/devolución rechazadas. F08: coeficiente elegido 25%, sin imponer 26%. F09: altas intermedias rechazadas. F10: límite de saldo histórico documentado. F11: categoría desconocida. F12: pagos separados/deduplicados; no se calcula cuota líquida. F13: ventana de primer positivo y siguiente, sin extensión por pérdida. F14: conjunta/múltiples actividades. F15: artísticas/irregulares/subvenciones. F16: 600.000, exceso y anualización. Los cinco casos de la revisión se traducen en rechazos o comprobaciones del contrato; no se interpreta el fixture de 2026 como normativa implementada de ese año.

Se añaden pruebas del adaptador con pérdida, datos runtime inválidos, propiedades adicionales, fechas inexistentes, duplicados económicos con ID distinto, categorías desconocidas e historia de renuncia. El contrato restringe además el IVA a recuperación plena. No se hace una simulación de Renta WEB ni se afirma aceptación fiscal por el número de tests.

Una defensa adicional contra acumulada positiva en un activo puesto en uso en 2025 hizo fallar el fixture F10 inicial. Se corrigió la historia del fixture, conservando el saldo documentado y la expectativa de cuota100. El cálculo de acumuladas históricas no está reconstruido por esta vertical; el saldo histórico es un dato documentado condicionado y requiere revisión.

Los hashes y el parche describen integridad de la entrega, no autenticación de documentos ni interpretación normativa. El padre debe revisar el código nuevo y reconstruir el inventario después de integrar; se conservan íntegros los resultados históricos de ambos auditores.
