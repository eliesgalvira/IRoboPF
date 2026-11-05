DICTAMEN: favorable acotado. Primera revisión independiente monetaria P2.
No se han reproducido errores bloqueantes de importe ni publicaciones fiscales
incorrectas dentro de la rama admitida. No se modifica producto ni expectativas
recibidas. El derecho y la autenticidad de documentos externos no se certifican.

Candidato: producto-donativos-rebase-anual-20261105, 19 deltas/16 TS.
Parche SHA256 d96793276d2a445a2eb140c69f54ee810772c32aa9cf58533704d22164a6b732.
MANIFIESTO SHA256 b4cd579be8dc4816ba68a73fa5affaf2224ec9a392e412dad9ff078923b9552d.
Base: virtual agregado118, equivalente a lib pública 3bcec2b08cb1cc21292ca41851d73df4f3c28f19;
no b912 desnudo. Se verificaron todas las pre/post del manifiesto y el arnés
verificó dependencias y fuentes externas antes de cargar módulos. El listado
vitest-modulos.json fija 210 módulos; los 16 TS candidatos coinciden con post.

ALCANCE NUEVO Y EVIDENCIA
49 casos propios portables en tests/donativos-p2-independiente.test.ts, imports
relativos públicos. 106 pruebas recibidas selectivas: P2, B37 y 40 oráculos Madrid.
Estas últimas son regresiones de las conexiones tocadas, no una revisión nueva
B/F/histórico. No se reauditan F/N1-N4, E/D/C, Aragón, ELA ni maternidad.

Productor (lib/dominio/irpf/deducciones/donativos-estatales-2025/productor.ts):
- líneas73-81: censo, DNI/NIE, titular, 68.5 y cardinalidad; líneas88-108:
  duplicados, NIF, certificados, fechas y titular/entidad histórica.
- líneas110-125: base10%BL, 250 al80%, resto40/45%, mitades limitadas por cuota,
  sin transferencia ni arrastre. Oráculos propios249.99=>199.992;
  250=>200;250.01=>200.004/200.0045;300=>220/222.5;BL0=>0;
  BL0.01=>0.0008;BL1000=>80;BL3000.001=>220.00004;
  cuotas3/200 y200/3=>113;1.001/2.003=>3.004.
- Sensibilidad: BL3000+10^-66 mantiene220+4*10^-68. No se redondea una base
  derivada a céntimos ni se cambia la precisión global de Decimal.

Conexiones:
- b-ampliado-anual-2025/index.ts:60-74: Cantabria obtiene base68.3 real del
  productor y límite compartido. BL20000/base estatal1000/regional1500=>150;
  BL20000.001=>150.000015;BL5000=>0;BL25000=>225. Se rechazan censo ausente
  y atribución parcial de bases. No se acepta inyección pública de bases/cuotas.
- donativos-estatales-2025/regionales.ts:5-17 y
  territorial-f-ampliacion-2025/anual.ts:216-237: Murcia concilia operación,
  entidad, pago, documento, fecha e importe. La operación no_aplicar da cero
  por elección explícita, otra ausente exige completar censo. Mismo pago con
  BL1000 produce regional100;BL2999.999 produce0.00005. Otra operación
  no_aplicar produce150, sin restar la base de la seleccionada.
- Murcia parcialmente aplicada: estado no_soportado y aplicación
  pendiente_hechos, motivo atribucion_base_estatal_con_cuota_insuficiente;
  total regional0, libro estatal113 preservado. Cantabria devuelve rechazo.
  No se confunde una aplicación pendiente con un derecho fiscal completo.
- Madrid: íntegra1000=>tope500;íntegra200/residual90=>90;
  íntegra100/residual0=>0. Se conserva la cuota íntegra para calcular topes.
- liquidacion/composicion-anual.ts:403-418,722-768: una sola composición,
  resta estatal efectiva una vez y calcula DA61 después de donativos.
  Ambas API verificadas con límites249.99/250/250.01/301.37; la API decimal
  conserva subcéntimos. Con bruto16000, DA61 consume sólo el remanente
  positivo inferior a340 y el diferencial queda0. API canónica rechaza otro
  territorio/año. Las restricciones de modalidad/fallecimiento se leyeron en
  líneas407-408; no se presenta el productor interno como una API territorial.

