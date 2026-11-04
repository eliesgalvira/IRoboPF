# Hechos Galicia y La Rioja · 2025

Entrega privada candidata validada por el autor: diez códigos nuevos, celiaquía reutilizada, treinta y ocho siguientes ramas identificadas individualmente en `matriz-49.json`. Es el lote E documental (49 códigos), independiente del motor E ya publicado. No cierra el punto 4. No contiene dispatcher, liquidación anual ni cambios comunes.

La entrada `HechosE2025` recoge declaración individual, colección exhaustiva, documentos, identidades, pagos, fechas y elecciones concretas. No recibe `cumple` ni un importe de deducción externo. Renta, edad y reparto se evalúan en las ramas que los requieren. Cada resultado calculado conserva acreditación externa pendiente, motivos, rastro y cuota pendiente de aplicación compartida. Los datos incoherentes y códigos desconocidos devuelven `no_soportado`, sin importe cero. El cero parcial solo describe una exclusión evaluada sobre hechos conocidos (por ejemplo, renta superior al límite).

`exacto` contiene numerador decimal finito y divisor entero; permite conservar 250/3 sin redondearlo. `presentacionEuros` usa dos decimales y HALF_UP. La instancia Decimal es local, precisión80; los importes de entrada son cadenas decimales no negativas, máximo32 caracteres y dos decimales, sin notación exponencial. No se cambia la configuración global. Una factura repetida por receptor/referencia o un pago repetido se rechaza conservadoramente: fraccionamientos de una factura necesitan otra rama. Las entradas inválidas se rechazan también si se elude el contrato TypeScript; la API no sustituye un decodificador de transporte.

Se reutiliza `evaluarCeliaquiaRioja` mediante reexportación con nombre explícito. Mantiene su resultado previo por contribuyente (importe parcial redondeado), sin presentarlo como fracción exacta nueva ni como total de conjunta. No se duplica la fórmula. Los diez códigos nuevos no tenían evaluador específico por hechos identificado en el balance de referencia.

## Alcance concreto

- Galicia dos hijos: cardinalidad, discapacidad65%, titulares simétricos y elección incompatible; conserva reparto racional. Mínimos no simétricos requieren composición específica. Esta rama exige descendientes nacidos después del solicitante y excluye identidades que figuren como titulares de su propio mínimo.
- Galicia acogimiento: fechas de vigencia, régimen, resolución Xunta, identidad del menor, adopción preadoptiva y reparto único/pareja. Menor que cumple18 en2025 requiere calendario adicional y se rechaza.
- Galicia ayuda a terceros: edad>=65, discapacidad>=65, BI menos mínimos<=22000 en individual, necesidad documentada, residencia y pagos;10%/600.
- Galicia tecnologías: contratación2025, alta velocidad, hogar exclusivo, compañía anterior y simultaneidad, pagos de alta/cuota;30%/100 entre contratos. Equipos excluidos.
- La Rioja bicicletas:15%/50 por vehículo, máximo dos vehículos del inventario familiar; asistencia y fecha; mitad en gananciales. Más de dos requiere elección explícita. Solo pagos cuyo pagador sea el solicitante: no se inventan pagos del otro cónyuge.
- La Rioja deporte y ELA: un único beneficiario exhaustivo, relación y titulares identificados; factura ordinaria y conceptos admitidos. Deporte exige servicio2025 en La Rioja,30% o100% (>65 o discapacidad>=33), máximo300. ELA50%, máximo2000. Base y límite se reparten conjuntamente. Otros beneficiarios requieren composición; no sumar llamadas como si cada una dispusiera del límite entero.
- La Rioja cuotas agrarias: constitución ley19/1977, certificado anual y pagos propios; límite100 por contribuyente.
- Galicia especial interés: objeto exclusivo, declaración ley2/2024, constitución/ampliación, pagos y base consumida histórica exhaustiva por entidad;20% sobre restante hasta10000. No incorpora requisitos de escritura o permanencia de otros apartados.
- Galicia donaciones I+D+i: centros universitarios gallegos o promovidos/participados por Galicia, finalidad, pago monetario y comunicación ATRIGA1–20 enero2026;25% limitado a10% de la cuota íntegra autonómica identificada expresamente como magnitud necesaria. Entidades ley49/2002 y condición2.83 quedan como siguiente rama.

Todas las conjuntas quedan pendientes en esta API nueva. No se reserva dos veces la cuota ni se asume que el parcial sea deducción aplicada. Los hechos administrativos, titularidades del mínimo, parentesco, diagnóstico y documentos siguen pendientes de acreditación externa; las referencias documentales no certifican derechos. Las banderas específicas de exhaustividad e historia delimitan colecciones, no sustituyen elegibilidad.

