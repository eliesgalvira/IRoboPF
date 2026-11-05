# Primera revisión independiente anual C36, 5 de noviembre de 2026

Dictamen: **NO PUBLICABLE todavía**. Dos hallazgos bloqueantes monetarios; no se modifica el código ni los esperados del autor. El ámbito sigue siendo individual ordinaria 2025. Se mantienen 28 códigos con alguna rama, ocho sin productor positivo y cero cierres.

## H1 — P1, bases anuales válidas rechazadas por parsers de céntimos

Rutas y líneas del candidato: `lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/donaciones-ampliacion.ts:303` y `:304`; `familia-estudios-ampliacion.ts:469` y `:470`. Las cuatro lecturas de liquidables usan `eurosC`, aunque `anualesC` y los productores admiten magnitudes anuales con hasta 80 decimales. Afecta a donativos canarios art.4ter y estudios superiores canarios/baleares. No es un defecto nuevo de R1/R2: es una incompatibilidad adicional necesaria de resolver al publicar la conexión anual.

Reproducción portable: tests `art4ter: el límite de base...` y `estudios baleares: BL fraccionaria...` del archivo independiente entregado. Ambos lanzan `Deducción no soportada: Importe decimal inválido`. La magnitud procede del marco INTERNO del test, no del DTO del cliente. Usando BL=20000.123456789123456789 y donación5000 sin reiteración, el esperado racional es 30+(BL/10-150)*15/100 = **61500370370367370370367/200000000000000000000 euros** (307.501851851836851851835). En estudios baleares, con descendiente universitario de20años fuera de isla, mínimo del núcleo y cuota1000, corresponde min(1800,50%*1000)=**500 euros**. No se exige redondear la base para aceptar el caso.

