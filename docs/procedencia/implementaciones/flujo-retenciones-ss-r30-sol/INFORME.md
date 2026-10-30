# Continuación técnica R30 de retenciones y Seguridad Social

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Candidato de implementación, pendiente de contraste de integración y de revisión independiente nueva. El encargo global sigue abierto. Este resultado **no cierra los diecisiete sitios**: conserva las obligaciones de valor, selección y admisión que todavía no demuestra. No habilita publicación, confianza ni aceptación fiscal. No se emite atestación.

Base del candidato documentado: `376fb100512ca6a2f975c3c9500a20ee375dd431`.

## Cambio ejecutable

El compositor ahora une el parámetro `retencion` de `pasoRetencionTrabajoAeat` con su llamada anual única. Cada arista conserva rango y hash de llamada y argumento, además del productor. Antes terminaba en «parámetro sin binding»; ahora llega al servicio que efectivamente recibe el subcaso y el contexto. No se sustituye ese servicio por un terminal opaco ni se inventa que el anual inyecte su salario, familia o cotizaciones en el subcaso.

Se incorpora un contrato acotado de acumulación de salarios: semilla cero EUR, una contribución por elemento y conversión explícita de `importeIntegroCentimos`. El callback monetario debe resolver al conversor real de céntimos. La suma de tipos SS conserva las cinco propiedades concretas y el lado; la tabla anual de máximos conserva una relación por celda y un selector separado. Se admiten `satisfies` y los comparadores Decimal utilizados en estos cuerpos. No se modifica cálculo fiscal.

`flujo-retenciones-ss.mjs` genera otro artefacto, sin sobrescribir R28: grafo con sus relaciones históricas, resultado por sitio, contratos con parámetros, llamadas/argumentos, productores, retornos, condiciones de rama y divisores. Los contratos de funciones extraídos se marcan abiertos. Sus cuerpos y callbacks permanecen visibles; enumerarlos no equivale a resolver su semántica. `contrato-editorial.json` separa las fórmulas y reservas redactadas del material AST y de la evidencia jurídica. No contiene citas nuevas ni transforma hashes de software en evidencia normativa.

Los otros 48 sitios conservan sus registros históricos y sus reservas. Las extensiones compartidas del compositor pueden añadir trazas de dependencias comunes; no se promociona ningún sitio ajeno ni se reescriben los JSON históricos.

## Contrastes discriminantes

El rojo previo de transporte está conservado: una prueba falla y diecisiete pasan antes del arreglo. El contraste adicional adapta exclusivamente imports de una copia del compositor base, en scratch, y compara la llegada al servicio y a celdas anuales con el compositor actual. La adaptación queda registrada y no sobrescribe el instrumento histórico.

Los casos nuevos usan el motor TypeScript real, a través del cargador conservado durante la integración. Comprueban salario vacío y acumulado; un mutante divide por diez en vez de cien y deja de cumplir 5,79 EUR. Comprueban ambos extremos del tope 2018 y los puntos interiores/exteriores; las expectativas independientes se calculan con aritmética numérica y tolerancia expresada, sin importar valores esperados del propio resultado. Las bandas 2025 distinguen tipos por lado y reparto legacy 5/6–1/6, y verifican los totales ordinarios más MEI más solidaridad.

Los casos del subservicio exigen un éxito de control y rechazos de convivencia cero, regularización y fecha en legacy. Las ventanas temporales contrastan 4/5 de julio de 2018 y el inicio disponible de 2026. Estos rechazos no acreditan suficiencia jurídica de las guardas ni nómina mensual TGSS. Se conservan los casos y mutantes anteriores del integrador, sin cambiar sus esperados.

## Bloqueos concretos

La representación actual sigue sin instanciar el servicio `dependencias.retencionTrabajoAeat.calcular` con sus dos argumentos hasta todos los retornos de éxito y error de `calcularRetencionTrabajoAeatImpl`. El nuevo contrato identifica declaración, parámetros, llamadas y retorno monetario exacto por propiedad. El siguiente paso es componer esos puertos manteniendo sus rechazos, filtros de descendientes y selector temporal, no aceptar el nombre del servicio como frontera terminal. Afecta pagos.cuenta y las cuatro salidas de retención; soportadas sigue siendo entrada declarada convertida, pero su disponibilidad anual depende de la admisión general.

