# Validación de autor · ampliaciónE2025

El candidato corregido pasa184 tests focales con maxWorkers1; los38 casos monetarios iniciales conservan sus esperados y ahora comprueban también el racional exacto. Tipos estrictos TypeScript5.9.3 y configuración completa de diagnósticos EffectLS0.85.1 de raíz: cero diagnósticos. Oxlint1.78.0:12 archivos,16 reglas anti-slop,un hilo,cero diagnósticos. ESLint9.39.4:12 archivos,cero errores/avisos. La prueba negativa de Effect produce globalDate y la de anti-slop produce dos diagnósticos esperados: los plugins están activos.

Resultado de autor, no revisión independiente de las38 ramas, aceptación fiscal, integración anual ni cierre del punto4. Documentos y derechos particulares siguen pendientes. Se conserva el alcance de las diez ramas anteriores y su limitación de pagos propios; no se importa su carpeta privada retirada.

## Rojos conservados y correcciones

Los109 tests preparados pasaron antes de ampliar los adversos. La primera tanda nueva reprodujo25 fallos sobre139 tests. La segunda reprodujo cuatro fallos adicionales sobre184. Se conservaron logs, parche y manifiesto originales, además de una reproducción aislada de la fórmula anterior de cobertura. Los dos diagnósticos de tipos iniciales correspondían a conversiones inválidas en fixtures negativas; se sustituyeron por mutaciones locales intencionadas de datos tipados en el test, sin alterar esperados. ESLint detectó además un `let` innecesario.

| Área | Corrección y discriminante |
| --- | --- |
| Hijo/progenitor/titular | Rechaza hijo idéntico a progenitor o titular de su mínimo, evento vacío, ordinal inválido del otro progenitor, cuidado por progenitores no identificados y derecho repartido a terceros. |
| Cronología | Rechaza cuidado anterior al nacimiento, adopción anterior al nacimiento y contradicción entre convivencia y periodos. Los contratos sucesivos de arriendo tienen que acreditar vacío máximo6meses y duración acumulada3años. |
| Conciliación | Rechaza pagos/facturas duplicados entre inmuebles o entre obra/certificado y pagadores no identificados en el ámbito económico de la rama. El rechazo del tercero pide atribución documental, no proclama una exclusión tributaria universal. |
| Inversión | Recibe participación propia y familiar separadas; propia no puede exceder familiar. Préstamo sin participación propia no hereda sin más el límite de capital familiar. No trata amortización de garantía como amortización de préstamo. |
| MAB | Dos instantáneas de participación propia del mismo emisor/fecha no pueden ser contradictorias. No se suman porcentajes como si cada uno fuera incremento adquirido. Cambios entre fechas requieren historial de emisor que esta rama aún rechaza expresamente, sin generar cero. |
| Vivienda riojana | Resta cobertura común antes de atribuir propiedad; exige ejercicio fiscal realmente anterior2013 cuando se invoca aquella deducción y distingue modalidad de adquisición de adecuación. Cobertura superior al interés del expediente se rechaza. |
| Vehículo | Concilia precio con contraprestación y saldo financiado documentado. La base es adquisición, no una cuota de caja arbitraria del préstamo; contraprestación superior al precio se rechaza. |
| Magnitudes/pendientes | Rechaza magnitudes ajenas o duplicadas, incluso ajenas no utilizadas en la fórmula, y consumos negativos. Centro/situación agraria desconocidos no se convierten en deducción cero. |

## Esperados y fundamento primario

No se cambió ningún esperado monetario inicial para conseguir verde. Las38 parejas código/esperado se cotejan contra el parche de fase ligera. Se enriquecieron fixtures con participación propia, ejercicio fiscal de la deducción previa y saldo/contrato de financiación para cerrar el contrato; las fronteras familiares siguen usando los mismos valores monetarios, con participaciones propias compatibles con las familiares.

Los nuevos discriminantes monetarios se fijaron desde las citas primarias ya auditadas del loteE; la revisión favorable no se ha repetido:

- Préstamo sin participación propia: [`galicia_inversion_entidades_nuevas_financiacion-regla-4`](../lotes/e/dictamenes.json), art.5.Diez.1.a del [texto gallego2025](https://www.boe.es/buscar/act.php?id=BOE-A-2011-18161&p=20251231&tn=1). La regla distingue expresamente la ausencia de participación del contribuyente de los límites aplicables cuando existe. Préstamo1000,patrimonio10000,participación propia0,familiar50:30%=300 dentro del alcance ordinario y restantes requisitos.
- Cobertura: `rioja_inversion_vivienda_jovenes_menores_36-regla-1`, art.32.11 del [texto riojano2025](https://www.boe.es/buscar/act.php?id=BOE-A-2017-13750&p=20251230&tn=1). Se minoran los intereses por cobertura. El contrato define los importes como expediente común:intereses1000−cobertura200,propiedad1/2,15%=60. La versión anterior restaba200 de la mitad500 y daba45. El adverso inicial se precisó para identificar el pago como intereses, conservando el esperado60; una reproducción controlada de la resta antigua sobre esa fixture válida produce45 y falla. No es un oráculo derivado del candidato.
- Vehículo: `rioja_vehiculos_electricos_nuevos-regla-0` y las condiciones de ese mismo apartado32.7:15% del importe de adquisición. Precio20000,contraprestación1000 y saldo de precio19000 respaldado por contrato:15%=3000,limitado a300. No se usa1000 como si fuese todo el importe de la adquisición. El caso inicial precio1000 sin saldo conserva150.
- Arriendos: `galicia_arrendamiento_viviendas_vacias-regla-7`, art.5.Veintitrés.4: permite sustitución con vacío máximo6meses y duración acumulada3años. Se prepara y ejecuta un positivo con cadena y un rechazo con vacío6meses+1día. En este contrato los intervalos de arriendo usan `hasta` como límite exclusivo; la vacancia empieza en ese límite. Los calendarios de convivencia usan extremos inclusivos. No se intercambian ambas representaciones sin normalizar.

Los IDs anteriores resuelven documento/hash/localizador en el índice auditado. El expediente privado conserva los cuatro pasajes y sus metadatos para reconstruir estos adversos. No contiene originales CAS.

## Cobertura y límites

Las184 pruebas incluyen un positivo monetario, identidad/ámbito y racional exacto por cada uno de los38 códigos, además de adversos de calendario,renta,porcentajes,identidad,pagadores comunes,conciliación y magnitudes anuales. La cifra no significa que todos los hechos particulares o combinaciones posibles estén certificados.

Permanecen las condiciones concretas de la matriz: composición anual de bases/cupos nominados, aplicación de cuota y sus remanentes, seguimientos de permanencia/empleo y acreditación externa. Continúan rechazados el cuidado gallego con titulares distintos entre hermanos bajo máximo común, acogimiento riojano con cumplimiento18 o agregado especial de cortos>90 y MAB con participaciones variables sin historial modelado. No se sustituyen estas ramas por cero. El incremento por innovación se mantiene en capital sin extensión analógica a financiación. Los pagos terceros requieren su atribución, no eliminación silenciosa para fingir expediente completo.

PESADO2 finalizado y liberado. Una suite a la vez bajo timeout -k30s, sin inventario/CI global, subdelegación, VCS mutante, dependencias instaladas, copias de repositorio o cambios en raíz. Todos los arneses y logs son privados, con herramientas fijadas de raíz y caché Vite fuera de la entrega. Scripts dependientes del manifiesto permanecen fuera del parche.
