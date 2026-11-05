# Correcciones de la ampliación de Andalucía, Aragón y Catalunya

Los cuatro hallazgos independientes se corrigen sin cambiar las 195 entradas y
expectativas originales del autor ni su prueba de precisión (196 pruebas).

- AAR-01: el 9 % catalán depende de adquisición anterior al 30/7/2011 o de pagos
  para construcción anteriores a esa fecha, además del resto de condiciones.
  Una primera inversión genérica no demuestra ese hecho. El contrato distingue
  adquisición, construcción y anticipo de vivienda terminada, con referencia.
  Si la compra es posterior y el pago anterior carece de naturaleza, rechaza
  sin inventar un tipo. El anticipo de vivienda terminada conserva el 7,5 %.
  Se concilian las fechas explícitas de adquisición y primera inversión.
- AAR-02: la participación propia no puede superar el agregado familiar que la
  incluye; las proporciones no pueden superar el 100 %. Se conservan los topes
  tributarios regionales, aparte de esta comprobación de coherencia.
- AAR-03: se rechaza al contribuyente como hijo propio y a una misma persona
  simultáneamente como hijo y ascendiente en la familia andaluza.
- AAR-04: ninguno de los cuatro eventos aragoneses admite al hijo beneficiario
  dentro del conjunto de titulares que reparte su propio nacimiento/adopción.

Pasan 232 pruebas: 196 de autor, 26 expectativas independientes y diez
regresiones nuevas. Tipos estrictos/Effect, Oxlint y ESLint conformes. La única
adaptación del caso independiente del anticipo añade la naturaleza y referencia
que el informe ya especificaba; su expectativa de 678 EUR permanece intacta.
La entrada anterior sin ese dato se conserva como un rechazo adicional. Las
nuevas pruebas discriminan 29/7 y 30/7/2011, construcción frente a anticipo,
cronologías contradictorias, proporciones y el cuarto evento aragonés.

Se preservan nueve rojos originales y las recepciones intactas. Por gravedad P1,
AAR-01 requiere un contraste independiente acotado antes de integrar; los otros
tres arreglos reutilizan las pruebas independientes existentes, sin otra ronda.
No hay publicación ni conexión anual de esta ampliación todavía. Conserva
40 nuevos parciales, siete reutilizados y dos códigos enteros pendientes.
Las fuentes y localizadores de cada hallazgo constan en la recepción de revisión
`producto-deducciones-revision-a-ampliacion-20261105`; no se sustituyen normas ni
se reabre el resto de las acreditaciones favorables.

## Contraste del P1 y coherencia cronológica S01

El contraste independiente reproduce 678 EUR para el anticipo de vivienda terminada,
con 14 discriminantes y 232 regresiones verdes. Detecta S01 (P2): una compra de
2010 admite primera inversión de 2012 cuando se omite la naturaleza. Se conserva
su expectativa de rechazo sin importe y se exige primera inversión no posterior
a la compra también cuando la naturaleza es opcional. No se exige naturaleza
para una compra antigua coherente ni se cambia el tipo normativo.

La corrección es una validación de coherencia; no añade cobertura fiscal ni
modifica expectativas monetarias. Su prueba roja independiente queda preservada.

Validación posterior a S01: 233 pruebas verdes, tipos estrictos/Effect,
Oxlint/anti-slop y ESLint correctos. Las dos colecciones originales de oráculos
son idénticas y las 36 pruebas de revisión previas conservan entradas y expectativas.
