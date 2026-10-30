# Requisitos arquitectónicos: alcance realmente comprobado

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Se leyeron ADR 0005, propuesta, catorce schemas y matriz C01–C36, además de ARQ-R01–05. No se consideran contratos preexistentes implementados. Esta matriz evita presentar la suite de contenido como ejecución de las 36 pruebas propuestas.

| Requisito | Evidencia o puerta abierta |
| --- | --- |
| C01 | Codec cerrado, versión/IDs y exceso de propiedades; schema Draft 2020-12 generado. No se promueven las 14 raíces antiguas. |
| C02 | Resultado decimal textual; rechaza number y número en no-soportada. Valor observado técnico separado. |
| C03 | Inventario conserva cada ocurrencia de celda. Tabla jurídica dimensional revisada pendiente. |
| C04 | DAG iterativo, referencias, tipos, ciclo; pruebas positivas y mutaciones. |
| C05 | Hash/tamaño, revisión y pertenencia; índices exactos verificados para todos los paquetes. |
| C06–C08 | Selector explícito por fecha/base temporal, intervalos reales, frontera 30/06–01/07. No usa reloj ni descarga. Integración de fallecimiento/retroactividad en callsites pendiente. |
| C09 | No se promueve herencia jurídica: ninguna ocurrencia se acepta ni se copia por fallback. Contrato de continuidad revisada pendiente. |
| C10 | Igualdad territorial estricta, sin fallback a Navarra. Herencias territoriales requieren declaración futura. |
| C11–C12 | Estados separados, informe externo por bytes/payload/alcance; pruebas de informe ausente/alterado y payload cambiado. Política fiscal siempre pendiente. |
| C13 | Selector PDF y geometría comprobados. Reextracción de quote delegada al corpus existente, no ejecutada aquí. |
| C14–C18 | Contratos de selectores/recetas y blobs cerrados. Rotación, tabla multipágina, OCR y render reproducible son pruebas del corpus; no se repiten ni se cuentan aquí. |
| C19 | Modelo Derivation y aristas tipadas; no se evalúa texto como fórmula. Cotejo dimensional mensual/anual pendiente del puente fiscal. |
| C20–C21 | Contratos siteId/instanceId, versiones y binding explícito; repetición rechazada. Cobertura de ramas del motor pendiente de instrumentación del integrador. |
| C22 | El adaptador solo genera enlaces; no altera cálculo ni incorpora fetch. No se ha vuelto a ejecutar el motor entero sin red. |
| C23 | Enlace solo con IDs/versiones. Payload cerrado y rechazo de rutas privadas. No se acredita tráfico/referrer/logs globales del layout existente. |
| C24–C25 | Adaptador antiguo pendiente y rechazo de versiones distintas probados. |
| C26 | Objetos primero y registro mediante rename al final; fallo por objeto prometido ausente probado. No se ha inyectado fallo de proceso en cada instrucción de publicación. |
| C27 | Hash/tamaño y límite de descompresión; alteraciones de entidad probadas. No hay caché HTTP ni descarga en este lector. |
| C28 | Resolver distingue desconocido de prometido ausente; prueba real de archivo ausente. Handler 200/404 probado; catch de indisponibilidad devuelve 503. |
| C29–C30 | Sin alias latest. Snapshots anteriores conservados. CDN, Vary y coordinación entre deployments pendientes; no hay despliegue. |
| C31 | Render real de servidor y handler HTML completo, sin script en la ficha individual. No equivale a auditoría de accesibilidad. |
| C32 | Copia externa/restauración pendientes. No se afirma corpus preservado. |
| C33 | Document no admite headers ni localPath. No se inventa ETag, fecha o CSV. Adquisición sigue en corpus. |
| C34 | No se acredita autenticidad por firma ni se ejecuta nueva validación PAdES. |
| C35 | Fórmulas y originales son datos, sin eval ni HTML remoto activo. React escapa la prosa. |
| C36 | Tamaños reales y RSS de generación medidos; build, concurrencia y output tracing pendientes por alcance autorizado. |

ARQ-R01: revisión externa sin autorreferencia, hash exacto y alcance; confianza del registro es responsabilidad del integrador. ARQ-R02: unión de resultado sin cifra para no-soportada. ARQ-R03: payload público cerrado antes de hash; rutas relativas. ARQ-R04: PDF/HTML/texto/CSV diferenciados. ARQ-R05: verificación ejecutable de aristas, pertenencia, blobs y DAG; selección conocida estricta. La política de aceptación fiscal sigue cerrada y no queda implementada por estos controles.
