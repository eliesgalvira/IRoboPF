# Primera revisión monetaria independiente de P5a

**No apto para cierre.** Candidato congelado `producto-p5a-integracion-20261105`, parche SHA-256 `e833bcd74aaefa69c61407346af79bdafcecff150d2eba374614e99725784638`, base publicada declarada `9bac679032fd9cbfc492fc150acfea0c0fcdb9a2`. Raíz y recepción leídas sin modificaciones; no se invocó VCS. No se cambió implementación ni esperado recibido.

## Hallazgo monetario P1: habitualidad pasada reutilizada para una adquisición nueva

Localización: postimagen `lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/vivienda-rioja.ts:89–101`, especialmente 92 y 96. El predicado comprueba sólo que la primera ocupación sea anterior al límite de doce meses y que algún periodo de residencia cubra sus tres años. No relaciona ese periodo con la adquisición de 2025. El productor P5a tampoco cierra esa contradicción.

Reproducción independiente: adquisición 01/03/2025; residencia exclusivamente 01/03/2020–01/03/2023; primera ocupación 01/03/2020; ninguna excepción ni nueva ocupación. Precio 12.000, préstamo dispuesto 10.000, amortización 500, intereses 40, gastos de financiación 10, saldo inicial/final 2.000, ingreso 30.000 y consumo 27.450. El libro concilia, el capital propio es 2.500 y el incremento comparable también. El motor concede **127,50 euros en 32.2 y 382,50 euros en 32.11**, tanto en el adaptador territorial como en ambas API anuales. Debe producir cero o rechazar los hechos contradictorios; no puede conceder por una residencia abandonada antes de adquirir, sin ocupación nueva ni excepción. El cero de este oráculo no depende de resolver qué gastos integra 32.2.

Pruebas `REV-RESIDENCIA` en `revision.test.ts:39–40`: cuatro rojos, conservados en `resultados-final/propias.log`. La comparación del array demuestra los dos resultados de las API, sin interrumpirse en la primera aserción. Es un defecto del consumidor común ya presente en la preimagen y ahora alcanzable desde P5a; no se atribuye al arreglo de fraccionamiento. Requiere conciliar residencia, adquisición y ocupación pertinente, admitiendo la expectativa legal de cumplimiento y las excepciones reales. No basta imponer que toda primera ocupación sea posterior a adquirir: puede existir ocupación previa legítima que continúa.

Fundamento primario consultado en CAS: Ley riojana 2/2020, art. 1.Dos, nuevos 32.2 y 32.11.1–2; RD 439/2007 original, art. 54.1–3, contrastado con versión 20/12/2011. La vivienda debe constituir o ir a constituir residencia habitual; un periodo terminado sin nueva ocupación no acredita eso. La remisión temporal no transforma una antigua residencia en habitualidad de la adquisición nueva.

## Dos objeciones expresas

**Intereses en 32.2: reserva no cerrada, sin cambiar esperados.** El original de Ley 2/2020 enumera expresamente amortización, intereses, cobertura y otros gastos para 32.11.1. En 32.2 remite a 68.1.3 y RIRPF54 para habitualidad y RIRPF55 para conceptos de adquisición/construcción/rehabilitación; no remite expresamente a la base de 68.1.1. El RDL20/2011 sí enumera financiación en 68.1.1, pero esa regla no queda incorporada automáticamente por citar el apartado 3. La exclusión de intereses en la comparación patrimonial de 32.2 es un indicio contextual, no una enumeración inequívoca de la base. AEAT32.2 y CONSULTA-INTERESES-ADICIONAL.json no aportan cierre adicional. Por ello no avalo incondicionalmente los 57,50 recibidos ni mis 127,50 para un caso apto; son resultados aritméticos condicionales. Tampoco afirmo que el importe legal sea 55/125 ni creo un rojo con esa premisa no acreditada. 32.11 sí tiene fundamento expreso para 172,50/382,50. Antes de cerrar 32.2 con financiación debe justificarse ese alcance o delimitarse como no representado.

**Permanencia hasta 2028: expectativa, no hecho acreditado.** La compra de 2025 no exige esperar tres años para poder deducir inicialmente. El propio art.32.11.1 contempla residencia futura; RIRPF54 y la regla de pérdida del derecho de RIRPF59 distinguen cumplimiento y regularización posterior. La residencia declarada hasta2028 en los fixtures no prueba el hecho futuro, ni un documento genérico puede crear una excepción material. Los positivos sólo son cálculos sujetos a ocupación/permanencia y eventual regularización. El consumidor exige hoy cubrir 36 meses y por ello incentiva representar la expectativa como intervalo ya cumplido. La etiqueta pendiente y las advertencias existentes evitan presentarlo como certificación fiscal, pero no autorizan afirmar permanencia comprobada. Debe quedar explícita esta diferencia al cerrar el contrato funcional. No reclamo cero únicamente porque aún no hayan transcurrido los tres años.

## Alcance revisado y conclusiones restantes

Se inspeccionaron contrato, productor, dispatcher, esquema anual, adaptador, consumidor y cambios de pruebas de las nueve postimágenes, las seis preimágenes y el parche. Se leyeron validación del integrador, reservas, manifiestos y fuentes temporales. Los originales primarios consultados están identificados por CAS/hash en `fuentes-revisadas.json`; no se sustituyeron por índices o resúmenes ni se requirió navegar.

