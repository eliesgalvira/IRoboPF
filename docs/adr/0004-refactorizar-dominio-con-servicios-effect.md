# Refactorizar dominio con servicios Effect

El dominio fiscal se refactorizara a Effect v4 usando servicios para capacidades con frontera clara, no para cada funcion pura. Las capacidades raiz seran **Auditoria de progresividad en frio**, **Liquidacion anual del IRPF** y **Procedimiento de retencion**, compuestas con servicios compartidos para parametros normativos, politica monetaria, cotizaciones, rendimientos, bases, minimos, escalas, deducciones y explicacion.

**Considered Options**

- Envolver funciones existentes con `Effect.fn`: conserva comportamiento a corto plazo, pero no elimina estados irrepresentables ni hace explicitas las dependencias.
- Crear un unico `TaxEngine`: centraliza la entrada, pero contradice la separacion entre legacy, liquidacion anual y retenciones decidida en ADR-0003.
- Crear servicios por cada helper puro: maximiza granularidad, pero produce un grafo ruidoso y oculta las capacidades reales del dominio.
- Crear servicios por capacidad de dominio: mantiene composicion, testabilidad y lenguaje ubicuo sin convertir aritmetica simple en infraestructura.

**Consequences**

Los fallos recuperables como **Resultado no soportado** viajaran por el canal de error esperado de Effect. Las liquidaciones se organizaran como etapas nombradas que producen valores intermedios tipados y observables; el rastro educativo se derivara al final desde esos valores. La seleccion entre modo compatible legacy y modo canonico se hara mediante capas, especialmente para politica monetaria y redondeo.
