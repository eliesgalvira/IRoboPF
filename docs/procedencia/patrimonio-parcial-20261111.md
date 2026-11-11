# Capital patrimonial y financiación de vivienda

El núcleo DT18 calcula la inversión propia computable como el menor entre el
capital pagado y el incremento patrimonial no negativo. Después añade intereses
y gastos de financiación documentados, sujeto al límite anual de la modalidad.
El [ejemplo oficial de la AEAT para 2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c16-deducciones-generales-cuota/deduccion-inversion-vivienda-habitual-regimen-transitorio/condiciones-requisitos-caracter-general/comprobacion-situacion-patrimonial.html)
explica una base de 6.300 euros: amortización de 8.000, incremento de 5.300 e
intereses de 1.000. La regla regional riojana conserva su requisito independiente.

Un incremento positivo insuficiente para varias modalidades con capital requiere
una asignación entre ellas que este contrato no representa. Se rechaza con causa
concreta. Los proyectos que sólo pagan financiación y los incrementos no positivos
no presentan esa ambigüedad: en estos últimos el capital computable es cero.

Las cuentas bancarias identifican cuándo se cobró una donación o herencia, pero no
necesariamente cuándo se adquirió el derecho ni si éste pertenecía al patrimonio
inicial. Ante esas entradas se rechaza el perfil, sin calcular un cero fiscal ni
atribuir una exclusión general a la ley. `isdExcluido` se conserva por compatibilidad
del transporte y vale cero en los perfiles admitidos; no acredita una resta legal.

Los originales consultados, sus cabeceras y hashes se conservan en el CAS externo.
El manual de 2025 se identifica por su ejercicio aunque se haya publicado en 2026.
Los resultados PRE y los esperados antiguos se conservan con las rectificaciones:
un déficit de un céntimo sobre capital de 3.000 más intereses de 50 da base DT18 de
3.049,99 y cuota de 228,74925 por parte al 7,5 %. Una deducción regional no se vuelve
parcial por esa modificación del núcleo estatal.
