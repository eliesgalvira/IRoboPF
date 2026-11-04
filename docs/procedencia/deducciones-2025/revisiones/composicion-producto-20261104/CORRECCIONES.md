# C01 corregido e integración de composición

La revisión independiente conservada encontró que una aportación DANA de
300 EUR fechada el 1 de diciembre de 2024 generaba 135 EUR nuevos en el total
de 2025, sin arrastre identificado. El integrador reproduce el rojo antes de
corregirlo. La prueba permanente amplía la frontera a 13 de noviembre y
31 de diciembre de 2024, conserva las aportaciones de 2025 y separa el saldo
anterior de la generación corriente.

Se retira la excepción DANA en la guardia temporal de
`valenciana-2025/index.ts`. De este modo se corrigen el evaluador por hechos y
su composición: el hecho de 2024 queda excluido, sin importe, y una solicitud
aplicada excluida impide emitir el total. Un arrastre debe aportar su ejercicio,
titular, saldo y soporte. La excepción de nacimiento previo, que acredita otro
supuesto jurídico, conserva sus pruebas y comportamiento.

Fundamento: art. 5.3 del DL 12/2024, según la disposición final primera del
[DL 17/2024, página 9](https://www.boe.es/ccaa/dogv/2024/10011/r00001-00009.pdf),
y el apartado de saldos del
[manual AEAT 2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunitat-valenciana/dirigidas-personas-afectadas-dana/aportaciones-fondos-propios-entidades-que-economicas.html).
La ventana de inversiones admisibles no cambia el ejercicio de generación.

Se integran la composición, su exportación y veinte grupos del autor. Las seis
regresiones C01 de `tests/deducciones-valencianas-ejercicio.test.ts` dieron tres
rojos y tres verdes antes del cambio; después pasan todas. Tras ajustar tipos,
validación estructural y omisión de campos a las reglas estrictas del proyecto,
pasan 180 pruebas focales y los quince grupos independientes repetidos sobre
el código integrado, incluido el oráculo racional de 121 combinaciones.
Tipos y lint pasan con las dieciocho advertencias anteriores. Se ejecuta también
la exportación real, cuyo ciclo de imports el revisor había inspeccionado sólo
estáticamente.

Los cambios técnicos conservan importes y rechazos: comprobaciones de primitivos
mediante Schema, validación de listas sin perder los tipos de sus elementos y
construcción explícita de propiedades opcionales. No se desactivan reglas ni se
cambian expectativas monetarias. Una primera copia privada del arnés no resolvió
correctamente el esquema y quedó descartada; los resultados citados proceden
del checkout real, con sus logs rojos y verdes conservados.

Este cierre es del integrador, no una segunda revisión independiente. C01 es
P2; se aplica la instrucción de corregirlo con regresión sin abrir otro contraste.
El informe y los resultados originales de la revisión permanecen intactos.
La salida sigue siendo parcial, anterior a cuota y con reservas; no se activa
la automatización del catálogo ni la aplicación anual de esos importes.
