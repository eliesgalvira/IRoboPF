# Escalas autonómicas 2012–2016: análisis documental

Documento histórico: los resultados, referencias al motor y pendientes corresponden a la base examinada; no describen el estado vigente del proyecto.

Informe candidato, sin aceptación de hallazgos. La revisión independiente y las pruebas que fallen antes de corregir son requisitos previos a cualquier cambio fiscal.

## Resultado y alcance real

Se han leído las cinco tablas anuales, las referencias reutilizadas de 2025, el resolutor territorial, la integración de tramos y su uso en la liquidación anual. La matriz contiene 90 entradas: 15 comunidades de régimen común, Ceuta, Melilla y un escenario simulado, por cinco ejercicios. La matriz es un inventario de examen, no 90 comprobaciones legales aprobadas.

Se comparan 293 filas autonómicas de los manuales AEAT 2014–2016, incluidas las dos escalas baleares de 2015. Las filas ministeriales de 2012–2013 se conservan separadamente, con sus propias discrepancias y limitaciones. Se descargaron tres manuales AEAT, siete originales BOE y dos recopilaciones de Hacienda. Los manuales AEAT 2012 y 2013 no se recuperaron: las rutas históricas trasladadas a la sede actual y las rutas alternativas IRPF-2012/IRPF-2013 devolvieron HTTP 404. No se ha sustituido esa carencia por una copia privada presentada como original.

**No se ha completado la auditoría exhaustiva de vigencia que exige el encargo.** Falta recuperar los dos manuales, las disposiciones originales y modificaciones de todos los territorios, las correcciones de errores relevantes y cerrar la interpretación de cuotas acumuladas y fechas civiles. Ningún dato queda aceptado por este informe. La coincidencia con un manual o recopilación solo acredita la comparación que se describe.

## Diferencias concretas

1. **Andalucía 2012–2015, cuotas acumuladas.** El motor integra todos los tramos con precisión decimal y obtiene 9.458,316 € a base 60.000 €: half-up produce 9.458,32 €. La tabla legal publica 9.458,31 €. A base 120.000 € son 23.558,316 € frente a 23.558,31 €. El BOE-A-2012-13126, página PDF 4, art. 2.Dos, publica esas cuotas y efectos desde 1/1/2012; manuales 2014 p468 y 2015 p523 las reproducen. Candidato `mismatch`; falta cerrar vigencia intermedia y repercusión en cuota neta después de mínimos. No es un desacuerdo en tipos marginales.
2. **Comunitat Valenciana 2014–2016, cuotas acumuladas.** La integral a base 120.000,20 € es 22.304,8932 €; half-up da 22.304,89 €, frente a 22.304,90 € publicados. A base 175.000,20 €, 34.668,8932 € frente a 34.668,90 €. BOE-A-2015-1236 p58 y manuales 2014 p472, 2015 p527 y 2016 p531. La norma introductoria del ejercicio 2014 y toda su cadena siguen pendientes. Candidato `mismatch`.
3. **Canarias 2015–2016, representación de fronteras.** El BOE-A-2015-1113 p73 y los manuales publican bases inferiores 12.450,01; 17.707,21; 33.007,21; 53.407,21 y 90.000,01. El motor usa límites continuos terminados en ,00 o ,20. Los tipos coinciden. Es una ambigüedad de interpretación de intervalos y exceso sobre cuota fija, no justificación para desplazar mecánicamente todos los límites un céntimo.
4. **Fechas civiles baleares.** `fechaCivilIsoUtc` compara cadenas ISO generadas con componentes UTC. Un `Date` construido desde `2015-12-31T00:00:00+01:00` cae en 30/12 UTC, mientras `2015-12-31T00:00:00Z` cae en 31/12. Esto puede seleccionar escalas distintas para una fecha que el llamante entiende como civil. Se clasifica `ambiguous`: falta comprobar y fijar el contrato de creación de fechas, no se afirma un fallo de la UI.

La columna cuota publicada tiene valor jurídico propio: conservar solo límites/tipos no garantiza reproducirla. La revisión debe decidir si la liquidación exige cuota fija de la fila más exceso, y en qué punto se redondea. No se recomienda una corrección global de redondeo sin probar casos a ambos lados de cada frontera.

## Variantes, herencias y fórmulas

**Galicia 2014 y 2015.** El tipo único 11,5% se aplica cuando la base liquidable general es menor o igual a 17.707,20 €. Al superar esa cifra se aplica toda la otra escala, incluido el 12% inicial. Por integración, las cuotas brutas de 17.707,20 y 17.707,21 son 2.036,328 y 2.124,8654 €. El salto no debe suavizarse. La Ley 11/2013, art.67.Uno, BOE-A-2014-885 p62, y los manuales sostienen la selección. La liquidación pasa la base general al resolutor y reutiliza la escala elegida para calcular la cuota del mínimo: no debe elegirse otra escala atendiendo al importe del mínimo. Si falta la base, el resolutor devuelve la variante superior; esa salida técnica no demuestra aplicabilidad legal.

