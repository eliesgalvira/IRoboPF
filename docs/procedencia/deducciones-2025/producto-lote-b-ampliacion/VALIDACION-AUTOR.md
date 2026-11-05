# Validación de autor de la ampliación B

PESADO2 finalizado:81 pruebas Vitest correctas en dos archivos con un worker y fileParallelism=false;tipos estrictos con diagnósticos Effect,Oxlint/anti-slop y ESLint focales correctos. Se usaron la configuración y dependencias fijadas de raíz,el entorno compartido env-pruebas.sh y timeout -k30s en cada orden. Sólo se ejecutó un comando pesado a la vez. No se modificaron raíz ni inventarios ni se instalaron paquetes.

## Oráculos originales conservados

Los37 casos de oraculos-37.json permanecen idénticos byte por byte. SHA-256 antes y después:

`a3533e782200bc0eea658cd434d46b51339d45dd4c7af1740b9da07de14b9afb`

La prueba de preservación privada registra tamaño,hash inicial y final;el manifiesto sella el resultado. No se cambiaron importes esperados de los37 casos originales para hacer pasar validaciones. Las74 pruebas iniciales ya pasaban. Se añadieron7 discriminantes y se conservan el parche y manifiesto anteriores a esta validación.

## Rojos y correcciones

La pasada de discriminantes produjo4 rojos y77 verdes de81;rojo-discriminantes.log conserva esa ejecución.

| Defecto reproducido | Corrección |
| --- | --- |
| El mismo ID de pago aparecía en dos arrendatarios y podía contarse dos veces | Validación de unicidad sobre todos los pagos de la solicitud de alquiler,antes de repartir y sumar |
| Vivienda vacía alquilada en2025 con adquisición/usufructo fechado en2026 generaba cuantía | Contrato documental y título fechado no posterior al inicio del alquiler |
| Adopción del acogido con fecha imposible se interpretaba como exclusión y daba cero parcial | Validar fecha civil,posterior al nacimiento y observable hasta31/12/2025 antes de comprobar incompatibilidad;parentesco inválido también se rechaza |
| Racional negativo de ayuda ELA integrada en base liquidable generaba importe negativo | Rechazar magnitud negativa sin devolver importe |

Los otros tres discriminantes añaden controles positivos y negativos:dos pagos distintos pueden compartir factura sin perderse;una cuota de otra persona no suple la del beneficiario;un titular de guardería debe figurar entre los progenitores del hijo. Permanecen las fronteras y oráculos anteriores. El resultado tras corregir y formatear es81 pruebas correctas;no se eliminaron ni relajaron los rojos.

Tipos estrictos/Effect y Oxlint pasaban ya inicialmente. ESLint detectó un import total no usado;se conservó el log fallido,se retiró el import y el control final pasó con max-warnings=0. ESLint conserva dos mensajes de arranque por no existir React/pages en la carpeta privada;no son diagnósticos de archivos ni exenciones de reglas. No se desactivó ninguna regla.

## Ejecución y límites

El harness privado resuelve el módulo previo canónico desde raíz,mediante alias de Vitest y rootDirs de TypeScript. No depende de la primera carpeta privada ni de la carpeta de corrección ya retirada. Se emplearon Vitest4.1.5,TypeScript5.9.3,Oxlint1.78.0 y ESLint9.39.4 de raíz. La configuración de tipos hereda los diagnósticos Effect de raíz y desactiva incremental para no crear cachés. Oxlint incluyó ambos plugins anti-slop y threads1;ESLint usó eslint.config.mjs de raíz,sin caché. Los comandos,logs y hashes quedan en la validación privada.

Los controles finales fueron secuenciales y correctos;el verificador Python comprueba además cobertura48/37,tres dependencias,37 oráculos,53 concejos,imports y hashes. No se ejecutaron inventario ni CI global y no se ocupó PESADO1.

Se mantienen los límites de ALCANCE.md y matriz-48.json:mes partido al cumplir3/26 años,colectivos personales mixtos en conjunta,algunas remisiones societarias/finalidades análogas y condiciones futuras de residencia/participación/empleo. Son pendientes concretos de ramas,además de la conexión común de cuota/históricos. La revisión independiente y la aceptación fiscal no se atribuyen a estas pruebas. Validar81 casos no certifica todos los expedientes ni cierra por sí solo el punto4.

PESADO2 queda liberado. Esta validación no inicia otro encargo.
