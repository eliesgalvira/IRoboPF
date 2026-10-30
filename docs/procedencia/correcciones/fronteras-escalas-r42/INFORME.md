# Fronteras y firmas de escalas: contraste R42

El padre corrobora R40-01 y R40-02 y prepara una corrección de los contratos de siete resultados externos y dos firmas de validadores. Los cálculos, argumentos, consumidores y fuentes fiscales no cambian. La descripción nueva conserva pendientes la admisión, la composición pública y la aceptación fiscal. R40-03 permanece como condición expresa sobre errores y primitivas; no se presenta como una avería financiera ni como asunto resuelto.

## Recepción

La revisión de escalas se recibe desde la base `314efe543def21276acb44d0e3b0816dd5f78d58`: 20.670 entradas físicas intactas, comprobadas por bytes, enlaces y ejecutabilidad. Se reconstruye el transporte de 58 archivos de payload; con sobres, objetos y recibo terminal son 70 archivos y 1.828.539 bytes incorporados. Manifiesto `d9d859d4bb722691428093d5abc2e836cb00858ac79fc2014caac029f8f5a393`. Cero borrados. El recibo individual conserva las rutas y hashes originales.

Durante el trabajo llega la contrarrevisión de unidades/colecciones R41. Se recibe y reconstruye separadamente: 46 archivos y 3.964.434 bytes, 20.836 entradas físicas intactas. Sobre `2453d345ae205fda1acc75a98cc7c522d39592741b9816bcc4bf2075574a39f1`. Se leen sus cinco dictámenes y casos discriminantes; sus productores actuales coinciden byte a byte con la base revisada. Las reproducciones propias R41 y la contrarrevisión permiten corroborar las cinco correcciones documentales, con alcance limitado, en `dictamen-unidades.json`. No se encarga otra revisión favorable de los mismos bytes ni se atribuyen al padre las 78 pruebas ejecutadas por ese revisor. Los cinco diagnósticos checkJs SS anteriores permanecen declarados.

## Diagnóstico y solución

R40-01 no demuestra una cifra fiscal incorrecta. Las funciones reales aportan más campos que los declarados por el fragmento. Sin ellos, una composición que respete solamente el contrato publicado no llega a las líneas solicitadas: el objeto intermedio anual redondea también otras magnitudes. Se conserva esa evaluación; no se simplifica el motor ni se eliminan lecturas para ocultar el problema.

Se añaden a los resultados externos de trabajo íntegro, gastos y cotización; a ganancias, total y exenta; a ambos desgloses SS, cotización empresarial, MEI y solidaridad por lado. En EDS se declaran retenciones y pagos fraccionados, leídos antes del corte de la proyección explícita. Los adaptadores y la deducción declaran sus motivos de rechazo. La corrección se limita a las propiedades consumidas por este fragmento, no a todas las propiedades que devuelven las APIs reales.

`resultVariants` separa estados disponibles de `no-soportado` en tres contratos. `outputs` es la unión de propiedades consumidas, no una exigencia simultánea de ambas ramas. Los estados se cotejan con los adaptadores reales: `aporte-disponible` para trabajo/actividad y `calculado` para deducción. La variante rechazada requiere motivo o lista de motivos y no campos monetarios. Esta descripción no sustituye validación de entrada, la semántica de errores Effect ni una puerta pública. El schema admite el campo nuevo opcionalmente para conservar forma histórica; el verificador actual exige la receta exacta nueva y rechaza su omisión/vaciado.

R40-02 se corrige extrayendo la función de `Effect.fn("nombre")(function* (...))`, con forma y aridad explícitas. No se escoge cualquier función anidada ni se convierte una forma desconocida en firma vacía. `validarDerechosMinimos` declara `entrada`; `validarRentasAnualesDerechos`, `caso` y `rentaNoExenta`, con localizadores de los parámetros reales. Las once firmas directas restantes conservan sus datos. Los callBindings ya tenían argumentos y permanecen iguales.

R40-03 sigue abierto para la composición: mapError no preserva el payload completo, los fallos se normalizan y el intérprete no equivale a todos los canales, entorno o interrupción de Effect. Cronometraje/presentación tienen exclusiones declaradas. El manifiesto/commit fija productor, consumidor y antecedentes; las fuentes TS no autentican por sí solas las primitivas externas. No se habilita la API anual por hacer suficientes estos objetos de resultado.

