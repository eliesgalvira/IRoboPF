# Contratos autonómicos 2025: entrega candidata

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Base del candidato documentado: `d9ff49c7`. Los cambios de fuentes requieren reconstruir el inventario antes de integrar.

## Resultado y frontera de integración

Se exige ejercicio y territorio en el helper heredado. Se filtra antes de sumar, también cuando un diccionario conserva entradas de otras comunidades. El catálogo 2025 rechaza 2024/2026 y territorios desconocidos. La pantalla de liquidación, que ya era de 2025, declara ese ámbito y limpia entradas y consignación agregada al cambiar territorio. No hay rediseño ni cambios de liquidación de cuotas.

El módulo `contratos-2025.ts` añade un contrato por solicitud con ejercicio, territorio, contribuyente y modalidad. Distingue `evaluacion_automatica`, `calculo_parcial`, `importe_externo`, `excluida` y `no_soportado`. Toda interpretación conserva `aceptacionFiscal: pendiente`. El agregado nuevo rechaza parciales, desconocidos, ámbitos ajenos y solicitudes repetidas; no los convierte en cero. No es el límite de cuota ni una certificación fiscal.

**Limitación material:** los perfiles nuevos no están conectados a los controles antiguos de la pantalla. Estos conservan aritmética parcial, ahora identificada como tal; el filtro territorial sí está conectado. El helper numérico antiguo no adquiere validación fiscal por recibir un ámbito. El integrador no debe presentar esta entrega como sustitución completa de todas las rutas antiguas ni como siete contratos jurídicos íntegros. La conexión de perfiles exige nuevas entradas; aquí se respeta la propiedad limitada del componente a ámbito/estado. No se han eliminado silenciosamente todas las capacidades existentes.

## Cobertura nueva

- Andalucía: evaluación ordinaria individual, hijos/eventos/titulares identificados, 200 por hijo y otros 200 por múltiple; mitad entre dos titulares; incompatibilidad exige elección; acogimiento requiere 90 días y ausencia de ayuda. No admite doble identidad acogimiento/adopción ni añade bases suprimidas. Despoblación y conjunta devuelven no soportado: clasificación municipal y composición pendientes. La lista de titulares con derecho es un hecho suministrado, no una investigación de residencia de terceros.
- Madrid: bases general/ahorro y familiar por período, ventana evento y dos siguientes, incremento de múltiple únicamente en el período del evento, reparto por progenitores convivientes. Resultado parcial: faltan composición y modalidad histórica por ejercicio; no se declara derecho adquirido por verificar números.
- Canarias: cálculo parcial por hijo con orden general y orden de discapacidad separados. Los órdenes son datos suministrados; no se deducen de historia familiar. Faltan rentas/remisiones, supervivencia y convivencia. El agregado impide aplicarlo automáticamente.
- Murcia: cálculo parcial de gastos comunes por hijo, minorados por ayudas; 20%, límite 1000 por hijo, dividido entre titulares en individual. No admite introducir gastos ya divididos y volver a repartirlos: la entrada documenta gastos comunes. Base 30000/50000; faltan centro, etapa, derecho al mínimo, pagadores, convivencia y facturas.
- Rioja: personas identificadas, certificado y diagnóstico, reparto 250/n y cero real para colección vacía. Efectos 1/1/2025 expresos en Ley 9/2025, DF única.2. Resultado parcial: mínimo y vínculo conyugal suministrados externamente. No se inventa un requisito de renta.
- Catalunya: exclusiones de base >30000 y socio temporal; en los demás casos se devuelve no soportado con requisitos pendientes. No se implementan arrastres ni se atribuye cobertura integral por pasar una exclusión.
- Extremadura: detección de incompatibilidad viudedad/trabajo por contribuyente. Distintas personas no se confunden; falta evaluación completa de ambos derechos. El agregado nuevo comprueba también dos consignaciones incompatibles del mismo titular.
- Consignación profesional: ámbito, titular, código, importe y referencia de soporte. Mantiene un importe gallego externo sin corregirlo arbitrariamente a 250. La referencia no prueba que exista el expediente. Valenciana no recibe la regla candidata de 98,50.

## Evidencia

Se consultaron los informes A/B y sus revisiones, contratos prioritarios y casos; se conservan intactos todos los resultados históricos (191 y 196 decisiones, con aceptaciones de carencia distintas de aceptación de regla).

