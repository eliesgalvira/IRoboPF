# Trabajo y cotizaciones: correcciones acotadas

29 de octubre de 2026. Integración del orquestador, después de las contrarrevisiones de Seguridad Social y trabajo. No certifica una liquidación ni una nómina TGSS.

## Extremo de la reducción del trabajo

TDE-18: el artículo 20 excluye rendimientos previos desde 19.747,50 euros en la redacción aplicable desde 2024. La condición del motor incluía la igualdad. Tres pruebas fallaron antes del cambio; ahora se usan controles de 19.747,49, 19.747,50 y 19.747,51 en 2024, 2025 y el perfil técnico de 2026.

**Errata de los informes históricos:** el residuo calculado en el extremo es **+0,0028**, no −0,0028. Se verifica directamente: 2.364,34 − 1,14 × (19.747,50 − 17.673,52) = +0,0028. `revisiones/trabajo-deducciones-estatales/casos-verificados.json` conserva correctamente ese signo. No se reescriben los informes del autor y revisor. En 19.747,49, la expresión devuelve 0,0142. Esta corrección no adopta una política universal de redondeo ni acepta el ejercicio 2026 completo.

El cambio está en la función usada por el motor anual. Siguen pendientes las condiciones de otras rentas, gastos efectivos, distinción de empleo/pensión y deducciones anuales descritas en la contrarrevisión.

## Perfil analítico de cotizaciones

Se añade `calcularDesgloseCotizacionesPerfilUniforme`. Su entrada supone doce mensualidades uniformes, remuneración con prorrata de extras, año completo y perfil ordinario heredado. La función conserva explícitamente `redondeoTgss: pendiente`. Los tipos ordinarios heredados, incluido AT/EP del 1,5 %, no quedan certificados para cualquier ocupación, contrato, jornada o grupo. Tampoco se añaden mínimos por grupo ni tratamiento de horas extra.

- **SS-BASE-2018:** ESS/55/2018, artículo 2, y Ley 6/2018, artículo 130 y DF 46: máximos de 3.751,20 hasta julio y 3.803,70 desde agosto. La suma se hace por períodos; sustituirlo por un único tope medio sería incorrecto para remuneraciones intermedias. Con 45.240 anuales, la base analítica es 45.108,40; con 50.000, 45.276,90.
- **Solidaridad 2025:** Orden PJC/178/2025, artículo 17. Tipos empresa/trabajador de los tres tramos: 0,77/0,15 %, 0,83/0,17 % y 0,98/0,19 %.
- **Solidaridad 2026:** Orden PJC/297/2026, artículo 17: 0,96/0,19 %, 1,04/0,21 % y 1,22/0,24 %. No se reconstruye cada pagador con 5/6 y 1/6 del total.

Los originales, hashes, citas y condiciones están en `auditorias/seguridad-social/` y `revisiones/seguridad-social/`. La aceptación procede de las decisiones individuales de esa revisión, no de similitud con el Excel.

Cuatro pruebas del nuevo contrato fallaron cuando se delegaba al cálculo legacy. Después de implementar el perfil pasan esos casos, seis controles adicionales de los tres tramos y un control de conservación del contrato legacy. Con las tres pruebas TDE-18 y las tres de cotizaciones existentes son 17 pruebas correctas. Lint y typecheck pasan.

**Integración anual pendiente:** este módulo aún no sustituye la estimación legacy en la liquidación anual ni su rastro. Ese archivo lo está editando otro hijo; el orquestador realizará la conexión una vez recibida la entrega, con pruebas de integración y distinción explícita de modos. El oracle Python/Excel y la API legacy conservan su comportamiento histórico para poder observar discrepancias.

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bun run test tests/cotizaciones-perfil-uniforme.test.ts tests/reduccion-trabajo-procedencia.test.ts tests/cotizaciones-sociales.test.ts --maxWorkers=1
```
