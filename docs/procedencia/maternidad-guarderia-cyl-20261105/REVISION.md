# Primera revisión independiente: maternidad y fusión P1/P2/P3

**Dictamen desfavorable acotado por un falso positivo del cruce monetario. No se ha confirmado un error aritmético en los importes calculados.** No certifico autenticidad documental externa, aceptación fiscal, cierre del catálogo ni CI global.

Base pública declarada: `7cab893b012b6b83e0a05ffabd90c9dd40690a00`. Candidato exclusivo: `producto-productores-anuales-integracion-20261105/p1p2p3`, con raíz sólo para rutas ausentes. Manifiesto `b2a8895f6a16bf5aec373cb9a87ef65280527a31cc3a2a09baa8c58bbc41f876`, parche `f04a1d7c78f291eecac0b9b85690ecc91c4c86fa23002323af63854b36ea22f0`. Verificadas las 63 postimágenes, sus preimágenes existentes y las 492 entradas de RAIZ-CONGELADA antes y después. No se integró el parche ni se usaron candidatos anteriores como runtime. Raíz, candidato, oráculos recibidos y VCS sin modificaciones.

## R1 · P2 · Colisión de identificadores de clases distintas rechaza operaciones independientes

Archivo candidato `lib/dominio/irpf/maternidad-2025/combinacion.ts:13`, comparación en línea17; invocación común `lib/dominio/irpf/liquidacion/composicion-anual.ts:665`. Reproducción: prueba propia **H2**, una vez por API pública.

La operación de donativo se llama `pago1`, mientras el pago de guardería se llama también `pago1`. Son campos de clases diferentes: `operacionId` de donativo frente a `pagos[].id` de factura. El donativo conserva su propio pago `p-op-estatal`, documento `doc-op-estatal`, fecha1junio2025, 300 EUR y destinatario fundación G12345674. La factura de enero de guardería B00000000 conserva un pago100 EUR del31enero2025. El certificado y el pago del donativo concuerdan con su operación; sólo se renombra ésta y sus dos referencias, sin cambiar hechos monetarios.

Observado en **ambas API**: `ResultadoNoSoportado`, motivo «Pago o factura reutilizado ... pago1». Control con el nombre original: admisión. Las pruebas recibidas confirman el delta conjunto de2420 EUR: donativo220 + maternidad1200 + incremento1000. El error no devuelve cero ni un diferencial incorrecto: impide obtener el cálculo de una combinación declarada admisible.

Expectativa: arts81 LIRPF y17–20 Ley49/2002 no convierten una coincidencia entre etiquetas locales de objetos diferentes en identidad del gasto. Los contratos públicos no establecen un espacio global compartido de identificadores entre clases/libros. La matriz cartesiana actual sí lo presupone y no contrasta las diferencias de fecha, destinatario o importe. Hay que resolver el ámbito de las identidades y conciliar las referencias que realmente denotan la misma operación. No propongo suprimir las guardas: los rojos históricos de reutilización real deben seguir rechazándose. Si se exige un espacio global, debe quedar expresamente contratado y normalizado; la actual causa fiscal de «pago reutilizado» seguiría siendo falsa para estos hechos distintos.

También comprobé rechazos de reutilización nominal de factura, pago personal y pago empresarial en ambas API. Pasan. No declaro como defecto que pagos renombrados por el llamador no puedan reconocerse documentalmente: eso exigiría autenticación o información adicional que queda fuera de esta revisión.

## R2 · Documentación · Letra incorrecta de artículo42

`docs/procedencia/maternidad-guarderia-cyl-20261105/ALCANCE.md:13` atribuye la rama de enseñanza pendiente a «art42.3b». La contratación empresarial del primer ciclo corresponde a42.3.b; la enseñanza por centros educativos a hijos de empleados corresponde a42.3.d. La clasificación del código para contratación directa no muestra por esto un error monetario; corregir la referencia antes de publicar evita describir falsamente la rama pendiente. Contraste: LIRPF2025 art42.3 y manual AEAT2025 de requisitos del incremento, puntos4 y siguientes.

## Hipótesis conservada que no se eleva a defecto

H1 probó limitar el techo de gasto a enero–agosto para un niño que cumple3 en enero: .08 EUR antes de septiembre y4000 después. El motor produce2000/3 de incremento. El esperado inicial .08 falla en ambas API; se conserva el archivo original y `validacion/hipotesis.log` sin retoques.

