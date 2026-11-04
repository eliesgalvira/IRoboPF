# Registro actual por código · deducciones 2025

[registro-351.json](registro-351.json) concilia los 351 códigos del censo con los expedientes, ampliaciones, rectificaciones y revisiones conservadas. Es una entrega documental candidata a revisión de integración. No emite otro dictamen jurídico, no acepta una liquidación y no declara cerrado el punto 4.

El rediseño puede buscar por `codigo` y consultar separadamente `capacidadCalculo`, `documentalActual`, `reservasActuales` y `trabajoPendiente`. Las condiciones son propias de cada código; las referencias conducen al registro completo, incluidos aspectos, citas, versiones, comparaciones y discriminantes que no conviene duplicar. La etiqueta `implementada` del catálogo no interviene en la clasificación.

La capacidad medida se fija en la base indicada `10ea938a`, reutilizando el balance operativo conservado del 4 de noviembre. Es una medición estática heredada, no una ejecución nueva del motor sobre ese commit. El balance original precede a C301; ese avance no aporta por sí una nueva capacidad de deducciones. `anualActualIntegrador: null` queda reservado al integrador de Valencia: significa **sin actualizar en este registro**, no que su trabajo no exista ni que deba esperar a esta entrega.

| Lote | Códigos | Hechos específicos parciales | Resto con catálogo/consignación |
| --- | ---: | ---: | ---: |
| A | 49 | 1 | 48 |
| B | 48 | 2 | 46 |
| C | 51 | 5 | 46 |
| D | 63 | 0 | 63 |
| E | 49 | 1 | 48 |
| F | 51 | 2 | 49 |
| G | 40 | 40 | 0 |
| Total | 351 | 51 | 300 |

Los 300 restantes pueden conservar aritmética genérica o escalar heredada; la clasificación solo afirma que el balance no identificó un evaluador específico por hechos. Los 51 evaluadores son parciales y conservan límites y acreditación externa. En la base, la anual recibe agregado externo: composición y cuota valencianas son piezas útiles separadas. El orden experto y los saldos no autorizan a sumar automáticamente parciales como declaración. F general aplazado no bloquea este trabajo.

## Precedencia y conservación

`documentalActual.decisionesAplicadas` explica la selección por alcance. A/B/C usan las revisiones ampliadas, con AAMP-01, BC01, BC02, CAMP-01 y CAMP-02 corroborados por [cinco rectificaciones](../revisiones/cinco-rectificaciones/INFORME.md). D usa los tres dictámenes regionales posteriores. E conserva la revisión de remisiones y actualiza incendios según la tabla vigente de ESTADO: RDL 10/2026 y convalidación incorporados y contrastados; la frase histórica «falta su contraste» no crea otro trabajo. F conserva sus 48 concordancias condicionadas y tres reservas; las identidades de conjunta corregidas no abren conjunta anual. G combina matriz y revisiones específicas con [cierre de datos de producto](../CIERRE-DATOS-PRODUCTO.md), evaluación, composición y cuota posteriores. RV01/gv-31 está corregido; su objeción anterior queda en la cadena histórica.

`historia` conserva el dictamen anterior, el posterior y el estado de revisión del expediente común, sin atribuirles vigencia actual. `evidencia.cadenaDocumental` es un índice de registros relacionados, **no una lista de decisiones igualmente actuales**: contiene también propuestas, revisiones antiguas y reservas superadas. La decisión vigente se obtiene de `documentalActual`; para ampliar su alcance se abre la referencia exacta y sus condiciones, sin promover todo el expediente a coincidencia integral.

Los códigos con reservas específicas conservan: Asturias exactamente 30; Cantabria exactamente 8.000 con `<8000` legal; dos CLM por concurrencia 12/12ter; tres CyL por autorización **o** informe, inversión directa con sede externa y programa exclusivamente autonómico; Extremadura vivienda enero–21 marzo 2022; tres Murcia por base exactamente 35.000, comparación patrimonial y remisión de agua; j valenciana por celda/versión CaLab; r solo grupo 5 por censo eficaz. Son trece códigos y doce ramas de la tabla de cierre, porque CLM afecta dos códigos. x, DANA y z conservan además sus hechos particulares. Ninguna de estas reservas se transforma en bloqueo de todos los códigos ni en importe cero.

## Integraciones resueltas en el overlay

No se modifican los lotes A/D: el consumidor nuevo dispone de una proyección enlazada que admite los localizadores originales sin falsear el contrato histórico PDF/HTML. Las vistas antiguas seguirán mostrando sus estados históricos hasta que se conecten explícitamente con este overlay.