FUENTES PRIMARIAS CONSULTADAS EL2026-11-05
https://www.boe.es/eli/es/l/2002/12/23/49/con
Arts19/24: tabla250/80/40,45 con continuidad no decreciente y certificación.
Texto con última modificación20-12-2023; regla aplicable2025. Se distingue
art19 IRPF de arrastres del art20 del Impuesto sobre Sociedades.
https://www.boe.es/eli/es/l/2006/11/28/35/con
Arts67/69/77: mitad por cuota, no negatividad, límite10%BL; se contrastan los
artículos, sin usar modificaciones ajenas posteriores como norma2025.
https://www.boe.es/buscar/act.php?id=BOCT-c-2008-90028
Art2.4:15% y límite conjunto con bases68.3/68.5. La versión histórica
p=20241230 se identificó, pero su recuperación repetida dio timeout. El
art2.4 del consolidado vigente mantiene esa regla; la nota de modificación2026
no modifica el apartado4. No se extienden otras deducciones2026 a2025.
https://www.boe.es/buscar/act.php?id=BOE-A-2011-10542
Art1.Dos.1 y2:50% y minoración por bases de las cantidades donadas; última
actualización24-07-2025. No se resta base correspondiente a otro donativo.
No se conservan cuerpos legales completos ni se certifica autenticidad externa.

RESERVAS NO BLOQUEANTES
Una operación estatal seleccionada; primera rama dineraria Ley49, régimen y
certificados declarados, sin especie/prioritarias/68.5 positivo. Cantabria una
donación y Murcia un pago regional. La atribución de bases ante insuficiencia
no se implementa ni se inventa. Son restricciones expresas del ALCANCE recibido.
Otros rechazos declarados (régimen temporal acotado, censo vacío, combinaciones
no implementadas) no se califican como un error monetario de la rama admitida.

ROJOS PROPIOS CONSERVADOS
pruebas-01: fixture tarjeta frente al requisito regional transferencia; se
corrige medio, no importes. pruebas-02: se esperaba excepción, pero el rechazo
Murcia es un resultado pendiente; se exige estado/motivo concreto.
pruebas-03/04: dos hipótesis propias incorrectas: diferencia de cuotas canónicas
ya redondeadas puede diferir1c de redondear la deducción; donación grande sigue
limitada por10%BL y no agota necesariamente la cuota antes de DA61. Se mantienen
los oráculos exactos y se comprueba el remanente real. Fuentes de cada rojo
preservadas. Ningún esperado recibido se modifica.
Tipos iniciales: include del arnés fuera de su base, después literal anual
ensanchado y fecha de fallecimiento string en fixture propio; se corrigieron
los tipos y se retiró esa variante mal tipada (control de producción leído).
Oxlint inicial: doble aserción del adversario; sustituida por decodeUnknownSync
contra esquema público. No se cambia código de producto por estos rojos.

RECURSOS Y ENTREGA
PESADO2 exclusivo de esta revisión; Node24.20.0 máximo3072MiB, un worker,
sin paralelismo de archivos; timeout -k30s por orden de script/prueba.
Sin instalaciones, inventario/CI global, capturas Open, worktrees, VCS mutante,
publicación ni subdelegación. Raíz sólo lectura; entrega selectiva fuera de raíz.
El manifiesto fija pre/post de lib raíz y del candidato, artefactos, parche y
módulos efectivos. PESADO2 liberado al finalizar los controles propios.

CIERRE REPRODUCIDO
pruebas-06.log:155/155;tipos-05.log:0;oxlint-02.log:0;eslint-01.log:0.
Los 16 TS del delta (15 módulos de producto + test recibido) coinciden en
pruebas. Tipos propios cargan los15 módulos de producto con SHA correcto;
no se revalidan tipos del test recibido. Todas las fuentes cargadas conservan
su hash. lib raíz pre/post idéntica. PESADO2 liberado, sin procesos propios.
