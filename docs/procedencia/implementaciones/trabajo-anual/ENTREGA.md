# Contrato candidato de trabajo anual

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Base: `0ca324b08267` (resuelta a SHA completo en manifiesto). Entrega por archivos, sin VCS mutante, sin integración anual y sin aceptación fiscal. Solo se modifican las rutas asignadas; node_modules es enlace de lectura autorizado. No se reconstruyó inventario ni se ejecutó Next build.

## Alcance implementado

`calcularGastosTrabajo` recibe hechos de cada rendimiento: empleo laboral/estatutario efectivo, pensión u otro trabajo; cotizaciones efectivas de Seguridad Social/mutualidades obligatorias (campo seguridadSocial), derechos pasivos y colegios de huérfanos; cuotas sindicales satisfechas; parte de cuotas colegiales destinada a fines esenciales, obligatoria y satisfecha; defensa satisfecha por litigio directo con pagador. Los importes deben estar correctamente imputados al ejercicio, sin duplicaciones entre certificados. El identificador evita repetir el mismo rendimiento; no detecta dos identificadores fraudulentos para el mismo pago.

Los topes colegial y de defensa son por contribuyente y año, no por pagador. **Defensa: 300 €, no 350**: art19.2.e histórico y Ley26/2014 p12. Colegio: 500 €, RIRPF art10, pp16–17 del original. Sindicato no tiene ese tope. Un requisito conocido falso excluye ese gasto; un requisito desconocido rechaza el supuesto. Los gastos a–e pueden producir neto negativo. Los generales, desde 2015, son hasta 2.000 una sola vez y quedan limitados al saldo. El argumento de art20 excluye la letra f; se devuelve separadamente del neto art19.

Discapacidad activa desde 2015: 3.500 o 7.750, solo para un rendimiento de empleo efectivo cuya acreditación abarque todo ese trabajo. Se limita al saldo asociado restante después de los gastos anteriores, sin aplicar automáticamente el mínimo personal. Pensiones, varios rendimientos, acreditación parcial y régimen histórico devuelven no soportado en ese supuesto. No se prorratea por días.

Movilidad ordinaria, histórica y DT6 de 2015 se distinguen y **se rechazan**. Se releyeron AEAT2015 pp144–145: DT6 permite el incremento histórico y es incompatible con el nuevo incremento por movilidad, pero no con el gasto general. Faltan contrato de fechas, inscripción, traslado causal, continuidad y asignación de rendimientos; no se sustituye ese derecho por cero. No se implementa obligación de declarar, IMV o RETA.

`calcularDeduccionTrabajo` tiene una unión de dos contratos:

- Art80bis, exclusivamente 2012–2014: base imponible general más ahorro como dato fiscal externo, tipos medios legales estatal/autonómico (arts63.2/74.2, porcentajes ya determinados por su etapa) y netos tras arts20/32, excluido el exterior que no tributó por art80. No calcula tipos medios a partir de cuotas líquidas ni equipara base imponible a bruto. Nominal de hasta 400, tramo 8.000–12.000 y límite por tipo medio. La suma de rendimientos computables debe estar previamente determinada; no modela actividades económicas.
- DA61 2025: bruto exclusivamente laboral/estatutario, otras rentas fiscales no exentas distintas de esos servicios (incluida pensión), neto de servicios computado en BLG y cuota íntegra general atribuible. La API no deriva renta fiscal de una BI ni de una pensión bruta. Los hechos de clasificación y las magnitudes fiscales externas son responsabilidad del integrador. El límite se calcula proporcionalmente sobre la cuota íntegra general, separado de cuota líquida total y cuota después de art80. Para pérdidas/compensaciones que hacen al neto superar BLG se rechaza; no se aplica una proporción arbitraria. La atribución de gastos comunes y reducciones a rendimientos mixtos no se calcula aquí: si no está cerrada externamente, no se debe construir esta entrada. Esta función es una etapa condicionada, no un evaluador completo de todos esos hechos.

`deduccionLegal` expresa el nominal previo al límite específico; `limiteAtribuible` muestra ese límite; `importeAplicable` es el mínimo del nominal, límite y cuota tras art80. `cuotaPosterior` es una magnitud nueva. No se renombra como cuota líquida ni se restan retenciones. Las salidas tienen aceptación pendiente. **2026 se rechaza expresamente**, incluso en 17.094 y 20.048,45: no se traslada aquí la aceptación documental de otra implementación.

<a id="adaptación-que-corresponde-al-padre"></a>

## Adaptación para integrar