`fuentes.json` registra 12 originales consultados con hash y tamaño comprobados contra CAS. Se reextrajo texto con pdftotext, no OCR. Andalucía: BOE-A-2026-945 pp. 79 y 93. Canarias: BOC 256/2025 pp. 153–154. Catalunya: BOE-A-2025-10270 pp. 18–19. Madrid: BOE-A-2024-5610 art. 4 y 18, y BOE-A-2025-3303. Murcia: BOE-A-2019-2039 art. 56.Uno. Rioja: BOE-A-2026-991 art. 1.4 y DF única.2. Se reutilizaron originales locales autorizados: no hubo nuevas adquisiciones.

Las citas detalladas siguen en las carpetas de revisión, sin copiar selectores ni cambiar su estado. No se generaron facsímiles nuevos, no se validaron firmas/CSV y no se cerraron todas las cadenas modificadoras. Hash correcto = integridad; fórmula correcta en un caso = exactitud aritmética; alcance legal = interpretación; aceptación fiscal = revisión independiente pendiente. Ninguno implica automáticamente el siguiente.

## Pruebas

`rojas.txt`: tres fallos reales del helper anterior: contaminación andaluza y herencia 2024/2026. Después del filtro pasan. `rojas-contratos.txt` registra fallo de importación antes de crear la API nueva: es prueba de ausencia de implementación, **no** reproducción de una fórmula fiscal incorrecta. Las reproducciones fiscales históricas siguen en los informes de auditores; no se afirma haber vuelto rojas esas fórmulas mediante una interfaz que antes no existía.

Pruebas mantenidas: A→B→A andaluz y madrileño; rechazo de personas fraccionarias/negativas; gemelos y reparto andaluces; pérdida por 89 días y frontera 90; incompatibilidad; orden canario separado; Madrid frontera de base e historial ausente; Murcia tope por hijo y por titular; Rioja cero/reparto/certificado ausente; exclusiones catalanas; incompatibilidad extremeña por persona; consignación gallega; rechazo de parciales/duplicados en agregado. No se hizo montaje React ni navegación de navegador: el cambio de estado se revisó por código.

Comandos desde la raíz, Nix bun/nodejs: `bun run lint`; `flock /tmp/irobopf-validacion-pesada.lock bun run typecheck`; `bun run test tests/deducciones-ambito.test.ts tests/deducciones-contratos.test.ts tests/deducciones-autonomicas-aplicadas.test.ts tests/deducciones-autonomicas-2025.test.ts --maxWorkers=1`. Sin build ni legacy pesado. node_modules es un enlace de lectura; no se instaló ni mutó.

## Decisiones, objeciones y costes

1. Exigir ámbito en helper existente. Objeción: rompe llamadas de un argumento. Motivo: no inferir jurisdicción de entradas residuales. Coste: actualizar consumidor y tests; llamadas externas deberán pasar ámbito.
2. Limpiar estado al cambiar comunidad y filtrar también en dominio. Objeción: se pierden entradas al volver. Motivo: la consignación agregada carecía de identidad territorial. Coste: reintroducirlas; una futura colección por ámbito podría preservarlas. La prueba de dominio demuestra que el filtro funciona aunque no se limpien.
3. Mantener aritmética antigua como parcial. Objeción: aún puede transmitir cuantías incompletas a liquidación. Motivo: no hay hechos en los controles antiguos para sustituirla por evaluación integral y el componente tiene propiedad limitada. Coste: deuda explícita de conexión y revisión antes de anunciar cálculo automático; no es cierre del defecto fiscal de cada fórmula antigua.
4. No sumar parciales en API nueva. Objeción: menor cobertura aparente. Motivo: no convertir desconocimiento en un derecho ni en un cero. Coste: consignación explícita profesional mientras falten hechos/cadena.
5. Andalucía restringida a ordinaria individual. Objeción: quedan fuera supuestos frecuentes. Motivo: no certificar municipio ni conjunta desde una casilla. Coste: no soporte explícito y conservación de consignación.
6. Decimal en contratos nuevos. Objeción: no prueba política legal de redondeo. Motivo: evitar errores binarios evitables y redondear resultado a céntimos. Coste: política candidata de resultado, no aceptada para toda liquidación; no cambiar globalmente redondeos históricos.
7. No reinterpretar aceptaciones de carencia. Objeción: se pide ampliación sustantiva y queda trabajo. Motivo: 111/183 carencias aceptadas no validan los derechos. Coste: contratos parciales y revisión jurídica adicional; entrega incompleta respecto de automatización integral de siete territorios.
