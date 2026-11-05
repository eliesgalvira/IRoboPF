# Candidato acotado: registro familiar balear2025

Se amplía `FamiliaC36.hechos` de ambas entradas ejercicio2025, sin nuevos evaluadores ni bases fiscales públicas. Pendiente ejecución y primera revisión independiente monetaria; no declarar cerrado el código completo.

## Nacimiento múltiple

`registroPartoMultiple?: {documento, nacidos:[{persona, fechaNacimiento, secuenciaParto}]}` aporta secuencia física de nacimiento acreditada por certificado literal. Sólo se consulta en empates de fechas. Incluye exactamente los hijos con mínimo del censo anual que empatan; secuencias enteras consecutivas1..N por fecha, IDs únicos, DOB igual al núcleo y vínculo natural, todos2025. No es el número de orden fiscal; éste resulta de todos los hijos con mínimo, la fecha y esa secuencia. El censo de personas y descendientes existente sigue siendo obligatorio. Sin empates no se exige registro y se conserva el comportamiento publicado; aportar entonces este registro se rechaza.

Supuesto explícito del corte: los hijos empatados del mismo contribuyente son un mismo parto documentado y la certificación acredita la secuencia de todos ellos; no hay hijo intermedio excluido del mínimo. La norma y AEAT fijan cuantías por orden y censo con mínimo, pero no prescriben un algoritmo de desempate informático. No inferir secuencia del ID, orden del array, número de asiento o fecha de inscripción. Sin certificado apto, con empate histórico/adoptivo, secuencia duplicada/incompleta o persona ajena se rechaza. La referencia documental no autentica su contenido.

Se mantiene el registro de anticipos de nacimiento completo y vacío. Cobros positivos siguen rechazados por falta de regularización. Se reutiliza reparto del evaluador existente y prioridad/consumo de cuota anual. No se implementa nueva regularización ni abono.

## Adopción única

`filiacionAdopcion?: {hijo, fechaConstitucion, documento, censo:"completo_al_constituirse", progenitoresPrevios:string[], conyugesOParejas:string[]}` identifica exhaustivamente filiación anterior y cónyuges/parejas del adoptante al constituirse la adopción; listas vacías son afirmaciones documentadas, no inferencias de individual. Intersección de las listas implica exclusión del art6quater.8. No son un campo booleano de elegibilidad ni nuevos titulares del mínimo. Si `persona.progenitorPrevio` existe debe figurar en el censo. Todos los IDs deben ser no vacíos, únicos por lista y distintos del hijo y contribuyente.

Adquiere cálculo únicamente el censo anual con un solo descendiente/hijo solicitado, un solo progenitor adoptante y titular del mínimo, constitución e inscripción2025 concordantes con v4, expediente y convivencia válidos, sin ayudas incompatibles. La base y cuota proceden de la composición. Adopción no requiere residencia balear2024: no se traslada el requisito de nacimiento. La filiación prevalidada permite usar el evaluador existente sin confiar en sus valores internos no aplicables de pareja.

No se exige libro de anticipos a adopción: el art6quater no prevé el abono anticipado del6ter.6. Aportar `registroCobrosNacimiento` en esta rama se rechaza incluso vacío, para evitar confusión de prestaciones. Quedan fuera otros hijos, segundo adoptante, orden adoptivo histórico, conjunta/fallecimiento y regularizaciones. El censo previo de cónyuges/parejas sólo acredita hechos del vínculo, no renta ni derecho fiscal de un tercero. Insuficiencia de cuota aplica el límite existente; no tramita ni calcula un abono administrativo.

Los dos registros nuevos se rechazan en códigos ajenos. No se afirma validación de hechos/documentos externos ni cierre universal.

## Esperados independientes

Arts6ter.1/6quater.1: primer hijo800, segundo1000. Gemelos elegibles, ambos naturales y del mismo parto2025:800+1000=1800; dos progenitores en individual:1800/2=900; renta superior52800:1800/2=900. Con cuota700 se aplican700, sin producir1100 de abono. Adopción única elegible:800; cuota300 limita a300. Base total33000 admite800;33000.01 queda fuera (familia ordinaria). Exclusión por hijo de pareja y registros adversos rechazan; no se convierten en deducción cero. Las pruebas no importan cuantías normativas del motor.

Fuentes oficiales originales en CAS externo: ver `fuentes.json` de la entrega. BOE-A-2014-6925 versión24/7/2025 arts6ter y6quater, y Manual práctico Renta2025 Parte2 páginas HTML por nacimiento y adopción. Diferencia legal esencial: nacimiento reparte por progenitores aunque sólo uno tenga derecho; adopción por contribuyentes con derecho. Por ello la adopción de dos adoptantes se mantiene fuera de este corte.
