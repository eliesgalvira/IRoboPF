# Primera revisión independiente P1 ELA: favorable con reservas delimitadas

No se ha reproducido un error que cambie el importe ni una salida fiscal incorrecta en el alcance P1. No hay hallazgos bloqueantes. No se modifica producto ni candidato. Se entrega únicamente un test nuevo portable, arnés selectivo y evidencia de revisión. No implica aceptación fiscal o autenticidad documental.

## Objeto y base exacta

Candidato: `/home/elies/Backups/IRoboPF/producto-ela-rebase-integracion-20261105`.
Parche SHA256 `a9e51f3a26063e1e55ac541df4d2bac78d1d795d4b8c24b0ddd4454a1d558896`.
Manifiesto SHA256 `779f100caad54137223537e02208183a7cb36806e7e317e21b018ec790a08319`.
Se comprobaron las21 postimágenes y las siete preimágenes centrales contra raíz; no se usó b912 desnudo. INFORME, CONTRATO, PRECISION, fuentes, oráculos, manifiesto y resoluciones-fusion leídos. Las pre/post y SHA quedan en validacion/. Los cuatro archivos originales de pruebas/fixture P1 se compararon byte a byte con recepción. No se cambiaron los75 esperados originales ni el nuevo discriminante del autor. El fixture Madrid conserva b6724d4535622f8914594bd4e0242f82fdbbc391e15d38ecaae389442fe43ae7.

Sin reauditoría de lotes previos ni F/N1–N4. Sólo se ejecutan P1, pruebas propias y los dos tests D51/Madrid indicados. Docs/VCS/generados e infraestructura inventario del padre quedan fuera. No se ejecuta inventario, CI global ni capturas Open. Sin worktree, subdelegación, mutación VCS, instalación, push o PR.

## Contraste primario y reservas

Localizadores exactos y URLs en FUENTES.json, consultados de nuevo mediante web:

