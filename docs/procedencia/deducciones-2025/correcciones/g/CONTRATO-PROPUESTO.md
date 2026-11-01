# Datos que debe absorber el contrato común

Esta propuesta responde a la reforma de motor único. No añade un evaluador valenciano ni adopta como API definitiva el auxiliar integrado posteriormente en `c5c6988d75b9f9fbe1c0f45828871bdf04a90017`.

El módulo regional expone una sola colección de 40 objetos explícitos. Se retiran las cuatro exportaciones intermedias y la agrupación `PENDIENTES_IMPLEMENTADAS`, sin referencias externas detectadas en lib/tests. Se eliminan las llamadas a los dos constructores genéricos y sus valores reemplazados. No se borra ningún archivo. Los datos descriptivos que siguen siendo adecuados usan los campos existentes; su forma no limita las reglas que debe representar el motor. Su estado es `normalizada_pendiente_tests`, porque no existe aquí una fórmula fiscal completa validada.

[Hechos por código](hechos-calculo.json) entrega parámetros, condiciones, reparto, concurrencia, evidencia y carencias. Son requisitos de integración, no una segunda API ejecutable. Los identificadores de personas deben ser sintéticos en pruebas. Fechas, intervalos, contribuyente, ejercicio, modalidad, bases, cuotas y titulares deben ser explícitos. Gastos, ayudas y bases se suministran por concepto y pagador; no mediante un importe final libre o un booleano global de cumplimiento.

El propietario común debe representar:

1. Valores monetarios decimales exactos y porcentajes como parámetros con unidad, periodo de efecto, código de origen y citas del artículo/apartado correspondiente. Separar base de inversión, base máxima, límite de deducción y cuota disponible.
2. Hechos con su evidencia: evento/resolución, fechas, identidad de titulares, parentesco, convivencia/dependencia, edad, discapacidad y certificado; contrato/adquisición/instalación, concepto de gasto, pago, ayuda, reembolso y calificación administrativa. Una respuesta «cumple» no los sustituye.
3. Reglas temporales por devengo, incluidas las posteriores con efectos expresos en 2025. No inferir vigencia de una fecha solicitada en una URL ni del título anual.
4. Una sola secuencia por código: validar hechos y documentos necesarios; determinar régimen temporal; formar base neta admisible; aplicar porcentaje e importes; reducción de renta al objeto legal correcto; reparto y concurrencia; cuota y, cuando proceda, saldo con año de origen/caducidad. El orden concreto debe obedecer al apartado, no a un pipeline universal supuesto.
5. Resultado con cada valor derivado, operación, entradas utilizadas, parámetros y citas. Falta de hechos o cadena normativa abierta debe producir diagnóstico explícito; no cuota cero ni aceptación de un importe libre. Los saldos de arrastre deben indicar si proceden de insuficiencia de cuota, sin inventar arrastre del exceso de base.

Las pruebas previas que aceptaban `:cumple`/`:importe` o multiplicaban ascendientes caracterizan exclusivamente `b95e56d6edc6c53ad68e41cd03e23ec85a6f073b`. Se retiran como expectativas del motor futuro; quedan el commit y los logs privados de reproducción. Las pruebas actuales comprueban normalización y hechos requeridos. No se atribuye aquel comportamiento sin más a la punta posterior ni se solicita mantener el puente del auxiliar de nueve deducciones.

La integración del contrato y la absorción/retirada de evaluadores y adaptadores compartidos exceden el ámbito de archivos G. Debe coordinarlas su propietario; esta entrega no introduce un puente regional ni cambia UI.