La matriz y `citas.json` crean identificadores propios por código, con referencia al registro/cita original, documento, SHA256, URL y localizador. No copian cuerpos CAS. Se conservan las conclusiones posteriores de las revisiones leídas. En incendios está recuperada la cadena RDL10/2026 y convalidación, efectos26/8/2025 y siniestros23/6–25/8 con acuerdo estatal: resta clasificación particular, no contraste del texto histórico. No todas las ayudas gallegas están exentas. No se repite la auditoría favorable ni F general.

## Verificación del candidato

Turno PESADO2 autorizado y finalizado. Pasan79 tests Vitest4.1.5 con maxWorkers=1, tipos estrictos TypeScript5.9.3 con configuración completa de diagnósticos EffectLS0.85.1 (cero diagnósticos), Oxlint1.78.0 con las16 reglas anti-slop y un hilo (cero diagnósticos), y ESLint9.39.4 sobre módulo/pruebas (cero errores y avisos). Las herramientas proceden de las dependencias fijadas de la raíz. No se usa bunx ni se instalan versiones alternativas. Prettier3.8.3 fijado en raíz aplicó formato.

Los controles negativos reproducen effect(globalDate), y anti-slop no-unknown-parameters/no-runtime-typeof: los plugins están activos. Los rojos de autor conservados privadamente son13 casos de identidad o coherencia temporal, además de dos diagnósticos iniciales de tipos. Se corrigieron autoidentidades de cónyuge/mínimo/acogedor, pagos a sí mismo, descendientes incoherentes, acogimiento anterior al nacimiento o posterior a adopción previa, historia de contratos, base histórica consumida superior al máximo y doble constitución. La validación civil usa calendario gregoriano sin construir Date; una guardia booleana de colecciones conserva sus tipos readonly.

El orden entre reparto y límite tiene discriminantes numéricos propios. Para deporte y ELA la norma citada reparte las cantidades y el límite: min(importe*porcentaje, límite)/titulares equivale a min(importe/titulares*porcentaje, límite/titulares). Ejemplo ELA10000, dos titulares: min(5000,2000)/2=1000. Bicicletas limita50 por vehículo y después divide por dos en gananciales; dos bicicletas alcanzan100/2=50. Cuotas agrarias tiene máximo personal100: se agregan75+75 del mismo solicitante antes de limitar a100; los pagos de otra persona se rechazan, sin dividir el máximo. Especial interés conserva una base acumulada10000 por entidad y por solicitante; dos entidades con base agotable independiente pueden producir4000. No se ha reproducido un error de aplicar un máximo personal antes del reparto en estas diez reglas.

Se mantiene acreditación externa pendiente. Esta validación es de autor sobre el candidato aislado: no equivale a revisión fiscal independiente, CI de integración ni aceptación de las49 deducciones. Continúan pendientes las38 siguientes ramas de la matriz, conjuntas y composición anual/de límites de varios beneficiarios. No se añadieron fórmulas de liquidación anual o de aplicación de cuota.

Los arneses, controles negativos, logs, primera versión del parche y verificador del MANIFIESTO permanecen exclusivamente en la carpeta privada de validación, fuera del parche. Ningún script publicado depende de ese manifiesto privado. El padre puede ejecutar después de integrar, con dependencias de raíz y un turno asignado:

```
timeout -k 30s 5m node node_modules/vitest/vitest.mjs run tests/galicia-rioja-hechos-2025.test.ts --maxWorkers=1
timeout -k 30s 8m node node_modules/typescript/bin/tsc --noEmit --incremental false
timeout -k 30s 5m node node_modules/oxlint/bin/oxlint --threads=1 --disable-nested-config lib/dominio/irpf/deducciones/galicia-rioja-hechos-2025/index.ts tests/galicia-rioja-hechos-2025.test.ts
timeout -k 30s 5m node node_modules/eslint/bin/eslint.js lib/dominio/irpf/deducciones/galicia-rioja-hechos-2025/index.ts tests/galicia-rioja-hechos-2025.test.ts
```

Las comprobaciones de publicación del proyecto corresponden al padre. Esta entrega no realiza commits, push, PR, despliegue, LFS, instalaciones, worktrees ni mutaciones en la raíz. El parche solo añade módulo, pruebas y documentación. Manifiesto y parche permanecen en la entrega privada. No se escribió código Effect; la reexportación no altera el evaluador existente.
