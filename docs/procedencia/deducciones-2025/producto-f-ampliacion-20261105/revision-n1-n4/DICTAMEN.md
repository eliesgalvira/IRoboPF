# Contraste independiente C/F y primera revisión monetaria F pendiente

**NO PUBLICABLE: cuatro hallazgos nuevos ALTA/P1 en el alcance F pendiente.**
Las correcciones C36 H1/H2 y F R1/R3 superan el contraste; el contrato de saldo F R2 también. No se reauditan E38, D51 ni histórico. Candidato congelado `producto-integracion-anual-ecd-20261105/post`, contra base pública declarada `b9122c2bf61310922e856117ed4490136a628d03`; parche de preparación SHA256 `f991d906cef185890b2a2a176318fe29b2f387bad5fd28b77d2461aadf814328` verificado.

Prefijo de las rutas de hallazgos: `lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/`. No se modifica candidato, raíz, recepción, pruebas recibidas ni esperados. Esta entrega contiene pruebas nuevas y dictamen; no contiene reparación productiva.

## Hallazgos nuevos del cotejo pendiente

**N1 — ALTA/P1 — familia.ts:166–194; anual.ts:34.**
Acogimiento de menores comprueba régimen, referencia de certificado, convivencia y orden, pero no la edad. Persona nacida el01/01/1990, acogido, convivencia2025 completa, titular a y orden1 genera **618,60 euros**, también en `evaluarAnualF2025` sin derecho a mínimo. El adaptador tiene una vía explícita para adulto acogido no descendiente, válida para otras deducciones, y la admite asimismo en este código. Se debe excluir/rechazar la rama de menores para ese adulto; no convertir una referencia documental en sustituto de la fecha de nacimiento declarada. No se discute la autenticidad del certificado. Fuente: [Madrid DL1/2010, art6.1–4](https://www.boe.es/buscar/act.php?id=BOCM-m-2010-90068&p=20241230&tn=0#a6). Reproducción: `-t N1`, dos rojos y control de menor positivo.

**N2 — ALTA/P1 — inversiones.ts:459–477.**
La corrección de R3 lee `entidad.creacion` solamente en ampliación. Para `tipo=constitucion`, inversión1000 satisfecha01/06/2025, SL creada01/01/2026 y un empleado, siguen saliendo **400 euros en Madrid y200 en Murcia**. Madrid se reproduce además mediante el adaptador anual. Constituir una sociedad en2026 no puede justificar la adquisición de participaciones por su constitución ya satisfecha en2025. Se requiere conciliar esa cronología también en constitución; no basta extender el arreglo de ampliación. Fuentes: [Madrid art15.1/3.c](https://www.boe.es/buscar/act.php?id=BOCM-m-2010-90068&p=20241230&tn=0#a15), [Murcia art1.Seis.1](https://www.boe.es/buscar/act.php?id=BOE-A-2011-10542&p=20250725&tn=0#a1). Reproducción: `-t N2`, tres rojos y dos controles de constitución2025 positivos.

**N3 — ALTA/P1 — vivienda.ts:583.**
El intervalo común2016–2025 permite anualidades de adquisiciones anteriores al nacimiento de ambos incentivos: compra01/01/2020 por100000 genera **1000 euros** tanto en despoblación como en vivienda por nacimiento (hijo01/01/2019, mínimo y convivencia válidos). La primera exige adquisición/inversión desde01/01/2024; la segunda desde01/01/2023. Debe delimitarse cada régimen, sin extrapolar diez años hacia atrás desde2025. Fuentes: [Ley5/2024, disposición final](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-3303), AEAT2025 [despoblación, Requisitos](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-madrid/adquisicion-vivienda-habitual-municipios-riesgo-despoblacion.html) y [nacimiento, Requisitos](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-madrid/adquisicion-vivienda-habitual-nacimiento-adopcion-hijos.html). Reproducción: `-t N3`, dos rojos y dos controles2024 positivos. No se certifica el resto de cronologías históricas por estos casos.

**N4 — ALTA/P1 — vivienda.ts:89 y:552.**
La anualidad de despoblación vuelve a exigir edad menor35 en2025. Nacimiento01/01/1990 y adquisición01/06/2024: el titular tenía34 al adquirir, pero se excluye en2025 por tener35; se pierde la anualidad de **1000 euros** sobre precio100000. El requisito se exige en el ejercicio de adquisición y no en las nueve anualidades posteriores. Fuente: [AEAT2025 despoblación, Requisitos/edad](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-madrid/adquisicion-vivienda-habitual-municipios-riesgo-despoblacion.html), interpretación operativa de art10ter.1. Reproducción: `-t N4`, un rojo. No se cambia el esperado para adaptarlo a la exclusión actual.

## Correcciones previas contrastadas

C36 H1: las cuatro lecturas liquidable general/ahorro en donativos y estudios emplean `eurosAnualesC`; pagos conservan `eurosC`. Se siguen las magnitudes desde la composición anual hasta el adaptador. Se ejecutan sin alteración los nueve discriminantes originales C36 (incluidos los tres rojos previos) y los ocho controles API posteriores. Los dos casos API reales conservan: uniforme bruto30000.01 y cotización6.48%, BL26056.009352, deducción398.34014028; efectiva bruto18500.01, cotización0/art20, BL15077.8686, deducción233.668029. Estudios conserva500 y el racional fraccionario del revisor no se redondea. No se convierte una base de80decimales en importe de céntimos para aceptarla.

C36 H2: derecho arrendatario, identidad contractual y arrendador distinto se exigen tanto en adaptador como en evaluador aislado. Se conserva el arrendatario original. Los ocho controles API incluyen dos fracciones y seis alquileres (positivo150, propietario rechazado, autoarrendamiento rechazado, por ambas API). La descripción de deportivo queda15%/660; no cambia fórmula. Fuente balear art4quinquies.1 y estudios art4ter.1; Canarias art4ter.1–2, URLs y hashes en FUENTES.json.

F R1: prioridad6 queda después de vivienda y dos descendientes. Además de los22 discriminantes previos, el nuevo control de cuota1000 con dos descendientes e inversión extranjera verifica100 y900 respectivamente, no consumo extranjero anticipado.
F R2: inversión extranjera2025 conserva origen/contribuyente/objetos, aplicado+pendiente y arrastre2026–2030. Murcia mantiene renovables2027, vehículos y recarga2028. Esto verifica la generación del saldo; no implementa ni certifica consumir saldos en declaraciones futuras o reconstruir historia no soportada.
F R3: ampliación comprueba constitución<=ampliación y límite inferior de tres años. Los seis rojos originales pasan con sus esperados. El nuevo N2 es otra subrama del alcance que faltaba revisar.

## Alcance normativo realizado y límites concretos

Se leen familia.ts, vivienda.ts, inversiones.ts, recarga-agua.ts, comun.ts, esquemas, canal de magnitudes, adaptador y cuota, citas.ts, matriz51 y CONTRATO. **ALCANCE-41.json delimita cada uno de los36 códigos numéricos y cinco condicionados con fórmula revisada, artículo, líneas de código, citas y salvedad propia**. Diez contratos reutilizados no se cuentan como fórmulas nuevas. La lectura de las normas primarias y criterios AEAT se hace independientemente del resultado de pruebas del autor. Se cotejan prorratas, convivencia, intervalos históricos, mecenazgo art3/12, censo y pagos, asignación estatalcero, bases/mínimos y rechazo40.

Madrid2025: la sección IRPF de la versión27/06/2025 coincide con30/12/2024; se examina también29/12/2025 para separar cambios posteriores. Murcia: art1 y DT1 en versión25/07/2025, con mecenazgo Ley4/2022. Agua y recarga se contrastan directamente con las páginas AEAT2025; se conservan reservas F-N01/F-N02/F-N03 y rechazos de ayudas cuando procede. El transitorio no publica números a falta de historia, base estatal o criterio patrimonial; cotejar su fórmula condicionada no acredita un derecho histórico individual ni recupera documentos originales de acceso1998–2011.

La frontera anual prohíbe bases/mínimos/liquidables y asignaciones estatales consignadas. Se sigue el WeakMap interno y los productores propios; otras personas sin productor no reciben una copia de la base del titular. Se verifica con prueba nueva el rechazo de miembro ajeno, el rechazo40 cuando la suma exige precisión adicional y la base propia fraccionaria precisa en donativo Madrid. Estatalcero está justificado sólo por el perfil que no admite deducciones estatales sobre donativos; no es regla fiscal universal.

Persisten salvedades de representación y acreditación indicadas por código: censo total de viviendas de art8ter frente a lista solicitada; destinatarios y fines documentales del mecenazgo; censo de convivientes frente a titulares del contrato internet; actividad/SS efectiva y compromisos de mantenimiento. No se certifican esos derechos externos ni autenticidad. No se declara favorable global ni acreditación integral A/F. La primera lectura de fórmulas se entrega con resultados y defectos; cerrar la publicación requiere resolver N1–N4 y delimitar esas salvedades en el producto, además del trámite del padre que corresponda. No se sustituyen condiciones legales por tests verdes.

## Evidencia, reproducción y custodia

`contraste.log`:39/39 (22 F+9 C36+8 API). Pruebas nuevas:23 casos,15 verdes y8 rojos correspondientes a N1(2),N2(3),N3(2),N4(1). Conjunto final:54 verdes/8rojos en62; tipos0 y antislop0 con canario rechazado. Ver VALIDACION.json y logs finales. Los rojos normativos permanecen como pruebas fallidas normales; no se cambian a TODO. No se ejecutan inventario, workflow global, VCS, instalaciones ni subdelegación.

Se conservan los errores de preparación del arnés privado (alias y resolución de módulos) y una corrección de fixture propia: el oráculo de BL exigía donar5000, pero inicialmente se habían aportado1000; se eleva el pago a5000 sin cambiar el esperado racional. No era un defecto del producto. Los dos diagnósticos iniciales de tipos de las pruebas fueron corregidos, sin conversiones por unknown. `effect-solutions list/show` no estaba disponible en el entorno de pruebas; no se escribió código Effect productivo ni pruebas nuevas con operaciones Effect.

El parche portable añade sólo `tests/cf-contraste-normativo.test.ts` con imports relativos públicos. Sobre el candidato integrado y dependencias ya fijadas:

```sh
timeout -k 30s 8m node node_modules/vitest/vitest.mjs run tests/cf-contraste-normativo.test.ts --maxWorkers=1 --fileParallelism=false
```

La salida1 es esperada mientras los ocho discriminantes nuevos sigan rojos. El arnés privado y registros no forman parte del parche. Para el candidato selectivo se usa el config privado con C_REPO=raíz, C_CANDIDATE_DIR=carpeta padre que contiene post, C_USE_CANDIDATE=1 y C_VITE_MODULE_LOG dentro de esta entrega. Caché Vite externa y distinta de la del padre.

Hashes iniciales/finales cubren candidato y recepciones/originales completos; se comprueban101postSha256 del manifiesto y198 módulos cargados. De355 rutas de custodia,354 coinciden; COLA.json del padre cambió durante la revisión (sólo coordinación, no escrito por este agente). El candidato post, fuentes y originales recibidos no cambiaron. Las fuentes entregan sólo URL/localizadores/hash, sin cuerpos CAS; los textos temporales permanecen en caché externa. Manifiesto de entrega fija SHA del parche y de cada artefacto. PESADO1 liberado al terminar; ninguna suite propia permanece viva.