- **VEH/192/2018:** fuente `DOGC-VEH192-2018-es`, SHA-256 `6d3308ec03d76b9b7988bdab442a4e7cd83729a70670c60a1dc079bb6e2a56bc`, 48.768 bytes y once citas enlazadas a las tres deducciones catalanas de donativos. Artículos 1–4, disposición final y anexo resuelven recuperación/procedimiento; porcentajes y entidades habilitadas siguen procediendo de 612-6/7/8. No se usa ATC como sustituto de la orden ni se mantiene «descargar original» como pendiente actual.
- **CLM:** las 2.495 citas complementarias resuelven en 36 fuentes. Se comprueban IDs locales y SHA-256 de cita cuando está declarado contra la fuente; se mantienen SHA-512, tamaño, localizador y enlace a metadatos completos. XML conserva `xpath`, bloque, versión y párrafo como coordenadas técnicas; el artículo jurídico procede del dictamen por código. No se inventa apartado normativo a partir del ordinal XML. El tipo original y el rol se conservan por separado: un historial consolidado nunca se promueve a publicación original. Si el manifiesto antiguo no declara MIME/fecha/tipo, el valor declarado permanece nulo; los tipos de localizador y el expediente permiten consumir la evidencia sin inventar metadatos. Las listas de campaña son administrativas. El recuento vigente es 25 municipios y permanecen las dos reservas de vivienda.
- **Extremadura:** cada uno de los 19 códigos enlaza su decisión independiente, condiciones, discriminante y versiones contrastadas. Se conservan 18 coincidencias condicionadas y la reserva parcial de `extremadura_vivienda_zonas_rurales`: no automatizar favorablemente adquisiciones/rehabilitaciones de 1/1 a 21/3/2022. Los dictámenes comunes previos quedan en historia.

Estas integraciones verifican identidad y enlace de evidencia pública ya revisada. No se reextrajeron pasajes ni se recalcularon hashes sobre los originales externos: las comprobaciones originales por ambos hashes son las conservadas en las revisiones. No se descargaron fuentes ni se incorporaron cuerpos, transportes o logs privados al repositorio. Los HTML oficiales del BOIB conservan su formato; la falta del PDF alternativo no bloquea el lote C.

## Diccionario de campos y consumo

| Campo | Tipo y significado |
| --- | --- |
| `version`, `ejercicio`, `corte` | Versión 1 del registro, ejercicio 2025 y fecha documental. No hereda efectos a otros años. |
| `baseCapacidad`, `punto4Cerrado` | Base medida y cierre global expresamente falso. |
| `balance` | Totales calculados desde filas; 351/51/300 y cobertura por lote. |
| `fuentesRegistro` | Archivo público o nombre del balance externo, bytes y SHA-256 de los insumos leídos. Fija el corte; no duplica sus cuerpos. |
| `integraciones` | Objetos identificados `VEH-192-2018`, `CLM-XML` y `EXT-DICTAMEN`, que completan la lectura actual sin alterar originales. |
| `deducciones` | Array de exactamente un registro por código del censo. El orden no expresa prioridad fiscal. |
| `codigo`, `comunidad`, `lote` | Identidad histórica exacta, territorio y reparto documental. |
| `capacidadCalculo.hechosEspecificosParciales`, `via` | Booleano de identificación técnica y clasificación heredada del balance; no elegibilidad. |
| `capacidadCalculo.catalogo` | Ruta del catálogo para localizar la ficha; su estado no determina capacidad ni dictamen. |
| `consignacionExterna`, `consignacionAcreditaDerecho` | Disponibilidad de transportar importe externo y acreditación fiscal separada, siempre falsa. |
| `anualBaseMedida.automaticoPorCodigo` | Falso en la medición base conservada. |
| `anualActualIntegrador` | Nulo hasta actualización explícita con base, ruta, alcance y validación de la conexión anual. No se infiere a partir del catálogo. |
| `capacidadCalculo.restriccion`, `metodo`, `baseMedida` | Alcance técnico, método y base fija; permanecen aunque cambie la conexión anual. |
| `documentalActual.estado` | Etiqueta de revisión al alcance indicado, o etiqueta de conciliación cuando hay rectificación posterior. No es el enum global del contrato antiguo. |
| `aceptacionFiscalIntegral` | Siempre falso: ninguna coincidencia documental concede un derecho particular. |
| `documentalActual.condiciones` | Extractos propios del código y rectificaciones vigentes. El registro completo y sus citas se abren mediante referencias. |
| `decisionesAplicadas` | Revisiones/correcciones aplicables, con ID de hallazgo, etiqueta original y referencia cuando corresponde. La revisión específica posterior corrige su aspecto, sin borrar la anterior. |
| `reservasActuales` | Array de tipo, condición concreta y fuente: interpretación, discrepancia del manual, evidencia administrativa o hechos particulares. Vacío no significa ausencia de requisitos. |
| `trabajoPendiente` | Acciones de producto y reservas sin resolver; la regla propia se enlaza por puntero interno a `documentalActual.condiciones`. No vuelve a pedir auditorías favorables ni originales recuperados. Los hechos particulares se exigen al caso, no se inventan como defecto normativo. |
| `evidencia.expediente`, `revisionVigente` | Referencias `{archivo, puntero}`: ruta relativa a la raíz y JSON Pointer RFC 6901. No son rutas CAS. |
| `evidencia.cadenaDocumental` | Índice por código de evidencia pública y decisiones históricas; no implica precedencia cronológica por orden del array. |
| `pruebasConCodigoLiteral` | Archivos de pruebas conservadas que mencionan literalmente el código. No garantiza exhaustividad de pruebas parametrizadas ni ejecución en esta entrega. |
| `historia` | Referencia exacta y etiquetas conservadas del lote, expresamente separadas del estado actual. |
| `integracionOverlay` | Enlace a integración aplicable: IDs de citas CLM/VEH o versiones/alcance de decisión extremeña. No altera la fila histórica. |
| `CLM-XML.citas[].referencia`, `localizador` | Puntero al literal ya conservado y coordenada nativa intacta. No duplica cuerpos originales. |
| `atribucionTecnica` | Bloque/versión/párrafo XML, con advertencia de que no equivale a apartado jurídico. |
| `CLM-XML.fuentes` | Identidad por dos hashes/tamaño, metadatos declarados y rol del documento, con referencia al manifiesto completo. Nulo conserva ausencia de declaración; no se convierte en original. |

