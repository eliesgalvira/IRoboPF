# Corrección de E-REV-01

4 de noviembre de 2026. Corrección del integrador posterior al dictamen de
[revisión independiente](REVISION.md). El dictamen original se conserva como
evidencia del defecto; este documento registra su corrección y no sustituye
el [contraste independiente posterior](CONTRASTE-PRECISION.md).

La composición crea un constructor Decimal local con la precisión del
productor. Antes, los helpers de escalas todavía operaban con constantes y
`min/max` del constructor global, de 20 cifras. Ahora reciben el constructor
seleccionado y convierten sus operandos antes de calcular. Se propaga por
cuotas fijas, excesos, acumuladores, desgloses, componentes del ahorro,
remanentes y atribuciones de mínimos familiares. La suma del mínimo y la
simulación estatal también parten de ese constructor local.

Los helpers conservan el constructor global como valor predeterminado para
los consumidores que no declaran aritmética. No se modifica la configuración
global de Decimal. El productor técnico continúa con 20 cifras; el efectivo
con 80 y con las cuantizaciones Open explícitas existentes. No se amplían
los hechos familiares admitidos ni los ámbitos efectivos y no se modifica
ninguna expectativa monetaria de los casos Open.

## Regresiones

- Se reprodujo el rojo original: 25 de las 26 pruebas independientes pasaban.
  El caso E-REV-01 y sus dos aserciones exactas permanecen intactos. Para que
  el archivo de revisión pase lint, se sustituyen cuatro spreads condicionales
  en la preparación de otros casos por selecciones explícitas de propiedades;
  se conservan todos sus hechos y aserciones. El archivo original queda en
  el respaldo de revisión para cotejar esta adaptación.
- La misma prueba ahora obtiene exactamente
  `570.011728394956172839495617283949561728394955` y
  `510.010493827066049382706604938270660493827065` en los gravámenes de la
  base sintética documentada por el revisor.
- Tres pruebas adicionales comprueban cuota fija frente a tramos,
  remanentes del ahorro con constantes del constructor global y el reparto
  periódico entre siete titulares. Comprueban también la conservación de
  la precisión global y el resultado predeterminado antes y después de
  usar el constructor de 80 cifras. El censo de siete titulares es una
  entrada sintética del contrato, no una acreditación jurídica del caso.
- La ejecución conjunta de revisión, precisión, composición y vertical
  salarial termina con **94/94 pruebas correctas**. Las dos nuevas suites
  quedan enumeradas tanto en el script local de CI como en el workflow.

El censo actual de fuentes y el inventario se regeneran tras el cambio.
No se regeneran certificados históricos ni se promueve aceptación fiscal.
El CI completo local termina con 582 pruebas Vitest y 167 Python correctas,
además de lint y tipos. El contraste independiente aprueba E-REV-01 y aporta
cuatro pruebas más, correctas e incorporadas al CI. Véase el [cierre técnico](CIERRE.md).
