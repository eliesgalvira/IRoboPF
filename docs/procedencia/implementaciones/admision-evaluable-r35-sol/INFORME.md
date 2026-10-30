# Admisión evaluable R35: implementación parcial candidata

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

La entrega aporta un IR ejecutable, un consumidor, un schema cerrado y pruebas contra APIs reales. **No completa todo el encargo RA34-01/02/04.** Los diecisiete sitios conservan admissionClosed=false, siteClosed=false, wiringAllowed=false y completeRuleAcceptance=false. No hay wiring público ni aceptación propia. Requiere continuación de implementación, contraste de integración y revisión independiente nueva de los bytes exactos.

Base del candidato documentado: `9c3edec704ead945b17e419d2e3ef0d1e8a75a29`.

## Resultado ejecutable

flujo-admision-r35.mjs traduce exclusivamente ocho funciones enumeradas de derechos.ts a operaciones de datos. El intérprete consume ese IR, sin eval, texto TS ni invocación al validador real. El artefacto versionado permite recorrer propiedades, comparar operandos, observar cortocircuito, invocar callbacks, map/filter/every/some/find, ordenar, usar Map/Set, recorrer instancias y producir success/reject/defect. Una frontera no suministrada produce pending; no se atribuye ese resultado al motor.

El schema familiar finito tiene tipos/rangos/patrones, uniones por etiqueta, arrays y longitudes, opcionales y extras prohibidos. La coherencia conserva el orden del código: sujetos, nacimiento/edad, titulares, custodia, datos repetidos por titular, residencia propia, convivencia, sujeto/titular, alimentos, vínculos/grados, fechas/constitución/mayoría/bisiesto y concurrencia. La selección conserva renta propia de cada instancia, relación, filtros de grado, prioridad, orden de nacimiento/id y empate por divisores. calcularDerechosMinimos se corta explícitamente antes del dinero y devuelve elegibles: no se presenta como cálculo completo de mínimos.

La conciliación ejecuta presencia, finite, Decimal HALF_UP a céntimos, igualdad propia y lado de umbrales incluso sin descendientes. El programa de netos expresa reduce/semilla, SS por modo, trabajo/alquiler/ganancias y suma anterior a reducciones. Hay pruebas usando los puertos reales. Las fronteras de fórmulas siguen sin contrato ejecutable completo de dominio/salida/error; no son terminales cerrados.

Deducciones conserva [0], sin búsqueda posterior. Option exterior none continúa; interior None/Some rechaza con motivos distintos abreviados. Agregado manual ??0 es otro programa y otra propiedad, sin legitimación jurídica. Los mensajes y el catálogo real requieren todavía contraste exacto.

Los quince años territoriales tienen transportes separados: base en 2014/2015, fallecimiento en 2015/2022/2023 y comunidad siempre. Esta representación NO resuelve aún callbacks/imports/selecciones internos: no satisface por sí sola el cierre territorial exigido. Los defaults/presencia del adaptador son ejecutables; faltan spread temporal, proyecciones y SS completa. No hay programa completo de wrapper/layer/ConDerechos, retención y creación final de sitios. Se conserva la información histórica sin ampliar el predicado R32.

## Consumidor, dominio y límites

verifyEvaluableAdmission comprueba schema, referencias locales/funciones, unidades de propiedad, cobertura de sitios, obligaciones y cierre derivado antes de comparar receta. El schema permite pendientes. La receta/pines son integridad adicional. Falta endurecer los IDs de sentencias, tipos de operandos, instancias y fronteras: no se afirma resistencia general a adversos.

Dominio declarado: datos planos de derechos 2025 y Decimal para renta; no getters, proxies, ciclos o coerciones arbitrarias. Esta precondición todavía no se valida de forma ejecutable. No se extrapolan resultados a objetos JS ajenos ni se llama rechazo del motor a un fuera-del-contrato. Las trazas separan referencias/instancias y valores Decimal en forma serializable; su semántica completa todavía necesita revisión independiente. Las anclas automáticas son rangos de nodos; las manuales son rangos amplios de archivo.

A32-P01/P02 siguen como conductas actuales: números negativos admitidos en la API anual y strings JS ajenos a enums. No hay conclusión fiscal sobre ajustes ni endpoint HTTP inventado. Los supuestos materiales SS analíticos no son controles ejecutados.

## Evidencia y controles

Los controles propios prueban schema/coherencia, conciliación y frontera, selección/divisor contra API, Option, defecto null, campos iguales de productores distintos, transportes territoriales, pendientes/cierre y mutación semántica de umbral sin pin. Las pruebas de puertos territoriales acreditan transporte, no su semántica interna. Tipos iniciales fallaron por formas JS deliberadamente ajenas al tipo; se conservan. Se separaron los ensayos JS y los seis tests TS tipados. No se atribuye typecheck a los datos JS. Lint inicial falló dos typeof y se corrigió, sin desactivar reglas. Resultados finales y comandos en los archivos anexos.

## Preservación y revisión pendiente

CAS propio de fuentes técnicas en scratch, SHA256/SHA512, tamaño y recuperación por base/ruta en CAS.json; preservarlo antes de retirar este checkout. No hay nuevos originales fiscales ni PDFs. V5 r2 conserva corte R26 y pin 2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88, sin reexportarlo. Crossa sigue v1 desfasado, copia local del mismo dueño/casa, sin independencia o custodia remota.

El manifiesto conserva la composición histórica del paquete. La composición de los otros 48 sitios quedaba fuera de este candidato.
