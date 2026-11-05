# Catalunya 2025 · obligación por varios pagadores

Alcance de la conexión anual por hechos. Las limitaciones siguientes delimitan
este perfil; no declaran completas todas las ramas de la deducción.

Ambas API admiten los mismos hechos efectivos con perfil
`trabajo-pagadores-catalunya-2025`, en Catalunya, individual y devengo31/12/2025,
sin familia, discapacidad, ahorro, otras rentas, compensaciones ni otras
deducciones. La canónica delega a la entrada efectiva existente; no estima
cotizaciones ni crea otra cuota. El perfil analítico anterior no acredita
pagadores y sigue rechazando este código sin libro interno conciliado.

La solicitud A40 recibe ejercicio/titular/censo/referencia y certificados por
NIF, naturaleza del pagador, concepto de remuneración, importe íntegro, ids de
rendimientos y operaciones de retenciones. No recibe una base, cuota ni booleano
fiscal de obligación. El productor laboral calcula gastos y art20 como antes.
El nuevo productor enlaza todos los ids una sola vez, exige suma por certificado
y total iguales a los rendimientos reales, concilia titular de retenciones y
agrupa varios certificados por NIF ANTES de contar/ordenar pagadores. Un NIF no
se convierte en dos por cambiar un id o expedir dos certificados. La identidad
de un certificado se compone de NIF emisor y referencia local: entidades
independientes pueden usar la misma referencia. Los identificadores laborales
y las operaciones de retención se consumen una sola vez en todo el libro.
La conciliación de retenciones acredita titularidad anual y total dentro del
contrato; no autentica el NIF real del retenedor ni su importe por certificado.

Perfil positivo: salarios ordinarios laborales/estatutarios de personas
jurídicas residentes (obligación de retener art76RIRPF), íntegros positivos.
El evaluador A40 existente decide bruto>15876 y<=22000, segundo/restantes>1500;
usa max(cuota autonómica íntegra-cuota estatal íntegra,0). Las cuotas proceden
de la única composición antes de deducciones; en este perfil ahorro=0 por su
contrato. Se conserva precisión80 con MagnitudAnual en tres campos S6; números
antiguos de céntimos siguen admitidos por el evaluador aislado. No se repiten
fórmulas art19/20/escala/DA61 ni la fórmula de la deducción.

Vigencia: art96 de LIRPF al31/12/2025 y RDL4/2024 art3.2 fijan15876/22000/1500.
RDL9/2024 elevó segundo/restantes a2500 pero la Resolución22/1/2025 BOE23/1 lo
derogó. No se extiende este corte a devengos anteriores o fallecimientos.
DL1/2024Catalunya art612-10 excluye quienes se acogieron O puedan acogerse al
procedimiento89.A. Pensionistas ordinarios de varios pagadores con requisitos
89.A no se habilitan porque no optaran. Todas las prestaciones pasivas y mezcla
empleo/pensión siguen rechazadas en este primer corte; no se simula su acceso.

También se rechazan pagadores persona física/no residente, administradores,
cursos y otras rentas sujetas a especialidad, altas RETA/mar-cuenta-propia,
IMV del titular o unidad y aportaciones de previsión; no hay atribución exclusiva
a varios pagadores en esos perfiles representados. Reducciones de base/exterior
están excluidas por el contrato existente. Los censos de altas, prestaciones y
aportaciones son hechos declarados con soporte, no certificaciones fiscales;
ninguna referencia documental autentica identidades o exhaustividad real.

Fuentes primarias y temporalidad quedan por hash SHA256/SHA512, URL, fecha y
localizador en fuentes/FUENTES.json y CITAS.json de la entrega. Se conservó la
regla regional publicada y se adquirieron bytes primarios sólo al no localizar
los originales en el CAS consultado o faltar la remisión temporal de2025. No se
ha escogido una alternativa monetaria sin fuente. Restricciones de perfil no
son denegaciones jurídicas generales de esos contribuyentes.

## Vigencia de las fuentes

Los HTML recibidos con los nombres históricos `LIRPF-2025` y `RIRPF-2025`
contienen actualizaciones de 2026. El parámetro solicitado `p=20251231` no
acreditaba una versión completa de 2025; esos originales se conservan como
recepción, sin atribuirles esa vigencia global.

Se comprueban ahora los bloques y el selector marcado en cada respuesta:
[artículo 96, versión de 23/01/2025](https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&b=147&tn=1&p=20250123#a96),
[artículo 76, versión de 30/12/2017](https://www.boe.es/buscar/act.php?id=BOE-A-2007-6820&b=123&tn=1&p=20171230#a76) y
[artículo 89, versión de 06/12/2014](https://www.boe.es/buscar/act.php?id=BOE-A-2007-6820&b=139&tn=1&p=20141206#a89).
Son las últimas versiones de esos bloques anteriores al cierre de 2025 que
muestra su historial; la evidencia de un bloque no fecha los restantes.
La modificación de 76.2.h de 2026 queda fuera del fundamento de esta conexión,
que usa 76.1.a para el perfil de persona jurídica residente.

La [Resolución de 22/01/2025](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-1136)
publica expresamente el acuerdo de derogación de RDL 9/2024. El fundamento está
en ese acuerdo, no en la firma del documento. Se conservan los umbrales y los
oráculos monetarios; esta rectificación corrige su identificación temporal.
[Huellas y localizadores](FUENTES-TEMPORALES.json).
