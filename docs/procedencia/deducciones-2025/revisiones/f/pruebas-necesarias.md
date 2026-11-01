Se mantienen las diferencias de ficha de los51 códigos. En `decisiones.json`, `reglaRevisada` aporta para cada uno el discriminante, las magnitudes y la frontera; `aspectos` enlaza las comparaciones y citas del autor sin copiar su dictamen entero. La prueba documental exige que el campo correspondiente enumere esa condición, cuantía o reparto. Si el helper recibe un importe externo, la omisión no demuestra un error de cuota de una declaración concreta.

Los dos rojos financieros se reproducen en la API compartida:

- Madrid: dos hijos del mismo evento2025, un progenitor conviviente, bases personales30.930 y familiares61.860, sin otros hechos excluyentes:2×(721,70+721,70)=2.886,80. Contador actual2 produce1.443,40. Dos nacimientos de eventos separados y dos hijos de un parto múltiple se codifican hoy igual. El booleano de prorrateo tampoco expresa conjuntamente modalidad, convivencia y titularidad histórica.
- Murcia: dos menores elegibles, primer ciclo de centro autorizado, con mínimo y convivencia, un titular, renta30.000 individual, gastos netos5.000cada uno:sumar min(1.000,20%×5.000) por menor=2.000. Base agregada10.000 produce1.000. Un solo menor con10.000 produce legítimamente1.000:misma entrada agregada, derechos distintos.

Arreglo mínimo propuesto, sin editar producto: añadir entradas estructuradas opcionales y un adaptador explícito a los contratos parciales existentes. Madrid necesita eventos separados, año/fecha, hijos y progenitores convivientes, modalidad y unidad familiar por período y sus bases; distinguir multiplicidad del número total de hijos. Murcia necesita registros por descendiente con titulares, convivencia, derecho al mínimo, etapa/centro, pagador, conceptos, ayudas y facturas; renta y modalidad de cada titular. No basta añadir un contador a un tope global ni multiplicar por2 todo nacimiento. Si faltan hechos, conservar resultado parcial/no soportado e importe externo con soporte; no promoverlo a evaluación fiscal completa. Mantener protección de `totalDeduccionesEvaluadas` frente a `calculo_parcial`. Coordinar el adaptador compartido con Cantabria; aquí no se toca.

Las nuevas pruebas ejecutadas en `casos.test.ts` mantienen dos fallos esperados y contrastan independientemente:

- Madrid:2025 múltiple2.886,80;2024/2023 múltiple sin suplemento2025=1.443,40;2022 excluido. Un progenitor frente dos y conjunta; igualdad30.930/37.322,20/61.860 admitida y céntimo superior excluido; historial ausente no soportado.
- Murcia: dos menores5.000=>2.000; uno10.000=>1.000; ayuda1.000 sobre gasto5.000=>800; duplicado no soportado;30.000/50.000 admitidos y céntimo superior excluido;dos titulares individuales=>500 por menor.
- Ruta anual `calcularDeduccionesConsignadas`: conserva2.886,80 y2.000 externos; el contador por sí solo no se consigna. No se imputa automáticamente el rojo del helper a la ruta anual.

Pruebas fiscales todavía necesarias antes de conectar el cálculo: historial con cambio de modalidad/unidad familiar, parto/adopción múltiple y varios eventos independientes, justificación y fallecimiento/convivencia; en Murcia, edades y meses del primer ciclo, autorización del centro, mínimos, dos pagadores, subvención superior al gasto, custodia/vestuario elegible y conjunta con titulares distintos. Los casos actuales de los contratos no acreditan esos hechos.

Fronteras adicionales independientes: renovables Murcia con base de inversión1.000 y renta individual34.999,99/35.000/45.000/60.000 deben dar500/375/250/0; conjunta49.999,99/50.000/75.000/95.000=>500/375/250/0 antes de otros límites. Vehículos individual34.999,99=>30% y35.000,01=>22,50%; reservar35.000 exactos por solapamiento del original. Idiomas Murcia25.000 exactos excluido frente deporte/veterinarios25.000 admitido. Madrid alquiler20% exactos excluido y cumpleaños40 excluido; familia numerosa fin ventana año+2/año+3; municipio2.499/2.500. Son expectativas para pruebas de hechos, no fórmulas conectadas ni resultados ejecutados.

Reproducción desde raíz con dependencias existentes y temporales externos (no requiere modificar Effect):

```sh
uv run --no-project --python python3 --no-managed-python --with pymupdf==1.26.7 --with beautifulsoup4==4.14.3 python docs/procedencia/deducciones-2025/lotes/f/verificar_citas.py "$CAS_ROOT" "$LEGACY_CAS"
bun run test tests/deducciones-procedencia-2025-f.test.ts --maxWorkers=1
```

Para las pruebas independientes, crear fuera del repositorio una configuración Vitest que exporte `{test:{include:['docs/procedencia/deducciones-2025/revisiones/f/casos.test.ts'],maxWorkers:1}}` y ejecutar `bun run test --config "$REVIEW_CONFIG"`. Los imports del archivo resuelven el producto actual. Para los rojos ordinarios, usar una copia privada sustituyendo exclusivamente `it.fails` por `it`, conservando imports contra este mismo checkout. La ejecución realizada usó una copia privada con enlaces de lectura a `lib`/`docs` y dependencias existentes, `preserveSymlinks:true`; los logs y copias están exclusivamente en el transporte privado.
