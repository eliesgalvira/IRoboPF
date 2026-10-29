# Búsquedas primarias realizadas

29/10/2026. Motor web para descubrimiento; original CAS y render para las afirmaciones nuevas. Las primeras consultas usaron `site.seg-social.es` como texto y devolvieron ruido; se corrigieron a `site:seg-social.es`. No se usaron resultados IVA, pensiones o terceros para inferir cuotas RG.

Consultas: `redondeo cuotas sistema liquidación directa decimales IT IMS`; `redondeo céntimo cuotas`; `solidaridad corrección 2025 2026 boletin`; con filtro `site:seg-social.es`: `redondeo cuotas`, `cálculo IT e IMS cuotas`, `solidaridad 07/2024 corrección`, `Fe de erratas 07/2024 pdf`, `redondeos Liquidación`, `cuotas tercer decimal`, `solidaridad redondeo`, `2026 solidaridad aclaraciones`. Con `site:boe.es`: `PJC/297/2026 Corrección`, `PJC/178/2025 Corrección`.

Resultados examinados y uso:

- [Índice técnico SLD](https://www.seg-social.es/wps/portal/wss/internet/InformacionUtil/5300/2837/2838/2841). Localizador; fecha de índice no sustituye portada del PDF CAS.
- [RED euro 2001](https://www.seg-social.es/descarga/es/168749). Adquirido, ambos hashes, p.1 renderizada: BNR 2001/4, 6 de junio de 2001. Empate de pago, sin algoritmo SLD.
- [Fe de septiembre 2024](https://www.seg-social.es/descarga/fr/Fe%20de%20erratas%20BNR%20072024). PDF en castellano pese al segmento fr; cabecera 13/09/2024 comprobada. Adquirido y renderizado.
- [BNR 10/2024](https://www.seg-social.es/descarga/es/BNR%2010). Adquirido; portada 31/10/2024 y erratas p.2. No afecta a solidaridad.
- [Avisos 2024](https://www.seg-social.es/wps/portal/wss/internet/InformacionUtil/5300/3827/5f54225d-9e3a-4010-a583-f5ba3b45be7b). Permite localizar las dos erratas, no acredita por sí solo el contenido.
- [Corrección 2025](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-7292). Art.38.3, mínimo horario; no modifica art.17.
- [Análisis 2025](https://boe.es/buscar/act.php?id=BOE-A-2025-3780&p=20250226&tn=6). Referencias posteriores a corrección y resolución de mutuas. No altera por analogía la interpretación de redondeo.
- [Índice 2026](https://www.boe.es/buscar/act.php?id=BOE-A-2026-7296). Texto inicial 31/03/2026; entrada 01/04/2026, efectos enero. Remisión AT/EP a DA61 LGSS, no tarifa de 2025 asumida atemporalmente.

La apertura exploratoria de la ruta terminada en `/27428` dio Internal Error; no se interpreta como ausencia de documentación. Las búsquedas también devolvieron ejemplos agrarios históricos y normas IVA: descartados para cerrar el contrato RG/SLD por su distinto ámbito. Las búsquedas sin un resultado específico de empate de producto no prueban que no exista tal instrucción.

Búsqueda local: extracción de todos los PDF de las 19 adquisiciones, términos `redonde`, `trunc`, `decimal`, `acumul`, `IMS`, `497`; scratch conserva texto completo y pasajes, sin modificar originales. Se revisaron citas, contextos y páginas de cálculo. El nuevo discriminante 206,75/206,76 procede de lectura visual de columnas, no de interpretar la mera presencia de un término.
