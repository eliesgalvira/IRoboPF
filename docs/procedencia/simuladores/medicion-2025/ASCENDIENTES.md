# Cuatro perfiles sintéticos con ascendiente

Los cuatro originales se capturaron mediante los controles de Open 2025, sin
editar su persistencia. Valencia devuelve 377,95 EUR, Aragón 370,04 EUR,
Castilla y León 161,25 EUR y Canarias 226,80 EUR. La ruta anual explícita
coincide en los tres primeros; Canarias devuelve 226,79 EUR. Ese céntimo queda
como discrepancia, no como coincidencia tolerada.

La restricción territorial del consumidor común impedía calcular las tres
entradas nuevas. La composición anual ahora puede admitir un único ascendiente
ordinario sin rentas ni discapacidad en Aragón, Canarias y Castilla y León,
con un titular de primer grado. Sólo lo hace con cotizaciones efectivas, base
de trabajo y sin otras deducciones o productores concurrentes. Se conservan
identidad, censo completo, fechas, residencia y conciliación exacta de la
economía del titular. No cambian las tablas monetarias.

El consumidor general de mínimos, las retenciones y la API canónica con
cotizaciones estimadas conservan su alcance anterior. No se sustituyen las
cotizaciones efectivas de estos casos por una estimación para lograr admisión.

## Equivalencia de la entrada sintética y los controles Open

Open no solicita la renta exacta ni un calendario anual para este mínimo. Su
diálogo solicita condiciones de inclusión y número de titulares. Para estas
cuatro entradas, renta cero implica el umbral de 8.000 EUR; no presentar
declaración satisface la condición relativa a 1.800 EUR; convivir todo el año
satisface la convivencia mínima. Con un solo titular, superar medio período
da el mínimo completo, sin prorrateo mensual. Estas condiciones y cuantías se
contrastan con los [arts. 59 y 61, explicados por AEAT para 2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-ascendientes.html).

La vinculación acredita esa proyección de predicados para el cálculo ordinario;
no afirma que se haya escrito «cero» o «365 días» en controles inexistentes,
ni certifica hechos de personas reales. Se rechazan otras economías, titulares,
declaraciones, censos y ámbitos de deducción en el instrumento. Los controles
de discapacidad y fallecimiento se conservan identificados y vacíos.

El mensaje 100R304 de Open exige dejar CONVIVENCIA vacío cuando sólo hay un
descendiente con derecho. Se conserva la evidencia original de esa regla y los
readbacks de cada captura. No se interpreta el código interno MESESDAFAS2.

Los mínimos ya existentes son estatales 1.150 EUR, con 1.400 EUR adicionales
para mayores de 75; Canarias aplica 1.162 y 1.414 EUR autonómicos. Castilla y
León mantiene las cuantías estatales. Véase el [cuadro AEAT 2025](https://www3.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-autonomico-personal-familiar/cuadro-minimos-personales-familiares-estatal-autonomicos.html).

Los PDF, las transcripciones reversibles SES y los controles identificados se
referencian por SHA en `observaciones.json`. Los hashes prueban integridad de
los bytes, no una firma digital de la AEAT. El contador sigue condicionado al
alcance observado y mantiene N=80.

## Revisión y adversas

La revisión independiente reprodujo 34 coincidencias de 80 y comprobó los
cuatro originales, la equivalencia de predicados y los límites de consumidores.
Detectó dos omisiones en el instrumento: no contrastaba los importes releídos
en pantalla ni los mínimos entre SES y PDF. Los originales sí conciliaban.

Se corrigen ambas omisiones: las ocho filas monetarias requieren importe
solicitado y observado únicos, y las casillas 0511, 0512, 0515, 0516, 0519 y
0520 deben coincidir con su único campo SES en el ámbito de la declaración.
Las adversas alteran valores, duplican registros, cambian ámbitos y suprimen
casillas. No se cambia ningún esperado oficial ni se oculta el céntimo canario.
