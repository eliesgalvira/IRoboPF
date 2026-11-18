# Diagnóstico aritmético de pensiones ordinarias 2025

Estado: pendiente, sin cambio de motor. La predicción original andaluza permanece en −323,72 € y la observación de Open en −323,71 €. Madrid conserva 465,24 €. Las fronteras de 65/75 años repiten esos patrones monetarios; no añaden discriminación aritmética ni se incorporan a métricas. Se preservan 76/80, 4/4 y 1/2; los cuatro arrendadores conocidos siguen pendientes.

El arnés `tools/procedencia/simuladores/pension432.mjs` ejecuta la API explícita y coteja bases, reducción, componentes, rastro, retenciones y resultado contra las predicciones congeladas. Extrae de los PDF originales las casillas monetarias con el lector acotado existente y verifica sus hashes. Comprueba neutralidad de identificadores y retenciones. Los hechos externos de pensión ordinaria, ausencia de DT2, empleo, otros pagadores, rentas y derechos no se infieren de la edad. Este cotejo focal no sustituye la revisión documental independiente de SES, readbacks y exclusiones.

POST es un contrafactual añadido, no una predicción previa ni una salida nueva del motor: reutiliza `cuantizarAnual` para redondear cada gravamen completo HALF_UP a céntimos, restar mínimos, sumar cuotas y deducir retenciones. Reproduce las casillas 0528–0533, 0595 y 0670 de los cuatro PDF. El neto disponible auxiliar es bruto menos cuota; se etiqueta como derivación, pues no es un campo de la API. El rastro real conserva sus componentes PRE y no se sustituye por el contrafactual.

La objeción más fuerte es que redondear las dos cuotas netas antes de sumarlas también reproduce los cuatro resultados. Los mínimos observados no separan esa alternativa de redondear cuatro gravámenes. Una adversa sintética calculada con el núcleo de escalas existente (base 11.457 €, mínimo 6.700,05 €, tipo 9,5 %) produce respectivamente 451,92 € y 451,91 €: demuestra que las hipótesis no son equivalentes, pero no identifica cuál usa Open. No es un caso observado, ni implica derecho real a ese mínimo. El intercambio explícito es conservar el desfase conocido hasta disponer de evidencia discriminante, en vez de extender una regla compatible pero no identificada. No interviene el coste en ninguna decisión fiscal.

La API canónica no admite este contrato de pensión ordinaria con hechos y cotizaciones efectivas; convertirlo en una entrada salarial estimada comprobaría otro alcance. Sólo se ejecuta la API explícita. No se selecciona política por ID, edad exacta, territorio, importe ni epsilon; no se cambia el motor ni se extiende una regla a pensiones, mezclas, DT2, familiares u otros ejercicios.

Siguiente paso propuesto, sin ejecutarlo: identificar una referencia original ya disponible cuyos gravámenes y mínimos distingan ambas hipótesis; si no existe, preparar separadamente evidencia discriminante preregistrada y revisada antes de modificar la política. No hay capturas ni casos métricos nuevos en esta entrega.

Reproducción focal con Bun 1.3.13 y las dependencias existentes del producto:

```text
timeout -k 5s 90s bun tools/procedencia/simuladores/pension432.mjs . resultado.json
```

El tercer argumento opcional señala una raíz de evidencia externa con `docs/procedencia/simuladores/pensiones-fronteras-2025`. El informe generado sólo contiene rutas relativas de evidencia. La ejecución verificada de cuatro casos utiliza esa opción; sin ella comprueba los dos casos públicos. No se ejecutaron CI global, inventario ni publicación.
