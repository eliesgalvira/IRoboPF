# Productor estatal de donativos2025 y consumidores Cantabria/Murcia

Validación de autor completada en PESADO2:732 focales,290 regresiones y2TODO,
tipos strict/Effect0,Oxlint/antislop0,ESLint0 y cinco canarios rechazados. Base:
corte agregado118 sobre b9122c2b,SHA `b9c851b63110ceb31cf0f826fe97ff31de8b41f41bf16974a04bdb88b657b99e`.
Conserva E38/D51/C36/F/Aragón/histórico y sus reparaciones. La primera revisión monetaria independiente propia es favorable acotada: 155 pruebas, incluidas 49 propias; véase REVISION.md. La integración con maternidad tiene revisión separada pendiente.

## Hechos declarables

El sobre anual territorial incorpora `donativosEstatales2025`,usado por ambas API.
Sólo hechos:identidad local y DNI/NIE del titular,censo completo68.3/68.5,referencia
del censo,entidad/NIF/registros/régimen/fechas,pago bancario,certificado de dinero,
destino,carácter irrevocable sin contraprestación y elección expresa por operación.
El certificado identifica NIF de donante y entidad,inclusión art16,fecha e importe.
Se concilian con pago y período;documentos y autenticidad externa siguen declarados.

Primera rama:fundación/asociación de utilidad pública bajo TítuloII Ley49,donación
dineraria,no prioritarias ni especie. Censo con hasta una operación seleccionada.
Otras sólo pueden tener elección expresa no_aplicar;no reciben base ni franquicia.
Dos seleccionadas o dos operaciones de una misma entidad se rechazan:la franquicia
250 corresponde al conjunto,no se multiplica por entidad. No se ordenan ni optimizan
múltiples derechos. Operaciones68.5 positivas requieren otro productor;un censo
incompleto o ausente no equivale a cero. La conexión pública inicial se acota a
Cantabria/Murcia y a comprobar topes íntegros Madrid;otras interacciones se rechazan.

El40% se registra como opción de tramo restante.45% sólo con pagos/certificados de
2023/2024 y2025 de misma entidad/titular,censo histórico específico completo y
cantidades positivas no decrecientes. Si se solicita45 sin historia,se rechaza
expresamente;no se degrada silenciosamente a40 ni se infiere historia vacía.

## Productor y una composición

Las bases liquidables y ambas cuotas íntegras vienen de la misma composición.
Schema cerrado:no permite bases,cuotas,tasas fiscales o deducciones importadas.
Límite de base10%BL;tabla2025:80% de primeros250 y40%/45% del resto. Generación y
partes conservan racionales;Decimal80 sólo transporta magnitudes internas y salida.
No se consume presentación ni se pasa una base derivada al parser de céntimos.

Arts67/77:mitad de generación a cada parte,con límite propio de cuota,no negativo.
La insuficiencia no se transfiere a la otra parte ni se transforma en arrastre.
La cuota líquida resta sólo la suma efectivamente aplicada,una vez;después se
consume la regional sobre residual autonómico. Se mantiene separada la cuota
íntegra para topes normativos,por ejemplo familia numerosa Madrid. DA61 continúa
en la composición posterior existente,no se hace otra liquidación para hallar cuota.
Sin donativos,no se publica libro estatal ni se modifica el importe de otra rama.

## Conexión real regional

Cantabria recibe desde el productor base68.3/base68.5 y BL,con trazabilidad por
operación,pago y entidad.No acepta1000 como dato fiscal público. Mantiene la
fórmula revisada:min(donación,10%BL-bases estatales)*15% en fundaciones.
El censo y certificado estatal se concilian con los datos regionales antes de usar
las bases;el resto del adaptador B y su prioridad de consumo permanecen.

Murcia identifica `pago.operacionId`. La base estatal se obtiene exclusivamente
del registro de esa operación,conciliando entidad,pago,fecha,importe y soporte.
Otra operación elegida no_aplicar aporta cero por elección real,con censo completo;
una operación ausente requiere completar censo,no se le adjudica cero supuesto.
El canal interno por solicitud y pago evita rechazar bases derivadas subcéntimo.
Se sustituye el parser de esa lectura en inversiones.ts,sin duplicar fórmula fiscal.
Los demás donativos F/especie con este productor se rechazan por conexión no acotada.
Madrid10% tras resto sigue rechazado mientras falten sus bases/secuencia completa.

Si la deducción estatal quedó sólo parcialmente aplicada,se calculan sus partes
reales,pero queda pendiente atribuir la base efectivamente deducida para donativos
regionales afectados. No se inventa una prorrata inversa de la escala80/40 ni se
reduce Murcia por una deducción estatal no aplicada. El cálculo estatal aislado sí
representa cuotas bajas;la región devuelve rechazo concreto de atribución faltante.

## Fuentes y validación de autor

fuentes.json fija los bytes oficiales en CAS externo,sin cuerpos en la entrega.
La tabla AEAT2025 y el límite10% se leen expresamente. BOE LIRPF arts67/77 muestra
texto2014 aplicable y50% por parte;se ignoran notas/versiones2026. Ley49 art19
modificado por RDL6/2023 confirma tabla y referencia a69;art24 fija certificado.
No se deduce vigencia2025 del parámetro `p` por sí solo.

Oráculos independientes conservados y comprobados:300=>220/222.50;BL1000 limita base100 y
deducción80;BL3000.001 produce220.00004 sin parser de céntimos;cuotas3/200 aplican
3+110=113.CantabriaBL20000/estatal1000 desde pago/regional1500=>150.Murcia otra
operación no aplica estatal y deduce150 de300.Sin inyección pública de1000.
Pruebas adversas:censo,68.5,duplicidad,pago,certificado,entidad,fechas,NIF,45 sin
historial,partes insuficientes,topes íntegros y cuota única en ambas API.Regresiones
F se reproducen como regresión,sin reabrir su revisión. No se heredan verdes anteriores.

## Transporte e integración

Preferir `donativos.delta-agregado.patch`:19 deltas propios sobre las preimágenes
exactas del corte118 conservadas. Se preservan R1 prioridad6/R2 saldo2026–2030,
R3/N2 cronología societaria y N1/N3/N4 en familia/vivienda,con contraste N1–N4
favorable63/63 recibido. C36 H1/H2, E38/D51, Aragón e histórico conservan sus
módulos, prioridades, límites y saldos. No se sustituyen centrales antiguos.

Dos conflictos centrales resueltos: C36 conserva su límite sobre cuota íntegra y
consume residual; E38 conserva la proyección de saldos; la precisión80 mantiene
D51/F y añade donativos. El retorno conserva `limitesC36`/`saldosE38` y añade libro
estatal sólo cuando existe. No se habilitan combinaciones regionales nuevas.

Las125 rutas anunciadas por el padre añaden documentación/prueba al corte118:
este delta no toca esas altas. La raíz ya no se presume b912. El arnés resuelve
contra post propio y preimágenes118 congeladas,con referencias raíz selectivas,
y no depende de carpetas retirables. La validación de autor corresponde a este rebase.

Límites explícitos adicionales del primer subcontrato:un pago regional por
operación,una donación regional cántabra y clases conciliadas entre estatal y
regional.FondoCantabria,entidades públicas y universidades no se habilitan mediante
el certificado de una fundación de la primera rama.Otros regímenes Ley49 requieren
contrato propio. Los rojos iniciales y correcciones propias se conservan en entrega
privada;no se modifican oráculos monetarios ni las fórmulas territoriales revisadas.