No sostengo ese esperado como hallazgo: art60.1 RIRPF fija el gasto anual total incluso de meses incompletos, y art81.3 repite el límite por período, mientras art81.2 restringe la extensión temporal de gastos. La hipótesis inicial mezclaba esos dos planos sin resolver suficientemente su interpretación. Queda apartada con `it.skip`, sin modificar expectativa ni oráculo recibido y sin exigir un cambio de producto. Es incertidumbre de la revisión, no defecto monetario probado. No se ha cambiado la fórmula del candidato.

## Evidencia funcional y lectura del alcance

Pruebas propias finales: **68 correctas, dos rojas R1 y dos apartadas H1**, un archivo, con imports de las dos API públicas. Fixtures recibidos sólo construyen datos; los esperados propios son constantes o racionales independientes. Incluyen1/2/3/4/6/8/9/10/11/12 meses, CAPI en cada uno de los12 meses, dos hijos con límites independientes2400+2000, ayuda con techo40, anticipo100 separado, CyL820 con gasto1500/ayuda100/incremento500, calendarios incompletos, fechas inexistentes, censo omitido, duplicados y exceso de ayuda.

Selección recibida disjunta: **43 correctas, cinco archivos**: maternidad unitaria, ambas API, ELA+81, composición con donativos y presupuesto80. No son pruebas propias ni repetición de las928 del integrador. Incluyen cuota0 con devolución2200, un solo ajuste y cuota, CyL820, nacimiento/tercer cumpleaños, extensión escolar, mes parcial, especie y ayudas, autorizaciones, rechazos ELA+81 simétricos y CyL+donativos, y80 posiciones decimales. El chequeo de módulo verifica SHA en cada fuente cargada; `modulos-usados.json` deduplica la procedencia, candidato primero. Dependencias compartidas del proyecto fuera de entrega, sin instalaciones.

Lectura realizada de contrato/productor81, consumidorCyL y fórmula reutilizada, rastro, combinación nueva, composición común, cambios de ambas entradas públicas y de ajuste del diferencial; fuentes2025 contrastadas: LIRPF81/42, RIRPF60, manual maternidad/CAPI, incremento/autorización y CyL5/10. El libro mensual y los racionales separan maternidad, incremento y anticipos. La resta se realiza después de retenciones/pagos; CyL usa el mismo niño/incremento y el libro de cuota común. El mínimo es conciliación, no concesión automática de81. D51 no se habilita por inferencia; los rechazos expresos de adopción, alta posterior, custodia especial, enseñanza, otros calendarios, atribuciones compartidas, varios niños/titularesCyL y regularizaciones no se interpretan como cero ni como errores por falta de soporte. No se reaudita P1/P2 individual ni el catálogo.

## Validación, recursos y limitaciones

Cada ejecución se hizo con timeout, un worker y suites secuenciales; Node1024MiB, guardia del árbol1.5GiB y del grupo6GiB. Scripts/logs y comandos reproducibles en `validacion/`. Los primeros intentos sin Python en PATH y sin archivos de prueba recibidos fueron errores de preparación propios, resueltos al cargar el entorno indicado y usar rutas candidatas explícitas; no son fallos del producto. Se conserva el log sin tests encontrados.

El intento de tipos estrictos se limitó a la prueba propia y su grafo por host de overlay. Se detuvo por guardia compartida a6448021504bytes, con árbol1165629440bytes, salida125. **No hay dictamen propio de tipos ni de diagnósticosEffect**: no se elevó el límite ni se relanzó. Tampoco se certifican linters propios ni CI global. Los resultados de tipos/lint del integrador son evidencia recibida, no validación independiente. `effect-solutions list/show testing` no estaba instalado en el entorno accesible; se consultó el código local Effect.test.ts y se usaron los patrones públicos runSync/flip ya presentes, sin introducir servicios ni productoresEffect.

Los SHA/bytes de seis fuentes oficiales consultadas en esta revisión constan en `validacion/fuentes-consultadas.json`; son huellas de consulta, no una certificación de autenticidad externa. Las páginas del manual2025 distinguen apoyo documental de validez jurídica del apéndice.

Pendiente antes de dar conformidad: resolver R1 preservando las guardas reales; corregir R2; resolver o documentar la incertidumbre H1 si se pretende ampliar la afirmación fiscal; completar tipos propios en un turno con margen compartido suficiente. Inventario, CI global limpio y publicación siguen siendo del integrador. No se ejecutaron push, PR, OpenUI ni despliegues.

**PESADO1 liberado. Todas las suites y el proceso de tipos propios han terminado; no quedan procesos de prueba propios activos.**