## Pruebas y cambio exacto

Antes de editar el productor se ejecutan once pruebas: diez fallan y una pasa. Cubren las cuatro fronteras anuales, EDS, tres rechazos y dos firmas. El rojo se conserva. Con el cambio pasan esos once casos; se añaden conservación de las otras firmas y separación de variantes/mutaciones. La suite terminal suma 30 pruebas: 13 del padre y 17 recibidas. Los objetos de ensayo suministran únicamente los campos declarados, distinguiendo ese ensayo de una liquidación admitida fiscalmente.

Se repiten los 302 registros del revisor y las 264 celdas con el productor actual: 301 registros pasan y el objeto deliberadamente recortado a los dos campos antiguos conserva su rojo protector. Ambos arrays coinciden exactamente con los recibidos. Este rojo histórico no usa el contrato ampliado; no se reescribe su esperado ni se anuncia como fallo de la nueva prueba. La repetición después del ajuste de lint del instrumento conserva los mismos resultados.

`contraste.json` verifica 20.900 operaciones y 57 fuentes: el único cambio dentro de program es la lista documental outputs en siete nodos boundary. Operadores, operandos, fuentes, ramas y argumentos numéricos son idénticos. También cambia boundaryContracts; el resto del fragmento es igual. El candidato nuevo es `fragmento-despues.json.gz`, SHA256 `93fb35fdb3fe3970505018642215f982cd083102cbb3dfb81e11c28de2869326`. Se conserva el anterior y el fragmento histórico R36 intacto.

Pasan tipos principal/vendor, checkJs del productor, Oxlint global y ESLint global. Las 16 reglas anti-slop siguen a error; ESLint conserva diez avisos, sin errores. El schema valida anterior y posterior y rechaza cuatro mutaciones. Las pruebas usan cargador Vitest nativo, caché absoluta propia y un trabajador. Cada validación pesada adquiere y libera el bloqueo común. No hay build de Next ni matrices Excel masivas.

## Incidencias conservadas

El primer test propio falló las reglas de tipos/anti-slop: guardas no booleanas explícitas, callbacks sin anotación, parámetro object amplio y spreads vacíos. Se corrige el arnés sin alterar esperados, conservando original, diff y logs. Un segundo pase detectó el tipo anónimo de un testigo; se declara su contrato propietario. No se desactiva ninguna regla.

La reproducción recibida usa una variable local `module`, rechazada por ESLint de Next. El padre integra una adaptación que solo la renombra a `loadedModule`. `revisar-recibido.mjs.txt`, patch y hashes conservan los bytes originales y la diferencia. Los manifiestos del hijo siguen describiendo la entrega original; el recibo del padre registra la adaptación en vez de fingir identidad de la copia integrada. El resto de la revisión queda intacto.

El primer auxiliar de contraste exigía un orden equivocado de las claves JSON; falló antes de escribir el candidato. Se conserva el intento, se corrige el orden esperado y pasa el contraste exacto. Una comprobación de schema se lanzó antes de existir ese candidato y falló por archivo ausente; se conserva ese fallo y la repetición secuencial posterior correcta. Las primeras consultas de coordinación/ruta de deducciones y una opción Nix equivocada no cuentan como verificaciones completadas.

## Decisión y continuidad

Objeción experta: añadir campos puede tapar una proyección demasiado amplia o una admisión aún ausente. Respuesta: conservar las lecturas reales, documentar los campos necesarios por rama y demostrar que un testigo limitado a ellos alcanza los mismos valores; mantener R40-03 y admisión sin cerrar. Coste: contratos por propiedad adicionales y revisión independiente del cambio, sin exigir un intérprete universal ni inventar un cierre fiscal.

Se prepara una sola revisión nueva de las fronteras y firmas corregidas, con gpt-6.1-sol, high y priority explícitos. La admisión continúa en su encargo separado. Motor, inventario, confianza activa y 45 snapshots permanecen intactos. V5 r2 mantiene corte R26 y Crossa conserva v1 desfasado, copia local fuera de Victus del mismo dueño/casa. Sin LFS, gasto, transferencias, main, PR, despliegue ni limpieza. El encargo global permanece abierto.