**Illes Balears 2015.** Fallecimiento anterior al 31/12: seis tramos y último tipo 21,5%; el resto: nueve tramos y último tipo 25%. A base 100.000 €, cuotas brutas 17.427,50 y 17.790,00 €. El manual p524 explicita el fallecimiento; Ley 12/2015 DF2, BOE-A-2016-824 pp53–54, publica la nueva escala. Su publicación en BOE en enero2016 no basta para fechar sus efectos: el texto declara efectos desde 31/12/2015. No se ha validado por completo la disposición anterior que fijaba los seis tramos.

**Herencias de 2025.** Castilla-La Mancha 2015/2016 y Ceuta/Melilla 2016 reutilizan referencias de 2025. La coincidencia numérica se comprobó en los manuales históricos. Castilla-La Mancha tiene norma original propia: Ley 9/2014, BOE-A-2015-1628, p3 escala desde 2015 y p4 transitoria2014. Debe evitarse que una reforma futura del objeto 2025 altere un ejercicio cerrado. Ceuta/Melilla2015 tienen escala10/12,5/15,5/19,5/23,5 y corte34.000, distinta de 2016.

**Integración.** `calcularDesgloseCuotaPorEscala` aplica a cada intervalo `max(0,min(base−inferior, superior−inferior)) × tipo`, suma sin redondear por tramo y devuelve vacío para base≤0. En las tablas examinadas los límites crecen y el último es infinito. La fórmula implementa una integral continua, no incorpora cuotas fijas publicadas. Los casos de verificación deben incluir cero, base negativa, cada límite±0,01, exactamente cada límite, una base elevada y límites de selección de variantes. No se han ejecutado esos vectores contra el motor; el recálculo independiente sirve para proponer pruebas, no para declararlas superadas.

## Territorios y comparación legacy

Navarra y País Vasco no forman parte de la unión `ComunidadAutonoma` ni de las tablas. No puede afirmarse que el resolutor produzca un rechazo tipado para esos valores forzados en tiempo de ejecución: el contrato TypeScript simplemente no los admite. Ceuta y Melilla sí están representadas; soporte de escala no implica cobertura completa de deducciones por rentas obtenidas allí.

`simulada-estatal` es un supuesto técnico, no una residencia real. En 2012–2015 se suma una escala del art.65 al componente estatal. En 2016 `escalaAutonomicaIgualEstatal` activa el camino legacy: el total conjunto queda en el campo estatal y el autonómico es cero. Su uso como escenario de contraste no transforma ese desglose en reparto jurídico válido. La escala art.65 del manual2014 aparece bajo residentes en el extranjero.

Python `Calculo_Salario_IRPF.py:110–113` solo tiene escala conjunta; no contiene comunidad, variante por base gallega o fallecimiento balear. En 2012–2014 redondea límites a euros enteros. A base50.000 €, devuelve por integración15.769,6825 €, frente a15.769,652 € de estatal+simulada con límites exactos: diferencia−0,0305 €. En 2015 y2016 el ejemplo coincide. Los importes son cuotas brutas, no salarios netos ni liquidaciones completas.

Se leyó por streaming `xl/worksheets/sheet2.xml`, identificada en workbook como `CONTROL_TRAMOS_IRPF`, primeras35filas. Las referencias de celda y valores originales se guardan en `excel-control-primeras35filas.json`. No se cargó el libro completo en memoria ni se tomó su coincidencia como aceptación normativa.

El resolutor 2026 rechaza territorios reales y reutiliza2025 para el supuesto simulado.2026 está fuera del lote y no se valida por herencia.

## Objeciones del experto y costes explícitos

- **Separar coincidencia numérica de aceptación legal.** Objeción: un manual no prueba toda la vigencia histórica y puede contener erratas. Motivo: conservar resultados reproducibles sin falsear la cobertura. Coste aceptado: ningún `match` queda aceptado y hacen falta más originales y contrarrevisión.
- **Usar recopilaciones oficiales de Hacienda para avanzar2012–2013.** Objeción: no sustituyen AEAT del ejercicio ni disposiciones originales. Motivo: son evidencia oficial identificable y un índice normativo mejor que inferir herencias. Coste: las comparaciones se etiquetan separadas y la carencia AEAT sigue abierta.
- **Conservar discrepancias de céntimos.** Objeción: una diferencia en cuota bruta puede cancelarse o cambiar al liquidar mínimos. Motivo: la tabla legal contiene cuotas que el motor no conserva. Coste: los ejemplos no se venden como diferencia final y se requiere prueba completa antes del fix.
- **Citas de texto y coordenadas sin renderizar manuales enteros.** Objeción: falta inspección visual de cada recorte y validación PAdES/CSV. Motivo: aportar citas verificables con memoria moderada. Coste: autenticidad criptográfica y facsímiles siguen pendientes; un hash prueba integridad, no autoría.
- **No duplicar el trabajo de mínimos.** Objeción: la cuota neta depende de ellos. Motivo: respetar el reparto; se ha revisado la interacción de selección de escala. Coste: el otro auditor debe comprobar que su mínimo se aplica con la misma variante territorial.
- **No modificar motor ni crear tests aquí.** Objeción: todavía no hay prueba ejecutada que falle. Motivo: el contrato exige segunda lectura independiente y restringe escrituras. Coste: las pruebas propuestas deben materializarse antes de cualquier corrección.

