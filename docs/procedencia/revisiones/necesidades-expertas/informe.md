# Contrarrevisión independiente de necesidades expertas

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Fecha: 29-10-2026. Resultado: **14 accepted, 2 needs-evidence (NE-01 y NE-13), 0 rejected**. Aceptación exclusivamente de capacidad y con los límites indicados, nunca de importes fiscales. Se revisaron los 16 candidatos y filas de matriz, la cobertura, diez registros de posts, seis originales y ocho citas. Los hashes de entradas y código están en `revisiones.json`; base d4d708f6 indicada por el encargo, sin comprobar ni modificar metadatos VCS.

Primero se examinaron contratos, liquidación y rutas del motor; después se contrastó la primera auditoría. Las ausencias estructurales se comprobaron siguiendo integración y consumidores, además de buscar posibles contradicciones en lib, app y components. No se ejecutó código TypeScript. La revisión estática acredita qué recibe y hace la ruta, no resultados fiscales de ejecución.

## Defectos y correcciones del informe

1. NE-01 no justifica un fix: la reproducción Python y el gráfico son parametrizaciones ilustrativas. La aritmética coincide con el informe salvo ruido binario al invocar la función Python de deducción (623.81500000000006 frente a 623.8150). El factor es 1.25820687889187531100 y el cociente aproximadamente 3.76712188182. La combinación redondeada del artículo, 1.223×1.03, da 1.25969 y un equivalente 14289.22988989, no exactamente 14290.25. Ninguna diferencia determina la cuota fiscal correcta. El original primario contiene el encabezado 2018 dentro de una comparación 2019.
2. NE-13 necesita formular una carencia concreta. La exportación es código ejecutable, no solo contrato; su localizador «exportación compatible» no es símbolo literal. Reemplazarlo por `construirLibroAuditoriaCompatible`. La ausencia de hash en FuenteExplicacion (título/referencia) orienta una mejora de trazabilidad, pero no prueba divergencia de un libro no ejecutado.
3. Completar NE-11 con los puntos normativos que ya se añaden y los marginales calculados en la interfaz; completar NE-12 con deducciones ejecutadas desde UI y rechazo territorial real en 2026. El informe no afirma literalmente ausencia total, pero omite estas capacidades relevantes.
4. No generalizar IPC inverso: el factor privado legacy no cubre el orden inverso, pero `factorIpcEntreAnios` de la interfaz sí. NE-03 puede reforzarse: la normalización impone explícitamente bruto real constante.
5. `years`/`territories` repetidos son alcance requerido, no verificación de cada combinación. Las recomendaciones de vertical 2025, prioridades P0/P1/P2, microsimulación o pensiones son decisiones de producto. Las aceptaciones aquí no las convierten en hechos jurídicos.

## Evidencia pública

Se leyó el script original `fetch-x-posts.nu`: elimina handles iniciales, URLs, espacios y ciertas entidades; en long posts solo compara prefijo, autor y tiempo. No produce prueba literal de enlaces, imágenes o del resto del texto. Se verificaron hashes de las dos cachés y las diez entradas. Se repitió la consulta primaria X embed para los diez ids, secuencialmente, con espera de dos segundos antes de cada petición y User-Agent de IRoboPF. Todos coinciden en texto normalizado dentro del alcance, autor y fecha. **Tres son textos completos y siete solo prefijos**; longPost y longitudes están por id en el JSON.

El post sobre contrato Excel tiene 235 caracteres normalizados contrastados de 491: el detalle posterior no queda autenticado íntegramente por ese control. Las afirmaciones competenciales de posts largos tampoco se aceptan como doctrina jurídica. Ninguna conclusión de capacidad de esta revisión depende de Grok; los temas sin cobertura primaria completa permanecen como requisitos propuestos.

Se volvió a consultar la API primaria de Substack: mismo id 194763683, post_date y bytes SHA-256 que la fuente original. Se leyó su cuerpo, incluidos supuestos y aritmética. Es testimonio público del autor, no fuente tributaria oficial. No se copian posts completos ni notas privadas. Las diez imágenes que el primer auditor declara vistas no están cotejadas con medios públicos; esta revisión no certifica su identidad ni las cifras de imágenes. La contradicción de año tiene respaldo textual independiente en Substack.

## Fuentes y citas

