# Revisión independiente de IPC y cotizaciones 2012–2026

> Antecedente conservado. Los cinco defectos técnicos y el alcance vigente se
> documentan en la [corrección del 4 de noviembre](../../correcciones-cinco/INFORME.md).
> Las cifras y dictámenes de este documento corresponden al candidato anterior.

Conclusión: coincidencia documental parcial reproducida; no cierre integral ni aceptación del contrato común. No se demuestra un parámetro financiero vigente incorrecto. El adaptador tiene carencias de discriminación semántica: puede conservar una cifra y cambiar su sujeto, año, columna o período. Los discriminantes sintéticos quedan rojos; no se modifica el motor ni las fichas.

## Resultados separados

| Universo | Coincidencias | Diferencias | No verificables / otros estados |
|---|---:|---:|---|
| IPC diciembre 2013–2025 | 13 | 0 | 2012 identidad; 2026 escenario |
| Bases: posiciones físicas seleccionadas | 414 literales, parser y geometría | 0 | 3 lecturas adicionales ambiguas |
| Tipos por concepto, sujeto y año | 180 posiciones reextraídas | 0 en literales | Incluye 10 remisiones de 2020; no son 180 parámetros del motor |
| Hojas efectivas | 34 enlaces numéricos | 0 | 9 metadatos, 1 escenario, 1 representación, 1 hipótesis, 2 ceros estructurales |
| MEI consumido | 8 componentes | 0 | 22 posiciones anteriores a 2023 no aplicables |
| Solidaridad consumida | 12 componentes | 0 | No certifica elegibilidad ni redondeo |
| Casos de base ordinaria | 59 exactos | 1 diferencia de representación | Inferior a 1e-12 EUR; no es un céntimo de cuota |
| Ocurrencias AST | 265 hashes y posiciones | 0 | 155 contenedores/reglas, 63 numéricas/derivadas, 47 auxiliares |

Los universos se solapan: no se suman para fabricar un total de valores verificados. Las 414 celdas incluyen mínimas no consumidas y versiones físicas históricas. Las 265 ocurrencias acreditan posición e integridad, no otras tantas magnitudes contrastadas con fuentes oficiales. Se reabrieron 25 objetos originales por hash; el replay completo coincide byte a byte con el candidato.

IPC: serie oficial INE 50902, general nacional, base 2021=100. Se selecciona «Variación anual» de diciembre y se divide por 100; no se usa el índice ni una media anual. Se comprobó cada literal, línea CSV, hash y enlace de año. La metodología conservada acredita periodicidad mensual y carácter definitivo desde primera publicación. La serie histórica descargada no atribuye base 2021 a las publicaciones originales de todos los años. El factor es producto de tasas publicadas, con recíproco en sentido inverso; 2012 es identidad y diciembre 2026 exige escenario explícito.

SS: 14 máximas anualizadas coinciden dimensionalmente. En 2018 el dato legacy representa enero–julio, no el año completo. La ruta activa usa siete meses a 3.751,20 y cinco a 3.803,70, aplicando cada límite antes de sumar. El segundo importe está en el art. 130 de la Ley 6/2018; su vigencia depende del primer mes posterior a la entrada en vigor, no de una media anual. En 2021 la ley conserva la máxima desde enero aunque la tabla seleccionada empieza en septiembre. La remisión expresa de 2020 conserva la condición de no oposición al real decreto-ley: no autoriza extrapolar mínimas. Los sujetos total/empresa/trabajador se conservan separados; MEI y solidaridad no se reconstruyen a partir del total. Todos los contextos reales extraídos para trabajador contienen su cargo, pese al defecto del selector sintético descrito abajo.

## Defectos reproducibles del cotejador

1. `semantic_rates` asigna trabajador a la tercera captura sin comprobar el literal posterior del cargo. Una frase sintética que atribuye ambos componentes a empresa conserva las cifras y produce una fila trabajador. El discriminante exige que no se produzca esa atribución y falla.
2. `extract_rates` acepta el mismo PDF sintético de ejercicio 2024 con argumento 2025, conserva cifras y posiciones y cambia año y período. No valida la vigencia documental.
3. `bases` acepta una caja sintética rotulada mínima enero–julio como columna máxima y la extiende a diciembre por el año configurado. La geometría prueba qué cifra se extrajo, no su columna ni vigencia.

Remedio requerido antes de elevar estos resultados a validación semántica automática: ligar cargo, encabezados, columna y vigencia a selectores y evidencia específicos, rechazar los intercambios y conectar los discriminantes a la ruta efectiva. Esta revisión no implementa el remedio ni propone cambios financieros. La confianza previa en una configuración revisada puede sostener un cotejo manual delimitado; no sustituye esas comprobaciones automáticas.

## Reservas individuales

- Mínimas 2020: faltan 11 dimensiones en las obligaciones; la prórroga y el cambio del SMI requieren análisis adicional. No contrastadas con motor porque no se consumen.
- Mínimas enero–agosto 2021: faltan 11 dimensiones de ese período; la tabla de septiembre no las acredita.
- Mínimas agosto–diciembre 2018: la tabla extraída termina en julio; no se extiende al segundo período. No se inventa un importe faltante.
- Tres mínimos diarios de 2013, grupos 9–11: literal `25.10` ambiguo, con posición y rechazo del parser. Las otras 19 lecturas conservan literal, palabras, geometría y normalización comprobados.
- AT/EP 1,5 %: hipótesis empresarial del perfil, sin actividad elegible acreditada. Los dos ceros trabajador son estructurales, no celdas oficiales impresas.
- IPC 2026: escenario del 3 %, no observación; 2012 identidad no necesita una tasa consumida.
- CX-01/03: sin cierre de redondeo ni certificación de cuotas mensuales ingresables. La discrepancia de representación de la base de 2018 no acredita una deuda de un céntimo.
- Integración: las unidades y restricciones siguen siendo candidatas. El contrato común se revisa separadamente; esta revisión no lo modifica ni lo aprueba.

## Pruebas y reproducción

Los 13 tests sintéticos del candidato pasan (7 del adaptador preparatorio y 6 de enlaces). El replay local completo y `reextraer_local.py` pasan. La suite independiente `test_discriminantes.py` contiene 3 controles verdes y 3 discriminantes rojos. Los controles rechazan ausencia de fuente e índice/mes incorrectos. El control de anualización solo compara aritmética sin vigencia. También el test sintético original de 2018 solo compara aritmética sin vigencia.

Ejecutar desde la raíz con Python y dependencias gestionadas:

```sh
timeout -k 30s 20m uv run --with pymupdf==1.26.7 --with jsonschema==4.25.1 python docs/procedencia/datos-2012-2026/revisiones/ipc-ss-enlaces/test_discriminantes.py
```

Su salida roja es intencional y documenta los tres defectos; no debe presentarse como suite aprobada. Las fixtures se generan en memoria, sin originales privados, caché obligatoria, Git ni hashes históricos. `reextraer_local.py RESULTADO.json RAIZ_OBJETOS...` es una suite local explícita, requiere originales externos por hash y no es CI. `verificar_motor.mjs` es otra comprobación local de fórmula, identidad, escenario y bases intranuales, con las dependencias JS del lote; no acredita vigencia legal. Los resultados y logs de ejecución completos se conservan en la entrega privada.

Limitación operativa final: la repetición de discriminantes agotó el tiempo de espera. El resultado independiente anterior fue tres controles verdes y tres discriminantes rojos. La prueba adicional del motor y la reproducción final sin Git no se computan como aprobadas sin resultado acreditado.