## Archivos y reproducción

`hallazgos.json` contiene candidatos con revisión pendiente. `cobertura.json` separa matriz, variantes, no soportados y pendientes. `documentos.json` conserva URL canónica/final, HTTP, fecha de recuperación, cabeceras disponibles, hashes SHA256/SHA512, MIME, tamaño y ruta del original. Cabeceras ausentes no se inventan. `citas-candidatas.json` contiene las filas con cajas por celda; `citas-legales-candidatas.json`, pasajes BOE. Numeración PDF1-based, puntos y origen superior izquierdo, extracción por capa de texto; no OCR.

Scratch propio: `.cache/procedencia/autonomicas-2012-2016/`. Los originales están en la caché compartida por SHA256. Descargas mediante `tools/procedencia/descargar.py`, lock común, User-Agent IRoboPF y pausa entre peticiones. No se ha validado la firma ni se afirma autenticidad por la mera descarga HTTPS.

Comandos empleados:

```sh
nix shell nixpkgs#python3 -c python .cache/procedencia/autonomicas-2012-2016/adquirir.py
nix shell nixpkgs#python3 -c python .cache/procedencia/autonomicas-2012-2016/comparar.py
nix shell nixpkgs#python3 -c python .cache/procedencia/autonomicas-2012-2016/legacy.py
```

Para los scripts PyMuPDF se ejecutó `uv run --with pymupdf python SCRIPT` dentro de `nix shell nixpkgs#python3`, fijando `UV_PYTHON` al Python del shell y `LD_LIBRARY_PATH` a la salida `nixpkgs#stdenv.cc.cc.lib` más `/lib`. Esto resuelve las bibliotecas de las wheels en NixOS sin instalación global. `verificar-citas.py` reabre el original, verifica SHA256 y reextrae cada caja; su resultado no constituye contrarrevisión humana.

## Ampliación documental y cierre de esta entrega

Se completó la lectura de **159 filas** de Hacienda 2012–2013, correspondientes a las 15 comunidades de régimen común de cada ejercicio. Dos tablas2012 continúan en la página siguiente: Andalucía pp10–11 y Madrid pp34–35; ambas continuaciones están incluidas. Sumadas a las 293filas AEAT, son **452 filas candidatas**, no452 reglas aceptadas. Ceuta/Melilla2012–2013 y la simulación no se contabilizan como comparaciones documentales de esas recopilaciones.

Hacienda 2013 p12 muestra para Asturias un resto36.592,80 en la fila53.407,20 aunque la siguiente base empieza en70.000: ambos valores no pueden definir el mismo intervalo. Murcia 2012/2013 muestra `55.000.00`: el normalizador español de scratch produce5500000 al retirar puntos, pero eso es un **artefacto de extracción**, no un límite normativo. Las filas afectadas quedan señaladas en `hallazgos.json`; requieren norma original, sin cambiar el motor por ese dato. Esta es la objeción decisiva contra tratar una extracción automática como validación.

Canarias 2012: BOE-A-2012-9282 pp96–97 fija el 22,58%; la DF9.2, p149, dispone efectos IRPF desde 1/1/2012 pese a entrada general 1/7/2012. Illes Balears: BOE-A-2016-824 DF16.1, p66, fija la entrada 31/12/2015 de los apartados1–9 de la DF2. Estas citas de vigencia se añaden al corpus. La publicación del BOE valenciano es **10/02/2015**, comprobada en el original.

Resultado: **13 hallazgos candidatos**;452 citas tabulares con 1.808celdas,321 pasajes BOE y12 documentos. Las citas legales son bloques de texto exactos de las páginas seleccionadas; algunas conservan contexto contiguo. Las filas de las escalas se localizan individualmente por celda. Sigue pendiente una selección editorial más estrecha de los bloques legales y su facsímil. Ninguno de estos conteos expresa aceptación independiente.

`vectores-bordes.json` añade 1.425 ejemplos independientes en 79 escalas/variantes documentadas: cero, negativos, cada frontera ±0,01 y una base alta. Compara la integral continua con cuota fija publicada más exceso; 242 ejemplos difieren al redondear ambos resultados por separado. **No son 242 errores aceptados**: incluyen diferencias de representación canaria y efectos del redondeo intermedio. No se ejecutó el motor ni una declaración completa para esos vectores. Galicia con base baja se trata en el apartado de variantes, no forzando su escala superior fuera de condición. La comparación usa las bases inferiores de la tabla, no el ancho ministerial defectuoso de Asturias ni el artefacto numérico de Murcia.

Verificación final completada: **773 citas, 2.129 cajas y 12 originales** con hash y texto coincidentes; 13 hallazgos con campos obligatorios y revisión pendiente. Resultado en `verificacion.json`. Comando: `verificar-final.py` bajo el mismo entorno PyMuPDF descrito. Esto acredita integridad y reproducción literal, no interpretación fiscal ni firma. `cobertura.json` detalla además, por territorio, qué originales y secuencias de modificaciones faltan.
