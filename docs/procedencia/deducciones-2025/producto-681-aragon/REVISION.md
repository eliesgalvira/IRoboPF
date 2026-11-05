# Revisión y corrección del certificado del artículo 68.1

La primera revisión independiente identificó REV681-01, de gravedad alta: la conexión estatal rechazaba certificados relativos al ejercicio 2025 por haberse expedido en 2026 o 2027. El artículo 68.1.5 exige acreditar los requisitos del ejercicio de adquisición, sin imponer esa restricción de fecha de emisión. La sentencia TSJ Madrid 765/2024 aporta un caso concreto concordante, consultado en una reproducción editorial y no en copia directa CENDOJ. No se presenta como doctrina universal.

El integrador reprodujo los siete casos independientes: tres correctos y cuatro fallidos por la restricción, incluidas ambas API. Eliminó únicamente esa guardia. Se conservan el ejercicio acreditado 2025, la fecha civil válida no anterior a la suscripción y la conciliación de contribuyente, entidad, escritura, adquisición y referencia del certificado. El antiguo test que esperaba rechazar una emisión en 2026 se sustituyó expresamente por una fecha imposible, 29 de febrero de 2025; no se alteraron los cinco oráculos monetarios del autor.

La validación final pasa 297 pruebas en ocho suites, incluidos los siete casos independientes. Tipos estrictos y diagnósticos Effect sobre 242 archivos semánticos, ESLint y Oxlint terminan sin diagnósticos. Cinco controles deliberadamente erróneos verifican la detección de fallos del arnés. Se conservaron dos errores de tipos iniciales, corregidos mediante una condición booleana explícita y la comprobación separada de cada tipo de resultado de API. No cambian las fórmulas ni los esperados.

Se comprobaron 708 huellas de raíz, los oráculos y siete fuentes de revisión. Las pruebas usan las postimágenes fijadas, con auditoría de ruta y hash. Una suite a la vez, timeout por orden e hijos, heap de 1.792 MiB y guardias de 3 GiB por árbol y 6 GiB por grupo. La validación final no activó guardias.

El [contraste independiente del defecto grave](CONTRASTE-CERTIFICADO.md) es favorable: reproduce las cuatro rojas y pasa 236 pruebas, incluidas siete recibidas y 17 nuevas propias. La primera revisión no sustituye ese contraste ni el CI completo de la integración. Los certificados y la exhaustividad patrimonial siguen siendo hechos documentales sin autenticación automática; los requisitos futuros conservan su seguimiento condicionado.

Las fuentes y sus localizadores están en [FUENTES-REVISION.json](FUENTES-REVISION.json). Los fallos y las versiones recibidas se conservan en la entrega externa, junto con el parche exacto de corrección.