Los seis originales coinciden en SHA-256, SHA-512 y tamaño con el manifiesto. Las identidades documentales corresponden a ETCL 2T2018, BOE original Ley 35/2006, manual AEAT presentación 2025, tablas INE 76125/11221 y artículo Substack. ETCL fecha su primera página el 18-09-2018; BOE es la edición del 29-11-2006; Substack contiene post_date. Las tres fuentes HTML mantienen publicación desconocida: no se deduce de Last-Modified. Los selectores INE confirman títulos/ids, no datos seleccionados ni revisiones de observaciones. Hash no acredita firma, CSV ni autenticidad jurídica.

Se reextrajeron las siete cajas PDF con PyMuPDF: **coincidencia exacta en las siete**, además de hash correcto. Página 1-based, cajas en puntos y origen superior izquierdo conservados en JSON. La octava cita es HTML: se verificó TextQuoteSelector normalizado, sin inventar página o coordenadas PDF. El false de comparación de página completa frente a fragmento no es fallo del selector.

CIT-01/02 respaldan distinción conceptual ETCL; CIT-03/05 respaldan separación conceptual de actividades y métodos en la disposición original. CIT-04 es introducción sin enumeración, CIT-06 solo título, CIT-07 excepción sin contexto y CIT-08 límite sin régimen/base/porcentaje: ampliar antes de asociarlas a reglas sustantivas. Pueden localizar conceptos, pero no acreditar condiciones completas. El informe advierte correctamente que LIRPF original2006 **no prueba vigencia2012–2026**; no detecté uso explícito contrario. Debe preservarse esa advertencia al consumir JSON/citas fuera del informe.

## Método numérico y límites de aceptación

La reproducción lee IPC mediante AST del Python y ejecuta únicamente su función pura de parámetros, sin imports pandas ni generación Excel; recalcula con Decimal los pasos de 2019/2026. El ruido de float en deduccion_smi se conserva visible; no se presenta como error fiscal. Scripts y resultados propios están en `.cache/procedencia/revision-necesidades-expertas/`.

Cociente de índices comparables es la referencia metodológica para convertir poder adquisitivo; tasas publicadas redondeadas no garantizan igualdad. Media anual y diciembre no son intercambiables; 2026 es supuesto futuro para diciembre. No se auditó de nuevo la serie IPC completa ni una previsión del Banco de España. Bruto+SSempresa es coste modelado, no todos los costes ETCL. Cuota, límite teórico de retención y pagos efectivos son magnitudes distintas; la ruta anual ya resta retenciones/pagos. Tampoco conjunta equivale a sumar declaraciones, ni RETA a cotización salarial. Estas distinciones sustentan alcance, no certifican ninguna regla histórica.

No se verificó celda a celda Excel, firma/CSV, facsímiles, condiciones tributarias de cada rama ni todos los parámetros de años/territorios. No se escribieron TS, builds, commits, pushes, PR, deploy, reset ni metadatos VCS. Solo se escribieron la entrega y scratch autorizados. Metadatos publicables filtrados recursivamente para excluir cabeceras de sesión y autorización; originales y hashes intactos.

## Dictámenes por hallazgo

### NE-01 — needs-evidence

La cadena existe y la aritmética independiente confirma la parametrización Python. Una discrepancia con una ilustración no demuestra una carencia ejecutiva o un error fiscal del TS.

Objeción: No se ejecutó TS ni se fijó un resultado fiscal oficial. El 2018 contradictorio está también en el cuerpo primario de Substack.

Corrección mínima: Reformular como fixture público ambiguo pendiente de fijar parámetros, año y redondeos; no ordenar fix fiscal a partir de 3,97.

Repro: inspeccionar «lib/dominio/compatibilidad-legacy/calculo-salario-legacy.ts» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

### NE-02 — accepted

La tabla IPC solo contiene tasas; 2026 vale 0.030 y no incorpora estado ni documento de previsión. El indicador de diciembre aún no es observable.

Objeción: factorIpcEntreAnios en components/auditoria.tsx sí calcula inversos. No generalizar el comportamiento del factor privado legacy a toda la interfaz.

Corrección mínima: Añadir estado y procedencia del indicador; mantener separada la auditoría de índices y las tasas redondeadas.

Repro: inspeccionar «lib/dominio/normativa/datos/ipc-2012-2026.ts» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

### NE-03 — accepted

Las estrategias coste real y trayectoria aparecen como tipos/descripciones/decodificadores. normalizarEscenarioAuditoriaNormativa impone varianteAuditoriaPorDefecto y el cálculo histórico divide el bruto por IPC.