Para cada selección de UI: mostrar capacidad parcial/consignación, abrir condiciones y reservas propias y solicitar los hechos de esa regla. La aplicación de cuota debe consumir una cuota común una sola vez y conservar incompatibilidades, orden, remanentes y caducidades. Si una rama no está admitida, devolver su motivo; el registro no habilita una fórmula ni decide una interpretación jurídica.

## Validación y entrega

Se ejecutaron seis controles Python privados ligeros: cobertura exacta contra censo, capacidad y balance por lote; resolución de referencias JSON; enlace de 2.495 citas/36 fuentes CLM; tres enlaces VEH y diecinueve decisiones extremeñas; conservación de historia/reservas y privacidad de rutas. Se rechazaron seis mutaciones deliberadas: duplicación, pérdida de reserva, promoción a aceptación, cambio de historia, inflación de capacidad y cambio de corte. Los controles se ejecutaron con `timeout -k 30s`, sin instalaciones ni suites pesadas. Un fallo inicial detectó el prefijo histórico `cataluna_` y la variante `donaciones`; se corrigió la selección explícita de los tres códigos, conservando el resultado inicial en la entrega privada.

La entrega externa contiene parche de los dos archivos nuevos, manifiesto, preimágenes de ausencia, generador, verificador, resultados y diccionario (este informe). No contiene repositorio completo, dependencias, originales CAS ni entornos. La validación del overlay y sus decisiones actuales necesita revisión de integración; no repetir las auditorías legales favorables. No se ejecutó inventario motor, CI, push ni mutación VCS. No se modificaron API, ESTADO, motor, tests, scripts, workflows ni lotes.

Durante el empaquetado cambiaron concurrentemente `docs/procedencia/API-MOTOR.md` y `tests/deducciones-valencianas-anual.test.ts`, coherente con el trabajo anual separado. El manifiesto externo lo registra. No se atribuye su nuevo contenido al corte de capacidad de este registro ni se bloquea por ello la entrega: el integrador actualizará `anualActualIntegrador` con su base y validación. Los hashes del registro son los bytes leídos; esos dos archivos compartidos pueden tener ya otros hashes.

## Correcciones de integración del 5 de noviembre

La revisión independiente detectó 307 enlaces históricos que resolvían a objetos
anidados, una regla de inicio temporal refutada en CAMP-02 y la confusión entre
Orden VEH/192/2018 y modelo 993. El integrador corrigió los tres defectos sin
cambiar dictámenes jurídicos ni fuentes históricas: las historias apuntan al
registro canónico de cada código y conservan sus tres estados; la proposición
refutada se mantiene sólo en historia. Se añade el SHA completo de la base de
capacidad en `baseCapacidadCompleta`.

Se reprodujeron las tres regresiones sobre la preimagen, y los seis controles
independientes aplicables pasan después de corregir. La conservación semántica
queda cubierta por `tests/procedencia-deducciones-registro_test.py`, ejecutable
sin CAS ni dependencias privadas: seis controles verdes. Se mantiene el corte de
fuentes original; los hashes de API/ESTADO describen los insumos leídos, no los
archivos posteriores de trabajo. La conexión anual y los nuevos módulos por
hechos se integran separadamente; 351/51/300 sigue siendo la medición de su base.