La solidaridad legacy usa `Match.valueTags`, un callback con bloque y la política etiquetada del año; quedan obligaciones de instanciación/narrowing. Los selectores de arrays por lado y sus elementos necesitan transporte por índice. No se marca como completo un total porque su suma final sea conocida. Los pendientes exactos, con puerto, rango, propiedad y siguiente acción, se entregan por sitio. Son limitaciones de esta implementación de composición, no defectos fiscales demostrados ni excusas normativas.

La admisión anual cruza coherencia de ejercicio, derechos familiares, conciliación de rentas y disponibilidad territorial/deducciones. Se extraen sus ramas y llamadas, pero no se demuestra todavía su composición completa hasta la entrada pública. Una entrada DECLARADA no evita ese requisito. **Esta entrega no satisface la exigencia de cierre ejecutable completo de los 17**; tampoco presenta sus omisiones internas como un bloqueo externo resuelto. Al integrar se debe continuar la implementación o rechazar este candidato parcial antes de encargar su revisión como resultado final.

## Decisiones, objeciones, respuestas y costes

1. Resolver llamadas concretas y tablas finitas. Objeción experta: una lista de nombres podría omitir nuevas propiedades o confundir homónimos. Respuesta: origen de declaración y fuente fijada, argumentos AST y tabla exacta; cualquier cambio del motor invalida la carga fijada. Coste: migración editorial explícita ante ampliaciones, sin promesa de compilador universal.
2. Conservar la distinción entre valor, selección y admisión. Objeción: un rastro con importes puede parecer completo aunque el motor rechace la entrada. Respuesta: estados separados y cierre global de sitio falso mientras falta admisión. Coste: los resultados todavía no cumplen el objetivo de cierre y no deben conectarse a producto.
3. Mantener modos SS y límites analíticos. Objeción: un anual uniforme no prueba cuotas mensuales exactas ni mínimos por grupo. Respuesta: fórmulas intranuales, bandas y lados expresos, sin redondeo TGSS inventado. Coste: elegibilidad y exactitud mensual quedan fuera de lo demostrado.
4. No modificar motor, esperados ni confianza. Objeción: los casos propios no sustituyen revisión independiente. Respuesta: pruebas de representación separadas de pruebas numéricas, rojos originales conservados y aceptación jurídica false. Coste: revisión nueva necesaria y ausencia de aceptación propia.
5. Validar con dependencias compartidas en solo lectura desde un directorio scratch de enlaces. Objeción: una configuración local laxa podría dar un verde artificial. Respuesta: se conservan package.json, tsconfig, ESLint y las 16 reglas originales; la proyección enlaza fuentes actuales y no copia la aplicación. Coste: registrar el alcance real de los comandos y no equiparar fallos de resolución a controles correctos.

<a id="incidencia-del-cotejo-inicial"></a>

## Límite de conservación inicial

El recibo inicial no acredita una recepción limpia: observó ya cambios propios. Esta limitación de conservación permanece abierta en la evidencia histórica.

## Conservación y entrega

Los resultados de comandos y recursos efectivos se conservan junto a este informe. Un pase técnico de estos controles no acepta fiscalidad, ni siquiera por suma de casos o coincidencia de hashes.

## Resultados efectivos finales

Las 24 pruebas pasan; el recibo JSON conserva cada caso. Tipos globales terminan en 0 en una proyección física de las 446 fuentes con las configuraciones originales y datos JSON enlazados al checkout actual. Lint global termina en 0, con dieciséis reglas anti-slop a error, un hilo y `--disable-nested-config`; ESLint conserva seis avisos, ninguno de error. No se presenta una proyección vacía como global: el listado de rutas y hashes de fuentes se conserva en `controles/proyeccion-calidad.json`. Las fuentes físicas de esta proyección están solo en scratch, nunca en documentación.

Se conservan el fallo previo de tipos en las pruebas propias y su corrección, el fallo de resolución del plugin en la proyección por enlaces, el ENOBUFS de preparación y el intento que omitió `.gitignore` y analizó dependencias. Al añadir la copia exacta de `.gitignore`, el mismo comando global pasa. Ninguno de esos fallos de entorno o del instrumento se clasifica como rojo fiscal. Prettier no llegó a formatear por falta de resolución de su plugin; no es un control requerido de lint ni se anuncia correcto.

Generación: 17 sitios y 193 contratos concretos de funciones, cero sitios con cierre completo declarado. El contraste base/actual reproduce el rojo de binding anterior y la llegada actual al servicio y a las celdas anuales. Todo sigue candidato; esta entrega debe recibirse como avance parcial, no como cumplimiento de D090 ni como solución final de los diecisiete sitios.
