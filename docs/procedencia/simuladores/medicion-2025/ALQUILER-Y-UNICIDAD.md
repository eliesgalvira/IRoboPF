# Preparación de alquiler y unicidad de la muestra

La muestra mantiene 80 perfiles y los pesos territoriales originales. El nombre
de un expediente no distingue dos perfiles económicos idénticos. Antes de su
primera captura se sustituyen Aragón-02 y Madrid-13 por versiones con salarios
distintos; sus originales y cambios se conservan en
`revision-unicidad-pendientes.json`. No se heredan resultados oficiales.

Aragón-02-v2 conserva el objetivo conjunto matrimonial, con salario de
47.000 €, cotizaciones de 3.055 € y retenciones de 6.580 €. Madrid-13-v2
conserva el objetivo de asalariado arrendador, con salario de 32.000 €,
cotizaciones de 2.080 € y retenciones de 4.480 €. Los demás hechos y los
objetivos permanecen iguales. Los originales siguen siendo pruebas de regresión
fuera del denominador cuando proceda.

El productor de trabajo y alquiler reutiliza el censo inmobiliario, los gastos
laborales y la composición anual. La renta inmobiliaria anterior a su reducción
interviene en los límites del artículo 20 y de la DA 61; el rendimiento reducido
se integra en la base. El perfil inicial exige un inmueble, contrato de diciembre
de 2024, rendimiento positivo y ausencia de reducciones adicionales. La API
explícita utiliza cotizaciones efectivas. La técnica canónica conserva su
contrato de cotizaciones estimadas y no se presenta como entrada equivalente.

## Corrección del oráculo asturiano

La [escala publicada por la AEAT para Asturias en 2025](https://www3.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-principado-asturias.html)
fija una cuota acumulada de 1.751,36 € para una base de 17.707,20 €, con un
tipo del 14 % sobre el siguiente tramo. El primer oráculo reconstruía esa cuota
sumando tramos y obtenía 1.751,364 €. Esa diferencia causaba dos rojos de un
céntimo; no era un defecto del productor.

Con base de 30.350 € y mínimo autonómico de 6.105 €, la fórmula publicada da
`1751.36 + (30350 - 17707.20) × 0.14 - 6105 × 0.09 = 2971.902`.
La cuota estatal es 3.108 € y las retenciones, 4.200 €: diferencial exacto
1.879,902 €, presentado como 1.879,90 €. Con la base canónica de 30.356 €,
el diferencial exacto es 1.881,642 €, presentado como 1.881,64 €.

Se corrigen el oráculo racional y los dos esperados de revisión. Las versiones
originales se conservan en la evidencia de validación. El código fiscal no
cambia por esta corrección. Estas pruebas no sustituyen la captura Open del
perfil mixto ni acreditan nuevas coincidencias.
