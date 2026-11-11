# Orígenes de 2024 en la anual de 2025

Ambas API anuales comparten los siguientes productores y el libro de cuota. Los hechos declarados deben conciliarse; el motor no autentica documentos ni acredita todos los perfiles de una deducción.

## Renovables de Murcia

`historiaRenovablesMurcia2024` reconstruye una instalación fotovoltaica de 2024 y su saldo por insuficiencia de cuota para 2025. El perfil comprende un empleo anual ordinario, cotizaciones efectivas, edad de 18 a 64 años en origen, vivienda habitual en pleno dominio individual y primera franja de base inferior a 35.000 euros. Quedan fuera otros orígenes, rentas, familias, inversiones nuevas de 2025 y tramos no representados.

La inversión neta genera el 50 %, con tope de 7.000 euros. Las ayudas admitidas se limitan a concesiones identificadas del programa 4 del RD 477/2021, conciliadas con titular, instalación y cobro; otras ayudas requieren clasificación previa y se rechazan. El receptor de cada pago bancario debe ser el instalador identificado. La anual recibe hechos, no base, cuota o saldo calculados por el cliente.

La composición de 2024 cuantiza artículo 20 y gravámenes a céntimos HALF_UP antes de propagar base y cuotas. Cuantiza también la generación; registra por separado exceso matemático sobre el tope y ajuste de cuantización. Cinco observaciones oficiales PDF/SES respaldan esta política en los casos descritos en [la revisión B05](../../revisiones/B05-GRANT0-revision1-conciliacion.md). Fueron capturadas en noviembre de 2026 sobre Open del ejercicio 2024, con identidad sintética. No acreditan todo Open2024 ni una declaración autenticada.

| Bruto / cotización | Coste neto | Base general | Cuota autonómica y aplicación de 2024 | Generación | Saldo |
|---|---:|---:|---:|---:|---:|
| 17.000 / 1.000 | 10.000 | 8.707 | 299,92 | 5.000 | 4.700,08 |
| 18.000 / 1.000 | 10.000 | 11.457 | 561,17 | 5.000 | 4.438,83 |
| 20.000 / 1.000 | 10.000 | 16.147,85 | 1.069,66 | 5.000 | 3.930,34 |
| 30.000 / 2.000 | 10.000 | 26.000 | 2.294,90 | 5.000 | 2.705,10 |
| 30.000 / 2.000 | 10.000,01 | 26.000 | 2.294,90 | 5.000,01 | 2.705,11 |

El consumidor aplica el saldo de origen 2024 al residual de 2025 una sola vez, después de agua en la concurrencia admitida. Conserva vencimiento 2026 y no vuelve a registrar generación en 2025. La elección no_aplicar y las demás concurrencias quedan fuera del perfil. La norma de origen es [Ley 4/2023, artículo 55.Tres](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-2045), con [explicación AEAT2024](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2024-deducciones-autonomicas/comunidad-autonoma-region-murcia/inversion-instalaciones-recursos-energeticos-renovables.html). La clasificación de ayudas usa la DA5.4 de la [LIRPF seleccionada a 24/12/2024](https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&tn=1&p=20241224).

El dictamen monetario B05 de la misma primera revisión queda favorable y cerrado dentro de este perfil, con evidencia conciliada por valor: `revision-conjunta-02` registra 863/863 pruebas en 15 archivos, incluidas las 85 de B05; `tipos-04` termina con salida 0 para tipos globales strict y configuración Effect. Los siete archivos de producción B05 y los esperados monetarios permanecen iguales a los contrastados. Las capturas usan campaña 2024, reglas `N000086471`, modelo `0.09`, versión visible `1.24`; no se extiende su alcance a todo Open ni a otros perfiles.

Se conserva la roja anterior `revision-conjunta-01` (862/863): su único fallo fue la expectativa de Failure para canónica2027, una entrada deliberadamente fuera de contrato. Esa llamada arroja `[DecimalError] Invalid argument: undefined`, sin Failure de dominio ni liquidación. El test final caracteriza esa excepción; **no prueba caducidad fiscal ni rechazo tipado canónico2027**. La explícita2027 mantiene Failure; la conservación del saldo y el vencimiento2026 se comprueban por separado dentro del perfil2025. O4 permanece como reserva de diagnóstico, sin alterar fórmulas o importes. `lint-02` estaba en curso en el relevo: no se atribuye verde de lint, CI, inventario ni publicación. El [dictamen completo](../../revisiones/B05-GRANT0-revision1-dictamen-monetario.md) conserva ese estado de la revisión; la validación posterior del integrador se registra al final de este documento.

