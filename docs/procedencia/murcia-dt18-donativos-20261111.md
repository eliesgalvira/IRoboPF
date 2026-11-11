# B08 — Murcia DT18 estatal_pre2013 + donativo ordinario

Conexión de ambas API anuales dentro del perfil descrito a continuación.

## Contrato

2025, Murcia, individual ordinaria, adquisición exclusiva ya admitida por producirDT18Murcia2025, única solicitud F-ampliado murcia_regimen_transitorio_inversion_vivienda_habitual con rama estatal_pre2013. Donativos dinerarios ordinarios Ley49/2002 general_40, sin historia ni operaciones68_5, sujetos a las validaciones existentes. No se habilitan donativos regionales, maternidad, ingresos identificados, inmuebles ni otras ramas Murcia/Rioja.

La nueva propiedad de SolicitudDeduccionesTerritoriales2025 es prioridadCuotasDT18Donativos2025: "dt18_antes_donativos". Se exige con ambos productores aun con cuota suficiente/cero; se rechaza ausente, inversa, duplicada, externa o huérfana. No es una prioridad imperativa proclamada por la ley: los artículos 67/77 expresan suma y suelo cero por parte. Es una selección explícita y acotada de atribución cuando la cuota resulta insuficiente. No optimiza derechos ni recibe cuotas externas.

Cada pago donativo, también no_aplicar, debe coincidir exactamente con un movimiento de consumo de las cuentas DT18 por id, documento, fecha, importe y persona. Debe ser salida, nunca donación recibida/ISD. Se rechaza reutilizar id/documento de inversión corriente, pagos originales o amortizaciones históricas. El desglose del consumo conserva saldos; no se descuenta el donativo otra vez del patrimonio ni se cambia base DT18. La igualdad textual de importes exige la misma representación EUR en ambos libros.

Secuencia: generar DT18 una vez → aplicarCuotasDT18 en cada parte → productor donativos existente con las mismas bases liquidables y cuotas residuales → atribución50/50 y cap independiente → libro territorial común con residual autonómico posterior a ambos. El F murciano mantiene consumoCompartidoDT18 y aporte cero al segundo consumo. La liquidación resta sólo cada total aplicado una vez. En el libro donativos, estatal/autonomica.integra representa la cuota de entrada al productor, aquí residual DT18; el libro DT18 conserva su entrada original. Se publica la selección en el libro común.

## Dependencia patrimonial comunicada por el padre

La concurrencia exige cumplePatrimonio positivo del productor y ausencia de movimientos donacion/herencia. Rechaza patrimonio insuficiente incluso si el núcleo actual produciría cero: AEAT2025 permite base parcial por incremento más intereses/gastos. Tampoco se da por acreditada la resta automática ISD de P5a: AEAT2025 empresas incluye renta generada sujeta o no a IRPF. Son exclusiones del perfil concurrente, no afirmaciones de pérdida legal de derecho. El núcleo DT18 ordinario calcula la base parcial por separado; esta concurrencia mantiene su requisito técnico de patrimonio suficiente. Las entradas por donación o herencia requieren una cronología de adquisición del derecho que este contrato no representa. No se devuelve un cero fiscal para suplirla.

## Fuentes temporales y localizadores

fuentes.json conserva URLs, SHA256 del documento recuperado y localizadores. Se adjuntan extractos BOE y textos AEAT consultados el 11-11-2026. Las fechas p del BOE deben ser redacciones existentes, no fechas arbitrarias: p=20251231 devolvía redacción2026 y se descartó. Para arts67/77/69/DT18 se guardó p=20221222: redacciones seleccionadas20141128/20141128/20130928/20121228, sin modificación intermedia2025 en esos bloques. Para el régimen histórico: p=20111231, arts67/77 redacción20091219 y art68 redacción20111231. La reforma publicada28-12-2012 surte efecto desde01-01-2013; no usar su supresión como norma2012.

- LIRPF DT18.2 remite a arts67.1/68.1/70.1/77.1/78 en redacción2012. Arts67.2 y77.2: suelo cero independiente. Art69.1: límite de base donativos. Ninguna de estas reglas impone transferir remanentes entre partes.
- Ley49/2002 art19 (redacción20-12-2023, efectos01-01-2024): escala250/80 y resto40, remisión límite; art24 certificado. No se cambia su productor.
- AEAT2025 8.7.1 Cuota líquida: vivienda por sus tramos y donativos por cada parte; suma y resultados no negativos.
- AEAT2025 cap16, Comprobación de situación patrimonial, párrafo de incremento inferior y nota al ejemplo: dependencia de base parcial.
- AEAT2025 cap16, empresas, último párrafo normativo: renta sujeta o no a IRPF, dependencia ISD.

Las fuentes de productores y normativa ya existentes siguen vigentes para sus hechos admitidos; esta entrega no autentica certificados ni añade derecho histórico.

## Oráculos y alcance de las pruebas

oraculos.py es una hoja de cálculo Fraction independiente, sólo stdlib, sin importar motor ni dependencias. oraculos.json contiene fracciones reducidas. Los casos son sintéticos a partir de las fixtures ya admitidas, no importes fiscales externos de una declaración. Capital3000+intereses50 da base3050 y generación228,75 por parte. Donativo300 genera220 y mitad110; base art69 no se reduce por DT18. Se ajusta el ingreso bancario al salario tras SS y el consumo ordinario para conservar los saldos inicial/final2000.

Brutos30000/17000/16500/14000; SS al6,48% (4,7+1,55+0,1+MEI0,13), inferiores al máximo anual; la API canónica las estima en perfil uniforme y la explícita recibe los hechos efectivos con esos mismos importes. Neto previo=bruto−SS, gasto2000, reducción art20 0/5470,8/6289,1/7302; bases26056/8427,6/7141,7/3790,8. Escalas estatal y Murcia2025 y mínimo5550. Cuota escasa17000: cada parte273,372 → DT18 228,75 → residual44,622 → donativo44,622 → cero. A16500 DT18 agota151,2115; a14000 ambas partes cero. El caso suficiente contrasta además la liquidación final4088,75. Fuentes de contraste local de escalas y art20: lib/dominio/normativa/datos/irpf-autonomico-2025.ts (Murcia), irpf-estatal-2012-2026.ts y reducciones/reduccion-rendimientos-trabajo.ts; laboral/cotizaciones-sociales.ts y cotizaciones-perfil-uniforme.ts (tipos del perfil contractual canónico); no se llama a esos módulos desde el oráculo.

Pruebas portables normales: tests/murcia-dt18-donativos.test.ts, fixtures y JSON. Ambas API cubren los cuatro escenarios y el donativo1000 con base limitada842,76, que discrimina una segunda resta de la base DT18, orden explícito, no_aplicar, orden físico irrelevante, duplicados regionales/donativos/movimientos, reutilización de pago/documento, fecha/importe/sentido, movimiento omitido, otra rama/regional, historia y dependencia patrimonial/ISD. El resultado conjunto y las reservas de la primera revisión se registran en el informe del corte; estos ejemplos no acreditan todos los perfiles DT18 ni todos los donativos.

