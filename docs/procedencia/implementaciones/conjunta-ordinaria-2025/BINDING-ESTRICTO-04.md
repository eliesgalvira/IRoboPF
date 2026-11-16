# Correspondencia de las conjuntas sintéticas con Open 2025

El verificador contrasta la entrada con la persistencia SES, los controles observados y el PDF de la misma captura. No calcula el impuesto ni convierte su resultado en una coincidencia: el medidor compara después el diferencial presentado por la API.

El alcance probado comprende ocho unidades matrimoniales, con un único salario del declarante, cónyuge sin rentas y un hijo. Los dos perfiles monoparentales requieren evidencia propia y permanecen fuera de este verificador.

## Comprobaciones

- El parser SES conserva todas las instancias, campos, tipos, indicadores y secciones vacías. Rechaza duplicados y gramática ajena. El orden de los titulares no determina su identidad. Sólo omite el contenido opaco de `COD_TRAMITE`, `DF_DATOS_SI` y `DF_AVISOS`; ningún importe se excluye.
- La entrada identifica miembros distintos, perceptor, ejercicio, territorio, censo completo y ausencia de otras rentas. Los gastos específicos y las cotizaciones distintas de Seguridad Social deben ser cero en este perfil.
- Declaraciones y resúmenes contienen exactamente `DECLARANTE`, `CONYUGE` y `CONJUNTA`. Se cotejan identidad, nacimiento, residencia, hijo, salario, cotizaciones, retenciones y agregados por titular. Los campos `CAC_D`, `CAC_C` y `ZCCAD` deben corresponder al territorio de la entrada.
- Los inventarios de controles y los catálogos observados se comparan completos. Cada control se enlaza con el HTML del mismo paso. Las acciones monetarias requieren solicitud explícita y lectura posterior; sus reglas específicas se describen en [Readbacks monetarios](BINDING-LOTE11-05.md).
- El PDF debe identificar a los miembros, la opción conjunta y el perceptor. Salarios, mínimos, bases, cuotas, retenciones y resultado se cotejan con SES. La huella del conjunto de líneas extraídas conserva también las restantes casillas.

Los hechos anuales de convivencia, opciones de declaración, custodia y rentas exentas proceden de contratos ficticios explícitos. No se presentan como hechos jurídicos autenticados por Open. El expediente externo y la entrada se cotejan por sus campos, además de sus huellas.

## Integridad y alcance de la evidencia

Una referencia generada a partir de una captura fija sus bytes y censos para revisión; no constituye por sí sola un oráculo independiente. Los originales se conservan y cualquier derivación mantiene su vínculo de procedencia. La ausencia de un campo no prueba un cero ni una opción legal.

Las capturas iniciales sin los cinco controles monetarios necesarios permanecen como antecedentes no contabilizados. Las nuevas capturas aportan esos controles para los ocho matrimonios. El caso Aragón-02-v2 conserva además una adición explícita de autoridad, sin modificar el expediente original contradictorio.

La validación focal reúne 75 comprobaciones: parser y censos, adaptador monetario, adversas de revisión y autoridad externa. Pasan tras corregir la comprobación territorial, los límites del censo y la lectura del expediente. Las ocho capturas completas superan el cotejo privado; la incorporación a la medición exige también evidencia pública reproducible y comparación fiscal.
