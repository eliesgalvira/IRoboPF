# C300: cierre salarial y extensión oficial adicional

Red terminada. PESADO2 liberado y congelación de cuatro fuentes liberada al padre. No commit, bookmark, push, PR ni cambios lib/CI por este agente. El padre integra P2 journal y completa la única revisión independiente.

## Salario Madrid2025

300 entradas completas distintas, 300 capturas aceptadas por verificadores SES/PDF y 300 entradas admitidas por API pública: **3.550 casillas iguales, 650 ausencias oficiales, cero diferencias**. Ausencia nunca equivale a cero; no es aceptación fiscal universal. Cobertura por caso y ausencia: `salario-300-resumen.json`. Recargas y recibos repetidos no aumentan los 300.

Corte cerrado `closed-c300-final`, journal SHA256 `239c2920a279deee750eebccf43dafce1ad9954c1ad7a83b9fade28c39cbcb4c`, íntegro antes/después del cotejo. Operador: base `8584afe2f8448b7491556aa99827168a009433eb`, candidato más inventario real, no commit limpio. Inventario `9e0cbb241f5e77d55458b6d3cb61a099f70c136c3744a794e3cdeb4875647d77`. Recibo completo/inventarios/dependencias en estado externo; SHA y rutas en los resúmenes.

La revisión independiente del corte218 encontró cuatro discrepancias art20 (016/017/047/057). Padre corrigió el núcleo; las 300 se reevaluaron sin nuevas capturas por motor. El resultado final anterior conserva las expectativas originales y no muestra aquellas diferencias. P2 compare/journal queda para integración por el padre: este cierre usó una copia cerrada con longitud/hashes fijados, sin reparar el journal original.

## Extensión adicional

Una entrada oficial distinta de Andalucía, formulario nuevo por UI, con SES/PDF y metadatos verificados: **5 casillas iguales, 2 ausencias, 7 diferentes**. Resultado Open `101.04`, motor presentado `101.03`; componente sin presentar `101.0344`. Las diferencias exactas, entrada completa y hashes SES/PDF están en `discrepancias-extras.json`; no se aplica tolerancia ni se cambia lib para ocultarlas. Su operador tiene identidad propia en `variante-andalucia-comparacion.json`.

Las otras once variaciones (cinco territorios y seis familiares) sólo están preparadas. No se cuentan como Open ni coincidencias. La sonda UI observó el formulario identificativo, comunidad y secciones de hijos/descendientes; no capturó una familia. Para continuar: introducir descendientes por grupos de edad, comprobar vínculo/custodia/rentas y sus campos SES, fijar identidad independiente y comparar cada variación. Se cierra ahora por mandato del coordinador, sin retrasar C300 por ese trabajo mayor. Scripts provisionales `variants.py`/`family_probe.py` externos, no incorporados a las cuatro fuentes revisadas.

## Reproducción y garantías

Cuatro archivos candidatos en `entrega.patch`, preservados por hash en `cuatro-congelados-cas.json`. Capturas históricas conservan su clave/código originales verificables en CAS; no se reetiquetan como ejecutadas por el código corregido. `--pending-only` valida históricos y ejecuta pendientes. CAS/journal/errores originales permanecen intactos; campos no examinados se registran como reservas, sin volver a acreditación universal.

Órdenes de captura por bloques: `timeout -k 30s 45m python tools/procedencia/simuladores/c300.py capture --pending-only --limit 60`, con entorno cargado dentro del timeout. Un navegador y una operación fiscal remota simultáneos; pausa >=2s; timeout por caso5m con kill30s. Bloques completos guardados y reanudados. No se ejecutó histórico2018–24/2017/PADRE ni semilla2020. Todos los originales/grandes permanecen en CAS/estado externo, sin repositorios/dependencias/cachés copiados en la entrega.

Cinco métodos focales locales verdes, selección histórica real verificada sobre86 capturas antes de reanudar, más validación real de300 capturas al cerrar. No se repitieron suites generales. Se preservan los errores iniciales de selectores/avisos/ausencias/campo nuevo y un arranque offline prematuro del comparador, corregido tras cerrar la copia; no se cuentan como discrepancias monetarias ni casos nuevos. CI completo y revisión independiente pertenecen al padre.
