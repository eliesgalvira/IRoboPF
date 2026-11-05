# Primera revisión independiente anual D51

Dictamen: favorable para integrar el candidato revisado dentro de su ámbito condicionado. Sin defectos bloqueantes de importe o publicación incorrecta detectados. No acredita derechos fiscales externos ni cierre universal de las 51 deducciones.

Identidad: candidato autónomo `producto-deducciones-d51-anual-rebase-20261105`; parche SHA256 `20ed8b6d6af8b6a9838f67acc9bc8994cacbc02b57176af3654f3b0357a6c779`; base publicada `b9122c2bf61310922e856117ed4490136a628d03`, lib/tests congelados. E38 queda fuera. Raíz y candidato se han usado en lectura; no hay worktree, subdelegación, VCS mutante, instalación ni copia completa.

## Hallazgos y gravedad

Ningún bloqueo P0/P1/P2 reproducido. Las hipótesis adversas sobre rejuvenecer un hijo, inventar una persona o una discapacidad y omitir un cotitular son rechazadas: el conciliador común se ejecuta antes de la sesión D51. No se debe evaluar esa garantía leyendo sólo `d51-anual.ts`.

Observación P3 de documentación: la aritmética de `trabajo-anual/calcular.ts` pasa globalmente de precisión60 a80, también en gastos y art80bis, aunque el motivo inmediato sea DA61. La preimagen demuestra que es el único cambio ejecutable en ese archivo. Los hechos de entrada siguen acotados a dos decimales y sus sumas no alcanzan60 cifras; no se encontró efecto monetario indebido. No requiere bloquear. Se conserva vigencia2025 y rechazo2026; art20 no cambia.

La frontera interna DA61 admite80 decimales en sus cinco magnitudes calculadas y rechaza81. Los hechos `brutoServicios` y `otrasRentasNoExentas` siguen rechazando tres decimales. D51 sigue rechazando pagos con nueve decimales y campos fiscales anidados. La sesión rechaza magnitudes con más de80 cifras significativas, límite distinto del número de posiciones decimales del contrato. No se observa redondeo a céntimos entre etapas: el control BL0.079 produce exactamente0.001185 EUR. La comparación con preimágenes cubre los umbrales16576/18276 y otras rentas6500; el oráculo independiente de bruto17000 da255.2 EUR y cuota posterior2744.8 EUR.

## Fronteras y productores

Los51 códigos tienen esquema por discriminante y despacho explícito; la decodificación común y la sesión rechazan sobrantes. Ambas API alcanzan la misma composición y el mismo consumidor racional de cuota. El delta central no modifica las prioridades B: se conserva por bytes desde el comentario de orden fiscal hasta el final. A40/H12 y C2025 quedan preservados y tienen regresiones focales ejecutadas.

Se distinguen BIG/BIA de BLG/BLA mediante productores internos. El límite de donación usa BL, no BIG; el mínimo por descendientes usa su componente compartido. La cuota transportada procede del cálculo interno, no de la presentación en céntimos. El conjunto9a–f de CyL registra base aplicada y la consume secuencialmente; las pruebas de conexión verifican ambas órdenes y la rama excluida por renta. Pagos y operaciones con `valor` comparten el control de identidad; no hay segundo consumo de cuota.

Las once rutas con alguna dependencia ausente tienen repro independiente que exige la causa concreta, sin cero ficticio:

| Código | Causa comprobada |
| --- | --- |
| clm_adquisicion_rehabilitacion_vivienda_zonas_rurales | baseConsumidaAnterior |
| clm_ahorro_inversion_primera_vivienda | deducidoAnterior |
| cyl_cuidado_hijos_menores | incrementoEstatalMaternidad |
| cyl_movilidad_sostenible | deduccionEstatal |
| extremadura_contribuyentes_viudos | rentasTotales |
| extremadura_arrendadores_viviendas_vacias | rendimientoNetoReducido |
| extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler | baseHistorica |
| extremadura_inversion_acciones_participaciones_mercantiles | baseEstatalMismaInversion |
| extremadura_vivienda_zonas_rurales | baseHistorica |
| extremadura_ayudas_subvenciones_ela | integradaBaseGeneral |
| extremadura_cuidado_familiares_discapacidad | rentasIncluidasExentas |

H2/H3 con ayuda positiva0.01 mantienen su rechazo prioritario propio; con ayuda cero alcanzan el rechazo histórico. Las funciones H1–H3 de vivienda recibidas coinciden con la preimagen, incluido el máximo personal H1 después del reparto. No se reauditaron las51 fórmulas ni se repitieron sus contrastes documentales aislados. Las ramas con listas vacías pueden producir cero por ausencia explícita de elementos y no prueban un productor de la rama no vacía.

## Evidencia ejecutada

- Integridad:18 rutas, SHA pre/post contra raíz,74 rutas congeladas,51 oráculos, doce prefijos/R1/R2 y funciones H1–H3, reconstrucción exacta en memoria de entrega.patch y delta-central.patch. Hashes originales se conservan en originales-sha256.json y se vuelven a comprobar al cierre.
- 31 pruebas adversas propias: ambas API, canal interno, identidad/edad/discapacidad/reparto, BL y fracciones inferiores a céntimo, contratos80/81, pagos externos, once ausencias concretas, H2/H3 y comparación monetaria con preimagen.
- 80 pruebas de conexión anual del autor repetidas con overlay selectivo.
- 108 regresiones focales: contratos trabajo, censos A40, revisión B37 y cuotas C300. No se repitió la suite de fórmulas D51 aisladas.
- Tipos estrictos/Effect del candidato, antislop y ESLint: correctos. ESLint emite avisos de React/pages por ejecución fuera de raíz. El primer intento adicional de tipos de la revisión falló por resolver dependencias desde pre/ externo; se conserva el log y se corrige con rutas virtuales dentro de raíz sin copiar dependencias. El pase final de tipos de la revisión termina con cero diagnósticos.

Cada ejecución usa timeout -k30s, suites secuenciales y maxWorkers1 en PESADO2. Sin inventario ni CI global. No se certifica CI remoto.

## Límites y entrega

Sigue pendiente integrar y validar la composición final del padre, especialmente cualquier cambio central posterior o E38 que no pertenece a esta base. Se mantienen las restricciones de familia/censo representado, anual2025 individual ordinaria, falta de históricos y atribución de rentas mixtas, y rechazo de reparto periódico no transportable exactamente. Las pruebas no convierten la precisión80 en exactitud racional infinita.

La CLI effect-solutions no está en PATH; la copia cacheada falla por cargador dinámico NixOS. Se conservan ambas salidas y se consultó el test local de Effect y los patrones ya existentes; no se escribió código de dominio Effect ni un patrón nuevo de servicios.

Entrega privada: pruebas nuevas y fixture, parche portable de pruebas, configuración de overlay, dictamen, logs y manifiesto SHA pre/post. Sin cambios del producto. PESADO2 se libera al cierre; no quedan suites en ejecución.