## Vivienda rural de Castilla-La Mancha

La rama `clm_adquisicion_rehabilitacion_vivienda_zonas_rurales` admite una compra individual en 2024 con precio aplazado al vendedor, sin intereses, saldado en 2025, y aplicación histórica positiva con cuota suficiente. No extiende las otras deducciones D51 ni incorpora hipotecas, rehabilitación, ISD u otros patrimonios.

El productor deriva los cortes patrimoniales desde cuentas, movimientos, adquisición, valoraciones y deuda nominal. Concilia apertura y cierre entre ejercicios, precio, pagos, acreedor, documentos, salarios y vencimiento. Comprar crea el activo por su precio y la deuda pendiente; pagar reduce banco y deuda. Excluye las variaciones de valor al comprobar el incremento. Los agregados fiscales externos de patrimonio no se admiten.

El libro salarial de 2025 debe coincidir con el bruto y retenciones de la anual. La API explícita concilia también rendimiento y cotizaciones efectivas. La canónica no proporciona ese último dato: se conserva como ausente, sin equipararlo a su estimación salarial. Los certificados y cobros nominales aportan los hechos bancarios patrimoniales.

La base aplicada en 2024 se mantiene separada de cuota generada exacta y cuota efectiva en céntimos. Por ejemplo, base 10.000,01 produce generación 1.500,0015 y cuota efectiva 1.500,00; no se reconstruye la base dividiendo esa cuota. La edad de origen deriva del nacimiento y se concilia con la edad actual. Certificados repetidos no aumentan rendimientos.

Fundamento: [Ley 8/2013 de CLM, artículo 12 ter, versión seleccionada 31/01/2023](https://www.boe.es/buscar/act.php?id=BOE-A-2014-1368&tn=1&p=20230131), vigente en los dos ejercicios del perfil; LIRPF2024 anterior; [Código Civil, versión seleccionada 01/03/2023](https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763&tn=1&p=20230301), artículos 1450, 1462, 1500 y 1501. Se comprobó la versión realmente devuelta. Las peticiones de cortes que devolvían consolidado de 2026 se conservaron y descartaron como acreditación histórica.

## Adecuación de vivienda vacía en Galicia

Se corrige la explicación del rechazo temporal: no falta un productor que cree un saldo de esta deducción en 2024. El incentivo entra en vigor en 2025 y la redacción con efectos para ese ejercicio imputa al año de constitución del arrendamiento. Una obra y un pago de finales de 2024 pueden formar parte de un expediente admitido con arrendamiento en 2025; no crean por ello un saldo fiscal de 2024.

La [Ley 5/2024, artículo 2.Tres y DF3.1](https://www.boe.es/buscar/doc.php?id=BOE-A-2025-2145) y la [Ley 5/2025, artículo 2.Dos/Tres y DF3.2.a](https://www.boe.es/buscar/doc.php?id=BOE-A-2026-3385) acreditan esa secuencia. Permanecen separados los límites de base total y anual, los excesos de base y la deducción no aplicada por insuficiencia de cuota. Los contratos anticipados con eficacia posterior y otras configuraciones civiles no representadas siguen fuera del perfil, sin afirmar una prohibición legal universal.

## Validación de la unión y decisiones

La unión final pasa 863/863 pruebas en 15 archivos, incluidas 85 independientes de Murcia y 61 de CLM. Pasan los tipos globales strict con diagnósticos Effect, los tipos auxiliares, Oxlint sin avisos y ESLint sin errores (27 avisos heredados). También pasan 16 pruebas de procedencia. Estos resultados preceden al CI integral, al inventario regenerado y a la publicación; no los sustituyen.

La [primera revisión CLM](../deducciones-2025/clm-historia-factual-20261112/REVISION-01-CIERRE.md) cerró R1–R4 sobre 778 pruebas; los ajustes posteriores afectan sólo a auxiliares de tests y quedan comprobados en la unión de 863. La [revisión Galicia](../../revisiones/galicia-vacia-vigencia-20261112.md) acredita la secuencia normativa, con el discriminante de obra/pago de 2024 y constitución de 2025 incorporado por el integrador. La revisión Murcia conserva O4: la excepción canónica con ejercicio 2027 fuera de contrato no acredita un rechazo tipado ni una caducidad fiscal.

Se integran estos perfiles porque ya derivan importes desde hechos conciliados y tienen evidencia independiente dentro de sus límites. Se mantienen los rechazos de ramas no representadas y los originales de los fallos. El punto 4 continúa abierto para perfiles y concurrencias pendientes.
