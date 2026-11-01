# Correcciones comprobadas de Galicia y La Rioja

La [revisión independiente](../../revisiones/e/informe.md) detectó tres citas del manual pertenecientes a otras deducciones y un certificado con fechas contradictorias aceptado por el cálculo parcial. Sus reproducciones se conservan. La corrección no acredita una liquidación completa ni resuelve las remisiones normativas pendientes de las 49 fichas.

## Citas y páginas

Se sustituyen las citas de cuantía de ayudas por incendios, deportistas de alto nivel y ELA por sus propios pasajes del manual: páginas 388, 390 y 399. En los tres casos se aplican tipos medios de gravamen a las ayudas integradas en base liquidable. Los porcentajes del 15 % citados antes pertenecían a eficiencia energética, aldeas modelo y libros, respectivamente.

Las referencias riojanas de bicicletas y celiaquía se limitan a las páginas 504 y 520. Las páginas adicionales pertenecen a otras deducciones. Se conservaron las referencias anteriores y su rectificación en las comparaciones del paquete. No cambian importes de las fichas.

Se han inspeccionado visualmente las cinco páginas y reextraído las 1.048 citas del lote desde sus originales fijados. Las coordenadas corregidas quedan dentro de las secciones que identifica la [delimitación independiente](../../revisiones/e/limites-manual.json).

## Coherencia del certificado

El artículo 1.Cuatro de la [Ley 9/2025 de La Rioja](https://web.larioja.org/bor-portada/boranuncio?n=38181676-5-HTML-574314-X) exige certificado con diagnóstico definitivo y fechas de emisión y diagnóstico. Su disposición final única.2 da efectos a esta deducción desde el 1 de enero de 2025. Los pasajes originales están identificados por `rioja_enfermedad_celiaca-original-3` y `rioja_enfermedad_celiaca-vigencia-1` en el paquete E.

Se rechaza un diagnóstico fechado después del certificado que supuestamente lo acredita. Es una validación de coherencia del soporte, no una condición tributaria adicional: se siguen admitiendo el diagnóstico y la emisión en la misma fecha y los diagnósticos de 2025 certificados en 2026. El ejemplo original, con emisión en enero y diagnóstico en diciembre de 2025, producía un parcial de 250 euros; ahora devuelve `no_soportado`.

El resultado parcial corresponde al contribuyente indicado, también cuando se solicita modalidad conjunta. Un descendiente común con derecho al mínimo para dos titulares produce 125 euros por titular. El agregado continúa rechazando estos parciales. Para calcular el total de una declaración conjunta faltarían sus integrantes y su correspondencia con los titulares; no se amplía aquí ese contrato.

## Validación y alcance

Antes de corregir se reprodujeron diez fallos: dos de fechas, tres de contenido de citas, tres de pertenencia a sección y dos de paginación. Después pasan 159 pruebas focalizadas y de regresión, incluida la reproducción independiente del certificado. Tipos y lint del código cambiado pasan. El verificador documental completo comprueba los 351 registros contra el CAS externo.

Los controles están en `tests/deducciones-procedencia-2025-e-correcciones.test.ts`; el contraejemplo original permanece en `revisiones/e/casos-propios.ts`. El verificador histórico de esa revisión espera las tres atribuciones erróneas y debe ejecutarse sobre su versión anterior, conservada en el commit `8735223356240125b12e9eaf106a08a079de7695`. El verificador de citas del lote comprueba los bytes actuales. Las correcciones requieren contraste independiente; las cadenas históricas y remisiones enumeradas por la revisión siguen pendientes.