- AEAT ELA, primer párrafo y Cumplimentación; DL2/2014 art14quaterdecies (BOE bloque43/#a1-18): la deducción se vincula al importe realmente integrado en BIG y BLG y a los tipos medios. No establece un máximo fijo adicional de deducción ni requisito de renta en este artículo. La cuota autonómica disponible sigue limitando su aplicación; pendiente no equivale a derecho a arrastrar en otros años.
- AEAT Imputación2025, criterios especiales B/Ayudas públicas: criterio de cobro del art14.2.c. Por eso conceder20000 con cobro4000 no integra20000.
- AEAT clasificación, apartado b: ayuda personal no ligada a actividad/trabajo se trata como ganancia patrimonial. Es una premisa fiscal explícita de la rama no exenta, no una deducción automática a partir de la palabra ELA. Se rechazan otras clasificaciones; no se afirma que éstas sean ilegales.
- Salud, publicación27/06/2025, párrafos de convocatoria e importe: programa propio2025, Consejería de Salud y máximos15000/17500/20000 por dependencia. Esos máximos son de la convocatoria, no del artículo tributario. El productor no certifica grado, concesión ni autenticidad. Sus cotas técnicas mayores no se presentan como máximos legales. No se certifica que cualquier declaración admitida cumpla las bases administrativas.
- El enlace oficial de Salud redirige al identificador BOPA2025-05442; no fue accesible su cuerpo. La mención de otro identificador no accesible en CONTRATO no fundamenta este dictamen y queda como reserva de referencia documental sin incidencia aritmética demostrada.
- AEAT gravamen estatal, escala y Tipo medio; autonómico, Tipo medio; BOE art2/2bis y escala Asturias2025 AEAT: cuotas generales tras mínimos, divididas por BLG y multiplicadas100; truncamiento separado a dos decimales. El ahorro no forma parte del cociente. Mínimo autonómico6105 para devengo ordinario2025; no se amplía a fallecimientos.
- AEAT caso práctico art20 y frontera normativa6500: el cobro es otra renta no exenta antes de la reducción; a6500 se conserva, a6500.01 desaparece. La clasificación no transmisión no exenta sigue siendo un hecho condicionado del perfil.

No se valida autenticidad de resoluciones, diagnóstico, referencias, justificantes, exhaustividad del censo ni derecho externo de una persona concreta. La clasificación de ayudas de dependencia/exentas u otros programas exige su propio análisis y se rechaza aquí. Conjunta, pérdidas/compensaciones y reducciones no atribuidas son límites del software, no declaraciones de ilegalidad tributaria.

## Código y trazado del importe

Localizadores en la postimagen congelada:

- ingresos-identificados-2025/productor.ts, prepararIngresosIdentificados2025: esquema cerrado recursivo, identidad propia, fechas civiles2025 desde resolución posterior a convocatoria, IDs y justificantes globalmente únicos; suma exclusivamente cobros positivos conciliados con concesión. No certifica duplicados semánticos si el declarante inventa simultáneamente todos sus identificadores.
- liquidacion/liquidar-irpf-anual.ts:341–348 y418–444: prepara una vez; añade cobro a otrasRentasArt20 y a BIG una vez, manteniendo neto laboral y ahorro separados. Conserva SS uniforme del canónico; no equivale al perfil efectivo con cotizaciones cero.
- trabajo-anual/conexion.ts:44–48,187,320–372: prepara una vez, pasa otras rentas reales antes de art20, suma ingreso a neto reducido para BIG/BLG, y pasa DA61 neto laboral y otras rentas por separado.
- composicion-anual.ts:119 y639: atribución exige BIG=BLG y base no inferior al cobro; tipos salen de cuotas propias tras mínimos una sola vez. ela.ts concilia censo completo/identidad/resolución con libro interno. Ni productor ni conciliador consumen cuota. La solicitud regional no crea ni elimina renta; el libro territorial conserva aplicación única.
- alcance-canonico.ts y esquemas efectivos: rechazan datos externos, años/programas/clasificaciones distintos, reducciones, pérdidas/compensaciones y conjunta. Canónico admite ahorro positivo representado, efectivo mantiene su rechazo por falta de hechos propios.

## Pruebas propias e importes independientes

`post/tests/revision-ela-integracion.test.ts`:39 casos con imports relativos portables en tests/ de raíz. Sólo utiliza fixtures recibidos para hechos. Esperados derivados por fracciones/aritmética explícita, sin constantes privadas ni resultados del motor:

- Dos pagos1234.56+2765.44 y concesión20000: efectivo trabajo33000/SS0 produce base35000, tipos10.87/10.64, generación/aplicación860.4 y líquida6671.6276. Canónico con SS uniforme2138.4 produce base32861.6, tipos10.60/10.11, generación828.4 y líquida5979.866 (presentada5979.87). Se comprueba aplicación única y reordenación de pagos.
- Adversos en ambas API: mismo justificante con otro ID y viceversa, identidad del censo/pago ajena, resolución preconvocatoria, importe cero, sobrecobro, clasificación trabajo, otro programa, año2026, tipo anidado y base en resolución, exhaustividad parcial, conjunta. Ninguno devuelve liquidación monetaria.
- Art20 con6499.99/6500/6500.01: bases11197.99/11198/18500.01.
- DA61: límite299.06*4698/8698 construido como29906*4698/(100*8698), comprobado contra35124597/217450; error<1e-75. Discrimina80 de60, sin derivar el esperado del observado.
- Ahorro canónico0.01 y60000 no altera tipos generales ni generación3082.
- Hijo10 años compartido por dos titulares: mínimos6750/7425; cuotas1447.5/1404.102; tipos7.23/7.02; generación2850, aplicación1404.102, iguales por ambas API. Hechos de consanguinidad distintos del fixture original de adopción.

Los76 casos recibidos incluyen además límites de cuota, censo multiexpediente, reducciones/pérdidas, familiares, y discriminantes de precisión. Composición sigue20|80. Decimal local100 sólo en productor/transporte:18 enteros+80 posiciones=98 cifras y2 para hasta100 sumandos; las dos pruebas recibidas ejercitan suma y resta reales y el sumando máximo. calcular.ts raíz conserva80, sin modificación. No hay precisión global600.

## Ejecución y reproducción

Final:193 pruebas correctas,0 fallos,8 archivos.39 propias+75 P1 originales+1 discriminante80+31 D51+47 Madrid. No se afirma haber repetido las1312 ni linters del autor. Tipos estrictos del test propio y dependencias resueltas:0 diagnósticos (strict y exactOptionalPropertyTypes), en validacion/tipos-02.log. Entorno Node24.20.0/Vitest4.1.5 recibido del autor, sin instalación; un worker, sin paralelismo de archivos y máximo3072MiB de heap. Cada ejecución lleva timeout interior/exterior -k30s.

Primer intento rojo preservado: cinco archivos no resueltos por mapa incompleto del arnés y un esperado propio que asumía SS0 también en canónico. Se corrigió sólo el arnés propio y se derivó el esperado canónico con SS uniforme; no se cambió candidato ni pruebas recibidas. Segundo intento192/192; al añadir el oráculo familiar final, tercero193/193. Los cambios y el motivo quedan declarados, sin mover un esperado del candidato para acomodarlo al resultado.

`effect-solutions list` no está disponible en PATH ni se encontró el ejecutable en /nix/store; tampoco hay dev shell declarada en raíz. Se consultó el repositorio local de referencia, packages/effect/src/Effect.ts (ejemplo runSync de firstSuccessOf, líneas4370–4400), antes de escribir las invocaciones síncronas del test. No se añadió código productivo Effect ni se adivinaron servicios/layers.

Reproducir desde esta carpeta con `timeout -k 30s 22m bash validacion/reproducir.sh`; requiere la raíz y candidato fijados, no carpetas antiguas ajenas. El parche añade sólo el test propio en tests/; el fixture P1 y producto llegan del candidato revisado. No se copia el repositorio, node_modules, entornos ni cachés.

## Cierre

Dictamen favorable limitado a P1 personal Asturias ELA2025 con hechos conciliados, clasificación no transmisión no exenta, sin reducciones/compensaciones no atribuidas y sin conjunta. Sin aceptación fiscal automática ni ampliación a P2/P3, otras ayudas, regiones o programas. Los dos TODO heredados reportados por autor no se certifican resueltos. Infraestructura de inventario/CI y publicación quedan al padre.

PESADO2 liberado al terminar; ninguna suite propia activa. No se altera la raíz productiva ni el candidato.