Fuente: [Canarias, art.4ter.1-2](https://www.boe.es/buscar/act.php?id=BOC-j-2009-90008&p=20251229&tn=1#a4-3), escala y límite de base; [Illes Balears, art.4ter.1](https://www.boe.es/buscar/act.php?id=BOE-A-2014-6925&p=20250724&tn=1#a4-12), cuantía y límite de cuota. Ver referencias documentales de FUENTES-REVISION.json.

Impacto: rechazo de ramas anunciadas como conectadas para una base válida producida por el anual, en vez de su deducción monetaria. La reparación necesita leer magnitudes con el parser anual exacto en todos estos puntos, manteniendo el parser de céntimos para pagos. Antes de publicar deben añadirse regresiones por ambas API con bases derivadas fraccionarias, además de estos discriminantes del adaptador.

## H2 — P1, traslado concede deducción al propietario y cambia identidad contractual

Rutas y líneas: `lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-adaptador.ts:265` comprueba identidad sólo para `derecho=arrendatario`; `:322`-`:323` reemplaza el arrendatario contractual por el sujeto anual si `uso=habitual_propia`. `vivienda-ampliacion.ts:517` entra en traslado sin exigir que el sujeto tenga derecho de arrendatario. `no_aplica_arrendatario` en `anual-adaptador.ts:329` es correcto para el inquilino, pero no suple esa identidad ni crea derecho de propietario.

Reproducción: test `traslado: propietario no sustituye...`. Sujeto anuals-1, propietario100%, arrendadors-1, arrendatarios-9, gasto1000 pagado pors-1 etiquetado alquiler, vivienda habitual propia y contrato interinsular de un año con misma relación laboral. El candidato lo acepta y el cálculo sigue la rama15% (=150euros), cuando debe rechazar el supuesto contradictorio y no reconocer deducción al arrendador. El test conserva esperado `toThrow`; falla por aceptación. El control positivo usa derecho arrendatario, sujeto contractuals-1 y arrendadors-8: aplica150 sin necesitar capital inmobiliario del inquilino.

Fuente: [Illes Balears, art.4quinquies.1](https://www.boe.es/buscar/act.php?id=BOE-A-2014-6925&p=20250724&tn=1#a4-14), arrendamiento satisfecho por el contribuyente por traslado laboral; cita exacta también conservada en FUENTES-COMPOSICION.json del candidato. Reparación requerida: conciliar sujeto, derecho y contrato sin sobrescribir los hechos materiales del cliente. No restaurar la exigencia de renta inmobiliaria propia del arrendador para el inquilino.

## Validación y límites del dictamen

Reproducidas secuencialmente las seis suites del candidato:199 aciertos; siete regresiones A40/H12/B37/territoriales:181aciertos+2TODO; C2025:22aciertos. Total autor reproducido:402aciertos+2TODO. TypeScript5.9.3 estricto/Effect:0diagnósticos en24entradas/608fuentes. Oxlint/anti-slop16reglas y ESLint:0diagnósticos de código; conservados mensajes de entorno Next. No se ejecutó inventario ni CI global. Un trabajador por suite y un turno PESADO1, sin subdelegación.

Nueve discriminantes propios definitivos: **6 verdes, 3 rojos**, agrupados en los dos hallazgos. Los verdes comprueban el inquilino real, reparto monetario50%, presupuesto grupal15% fraccionario, decimal80 efectivo sobre dos códigos sujetos al grupo, insuficiencia de cuota para nacimiento y duplicación de recibos históricos por factura. Los rojos no se transforman en TODO ni se alteran para acomodar el candidato. Hubo dos errores propios de preparación de pruebas (aritmética del grupo y omisión del límite10% individual): corregidos con registro privado explícito, preservando todas las primeras salidas y sin tocar pruebas del autor.

El harness privado separado de base usa exclusivamente las preimágenes b912 fijadas: reproduce8rojos/1verde de transporte y conserva log. La falta del helper anual en la base explica parte del rojo y no se presenta como ocho defectos fiscales nuevos. Los puntos de céntimos de H1 ya estaban en evaluadores aislados; la conexión nueva debe poder transportarlos hasta sus fórmulas. No se reemplaza la base por3dcd ni se monta una liquidación alternativa.

Ambas API se ejercitan con las pruebas del autor, que verifican100euros y reducción10000céntimos, y rechazo de la rama histórica. La inspección enlaza uniforme `liquidar-irpf-anual.ts:461` y selección80 en`:472` con la composición única; explícita usa la misma composición con80. BIG/BA y BLG/BLA salen de esa ejecución; cuota íntegra autonómica es la anterior a deducciones, mínimos/titulares proceden del resultado v4. El adaptador no recibe esos valores por el cliente: los esquemas cerrados rechazan excesos. H1 impide certificar precisión80 efectiva en TODAS las ramas. El verde del decimal80 sólo acredita transporte y aplicación exacta del grupo en el adaptador, no cobertura exhaustiva de ambos productores públicos.

Se reprodujeron los tres adversos del autor contra censo nativo de otro territorio, edad o discapacidad contradictoria. También pasan las protecciones R1 (mínimo por descendiente, hijo real en libros) y R2 (propia, base15000 sin dividir por propietarios). Grupo canario arts6/14/14bis/14ter al15%, límites por código10% y restantes, consumo único y prioridad nacimiento/adopción se ejercitan en las suites. No se impone un orden nuevo entre nacimiento/adopción ni entre los demás códigos. Adopción sigue sin productor positivo: comprobar su prioridad estática no acredita liquidar esa rama.

Se conservan los rechazos por otros miembros, cónyuge/ascendiente no representados, históricos inmobiliarios, rendimientos por catastro y tipo medio de emergencias. Los IDs/facturas/documentos monetarios se registran antes de evaluar; art18.2 rechaza otro código canario sobre el mismo catastro. Incompatibilidad balear5bis/5quater también con otro beneficiario. El histórico de inversión nueva se deriva sólo si la operación nace en2025: una operación2024 no recibe remanente cero. Reiteración deriva recibos2023/2024 exhaustivos; nacimiento exige registro sin anticipos y rechaza cobros hasta disponer de regularización. El consumo hasta cuota no promete abono administrativo posterior.

Ocho ausencias específicas que NO se levantan: (1)canarias_inversion_vivienda_habitual: pagos/inversiones deducidas/reinversión históricos; (2)canarias_adecuacion_inmueble_arrendamiento: rentas y titularidad fiscal por catastro; (3)canarias_puesta_viviendas_mercado_arrendamiento: imputación2024/aplicaciones previas; (4)balears_arrendador_vivienda_permanente_otros_gastos: primera aplicación y rendimientos; (5)balears_arrendamiento_vivienda_habitual: derechos anuales a inversión; (6)canarias_cuotas_seguridad_social_empleados_hogar: régimen matrimonial/atribución; (7)balears_adopcion: exclusión de hijo de pareja y anticipos; (8)balears_subvenciones_zona_emergencia_proteccion_civil: integración fiscal y tipo medio legal.

Observación no bloqueante independiente: matriz36, fila balears_mecenazgo_deportivo, ramasConectadas menciona25%/1200 público aunque su regla final documenta15%/660 y el evaluador excluye la especialidad pública para deportivo. Corregir la descripción; no se ha reproducido un importe deportivo25% a causa de esa etiqueta. Valoraciones de bienes/comodato y documentos particulares siguen condicionados al cotejo; no se certifica su autenticidad ni se extiende esta revisión a una acreditación integral A/F.

Pendiente concreto antes de publicar: reparar H1/H2 en una nueva entrega, pasar los tres discriminantes rojos sin alterar esperados y añadir cobertura de la base fraccionaria producida por ambas API. Después, repetir los focales afectados, tipos y lints. El presente dictamen no autoriza publicación ni cierra ninguno de los36códigos.

## Reproducción portable

Aplicar el parche de pruebas sobre el candidato integrado y usar las dependencias del proyecto ya instaladas. Desde la raíz, con el entorno declarado por el proyecto:

```sh
timeout -k 30s 8m node node_modules/vitest/vitest.mjs run tests/c36-revision-anual-independiente.test.ts --maxWorkers=1 --fileParallelism=false
```

Los imports son relativos al proyecto. El parche no incluye harness privados, dependencias, rutas privadas ni cuerpos CAS. Los logs y manifiestos de esta revisión permanecen fuera de él. Raíz y candidato son sólo lectura. PESADO1 liberado al finalizar, sin validaciones propias vivas.
