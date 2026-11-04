# Cierre monetario de C300 y una captura adicional

El lote de 300 entradas salariales de Madrid 2025 conserva **3.550 casillas
iguales, 650 ausencias oficiales y cero diferencias**. Todas las entradas son
distintas. Incluye variación de renta, cotizaciones efectivas, retenciones,
gastos y 21 casos con dos pagadores agregados en Open. No representa 300
territorios o configuraciones familiares.

La captura adicional de Andalucía tiene doce casillas presentes exactas y dos
ausencias tras corregir la cuantización de los gravámenes. El resultado es
101,04 EUR; antes era 101,03. El conjunto contiene 301 entradas oficiales,
3.562 casillas presentes cotejadas y 652 ausencias. Las otras once variantes
preparadas no se cuentan como capturadas ni comparadas.

## Hallazgos y revisión

La revisión del corte de 218 casos encontró cuatro discrepancias del artículo
20 y un defecto de lectura del journal. La [corrección monetaria](ART20.md)
conserva una sola fórmula por tramo, acota su compatibilidad observada a empleo
Madrid 2025 y mantiene Decimal fuera de su cota técnica. Sus dos extremos de
precisión tienen regresiones rojas y verdes. Las siete referencias anteriores
de Open conservan las expectativas. No se infiere el código interno del servidor.

La [revisión del transporte](revision-transporte/REVISION.md) se conserva con
su alcance original. El integrador corrige la lectura del journal sin repetir
una revisión general: siete pruebas focales y catorce portables pasan. La
comparación final revalida originales, identidades y entradas sin nuevas capturas.
El journal permanece intacto; los errores históricos y recibos sustituidos se
conservan, sin sumarlos a los 300 casos.

La [revisión andaluza](revision-andalucia/revision-informe.txt) verifica
independientemente el vínculo del formulario con Andalucía, edad, modalidad,
ejercicio, gastos y retenciones, además de los originales SES/PDF. Pasan 21
pruebas y se reproducen las siete diferencias anteriores sobre preimágenes.
No encuentra fallos bloqueantes. El integrador aplica su observación menor
para describir correctamente la cuantización en el rastro; no cambia importes.
La política [andaluza](ANDALUCIA.md) sólo cuantiza los gravámenes, sin extender
la compatibilidad binaria del artículo 20 ni cuantizar DA61.

## Identidad y publicación

El [cotejo final del padre](cotejo-final/resumen.json) fija la identidad real
del motor como base publicada más inventario, separado del código de captura.
Su [índice público](cotejo-final/comparacion.json) conserva entradas, casillas,
hashes y tamaños de originales y las dos identidades históricas de captura.
Deduplica esos mapas de código y omite rutas locales de PDF/SES; no cambia
expectativas. El recibo completo del motor y las dependencias quedan externos.
El manifiesto permite comprobar los artefactos publicados.

El primer CI previo se interrumpió voluntariamente al recibir la observación
del rastro, antes de modificar las fuentes. Su salida 143 no se presenta como
un fallo fiscal ni como un CI terminado. Se conserva y se repite completo sobre
las fuentes finales, con inventario regenerado. El [CI local final](../../revisiones/c300-ci-20261104/CI.md)
pasa los 30 comandos exactos del workflow en entorno limpio: 1.573 ejecuciones
Vitest, 234 métodos Python ejecutados y siete omisiones explícitas de originales
privados. Las 516 fuentes fijadas permanecen intactas. La comprobación de los
dos trabajos remotos se registra después del push.

La salida 2 del comparador mantiene reservas sobre hechos sintéticos; las
coincidencias son condicionadas, no aceptación fiscal universal. Las ausencias
siguen separadas de cero. El comparador de 2025 está revisado y pasa dentro de
este alcance; permite iniciar el piloto histórico autorizado, sin extender
automáticamente a 2018–2024 ninguna política monetaria de 2025.
