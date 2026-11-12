# Revisión y corrección de identidades familiares

La revisión independiente de la unión, con gpt-6.1-sol y esfuerzo high, ejecuta
510 comprobaciones propias. Pasan 500 y diez respuestas corresponden a cinco
variantes de dos defectos. Compra compartida y alquiler conservan sus fórmulas
y controles; intereses y unión reciben dictamen desfavorable por H2 y H1.

H1 admite títulos exclusivos incompatibles: una vivienda figura comprada por
el contribuyente y a la vez alquilada todo el año por otro familiar que declara
ser su propietario exclusivo. Se conceden 1.320 euros. La guarda de compra
ahora contrasta la identidad con los alquileres censados antes del retorno de
propietario único, también con neto de alquiler cero. Mantiene los inmuebles
distintos y el alquiler del hijo adulto ajeno al título de otra vivienda.

H2 admite la misma cuenta exclusiva entre dos familiares y altera sus bases.
En el control valenciano elimina indebidamente una deducción de 180,93 euros.
El censo ahora concilia cuentas y liquidaciones antes de producir bases, con
las mismas claves del productor individual: entidad e identificador. Rechaza
la contradicción sin deduplicar importes ni elegir un dueño. Las mismas
etiquetas en entidades distintas y las cuentas distintas siguen admitidas.

El contraste independiente posterior cierra ambos defectos: 172 escenarios,
344 comprobaciones por las dos API, todas conformes. H1 conserva 60 controles;
H2, 284, incluidas permutaciones de personas y cuentas, duplicidad separada de
cuenta y liquidación, controles positivos y límites regionales. Las anualidades,
cuota y deducción valenciana se recalculan con fracciones propias y fuentes
oficiales. Los dos módulos corregidos sólo añaden las guardas de identidad;
el resto de sus bytes y los otros once módulos revisados permanecen intactos.

El integrador repite los 510 controles iniciales sobre el POST y pasan todos.
Las 26 regresiones nuevas reproducen 14 fallos PRE y pasan completas después.
La regresión ampliada detecta 12 fixtures anteriores con las mismas etiquetas
de cuenta y liquidación para cónyuge e hijo. Se distinguen esas etiquetas por
persona, sin cambiar importes ni expectativas; las entradas contradictorias
quedan preservadas en las regresiones nuevas. PRE y POST se conservan por valor
en la entrega. No se suman estas repeticiones a los controles independientes.

La revisión comprueba la extracción literal del núcleo inmobiliario y sus
hechos, los exports previos y el rechazo de los nuevos perfiles por Andalucía
y Murcia. Las fuentes primarias verificadas incluyen los dos CTE madrileños,
la normativa de individualización y los manuales AEAT de 2025. Los índices
adjuntos a los tres alcances conservan sus referencias y huellas.

R52 mantiene las fronteras externas y las puertas cerradas. R36 conserva una
limitación previa: su admisión completa falla por `TryStatement` tanto en la
imagen revisada como al sustituir en memoria las fuentes por la base publicada.
Se preserva ese PRE; esta entrega no certifica una ejecución completa de R36.
La aceptación fiscal y la equivalencia con Open siguen pendientes fuera de los
perfiles declarados. El CI posterior se registra por separado.
