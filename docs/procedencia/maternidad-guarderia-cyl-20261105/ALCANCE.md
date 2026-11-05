# Productor81 y primer consumidor CyL · candidato ligero

Se implementa una rama estatal nueva: madre biológica residente individual2025, mínimo por descendientes conciliado, alta al nacimiento y convivencia estable sin custodia especial. El mínimo identifica y concilia; por sí solo no concede art81. La admisión deriva del calendario y de hechos adicionales, sin un campo `cumple` ni importes fiscales aportados. Cálculo condicionado, aceptación fiscal pendiente y primera revisión monetaria independiente pendiente.

## Contrato y producción

`maternidad2025` contiene beneficiaria, residencia, censo completo de hijos/progenitores, nacimiento y doce filas mensuales por hijo. Cada fila identifica cobros positivos de complemento de infancia y períodos contratados. Se contrastan vínculo biológico de primer grado, fecha y mínimo efectivo de la composición; se rechazan niño/progenitor iguales, omisiones y duplicados. Se incluyen los meses vacíos: no se deduce ausencia de una lista parcial.

La madre debe tener un período de alta que cubra el nacimiento. Altas posteriores, prestación al nacimiento, adopción/acogimiento, otras beneficiarias, custodias especiales, cambios familiares, residencia parcial y antecedentes de cobros2022 requieren sus ramas y se rechazan con motivo. No se certifican documentos porque se declare una referencia.

Los centros llevan NIF, municipio y acto con autoridad, clase, fechas y referencia. Primera autorización soportada: apertura/funcionamiento municipal para guardería o educativa para centro infantil. Cada contrato se concilia con centro, autorización y mes; los cambios de centro dentro del mes requieren una futura unión de períodos. Año en que cumple3: se exige calendario escolar ordinario de septiembre2025 identificado; otros calendarios no se presumen. Las fechas civiles se validan sin normalizar silenciosamente febrero u otros días inexistentes.

Las facturas identifican niño (por pertenencia al registro), mes, centro, concepto y pagos reales por progenitor. Los pagos empresariales son operaciones separadas con empresa, empleado, contrato directo de custodia y nómina; se concilian con la actividad nominal por cuenta ajena. Se deriva la especie exenta de esa rama de servicio empresarial, sin aceptar un total fiscal `especieExenta42`. Enseñanza art42.3.d, reembolsos en dinero y otras especies quedan pendientes de clasificación propia. Las ayudas se imputan íntegramente a facturas identificadas; ausencia de atribución, destinatario ajeno, exceso o reparto compartido no producen cero ficticio.

Salida por hijo/beneficiaria: doce meses con motivos, maternidad devengada, incremento racional, gasto neto, gasto de meses completos y ayudas regionales, más anticipos140 cobrados, separados. Cada cobro y operación se identifica y no puede duplicarse; cobros de otro ejercicio o beneficiaria quedan pendientes de regularización propia.

## Composición anual y CyL

La composición común invoca el productor una vez después de calcular los sujetos con mínimo y antes de los consumidores autonómicos. Ambas API reciben ese mismo libro. El ajuste compartido al resultado resta maternidad e incremento y suma anticipos efectivos después de los pagos, sin tocar cuota autonómica ni duplicar su consumidor. El libro conserva racionales; la presentación clásica conserva céntimos y rechaza salidas fuera de enteros seguros. El rastro tiene una etapa81 y refleja el ajuste en la fórmula diferencial.

Primera selección regional:

```ts
{
  maternidad2025: hechosMensuales,
  deduccionesTerritoriales2025: {
    solicitudes: [{
      lote: "CYL81",
      codigo: "cyl_cuidado_hijos_menores",
      hechos: { hijo: "s-2", eleccion: "centro" }
    }]
  }
}
```

`CYL81` referencia al niño del libro; no admite pagos duplicados, meses ni una cuantía estatal. El adaptador reutiliza `cuidadoMenoresCyl`, con el incremento de ese niño, sus pagos de meses completos, ayudas y titulares conciliados. Comprueba ubicación/registro autonómico, actividad y alta de progenitores durante el cuidado, actividad propia representada en la anual y mínimo exclusivo. Primera rama un niño y un titular; otros titulares o varios niños requieren techo agregado y atribución nominal, no una deducción externa ni un supuesto cero. Los pagos de padre/madre cuentan íntegros para el estatal; esto no autoriza automáticamente su atribución regional. Gasto empresarial en especie aún requiere esa atribución regional.

