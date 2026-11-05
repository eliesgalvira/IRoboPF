# Presupuesto de precisión P1

600 cifras no son necesarias. Se retira esa ampliación: el contrato público
interno de composición vuelve a `20 | 80`; la rama P1 usa80, como el perfil
efectivo previo. Ninguna política global o redondeo monetario cambia.

## Cobros y operaciones realmente incorporadas

Cada cobro tiene como máximo12 enteros y2 posiciones decimales. Hasta100 ayudas
por100 cobros suman menos de10^16 euros:16 enteros+2 decimales,18 cifras
significativas bastan incluso antes de conciliar. Cada ayuda queda además
limitada por su concesión de12 enteros; las100 ayudas conciliadas suman menos
de10^14:14 enteros+2 decimales,16 cifras. Los máximos son técnicos del contrato,
no acreditación del importe legal del programa.

En P1 las API incorporan sólo esta suma finita a rendimientos ya calculados;
no admiten bases de80 decimales desde cliente. Las operaciones nuevas son
suma/resta/comparación. La renta efectiva procede de hasta100 registros de12
enteros+2 decimales; artículo20 usa coeficientes decimales finitos ya existentes.
La API canónica conserva la aritmética de sus productores de trabajo, SS y
transmisiones; no se anuncia que P1 eleve la precisión de esos productores.
Cada importe canónico en céntimos seguros es menor de10^16 céntimos; aun una
colección JS de menos de2^32 elementos suma menos de10^24 euros. Sumados
trabajo/ahorro y cobros, la cota conservadora es25 enteros y, en las partes
finitas de las escalas, hasta5 posiciones:30 cifras. Esto no acredita que el
productor heredado de precisión20 calcule exactamente todos esos extremos:
P1 conserva su alcance/aritmética. No requiere600 en composición.

Las escalas2025 de esta rama tienen coeficientes con como máximo3 posiciones
decimales; sus productos sobre los importes finitos soportados, cuotas fijas,
mínimos y restas quedan muy por debajo de80 cifras significativas. El libro
territorial mantiene sus fracciones enteras para repartos; los mínimos o DA61
con cocientes periódicos conservan la política Decimal existente. No se afirma
que una precisión finita represente exactamente un séptimo. P1 no introduce
una división Decimal nueva para atribuir la ayuda o calcular los tipos.

## 80 cifras significativas no son80 posiciones decimales

`20000.` seguido de79 ceros y1 necesita85 cifras significativas. A precisión80,
una operación de suma/resta puede perder el decimal80 aunque el constructor
admita la cadena. El contrato de magnitudes B contempla hasta18 enteros y80
posiciones decimales: hasta98 cifras significativas.

El Decimal **local** del productor se fija en100:98 cifras de un operando
interno, más2 enteros de acarreo como cota suficiente para hasta100 sumandos
acotados de esa anchura. Las operaciones reales de P1 usan menos anchura y
sumandos; la cota también preserva el transporte y discriminante interno80.
No se usa ese presupuesto para cambiar toda la composición. Los porcentajes
se producen mediante la división entera BigInt de B existente; el truncamiento
a dos decimales se limita al porcentaje fiscal, nunca a una base o un cobro.

Pruebas: los discriminantes originales de decimal80 se conservan; se añade
una suma con18 enteros y80 posiciones más4000 y una resta de10^-80. El esperado
se construye como entero/fracción independiente, sin importar la precisión o
constantes del productor. También se comprueba la cota máxima de cobros y el
máximo posterior a concesiones por operaciones racionales en Python.

## Base actual del rebase ECDF

La primera entrega partía de b912 y allí trabajo-anual/calcular.ts usaba60.
Este rebase parte de raíz actual: agregado125, parche92c6c7b56af4fcda2e752dcb20e5f4a613d8e00e358050e94b082c1bb87546b9,
que ya eleva el evaluador a80 para DA61/gastos/art80bis. El SHA actual de ese
archivo se conserva en recepción y se contrasta tras validar. No forma parte
del parche ni se copia a post/.

Se conservan los argumentos P1 otrasRentas/netoReducido y se añade una prueba
que compara DA61 con35124597/217450 con error<10^-75. Discrimina el transporte80
del anterior60 sin cambiar esa fracción normativa ni los75 casos P1 recibidos.
El contrato de composición sigue20|80; se retienen las decisiones específicas
D51/F/C36 y la política histórica de Madrid del agregado.