Objeción: El desglose sí calcula coste y cotización empresarial. Lo ausente es mantener coste real mediante inversión, no calcular coste.

Corrección mínima: Precisar ruta y normalización; documentar residual de una futura inversión bruto+SSempresa, sin equipararlo a todos los costes ETCL.

Repro: inspeccionar «lib/dominio/auditoria/auditoria-normativa-historica.ts» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

### NE-04 — accepted

RendimientoTrabajo solo aporta importe; sumarRendimientosTrabajo agrega antes de cotizar y no conserva pagador ni periodo.

Objeción: CasoRetencionTrabajo permite cotizaciones y características de contrato/familia; no modela identidad de múltiples pagadores. Existe ficha catalana por varios pagadores, no un motor de obligación general.

Corrección mínima: Acotar a identidad, periodos y obligación/regularización multipagador; no afirmar ausencia de retención.

Repro: inspeccionar «lib/dominio/irpf/caso-fiscal-anual.ts» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

### NE-05 — accepted

No hay rendimiento de actividades en el contrato ni entrada de ese resultado en la base general; la rama laboral calcula cotización salarial.

Objeción: La mención RETA en un catálogo asturiano no calcula cuota RETA. AEAT 2025 apoya separación ingresos/gastos, no una historia 2012–2026.

Corrección mínima: Mantener como ausencia estructural; vertical directa simplificada 2025 es propuesta de producto, no regla jurídica ni cobertura de autónomos.

Repro: inspeccionar «lib/dominio/irpf/caso-fiscal-anual.ts» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

### NE-06 — accepted

La función devuelve rendimientoNeto: rendimientoIntegro y la liquidación la llama efectivamente. El contrato no permite gastos ni amortización.

Objeción: Hay integración inmobiliaria real y ganancias por transmisión con exenciones; no confundir esas ramas con liquidación completa de arrendamientos.

Corrección mínima: Conservar calificativo simplificado y no certificar un caso mixto; reglas por destino/fecha requieren evidencia tributaria específica.

Repro: inspeccionar «lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

### NE-07 — accepted

Solo SituacionFamiliarIndividual llega a liquidación. Pareja con hijos se transforma en un perceptor de 40 años con hijos fijos, no miembros con rentas ni opción conjunta.

Objeción: Mínimos familiares y situación familiar de retención sí existen. CIT-06 acredita únicamente un título histórico.

Corrección mínima: Especificar unidad fiscal frente a hogar y ampliar cita antes de justificar condiciones legales de conjunta.

Repro: inspeccionar «lib/dominio/irpf/caso-fiscal-anual.ts» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

### NE-08 — accepted

EscenarioNormativoVersionado es contrato de estados; búsqueda de consumidores no localiza evaluador que aplique un paquete arbitrario de parámetros.

Objeción: Comparaciones anuales, parámetros y medidas documentadas sí existen. No confundir ausencia de evaluador general con inexistencia de toda variante.

Corrección mínima: Exigir escenario identidad y selección explícita de parámetros monetarios; la deflactación integral es metodología propuesta.

Repro: inspeccionar «lib/dominio/normativa/medida-normativa.ts» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

### NE-09 — accepted

La conciliación legacy toma un mínimo de cuota y límite. La liquidación anual separa cuota y saldo, pero no tiene entradas suficientes para decidir obligación general y opción del contribuyente.

Objeción: calcularCuotaDiferencialCentimos resta pagos efectivos y retenciones; RetencionTrabajoAeat tiene ejecución propia. Rechazo interpretar el hallazgo como confusión de todos los motores.

Corrección mínima: Nombrar el perfil legacy y sus supuestos; CIT-07 no prueba un umbral vigente ni todas las excepciones.

Repro: inspeccionar «lib/dominio/irpf/liquidacion/conciliacion-simulador-legacy.ts» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

### NE-10 — accepted

La trayectoria salarial propia es declarativa; no localicé ingestión versionada ETCL/IPC en las rutas del producto. Las páginas INE son selectores, no observaciones descargadas.

Objeción: Los ids 11221 y 76125 corresponden a costes por trabajador e índices nacionales. Eso no prueba selección ajustada ni los valores de una serie concreta.

Corrección mínima: Guardar dimensiones y revisiones al implementar; separar neto del salario medio de media de netos y anualización x12 de renta anual observada.