1. Sustituir la inferencia de cotización por hechos efectivos para este perfil. Mantener el perfil analítico/legacy como simulación distinta.
2. Consumir `adaptarTrabajoAnual`: neto art19 como saldo antes de art20 y neto previo sin f como argumento de art20. No volver a restar gastos generales/cotización. El adaptador conserva clases explícitas, nunca infiere pensión desde importe.
3. Aplicar su corrección TDE09/10 usando otras rentas fiscales, no BI. Aplicar art20 una vez y conservar su límite.
4. Determinar bases, tipos medios y cuotas; para DA61 acreditar la atribución de netos de servicios, incluidas reducciones/gastos compartidos. Si no se conoce, rechazar esa etapa. La API separada no automatiza esa atribución.
5. Después de art80, llamar una sola vez a la deducción correspondiente; conservar cuota líquida legal y agregar cuota posterior al rastro. No aceptar la misma deducción manual en otra entrada.
6. Aplicar retenciones/pagos después. Desactivar la segunda deducción de trabajo de conciliación legacy para este perfil. No se han tocado esos módulos.

## Evidencia y límites

Los JSON `originales-releidos`, `originales-poppler` y `cadena-releida` conservan extracciones nuevas de originales CAS después de verificar SHA256, con URL/hash/página o contenedor HTML. Incluyen páginas de contexto que no son fundamento de cada cifra. Ley26/2014 pp11–12 y35; Ley26/2009 art70, su corrección BOE-A-2010-6285, consolidación histórica seleccionada art80bis; Ley5/2025 pp46–47; AEAT2025 pp1372–1374; RIRPF pp16–17; AEAT2015 pp144–145. `releer.py` reproduce la ampliación de cadena. Los originales permanecen en la raíz autorizada; no se descargaron nuevos documentos.

Integridad: hashes releídos. Autenticidad: no se validan firma PAdES/CSV ni preservación externa. Interpretación: candidato del autor, apoyado en originales, sin trasladar las aceptaciones de ausencia de TDE. Exactitud: pruebas de etapa, no declaración. Aceptación: exige revisor nuevo e integración de fuentes/condiciones al inventario, todavía pendiente. No se abre `--accepted`.

Objeción experta: importes externos pueden ser incoherentes o estar mal calificados aunque pasen Schema. Motivo: las bases y cuotas pertenecen a otras etapas que no se podían editar. Coste: contrato condicional y conexión pendiente; el consumidor debe conservar evidencia de esas magnitudes. Objeción: ampliar movilidad o discapacidad mixta con una cifra aislada ocultaría requisitos temporales. Motivo: no dar un resultado fiscal falso. Coste: rechazo de perfiles válidos hasta cerrar sus contratos.

Dinero: entradas decimales en euros, máximo 12 enteros y 2 decimales; sin number/exponentes. Operaciones con Decimal clonado a 60 cifras; productos finitos exactos dentro de este dominio, cocientes periódicos aproximados a esa precisión. No hay redondeo fiscal final a céntimos; esa política debe resolverla el integrador antes de presentar una liquidación. No se afirma exactitud racional de cocientes periódicos.

## Pruebas y comandos

36 pruebas verdes, un worker. Oxlint (16 reglas existentes a error), ESLint y tipos del código propio correctos. No se cambiaron reglas, package, lockfiles, CI u oracle. La primera comprobación global detectó únicamente errores de esta entrega; el archivo `typecheck.log` conserva ese intento rojo y `tipos-propios.log` la comprobación final acotada.

`rojos-contrato.log`: cinco rechazos incorrectos por usar la firma equivocada del filtro Schema.isBetween; son fallos técnicos del contrato nuevo, **no rojos fiscales del motor base**. Se corrigió con los filtros v4 leídos de la fuente. `rojo-autorrevision.log`: una prueba falló realmente porque aceptaba neto mayor que bruto; se añadió rechazo. No se simula un rojo fiscal mediante import inexistente. No se corrigieron constantes de módulos existentes ni se modificó el oracle.

```sh
nix shell nixpkgs#bun nixpkgs#nodejs -c bun x oxlint lib/dominio/irpf/trabajo-anual tests/trabajo-anual-contratos.test.ts
nix shell nixpkgs#bun nixpkgs#nodejs -c bun x eslint lib/dominio/irpf/trabajo-anual tests/trabajo-anual-contratos.test.ts
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bun run test tests/trabajo-anual-contratos.test.ts --maxWorkers=1
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bun x tsc --noEmit -p docs/procedencia/implementaciones/trabajo-anual/tsconfig.json
nix shell --impure --expr 'let p = import <nixpkgs> {}; in p.python3.withPackages (x: [x.pymupdf])' -c python docs/procedencia/implementaciones/trabajo-anual/releer.py
```

La cobertura es deliberadamente parcial y no se expresa como 12/14 reglas aceptadas. Las aceptaciones acotadas de la auditoría previa no aceptan este código. No están cerrados movilidad, discapacidad histórica/mixta, atribución automática de renta mixta, 2026, regímenes forales, conjunta, art18 ni obligación de declarar.
