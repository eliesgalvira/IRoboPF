# Fuentes y oráculos

Se reutiliza P3 y se consultan documentos oficiales identificados en `procedencia/fuentes-consultadas.json`, con URL exacta, fecha UTC, bytes y SHA. No se incluyen cuerpos CAS ni se presume que el parámetro BOE `p=20251231` acredite consolidación2025: el investigador ya advirtió notas2026 en aquella respuesta.

- **L81**: [Ley35/2006, apéndice AEAT Renta2025](https://sede.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/IRPF-2025/Normativa-IRPF25/Ley-35-2006.pdf), art81.1–5, páginas46–47 y nota149: modificación con efectos2023. Sustenta alta al nacimiento, límites1200/1000, distinción diferencial, complemento y anticipos. No se usa art81bis como fórmula81.
- **R60**: [RIRPF, apéndice AEAT Renta2025](https://sede.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/IRPF-2025/Normativa-IRPF25/RD-439-2007.pdf), art60.1–2 y5, páginas20–21. Distingue mes de nacimiento, meses completos de custodia, gasto anual incluso incompleto, pago del otro progenitor y regularización del anticipo.
- **M81**: [Cuantía y límite, manual2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c18-cuota-liquida-resultante-autoliquidacion/resultado-declaracion/deduccion-maternidad-incremento-adicional-gastos-custodia/deduccion-maternidad/cuantia-limite-deduccion.html):100 por mes, nacimiento incluido y mes de cumpleaños3 excluido; precisa complemento y transición2022. Esta última no se sustituye por una marca de derecho.
- **G81**: [Cuantía del incremento, manual2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c18-cuota-liquida-resultante-autoliquidacion/resultado-declaracion/deduccion-maternidad-incremento-adicional-gastos-custodia/incremento-adicional-gastos-custodia-guarderias/cuantia-incremento-adicional.html): meses contratados completos, incluidos días no lectivos; extensión del año en que cumple3. Se usa1000×meses/12 exacto, no83,33 redondeado por mes.
- **A81**: [Requisitos del incremento, manual2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c18-cuota-liquida-resultante-autoliquidacion/resultado-declaracion/deduccion-maternidad-incremento-adicional-gastos-custodia/incremento-adicional-gastos-custodia-guarderias/requisitos-condiciones-aplicar-incremento-adicional.html): autorización de guardería distinta de la educativa exigida a centros infantiles, y separación del gasto en especie exento. Se modelan hechos de contratación empresarial, no una cifra fiscal exenta elegida por el llamador.
- **CYL5**: [Cuidado de hijos menores, manual autonómico2025](https://sede.agenciatributaria.gob.es/Sede/eu_es/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-castilla-leon/cuidado-hijos-menores.html), arts5.1/10 del TR: centro registrado, menor4 al devengo, actividad/alta parental, renta individual18900 tras mínimo, máximo1320 y coordinación con incremento estatal y ayudas. Se conserva la fórmula regional recibida, sin reconstruirla en el adaptador.

Oráculos nuevos, derivados y no ejemplos fiscales integrales certificados:

| Hechos | Derivación independiente | Resultado |
|---|---|---|
|12 meses completos, neto1200|menor(1000×12/12,1200)|1000|
|6 completos, neto900|menor(1000×6/12,900)|500|
|6 completos, neto400|menor(500,400)|400|
|6 completos con400 y parcial con100|menor(500,500)|500|
|1 completo, neto1000|1000/12|250/3|
|Menor3 todo2025, alta al nacer, sin complemento|100×12|1200|
|Cumple3 en julio, sin complemento|100×6|600|
|Nace31mayo, sin complemento|100×8|800|
|CyL:1500, ayudas0, incremento producido500, titular único|menor(1320−500,1500,1500−500)|820|
|Diferencial previo0, maternidad1200, incremento1000, anticipo100|0−1200−1000+100|−2100|

La fila CyL utiliza500 como esperado del productor alimentado por hechos, nunca como entrada pública a la anual. La comparación contra anual sin81 en pruebas sólo concilia la renta nominal del mínimo y verifica un delta normativo independiente; no se extraen los esperados81 del resultado del motor.
