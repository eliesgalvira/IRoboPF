# Revisión independiente de escalas, mínimos e integración

Revisor nuevo, 29/10/2026. Base examinada: `0ca324b082676e15ae443b3c83d7f81828fbc0ce`. Los doce archivos identificados en `manifiesto/codigo.json` coinciden byte a byte con esa base. Sin modificaciones de implementación, registros, oracle ni VCS. Informe del autor e INTEGRACION-R5 utilizados como índices, no como prueba.

**Resultado: cambios aritméticos examinados aprobables dentro de su contrato parcial; integración de modos requiere corrección (EMI-01, P2).** No se certifican declaraciones completas ni se promueve ninguna regla o binding del corpus. EMI-02 advierte que la conciliación canónica no es una referencia legacy independiente.

## Hallazgos

### EMI-01 — El perfil devuelve «canonico» pero ejecuta compatible-legacy (P2)

`perfil-progresividad-frio-legacy.ts:40–48` llama a CompatibilidadSalarioLegacy sin transmitir el contexto y devuelve después `modo: contexto.modo`. El adaptador `calculo-salario-legacy.ts:95` fuerza compatible-legacy. La liquidación anual directa sí distingue el modo. Los contratos públicos permiten pedir ambos; ADR0001 los distingue. La etiqueta actual puede hacer pasar el resultado antiguo por el cálculo corregido.

Contraprueba propia: 2018, salario uniforme 60.000 €, comunidad simulada. La liquidación canónica descuenta 2.875,08 € de SS; el perfil solicitado como canónico devuelve 2.858,41 €. Su IRPF es 15.049,39 €, frente a 15.043,22 € en liquidación directa y conciliación canónicas. Para 2025 y salario 60.000 €, SS canónica 3.819,26 €, perfil «canónico» 3.819,29 €. Seis comparaciones de propagación fallan en 2018/2025/2026. No son seis defectos distintos.

Objeción: el perfil se denomina legacy y podría deliberadamente conservar el oracle. Eso justifica su resultado compatible, pero no aceptar y devolver una etiqueta canónica que no gobierna el cálculo. Motivo: la nueva bifurcación de SS hace observable la pérdida de contexto. Coste: propagar el modo con una composición que conserve explícitamente el perfil compatible, o rechazar la combinación no soportada; actualizar llamadores y pruebas. No corregir solo la etiqueta de SS ni mezclar SS nueva con salario neto calculado con SS antigua. El wrapper es código heredado; este hallazgo se refiere a su conexión con la nueva semántica, no atribuye su creación al autor de escalas.

### EMI-02 — La conciliación de una liquidación canónica no calcula un oracle independiente (P2, limitación de interpretación)

`conciliacion-simulador-legacy.ts:116–141` toma la cuota recibida y, desde 2015, aplica deducción SMI y límite. En 2018/60.000 devuelve 15.043,22 € si recibe la cuota canónica y 15.049,39 € si recibe la compatible. El campo `irpfFinalSimulador` dentro de `ConciliacionSimuladorLegacy` no es por tanto el resultado fijo del simulador histórico en ambos modos. En 2012–2014 sí existe reconstrucción independiente, por lo que tampoco debe inferirse un contrato uniforme por su nombre.

No se propone sustituir la cuota canónica por legacy ni se declara errónea su fórmula de ajuste: la objeción es usar esa salida como evidencia de regresión o como diferencia contra el oracle. Motivo: puede comparar el cálculo nuevo consigo mismo y esconder la divergencia. Coste: explicitar origen/modo de la cuota ajustada y, si se ofrece comparación histórica, calcularla separadamente. Los casos de 400.000 € muestran además que el límite puede igualar ambos IRPF finales aunque difieran SS y cuota anual. Es una limitación observada, no una segunda regla fiscal rechazada.

## Comprobaciones propias

`casos/probar.mjs.txt` conserva el script adversarial original final, ejecutable tras copiarlo a `.cache/procedencia/revision-escalas-minimos-integracion/probar.mjs`. No es código de producto ni una nueva suite mantenida. `casos/resultados.json`: 525 comparaciones automáticas, 519 conformes y seis fallidas de EMI-01, más una observación estructurada del rastro revisada personalmente. Las expectativas de fronteras territoriales se transcribieron de las páginas originales reextraídas; no se importan del módulo examinado. Ahorro usa un cálculo independiente por incrementos marginales, no la misma función como expectativa.