Los incrementos estatales periódicos se conservan exactos; si CyL necesitara transmitir uno de divisor distinto de factores2/5, se rechaza esa conexión regional sin aproximarlo. El estatal sí conserva su resultado. El consumidor común sigue aplicando una sola cuota y conserva las prioridades B. Reutilizar un pago o documento81 en otro consumidor regional se rechaza; su uso nominal en `CYL81` es el enlace previsto, no una segunda factura.

Los contratos D51 anteriores y sus revisiones no se editan. La vía antigua `D51/cyl_cuidado_hijos_menores` conserva sus reservas; esta vía explícita evita aceptar sus meses/pagos separados como si estuvieran conciliados con81. No se habilita hogar, Murcia guardería, el resto de F ni otras regiones por inferencia. Las ayudas compatibles autonómicas se distinguen del gasto neto estatal por su programa; referencias y clasificación siguen condicionadas a hechos externos.

## Base, entrega y validación

La base de esta recepción es virtual: raíz128 publicada en3bcec2b08cb1cc21292ca41851d73df4f3c28f19, con lib/tests intactos, más el postELA revisado de parche7ba0c90b690ae13bd02d720cd1046942982afab48ec9c20e501a54684f405208. Se reciben únicamente18 fuentes/pruebas P1 y los D51/Madrid finales necesarios, por SHA en contexto/. Las ocho preimágenes centrales virtuales están en pre/; las ocho originales e intermedias se conservan separadas. La entrega anterior y la raíz siguen intactas. No se copian carpetas operativas anteriores ni P2.

Se conservan los centrales ELA, art20/DA61 y su canal80, libros, conciliadores, F/C36/Aragón y cuota/prioridades B. Dos guardas, antes de preparar ingresos o libro81, rechazan explícitamente la combinación ELA+81 con la misma causa en ambas API; no se da un cero ni se afirma denegación de un derecho. La herencia de Alcance no abre ese cálculo. ELA individual y maternidad individual mantienen sus caminos. Véase SOLAPES.md para P2, todavía no integrado.

Tras el rebase ligero se asignó PESADO1 explícito: validación autor completada con838 pruebas correctas, logs y rojos conservados; los controles pendientes se completaron al reasignar PESADO2; no se ejecutan inventario ni CI global. Se prepararon pruebas unitarias y ambas API, incluidas cuota0, anticipos separados, CyL820, calendarios, pagos, autorización, rechazo de desconocidos y productores ausentes. Los oráculos racionales se derivan de las fuentes y se verifican con Python `Fraction`, no de salidas del motor. El verificador ligero coteja SHA, estructura y reconstrucción de ambos parches; no ejecuta TypeScript.

Tras completar pruebas, tipos con canario Effect, antislop con canario y ESLint procede primera revisión monetaria independiente; ninguna fase equivale a certificación externa de derechos.

Se preserva la aritmética80 de DA61/gastos/art80bis y el canal80 ya presentes en la raíz: calcular.ts y el contrato de trabajo no forman parte del parche. Los comandos de regresión preparados incluyen Aragón2, F monetaria/N1–N4, C36 y contraste CF, D51, E38, B37/A40 y ámbito histórico. El turno de autor PESADO1 está asignado; resultados finales en VALIDACION-AUTOR.md.

Estado final de esta fase: tipos limpios finales0 y canario antislop rechazado correctamente en PESADO2, sin repetir838 pruebas ni modificar fuentes. Controles de autor completos; pendiente primera revisión monetaria independiente después de la fusión del padre con P2 revisado, detallada en VALIDACION-AUTOR.md. No hay cierre fiscal ni ejecución de CI global por este autor.

## Identidad entre libros (corrección R1)

Los identificadores de pago designan pagos en la declaración y las referencias documentales designan documentos. Una misma clave de pago no puede describir pagos diferentes entre guardería y donativos; la repetición se rechaza como inconsistencia del censo. Las claves de pago y documento pertenecen a clases diferentes. La etiqueta `operacionId` del donativo sólo enlaza operación, pago y certificado dentro de ese libro: no se compara con claves de pagos o facturas de guardería. Una coincidencia entre clases distintas conserva el cálculo. Esta conciliación nominal no autentica documentos ni descubre un pago oculto con otra identidad.