Repro: inspeccionar «lib/dominio/auditoria/auditoria-normativa-historica.ts» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

### NE-11 — accepted

Un barrido finito no demuestra una afirmación universal sobre salarios continuos ni la exhaustividad de todos los umbrales.

Objeción: El motor añade puntos normativos SMI/obligación y la interfaz calcula marginales con paso interno y cuota precisa. No es un mero barrido uniforme sin marginales.

Corrección mínima: Incluir esas capacidades existentes; exigir inventario de fronteras antes de afirmar exhaustividad, sin añadir una falsa ausencia de marginales.

Repro: inspeccionar «lib/dominio/auditoria/auditoria-progresividad-frio.ts» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

### NE-12 — accepted

17 territorios reales y simulada en contrato; resolvedores anuales 2012–2025 y rechazo real 2026. No hay forales en la unión. Cobertura jurídica íntegra no acreditada.

Objeción: DeduccionesAutonomicasAplicadas sí evalúa importes y la interfaz los pasa agregados. La ruta deducciones por código rechaza; no concluir que ninguna deducción se ejecuta.

Corrección mínima: Añadir rechazo 2026 y distinguir catálogo, evaluador UI e importe agregado. Los 15 años de cobertura son alcance requerido, no matriz validada.

Repro: inspeccionar «lib/dominio/irpf/caso-fiscal-anual.ts» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

### NE-13 — needs-evidence

Hay constructores y exportación XLSX efectiva. Igualdad legacy no implica validez fiscal, pero el candidato no identifica una divergencia ni un requisito concreto incumplido por celda.

Objeción: exportación compatible es etiqueta descriptiva, no símbolo. El texto completo del contrato Excel en el post largo supera el prefijo verificado por X.

Corrección mínima: Sustituir localización por construirLibroAuditoriaCompatible; definir campos de trazabilidad ausentes y fixture pequeño antes de aceptar defecto de exportación.

Repro: inspeccionar «lib/export/auditoria-excel.ts» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

### NE-14 — accepted

Los perfiles cerrados generan 40 años y descendientes 8/5; no existe constructor de cohorte con cumpleaños y cambios anuales.

Objeción: CasoFiscalAnual permite edad, familiares y fechaFallecimiento en casos separados: el usuario técnico puede construir manualmente distintos años.

Corrección mínima: Acotar ausencia a trayectoria automática, no a imposibilidad de representar edades o cambios intranuales.

Repro: inspeccionar «lib/dominio/auditoria/auditoria-normativa-historica.ts» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

### NE-15 — accepted

Las entradas son rango de salarios, años y perfil; no pesos ni población. No se localizó integración de microdatos en lib/app/components.

Objeción: Es ampliación analítica de producto; no defecto fiscal de un cálculo individual. Un rango salarial no es una muestra representativa.

Corrección mínima: Conservar como capacidad fuera de alcance actual y declarar unidad/pesos antes de agregación.

Repro: inspeccionar «lib/dominio/auditoria/auditoria-progresividad-frio.ts» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

### NE-16 — accepted

PRODUCT delimita auditoría salarial; código laboral modela contribuciones anuales y no carreras, supervivencia, descuento ni sistema macro completo.

Objeción: Pensionista existe como situación de retención; no equivale a valorar derechos de pensión. No interpretar una propuesta macro como obligación normativa.

Corrección mínima: Mantener frontera de producto; contribución anual, cuña y derechos futuros deben nombrarse separadamente.

Repro: inspeccionar «PRODUCT.md» y seguir las rutas adicionales enumeradas con hash en `revisiones.json`.

## Reproducción y comprobaciones finales

- `nix shell nixpkgs#python3 -c python .cache/procedencia/revision-necesidades-expertas/arithmetic.py` reproduce la aritmética sin tocar el Python original.
- `check.py` en ese scratch reextrae PDFs/HTML, verifica hashes y reconsulta X; necesita PyMuPDF con Python Nix y libstdc++ vía uv. No usar el script aritmético del primer auditor: escribe en su propia carpeta.
- `revisiones.json` contiene exactamente NE-01…NE-16, razones, objeciones, localizaciones y corrección mínima, además de checks fuente/cita/post y hashes del código reexaminado. NE-10 usa literal de unión, NE-13 etiqueta no literal y NE-16 encabezado documental: no deben describirse los tres como funciones del motor.