- Seis tablas territoriales distintas: bases un céntimo debajo, exactas y un céntimo encima de cada umbral; suma y representación del rastro. Andalucía2012, Valencia2014, Catalunya2020/2022, Madrid2022 y Murcia2022. Se revisan estáticamente los intervalos de selección de años; no se pretende ejecutar cada combinación anual como una regla separada.
- Murcia: 60.000 exactos permanece en la fila anterior; 60.000,01 aplica 8.716,67 + exceso×22,70 %. Fallecimiento devuelve ausencia de tabla publicada. Ausencia de selección para Asturias2015 comprobada, sin promocionarla.
- Estado: corte17.707,20 por ambos lados y 300.000,21, ordinaria más complementaria. Prórroga2014 reabierta. No se confunden cuota fija, umbral inferior, ancho del tramo e índice de array.
- Ahorro: 2012/2014/2015/2016, bases0/5.999,99/6.000/6.000,01/24.000/50.000,01, BG0/5.200/9.000, mínimos suministrados5.151/6.000. Incluye agotamiento, absorción parcial/total y distintos componentes. F(B−M) antes2015; F(B)−F(M) después; 2015 no se divide por mitades. Tablas2021/2023/2025 leídas en originales, sin atribuirles cobertura dinámica propia de todas sus fronteras. 2026 sigue hipótesis, no cierre jurídico.
- Mínimos: edades64/65/74/75/76; defaults2012–2014 y2015; descendientes40/30/25/24/10 sin discapacidad producen5.100 tras excluir antes del orden. No acredita renta, convivencia, reparto, adopción ni declaración de familiares. La excepción por discapacidad también se inspeccionó en el código; no se convierte esa inspección en una prueba dinámica adicional.
- Mínimo grande de33.609 € con ocho descendientes en Andalucía2012: cuota de mínimo9.213,24 €, computada con cuotas fijas estatal ordinaria, complementaria y autonómica. El rastro muestra esas tres sumas y no integra tipos de nuevo. Sus líneas redondeadas suman9.213,23 y el total exacto redondeado9.213,24: diferencia de presentación de un céntimo prevista por la política conservada, no doble cómputo. No se acepta aquí una política universal nueva de redondeo.
- Deducciones Madrid2025 con solo ahorro10.000 €: consignaciones0/100/10.000 €. El cap consume como máximo424,11825 € autonómicos y deja462,75 € estatales. No valida requisitos de deducción.
- SS: bases2018 debajo/en/encima de ambos topes y punto intermedio45.240; solidaridad2025/2026 en1/1,1/1,5/2 veces el máximo por ambos pagadores y ±0,01 anual. Conexión anual en ambos modos, con salarios45.000/45.300/60.000/400.000. El rendimiento descuenta exactamente la cotización seleccionada antes de la conversión final a céntimos.
- Madrid2018/400.000: base uniforme máxima45.276,90 frente45.014,40 legacy; diferencia262,50 ×6,35 %=16,66875 € de gasto. Marginal estatal22,5 % + Madrid21 %=43,5 %. La cuota **disminuye**7,25090625 €, de162.490,88 a162.483,63 € al exportar. No se copió el expected del test del padre.

La primera versión propia escribió el signo contrario para esa última resta. `probar-v1.mjs.txt` y `resultados-v1.json` conservan ese error del revisor; se corrigió la expectativa, no el motor. No se cuenta como prueba roja de producto. Durante la preparación se rectificó también la constante manual del máximo2025 a4.909,50 €/mes antes de la ejecución ampliada, leyendo el original.

## Evidencia y alcance jurídico

Se comprobaron SHA-256 y reextrajeron con Poppler las páginas de los quince originales enumerados en `manifiesto/originales.json`. `originales-minimos-ss.json` añade las fuentes de mínimos y SS, con páginas y URLs. Los logs son extracciones derivadas, no facsímiles nuevos. Originales en el CAS autorizado de la raíz; no se descargó ni publicó ningún documento nuevo.

Se cotejaron las decisiones individuales de revisiones de estatales/ahorro, autonómicas2012–2016, cadenasB/C, mínimos y SS. Las aceptaciones de Andalucía, Valencia, Catalunya y Madrid/Murcia son proposiciones acotadas de representación o vigencia, no aceptación de toda la liquidación. Valencia DF4.b permite el inicio2014; Madrid2022 DF aplica a períodos iniciados desde1/1/2022. BORM4846 p4 exige base superior a60.000. La exclusión de fallecimiento preserva la cuestión pendiente; no resuelve el régimen aplicable a cada muerte. No se reabrió exhaustivamente cada corrección histórica de las cadenasB/C ni se amplía su aceptación.

MIN007: los textos legales dicen «superior»/«mayor»; los manuales reextraídos aclaran edad igual o superior en la explicación del mínimo del contribuyente. El uso de años cumplidos y su extensión a ascendiente75 es la interpretación acotada ya revisada, no una cita legal literal de >=75. Queda pendiente cualquier contrato con fechas natales exactas.

Integridad: hashes comprobados. Autenticidad: no se validaron firmas PAdES, CSV ni confianza histórica; URL oficial y hash no lo sustituyen. Interpretación: limitada a proposiciones y contratos descritos. Exactitud: resultados aritméticos de los casos ejecutados, sin cobertura exhaustiva de declaraciones. Aceptación: dictamen de revisión para que el padre resuelva; ninguna mutación de registros ni `--accepted` habilitado. El payload de Madrid2020 no se examinó ni se migra aceptación histórica.

## Validación y costes

110 pruebas focalizadas existentes pasan en cuatro archivos (`logs/tests.log`). La regresión salarial adicional pasa: una prueba de fixture, siete fuera del filtro, en `logs/legacy-focal.log`; no se suma a las contrapruebas propias. No se ejecutan build, suite legacy exhaustiva, reconstrucción del inventario ni render pesado. Un worker y lock común en ejecuciones de prueba. Effect Solutions list/show basics/testing y fuente local v4 consultados antes del script. Dependencias compartidas solo leídas, sin instalación ni lockfiles cambiados.

No se editó código mantenido, por lo que no se presenta lint/typecheck del padre como comprobación propia nueva. Scripts adversariales preservados como `.mjs.txt` con hashes, exclusivamente para reproducción en scratch; no se desactivan reglas ni se propone promoverlos a producto. Coste: cobertura dinámica deliberadamente focalizada, sin porcentaje de cobertura instrumental ni aceptación de contratos familiares/TGSS completos. El perfil SS promete doce mensualidades uniformes, no nómina TGSS, y esta revisión respeta ese límite.