- Financiación: la identidad precio menos disposición más amortización es correcta para este préstamo nuevo, exclusivo y aplicado íntegramente al precio. Principal final se concilia con disposición menos amortización; los pagos de intereses/gastos reducen caja sin aumentar la inversión comparada. El arreglo resta disposición una vez en base y capital, conservando todos los documentos. No encontré otro defecto de esa resta. Con el parámetro omitido vale cero y conserva las restantes ramas del consumidor; se ejecutaron sus pruebas recibidas.
- Patrimonio: cuentas nominales más vivienda a cierre menos deuda viva; excluir diferencia cierre/precio equivale a conservar coste de adquisición. ISD monetario se resta aunque se haya gastado. La comparación es condición completa de acceso, no prorrata. Se probaron igualdad y déficit de un céntimo, herencia gastada y valor cero, además de las variaciones recibidas.
- Censo e historia: sólo cuentas en euros y adquisición plena2025; otros derechos, bienes y categorías se rechazan como no representados. Historia vital, ejercicios fiscales y anticipos cierran antecedentes/reinversión dentro del perfil, sin demostrar el régimen general. Son declaraciones documentales, no una búsqueda registral o fiscal independiente.
- Identidades: se probaron saldos, principal, cuenta desconocida, censo duplicado, receptor, factura, importe, omisión de pago, signo/fecha y ejercicio fiscal ausente. Los movimientos y pagos se concilian con inventario anual y adquisición. No se acredita autenticidad documental ni se deduce la naturaleza real de un movimiento sólo por su etiqueta.
- Límites/renta/edad/consumo: límites 9040/452 y 9000/15%, condiciones de renta y edad y consumo único revisados con las pruebas propias y recibidas; cuota racional de 80 cifras propia y fronteras recibidas. La lista de 145 municipios2025 es la pertinente: Alesanco del oráculo propio discrimina frente a la lista2026. La Ley9/2025 original entra generalmente el01/01/2026; no procede aplicar aquí su anexo.

No se amplió a IP general, DT18, cotitularidad ni mezclas ELA/art81/donativos. Las demás ramas se contrastaron para regresión del consumidor, no se emite una revisión fiscal general de ellas.

## Validación ejecutada por este revisor

Pasada final `resultados-final`: **48 propias = 44 verdes + 4 rojos monetarios esperados en la revisión**, **294 recibidas verdes** (81 P5a,184 de galicia-rioja-ampliacion-2025 y29 de galicia-rioja-ampliacion-revision), tipos strict/exactOptionalPropertyTypes con servicio Effect parcheado **0 diagnósticos**, ESLint y Oxlint propios **0 errores/avisos**. Las 294 incluyen las81; no se suman de nuevo. Se eligieron para cubrir productor, ambas API, límites y ramas compartidas; no se repitieron1296. El ejecutor acepta exit1 para conservar el rojo; eso NO significa que la suite propia sea verde.

Logs/JSON contienen comandos exactos, códigos de salida, máximos muestreados y tiempos. Ejecución secuencial, maxWorkers1, heap1792MiB, timeout global45m y15m por hijo, guardia árbol3GiB/grupo6GiB sin activación. El ejecutor final fija afinidad de dos CPU antes de crear hijos. Las exploraciones anteriores no fijaban inicialmente afinidad; por ello se hizo una pasada final completa bajo esa restricción. Se conservan sus logs, incluido un fallo propio inicial de tipos por expresiones booleanas de objeto/undefined, corregido con comparaciones explícitas. Ningún reintento por guardia. El CLI effect-solutions no estaba disponible ni al cargar el entorno de pruebas; se consultaron directamente los ejemplos/API de Effect v4 locales para runSync y se mantuvo el patrón Schema recibido; no se modificó código Effect de producto.

Se verificaron antes/después1225 archivos de raíz/candidato, los hashes pre/post declarados y la reconstrucción de nueve transportes en memoria. No se ejecutó el verificador del candidato porque escribe su informe allí. No hubo cambios VCS, CI, inventario, push, instalaciones, worktree, copias completas o subdelegación. La entrega contiene únicamente pruebas, documentación y herramientas de revisión; fuentes CAS y dependencias permanecen externas. No certifico un censo global del límite150GB.

Entrega: `revision.patch` agrega sólo la prueba y este dictamen; `manifiesto.json` sella sus archivos y herramientas auxiliares. El parche normaliza los imports absolutos del ejecutor externo a imports relativos para su aplicación en raíz. No está aplicado.

**PESADO1 LIBERADO.** No quedan hijos de pruebas activos.


## Rectificación de alcance del 11 de noviembre de 2026

El dictamen precedente se conserva como evidencia histórica. Su tratamiento de
los ingresos por donación o herencia como una resta automática no acredita la
cronología de adquisición del derecho. El productor actual rechaza esas entradas
sin importe hasta representar esa cronología y su relación con el patrimonio
inicial. No se afirma una exclusión legal general de esos ingresos. Para DT18,
la insuficiencia patrimonial puede limitar la inversión computable sin anular los
intereses y gastos de financiación; véase el contrato actual de API-MOTOR.md.
